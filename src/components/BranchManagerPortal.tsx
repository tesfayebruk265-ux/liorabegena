import React, { useState, useEffect } from 'react';
import {
  Building, Users, BookOpen, Calendar, Clock, CheckCircle, AlertTriangle,
  FileText, TrendingUp, MapPin, ChevronRight, Send, Plus, Filter, Check, X,
  Award, Bell, Search, BookCheck, Activity, LogOut, Download, Printer,
  BarChart2, PieChart, Layers, Sliders, RefreshCw, Eye, Megaphone, ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Button, Input } from './InteractiveComponents';
import { ThemeToggle } from './ThemeToggle';
import { PageId } from '../types';

interface BranchManagerPortalProps {
  onNavigate: (page: PageId, params?: any) => void;
  lang: 'en' | 'am';
}

interface BranchRoom {
  id: string;
  name: string;
  roomNumber: string;
  capacity: number;
  availableInstruments: string[];
  status: 'Available' | 'Maintenance' | 'Unavailable';
}

interface BranchStaff {
  id: string;
  name: string;
  role: 'Teacher' | 'Registration Staff' | 'Maintenance';
  contact: string;
  status: 'Active' | 'On Leave';
  workloadHours: number;
  specializations: string[];
  branches: string[];
  assignedStudents: Array<{
    id: string;
    name: string;
    course: string;
    branch: string;
    status: string;
  }>;
}

export function BranchManagerPortal({ onNavigate, lang }: BranchManagerPortalProps) {
  const { currentUser, addNotification, logout } = useAuth();
  const { teachers, enrollments } = useData();

  // Branch Selector (Hawassa Main Branch, Online)
  const [selectedBranch, setSelectedBranch] = useState<'Hawassa Main Branch' | 'Online Campus'>(
    (currentUser?.branch as any) || 'Hawassa Main Branch'
  );

  // Active Tab navigation
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'branch-info' | 'staff-teachers' | 'students' | 'classes' | 'rooms' | 'attendance' | 'reports' | 'announcements'
  >('dashboard');

  // Shared Centralized States from LocalStorage
  const [students, setStudents] = useState<any[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('ab_students_v3') || '[]');
    } catch {
      return [];
    }
  });

  const [classes, setClasses] = useState<any[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('ab_classes_v3') || '[]');
    } catch {
      return [];
    }
  });

  // Branch Rooms State
  const [rooms, setRooms] = useState<BranchRoom[]>(() => {
    const saved = localStorage.getItem('ab_rooms_v3');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      { id: 'rm_1', name: 'St. Yared Studio', roomNumber: 'Room 101', capacity: 15, availableInstruments: ['Begena (8)', 'Krar (10)'], status: 'Available' },
      { id: 'rm_2', name: 'Davidic Choir Room', roomNumber: 'Room 102', capacity: 20, availableInstruments: ['Kebero (4)', 'Masenqo (6)'], status: 'Available' },
      { id: 'rm_3', name: 'Washint Acoustic Hall', roomNumber: 'Room 103', capacity: 10, availableInstruments: ['Washint (12)'], status: 'Available' }
    ];
  });

  const staffList = React.useMemo<BranchStaff[]>(() => {
    const normalizedBranch = selectedBranch.toLowerCase();
    const activeTeachers = teachers.filter((teacher) => teacher.status === 'Active');

    const branchMatches = activeTeachers.filter((teacher) => {
      const branches = (teacher.branches || []).map((branch) => branch.toLowerCase());
      if (branches.length === 0) return true;
      return branches.some((branch) => branch.includes(normalizedBranch) || normalizedBranch.includes(branch));
    });

    const sourceTeachers = branchMatches.length > 0 ? branchMatches : activeTeachers;

    return sourceTeachers.map((teacher) => {
      const assignedEnrollments = enrollments.filter((enrollment) => {
        if (enrollment.status !== 'Active') return false;
        const matchesTeacher =
          (enrollment.assignedTeacherId && enrollment.assignedTeacherId.toLowerCase() === teacher.id.toLowerCase()) ||
          (enrollment.assignedTeacherEmail && enrollment.assignedTeacherEmail.toLowerCase() === teacher.email.toLowerCase()) ||
          (enrollment.assignedTeacherName && enrollment.assignedTeacherName.toLowerCase() === teacher.fullName.toLowerCase());

        if (!matchesTeacher) return false;

        if (!enrollment.branch) return true;
        const enrollmentBranch = enrollment.branch.toLowerCase();
        return enrollmentBranch.includes(normalizedBranch) || normalizedBranch.includes(enrollmentBranch);
      });

      return {
        id: teacher.id,
        name: teacher.fullName,
        role: 'Teacher' as const,
        contact: teacher.phone || 'No phone on file',
        status: teacher.status === 'Active' ? 'Active' : 'On Leave',
        workloadHours: Math.max(8, Math.min(40, Math.round((teacher.capacity || 20) * 0.35))),
        specializations: teacher.specializations || [],
        branches: teacher.branches || [],
        assignedStudents: assignedEnrollments.map((enrollment) => ({
          id: enrollment.id,
          name: enrollment.studentName,
          course: enrollment.courseName,
          branch: enrollment.branch || selectedBranch,
          status: enrollment.status || 'Active'
        }))
      };
    });
  }, [selectedBranch, teachers, enrollments]);

  // Announcement Form State
  const [announcementTitle, setAnnouncementTitle] = useState('');
  const [announcementMsg, setAnnouncementMsg] = useState('');
  const [announcementTarget, setAnnouncementTarget] = useState('All Branch Students');
  const [announcementPriority, setAnnouncementPriority] = useState<'Normal' | 'High' | 'Urgent'>('Normal');

  // Multi-branch Isolation Filtering
  const filteredStudents = students.filter(s => s.branch === selectedBranch);
  const filteredClasses = classes.filter(c => c.branch === selectedBranch);

  // Sync Rooms
  useEffect(() => {
    localStorage.setItem('ab_rooms_v3', JSON.stringify(rooms));
  }, [rooms]);

  const handleSendAnnouncement = () => {
    if (!announcementTitle || !announcementMsg) return;
    addNotification(`Branch Announcement Sent`, `[${selectedBranch}] ${announcementTitle} dispatched to ${announcementTarget}`, 'announcement');
    setAnnouncementTitle('');
    setAnnouncementMsg('');
    alert(`Announcement Dispatched Successfully to ${selectedBranch}!`);
  };

  const handleExportReport = (format: string) => {
    alert(`Generating & Exporting ${selectedBranch} Operational Report as ${format.toUpperCase()}...`);
  };

  return (
    <div className="w-full bg-[#FCFBF8] min-h-screen text-[#2B2B2B] font-sans antialiased text-left">
      {/* HEADER BAR */}
      <header className="border-b border-[#E7DED1] bg-white relative z-20 px-6 py-4 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#FAF6EF] rounded-xl border border-[#E7DED1]">
            <Building className="text-[#E89B52]" size={20} />
          </div>
          <div>
            <h1 className="font-display font-black text-lg tracking-tight uppercase text-gray-800">Branch Executive Portal</h1>
            <p className="text-[10px] tracking-wider text-[#E89B52] font-bold uppercase">Liora Begena School • Operational Command</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle variant="pill" />
          {/* BRANCH SELECTOR */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase hidden sm:inline">Current Branch:</span>
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value as any)}
              className="p-2 border border-[#E7DED1] rounded-xl bg-[#FAF6EF] text-xs font-bold text-gray-800 outline-none cursor-pointer"
            >
              <option value="Hawassa Main Branch">Hawassa Main Branch — Center Point Tower</option>
              <option value="Online Campus">Online International Campus</option>
            </select>
          </div>

          <div className="hidden md:flex flex-col text-right">
            <span className="font-bold text-xs">{currentUser?.fullName || 'Teacher Solomon'}</span>
            <span className="text-[9px] text-[#E89B52] font-mono tracking-wider font-bold">BRANCH MANAGER</span>
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
          <div className="bg-white border border-[#E7DED1] rounded-2xl p-4 shadow-2xs space-y-1">
            <p className="text-[10px] tracking-widest text-[#E89B52] font-bold px-3 py-1 uppercase">Branch Operations</p>

            <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'dashboard' ? 'bg-[#E89B52] text-white' : 'text-gray-600 hover:bg-[#FAF6EF]'}`}>
              <div className="flex items-center gap-2.5"><BarChart2 size={16} /><span>Executive Dashboard</span></div>
              <ChevronRight size={14} className="opacity-60" />
            </button>

            <button onClick={() => setActiveTab('branch-info')} className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'branch-info' ? 'bg-[#E89B52] text-white' : 'text-gray-600 hover:bg-[#FAF6EF]'}`}>
              <div className="flex items-center gap-2.5"><Building size={16} /><span>Branch Profile & Info</span></div>
              <ChevronRight size={14} className="opacity-60" />
            </button>

            <button onClick={() => setActiveTab('staff-teachers')} className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'staff-teachers' ? 'bg-[#E89B52] text-white' : 'text-gray-600 hover:bg-[#FAF6EF]'}`}>
              <div className="flex items-center gap-2.5"><Users size={16} /><span>Faculty & Staff Oversight</span></div>
              <span className="text-[10px] bg-[#FAF6EF] text-gray-600 px-1.5 py-0.5 rounded font-mono font-bold">{staffList.length}</span>
            </button>

            <button onClick={() => setActiveTab('students')} className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'students' ? 'bg-[#E89B52] text-white' : 'text-gray-600 hover:bg-[#FAF6EF]'}`}>
              <div className="flex items-center gap-2.5"><BookOpen size={16} /><span>Branch Student Roster</span></div>
              <span className="text-[10px] bg-[#FAF6EF] text-gray-600 px-1.5 py-0.5 rounded font-mono font-bold">{filteredStudents.length}</span>
            </button>

            <button onClick={() => setActiveTab('classes')} className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'classes' ? 'bg-[#E89B52] text-white' : 'text-gray-600 hover:bg-[#FAF6EF]'}`}>
              <div className="flex items-center gap-2.5"><Calendar size={16} /><span>Class & Capacity Matrix</span></div>
              <span className="text-[10px] bg-[#FAF6EF] text-gray-600 px-1.5 py-0.5 rounded font-mono font-bold">{filteredClasses.length}</span>
            </button>

            <button onClick={() => setActiveTab('rooms')} className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'rooms' ? 'bg-[#E89B52] text-white' : 'text-gray-600 hover:bg-[#FAF6EF]'}`}>
              <div className="flex items-center gap-2.5"><Layers size={16} /><span>Room Management</span></div>
              <span className="text-[10px] bg-[#FAF6EF] text-gray-600 px-1.5 py-0.5 rounded font-mono font-bold">{rooms.length}</span>
            </button>

            <button onClick={() => setActiveTab('attendance')} className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'attendance' ? 'bg-[#E89B52] text-white' : 'text-gray-600 hover:bg-[#FAF6EF]'}`}>
              <div className="flex items-center gap-2.5"><Activity size={16} /><span>Attendance Analytics</span></div>
              <ChevronRight size={14} className="opacity-60" />
            </button>

            <button onClick={() => setActiveTab('reports')} className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'reports' ? 'bg-[#E89B52] text-white' : 'text-gray-600 hover:bg-[#FAF6EF]'}`}>
              <div className="flex items-center gap-2.5"><FileText size={16} /><span>Reports & Exports</span></div>
              <ChevronRight size={14} className="opacity-60" />
            </button>

            <button onClick={() => setActiveTab('announcements')} className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'announcements' ? 'bg-[#E89B52] text-white' : 'text-gray-600 hover:bg-[#FAF6EF]'}`}>
              <div className="flex items-center gap-2.5"><Megaphone size={16} /><span>Broadcast Announcements</span></div>
              <ChevronRight size={14} className="opacity-60" />
            </button>
          </div>
        </aside>

        {/* MAIN DISPLAY AREA */}
        <main className="lg:col-span-9 space-y-6">

          {/* TAB 1: EXECUTIVE DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 animate-fadeIn text-xs">
              {/* HERO METRICS */}
              <div className="bg-white border border-[#E7DED1] p-6 rounded-2xl shadow-2xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <span className="text-[10px] font-mono tracking-widest text-[#E89B52] uppercase font-bold">BRANCH OVERVIEW • {selectedBranch.toUpperCase()}</span>
                  <h2 className="font-display font-black text-2xl uppercase tracking-tight">Branch Performance Center</h2>
                  <p className="text-xs text-gray-500 mt-0.5">Real-time enrollment, room utilization, and faculty workload stats.</p>
                </div>
              </div>

              {/* STAT TILES */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white border border-[#E7DED1] p-4 rounded-2xl shadow-2xs">
                  <span className="block text-[10px] font-mono tracking-widest text-gray-400 uppercase font-bold">Branch Students</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-black font-mono">{filteredStudents.length}</span>
                    <span className="text-[10px] text-green-600 font-bold">Active</span>
                  </div>
                </div>

                <div className="bg-white border border-[#E7DED1] p-4 rounded-2xl shadow-2xs">
                  <span className="block text-[10px] font-mono tracking-widest text-gray-400 uppercase font-bold">Active Classes</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-black font-mono text-[#E89B52]">{filteredClasses.length}</span>
                    <span className="text-[10px] text-gray-400">Scheduled</span>
                  </div>
                </div>

                <div className="bg-white border border-[#E7DED1] p-4 rounded-2xl shadow-2xs">
                  <span className="block text-[10px] font-mono tracking-widest text-gray-400 uppercase font-bold">Overall Attendance</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-black font-mono text-green-600">89%</span>
                    <span className="text-[10px] text-gray-400">This Month</span>
                  </div>
                </div>

                <div className="bg-white border border-[#E7DED1] p-4 rounded-2xl shadow-2xs">
                  <span className="block text-[10px] font-mono tracking-widest text-gray-400 uppercase font-bold">Branch Capacity</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-black font-mono">75%</span>
                    <span className="text-[10px] text-amber-600 font-bold">Utilized</span>
                  </div>
                </div>
              </div>

              {/* CLASS CAPACITY & ROOM UTILIZATION METERS */}
              <div className="bg-white border border-[#E7DED1] p-6 rounded-2xl shadow-2xs space-y-4">
                <h3 className="font-display font-black text-sm uppercase tracking-wider flex items-center gap-2">
                  <Building size={18} className="text-[#E89B52]" />
                  Branch Room & Class Capacity Matrix
                </h3>

                <div className="space-y-3">
                  {rooms.map(rm => (
                    <div key={rm.id} className="p-3 border border-gray-100 rounded-xl space-y-2 bg-[#FAF6EF]/10">
                      <div className="flex justify-between font-bold">
                        <span>{rm.name} ({rm.roomNumber})</span>
                        <span className="font-mono text-[#E89B52]">Capacity: {rm.capacity} Seats</span>
                      </div>
                      <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                        <div className="h-full bg-[#E89B52] w-[70%]" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: BRANCH PROFILE */}
          {activeTab === 'branch-info' && (
            <div className="bg-white border border-[#E7DED1] p-6 rounded-2xl shadow-2xs space-y-4 animate-fadeIn text-xs">
              <h3 className="font-display font-black text-sm uppercase tracking-wider">{selectedBranch} Information</h3>

              <div className="grid grid-cols-2 gap-4 bg-[#FAF6EF] p-4 rounded-xl border border-[#E7DED1]">
                <p><strong>Branch Manager:</strong> {currentUser?.fullName || 'Deacon Bruk Tesfaye'}</p>
                <p><strong>City / Address:</strong> Hawassa, Center Point Tower (1st Floor)</p>
                <p><strong>Operating Hours:</strong> Mon - Sat: 08:30 AM - 06:30 PM</p>
                <p><strong>Total Classrooms:</strong> {rooms.length}</p>
                <p><strong>Phone:</strong> +251 912 67 4600</p>
                <p><strong>Email:</strong> info@liorabegena.com</p>
              </div>
            </div>
          )}

          {/* TAB 3: FACULTY & STAFF OVERSIGHT */}
          {activeTab === 'staff-teachers' && (
            <div className="bg-white border border-[#E7DED1] p-6 rounded-2xl shadow-2xs space-y-4 animate-fadeIn text-xs">
              <div className="flex items-start justify-between gap-3 border-b border-gray-100 pb-3">
                <div>
                  <h3 className="font-display font-black text-sm uppercase tracking-wider">Branch Faculty & Staff Roster</h3>
                  <p className="text-[11px] text-gray-500 mt-1">Real teachers from the school directory with their registered students linked by enrollment.</p>
                </div>
                <span className="text-[10px] font-mono font-bold bg-[#FAF6EF] text-[#E89B52] px-2.5 py-1 rounded-full border border-[#E7DED1]">
                  {staffList.length} Active Teachers
                </span>
              </div>

              <div className="space-y-3">
                {staffList.map((teacher) => (
                  <div key={teacher.id} className="border border-[#E7DED1] rounded-2xl p-4 bg-[#FAF6EF]/20 space-y-3">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-bold text-sm text-gray-900">{teacher.name}</h4>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-50 text-green-700">{teacher.status}</span>
                        </div>
                        <p className="text-[11px] text-gray-500 mt-1">{teacher.contact}</p>
                      </div>
                      <div className="text-[11px] text-gray-600">
                        <div><strong>Specializations:</strong> {teacher.specializations.length > 0 ? teacher.specializations.join(', ') : 'Not set'}</div>
                        <div><strong>Branches:</strong> {teacher.branches.length > 0 ? teacher.branches.join(', ') : selectedBranch}</div>
                      </div>
                    </div>

                    <div className="rounded-xl border border-gray-100 bg-white p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Registered Students</span>
                        <span className="text-[10px] font-mono font-bold text-[#E89B52]">{teacher.assignedStudents.length} linked</span>
                      </div>

                      {teacher.assignedStudents.length === 0 ? (
                        <p className="text-[11px] text-gray-400 italic">No registered students are currently linked to this teacher.</p>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {teacher.assignedStudents.map((student) => (
                            <div key={student.id} className="p-2.5 rounded-lg border border-[#E7DED1] bg-[#FAF6EF]/40">
                              <div className="flex items-center justify-between gap-2">
                                <span className="font-bold text-gray-800 truncate">{student.name}</span>
                                <span className="text-[10px] text-gray-500">{student.status}</span>
                              </div>
                              <p className="text-[10px] text-gray-500 mt-1">{student.course} • {student.branch}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: BRANCH STUDENT ROSTER */}
          {activeTab === 'students' && (
            <div className="bg-white border border-[#E7DED1] p-6 rounded-2xl shadow-2xs space-y-4 animate-fadeIn text-xs">
              <h3 className="font-display font-black text-sm uppercase tracking-wider">Students Enrolled at {selectedBranch}</h3>

              <div className="border border-gray-100 rounded-xl overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-[#FAF6EF] text-[10px] font-bold text-gray-400 uppercase">
                    <tr>
                      <th className="p-3">Student ID</th>
                      <th className="p-3">Full Name</th>
                      <th className="p-3">Course / Level</th>
                      <th className="p-3">Schedule</th>
                      <th className="p-3">Attendance %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map(st => (
                      <tr key={st.id} className="border-b border-gray-100">
                        <td className="p-3 font-mono font-bold text-[#E89B52]">{st.studentRegistrationId || st.id}</td>
                        <td className="p-3 font-bold">{st.fullName}</td>
                        <td className="p-3">{st.course} ({st.level})</td>
                        <td className="p-3">{st.schedule}</td>
                        <td className="p-3 font-mono font-bold text-green-600">{st.attendancePercent}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: ROOM MANAGEMENT */}
          {activeTab === 'rooms' && (
            <div className="bg-white border border-[#E7DED1] p-6 rounded-2xl shadow-2xs space-y-4 animate-fadeIn text-xs">
              <h3 className="font-display font-black text-sm uppercase tracking-wider">Classroom & Studio Management</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {rooms.map(rm => (
                  <div key={rm.id} className="p-4 border rounded-2xl bg-[#FAF6EF]/20 space-y-2">
                    <span className="font-bold text-sm block">{rm.name}</span>
                    <p className="font-mono text-[10px] text-gray-400">{rm.roomNumber}</p>
                    <p><strong>Capacity:</strong> {rm.capacity} Students</p>
                    <p><strong>Instruments:</strong> {rm.availableInstruments.join(', ')}</p>
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-green-50 text-green-700 inline-block">{rm.status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: REPORTS & EXPORTS */}
          {activeTab === 'reports' && (
            <div className="bg-white border border-[#E7DED1] p-6 rounded-2xl shadow-2xs space-y-4 animate-fadeIn text-xs">
              <h3 className="font-display font-black text-sm uppercase tracking-wider">Branch Analytics Reports & Export Desk</h3>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Button variant="secondary" onClick={() => handleExportReport('pdf')}>Export PDF Report</Button>
                <Button variant="secondary" onClick={() => handleExportReport('excel')}>Export Excel Sheet</Button>
                <Button variant="secondary" onClick={() => handleExportReport('csv')}>Export CSV Data</Button>
                <Button variant="primary" onClick={() => window.print()}>Print Summary</Button>
              </div>
            </div>
          )}

          {/* TAB 7: ANNOUNCEMENTS */}
          {activeTab === 'announcements' && (
            <div className="bg-white border border-[#E7DED1] p-6 rounded-2xl shadow-2xs space-y-4 animate-fadeIn text-xs">
              <h3 className="font-display font-black text-sm uppercase tracking-wider">Dispatch Branch Announcement</h3>

              <div className="space-y-3">
                <div>
                  <label className="block font-bold mb-1">Announcement Title</label>
                  <Input value={announcementTitle} onChange={(e) => setAnnouncementTitle(e.target.value)} placeholder="e.g. Schedule shift for holiday recitals" />
                </div>

                <div>
                  <label className="block font-bold mb-1">Target Audience</label>
                  <select value={announcementTarget} onChange={(e) => setAnnouncementTarget(e.target.value)} className="w-full p-2.5 border rounded bg-white font-bold">
                    <option>All Branch Students</option>
                    <option>Begena Level 1 Students</option>
                    <option>Branch Faculty & Instructors</option>
                    <option>Registration Staff</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold mb-1">Message Body</label>
                  <textarea value={announcementMsg} onChange={(e) => setAnnouncementMsg(e.target.value)} className="w-full p-3 border rounded-xl h-24 outline-none" placeholder="Write announcement details..." />
                </div>

                <Button variant="primary" onClick={handleSendAnnouncement}>Dispatch Announcement</Button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

