import React, { useState } from 'react';
import {
  GraduationCap,
  Award,
  Clock,
  Flame,
  CheckCircle2,
  BookOpen,
  Calendar,
  DollarSign,
  FileText,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  AlertCircle,
  BarChart3,
  Download,
  Target
} from 'lucide-react';
import { motion } from 'motion/react';
import { Language, StudentSkillProgressItem } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../InteractiveComponents';
import { TiletPattern } from '../TiletPattern';
import { SAMPLE_STUDENT_SKILLS } from './AnalyticsData';

interface StudentAnalyticsViewProps {
  lang: Language;
  onNavigate: (page: string, params?: any) => void;
}

export function StudentAnalyticsView({ lang, onNavigate }: StudentAnalyticsViewProps) {
  const { currentUser } = useAuth();
  const [skillsList, setSkillsList] = useState<StudentSkillProgressItem[]>(SAMPLE_STUDENT_SKILLS);
  const [activeTab, setActiveTab] = useState<'progress' | 'practice' | 'skills' | 'attendance' | 'finances'>('progress');

  // Metrics calculation
  const masteredSkills = skillsList.filter((s) => s.status === 'Mastered').length;
  const totalSkills = skillsList.length;
  const skillPercent = Math.round((masteredSkills / totalSkills) * 100);

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      {/* HEADER BANNER */}
      <div className="bg-[#2B2B2B] text-white p-6 sm:p-8 rounded-3xl relative overflow-hidden shadow-xl border border-amber-950/40">
        <TiletPattern className="opacity-15 text-[#E89B52] scale-125" />
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E89B52]/20 border border-[#E89B52]/40 text-[#E89B52] text-xs font-bold uppercase tracking-widest">
            <GraduationCap size={14} className="text-[#E89B52]" />
            <span>Student Personal Learning & Practice Analytics</span>
          </div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-white tracking-wide uppercase">
            MY LEARNING & PRACTICE PERFORMANCE
          </h1>
          <p className="text-xs sm:text-sm text-gray-300">
            Track your Begena mastery, practice streaks, skill badges, attendance record, and personal school invoices.
          </p>
        </div>
      </div>

      {/* TOP KPI HIGHLIGHT CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-[#E7DED1] p-4 rounded-2xl space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-[10px] font-mono uppercase">Overall Progress</span>
            <TrendingUp size={14} className="text-emerald-600" />
          </div>
          <span className="font-display font-black text-2xl text-[#2B2B2B]">78%</span>
          <span className="text-[10px] text-emerald-700 font-bold block">Begena Level 1 • On Track</span>
        </div>

        <div className="bg-white border border-[#E7DED1] p-4 rounded-2xl space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-[10px] font-mono uppercase">Practice Streak</span>
            <Flame size={14} className="text-amber-500" />
          </div>
          <span className="font-display font-black text-2xl text-[#E89B52]">14 Days</span>
          <span className="text-[10px] text-gray-500 font-bold block">Personal Best Streak!</span>
        </div>

        <div className="bg-white border border-[#E7DED1] p-4 rounded-2xl space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-[10px] font-mono uppercase">Attendance Rate</span>
            <CheckCircle2 size={14} className="text-emerald-600" />
          </div>
          <span className="font-display font-black text-2xl text-emerald-700">96%</span>
          <span className="text-[10px] text-gray-500 font-bold block">24 / 25 Classes Attended</span>
        </div>

        <div className="bg-white border border-[#E7DED1] p-4 rounded-2xl space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-[10px] font-mono uppercase">Mastered Skills</span>
            <Award size={14} className="text-amber-600" />
          </div>
          <span className="font-display font-black text-2xl text-[#2B2B2B]">{masteredSkills} / {totalSkills}</span>
          <span className="text-[10px] text-gray-500 font-bold block">{skillPercent}% Skills Confirmed</span>
        </div>
      </div>

      {/* ANALYTICS SUB-NAVIGATION TABS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-[#E7DED1]">
        {[
          { id: 'progress', label: 'Overall Progress', icon: GraduationCap },
          { id: 'practice', label: 'Practice Analytics', icon: Clock },
          { id: 'skills', label: 'Skill Mastery Tracker', icon: Award },
          { id: 'attendance', label: 'Attendance Log', icon: Calendar },
          { id: 'finances', label: 'Payments & Receipts', icon: DollarSign }
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

      {/* TAB 1: OVERALL PROGRESS */}
      {activeTab === 'progress' && (
        <div className="space-y-6">
          <div className="bg-white border border-[#E7DED1] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
            <h3 className="font-display font-black text-base text-[#2B2B2B] uppercase">COURSE COMPLETION BREAKDOWN</h3>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-[#2B2B2B]">Begena Level 1: Sacred History, Tuning & Basic Mezmur</span>
                  <span className="text-[#E89B52]">78% Complete</span>
                </div>
                <div className="w-full h-3 bg-stone-100 rounded-full overflow-hidden p-0.5 border">
                  <div className="h-full bg-linear-to-r from-amber-600 to-[#E89B52] rounded-full" style={{ width: '78%' }} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-4 bg-[#FAF6EF] border border-[#E7DED1] rounded-2xl space-y-1">
                  <span className="text-[10px] text-gray-500 font-mono uppercase block">Completed Modules</span>
                  <span className="font-bold text-sm text-[#2B2B2B]">7 of 9 Modules</span>
                </div>
                <div className="p-4 bg-[#FAF6EF] border border-[#E7DED1] rounded-2xl space-y-1">
                  <span className="text-[10px] text-gray-500 font-mono uppercase block">Assignment Completion</span>
                  <span className="font-bold text-sm text-[#2B2B2B]">12 of 12 Submitted (100%)</span>
                </div>
                <div className="p-4 bg-[#FAF6EF] border border-[#E7DED1] rounded-2xl space-y-1">
                  <span className="text-[10px] text-gray-500 font-mono uppercase block">Teacher Grade Avg</span>
                  <span className="font-bold text-sm text-emerald-700">94 / 100 (A Grade)</span>
                </div>
              </div>
            </div>

            {/* TEACHER FEEDBACK SUMMARY */}
            <div className="p-5 bg-amber-50/60 border border-amber-200/60 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                <Sparkles size={16} className="text-[#E89B52]" />
                <span>Latest Teacher Feedback — Teacher Yared Tesfaye</span>
              </div>
              <p className="text-xs text-amber-950 italic">
                "Excellent precision on the buzzing string harmonics for Mezmur 'Kibre Kidehan'. Maintain left-hand relaxation during rapid plucking transitions."
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PRACTICE ANALYTICS */}
      {activeTab === 'practice' && (
        <div className="bg-white border border-[#E7DED1] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex justify-between items-center pb-3 border-b border-[#E7DED1]">
            <h3 className="font-display font-black text-base text-[#2B2B2B] uppercase">DIGITAL PRACTICE STUDIO METRICS</h3>
            <Button variant="primary" size="sm" onClick={() => onNavigate('practice')}>
              Launch Practice Studio
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-[#FAF6EF] border border-[#E7DED1] rounded-2xl space-y-1">
              <span className="text-[10px] text-gray-500 font-mono uppercase block">Today's Practice</span>
              <span className="font-display font-bold text-xl text-[#2B2B2B]">45 Mins</span>
            </div>
            <div className="p-4 bg-[#FAF6EF] border border-[#E7DED1] rounded-2xl space-y-1">
              <span className="text-[10px] text-gray-500 font-mono uppercase block">Weekly Total</span>
              <span className="font-display font-bold text-xl text-[#2B2B2B]">4.5 Hours</span>
            </div>
            <div className="p-4 bg-[#FAF6EF] border border-[#E7DED1] rounded-2xl space-y-1">
              <span className="text-[10px] text-gray-500 font-mono uppercase block">Average Session</span>
              <span className="font-display font-bold text-xl text-[#2B2B2B]">38 Mins</span>
            </div>
            <div className="p-4 bg-[#FAF6EF] border border-[#E7DED1] rounded-2xl space-y-1">
              <span className="text-[10px] text-gray-500 font-mono uppercase block">Consistency Score</span>
              <span className="font-display font-bold text-xl text-emerald-700">92%</span>
            </div>
          </div>

          {/* VISUAL WEEKLY PRACTICE BARS */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-[#2B2B2B] uppercase tracking-wider block">Weekly Practice Distribution</span>
            <div className="grid grid-cols-7 gap-2 h-32 items-end pt-4 bg-[#FAF6EF] p-4 rounded-2xl border border-[#E7DED1]">
              {[
                { day: 'Mon', mins: 45 },
                { day: 'Tue', mins: 30 },
                { day: 'Wed', mins: 60 },
                { day: 'Thu', mins: 40 },
                { day: 'Fri', mins: 50 },
                { day: 'Sat', mins: 90 },
                { day: 'Sun', mins: 45 }
              ].map((d) => (
                <div key={d.day} className="flex flex-col items-center gap-1 h-full justify-end">
                  <span className="text-[10px] font-mono font-bold text-[#E89B52]">{d.mins}m</span>
                  <div
                    className="w-full bg-[#2B2B2B] rounded-t-lg transition-all hover:bg-[#E89B52]"
                    style={{ height: `${(d.mins / 90) * 100}%` }}
                  />
                  <span className="text-[10px] font-bold text-gray-600">{d.day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SKILL MASTERY TRACKER */}
      {activeTab === 'skills' && (
        <div className="bg-white border border-[#E7DED1] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-[#E7DED1]">
            <div>
              <h3 className="font-display font-black text-base text-[#2B2B2B] uppercase">BEGENA SKILL MASTERY MATRIX</h3>
              <p className="text-xs text-gray-500">
                Note: Skills require explicit teacher verification before being marked as 'Mastered'.
              </p>
            </div>
            <span className="px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-bold">
              {masteredSkills} / {totalSkills} Skills Mastered
            </span>
          </div>

          <div className="space-y-3">
            {skillsList.map((skill) => (
              <div key={skill.id} className="p-4 bg-[#FAF6EF] border border-[#E7DED1] rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-stone-200 text-stone-800 rounded font-mono font-bold text-[10px]">
                      {skill.category}
                    </span>
                    <span className="font-bold text-[#2B2B2B]">{skill.skillName}</span>
                  </div>
                  <span className="text-[11px] text-gray-500 block">Course: {skill.courseName}</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-1 rounded-full font-bold text-[10px] ${
                    skill.status === 'Mastered'
                      ? 'bg-emerald-100 text-emerald-800'
                      : skill.status === 'Practicing'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-stone-200 text-stone-700'
                  }`}>
                    {skill.status}
                  </span>

                  {skill.confirmedByTeacher ? (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-white px-2 py-1 rounded-lg border">
                      <ShieldCheck size={12} />
                      <span>Verified by {skill.teacherName || 'Teacher'}</span>
                    </span>
                  ) : (
                    <span className="text-[10px] text-amber-800 italic bg-white px-2 py-1 rounded-lg border">
                      Awaiting Teacher Evaluation
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: ATTENDANCE LOG */}
      {activeTab === 'attendance' && (
        <div className="bg-white border border-[#E7DED1] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
          <h3 className="font-display font-black text-base text-[#2B2B2B] uppercase">CLASS ATTENDANCE LOG & ADVICE</h3>

          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-1 text-xs text-emerald-950">
            <span className="font-bold block">✓ Outstanding Attendance Recommendation</span>
            <p>
              "You have maintained 96% attendance this term! Your attendance improved by 15% compared to last month. Keep up this consistency for your upcoming recital evaluation."
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-bold text-center">
            <div className="p-3 bg-emerald-100 text-emerald-900 rounded-xl">24 Classes Present</div>
            <div className="p-3 bg-red-100 text-red-900 rounded-xl">1 Class Absent</div>
            <div className="p-3 bg-amber-100 text-amber-900 rounded-xl">0 Late</div>
            <div className="p-3 bg-blue-100 text-blue-900 rounded-xl">0 Excused</div>
          </div>
        </div>
      )}

      {/* TAB 5: PAYMENTS & RECEIPTS */}
      {activeTab === 'finances' && (
        <div className="bg-white border border-[#E7DED1] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
          <h3 className="font-display font-black text-base text-[#2B2B2B] uppercase">PERSONAL TUITION & REGISTRATION RECEIPTS</h3>

          <div className="space-y-3">
            {[
              { id: 'inv-101', title: 'Begena Level 1 Term 1 Tuition', amount: '1,500 ETB', date: '2026-06-01', status: 'Paid', ref: 'CBE-9912024' },
              { id: 'inv-102', title: 'Annual Student Registration Fee', amount: '300 ETB', date: '2026-06-01', status: 'Paid', ref: 'CBE-9912025' }
            ].map((inv) => (
              <div key={inv.id} className="p-4 bg-[#FAF6EF] border border-[#E7DED1] rounded-2xl flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-[#2B2B2B] block">{inv.title}</span>
                  <span className="font-mono text-gray-500 text-[10px]">TxRef: {inv.ref} • Date: {inv.date}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono font-black text-[#E89B52]">{inv.amount}</span>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-bold text-[10px]">
                    {inv.status}
                  </span>
                  <button className="p-1.5 bg-white border border-[#E7DED1] rounded-lg text-gray-700 hover:bg-stone-100 cursor-pointer">
                    <Download size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

