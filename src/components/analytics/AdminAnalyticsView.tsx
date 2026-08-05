import React, { useState } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  TrendingUp,
  Users,
  CheckCircle2,
  BookOpen,
  PieChart,
  BarChart3,
  Search,
  Filter,
  Eye,
  UserCheck
} from 'lucide-react';
import { Language, AtRiskStudentSignal } from '../../types';
import { Button } from '../InteractiveComponents';
import { TiletPattern } from '../TiletPattern';
import { SAMPLE_AT_RISK_SIGNALS } from './AnalyticsData';

interface AdminAnalyticsViewProps {
  lang: Language;
  onNavigate: (page: string, params?: any) => void;
}

export function AdminAnalyticsView({ lang, onNavigate }: AdminAnalyticsViewProps) {
  const [atRiskList, setAtRiskList] = useState<AtRiskStudentSignal[]>(SAMPLE_AT_RISK_SIGNALS);
  const [activeTab, setActiveTab] = useState<'overview' | 'retention' | 'at-risk' | 'capacity'>('overview');

  const handleReviewSignal = (id: string, notes: string) => {
    setAtRiskList(
      atRiskList.map((item) => (item.id === id ? { ...item, reviewedByStaff: true, notes } : item))
    );
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      {/* HEADER BANNER */}
      <div className="bg-[#2B2B2B] text-white p-6 sm:p-8 rounded-3xl relative overflow-hidden shadow-xl border border-amber-950/40">
        <TiletPattern className="opacity-15 text-[#E89B52] scale-125" />
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E89B52]/20 border border-[#E89B52]/40 text-[#E89B52] text-xs font-bold uppercase tracking-widest">
            <ShieldCheck size={14} className="text-[#E89B52]" />
            <span>School-Wide Administrative Analytics & Retention Engine</span>
          </div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-white tracking-wide uppercase">
            ADMINISTRATIVE SCHOOL & RETENTION ANALYTICS
          </h1>
          <p className="text-xs sm:text-sm text-gray-300">
            Monitor student lifecycle trends, automated at-risk signal detections, capacity forecasts, and course retention metrics.
          </p>
        </div>
      </div>

      {/* SUB-NAVIGATION TABS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-[#E7DED1]">
        {[
          { id: 'overview', label: 'School-Wide Overview', icon: Users },
          { id: 'retention', label: 'Student Retention Trends', icon: TrendingUp },
          { id: 'at-risk', label: 'At-Risk Detection Engine', icon: AlertTriangle },
          { id: 'capacity', label: 'Capacity & Demand Forecasting', icon: BarChart3 }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#2B2B2B] text-white shadow-xs'
                  : 'bg-[#FAF6EF] text-gray-700 hover:bg-[#E7DED1]'
              }`}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: SCHOOL-WIDE OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white border border-[#E7DED1] p-4 rounded-2xl space-y-1 shadow-xs">
              <span className="text-[10px] text-gray-500 font-mono uppercase block">Total Enrolled Students</span>
              <span className="font-display font-black text-2xl text-[#2B2B2B]">1,280</span>
              <span className="text-[10px] text-emerald-700 font-bold block">+14.2% MoM Expansion</span>
            </div>

            <div className="bg-white border border-[#E7DED1] p-4 rounded-2xl space-y-1 shadow-xs">
              <span className="text-[10px] text-gray-500 font-mono uppercase block">Active Instructors</span>
              <span className="font-display font-black text-2xl text-[#2B2B2B]">24 Teachers</span>
              <span className="text-[10px] text-gray-500 block">3 Campuses + Online</span>
            </div>

            <div className="bg-white border border-[#E7DED1] p-4 rounded-2xl space-y-1 shadow-xs">
              <span className="text-[10px] text-gray-500 font-mono uppercase block">Average Retention Rate</span>
              <span className="font-display font-black text-2xl text-emerald-700">91.8%</span>
              <span className="text-[10px] text-gray-500 font-bold block">Top 5% Music Academy Benchmark</span>
            </div>

            <div className="bg-white border border-[#E7DED1] p-4 rounded-2xl space-y-1 shadow-xs">
              <span className="text-[10px] text-gray-500 font-mono uppercase block">Certificates Awarded</span>
              <span className="font-display font-black text-2xl text-[#E89B52]">420 Graduates</span>
              <span className="text-[10px] text-gray-500 block">Begena & Krar Mastery</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: AT-RISK DETECTION ENGINE */}
      {activeTab === 'at-risk' && (
        <div className="bg-white border border-[#E7DED1] rounded-3xl p-6 space-y-6 shadow-xs">
          <div className="flex justify-between items-center pb-3 border-b border-[#E7DED1]">
            <div>
              <h3 className="font-display font-black text-base text-[#2B2B2B] uppercase">AUTOMATED AT-RISK DETECTION ENGINE</h3>
              <p className="text-xs text-gray-500">
                Signals combine attendance drops, practice inactivity, and delayed assignments. Final human review required before status changes.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {atRiskList.map((sig) => (
              <div key={sig.id} className="p-5 bg-[#FAF6EF] border border-[#E7DED1] rounded-2xl space-y-3 text-xs">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div className="space-y-0.5">
                    <span className="font-bold text-sm text-[#2B2B2B]">{sig.studentName}</span>
                    <span className="text-[11px] text-gray-600 block">{sig.courseName} • {sig.branchName}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 bg-red-100 text-red-900 font-bold rounded-full text-[10px]">
                      Risk Level: {sig.riskLevel} ({sig.confidenceScore}% Signal Confidence)
                    </span>
                    {sig.reviewedByStaff ? (
                      <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-bold rounded-full text-[10px]">
                        ✓ Staff Reviewed
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 bg-amber-100 text-amber-800 font-bold rounded-full text-[10px]">
                        Pending Staff Review
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-3 bg-white rounded-xl border space-y-1">
                  <span className="font-bold text-gray-700 block">Detected Behavioral Signals:</span>
                  <ul className="list-disc list-inside text-gray-600 space-y-0.5">
                    {sig.signals.map((s, idx) => (
                      <li key={idx}>{s}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-1">
                  <span className="font-bold text-amber-900 block">Recommended Staff Action:</span>
                  <p className="text-amber-950">{sig.recommendedAction}</p>
                </div>

                {!sig.reviewedByStaff && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleReviewSignal(sig.id, 'Staff check-in completed. Outreach scheduled.')}
                  >
                    Confirm Human Review & Log Action
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

