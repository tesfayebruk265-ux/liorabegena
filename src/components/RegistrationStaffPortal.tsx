import React, { useState, useEffect } from 'react';
import {
  User, Users, BookOpen, Calendar, Clock, CheckCircle, AlertTriangle, AlertCircle,
  FileText, TrendingUp, MapPin, ChevronRight, Send, Plus, Filter, Check, X,
  Award, Bell, Search, BookCheck, Building, Activity, LogOut, HelpCircle,
  Eye, RefreshCw, Video, MessageSquare, Megaphone, CheckSquare, Sparkles, Sliders, ChevronDown,
  Printer, CreditCard, ArrowRightLeft, ShieldCheck, Download, Trash2, Edit, Save, UserCheck, UserX,
  QrCode, ExternalLink, RefreshCcw, DollarSign, PieChart, Layers, Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Button, Input } from './InteractiveComponents';
import { ThemeToggle } from './ThemeToggle';
import { safeSetItem } from '../utils/storage';
import { generateStudentRegistrationId } from '../utils/studentRegistrationId';
import { PageId } from '../types';
import { AttendanceManagementCenter } from './operations/AttendanceManagementCenter';

interface RegistrationStaffPortalProps {
  onNavigate: (page: PageId, params?: any) => void;
  lang: 'en' | 'am';
}

// Student & Application Types
interface ApplicationRecord {
  id?: string;
  applicationId: string;
  studentId?: string;
  firstName: string;
  lastName: string;
  studentName?: string;
  gender: string;
  dob: string;
  phone: string;
  email: string;
  emergencyName: string;
  emergencyPhone: string;
  emergencyRel: string;
  country: string;
  city: string;
  subcity: string;
  woreda: string;
  address: string;
  occupationType: 'student' | 'employee';
  schoolOrOrg: string;
  gradeOrTitle: string;
  begenaExp: string;
  instrumentOwned: string[];
  churchAffiliation: string;
  selectedCourseName: string;
  selectedLevelName: string;
  learningMode: 'In-Person' | 'Online';
  selectedBranch: 'Hawassa Campus' | 'Virtual Gate';
  durationMonths: number;
  frequency: string;
  scheduleDayTime: string;
  paymentMethod: 'CBE' | 'Telebirr' | 'Cash';
  registrationFeeETB: number;
  courseFeeETB: number;
  totalETB: number;
  receiptUrl?: string;
  status: 'Draft' | 'Submitted' | 'Under Review' | 'Correction Required' | 'Payment Pending' | 'Payment Verification' | 'Approved' | 'Rejected' | 'Enrollment Active';
  paymentStatus?: string;
  isPaymentCompleted?: boolean;
  submittedAt: string;
  notes?: string;
  assignedTeacherName?: string;
}

interface StudentRecord {
  id: string; // internal system ID
  studentRegistrationId?: string;
  applicationId: string;
  fullName: string;
  gender: string;
  age?: number | string;
  dob?: string;
  phone: string;
  email: string;
  city?: string;
  subcity?: string;
  woreda?: string;
  address?: string;
  emergencyName?: string;
  emergencyPhone?: string;
  emergencyRel?: string;
  emergencyContact?: string;
  occupationType?: string;
  schoolOrOrg?: string;
  gradeOrTitle?: string;
  occupation?: string;
  churchAffiliation?: string;
  churchName?: string;
  begenaExp?: string;
  previousExperience?: string;
  instrumentOwned?: string;
  course: string;
  level: string;
  branch: string;
  mode: 'In-Person' | 'Online';
  schedule: string;
  durationMonths?: number;
  teacherName: string;
  assignedTeacherName?: string;
  enrollmentDate: string;
  status: 'Active' | 'Inactive' | 'Pending' | 'Graduated' | 'Suspended' | 'Transferred' | 'Withdrawn';
  photo: string;
  registrationFeeETB?: number;
  courseFeeETB?: number;
  totalFeeETB?: number;
  paymentMethod?: string;
  paymentStatus?: string;
  paymentReference?: string;
  receiptUrl?: string;
  registrationSource?: string;
  registeredBy?: string;
  registrationFeePaid: boolean;
  tuitionPaid: boolean;
  attendancePercent?: number;
  previousBranches?: { branch: string; transferDate: string; reason: string; approvedBy: string }[];
}

interface ClassScheduleItem {
  id: string;
  course: string;
  level: string;
  teacher: string;
  branch: string;
  room: string;
  mode: 'In-Person' | 'Online';
  day: string;
  time: string;
  capacity: number;
  enrolledCount: number;
  status: 'Active' | 'Inactive' | 'Cancelled';
}

interface PaymentRecord {
  id: string;
  studentName: string;
  course: string;
  amount: number;
  method: 'CBE' | 'Telebirr' | 'Cash';
  date: string;
  receiptImage: string;
  status: 'Pending' | 'Verified' | 'Rejected';
  verifiedBy?: string;
}

interface StaffTask {
  id: string;
  title: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  dueDate: string;
  status: 'Pending' | 'Completed';
  category: 'Application' | 'Payment' | 'Transfer' | 'ID Card' | 'Attendance';
}

export function RegistrationStaffPortal({ onNavigate, lang }: RegistrationStaffPortalProps) {
  const { currentUser, getAuthoritativeUser, addNotification, logout, deleteStudentAccount, registerOrUpdateStudentAccount } = useAuth();
  const [profileSyncTick, setProfileSyncTick] = useState(0);
  const {
    students: persistentStudents,
    addStudentRegistration,
    submitPaymentReceipt,
    payments: persistentPayments,
    approvePaymentRecord,
    deleteStudent,
    teachers,
    enrollments,
    autoAssignTeachersForUnassignedEnrollments,
    autoAssignTeacherForEnrollment,
    assignTeacherToEnrollment
  } = useData();

  // Active Tab navigation
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'new-student' | 'applications' | 'payments' | 'directory' | 'teacher-directory' | 'student-detail' | 'attendance' | 'schedule' | 'transfers' | 'tasks' | 'audit'
  >('dashboard');

  // Teacher Directory State
  const [teacherSearch, setTeacherSearch] = useState('');
  const [teacherSpecFilter, setTeacherSpecFilter] = useState('All');
  const [reassigningEnrId, setReassigningEnrId] = useState<string | null>(null);
  const [selectedTeacherIdForReassign, setSelectedTeacherIdForReassign] = useState<string>('');
  const [selectedAssignableStudentByTeacher, setSelectedAssignableStudentByTeacher] = useState<Record<string, string>>({});

  // Selected Student for detailed profile view
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  // Modal for Viewing Full Student Attendance Record
  const [attendanceModalStudent, setAttendanceModalStudent] = useState<any | null>(null);

  // Modal for Auto-Assign Results Summary
  const [autoAssignSummaryModal, setAutoAssignSummaryModal] = useState<any | null>(null);

  // Helper function to get full attendance logs for a student
  const getStudentAttendanceLogs = (student: any) => {
    if (!student) return [];
    const sId = (student.id || '').toLowerCase().trim();
    const sEmail = (student.email || '').toLowerCase().trim();
    const sName = (student.fullName || student.name || '').toLowerCase().trim();

    let records: any[] = [];
    try {
      const raw = localStorage.getItem('ab_attendance_records_v4') || localStorage.getItem('ab_attendance_v4');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          records = parsed.filter((r: any) => {
            const rId = (r.studentId || '').toLowerCase().trim();
            const rEmail = (r.studentEmail || '').toLowerCase().trim();
            const rName = (r.studentName || '').toLowerCase().trim();
            return (sId && rId === sId) || (sEmail && rEmail === sEmail) || (sName && rName === sName);
          });
        }
      }
    } catch (e) {
      console.error(e);
    }

    if (records.length === 0) {
      records = [];
    }

    return records.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  // Filter States
  const [globalSearch, setGlobalSearch] = useState('');
  const [selectedBranchFilter, setSelectedBranchFilter] = useState<string>('All');
  const [selectedCourseFilter, setSelectedCourseFilter] = useState<string>('All');

  // Multi-branch Isolation check
  const staffAssignedBranch = currentUser?.branch || 'Hawassa Main Branch'; // default branch for staff

  // Helper to compute student attendance percentage from real marked attendance records
  const getStudentAttendancePercent = (studentId?: string, studentEmail?: string, studentName?: string): number | undefined => {
    try {
      const recordsStr = localStorage.getItem('ab_attendance_records_v4');
      if (!recordsStr) return undefined;
      const records = JSON.parse(recordsStr);
      if (!Array.isArray(records) || records.length === 0) return undefined;

      const sId = (studentId || '').toLowerCase().trim();
      const sEmail = (studentEmail || '').toLowerCase().trim();
      const sName = (studentName || '').toLowerCase().trim();

      const studentRecords = records.filter((r: any) => {
        const rId = (r.studentId || '').toLowerCase().trim();
        const rEmail = (r.studentEmail || '').toLowerCase().trim();
        const rName = (r.studentName || '').toLowerCase().trim();
        return (sId && rId === sId) || (sEmail && rEmail === sEmail) || (sName && rName === sName);
      });

      const markedRecords = studentRecords.filter((r: any) => r.status && r.status !== 'Not Marked');
      if (markedRecords.length === 0) return undefined;

      const presentOrLate = markedRecords.filter((r: any) => r.status === 'Present' || r.status === 'Late' || r.status === 'Permission').length;
      return Math.round((presentOrLate / markedRecords.length) * 100);
    } catch (e) {
      return undefined;
    }
  };

  // ----------------------------------------------------
  // CENTRALIZED STATE & LOCALSTORAGE SYNC
  // ----------------------------------------------------
  const [applications, setApplications] = useState<ApplicationRecord[]>(() => {
    const saved = localStorage.getItem('ab_applications_v3');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [];
  });

  const [students, setStudents] = useState<StudentRecord[]>(() => {
    const saved = localStorage.getItem('ab_students_v3');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [];
  });

  const [classes, setClasses] = useState<ClassScheduleItem[]>(() => {
    const saved = localStorage.getItem('ab_classes_v3');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [];
  });

  const [payments, setPayments] = useState<PaymentRecord[]>(() => {
    const saved = localStorage.getItem('ab_payments_v3');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [];
  });

  const [tasks, setTasks] = useState<StaffTask[]>(() => {
    const saved = localStorage.getItem('ab_staff_tasks_v3');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [];
  });

  const [auditLogs, setAuditLogs] = useState<{ id: string; user: string; role: string; action: string; target: string; time: string }[]>(() => {
    const saved = localStorage.getItem('ab_audit_logs_v3');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [];
  });

  const [deletedStudentIds, setDeletedStudentIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('ab_deleted_students_v3');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [];
  });

  const [studentToDelete, setStudentToDelete] = useState<StudentRecord | null>(null);

  // Sync to LocalStorage
  useEffect(() => { safeSetItem('ab_applications_v3', JSON.stringify(applications)); }, [applications]);
  useEffect(() => { safeSetItem('ab_students_v3', JSON.stringify(students)); }, [students]);
  useEffect(() => { safeSetItem('ab_classes_v3', JSON.stringify(classes)); }, [classes]);
  useEffect(() => { safeSetItem('ab_payments_v3', JSON.stringify(payments)); }, [payments]);
  useEffect(() => { safeSetItem('ab_staff_tasks_v3', JSON.stringify(tasks)); }, [tasks]);
  useEffect(() => { safeSetItem('ab_audit_logs_v3', JSON.stringify(auditLogs)); }, [auditLogs]);
  useEffect(() => { safeSetItem('ab_deleted_students_v3', JSON.stringify(deletedStudentIds)); }, [deletedStudentIds]);

  // Sync from external events (e.g., Student Profile updates, Accountant Portal verification)
  useEffect(() => {
    const handleStorageSync = () => {
      try {
        const savedApps = localStorage.getItem('ab_applications_v3');
        if (savedApps) setApplications(JSON.parse(savedApps));
        const savedStus = localStorage.getItem('ab_students_v3');
        if (savedStus) setStudents(JSON.parse(savedStus));
        const savedPay = localStorage.getItem('ab_payments_v3');
        if (savedPay) setPayments(JSON.parse(savedPay));
        setProfileSyncTick(t => t + 1);
      } catch (e) {
        console.error('Error syncing localStorage in RegistrationStaffPortal:', e);
      }
    };

    window.addEventListener('ab_user_updated', handleStorageSync);
    window.addEventListener('user-profile-updated', handleStorageSync);
    window.addEventListener('ab_students_updated', handleStorageSync);
    window.addEventListener('ab_enrollments_updated', handleStorageSync);
    window.addEventListener('storage', handleStorageSync);
    return () => {
      window.removeEventListener('ab_user_updated', handleStorageSync);
      window.removeEventListener('user-profile-updated', handleStorageSync);
      window.removeEventListener('ab_students_updated', handleStorageSync);
      window.removeEventListener('ab_enrollments_updated', handleStorageSync);
      window.removeEventListener('storage', handleStorageSync);
    };
  }, []);

  // Combine all students across DataContext persistent storage, applications, and local state
  const displayStudents = React.useMemo(() => {
    // Collect all verified identifiers (names, emails, IDs) from payments & accounts
    const verifiedIdentifiers = new Set<string>();

    (persistentPayments || []).forEach(p => {
      const pStatus = p.status as string;
      if (pStatus === 'Approved' || pStatus === 'Verified') {
        if (p.studentId) verifiedIdentifiers.add(p.studentId.toLowerCase());
        if (p.studentEmail) verifiedIdentifiers.add(p.studentEmail.toLowerCase());
        if (p.studentName) verifiedIdentifiers.add(p.studentName.toLowerCase().trim());
      }
    });

    try {
      const savedTxns = JSON.parse(localStorage.getItem('ab_transactions_v3') || '[]');
      savedTxns.forEach((t: any) => {
        if (t.status === 'Verified' || t.status === 'Approved') {
          if (t.studentId) verifiedIdentifiers.add(t.studentId.toLowerCase());
          if (t.studentName) verifiedIdentifiers.add(t.studentName.toLowerCase().trim());
        }
      });
    } catch (e) {}

    try {
      const savedAccounts = JSON.parse(localStorage.getItem('ab_accounts') || '{}');
      Object.values(savedAccounts).forEach((acc: any) => {
        if (acc.isPaymentCompleted || acc.studentStatus === 'Enrollment Active' || acc.status === 'Active') {
          if (acc.id) verifiedIdentifiers.add(acc.id.toLowerCase());
          if (acc.email) verifiedIdentifiers.add(acc.email.toLowerCase());
          if (acc.fullName) verifiedIdentifiers.add(acc.fullName.toLowerCase().trim());
        }
      });
    } catch (e) {}

    const studentList: StudentRecord[] = [];

    const addOrMergeRecord = (rec: StudentRecord) => {
      if (!rec) return;
      const rawName = rec.fullName || '';
      const nameKey = rawName.toLowerCase().trim();
      if (!nameKey) return;
      const emailKey = rec.email && rec.email !== 'student@begena.com' ? rec.email.trim().toLowerCase() : null;

      const isVerifiedInSet =
        (rec.id && verifiedIdentifiers.has(rec.id.toLowerCase())) ||
        (rec.applicationId && verifiedIdentifiers.has(rec.applicationId.toLowerCase())) ||
        (emailKey && verifiedIdentifiers.has(emailKey)) ||
        (nameKey && verifiedIdentifiers.has(nameKey));

      const isRecordVerified =
        isVerifiedInSet ||
        rec.paymentStatus === 'Verified' ||
        rec.paymentStatus === 'Approved' ||
        (rec.status as string) === 'Active' ||
        (rec.status as string) === 'Approved' ||
        rec.tuitionPaid === true;

      const updatedRec: StudentRecord = {
        ...rec,
        paymentStatus: isRecordVerified ? 'Verified' : rec.paymentStatus || 'Pending Verification',
        status: isRecordVerified ? 'Active' : rec.status || 'Pending',
        registrationFeePaid: isRecordVerified || rec.registrationFeePaid,
        tuitionPaid: isRecordVerified || rec.tuitionPaid
      };

      const existingIdx = studentList.findIndex(item => {
        const itemName = (item.fullName || '').trim().toLowerCase();
        const itemEmail = item.email && item.email !== 'student@begena.com' ? item.email.trim().toLowerCase() : null;
        if (rec.id && item.id && rec.id === item.id) return true;
        if (rec.applicationId && item.applicationId && rec.applicationId === item.applicationId) return true;
        if (emailKey && itemEmail && emailKey === itemEmail) return true;
        if (nameKey && itemName && nameKey === itemName) return true;
        return false;
      });

      if (existingIdx >= 0) {
        const existing = studentList[existingIdx];
        const mergedVerified =
          updatedRec.paymentStatus === 'Verified' ||
          existing.paymentStatus === 'Verified' ||
          updatedRec.paymentStatus === 'Approved' ||
          existing.paymentStatus === 'Approved' ||
          updatedRec.status === 'Active' ||
          existing.status === 'Active';

        const prefersNewId =
          (updatedRec.id.startsWith('STU-') || updatedRec.id.startsWith('ABS-')) &&
          (!existing.id.startsWith('STU-') && !existing.id.startsWith('ABS-'));

        const merged: StudentRecord = {
          ...(prefersNewId ? { ...existing, ...updatedRec } : { ...updatedRec, ...existing }),
          paymentStatus: mergedVerified ? 'Verified' : 'Pending Verification',
          status: mergedVerified ? 'Active' : (existing.status || updatedRec.status || 'Pending'),
          registrationFeePaid: mergedVerified || existing.registrationFeePaid || updatedRec.registrationFeePaid,
          tuitionPaid: mergedVerified || existing.tuitionPaid || updatedRec.tuitionPaid
        };
        studentList[existingIdx] = merged;
      } else {
        studentList.push(updatedRec);
      }
    };

    // 1. DataContext persistent students
    if (persistentStudents && Array.isArray(persistentStudents)) {
      persistentStudents.forEach(ps => {
        addOrMergeRecord({
          id: ps.id,
          applicationId: `APP-${ps.id.replace(/[^0-9]/g, '') || Math.floor(1000 + Math.random() * 8999)}`,
          fullName: ps.fullName,
          gender: ps.gender || 'Not Specified',
          age: ps.age || 20,
          dob: '2004-05-12',
          phone: ps.phone || '+251911000000',
          email: ps.email || 'student@begena.com',
          city: 'Addis Ababa',
          subcity: ps.address ? ps.address.split(',')[0] : 'Arada Subcity',
          address: ps.address || 'Addis Ababa, Ethiopia',
          emergencyContact: ps.emergencyContact || 'Family Member (+251911000000)',
          emergencyName: ps.emergencyContact ? ps.emergencyContact.split('(')[0].trim() : 'Emergency Contact',
          emergencyPhone: ps.emergencyContact && ps.emergencyContact.includes('(') ? ps.emergencyContact.split('(')[1].replace(')', '').trim() : '+251911000000',
          emergencyRel: 'Family Member',
          occupation: ps.occupation || ps.educationInfo || 'Student',
          occupationType: ps.occupation || 'Student',
          schoolOrOrg: ps.educationInfo || 'Educational Institution',
          churchAffiliation: ps.churchName || 'Ethiopian Orthodox Tewahedo Church',
          churchName: ps.churchName || 'Ethiopian Orthodox Tewahedo Church',
          begenaExp: ps.previousExperience || 'Beginner Practice',
          previousExperience: ps.previousExperience || 'Beginner Practice',
          instrumentOwned: ps.instrumentOwned || ps.instrument || 'Traditional Begena',
          course: ps.courseName ? ps.courseName.split('-')[0].trim() : (ps.instrument || 'Begena'),
          level: ps.level || 'Basic 1',
          branch: ps.branch || 'Hawassa Campus',
          mode: ps.learningMode === 'Online' ? 'Online' : 'In-Person',
          schedule: ps.scheduleDayTime || ps.schedule || (ps.scheduleDays ? (Array.isArray(ps.scheduleDays) ? ps.scheduleDays.join('/') : ps.scheduleDays) : null) || (ps.scheduleFrequency ? `${ps.scheduleFrequency} Program` : null) || '5 Days Program',
          durationMonths: ps.durationMonths || 3,
          teacherName: ps.assignedTeacherName || (ps as any).teacherName || 'Not Assigned Yet',
          enrollmentDate: ps.registeredAt ? ps.registeredAt.split('T')[0] : '2026-07-21',
          status: ps.status === 'Approved' ? 'Active' : ps.status === 'Suspended' ? 'Suspended' : 'Pending',
          photo: ps.photoUrl || '',
          registrationFeeETB: ps.registrationFeeETB || 200,
          courseFeeETB: ps.courseFeeETB || 930,
          totalFeeETB: ps.totalFeeETB || ((ps.registrationFeeETB || 200) + (ps.courseFeeETB || 930)),
          paymentMethod: ps.paymentMethod || 'Cash',
          paymentStatus: (ps.paymentStatus as string) === 'Approved' || (ps.paymentStatus as string) === 'Verified' || (ps.status as string) === 'Approved' ? 'Verified' : 'Pending Verification',
          paymentReference: ps.paymentReference || 'REF-CASH-2026',
          receiptUrl: ps.paymentProofUrl,
          registrationSource: ps.registrationSource || 'Staff Portal Registration',
          registeredBy: ps.registeredBy || 'Front Desk Staff',
          registrationFeePaid: (ps.paymentStatus as string) === 'Approved' || (ps.paymentStatus as string) === 'Verified' || (ps.status as string) === 'Approved',
          tuitionPaid: (ps.paymentStatus as string) === 'Approved' || (ps.paymentStatus as string) === 'Verified' || (ps.status as string) === 'Approved',
          attendancePercent: getStudentAttendancePercent(ps.id, ps.email, ps.fullName)
        });
      });
    }

    // 2. Add local state students
    students.forEach(st => {
      addOrMergeRecord({
        ...st,
        gender: st.gender || 'Male',
        age: st.age || 21,
        address: st.address || 'Hawassa, Center Point Tower',
        emergencyContact: st.emergencyContact || 'Parent (+251911223344)',
        emergencyName: st.emergencyName || 'Parent / Guardian',
        emergencyPhone: st.emergencyPhone || '+251911223344',
        emergencyRel: st.emergencyRel || 'Parent',
        occupation: st.occupation || 'University Student',
        churchAffiliation: st.churchAffiliation || 'EOTC St. Mary',
        begenaExp: st.begenaExp || 'Beginner Practice',
        instrumentOwned: st.instrumentOwned || 'Traditional Begena',
        registrationFeeETB: st.registrationFeeETB || 200,
        courseFeeETB: st.courseFeeETB || 930,
        totalFeeETB: st.totalFeeETB || 1130,
        paymentMethod: st.paymentMethod || 'Cash',
        paymentStatus: st.paymentStatus || 'Verified',
        registrationSource: st.registrationSource || 'Front Desk Registration',
        registeredBy: st.registeredBy || 'Registration Staff',
        attendancePercent: getStudentAttendancePercent(st.id, st.email, st.fullName)
      });
    });

    // 3. Add applications from applications state
    applications.forEach(app => {
      const fullName = `${app.firstName || ''} ${app.lastName || ''}`.trim() || app.studentName || 'Registered Student';
      const isAppVerified = app.status === 'Approved' || app.paymentStatus === 'Approved' || app.paymentStatus === 'Verified' || app.isPaymentCompleted === true;

      addOrMergeRecord({
        id: app.studentId || app.id || `ABS-PZ-2026-${Math.floor(1000 + Math.random() * 8999)}`,
        applicationId: app.applicationId || app.id,
        fullName,
        gender: app.gender || 'Not Specified',
        age: app.dob || '22',
        phone: app.phone || '+251911000000',
        email: app.email || 'student@begena.com',
        city: app.city || 'Addis Ababa',
        subcity: app.subcity || 'Arada Subcity',
        woreda: app.woreda || '03',
        address: `${app.address || ''}, ${app.subcity || ''}, ${app.city || 'Addis Ababa'}`.replace(/^, |, $/g, ''),
        emergencyName: app.emergencyName || 'Emergency Contact',
        emergencyPhone: app.emergencyPhone || '+251911000000',
        emergencyRel: app.emergencyRel || 'Family',
        emergencyContact: `${app.emergencyName || 'Contact'} (${app.emergencyPhone || '+251911000000'})`,
        occupationType: app.occupationType,
        schoolOrOrg: app.schoolOrOrg,
        gradeOrTitle: app.gradeOrTitle,
        occupation: `${app.occupationType || 'Student'} ${app.schoolOrOrg ? 'at ' + app.schoolOrOrg : ''}`,
        churchAffiliation: app.churchAffiliation || 'EOTC',
        churchName: app.churchAffiliation || 'EOTC',
        begenaExp: app.begenaExp || 'Beginner',
        previousExperience: app.begenaExp || 'Beginner',
        instrumentOwned: Array.isArray(app.instrumentOwned) ? app.instrumentOwned.join(', ') : app.instrumentOwned || 'None',
        course: app.selectedCourseName || 'Begena',
        level: app.selectedLevelName || 'Basic 1',
        branch: app.selectedBranch || 'Hawassa Campus',
        mode: app.learningMode || 'In-Person',
        schedule: app.scheduleDayTime || app.frequency || 'Standard Schedule',
        durationMonths: app.durationMonths || 3,
        teacherName: app.assignedTeacherName || 'Not Assigned Yet',
        enrollmentDate: app.submittedAt ? app.submittedAt.split(' ')[0] : '2026-07-21',
        status: isAppVerified ? 'Active' : 'Pending',
        photo: '',
        registrationFeeETB: app.registrationFeeETB || 200,
        courseFeeETB: app.courseFeeETB || 930,
        totalFeeETB: app.totalETB || 1130,
        paymentMethod: app.paymentMethod || 'Cash',
        paymentStatus: isAppVerified ? 'Verified' : 'Pending Verification',
        paymentReference: app.receiptUrl ? 'Receipt Uploaded' : 'N/A',
        registrationSource: 'Self-Registered Application',
        registeredBy: 'Student Self-Service',
        registrationFeePaid: isAppVerified,
        tuitionPaid: isAppVerified,
        attendancePercent: getStudentAttendancePercent(app.studentId || app.id, app.email, fullName)
      });
    });

    return studentList
      .map(s => {
        const authUser = getAuthoritativeUser ? getAuthoritativeUser(s.email || s.id || s.applicationId) : undefined;
        
        // Lookup assigned teacher from enrollments
        const matchingEnr = (enrollments || []).find(e =>
          e && (
            (s.id && e.studentId && e.studentId.toLowerCase() === s.id.toLowerCase()) ||
            (s.email && e.studentEmail && e.studentEmail.toLowerCase() === s.email.toLowerCase()) ||
            (s.fullName && e.studentName && e.studentName.toLowerCase().trim() === s.fullName.toLowerCase().trim())
          )
        );

        let realTeacher = matchingEnr?.assignedTeacherName;
        if (!realTeacher) {
          if (s.assignedTeacherName && s.assignedTeacherName !== 'Lique Mezemer Bruk') {
            realTeacher = s.assignedTeacherName;
          } else if (s.teacherName && s.teacherName !== 'Lique Mezemer Bruk') {
            realTeacher = s.teacherName;
          } else {
            realTeacher = s.assignedTeacherName || 'Not Assigned Yet';
          }
        }

        const baseRecord = authUser ? {
          ...s,
          photo: authUser.avatar || (authUser as any).photo || s.photo,
          fullName: authUser.fullName || s.fullName,
          phone: authUser.phone || s.phone,
          email: authUser.email || s.email
        } : s;

        return {
          ...baseRecord,
          teacherName: realTeacher
        };
      })
      .filter(s => !deletedStudentIds.includes(s.id) && !deletedStudentIds.includes(s.applicationId));
  }, [students, persistentStudents, applications, persistentPayments, deletedStudentIds, getAuthoritativeUser, profileSyncTick, enrollments]);

  // Combined Assignable Options for Teacher Assignment
  const allAssignableOptions = React.useMemo(() => {
    const list: { id: string; studentName: string; courseName: string; assignedTeacherName?: string }[] = [];
    const addedKeys = new Set<string>();

    enrollments.forEach(e => {
      list.push({
        id: e.id,
        studentName: e.studentName,
        courseName: e.courseName,
        assignedTeacherName: e.assignedTeacherName
      });
      if (e.id) addedKeys.add(e.id.toLowerCase());
      if (e.studentId) addedKeys.add(e.studentId.toLowerCase());
      if (e.studentEmail) addedKeys.add(e.studentEmail.toLowerCase());
      if (e.studentName) addedKeys.add(e.studentName.toLowerCase().trim());
    });

    displayStudents.forEach(st => {
      const isAdded = 
        (st.id && addedKeys.has(st.id.toLowerCase())) ||
        (st.email && addedKeys.has(st.email.toLowerCase())) ||
        (st.fullName && addedKeys.has(st.fullName.toLowerCase().trim()));

      if (!isAdded) {
        const optionId = st.id || st.email || st.fullName || '';
        if (!optionId) return;

        list.push({
          id: optionId,
          studentName: st.fullName,
          courseName: st.course ? `${st.course} - ${st.level}` : 'Begena Course',
          assignedTeacherName: st.teacherName && st.teacherName !== 'Lique Mezemer Bruk' ? st.teacherName : undefined
        });
        if (st.id) addedKeys.add(st.id.toLowerCase());
        if (st.email) addedKeys.add(st.email.toLowerCase());
        if (st.fullName) addedKeys.add(st.fullName.toLowerCase().trim());
      }
    });

    return list;
  }, [enrollments, displayStudents]);

  // Handle student deletion
  const handleConfirmDelete = (student: StudentRecord) => {
    const targetId = student.id;
    const appId = student.applicationId;
    const targetEmail = student.email;
    const targetPhone = student.phone;
    const targetName = student.fullName;

    // 1. Centralized DataContext deletion (handles state & cascading storage purges)
    try {
      deleteStudent(targetId);
    } catch (e) {
      console.error('Error calling deleteStudent on DataContext:', e);
    }

    // 2. Centralized AuthContext deletion (handles account removal, blacklist & session invalidation)
    if (deleteStudentAccount) {
      deleteStudentAccount(targetId, targetEmail, targetPhone);
    }

    // 3. Remove from local component state
    setStudents(prev => prev.filter(s => s.id !== targetId && s.applicationId !== appId && s.email !== targetEmail));
    setApplications(prev => prev.filter(a => a.studentId !== targetId && a.id !== appId && a.applicationId !== appId && a.email !== targetEmail));

    // 4. Update local deleted IDs tracking
    const newDeleted = Array.from(new Set([...deletedStudentIds, targetId, appId, targetEmail].filter(Boolean)));
    setDeletedStudentIds(newDeleted);

    // 5. Notify & Audit
    logAudit('Student Account Deleted', `${targetName} (${targetId})`);
    addNotification('Student Account Deleted', `${targetName} (${targetId}) account permanently deleted.`, 'system');

    if (selectedStudentId === targetId) {
      setSelectedStudentId(null);
    }

    setStudentToDelete(null);
  };

  // Log audit helper
  const logAudit = (action: string, target: string) => {
    const logItem = {
      id: `aud_${Date.now()}`,
      user: currentUser?.fullName || 'Registration Staff',
      role: 'Registration Staff',
      action,
      target,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setAuditLogs(prev => [logItem, ...prev]);
  };

  // ----------------------------------------------------
  // MULTI-STEP NEW STUDENT REGISTRATION FORM STATE (Steps 1-13)
  // ----------------------------------------------------
  const [regStep, setRegStep] = useState<number>(1);
  const [regFormData, setRegFormData] = useState({
    firstName: '',
    lastName: '',
    gender: 'Male',
    dob: '2000-01-01',
    phone: '',
    email: '',
    emergencyName: '',
    emergencyPhone: '',
    emergencyRel: 'Parent',
    country: 'Ethiopia',
    city: 'Hawassa',
    subcity: 'Center Point',
    woreda: '01',
    address: '',
    occupationType: 'student',
    schoolOrOrg: '',
    gradeOrTitle: '',
    begenaExp: 'None',
    instrumentOwned: [] as string[],
    churchAffiliation: '',
    selectedCourseName: 'Begena',
    selectedLevelName: 'Begena Level 1',
    learningMode: 'In-Person',
    selectedBranch: 'Hawassa Campus',
    scheduleDayTime: 'Mon / Tue / Wed / Thu / Fri - 09:00 AM - 10:00 AM',
    durationMonths: 3,
    frequency: '5 days per week, 1 hour per day',
    paymentMethod: 'Cash',
    registrationFeeETB: 200, // Configurable registration fee
    courseFeeETB: 930,
    receiptUrl: ''
  });

  const [conflictWarning, setConflictWarning] = useState<string | null>(null);

  // Registration step handler
  const handleNextStep = () => {
    if (regStep === 1 && (!regFormData.firstName || !regFormData.lastName)) {
      alert('Please fill out first and last name.');
      return;
    }
    if (regStep === 2 && !regFormData.phone) {
      alert('Please enter a valid phone number.');
      return;
    }
    // Schedule seat check in Step 9
    if (regStep === 9) {
      const selectedCls = classes.find(c => c.course === regFormData.selectedCourseName && c.branch === regFormData.selectedBranch);
      if (selectedCls && selectedCls.enrolledCount >= selectedCls.capacity) {
        setConflictWarning(`Notice: ${selectedCls.room} has reached full capacity (${selectedCls.capacity}/${selectedCls.capacity}). Student will be placed on Waitlist.`);
      } else {
        setConflictWarning(null);
      }
    }
    setRegStep(prev => Math.min(prev + 1, 13));
  };

  const handlePrevStep = () => {
    setRegStep(prev => Math.max(prev - 1, 1));
  };

  const handleFinalSubmitRegistration = () => {
    const appId = `APP-2026-${Math.floor(100 + Math.random() * 900)}`;
    const branchCode = 'HW';
    const studentId = `ABS-${branchCode}-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newApp: ApplicationRecord = {
      applicationId: appId,
      studentId,
      ...regFormData,
      occupationType: regFormData.occupationType as any,
      learningMode: regFormData.learningMode as any,
      selectedBranch: regFormData.selectedBranch as any,
      paymentMethod: regFormData.paymentMethod as any,
      totalETB: regFormData.registrationFeeETB + regFormData.courseFeeETB,
      status: regFormData.paymentMethod === 'Cash' ? 'Approved' : 'Payment Verification',
      submittedAt: new Date().toLocaleString()
    };

    setApplications([newApp, ...applications]);

    // If cash or instant approval: create student immediately!
    if (regFormData.paymentMethod === 'Cash') {
      const newStudentRecord: StudentRecord = {
        id: studentId,
        studentRegistrationId: generateStudentRegistrationId(
          students.map((s) => s.studentRegistrationId).filter(Boolean) as string[],
          new Date().toISOString()
        ),
        applicationId: appId,
        fullName: `${regFormData.firstName} ${regFormData.lastName}`,
        gender: regFormData.gender,
        phone: regFormData.phone,
        email: regFormData.email || `${regFormData.firstName.toLowerCase()}@begena.com`,
        course: regFormData.selectedCourseName,
        level: regFormData.selectedLevelName,
        branch: regFormData.selectedBranch,
        mode: regFormData.learningMode as any,
        schedule: regFormData.scheduleDayTime,
        teacherName: 'Not Assigned Yet',
        enrollmentDate: new Date().toISOString().split('T')[0],
        status: 'Active',
        photo: '',
        registrationFeePaid: true,
        tuitionPaid: true
      };
      setStudents([newStudentRecord, ...students]);

      addStudentRegistration({
        fullName: `${regFormData.firstName} ${regFormData.lastName}`,
        email: regFormData.email || `${regFormData.firstName.toLowerCase()}@begena.com`,
        phone: regFormData.phone,
        gender: regFormData.gender,
        age: 20,
        address: `${regFormData.address}, ${regFormData.subcity}, ${regFormData.city}`,
        emergencyContact: `${regFormData.emergencyName} (${regFormData.emergencyPhone})`,
        previousExperience: regFormData.begenaExp || 'None',
        instrumentOwned: regFormData.selectedCourseName,
        courseId: regFormData.selectedCourseName.toLowerCase(),
        courseName: `${regFormData.selectedCourseName} - ${regFormData.selectedLevelName}`,
        instrument: regFormData.selectedCourseName,
        level: regFormData.selectedLevelName,
        branch: regFormData.selectedBranch,
        learningMode: regFormData.learningMode as any,
        durationMonths: regFormData.durationMonths,
        registrationFeeETB: regFormData.registrationFeeETB,
        courseFeeETB: regFormData.courseFeeETB,
        totalFeeETB: regFormData.registrationFeeETB + regFormData.courseFeeETB,
        paymentMethod: regFormData.paymentMethod as any,
        registrationSource: 'Registered by Staff',
        registeredBy: currentUser?.fullName || 'Registration Staff'
      });

      if (registerOrUpdateStudentAccount) {
        registerOrUpdateStudentAccount({
          id: studentId,
          email: regFormData.email || `${regFormData.firstName.toLowerCase()}@begena.com`,
          fullName: `${regFormData.firstName} ${regFormData.lastName}`,
          phone: regFormData.phone,
          instrument: regFormData.selectedCourseName,
          level: regFormData.selectedLevelName,
          password: (regFormData as any).password || 'Password123!',
          status: 'Active',
          studentStatus: 'Enrollment Active'
        });
      }

      addNotification('Registration Complete', `New student ${newStudentRecord.fullName} registered & activated with ID: ${studentId}`, 'registration');
      logAudit('Manual Student Registered', `${newStudentRecord.fullName} (${studentId})`);
    } else {
      addNotification('Application Submitted', `Application ${appId} recorded. Pending payment verification.`, 'registration');
      logAudit('Application Filed', `${regFormData.firstName} ${regFormData.lastName} (${appId})`);
    }

    // Reset Form
    setRegStep(1);
    setActiveTab('applications');
  };

  // ----------------------------------------------------
  // APPLICATION APPROVAL WORKFLOW
  // ----------------------------------------------------
  const handleApproveApplication = (app: ApplicationRecord) => {
    const branchCode = 'HW';
    const generatedId = app.studentId || `ABS-${branchCode}-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    // Update app status
    setApplications(prev => prev.map(a => a.applicationId === app.applicationId ? { ...a, status: 'Approved', studentId: generatedId } : a));

    // Create active student record
    const newStudent: StudentRecord = {
      id: generatedId,
      applicationId: app.applicationId,
      fullName: `${app.firstName} ${app.lastName}`,
      gender: app.gender,
      phone: app.phone,
      email: app.email,
      course: app.selectedCourseName,
      level: app.selectedLevelName,
      branch: app.selectedBranch,
      mode: app.learningMode,
      schedule: app.scheduleDayTime,
      teacherName: app.assignedTeacherName || 'Not Assigned Yet',
      enrollmentDate: new Date().toISOString().split('T')[0],
      status: 'Active',
      photo: '',
      registrationFeePaid: true,
      tuitionPaid: true
    };

    setStudents(prev => [...prev.filter(s => s.id !== generatedId), newStudent]);

    addStudentRegistration({
      fullName: `${app.firstName} ${app.lastName}`,
      email: app.email,
      phone: app.phone,
      gender: app.gender,
      age: 22,
      address: `${app.address || ''}, ${app.city || ''}`,
      emergencyContact: `${app.emergencyName || ''} (${app.emergencyPhone || ''})`,
      previousExperience: app.begenaExp || 'None',
      instrumentOwned: app.selectedCourseName,
      courseId: (app.selectedCourseName || 'begena').toLowerCase(),
      courseName: `${app.selectedCourseName} - ${app.selectedLevelName}`,
      instrument: app.selectedCourseName,
      level: app.selectedLevelName,
      branch: app.selectedBranch,
      learningMode: app.learningMode as any,
      totalFeeETB: app.totalETB,
      paymentMethod: app.paymentMethod as any,
      registrationSource: 'Registered by Staff',
      registeredBy: currentUser?.fullName || 'Registration Staff'
    });

    // Update user accounts (`ab_accounts` & active session `ab_session_user`)
    try {
      const appInst = app.selectedCourseName || (app as any).selectedInstrument || (app as any).instrument || 'Begena';
      const appCourse = `${appInst} - ${app.selectedLevelName || 'Basic 1'}`;

      const savedAccounts = JSON.parse(localStorage.getItem('ab_accounts') || '{}');
      let accountUpdated = false;
      Object.keys(savedAccounts).forEach(email => {
        const acc = savedAccounts[email];
        if (acc.id === (app as any).userId || acc.id === app.studentId || acc.email === app.email || acc.fullName === `${app.firstName} ${app.lastName}`) {
          savedAccounts[email] = {
            ...acc,
            studentStatus: 'Enrollment Active',
            isRegistrationCompleted: true,
            isPaymentCompleted: true,
            status: 'Active',
            enrolledInstrument: appInst,
            enrolledCourse: appCourse
          };
          accountUpdated = true;
        }
      });
      if (accountUpdated) {
        safeSetItem('ab_accounts', JSON.stringify(savedAccounts));
      }

      const sessionUser = JSON.parse(localStorage.getItem('ab_session_user') || 'null');
      if (sessionUser && (sessionUser.id === (app as any).userId || sessionUser.id === app.studentId || sessionUser.email === app.email || sessionUser.fullName === `${app.firstName} ${app.lastName}`)) {
        const updatedSession = {
          ...sessionUser,
          studentStatus: 'Enrollment Active',
          isRegistrationCompleted: true,
          isPaymentCompleted: true,
          status: 'Active',
          enrolledInstrument: appInst,
          enrolledCourse: appCourse
        };
        safeSetItem('ab_session_user', JSON.stringify(updatedSession));
      }

      window.dispatchEvent(new Event('ab_user_updated'));
    } catch (e) {
      console.error('Error syncing accounts in RegistrationStaffPortal', e);
    }

    addNotification('Student Approved & Enrolled', `Generated ID: ${generatedId} for ${newStudent.fullName}. Access granted.`, 'registration');
    logAudit('Approved Application', `${app.firstName} ${app.lastName} -> ${generatedId}`);
  };

  const handleRequestCorrection = (appId: string) => {
    const defaultNote = 'Please re-upload a legible payment screenshot or update emergency contact.';
    let note = defaultNote;
    try {
      const input = window.prompt('Enter correction note for student:', defaultNote);
      if (input !== null && input.trim()) {
        note = input.trim();
      }
    } catch (e) {
      note = defaultNote;
    }

    setApplications(prev => prev.map(a => a.applicationId === appId ? { ...a, status: 'Correction Required', notes: note } : a));
    addNotification('Correction Requested', `Student notified to fix details for application ${appId}`, 'registration');
    logAudit('Correction Requested', appId);
  };

  // ----------------------------------------------------
  // PAYMENT VERIFICATION WORKFLOW
  // ----------------------------------------------------
  const handleVerifyPayment = (payId: string) => {
    setPayments(prev => prev.map(p => p.id === payId ? { ...p, status: 'Verified', verifiedBy: currentUser?.fullName } : p));
    const targetPay = payments.find(p => p.id === payId);
    if (targetPay) {
      // Find matching application to upgrade status
      setApplications(prev => prev.map(a => (`${a.firstName || ''} ${a.lastName || ''}`.trim() === targetPay.studentName || a.studentId === (targetPay as any).studentId) ? { ...a, status: 'Approved', paymentStatus: 'Approved', isPaymentCompleted: true } : a));
    }
    addNotification('Payment Verified', `Receipt verified for ${targetPay?.studentName}`, 'payment');
    logAudit('Payment Verified', `${targetPay?.studentName} (${targetPay?.amount} ETB)`);
  };

  // ----------------------------------------------------
  // ATTENDANCE RECORDING WORKFLOW
  // ----------------------------------------------------
  const [attBranch, setAttBranch] = useState('Hawassa Campus');
  const [attCourse, setAttCourse] = useState('Begena');
  const [attDate, setAttDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [attendanceSheet, setAttendanceSheet] = useState<Record<string, 'Present' | 'Absent' | 'Late'>>({});

  const handleMarkAttendance = (studentId: string, status: 'Present' | 'Absent' | 'Late') => {
    setAttendanceSheet(prev => ({ ...prev, [studentId]: status }));
  };

  const handleBulkAttendance = (status: 'Present' | 'Absent') => {
    const updated: Record<string, 'Present' | 'Absent' | 'Late'> = {};
    displayStudents.forEach(s => { updated[s.id] = status; });
    setAttendanceSheet(updated);
  };

  const handleSaveAttendance = () => {
    const entries = Object.entries(attendanceSheet);
    if (entries.length === 0) {
      alert('Please mark attendance for at least one student before saving.');
      return;
    }

    try {
      const existing: any[] = JSON.parse(localStorage.getItem('ab_attendance_records_v4') || '[]');
      const newRecords = entries.map(([sId, status], idx) => {
        const studentObj = displayStudents.find(s => s.id === sId);
        return {
          id: `att_${Date.now()}_${idx}`,
          studentId: sId,
          studentName: studentObj?.fullName || 'Student',
          studentEmail: studentObj?.email || '',
          courseName: attCourse,
          branch: attBranch,
          date: attDate,
          status,
          recordedAt: new Date().toISOString()
        };
      });

      const combined = [...existing, ...newRecords];
      localStorage.setItem('ab_attendance_records_v4', JSON.stringify(combined));
      window.dispatchEvent(new Event('ab_students_updated'));
    } catch (e) {
      console.error('Error saving attendance records:', e);
    }

    addNotification('Attendance Saved', `Attendance recorded for ${entries.length} students on ${attDate}.`, 'system');
    logAudit('Recorded Daily Attendance', `${attBranch} - ${attDate}`);
  };

  // ----------------------------------------------------
  // STUDENT TRANSFER WORKFLOW
  // ----------------------------------------------------
  const [transferStudentId, setTransferStudentId] = useState<string>('ABS-PZ-2026-0010');
  const [targetTransferBranch, setTargetTransferBranch] = useState<'Hawassa Campus' | 'Virtual Gate'>('Virtual Gate');
  const [transferReason, setTransferReason] = useState('Relocation to online studies');

  const handleExecuteTransfer = () => {
    const st = students.find(s => s.id === transferStudentId);
    if (!st) return;

    const previousLog = {
      branch: st.branch,
      transferDate: new Date().toISOString().split('T')[0],
      reason: transferReason,
      approvedBy: currentUser?.fullName || 'Registration Staff'
    };

    setStudents(prev => prev.map(s => {
      if (s.id === transferStudentId) {
        return {
          ...s,
          branch: targetTransferBranch,
          previousBranches: [...(s.previousBranches || []), previousLog]
        };
      }
      return s;
    }));

    addNotification('Branch Transfer Approved', `${st.fullName} transferred from ${st.branch} to ${targetTransferBranch}`, 'registration');
    logAudit('Executed Student Branch Transfer', `${st.fullName} -> ${targetTransferBranch}`);
    setTransferReason('');
  };

  // ----------------------------------------------------
  // CLASS CREATION FORM STATE
  // ----------------------------------------------------
  const [newClsCourse, setNewClsCourse] = useState('Begena');
  const [newClsLevel, setNewClsLevel] = useState('Basic 1');
  const [newClsTeacher, setNewClsTeacher] = useState('Lique Mezemer Bruk');
  const [newClsBranch, setNewClsBranch] = useState('Hawassa Campus');
  const [newClsRoom, setNewClsRoom] = useState('Room 102');
  const [newClsDay, setNewClsDay] = useState('Mon / Wed / Fri');
  const [newClsTime, setNewClsTime] = useState('09:00 AM - 11:00 AM');
  const [newClsCap, setNewClsCap] = useState(15);

  const handleCreateClassSubmit = () => {
    // Conflict detection check
    const existingConflict = classes.find(c => c.branch === newClsBranch && c.room === newClsRoom && c.day === newClsDay && c.time === newClsTime);
    if (existingConflict) {
      alert(`Scheduling Conflict Detected!\n${newClsRoom} at ${newClsBranch} is already occupied by ${existingConflict.teacher} (${existingConflict.course}) at ${newClsTime}.`);
      return;
    }

    const createdClass: ClassScheduleItem = {
      id: `cls_${Date.now()}`,
      course: newClsCourse,
      level: newClsLevel,
      teacher: newClsTeacher,
      branch: newClsBranch,
      room: newClsRoom,
      mode: 'In-Person',
      day: newClsDay,
      time: newClsTime,
      capacity: newClsCap,
      enrolledCount: 0,
      status: 'Active'
    };

    setClasses([...classes, createdClass]);
    addNotification('New Class Scheduled', `${newClsCourse} (${newClsLevel}) room assigned at ${newClsBranch}`, 'system');
    logAudit('Created New Class Schedule', `${newClsCourse} at ${newClsBranch}`);
  };

  // Selected student record helper
  const activeDetailStudent = displayStudents.find(s => s.id === selectedStudentId) || displayStudents[0] || null;

  // Student ID printing modal toggle
  const [isPrintingIDCard, setIsPrintingIDCard] = useState(false);

  return (
    <div className="w-full bg-[#FCFBF8] min-h-screen text-[#2B2B2B] font-sans antialiased text-left">
      {/* HEADER BAR */}
      <header className="border-b border-[#E7DED1] bg-white relative z-20 px-6 py-4 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#FAF6EF] rounded-xl border border-[#E7DED1]">
            <Building className="text-[#E89B52]" size={20} />
          </div>
          <div>
            <h1 className="font-display font-black text-lg tracking-tight uppercase text-gray-800">Liora Begena Front Desk</h1>
            <p className="text-[10px] tracking-wider text-[#E89B52] font-bold uppercase">Registrar Operations • {staffAssignedBranch}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle variant="pill" />
          <div className="hidden md:flex flex-col text-right">
            <span className="font-bold text-xs">{currentUser?.fullName || 'Genet Assefa'}</span>
            <span className="text-[9px] text-[#E89B52] font-mono tracking-wider font-bold">SENIOR REGISTRATION OFFICER</span>
          </div>
          <div className="w-9 h-9 rounded-full border border-[#E7DED1] overflow-hidden bg-[#3B2818] flex items-center justify-center text-[#E89B52] font-bold text-xs">
            {currentUser?.avatar ? (
              <img src={currentUser.avatar} className="w-full h-full object-cover" alt="Avatar" referrerPolicy="no-referrer" />
            ) : (
              currentUser?.fullName?.charAt(0) || 'S'
            )}
          </div>
          <button onClick={logout} className="p-2 hover:bg-red-50 hover:text-red-600 rounded-lg text-gray-400 transition-colors" title="Log Out">
            <LogOut size={18} />
          </button>
        </div>
      </header>

      {/* CORE WORKSPACE GRID */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 p-6">
        {/* SIDEBAR NAVIGATION */}
        <aside className="lg:col-span-3 space-y-3">
          <div className="bg-white border border-[#E7DED1] rounded-2xl p-4 shadow-2xs space-y-1">
            <p className="text-[10px] tracking-widest text-[#E89B52] font-bold px-3 py-1 uppercase">Front Desk Desk</p>

            <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'dashboard' ? 'bg-[#E89B52] text-white' : 'text-gray-600 hover:bg-[#FAF6EF]'}`}>
              <div className="flex items-center gap-2.5"><Activity size={16} /><span>Today's Front Desk</span></div>
              <ChevronRight size={14} className="opacity-60" />
            </button>

            <button onClick={() => setActiveTab('new-student')} className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'new-student' ? 'bg-[#E89B52] text-white' : 'text-gray-600 hover:bg-[#FAF6EF]'}`}>
              <div className="flex items-center gap-2.5"><Plus size={16} /><span>Register New Student</span></div>
              <span className="text-[9px] bg-amber-100 text-[#E89B52] px-1.5 py-0.5 rounded font-mono font-bold">Step 1-13</span>
            </button>

            <button onClick={() => setActiveTab('applications')} className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'applications' ? 'bg-[#E89B52] text-white' : 'text-gray-600 hover:bg-[#FAF6EF]'}`}>
              <div className="flex items-center gap-2.5"><BookCheck size={16} /><span>Application Review</span></div>
              <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-mono font-bold">{applications.filter(a => a.status === 'Under Review' || a.status === 'Payment Verification').length}</span>
            </button>

            <button onClick={() => setActiveTab('payments')} className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'payments' ? 'bg-[#E89B52] text-white' : 'text-gray-600 hover:bg-[#FAF6EF]'}`}>
              <div className="flex items-center gap-2.5"><CreditCard size={16} /><span>Payment Verification</span></div>
              <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-mono font-bold">{payments.filter(p => p.status === 'Pending').length}</span>
            </button>

            <button onClick={() => setActiveTab('directory')} className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'directory' ? 'bg-[#E89B52] text-white' : 'text-gray-600 hover:bg-[#FAF6EF]'}`}>
              <div className="flex items-center gap-2.5"><Users size={16} /><span>Student Directory</span></div>
              <span className="text-[10px] bg-[#FAF6EF] text-gray-600 px-1.5 py-0.5 rounded font-mono font-bold">{displayStudents.length}</span>
            </button>

            <button onClick={() => setActiveTab('teacher-directory')} className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'teacher-directory' ? 'bg-[#E89B52] text-white' : 'text-gray-600 hover:bg-[#FAF6EF]'}`}>
              <div className="flex items-center gap-2.5"><UserCheck size={16} /><span>Teacher Directory</span></div>
              <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-mono font-bold">{teachers.length}</span>
            </button>

            <button onClick={() => setActiveTab('attendance')} className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'attendance' ? 'bg-[#E89B52] text-white' : 'text-gray-600 hover:bg-[#FAF6EF]'}`}>
              <div className="flex items-center gap-2.5"><CheckSquare size={16} /><span>Record Attendance</span></div>
              <ChevronRight size={14} className="opacity-60" />
            </button>

            <button onClick={() => setActiveTab('schedule')} className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'schedule' ? 'bg-[#E89B52] text-white' : 'text-gray-600 hover:bg-[#FAF6EF]'}`}>
              <div className="flex items-center gap-2.5"><Calendar size={16} /><span>Class Schedules</span></div>
              <ChevronRight size={14} className="opacity-60" />
            </button>

            <button onClick={() => setActiveTab('transfers')} className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'transfers' ? 'bg-[#E89B52] text-white' : 'text-gray-600 hover:bg-[#FAF6EF]'}`}>
              <div className="flex items-center gap-2.5"><ArrowRightLeft size={16} /><span>Branch Transfers</span></div>
              <ChevronRight size={14} className="opacity-60" />
            </button>

            <button onClick={() => setActiveTab('tasks')} className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'tasks' ? 'bg-[#E89B52] text-white' : 'text-gray-600 hover:bg-[#FAF6EF]'}`}>
              <div className="flex items-center gap-2.5"><Layers size={16} /><span>Tasks & Queue</span></div>
              <span className="text-[10px] bg-[#FAF6EF] text-gray-600 px-1.5 py-0.5 rounded font-mono font-bold">{tasks.filter(t => t.status === 'Pending').length}</span>
            </button>

            <button onClick={() => setActiveTab('audit')} className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'audit' ? 'bg-[#E89B52] text-white' : 'text-gray-600 hover:bg-[#FAF6EF]'}`}>
              <div className="flex items-center gap-2.5"><ShieldCheck size={16} /><span>Audit Log</span></div>
              <ChevronRight size={14} className="opacity-60" />
            </button>
          </div>

          {/* REGISTRATION FEE CONFIGURATION BOX */}
          <div className="bg-white border border-[#E7DED1] rounded-2xl p-4 shadow-2xs space-y-2">
            <span className="text-[10px] font-bold text-[#E89B52] uppercase font-mono">System Fee Settings</span>
            <div className="p-2 bg-[#FAF6EF] rounded-xl border border-[#E7DED1] flex justify-between items-center text-xs">
              <span className="text-gray-600 font-bold">Course Reg Fee:</span>
              <span className="font-mono font-black text-[#E89B52]">500 ETB</span>
            </div>
            <p className="text-[9px] text-gray-400">Configurable fee applied automatically to all course intakes.</p>
          </div>
        </aside>

        {/* MAIN DISPLAY AREA */}
        <main className="lg:col-span-9 space-y-6">

          {/* TAB 1: FRONT DESK OVERVIEW DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 animate-fadeIn">
              {/* HERO HEADER */}
              <div className="bg-white border border-[#E7DED1] p-6 rounded-2xl shadow-2xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <span className="text-[10px] font-mono tracking-widest text-[#E89B52] uppercase font-bold">TODAY'S OPERATIONS • {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  <h2 className="font-display font-black text-2xl uppercase tracking-tight">Front Desk Operations</h2>
                  <p className="text-xs text-gray-500 mt-0.5">Live student intake, payment clearing, and attendance dispatch.</p>
                </div>
                <Button variant="primary" size="sm" onClick={() => setActiveTab('new-student')} className="gap-2 shrink-0">
                  <Plus size={16} />
                  Register New Student
                </Button>
              </div>

              {/* STAT TILES (Requirements 1 & 3) */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white border border-[#E7DED1] p-4 rounded-2xl shadow-2xs">
                  <span className="block text-[10px] font-mono tracking-widest text-gray-400 uppercase font-bold">Active Students</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-black font-mono">{displayStudents.filter(s => s.status === 'Active' || s.paymentStatus === 'Verified').length}</span>
                    <span className="text-[10px] text-green-600 font-bold font-mono">Enrolled</span>
                  </div>
                </div>

                <div className="bg-white border border-[#E7DED1] p-4 rounded-2xl shadow-2xs">
                  <span className="block text-[10px] font-mono tracking-widest text-gray-400 uppercase font-bold">Pending Applications</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-black text-amber-600 font-mono">{applications.filter(a => a.status === 'Under Review' || a.status === 'Payment Verification').length}</span>
                    <span className="text-[10px] text-amber-600 font-bold">Action Needed</span>
                  </div>
                </div>

                <div className="bg-white border border-[#E7DED1] p-4 rounded-2xl shadow-2xs">
                  <span className="block text-[10px] font-mono tracking-widest text-gray-400 uppercase font-bold">Payments To Verify</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-black font-mono text-blue-600">{payments.filter(p => p.status === 'Pending').length}</span>
                    <span className="text-[10px] text-gray-400">CBE / Telebirr</span>
                  </div>
                </div>

                <div className="bg-white border border-[#E7DED1] p-4 rounded-2xl shadow-2xs">
                  <span className="block text-[10px] font-mono tracking-widest text-gray-400 uppercase font-bold">Today's Classes</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-black font-mono">{classes.length}</span>
                    <span className="text-[10px] text-green-600 font-bold">On Schedule</span>
                  </div>
                </div>
              </div>

              {/* PROMINENT QUICK ACTIONS ROW (Requirement 2) */}
              <div className="bg-white border border-[#E7DED1] p-4 rounded-2xl shadow-2xs space-y-3">
                <span className="block text-[10px] font-bold text-gray-400 uppercase font-mono tracking-wider">Registrar Quick Desk Actions</span>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                  <button onClick={() => setActiveTab('new-student')} className="flex items-center gap-2 p-2.5 bg-[#FAF6EF] border border-[#E7DED1] rounded-xl text-xs font-bold hover:bg-[#FAF6EF]/70 text-left">
                    <Plus size={14} className="text-[#E89B52]" />
                    <span>New Student</span>
                  </button>
                  <button onClick={() => setActiveTab('applications')} className="flex items-center gap-2 p-2.5 bg-[#FAF6EF] border border-[#E7DED1] rounded-xl text-xs font-bold hover:bg-[#FAF6EF]/70 text-left">
                    <BookCheck size={14} className="text-[#E89B52]" />
                    <span>Review Apps</span>
                  </button>
                  <button onClick={() => setActiveTab('payments')} className="flex items-center gap-2 p-2.5 bg-[#FAF6EF] border border-[#E7DED1] rounded-xl text-xs font-bold hover:bg-[#FAF6EF]/70 text-left">
                    <CreditCard size={14} className="text-[#E89B52]" />
                    <span>Verify Receipts</span>
                  </button>
                  <button onClick={() => setActiveTab('attendance')} className="flex items-center gap-2 p-2.5 bg-[#FAF6EF] border border-[#E7DED1] rounded-xl text-xs font-bold hover:bg-[#FAF6EF]/70 text-left">
                    <CheckSquare size={14} className="text-[#E89B52]" />
                    <span>Record Attendance</span>
                  </button>
                  <button onClick={() => setActiveTab('directory')} className="flex items-center gap-2 p-2.5 bg-[#FAF6EF] border border-[#E7DED1] rounded-xl text-xs font-bold hover:bg-[#FAF6EF]/70 text-left">
                    <Users size={14} className="text-[#E89B52]" />
                    <span>Manage Roster</span>
                  </button>
                </div>
              </div>

              {/* FRONT DESK EXPECTED STUDENT ROLL */}
              <div className="bg-white border border-[#E7DED1] p-6 rounded-2xl shadow-2xs space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-display font-black text-sm uppercase tracking-wider flex items-center gap-2">
                    <Activity size={18} className="text-[#E89B52]" />
                    Today's Expected Class Roll
                  </h3>
                  <button onClick={() => setActiveTab('attendance')} className="text-xs text-[#E89B52] font-bold hover:underline">Full Attendance Sheet →</button>
                </div>

                <div className="border border-gray-100 rounded-xl overflow-x-auto text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-[#FAF6EF] text-[10px] font-bold text-gray-400 uppercase">
                      <tr>
                        <th className="p-3">Student Name</th>
                        <th className="p-3">ID</th>
                        <th className="p-3">Course & Level</th>
                        <th className="p-3">Branch & Room</th>
                        <th className="p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayStudents.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="p-8 text-center text-gray-400">
                            <Users size={32} className="mx-auto mb-2 opacity-40 text-[#E89B52]" />
                            <p className="font-bold text-xs">No registered students found in the system yet.</p>
                            <p className="text-[10px] text-gray-400 mt-1">Students will appear here automatically when registered online or via staff intake.</p>
                          </td>
                        </tr>
                      ) : (
                        displayStudents.map(s => (
                          <tr key={s.id} className="border-b border-gray-100 hover:bg-[#FAF6EF]/20 text-gray-600">
                            <td className="p-3 font-bold text-gray-800">{s.fullName}</td>
                            <td className="p-3 font-mono text-[10px] font-bold text-[#E89B52]">{s.id}</td>
                            <td className="p-3">{s.course} ({s.level})</td>
                            <td className="p-3">{s.branch}</td>
                            <td className="p-3">
                              <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-green-50 text-green-700 border border-green-200">
                                EXPECTED TODAY
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MULTI-STEP NEW STUDENT REGISTRATION FORM (Steps 1-13) */}
          {activeTab === 'new-student' && (
            <div className="bg-white border border-[#E7DED1] p-6 rounded-2xl shadow-2xs space-y-6 animate-fadeIn">
              {/* STEP INDICATOR HEADER */}
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 border-b border-gray-100 pb-4">
                <div>
                  <span className="text-[10px] font-mono tracking-widest text-[#E89B52] uppercase font-bold">MANUAL ADMISSIONS INTAKE</span>
                  <h2 className="font-display font-black text-xl uppercase">Step {regStep} of 13: {
                    regStep === 1 ? 'Personal Information' :
                    regStep === 2 ? 'Contact Details' :
                    regStep === 3 ? 'Residential Address' :
                    regStep === 4 ? 'Education & Occupation' :
                    regStep === 5 ? 'Musical Background' :
                    regStep === 6 ? 'Course Selection' :
                    regStep === 7 ? 'Learning Mode' :
                    regStep === 8 ? 'Branch Selection' :
                    regStep === 9 ? 'Class Schedule' :
                    regStep === 10 ? 'Course Duration' :
                    regStep === 11 ? 'Payment & Fee Breakdown' :
                    regStep === 12 ? 'Review Application' : 'Confirmation'
                  }</h2>
                </div>

                {/* Progress bar */}
                <div className="w-full md:w-48 bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div className="h-full bg-[#E89B52] transition-all duration-300" style={{ width: `${(regStep / 13) * 100}%` }} />
                </div>
              </div>

              {/* CONFLICT WARNING BANNER */}
              {conflictWarning && (
                <div className="bg-amber-50 border border-amber-200 text-amber-900 p-3 rounded-xl text-xs flex items-center gap-2">
                  <AlertTriangle className="shrink-0 text-amber-600" size={16} />
                  <span>{conflictWarning}</span>
                </div>
              )}

              {/* FORM STEP CONTENT */}
              <div className="space-y-4 text-xs">
                {regStep === 1 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">First Name *</label>
                      <Input value={regFormData.firstName} onChange={(e) => setRegFormData({ ...regFormData, firstName: e.target.value })} placeholder="e.g. Solomon" />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Last Name *</label>
                      <Input value={regFormData.lastName} onChange={(e) => setRegFormData({ ...regFormData, lastName: e.target.value })} placeholder="e.g. Kassaye" />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Gender</label>
                      <select value={regFormData.gender} onChange={(e) => setRegFormData({ ...regFormData, gender: e.target.value })} className="w-full p-2.5 border border-[#E7DED1] rounded-xl bg-white">
                        <option>Male</option>
                        <option>Female</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Date of Birth</label>
                      <Input type="date" value={regFormData.dob} onChange={(e) => setRegFormData({ ...regFormData, dob: e.target.value })} />
                    </div>
                  </div>
                )}

                {regStep === 2 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Primary Phone *</label>
                      <Input value={regFormData.phone} onChange={(e) => setRegFormData({ ...regFormData, phone: e.target.value })} placeholder="+251911..." />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Email Address</label>
                      <Input value={regFormData.email} onChange={(e) => setRegFormData({ ...regFormData, email: e.target.value })} placeholder="student@example.com" />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Emergency Contact Name</label>
                      <Input value={regFormData.emergencyName} onChange={(e) => setRegFormData({ ...regFormData, emergencyName: e.target.value })} placeholder="Guardian / Relative" />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Emergency Contact Phone</label>
                      <Input value={regFormData.emergencyPhone} onChange={(e) => setRegFormData({ ...regFormData, emergencyPhone: e.target.value })} placeholder="+2519..." />
                    </div>
                  </div>
                )}

                {regStep === 3 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">City</label>
                      <Input value={regFormData.city} onChange={(e) => setRegFormData({ ...regFormData, city: e.target.value })} />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Sub-city</label>
                      <Input value={regFormData.subcity} onChange={(e) => setRegFormData({ ...regFormData, subcity: e.target.value })} />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block font-bold text-gray-700 mb-1">Detailed Street Address / Kebele</label>
                      <Input value={regFormData.address} onChange={(e) => setRegFormData({ ...regFormData, address: e.target.value })} placeholder="House number, landmark..." />
                    </div>
                  </div>
                )}

                {regStep === 4 && (
                  <div className="space-y-4">
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Occupation Status</label>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" checked={regFormData.occupationType === 'student'} onChange={() => setRegFormData({ ...regFormData, occupationType: 'student' })} />
                          <span>Student</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" checked={regFormData.occupationType === 'employee'} onChange={() => setRegFormData({ ...regFormData, occupationType: 'employee' })} />
                          <span>Employee / Working Professional</span>
                        </label>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-bold text-gray-700 mb-1">{regFormData.occupationType === 'student' ? 'School / University Name' : 'Company / Organization'}</label>
                        <Input value={regFormData.schoolOrOrg} onChange={(e) => setRegFormData({ ...regFormData, schoolOrOrg: e.target.value })} />
                      </div>
                      <div>
                        <label className="block font-bold text-gray-700 mb-1">{regFormData.occupationType === 'student' ? 'Grade / Year' : 'Job Title'}</label>
                        <Input value={regFormData.gradeOrTitle} onChange={(e) => setRegFormData({ ...regFormData, gradeOrTitle: e.target.value })} />
                      </div>
                    </div>
                  </div>
                )}

                {regStep === 5 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Previous Begena / Musical Experience</label>
                      <Input value={regFormData.begenaExp} onChange={(e) => setRegFormData({ ...regFormData, begenaExp: e.target.value })} placeholder="e.g. Beginner, self-taught..." />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Church / Spiritual Affiliation</label>
                      <Input value={regFormData.churchAffiliation} onChange={(e) => setRegFormData({ ...regFormData, churchAffiliation: e.target.value })} placeholder="Local parish name..." />
                    </div>
                  </div>
                )}

                {regStep === 6 && (
                  <div className="space-y-3">
                    <label className="block font-bold text-gray-700">Select Instrument Course *</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {['Begena', 'Krar', 'Masenqo', 'Washint', 'Vocal', 'Kebero'].map(course => (
                        <div key={course} onClick={() => setRegFormData({ ...regFormData, selectedCourseName: course })} className={`p-4 rounded-xl border cursor-pointer font-bold transition-all ${regFormData.selectedCourseName === course ? 'border-[#E89B52] bg-[#FAF6EF]' : 'border-[#E7DED1]'}`}>
                          <span className="block text-sm">{course}</span>
                          <span className="text-[10px] text-gray-400 font-normal">Sacred Instrument</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {regStep === 7 && (
                  <div className="space-y-3">
                    <label className="block font-bold text-gray-700">Select Learning Mode</label>
                    <div className="grid grid-cols-2 gap-4">
                      <div onClick={() => setRegFormData({ ...regFormData, learningMode: 'In-Person', selectedBranch: 'Hawassa Main Branch' })} className={`p-4 rounded-xl border cursor-pointer font-bold ${regFormData.learningMode === 'In-Person' ? 'border-[#E89B52] bg-[#FAF6EF]' : 'border-[#E7DED1]'}`}>
                        <span className="block text-sm">Physical / On-Campus</span>
                        <span className="text-[10px] text-gray-400">Hawassa Center Point Tower</span>
                      </div>
                      <div onClick={() => setRegFormData({ ...regFormData, learningMode: 'Online', selectedBranch: 'Virtual Gate' })} className={`p-4 rounded-xl border cursor-pointer font-bold ${regFormData.learningMode === 'Online' ? 'border-[#E89B52] bg-[#FAF6EF]' : 'border-[#E7DED1]'}`}>
                        <span className="block text-sm">Online / Virtual Gate</span>
                        <span className="text-[10px] text-gray-400">Google Meet bridge</span>
                      </div>
                    </div>
                  </div>
                )}

                {regStep === 8 && (
                  <div className="space-y-3">
                    <label className="block font-bold text-gray-700">Select Branch</label>
                    <div className="grid grid-cols-1 max-w-sm mx-auto gap-3">
                      {['Hawassa Main Branch'].map(b => (
                        <div key={b} onClick={() => setRegFormData({ ...regFormData, selectedBranch: b as any })} className={`p-4 rounded-xl border cursor-pointer font-bold text-center ${regFormData.selectedBranch === b ? 'border-[#E89B52] bg-[#FAF6EF]' : 'border-[#E7DED1]'}`}>
                          <Building className="mx-auto mb-1 text-[#E89B52]" size={18} />
                          <span className="block">{b}</span>
                          <span className="block text-[10px] text-gray-500 font-normal">Center Point Tower, 1st Floor</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {regStep === 9 && (
                  <div className="space-y-3">
                    <label className="block font-bold text-gray-700">Class Schedule Slot</label>
                    <div className="space-y-2">
                      {classes.map(c => (
                        <div key={c.id} onClick={() => setRegFormData({ ...regFormData, scheduleDayTime: `${c.day} - ${c.time}` })} className={`p-3 rounded-xl border cursor-pointer flex justify-between items-center ${regFormData.scheduleDayTime.includes(c.time) ? 'border-[#E89B52] bg-[#FAF6EF]' : 'border-[#E7DED1]'}`}>
                          <div>
                            <span className="font-bold block">{c.day} ({c.time})</span>
                            <span className="text-[10px] text-gray-400">{c.teacher} • {c.room}</span>
                          </div>
                          <span className="text-[10px] font-mono font-bold text-[#E89B52]">{c.enrolledCount} / {c.capacity} Seats</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {regStep === 10 && (
                  <div className="grid grid-cols-3 gap-3">
                    {[3, 6, 9].map(m => (
                      <div key={m} onClick={() => setRegFormData({ ...regFormData, durationMonths: m })} className={`p-4 rounded-xl border cursor-pointer text-center font-bold ${regFormData.durationMonths === m ? 'border-[#E89B52] bg-[#FAF6EF]' : 'border-[#E7DED1]'}`}>
                        <span className="text-lg block font-mono">{m} Months</span>
                        <span className="text-[10px] text-gray-400">Regular Program</span>
                      </div>
                    ))}
                  </div>
                )}

                {regStep === 11 && (
                  <div className="space-y-4">
                    <div className="bg-[#FAF6EF] p-4 rounded-xl border border-[#E7DED1] space-y-2">
                      <div className="flex justify-between font-bold">
                        <span>Course Registration Fee (Standard):</span>
                        <span className="font-mono">{regFormData.registrationFeeETB} ETB</span>
                      </div>
                      <div className="flex justify-between font-bold">
                        <span>Tuition Fee ({regFormData.durationMonths} Months):</span>
                        <span className="font-mono">{regFormData.courseFeeETB} ETB</span>
                      </div>
                      <div className="border-t border-[#E7DED1] pt-2 flex justify-between font-black text-sm text-[#E89B52]">
                        <span>Total Fee Payable:</span>
                        <span className="font-mono">{regFormData.registrationFeeETB + regFormData.courseFeeETB} ETB</span>
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Payment Method</label>
                      <select value={regFormData.paymentMethod} onChange={(e) => setRegFormData({ ...regFormData, paymentMethod: e.target.value as any })} className="w-full p-2.5 border border-[#E7DED1] rounded-xl bg-white font-bold">
                        <option value="Cash">Cash at Front Desk (Instant Activation)</option>
                        <option value="CBE">CBE Bank Transfer (Pending Verification)</option>
                        <option value="Telebirr">Telebirr Mobile Payment</option>
                      </select>
                    </div>
                  </div>
                )}

                {regStep === 12 && (
                  <div className="bg-[#FAF6EF] p-4 rounded-xl border border-[#E7DED1] space-y-2">
                    <h4 className="font-bold text-sm text-gray-800 uppercase">Summary Review</h4>
                    <p><strong>Student:</strong> {regFormData.firstName} {regFormData.lastName} ({regFormData.phone})</p>
                    <p><strong>Course:</strong> {regFormData.selectedCourseName} ({regFormData.selectedLevelName}) • {regFormData.selectedBranch}</p>
                    <p><strong>Schedule:</strong> {regFormData.scheduleDayTime}</p>
                    <p><strong>Fee Paid:</strong> {regFormData.registrationFeeETB + regFormData.courseFeeETB} ETB ({regFormData.paymentMethod})</p>
                  </div>
                )}

                {regStep === 13 && (
                  <div className="text-center py-6 space-y-3">
                    <CheckCircle className="mx-auto text-green-600" size={48} />
                    <h3 className="font-display font-black text-xl">Ready for Intake Dispatch!</h3>
                    <p className="text-gray-500">Click submit below to save student record and generate Student ID card.</p>
                  </div>
                )}
              </div>

              {/* NAVIGATION BUTTONS */}
              <div className="flex justify-between items-center border-t border-gray-100 pt-4">
                <Button variant="secondary" onClick={handlePrevStep} disabled={regStep === 1}>Back</Button>
                {regStep < 13 ? (
                  <Button variant="primary" onClick={handleNextStep}>Next Step →</Button>
                ) : (
                  <Button variant="primary" onClick={handleFinalSubmitRegistration}>Complete & Issue ID</Button>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: APPLICATION REVIEW TABLE */}
          {activeTab === 'applications' && (
            <div className="bg-white border border-[#E7DED1] p-6 rounded-2xl shadow-2xs space-y-4 animate-fadeIn">
              <div className="flex justify-between items-center">
                <h3 className="font-display font-black text-sm uppercase tracking-wider">Submitted Student Intake Applications</h3>
                <span className="text-xs font-mono font-bold text-[#E89B52]">{applications.length} Records</span>
              </div>

              <div className="border border-gray-100 rounded-xl overflow-x-auto text-xs">
                <table className="w-full text-left">
                  <thead className="bg-[#FAF6EF] text-[10px] font-bold text-gray-400 uppercase">
                    <tr>
                      <th className="p-3.5">App ID</th>
                      <th className="p-3.5">Applicant</th>
                      <th className="p-3.5">Course / Level</th>
                      <th className="p-3.5">Branch</th>
                      <th className="p-3.5">Payment Method</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-gray-400">
                          <BookCheck size={32} className="mx-auto mb-2 opacity-40 text-[#E89B52]" />
                          <p className="font-bold text-xs">No student intake applications submitted yet.</p>
                          <p className="text-[10px] text-gray-400 mt-1">Applications submitted by prospective students will appear here for review.</p>
                        </td>
                      </tr>
                    ) : (
                      applications.map(app => (
                        <tr key={app.applicationId} className="border-b border-gray-100 text-gray-600 hover:bg-[#FAF6EF]/20">
                          <td className="p-3.5 font-mono font-bold text-[#E89B52]">{app.applicationId}</td>
                          <td className="p-3.5 font-bold text-gray-800">{app.firstName} {app.lastName}</td>
                          <td className="p-3.5">{app.selectedCourseName} ({app.selectedLevelName})</td>
                          <td className="p-3.5">{app.selectedBranch}</td>
                          <td className="p-3.5 font-mono">{app.paymentMethod} ({app.totalETB} ETB)</td>
                          <td className="p-3.5">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${
                              app.status === 'Approved' ? 'bg-green-50 border-green-200 text-green-700' :
                              app.status === 'Correction Required' ? 'bg-amber-50 border-amber-200 text-amber-800' :
                              'bg-blue-50 border-blue-200 text-blue-700'
                            }`}>{app.status.toUpperCase()}</span>
                          </td>
                          <td className="p-3.5 text-right flex gap-1 justify-end">
                            {app.status !== 'Approved' && (
                              <>
                                <button onClick={() => handleApproveApplication(app)} className="px-2 py-1 bg-green-600 text-white rounded text-[10px] font-bold hover:bg-green-700">
                                  Approve
                                </button>
                                <button onClick={() => handleRequestCorrection(app.applicationId)} className="px-2 py-1 bg-amber-100 text-amber-800 rounded text-[10px] font-bold hover:bg-amber-200">
                                  Fix
                                </button>
                              </>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: PAYMENT VERIFICATION */}
          {activeTab === 'payments' && (
            <div className="bg-white border border-[#E7DED1] p-6 rounded-2xl shadow-2xs space-y-4 animate-fadeIn">
              <h3 className="font-display font-black text-sm uppercase tracking-wider">Bank & Telebirr Payment Verification Queue</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {payments.length === 0 ? (
                  <div className="col-span-2 p-8 text-center text-gray-400 bg-[#FAF6EF]/20 border border-[#E7DED1] rounded-2xl">
                    <CreditCard size={32} className="mx-auto mb-2 opacity-40 text-[#E89B52]" />
                    <p className="font-bold text-xs">No pending or recorded bank receipts yet.</p>
                    <p className="text-[10px] text-gray-400 mt-1">Payment receipts submitted by students or front desk staff will appear here for verification.</p>
                  </div>
                ) : (
                  payments.map(p => (
                    <div key={p.id} className="p-4 border border-[#E7DED1] rounded-2xl bg-[#FAF6EF]/20 space-y-3 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-gray-800">{p.studentName}</span>
                        <span className="font-mono text-xs font-black text-[#E89B52]">{p.amount} ETB</span>
                      </div>
                      <div className="flex gap-3 items-center">
                        {p.receiptImage ? (
                          <img src={p.receiptImage} className="w-16 h-16 rounded-lg object-cover border" alt="Receipt" />
                        ) : (
                          <div className="w-16 h-16 rounded-lg bg-stone-100 border flex items-center justify-center text-stone-400 text-[10px] italic">No Receipt</div>
                        )}
                        <div>
                          <p><strong>Method:</strong> {p.method}</p>
                          <p><strong>Course:</strong> {p.course}</p>
                          <p><strong>Date:</strong> {p.date}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {p.status === 'Pending' ? (
                          <Button variant="primary" size="sm" onClick={() => handleVerifyPayment(p.id)} className="w-full">Verify Receipt</Button>
                        ) : (
                          <span className="text-[10px] font-bold text-green-600">Verified by {p.verifiedBy || 'Staff'}</span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 5: STUDENT DIRECTORY & STUDENT ID GENERATOR */}
          {activeTab === 'directory' && (
            <div className="bg-white border border-[#E7DED1] p-6 rounded-2xl shadow-2xs space-y-4 animate-fadeIn">
              <div className="flex justify-between items-center">
                <h3 className="font-display font-black text-sm uppercase tracking-wider">Student Master Roster</h3>
                <Input value={globalSearch} onChange={(e) => setGlobalSearch(e.target.value)} placeholder="Search student name or ID..." className="w-48 text-xs" />
              </div>

              <div className="border border-gray-100 rounded-xl overflow-x-auto text-xs">
                <table className="w-full text-left">
                  <thead className="bg-[#FAF6EF] text-[10px] font-bold text-gray-400 uppercase">
                    <tr>
                      <th className="p-3">Student ID</th>
                      <th className="p-3">Full Name</th>
                      <th className="p-3">Course / Level</th>
                      <th className="p-3">Branch</th>
                      <th className="p-3">Payment Status</th>
                      <th className="p-3">Attendance</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayStudents.filter(s => s.fullName.toLowerCase().includes(globalSearch.toLowerCase()) || (s.studentRegistrationId || s.id).toLowerCase().includes(globalSearch.toLowerCase())).length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-gray-400">
                          <Users size={32} className="mx-auto mb-2 opacity-40 text-[#E89B52]" />
                          <p className="font-bold text-xs">No students found matching your criteria.</p>
                          <p className="text-[10px] text-gray-400 mt-1">Register a new student via the Manual Admissions Intake tab or wait for self-service online applications.</p>
                        </td>
                      </tr>
                    ) : (
                      displayStudents.filter(s => s.fullName.toLowerCase().includes(globalSearch.toLowerCase()) || (s.studentRegistrationId || s.id).toLowerCase().includes(globalSearch.toLowerCase())).map(st => {
                        const isVerified = st.paymentStatus === 'Verified' || st.paymentStatus === 'Approved' || st.tuitionPaid || st.status === 'Active';
                        return (
                        <tr key={st.id} className="border-b border-gray-100 text-gray-600 hover:bg-[#FAF6EF]/20">
                          <td className="p-3 font-mono font-bold text-[#E89B52]">{st.studentRegistrationId || st.id}</td>
                          <td className="p-3 font-bold text-gray-800">{st.fullName}</td>
                          <td className="p-3">{st.course} ({st.level})</td>
                          <td className="p-3">{st.branch}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center gap-1 border ${
                              isVerified
                                ? 'bg-green-50 border-green-200 text-green-700'
                                : st.paymentStatus === 'Rejected'
                                ? 'bg-red-50 border-red-200 text-red-700'
                                : 'bg-amber-50 border-amber-200 text-amber-800'
                            }`}>
                              {isVerified ? (
                                <>
                                  <CheckCircle size={10} className="text-green-600" />
                                  Verified
                                </>
                              ) : st.paymentStatus === 'Rejected' ? (
                                <>
                                  <AlertTriangle size={10} className="text-red-600" />
                                  Rejected
                                </>
                              ) : (
                                <>
                                  <Clock size={10} className="text-amber-600" />
                                  Under Review
                                </>
                              )}
                            </span>
                          </td>
                          <td className="p-3 font-mono font-bold text-green-600">
                            <button
                              onClick={() => setAttendanceModalStudent(st)}
                              className="px-2 py-1 bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 rounded font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-colors"
                              title="See full attendance record"
                            >
                              <CheckSquare size={12} className="text-green-600" />
                              {st.attendancePercent !== undefined ? `${st.attendancePercent}%` : 'View Log'}
                            </button>
                          </td>
                        <td className="p-3 text-right flex gap-1 justify-end">
                          <button
                            onClick={() => setAttendanceModalStudent(st)}
                            className="px-2 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 rounded font-bold text-[10px] flex items-center gap-1 cursor-pointer transition-colors"
                            title="See full attendance record"
                          >
                            <Calendar size={11} />
                            Attendance
                          </button>
                          <button onClick={() => { setSelectedStudentId(st.id); setIsPrintingIDCard(true); }} className="px-2 py-1 bg-amber-50 text-[#E89B52] border border-[#E7DED1] rounded font-bold text-[10px]">
                            Print ID
                          </button>
                          <button onClick={() => { setSelectedStudentId(st.id); setActiveTab('student-detail'); }} className="px-2 py-1 bg-[#FAF6EF] text-gray-700 border border-[#E7DED1] rounded font-bold text-[10px]">
                            Profile
                          </button>
                          <button
                            onClick={() => setStudentToDelete(st)}
                            className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded font-bold text-[10px] transition-colors cursor-pointer"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                    })
                  )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: TEACHER DIRECTORY & STUDENT ASSIGNMENT CENTER */}
          {activeTab === 'teacher-directory' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Header */}
              <div className="bg-white border border-[#E7DED1] p-6 rounded-2xl shadow-2xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <span className="text-[10px] font-mono tracking-widest text-[#E89B52] uppercase font-bold">FACULTY & ACADEMIC INTEGRATION</span>
                  <h2 className="font-display font-black text-2xl uppercase tracking-tight flex items-center gap-2">
                    <UserCheck size={24} className="text-[#E89B52]" />
                    Teacher Directory & Student Assignments
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Manage faculty members, track student assignments, and assign or reassign students to specialized teachers.
                  </p>
                </div>
                <button
                  onClick={() => {
                    const result = autoAssignTeachersForUnassignedEnrollments();
                    setAutoAssignSummaryModal(result);

                    const pendingItems = result.details
                      .filter(d => d.status === 'Pending')
                      .map(d => `${d.studentName}: ${d.reason}`);
                    const pendingSummary = pendingItems.length > 0 ? ` Pending: ${pendingItems.join('; ')}` : '';

                    addNotification(
                      'Auto-Assignment Complete',
                      `${result.summaryMessage}${pendingSummary}`,
                      'system'
                    );
                  }}
                  className="bg-[#E89B52] hover:bg-[#d88a42] text-white text-xs font-bold py-2.5 px-4 rounded-xl flex items-center gap-2 shadow-xs transition-all cursor-pointer shrink-0"
                >
                  <RefreshCw size={14} />
                  <span>Auto-Assign Unassigned Students</span>
                </button>
              </div>

              {/* Search & Filter bar */}
              <div className="bg-white border border-[#E7DED1] p-4 rounded-2xl shadow-2xs flex flex-col sm:flex-row gap-3 justify-between items-center">
                <div className="relative w-full sm:w-72">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search teacher name or email..."
                    value={teacherSearch}
                    onChange={(e) => setTeacherSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-[#FAF6EF] border border-[#E7DED1] rounded-xl text-xs focus:outline-none focus:border-[#E89B52]"
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <span className="text-xs font-bold text-gray-500 whitespace-nowrap">Specialization:</span>
                  <select
                    value={teacherSpecFilter}
                    onChange={(e) => setTeacherSpecFilter(e.target.value)}
                    className="py-2 px-3 bg-[#FAF6EF] border border-[#E7DED1] rounded-xl text-xs font-bold focus:outline-none focus:border-[#E89B52] text-gray-700"
                  >
                    <option value="All">All Instruments</option>
                    <option value="Begena">Begena</option>
                    <option value="Kirar">Kirar / Krar</option>
                    <option value="Masenqo">Masenqo</option>
                    <option value="Washint">Washint</option>
                    <option value="Kebero">Kebero</option>
                    <option value="Vocal">Vocal / Zema</option>
                  </select>
                </div>
              </div>

              {/* Teachers Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {teachers
                  .filter(t => {
                    const matchSearch = !teacherSearch ||
                      t.fullName.toLowerCase().includes(teacherSearch.toLowerCase()) ||
                      t.email.toLowerCase().includes(teacherSearch.toLowerCase());
                    const matchSpec = teacherSpecFilter === 'All' ||
                      t.specializations.some(s => s.toLowerCase().includes(teacherSpecFilter.toLowerCase()));
                    return matchSearch && matchSpec;
                  })
                  .map(teacher => {
                    // Compute assigned enrollments for this teacher
                    const teacherAssignedEnrollments = enrollments.filter(e =>
                      (e.assignedTeacherId && e.assignedTeacherId.toLowerCase() === teacher.id.toLowerCase()) ||
                      (e.assignedTeacherEmail && e.assignedTeacherEmail.toLowerCase() === teacher.email.toLowerCase()) ||
                      (e.assignedTeacherName && e.assignedTeacherName.toLowerCase() === teacher.fullName.toLowerCase())
                    );

                    const currentCount = teacherAssignedEnrollments.length;
                    const maxCapacity = teacher.capacity || 35;
                    const loadPercentage = Math.min(100, Math.round((currentCount / maxCapacity) * 100));

                    return (
                      <div key={teacher.id} className="bg-white border border-[#E7DED1] rounded-2xl p-5 shadow-2xs space-y-4 hover:shadow-md transition-all relative overflow-hidden min-w-0">
                        {/* Top Header Card */}
                        <div className="flex items-start gap-4">
                          {teacher.photo ? (
                            <img
                              src={teacher.photo}
                              alt={teacher.fullName}
                              className="w-16 h-16 rounded-2xl object-cover border-2 border-[#E89B52] shrink-0 shadow-xs"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <div className="w-16 h-16 rounded-2xl bg-[#1A1A1A] border-2 border-[#E89B52] flex items-center justify-center text-[#E89B52] font-bold text-xl shrink-0 shadow-xs">
                              {teacher.fullName?.charAt(0) || 'T'}
                            </div>
                          )}
                          <div className="flex-1 min-w-0 space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-mono font-black text-[#E89B52] uppercase">{teacher.id}</span>
                              <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${teacher.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'}`}>
                                {teacher.status || 'Active'}
                              </span>
                            </div>
                            <h3 className="font-display font-black text-base text-[#2B2B2B] truncate">{teacher.fullName}</h3>
                            <p className="text-xs text-gray-500 font-mono truncate">{teacher.email} • {teacher.phone}</p>
                            {teacher.telegramUsername && (
                              <p className="text-[11px] text-sky-700 font-mono font-bold flex items-center gap-1">
                                <Send size={11} /> @{teacher.telegramUsername.replace(/^@/, '')}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Specializations & Branches Tags */}
                        <div className="space-y-2 pt-2 border-t border-gray-100 text-xs">
                          <div>
                            <span className="text-[10px] font-bold text-gray-400 uppercase font-mono block mb-1">Specializations:</span>
                            <div className="flex flex-wrap gap-1.5">
                              {teacher.specializations.map((spec, i) => (
                                <span key={i} className="text-[10px] font-bold bg-[#FAF6EF] text-[#2B2B2B] border border-[#E7DED1] px-2 py-0.5 rounded-md">
                                  {spec}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-[11px] text-gray-600">
                            <span>Branches: <strong className="text-gray-800">{teacher.branches?.join(', ') || 'All Branches'}</strong></span>
                            <span>Modes: <strong className="text-gray-800">{teacher.supportsInPerson ? 'In-Person' : ''}{teacher.supportsInPerson && teacher.supportsOnline ? ' & ' : ''}{teacher.supportsOnline ? 'Online' : ''}</strong></span>
                          </div>
                        </div>

                        {/* Capacity Workload Bar */}
                        <div className="bg-[#FAF6EF] p-3 rounded-xl border border-[#E7DED1] space-y-1.5">
                          <div className="flex justify-between items-center text-xs font-bold">
                            <span className="text-gray-600">Assigned Workload:</span>
                            <span className="font-mono text-[#E89B52]">{currentCount} / {maxCapacity} Students</span>
                          </div>
                          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full transition-all duration-300 ${loadPercentage > 90 ? 'bg-red-500' : loadPercentage > 70 ? 'bg-amber-500' : 'bg-[#E89B52]'}`}
                              style={{ width: `${loadPercentage}%` }}
                            />
                          </div>
                        </div>

                        {/* Assigned Students List */}
                        <div className="space-y-2 pt-2 border-t border-gray-100">
                          <span className="text-[10px] font-bold text-gray-400 uppercase font-mono tracking-wider block">
                            Assigned Students ({currentCount}):
                          </span>

                          {teacherAssignedEnrollments.length === 0 ? (
                            <p className="text-xs text-gray-400 italic bg-gray-50 p-2.5 rounded-xl border border-dashed border-gray-200 text-center">
                              No students currently assigned to this teacher.
                            </p>
                          ) : (
                            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                              {teacherAssignedEnrollments.map(enr => (
                                <div key={enr.id} className="p-2.5 bg-[#FAF6EF]/60 border border-[#E7DED1] rounded-xl flex items-center justify-between text-xs gap-2">
                                  <div className="min-w-0">
                                    <p className="font-bold text-gray-800 truncate">{enr.studentName}</p>
                                    <p className="text-[10px] text-gray-500 truncate">{enr.courseName} • {enr.branch || 'Hawassa Campus'}</p>
                                  </div>
                                  <button
                                    onClick={() => {
                                      setReassigningEnrId(enr.id);
                                      setSelectedTeacherIdForReassign('');
                                    }}
                                    className="text-[10px] font-bold text-[#E89B52] bg-white border border-[#E89B52]/30 px-2 py-1 rounded-lg hover:bg-[#E89B52] hover:text-white transition-all cursor-pointer shrink-0"
                                  >
                                    Reassign
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Assign New Student to This Teacher Box */}
                        <div className="pt-2 border-t border-gray-100 min-w-0">
                          <label className="block text-[10px] font-bold text-gray-500 uppercase font-mono mb-1 truncate">
                            Assign Student to {teacher.fullName}:
                          </label>
                          <div className="flex items-center gap-2 w-full min-w-0">
                            <select
                              id={`assign-select-${teacher.id}`}
                              value={selectedAssignableStudentByTeacher[teacher.id] || ''}
                              onChange={(e) => setSelectedAssignableStudentByTeacher(prev => ({
                                ...prev,
                                [teacher.id]: e.target.value
                              }))}
                              className="flex-1 min-w-0 w-0 py-1.5 px-2 bg-[#FAF6EF] border border-[#E7DED1] rounded-xl text-xs font-medium focus:outline-none focus:border-[#E89B52] truncate cursor-pointer"
                            >
                              <option value="">Select unassigned or active student...</option>
                              {allAssignableOptions.map(e => (
                                <option key={e.id} value={e.id}>
                                  {e.studentName} ({e.courseName} - {e.assignedTeacherName ? `Current: ${e.assignedTeacherName}` : 'Unassigned'})
                                </option>
                              ))}
                            </select>
                            <button
                              onClick={() => {
                                const selectedValue = selectedAssignableStudentByTeacher[teacher.id];
                                if (!selectedValue) {
                                  alert('Please select a student enrollment first.');
                                  return;
                                }
                                const res = assignTeacherToEnrollment(selectedValue, teacher.id, currentUser?.fullName || 'Registration Staff');
                                if (res.success) {
                                  addNotification('Teacher Assigned', res.message, 'system');
                                  setSelectedAssignableStudentByTeacher(prev => ({
                                    ...prev,
                                    [teacher.id]: ''
                                  }));
                                } else {
                                  alert(res.message);
                                }
                              }}
                              className="shrink-0 whitespace-nowrap bg-[#2B2B2B] hover:bg-black text-white text-xs font-bold px-3.5 py-1.5 rounded-xl transition-all cursor-pointer shadow-xs disabled:opacity-40 disabled:cursor-not-allowed"
                              disabled={!selectedAssignableStudentByTeacher[teacher.id]}
                            >
                              Assign
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>

              {/* REASSIGNMENT MODAL */}
              {reassigningEnrId && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
                  <div className="bg-white border border-[#E7DED1] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-scaleUp">
                    <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                      <h3 className="font-display font-black text-base text-[#2B2B2B] uppercase flex items-center gap-2">
                        <ArrowRightLeft size={18} className="text-[#E89B52]" />
                        Reassign Student Teacher
                      </h3>
                      <button onClick={() => setReassigningEnrId(null)} className="text-gray-400 hover:text-gray-600">
                        <X size={18} />
                      </button>
                    </div>

                    {(() => {
                      const enr = enrollments.find(e => e.id === reassigningEnrId);
                      if (!enr) return <p className="text-xs text-red-500">Enrollment not found.</p>;

                      return (
                        <div className="space-y-4 text-xs">
                          <div className="bg-[#FAF6EF] p-3.5 rounded-xl border border-[#E7DED1] space-y-1">
                            <p className="font-bold text-gray-800 text-sm">{enr.studentName}</p>
                            <p className="text-gray-600">Course: <strong className="text-gray-900">{enr.courseName}</strong> ({enr.instrument})</p>
                            <p className="text-gray-600">Current Teacher: <strong className="text-[#E89B52]">{enr.assignedTeacherName || 'None'}</strong></p>
                          </div>

                          <div>
                            <label className="block font-bold text-gray-700 mb-1">Select New Specialized Teacher:</label>
                            <select
                              value={selectedTeacherIdForReassign}
                              onChange={(e) => setSelectedTeacherIdForReassign(e.target.value)}
                              className="w-full p-2.5 bg-[#FAF6EF] border border-[#E7DED1] rounded-xl text-xs font-bold text-gray-800 focus:outline-none focus:border-[#E89B52]"
                            >
                              <option value="">-- Choose New Teacher --</option>
                              {teachers.map(t => (
                                <option key={t.id} value={t.id}>
                                  {t.fullName} ({t.specializations.join(', ')})
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="flex justify-end gap-2 pt-2">
                            <button
                              onClick={() => setReassigningEnrId(null)}
                              className="px-4 py-2 border border-[#E7DED1] rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => {
                                if (!selectedTeacherIdForReassign) {
                                  alert('Please select a target teacher.');
                                  return;
                                }
                                const res = assignTeacherToEnrollment(reassigningEnrId, selectedTeacherIdForReassign, currentUser?.fullName || 'Registration Staff');
                                if (res.success) {
                                  addNotification('Teacher Reassigned', res.message, 'system');
                                  setReassigningEnrId(null);
                                } else {
                                  alert(res.message);
                                }
                              }}
                              className="px-4 py-2 bg-[#E89B52] hover:bg-[#d88a42] text-white rounded-xl text-xs font-bold shadow-xs transition-all"
                            >
                              Confirm Reassignment
                            </button>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 6: STUDENT DETAIL VIEW */}
          {activeTab === 'student-detail' && activeDetailStudent && (
            <div className="bg-white border border-[#E7DED1] p-6 rounded-2xl shadow-2xs space-y-6 animate-fadeIn text-xs">
              {/* Navigation Top Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-4">
                <button
                  onClick={() => setActiveTab('directory')}
                  className="flex items-center gap-1.5 text-xs text-[#E89B52] font-bold hover:underline cursor-pointer"
                >
                  <span>←</span>
                  <span>Back to Student Directory</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsPrintingIDCard(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-xs shadow-2xs transition-all cursor-pointer"
                  >
                    <Printer size={14} />
                    <span>Print Official ID Card</span>
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF6EF] hover:bg-[#E7DED1] text-gray-700 border border-[#E7DED1] rounded-xl font-bold text-xs transition-all cursor-pointer"
                  >
                    <FileText size={14} />
                    <span>Print Registration Record</span>
                  </button>
                </div>
              </div>

              {/* Student Profile Overview Banner */}
              <div className="bg-gradient-to-r from-[#FAF6EF] via-amber-50/50 to-[#FAF6EF] p-5 rounded-2xl border border-[#E7DED1] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  {activeDetailStudent.photo ? (
                    <img
                      src={activeDetailStudent.photo}
                      className="w-20 h-20 rounded-2xl object-cover border-2 border-white shadow-md shrink-0"
                      alt={activeDetailStudent.fullName}
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-2xl bg-[#3B2818] text-[#E89B52] font-bold text-2xl flex items-center justify-center border-2 border-white shadow-md shrink-0">
                      {activeDetailStudent.fullName?.charAt(0) || 'S'}
                    </div>
                  )}
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="font-display font-black text-xl text-gray-900">{activeDetailStudent.fullName}</h3>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                        activeDetailStudent.status === 'Active'
                          ? 'bg-green-100 text-green-800 border-green-200'
                          : activeDetailStudent.status === 'Suspended'
                          ? 'bg-red-100 text-red-800 border-red-200'
                          : 'bg-amber-100 text-amber-800 border-amber-200'
                      }`}>
                        ● {activeDetailStudent.status} Student
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600 font-mono">
                      <span className="font-bold text-[#E89B52] bg-amber-100/60 px-2 py-0.5 rounded border border-amber-200">
                        ID: {activeDetailStudent.studentRegistrationId || activeDetailStudent.id}
                      </span>
                      {activeDetailStudent.applicationId && (
                        <span className="text-gray-500">App: {activeDetailStudent.applicationId}</span>
                      )}
                      <span className="text-gray-500">• Enrolled: {activeDetailStudent.enrollmentDate}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-start md:items-end gap-1.5 bg-white/80 p-3 rounded-xl border border-[#E7DED1]/60 text-left md:text-right w-full md:w-auto">
                  <span className="text-[10px] uppercase font-bold text-gray-400 font-mono">Registration Source</span>
                  <span className="font-bold text-gray-800 text-xs flex items-center gap-1">
                    <ShieldCheck size={14} className="text-[#E89B52]" />
                    {activeDetailStudent.registrationSource || 'Staff Portal Registration'}
                  </span>
                  <span className="text-[10px] text-gray-500">Registered By: {activeDetailStudent.registeredBy || 'Registration Staff'}</span>
                </div>
              </div>

              {/* Grid of Detailed Sections */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                {/* 1. Personal & Contact Information */}
                <div className="bg-[#FAF6EF]/30 p-4 rounded-xl border border-[#E7DED1] space-y-3">
                  <h4 className="font-bold text-xs text-[#E89B52] uppercase tracking-wider flex items-center gap-2 border-b border-[#E7DED1] pb-2">
                    <User size={15} />
                    <span>Personal & Contact Information</span>
                  </h4>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-xs">
                    <div>
                      <span className="text-gray-400 block text-[10px] uppercase font-mono">Full Name</span>
                      <span className="font-bold text-gray-800">{activeDetailStudent.fullName}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[10px] uppercase font-mono">Gender & Age</span>
                      <span className="font-bold text-gray-800">{activeDetailStudent.gender || 'Male'} • {activeDetailStudent.age || activeDetailStudent.dob || '20'} yrs</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[10px] uppercase font-mono">Phone Number</span>
                      <span className="font-bold text-gray-800 font-mono">{activeDetailStudent.phone}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[10px] uppercase font-mono">Email Address</span>
                      <span className="font-bold text-gray-800 font-mono truncate block">{activeDetailStudent.email}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-gray-400 block text-[10px] uppercase font-mono">Residential Address</span>
                      <span className="font-bold text-gray-800 flex items-center gap-1">
                        <MapPin size={12} className="text-gray-400 shrink-0" />
                        {activeDetailStudent.address || `${activeDetailStudent.subcity || 'Arada'}, ${activeDetailStudent.city || 'Addis Ababa'}`}
                      </span>
                    </div>
                    <div className="col-span-2 bg-amber-50/60 p-2.5 rounded-lg border border-amber-200/60">
                      <span className="text-amber-900 font-bold block text-[10px] uppercase font-mono">Emergency Contact Person</span>
                      <span className="font-bold text-gray-900 block">{activeDetailStudent.emergencyContact || activeDetailStudent.emergencyName || 'Not Provided'}</span>
                      {activeDetailStudent.emergencyPhone && (
                        <span className="text-gray-600 font-mono text-[11px] block">{activeDetailStudent.emergencyPhone} ({activeDetailStudent.emergencyRel || 'Contact'})</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* 2. Academic Program & Schedule */}
                <div className="bg-[#FAF6EF]/30 p-4 rounded-xl border border-[#E7DED1] space-y-3">
                  <h4 className="font-bold text-xs text-[#E89B52] uppercase tracking-wider flex items-center gap-2 border-b border-[#E7DED1] pb-2">
                    <BookOpen size={15} />
                    <span>Course Enrollment & Schedule</span>
                  </h4>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-xs">
                    <div>
                      <span className="text-gray-400 block text-[10px] uppercase font-mono">Enrolled Course</span>
                      <span className="font-bold text-gray-800">{activeDetailStudent.course}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[10px] uppercase font-mono">Curriculum Level</span>
                      <span className="font-bold text-gray-800">{activeDetailStudent.level}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[10px] uppercase font-mono">Campus Branch</span>
                      <span className="font-bold text-gray-800 flex items-center gap-1">
                        <Building size={12} className="text-gray-400 shrink-0" />
                        {activeDetailStudent.branch}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[10px] uppercase font-mono">Learning Mode</span>
                      <span className="font-bold text-gray-800">{activeDetailStudent.mode}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-gray-400 block text-[10px] uppercase font-mono">Class Schedule & Time</span>
                      <span className="font-bold text-gray-800 flex items-center gap-1">
                        <Clock size={12} className="text-[#E89B52] shrink-0" />
                        {activeDetailStudent.schedule}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[10px] uppercase font-mono">Assigned Teacher</span>
                      <span className="font-bold text-gray-800">{activeDetailStudent.teacherName}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[10px] uppercase font-mono">Attendance Rate</span>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="font-bold text-green-600 font-mono text-sm">
                          {activeDetailStudent.attendancePercent !== undefined ? `${activeDetailStudent.attendancePercent}%` : 'N/A'}
                        </span>
                        <button
                          type="button"
                          onClick={() => setAttendanceModalStudent(activeDetailStudent)}
                          className="px-2.5 py-1 bg-[#E89B52] hover:bg-[#d4863e] text-white text-[10px] font-bold rounded-lg transition shadow-2xs flex items-center gap-1 cursor-pointer shrink-0"
                        >
                          <CheckSquare size={11} />
                          See Full Attendance Record
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Background & Spiritual Profile */}
                <div className="bg-[#FAF6EF]/30 p-4 rounded-xl border border-[#E7DED1] space-y-3">
                  <h4 className="font-bold text-xs text-[#E89B52] uppercase tracking-wider flex items-center gap-2 border-b border-[#E7DED1] pb-2">
                    <Activity size={15} />
                    <span>Background & Musical Profile</span>
                  </h4>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-xs">
                    <div className="col-span-2">
                      <span className="text-gray-400 block text-[10px] uppercase font-mono">Occupation / Organization</span>
                      <span className="font-bold text-gray-800">{activeDetailStudent.occupation || 'Student'}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-gray-400 block text-[10px] uppercase font-mono">Church Affiliation</span>
                      <span className="font-bold text-gray-800">{activeDetailStudent.churchAffiliation || activeDetailStudent.churchName || 'Ethiopian Orthodox Tewahedo Church'}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[10px] uppercase font-mono">Begena / Music Experience</span>
                      <span className="font-bold text-gray-800">{activeDetailStudent.begenaExp || activeDetailStudent.previousExperience || 'Beginner'}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[10px] uppercase font-mono">Instrument Owned</span>
                      <span className="font-bold text-gray-800">{activeDetailStudent.instrumentOwned || 'Begena'}</span>
                    </div>
                  </div>
                </div>

                {/* 5. Complete Student Attendance Record & Check-in Audit Log */}
                <div className="bg-[#FAF6EF]/30 p-4 rounded-xl border border-[#E7DED1] space-y-3 col-span-1 md:col-span-2">
                  <div className="flex items-center justify-between border-b border-[#E7DED1] pb-2">
                    <h4 className="font-bold text-xs text-[#E89B52] uppercase tracking-wider flex items-center gap-2">
                      <Calendar size={15} />
                      <span>5. Complete Student Attendance Record History</span>
                    </h4>
                    <button
                      type="button"
                      onClick={() => setAttendanceModalStudent(activeDetailStudent)}
                      className="text-xs font-bold text-[#E89B52] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>Expand Full Screen Log</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>

                  {(() => {
                    const logs = getStudentAttendanceLogs(activeDetailStudent);
                    return (
                      <div className="space-y-3">
                        <div className="border border-[#E7DED1] rounded-xl overflow-hidden bg-white">
                          <table className="w-full text-left text-xs">
                            <thead className="bg-[#FAF6EF] border-b border-[#E7DED1] font-mono text-[10px] uppercase text-gray-500">
                              <tr>
                                <th className="p-2.5">Date & Day</th>
                                <th className="p-2.5">Course / Branch</th>
                                <th className="p-2.5">Status</th>
                                <th className="p-2.5">Verified By</th>
                                <th className="p-2.5">Notes</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                              {logs.length === 0 ? (
                                <tr>
                                  <td colSpan={5} className="p-6 text-center text-gray-400 italic font-medium">
                                    No attendance records logged yet. All attendance is recorded directly from the staff attendance management log.
                                  </td>
                                </tr>
                              ) : (
                                logs.slice(0, 5).map((log: any, idx: number) => (
                                  <tr key={log.id || idx} className="hover:bg-gray-50/50">
                                    <td className="p-2.5 font-mono font-bold text-gray-800">
                                      {log.date}
                                      {log.dayOfWeek && <span className="block text-[10px] text-gray-400 font-normal">{log.dayOfWeek}</span>}
                                    </td>
                                    <td className="p-2.5 text-gray-700">
                                      {log.courseName || activeDetailStudent.course}
                                    </td>
                                    <td className="p-2.5">
                                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center gap-1 border ${
                                        log.status === 'Present'
                                          ? 'bg-emerald-100 border-emerald-300 text-emerald-800'
                                          : log.status === 'Late'
                                          ? 'bg-amber-100 border-amber-300 text-amber-800'
                                          : log.status === 'Absent'
                                          ? 'bg-red-100 border-red-300 text-red-800'
                                          : 'bg-sky-100 border-sky-300 text-sky-800'
                                      }`}>
                                        {log.status}
                                      </span>
                                    </td>
                                    <td className="p-2.5 text-[11px] text-gray-600">
                                      {log.recordedBy || 'Staff Verified'}
                                    </td>
                                    <td className="p-2.5 text-[11px] text-gray-500 italic truncate max-w-xs">
                                      {log.notes || '—'}
                                    </td>
                                  </tr>
                                ))
                              )}
                            </tbody>
                          </table>
                        </div>

                        <div className="flex justify-between items-center text-xs pt-1">
                          <span className="text-gray-500 font-mono text-[11px]">Showing {Math.min(5, logs.length)} of {logs.length} logged sessions</span>
                          <button
                            type="button"
                            onClick={() => setAttendanceModalStudent(activeDetailStudent)}
                            className="font-bold text-[#E89B52] hover:underline cursor-pointer flex items-center gap-1"
                          >
                            <span>See Full Attendance Record ({logs.length} Total Logs)</span>
                            <ChevronRight size={12} />
                          </button>
                        </div>
                      </div>
                    );
                  })()}
                </div>
                <div className="bg-[#FAF6EF]/30 p-4 rounded-xl border border-[#E7DED1] space-y-3">
                  <h4 className="font-bold text-xs text-[#E89B52] uppercase tracking-wider flex items-center gap-2 border-b border-[#E7DED1] pb-2">
                    <CreditCard size={15} />
                    <span>Financial & Payment Details</span>
                  </h4>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-xs">
                    <div>
                      <span className="text-gray-400 block text-[10px] uppercase font-mono">Registration Fee</span>
                      <span className="font-bold text-gray-800 font-mono">{activeDetailStudent.registrationFeeETB || 500} ETB</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[10px] uppercase font-mono">Course Tuition Fee</span>
                      <span className="font-bold text-gray-800 font-mono">{activeDetailStudent.courseFeeETB || 1500} ETB</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[10px] uppercase font-mono">Total Fee Paid</span>
                      <span className="font-bold text-[#E89B52] font-mono text-sm">{activeDetailStudent.totalFeeETB || 2000} ETB</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[10px] uppercase font-mono">Payment Method</span>
                      <span className="font-bold text-gray-800 font-mono">{activeDetailStudent.paymentMethod || 'Cash'}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[10px] uppercase font-mono">Payment Status</span>
                      <span className={`font-bold font-mono text-[11px] ${
                        activeDetailStudent.paymentStatus === 'Approved' || activeDetailStudent.tuitionPaid
                          ? 'text-green-600'
                          : 'text-amber-600'
                      }`}>
                        ✓ {activeDetailStudent.paymentStatus || (activeDetailStudent.tuitionPaid ? 'Approved & Paid' : 'Pending Verification')}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[10px] uppercase font-mono">Reference / Receipt</span>
                      <span className="font-bold text-gray-800 font-mono truncate block">{activeDetailStudent.paymentReference || 'REF-CASH-ACTIVE'}</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Branch Transfer History if available */}
              {activeDetailStudent.previousBranches && activeDetailStudent.previousBranches.length > 0 && (
                <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl space-y-2">
                  <h4 className="font-bold text-blue-900 text-xs flex items-center gap-1.5">
                    <ArrowRightLeft size={14} />
                    <span>Branch Transfer Audit History</span>
                  </h4>
                  <div className="space-y-1">
                    {activeDetailStudent.previousBranches.map((tb, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs text-blue-800 bg-white/60 p-2 rounded border border-blue-100">
                        <span>Transferred from <strong>{tb.branch}</strong> (Reason: {tb.reason})</span>
                        <span className="font-mono text-[10px] font-bold text-blue-600">{tb.transferDate} • By {tb.approvedBy}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 7: RECORD ATTENDANCE */}
          {activeTab === 'attendance' && (
            <AttendanceManagementCenter lang={lang} onNavigate={onNavigate} />
          )}

          {/* TAB 8: CLASS SCHEDULE MANAGEMENT */}
          {activeTab === 'schedule' && (
            <div className="bg-white border border-[#E7DED1] p-6 rounded-2xl shadow-2xs space-y-4 animate-fadeIn text-xs">
              <h3 className="font-display font-black text-sm uppercase tracking-wider">Master Class Schedules</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {classes.map(c => (
                  <div key={c.id} className="p-4 border rounded-xl bg-[#FAF6EF]/20 space-y-1">
                    <span className="font-bold text-sm block">{c.course} ({c.level})</span>
                    <p><strong>Branch:</strong> {c.branch} • {c.room}</p>
                    <p><strong>Time:</strong> {c.day} ({c.time})</p>
                    <p><strong>Instructor:</strong> {c.teacher}</p>
                    <span className="text-[10px] font-mono font-bold text-[#E89B52] block pt-1">{c.enrolledCount} / {c.capacity} Students Enrolled</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 9: BRANCH TRANSFERS */}
          {activeTab === 'transfers' && (
            <div className="bg-white border border-[#E7DED1] p-6 rounded-2xl shadow-2xs space-y-4 animate-fadeIn text-xs">
              <h3 className="font-display font-black text-sm uppercase tracking-wider">Process Student Branch Transfer</h3>
              <div className="space-y-3">
                <div>
                  <label className="block font-bold mb-1">Select Student</label>
                  <select value={transferStudentId} onChange={(e) => setTransferStudentId(e.target.value)} className="w-full p-2.5 border rounded bg-white">
                    {displayStudents.length === 0 ? (
                      <option value="">No registered students available for transfer</option>
                    ) : (
                      displayStudents.map(s => (
                        <option key={s.id} value={s.id}>{s.fullName} ({s.id}) - Currently at {s.branch}</option>
                      ))
                    )}
                  </select>
                </div>

                <div>
                  <label className="block font-bold mb-1">Target New Branch</label>
                  <select value={targetTransferBranch} onChange={(e) => setTargetTransferBranch(e.target.value as any)} className="w-full p-2.5 border rounded bg-white">
                    <option value="Hawassa Main Branch">Hawassa Main Branch</option>
                    <option value="Virtual Gate">Virtual Gate (Online)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold mb-1">Transfer Reason</label>
                  <Input value={transferReason} onChange={(e) => setTransferReason(e.target.value)} placeholder="Reason for transfer..." />
                </div>

                <Button variant="primary" onClick={handleExecuteTransfer}>Execute Branch Transfer</Button>
              </div>
            </div>
          )}

          {/* TAB 10: STAFF QUEUE & TASKS */}
          {activeTab === 'tasks' && (
            <div className="bg-white border border-[#E7DED1] p-6 rounded-2xl shadow-2xs space-y-4 animate-fadeIn text-xs">
              <h3 className="font-display font-black text-sm uppercase tracking-wider">Pending Tasks Queue</h3>
              <div className="space-y-2">
                {tasks.length === 0 ? (
                  <div className="p-8 text-center text-gray-400 bg-[#FAF6EF]/20 border border-[#E7DED1] rounded-2xl">
                    <Layers size={32} className="mx-auto mb-2 opacity-40 text-[#E89B52]" />
                    <p className="font-bold text-xs">No pending tasks in queue.</p>
                    <p className="text-[10px] text-gray-400 mt-1">Operational tasks assigned to staff will appear here.</p>
                  </div>
                ) : (
                  tasks.map(t => (
                    <div key={t.id} className="p-3 border rounded-xl flex justify-between items-center bg-[#FAF6EF]/30">
                      <div>
                        <span className="font-bold text-gray-800 block">{t.title}</span>
                        <span className="text-[10px] text-gray-400">Due: {t.dueDate}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">{t.priority}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 11: AUDIT LOG */}
          {activeTab === 'audit' && (
            <div className="bg-white border border-[#E7DED1] p-6 rounded-2xl shadow-2xs space-y-4 animate-fadeIn text-xs">
              <h3 className="font-display font-black text-sm uppercase tracking-wider">Administrative Action Audit Log</h3>
              <div className="border rounded-xl overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-[#FAF6EF] text-[10px] font-bold text-gray-400 uppercase">
                    <tr>
                      <th className="p-3">User</th>
                      <th className="p-3">Action</th>
                      <th className="p-3">Target</th>
                      <th className="p-3">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditLogs.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="p-8 text-center text-gray-400">
                          <Activity size={32} className="mx-auto mb-2 opacity-40 text-[#E89B52]" />
                          <p className="font-bold text-xs">No administrative actions logged yet.</p>
                          <p className="text-[10px] text-gray-400 mt-1">Actions taken during this session will be recorded automatically in real-time.</p>
                        </td>
                      </tr>
                    ) : (
                      auditLogs.map(l => (
                        <tr key={l.id} className="border-b text-gray-600">
                          <td className="p-3 font-bold">{l.user}</td>
                          <td className="p-3">{l.action}</td>
                          <td className="p-3 font-mono">{l.target}</td>
                          <td className="p-3 font-mono text-[10px]">{l.time}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* STUDENT ID CARD PRINTING MODAL DIALOG */}
      {isPrintingIDCard && activeDetailStudent && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#E7DED1] rounded-2xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl">
            <h3 className="font-display font-black text-sm uppercase">Official Student ID Card</h3>

            <div className="bg-[#FAF6EF] border-2 border-[#E89B52] p-4 rounded-2xl text-left space-y-3 relative shadow-md">
              <div className="flex justify-between items-center border-b border-[#E7DED1] pb-2">
                <span className="font-black text-[10px] uppercase tracking-wider text-[#E89B52]">Liora Begena School</span>
                <span className="text-[8px] font-mono bg-[#E89B52] text-white px-1.5 py-0.5 rounded font-bold">VERIFIED ID</span>
              </div>
              <div className="flex gap-3 items-center">
                {activeDetailStudent.photo ? (
                  <img src={activeDetailStudent.photo} className="w-16 h-16 rounded-xl object-cover border border-[#E89B52]" alt="" />
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-[#3B2818] text-[#E89B52] font-bold text-lg flex items-center justify-center border border-[#E89B52] shrink-0">
                    {activeDetailStudent.fullName?.charAt(0) || 'S'}
                  </div>
                )}
                <div>
                  <h4 className="font-bold text-sm text-gray-900">{activeDetailStudent.fullName}</h4>
                  <p className="font-mono text-[10px] font-bold text-[#E89B52]">{activeDetailStudent.studentRegistrationId || activeDetailStudent.id}</p>
                  <p className="text-[10px] text-gray-500">{activeDetailStudent.course} ({activeDetailStudent.level})</p>
                  <p className="text-[9px] text-gray-400">{activeDetailStudent.branch}</p>
                </div>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-[#E7DED1]">
                <QrCode size={32} className="text-gray-800" />
                <span className="text-[8px] text-gray-400 font-mono">Issued 2026 • Authorized</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="secondary" className="flex-1" onClick={() => setIsPrintingIDCard(false)}>Close</Button>
              <Button variant="primary" className="flex-1 gap-2" onClick={() => { alert('Sending print job to card printer...'); setIsPrintingIDCard(false); }}>
                <Printer size={14} /> Print Card
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE STUDENT MODAL DIALOG */}
      {studentToDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white border border-[#E7DED1] rounded-2xl max-w-md w-full p-6 text-left space-y-4 shadow-2xl relative">
            <button
              onClick={() => setStudentToDelete(null)}
              className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3 text-red-600">
              <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
                <Trash2 size={20} />
              </div>
              <div>
                <h3 className="font-display font-black text-base text-gray-900">Confirm Student Deletion</h3>
                <p className="text-xs text-gray-500">This action cannot be undone.</p>
              </div>
            </div>

            <div className="bg-red-50/60 border border-red-100 p-3.5 rounded-xl text-xs space-y-1.5">
              <p className="font-bold text-gray-900">
                Are you sure you want to delete <span className="text-red-700 font-extrabold">{studentToDelete.fullName}</span>?
              </p>
              <div className="grid grid-cols-2 gap-1 text-[11px] text-gray-600 pt-1 border-t border-red-100">
                <div><span className="font-medium text-gray-500">Student ID:</span> {studentToDelete.studentRegistrationId || studentToDelete.id}</div>
                <div><span className="font-medium text-gray-500">Course:</span> {studentToDelete.course}</div>
                <div><span className="font-medium text-gray-500">Branch:</span> {studentToDelete.branch}</div>
                <div><span className="font-medium text-gray-500">Status:</span> {studentToDelete.status || studentToDelete.paymentStatus}</div>
              </div>
            </div>

            <p className="text-[11px] text-gray-500 italic">
              Deleting will remove this student from the active master roster, clear registration records, and update system audit logs.
            </p>

            <div className="flex gap-2 pt-2">
              <Button variant="secondary" className="flex-1" onClick={() => setStudentToDelete(null)}>
                Cancel
              </Button>
              <button
                onClick={() => handleConfirmDelete(studentToDelete)}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Trash2 size={14} /> Permanently Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FULL STUDENT ATTENDANCE RECORD MODAL DIALOG */}
      {attendanceModalStudent && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white border border-[#E7DED1] rounded-2xl max-w-3xl w-full p-6 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* HEADER */}
            <div className="flex items-start justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#FAF6EF] border border-[#E7DED1] flex items-center justify-center text-[#E89B52] font-black text-lg overflow-hidden shrink-0">
                  {attendanceModalStudent.photo ? (
                    <img src={attendanceModalStudent.photo} alt="" className="w-full h-full object-cover" />
                  ) : (
                    attendanceModalStudent.fullName?.charAt(0) || 'S'
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold uppercase bg-amber-100 text-[#E89B52] px-2 py-0.5 rounded">
                      ID: {attendanceModalStudent.studentRegistrationId || attendanceModalStudent.id}
                    </span>
                    <span className="text-xs text-gray-400">• {attendanceModalStudent.branch || 'Hawassa Campus'}</span>
                  </div>
                  <h3 className="font-display font-black text-lg text-gray-900 mt-0.5">
                    {attendanceModalStudent.fullName || attendanceModalStudent.name}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {attendanceModalStudent.course} ({attendanceModalStudent.level || 'Level 1'}) • Teacher: {attendanceModalStudent.teacherName || 'Zemari Deacon Bruk'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setAttendanceModalStudent(null)}
                className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* STATS & LOGS */}
            {(() => {
              const logs = getStudentAttendanceLogs(attendanceModalStudent);
              const total = logs.length;
              const present = logs.filter(l => l.status === 'Present').length;
              const late = logs.filter(l => l.status === 'Late').length;
              const absent = logs.filter(l => l.status === 'Absent').length;
              const permission = logs.filter(l => l.status === 'Permission' || l.status === 'Excused').length;
              const rate = total > 0 ? Math.round(((present + (late * 0.5)) / total) * 100) : 0;

              return (
                <div className="space-y-5">
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center text-xs">
                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl">
                      <span className="block text-[10px] text-gray-500 font-bold uppercase">Total Sessions</span>
                      <span className="text-lg font-black font-mono text-gray-900">{total}</span>
                    </div>
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                      <span className="block text-[10px] text-emerald-700 font-bold uppercase">Present</span>
                      <span className="text-lg font-black font-mono text-emerald-900">{present}</span>
                    </div>
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
                      <span className="block text-[10px] text-amber-700 font-bold uppercase">Late</span>
                      <span className="text-lg font-black font-mono text-amber-900">{late}</span>
                    </div>
                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                      <span className="block text-[10px] text-red-700 font-bold uppercase">Absent</span>
                      <span className="text-lg font-black font-mono text-red-900">{absent}</span>
                    </div>
                    <div className="p-3 bg-sky-50 border border-sky-200 rounded-xl">
                      <span className="block text-[10px] text-sky-700 font-bold uppercase">Permission</span>
                      <span className="text-lg font-black font-mono text-sky-900">{permission}</span>
                    </div>
                  </div>

                  <div className="p-4 bg-[#FAF6EF] border border-[#E7DED1] rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                    <div>
                      <span className="font-bold text-gray-800 block">Overall Student Attendance Percentage</span>
                      <span className="text-[11px] text-gray-500">Calculated from verified daily staff check-ins</span>
                    </div>
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <div className="w-32 bg-gray-200 h-2.5 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${rate}%` }} />
                      </div>
                      <span className="font-mono font-black text-emerald-700 text-sm">{rate}% Rate</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <h4 className="font-display font-black text-xs uppercase text-gray-800 flex items-center gap-1.5">
                        <Calendar size={14} className="text-[#E89B52]" />
                        Full Attendance History Records ({total} Entries)
                      </h4>
                      <button
                        onClick={() => window.print()}
                        className="text-xs font-bold text-gray-600 hover:text-black flex items-center gap-1 cursor-pointer"
                      >
                        <Printer size={13} /> Print Attendance Log
                      </button>
                    </div>

                    <div className="border border-[#E7DED1] rounded-xl overflow-hidden bg-white">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-[#FAF6EF] border-b border-[#E7DED1] font-mono text-[10px] uppercase text-gray-500">
                          <tr>
                            <th className="p-3">Date & Day</th>
                            <th className="p-3">Course / Branch</th>
                            <th className="p-3">Status</th>
                            <th className="p-3">Staff Verification</th>
                            <th className="p-3">Notes</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {logs.map((log: any, idx: number) => (
                            <tr key={log.id || idx} className="hover:bg-gray-50/50">
                              <td className="p-3 font-mono font-bold text-gray-800">
                                {log.date}
                                {log.dayOfWeek && <span className="block text-[10px] text-gray-400 font-normal">{log.dayOfWeek}</span>}
                              </td>
                              <td className="p-3">
                                <span className="font-bold text-gray-800 block">{log.courseName || attendanceModalStudent.course}</span>
                                <span className="text-[10px] text-gray-400">{log.branch || attendanceModalStudent.branch}</span>
                              </td>
                              <td className="p-3">
                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1 border ${
                                  log.status === 'Present'
                                    ? 'bg-emerald-100 border-emerald-300 text-emerald-800'
                                    : log.status === 'Late'
                                    ? 'bg-amber-100 border-amber-300 text-amber-800'
                                    : log.status === 'Absent'
                                    ? 'bg-red-100 border-red-300 text-red-800'
                                    : 'bg-sky-100 border-sky-300 text-sky-800'
                                }`}>
                                  {log.status === 'Present' && <CheckCircle size={11} />}
                                  {log.status === 'Late' && <Clock size={11} />}
                                  {log.status === 'Absent' && <X size={11} />}
                                  {log.status === 'Permission' && <Info size={11} />}
                                  {log.status}
                                </span>
                              </td>
                              <td className="p-3 text-[11px] text-gray-600">
                                {log.recordedBy || 'Verified Staff'}
                              </td>
                              <td className="p-3 text-[11px] text-gray-500 italic max-w-xs truncate">
                                {log.notes || '—'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                    <button
                      onClick={() => {
                        setAttendanceModalStudent(null);
                        setActiveTab('attendance');
                      }}
                      className="text-xs font-bold text-[#E89B52] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      Open Daily Attendance Management Center →
                    </button>
                    <button
                      onClick={() => setAttendanceModalStudent(null)}
                      className="px-5 py-2 bg-gray-900 hover:bg-black text-white font-bold text-xs rounded-xl cursor-pointer"
                    >
                      Close
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* Auto-Assignment Result Summary Modal */}
      {autoAssignSummaryModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-[#E7DED1] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-[#E89B52] flex items-center justify-center font-bold text-sm">
                  ⚡
                </div>
                <div>
                  <h3 className="font-display font-black text-sm uppercase text-[#2B2B2B]">
                    Auto-Assignment Summary
                  </h3>
                  <p className="text-[11px] text-gray-500">
                    Faculty matching & workload distribution workflow
                  </p>
                </div>
              </div>
              <button
                onClick={() => setAutoAssignSummaryModal(null)}
                className="text-gray-400 hover:text-gray-700 p-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Summary Stat Cards */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-center">
                <span className="text-[10px] font-bold text-gray-400 uppercase block">Processed</span>
                <span className="text-xl font-black text-gray-800 font-mono">{autoAssignSummaryModal.processed}</span>
              </div>
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-center">
                <span className="text-[10px] font-bold text-emerald-600 uppercase block">Assigned</span>
                <span className="text-xl font-black text-emerald-800 font-mono">{autoAssignSummaryModal.assigned}</span>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-center">
                <span className="text-[10px] font-bold text-amber-600 uppercase block">Pending</span>
                <span className="text-xl font-black text-amber-800 font-mono">{autoAssignSummaryModal.pending}</span>
              </div>
            </div>

            {/* Details List */}
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
                Assignment Details ({autoAssignSummaryModal.details?.length || 0})
              </span>

              {(!autoAssignSummaryModal.details || autoAssignSummaryModal.details.length === 0) ? (
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-500 text-center">
                  No active unassigned students found. All enrolled students currently have assigned teachers.
                </div>
              ) : (
                autoAssignSummaryModal.details.map((item: any, idx: number) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl border text-xs space-y-1 ${
                      item.status === 'Assigned'
                        ? 'bg-emerald-50/60 border-emerald-200'
                        : 'bg-amber-50/60 border-amber-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-900">{item.studentName}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          item.status === 'Assigned'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : 'bg-amber-100 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                    <div className="text-[11px] text-gray-600 font-medium">
                      Course: {item.courseName || 'Music Course'}
                    </div>
                    <div className={`text-[11px] ${item.status === 'Assigned' ? 'text-emerald-700 font-semibold' : 'text-amber-800'}`}>
                      {item.reason}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="pt-2 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setAutoAssignSummaryModal(null)}
                className="bg-[#2B2B2B] hover:bg-black text-white text-xs font-bold py-2 px-5 rounded-xl transition-all cursor-pointer"
              >
                Close Summary
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

