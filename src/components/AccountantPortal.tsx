import React, { useState, useEffect } from 'react';
import {
  DollarSign, CreditCard, TrendingUp, TrendingDown, FileText, CheckCircle,
  AlertCircle, AlertTriangle, Calendar, Clock, Filter, Search, Download,
  Printer, ArrowUpRight, ArrowDownRight, Building, Users, PieChart, BarChart2,
  CheckSquare, XCircle, RefreshCw, Eye, Plus, ChevronRight, ShieldCheck,
  Receipt, Wallet, CornerUpLeft, Award, HelpCircle, LogOut, Check, X,
  QrCode, ExternalLink, MessageSquare, Send, Bell, Layers, FileSpreadsheet, Lock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Button, Input } from './InteractiveComponents';
import { ThemeToggle } from './ThemeToggle';
import { safeSetItem } from '../utils/storage';
import { PageId } from '../types';
import { resolvePaymentIdForTransaction } from '../utils/accountantVerification';

interface AccountantPortalProps {
  onNavigate: (page: PageId, params?: any) => void;
  lang: 'en' | 'am';
}

export interface FinancialTransaction {
  id: string; // e.g. TXN-2026-9081
  studentName: string;
  studentId: string;
  course: string;
  level: string;
  branch: 'Piazza Branch' | 'Megenagna Branch' | 'Lebu Branch';
  paymentType: 'Registration Fee' | 'Monthly Tuition' | 'Full Course Fee' | 'Instrument Purchase' | 'Other';
  amount: number;
  paymentMethod: 'CBE' | 'Telebirr' | 'Cash';
  date: string;
  referenceNumber: string;
  receiptImage?: string;
  status: 'Pending' | 'Verified' | 'Rejected' | 'Refunded' | 'Cancelled';
  createdBy: string;
  verifiedBy?: string;
  verificationDate?: string;
  notes?: string;
}

export interface CoursePricingConfig {
  courseName: string;
  level: string;
  threeMonthFeeETB: number;
  sixMonthFeeETB: number;
  nineMonthFeeETB: number;
  effectiveDate: string;
}

export interface StudentPaymentPlan {
  studentId: string;
  studentName: string;
  course: string;
  branch: string;
  totalCourseFee: number;
  totalPaid: number;
  remainingBalance: number;
  monthlyAmount: number;
  nextDueDate: string;
  overdueDays: number;
  status: 'Paid' | 'Partially Paid' | 'Due' | 'Overdue' | 'Suspended';
}

export interface SchoolExpense {
  id: string;
  category: 'Rent' | 'Utilities' | 'Internet' | 'Teacher Payments' | 'Staff Payments' | 'Instrument Purchase' | 'Instrument Maintenance' | 'Marketing' | 'Events' | 'Transportation' | 'Office Supplies' | 'Other';
  description: string;
  amount: number;
  date: string;
  branch: 'Piazza Branch' | 'Megenagna Branch' | 'Lebu Branch' | 'Central';
  paymentMethod: 'CBE' | 'Telebirr' | 'Cash';
  vendor?: string;
  receiptImage?: string;
  createdBy: string;
  status: 'Approved' | 'Pending Review' | 'Rejected';
}

export interface RefundRecord {
  id: string; // e.g., REF-8810
  transactionId: string;
  studentName: string;
  amount: number;
  reason: string;
  requestedDate: string;
  status: 'Requested' | 'Under Review' | 'Approved' | 'Rejected' | 'Processed';
  approvedBy?: string;
}

export interface DailyClosingRecord {
  date: string;
  branch: string;
  openingCash: number;
  cashReceived: number;
  cashExpenses: number;
  cashRefunds: number;
  closingCash: number;
  expectedCash: number;
  variance: number;
  explanation?: string;
  submittedBy: string;
  status: 'Reconciled' | 'Discrepancy Flagged';
}

export function AccountantPortal({ onNavigate, lang }: AccountantPortalProps) {
  const { currentUser, getAuthoritativeUser, addNotification, logout } = useAuth();
  const { payments, approvePaymentRecord, rejectPaymentRecord, addStudentRegistration } = useData();

  // Active Navigation Tab
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'transactions' | 'cash-entry' | 'pricing' | 'payment-plans' | 'overdue' | 'receipts' | 'refunds' | 'expenses' | 'branches' | 'reports' | 'closing' | 'audit'
  >('dashboard');

  // Filter & Search States
  const [globalSearch, setGlobalSearch] = useState('');
  const [filterBranch, setFilterBranch] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [filterMethod, setFilterMethod] = useState<string>('All');
  const [filterType, setFilterType] = useState<string>('All');
  const [dateRange, setDateRange] = useState<'Today' | 'This Week' | 'This Month' | 'Year to Date'>('This Month');

  // Modal / Selected Item States
  const [selectedTxn, setSelectedTxn] = useState<FinancialTransaction | null>(null);
  const [activeReceiptModal, setActiveReceiptModal] = useState<FinancialTransaction | null>(null);
  const [publicVerifyReceiptId, setPublicVerifyReceiptId] = useState<string | null>(null);

  // System Configurable Registration Fee State
  const [registrationFeeConfig, setRegistrationFeeConfig] = useState<{ amountETB: number; effectiveDate: string }>({
    amountETB: 500,
    effectiveDate: '2026-01-01'
  });
  const [newRegFeeInput, setNewRegFeeInput] = useState<number>(500);

  // ----------------------------------------------------
  // CENTRALIZED FINANCIAL DATA (Synced via LocalStorage)
  // ----------------------------------------------------
  const [transactions, setTransactions] = useState<FinancialTransaction[]>(() => {
    const saved = localStorage.getItem('ab_transactions_v3');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter((t: any) =>
            t &&
            t.id &&
            !['Abebe Kebede', 'Lidya Solomon', 'Kidus Yohannes', 'Bethlehem Tadesse', 'Dawit Yohannes'].includes(t.studentName)
          );
        }
      } catch (e) {}
    }
    return [];
  });

  const [coursePricing, setCoursePricing] = useState<CoursePricingConfig[]>(() => {
    const saved = localStorage.getItem('ab_pricing_v3');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      { courseName: 'Begena', level: 'Basic 1 / Basic 2 / Basic 3', threeMonthFeeETB: 3000, sixMonthFeeETB: 5000, nineMonthFeeETB: 7000, effectiveDate: '2026-01-01' },
      { courseName: 'Krar', level: 'Basic / Intermediate / Advanced', threeMonthFeeETB: 2800, sixMonthFeeETB: 4800, nineMonthFeeETB: 6500, effectiveDate: '2026-01-01' },
      { courseName: 'Masenqo', level: 'Basic / Advanced', threeMonthFeeETB: 3000, sixMonthFeeETB: 5200, nineMonthFeeETB: 7200, effectiveDate: '2026-01-01' },
      { courseName: 'Washint', level: 'Basic / Advanced', threeMonthFeeETB: 2500, sixMonthFeeETB: 4200, nineMonthFeeETB: 6000, effectiveDate: '2026-01-01' },
      { courseName: 'Vocal (Zema)', level: 'Basic / Advanced', threeMonthFeeETB: 3200, sixMonthFeeETB: 5500, nineMonthFeeETB: 7500, effectiveDate: '2026-01-01' },
      { courseName: 'Kebero', level: 'Basic / Advanced', threeMonthFeeETB: 2500, sixMonthFeeETB: 4200, nineMonthFeeETB: 6000, effectiveDate: '2026-01-01' }
    ];
  });

  const [studentPlans, setStudentPlans] = useState<StudentPaymentPlan[]>(() => {
    const saved = localStorage.getItem('ab_student_plans_v3');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter((p: any) =>
            p && !['Abebe Kebede', 'Lidya Solomon', 'Kidus Yohannes', 'Dawit Yohannes'].includes(p.studentName)
          );
        }
      } catch (e) {}
    }
    return [];
  });

  const [expenses, setExpenses] = useState<SchoolExpense[]>(() => {
    const saved = localStorage.getItem('ab_expenses_v3');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      { id: 'EXP-101', category: 'Teacher Payments', description: 'Faculty stipends for July 2026 - Lique Mezemer Abel', amount: 12000, date: '2026-07-20', branch: 'Piazza Branch', paymentMethod: 'CBE', vendor: 'Faculty Payroll', createdBy: 'Martha Hailu', status: 'Approved' },
      { id: 'EXP-102', category: 'Rent', description: 'Monthly facility lease - Piazza Branch', amount: 25000, date: '2026-07-01', branch: 'Piazza Branch', paymentMethod: 'CBE', vendor: 'Piazza Real Estate', createdBy: 'Martha Hailu', status: 'Approved' },
      { id: 'EXP-103', category: 'Instrument Maintenance', description: 'Begena string replacements & tuning tools', amount: 3500, date: '2026-07-15', branch: 'Central', paymentMethod: 'Cash', vendor: 'Traditional Artisan Workshop', createdBy: 'Martha Hailu', status: 'Approved' }
    ];
  });

  const [refunds, setRefunds] = useState<RefundRecord[]>(() => {
    const saved = localStorage.getItem('ab_refunds_v3');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      { id: 'REF-801', transactionId: 'TXN-2026-7910', studentName: 'Ermias Tadesse', amount: 3000, reason: 'Duplicate payment error via CBE transfer', requestedDate: '2026-07-18', status: 'Approved', approvedBy: 'Founder / Super Admin' }
    ];
  });

  const [dailyClosings, setDailyClosings] = useState<DailyClosingRecord[]>(() => {
    const saved = localStorage.getItem('ab_closings_v3');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      { date: '2026-07-20', branch: 'Piazza Branch', openingCash: 15000, cashReceived: 5500, cashExpenses: 1200, cashRefunds: 0, closingCash: 19300, expectedCash: 19300, variance: 0, submittedBy: 'Martha Hailu', status: 'Reconciled' }
    ];
  });

  const [financialAuditLogs, setFinancialAuditLogs] = useState<{ id: string; user: string; role: string; action: string; target: string; time: string }[]>(() => {
    const saved = localStorage.getItem('ab_fin_audit_v3');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      { id: 'faud_1', user: currentUser?.fullName || 'Martha Hailu', role: 'Accountant', action: 'Log In', target: 'Financial Management Console', time: 'Today, 08:45 AM' }
    ];
  });

  // Sync state changes to LocalStorage
  useEffect(() => { safeSetItem('ab_transactions_v3', JSON.stringify(transactions)); }, [transactions]);
  useEffect(() => { safeSetItem('ab_pricing_v3', JSON.stringify(coursePricing)); }, [coursePricing]);
  useEffect(() => { safeSetItem('ab_student_plans_v3', JSON.stringify(studentPlans)); }, [studentPlans]);
  useEffect(() => { safeSetItem('ab_expenses_v3', JSON.stringify(expenses)); }, [expenses]);
  useEffect(() => { safeSetItem('ab_refunds_v3', JSON.stringify(refunds)); }, [refunds]);
  useEffect(() => { safeSetItem('ab_closings_v3', JSON.stringify(dailyClosings)); }, [dailyClosings]);
  useEffect(() => { safeSetItem('ab_fin_audit_v3', JSON.stringify(financialAuditLogs)); }, [financialAuditLogs]);

  // Listen for global profile updates to reload financial transaction records with authoritative student details
  useEffect(() => {
    const handleProfileSync = () => {
      const saved = localStorage.getItem('ab_transactions_v3');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) setTransactions(parsed);
        } catch (e) {}
      }
    };

    window.addEventListener('user-profile-updated', handleProfileSync);
    window.addEventListener('ab_students_updated', handleProfileSync);
    window.addEventListener('ab_transactions_updated', handleProfileSync);
    return () => {
      window.removeEventListener('user-profile-updated', handleProfileSync);
      window.removeEventListener('ab_students_updated', handleProfileSync);
      window.removeEventListener('ab_transactions_updated', handleProfileSync);
    };
  }, []);

  // AUTO-SYNC SUBMITTED APPLICATIONS & PAYMENTS INTO ACCOUNTANT AUDIT DESK
  useEffect(() => {
    let changed = false;
    let updatedTxns = [...transactions];

    const normalizeBranch = (b?: string): 'Piazza Branch' | 'Megenagna Branch' | 'Lebu Branch' => {
      if (!b) return 'Piazza Branch';
      if (b.includes('Megenagna')) return 'Megenagna Branch';
      if (b.includes('Lebu')) return 'Lebu Branch';
      return 'Piazza Branch';
    };

    // 1. Scan submitted applications from `ab_applications_v3`
    try {
      const savedApps = JSON.parse(localStorage.getItem('ab_applications_v3') || '[]');
      savedApps.forEach((app: any) => {
        const appId = app.id || app.applicationId;
        const refNo = app.payment?.ref || app.referenceNumber || app.paymentReference || (appId ? `REF-${appId}` : '');
        const studentName = app.studentName || `${app.firstName || ''} ${app.lastName || ''}`.trim() || app.fullName || 'Registered Student';
        
        const exists = updatedTxns.some(t => 
          t.id === `TXN-${appId}` || 
          (refNo && t.referenceNumber === refNo) || 
          (t.studentName === studentName && t.course === (app.course?.name || app.selectedCourseName))
        );

        if (!exists && (app.payment || app.paymentMethod || app.status === 'Application Submitted' || app.paymentStatus)) {
          const isVerified = app.paymentStatus === 'Approved' || app.status === 'Approved' || app.status === 'Verified';
          const isRejected = app.paymentStatus === 'Rejected' || app.status === 'Rejected';
          const txnStatus = isVerified ? 'Verified' : isRejected ? 'Rejected' : 'Pending';

          const newTxn: FinancialTransaction = {
            id: `TXN-${appId || Math.floor(1000 + Math.random() * 8999)}`,
            studentName: studentName,
            studentId: app.userId || appId || `ABS-PZ-2026-${Math.floor(1000 + Math.random() * 8999)}`,
            course: app.course?.name || app.selectedCourseName || 'Begena Basic 1',
            level: app.level || app.selectedLevelName || 'Basic 1',
            branch: normalizeBranch(app.branch || app.selectedBranch),
            paymentType: 'Full Course Fee',
            amount: Number(app.payment?.amount || app.course?.totalDue || app.totalETB || 5000),
            paymentMethod: (app.payment?.method || app.paymentMethod || 'CBE') as any,
            date: app.payment?.date || (app.submittedAt ? app.submittedAt.split('T')[0] : new Date().toISOString().split('T')[0]),
            referenceNumber: refNo || `CBE-REF-${Math.floor(100000 + Math.random() * 899999)}`,
            receiptImage: app.payment?.receipt || app.receiptUrl || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=80',
            status: txnStatus,
            createdBy: 'Student Direct Registration',
            notes: `Submitted online application. Course: ${app.course?.name || app.selectedCourseName || 'Begena'}`
          };

          updatedTxns.unshift(newTxn);
          changed = true;
        }
      });
    } catch (e) {
      console.error("Error reading ab_applications_v3 in AccountantPortal", e);
    }

    // 2. Scan DataContext `payments`
    if (payments && payments.length > 0) {
      payments.forEach((p) => {
        const exists = updatedTxns.some(t => t.id === p.id || t.id === `TXN-${p.id}` || (p.referenceNumber && t.referenceNumber === p.referenceNumber));
        if (!exists) {
          const txnStatus = p.status === 'Approved' ? 'Verified' : p.status === 'Rejected' ? 'Rejected' : 'Pending';
          const newTxn: FinancialTransaction = {
            id: p.id.startsWith('TXN') ? p.id : `TXN-${p.id}`,
            studentName: p.studentName,
            studentId: p.studentId || `STU-${Math.floor(1000 + Math.random() * 8999)}`,
            course: p.courseName || 'Begena Basic 1',
            level: 'Basic 1',
            branch: normalizeBranch(p.branch),
            paymentType: 'Full Course Fee',
            amount: p.amountETB,
            paymentMethod: p.paymentMethod as any,
            date: p.createdAt ? p.createdAt.split('T')[0] : new Date().toISOString().split('T')[0],
            referenceNumber: p.referenceNumber,
            receiptImage: p.screenshotUrl || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=80',
            status: txnStatus,
            createdBy: 'Student Direct',
            notes: `Submitted payment receipt ref: ${p.referenceNumber}`
          };
          updatedTxns.unshift(newTxn);
          changed = true;
        }
      });
    }

    if (changed) {
      setTransactions(updatedTxns);
    }
  }, [payments]);

  // Log Audit helper
  const logAudit = (action: string, target: string) => {
    const item = {
      id: `faud_${Date.now()}`,
      user: currentUser?.fullName || 'Martha Hailu (Accountant)',
      role: 'Accountant',
      action,
      target,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setFinancialAuditLogs(prev => [item, ...prev]);
  };

  // ----------------------------------------------------
  // COMPUTED REVENUE & STATS METRICS
  // ----------------------------------------------------
  const verifiedTxns = transactions.filter(t => t.status === 'Verified');
  const totalRevenue = verifiedTxns.reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = expenses.filter(e => e.status === 'Approved').reduce((sum, e) => sum + e.amount, 0);
  const netRevenue = totalRevenue - totalExpenses;
  const pendingTxnsCount = transactions.filter(t => t.status === 'Pending').length;
  const overdueCount = studentPlans.filter(p => p.status === 'Overdue').length;

  const regFeeRevenue = verifiedTxns.filter(t => t.paymentType === 'Registration Fee' || t.notes?.includes('registration fee')).reduce((sum, t) => sum + (t.paymentType === 'Registration Fee' ? t.amount : 500), 0);
  const courseFeeRevenue = totalRevenue - regFeeRevenue;

  // Branch Specific Revenue Metrics
  const piazzaRevenue = verifiedTxns.filter(t => t.branch === 'Piazza Branch').reduce((sum, t) => sum + t.amount, 0);
  const megenagnaRevenue = verifiedTxns.filter(t => t.branch === 'Megenagna Branch').reduce((sum, t) => sum + t.amount, 0);
  const lebuRevenue = verifiedTxns.filter(t => t.branch === 'Lebu Branch').reduce((sum, t) => sum + t.amount, 0);

  // ----------------------------------------------------
  // TRANSACTION AUDIT WORKFLOW (Requirement 7)
  // ----------------------------------------------------
  const handleVerifyTransaction = (txnId: string) => {
    const targetTxn = transactions.find(t => t.id === txnId);
    const resolvedPaymentId = resolvePaymentIdForTransaction(txnId, payments, targetTxn);
    const alreadyApproved = payments.some((payment) => payment.id === resolvedPaymentId && (payment.status === 'Approved'));

    if (alreadyApproved) {
      setTransactions(prev => prev.map(t => t.id === txnId ? { ...t, status: 'Verified' } : t));
      setSelectedTxn(null);
      return;
    }

    const approved = approvePaymentRecord(resolvedPaymentId, currentUser?.fullName || 'Martha Hailu (Accountant)');
    if (!approved) {
      return;
    }

    setTransactions(prev => prev.map(t => {
      if (t.id === txnId) {
        return {
          ...t,
          status: 'Verified',
          verifiedBy: currentUser?.fullName || 'Martha Hailu (Accountant)',
          verificationDate: new Date().toLocaleString()
        };
      }
      return t;
    }));

    // Update matching student payment plan if existing
    if (targetTxn) {
      setStudentPlans(prev => prev.map(p => {
        if (p.studentId === targetTxn.studentId || p.studentName === targetTxn.studentName) {
          const newPaid = p.totalPaid + targetTxn.amount;
          const newRem = Math.max(0, p.totalCourseFee - newPaid);
          return {
            ...p,
            totalPaid: newPaid,
            remainingBalance: newRem,
            status: newRem === 0 ? 'Paid' : 'Partially Paid'
          };
        }
        return p;
      }));

      // Update student record in localStorage (`ab_students_v3` & `ab_applications_v3`) for cross-system sync!
      try {
        const savedApps = JSON.parse(localStorage.getItem('ab_applications_v3') || '[]');
        const updatedApps = savedApps.map((app: any) => {
          const appFullName = `${app.firstName || ''} ${app.lastName || ''}`.trim();
          const matchId = app.id === targetTxn.studentId || app.studentId === targetTxn.studentId || app.applicationId === targetTxn.studentId;
          const matchName = targetTxn.studentName && (
            (app.studentName && app.studentName.trim().toLowerCase() === targetTxn.studentName.trim().toLowerCase()) ||
            (appFullName && appFullName.toLowerCase() === targetTxn.studentName.trim().toLowerCase())
          );
          const matchEmail = app.email && (targetTxn as any).studentEmail && app.email.trim().toLowerCase() === (targetTxn as any).studentEmail.trim().toLowerCase();
          if (
            matchId ||
            matchName ||
            matchEmail ||
            app.userId === targetTxn.studentId ||
            `TXN-${app.id}` === txnId ||
            `TXN-${app.applicationId}` === txnId
          ) {
            return { ...app, paymentStatus: 'Approved', status: 'Approved', isPaymentCompleted: true, studentStatus: 'Enrollment Active' };
          }
          return app;
        });
        safeSetItem('ab_applications_v3', JSON.stringify(updatedApps));

        const savedStudents = JSON.parse(localStorage.getItem('ab_students_v3') || '[]');
        let studentFound = false;
        const updatedStudents = savedStudents.map((s: any) => {
          const matchId = s.id === targetTxn.studentId || s.studentId === targetTxn.studentId || s.applicationId === targetTxn.studentId;
          const matchName = s.fullName && targetTxn.studentName && s.fullName.trim().toLowerCase() === targetTxn.studentName.trim().toLowerCase();
          const matchEmail = s.email && (targetTxn as any).studentEmail && s.email.trim().toLowerCase() === (targetTxn as any).studentEmail.trim().toLowerCase();
          if (matchId || matchName || matchEmail) {
            studentFound = true;
            return {
              ...s,
              tuitionPaid: true,
              registrationFeePaid: true,
              status: 'Active',
              studentStatus: 'Enrollment Active',
              paymentStatus: 'Verified'
            };
          }
          return s;
        });

        if (!studentFound) {
          // Find matching application for additional details
          const matchingApp = savedApps.find((app: any) =>
            app.id === targetTxn.studentId ||
            app.applicationId === targetTxn.studentId ||
            app.studentName === targetTxn.studentName ||
            `${app.firstName || ''} ${app.lastName || ''}`.trim() === targetTxn.studentName ||
            app.userId === targetTxn.studentId
          );

          const newStudentRec = {
            id: targetTxn.studentId || (matchingApp ? matchingApp.studentId : `ABS-PZ-2026-${Math.floor(1000 + Math.random() * 8999)}`),
            applicationId: matchingApp?.applicationId || targetTxn.studentId,
            fullName: targetTxn.studentName,
            gender: matchingApp?.gender || 'Not Specified',
            phone: matchingApp?.phone || '+251911000000',
            email: matchingApp?.email || 'student@begena.com',
            course: targetTxn.course,
            level: targetTxn.level,
            branch: targetTxn.branch,
            mode: matchingApp?.learningMode || 'In-Person',
            schedule: matchingApp?.scheduleDayTime || 'Standard Schedule',
            teacherName: 'Lique Mezemer Abel',
            enrollmentDate: new Date().toISOString().split('T')[0],
            status: 'Active',
            studentStatus: 'Enrollment Active',
            paymentStatus: 'Verified',
            registrationFeePaid: true,
            tuitionPaid: true,
            attendancePercent: 100,
            photo: ''
          };
          updatedStudents.unshift(newStudentRec);
        }

        safeSetItem('ab_students_v3', JSON.stringify(updatedStudents));

        // Update enrollment record to Active status and trigger teacher auto-assignment
        try {
          const savedEnrs = JSON.parse(localStorage.getItem('ab_enrollments_v4') || '[]');
          let enrChanged = false;
          const updatedEnrs = savedEnrs.map((enr: any) => {
            const enrMatchId = enr.studentId === targetTxn.studentId || enr.studentId === targetTxn?.studentId;
            const enrMatchName = enr.studentName && targetTxn?.studentName && enr.studentName.trim().toLowerCase() === targetTxn.studentName.trim().toLowerCase();
            const enrMatchEmail = enr.studentEmail && (targetTxn as any).studentEmail && enr.studentEmail.trim().toLowerCase() === (targetTxn as any).studentEmail.trim().toLowerCase();
            if (enrMatchId || enrMatchName || enrMatchEmail) {
              enrChanged = true;
              return {
                ...enr,
                status: 'Active',
                paymentStatus: 'Verified'
              };
            }
            return enr;
          });
          if (enrChanged) {
            safeSetItem('ab_enrollments_v4', JSON.stringify(updatedEnrs));
            window.dispatchEvent(new Event('ab_enrollments_updated'));
          }
        } catch (e) {
          console.error('Error updating enrollment status in AccountantPortal:', e);
        }

        // Update user accounts (`ab_accounts` & active session `ab_session_user`)
        const txnCourse = targetTxn.course || 'Kirar - Basic Level 1';
        const txnInst = (targetTxn as any).instrument || (txnCourse.toLowerCase().includes('kirar') || txnCourse.toLowerCase().includes('krar') ? 'Kirar' : txnCourse.split(' ')[0]);

        const savedAccounts = JSON.parse(localStorage.getItem('ab_accounts') || '{}');
        let accountUpdated = false;
        Object.keys(savedAccounts).forEach(email => {
          const acc = savedAccounts[email];
          if (acc.id === targetTxn.studentId || acc.fullName === targetTxn.studentName) {
            savedAccounts[email] = {
              ...acc,
              studentStatus: 'Enrollment Active',
              isRegistrationCompleted: true,
              isPaymentCompleted: true,
              status: 'Active',
              enrolledInstrument: acc.enrolledInstrument || txnInst,
              enrolledCourse: acc.enrolledCourse || txnCourse
            };
            accountUpdated = true;
          }
        });
        if (accountUpdated) {
          safeSetItem('ab_accounts', JSON.stringify(savedAccounts));
        }

        const sessionUser = JSON.parse(localStorage.getItem('ab_session_user') || 'null');
        if (sessionUser && (sessionUser.id === targetTxn.studentId || sessionUser.fullName === targetTxn.studentName)) {
          const updatedSession = {
            ...sessionUser,
            studentStatus: 'Enrollment Active',
            isRegistrationCompleted: true,
            isPaymentCompleted: true,
            status: 'Active',
            enrolledInstrument: sessionUser.enrolledInstrument || txnInst,
            enrolledCourse: sessionUser.enrolledCourse || txnCourse
          };
          safeSetItem('ab_session_user', JSON.stringify(updatedSession));
        }

        // Notify app context of user and student updates
        window.dispatchEvent(new Event('ab_user_updated'));
        window.dispatchEvent(new Event('ab_students_updated'));
      } catch (e) {
        console.error('Error syncing approval in AccountantPortal:', e);
      }
    }

    addNotification('Transaction Verified', `Payment of ${targetTxn?.amount} ETB verified for ${targetTxn?.studentName}`, 'payment');
    logAudit('Verified Transaction', `${targetTxn?.studentName} (${targetTxn?.id})`);
    setSelectedTxn(null);
  };

  const handleRejectTransaction = (txnId: string) => {
    const defaultReason = 'Receipt reference number does not match bank deposit records.';
    let reason = defaultReason;
    const targetTxn = transactions.find(t => t.id === txnId);
    const resolvedPaymentId = resolvePaymentIdForTransaction(txnId, payments, targetTxn);
    try {
      const input = window.prompt('Enter rejection reason for student:', defaultReason);
      if (input !== null && input.trim()) {
        reason = input.trim();
      }
    } catch (e) {
      reason = defaultReason;
    }

    setTransactions(prev => prev.map(t => t.id === txnId ? { ...t, status: 'Rejected', notes: reason } : t));

    if (targetTxn) {
      rejectPaymentRecord(resolvedPaymentId, currentUser?.fullName || 'Martha Hailu (Accountant)', reason);
      try {
        const savedApps = JSON.parse(localStorage.getItem('ab_applications_v3') || '[]');
        const updatedApps = savedApps.map((app: any) => {
          if (
            app.id === targetTxn.studentId ||
            app.applicationId === targetTxn.studentId ||
            app.studentName === targetTxn.studentName ||
            app.userId === targetTxn.studentId ||
            `TXN-${app.id}` === txnId
          ) {
            return { ...app, paymentStatus: 'Rejected', status: 'Payment Rejected', notes: reason };
          }
          return app;
        });
        safeSetItem('ab_applications_v3', JSON.stringify(updatedApps));

        // Update user accounts ab_accounts & ab_session_user with rejection reason
        const savedAccounts = JSON.parse(localStorage.getItem('ab_accounts') || '{}');
        let accountUpdated = false;
        Object.keys(savedAccounts).forEach(email => {
          const acc = savedAccounts[email];
          if (acc.id === targetTxn.studentId || acc.fullName === targetTxn.studentName) {
            savedAccounts[email] = {
              ...acc,
              studentStatus: 'Payment Rejected',
              paymentRejectionReason: reason,
              isPaymentCompleted: false
            };
            accountUpdated = true;
          }
        });
        if (accountUpdated) {
          safeSetItem('ab_accounts', JSON.stringify(savedAccounts));
        }

        const sessionUser = JSON.parse(localStorage.getItem('ab_session_user') || 'null');
        if (sessionUser && (sessionUser.id === targetTxn.studentId || sessionUser.fullName === targetTxn.studentName)) {
          const updatedSession = {
            ...sessionUser,
            studentStatus: 'Payment Rejected',
            paymentRejectionReason: reason,
            isPaymentCompleted: false
          };
          safeSetItem('ab_session_user', JSON.stringify(updatedSession));
        }

        window.dispatchEvent(new Event('ab_user_updated'));
      } catch (e) {
        console.error('Error updating accounts on rejection:', e);
      }
    }

    addNotification('Transaction Rejected', `Payment rejected for ID ${txnId}. Student notified to re-upload.`, 'payment');
    logAudit('Rejected Transaction', `${txnId} - ${reason}`);
    setSelectedTxn(null);
  };

  // ----------------------------------------------------
  // CASH PAYMENT MANUAL RECORDING (Requirement 8)
  // ----------------------------------------------------
  const [cashForm, setCashForm] = useState({
    studentName: '',
    studentId: '',
    course: 'Begena Basic 1',
    branch: 'Piazza Branch' as 'Piazza Branch' | 'Megenagna Branch' | 'Lebu Branch',
    paymentType: 'Full Course Fee' as 'Registration Fee' | 'Monthly Tuition' | 'Full Course Fee' | 'Instrument Purchase' | 'Other',
    amount: 5000,
    receiptNo: `CASH-REC-${Math.floor(10000 + Math.random() * 90000)}`,
    notes: ''
  });

  const handleRecordCashPayment = () => {
    if (!cashForm.studentName || cashForm.amount <= 0) {
      alert('Please fill out student name and amount.');
      return;
    }

    const newCashTxn: FinancialTransaction = {
      id: `TXN-2026-${Math.floor(8100 + Math.random() * 900)}`,
      studentName: cashForm.studentName,
      studentId: cashForm.studentId || `ABS-PZ-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      course: cashForm.course,
      level: 'Basic 1',
      branch: cashForm.branch,
      paymentType: cashForm.paymentType,
      amount: Number(cashForm.amount),
      paymentMethod: 'Cash',
      date: new Date().toISOString().split('T')[0],
      referenceNumber: cashForm.receiptNo,
      status: 'Verified',
      createdBy: currentUser?.fullName || 'Martha Hailu (Accountant)',
      verifiedBy: currentUser?.fullName || 'Martha Hailu (Accountant)',
      verificationDate: new Date().toLocaleString(),
      notes: cashForm.notes
    };

    setTransactions([newCashTxn, ...transactions]);

    addStudentRegistration({
      fullName: cashForm.studentName,
      email: `${cashForm.studentName.toLowerCase().replace(/\s+/g, '.')}@student.begena.com`,
      phone: '+251900000000',
      gender: 'Not Specified',
      age: 22,
      address: `${cashForm.branch}, Addis Ababa`,
      emergencyContact: 'Office Contact',
      previousExperience: 'None',
      instrumentOwned: cashForm.course.split(' ')[0],
      courseId: cashForm.course.toLowerCase().includes('krar') ? 'krar' : 'begena',
      courseName: cashForm.course,
      instrument: cashForm.course.split(' ')[0],
      level: 'Basic 1',
      branch: cashForm.branch,
      learningMode: 'In-Person',
      totalFeeETB: Number(cashForm.amount),
      paymentMethod: 'Cash',
      registrationSource: 'Registered by Accountant',
      registeredBy: currentUser?.fullName || 'Martha Hailu (Accountant)'
    });

    addNotification('Cash Payment Recorded', `Recorded ${cashForm.amount} ETB cash receipt for ${cashForm.studentName}`, 'payment');
    logAudit('Recorded Cash Payment', `${cashForm.studentName} - ${cashForm.amount} ETB (${cashForm.receiptNo})`);

    // Reset Form
    setCashForm({
      studentName: '',
      studentId: '',
      course: 'Begena Basic 1',
      branch: 'Piazza Branch',
      paymentType: 'Full Course Fee',
      amount: 5000,
      receiptNo: `CASH-REC-${Math.floor(10000 + Math.random() * 90000)}`,
      notes: ''
    });
    setActiveTab('transactions');
  };

  // ----------------------------------------------------
  // REGISTRATION FEE CONFIGURATION CHANGE (Requirement 10)
  // ----------------------------------------------------
  const handleSaveRegistrationFee = () => {
    setRegistrationFeeConfig({
      amountETB: newRegFeeInput,
      effectiveDate: new Date().toISOString().split('T')[0]
    });
    addNotification('Registration Fee Updated', `New registration fee set to ${newRegFeeInput} ETB (Effective ${new Date().toLocaleDateString()})`, 'system');
    logAudit('Updated System Registration Fee', `${newRegFeeInput} ETB`);
  };

  // ----------------------------------------------------
  // OVERDUE REMINDER DISPATCHER (Requirement 13)
  // ----------------------------------------------------
  const handleSendReminder = (studentName: string, channel: 'SMS' | 'Telegram' | 'In-App') => {
    addNotification('Payment Reminder Dispatched', `Sent ${channel} reminder to ${studentName} for overdue course tuition.`, 'system');
    logAudit('Dispatched Payment Reminder', `${studentName} via ${channel}`);
  };

  // ----------------------------------------------------
  // EXPENSE ENTRY WORKFLOW (Requirement 20)
  // ----------------------------------------------------
  const [expenseForm, setExpenseForm] = useState({
    category: 'Rent' as any,
    description: '',
    amount: 0,
    branch: 'Piazza Branch' as any,
    paymentMethod: 'CBE' as any,
    vendor: ''
  });

  const handleRecordExpense = () => {
    if (!expenseForm.description || expenseForm.amount <= 0) {
      alert('Please fill out expense description and valid amount.');
      return;
    }

    const newExpense: SchoolExpense = {
      id: `EXP-${Math.floor(200 + Math.random() * 800)}`,
      category: expenseForm.category,
      description: expenseForm.description,
      amount: Number(expenseForm.amount),
      date: new Date().toISOString().split('T')[0],
      branch: expenseForm.branch,
      paymentMethod: expenseForm.paymentMethod,
      vendor: expenseForm.vendor,
      createdBy: currentUser?.fullName || 'Martha Hailu',
      status: 'Approved'
    };

    setExpenses([newExpense, ...expenses]);
    addNotification('Expense Recorded', `Recorded expense of ${expenseForm.amount} ETB under ${expenseForm.category}`, 'system');
    logAudit('Recorded School Expense', `${expenseForm.category} - ${expenseForm.amount} ETB`);

    setExpenseForm({
      category: 'Rent',
      description: '',
      amount: 0,
      branch: 'Piazza Branch',
      paymentMethod: 'CBE',
      vendor: ''
    });
  };

  // ----------------------------------------------------
  // DAILY CASH CLOSING WORKFLOW (Requirement 31)
  // ----------------------------------------------------
  const [closingForm, setClosingForm] = useState({
    branch: 'Piazza Branch',
    openingCash: 19300,
    cashReceived: 5000,
    cashExpenses: 0,
    cashRefunds: 0,
    closingCash: 24300,
    explanation: ''
  });

  const expectedClosing = closingForm.openingCash + closingForm.cashReceived - closingForm.cashExpenses - closingForm.cashRefunds;
  const variance = closingForm.closingCash - expectedClosing;

  const handleDailyClosingSubmit = () => {
    const record: DailyClosingRecord = {
      date: new Date().toISOString().split('T')[0],
      branch: closingForm.branch,
      openingCash: closingForm.openingCash,
      cashReceived: closingForm.cashReceived,
      cashExpenses: closingForm.cashExpenses,
      cashRefunds: closingForm.cashRefunds,
      closingCash: closingForm.closingCash,
      expectedCash: expectedClosing,
      variance,
      explanation: variance !== 0 ? closingForm.explanation : undefined,
      submittedBy: currentUser?.fullName || 'Martha Hailu',
      status: variance === 0 ? 'Reconciled' : 'Discrepancy Flagged'
    };

    setDailyClosings([record, ...dailyClosings]);
    addNotification('Daily Cash Closing Saved', `Reconciliation for ${closingForm.branch} submitted. Status: ${record.status}`, 'system');
    logAudit('Submitted Daily Financial Closing', `${closingForm.branch} (Variance: ${variance} ETB)`);
  };

  // Export helper
  const handleExportFinancials = (format: string, reportName: string) => {
    alert(`Exporting ${reportName} in ${format.toUpperCase()} format...\nDocument generated with Abel Begena School Seal.`);
  };

  // ----------------------------------------------------
  // SEARCH & FILTERED TRANSACTIONS
  // ----------------------------------------------------
  const filteredTransactions = transactions.filter(t => {
    const matchesSearch =
      (t.id || '').toLowerCase().includes(globalSearch.toLowerCase()) ||
      (t.studentName || '').toLowerCase().includes(globalSearch.toLowerCase()) ||
      (t.studentId || '').toLowerCase().includes(globalSearch.toLowerCase()) ||
      (t.referenceNumber || '').toLowerCase().includes(globalSearch.toLowerCase());

    const matchesBranch = filterBranch === 'All' || t.branch === filterBranch;
    const matchesStatus = filterStatus === 'All' || t.status === filterStatus;
    const matchesMethod = filterMethod === 'All' || t.paymentMethod === filterMethod;
    const matchesType = filterType === 'All' || t.paymentType === filterType;

    return matchesSearch && matchesBranch && matchesStatus && matchesMethod && matchesType;
  });

  return (
    <div className="w-full bg-[#FCFBF8] min-h-screen text-[#2B2B2B] font-sans antialiased text-left">
      {/* HEADER BAR */}
      <header className="border-b border-[#E7DED1] bg-white relative z-20 px-6 py-4 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#FAF6EF] rounded-xl border border-[#E7DED1]">
            <DollarSign className="text-[#E89B52]" size={20} />
          </div>
          <div>
            <h1 className="font-display font-black text-lg tracking-tight uppercase text-gray-800">Financial Management Office</h1>
            <p className="text-[10px] tracking-wider text-[#E89B52] font-bold uppercase">Abel Begena School • Chief Accountant Portal</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle variant="pill" />
          <div className="hidden md:flex flex-col text-right">
            <span className="font-bold text-xs">{currentUser?.fullName || 'Martha Hailu'}</span>
            <span className="text-[9px] text-[#E89B52] font-mono tracking-wider font-bold">CHIEF ACCOUNTANT</span>
          </div>
          <div className="w-9 h-9 rounded-full border border-[#E7DED1] overflow-hidden bg-[#3B2818] flex items-center justify-center text-[#E89B52] font-bold text-xs">
            {currentUser?.avatar ? (
              <img src={currentUser.avatar} className="w-full h-full object-cover" alt="Avatar" referrerPolicy="no-referrer" />
            ) : (
              currentUser?.fullName?.charAt(0) || 'A'
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
            <p className="text-[10px] tracking-widest text-[#E89B52] font-bold px-3 py-1 uppercase">Accounting Modules</p>

            <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'dashboard' ? 'bg-[#E89B52] text-white' : 'text-gray-600 hover:bg-[#FAF6EF]'}`}>
              <div className="flex items-center gap-2.5"><BarChart2 size={16} /><span>Financial Health</span></div>
              <ChevronRight size={14} className="opacity-60" />
            </button>

            <button onClick={() => setActiveTab('transactions')} className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'transactions' ? 'bg-[#E89B52] text-white' : 'text-gray-600 hover:bg-[#FAF6EF]'}`}>
              <div className="flex items-center gap-2.5"><CreditCard size={16} /><span>Payment Audit Desk</span></div>
              <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-mono font-bold">{pendingTxnsCount}</span>
            </button>

            <button onClick={() => setActiveTab('cash-entry')} className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'cash-entry' ? 'bg-[#E89B52] text-white' : 'text-gray-600 hover:bg-[#FAF6EF]'}`}>
              <div className="flex items-center gap-2.5"><Wallet size={16} /><span>Record Cash Payment</span></div>
              <Plus size={14} className="opacity-60" />
            </button>

            <button onClick={() => setActiveTab('pricing')} className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'pricing' ? 'bg-[#E89B52] text-white' : 'text-gray-600 hover:bg-[#FAF6EF]'}`}>
              <div className="flex items-center gap-2.5"><Layers size={16} /><span>Course Fees & Reg Fee</span></div>
              <ChevronRight size={14} className="opacity-60" />
            </button>

            <button onClick={() => setActiveTab('payment-plans')} className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'payment-plans' ? 'bg-[#E89B52] text-white' : 'text-gray-600 hover:bg-[#FAF6EF]'}`}>
              <div className="flex items-center gap-2.5"><Users size={16} /><span>Student Payment Plans</span></div>
              <ChevronRight size={14} className="opacity-60" />
            </button>

            <button onClick={() => setActiveTab('overdue')} className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'overdue' ? 'bg-[#E89B52] text-white' : 'text-gray-600 hover:bg-[#FAF6EF]'}`}>
              <div className="flex items-center gap-2.5"><AlertTriangle size={16} /><span>Overdue Tracker</span></div>
              <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-mono font-bold">{overdueCount}</span>
            </button>

            <button onClick={() => setActiveTab('receipts')} className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'receipts' ? 'bg-[#E89B52] text-white' : 'text-gray-600 hover:bg-[#FAF6EF]'}`}>
              <div className="flex items-center gap-2.5"><Receipt size={16} /><span>Digital Receipts & QR</span></div>
              <ChevronRight size={14} className="opacity-60" />
            </button>

            <button onClick={() => setActiveTab('refunds')} className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'refunds' ? 'bg-[#E89B52] text-white' : 'text-gray-600 hover:bg-[#FAF6EF]'}`}>
              <div className="flex items-center gap-2.5"><CornerUpLeft size={16} /><span>Refund Management</span></div>
              <span className="text-[10px] bg-[#FAF6EF] text-gray-600 px-1.5 py-0.5 rounded font-mono font-bold">{refunds.length}</span>
            </button>

            <button onClick={() => setActiveTab('expenses')} className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'expenses' ? 'bg-[#E89B52] text-white' : 'text-gray-600 hover:bg-[#FAF6EF]'}`}>
              <div className="flex items-center gap-2.5"><TrendingDown size={16} /><span>School Expenses</span></div>
              <ChevronRight size={14} className="opacity-60" />
            </button>

            <button onClick={() => setActiveTab('branches')} className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'branches' ? 'bg-[#E89B52] text-white' : 'text-gray-600 hover:bg-[#FAF6EF]'}`}>
              <div className="flex items-center gap-2.5"><Building size={16} /><span>Branch Revenue Comparison</span></div>
              <ChevronRight size={14} className="opacity-60" />
            </button>

            <button onClick={() => setActiveTab('reports')} className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'reports' ? 'bg-[#E89B52] text-white' : 'text-gray-600 hover:bg-[#FAF6EF]'}`}>
              <div className="flex items-center gap-2.5"><FileSpreadsheet size={16} /><span>Financial Reports</span></div>
              <ChevronRight size={14} className="opacity-60" />
            </button>

            <button onClick={() => setActiveTab('closing')} className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'closing' ? 'bg-[#E89B52] text-white' : 'text-gray-600 hover:bg-[#FAF6EF]'}`}>
              <div className="flex items-center gap-2.5"><CheckSquare size={16} /><span>Daily Cash Reconciliation</span></div>
              <ChevronRight size={14} className="opacity-60" />
            </button>

            <button onClick={() => setActiveTab('audit')} className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'audit' ? 'bg-[#E89B52] text-white' : 'text-gray-600 hover:bg-[#FAF6EF]'}`}>
              <div className="flex items-center gap-2.5"><ShieldCheck size={16} /><span>Audit Trail Log</span></div>
              <ChevronRight size={14} className="opacity-60" />
            </button>
          </div>

          {/* ACTIVE REGISTRATION FEE CARD */}
          <div className="bg-white border border-[#E7DED1] rounded-2xl p-4 shadow-2xs space-y-2 text-xs">
            <span className="text-[10px] font-bold text-[#E89B52] uppercase font-mono">Current Registration Fee</span>
            <div className="p-2 bg-[#FAF6EF] rounded-xl border border-[#E7DED1] flex justify-between items-center">
              <span className="font-bold text-gray-700">Fee Amount:</span>
              <span className="font-mono font-black text-[#E89B52] text-sm">{registrationFeeConfig.amountETB} ETB</span>
            </div>
            <span className="text-[9px] text-gray-400 block">Effective since {registrationFeeConfig.effectiveDate}</span>
          </div>
        </aside>

        {/* MAIN DISPLAY AREA */}
        <main className="lg:col-span-9 space-y-6">

          {/* TAB 1: FINANCIAL HEALTH DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 animate-fadeIn text-xs">
              {/* HERO HEADER */}
              <div className="bg-white border border-[#E7DED1] p-6 rounded-2xl shadow-2xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <span className="text-[10px] font-mono tracking-widest text-[#E89B52] uppercase font-bold">FINANCIAL SUMMARY • {dateRange.toUpperCase()}</span>
                  <h2 className="font-display font-black text-2xl uppercase tracking-tight">Executive Accounting Dashboard</h2>
                  <p className="text-xs text-gray-500 mt-0.5">Real-time ledger overview, branch income tracking, and expense auditing.</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <select value={dateRange} onChange={(e) => setDateRange(e.target.value as any)} className="p-2 border border-[#E7DED1] rounded-xl bg-[#FAF6EF] text-xs font-bold outline-none cursor-pointer">
                    <option>Today</option>
                    <option>This Week</option>
                    <option>This Month</option>
                    <option>Year to Date</option>
                  </select>
                  <Button variant="primary" size="sm" onClick={() => setActiveTab('cash-entry')} className="gap-1.5">
                    <Plus size={14} /> Record Cash
                  </Button>
                </div>
              </div>

              {/* STAT CARDS ROW 1 (Requirement 1) */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white border border-[#E7DED1] p-4 rounded-2xl shadow-2xs">
                  <span className="block text-[10px] font-mono tracking-widest text-gray-400 uppercase font-bold">Total Gross Revenue</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-black font-mono text-[#E89B52]">{totalRevenue.toLocaleString()} ETB</span>
                  </div>
                  <span className="text-[9px] text-green-600 font-bold mt-1 block">Verified Inflows</span>
                </div>

                <div className="bg-white border border-[#E7DED1] p-4 rounded-2xl shadow-2xs">
                  <span className="block text-[10px] font-mono tracking-widest text-gray-400 uppercase font-bold">Total Approved Expenses</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-black font-mono text-red-600">{totalExpenses.toLocaleString()} ETB</span>
                  </div>
                  <span className="text-[9px] text-red-600 font-bold mt-1 block">Facility & Payroll</span>
                </div>

                <div className="bg-white border border-[#E7DED1] p-4 rounded-2xl shadow-2xs">
                  <span className="block text-[10px] font-mono tracking-widest text-gray-400 uppercase font-bold">Net School Revenue</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-black font-mono text-green-700">{netRevenue.toLocaleString()} ETB</span>
                  </div>
                  <span className="text-[9px] text-gray-400 font-bold mt-1 block">Gross - Expenses</span>
                </div>

                <div className="bg-white border border-[#E7DED1] p-4 rounded-2xl shadow-2xs">
                  <span className="block text-[10px] font-mono tracking-widest text-gray-400 uppercase font-bold">Pending Audits</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-black font-mono text-amber-600">{pendingTxnsCount}</span>
                    <span className="text-[10px] text-amber-600 font-bold">Action Needed</span>
                  </div>
                </div>
              </div>

              {/* REVENUE BREAKDOWN BY CATEGORY (Registration Fee vs Tuition) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white border border-[#E7DED1] p-5 rounded-2xl shadow-2xs space-y-3">
                  <span className="block text-[10px] font-mono font-bold text-gray-400 uppercase">Revenue Breakdown</span>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2.5 bg-[#FAF6EF] rounded-xl border border-[#E7DED1]">
                      <span className="font-bold text-gray-700">Course Tuition Fees:</span>
                      <span className="font-mono font-black text-[#E89B52]">{courseFeeRevenue.toLocaleString()} ETB</span>
                    </div>
                    <div className="flex justify-between items-center p-2.5 bg-[#FAF6EF] rounded-xl border border-[#E7DED1]">
                      <span className="font-bold text-gray-700">Registration Fees ({registrationFeeConfig.amountETB} ETB):</span>
                      <span className="font-mono font-black text-[#E89B52]">{regFeeRevenue.toLocaleString()} ETB</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-[#E7DED1] p-5 rounded-2xl shadow-2xs space-y-3">
                  <span className="block text-[10px] font-mono font-bold text-gray-400 uppercase">Branch Revenue Distribution</span>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 bg-[#FAF6EF] rounded-xl">
                      <span className="font-bold text-gray-700">Piazza Branch:</span>
                      <span className="font-mono font-bold">{piazzaRevenue.toLocaleString()} ETB</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-[#FAF6EF] rounded-xl">
                      <span className="font-bold text-gray-700">Megenagna Branch:</span>
                      <span className="font-mono font-bold">{megenagnaRevenue.toLocaleString()} ETB</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-[#FAF6EF] rounded-xl">
                      <span className="font-bold text-gray-700">Lebu Branch:</span>
                      <span className="font-mono font-bold">{lebuRevenue.toLocaleString()} ETB</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* RECENT TRANSACTIONS TABLE */}
              <div className="bg-white border border-[#E7DED1] p-6 rounded-2xl shadow-2xs space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-display font-black text-sm uppercase tracking-wider flex items-center gap-2">
                    <CreditCard size={18} className="text-[#E89B52]" />
                    Recent Financial Ledger Transactions
                  </h3>
                  <button onClick={() => setActiveTab('transactions')} className="text-xs text-[#E89B52] font-bold hover:underline">View All Transactions →</button>
                </div>

                <div className="border border-gray-100 rounded-xl overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-[#FAF6EF] text-[10px] font-bold text-gray-400 uppercase">
                      <tr>
                        <th className="p-3">TXN ID</th>
                        <th className="p-3">Student Name</th>
                        <th className="p-3">Branch</th>
                        <th className="p-3">Method</th>
                        <th className="p-3">Amount</th>
                        <th className="p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.slice(0, 4).map(t => (
                        <tr key={t.id} className="border-b border-gray-100 hover:bg-[#FAF6EF]/20">
                          <td className="p-3 font-mono font-bold text-[#E89B52]">{t.id}</td>
                          <td className="p-3 font-bold">{t.studentName}</td>
                          <td className="p-3">{t.branch}</td>
                          <td className="p-3"><span className="px-2 py-0.5 rounded font-mono text-[10px] bg-gray-100 font-bold">{t.paymentMethod}</span></td>
                          <td className="p-3 font-mono font-black">{t.amount} ETB</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold ${
                              t.status === 'Verified' ? 'bg-green-50 text-green-700 border border-green-200' :
                              t.status === 'Pending' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-red-50 text-red-700'
                            }`}>
                              {(t.status || 'Pending').toUpperCase()}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PAYMENT TRANSACTIONS AUDIT DESK (Requirements 4, 5, 7) */}
          {activeTab === 'transactions' && (
            <div className="bg-white border border-[#E7DED1] p-6 rounded-2xl shadow-2xs space-y-6 animate-fadeIn text-xs">
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                  <span className="text-[10px] font-mono tracking-widest text-[#E89B52] uppercase font-bold">PAYMENT AUDIT DESK</span>
                  <h2 className="font-display font-black text-xl uppercase">All Student Transactions</h2>
                </div>
                <Button variant="primary" size="sm" onClick={() => setActiveTab('cash-entry')} className="gap-1.5 shrink-0">
                  <Plus size={14} /> Record Manual Cash Payment
                </Button>
              </div>

              {/* GLOBAL SEARCH & MULTI-FILTER BAR */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3 p-3 bg-[#FAF6EF] rounded-xl border border-[#E7DED1]">
                <div className="md:col-span-2 relative">
                  <Search size={14} className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    value={globalSearch}
                    onChange={(e) => setGlobalSearch(e.target.value)}
                    placeholder="Search TXN ID, student name, reference..."
                    className="w-full pl-8 pr-3 py-2 bg-white border border-[#E7DED1] rounded-lg text-xs outline-none"
                  />
                </div>

                <select value={filterBranch} onChange={(e) => setFilterBranch(e.target.value)} className="p-2 border border-[#E7DED1] rounded-lg bg-white font-bold">
                  <option value="All">All Branches</option>
                  <option value="Piazza Branch">Piazza Branch</option>
                  <option value="Megenagna Branch">Megenagna Branch</option>
                  <option value="Lebu Branch">Lebu Branch</option>
                </select>

                <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="p-2 border border-[#E7DED1] rounded-lg bg-white font-bold">
                  <option value="All">All Statuses</option>
                  <option value="Pending">Pending Audit</option>
                  <option value="Verified">Verified</option>
                  <option value="Rejected">Rejected</option>
                </select>

                <select value={filterMethod} onChange={(e) => setFilterMethod(e.target.value)} className="p-2 border border-[#E7DED1] rounded-lg bg-white font-bold">
                  <option value="All">All Methods</option>
                  <option value="CBE">CBE</option>
                  <option value="Telebirr">Telebirr</option>
                  <option value="Cash">Cash</option>
                </select>
              </div>

              {/* TRANSACTIONS TABLE */}
              <div className="border border-gray-100 rounded-xl overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-[#FAF6EF] text-[10px] font-bold text-gray-400 uppercase">
                    <tr>
                      <th className="p-3">TXN ID</th>
                      <th className="p-3">Student Name</th>
                      <th className="p-3">Course / Branch</th>
                      <th className="p-3">Method & Ref</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.map(t => (
                      <tr key={t.id} className="border-b border-gray-100 hover:bg-[#FAF6EF]/20">
                        <td className="p-3 font-mono font-bold text-[#E89B52]">{t.id}</td>
                        <td className="p-3 font-bold">
                          {t.studentName}
                          <span className="block font-mono text-[9px] text-gray-400">{t.studentId}</span>
                        </td>
                        <td className="p-3">
                          {t.course}
                          <span className="block text-[10px] text-gray-400">{t.branch}</span>
                        </td>
                        <td className="p-3 font-mono">
                          <span className="px-2 py-0.5 rounded text-[10px] bg-gray-100 font-bold">{t.paymentMethod}</span>
                          <span className="block text-[9px] text-gray-500">{t.referenceNumber}</span>
                        </td>
                        <td className="p-3 font-mono font-black text-gray-800">{t.amount} ETB</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold ${
                            t.status === 'Verified' ? 'bg-green-50 text-green-700 border border-green-200' :
                            t.status === 'Pending' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-red-50 text-red-700'
                          }`}>
                            {(t.status || 'Pending').toUpperCase()}
                          </span>
                        </td>
                        <td className="p-3 text-right flex gap-1.5 justify-end">
                          <Button variant="secondary" size="sm" onClick={() => setSelectedTxn(t)}>
                            Detail / Receipt
                          </Button>
                          {t.status === 'Pending' && (
                            <Button variant="primary" size="sm" onClick={() => handleVerifyTransaction(t.id)}>
                              Verify
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: CASH PAYMENT ENTRY (Requirement 8) */}
          {activeTab === 'cash-entry' && (
            <div className="bg-white border border-[#E7DED1] p-6 rounded-2xl shadow-2xs space-y-6 animate-fadeIn text-xs">
              <div className="border-b border-gray-100 pb-3">
                <span className="text-[10px] font-mono tracking-widest text-[#E89B52] uppercase font-bold">FRONT DESK FINANCIAL DESK</span>
                <h2 className="font-display font-black text-xl uppercase">Record Manual Cash Receipt</h2>
                <p className="text-gray-500">Record over-the-counter cash payments directly into the central school ledger.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Student Full Name *</label>
                  <Input value={cashForm.studentName} onChange={(e) => setCashForm({ ...cashForm, studentName: e.target.value })} placeholder="e.g. saye" />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Student ID (Optional)</label>
                  <Input value={cashForm.studentId} onChange={(e) => setCashForm({ ...cashForm, studentId: e.target.value })} placeholder="e.g. ABS-PZ-2026-0042" />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Course Instrument</label>
                  <select value={cashForm.course} onChange={(e) => setCashForm({ ...cashForm, course: e.target.value })} className="w-full p-2.5 border border-[#E7DED1] rounded-xl bg-white font-bold">
                    <option>Begena Basic 1</option>
                    <option>Begena Basic 2</option>
                    <option>Krar Basic</option>
                    <option>Masenqo Basic</option>
                    <option>Washint Basic</option>
                    <option>Vocal (Zema)</option>
                    <option>Kebero Basic</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Branch Location</label>
                  <select value={cashForm.branch} onChange={(e) => setCashForm({ ...cashForm, branch: e.target.value as any })} className="w-full p-2.5 border border-[#E7DED1] rounded-xl bg-white font-bold">
                    <option value="Piazza Branch">Piazza Branch — Addis Ababa</option>
                    <option value="Megenagna Branch">Megenagna Branch — Addis Ababa</option>
                    <option value="Lebu Branch">Lebu Branch — Addis Ababa</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Payment Category</label>
                  <select value={cashForm.paymentType} onChange={(e) => setCashForm({ ...cashForm, paymentType: e.target.value as any })} className="w-full p-2.5 border border-[#E7DED1] rounded-xl bg-white font-bold">
                    <option value="Full Course Fee">Full Course Fee</option>
                    <option value="Registration Fee">Registration Fee</option>
                    <option value="Monthly Tuition">Monthly Tuition</option>
                    <option value="Instrument Purchase">Instrument Purchase</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Cash Amount (ETB) *</label>
                  <Input type="number" value={cashForm.amount} onChange={(e) => setCashForm({ ...cashForm, amount: Number(e.target.value) })} />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Generated Cash Voucher #</label>
                  <Input value={cashForm.receiptNo} readOnly className="bg-[#FAF6EF] font-mono font-bold text-[#E89B52]" />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Internal Notes</label>
                  <Input value={cashForm.notes} onChange={(e) => setCashForm({ ...cashForm, notes: e.target.value })} placeholder="e.g. Over the counter payment at Piazza desk" />
                </div>
              </div>

              <Button variant="primary" onClick={handleRecordCashPayment} className="w-full py-3">
                Save Cash Transaction & Issue Digital Receipt
              </Button>
            </div>
          )}

          {/* TAB 4: COURSE PRICING & REGISTRATION FEE CONFIGURATION (Requirements 9 & 10) */}
          {activeTab === 'pricing' && (
            <div className="bg-white border border-[#E7DED1] p-6 rounded-2xl shadow-2xs space-y-6 animate-fadeIn text-xs">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-[#E89B52] uppercase font-bold">TUITION MATRIX CONFIGURATION</span>
                <h2 className="font-display font-black text-xl uppercase">Course Pricing & System Fees</h2>
              </div>

              {/* REGISTRATION FEE CONFIGURATOR */}
              <div className="p-4 bg-[#FAF6EF] border border-[#E7DED1] rounded-2xl space-y-3">
                <span className="font-bold text-sm block">System Registration Fee Setting</span>
                <p className="text-gray-500">Configure standard one-time student registration fee applied across all intake applications.</p>
                
                <div className="flex items-center gap-3 max-w-sm">
                  <Input type="number" value={newRegFeeInput} onChange={(e) => setNewRegFeeInput(Number(e.target.value))} className="font-mono font-bold" />
                  <Button variant="primary" onClick={handleSaveRegistrationFee}>Update Fee</Button>
                </div>
              </div>

              {/* COURSE PRICING MATRIX */}
              <div className="space-y-3">
                <span className="font-bold text-sm block">Course Tier Pricing Matrix</span>
                <div className="border border-gray-100 rounded-xl overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-[#FAF6EF] text-[10px] font-bold text-gray-400 uppercase">
                      <tr>
                        <th className="p-3">Course Name</th>
                        <th className="p-3">Levels Covered</th>
                        <th className="p-3">3-Month Term</th>
                        <th className="p-3">6-Month Term</th>
                        <th className="p-3">9-Month Term</th>
                        <th className="p-3">Effective Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {coursePricing.map((pr, idx) => (
                        <tr key={idx} className="border-b border-gray-100 hover:bg-[#FAF6EF]/20">
                          <td className="p-3 font-bold text-gray-800">{pr.courseName}</td>
                          <td className="p-3 text-gray-500">{pr.level}</td>
                          <td className="p-3 font-mono font-bold text-gray-800">{pr.threeMonthFeeETB} ETB</td>
                          <td className="p-3 font-mono font-bold text-[#E89B52]">{pr.sixMonthFeeETB} ETB</td>
                          <td className="p-3 font-mono font-bold text-green-700">{pr.nineMonthFeeETB} ETB</td>
                          <td className="p-3 font-mono text-[10px] text-gray-400">{pr.effectiveDate}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: STUDENT PAYMENT PLANS (Requirement 11) */}
          {activeTab === 'payment-plans' && (
            <div className="bg-white border border-[#E7DED1] p-6 rounded-2xl shadow-2xs space-y-4 animate-fadeIn text-xs">
              <h3 className="font-display font-black text-sm uppercase tracking-wider">Student Course Payment Plans & Installments</h3>

              <div className="border border-gray-100 rounded-xl overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-[#FAF6EF] text-[10px] font-bold text-gray-400 uppercase">
                    <tr>
                      <th className="p-3">Student Name</th>
                      <th className="p-3">Course / Branch</th>
                      <th className="p-3">Total Fee</th>
                      <th className="p-3">Total Paid</th>
                      <th className="p-3">Balance Due</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentPlans.map(sp => (
                      <tr key={sp.studentId} className="border-b border-gray-100 hover:bg-[#FAF6EF]/20">
                        <td className="p-3 font-bold">
                          {sp.studentName}
                          <span className="block font-mono text-[9px] text-gray-400">{sp.studentId}</span>
                        </td>
                        <td className="p-3">{sp.course} ({sp.branch})</td>
                        <td className="p-3 font-mono">{sp.totalCourseFee} ETB</td>
                        <td className="p-3 font-mono text-green-600 font-bold">{sp.totalPaid} ETB</td>
                        <td className="p-3 font-mono text-red-600 font-bold">{sp.remainingBalance} ETB</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold ${
                            sp.status === 'Paid' ? 'bg-green-50 text-green-700 border border-green-200' :
                            sp.status === 'Overdue' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-amber-50 text-amber-700'
                          }`}>
                            {(sp.status || 'Due').toUpperCase()}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 6: OVERDUE TRACKER & REMINDERS (Requirement 14) */}
          {activeTab === 'overdue' && (
            <div className="bg-white border border-[#E7DED1] p-6 rounded-2xl shadow-2xs space-y-4 animate-fadeIn text-xs">
              <h3 className="font-display font-black text-sm uppercase tracking-wider flex items-center gap-2">
                <AlertTriangle size={18} className="text-red-600" />
                Overdue Tuition & Due Date Alerts
              </h3>

              <div className="space-y-3">
                {studentPlans.filter(p => p.status === 'Overdue' || p.remainingBalance > 0).map(p => (
                  <div key={p.studentId} className="p-4 border border-red-100 rounded-xl bg-red-50/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                    <div>
                      <span className="font-bold text-gray-800 text-sm block">{p.studentName} ({p.studentId})</span>
                      <span className="text-gray-500">{p.course} • {p.branch} • Outstanding: <strong className="text-red-600 font-mono">{p.remainingBalance} ETB</strong></span>
                      <span className="block text-[10px] text-red-600 font-bold mt-1">Due Date: {p.nextDueDate} ({p.overdueDays} Days Overdue)</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button variant="secondary" size="sm" onClick={() => handleSendReminder(p.studentName, 'SMS')}>Send SMS</Button>
                      <Button variant="secondary" size="sm" onClick={() => handleSendReminder(p.studentName, 'Telegram')}>Send Telegram</Button>
                      <Button variant="primary" size="sm" onClick={() => handleSendReminder(p.studentName, 'In-App')}>In-App Alert</Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: DIGITAL RECEIPTS & RECEIPT QR VERIFICATION (Requirement 17 & 18) */}
          {activeTab === 'receipts' && (
            <div className="bg-white border border-[#E7DED1] p-6 rounded-2xl shadow-2xs space-y-6 animate-fadeIn text-xs">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-[10px] font-mono tracking-widest text-[#E89B52] uppercase font-bold">DIGITAL RECEIPT GENERATOR</span>
                  <h2 className="font-display font-black text-xl uppercase">Official Receipts & QR Verification</h2>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {verifiedTxns.map(t => (
                  <div key={t.id} className="p-4 border border-[#E7DED1] rounded-2xl bg-[#FAF6EF]/20 space-y-3">
                    <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                      <span className="font-display font-black text-sm uppercase text-gray-800">Abel Begena School Receipt</span>
                      <span className="font-mono text-[10px] font-bold text-[#E89B52]">{t.id}</span>
                    </div>

                    <div className="space-y-1 font-mono text-[10px] text-gray-600">
                      <div><strong>Student Name:</strong> {t.studentName} ({t.studentId})</div>
                      <div><strong>Course:</strong> {t.course}</div>
                      <div><strong>Branch:</strong> {t.branch}</div>
                      <div><strong>Paid Amount:</strong> {t.amount} ETB</div>
                      <div><strong>Payment Method:</strong> {t.paymentMethod} ({t.referenceNumber})</div>
                      <div><strong>Verified By:</strong> {t.verifiedBy || 'Accountant'}</div>
                    </div>

                    {/* QR Code Simulation */}
                    <div className="p-2.5 bg-white border border-gray-200 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <QrCode size={24} className="text-[#E89B52]" />
                        <div>
                          <span className="text-[9px] font-bold block">QR Receipt Verification Code</span>
                          <span className="font-mono text-[8px] text-gray-400">/verify/receipt/{t.id}</span>
                        </div>
                      </div>
                      <Button variant="secondary" size="sm" onClick={() => setActiveReceiptModal(t)}>Print / Download</Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 8: REFUND MANAGEMENT (Requirement 19) */}
          {activeTab === 'refunds' && (
            <div className="bg-white border border-[#E7DED1] p-6 rounded-2xl shadow-2xs space-y-4 animate-fadeIn text-xs">
              <h3 className="font-display font-black text-sm uppercase tracking-wider">Refund Requests & Financial Discrepancy Audits</h3>

              <div className="border border-gray-100 rounded-xl overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-[#FAF6EF] text-[10px] font-bold text-gray-400 uppercase">
                    <tr>
                      <th className="p-3">Refund ID</th>
                      <th className="p-3">Student Name</th>
                      <th className="p-3">Reason</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {refunds.map(r => (
                      <tr key={r.id} className="border-b border-gray-100">
                        <td className="p-3 font-mono font-bold text-[#E89B52]">{r.id}</td>
                        <td className="p-3 font-bold">{r.studentName}</td>
                        <td className="p-3 text-gray-500">{r.reason}</td>
                        <td className="p-3 font-mono font-bold text-red-600">{r.amount} ETB</td>
                        <td className="p-3"><span className="px-2 py-0.5 bg-green-50 text-green-700 font-bold rounded">{r.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 9: SCHOOL EXPENSES MANAGEMENT (Requirement 20 & 21) */}
          {activeTab === 'expenses' && (
            <div className="bg-white border border-[#E7DED1] p-6 rounded-2xl shadow-2xs space-y-6 animate-fadeIn text-xs">
              <h3 className="font-display font-black text-sm uppercase tracking-wider">School Operating Expenses & Vendor Discrepancy Desk</h3>

              {/* RECORD EXPENSE FORM */}
              <div className="p-4 bg-[#FAF6EF] border border-[#E7DED1] rounded-2xl space-y-3">
                <span className="font-bold text-sm block">Record New Operating Expense</span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <select value={expenseForm.category} onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value as any })} className="p-2 border rounded bg-white font-bold">
                    <option>Rent</option>
                    <option>Utilities</option>
                    <option>Internet</option>
                    <option>Teacher Payments</option>
                    <option>Staff Payments</option>
                    <option>Instrument Purchase</option>
                    <option>Instrument Maintenance</option>
                    <option>Marketing</option>
                    <option>Events</option>
                    <option>Office Supplies</option>
                  </select>

                  <Input value={expenseForm.description} onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })} placeholder="Expense description..." />
                  <Input type="number" value={expenseForm.amount} onChange={(e) => setExpenseForm({ ...expenseForm, amount: Number(e.target.value) })} placeholder="Amount (ETB)" />
                </div>
                <Button variant="primary" onClick={handleRecordExpense}>Record Expense</Button>
              </div>

              {/* EXPENSE HISTORY TABLE */}
              <div className="border border-gray-100 rounded-xl overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-[#FAF6EF] text-[10px] font-bold text-gray-400 uppercase">
                    <tr>
                      <th className="p-3">EXP ID</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Description</th>
                      <th className="p-3">Branch</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {expenses.map(e => (
                      <tr key={e.id} className="border-b border-gray-100">
                        <td className="p-3 font-mono font-bold text-[#E89B52]">{e.id}</td>
                        <td className="p-3 font-bold">{e.category}</td>
                        <td className="p-3 text-gray-500">{e.description}</td>
                        <td className="p-3">{e.branch}</td>
                        <td className="p-3 font-mono font-bold text-red-600">{e.amount} ETB</td>
                        <td className="p-3"><span className="px-2 py-0.5 rounded bg-green-50 text-green-700 font-bold">{e.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 10: BRANCH FINANCIAL OVERVIEW (Requirement 23 & 24) */}
          {activeTab === 'branches' && (
            <div className="bg-white border border-[#E7DED1] p-6 rounded-2xl shadow-2xs space-y-6 animate-fadeIn text-xs">
              <h3 className="font-display font-black text-sm uppercase tracking-wider">Branch Financial Performance Comparison</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border border-[#E7DED1] rounded-2xl bg-[#FAF6EF]/20 space-y-2">
                  <span className="font-bold text-sm block">1. Piazza Branch</span>
                  <p><strong>Gross Inflow:</strong> {piazzaRevenue.toLocaleString()} ETB</p>
                  <p><strong>Approved Expenses:</strong> 25,000 ETB</p>
                  <p className="font-bold text-green-700"><strong>Net Margin:</strong> {(piazzaRevenue - 25000).toLocaleString()} ETB</p>
                </div>

                <div className="p-4 border border-[#E7DED1] rounded-2xl bg-[#FAF6EF]/20 space-y-2">
                  <span className="font-bold text-sm block">2. Megenagna Branch</span>
                  <p><strong>Gross Inflow:</strong> {megenagnaRevenue.toLocaleString()} ETB</p>
                  <p><strong>Approved Expenses:</strong> 18,000 ETB</p>
                  <p className="font-bold text-green-700"><strong>Net Margin:</strong> {(megenagnaRevenue - 18000).toLocaleString()} ETB</p>
                </div>

                <div className="p-4 border border-[#E7DED1] rounded-2xl bg-[#FAF6EF]/20 space-y-2">
                  <span className="font-bold text-sm block">3. Lebu Branch</span>
                  <p><strong>Gross Inflow:</strong> {lebuRevenue.toLocaleString()} ETB</p>
                  <p><strong>Approved Expenses:</strong> 15,000 ETB</p>
                  <p className="font-bold text-green-700"><strong>Net Margin:</strong> {(lebuRevenue - 15000).toLocaleString()} ETB</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 11: FINANCIAL REPORTS & EXPORTS (Requirements 27, 28, 29) */}
          {activeTab === 'reports' && (
            <div className="bg-white border border-[#E7DED1] p-6 rounded-2xl shadow-2xs space-y-4 animate-fadeIn text-xs">
              <h3 className="font-display font-black text-sm uppercase tracking-wider">Financial Report Generation & Export Desk</h3>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Button variant="secondary" onClick={() => handleExportFinancials('pdf', 'Daily Revenue Summary')}>Export PDF Report</Button>
                <Button variant="secondary" onClick={() => handleExportFinancials('excel', 'Monthly Profit & Loss')}>Export Excel Sheet</Button>
                <Button variant="secondary" onClick={() => handleExportFinancials('csv', 'Raw Transaction Ledger')}>Export CSV File</Button>
                <Button variant="primary" onClick={() => window.print()}>Print Official Report</Button>
              </div>
            </div>
          )}

          {/* TAB 12: DAILY CASH RECONCILIATION (Requirement 31 & 32) */}
          {activeTab === 'closing' && (
            <div className="bg-white border border-[#E7DED1] p-6 rounded-2xl shadow-2xs space-y-6 animate-fadeIn text-xs">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-[#E89B52] uppercase font-bold">END-OF-DAY CASH RECONCILIATION</span>
                <h2 className="font-display font-black text-xl uppercase">Daily Cash Closing Workflow</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Branch Desk</label>
                  <select value={closingForm.branch} onChange={(e) => setClosingForm({ ...closingForm, branch: e.target.value })} className="w-full p-2.5 border rounded bg-white font-bold">
                    <option>Piazza Branch</option>
                    <option>Megenagna Branch</option>
                    <option>Lebu Branch</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Opening Cash Balance (ETB)</label>
                  <Input type="number" value={closingForm.openingCash} onChange={(e) => setClosingForm({ ...closingForm, openingCash: Number(e.target.value) })} />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Cash Inflows Today (ETB)</label>
                  <Input type="number" value={closingForm.cashReceived} onChange={(e) => setClosingForm({ ...closingForm, cashReceived: Number(e.target.value) })} />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Physical Cash Count at Closing (ETB)</label>
                  <Input type="number" value={closingForm.closingCash} onChange={(e) => setClosingForm({ ...closingForm, closingCash: Number(e.target.value) })} />
                </div>
              </div>

              <div className="p-3 bg-[#FAF6EF] rounded-xl border border-[#E7DED1] flex justify-between items-center font-bold">
                <span>Calculated Expected Cash: <strong className="font-mono text-[#E89B52]">{expectedClosing} ETB</strong></span>
                <span>Calculated Variance: <strong className={`font-mono ${variance === 0 ? 'text-green-600' : 'text-red-600'}`}>{variance} ETB</strong></span>
              </div>

              <Button variant="primary" onClick={handleDailyClosingSubmit} className="w-full">Submit Daily Financial Reconciliation</Button>
            </div>
          )}

          {/* TAB 13: AUDIT TRAIL LOG (Requirement 40) */}
          {activeTab === 'audit' && (
            <div className="bg-white border border-[#E7DED1] p-6 rounded-2xl shadow-2xs space-y-4 animate-fadeIn text-xs">
              <h3 className="font-display font-black text-sm uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck size={18} className="text-[#E89B52]" />
                Financial Audit Trail Log
              </h3>

              <div className="border border-gray-100 rounded-xl overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-[#FAF6EF] text-[10px] font-bold text-gray-400 uppercase">
                    <tr>
                      <th className="p-3">User & Role</th>
                      <th className="p-3">Action</th>
                      <th className="p-3">Target / Record</th>
                      <th className="p-3">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {financialAuditLogs.map(l => (
                      <tr key={l.id} className="border-b border-gray-100">
                        <td className="p-3 font-bold">{l.user} ({l.role})</td>
                        <td className="p-3 text-[#E89B52] font-bold">{l.action}</td>
                        <td className="p-3 text-gray-500">{l.target}</td>
                        <td className="p-3 font-mono text-gray-400">{l.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* TRANSACTION DETAIL & AUDIT MODAL */}
      <AnimatePresence>
        {selectedTxn && (
          <div className="fixed inset-0 bg-[#2B2B2B]/75 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div className="bg-white border border-[#E7DED1] max-w-md w-full rounded-2xl p-6 text-left space-y-4 shadow-2xl">
              <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                <h4 className="font-display font-black text-sm uppercase">Transaction Detail & Audit</h4>
                <button onClick={() => setSelectedTxn(null)} className="text-gray-400 hover:text-black">
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                {selectedTxn.receiptImage && (
                  <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden border border-gray-200">
                    <img src={selectedTxn.receiptImage} className="w-full h-full object-cover" alt="Receipt Upload" />
                  </div>
                )}

                <div className="p-3 bg-[#FAF6EF] rounded-xl border border-[#E7DED1] space-y-1 font-mono text-[11px]">
                  <div><b>TXN ID:</b> {selectedTxn.id}</div>
                  <div><b>Student:</b> {selectedTxn.studentName} ({selectedTxn.studentId})</div>
                  <div><b>Course / Branch:</b> {selectedTxn.course} • {selectedTxn.branch}</div>
                  <div><b>Amount Paid:</b> {selectedTxn.amount} ETB</div>
                  <div><b>Payment Method:</b> {selectedTxn.paymentMethod}</div>
                  <div><b>Bank Ref #:</b> {selectedTxn.referenceNumber}</div>
                  <div><b>Status:</b> {selectedTxn.status}</div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="secondary" className="flex-1" onClick={() => handleRejectTransaction(selectedTxn.id)}>Reject</Button>
                <Button variant="primary" className="flex-1" onClick={() => handleVerifyTransaction(selectedTxn.id)}>Verify & Approve</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* PRINTABLE DIGITAL RECEIPT MODAL */}
      <AnimatePresence>
        {activeReceiptModal && (
          <div className="fixed inset-0 bg-[#2B2B2B]/75 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div className="bg-white border border-[#E7DED1] max-w-sm w-full rounded-2xl p-6 text-left space-y-4 shadow-2xl">
              <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                <span className="font-display font-black text-sm uppercase">Abel Begena Official Receipt</span>
                <button onClick={() => setActiveReceiptModal(null)} className="text-gray-400 hover:text-black">
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-3 text-xs border p-4 rounded-xl bg-[#FAF6EF]">
                <div className="text-center space-y-1 border-b border-gray-200 pb-3">
                  <h3 className="font-display font-black text-base uppercase">Abel Begena School</h3>
                  <span className="text-[10px] text-[#E89B52] font-mono font-bold block">OFFICIAL PAYMENT RECEIPT</span>
                  <span className="font-mono text-[9px] text-gray-400">Receipt ID: {activeReceiptModal.id}</span>
                </div>

                <div className="space-y-1 font-mono text-[11px]">
                  <div><b>Student:</b> {activeReceiptModal.studentName}</div>
                  <div><b>ID:</b> {activeReceiptModal.studentId}</div>
                  <div><b>Course:</b> {activeReceiptModal.course}</div>
                  <div><b>Branch:</b> {activeReceiptModal.branch}</div>
                  <div><b>Amount:</b> {activeReceiptModal.amount} ETB</div>
                  <div><b>Payment Method:</b> {activeReceiptModal.paymentMethod}</div>
                  <div><b>Reference #:</b> {activeReceiptModal.referenceNumber}</div>
                  <div><b>Issued Date:</b> {activeReceiptModal.date}</div>
                </div>

                <div className="pt-2 border-t border-gray-200 flex items-center justify-between">
                  <QrCode size={36} className="text-[#E89B52]" />
                  <span className="text-[8px] font-mono text-gray-400">Scan QR Code to verify validity at /verify/receipt/{activeReceiptModal.id}</span>
                </div>
              </div>

              <Button variant="primary" onClick={() => window.print()} className="w-full gap-2">
                <Printer size={16} /> Print Official Receipt
              </Button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

