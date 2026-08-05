import React from 'react';
import { Crown, Sparkles, TrendingUp, Users, DollarSign, Award, Building2, Music, CheckCircle2, ShieldCheck, ArrowRight, Activity } from 'lucide-react';

interface FounderPresentationModeProps {
  onNavigate?: (page: string) => void;
}

export const FounderPresentationMode: React.FC<FounderPresentationModeProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Executive Welcome Banner */}
      <div className="bg-gradient-to-r from-amber-950 via-stone-900 to-amber-900 text-amber-50 rounded-2xl p-8 border border-amber-800 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-amber-800/80 rounded-full text-xs font-bold text-amber-200 border border-amber-700">
              <Crown className="w-4 h-4 text-amber-300" /> Abel Begena School Executive Command Center
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Welcome, Founder Abel Girma
            </h1>
            <p className="text-xs text-amber-200 max-w-2xl leading-relaxed">
              The digital ecosystem is fully integrated across all 3 physical branches (Piazza, Megenagna, Lebu) and our global online learning studio.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => onNavigate?.('qa-launch-center')}
              className="bg-amber-800 hover:bg-amber-900 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-amber-300" /> QA Launch Checklist
            </button>
            <button
              onClick={() => onNavigate?.('founder-dashboard')}
              className="bg-stone-800 hover:bg-stone-700 text-amber-200 px-5 py-2.5 rounded-xl text-xs font-bold transition-all border border-amber-800/60 flex items-center gap-2 cursor-pointer"
            >
              Command Center Analytics <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* High-Level Executive Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-amber-100 shadow-sm space-y-1">
          <div className="flex justify-between items-center text-xs font-bold text-neutral-500">
            <span>Total Enrolled Students</span>
            <Users className="w-4 h-4 text-amber-700" />
          </div>
          <div className="text-2xl font-extrabold text-neutral-900">1,452</div>
          <p className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +18.4% vs last term
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-amber-100 shadow-sm space-y-1">
          <div className="flex justify-between items-center text-xs font-bold text-neutral-500">
            <span>YTD Total Revenue</span>
            <DollarSign className="w-4 h-4 text-amber-700" />
          </div>
          <div className="text-2xl font-extrabold text-neutral-900">ETB 4.28M</div>
          <p className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> 98.4% payment approval
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-amber-100 shadow-sm space-y-1">
          <div className="flex justify-between items-center text-xs font-bold text-neutral-500">
            <span>Active Physical Branches</span>
            <Building2 className="w-4 h-4 text-amber-700" />
          </div>
          <div className="text-2xl font-extrabold text-neutral-900">3 Branches</div>
          <p className="text-[10px] text-neutral-600 font-bold">Piazza, Megenagna, Lebu</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-amber-100 shadow-sm space-y-1">
          <div className="flex justify-between items-center text-xs font-bold text-neutral-500">
            <span>Graduation Certificates</span>
            <Award className="w-4 h-4 text-amber-700" />
          </div>
          <div className="text-2xl font-extrabold text-neutral-900">894 Issued</div>
          <p className="text-[10px] text-amber-800 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-amber-600" /> 100% QR Verified
          </p>
        </div>
      </div>

      {/* Strategic Ecosystem Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-amber-100 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-900 flex items-center justify-center font-bold">
            <Music className="w-5 h-5" />
          </div>
          <h3 className="font-extrabold text-neutral-900 text-base">Begena Cultural Heritage LMS</h3>
          <p className="text-xs text-neutral-600 leading-relaxed">
            Students learn authentic Begena tuning, history, finger placements, and sacred Mezmur notation with our interactive audio-visual practice tuner and AI tutor.
          </p>
          <button
            onClick={() => onNavigate?.('practice-studio')}
            className="text-xs font-bold text-amber-900 hover:underline flex items-center gap-1 pt-1 cursor-pointer"
          >
            Launch Practice Studio <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-amber-100 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-900 flex items-center justify-center font-bold">
            <Activity className="w-5 h-5" />
          </div>
          <h3 className="font-extrabold text-neutral-900 text-base">Unified Single Source of Truth</h3>
          <p className="text-xs text-neutral-600 leading-relaxed">
            One central identity connects student registration, Telebirr/CBE payments, attendance logs, LMS progress, family accounts, and official QR certificates.
          </p>
          <button
            onClick={() => onNavigate?.('settings-users')}
            className="text-xs font-bold text-emerald-900 hover:underline flex items-center gap-1 pt-1 cursor-pointer"
          >
            Manage User Matrix <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-amber-100 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-900 flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="font-extrabold text-neutral-900 text-base">Media Vault & Gallery System</h3>
          <p className="text-xs text-neutral-600 leading-relaxed">
            Upload, organize into custom categories, publish/unpublish, and edit photo assets dynamically across all 8 core school sections.
          </p>
          <button
            onClick={() => onNavigate?.('admin-portal')}
            className="text-xs font-bold text-amber-900 hover:underline flex items-center gap-1 pt-1 cursor-pointer"
          >
            Open Founder Media Vault <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-amber-100 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-900 flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="font-extrabold text-neutral-900 text-base">AI Strategic Founder Intelligence</h3>
          <p className="text-xs text-neutral-600 leading-relaxed">
            Real-time automated insight generation for course capacity forecasting, branch revenue balancing, and automated teacher schedule optimization.
          </p>
          <button
            onClick={() => onNavigate?.('founder-ai')}
            className="text-xs font-bold text-amber-900 hover:underline flex items-center gap-1 pt-1 cursor-pointer"
          >
            Consult Founder AI <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};

