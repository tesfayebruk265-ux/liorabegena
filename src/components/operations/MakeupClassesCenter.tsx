import React, { useState } from 'react';
import {
  RotateCcw,
  CheckCircle2,
  Calendar,
  Clock,
  User,
  Video,
  MapPin,
  Send,
  AlertCircle,
  Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Language, MakeupClassRecord } from '../../types';
import { TiletPattern } from '../TiletPattern';
import { Button, Input } from '../InteractiveComponents';

const SAMPLE_MAKEUP_REQUESTS: MakeupClassRecord[] = [
  {
    id: 'mc-1',
    studentId: 'st-101',
    studentName: 'Yonas Tadesse',
    parentName: 'Tadesse Worku',
    courseName: 'Begena - Level 1',
    teacherId: 't-1',
    teacherName: 'Liora Begena',
    originalClassDate: '2026-07-19',
    reason: 'Student Absence',
    newDate: '2026-07-28',
    newTime: '04:00 PM',
    branchId: 'b-piazza',
    branchName: 'Piazza Branch',
    roomId: 'r-101',
    roomName: 'Room 101 - Begena Sanctuary',
    googleMeetUrl: 'https://meet.google.com/makeup-session-01',
    status: 'Scheduled'
  },
  {
    id: 'mc-2',
    studentId: 'st-102',
    studentName: 'Dawit Hailu',
    parentName: 'Hailu Girma',
    courseName: 'Krar Fundamentals',
    teacherId: 't-2',
    teacherName: 'Bethlehem Tadesse',
    originalClassDate: '2026-07-21',
    reason: 'Teacher Absence',
    newDate: '2026-07-27',
    newTime: '02:00 PM',
    branchId: 'b-hawassa',
    branchName: 'Hawassa main Branch',
    googleMeetUrl: 'https://meet.google.com/makeup-session-02',
    status: 'Under Review'
  }
];

interface MakeupClassesCenterProps {
  lang: Language;
  onNavigate: (page: string, params?: any) => void;
}

export function MakeupClassesCenter({ lang, onNavigate }: MakeupClassesCenterProps) {
  const [makeups, setMakeups] = useState<MakeupClassRecord[]>(SAMPLE_MAKEUP_REQUESTS);

  // New Request Form
  const [showModal, setShowModal] = useState(false);
  const [studentName, setStudentName] = useState('Dawit Hailu');
  const [courseName, setCourseName] = useState('Begena - Level 1');
  const [teacherName, setTeacherName] = useState('Liora Begena');
  const [reason, setReason] = useState<any>('Student Absence');
  const [newDate, setNewDate] = useState('2026-07-29');
  const [newTime, setNewTime] = useState('04:00 PM');
  const [branchName, setBranchName] = useState('Piazza Branch');

  const handleCreateRequest = () => {
    if (!studentName) return;
    const req: MakeupClassRecord = {
      id: `mc-${Date.now()}`,
      studentId: `st-${Math.floor(Math.random() * 900)}`,
      studentName,
      courseName,
      teacherId: 't-assigned',
      teacherName,
      originalClassDate: '2026-07-21',
      reason,
      newDate,
      newTime,
      branchId: 'b-piazza',
      branchName,
      googleMeetUrl: 'https://meet.google.com/makeup-generated-link',
      status: 'Scheduled'
    };
    setMakeups([req, ...makeups]);
    setShowModal(false);
  };

  const handleCompleteMakeup = (id: string) => {
    setMakeups((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: 'Completed' } : m))
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
              <RotateCcw size={14} />
              <span>Academic Attendance Recovery Hub</span>
            </div>

            <Button
              variant="primary"
              size="sm"
              className="flex items-center gap-1.5 shadow-md"
              onClick={() => setShowModal(true)}
            >
              <Plus size={14} />
              <span>+ Schedule Makeup Class</span>
            </Button>
          </div>

          <h1 className="font-display font-black text-2xl sm:text-3xl text-white tracking-wide uppercase">
            MAKEUP CLASS MANAGEMENT WORKFLOW
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 max-w-2xl leading-relaxed">
            Coordinate makeup sessions for student absences, teacher unavailability, or branch emergency closures across physical rooms and Google Meet streams.
          </p>
        </div>
      </div>

      {/* WORKFLOW PIPELINE CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {makeups.map((mk) => (
          <div key={mk.id} className="bg-white border border-[#E7DED1] p-6 rounded-3xl space-y-4 shadow-xs relative overflow-hidden">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-bold text-[#E89B52] uppercase block">{mk.branchName}</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                mk.status === 'Completed' ? 'bg-green-100 text-green-900' : 'bg-amber-100 text-amber-900'
              }`}>
                {mk.status}
              </span>
            </div>

            <div>
              <h3 className="font-display font-black text-base text-[#2B2B2B]">{mk.studentName}</h3>
              <p className="text-xs text-gray-500">{mk.courseName} • Instructor: {mk.teacherName}</p>
            </div>

            <div className="p-4 bg-[#FAF6EF] rounded-2xl border border-[#E7DED1] space-y-2 text-xs text-gray-700">
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-[#E89B52]" />
                <span>Makeup Date: <b>{mk.newDate} ({mk.newTime})</b></span>
              </div>
              <div className="flex items-center gap-2">
                <AlertCircle size={14} className="text-[#E89B52]" />
                <span>Reason: <b>{mk.reason}</b></span>
              </div>
              {mk.googleMeetUrl && (
                <div className="flex items-center gap-2 text-blue-800 font-bold">
                  <Video size={14} />
                  <a href={mk.googleMeetUrl} target="_blank" rel="noreferrer" className="underline">
                    Google Meet Stream Link
                  </a>
                </div>
              )}
            </div>

            {mk.status !== 'Completed' && (
              <Button
                variant="primary"
                size="sm"
                className="w-full text-xs"
                onClick={() => handleCompleteMakeup(mk.id)}
              >
                Mark Session Completed & Record Attendance
              </Button>
            )}
          </div>
        ))}
      </div>

      {/* SCHEDULE MAKEUP MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#E7DED1] rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-4 shadow-2xl relative">
            <h3 className="font-display font-black text-lg text-[#2B2B2B]">SCHEDULE MAKEUP CLASS</h3>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-gray-600">Student Name</label>
                <Input value={studentName} onChange={(e) => setStudentName(e.target.value)} />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-600">Course</label>
                <select
                  className="w-full p-2.5 bg-[#FAF6EF] border border-[#E7DED1] rounded-xl font-bold"
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                >
                  <option value="Begena - Level 1">Begena - Level 1</option>
                  <option value="Krar Fundamentals">Krar Fundamentals</option>
                  <option value="Masenqo Level 1">Masenqo Level 1</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-gray-600">Preferred Date</label>
                  <Input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-gray-600">Preferred Time</label>
                  <Input value={newTime} onChange={(e) => setNewTime(e.target.value)} />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-600">Absence Reason</label>
                <select
                  className="w-full p-2.5 bg-[#FAF6EF] border border-[#E7DED1] rounded-xl font-bold"
                  value={reason}
                  onChange={(e) => setReason(e.target.value as any)}
                >
                  <option value="Student Absence">Student Absence</option>
                  <option value="Teacher Absence">Teacher Absence</option>
                  <option value="School Closure">School Closure</option>
                  <option value="Emergency">Emergency</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="secondary" size="sm" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleCreateRequest}>
                Schedule & Dispatch Link
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

