import React, { useState } from 'react';
import {
  Settings,
  Building,
  Building2,
  BookOpen,
  Users,
  ShieldCheck,
  Share2,
  Database,
  Activity,
  FileText,
  Award,
  Search,
  Lock,
  Crown
} from 'lucide-react';

import { SchoolProfileSettings } from './SchoolProfileSettings';
import { BranchManagementSettings } from './BranchManagementSettings';
import { AcademicCourseSettings } from './AcademicCourseSettings';
import { UserRoleSettings } from './UserRoleSettings';
import { SecurityAuthSettings } from './SecurityAuthSettings';
import { IntegrationsCenter } from './IntegrationsCenter';
import { BackupDisasterRecovery } from './BackupDisasterRecovery';
import { SystemHealthCenter } from './SystemHealthCenter';
import { AuditLogsSecurityCenter } from './AuditLogsSecurityCenter';
import { CertificateVerificationModal } from './CertificateVerificationModal';
import { GlobalSystemSearch } from './GlobalSystemSearch';

interface SettingsCenterProps {
  initialTab?:
    | 'profile'
    | 'branches'
    | 'academic'
    | 'users'
    | 'security'
    | 'integrations'
    | 'backups'
    | 'health'
    | 'audit'
    | 'verify'
    | 'search';
  onNavigate?: (page: string) => void;
  userRole?: string;
}

export const SettingsCenter: React.FC<SettingsCenterProps> = ({
  initialTab = 'profile',
  onNavigate,
  userRole = 'Founder'
}) => {
  const [activeTab, setActiveTab] = useState<
    | 'profile'
    | 'branches'
    | 'academic'
    | 'users'
    | 'security'
    | 'integrations'
    | 'backups'
    | 'health'
    | 'audit'
    | 'verify'
    | 'search'
  >(initialTab);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Settings Navigation Header */}
      <div className="bg-white rounded-2xl p-4 border border-amber-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
              <Settings className="w-3.5 h-3.5 text-amber-700" /> System Control Center
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-900 text-amber-50 flex items-center gap-1">
              <Crown className="w-3.5 h-3.5 text-amber-300" /> {userRole} Authorized
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
            System Settings, Security, Backup & Governance
          </h1>
        </div>

        {/* Top Quick Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('search')}
            className="px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs rounded-xl border border-amber-200 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Search className="w-4 h-4 text-amber-700" /> Global Search
          </button>
          <button
            onClick={() => setActiveTab('health')}
            className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-bold text-xs rounded-xl border border-emerald-200 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Activity className="w-4 h-4 text-emerald-600" /> System Health
          </button>
        </div>
      </div>

      {/* Tab Navigation Menu */}
      <div className="bg-white rounded-2xl p-2 border border-amber-100 shadow-sm flex flex-wrap gap-1 text-xs font-bold">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'profile'
              ? 'bg-amber-800 text-white shadow'
              : 'bg-stone-50 text-stone-700 hover:bg-stone-100'
          }`}
        >
          <Building className="w-3.5 h-3.5" /> School Profile
        </button>

        <button
          onClick={() => setActiveTab('branches')}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'branches'
              ? 'bg-amber-800 text-white shadow'
              : 'bg-stone-50 text-stone-700 hover:bg-stone-100'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" /> Branches
        </button>

        <button
          onClick={() => setActiveTab('academic')}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'academic'
              ? 'bg-amber-800 text-white shadow'
              : 'bg-stone-50 text-stone-700 hover:bg-stone-100'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" /> Academic & Pricing
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'users'
              ? 'bg-amber-800 text-white shadow'
              : 'bg-stone-50 text-stone-700 hover:bg-stone-100'
          }`}
        >
          <Users className="w-3.5 h-3.5" /> Users & Roles
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'security'
              ? 'bg-amber-800 text-white shadow'
              : 'bg-stone-50 text-stone-700 hover:bg-stone-100'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" /> Security & Sessions
        </button>

        <button
          onClick={() => setActiveTab('integrations')}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'integrations'
              ? 'bg-amber-800 text-white shadow'
              : 'bg-stone-50 text-stone-700 hover:bg-stone-100'
          }`}
        >
          <Share2 className="w-3.5 h-3.5" /> Integrations & APIs
        </button>

        <button
          onClick={() => setActiveTab('backups')}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'backups'
              ? 'bg-amber-800 text-white shadow'
              : 'bg-stone-50 text-stone-700 hover:bg-stone-100'
          }`}
        >
          <Database className="w-3.5 h-3.5" /> Backups & Recovery
        </button>

        <button
          onClick={() => setActiveTab('health')}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'health'
              ? 'bg-amber-800 text-white shadow'
              : 'bg-stone-50 text-stone-700 hover:bg-stone-100'
          }`}
        >
          <Activity className="w-3.5 h-3.5 text-emerald-400" /> System Health
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'audit'
              ? 'bg-amber-800 text-white shadow'
              : 'bg-stone-50 text-stone-700 hover:bg-stone-100'
          }`}
        >
          <FileText className="w-3.5 h-3.5" /> Audit Logs
        </button>

        <button
          onClick={() => setActiveTab('verify')}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'verify'
              ? 'bg-amber-800 text-white shadow'
              : 'bg-amber-100 text-amber-900 border border-amber-300'
          }`}
        >
          <Award className="w-3.5 h-3.5 text-amber-700" /> Cert Verification
        </button>
      </div>

      {/* Tab Router View */}
      {activeTab === 'profile' && <SchoolProfileSettings />}
      {activeTab === 'branches' && <BranchManagementSettings />}
      {activeTab === 'academic' && <AcademicCourseSettings />}
      {activeTab === 'users' && <UserRoleSettings />}
      {activeTab === 'security' && <SecurityAuthSettings />}
      {activeTab === 'integrations' && <IntegrationsCenter />}
      {activeTab === 'backups' && <BackupDisasterRecovery />}
      {activeTab === 'health' && <SystemHealthCenter />}
      {activeTab === 'audit' && <AuditLogsSecurityCenter />}
      {activeTab === 'verify' && <CertificateVerificationModal />}
      {activeTab === 'search' && <GlobalSystemSearch onNavigate={onNavigate} userRole={userRole} />}
    </div>
  );
};

