import React, { useState } from 'react';
import {
  Building2,
  Calendar,
  Users,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Package,
  Wrench,
  ArrowRightLeft,
  ShoppingBag,
  UserCheck,
  FileText,
  Plus,
  Search,
  MapPin,
  Phone,
  ShieldCheck,
  TrendingUp,
  Sliders,
  DollarSign,
  Briefcase
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../context/AuthContext';
import { Language, SchoolBranch, OperationalTask, MaintenanceRequest } from '../../types';
import { TiletPattern } from '../TiletPattern';
import { Button, Input } from '../InteractiveComponents';

// Mock Initial Data for Operations
export const MOCK_BRANCHES: SchoolBranch[] = [
  {
    id: 'b-piazza',
    name: 'Piazza Branch',
    code: 'PZ-01',
    city: 'Addis Ababa',
    subCity: 'Arada',
    woreda: '01',
    address: 'Near St. George Church & Historic Square, Arada Sub-City',
    description: 'The historic flagship sanctuary of Abel Begena School featuring traditional wooden acoustics and master craftsman studios.',
    latitude: 9.035,
    longitude: 38.752,
    managerName: 'Solomon Worku',
    contactPhone: '+251 911 234 567',
    emergencyPhone: '+251 911 999 111',
    operatingHours: 'Monday - Saturday: 08:30 AM - 06:30 PM EAT',
    status: 'Active',
    totalStudents: 340,
    totalTeachers: 14,
    activeCoursesCount: 8,
    classesTodayCount: 18,
    availableRoomsCount: 6
  },
  {
    id: 'b-[#2B2B2B]e',
    name: 'Megenagna Branch',
    code: 'MG-02',
    city: 'Addis Ababa',
    subCity: 'Yeka',
    woreda: '05',
    address: 'Zefmesh Grand Mall Plaza, 4th Floor, Megenagna Junction',
    description: 'Modern east-side campus equipped with digital practice labs, recording booths, and hybrid Google Meet streaming rigs.',
    latitude: 9.020,
    longitude: 38.801,
    managerName: 'Selamawit Kebede',
    contactPhone: '+251 912 345 678',
    emergencyPhone: '+251 911 999 222',
    operatingHours: 'Monday - Saturday: 08:00 AM - 07:00 PM EAT',
    status: 'Active',
    totalStudents: 280,
    totalTeachers: 11,
    activeCoursesCount: 6,
    classesTodayCount: 14,
    availableRoomsCount: 5
  },
  {
    id: 'b-lebu',
    name: 'Lebu Branch',
    code: 'LB-03',
    city: 'Addis Ababa',
    subCity: 'Nifas Silk-Lafto',
    woreda: '02',
    address: 'Lebu Varnero Commercial Center, Block B',
    description: 'South-west Addis campus serving young learners and church choir practice groups with spacious performance halls.',
    latitude: 8.960,
    longitude: 38.720,
    managerName: 'Yared Tadesse',
    contactPhone: '+251 913 456 789',
    emergencyPhone: '+251 911 999 333',
    operatingHours: 'Tuesday - Sunday: 08:30 AM - 06:00 PM EAT',
    status: 'Active',
    totalStudents: 195,
    totalTeachers: 8,
    activeCoursesCount: 5,
    classesTodayCount: 10,
    availableRoomsCount: 4
  }
];

export const MOCK_OPERATIONAL_TASKS: OperationalTask[] = [
  {
    id: 't-1',
    title: 'Prepare Classroom 102 for Begena Level 1 Sunday Class',
    assignedToName: 'Dawit Mengistu',
    assignedToRole: 'Support Staff',
    branchId: 'b-piazza',
    branchName: 'Piazza Branch',
    priority: 'Urgent',
    dueDate: '2026-07-22',
    status: 'In Progress',
    category: 'Classroom Prep',
    notes: 'Check all 10 string pegs and leather buzz wraps before 9 AM.'
  },
  {
    id: 't-2',
    title: 'Restock Traditional Gut Strings for Krar & Begena',
    assignedToName: 'Tigist Alemu',
    assignedToRole: 'Inventory Staff',
    branchId: 'b-[#2B2B2B]e',
    branchName: 'Megenagna Branch',
    priority: 'High',
    dueDate: '2026-07-23',
    status: 'To Do',
    category: 'Inventory Restock',
    notes: 'Low stock warning triggered for 0.8mm gut string rolls.'
  },
  {
    id: 't-3',
    title: 'Confirm Makeup Class Google Meet link with Parent',
    assignedToName: 'Bethlehem Tadesse',
    assignedToRole: 'Registration Staff',
    branchId: 'b-lebu',
    branchName: 'Lebu Branch',
    priority: 'Normal',
    dueDate: '2026-07-22',
    status: 'Completed',
    category: 'Parent Communication',
    notes: 'Student Yonas Tadesse rescheduled for Tuesday 4 PM.'
  }
];

interface OperationsCenterProps {
  lang: Language;
  onNavigate: (page: string, params?: any) => void;
  activeSubTab?: string;
}

export function OperationsCenter({ lang, onNavigate, activeSubTab = 'overview' }: OperationsCenterProps) {
  const { currentUser, hasPermission } = useAuth();
  const [currentTab, setCurrentTab] = useState(activeSubTab);
  const [branches, setBranches] = useState<SchoolBranch[]>(MOCK_BRANCHES);
  const [tasks, setTasks] = useState<OperationalTask[]>(MOCK_OPERATIONAL_TASKS);
  const [selectedBranchFilter, setSelectedBranchFilter] = useState('all');

  // New Branch Modal state
  const [showAddBranchModal, setShowAddBranchModal] = useState(false);
  const [newBranchName, setNewBranchName] = useState('');
  const [newBranchSubCity, setNewBranchSubCity] = useState('Bole');
  const [newBranchAddress, setNewBranchAddress] = useState('');
  const [newBranchPhone, setNewBranchPhone] = useState('+251 9');

  const totalStudentsAll = branches.reduce((acc, b) => acc + b.totalStudents, 0);
  const totalTeachersAll = branches.reduce((acc, b) => acc + b.totalTeachers, 0);
  const totalClassesToday = branches.reduce((acc, b) => acc + b.classesTodayCount, 0);

  const handleCreateBranch = () => {
    if (!newBranchName) return;
    const newB: SchoolBranch = {
      id: `b-${Date.now()}`,
      name: newBranchName,
      code: `AB-${branches.length + 1}`,
      city: 'Addis Ababa',
      subCity: newBranchSubCity,
      address: newBranchAddress || `${newBranchSubCity} Campus`,
      description: 'Newly added branch location of Abel Begena School.',
      latitude: 9.01,
      longitude: 38.76,
      managerName: 'Assigned Staff',
      contactPhone: newBranchPhone,
      emergencyPhone: newBranchPhone,
      operatingHours: 'Monday - Saturday: 08:30 AM - 06:00 PM',
      status: 'Active',
      totalStudents: 0,
      totalTeachers: 0,
      activeCoursesCount: 0,
      classesTodayCount: 0,
      availableRoomsCount: 3
    };
    setBranches([...branches, newB]);
    setShowAddBranchModal(false);
    setNewBranchName('');
  };

  return (
    <div className="space-y-8 pb-16">
      {/* OPERATIONS HEADER BANNER */}
      <div className="bg-[#2B2B2B] text-white p-6 sm:p-8 rounded-3xl relative overflow-hidden shadow-xl border border-amber-950/40">
        <TiletPattern className="opacity-15 text-[#E89B52] scale-125" />
        <div className="relative z-10 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E89B52]/20 border border-[#E89B52]/40 text-[#E89B52] text-xs font-bold uppercase tracking-widest">
              <Building2 size={14} />
              <span>Abel Begena Organization Operational Workspace</span>
            </div>

            <div className="flex gap-2">
              <Button
                variant="primary"
                size="sm"
                className="flex items-center gap-1.5 text-xs shadow-md"
                onClick={() => setShowAddBranchModal(true)}
              >
                <Plus size={14} />
                <span>Add New Branch Location</span>
              </Button>
            </div>
          </div>

          <h1 className="font-display font-black text-2xl sm:text-3xl text-white tracking-wide uppercase">
            SCHOOL OPERATIONS & BRANCH MANAGEMENT
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 max-w-3xl leading-relaxed">
            Centralized operational dashboard for branch managers, registration staff, room schedulers, inventory controllers, and school leadership across Piazza, Megenagna, and Lebu campuses.
          </p>
        </div>
      </div>

      {/* TODAY'S OVERVIEW STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white border border-[#E7DED1] rounded-2xl space-y-2 shadow-xs">
          <div className="flex justify-between items-center text-xs text-gray-500 font-bold uppercase">
            <span>Total Active Branches</span>
            <Building2 size={18} className="text-[#E89B52]" />
          </div>
          <div className="font-display font-black text-3xl text-[#2B2B2B]">
            {branches.filter((b) => b.status === 'Active').length} <span className="text-sm font-normal text-gray-400">/ {branches.length}</span>
          </div>
          <p className="text-[10px] text-green-700 font-bold">Piazza • Megenagna • Lebu</p>
        </div>

        <div className="p-5 bg-white border border-[#E7DED1] rounded-2xl space-y-2 shadow-xs">
          <div className="flex justify-between items-center text-xs text-gray-500 font-bold uppercase">
            <span>Classes Scheduled Today</span>
            <Calendar size={18} className="text-[#E89B52]" />
          </div>
          <div className="font-display font-black text-3xl text-[#2B2B2B]">{totalClassesToday}</div>
          <p className="text-[10px] text-amber-700 font-bold">Physical & Google Meet Streams</p>
        </div>

        <div className="p-5 bg-white border border-[#E7DED1] rounded-2xl space-y-2 shadow-xs">
          <div className="flex justify-between items-center text-xs text-gray-500 font-bold uppercase">
            <span>Enrolled Students</span>
            <Users size={18} className="text-[#E89B52]" />
          </div>
          <div className="font-display font-black text-3xl text-green-800">{totalStudentsAll}</div>
          <p className="text-[10px] text-gray-500">Across 3 Physical Branches</p>
        </div>

        <div className="p-5 bg-white border border-[#E7DED1] rounded-2xl space-y-2 shadow-xs">
          <div className="flex justify-between items-center text-xs text-gray-500 font-bold uppercase">
            <span>Teachers On Duty Today</span>
            <UserCheck size={18} className="text-[#E89B52]" />
          </div>
          <div className="font-display font-black text-3xl text-[#E89B52]">{totalTeachersAll}</div>
          <p className="text-[10px] text-gray-500">Multi-Branch Assignments</p>
        </div>
      </div>

      {/* OPERATIONS QUICK NAVIGATION MENU */}
      <div className="bg-white border border-[#E7DED1] p-4 rounded-2xl shadow-xs overflow-x-auto">
        <div className="flex items-center gap-2 min-w-max">
          {[
            { id: 'branches', label: '🏢 Branches', page: 'operations-branches' },
            { id: 'schedule', label: '📅 Class Schedules', page: 'operations-schedule' },
            { id: 'rooms', label: '🏛️ Rooms & Facilities', page: 'operations-rooms' },
            { id: 'makeup', label: '🔄 Makeup Classes', page: 'operations-makeup' },
            { id: 'transfers', label: '🔀 Branch Transfers', page: 'operations-transfers' },
            { id: 'attendance', label: '📋 Attendance', page: 'operations-attendance' },
            { id: 'inventory', label: '📦 Inventory & Store', page: 'operations-inventory' },
            { id: 'maintenance', label: '🔧 Maintenance', page: 'operations-maintenance' },
            { id: 'staff', label: '👥 Staff & Availability', page: 'operations-staff' },
            { id: 'tasks', label: '✅ Tasks & Workflow', page: 'operations-tasks' }
          ].map((nav) => (
            <button
              key={nav.id}
              onClick={() => onNavigate(nav.page)}
              className="px-3 py-2 rounded-xl text-xs font-bold bg-[#FAF6EF] hover:bg-[#E89B52] hover:text-white transition cursor-pointer text-[#2B2B2B] border border-[#E7DED1]"
            >
              {nav.label}
            </button>
          ))}
        </div>
      </div>

      {/* ACTIVE BRANCH CARDS SECTION */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-[#E89B52] uppercase tracking-widest block">Branch Network</span>
            <h2 className="font-display font-black text-2xl text-[#2B2B2B]">PHYSICAL CAMPUS BRANCHES</h2>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-gray-500 uppercase">Filter Status:</label>
            <select
              className="p-2 bg-white border border-[#E7DED1] rounded-xl text-xs font-bold"
              value={selectedBranchFilter}
              onChange={(e) => setSelectedBranchFilter(e.target.value)}
            >
              <option value="all">All Branches ({branches.length})</option>
              <option value="Active">Active Only</option>
              <option value="Maintenance">Under Maintenance</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {branches.map((b) => (
            <div
              key={b.id}
              className="bg-white border border-[#E7DED1] rounded-3xl p-6 space-y-4 shadow-xs relative overflow-hidden hover:border-[#E89B52] transition"
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-mono font-bold text-[#E89B52] uppercase block">{b.code}</span>
                  <h3 className="font-display font-black text-lg text-[#2B2B2B]">{b.name}</h3>
                  <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                    <MapPin size={12} className="text-[#E89B52]" />
                    <span>{b.subCity}, {b.city}</span>
                  </p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                  b.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {b.status}
                </span>
              </div>

              <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">{b.description}</p>

              <div className="grid grid-cols-2 gap-2 p-3 bg-[#FAF6EF] rounded-2xl text-xs text-gray-700 font-medium">
                <div>
                  <span className="text-[10px] text-gray-400 block font-bold">Students</span>
                  <span className="font-bold text-[#2B2B2B]">{b.totalStudents}</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 block font-bold">Teachers</span>
                  <span className="font-bold text-[#2B2B2B]">{b.totalTeachers}</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 block font-bold">Today's Classes</span>
                  <span className="font-bold text-[#E89B52]">{b.classesTodayCount}</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 block font-bold">Rooms</span>
                  <span className="font-bold text-[#2B2B2B]">{b.availableRoomsCount} Available</span>
                </div>
              </div>

              <div className="space-y-1 text-xs text-gray-500">
                <div><b>Manager:</b> {b.managerName}</div>
                <div><b>Phone:</b> {b.contactPhone}</div>
                <div><b>Hours:</b> {b.operatingHours}</div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  variant="primary"
                  size="sm"
                  className="w-full text-xs"
                  onClick={() => onNavigate('operations-branch-detail', { branchId: b.id })}
                >
                  Manage Branch Workspace →
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* OPERATIONAL ALERTS & TASK LIST */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* OPERATIONAL ALERTS */}
        <div className="bg-white border border-[#E7DED1] p-6 rounded-3xl space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-black text-sm uppercase text-[#2B2B2B] flex items-center gap-2">
              <AlertTriangle className="text-amber-600" size={18} />
              <span>Real-Time Operational Alerts</span>
            </h3>
            <span className="px-2 py-0.5 bg-amber-100 text-amber-900 text-[10px] font-bold rounded-full">3 System Warnings</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl space-y-1">
              <div className="flex justify-between font-bold text-amber-900">
                <span>⚠️ Room Schedule Overlap Risk</span>
                <span className="text-[10px]">Piazza Branch</span>
              </div>
              <p className="text-amber-800">
                Room 101 requested for both Begena Level 1 and Krar Practice at 02:00 PM Sunday.
              </p>
            </div>

            <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl space-y-1">
              <div className="flex justify-between font-bold text-red-900">
                <span>🚨 Low Inventory Alert</span>
                <span className="text-[10px]">Megenagna Branch</span>
              </div>
              <p className="text-red-800">
                Traditional Gut Strings for Begena reached minimum threshold (2 sets remaining).
              </p>
            </div>

            <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-2xl space-y-1">
              <div className="flex justify-between font-bold text-blue-900">
                <span>🔄 Pending Student Branch Transfer</span>
                <span className="text-[10px]">Lebu ➔ Piazza</span>
              </div>
              <p className="text-blue-800">
                Student Dawit Hailu requested transfer due to location change. Awaiting review.
              </p>
            </div>
          </div>
        </div>

        {/* STAFF TASKS PREVIEW */}
        <div className="bg-white border border-[#E7DED1] p-6 rounded-3xl space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-black text-sm uppercase text-[#2B2B2B] flex items-center gap-2">
              <Briefcase className="text-[#E89B52]" size={18} />
              <span>Staff Daily Tasks & Workflows</span>
            </h3>
            <Button
              variant="secondary"
              size="sm"
              className="text-[10px] font-bold"
              onClick={() => onNavigate('operations-tasks')}
            >
              View All Tasks
            </Button>
          </div>

          <div className="space-y-3 text-xs">
            {tasks.map((t) => (
              <div key={t.id} className="p-3.5 bg-[#FAF6EF] border border-[#E7DED1] rounded-2xl space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-[#2B2B2B]">{t.title}</span>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                    t.priority === 'Urgent' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {t.priority}
                  </span>
                </div>
                <div className="flex justify-between text-[10px] text-gray-500">
                  <span>Assigned: <b>{t.assignedToName}</b> ({t.assignedToRole})</span>
                  <span>{t.branchName}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ADD BRANCH MODAL */}
      {showAddBranchModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#E7DED1] rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-5 shadow-2xl relative">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-[#E89B52] uppercase block">Expand School Architecture</span>
              <h3 className="font-display font-black text-xl text-[#2B2B2B]">CREATE NEW SCHOOL BRANCH</h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-gray-600">Branch Name</label>
                <Input
                  value={newBranchName}
                  onChange={(e) => setNewBranchName(e.target.value)}
                  placeholder="e.g. Sarbet Branch"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-gray-600">Sub-City</label>
                  <select
                    className="w-full p-2.5 bg-[#FAF6EF] border border-[#E7DED1] rounded-xl font-bold"
                    value={newBranchSubCity}
                    onChange={(e) => setNewBranchSubCity(e.target.value)}
                  >
                    <option value="Bole">Bole Sub-City</option>
                    <option value="Kirkos">Kirkos Sub-City</option>
                    <option value="Nifas Silk">Nifas Silk Sub-City</option>
                    <option value="Kolfe Keraniyo">Kolfe Keraniyo Sub-City</option>
                    <option value="Gullele">Gullele Sub-City</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-600">Contact Phone</label>
                  <Input value={newBranchPhone} onChange={(e) => setNewBranchPhone(e.target.value)} />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-600">Address Details</label>
                <Input
                  value={newBranchAddress}
                  onChange={(e) => setNewBranchAddress(e.target.value)}
                  placeholder="e.g. Near Sarbet Gabriel Church, Commercial Plaza"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="secondary" size="sm" onClick={() => setShowAddBranchModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleCreateBranch}>
                Save & Provision Branch
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

