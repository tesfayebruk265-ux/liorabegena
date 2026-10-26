import React, { useState, useEffect, useMemo } from 'react';
import {
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  FileText,
  Search,
  Filter,
  UserCheck,
  UserX,
  Building,
  BookOpen,
  User,
  ShieldCheck,
  RefreshCcw,
  Printer,
  Download,
  Plus,
  Check,
  X,
  Info,
  History,
  AlertTriangle,
  ChevronRight,
  Sparkles,
  Award,
  Settings,
  Sliders,
  CheckSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../context/AuthContext';
import { useData, PersistentStudent } from '../../context/DataContext';
import { Button, Input } from '../InteractiveComponents';
import {
  Language,
  AttendanceRecord,
  AttendanceStatus,
  PermissionReason,
  AttendanceAuditLog,
  StudentEnrollment
} from '../../types';

interface AttendanceManagementCenterProps {
  lang: Language;
  onNavigate?: (page: string, params?: any) => void;
  initialStudentId?: string;
}

// Day mapping helper
const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// Helper to calculate start & end dates and generate dates for selected days
export function generateAttendanceDatesForEnrollment(
  startDateStr: string,
  durationMonths: number,
  scheduleDays: string[]
): { dateStr: string; dayOfWeek: string }[] {
  const dates: { dateStr: string; dayOfWeek: string }[] = [];
  if (!scheduleDays || scheduleDays.length === 0) return dates;

  const start = new Date(startDateStr || new Date().toISOString().split('T')[0]);
  if (isNaN(start.getTime())) return dates;

  // Calculate target end date
  const end = new Date(start);
  end.setMonth(end.getMonth() + (durationMonths || 3));

  const current = new Date(start);
  while (current <= end) {
    const dayName = DAY_NAMES[current.getDay()];
    // Case-insensitive check for schedule day match
    const isMatchedDay = scheduleDays.some(
      d => d.trim().toLowerCase() === dayName.toLowerCase()
    );

    if (isMatchedDay) {
      const year = current.getFullYear();
      const month = String(current.getMonth() + 1).padStart(2, '0');
      const day = String(current.getDate()).padStart(2, '0');
      dates.push({
        dateStr: `${year}-${month}-${day}`,
        dayOfWeek: dayName
      });
    }
    // Move to next day
    current.setDate(current.getDate() + 1);
  }

  return dates;
}

export function parseScheduleDaysFromStudent(student: any): string[] {
  if (!student) return ['Monday', 'Tuesday', 'Wednesday', 'Friday', 'Saturday'];
  if (Array.isArray(student.scheduleDays) && student.scheduleDays.length > 0) {
    return student.scheduleDays.map((d: string) => d.trim());
  }

  if (typeof student.scheduleDays === 'string' && student.scheduleDays.trim().length > 0) {
    const rawParts = student.scheduleDays.split(/[,/| \t]+/).map((s: string) => s.trim()).filter(Boolean);
    const parsedDays: string[] = [];
    rawParts.forEach(p => {
      const pl = p.toLowerCase();
      if (pl.startsWith('mon') && !parsedDays.includes('Monday')) parsedDays.push('Monday');
      if (pl.startsWith('tue') && !parsedDays.includes('Tuesday')) parsedDays.push('Tuesday');
      if (pl.startsWith('wed') && !parsedDays.includes('Wednesday')) parsedDays.push('Wednesday');
      if (pl.startsWith('thu') && !parsedDays.includes('Thursday')) parsedDays.push('Thursday');
      if (pl.startsWith('fri') && !parsedDays.includes('Friday')) parsedDays.push('Friday');
      if (pl.startsWith('sat') && !parsedDays.includes('Saturday')) parsedDays.push('Saturday');
      if (pl.startsWith('sun') && !parsedDays.includes('Sunday')) parsedDays.push('Sunday');
    });
    if (parsedDays.length > 0) return parsedDays;
  }

  const text = [
    student.scheduleDays ? (Array.isArray(student.scheduleDays) ? student.scheduleDays.join(' ') : String(student.scheduleDays)) : '',
    student.scheduleDayTime || '',
    student.schedule || '',
    student.scheduleFrequency || '',
    student.frequency || ''
  ].join(' ').toLowerCase();

  const is5Days = text.includes('5 day') || text.includes('5-day') || student.durationMonths === 3 || String(student.duration || '').includes('3 month');

  const days: string[] = [];

  if (text.includes('mon') || text.includes('monday')) days.push('Monday');
  if (text.includes('tue') || text.includes('tuesday')) days.push('Tuesday');
  if (text.includes('wed') || text.includes('wednesday')) days.push('Wednesday');
  if (text.includes('thu') || text.includes('thursday')) days.push('Thursday');
  if (text.includes('fri') || text.includes('friday')) days.push('Friday');
  if (text.includes('sat') || text.includes('saturday')) days.push('Saturday');
  if (text.includes('sun') || text.includes('sunday')) days.push('Sunday');

  if (is5Days && days.length < 5) {
    if (text.includes('sat') || text.includes('saturday')) {
      return ['Monday', 'Tuesday', 'Wednesday', 'Friday', 'Saturday'];
    }
    return ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  }

  if (days.length > 0) return days;

  if (text.includes('weekend')) {
    return ['Saturday', 'Sunday'];
  }

  if (text.includes('3 days') || text.includes('6 month')) {
    return ['Monday', 'Wednesday', 'Friday'];
  }

  if (text.includes('2 days') || text.includes('9 month')) {
    return ['Tuesday', 'Thursday'];
  }

  if (is5Days || text.includes('weekday') || text.includes('daily')) {
    return ['Monday', 'Tuesday', 'Wednesday', 'Friday', 'Saturday'];
  }

  return ['Monday', 'Tuesday', 'Wednesday', 'Friday', 'Saturday'];
}

export function formatScheduleDaysSummary(days: string[]): string {
  if (!days || days.length === 0) return 'Standard Schedule';
  const shortDays = days.map(d => d.slice(0, 3));
  return `${days.length} Days/Wk: ${shortDays.join('/')}`;
}

export function AttendanceManagementCenter({
  lang,
  onNavigate,
  initialStudentId
}: AttendanceManagementCenterProps) {
  const { currentUser, hasPermission } = useAuth();
  const { students, enrollments, addAuditEntry } = useData();

  // User authorization check
  const isAuthorizedStaff =
    currentUser?.role === 'admin' ||
    currentUser?.role === 'super_admin' ||
    currentUser?.role === 'registration_staff' ||
    currentUser?.role === 'accountant' ||
    currentUser?.role === 'branch_manager' ||
    currentUser?.role === 'founder';

  // Navigation tab within Attendance Center
  const [activeTab, setActiveTab] = useState<
    'daily' | 'weekly' | 'student-detail' | 'audit' | 'analytics'
  >(initialStudentId ? 'student-detail' : 'daily');

  // Filters
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [selectedBranch, setSelectedBranch] = useState<string>(
    currentUser?.branch || 'All'
  );
  const [selectedCourse, setSelectedCourse] = useState<string>('All');
  const [selectedTeacher, setSelectedTeacher] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Settings for Schedule Day Filtering with LocalStorage Persistence
  const [filterByScheduleDays, setFilterByScheduleDays] = useState<boolean>(() => {
    const saved = localStorage.getItem('ab_attendance_filter_scheduled_only');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [detailFilterScheduledOnly, setDetailFilterScheduledOnly] = useState<boolean>(() => {
    const saved = localStorage.getItem('ab_attendance_detail_filter_scheduled_only');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [strictMarkingMode, setStrictMarkingMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('ab_attendance_strict_marking_mode');
    return saved !== null ? JSON.parse(saved) : true;
  });

  // Settings Modal & Off-Schedule Notice Modal
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [offScheduleModalOpen, setOffScheduleModalOpen] = useState(false);
  const [offScheduleTarget, setOffScheduleTarget] = useState<{
    record: AttendanceRecord;
    attemptedStatus: AttendanceStatus;
  } | null>(null);

  // Sync settings to localStorage
  useEffect(() => {
    localStorage.setItem(
      'ab_attendance_filter_scheduled_only',
      JSON.stringify(filterByScheduleDays)
    );
  }, [filterByScheduleDays]);

  useEffect(() => {
    localStorage.setItem(
      'ab_attendance_detail_filter_scheduled_only',
      JSON.stringify(detailFilterScheduledOnly)
    );
  }, [detailFilterScheduledOnly]);

  useEffect(() => {
    localStorage.setItem(
      'ab_attendance_strict_marking_mode',
      JSON.stringify(strictMarkingMode)
    );
  }, [strictMarkingMode]);

  // Selected student for detailed schedule view
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
    initialStudentId || null
  );

  // Modal State for Permission Status
  const [permissionModalOpen, setPermissionModalOpen] = useState(false);
  const [permissionRecordTarget, setPermissionRecordTarget] =
    useState<AttendanceRecord | null>(null);
  const [selectedPermissionReason, setSelectedPermissionReason] =
    useState<PermissionReason>('Medical Appointment');
  const [permissionNote, setPermissionNote] = useState<string>('');

  // Modal State for Historical Edit
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editRecordTarget, setEditRecordTarget] =
    useState<AttendanceRecord | null>(null);
  const [editTargetStatus, setEditTargetStatus] =
    useState<AttendanceStatus>('Present');
  const [editReason, setEditReason] = useState<string>('');

  // ----------------------------------------------------
  // PERSISTENT ATTENDANCE RECORDS & AUDIT LOGS STATE
  // ----------------------------------------------------
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(
    () => {
      const saved = localStorage.getItem('ab_attendance_records_v4');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error(e);
        }
      }
      return [];
    }
  );

  const [auditLogs, setAuditLogs] = useState<AttendanceAuditLog[]>(() => {
    const saved = localStorage.getItem('ab_attendance_audit_logs_v4');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(
      'ab_attendance_records_v4',
      JSON.stringify(attendanceRecords)
    );
  }, [attendanceRecords]);

  useEffect(() => {
    localStorage.setItem(
      'ab_attendance_audit_logs_v4',
      JSON.stringify(auditLogs)
    );
  }, [auditLogs]);

  // Storage sync trigger state
  const [storageTrigger, setStorageTrigger] = useState(0);

  useEffect(() => {
    const handleUpdate = () => setStorageTrigger(prev => prev + 1);
    window.addEventListener('ab_user_updated', handleUpdate);
    window.addEventListener('ab_students_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('ab_user_updated', handleUpdate);
      window.removeEventListener('ab_students_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  // Aggregate all registered students from DataContext, ab_students_v3, and ab_applications_v3
  const allRegisteredStudents = useMemo(() => {
    const studentList: any[] = [];

    const addOrMergeStudent = (s: any) => {
      if (!s) return;
      const rawName = s.fullName || s.studentName || `${s.firstName || ''} ${s.lastName || ''}`.trim();
      const nameKey = rawName.toLowerCase().trim();
      if (!nameKey || nameKey === 'registered student') return;

      const emailKey = s.email && s.email !== 'student@begena.com' ? s.email.trim().toLowerCase() : null;

      const existingIdx = studentList.findIndex(item => {
        const itemName = (item.fullName || item.studentName || '').trim().toLowerCase();
        const itemEmail = item.email && item.email !== 'student@begena.com' ? item.email.trim().toLowerCase() : null;
        if (s.id && item.id && s.id === item.id) return true;
        if (s.applicationId && item.applicationId && s.applicationId === item.applicationId) return true;
        if (emailKey && itemEmail && emailKey === itemEmail) return true;
        if (nameKey && itemName && nameKey === itemName) return true;
        return false;
      });

      const parsedDaysFromInput = s.scheduleDays || null;
      const computedFreq = s.scheduleFrequency || (s.durationMonths === 3 || s.duration === '3 Months' ? '5 Days' : s.durationMonths === 6 || s.duration === '6 Months' ? '3 Days' : s.durationMonths === 9 || s.duration === '9 Months' ? '2 Days' : null) || s.frequency;
      
      const computedDayTime = s.scheduleDayTime || s.schedule 
        || (parsedDaysFromInput ? `${Array.isArray(parsedDaysFromInput) ? parsedDaysFromInput.map((d: string) => d.slice(0, 3)).join('/') : parsedDaysFromInput}` : null)
        || (computedFreq ? `${computedFreq} Program` : null)
        || null;

      const studentObj = {
        id: s.id || s.studentId || s.applicationId || `STU-${Math.floor(1000 + Math.random() * 9000)}`,
        fullName: rawName || 'Registered Student',
        email: s.email || 'student@begena.com',
        phone: s.phone || '+251911000000',
        courseId: s.courseId || 'begena',
        courseName: s.course || s.courseName || s.selectedCourse || 'Begena - Level 1',
        instrument: s.instrument || s.course || s.selectedCourse || 'Begena',
        level: s.level || s.experienceLevel || 'Level 1: Foundation',
        branch: s.branch || s.preferredBranch || 'Piazza Branch',
        learningMode: s.mode || s.learningMode || 'In-Person',
        scheduleDayTime: computedDayTime || '5 Days - Mon/Tue/Wed/Fri/Sat',
        scheduleFrequency: computedFreq || '5 Days',
        scheduleDays: parsedDaysFromInput,
        frequency: computedFreq || '5 Days',
        registeredAt: s.enrollmentDate || s.submittedAt || new Date().toISOString(),
        approvedAt: s.enrollmentDate || s.submittedAt,
        durationMonths: s.durationMonths || (computedFreq === '5 Days' ? 3 : computedFreq === '3 Days' ? 6 : 9)
      };

      if (existingIdx >= 0) {
        const existing = studentList[existingIdx];
        const prefersNewId = (studentObj.id.startsWith('STU-') || studentObj.id.startsWith('ABS-')) && (!existing.id.startsWith('STU-') && !existing.id.startsWith('ABS-'));
        
        const mergedDays = studentObj.scheduleDays || existing.scheduleDays || null;
        const mergedFreq = (studentObj.scheduleFrequency && !studentObj.scheduleFrequency.includes('3 days per week') ? studentObj.scheduleFrequency : existing.scheduleFrequency) || studentObj.scheduleFrequency || existing.scheduleFrequency;
        const mergedDayTime = (studentObj.scheduleDayTime && !studentObj.scheduleDayTime.startsWith('Mon/Wed/Fri') ? studentObj.scheduleDayTime : existing.scheduleDayTime) || studentObj.scheduleDayTime || existing.scheduleDayTime;

        studentList[existingIdx] = prefersNewId
          ? { ...existing, ...studentObj, scheduleDays: mergedDays, scheduleFrequency: mergedFreq, scheduleDayTime: mergedDayTime }
          : { ...studentObj, ...existing, scheduleDays: mergedDays, scheduleFrequency: mergedFreq, scheduleDayTime: mergedDayTime };
      } else {
        studentList.push(studentObj);
      }
    };

    (students || []).forEach(addOrMergeStudent);

    try {
      const savedStus = JSON.parse(localStorage.getItem('ab_students_v3') || '[]');
      savedStus.forEach(addOrMergeStudent);
    } catch (e) {
      console.error(e);
    }

    try {
      const savedApps = JSON.parse(localStorage.getItem('ab_applications_v3') || '[]');
      savedApps.forEach(addOrMergeStudent);
    } catch (e) {
      console.error(e);
    }

    let deletedIds: string[] = [];
    try {
      deletedIds = JSON.parse(localStorage.getItem('ab_deleted_students_v3') || '[]');
    } catch (e) {
      deletedIds = [];
    }

    return studentList.filter(s => 
      !deletedIds.includes(s.id) && 
      !deletedIds.includes(s.applicationId) &&
      !deletedIds.includes(s.studentId)
    );
  }, [students, storageTrigger]);

  // ----------------------------------------------------
  // AUTO-SCHEDULE GENERATION ENGINE
  // Ensures every student/enrollment has generated schedule records
  // ----------------------------------------------------
  useEffect(() => {
    let recordsUpdated = false;
    let newRecords: AttendanceRecord[] = [...attendanceRecords];

    allRegisteredStudents.forEach(student => {
      // Find matching enrollment or create default schedule parameters
      const matchingEnrollment = enrollments.find(
        e => e.studentId === student.id || e.studentEmail === student.email
      );

      const durationMonths =
        student.durationMonths ||
        matchingEnrollment?.durationMonths ||
        3; // Default 3 months

      // Extract schedule days directly from student registration choices
      const scheduleDays = parseScheduleDaysFromStudent(student);

      const startDate =
        student.approvedAt?.split('T')[0] ||
        student.registeredAt?.split('T')[0] ||
        matchingEnrollment?.startDate ||
        matchingEnrollment?.enrollmentDate ||
        '2026-07-01';

      // Check existing records for this student
      const studentExistingRecords = newRecords.filter(
        r => r.studentId === student.id
      );

      if (studentExistingRecords.length === 0) {
        // Generate attendance schedule dates for student
        const generatedDates = generateAttendanceDatesForEnrollment(
          startDate,
          durationMonths,
          scheduleDays
        );

        if (generatedDates.length > 0) {
          const generatedRecords: AttendanceRecord[] = generatedDates.map(
            (item, index) => ({
              id: `ATT-${student.id}-${item.dateStr}-${index}`,
              enrollmentId: matchingEnrollment?.id || `ENR-${student.id}`,
              studentId: student.id,
              studentName: student.fullName,
              studentEmail: student.email,
              studentPhone: student.phone,
              courseId: student.courseId || 'begena',
              courseName: student.courseName || 'Begena - Level 1',
              instrument: student.instrument || student.courseName || 'Begena',
              level: student.level || 'Level 1: Foundation',
              branch: student.branch || 'Piazza Branch',
              learningMode: student.learningMode || 'In-Person',
              classTime: student.scheduleFrequency || 'Morning (9:00 AM - 12:00 PM)',
              teacherName: 'Master Teacher',
              date: item.dateStr,
              dayOfWeek: item.dayOfWeek,
              status: 'Not Marked',
              createdAt: new Date().toISOString()
            })
          );

          newRecords = [...newRecords, ...generatedRecords];
          recordsUpdated = true;
        }
      }

      // Ensure record exists for selectedDate
      const recordOnSelectedDate = newRecords.find(
        r => r.studentId === student.id && r.date === selectedDate
      );
      if (!recordOnSelectedDate) {
        const selectedDateObj = new Date(selectedDate);
        const dayOfWeekName = DAY_NAMES[selectedDateObj.getDay()] || 'Monday';
        newRecords.push({
          id: `ATT-${student.id}-${selectedDate}-direct`,
          enrollmentId: matchingEnrollment?.id || `ENR-${student.id}`,
          studentId: student.id,
          studentName: student.fullName,
          studentEmail: student.email,
          studentPhone: student.phone,
          courseId: student.courseId || 'begena',
          courseName: student.courseName || 'Begena - Level 1',
          instrument: student.instrument || student.courseName || 'Begena',
          level: student.level || 'Level 1: Foundation',
          branch: student.branch || 'Piazza Branch',
          learningMode: student.learningMode || 'In-Person',
          classTime: student.scheduleFrequency || 'Morning (9:00 AM - 12:00 PM)',
          teacherName: 'Master Teacher',
          date: selectedDate,
          dayOfWeek: dayOfWeekName,
          status: 'Not Marked',
          createdAt: new Date().toISOString()
        });
        recordsUpdated = true;
      }
    });

    if (recordsUpdated) {
      setAttendanceRecords(newRecords);
    }
  }, [allRegisteredStudents, enrollments, selectedDate]);

  // ----------------------------------------------------
  // FILTERED DATA CALCULATIONS
  // ----------------------------------------------------
  const selectedDateDayName = useMemo(() => {
    const d = new Date(selectedDate);
    return DAY_NAMES[d.getDay()] || 'Monday';
  }, [selectedDate]);

  const filteredDailyRecords = useMemo(() => {
    let deletedIds: string[] = [];
    try {
      deletedIds = JSON.parse(localStorage.getItem('ab_deleted_students_v3') || '[]');
    } catch (e) {
      deletedIds = [];
    }

    const raw = attendanceRecords.filter(rec => {
      // Exclude deleted students
      if (rec.studentId && deletedIds.includes(rec.studentId)) return false;
      if (rec.enrollmentId && deletedIds.includes(rec.enrollmentId)) return false;

      // Date filter
      if (rec.date !== selectedDate) return false;

      // Branch filter
      if (selectedBranch !== 'All' && rec.branch !== selectedBranch)
        return false;

      // Course filter
      if (selectedCourse !== 'All' && !rec.courseName.includes(selectedCourse))
        return false;

      // Teacher filter
      if (
        selectedTeacher !== 'All' &&
        rec.teacherName &&
        !rec.teacherName.includes(selectedTeacher)
      )
        return false;

      // Match student to inspect their registration schedule
      const studentObj = allRegisteredStudents.find(
        s => s.id === rec.studentId || (s.fullName && s.fullName.toLowerCase().trim() === rec.studentName.toLowerCase().trim())
      );
      const studentDays = parseScheduleDaysFromStudent(studentObj || rec);
      const isScheduledToday = studentDays.some(
        d => d.toLowerCase() === selectedDateDayName.toLowerCase()
      );

      // Schedule Days Setting Filter
      if (filterByScheduleDays) {
        // If strict filter is enabled, only show student if today is their chosen registration day OR if they were already marked
        if (!isScheduledToday && rec.status === 'Not Marked') {
          return false;
        }
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          rec.studentName.toLowerCase().includes(q) ||
          rec.studentId.toLowerCase().includes(q) ||
          rec.courseName.toLowerCase().includes(q)
        );
      }

      return true;
    });

    // Deduplicate entries for the same student on the same date
    const uniqueMap = new Map<string, AttendanceRecord & { isScheduledToday?: boolean; scheduleDaysSummary?: string; studentScheduleDays?: string[] }>();
    raw.forEach(rec => {
      const key = (rec.studentName || '').trim().toLowerCase();
      if (!key) return;

      const studentObj = allRegisteredStudents.find(
        s => s.id === rec.studentId || (s.fullName && s.fullName.toLowerCase().trim() === rec.studentName.toLowerCase().trim())
      );
      const studentDays = parseScheduleDaysFromStudent(studentObj || rec);
      const isScheduledToday = studentDays.some(
        d => d.toLowerCase() === selectedDateDayName.toLowerCase()
      );
      const scheduleDaysSummary = formatScheduleDaysSummary(studentDays);

      const enrichedRec = {
        ...rec,
        isScheduledToday,
        scheduleDaysSummary,
        studentScheduleDays: studentDays
      };

      const existing = uniqueMap.get(key);
      if (!existing) {
        uniqueMap.set(key, enrichedRec);
      } else {
        if (existing.status === 'Not Marked' && rec.status !== 'Not Marked') {
          uniqueMap.set(key, enrichedRec);
        } else if ((rec.studentId.startsWith('STU-') || rec.studentId.startsWith('ABS-')) && !existing.studentId.startsWith('STU-') && !existing.studentId.startsWith('ABS-')) {
          uniqueMap.set(key, { ...existing, ...enrichedRec });
        }
      }
    });

    return Array.from(uniqueMap.values());
  }, [
    attendanceRecords,
    selectedDate,
    selectedDateDayName,
    selectedBranch,
    selectedCourse,
    selectedTeacher,
    searchQuery,
    filterByScheduleDays,
    allRegisteredStudents
  ]);

  // Selected Student Records & Schedule for Detail View
  const selectedStudentObj = useMemo(() => {
    if (!selectedStudentId) return null;
    return allRegisteredStudents.find(s => s.id === selectedStudentId) || students.find(s => s.id === selectedStudentId) || null;
  }, [allRegisteredStudents, students, selectedStudentId]);

  const selectedStudentScheduleDays = useMemo(() => {
    if (!selectedStudentObj) return ['Monday', 'Wednesday', 'Friday'];
    return parseScheduleDaysFromStudent(selectedStudentObj);
  }, [selectedStudentObj]);

  const selectedStudentRecords = useMemo(() => {
    if (!selectedStudentId) return [];
    let records = attendanceRecords.filter(r => r.studentId === selectedStudentId);

    if (detailFilterScheduledOnly && selectedStudentScheduleDays.length > 0) {
      records = records.filter(r => {
        const isScheduled = selectedStudentScheduleDays.some(
          d => d.toLowerCase() === (r.dayOfWeek || '').toLowerCase()
        );
        return isScheduled || r.status !== 'Not Marked';
      });
    }

    return records.sort((a, b) => a.date.localeCompare(b.date));
  }, [attendanceRecords, selectedStudentId, detailFilterScheduledOnly, selectedStudentScheduleDays]);

  // Calculate Real Attendance Percentage
  const studentAttendanceStats = useMemo(() => {
    if (!selectedStudentRecords || selectedStudentRecords.length === 0) {
      return {
        totalScheduled: 0,
        present: 0,
        absent: 0,
        permission: 0,
        late: 0,
        notMarked: 0,
        attendancePercent: 100,
        isEligibleForCertificate: true
      };
    }

    const todayStr = new Date().toISOString().split('T')[0];

    const totalScheduled = selectedStudentRecords.length;
    const present = selectedStudentRecords.filter(r => r.status === 'Present').length;
    const absent = selectedStudentRecords.filter(r => r.status === 'Absent').length;
    const permission = selectedStudentRecords.filter(r => r.status === 'Permission').length;
    const late = selectedStudentRecords.filter(r => r.status === 'Late').length;
    const notMarked = selectedStudentRecords.filter(r => r.status === 'Not Marked').length;

    // Elapsed scheduled classes up to today
    const elapsedRecords = selectedStudentRecords.filter(r => r.date <= todayStr && r.status !== 'Not Marked');
    const elapsedCount = elapsedRecords.length;

    // Attendance Formula: (Present + Late) / (Elapsed Marked Classes or Total Scheduled if all marked)
    const baseCount = elapsedCount > 0 ? elapsedCount : totalScheduled || 1;
    const effectivePresent = present + late;
    const attendancePercent = Math.min(
      100,
      Math.round((effectivePresent / baseCount) * 100)
    );

    const isEligibleForCertificate = attendancePercent >= 80;

    return {
      totalScheduled,
      present,
      absent,
      permission,
      late,
      notMarked,
      attendancePercent,
      isEligibleForCertificate
    };
  }, [selectedStudentRecords]);

  // ----------------------------------------------------
  // ACTION HANDLERS
  // ----------------------------------------------------
  const handleUpdateRecordStatus = (
    record: AttendanceRecord,
    newStatus: AttendanceStatus,
    reason?: PermissionReason,
    note?: string,
    skipOffScheduleCheck: boolean = false
  ) => {
    if (!isAuthorizedStaff) {
      alert(
        'Unauthorized: Students and non-staff members cannot modify official attendance records.'
      );
      return;
    }

    // Check if strict marking mode is enabled and if date is off-schedule
    if (strictMarkingMode && !skipOffScheduleCheck && newStatus !== 'Not Marked') {
      const studentObj = allRegisteredStudents.find(
        s => s.id === record.studentId || (s.fullName && s.fullName.toLowerCase().trim() === record.studentName.toLowerCase().trim())
      );
      const studentDays = parseScheduleDaysFromStudent(studentObj || record);
      const recordDayOfWeek = record.dayOfWeek || DAY_NAMES[new Date(record.date).getDay()] || 'Monday';
      const isScheduledDay = studentDays.some(
        d => d.toLowerCase() === recordDayOfWeek.toLowerCase()
      );

      if (!isScheduledDay) {
        setOffScheduleTarget({ record, attemptedStatus: newStatus });
        setOffScheduleModalOpen(true);
        return;
      }
    }

    const prevStatus = record.status;

    // Update records state
    setAttendanceRecords(prev =>
      prev.map(r =>
        r.id === record.id
          ? {
              ...r,
              status: newStatus,
              permissionReason: reason || r.permissionReason,
              permissionNote: note || r.permissionNote,
              markedByUserId: currentUser?.id || 'staff-1',
              markedByName: currentUser?.fullName || 'Registration Staff',
              markedByRole: currentUser?.role || 'registration_staff',
              updatedAt: new Date().toISOString()
            }
          : r
      )
    );

    // Create Audit Log
    const newLog: AttendanceAuditLog = {
      id: `AUD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      attendanceId: record.id,
      studentId: record.studentId,
      studentName: record.studentName,
      date: record.date,
      previousStatus: prevStatus,
      newStatus: newStatus,
      changedByUserId: currentUser?.id || 'staff-1',
      changedByName: currentUser?.fullName || 'Registration Staff',
      changedByRole: currentUser?.role || 'registration_staff',
      timestamp: new Date().toISOString(),
      reason: note || (reason ? `Permission: ${reason}` : 'Official staff roll call')
    };

    setAuditLogs(prev => [newLog, ...prev]);

    // System audit log integration
    try {
      addAuditEntry(
        'Attendance Record Updated',
        'Attendance Operations',
        `Changed attendance for ${record.studentName} on ${record.date} from ${prevStatus} to ${newStatus}.`,
        currentUser?.fullName || 'Staff',
        currentUser?.email || 'staff@begena.com',
        currentUser?.role || 'registration_staff'
      );
    } catch (e) {
      console.error(e);
    }
  };

  const handleBulkMarkDaily = (status: AttendanceStatus) => {
    if (!isAuthorizedStaff) {
      alert('Unauthorized action.');
      return;
    }

    if (filteredDailyRecords.length === 0) {
      alert('No student records found for the selected date and filters.');
      return;
    }

    const nowIso = new Date().toISOString();
    const updatedRecordIds = new Set(filteredDailyRecords.map(r => r.id));

    setAttendanceRecords(prev =>
      prev.map(r => {
        if (updatedRecordIds.has(r.id)) {
          return {
            ...r,
            status: status,
            markedByUserId: currentUser?.id || 'staff-1',
            markedByName: currentUser?.fullName || 'Registration Staff',
            markedByRole: currentUser?.role || 'registration_staff',
            updatedAt: nowIso
          };
        }
        return r;
      })
    );

    // Create bulk audit entry
    const bulkLog: AttendanceAuditLog = {
      id: `AUD-BULK-${Date.now()}`,
      attendanceId: `BULK-${selectedDate}`,
      studentId: 'ALL-FILTERED',
      studentName: `Bulk ${filteredDailyRecords.length} Students`,
      date: selectedDate,
      previousStatus: 'Not Marked',
      newStatus: status,
      changedByUserId: currentUser?.id || 'staff-1',
      changedByName: currentUser?.fullName || 'Registration Staff',
      changedByRole: currentUser?.role || 'registration_staff',
      timestamp: nowIso,
      reason: `Bulk marked ${status} for ${filteredDailyRecords.length} students on ${selectedDate}`
    };

    setAuditLogs(prev => [bulkLog, ...prev]);
  };

  // Open Permission Modal
  const handleOpenPermissionModal = (record: AttendanceRecord) => {
    setPermissionRecordTarget(record);
    setSelectedPermissionReason('Medical Appointment');
    setPermissionNote('');
    setPermissionModalOpen(true);
  };

  const handleConfirmPermission = () => {
    if (!permissionRecordTarget) return;
    handleUpdateRecordStatus(
      permissionRecordTarget,
      'Permission',
      selectedPermissionReason,
      permissionNote
    );
    setPermissionModalOpen(false);
    setPermissionRecordTarget(null);
  };

  // Open Edit Modal for Audit Reason
  const handleOpenEditModal = (record: AttendanceRecord) => {
    setEditRecordTarget(record);
    setEditTargetStatus(record.status === 'Not Marked' ? 'Present' : record.status);
    setEditReason('');
    setEditModalOpen(true);
  };

  const handleConfirmEditRecord = () => {
    if (!editRecordTarget) return;
    if (!editReason.trim()) {
      alert('Audit Reason is required when modifying historical attendance records.');
      return;
    }
    handleUpdateRecordStatus(
      editRecordTarget,
      editTargetStatus,
      undefined,
      editReason
    );
    setEditModalOpen(false);
    setEditRecordTarget(null);
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* AUTHORIZED STAFF BADGE & HEADER */}
      <div className="bg-[#2B2B2B] text-white p-6 sm:p-8 rounded-3xl relative overflow-hidden shadow-xl border border-amber-950/40">
        <div className="relative z-10 flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-[#E89B52]/20 border border-[#E89B52]/40 text-[#E89B52] rounded-full text-[10px] font-mono uppercase font-bold tracking-wider">
                STAFF ATTENDANCE CONTROL ENGINE
              </span>
              <span className="px-2.5 py-0.5 bg-green-900/60 text-green-300 border border-green-700/50 rounded-full text-[10px] font-mono font-bold flex items-center gap-1">
                <ShieldCheck size={12} />
                REAL-TIME PERSISTENCE
              </span>
            </div>
            <h1 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">
              ATTENDANCE REGISTER & SCHEDULER
            </h1>
            <p className="text-xs text-amber-200/80 max-w-2xl leading-relaxed">
              Official, staff-controlled attendance record system automatically generated upon student course enrollment. Students cannot self-mark attendance.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/15 text-xs text-amber-100 flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-[#E89B52] flex items-center justify-center font-black text-white font-mono text-sm shrink-0">
              {currentUser?.fullName?.charAt(0) || 'S'}
            </div>
            <div>
              <span className="text-[10px] font-mono text-amber-300/80 uppercase block">Active Operator</span>
              <span className="font-bold block text-white text-sm">{currentUser?.fullName || 'Registration Staff'}</span>
              <span className="text-[10px] text-amber-200/80 uppercase font-mono">
                Role: {currentUser?.role?.replace('_', ' ') || 'Staff'} • Branch: {selectedBranch}
              </span>
            </div>
          </div>
        </div>
      </div>

      {!isAuthorizedStaff && (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-center gap-3 text-amber-900 text-xs">
          <AlertTriangle className="text-amber-600 shrink-0" size={20} />
          <div>
            <span className="font-bold block text-sm">Read-Only Student & Teacher View</span>
            <span>You are viewing attendance in read-only mode. Attendance can only be recorded or modified by authorized Registration Staff, Accountants, and Admins.</span>
          </div>
        </div>
      )}

      {/* QUICK SUB-NAVIGATION */}
      <div className="bg-white border border-[#E7DED1] p-2 rounded-2xl shadow-2xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('daily')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'daily'
                ? 'bg-[#E89B52] text-white shadow-xs'
                : 'bg-[#FAF6EF] text-gray-700 hover:bg-[#FAF6EF]/80'
            }`}
          >
            <Calendar size={14} />
            <span>Daily Roll Call</span>
            <span className="ml-1 px-1.5 py-0.2 bg-white/20 rounded font-mono text-[10px]">
              {filteredDailyRecords.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('student-detail')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'student-detail'
                ? 'bg-[#E89B52] text-white shadow-xs'
                : 'bg-[#FAF6EF] text-gray-700 hover:bg-[#FAF6EF]/80'
            }`}
          >
            <UserCheck size={14} />
            <span>Student Schedule Detail</span>
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'audit'
                ? 'bg-[#E89B52] text-white shadow-xs'
                : 'bg-[#FAF6EF] text-gray-700 hover:bg-[#FAF6EF]/80'
            }`}
          >
            <History size={14} />
            <span>Audit History Trail</span>
            <span className="ml-1 px-1.5 py-0.2 bg-white/20 rounded font-mono text-[10px]">
              {auditLogs.length}
            </span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSettingsModalOpen(true)}
            className="px-3.5 py-2 bg-[#E89B52] hover:bg-[#D88A42] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs transition"
          >
            <Settings size={14} />
            <span>Attendance Settings</span>
          </button>

          <button
            onClick={() => window.print()}
            className="px-3 py-2 bg-[#FAF6EF] hover:bg-[#E7DED1] border border-[#E7DED1] text-gray-700 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <Printer size={14} />
            <span>Print Register</span>
          </button>
        </div>
      </div>

      {/* TAB 1: DAILY ROLL CALL */}
      {activeTab === 'daily' && (
        <div className="space-y-4">
          {/* FILTER CONTROLS BAR */}
          <div className="bg-white border border-[#E7DED1] p-5 rounded-2xl shadow-2xs space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Filter className="text-[#E89B52]" size={18} />
                <h3 className="font-display font-black text-sm uppercase tracking-wider text-gray-900">
                  Daily Attendance Filters & Selection
                </h3>
              </div>

              {isAuthorizedStaff && (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-mono font-bold text-gray-400 uppercase">
                    Bulk Actions:
                  </span>
                  <button
                    onClick={() => handleBulkMarkDaily('Present')}
                    className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1"
                  >
                    <CheckCircle2 size={12} /> Mark All Present
                  </button>
                  <button
                    onClick={() => handleBulkMarkDaily('Absent')}
                    className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1"
                  >
                    <XCircle size={12} /> Mark All Absent
                  </button>
                </div>
              )}
            </div>

            {/* SCHEDULE DAY FILTER SETTING CONTROL BAR */}
            <div className="bg-[#FAF6EF] border border-[#E7DED1] p-3.5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#E89B52]/10 border border-[#E89B52]/30 text-[#E89B52] flex items-center justify-center shrink-0 font-bold">
                  <Filter size={16} />
                </div>
                <div>
                  <span className="font-bold text-gray-900 block text-xs flex items-center gap-1.5">
                    ATTENDANCE SCHEDULE FILTERING SETTING
                    {filterByScheduleDays ? (
                      <span className="px-2 py-0.2 bg-green-100 text-green-800 border border-green-300 rounded font-mono text-[9px]">
                        ACTIVE: {DAY_NAMES[new Date(selectedDate).getDay()]} SCHEDULED DAYS ONLY
                      </span>
                    ) : (
                      <span className="px-2 py-0.2 bg-gray-200 text-gray-800 border border-gray-300 rounded font-mono text-[9px]">
                        WHOLE MASTER ROSTER (ALL STUDENTS)
                      </span>
                    )}
                  </span>
                  <p className="text-[11px] text-gray-600">
                    {filterByScheduleDays
                      ? `Showing only students registered for classes on ${DAY_NAMES[new Date(selectedDate).getDay()] || 'today'} based on their registration form. Unscheduled students are filtered out.`
                      : `Showing all registered students regardless of their chosen days.`}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0 bg-white p-1 rounded-xl border border-[#E7DED1] shadow-2xs">
                <button
                  type="button"
                  onClick={() => setFilterByScheduleDays(true)}
                  className={`px-3 py-1.5 rounded-lg font-bold text-[11px] transition flex items-center gap-1.5 cursor-pointer ${
                    filterByScheduleDays
                      ? 'bg-[#E89B52] text-white shadow-2xs'
                      : 'text-gray-600 hover:text-gray-900 bg-transparent'
                  }`}
                >
                  <Calendar size={13} />
                  <span>Scheduled Days Only</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFilterByScheduleDays(false)}
                  className={`px-3 py-1.5 rounded-lg font-bold text-[11px] transition flex items-center gap-1.5 cursor-pointer ${
                    !filterByScheduleDays
                      ? 'bg-[#2B2B2B] text-white shadow-2xs'
                      : 'text-gray-600 hover:text-gray-900 bg-transparent'
                  }`}
                >
                  <BookOpen size={13} />
                  <span>Show Whole Attendance</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
              <div>
                <label className="block font-bold text-gray-600 mb-1 uppercase text-[10px] font-mono">
                  Session Date *
                </label>
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={e => setSelectedDate(e.target.value)}
                  className="w-full bg-[#FAF6EF]"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-600 mb-1 uppercase text-[10px] font-mono">
                  Branch Location
                </label>
                <select
                  value={selectedBranch}
                  onChange={e => setSelectedBranch(e.target.value)}
                  className="w-full p-2.5 border border-[#E7DED1] rounded-xl bg-white font-bold text-xs"
                >
                  <option value="All">All Locations</option>
                  <option value="Hawassa main Branch">Hawassa main Branch (Center Point Tower)</option>
                  <option value="Online">Online / Virtual Gate</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-600 mb-1 uppercase text-[10px] font-mono">
                  Instrument / Course
                </label>
                <select
                  value={selectedCourse}
                  onChange={e => setSelectedCourse(e.target.value)}
                  className="w-full p-2.5 border border-[#E7DED1] rounded-xl bg-white font-bold text-xs"
                >
                  <option value="All">All Courses</option>
                  <option value="Begena">Begena</option>
                  <option value="Krar">Krar</option>
                  <option value="Masenqo">Masenqo</option>
                  <option value="Washint">Washint</option>
                  <option value="Vocal">Vocal</option>
                  <option value="Kebero">Kebero</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-600 mb-1 uppercase text-[10px] font-mono">
                  Teacher
                </label>
                <select
                  value={selectedTeacher}
                  onChange={e => setSelectedTeacher(e.target.value)}
                  className="w-full p-2.5 border border-[#E7DED1] rounded-xl bg-white font-bold text-xs"
                >
                  <option value="All">All Teachers</option>
                  <option value="Bruk">Lique Mezemer Bruk</option>
                  <option value="Samuel">Teacher Samuel</option>
                  <option value="Tigist">Teacher Tigist</option>
                  <option value="Bruk">Teacher Bruk</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-600 mb-1 uppercase text-[10px] font-mono">
                  Search Student
                </label>
                <div className="relative">
                  <Search
                    size={14}
                    className="absolute left-3 top-3 text-gray-400"
                  />
                  <Input
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search name or ID..."
                    className="pl-8 w-full"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* DAILY ROLL CALL TABLE */}
          <div className="bg-white border border-[#E7DED1] rounded-2xl overflow-hidden shadow-2xs">
            <div className="p-4 bg-[#FAF6EF] border-b border-[#E7DED1] flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 font-bold text-gray-800">
                <Calendar className="text-[#E89B52]" size={16} />
                <span>
                  Expected Classes for {selectedDate} ({DAY_NAMES[new Date(selectedDate).getDay()]})
                </span>
              </div>
              <span className="font-mono text-[10px] font-bold text-[#E89B52] bg-amber-100/60 px-2.5 py-1 rounded-md border border-amber-200">
                {filteredDailyRecords.length} Scheduled Sessions Found
              </span>
            </div>

            {filteredDailyRecords.length === 0 ? (
              <div className="p-12 text-center space-y-3">
                <Calendar className="mx-auto text-gray-300" size={48} />
                <h4 className="font-display font-black text-gray-700 uppercase">
                  No Scheduled Classes for this Date / Filter
                </h4>
                <p className="text-xs text-gray-500 max-w-md mx-auto">
                  Either no student enrollments are scheduled on this specific day of the week ({DAY_NAMES[new Date(selectedDate).getDay()]}), or your filters hid all matching records.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF6EF]/60 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-[#E7DED1]">
                    <tr>
                      <th className="p-3.5">Student Info</th>
                      <th className="p-3.5">Course & Level</th>
                      <th className="p-3.5">Branch & Mode</th>
                      <th className="p-3.5">Class Time & Teacher</th>
                      <th className="p-3.5">Current Status</th>
                      <th className="p-3.5 text-center">Staff Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-600">
                    {filteredDailyRecords.map(rec => (
                      <tr
                        key={rec.id}
                        className="hover:bg-[#FAF6EF]/30 transition-colors"
                      >
                        <td className="p-3.5">
                          <div className="font-bold text-gray-900">{rec.studentName}</div>
                          <div className="font-mono text-[10px] text-[#E89B52]">
                            ID: {rec.studentId}
                          </div>
                          <div className="flex items-center gap-1 mt-1 flex-wrap">
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-50 text-amber-900 border border-amber-200">
                              📅 {rec.scheduleDaysSummary || '3 Days/Wk'}
                            </span>
                            {rec.isScheduledToday ? (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-green-50 text-green-700 border border-green-200">
                                ✓ Scheduled Today
                              </span>
                            ) : (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-gray-100 text-gray-600 border border-gray-200">
                                Off-Schedule
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="p-3.5">
                          <span className="font-bold text-gray-800 block">
                            {rec.courseName}
                          </span>
                          <span className="text-[10px] text-gray-500">
                            {rec.level}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <span className="font-bold text-gray-800 block">
                            {rec.branch}
                          </span>
                          <span className="text-[10px] text-gray-500">
                            {rec.learningMode}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <span className="font-bold text-gray-800 block">
                            {rec.classTime}
                          </span>
                          <span className="text-[10px] text-gray-500">
                            {rec.teacherName}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold border inline-flex items-center gap-1 ${
                              rec.status === 'Present'
                                ? 'bg-green-50 text-green-700 border-green-200'
                                : rec.status === 'Absent'
                                ? 'bg-red-50 text-red-700 border-red-200'
                                : rec.status === 'Permission'
                                ? 'bg-amber-50 text-amber-800 border-amber-200'
                                : rec.status === 'Late'
                                ? 'bg-blue-50 text-blue-700 border-blue-200'
                                : 'bg-gray-100 text-gray-600 border-gray-200'
                            }`}
                          >
                            ● {rec.status}
                          </span>
                          {rec.permissionReason && (
                            <span className="block text-[9px] text-amber-700 font-mono mt-0.5">
                              ({rec.permissionReason})
                            </span>
                          )}
                        </td>
                        <td className="p-3.5 text-center">
                          {isAuthorizedStaff ? (
                            <div className="flex items-center justify-center gap-1">
                              <button
                                onClick={() => handleUpdateRecordStatus(rec, 'Present')}
                                className={`px-2 py-1 rounded text-[10px] font-bold transition cursor-pointer ${
                                  rec.status === 'Present'
                                    ? 'bg-green-600 text-white shadow-xs'
                                    : 'bg-green-50 hover:bg-green-100 text-green-700 border border-green-200'
                                }`}
                              >
                                Present
                              </button>
                              <button
                                onClick={() => handleUpdateRecordStatus(rec, 'Absent')}
                                className={`px-2 py-1 rounded text-[10px] font-bold transition cursor-pointer ${
                                  rec.status === 'Absent'
                                    ? 'bg-red-600 text-white shadow-xs'
                                    : 'bg-red-50 hover:bg-red-100 text-red-700 border border-red-200'
                                }`}
                              >
                                Absent
                              </button>
                              <button
                                onClick={() => handleOpenPermissionModal(rec)}
                                className={`px-2 py-1 rounded text-[10px] font-bold transition cursor-pointer ${
                                  rec.status === 'Permission'
                                    ? 'bg-amber-600 text-white shadow-xs'
                                    : 'bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200'
                                }`}
                              >
                                Permission
                              </button>
                              <button
                                onClick={() => handleUpdateRecordStatus(rec, 'Late')}
                                className={`px-2 py-1 rounded text-[10px] font-bold transition cursor-pointer ${
                                  rec.status === 'Late'
                                    ? 'bg-blue-600 text-white shadow-xs'
                                    : 'bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200'
                                }`}
                              >
                                Late
                              </button>
                            </div>
                          ) : (
                            <span className="text-[10px] font-mono text-gray-400">
                              Locked (Staff Only)
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: STUDENT SCHEDULE DETAIL VIEW */}
      {activeTab === 'student-detail' && (
        <div className="space-y-6">
          {/* SEARCH & SELECT STUDENT BAR */}
          <div className="bg-white border border-[#E7DED1] p-5 rounded-2xl shadow-2xs space-y-3">
            <label className="block font-bold text-[#E89B52] text-xs uppercase tracking-wider">
              Select Enrolled Student to View Complete Attendance Record
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                value={selectedStudentId || ''}
                onChange={e => setSelectedStudentId(e.target.value)}
                className="w-full p-3 border border-[#E7DED1] rounded-xl bg-white font-bold text-xs"
              >
                <option value="">-- Choose Student from Roster --</option>
                {allRegisteredStudents.map(st => (
                  <option key={st.id} value={st.id}>
                    {st.fullName} ({st.studentRegistrationId || st.id}) - {st.courseName || st.course} ({st.branch})
                  </option>
                ))}
              </select>

              <div className="flex items-center gap-2">
                <Input
                  placeholder="Or enter Student ID..."
                  value={selectedStudentId || ''}
                  onChange={e => setSelectedStudentId(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {selectedStudentObj ? (
            <div className="space-y-6">
              {/* STUDENT ATTENDANCE STATS OVERVIEW CARD */}
              <div className="bg-gradient-to-r from-[#FAF6EF] via-white to-[#FAF6EF] border border-[#E7DED1] p-6 rounded-2xl shadow-2xs space-y-4">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 border-b border-[#E7DED1] pb-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={
                        selectedStudentObj.photoUrl ||
                        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'
                      }
                      alt={selectedStudentObj.fullName}
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-[#E89B52]"
                    />
                    <div>
                      <h3 className="font-display font-black text-xl text-gray-900">
                        {selectedStudentObj.fullName}
                      </h3>
                      <p className="text-xs text-gray-600 font-mono">
                        ID: <strong className="text-[#E89B52]">{selectedStudentObj.id}</strong> • Enrolled: {selectedStudentObj.registeredAt?.split('T')[0]}
                      </p>
                      <p className="text-xs text-gray-500">
                        {selectedStudentObj.courseName} • {selectedStudentObj.branch} ({selectedStudentObj.learningMode})
                      </p>
                    </div>
                  </div>

                  {/* ATTENDANCE % GAUGE BADGE */}
                  <div className="bg-white p-4 rounded-2xl border border-[#E7DED1] text-center space-y-1 shadow-xs">
                    <span className="text-[10px] font-mono font-bold uppercase text-gray-400 block">
                      Official Attendance Rate
                    </span>
                    <span
                      className={`font-display font-black text-3xl ${
                        studentAttendanceStats.attendancePercent >= 80
                          ? 'text-green-700'
                          : 'text-red-600'
                      }`}
                    >
                      {studentAttendanceStats.attendancePercent}%
                    </span>
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded border block ${
                        studentAttendanceStats.isEligibleForCertificate
                          ? 'bg-green-50 text-green-700 border-green-200'
                          : 'bg-red-50 text-red-700 border-red-200'
                      }`}
                    >
                      {studentAttendanceStats.isEligibleForCertificate
                        ? 'Eligible for Certificate (>= 80%)'
                        : 'LOCKED - Below Required 80%'}
                    </span>
                  </div>
                </div>

                {/* COUNTER CARDS */}
                <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 text-center text-xs">
                  <div className="p-3 bg-white rounded-xl border border-gray-100">
                    <span className="text-gray-400 text-[10px] font-mono uppercase block font-bold">
                      Total Scheduled
                    </span>
                    <span className="font-display font-black text-lg text-gray-800">
                      {studentAttendanceStats.totalScheduled}
                    </span>
                  </div>
                  <div className="p-3 bg-green-50/50 rounded-xl border border-green-100">
                    <span className="text-green-800 text-[10px] font-mono uppercase block font-bold">
                      Present
                    </span>
                    <span className="font-display font-black text-lg text-green-700">
                      {studentAttendanceStats.present}
                    </span>
                  </div>
                  <div className="p-3 bg-red-50/50 rounded-xl border border-red-100">
                    <span className="text-red-800 text-[10px] font-mono uppercase block font-bold">
                      Absent
                    </span>
                    <span className="font-display font-black text-lg text-red-700">
                      {studentAttendanceStats.absent}
                    </span>
                  </div>
                  <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-100">
                    <span className="text-amber-900 text-[10px] font-mono uppercase block font-bold">
                      Permission
                    </span>
                    <span className="font-display font-black text-lg text-amber-800">
                      {studentAttendanceStats.permission}
                    </span>
                  </div>
                  <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100">
                    <span className="text-blue-800 text-[10px] font-mono uppercase block font-bold">
                      Late
                    </span>
                    <span className="font-display font-black text-lg text-blue-700">
                      {studentAttendanceStats.late}
                    </span>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                    <span className="text-gray-500 text-[10px] font-mono uppercase block font-bold">
                      Not Marked
                    </span>
                    <span className="font-display font-black text-lg text-gray-600">
                      {studentAttendanceStats.notMarked}
                    </span>
                  </div>
                </div>
              </div>

              {/* STUDENT REGISTRATION SCHEDULE BANNER & FILTER TOGGLE */}
              <div className="bg-[#FAF6EF] border border-[#E7DED1] p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#E89B52]/10 border border-[#E89B52]/30 text-[#E89B52] flex items-center justify-center font-bold text-lg shrink-0">
                    📅
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase font-bold text-[#E89B52]">Chosen Registration Schedule</span>
                    <h4 className="font-display font-black text-sm text-gray-900">
                      {formatScheduleDaysSummary(selectedStudentScheduleDays)}
                    </h4>
                    <p className="text-[11px] text-gray-600">
                      Chosen Days: <strong>{selectedStudentScheduleDays.join(', ')}</strong> • Attendance is recorded according to student's chosen schedule.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-[#E7DED1] shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setDetailFilterScheduledOnly(true)}
                    className={`px-3 py-1.5 rounded-lg font-bold text-[11px] transition flex items-center gap-1.5 cursor-pointer ${
                      detailFilterScheduledOnly
                        ? 'bg-[#E89B52] text-white shadow-2xs'
                        : 'text-gray-600 hover:text-gray-900 bg-transparent'
                    }`}
                  >
                    <span>Scheduled Days Only</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDetailFilterScheduledOnly(false)}
                    className={`px-3 py-1.5 rounded-lg font-bold text-[11px] transition flex items-center gap-1.5 cursor-pointer ${
                      !detailFilterScheduledOnly
                        ? 'bg-[#2B2B2B] text-white shadow-2xs'
                        : 'text-gray-600 hover:text-gray-900 bg-transparent'
                    }`}
                  >
                    <span>Show Whole Attendance</span>
                  </button>
                </div>
              </div>

              {/* FULL SCHEDULED SESSIONS MATRIX */}
              <div className="bg-white border border-[#E7DED1] rounded-2xl p-6 shadow-2xs space-y-4">
                <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                  <h4 className="font-display font-black text-sm uppercase text-gray-900">
                    Generated Class Sessions Schedule ({selectedStudentRecords.length} Sessions)
                  </h4>
                  <span className="text-xs text-gray-500">
                    Click any session date to edit status or view details
                  </span>
                </div>

                <div className="border border-gray-100 rounded-xl overflow-x-auto text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-[#FAF6EF] text-[10px] font-bold text-gray-400 uppercase border-b border-gray-100">
                      <tr>
                        <th className="p-3">Session Date</th>
                        <th className="p-3">Day of Week</th>
                        <th className="p-3">Class Time</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">Permission Reason / Note</th>
                        <th className="p-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-gray-600">
                      {selectedStudentRecords.map((rec, idx) => (
                        <tr key={rec.id} className="hover:bg-[#FAF6EF]/30">
                          <td className="p-3 font-mono font-bold text-gray-900">
                            #{idx + 1} • {rec.date}
                          </td>
                          <td className="p-3 font-bold">{rec.dayOfWeek}</td>
                          <td className="p-3">{rec.classTime}</td>
                          <td className="p-3">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                                rec.status === 'Present'
                                  ? 'bg-green-50 text-green-700 border-green-200'
                                  : rec.status === 'Absent'
                                  ? 'bg-red-50 text-red-700 border-red-200'
                                  : rec.status === 'Permission'
                                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                                  : rec.status === 'Late'
                                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                                  : 'bg-gray-100 text-gray-600 border-gray-200'
                              }`}
                            >
                              ● {rec.status}
                            </span>
                          </td>
                          <td className="p-3">
                            {rec.permissionReason ? (
                              <span className="font-bold text-amber-900">
                                {rec.permissionReason}{' '}
                                {rec.permissionNote ? `- "${rec.permissionNote}"` : ''}
                              </span>
                            ) : rec.permissionNote ? (
                              <span>{rec.permissionNote}</span>
                            ) : (
                              <span className="text-gray-300">-</span>
                            )}
                          </td>
                          <td className="p-3 text-right">
                            {isAuthorizedStaff && (
                              <button
                                onClick={() => handleOpenEditModal(rec)}
                                className="px-2.5 py-1 bg-[#FAF6EF] hover:bg-[#E7DED1] text-gray-700 border border-[#E7DED1] rounded font-bold text-[10px] cursor-pointer"
                              >
                                Edit Session
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-[#E7DED1] p-12 rounded-2xl text-center space-y-3">
              <UserCheck className="mx-auto text-gray-300" size={48} />
              <h4 className="font-display font-black text-gray-700 uppercase">
                Select a Student to View Full Attendance Schedule
              </h4>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Choose any active student from the dropdown above to inspect their complete multi-month schedule, attendance history, and certificate eligibility.
              </p>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: AUDIT HISTORY TRAIL */}
      {activeTab === 'audit' && (
        <div className="bg-white border border-[#E7DED1] p-6 rounded-2xl shadow-2xs space-y-4">
          <div className="flex justify-between items-center border-b border-gray-100 pb-3">
            <div>
              <h3 className="font-display font-black text-sm uppercase text-gray-900">
                Official Attendance Audit Trail
              </h3>
              <p className="text-xs text-gray-500">
                Immutable log of all attendance status changes, permission recording, and staff modifications.
              </p>
            </div>
            <span className="font-mono text-xs font-bold text-[#E89B52]">
              {auditLogs.length} Log Entries
            </span>
          </div>

          <div className="border border-gray-100 rounded-xl overflow-x-auto text-xs">
            <table className="w-full text-left">
              <thead className="bg-[#FAF6EF] text-[10px] font-bold text-gray-400 uppercase border-b border-gray-100">
                <tr>
                  <th className="p-3">Log Timestamp</th>
                  <th className="p-3">Student Name</th>
                  <th className="p-3">Class Date</th>
                  <th className="p-3">Previous Status</th>
                  <th className="p-3">New Status</th>
                  <th className="p-3">Changed By</th>
                  <th className="p-3">Audit Reason / Note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-600">
                {auditLogs.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-gray-400">
                      No attendance audit logs recorded yet.
                    </td>
                  </tr>
                ) : (
                  auditLogs.map(log => (
                    <tr key={log.id} className="hover:bg-[#FAF6EF]/30">
                      <td className="p-3 font-mono text-[10px]">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="p-3 font-bold text-gray-900">
                        {log.studentName}
                      </td>
                      <td className="p-3 font-mono font-bold text-[#E89B52]">
                        {log.date}
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-gray-100 text-gray-600">
                          {log.previousStatus}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-green-100 text-green-800">
                          {log.newStatus}
                        </span>
                      </td>
                      <td className="p-3 font-bold">
                        {log.changedByName} ({log.changedByRole})
                      </td>
                      <td className="p-3 font-mono text-[10px]">
                        {log.reason || 'Staff Roll Call'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL 1: PERMISSION REASON ENTRY DIALOG */}
      {permissionModalOpen && permissionRecordTarget && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#E7DED1] rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-scaleIn">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h3 className="font-display font-black text-sm uppercase text-amber-900 flex items-center gap-2">
                <AlertCircle size={18} className="text-amber-600" />
                Record Student Attendance Permission
              </h3>
              <button
                onClick={() => setPermissionModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="text-xs space-y-1 bg-amber-50/60 p-3 rounded-xl border border-amber-200">
              <p>
                <strong>Student:</strong> {permissionRecordTarget.studentName} ({permissionRecordTarget.studentId})
              </p>
              <p>
                <strong>Class Date:</strong> {permissionRecordTarget.date} ({permissionRecordTarget.dayOfWeek})
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Select Permission Reason *
                </label>
                <select
                  value={selectedPermissionReason}
                  onChange={e =>
                    setSelectedPermissionReason(e.target.value as PermissionReason)
                  }
                  className="w-full p-2.5 border border-[#E7DED1] rounded-xl bg-white font-bold"
                >
                  <option value="Medical Appointment">Medical Appointment / Illness</option>
                  <option value="Family Emergency">Family Emergency</option>
                  <option value="Work Conflict">Work / School Exam Conflict</option>
                  <option value="Church Service">Church Service / Liturgical Fasting</option>
                  <option value="Travel / Out of Town">Travel / Out of Town</option>
                  <option value="Other">Other Reason</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Permission Details / Document Note
                </label>
                <Input
                  value={permissionNote}
                  onChange={e => setPermissionNote(e.target.value)}
                  placeholder="e.g. Doctor note provided to front desk..."
                  className="w-full"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                variant="secondary"
                className="flex-1"
                onClick={() => setPermissionModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                className="flex-1 bg-amber-600 hover:bg-amber-700 text-white"
                onClick={handleConfirmPermission}
              >
                Save Permission Record
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: HISTORICAL EDIT WITH REQUIRED AUDIT REASON */}
      {editModalOpen && editRecordTarget && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#E7DED1] rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-scaleIn">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h3 className="font-display font-black text-sm uppercase text-gray-900 flex items-center gap-2">
                <History size={18} className="text-[#E89B52]" />
                Modify Attendance & Audit Log
              </h3>
              <button
                onClick={() => setEditModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="text-xs space-y-1 bg-[#FAF6EF] p-3 rounded-xl border border-[#E7DED1]">
              <p>
                <strong>Student:</strong> {editRecordTarget.studentName} ({editRecordTarget.studentId})
              </p>
              <p>
                <strong>Date:</strong> {editRecordTarget.date} ({editRecordTarget.dayOfWeek})
              </p>
              <p>
                <strong>Current Status:</strong> {editRecordTarget.status}
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  New Status *
                </label>
                <select
                  value={editTargetStatus}
                  onChange={e =>
                    setEditTargetStatus(e.target.value as AttendanceStatus)
                  }
                  className="w-full p-2.5 border border-[#E7DED1] rounded-xl bg-white font-bold"
                >
                  <option value="Present">Present</option>
                  <option value="Absent">Absent</option>
                  <option value="Permission">Permission</option>
                  <option value="Late">Late</option>
                  <option value="Not Marked">Not Marked</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Audit Reason for Change (Required) *
                </label>
                <Input
                  value={editReason}
                  onChange={e => setEditReason(e.target.value)}
                  placeholder="e.g. Correcting front desk entry error..."
                  className="w-full"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                variant="secondary"
                className="flex-1"
                onClick={() => setEditModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                className="flex-1"
                onClick={handleConfirmEditRecord}
              >
                Confirm & Log Change
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: ATTENDANCE & SCHEDULE SETTINGS MODAL */}
      {settingsModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#E7DED1] rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl animate-scaleIn">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-[#E89B52]/10 text-[#E89B52] border border-[#E89B52]/30 flex items-center justify-center font-bold">
                  <Settings size={18} />
                </div>
                <div>
                  <h3 className="font-display font-black text-sm uppercase text-gray-900">
                    Attendance Policy & View Settings
                  </h3>
                  <p className="text-[11px] text-gray-500">
                    Configure staff roll call rules and registration day restrictions.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSettingsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer p-1"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* SETTING 1: Daily Roll Call Filter Mode */}
              <div className="bg-[#FAF6EF] p-4 rounded-2xl border border-[#E7DED1] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-900 uppercase text-[11px] flex items-center gap-1.5">
                    <Calendar size={14} className="text-[#E89B52]" />
                    1. Daily Roster Filter Mode
                  </span>
                  <span className="px-2 py-0.5 rounded font-mono text-[9px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
                    {filterByScheduleDays ? 'Scheduled Days Only' : 'Whole Master Roster'}
                  </span>
                </div>
                <p className="text-[11px] text-gray-600 leading-relaxed">
                  When enabled, staff daily roll call lists only students who selected the current day of the week on their registration form (e.g. 3 days/week).
                </p>
                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setFilterByScheduleDays(true)}
                    className={`flex-1 py-2 rounded-xl font-bold transition text-xs flex items-center justify-center gap-1.5 cursor-pointer ${
                      filterByScheduleDays
                        ? 'bg-[#E89B52] text-white shadow-xs'
                        : 'bg-white text-gray-700 border border-[#E7DED1]'
                    }`}
                  >
                    <CheckCircle2 size={13} />
                    <span>Registered Days Only</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterByScheduleDays(false)}
                    className={`flex-1 py-2 rounded-xl font-bold transition text-xs flex items-center justify-center gap-1.5 cursor-pointer ${
                      !filterByScheduleDays
                        ? 'bg-[#2B2B2B] text-white shadow-xs'
                        : 'bg-white text-gray-700 border border-[#E7DED1]'
                    }`}
                  >
                    <BookOpen size={13} />
                    <span>Show Whole Roster</span>
                  </button>
                </div>
              </div>

              {/* SETTING 2: Strict Attendance Marking Restriction */}
              <div className="bg-[#FAF6EF] p-4 rounded-2xl border border-[#E7DED1] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-900 uppercase text-[11px] flex items-center gap-1.5">
                    <ShieldCheck size={14} className="text-[#E89B52]" />
                    2. Attendance Marking Enforcement
                  </span>
                  <span className={`px-2 py-0.5 rounded font-mono text-[9px] font-bold border ${
                    strictMarkingMode ? 'bg-green-100 text-green-800 border-green-300' : 'bg-gray-100 text-gray-700 border-gray-300'
                  }`}>
                    {strictMarkingMode ? 'Strict Registered Days' : 'Flexible / Override'}
                  </span>
                </div>
                <p className="text-[11px] text-gray-600 leading-relaxed">
                  Controls whether staff can give attendance on days outside the student's registered schedule (e.g. giving Tuesday attendance to a Mon/Wed/Fri student).
                </p>
                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setStrictMarkingMode(true)}
                    className={`flex-1 py-2 rounded-xl font-bold transition text-xs flex items-center justify-center gap-1.5 cursor-pointer ${
                      strictMarkingMode
                        ? 'bg-green-700 text-white shadow-xs'
                        : 'bg-white text-gray-700 border border-[#E7DED1]'
                    }`}
                  >
                    <ShieldCheck size={13} />
                    <span>Strict (Chosen Days Only)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setStrictMarkingMode(false)}
                    className={`flex-1 py-2 rounded-xl font-bold transition text-xs flex items-center justify-center gap-1.5 cursor-pointer ${
                      !strictMarkingMode
                        ? 'bg-[#2B2B2B] text-white shadow-xs'
                        : 'bg-white text-gray-700 border border-[#E7DED1]'
                    }`}
                  >
                    <Sliders size={13} />
                    <span>Flexible / Allow Any Day</span>
                  </button>
                </div>
              </div>

              {/* SETTING 3: Student Detail History Mode */}
              <div className="bg-[#FAF6EF] p-4 rounded-2xl border border-[#E7DED1] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-900 uppercase text-[11px] flex items-center gap-1.5">
                    <UserCheck size={14} className="text-[#E89B52]" />
                    3. Student Detail Attendance Matrix View
                  </span>
                  <span className="px-2 py-0.5 rounded font-mono text-[9px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
                    {detailFilterScheduledOnly ? 'Chosen Days Only' : 'Whole Calendar'}
                  </span>
                </div>
                <p className="text-[11px] text-gray-600 leading-relaxed">
                  Determines if student schedule history displays only their 3 registration days or the complete weekly calendar matrix.
                </p>
                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setDetailFilterScheduledOnly(true)}
                    className={`flex-1 py-2 rounded-xl font-bold transition text-xs flex items-center justify-center gap-1.5 cursor-pointer ${
                      detailFilterScheduledOnly
                        ? 'bg-[#E89B52] text-white shadow-xs'
                        : 'bg-white text-gray-700 border border-[#E7DED1]'
                    }`}
                  >
                    <CheckSquare size={13} />
                    <span>Chosen Days Only</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDetailFilterScheduledOnly(false)}
                    className={`flex-1 py-2 rounded-xl font-bold transition text-xs flex items-center justify-center gap-1.5 cursor-pointer ${
                      !detailFilterScheduledOnly
                        ? 'bg-[#2B2B2B] text-white shadow-xs'
                        : 'bg-white text-gray-700 border border-[#E7DED1]'
                    }`}
                  >
                    <Calendar size={13} />
                    <span>Whole Attendance Matrix</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-gray-100 flex justify-end">
              <Button
                variant="primary"
                onClick={() => setSettingsModalOpen(false)}
                className="w-full sm:w-auto"
              >
                Save & Apply Attendance Settings
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: OFF-SCHEDULE ATTENDANCE WARNING INTERCEPT */}
      {offScheduleModalOpen && offScheduleTarget && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#E7DED1] rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-scaleIn">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h3 className="font-display font-black text-sm uppercase text-amber-900 flex items-center gap-2">
                <AlertTriangle size={18} className="text-amber-600" />
                Off-Schedule Attendance Alert
              </h3>
              <button
                onClick={() => {
                  setOffScheduleModalOpen(false);
                  setOffScheduleTarget(null);
                }}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-xs space-y-2 text-amber-900">
              <p>
                <strong>Student:</strong> {offScheduleTarget.record.studentName} ({offScheduleTarget.record.studentId})
              </p>
              <p>
                <strong>Selected Date:</strong> {offScheduleTarget.record.date} ({offScheduleTarget.record.dayOfWeek})
              </p>
              <p className="text-[11px] font-semibold text-amber-800">
                This student is registered for specific days on their registration form. Selected date ({offScheduleTarget.record.dayOfWeek}) is NOT in their chosen schedule.
              </p>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">
              Strict Attendance Policy is currently active. Would you like to record an off-schedule override, or switch settings to flexible whole-attendance mode?
            </p>

            <div className="space-y-2 pt-2">
              <Button
                variant="primary"
                className="w-full bg-[#E89B52] hover:bg-[#D88A42] text-white"
                onClick={() => {
                  if (offScheduleTarget) {
                    handleUpdateRecordStatus(
                      offScheduleTarget.record,
                      offScheduleTarget.attemptedStatus,
                      undefined,
                      'Off-schedule staff override',
                      true
                    );
                  }
                  setOffScheduleModalOpen(false);
                  setOffScheduleTarget(null);
                }}
              >
                Confirm Off-Schedule Entry ({offScheduleTarget.attemptedStatus})
              </Button>

              <Button
                variant="secondary"
                className="w-full bg-[#FAF6EF] border-[#E7DED1] text-gray-800 hover:bg-[#E7DED1]"
                onClick={() => {
                  setStrictMarkingMode(false);
                  if (offScheduleTarget) {
                    handleUpdateRecordStatus(
                      offScheduleTarget.record,
                      offScheduleTarget.attemptedStatus,
                      undefined,
                      'Marked after switching to flexible mode',
                      true
                    );
                  }
                  setOffScheduleModalOpen(false);
                  setOffScheduleTarget(null);
                }}
              >
                Switch Setting to Flexible Mode & Mark
              </Button>

              <Button
                variant="secondary"
                className="w-full border-gray-200 text-gray-500"
                onClick={() => {
                  setOffScheduleModalOpen(false);
                  setOffScheduleTarget(null);
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
