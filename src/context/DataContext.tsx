import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole, PersistentTeacher, StudentEnrollment } from '../types';
import { ABEL_BEGENA_PHOTO } from '../data/websiteData';
import { safeSetItem } from '../utils/storage';
import { buildPaymentApprovalSyncState, resolvePaymentIdForTransaction } from '../utils/accountantVerification';
import { generateStudentRegistrationId } from '../utils/studentRegistrationId';

export type { PersistentTeacher, StudentEnrollment };

export interface PersistentStudent {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  gender: string;
  age: number;
  emergencyContact: string;
  address: string;
  previousExperience: string;
  instrumentOwned: string;
  churchName?: string;
  occupation?: string;
  educationInfo?: string;
  photoUrl?: string;
  studentRegistrationId?: string;
  courseId: string;
  courseName: string;
  instrument: string;
  level: string;
  branch: string;
  learningMode: 'In-Person' | 'Online' | 'Hybrid';
  scheduleFrequency?: '2 Days' | '3 Days' | '5 Days';
  scheduleDays?: string[];
  scheduleDayTime?: string;
  schedule?: string;
  classTime?: string;
  durationMonths?: number;
  registrationFeeETB?: number;
  courseFeeETB?: number;
  totalFeeETB?: number;
  status: 'Draft' | 'Submitted' | 'Under Review' | 'Approved' | 'Rejected' | 'Needs Correction' | 'Suspended' | 'Archived';
  paymentStatus: 'Pending' | 'Under Review' | 'Approved' | 'Rejected' | 'Requires Correction';
  paymentReference?: string;
  paymentProofUrl?: string;
  paymentMethod?: 'Cash' | 'CBE' | 'Telebirr' | 'Direct Transfer';
  registrationSource?: 'Self-Registered' | 'Registered by Accountant' | 'Registered by Staff' | 'Registered by Admin';
  registeredBy?: string;
  registeredAt: string;
  approvedAt?: string;
  approvedBy?: string;
  assignedTeacherId?: string;
  assignedTeacherName?: string;
  accountStatus?: 'Active' | 'Pending Verification' | 'Locked' | 'Suspended';
}

export interface PersistentPayment {
  id: string; // e.g. PAY-2026-9912
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  courseName: string;
  instrument?: string;
  branch: string;
  learningMode?: string;
  amountETB: number;
  paymentMethod: 'Telebirr' | 'CBE' | 'Cash' | 'Direct Transfer';
  referenceNumber: string;
  paymentDate?: string;
  screenshotUrl?: string;
  studentPhotoUrl?: string;
  status: 'Pending' | 'Under Review' | 'Approved' | 'Rejected' | 'Requires Correction';
  rejectionReason?: string;
  createdAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  receiptNumber?: string;
}

export interface PersistentMediaAsset {
  id: string;
  url: string;
  title: string;
  caption: string;
  category: string;
  placement: 'Gallery' | 'Hero' | 'Course' | 'Teacher Profile' | 'Event';
  altText: string;
  status: 'Draft' | 'Published' | 'Unpublished';
  isPublished: boolean;
  uploadedBy: string;
  uploadedAt: string;
  photoDate?: string;
  location?: string;
  fileSizeKB?: number;
}

export interface PersistentAuditLog {
  id: string;
  timestamp: string;
  userEmail: string;
  userName: string;
  userRole: UserRole;
  action: string;
  module: string;
  details: string;
  ipAddress?: string;
}

export interface PersistentAttendance {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail?: string;
  enrollmentId?: string;
  courseName: string;
  branch: string;
  date: string;
  status: 'Present' | 'Absent' | 'Late' | 'Excused';
  recordedBy: string;
  className?: string;
  notes?: string;
}

export interface PersistentAssignment {
  id: string;
  title: string;
  courseName: string;
  studentId: string;
  studentName: string;
  submissionUrl?: string;
  submissionDate?: string;
  grade?: string;
  feedback?: string;
  status: 'Pending Submission' | 'Submitted' | 'Graded';
}

export interface SystemSettings {
  schoolName: string;
  schoolAmharicName: string;
  founderName: string;
  contactPhone: string;
  contactEmail: string;
  primaryBranch: string;
  registrationFeeETB: number;
  heroHeadline: string;
  heroSubheadline: string;
  enableTelebirrAutoCheck: boolean;
  enableSmsNotifications: boolean;
}

import begenaPlayingImg from '../assets/images/begena_playing.jpg';
import keberoPlayingImg from '../assets/images/kebero_playing.jpg';
import krarImg from '../assets/images/krar.jpg';

const localGalleryImageModules = import.meta.glob<{ default: string }>(
  '/src/assets/images/*.{jpg,jpeg,png,webp,svg,JPG,JPEG,PNG,WEBP}',
  { eager: true }
);

function resolveLocalGalleryImage(imageNumber: number): string {
  for (const [key, mod] of Object.entries(localGalleryImageModules)) {
    const baseName = key.replace('/src/assets/images/', '').replace(/\.[^.]+$/, '');
    const match = baseName.match(/\d+/);
    if (match && Number(match[0]) === imageNumber) {
      return typeof mod === 'string' ? mod : (mod as any).default || ABEL_BEGENA_PHOTO;
    }
  }
  return ABEL_BEGENA_PHOTO;
}

const LOCAL_GALLERY_IMAGES = Array.from({ length: 23 }, (_, index) => resolveLocalGalleryImage(index + 1));

function ensureStudentRegistrationIds(studentRecords: any[]): any[] {
  const existingIds: string[] = studentRecords
    .map((s) => s?.studentRegistrationId)
    .filter(Boolean) as string[];

  return studentRecords.map((s) => {
    if (s?.studentRegistrationId) return s;
    const newId = generateStudentRegistrationId(existingIds, s?.registeredAt || new Date().toISOString());
    existingIds.push(newId);
    return { ...s, studentRegistrationId: newId };
  });
}

interface DataContextType {
  students: PersistentStudent[];
  payments: PersistentPayment[];
  mediaAssets: PersistentMediaAsset[];
  mediaCategories: string[];
  auditLogs: PersistentAuditLog[];
  attendances: PersistentAttendance[];
  assignments: PersistentAssignment[];
  teachers: PersistentTeacher[];
  enrollments: StudentEnrollment[];
  systemSettings: SystemSettings;
  
  // Action Handlers
  addStudentRegistration: (data: Omit<PersistentStudent, 'id' | 'registeredAt' | 'status' | 'paymentStatus'>) => PersistentStudent;
  submitPaymentReceipt: (data: Omit<PersistentPayment, 'id' | 'createdAt' | 'status'>) => PersistentPayment;
  approvePaymentRecord: (paymentId: string, reviewerName: string) => boolean;
  rejectPaymentRecord: (paymentId: string, reviewerName: string, reason: string) => boolean;
  requestCorrectionPaymentRecord: (paymentId: string, reviewerName: string, reason: string) => boolean;
  recordAttendance: (studentId: string, studentName: string, courseName: string, branch: string, status: 'Present' | 'Absent' | 'Late' | 'Excused', teacherName: string) => void;
  submitAssignment: (assignmentId: string, submissionUrl: string) => void;
  gradeAssignment: (assignmentId: string, grade: string, feedback: string) => void;
  addMediaAsset: (data: Omit<PersistentMediaAsset, 'id' | 'uploadedAt'>) => PersistentMediaAsset;
  updateMediaAsset: (mediaId: string, updatedData: Partial<PersistentMediaAsset>) => void;
  deleteMediaAsset: (mediaId: string) => void;
  toggleMediaPublished: (mediaId: string) => void;
  setMediaStatus: (mediaId: string, status: 'Draft' | 'Published' | 'Unpublished') => void;
  addMediaCategory: (categoryName: string) => boolean;
  renameMediaCategory: (oldName: string, newName: string) => boolean;
  deleteMediaCategory: (categoryName: string, targetMoveCategory: string) => boolean;
  updateSystemSettings: (newSettings: Partial<SystemSettings>) => void;
  addAuditEntry: (action: string, module: string, details: string, userName?: string, userEmail?: string, userRole?: UserRole) => void;
  
  // Teacher & Enrollment Handlers
  addStudentEnrollment: (data: Omit<StudentEnrollment, 'id' | 'enrollmentDate' | 'assignmentStatus' | 'progressPercent'>, staffOrSystemName?: string) => StudentEnrollment;
  autoAssignTeachersForUnassignedEnrollments: () => { processed: number; assigned: number; pending: number; summaryMessage: string; details: Array<{ studentName: string; status: 'Assigned' | 'Pending'; reason: string }>; };
  autoAssignTeacherForEnrollment: (enrollmentId: string) => { success: boolean; teacherName?: string; message: string };
  assignTeacherToEnrollment: (enrollmentId: string, teacherId: string, assignedByStaffName: string) => { success: boolean; message: string };
  updateTeacherSpecializations: (teacherId: string, specializations: string[], branches: string[], capacity: number, supportsOnline: boolean, supportsInPerson: boolean, telegramUsername?: string) => void;
  updateTeacherTelegramUsername: (teacherId: string, telegramUsername: string) => void;
  addTeacher: (teacherData: Omit<PersistentTeacher, 'id'>) => PersistentTeacher;
  resetToInitialSeedData: () => void;
  deleteStudent: (studentId: string) => boolean;
}

const DEFAULT_SETTINGS: SystemSettings = {
  schoolName: 'Abel Begena School',
  schoolAmharicName: 'አቤል በገና ትምህርት ቤት',
  founderName: 'Zemari Deacon Abel Tesfaye',
  contactPhone: '+251 911 000 000',
  contactEmail: 'info@abelbegena.com',
  primaryBranch: 'Piazza Branch',
  registrationFeeETB: 500,
  heroHeadline: 'Preserving Ethiopia Classical Sacred Music Heritage',
  heroSubheadline: 'Comprehensive traditional instruction in Begena, Krar, Masenqo, Washint, Vocal, and Kebero across Addis Ababa and online globally.',
  enableTelebirrAutoCheck: true,
  enableSmsNotifications: true
};

export const DEFAULT_MEDIA_CATEGORIES = [
  'School Events',
  'Begena',
  'Krar',
  'Masenqo',
  'Washint',
  'Vocal',
  'Kebero',
  'Classes',
  'Student Activities',
  'Teachers',
  'Branches',
  'Performances',
  'Competitions',
  'Graduation',
  'Certificates',
  'Workshops',
  'Church / Spiritual',
  'School Life',
  'Other'
];

const INITIAL_MEDIA_ASSETS: PersistentMediaAsset[] = LOCAL_GALLERY_IMAGES.map((imageUrl, index) => {
  const photoDate = new Date(2026, 6, index + 1).toISOString().split('T')[0];
  return {
    id: `gallery_${index + 1}`,
    url: imageUrl,
    title: `Gallery Image ${index + 1}`,
    caption: `Newly uploaded gallery image ${index + 1}`,
    category: index % 2 === 0 ? 'School Life' : 'Begena',
    placement: 'Gallery',
    altText: `Gallery image ${index + 1}`,
    status: 'Published',
    isPublished: true,
    uploadedBy: 'founder@begena.com',
    uploadedAt: new Date(2026, 6, index + 1).toISOString(),
    photoDate,
    location: 'Abel Begena School',
    fileSizeKB: 320 + index
  };
});

const INITIAL_STUDENTS: PersistentStudent[] = [];
const INITIAL_PAYMENTS: PersistentPayment[] = [];
const INITIAL_AUDIT_LOGS: PersistentAuditLog[] = [];
const INITIAL_TEACHERS: PersistentTeacher[] = [
  {
    id: 'tch_abel',
    email: 'teacher@begena.com',
    fullName: 'Lique Mezemer Abel Tesfaye',
    phone: '+251 911 123 456',
    photo: '',
    specializations: ['Begena', 'Vocal', 'Zema'],
    branches: ['Piazza Branch', 'Bole Branch', 'Megenagna Branch'],
    supportsOnline: true,
    supportsInPerson: true,
    capacity: 50,
    status: 'Active',
    bio: 'Founder & Master Teacher of Begena and Liturgical Zema with over 22 years of experience.',
    telegramUsername: 'abel_begena'
  },
  {
    id: 'tch_alex',
    email: 'alex@begena.com',
    fullName: 'Alex T',
    phone: '+251 922 234 567',
    photo: '',
    specializations: ['Krar', 'Kirar', 'Vocal', 'Kebero'],
    branches: ['Piazza Branch', 'Bole Branch'],
    supportsOnline: true,
    supportsInPerson: true,
    capacity: 40,
    status: 'Active',
    bio: 'Virtuoso Krar player and traditional vocal coach specializing in pentatonic modes.',
    telegramUsername: 'alex_krar'
  },
  {
    id: 'tch_hayle',
    email: 'hayle@begena.com',
    fullName: 'Hayle Melekot',
    phone: '+251 933 345 678',
    photo: '',
    specializations: ['Masenqo', 'Masinqo', 'Washint'],
    branches: ['Piazza Branch', 'Megenagna Branch'],
    supportsOnline: true,
    supportsInPerson: true,
    capacity: 35,
    status: 'Active',
    bio: 'Acclaimed Masenqo bowed-lute master and traditional improvisational artist.',
    telegramUsername: 'hayle_masenqo'
  },
  {
    id: 'tch_bruk',
    email: 'bruk@begena.com',
    fullName: 'Bruk Tesfaye',
    phone: '+251 944 456 789',
    photo: '',
    specializations: ['Begena', 'Washint'],
    branches: ['Bole Branch', 'Piazza Branch'],
    supportsOnline: true,
    supportsInPerson: true,
    capacity: 35,
    status: 'Active',
    bio: 'Master Begena and Washint flute instructor focusing on classical techniques.',
    telegramUsername: 'bruk_begena'
  },
  {
    id: 'tch_merawi',
    email: 'merawi@begena.com',
    fullName: 'Mezemer Merawi Wolde',
    phone: '+251 955 567 890',
    photo: '',
    specializations: ['Kebero', 'Vocal', 'Zema'],
    branches: ['Piazza Branch', 'Bole Branch', 'Megenagna Branch'],
    supportsOnline: true,
    supportsInPerson: true,
    capacity: 30,
    status: 'Active',
    bio: 'Lead ecclesiastical Kebero drummer and liturgical rhythm specialist.',
    telegramUsername: 'merawi_kebero'
  }
];

const EXPECTED_TEACHER_IDS = new Set(INITIAL_TEACHERS.map((teacher) => teacher.id));

function loadSavedTeachers(): PersistentTeacher[] {
  const saved = localStorage.getItem('ab_teachers_v4');
  if (!saved) return INITIAL_TEACHERS;

  try {
    const parsed = JSON.parse(saved);
    if (Array.isArray(parsed) && parsed.length > 0) {
      const storedHasExpected = parsed.some((item: any) => EXPECTED_TEACHER_IDS.has(item?.id));
      if (storedHasExpected) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to parse ab_teachers_v4. Using INITIAL_TEACHERS.', e);
  }

  return INITIAL_TEACHERS;
}

const INITIAL_ENROLLMENTS: StudentEnrollment[] = [];

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [students, setStudents] = useState<PersistentStudent[]>(() => {
    const saved = localStorage.getItem('ab_students_v4');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return ensureStudentRegistrationIds(parsed);
        }
      } catch (e) {}
    }
    return INITIAL_STUDENTS;
  });

  const [payments, setPayments] = useState<PersistentPayment[]>(() => {
    const saved = localStorage.getItem('ab_payments_v4');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_PAYMENTS;
  });

  const [teachers, setTeachers] = useState<PersistentTeacher[]>(() => {
    const saved = localStorage.getItem('ab_teachers_v4');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const expectedTeacherIds = new Set(INITIAL_TEACHERS.map((t) => t.id));
          const storedHasExpected = parsed.some((item: any) => expectedTeacherIds.has(item?.id));

          if (storedHasExpected) {
            return parsed;
          }

          console.warn('Stored teachers do not include expected seeded teacher IDs. Resetting to INITIAL_TEACHERS.');
        }
      } catch (e) {
        console.warn('Failed to parse ab_teachers_v4. Using INITIAL_TEACHERS.', e);
      }
    }
    return INITIAL_TEACHERS;
  });

  const [enrollments, setEnrollments] = useState<StudentEnrollment[]>(() => {
    const saved = localStorage.getItem('ab_enrollments_v4');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Filter out sample seed enrollments
          const filtered = parsed.filter((e: any) =>
            e &&
            !['ENR-BEG-001', 'ENR-KRA-002', 'ENR-MAS-003', 'ENR-WAS-004', 'ENR-KEB-005'].includes(e.id) &&
            !['student@begena.com', 'kirar.student@begena.com', 'solomon@begena.com', 'marta@begena.com', 'tewodros@begena.com'].includes(e.studentEmail) &&
            !['Dawit Yohannes', 'Abebe Kebede', 'Solomon Worku', 'Marta Hailu', 'Tewodros Girma'].includes(e.studentName)
          );

          // Deduplicate saved enrollments by student identity
          const seen = new Set<string>();
          const deduplicated: StudentEnrollment[] = [];
          filtered.forEach((enr: any) => {
            const key = (enr.studentEmail || '').toLowerCase().trim() ||
                        (enr.studentId || '').toLowerCase().trim() ||
                        (enr.studentName || '').toLowerCase().trim() ||
                        enr.id;
            if (key && !seen.has(key)) {
              seen.add(key);
              deduplicated.push(enr);
            }
          });
          return deduplicated;
        }
      } catch (e) {}
    }
    return INITIAL_ENROLLMENTS;
  });

  const [mediaAssets, setMediaAssets] = useState<PersistentMediaAsset[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ab_media_assets_v4');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) return parsed;
        } catch (e) {}
      }
    }
    return INITIAL_MEDIA_ASSETS;
  });

  const [mediaCategories, setMediaCategories] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ab_media_categories_v4');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        } catch (e) {}
      }
    }
    return DEFAULT_MEDIA_CATEGORIES;
  });

  const [auditLogs, setAuditLogs] = useState<PersistentAuditLog[]>(() => {
    const saved = localStorage.getItem('ab_audit_logs_v4');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_AUDIT_LOGS;
  });

  const loadCombinedAttendances = (): PersistentAttendance[] => {
    const map = new Map<string, PersistentAttendance>();

    // 1. Load from ab_attendance_records_v4 (saved by Registration staff portal and Attendance Center)
    try {
      const savedRecs = localStorage.getItem('ab_attendance_records_v4');
      if (savedRecs) {
        const parsed = JSON.parse(savedRecs);
        if (Array.isArray(parsed)) {
          parsed.forEach((r: any) => {
            if (!r) return;
            const rawStatus = r.status || 'Present';
            const status = rawStatus === 'Permission' ? 'Excused' : rawStatus;
            const item: PersistentAttendance = {
              id: r.id || `att_${r.studentId}_${r.date}`,
              studentId: r.studentId || '',
              studentName: r.studentName || 'Student',
              studentEmail: r.studentEmail || '',
              enrollmentId: r.enrollmentId,
              courseName: r.courseName || r.instrument || r.className || 'Begena Course',
              branch: r.branch || 'Piazza Main Branch',
              date: r.date || new Date().toISOString().split('T')[0],
              status,
              recordedBy: r.markedByName || r.markedByRole || r.recordedBy || 'Campus Staff',
              className: r.courseName || r.instrument || r.className,
              notes: r.permissionNote || r.notes || r.permissionReason
            };
            const key = r.id || `${r.studentId || r.studentName}_${r.date}_${r.courseName || ''}`;
            map.set(key, item);
          });
        }
      }
    } catch (e) {}

    // 2. Load from ab_attendance_v4
    try {
      const savedAtt = localStorage.getItem('ab_attendance_v4');
      if (savedAtt) {
        const parsed = JSON.parse(savedAtt);
        if (Array.isArray(parsed)) {
          parsed.forEach((r: any) => {
            if (!r) return;
            const key = r.id || `${r.studentId || r.studentName}_${r.date}_${r.className || ''}`;
            if (!map.has(key)) {
              map.set(key, r);
            }
          });
        }
      }
    } catch (e) {}

    return Array.from(map.values());
  };

  const [attendances, setAttendances] = useState<PersistentAttendance[]>(() => loadCombinedAttendances());

  const [assignments, setAssignments] = useState<PersistentAssignment[]>(() => {
    const saved = localStorage.getItem('ab_assignments_v4');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [];
  });

  const [systemSettings, setSystemSettings] = useState<SystemSettings>(() => {
    const saved = localStorage.getItem('ab_system_settings_v4');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return DEFAULT_SETTINGS;
  });

  // Save changes to localStorage on updates
  useEffect(() => {
    safeSetItem('ab_students_v4', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    safeSetItem('ab_payments_v4', JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    safeSetItem('ab_media_assets_v4', JSON.stringify(mediaAssets));
  }, [mediaAssets]);

  useEffect(() => {
    safeSetItem('ab_media_categories_v4', JSON.stringify(mediaCategories));
  }, [mediaCategories]);

  useEffect(() => {
    safeSetItem('ab_audit_logs_v4', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    safeSetItem('ab_attendance_v4', JSON.stringify(attendances));
    safeSetItem('ab_attendance_records_v4', JSON.stringify(attendances));
  }, [attendances]);

  // Real-time synchronization event listener for attendance updates from Staff or Operations
  useEffect(() => {
    const syncAllFromStorage = () => {
      const refreshed = loadCombinedAttendances();
      setAttendances(refreshed);

      try {
        const savedStus = localStorage.getItem('ab_students_v4') || localStorage.getItem('ab_students_v3');
        if (savedStus) {
          const parsed = JSON.parse(savedStus);
          if (Array.isArray(parsed) && parsed.length > 0) setStudents(parsed);
        }
      } catch (e) {}

      try {
        const savedEnrs = localStorage.getItem('ab_enrollments_v4');
        if (savedEnrs) {
          const parsed = JSON.parse(savedEnrs);
          if (Array.isArray(parsed) && parsed.length > 0) setEnrollments(parsed);
        }
      } catch (e) {}

      try {
        const savedTeachers = localStorage.getItem('ab_teachers_v4') || localStorage.getItem('ab_teachers_v3');
        if (savedTeachers) {
          const parsed = JSON.parse(savedTeachers);
          if (Array.isArray(parsed) && parsed.length > 0) setTeachers(parsed);
        }
      } catch (e) {}
    };

    window.addEventListener('ab_students_updated', syncAllFromStorage);
    window.addEventListener('ab_enrollments_updated', syncAllFromStorage);
    window.addEventListener('ab_user_updated', syncAllFromStorage);
    window.addEventListener('user-profile-updated', syncAllFromStorage);
    window.addEventListener('storage', syncAllFromStorage);
    return () => {
      window.removeEventListener('ab_students_updated', syncAllFromStorage);
      window.removeEventListener('ab_enrollments_updated', syncAllFromStorage);
      window.removeEventListener('ab_user_updated', syncAllFromStorage);
      window.removeEventListener('user-profile-updated', syncAllFromStorage);
      window.removeEventListener('storage', syncAllFromStorage);
    };
  }, []);

  useEffect(() => {
    safeSetItem('ab_assignments_v4', JSON.stringify(assignments));
  }, [assignments]);

  useEffect(() => {
    safeSetItem('ab_teachers_v4', JSON.stringify(teachers));
  }, [teachers]);

  useEffect(() => {
    safeSetItem('ab_enrollments_v4', JSON.stringify(enrollments));
  }, [enrollments]);

  useEffect(() => {
    safeSetItem('ab_system_settings_v4', JSON.stringify(systemSettings));
  }, [systemSettings]);

  // Auto-scan unassigned active enrollments on startup
  useEffect(() => {
    const unassignedActive = enrollments.filter(e =>
      e.status === 'Active' && (!e.assignedTeacherId || !e.assignedTeacherName || e.assignmentStatus === 'Pending Teacher Assignment')
    );
    if (unassignedActive.length > 0) {
      autoAssignTeachersForUnassignedEnrollments();
    }
  }, [enrollments.length]);

  const normalizeInstrument = (str?: string) => {
    if (!str) return '';
    const l = str.toLowerCase().trim();
    if (l.includes('begena') || l.includes('በገና')) return 'begena';
    if (l.includes('krar') || l.includes('kirar') || l.includes('krara') || l.includes('ክራር') || l.includes('ቅራር') || l.includes('ከራር')) return 'krar';
    if (l.includes('masenqo') || l.includes('masinqo') || l.includes('masinko') || l.includes('ማሰንቆ') || l.includes('ማስንቆ')) return 'masenqo';
    if (l.includes('washint') || l.includes('flute') || l.includes('ዋሽንት')) return 'washint';
    if (l.includes('kebero') || l.includes('drum') || l.includes('ከበሮ')) return 'kebero';
    if (l.includes('vocal') || l.includes('voice') || l.includes('zema') || l.includes('mezmur') || l.includes('ድምፅ') || l.includes('ድምጽ') || l.includes('ዜማ') || l.includes('መዝሙር')) return 'vocal';
    return l.replace(/[^a-z0-9]/g, '');
  };

  const isFakeEnrollment = (enrollment: Partial<StudentEnrollment>) => {
    const fakeIds = new Set(['ENR-BEG-001', 'ENR-KRA-002', 'ENR-MAS-003', 'ENR-WAS-004', 'ENR-KEB-005', 'stu_sample_1', 'stu_sample_2']);
    const fakeEmails = new Set(['student@begena.com', 'kirar.student@begena.com', 'solomon@begena.com', 'marta@begena.com', 'tewodros@begena.com', 'sample@begena.com']);
    const fakeNames = new Set(['Dawit Yohannes', 'Abebe Kebede', 'Solomon Worku', 'Marta Hailu', 'Tewodros Girma', 'Sample Student']);
    
    if (enrollment.id && fakeIds.has(enrollment.id)) return true;
    if (enrollment.studentEmail && fakeEmails.has(enrollment.studentEmail.toLowerCase().trim())) return true;
    if (enrollment.studentName && fakeNames.has(enrollment.studentName.trim())) return true;
    return false;
  };

  const teacherSupportsMode = (teacher: PersistentTeacher, mode?: string) => {
    if (!mode) return true;
    const m = mode.toLowerCase();
    if (m.includes('online') || m.includes('virtual')) return teacher.supportsOnline;
    if (m.includes('in-person') || m.includes('person') || m.includes('campus')) return teacher.supportsInPerson;
    if (m.includes('hybrid')) return teacher.supportsOnline || teacher.supportsInPerson;
    return true;
  };

  const teacherHasBranch = (teacher: PersistentTeacher, branch?: string, mode?: string) => {
    if (!mode || mode.toLowerCase().includes('online') || mode.toLowerCase().includes('virtual')) return true;
    if (!branch || branch.toLowerCase().includes('online') || branch.toLowerCase().includes('virtual')) return true;
    const branchNorm = branch.toLowerCase().trim();
    if (!teacher.branches || teacher.branches.length === 0) return true;
    return teacher.branches.some(b => {
      const tbNorm = b.toLowerCase().trim();
      return tbNorm.includes(branchNorm) || branchNorm.includes(tbNorm) ||
             (branchNorm.includes('piazza') && tbNorm.includes('piazza')) ||
             (branchNorm.includes('bole') && tbNorm.includes('bole')) ||
             (branchNorm.includes('megenagna') && tbNorm.includes('megenagna'));
    });
  };

  const countTeacherWorkload = (teacherId: string, sourceEnrollments: StudentEnrollment[]) =>
    sourceEnrollments.filter(e =>
      e.status === 'Active' &&
      !isFakeEnrollment(e) &&
      (e.assignedTeacherId === teacherId ||
       (e.assignedTeacherEmail && e.assignedTeacherEmail.toLowerCase() === teacherId.toLowerCase()))
    ).length;

  const selectQualifiedTeacherForEnrollment = (
    enrollment: StudentEnrollment,
    sourceEnrollments: StudentEnrollment[]
  ): { teacher?: PersistentTeacher; reason?: string } => {
    const rawInstrument = enrollment.instrument || enrollment.courseName || '';
    const targetInstrument = normalizeInstrument(rawInstrument);

    if (!targetInstrument) {
      return { reason: `Student course/instrument ("${rawInstrument || 'Unspecified'}") is not recognized.` };
    }

    const studentMode = enrollment.learningMode || 'In-Person';
    const studentBranch = enrollment.branch || '';

    // Filter active candidates matching specialization, learning mode, and campus branch
    const matchingTeachers = teachers.filter(t => {
      if (t.status !== 'Active') return false;

      // 1. Specialization match
      const teacherSpecs = (t.specializations || []).map(s => normalizeInstrument(s));
      const matchesSpec = teacherSpecs.includes(targetInstrument) ||
                          teacherSpecs.some(s => s && (s.includes(targetInstrument) || targetInstrument.includes(s)));
      if (!matchesSpec) return false;

      // 2. Learning Mode match
      if (!teacherSupportsMode(t, studentMode)) return false;

      // 3. Branch match
      if (!teacherHasBranch(t, studentBranch, studentMode)) return false;

      return true;
    });

    if (matchingTeachers.length === 0) {
      const specMatches = teachers.filter(t => t.status === 'Active' && (t.specializations || []).some(s => normalizeInstrument(s) === targetInstrument));
      if (specMatches.length === 0) {
        return { reason: `No active teacher specializes in ${rawInstrument || targetInstrument}.` };
      }
      const modeMatches = specMatches.filter(t => teacherSupportsMode(t, studentMode));
      if (modeMatches.length === 0) {
        return { reason: `No active ${rawInstrument} teacher supports ${studentMode} learning mode.` };
      }
      return { reason: `No active ${rawInstrument} teacher (${studentMode}) is available at ${studentBranch || 'the required branch'}.` };
    }

    // Sort matching teachers by lowest workload first, then capacity headroom, then stable teacher ID
    const withWorkload = matchingTeachers.map(t => {
      const currentLoad = countTeacherWorkload(t.id, sourceEnrollments);
      const cap = t.capacity || 35;
      return { teacher: t, workload: currentLoad, capacity: cap, remaining: cap - currentLoad };
    }).sort((a, b) => {
      if (a.workload !== b.workload) return a.workload - b.workload;
      if (a.remaining !== b.remaining) return b.remaining - a.remaining;
      return a.teacher.id.localeCompare(b.teacher.id);
    });

    const availableCandidates = withWorkload.filter(c => c.workload < c.capacity);
    if (availableCandidates.length === 0) {
      const teacherNames = matchingTeachers.map(t => t.fullName).join(', ');
      return { reason: `All qualified teachers (${teacherNames}) for ${rawInstrument} are currently at maximum capacity.` };
    }

    return { teacher: availableCandidates[0].teacher };
  };

  const autoAssignTeachersForUnassignedEnrollments = () => {
    const now = new Date().toISOString();

    // 1. Gather any active approved students from students list who do not have an enrollment record yet
    const existingEnrStudentIds = new Set(
      enrollments.map(e => e.studentId?.toLowerCase().trim() || e.studentEmail?.toLowerCase().trim()).filter(Boolean)
    );

    const missingStudentEnrollments: StudentEnrollment[] = [];
    students.forEach(st => {
      const stKey = st.id?.toLowerCase().trim() || st.email?.toLowerCase().trim();
      const isFake = isFakeEnrollment({ id: st.id, studentEmail: st.email, studentName: st.fullName });
      if (!stKey || existingEnrStudentIds.has(stKey) || isFake) return;

      const stStatus = String(st.status || '');
      const isApprovedActive = stStatus === 'Approved' || (st as any).paymentStatus === 'Approved' || (st as any).tuitionPaid === true;
      if (!isApprovedActive) return;

      const rawInst = st.instrument || st.courseName || st.courseId;
      if (!rawInst) return; // Must have an explicit instrument/course selected

      const courseTitle = st.courseName || `${st.instrument} ${st.level || 'Basic 1'}`;

      const newEnr: StudentEnrollment = {
        id: `ENR-AUTO-${Math.floor(100000 + Math.random() * 900000)}`,
        studentId: st.id,
        studentName: st.fullName,
        studentEmail: st.email,
        studentPhone: st.phone,
        courseId: (st.courseId || st.instrument || '').toLowerCase(),
        courseName: courseTitle,
        instrument: st.instrument || st.courseName || '',
        level: st.level || 'Basic 1',
        learningMode: st.learningMode || 'In-Person',
        branch: st.branch || 'Piazza Branch',
        status: 'Active',
        assignmentStatus: 'Pending Teacher Assignment',
        progressPercent: 0,
        enrollmentDate: now
      };
      missingStudentEnrollments.push(newEnr);
    });

    const combinedWorkingEnrollments = [...enrollments, ...missingStudentEnrollments];

    // Find all active unassigned enrollments
    const activeUnassigned = combinedWorkingEnrollments.filter(e => {
      if (e.status !== 'Active') return false;
      if (isFakeEnrollment(e)) return false;

      const hasTeacherId = Boolean(e.assignedTeacherId && e.assignedTeacherId.trim() !== '' && e.assignedTeacherId !== 'unassigned');
      const hasTeacherName = Boolean(e.assignedTeacherName && e.assignedTeacherName !== 'Not Assigned Yet' && e.assignedTeacherName !== 'None');
      const isAssignedStatus = e.assignmentStatus === 'Assigned' || (e as any).teacherAssignmentStatus === 'ASSIGNED';

      return !hasTeacherId || !hasTeacherName || !isAssignedStatus || e.assignmentStatus === 'Pending Teacher Assignment';
    });

    const assignmentDetails: Array<{
      studentId: string;
      studentName: string;
      courseName: string;
      status: 'Assigned' | 'Pending';
      teacherName?: string;
      teacherId?: string;
      reason: string;
    }> = [];

    const updatedEnrollments = combinedWorkingEnrollments.map(e => ({ ...e }));
    const updatedTeacherLoad = new Map<string, number>();

    const getWorkload = (teacherId: string) => {
      if (updatedTeacherLoad.has(teacherId)) return updatedTeacherLoad.get(teacherId)!;
      const count = countTeacherWorkload(teacherId, updatedEnrollments);
      updatedTeacherLoad.set(teacherId, count);
      return count;
    };

    let assignedCount = 0;
    let processedCount = 0;

    activeUnassigned.forEach(enrollment => {
      processedCount++;
      const { teacher, reason } = selectQualifiedTeacherForEnrollment(enrollment, updatedEnrollments);

      if (!teacher) {
        const mappingIndex = updatedEnrollments.findIndex(e => e.id === enrollment.id);
        if (mappingIndex !== -1) {
          updatedEnrollments[mappingIndex] = {
            ...updatedEnrollments[mappingIndex],
            assignedTeacherId: undefined,
            assignedTeacherName: undefined,
            assignedTeacherEmail: undefined,
            assignmentStatus: 'Pending Teacher Assignment'
          };
        }
        assignmentDetails.push({
          studentId: enrollment.studentId || enrollment.id,
          studentName: enrollment.studentName,
          courseName: enrollment.courseName || enrollment.instrument || 'Music Course',
          status: 'Pending',
          reason: reason || 'No suitable teacher available for this course/branch/mode combination.'
        });
        return;
      }

      const currentWorkload = getWorkload(teacher.id);
      const cap = teacher.capacity || 35;
      if (currentWorkload >= cap) {
        assignmentDetails.push({
          studentId: enrollment.studentId || enrollment.id,
          studentName: enrollment.studentName,
          courseName: enrollment.courseName || enrollment.instrument || 'Music Course',
          status: 'Pending',
          reason: `Teacher ${teacher.fullName} (${teacher.id}) is at maximum student capacity (${currentWorkload}/${cap}).`
        });
        return;
      }

      const mappingIndex = updatedEnrollments.findIndex(e => e.id === enrollment.id);
      if (mappingIndex !== -1) {
        updatedEnrollments[mappingIndex] = {
          ...updatedEnrollments[mappingIndex],
          assignedTeacherId: teacher.id,
          assignedTeacherName: teacher.fullName,
          assignedTeacherEmail: teacher.email,
          assignmentStatus: 'Assigned',
          teacherAssignmentStatus: 'ASSIGNED',
          assignedAt: now,
          assignedBy: 'System (Auto-Assign)'
        };
      }

      updatedTeacherLoad.set(teacher.id, currentWorkload + 1);
      assignedCount++;
      assignmentDetails.push({
        studentId: enrollment.studentId || enrollment.id,
        studentName: enrollment.studentName,
        courseName: enrollment.courseName || enrollment.instrument || 'Music Course',
        status: 'Assigned',
        teacherName: teacher.fullName,
        teacherId: teacher.id,
        reason: `Assigned to ${teacher.fullName} (ID: ${teacher.id}).`
      });
    });

    setEnrollments(updatedEnrollments);

    const assignedStudentIds = new Set(assignmentDetails.filter(d => d.status === 'Assigned').map(d => d.studentId));

    setStudents(prev => prev.map(s => {
      if (assignedStudentIds.has(s.id)) {
        const assignedEnrollment = updatedEnrollments.find(e =>
          (e.studentId === s.id || (e.studentEmail && s.email && e.studentEmail.toLowerCase() === s.email.toLowerCase())) &&
          e.assignedTeacherId
        );
        if (assignedEnrollment) {
          return {
            ...s,
            assignedTeacherId: assignedEnrollment.assignedTeacherId,
            assignedTeacherName: assignedEnrollment.assignedTeacherName,
            assignedTeacherEmail: assignedEnrollment.assignedTeacherEmail,
            teacherName: assignedEnrollment.assignedTeacherName
          };
        }
      }
      return s;
    }));

    try {
      safeSetItem('ab_enrollments_v4', JSON.stringify(updatedEnrollments));

      const savedStudents = JSON.parse(localStorage.getItem('ab_students_v3') || '[]');
      if (Array.isArray(savedStudents) && savedStudents.length > 0) {
        const updatedStudents = savedStudents.map((st: any) => {
          const assignedEnrollment = updatedEnrollments.find(e =>
            (e.studentId === st.id || (e.studentEmail && st.email && e.studentEmail.toLowerCase() === st.email.toLowerCase())) &&
            e.assignedTeacherId
          );
          if (assignedEnrollment) {
            return {
              ...st,
              assignedTeacherId: assignedEnrollment.assignedTeacherId,
              assignedTeacherName: assignedEnrollment.assignedTeacherName,
              assignedTeacherEmail: assignedEnrollment.assignedTeacherEmail,
              teacherName: assignedEnrollment.assignedTeacherName
            };
          }
          return st;
        });
        localStorage.setItem('ab_students_v3', JSON.stringify(updatedStudents));
      }

      const savedApps = JSON.parse(localStorage.getItem('ab_applications_v3') || '[]');
      if (Array.isArray(savedApps) && savedApps.length > 0) {
        const updatedApps = savedApps.map((app: any) => {
          const assignedEnrollment = updatedEnrollments.find(e =>
            (e.studentId === app.id || e.studentId === app.userId || (app.email && e.studentEmail && app.email.toLowerCase() === e.studentEmail.toLowerCase())) &&
            e.assignedTeacherId
          );
          if (assignedEnrollment) {
            return {
              ...app,
              assignedTeacherId: assignedEnrollment.assignedTeacherId,
              assignedTeacherName: assignedEnrollment.assignedTeacherName,
              assignedTeacherEmail: assignedEnrollment.assignedTeacherEmail
            };
          }
          return app;
        });
        localStorage.setItem('ab_applications_v3', JSON.stringify(updatedApps));
      }

      const savedAccs = JSON.parse(localStorage.getItem('ab_accounts') || '{}');
      if (savedAccs && typeof savedAccs === 'object') {
        let changed = false;
        Object.keys(savedAccs).forEach(em => {
          const acc = savedAccs[em];
          const assignedEnrollment = updatedEnrollments.find(e =>
            (e.studentId === acc.id || (acc.email && e.studentEmail && acc.email.toLowerCase() === e.studentEmail.toLowerCase())) &&
            e.assignedTeacherId
          );
          if (acc && assignedEnrollment) {
            savedAccs[em] = {
              ...acc,
              assignedTeacherId: assignedEnrollment.assignedTeacherId,
              assignedTeacherName: assignedEnrollment.assignedTeacherName,
              assignedTeacherEmail: assignedEnrollment.assignedTeacherEmail
            };
            changed = true;
          }
        });
        if (changed) {
          localStorage.setItem('ab_accounts', JSON.stringify(savedAccs));
        }
      }

      const sessionUser = JSON.parse(localStorage.getItem('ab_session_user') || 'null');
      if (sessionUser && sessionUser.id) {
        const assignedEnrollment = updatedEnrollments.find(e =>
          (e.studentId === sessionUser.id || (sessionUser.email && e.studentEmail && sessionUser.email.toLowerCase() === e.studentEmail.toLowerCase())) &&
          e.assignedTeacherId
        );
        if (assignedEnrollment) {
          localStorage.setItem('ab_session_user', JSON.stringify({
            ...sessionUser,
            assignedTeacherId: assignedEnrollment.assignedTeacherId,
            assignedTeacherName: assignedEnrollment.assignedTeacherName,
            assignedTeacherEmail: assignedEnrollment.assignedTeacherEmail
          }));
        }
      }

      window.dispatchEvent(new Event('ab_students_updated'));
      window.dispatchEvent(new Event('ab_enrollments_updated'));
      window.dispatchEvent(new Event('storage'));
    } catch (err) {}

    assignmentDetails.forEach(item => {
      if (item.status === 'Assigned') {
        addAuditEntry(
          'Student Auto-Assigned to Teacher',
          'Academic',
          `Auto-assigned student ${item.studentName} to teacher ${item.teacherName} (${item.teacherId}).`,
          'System (Auto-Assign)',
          'system@begena.com',
          'admin'
        );
      }
    });

    const pendingCount = processedCount - assignedCount;

    return {
      processed: processedCount,
      assigned: assignedCount,
      pending: pendingCount,
      summaryMessage: `Auto-assignment complete: Processed ${processedCount} unassigned students, assigned ${assignedCount}, pending ${pendingCount}.`,
      details: assignmentDetails
    };
  };

  // AUTOMATIC TEACHER ASSIGNMENT ALGORITHM
  const autoAssignTeacherForEnrollment = (enrollmentId: string): { success: boolean; teacherName?: string; message: string } => {
    const enrollment = enrollments.find(e => e.id === enrollmentId);
    if (!enrollment) return { success: false, message: 'Enrollment record not found.' };

    if (isFakeEnrollment(enrollment) || enrollment.status !== 'Active') {
      return { success: false, message: 'Enrollment is not eligible for auto-assignment.' };
    }

    const selection = selectQualifiedTeacherForEnrollment(enrollment, enrollments);
    if (!selection.teacher) {
      return { success: false, message: selection.reason || 'No suitable teacher found.' };
    }

    const result = assignTeacherToEnrollment(enrollmentId, selection.teacher.id, 'System (Auto-Assign)');
    return result.success
      ? { success: true, teacherName: selection.teacher.fullName, message: result.message }
      : { success: false, message: result.message };
  };

  // ADD NEW STUDENT ENROLLMENT
  const addStudentEnrollment = (
    data: Omit<StudentEnrollment, 'id' | 'enrollmentDate' | 'assignmentStatus' | 'progressPercent'>,
    staffOrSystemName = 'System (Auto-Assign)'
  ): StudentEnrollment => {
    // Check if enrollment already exists for this student
    const existing = enrollments.find(e =>
      (data.studentEmail && e.studentEmail && e.studentEmail.toLowerCase().trim() === data.studentEmail.toLowerCase().trim()) ||
      (data.studentId && (e.studentId === data.studentId || e.id === data.studentId)) ||
      (data.studentName && e.studentName && e.studentName.toLowerCase().trim() === data.studentName.toLowerCase().trim())
    );

    if (existing) {
      const updatedEnr: StudentEnrollment = {
        ...existing,
        ...data,
        id: existing.id
      };
      setEnrollments(prev => {
        const updated = prev.map(e => e.id === existing.id ? updatedEnr : e);
        safeSetItem('ab_enrollments_v4', JSON.stringify(updated));
        return updated;
      });
      return updatedEnr;
    }

    const enrollmentId = `ENR-2026-${Math.floor(1000 + Math.random() * 8999)}`;
    const newEnrollment: StudentEnrollment = {
      ...data,
      id: enrollmentId,
      enrollmentDate: new Date().toISOString(),
      assignmentStatus: 'Pending Teacher Assignment',
      progressPercent: 0,
      status: data.status || 'Pending Verification'
    };

    setEnrollments(prev => {
      const updated = [newEnrollment, ...prev];
      safeSetItem('ab_enrollments_v4', JSON.stringify(updated));
      return updated;
    });

    // Automatically trigger teacher assignment algorithm
    setTimeout(() => {
      autoAssignTeacherForEnrollment(enrollmentId);
    }, 50);

    return newEnrollment;
  };

  // STAFF MANUAL TEACHER ASSIGNMENT & REASSIGNMENT
  const assignTeacherToEnrollment = (
    enrollmentId: string,
    teacherId: string,
    assignedByStaffName: string
  ): { success: boolean; message: string } => {
    let enrollment = enrollments.find(e => 
      e.id === enrollmentId || 
      e.studentId === enrollmentId || 
      (e.studentEmail && e.studentEmail.toLowerCase() === enrollmentId.toLowerCase()) ||
      (e.studentName && e.studentName.toLowerCase() === enrollmentId.toLowerCase())
    );

    const targetTeacher = teachers.find(t => t.id === teacherId);
    if (!targetTeacher) return { success: false, message: 'Target teacher record not found.' };

    // If enrollment record is missing, auto-create one from students list
    if (!enrollment) {
      const stu = students.find(s => 
        s.id === enrollmentId || 
        (s.email && s.email.toLowerCase() === enrollmentId.toLowerCase()) ||
        (s.fullName && s.fullName.toLowerCase() === enrollmentId.toLowerCase())
      );
      if (stu) {
        const enrId = `ENR-2026-${Math.floor(1000 + Math.random() * 8999)}`;
        const newEnr: StudentEnrollment = {
          id: enrId,
          studentId: stu.id,
          studentName: stu.fullName,
          studentEmail: stu.email,
          studentPhone: stu.phone,
          courseId: (stu.courseName || stu.instrument || 'begena').toLowerCase(),
          courseName: stu.courseName || `${stu.instrument || 'Begena'} ${stu.level || 'Basic 1'}`,
          instrument: stu.instrument || 'Begena',
          level: stu.level || 'Basic 1',
          learningMode: stu.learningMode || 'In-Person',
          branch: stu.branch || 'Piazza Branch',
          status: 'Active',
          assignmentStatus: 'Pending Teacher Assignment',
          progressPercent: 0,
          enrollmentDate: new Date().toISOString()
        };
        enrollment = newEnr;
        setEnrollments(prev => [newEnr, ...prev]);
      }
    }

    if (!enrollment) return { success: false, message: 'Enrollment record not found.' };

    const normalizeInst = (str?: string) => {
      if (!str) return 'begena';
      const l = str.toLowerCase().trim();
      if (l.includes('begena') || l.includes('በገና')) return 'begena';
      if (l.includes('krar') || l.includes('kirar') || l.includes('krara') || l.includes('ክራር') || l.includes('ቅራር') || l.includes('ከራር')) return 'krar';
      if (l.includes('masenqo') || l.includes('masinqo') || l.includes('masinko') || l.includes('ማሰንቆ') || l.includes('ማስንቆ')) return 'masenqo';
      if (l.includes('washint') || l.includes('flute') || l.includes('ዋሽንት')) return 'washint';
      if (l.includes('kebero') || l.includes('drum') || l.includes('ከበሮ')) return 'kebero';
      if (l.includes('vocal') || l.includes('voice') || l.includes('zema') || l.includes('mezmur') || l.includes('ድምፅ') || l.includes('ድምጽ') || l.includes('ዜማ') || l.includes('መዝሙር')) return 'vocal';
      return l;
    };

    const targetInstrument = normalizeInst(enrollment.instrument || enrollment.courseName);
    const teacherSpecsNorm = targetTeacher.specializations.map(normalizeInst);
    const isQualified = teacherSpecsNorm.some(s => s === targetInstrument || targetInstrument.includes(s) || s.includes(targetInstrument));

    // Notice: For manual staff assignment, if not strictly matched by automatic parser, allow staff override
    if (!isQualified) {
      console.info(`Staff manual override assignment: Assigning ${enrollment.studentName} (${enrollment.courseName}) to ${targetTeacher.fullName}.`);
    }

    const targetEnrId = enrollment.id;
    const prevTeacherName = enrollment.assignedTeacherName;

    // 1. Update enrollments state for ALL matching student records and deduplicate
    setEnrollments(prev => {
      const updatedMap = new Map<string, StudentEnrollment>();
      prev.forEach(e => {
        const isMatch = e.id === targetEnrId ||
          (enrollment && e.studentId === enrollment.studentId) ||
          (enrollment && e.studentEmail && enrollment.studentEmail && e.studentEmail.toLowerCase().trim() === enrollment.studentEmail.toLowerCase().trim()) ||
          (enrollment && e.studentName && enrollment.studentName && e.studentName.toLowerCase().trim() === enrollment.studentName.toLowerCase().trim());

        const historyItem = {
          date: new Date().toISOString(),
          fromTeacherName: prevTeacherName,
          toTeacherName: targetTeacher.fullName,
          reassignedBy: assignedByStaffName
        };

        const updatedEnr = isMatch ? {
          ...e,
          assignedTeacherId: targetTeacher.id,
          assignedTeacherName: targetTeacher.fullName,
          assignedTeacherEmail: targetTeacher.email,
          assignmentStatus: 'Assigned' as const,
          teacherAssignmentStatus: 'ASSIGNED' as const,
          assignedAt: new Date().toISOString(),
          assignedBy: assignedByStaffName,
          reassignedHistory: [...(e.reassignedHistory || []), historyItem]
        } : e;

        const dedupeKey = updatedEnr.studentEmail?.toLowerCase().trim() ||
                          updatedEnr.studentId?.toLowerCase().trim() ||
                          updatedEnr.studentName?.toLowerCase().trim() ||
                          updatedEnr.id;

        if (!updatedMap.has(dedupeKey)) {
          updatedMap.set(dedupeKey, updatedEnr);
        }
      });
      const updatedList = Array.from(updatedMap.values());
      safeSetItem('ab_enrollments_v4', JSON.stringify(updatedList));
      return updatedList;
    });

    // 2. Update students state in DataContext
    setStudents(prev => prev.map(s => {
      if (s.id === enrollment.studentId || (s.email && enrollment.studentEmail && s.email.toLowerCase() === enrollment.studentEmail.toLowerCase()) || (s.fullName && enrollment.studentName && s.fullName.toLowerCase() === enrollment.studentName.toLowerCase())) {
        return {
          ...s,
          assignedTeacherId: targetTeacher.id,
          assignedTeacherName: targetTeacher.fullName,
          assignedTeacherEmail: targetTeacher.email
        };
      }
      return s;
    }));

    // 3. Multi-key local storage sync for complete cross-portal consistency
    try {
      // ab_students_v3
      const savedStudents = JSON.parse(localStorage.getItem('ab_students_v3') || '[]');
      if (Array.isArray(savedStudents) && savedStudents.length > 0) {
        const updatedStudents = savedStudents.map((st: any) => {
          if (st.id === enrollment.studentId || (st.email && enrollment.studentEmail && st.email.toLowerCase() === enrollment.studentEmail.toLowerCase()) || (st.fullName && enrollment.studentName && st.fullName.toLowerCase() === enrollment.studentName.toLowerCase())) {
            return {
              ...st,
              assignedTeacherId: targetTeacher.id,
              assignedTeacherName: targetTeacher.fullName,
              assignedTeacherEmail: targetTeacher.email,
              teacherName: targetTeacher.fullName
            };
          }
          return st;
        });
        localStorage.setItem('ab_students_v3', JSON.stringify(updatedStudents));
      }

      // ab_applications_v3
      const savedApps = JSON.parse(localStorage.getItem('ab_applications_v3') || '[]');
      if (Array.isArray(savedApps) && savedApps.length > 0) {
        const updatedApps = savedApps.map((app: any) => {
          if (app.id === enrollment.studentId || app.userId === enrollment.studentId || (app.email && enrollment.studentEmail && app.email.toLowerCase() === enrollment.studentEmail.toLowerCase())) {
            return {
              ...app,
              assignedTeacherId: targetTeacher.id,
              assignedTeacherName: targetTeacher.fullName,
              assignedTeacherEmail: targetTeacher.email
            };
          }
          return app;
        });
        localStorage.setItem('ab_applications_v3', JSON.stringify(updatedApps));
      }

      // ab_accounts
      const savedAccs = JSON.parse(localStorage.getItem('ab_accounts') || '{}');
      if (savedAccs && typeof savedAccs === 'object') {
        let changed = false;
        Object.keys(savedAccs).forEach(em => {
          const acc = savedAccs[em];
          if (acc && ((acc.id && acc.id === enrollment.studentId) || (acc.email && enrollment.studentEmail && acc.email.toLowerCase() === enrollment.studentEmail.toLowerCase()))) {
            savedAccs[em] = {
              ...acc,
              assignedTeacherId: targetTeacher.id,
              assignedTeacherName: targetTeacher.fullName,
              assignedTeacherEmail: targetTeacher.email
            };
            changed = true;
          }
        });
        if (changed) {
          localStorage.setItem('ab_accounts', JSON.stringify(savedAccs));
        }
      }

      // ab_session_user
      const sessionUser = JSON.parse(localStorage.getItem('ab_session_user') || 'null');
      if (sessionUser && (sessionUser.id === enrollment.studentId || (sessionUser.email && enrollment.studentEmail && sessionUser.email.toLowerCase() === enrollment.studentEmail.toLowerCase()))) {
        const updatedSession = {
          ...sessionUser,
          assignedTeacherId: targetTeacher.id,
          assignedTeacherName: targetTeacher.fullName,
          assignedTeacherEmail: targetTeacher.email
        };
        localStorage.setItem('ab_session_user', JSON.stringify(updatedSession));
      }

      window.dispatchEvent(new Event('ab_students_updated'));
      window.dispatchEvent(new Event('ab_enrollments_updated'));
      window.dispatchEvent(new Event('storage'));
    } catch (err) {}

    addAuditEntry(
      prevTeacherName ? 'Teacher Reassigned' : 'Teacher Assigned',
      'Academic',
      prevTeacherName
        ? `Reassigned ${enrollment.studentName} (${enrollment.courseName}) from ${prevTeacherName} to ${targetTeacher.fullName} by ${assignedByStaffName}. All existing learning progress & grades preserved.`
        : `Assigned student ${enrollment.studentName} (${enrollment.courseName}) to Teacher ${targetTeacher.fullName} by ${assignedByStaffName}.`,
      assignedByStaffName,
      'hanasaba@begena.com',
      'admin'
    );

    return {
      success: true,
      message: `Successfully assigned ${enrollment.studentName} to Teacher ${targetTeacher.fullName}.`
    };
  };

  // UPDATE TEACHER SPECIALIZATIONS
  const updateTeacherSpecializations = (
    teacherId: string,
    specializations: string[],
    branches: string[],
    capacity: number,
    supportsOnline: boolean,
    supportsInPerson: boolean,
    telegramUsername?: string
  ) => {
    setTeachers(prev => prev.map(t => t.id === teacherId ? {
      ...t,
      specializations,
      branches,
      capacity,
      supportsOnline,
      supportsInPerson,
      ...(telegramUsername !== undefined ? { telegramUsername: telegramUsername.replace(/^@/, '').trim() } : {})
    } : t));

    addAuditEntry(
      'Teacher Specializations Updated',
      'Faculty Management',
      `Updated profile for teacher ${teacherId}: Specializations (${specializations.join(', ')}), Capacity (${capacity}).`,
      'Admin',
      'admin@begena.com',
      'admin'
    );
  };

  // UPDATE TEACHER TELEGRAM USERNAME
  const updateTeacherTelegramUsername = (teacherId: string, rawTelegramUsername: string) => {
    const cleanUsername = rawTelegramUsername.replace(/^@/, '').trim();
    setTeachers(prev => prev.map(t => t.id === teacherId ? {
      ...t,
      telegramUsername: cleanUsername
    } : t));

    addAuditEntry(
      'Teacher Telegram Contact Updated',
      'Faculty Management',
      `Updated Telegram contact for teacher ${teacherId} to @${cleanUsername}`,
      'Admin',
      'admin@begena.com',
      'admin'
    );
  };

  const addTeacher = (teacherData: Omit<PersistentTeacher, 'id'>): PersistentTeacher => {
    const newId = `tch_${Date.now()}`;
    const newTeacher: PersistentTeacher = {
      ...teacherData,
      id: newId
    };
    setTeachers(prev => [newTeacher, ...prev]);
    addAuditEntry(
      'New Faculty Master Added',
      'Faculty Management',
      `Added new faculty teacher ${newTeacher.fullName} with specializations (${newTeacher.specializations.join(', ')}).`,
      'Admin',
      'admin@begena.com',
      'admin'
    );
    return newTeacher;
  };

  // AUDIT LOG HELPER
  const addAuditEntry = (action: string, module: string, details: string, userName = 'System User', userEmail = 'system@begena.com', userRole: UserRole = 'admin') => {
    const newLog: PersistentAuditLog = {
      id: `log_${Date.now()}`,
      timestamp: new Date().toISOString(),
      userEmail,
      userName,
      userRole,
      action,
      module,
      details,
      ipAddress: '127.0.0.1'
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // STUDENT REGISTRATION HANDLER (WITH AUTOMATIC TEACHER ASSIGNMENT & ENROLLMENT CREATION)
  const addStudentRegistration = (data: Omit<PersistentStudent, 'id' | 'registeredAt' | 'status' | 'paymentStatus'>): PersistentStudent => {
    // Check if student with same email or phone already exists
    const existingIndex = students.findIndex(s => 
      (data.email && s.email.toLowerCase() === data.email.toLowerCase()) || 
      (data.phone && s.phone === data.phone)
    );

    let targetStudent: PersistentStudent;
    const registeredAt = existingIndex > -1
      ? students[existingIndex].registeredAt || new Date().toISOString()
      : new Date().toISOString();

    if (existingIndex > -1) {
      const existing = students[existingIndex];
      targetStudent = {
        ...existing,
        ...data,
        photoUrl: data.photoUrl || existing.photoUrl,
        studentRegistrationId: existing.studentRegistrationId || generateStudentRegistrationId(
          students.map((s) => s.studentRegistrationId).filter(Boolean) as string[],
          registeredAt
        ),
        status: 'Submitted',
        paymentStatus: 'Pending',
        registeredAt
      };
      setStudents(prev => prev.map((s, idx) => idx === existingIndex ? targetStudent : s));
      addAuditEntry('Student Registration Updated', 'Registration', `Existing registration updated for ${targetStudent.fullName} (${targetStudent.courseName}).`, targetStudent.fullName, targetStudent.email, 'student');
    } else {
      const studentId = `STU-2026-${Math.floor(Math.random() * 899 + 100)}`;
      targetStudent = {
        ...data,
        id: studentId,
        studentRegistrationId: generateStudentRegistrationId(
          students.map((s) => s.studentRegistrationId).filter(Boolean) as string[],
          registeredAt
        ),
        status: 'Submitted',
        paymentStatus: 'Pending',
        registeredAt
      };
      setStudents((prev) => [targetStudent, ...prev]);
      addAuditEntry('Student Registration Submitted', 'Registration', `New registration submitted for ${targetStudent.fullName} (${targetStudent.courseName} at ${targetStudent.branch}).`, targetStudent.fullName, targetStudent.email, 'student');
    }

    // Create or sync StudentEnrollment record and trigger auto-assignment
    const inst = targetStudent.instrument || targetStudent.courseName || 'Begena';
    const courseTitle = targetStudent.courseName || `${inst} ${targetStudent.level || 'Basic 1'}`;
    const enrId = `ENR-2026-${Math.floor(1000 + Math.random() * 8999)}`;
    let activeEnrId = enrId;

    setEnrollments(prev => {
      const existingIdx = prev.findIndex(e => 
        (e.studentId && e.studentId === targetStudent.id) ||
        (e.studentEmail && targetStudent.email && e.studentEmail.toLowerCase() === targetStudent.email.toLowerCase())
      );
      if (existingIdx > -1) {
        activeEnrId = prev[existingIdx].id;
        const updated = [...prev];
        updated[existingIdx] = {
          ...prev[existingIdx],
          courseId: inst.toLowerCase(),
          courseName: courseTitle,
          instrument: inst,
          level: targetStudent.level || prev[existingIdx].level || 'Basic 1',
          learningMode: targetStudent.learningMode || prev[existingIdx].learningMode || 'In-Person',
          branch: targetStudent.branch || prev[existingIdx].branch || 'Piazza Branch'
        };
        return updated;
      }
      const newEnr: StudentEnrollment = {
        id: enrId,
        studentId: targetStudent.id,
        studentName: targetStudent.fullName,
        studentEmail: targetStudent.email,
        studentPhone: targetStudent.phone,
        courseId: inst.toLowerCase(),
        courseName: courseTitle,
        instrument: inst,
        level: targetStudent.level || 'Basic 1',
        learningMode: targetStudent.learningMode || 'In-Person',
        branch: targetStudent.branch || 'Piazza Branch',
        enrollmentDate: new Date().toISOString().split('T')[0],
        status: 'Active',
        progressPercent: 0,
        assignmentStatus: 'Pending Teacher Assignment'
      };
      return [newEnr, ...prev];
    });

    setTimeout(() => {
      autoAssignTeacherForEnrollment(activeEnrId);
    }, 50);

    // Sync user account in ab_accounts so authentication account works immediately
    try {
      const savedAccounts = JSON.parse(localStorage.getItem('ab_accounts') || '{}');
      const cleanEmail = (targetStudent.email || '').trim().toLowerCase();
      if (cleanEmail) {
        savedAccounts[cleanEmail] = {
          id: targetStudent.id,
          email: cleanEmail,
          fullName: targetStudent.fullName,
          phone: targetStudent.phone || '+251 900 000 000',
          role: 'student',
          status: 'Active',
          studentStatus: 'Enrollment Active',
          isRegistrationCompleted: true,
          isPaymentCompleted: true,
          verified: true,
          enrolledInstrument: inst,
          enrolledCourse: courseTitle,
          branch: targetStudent.branch || 'Piazza Branch',
          password: 'Password123!',
          ...savedAccounts[cleanEmail]
        };
        // Ensure active flags are explicitly set
        savedAccounts[cleanEmail].studentStatus = 'Enrollment Active';
        savedAccounts[cleanEmail].isRegistrationCompleted = true;
        savedAccounts[cleanEmail].isPaymentCompleted = true;
        savedAccounts[cleanEmail].status = 'Active';
        savedAccounts[cleanEmail].enrolledInstrument = inst;
        savedAccounts[cleanEmail].enrolledCourse = courseTitle;

        safeSetItem('ab_accounts', JSON.stringify(savedAccounts));
        window.dispatchEvent(new Event('ab_user_updated'));
      }
    } catch (e) {
      console.error('Error syncing ab_accounts in addStudentRegistration:', e);
    }

    return targetStudent;
  };

  // SUBMIT PAYMENT RECEIPT
  const submitPaymentReceipt = (data: Omit<PersistentPayment, 'id' | 'createdAt' | 'status'>): PersistentPayment => {
    const paymentId = `PAY-2026-${Math.floor(Math.random() * 8999 + 1000)}`;
    const newPayment: PersistentPayment = {
      ...data,
      id: paymentId,
      status: 'Under Review',
      createdAt: new Date().toISOString()
    };

    setPayments((prev) => [newPayment, ...prev]);

    // Update corresponding student payment status
    setStudents((prev) =>
      prev.map((st) => (st.email === newPayment.studentEmail || st.id === newPayment.studentId ? { 
        ...st, 
        paymentStatus: 'Under Review', 
        paymentReference: newPayment.referenceNumber,
        paymentProofUrl: newPayment.screenshotUrl || st.paymentProofUrl
      } : st))
    );

    addAuditEntry('Payment Proof Submitted', 'Finance', `Payment proof submitted by ${newPayment.studentName} for ${newPayment.amountETB} ETB via ${newPayment.paymentMethod} (Ref: ${newPayment.referenceNumber}).`, newPayment.studentName, newPayment.studentEmail, 'student');
    return newPayment;
  };

  // APPROVE PAYMENT
  const approvePaymentRecord = (paymentId: string, reviewerName: string): boolean => {
    const legacyPayments = [
      ...payments,
      ...JSON.parse(localStorage.getItem('ab_payments_v4') || '[]'),
      ...JSON.parse(localStorage.getItem('ab_payments_v3') || '[]')
    ].filter((p): p is PersistentPayment => Boolean(p && p.id));
    const resolvedPaymentId = resolvePaymentIdForTransaction(paymentId, payments, undefined, legacyPayments);
    const matchedPayment = legacyPayments.find((p) => p.id === resolvedPaymentId || p.id === paymentId || p.id === paymentId.replace(/^TXN-/, ''));
    if (!matchedPayment) return false;

    if (matchedPayment.status === 'Approved') {
      return false;
    }

    const receiptNumber = `RCP-2026-${Math.floor(Math.random() * 8999 + 1000)}`;
    const approvalTimestamp = new Date().toISOString();

    const normalizedPayment: PersistentPayment = {
      ...matchedPayment,
      id: resolvedPaymentId,
      studentId: matchedPayment.studentId || '',
      studentName: matchedPayment.studentName || '',
      studentEmail: matchedPayment.studentEmail || '',
      studentPhone: matchedPayment.studentPhone || '',
      courseName: matchedPayment.courseName || '',
      branch: matchedPayment.branch || 'Piazza Branch',
      amountETB: matchedPayment.amountETB || 0,
      paymentMethod: matchedPayment.paymentMethod || 'CBE',
      referenceNumber: matchedPayment.referenceNumber || '',
      createdAt: matchedPayment.createdAt || approvalTimestamp,
      status: 'Approved',
      reviewedAt: approvalTimestamp,
      reviewedBy: reviewerName,
      receiptNumber
    };

    const updatedPayments: PersistentPayment[] = payments.some((p) => p.id === resolvedPaymentId)
      ? payments.map((p) => (p.id === resolvedPaymentId ? normalizedPayment : p))
      : [normalizedPayment, ...payments];

    setPayments(updatedPayments);
    safeSetItem('ab_payments_v4', JSON.stringify(updatedPayments));
    safeSetItem('ab_payments_v3', JSON.stringify(updatedPayments));

    const syncState = buildPaymentApprovalSyncState({
      payment: normalizedPayment,
      students,
      applications: JSON.parse(localStorage.getItem('ab_applications_v3') || '[]'),
      enrollments,
      accounts: JSON.parse(localStorage.getItem('ab_accounts') || '{}'),
      sessionUser: JSON.parse(localStorage.getItem('ab_session_user') || 'null'),
      reviewerName,
      reviewerId: reviewerName,
      reviewerEmail: reviewerName || 'accountant@begena.com',
      reviewerRole: 'accountant',
      receiptNumber
    });

    setStudents(syncState.students);
    safeSetItem('ab_students_v4', JSON.stringify(syncState.students));
    safeSetItem('ab_students_v3', JSON.stringify(syncState.students));
    safeSetItem('ab_applications_v3', JSON.stringify(syncState.applications));
    setEnrollments(syncState.enrollments);
    safeSetItem('ab_enrollments_v4', JSON.stringify(syncState.enrollments));
    safeSetItem('ab_accounts', JSON.stringify(syncState.accounts));
    if (syncState.sessionUser) {
      safeSetItem('ab_session_user', JSON.stringify(syncState.sessionUser));
    }

    const targetEnrollmentIds = syncState.enrollments
      .filter((enr: any) => (enr.studentEmail === normalizedPayment.studentEmail || enr.studentId === normalizedPayment.studentId || enr.studentName === normalizedPayment.studentName) && enr.status === 'Active')
      .map((enr: any) => enr.id);

    setTimeout(() => {
      targetEnrollmentIds.forEach((enrId: string) => {
        autoAssignTeacherForEnrollment(enrId);
      });
    }, 50);

    window.dispatchEvent(new Event('ab_user_updated'));
    window.dispatchEvent(new Event('ab_students_updated'));
    window.dispatchEvent(new Event('ab_enrollments_updated'));
    window.dispatchEvent(new Event('ab_transactions_updated'));

    addAuditEntry('Payment Record Approved', 'Finance', `Payment ${resolvedPaymentId} approved by ${reviewerName} for student ${normalizedPayment.studentName}. Student ${normalizedPayment.studentId} Enrollment ${targetEnrollmentIds[0] || 'N/A'} Receipt ${receiptNumber}. ${syncState.auditDetails}`, reviewerName, 'accountant@begena.com', 'accountant');
    return true;
  };

  // REJECT PAYMENT
  const rejectPaymentRecord = (paymentId: string, reviewerName: string, reason: string): boolean => {
    const payment = payments.find((p) => p.id === paymentId);
    if (!payment) return false;

    setPayments((prev) =>
      prev.map((p) =>
        p.id === paymentId
          ? {
              ...p,
              status: 'Rejected',
              rejectionReason: reason,
              reviewedAt: new Date().toISOString(),
              reviewedBy: reviewerName
            }
          : p
      )
    );

    setStudents((prev) =>
      prev.map((st) =>
        st.email === payment.studentEmail || st.id === payment.studentId
          ? {
              ...st,
              status: 'Needs Correction',
              paymentStatus: 'Rejected'
            }
          : st
      )
    );

    // Sync localStorage session if student user
    try {
      const savedAccounts = JSON.parse(localStorage.getItem('ab_accounts') || '{}');
      Object.keys(savedAccounts).forEach(email => {
        const acc = savedAccounts[email];
        if (acc && ((acc.id && acc.id === payment.studentId) || (acc.email && acc.email === payment.studentEmail) || (acc.fullName && acc.fullName === payment.studentName))) {
          savedAccounts[email] = {
            ...acc,
            studentStatus: 'Payment Rejected',
            paymentRejectionReason: reason,
            isPaymentCompleted: false
          };
        }
      });
      safeSetItem('ab_accounts', JSON.stringify(savedAccounts));

      const sessionUser = JSON.parse(localStorage.getItem('ab_session_user') || 'null');
      if (sessionUser && ((sessionUser.id && sessionUser.id === payment.studentId) || (sessionUser.email && sessionUser.email === payment.studentEmail) || (sessionUser.fullName && sessionUser.fullName === payment.studentName))) {
        safeSetItem('ab_session_user', JSON.stringify({
          ...sessionUser,
          studentStatus: 'Payment Rejected',
          paymentRejectionReason: reason,
          isPaymentCompleted: false
        }));
      }
      window.dispatchEvent(new Event('ab_user_updated'));
    } catch (e) {}

    addAuditEntry('Payment Record Rejected', 'Finance', `Payment ${paymentId} rejected by ${reviewerName} for student ${payment.studentName}. Reason: ${reason}`, reviewerName, 'accountant@begena.com', 'accountant');
    return true;
  };

  // REQUEST PAYMENT CORRECTION
  const requestCorrectionPaymentRecord = (paymentId: string, reviewerName: string, reason: string): boolean => {
    const payment = payments.find((p) => p.id === paymentId);
    if (!payment) return false;

    setPayments((prev) =>
      prev.map((p) =>
        p.id === paymentId
          ? {
              ...p,
              status: 'Requires Correction',
              rejectionReason: reason,
              reviewedAt: new Date().toISOString(),
              reviewedBy: reviewerName
            }
          : p
      )
    );

    setStudents((prev) =>
      prev.map((st) =>
        st.email === payment.studentEmail || st.id === payment.studentId
          ? {
              ...st,
              status: 'Needs Correction',
              paymentStatus: 'Requires Correction'
            }
          : st
      )
    );

    try {
      const savedAccounts = JSON.parse(localStorage.getItem('ab_accounts') || '{}');
      Object.keys(savedAccounts).forEach(email => {
        const acc = savedAccounts[email];
        if (acc && ((acc.id && acc.id === payment.studentId) || (acc.email && acc.email === payment.studentEmail) || (acc.fullName && acc.fullName === payment.studentName))) {
          savedAccounts[email] = {
            ...acc,
            studentStatus: 'Correction Required',
            paymentRejectionReason: reason,
            isPaymentCompleted: false
          };
        }
      });
      safeSetItem('ab_accounts', JSON.stringify(savedAccounts));

      const sessionUser = JSON.parse(localStorage.getItem('ab_session_user') || 'null');
      if (sessionUser && ((sessionUser.id && sessionUser.id === payment.studentId) || (sessionUser.email && sessionUser.email === payment.studentEmail) || (sessionUser.fullName && sessionUser.fullName === payment.studentName))) {
        safeSetItem('ab_session_user', JSON.stringify({
          ...sessionUser,
          studentStatus: 'Correction Required',
          paymentRejectionReason: reason,
          isPaymentCompleted: false
        }));
      }
      window.dispatchEvent(new Event('ab_user_updated'));
    } catch (e) {}

    addAuditEntry('Payment Correction Requested', 'Finance', `Payment ${paymentId} marked as requires correction by ${reviewerName} for student ${payment.studentName}. Note: ${reason}`, reviewerName, 'accountant@begena.com', 'accountant');
    return true;
  };

  // ATTENDANCE RECORDING
  const recordAttendance = (studentId: string, studentName: string, courseName: string, branch: string, status: 'Present' | 'Absent' | 'Late' | 'Excused', teacherName: string) => {
    const newAtt: PersistentAttendance = {
      id: `att_${Date.now()}`,
      studentId,
      studentName,
      courseName,
      branch,
      date: new Date().toISOString().split('T')[0],
      status,
      recordedBy: teacherName
    };
    setAttendances((prev) => [newAtt, ...prev]);
    addAuditEntry('Attendance Marked', 'Academic', `Attendance marked as ${status} for ${studentName} by ${teacherName}.`, teacherName, 'teacher@begena.com', 'teacher');
  };

  // ASSIGNMENT SUBMISSION
  const submitAssignment = (assignmentId: string, submissionUrl: string) => {
    setAssignments((prev) =>
      prev.map((a) => (a.id === assignmentId ? { ...a, submissionUrl, submissionDate: new Date().toISOString().split('T')[0], status: 'Submitted' } : a))
    );
    addAuditEntry('Assignment Submitted', 'LMS', `Assignment ${assignmentId} submitted.`, 'Student', 'student@begena.com', 'student');
  };

  // GRADE ASSIGNMENT
  const gradeAssignment = (assignmentId: string, grade: string, feedback: string) => {
    setAssignments((prev) =>
      prev.map((a) => (a.id === assignmentId ? { ...a, grade, feedback, status: 'Graded' } : a))
    );
    addAuditEntry('Assignment Graded', 'LMS', `Assignment ${assignmentId} graded with score ${grade}.`, 'Teacher', 'teacher@begena.com', 'teacher');
  };

  // MEDIA MANAGEMENT
  const addMediaAsset = (data: Omit<PersistentMediaAsset, 'id' | 'uploadedAt'>): PersistentMediaAsset => {
    const status = data.status || (data.isPublished ? 'Published' : 'Draft');
    const newMedia: PersistentMediaAsset = {
      ...data,
      id: `med_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      status,
      isPublished: status === 'Published',
      uploadedAt: new Date().toISOString()
    };
    setMediaAssets((prev) => [newMedia, ...prev]);
    addAuditEntry('Media Asset Uploaded', 'Media Management', `New media "${newMedia.title}" uploaded to category ${newMedia.category} (Status: ${status}).`, newMedia.uploadedBy || 'Founder', newMedia.uploadedBy || 'founder@begena.com', 'founder');
    return newMedia;
  };

  const updateMediaAsset = (mediaId: string, updatedData: Partial<PersistentMediaAsset>) => {
    setMediaAssets((prev) =>
      prev.map((m) => {
        if (m.id === mediaId) {
          const newStatus = updatedData.status !== undefined ? updatedData.status : (updatedData.isPublished !== undefined ? (updatedData.isPublished ? 'Published' : 'Unpublished') : m.status || 'Published');
          return {
            ...m,
            ...updatedData,
            status: newStatus,
            isPublished: newStatus === 'Published'
          };
        }
        return m;
      })
    );
    addAuditEntry('Media Asset Updated', 'Media Management', `Media asset ID ${mediaId} updated.`, 'Founder', 'founder@begena.com', 'founder');
  };

  const deleteMediaAsset = (mediaId: string) => {
    const media = mediaAssets.find((m) => m.id === mediaId);
    setMediaAssets((prev) => prev.filter((m) => m.id !== mediaId));
    if (media) {
      addAuditEntry('Media Asset Deleted', 'Media Management', `Media "${media.title}" deleted from media storage.`, 'Founder', 'founder@begena.com', 'founder');
    }
  };

  const toggleMediaPublished = (mediaId: string) => {
    setMediaAssets((prev) =>
      prev.map((m) => {
        if (m.id === mediaId) {
          const nextStatus = m.status === 'Published' ? 'Unpublished' : 'Published';
          return {
            ...m,
            status: nextStatus,
            isPublished: nextStatus === 'Published'
          };
        }
        return m;
      })
    );
  };

  const setMediaStatus = (mediaId: string, status: 'Draft' | 'Published' | 'Unpublished') => {
    setMediaAssets((prev) =>
      prev.map((m) => (m.id === mediaId ? { ...m, status, isPublished: status === 'Published' } : m))
    );
  };

  const addMediaCategory = (categoryName: string): boolean => {
    const trimmed = categoryName.trim();
    if (!trimmed) return false;
    if (mediaCategories.some((c) => c.toLowerCase() === trimmed.toLowerCase())) {
      return false;
    }
    setMediaCategories((prev) => [...prev, trimmed]);
    addAuditEntry('Media Category Added', 'Media Management', `Added new media category: ${trimmed}`, 'Founder', 'founder@begena.com', 'founder');
    return true;
  };

  const renameMediaCategory = (oldName: string, newName: string): boolean => {
    const trimmed = newName.trim();
    if (!trimmed || oldName === trimmed) return false;
    if (mediaCategories.some((c) => c.toLowerCase() === trimmed.toLowerCase() && c.toLowerCase() !== oldName.toLowerCase())) {
      return false;
    }
    setMediaCategories((prev) => prev.map((c) => (c.toLowerCase() === oldName.toLowerCase() ? trimmed : c)));
    setMediaAssets((prev) =>
      prev.map((m) => (m.category.toLowerCase() === oldName.toLowerCase() ? { ...m, category: trimmed } : m))
    );
    addAuditEntry('Media Category Renamed', 'Media Management', `Renamed category "${oldName}" to "${trimmed}"`, 'Founder', 'founder@begena.com', 'founder');
    return true;
  };

  const deleteMediaCategory = (categoryName: string, targetMoveCategory: string): boolean => {
    if (categoryName.toLowerCase() === targetMoveCategory.toLowerCase()) return false;
    setMediaAssets((prev) =>
      prev.map((m) => (m.category.toLowerCase() === categoryName.toLowerCase() ? { ...m, category: targetMoveCategory } : m))
    );
    setMediaCategories((prev) => prev.filter((c) => c.toLowerCase() !== categoryName.toLowerCase()));
    addAuditEntry('Media Category Deleted', 'Media Management', `Deleted category "${categoryName}" and moved assets to "${targetMoveCategory}".`, 'Founder', 'founder@begena.com', 'founder');
    return true;
  };

  // SYSTEM SETTINGS UPDATE
  const updateSystemSettings = (newSettings: Partial<SystemSettings>) => {
    setSystemSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      addAuditEntry('System Settings Updated', 'Admin Settings', 'School system settings updated by Super Admin.', 'Super Admin', 'superadmin@begena.com', 'super_admin');
      return updated;
    });
  };

  // RESET SEED DATA
  const resetToInitialSeedData = () => {
    setStudents(INITIAL_STUDENTS);
    setPayments(INITIAL_PAYMENTS);
    setTeachers(INITIAL_TEACHERS);
    setEnrollments(INITIAL_ENROLLMENTS);
    setMediaAssets(INITIAL_MEDIA_ASSETS);
    setMediaCategories(DEFAULT_MEDIA_CATEGORIES);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setSystemSettings(DEFAULT_SETTINGS);
    localStorage.removeItem('ab_students_v4');
    localStorage.removeItem('ab_payments_v4');
    localStorage.removeItem('ab_teachers_v4');
    localStorage.removeItem('ab_enrollments_v4');
    localStorage.removeItem('ab_media_assets_v4');
    localStorage.removeItem('ab_media_categories_v4');
    localStorage.removeItem('ab_audit_logs_v4');
    localStorage.removeItem('ab_system_settings_v4');
    addAuditEntry('System Seed Data Reset', 'DevOps', 'Seed data reset to clean initial baseline.', 'Super Admin', 'superadmin@begena.com', 'super_admin');
  };

  // DELETE STUDENT (and cascade-clean related records across all storage keys)
  const deleteStudent = (studentId: string): boolean => {
    // 1. Gather all student identities (id, email, phone, name)
    const existing = students.find(s => s && (s.id === studentId || s.email?.toLowerCase() === studentId.toLowerCase()));
    let targetEmail = existing?.email || '';
    let targetPhone = existing?.phone || '';
    let targetName = existing?.fullName || '';

    // If not found in memory state, check localStorage ab_students_v3 or ab_accounts
    if (!existing) {
      try {
        const savedStus = JSON.parse(localStorage.getItem('ab_students_v3') || '[]');
        const stMatch = savedStus.find((s: any) => s && (s.id === studentId || s.email?.toLowerCase() === studentId.toLowerCase()));
        if (stMatch) {
          targetEmail = targetEmail || stMatch.email || '';
          targetPhone = targetPhone || stMatch.phone || '';
          targetName = targetName || stMatch.fullName || '';
        }

        const savedAccounts = JSON.parse(localStorage.getItem('ab_accounts') || '{}');
        Object.keys(savedAccounts).forEach(k => {
          const acc = savedAccounts[k];
          if (acc && (acc.id === studentId || acc.email?.toLowerCase() === studentId.toLowerCase())) {
            targetEmail = targetEmail || acc.email || '';
            targetPhone = targetPhone || acc.phone || '';
            targetName = targetName || acc.fullName || '';
          }
        });
      } catch {}
    }

    const cleanEmail = targetEmail.trim().toLowerCase();
    const cleanPhone = targetPhone.replace(/\D/g, '');

    // 2. Remove student from state arrays
    setStudents(prev => prev.filter(s => s && s.id !== studentId && (!cleanEmail || s.email?.toLowerCase() !== cleanEmail)));
    setEnrollments(prev => prev.filter(e => e && e.studentId !== studentId && (!cleanEmail || e.studentEmail?.toLowerCase() !== cleanEmail)));
    setPayments(prev => prev.filter(p => p && p.id !== studentId && p.studentId !== studentId && (!cleanEmail || p.studentEmail?.toLowerCase() !== cleanEmail)));
    setAttendances(prev => prev.filter(a => a && a.studentId !== studentId && (!cleanEmail || a.studentEmail?.toLowerCase() !== cleanEmail)));
    setAssignments(prev => prev.filter(asg => asg && asg.studentId !== studentId));

    // 3. Record in permanent deleted blacklist
    try {
      const savedDeleted = localStorage.getItem('ab_deleted_students_v3');
      const deletedList: string[] = savedDeleted ? JSON.parse(savedDeleted) : [];
      const toAdd = [studentId, cleanEmail, targetPhone, targetName].filter(Boolean) as string[];
      const newDeletedList = Array.from(new Set([...deletedList, ...toAdd]));
      localStorage.setItem('ab_deleted_students_v3', JSON.stringify(newDeletedList));

      // 4. Purge from ab_students_v3 & ab_applications_v3
      const savedStus = localStorage.getItem('ab_students_v3');
      if (savedStus) {
        const filtered = JSON.parse(savedStus).filter((s: any) => s && s.id !== studentId && (!cleanEmail || s.email?.toLowerCase() !== cleanEmail));
        localStorage.setItem('ab_students_v3', JSON.stringify(filtered));
      }

      const savedApps = localStorage.getItem('ab_applications_v3');
      if (savedApps) {
        const filtered = JSON.parse(savedApps).filter((a: any) => a && a.studentId !== studentId && a.userId !== studentId && (!cleanEmail || a.email?.toLowerCase() !== cleanEmail));
        localStorage.setItem('ab_applications_v3', JSON.stringify(filtered));
      }

      // 5. Purge from ab_enrollments_v4
      const savedEnrs = localStorage.getItem('ab_enrollments_v4');
      if (savedEnrs) {
        const filtered = JSON.parse(savedEnrs).filter((e: any) => e && e.studentId !== studentId && e.id !== studentId && (!cleanEmail || e.studentEmail?.toLowerCase() !== cleanEmail));
        localStorage.setItem('ab_enrollments_v4', JSON.stringify(filtered));
      }

      // 6. Purge from ab_accounts & ab_all_users_v3
      const savedAccounts = JSON.parse(localStorage.getItem('ab_accounts') || '{}');
      let accChanged = false;
      Object.keys(savedAccounts).forEach(k => {
        const acc = savedAccounts[k];
        if (acc && (acc.id === studentId || (cleanEmail && (acc.email?.toLowerCase() === cleanEmail || k.toLowerCase() === cleanEmail)))) {
          delete savedAccounts[k];
          accChanged = true;
        }
      });
      if (accChanged) {
        localStorage.setItem('ab_accounts', JSON.stringify(savedAccounts));
      }

      const savedUsers = localStorage.getItem('ab_all_users_v3');
      if (savedUsers) {
        const filtered = JSON.parse(savedUsers).filter((u: any) => u && u.id !== studentId && (!cleanEmail || u.email?.toLowerCase() !== cleanEmail));
        localStorage.setItem('ab_all_users_v3', JSON.stringify(filtered));
      }

      // 7. Purge attendance records & certificates
      const savedAtt = localStorage.getItem('ab_attendance_records_v4');
      if (savedAtt) {
        const filtered = JSON.parse(savedAtt).filter((r: any) => r && r.studentId !== studentId && r.enrollmentId !== studentId && (!cleanEmail || r.studentEmail?.toLowerCase() !== cleanEmail));
        localStorage.setItem('ab_attendance_records_v4', JSON.stringify(filtered));
      }

      const savedCerts = localStorage.getItem('ab_certificates_v4');
      if (savedCerts) {
        const filtered = JSON.parse(savedCerts).filter((c: any) => c && c.studentId !== studentId && (!cleanEmail || c.studentEmail?.toLowerCase() !== cleanEmail));
        localStorage.setItem('ab_certificates_v4', JSON.stringify(filtered));
      }

      // 8. Invalidate active session if matches deleted student
      const sessionUser = JSON.parse(localStorage.getItem('ab_session_user') || 'null');
      if (sessionUser && (sessionUser.id === studentId || (cleanEmail && sessionUser.email?.toLowerCase() === cleanEmail))) {
        localStorage.removeItem('ab_session_user');
      }

      // Dispatch global events
      window.dispatchEvent(new Event('ab_students_updated'));
      window.dispatchEvent(new Event('ab_enrollments_updated'));
      window.dispatchEvent(new Event('ab_user_updated'));
      window.dispatchEvent(new Event('ab_session_invalidated'));
      window.dispatchEvent(new Event('storage'));
    } catch (e) {
      console.error('Error during cascade delete in DataContext:', e);
    }

    addAuditEntry(
      'Student Account Deleted',
      'Student Management',
      `Student ${targetName || existing?.fullName || studentId} (${studentId}) was permanently deleted from the master roster and authentication accounts invalidated.`,
      'Registration Staff',
      'hanasaba@begena.com',
      'registration_staff'
    );

    return true;
  };

  return (
    <DataContext.Provider
      value={{
        students,
        payments,
        mediaAssets,
        mediaCategories,
        auditLogs,
        attendances,
        assignments,
        teachers,
        enrollments,
        systemSettings,
        addStudentRegistration,
        submitPaymentReceipt,
        approvePaymentRecord,
        rejectPaymentRecord,
        requestCorrectionPaymentRecord,
        recordAttendance,
        submitAssignment,
        gradeAssignment,
        addMediaAsset,
        updateMediaAsset,
        deleteMediaAsset,
        toggleMediaPublished,
        setMediaStatus,
        addMediaCategory,
        renameMediaCategory,
        deleteMediaCategory,
        updateSystemSettings,
        addAuditEntry,
        addStudentEnrollment,
        autoAssignTeachersForUnassignedEnrollments,
        autoAssignTeacherForEnrollment,
        assignTeacherToEnrollment,
        updateTeacherSpecializations,
        updateTeacherTelegramUsername,
        addTeacher,
        deleteStudent,
        resetToInitialSeedData
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

