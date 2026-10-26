import React, { useState } from 'react';
import {
  BarChart3,
  Users,
  GraduationCap,
  Building2,
  DollarSign,
  ShieldCheck,
  Crown,
  Sparkles,
  FileText,
  Clock,
  ArrowRight
} from 'lucide-react';
import { Language, UserRole } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { StudentAnalyticsView } from './StudentAnalyticsView';
import { TeacherAnalyticsView } from './TeacherAnalyticsView';
import { BranchAnalyticsView } from './BranchAnalyticsView';
import { AccountantAnalyticsView } from './AccountantAnalyticsView';
import { AdminAnalyticsView } from './AdminAnalyticsView';
import { FounderIntelligenceCenter } from './FounderIntelligenceCenter';
import { AIInsightsAndAssistant } from './AIInsightsAndAssistant';
import { ReportBuilderView } from './ReportBuilderView';
import { TiletPattern } from '../TiletPattern';

interface AnalyticsCenterProps {
  lang: Language;
  onNavigate: (page: string, params?: any) => void;
  subPath?: string;
}

export function AnalyticsCenter({ lang, onNavigate, subPath }: AnalyticsCenterProps) {
  const { currentUser } = useAuth();
  const initialRole = currentUser?.role || 'founder';
  const [activeRoleView, setActiveRoleView] = useState<UserRole>(initialRole);

  // If subPath is specified in props, override view
  if (subPath === 'student/progress') {
    return <StudentAnalyticsView lang={lang} onNavigate={onNavigate} />;
  }
  if (subPath === 'teacher/analytics') {
    return <TeacherAnalyticsView lang={lang} onNavigate={onNavigate} />;
  }
  if (subPath === 'branch-manager/analytics') {
    return <BranchAnalyticsView lang={lang} onNavigate={onNavigate} />;
  }
  if (subPath === 'accountant/analytics') {
    return <AccountantAnalyticsView lang={lang} onNavigate={onNavigate} />;
  }
  if (subPath === 'admin/analytics') {
    return <AdminAnalyticsView lang={lang} onNavigate={onNavigate} />;
  }
  if (subPath === 'founder/intelligence') {
    return <FounderIntelligenceCenter lang={lang} onNavigate={onNavigate} />;
  }
  if (subPath === 'analytics/insights') {
    return <AIInsightsAndAssistant lang={lang} onNavigate={onNavigate} />;
  }
  if (subPath === 'reports/builder') {
    return <ReportBuilderView lang={lang} onNavigate={onNavigate} initialMode="builder" />;
  }
  if (subPath === 'reports/history') {
    return <ReportBuilderView lang={lang} onNavigate={onNavigate} initialMode="history" />;
  }

  // Render main analytics dashboard with role switcher & quick access modules
  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20">
      {/* HEADER BANNER */}
      <div className="bg-[#2B2B2B] text-white p-6 sm:p-8 rounded-3xl relative overflow-hidden shadow-xl border border-amber-950/40">
        <TiletPattern className="opacity-15 text-[#E89B52] scale-125" />
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E89B52]/20 border border-[#E89B52]/40 text-[#E89B52] text-xs font-bold uppercase tracking-widest">
            <BarChart3 size={14} className="text-[#E89B52]" />
            <span>Liora Begena School Analytics & Intelligence Center</span>
          </div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-white tracking-wide uppercase">
            EXECUTIVE ANALYTICS & REPORTING HUB
          </h1>
          <p className="text-xs sm:text-sm text-gray-300">
            Role-permissioned analytics for students, teachers, branch managers, accountants, administrators, and Founder Liora Begena.
          </p>
        </div>
      </div>

      {/* ROLE SWITCHER TOOLBAR */}
      <div className="bg-white border border-[#E7DED1] rounded-2xl p-4 space-y-2 shadow-xs">
        <div className="flex justify-between items-center text-xs font-bold text-gray-600">
          <span>Active Role Access Filter:</span>
          <span className="text-[#E89B52] font-mono">Logged as: {currentUser?.fullName || 'User'} ({currentUser?.role || 'founder'})</span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {[
            { role: 'student', label: 'Student Progress', icon: GraduationCap },
            { role: 'teacher', label: 'Teacher Analytics', icon: Users },
            { role: 'branch_manager', label: 'Branch Analytics', icon: Building2 },
            { role: 'accountant', label: 'Financial Analytics', icon: DollarSign },
            { role: 'admin', label: 'Admin Retention', icon: ShieldCheck },
            { role: 'founder', label: 'Founder Intelligence', icon: Crown }
          ].map((r) => {
            const Icon = r.icon;
            return (
              <button
                key={r.role}
                onClick={() => setActiveRoleView(r.role as UserRole)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  activeRoleView === r.role
                    ? 'bg-[#2B2B2B] text-white shadow-xs'
                    : 'bg-[#FAF6EF] text-gray-700 hover:bg-[#E7DED1]'
                }`}
              >
                <Icon size={14} />
                <span>{r.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* QUICK ACCESS NAVIGATION CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          onClick={() => onNavigate('analytics-insights')}
          className="p-5 bg-gradient-to-br from-[#2B2B2B] to-stone-800 text-white rounded-3xl border border-stone-700 space-y-2 hover:border-[#E89B52] transition cursor-pointer group shadow-sm"
        >
          <div className="flex items-center justify-between text-[#E89B52]">
            <Sparkles size={20} />
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </div>
          <h4 className="font-display font-black text-base uppercase">AI-Assisted Insights</h4>
          <p className="text-xs text-gray-300">
            Ask natural language questions about active students, fastest growing branches, and financial metrics.
          </p>
        </div>

        <div
          onClick={() => onNavigate('reports-builder')}
          className="p-5 bg-white border border-[#E7DED1] rounded-3xl space-y-2 hover:border-[#E89B52] transition cursor-pointer group shadow-sm"
        >
          <div className="flex items-center justify-between text-[#2B2B2B]">
            <FileText size={20} />
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </div>
          <h4 className="font-display font-black text-base uppercase">Custom Report Builder</h4>
          <p className="text-xs text-gray-600">
            Configure multi-dimensional data sources, filter date ranges, and export PDF / Excel audit statements.
          </p>
        </div>

        <div
          onClick={() => onNavigate('founder-intelligence')}
          className="p-5 bg-white border border-[#E7DED1] rounded-3xl space-y-2 hover:border-[#E89B52] transition cursor-pointer group shadow-sm"
        >
          <div className="flex items-center justify-between text-amber-600">
            <Crown size={20} />
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </div>
          <h4 className="font-display font-black text-base uppercase">Founder Intelligence Center</h4>
          <p className="text-xs text-gray-600">
            Executive strategic overview, cross-branch matrix, and critical operational alerts for Founder Bruk.
          </p>
        </div>
      </div>

      {/* RENDER ACTIVE ROLE VIEW */}
      {activeRoleView === 'student' && <StudentAnalyticsView lang={lang} onNavigate={onNavigate} />}
      {activeRoleView === 'teacher' && <TeacherAnalyticsView lang={lang} onNavigate={onNavigate} />}
      {activeRoleView === 'branch_manager' && <BranchAnalyticsView lang={lang} onNavigate={onNavigate} />}
      {activeRoleView === 'accountant' && <AccountantAnalyticsView lang={lang} onNavigate={onNavigate} />}
      {activeRoleView === 'admin' && <AdminAnalyticsView lang={lang} onNavigate={onNavigate} />}
      {activeRoleView === 'founder' && <FounderIntelligenceCenter lang={lang} onNavigate={onNavigate} />}
      {activeRoleView !== 'student' &&
        activeRoleView !== 'teacher' &&
        activeRoleView !== 'branch_manager' &&
        activeRoleView !== 'accountant' &&
        activeRoleView !== 'admin' &&
        activeRoleView !== 'founder' && (
          <FounderIntelligenceCenter lang={lang} onNavigate={onNavigate} />
        )}
    </div>
  );
}

