import React, { useState, useEffect } from 'react';
import {
  User,
  Users,
  BookOpen,
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  AlertCircle,
  FileText,
  DollarSign,
  TrendingUp,
  MapPin,
  ChevronRight,
  ShieldAlert,
  Send,
  Plus,
  ArrowUpRight,
  Filter,
  Check,
  X,
  Award,
  Bell,
  Settings,
  Flame,
  Search,
  BookCheck,
  Building,
  Activity,
  LogOut,
  HelpCircle,
  Eye,
  RefreshCw,
  Video,
  Lock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth, isStudentAccessGranted } from '../context/AuthContext';
import { safeSetItem } from '../utils/storage';
import { Button, Input } from './InteractiveComponents';
import { ThemeToggle } from './ThemeToggle';
import { TiletPattern } from './TiletPattern';
import { AdminPortal } from './AdminPortal';
import { ParentPortal } from './ParentPortal';
import { PageId, UserRole, StudentRegistrationStatus, AccountStatus } from '../types';
import { BegenaLearningModule } from './BegenaLearningModule';
import { CourseLearningPortal } from './CourseLearningPortal';
import { TeacherPortal } from './TeacherPortal';
import { RegistrationStaffPortal } from './RegistrationStaffPortal';
import { BranchManagerPortal } from './BranchManagerPortal';
import { AccountantPortal } from './AccountantPortal';
import { MyTeacherSection } from './MyTeacherSection';
import {
  getAllCertificates,
  getCertificatesForStudent,
  getCertificateByEnrollment,
  getCertificateByCode,
  verifyCertificateCodeForStudent,
  saveCertificateRecord,
  OfficialCertificate
} from '../utils/certificateVerification';
import { calculateStudentProgress } from '../utils/courseLearningSync';

interface DashboardProps {
  onNavigate: (page: PageId, params?: any) => void;
  lang: 'en' | 'am';
}

// ==========================================
// 1. STUDENT DASHBOARD
// ==========================================
export function StudentDashboard({ onNavigate, lang }: DashboardProps) {
  const { currentUser, updateProfile, addNotification } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'courses' | 'practice' | 'payments' | 'certificates'>('overview');
  
  // Registration timeline definition (Requirement 18)
  const timelineStages: { status: StudentRegistrationStatus; label: string; desc: string }[] = [
    { status: 'Account Created', label: 'Account Setup', desc: 'Secure profile established' },
    { status: 'Profile Incomplete', label: 'Complete Profile', desc: 'Add address, age, emergency contact' },
    { status: 'Application Submitted', label: 'Submit Application', desc: 'Select instrument, level & branch' },
    { status: 'Payment Pending', label: 'Tuition Payment', desc: 'Upload bank receipt of your payment' },
    { status: 'Payment Under Review', label: 'Finance Review', desc: 'Receipt verified by accounting' },
    { status: 'Application Under Review', label: 'Staff Review', desc: 'Registration document check' },
    { status: 'Approved', label: 'Approved & Active', desc: 'Welcome! Learning is officially active' }
  ];

  // Load real applications submitted via the Phase 3 EnrollmentWizard
  const [submittedApps, setSubmittedApps] = useState<any[]>(() => {
    try {
      const apps = JSON.parse(localStorage.getItem('ab_applications_v3') || '[]');
      return apps.filter((app: any) =>
        app && (
          (app.userId && currentUser?.id && app.userId === currentUser.id) ||
          (app.email && currentUser?.email && app.email.toLowerCase() === currentUser.email.toLowerCase()) ||
          (app.studentEmail && currentUser?.email && app.studentEmail.toLowerCase() === currentUser.email.toLowerCase()) ||
          (app.studentName && currentUser?.fullName && app.studentName.toLowerCase() === currentUser.fullName.toLowerCase())
        )
      );
    } catch {
      return [];
    }
  });

  const latestApp = submittedApps[0] || null;

  // Load student transactions dynamically from ab_transactions_v3 or submitted app
  const [studentTransactions, setStudentTransactions] = useState<any[]>(() => {
    try {
      const allTxns = JSON.parse(localStorage.getItem('ab_transactions_v3') || '[]');
      const userTxns = allTxns.filter((t: any) => 
        t.studentId === currentUser?.id || 
        t.studentName === currentUser?.fullName ||
        (submittedApps[0] && (t.id === `TXN-${submittedApps[0].id}` || t.referenceNumber === submittedApps[0].payment?.ref))
      );
      if (userTxns.length > 0) return userTxns;
    } catch {}

    if (latestApp) {
      return [{
        id: `TXN-${latestApp.id || '2026-901'}`,
        referenceNumber: latestApp.payment?.ref || 'CBE-PENDING',
        paymentType: 'Course Registration & Tuition',
        amount: latestApp.payment?.amount || latestApp.course?.totalDue || 5000,
        status: latestApp.paymentStatus === 'Approved' ? 'Verified' : 'Pending',
        date: latestApp.payment?.date || new Date().toISOString().split('T')[0]
      }];
    }

    return [];
  });

  // Determine dynamic student status based on actual submission & approval
  const [studentStatus, setStudentStatus] = useState<StudentRegistrationStatus>(() => {
    if (currentUser?.studentStatus === 'Enrollment Active' || currentUser?.studentStatus === 'Approved') {
      return 'Enrollment Active';
    }
    const verifiedTxn = studentTransactions.some(t => t.status === 'Verified' || t.status === 'Approved');
    if (verifiedTxn) {
      return 'Enrollment Active';
    }
    if (latestApp) {
      if (latestApp.paymentStatus === 'Approved' || latestApp.status === 'Approved') {
        return 'Enrollment Active';
      }
      if (latestApp.paymentMethod === 'Cash') {
        return 'Payment Pending';
      }
      return 'Payment Under Review';
    }
    return currentUser?.studentStatus || 'Account Created';
  });

  // Keep studentStatus updated if currentUser changes
  useEffect(() => {
    if (currentUser?.studentStatus === 'Enrollment Active' || currentUser?.studentStatus === 'Approved') {
      setStudentStatus('Enrollment Active');
    }
  }, [currentUser]);

  const [address, setAddress] = useState(currentUser?.address || '');
  const [age, setAge] = useState(currentUser?.age || 18);
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>(currentUser?.gender || 'Male');
  const [selectedCourse, setSelectedCourse] = useState(latestApp?.selectedCourseName || currentUser?.enrolledCourse || '');
  const [learningMode, setLearningMode] = useState<'In-Person' | 'Online' | 'Hybrid'>(latestApp?.learningMode || 'In-Person');
  const [selectedBranch, setSelectedBranch] = useState(latestApp?.selectedBranch || currentUser?.branch || '');
  const [selectedSchedule, setSelectedSchedule] = useState(latestApp ? `${latestApp.selectedScheduleDays?.join(', ')} (${latestApp.selectedClassTime})` : '');
  const [receiptFile, setReceiptFile] = useState<string | null>(latestApp?.receiptPhoto || null);
  const [isUploading, setIsUploading] = useState(false);

  // Practice tracker log
  const [practiceHours, setPracticeHours] = useState(0);
  const [practiceHistory, setPracticeHistory] = useState<any[]>([]);
  const [newLogMinutes, setNewLogMinutes] = useState('');
  const [newLogNotes, setNewLogNotes] = useState('');

  // Official Certificate & Verification state
  const [studentCerts, setStudentCerts] = useState<OfficialCertificate[]>(() => {
    return getCertificatesForStudent(currentUser?.id || '', currentUser?.email, currentUser?.fullName);
  });
  const [certCodeInputs, setCertCodeInputs] = useState<Record<string, string>>({});
  const [certErrors, setCertErrors] = useState<Record<string, string>>({});
  const [globalCodeInput, setGlobalCodeInput] = useState('');
  const [globalCodeResult, setGlobalCodeResult] = useState<{ success: boolean; certificate?: OfficialCertificate; error?: string } | null>(null);

  useEffect(() => {
    const refreshCerts = () => {
      setStudentCerts(getCertificatesForStudent(currentUser?.id || '', currentUser?.email, currentUser?.fullName));
    };
    refreshCerts();
    window.addEventListener('ab_certificates_updated', refreshCerts);
    window.addEventListener('ab_enrollments_updated', refreshCerts);
    window.addEventListener('storage', refreshCerts);
    return () => {
      window.removeEventListener('ab_certificates_updated', refreshCerts);
      window.removeEventListener('ab_enrollments_updated', refreshCerts);
      window.removeEventListener('storage', refreshCerts);
    };
  }, [currentUser]);

  // Determine if student has verified access from finance/staff
  const isFullyApproved =
    studentStatus === 'Enrollment Active' ||
    studentStatus === 'Approved' ||
    currentUser?.studentStatus === 'Enrollment Active' ||
    currentUser?.studentStatus === 'Approved' ||
    currentUser?.isPaymentCompleted === true ||
    isStudentAccessGranted(currentUser) ||
    studentTransactions.some(t => t.status === 'Verified' || t.status === 'Approved');

  // Find active step index
  const activeStepIndex = isFullyApproved
    ? timelineStages.length - 1
    : (() => {
        const idx = timelineStages.findIndex((s) => s.status === studentStatus);
        return idx !== -1 ? idx : 0;
      })();

  // Synchronize state with backend or session when user completes actions elsewhere (e.g. EnrollmentWizard)
  useEffect(() => {
    if (latestApp) {
      if (latestApp.paymentMethod === 'Cash') {
        setStudentStatus('Payment Pending');
      } else if (latestApp.paymentStatus === 'Pending Verification' || latestApp.status === 'Application Submitted') {
        setStudentStatus('Payment Under Review');
      } else if (latestApp.status === 'Approved') {
        setStudentStatus('Enrollment Active');
      }
    } else if (currentUser?.studentStatus) {
      setStudentStatus(currentUser.studentStatus);
    }
  }, [currentUser?.studentStatus, latestApp]);

  const handleSaveProfile = async () => {
    await updateProfile({ address, age, gender });
    setStudentStatus('Profile Incomplete'); // transition status
    addNotification('Profile Saved', 'Profile incomplete fields are filled. Ready to submit application.', 'registration');
  };

  const handleSubmitApplication = () => {
    setStudentStatus('Application Submitted');
    addNotification(
      'Application Submitted',
      `Your application for ${selectedCourse} (${learningMode}) has been received. Please pay the registration fee to proceed.`,
      'registration'
    );
  };

  const handleUploadReceipt = () => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      const receiptUrl = 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=80';
      const refNo = `CBE-FT-${Math.floor(10000000 + Math.random() * 89999999)}`;
      setReceiptFile(receiptUrl);
      setStudentStatus('Payment Under Review');

      const studentName = currentUser?.fullName || 'Student';
      const studentId = currentUser?.id || `STU-${Date.now()}`;

      try {
        // Sync into ab_applications_v3
        const savedApps = JSON.parse(localStorage.getItem('ab_applications_v3') || '[]');
        const updatedApps = savedApps.map((app: any) => {
          if (app.userId === currentUser?.id || app.studentName === studentName) {
            return {
              ...app,
              payment: {
                ...(app.payment || {}),
                receipt: receiptUrl,
                ref: refNo,
                status: 'Pending Verification'
              },
              paymentStatus: 'Pending Verification',
              status: 'Application Submitted'
            };
          }
          return app;
        });
        safeSetItem('ab_applications_v3', JSON.stringify(updatedApps));

        // Sync into ab_transactions_v3
        const savedTxns = JSON.parse(localStorage.getItem('ab_transactions_v3') || '[]');
        const newTxn = {
          id: `TXN-2026-${Math.floor(8000 + Math.random() * 999)}`,
          studentName,
          studentId,
          course: selectedCourse || 'Begena - Level 1',
          level: 'Basic 1',
          branch: selectedBranch || 'Piazza Branch',
          paymentType: 'Tuition Payment',
          amount: 4500,
          paymentMethod: 'CBE',
          date: new Date().toISOString().split('T')[0],
          referenceNumber: refNo,
          receiptImage: receiptUrl,
          status: 'Pending',
          createdBy: 'Student Direct Upload',
          notes: 'Bank receipt uploaded via Student Dashboard'
        };
        savedTxns.unshift(newTxn);
        safeSetItem('ab_transactions_v3', JSON.stringify(savedTxns));
      } catch (e) {
        console.error("Error writing receipt transaction", e);
      }

      updateProfile({ studentStatus: 'Payment Under Review' });

      addNotification(
        'Receipt Uploaded',
        'Your payment receipt is under review by our accounting staff. Verification usually takes 2-4 hours.',
        'payment'
      );
    }, 1000);
  };

  const handleAddPracticeLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLogMinutes || isNaN(Number(newLogMinutes))) return;
    const min = Number(newLogMinutes);
    const newHistory = [
      {
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        duration: min,
        notes: newLogNotes || 'Standard practice session.'
      },
      ...practiceHistory
    ];
    setPracticeHistory(newHistory);
    setNewLogMinutes('');
    setNewLogNotes('');
    addNotification('Practice Hours Logged', `Logged ${min} minutes of traditional string exercise. Keep up the streak!`, 'lesson');
  };

  const totalLoggedMinutes = practiceHistory.reduce((sum, item) => sum + item.duration, 0);

  return (
    <div className="space-y-8">
      {/* HEADER BAR */}
      <div className="bg-white border border-[#E7DED1] p-4 sm:p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 opacity-5 pointer-events-none">
          <TiletPattern />
        </div>
        <div>
          <span className="text-[10px] tracking-widest text-[#E89B52] uppercase font-bold">ACCELERATED LEARNING</span>
          <h2 className="font-display font-black text-xl sm:text-2xl text-[#2B2B2B]">WELCOME, {currentUser?.fullName.toUpperCase()}!</h2>
          <p className="text-xs text-gray-500">Traditional Student Portal • Bole Branch & Online</p>
        </div>
        <div className="flex flex-col items-start sm:items-end gap-2 w-full md:w-auto">
          <div className="flex items-center gap-2">
            {timelineStages.map((stage, idx) => (
              <span
                key={idx}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  isFullyApproved || idx <= activeStepIndex ? 'bg-[#E89B52] dark:bg-amber-500' : 'bg-gray-200 dark:bg-gray-700'
                }`}
                title={stage.label}
              />
            ))}
            <span className="text-xs font-mono font-bold text-[#E89B52] dark:text-amber-400 ml-1">
              {isFullyApproved ? '100% Active' : `${Math.round(((activeStepIndex + 1) / timelineStages.length) * 100)}% Registered`}
            </span>
          </div>

          {(() => {
            const isPaymentVerified =
              studentStatus === 'Enrollment Active' ||
              studentStatus === 'Approved' ||
              currentUser?.studentStatus === 'Enrollment Active' ||
              currentUser?.studentStatus === 'Approved' ||
              currentUser?.isPaymentCompleted === true ||
              isStudentAccessGranted(currentUser) ||
              studentTransactions.some(t => t.status === 'Verified' || t.status === 'Approved');

            return (
              <div className="flex flex-wrap items-center gap-1.5 pt-1 justify-start sm:justify-end w-full">
                <ThemeToggle variant="pill" />
                <button
                  onClick={() => onNavigate('learn')}
                  className="px-2.5 py-1 bg-[#E89B52] hover:bg-amber-600 text-white rounded text-[11px] font-bold transition shadow-xs cursor-pointer"
                >
                  🎓 Learning Center
                </button>
                <button
                  onClick={() => {
                    if (!isPaymentVerified) {
                      addNotification(
                        'Practice Studio Locked',
                        'Practice Studio is locked until your tuition payment is verified by accounting.',
                        'payment'
                      );
                      setActiveTab('practice');
                    } else {
                      onNavigate('practice');
                    }
                  }}
                  className="px-2.5 py-1 bg-amber-900 hover:bg-amber-950 text-white rounded text-[11px] font-bold transition shadow-xs flex items-center gap-1 cursor-pointer"
                >
                  <span>🎯 Practice Studio</span>
                  {!isPaymentVerified && <Lock size={10} className="text-amber-300 ml-0.5 shrink-0" />}
                </button>
                <button
                  onClick={() => onNavigate('messages')}
                  className="px-2.5 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded text-[11px] font-bold transition cursor-pointer"
                >
                  💬 Messages
                </button>
                <button
                  onClick={() => onNavigate('community')}
                  className="px-2.5 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded text-[11px] font-bold transition cursor-pointer"
                >
                  🌐 Community
                </button>
                <button
                  onClick={() => onNavigate('notifications')}
                  className="px-2.5 py-1 bg-amber-800 hover:bg-amber-900 text-white rounded text-[11px] font-bold transition cursor-pointer"
                >
                  🔔 Alerts
                </button>
              </div>
            );
          })()}
        </div>
      </div>

      {/* DASHBOARD NAVIGATION */}
      {(() => {
        const isPaymentVerified =
          studentStatus === 'Enrollment Active' ||
          studentStatus === 'Approved' ||
          currentUser?.studentStatus === 'Enrollment Active' ||
          currentUser?.studentStatus === 'Approved' ||
          currentUser?.isPaymentCompleted === true ||
          isStudentAccessGranted(currentUser) ||
          studentTransactions.some(t => t.status === 'Verified' || t.status === 'Approved');

        return (
          <div className="flex border-b border-[#E7DED1] dark:border-[#2E2E36] gap-1 overflow-x-auto pb-px">
            {[
              { id: 'overview', label: 'Ecosystem Status' },
              { id: 'courses', label: 'Classroom & Lessons', locked: !isPaymentVerified },
              { id: 'practice', label: 'Practice Tracker', locked: !isPaymentVerified },
              { id: 'payments', label: 'Tuition & Billing' },
              { id: 'certificates', label: 'Certificates' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2 whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                  activeTab === tab.id
                    ? 'border-[#E89B52] text-[#2B2B2B] dark:text-[#F8F9FA] bg-[#FAF6EF]/50 dark:bg-[#1E1E24]'
                    : 'border-transparent text-gray-400 hover:text-[#2B2B2B] dark:hover:text-[#F8F9FA]'
                }`}
              >
                <span>{tab.label}</span>
                {tab.locked && <Lock size={12} className="text-amber-500 shrink-0 ml-0.5" />}
              </button>
            ))}
          </div>
        );
      })()}

      {/* RENDER ACTIVE TAB */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* TAB 1: OVERVIEW & SYSTEM TIMELINE */}
        {activeTab === 'overview' && (
          <>
            {/* ASSIGNED TEACHER CONTACT DIRECTORY */}
            <div className="lg:col-span-3">
              <MyTeacherSection />
            </div>

            {/* STAGE TIMELINE COMPONENT - Requirement 18 */}
            <div className="lg:col-span-2 bg-white border border-[#E7DED1] p-6 rounded-2xl space-y-6 shadow-xs">
              <div>
                <h3 className="font-display font-black text-sm uppercase text-[#2B2B2B] tracking-wider flex items-center gap-2">
                  <Activity size={18} className="text-[#E89B52]" />
                  Your Enrollment Roadmap
                </h3>
                <p className="text-xs text-gray-500">Track and fulfill each milestone to unlock lessons.</p>
              </div>

              <div className="relative pl-6 border-l-2 border-[#E7DED1] dark:border-[#2E2E36] space-y-8 py-2">
                {timelineStages.map((stage, idx) => {
                  const isCompleted = isFullyApproved || idx < activeStepIndex;
                  const isCurrent = !isFullyApproved && idx === activeStepIndex;

                  return (
                    <div key={stage.status} className="relative">
                      {/* Node Indicator */}
                      <div
                        className={`absolute -left-[31px] top-1.5 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                          isCompleted
                            ? 'bg-[#E89B52] border-[#E89B52] dark:bg-amber-500 dark:border-amber-500'
                            : isCurrent
                            ? 'bg-white dark:bg-[#1C1C22] border-[#E89B52] ring-4 ring-[#E89B52]/20 scale-110'
                            : 'bg-white dark:bg-[#1C1C22] border-gray-300 dark:border-gray-600'
                        }`}
                      >
                        {isCompleted && <Check size={10} className="text-white font-bold" />}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs font-bold uppercase tracking-wide ${
                              isCompleted
                                ? 'text-[#2B2B2B] dark:text-[#F8F9FA]'
                                : isCurrent
                                ? 'text-[#E89B52] dark:text-amber-400'
                                : 'text-gray-400 dark:text-gray-500'
                            }`}
                          >
                            {stage.label}
                          </span>
                          {isCompleted && (
                            <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-200 dark:border-emerald-800/60 flex items-center gap-1">
                              <CheckCircle size={10} /> Verified
                            </span>
                          )}
                        </div>
                        <p
                          className={`text-xs ${
                            isCompleted
                              ? 'text-gray-600 dark:text-gray-300 font-medium'
                              : isCurrent
                              ? 'text-gray-700 dark:text-gray-200 font-medium'
                              : 'text-gray-400 dark:text-gray-500'
                          }`}
                        >
                          {stage.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* WHAT TO DO NEXT CARD */}
            <div className="bg-white border border-[#E7DED1] p-6 rounded-2xl space-y-5 shadow-xs">
              <h3 className="font-display font-black text-sm uppercase text-[#2B2B2B] tracking-wider">
                What to do Next
              </h3>

              <AnimatePresence mode="wait">
                {studentStatus === 'Account Created' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 text-xs">
                    <p className="text-gray-600 leading-relaxed">
                      Your login credentials are secure! Next, complete your profile fields to prepare your academic registration application.
                    </p>
                    <div className="space-y-3 p-4 bg-[#FAF6EF] rounded-xl border border-[#E7DED1]">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-500 uppercase">Your Age</label>
                        <Input type="number" value={age} onChange={(e) => setAge(Number(e.target.value))} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-500 uppercase">Home Address</label>
                        <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Addis Ababa" />
                      </div>
                      <Button variant="primary" size="sm" className="w-full" onClick={handleSaveProfile}>
                        Save Details & Advance
                      </Button>
                    </div>
                  </motion.div>
                )}

                {studentStatus === 'Profile Incomplete' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 text-xs">
                    <p className="text-gray-600">
                      Excellent! Now submit your registration choice by choosing your traditional instrument and weekly class schedule.
                    </p>
                    <div className="p-4 bg-[#FAF6EF] rounded-xl border border-[#E7DED1] space-y-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-500 uppercase">Selected Instrument</label>
                        <select
                          className="w-full p-2 bg-white border border-[#E7DED1] rounded-md text-xs"
                          value={selectedCourse}
                          onChange={(e) => setSelectedCourse(e.target.value)}
                        >
                          <option>Begena - Level 1</option>
                          <option>Krar Tuning & Chords</option>
                          <option>Masenqo Fundamentals</option>
                          <option>Traditional Vocal Melodies</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-500 uppercase">Branch Location</label>
                        <select
                          className="w-full p-2 bg-white border border-[#E7DED1] rounded-md text-xs"
                          value={selectedBranch}
                          onChange={(e) => setSelectedBranch(e.target.value)}
                        >
                          <option>Bole Branch, Addis Ababa</option>
                          <option>Megenagna Branch, Addis Ababa</option>
                          <option>Online Traditional Portal</option>
                        </select>
                      </div>

                      <Button variant="primary" size="sm" className="w-full mt-2" onClick={handleSubmitApplication}>
                        Submit Application
                      </Button>
                    </div>
                  </motion.div>
                )}

                {studentStatus === 'Application Submitted' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 text-xs">
                    <p className="text-gray-600">
                      To activate your enrollment, please complete the standard registration deposit of <b className="text-black font-extrabold">your payment</b> to our Commercial Bank of Ethiopia (CBE) Account: 10002938475. Upload your transaction receipt.
                    </p>
                    <div className="p-4 border-2 border-dashed border-[#E7DED1] hover:border-[#E89B52] rounded-xl text-center space-y-3 bg-[#FAF6EF]/50">
                      <DollarSign className="mx-auto text-gray-400" size={24} />
                      <div>
                        <span className="block font-bold">Select receipt PDF/JPG</span>
                        <span className="text-[10px] text-gray-400">Max size 4MB</span>
                      </div>
                      <Button variant="secondary" size="sm" className="w-full" onClick={handleUploadReceipt} isLoading={isUploading}>
                        Simulate Receipt Upload
                      </Button>
                    </div>
                  </motion.div>
                )}

                {!isFullyApproved && (studentStatus === 'Payment Under Review' || studentStatus === 'Application Under Review') && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-xl space-y-2 text-xs">
                    <div className="flex items-center gap-2 text-amber-900 dark:text-amber-300 font-bold">
                      <Clock size={16} />
                      <span>Review in Progress</span>
                    </div>
                    <p className="text-amber-800 dark:text-amber-200 leading-relaxed">
                      Our Accountant Martha Hailu is auditing your upload of payment. Once approved, your student status will change to "Approved" and unlock learning access.
                    </p>
                  </motion.div>
                )}

                {(studentStatus === 'Enrollment Active' || studentStatus === 'Approved' || isFullyApproved) && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 bg-green-50 dark:bg-emerald-950/40 border border-green-200 dark:border-emerald-800/60 rounded-xl space-y-2 text-xs">
                    <div className="flex items-center gap-2 text-green-900 dark:text-emerald-300 font-bold">
                      <CheckCircle size={16} />
                      <span>Registration & Payment Verified!</span>
                    </div>
                    <p className="text-green-800 dark:text-emerald-200 leading-relaxed">
                      Your registration documents and tuition payment have been fully verified by staff and accounting. You are officially active in <span className="font-bold">{currentUser?.enrolledCourse || latestApp?.selectedCourseName || 'Kirar - Basic Level 1'}</span>! Head over to the <b className="font-extrabold text-green-950 dark:text-emerald-100">Classroom & Lessons</b> tab to access learning materials.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </>
        )}

        {/* TAB 2: CLASSROOM & LESSONS */}
        {activeTab === 'courses' && (
          <div className="lg:col-span-3 space-y-6">
            {studentStatus !== 'Enrollment Active' && studentStatus !== 'Approved' ? (
              <div className="bg-white border border-[#E7DED1] p-12 rounded-2xl shadow-xs text-center space-y-4 max-w-md mx-auto">
                <AlertCircle size={44} className="mx-auto text-amber-500 animate-bounce" />
                <h4 className="font-display font-black text-base text-[#2B2B2B] uppercase">Academic Classroom Locked</h4>
                <p className="text-xs text-gray-500 leading-relaxed">
                  To view this dedicated Course-Specific Learning Journey, complete your registration milestones, upload your payment bank receipt, and receive accountant validation.
                </p>
                <div className="pt-2">
                  
                </div>
              </div>
            ) : (
              <CourseLearningPortal lang={lang} onNavigate={onNavigate} />
            )}
          </div>
        )}

        {/* TAB 3: PRACTICE TRACKER */}
        {activeTab === 'practice' && (
          <div className="lg:col-span-3 space-y-6">
            {!(
              studentStatus === 'Enrollment Active' ||
              studentStatus === 'Approved' ||
              currentUser?.studentStatus === 'Enrollment Active' ||
              currentUser?.studentStatus === 'Approved' ||
              currentUser?.isPaymentCompleted === true ||
              isStudentAccessGranted(currentUser) ||
              studentTransactions.some(t => t.status === 'Verified' || t.status === 'Approved')
            ) ? (
              <div className="bg-white dark:bg-[#1C1C22] border border-[#E7DED1] dark:border-[#2E2E36] p-10 sm:p-12 rounded-2xl shadow-xs text-center space-y-4 max-w-lg mx-auto">
                <div className="w-16 h-16 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto border border-amber-200 dark:border-amber-900/50">
                  <Lock size={32} />
                </div>
                <h4 className="font-display font-black text-base text-[#2B2B2B] dark:text-[#F8F9FA] uppercase tracking-wider">
                  Practice Tracker Locked
                </h4>
                <p className="text-xs text-gray-500 dark:text-[#A1A1AA] leading-relaxed">
                  Your Practice Tracker is locked until your tuition payment is verified by our accounting department.
                  Please upload your payment bank receipt under the <strong>Ecosystem Status</strong> or <strong>Tuition & Billing</strong> tab to complete verification and unlock practice tracking.
                </p>
                <div className="pt-3 flex flex-col sm:flex-row gap-2.5 justify-center">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setActiveTab('overview')}
                    className="text-xs font-bold"
                  >
                    Upload Payment Receipt
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setActiveTab('payments')}
                    className="text-xs font-bold"
                  >
                    View Tuition & Billing
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* Stat Card 1 */}
                  <div className="bg-white border border-[#E7DED1] p-5 rounded-2xl flex items-center gap-4 shadow-xs">
                    <div className="w-12 h-12 rounded-full bg-amber-50 text-[#E89B52] flex items-center justify-center border border-[#E7DED1]">
                      <Flame size={22} className="animate-pulse" />
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-400 uppercase font-bold">Practice Streak</span>
                      <p className="font-display font-black text-xl text-[#2B2B2B]">5 Days</p>
                    </div>
                  </div>

                  {/* Stat Card 2 */}
                  <div className="bg-white border border-[#E7DED1] p-5 rounded-2xl flex items-center gap-4 shadow-xs">
                    <div className="w-12 h-12 rounded-full bg-amber-50 text-[#E89B52] flex items-center justify-center border border-[#E7DED1]">
                      <Clock size={22} />
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-400 uppercase font-bold">Total Practice</span>
                      <p className="font-display font-black text-xl text-[#2B2B2B]">{totalLoggedMinutes} Mins</p>
                    </div>
                  </div>

                  {/* Stat Card 3 */}
                  <div className="bg-white border border-[#E7DED1] p-5 rounded-2xl flex items-center gap-4 shadow-xs">
                    <div className="w-12 h-12 rounded-full bg-amber-50 text-[#E89B52] flex items-center justify-center border border-[#E7DED1]">
                      <Award size={22} />
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-400 uppercase font-bold">Skill Achievement</span>
                      <p className="font-display font-black text-xl text-[#2B2B2B]">Tuning Certified</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* LOG FORM */}
                  <div className="bg-white border border-[#E7DED1] p-6 rounded-2xl shadow-xs space-y-4">
                    <h4 className="font-display font-black text-xs text-[#2B2B2B] uppercase tracking-wider">
                      Log New Practice Session
                    </h4>
                    <form onSubmit={handleAddPracticeLog} className="space-y-4 text-xs">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase">Practice Duration (Minutes)</label>
                        <Input
                          required
                          type="number"
                          placeholder="e.g. 45"
                          value={newLogMinutes}
                          onChange={(e) => setNewLogMinutes(e.target.value)}
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase">What chords or melodies did you practice?</label>
                        <textarea
                          className="w-full p-2.5 bg-white border border-[#E7DED1] rounded-md outline-none focus:border-[#C79A2B] h-20 text-xs"
                          placeholder="Notes or techniques..."
                          value={newLogNotes}
                          onChange={(e) => setNewLogNotes(e.target.value)}
                        />
                      </div>

                      <Button type="submit" variant="primary" className="w-full font-bold uppercase text-xs">
                        Log Chords practice
                      </Button>
                    </form>
                  </div>

                  {/* HISTORY LIST */}
                  <div className="bg-white border border-[#E7DED1] p-6 rounded-2xl shadow-xs space-y-4 overflow-y-auto max-h-[300px]">
                    <h4 className="font-display font-black text-xs text-[#2B2B2B] uppercase tracking-wider">
                      Practice History Logs
                    </h4>
                    <div className="space-y-3">
                      {practiceHistory.map((log, idx) => (
                        <div key={idx} className="p-3 bg-[#FAF6EF]/50 border border-[#E7DED1] rounded-xl text-xs space-y-1">
                          <div className="flex justify-between font-mono font-bold text-[#E89B52]">
                            <span>{log.date}</span>
                            <span>{log.duration} Mins</span>
                          </div>
                          <p className="text-gray-500 leading-relaxed text-[11px]">{log.notes}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* TAB 4: PAYMENTS & TUITION */}
        {activeTab === 'payments' && (
          <div className="lg:col-span-3 space-y-6 bg-white border border-[#E7DED1] p-6 rounded-2xl shadow-xs">
            <div>
              <h3 className="font-display font-black text-sm uppercase text-[#2B2B2B] tracking-wider">
                Tuition Statement & Receipts
              </h3>
              <p className="text-xs text-gray-500">View payment history or submit CBE bank logs.</p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 bg-[#FAF6EF] rounded-xl border border-[#E7DED1] flex flex-col md:flex-row justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] text-gray-400 uppercase font-mono">Invoice Number</span>
                  <p className="font-bold text-gray-800">#INV-2026-08-01</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-gray-400 uppercase font-mono">Enrollment Class</span>
                  <p className="font-bold text-gray-800">Begena - Level 1 Registration</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-gray-400 uppercase font-mono">Total Due</span>
                  <p className="font-bold text-gray-800">4,500 ETB</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-gray-400 uppercase font-mono">Invoice Status</span>
                  <p className="font-bold text-[#E89B52]">Pending Receipt Verification</p>
                </div>
              </div>

              <div className="border border-gray-100 rounded-xl overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#FAF6EF] border-b border-[#E7DED1] text-[10px] font-bold text-gray-500 uppercase">
                      <th className="p-3">Reference No</th>
                      <th className="p-3">Type</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentTransactions.map((tx, idx) => (
                      <tr key={tx.id || idx} className="border-b border-gray-100 text-xs text-gray-500 hover:bg-[#FAF6EF]/30">
                        <td className="p-3 font-mono font-bold text-[#E89B52]">{tx.referenceNumber || tx.id}</td>
                        <td className="p-3">{tx.paymentType || 'Tuition Fee'}</td>
                        <td className="p-3 font-mono font-bold">{tx.amount?.toLocaleString()} ETB</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            tx.status === 'Verified' || tx.status === 'Approved'
                              ? 'bg-green-50 text-green-600 border border-green-200'
                              : tx.status === 'Rejected'
                              ? 'bg-red-50 text-red-600 border border-red-200'
                              : 'bg-yellow-50 text-amber-600 border border-yellow-200'
                          }`}>
                            {tx.status === 'Verified' || tx.status === 'Approved' ? 'APPROVED' : tx.status === 'Rejected' ? 'REJECTED' : 'PENDING REVIEW'}
                          </span>
                        </td>
                        <td className="p-3">{tx.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: CERTIFICATES & VERIFICATION */}
        {activeTab === 'certificates' && (
          <div className="lg:col-span-3 space-y-8 animate-fadeIn">
            {/* TOP HEADER BANNER */}
            <div className="bg-gradient-to-r from-[#2B2B2B] via-[#3A291A] to-[#2B2B2B] text-white p-6 md:p-8 rounded-2xl shadow-sm space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="space-y-1 z-10 max-w-xl">
                  <span className="text-[10px] font-mono tracking-widest text-[#E89B52] uppercase font-bold block">
                    CRYPTOGRAPHICALLY VERIFIABLE DIPLOMAS
                  </span>
                  <h3 className="font-display font-black text-xl md:text-2xl uppercase tracking-wide">
                    Student Certificate Verification Gateway
                  </h3>
                  <p className="text-xs text-amber-100/80 leading-relaxed">
                    Upon completing 100% of your course requirements and receiving instructor evaluation, your teacher generates a unique <strong>Certificate Verification Code</strong> linked directly to your student enrollment.
                  </p>
                </div>
                <Award size={64} className="text-[#E89B52] opacity-80 shrink-0 hidden sm:block" />
              </div>
            </div>

            {/* ENROLLMENT CERTIFICATE CARDS */}
            <div className="space-y-6">
              <h4 className="font-display font-black text-sm uppercase text-[#2B2B2B] flex items-center gap-2 border-b border-[#E7DED1] pb-2">
                <Award size={18} className="text-[#E89B52]" />
                Your Enrolled Courses & Certificate Verification Status
              </h4>

              {(() => {
                // Get student enrollments
                let enrollmentsList: any[] = [];
                try {
                  const savedEnrs = localStorage.getItem('ab_enrollments_v4');
                  if (savedEnrs) {
                    const parsed = JSON.parse(savedEnrs);
                    if (Array.isArray(parsed)) {
                      enrollmentsList = parsed.filter(
                        (e: any) =>
                          e.studentId === currentUser?.id ||
                          (e.studentEmail && currentUser?.email && e.studentEmail.toLowerCase() === currentUser.email.toLowerCase()) ||
                          e.id === currentUser?.id
                      );
                    }
                  }
                } catch (e) {}

                if (enrollmentsList.length === 0) {
                  // Fallback enrollment card for active student course
                  enrollmentsList = [
                    {
                      id: `enr-${currentUser?.id || '2026-001'}`,
                      studentId: currentUser?.id || 'STU-2026-001',
                      studentName: currentUser?.fullName || 'Denver Sergio',
                      studentEmail: currentUser?.email || 'denver@example.com',
                      courseName: selectedCourse || 'Begena Traditional Instrument Mastery',
                      instrument: selectedCourse?.toLowerCase().includes('krar') ? 'Krar' : 'Begena',
                      level: 'Level 1 (Basic)',
                      branch: selectedBranch,
                      teacherName: 'Zemari Deacon Abel Tesfaye',
                      progress: 0
                    }
                  ];
                }

                return (
                  <div className="space-y-6">
                    {enrollmentsList.map((enr: any) => {
                      const instName = enr.instrument || (enr.courseName?.toLowerCase().includes('krar') ? 'Krar' : 'Begena');
                      const lvlName = enr.level || 'Level 1 (Basic)';
                      
                      // Calculate current student progress
                      const progressInfo = calculateStudentProgress(currentUser?.id || enr.studentId, instName, lvlName);
                      const currentProg = progressInfo.progressPercent;

                      // Check if certificate has been issued by teacher
                      const cert = getCertificateByEnrollment(enr.id) || studentCerts.find(c => c.instrument.toLowerCase() === instName.toLowerCase() || c.enrollmentId === enr.id);
                      
                      const codeInputVal = certCodeInputs[enr.id] !== undefined ? certCodeInputs[enr.id] : (cert?.verificationCode || '');
                      const errText = certErrors[enr.id] || '';

                      return (
                        <div key={enr.id} className="bg-white border-2 border-[#E7DED1] rounded-2xl p-6 shadow-xs space-y-6">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-mono font-bold uppercase bg-amber-100 text-[#E89B52] px-2.5 py-0.5 rounded-full">
                                  {instName} • {lvlName}
                                </span>
                                <span className="text-xs text-gray-400">• {enr.branch || 'Piazza Branch'}</span>
                              </div>
                              <h3 className="font-display font-black text-lg text-gray-900 mt-1">
                                {enr.courseName || `${instName} Course`}
                              </h3>
                            </div>

                            <div>
                              {cert?.isUnlockedByStudent ? (
                                <span className="px-3 py-1 bg-emerald-100 text-emerald-900 font-bold text-xs rounded-full border border-emerald-300 flex items-center gap-1.5 w-fit">
                                  ✓ UNLOCKED & VERIFIED
                                </span>
                              ) : cert ? (
                                <span className="px-3 py-1 bg-amber-100 text-amber-900 font-bold text-xs rounded-full border border-amber-300 flex items-center gap-1.5 w-fit animate-pulse">
                                  🎓 CODE ISSUED BY TEACHER
                                </span>
                              ) : (
                                <span className="px-3 py-1 bg-gray-100 text-gray-600 font-bold text-xs rounded-full border border-gray-300 flex items-center gap-1.5 w-fit">
                                  ⏳ PENDING COMPLETION ({currentProg}%)
                                </span>
                              )}
                            </div>
                          </div>

                          {/* CASE 1: CERTIFICATE NOT YET ISSUED BY TEACHER */}
                          {!cert && (
                            <div className="bg-[#FAF6EF]/80 border border-[#E7DED1] p-5 rounded-xl space-y-4">
                              <div className="flex items-start gap-3">
                                <Award size={24} className="text-gray-400 shrink-0 mt-0.5" />
                                <div className="space-y-1">
                                  <h4 className="font-bold text-xs uppercase text-gray-800">
                                    Course Requirement Progress
                                  </h4>
                                  <p className="text-xs text-gray-600 leading-relaxed">
                                    You have completed <strong>{currentProg}%</strong> of required lessons ({progressInfo.completedRequiredLessonsCount} of {progressInfo.totalPublishedRequiredLessonsCount} completed).
                                    Once you complete 100% of the course curriculum, your assigned instructor will review your completion and issue your unique verification code.
                                  </p>
                                </div>
                              </div>

                              <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
                                <div
                                  className="bg-[#E89B52] h-full transition-all duration-500 rounded-full"
                                  style={{ width: `${currentProg}%` }}
                                />
                              </div>
                            </div>
                          )}

                          {/* CASE 2: CERTIFICATE ISSUED BY TEACHER -> ENTER/CONFIRM CODE TO UNLOCK */}
                          {cert && !cert.isUnlockedByStudent && (
                            <div className="bg-gradient-to-br from-amber-50/70 via-orange-50/30 to-amber-50/70 border-2 border-[#E89B52] p-6 rounded-2xl space-y-5">
                              <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-full bg-[#E89B52] text-white flex items-center justify-center shrink-0 shadow-xs font-bold">
                                  <Award size={20} />
                                </div>
                                <div className="space-y-1">
                                  <span className="text-[10px] font-mono font-bold text-[#E89B52] uppercase tracking-wider block">
                                    INSTRUCTOR CERTIFICATE ISSUED
                                  </span>
                                  <h4 className="font-display font-black text-base text-gray-900">
                                    Your Official Certificate Verification Code Is Ready!
                                  </h4>
                                  <p className="text-xs text-gray-600 leading-relaxed">
                                    Your teacher (<strong>{cert.issuedByTeacherName}</strong>) has evaluated your completion and issued code <strong className="font-mono text-[#E89B52]">{cert.verificationCode}</strong> on {cert.issuedAt}.
                                    Confirm the code below to verify credential linkage and unlock your official diploma.
                                  </p>
                                </div>
                              </div>

                              {/* VERIFICATION CODE BOX */}
                              <div className="bg-white p-4 rounded-xl border border-amber-200 space-y-3">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-bold text-gray-700 uppercase">Assigned Verification Code:</span>
                                  <button
                                    onClick={() => {
                                      navigator.clipboard.writeText(cert.verificationCode);
                                      addNotification('Code Copied', `Copied ${cert.verificationCode} to clipboard`, 'system');
                                    }}
                                    className="text-xs font-bold text-[#E89B52] hover:underline flex items-center gap-1 cursor-pointer"
                                  >
                                    Copy Code
                                  </button>
                                </div>
                                <div className="p-2.5 bg-amber-50 rounded-lg font-mono font-black text-center text-lg tracking-widest text-[#E89B52] border border-amber-300">
                                  {cert.verificationCode}
                                </div>
                              </div>

                              {/* VERIFICATION INPUT & UNLOCK SUBMISSION */}
                              <form
                                onSubmit={(e) => {
                                  e.preventDefault();
                                  const codeToTest = codeInputVal.trim();
                                  const res = verifyCertificateCodeForStudent({
                                    code: codeToTest,
                                    studentId: currentUser?.id || enr.studentId,
                                    studentEmail: currentUser?.email || enr.studentEmail,
                                    studentName: currentUser?.fullName || enr.studentName,
                                    enrollmentId: enr.id
                                  });

                                  if (res.success && res.certificate) {
                                    setCertErrors((prev) => ({ ...prev, [enr.id]: '' }));
                                    setStudentCerts(getCertificatesForStudent(currentUser?.id || '', currentUser?.email, currentUser?.fullName));
                                    addNotification('Certificate Unlocked', `Successfully verified and unlocked official diploma for ${res.certificate.courseName}!`, 'system');
                                  } else {
                                    setCertErrors((prev) => ({ ...prev, [enr.id]: res.error || 'Verification failed.' }));
                                  }
                                }}
                                className="space-y-3 pt-1"
                              >
                                <label className="block text-xs font-bold text-gray-800">
                                  Enter / Confirm Verification Code to Unlock Official Diploma:
                                </label>
                                <div className="flex flex-col sm:flex-row gap-2">
                                  <input
                                    type="text"
                                    value={codeInputVal}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setCertCodeInputs((prev) => ({ ...prev, [enr.id]: val }));
                                      setCertErrors((prev) => ({ ...prev, [enr.id]: '' }));
                                    }}
                                    placeholder="e.g. AB-CERT-BEGE-2026-X8K9M2"
                                    className="flex-1 px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-xs font-mono font-bold text-gray-900 uppercase focus:outline-none focus:border-[#E89B52]"
                                  />
                                  <button
                                    type="submit"
                                    className="px-6 py-2.5 bg-[#E89B52] hover:bg-[#d4863e] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-xs shrink-0"
                                  >
                                    <CheckCircle size={16} /> Verify & Unlock Certificate
                                  </button>
                                </div>

                                {errText && (
                                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 font-bold flex items-center gap-2">
                                    <AlertTriangle size={16} className="text-red-600 shrink-0" />
                                    <span>{errText}</span>
                                  </div>
                                )}
                              </form>
                            </div>
                          )}

                          {/* CASE 3: CERTIFICATE IS UNLOCKED -> DISPLAY OFFICIAL DIPLOMA */}
                          {cert && cert.isUnlockedByStudent && (
                            <div className="border-2 border-[#E89B52] bg-gradient-to-br from-[#FFFBF5] via-[#FAF3E8] to-[#FFFBF5] p-6 sm:p-8 rounded-2xl space-y-6 relative overflow-hidden shadow-sm">
                              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-amber-200/80 pb-4">
                                <div className="space-y-1">
                                  <span className="text-[10px] font-mono tracking-widest text-[#E89B52] font-black uppercase block">
                                    ABEL BEGENA & KRAR ACADEMY • OFFICIAL DIPLOMA
                                  </span>
                                  <h3 className="font-display font-black text-xl sm:text-2xl text-gray-900 tracking-tight">
                                    ACADEMIC CERTIFICATE OF COMPLETION
                                  </h3>
                                  <p className="text-xs text-gray-600 leading-relaxed max-w-lg">
                                    This certifies that <strong className="text-gray-900 font-black">{cert.studentName}</strong> has successfully completed all academic requirements for <strong className="text-[#E89B52] font-black">{cert.courseName}</strong> ({cert.instrument} - {cert.level}).
                                  </p>
                                </div>
                                <div className="flex flex-col items-end gap-1 shrink-0">
                                  <Award size={48} className="text-[#E89B52]" />
                                  <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                                    ✓ VERIFIED CREDENTIAL
                                  </span>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white/90 p-4 rounded-xl border border-amber-200 text-xs">
                                <div>
                                  <span className="text-gray-400 font-bold block text-[9px] uppercase">Unique Verification Code:</span>
                                  <span className="font-mono font-black text-sm text-[#E89B52] block select-all">{cert.verificationCode}</span>
                                </div>
                                <div>
                                  <span className="text-gray-400 font-bold block text-[9px] uppercase">Authorized Faculty:</span>
                                  <span className="font-bold text-gray-800 block">{cert.issuedByTeacherName}</span>
                                </div>
                                <div>
                                  <span className="text-gray-400 font-bold block text-[9px] uppercase">Issue Date & Branch:</span>
                                  <span className="font-bold text-gray-800 block">{cert.issuedAt} • {cert.branch}</span>
                                </div>
                              </div>

                              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                                <button
                                  onClick={() => {
                                    navigator.clipboard.writeText(cert.verificationCode);
                                    addNotification('Copied', `Verification code ${cert.verificationCode} copied to clipboard!`, 'system');
                                  }}
                                  className="px-4 py-2 bg-[#E89B52] hover:bg-[#d4863e] text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
                                >
                                  Copy Verification Code
                                </button>

                                <button
                                  onClick={() => window.print()}
                                  className="px-4 py-2 bg-white border border-[#E7DED1] hover:bg-gray-50 text-gray-800 font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
                                >
                                  <FileText size={14} /> Print / Save PDF Diploma
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>

            {/* GLOBAL VERIFICATION LOOKUP TOOL */}
            <div className="bg-white border border-[#E7DED1] p-6 rounded-2xl shadow-xs space-y-4">
              <div className="space-y-1">
                <h4 className="font-display font-black text-sm uppercase text-gray-900 flex items-center gap-2">
                  <Search size={16} className="text-[#E89B52]" />
                  Global Public Certificate Verification Lookup
                </h4>
                <p className="text-xs text-gray-500">
                  Enter any official academy verification code (e.g. <code>AB-CERT-KRAR-2026-X8K9M2</code>) to test cryptographic credential validity:
                </p>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!globalCodeInput.trim()) return;
                  const res = verifyCertificateCodeForStudent({
                    code: globalCodeInput.trim(),
                    studentId: currentUser?.id || '',
                    studentEmail: currentUser?.email,
                    studentName: currentUser?.fullName
                  });
                  setGlobalCodeResult(res);
                }}
                className="flex flex-col sm:flex-row gap-2"
              >
                <input
                  type="text"
                  value={globalCodeInput}
                  onChange={(e) => {
                    setGlobalCodeInput(e.target.value);
                    setGlobalCodeResult(null);
                  }}
                  placeholder="e.g. AB-CERT-KRAR-2026-X8K9M2"
                  className="flex-1 px-4 py-2 bg-[#FAF6EF] border border-[#E7DED1] rounded-xl text-xs font-mono font-bold text-gray-900 uppercase focus:outline-none focus:border-[#E89B52]"
                />
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#2B2B2B] hover:bg-black text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer shrink-0"
                >
                  <Search size={14} /> Verify Code
                </button>
              </form>

              {globalCodeResult && (
                <div className="pt-2 animate-fadeIn">
                  {globalCodeResult.success && globalCodeResult.certificate ? (
                    <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2 text-xs text-emerald-900">
                      <div className="flex items-center gap-2 font-bold text-emerald-800">
                        <CheckCircle size={16} className="text-emerald-600" />
                        <span>VERIFIED DIPLOMA RECORD FOUND</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-[11px]">
                        <div>Student: <strong>{globalCodeResult.certificate.studentName}</strong></div>
                        <div>Course: <strong>{globalCodeResult.certificate.courseName}</strong></div>
                        <div>Code: <strong>{globalCodeResult.certificate.verificationCode}</strong></div>
                        <div>Issued By: <strong>{globalCodeResult.certificate.issuedByTeacherName}</strong></div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl space-y-1 text-xs text-red-800">
                      <div className="flex items-center gap-2 font-bold text-red-700">
                        <AlertTriangle size={16} className="text-red-600" />
                        <span>VERIFICATION EXCEPTION</span>
                      </div>
                      <p>{globalCodeResult.error}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ==========================================
// 2. PARENT GUARDIAN DASHBOARD
// ==========================================
export function ParentDashboard({ onNavigate, lang }: DashboardProps) {
  return <ParentPortal onNavigate={onNavigate} lang={lang} />;
}

function LegacyParentDashboardCode() {
  const { currentUser, updateProfile, addNotification } = useAuth();
  const [parentStatus, setParentStatus] = useState<'Draft' | 'Submitted' | 'Under Review' | 'Approved' | 'Rejected'>(
    currentUser?.parentStatus || 'Draft'
  );

  // Parent profile state
  const [address, setAddress] = useState(currentUser?.parentProfile?.address || '');
  const [relationship, setRelationship] = useState(currentUser?.parentProfile?.relationship || 'Mother');
  const [photo, setPhoto] = useState<string | null>(currentUser?.parentProfile?.photo || null);
  const [emergencyName, setEmergencyName] = useState(currentUser?.parentProfile?.emergencyName || '');
  const [emergencyPhone, setEmergencyPhone] = useState(currentUser?.parentProfile?.emergencyPhone || '');
  const [emergencyEmail, setEmergencyEmail] = useState(currentUser?.parentProfile?.emergencyEmail || '');

  // Children linkages
  const [children, setChildren] = useState<{ id: string; fullName: string; currentLevel: string; age?: number; instrument?: string }[]>(
    currentUser?.parentProfile?.children || currentUser?.linkedChildren || []
  );

  // New child form inputs
  const [childNameInput, setChildNameInput] = useState('');
  const [childAgeInput, setChildAgeInput] = useState('10');
  const [childInstrumentInput, setChildInstrumentInput] = useState('Begena');

  // Load draft progress
  useEffect(() => {
    if (currentUser) {
      const savedDraft = localStorage.getItem(`ab_parent_draft_${currentUser.email}`);
      if (savedDraft) {
        try {
          const draft = JSON.parse(savedDraft);
          if (!currentUser.parentProfile) {
            setAddress(draft.address || '');
            setRelationship(draft.relationship || 'Mother');
            setPhoto(draft.photo || null);
            setEmergencyName(draft.emergencyName || '');
            setEmergencyPhone(draft.emergencyPhone || '');
            setEmergencyEmail(draft.emergencyEmail || '');
            setChildren(draft.children || []);
          }
        } catch (e) {}
      }
    }
  }, [currentUser]);

  // Sync parentStatus state when currentUser updates
  useEffect(() => {
    if (currentUser?.parentStatus) {
      setParentStatus(currentUser.parentStatus);
    }
  }, [currentUser?.parentStatus]);

  // Save draft progress helper
  const saveDraft = (updatedFields: any = {}, showFeedback = true) => {
    if (currentUser) {
      let fieldsToMerge = {};
      let feedback = showFeedback;
      if (typeof updatedFields === 'boolean') {
        feedback = updatedFields;
      } else if (typeof updatedFields === 'object' && updatedFields !== null) {
        fieldsToMerge = updatedFields;
      }

      const draft = {
        address,
        relationship,
        photo,
        emergencyName,
        emergencyPhone,
        emergencyEmail,
        children,
        ...fieldsToMerge
      };
      localStorage.setItem(`ab_parent_draft_${currentUser.email}`, JSON.stringify(draft));
      if (feedback === true && Object.keys(fieldsToMerge).length === 0) {
        addNotification('Draft Saved', 'Your incomplete Parent/Guardian onboarding application was saved.', 'system');
      }
    }
  };

  const handleAddChild = () => {
    if (!childNameInput.trim()) {
      addNotification('Validation Error', 'Please enter your child\'s full name.', 'system');
      return;
    }
    const newChild = {
      id: `u_student_lnk_${Date.now()}`,
      fullName: childNameInput.trim(),
      currentLevel: 'Level 1 Beginner',
      age: parseInt(childAgeInput) || 10,
      instrument: childInstrumentInput
    };
    const updatedChildren = [...children, newChild];
    setChildren(updatedChildren);
    setChildNameInput('');
    
    // Save draft auto-sync
    const draft = {
      address,
      relationship,
      photo,
      emergencyName,
      emergencyPhone,
      emergencyEmail,
      children: updatedChildren
    };
    if (currentUser) {
      localStorage.setItem(`ab_parent_draft_${currentUser.email}`, JSON.stringify(draft));
    }
    addNotification('Child Appended', `${newChild.fullName} added to registration listing.`, 'system');
  };

  const handleRemoveChild = (id: string) => {
    const updatedChildren = children.filter(c => c.id !== id);
    setChildren(updatedChildren);
    
    // Save draft auto-sync
    const draft = {
      address,
      relationship,
      photo,
      emergencyName,
      emergencyPhone,
      emergencyEmail,
      children: updatedChildren
    };
    if (currentUser) {
      localStorage.setItem(`ab_parent_draft_${currentUser.email}`, JSON.stringify(draft));
    }
  };

  const handleSubmitOnboarding = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) {
      addNotification('Validation Error', 'Parent current residential address is required.', 'system');
      return;
    }
    if (children.length === 0) {
      addNotification('Validation Error', 'You must link or register at least one child to onboarding.', 'system');
      return;
    }
    if (!emergencyName.trim() || !emergencyPhone.trim()) {
      addNotification('Validation Error', 'Emergency contact details are required.', 'system');
      return;
    }

    const updatedProfileData = {
      fullName: currentUser?.fullName || '',
      photo: photo || undefined,
      phone: currentUser?.phone || '',
      email: currentUser?.email || '',
      address,
      relationship,
      emergencyName,
      emergencyPhone,
      emergencyEmail,
      children
    };

    setParentStatus('Submitted');
    await updateProfile({
      parentStatus: 'Submitted',
      parentProfile: updatedProfileData,
      linkedChildren: children.map(c => ({ id: c.id, fullName: c.fullName, currentLevel: c.currentLevel }))
    });

    // Clear draft
    if (currentUser) {
      localStorage.removeItem(`ab_parent_draft_${currentUser.email}`);
    }

    addNotification('Application Submitted', 'Your Parent/Guardian application has been successfully submitted.', 'registration');
  };

  const handleSandboxBypass = async () => {
    const mockChildren = children.length > 0 ? children : [
      { id: 'u_student_lnk_default', fullName: 'Abebe Kebede', currentLevel: 'Level 1 Beginner', age: 11, instrument: 'Begena' }
    ];

    setParentStatus('Approved');
    await updateProfile({
      parentStatus: 'Approved',
      parentProfile: {
        fullName: currentUser?.fullName || 'Parent Guardian',
        phone: currentUser?.phone || '',
        email: currentUser?.email || '',
        address: address || 'Addis Ababa, Piazza',
        relationship: relationship || 'Father',
        emergencyName: emergencyName || 'Ayalew Kebede',
        emergencyPhone: emergencyPhone || '+251911223344',
        emergencyEmail: emergencyEmail || 'ayalew@gmail.com',
        children: mockChildren
      },
      linkedChildren: mockChildren.map(c => ({ id: c.id, fullName: c.fullName, currentLevel: c.currentLevel }))
    });

    addNotification('Sandbox Bypass', 'Parent Application Approved! Family dashboard unlocked.', 'system');
  };

  const [selectedChild, setSelectedChild] = useState(children[0]?.id || 'u_student_1');

  // Update selected child fallback if list changes
  useEffect(() => {
    if (children.length > 0 && !children.find(c => c?.id === selectedChild)) {
      if (children[0]?.id) {
        setSelectedChild(children[0].id);
      }
    }
  }, [children, selectedChild]);

  // Interactive metrics for child dashboard view
  const childLogs = {
    u_student_1: {
      fullName: 'Abebe Kebede',
      instrument: 'Begena - Level 1',
      attendance: '94% (16 of 17 lectures)',
      nextClass: 'Saturday 9:00 AM (Instructor Abel)',
      practiceStreak: '5 Days',
      latestNotes: 'Practiced standard Begena tuning and Mezmur #1 chords.',
      grade: 'A-',
      recentFeedback: 'Excellent commitment. Abebe is grasping the sacred chord-plucking of the first string beautifully.',
      paymentStatus: 'UP TO DATE'
    }
  };

  const currentChildInfo = children.find(c => c && c.id === selectedChild);
  const child = {
    fullName: currentChildInfo?.fullName || 'Abebe Kebede',
    instrument: `${currentChildInfo?.instrument || 'Begena'} - ${currentChildInfo?.currentLevel || 'Level 1'}`,
    attendance: '94% (16 of 17 lectures)',
    nextClass: 'Saturday 9:00 AM (Instructor Abel)',
    practiceStreak: '5 Days',
    latestNotes: 'Practiced standard Begena tuning and Mezmur #1 chords.',
    grade: 'A-',
    recentFeedback: 'Excellent commitment. Gaining confidence with note progressions.',
    paymentStatus: 'UP TO DATE'
  };

  // ----------------------------------------------------
  // RENDER ONBOARDING WIZARD (DRAFT / INCOMPLETE)
  // ----------------------------------------------------
  if (parentStatus === 'Draft' || !parentStatus) {
    return (
      <div className="max-w-3xl mx-auto space-y-8 py-4 text-left">
        <div className="bg-white border border-[#E7DED1] p-6 rounded-2xl shadow-xs">
          <span className="text-[10px] tracking-widest text-[#E89B52] uppercase font-bold">REGISTRATION PORTAL</span>
          <h2 className="font-display font-black text-2xl text-[#2B2B2B] uppercase">Parent / Guardian Onboarding</h2>
          <p className="text-xs text-gray-500">Provide family details to link students and enable complete academic monitoring.</p>
        </div>

        <form onSubmit={handleSubmitOnboarding} className="bg-white border border-[#E7DED1] rounded-2xl p-8 space-y-6 shadow-sm">
          {/* SECTION 1: PARENT DETAILS */}
          <div className="space-y-4 border-b border-gray-100 pb-6">
            <h3 className="font-display font-black text-sm uppercase text-[#2B2B2B] tracking-wider flex items-center gap-2">
              <span className="w-6 h-6 bg-[#FAF6EF] text-[#E89B52] rounded-full flex items-center justify-center text-xs border border-[#E7DED1]">1</span>
              Guardian Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Guardian Full Name</label>
                <Input disabled value={currentUser?.fullName || ''} onChange={() => {}} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Relationship to Student(s)</label>
                <select
                  className="w-full p-2 bg-[#FAF6EF] border border-[#E7DED1] rounded-md text-xs font-bold text-gray-700"
                  value={relationship}
                  onChange={(e) => { setRelationship(e.target.value); saveDraft({ relationship: e.target.value }); }}
                >
                  <option value="Mother">Mother</option>
                  <option value="Father">Father</option>
                  <option value="Aunt">Aunt</option>
                  <option value="Uncle">Uncle</option>
                  <option value="Grandparent">Grandparent</option>
                  <option value="Legal Guardian">Legal Guardian</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Contact Email</label>
                <Input disabled value={currentUser?.email || ''} onChange={() => {}} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Contact Phone</label>
                <Input disabled value={currentUser?.phone || ''} onChange={() => {}} />
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Residential Address (Ethiopia-friendly)</label>
                <Input
                  required
                  placeholder="e.g. Addis Ababa, Bole Sub-City, Woreda 03, H.No 120"
                  value={address}
                  onChange={(e) => { setAddress(e.target.value); saveDraft({ address: e.target.value }); }}
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: CHILD REGISTER */}
          <div className="space-y-4 border-b border-gray-100 pb-6">
            <h3 className="font-display font-black text-sm uppercase text-[#2B2B2B] tracking-wider flex items-center gap-2">
              <span className="w-6 h-6 bg-[#FAF6EF] text-[#E89B52] rounded-full flex items-center justify-center text-xs border border-[#E7DED1]">2</span>
              Children Enrolled / Linking List
            </h3>

            {/* List of current children */}
            {children.length === 0 ? (
              <div className="p-4 bg-[#FAF6EF] rounded-xl border border-[#E7DED1] text-center">
                <p className="text-xs text-gray-500 font-medium">No children added yet. Add at least one student below.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {children.map((c, index) => (
                  <div key={c.id} className="p-3 border border-gray-100 bg-[#FAF6EF]/30 rounded-xl flex justify-between items-center text-xs">
                    <div>
                      <span className="font-bold text-[#2B2B2B]">{c.fullName}</span>
                      <span className="text-[10px] text-gray-400 block">{c.instrument} • {c.age} years old</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveChild(c.id)}
                      className="w-8 h-8 rounded-full hover:bg-red-50 text-red-500 flex items-center justify-center border border-transparent hover:border-red-100 transition-colors cursor-pointer"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Form to add a child */}
            <div className="p-4 border border-[#E7DED1] bg-[#FAF6EF]/25 rounded-2xl space-y-3">
              <span className="block text-[10px] font-bold text-[#E89B52] uppercase tracking-wider">Add a Student Child</span>
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                <div className="sm:col-span-5 space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Child\'s Full Name</label>
                  <Input
                    placeholder="e.g. Abebe Kebede"
                    value={childNameInput}
                    onChange={(e) => setChildNameInput(e.target.value)}
                  />
                </div>
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Age</label>
                  <Input
                    type="number"
                    min="5"
                    max="22"
                    value={childAgeInput}
                    onChange={(e) => setChildAgeInput(e.target.value)}
                  />
                </div>
                <div className="sm:col-span-3 space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Course / Instrument</label>
                  <select
                    className="w-full p-2 bg-white border border-[#E7DED1] rounded-md text-xs font-bold text-gray-700"
                    value={childInstrumentInput}
                    onChange={(e) => setChildInstrumentInput(e.target.value)}
                  >
                    <option value="Begena">Begena</option>
                    <option value="Krar">Krar</option>
                    <option value="Masenqo">Masenqo</option>
                    <option value="Washint">Washint</option>
                    <option value="Vocal">Vocal</option>
                    <option value="Kebero">Kebero</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <button
                    type="button"
                    onClick={handleAddChild}
                    className="w-full py-2 bg-[#E89B52] hover:bg-[#d4863e] text-white rounded-lg text-xs font-bold cursor-pointer transition-colors shadow-3xs"
                  >
                    Add Child
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 3: EMERGENCY */}
          <div className="space-y-4 pb-4">
            <h3 className="font-display font-black text-sm uppercase text-[#2B2B2B] tracking-wider flex items-center gap-2">
              <span className="w-6 h-6 bg-[#FAF6EF] text-[#E89B52] rounded-full flex items-center justify-center text-xs border border-[#E7DED1]">3</span>
              Emergency Contact (Guarantor)
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Contact Full Name</label>
                <Input
                  required
                  placeholder="e.g. Ayalew Kebede"
                  value={emergencyName}
                  onChange={(e) => { setEmergencyName(e.target.value); saveDraft({ emergencyName: e.target.value }); }}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Emergency Phone</label>
                <Input
                  required
                  placeholder="e.g. +251 911 223 344"
                  value={emergencyPhone}
                  onChange={(e) => { setEmergencyPhone(e.target.value); saveDraft({ emergencyPhone: e.target.value }); }}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Emergency Email (Optional)</label>
                <Input
                  type="email"
                  placeholder="e.g. emergency@gmail.com"
                  value={emergencyEmail}
                  onChange={(e) => { setEmergencyEmail(e.target.value); saveDraft({ emergencyEmail: e.target.value }); }}
                />
              </div>
            </div>
          </div>

          {/* CONTROL BAR */}
          <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => { saveDraft(); addNotification('Draft Saved', 'Your application state has been updated.', 'system'); }}
              className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold uppercase tracking-wider rounded-xl text-xs transition-colors cursor-pointer text-center"
            >
              Save Draft
            </button>
            <Button
              type="submit"
              variant="primary"
              className="flex-[2] font-bold uppercase tracking-wider py-3"
            >
              Submit Application
            </Button>
          </div>
        </form>
      </div>
    );
  }

  // ----------------------------------------------------
  // RENDER PENDING / APPLICATION TRACKING TIMELINE
  // ----------------------------------------------------
  if (parentStatus === 'Submitted' || parentStatus === 'Under Review') {
    return (
      <div className="max-w-2xl mx-auto space-y-8 py-4 text-left">
        <div className="bg-white border border-[#E7DED1] p-6 rounded-2xl shadow-sm space-y-4">
          <div className="w-12 h-12 bg-[#FAF6EF] border border-[#E7DED1] text-[#E89B52] rounded-full flex items-center justify-center">
            <RefreshCw size={24} className="animate-spin text-[#E89B52]" />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] tracking-widest text-[#E89B52] font-black uppercase">APPLICATION TRANSMITTED</span>
            <h2 className="font-display font-black text-xl text-[#2B2B2B] uppercase">Family Profile Under Audit</h2>
            <p className="text-xs text-gray-500 leading-relaxed">
              Congratulations! Your Parent/Guardian verification form has been received. Our administration department is auditing the link requests for your registered children:
              <b> {children.map(c => c.fullName).join(', ')}</b>.
            </p>
          </div>

          <div className="pt-4 space-y-4">
            <span className="block text-[10px] font-bold text-gray-400 uppercase">Process Milestones</span>
            
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-5 h-5 rounded-full bg-green-500 border border-green-200 text-white flex items-center justify-center text-[10px] shrink-0 font-bold">✓</div>
                <div>
                  <span className="block text-xs font-bold text-[#2B2B2B]">Step 1: Guardian Profile Initiated</span>
                  <span className="block text-[10px] text-gray-400">Personal phone, address details, relationship mapping submitted.</span>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-5 h-5 rounded-full bg-green-500 border border-green-200 text-white flex items-center justify-center text-[10px] shrink-0 font-bold">✓</div>
                <div>
                  <span className="block text-xs font-bold text-[#2B2B2B]">Step 2: Child Link Request Complete</span>
                  <span className="block text-[10px] text-gray-400">Registered {children.length} student relationship linkages.</span>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-5 h-5 rounded-full bg-yellow-500 border border-yellow-200 text-white flex items-center justify-center text-[10px] shrink-0 font-bold">!</div>
                <div>
                  <span className="block text-xs font-bold text-[#2B2B2B]">Step 3: Registration Desk Audit</span>
                  <span className="block text-[10px] text-yellow-600 font-medium animate-pulse">Our staff is verifying academic links to active courses.</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex flex-col gap-2">
            <Button variant="primary" size="sm" className="w-full" onClick={handleSandboxBypass}>
              Sandbox Bypass: Approve Parent Application
            </Button>
            <button
              onClick={() => { setParentStatus('Draft'); }}
              className="text-xs text-gray-400 hover:text-gray-500 underline py-2 text-center"
            >
              Edit Submission details
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // RENDER APPROVED/HIRED PARENT DASHBOARD
  // ----------------------------------------------------
  return (
    <div className="space-y-8 text-left">
      <div className="bg-white border border-[#E7DED1] p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-xs">
        <div>
          <span className="text-[10px] tracking-widest text-[#E89B52] uppercase font-bold">FAMILY PORTAL</span>
          <h2 className="font-display font-black text-2xl text-[#2B2B2B]">WELCOME, {currentUser?.fullName.toUpperCase()}!</h2>
          <p className="text-xs text-gray-500">Monitor and support your children's traditional musical journey.</p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="font-semibold text-gray-400 uppercase">Linked Student:</span>
          <select
            className="p-2 bg-[#FAF6EF] border border-[#E7DED1] rounded-md font-bold text-gray-700"
            value={selectedChild}
            onChange={(e) => setSelectedChild(e.target.value)}
          >
            {children.map((c) => (
              <option key={c.id} value={c.id}>
                {c.fullName} ({c.currentLevel})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Child stats card 1 */}
        <div className="bg-white border border-[#E7DED1] p-5 rounded-2xl space-y-1 shadow-xs">
          <span className="text-[10px] text-gray-400 uppercase font-bold">Course Attendance</span>
          <p className="font-display font-black text-xl text-[#2B2B2B]">{child.attendance}</p>
        </div>

        {/* Child stats card 2 */}
        <div className="bg-white border border-[#E7DED1] p-5 rounded-2xl space-y-1 shadow-xs">
          <span className="text-[10px] text-gray-400 uppercase font-bold">Practice Hours Streak</span>
          <p className="font-display font-black text-xl text-[#2B2B2B]">{child.practiceStreak}</p>
        </div>

        {/* Child stats card 3 */}
        <div className="bg-white border border-[#E7DED1] p-5 rounded-2xl space-y-1 shadow-xs">
          <span className="text-[10px] text-gray-400 uppercase font-bold">Academic Performance</span>
          <p className="font-display font-black text-xl text-[#E89B52]">{child.grade}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* PROGRESS BLOCK */}
        <div className="bg-white border border-[#E7DED1] p-6 rounded-2xl shadow-xs space-y-4">
          <h3 className="font-display font-black text-sm text-[#2B2B2B] uppercase tracking-wider flex items-center gap-2">
            <Activity size={18} className="text-[#E89B52]" />
            Live Practice Log
          </h3>
          <div className="p-4 bg-[#FAF6EF] rounded-xl border border-[#E7DED1] space-y-2 text-xs">
            <span className="text-[#E89B52] font-bold">Instructor Abel\'s Feedback:</span>
            <p className="text-gray-600 italic leading-relaxed">
              "{child.recentFeedback}"
            </p>
          </div>

          <div className="space-y-3 pt-2 text-xs">
            <div className="flex justify-between font-bold">
              <span>Next Class Session:</span>
              <span className="text-gray-500">{child.nextClass}</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Instrument Type:</span>
              <span className="text-gray-500">{child.instrument}</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Finance Billing:</span>
              <span className="px-2 py-0.5 bg-green-50 border border-green-200 text-green-700 rounded text-[10px] font-mono">
                {child.paymentStatus}
              </span>
            </div>
          </div>
        </div>

        {/* PARENT BILLING DESK */}
        <div className="bg-white border border-[#E7DED1] p-6 rounded-2xl shadow-xs space-y-4">
          <h3 className="font-display font-black text-sm text-[#2B2B2B] uppercase tracking-wider flex items-center gap-2">
            <DollarSign size={18} className="text-[#E89B52]" />
            Billing & Invoices
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-3 border border-gray-100 rounded-xl flex justify-between items-center bg-[#FAF6EF]/20">
              <div>
                <span className="block font-bold">Tuition #INV-2026-07</span>
                <span className="text-[10px] text-gray-400">Paid on July 10, 2026 • CBE</span>
              </div>
              <span className="font-bold text-green-600">4,500 ETB Paid</span>
            </div>

            <div className="p-3 border border-gray-100 rounded-xl flex justify-between items-center">
              <div>
                <span className="block font-bold">Registration Entry Token</span>
                <span className="text-[10px] text-gray-400">Paid on July 01, 2026 • Bank transfer</span>
              </div>
              <span className="font-bold text-green-600">500 ETB Paid</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 3. TEACHER DASHBOARD
// ==========================================
export function TeacherDashboard({ onNavigate, lang }: DashboardProps) {
  const { currentUser, updateProfile, addNotification } = useAuth();
  
  // Teacher Status
  const [teacherStatus, setTeacherStatus] = useState<'Draft' | 'Submitted' | 'Under Review' | 'Interview Required' | 'Approved' | 'Rejected' | 'Hired'>(
    currentUser?.role === 'teacher' ? 'Hired' : (currentUser?.teacherStatus || 'Draft')
  );

  const [applicationId, setApplicationId] = useState<string>(
    currentUser?.teacherApplication?.applicationId || `APP-TEACHER-${Math.floor(100000 + Math.random() * 900000)}`
  );

  // Application wizard steps (1 to 13)
  const [appStep, setAppStep] = useState(1);

  // Form Fields
  const [fullName, setFullName] = useState(currentUser?.fullName || '');
  const [dob, setDob] = useState(currentUser?.teacherApplication?.dob || '1990-01-01');
  const [gender, setGender] = useState(currentUser?.teacherApplication?.gender || 'Male');
  const [photo, setPhoto] = useState<string | null>(currentUser?.teacherApplication?.photo || null);
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [address, setAddress] = useState(currentUser?.teacherApplication?.address || '');
  const [education, setEducation] = useState(currentUser?.teacherApplication?.education || '');
  const [certificates, setCertificates] = useState(currentUser?.teacherApplication?.certificates || '');
  const [previousSchool, setPreviousSchool] = useState(currentUser?.teacherApplication?.previousSchool || '');
  const [instruments, setInstruments] = useState<string[]>(currentUser?.teacherApplication?.instruments || []);
  const [experienceYears, setExperienceYears] = useState(currentUser?.teacherApplication?.experienceYears || '3');
  const [teachingExperience, setTeachingExperience] = useState(currentUser?.teacherApplication?.teachingExperience || '');
  const [specialSkills, setSpecialSkills] = useState(currentUser?.teacherApplication?.specialSkills || '');
  const [bio, setBio] = useState(currentUser?.teacherApplication?.bio || '');
  const [availableDays, setAvailableDays] = useState<string[]>(currentUser?.teacherApplication?.availableDays || ['Saturday', 'Sunday']);
  const [availableHours, setAvailableHours] = useState(currentUser?.teacherApplication?.availableHours || 'Morning (8:00 AM - 12:00 PM)');
  const [onlineAvailability, setOnlineAvailability] = useState(currentUser?.teacherApplication?.onlineAvailability ?? true);
  const [preferredBranch, setPreferredBranch] = useState(currentUser?.teacherApplication?.preferredBranch || 'Piazza');
  const [documentsUploaded, setDocumentsUploaded] = useState<string[]>(currentUser?.teacherApplication?.documentsUploaded || ['Resume_Traditional_Instrument.pdf']);

  // Load draft progress
  useEffect(() => {
    if (currentUser) {
      const savedDraft = localStorage.getItem(`ab_teacher_draft_${currentUser.email}`);
      if (savedDraft) {
        try {
          const draft = JSON.parse(savedDraft);
          if (!currentUser.teacherApplication) {
            setAppStep(draft.appStep || 1);
            setDob(draft.dob || '1990-01-01');
            setGender(draft.gender || 'Male');
            setPhoto(draft.photo || null);
            setAddress(draft.address || '');
            setEducation(draft.education || '');
            setCertificates(draft.certificates || '');
            setPreviousSchool(draft.previousSchool || '');
            setInstruments(draft.instruments || []);
            setExperienceYears(draft.experienceYears || '3');
            setTeachingExperience(draft.teachingExperience || '');
            setSpecialSkills(draft.specialSkills || '');
            setBio(draft.bio || '');
            setAvailableDays(draft.availableDays || ['Saturday', 'Sunday']);
            setAvailableHours(draft.availableHours || 'Morning (8:00 AM - 12:00 PM)');
            setOnlineAvailability(draft.onlineAvailability ?? true);
            setPreferredBranch(draft.preferredBranch || 'Piazza');
            setDocumentsUploaded(draft.documentsUploaded || ['Resume_Traditional_Instrument.pdf']);
          }
        } catch (e) {}
      }
    }
  }, [currentUser]);

  // Sync state if currentUser updates
  useEffect(() => {
    if (currentUser?.teacherStatus) {
      setTeacherStatus(currentUser.teacherStatus);
    }
  }, [currentUser?.teacherStatus]);

  // Save draft helper
  const saveTeacherDraft = (updatedFields: any) => {
    if (currentUser) {
      const draft = {
        appStep,
        dob,
        gender,
        photo,
        address,
        education,
        certificates,
        previousSchool,
        instruments,
        experienceYears,
        teachingExperience,
        specialSkills,
        bio,
        availableDays,
        availableHours,
        onlineAvailability,
        preferredBranch,
        documentsUploaded,
        ...updatedFields
      };
      localStorage.setItem(`ab_teacher_draft_${currentUser.email}`, JSON.stringify(draft));
    }
  };

  const handleInstrumentToggle = (inst: string) => {
    const updated = instruments.includes(inst)
      ? instruments.filter(i => i !== inst)
      : [...instruments, inst];
    setInstruments(updated);
    saveTeacherDraft({ instruments: updated });
  };

  const handleDayToggle = (day: string) => {
    const updated = availableDays.includes(day)
      ? availableDays.filter(d => d !== day)
      : [...availableDays, day];
    setAvailableDays(updated);
    saveTeacherDraft({ availableDays: updated });
  };

  const handleSubmitApplication = async () => {
    const teacherAppData = {
      applicationId,
      fullName,
      photo: photo || undefined,
      phone,
      email,
      address,
      dob,
      gender,
      instruments,
      experienceYears,
      teachingExperience,
      previousSchool,
      education,
      certificates,
      specialSkills,
      bio,
      preferredBranch,
      onlineAvailability,
      availableDays,
      availableHours,
      documentsUploaded
    };

    setTeacherStatus('Submitted');
    await updateProfile({
      teacherStatus: 'Submitted',
      teacherApplication: teacherAppData
    });

    // Clear draft
    if (currentUser) {
      localStorage.removeItem(`ab_teacher_draft_${currentUser.email}`);
    }

    addNotification('Application Submitted', 'Your Abel Begena School Teacher Application was submitted.', 'registration');
  };

  const handleSandboxBypass = async () => {
    setTeacherStatus('Hired');
    await updateProfile({
      teacherStatus: 'Hired',
      teacherApplication: {
        applicationId,
        fullName: fullName || currentUser?.fullName || 'Instructor Abel',
        photo: photo || undefined,
        phone: phone || currentUser?.phone || '',
        email: email || currentUser?.email || '',
        address: address || 'Addis Ababa, Piazza',
        dob,
        gender,
        instruments: instruments.length > 0 ? instruments : ['Begena', 'Krar'],
        experienceYears,
        teachingExperience,
        previousSchool,
        education,
        certificates,
        specialSkills,
        bio,
        preferredBranch,
        onlineAvailability,
        availableDays,
        availableHours,
        documentsUploaded
      }
    });
    addNotification('Sandbox Bypass', 'Teacher Application Approved & Hired! Faculty dashboard unlocked.', 'system');
  };

  // ----------------------------------------------------
  // INTERACTIVE GRADING WORKSPACE FOR APPROVED TEACHER
  // ----------------------------------------------------
  const [submissions, setSubmissions] = useState<any[]>([]);

  const [scoringId, setScoringId] = useState<string | null>(null);
  const [score, setScore] = useState('A');
  const [teacherFeedback, setTeacherFeedback] = useState('');

  const handleScoreSubmission = (id: string) => {
    const updated = submissions.map((sub) => {
      if (sub.id === id) {
        return { ...sub, status: 'Graded', grade: score };
      }
      return sub;
    });
    setSubmissions(updated);
    setScoringId(null);
    setTeacherFeedback('');
    addNotification('Grade Assigned', 'Student homework evaluated and scorecard published.', 'feedback');
  };

  // ----------------------------------------------------
  // RENDER TEACHER APPLICATION WIZARD (DRAFT)
  // ----------------------------------------------------
  if (teacherStatus === 'Draft' || !teacherStatus) {
    return (
      <div className="max-w-3xl mx-auto space-y-8 py-4 text-left">
        <div className="bg-white border border-[#E7DED1] p-6 rounded-2xl shadow-xs">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] tracking-widest text-[#E89B52] uppercase font-bold">FACULTY APPLICATION</span>
              <h2 className="font-display font-black text-2xl text-[#2B2B2B] uppercase">Academic Appointment Portal</h2>
              <p className="text-xs text-gray-500">Apply to join our esteemed traditional school. Progress is saved automatically.</p>
            </div>
            <span className="text-xs font-mono font-bold bg-[#FAF6EF] border border-[#E7DED1] px-3 py-1.5 rounded-lg text-[#E89B52]">
              STEP {appStep} OF 13
            </span>
          </div>
          {/* Visual progress bar */}
          <div className="w-full bg-gray-100 h-1.5 mt-4 rounded-full overflow-hidden">
            <div className="bg-[#E89B52] h-full transition-all duration-300" style={{ width: `${(appStep / 13) * 100}%` }} />
          </div>
        </div>

        <div className="bg-white border border-[#E7DED1] rounded-2xl p-8 space-y-6 shadow-sm min-h-[350px] flex flex-col justify-between">
          <div className="space-y-4">
            
            {/* STEP 1: PERSONAL INFORMATION */}
            {appStep === 1 && (
              <div className="space-y-4 animate-fadeIn">
                <h3 className="font-display font-black text-sm uppercase text-[#2B2B2B]">Step 1: Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Teacher Full Name</label>
                    <Input value={fullName} onChange={(e) => { setFullName(e.target.value); saveTeacherDraft({ fullName: e.target.value }); }} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Gender</label>
                    <select
                      className="w-full p-2 bg-[#FAF6EF] border border-[#E7DED1] rounded-md text-xs font-bold text-gray-700"
                      value={gender}
                      onChange={(e) => { setGender(e.target.value); saveTeacherDraft({ gender: e.target.value }); }}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Date of Birth</label>
                    <Input type="date" value={dob} onChange={(e) => { setDob(e.target.value); saveTeacherDraft({ dob: e.target.value }); }} />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: PHOTO SELECTION */}
            {appStep === 2 && (
              <div className="space-y-4 animate-fadeIn text-center py-6">
                <h3 className="font-display font-black text-sm uppercase text-[#2B2B2B] text-left">Step 2: Profile Photo Upload</h3>
                <p className="text-xs text-gray-500 text-left">Upload a professional headshot. This is published in our student directory once appointed.</p>
                
                <div className="w-28 h-28 mx-auto rounded-full border border-dashed border-[#E7DED1] flex items-center justify-center bg-[#FAF6EF]">
                  {photo ? (
                    <img src={photo} className="w-full h-full rounded-full object-cover" alt="Profile avatar" referrerPolicy="no-referrer" />
                  ) : (
                    <User size={36} className="text-gray-400" />
                  )}
                </div>

                <div className="flex justify-center gap-2 pt-2">
                  <label className="px-3 py-1.5 bg-[#E89B52] hover:bg-[#d68a42] text-white text-xs font-bold rounded cursor-pointer transition">
                    Upload Photo
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            const res = reader.result as string;
                            setPhoto(res);
                            saveTeacherDraft({ photo: res });
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                  {photo && (
                    <button
                      type="button"
                      onClick={() => { setPhoto(null); saveTeacherDraft({ photo: '' }); }}
                      className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded transition"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* STEP 3: CONTACT INFORMATION */}
            {appStep === 3 && (
              <div className="space-y-4 animate-fadeIn">
                <h3 className="font-display font-black text-sm uppercase text-[#2B2B2B]">Step 3: Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Contact Phone</label>
                    <Input value={phone} onChange={(e) => { setPhone(e.target.value); saveTeacherDraft({ phone: e.target.value }); }} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Contact Email</label>
                    <Input type="email" value={email} onChange={(e) => { setEmail(e.target.value); saveTeacherDraft({ email: e.target.value }); }} />
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Current Residence / Mailing Address</label>
                    <Input placeholder="e.g. Addis Ababa, Megenagna" value={address} onChange={(e) => { setAddress(e.target.value); saveTeacherDraft({ address: e.target.value }); }} />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: PROFESSIONAL BACKGROUND */}
            {appStep === 4 && (
              <div className="space-y-4 animate-fadeIn">
                <h3 className="font-display font-black text-sm uppercase text-[#2B2B2B]">Step 4: Academic Background</h3>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Highest Level of Education Completed</label>
                    <Input placeholder="e.g. BA in Music Theology, Yared School of Music" value={education} onChange={(e) => { setEducation(e.target.value); saveTeacherDraft({ education: e.target.value }); }} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Religious or Secular Music Certificates</label>
                    <Input placeholder="e.g. Certificate of Mezemer / Deacon" value={certificates} onChange={(e) => { setCertificates(e.target.value); saveTeacherDraft({ certificates: e.target.value }); }} />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 5: INSTRUMENTS */}
            {appStep === 5 && (
              <div className="space-y-4 animate-fadeIn">
                <h3 className="font-display font-black text-sm uppercase text-[#2B2B2B]">Step 5: Instrument Expertise</h3>
                <p className="text-xs text-gray-500">Select all traditional instruments you are qualified to tutor.</p>
                <div className="grid grid-cols-2 gap-3 pt-2">
                  {['Begena', 'Krar', 'Masenqo', 'Washint', 'Vocal', 'Kebero'].map((inst) => {
                    const isSelected = instruments.includes(inst);
                    return (
                      <button
                        key={inst}
                        onClick={() => handleInstrumentToggle(inst)}
                        className={`p-3 text-left border rounded-xl flex items-center justify-between text-xs font-bold transition-all ${
                          isSelected ? 'border-[#E89B52] bg-[#FAF6EF] text-[#2B2B2B]' : 'border-gray-200 text-gray-500 hover:border-gray-300'
                        }`}
                      >
                        <span>{inst}</span>
                        {isSelected && <span className="text-[#E89B52] font-black">✓</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 6: TEACHING EXPERIENCE */}
            {appStep === 6 && (
              <div className="space-y-4 animate-fadeIn">
                <h3 className="font-display font-black text-sm uppercase text-[#2B2B2B]">Step 6: Teaching & Classroom Experience</h3>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Years of Active Music Experience</label>
                    <select
                      className="w-full p-2 bg-[#FAF6EF] border border-[#E7DED1] rounded-md text-xs font-bold text-gray-700"
                      value={experienceYears}
                      onChange={(e) => { setExperienceYears(e.target.value); saveTeacherDraft({ experienceYears: e.target.value }); }}
                    >
                      <option value="1">1 - 2 Years</option>
                      <option value="3">3 - 5 Years</option>
                      <option value="6">6 - 9 Years</option>
                      <option value="10">10+ Years Traditional Master</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Detail Previous Schools or Churches taught at</label>
                    <textarea
                      className="w-full p-2.5 border border-[#E7DED1] rounded-md text-xs outline-none h-20"
                      placeholder="e.g. Parish Choir School, Holy Trinity Cathedral"
                      value={teachingExperience}
                      onChange={(e) => { setTeachingExperience(e.target.value); saveTeacherDraft({ teachingExperience: e.target.value }); }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 7: SPECIALIZATIONS */}
            {appStep === 7 && (
              <div className="space-y-4 animate-fadeIn">
                <h3 className="font-display font-black text-sm uppercase text-[#2B2B2B]">Step 7: Specializations & Unique Skills</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Specific Tuning / Liturgical Choirs / Solo Recitals expertise</label>
                    <Input placeholder="e.g. Geez/Ezel scale notation, liturgical vocal coaching" value={specialSkills} onChange={(e) => { setSpecialSkills(e.target.value); saveTeacherDraft({ specialSkills: e.target.value }); }} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Short Professional Bio</label>
                    <textarea
                      className="w-full p-2.5 border border-[#E7DED1] rounded-md text-xs outline-none h-20"
                      placeholder="Brief personal summary for promotional literature..."
                      value={bio}
                      onChange={(e) => { setBio(e.target.value); saveTeacherDraft({ bio: e.target.value }); }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 8: AVAILABILITY */}
            {appStep === 8 && (
              <div className="space-y-4 animate-fadeIn">
                <h3 className="font-display font-black text-sm uppercase text-[#2B2B2B]">Step 8: Available Teaching Days</h3>
                <p className="text-xs text-gray-500">Select all days of the week you can tutor classes.</p>
                <div className="grid grid-cols-3 gap-2">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => {
                    const isSelected = availableDays.includes(day);
                    return (
                      <button
                        key={day}
                        onClick={() => handleDayToggle(day)}
                        className={`py-2 text-center border rounded-lg text-xs font-bold transition-all ${
                          isSelected ? 'border-[#E89B52] bg-[#FAF6EF] text-[#2B2B2B]' : 'border-gray-200 text-gray-400 hover:border-gray-300'
                        }`}
                      >
                        {day.substring(0, 3)}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 9: PREFERRED BRANCH */}
            {appStep === 9 && (
              <div className="space-y-4 animate-fadeIn">
                <h3 className="font-display font-black text-sm uppercase text-[#2B2B2B]">Step 9: Preferred Physical Branch</h3>
                <select
                  className="w-full p-2.5 bg-[#FAF6EF] border border-[#E7DED1] rounded-md text-xs font-bold text-gray-700"
                  value={preferredBranch}
                  onChange={(e) => { setPreferredBranch(e.target.value); saveTeacherDraft({ preferredBranch: e.target.value }); }}
                >
                  <option value="Piazza">Piazza Branch (Central Capital)</option>
                  <option value="Megenagna">Megenagna Branch (East Addis)</option>
                  <option value="Lebu">Lebu Branch (South Capital)</option>
                </select>
              </div>
            )}

            {/* STEP 10: ONLINE TEACHING AVAILABILITY */}
            {appStep === 10 && (
              <div className="space-y-4 animate-fadeIn">
                <h3 className="font-display font-black text-sm uppercase text-[#2B2B2B]">Step 10: Online / Hybrid Teaching</h3>
                <p className="text-xs text-gray-500">Are you comfortable conducting classes via webcam to online students internationally?</p>
                
                <div className="flex gap-4 pt-2">
                  <button
                    onClick={() => { setOnlineAvailability(true); saveTeacherDraft({ onlineAvailability: true }); }}
                    className={`flex-1 py-3 border rounded-xl text-xs font-bold ${onlineAvailability ? 'border-[#E89B52] bg-[#FAF6EF] text-[#2B2B2B]' : 'border-gray-200 text-gray-400'}`}
                  >
                    Yes, Comfortable with Online
                  </button>
                  <button
                    onClick={() => { setOnlineAvailability(false); saveTeacherDraft({ onlineAvailability: false }); }}
                    className={`flex-1 py-3 border rounded-xl text-xs font-bold ${!onlineAvailability ? 'border-red-500 bg-red-50 text-red-700' : 'border-gray-200 text-gray-400'}`}
                  >
                    No, In-Person Only
                  </button>
                </div>
              </div>
            )}

            {/* STEP 11: SUPPORTING DOCUMENTS */}
            {appStep === 11 && (
              <div className="space-y-4 animate-fadeIn">
                <h3 className="font-display font-black text-sm uppercase text-[#2B2B2B]">Step 11: Upload Supporting Documents</h3>
                <p className="text-xs text-gray-500">Please upload your curriculum vitae, recommendation letter, or certificates.</p>
                
                <div className="p-4 border border-dashed border-[#E7DED1] bg-[#FAF6EF]/25 rounded-2xl space-y-3">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span>Uploaded Documents</span>
                    <span className="text-[#E89B52]">{documentsUploaded.length} Files</span>
                  </div>
                  <div className="space-y-1.5 text-xs text-gray-600">
                    {documentsUploaded.map((file, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-white p-2 rounded-lg border border-gray-100">
                        <span>📄 {file}</span>
                        <span className="text-green-600 font-mono text-[10px]">VERIFIED ✓</span>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => {
                      const updated = [...documentsUploaded, 'Recommendation_Letter_Parish.pdf'];
                      setDocumentsUploaded(updated);
                      saveTeacherDraft({ documentsUploaded: updated });
                    }}
                    className="w-full py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold text-gray-600"
                  >
                    + Mock Upload Document file
                  </button>
                </div>
              </div>
            )}

            {/* STEP 12: APPLICATION REVIEW */}
            {appStep === 12 && (
              <div className="space-y-4 animate-fadeIn text-xs">
                <h3 className="font-display font-black text-sm uppercase text-[#2B2B2B]">Step 12: Comprehensive Review</h3>
                <div className="bg-[#FAF6EF]/30 border border-[#E7DED1] rounded-2xl p-4 space-y-2 max-h-[220px] overflow-y-auto">
                  <div className="grid grid-cols-2 gap-y-1 border-b border-gray-100 pb-2 mb-2">
                    <span className="text-gray-400">Full Name:</span>
                    <span className="font-bold text-right">{fullName}</span>
                    <span className="text-gray-400">Gender & DOB:</span>
                    <span className="font-bold text-right">{gender}, {dob}</span>
                    <span className="text-gray-400">Residential:</span>
                    <span className="font-bold text-right">{address}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-y-1 border-b border-gray-100 pb-2 mb-2">
                    <span className="text-gray-400">Education:</span>
                    <span className="font-bold text-right">{education}</span>
                    <span className="text-gray-400">Qualified Instruments:</span>
                    <span className="font-bold text-right text-yellow-600">{instruments.join(', ') || 'None selected'}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-y-1">
                    <span className="text-gray-400">Branch Pref:</span>
                    <span className="font-bold text-right">{preferredBranch}</span>
                    <span className="text-gray-400">Days Available:</span>
                    <span className="font-bold text-right">{availableDays.join(', ')}</span>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 13: SUBMIT APPLICATION */}
            {appStep === 13 && (
              <div className="space-y-4 animate-fadeIn text-center py-6">
                <CheckCircle size={48} className="mx-auto text-green-500 animate-bounce" />
                <h3 className="font-display font-black text-base uppercase text-[#2B2B2B]">Step 13: Submit Application Dossier</h3>
                <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">
                  Excellent! Your complete teacher application dossier is parsed and validated. Submit now to begin school-board review.
                </p>
              </div>
            )}

          </div>

          {/* FOOTER WIZARD CONTROLS */}
          <div className="flex gap-2 pt-4 border-t border-gray-100">
            {appStep > 1 && (
              <button
                onClick={() => { const s = appStep - 1; setAppStep(s); saveTeacherDraft({ appStep: s }); }}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold text-xs uppercase rounded-lg transition-colors cursor-pointer"
              >
                Back
              </button>
            )}
            
            <button
              onClick={() => { saveTeacherDraft({ appStep }); addNotification('Draft Saved', 'Teacher application saved to local storage.', 'system'); }}
              className="px-4 py-2 bg-gray-50 border border-gray-200 text-gray-500 font-bold text-xs uppercase rounded-lg transition-colors cursor-pointer"
            >
              Save Draft
            </button>

            {appStep < 13 ? (
              <Button
                variant="primary"
                className="flex-1 font-bold text-xs uppercase py-2.5"
                onClick={() => { const s = appStep + 1; setAppStep(s); saveTeacherDraft({ appStep: s }); }}
              >
                Continue
              </Button>
            ) : (
              <Button
                variant="primary"
                className="flex-1 font-bold text-xs uppercase py-2.5 bg-green-600 hover:bg-green-700"
                onClick={handleSubmitApplication}
              >
                Submit Application Dossier
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // RENDER PENDING / APPLICATION STATUS TRACKER
  // ----------------------------------------------------
  if (teacherStatus === 'Submitted' || teacherStatus === 'Under Review' || teacherStatus === 'Interview Required') {
    return (
      <div className="max-w-2xl mx-auto space-y-8 py-4 text-left">
        <div className="bg-white border border-[#E7DED1] p-6 rounded-2xl shadow-sm space-y-4">
          <div className="w-12 h-12 bg-yellow-50 border border-yellow-200 text-[#E89B52] rounded-full flex items-center justify-center">
            <RefreshCw size={24} className="animate-spin text-[#E89B52]" />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] tracking-widest text-[#E89B52] font-black uppercase">APPLICATION FILED</span>
            <h2 className="font-display font-black text-xl text-[#2B2B2B] uppercase">TEACHER REVIEW IN PROGRESS</h2>
            <div className="flex flex-col gap-1 text-xs text-gray-400">
              <span><b>Application ID:</b> {applicationId}</span>
              <span><b>Current Status:</b> <span className="text-[#E89B52] font-bold">{teacherStatus.toUpperCase()}</span></span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed pt-2">
              Welcome, <b>{fullName || currentUser?.fullName}</b>. Your application is safely filed in our school registrar database. We are evaluating your traditional {instruments.join(', ')} capabilities.
            </p>
          </div>

          <div className="pt-4 space-y-4">
            <span className="block text-[10px] font-bold text-gray-400 uppercase font-mono">Faculty Milestones</span>
            
            <div className="space-y-4">
              <div className="flex gap-3 text-xs">
                <div className="w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center text-[10px] font-bold shrink-0">✓</div>
                <div>
                  <span className="block font-bold text-[#2B2B2B]">Step 1: Application Filed</span>
                  <span className="block text-[10px] text-gray-400">All 13 sections parsed, uploaded certificates indexed.</span>
                </div>
              </div>

              <div className="flex gap-3 text-xs">
                <div className="w-5 h-5 rounded-full bg-yellow-500 text-white flex items-center justify-center text-[10px] font-bold shrink-0">!</div>
                <div>
                  <span className="block font-bold text-[#2B2B2B]">Step 2: Qualifications Audit</span>
                  <span className="block text-[10px] text-yellow-600 font-medium animate-pulse">Lique Mezemer Abel reviewing {instruments.join(', ')} pedagogy suitability.</span>
                </div>
              </div>

              <div className="flex gap-3 text-xs">
                <div className="w-5 h-5 rounded-full bg-gray-200 text-gray-400 flex items-center justify-center text-[10px] font-bold shrink-0">-</div>
                <div>
                  <span className="block font-bold text-gray-400">Step 3: Board Interview & Recital</span>
                  <span className="block text-[10px] text-gray-400">In-person recitation of Geez melody scales required.</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex flex-col gap-2">
            <Button variant="primary" size="sm" className="w-full bg-[#E89B52] text-white font-bold" onClick={handleSandboxBypass}>
              Sandbox Bypass: Approve Application & Hire
            </Button>
            <button
              onClick={() => { setTeacherStatus('Draft'); }}
              className="text-xs text-gray-400 hover:text-gray-500 underline py-1 text-center"
            >
              Update Application Details
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // APPROVED / HIRED STAFF TEACHING CLASSROOM WORKSPACE
  // ----------------------------------------------------
  return <TeacherPortal onNavigate={onNavigate} lang={lang} />;
}

// ==========================================
// 4. REGISTRATION STAFF DASHBOARD
// ==========================================
export function RegistrationStaffDashboard({ onNavigate, lang }: DashboardProps) {
  return <RegistrationStaffPortal onNavigate={onNavigate} lang={lang} />;
}

// ==========================================
// 5. BRANCH MANAGER DASHBOARD
// ==========================================
export function BranchManagerDashboard({ onNavigate, lang }: DashboardProps) {
  return <BranchManagerPortal onNavigate={onNavigate} lang={lang} />;
}

// ==========================================
// 6. ACCOUNTANT DASHBOARD
// ==========================================
export function AccountantDashboard({ onNavigate, lang }: DashboardProps) {
  return <AccountantPortal onNavigate={onNavigate} lang={lang} />;
}

// ==========================================
// 7. ADMIN DASHBOARD
// ==========================================
export function AdminDashboard({ onNavigate, lang }: DashboardProps) {
  return <AdminPortal onNavigate={onNavigate} lang={lang} initialMode="admin" />;
}

// ==========================================
// 8. SUPER ADMIN DASHBOARD
// ==========================================
export function SuperAdminDashboard({ onNavigate, lang }: DashboardProps) {
  return <AdminPortal onNavigate={onNavigate} lang={lang} initialMode="super_admin" />;
}

// ==========================================
// 9. FOUNDER EXECUTIVE DASHBOARD
// ==========================================
export function FounderDashboard({ onNavigate, lang }: DashboardProps) {
  return <AdminPortal onNavigate={onNavigate} lang={lang} initialMode="founder" />;
}

