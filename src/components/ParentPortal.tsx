import React, { useState, useEffect } from 'react';
import {
  Users, UserCheck, Heart, Calendar, Clock, BookOpen, Award, DollarSign,
  FileText, MessageSquare, Bell, Shield, CheckCircle, AlertTriangle, XCircle,
  Plus, Search, ChevronRight, Download, ExternalLink, QrCode, Filter, RefreshCw,
  HelpCircle, Settings, Phone, Mail, MapPin, Check, X, ArrowRight, Play, Eye,
  Sparkles, Lock, Share2, LogOut, Send, Paperclip, Grid, ShieldAlert, UserPlus,
  BarChart2, FileCheck, CalendarCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { Button, Input } from './InteractiveComponents';
import { ThemeToggle } from './ThemeToggle';
import { PageId } from '../types';

interface ParentPortalProps {
  onNavigate: (page: PageId, params?: any) => void;
  lang: 'en' | 'am';
}

export interface LinkedChild {
  id: string; // e.g., 'std_101'
  studentId: string; // e.g., 'ABS-PZ-2026-0042'
  fullName: string;
  photoUrl?: string;
  age: number;
  gender: string;
  branch: string;
  currentCourse: string;
  currentLevel: string;
  learningMode: 'In-Person' | 'Online';
  teacherName: string;
  attendanceRate: number; // e.g. 92
  learningProgress: number; // e.g. 80
  paymentStatus: 'PAID' | 'DUE' | 'OVERDUE';
  nextClass: string; // e.g. "Tomorrow, 10:00 AM - Piazza Branch Room 204"
  relationship: string; // 'Primary Guardian', 'Mother', 'Father', 'Uncle'
  linkStatus: 'APPROVED' | 'PENDING' | 'REJECTED';
}

export interface ChildAttendanceRecord {
  id: string;
  date: string;
  course: string;
  teacher: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';
  notes?: string;
}

export interface ChildAssignment {
  id: string;
  title: string;
  course: string;
  dueDate: string;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'SUBMITTED' | 'GRADED';
  grade?: string;
  teacherFeedback?: string;
}

export interface ParentSupportTicket {
  id: string;
  subject: string;
  category: string;
  childName: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
  createdDate: string;
  lastUpdate: string;
  messages: { sender: string; text: string; time: string; isStaff?: boolean }[];
}

export function ParentPortal({ onNavigate, lang }: ParentPortalProps) {
  const { currentUser, getAuthoritativeUser, addNotification, updateProfile, logout } = useAuth();

  // Active Navigation Tab inside Parent Portal
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'children' | 'link_child' | 'attendance' | 'schedule' |
    'progress' | 'assignments' | 'payments' | 'certificates' | 'messages' |
    'announcements' | 'events' | 'support' | 'profile' | 'settings'
  >('dashboard');

  // Initial children state linked to parent profile with sync to localStorage
  const [childrenList, setChildrenList] = useState<LinkedChild[]>(() => {
    const saved = localStorage.getItem(`ab_parent_children_${currentUser?.id || 'default'}`);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [];
  });

  // Selected child switcher ID
  const [selectedChildId, setSelectedChildId] = useState<string>(
    childrenList[0]?.id || ''
  );

  const selectedChild = childrenList.find(c => c.id === selectedChildId) || childrenList[0];

  // Save children to localStorage
  useEffect(() => {
    if (currentUser?.id) {
      localStorage.setItem(`ab_parent_children_${currentUser.id}`, JSON.stringify(childrenList));
    }
  }, [childrenList, currentUser?.id]);

  // Listen for student profile updates to keep linked child records in Parent Portal synchronized
  useEffect(() => {
    const syncChildProfiles = () => {
      setChildrenList(prev => prev.map(child => {
        const authChild = getAuthoritativeUser ? getAuthoritativeUser(child.id || (child as any).email || child.fullName) : undefined;
        if (authChild) {
          return {
            ...child,
            fullName: authChild.fullName || child.fullName,
            photoUrl: authChild.avatar || (authChild as any).photo || child.photoUrl
          };
        }
        return child;
      }));
    };

    window.addEventListener('user-profile-updated', syncChildProfiles);
    window.addEventListener('ab_students_updated', syncChildProfiles);
    return () => {
      window.removeEventListener('user-profile-updated', syncChildProfiles);
      window.removeEventListener('ab_students_updated', syncChildProfiles);
    };
  }, [getAuthoritativeUser]);

  // LINK CHILD FORM STATE
  const [linkInputId, setLinkInputId] = useState('');
  const [linkRelationship, setLinkRelationship] = useState('Parent / Guardian');
  const [linkVerificationCode, setLinkVerificationCode] = useState('');
  const [linkMessage, setLinkMessage] = useState<string | null>(null);

  // MESSAGING STATE
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{ sender: string; text: string; time: string; isParent: boolean }[]>([]);

  // SUPPORT TICKETS STATE
  const [supportTickets, setSupportTickets] = useState<ParentSupportTicket[]>([]);

  // NEW TICKET FORM STATE
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketCategory, setTicketCategory] = useState('Schedule');
  const [ticketDescription, setTicketDescription] = useState('');

  // ATTENDANCE RECORDS FOR SELECTED CHILD
  const [attendanceLogs] = useState<ChildAttendanceRecord[]>([]);

  // ASSIGNMENTS FOR SELECTED CHILD
  const [assignmentsList] = useState<ChildAssignment[]>([]);

  // HANDLE LINK CHILD REQUEST (Requirement 4, 5, 37)
  const handleLinkChildSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkInputId.trim()) {
      setLinkMessage('Please enter a valid Student ID (e.g. ABS-PZ-2026-0042) or Registration Code.');
      return;
    }

    // Simulate verification check
    const newLinked: LinkedChild = {
      id: `child_${Date.now()}`,
      studentId: linkInputId.toUpperCase(),
      fullName: 'Kidus Tsegaye',
      age: 11,
      gender: 'Male',
      branch: 'Lebu Branch',
      currentCourse: 'Masenqo Basics',
      currentLevel: 'Level 1',
      learningMode: 'In-Person',
      teacherName: 'Teacher Solomon',
      attendanceRate: 90,
      learningProgress: 35,
      paymentStatus: 'PAID',
      nextClass: 'Sunday, 11:00 AM (Room 104)',
      relationship: linkRelationship,
      linkStatus: 'APPROVED'
    };

    setChildrenList(prev => [...prev, newLinked]);
    addNotification('Child Linked Successfully', `Successfully verified and linked ${newLinked.fullName} (${newLinked.studentId}) to your family account!`, 'system');
    setLinkMessage(`Success! ${newLinked.fullName} has been linked to your account.`);
    setLinkInputId('');
    setLinkVerificationCode('');
    setTimeout(() => {
      setActiveTab('dashboard');
    }, 1500);
  };

  // HANDLE SEND MESSAGE TO TEACHER
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    const newMsg = {
      sender: 'Parent (You)',
      text: chatMessage,
      time: 'Just now',
      isParent: true
    };

    setChatHistory(prev => [...prev, newMsg]);
    setChatMessage('');

    // Simulate automated teacher response
    setTimeout(() => {
      setChatHistory(prev => [
        ...prev,
        {
          sender: selectedChild?.teacherName || 'Master Instructor',
          text: 'Thank you for your message! I have received your note regarding practice progress.',
          time: 'Just now',
          isParent: false
        }
      ]);
    }, 1200);
  };

  // HANDLE CREATE SUPPORT TICKET
  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject.trim() || !ticketDescription.trim()) return;

    const newTicket: ParentSupportTicket = {
      id: `TCK-PAR-${Math.floor(1000 + Math.random() * 9000)}`,
      subject: ticketSubject,
      category: ticketCategory,
      childName: selectedChild?.fullName || 'Child',
      status: 'OPEN',
      createdDate: new Date().toISOString().split('T')[0],
      lastUpdate: 'Just now',
      messages: [
        { sender: 'Parent', text: ticketDescription, time: 'Just now' }
      ]
    };

    setSupportTickets([newTicket, ...supportTickets]);
    addNotification('Ticket Submitted', `Support Ticket ${newTicket.id} created for school administration.`, 'system');
    setTicketSubject('');
    setTicketDescription('');
  };

  return (
    <div className="w-full bg-[#FCFBF8] min-h-screen text-[#2B2B2B] font-sans antialiased text-left">
      {/* HEADER BAR & PERSISTENT CHILD SWITCHER (Requirement 1, 6) */}
      <header className="border-b border-[#E7DED1] bg-white relative z-20 px-6 py-4 flex flex-col md:flex-row justify-between md:items-center gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#FAF6EF] rounded-xl border border-[#E7DED1]">
            <Heart className="text-[#E89B52]" size={22} />
          </div>
          <div>
            <h1 className="font-display font-black text-lg tracking-tight uppercase text-gray-800">
              Parent & Family Portal
            </h1>
            <p className="text-[10px] tracking-wider text-[#E89B52] font-bold uppercase">
              Abel Begena School • Family Learning & Guardian Desk
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle variant="pill" />
          {/* PERSISTENT CHILD SWITCHER COMPONENT (Requirement 6) */}
        {childrenList.length > 0 && (
          <div className="flex items-center gap-3 bg-[#FAF6EF] border border-[#E7DED1] p-1.5 rounded-xl">
            <span className="text-[10px] font-bold uppercase text-gray-500 pl-2 hidden sm:inline">Active Child:</span>
            <select
              value={selectedChildId}
              onChange={(e) => setSelectedChildId(e.target.value)}
              className="px-3 py-1.5 bg-white border border-[#E7DED1] rounded-lg text-xs font-bold text-[#2B2B2B] outline-none cursor-pointer"
            >
              {childrenList.map(child => (
                <option key={child.id} value={child.id}>
                  {child.fullName} ({child.currentCourse} - {child.branch})
                </option>
              ))}
            </select>
            <button
              onClick={() => setActiveTab('link_child')}
              className="p-1.5 bg-[#E89B52] hover:bg-[#d88a41] text-white rounded-lg transition-colors"
              title="Link Another Child"
            >
              <UserPlus size={16} />
            </button>
          </div>
        )}
        </div>
      </header>

      {/* CORE WORKSPACE GRID */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 p-6">
        {/* SIDEBAR NAVIGATION */}
        <aside className="lg:col-span-3 space-y-4">
          <div className="bg-white border border-[#E7DED1] rounded-2xl p-4 shadow-2xs space-y-1 text-xs font-bold">
            <p className="text-[10px] tracking-widest text-[#E89B52] font-bold px-3 py-1 uppercase">Family Portal Menu</p>

            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${activeTab === 'dashboard' ? 'bg-[#E89B52] text-white' : 'text-gray-600 hover:bg-[#FAF6EF]'}`}
            >
              <div className="flex items-center gap-2.5"><Grid size={16} /><span>Family Dashboard</span></div>
              <ChevronRight size={14} className="opacity-60" />
            </button>

            <button
              onClick={() => setActiveTab('children')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${activeTab === 'children' ? 'bg-[#E89B52] text-white' : 'text-gray-600 hover:bg-[#FAF6EF]'}`}
            >
              <div className="flex items-center gap-2.5"><Users size={16} /><span>My Children Directory</span></div>
              <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-mono font-bold">{childrenList.length}</span>
            </button>

            <button
              onClick={() => setActiveTab('progress')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${activeTab === 'progress' ? 'bg-[#E89B52] text-white' : 'text-gray-600 hover:bg-[#FAF6EF]'}`}
            >
              <div className="flex items-center gap-2.5"><BarChart2 size={16} /><span>Academic Progress</span></div>
              <ChevronRight size={14} className="opacity-60" />
            </button>

            <button
              onClick={() => setActiveTab('attendance')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${activeTab === 'attendance' ? 'bg-[#E89B52] text-white' : 'text-gray-600 hover:bg-[#FAF6EF]'}`}
            >
              <div className="flex items-center gap-2.5"><CalendarCheck size={16} /><span>Attendance Tracker</span></div>
              <span className="text-[10px] bg-green-100 text-green-800 px-1.5 py-0.5 rounded font-mono font-bold">{selectedChild?.attendanceRate || 0}%</span>
            </button>

            <button
              onClick={() => setActiveTab('schedule')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${activeTab === 'schedule' ? 'bg-[#E89B52] text-white' : 'text-gray-600 hover:bg-[#FAF6EF]'}`}
            >
              <div className="flex items-center gap-2.5"><Clock size={16} /><span>Class Timetable</span></div>
              <ChevronRight size={14} className="opacity-60" />
            </button>

            <button
              onClick={() => setActiveTab('assignments')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${activeTab === 'assignments' ? 'bg-[#E89B52] text-white' : 'text-gray-600 hover:bg-[#FAF6EF]'}`}
            >
              <div className="flex items-center gap-2.5"><BookOpen size={16} /><span>Assignments & Homework</span></div>
              <ChevronRight size={14} className="opacity-60" />
            </button>

            <button
              onClick={() => setActiveTab('payments')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${activeTab === 'payments' ? 'bg-[#E89B52] text-white' : 'text-gray-600 hover:bg-[#FAF6EF]'}`}
            >
              <div className="flex items-center gap-2.5"><DollarSign size={16} /><span>Tuition & Receipts</span></div>
              <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                selectedChild?.paymentStatus === 'PAID' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>{selectedChild?.paymentStatus}</span>
            </button>

            <button
              onClick={() => setActiveTab('certificates')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${activeTab === 'certificates' ? 'bg-[#E89B52] text-white' : 'text-gray-600 hover:bg-[#FAF6EF]'}`}
            >
              <div className="flex items-center gap-2.5"><Award size={16} /><span>Certificates & Badges</span></div>
              <ChevronRight size={14} className="opacity-60" />
            </button>

            <button
              onClick={() => setActiveTab('messages')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${activeTab === 'messages' ? 'bg-[#E89B52] text-white' : 'text-gray-600 hover:bg-[#FAF6EF]'}`}
            >
              <div className="flex items-center gap-2.5"><MessageSquare size={16} /><span>Teacher Communication</span></div>
              <ChevronRight size={14} className="opacity-60" />
            </button>

            <button
              onClick={() => setActiveTab('support')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${activeTab === 'support' ? 'bg-[#E89B52] text-white' : 'text-gray-600 hover:bg-[#FAF6EF]'}`}
            >
              <div className="flex items-center gap-2.5"><HelpCircle size={16} /><span>Support Desk</span></div>
              <ChevronRight size={14} className="opacity-60" />
            </button>
          </div>

          {/* ACTIVE CHILD QUICK CARD */}
          {selectedChild && (
            <div className="bg-[#FAF6EF]/60 border border-[#E7DED1] rounded-2xl p-4 shadow-2xs space-y-3 text-xs">
              <span className="text-[10px] font-bold uppercase text-[#E89B52] tracking-wider block">Selected Child Summary</span>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#E89B52] text-white font-bold flex items-center justify-center text-sm shadow-xs">
                  {selectedChild.fullName.charAt(0)}
                </div>
                <div>
                  <span className="font-display font-black text-sm text-gray-800 block">{selectedChild.fullName}</span>
                  <span className="font-mono text-[10px] text-gray-500">{selectedChild.studentId}</span>
                </div>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-[#E7DED1] text-[11px] text-gray-600">
                <div className="flex justify-between"><span>Course:</span><b className="text-gray-800">{selectedChild.currentCourse}</b></div>
                <div className="flex justify-between"><span>Branch:</span><b>{selectedChild.branch}</b></div>
                <div className="flex justify-between"><span>Instructor:</span><b>{selectedChild.teacherName}</b></div>
                <div className="flex justify-between"><span>Next Class:</span><b className="text-[#E89B52]">{selectedChild.nextClass}</b></div>
              </div>
            </div>
          )}
        </aside>

        {/* MAIN DISPLAY AREA */}
        <main className="lg:col-span-9 space-y-6">

          {/* TAB 1: FAMILY DASHBOARD (Requirement 1, 41) */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 animate-fadeIn text-xs">
              {/* WELCOME BANNER */}
              <div className="bg-[#2B2B2B] text-white p-6 rounded-2xl shadow-xl space-y-2 relative overflow-hidden">
                <div className="flex justify-between items-start relative z-10">
                  <div>
                    <span className="text-[10px] font-mono tracking-widest text-[#E89B52] uppercase font-bold">
                      GUARDIAN ACADEMIC HUB
                    </span>
                    <h2 className="font-display font-black text-2xl uppercase tracking-tight">
                      WELCOME, {currentUser?.fullName?.toUpperCase() || 'PARENT'}!
                    </h2>
                    <p className="text-xs text-gray-300 mt-1">
                      Monitoring academic growth, attendance, and tuition status for your children.
                    </p>
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setActiveTab('link_child')}
                    className="gap-1.5 shrink-0 bg-[#E89B52] text-white"
                  >
                    <UserPlus size={14} /> Link Child Account
                  </Button>
                </div>
              </div>

              {/* MY CHILDREN OVERVIEW CARDS (Requirement 1) */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="font-display font-black text-sm uppercase tracking-wider text-gray-800">
                    My Connected Children ({childrenList.length})
                  </h3>
                  <button
                    onClick={() => setActiveTab('link_child')}
                    className="text-xs text-[#E89B52] font-bold hover:underline"
                  >
                    + Add Another Child
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {childrenList.map((child) => (
                    <div
                      key={child.id}
                      className={`border p-5 rounded-2xl bg-white shadow-2xs space-y-4 transition-all ${
                        child.id === selectedChildId ? 'border-[#E89B52] ring-2 ring-[#E89B52]/10' : 'border-[#E7DED1]'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-[#E89B52] text-white font-black text-base flex items-center justify-center shadow-xs">
                            {child.fullName.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-display font-black text-base text-gray-800">{child.fullName}</h4>
                            <span className="font-mono text-[10px] text-gray-400 block">{child.studentId} • {child.relationship}</span>
                          </div>
                        </div>

                        <span className={`px-2 py-0.5 rounded font-mono text-[9px] font-bold ${
                          child.paymentStatus === 'PAID' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
                        }`}>
                          Tuition: {child.paymentStatus}
                        </span>
                      </div>

                      <div className="space-y-2 text-xs text-gray-600 bg-[#FAF6EF]/50 p-3 rounded-xl border border-[#E7DED1]/60">
                        <div className="flex justify-between"><span>Course & Level:</span><b className="text-gray-800">{child.currentCourse} ({child.currentLevel})</b></div>
                        <div className="flex justify-between"><span>Branch Campus:</span><b>{child.branch} ({child.learningMode})</b></div>
                        <div className="flex justify-between"><span>Assigned Instructor:</span><b>{child.teacherName}</b></div>
                        <div className="flex justify-between"><span>Next Scheduled Class:</span><b className="text-[#E89B52]">{child.nextClass}</b></div>
                      </div>

                      {/* PROGRESS BARS */}
                      <div className="space-y-2">
                        <div>
                          <div className="flex justify-between text-[10px] font-bold mb-1">
                            <span>Attendance Rate</span>
                            <span className="text-green-700 font-mono">{child.attendanceRate}%</span>
                          </div>
                          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500 rounded-full" style={{ width: `${child.attendanceRate}%` }} />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-[10px] font-bold mb-1">
                            <span>Course Progress</span>
                            <span className="text-[#E89B52] font-mono">{child.learningProgress}%</span>
                          </div>
                          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-[#E89B52] rounded-full" style={{ width: `${child.learningProgress}%` }} />
                          </div>
                        </div>
                      </div>

                      {/* QUICK ACTIONS */}
                      <div className="flex gap-2 pt-2 border-t border-gray-100">
                        <Button
                          variant="primary"
                          size="sm"
                          className="flex-1 text-[10px] bg-[#E89B52] text-white"
                          onClick={() => { setSelectedChildId(child.id); setActiveTab('progress'); }}
                        >
                          View Progress
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          className="flex-1 text-[10px]"
                          onClick={() => { setSelectedChildId(child.id); setActiveTab('attendance'); }}
                        >
                          Attendance
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          className="flex-1 text-[10px]"
                          onClick={() => { setSelectedChildId(child.id); setActiveTab('payments'); }}
                        >
                          Payments
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* RECENT ANNOUNCEMENTS FOR PARENTS */}
              <div className="bg-white border border-[#E7DED1] p-5 rounded-2xl shadow-2xs space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="font-display font-black text-sm uppercase tracking-wider text-gray-800">
                    Important School Announcements for Parents
                  </h3>
                  <span className="text-[10px] text-gray-400 font-mono">July 2026</span>
                </div>

                <div className="p-4 bg-[#FAF6EF]/40 border border-[#E7DED1] rounded-xl space-y-1.5">
                  <div className="flex justify-between items-center font-bold text-xs">
                    <span className="text-gray-800">Grand Begena Recital & Parent Community Assembly</span>
                    <span className="text-[9px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-mono">ALL BRANCHES</span>
                  </div>
                  <p className="text-gray-600 text-xs leading-relaxed">
                    Dear Parents, Founder Abel and the faculty invite you to attend our quarterly student harp recital on Saturday, August 1st at Piazza Branch main auditorium. Refreshments will be served.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: LINK CHILD ACCOUNT (Requirement 3, 4, 5, 37) */}
          {activeTab === 'link_child' && (
            <div className="bg-white border border-[#E7DED1] p-6 rounded-2xl shadow-2xs space-y-6 animate-fadeIn text-xs">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-[#E89B52] uppercase font-bold">SECURITY VERIFICATION</span>
                <h2 className="font-display font-black text-xl uppercase">Link Student to Family Account</h2>
                <p className="text-gray-500 text-xs mt-1">
                  Connect your child's student record using their official Student ID, Registration Code, or Verification Link.
                </p>
              </div>

              {linkMessage && (
                <div className={`p-4 rounded-xl border font-bold text-xs ${
                  linkMessage.startsWith('Success') ? 'bg-green-50 text-green-800 border-green-200' : 'bg-red-50 text-red-800 border-red-200'
                }`}>
                  {linkMessage}
                </div>
              )}

              <form onSubmit={handleLinkChildSubmit} className="space-y-4 max-w-xl">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-600 uppercase">Student ID / Registration Code *</label>
                  <Input
                    placeholder="e.g. ABS-PZ-2026-0042 or ABS-MG-2026-0018"
                    value={linkInputId}
                    onChange={(e) => setLinkInputId(e.target.value)}
                    required
                  />
                  <span className="text-[10px] text-gray-400 block">Provided on student admission receipt or student card.</span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-600 uppercase">Your Relationship to Student *</label>
                  <select
                    value={linkRelationship}
                    onChange={(e) => setLinkRelationship(e.target.value)}
                    className="w-full p-2.5 bg-[#FAF6EF] border border-[#E7DED1] rounded-xl text-xs font-bold outline-none"
                  >
                    <option value="Primary Guardian">Primary Guardian</option>
                    <option value="Mother">Mother</option>
                    <option value="Father">Father</option>
                    <option value="Relative / Sponsor">Relative / Sponsor</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-600 uppercase">Parent Verification Security Pin (Optional)</label>
                  <Input
                    type="password"
                    placeholder="Enter 4-digit code if generated by Registration Staff"
                    value={linkVerificationCode}
                    onChange={(e) => setLinkVerificationCode(e.target.value)}
                  />
                </div>

                <div className="pt-2">
                  <Button type="submit" variant="primary" className="bg-[#E89B52] text-white gap-2">
                    <UserPlus size={16} /> Request Secure Child Link
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 3: ACADEMIC PROGRESS (Requirement 9, 10, 18) */}
          {activeTab === 'progress' && selectedChild && (
            <div className="bg-white border border-[#E7DED1] p-6 rounded-2xl shadow-2xs space-y-6 animate-fadeIn text-xs">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-[10px] font-mono tracking-widest text-[#E89B52] uppercase font-bold">COURSE CURRICULUM</span>
                  <h2 className="font-display font-black text-xl uppercase">{selectedChild.fullName}'s Learning Progress</h2>
                </div>
                <span className="px-3 py-1 bg-amber-50 text-amber-800 rounded-full font-mono font-bold text-xs border border-amber-200">
                  Overall: {selectedChild.learningProgress}% Completed
                </span>
              </div>

              {/* BEGENA / INSTRUMENT MODULES BREAKDOWN */}
              <div className="p-5 bg-[#FAF6EF]/40 border border-[#E7DED1] rounded-2xl space-y-4">
                <div className="flex justify-between items-center border-b border-[#E7DED1] pb-3">
                  <div>
                    <h3 className="font-display font-black text-base text-gray-800">{selectedChild.currentCourse}</h3>
                    <p className="text-[11px] text-gray-500">Instructor: {selectedChild.teacherName} • {selectedChild.branch}</p>
                  </div>
                  <span className="font-mono text-sm font-bold text-[#E89B52]">{selectedChild.currentLevel}</span>
                </div>

                <div className="space-y-3">
                  {[
                    { module: 'Module 1: History & Spiritual Foundation of Begena', status: 'COMPLETED', score: '100%' },
                    { module: 'Module 2: Geez Note Symbols & String Tuning Mastery', status: 'COMPLETED', score: '95%' },
                    { module: 'Module 3: Traditional Hand Position & Resonance Control', status: 'COMPLETED', score: '90%' },
                    { module: 'Module 4: Traditional Mezmur Recitation & Strumming', status: 'IN_PROGRESS', score: '80%' },
                    { module: 'Module 5: Advanced Acoustic Tuning & Solos', status: 'LOCKED', score: '0%' }
                  ].map((m, idx) => (
                    <div key={idx} className="p-3 bg-white border border-gray-100 rounded-xl flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] ${
                          m.status === 'COMPLETED' ? 'bg-green-500 text-white' : m.status === 'IN_PROGRESS' ? 'bg-[#E89B52] text-white animate-pulse' : 'bg-gray-200 text-gray-400'
                        }`}>
                          {m.status === 'COMPLETED' ? '✓' : idx + 1}
                        </div>
                        <span className="font-bold text-gray-800">{m.module}</span>
                      </div>
                      <span className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded ${
                        m.status === 'COMPLETED' ? 'bg-green-50 text-green-700' : m.status === 'IN_PROGRESS' ? 'bg-amber-50 text-amber-800' : 'bg-gray-50 text-gray-400'
                      }`}>{m.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ATTENDANCE TRACKER (Requirement 11, 12) */}
          {activeTab === 'attendance' && selectedChild && (
            <div className="bg-white border border-[#E7DED1] p-6 rounded-2xl shadow-2xs space-y-6 animate-fadeIn text-xs">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-[10px] font-mono tracking-widest text-[#E89B52] uppercase font-bold">ATTENDANCE AUDIT</span>
                  <h2 className="font-display font-black text-xl uppercase">{selectedChild.fullName}'s Class Attendance</h2>
                </div>
                <div className="p-3 bg-green-50 border border-green-200 rounded-xl text-center">
                  <span className="block text-[9px] text-green-800 font-bold uppercase">Attendance Rate</span>
                  <span className="font-mono text-xl font-black text-green-700">{selectedChild.attendanceRate}%</span>
                </div>
              </div>

              {/* LOGS TABLE */}
              <div className="border border-gray-100 rounded-xl overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-[#FAF6EF] text-[10px] font-bold text-gray-400 uppercase">
                    <tr>
                      <th className="p-3">Date</th>
                      <th className="p-3">Course / Instructor</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Teacher Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendanceLogs.map((log) => (
                      <tr key={log.id} className="border-b border-gray-100 hover:bg-[#FAF6EF]/20">
                        <td className="p-3 font-mono font-bold text-gray-800">{log.date}</td>
                        <td className="p-3">{log.course} ({log.teacher})</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold ${
                            log.status === 'PRESENT' ? 'bg-green-50 text-green-700 border border-green-200' :
                            log.status === 'LATE' ? 'bg-amber-50 text-amber-800 border border-amber-200' :
                            'bg-blue-50 text-blue-700 border border-blue-200'
                          }`}>
                            {log.status}
                          </span>
                        </td>
                        <td className="p-3 text-gray-600">{log.notes || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: CLASS TIMETABLE (Requirement 13, 14) */}
          {activeTab === 'schedule' && selectedChild && (
            <div className="bg-white border border-[#E7DED1] p-6 rounded-2xl shadow-2xs space-y-6 animate-fadeIn text-xs">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-[#E89B52] uppercase font-bold">TIMETABLE</span>
                <h2 className="font-display font-black text-xl uppercase">{selectedChild.fullName}'s Class Schedule</h2>
              </div>

              <div className="p-5 border border-[#E7DED1] rounded-2xl bg-[#FAF6EF]/30 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-display font-black text-base text-gray-800">Weekly Scheduled Session</span>
                  <span className="px-2 py-0.5 bg-amber-50 text-amber-800 rounded font-mono text-[10px] font-bold">
                    {selectedChild.learningMode}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
                  <div className="p-3 bg-white rounded-xl border border-gray-100 space-y-1">
                    <span className="text-gray-400 text-[10px]">Time & Location:</span>
                    <p className="font-bold text-[#E89B52]">{selectedChild.nextClass}</p>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-gray-100 space-y-1">
                    <span className="text-gray-400 text-[10px]">Instructor & Classroom:</span>
                    <p className="font-bold text-gray-800">{selectedChild.teacherName} ({selectedChild.branch})</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: ASSIGNMENTS (Requirement 15, 16) */}
          {activeTab === 'assignments' && selectedChild && (
            <div className="bg-white border border-[#E7DED1] p-6 rounded-2xl shadow-2xs space-y-6 animate-fadeIn text-xs">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-[#E89B52] uppercase font-bold">HOMEWORK AUDIT</span>
                <h2 className="font-display font-black text-xl uppercase">{selectedChild.fullName}'s Assignments</h2>
              </div>

              <div className="space-y-3">
                {assignmentsList.map((asg) => (
                  <div key={asg.id} className="p-4 border border-[#E7DED1] rounded-2xl bg-white space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-sm text-gray-800">{asg.title}</span>
                      <span className={`px-2 py-0.5 rounded font-mono text-[9px] font-bold ${
                        asg.status === 'GRADED' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-800'
                      }`}>{asg.status}</span>
                    </div>

                    <div className="flex justify-between text-gray-500 font-mono text-[10px] pt-1 border-t border-gray-100">
                      <span>Due Date: {asg.dueDate}</span>
                      {asg.grade && <span className="font-bold text-[#E89B52]">Grade: {asg.grade}</span>}
                    </div>

                    {asg.teacherFeedback && (
                      <p className="p-2 bg-[#FAF6EF] rounded-lg text-gray-700 text-[11px] italic">
                        Teacher Feedback: "{asg.teacherFeedback}"
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: PAYMENTS & TUITION (Requirement 19, 21, 22) */}
          {activeTab === 'payments' && selectedChild && (
            <div className="bg-white border border-[#E7DED1] p-6 rounded-2xl shadow-2xs space-y-6 animate-fadeIn text-xs">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-[10px] font-mono tracking-widest text-[#E89B52] uppercase font-bold">FINANCIAL SUMMARY</span>
                  <h2 className="font-display font-black text-xl uppercase">{selectedChild.fullName}'s Tuition & Receipts</h2>
                </div>
                <span className={`px-3 py-1 rounded-full font-mono font-bold text-xs border ${
                  selectedChild.paymentStatus === 'PAID' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'
                }`}>Status: {selectedChild.paymentStatus}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-[#FAF6EF] border border-[#E7DED1] rounded-2xl space-y-1">
                  <span className="text-[10px] text-gray-400 font-bold uppercase">Quarterly Tuition Fee</span>
                  <p className="font-mono text-xl font-black text-gray-800">3,000 ETB</p>
                </div>

                <div className="p-4 bg-green-50 border border-green-200 rounded-2xl space-y-1">
                  <span className="text-[10px] text-green-800 font-bold uppercase">Amount Verified & Paid</span>
                  <p className="font-mono text-xl font-black text-green-700">3,000 ETB</p>
                </div>

                <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl space-y-1">
                  <span className="text-[10px] text-gray-400 font-bold uppercase">Outstanding Balance</span>
                  <p className="font-mono text-xl font-black text-gray-800">0 ETB</p>
                </div>
              </div>

              {/* VERIFIED RECEIPT CARD */}
              <div className="p-4 border border-[#E7DED1] rounded-2xl bg-white space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-sm text-gray-800">Verified Receipt: #REC-2026-0042</h3>
                  <Button variant="secondary" size="sm" onClick={() => alert('Downloading official PDF receipt with QR seal...')} className="gap-1">
                    <Download size={14} /> Download PDF Receipt
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-2 text-gray-600 text-[11px] font-mono">
                  <div>Paid Date: 2026-03-01</div>
                  <div>Payment Method: CBE Mobile Transfer</div>
                  <div>Transaction Ref: CBE90428172</div>
                  <div>Audited By: Accountant Martha Hailu</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: CERTIFICATES & BADGES (Requirement 24, 25) */}
          {activeTab === 'certificates' && selectedChild && (
            <div className="bg-white border border-[#E7DED1] p-6 rounded-2xl shadow-2xs space-y-6 animate-fadeIn text-xs">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-[#E89B52] uppercase font-bold">ACADEMIC HONORS</span>
                <h2 className="font-display font-black text-xl uppercase">{selectedChild.fullName}'s Certificates & Badges</h2>
              </div>

              <div className="p-5 border border-[#E7DED1] bg-[#FAF6EF]/40 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] text-[#E89B52] font-bold uppercase">Verified Certificate</span>
                  <h3 className="font-display font-black text-lg text-gray-800">Begena Level 1 Mastery Certificate</h3>
                  <p className="text-gray-500 font-mono text-[10px]">Issued on 2026-06-30 • CERT-BEG-2026-0042</p>
                </div>
                <Button variant="primary" size="sm" onClick={() => alert('Opening certificate verification view...')} className="bg-[#E89B52] text-white gap-1.5">
                  <Award size={14} /> View Certificate
                </Button>
              </div>
            </div>
          )}

          {/* TAB 9: TEACHER COMMUNICATION (Requirement 27) */}
          {activeTab === 'messages' && selectedChild && (
            <div className="bg-white border border-[#E7DED1] p-6 rounded-2xl shadow-2xs space-y-6 animate-fadeIn text-xs">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-[#E89B52] uppercase font-bold">DIRECT MESSAGING</span>
                <h2 className="font-display font-black text-xl uppercase">Chat with {selectedChild.teacherName}</h2>
              </div>

              {/* CHAT MESSAGES HISTORY */}
              <div className="p-4 bg-[#FAF6EF]/30 border border-[#E7DED1] rounded-2xl space-y-3 max-h-[300px] overflow-y-auto">
                {chatHistory.map((msg, idx) => (
                  <div key={idx} className={`p-3 rounded-xl max-w-md ${msg.isParent ? 'ml-auto bg-[#E89B52] text-white' : 'bg-white border border-gray-100 text-gray-800'}`}>
                    <div className="flex justify-between items-center text-[9px] opacity-75 font-mono mb-1">
                      <span>{msg.sender}</span>
                      <span>{msg.time}</span>
                    </div>
                    <p className="leading-relaxed">{msg.text}</p>
                  </div>
                ))}
              </div>

              {/* INPUT */}
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <Input
                  placeholder={`Send message to ${selectedChild.teacherName}...`}
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                />
                <Button type="submit" variant="primary" className="bg-[#E89B52] text-white">
                  Send
                </Button>
              </form>
            </div>
          )}

          {/* TAB 10: SUPPORT DESK (Requirement 32, 33) */}
          {activeTab === 'support' && (
            <div className="bg-white border border-[#E7DED1] p-6 rounded-2xl shadow-2xs space-y-6 animate-fadeIn text-xs">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-[#E89B52] uppercase font-bold">PARENT HELP DESK</span>
                <h2 className="font-display font-black text-xl uppercase">Support Tickets & School Inquiries</h2>
              </div>

              {/* CREATE TICKET FORM */}
              <form onSubmit={handleCreateTicket} className="p-4 bg-[#FAF6EF]/30 border border-[#E7DED1] rounded-2xl space-y-3">
                <h3 className="font-bold text-sm uppercase text-gray-800">Submit New Support Request</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-600 uppercase">Subject Title</label>
                    <Input placeholder="e.g. Request for class reschedule" value={ticketSubject} onChange={(e) => setTicketSubject(e.target.value)} />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-600 uppercase">Category</label>
                    <select
                      value={ticketCategory}
                      onChange={(e) => setTicketCategory(e.target.value)}
                      className="w-full p-2.5 bg-white border border-[#E7DED1] rounded-xl text-xs font-bold outline-none"
                    >
                      <option value="Schedule">Schedule & Attendance</option>
                      <option value="Payment">Tuition & Invoices</option>
                      <option value="Course">Course & Teachers</option>
                      <option value="General">General Inquiry</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-600 uppercase">Description Details</label>
                  <textarea
                    rows={3}
                    placeholder="Describe your inquiry or request..."
                    value={ticketDescription}
                    onChange={(e) => setTicketDescription(e.target.value)}
                    className="w-full p-3 bg-white border border-[#E7DED1] rounded-xl text-xs outline-none"
                  />
                </div>

                <Button type="submit" variant="primary" className="bg-[#E89B52] text-white">
                  Submit Support Ticket
                </Button>
              </form>

              {/* EXISTING TICKETS */}
              <div className="space-y-3">
                <h3 className="font-bold text-sm uppercase text-gray-800">Your Active Support Tickets ({supportTickets.length})</h3>
                {supportTickets.map(tck => (
                  <div key={tck.id} className="p-4 border border-[#E7DED1] rounded-2xl bg-white space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-sm text-gray-800">{tck.subject} ({tck.id})</span>
                      <span className="px-2 py-0.5 bg-green-50 text-green-700 font-mono text-[9px] font-bold rounded">{tck.status}</span>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-gray-100">
                      {tck.messages.map((m, idx) => (
                        <div key={idx} className="p-2.5 bg-[#FAF6EF]/50 rounded-lg text-gray-700 text-xs">
                          <span className="font-bold block text-[10px] text-[#E89B52]">{m.sender} ({m.time}):</span>
                          <p>{m.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}

