import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Clock,
  Lock,
  Sparkles,
  UserCheck,
  MessageSquare,
  Calendar,
  Award,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Music,
  Sliders,
  ShieldCheck,
  Layers,
  Compass,
  ArrowRight,
  User,
  GraduationCap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Language, StudentEnrollment } from '../types';
import { TiletPattern } from './TiletPattern';
import { BegenaLearningModule } from './BegenaLearningModule';
import { KrarLearningPortal } from './KrarLearningPortal';
import { Button } from './InteractiveComponents';
import { getStudentActiveEnrollments, isStudentEnrolledInInstrument, normalizeInstrumentName, InstrumentType } from '../utils/studentEnrollment';
import {
  getChaptersForCourse,
  getLessonsForCourse,
  getStudentCompletedLessonIds,
  toggleLessonComplete,
  syncStudentProgressToEnrollment,
  calculateStudentProgress
} from '../utils/courseLearningSync';

interface CourseLearningPortalProps {
  lang: Language;
  onNavigate: (page: string, params?: any) => void;
  requestedCourseId?: string;
}

export function CourseLearningPortal({
  lang,
  onNavigate,
  requestedCourseId
}: CourseLearningPortalProps) {
  const { currentUser } = useAuth();
  const { enrollments, teachers } = useData();

  // 1. Determine verified active enrollments for the student
  const [activeEnrollmentIndex, setActiveIndex] = useState(0);

  const studentEnrollments = React.useMemo(() => {
    return getStudentActiveEnrollments(currentUser, enrollments);
  }, [currentUser, enrollments]);

  // Selected active enrollment
  const activeEnrollment = studentEnrollments[activeEnrollmentIndex] || studentEnrollments[0];

  // Instrument detection from active enrollment
  const rawInstrumentName = activeEnrollment ? (activeEnrollment.instrument || activeEnrollment.courseName) : 'Begena';
  const currentInstrument: InstrumentType = normalizeInstrumentName(rawInstrumentName);
  const currentCourseName = activeEnrollment?.courseName || `${currentInstrument} Course`;
  const currentLevel = (activeEnrollment?.level || 'Basic 1').toLowerCase();

  const isBegena = currentInstrument === 'Begena';
  const isKrar = currentInstrument === 'Krar';
  const isBasic1 =
    currentLevel.includes('basic 1') ||
    currentLevel.includes('level 1') ||
    currentCourseName.toLowerCase().includes('basic 1') ||
    currentCourseName.toLowerCase().includes('level 1') ||
    (!currentCourseName.toLowerCase().includes('basic 2') &&
      !currentCourseName.toLowerCase().includes('basic 3') &&
      !currentCourseName.toLowerCase().includes('level 2') &&
      !currentCourseName.toLowerCase().includes('level 3'));

  const isBegenaBasic1 = isBegena && isBasic1;

  // Find assigned teacher details if available
  const assignedTeacher = teachers.find(
    (t) =>
      (activeEnrollment?.assignedTeacherId && t.id === activeEnrollment.assignedTeacherId) ||
      (activeEnrollment?.assignedTeacherEmail && (t.email || '').toLowerCase() === activeEnrollment.assignedTeacherEmail.toLowerCase()) ||
      (activeEnrollment?.assignedTeacherName && (t.fullName || '').toLowerCase() === activeEnrollment.assignedTeacherName.toLowerCase())
  );

  // Security guard check
  const isAccessAllowed = isStudentEnrolledInInstrument(currentUser, currentInstrument, enrollments);

  if (!currentUser) {
    return (
      <div className="bg-white border border-[#E7DED1] p-8 rounded-3xl text-center space-y-4">
        <AlertCircle size={36} className="mx-auto text-[#E89B52]" />
        <h2 className="text-xl font-bold font-display">Authentication Required</h2>
        <p className="text-xs text-gray-600">Please sign in to access your student learning portal.</p>
        <Button variant="primary" onClick={() => onNavigate('login')}>Sign In</Button>
      </div>
    );
  }

  if (studentEnrollments.length === 0 && currentUser.role === 'student') {
    return (
      <div className="bg-white border border-[#E7DED1] p-8 sm:p-12 rounded-3xl text-center space-y-6 max-w-xl mx-auto my-8 shadow-xs">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-[#E89B52] flex items-center justify-center mx-auto">
          <BookOpen size={32} />
        </div>
        <div className="space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#E89B52] bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            No Active Enrollment
          </span>
          <h2 className="font-display font-black text-2xl text-[#2B2B2B]">Student Portal Locked</h2>
          <p className="text-xs text-gray-600 leading-relaxed">
            You do not currently have an active course enrollment. Select an Ethiopian traditional instrument course (Begena, Krar, Masenqo, Washint) to start learning.
          </p>
        </div>
        <div className="pt-2 flex justify-center gap-3">
          <Button variant="primary" onClick={() => onNavigate('courses')} className="bg-[#E89B52] text-white text-xs font-bold py-2.5 px-5 rounded-xl">
            Explore Courses & Enroll
          </Button>
        </div>
      </div>
    );
  }

  if (!isAccessAllowed) {
    return (
      <div className="bg-white border border-red-200 p-8 rounded-3xl text-center space-y-4 max-w-xl mx-auto my-8 shadow-xs">
        <Lock size={36} className="mx-auto text-red-500" />
        <h2 className="text-xl font-bold font-display text-gray-900">Access Denied</h2>
        <p className="text-xs text-gray-600">
          You are not enrolled in the <strong>{currentInstrument}</strong> learning portal. Your registered course instrument is different.
        </p>
        <div className="pt-2 flex justify-center gap-3">
          <Button variant="primary" onClick={() => setActiveIndex(0)} className="bg-[#E89B52] text-white text-xs font-bold py-2 px-4 rounded-xl">
            Go to My Enrolled Course
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* MULTIPLE ENROLLMENT COURSE SWITCHER (Requirement 7 & 12) */}
      {studentEnrollments.length > 1 && (
        <div className="bg-white border border-[#E7DED1] p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2">
            <Layers size={18} className="text-[#E89B52]" />
            <span className="text-xs font-bold uppercase text-gray-700">My Enrolled Courses ({studentEnrollments.length})</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {studentEnrollments.map((enr, idx) => {
              const instNorm = normalizeInstrumentName(enr.instrument || enr.courseName);
              return (
                <button
                  key={enr.id || idx}
                  onClick={() => setActiveIndex(idx)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                    activeEnrollmentIndex === idx
                      ? 'bg-[#E89B52] text-white shadow-sm ring-2 ring-amber-300'
                      : 'bg-[#FAF6EF] text-gray-700 hover:bg-amber-100 border border-[#E7DED1]'
                  }`}
                >
                  <GraduationCap size={15} />
                  <span>{enr.courseName || `${instNorm} Course`}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/10 font-mono">{instNorm}</span>
                  {activeEnrollmentIndex === idx && <CheckCircle2 size={14} className="ml-1" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ROUTING DECISION: Begena vs Krar vs Other Instrument Portal */}
      {isBegena ? (
        /* BEGENA LEARNING MODULE */
        <BegenaLearningModule
          lang={lang}
          onNavigate={onNavigate}
          enrollment={activeEnrollment}
        />
      ) : isKrar ? (
        /* KRAR STUDENT LEARNING PORTAL */
        <KrarLearningPortal
          lang={lang}
          onNavigate={onNavigate}
          enrollment={activeEnrollment}
        />
      ) : (
        /* PORTAL FOR OTHER INSTRUMENTS (Masenqo, Washint, Kebero, Vocal) */
        <EmptyCoursePortal
          enrollment={activeEnrollment}
          teacher={assignedTeacher}
          lang={lang}
          onNavigate={onNavigate}
        />
      )}
    </div>
  );
}

// ==========================================
// EMPTY COURSE PORTAL COMPONENT
// ==========================================
interface EmptyCoursePortalProps {
  enrollment: StudentEnrollment;
  teacher?: any;
  lang: Language;
  onNavigate: (page: string, params?: any) => void;
}

function EmptyCoursePortal({ enrollment, teacher, lang, onNavigate }: EmptyCoursePortalProps) {
  const { currentUser } = useAuth();
  const courseTitle = enrollment.courseName || `${enrollment.instrument} Course`;
  const instrumentName = enrollment.instrument || 'Traditional Instrument';
  const levelName = enrollment.level || 'Basic Level';
  const teacherName = enrollment.assignedTeacherName || teacher?.fullName || 'Assigned Instructor';

  const chapters = getChaptersForCourse(instrumentName, levelName);
  const lessons = getLessonsForCourse(instrumentName, levelName);

  const studentId = currentUser?.id || enrollment.studentId || enrollment.id;
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>(() => {
    return getStudentCompletedLessonIds(studentId, instrumentName);
  });

  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [selectedLesson, setSelectedLesson] = useState<any>(null);

  const currentChapter = chapters[activeChapterIndex] || chapters[0];
  const currentChapterLessons = lessons.filter(l => !currentChapter || l.chapterId === currentChapter.id);

  const handleToggleLesson = (lesId: string) => {
    let updated: string[];
    if (completedLessonIds.includes(lesId)) {
      updated = completedLessonIds.filter(id => id !== lesId);
    } else {
      updated = [...completedLessonIds, lesId];
    }
    setCompletedLessonIds(updated);
    toggleLessonComplete(studentId, enrollment.id, instrumentName, lesId);
    syncStudentProgressToEnrollment(studentId, instrumentName, enrollment.id);
  };

  const handleAdvanceChapter = () => {
    const incomplete = currentChapterLessons.filter(l => l.isRequired !== false && !completedLessonIds.includes(l.id));
    if (incomplete.length > 0) {
      alert(`Please complete all required lessons in ${currentChapter?.title || 'this chapter'} before advancing to the next chapter.`);
      return;
    }

    if (activeChapterIndex < chapters.length - 1) {
      setActiveChapterIndex(prev => prev + 1);
    }
    syncStudentProgressToEnrollment(studentId, instrumentName, enrollment.id);
  };

  const progressInfo = calculateStudentProgress(studentId, instrumentName, levelName);
  const progressPct = progressInfo.progressPercent;

  return (
    <div className="space-y-6">
      {/* HEADER BANNER */}
      <div className="bg-[#2B2B2B] text-white p-6 sm:p-8 rounded-3xl relative overflow-hidden shadow-xl border border-amber-950/40">
        <TiletPattern className="opacity-15 text-[#E89B52] scale-125" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#E89B52] text-white text-[10px] font-bold tracking-widest uppercase">
                {instrumentName} ACADEMIC PORTAL
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-amber-300 text-[10px] font-mono">
                {levelName}
              </span>
            </div>
            <h1 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-wide">
              {courseTitle}
            </h1>
            <p className="text-xs text-amber-100/80 max-w-xl">
              Official student portal for {instrumentName} classical instruction at Abel Begena Traditional Music School.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-white/10 border border-white/20 px-4 py-2 rounded-2xl text-right">
              <span className="text-[10px] text-amber-200 block uppercase font-bold">Overall Mastery</span>
              <span className="font-mono text-lg font-black text-[#E89B52]">{progressPct}%</span>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onNavigate('practice')}
              className="bg-amber-900/80 hover:bg-amber-900 text-amber-200 border border-amber-700/60 text-xs py-2 cursor-pointer font-bold flex items-center gap-1.5"
            >
              <Clock size={14} /> Practice Studio
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onNavigate('messages')}
              className="bg-white/10 hover:bg-white/20 text-white text-xs py-2 cursor-pointer font-bold flex items-center gap-1.5"
            >
              <MessageSquare size={14} /> Contact Instructor
            </Button>
          </div>
        </div>
      </div>

      {/* ENROLLMENT & ASSIGNED TEACHER CARD */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* ENROLLMENT DETAILS */}
        <div className="bg-white border border-[#E7DED1] p-5 rounded-2xl space-y-3 shadow-xs">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Active Enrollment</span>
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs border-b border-gray-100 pb-2">
              <span className="text-gray-500">Student Name:</span>
              <span className="font-bold text-gray-900">{enrollment.studentName}</span>
            </div>
            <div className="flex justify-between items-center text-xs border-b border-gray-100 pb-2">
              <span className="text-gray-500">Instrument:</span>
              <span className="font-bold text-[#E89B52]">{instrumentName}</span>
            </div>
            <div className="flex justify-between items-center text-xs border-b border-gray-100 pb-2">
              <span className="text-gray-500">Enrolled Level:</span>
              <span className="font-bold text-gray-800">{levelName}</span>
            </div>
            <div className="flex justify-between items-center text-xs pb-1">
              <span className="text-gray-500">Completion Progress:</span>
              <span className="font-bold font-mono text-emerald-600">{progressPct}%</span>
            </div>
          </div>
        </div>

        {/* ASSIGNED TEACHER CARD */}
        <div className="bg-white border border-[#E7DED1] p-5 rounded-2xl space-y-3 shadow-xs md:col-span-2">
          <span className="text-[10px] font-bold text-[#E89B52] uppercase tracking-widest block">Assigned Faculty Instructor</span>
          <div className="flex items-center gap-4 pt-1">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 border border-amber-300 overflow-hidden shrink-0 flex items-center justify-center font-bold text-amber-800 text-lg">
              {teacher?.photo ? (
                <img src={teacher.photo} alt={teacherName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <User size={28} />
              )}
            </div>
            <div className="space-y-1 min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-gray-900 truncate">{teacherName}</h3>
                <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold flex items-center gap-1">
                  <UserCheck size={10} /> Active Instructor
                </span>
              </div>
              <p className="text-xs text-gray-500 truncate">
                Specialization: {teacher?.specializations?.join(', ') || instrumentName}
              </p>
              <div className="flex items-center gap-3 pt-1 text-[11px]">
                <button
                  onClick={() => onNavigate('messages')}
                  className="text-[#E89B52] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                >
                  <MessageSquare size={12} /> Direct Message
                </button>
                {teacher?.phone && (
                  <span className="text-gray-400 font-mono">{teacher.phone}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CHAPTER ROADMAP & LESSON PORTAL */}
      {chapters.length > 0 ? (
        <div className="space-y-6">
          {/* CHAPTER NAVIGATION TABS */}
          <div className="bg-white border border-[#E7DED1] p-3 rounded-2xl flex flex-wrap items-center gap-2 shadow-xs">
            {chapters.map((chap, idx) => {
              const isActive = activeChapterIndex === idx;
              const chapLessons = lessons.filter(l => l.chapterId === chap.id);
              const chapCompletedCount = chapLessons.filter(l => completedLessonIds.includes(l.id)).length;
              const isChapDone = chapLessons.length > 0 && chapCompletedCount === chapLessons.length;

              return (
                <button
                  key={chap.id}
                  onClick={() => setActiveChapterIndex(idx)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                    isActive
                      ? 'bg-[#E89B52] text-white shadow-sm'
                      : isChapDone
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-[#FAF6EF] text-gray-700 hover:bg-amber-100 border border-[#E7DED1]'
                  }`}
                >
                  <Layers size={14} />
                  <span>{chap.title}</span>
                  {isChapDone && <CheckCircle2 size={14} className="text-emerald-600" />}
                </button>
              );
            })}
          </div>

          {/* ACTIVE CHAPTER DETAIL & LESSONS */}
          {currentChapter && (
            <div className="bg-white border border-[#E7DED1] p-6 rounded-3xl space-y-6 shadow-xs">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-4">
                <div>
                  <span className="text-[10px] font-mono tracking-widest text-[#E89B52] uppercase font-bold block">
                    CHAPTER {currentChapter.order} OF {chapters.length}
                  </span>
                  <h3 className="font-display font-black text-lg text-gray-900">{currentChapter.title}</h3>
                  <p className="text-xs text-gray-500 mt-1">{currentChapter.description}</p>
                </div>

                <Button
                  variant="primary"
                  onClick={handleAdvanceChapter}
                  className="bg-[#E89B52] text-white text-xs font-bold py-2.5 px-4 rounded-xl shrink-0 flex items-center gap-2 cursor-pointer"
                >
                  <span>Complete Chapter & Move Next</span>
                  <ChevronRight size={16} />
                </Button>
              </div>

              {/* VIDEO PLAYER PREVIEW IF LESSON SELECTED */}
              {selectedLesson && (
                <div className="bg-black/90 p-4 rounded-2xl text-white space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-amber-400 flex items-center gap-1">
                      <BookOpen size={14} /> Now Playing: {selectedLesson.title}
                    </span>
                    <button onClick={() => setSelectedLesson(null)} className="text-gray-400 hover:text-white font-bold cursor-pointer">
                      ✕ Close Video
                    </button>
                  </div>
                  <div className="aspect-video w-full rounded-xl overflow-hidden bg-black">
                    <iframe
                      src={selectedLesson.videoUrl || 'https://www.youtube.com/embed/2GpKxNl_KW0'}
                      title={selectedLesson.title}
                      className="w-full h-full border-0"
                      allowFullScreen
                    />
                  </div>
                  <p className="text-xs text-gray-300">{selectedLesson.description || selectedLesson.explanation}</p>
                </div>
              )}

              {/* LESSONS LIST */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase text-gray-500 tracking-wider">Chapter Lessons & Demonstration Units</h4>
                {currentChapterLessons.length === 0 ? (
                  <p className="text-xs text-gray-400 italic">No specific lessons created for this chapter yet.</p>
                ) : (
                  currentChapterLessons.map((les) => {
                    const isDone = completedLessonIds.includes(les.id);
                    return (
                      <div
                        key={les.id}
                        className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs ${
                          isDone ? 'bg-emerald-50/50 border-emerald-200' : 'bg-[#FAF6EF]/50 border-[#E7DED1]'
                        }`}
                      >
                        <div className="flex items-start gap-3 min-w-0">
                          <button
                            type="button"
                            onClick={() => handleToggleLesson(les.id)}
                            className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 cursor-pointer transition ${
                              isDone ? 'bg-emerald-500 text-white' : 'bg-white border border-gray-300 text-gray-400 hover:border-amber-500'
                            }`}
                          >
                            {isDone ? <CheckCircle2 size={16} /> : les.order}
                          </button>

                          <div className="space-y-1 min-w-0">
                            <span className="font-bold text-gray-900 block text-sm">{les.title}</span>
                            <p className="text-xs text-gray-600 line-clamp-2">{les.description || (les as any).explanation}</p>
                            <span className="text-[10px] font-mono text-gray-400 block">
                              Duration: {les.durationText || '20 min'} • {les.isRequired ? 'Required' : 'Optional'}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                          {les.videoUrl && (
                            <button
                              onClick={() => setSelectedLesson(les)}
                              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 flex items-center gap-1.5 cursor-pointer"
                            >
                              <BookOpen size={14} /> Watch Lesson
                            </button>
                          )}
                          <button
                            onClick={() => handleToggleLesson(les.id)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition ${
                              isDone ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-white text-gray-700 border border-gray-200 hover:bg-amber-50'
                            }`}
                          >
                            {isDone ? '✓ Completed' : '○ Mark Complete'}
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* FALLBACK IF NO CHAPTERS YET */
        <div className="bg-white border border-[#E7DED1] p-8 sm:p-12 rounded-3xl shadow-xs text-center space-y-6 max-w-2xl mx-auto">
          <div className="w-20 h-20 rounded-3xl bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto text-[#E89B52] shadow-sm">
            <BookOpen size={36} />
          </div>

          <div className="space-y-3">
            <span className="text-xs font-bold text-[#E89B52] uppercase tracking-widest block">
              {instrumentName.toUpperCase()} • {levelName.toUpperCase()}
            </span>
            <h2 className="font-display font-black text-xl sm:text-2xl text-[#2B2B2B]">
              Your {instrumentName} Learning Journey
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
              Assigned Instructor: <strong className="text-gray-900">{teacherName}</strong>
            </p>
          </div>

          <div className="p-4 bg-[#FAF6EF] border border-[#E7DED1] rounded-2xl text-left space-y-2 max-w-md mx-auto text-xs text-gray-700">
            <div className="flex items-center gap-2 font-bold text-[#2B2B2B]">
              <Sparkles size={16} className="text-[#E89B52]" />
              <span>Interactive Learning Notes</span>
            </div>
            <ul className="space-y-1.5 text-gray-600 pl-6 list-disc text-[11px]">
              <li>You can log practice hours in the studio to notify your instructor.</li>
              <li>Your teacher tracks your chapter completion percentage automatically in the faculty portal.</li>
              <li>Contact your teacher anytime via the direct messaging center.</li>
            </ul>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Button
              variant="primary"
              onClick={() => onNavigate('practice')}
              className="bg-[#E89B52] text-white text-xs py-2.5 px-4 rounded-xl cursor-pointer font-bold flex items-center gap-2"
            >
              <Clock size={15} /> Log Practice Hours
            </Button>
            <Button
              variant="secondary"
              onClick={() => onNavigate('messages')}
              className="bg-amber-900 hover:bg-amber-950 text-white text-xs py-2.5 px-4 rounded-xl cursor-pointer font-bold flex items-center gap-2"
            >
              <MessageSquare size={15} /> Contact Teacher
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
