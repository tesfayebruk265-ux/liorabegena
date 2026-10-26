import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  User,
  Building2,
  AlertTriangle,
  CheckCircle2,
  Plus,
  Video,
  MapPin,
  Users,
  Search,
  Filter,
  XCircle,
  RotateCcw,
  Bell,
  ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Language, ClassScheduleItem } from '../../types';
import { TiletPattern } from '../TiletPattern';
import { Button, Input } from '../InteractiveComponents';

export const MOCK_SCHEDULE_ITEMS: ClassScheduleItem[] = [
  {
    id: 'cs-1',
    branchId: 'b-hawassa',
    branchName: 'Hawassa main Branch',
    courseId: 'c1',
    courseName: 'Begena - Level 1',
    instrument: 'Begena',
    level: 'Beginner',
    teacherId: 't1',
    teacherName: 'Liora Begena',
    roomId: 'r-101',
    roomName: 'Room 101 - Begena Sanctuary',
    date: '2026-07-26',
    startTime: '09:00 AM',
    endTime: '10:30 AM',
    learningMode: 'Physical',
    classType: 'Regular Class',
    maxCapacity: 20,
    enrolledStudentsCount: 18,
    waitingListCount: 2,
    status: 'Scheduled',
    googleMeetUrl: 'https://meet.google.com/abc-defg-hij'
  },
  {
    id: 'cs-2',
    branchId: 'b-hawassa',
    branchName: 'Hawassa main Branch',
    courseId: 'c2',
    courseName: 'Krar Fundamentals',
    instrument: 'Krar',
    level: 'Intermediate',
    teacherId: 't2',
    teacherName: 'Bethlehem Tadesse',
    roomId: 'r-102',
    roomName: 'Room 102 - Krar & Strings Studio',
    date: '2026-07-26',
    startTime: '11:00 AM',
    endTime: '12:30 PM',
    learningMode: 'Hybrid',
    classType: 'Regular Class',
    maxCapacity: 15,
    enrolledStudentsCount: 15,
    waitingListCount: 3,
    status: 'Scheduled',
    googleMeetUrl: 'https://meet.google.com/xyz-uvwx-rst'
  },
  {
    id: 'cs-3',
    branchId: 'b-hawassa',
    branchName: 'Hawassa main Branch',
    courseId: 'c3',
    courseName: 'Masenqo Level 1',
    instrument: 'Masenqo',
    level: 'Beginner',
    teacherId: 't3',
    teacherName: 'Yared Tadesse',
    roomId: 'r-103',
    roomName: 'Room 103 - General Performance Hall',
    date: '2026-07-26',
    startTime: '02:00 PM',
    endTime: '03:30 PM',
    learningMode: 'Physical',
    classType: 'Makeup Class',
    maxCapacity: 12,
    enrolledStudentsCount: 10,
    waitingListCount: 0,
    status: 'Scheduled'
  }
];

interface ClassSchedulingCenterProps {
  lang: Language;
  onNavigate: (page: string, params?: any) => void;
}

export function ClassSchedulingCenter({ lang, onNavigate }: ClassSchedulingCenterProps) {
  const [scheduleList, setScheduleList] = useState<ClassScheduleItem[]>(MOCK_SCHEDULE_ITEMS);
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('day');
  const [selectedBranch, setSelectedBranch] = useState('all');

  // Create Class Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newBranch, setNewBranch] = useState('Hawassa main Branch');
  const [newCourse, setNewCourse] = useState('Begena - Level 1');
  const [newTeacher, setNewTeacher] = useState('Liora Begena');
  const [newRoom, setNewRoom] = useState('Room 101 - Begena Sanctuary');
  const [newDate, setNewDate] = useState('2026-07-27');
  const [newStartTime, setNewStartTime] = useState('09:00 AM');
  const [newEndTime, setNewEndTime] = useState('10:30 AM');
  const [newClassType, setNewClassType] = useState<any>('Regular Class');
  const [newLearningMode, setNewLearningMode] = useState<any>('Physical');
  const [newMaxCapacity, setNewMaxCapacity] = useState(20);

  // Conflict state
  const [conflictWarning, setConflictWarning] = useState<string | null>(null);

  // Reschedule & Cancel Modal
  const [cancellingClass, setCancellingClass] = useState<ClassScheduleItem | null>(null);
  const [cancelReason, setCancelReason] = useState('Teacher Unavailable / Emergency');

  const checkConflict = () => {
    // Simulated conflict check
    const existing = scheduleList.find(
      (s) => s.branchName === newBranch && s.roomName === newRoom && s.date === newDate && s.startTime === newStartTime
    );
    if (existing) {
      setConflictWarning(`Conflict detected! ${existing.roomName} is already booked for "${existing.courseName}" by ${existing.teacherName} at ${newStartTime}.`);
      return true;
    }
    setConflictWarning(null);
    return false;
  };

  const handleCreateClass = () => {
    if (checkConflict()) return;

    const newClass: ClassScheduleItem = {
      id: `cs-${Date.now()}`,
      branchId: 'b-hawassa',
      branchName: newBranch || 'Hawassa main Branch',
      courseId: 'c-custom',
      courseName: newCourse,
      instrument: newCourse.split(' ')[0],
      level: 'Level 1',
      teacherId: 't-assigned',
      teacherName: newTeacher,
      roomId: 'r-assigned',
      roomName: newRoom,
      date: newDate,
      startTime: newStartTime,
      endTime: newEndTime,
      learningMode: newLearningMode,
      classType: newClassType,
      maxCapacity: newMaxCapacity,
      enrolledStudentsCount: 0,
      waitingListCount: 0,
      status: 'Scheduled',
      googleMeetUrl: newLearningMode !== 'Physical' ? 'https://meet.google.com/new-session-stream' : undefined
    };

    setScheduleList([...scheduleList, newClass]);
    setShowCreateModal(false);
  };

  const handleConfirmCancel = () => {
    if (!cancellingClass) return;
    setScheduleList((prev) =>
      prev.map((c) => (c.id === cancellingClass.id ? { ...c, status: 'Cancelled' } : c))
    );
    setCancellingClass(null);
  };

  const filteredSchedule = scheduleList.filter((item) => {
    return selectedBranch === 'all' || item.branchName === selectedBranch;
  });

  return (
    <div className="space-y-8 pb-16">
      {/* HEADER BANNER */}
      <div className="bg-[#2B2B2B] text-white p-6 sm:p-8 rounded-3xl relative overflow-hidden shadow-xl border border-amber-950/40">
        <TiletPattern className="opacity-15 text-[#E89B52] scale-125" />
        <div className="relative z-10 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E89B52]/20 border border-[#E89B52]/40 text-[#E89B52] text-xs font-bold uppercase tracking-widest">
              <Calendar size={14} />
              <span>Multi-Branch Master Class Scheduling Engine</span>
            </div>

            <Button
              variant="primary"
              size="sm"
              className="flex items-center gap-1.5 shadow-md"
              onClick={() => { setShowCreateModal(true); setConflictWarning(null); }}
            >
              <Plus size={14} />
              <span>+ Create Scheduled Class</span>
            </Button>
          </div>

          <h1 className="font-display font-black text-2xl sm:text-3xl text-white tracking-wide uppercase">
            ACADEMIC CLASS SCHEDULING CENTER
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 max-w-2xl leading-relaxed">
            Manage physical and hybrid class timetables for Hawassa main Branch (Center Point Tower) with automated room conflict validation and capacity waiting lists.
          </p>
        </div>
      </div>

      {/* VIEW MODES & FILTERS */}
      <div className="bg-white border border-[#E7DED1] p-4 rounded-3xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-xs">
        <div className="flex items-center gap-1 bg-[#FAF6EF] p-1 rounded-2xl border border-[#E7DED1]">
          {(['day', 'week', 'month'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase transition cursor-pointer ${
                viewMode === mode ? 'bg-[#E89B52] text-white shadow-xs' : 'text-gray-500 hover:text-[#2B2B2B]'
              }`}
            >
              {mode} View
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <label className="text-xs font-bold text-gray-500 uppercase">Campus Filter:</label>
          <select
            className="p-2 bg-[#FAF6EF] border border-[#E7DED1] rounded-xl text-xs font-bold"
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
          >
            <option value="all">All Timetables</option>
            <option value="Hawassa main Branch">Hawassa main Branch (Center Point Tower)</option>
          </select>
        </div>
      </div>

      {/* SCHEDULED CLASSES LIST / TIMELINE */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSchedule.map((cls) => (
            <div
              key={cls.id}
              className={`bg-white border p-6 rounded-3xl space-y-4 shadow-xs relative overflow-hidden ${
                cls.status === 'Cancelled' ? 'border-red-300 bg-red-50/20 opacity-75' : 'border-[#E7DED1]'
              }`}
            >
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-mono font-bold text-[#E89B52] uppercase block">{cls.branchName}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                  cls.status === 'Scheduled' ? 'bg-green-100 text-green-900' : 'bg-red-100 text-red-900'
                }`}>
                  {cls.status}
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="font-display font-black text-lg text-[#2B2B2B]">{cls.courseName}</h3>
                <p className="text-xs text-gray-500">{cls.classType} • {cls.instrument} ({cls.level})</p>
              </div>

              <div className="space-y-2 text-xs text-gray-600 bg-[#FAF6EF] p-4 rounded-2xl border border-[#E7DED1]">
                <div className="flex items-center gap-2">
                  <User size={14} className="text-[#E89B52]" />
                  <span>Teacher: <b>{cls.teacherName}</b></span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-[#E89B52]" />
                  <span>{cls.date} ({cls.startTime} - {cls.endTime})</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={14} className="text-[#E89B52]" />
                  <span>{cls.roomName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users size={14} className="text-[#E89B52]" />
                  <span>Capacity: <b>{cls.enrolledStudentsCount} / {cls.maxCapacity} Seats</b></span>
                </div>
              </div>

              {cls.waitingListCount > 0 && (
                <div className="px-3 py-1.5 bg-amber-100 text-amber-900 text-[10px] font-bold rounded-xl flex items-center justify-between">
                  <span>Waiting List: {cls.waitingListCount} Students</span>
                  <span className="underline cursor-pointer">Auto-notify next</span>
                </div>
              )}

              {cls.status !== 'Cancelled' && (
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full text-xs text-red-700 bg-red-50 hover:bg-red-100"
                    onClick={() => setCancellingClass(cls)}
                  >
                    Cancel / Reschedule
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* CREATE CLASS MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#E7DED1] rounded-3xl p-6 sm:p-8 max-w-xl w-full space-y-5 shadow-2xl relative">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-[#E89B52] uppercase block">Timetable Architecture</span>
              <h3 className="font-display font-black text-xl text-[#2B2B2B]">SCHEDULE NEW ACADEMIC CLASS</h3>
            </div>

            {conflictWarning && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-900 rounded-2xl text-xs space-y-1 font-medium">
                <div className="flex items-center gap-1.5 font-bold text-red-950">
                  <AlertTriangle size={16} />
                  <span>Schedule Conflict Detected</span>
                </div>
                <p>{conflictWarning}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-gray-600">Branch Campus</label>
                <select
                  className="w-full p-2.5 bg-[#FAF6EF] border border-[#E7DED1] rounded-xl font-bold"
                  value={newBranch}
                  onChange={(e) => { setNewBranch(e.target.value); checkConflict(); }}
                >
                  <option value="Hawassa main Branch">Hawassa main Branch (Center Point Tower)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-600">Course Title</label>
                <select
                  className="w-full p-2.5 bg-[#FAF6EF] border border-[#E7DED1] rounded-xl font-bold"
                  value={newCourse}
                  onChange={(e) => setNewCourse(e.target.value)}
                >
                  <option value="Begena - Level 1">Begena - Level 1</option>
                  <option value="Krar Fundamentals">Krar Fundamentals</option>
                  <option value="Masenqo Level 1">Masenqo Level 1</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-600">Instructor</label>
                <Input value={newTeacher} onChange={(e) => setNewTeacher(e.target.value)} />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-600">Room Location</label>
                <select
                  className="w-full p-2.5 bg-[#FAF6EF] border border-[#E7DED1] rounded-xl font-bold"
                  value={newRoom}
                  onChange={(e) => { setNewRoom(e.target.value); checkConflict(); }}
                >
                  <option value="Room 101 - Begena Sanctuary">Room 101 - Begena Sanctuary</option>
                  <option value="Room 102 - Krar & Strings Studio">Room 102 - Krar Studio</option>
                  <option value="Room 103 - General Performance Hall">Room 103 - Performance Hall</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-600">Date</label>
                <Input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-600">Start Time</label>
                <Input value={newStartTime} onChange={(e) => setNewStartTime(e.target.value)} />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-600">Class Type</label>
                <select
                  className="w-full p-2.5 bg-[#FAF6EF] border border-[#E7DED1] rounded-xl font-bold"
                  value={newClassType}
                  onChange={(e) => setNewClassType(e.target.value as any)}
                >
                  <option value="Regular Class">Regular Class</option>
                  <option value="Makeup Class">Makeup Class</option>
                  <option value="Workshop">Workshop</option>
                  <option value="Exam">Exam / Assessment</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-600">Max Seat Capacity</label>
                <Input
                  type="number"
                  value={newMaxCapacity}
                  onChange={(e) => setNewMaxCapacity(Number(e.target.value))}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="secondary" size="sm" onClick={() => setShowCreateModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleCreateClass}>
                Validate & Schedule Class
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* CANCEL MODAL */}
      {cancellingClass && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#E7DED1] rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-4 shadow-2xl relative">
            <h3 className="font-display font-black text-lg text-red-900">CANCEL CLASS SESSION</h3>
            <p className="text-xs text-gray-600">
              Are you sure you want to cancel <b>{cancellingClass.courseName}</b> scheduled for {cancellingClass.date}?
            </p>

            <div className="space-y-1 text-xs">
              <label className="font-bold text-gray-600">Cancellation Reason</label>
              <textarea
                rows={2}
                className="w-full p-3 bg-[#FAF6EF] border border-[#E7DED1] rounded-xl outline-none"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
              />
            </div>

            <p className="text-[10px] text-amber-800 bg-amber-50 p-2.5 rounded-xl border border-amber-200 font-bold">
              🔔 Automated SMS & Push notifications will be dispatched to all {cancellingClass.enrolledStudentsCount} enrolled students & parents.
            </p>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="secondary" size="sm" onClick={() => setCancellingClass(null)}>
                Keep Class
              </Button>
              <Button variant="destructive" size="sm" onClick={handleConfirmCancel}>
                Confirm Cancellation & Notify
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

