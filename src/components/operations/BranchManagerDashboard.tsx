import React, { useState } from 'react';
import {
  Building2,
  Users,
  Search,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileText,
  User,
  ShieldCheck,
  Phone,
  BookOpen,
  Send,
  MessageSquare,
  ArrowRightLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../context/AuthContext';
import { Language } from '../../types';
import { TiletPattern } from '../TiletPattern';
import { Button, Input } from '../InteractiveComponents';

interface StudentSearchRecord {
  id: string;
  studentId: string;
  name: string;
  phone: string;
  course: string;
  instrument: string;
  level: string;
  teacherName: string;
  branchName: string;
  enrollmentStatus: 'Active' | 'On Leave' | 'Graduated' | 'Pending Transfer';
  learningMode: 'Physical' | 'Online' | 'Hybrid';
  attendanceRate: number;
  lastActiveDate: string;
}

const SAMPLE_BRANCH_STUDENTS: StudentSearchRecord[] = [
  {
    id: 'st-101',
    studentId: 'STU-2026-081',
    name: 'Dawit Hailu',
    phone: '+251 911 888 777',
    course: 'Begena - Level 1',
    instrument: 'Begena',
    level: 'Beginner',
    teacherName: 'Abel Begena',
    branchName: 'Piazza Branch',
    enrollmentStatus: 'Active',
    learningMode: 'Physical',
    attendanceRate: 95,
    lastActiveDate: '2026-07-20'
  },
  {
    id: 'st-102',
    studentId: 'STU-2026-094',
    name: 'Mekdes Zewdu',
    phone: '+251 912 777 666',
    course: 'Krar Fundamentals',
    instrument: 'Krar',
    level: 'Intermediate',
    teacherName: 'Bethlehem Tadesse',
    branchName: 'Piazza Branch',
    enrollmentStatus: 'Active',
    learningMode: 'Hybrid',
    attendanceRate: 90,
    lastActiveDate: '2026-07-21'
  },
  {
    id: 'st-103',
    studentId: 'STU-2026-112',
    name: 'Henok Girma',
    phone: '+251 913 666 555',
    course: 'Masenqo Level 1',
    instrument: 'Masenqo',
    level: 'Beginner',
    teacherName: 'Yonas Tadesse',
    branchName: 'Piazza Branch',
    enrollmentStatus: 'Pending Transfer',
    learningMode: 'Physical',
    attendanceRate: 65,
    lastActiveDate: '2026-07-12'
  }
];

interface BranchManagerDashboardProps {
  lang: Language;
  onNavigate: (page: string, params?: any) => void;
}

export function BranchManagerDashboard({ lang, onNavigate }: BranchManagerDashboardProps) {
  const { currentUser } = useAuth();
  const [activeBranch, setActiveBranch] = useState('Piazza Branch');

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCourse, setFilterCourse] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Selected Student Modal / Inspector
  const [selectedStudent, setSelectedStudent] = useState<StudentSearchRecord | null>(null);

  const filteredStudents = SAMPLE_BRANCH_STUDENTS.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.phone.includes(searchQuery) ||
      s.teacherName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCourse = filterCourse === 'all' || s.course === filterCourse;
    const matchesStatus = filterStatus === 'all' || s.enrollmentStatus === filterStatus;

    return matchesSearch && matchesCourse && matchesStatus;
  });

  return (
    <div className="space-y-8 pb-16">
      {/* HEADER BANNER */}
      <div className="bg-[#2B2B2B] text-white p-6 sm:p-8 rounded-3xl relative overflow-hidden shadow-xl border border-amber-950/40">
        <TiletPattern className="opacity-15 text-[#E89B52] scale-125" />
        <div className="relative z-10 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E89B52]/20 border border-[#E89B52]/40 text-[#E89B52] text-xs font-bold uppercase tracking-widest">
              <Building2 size={14} />
              <span>Authorized Branch Manager Studio</span>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-gray-300">Managed Campus:</label>
              <select
                className="p-1.5 bg-white/10 text-white rounded-lg text-xs font-bold border border-white/20"
                value={activeBranch}
                onChange={(e) => setActiveBranch(e.target.value)}
              >
                <option value="Piazza Branch" className="bg-[#2B2B2B]">Piazza Branch</option>
                <option value="Megenagna Branch" className="bg-[#2B2B2B]">Megenagna Branch</option>
                <option value="Lebu Branch" className="bg-[#2B2B2B]">Lebu Branch</option>
              </select>
            </div>
          </div>

          <h1 className="font-display font-black text-2xl sm:text-3xl text-white tracking-wide uppercase">
            {activeBranch.toUpperCase()} MANAGEMENT WORKSPACE
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 max-w-2xl leading-relaxed">
            Monitor daily classroom attendance, perform student roster lookups, schedule makeup sessions, manage staff tasks, and coordinate campus operations.
          </p>
        </div>
      </div>

      {/* DASHBOARD METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white border border-[#E7DED1] rounded-2xl space-y-1 shadow-xs">
          <span className="text-[10px] font-bold text-gray-400 uppercase block">Active Students</span>
          <div className="font-display font-black text-2xl text-green-800">340</div>
          <span className="text-[10px] text-green-700 font-bold">96% Attendance Rate</span>
        </div>

        <div className="p-4 bg-white border border-[#E7DED1] rounded-2xl space-y-1 shadow-xs">
          <span className="text-[10px] font-bold text-gray-400 uppercase block">Today's Classes</span>
          <div className="font-display font-black text-2xl text-[#2B2B2B]">18 Sessions</div>
          <span className="text-[10px] text-gray-500">6 Classrooms Occupied</span>
        </div>

        <div className="p-4 bg-white border border-[#E7DED1] rounded-2xl space-y-1 shadow-xs">
          <span className="text-[10px] font-bold text-gray-400 uppercase block">Pending Branch Transfers</span>
          <div className="font-display font-black text-2xl text-amber-600">2 Requests</div>
          <span className="text-[10px] text-amber-700 font-bold">Requires Verification</span>
        </div>

        <div className="p-4 bg-white border border-[#E7DED1] rounded-2xl space-y-1 shadow-xs">
          <span className="text-[10px] font-bold text-gray-400 uppercase block">Instruments Borrowed</span>
          <div className="font-display font-black text-2xl text-blue-800">12 Begena / Krar</div>
          <span className="text-[10px] text-gray-500">Checkout History Active</span>
        </div>
      </div>

      {/* BRANCH STUDENT SEARCH & LOOKUP */}
      <div className="bg-white border border-[#E7DED1] p-6 sm:p-8 rounded-3xl space-y-6 shadow-xs">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="text-xs font-bold text-[#E89B52] uppercase tracking-widest block">Campus Roster Lookup</span>
            <h2 className="font-display font-black text-2xl text-[#2B2B2B]">BRANCH STUDENT SEARCH</h2>
          </div>

          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onNavigate('operations-transfers')}
              className="text-xs flex items-center gap-1.5"
            >
              <ArrowRightLeft size={14} />
              <span>Branch Transfers</span>
            </Button>
          </div>
        </div>

        {/* SEARCH BAR & FILTERS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="sm:col-span-1 relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={16} />
            <Input
              className="pl-9"
              placeholder="Search by Name, ID, Phone, or Teacher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <select
              className="w-full p-2.5 bg-[#FAF6EF] border border-[#E7DED1] rounded-xl font-bold text-xs"
              value={filterCourse}
              onChange={(e) => setFilterCourse(e.target.value)}
            >
              <option value="all">All Courses</option>
              <option value="Begena - Level 1">Begena - Level 1</option>
              <option value="Krar Fundamentals">Krar Fundamentals</option>
              <option value="Masenqo Level 1">Masenqo Level 1</option>
            </select>
          </div>

          <div className="space-y-1">
            <select
              className="w-full p-2.5 bg-[#FAF6EF] border border-[#E7DED1] rounded-xl font-bold text-xs"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Enrollment Statuses</option>
              <option value="Active">Active</option>
              <option value="On Leave">On Leave</option>
              <option value="Pending Transfer">Pending Transfer</option>
            </select>
          </div>
        </div>

        {/* STUDENT ROSTER TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#E7DED1] bg-[#FAF6EF] text-[#2B2B2B] font-bold uppercase tracking-wider">
                <th className="p-3">Student Name & ID</th>
                <th className="p-3">Course & Instrument</th>
                <th className="p-3">Assigned Teacher</th>
                <th className="p-3">Mode & Attendance</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7DED1]">
              {filteredStudents.map((std) => (
                <tr key={std.id} className="hover:bg-[#FAF6EF]/50 transition">
                  <td className="p-3">
                    <span className="font-bold text-[#2B2B2B] block">{std.name}</span>
                    <span className="text-[10px] font-mono text-gray-500">{std.studentId} • {std.phone}</span>
                  </td>
                  <td className="p-3">
                    <span className="font-semibold block">{std.course}</span>
                    <span className="text-[10px] text-gray-500">{std.instrument} ({std.level})</span>
                  </td>
                  <td className="p-3 font-medium text-gray-700">{std.teacherName}</td>
                  <td className="p-3">
                    <span className="font-bold text-green-700 block">{std.attendanceRate}% Attendance</span>
                    <span className="text-[10px] text-gray-400">{std.learningMode} Mode</span>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                      std.enrollmentStatus === 'Active' ? 'bg-green-100 text-green-900' : 'bg-amber-100 text-amber-900'
                    }`}>
                      {std.enrollmentStatus}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="text-[10px] font-bold"
                      onClick={() => setSelectedStudent(std)}
                    >
                      View Record
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* STUDENT INSPECTOR MODAL */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#E7DED1] rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-5 shadow-2xl relative">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-[#E89B52] uppercase block">Branch Roster Inspection</span>
              <h3 className="font-display font-black text-xl text-[#2B2B2B]">{selectedStudent.name}</h3>
              <p className="text-xs text-gray-500">ID: {selectedStudent.studentId} • Phone: {selectedStudent.phone}</p>
            </div>

            <div className="p-4 bg-[#FAF6EF] border border-[#E7DED1] rounded-2xl space-y-2 text-xs text-gray-700">
              <div><b>Enrolled Course:</b> {selectedStudent.course} ({selectedStudent.level})</div>
              <div><b>Assigned Teacher:</b> {selectedStudent.teacherName}</div>
              <div><b>Branch Campus:</b> {selectedStudent.branchName}</div>
              <div><b>Learning Mode:</b> {selectedStudent.learningMode}</div>
              <div><b>Attendance Rate:</b> <span className="font-bold text-green-700">{selectedStudent.attendanceRate}%</span></div>
              <div><b>Last Active Session:</b> {selectedStudent.lastActiveDate}</div>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 flex items-center gap-2">
              <ShieldCheck size={16} />
              <span>Sensitive financial transaction records protected by privacy protocol.</span>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="secondary" size="sm" onClick={() => setSelectedStudent(null)}>
                Close Record
              </Button>
              <Button variant="primary" size="sm" onClick={() => onNavigate('operations-makeup')}>
                Schedule Makeup Class
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

