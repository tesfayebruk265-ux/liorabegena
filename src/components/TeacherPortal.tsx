import React, { useState, useEffect, useMemo } from 'react';
import {
  User, Users, BookOpen, Calendar, Clock, CheckCircle, CheckCircle2, AlertTriangle, AlertCircle,
  FileText, TrendingUp, MapPin, ChevronRight, Send, Plus, Filter, Check, X,
  Award, Bell, Search, BookCheck, Building, Activity, LogOut, HelpCircle,
  Eye, RefreshCw, Video, MessageSquare, Megaphone, CheckSquare, Sparkles, Sliders, ChevronDown,
  Lock, Edit3, Trash2, Layers, Globe, Phone, Mail, FileCheck, ArrowLeft, ExternalLink, ShieldAlert, Star,
  Compass, Unlock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Button, Input } from './InteractiveComponents';
import { ThemeToggle } from './ThemeToggle';
import { PageId, StudentEnrollment, UserRole } from '../types';
import {
  getAllCourseChapters,
  saveAllCourseChapters,
  getAllCourseLessons,
  saveAllCourseLessons,
  getAllAssignmentSubmissions,
  gradeAssignmentSubmission,
  addTeacherFeedback,
  calculateStudentProgress,
  getFeedbackForStudent,
  getVideoProgress,
  getStudentCompletedLessonIds,
  getChaptersForCourse,
  getLessonsForCourse,
  toggleLessonComplete,
  syncStudentProgressToEnrollment,
  getEvaluationsForStudent,
  addStudentProgressEvaluation,
  StudentProgressEvaluation
} from '../utils/courseLearningSync';
import {
  getMessagesForEnrollment,
  sendEnrollmentMessage,
  markMessagesAsReadForEnrollment,
  EnrollmentMessage
} from '../utils/enrollmentMessaging';
import {
  getCertificateByEnrollment,
  issueOfficialCertificate,
  getCertificateByCode,
  OfficialCertificate
} from '../utils/certificateVerification';
import {
  getStudentSelectionKey,
  resolveStudentSelection
} from '../utils/teacherStudentIntegration';

interface TeacherPortalProps {
  onNavigate: (page: PageId, params?: any) => void;
  lang: 'en' | 'am';
}

export interface TeacherChapter {
  id: string;
  courseId: string; // e.g. 'begena' or 'Begena Basic 1'
  title: string;
  description: string;
  order: number;
  status: 'Draft' | 'Published' | 'Unpublished';
}

export interface TeacherLesson {
  id: string;
  chapterId: string;
  courseId: string;
  title: string;
  description: string;
  durationText: string;
  videoUrl?: string;
  audioUrl?: string;
  pdfUrl?: string;
  notationSequence?: string;
  order: number;
  status: 'Draft' | 'Published' | 'Unpublished';
  isRequired: boolean;
  assignmentTitle?: string;
  assignmentInstructions?: string;
  assignmentDueDate?: string;
}

export interface StudentAssignmentSubmission {
  id: string;
  assignmentId: string;
  assignmentTitle: string;
  studentId: string;
  studentName: string;
  studentEmail?: string;
  courseName: string;
  submittedAt: string;
  submissionUrl?: string;
  notes?: string;
  status: 'Pending Review' | 'Graded' | 'Needs Resubmission';
  score?: number; // 0 - 100
  letterGrade?: string; // e.g. 'A', 'B', 'C'
  feedback?: string;
  rubricHandPos?: number;
  rubricTuning?: number;
  rubricAccuracy?: number;
  rubricRhythm?: number;
  rubricVocal?: number;
  gradedAt?: string;
  gradedByTeacherName?: string;
}

export interface TeacherActivity {
  id: string;
  action: string;
  details: string;
  timestamp: string;
}

export function TeacherPortal({ onNavigate, lang }: TeacherPortalProps) {
  const { currentUser, getAuthoritativeUser, addNotification, logout } = useAuth();
  const { students, teachers, enrollments, attendances, updateTeacherTelegramUsername } = useData();
  const [profileSyncTick, setProfileSyncTick] = useState(0);

  // ----------------------------------------------------
  // 1. TEACHER LOGIN & ROLE ACCESS VERIFICATION
  // ----------------------------------------------------
  const isAuthorizedRole = useMemo(() => {
    if (!currentUser) return false;
    const role = currentUser.role;
    return role === 'teacher' || role === 'admin' || role === 'super_admin' || role === 'founder';
  }, [currentUser]);

  // Find logged in teacher's profile in DataContext, or build from currentUser
  const teacherProfile = useMemo(() => {
    if (!currentUser) return null;
    const matched = teachers.find(t =>
      (t.email || '').toLowerCase() === (currentUser.email || '').toLowerCase() ||
      (t.id || '').toLowerCase() === (currentUser.id || '').toLowerCase() ||
      (t.fullName || '').toLowerCase() === (currentUser.fullName || '').toLowerCase()
    );

    if (matched) {
      return {
        ...matched,
        photo: currentUser.avatar || matched.photo,
        fullName: currentUser.fullName || matched.fullName
      };
    }

    // Fallback teacher profile constructed from currentUser
    return {
      id: currentUser.id || 't_current',
      email: currentUser.email || 'teacher@abelbegena.com',
      fullName: currentUser.fullName || 'Faculty Teacher',
      phone: currentUser.phone || '+251 911 000 000',
      photo: currentUser.avatar || '',
      specializations: [currentUser.enrolledInstrument || 'Begena'],
      branches: [currentUser.branch || 'Hawassa main Branch'],
      supportsOnline: true,
      supportsInPerson: true,
      capacity: 25,
      status: 'Active' as const,
      bio: 'Master instructor dedicated to preserving traditional Ethiopian musical heritage.',
      telegramUsername: currentUser.username || 'abel_begena'
    };
  }, [teachers, currentUser]);

  // Active Tab navigation state inside Teacher Portal
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'students' | 'classes' | 'courses' | 'assignments' | 'attendance' | 'schedule' | 'messages' | 'profile' | 'activity'
  >('dashboard');

  // Loading & error state helpers
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleTabChange = (tab: typeof activeTab) => {
    setIsLoading(true);
    setErrorMsg(null);
    setActiveTab(tab);
    setTimeout(() => setIsLoading(false), 200);
  };

  // ----------------------------------------------------
  // PERSISTENT DATA SYNC (courseLearningSync)
  // ----------------------------------------------------
  // Selected instrument filter for content management
  const [selectedManageInstrument, setSelectedManageInstrument] = useState<string>('Begena');

  // Chapters list
  const [chapters, setChapters] = useState<TeacherChapter[]>(() => {
    return getAllCourseChapters() as TeacherChapter[];
  });

  // Lessons list
  const [lessons, setLessons] = useState<TeacherLesson[]>(() => {
    return getAllCourseLessons() as TeacherLesson[];
  });

  // Submissions list
  const [submissions, setSubmissions] = useState<StudentAssignmentSubmission[]>(() => {
    return (getAllAssignmentSubmissions() as unknown) as StudentAssignmentSubmission[];
  });

  // Teacher Activity Registry
  const [activities, setActivities] = useState<TeacherActivity[]>(() => {
    try {
      const saved = localStorage.getItem('ab_teacher_activities_v2');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [
      { id: 'act_1', action: 'Syllabus Updated', details: 'Published Chapter 1 and Chapter 2 lessons', timestamp: 'Today' }
    ];
  });

  const logActivity = (action: string, details: string) => {
    const newAct: TeacherActivity = {
      id: `act_${Date.now()}`,
      action,
      details,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    const updated = [newAct, ...activities];
    setActivities(updated);
    try { localStorage.setItem('ab_teacher_activities_v2', JSON.stringify(updated)); } catch (e) {}
  };

  // Sync state to persistent storage for absolute continuity
  useEffect(() => {
    saveAllCourseChapters(chapters as any);
  }, [chapters]);

  useEffect(() => {
    saveAllCourseLessons(lessons as any);
  }, [lessons]);

  useEffect(() => {
    try {
      localStorage.setItem('ab_assignment_submissions_v1', JSON.stringify(submissions));
    } catch (e) {}
  }, [submissions]);

  // ----------------------------------------------------
  // 2. REAL ASSIGNED STUDENTS & COURSES FILTERING
  // ----------------------------------------------------
  // Filter enrollments strictly assigned to this teacher!
  const myAssignedEnrollments = useMemo(() => {
    if (!teacherProfile) return [];

    const tId = teacherProfile.id?.toLowerCase();
    const tEmail = teacherProfile.email?.toLowerCase();
    const tName = teacherProfile.fullName?.toLowerCase();

    const matched = enrollments.filter(e => {
      // Check assignment match strictly
      const matchId = e.assignedTeacherId && e.assignedTeacherId.toLowerCase() === tId;
      const matchEmail = e.assignedTeacherEmail && e.assignedTeacherEmail.toLowerCase() === tEmail;
      const matchName = e.assignedTeacherName && e.assignedTeacherName.toLowerCase() === tName;

      return matchId || matchEmail || matchName;
    });

    // Deduplicate enrollments by unique student identity
    const seen = new Set<string>();
    const deduplicated: StudentEnrollment[] = [];

    matched.forEach(e => {
      const key = (e.studentEmail || '').toLowerCase().trim() ||
                  (e.studentId || '').toLowerCase().trim() ||
                  (e.studentName || '').toLowerCase().trim() ||
                  e.id;
      if (key && !seen.has(key)) {
        seen.add(key);
        deduplicated.push(e);
      }
    });

    return deduplicated;
  }, [enrollments, teacherProfile]);

  // Calculate REAL progress for assigned students based on published required lessons & video watches
  const myStudentsList = useMemo(() => {
    const list = myAssignedEnrollments.map(enr => {
      const studentId = enr.studentId || enr.id;
      const inst = enr.instrument || 'Begena';
      const lvl = enr.level || 'Basic 1';

      const prog = calculateStudentProgress(studentId, inst, lvl);

      const calculatedProgress = prog.progressPercent;
      const completedLessonsCount = prog.completedRequiredLessonsCount;
      const totalRequiredLessonsCount = prog.totalPublishedRequiredLessonsCount;

      // Student's real attendance record count from DataContext attendances
      const studentAttendances = attendances.filter(a =>
        a.studentId === studentId ||
        (a.studentEmail && enr.studentEmail && a.studentEmail.toLowerCase().trim() === enr.studentEmail.toLowerCase().trim()) ||
        (a.studentName && enr.studentName && a.studentName.toLowerCase().trim() === enr.studentName.toLowerCase().trim())
      );
      const presentCount = studentAttendances.filter(a => a.status === 'Present').length;
      const absentCount = studentAttendances.filter(a => a.status === 'Absent').length;
      const lateCount = studentAttendances.filter(a => a.status === 'Late').length;

      const matchingStudent = students?.find(s => s.id === studentId || s.email?.toLowerCase() === (enr.studentEmail || '').toLowerCase());
      const authStudent = getAuthoritativeUser ? getAuthoritativeUser(enr.studentEmail || studentId) : undefined;
      const studentPhoto = authStudent?.avatar || (authStudent as any)?.photo || (matchingStudent as any)?.photoUrl || (matchingStudent as any)?.photo || (enr as any).studentPhoto || (enr as any).studentPhotoUrl || (enr as any).photoUrl || '';
      const studentName = authStudent?.fullName || enr.studentName;
      const studentRegistrationId = matchingStudent?.studentRegistrationId || (enr as any).studentRegistrationId || undefined;

      return {
        id: studentId,
        enrollmentId: enr.id,
        name: studentName,
        studentRegistrationId,
        email: enr.studentEmail,
        phone: authStudent?.phone || enr.studentPhone || '+251 900 000 000',
        photo: studentPhoto,
        course: enr.courseName || `${inst} ${lvl}`,
        instrument: inst,
        level: lvl,
        branch: enr.branch || 'Hawassa main Branch',
        mode: enr.learningMode || 'In-Person',
        status: enr.status || 'Active',
        paymentStatus: enr.paymentStatus || 'Approved',
        progress: calculatedProgress,
        completedLessonsCount,
        totalRequiredLessonsCount,
        completedVideosCount: prog.completedVideosCount,
        totalPublishedVideosCount: prog.totalPublishedVideosCount,
        submittedAssignmentsCount: prog.submittedAssignmentsCount,
        gradedAssignmentsCount: prog.gradedAssignmentsCount,
        completedChaptersCount: prog.completedChaptersCount,
        totalChaptersCount: prog.totalChaptersCount,
        lockedChaptersCount: prog.lockedChaptersCount,
        unlockedChaptersCount: prog.unlockedChaptersCount,
        currentChapterTitle: prog.currentChapter?.title || 'Chapter 1',
        currentLessonTitle: prog.currentLesson?.title || 'Lesson 1',
        lastActivityAt: prog.lastActivityAt,
        chaptersStatus: prog.chaptersStatus,
        isCertificateEligible: prog.isCertificateEligible,
        enrollmentDate: enr.enrollmentDate || '2026-07-01',
        scheduleDays: enr.scheduleDays || ['Monday', 'Wednesday', 'Friday'],
        classTime: enr.classTime || '10:00 AM - 12:00 PM',
        presentCount,
        absentCount,
        lateCount,
        lastActive: enr.lastActive || 'Today'
      };
    });

    // Safeguard deduplication by email/id/name
    const studentSeen = new Set<string>();
    return list.filter(st => {
      const key = (st.email || '').toLowerCase().trim() || (st.name || '').toLowerCase().trim() || st.id;
      if (!key || studentSeen.has(key)) return false;
      studentSeen.add(key);
      return true;
    });
  }, [myAssignedEnrollments, lessons, attendances, students, getAuthoritativeUser, profileSyncTick]);

  // Distinct Assigned Classes list
  const myAssignedClasses = useMemo(() => {
    const classMap = new Map<string, {
      id: string;
      courseName: string;
      instrument: string;
      level: string;
      branch: string;
      mode: 'In-Person' | 'Online' | 'Hybrid';
      scheduleDays: string[];
      classTime: string;
      studentsCount: number;
      students: typeof myStudentsList;
      meetLink?: string;
    }>();

    myStudentsList.forEach(st => {
      const key = `${st.course}_${st.branch}_${st.mode}`;
      if (!classMap.has(key)) {
        classMap.set(key, {
          id: `class_${key.replace(/\s+/g, '_')}`,
          courseName: st.course,
          instrument: st.instrument,
          level: st.level,
          branch: st.branch,
          mode: st.mode,
          scheduleDays: st.scheduleDays,
          classTime: st.classTime,
          studentsCount: 1,
          students: [st],
          meetLink: st.mode === 'Online' ? 'https://meet.google.com/ab-begena-live' : undefined
        });
      } else {
        const existing = classMap.get(key)!;
        existing.studentsCount += 1;
        existing.students.push(st);
      }
    });

    return Array.from(classMap.values());
  }, [myStudentsList]);

  // Determine Today's Classes based on current day of week
  const todayName = useMemo(() => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[new Date().getDay()];
  }, []);

  const todaysClasses = useMemo(() => {
    return myAssignedClasses.filter(cl =>
      cl.scheduleDays.some(d => d.toLowerCase() === todayName.toLowerCase())
    );
  }, [myAssignedClasses, todayName]);

  // Pending Tasks count
  const pendingReviewSubmissions = useMemo(() => {
    return submissions.filter(s => s.status === 'Pending Review');
  }, [submissions]);

  const draftLessons = useMemo(() => {
    return lessons.filter(l => l.status === 'Draft');
  }, [lessons]);

  // Selected Student for Profile Detail view
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [, setSelectedStudent] = useState<any>(null);
  const selectedStudent = useMemo(() => {
    return resolveStudentSelection(myStudentsList, selectedStudentId) || myStudentsList.find(s => s.id === selectedStudentId);
  }, [myStudentsList, selectedStudentId]);

  // Direct Teacher Feedback state
  const [directFeedbackText, setDirectFeedbackText] = useState('');
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

  const handleSendDirectFeedback = () => {
    if (!directFeedbackText.trim() || !selectedStudent) return;
    addTeacherFeedback(
      selectedStudent.id,
      selectedStudent.enrollmentId,
      teacherProfile?.id || 'teacher_01',
      teacherProfile?.fullName || 'Faculty Instructor',
      selectedStudent.course,
      directFeedbackText.trim(),
      'Practice Correction'
    );
    setFeedbackSuccess(true);
    setDirectFeedbackText('');
    setTimeout(() => setFeedbackSuccess(false), 3000);
  };

  // ----------------------------------------------------
  // ENHANCED STUDENT DETAIL SUB-TABS & MESSAGING
  // ----------------------------------------------------
  const [studentDetailSubTab, setStudentDetailSubTab] = useState<'journey' | 'evaluations' | 'attendance' | 'chat' | 'certificate' | 'notes'>('journey');
  const [studentMessages, setStudentMessages] = useState<EnrollmentMessage[]>([]);
  const [studentChatInput, setStudentChatInput] = useState('');
  const [studentPrivateNote, setStudentPrivateNote] = useState('');
  const [noteSavedNotice, setNoteSavedNotice] = useState(false);
  const [certIssuedNotice, setCertIssuedNotice] = useState(false);

  // Student Evaluation Form State
  const [evalTuning, setEvalTuning] = useState(5);
  const [evalRhythm, setEvalRhythm] = useState(4);
  const [evalTechnique, setEvalTechnique] = useState(4);
  const [evalPiece, setEvalPiece] = useState(4);
  const [evalProgressPct, setEvalProgressPct] = useState<number>(0);
  const [evalGrade, setEvalGrade] = useState('A');
  const [evalNotes, setEvalNotes] = useState('');
  const [evalSavedNotice, setEvalSavedNotice] = useState(false);
  const [evaluationsList, setEvaluationsList] = useState<StudentProgressEvaluation[]>([]);

  useEffect(() => {
    if (selectedStudent) {
      setEvalProgressPct(selectedStudent.progress || 0);
      setEvaluationsList(getEvaluationsForStudent(selectedStudent.id, selectedStudent.instrument || selectedStudent.course));
    }
  }, [selectedStudent]);

  useEffect(() => {
    const handleEvalUpdate = () => {
      if (selectedStudent) {
        setEvaluationsList(getEvaluationsForStudent(selectedStudent.id, selectedStudent.instrument || selectedStudent.course));
      }
    };
    window.addEventListener('ab_evaluations_updated', handleEvalUpdate);
    return () => window.removeEventListener('ab_evaluations_updated', handleEvalUpdate);
  }, [selectedStudent]);

  const handleSaveStudentEvaluation = () => {
    if (!selectedStudent || !teacherProfile) return;

    addStudentProgressEvaluation({
      studentId: selectedStudent.id,
      studentName: selectedStudent.name,
      enrollmentId: selectedStudent.enrollmentId,
      teacherId: teacherProfile.id || 'teacher_01',
      teacherName: teacherProfile.fullName || 'Faculty Instructor',
      courseId: selectedStudent.course?.toLowerCase() || selectedStudent.instrument?.toLowerCase() || 'begena',
      instrument: selectedStudent.instrument || selectedStudent.course || 'Begena',
      level: selectedStudent.level,
      tuningScore: evalTuning,
      rhythmScore: evalRhythm,
      techniqueScore: evalTechnique,
      pieceMasteryScore: evalPiece,
      overallProgressPercent: Number(evalProgressPct),
      grade: evalGrade,
      teacherNotes: evalNotes.trim() || 'Student is making consistent musical progress under faculty instruction.'
    });

    setEvalSavedNotice(true);
    setTimeout(() => setEvalSavedNotice(false), 3500);
    setEvalNotes('');
    setEvaluationsList(getEvaluationsForStudent(selectedStudent.id, selectedStudent.instrument || selectedStudent.course));
  };

  // Certificate Verification Lookup Modal State
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [lookupCodeInput, setLookupCodeInput] = useState('');
  const [lookupCertResult, setLookupCertResult] = useState<OfficialCertificate | null>(null);
  const [lookupCertError, setLookupCertError] = useState('');

  // Auto load messages & private notes when selectedStudent changes
  useEffect(() => {
    if (selectedStudent?.enrollmentId) {
      setStudentMessages(getMessagesForEnrollment(selectedStudent.enrollmentId));
      markMessagesAsReadForEnrollment(selectedStudent.enrollmentId, 'teacher');

      try {
        const saved = localStorage.getItem(`ab_teacher_note_${selectedStudent.enrollmentId}`);
        setStudentPrivateNote(saved || '');
      } catch (e) {
        setStudentPrivateNote('');
      }
    }
  }, [selectedStudent]);

  // Keep selectedStudent updated if profile or list changes
  useEffect(() => {
    if (selectedStudent) {
      const fresh = myStudentsList.find(s => s.id === selectedStudent.id || s.enrollmentId === selectedStudent.enrollmentId);
      if (fresh && (fresh.photo !== selectedStudent.photo || fresh.name !== selectedStudent.name || fresh.phone !== selectedStudent.phone)) {
        setSelectedStudent(fresh);
      }
    }
  }, [myStudentsList]);

  // Listen for live enrollment messages & profile updates dispatched across tabs/components
  useEffect(() => {
    const handleLiveMessage = () => {
      if (selectedStudent?.enrollmentId) {
        setStudentMessages(getMessagesForEnrollment(selectedStudent.enrollmentId));
      }
    };
    const handleProfileSync = () => {
      setProfileSyncTick(t => t + 1);
    };

    window.addEventListener('ab_enrollment_message_sent', handleLiveMessage);
    window.addEventListener('user-profile-updated', handleProfileSync);
    window.addEventListener('ab_students_updated', handleProfileSync);
    window.addEventListener('ab_enrollments_updated', handleProfileSync);
    window.addEventListener('storage', handleProfileSync);

    return () => {
      window.removeEventListener('ab_enrollment_message_sent', handleLiveMessage);
      window.removeEventListener('user-profile-updated', handleProfileSync);
      window.removeEventListener('ab_students_updated', handleProfileSync);
      window.removeEventListener('ab_enrollments_updated', handleProfileSync);
      window.removeEventListener('storage', handleProfileSync);
    };
  }, [selectedStudent]);

  const handleSendStudentChat = () => {
    if (!studentChatInput.trim() || !selectedStudent || !teacherProfile) return;
    const msgText = studentChatInput.trim();
    const msg = sendEnrollmentMessage({
      enrollmentId: selectedStudent.enrollmentId,
      studentId: selectedStudent.id,
      studentName: selectedStudent.name,
      teacherId: teacherProfile.id,
      teacherName: teacherProfile.fullName,
      senderId: teacherProfile.id,
      senderName: teacherProfile.fullName,
      senderRole: 'teacher',
      text: msgText
    });
    setStudentMessages(prev => [...prev, msg]);
    setStudentChatInput('');
    addNotification(`Direct message sent to student ${selectedStudent.name}`, 'feedback');
  };

  const handleSaveNote = () => {
    if (!selectedStudent?.enrollmentId) return;
    try {
      localStorage.setItem(`ab_teacher_note_${selectedStudent.enrollmentId}`, studentPrivateNote);
      setNoteSavedNotice(true);
      setTimeout(() => setNoteSavedNotice(false), 3000);
    } catch (e) {}
  };

  const handleIssueStudentCertificate = () => {
    if (!selectedStudent || !teacherProfile) return;
    const isEligible = (selectedStudent.progress || 0) >= 100;
    if (!isEligible) {
      alert(`Cannot issue certificate: ${selectedStudent.name} has only completed ${selectedStudent.progress || 0}% of the required course curriculum. 100% completion is mandatory.`);
      return;
    }
    issueOfficialCertificate({
      studentId: selectedStudent.id,
      studentName: selectedStudent.name,
      studentEmail: selectedStudent.email,
      enrollmentId: selectedStudent.enrollmentId,
      courseName: selectedStudent.course,
      instrument: selectedStudent.instrument,
      level: selectedStudent.level,
      issuedByTeacherId: teacherProfile.id,
      issuedByTeacherName: teacherProfile.fullName,
      branch: selectedStudent.branch
    });
    setCertIssuedNotice(true);
    logActivity('Certificate Issued', `Issued official verified certificate to ${selectedStudent.name} (${selectedStudent.course})`);
    setTimeout(() => setCertIssuedNotice(false), 4000);
  };

  const handleLookupCertificate = () => {
    setLookupCertError('');
    setLookupCertResult(null);
    if (!lookupCodeInput.trim()) return;

    const res = getCertificateByCode(lookupCodeInput.trim());
    if (res) {
      setLookupCertResult(res);
    } else {
      setLookupCertError(`No valid official certificate found for code "${lookupCodeInput.trim().toUpperCase()}".`);
    }
  };

  // Selected Class for Class Detail view
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const selectedClass = useMemo(() => {
    return myAssignedClasses.find(c => c.id === selectedClassId);
  }, [myAssignedClasses, selectedClassId]);

  // Search and Filters for Students
  const [studentSearch, setStudentSearch] = useState('');
  const [studentFilterMode, setStudentFilterMode] = useState('All');
  const [studentFilterStatus, setStudentFilterStatus] = useState('All');

  const filteredStudents = useMemo(() => {
    return myStudentsList.filter(s => {
      const matchesSearch = s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
        s.id.toLowerCase().includes(studentSearch.toLowerCase()) ||
        s.course.toLowerCase().includes(studentSearch.toLowerCase());
      const matchesMode = studentFilterMode === 'All' || s.mode === studentFilterMode;
      const matchesStatus = studentFilterStatus === 'All' || s.status === studentFilterStatus;
      return matchesSearch && matchesMode && matchesStatus;
    });
  }, [myStudentsList, studentSearch, studentFilterMode, studentFilterStatus]);

  // ----------------------------------------------------
  // 3. COURSE CONTENT MANAGEMENT (Chapters, Lessons, Roadmap)
  // ----------------------------------------------------
  const [newChapterTitle, setNewChapterTitle] = useState('');
  const [newChapterDesc, setNewChapterDesc] = useState('');
  const [isCreatingChapter, setIsCreatingChapter] = useState(false);

  const handleCreateChapter = () => {
    if (!newChapterTitle.trim()) {
      setErrorMsg('Please specify a Chapter Title.');
      return;
    }
    const newChap: TeacherChapter = {
      id: `ch_${Date.now()}`,
      courseId: 'begena',
      title: newChapterTitle.trim(),
      description: newChapterDesc.trim() || 'No description added.',
      order: chapters.length + 1,
      status: 'Draft'
    };
    setChapters([...chapters, newChap]);
    logActivity('Chapter Created', `Created draft chapter: ${newChapterTitle}`);
    addNotification('Chapter Added', `New chapter "${newChapterTitle}" created in draft mode.`, 'lesson');
    setNewChapterTitle('');
    setNewChapterDesc('');
    setIsCreatingChapter(false);
  };

  const toggleChapterStatus = (chapId: string) => {
    setChapters(prev => prev.map(ch => {
      if (ch.id === chapId) {
        const nextStatus = ch.status === 'Published' ? 'Unpublished' : 'Published';
        logActivity('Chapter Status Changed', `${ch.title} changed to ${nextStatus}`);
        addNotification('Syllabus Status Updated', `Chapter "${ch.title}" is now ${nextStatus}.`, 'lesson');
        return { ...ch, status: nextStatus };
      }
      return ch;
    }));
  };

  // Lesson Builder state
  const [newLessonTitle, setNewLessonTitle] = useState('');
  const [newLessonDesc, setNewLessonDesc] = useState('');
  const [newLessonChapterId, setNewLessonChapterId] = useState('');
  const [newLessonDuration, setNewLessonDuration] = useState('20 min');
  const [newLessonVideoUrl, setNewLessonVideoUrl] = useState('');
  const [newLessonNotation, setNewLessonNotation] = useState('');
  const [newLessonIsRequired, setNewLessonIsRequired] = useState(true);

  useEffect(() => {
    if (chapters.length > 0 && !newLessonChapterId) {
      setNewLessonChapterId(chapters[0].id);
    }
  }, [chapters, newLessonChapterId]);

  const handleCreateLesson = (publishImmediately = false) => {
    if (!newLessonTitle.trim()) {
      setErrorMsg('Lesson Title is required.');
      return;
    }

    const createdLesson: TeacherLesson = {
      id: `les_${Date.now()}`,
      chapterId: newLessonChapterId || (chapters[0]?.id || 'ch_1'),
      courseId: 'begena',
      title: newLessonTitle.trim(),
      description: newLessonDesc.trim() || 'Instructional lesson notes.',
      durationText: newLessonDuration || '20 min',
      videoUrl: newLessonVideoUrl.trim() || 'https://www.w3schools.com/html/mov_bbb.mp4',
      notationSequence: newLessonNotation.trim() || '1 2 3 4 5',
      order: lessons.length + 1,
      status: publishImmediately ? 'Published' : 'Draft',
      isRequired: newLessonIsRequired
    };

    setLessons([...lessons, createdLesson]);
    logActivity('Lesson Created', `Added "${newLessonTitle}" (${publishImmediately ? 'Published' : 'Draft'})`);
    addNotification('Lesson Saved', `Lesson "${newLessonTitle}" saved persistently.`, 'lesson');

    // Reset form
    setNewLessonTitle('');
    setNewLessonDesc('');
    setNewLessonNotation('');
    setNewLessonVideoUrl('');
    handleTabChange('courses');
  };

  const toggleLessonStatus = (lesId: string) => {
    setLessons(prev => prev.map(l => {
      if (l.id === lesId) {
        const nextStatus = l.status === 'Published' ? 'Unpublished' : 'Published';
        logActivity('Lesson Status Updated', `Lesson "${l.title}" status changed to ${nextStatus}`);
        addNotification('Lesson Status Changed', `Lesson "${l.title}" is now ${nextStatus}.`, 'lesson');
        return { ...l, status: nextStatus };
      }
      return l;
    }));
  };

  const handleDeleteLesson = (lesId: string) => {
    setLessons(prev => prev.filter(l => l.id !== lesId));
    logActivity('Lesson Removed', 'Archived lesson unit from syllabus');
  };

  // ----------------------------------------------------
  // 4. ASSIGNMENTS & SUBMISSION GRADING
  // ----------------------------------------------------
  const [asgTitle, setAsgTitle] = useState('');
  const [asgInstructions, setAsgInstructions] = useState('');
  const [asgDueDate, setAsgDueDate] = useState('2026-08-20');

  const handleCreateAssignment = () => {
    if (!asgTitle.trim()) {
      setErrorMsg('Assignment Title is required.');
      return;
    }

    // Add assignment requirement to active chapter/lesson
    const createdLesson: TeacherLesson = {
      id: `les_asg_${Date.now()}`,
      chapterId: chapters[0]?.id || 'ch_1',
      courseId: 'begena',
      title: `Assignment: ${asgTitle.trim()}`,
      description: asgInstructions.trim() || 'Complete practical recital assignment.',
      durationText: 'Homework',
      order: lessons.length + 1,
      status: 'Published',
      isRequired: true,
      assignmentTitle: asgTitle.trim(),
      assignmentInstructions: asgInstructions.trim(),
      assignmentDueDate: asgDueDate
    };

    setLessons([...lessons, createdLesson]);
    logActivity('Assignment Created', `Published project: ${asgTitle}`);
    addNotification('Assignment Published', `Students notified about new assignment: ${asgTitle}`, 'assignment');

    setAsgTitle('');
    setAsgInstructions('');
    setErrorMsg(null);
  };

  // Submission review & grading state
  const [activeReviewId, setActiveReviewId] = useState<string | null>(null);
  const activeReview = useMemo(() => {
    return submissions.find(s => s.id === activeReviewId);
  }, [submissions, activeReviewId]);

  const [gradeScore, setGradeScore] = useState(85);
  const [feedbackText, setFeedbackText] = useState('');

  const handleGradeSubmission = (approved: boolean) => {
    if (!activeReviewId || !activeReview) return;

    const letterGrade = gradeScore >= 90 ? 'A' : gradeScore >= 80 ? 'B' : gradeScore >= 70 ? 'C' : 'Needs Work';
    const finalScoreText = `${gradeScore}/100`;
    const finalFeedback = feedbackText || (approved ? 'Excellent rhythm and posture.' : 'Please adjust thumb rest angle.');

    gradeAssignmentSubmission(
      activeReviewId,
      finalScoreText,
      letterGrade,
      finalFeedback,
      teacherProfile?.fullName || 'Instructor'
    );

    setSubmissions(prev => prev.map(sub => {
      if (sub.id === activeReviewId) {
        return {
          ...sub,
          status: approved ? 'Graded' : 'Needs Resubmission',
          score: gradeScore as any,
          letterGrade,
          feedback: finalFeedback,
          gradedAt: new Date().toISOString().split('T')[0],
          gradedByTeacherName: teacherProfile?.fullName || 'Teacher'
        };
      }
      return sub;
    }));

    logActivity('Submission Graded', `Evaluated work from ${activeReview.studentName} (${approved ? 'Graded' : 'Correction Requested'})`);
    addNotification('Recital Graded', `Grade and feedback recorded for ${activeReview.studentName}.`, 'feedback');
    setActiveReviewId(null);
    setFeedbackText('');
  };

  // ----------------------------------------------------
  // 5. ANNOUNCEMENTS & MESSAGING
  // ----------------------------------------------------
  const [annTitle, setAnnTitle] = useState('');
  const [annMessage, setAnnMessage] = useState('');
  const [annPriority, setAnnPriority] = useState<'Normal' | 'High' | 'Urgent'>('Normal');

  const [announcementsList, setAnnouncementsList] = useState(() => {
    try {
      const saved = localStorage.getItem('ab_teacher_announcements_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [
      {
        id: 'ann_1',
        title: 'Begena Plucking Technique Fasting Preparation',
        message: 'All students are encouraged to prepare their instruments for the upcoming spiritual recital series.',
        priority: 'High',
        date: '2026-07-25'
      }
    ];
  });

  const handlePostAnnouncement = () => {
    if (!annTitle.trim() || !annMessage.trim()) {
      setErrorMsg('Announcement Title and Message are required.');
      return;
    }

    const newAnn = {
      id: `ann_${Date.now()}`,
      title: annTitle.trim(),
      message: annMessage.trim(),
      priority: annPriority,
      date: new Date().toISOString().split('T')[0]
    };

    const updated = [newAnn, ...announcementsList];
    setAnnouncementsList(updated);
    try { localStorage.setItem('ab_teacher_announcements_v1', JSON.stringify(updated)); } catch (e) {}

    logActivity('Announcement Broadcast', `Posted: ${annTitle}`);
    addNotification('Class Notice Sent', `Announcement "${annTitle}" sent to assigned students.`, 'announcement');

    setAnnTitle('');
    setAnnMessage('');
    setErrorMsg(null);
  };

  // Direct Chats
  const [selectedChatStudentId, setSelectedChatStudentId] = useState<string | null>(null);
  const [chatInputText, setChatInputText] = useState('');
  const [chatMessages, setChatMessages] = useState<Record<string, { sender: 'teacher' | 'student'; text: string; time: string }[]>>(() => {
    try {
      const saved = localStorage.getItem('ab_teacher_chats_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {};
  });

  useEffect(() => {
    if (myStudentsList.length > 0 && !selectedChatStudentId) {
      setSelectedChatStudentId(myStudentsList[0].id);
    }
  }, [myStudentsList, selectedChatStudentId]);

  const handleSendChatMessage = () => {
    if (!chatInputText.trim() || !selectedChatStudentId) return;

    const currentChat = chatMessages[selectedChatStudentId] || [];
    const newMsg = {
      sender: 'teacher' as const,
      text: chatInputText.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updated = {
      ...chatMessages,
      [selectedChatStudentId]: [...currentChat, newMsg]
    };

    setChatMessages(updated);
    try { localStorage.setItem('ab_teacher_chats_v1', JSON.stringify(updated)); } catch (e) {}
    setChatInputText('');
    logActivity('Direct Message Dispatched', 'Sent response to student chat');
  };

  // ----------------------------------------------------
  // 6. TEACHER PROFILE & TELEGRAM HANDLE EDIT
  // ----------------------------------------------------
  const [teacherBioInput, setTeacherBioInput] = useState(teacherProfile?.bio || '');
  const [teacherPhoneInput, setTeacherPhoneInput] = useState(teacherProfile?.phone || '');
  const [telegramHandleInput, setTelegramHandleInput] = useState(teacherProfile?.telegramUsername || '');

  const handleSaveTeacherProfile = () => {
    if (teacherProfile) {
      updateTeacherTelegramUsername(teacherProfile.id, telegramHandleInput);
      logActivity('Profile Updated', 'Saved teacher bio and Telegram contact info');
      addNotification('Profile Saved', 'Your profile information and Telegram handle have been updated.', 'system');
    }
  };

  // ----------------------------------------------------
  // 7. UNAUTHORIZED ROLE GUARD SCREEN
  // ----------------------------------------------------
  if (!isAuthorizedRole) {
    return (
      <div className="min-h-screen bg-[#FCFBF8] flex items-center justify-center p-6 text-left">
        <div className="max-w-md w-full bg-white border border-[#E7DED1] rounded-3xl p-8 shadow-xl space-y-6 text-center">
          <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto border border-red-100">
            <ShieldAlert size={32} />
          </div>

          <div className="space-y-2">
            <h2 className="font-display font-black text-xl text-gray-900 uppercase tracking-tight">
              Teacher Portal Access Guard
            </h2>
            <p className="text-xs text-gray-500 leading-relaxed">
              The Teacher Portal is restricted to verified faculty instructors. You are currently logged in as{' '}
              <span className="font-bold text-gray-800 uppercase">{currentUser?.role || 'Visitor'}</span>.
            </p>
          </div>

          <div className="p-4 bg-[#FAF6EF] rounded-2xl border border-[#E7DED1] text-xs text-left text-gray-600 space-y-1">
            <span className="font-bold text-gray-800 block">Role-Based Access Enforcement:</span>
            <p className="text-[11px] leading-normal">
              You cannot access instructor tools or student records. Please return to your assigned role dashboard.
            </p>
          </div>

          <Button
            variant="primary"
            className="w-full bg-[#E89B52] hover:bg-[#d4863e] text-white py-3 font-bold text-xs rounded-xl uppercase tracking-wider"
            onClick={() => onNavigate(currentUser?.role ? (currentUser.role as PageId) : 'home')}
          >
            Return to My Authorized Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#FCFBF8] min-h-screen text-[#2B2B2B] font-sans antialiased text-left">
      {/* FACULTY TOP HEADER */}
      <header className="border-b border-[#E7DED1] bg-white relative z-20 px-6 py-4 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#FAF6EF] rounded-xl border border-[#E7DED1]">
            <Sparkles className="text-[#E89B52]" size={20} />
          </div>
          <div>
            <h1 className="font-display font-black text-lg tracking-tight uppercase text-gray-900">Liora Begena Faculty Portal</h1>
            <p className="text-[10px] tracking-wider text-[#E89B52] font-bold uppercase">Real Instructional Management System</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle variant="pill" />
          <div className="hidden md:flex flex-col text-right">
            <span className="font-bold text-xs text-gray-900">{teacherProfile?.fullName}</span>
            <span className="text-[9px] text-[#E89B52] font-mono tracking-wider font-bold uppercase">
              FACULTY INSTRUCTOR • {teacherProfile?.specializations?.[0] || 'Begena'}
            </span>
          </div>
          <div className="w-9 h-9 rounded-full border border-[#E7DED1] overflow-hidden bg-[#FAF6EF] flex items-center justify-center text-[#E89B52] font-bold text-xs">
            {teacherProfile?.photo ? (
              <img src={teacherProfile.photo} className="w-full h-full object-cover" alt="Avatar" referrerPolicy="no-referrer" />
            ) : (
              teacherProfile?.fullName?.charAt(0) || 'T'
            )}
          </div>
          <button onClick={logout} className="p-2 hover:bg-red-50 hover:text-red-600 rounded-lg text-gray-400 transition-colors cursor-pointer" title="Log Out">
            <LogOut size={18} />
          </button>
        </div>
      </header>

      {/* CORE WORKSPACE LAYOUT */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 p-6">
        {/* SIDEBAR DESK NAVIGATION */}
        <aside className="lg:col-span-3 space-y-4">
          <div className="bg-white border border-[#E7DED1] rounded-2xl p-4 shadow-2xs space-y-1">
            <p className="text-[10px] tracking-widest text-[#E89B52] font-bold px-3 py-1 uppercase font-mono">Teacher Desk Navigation</p>

            <button onClick={() => handleTabChange('dashboard')} className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === 'dashboard' ? 'bg-[#E89B52] text-white' : 'text-gray-600 hover:bg-[#FAF6EF]'}`}>
              <div className="flex items-center gap-2.5">
                <Activity size={16} />
                <span>Teaching Overview</span>
              </div>
              <ChevronRight size={14} className="opacity-60" />
            </button>

            <button onClick={() => handleTabChange('students')} className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === 'students' ? 'bg-[#E89B52] text-white' : 'text-gray-600 hover:bg-[#FAF6EF]'}`}>
              <div className="flex items-center gap-2.5">
                <Users size={16} />
                <span>My Students</span>
              </div>
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold ${activeTab === 'students' ? 'bg-white text-[#E89B52]' : 'bg-amber-100 text-[#E89B52]'}`}>{myStudentsList.length}</span>
            </button>

            <button onClick={() => handleTabChange('classes')} className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === 'classes' ? 'bg-[#E89B52] text-white' : 'text-gray-600 hover:bg-[#FAF6EF]'}`}>
              <div className="flex items-center gap-2.5">
                <Building size={16} />
                <span>My Classes</span>
              </div>
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold ${activeTab === 'classes' ? 'bg-white text-[#E89B52]' : 'bg-amber-100 text-[#E89B52]'}`}>{myAssignedClasses.length}</span>
            </button>

            <button onClick={() => handleTabChange('courses')} className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === 'courses' ? 'bg-[#E89B52] text-white' : 'text-gray-600 hover:bg-[#FAF6EF]'}`}>
              <div className="flex items-center gap-2.5">
                <BookOpen size={16} />
                <span>Syllabus & Content</span>
              </div>
              <ChevronRight size={14} className="opacity-60" />
            </button>

            <button onClick={() => handleTabChange('assignments')} className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === 'assignments' ? 'bg-[#E89B52] text-white' : 'text-gray-600 hover:bg-[#FAF6EF]'}`}>
              <div className="flex items-center gap-2.5">
                <BookCheck size={16} />
                <span>Assignments & Grading</span>
              </div>
              {pendingReviewSubmissions.length > 0 && (
                <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-mono font-bold">{pendingReviewSubmissions.length}</span>
              )}
            </button>

            <button onClick={() => handleTabChange('attendance')} className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === 'attendance' ? 'bg-[#E89B52] text-white' : 'text-gray-600 hover:bg-[#FAF6EF]'}`}>
              <div className="flex items-center gap-2.5">
                <Calendar size={16} />
                <span>Attendance Log</span>
              </div>
              <ChevronRight size={14} className="opacity-60" />
            </button>

            <button onClick={() => handleTabChange('schedule')} className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === 'schedule' ? 'bg-[#E89B52] text-white' : 'text-gray-600 hover:bg-[#FAF6EF]'}`}>
              <div className="flex items-center gap-2.5">
                <Clock size={16} />
                <span>Class Timetable</span>
              </div>
              <ChevronRight size={14} className="opacity-60" />
            </button>

            <button onClick={() => handleTabChange('messages')} className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === 'messages' ? 'bg-[#E89B52] text-white' : 'text-gray-600 hover:bg-[#FAF6EF]'}`}>
              <div className="flex items-center gap-2.5">
                <MessageSquare size={16} />
                <span>Announcements & Chat</span>
              </div>
              <ChevronRight size={14} className="opacity-60" />
            </button>

            <button onClick={() => handleTabChange('profile')} className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === 'profile' ? 'bg-[#E89B52] text-white' : 'text-gray-600 hover:bg-[#FAF6EF]'}`}>
              <div className="flex items-center gap-2.5">
                <User size={16} />
                <span>My Profile</span>
              </div>
              <ChevronRight size={14} className="opacity-60" />
            </button>

            <button onClick={() => handleTabChange('activity')} className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === 'activity' ? 'bg-[#E89B52] text-white' : 'text-gray-600 hover:bg-[#FAF6EF]'}`}>
              <div className="flex items-center gap-2.5">
                <Activity size={16} />
                <span>Activity Registry</span>
              </div>
              <ChevronRight size={14} className="opacity-60" />
            </button>
          </div>

          {/* FACULTY ASSIGNED PROFILE SUMMARY */}
          <div className="bg-white border border-[#E7DED1] rounded-2xl p-4 shadow-2xs space-y-3 text-xs">
            <h4 className="text-[10px] font-bold text-[#E89B52] uppercase tracking-wider font-mono">Instructor Profile</h4>
            <div className="space-y-2 text-gray-600">
              <div className="flex justify-between border-b border-gray-100 pb-1.5">
                <span className="text-gray-400">Specialization:</span>
                <span className="font-bold text-gray-800">{teacherProfile?.specializations?.join(', ') || 'Begena'}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-1.5">
                <span className="text-gray-400">Assigned Branch:</span>
                <span className="font-bold text-gray-800">{teacherProfile?.branches?.[0] || 'Hawassa main Branch'}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-1.5">
                <span className="text-gray-400">Telegram Handle:</span>
                <span className="font-mono font-bold text-sky-700">@{teacherProfile?.telegramUsername || 'abel_begena'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Status:</span>
                <span className="text-green-600 font-bold">Active Faculty</span>
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN PANEL CONTENT DISPLAY */}
        <main className="lg:col-span-9 space-y-6">
          {errorMsg && (
            <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-2xl flex items-start justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <AlertTriangle className="shrink-0 text-red-600" size={16} />
                <span>{errorMsg}</span>
              </div>
              <button onClick={() => setErrorMsg(null)} className="text-red-500 font-bold hover:underline">Dismiss</button>
            </div>
          )}

          {isLoading ? (
            <div className="space-y-4 animate-pulse">
              <div className="bg-gray-100 h-20 w-full rounded-2xl" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-100 h-24 rounded-2xl" />
                <div className="bg-gray-100 h-24 rounded-2xl" />
                <div className="bg-gray-100 h-24 rounded-2xl" />
                <div className="bg-gray-100 h-24 rounded-2xl" />
              </div>
              <div className="bg-gray-100 h-64 w-full rounded-2xl" />
            </div>
          ) : (
            <>
              {/* -------------------------------------------------- */}
              {/* TAB 1: TEACHING OVERVIEW DASHBOARD */}
              {/* -------------------------------------------------- */}
              {activeTab === 'dashboard' && (
                <div className="space-y-6 animate-fadeIn">
                  {/* WELCOME BANNER */}
                  <div className="bg-white border border-[#E7DED1] p-6 rounded-2xl shadow-2xs space-y-1">
                    <span className="text-[10px] font-mono tracking-widest text-[#E89B52] uppercase font-bold">Faculty Portal Overview</span>
                    <h2 className="font-display font-black text-2xl uppercase tracking-tight text-gray-900">
                      WELCOME, {teacherProfile?.fullName?.toUpperCase()}
                    </h2>
                    <p className="text-xs text-gray-500">
                      Good morning, {teacherProfile?.fullName}. Here is your real teaching overview based on active student assignments.
                    </p>
                  </div>

                  {/* SUMMARY METRICS CARDS */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white border border-[#E7DED1] p-4 rounded-2xl shadow-2xs space-y-1">
                      <span className="block text-[10px] font-mono tracking-widest text-gray-400 uppercase font-bold">Active Students</span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-black font-mono text-gray-900">{myStudentsList.length}</span>
                        <span className="text-[10px] text-green-600 font-bold font-mono">Assigned</span>
                      </div>
                    </div>

                    <div className="bg-white border border-[#E7DED1] p-4 rounded-2xl shadow-2xs space-y-1">
                      <span className="block text-[10px] font-mono tracking-widest text-gray-400 uppercase font-bold">Active Courses</span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-black font-mono text-gray-900">{myAssignedClasses.length}</span>
                        <span className="text-[10px] text-gray-400 font-mono">Classes</span>
                      </div>
                    </div>

                    <div className="bg-white border border-[#E7DED1] p-4 rounded-2xl shadow-2xs space-y-1">
                      <span className="block text-[10px] font-mono tracking-widest text-gray-400 uppercase font-bold">Today's Classes</span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-black font-mono text-[#E89B52]">{todaysClasses.length}</span>
                        <span className="text-[10px] text-gray-400 font-mono">Scheduled</span>
                      </div>
                    </div>

                    <div className="bg-white border border-[#E7DED1] p-4 rounded-2xl shadow-2xs space-y-1">
                      <span className="block text-[10px] font-mono tracking-widest text-gray-400 uppercase font-bold">Pending Tasks</span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-black font-mono text-red-600">{pendingReviewSubmissions.length + draftLessons.length}</span>
                        <span className="text-[10px] text-gray-400 font-mono">Items</span>
                      </div>
                    </div>
                  </div>

                  {/* TODAY'S SCHEDULE SECTION */}
                  <div className="bg-white border border-[#E7DED1] p-6 rounded-2xl shadow-2xs space-y-4">
                    <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                      <div>
                        <span className="text-[10px] font-mono font-bold text-gray-400 uppercase">Class Schedule</span>
                        <h3 className="font-display font-black text-sm uppercase text-gray-800">TODAY'S SCHEDULE ({todayName})</h3>
                      </div>
                      <button onClick={() => handleTabChange('schedule')} className="text-xs text-[#E89B52] font-bold hover:underline cursor-pointer">
                        Full Schedule →
                      </button>
                    </div>

                    {todaysClasses.length === 0 ? (
                      <div className="p-8 text-center bg-[#FAF6EF]/30 rounded-2xl border border-dashed border-[#E7DED1]">
                        <Calendar size={32} className="mx-auto text-gray-300 mb-2" />
                        <p className="text-xs text-gray-500 font-bold">No classes scheduled for today.</p>
                        <p className="text-[11px] text-gray-400 mt-0.5">Check your weekly class timetable or schedule a makeup session.</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {todaysClasses.map(cl => (
                          <div key={cl.id} className="p-4 border border-[#E7DED1] rounded-2xl space-y-3 bg-[#FAF6EF]/20 hover:bg-[#FAF6EF]/50 transition-colors">
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="flex items-center gap-2">
                                  <h4 className="font-bold text-xs text-gray-900">{cl.courseName}</h4>
                                  <span className={`text-[9px] px-2 py-0.5 rounded font-mono font-bold uppercase ${cl.mode === 'Online' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-amber-50 text-[#E89B52] border border-amber-200'}`}>
                                    {cl.mode}
                                  </span>
                                </div>
                                <span className="text-[10px] text-gray-500 font-mono mt-0.5 block">
                                  {cl.instrument} • {cl.level} • {cl.branch}
                                </span>
                              </div>
                              <span className="font-mono text-xs font-bold text-[#E89B52] bg-white px-2.5 py-1 rounded-lg border border-[#E7DED1]">
                                {cl.classTime}
                              </span>
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs">
                              <span className="text-[11px] text-gray-600 font-bold">
                                {cl.studentsCount} Student{cl.studentsCount > 1 ? 's' : ''} Enrolled
                              </span>

                              <button
                                onClick={() => {
                                  setSelectedClassId(cl.id);
                                  handleTabChange('classes');
                                }}
                                className="px-3 py-1.5 bg-[#E89B52] hover:bg-[#d4863e] text-white font-bold rounded-lg text-xs cursor-pointer"
                              >
                                Open Class
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* -------------------------------------------------- */}
              {/* TAB 2: MY STUDENTS & DETAILED STUDENT PROFILE */}
              {/* -------------------------------------------------- */}
              {activeTab === 'students' && (
                <div className="space-y-6 animate-fadeIn">
                  {!selectedStudentId ? (
                    <div className="space-y-4">
                      {/* SEARCH AND FILTERS */}
                      <div className="bg-white border border-[#E7DED1] p-4 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs">
                        <div className="relative flex-1">
                          <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
                          <input
                            type="text"
                            placeholder="Search assigned students by name, ID, or course..."
                            className="w-full pl-9 pr-4 py-2 bg-[#FAF6EF]/50 border border-[#E7DED1] rounded-xl text-xs outline-none focus:border-[#E89B52]"
                            value={studentSearch}
                            onChange={(e) => setStudentSearch(e.target.value)}
                          />
                        </div>

                        <div className="flex gap-2">
                          <select
                            className="p-2 border border-[#E7DED1] rounded-xl bg-white text-xs font-bold text-gray-600 outline-none"
                            value={studentFilterMode}
                            onChange={(e) => setStudentFilterMode(e.target.value)}
                          >
                            <option value="All">All Modes</option>
                            <option value="In-Person">In-Person</option>
                            <option value="Online">Online</option>
                            <option value="Hybrid">Hybrid</option>
                          </select>

                          <select
                            className="p-2 border border-[#E7DED1] rounded-xl bg-white text-xs font-bold text-gray-600 outline-none"
                            value={studentFilterStatus}
                            onChange={(e) => setStudentFilterStatus(e.target.value)}
                          >
                            <option value="All">All Statuses</option>
                            <option value="Active">Active</option>
                            <option value="Pending Verification">Pending Verification</option>
                          </select>
                        </div>
                      </div>

                      {/* ASSIGNED STUDENTS TABLE */}
                      <div className="bg-white border border-[#E7DED1] rounded-2xl overflow-x-auto shadow-2xs text-xs">
                        <table className="w-full text-left">
                          <thead className="bg-[#FAF6EF] text-[10px] font-bold text-gray-400 uppercase font-mono border-b border-[#E7DED1]">
                            <tr>
                              <th className="p-3.5">Student</th>
                              <th className="p-3.5">Course / Instrument</th>
                              <th className="p-3.5">Mode / Branch</th>
                              <th className="p-3.5">Learning Progress</th>
                              <th className="p-3.5">Attendance</th>
                              <th className="p-3.5 text-right">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredStudents.length === 0 ? (
                              <tr>
                                <td colSpan={6} className="p-12 text-center text-gray-400">
                                  <Users size={32} className="mx-auto text-gray-300 mb-2" />
                                  <p className="font-bold text-xs text-gray-500">No students assigned yet.</p>
                                  <p className="text-[11px] text-gray-400 mt-0.5">
                                    When registration staff or system assigns students to you, they will appear here automatically.
                                  </p>
                                </td>
                              </tr>
                            ) : (
                              filteredStudents.map(student => (
                                <tr key={student.id} className="border-b border-gray-100 hover:bg-[#FAF6EF]/30 transition-colors">
                                  <td className="p-3.5 flex items-center gap-3">
                                    {student.photo ? (
                                      <img src={student.photo} className="w-8 h-8 rounded-full object-cover border border-[#E7DED1]" alt="" referrerPolicy="no-referrer" />
                                    ) : (
                                      <div className="w-8 h-8 rounded-full bg-[#3B2818] text-[#E89B52] flex items-center justify-center font-bold text-xs shrink-0">
                                        {student.name?.charAt(0) || 'S'}
                                      </div>
                                    )}
                                    <div>
                                      <span className="block font-bold text-gray-800">{student.name}</span>
                                      <span className="text-[9px] font-mono font-bold text-[#E89B52]">{student.studentRegistrationId || student.id}</span>
                                    </div>
                                  </td>
                                  <td className="p-3.5">
                                    <span className="block font-bold text-gray-700">{student.course}</span>
                                    <span className="text-[10px] text-gray-400 font-mono">{student.level}</span>
                                  </td>
                                  <td className="p-3.5">
                                    <span className="block font-bold text-gray-700">{student.mode}</span>
                                    <span className="text-[10px] text-gray-400">{student.branch}</span>
                                  </td>
                                  <td className="p-3.5">
                                    <div className="flex items-center gap-2">
                                      <div className="w-20 bg-gray-100 h-2 rounded-full overflow-hidden">
                                        <div className="h-full bg-green-500" style={{ width: `${student.progress}%` }} />
                                      </div>
                                      <span className="font-mono text-[10px] font-bold text-gray-700">{student.progress}%</span>
                                    </div>
                                  </td>
                                  <td className="p-3.5">
                                    <span className="font-mono text-xs font-bold text-gray-700">
                                      {student.presentCount} Present / {student.absentCount} Absent
                                    </span>
                                  </td>
                                  <td className="p-3.5 text-right">
                                    <button
                                      onClick={() => setSelectedStudentId(getStudentSelectionKey(student) || student.id)}
                                      className="px-3 py-1.5 bg-[#FAF6EF] hover:bg-[#E89B52] hover:text-white border border-[#E7DED1] rounded-lg text-xs font-bold text-gray-700 transition-colors cursor-pointer"
                                    >
                                      View Student
                                    </button>
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    /* DETAILED STUDENT PROFILE VIEW */
                    <div className="space-y-6">
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E7DED1] pb-4">
                        <button
                          onClick={() => setSelectedStudentId(null)}
                          className="text-xs font-bold text-gray-500 hover:text-gray-900 flex items-center gap-1.5 cursor-pointer bg-white border border-[#E7DED1] px-3 py-1.5 rounded-xl shadow-2xs"
                        >
                          <ArrowLeft size={14} /> Back to Assigned Students
                        </button>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setIsVerifyModalOpen(true)}
                            className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                          >
                            <Award size={14} className="text-[#E89B52]" />
                            <span>Verify Certificate Code</span>
                          </button>
                        </div>
                      </div>

                      {selectedStudent && (() => {
                        const studentInst = selectedStudent.instrument || 'Begena';
                        const studentChaps = getChaptersForCourse(studentInst, selectedStudent.level);
                        const studentLssns = getLessonsForCourse(studentInst, selectedStudent.level);
                        const completedIds = getStudentCompletedLessonIds(selectedStudent.id, studentInst);
                        const activeLesson = studentLssns.find(l => l.isRequired && !completedIds.includes(l.id)) || studentLssns[0];
                        const calculatedProg = calculateStudentProgress(selectedStudent.id, studentInst, selectedStudent.level);

                        const studentAtt = attendances.filter(a =>
                          (selectedStudent.id && a.studentId === selectedStudent.id) ||
                          (selectedStudent.enrollmentId && a.enrollmentId === selectedStudent.enrollmentId) ||
                          (selectedStudent.email && a.studentEmail && a.studentEmail.toLowerCase().trim() === selectedStudent.email.toLowerCase().trim()) ||
                          (selectedStudent.name && a.studentName && a.studentName.toLowerCase().trim() === selectedStudent.name.toLowerCase().trim())
                        );
                        const presCount = studentAtt.filter(a => a.status === 'Present').length;
                        const absCount = studentAtt.filter(a => a.status === 'Absent').length;
                        const latCount = studentAtt.filter(a => a.status === 'Late').length;
                        const permCount = studentAtt.filter(a => a.status === 'Excused').length;
                        const totalClasses = studentAtt.length;
                        const attRate = totalClasses > 0 ? Math.round(((presCount + (latCount * 0.5)) / totalClasses) * 100) : 0;

                        const existingCert = getCertificateByEnrollment(selectedStudent.enrollmentId);

                        return (
                          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                            {/* LEFT SIDEBAR: STUDENT SUMMARY CARD */}
                            <div className="lg:col-span-4 bg-white border border-[#E7DED1] p-6 rounded-2xl shadow-2xs space-y-5 h-fit">
                              <div className="text-center space-y-2">
                                <img
                                  src={selectedStudent.photo}
                                  className="w-20 h-20 rounded-full object-cover border-2 border-[#E89B52] mx-auto shadow-xs"
                                  alt=""
                                  referrerPolicy="no-referrer"
                                />
                                <h3 className="font-display font-black text-lg text-gray-900">{selectedStudent.name}</h3>
                                <div className="flex items-center justify-center gap-2">
                                  <span className="text-[10px] bg-amber-100 text-[#E89B52] px-2.5 py-0.5 rounded-full font-mono font-bold uppercase">
                                    {selectedStudent.instrument}
                                  </span>
                                  <span className="text-[10px] bg-sky-100 text-sky-800 px-2.5 py-0.5 rounded-full font-mono font-bold uppercase">
                                    {selectedStudent.mode}
                                  </span>
                                </div>
                              </div>

                              {/* ATTENTION WARNING IF LOW ATTENDANCE OR INACTIVE */}
                              {attRate < 75 && totalClasses > 2 && (
                                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-900 flex items-start gap-2">
                                  <AlertCircle size={16} className="text-red-600 shrink-0 mt-0.5" />
                                  <div>
                                    <span className="font-bold block">Needs Academic Attention</span>
                                    <p className="text-[11px] text-red-800">Attendance rate is below threshold ({attRate}%).</p>
                                  </div>
                                </div>
                              )}

                              {/* ENROLLMENT METADATA */}
                              <div className="border-t border-gray-100 pt-4 space-y-2 text-xs text-gray-600 font-medium">
                                <div className="flex justify-between border-b border-gray-50 pb-1.5">
                                  <span className="text-gray-400">Enrollment ID:</span>
                                  <span className="font-mono font-bold text-gray-800">{selectedStudent.enrollmentId}</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-50 pb-1.5">
                                  <span className="text-gray-400">Course / Level:</span>
                                  <span className="font-bold text-gray-800">{selectedStudent.course} ({selectedStudent.level})</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-50 pb-1.5">
                                  <span className="text-gray-400">Email:</span>
                                  <span className="font-mono text-gray-800 truncate max-w-[150px]">{selectedStudent.email}</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-50 pb-1.5">
                                  <span className="text-gray-400">Phone:</span>
                                  <span className="font-mono text-gray-800">{selectedStudent.phone}</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-50 pb-1.5">
                                  <span className="text-gray-400">Campus Branch:</span>
                                  <span className="font-bold text-gray-800">{selectedStudent.branch}</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-50 pb-1.5">
                                  <span className="text-gray-400">Tuition Status:</span>
                                  <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[10px]">
                                    {selectedStudent.paymentStatus}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-400">Assigned Teacher:</span>
                                  <span className="font-bold text-[#E89B52]">{teacherProfile?.fullName}</span>
                                </div>
                              </div>

                              {/* OVERALL PROGRESS BAR */}
                              <div className="pt-2 border-t border-gray-100 space-y-1.5">
                                <div className="flex justify-between text-xs font-bold text-gray-700">
                                  <span>Curriculum Mastery</span>
                                  <span className="text-[#E89B52] font-mono">{selectedStudent.progress}%</span>
                                </div>
                                <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                                  <div className="h-full bg-gradient-to-r from-amber-500 to-emerald-500" style={{ width: `${selectedStudent.progress}%` }} />
                                </div>
                              </div>
                            </div>

                            {/* RIGHT MAIN PANEL: SUB-TABS & CONTENT */}
                            <div className="lg:col-span-8 space-y-4">
                              {/* SUB-TAB NAV BUTTONS */}
                              <div className="flex flex-wrap items-center gap-2 bg-white border border-[#E7DED1] p-1.5 rounded-2xl shadow-2xs">
                                <button
                                  onClick={() => setStudentDetailSubTab('journey')}
                                  className={`flex-1 min-w-[110px] py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                                    studentDetailSubTab === 'journey'
                                      ? 'bg-[#E89B52] text-white shadow-xs'
                                      : 'text-gray-600 hover:bg-[#FAF6EF]'
                                  }`}
                                >
                                  <Compass size={14} />
                                  <span>Learning Journey</span>
                                </button>

                                <button
                                  onClick={() => setStudentDetailSubTab('evaluations')}
                                  className={`flex-1 min-w-[110px] py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                                    studentDetailSubTab === 'evaluations'
                                      ? 'bg-[#E89B52] text-white shadow-xs'
                                      : 'text-gray-600 hover:bg-[#FAF6EF]'
                                  }`}
                                >
                                  <Activity size={14} />
                                  <span>Progress & Evaluation</span>
                                  {evaluationsList.length > 0 && (
                                    <span className="text-[10px] bg-white/30 px-1.5 py-0.2 rounded-full font-mono">
                                      {evaluationsList.length}
                                    </span>
                                  )}
                                </button>

                                <button
                                  onClick={() => setStudentDetailSubTab('attendance')}
                                  className={`flex-1 min-w-[110px] py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                                    studentDetailSubTab === 'attendance'
                                      ? 'bg-[#E89B52] text-white shadow-xs'
                                      : 'text-gray-600 hover:bg-[#FAF6EF]'
                                  }`}
                                >
                                  <Calendar size={14} />
                                  <span>Attendance Log</span>
                                </button>

                                <button
                                  onClick={() => setStudentDetailSubTab('chat')}
                                  className={`flex-1 min-w-[110px] py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                                    studentDetailSubTab === 'chat'
                                      ? 'bg-[#E89B52] text-white shadow-xs'
                                      : 'text-gray-600 hover:bg-[#FAF6EF]'
                                  }`}
                                >
                                  <MessageSquare size={14} />
                                  <span>Teacher Chat</span>
                                  {studentMessages.filter(m => m.senderRole === 'student' && !m.isRead).length > 0 && (
                                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                  )}
                                </button>

                                <button
                                  onClick={() => setStudentDetailSubTab('certificate')}
                                  className={`flex-1 min-w-[110px] py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                                    studentDetailSubTab === 'certificate'
                                      ? 'bg-[#E89B52] text-white shadow-xs'
                                      : 'text-gray-600 hover:bg-[#FAF6EF]'
                                  }`}
                                >
                                  <Award size={14} />
                                  <span>Official Certificate</span>
                                </button>

                                <button
                                  onClick={() => setStudentDetailSubTab('notes')}
                                  className={`flex-1 min-w-[110px] py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                                    studentDetailSubTab === 'notes'
                                      ? 'bg-[#E89B52] text-white shadow-xs'
                                      : 'text-gray-600 hover:bg-[#FAF6EF]'
                                  }`}
                                >
                                  <FileText size={14} />
                                  <span>Teacher Notes</span>
                                </button>
                              </div>

                              {/* SUB-TAB 1: EXACT STUDENT LEARNING JOURNEY & DASHBOARD PROGRESS */}
                              {studentDetailSubTab === 'journey' && (
                                <div className="bg-white border border-[#E7DED1] p-6 rounded-2xl shadow-2xs space-y-6 animate-fadeIn">
                                  {/* HEADER */}
                                  <div className="flex flex-wrap items-center justify-between border-b border-gray-100 pb-3 gap-3">
                                    <div>
                                      <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-mono tracking-widest text-[#E89B52] uppercase font-bold">STUDENT DASHBOARD RECORD</span>
                                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                                          <CheckCircle2 size={12} className="text-emerald-600" /> Live Synced
                                        </span>
                                      </div>
                                      <h4 className="font-display font-black text-base uppercase text-gray-900 flex items-center gap-2 mt-0.5">
                                        <Compass size={18} className="text-[#E89B52]" />
                                        EXACT LEARNING JOURNEY & PROGRESS
                                      </h4>
                                      <p className="text-xs text-gray-500 mt-0.5">
                                        Live academic trajectory, video watch records, and chapter progress for <strong>{selectedStudent.name}</strong> ({selectedStudent.course} • {selectedStudent.level}).
                                      </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <span className="text-xs font-mono font-bold bg-[#FAF6EF] text-[#E89B52] px-3.5 py-1.5 rounded-full border border-[#E7DED1] shadow-2xs">
                                        {calculatedProg.progressPercent}% Overall Completion
                                      </span>
                                    </div>
                                  </div>

                                  {/* METRICS SUMMARY CARDS */}
                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                                    <div className="p-3.5 bg-amber-50/80 border border-amber-200 rounded-xl space-y-1">
                                      <span className="text-[10px] text-amber-800 font-extrabold uppercase block font-mono">Curriculum Mastery</span>
                                      <div className="flex items-baseline gap-1">
                                        <span className="text-xl font-black font-mono text-amber-900">{calculatedProg.progressPercent}%</span>
                                        <span className="text-[10px] text-amber-700">({calculatedProg.completedRequiredLessonsCount}/{calculatedProg.totalPublishedRequiredLessonsCount} required)</span>
                                      </div>
                                    </div>

                                    <div className="p-3.5 bg-sky-50/80 border border-sky-200 rounded-xl space-y-1">
                                      <span className="text-[10px] text-sky-800 font-extrabold uppercase block font-mono">Video Progress</span>
                                      <div className="flex items-baseline gap-1">
                                        <span className="text-xl font-black font-mono text-sky-900">{calculatedProg.completedVideosCount} / {calculatedProg.totalPublishedVideosCount}</span>
                                        <span className="text-[10px] text-sky-700">Videos</span>
                                      </div>
                                    </div>

                                    <div className="p-3.5 bg-purple-50/80 border border-purple-200 rounded-xl space-y-1">
                                      <span className="text-[10px] text-purple-800 font-extrabold uppercase block font-mono">Assignments</span>
                                      <div className="flex items-baseline gap-1">
                                        <span className="text-xl font-black font-mono text-purple-900">{calculatedProg.submittedAssignmentsCount}</span>
                                        <span className="text-[10px] text-purple-700">({calculatedProg.gradedAssignmentsCount} Graded)</span>
                                      </div>
                                    </div>

                                    <div className="p-3.5 bg-emerald-50/80 border border-emerald-200 rounded-xl space-y-1">
                                      <span className="text-[10px] text-emerald-800 font-extrabold uppercase block font-mono">Last Recorded Activity</span>
                                      <span className="text-xs font-bold font-mono text-emerald-900 block truncate" title={calculatedProg.lastActivityAt}>
                                        {calculatedProg.lastActivityAt}
                                      </span>
                                    </div>
                                  </div>


                                </div>
                              )}

                              {/* SUB-TAB: LEARNING PROGRESS & EVALUATION ENGINE */}
                              {studentDetailSubTab === 'evaluations' && (
                                <div className="bg-white border border-[#E7DED1] p-6 rounded-2xl shadow-2xs space-y-6 animate-fadeIn">
                                  <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                                    <div>
                                      <span className="text-[10px] font-mono tracking-widest text-[#E89B52] uppercase font-bold">ASSIGNED INSTRUCTOR PORTAL</span>
                                      <h4 className="font-display font-black text-sm uppercase text-gray-900 flex items-center gap-2">
                                        <Activity size={16} className="text-[#E89B52]" />
                                        LEARNING PROGRESS EVALUATION & MASTERY
                                      </h4>
                                    </div>
                                    <span className="text-xs font-mono font-bold bg-amber-50 text-amber-800 px-3 py-1 rounded-full border border-amber-200">
                                      {selectedStudent.progress || 0}% Overall Mastery
                                    </span>
                                  </div>

                                  {/* OVERALL METRICS CARDS */}
                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                                    <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl space-y-1">
                                      <span className="text-[10px] text-amber-800 font-extrabold uppercase block">Overall Progress</span>
                                      <span className="text-lg font-black font-mono text-amber-900">{selectedStudent.progress || 0}%</span>
                                    </div>

                                    <div className="p-3 bg-emerald-50/80 border border-emerald-200 rounded-xl space-y-1">
                                      <span className="text-[10px] text-emerald-800 font-extrabold uppercase block">Lessons Completed</span>
                                      <span className="text-lg font-black font-mono text-emerald-900">{completedIds.length} / {studentLssns.length}</span>
                                    </div>

                                    <div className="p-3 bg-sky-50/80 border border-sky-200 rounded-xl space-y-1">
                                      <span className="text-[10px] text-sky-800 font-extrabold uppercase block">Class Attendance</span>
                                      <span className="text-lg font-black font-mono text-sky-900">{attRate}%</span>
                                    </div>

                                    <div className="p-3 bg-purple-50/80 border border-purple-200 rounded-xl space-y-1">
                                      <span className="text-[10px] text-purple-800 font-extrabold uppercase block">Evaluations Logged</span>
                                      <span className="text-lg font-black font-mono text-purple-900">{evaluationsList.length}</span>
                                    </div>
                                  </div>

                                  {/* RECORD NEW EVALUATION FORM */}
                                  <div className="border border-[#E7DED1] rounded-2xl p-5 bg-[#FAF6EF]/40 space-y-4">
                                    <div className="flex items-center justify-between border-b border-[#E7DED1] pb-2">
                                      <h5 className="font-bold text-xs uppercase text-gray-900 flex items-center gap-2">
                                        <Sparkles size={14} className="text-[#E89B52]" />
                                        RECORD FACULTY PROGRESS EVALUATION
                                      </h5>
                                      <span className="text-[10px] text-gray-400 font-mono">Syncs automatically with student portal</span>
                                    </div>

                                    {evalSavedNotice && (
                                      <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 font-bold flex items-center gap-2 animate-bounce">
                                        <CheckCircle size={16} className="text-emerald-600 shrink-0" />
                                        <span>Progress Evaluation saved successfully and synced with {selectedStudent.name}!</span>
                                      </div>
                                    )}

                                    {/* SKILL MASTERY RATINGS */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                                      {/* Tuning */}
                                      <div className="bg-white p-3 rounded-xl border border-gray-200 space-y-1.5">
                                        <label className="font-bold text-gray-800 flex justify-between">
                                          <span>🎵 Pitch & Instrument Tuning</span>
                                          <span className="text-[#E89B52] font-mono">{evalTuning}/5 ★</span>
                                        </label>
                                        <div className="flex items-center gap-1">
                                          {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                              key={star}
                                              type="button"
                                              onClick={() => setEvalTuning(star)}
                                              className="p-1 text-amber-400 hover:scale-110 transition cursor-pointer"
                                            >
                                              <Star size={18} fill={star <= evalTuning ? '#F59E0B' : 'transparent'} stroke="#F59E0B" />
                                            </button>
                                          ))}
                                        </div>
                                      </div>

                                      {/* Rhythm */}
                                      <div className="bg-white p-3 rounded-xl border border-gray-200 space-y-1.5">
                                        <label className="font-bold text-gray-800 flex justify-between">
                                          <span>🥁 Rhythm & Tempo Stability</span>
                                          <span className="text-[#E89B52] font-mono">{evalRhythm}/5 ★</span>
                                        </label>
                                        <div className="flex items-center gap-1">
                                          {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                              key={star}
                                              type="button"
                                              onClick={() => setEvalRhythm(star)}
                                              className="p-1 text-amber-400 hover:scale-110 transition cursor-pointer"
                                            >
                                              <Star size={18} fill={star <= evalRhythm ? '#F59E0B' : 'transparent'} stroke="#F59E0B" />
                                            </button>
                                          ))}
                                        </div>
                                      </div>

                                      {/* Technique */}
                                      <div className="bg-white p-3 rounded-xl border border-gray-200 space-y-1.5">
                                        <label className="font-bold text-gray-800 flex justify-between">
                                          <span>🖐️ Plucking & Posture Technique</span>
                                          <span className="text-[#E89B52] font-mono">{evalTechnique}/5 ★</span>
                                        </label>
                                        <div className="flex items-center gap-1">
                                          {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                              key={star}
                                              type="button"
                                              onClick={() => setEvalTechnique(star)}
                                              className="p-1 text-amber-400 hover:scale-110 transition cursor-pointer"
                                            >
                                              <Star size={18} fill={star <= evalTechnique ? '#F59E0B' : 'transparent'} stroke="#F59E0B" />
                                            </button>
                                          ))}
                                        </div>
                                      </div>

                                      {/* Piece Mastery */}
                                      <div className="bg-white p-3 rounded-xl border border-gray-200 space-y-1.5">
                                        <label className="font-bold text-gray-800 flex justify-between">
                                          <span>🎼 Hymn & Song Mastery</span>
                                          <span className="text-[#E89B52] font-mono">{evalPiece}/5 ★</span>
                                        </label>
                                        <div className="flex items-center gap-1">
                                          {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                              key={star}
                                              type="button"
                                              onClick={() => setEvalPiece(star)}
                                              className="p-1 text-amber-400 hover:scale-110 transition cursor-pointer"
                                            >
                                              <Star size={18} fill={star <= evalPiece ? '#F59E0B' : 'transparent'} stroke="#F59E0B" />
                                            </button>
                                          ))}
                                        </div>
                                      </div>
                                    </div>

                                    {/* OVERALL PROGRESS & GRADE SELECTOR */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                                      <div className="space-y-1">
                                        <label className="font-bold text-gray-700 block">Overall Progress Mastery (%):</label>
                                        <div className="flex items-center gap-3">
                                          <input
                                            type="range"
                                            min="0"
                                            max="100"
                                            value={evalProgressPct}
                                            onChange={(e) => setEvalProgressPct(Number(e.target.value))}
                                            className="flex-1 accent-[#E89B52]"
                                          />
                                          <span className="font-mono font-bold text-[#E89B52] text-sm w-12 text-right">{evalProgressPct}%</span>
                                        </div>
                                      </div>

                                      <div className="space-y-1">
                                        <label className="font-bold text-gray-700 block">Performance Letter Grade:</label>
                                        <select
                                          value={evalGrade}
                                          onChange={(e) => setEvalGrade(e.target.value)}
                                          className="w-full p-2.5 bg-white border border-gray-300 rounded-xl font-mono font-bold text-xs outline-none focus:border-[#E89B52]"
                                        >
                                          <option value="A+">A+ (Exceptional / Mastery)</option>
                                          <option value="A">A (Excellent Progress)</option>
                                          <option value="A-">A- (Very Good)</option>
                                          <option value="B+">B+ (Good Progress)</option>
                                          <option value="B">B (Satisfactory)</option>
                                          <option value="C+">C+ (Needs Practice)</option>
                                        </select>
                                      </div>
                                    </div>

                                    {/* TEACHER EVALUATION NOTES */}
                                    <div className="space-y-1 text-xs">
                                      <label className="font-bold text-gray-700 block">Instructor Evaluation Notes & Guidance:</label>
                                      <textarea
                                        rows={3}
                                        value={evalNotes}
                                        onChange={(e) => setEvalNotes(e.target.value)}
                                        placeholder={`Provide constructive feedback and daily practice goals for ${selectedStudent.name}...`}
                                        className="w-full p-3 bg-white border border-gray-300 rounded-xl text-xs outline-none focus:border-[#E89B52]"
                                      />
                                    </div>

                                    <button
                                      type="button"
                                      onClick={handleSaveStudentEvaluation}
                                      className="w-full py-3 bg-[#E89B52] hover:bg-[#d4863e] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-xs transition"
                                    >
                                      <CheckCircle2 size={16} />
                                      <span>Record Evaluation & Sync Learning Progress with Student</span>
                                    </button>
                                  </div>

                                  {/* HISTORICAL EVALUATIONS LIST */}
                                  <div className="space-y-3 pt-2">
                                    <h5 className="font-bold text-xs uppercase text-gray-900 font-mono tracking-wider">
                                      EVALUATION HISTORY ({evaluationsList.length})
                                    </h5>

                                    {evaluationsList.length === 0 ? (
                                      <p className="text-center text-gray-400 italic text-xs py-4 border border-dashed border-gray-200 rounded-xl">
                                        No formal evaluation logs recorded yet for {selectedStudent.name}.
                                      </p>
                                    ) : (
                                      <div className="space-y-3">
                                        {evaluationsList.map((ev) => (
                                          <div key={ev.id} className="p-4 bg-white border border-gray-200 rounded-xl space-y-2.5 text-xs shadow-2xs">
                                            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                                              <div className="flex items-center gap-2">
                                                <span className="font-extrabold text-amber-900 bg-amber-100 px-2 py-0.5 rounded font-mono text-[10px]">
                                                  Grade: {ev.grade || 'A'}
                                                </span>
                                                <span className="font-mono font-bold text-[#E89B52]">
                                                  {ev.overallProgressPercent}% Mastery
                                                </span>
                                              </div>
                                              <span className="text-[10px] text-gray-400 font-mono">
                                                {new Date(ev.evaluatedAt).toLocaleDateString()}
                                              </span>
                                            </div>

                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[11px] font-medium text-gray-600 bg-[#FAF6EF]/50 p-2 rounded-lg">
                                              <div>Tuning: <strong className="text-amber-800">{ev.tuningScore}/5 ★</strong></div>
                                              <div>Rhythm: <strong className="text-amber-800">{ev.rhythmScore}/5 ★</strong></div>
                                              <div>Technique: <strong className="text-amber-800">{ev.techniqueScore}/5 ★</strong></div>
                                              <div>Piece Mastery: <strong className="text-amber-800">{ev.pieceMasteryScore}/5 ★</strong></div>
                                            </div>

                                            <p className="text-gray-800 italic leading-relaxed text-[11px]">
                                              "{ev.teacherNotes}"
                                            </p>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}

                              {/* SUB-TAB 2: ATTENDANCE LOG */}
                              {studentDetailSubTab === 'attendance' && (
                                <div className="bg-white border border-[#E7DED1] p-6 rounded-2xl shadow-2xs space-y-5 animate-fadeIn">
                                  <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                                    <div>
                                      <span className="text-[10px] font-mono tracking-widest text-[#E89B52] uppercase font-bold">STAFF VERIFIED</span>
                                      <h4 className="font-display font-black text-sm uppercase text-gray-900 flex items-center gap-2">
                                        <Calendar size={16} className="text-[#E89B52]" />
                                        CLASS ATTENDANCE RECORD
                                      </h4>
                                    </div>
                                    <span className="text-xs font-mono font-bold bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full border border-emerald-200">
                                      Rate: {attRate}%
                                    </span>
                                  </div>

                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center text-xs">
                                    <div className="p-3 bg-green-50 border border-green-200 rounded-xl">
                                      <span className="block text-[10px] text-green-700 font-bold uppercase">Present</span>
                                      <span className="text-lg font-black font-mono text-green-900">{presCount}</span>
                                    </div>
                                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                                      <span className="block text-[10px] text-red-700 font-bold uppercase">Absent</span>
                                      <span className="text-lg font-black font-mono text-red-900">{absCount}</span>
                                    </div>
                                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
                                      <span className="block text-[10px] text-amber-700 font-bold uppercase">Late</span>
                                      <span className="text-lg font-black font-mono text-amber-900">{latCount}</span>
                                    </div>
                                    <div className="p-3 bg-sky-50 border border-sky-200 rounded-xl">
                                      <span className="block text-[10px] text-sky-700 font-bold uppercase">Permission</span>
                                      <span className="text-lg font-black font-mono text-sky-900">{permCount}</span>
                                    </div>
                                  </div>

                                  {studentAtt.length === 0 ? (
                                    <div className="p-8 text-center border border-dashed border-gray-200 rounded-2xl text-gray-400 space-y-1">
                                      <Calendar size={28} className="mx-auto text-gray-300" />
                                      <p className="text-xs font-bold text-gray-500">No Attendance Records Yet</p>
                                      <p className="text-[11px]">Attendance is recorded by staff during weekly class check-ins.</p>
                                    </div>
                                  ) : (
                                    <div className="overflow-x-auto border border-[#E7DED1] rounded-2xl">
                                      <table className="w-full text-left text-xs">
                                        <thead className="bg-[#FAF6EF] border-b border-[#E7DED1] font-mono text-[10px] uppercase text-gray-500">
                                          <tr>
                                            <th className="p-3">Date</th>
                                            <th className="p-3">Class / Session</th>
                                            <th className="p-3">Status</th>
                                            <th className="p-3">Staff Verification</th>
                                          </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                          {studentAtt.map((att) => (
                                            <tr key={att.id} className="hover:bg-gray-50">
                                              <td className="p-3 font-mono font-bold text-gray-800">{att.date}</td>
                                              <td className="p-3 font-medium text-gray-700">{att.className || selectedStudent.course}</td>
                                              <td className="p-3">
                                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${
                                                  att.status === 'Present'
                                                    ? 'bg-green-100 text-green-800 border-green-200'
                                                    : att.status === 'Absent'
                                                    ? 'bg-red-100 text-red-800 border-red-200'
                                                    : 'bg-amber-100 text-amber-800 border-amber-200'
                                                }`}>
                                                  {att.status}
                                                </span>
                                              </td>
                                              <td className="p-3 text-gray-500 italic">{att.notes || 'Verified by Campus Registration'}</td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* SUB-TAB 3: PERSISTENT TEACHER CHAT */}
                              {studentDetailSubTab === 'chat' && (
                                <div className="bg-white border border-[#E7DED1] p-6 rounded-2xl shadow-2xs space-y-4 animate-fadeIn">
                                  <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                                    <h4 className="font-display font-black text-sm uppercase text-gray-900 flex items-center gap-2">
                                      <MessageSquare size={16} className="text-[#E89B52]" />
                                      DIRECT MESSAGING WITH {selectedStudent.name}
                                    </h4>
                                    <span className="text-[10px] font-mono text-gray-400">
                                      Enrollment ID: {selectedStudent.enrollmentId}
                                    </span>
                                  </div>

                                  <div className="border border-[#E7DED1] rounded-2xl p-4 bg-[#FAF6EF]/30 h-80 overflow-y-auto space-y-3 text-xs">
                                    {studentMessages.length === 0 ? (
                                      <p className="text-center text-gray-400 italic py-12">
                                        No messages in thread yet. Start the conversation with {selectedStudent.name}.
                                      </p>
                                    ) : (
                                      studentMessages.map((msg, idx) => {
                                        const isMe = msg.senderRole === 'teacher';

                                        return (
                                          <div key={msg.id ? `${msg.id}_${idx}` : `msg_${idx}`} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                            <div className={`p-3 rounded-2xl max-w-sm space-y-1 shadow-2xs ${
                                              isMe ? 'bg-[#E89B52] text-white' : 'bg-white border border-[#E7DED1] text-gray-900'
                                            }`}>
                                              <p className="text-xs leading-relaxed">{msg.text}</p>
                                            </div>
                                            <span className="text-[9px] font-mono text-gray-400 mt-0.5 px-1">
                                              {msg.senderName} • {msg.timestamp}
                                            </span>
                                          </div>
                                        );
                                      })
                                    )}
                                  </div>

                                  <div className="flex gap-2">
                                    <input
                                      type="text"
                                      placeholder={`Write a message to ${selectedStudent.name}...`}
                                      className="flex-1 p-3 bg-[#FAF6EF]/50 border border-[#E7DED1] rounded-xl text-xs outline-none focus:border-[#E89B52]"
                                      value={studentChatInput}
                                      onChange={(e) => setStudentChatInput(e.target.value)}
                                      onKeyDown={(e) => e.key === 'Enter' && handleSendStudentChat()}
                                    />
                                    <button
                                      onClick={handleSendStudentChat}
                                      disabled={!studentChatInput.trim()}
                                      className="px-5 py-3 bg-[#E89B52] hover:bg-[#d4863e] disabled:opacity-50 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
                                    >
                                      <Send size={15} /> Send
                                    </button>
                                  </div>
                                </div>
                              )}

                              {/* SUB-TAB 4: OFFICIAL CERTIFICATE & VERIFICATION CODE */}
                              {studentDetailSubTab === 'certificate' && (
                                <div className="bg-white border border-[#E7DED1] p-6 rounded-2xl shadow-2xs space-y-6 animate-fadeIn">
                                  <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                                    <div>
                                      <span className="text-[10px] font-mono tracking-widest text-[#E89B52] uppercase font-bold">OFFICIAL CREDENTIALS</span>
                                      <h4 className="font-display font-black text-sm uppercase text-gray-900 flex items-center gap-2">
                                        <Award size={16} className="text-[#E89B52]" />
                                        ACADEMY DIPLOMA & VERIFICATION
                                      </h4>
                                    </div>
                                    {existingCert && (
                                      <span className="text-xs font-mono font-bold bg-emerald-100 text-emerald-900 px-3 py-1 rounded-full border border-emerald-300 flex items-center gap-1">
                                        ✓ VERIFIED
                                      </span>
                                    )}
                                  </div>

                                  {certIssuedNotice && (
                                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 font-bold flex items-center gap-2 animate-bounce">
                                      <CheckCircle size={16} className="text-emerald-600 shrink-0" />
                                      <span>Official Certificate and Verification Code Issued Successfully!</span>
                                    </div>
                                  )}

                                  {existingCert ? (
                                    <div className="border-2 border-[#E89B52] bg-gradient-to-br from-[#FFFBF5] to-[#FAF3E8] p-6 rounded-2xl space-y-5 relative overflow-hidden shadow-sm">
                                      <div className="flex items-start justify-between">
                                        <div>
                                          <span className="text-[10px] font-mono tracking-widest text-[#E89B52] font-black uppercase">LIORA BEGENA & KRAR ACADEMY</span>
                                          <h3 className="font-display font-black text-xl text-gray-900">OFFICIAL CERTIFICATE OF COMPLETION</h3>
                                          <p className="text-xs text-gray-600 mt-1">This verifies that <strong className="text-gray-900">{existingCert.studentName}</strong> has successfully completed the full curriculum for <strong className="text-[#E89B52]">{existingCert.courseName}</strong>.</p>
                                        </div>
                                        <Award size={48} className="text-[#E89B52] shrink-0" />
                                      </div>

                                      <div className="grid grid-cols-2 gap-4 bg-white/80 p-4 rounded-xl border border-amber-200 text-xs">
                                        <div>
                                          <span className="text-gray-400 font-bold block text-[9px] uppercase">Unique Verification Code:</span>
                                          <span className="font-mono font-black text-base text-[#E89B52] select-all block">{existingCert.verificationCode}</span>
                                        </div>
                                        <div>
                                          <span className="text-gray-400 font-bold block text-[9px] uppercase">Issue Date & Faculty:</span>
                                          <span className="font-bold text-gray-800 block">{existingCert.issuedAt} • {existingCert.issuedByTeacherName}</span>
                                        </div>
                                      </div>

                                      <div className="flex items-center justify-between pt-2">
                                        <button
                                          onClick={() => navigator.clipboard.writeText(existingCert.verificationCode)}
                                          className="px-4 py-2 bg-[#E89B52] hover:bg-[#d4863e] text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
                                        >
                                          Copy Verification Code
                                        </button>

                                        <button
                                          onClick={() => window.print()}
                                          className="px-4 py-2 bg-white border border-[#E7DED1] hover:bg-gray-50 text-gray-800 font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
                                        >
                                          <FileText size={14} /> Print / Save PDF
                                        </button>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="space-y-4 text-xs">
                                      <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl space-y-2">
                                        <h5 className="font-bold text-amber-900 text-sm">Certificate Eligibility Status</h5>
                                        <p className="text-amber-800 leading-relaxed">
                                          Curriculum Progress: <strong>{selectedStudent.progress}%</strong> ({completedIds.length} of {studentLssns.length} required lessons completed).
                                        </p>
                                      </div>

                                      <button
                                        onClick={handleIssueStudentCertificate}
                                        disabled={(selectedStudent.progress || 0) < 100}
                                        className={`w-full py-3 font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-xs transition ${
                                          (selectedStudent.progress || 0) >= 100
                                            ? 'bg-[#E89B52] hover:bg-[#d4863e] text-white cursor-pointer'
                                            : 'bg-gray-200 text-gray-500 cursor-not-allowed border border-gray-300'
                                        }`}
                                      >
                                        <Award size={16} />
                                        <span>
                                          {(selectedStudent.progress || 0) >= 100
                                            ? 'Issue Official Certificate & Generate Verification Code'
                                            : 'Certificate Issuance Locked (100% Progress Required)'}
                                        </span>
                                      </button>
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* SUB-TAB 5: PRIVATE TEACHER NOTES */}
                              {studentDetailSubTab === 'notes' && (
                                <div className="bg-white border border-[#E7DED1] p-6 rounded-2xl shadow-2xs space-y-4 animate-fadeIn">
                                  <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                                    <h4 className="font-display font-black text-sm uppercase text-gray-900 flex items-center gap-2">
                                      <FileText size={16} className="text-[#E89B52]" />
                                      PRIVATE TEACHER NOTES FOR {selectedStudent.name}
                                    </h4>
                                    {noteSavedNotice && (
                                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                                        ✓ Saved Privately
                                      </span>
                                    )}
                                  </div>

                                  <p className="text-xs text-gray-500">
                                    These notes are private to you as the assigned instructor and will not be displayed to the student.
                                  </p>

                                  <textarea
                                    placeholder="Add private observations regarding technique, finger placement, practice habits..."
                                    className="w-full p-3 bg-[#FAF6EF]/50 border border-[#E7DED1] rounded-xl text-xs outline-none focus:border-[#E89B52] h-40"
                                    value={studentPrivateNote}
                                    onChange={(e) => setStudentPrivateNote(e.target.value)}
                                  />

                                  <div className="flex justify-end">
                                    <button
                                      onClick={handleSaveNote}
                                      className="px-5 py-2.5 bg-[#E89B52] hover:bg-[#d4863e] text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
                                    >
                                      Save Private Notes
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </div>
              )}

              {/* -------------------------------------------------- */}
              {/* TAB 3: MY CLASSES / CLASS ROSTER */}
              {/* -------------------------------------------------- */}
              {activeTab === 'classes' && (
                <div className="space-y-6 animate-fadeIn">
                  {!selectedClassId ? (
                    <div className="space-y-4">
                      <div className="bg-white border border-[#E7DED1] p-6 rounded-2xl shadow-2xs space-y-1">
                        <span className="text-[10px] font-mono tracking-widest text-[#E89B52] uppercase font-bold">Class Roster</span>
                        <h3 className="font-display font-black text-xl uppercase tracking-tight text-gray-900">MY ASSIGNED CLASSES</h3>
                        <p className="text-xs text-gray-500">View active classes and student groups assigned to you.</p>
                      </div>

                      {myAssignedClasses.length === 0 ? (
                        <div className="p-12 text-center bg-white border border-[#E7DED1] rounded-2xl text-gray-400">
                          <Building size={32} className="mx-auto text-gray-300 mb-2" />
                          <p className="font-bold text-xs text-gray-500">No active classes assigned yet.</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {myAssignedClasses.map(cl => (
                            <div key={cl.id} className="bg-white border border-[#E7DED1] p-6 rounded-2xl shadow-2xs space-y-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-display font-black text-base text-gray-900">{cl.courseName}</h4>
                                  <span className="text-[11px] text-gray-500 font-mono block mt-0.5">
                                    Instrument: {cl.instrument} • Level: {cl.level}
                                  </span>
                                </div>
                                <span className={`text-[10px] px-2 py-1 rounded font-mono font-bold uppercase ${cl.mode === 'Online' ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-[#E89B52]'}`}>
                                  {cl.mode}
                                </span>
                              </div>

                              <div className="space-y-1 text-xs text-gray-600 border-t border-gray-100 pt-3">
                                <div className="flex justify-between"><span className="text-gray-400">Branch:</span><span className="font-bold">{cl.branch}</span></div>
                                <div className="flex justify-between"><span className="text-gray-400">Schedule:</span><span className="font-mono font-bold">{cl.scheduleDays.join(', ')} ({cl.classTime})</span></div>
                                <div className="flex justify-between"><span className="text-gray-400">Enrolled Students:</span><span className="font-mono font-bold text-gray-900">{cl.studentsCount} Students</span></div>
                              </div>

                              <button
                                onClick={() => setSelectedClassId(cl.id)}
                                className="w-full py-2.5 bg-[#E89B52] hover:bg-[#d4863e] text-white font-bold text-xs rounded-xl cursor-pointer"
                              >
                                Open Class Details
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    /* CLASS DETAIL VIEW */
                    <div className="space-y-6">
                      <button
                        onClick={() => setSelectedClassId(null)}
                        className="text-xs font-bold text-gray-500 hover:text-gray-900 flex items-center gap-1.5 cursor-pointer"
                      >
                        <ArrowLeft size={14} /> Back to My Classes
                      </button>

                      <div className="bg-white border border-[#E7DED1] p-6 rounded-2xl shadow-2xs space-y-4">
                        <div className="flex justify-between items-start border-b border-gray-100 pb-4">
                          <div>
                            <span className="text-[10px] font-mono font-bold text-[#E89B52] uppercase">Class Management</span>
                            <h3 className="font-display font-black text-xl text-gray-900">{selectedClass?.courseName}</h3>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {selectedClass?.instrument} • {selectedClass?.level} • {selectedClass?.branch}
                            </p>
                          </div>

                          {selectedClass?.mode === 'Online' && selectedClass.meetLink && (
                            <a
                              href={selectedClass.meetLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center gap-2"
                            >
                              <Video size={14} /> Join Google Meet
                            </a>
                          )}
                        </div>

                        <h4 className="font-bold text-xs text-gray-800 uppercase font-mono">Enrolled Student Roster</h4>
                        <div className="space-y-2">
                          {selectedClass?.students.map(s => (
                            <div key={s.id} className="p-3 bg-[#FAF6EF]/30 border border-[#E7DED1] rounded-xl flex justify-between items-center text-xs">
                              <div className="flex items-center gap-3">
                                {s.photo ? (
                                  <img src={s.photo} className="w-8 h-8 rounded-full object-cover border border-[#E7DED1]" alt="" referrerPolicy="no-referrer" />
                                ) : (
                                  <div className="w-8 h-8 rounded-full bg-[#3B2818] text-[#E89B52] flex items-center justify-center font-bold text-xs shrink-0">
                                    {s.name?.charAt(0) || 'S'}
                                  </div>
                                )}
                                <div>
                                  <span className="font-bold text-gray-900 block">{s.name}</span>
                                  <span className="text-[10px] text-gray-400 font-mono">{s.email}</span>
                                </div>
                              </div>

                              <button
                                onClick={() => {
                                  const nextSelectionKey = getStudentSelectionKey(s);
                                  setSelectedStudentId(nextSelectionKey);
                                  handleTabChange('students');
                                }}
                                className="px-3 py-1 bg-[#FAF6EF] hover:bg-[#E89B52] hover:text-white border border-[#E7DED1] rounded-lg font-bold text-[11px] cursor-pointer"
                              >
                                View Student Profile
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* -------------------------------------------------- */}
              {/* TAB 4: TEACHER COURSE CONTENT MANAGEMENT & SYLLABUS */}
              {/* -------------------------------------------------- */}
              {activeTab === 'courses' && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="bg-white border border-[#E7DED1] p-6 rounded-2xl shadow-2xs space-y-4">
                    <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                      <div>
                        <span className="text-[10px] font-mono font-bold text-gray-400 uppercase">Liturgical Syllabus Management</span>
                        <h3 className="font-display font-black text-xl text-gray-900">COURSE CONTENT & SYLLABUS CONTROL</h3>
                      </div>
                      <button
                        onClick={() => setIsCreatingChapter(true)}
                        className="px-4 py-2 bg-[#E89B52] hover:bg-[#d4863e] text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
                      >
                        <Plus size={14} /> Add Chapter
                      </button>
                    </div>

                    {/* CREATE CHAPTER FORM */}
                    {isCreatingChapter && (
                      <div className="p-4 bg-[#FAF6EF]/50 border border-[#E7DED1] rounded-2xl space-y-3 text-xs">
                        <h4 className="font-bold text-gray-800">Create New Chapter</h4>
                        <Input
                          placeholder="Chapter Title (e.g. Chapter 3: Advanced Plucking)"
                          value={newChapterTitle}
                          onChange={(e) => setNewChapterTitle(e.target.value)}
                        />
                        <textarea
                          placeholder="Chapter description and objectives..."
                          className="w-full p-2.5 bg-white border border-[#E7DED1] rounded-xl text-xs outline-none h-16"
                          value={newChapterDesc}
                          onChange={(e) => setNewChapterDesc(e.target.value)}
                        />
                        <div className="flex gap-2">
                          <button onClick={handleCreateChapter} className="px-4 py-2 bg-[#E89B52] text-white font-bold rounded-xl text-xs cursor-pointer">
                            Save Chapter
                          </button>
                          <button onClick={() => setIsCreatingChapter(false)} className="px-4 py-2 bg-gray-100 font-bold rounded-xl text-xs cursor-pointer">
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}

                    {/* CHAPTERS AND LESSONS LIST */}
                    <div className="space-y-6">
                      {chapters.map((chap, cIdx) => {
                        const chapterLessons = lessons.filter(l => l.chapterId === chap.id);

                        return (
                          <div key={chap.id} className="border border-[#E7DED1] rounded-2xl overflow-hidden bg-white shadow-2xs">
                            <div className="bg-[#FAF6EF] p-4 flex justify-between items-center border-b border-[#E7DED1]">
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-mono text-xs font-bold text-[#E89B52]">CHAPTER {cIdx + 1}</span>
                                  <h4 className="font-bold text-sm text-gray-900">{chap.title}</h4>
                                  <span className={`text-[9px] px-2 py-0.5 rounded font-mono font-bold uppercase ${chap.status === 'Published' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                                    {chap.status}
                                  </span>
                                </div>
                                <p className="text-xs text-gray-500 mt-0.5">{chap.description}</p>
                              </div>

                              <button
                                onClick={() => toggleChapterStatus(chap.id)}
                                className="px-3 py-1.5 bg-white border border-[#E7DED1] hover:bg-gray-50 font-bold text-xs rounded-xl cursor-pointer"
                              >
                                {chap.status === 'Published' ? 'Unpublish Chapter' : 'Publish Chapter'}
                              </button>
                            </div>

                            {/* LESSONS INSIDE CHAPTER */}
                            <div className="p-4 space-y-3">
                              {chapterLessons.length === 0 ? (
                                <p className="text-xs text-gray-400 italic text-center py-2">
                                  No lessons in this chapter yet. Use the Lesson Builder to add lessons.
                                </p>
                              ) : (
                                chapterLessons.map((les, lIdx) => (
                                  <div key={les.id} className="p-3 bg-white border border-gray-100 rounded-xl flex justify-between items-center text-xs hover:bg-[#FAF6EF]/20">
                                    <div className="space-y-0.5">
                                      <div className="flex items-center gap-2">
                                        <span className="font-mono font-bold text-gray-400">Lesson {lIdx + 1}:</span>
                                        <span className="font-bold text-gray-900">{les.title}</span>
                                        <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold uppercase ${les.status === 'Published' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                          {les.status}
                                        </span>
                                      </div>
                                      <p className="text-[11px] text-gray-500">{les.description}</p>
                                    </div>

                                    <div className="flex items-center gap-2">
                                      <button
                                        onClick={() => toggleLessonStatus(les.id)}
                                        className="px-2.5 py-1 bg-[#FAF6EF] hover:bg-[#E89B52] hover:text-white border border-[#E7DED1] rounded-lg text-[11px] font-bold cursor-pointer"
                                      >
                                        {les.status === 'Published' ? 'Unpublish' : 'Publish'}
                                      </button>
                                      <button
                                        onClick={() => handleDeleteLesson(les.id)}
                                        className="p-1 text-red-500 hover:bg-red-50 rounded cursor-pointer"
                                        title="Delete Lesson"
                                      >
                                        <Trash2 size={14} />
                                      </button>
                                    </div>
                                  </div>
                                ))
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* LESSON BUILDER FORM */}
                  <div className="bg-white border border-[#E7DED1] p-6 rounded-2xl shadow-2xs space-y-4 text-xs">
                    <h3 className="font-display font-black text-sm uppercase text-gray-900 border-b border-gray-100 pb-3">
                      LESSON BUILDER
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase font-mono">Lesson Title</label>
                        <Input
                          placeholder="e.g. Lesson 4: Alternate Plucking Practice"
                          value={newLessonTitle}
                          onChange={(e) => setNewLessonTitle(e.target.value)}
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase font-mono">Parent Chapter</label>
                        <select
                          className="w-full p-2 bg-[#FAF6EF]/50 border border-[#E7DED1] rounded-xl font-bold outline-none"
                          value={newLessonChapterId}
                          onChange={(e) => setNewLessonChapterId(e.target.value)}
                        >
                          {chapters.map(c => (
                            <option key={c.id} value={c.id}>{c.title}</option>
                          ))}
                        </select>
                      </div>

                      <div className="md:col-span-2 space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase font-mono">Description & Instructions</label>
                        <textarea
                          placeholder="Lesson notes, history, or instructions..."
                          className="w-full p-2.5 bg-[#FAF6EF]/50 border border-[#E7DED1] rounded-xl h-20 outline-none"
                          value={newLessonDesc}
                          onChange={(e) => setNewLessonDesc(e.target.value)}
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase font-mono">Video Demo URL</label>
                        <Input
                          placeholder="https://..."
                          value={newLessonVideoUrl}
                          onChange={(e) => setNewLessonVideoUrl(e.target.value)}
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase font-mono">Numerical Notation Sequence</label>
                        <Input
                          placeholder="e.g. 1 3 3 2 1"
                          value={newLessonNotation}
                          onChange={(e) => setNewLessonNotation(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={() => handleCreateLesson(false)}
                        className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-xl text-xs cursor-pointer"
                      >
                        Save as Draft
                      </button>
                      <button
                        onClick={() => handleCreateLesson(true)}
                        className="flex-1 py-2.5 bg-[#E89B52] hover:bg-[#d4863e] text-white font-bold rounded-xl text-xs cursor-pointer"
                      >
                        Publish Lesson Immediately
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* -------------------------------------------------- */}
              {/* TAB 5: ASSIGNMENTS & SUBMISSION GRADING */}
              {/* -------------------------------------------------- */}
              {activeTab === 'assignments' && (
                <div className="space-y-6 animate-fadeIn">
                  {!activeReviewId ? (
                    <div className="space-y-6">
                      {/* PENDING SUBMISSIONS LIST */}
                      <div className="bg-white border border-[#E7DED1] p-6 rounded-2xl shadow-2xs space-y-4">
                        <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                          <h3 className="font-display font-black text-sm uppercase text-gray-900">STUDENT SUBMISSIONS & RECITALS</h3>
                          <span className="text-xs font-bold text-[#E89B52]">
                            {pendingReviewSubmissions.length} Pending Review
                          </span>
                        </div>

                        {submissions.length === 0 ? (
                          <div className="p-8 text-center text-gray-400">
                            No student submissions recorded yet.
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {submissions.map(sub => (
                              <div key={sub.id} className="p-4 border border-[#E7DED1] rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-3 bg-[#FAF6EF]/20">
                                <div>
                                  <span className="text-[10px] font-mono font-bold text-[#E89B52] uppercase">{sub.courseName}</span>
                                  <h4 className="font-bold text-xs text-gray-900 mt-0.5">{sub.studentName}</h4>
                                  <span className="text-[11px] text-gray-500 block mt-0.5">{sub.assignmentTitle} • Submitted {sub.submittedAt}</span>
                                </div>

                                <div className="flex items-center gap-3 text-xs">
                                  <span className={`px-2.5 py-1 rounded font-mono font-bold text-[10px] uppercase ${sub.status === 'Graded' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-800'}`}>
                                    {sub.status}
                                  </span>
                                  <button
                                    onClick={() => setActiveReviewId(sub.id)}
                                    className="px-3 py-1.5 bg-[#E89B52] text-white font-bold rounded-xl text-xs cursor-pointer"
                                  >
                                    {sub.status === 'Graded' ? 'View Feedback' : 'Grade Submission'}
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* CREATE ASSIGNMENT FORM */}
                      <div className="bg-white border border-[#E7DED1] p-6 rounded-2xl shadow-2xs space-y-4 text-xs">
                        <h3 className="font-display font-black text-sm uppercase text-gray-900 border-b border-gray-100 pb-3">
                          CREATE ASSIGNMENT
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase font-mono">Assignment Title</label>
                            <Input
                              placeholder="e.g. Week 4 Recital: Seyfe Selassie Hymn"
                              value={asgTitle}
                              onChange={(e) => setAsgTitle(e.target.value)}
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase font-mono">Due Date</label>
                            <Input
                              type="date"
                              value={asgDueDate}
                              onChange={(e) => setAsgDueDate(e.target.value)}
                            />
                          </div>

                          <div className="md:col-span-2 space-y-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase font-mono">Instructions & Guidance</label>
                            <textarea
                              placeholder="Describe what the student should record and submit..."
                              className="w-full p-2.5 bg-[#FAF6EF]/50 border border-[#E7DED1] rounded-xl h-20 outline-none"
                              value={asgInstructions}
                              onChange={(e) => setAsgInstructions(e.target.value)}
                            />
                          </div>
                        </div>

                        <Button
                          variant="primary"
                          className="w-full bg-[#E89B52] hover:bg-[#d4863e] text-white py-2.5 font-bold text-xs uppercase"
                          onClick={handleCreateAssignment}
                        >
                          Publish Assignment to Student Portal
                        </Button>
                      </div>
                    </div>
                  ) : (
                    /* GRADING ENVIRONMENT */
                    <div className="space-y-6">
                      <button
                        onClick={() => setActiveReviewId(null)}
                        className="text-xs font-bold text-gray-500 hover:text-gray-900 flex items-center gap-1.5 cursor-pointer"
                      >
                        <ArrowLeft size={14} /> Back to Submissions
                      </button>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs">
                        {/* SUBMISSION CONTENT */}
                        <div className="bg-white border border-[#E7DED1] p-6 rounded-2xl shadow-2xs space-y-4">
                          <h4 className="font-display font-black text-sm uppercase text-gray-900 border-b border-gray-100 pb-3">
                            STUDENT SUBMISSION
                          </h4>

                          <div className="space-y-2">
                            <div className="flex justify-between"><span className="text-gray-400">Student:</span><span className="font-bold">{activeReview?.studentName}</span></div>
                            <div className="flex justify-between"><span className="text-gray-400">Assignment:</span><span className="font-bold">{activeReview?.assignmentTitle}</span></div>
                            <div className="flex justify-between"><span className="text-gray-400">Submitted Date:</span><span className="font-mono">{activeReview?.submittedAt}</span></div>
                          </div>

                          <div className="p-3 bg-[#FAF6EF]/50 border border-[#E7DED1] rounded-xl space-y-1">
                            <span className="text-[10px] font-bold text-gray-400 uppercase">Student Notes:</span>
                            <p className="text-gray-700 italic">"{activeReview?.notes || 'No additional notes provided.'}"</p>
                          </div>

                          {activeReview?.submissionUrl && (
                            <div className="aspect-video bg-black rounded-xl overflow-hidden flex items-center justify-center">
                              <Video size={36} className="text-gray-500" />
                            </div>
                          )}
                        </div>

                        {/* GRADING SCORECARD */}
                        <div className="bg-white border border-[#E7DED1] p-6 rounded-2xl shadow-2xs space-y-4">
                          <h4 className="font-display font-black text-sm uppercase text-gray-900 border-b border-gray-100 pb-3">
                            GRADING & FEEDBACK
                          </h4>

                          {activeReview?.status === 'Pending Review' ? (
                            <div className="space-y-4">
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-400 uppercase font-mono">Grade Score (0 - 100)</label>
                                <input
                                  type="number"
                                  className="w-full p-2 bg-[#FAF6EF]/50 border border-[#E7DED1] rounded-xl font-mono font-bold text-center text-lg"
                                  value={gradeScore}
                                  onChange={(e) => setGradeScore(parseInt(e.target.value) || 0)}
                                />
                              </div>

                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-400 uppercase font-mono">Teacher Feedback & Recommendations</label>
                                <textarea
                                  placeholder="Provide constructive feedback..."
                                  className="w-full p-2.5 bg-[#FAF6EF]/50 border border-[#E7DED1] rounded-xl h-24 outline-none"
                                  value={feedbackText}
                                  onChange={(e) => setFeedbackText(e.target.value)}
                                />
                              </div>

                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleGradeSubmission(false)}
                                  className="flex-1 py-2.5 bg-red-50 text-red-700 font-bold rounded-xl text-xs border border-red-200 cursor-pointer"
                                >
                                  Request Correction
                                </button>
                                <button
                                  onClick={() => handleGradeSubmission(true)}
                                  className="flex-1 py-2.5 bg-[#E89B52] text-white font-bold rounded-xl text-xs cursor-pointer"
                                >
                                  Approve & Grade
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="p-4 bg-green-50 border border-green-200 rounded-2xl space-y-2 font-mono">
                              <div className="text-green-800 font-bold">STATUS: GRADED</div>
                              <div>Score: <span className="font-bold text-lg text-green-900">{activeReview?.score} / 100 ({activeReview?.letterGrade})</span></div>
                              <div>Feedback: <p className="italic text-gray-700 font-sans mt-1">"{activeReview?.feedback}"</p></div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* -------------------------------------------------- */}
              {/* TAB 6: ATTENDANCE VIEW */}
              {/* -------------------------------------------------- */}
              {activeTab === 'attendance' && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="bg-white border border-[#E7DED1] p-6 rounded-2xl shadow-2xs space-y-4">
                    <div className="border-b border-gray-100 pb-3">
                      <span className="text-[10px] font-mono font-bold text-gray-400 uppercase">Authorized System Logs</span>
                      <h3 className="font-display font-black text-xl text-gray-900">STUDENT ATTENDANCE VIEW</h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Attendance is recorded through authorized registration & class check-in workflows.
                      </p>
                    </div>

                    <div className="bg-white border border-[#E7DED1] rounded-2xl overflow-x-auto text-xs">
                      <table className="w-full text-left">
                        <thead className="bg-[#FAF6EF] text-[10px] font-bold text-gray-400 uppercase font-mono border-b border-[#E7DED1]">
                          <tr>
                            <th className="p-3.5">Student</th>
                            <th className="p-3.5">Course / Level</th>
                            <th className="p-3.5">Present</th>
                            <th className="p-3.5">Absent</th>
                            <th className="p-3.5">Late</th>
                            <th className="p-3.5">Attendance Consistency</th>
                          </tr>
                        </thead>
                        <tbody>
                          {myStudentsList.length === 0 ? (
                            <tr>
                              <td colSpan={6} className="p-8 text-center text-gray-400">
                                No assigned students to display attendance records.
                              </td>
                            </tr>
                          ) : (
                            myStudentsList.map(s => (
                              <tr key={s.id} className="border-b border-gray-100 hover:bg-[#FAF6EF]/20">
                                <td className="p-3.5 font-bold text-gray-900">{s.name}</td>
                                <td className="p-3.5 text-gray-600">{s.course}</td>
                                <td className="p-3.5 text-green-600 font-bold font-mono">{s.presentCount}</td>
                                <td className="p-3.5 text-red-600 font-bold font-mono">{s.absentCount}</td>
                                <td className="p-3.5 text-amber-600 font-bold font-mono">{s.lateCount}</td>
                                <td className="p-3.5 font-mono font-bold text-gray-800">
                                  {s.presentCount + s.absentCount > 0
                                    ? `${Math.round((s.presentCount / (s.presentCount + s.absentCount)) * 100)}%`
                                    : '100%'}
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

              {/* -------------------------------------------------- */}
              {/* TAB 7: SCHEDULE & TIMETABLE */}
              {/* -------------------------------------------------- */}
              {activeTab === 'schedule' && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="bg-white border border-[#E7DED1] p-6 rounded-2xl shadow-2xs space-y-4">
                    <span className="text-[10px] font-mono font-bold text-gray-400 uppercase">Weekly Timetable</span>
                    <h3 className="font-display font-black text-xl text-gray-900">CLASS TIMETABLE</h3>

                    {myAssignedClasses.length === 0 ? (
                      <div className="p-8 text-center text-gray-400">
                        No assigned classes scheduled.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {myAssignedClasses.map(cl => (
                          <div key={cl.id} className="p-4 border border-[#E7DED1] rounded-2xl space-y-2 bg-[#FAF6EF]/30">
                            <span className="font-mono text-xs font-bold text-[#E89B52] block">{cl.scheduleDays.join(', ')} • {cl.classTime}</span>
                            <h4 className="font-bold text-sm text-gray-900">{cl.courseName}</h4>
                            <p className="text-xs text-gray-500">{cl.instrument} ({cl.level}) • {cl.branch}</p>
                            <span className="text-[10px] text-gray-600 font-bold block pt-1">{cl.studentsCount} Students Enrolled</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* -------------------------------------------------- */}
              {/* TAB 8: ANNOUNCEMENTS & MESSAGES */}
              {/* -------------------------------------------------- */}
              {activeTab === 'messages' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn">
                  {/* DIRECT MESSAGES */}
                  <div className="lg:col-span-7 bg-white border border-[#E7DED1] rounded-2xl overflow-hidden shadow-2xs grid grid-cols-1 md:grid-cols-3 min-h-[400px]">
                    <div className="border-r border-gray-100 p-4 space-y-2 bg-[#FCFBF8]">
                      <span className="text-[10px] font-bold text-gray-400 uppercase font-mono block">Assigned Students</span>
                      <div className="space-y-1 text-xs">
                        {myStudentsList.length === 0 ? (
                          <p className="text-gray-400 italic text-[11px]">No students assigned yet.</p>
                        ) : (
                          myStudentsList.map(s => (
                            <button
                              key={s.id}
                              onClick={() => setSelectedChatStudentId(s.id)}
                              className={`w-full text-left p-2 rounded-xl flex items-center gap-2 cursor-pointer ${selectedChatStudentId === s.id ? 'bg-[#FAF6EF] border border-[#E7DED1] font-bold' : 'hover:bg-gray-100'}`}
                            >
                              {s.photo ? (
                                <img src={s.photo} className="w-6 h-6 rounded-full object-cover" alt="" referrerPolicy="no-referrer" />
                              ) : (
                                <div className="w-6 h-6 rounded-full bg-[#3B2818] text-[#E89B52] flex items-center justify-center font-bold text-[10px] shrink-0">
                                  {s.name?.charAt(0) || 'S'}
                                </div>
                              )}
                              <span className="truncate text-xs">{s.name}</span>
                            </button>
                          ))
                        )}
                      </div>
                    </div>

                    <div className="md:col-span-2 flex flex-col justify-between p-4">
                      <div className="border-b border-gray-100 pb-2">
                        <span className="font-bold text-xs text-gray-900">
                          {myStudentsList.find(s => s.id === selectedChatStudentId)?.name || 'Direct Chat'}
                        </span>
                      </div>

                      <div className="flex-1 py-4 space-y-3 overflow-y-auto max-h-64 text-xs">
                        {(!selectedChatStudentId || !chatMessages[selectedChatStudentId] || chatMessages[selectedChatStudentId].length === 0) ? (
                          <p className="text-center text-gray-400 text-xs italic py-8">No messages yet.</p>
                        ) : (
                          chatMessages[selectedChatStudentId].map((msg, idx) => (
                            <div key={idx} className={`flex flex-col ${msg.sender === 'teacher' ? 'items-end' : 'items-start'}`}>
                              <div className={`p-3 rounded-2xl max-w-xs ${msg.sender === 'teacher' ? 'bg-[#E89B52] text-white' : 'bg-gray-100 text-gray-800'}`}>
                                {msg.text}
                              </div>
                              <span className="text-[9px] text-gray-400 font-mono mt-0.5">{msg.time}</span>
                            </div>
                          ))
                        )}
                      </div>

                      <div className="flex gap-2 pt-2 border-t border-gray-100">
                        <input
                          type="text"
                          placeholder="Type message..."
                          className="flex-1 p-2 bg-[#FAF6EF]/50 border border-[#E7DED1] rounded-xl text-xs outline-none"
                          value={chatInputText}
                          onChange={(e) => setChatInputText(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleSendChatMessage()}
                        />
                        <button onClick={handleSendChatMessage} className="p-2 bg-[#E89B52] text-white rounded-xl cursor-pointer">
                          <Send size={16} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* ANNOUNCEMENTS BROADCAST */}
                  <div className="lg:col-span-5 bg-white border border-[#E7DED1] p-6 rounded-2xl shadow-2xs space-y-4 text-xs">
                    <h3 className="font-display font-black text-sm uppercase text-gray-900 border-b border-gray-100 pb-3">
                      BROADCAST ANNOUNCEMENT
                    </h3>

                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase font-mono">Title</label>
                        <Input
                          placeholder="Notice title..."
                          value={annTitle}
                          onChange={(e) => setAnnTitle(e.target.value)}
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase font-mono">Message</label>
                        <textarea
                          placeholder="Type announcement message..."
                          className="w-full p-2 bg-[#FAF6EF]/50 border border-[#E7DED1] rounded-xl h-20 outline-none"
                          value={annMessage}
                          onChange={(e) => setAnnMessage(e.target.value)}
                        />
                      </div>

                      <button
                        onClick={handlePostAnnouncement}
                        className="w-full py-2.5 bg-[#E89B52] hover:bg-[#d4863e] text-white font-bold rounded-xl cursor-pointer"
                      >
                        Send Announcement
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* -------------------------------------------------- */}
              {/* TAB 9: MY PROFILE & TELEGRAM HANDLE */}
              {/* -------------------------------------------------- */}
              {activeTab === 'profile' && (
                <div className="bg-white border border-[#E7DED1] p-6 rounded-2xl shadow-2xs space-y-4 text-xs animate-fadeIn">
                  <h3 className="font-display font-black text-base uppercase text-gray-900 border-b border-gray-100 pb-3">
                    TEACHER PROFILE & CONTACT
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase">Biography</label>
                        <textarea
                          className="w-full p-3 bg-[#FAF6EF]/50 border border-[#E7DED1] rounded-xl h-24 outline-none"
                          value={teacherBioInput}
                          onChange={(e) => setTeacherBioInput(e.target.value)}
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-sky-700 uppercase flex items-center gap-1">
                          💬 Telegram Contact Handle (@username)
                        </label>
                        <div className="relative flex items-center">
                          <span className="absolute left-3 font-bold text-sky-600">@</span>
                          <Input
                            className="pl-7 font-mono font-bold text-sky-900 bg-sky-50/50 border-sky-200"
                            value={telegramHandleInput}
                            onChange={(e) => setTelegramHandleInput(e.target.value)}
                            placeholder="e.g. abel_begena"
                          />
                        </div>
                        <p className="text-[10px] text-gray-400">
                          Assigned online students will see this handle in their portal to contact you.
                        </p>
                      </div>

                      <Button
                        variant="primary"
                        className="w-full bg-[#E89B52] text-white py-2.5 font-bold cursor-pointer"
                        onClick={handleSaveTeacherProfile}
                      >
                        Save Profile Changes
                      </Button>
                    </div>

                    <div className="p-4 bg-[#FAF6EF]/40 border border-[#E7DED1] rounded-2xl space-y-2 text-gray-600 font-mono text-[11px]">
                      <div className="font-bold text-gray-900 mb-2">ACCOUNT SPECIFICATIONS</div>
                      <div>Full Name: <span className="font-bold text-gray-800">{teacherProfile?.fullName}</span></div>
                      <div>Email: <span className="font-bold text-gray-800">{teacherProfile?.email}</span></div>
                      <div>Specializations: <span className="font-bold text-gray-800">{teacherProfile?.specializations?.join(', ')}</span></div>
                      <div>Branches: <span className="font-bold text-gray-800">{teacherProfile?.branches?.join(', ')}</span></div>
                      <div>Account Role: <span className="text-green-700 font-bold">TEACHER</span></div>
                    </div>
                  </div>
                </div>
              )}

              {/* -------------------------------------------------- */}
              {/* TAB 10: ACTIVITY LOG */}
              {/* -------------------------------------------------- */}
              {activeTab === 'activity' && (
                <div className="bg-white border border-[#E7DED1] p-6 rounded-2xl shadow-2xs space-y-4 animate-fadeIn">
                  <span className="text-[10px] font-mono font-bold text-gray-400 uppercase">Auditable Log</span>
                  <h3 className="font-display font-black text-xl text-gray-900">ACTIVITY REGISTRY</h3>

                  <div className="space-y-2 font-mono text-xs">
                    {activities.map(act => (
                      <div key={act.id} className="p-3 bg-[#FAF6EF]/30 border border-gray-100 rounded-xl flex justify-between items-center">
                        <div>
                          <span className="font-bold text-gray-900 block">{act.action}</span>
                          <span className="text-gray-500">{act.details}</span>
                        </div>
                        <span className="text-gray-400 text-[10px]">{act.timestamp}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>
      {/* CERTIFICATE CODE VERIFICATION LOOKUP MODAL */}
      {isVerifyModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white border-2 border-[#E89B52] rounded-3xl p-6 max-w-lg w-full space-y-5 shadow-2xl relative">
            <div className="flex items-start justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-amber-100 text-[#E89B52] rounded-xl">
                  <Award size={20} />
                </div>
                <div>
                  <h3 className="font-display font-black text-base text-gray-900 uppercase">OFFICIAL CERTIFICATE VERIFICATION</h3>
                  <p className="text-xs text-gray-500">Verify authenticity of Liora Begena & Krar Academy certificates</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsVerifyModalOpen(false);
                  setLookupCertResult(null);
                  setLookupCertError('');
                  setLookupCodeInput('');
                }}
                className="p-1.5 hover:bg-gray-100 rounded-full text-gray-400 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-bold text-gray-500 uppercase font-mono block">
                Enter Certificate Code (e.g. AB-CERT-KRAR-2026-X8K9M2)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="AB-CERT-..."
                  className="flex-1 p-3 bg-[#FAF6EF]/50 border border-[#E7DED1] rounded-xl font-mono text-xs font-bold uppercase outline-none focus:border-[#E89B52]"
                  value={lookupCodeInput}
                  onChange={(e) => setLookupCodeInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleLookupCertificate()}
                />
                <button
                  onClick={handleLookupCertificate}
                  className="px-5 py-3 bg-[#E89B52] hover:bg-[#d4863e] text-white font-bold text-xs rounded-xl cursor-pointer"
                >
                  Verify Code
                </button>
              </div>
            </div>

            {lookupCertError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 font-bold flex items-center gap-2">
                <AlertCircle size={16} className="text-red-600 shrink-0" />
                <span>{lookupCertError}</span>
              </div>
            )}

            {lookupCertResult && (
              <div className="p-5 bg-gradient-to-br from-amber-50 to-emerald-50 border-2 border-emerald-500 rounded-2xl space-y-3 text-xs shadow-xs animate-fadeIn">
                <div className="flex items-center justify-between border-b border-emerald-200/80 pb-2">
                  <span className="font-extrabold text-emerald-800 flex items-center gap-1.5 text-xs">
                    <CheckCircle size={16} className="text-emerald-600" />
                    AUTHENTICATED OFFICIAL DIPLOMA RECORD
                  </span>
                  <span className="font-mono text-[10px] bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded font-bold">
                    VERIFIED ACTIVE
                  </span>
                </div>

                <div className="space-y-1 text-gray-800">
                  <div className="flex justify-between"><span className="text-gray-500">Student Name:</span><strong className="text-gray-900">{lookupCertResult.studentName}</strong></div>
                  <div className="flex justify-between"><span className="text-gray-500">Course & Instrument:</span><strong className="text-[#E89B52]">{lookupCertResult.courseName}</strong></div>
                  <div className="flex justify-between"><span className="text-gray-500">Enrollment ID:</span><span className="font-mono font-bold">{lookupCertResult.enrollmentId}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Issued Date:</span><span className="font-mono">{lookupCertResult.issuedAt}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Issuing Instructor:</span><strong className="text-gray-900">{lookupCertResult.issuedByTeacherName}</strong></div>
                  <div className="flex justify-between"><span className="text-gray-500">Academy Campus:</span><span>{lookupCertResult.branch}</span></div>
                </div>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                onClick={() => {
                  setIsVerifyModalOpen(false);
                  setLookupCertResult(null);
                  setLookupCertError('');
                  setLookupCodeInput('');
                }}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs rounded-xl cursor-pointer"
              >
                Close Verification Window
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
