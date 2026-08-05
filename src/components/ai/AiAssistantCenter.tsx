import React, { useState } from 'react';
import {
  Sparkles,
  GraduationCap,
  Users,
  BookOpen,
  Building2,
  DollarSign,
  ShieldAlert,
  Crown,
  Zap,
  Bot
} from 'lucide-react';
import { StudentAiAssistant } from './StudentAiAssistant';
import { TeacherAiAssistant } from './TeacherAiAssistant';
import { ParentAiAssistant } from './ParentAiAssistant';
import { ManagementAiAssistant } from './ManagementAiAssistant';
import { AutomationBuilder } from './AutomationBuilder';

interface AiAssistantCenterProps {
  initialRole?: 'Student' | 'Parent' | 'Teacher' | 'BranchManager' | 'Accountant' | 'Admin' | 'Founder' | 'Automation';
  initialSubPath?: string;
  onNavigate?: (page: string) => void;
}

export const AiAssistantCenter: React.FC<AiAssistantCenterProps> = ({
  initialRole = 'Student',
  initialSubPath = 'ai',
  onNavigate
}) => {
  const [activeRole, setActiveRole] = useState<
    'Student' | 'Parent' | 'Teacher' | 'BranchManager' | 'Accountant' | 'Admin' | 'Founder' | 'Automation'
  >(
    initialSubPath === 'automation'
      ? 'Automation'
      : initialSubPath === 'founder'
      ? 'Founder'
      : initialRole
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Role Selector Navigation Bar */}
      <div className="bg-white rounded-2xl p-3 border border-amber-100 shadow-sm flex flex-wrap items-center justify-between gap-2 text-xs font-bold">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 text-amber-900 rounded-xl border border-amber-200">
          <Bot className="w-4 h-4 text-amber-700" />
          <span>AI Ecosystem Role:</span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setActiveRole('Student')}
            className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              activeRole === 'Student'
                ? 'bg-amber-800 text-white shadow'
                : 'bg-stone-50 text-stone-700 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" /> Student AI
          </button>

          <button
            onClick={() => setActiveRole('Parent')}
            className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              activeRole === 'Parent'
                ? 'bg-amber-800 text-white shadow'
                : 'bg-stone-50 text-stone-700 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" /> Parent AI
          </button>

          <button
            onClick={() => setActiveRole('Teacher')}
            className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              activeRole === 'Teacher'
                ? 'bg-amber-800 text-white shadow'
                : 'bg-stone-50 text-stone-700 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" /> Teacher AI
          </button>

          <button
            onClick={() => setActiveRole('BranchManager')}
            className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              activeRole === 'BranchManager'
                ? 'bg-amber-800 text-white shadow'
                : 'bg-stone-50 text-stone-700 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" /> Manager AI
          </button>

          <button
            onClick={() => setActiveRole('Accountant')}
            className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              activeRole === 'Accountant'
                ? 'bg-amber-800 text-white shadow'
                : 'bg-stone-50 text-stone-700 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" /> Accountant AI
          </button>

          <button
            onClick={() => setActiveRole('Founder')}
            className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              activeRole === 'Founder'
                ? 'bg-amber-800 text-white shadow'
                : 'bg-stone-50 text-stone-700 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            <Crown className="w-3.5 h-3.5 text-amber-300" /> Founder Command
          </button>

          <button
            onClick={() => setActiveRole('Automation')}
            className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              activeRole === 'Automation'
                ? 'bg-amber-800 text-white shadow'
                : 'bg-amber-100 text-amber-900 hover:bg-amber-200 border border-amber-300'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-700" /> Automation Rules
          </button>
        </div>
      </div>

      {/* View Router */}
      {activeRole === 'Student' && <StudentAiAssistant onNavigate={onNavigate} subPath={initialSubPath} />}
      {activeRole === 'Teacher' && <TeacherAiAssistant />}
      {activeRole === 'Parent' && <ParentAiAssistant />}
      {activeRole === 'BranchManager' && <ManagementAiAssistant role="BranchManager" />}
      {activeRole === 'Accountant' && <ManagementAiAssistant role="Accountant" />}
      {activeRole === 'Admin' && <ManagementAiAssistant role="Admin" />}
      {activeRole === 'Founder' && <ManagementAiAssistant role="Founder" />}
      {activeRole === 'Automation' && <AutomationBuilder />}
    </div>
  );
};

