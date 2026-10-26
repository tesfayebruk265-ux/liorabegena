import React, { useState, useEffect } from 'react';
import {
  Shield, ShieldAlert, Users, Building, BookOpen, GraduationCap, Award,
  DollarSign, FileText, Bell, Calendar, Settings, Activity, Search,
  Plus, Edit, Trash2, CheckCircle, XCircle, AlertTriangle, Eye, Download,
  Filter, Check, X, RefreshCw, LogOut, ChevronRight, BarChart2, PieChart,
  UserPlus, Lock, Unlock, Key, ShoppingBag, Heart, MessageSquare, Image,
  Grid, Database, Server, Smartphone, Globe, QrCode, FileSpreadsheet,
  CheckSquare, ArrowUpRight, ArrowDownRight, UserCheck, Layers, CornerUpLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Button, Input } from './InteractiveComponents';
import { ThemeToggle } from './ThemeToggle';
import { PageId, UserRole } from '../types';
import { FounderMediaGalleryManagement } from './FounderMediaGalleryManagement';

interface AdminPortalProps {
  onNavigate: (page: PageId, params?: any) => void;
  lang: 'en' | 'am';
  initialMode?: 'admin' | 'super_admin' | 'founder';
}

export interface SystemUser {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  branch: string;
  status: 'ACTIVE' | 'PENDING' | 'SUSPENDED';
  createdDate: string;
  lastLogin: string;
}

export interface BranchRecord {
  id: string;
  name: string;
  location: string;
  manager: string;
  phone: string;
  studentsCount: number;
  teachersCount: number;
  revenueETB: number;
  status: 'Active' | 'Inactive';
}

export interface CourseRecord {
  id: string;
  name: string;
  category: string;
  levels: string[];
  teachersCount: number;
  studentsCount: number;
  branches: string[];
  threeMonthFeeETB: number;
  status: 'Active' | 'Draft';
}

export interface CertificateRecord {
  id: string; // e.g. CERT-BEG-2026-0042
  studentName: string;
  studentId: string;
  course: string;
  level: string;
  issueDate: string;
  issuedBy: string;
  qrCodeUrl: string;
  status: 'Valid' | 'Revoked';
}

export interface AnnouncementItem {
  id: string;
  title: string;
  content: string;
  target: string;
  channels: string[];
  date: string;
  publishedBy: string;
  status: 'Published' | 'Draft';
}

export function AdminPortal({ onNavigate, lang, initialMode = 'admin' }: AdminPortalProps) {
  const { currentUser, getAuthoritativeUser, addNotification, logout, switchRole } = useAuth();
  const {
    mediaAssets, addMediaAsset, deleteMediaAsset, toggleMediaPublished,
    teachers, enrollments, autoAssignTeacherForEnrollment, assignTeacherToEnrollment,
    updateTeacherSpecializations, addTeacher
  } = useData();

  // Active Role View Context - directly determined by current user's role
  const activeRoleView = (currentUser?.role === 'founder'
    ? 'founder'
    : currentUser?.role === 'super_admin'
      ? 'super_admin'
      : currentUser?.role === 'admin'
        ? 'admin'
        : initialMode) as 'admin' | 'super_admin' | 'founder';

  // Active Tab inside Admin Portal
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'users' | 'branches' | 'courses' | 'students' | 'teachers' | 'enrollments' |
    'certificates' | 'announcements' | 'events' | 'store' | 'support' | 'settings' | 'audit' | 'analytics' | 'media'
  >('dashboard');

  // Media Management Form State
  const [newMediaForm, setNewMediaForm] = useState({
    title: '',
    url: '',
    caption: '',
    category: 'Begena' as any,
    placement: 'Gallery' as any,
    altText: ''
  });

  // Search & Filter
  const [globalSearch, setGlobalSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [branchFilter, setBranchFilter] = useState('All');

  // Teacher Specialization & Capacity Modal state
  const [editingTeacher, setEditingTeacher] = useState<any | null>(null);
  const [selectedSpecs, setSelectedSpecs] = useState<string[]>([]);
  const [selectedTeacherBranches, setSelectedTeacherBranches] = useState<string[]>([]);
  const [teacherCapacity, setTeacherCapacity] = useState<number>(20);
  const [supportsOnline, setSupportsOnline] = useState<boolean>(true);
  const [supportsInPerson, setSupportsInPerson] = useState<boolean>(true);
  const [teacherTelegramHandle, setTeacherTelegramHandle] = useState<string>('');

  // Manual Teacher Reassignment Modal state
  const [reassigningEnrollment, setReassigningEnrollment] = useState<any | null>(null);
  const [selectedTargetTeacherId, setSelectedTargetTeacherId] = useState<string>('');
  const [instrumentFilter, setInstrumentFilter] = useState<string>('All');
  const [assignmentStatusFilter, setAssignmentStatusFilter] = useState<string>('All');

  // Modal Dialogs State
  const [selectedUser, setSelectedUser] = useState<SystemUser | null>(null);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [selectedCert, setSelectedCert] = useState<CertificateRecord | null>(null);

  // Additional Interactive Modals
  const [isIssueCertOpen, setIsIssueCertOpen] = useState(false);
  const [certForm, setCertForm] = useState({ studentName: '', studentId: '', course: 'Begena Mastery', level: 'Basic Level 1' });

  const [isAddAnnouncementOpen, setIsAddAnnouncementOpen] = useState(false);
  const [ancForm, setAncForm] = useState({ title: '', content: '', target: 'All Students & Parents' });

  const [isAddBranchOpen, setIsAddBranchOpen] = useState(false);
  const [branchForm, setBranchForm] = useState({ name: '', location: '', manager: '', phone: '' });

  const [isAddCourseOpen, setIsAddCourseOpen] = useState(false);
  const [courseForm, setCourseForm] = useState({ name: '', category: 'Spiritual Harp', fee: 3000 });

  // ----------------------------------------------------
  // CENTRALIZED ECOSYSTEM DATA (Synced via LocalStorage)
  // ----------------------------------------------------
  const [users, setUsers] = useState<SystemUser[]>(() => {
    const saved = localStorage.getItem('ab_all_users_v3');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { }
    }
    return [
      { id: 'usr_1', fullName: 'Liora Begena', email: 'founder@begena.com', phone: '+251911000001', role: 'founder', branch: 'Hawassa Main Branch', status: 'ACTIVE', createdDate: '2026-01-01', lastLogin: 'Today, 09:12 AM' },
      { id: 'usr_2', fullName: 'Yared Gebre', email: 'admin@begena.com', phone: '+251911000002', role: 'admin', branch: 'Hawassa Main Branch', status: 'ACTIVE', createdDate: '2026-01-05', lastLogin: 'Today, 08:30 AM' },
      { id: 'usr_3', fullName: 'Super Admin System', email: 'superadmin@begena.com', phone: '+251911000000', role: 'super_admin', branch: 'Hawassa Main Branch', status: 'ACTIVE', createdDate: '2026-01-01', lastLogin: 'Today, 10:00 AM' },
      { id: 'usr_4', fullName: 'Martha Hailu', email: 'accountant@begena.com', phone: '+251911223344', role: 'accountant', branch: 'Hawassa Main Branch', status: 'ACTIVE', createdDate: '2026-02-10', lastLogin: 'Today, 08:45 AM' },
      { id: 'usr_5', fullName: 'Genet Assefa', email: 'hanasaba@begena.com', phone: '+251911334455', role: 'registration_staff', branch: 'Hawassa Main Branch', status: 'ACTIVE', createdDate: '2026-02-12', lastLogin: 'Today, 09:00 AM' },
      { id: 'usr_6', fullName: 'Lique Mezemer Bruk', email: 'teacher@begena.com', phone: '+251911445566', role: 'teacher', branch: 'Hawassa Main Branch', status: 'ACTIVE', createdDate: '2026-01-15', lastLogin: 'Yesterday, 04:15 PM' }
    ];
  });

  const [branches, setBranches] = useState<BranchRecord[]>(() => {
    const saved = localStorage.getItem('liora_branches_v1') || localStorage.getItem('ab_branches_v3');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].name?.includes('Hawassa')) {
          return parsed;
        }
      } catch (e) { }
    }
    return [
      { id: 'br_1', name: 'Hawassa Main Branch', location: 'Center Point Tower, first floor, Hawassa, Ethiopia', manager: 'Deacon Bruk Tesfaye', phone: '+251 912 67 4600', studentsCount: 720, teachersCount: 24, revenueETB: 272000, status: 'Active' }
    ];
  });

  const [courses, setCourses] = useState<CourseRecord[]>(() => {
    const saved = localStorage.getItem('ab_courses_v3');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { }
    }
    return [
      { id: 'crs_1', name: 'Begena', category: 'Spiritual Harp', levels: ['Basic 1', 'Basic 2', 'Basic 3'], teachersCount: 8, studentsCount: 420, branches: ['Hawassa Main Branch'], threeMonthFeeETB: 3000, status: 'Active' },
      { id: 'crs_2', name: 'Krar', category: 'Traditional Lyre', levels: ['Basic', 'Intermediate', 'Advanced'], teachersCount: 6, studentsCount: 180, branches: ['Hawassa Main Branch'], threeMonthFeeETB: 2800, status: 'Active' },
      { id: 'crs_3', name: 'Masenqo', category: 'Single-String Lute', levels: ['Basic', 'Advanced'], teachersCount: 4, studentsCount: 90, branches: ['Hawassa Main Branch'], threeMonthFeeETB: 3000, status: 'Active' },
      { id: 'crs_4', name: 'Washint', category: 'Traditional Flute', levels: ['Basic', 'Advanced'], teachersCount: 3, studentsCount: 60, branches: ['Hawassa Main Branch'], threeMonthFeeETB: 2500, status: 'Active' }
    ];
  });

  const [certificates, setCertificates] = useState<CertificateRecord[]>(() => {
    const saved = localStorage.getItem('ab_certificates_v3');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { }
    }
    return [];
  });

  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>(() => {
    const saved = localStorage.getItem('ab_announcements_v3');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { }
    }
    return [
      { id: 'anc_1', title: 'Grand Begena Recital & Spiritual Harmony Night', content: 'All students are invited to join Founder Bruk at Hawassa main Branch auditorium.', target: 'All Students & Parents', channels: ['In-App', 'Push', 'Telegram'], date: '2026-07-20', publishedBy: 'Liora Admin', status: 'Published' }
    ];
  });

  const [auditLogs, setAuditLogs] = useState<{ id: string; user: string; role: string; action: string; target: string; time: string }[]>(() => {
    const saved = localStorage.getItem('ab_system_audit_v3');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { }
    }
    return [
      { id: 'log_1', user: currentUser?.fullName || 'Yared Gebre', role: 'Admin', action: 'System Initialization', target: 'Phase 8 Master Control Panel', time: 'Today, 08:30 AM' }
    ];
  });

  // Sync to LocalStorage
  useEffect(() => { localStorage.setItem('ab_all_users_v3', JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem('ab_branches_v3', JSON.stringify(branches)); }, [branches]);
  useEffect(() => { localStorage.setItem('ab_courses_v3', JSON.stringify(courses)); }, [courses]);
  useEffect(() => { localStorage.setItem('ab_certificates_v3', JSON.stringify(certificates)); }, [certificates]);
  useEffect(() => { localStorage.setItem('ab_announcements_v3', JSON.stringify(announcements)); }, [announcements]);
  useEffect(() => { localStorage.setItem('ab_system_audit_v3', JSON.stringify(auditLogs)); }, [auditLogs]);

  // Listen for global profile updates to keep Admin user state synced
  useEffect(() => {
    const handleProfileSync = () => {
      const saved = localStorage.getItem('ab_all_users_v3');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) setUsers(parsed);
        } catch (e) { }
      }
    };

    window.addEventListener('user-profile-updated', handleProfileSync);
    window.addEventListener('ab_users_updated', handleProfileSync);
    window.addEventListener('ab_user_updated', handleProfileSync);
    return () => {
      window.removeEventListener('user-profile-updated', handleProfileSync);
      window.removeEventListener('ab_users_updated', handleProfileSync);
      window.removeEventListener('ab_user_updated', handleProfileSync);
    };
  }, []);

  // Audit logger
  const logAction = (action: string, target: string) => {
    const newLog = {
      id: `log_${Date.now()}`,
      user: currentUser?.fullName || 'System Administrator',
      role: activeRoleView.toUpperCase(),
      action,
      target,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // ----------------------------------------------------
  // USER MANAGEMENT ACTIONS (Requirement 4, 6)
  // ----------------------------------------------------
  const [newUserForm, setNewUserForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    role: 'student' as UserRole,
    branch: 'Hawassa main Branch'
  });

  const handleCreateUser = () => {
    if (!newUserForm.fullName || !newUserForm.email) {
      alert('Please fill out full name and email address.');
      return;
    }

    const created: SystemUser = {
      id: `usr_${Date.now()}`,
      fullName: newUserForm.fullName,
      email: newUserForm.email,
      phone: newUserForm.phone || '+251911000000',
      role: newUserForm.role,
      branch: newUserForm.branch,
      status: 'ACTIVE',
      createdDate: new Date().toISOString().split('T')[0],
      lastLogin: 'Never'
    };

    setUsers([created, ...users]);
    addNotification('User Created', `Created user account for ${newUserForm.fullName} [${newUserForm.role}]`, 'system');
    logAction('Created System User', `${newUserForm.fullName} (${newUserForm.role})`);
    setIsAddUserOpen(false);
    setNewUserForm({ fullName: '', email: '', phone: '', role: 'student', branch: 'Hawassa main Branch' });
  };

  const handleToggleUserStatus = (userId: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const nextStatus = u.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
        addNotification('User Status Altered', `Account status for ${u.fullName} changed to ${nextStatus}`, 'system');
        logAction('Changed User Account Status', `${u.fullName} -> ${nextStatus}`);
        return { ...u, status: nextStatus };
      }
      return u;
    }));
  };

  // Role simulation switch
  const handleSimulateRoleSwitch = (role: UserRole) => {
    switchRole(role);
    if (role === 'visitor') {
      onNavigate('home');
    } else {
      onNavigate(role as PageId);
    }
  };

  // Certificate Issuance Submit
  const handleIssueCertificateSubmit = () => {
    if (!certForm.studentName || !certForm.course) return;

    const certId = `CERT-BEG-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newCert: CertificateRecord = {
      id: certId,
      studentName: certForm.studentName,
      studentId: certForm.studentId || `ABS-PZ-2026-${Math.floor(100 + Math.random() * 900)}`,
      course: certForm.course,
      level: certForm.level,
      issueDate: new Date().toISOString().split('T')[0],
      issuedBy: currentUser?.fullName || 'Liora Begena',
      qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=ABS-${certId}`,
      status: 'Valid'
    };

    setCertificates([newCert, ...certificates]);
    addNotification('Certificate Issued', `Issued verified certificate ${certId} for ${certForm.studentName}`, 'system');
    logAction('Issued Academic Certificate', `${certForm.studentName} (${certId})`);
    setIsIssueCertOpen(false);
    setCertForm({ studentName: '', studentId: '', course: 'Begena Mastery', level: 'Basic Level 1' });
  };

  // Announcement publisher Submit
  const handlePublishAnnouncementSubmit = () => {
    if (!ancForm.title || !ancForm.content) return;

    const newAnc: AnnouncementItem = {
      id: `anc_${Date.now()}`,
      title: ancForm.title,
      content: ancForm.content,
      target: ancForm.target,
      channels: ['In-App', 'Push', 'Telegram'],
      date: new Date().toISOString().split('T')[0],
      publishedBy: currentUser?.fullName || 'Yared Gebre',
      status: 'Published'
    };

    setAnnouncements([newAnc, ...announcements]);
    addNotification('Announcement Published', `Broadcasting: ${ancForm.title}`, 'system');
    logAction('Published Announcement', ancForm.title);
    setIsAddAnnouncementOpen(false);
    setAncForm({ title: '', content: '', target: 'All Students & Parents' });
  };

  // Filtered Users List with Authoritative Real-Time Data Sync
  const filteredUsers = users.map(u => {
    const authUser = getAuthoritativeUser ? getAuthoritativeUser(u.email || u.id) : undefined;
    if (authUser) {
      return {
        ...u,
        fullName: authUser.fullName || u.fullName,
        email: authUser.email || u.email,
        phone: authUser.phone || u.phone,
        branch: authUser.branch || u.branch
      };
    }
    return u;
  }).filter(u => {
    const matchesSearch = (u.fullName || '').toLowerCase().includes(globalSearch.toLowerCase()) ||
      (u.email || '').toLowerCase().includes(globalSearch.toLowerCase()) ||
      (u.role || '').toLowerCase().includes(globalSearch.toLowerCase());
    const matchesRole = roleFilter === 'All' || u.role === roleFilter;
    const matchesBranch = branchFilter === 'All' || u.branch === branchFilter;
    return matchesSearch && matchesRole && matchesBranch;
  });

  return (
    <div className="w-full bg-[#FCFBF8] min-h-screen text-[#2B2B2B] font-sans antialiased text-left">
      {/* HEADER BAR WITH EXECUTIVE ROLE SWITCHER */}
      <header className="border-b border-[#E7DED1] bg-white relative z-20 px-6 py-4 flex flex-col md:flex-row justify-between md:items-center gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#FAF6EF] rounded-xl border border-[#E7DED1]">
            <Shield className="text-[#E89B52]" size={22} />
          </div>
          <div>
            <h1 className="font-display font-black text-lg tracking-tight uppercase text-gray-800">
              {activeRoleView === 'founder' ? 'Founder Executive Summit' : 'Admin Control Center'}
            </h1>
            <p className="text-[10px] tracking-wider text-[#E89B52] font-bold uppercase">
              Liora Begena School • Master Digital Ecosystem Control
            </p>
          </div>
        </div>

        {/* ROLE VIEW SWITCHER - Display only current user's role view */}
        <div className="flex items-center gap-3">
          <ThemeToggle variant="pill" />
          <div className="p-1 bg-[#FAF6EF] border border-[#E7DED1] rounded-xl flex items-center text-xs font-bold">
            {(currentUser?.role === 'admin' || currentUser?.role === 'super_admin') && (
              <span className="px-3 py-1.5 rounded-lg bg-[#E89B52] text-white">
                Admin View
              </span>
            )}
            {currentUser?.role === 'founder' && (
              <span className="px-3 py-1.5 rounded-lg bg-[#2B2B2B] text-white">
                Founder View
              </span>
            )}
          </div>

          <button onClick={logout} className="p-2 hover:bg-red-50 hover:text-red-600 rounded-lg text-gray-400 transition-colors" title="Log Out">
            <LogOut size={18} />
          </button>
        </div>
      </header>

      {/* CORE WORKSPACE GRID */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 p-6">
        {/* SIDEBAR NAVIGATION */}
        <aside className="lg:col-span-3 space-y-3">
          <div className="bg-white border border-[#E7DED1] rounded-2xl p-4 shadow-2xs space-y-1 text-xs font-bold">
            <p className="text-[10px] tracking-widest text-[#E89B52] font-bold px-3 py-1 uppercase">Central Control Modules</p>

            <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${activeTab === 'dashboard' ? 'bg-[#E89B52] text-white' : 'text-gray-600 hover:bg-[#FAF6EF]'}`}>
              <div className="flex items-center gap-2.5"><BarChart2 size={16} /><span>Executive Overview</span></div>
              <ChevronRight size={14} className="opacity-60" />
            </button>

            <button onClick={() => setActiveTab('users')} className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${activeTab === 'users' ? 'bg-[#E89B52] text-white' : 'text-gray-600 hover:bg-[#FAF6EF]'}`}>
              <div className="flex items-center gap-2.5"><Users size={16} /><span>User & Role Directory</span></div>
              <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-mono font-bold">{users.length}</span>
            </button>

            <button onClick={() => setActiveTab('branches')} className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${activeTab === 'branches' ? 'bg-[#E89B52] text-white' : 'text-gray-600 hover:bg-[#FAF6EF]'}`}>
              <div className="flex items-center gap-2.5"><Building size={16} /><span>Branch Management</span></div>
              <span className="text-[10px] bg-[#FAF6EF] text-gray-600 px-1.5 py-0.5 rounded font-mono font-bold">{branches.length}</span>
            </button>

            <button onClick={() => setActiveTab('teachers')} className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${activeTab === 'teachers' ? 'bg-[#E89B52] text-white' : 'text-gray-600 hover:bg-[#FAF6EF]'}`}>
              <div className="flex items-center gap-2.5"><GraduationCap size={16} /><span>Faculty & Specializations</span></div>
              <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-mono font-bold">{teachers.length}</span>
            </button>

            <button onClick={() => setActiveTab('enrollments')} className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${activeTab === 'enrollments' ? 'bg-[#E89B52] text-white' : 'text-gray-600 hover:bg-[#FAF6EF]'}`}>
              <div className="flex items-center gap-2.5"><UserCheck size={16} /><span>Student-Teacher Assignments</span></div>
              <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-mono font-bold">{enrollments.length}</span>
            </button>

            <button onClick={() => setActiveTab('courses')} className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${activeTab === 'courses' ? 'bg-[#E89B52] text-white' : 'text-gray-600 hover:bg-[#FAF6EF]'}`}>
              <div className="flex items-center gap-2.5"><BookOpen size={16} /><span>Courses & Curriculum</span></div>
              <ChevronRight size={14} className="opacity-60" />
            </button>

            <button onClick={() => setActiveTab('certificates')} className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${activeTab === 'certificates' ? 'bg-[#E89B52] text-white' : 'text-gray-600 hover:bg-[#FAF6EF]'}`}>
              <div className="flex items-center gap-2.5"><Award size={16} /><span>Certificates & Verification</span></div>
              <ChevronRight size={14} className="opacity-60" />
            </button>

            <button onClick={() => setActiveTab('announcements')} className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${activeTab === 'announcements' ? 'bg-[#E89B52] text-white' : 'text-gray-600 hover:bg-[#FAF6EF]'}`}>
              <div className="flex items-center gap-2.5"><Bell size={16} /><span>Announcements & Events</span></div>
              <ChevronRight size={14} className="opacity-60" />
            </button>

            <button onClick={() => setActiveTab('media')} className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${activeTab === 'media' ? 'bg-[#E89B52] text-white' : 'text-gray-600 hover:bg-[#FAF6EF]'}`}>
              <div className="flex items-center gap-2.5"><Image size={16} /><span>Media & Gallery Hub</span></div>
              <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-mono font-bold">{mediaAssets.length}</span>
            </button>

            <button onClick={() => setActiveTab('settings')} className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${activeTab === 'settings' ? 'bg-[#E89B52] text-white' : 'text-gray-600 hover:bg-[#FAF6EF]'}`}>
              <div className="flex items-center gap-2.5"><Settings size={16} /><span>System Settings & Health</span></div>
              <ChevronRight size={14} className="opacity-60" />
            </button>

            <button onClick={() => setActiveTab('audit')} className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${activeTab === 'audit' ? 'bg-[#E89B52] text-white' : 'text-gray-600 hover:bg-[#FAF6EF]'}`}>
              <div className="flex items-center gap-2.5"><ShieldAlert size={16} /><span>Audit Log & Security</span></div>
              <ChevronRight size={14} className="opacity-60" />
            </button>
          </div>

          {/* SANDBOX ROLE SWITCHER TOOLBOX */}
          <div className="bg-white border border-[#E7DED1] rounded-2xl p-4 shadow-2xs space-y-3 text-xs">
            <span className="text-[10px] font-bold text-red-500 uppercase font-mono flex items-center gap-1">
              <RefreshCw size={12} /> Role Switcher Sandbox Engine
            </span>
            <p className="text-[10px] text-gray-400">Instantly switch session role to test dynamic role-based access across all 10 ecosystem roles:</p>

            <div className="grid grid-cols-2 gap-1.5 font-bold">
              {[
                { id: 'visitor', label: 'Visitor' },
                { id: 'student', label: 'Student' },
                { id: 'parent', label: 'Parent' },
                { id: 'teacher', label: 'Teacher' },
                { id: 'registration_staff', label: 'Reg Staff' },
                { id: 'branch_manager', label: 'Branch Mgr' },
                { id: 'accountant', label: 'Accountant' },
                { id: 'admin', label: 'Admin' },
                { id: 'super_admin', label: 'Super Admin' },
                { id: 'founder', label: 'Founder' }
              ].map((r) => (
                <button
                  key={r.id}
                  onClick={() => handleSimulateRoleSwitch(r.id as UserRole)}
                  className="px-2 py-1.5 bg-[#FAF6EF] hover:bg-[#E89B52] hover:text-white border border-[#E7DED1] rounded-lg text-[10px] text-center transition-all cursor-pointer"
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* MAIN DISPLAY AREA */}
        <main className="lg:col-span-9 space-y-6">

          {/* TAB 1: EXECUTIVE DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 animate-fadeIn text-xs">
              {/* FOUNDER STRATEGIC HEADER OR ADMIN OVERVIEW */}
              <div className="bg-[#2B2B2B] text-white p-6 rounded-2xl shadow-xl space-y-2 relative overflow-hidden">
                <div className="flex justify-between items-start relative z-10">
                  <div>
                    <span className="text-[10px] font-mono tracking-widest text-[#E89B52] uppercase font-bold">
                      {activeRoleView === 'founder' ? 'EXECUTIVE FOUNDER SUMMIT' : 'ACADEMIC MANAGEMENT OVERVIEW'}
                    </span>
                    <h2 className="font-display font-black text-2xl uppercase tracking-tight">
                      {activeRoleView === 'founder' ? 'FOUNDER BRUK EXECUTIVE DESK' : 'LIORA BEGENA SCHOOL DIGITAL CONTROL'}
                    </h2>
                    <p className="text-xs text-gray-300 mt-1">
                      Organization-wide performance for Hawassa main Branch & online students.
                    </p>
                  </div>
                  <Button variant="primary" size="sm" onClick={() => setIsAddUserOpen(true)} className="gap-1.5 shrink-0 bg-[#E89B52] text-white">
                    <UserPlus size={14} /> Create New User
                  </Button>
                </div>
              </div>

              {/* BENTO METRICS GRID (Requirement 1, 2, 3) */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white border border-[#E7DED1] p-4 rounded-2xl shadow-2xs">
                  <span className="block text-[10px] font-mono text-gray-400 uppercase font-bold">Total Enrolled Students</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-black font-mono text-[#2B2B2B]">720 Students</span>
                  </div>
                  <span className="text-[9px] text-green-600 font-bold block mt-1">↑ 18% month-over-month</span>
                </div>

                <div className="bg-white border border-[#E7DED1] p-4 rounded-2xl shadow-2xs">
                  <span className="block text-[10px] font-mono text-gray-400 uppercase font-bold">Total Faculty Masters</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-black font-mono text-[#E89B52]">24 Instructors</span>
                  </div>
                  <span className="text-[9px] text-gray-400 font-bold block mt-1">Active at Hawassa Main Branch</span>
                </div>

                <div className="bg-white border border-[#E7DED1] p-4 rounded-2xl shadow-2xs">
                  <span className="block text-[10px] font-mono text-gray-400 uppercase font-bold">Monthly School Income</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-black font-mono text-green-700">272,000 ETB</span>
                  </div>
                  <span className="text-[9px] text-green-600 font-bold block mt-1">July 2026 Inflows</span>
                </div>

                <div className="bg-white border border-[#E7DED1] p-4 rounded-2xl shadow-2xs">
                  <span className="block text-[10px] font-mono text-gray-400 uppercase font-bold">Active Campus</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-black font-mono text-[#2B2B2B]">1 Main Branch</span>
                  </div>
                  <span className="text-[9px] text-gray-400 font-bold block mt-1">Hawassa (Center Point Tower)</span>
                </div>
              </div>

              {/* FOUNDER/ADMIN SVG GROWTH CHART COMPONENT (Requirement 2) */}
              <div className="bg-white border border-[#E7DED1] p-6 rounded-2xl shadow-2xs space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-display font-black text-sm uppercase tracking-wider">
                      Strategic Growth Trajectory & Revenue Metrics
                    </h3>
                    <p className="text-[11px] text-gray-400">Hawassa main branch & online enrollment performance from Jan 2026 to present.</p>
                  </div>
                  <span className="px-2.5 py-1 bg-green-50 text-green-700 rounded-full font-mono font-bold text-[10px] border border-green-200">
                    Growth Index: +142% YTD
                  </span>
                </div>

                {/* SVG CHART */}
                <div className="pt-2">
                  <svg viewBox="0 0 500 160" className="w-full h-40 overflow-visible">
                    <line x1="0" y1="20" x2="500" y2="20" stroke="#f3f4f6" strokeWidth="1" />
                    <line x1="0" y1="70" x2="500" y2="70" stroke="#f3f4f6" strokeWidth="1" />
                    <line x1="0" y1="120" x2="500" y2="120" stroke="#f3f4f6" strokeWidth="1" />
                    <line x1="0" y1="150" x2="500" y2="150" stroke="#e5e7eb" strokeWidth="1.5" />

                    <path
                      d="M 10 135 L 90 120 L 170 105 L 250 90 L 330 70 L 410 45 L 490 20"
                      fill="none"
                      stroke="#E89B52"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />

                    <path
                      d="M 10 135 L 90 120 L 170 105 L 250 90 L 330 70 L 410 45 L 490 20 L 490 150 L 10 150 Z"
                      fill="url(#gradient-admin-area)"
                      opacity="0.12"
                    />

                    <defs>
                      <linearGradient id="gradient-admin-area" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#E89B52" />
                        <stop offset="100%" stopColor="#E89B52" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="flex justify-between text-[10px] text-gray-400 font-bold pt-1 px-1">
                    <span>Jan (120)</span><span>Feb (180)</span><span>Mar (240)</span><span>Apr (310)</span><span>May (420)</span><span>Jun (580)</span><span>Jul (720)</span>
                  </div>
                </div>
              </div>

              {/* BRANCH SUMMARY CARDS */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {branches.map(b => (
                  <div key={b.id} className="bg-white border border-[#E7DED1] p-5 rounded-2xl shadow-2xs space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-display font-black text-sm uppercase text-gray-800">{b.name}</span>
                      <span className="px-2 py-0.5 bg-green-50 text-green-700 rounded font-mono font-bold text-[9px]">{b.status}</span>
                    </div>
                    <div className="space-y-1 text-gray-600">
                      <div className="flex justify-between"><span>Branch Manager:</span><span className="font-bold">{b.manager}</span></div>
                      <div className="flex justify-between"><span>Active Students:</span><span className="font-mono font-bold">{b.studentsCount}</span></div>
                      <div className="flex justify-between"><span>Total Faculty:</span><span className="font-mono font-bold">{b.teachersCount}</span></div>
                      <div className="flex justify-between"><span>Monthly Revenue:</span><span className="font-mono font-bold text-[#E89B52]">{b.revenueETB.toLocaleString()} ETB</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: USER & ROLE DIRECTORY (Requirement 4, 5, 6, 7) */}
          {activeTab === 'users' && (
            <div className="bg-white border border-[#E7DED1] p-6 rounded-2xl shadow-2xs space-y-6 animate-fadeIn text-xs">
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                  <span className="text-[10px] font-mono tracking-widest text-[#E89B52] uppercase font-bold">MASTER USER REGISTRY</span>
                  <h2 className="font-display font-black text-xl uppercase">All System Accounts & Role Access</h2>
                </div>
                <Button variant="primary" size="sm" onClick={() => setIsAddUserOpen(true)} className="gap-1.5 shrink-0 bg-[#E89B52] text-white">
                  <UserPlus size={14} /> Add System User
                </Button>
              </div>

              {/* FILTERS */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 p-3 bg-[#FAF6EF] rounded-xl border border-[#E7DED1]">
                <div className="md:col-span-2 relative">
                  <Search size={14} className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    value={globalSearch}
                    onChange={(e) => setGlobalSearch(e.target.value)}
                    placeholder="Search user by name, email, role..."
                    className="w-full pl-8 pr-3 py-2 bg-white border border-[#E7DED1] rounded-lg text-xs outline-none"
                  />
                </div>

                <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="p-2 border border-[#E7DED1] rounded-lg bg-white font-bold">
                  <option value="All">All Roles</option>
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                  <option value="accountant">Accountant</option>
                  <option value="registration_staff">Reg Staff</option>
                  <option value="branch_manager">Branch Manager</option>
                  <option value="admin">Admin</option>
                  <option value="super_admin">Super Admin</option>
                  <option value="founder">Founder</option>
                </select>

                <select value={branchFilter} onChange={(e) => setBranchFilter(e.target.value)} className="p-2 border border-[#E7DED1] rounded-lg bg-white font-bold">
                  <option value="All">All Locations</option>
                  <option value="Hawassa main Branch">Hawassa main Branch</option>
                  <option value="Online">Online Campus</option>
                </select>
              </div>

              {/* USER TABLE */}
              <div className="border border-gray-100 rounded-xl overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-[#FAF6EF] text-[10px] font-bold text-gray-400 uppercase">
                    <tr>
                      <th className="p-3">User</th>
                      <th className="p-3">Role</th>
                      <th className="p-3">Branch Scope</th>
                      <th className="p-3">Last Active</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map(u => (
                      <tr key={u.id} className="border-b border-gray-100 hover:bg-[#FAF6EF]/20">
                        <td className="p-3 font-bold">
                          {u.fullName}
                          <span className="block font-mono text-[9px] text-gray-400">{u.email}</span>
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded font-mono text-[9px] font-bold bg-amber-50 text-amber-800 uppercase border border-amber-200">
                            {u.role}
                          </span>
                        </td>
                        <td className="p-3">{u.branch}</td>
                        <td className="p-3 text-gray-500 font-mono text-[10px]">{u.lastLogin}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold ${u.status === 'ACTIVE' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
                            }`}>
                            {u.status}
                          </span>
                        </td>
                        <td className="p-3 text-right flex gap-1.5 justify-end">
                          <Button variant="secondary" size="sm" onClick={() => setSelectedUser(u)}>
                            View Profile
                          </Button>
                          <button
                            onClick={() => handleToggleUserStatus(u.id)}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border ${u.status === 'ACTIVE' ? 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100' : 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                              }`}
                          >
                            {u.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: BRANCH MANAGEMENT (Requirement 9, 10, 11) */}
          {activeTab === 'branches' && (
            <div className="bg-white border border-[#E7DED1] p-6 rounded-2xl shadow-2xs space-y-6 animate-fadeIn text-xs">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-[10px] font-mono tracking-widest text-[#E89B52] uppercase font-bold">CAMPUS NETWORK</span>
                  <h2 className="font-display font-black text-xl uppercase">School Branches & Manager Scope</h2>
                </div>
                <Button variant="primary" size="sm" onClick={() => setIsAddBranchOpen(true)} className="gap-1.5 bg-[#E89B52] text-white">
                  <Plus size={14} /> Add New Campus Branch
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {branches.map(b => (
                  <div key={b.id} className="bg-[#FAF6EF]/30 border border-[#E7DED1] p-5 rounded-2xl space-y-4 shadow-2xs">
                    <div className="flex justify-between items-center">
                      <h3 className="font-display font-black text-base text-gray-800">{b.name}</h3>
                      <span className="px-2 py-0.5 bg-green-50 text-green-700 rounded font-mono font-bold text-[9px] border border-green-200">{b.status}</span>
                    </div>

                    <div className="space-y-2 text-xs text-gray-600">
                      <div><b>Location:</b> {b.location}</div>
                      <div><b>Branch Manager:</b> {b.manager}</div>
                      <div><b>Phone Contact:</b> {b.phone}</div>
                      <div className="p-3 bg-white rounded-xl border border-[#E7DED1] space-y-1 font-mono text-[11px] text-gray-800">
                        <div className="flex justify-between"><span>Enrolled Students:</span><b>{b.studentsCount}</b></div>
                        <div className="flex justify-between"><span>Faculty Masters:</span><b>{b.teachersCount}</b></div>
                        <div className="flex justify-between"><span>Monthly Revenue:</span><b className="text-[#E89B52]">{b.revenueETB.toLocaleString()} ETB</b></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: COURSES & CURRICULUM (Requirement 12, 13, 14) */}
          {activeTab === 'courses' && (
            <div className="bg-white border border-[#E7DED1] p-6 rounded-2xl shadow-2xs space-y-6 animate-fadeIn text-xs">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-[10px] font-mono tracking-widest text-[#E89B52] uppercase font-bold">INSTRUMENT CATALOG</span>
                  <h2 className="font-display font-black text-xl uppercase">Course Offerings & Level Structure</h2>
                </div>
                <Button variant="primary" size="sm" onClick={() => setIsAddCourseOpen(true)} className="gap-1.5 bg-[#E89B52] text-white">
                  <Plus size={14} /> Add New Course Offering
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {courses.map(c => (
                  <div key={c.id} className="border border-[#E7DED1] p-5 rounded-2xl bg-white shadow-2xs space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] text-[#E89B52] font-bold uppercase">{c.category}</span>
                        <h3 className="font-display font-black text-lg text-gray-800">{c.name} Course</h3>
                      </div>
                      <span className="px-2 py-0.5 bg-green-50 text-green-700 rounded font-mono text-[9px] font-bold">{c.status}</span>
                    </div>

                    <div className="space-y-1.5 text-xs text-gray-600">
                      <div><b>Course Levels:</b> {c.levels.join(' • ')}</div>
                      <div><b>Active Campuses:</b> {c.branches.join(', ')}</div>
                      <div><b>Base Tuition (3 Months):</b> <span className="font-mono font-bold text-[#E89B52]">{c.threeMonthFeeETB} ETB</span></div>
                      <div className="flex justify-between text-gray-400 font-mono text-[10px] pt-2 border-t border-gray-100">
                        <span>{c.teachersCount} Assigned Teachers</span>
                        <span>{c.studentsCount} Enrolled Students</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: CERTIFICATES & VERIFICATION (Requirement 25, 26) */}
          {activeTab === 'certificates' && (
            <div className="bg-white border border-[#E7DED1] p-6 rounded-2xl shadow-2xs space-y-6 animate-fadeIn text-xs">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-[10px] font-mono tracking-widest text-[#E89B52] uppercase font-bold">DIGITAL CREDENTIALS</span>
                  <h2 className="font-display font-black text-xl uppercase">Issued Certificates & QR Verification</h2>
                </div>
                <Button variant="primary" size="sm" onClick={() => setIsIssueCertOpen(true)} className="gap-1.5 bg-[#E89B52] text-white cursor-pointer">
                  <Award size={14} /> Issue New Certificate
                </Button>
              </div>

              <div className="border border-gray-100 rounded-xl overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-[#FAF6EF] text-[10px] font-bold text-gray-400 uppercase">
                    <tr>
                      <th className="p-3">Cert ID</th>
                      <th className="p-3">Student Name</th>
                      <th className="p-3">Course / Level</th>
                      <th className="p-3">Issue Date</th>
                      <th className="p-3">Issuer</th>
                      <th className="p-3 text-right">Verification QR</th>
                    </tr>
                  </thead>
                  <tbody>
                    {certificates.map(cert => (
                      <tr key={cert.id} className="border-b border-gray-100 hover:bg-[#FAF6EF]/20">
                        <td className="p-3 font-mono font-bold text-[#E89B52]">{cert.id}</td>
                        <td className="p-3 font-bold">{cert.studentName}</td>
                        <td className="p-3">{cert.course} ({cert.level})</td>
                        <td className="p-3 font-mono text-gray-500">{cert.issueDate}</td>
                        <td className="p-3 text-gray-600">{cert.issuedBy}</td>
                        <td className="p-3 text-right">
                          <Button variant="secondary" size="sm" onClick={() => setSelectedCert(cert)} className="gap-1 cursor-pointer">
                            <QrCode size={12} /> View QR
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 6: ANNOUNCEMENTS & EVENTS (Requirement 28, 29) */}
          {activeTab === 'announcements' && (
            <div className="bg-white border border-[#E7DED1] p-6 rounded-2xl shadow-2xs space-y-6 animate-fadeIn text-xs">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-[10px] font-mono tracking-widest text-[#E89B52] uppercase font-bold">COMMUNICATION DESK</span>
                  <h2 className="font-display font-black text-xl uppercase">Broadcast Announcements & Events</h2>
                </div>
                <Button variant="primary" size="sm" onClick={() => setIsAddAnnouncementOpen(true)} className="gap-1.5 bg-[#E89B52] text-white cursor-pointer">
                  <Bell size={14} /> Publish Announcement
                </Button>
              </div>

              <div className="space-y-4">
                {announcements.map(anc => (
                  <div key={anc.id} className="p-4 border border-[#E7DED1] rounded-2xl bg-[#FAF6EF]/20 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-sm text-gray-800">{anc.title}</span>
                      <span className="text-[9px] font-mono font-bold bg-green-50 text-green-700 px-2 py-0.5 rounded">{anc.status}</span>
                    </div>
                    <p className="text-gray-600 leading-relaxed">{anc.content}</p>
                    <div className="flex justify-between text-[10px] text-gray-400 font-mono pt-2 border-t border-gray-100">
                      <span>Target: {anc.target}</span>
                      <span>Published by {anc.publishedBy} on {anc.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: SYSTEM SETTINGS & HEALTH (Requirement 39, 45) */}
          {activeTab === 'settings' && (
            <div className="bg-white border border-[#E7DED1] p-6 rounded-2xl shadow-2xs space-y-6 animate-fadeIn text-xs">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-[#E89B52] uppercase font-bold">SYSTEM DIAGNOSTICS</span>
                <h2 className="font-display font-black text-xl uppercase">School Infrastructure & Service Status</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border border-gray-100 rounded-xl flex justify-between items-center bg-green-50/50">
                  <div className="flex items-center gap-3">
                    <Server className="text-green-600" size={20} />
                    <div>
                      <span className="font-bold text-gray-800 block">Cloud SQL Relational Database</span>
                      <span className="text-[10px] text-gray-500">Drizzle ORM Proxy active</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-green-100 text-green-800 text-[10px] font-bold">HEALTHY</span>
                </div>

                <div className="p-4 border border-gray-100 rounded-xl flex justify-between items-center bg-green-50/50">
                  <div className="flex items-center gap-3">
                    <Lock className="text-green-600" size={20} />
                    <div>
                      <span className="font-bold text-gray-800 block">JWT Authentication & Session Guard</span>
                      <span className="text-[10px] text-gray-500">256-bit Token encryption</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-green-100 text-green-800 text-[10px] font-bold">HEALTHY</span>
                </div>

                <div className="p-4 border border-gray-100 rounded-xl flex justify-between items-center bg-green-50/50">
                  <div className="flex items-center gap-3">
                    <DollarSign className="text-green-600" size={20} />
                    <div>
                      <span className="font-bold text-gray-800 block">CBE / Telebirr Payment Reconciliation</span>
                      <span className="text-[10px] text-gray-500">Receipt screenshot OCR active</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-green-100 text-green-800 text-[10px] font-bold">HEALTHY</span>
                </div>

                <div className="p-4 border border-gray-100 rounded-xl flex justify-between items-center bg-green-50/50">
                  <div className="flex items-center gap-3">
                    <Globe className="text-green-600" size={20} />
                    <div>
                      <span className="font-bold text-gray-800 block">Google Meet Live Classroom Relay</span>
                      <span className="text-[10px] text-gray-500">Distance learning operational</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-green-100 text-green-800 text-[10px] font-bold">HEALTHY</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: AUDIT LOG (Requirement 41) */}
          {activeTab === 'audit' && (
            <div className="bg-white border border-[#E7DED1] p-6 rounded-2xl shadow-2xs space-y-6 animate-fadeIn text-xs">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-[#E89B52] uppercase font-bold">SECURITY LOG</span>
                <h2 className="font-display font-black text-xl uppercase">Ecosystem Audit Trail & Action History</h2>
              </div>

              <div className="border border-gray-100 rounded-xl overflow-x-auto font-mono text-[11px]">
                <table className="w-full text-left">
                  <thead className="bg-[#FAF6EF] text-[10px] font-bold text-gray-400 uppercase">
                    <tr>
                      <th className="p-3">Timestamp</th>
                      <th className="p-3">User</th>
                      <th className="p-3">Role</th>
                      <th className="p-3">Action</th>
                      <th className="p-3">Target Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditLogs.map(log => (
                      <tr key={log.id} className="border-b border-gray-100 hover:bg-[#FAF6EF]/20">
                        <td className="p-3 text-gray-400">{log.time}</td>
                        <td className="p-3 font-bold">{log.user}</td>
                        <td className="p-3"><span className="px-2 py-0.5 rounded bg-gray-100 font-bold">{log.role}</span></td>
                        <td className="p-3 font-bold text-[#E89B52]">{log.action}</td>
                        <td className="p-3 text-gray-600">{log.target}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 9: MEDIA & GALLERY MANAGEMENT */}
          {activeTab === 'media' && (
            <FounderMediaGalleryManagement onNavigatePage={(p) => onNavigate(p as PageId)} />
          )}

          {/* TAB: FACULTY MASTERS & SPECIALIZATIONS */}
          {activeTab === 'teachers' && (
            <div className="bg-white border border-[#E7DED1] p-6 rounded-2xl shadow-2xs space-y-6 animate-fadeIn text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
                <div>
                  <h2 className="font-display font-black text-lg text-[#2B2B2B]">Faculty Masters & Instrument Specialization Matrix</h2>
                  <p className="text-[#8C8275] text-xs">Manage qualified instructors for Begena, Krar, Masenqo, Washint, Vocal, and Kebero across branches.</p>
                </div>
                <Button
                  variant="primary"
                  className="bg-[#E89B52] text-white flex items-center gap-2"
                  onClick={() => {
                    const name = prompt('Enter Teacher Full Name:');
                    if (!name) return;
                    const email = prompt('Enter Teacher Email (e.g. teacher@begena.com):');
                    if (!email) return;
                    const phone = prompt('Enter Teacher Phone Number:');
                    const specsInput = prompt('Enter Instrument Specializations comma-separated (e.g., Begena, Vocal):', 'Begena');
                    const specs = (specsInput || 'Begena').split(',').map(s => s.trim());
                    addTeacher({
                      fullName: name,
                      email: email,
                      phone: phone || '+251900000000',
                      photo: '',
                      specializations: specs,
                      branches: ['Hawassa main Branch'],
                      supportsOnline: true,
                      supportsInPerson: true,
                      capacity: 20,
                      status: 'Active',
                      bio: `Master instructor specialized in ${specs.join(', ')}.`
                    });
                  }}
                >
                  <Plus size={14} /> Add Faculty Master
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {teachers.map(teacher => {
                  const activeCount = enrollments.filter(e => e.assignedTeacherId === teacher.id && e.status === 'Active').length;
                  return (
                    <div key={teacher.id} className="border border-[#E7DED1] rounded-2xl p-4 bg-white shadow-2xs space-y-3">
                      <div className="flex items-center gap-3">
                        {teacher.photo ? (
                          <img src={teacher.photo} alt={teacher.fullName} className="w-12 h-12 rounded-full object-cover border-2 border-[#E89B52]" />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-[#3B2818] text-[#E89B52] font-bold text-sm flex items-center justify-center border-2 border-[#E89B52] shrink-0">
                            {teacher.fullName?.charAt(0) || 'T'}
                          </div>
                        )}
                        <div className="overflow-hidden">
                          <h4 className="font-bold text-gray-900 text-sm truncate">{teacher.fullName}</h4>
                          <p className="text-[10px] text-gray-500 truncate">{teacher.email}</p>
                          <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[9px] font-bold bg-green-50 text-green-700 border border-green-200">
                            {teacher.status}
                          </span>
                        </div>
                      </div>

                      <div>
                        <span className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Qualified Instruments</span>
                        <div className="flex flex-wrap gap-1">
                          {teacher.specializations.map(spec => (
                            <span key={spec} className="px-2 py-0.5 bg-amber-50 text-amber-900 rounded-md border border-amber-200 text-[10px] font-bold">
                              🎵 {spec}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[10px] bg-[#FAF6EF] p-2 rounded-xl">
                        <div>
                          <span className="text-gray-400 block font-bold">Workload</span>
                          <span className="font-bold font-mono text-gray-800">{activeCount} / {teacher.capacity} Students</span>
                        </div>
                        <div>
                          <span className="text-gray-400 block font-bold">Mode Support</span>
                          <span className="font-bold text-gray-800">
                            {teacher.supportsInPerson && 'In-Person '}{teacher.supportsOnline && 'Online'}
                          </span>
                        </div>
                      </div>

                      <div className="bg-sky-50 border border-sky-100 p-2 rounded-xl flex items-center justify-between text-[10px]">
                        <span className="font-bold text-sky-900 flex items-center gap-1">
                          💬 Telegram Contact
                        </span>
                        <span className="font-mono font-bold text-sky-700">
                          {teacher.telegramUsername ? `@${teacher.telegramUsername.replace(/^@/, '')}` : 'Not set'}
                        </span>
                      </div>

                      <div className="flex justify-between items-center pt-1 text-[10px] border-t border-gray-100">
                        <span className="text-gray-500 font-bold">{teacher.branches.length} Branches Assigned</span>
                        <button
                          onClick={() => {
                            setEditingTeacher(teacher);
                            setSelectedSpecs([...teacher.specializations]);
                            setSelectedTeacherBranches([...teacher.branches]);
                            setTeacherCapacity(teacher.capacity || 20);
                            setSupportsOnline(teacher.supportsOnline);
                            setSupportsInPerson(teacher.supportsInPerson);
                            setTeacherTelegramHandle(teacher.telegramUsername || '');
                          }}
                          className="text-[#E89B52] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <Edit size={12} /> Edit Profile & Specs
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB: STUDENT-TEACHER COURSE ENROLLMENTS */}
          {activeTab === 'enrollments' && (
            <div className="bg-white border border-[#E7DED1] p-6 rounded-2xl shadow-2xs space-y-6 animate-fadeIn text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
                <div>
                  <h2 className="font-display font-black text-lg text-[#2B2B2B]">Student-Teacher Course Enrollment Assignments</h2>
                  <p className="text-[#8C8275] text-xs">Real-time instrument-matching algorithm & manual staff overrides with learning history preservation.</p>
                </div>
                <div className="flex gap-2">
                  <select
                    value={instrumentFilter}
                    onChange={(e) => setInstrumentFilter(e.target.value)}
                    className="p-2 border border-[#E7DED1] rounded-lg text-xs font-bold bg-white"
                  >
                    <option value="All">All Instruments</option>
                    <option value="Begena">Begena</option>
                    <option value="Krar">Krar</option>
                    <option value="Masenqo">Masenqo</option>
                    <option value="Washint">Washint</option>
                    <option value="Vocal">Vocal</option>
                    <option value="Kebero">Kebero</option>
                  </select>
                  <select
                    value={assignmentStatusFilter}
                    onChange={(e) => setAssignmentStatusFilter(e.target.value)}
                    className="p-2 border border-[#E7DED1] rounded-lg text-xs font-bold bg-white"
                  >
                    <option value="All">All Assignment Statuses</option>
                    <option value="Assigned">Assigned Teachers</option>
                    <option value="Pending Teacher Assignment">Pending Assignment</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto border border-[#E7DED1] rounded-xl">
                <table className="w-full text-left">
                  <thead className="bg-[#FAF6EF] text-[10px] font-bold text-gray-500 uppercase border-b border-[#E7DED1]">
                    <tr>
                      <th className="p-3">Enrollment ID</th>
                      <th className="p-3">Student</th>
                      <th className="p-3">Course / Instrument</th>
                      <th className="p-3">Branch & Mode</th>
                      <th className="p-3">Assigned Teacher</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {enrollments
                      .filter(e => {
                        if (instrumentFilter !== 'All' && !((e.instrument || e.courseName || '').toLowerCase().includes(instrumentFilter.toLowerCase()))) return false;
                        if (assignmentStatusFilter !== 'All' && e.assignmentStatus !== assignmentStatusFilter) return false;
                        return true;
                      })
                      .map(enr => {
                        const authUser = getAuthoritativeUser ? getAuthoritativeUser(enr.studentEmail || enr.studentId) : undefined;
                        const studentName = authUser?.fullName || enr.studentName;
                        const studentPhoto = authUser?.avatar || (authUser as any)?.photo || (enr as any).studentPhoto || (enr as any).studentPhotoUrl || (enr as any).photoUrl;

                        return (
                          <tr key={enr.id} className="hover:bg-[#FAF6EF]/30 transition-colors">
                            <td className="p-3 font-mono font-bold text-gray-700 text-[11px]">{enr.id}</td>
                            <td className="p-3">
                              <div className="flex items-center gap-2">
                                {studentPhoto ? (
                                  <img src={studentPhoto} alt={studentName} className="w-8 h-8 rounded-full object-cover border border-amber-200 shrink-0" />
                                ) : (
                                  <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs border border-amber-200 shrink-0">
                                    {studentName.charAt(0)}
                                  </div>
                                )}
                                <div>
                                  <div className="font-bold text-gray-900">{studentName}</div>
                                  <div className="text-[10px] text-gray-400">{enr.studentEmail} • {enr.studentPhone}</div>
                                </div>
                              </div>
                            </td>
                            <td className="p-3">
                              <span className="font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                                🎵 {enr.courseName || enr.instrument}
                              </span>
                              <div className="text-[10px] text-gray-500 mt-1">{enr.level}</div>
                            </td>
                            <td className="p-3">
                              <div className="font-bold text-gray-800">{enr.branch}</div>
                              <span className="text-[10px] text-gray-500">{enr.learningMode}</span>
                            </td>
                            <td className="p-3">
                              {enr.assignedTeacherName ? (
                                <div>
                                  <div className="font-bold text-gray-900">{enr.assignedTeacherName}</div>
                                  <div className="text-[10px] text-gray-400">{enr.assignedTeacherEmail}</div>
                                  <span className="text-[9px] text-gray-400 block mt-0.5">Assigned by: {enr.assignedBy || 'System'}</span>
                                </div>
                              ) : (
                                <span className="text-red-600 font-bold bg-red-50 px-2 py-0.5 rounded border border-red-200">
                                  ⚠️ Pending Teacher
                                </span>
                              )}
                            </td>
                            <td className="p-3">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${enr.assignmentStatus === 'Assigned' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-amber-50 text-amber-800 border border-amber-200'}`}>
                                {enr.assignmentStatus}
                              </span>
                              <div className="text-[10px] text-gray-400 mt-1">Progress: {enr.progressPercent || 0}%</div>
                            </td>
                            <td className="p-3 text-right space-x-1">
                              <button
                                onClick={() => {
                                  const res = autoAssignTeacherForEnrollment(enr.id);
                                  alert(res.message);
                                }}
                                className="px-2.5 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded text-[10px] font-bold cursor-pointer transition-colors"
                              >
                                ⚡ Auto-Assign
                              </button>
                              <button
                                onClick={() => {
                                  setReassigningEnrollment(enr);
                                  const targetInst = (enr.instrument || enr.courseName || '').toLowerCase();
                                  const qualified = teachers.filter(t => t.specializations.some(s => targetInst.includes(s.toLowerCase()) || s.toLowerCase().includes(targetInst)));
                                  setSelectedTargetTeacherId(qualified[0]?.id || teachers[0]?.id || '');
                                }}
                                className="px-2.5 py-1 bg-[#2B2B2B] hover:bg-black text-white rounded text-[10px] font-bold cursor-pointer transition-colors"
                              >
                                ✏️ Reassign
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* CREATE USER MODAL */}
      <AnimatePresence>
        {isAddUserOpen && (
          <div className="fixed inset-0 bg-[#2B2B2B]/75 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div className="bg-white border border-[#E7DED1] max-w-md w-full rounded-2xl p-6 text-left space-y-4 shadow-2xl text-xs">
              <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                <h3 className="font-display font-black text-sm uppercase text-[#2B2B2B]">Create System Account</h3>
                <button onClick={() => setIsAddUserOpen(false)} className="text-gray-400 hover:text-black">
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Full Name</label>
                  <input
                    type="text"
                    value={newUserForm.fullName}
                    onChange={(e) => setNewUserForm({ ...newUserForm, fullName: e.target.value })}
                    placeholder="e.g. Solomon Kassaye"
                    className="w-full p-2.5 border border-[#E7DED1] rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Email Address</label>
                  <input
                    type="email"
                    value={newUserForm.email}
                    onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                    placeholder="solomon@begena.com"
                    className="w-full p-2.5 border border-[#E7DED1] rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={newUserForm.phone}
                    onChange={(e) => setNewUserForm({ ...newUserForm, phone: e.target.value })}
                    placeholder="+251911223344"
                    className="w-full p-2.5 border border-[#E7DED1] rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Assign Role</label>
                  <select
                    value={newUserForm.role}
                    onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value as UserRole })}
                    className="w-full p-2.5 border border-[#E7DED1] rounded-xl bg-white font-bold"
                  >
                    <option value="student">Student</option>
                    <option value="parent">Parent</option>
                    <option value="teacher">Teacher</option>
                    <option value="registration_staff">Registration Staff</option>
                    <option value="branch_manager">Branch Manager</option>
                    <option value="accountant">Accountant</option>
                    <option value="admin">Admin</option>
                    <option value="super_admin">Super Admin</option>
                    <option value="founder">Founder</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Branch Scope</label>
                  <select
                    value={newUserForm.branch}
                    onChange={(e) => setNewUserForm({ ...newUserForm, branch: e.target.value })}
                    className="w-full p-2.5 border border-[#E7DED1] rounded-xl bg-white font-bold"
                  >
                    <option value="Hawassa main Branch">Hawassa main Branch</option>
                    <option value="Online">Online Campus</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button variant="secondary" className="flex-1" onClick={() => setIsAddUserOpen(false)}>Cancel</Button>
                <Button variant="primary" className="flex-1 bg-[#E89B52] text-white" onClick={handleCreateUser}>Create User</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* VIEW USER PROFILE MODAL */}
      <AnimatePresence>
        {selectedUser && (
          <div className="fixed inset-0 bg-[#2B2B2B]/75 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div className="bg-white border border-[#E7DED1] max-w-md w-full rounded-2xl p-6 text-left space-y-4 shadow-2xl text-xs">
              <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                <h3 className="font-display font-black text-sm uppercase text-[#2B2B2B]">User Profile Dossier</h3>
                <button onClick={() => setSelectedUser(null)} className="text-gray-400 hover:text-black">
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-3 font-mono text-[11px] bg-[#FAF6EF] p-4 rounded-xl border border-[#E7DED1]">
                <div><b>Full Name:</b> {selectedUser.fullName}</div>
                <div><b>Email:</b> {selectedUser.email}</div>
                <div><b>Phone:</b> {selectedUser.phone}</div>
                <div><b>Role:</b> {selectedUser.role.toUpperCase()}</div>
                <div><b>Branch:</b> {selectedUser.branch}</div>
                <div><b>Created:</b> {selectedUser.createdDate}</div>
                <div><b>Status:</b> {selectedUser.status}</div>
              </div>

              <Button variant="primary" className="w-full bg-[#E89B52] text-white" onClick={() => setSelectedUser(null)}>
                Close Dossier
              </Button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* VIEW CERTIFICATE QR MODAL */}
      <AnimatePresence>
        {selectedCert && (
          <div className="fixed inset-0 bg-[#2B2B2B]/75 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div className="bg-white border border-[#E7DED1] max-w-sm w-full rounded-2xl p-6 text-center space-y-4 shadow-2xl text-xs">
              <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                <h3 className="font-display font-black text-sm uppercase text-[#2B2B2B]">Verified Digital Seal</h3>
                <button onClick={() => setSelectedCert(null)} className="text-gray-400 hover:text-black">
                  <X size={18} />
                </button>
              </div>

              <div className="p-4 bg-white border-2 border-dashed border-[#E89B52] rounded-xl space-y-2">
                {selectedCert.qrCodeUrl ? (
                  <img src={selectedCert.qrCodeUrl} className="w-32 h-32 mx-auto" alt="QR Code" />
                ) : null}
                <span className="block font-mono font-bold text-[#E89B52] text-xs">{selectedCert.id}</span>
                <span className="block font-bold text-gray-800">{selectedCert.studentName}</span>
                <span className="block text-gray-500 text-[10px]">{selectedCert.course} ({selectedCert.level})</span>
              </div>

              <Button variant="primary" className="w-full bg-[#E89B52] text-white" onClick={() => setSelectedCert(null)}>
                Close QR Verification
              </Button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ISSUE CERTIFICATE MODAL */}
      <AnimatePresence>
        {isIssueCertOpen && (
          <div className="fixed inset-0 bg-[#2B2B2B]/75 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div className="bg-white border border-[#E7DED1] max-w-md w-full rounded-2xl p-6 text-left space-y-4 shadow-2xl text-xs">
              <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                <h3 className="font-display font-black text-sm uppercase text-[#2B2B2B]">Issue Verified Certificate</h3>
                <button onClick={() => setIsIssueCertOpen(false)} className="text-gray-400 hover:text-black cursor-pointer">
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Student Full Name</label>
                  <input
                    type="text"
                    value={certForm.studentName}
                    onChange={(e) => setCertForm({ ...certForm, studentName: e.target.value })}
                    placeholder="e.g. Abebe Kebede"
                    className="w-full p-2.5 border border-[#E7DED1] rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Student ID (Optional)</label>
                  <input
                    type="text"
                    value={certForm.studentId}
                    onChange={(e) => setCertForm({ ...certForm, studentId: e.target.value })}
                    placeholder="e.g. ABS-PZ-2026-0042"
                    className="w-full p-2.5 border border-[#E7DED1] rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Course Name</label>
                  <select
                    value={certForm.course}
                    onChange={(e) => setCertForm({ ...certForm, course: e.target.value })}
                    className="w-full p-2.5 border border-[#E7DED1] rounded-xl bg-white font-bold"
                  >
                    <option value="Begena Mastery">Begena Mastery</option>
                    <option value="Krar Acoustic">Krar Acoustic</option>
                    <option value="Masenqo Classical">Masenqo Classical</option>
                    <option value="Washint Traditional Flute">Washint Traditional Flute</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Level Accomplished</label>
                  <input
                    type="text"
                    value={certForm.level}
                    onChange={(e) => setCertForm({ ...certForm, level: e.target.value })}
                    placeholder="e.g. Basic Level 1"
                    className="w-full p-2.5 border border-[#E7DED1] rounded-xl outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button variant="secondary" className="flex-1 cursor-pointer" onClick={() => setIsIssueCertOpen(false)}>Cancel</Button>
                <Button variant="primary" className="flex-1 bg-[#E89B52] text-white cursor-pointer" onClick={handleIssueCertificateSubmit}>
                  Generate & Issue Seal
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* PUBLISH ANNOUNCEMENT MODAL */}
      <AnimatePresence>
        {isAddAnnouncementOpen && (
          <div className="fixed inset-0 bg-[#2B2B2B]/75 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div className="bg-white border border-[#E7DED1] max-w-md w-full rounded-2xl p-6 text-left space-y-4 shadow-2xl text-xs">
              <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                <h3 className="font-display font-black text-sm uppercase text-[#2B2B2B]">Publish Broadcast Announcement</h3>
                <button onClick={() => setIsAddAnnouncementOpen(false)} className="text-gray-400 hover:text-black cursor-pointer">
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Announcement Title</label>
                  <input
                    type="text"
                    value={ancForm.title}
                    onChange={(e) => setAncForm({ ...ancForm, title: e.target.value })}
                    placeholder="e.g. Grand Recital & Community Night"
                    className="w-full p-2.5 border border-[#E7DED1] rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Target Audience</label>
                  <select
                    value={ancForm.target}
                    onChange={(e) => setAncForm({ ...ancForm, target: e.target.value })}
                    className="w-full p-2.5 border border-[#E7DED1] rounded-xl bg-white font-bold"
                  >
                    <option value="All Students & Parents">All Students & Parents</option>
                    <option value="All Faculty Teachers">All Faculty Teachers</option>
                    <option value="Hawassa main Branch Only">Hawassa main Branch Only</option>
                    <option value="Online Students Only">Online Students Only</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Message Body / Details</label>
                  <textarea
                    value={ancForm.content}
                    onChange={(e) => setAncForm({ ...ancForm, content: e.target.value })}
                    rows={4}
                    placeholder="Write the broadcast message content here..."
                    className="w-full p-2.5 border border-[#E7DED1] rounded-xl outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button variant="secondary" className="flex-1 cursor-pointer" onClick={() => setIsAddAnnouncementOpen(false)}>Cancel</Button>
                <Button variant="primary" className="flex-1 bg-[#E89B52] text-white cursor-pointer" onClick={handlePublishAnnouncementSubmit}>
                  Broadcast Announcement
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ADD CAMPUS BRANCH MODAL */}
      <AnimatePresence>
        {isAddBranchOpen && (
          <div className="fixed inset-0 bg-[#2B2B2B]/75 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div className="bg-white border border-[#E7DED1] max-w-md w-full rounded-2xl p-6 text-left space-y-4 shadow-2xl text-xs">
              <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                <h3 className="font-display font-black text-sm uppercase text-[#2B2B2B]">Add New School Campus</h3>
                <button onClick={() => setIsAddBranchOpen(false)} className="text-gray-400 hover:text-black cursor-pointer">
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Branch Name</label>
                  <input
                    type="text"
                    value={branchForm.name}
                    onChange={(e) => setBranchForm({ ...branchForm, name: e.target.value })}
                    placeholder="e.g. Kazanchis Branch"
                    className="w-full p-2.5 border border-[#E7DED1] rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Location Details</label>
                  <input
                    type="text"
                    value={branchForm.location}
                    onChange={(e) => setBranchForm({ ...branchForm, location: e.target.value })}
                    placeholder="e.g. Kazanchis, Near UNECA"
                    className="w-full p-2.5 border border-[#E7DED1] rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Branch Manager</label>
                  <input
                    type="text"
                    value={branchForm.manager}
                    onChange={(e) => setBranchForm({ ...branchForm, manager: e.target.value })}
                    placeholder="e.g. Merigeta Tekle"
                    className="w-full p-2.5 border border-[#E7DED1] rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Contact Phone</label>
                  <input
                    type="text"
                    value={branchForm.phone}
                    onChange={(e) => setBranchForm({ ...branchForm, phone: e.target.value })}
                    placeholder="+251911990011"
                    className="w-full p-2.5 border border-[#E7DED1] rounded-xl outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button variant="secondary" className="flex-1 cursor-pointer" onClick={() => setIsAddBranchOpen(false)}>Cancel</Button>
                <Button
                  variant="primary"
                  className="flex-1 bg-[#E89B52] text-white cursor-pointer"
                  onClick={() => {
                    if (!branchForm.name) return;
                    const newBr: BranchRecord = {
                      id: `br_${Date.now()}`,
                      name: branchForm.name,
                      location: branchForm.location || 'Addis Ababa',
                      manager: branchForm.manager || 'Assigned Staff',
                      phone: branchForm.phone || '+251911000000',
                      studentsCount: 0,
                      teachersCount: 1,
                      revenueETB: 0,
                      status: 'Active'
                    };
                    setBranches([...branches, newBr]);
                    addNotification('Branch Added', `Created campus branch: ${branchForm.name}`, 'system');
                    logAction('Added Campus Branch', branchForm.name);
                    setIsAddBranchOpen(false);
                    setBranchForm({ name: '', location: '', manager: '', phone: '' });
                  }}
                >
                  Create Branch
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ADD COURSE OFFERING MODAL */}
      <AnimatePresence>
        {isAddCourseOpen && (
          <div className="fixed inset-0 bg-[#2B2B2B]/75 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div className="bg-white border border-[#E7DED1] max-w-md w-full rounded-2xl p-6 text-left space-y-4 shadow-2xl text-xs">
              <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                <h3 className="font-display font-black text-sm uppercase text-[#2B2B2B]">Add New Course Offering</h3>
                <button onClick={() => setIsAddCourseOpen(false)} className="text-gray-400 hover:text-black cursor-pointer">
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Course Title</label>
                  <input
                    type="text"
                    value={courseForm.name}
                    onChange={(e) => setCourseForm({ ...courseForm, name: e.target.value })}
                    placeholder="e.g. Advanced Begena Chants"
                    className="w-full p-2.5 border border-[#E7DED1] rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Instrument Category</label>
                  <select
                    value={courseForm.category}
                    onChange={(e) => setCourseForm({ ...courseForm, category: e.target.value })}
                    className="w-full p-2.5 border border-[#E7DED1] rounded-xl bg-white font-bold"
                  >
                    <option value="Spiritual Harp">Begena (Spiritual Harp)</option>
                    <option value="Traditional Lyre">Krar (Traditional Lyre)</option>
                    <option value="Single-String Lute">Masenqo (Single-String Lute)</option>
                    <option value="Traditional Flute">Washint (Traditional Flute)</option>
                    <option value="Sacred Liturgical Chants">Sacred Liturgical Chants</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">3-Month Tuition Fee (ETB)</label>
                  <input
                    type="number"
                    value={courseForm.fee}
                    onChange={(e) => setCourseForm({ ...courseForm, fee: Number(e.target.value) })}
                    className="w-full p-2.5 border border-[#E7DED1] rounded-xl outline-none font-mono font-bold"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button variant="secondary" className="flex-1 cursor-pointer" onClick={() => setIsAddCourseOpen(false)}>Cancel</Button>
                <Button
                  variant="primary"
                  className="flex-1 bg-[#E89B52] text-white cursor-pointer"
                  onClick={() => {
                    if (!courseForm.name) return;
                    const newCourse: CourseRecord = {
                      id: `crs_${Date.now()}`,
                      name: courseForm.name,
                      category: courseForm.category,
                      levels: ['Basic 1', 'Basic 2', 'Advanced'],
                      teachersCount: 2,
                      studentsCount: 0,
                      branches: ['Hawassa Main Branch'],
                      threeMonthFeeETB: courseForm.fee || 3000,
                      status: 'Active'
                    };
                    setCourses([...courses, newCourse]);
                    addNotification('Course Created', `Added course offering: ${courseForm.name}`, 'system');
                    logAction('Added Course Offering', courseForm.name);
                    setIsAddCourseOpen(false);
                    setCourseForm({ name: '', category: 'Spiritual Harp', fee: 3000 });
                  }}
                >
                  Create Course
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* EDIT TEACHER SPECIALIZATIONS MODAL */}
      <AnimatePresence>
        {editingTeacher && (
          <div className="fixed inset-0 bg-[#2B2B2B]/75 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div className="bg-white border border-[#E7DED1] max-w-lg w-full rounded-2xl p-6 text-left space-y-4 shadow-2xl text-xs">
              <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                <div>
                  <h3 className="font-display font-black text-sm uppercase text-[#2B2B2B]">Faculty Specializations & Capacity</h3>
                  <p className="text-[10px] text-gray-500">Configure instrument qualifications for {editingTeacher.fullName}</p>
                </div>
                <button onClick={() => setEditingTeacher(null)} className="text-gray-400 hover:text-black">
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2">Instrument Qualifications</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Begena', 'Krar', 'Masenqo', 'Washint', 'Vocal', 'Kebero'].map(inst => {
                      const isChecked = selectedSpecs.includes(inst);
                      return (
                        <label key={inst} className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer font-bold ${isChecked ? 'bg-amber-50 border-[#E89B52] text-amber-900' : 'bg-gray-50 border-gray-200 text-gray-600'}`}>
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedSpecs([...selectedSpecs, inst]);
                              } else {
                                setSelectedSpecs(selectedSpecs.filter(s => s !== inst));
                              }
                            }}
                            className="accent-[#E89B52]"
                          />
                          <span>🎵 {inst}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Max Student Capacity</label>
                    <input
                      type="number"
                      value={teacherCapacity}
                      onChange={(e) => setTeacherCapacity(Number(e.target.value) || 20)}
                      className="w-full p-2 border border-[#E7DED1] rounded-lg font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Mode Support</label>
                    <div className="space-y-1 pt-1">
                      <label className="flex items-center gap-1.5 font-bold text-gray-700">
                        <input type="checkbox" checked={supportsInPerson} onChange={e => setSupportsInPerson(e.target.checked)} className="accent-[#E89B52]" />
                        <span>In-Person Lessons</span>
                      </label>
                      <label className="flex items-center gap-1.5 font-bold text-gray-700">
                        <input type="checkbox" checked={supportsOnline} onChange={e => setSupportsOnline(e.target.checked)} className="accent-[#E89B52]" />
                        <span>Online Lessons</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Telegram Contact Username</label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 font-bold text-sky-600">@</span>
                    <input
                      type="text"
                      value={teacherTelegramHandle}
                      onChange={(e) => setTeacherTelegramHandle(e.target.value)}
                      placeholder="e.g. abel_begena"
                      className="w-full pl-8 pr-3 py-2 border border-[#E7DED1] rounded-lg font-mono font-bold text-sky-900 bg-sky-50/50"
                    />
                  </div>
                  <p className="text-[9px] text-gray-400 mt-1">This contact automatically appears in assigned online students' portals.</p>
                </div>
              </div>

              <div className="flex gap-2 pt-3 border-t border-gray-100">
                <Button variant="secondary" className="flex-1 cursor-pointer" onClick={() => setEditingTeacher(null)}>Cancel</Button>
                <Button
                  variant="primary"
                  className="flex-1 bg-[#E89B52] text-white cursor-pointer"
                  onClick={() => {
                    updateTeacherSpecializations(
                      editingTeacher.id,
                      selectedSpecs,
                      selectedTeacherBranches,
                      teacherCapacity,
                      supportsOnline,
                      supportsInPerson,
                      teacherTelegramHandle
                    );
                    addNotification('Faculty Profile Updated', `Updated specializations & Telegram contact for ${editingTeacher.fullName}`, 'system');
                    setEditingTeacher(null);
                  }}
                >
                  Save Qualifications & Contact
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* REASSIGN TEACHER TO ENROLLMENT MODAL */}
      <AnimatePresence>
        {reassigningEnrollment && (
          <div className="fixed inset-0 bg-[#2B2B2B]/75 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div className="bg-white border border-[#E7DED1] max-w-md w-full rounded-2xl p-6 text-left space-y-4 shadow-2xl text-xs">
              <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                <div>
                  <h3 className="font-display font-black text-sm uppercase text-[#2B2B2B]">Assign / Reassign Teacher</h3>
                  <p className="text-[10px] text-gray-500">Student: <span className="font-bold text-gray-900">{reassigningEnrollment.studentName}</span></p>
                </div>
                <button onClick={() => setReassigningEnrollment(null)} className="text-gray-400 hover:text-black">
                  <X size={18} />
                </button>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 space-y-1">
                <p className="font-bold text-amber-900 text-xs">Course Instrument: 🎵 {reassigningEnrollment.courseName || reassigningEnrollment.instrument}</p>
                <p className="text-[10px] text-amber-800">Branch: {reassigningEnrollment.branch} • Mode: {reassigningEnrollment.learningMode}</p>
                <p className="text-[10px] text-amber-800">Current Assigned Teacher: <span className="font-bold">{reassigningEnrollment.assignedTeacherName || 'None (Pending)'}</span></p>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2">Select Qualified Instructor</label>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {teachers.map(teacher => {
                    const instName = (reassigningEnrollment.instrument || reassigningEnrollment.courseName || '').toLowerCase();
                    const isQualified = teacher.specializations.some(s => instName.includes(s.toLowerCase()) || s.toLowerCase().includes(instName));
                    const activeCount = enrollments.filter(e => e.assignedTeacherId === teacher.id && e.status === 'Active').length;
                    const isSelected = selectedTargetTeacherId === teacher.id;

                    return (
                      <div
                        key={teacher.id}
                        onClick={() => setSelectedTargetTeacherId(teacher.id)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${isSelected ? 'bg-amber-100 border-[#E89B52]' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'}`}
                      >
                        <div className="flex items-center gap-2.5">
                          {teacher.photo ? (
                            <img src={teacher.photo} alt={teacher.fullName} className="w-9 h-9 rounded-full object-cover" />
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-[#3B2818] text-[#E89B52] font-bold text-xs flex items-center justify-center shrink-0">
                              {teacher.fullName?.charAt(0) || 'T'}
                            </div>
                          )}
                          <div>
                            <div className="font-bold text-gray-900 flex items-center gap-1">
                              {teacher.fullName}
                              {isQualified && <span className="text-[9px] bg-green-100 text-green-800 px-1.5 py-0.2 rounded font-bold">Qualified</span>}
                            </div>
                            <div className="text-[10px] text-gray-500">
                              Workload: {activeCount} / {teacher.capacity}
                            </div>
                          </div>
                        </div>
                        <input
                          type="radio"
                          name="targetTeacher"
                          checked={isSelected}
                          onChange={() => setSelectedTargetTeacherId(teacher.id)}
                          className="accent-[#E89B52]"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-2 pt-2 border-t border-gray-100">
                <Button variant="secondary" className="flex-1 cursor-pointer" onClick={() => setReassigningEnrollment(null)}>Cancel</Button>
                <Button
                  variant="primary"
                  className="flex-1 bg-[#E89B52] text-white cursor-pointer"
                  disabled={!selectedTargetTeacherId}
                  onClick={() => {
                    const targetTeacher = teachers.find(t => t.id === selectedTargetTeacherId);
                    if (!targetTeacher) return;
                    assignTeacherToEnrollment(
                      reassigningEnrollment.id,
                      targetTeacher.id,
                      currentUser?.fullName || 'Administrative Staff'
                    );
                    addNotification('Teacher Reassigned', `Assigned ${targetTeacher.fullName} to ${reassigningEnrollment.studentName} for ${reassigningEnrollment.courseName}`, 'registration');
                    setReassigningEnrollment(null);
                  }}
                >
                  Confirm Assignment
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

