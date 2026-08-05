import React, { useState } from 'react';
import {
  Users,
  Briefcase,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Building2,
  UserCheck,
  Search,
  Filter,
  FileText,
  ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Language, BranchStaffMember, StaffAvailabilityRecord, OperationalTask } from '../../types';
import { TiletPattern } from '../TiletPattern';
import { Button, Input } from '../InteractiveComponents';
import { MOCK_OPERATIONAL_TASKS } from './OperationsCenter';

const SAMPLE_STAFF_MEMBERS: BranchStaffMember[] = [
  {
    id: 's-101',
    branchId: 'b-piazza',
    branchName: 'Piazza Branch',
    name: 'Solomon Worku',
    role: 'Branch Manager',
    email: 'solomon@abelbegena.com',
    phone: '+251 911 234 567',
    status: 'Active',
    workingSchedule: 'Mon - Sat: 08:30 AM - 05:00 PM'
  },
  {
    id: 's-102',
    branchId: 'b-piazza',
    branchName: 'Piazza Branch',
    name: 'Abel Begena',
    role: 'Teacher',
    email: 'abel@abelbegena.com',
    phone: '+251 911 111 222',
    status: 'Active',
    workingSchedule: 'Sun, Tue, Thu: Piazza & Megenagna',
    assignedInstruments: ['Begena']
  },
  {
    id: 's-103',
    branchId: 'b-[#2B2B2B]e',
    branchName: 'Megenagna Branch',
    name: 'Selamawit Kebede',
    role: 'Branch Manager',
    email: 'selamawit@abelbegena.com',
    phone: '+251 912 345 678',
    status: 'Active',
    workingSchedule: 'Mon - Sat: 08:00 AM - 06:00 PM'
  },
  {
    id: 's-104',
    branchId: 'b-lebu',
    branchName: 'Lebu Branch',
    name: 'Yared Tadesse',
    role: 'Branch Manager',
    email: 'yared@abelbegena.com',
    phone: '+251 913 456 789',
    status: 'Active',
    workingSchedule: 'Tue - Sun: 08:30 AM - 05:30 PM'
  }
];

interface StaffAndAvailabilityCenterProps {
  lang: Language;
  onNavigate: (page: string, params?: any) => void;
  activeMode?: 'staff' | 'tasks';
}

export function StaffAndAvailabilityCenter({ lang, onNavigate, activeMode = 'staff' }: StaffAndAvailabilityCenterProps) {
  const [mode, setMode] = useState<'staff' | 'tasks'>(activeMode);
  const [staffList, setStaffList] = useState<BranchStaffMember[]>(SAMPLE_STAFF_MEMBERS);
  const [taskList, setTaskList] = useState<OperationalTask[]>(MOCK_OPERATIONAL_TASKS);

  // New Task Modal
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskAssignee, setTaskAssignee] = useState('Dawit Mengistu');
  const [taskPriority, setTaskPriority] = useState<any>('Urgent');

  const handleCreateTask = () => {
    if (!taskTitle) return;
    const t: OperationalTask = {
      id: `t-${Date.now()}`,
      title: taskTitle,
      assignedToName: taskAssignee,
      assignedToRole: 'Support Staff',
      branchId: 'b-piazza',
      branchName: 'Piazza Branch',
      priority: taskPriority,
      dueDate: new Date().toISOString().substring(0, 10),
      status: 'To Do',
      category: 'Classroom Prep'
    };
    setTaskList([t, ...taskList]);
    setShowTaskModal(false);
    setTaskTitle('');
  };

  const handleToggleTaskStatus = (id: string) => {
    setTaskList((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, status: t.status === 'Completed' ? 'To Do' : 'Completed' } : t
      )
    );
  };

  return (
    <div className="space-y-8 pb-16">
      {/* HEADER BANNER */}
      <div className="bg-[#2B2B2B] text-white p-6 sm:p-8 rounded-3xl relative overflow-hidden shadow-xl border border-amber-950/40">
        <TiletPattern className="opacity-15 text-[#E89B52] scale-125" />
        <div className="relative z-10 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E89B52]/20 border border-[#E89B52]/40 text-[#E89B52] text-xs font-bold uppercase tracking-widest">
              <Users size={14} />
              <span>Multi-Branch Staff Personnel & Task Management</span>
            </div>

            <div className="flex bg-white/10 p-1 rounded-xl border border-white/20">
              <button
                onClick={() => setMode('staff')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  mode === 'staff' ? 'bg-[#E89B52] text-white' : 'text-gray-300 hover:text-white'
                }`}
              >
                👥 Staff Directory
              </button>
              <button
                onClick={() => setMode('tasks')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  mode === 'tasks' ? 'bg-[#E89B52] text-white' : 'text-gray-300 hover:text-white'
                }`}
              >
                ✅ Operational Tasks
              </button>
            </div>
          </div>

          <h1 className="font-display font-black text-2xl sm:text-3xl text-white tracking-wide uppercase">
            {mode === 'staff' ? 'STAFF DIRECTORY & TEACHER AVAILABILITY' : 'OPERATIONAL TASK WORKFLOW'}
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 max-w-2xl leading-relaxed">
            {mode === 'staff'
              ? 'View registration staff, accountants, support staff, and teacher availability schedules across Piazza, Megenagna, and Lebu campuses.'
              : 'Assign, prioritize, and track daily operational tasks such as classroom preparation, instrument tuning, and parent calls.'}
          </p>
        </div>
      </div>

      {mode === 'staff' ? (
        /* STAFF DIRECTORY */
        <div className="space-y-6">
          <h2 className="font-display font-black text-xl text-[#2B2B2B]">ACTIVE CAMPUS PERSONNEL</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {staffList.map((s) => (
              <div key={s.id} className="bg-white border border-[#E7DED1] rounded-3xl p-6 space-y-3 shadow-xs">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-[#E89B52] uppercase block">{s.branchName}</span>
                    <h3 className="font-display font-black text-lg text-[#2B2B2B]">{s.name}</h3>
                  </div>
                  <span className="px-2.5 py-1 bg-green-100 text-green-900 rounded-full text-[10px] font-black uppercase">
                    {s.role}
                  </span>
                </div>

                <div className="p-4 bg-[#FAF6EF] rounded-2xl border border-[#E7DED1] space-y-1.5 text-xs text-gray-700">
                  <div>Phone: <b>{s.phone}</b></div>
                  <div>Email: <b>{s.email}</b></div>
                  <div>Working Schedule: <span className="font-medium text-amber-900">{s.workingSchedule}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* TASKS WORKFLOW */
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="font-display font-black text-xl text-[#2B2B2B]">DAILY OPERATIONAL TASKS</h2>
            <Button variant="primary" size="sm" onClick={() => setShowTaskModal(true)}>
              + Create New Task
            </Button>
          </div>

          <div className="space-y-3">
            {taskList.map((t) => (
              <div key={t.id} className="p-5 bg-white border border-[#E7DED1] rounded-3xl flex justify-between items-center gap-4 text-xs shadow-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`font-bold text-sm ${t.status === 'Completed' ? 'line-through text-gray-400' : 'text-[#2B2B2B]'}`}>
                      {t.title}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                      t.priority === 'Urgent' ? 'bg-red-100 text-red-900' : 'bg-amber-100 text-amber-900'
                    }`}>
                      {t.priority} Priority
                    </span>
                  </div>

                  <p className="text-gray-500">
                    Assigned: <b>{t.assignedToName}</b> ({t.assignedToRole}) • Campus: {t.branchName} • Due: {t.dueDate}
                  </p>
                </div>

                <Button
                  variant={t.status === 'Completed' ? 'secondary' : 'primary'}
                  size="sm"
                  className="text-xs"
                  onClick={() => handleToggleTaskStatus(t.id)}
                >
                  {t.status === 'Completed' ? 'Completed ✓' : 'Mark Done'}
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CREATE TASK MODAL */}
      {showTaskModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#E7DED1] rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-4 shadow-2xl relative">
            <h3 className="font-display font-black text-lg text-[#2B2B2B]">CREATE OPERATIONAL TASK</h3>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-gray-600">Task Title</label>
                <Input value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} placeholder="e.g. Prepare Room 101" />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-600">Assignee Name</label>
                <Input value={taskAssignee} onChange={(e) => setTaskAssignee(e.target.value)} />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-600">Priority Level</label>
                <select
                  className="w-full p-2.5 bg-[#FAF6EF] border border-[#E7DED1] rounded-xl font-bold"
                  value={taskPriority}
                  onChange={(e) => setTaskPriority(e.target.value as any)}
                >
                  <option value="Urgent">Urgent</option>
                  <option value="High">High</option>
                  <option value="Normal">Normal</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="secondary" size="sm" onClick={() => setShowTaskModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleCreateTask}>
                Assign Task
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

