import React, { useState } from 'react';
import {
  User,
  BookOpen,
  Award,
  Clock,
  CheckCircle,
  Calendar,
  MessageSquare,
  Lock,
  ChevronRight,
  Flame,
  ShieldCheck
} from 'lucide-react';
import { motion } from 'motion/react';
import { Language } from '../types';
import { TiletPattern } from './TiletPattern';

interface ParentLearningViewProps {
  lang: Language;
  onNavigate: (page: string, params?: any) => void;
}

export function ParentLearningView({ lang, onNavigate }: ParentLearningViewProps) {
  const [selectedChild, setSelectedChild] = useState('Yonas Tadesse');

  return (
    <div className="space-y-8 pb-16">
      {/* HEADER BANNER */}
      <div className="bg-[#2B2B2B] text-white p-6 sm:p-8 rounded-3xl relative overflow-hidden shadow-xl border border-amber-950/40">
        <TiletPattern className="opacity-15 text-[#E89B52] scale-125" />
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E89B52]/20 border border-[#E89B52]/40 text-[#E89B52] text-xs font-bold uppercase tracking-widest">
            <Lock size={14} />
            <span>Read-Only Parent Learning Monitor</span>
          </div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-white tracking-wide">
            PARENT LMS PROGRESS CENTER
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 max-w-2xl leading-relaxed">
            Monitor your child's musical progress, practice studio logs, teacher evaluation feedback, and official certificates.
          </p>
        </div>
      </div>

      {/* CHILD SELECTOR */}
      <div className="bg-white border border-[#E7DED1] p-6 rounded-3xl space-y-4 shadow-xs">
        <div className="flex items-center gap-3">
          <User className="text-[#E89B52]" size={20} />
          <span className="text-xs font-bold text-gray-600 uppercase">Select Child:</span>
          <select
            className="p-2.5 bg-[#FAF6EF] border border-[#E7DED1] rounded-xl text-xs font-bold"
            value={selectedChild}
            onChange={(e) => setSelectedChild(e.target.value)}
          >
            <option value="Yonas Tadesse">Yonas Tadesse (Begena Level 1)</option>
          </select>
        </div>
      </div>

      {/* DASHBOARD STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-5 bg-white border border-[#E7DED1] rounded-2xl space-y-1">
          <span className="text-[10px] font-bold text-gray-500 uppercase block">Course Progress</span>
          <div className="font-display font-black text-2xl text-[#2B2B2B]">75%</div>
          <span className="text-[10px] text-green-600 font-bold">On track for graduation</span>
        </div>

        <div className="p-5 bg-white border border-[#E7DED1] rounded-2xl space-y-1">
          <span className="text-[10px] font-bold text-gray-500 uppercase block">Practice Studio Streak</span>
          <div className="font-display font-black text-2xl text-amber-600 flex items-center gap-1">
            <Flame size={20} />
            <span>14 Days</span>
          </div>
          <span className="text-[10px] text-gray-500">185 Mins this week</span>
        </div>

        <div className="p-5 bg-white border border-[#E7DED1] rounded-2xl space-y-1">
          <span className="text-[10px] font-bold text-gray-500 uppercase block">Class Attendance</span>
          <div className="font-display font-black text-2xl text-green-700">100%</div>
          <span className="text-[10px] text-gray-500">Bole Branch & Online</span>
        </div>

        <div className="p-5 bg-white border border-[#E7DED1] rounded-2xl space-y-1">
          <span className="text-[10px] font-bold text-gray-500 uppercase block">Teacher Feedback Score</span>
          <div className="font-display font-black text-2xl text-[#E89B52]">92 / 100</div>
          <span className="text-[10px] text-gray-500">Evaluated by Abel Begena</span>
        </div>
      </div>

      {/* TEACHER FEEDBACK SUMMARY */}
      <div className="bg-white border border-[#E7DED1] p-6 rounded-3xl space-y-4 shadow-xs">
        <h3 className="font-display font-black text-sm uppercase text-[#2B2B2B] tracking-wide flex items-center gap-2">
          <MessageSquare className="text-[#E89B52]" size={18} />
          <span>Latest Teacher Evaluation (July 20, 2026)</span>
        </h3>
        <p className="text-xs text-gray-700 leading-relaxed italic bg-[#FAF6EF] p-4 rounded-2xl border border-[#E7DED1]">
          "Yonas is demonstrating exceptional discipline with his Begena practice! His left thumb placement is steady and his string tuning is remarkably accurate. Keep encouraging his daily 30-minute sessions."
        </p>
        <span className="text-[10px] font-bold text-gray-500 block text-right">— Teacher Abel Begena</span>
      </div>
    </div>
  );
}

