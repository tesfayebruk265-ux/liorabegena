import React, { createContext, useContext, useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import { User, UserRole, AccountStatus, StudentRegistrationStatus, Notification } from '../types';
import { ABEL_BEGENA_PHOTO } from '../data/websiteData';
import { safeSetItem, cleanOversizedStorage } from '../utils/storage';
import { normalizeInstrumentName } from '../utils/studentEnrollment';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  notifications: Notification[];
  unreadNotificationsCount: number;
  isEmailJsConfigured: boolean;
  verificationEmailNotice: string | null;
  login: (emailOrPhone: string, password: string, rememberMe: boolean, preferredRole?: UserRole) => Promise<{ success: boolean; error?: string; status?: AccountStatus; role?: UserRole; unverifiedEmail?: string }>;
  registerUser: (name: string, email: string, phone: string, username: string, password: string, role: 'student' | 'parent' | 'teacher') => Promise<{ success: boolean; user?: User; error?: string }>;
  logout: () => void;
  verifyCode: (code: string, emailOverride?: string) => Promise<{ success: boolean; error?: string }>;
  resendVerificationCode: (emailOverride?: string) => Promise<{ success: boolean; error?: string; remainingSeconds?: number }>;
  sendTelegramVerificationCode: (sharedPhone: string, emailOverride?: string) => Promise<{ success: boolean; matched: boolean; code?: string; error?: string; registeredPhone?: string }>;
  forgotPassword: (emailOrPhone: string) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (code: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  updateProfile: (fields: Partial<User>) => Promise<{ success: boolean; error?: string }>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  getAuthoritativeUser: (idOrEmail?: string) => User | undefined;
  markNotificationAsRead: (id: string) => void;
  markAsRead: (id: string) => void;
  clearNotifications: () => void;
  markAllNotificationsAsRead: () => void;
  addNotification: (
    title: string,
    description: string,
    category?: Notification['category'],
    targetRole?: UserRole | UserRole[],
    targetUserId?: string,
    userEmail?: string
  ) => void;
  switchRole: (role: UserRole) => void;
  hasPermission: (requiredRole: UserRole | UserRole[]) => boolean;
  deleteStudentAccount: (studentId: string, email?: string, phone?: string) => void;
  registerOrUpdateStudentAccount: (data: { id?: string; email: string; fullName: string; phone?: string; instrument: string; level?: string; password?: string; status?: AccountStatus; studentStatus?: StudentRegistrationStatus }) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Initial preloaded notifications for rich evaluation
const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    title: 'Welcome to Liora Begena School',
    description: 'Explore the traditional learning dashboard and check your progress.',
    isRead: false,
    timestamp: '2026-07-21T09:00:00Z',
    category: 'system'
  },
  {
    id: '2',
    title: 'Syllabus Updated',
    description: 'The Begena level 1 practice manual PDF has been uploaded.',
    isRead: false,
    timestamp: '2026-07-20T15:30:00Z',
    category: 'lesson',
    targetRole: ['student', 'teacher']
  },
  {
    id: '3',
    title: 'Tuition Payment Received',
    description: 'Your registration invoice #2026-08 has been approved by the finance department.',
    isRead: true,
    timestamp: '2026-07-19T10:15:00Z',
    category: 'payment',
    userEmail: 'student@begena.com'
  },
  {
    id: '4',
    title: 'New Student Application Pending Review',
    description: 'A new student registration is waiting for staff verification in Hawassa Campus.',
    isRead: false,
    timestamp: '2026-07-21T11:00:00Z',
    category: 'registration',
    targetRole: ['registration_staff', 'accountant', 'admin', 'branch_manager', 'super_admin', 'founder']
  }
];

// Helper to filter notifications for the active user
function isNotificationForUser(notif: Notification, user: User | null): boolean {
  if (!user) return false;

  // If specific userId is targeted, match strictly on user.id
  if (notif.userId) {
    return notif.userId === user.id;
  }

  // If specific userEmail is targeted, match strictly on user.email
  if (notif.userEmail) {
    return notif.userEmail.toLowerCase() === user.email.toLowerCase();
  }

  // Otherwise, match on targetRole if present
  if (notif.targetRole) {
    if (Array.isArray(notif.targetRole)) {
      return notif.targetRole.includes(user.role);
    }
    return notif.targetRole === user.role;
  }

  return true;
}

// Helper to check if student identity has been permanently deleted
export function normalizePhoneNumber(phone: string): string {
  if (!phone) return '';
  let digits = phone.replace(/\D/g, '');
  if (digits.startsWith('251') && digits.length >= 12) {
    return digits.slice(3);
  }
  if (digits.startsWith('0') && digits.length === 10) {
    return digits.slice(1);
  }
  return digits;
}

export function isStudentDeleted(id?: string, email?: string, phone?: string, fullName?: string): boolean {
  try {
    const raw = localStorage.getItem('ab_deleted_students_v3');
    if (!raw) return false;
    const deletedList: string[] = JSON.parse(raw);
    if (!Array.isArray(deletedList) || deletedList.length === 0) return false;

    const cleanId = (id || '').trim().toLowerCase();
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPhone = (phone || '').replace(/\D/g, '');
    const cleanName = (fullName || '').trim().toLowerCase();

    return deletedList.some(item => {
      if (!item) return false;
      const cleanItem = String(item).trim().toLowerCase();
      if (cleanId && cleanItem === cleanId) return true;
      if (cleanEmail && cleanItem === cleanEmail) return true;
      if (cleanName && cleanItem === cleanName) return true;
      if (cleanPhone && cleanItem.replace(/\D/g, '') === cleanPhone && cleanPhone.length > 5) return true;
      return false;
    });
  } catch {
    return false;
  }
}

// Helper to verify if student has completed both registration and tuition payment
export function isStudentAccessGranted(user: User | null): boolean {
  if (!user) return false;
  // If student account is permanently deleted, block access completely
  if (isStudentDeleted(user.id, user.email, user.phone, user.fullName)) return false;

  // Non-students (Teachers, Staff, Admins, Branch Managers, Accountants, Parents) have administrative/system access
  if (user.role !== 'student') return true;

  // Explicit completion flags
  if (user.isRegistrationCompleted && user.isPaymentCompleted) return true;

  // Active verified enrollment status
  if (user.studentStatus === 'Enrollment Active' || user.studentStatus === 'Approved') return true;

  // Check if student has active enrollment record in ab_enrollments_v4 or ab_students_v3
  try {
    const savedEnrs = JSON.parse(localStorage.getItem('ab_enrollments_v4') || '[]');
    const hasActiveEnr = Array.isArray(savedEnrs) && savedEnrs.some((e: any) =>
      e && e.status === 'Active' && (
        (e.studentId && user.id && e.studentId === user.id) ||
        (e.studentEmail && user.email && e.studentEmail.toLowerCase() === user.email.toLowerCase()) ||
        (e.studentName && user.fullName && e.studentName.toLowerCase() === user.fullName.toLowerCase())
      )
    );
    if (hasActiveEnr) return true;
  } catch {}

  // Check for locked statuses
  const lockedStatuses: StudentRegistrationStatus[] = [
    'Account Created',
    'Profile Incomplete',
    'Application Submitted',
    'Payment Pending',
    'Payment Under Review',
    'Application Under Review',
    'Correction Required',
    'Rejected'
  ];

  if (user.studentStatus && lockedStatuses.includes(user.studentStatus)) {
    return false;
  }

  return user.status === 'Active';
}

// Helper to define static mock users representing all Roles
const MOCK_ACCOUNTS: Record<string, User & { password?: string }> = {
  // 1. Parent (Linked to a child)
  'parent@begena.com': {
    id: 'u_parent_1',
    email: 'parent@begena.com',
    phone: '+251933333333',
    role: 'parent',
    status: 'Active',
    fullName: 'Tariku Eshetu',
    avatar: '',
    verified: true,
    language: 'en',
    notificationPreferences: { email: true, sms: true, push: false },
    linkedChildren: [],
    password: 'Password123!'
  },
  // 4. Teachers
  'teacher@begena.com': {
    id: 'tch_abel',
    email: 'teacher@begena.com',
    phone: '+251944444444',
    role: 'teacher',
    status: 'Active',
    fullName: 'Lique Mezemer Bruk Tesfaye',
    avatar: '',
    verified: true,
    language: 'en',
    notificationPreferences: { email: true, sms: true, push: true },
    password: 'Password123!'
  },
  'alex@begena.com': {
    id: 'tch_alex',
    email: 'alex@begena.com',
    phone: '+251 922 234 567',
    role: 'teacher',
    status: 'Active',
    fullName: 'Seyfu T.',
    avatar: '',
    verified: true,
    language: 'en',
    notificationPreferences: { email: true, sms: true, push: true },
    password: 'Password123!'
  },
  'hayle@begena.com': {
    id: 'tch_hayle',
    email: 'hayle@begena.com',
    phone: '+251 933 345 678',
    role: 'teacher',
    status: 'Active',
    fullName: 'Abel Betsegaw',
    avatar: '',
    verified: true,
    language: 'en',
    notificationPreferences: { email: true, sms: true, push: true },
    password: 'Password123!'
  },
  'hana@begena.com': {
    id: 'tch_hana',
    email: 'hana@begena.com',
    phone: '+251 966 678 901',
    role: 'teacher',
    status: 'Active',
    fullName: 'Hana Derese',
    avatar: '',
    verified: true,
    language: 'en',
    notificationPreferences: { email: true, sms: true, push: true },
    password: 'Password123!'
  },
  'bruk@begena.com': {
    id: 'tch_bruk',
    email: 'bruk@begena.com',
    phone: '+251 944 456 789',
    role: 'teacher',
    status: 'Active',
    fullName: 'Bruk Tesfaye',
    avatar: '',
    verified: true,
    language: 'en',
    notificationPreferences: { email: true, sms: true, push: true },
    password: 'Password123!'
  },
  'merawi@begena.com': {
    id: 'tch_merawi',
    email: 'merawi@begena.com',
    phone: '+251 955 567 890',
    role: 'teacher',
    status: 'Active',
    fullName: 'Mezemer Merawi Wolde',
    avatar: '',
    verified: true,
    language: 'en',
    notificationPreferences: { email: true, sms: true, push: true },
    password: 'Password123!'
  },
  // 5. Registration Staff
  'staff@begena.com': {
    id: 'u_staff_1',
    email: 'staff@begena.com',
    phone: '+251955555555',
    role: 'registration_staff',
    status: 'Active',
    fullName: 'Hana Saba',
    avatar: '',
    verified: true,
    language: 'am',
    notificationPreferences: { email: true, sms: true, push: true },
    password: 'Password123!'
  },
  // 6. Branch Manager
  'manager@begena.com': {
    id: 'u_manager_1',
    email: 'manager@begena.com',
    phone: '+251966666666',
    role: 'branch_manager',
    status: 'Active',
    fullName: 'Deacon Yohannes',
    avatar: '',
    verified: true,
    language: 'en',
    notificationPreferences: { email: true, sms: true, push: true },
    password: 'Password123!'
  },
  // 7. Accountant
  'accountant@begena.com': {
    id: 'u_accountant_1',
    email: 'accountant@begena.com',
    phone: '+251977777777',
    role: 'accountant',
    status: 'Active',
    fullName: 'Martha Hailu',
    avatar: '',
    verified: true,
    language: 'en',
    notificationPreferences: { email: true, sms: false, push: true },
    password: 'Password123!'
  },
  // 8. Admin
  'admin@begena.com': {
    id: 'u_admin_1',
    email: 'admin@begena.com',
    phone: '+251988888888',
    role: 'admin',
    status: 'Active',
    fullName: 'Yared Gebre',
    avatar: '',
    verified: true,
    language: 'en',
    notificationPreferences: { email: true, sms: true, push: true },
    password: 'Password123!'
  },
  // 9. Super Admin
  'super@begena.com': {
    id: 'u_super_1',
    email: 'super@begena.com',
    phone: '+251999999999',
    role: 'super_admin',
    status: 'Active',
    fullName: 'Tewodros Kassahun',
    avatar: '',
    verified: true,
    language: 'en',
    notificationPreferences: { email: true, sms: true, push: true },
    password: 'Password123!'
  },
  // 10. Founder
  'founder@begena.com': {
    id: 'u_founder_1',
    email: 'founder@begena.com',
    phone: '+251900000000',
    role: 'founder',
    status: 'Active',
    fullName: 'Deacon Bruk Tesfaye',
    avatar: '',
    verified: true,
    language: 'en',
    notificationPreferences: { email: true, sms: true, push: true },
    password: 'Password123!'
  },

  // TESTING PENDING APPROVAL STATE
  'approval@begena.com': {
    id: 'u_pending_approval',
    email: 'approval@begena.com',
    phone: '+251944433322',
    role: 'teacher',
    status: 'Pending Approval',
    fullName: 'Teacher Applicant Dawit',
    verified: true,
    language: 'en',
    notificationPreferences: { email: true, sms: true, push: true },
    password: 'Password123!'
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [allNotifications, setAllNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [accounts, setAccounts] = useState<Record<string, User & { password?: string }>>(MOCK_ACCOUNTS);

  // Load session from localStorage if exists
  useEffect(() => {
    cleanOversizedStorage();
    const savedUser = localStorage.getItem('ab_session_user');
    if (savedUser) {
      try {
        const userObj = JSON.parse(savedUser);
        setCurrentUser(userObj);
      } catch (e) {
        console.error('Error restoring session:', e);
      }
    }

    const savedNotifications = localStorage.getItem('ab_notifications');
    if (savedNotifications) {
      try {
        setAllNotifications(JSON.parse(savedNotifications));
      } catch (e) {
        console.error('Error restoring notifications:', e);
      }
    }

    const savedAccounts = localStorage.getItem('ab_accounts');
    if (savedAccounts) {
      try {
        const parsed = JSON.parse(savedAccounts);
        setAccounts({ ...MOCK_ACCOUNTS, ...parsed });
      } catch (e) {
        console.error('Error restoring custom accounts:', e);
      }
    }
  }, []);

  // AUTO-SYNC ENROLLMENT ACCESS WHEN ACCOUNTANT OR REGISTRAR APPROVES PAYMENT
  const checkAndSyncApproval = () => {
    if (!currentUser || currentUser.role !== 'student') return;

    try {
      // 1. Check ab_applications_v3
      const apps = JSON.parse(localStorage.getItem('ab_applications_v3') || '[]');
      const userApp = apps.find((a: any) =>
        a && (
          (a.userId && currentUser?.id && a.userId === currentUser.id) ||
          (a.email && currentUser?.email && a.email.toLowerCase() === currentUser.email.toLowerCase()) ||
          (a.studentEmail && currentUser?.email && a.studentEmail.toLowerCase() === currentUser.email.toLowerCase()) ||
          (a.studentName && currentUser?.fullName && a.studentName.toLowerCase() === currentUser.fullName.toLowerCase()) ||
          (a.id && currentUser?.id && a.id === currentUser.id)
        )
      );

      // 2. Check ab_transactions_v3
      const txns = JSON.parse(localStorage.getItem('ab_transactions_v3') || '[]');
      const userTxn = txns.find((t: any) =>
        t &&
        ((t.studentId && currentUser?.id && t.studentId === currentUser.id) ||
         (t.studentEmail && currentUser?.email && t.studentEmail.toLowerCase() === currentUser.email.toLowerCase()) ||
         (t.studentName && currentUser?.fullName && t.studentName.toLowerCase() === currentUser.fullName.toLowerCase())) &&
        (t.status === 'Verified' || t.status === 'Approved')
      );

      // 3. Check ab_students_v3
      const students = JSON.parse(localStorage.getItem('ab_students_v3') || '[]');
      const userStudent = students.find((s: any) =>
        s && (
          (s.id && currentUser?.id && s.id === currentUser.id) ||
          (s.email && currentUser?.email && s.email.toLowerCase() === currentUser.email.toLowerCase()) ||
          (s.fullName && currentUser?.fullName && s.fullName.toLowerCase() === currentUser.fullName.toLowerCase())
        )
      );

      const isApproved =
        (userApp && (userApp.status === 'Approved' || userApp.paymentStatus === 'Approved')) ||
        userTxn ||
        (userStudent && userStudent.tuitionPaid);

      if (isApproved) {
        const rawInstStr =
          userApp?.selectedInstrument ||
          userApp?.instrument ||
          userApp?.selectedCourseName ||
          userStudent?.instrument ||
          userStudent?.instrumentOwned ||
          userStudent?.courseName ||
          userTxn?.course ||
          currentUser.enrolledInstrument ||
          currentUser.enrolledCourse ||
          'Begena';

        const resolvedInst = normalizeInstrumentName(rawInstStr);
        const resolvedCourse =
          userApp?.selectedCourseName ||
          userApp?.courseName ||
          userStudent?.courseName ||
          userTxn?.course ||
          currentUser.enrolledCourse ||
          `${resolvedInst} Course`;

        // If user already active AND enrolledInstrument & enrolledCourse match, no changes needed
        if (
          currentUser.studentStatus === 'Enrollment Active' &&
          currentUser.isRegistrationCompleted &&
          currentUser.isPaymentCompleted &&
          currentUser.enrolledInstrument === resolvedInst &&
          currentUser.enrolledCourse === resolvedCourse
        ) {
          return;
        }

        const updatedUser: User = {
          ...currentUser,
          studentStatus: 'Enrollment Active',
          isRegistrationCompleted: true,
          isPaymentCompleted: true,
          status: 'Active',
          enrolledInstrument: resolvedInst,
          enrolledCourse: resolvedCourse
        };

        setCurrentUser(updatedUser);
        safeSetItem('ab_session_user', JSON.stringify(updatedUser));

        // Update in accounts map too
        setAccounts(prev => {
          const updated = { ...prev, [updatedUser.email]: { ...prev[updatedUser.email], ...updatedUser } };
          safeSetItem('ab_accounts', JSON.stringify(updated));
          return updated;
        });

        addNotification(
          'Accountant Approval Received! 🎓',
          'Your tuition payment has been verified. Welcome to Liora Begena School! Full classroom and lesson access is now active.',
          'payment'
        );
      }
    } catch (e) {
      console.error('Error during approval sync check:', e);
    }
  };

  useEffect(() => {
    checkAndSyncApproval();

    const handleUserUpdateEvent = () => {
      checkAndSyncApproval();
    };

    window.addEventListener('ab_user_updated', handleUserUpdateEvent);
    window.addEventListener('storage', handleUserUpdateEvent);

    return () => {
      window.removeEventListener('ab_user_updated', handleUserUpdateEvent);
      window.removeEventListener('storage', handleUserUpdateEvent);
    };
  }, [currentUser]);

  // Sync state helpers
  const saveUserSession = (user: User | null, rememberMe: boolean) => {
    setCurrentUser(user);
    if (user) {
      safeSetItem('ab_session_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('ab_session_user');
    }
  };

  const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID?.trim() || 'service_wbjoslj';
  const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID?.trim() || 'template_811lqxm';
  const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY?.trim() || 'qfnaLgQHhyc011oaq';
  const isEmailJsConfigured = Boolean(
    EMAILJS_SERVICE_ID &&
    EMAILJS_TEMPLATE_ID &&
    EMAILJS_PUBLIC_KEY &&
    !EMAILJS_SERVICE_ID.includes('YOUR_') &&
    !EMAILJS_TEMPLATE_ID.includes('YOUR_') &&
    !EMAILJS_PUBLIC_KEY.includes('YOUR_')
  );
  const [verificationEmailNotice, setVerificationEmailNotice] = useState<string | null>(null);

  useEffect(() => {
    if (isEmailJsConfigured) {
      emailjs.init(EMAILJS_PUBLIC_KEY);
    }
  }, [isEmailJsConfigured, EMAILJS_PUBLIC_KEY]);

  const sendVerificationEmail = async (user: User, code: string): Promise<{ success: boolean; error?: string }> => {
    if (!isEmailJsConfigured) {
      const message =
        'EmailJS configuration is missing. Please check your service ID, template ID, and public key.';
      console.warn('[EmailJS] Missing configuration.');
      setVerificationEmailNotice(message);
      return { success: false, error: message };
    }

    const templateParams = {
      user_name: user.fullName || user.username || user.email,
      user_email: user.email,
      verification_code: code,
      // Common template aliases
      to_name: user.fullName || user.username || user.email,
      to_email: user.email,
      recipient_email: user.email,
      email: user.email,
      verificationCode: code,
      code: code,
      app_name: 'Liora Begena School'
    };

    try {
      const result = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
        EMAILJS_PUBLIC_KEY
      );

      console.log('[EmailJS] Verification email sent successfully:', result);
      setVerificationEmailNotice(`A verification code was sent to ${user.email}.`);
      return { success: true };
    } catch (error) {
      console.error('[EmailJS] Failed to send verification email:', error);
      const errorText = error instanceof Error ? error.message : typeof error === 'object' && error !== null && 'text' in error ? String((error as any).text) : String(error);
      const message = `Failed to send verification email. ${errorText}`;
      setVerificationEmailNotice(message);
      return { success: false, error: message };
    }
  };

  const syncNotifications = (newNotifs: Notification[]) => {
    setAllNotifications(newNotifs);
    localStorage.setItem('ab_notifications', JSON.stringify(newNotifs));
  };

  const syncAccounts = (newAccounts: Record<string, User & { password?: string }>) => {
    setAccounts(newAccounts);
    localStorage.setItem('ab_accounts', JSON.stringify(newAccounts));
  };

  // Filter notifications strictly for the active logged-in user
  const notifications = currentUser
    ? allNotifications.filter((n) => isNotificationForUser(n, currentUser))
    : [];

  const unreadNotificationsCount = notifications.filter((n) => !n.isRead).length;

  // LOGIN FLOW
  const login = async (
    emailOrPhone: string,
    password: string,
    rememberMe: boolean,
    preferredRole?: UserRole
  ): Promise<{ success: boolean; error?: string; status?: AccountStatus; role?: UserRole; unverifiedEmail?: string }> => {
    // Artificial latency for smooth user experience
    await new Promise((resolve) => setTimeout(resolve, 300));

    const cleanInput = emailOrPhone.trim().toLowerCase();
    const cleanPhone = emailOrPhone.trim();
    const cleanPhoneDigits = cleanPhone.replace(/\D/g, '');

    // Comprehensive accounts lookup combining MOCK_ACCOUNTS, state accounts, and any dynamically created teachers/students
    const mergedAccounts: Record<string, User & { password?: string }> = {
      ...MOCK_ACCOUNTS,
      ...accounts
    };

    // Inject teachers from ab_teachers_v4 if available
    try {
      const storedTeachers = JSON.parse(localStorage.getItem('ab_teachers_v4') || '[]');
      if (Array.isArray(storedTeachers)) {
        storedTeachers.forEach((t: any) => {
          if (t && t.email) {
            const key = t.email.toLowerCase();
            if (!mergedAccounts[key]) {
              mergedAccounts[key] = {
                id: t.id || `tch_${Date.now()}`,
                email: t.email,
                phone: t.phone || '',
                role: 'teacher',
                status: 'Active',
                fullName: t.fullName || t.name || 'Teacher',
                avatar: t.photo || '',
                verified: true,
                language: 'en',
                notificationPreferences: { email: true, sms: true, push: true },
                password: 'Password123!'
              };
            }
          }
        });
      }
    } catch (e) {
      console.warn('Error reading stored teachers for login:', e);
    }

    // Check if account has been permanently deleted
    if (isStudentDeleted(cleanInput, cleanInput, cleanPhone)) {
      return { success: false, error: 'This student account has been permanently deleted and cannot log in.' };
    }

    // Find account by email, phone, or username
    const accountEntry = (Object.values(mergedAccounts) as any[]).find(
      (acc) =>
        acc && (
          (acc.email && acc.email.toLowerCase() === cleanInput) ||
          (acc.phone && acc.phone === cleanPhone) ||
          (acc.phone && cleanPhoneDigits.length > 5 && acc.phone.replace(/\D/g, '') === cleanPhoneDigits) ||
          (acc.username && acc.username.toLowerCase() === cleanInput)
        )
    );

    if (!accountEntry) {
      return { success: false, error: 'Incorrect Email, or Password' };
    }

    if (isStudentDeleted(accountEntry.id, accountEntry.email, accountEntry.phone, accountEntry.fullName)) {
      return { success: false, error: 'This student account has been permanently deleted and cannot log in.' };
    }

    // Verify password against stored password or default Password123!
    const isPasswordValid =
      accountEntry.password === password || password === 'Password123!';

    if (!isPasswordValid) {
      return { success: false, error: 'Incorrect Email, or Password' };
    }

    // STRICT ROLE VERIFICATION: Match selected login role against actual account role stored in database
    const formatRoleTitle = (role: string): string => {
      switch (role) {
        case 'student': return 'Student';
        case 'teacher': return 'Teacher';
        case 'parent': return 'Parent';
        case 'branch_manager': return 'Branch Manager';
        case 'accountant': return 'Accountant';
        case 'admin': return 'Admin';
        case 'super_admin': return 'Super Admin';
        case 'founder': return 'Founder';
        case 'registration_staff': return 'Registration Staff';
        default: return role.charAt(0).toUpperCase() + role.slice(1);
      }
    };

    if (preferredRole && accountEntry.role !== preferredRole) {
      const actualRoleTitle = formatRoleTitle(accountEntry.role);
      const article = ['A', 'E', 'I', 'O', 'U'].includes(actualRoleTitle.charAt(0).toUpperCase()) ? 'an' : 'a';
      return {
        success: false,
        error: `Role mismatch. This account is registered as ${article} ${actualRoleTitle}. Please select ${actualRoleTitle} Access to continue.`
      };
    }

    // Check account status restrictions
    if (accountEntry.status === 'Suspended') {
      return { success: false, error: 'Your account has been suspended. Please contact administration.', status: 'Suspended' };
    }
    if (accountEntry.status === 'Deactivated') {
      return { success: false, error: 'Your account has been deactivated. Please contact support.', status: 'Deactivated' };
    }

    // REQUIREMENT 6: LOGIN PROTECTION FOR UNVERIFIED ACCOUNTS
    const isVerifiedAccount = accountEntry.isVerified === true || accountEntry.verified === true;
    if (!isVerifiedAccount || accountEntry.status === 'Pending Verification') {
      localStorage.setItem('ab_pending_verify_email', accountEntry.email);
      if (accountEntry.phone) {
        localStorage.setItem('ab_pending_verify_phone', accountEntry.phone);
      }
      return {
        success: false,
        error: 'Your account is not verified. Please verify your email or phone number in Telegram to continue.',
        status: 'Pending Verification',
        unverifiedEmail: accountEntry.email,
        role: accountEntry.role
      };
    }

    // Normal successful login using authenticated account record
    saveUserSession(accountEntry, rememberMe);
    localStorage.removeItem('ab_pending_verify_email');
    return { success: true, status: accountEntry.status, role: accountEntry.role };
  };

  // Helper to generate a random 6-digit code for every registration/resend
  const generate6DigitCode = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  // REGISTRATION FLOW
  const registerUser = async (
    name: string,
    email: string,
    phone: string,
    username: string,
    password: string,
    role: 'student' | 'parent' | 'teacher'
  ): Promise<{ success: boolean; user?: User; error?: string }> => {
    await new Promise((resolve) => setTimeout(resolve, 600));

    const cleanEmail = email.trim().toLowerCase();
    const cleanUsername = username.trim().toLowerCase();
    const cleanPhone = phone.trim();

    if (!name.trim()) return { success: false, error: 'Full name is required.' };
    if (!cleanEmail || !/\S+@\S+\.\S+/.test(cleanEmail)) return { success: false, error: 'A valid email address is required.' };
    if (!cleanPhone) return { success: false, error: 'Phone number is required.' };
    if (!cleanUsername) return { success: false, error: 'Username is required.' };
    if (!password) return { success: false, error: 'Password is required.' };

    const mergedAccounts: Record<string, User & { password?: string }> = {
      ...MOCK_ACCOUNTS,
      ...accounts
    };

    if (mergedAccounts[cleanEmail]) {
      return { success: false, error: 'An account with this email address already exists.' };
    }

    const phoneExists = (Object.values(mergedAccounts) as any[]).some(acc => acc && acc.phone === cleanPhone);
    if (phoneExists) {
      return { success: false, error: 'An account with this phone number already exists.' };
    }

    const usernameExists = (Object.values(mergedAccounts) as any[]).some(acc => acc && acc.username && acc.username.toLowerCase() === cleanUsername);
    if (usernameExists) {
      return { success: false, error: 'An account with this username already exists.' };
    }

    // Generate random 6-digit verification code
    const verificationCode = generate6DigitCode();
    const verificationExpiry = Date.now() + 10 * 60 * 1000; // Expires in 10 minutes
    const lastCodeSentAt = Date.now();

    const isTeacher = role === 'teacher';
    const newUser: User & { password?: string } = {
      id: `u_${role}_${Date.now()}`,
      email: cleanEmail,
      phone: cleanPhone,
      username: username.trim(),
      role,
      status: isTeacher ? 'Active' : 'Pending Verification',
      isVerified: isTeacher,
      verified: isTeacher,
      verificationCode: isTeacher ? null : verificationCode,
      verificationExpiry: isTeacher ? null : verificationExpiry,
      lastCodeSentAt: isTeacher ? null : lastCodeSentAt,
      fullName: name.trim(),
      language: 'en',
      notificationPreferences: { email: true, sms: true, push: true },
      studentStatus: role === 'student' ? 'Account Created' : undefined
    };

    const updatedAccounts = { ...accounts, [cleanEmail]: { ...newUser, password } };
    syncAccounts(updatedAccounts);

    if (!isTeacher) {
      localStorage.setItem('ab_pending_verify_email', cleanEmail);
      localStorage.setItem('ab_pending_verify_phone', cleanPhone);
      // Immediately send verification email via EmailJS
      sendVerificationEmail(newUser, verificationCode).then((result) => {
        if (!result.success) {
          console.warn('[Register] EmailJS warning:', result.error);
        } else {
          setVerificationEmailNotice(`A verification code was sent to ${cleanEmail}.`);
        }
      });
    } else {
      saveUserSession(newUser, true);
    }

    return { success: true, user: newUser };
  };

  // VERIFICATION FLOW
  const verifyCode = async (code: string, emailOverride?: string): Promise<{ success: boolean; error?: string }> => {
    await new Promise((resolve) => setTimeout(resolve, 400));

    const targetEmail = (emailOverride || currentUser?.email || localStorage.getItem('ab_pending_verify_email') || '').trim().toLowerCase();

    if (!targetEmail) {
      return { success: false, error: 'Account email not found. Please register or sign in again.' };
    }

    const mergedAccounts = { ...MOCK_ACCOUNTS, ...accounts };
    const accountEntry = mergedAccounts[targetEmail];

    if (!accountEntry) {
      return { success: false, error: 'Account not found. Please register first.' };
    }

    if (accountEntry.isVerified && accountEntry.verified && accountEntry.status !== 'Pending Verification') {
      return { success: true };
    }

    const cleanInputCode = (code || '').trim().replace(/\D/g, '');
    if (!cleanInputCode || cleanInputCode.length < 6) {
      return { success: false, error: 'Please enter all 6 verification digits.' };
    }

    // Check expiration
    if (accountEntry.verificationExpiry && Date.now() > accountEntry.verificationExpiry) {
      return {
        success: false,
        error: 'Verification code has expired. Please click Resend Code to receive a new code.'
      };
    }

    // Check code match (Allow stored code or '123456' for fallback/testing)
    const storedCode = (accountEntry.verificationCode || '').trim();
    const isMatch = cleanInputCode === storedCode || cleanInputCode === '123456';

    if (!isMatch) {
      return { success: false, error: 'Invalid verification code. Please check your email and try again.' };
    }

    // Mark account as verified
    const updatedUser: User = {
      ...accountEntry,
      status: 'Active',
      isVerified: true,
      verified: true,
      verificationCode: null,
      verificationExpiry: null,
      studentStatus: accountEntry.role === 'student' ? 'Profile Incomplete' : undefined
    };

    const updatedAccounts = {
      ...accounts,
      [targetEmail]: {
        ...accounts[targetEmail],
        ...updatedUser,
        status: 'Active' as AccountStatus,
        isVerified: true,
        verified: true,
        verificationCode: null,
        verificationExpiry: null
      }
    };

    syncAccounts(updatedAccounts);
    saveUserSession(updatedUser, true);
    localStorage.removeItem('ab_pending_verify_email');

    addNotification(
      'Account Verified Successfully! 🎉',
      `Welcome ${updatedUser.fullName}! Your email address ${targetEmail} has been verified successfully.`,
      'registration'
    );

    return { success: true };
  };

  // RESEND CODE FLOW WITH 60-SECOND SPAM PROTECTION
  const resendVerificationCode = async (emailOverride?: string): Promise<{ success: boolean; error?: string; remainingSeconds?: number }> => {
    await new Promise((resolve) => setTimeout(resolve, 400));

    const targetEmail = (emailOverride || currentUser?.email || localStorage.getItem('ab_pending_verify_email') || '').trim().toLowerCase();

    if (!targetEmail) {
      return { success: false, error: 'No account email found. Please register or sign in first.' };
    }

    const mergedAccounts = { ...MOCK_ACCOUNTS, ...accounts };
    const accountEntry = mergedAccounts[targetEmail];

    if (!accountEntry) {
      return { success: false, error: 'Account not found.' };
    }

    // Spam prevention check (60-second cooldown)
    const now = Date.now();
    const lastSent = accountEntry.lastCodeSentAt || 0;
    const elapsedSeconds = Math.floor((now - lastSent) / 1000);

    if (elapsedSeconds < 60) {
      const remainingSeconds = 60 - elapsedSeconds;
      return {
        success: false,
        error: `You can resend another code in ${remainingSeconds} seconds.`,
        remainingSeconds
      };
    }

    // Generate brand new 6-digit code
    const newCode = generate6DigitCode();
    const newExpiry = now + 10 * 60 * 1000; // 10 minutes

    const updatedAccount = {
      ...accountEntry,
      verificationCode: newCode,
      verificationExpiry: newExpiry,
      lastCodeSentAt: now
    };

    const updatedAccounts = {
      ...accounts,
      [targetEmail]: updatedAccount
    };

    syncAccounts(updatedAccounts);
    if (currentUser && currentUser.email.toLowerCase() === targetEmail) {
      saveUserSession(updatedAccount, true);
    }

    // Send EmailJS email with new code
    const emailResult = await sendVerificationEmail(updatedAccount, newCode);
    if (!emailResult.success) {
      return { success: false, error: emailResult.error || 'Failed to send verification email. Please check connection.' };
    }

    setVerificationEmailNotice(`A new verification code was sent to ${targetEmail}.`);
    return { success: true };
  };

  // TELEGRAM VERIFICATION FLOW
  const sendTelegramVerificationCode = async (
    sharedPhone: string,
    emailOverride?: string
  ): Promise<{ success: boolean; matched: boolean; code?: string; error?: string; registeredPhone?: string }> => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const targetEmail = (
      emailOverride ||
      currentUser?.email ||
      localStorage.getItem('ab_pending_verify_email') ||
      ''
    ).trim().toLowerCase();

    const mergedAccounts: Record<string, User & { password?: string }> = {
      ...MOCK_ACCOUNTS,
      ...accounts
    };

    let account = mergedAccounts[targetEmail];
    if (!account) {
      const pendingPhone = localStorage.getItem('ab_pending_verify_phone');
      if (pendingPhone) {
        account = Object.values(mergedAccounts).find(
          (a) => a && normalizePhoneNumber(a.phone) === normalizePhoneNumber(pendingPhone)
        );
      }
    }

    if (!account) {
      return {
        success: false,
        matched: false,
        error: 'Account record not found. Please register or start verification again.'
      };
    }

    const registeredPhone = account.phone || localStorage.getItem('ab_pending_verify_phone') || '';
    if (!registeredPhone) {
      return {
        success: false,
        matched: false,
        error: 'No phone number registered for this account.'
      };
    }

    const normShared = normalizePhoneNumber(sharedPhone);
    const normRegistered = normalizePhoneNumber(registeredPhone);

    if (!normShared || normShared !== normRegistered) {
      return {
        success: false,
        matched: false,
        registeredPhone,
        error: `Phone number mismatch! Shared Telegram number (${sharedPhone}) does not match the registered phone number (${registeredPhone}).`
      };
    }

    // Phone numbers match! Generate 6-digit verification code
    let newCode = generate6DigitCode();
    try {
      const serverRes = await fetch('/api/telegram/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          registeredPhone,
          sharedPhone,
          email: account.email
        })
      });
      const data = await serverRes.json();
      if (data && data.matched && data.code) {
        newCode = data.code;
      }
    } catch (e) {
      console.warn('[TelegramBot API] Server call failed, using local generation:', e);
    }

    const verificationExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes

    const emailKey = account.email.toLowerCase();
    const updatedAccount = {
      ...account,
      verificationCode: newCode,
      verificationExpiry,
      lastCodeSentAt: Date.now()
    };

    const updatedAccounts = {
      ...accounts,
      [emailKey]: {
        ...accounts[emailKey],
        ...updatedAccount
      }
    };

    syncAccounts(updatedAccounts);
    if (currentUser && currentUser.email.toLowerCase() === emailKey) {
      saveUserSession(updatedAccount, true);
    }

    addNotification(
      'Telegram Verification Code Dispatched ✈️',
      `Verification code ${newCode} was sent to verified phone number ${registeredPhone}.`,
      'system',
      undefined,
      account.id,
      account.email
    );

    return {
      success: true,
      matched: true,
      code: newCode,
      registeredPhone
    };
  };

  // FORGOT PASSWORD
  const forgotPassword = async (emailOrPhone: string): Promise<{ success: boolean; error?: string }> => {
    await new Promise((resolve) => setTimeout(resolve, 700));
    const clean = emailOrPhone.trim().toLowerCase();
    const account = (Object.values(accounts) as any[]).find(
      (acc) => acc && ((acc.email && acc.email.toLowerCase() === clean) || acc.phone === emailOrPhone)
    );

    if (!account) {
      // Return true to avoid user enumeration vulnerability, standard security UX
      return { success: true };
    }

    const verificationCode = '123456'; // Preset for simple testing
    const updatedAccounts = {
      ...accounts,
      [account.email]: { ...accounts[account.email], verificationCode }
    };
    syncAccounts(updatedAccounts);
    return { success: true };
  };

  // RESET PASSWORD
  const resetPassword = async (code: string, newPassword: string): Promise<{ success: boolean; error?: string }> => {
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Preset check
    if (code !== '123456') {
      return { success: false, error: 'Invalid verification or reset code.' };
    }

    // Find account that has verificationCode '123456'
    const accountEntry = (Object.values(accounts) as any[]).find((acc) => acc && acc.verificationCode === '123456');
    if (!accountEntry) {
      return { success: false, error: 'No active password reset request found.' };
    }

    const updatedAccounts = {
      ...accounts,
      [accountEntry.email]: { ...accounts[accountEntry.email], password: newPassword, verificationCode: undefined }
    };
    syncAccounts(updatedAccounts);
    return { success: true };
  };

  // LOGOUT
  const logout = () => {
    saveUserSession(null, false);
  };

  // CHANGE PASSWORD LOGIC
  const changePassword = async (currentPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    if (!currentUser) return { success: false, error: 'No authenticated user' };

    const emailKey = currentUser.email.toLowerCase();
    const accountEntry = accounts[emailKey];

    if (!accountEntry) {
      return { success: false, error: 'User account not found' };
    }

    const expectedPassword = accountEntry.password || 'Password123!';
    if (currentPassword !== expectedPassword && currentPassword !== 'Password123!') {
      return { success: false, error: 'Current password is incorrect.' };
    }

    if (!newPassword || newPassword.length < 6) {
      return { success: false, error: 'New password must be at least 6 characters long.' };
    }

    const updatedAccounts = {
      ...accounts,
      [emailKey]: { ...accountEntry, password: newPassword }
    };

    const updatedUser = { ...currentUser, password: newPassword };
    syncAccounts(updatedAccounts);
    saveUserSession(updatedUser, true);

    addNotification('Password Changed', 'Your account security password has been updated.', 'system');
    return { success: true };
  };

  // AUTHORITATIVE USER PROFILE LOOKUP
  const getAuthoritativeUser = (idOrEmail?: string): User | undefined => {
    if (!idOrEmail) return undefined;
    const clean = idOrEmail.trim().toLowerCase();

    if (currentUser && (currentUser.email.toLowerCase() === clean || currentUser.id.toLowerCase() === clean)) {
      return currentUser;
    }

    if (accounts[clean]) {
      return accounts[clean];
    }

    const allAccs = Object.values(accounts) as User[];
    return allAccs.find(a => a && (
      (a.email && a.email.toLowerCase() === clean) ||
      (a.id && a.id.toLowerCase() === clean) ||
      (a.username && a.username.toLowerCase() === clean)
    ));
  };

  // PROFILE UPDATES WITH GLOBAL SYNCHRONIZATION
  const updateProfile = async (fields: Partial<User>): Promise<{ success: boolean; error?: string }> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    if (!currentUser) return { success: false, error: 'No authenticated user' };

    const updatedUser = { ...currentUser, ...fields };
    const emailKey = currentUser.email.toLowerCase();
    const newEmailKey = fields.email ? fields.email.toLowerCase() : emailKey;

    const updatedAccounts = {
      ...accounts,
      [emailKey]: { ...accounts[emailKey], ...fields, ...(fields.email ? { email: fields.email } : {}) }
    };

    if (newEmailKey !== emailKey) {
      updatedAccounts[newEmailKey] = updatedUser;
    }

    syncAccounts(updatedAccounts);
    saveUserSession(updatedUser, true);

    // Synchronize into DataContext arrays stored in localStorage
    try {
      // 1. Students list (ab_students_v3 & ab_students_v4)
      const storedStudents3 = JSON.parse(localStorage.getItem('ab_students_v3') || '[]');
      if (Array.isArray(storedStudents3)) {
        const updatedStudents = storedStudents3.map((s: any) => {
          if (s && (s.email?.toLowerCase() === emailKey || s.id === currentUser.id || s.userId === currentUser.id)) {
            return {
              ...s,
              fullName: fields.fullName !== undefined ? fields.fullName : s.fullName,
              email: fields.email !== undefined ? fields.email : s.email,
              photoUrl: fields.avatar !== undefined ? fields.avatar : s.photoUrl,
              photo: fields.avatar !== undefined ? fields.avatar : s.photo,
              phone: fields.phone !== undefined ? fields.phone : s.phone,
              address: fields.address !== undefined ? fields.address : s.address,
              branch: fields.branch !== undefined ? fields.branch : s.branch,
              gender: fields.gender !== undefined ? fields.gender : s.gender,
              age: fields.age !== undefined ? fields.age : s.age
            };
          }
          return s;
        });
        safeSetItem('ab_students_v3', JSON.stringify(updatedStudents));
      }

      const storedStudents4 = JSON.parse(localStorage.getItem('ab_students_v4') || '[]');
      if (Array.isArray(storedStudents4)) {
        const updatedStudents = storedStudents4.map((s: any) => {
          if (s && (s.email?.toLowerCase() === emailKey || s.id === currentUser.id || s.userId === currentUser.id)) {
            return {
              ...s,
              fullName: fields.fullName !== undefined ? fields.fullName : s.fullName,
              email: fields.email !== undefined ? fields.email : s.email,
              photoUrl: fields.avatar !== undefined ? fields.avatar : s.photoUrl,
              photo: fields.avatar !== undefined ? fields.avatar : s.photo,
              phone: fields.phone !== undefined ? fields.phone : s.phone,
              address: fields.address !== undefined ? fields.address : s.address,
              branch: fields.branch !== undefined ? fields.branch : s.branch,
              gender: fields.gender !== undefined ? fields.gender : s.gender,
              age: fields.age !== undefined ? fields.age : s.age
            };
          }
          return s;
        });
        safeSetItem('ab_students_v4', JSON.stringify(updatedStudents));
      }

      // 2. Teachers list (ab_teachers_v3 & ab_teachers_v4)
      const storedTeachers3 = JSON.parse(localStorage.getItem('ab_teachers_v3') || '[]');
      if (Array.isArray(storedTeachers3)) {
        const updatedTeachers = storedTeachers3.map((t: any) => {
          if (t && (t.email?.toLowerCase() === emailKey || t.id === currentUser.id)) {
            return {
              ...t,
              fullName: fields.fullName !== undefined ? fields.fullName : t.fullName,
              email: fields.email !== undefined ? fields.email : t.email,
              photo: fields.avatar !== undefined ? fields.avatar : t.photo,
              phone: fields.phone !== undefined ? fields.phone : t.phone
            };
          }
          return t;
        });
        safeSetItem('ab_teachers_v3', JSON.stringify(updatedTeachers));
      }

      const storedTeachers4 = JSON.parse(localStorage.getItem('ab_teachers_v4') || '[]');
      if (Array.isArray(storedTeachers4)) {
        const updatedTeachers = storedTeachers4.map((t: any) => {
          if (t && (t.email?.toLowerCase() === emailKey || t.id === currentUser.id)) {
            return {
              ...t,
              fullName: fields.fullName !== undefined ? fields.fullName : t.fullName,
              email: fields.email !== undefined ? fields.email : t.email,
              photo: fields.avatar !== undefined ? fields.avatar : t.photo,
              phone: fields.phone !== undefined ? fields.phone : t.phone
            };
          }
          return t;
        });
        safeSetItem('ab_teachers_v4', JSON.stringify(updatedTeachers));
      }

      // 3. Applications list (ab_applications_v3)
      const storedApps = JSON.parse(localStorage.getItem('ab_applications_v3') || '[]');
      if (Array.isArray(storedApps)) {
        const updatedApps = storedApps.map((a: any) => {
          if (a && (a.email?.toLowerCase() === emailKey || a.studentEmail?.toLowerCase() === emailKey || a.studentId === currentUser.id || a.userId === currentUser.id)) {
            return {
              ...a,
              fullName: fields.fullName !== undefined ? fields.fullName : a.fullName,
              studentName: fields.fullName !== undefined ? fields.fullName : a.studentName,
              email: fields.email !== undefined ? fields.email : a.email,
              studentEmail: fields.email !== undefined ? fields.email : a.studentEmail,
              photoUrl: fields.avatar !== undefined ? fields.avatar : a.photoUrl,
              studentPhotoUrl: fields.avatar !== undefined ? fields.avatar : a.studentPhotoUrl,
              phone: fields.phone !== undefined ? fields.phone : a.phone,
              studentPhone: fields.phone !== undefined ? fields.phone : a.studentPhone
            };
          }
          return a;
        });
        safeSetItem('ab_applications_v3', JSON.stringify(updatedApps));
      }

      // 4. Enrollments list (ab_enrollments_v4)
      const storedEnrs = JSON.parse(localStorage.getItem('ab_enrollments_v4') || '[]');
      if (Array.isArray(storedEnrs)) {
        const updatedEnrs = storedEnrs.map((e: any) => {
          if (e && (e.studentEmail?.toLowerCase() === emailKey || e.studentId === currentUser.id)) {
            return {
              ...e,
              studentName: fields.fullName !== undefined ? fields.fullName : e.studentName,
              studentEmail: fields.email !== undefined ? fields.email : e.studentEmail,
              studentPhone: fields.phone !== undefined ? fields.phone : e.studentPhone,
              studentPhoto: fields.avatar !== undefined ? fields.avatar : e.studentPhoto,
              studentPhotoUrl: fields.avatar !== undefined ? fields.avatar : e.studentPhotoUrl,
              photoUrl: fields.avatar !== undefined ? fields.avatar : e.photoUrl
            };
          }
          return e;
        });
        safeSetItem('ab_enrollments_v4', JSON.stringify(updatedEnrs));
      }

      // 5. System Users list (ab_all_users_v3)
      const storedUsers = JSON.parse(localStorage.getItem('ab_all_users_v3') || '[]');
      if (Array.isArray(storedUsers)) {
        const updatedUsers = storedUsers.map((u: any) => {
          if (u && (u.email?.toLowerCase() === emailKey || u.id === currentUser.id)) {
            return {
              ...u,
              fullName: fields.fullName !== undefined ? fields.fullName : u.fullName,
              email: fields.email !== undefined ? fields.email : u.email,
              avatar: fields.avatar !== undefined ? fields.avatar : u.avatar,
              photo: fields.avatar !== undefined ? fields.avatar : u.photo,
              phone: fields.phone !== undefined ? fields.phone : u.phone,
              branch: fields.branch !== undefined ? fields.branch : u.branch
            };
          }
          return u;
        });
        safeSetItem('ab_all_users_v3', JSON.stringify(updatedUsers));
      }

      // 6. Transactions & Payments list (ab_transactions_v3, ab_payments_v3)
      const storedTxns = JSON.parse(localStorage.getItem('ab_transactions_v3') || '[]');
      if (Array.isArray(storedTxns)) {
        const updatedTxns = storedTxns.map((tx: any) => {
          if (tx && (tx.studentId === currentUser.id || tx.email?.toLowerCase() === emailKey || tx.studentEmail?.toLowerCase() === emailKey)) {
            return {
              ...tx,
              studentName: fields.fullName !== undefined ? fields.fullName : tx.studentName,
              studentEmail: fields.email !== undefined ? fields.email : tx.studentEmail
            };
          }
          return tx;
        });
        safeSetItem('ab_transactions_v3', JSON.stringify(updatedTxns));
      }

      const storedPmts = JSON.parse(localStorage.getItem('ab_payments_v3') || '[]');
      if (Array.isArray(storedPmts)) {
        const updatedPmts = storedPmts.map((p: any) => {
          if (p && (p.studentId === currentUser.id || p.studentEmail?.toLowerCase() === emailKey)) {
            return {
              ...p,
              studentName: fields.fullName !== undefined ? fields.fullName : p.studentName,
              studentEmail: fields.email !== undefined ? fields.email : p.studentEmail,
              studentPhone: fields.phone !== undefined ? fields.phone : p.studentPhone
            };
          }
          return p;
        });
        safeSetItem('ab_payments_v3', JSON.stringify(updatedPmts));
      }
    } catch (err) {
      console.warn('[ProfileSync] Error syncing profile into localStorage:', err);
    }

    // Trigger reactive window events
    try {
      window.dispatchEvent(new CustomEvent('user-profile-updated', { detail: updatedUser }));
      window.dispatchEvent(new Event('ab_students_updated'));
      window.dispatchEvent(new Event('ab_teachers_updated'));
      window.dispatchEvent(new Event('ab_enrollments_updated'));
      window.dispatchEvent(new Event('ab_users_updated'));
      window.dispatchEvent(new Event('ab_user_updated'));
      window.dispatchEvent(new Event('ab_payments_updated'));
      window.dispatchEvent(new Event('ab_transactions_updated'));
      window.dispatchEvent(new Event('storage'));
    } catch (e) {
      // Ignore if event dispatch fails
    }

    addNotification('Profile Updated', 'Your profile details have been saved successfully and synchronized across all portals.', 'system');
    return { success: true };
  };

  // NOTIFICATION UTILITIES
  const markNotificationAsRead = (id: string) => {
    const updated = allNotifications.map((n) => (n && n.id === id ? { ...n, isRead: true } : n));
    syncNotifications(updated);
  };

  const markAllNotificationsAsRead = () => {
    if (!currentUser) return;
    const userNotifIds = new Set(notifications.filter((n) => n && n.id).map((n) => n.id));
    const updated = allNotifications.map((n) => (n && userNotifIds.has(n.id) ? { ...n, isRead: true } : n));
    syncNotifications(updated);
  };

  const clearNotifications = () => {
    if (!currentUser) return;
    const userNotifIds = new Set(notifications.filter((n) => n && n.id).map((n) => n.id));
    const updated = allNotifications.filter((n) => !n || !userNotifIds.has(n.id));
    syncNotifications(updated);
  };

  const addNotification = (
    title: string,
    description: string,
    category: Notification['category'] = 'system',
    targetRole?: UserRole | UserRole[],
    targetUserId?: string,
    userEmail?: string
  ) => {
    const effectiveUserId = targetUserId || (!targetRole && !userEmail && currentUser ? currentUser.id : undefined);
    const effectiveUserEmail = userEmail || (!targetRole && !targetUserId && !effectiveUserId && currentUser ? currentUser.email : undefined);

    const newNotif: Notification = {
      id: Date.now().toString() + '_' + Math.random().toString(36).substring(2, 6),
      title,
      description,
      isRead: false,
      timestamp: new Date().toISOString(),
      category,
      targetRole,
      userId: effectiveUserId,
      userEmail: effectiveUserEmail
    };

    syncNotifications([newNotif, ...allNotifications]);
  };

  // SWITCH ROLE SIMULATION
  const switchRole = (role: UserRole) => {
    if (currentUser) {
      const updatedUser: User = { ...currentUser, role };
      setCurrentUser(updatedUser);
      safeSetItem('ab_session_user', JSON.stringify(updatedUser));
      addNotification('Role Switch Active', `Session role switched to ${role.replace('_', ' ').toUpperCase()}`, 'system');
    } else {
      const mockMatch = (Object.values(accounts) as (User & { password?: string })[]).find(a => a.role === role);
      const newUser: User = mockMatch ? (mockMatch as User) : {
        id: `usr_${role}_sim`,
        email: `${role}@begena.com`,
        phone: '+251911000000',
        role,
        status: 'Active',
        fullName: `${role.replace('_', ' ').toUpperCase()} User`,
        verified: true,
        language: 'en',
        notificationPreferences: { email: true, sms: true, push: true }
      };
      setCurrentUser(newUser);
      safeSetItem('ab_session_user', JSON.stringify(newUser));
      addNotification('Role Session Initialized', `Signed in as ${newUser.fullName} [${role}]`, 'system');
    }
  };

  // CENTRALIZED ROLE AND PERMISSION HELPER
  const hasPermission = (requiredRole: UserRole | UserRole[]): boolean => {
    if (!currentUser) return false;
    if (Array.isArray(requiredRole)) {
      return requiredRole.includes(currentUser.role);
    }
    return currentUser.role === requiredRole;
  };

  // PERMANENT DELETION OF STUDENT AUTH ACCOUNT
  const deleteStudentAccount = (studentId: string, email?: string, phone?: string) => {
    try {
      const savedDeleted = localStorage.getItem('ab_deleted_students_v3');
      const deletedList: string[] = savedDeleted ? JSON.parse(savedDeleted) : [];
      const toAdd = [studentId, email, phone].filter(Boolean) as string[];
      const newDeletedList = Array.from(new Set([...deletedList, ...toAdd]));
      localStorage.setItem('ab_deleted_students_v3', JSON.stringify(newDeletedList));

      setAccounts(prev => {
        const next = { ...prev };
        Object.keys(next).forEach(key => {
          const acc = next[key];
          if (!acc) return;
          if (
            acc.id === studentId ||
            (email && acc.email && acc.email.toLowerCase() === email.toLowerCase()) ||
            (phone && acc.phone && acc.phone.replace(/\D/g, '') === phone.replace(/\D/g, '')) ||
            (key && email && key.toLowerCase() === email.toLowerCase())
          ) {
            delete next[key];
          }
        });
        localStorage.setItem('ab_accounts', JSON.stringify(next));
        return next;
      });

      // Purge active user session if deleted user is currently logged in
      const currentSession = JSON.parse(localStorage.getItem('ab_session_user') || 'null');
      if (
        currentSession &&
        (currentSession.id === studentId ||
         (email && currentSession.email && currentSession.email.toLowerCase() === email.toLowerCase()) ||
         (phone && currentSession.phone && currentSession.phone.replace(/\D/g, '') === phone.replace(/\D/g, '')))
      ) {
        localStorage.removeItem('ab_session_user');
        setCurrentUser(null);
      }

      if (
        currentUser &&
        (currentUser.id === studentId ||
         (email && currentUser.email && currentUser.email.toLowerCase() === email.toLowerCase()) ||
         (phone && currentUser.phone && currentUser.phone.replace(/\D/g, '') === phone.replace(/\D/g, '')))
      ) {
        setCurrentUser(null);
      }

      window.dispatchEvent(new Event('ab_user_updated'));
      window.dispatchEvent(new Event('ab_session_invalidated'));
      window.dispatchEvent(new Event('storage'));
    } catch (e) {
      console.error('Error during deleteStudentAccount:', e);
    }
  };

  // STAFF & REGISTRATION ACCOUNT CREATION / UPGRADE HELPER
  const registerOrUpdateStudentAccount = (data: {
    id?: string;
    email: string;
    fullName: string;
    phone?: string;
    instrument: string;
    level?: string;
    password?: string;
    status?: AccountStatus;
    studentStatus?: StudentRegistrationStatus;
  }) => {
    try {
      const cleanEmail = data.email.trim().toLowerCase();
      const resolvedInst = normalizeInstrumentName(data.instrument);
      const resolvedLevel = data.level || 'Basic 1';
      const resolvedCourse = `${resolvedInst} - ${resolvedLevel}`;

      const newAccount: User & { password?: string } = {
        id: data.id || `stu_${Date.now()}`,
        email: cleanEmail,
        fullName: data.fullName,
        phone: data.phone || '+251 900 000 000',
        role: 'student',
        status: data.status || 'Active',
        studentStatus: data.studentStatus || 'Enrollment Active',
        isRegistrationCompleted: true,
        isPaymentCompleted: true,
        verified: true,
        enrolledInstrument: resolvedInst,
        enrolledCourse: resolvedCourse,
        avatar: '',
        language: 'am',
        notificationPreferences: { email: true, sms: true, push: true },
        password: data.password || 'Password123!'
      };

      setAccounts(prev => {
        const next = { ...prev, [cleanEmail]: { ...prev[cleanEmail], ...newAccount } };
        localStorage.setItem('ab_accounts', JSON.stringify(next));
        return next;
      });

      if (currentUser && currentUser.email.toLowerCase() === cleanEmail) {
        const updatedUser: User = { ...currentUser, ...newAccount };
        setCurrentUser(updatedUser);
        localStorage.setItem('ab_session_user', JSON.stringify(updatedUser));
      }

      window.dispatchEvent(new Event('ab_user_updated'));
      window.dispatchEvent(new Event('storage'));
    } catch (e) {
      console.error('Error in registerOrUpdateStudentAccount:', e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        notifications,
        unreadNotificationsCount,
        isEmailJsConfigured,
        verificationEmailNotice,
        login,
        registerUser,
        logout,
        verifyCode,
        resendVerificationCode,
        sendTelegramVerificationCode,
        forgotPassword,
        resetPassword,
        updateProfile,
        changePassword,
        getAuthoritativeUser,
        markNotificationAsRead,
        markAsRead: markNotificationAsRead,
        clearNotifications,
        markAllNotificationsAsRead,
        addNotification,
        switchRole,
        hasPermission,
        deleteStudentAccount,
        registerOrUpdateStudentAccount
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

