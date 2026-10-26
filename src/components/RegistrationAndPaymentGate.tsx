import React from 'react';
import {
  Lock,
  ShieldAlert,
  CheckCircle2,
  CreditCard,
  ArrowRight,
  Sparkles,
  Clock,
  UserCheck,
  BookOpen,
  DollarSign,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from './InteractiveComponents';
import { TiletPattern } from './TiletPattern';
import { Language } from '../types';

interface RegistrationAndPaymentGateProps {
  lang: Language;
  onNavigate: (page: string, params?: any) => void;
  title?: string;
}

export function RegistrationAndPaymentGate({
  lang,
  onNavigate,
  title = 'LEARNING PORTAL & PRACTICE STUDIO LOCKED'
}: RegistrationAndPaymentGateProps) {
  const { currentUser, updateProfile, addNotification } = useAuth();


  const studentStatus = currentUser?.studentStatus || 'Payment Pending';
  const enrolledCourse = currentUser?.enrolledCourse || `${currentUser?.enrolledInstrument || 'Begena'} Course`;

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6">
      <div className="bg-[#2B2B2B] text-white p-8 rounded-3xl relative overflow-hidden shadow-2xl border border-amber-950/40 space-y-6">
        <TiletPattern className="opacity-15 text-[#E89B52] scale-125" />

        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/40 text-red-400 text-xs font-bold uppercase tracking-widest">
            <Lock size={14} className="animate-pulse" />
            <span>Registration & Tuition Payment Required</span>
          </div>

          <h1 className="font-display font-black text-2xl sm:text-3xl tracking-wide uppercase text-white">
            {title}
          </h1>

          <p className="text-sm text-gray-300 leading-relaxed max-w-2xl">
            Access to Liora Begena’s interactive video tutorials, practice studio, audio guides, mezmur notation sheets, and live classes is strictly reserved for students who have fully finalized their registration and tuition payment.
          </p>
        </div>

        {/* REJECTION NOTICE IF PAYMENT WAS REJECTED */}
        {studentStatus === 'Payment Rejected' && (
          <div className="relative z-10 bg-red-950/60 border-2 border-red-500/80 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-3 text-red-300 font-bold text-sm uppercase tracking-wide">
              <ShieldAlert size={20} className="text-red-400 animate-bounce" />
              <span>Payment Verification Rejected by Accountant</span>
            </div>
            <div className="bg-black/40 p-3.5 rounded-xl border border-red-500/30 text-xs text-red-200 space-y-1 font-mono">
              <span className="text-red-400 font-bold block uppercase text-[10px]">Rejection Reason:</span>
              <p>{currentUser?.paymentRejectionReason || 'Receipt image or transaction reference number could not be matched with bank deposit logs.'}</p>
            </div>
            <p className="text-xs text-gray-300">
              Please double check your Telebirr / CBE payment receipt number and resubmit a clear proof of payment to the accountant.
            </p>
            <button
              onClick={() => onNavigate('student', { tab: 'payments' })}
              className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition flex items-center gap-2 cursor-pointer shadow-lg"
            >
              <CreditCard size={14} />
              <span>Resubmit Payment & Receipt</span>
              <ArrowRight size={14} />
            </button>
          </div>
        )}

        {/* PIPELINE STAGE CHECKLIST */}
        <div className="relative z-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-white/10 text-xs">
            <div>
              <span className="text-amber-400 font-mono text-[10px] uppercase block">Student Name</span>
              <span className="font-bold text-sm text-white">{currentUser?.fullName || 'Enrolled Student'}</span>
            </div>
            <div>
              <span className="text-amber-400 font-mono text-[10px] uppercase block">Enrolled Course</span>
              <span className="font-bold text-sm text-amber-200">{enrolledCourse}</span>
            </div>
            <div>
              <span className="text-amber-400 font-mono text-[10px] uppercase block">Pipeline Status</span>
              <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase ${
                studentStatus === 'Payment Rejected' ? 'bg-red-500/20 text-red-300 border border-red-500/40' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              }`}>
                {studentStatus}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase text-amber-400 font-bold tracking-wider">Student Journey Checklist</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              <div className="flex items-center gap-2 text-green-300 bg-black/20 p-2.5 rounded-xl border border-green-500/20">
                <CheckCircle2 size={16} className="text-green-400 shrink-0" />
                <span>1. Student Registration Submitted</span>
              </div>
              <div className="flex items-center gap-2 text-green-300 bg-black/20 p-2.5 rounded-xl border border-green-500/20">
                <CheckCircle2 size={16} className="text-green-400 shrink-0" />
                <span>2. Staff Registration Review & Approval</span>
              </div>
              <div className="flex items-center gap-2 text-green-300 bg-black/20 p-2.5 rounded-xl border border-green-500/20">
                <CheckCircle2 size={16} className="text-green-400 shrink-0" />
                <span>3. Course Selected ({currentUser?.enrolledInstrument || 'Begena'})</span>
              </div>
              <div className={`flex items-center gap-2 p-2.5 rounded-xl border ${
                studentStatus === 'Payment Rejected'
                  ? 'text-red-300 bg-red-900/30 border-red-500/40'
                  : 'text-amber-200 bg-black/20 border-amber-500/30'
              }`}>
                {studentStatus === 'Payment Rejected' ? (
                  <ShieldAlert size={16} className="text-red-400 shrink-0" />
                ) : (
                  <CreditCard size={16} className="text-amber-400 shrink-0 animate-bounce" />
                )}
                <span>4. Payment Submitted & Accountant Review</span>
              </div>
              <div className="sm:col-span-2 flex items-center gap-2 text-gray-400 bg-black/20 p-2.5 rounded-xl border border-white/10">
                <Clock size={16} className="shrink-0 text-amber-400" />
                <span>5. Accountant Approval → Enrollment Activated & Classroom Unlocked</span>
              </div>
            </div>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="relative z-10 flex flex-wrap items-center gap-3 pt-2">
          <Button
            variant="primary"
            size="md"
            onClick={() => onNavigate('student-registration')}
            className="flex items-center gap-2"
          >
            <CreditCard size={16} />
            <span>Complete Registration & Upload Receipt</span>
            <ArrowRight size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
}

