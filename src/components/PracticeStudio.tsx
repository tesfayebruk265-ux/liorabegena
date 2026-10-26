import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  Mic,
  Video,
  VideoOff,
  Square,
  Flame,
  Clock,
  Calendar,
  CheckCircle,
  Sparkles,
  Music,
  Share2,
  Lock,
  Upload,
  MessageSquare,
  Award,
  ChevronRight,
  Filter,
  Check,
  AlertCircle,
  Repeat,
  Radio,
  Sliders,
  Maximize2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth, isStudentAccessGranted } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Button, Input } from './InteractiveComponents';
import { TiletPattern } from './TiletPattern';
import { RegistrationAndPaymentGate } from './RegistrationAndPaymentGate';
import { BegenaScaleSimulatorBoard } from './BegenaScaleSimulatorBoard';
import { KrarScaleSimulatorBoard } from './KrarLearningPortal';
import { Language, PracticeSessionRecord } from '../types';
import { getStudentActiveEnrollments, normalizeInstrumentName, InstrumentType } from '../utils/studentEnrollment';

interface PracticeStudioProps {
  lang: Language;
  onNavigate: (page: string, params?: any) => void;
  initialTab?: 'virtual-begena' | 'timer' | 'recorder' | 'audio-player' | 'guides' | 'history';
}

// Helper to extract student's registered instrument accurately
function getStudentRegisteredInstrument(currentUser: any): 'Begena' | 'Krar' | 'Masenqo' | 'Washint' | 'Vocal' | 'Kebero' {
  if (!currentUser) return 'Begena';
  let raw = currentUser.enrolledInstrument || currentUser.enrolledCourse || currentUser.selectedCourseName || currentUser.instrument || '';

  if (!raw && currentUser.email) {
    try {
      const savedEnr = localStorage.getItem('ab_enrollments_v3');
      if (savedEnr) {
        const parsed = JSON.parse(savedEnr);
        const myEnr = parsed.find((e: any) => (currentUser?.email && e?.studentEmail === currentUser.email) || (currentUser?.id && e?.studentId === currentUser.id));
        if (myEnr) raw = myEnr.instrument || myEnr.courseName || myEnr.course || '';
      }
    } catch (e) {}

    if (!raw) {
      try {
        const savedSt = localStorage.getItem('ab_students_v3');
        if (savedSt) {
          const parsed = JSON.parse(savedSt);
          const mySt = parsed.find((s: any) => (currentUser?.email && s?.email === currentUser.email) || (currentUser?.id && s?.id === currentUser.id));
          if (mySt) raw = mySt.instrument || mySt.courseName || mySt.course || '';
        }
      } catch (e) {}
    }
  }

  if (!raw) raw = 'Begena';

  const lower = raw.toLowerCase();
  if (lower.includes('kirar') || lower.includes('krar') || lower.includes('ክራር') || lower.includes('ቅራር')) return 'Krar';
  if (lower.includes('masenqo') || lower.includes('masinko') || lower.includes('ማሰንቆ')) return 'Masenqo';
  if (lower.includes('washint') || lower.includes('flute') || lower.includes('ዋሽንት')) return 'Washint';
  if (lower.includes('vocal') || lower.includes('voice') || lower.includes('mezmur') || lower.includes('ድምፅ') || lower.includes('ዜማ')) return 'Vocal';
  if (lower.includes('kebero') || lower.includes('drum') || lower.includes('ከበሮ')) return 'Kebero';
  if (lower.includes('begena') || lower.includes('በገና')) return 'Begena';
  return 'Begena';
}

// Frequencies for Krar Pentatonic Scales (6 Physical Strings: Str1: 2nd, Str2: 3rd, Str3: 4th, Str4: 5th, Str5: 1st, Str6: 6th)
const KRAR_SCALE_FREQUENCIES_MAP: Record<string, number[]> = {
  tizita: [293.66, 329.63, 392.00, 440.00, 261.63, 523.25],    // Str 1: D4 (#2), Str 2: E4 (#3), Str 3: G4 (#4), Str 4: A4 (#5), Str 5: C4 (#1), Str 6: C5 (#6)
  anchihoye: [277.18, 349.23, 369.99, 440.00, 261.63, 523.25], // Str 1: C#4, Str 2: F4, Str 3: F#4, Str 4: A4, Str 5: C4, Str 6: C5
  cherenet: [277.18, 349.23, 369.99, 440.00, 261.63, 523.25],  // Alias for ቸርነት / anchihoye
  bati: [329.63, 349.23, 392.00, 493.88, 261.63, 523.25],      // Str 1: E4, Str 2: F4, Str 3: G4, Str 4: B4, Str 5: C4, Str 6: C5
  ambassel: [277.18, 349.23, 392.00, 415.30, 261.63, 523.25]   // Str 1: C#4, Str 2: F4, Str 3: G4, Str 4: G#4, Str 5: C4, Str 6: C5
};

function KrarPracticeStudioBoard() {
  const [selectedKrarScale, setSelectedKrarScale] = useState<'tizita' | 'anchihoye' | 'bati' | 'ambassel' | 'cherenet'>('tizita');
  const [pluckedStringIndex, setPluckedStringIndex] = useState<number | null>(null);
  const [isPlayingSequence, setIsPlayingSequence] = useState<boolean>(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  const playKrarStringTone = (stringIdx: number, overrideScale?: string) => {
    setPluckedStringIndex(stringIdx);
    setTimeout(() => setPluckedStringIndex(null), 350);

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!audioContextRef.current) audioContextRef.current = new AudioCtx();
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const scaleKey = overrideScale || selectedKrarScale || 'tizita';
      const freqs = KRAR_SCALE_FREQUENCIES_MAP[scaleKey] || KRAR_SCALE_FREQUENCIES_MAP.tizita;
      const freq = freqs[stringIdx] || 261.63;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(0.8, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 1.2);
    } catch (e) {
      console.error('Krar audio synth error:', e);
    }
  };

  const playScaleSequence = (scaleKey?: any, reverse?: boolean) => {
    if (isPlayingSequence) return;
    setIsPlayingSequence(true);
    const scale = scaleKey || selectedKrarScale;
    // Scale playing order (1 -> 6): String 5 (#1) -> String 1 (#2) -> String 2 (#3) -> String 3 (#4) -> String 4 (#5) -> String 6 (#6)
    const forwardSequence = [4, 0, 1, 2, 3, 5];
    const order = reverse ? [5, 3, 2, 1, 0, 4] : forwardSequence;

    order.forEach((strIdx, idx) => {
      setTimeout(() => {
        setPluckedStringIndex(strIdx);
        playKrarStringTone(strIdx, scale);
        if (idx === order.length - 1) {
          setTimeout(() => {
            setPluckedStringIndex(null);
            setIsPlayingSequence(false);
          }, 450);
        }
      }, idx * 450);
    });
  };

  return (
    <div className="space-y-4">
      {/* SCALE SELECTOR PILLS */}
      <div className="bg-[#FAF6EF] p-4 rounded-2xl border border-[#E7DED1] flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">የክራር ቅኝቶች (Krar Pentatonic Scales):</span>
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'tizita', name: 'ትዝታ ቅኝት (Tizita)' },
            { id: 'anchihoye', name: 'ቸርነት / አንቺሆዬ (Anchihoye)' },
            { id: 'bati', name: 'ባቲ ቅኝት (Bati)' },
            { id: 'ambassel', name: 'አምባሰል ቅኝት (Ambassel)' }
          ].map((sc) => (
            <button
              key={sc.id}
              onClick={() => setSelectedKrarScale(sc.id as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                selectedKrarScale === sc.id
                  ? 'bg-[#E89B52] text-white shadow-sm ring-2 ring-amber-300'
                  : 'bg-white text-gray-700 border border-[#E7DED1] hover:bg-amber-100/60'
              }`}
            >
              {sc.name}
            </button>
          ))}
        </div>
      </div>

      <KrarScaleSimulatorBoard
        scaleKey={selectedKrarScale as any}
        title={`Virtual Krar Studio • ${selectedKrarScale.toUpperCase()}`}
        subtitle="የተመረጠውን ቅኝት አውታሮች ይጫኑ ወይም «▶ ቅኝቱን አጫውት» የሚለውን ቁልፍ በመንካት ድምፃቸውን ይስሙ"
        playKrarStringTone={playKrarStringTone}
        pluckedStringIndex={pluckedStringIndex}
        playScaleSequence={playScaleSequence}
        isPlayingSequence={isPlayingSequence}
      />
    </div>
  );
}

// Helper to compute practice streak, start date and weekly minutes from session records
function computePracticeStats(sessions: PracticeSessionRecord[], studentId: string) {
  const userSessions = sessions.filter(s => !studentId || s.studentId === studentId || s.studentId === 'std-1');

  if (userSessions.length === 0) {
    const todayStr = new Date().toISOString().substring(0, 10);
    const formatted = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    return {
      streakDays: 0,
      weeklyMinutes: 0,
      startDate: todayStr,
      formattedStartDate: formatted
    };
  }

  // Find start date (earliest session date)
  const sortedByDate = [...userSessions].sort((a, b) => ((a?.createdAt || '') > (b?.createdAt || '') ? 1 : -1));
  const earliestDateStr = (sortedByDate[0]?.createdAt || new Date().toISOString()).substring(0, 10);
  const startDateObj = new Date(earliestDateStr);
  const formattedStartDate = startDateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  // Calculate unique practice dates
  const uniqueDates = new Set(userSessions.filter(s => s?.createdAt).map(s => s.createdAt.substring(0, 10)));

  // Consecutive streak calculation ending today or yesterday
  let streak = 0;
  let checkDate = new Date();
  let currStr = checkDate.toISOString().substring(0, 10);

  if (uniqueDates.has(currStr)) {
    while (uniqueDates.has(currStr)) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
      currStr = checkDate.toISOString().substring(0, 10);
    }
  } else {
    // Check if yesterday has a logged session
    checkDate.setDate(checkDate.getDate() - 1);
    currStr = checkDate.toISOString().substring(0, 10);
    while (uniqueDates.has(currStr)) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
      currStr = checkDate.toISOString().substring(0, 10);
    }
  }

  // Calculate weekly minutes (past 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  const sevenDaysAgoStr = sevenDaysAgo.toISOString().substring(0, 10);

  const weeklyMinutes = userSessions
    .filter(s => s.createdAt.substring(0, 10) >= sevenDaysAgoStr)
    .reduce((sum, s) => sum + (s.durationMinutes || 0), 0);

  return {
    streakDays: streak,
    weeklyMinutes,
    startDate: earliestDateStr,
    formattedStartDate
  };
}

// Sample initial practice history sessions
const MOCK_PRACTICE_SESSIONS: PracticeSessionRecord[] = [
  {
    id: 'ps-101',
    studentId: 'std-1',
    studentName: 'Yonas Tadesse',
    courseId: 'c1',
    courseName: 'Begena - Level 1',
    instrument: 'Begena',
    lessonTitle: 'Hand Position & Left Thumb Plucking',
    durationMinutes: 45,
    practiceGoal: 'Master clean thumb plucking on string 1 and 2',
    notes: 'Focused on keeping my wrist relaxed as requested by Teacher Bruk.',
    recordingType: 'audio',
    visibility: 'Teacher Only',
    feedbackStatus: 'Reviewed',
    teacherFeedback: {
      score: 92,
      comment: 'Excellent hand posture! Your thumb placement is much steadier. Keep practice tempo steady.',
      rubricScores: {
        technique: 90,
        rhythm: 88,
        accuracy: 95,
        tone: 92,
        posture: 94,
        consistency: 90
      },
      date: '2026-07-20'
    },
    createdAt: '2026-07-20 18:30'
  }
];

export function PracticeStudio({ lang, onNavigate, initialTab = 'virtual-begena' }: PracticeStudioProps) {
  const { currentUser, addNotification } = useAuth();
  const { enrollments } = useData();
  const [activeTab, setActiveTab] = useState<'virtual-begena' | 'timer' | 'recorder' | 'audio-player' | 'guides' | 'history'>(initialTab);
  
  // Dynamic Student Active Enrollments & Registered Instruments
  const studentEnrollments = useMemo(() => getStudentActiveEnrollments(currentUser, enrollments), [currentUser, enrollments]);
  const enrolledInstruments = useMemo(() => {
    if (!currentUser || currentUser.role !== 'student') {
      return ['Begena', 'Krar', 'Masenqo', 'Washint', 'Vocal', 'Kebero'] as InstrumentType[];
    }
    const insts = studentEnrollments.map((e) => normalizeInstrumentName(e.instrument || e.courseName)).filter(Boolean);
    if (insts.length > 0) return Array.from(new Set(insts));
    if (currentUser.enrolledInstrument) {
      const norm = normalizeInstrumentName(currentUser.enrolledInstrument);
      if (norm) return [norm];
    }
    return [];
  }, [currentUser, studentEnrollments]);

  const defaultInstrument: InstrumentType = enrolledInstruments[0] || 'Begena';
  const [selectedInstrument, setSelectedInstrument] = useState<InstrumentType>(defaultInstrument);
  const [lockedNotice, setLockedNotice] = useState<string | null>(null);

  // Sync selected instrument with student active enrollments
  useEffect(() => {
    if (currentUser?.role === 'student') {
      if (!enrolledInstruments.includes(selectedInstrument)) {
        setSelectedInstrument(defaultInstrument);
      }
    }
  }, [currentUser?.role, enrolledInstruments, defaultInstrument, selectedInstrument]);

  const effectiveInstrument = selectedInstrument;

  // ==========================================
  // PRACTICE HISTORY & STREAK STATE
  // ==========================================
  const [sessionsList, setSessionsList] = useState<PracticeSessionRecord[]>(() => {
    try {
      const saved = localStorage.getItem('ab_practice_sessions_v4');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {}

    // Seed recent consecutive practice entries for realistic streak on initial load
    const today = new Date();
    const days = [0, 1, 2, 3, 4];
    const defaultInst = defaultInstrument || 'Begena';
    const sampleSessions: PracticeSessionRecord[] = days.map((d, i) => {
      const dateObj = new Date(today);
      dateObj.setDate(dateObj.getDate() - d);
      const dateStr = dateObj.toISOString().substring(0, 10);
      return {
        id: `ps-init-${i}`,
        studentId: currentUser?.id || 'std-1',
        studentName: currentUser?.fullName || 'Student',
        courseId: 'c1',
        courseName: `${defaultInst} Standard Level`,
        instrument: defaultInst,
        durationMinutes: 35 + (i * 5),
        practiceGoal: i === 0 ? `Master left hand posture and ${defaultInst} tuning` : 'Rhythm & finger accuracy drills',
        notes: 'Focused on steady tempo and relaxed posture.',
        visibility: 'Teacher Only',
        feedbackStatus: i === 0 ? 'Submitted' : 'Reviewed',
        createdAt: `${dateStr} 18:30`
      };
    });

    try {
      localStorage.setItem('ab_practice_sessions_v4', JSON.stringify(sampleSessions));
    } catch (e) {}

    return sampleSessions;
  });

  // Dynamically compute streak and practice stats
  const stats = useMemo(() => {
    return computePracticeStats(sessionsList, currentUser?.id || 'std-1');
  }, [sessionsList, currentUser?.id]);

  // ==========================================
  // 1. PRACTICE TIMER STATE
  // ==========================================
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [targetMinutes, setTargetMinutes] = useState<number>(30);
  const [practiceGoal, setPracticeGoal] = useState<string>('Improve posture and steady technique');
  const [sessionNotes, setSessionNotes] = useState<string>('');

  const timerRef = useRef<any>(null);

  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isTimerRunning]);

  const handleStartTimer = () => setIsTimerRunning(true);
  const handlePauseTimer = () => setIsTimerRunning(false);
  const handleResetTimer = () => {
    setIsTimerRunning(false);
    setTimerSeconds(0);
  };

  const handleSaveTimerSession = () => {
    setIsTimerRunning(false);
    const durationMins = Math.max(1, Math.round(timerSeconds / 60));
    const newSession: PracticeSessionRecord = {
      id: `ps-${Date.now()}`,
      studentId: currentUser?.id || 'std-1',
      studentName: currentUser?.fullName || 'Student',
      courseId: 'c1',
      courseName: `${effectiveInstrument} Standard Level`,
      instrument: effectiveInstrument,
      durationMinutes: durationMins,
      practiceGoal,
      notes: sessionNotes,
      visibility: 'Teacher Only',
      feedbackStatus: 'Submitted',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };

    const updated = [newSession, ...sessionsList];
    setSessionsList(updated);
    try {
      localStorage.setItem('ab_practice_sessions_v4', JSON.stringify(updated));
    } catch (e) {}

    setTimerSeconds(0);
    setSessionNotes('');
    
    const updatedStats = computePracticeStats(updated, currentUser?.id || 'std-1');
    addNotification(
      'Practice Session Logged',
      `Logged ${durationMins} minutes of ${effectiveInstrument} practice! Streak updated: ${updatedStats.streakDays} days.`,
      'lesson'
    );
    setActiveTab('history');
  };

  const formatTimerDisplay = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // ==========================================
  // 2. AUDIO & VIDEO RECORDER STATE
  // ==========================================
  const [mediaType, setMediaType] = useState<'audio' | 'video'>('audio');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordSeconds, setRecordSeconds] = useState<number>(0);
  const [recordedBlobUrl, setRecordedBlobUrl] = useState<string | null>(null);
  const [recordingCaption, setRecordingCaption] = useState<string>('');
  const [recordingVisibility, setRecordingVisibility] = useState<'Private' | 'Teacher Only' | 'Course' | 'Branch' | 'School Community' | 'Public'>('Teacher Only');
  const [recordingSaved, setRecordingSaved] = useState<boolean>(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const recordTimerRef = useRef<any>(null);

  const handleStartRecording = async () => {
    recordedChunksRef.current = [];
    setRecordSeconds(0);
    setRecordedBlobUrl(null);
    setRecordingSaved(false);

    try {
      const constraints = mediaType === 'video' ? { video: true, audio: true } : { audio: true };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, {
          type: mediaType === 'video' ? 'video/webm' : 'audio/webm'
        });
        const url = URL.createObjectURL(blob);
        setRecordedBlobUrl(url);
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start();
      setIsRecording(true);

      recordTimerRef.current = setInterval(() => {
        setRecordSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.warn('Browser media device access error or preview iframe limitation. Fallback to simulated recording mode.', err);
      setIsRecording(true);
      recordTimerRef.current = setInterval(() => {
        setRecordSeconds((prev) => prev + 1);
      }, 1000);
    }
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    clearInterval(recordTimerRef.current);

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    } else {
      setRecordedBlobUrl('https://actions.google.com/sounds/v1/ambiences/outdoor_rain.ogg');
    }
  };

  const handleSaveRecordingToTeacher = () => {
    if (!recordedBlobUrl) return;
    setRecordingSaved(true);
    const durationMins = Math.max(1, Math.round(recordSeconds / 60));
    const newSession: PracticeSessionRecord = {
      id: `rec-${Date.now()}`,
      studentId: currentUser?.id || 'std-1',
      studentName: currentUser?.fullName || 'Student',
      courseId: 'c1',
      courseName: `${effectiveInstrument} Standard Level`,
      instrument: effectiveInstrument,
      durationMinutes: durationMins,
      practiceGoal: recordingCaption || `${effectiveInstrument} Practice Recording`,
      recordingUrl: recordedBlobUrl,
      recordingType: mediaType,
      visibility: recordingVisibility,
      feedbackStatus: 'Submitted',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };

    const updated = [newSession, ...sessionsList];
    setSessionsList(updated);
    try {
      localStorage.setItem('ab_practice_sessions_v4', JSON.stringify(updated));
    } catch (e) {}

    const updatedStats = computePracticeStats(updated, currentUser?.id || 'std-1');
    addNotification(
      'Practice Recording Submitted',
      `Submitted ${mediaType} recording to Teacher Bruk! Streak updated: ${updatedStats.streakDays} days.`,
      'feedback'
    );
  };

  // ==========================================
  // 3. MUSIC PRACTICE AUDIO PLAYER STATE
  // ==========================================
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [isLooping, setIsLooping] = useState<boolean>(false);
  const [loopStartSec, setLoopStartSec] = useState<number>(15);
  const [loopEndSec, setLoopEndSec] = useState<number>(45);
  const [audioCurrentTime, setAudioCurrentTime] = useState<number>(15);
  const [selectedDemoAudio, setSelectedDemoAudio] = useState<string>('Begena Slow Tuning & Strum');

  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  const toggleAudioPlay = () => {
    if (!audioPlayerRef.current) return;
    if (isPlayingAudio) {
      audioPlayerRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioPlayerRef.current.play().then(() => setIsPlayingAudio(true)).catch(() => setIsPlayingAudio(true));
    }
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (audioPlayerRef.current) {
      audioPlayerRef.current.playbackRate = speed;
    }
  };

  // Filter practice history
  const [filterInstrument, setFilterInstrument] = useState<string>('All');
  const filteredSessions = sessionsList.filter((s) => filterInstrument === 'All' || s.instrument === filterInstrument);

  if (!isStudentAccessGranted(currentUser)) {
    return <RegistrationAndPaymentGate lang={lang} onNavigate={onNavigate} title="PRACTICE STUDIO LOCKED" />;
  }

  return (
    <div className="space-y-8 pb-16">
      {/* HEADER BANNER */}
      <div className="bg-[#2B2B2B] text-white p-6 sm:p-8 rounded-3xl relative overflow-hidden shadow-xl border border-amber-950/40">
        <TiletPattern className="opacity-15 text-[#E89B52] scale-125" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E89B52]/20 border border-[#E89B52]/40 text-[#E89B52] text-xs font-bold uppercase tracking-widest">
              <Sparkles size={14} />
              <span>Interactive Digital Practice Studio</span>
            </div>
            <h1 className="font-display font-black text-2xl sm:text-3xl text-white tracking-wide">
              PRACTICE, RECORD & MASTER {effectiveInstrument.toUpperCase()}
            </h1>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              Real-time practice timer, loop-repeat player, browser audio/video recording, and instrument-specific technique drills.
            </p>
          </div>

          {/* STREAK & STATS BADGE */}
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
            <div className="p-3 bg-gradient-to-br from-amber-500 to-amber-600 text-white rounded-xl shadow-md">
              <Flame size={24} className="animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-gray-300 block">Practice Streak</span>
              <div className="flex items-baseline gap-1.5">
                <span className="font-display font-black text-xl text-amber-400">{stats.streakDays}</span>
                <span className="text-xs font-bold text-gray-300">Days Active</span>
              </div>
              <span className="text-[11px] text-amber-200/80 block">{stats.weeklyMinutes} mins practiced this week</span>
              <span className="text-[10px] text-gray-400 block mt-0.5 font-medium">Start Date: {stats.formattedStartDate}</span>
            </div>
          </div>
        </div>

        {/* INSTRUMENT SWITCHER BAR */}
        <div className="relative z-10 mt-6 pt-6 border-t border-white/10 space-y-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <span className="text-xs text-gray-400 font-bold uppercase mr-2 whitespace-nowrap">Target Instrument:</span>
            {(['Begena', 'Krar', 'Masenqo', 'Washint', 'Vocal', 'Kebero'] as const).map((inst) => {
              const isStudent = currentUser?.role === 'student';
              const isLocked = isStudent && !enrolledInstruments.includes(inst as InstrumentType);
              const isSelected = selectedInstrument === inst;

              return (
                <button
                  key={inst}
                  onClick={() => {
                    if (isLocked) {
                      const enrolledListStr = enrolledInstruments.join(', ');
                      const notice = `You are enrolled in ${enrolledListStr} only. Access to ${inst} Practice Studio is locked. Please submit an enrollment application for ${inst} to unlock its practice studio.`;
                      setLockedNotice(notice);
                      addNotification('Instrument Practice Locked', notice, 'system');
                      return;
                    }
                    setSelectedInstrument(inst as InstrumentType);
                    setLockedNotice(null);
                  }}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-[#E89B52] text-white shadow-md ring-2 ring-amber-300/50'
                      : isLocked
                      ? 'bg-white/5 text-gray-400 hover:bg-white/10 opacity-60 border border-white/10 cursor-not-allowed'
                      : 'bg-white/10 hover:bg-white/20 text-gray-300'
                  }`}
                >
                  <span>{inst}</span>
                  {isLocked && <Lock size={12} className="text-amber-400/90" />}
                </button>
              );
            })}
          </div>

          {/* LOCKED INSTRUMENT NOTICE ALERT */}
          {lockedNotice && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-amber-500/20 border border-amber-500/40 rounded-xl text-amber-200 text-xs flex items-center justify-between gap-3 shadow-md"
            >
              <div className="flex items-center gap-2">
                <Lock size={14} className="text-amber-400 shrink-0" />
                <span className="font-bold">{lockedNotice}</span>
              </div>
              <button
                onClick={() => setLockedNotice(null)}
                className="text-amber-300 hover:text-white font-bold text-xs cursor-pointer px-1.5 py-0.5 rounded hover:bg-white/10"
              >
                ✕
              </button>
            </motion.div>
          )}
        </div>
      </div>

      {/* STUDIO NAVIGATION TABS */}
      <div className="flex border-b border-[#E7DED1] gap-2 overflow-x-auto pb-px">
        {[
          {
            id: 'virtual-begena',
            label:
              selectedInstrument === 'Krar'
                ? '🎼 Virtual Krar 6-String'
                : effectiveInstrument === 'Masenqo'
                ? '🎻 Virtual Masenqo Studio'
                : effectiveInstrument === 'Washint'
                ? '🪈 Virtual Washint Studio'
                : effectiveInstrument === 'Vocal'
                ? '🎙️ Virtual Vocal Studio'
                : effectiveInstrument === 'Kebero'
                ? '🥁 Virtual Kebero Studio'
                : '🎼 Virtual Begena 10-String',
            icon: Music
          },
          { id: 'timer', label: '⏱️ Practice Timer', icon: Clock },
          { id: 'recorder', label: '🎙️ Record Practice', icon: Mic },
          { id: 'audio-player', label: '🎵 Loop Audio Player', icon: Music },
          { id: 'guides', label: '🎸 Instrument Drills', icon: Sliders },
          { id: 'history', label: '📜 Practice Logs & Feedback', icon: Calendar }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2 whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                activeTab === tab.id
                  ? 'border-[#E89B52] text-[#2B2B2B] bg-[#FAF6EF]'
                  : 'border-transparent text-gray-400 hover:text-[#2B2B2B]'
              }`}
            >
              <Icon size={14} className={activeTab === tab.id ? 'text-[#E89B52]' : ''} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT */}
      <AnimatePresence mode="wait">
        {/* TAB 0: VIRTUAL INSTRUMENT SIMULATOR BOARD (COURSE-BASED) */}
        {activeTab === 'virtual-begena' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
            {effectiveInstrument === 'Krar' ? (
              <KrarPracticeStudioBoard />
            ) : effectiveInstrument === 'Begena' ? (
              <BegenaScaleSimulatorBoard
                scaleKey="tizita"
                title="ቨርቹዋል የበገና 10 አውታሮች ድርደራ (Virtual Begena Practice Studio)"
                subtitle="ለእያንዳንዱ መዝሙርና ቅኝት ከተሰጡት አውታሮች እና ድምፆች ጋር በቀጥታም ሆነ በተገላቢጦሽ (Reverse) በመጫወት ይለማመዱ"
                allowScaleChange={true}
              />
            ) : (
              <div className="bg-[#2B2B2B] text-white p-6 sm:p-8 rounded-3xl border border-amber-900/40 text-center space-y-4">
                <div className="w-12 h-12 mx-auto rounded-full bg-[#E89B52]/20 border border-[#E89B52]/40 text-[#E89B52] flex items-center justify-center font-bold">
                  <Music size={24} />
                </div>
                <h3 className="font-display font-black text-xl sm:text-2xl text-white uppercase">
                  Virtual {effectiveInstrument} Interactive Practice Board
                </h3>
                <p className="text-xs sm:text-sm text-gray-300 max-w-xl mx-auto leading-relaxed">
                  Dedicated {effectiveInstrument} interactive scale tuner, finger technique drills, and audio guides. Practice along with your instructor's registered course lessons.
                </p>
                <div className="pt-2 flex justify-center gap-3">
                  <span className="px-4 py-2 rounded-xl bg-[#E89B52] text-white font-bold text-xs shadow-sm">
                    {effectiveInstrument} Course Standard Scale
                  </span>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* TAB 1: PRACTICE TIMER */}
        {activeTab === 'timer' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white border border-[#E7DED1] p-6 sm:p-8 rounded-3xl space-y-6 shadow-xs text-center">
              <div className="space-y-1">
                <span className="text-xs font-bold text-[#E89B52] uppercase tracking-widest block">Live Session Counter</span>
                <h2 className="font-display font-black text-2xl text-[#2B2B2B] uppercase">
                  {effectiveInstrument} Practice Studio
                </h2>
              </div>

              {/* GIANT TIMER DISPLAY */}
              <div className="py-8 bg-[#2B2B2B] text-white rounded-2xl shadow-inner border border-amber-900/40 relative overflow-hidden">
                <TiletPattern className="opacity-10 text-amber-500 scale-150" />
                <div className="relative z-10 space-y-2">
                  <div className="font-mono font-black text-6xl sm:text-7xl tracking-wider text-amber-400 drop-shadow-md">
                    {formatTimerDisplay(timerSeconds)}
                  </div>
                  <div className="text-xs font-bold text-gray-300 uppercase tracking-widest">
                    Goal Target: {targetMinutes} Minutes ({Math.round((timerSeconds / (targetMinutes * 60)) * 100)}% Complete)
                  </div>
                </div>
              </div>

              {/* TIMER CONTROLS */}
              <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                {!isTimerRunning ? (
                  <Button variant="primary" size="lg" className="px-8 shadow-lg flex items-center gap-2" onClick={handleStartTimer}>
                    <Play size={18} />
                    <span>Start Practice Timer</span>
                  </Button>
                ) : (
                  <Button variant="secondary" size="lg" className="px-8 shadow-md flex items-center gap-2" onClick={handlePauseTimer}>
                    <Pause size={18} />
                    <span>Pause Session</span>
                  </Button>
                )}

                <Button variant="secondary" size="md" className="flex items-center gap-2" onClick={handleResetTimer}>
                  <RotateCcw size={16} />
                  <span>Reset</span>
                </Button>
              </div>

              {/* TARGET DURATION SELECTION */}
              <div className="pt-4 border-t border-[#E7DED1] space-y-3 text-left">
                <label className="text-xs font-bold text-gray-600 uppercase tracking-wide block">Select Session Target Duration:</label>
                <div className="grid grid-cols-4 gap-2">
                  {[15, 30, 45, 60].map((mins) => (
                    <button
                      key={mins}
                      onClick={() => setTargetMinutes(mins)}
                      className={`py-2 rounded-xl text-xs font-bold transition border cursor-pointer ${
                        targetMinutes === mins
                          ? 'bg-[#E89B52] text-white border-[#E89B52] shadow-sm'
                          : 'bg-[#FAF6EF] text-gray-700 border-[#E7DED1] hover:bg-amber-100'
                      }`}
                    >
                      {mins} Mins
                    </button>
                  ))}
                </div>
              </div>

              {/* PRACTICE GOAL & NOTES */}
              <div className="space-y-4 pt-4 border-t border-[#E7DED1] text-left">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-600 uppercase">Today's Practice Focus / Goal</label>
                  <Input
                    value={practiceGoal}
                    onChange={(e) => setPracticeGoal(e.target.value)}
                    placeholder="e.g., Master clean thumb strumming on string 1 and 2"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-600 uppercase">Personal Session Notes / Observations</label>
                  <textarea
                    rows={2}
                    className="w-full p-3 bg-[#FAF6EF] border border-[#E7DED1] rounded-xl text-xs outline-none focus:border-[#E89B52]"
                    placeholder="Note down difficulties, finger posture adjustments, or questions for your teacher..."
                    value={sessionNotes}
                    onChange={(e) => setSessionNotes(e.target.value)}
                  />
                </div>

                <Button
                  variant="primary"
                  size="md"
                  className="w-full flex items-center justify-center gap-2"
                  onClick={handleSaveTimerSession}
                  disabled={timerSeconds < 5}
                >
                  <CheckCircle size={16} />
                  <span>Save & Log Session ({Math.max(1, Math.round(timerSeconds / 60))} mins)</span>
                </Button>
              </div>
            </div>

            {/* SIDEBAR: STREAK & INSTRUMENT TIPS */}
            <div className="space-y-6">
              <div className="bg-[#FAF6EF] border border-[#E7DED1] p-6 rounded-3xl space-y-4">
                <div className="flex items-center gap-2 text-[#2B2B2B] font-display font-black text-sm uppercase">
                  <Award className="text-[#E89B52]" size={18} />
                  <span>Consistent Practice Rewards</span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Regular daily practice builds muscle memory and spiritual connection. Achieve a 7-day streak to unlock the <b>Master Plucker Badge</b>!
                </p>
                <div className="p-3 bg-white rounded-xl border border-[#E7DED1] space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span>Weekly Target</span>
                    <span className="text-[#E89B52]">185 / 210 Mins</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-[#E89B52] rounded-full" style={{ width: '88%' }}></div>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-[#E7DED1] p-6 rounded-3xl space-y-4">
                <h3 className="font-display font-black text-xs uppercase text-[#2B2B2B] tracking-wide">
                  Teacher Tip for {effectiveInstrument}
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed italic bg-amber-50/50 p-3 rounded-xl border border-amber-100">
                  "Maintain a relaxed posture. When plucking traditional strings, let the wrist rest gently without tension. Quality focused practice beats long fatigued sessions."
                </p>
                <span className="text-[10px] font-bold text-amber-800 block text-right">— Teacher Liora Begena</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 2: RECORD PRACTICE */}
        {activeTab === 'recorder' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white border border-[#E7DED1] p-6 sm:p-8 rounded-3xl space-y-6 shadow-xs">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-xs font-bold text-[#E89B52] uppercase tracking-widest block">Studio Recording Deck</span>
                  <h2 className="font-display font-black text-2xl text-[#2B2B2B] uppercase">
                    Record Your {effectiveInstrument} Practice
                  </h2>
                </div>
                <div className="flex bg-[#FAF6EF] p-1 rounded-xl border border-[#E7DED1]">
                  <button
                    onClick={() => setMediaType('audio')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer ${
                      mediaType === 'audio' ? 'bg-[#E89B52] text-white shadow-xs' : 'text-gray-600'
                    }`}
                  >
                    <Mic size={14} />
                    <span>Audio Only</span>
                  </button>
                  <button
                    onClick={() => setMediaType('video')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer ${
                      mediaType === 'video' ? 'bg-[#E89B52] text-white shadow-xs' : 'text-gray-600'
                    }`}
                  >
                    <Video size={14} />
                    <span>Video + Audio</span>
                  </button>
                </div>
              </div>

              {/* RECORDING CANVAS / DISPLAY */}
              <div className="p-8 bg-[#2B2B2B] text-white rounded-2xl shadow-inner border border-amber-900/40 text-center space-y-4 relative overflow-hidden">
                <TiletPattern className="opacity-10 text-amber-500 scale-150" />
                <div className="relative z-10 space-y-3">
                  <div className="w-16 h-16 mx-auto rounded-full bg-red-500/20 border-2 border-red-500 flex items-center justify-center">
                    {isRecording ? (
                      <div className="w-6 h-6 bg-red-500 rounded-sm animate-pulse"></div>
                    ) : (
                      <Mic className="text-red-400" size={28} />
                    )}
                  </div>

                  <div className="font-mono font-black text-4xl text-amber-400">
                    {formatTimerDisplay(recordSeconds)}
                  </div>

                  <p className="text-xs text-gray-300">
                    {isRecording ? `Recording live ${mediaType}... Speak/Play clearly into microphone` : 'Ready to record'}
                  </p>
                </div>
              </div>

              {/* RECORDING CONTROLS */}
              <div className="flex justify-center gap-4">
                {!isRecording ? (
                  <Button variant="primary" size="md" className="px-6 flex items-center gap-2" onClick={handleStartRecording}>
                    <Mic size={16} />
                    <span>Start Recording</span>
                  </Button>
                ) : (
                  <Button variant="destructive" size="md" className="px-6 flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white" onClick={handleStopRecording}>
                    <Square size={16} />
                    <span>Stop Recording</span>
                  </Button>
                )}
              </div>

              {/* RECORDED PREVIEW & SUBMISSION FORM */}
              {recordedBlobUrl && (
                <div className="p-6 bg-amber-50/60 border border-amber-200 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-amber-900 uppercase flex items-center gap-2">
                      <CheckCircle className="text-green-600" size={16} />
                      Recording Completed ({formatTimerDisplay(recordSeconds)})
                    </span>
                    <button
                      onClick={() => { setRecordedBlobUrl(null); setRecordSeconds(0); setRecordingSaved(false); }}
                      className="text-xs text-red-600 font-bold hover:underline"
                    >
                      Delete & Retake
                    </button>
                  </div>

                  {/* MEDIA PREVIEW PLAYER */}
                  <div className="bg-white p-3 rounded-xl border border-amber-200">
                    {mediaType === 'audio' ? (
                      recordedBlobUrl ? <audio controls src={recordedBlobUrl} className="w-full" /> : null
                    ) : (
                      recordedBlobUrl ? <video controls src={recordedBlobUrl} className="w-full max-h-64 rounded-lg bg-black" /> : null
                    )}
                  </div>

                  {/* CAPTION & VISIBILITY */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500 uppercase">Recording Title / Note</label>
                      <Input
                        value={recordingCaption}
                        onChange={(e) => setRecordingCaption(e.target.value)}
                        placeholder={`My ${effectiveInstrument} Practice Submission`}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500 uppercase">Sharing & Visibility Settings</label>
                      <select
                        className="w-full p-2.5 bg-white border border-[#E7DED1] rounded-lg text-xs"
                        value={recordingVisibility}
                        onChange={(e) => setRecordingVisibility(e.target.value as any)}
                      >
                        <option value="Teacher Only">🔒 Teacher Only (Private Evaluation)</option>
                        <option value="Course">🎓 Course Enrolled Students</option>
                        <option value="Branch">🏛️ Branch Community</option>
                        <option value="School Community">🌐 Whole School Community</option>
                        <option value="Private">🔐 Private (Only Me)</option>
                      </select>
                    </div>
                  </div>

                  {!recordingSaved ? (
                    <Button
                      variant="primary"
                      size="md"
                      className="w-full flex items-center justify-center gap-2"
                      onClick={handleSaveRecordingToTeacher}
                    >
                      <Share2 size={16} />
                      <span>Submit Recording to Teacher Bruk</span>
                    </Button>
                  ) : (
                    <div className="p-3 bg-green-100 text-green-900 rounded-xl text-xs font-bold text-center flex items-center justify-center gap-2">
                      <Check size={16} />
                      <span>Submitted to Teacher Evaluation Queue!</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* SIDEBAR: RECORDING GUIDELINES */}
            <div className="space-y-6">
              <div className="bg-[#FAF6EF] border border-[#E7DED1] p-6 rounded-3xl space-y-4">
                <h3 className="font-display font-black text-xs uppercase text-[#2B2B2B]">Recording Best Practices</h3>
                <ul className="text-xs text-gray-600 space-y-2.5 list-disc pl-4">
                  <li>Position camera/mic 2-3 feet away to avoid clipping.</li>
                  <li>In video mode, capture hand fingers clearly.</li>
                  <li>Ensure instrument is tuned before recording.</li>
                  <li>Keep recordings under 5 minutes for quick teacher review.</li>
                </ul>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 3: LOOP AUDIO PLAYER */}
        {activeTab === 'audio-player' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
            <div className="bg-white border border-[#E7DED1] p-6 sm:p-8 rounded-3xl space-y-6 shadow-xs">
              <div>
                <span className="text-xs font-bold text-[#E89B52] uppercase tracking-widest block">Interactive Audio Looper</span>
                <h2 className="font-display font-black text-2xl text-[#2B2B2B] uppercase">
                  Slow-Motion & A-B Section Practice Loop
                </h2>
                <p className="text-xs text-gray-500">
                  Select difficult musical passages, slow down playback speed without changing pitch, and loop continuously until mastered.
                </p>
              </div>

              {/* DEMO TRACK SELECTOR */}
              <div className="flex flex-wrap gap-2">
                {[
                  'Begena Slow Tuning & Strum',
                  'Krar Qenet Scale Loop',
                  'Masenqo Traditional Bowing',
                  'Washint Breathing Rhythm',
                  'Vocal Liturgical Warmup'
                ].map((track) => (
                  <button
                    key={track}
                    onClick={() => setSelectedDemoAudio(track)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border cursor-pointer ${
                      selectedDemoAudio === track
                        ? 'bg-[#E89B52] text-white border-[#E89B52]'
                        : 'bg-[#FAF6EF] text-gray-700 border-[#E7DED1] hover:bg-amber-100'
                    }`}
                  >
                    🎵 {track}
                  </button>
                ))}
              </div>

              {/* AUDIO PLAYER CONSOLE */}
              <div className="bg-[#2B2B2B] text-white p-6 sm:p-8 rounded-2xl space-y-6 shadow-xl border border-amber-900/40 relative overflow-hidden">
                <TiletPattern className="opacity-10 text-amber-500 scale-150" />

                <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block">Currently Loaded Track</span>
                    <h3 className="font-display font-black text-lg text-white">{selectedDemoAudio}</h3>
                  </div>

                  {/* SPEED CONTROLS */}
                  <div className="flex items-center gap-1.5 bg-white/10 p-1.5 rounded-xl border border-white/10">
                    <span className="text-[10px] font-bold text-gray-300 uppercase px-2">Speed:</span>
                    {[0.5, 0.75, 0.85, 1.0].map((spd) => (
                      <button
                        key={spd}
                        onClick={() => handleSpeedChange(spd)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                          playbackSpeed === spd ? 'bg-[#E89B52] text-white' : 'text-gray-300 hover:text-white'
                        }`}
                      >
                        {spd === 1.0 ? 'Original (1.0x)' : `${spd * 100}% (${spd}x)`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* WAVEFORM / TIMELINE SIMULATION */}
                <div className="relative z-10 bg-black/40 p-4 rounded-xl border border-white/10 space-y-3">
                  <div className="h-12 w-full bg-amber-950/40 rounded-lg border border-amber-500/20 relative flex items-center px-4 overflow-hidden">
                    {/* Simulated Waveform Bars */}
                    <div className="flex items-center justify-between w-full h-8 opacity-60">
                      {Array.from({ length: 48 }).map((_, idx) => (
                        <div
                          key={idx}
                          className="w-1 bg-amber-400 rounded-full"
                          style={{ height: `${Math.sin(idx) * 40 + 50}%` }}
                        />
                      ))}
                    </div>

                    {/* A-B LOOP SELECTION HIGHLIGHT */}
                    {isLooping && (
                      <div
                        className="absolute top-0 bottom-0 bg-[#E89B52]/30 border-x-2 border-[#E89B52] flex items-center justify-between px-2"
                        style={{ left: `${loopStartSec}%`, right: `${100 - loopEndSec}%` }}
                      >
                        <span className="text-[9px] font-bold text-amber-300 bg-black/60 px-1 rounded">A: {loopStartSec}s</span>
                        <span className="text-[9px] font-bold text-amber-300 bg-black/60 px-1 rounded">B: {loopEndSec}s</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs font-mono text-gray-300">
                    <span>00:15 / 03:30</span>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setIsLooping(!isLooping)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                          isLooping ? 'bg-[#E89B52] text-white' : 'bg-white/10 text-gray-300'
                        }`}
                      >
                        <Repeat size={14} />
                        <span>A-B Loop {isLooping ? 'ON' : 'OFF'}</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* PLAY / PAUSE ACTION */}
                <div className="relative z-10 flex justify-center pt-2">
                  <button
                    onClick={toggleAudioPlay}
                    className="w-14 h-14 rounded-full bg-[#E89B52] hover:bg-amber-600 text-white flex items-center justify-center shadow-lg transition transform hover:scale-105 cursor-pointer"
                  >
                    {isPlayingAudio ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
                  </button>
                </div>

                {/* Hidden html5 audio for playback */}
                <audio
                  ref={audioPlayerRef}
                  src="https://actions.google.com/sounds/v1/ambiences/outdoor_rain.ogg"
                  loop={isLooping}
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 4: INSTRUMENT DRILLS & GUIDES */}
        {activeTab === 'guides' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
            <div className="bg-white border border-[#E7DED1] p-6 sm:p-8 rounded-3xl space-y-6 shadow-xs">
              <div>
                <span className="text-xs font-bold text-[#E89B52] uppercase tracking-widest block">Instrument Technique Drills</span>
                <h2 className="font-display font-black text-2xl text-[#2B2B2B] uppercase">
                  {effectiveInstrument} Guided Practice Routines
                </h2>
              </div>

              {/* INSTRUMENT SPECIFIC GUIDES */}
              {effectiveInstrument === 'Begena' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 bg-[#FAF6EF] border border-[#E7DED1] rounded-2xl space-y-3">
                    <h3 className="font-bold text-sm text-[#2B2B2B] uppercase">1. Ten Strings Tuning Verification</h3>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      Verify Qenet interval ratios. Adjust buzzing leather pieces (Kerbe) until each string produces warm harmonic buzzing.
                    </p>
                    <span className="inline-block text-[10px] font-bold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-md">10 Mins Warmup</span>
                  </div>
                  <div className="p-6 bg-[#FAF6EF] border border-[#E7DED1] rounded-2xl space-y-3">
                    <h3 className="font-bold text-sm text-[#2B2B2B] uppercase">2. Left Thumb & Index Plucking Drill</h3>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      Practice alternating thumb-index plucking on strings 1 through 5. Maintain steady wrist height.
                    </p>
                    <span className="inline-block text-[10px] font-bold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-md">20 Mins Drill</span>
                  </div>
                </div>
              )}

              {effectiveInstrument === 'Vocal' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 bg-[#FAF6EF] border border-[#E7DED1] rounded-2xl space-y-3">
                    <h3 className="font-bold text-sm text-[#2B2B2B] uppercase">1. Diaphragmatic Breath Cycles</h3>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      Inhale 4 seconds, hold 4 seconds, exhale 8 seconds with sustained "Sss" sound for vocal control.
                    </p>
                    <span className="inline-block text-[10px] font-bold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-md">5 Mins Breathwork</span>
                  </div>
                  <div className="p-6 bg-[#FAF6EF] border border-[#E7DED1] rounded-2xl space-y-3">
                    <h3 className="font-bold text-sm text-[#2B2B2B] uppercase">2. Traditional Ge'ez Mode Scale Pitching</h3>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      Sing ascending pentatonic scale notes cleanly. Focus on smooth vocal resonance and pitch stability.
                    </p>
                    <span className="inline-block text-[10px] font-bold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-md">15 Mins Pitching</span>
                  </div>
                </div>
              )}

              {(effectiveInstrument === 'Krar' || effectiveInstrument === 'Masenqo' || effectiveInstrument === 'Washint' || effectiveInstrument === 'Kebero') && (
                <div className="p-6 bg-[#FAF6EF] border border-[#E7DED1] rounded-2xl space-y-3">
                  <h3 className="font-bold text-sm text-[#2B2B2B] uppercase">{effectiveInstrument} Foundations</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Practice finger dexterity, rhythm tempo maintaining, and traditional melodic ornamentations.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* TAB 5: PRACTICE LOGS & HISTORY */}
        {activeTab === 'history' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
            <div className="bg-white border border-[#E7DED1] p-6 sm:p-8 rounded-3xl space-y-6 shadow-xs">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <span className="text-xs font-bold text-[#E89B52] uppercase tracking-widest block">Academic Practice Records</span>
                  <h2 className="font-display font-black text-2xl text-[#2B2B2B] uppercase">Practice Log & Teacher Feedback</h2>
                </div>

                {/* FILTER BY INSTRUMENT */}
                <div className="flex items-center gap-2">
                  <Filter size={14} className="text-gray-400" />
                  <select
                    className="p-2 bg-[#FAF6EF] border border-[#E7DED1] rounded-xl text-xs font-bold"
                    value={filterInstrument}
                    onChange={(e) => setFilterInstrument(e.target.value)}
                  >
                    <option value="All">All Instruments</option>
                    <option value="Begena">Begena</option>
                    <option value="Krar">Krar</option>
                    <option value="Masenqo">Masenqo</option>
                    <option value="Washint">Washint</option>
                    <option value="Vocal">Vocal</option>
                    <option value="Kebero">Kebero</option>
                  </select>
                </div>
              </div>

              {/* SESSIONS LIST */}
              <div className="space-y-4">
                {filteredSessions.length === 0 ? (
                  <div className="p-12 text-center text-gray-400 space-y-2">
                    <Clock size={36} className="mx-auto" />
                    <p className="text-xs font-bold">No practice logs recorded for this filter yet.</p>
                  </div>
                ) : (
                  filteredSessions.map((session) => (
                    <div key={session.id} className="p-5 bg-[#FAF6EF]/70 border border-[#E7DED1] rounded-2xl space-y-3">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-md bg-[#E89B52] text-white text-[10px] font-bold uppercase">
                              {session.instrument}
                            </span>
                            <span className="text-xs font-bold text-[#2B2B2B]">{session.lessonTitle || session.practiceGoal}</span>
                          </div>
                          <p className="text-[11px] text-gray-500">{session.createdAt} • {session.durationMinutes} Minutes</p>
                        </div>

                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          session.feedbackStatus === 'Reviewed'
                            ? 'bg-green-100 text-green-900'
                            : 'bg-amber-100 text-amber-900'
                        }`}>
                          {session.feedbackStatus === 'Reviewed' ? '✓ Teacher Reviewed' : '⏳ Evaluation Pending'}
                        </span>
                      </div>

                      {session.notes && (
                        <p className="text-xs text-gray-600 bg-white p-3 rounded-xl border border-[#E7DED1]">
                          <b>Student Note:</b> {session.notes}
                        </p>
                      )}

                      {/* TEACHER EVALUATION FEEDBACK */}
                      {session.teacherFeedback && (
                        <div className="p-4 bg-green-50 border border-green-200 rounded-xl space-y-3">
                          <div className="flex justify-between items-center text-xs font-bold text-green-900">
                            <span>Teacher Feedback ({session.teacherFeedback.date})</span>
                            <span className="bg-green-600 text-white px-2 py-0.5 rounded text-[11px]">
                              Score: {session.teacherFeedback.score}/100
                            </span>
                          </div>
                          <p className="text-xs text-green-800 leading-relaxed italic">
                            "{session.teacherFeedback.comment}"
                          </p>

                          {/* RUBRIC SCORE BREAKDOWN */}
                          {session.teacherFeedback.rubricScores && (
                            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center pt-1 border-t border-green-200">
                              {Object.entries(session.teacherFeedback.rubricScores).map(([rubricKey, score]) => (
                                <div key={rubricKey} className="p-1.5 bg-white rounded-lg border border-green-200">
                                  <span className="text-[9px] font-bold text-gray-500 uppercase block capitalize">{rubricKey}</span>
                                  <span className="text-xs font-black text-green-900">{score}%</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

