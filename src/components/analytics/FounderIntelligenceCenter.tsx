import React, { useState } from 'react';
import {
  Crown,
  Building2,
  TrendingUp,
  DollarSign,
  Users,
  Award,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Search,
  ShieldAlert,
  ArrowUpRight,
  PieChart,
  BookOpen
} from 'lucide-react';
import { Language } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../InteractiveComponents';
import { TiletPattern } from '../TiletPattern';
import { SAMPLE_OPERATIONAL_ALERTS } from './AnalyticsData';

interface FounderIntelligenceCenterProps {
  lang: Language;
  onNavigate: (page: string, params?: any) => void;
}

export function FounderIntelligenceCenter({ lang, onNavigate }: FounderIntelligenceCenterProps) {
  const { currentUser } = useAuth();
  const [selectedBranchTab, setSelectedBranchTab] = useState<'All' | 'Piazza' | 'Megenagna' | 'Lebu'>('All');

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20">
      {/* HEADER BANNER */}
      <div className="bg-[#2B2B2B] text-white p-6 sm:p-8 rounded-3xl relative overflow-hidden shadow-xl border border-amber-950/40">
        <TiletPattern className="opacity-15 text-[#E89B52] scale-125" />
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E89B52]/20 border border-[#E89B52]/40 text-[#E89B52] text-xs font-bold uppercase tracking-widest">
            <Crown size={14} className="text-[#E89B52]" />
            <span>Executive Founder Intelligence Portal</span>
          </div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-white tracking-wide uppercase">
            LIORA BEGENA SCHOOL FOUNDER INTELLIGENCE CENTER
          </h1>
          <p className="text-xs sm:text-sm text-gray-300">
            Real-time strategic operational health, cross-branch performance comparisons, total academy revenue streams, and AI-assisted insights.
          </p>
        </div>
      </div>

      {/* EXECUTIVE KPI SUMMARY CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <div className="bg-white border border-[#E7DED1] p-4 rounded-2xl space-y-1 shadow-xs">
          <span className="text-[10px] text-gray-500 font-mono uppercase block">Active Students</span>
          <span className="font-display font-black text-2xl text-[#2B2B2B]">1,280</span>
          <span className="text-[10px] text-emerald-700 font-bold block">+14.2% MoM Expansion</span>
        </div>

        <div className="bg-white border border-[#E7DED1] p-4 rounded-2xl space-y-1 shadow-xs">
          <span className="text-[10px] text-gray-500 font-mono uppercase block">Monthly Revenue</span>
          <span className="font-display font-black text-2xl text-emerald-700">820,000 ETB</span>
          <span className="text-[10px] text-emerald-700 font-bold block">+18.5% MoM Surge</span>
        </div>

        <div className="bg-white border border-[#E7DED1] p-4 rounded-2xl space-y-1 shadow-xs">
          <span className="text-[10px] text-gray-500 font-mono uppercase block">Physical Campus</span>
          <span className="font-display font-black text-2xl text-[#2B2B2B]">1 Main Branch</span>
          <span className="text-[10px] text-gray-500 block">Hawassa (Center Point Tower)</span>
        </div>

        <div className="bg-white border border-[#E7DED1] p-4 rounded-2xl space-y-1 shadow-xs">
          <span className="text-[10px] text-gray-500 font-mono uppercase block">Overall Attendance</span>
          <span className="font-display font-black text-2xl text-[#E89B52]">91.4%</span>
          <span className="text-[10px] text-gray-500 block">Hawassa Campus Average</span>
        </div>

        <div className="bg-white border border-[#E7DED1] p-4 rounded-2xl space-y-1 shadow-xs col-span-2 lg:col-span-1">
          <span className="text-[10px] text-gray-500 font-mono uppercase block">Store Instrument Sales</span>
          <span className="font-display font-black text-2xl text-[#2B2B2B]">245,000 ETB</span>
          <span className="text-[10px] text-emerald-700 font-bold block">35 Begenas Sold</span>
        </div>
      </div>

      {/* QUICK LINKS TO AI INSIGHTS & REPORT BUILDER */}
      <div className="bg-gradient-to-r from-[#2B2B2B] to-[#3D3D3D] text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-md">
        <div className="space-y-1 max-w-xl">
          <div className="flex items-center gap-2 text-xs font-bold text-[#E89B52] uppercase">
            <Sparkles size={16} />
            <span>AI Strategic Assistant & Custom Report Builder</span>
          </div>
          <h3 className="font-display font-black text-xl">ASK NATURAL LANGUAGE QUESTIONS & BUILD CUSTOM AUDITS</h3>
          <p className="text-xs text-gray-300">
            Query school metrics directly or construct multi-branch PDF/Excel financial reports with data drill-downs.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Button variant="primary" size="md" onClick={() => onNavigate('analytics-insights')} className="flex items-center gap-2">
            <Sparkles size={16} />
            <span>Open AI Insights</span>
          </Button>
          <Button variant="secondary" size="md" onClick={() => onNavigate('reports-builder')} className="bg-white/10 hover:bg-white/20 text-white border-white/20">
            Report Builder
          </Button>
        </div>
      </div>

      {/* BRANCH COMPARISON MATRIX */}
      <div className="bg-white border border-[#E7DED1] rounded-3xl p-6 space-y-4 shadow-xs">
        <h3 className="font-display font-black text-base text-[#2B2B2B] uppercase">CAMPUS GROWTH & REVENUE MATRIX</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { branch: 'Piazza Campus (Main Workshop)', students: 540, growth: '+11.2%', revenue: '410,000 ETB', attendance: '93.2%', capacity: '92%' },
            { branch: 'Megenagna Campus', students: 380, growth: '+18.5%', revenue: '260,000 ETB', attendance: '89.8%', capacity: '95%' },
            { branch: 'Lebu Campus', students: 180, growth: '+8.4%', revenue: '150,000 ETB', attendance: '91.0%', capacity: '72%' }
          ].map((b) => (
            <div key={b.branch} className="p-5 bg-[#FAF6EF] border border-[#E7DED1] rounded-2xl space-y-3 text-xs">
              <div className="flex justify-between items-center border-b border-[#E7DED1] pb-2">
                <span className="font-bold text-[#2B2B2B]">{b.branch}</span>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded-full text-[10px]">
                  {b.growth} Growth
                </span>
              </div>

              <div className="space-y-1.5 font-mono">
                <div className="flex justify-between">
                  <span className="text-gray-500">Active Students:</span>
                  <span className="font-bold text-[#2B2B2B]">{b.students} Students</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Monthly Revenue:</span>
                  <span className="font-bold text-emerald-700">{b.revenue}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Attendance Rate:</span>
                  <span className="font-bold text-[#2B2B2B]">{b.attendance}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Room Utilization:</span>
                  <span className="font-bold text-[#E89B52]">{b.capacity} Utilization</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* OPERATIONAL ALERTS CENTER */}
      <div className="bg-white border border-[#E7DED1] rounded-3xl p-6 space-y-4 shadow-xs">
        <h3 className="font-display font-black text-base text-[#2B2B2B] uppercase">OPERATIONAL ALERTS & ACTION CENTER</h3>

        <div className="space-y-3">
          {SAMPLE_OPERATIONAL_ALERTS.map((alt) => (
            <div key={alt.id} className="p-4 bg-[#FAF6EF] border border-[#E7DED1] rounded-2xl text-xs space-y-1">
              <div className="flex justify-between items-center font-bold">
                <span className="text-[#2B2B2B]">{alt.title}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  alt.type === 'Critical'
                    ? 'bg-red-100 text-red-800'
                    : alt.type === 'Warning'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {alt.type}
                </span>
              </div>
              <p className="text-gray-600">{alt.description}</p>
              {alt.actionRequired && (
                <div className="pt-1 text-[#E89B52] font-bold text-[11px]">
                  Action Needed: {alt.actionRequired}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

