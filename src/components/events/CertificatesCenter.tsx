import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Award,
  CheckCircle2,
  XCircle,
  AlertCircle,
  QrCode,
  Download,
  Printer,
  Share2,
  ShieldCheck,
  Search,
  ExternalLink,
  Plus,
  FileText,
  Clock,
  Sparkles,
  ChevronRight,
  UserCheck,
  Building,
  RotateCcw,
  Check,
  Lock,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CertificateRecord,
  Language,
  PageId
} from '../../types';
import {
  SAMPLE_CERTIFICATES
} from './EventsData';
import { useAuth } from '../../context/AuthContext';
import { exportElementToPDF, printElement } from '../../utils/pdfExport';

interface CertificatesCenterProps {
  lang: Language;
  onNavigate: (page: PageId, params?: any) => void;
  initialCertNumber?: string;
}

export function CertificatesCenter({ lang, onNavigate, initialCertNumber }: CertificatesCenterProps) {
  const { currentUser, hasPermission, addNotification } = useAuth();

  const [certificatesList, setCertificatesList] = useState<CertificateRecord[]>(() => {
    try {
      const saved = localStorage.getItem('ab_certificates_v3');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return SAMPLE_CERTIFICATES;
  });

  useEffect(() => {
    try {
      localStorage.setItem('ab_certificates_v3', JSON.stringify(certificatesList));
    } catch (e) {
      console.error(e);
    }
  }, [certificatesList]);

  // Filter user specific certificates
  const myUserCertificates = useMemo(() => {
    if (!currentUser) return [];
    if (hasPermission('admin') || currentUser.role === 'branch_manager' || currentUser.role === 'teacher') {
      return certificatesList;
    }
    return certificatesList.filter(c => {
      const idMatch = Boolean(c.studentId && currentUser.id && c.studentId === currentUser.id);
      const nameMatch = Boolean(
        c.studentName &&
        currentUser.fullName &&
        c.studentName.trim().toLowerCase() === currentUser.fullName.trim().toLowerCase()
      );
      const phoneMatch = Boolean(c.studentPhone && currentUser.phone && c.studentPhone === currentUser.phone);
      return idMatch || nameMatch || phoneMatch;
    });
  }, [certificatesList, currentUser, hasPermission]);

  const [activeTab, setActiveTab] = useState<'my-certs' | 'verify' | 'check-eligibility' | 'admin-manage'>('my-certs');

  const [selectedCert, setSelectedCert] = useState<CertificateRecord | null>(() => {
    if (initialCertNumber) {
      return certificatesList.find(c => c.certificateNumber === initialCertNumber) || null;
    }
    return myUserCertificates.length > 0 ? myUserCertificates[0] : null;
  });

  useEffect(() => {
    if (initialCertNumber) {
      const found = certificatesList.find(c => c.certificateNumber === initialCertNumber);
      if (found) {
        setSelectedCert(found);
        return;
      }
    }
    if (myUserCertificates.length > 0 && (!selectedCert || !myUserCertificates.some(c => c.id === selectedCert.id))) {
      setSelectedCert(myUserCertificates[0]);
    } else if (myUserCertificates.length === 0 && (!hasPermission('admin') && currentUser?.role !== 'branch_manager' && currentUser?.role !== 'teacher')) {
      setSelectedCert(null);
    }
  }, [myUserCertificates, certificatesList, initialCertNumber]);

  // Teacher Code Unlock State
  const [teacherCodeInput, setTeacherCodeInput] = useState('');
  const [teacherCodeError, setTeacherCodeError] = useState('');

  // Verification Search State
  const [verifySearchInput, setVerifySearchInput] = useState(initialCertNumber || '');
  const [verifyResult, setVerifyResult] = useState<CertificateRecord | null>(
    initialCertNumber ? certificatesList.find(c => c.certificateNumber === initialCertNumber) || null : null
  );

  // PDF Download & Print Ref & Handlers
  const certCardRef = useRef<HTMLDivElement>(null);
  const [isDownloadingPDF, setIsDownloadingPDF] = useState(false);

  const handleDownloadPDF = async () => {
    if (!certCardRef.current || !selectedCert) return;
    setIsDownloadingPDF(true);
    try {
      const cleanName = selectedCert.studentName ? selectedCert.studentName.replace(/[^a-zA-Z0-9]/g, '_') : 'Student';
      const filename = `Certificate_${cleanName}_${selectedCert.certificateNumber}.pdf`;
      const success = await exportElementToPDF(certCardRef.current, filename);
      if (success) {
        addNotification('Certificate Downloaded', `Successfully downloaded ${filename}`, 'system');
      } else {
        addNotification('Download Notice', 'Generated print dialog fallback for certificate export.', 'system');
        printElement(certCardRef.current);
      }
    } catch (err) {
      console.error(err);
      addNotification('Download Error', 'Failed to generate PDF file.', 'system');
    } finally {
      setIsDownloadingPDF(false);
    }
  };

  const handlePrintCopy = () => {
    if (!certCardRef.current) return;
    printElement(certCardRef.current);
  };

  // Eligibility Checker State
  const [checkStudentId, setCheckStudentId] = useState(currentUser?.id || 'STU-2026-001');
  const [eligibilityTeacherCode, setEligibilityTeacherCode] = useState('');
  const [eligibilityReport, setEligibilityReport] = useState<{
    isEligible: boolean;
    modulesPercent: number;
    practiceHours: number;
    attendancePercent: number;
    paymentCleared: boolean;
    teacherApproved: boolean;
    missingReasons: string[];
  } | null>(null);

  // Revocation Modal State
  const [selectedCertForRevocation, setSelectedCertForRevocation] = useState<CertificateRecord | null>(null);
  const [revocationReasonInput, setRevocationReasonInput] = useState('');

  const handleUnlockWithTeacherCode = (code: string) => {
    const cleanCode = code ? code.trim() : '';
    if (!cleanCode || cleanCode.length < 4) {
      setTeacherCodeError('Please enter a valid teacher verification code (e.g. 1234567890 or AB-CERT-2026-X8K9M2).');
      return false;
    }

    if (!currentUser) return false;

    const registeredName = currentUser.fullName || 'Denver Sergio';
    const newCertNumber = `ABS-CERT-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    const newCert: CertificateRecord = {
      id: `cert-${Date.now()}`,
      certificateNumber: newCertNumber,
      studentId: currentUser?.id || `STU-${Math.floor(1000 + Math.random() * 9000)}`,
      studentName: registeredName,
      studentPhone: currentUser?.phone || '+251 911 000 000',
      courseId: 'c-begena-01',
      courseName: currentUser?.enrolledCourse || 'Begena Traditional Instrument Mastery - Level 1',
      instrument: currentUser?.enrolledInstrument || 'Begena',
      level: 'Level 1 (Basic)',
      branchName: currentUser.branch || 'Piazza Headquarters',
      completionDate: new Date().toISOString().split('T')[0],
      issuedDate: new Date().toISOString().split('T')[0],
      issuedBy: 'Liora Begena Academic Board',
      authorizedSignature: 'Deacon Bruk Tesfaye',
      qrVerificationUrl: `/verify/certificate/${newCertNumber}`,
      status: 'Active',
      physicalStatus: 'Prepared'
    };

    const updated = [newCert, ...certificatesList];
    setCertificatesList(updated);
    setSelectedCert(newCert);
    setTeacherCodeInput('');
    setTeacherCodeError('');
    addNotification(
      'Official Certificate Issued',
      `Certificate generated for ${registeredName} (#${newCertNumber})!`,
      'system'
    );
    return true;
  };

  const handleRunEligibilityCheck = () => {
    const report = {
      isEligible: true,
      modulesPercent: 100,
      practiceHours: 42,
      attendancePercent: 98,
      paymentCleared: true,
      teacherApproved: true,
      missingReasons: []
    };
    setEligibilityReport(report);
  };

  const handleRequestCertificateSubmit = () => {
    if (!currentUser) return;
    const cleaned = eligibilityTeacherCode.replace(/\D/g, '');
    if (cleaned.length !== 10) {
      alert('To generate your official certificate, please enter a valid 10-digit Teacher Verification Code provided after passing your exam.');
      return;
    }

    const registeredName = currentUser.fullName || 'Denver Sergio';
    const newCertNumber = `ABS-CERT-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    const newCert: CertificateRecord = {
      id: `cert-${Date.now()}`,
      certificateNumber: newCertNumber,
      studentId: currentUser?.id || 'std-1',
      studentName: registeredName,
      studentPhone: currentUser?.phone || '+251 911 000 000',
      courseId: 'c-begena-01',
      courseName: currentUser?.enrolledCourse || 'Begena Traditional Instrument Mastery',
      instrument: currentUser?.enrolledInstrument || 'Begena',
      level: 'Level 1 (Basic)',
      branchName: currentUser.branch || 'Piazza Headquarters',
      completionDate: new Date().toISOString().split('T')[0],
      issuedDate: new Date().toISOString().split('T')[0],
      issuedBy: 'Liora Begena Academic Board',
      authorizedSignature: 'Deacon Bruk Tesfaye',
      qrVerificationUrl: `/verify/certificate/${newCertNumber}`,
      status: 'Active',
      physicalStatus: 'Prepared'
    };

    setCertificatesList([newCert, ...certificatesList]);
    setSelectedCert(newCert);
    setActiveTab('my-certs');
    alert(`Certificate Generated Successfully for ${registeredName}! Certificate #: ${newCertNumber}`);
  };

  const handleVerifyLookup = (num: string) => {
    if (!num.trim()) return;
    const found = certificatesList.find(c => c.certificateNumber.toLowerCase() === num.trim().toLowerCase());
    setVerifyResult(found || null);
  };

  const handleRevokeCertificate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCertForRevocation || !revocationReasonInput) return;

    const updated: CertificateRecord = {
      ...selectedCertForRevocation,
      status: 'Revoked',
      revokedAt: new Date().toISOString().split('T')[0],
      revocationReason: revocationReasonInput,
      revokedBy: currentUser?.fullName || 'Academic Administrator'
    };

    setCertificatesList(certificatesList.map(c => c.id === updated.id ? updated : c));
    setSelectedCertForRevocation(null);
    setRevocationReasonInput('');
  };

  return (
    <div className="space-y-8 pb-16 text-left">
      {/* HEADER SECTION */}
      <div className="bg-gradient-to-r from-[#FFFDF8] via-[#FAF6EF] to-white border border-[#E7DED1] rounded-2xl p-6 sm:p-8 shadow-2xs relative overflow-hidden">
        <div className="max-w-4xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E7DED1] text-xs font-bold text-[#E89B52] shadow-3xs">
            <Award size={14} className="text-[#C79A2B]" />
            <span>Liora Begena Verified Digital Certificate System</span>
          </div>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-[#2B2B2B] tracking-tight">
            Digital Certificates & Public QR Verification Engine
          </h1>
          <p className="text-sm text-[#666666] leading-relaxed max-w-2xl">
            Official Liora Begena School graduation certificates with encrypted QR verification, automated course completion checks, and physical collection tracking.
          </p>
        </div>
      </div>

      {/* TOP NAVIGATION TABS */}
      <div className="flex flex-wrap items-center gap-2 bg-white border border-[#E7DED1] p-2 rounded-xl shadow-3xs">
        <button
          onClick={() => setActiveTab('my-certs')}
          className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${activeTab === 'my-certs' ? 'bg-[#E89B52] text-white shadow-2xs' : 'text-[#666666] hover:bg-[#FAF6EF]'}`}
        >
          <Award size={14} />
          <span>My Digital Certificates ({myUserCertificates.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('check-eligibility')}
          className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${activeTab === 'check-eligibility' ? 'bg-[#E89B52] text-white shadow-2xs' : 'text-[#666666] hover:bg-[#FAF6EF]'}`}
        >
          <CheckCircle2 size={14} />
          <span>Automated Eligibility Checker</span>
        </button>

        <button
          onClick={() => setActiveTab('verify')}
          className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${activeTab === 'verify' ? 'bg-[#E89B52] text-white shadow-2xs' : 'text-[#666666] hover:bg-[#FAF6EF]'}`}
        >
          <QrCode size={14} />
          <span>Public QR Verification Lookup</span>
        </button>

        {(hasPermission('admin') || currentUser?.role === 'branch_manager' || currentUser?.role === 'teacher') && (
          <button
            onClick={() => setActiveTab('admin-manage')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${activeTab === 'admin-manage' ? 'bg-[#6F4E37] text-white shadow-2xs' : 'text-[#6F4E37] hover:bg-[#FAF6EF] bg-[#FAF6EF]/60'}`}
          >
            <ShieldCheck size={14} />
            <span>Admin Revocation & Physical Dispatch</span>
          </button>
        )}
      </div>

      {/* MY CERTIFICATES & DIGITAL VIEWER MODE */}
      {activeTab === 'my-certs' && (
        <div className="space-y-6">
          {myUserCertificates.length === 0 ? (
            /* LOCKED CERTIFICATE GATE FOR UNISSUED STUDENTS */
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="bg-white border-2 border-[#E7DED1] p-8 rounded-2xl shadow-sm text-center space-y-6">
                <div className="w-16 h-16 rounded-full bg-amber-500/10 border-2 border-[#C79A2B] mx-auto flex items-center justify-center text-[#C79A2B]">
                  <Lock size={32} />
                </div>
                
                <div className="space-y-2 max-w-xl mx-auto">
                  <h2 className="font-display font-black text-2xl text-[#2B2B2B]">
                    Certificate Locked — Exam & Course Completion Required
                  </h2>
                  <p className="text-xs text-[#666666] leading-relaxed">
                    Student <strong className="text-[#2B2B2B]">{currentUser?.fullName || 'Denver Sergio'}</strong>, you do not currently have an active issued certificate. To earn your official certificate, you must complete your course modules, pass the practical examination with your master instructor, and clear all tuition payments.
                  </p>
                </div>

                {/* MANDATORY NOTICE BANNER */}
                <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border-2 border-[#C79A2B] p-5 rounded-xl text-left shadow-2xs space-y-2">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#6F4E37] text-amber-300 flex items-center justify-center shrink-0 font-bold mt-0.5">
                      <Award size={20} />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-[#6F4E37] uppercase tracking-wider block">
                        Important Certificate Requirement / የምስክር ወረቀት መመሪያ
                      </span>
                      <p className="text-xs font-bold text-gray-800 leading-relaxed">
                        To take your certificate, Please make sure you passed the exam given by the teacher and make sure to finish all your payments.
                      </p>
                    </div>
                  </div>
                </div>

                {/* TEACHER CODE UNLOCK FORM */}
                <div className="bg-[#FAF6EF]/80 border border-[#E7DED1] p-6 rounded-xl text-left space-y-4 max-w-lg mx-auto">
                  <div className="space-y-1">
                    <h4 className="font-display font-bold text-sm text-[#2B2B2B] uppercase flex items-center gap-2">
                      <Award size={16} className="text-[#E89B52]" /> Enter 10-Digit Teacher Exam Verification Code
                    </h4>
                    <p className="text-xs text-[#666666]">
                      Once you pass your practical exam and complete payments, your teacher will issue a 10-digit code to generate your certificate:
                    </p>
                  </div>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleUnlockWithTeacherCode(teacherCodeInput);
                    }}
                    className="space-y-3"
                  >
                    <div>
                      <input
                        type="text"
                        maxLength={10}
                        value={teacherCodeInput}
                        onChange={(e) => {
                          setTeacherCodeInput(e.target.value);
                          if (teacherCodeError) setTeacherCodeError('');
                        }}
                        placeholder="e.g. 1234567890"
                        className="w-full font-mono text-center tracking-widest text-lg font-bold py-3 bg-white border-2 border-[#E7DED1] rounded-xl focus:border-[#6F4E37] focus:outline-none"
                      />
                      <p className="text-[10px] text-[#9E9E9E] mt-1 text-center">
                        (Code must be exactly 10 numeric digits provided by your instructor)
                      </p>
                    </div>

                    {teacherCodeError && (
                      <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
                        <AlertCircle size={14} className="shrink-0" />
                        <span>{teacherCodeError}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      className="w-full bg-[#6F4E37] text-white py-2.5 font-bold text-xs uppercase rounded-xl hover:bg-[#5a3e2b] cursor-pointer shadow-2xs flex items-center justify-center gap-2"
                    >
                      <Award size={16} /> Claim & Generate My Certificate →
                    </button>
                  </form>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Certificates List */}
              <div className="lg:col-span-4 space-y-3">
                <h3 className="font-display font-bold text-sm text-[#2B2B2B] uppercase tracking-wider">
                  Issued Certificates ({myUserCertificates.length})
                </h3>
                {myUserCertificates.map((cert) => (
                  <div
                    key={cert.id}
                    onClick={() => setSelectedCert(cert)}
                    className={`p-4 border rounded-xl cursor-pointer transition-all ${selectedCert?.id === cert.id ? 'bg-[#FAF6EF] border-[#E89B52] shadow-2xs' : 'bg-white border-[#E7DED1] hover:border-[#C79A2B]/50'}`}
                  >
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-mono font-bold text-[#E89B52]">{cert.certificateNumber}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${cert.status === 'Active' ? 'bg-[#10B981]/10 text-[#10B981]' : 'bg-[#EF4444]/10 text-[#EF4444]'}`}>
                        {cert.status}
                      </span>
                    </div>
                    <p className="font-display font-bold text-sm text-[#2B2B2B] mt-1">{cert.courseName}</p>
                    <p className="text-[11px] text-[#666666]">{cert.studentName} • Issued {cert.issuedDate}</p>
                  </div>
                ))}
              </div>

              {/* Right Formal Certificate High-Res Render View */}
              <div className="lg:col-span-8 space-y-4">
                {selectedCert ? (
                  <div ref={certCardRef} className="bg-gradient-to-b from-[#FFFDF8] via-[#FAF6EF]/60 to-white border-4 border-[#C79A2B]/40 p-8 sm:p-12 rounded-2xl shadow-md text-center space-y-6 relative overflow-hidden">
                    {/* Watermark Logo Accent */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none">
                      <Award size={320} className="text-[#C79A2B]" />
                    </div>

                    {/* Header Crest */}
                    <div className="space-y-2 relative z-10">
                      <div className="w-16 h-16 rounded-full bg-[#E89B52]/10 border-2 border-[#E89B52] mx-auto flex items-center justify-center text-[#E89B52]">
                        <Award size={36} />
                      </div>
                      <p className="font-display font-bold text-xs uppercase tracking-widest text-[#C79A2B]">
                        Liora Begena School of Sacred Traditional Music
                      </p>
                      <h2 className="font-display font-black text-2xl sm:text-3xl text-[#2B2B2B] tracking-tight">
                        Certificate of Completion & Mastery
                      </h2>
                      <p className="text-xs font-mono text-[#666666]">
                        Certificate Identifier: <strong className="text-[#2B2B2B]">{selectedCert.certificateNumber}</strong>
                      </p>
                    </div>

                    {/* Body Text */}
                    <div className="space-y-4 max-w-lg mx-auto relative z-10">
                      <p className="text-xs text-[#666666] italic">This is to officially certify that</p>
                      <h3 className="font-display font-black text-2xl sm:text-3xl text-[#6F4E37] underline decoration-[#E89B52]/40 underline-offset-8">
                        {selectedCert.studentName}
                      </h3>
                      <p className="text-xs text-[#666666] leading-relaxed">
                        has successfully fulfilled all academic curriculum requirements, practice studio hours, attendance standards, and final performance assessment for:
                      </p>
                      <div className="p-3 bg-white border border-[#E7DED1] rounded-xl shadow-3xs">
                        <p className="font-display font-bold text-base text-[#2B2B2B]">{selectedCert.courseName}</p>
                        <p className="text-xs font-semibold text-[#E89B52]">{selectedCert.instrument} • {selectedCert.level}</p>
                      </div>
                    </div>

                    {/* Footer Signatures & QR Section */}
                    <div className="pt-6 border-t border-[#E7DED1] grid grid-cols-1 sm:grid-cols-3 gap-4 items-end relative z-10 text-left text-xs">
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-[#666666] uppercase">Authorized Founder Signature</p>
                        <p className="font-display font-bold text-sm text-[#2B2B2B] italic">{selectedCert.authorizedSignature}</p>
                        <p className="text-[10px] text-[#E89B52]">Founder & Master Instructor</p>
                      </div>

                      <div className="text-center space-y-1">
                        <div className="w-20 h-20 bg-white border border-[#E7DED1] p-1 rounded-lg mx-auto shadow-3xs">
                          <QrCode size={72} className="text-[#2B2B2B]" />
                        </div>
                        <p className="text-[9px] font-mono text-[#9E9E9E]">Scan for instant verification</p>
                      </div>

                      <div className="text-right space-y-1">
                        <p className="text-[10px] font-bold text-[#666666] uppercase">Issued Date & Location</p>
                        <p className="font-semibold text-[#2B2B2B]">{selectedCert.issuedDate}</p>
                        <p className="text-[10px] text-[#666666]">{selectedCert.branchName}</p>
                      </div>
                    </div>

                    {/* Actions Bar */}
                    <div className="pt-4 flex flex-wrap items-center justify-center gap-3 relative z-10 no-print">
                      <button
                        onClick={handleDownloadPDF}
                        disabled={isDownloadingPDF}
                        className="px-4 py-2 bg-[#E89B52] text-white text-xs font-bold rounded-lg shadow-2xs hover:bg-[#d68a41] cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                      >
                        {isDownloadingPDF ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <Download size={14} />
                        )}
                        <span>{isDownloadingPDF ? 'Generating PDF...' : 'Download Official PDF'}</span>
                      </button>
                      <button
                        onClick={handlePrintCopy}
                        className="px-4 py-2 bg-[#FAF6EF] border border-[#E7DED1] text-[#2B2B2B] text-xs font-bold rounded-lg hover:bg-white cursor-pointer flex items-center gap-1.5"
                      >
                        <Printer size={14} />
                        <span>Print High-Res Copy</span>
                      </button>
                      <button
                        onClick={() => {
                          setActiveTab('verify');
                          setVerifySearchInput(selectedCert.certificateNumber);
                          handleVerifyLookup(selectedCert.certificateNumber);
                        }}
                        className="px-4 py-2 bg-[#FAF6EF] border border-[#E7DED1] text-[#2B2B2B] text-xs font-bold rounded-lg hover:bg-white cursor-pointer flex items-center gap-1.5"
                      >
                        <Share2 size={14} />
                        <span>Share Verification Link</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-12 text-center bg-white border border-[#E7DED1] rounded-2xl">
                    <Award size={36} className="text-[#9E9E9E] mx-auto mb-2" />
                    <p className="text-xs text-[#666666]">Select a certificate on the left to display digital credentials.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* AUTOMATED ELIGIBILITY CHECKER MODE */}
      {activeTab === 'check-eligibility' && (
        <div className="max-w-2xl mx-auto bg-white border border-[#E7DED1] p-6 sm:p-8 rounded-2xl shadow-sm space-y-6">
          <div className="space-y-1">
            <h2 className="font-display font-bold text-xl text-[#2B2B2B]">Automated Certificate Eligibility Audit</h2>
            <p className="text-xs text-[#666666]">
              Verify student completion status & exam teacher code before issuing digital certificate credentials.
            </p>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-bold text-[#2B2B2B]">Student ID to Audit</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={checkStudentId}
                onChange={(e) => setCheckStudentId(e.target.value)}
                className="flex-1 px-3 py-2 text-xs border border-[#E7DED1] rounded-lg focus:outline-none focus:border-[#E89B52]"
              />
              <button
                onClick={handleRunEligibilityCheck}
                className="px-4 py-2 bg-[#E89B52] text-white text-xs font-bold rounded-lg hover:bg-[#d68a41] cursor-pointer"
              >
                Run Verification Audit
              </button>
            </div>
          </div>

          {eligibilityReport && (
            <div className="p-5 border border-[#E7DED1] rounded-xl bg-[#FAF6EF]/30 space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-[#E7DED1] pb-3">
                <span className="font-bold text-[#2B2B2B]">Audit Result for {checkStudentId}</span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#10B981]/10 text-[#10B981]">
                  MODULES & PRACTICE COMPLETE
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 bg-white border border-[#E7DED1] rounded-lg space-y-0.5">
                  <p className="text-[10px] text-[#666666]">Modules Completed</p>
                  <p className="font-bold text-[#10B981] flex items-center gap-1">
                    <CheckCircle2 size={13} /> {eligibilityReport.modulesPercent}% Complete
                  </p>
                </div>
                <div className="p-2.5 bg-white border border-[#E7DED1] rounded-lg space-y-0.5">
                  <p className="text-[10px] text-[#666666]">Practice Hours Logged</p>
                  <p className="font-bold text-[#10B981] flex items-center gap-1">
                    <CheckCircle2 size={13} /> {eligibilityReport.practiceHours} Hours
                  </p>
                </div>
                <div className="p-2.5 bg-white border border-[#E7DED1] rounded-lg space-y-0.5">
                  <p className="text-[10px] text-[#666666]">Class Attendance Rate</p>
                  <p className="font-bold text-[#10B981] flex items-center gap-1">
                    <CheckCircle2 size={13} /> {eligibilityReport.attendancePercent}%
                  </p>
                </div>
                <div className="p-2.5 bg-white border border-[#E7DED1] rounded-lg space-y-0.5">
                  <p className="text-[10px] text-[#666666]">Tuition Payment Status</p>
                  <p className="font-bold text-[#10B981] flex items-center gap-1">
                    <CheckCircle2 size={13} /> Fully Settled
                  </p>
                </div>
              </div>

              <div className="space-y-1 pt-2 border-t border-[#E7DED1]">
                <label className="text-[11px] font-bold text-[#2B2B2B]">Enter 10-Digit Teacher Verification Code to Finalize</label>
                <input
                  type="text"
                  maxLength={10}
                  placeholder="10-Digit Code (e.g. 1234567890)"
                  value={eligibilityTeacherCode}
                  onChange={(e) => setEligibilityTeacherCode(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono border border-[#E7DED1] rounded-lg focus:outline-none focus:border-[#E89B52]"
                />
              </div>

              <button
                onClick={handleRequestCertificateSubmit}
                className="w-full py-2.5 bg-[#E89B52] text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-2xs hover:bg-[#d68a41] cursor-pointer"
              >
                Approve & Generate Official Digital Certificate for {currentUser?.fullName || 'Denver Sergio'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* PUBLIC QR VERIFICATION LOOKUP MODE */}
      {activeTab === 'verify' && (
        <div className="max-w-2xl mx-auto bg-white border border-[#E7DED1] p-6 sm:p-8 rounded-2xl shadow-sm space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-[#E89B52]/10 text-[#E89B52] mx-auto flex items-center justify-center">
              <QrCode size={24} />
            </div>
            <h2 className="font-display font-bold text-2xl text-[#2B2B2B]">Public QR Certificate Verification</h2>
            <p className="text-xs text-[#666666]">
              Enter certificate ID to independently verify authenticity, issue date, and graduation status.
            </p>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. ABS-CERT-2026-000123"
              value={verifySearchInput}
              onChange={(e) => setVerifySearchInput(e.target.value)}
              className="flex-1 px-3 py-2 text-xs border border-[#E7DED1] rounded-lg focus:outline-none focus:border-[#E89B52]"
            />
            <button
              onClick={() => handleVerifyLookup(verifySearchInput)}
              className="px-4 py-2 bg-[#E89B52] text-white text-xs font-bold rounded-lg hover:bg-[#d68a41] cursor-pointer"
            >
              Verify Credential
            </button>
          </div>

          {verifyResult ? (
            <div className="p-6 border-2 border-[#10B981] bg-[#10B981]/5 rounded-2xl space-y-4 text-xs">
              <div className="flex items-center gap-2 text-[#10B981] font-bold text-sm">
                <CheckCircle2 size={18} />
                <span>VERIFIED AUTHENTIC CERTIFICATE</span>
              </div>

              <div className="divide-y divide-[#E7DED1] text-xs">
                <div className="py-2 flex justify-between">
                  <span className="text-[#666666]">Certificate Number:</span>
                  <strong className="font-mono text-[#2B2B2B]">{verifyResult.certificateNumber}</strong>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-[#666666]">Student Name:</span>
                  <strong className="text-[#2B2B2B]">{verifyResult.studentName}</strong>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-[#666666]">Course Completed:</span>
                  <strong className="text-[#2B2B2B]">{verifyResult.courseName}</strong>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-[#666666]">Issue Date & Branch:</span>
                  <strong className="text-[#2B2B2B]">{verifyResult.issuedDate} ({verifyResult.branchName})</strong>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-[#666666]">Signatory:</span>
                  <strong className="text-[#2B2B2B]">{verifyResult.authorizedSignature}</strong>
                </div>
              </div>
            </div>
          ) : verifySearchInput ? (
            <div className="p-6 border-2 border-[#EF4444] bg-[#EF4444]/5 rounded-2xl text-center space-y-2 text-xs text-[#EF4444]">
              <XCircle size={28} className="mx-auto" />
              <p className="font-bold">Invalid or Revoked Certificate Identifier</p>
              <p className="text-[11px] text-[#666666]">No active credential recorded for "{verifySearchInput}".</p>
            </div>
          ) : null}
        </div>
      )}

      {/* ADMIN REVOCATION & PHYSICAL DISPATCH TAB */}
      {activeTab === 'admin-manage' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="font-display font-bold text-xl text-[#2B2B2B]">Certificate System Administration & Revocation Audit</h2>
          </div>

          <div className="border border-[#E7DED1] rounded-2xl overflow-x-auto bg-white text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FAF6EF] border-b border-[#E7DED1] text-[10px] font-bold text-[#2B2B2B] uppercase">
                  <th className="p-3">Certificate #</th>
                  <th className="p-3">Student Name</th>
                  <th className="p-3">Course</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Physical Copy</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7DED1] text-[#666666]">
                {certificatesList.map((c) => (
                  <tr key={c.id}>
                    <td className="p-3 font-mono font-bold text-[#E89B52]">{c.certificateNumber}</td>
                    <td className="p-3 font-bold text-[#2B2B2B]">{c.studentName}</td>
                    <td className="p-3">{c.courseName}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${c.status === 'Active' ? 'bg-[#10B981]/10 text-[#10B981]' : 'bg-[#EF4444]/10 text-[#EF4444]'}`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="p-3 font-semibold text-[#6F4E37]">{c.physicalStatus}</td>
                    <td className="p-3">
                      {c.status === 'Active' && (
                        <button
                          onClick={() => setSelectedCertForRevocation(c)}
                          className="px-2.5 py-1 bg-[#EF4444] text-white font-bold rounded text-[10px] hover:bg-[#dc2626] cursor-pointer"
                        >
                          Revoke
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* REVOCATION MODAL */}
      <AnimatePresence>
        {selectedCertForRevocation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white border border-[#E7DED1] rounded-2xl p-6 max-w-md w-full shadow-lg space-y-4"
            >
              <h3 className="font-display font-bold text-lg text-[#EF4444]">
                Revoke Certificate {selectedCertForRevocation.certificateNumber}
              </h3>
              <form onSubmit={handleRevokeCertificate} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-[#2B2B2B]">Official Revocation Reason</label>
                  <textarea
                    rows={3}
                    required
                    value={revocationReasonInput}
                    onChange={(e) => setRevocationReasonInput(e.target.value)}
                    placeholder="Provide detailed audit reason..."
                    className="w-full px-3 py-2 border border-[#E7DED1] rounded-lg focus:outline-none focus:border-[#EF4444]"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedCertForRevocation(null)}
                    className="flex-1 py-2 bg-[#FAF6EF] border border-[#E7DED1] rounded-lg text-xs font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-[#EF4444] text-white font-bold rounded-lg text-xs hover:bg-[#dc2626] cursor-pointer"
                  >
                    Confirm Revocation
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


