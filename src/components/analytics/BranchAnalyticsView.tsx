import React, { useState } from 'react';
import {
  Building2,
  TrendingUp,
  Users,
  Calendar,
  BookOpen,
  PieChart,
  BarChart3,
  DollarSign,
  AlertCircle
} from 'lucide-react';
import { Language } from '../../types';
import { Button } from '../InteractiveComponents';
import { TiletPattern } from '../TiletPattern';

interface BranchAnalyticsViewProps {
  lang: Language;
  onNavigate: (page: string, params?: any) => void;
}

export function BranchAnalyticsView({ lang, onNavigate }: BranchAnalyticsViewProps) {
  const [selectedBranch, setSelectedBranch] = useState<'Piazza Campus' | 'Megenagna Campus' | 'Lebu Campus'>('Piazza Campus');
  const [timeRange, setTimeRange] = useState<'This Month' | 'Previous Month' | 'This Year'>('This Month');

  // Branch Course Performance Data
  const coursePerformance = [
    { name: 'Begena (10-String Sacred Harp)', enrolled: 220, active: 210, completion: 88, dropout: 3, attendance: 94 },
    { name: 'Krar (Traditional Lyre)', enrolled: 140, active: 132, completion: 82, dropout: 4, attendance: 91 },
    { name: 'Masenqo (Single-String Fiddle)', enrolled: 85, active: 80, completion: 79, dropout: 5, attendance: 89 },
    { name: 'Washint (Bamboo Flute)', enrolled: 45, active: 42, completion: 85, dropout: 2, attendance: 92 },
    { name: 'Vocal (Zema & Liturgical Cantillations)', enrolled: 30, active: 28, completion: 90, dropout: 1, attendance: 95 },
    { name: 'Kebero (Traditional Ceremonial Drum)', enrolled: 20, active: 18, completion: 85, dropout: 2, attendance: 88 }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      {/* HEADER BANNER */}
      <div className="bg-[#2B2B2B] text-white p-6 sm:p-8 rounded-3xl relative overflow-hidden shadow-xl border border-amber-950/40">
        <TiletPattern className="opacity-15 text-[#E89B52] scale-125" />
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E89B52]/20 border border-[#E89B52]/40 text-[#E89B52] text-xs font-bold uppercase tracking-widest">
            <Building2 size={14} className="text-[#E89B52]" />
            <span>Campus Operational & Growth Analytics</span>
          </div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-white tracking-wide uppercase">
            BRANCH MANAGEMENT & PERFORMANCE ANALYTICS
          </h1>
          <p className="text-xs sm:text-sm text-gray-300">
            Monitor branch student retention, attendance rates, classroom capacity utilization, and course performance comparison.
          </p>
        </div>
      </div>

      {/* BRANCH SELECTOR BAR */}
      <div className="bg-white border border-[#E7DED1] rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-gray-600">Select Campus:</span>
          {(['Piazza Campus', 'Megenagna Campus', 'Lebu Campus'] as const).map((b) => (
            <button
              key={b}
              onClick={() => setSelectedBranch(b)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                selectedBranch === b ? 'bg-[#2B2B2B] text-white' : 'bg-[#FAF6EF] text-gray-700 hover:bg-[#E7DED1]'
              }`}
            >
              {b}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-gray-600">Period:</span>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="p-1.5 bg-[#FAF6EF] border border-[#E7DED1] rounded-xl text-xs font-bold text-[#2B2B2B]"
          >
            <option value="This Month">This Month (July 2026)</option>
            <option value="Previous Month">Previous Month (June 2026)</option>
            <option value="This Year">This Year (2026)</option>
          </select>
        </div>
      </div>

      {/* METRIC CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-[#E7DED1] p-4 rounded-2xl space-y-1 shadow-xs">
          <span className="text-[10px] text-gray-500 font-mono uppercase block">Total Students ({selectedBranch})</span>
          <span className="font-display font-black text-2xl text-[#2B2B2B]">
            {selectedBranch === 'Piazza Campus' ? '540' : selectedBranch === 'Megenagna Campus' ? '380' : '180'}
          </span>
          <span className="text-[10px] text-emerald-700 font-bold block">+14.2% Growth MoM</span>
        </div>

        <div className="bg-white border border-[#E7DED1] p-4 rounded-2xl space-y-1 shadow-xs">
          <span className="text-[10px] text-gray-500 font-mono uppercase block">Attendance Rate</span>
          <span className="font-display font-black text-2xl text-emerald-700">93.2%</span>
          <span className="text-[10px] text-gray-500 font-bold block">1.8% Absence • 5.0% Late</span>
        </div>

        <div className="bg-white border border-[#E7DED1] p-4 rounded-2xl space-y-1 shadow-xs">
          <span className="text-[10px] text-gray-500 font-mono uppercase block">Room Capacity Utilization</span>
          <span className="font-display font-black text-2xl text-[#E89B52]">88%</span>
          <span className="text-[10px] text-amber-800 font-bold block">Peak Hours 10:00 - 12:00</span>
        </div>

        <div className="bg-white border border-[#E7DED1] p-4 rounded-2xl space-y-1 shadow-xs">
          <span className="text-[10px] text-gray-500 font-mono uppercase block">Course Completion Rate</span>
          <span className="font-display font-black text-2xl text-[#2B2B2B]">86.5%</span>
          <span className="text-[10px] font-bold text-gray-500 block">Graduation Ready</span>
        </div>
      </div>

      {/* COURSE PERFORMANCE BREAKDOWN MATRIX */}
      <div className="bg-white border border-[#E7DED1] rounded-3xl p-6 space-y-4 shadow-xs">
        <h3 className="font-display font-black text-base text-[#2B2B2B] uppercase">TRADITIONAL INSTRUMENT COURSE COMPARISON</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border border-[#E7DED1] rounded-2xl overflow-hidden">
            <thead className="bg-[#FAF6EF] text-[#2B2B2B] font-bold uppercase border-b border-[#E7DED1]">
              <tr>
                <th className="p-3">Instrument Course</th>
                <th className="p-3">Total Enrolled</th>
                <th className="p-3">Active Learners</th>
                <th className="p-3">Completion Rate</th>
                <th className="p-3">Attendance Rate</th>
                <th className="p-3">Dropout %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7DED1]">
              {coursePerformance.map((c) => (
                <tr key={c.name} className="hover:bg-amber-50/50">
                  <td className="p-3 font-bold text-[#2B2B2B]">{c.name}</td>
                  <td className="p-3 font-mono">{c.enrolled}</td>
                  <td className="p-3 font-mono font-bold text-emerald-800">{c.active}</td>
                  <td className="p-3 font-mono">{c.completion}%</td>
                  <td className="p-3 font-mono font-bold text-emerald-700">{c.attendance}%</td>
                  <td className="p-3 font-mono text-gray-600">{c.dropout}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

