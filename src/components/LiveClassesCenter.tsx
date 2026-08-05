import React, { useState } from 'react';
import {
  Video,
  Calendar,
  Clock,
  User,
  MapPin,
  ExternalLink,
  FileText,
  CheckCircle,
  Plus,
  Play,
  Download,
  AlertCircle,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Language, LiveClassSession } from '../types';
import { useAuth, isStudentAccessGranted } from '../context/AuthContext';
import { TiletPattern } from './TiletPattern';
import { Button, Input } from './InteractiveComponents';
import { RegistrationAndPaymentGate } from './RegistrationAndPaymentGate';

interface LiveClassesCenterProps {
  lang: Language;
  onNavigate: (page: string, params?: any) => void;
}

const MOCK_LIVE_CLASSES: LiveClassSession[] = [
  {
    id: 'lc-1',
    title: 'Sunday Morning Begena Practice & Tuning Workshop',
    courseId: 'c1',
    courseName: 'Begena - Level 1',
    instrument: 'Begena',
    teacherName: 'Abel Begena',
    branchName: 'Online Portal / Bole Branch',
    date: '2026-07-26',
    time: '09:00 AM - 10:30 AM EAT',
    durationMinutes: 90,
    googleMeetUrl: 'https://meet.google.com/abc-defg-hij',
    isLive: true,
    isCompleted: false,
    classRules: [
      'Mute microphone upon entry.',
      'Ensure your instrument is within camera frame.',
      'Have paper or notebook ready for traditional notation notes.'
    ]
  },
  {
    id: 'lc-2',
    title: 'Krar Qenet Mode Scale & Chord Fingerings',
    courseId: 'c2',
    courseName: 'Krar Fundamentals',
    instrument: 'Krar',
    teacherName: 'Bethlehem Tadesse',
    branchName: 'Megenagna Branch',
    date: '2026-07-27',
    time: '02:00 PM - 03:30 PM EAT',
    durationMinutes: 90,
    googleMeetUrl: 'https://meet.google.com/xyz-uvwx-rst',
    isLive: false,
    isCompleted: false,
    classRules: ['Bring 6-string Krar.', 'Practice finger agility warmup before session.']
  },
  {
    id: 'lc-3',
    title: 'Begena History & Spiritual Symbolism Lecture',
    courseId: 'c1',
    courseName: 'Begena - Level 1',
    instrument: 'Begena',
    teacherName: 'Abel Begena',
    branchName: 'Global Virtual Class',
    date: '2026-07-19',
    time: '09:00 AM',
    durationMinutes: 60,
    googleMeetUrl: 'https://meet.google.com/past-recording',
    isLive: false,
    isCompleted: true,
    recordingUrl: 'https://actions.google.com/sounds/v1/ambiences/outdoor_rain.ogg',
    materialsUrl: 'https://example.com/begena-history.pdf',
    classRules: []
  }
];

export function LiveClassesCenter({ lang, onNavigate }: LiveClassesCenterProps) {
  const { currentUser } = useAuth();
  const [classList, setClassList] = useState<LiveClassSession[]>(MOCK_LIVE_CLASSES);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed' | 'makeup'>('upcoming');
  const [joiningClass, setJoiningClass] = useState<LiveClassSession | null>(null);

  if (!isStudentAccessGranted(currentUser)) {
    return <RegistrationAndPaymentGate lang={lang} onNavigate={onNavigate} title="LIVE CLASSES LOCKED" />;
  }

  // Makeup class scheduling state
  const [makeupCourse, setMakeupCourse] = useState('Begena - Level 1');
  const [makeupDate, setMakeupDate] = useState('2026-07-28');
  const [makeupTime, setMakeupTime] = useState('04:00 PM');
  const [makeupReason, setMakeupReason] = useState('Missed physical Sunday session due to travel');
  const [makeupScheduled, setMakeupScheduled] = useState(false);

  const upcomingClasses = classList.filter((c) => !c.isCompleted);
  const completedClasses = classList.filter((c) => c.isCompleted);

  const handleScheduleMakeup = () => {
    setMakeupScheduled(true);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* HEADER BANNER */}
      <div className="bg-[#2B2B2B] text-white p-6 sm:p-8 rounded-3xl relative overflow-hidden shadow-xl border border-amber-950/40">
        <TiletPattern className="opacity-15 text-[#E89B52] scale-125" />
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E89B52]/20 border border-[#E89B52]/40 text-[#E89B52] text-xs font-bold uppercase tracking-widest">
            <Video size={14} />
            <span>Google Meet Virtual Classroom Hub</span>
          </div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-white tracking-wide">
            LIVE ONLINE CLASSES & REPLAY ARCHIVE
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 max-w-2xl leading-relaxed">
            Attend live interactive online Google Meet sessions with master instructors, schedule makeup classes, and stream recorded replays.
          </p>
        </div>
      </div>

      {/* TABS */}
      <div className="flex border-b border-[#E7DED1] gap-2 overflow-x-auto pb-px">
        {[
          { id: 'upcoming', label: '🔴 Live & Upcoming Classes' },
          { id: 'completed', label: '🎥 Recorded Class Archive' },
          { id: 'makeup', label: '📅 Schedule Makeup Session' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === tab.id
                ? 'border-[#E89B52] text-[#2B2B2B] bg-[#FAF6EF]'
                : 'border-transparent text-gray-400 hover:text-[#2B2B2B]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB CONTENT */}
      <AnimatePresence mode="wait">
        {activeTab === 'upcoming' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {upcomingClasses.map((cls) => (
                <div key={cls.id} className="bg-white border border-[#E7DED1] p-6 rounded-3xl space-y-4 shadow-xs relative overflow-hidden">
                  {cls.isLive && (
                    <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 bg-red-100 text-red-700 rounded-full text-[10px] font-black uppercase animate-pulse">
                      <span className="w-2 h-2 rounded-full bg-red-600"></span>
                      <span>LIVE NOW</span>
                    </div>
                  )}

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-[#E89B52] uppercase block">
                      {cls.courseName} • {cls.instrument}
                    </span>
                    <h3 className="font-display font-black text-lg text-[#2B2B2B]">{cls.title}</h3>
                  </div>

                  <div className="space-y-2 text-xs text-gray-600">
                    <div className="flex items-center gap-2">
                      <User size={14} className="text-[#E89B52]" />
                      <span>Instructor: <b>{cls.teacherName}</b></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-[#E89B52]" />
                      <span>{cls.date} • {cls.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-[#E89B52]" />
                      <span>{cls.branchName}</span>
                    </div>
                  </div>

                  <Button
                    variant="primary"
                    size="md"
                    className="w-full flex items-center justify-center gap-2 shadow-md"
                    onClick={() => setJoiningClass(cls)}
                  >
                    <ExternalLink size={16} />
                    <span>Join Google Meet Class</span>
                  </Button>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'completed' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {completedClasses.map((cls) => (
                <div key={cls.id} className="bg-white border border-[#E7DED1] p-6 rounded-3xl space-y-4 shadow-xs">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-gray-500 uppercase block">{cls.date} Recorded Session</span>
                    <h3 className="font-bold text-base text-[#2B2B2B]">{cls.title}</h3>
                    <p className="text-xs text-gray-500">Teacher: {cls.teacherName}</p>
                  </div>

                  <div className="bg-[#2B2B2B] p-4 rounded-2xl text-white space-y-3">
                    <span className="text-[10px] font-bold text-amber-400 uppercase block">Class Video Replay</span>
                    <video controls src={cls.recordingUrl} className="w-full rounded-xl bg-black max-h-48" />
                  </div>

                  {cls.materialsUrl && (
                    <Button variant="secondary" size="sm" className="w-full flex items-center justify-center gap-2">
                      <Download size={14} />
                      <span>Download PDF Class Materials</span>
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'makeup' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="max-w-xl mx-auto bg-white border border-[#E7DED1] p-6 sm:p-8 rounded-3xl space-y-6 shadow-xs">
            <div>
              <h3 className="font-display font-black text-lg text-[#2B2B2B]">Schedule Makeup Class Session</h3>
              <p className="text-xs text-gray-500">
                If you missed a scheduled physical or online class, request a makeup session with your instructor.
              </p>
            </div>

            {!makeupScheduled ? (
              <div className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-gray-600">Course</label>
                  <select
                    className="w-full p-2.5 bg-[#FAF6EF] border border-[#E7DED1] rounded-xl font-bold"
                    value={makeupCourse}
                    onChange={(e) => setMakeupCourse(e.target.value)}
                  >
                    <option value="Begena - Level 1">Begena - Level 1</option>
                    <option value="Krar Fundamentals">Krar Fundamentals</option>
                    <option value="Masenqo Level 1">Masenqo Level 1</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-gray-600">Preferred Date</label>
                    <Input type="date" value={makeupDate} onChange={(e) => setMakeupDate(e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-gray-600">Preferred Time</label>
                    <Input value={makeupTime} onChange={(e) => setMakeupTime(e.target.value)} />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-600">Reason for Absence</label>
                  <textarea
                    rows={2}
                    className="w-full p-3 bg-[#FAF6EF] border border-[#E7DED1] rounded-xl outline-none"
                    value={makeupReason}
                    onChange={(e) => setMakeupReason(e.target.value)}
                  />
                </div>

                <Button variant="primary" size="md" className="w-full" onClick={handleScheduleMakeup}>
                  Submit Makeup Class Request
                </Button>
              </div>
            ) : (
              <div className="p-6 bg-green-50 border border-green-200 rounded-2xl text-center space-y-3 text-xs">
                <CheckCircle size={32} className="mx-auto text-green-600" />
                <h4 className="font-bold text-green-900 text-sm">Makeup Request Submitted</h4>
                <p className="text-green-800">
                  Your instructor Abel Begena has been notified and will send your private Google Meet link.
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* JOIN GOOGLE MEET MODAL */}
      {joiningClass && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#E7DED1] rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-5 shadow-2xl relative">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-[#E89B52] uppercase block">Secured Google Meet Access</span>
              <h3 className="font-display font-black text-lg text-[#2B2B2B]">{joiningClass.title}</h3>
              <p className="text-xs text-gray-500">Instructor: {joiningClass.teacherName}</p>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl space-y-2 text-xs">
              <span className="font-bold text-amber-900 block flex items-center gap-1.5">
                <ShieldCheck size={16} />
                Class Etiquette & Guidelines
              </span>
              <ul className="list-disc pl-4 text-amber-800 space-y-1">
                {joiningClass.classRules.map((rule, idx) => (
                  <li key={idx}>{rule}</li>
                ))}
              </ul>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="secondary" size="sm" onClick={() => setJoiningClass(null)}>
                Cancel
              </Button>
              <a
                href={joiningClass.googleMeetUrl}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-[#E89B52] hover:bg-amber-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-sm"
              >
                <span>Launch Google Meet</span>
                <ExternalLink size={14} />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

