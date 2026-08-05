import React, { useState } from 'react';
import {
  ArrowRightLeft,
  CheckCircle2,
  Clock,
  User,
  Building2,
  ShieldCheck,
  FileText,
  AlertCircle,
  Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Language, StudentBranchTransferRequest } from '../../types';
import { TiletPattern } from '../TiletPattern';
import { Button, Input } from '../InteractiveComponents';

const SAMPLE_TRANSFERS: StudentBranchTransferRequest[] = [
  {
    id: 'tr-1',
    studentId: 'STU-2026-081',
    studentName: 'Dawit Hailu',
    currentBranchId: 'b-lebu',
    currentBranchName: 'Lebu Branch',
    destinationBranchId: 'b-piazza',
    destinationBranchName: 'Piazza Branch',
    reason: 'Moved Location',
    notes: 'Family recently relocated to Arada sub-city near Piazza.',
    requestedBy: 'Student/Parent',
    requestedDate: '2026-07-20',
    status: 'Pending Review'
  },
  {
    id: 'tr-2',
    studentId: 'STU-2026-105',
    studentName: 'Saba Tesfaye',
    currentBranchId: 'b-[#2B2B2B]e',
    currentBranchName: 'Megenagna Branch',
    destinationBranchId: 'b-lebu',
    destinationBranchName: 'Lebu Branch',
    reason: 'Schedule Change',
    notes: 'Sunday morning session fits better at Lebu Branch.',
    requestedBy: 'Student',
    requestedDate: '2026-07-18',
    status: 'Approved',
    approvedBy: 'Selamawit Kebede (Megenagna Manager)'
  }
];

interface StudentTransferCenterProps {
  lang: Language;
  onNavigate: (page: string, params?: any) => void;
}

export function StudentTransferCenter({ lang, onNavigate }: StudentTransferCenterProps) {
  const [transfers, setTransfers] = useState<StudentBranchTransferRequest[]>(SAMPLE_TRANSFERS);

  // New Request Modal State
  const [showNewModal, setShowNewModal] = useState(false);
  const [studentName, setStudentName] = useState('Dawit Hailu');
  const [sourceBranch, setSourceBranch] = useState('Lebu Branch');
  const [destBranch, setDestBranch] = useState('Piazza Branch');
  const [transferReason, setTransferReason] = useState<any>('Moved Location');
  const [notes, setNotes] = useState('');

  const handleCreateRequest = () => {
    if (!studentName) return;
    const req: StudentBranchTransferRequest = {
      id: `tr-${Date.now()}`,
      studentId: `STU-2026-${Math.floor(100 + Math.random() * 900)}`,
      studentName,
      currentBranchId: 'b-source',
      currentBranchName: sourceBranch,
      destinationBranchId: 'b-dest',
      destinationBranchName: destBranch,
      reason: transferReason,
      notes: notes || 'Student transfer submitted for administrative verification.',
      requestedBy: 'Branch Registration Staff',
      requestedDate: new Date().toISOString().substring(0, 10),
      status: 'Pending Review'
    };
    setTransfers([req, ...transfers]);
    setShowNewModal(false);
    setNotes('');
  };

  const handleApproveTransfer = (id: string) => {
    setTransfers((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, status: 'Approved', approvedBy: 'Authorized Branch Manager' } : t
      )
    );
  };

  return (
    <div className="space-y-8 pb-16">
      {/* HEADER BANNER */}
      <div className="bg-[#2B2B2B] text-white p-6 sm:p-8 rounded-3xl relative overflow-hidden shadow-xl border border-amber-950/40">
        <TiletPattern className="opacity-15 text-[#E89B52] scale-125" />
        <div className="relative z-10 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E89B52]/20 border border-[#E89B52]/40 text-[#E89B52] text-xs font-bold uppercase tracking-widest">
              <ArrowRightLeft size={14} />
              <span>Cross-Campus Student Mobility Protocol</span>
            </div>

            <Button
              variant="primary"
              size="sm"
              className="flex items-center gap-1.5 shadow-md"
              onClick={() => setShowNewModal(true)}
            >
              <Plus size={14} />
              <span>+ Submit Branch Transfer Request</span>
            </Button>
          </div>

          <h1 className="font-display font-black text-2xl sm:text-3xl text-white tracking-wide uppercase">
            STUDENT BRANCH TRANSFER CENTER
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 max-w-2xl leading-relaxed">
            Process student transfers between Piazza, Megenagna, and Lebu campuses. Full historical progress, practice recordings, payments, and certificates are automatically preserved without creating duplicate accounts.
          </p>
        </div>
      </div>

      {/* DATA PRESERVATION GUARANTEE BANNER */}
      <div className="bg-amber-50 border border-amber-200 p-5 rounded-3xl flex items-center gap-4 text-xs text-amber-900">
        <ShieldCheck size={28} className="text-[#E89B52] shrink-0" />
        <div>
          <span className="font-bold text-sm block">100% Data Preservation Security Active</span>
          <p className="text-amber-800">
            When transferring between branches, the student's profile, attendance logs, teacher feedback, practice studio streaks, and tuition receipts remain intact.
          </p>
        </div>
      </div>

      {/* TRANSFER REQUESTS LIST */}
      <div className="bg-white border border-[#E7DED1] p-6 sm:p-8 rounded-3xl space-y-6 shadow-xs">
        <h2 className="font-display font-black text-xl text-[#2B2B2B]">TRANSFER REQUESTS QUEUE</h2>

        <div className="space-y-4">
          {transfers.map((t) => (
            <div key={t.id} className="p-5 bg-[#FAF6EF] border border-[#E7DED1] rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-[#2B2B2B]">{t.studentName}</span>
                  <span className="font-mono text-[10px] text-gray-400">({t.studentId})</span>
                </div>
                <div className="font-bold text-amber-900 flex items-center gap-2">
                  <span>{t.currentBranchName}</span>
                  <ArrowRightLeft size={14} className="text-[#E89B52]" />
                  <span>{t.destinationBranchName}</span>
                </div>
                <p className="text-gray-600">Reason: <b>{t.reason}</b> • Notes: "{t.notes}"</p>
                <p className="text-[10px] text-gray-400">Requested Date: {t.requestedDate} by {t.requestedBy}</p>
              </div>

              <div className="flex flex-col sm:items-end gap-2">
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                  t.status === 'Approved' ? 'bg-green-100 text-green-900' : 'bg-amber-100 text-amber-900'
                }`}>
                  {t.status}
                </span>

                {t.status === 'Pending Review' && (
                  <Button
                    variant="primary"
                    size="sm"
                    className="text-xs"
                    onClick={() => handleApproveTransfer(t.id)}
                  >
                    Verify Schedule & Approve
                  </Button>
                )}

                {t.approvedBy && (
                  <span className="text-[10px] text-gray-500 font-medium">{t.approvedBy}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* NEW TRANSFER MODAL */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#E7DED1] rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-4 shadow-2xl relative">
            <h3 className="font-display font-black text-lg text-[#2B2B2B]">SUBMIT STUDENT TRANSFER</h3>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-gray-600">Student Name</label>
                <Input value={studentName} onChange={(e) => setStudentName(e.target.value)} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-gray-600">Current Branch</label>
                  <select
                    className="w-full p-2.5 bg-[#FAF6EF] border border-[#E7DED1] rounded-xl font-bold"
                    value={sourceBranch}
                    onChange={(e) => setSourceBranch(e.target.value)}
                  >
                    <option value="Piazza Branch">Piazza Branch</option>
                    <option value="Megenagna Branch">Megenagna Branch</option>
                    <option value="Lebu Branch">Lebu Branch</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-600">Destination Branch</label>
                  <select
                    className="w-full p-2.5 bg-[#FAF6EF] border border-[#E7DED1] rounded-xl font-bold"
                    value={destBranch}
                    onChange={(e) => setDestBranch(e.target.value)}
                  >
                    <option value="Piazza Branch">Piazza Branch</option>
                    <option value="Megenagna Branch">Megenagna Branch</option>
                    <option value="Lebu Branch">Lebu Branch</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-600">Primary Reason</label>
                <select
                  className="w-full p-2.5 bg-[#FAF6EF] border border-[#E7DED1] rounded-xl font-bold"
                  value={transferReason}
                  onChange={(e) => setTransferReason(e.target.value as any)}
                >
                  <option value="Moved Location">Moved Location</option>
                  <option value="Schedule Change">Schedule Change</option>
                  <option value="Family Request">Family Request</option>
                  <option value="Work/School Schedule">Work/School Schedule</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-600">Notes / Details</label>
                <textarea
                  rows={2}
                  className="w-full p-3 bg-[#FAF6EF] border border-[#E7DED1] rounded-xl outline-none"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Additional context for branch manager..."
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="secondary" size="sm" onClick={() => setShowNewModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleCreateRequest}>
                Submit Transfer Request
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

