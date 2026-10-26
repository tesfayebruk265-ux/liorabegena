import React, { useState } from 'react';
import {
  BookOpen,
  Music,
  Clock,
  HelpCircle,
  Video,
  Bookmark,
  Award,
  Sliders,
  User,
  ChevronRight,
  Play,
  CheckCircle,
  Sparkles,
  FileText,
  MessageSquare,
  Lock,
  Flame,
  Search,
  Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth, isStudentAccessGranted } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { getStudentActiveEnrollments, normalizeInstrumentName } from '../utils/studentEnrollment';
import { Language } from '../types';
import { TiletPattern } from './TiletPattern';
import { Button, Input } from './InteractiveComponents';
import { RegistrationAndPaymentGate } from './RegistrationAndPaymentGate';

// Subcomponents
import { CourseLearningPortal } from './CourseLearningPortal';
import { BegenaLearningModule } from './BegenaLearningModule';
import { PracticeStudio } from './PracticeStudio';
import { MezmurLibraryCenter } from './MezmurLibraryCenter';
import { QuizAndAssessmentCenter } from './QuizAndAssessmentCenter';
import { LiveClassesCenter } from './LiveClassesCenter';
import { LmsTeacherAdminCenter } from './LmsTeacherAdminCenter';
import { ParentLearningView } from './ParentLearningView';

interface LearningCenterProps {
  lang: Language;
  onNavigate: (page: string, params?: any) => void;
  initialTab?: 'courses' | 'practice' | 'mezmur' | 'quizzes' | 'live' | 'bookmarks' | 'admin' | 'parent';
}

export function LearningCenter({
  lang,
  onNavigate,
  initialTab = 'courses'
}: LearningCenterProps) {
  const { currentUser, hasPermission } = useAuth();
  const { enrollments } = useData();
  const [activeTab, setActiveTab] = useState<'courses' | 'practice' | 'mezmur' | 'quizzes' | 'live' | 'bookmarks' | 'admin' | 'parent'>(initialTab);

  const activeEnrollments = React.useMemo(() => {
    return getStudentActiveEnrollments(currentUser, enrollments);
  }, [currentUser, enrollments]);

  const activeCourseNames = activeEnrollments.map((e) => e.courseName).join(', ') || currentUser?.enrolledCourse || `${currentUser?.enrolledInstrument || 'Begena'} Course`;
  const activeInstruments = Array.from(new Set(activeEnrollments.map((e) => normalizeInstrumentName(e.instrument || e.courseName)))).join(', ') || currentUser?.enrolledInstrument || 'Begena';

  // BOOKMARKS & NOTES STATE
  const [bookmarks, setBookmarks] = useState([
    { id: 'b1', title: 'Lesson 2 — Tuning 10 Begena Strings', type: 'lesson', course: 'Begena - Level 1' },
    { id: 'b2', title: 'በስመ አብ (Besme Ab) Slow Practice Track', type: 'mezmur', course: 'Begena - Level 1' }
  ]);
  const [notes, setNotes] = useState([
    { id: 'n1', target: 'Lesson 3 — Hand Position', text: 'Ask Teacher Bruk about left thumb angle during Sunday class.', timestamp: '12:45' }
  ]);
  const [newNoteText, setNewNoteText] = useState('');

  const handleAddNote = () => {
    if (!newNoteText) return;
    setNotes([
      ...notes,
      { id: `n-${Date.now()}`, target: 'General Lesson Note', text: newNoteText, timestamp: 'Live' }
    ]);
    setNewNoteText('');
  };

  return (
    <div className="min-h-screen bg-[#FAF6EF] text-[#2B2B2B]">
      {/* GLOBAL LMS HEADER & NAV */}
      <div className="bg-[#2B2B2B] text-white border-b border-amber-950/40 relative z-20 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('home')}>
            <div className="w-9 h-9 rounded-xl bg-[#E89B52] flex items-center justify-center font-display font-black text-white text-lg shadow-sm">
              A
            </div>
            <div>
              <span className="font-display font-black text-sm text-white tracking-wide block">
                LIORA BEGENA LEARNING CENTER
              </span>
              <span className="text-[10px] text-amber-400 font-mono block">Digital Music Academy Portal</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('student-dashboard')}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition cursor-pointer"
            >
              📊 Back to Dashboard
            </button>
          </div>
        </div>

        {/* LMS NAVIGATION BAR */}
        <div className="bg-[#212121] border-t border-white/10 overflow-x-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-1 py-1">
            {[
              { id: 'courses', label: '🎓 My Courses', icon: BookOpen },
              { id: 'practice', label: '🎯 Practice Studio', icon: Clock },
              { id: 'mezmur', label: '🎵 Mezmur Library', icon: Music },
              { id: 'quizzes', label: '❓ Quizzes & Theory', icon: HelpCircle },
              { id: 'live', label: '📹 Live Classes', icon: Video },
              { id: 'bookmarks', label: '🔖 Bookmarks & Notes', icon: Bookmark },
              ...(hasPermission('teacher') || hasPermission('admin') || currentUser?.role === 'teacher' || currentUser?.role === 'admin'
                ? [{ id: 'admin', label: '⚙️ Instructor LMS Studio', icon: Sliders }]
                : []),
              ...(currentUser?.role === 'parent' ? [{ id: 'parent', label: '👨‍👩‍👧 Parent View', icon: User }] : [])
            ].map((navItem) => {
              const Icon = navItem.icon;
              return (
                <button
                  key={navItem.id}
                  onClick={() => setActiveTab(navItem.id as any)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                    activeTab === navItem.id
                      ? 'bg-[#E89B52] text-white shadow-sm'
                      : 'text-gray-300 hover:bg-white/10'
                  }`}
                >
                  <Icon size={14} />
                  <span>{navItem.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* MAIN CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!isStudentAccessGranted(currentUser) ? (
          <RegistrationAndPaymentGate lang={lang} onNavigate={onNavigate} />
        ) : (
          <>
            {/* ENROLLED COURSE FILTER BANNER FOR STUDENTS */}
            {currentUser?.role === 'student' && (
              <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs text-amber-900 shadow-xs">
                <div className="flex items-center gap-2 font-bold">
                  <span className="p-1.5 bg-[#E89B52] text-white rounded-lg font-mono text-xs">🎓</span>
                  <span>Active Course Enrollment: <b>{activeCourseNames}</b></span>
                </div>
                <div className="flex items-center gap-2 text-amber-800 text-[11px]">
                  <CheckCircle size={14} className="text-emerald-600 shrink-0" />
                  <span>Showing tutorials, practice tools, and exercises curated for <b>{activeInstruments}</b>.</span>
                </div>
              </div>
            )}

            <AnimatePresence mode="wait">
          {/* TAB 1: MY COURSES */}
          {activeTab === 'courses' && (
            <motion.div key="courses" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <CourseLearningPortal lang={lang} onNavigate={onNavigate} />
            </motion.div>
          )}

          {/* TAB 2: PRACTICE STUDIO */}
          {activeTab === 'practice' && (
            <motion.div key="practice" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <PracticeStudio lang={lang} onNavigate={onNavigate} />
            </motion.div>
          )}

          {/* TAB 3: MEZMUR LIBRARY */}
          {activeTab === 'mezmur' && (
            <motion.div key="mezmur" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <MezmurLibraryCenter lang={lang} onNavigate={onNavigate} />
            </motion.div>
          )}

          {/* TAB 4: QUIZZES & ASSESSMENTS */}
          {activeTab === 'quizzes' && (
            <motion.div key="quizzes" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <QuizAndAssessmentCenter lang={lang} onNavigate={onNavigate} />
            </motion.div>
          )}

          {/* TAB 5: LIVE CLASSES */}
          {activeTab === 'live' && (
            <motion.div key="live" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <LiveClassesCenter lang={lang} onNavigate={onNavigate} />
            </motion.div>
          )}

          {/* TAB 6: BOOKMARKS & NOTES */}
          {activeTab === 'bookmarks' && (
            <motion.div key="bookmarks" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8 pb-16">
              <div className="bg-[#2B2B2B] text-white p-6 sm:p-8 rounded-3xl relative overflow-hidden shadow-xl border border-amber-950/40">
                <TiletPattern className="opacity-15 text-[#E89B52] scale-125" />
                <div className="relative z-10 space-y-2">
                  <span className="text-xs font-bold text-[#E89B52] uppercase tracking-widest block">Personal Learning Repository</span>
                  <h1 className="font-display font-black text-2xl sm:text-3xl">BOOKMARKS & PERSONAL LESSON NOTES</h1>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* BOOKMARKS LIST */}
                <div className="bg-white border border-[#E7DED1] p-6 rounded-3xl space-y-4 shadow-xs">
                  <h3 className="font-display font-black text-sm uppercase text-[#2B2B2B] flex items-center gap-2">
                    <Bookmark className="text-[#E89B52]" size={18} />
                    <span>Saved Bookmarks ({bookmarks.length})</span>
                  </h3>

                  <div className="space-y-3">
                    {bookmarks.map((bm) => (
                      <div key={bm.id} className="p-4 bg-[#FAF6EF] border border-[#E7DED1] rounded-2xl flex items-center justify-between">
                        <div className="space-y-0.5">
                          <span className="font-bold text-xs text-[#2B2B2B]">{bm.title}</span>
                          <p className="text-[10px] text-gray-500">{bm.course} • {bm.type}</p>
                        </div>
                        <Button variant="secondary" size="sm" className="text-xs">Open</Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* PERSONAL NOTES */}
                <div className="bg-white border border-[#E7DED1] p-6 rounded-3xl space-y-4 shadow-xs">
                  <h3 className="font-display font-black text-sm uppercase text-[#2B2B2B] flex items-center gap-2">
                    <FileText className="text-[#E89B52]" size={18} />
                    <span>Private Video & Lesson Notes</span>
                  </h3>

                  <div className="space-y-3">
                    {notes.map((n) => (
                      <div key={n.id} className="p-4 bg-amber-50/50 border border-amber-200 rounded-2xl space-y-1">
                        <div className="flex justify-between text-[10px] font-bold text-amber-900 uppercase">
                          <span>{n.target}</span>
                          <span>Timestamp: {n.timestamp}</span>
                        </div>
                        <p className="text-xs text-amber-800 leading-relaxed italic">"{n.text}"</p>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 space-y-2">
                    <Input
                      value={newNoteText}
                      onChange={(e) => setNewNoteText(e.target.value)}
                      placeholder="Write a private note or reminder..."
                    />
                    <Button variant="primary" size="sm" className="w-full" onClick={handleAddNote}>
                      + Save Personal Note
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 7: INSTRUCTOR LMS STUDIO */}
          {activeTab === 'admin' && (
            <motion.div key="admin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <LmsTeacherAdminCenter lang={lang} onNavigate={onNavigate} />
            </motion.div>
          )}

          {/* TAB 8: PARENT VIEW */}
          {activeTab === 'parent' && (
            <motion.div key="parent" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <ParentLearningView lang={lang} onNavigate={onNavigate} />
            </motion.div>
          )}
        </AnimatePresence>
      </>
    )}
  </main>
    </div>
  );
}

