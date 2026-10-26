import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  BookOpen,
  Music,
  Award,
  Clock,
  Flame,
  CheckCircle,
  Calendar,
  ChevronRight,
  ChevronLeft,
  Lock,
  Unlock,
  FileText,
  Video,
  User,
  Share2,
  Sliders,
  MessageSquare,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  UserCheck,
  CheckCircle2,
  Download,
  Send,
  Plus,
  Trash2,
  Search,
  Layers,
  GraduationCap,
  VolumeX,
  X,
  Camera,
  FileVideo,
  Eye,
  Settings,
  Upload,
  BookCheck,
  RotateCw,
  Square,
  Mic
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth, isStudentAccessGranted } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Language, StudentEnrollment } from '../types';
import { isStudentEnrolledInInstrument } from '../utils/studentEnrollment';
import { TiletPattern } from './TiletPattern';
import { Button, Input } from './InteractiveComponents';
import { RegistrationAndPaymentGate } from './RegistrationAndPaymentGate';
import { exportElementToPDF } from '../utils/pdfExport';
import { InstrumentTuner } from './InstrumentTuner';
import { syncStudentProgressToEnrollment, toggleLessonComplete, isChapterUnlocked as checkIsChapterUnlocked, isChapterCompleted as checkIsChapterCompleted, getChapterStatus, calculateStudentProgress, getStudentCompletedLessonIds } from '../utils/courseLearningSync';
import { verifyCertificateCodeForStudent } from '../utils/certificateVerification';

const GLOBAL_NOTATION_TO_STRING_INDEX: Record<number, number> = {
  1: 4, // Number 1 -> String 5 (C)
  2: 0, // Number 2 -> String 1 (D)
  3: 1, // Number 3 -> String 2 (E)
  4: 2, // Number 4 -> String 3 (G)
  5: 3, // Number 5 -> String 4 (A)
  6: 5  // Number 6 -> String 6 (C in octave)
};

// ==========================================
// TYPES FOR KRAR LEARNING PORTAL
// ==========================================
export interface KrarModule {
  id: string;
  levelId: string; // 'basic-1' | 'basic-2' | 'basic-3'
  title: string;
  description: string;
  order: number;
  isPublished: boolean;
  isLocked: boolean;
}

export interface KrarLesson {
  id: string;
  moduleId: string;
  title: string;
  durationText: string;
  videoUrl: string;
  audioUrl?: string;
  pdfUrl?: string;
  explanation: string;
  notationSequence?: string;
  isPublished: boolean;
  isCompleted?: boolean;
  order: number;
}

export interface KrarExercise {
  id: string;
  title: string;
  description: string;
  instructions: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedTime: string;
  notation: string;
  practiceTarget: string;
  hasTeacherVerification: boolean;
  teacherNotes?: string;
  status: 'Not Started' | 'In Progress' | 'Completed' | 'Needs Improvement';
  isApprovedByTeacher?: boolean;
}

export interface KrarMezmur {
  id: string;
  title: string;
  amharicTitle: string;
  englishTitle?: string;
  description: string;
  category: string; // 'ትዝታ ቅኝት' | 'ባቲ ቅኝት' | 'አምባሰል ቅኝት' | 'አንቺሆዬ ቅኝት' | 'ሰላምታ ቅኝት'
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  level: string;
  teacher: string;
  audioUrl: string;
  videoUrl: string;
  notation: string;
  lyrics: string;
  learningInstructions: string;
  status: 'Not Started' | 'Practicing' | 'Completed' | 'Approved';
  artist?: string;
}

export interface KrarAssignment {
  id: string;
  lessonId: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'Pending' | 'Submitted' | 'Graded' | 'Approved' | 'Needs Revision';
  submissionVideoUrl?: string;
  submissionDate?: string;
  score?: number;
  teacherFeedback?: string;
  studentNotes?: string;
}

export interface KrarPracticeLog {
  id: string;
  date: string;
  durationMinutes: number;
  notes: string;
  exerciseTitle: string;
  teacherFeedback?: string;
  reflectionDifficulty?: string;
  reflectionImprovement?: string;
}

interface KrarLearningPortalProps {
  lang: Language;
  onNavigate: (page: string, params?: any) => void;
  enrollment?: StudentEnrollment;
}

// ==========================================
// DEFAULT DATA FOR KRAR LEARNING PORTAL
// ==========================================
const DEFAULT_KRAR_MODULES: KrarModule[] = [
  {
    id: 'mod_1',
    levelId: 'basic-1',
    title: 'ምዕራፍ አንድ : የክራር መግቢያና ታሪክ (Introduction & History)',
    description: 'የክራር አመጣጥ፣ የባህላዊና ኤሌክትሪክ ክራር ልዩነቶች እና የትምህርቱ ስርዐተ መንገድ።',
    order: 1,
    isPublished: true,
    isLocked: false
  },
  {
    id: 'mod_2',
    levelId: 'basic-1',
    title: 'ምዕራፍ ሁለት : የክራር ክፍሎችና አያያዝ (Anatomy & Plectrum Holding)',
    description: 'የክራር አወቃቀር (ብርክ፣ ገበታ፣ አውታሮች) እና የመቃነያ/ጥፍር አያያዝ ቴክኒኮች።',
    order: 2,
    isPublished: true,
    isLocked: false
  },
  {
    id: 'mod_3',
    levelId: 'basic-1',
    title: 'ምዕራፍ ሦስት : የክራር ቅኝቶችና ድርደራ (Tuning Systems & Scales)',
    description: '5ቱ የኢትዮጵያ ቅኝቶች (ትዝታ፣ ባቲ፣ አምባሰል፣ አንቺሆዬ፣ ሰላምታ) አኮርድና ቅኝት።',
    order: 3,
    isPublished: true,
    isLocked: false
  },
  {
    id: 'mod_4',
    levelId: 'basic-1',
    title: 'ምዕራፍ አራት : የትዝታ ቅኝት መዝሙራት (Tizita Scale Songs)',
    description: 'በትዝታ ቅኝት የተደረደሩ የመክፈቻ መዝሙራትና የጣት ቅልጥፍና ልምምዶች።',
    order: 4,
    isPublished: true,
    isLocked: false
  },
  {
    id: 'mod_5',
    levelId: 'basic-1',
    title: 'ምዕራፍ አምስት : የባቲ ቅኝት መዝሙራት (Bati Scale Songs)',
    description: 'በባቲ ቅኝት የተቀናበሩ የክራር ድርደራዎችና የተመረጡ መንፈሳዊ መዝሙራት።',
    order: 5,
    isPublished: true,
    isLocked: false
  },
  {
    id: 'mod_6',
    levelId: 'basic-1',
    title: 'ምዕራፍ ስድስት : የአምባሰልና የአንቺሆዬ ቅኝቶች (Ambassel & Anchihoye)',
    description: 'የአምባሰልና የአንቺሆዬ ቅኝት ድርደራ ምስጢራትና የመዝሙር ልምምድ።',
    order: 6,
    isPublished: true,
    isLocked: false
  },
  {
    id: 'mod_7',
    levelId: 'basic-1',
    title: 'ምዕራፍ ሰባት : የሰላምታ ቅኝትና የላቀ ድርደራ (Selamta & Advanced Solo)',
    description: 'የሰላምታ ቅኝት እና ሙሉ የክራር ሶሎና የታምቡር/የቀለበት ድርደራ ዘዴዎች።',
    order: 7,
    isPublished: true,
    isLocked: false
  }
];

const DEFAULT_KRAR_LESSONS: KrarLesson[] = [
  {
    id: 'les_k1_1',
    moduleId: 'mod_1',
    title: 'ትምህርት 1.1 : የክራር አመጣጥና ታሪካዊ አመሰራረት',
    durationText: '12 ደቂቃ',
    videoUrl: 'https://www.youtube.com/embed/2GpKxNl_KW0',
    explanation: 'ክራር በጥንታዊቷ ኢትዮጵያ ውስጥ ከዘመነ ብሉይ ጀምሮ በማኅበራዊና መንፈሳዊ ሥነ-ስርዓቶች ላይ በሰፊው ይፈለግ የነበረ ድንቅ የኪነ-ጥበብና የሙዚቃ መሣሪያ ነው።',
    notationSequence: '1 2 3 4 5 6 - 6 5 4 3 2 1',
    isPublished: true,
    isCompleted: true,
    order: 1
  },
  {
    id: 'les_k1_2',
    moduleId: 'mod_1',
    title: 'ትምህርት 1.2 : ባህላዊና ኤሌክትሪክ ክራር ልዩነቶች',
    durationText: '15 ደቂቃ',
    videoUrl: 'https://www.youtube.com/embed/2GpKxNl_KW0',
    explanation: 'ባህላዊ ክራር ከእንጨት፣ ከቆዳና ከጅማት/ከቀጭን ሽቦ የሚሠራ ሲሆን ኤሌክትሪክ ክራር ደግሞ የድምፅ ማጉያ (Pickups & Amp) በመጠቀም ዘመናዊ ድምፅን ያመነጫል።',
    notationSequence: '1 3 5 2 4 6 - 6 4 2 5 3 1',
    isPublished: true,
    isCompleted: false,
    order: 2
  },
  {
    id: 'les_k2_1',
    moduleId: 'mod_2',
    title: 'ትምህርት 2.1 : የክራር አካላትና የቁሳቁስ ዝርዝር',
    durationText: '18 ደቂቃ',
    videoUrl: 'https://www.youtube.com/embed/2GpKxNl_KW0',
    explanation: 'የክራር ዋና ዋና አካላት፦ 1. ብርክ (Pillars & Crossbar) 2. ገበታ/ቆዳ (Soundbox) 3. አውታሮች/ክሮች (Strings) 4. ድምፅ ቀዳዳ (Soundhole) 5. መቆንጠጫ/መቃነያ (Plectrum)',
    notationSequence: '1 2 3 - 4 5 6 - 1 5 3',
    isPublished: true,
    isCompleted: false,
    order: 3
  },
  {
    id: 'les_k2_2',
    moduleId: 'mod_2',
    title: 'ትምህርት 2.2 : የክራር ትክክለኛ አያያዝና የመቃነያ/ጥፍር አጠቃቀም',
    durationText: '20 ደቂቃ',
    videoUrl: 'https://www.youtube.com/embed/2GpKxNl_KW0',
    explanation: 'ክራርን በእቅፍ ወይም በጭን ላይ በመደገፍ የግራ እጅ ጣቶች አውታሮችን በማቃለል/በመያዝ (muting)፣ በቀኝ እጅ ደግሞ በመቃነያ (Plectrum) ወይም በጣቶች አጥንት በመምታት ይደረደራል።',
    notationSequence: '1 - 2 - 3 - 4 - 5 - 6',
    isPublished: true,
    isCompleted: false,
    order: 4
  },
  {
    id: 'les_k3_1',
    moduleId: 'mod_3',
    title: 'ትምህርት 3.1 : የትዝታ ቅኝት አኮርድና የክሮች አስተካከል።',
    durationText: '22 ደቂቃ',
    videoUrl: 'https://www.youtube.com/embed/2GpKxNl_KW0',
    explanation: 'በትዝታ ቅኝት ጊዜ ክራር 6ቱ አውታሮቹ በሚከተለው ድምፅ ይመደባሉ፦ 1ኛ=E, 2ኛ=G, 3ኛ=A, 4ኛ=B, 5ኛ=D, 6ኛ=E።',
    notationSequence: '1 2 3 4 5 6 - 5 4 3 2 1',
    isPublished: true,
    isCompleted: false,
    order: 5
  },
  {
    id: 'les_k4_1',
    moduleId: 'mod_4',
    title: 'ትምህርት 4.1 : የትዝታ ቅኝት የመክፈቻ መዝሙር - አቤቱ ደግ ሰው አልቋል',
    durationText: '25 ደቂቃ',
    videoUrl: 'https://www.youtube.com/embed/2GpKxNl_KW0',
    explanation: 'በትዝታ ቅኝት የተደረደረ የመክፈቻ መዝሙር። በጣቶች መረጣና በመቃነያ ምት የሚደረደር ድንቅ ዜማ።',
    notationSequence: '1 3 5 4 3 2 1 - 2 4 5 6 5 4 3',
    isPublished: true,
    isCompleted: false,
    order: 6
  },
  {
    id: 'les_k5_1',
    moduleId: 'mod_5',
    title: 'ትምህርት 5.1 : የባቲ ቅኝት ድርደራና መዝሙራት',
    durationText: '25 ደቂቃ',
    videoUrl: 'https://www.youtube.com/embed/2GpKxNl_KW0',
    explanation: 'በባቲ ቅኝት የተደረደሩ የክራር ድርደራዎችና የተመረጡ መንፈሳዊ መዝሙራት።',
    notationSequence: '1 2 4 5 6 1 - 6 5 4 2 1',
    isPublished: true,
    isCompleted: false,
    order: 7
  },
  {
    id: 'les_k6_1',
    moduleId: 'mod_6',
    title: 'ትምህርት 6.1 : የአምባሰልና የአንቺሆዬ ቅኝቶች ድርደራ',
    durationText: '28 ደቂቃ',
    videoUrl: 'https://www.youtube.com/embed/2GpKxNl_KW0',
    explanation: 'የአምባሰልና የአንቺሆዬ ቅኝት ድርደራ ምስጢራትና የመዝሙር ልምምድ።',
    notationSequence: '1 3 4 6 1 3 - 3 1 6 4 3 1',
    isPublished: true,
    isCompleted: false,
    order: 8
  },
  {
    id: 'les_k7_1',
    moduleId: 'mod_7',
    title: 'ትምህርት 7.1 : የሰላምታ ቅኝትና የላቀ የክራር ሶሎ',
    durationText: '30 ደቂቃ',
    videoUrl: 'https://www.youtube.com/embed/2GpKxNl_KW0',
    explanation: 'የሰላምታ ቅኝት እና ሙሉ የክራር ሶሎና የታምቡር/የቀለበት ድርደራ ዘዴዎች።',
    notationSequence: '1 2 3 4 5 6 1 - 1 6 5 4 3 2 1',
    isPublished: true,
    isCompleted: false,
    order: 9
  }
];

const MASTER_KRAR_MEZMURS: KrarMezmur[] = [
  // --- ትዝታ ቅኝት (TIZITA SCALE) ---
  {
    id: 'krar_m_tiz1',
    title: 'ማርያም ፊደል',
    amharicTitle: 'ማርያም ፊደል',
    englishTitle: 'Maryam Fidel',
    description: 'በትዝታ ቅኝት የተደረደረ የክራር ተማሪዎች መክፈቻ መዝሙር',
    category: 'ትዝታ ቅኝት',
    difficulty: 'Beginner',
    level: 'Basic 1',
    teacher: 'ዘማሪ / Bruk Krar',
    artist: 'Bruk Krar',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    videoUrl: 'https://www.youtube.com/embed/2GpKxNl_KW0',
    notation: '2 3 4 4 5  1 3 3 2 2 2  5 1 2 3 3 2 2 1 1 1',
    lyrics: `ማርያም ፊደል የሁለም መማሪያ (2)
በንጽህና (2) ተጽፋለችና (2)
ማርያም ፊደል የሁለም መማሪያ (2)
በንጽህና (2) ተጽፋለችና (2)`,
    learningInstructions: 'የትዝታ ቅኝት አውታሮች፦ 1 2 3 4 5 6 (ጥምር፣ ምስራች፣ ማርያም፣ ድምፅ፣ ውጤት፣ ባቲ)',
    status: 'Practicing'
  },
  {
    id: 'krar_m_tiz2',
    title: 'ሰላም ለኢትዮጵያ',
    amharicTitle: 'ሰላም ለኢትዮጵያ',
    englishTitle: 'Selam LeEthiopia',
    description: 'በትዝታ ቅኝት የተቀናበረ የሀገርና የሰላም መዝሙር',
    category: 'ትዝታ ቅኝት',
    difficulty: 'Beginner',
    level: 'Basic 1',
    teacher: 'ዘማሪ / Bruk Krar',
    artist: 'Bruk Krar',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    videoUrl: 'https://www.youtube.com/embed/2GpKxNl_KW0',
    notation: '4 5 1 1  1 2 5 5 4 4  5 4 3 2 4 5 4 4 4',
    lyrics: `ሰላም ለኢትዮጵያ ሰላም ለሀገራችን
ይላክልን (2) ቸሩ አምላካችን
ሰላም ለኢትዮጵያ ሰላም ለሀገራችን
ይላክልን (2) ቸሩ አምላካችን`,
    learningInstructions: 'በ 4ኛ አውታር (ድምፅ) ይጀምራል፡ 4 5 1 1 1 2 5 5 4 4',
    status: 'Practicing'
  },
  {
    id: 'krar_m_tiz3',
    title: 'እግዚአብሔር ይመስገን',
    amharicTitle: 'እግዚአብሔር ይመስገን',
    englishTitle: 'Egziabhier Yimesgen',
    description: 'በትዝታ ቅኝት የተደረደረ የምስጋና መዝሙር',
    category: 'ትዝታ ቅኝት',
    difficulty: 'Beginner',
    level: 'Basic 1',
    teacher: 'ዘማሪ / Bruk Krar',
    artist: 'Bruk Krar',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    videoUrl: 'https://www.youtube.com/embed/2GpKxNl_KW0',
    notation: '2 3 4 4 5  1 3 3 2 2 2  5 1 2 3 3 2 2 1 1 1',
    lyrics: `እግዚአብሔር ይመስገን (2)
ለዚህ ያደረሰን (2) እግዚአብሔር ይመስገን`,
    learningInstructions: 'የትዝታ ቅኝት መሰረታዊ ድርደራ',
    status: 'Completed'
  },
  {
    id: 'krar_m_tiz4',
    title: 'የፍቅር እናት',
    amharicTitle: 'የፍቅር እናት',
    englishTitle: 'Yefikir Enat',
    description: 'በትዝታ ቅኝት የተቀናበረ የእመቤታችን መዝሙር',
    category: 'ትዝታ ቅኝት',
    difficulty: 'Intermediate',
    level: 'Basic 1',
    teacher: 'ዘማሪ / Bruk Krar',
    artist: 'Bruk Krar',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    videoUrl: 'https://www.youtube.com/embed/2GpKxNl_KW0',
    notation: '2 3 4 4 5  1 3 3 2 2 2  5 1 2 3 3 2 2 1 1 1',
    lyrics: `የፍቅር እናት የሰላም /2/
ይናፍቀኛል ስምሽ ሳልጠራው ስቀር
ማርያም
በህይወቴ ውስጥ በኑሮዬ
ቅደሚ ከፊት ከኋላዬ
ተደላደለ ልቤ
አንቺ አለሽና ካጠገቤ
ምኞቴም ይስመር ትልቅ ህልሜ
ልለፍ ወጀቡን ተቋቁሜ
የጌታዬ እናት ነሽ
ኃይልን ያደርጋል ጸሎትሽ`,
    learningInstructions: 'በትዝታ ቅኝት ቀስ ብለው ጣቶችዎን ይለማመዱ',
    status: 'Practicing'
  },
  {
    id: 'krar_m_tiz5',
    title: 'እንደቸርነትህ',
    amharicTitle: 'እንደቸርነትህ',
    englishTitle: 'Ende Cherenetih',
    description: 'በትዝታ ቅኝት የተደረደረ የንስሐ መዝሙር',
    category: 'ትዝታ ቅኝት',
    difficulty: 'Intermediate',
    level: 'Basic 1',
    teacher: 'ዘማሪ / Bruk Krar',
    artist: 'Bruk Krar',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    videoUrl: 'https://www.youtube.com/embed/2GpKxNl_KW0',
    notation: '2 3 4 4 5  1 3 3 2 2 2  5 1 2 3 3 2 2 1 1 1',
    lyrics: `እንደቸርነትህ አቤቱ ማረን (2)
እንደ ምህረትህም ይቅርታን ስጠን (2)
ከኃጢአቴም አንጻር ከ ክፉ በደሌ (2)
ለዚያች ክፉ ኃጢአት እንዳልሆናት ሌላ (2)
እኔስ አበሳዬን በደሌን ሳውቀው (2)
ከቶ የሚያድነኝ ቸርነትህ ነው (2)`,
    learningInstructions: 'የትዝታ ቅኝት የጥፍር ምት ልምምድ',
    status: 'Practicing'
  },
  {
    id: 'krar_m_tiz6',
    title: 'እውነተኛው ሰላም',
    amharicTitle: 'እውነተኛው ሰላም',
    englishTitle: 'Ewnetegnew Selam',
    description: 'በትዝታ ቅኝት የተደረደረ መንፈሳዊ መዝሙር',
    category: 'ትዝታ ቅኝት',
    difficulty: 'Intermediate',
    level: 'Basic 1',
    teacher: 'ዘማሪ / Bruk Krar',
    artist: 'Bruk Krar',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    videoUrl: 'https://www.youtube.com/embed/2GpKxNl_KW0',
    notation: '2 3 4 4 5  1 3 3 2 2 2  5 1 2 3 3 2 2 1 1 1',
    lyrics: `እውነተኛው ሰላም ያለው ከቤትህ ነው(2)
እርዳኝ አልናወጽ እለምንሃለሁ (2)
ኃጢአቴን ሳስበው ልቤ ይጨነቃል
ካንተ መለየቴ ነፍሴን አድክሟታል
ወደ አንተ መልሰኝ እኔ እመለሳለሁ`,
    learningInstructions: 'በትዝታ ቅኝት የጣት መረጣ ልምምድ',
    status: 'Practicing'
  },
  {
    id: 'krar_m_tiz7',
    title: 'የልቤን ሁሉ',
    amharicTitle: 'የልቤን ሁሉ',
    englishTitle: 'Yeliben Hulu',
    description: 'በትዝታ ቅኝት የተደረደረ የጸሎትና የምልጃ መዝሙር',
    category: 'ትዝታ ቅኝት',
    difficulty: 'Intermediate',
    level: 'Basic 1',
    teacher: 'ዘማሪ / Bruk Krar',
    artist: 'Bruk Krar',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    videoUrl: 'https://www.youtube.com/embed/2GpKxNl_KW0',
    notation: '2 3 4 4 5  1 3 3 2 2 2  5 1 2 3 3 2 2 1 1 1',
    lyrics: `የልቤን ሁሉ ለማን ላማክር
የልቤን ሁሉ ለማን ላማክር
እመቤቴ ሆይ ከአንቺ በቀር
የደካማው ሰው መጠጊያ እኮነሽ
ሃን ጭንቀቴን የምረሳብሽ`,
    learningInstructions: 'በትዝታ ቅኝት የክራር ድርደራ',
    status: 'Practicing'
  },

  // --- ቸርነት / አንቺሆዬ ቅኝት (CHERENET / ANCHIHOYE SCALE) ---
  {
    id: 'krar_m_cher1',
    title: 'በቃና ዘገሊላ',
    amharicTitle: 'በቃና ዘገሊላ',
    englishTitle: 'BeQana ZeGelila',
    description: 'በቸርነት/አንቺሆዬ ቅኝት የተቀናበረ የጋብቻና የበዓል መዝሙር',
    category: 'ቸርነት ቅኝት',
    difficulty: 'Intermediate',
    level: 'Basic 2',
    teacher: 'ዘማሪ / Bruk Krar',
    artist: 'Bruk Krar',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    videoUrl: 'https://www.youtube.com/embed/2GpKxNl_KW0',
    notation: '1 2 3 4 5 6 - 5 4 3 2 1',
    lyrics: `በቃና ገሊላ 
በቃና ገሊላ (2) 
ገሊላ ከብካበ ኮነ (2)
እዩና እመኑ ሰዎች`,
    learningInstructions: 'የቸርነት/አንቺሆዬ ቅኝት አኮርድ',
    status: 'Practicing'
  },
  {
    id: 'krar_m_cher2',
    title: 'እዩና ዕመኑ ሰዎች',
    amharicTitle: 'እዩና ዕመኑ ሰዎች',
    englishTitle: 'Eyuna Emenu Sewoch',
    description: 'በቸርነት ቅኝት የተቀናበረ የትንሣኤ መዝሙር',
    category: 'ቸርነት ቅኝት',
    difficulty: 'Intermediate',
    level: 'Basic 2',
    teacher: 'ዘማሪ / Bruk Krar',
    artist: 'Bruk Krar',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    videoUrl: 'https://www.youtube.com/embed/2GpKxNl_KW0',
    notation: '2 3 5 4 3 2 1 - 5 4 3 2',
    lyrics: `እዩና ዕመኑ ሰዎች 
ድንጋዩ ሳይፈነቀል
ኢየሱስ በእኩለ ሌሊት
በኃይሉ ሞትን ድል ነስቷል/2/ 
ዕልልታ ለዚህ ይገባል 
ግርግርታ ለዚህ ይገባል
የሞት ኃይል ተዋርዷል ዛሬ 
ሲኦልም ተመሰቃቅሏል /2/`,
    learningInstructions: 'በቸርነት ቅኝት የደስታ ድርደራ',
    status: 'Practicing'
  },
  {
    id: 'krar_m_cher3',
    title: 'አማን በአማን',
    amharicTitle: 'አማን በአማን',
    englishTitle: 'Aman BeAman',
    description: 'በቸርነት ቅኝት የተቀናበረ የምስጋና መዝሙር',
    category: 'ቸርነት ቅኝት',
    difficulty: 'Intermediate',
    level: 'Basic 2',
    teacher: 'ዘማሪ / Bruk Krar',
    artist: 'Bruk Krar',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    videoUrl: 'https://www.youtube.com/embed/2GpKxNl_KW0',
    notation: '1 3 4 5 4 3 1 - 2 3 5',
    lyrics: `አማን በአማን (4)
አማኑኤል ተመስገን ለዚህ ፍቅርህ ምን
ልክፈልህ (2)
ድብቁን ኃጢአት አንተ ብትገልጸው
ይቅር ብለኸኝ ባትሸፋፍነው`,
    learningInstructions: 'የቸርነት ቅኝት ድርደራ',
    status: 'Practicing'
  },
  {
    id: 'krar_m_cher4',
    title: 'ሀይሌ ብርታቴ',
    amharicTitle: 'ሀይሌ ብርታቴ',
    englishTitle: 'Hayle Birtate',
    description: 'በቸርነት ቅኝት የተቀናበረ የሥላሴ መዝሙር',
    category: 'ቸርነት ቅኝት',
    difficulty: 'Intermediate',
    level: 'Basic 2',
    teacher: 'ዘማሪ / Bruk Krar',
    artist: 'Bruk Krar',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    videoUrl: 'https://www.youtube.com/embed/2GpKxNl_KW0',
    notation: '1 2 4 5 4 2 1 - 3 5 6',
    lyrics: `ሀይሌ ብርታቴ ክብሬ ሞገሴ/፪/
የዓለሙ የአብርሃሙ ሥላሴ/፪/
ተመረጠች ነፍሴ አንተን በማወደስ
ከላይ ከአርያም ከሥላሴ መቅደስ`,
    learningInstructions: 'በቸርነት ቅኝት የክራር ሶሎ',
    status: 'Practicing'
  },
  {
    id: 'krar_m_cher5',
    title: 'ስምህ በሁሉ',
    amharicTitle: 'ስምህ በሁሉ',
    englishTitle: 'Simih Behulu',
    description: 'በቸርነት ቅኝት የተደረደረ የምስጋና መዝሙር',
    category: 'ቸርነት ቅኝት',
    difficulty: 'Intermediate',
    level: 'Basic 2',
    teacher: 'ዘማሪ / Bruk Krar',
    artist: 'Bruk Krar',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    videoUrl: 'https://www.youtube.com/embed/2GpKxNl_KW0',
    notation: '2 4 5 6 5 4 2 1',
    lyrics: `ስምህ በሁሉ ተመሰገነ
ከክብር በላይ ክብርህ ገነነ
አንተን ማወደስ ደስ ይለናል
ስምህን ማክበር ክብራችን ሆኗል(፪)`,
    learningInstructions: 'በቸርነት ቅኝት የጣት መረጣ',
    status: 'Practicing'
  },
  {
    id: 'krar_m_cher6',
    title: 'በጎ መዓዛ',
    amharicTitle: 'በጎ መዓዛ',
    englishTitle: 'Bego Meaza',
    description: 'በቸርነት ቅኝት የተደረደረ የእመቤታችን መዝሙር',
    category: 'ቸርነት ቅኝት',
    difficulty: 'Intermediate',
    level: 'Basic 2',
    teacher: 'ዘማሪ / Bruk Krar',
    artist: 'Bruk Krar',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    videoUrl: 'https://www.youtube.com/embed/2GpKxNl_KW0',
    notation: '1 2 3 5 4 3 2 1',
    lyrics: `በጎ መዓዛ ሽቶዬ ነሽ
በሰው ሁሉ ፊት መርኩሌሽ
ባንቺ ጣፈጠ አልጫነቴ
እጠራሻለሁ ነይ እመቤቴ`,
    learningInstructions: 'በቸርነት ቅኝት የክራር ድርደራ',
    status: 'Practicing'
  },
  {
    id: 'krar_m_cher7',
    title: 'ለምትጠራኝ ላንተ',
    amharicTitle: 'ለምትጠራኝ ላንተ',
    englishTitle: 'Lemititerang Lante',
    description: 'በቸርነት ቅኝት የተቀናበረ የጸሎት መዝሙር',
    category: 'ቸርነት ቅኝት',
    difficulty: 'Intermediate',
    level: 'Basic 2',
    teacher: 'ዘማሪ / Bruk Krar',
    artist: 'Bruk Krar',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    videoUrl: 'https://www.youtube.com/embed/2GpKxNl_KW0',
    notation: '1 4 5 6 5 4 1',
    lyrics: `ለምትጠራኝ ላንተ እምቢ እንዳልል እኔ
ማስተዋል አድለኝ በህይወት መኔ
መክረህ አስተምረህ ፍቅር የገለጽክልኝ
የሰማሁትን ቃል ለህይወት አርግልኝ`,
    learningInstructions: 'በቸርነት ቅኝት የክራር ድርደራ',
    status: 'Practicing'
  },

  // --- ባቲ ቅኝት (BATI SCALE) ---
  {
    id: 'krar_m_bati1',
    title: 'በመኑ በአምሳለ',
    amharicTitle: 'በመኑ በአምሳለ',
    englishTitle: 'Bemenu BeAmsale',
    description: 'በባቲ ቅኝት የተቀናበረ የድንግል ማርያም ምስጋና መዝሙር',
    category: 'ባቲ ቅኝት',
    difficulty: 'Intermediate',
    level: 'Basic 2',
    teacher: 'ዘማሪ / Bruk Krar',
    artist: 'Bruk Krar',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    videoUrl: 'https://www.youtube.com/embed/2GpKxNl_KW0',
    notation: '1 2 4 5 6 5 4 2 1',
    lyrics: `በመኑ በአምሳለ መኑ ናስተማስለኪ
እመቤቴ የኝ አማላጅ አዙኝቱ ኦ ድንግል
ምልዕተ ዉዱሴ`,
    learningInstructions: 'የባቲ ቅኝት ኖታ፦ 1 (C), 2 (E), 3 (F), 4 (G), 5 (B), 6 (C in Octave)',
    status: 'Practicing'
  },
  {
    id: 'krar_m_bati2',
    title: 'የሥላሴን መንበር',
    amharicTitle: 'የሥላሴን መንበር',
    englishTitle: 'YeSilassen Menber',
    description: 'በባቲ ቅኝት የተደረደረ የሥላሴ መዝሙር',
    category: 'ባቲ ቅኝት',
    difficulty: 'Intermediate',
    level: 'Basic 2',
    teacher: 'ዘማሪ / Bruk Krar',
    artist: 'Bruk Krar',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    videoUrl: 'https://www.youtube.com/embed/2GpKxNl_KW0',
    notation: '2 3 5 6 5 3 2 1',
    lyrics: `የሥላሴን መንበር ቅዱሳን ከበውት
ኪሩቤል በደመና ዙፋኑን ይውት
ድንግልን ከመሐል ሚካኤልን ከፊት
አእላፍ መላእክት ሲሰግዱ በፍርሃት`,
    learningInstructions: 'በባቲ ቅኝት የክራር ድርደራ',
    status: 'Practicing'
  },
  {
    id: 'krar_m_bati3',
    title: 'ስምሽን ስጠራው',
    amharicTitle: 'ስምሽን ስጠራው',
    englishTitle: 'Simishin Sitraw',
    description: 'በባቲ ቅኝት የተቀናበረ የጣፈጠ የድንግል መዝሙር',
    category: 'ባቲ ቅኝት',
    difficulty: 'Intermediate',
    level: 'Basic 2',
    teacher: 'ዘማሪ / Bruk Krar',
    artist: 'Bruk Krar',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    videoUrl: 'https://www.youtube.com/embed/2GpKxNl_KW0',
    notation: '1 2 4 5 6 5 4',
    lyrics: `ስምሽን ስጠራው ድንግል
ስምሽን ስጠራው ማርያም
ለአንደበቴ ማር ነው ለልቤ ሰላም
ስምሽን ስጠራው ማርያም`,
    learningInstructions: 'በባቲ ቅኝት የክራር ድርደራ',
    status: 'Practicing'
  },
  {
    id: 'krar_m_bati4',
    title: 'ገብርኤል በሰማይ',
    amharicTitle: 'ገብርኤል በሰማይ',
    englishTitle: 'Gabriel Besemay',
    description: 'በባቲ ቅኝት የተደረደረ የቅዱስ ገብርኤል መዝሙር',
    category: 'ባቲ ቅኝት',
    difficulty: 'Intermediate',
    level: 'Basic 2',
    teacher: 'ዘማሪ / Bruk Krar',
    artist: 'Bruk Krar',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    videoUrl: 'https://www.youtube.com/embed/2GpKxNl_KW0',
    notation: '1 3 5 6 5 3 1',
    lyrics: `ገብርኤል በሰማይ ኤልሳብ በምድር 
ገብርኤል በሰማይ ኤልሳብ በምድር
ይመሰክራሉ ድንግል ያንቺን ክብር`,
    learningInstructions: 'በባቲ ቅኝት የክራር ድርደራ',
    status: 'Practicing'
  },
  {
    id: 'krar_m_bati5',
    title: 'አለ ለኔ',
    amharicTitle: 'አለ ለኔ',
    englishTitle: 'Ale Lene',
    description: 'በባቲ ቅኝት የተቀናበረ የተስፋ መዝሙር',
    category: 'ባቲ ቅኝት',
    difficulty: 'Intermediate',
    level: 'Basic 2',
    teacher: 'ዘማሪ / Bruk Krar',
    artist: 'Bruk Krar',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    videoUrl: 'https://www.youtube.com/embed/2GpKxNl_KW0',
    notation: '1 2 4 5 6 5 4 2 1',
    lyrics: `አለ ለኔ የተሻለ ነገር(፪) 
ዛሬን ባዝን ለጊዜው ብቸገር
አለ ለኔ የተሻለ ነገር`,
    learningInstructions: 'በባቲ ቅኝት የክራር ድርደራ',
    status: 'Practicing'
  },
  {
    id: 'krar_m_bati6',
    title: 'ምስጋና በመቅደስህ',
    amharicTitle: 'ምስጋና በመቅደስህ',
    englishTitle: 'Misgana Bemeqdesih',
    description: 'በባቲ ቅኝት የተደረደረ የኪሩቤል ምስጋና',
    category: 'ባቲ ቅኝት',
    difficulty: 'Intermediate',
    level: 'Basic 2',
    teacher: 'ዘማሪ / Bruk Krar',
    artist: 'Bruk Krar',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    videoUrl: 'https://www.youtube.com/embed/2GpKxNl_KW0',
    notation: '2 3 5 6 5 3 2 1',
    lyrics: `ምስጋና በመቅደስህ ዜማሬ በማደሪያህ
ልሰዋ ጠዋት ማታ ክብሬነህ የኔ ጌታ`,
    learningInstructions: 'በባቲ ቅኝት የክራር ድርደራ',
    status: 'Practicing'
  },
  {
    id: 'krar_m_bati7',
    title: 'እውነት ስለሆነ',
    amharicTitle: 'እውነት ስለሆነ',
    englishTitle: 'Ewnet Silahone',
    description: 'በባቲ ቅኝት የተቀናበረ የጌታችን መዝሙር',
    category: 'ባቲ ቅኝት',
    difficulty: 'Intermediate',
    level: 'Basic 2',
    teacher: 'ዘማሪ / Bruk Krar',
    artist: 'Bruk Krar',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    videoUrl: 'https://www.youtube.com/embed/2GpKxNl_KW0',
    notation: '1 2 4 5 6 5 4 1',
    lyrics: `እውነት ስለሆነ ኢየሱስ ክርስቶስ
ዋለ በአደባባይ ሲሰደብ ሲከሰስ
የሃሰት ዳኝነት አምላክን ወቀሰው`,
    learningInstructions: 'በባቲ ቅኝት የክራር ድርደራ',
    status: 'Practicing'
  },

  // --- አምባሰል ቅኝት (AMBASSEL SCALE) ---
  {
    id: 'krar_m_amb1',
    title: 'እንተ በምድር',
    amharicTitle: 'እንተ በምድር',
    englishTitle: 'Ente Bemidir',
    description: 'በአምባሰል ቅኝት የተቀናበረ የሰማያውያን ምስጋና',
    category: 'አምባሰል ቅኝት',
    difficulty: 'Advanced',
    level: 'Basic 3',
    teacher: 'ዘማሪ / Bruk Krar',
    artist: 'Bruk Krar',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    videoUrl: 'https://www.youtube.com/embed/2GpKxNl_KW0',
    notation: '1 4 5 6 5 4 1',
    lyrics: `እንተ በምድር ሰራዊሀ መላእክት ያከብሩኪ...`,
    learningInstructions: 'የአምባሰል ቅኝት አውታሮች፦ 1 (C), 2 (C#), 3 (F), 4 (G), 5 (G#), 6 (C in Octave)',
    status: 'Not Started'
  },
  {
    id: 'krar_m_amb2',
    title: 'የእሴይ ሥር',
    amharicTitle: 'የእሴይ ሥር',
    englishTitle: 'Ye Yesey Sir',
    description: 'በአምባሰል ቅኝት የተቀናበረ የበዓል መዝሙር',
    category: 'አምባሰል ቅኝት',
    difficulty: 'Advanced',
    level: 'Basic 3',
    teacher: 'ዘማሪ / Bruk Krar',
    artist: 'Bruk Krar',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    videoUrl: 'https://www.youtube.com/embed/2GpKxNl_KW0',
    notation: '1 4 5 6 5 4 1 - 3 5 6 5 3',
    lyrics: `የእሴይ ሥር የወጣችው አበባ
ድንግል ማርያም ናት የዓለም መዳኛ`,
    learningInstructions: 'በአምባሰል ቅኝት የክራር ድርደራ',
    status: 'Not Started'
  },
  {
    id: 'krar_m_amb3',
    title: 'አንቺን የያዘ ሰው',
    amharicTitle: 'አንቺን የያዘ ሰው',
    englishTitle: 'Anchin Yeyaze Sew',
    description: 'በአምባሰል ቅኝት የተቀናበረ የበረከት መዝሙር',
    category: 'አምባሰል ቅኝት',
    difficulty: 'Advanced',
    level: 'Basic 3',
    teacher: 'ዘማሪ / Bruk Krar',
    artist: 'Bruk Krar',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    videoUrl: 'https://www.youtube.com/embed/2GpKxNl_KW0',
    notation: '1 3 4 5 6 5 4 3 1',
    lyrics: `አንቺን የያዘ ሰው ምን ይጎድልበታል
በምልጃሽ በረከት ቤቱ ሞልቶለታል
ር መከር ባይኖረው ጎተራው ባይሞላ
ሁሉም ይሸፈናል በረድኤትሽ ጥላ /2/`,
    learningInstructions: 'በአምባሰል ቅኝት የክራር ድርደራ',
    status: 'Not Started'
  }
];

const DEFAULT_KRAR_EXERCISES: KrarExercise[] = [
  {
    id: 'kex_1',
    title: 'የመጀመሪያው የጥፍር/የመቃነያ ምት ልምምድ (Plucking Exercise 1)',
    description: 'በቀኝ እጅ መቃነያ አውታሮችን በቅደም ተከተል የማወዛወዝ ልምምድ።',
    instructions: '1. አውታር 1 እስከ 6 ድረስ በዝግታ ይምቱ። 2. በእያንዳንዱ ምት መካከል እኩል ጊዜ ይጠብቁ።',
    difficulty: 'Beginner',
    estimatedTime: '15 Min',
    notation: '1 - 2 - 3 - 4 - 5 - 6',
    practiceTarget: '15 minutes',
    hasTeacherVerification: true,
    status: 'In Progress'
  },
  {
    id: 'kex_2',
    title: 'የግራ እጅ አውታር መያዝ (String Muting Exercise)',
    description: 'የማይፈለጉ አውታሮችን በግራ እጅ ጣቶች የመሸፈንና ድምፅ እንዳያወጡ የማድረግ ዘዴ።',
    instructions: '1. በግራ እጅ ጣቶች አውታር 2 እና 4ን ይያዙ። 2. በቀኝ እጅ ሙሉ ምት ሲመቱ አውታር 1, 3, 5 ብቻ እንዲሰሙ ያድርጉ።',
    difficulty: 'Intermediate',
    estimatedTime: '20 Min',
    notation: '1 (x2) 3 (x4) 5 - (x2) 4',
    practiceTarget: '20 minutes',
    hasTeacherVerification: true,
    status: 'Not Started'
  }
];

const DEFAULT_KRAR_ASSIGNMENTS: KrarAssignment[] = [
  {
    id: 'kasg_1',
    lessonId: 'les_k2_2',
    title: 'የመጀመሪያው የክራር ድርደራ ቪዲዮ የተቀረፀ ምዘና (Video Submission 1)',
    description: 'በትዝታ ቅኝት 1 2 3 4 5 6 የሚለውን ቅደም ተከተል በቪዲዮ ቀርፀው ይላኩ።',
    dueDate: '2026-08-05',
    status: 'Submitted',
    submissionVideoUrl: 'https://www.youtube.com/embed/2GpKxNl_KW0',
    submissionDate: '2026-07-28',
    score: 92,
    teacherFeedback: 'በጣም ጥሩ አያያዝ ነው! የጥፍሩ ምት ወጥ እንዲሆን ጥቂት ተጨማሪ ልምምድ ያድርጉ።'
  }
];

const CHAPTER_TABS = [
  { id: 'chapter-1', title: 'CHAPTER 1', count: 4, amharicTitle: 'ምዕራፍ 1: የክራር ስልጠና አጠቃላይ ማውጫ' },
  { id: 'chapter-2', title: 'CHAPTER 2', count: 3, amharicTitle: 'ምዕራፍ 2: ዜማ እና የክራር ቅኝቶች' },
  { id: 'chapter-3', title: 'CHAPTER 3', count: 2, amharicTitle: 'ምዕራፍ 3: ቅኝቶች እና ተግባራዊ ልምምዳቸው' },
  { id: 'chapter-4', title: 'CHAPTER 4', count: 7, amharicTitle: 'ምዕራፍ 4: የትዝታ ቅኝት መዝሙራት' },
  { id: 'chapter-5', title: 'CHAPTER 5', count: 7, amharicTitle: 'ምዕራፍ 5: የቸርነት/አንቺሆዬ ቅኝት መዝሙራት' },
  { id: 'chapter-6', title: 'CHAPTER 6', count: 7, amharicTitle: 'ምዕራፍ 6: የባቲ ቅኝት መዝሙራት' },
  { id: 'chapter-7', title: 'CHAPTER 7', count: 7, amharicTitle: 'ምዕራፍ 7: የአምባሰል ቅኝት መዝሙራት' },
  { id: 'certificate-progress', title: 'CERTIFICATE', count: null, amharicTitle: 'ምዕራፍ 8: የምስክር ወረቀት ሂደት' }
];

export interface MezmurNotationPlayerProps {
  title: string;
  notationSequence: number[];
  playKrarStringTone: (stringIdx: number, scale?: string) => void;
  playBegenaStringTone?: (stringIdx: number, scale?: string) => void;
  scaleKey?: string;
  hideInstrumentLabel?: boolean;
  instrumentLabel?: string;
}

export const NOTATION_TO_BEGENA_STRING_INDEX: Record<number, number> = {
  1: 0, // Number 1 -> String 1 (idx 0)
  2: 3, // Number 2 -> String 4 (idx 3)
  3: 5, // Number 3 -> String 6 (idx 5)
  4: 7, // Number 4 -> String 8 (idx 7)
  5: 9, // Number 5 -> String 10 (idx 9)
  6: 9  // Number 6 -> String 10 (idx 9)
};

export const BEGENA_SCALE_FREQUENCIES: Record<string, number[]> = {
  // Indices 0..9 correspond to Strings 1..10
  // Str 1 (#1): Tone 1, Str 4 (#2): Tone 2, Str 6 (#3): Tone 3, Str 8 (#4): Tone 4, Str 10 (#5): Tone 5
  tizita:    [82.41, 0, 0, 65.41, 0, 73.42, 0, 110.00, 0, 98.00],   // 1->E, 2->C, 3->D, 4->A, 5->G
  cherenet:  [87.31, 0, 0, 65.41, 0, 69.30, 0, 110.00, 0, 92.50],   // 1->F, 2->C, 3->C#, 4->A, 5->F#
  anchihoye: [87.31, 0, 0, 65.41, 0, 69.30, 0, 110.00, 0, 92.50],
  selamta:   [87.31, 0, 0, 65.41, 0, 73.42, 0, 110.00, 0, 98.00],   // 1->F, 2->C, 3->D, 4->A, 5->G
  bati:      [87.31, 0, 0, 65.41, 0, 82.41, 0, 123.47, 0, 98.00],   // 1->F, 2->C, 3->E, 4->B, 5->G
  ambassel:  [87.31, 0, 0, 65.41, 0, 69.30, 0, 103.83, 0, 98.00]   // 1->F, 2->C, 3->C#, 4->G#, 5->G
};

export interface BegenaStringItem {
  stringNo: number; // 1 to 10
  assignedNum: number | null; // 1, 2, 3, 4, 5, or null if unplayed
  name: string; // 'ጥምር', 'ማረፊያ', 'ምስራች', 'ማርያም', 'ድምፅ', 'ውጤት'
  noteName: string;
  isPlayed: boolean; // true for 1, 4, 6, 8, 10
  idx: number; // 0 to 9
}

export const getBegenaScaleStringsConfig = (scaleKey: string): BegenaStringItem[] => {
  const normKey = scaleKey ? scaleKey.toLowerCase() : 'tizita';
  switch (normKey) {
    case 'cherenet':
    case 'anchihoye':
      // 2->C, 3->C#, 1->F, 5->F#, 4->A
      return [
        { stringNo: 1, assignedNum: 1, name: 'ጥምር', noteName: 'F', isPlayed: true, idx: 0 },
        { stringNo: 2, assignedNum: null, name: 'ማረፊያ', noteName: '—', isPlayed: false, idx: 1 },
        { stringNo: 3, assignedNum: null, name: 'ማረፊያ', noteName: '—', isPlayed: false, idx: 2 },
        { stringNo: 4, assignedNum: 2, name: 'ምስራች', noteName: 'C', isPlayed: true, idx: 3 },
        { stringNo: 5, assignedNum: null, name: 'ማረፊያ', noteName: '—', isPlayed: false, idx: 4 },
        { stringNo: 6, assignedNum: 3, name: 'ማርያም', noteName: 'C#', isPlayed: true, idx: 5 },
        { stringNo: 7, assignedNum: null, name: 'ማረፊያ', noteName: '—', isPlayed: false, idx: 6 },
        { stringNo: 8, assignedNum: 4, name: 'ድምፅ', noteName: 'A', isPlayed: true, idx: 7 },
        { stringNo: 9, assignedNum: null, name: 'ማረፊያ', noteName: '—', isPlayed: false, idx: 8 },
        { stringNo: 10, assignedNum: 5, name: 'ውጤት', noteName: 'F#', isPlayed: true, idx: 9 }
      ];
    case 'selamta':
      // 2->C, 3->D, 1->F, 5->G, 4->A
      return [
        { stringNo: 1, assignedNum: 1, name: 'ጥምር', noteName: 'F', isPlayed: true, idx: 0 },
        { stringNo: 2, assignedNum: null, name: 'ማረፊያ', noteName: '—', isPlayed: false, idx: 1 },
        { stringNo: 3, assignedNum: null, name: 'ማረፊያ', noteName: '—', isPlayed: false, idx: 2 },
        { stringNo: 4, assignedNum: 2, name: 'ምስራች', noteName: 'C', isPlayed: true, idx: 3 },
        { stringNo: 5, assignedNum: null, name: 'ማረፊያ', noteName: '—', isPlayed: false, idx: 4 },
        { stringNo: 6, assignedNum: 3, name: 'ማርያም', noteName: 'D', isPlayed: true, idx: 5 },
        { stringNo: 7, assignedNum: null, name: 'ማረፊያ', noteName: '—', isPlayed: false, idx: 6 },
        { stringNo: 8, assignedNum: 4, name: 'ድምፅ', noteName: 'A', isPlayed: true, idx: 7 },
        { stringNo: 9, assignedNum: null, name: 'ማረፊያ', noteName: '—', isPlayed: false, idx: 8 },
        { stringNo: 10, assignedNum: 5, name: 'ውጤት', noteName: 'G', isPlayed: true, idx: 9 }
      ];
    case 'bati':
      // 2->C, 3->E, 1->F, 5->G, 4->B
      return [
        { stringNo: 1, assignedNum: 1, name: 'ጥምር', noteName: 'F', isPlayed: true, idx: 0 },
        { stringNo: 2, assignedNum: null, name: 'ማረፊያ', noteName: '—', isPlayed: false, idx: 1 },
        { stringNo: 3, assignedNum: null, name: 'ማረፊያ', noteName: '—', isPlayed: false, idx: 2 },
        { stringNo: 4, assignedNum: 2, name: 'ምስራች', noteName: 'C', isPlayed: true, idx: 3 },
        { stringNo: 5, assignedNum: null, name: 'ማረፊያ', noteName: '—', isPlayed: false, idx: 4 },
        { stringNo: 6, assignedNum: 3, name: 'ማርያም', noteName: 'E', isPlayed: true, idx: 5 },
        { stringNo: 7, assignedNum: null, name: 'ማረፊያ', noteName: '—', isPlayed: false, idx: 6 },
        { stringNo: 8, assignedNum: 4, name: 'ድምፅ', noteName: 'B', isPlayed: true, idx: 7 },
        { stringNo: 9, assignedNum: null, name: 'ማረፊያ', noteName: '—', isPlayed: false, idx: 8 },
        { stringNo: 10, assignedNum: 5, name: 'ውጤት', noteName: 'G', isPlayed: true, idx: 9 }
      ];
    case 'ambassel':
      // 2->C, 3->C#, 1->F, 5->G, 4->G#
      return [
        { stringNo: 1, assignedNum: 1, name: 'ጥምር', noteName: 'F', isPlayed: true, idx: 0 },
        { stringNo: 2, assignedNum: null, name: 'ማረፊያ', noteName: '—', isPlayed: false, idx: 1 },
        { stringNo: 3, assignedNum: null, name: 'ማረፊያ', noteName: '—', isPlayed: false, idx: 2 },
        { stringNo: 4, assignedNum: 2, name: 'ምስራች', noteName: 'C', isPlayed: true, idx: 3 },
        { stringNo: 5, assignedNum: null, name: 'ማረፊያ', noteName: '—', isPlayed: false, idx: 4 },
        { stringNo: 6, assignedNum: 3, name: 'ማርያም', noteName: 'C#', isPlayed: true, idx: 5 },
        { stringNo: 7, assignedNum: null, name: 'ማረፊያ', noteName: '—', isPlayed: false, idx: 6 },
        { stringNo: 8, assignedNum: 4, name: 'ድምፅ', noteName: 'G#', isPlayed: true, idx: 7 },
        { stringNo: 9, assignedNum: null, name: 'ማረፊያ', noteName: '—', isPlayed: false, idx: 8 },
        { stringNo: 10, assignedNum: 5, name: 'ውጤት', noteName: 'G', isPlayed: true, idx: 9 }
      ];
    case 'tizita':
    default:
      // 2->C, 3->D, 1->E, 5->G, 4->A
      return [
        { stringNo: 1, assignedNum: 1, name: 'ጥምር', noteName: 'E', isPlayed: true, idx: 0 },
        { stringNo: 2, assignedNum: null, name: 'ማረፊያ', noteName: '—', isPlayed: false, idx: 1 },
        { stringNo: 3, assignedNum: null, name: 'ማረፊያ', noteName: '—', isPlayed: false, idx: 2 },
        { stringNo: 4, assignedNum: 2, name: 'ምስራች', noteName: 'C', isPlayed: true, idx: 3 },
        { stringNo: 5, assignedNum: null, name: 'ማረፊያ', noteName: '—', isPlayed: false, idx: 4 },
        { stringNo: 6, assignedNum: 3, name: 'ማርያም', noteName: 'D', isPlayed: true, idx: 5 },
        { stringNo: 7, assignedNum: null, name: 'ማረፊያ', noteName: '—', isPlayed: false, idx: 6 },
        { stringNo: 8, assignedNum: 4, name: 'ድምፅ', noteName: 'A', isPlayed: true, idx: 7 },
        { stringNo: 9, assignedNum: null, name: 'ማረፊያ', noteName: '—', isPlayed: false, idx: 8 },
        { stringNo: 10, assignedNum: 5, name: 'ውጤት', noteName: 'G', isPlayed: true, idx: 9 }
      ];
  }
};

export function MezmurNotationPlayer({
  title,
  notationSequence,
  playKrarStringTone,
  playBegenaStringTone,
  scaleKey = 'tizita',
  hideInstrumentLabel = false,
  instrumentLabel = 'Virtual Krar (6 Strings)'
}: MezmurNotationPlayerProps) {
  const [instrumentMode, setInstrumentMode] = useState<'krar'>('krar');
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [tempo, setTempo] = useState<number>(300); // ms per note
  const timeoutIdsRef = useRef<NodeJS.Timeout[]>([]);
  const internalAudioCtxRef = useRef<AudioContext | null>(null);

  const KRAR_NOTATION_TO_STRING_INDEX: Record<number, number> = {
    1: 4, // Number 1 -> String 5 (C)
    2: 0, // Number 2 -> String 1 (D)
    3: 1, // Number 3 -> String 2 (E)
    4: 2, // Number 4 -> String 3 (G)
    5: 3, // Number 5 -> String 4 (A)
    6: 5  // Number 6 -> String 6 (C in octave)
  };

  const [playDirection, setPlayDirection] = useState<'forward' | 'reverse' | 'begena_derdera' | null>(null);

  const stopPlayback = () => {
    timeoutIdsRef.current.forEach((id) => clearTimeout(id));
    timeoutIdsRef.current = [];
    setIsPlaying(false);
    setActiveIndex(null);
    setPlayDirection(null);
  };

  const triggerStringSound = (stringIdx: number) => {
    playKrarStringTone(stringIdx, scaleKey);
  };

  const startPlayback = (reverse: boolean = false) => {
    stopPlayback();
    setIsPlaying(true);
    setPlayDirection(reverse ? 'reverse' : 'forward');

    const sequence = reverse ? [...notationSequence].reverse() : notationSequence;

    sequence.forEach((num, idx) => {
      const stringIndex = KRAR_NOTATION_TO_STRING_INDEX[num] ?? num - 1;

      const actualIndex = reverse ? notationSequence.length - 1 - idx : idx;

      const timer = setTimeout(() => {
        setActiveIndex(actualIndex);
        triggerStringSound(stringIndex);
        if (idx === sequence.length - 1) {
          const endTimer = setTimeout(() => {
            setIsPlaying(false);
            setActiveIndex(null);
            setPlayDirection(null);
          }, tempo + 150);
          timeoutIdsRef.current.push(endTimer);
        }
      }, idx * tempo);
      timeoutIdsRef.current.push(timer);
    });
  };

  const startBegenaDerderaPattern = (reverse: boolean = false) => {
    stopPlayback();
    setIsPlaying(true);
    setPlayDirection('begena_derdera');

    // Canonical Begena pattern: 2 -> 3 -> 1 -> 5 -> 4 -> 2
    // Begena String indices: Str 4 (3), Str 6 (5), Str 1 (0), Str 10 (9), Str 8 (7), Str 4 (3)
    const forwardPattern = [3, 5, 0, 9, 7, 3];
    const pattern = reverse ? [3, 7, 9, 0, 5, 3] : forwardPattern;

    pattern.forEach((strIdx, idx) => {
      const timer = setTimeout(() => {
        triggerStringSound(strIdx);
        if (idx === pattern.length - 1) {
          const endTimer = setTimeout(() => {
            setIsPlaying(false);
            setPlayDirection(null);
          }, 500);
          timeoutIdsRef.current.push(endTimer);
        }
      }, idx * 480);
      timeoutIdsRef.current.push(timer);
    });
  };

  useEffect(() => {
    return () => stopPlayback();
  }, []);

  // Compute currently active string index during playback
  const activeNoteNum = activeIndex !== null ? notationSequence[activeIndex] : null;
  const activeStringIdx =
    activeNoteNum !== null
      ? KRAR_NOTATION_TO_STRING_INDEX[activeNoteNum] ?? activeNoteNum - 1
      : null;

  const KRAR_STRINGS_CONFIG = [
    { stringNo: 1, num: 2, name: 'ምስራች', pitch: 'D', strIdx: 0 },
    { stringNo: 2, num: 3, name: 'ማርያም', pitch: 'E', strIdx: 1 },
    { stringNo: 3, num: 4, name: 'ድምፅ', pitch: 'G', strIdx: 2 },
    { stringNo: 4, num: 5, name: 'ውጤት', pitch: 'A', strIdx: 3 },
    { stringNo: 5, num: 1, name: 'ጥምር', pitch: 'C', strIdx: 4 },
    { stringNo: 6, num: 6, name: 'ባቲ', pitch: 'C⁺', strIdx: 5 }
  ];

  const BEGENA_STRINGS_DISPLAY = getBegenaScaleStringsConfig(scaleKey);

  return (
    <div className="bg-[#1f150d] text-white p-4 sm:p-5 rounded-2xl border border-[#3e2717] space-y-4 shadow-inner">
      <div className="flex flex-wrap justify-between items-center gap-2 border-b border-[#3e2717] pb-3">
        {!hideInstrumentLabel && (
          <div className="flex items-center gap-2">
            <Volume2 size={16} className="text-amber-400" />
            <div className="flex items-center gap-1 bg-[#2b1c11] p-1 rounded-xl border border-[#3e2717]">
              <button
                onClick={() => {
                  stopPlayback();
                  setInstrumentMode('krar');
                }}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  instrumentMode === 'krar'
                    ? 'bg-amber-500 text-amber-950 font-black shadow-xs'
                    : 'text-amber-200/70 hover:text-amber-100'
                }`}
              >
                <span>{instrumentLabel}</span>
              </button>
            </div>
          </div>
        )}

        {/* CONTROLS */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 bg-[#2b1c11] px-2.5 py-1 rounded-lg border border-[#3e2717] text-[11px] text-amber-200/90 font-mono">
            <span>ፍጥነት:</span>
            <select
              value={tempo}
              onChange={(e) => setTempo(Number(e.target.value))}
              disabled={isPlaying}
              className="bg-transparent text-amber-300 font-bold outline-none cursor-pointer"
            >
              <option value={450} className="bg-[#1f150d]">ዝግተኛ (Slow)</option>
              <option value={300} className="bg-[#1f150d]">መደበኛ (Normal)</option>
              <option value={180} className="bg-[#1f150d]">ፈጣን (Fast)</option>
            </select>
          </div>

          {isPlaying ? (
            <button
              onClick={stopPlayback}
              className="px-3.5 py-1.5 bg-red-700 hover:bg-red-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer transition shadow-xs"
            >
              <Square size={13} />
              <span>ቁም (Stop)</span>
            </button>
          ) : (
            <>
              <button
                onClick={() => startPlayback(false)}
                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm transition"
                title="Play notation sequence forward"
              >
                <Play size={13} />
                <span>አዳምጥ (Play)</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* STRINGS CANVAS - KRAR (6 STRINGS) */}
      <div className="relative bg-[#180e07] border border-[#3A2312] rounded-xl p-3 sm:p-4 overflow-hidden shadow-inner">
        <TiletPattern className="opacity-10 text-amber-600 scale-125 pointer-events-none" />
        <div className="text-center mb-2">
          <span className="text-[10px] text-amber-300/80 font-mono uppercase tracking-widest">
            {hideInstrumentLabel
              ? 'Notation Strings • String 1: 2 (D) • String 2: 3 (E) • String 3: 4 (G) • String 4: 5 (A) • String 5: 1 (C) • String 6: 6 (C⁺)'
              : 'VIRTUAL KRAR • String 1: 2 (D) • String 2: 3 (E) • String 3: 4 (G) • String 4: 5 (A) • String 5: 1 (C) • String 6: 6 (C⁺)'}
          </span>
        </div>

        <div className="relative z-10 flex justify-center items-end gap-2 sm:gap-5 h-48 sm:h-52 px-1">
            {KRAR_STRINGS_CONFIG.map((str) => {
              const isPlucked = activeStringIdx === str.strIdx;

              return (
                <button
                  key={str.stringNo}
                  onClick={() => {
                    stopPlayback();
                    playKrarStringTone(str.strIdx, scaleKey);
                  }}
                  className="group flex flex-col items-center cursor-pointer h-full justify-between transition-all"
                  title={`String ${str.stringNo}: Number ${str.num} -> Pitch ${str.pitch}`}
                >
                  <div className="flex flex-col items-center gap-0.5">
                    <span className={`text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full border transition-all ${
                      isPlucked
                        ? 'bg-amber-400 text-black border-amber-300 scale-110 ring-2 ring-amber-300 shadow-lg font-black'
                        : 'bg-amber-950/90 text-amber-300 border-amber-700/80 group-hover:bg-amber-700 group-hover:text-white'
                    }`}>
                      #{str.num} ({str.name})
                    </span>
                    <span className="text-[9px] font-mono font-bold text-amber-300 bg-black/60 px-1.5 py-0.2 rounded border border-amber-900/60">
                      {str.pitch}
                    </span>
                  </div>

                  <div
                    className={`w-1.5 bg-gradient-to-b from-amber-200 via-amber-400 to-amber-600 rounded-full transition-all duration-75 ${
                      isPlucked
                        ? 'scale-x-150 bg-amber-300 shadow-[0_0_15px_#f59e0b] animate-pulse'
                        : 'opacity-75 group-hover:opacity-100 group-hover:bg-amber-300'
                    }`}
                    style={{ height: '55%' }}
                  />

                  <span className={`text-[11px] font-mono font-bold transition-all ${
                    isPlucked ? 'text-amber-300 font-black scale-105' : 'text-amber-200/80 group-hover:text-white'
                  }`}>
                    Str {str.stringNo}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

      {/* NOTATION STRING NUMBERS SIMULATION BADGES */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center text-[10px] text-amber-300/80 font-mono">
          <span>ተግባራዊ የቁጥሮች ድርደራ (Click any number to pluck string note):</span>
          <span>{notationSequence.length} Notes</span>
        </div>

        <div className="flex flex-wrap gap-1.5 p-3 bg-[#130b05] rounded-xl border border-[#2b1c11] max-h-36 overflow-y-auto">
          {notationSequence.map((num, idx) => {
            const isNoteActive = activeIndex === idx;
            const strIdx = KRAR_NOTATION_TO_STRING_INDEX[num] ?? num - 1;

            return (
              <button
                key={idx}
                onClick={() => {
                  stopPlayback();
                  setActiveIndex(idx);
                  triggerStringSound(strIdx);
                  setTimeout(() => setActiveIndex(null), 350);
                }}
                className={`min-w-[28px] h-8 px-1 rounded-lg text-xs font-mono font-bold flex items-center justify-center transition cursor-pointer ${
                  isNoteActive
                    ? 'bg-amber-400 text-black scale-110 shadow-md ring-2 ring-amber-300 font-black'
                    : 'bg-[#2b1c11] text-amber-200 hover:bg-[#402919] hover:text-white border border-[#3e2717]'
                }`}
                title={`Note #${idx + 1}: String ${strIdx + 1} (Num ${num})`}
              >
                {num}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export const BegenaScaleSimulatorBoard: React.FC<{
  scaleKey: 'tizita' | 'anchihoye' | 'bati' | 'ambassel' | 'cherenet';
  title: string;
  subtitle?: string;
  playBegenaStringTone: (idx: number, scale?: string) => void;
  pluckedStringIndex: number | null;
  playBegenaSequence: (scale?: any, reverse?: boolean) => void;
  playBegenaDerdera?: (scale?: any, reverse?: boolean) => void;
  isPlayingSequence: boolean;
}> = ({
  scaleKey,
  title,
  subtitle,
  playBegenaStringTone,
  pluckedStringIndex,
  playBegenaSequence,
  playBegenaDerdera,
  isPlayingSequence
}) => {
  const stringsConfig = getBegenaScaleStringsConfig(scaleKey);
  const scaleNameFormatted =
    scaleKey === 'tizita'
      ? 'ትዝታ ቅኝት'
      : scaleKey === 'anchihoye' || scaleKey === 'cherenet'
      ? 'ቸርነት ቅኝት'
      : scaleKey === 'bati'
      ? 'ባቲ ቅኝት'
      : 'አምባሰል ቅኝት';

  const [activePlayMode, setActivePlayMode] = React.useState<'scale' | 'derdera' | 'reverse_derdera' | null>(null);

  const handleBegenaDerdera = () => {
    setActivePlayMode('derdera');
    if (playBegenaDerdera) {
      playBegenaDerdera(scaleKey, false);
    } else {
      playBegenaSequence(scaleKey, false);
    }
  };

  const handleBegenaReverseDerdera = () => {
    setActivePlayMode('reverse_derdera');
    if (playBegenaDerdera) {
      playBegenaDerdera(scaleKey, true);
    } else {
      playBegenaSequence(scaleKey, true);
    }
  };

  React.useEffect(() => {
    if (!isPlayingSequence) {
      setActivePlayMode(null);
    }
  }, [isPlayingSequence]);

  return (
    <div className="bg-[#1a0f08] p-5 sm:p-6 rounded-3xl border-4 border-[#4a2e1b] space-y-4 text-center shadow-2xl relative overflow-hidden">
      <TiletPattern className="absolute inset-0 opacity-15 pointer-events-none text-amber-600 scale-150" />

      {/* HEADER */}
      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-amber-900/60 pb-3">
        <div className="text-left space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 bg-amber-600/30 text-amber-300 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border border-amber-500/40">
              🎻 VIRTUAL BEGENA SIMULATOR (10 STRINGS)
            </span>
            <span className="px-2.5 py-0.5 bg-amber-950 text-amber-200 border border-amber-700/80 rounded-full text-[10px] font-bold">
              {scaleNameFormatted}
            </span>
            <span className="px-2.5 py-0.5 bg-amber-900/80 text-amber-100 rounded-full text-[10px] font-bold font-mono">
              ቅደም ተከተል: 2 → 3 → 1 → 5 → 4 → 2
            </span>
          </div>
          <h4 className="font-display font-black text-lg sm:text-xl text-amber-300 uppercase tracking-wide mt-1">
            {title}
          </h4>
          {subtitle && <p className="text-xs text-amber-200/70">{subtitle}</p>}
        </div>

        {/* CONTROLS BUTTONS */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={handleBegenaDerdera}
            disabled={isPlayingSequence}
            className={`px-3.5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-amber-950 font-black text-xs rounded-xl shadow-md flex items-center gap-1.5 transition cursor-pointer border border-amber-200/60 ${
              isPlayingSequence && activePlayMode === 'derdera'
                ? 'opacity-90 animate-pulse ring-2 ring-amber-300'
                : isPlayingSequence
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:scale-105 active:scale-95'
            }`}
            title="Play canonical Begena rhythmic pattern: 2 -> 3 -> 1 -> 5 -> 4 -> 2"
          >
            <Play size={14} className="fill-amber-950" />
            <span>
              {isPlayingSequence && activePlayMode === 'derdera'
                ? 'ድርደራ በመጫወት ላይ...'
                : '▶ የበገና ድርደራ (2 → 3 → 1 → 5 → 4 → 2)'}
            </span>
          </button>

          <button
            onClick={handleBegenaReverseDerdera}
            disabled={isPlayingSequence}
            className={`px-3.5 py-2 bg-gradient-to-r from-amber-800 to-amber-900 hover:from-amber-700 hover:to-amber-800 text-amber-100 font-black text-xs rounded-xl shadow-md flex items-center gap-1.5 transition cursor-pointer border border-amber-600/60 ${
              isPlayingSequence && activePlayMode === 'reverse_derdera'
                ? 'opacity-90 animate-pulse ring-2 ring-amber-300'
                : isPlayingSequence
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:scale-105 active:scale-95'
            }`}
            title="Play Begena rhythmic pattern in reverse: 2 -> 4 -> 5 -> 1 -> 3 -> 2"
          >
            <RotateCcw size={14} className="text-amber-200" />
            <span>
              {isPlayingSequence && activePlayMode === 'reverse_derdera'
                ? 'በተገላቢጦሽ በመጫወት ላይ...'
                : '◀ በተገላቢጦሽ ድርደራ (2 → 4 → 5 → 1 → 3 → 2)'}
            </span>
          </button>
        </div>
      </div>

      {/* BEGENA 10 STRINGS FRAME CANVAS */}
      <div className="relative z-10 bg-[#120a05] border-2 border-[#3d2414] rounded-2xl p-3 sm:p-4 overflow-hidden shadow-inner">
        <div className="flex justify-between items-center text-[10px] text-amber-400/80 font-mono mb-2 px-2 border-b border-[#2b180d] pb-1.5">
          <span>🪵 የበገና 10 አውታሮች እና የእንዝርት ድምፅ (Begena Gut Strings & Leather Buzz)</span>
          <span className="text-amber-300 font-bold">1, 4, 6, 8, 10 = ተጫዋች አውታሮች</span>
        </div>

        <div className="flex justify-between sm:justify-center items-end gap-1.5 sm:gap-3.5 h-60 sm:h-64 px-1 pt-2 overflow-x-auto">
          {stringsConfig.map((item) => {
            const isPlucked = pluckedStringIndex === item.idx;

            return (
              <button
                key={item.stringNo}
                onClick={() => playBegenaStringTone(item.idx, scaleKey)}
                className={`group flex flex-col items-center cursor-pointer h-full justify-between focus:outline-none min-w-[28px] sm:min-w-[42px] transition-all ${
                  !item.isPlayed ? 'opacity-40 hover:opacity-75' : 'opacity-100'
                }`}
                title={`String ${item.stringNo}: ${item.isPlayed ? `Assigned #${item.assignedNum} (${item.name}) - Note ${item.noteName}` : 'ማረፊያ (Not Played)'}`}
              >
                <div className="flex flex-col items-center gap-0.5">
                  <span
                    className={`text-[9px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 rounded-full transition-all duration-150 ${
                      isPlucked
                        ? 'bg-amber-300 text-amber-950 font-black scale-110 shadow-[0_0_14px_#f59e0b]'
                        : item.isPlayed
                        ? 'bg-amber-900/90 text-amber-300 border border-amber-600/80 group-hover:bg-amber-500 group-hover:text-amber-950'
                        : 'bg-stone-900 text-stone-500 border border-stone-800'
                    }`}
                  >
                    {item.isPlayed ? `#${item.assignedNum}` : 'x'}
                  </span>
                  <span className="text-[8px] sm:text-[9px] font-mono font-bold text-amber-300/90 bg-black/80 px-1 py-0.2 rounded border border-amber-950">
                    {item.noteName}
                  </span>
                </div>

                <div
                  className={`w-1 rounded-full transition-all duration-75 ${
                    isPlucked
                      ? 'scale-x-175 bg-amber-300 shadow-[0_0_16px_#f59e0b]'
                      : item.isPlayed
                      ? 'bg-amber-400/80 group-hover:bg-amber-300 group-hover:w-1.5'
                      : 'bg-amber-900/30 w-0.5'
                  }`}
                  style={{ height: '54%' }}
                />

                <div className="text-center">
                  <span className={`text-[9px] sm:text-[10px] font-mono font-bold block ${
                    isPlucked ? 'text-amber-300 font-black' : item.isPlayed ? 'text-amber-200/90 group-hover:text-white' : 'text-stone-600'
                  }`}>
                    Str {item.stringNo}
                  </span>
                  <span className="text-[7px] sm:text-[8px] text-amber-400/60 block leading-tight">
                    {item.isPlayed ? item.name : 'ማረፊያ'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <p className="relative z-10 text-[11px] text-amber-300/70 italic">
        💡 የበገና አውታሮች 1፣ 4፣ 6፣ 8 እና 10 ዋና ተጫዋች ሲሆኑ (1=#1፣ 4=#2፣ 6=#3፣ 8=#4፣ 10=#5) ፤ standard የበገና ድርደራ ቅደም ተከተል «2 → 3 → 1 → 5 → 4 → 2» ነው።
      </p>
    </div>
  );
};

export const getScaleStringsConfig = (scale: string) => {
  switch (scale) {
    case 'anchihoye':
    case 'cherenet':
      return [
        { stringNo: 1, assignedNum: 2, name: '2nd', noteName: 'C#', pitch: '277.18 Hz', idx: 0 },
        { stringNo: 2, assignedNum: 3, name: '3rd', noteName: 'F', pitch: '349.23 Hz', idx: 1 },
        { stringNo: 3, assignedNum: 4, name: '4th', noteName: 'F#', pitch: '369.99 Hz', idx: 2 },
        { stringNo: 4, assignedNum: 5, name: '5th', noteName: 'A', pitch: '440.00 Hz', idx: 3 },
        { stringNo: 5, assignedNum: 1, name: '1st', noteName: 'C', pitch: '261.63 Hz', idx: 4 },
        { stringNo: 6, assignedNum: 6, name: '6th', noteName: 'C Octave', pitch: '523.25 Hz', idx: 5 }
      ];
    case 'bati':
      return [
        { stringNo: 1, assignedNum: 2, name: '2nd', noteName: 'E', pitch: '329.63 Hz', idx: 0 },
        { stringNo: 2, assignedNum: 3, name: '3rd', noteName: 'F', pitch: '349.23 Hz', idx: 1 },
        { stringNo: 3, assignedNum: 4, name: '4th', noteName: 'G', pitch: '392.00 Hz', idx: 2 },
        { stringNo: 4, assignedNum: 5, name: '5th', noteName: 'B', pitch: '493.88 Hz', idx: 3 },
        { stringNo: 5, assignedNum: 1, name: '1st', noteName: 'C', pitch: '261.63 Hz', idx: 4 },
        { stringNo: 6, assignedNum: 6, name: '6th', noteName: 'C Octave', pitch: '523.25 Hz', idx: 5 }
      ];
    case 'ambassel':
      return [
        { stringNo: 1, assignedNum: 2, name: '2nd', noteName: 'C#', pitch: '277.18 Hz', idx: 0 },
        { stringNo: 2, assignedNum: 3, name: '3rd', noteName: 'F', pitch: '349.23 Hz', idx: 1 },
        { stringNo: 3, assignedNum: 4, name: '4th', noteName: 'G', pitch: '392.00 Hz', idx: 2 },
        { stringNo: 4, assignedNum: 5, name: '5th', noteName: 'G#', pitch: '415.30 Hz', idx: 3 },
        { stringNo: 5, assignedNum: 1, name: '1st', noteName: 'C', pitch: '261.63 Hz', idx: 4 },
        { stringNo: 6, assignedNum: 6, name: '6th', noteName: 'C Octave', pitch: '523.25 Hz', idx: 5 }
      ];
    case 'tizita':
    default:
      return [
        { stringNo: 1, assignedNum: 2, name: '2nd', noteName: 'D', pitch: '293.66 Hz', idx: 0 },
        { stringNo: 2, assignedNum: 3, name: '3rd', noteName: 'E', pitch: '329.63 Hz', idx: 1 },
        { stringNo: 3, assignedNum: 4, name: '4th', noteName: 'G', pitch: '392.00 Hz', idx: 2 },
        { stringNo: 4, assignedNum: 5, name: '5th', noteName: 'A', pitch: '440.00 Hz', idx: 3 },
        { stringNo: 5, assignedNum: 1, name: '1st', noteName: 'C', pitch: '261.63 Hz', idx: 4 },
        { stringNo: 6, assignedNum: 6, name: '6th', noteName: 'C Octave', pitch: '523.25 Hz', idx: 5 }
      ];
  }
};

export const KrarScaleSimulatorBoard: React.FC<{
  scaleKey: 'tizita' | 'anchihoye' | 'bati' | 'ambassel' | 'cherenet';
  title: string;
  subtitle?: string;
  playKrarStringTone: (idx: number, scale?: string) => void;
  pluckedStringIndex: number | null;
  playScaleSequence: (scale?: any, reverse?: boolean) => void;
  isPlayingSequence: boolean;
}> = ({
  scaleKey,
  title,
  subtitle,
  playKrarStringTone,
  pluckedStringIndex,
  playScaleSequence,
  isPlayingSequence
}) => {
  const [boardMode, setBoardMode] = React.useState<'simulator' | 'tuner'>('simulator');
  const stringsConfig = getScaleStringsConfig(scaleKey);
  const scaleNameFormatted =
    scaleKey === 'tizita'
      ? 'ትዝታ ቅኝት'
      : scaleKey === 'anchihoye' || scaleKey === 'cherenet'
      ? 'ቸርነት ቅኝት'
      : scaleKey === 'bati'
      ? 'ባቲ ቅኝት'
      : 'አምባሰል ቅኝት';

  const [activeDirection, setActiveDirection] = React.useState<'forward' | 'reverse' | null>(null);

  const handleForwardPlay = () => {
    setActiveDirection('forward');
    playScaleSequence(scaleKey, false);
  };

  const handleReversePlay = () => {
    setActiveDirection('reverse');
    playScaleSequence(scaleKey, true);
  };

  React.useEffect(() => {
    if (!isPlayingSequence) {
      setActiveDirection(null);
    }
  }, [isPlayingSequence]);

  return (
    <div className="bg-[#21150c] p-3 sm:p-4 rounded-2xl border-2 sm:border-3 border-[#3e2717] space-y-2.5 text-center shadow-lg relative overflow-hidden">
      <TiletPattern className="absolute inset-0 opacity-10 pointer-events-none" />

      {/* HEADER WITH SIMULATOR vs TUNER TOGGLE */}
      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-2 border-b border-amber-900/60 pb-2">
        <div className="text-left space-y-0.5">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider border border-amber-500/30">
              VIRTUAL KRAR STUDIO
            </span>
            <span className="px-2 py-0.5 bg-amber-900/90 text-amber-200 border border-amber-700/80 rounded-full text-[9px] font-bold">
              {scaleNameFormatted}
            </span>
            {/* VIEW MODE TOGGLE BUTTONS */}
            <div className="flex items-center gap-0.5 bg-black/40 p-0.5 rounded-lg border border-amber-900/60">
              <button
                onClick={() => setBoardMode('simulator')}
                className={`px-2 py-0.5 rounded-md text-[11px] font-bold transition flex items-center gap-1 cursor-pointer ${
                  boardMode === 'simulator'
                    ? 'bg-amber-500 text-amber-950 font-black shadow-xs'
                    : 'text-amber-200/70 hover:text-white'
                }`}
              >
                <Music size={12} />
                <span>Virtual Krar</span>
              </button>
              <button
                onClick={() => setBoardMode('tuner')}
                className={`px-2 py-0.5 rounded-md text-[11px] font-bold transition flex items-center gap-1 cursor-pointer ${
                  boardMode === 'tuner'
                    ? 'bg-amber-500 text-amber-950 font-black shadow-xs'
                    : 'text-amber-200/70 hover:text-white'
                }`}
              >
                <Mic size={12} />
                <span>Krar Tuner (ክራር ቱነር)</span>
              </button>
            </div>
          </div>
          <h4 className="font-display font-black text-sm sm:text-base text-amber-300 uppercase">
            {title}
          </h4>
          {subtitle && <p className="text-[10px] sm:text-[11px] text-amber-200/70">{subtitle}</p>}
        </div>

        {/* PLAY SCALE SEQUENCE BUTTONS (FORWARD & REVERSE) */}
        {boardMode === 'simulator' && (
          <div className="flex flex-wrap items-center gap-1.5 shrink-0">
            <button
              onClick={handleForwardPlay}
              disabled={isPlayingSequence}
              className={`px-2.5 py-1.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-amber-950 font-black text-[11px] rounded-lg shadow-sm flex items-center gap-1 transition cursor-pointer border border-amber-200/60 ${
                isPlayingSequence && activeDirection === 'forward'
                  ? 'opacity-90 animate-pulse ring-2 ring-amber-300'
                  : isPlayingSequence
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:scale-102 active:scale-98'
              }`}
              title="Play scale forward from assigned #1 to #6 (1 → 6)"
            >
              <Play size={13} className="fill-amber-950" />
              <span>
                {isPlayingSequence && activeDirection === 'forward'
                  ? 'በቀጥታ በመጫወት ላይ...'
                  : '▶ ቅኝቱን አጫውት (1 → 6)'}
              </span>
            </button>

            <button
              onClick={handleReversePlay}
              disabled={isPlayingSequence}
              className={`px-2.5 py-1.5 bg-gradient-to-r from-amber-700 to-amber-800 hover:from-amber-600 hover:to-amber-700 text-amber-100 font-black text-[11px] rounded-lg shadow-sm flex items-center gap-1 transition cursor-pointer border border-amber-600/60 ${
                isPlayingSequence && activeDirection === 'reverse'
                  ? 'opacity-90 animate-pulse ring-2 ring-amber-300'
                  : isPlayingSequence
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:scale-102 active:scale-98'
              }`}
              title="Play scale in reverse from assigned #6 to #1 (6 → 1)"
            >
              <RotateCcw size={12} className="text-amber-200" />
              <span>
                {isPlayingSequence && activeDirection === 'reverse'
                  ? 'በተገላቢጦሽ በመጫወት ላይ...'
                  : '◀ በተገላቢጦሽ አጫውት (6 → 1)'}
              </span>
            </button>
          </div>
        )}
      </div>

      {/* MODE 1: KRAR TUNER */}
      {boardMode === 'tuner' ? (
        <div className="relative z-10 text-left pt-1">
          <InstrumentTuner instrument="Krar" defaultScaleKey={scaleKey} />
        </div>
      ) : (
        /* MODE 2: STRINGS CANVAS SIMULATOR */
        <>
          <div className="relative z-10 flex justify-center items-end gap-2 sm:gap-4 h-36 sm:h-40 px-2 sm:px-4 pt-1.5">
            {stringsConfig.map((item) => {
              const isPlucked = pluckedStringIndex === item.idx;

              return (
                <button
                  key={item.stringNo}
                  onClick={() => playKrarStringTone(item.idx, scaleKey)}
                  className="group flex flex-col items-center cursor-pointer h-full justify-between focus:outline-none"
                >
                  <div className="flex flex-col items-center gap-0.5">
                    <span
                      className={`text-[9px] sm:text-[10px] font-bold px-1.5 py-0.2 rounded-full transition-all duration-150 ${
                        isPlucked
                          ? 'bg-amber-300 text-amber-950 font-black scale-105 shadow-[0_0_10px_#f59e0b]'
                          : 'bg-amber-950/90 text-amber-300 border border-amber-700/80 group-hover:bg-amber-500 group-hover:text-amber-950'
                      }`}
                    >
                      #{item.assignedNum} ({item.name})
                    </span>
                    <span className="text-[8px] sm:text-[9px] font-mono font-bold text-amber-400 bg-black/70 px-1 py-0.2 rounded border border-amber-900/80">
                      {item.noteName}
                    </span>
                  </div>

                  {/* WIRE ANIMATION */}
                  <div
                    className={`w-1 bg-amber-100/90 rounded-full transition-all duration-75 group-hover:bg-amber-300 group-hover:w-1.5 ${
                      isPlucked ? 'scale-x-150 bg-amber-300 shadow-[0_0_12px_#f59e0b]' : ''
                    }`}
                    style={{ height: '48%' }}
                  />

                  <div className="text-center">
                    <span className="text-[9px] sm:text-[10px] font-mono font-bold text-amber-200/90 group-hover:text-white block">
                      Str {item.stringNo}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          <p className="relative z-10 text-[10px] sm:text-[11px] text-amber-300/70 italic">
            💡 አውታሮቹን በመጫን ድምፃቸውን ይፈትሹ ወይም «▶ ቅኝቱን አጫውት (1 → 6)» እና «◀ በተገላቢጦሽ አጫውት (6 → 1)» የሚሉትን በመጫን የቅኝቱን ድምፅ በሁለቱም አቅጣጫዎች አዳምጡ።
          </p>
        </>
      )}
    </div>
  );
};

export function KrarLearningPortal({
  lang,
  onNavigate,
  enrollment
}: KrarLearningPortalProps) {
  const { currentUser, addNotification } = useAuth();
  const { teachers, enrollments } = useData();

  // Active student enrollment lookup
  const activeEnrollment = React.useMemo(() => {
    if (enrollment) return enrollment;
    if (!currentUser) return null;

    const matched = enrollments.find(
      (e) =>
        (e.studentId === currentUser.id ||
          e.studentEmail === currentUser.email ||
          e.studentName === currentUser.fullName) &&
        e.courseName.toLowerCase().includes('krar')
    );
    return matched || null;
  }, [enrollment, currentUser, enrollments]);

  if (!isStudentAccessGranted(currentUser)) {
    return (
      <RegistrationAndPaymentGate
        lang={lang}
        onNavigate={onNavigate}
        title="KRAR COURSE TUTORIALS & PRACTICE WORKSPACE LOCKED"
      />
    );
  }

  // Instrument Enrollment Check for Students (Kirar enrollment required)
  if (currentUser?.role === 'student' && !isStudentEnrolledInInstrument(currentUser, 'Krar', enrollments)) {
    return (
      <div className="bg-white border border-amber-200 p-8 sm:p-12 rounded-3xl text-center space-y-6 max-w-xl mx-auto my-8 shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto shadow-xs">
          <Lock size={32} />
        </div>
        <div className="space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#E89B52] bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            Kirar Course Enrollment Required
          </span>
          <h2 className="font-display font-black text-2xl text-[#2B2B2B]">
            KIRAR PRACTICE & LEARNING PORTAL LOCKED
          </h2>
          <p className="text-xs text-gray-600 leading-relaxed">
            You are currently enrolled in another course (e.g., Begena). Access to Kirar (Krar) practice tools, lessons, and 6-string scale simulators is granted exclusively to students enrolled in the Kirar course.
          </p>
        </div>
        <div className="pt-2 flex flex-col sm:flex-row justify-center gap-3">
          <Button
            variant="primary"
            onClick={() => onNavigate('courses')}
            className="bg-[#E89B52] text-white text-xs font-bold py-2.5 px-5 rounded-xl shadow-xs"
          >
            Enroll in Kirar Course
          </Button>
          <Button
            variant="secondary"
            onClick={() => onNavigate('student-dashboard')}
            className="bg-[#FAF6EF] text-[#2B2B2B] border border-[#E7DED1] text-xs font-bold py-2.5 px-5 rounded-xl"
          >
            Go to Student Dashboard
          </Button>
        </div>
      </div>
    );
  }

  // Profile switch state
  const [selectedProfile, setSelectedProfile] = useState<'krar-basic-1' | 'krar-basic-2' | 'krar-basic-3'>('krar-basic-1');

  // Simulator Toggle (Student mode vs. Teacher/Admin simulation mode)
  const [isSimulatorTeacherMode, setIsSimulatorTeacherMode] = useState(false);

  // Core Application State
  const [modules, setModules] = useState<KrarModule[]>(() => {
    const saved = localStorage.getItem('krar_modules_v1');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error(e);
      }
    }
    return DEFAULT_KRAR_MODULES;
  });

  const [lessons, setLessons] = useState<KrarLesson[]>(() => {
    const saved = localStorage.getItem('krar_lessons_v1');
    if (saved) {
      try {
        const parsed: KrarLesson[] = JSON.parse(saved);
        return parsed.map((l) => ({
          ...l,
          videoUrl: l.videoUrl || 'https://www.youtube.com/embed/2GpKxNl_KW0'
        }));
      } catch (e) {
        console.error(e);
      }
    }
    return DEFAULT_KRAR_LESSONS;
  });

  const [exercises, setExercises] = useState<KrarExercise[]>(() => {
    const saved = localStorage.getItem('krar_exercises_v1');
    return saved ? JSON.parse(saved) : DEFAULT_KRAR_EXERCISES;
  });

  const [mezmurs, setMezmurs] = useState<KrarMezmur[]>(() => {
    const saved = localStorage.getItem('krar_mezmurs_v2');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= MASTER_KRAR_MEZMURS.length) {
          return parsed;
        }
      } catch (e) {
        console.error(e);
      }
    }
    return MASTER_KRAR_MEZMURS;
  });

  const [mezmurSearchQuery, setMezmurSearchQuery] = useState('');
  const [mezmurScaleFilter, setMezmurScaleFilter] = useState('all');

  const [assignments, setAssignments] = useState<KrarAssignment[]>(() => {
    const saved = localStorage.getItem('krar_assignments_v1');
    return saved ? JSON.parse(saved) : DEFAULT_KRAR_ASSIGNMENTS;
  });

  const [practiceLogs, setPracticeLogs] = useState<KrarPracticeLog[]>(() => {
    const saved = localStorage.getItem(`krar_practice_logs_${currentUser?.id || 'guest'}`);
    const defaults = [
      { id: '1', date: '2026-07-25', durationMinutes: 30, exerciseTitle: 'Krar Strings Plucking', notes: 'Mastered 6 string order', teacherFeedback: 'Great rhythm!' },
      { id: '2', date: '2026-07-22', durationMinutes: 20, exerciseTitle: 'Tizita Scale Muting', notes: 'Left hand muting technique', teacherFeedback: 'Keep fingers relaxed' }
    ];
    return saved ? JSON.parse(saved) : defaults;
  });

  // Completed lessons state
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>(() => {
    const userId = currentUser?.id || 'guest';
    const synced = getStudentCompletedLessonIds(userId, 'krar');
    const saved = localStorage.getItem(`krar_completed_${userId}`);
    const local = saved ? JSON.parse(saved) : ['les_k1_1'];
    return Array.from(new Set([...synced, ...local]));
  });

  // Track state changes to localStorage
  useEffect(() => {
    localStorage.setItem('krar_modules_v1', JSON.stringify(modules));
  }, [modules]);

  useEffect(() => {
    localStorage.setItem('krar_lessons_v1', JSON.stringify(lessons));
  }, [lessons]);

  useEffect(() => {
    localStorage.setItem('krar_exercises_v1', JSON.stringify(exercises));
  }, [exercises]);

  useEffect(() => {
    localStorage.setItem('krar_mezmurs_v2', JSON.stringify(mezmurs));
  }, [mezmurs]);

  useEffect(() => {
    localStorage.setItem('krar_assignments_v1', JSON.stringify(assignments));
  }, [assignments]);

  useEffect(() => {
    if (currentUser?.id) {
      localStorage.setItem(`krar_practice_logs_${currentUser.id}`, JSON.stringify(practiceLogs));
    }
  }, [practiceLogs, currentUser?.id]);

  useEffect(() => {
    if (currentUser?.id) {
      localStorage.setItem(`krar_completed_${currentUser.id}`, JSON.stringify(completedLessonIds));
    }
  }, [completedLessonIds, currentUser?.id]);

  // Active Sub-Tab view
  const [activeSubTab, setActiveSubTab] = useState<string>('chapter-1');

  const ALL_CHAPTER_IDS = [
    'chapter-1',
    'chapter-2',
    'chapter-3',
    'chapter-4',
    'chapter-5',
    'chapter-6',
    'chapter-7',
    'certificate-progress'
  ];

  // Chapter completion tracking & persistent unlocking
  const [completedChapterIds, setCompletedChapterIds] = useState<string[]>(() => {
    const userId = currentUser?.id || 'guest';
    const saved = localStorage.getItem(`krar_completed_chapters_${userId}`);
    return saved ? JSON.parse(saved) : ['chapter-1'];
  });

  // Automatically include preceding chapters as unlocked/completed when student navigates
  useEffect(() => {
    if (activeSubTab.startsWith('chapter-')) {
      const num = parseInt(activeSubTab.replace('chapter-', ''), 10);
      if (!isNaN(num) && num > 1) {
        const preceding: string[] = [];
        for (let i = 1; i < num; i++) {
          preceding.push(`chapter-${i}`);
        }
        setCompletedChapterIds(prev => Array.from(new Set([...prev, ...preceding])));
      }
    }
  }, [activeSubTab]);

  useEffect(() => {
    const userId = currentUser?.id || 'guest';
    localStorage.setItem(`krar_completed_chapters_${userId}`, JSON.stringify(completedChapterIds));
  }, [completedChapterIds, currentUser?.id]);

  // Dynamic Course Progress Calculation reflecting actual user advancement
  const courseProgressPercent = useMemo(() => {
    const userId = currentUser?.id || 'guest';
    const calc = calculateStudentProgress(userId, 'krar', activeEnrollment?.level);

    const totalChapters = 7;
    const activeNum = activeSubTab.startsWith('chapter-') ? parseInt(activeSubTab.replace('chapter-', ''), 10) : 1;
    const completedSet = new Set<string>(completedChapterIds);
    if (!isNaN(activeNum)) {
      for (let i = 1; i < activeNum; i++) {
        completedSet.add(`chapter-${i}`);
      }
    }
    const completedChapCount = Array.from(completedSet).filter(id => id.startsWith('chapter-')).length;
    const chapProgressPct = Math.min(100, Math.round((completedChapCount / totalChapters) * 100));

    const syncedLessons = getStudentCompletedLessonIds(userId, 'krar');
    const allCompletedLessons = Array.from(new Set([...completedLessonIds, ...syncedLessons]));
    const lessonProgressPct = lessons.length > 0 ? Math.min(100, Math.round((allCompletedLessons.length / lessons.length) * 100)) : 0;

    return Math.min(100, Math.max(calc.progressPercent, chapProgressPct, lessonProgressPct));
  }, [currentUser?.id, activeEnrollment?.level, completedChapterIds, completedLessonIds, activeSubTab, lessons.length]);

  // Synchronize dynamic progress to student enrollment record across portals
  useEffect(() => {
    if (currentUser?.id) {
      syncStudentProgressToEnrollment(currentUser.id, 'krar', activeEnrollment?.id, courseProgressPercent);
    }
  }, [currentUser?.id, activeEnrollment?.id, courseProgressPercent]);

  const isChapterUnlocked = (tabId: string): boolean => {
    if (tabId === 'chapter-1') return true;
    const studentId = currentUser?.id || 'guest';
    return checkIsChapterUnlocked(studentId, tabId, 'krar') || completedChapterIds.includes(tabId);
  };

  const handleNextChapter = (currentId: string, nextId: string) => {
    const studentId = currentUser?.id || 'guest';
    const isCurrentDone = checkIsChapterCompleted(studentId, currentId, 'krar') || completedChapterIds.includes(currentId);
    if (!isCurrentDone) {
      if (addNotification) {
        addNotification('ምዕራፍ አልተጠናቀቀም!', 'እባክዎን የሚቀጥለውን ምዕራፍ ከመክፈትዎ በፊት የዚህን ምዕራፍ ትምህርቶች ያጠናቁ።', 'system');
      } else {
        alert('እባክዎን የሚቀጥለውን ምዕራፍ ከመክፈትዎ በፊት የዚህን ምዕራፍ ትምህርቶች ያጠናቁ! (Please complete required lessons in this chapter first.)');
      }
      return;
    }
    setCompletedChapterIds((prev) => Array.from(new Set([...prev, currentId, nextId])));
    setActiveSubTab(nextId);
    if (addNotification) {
      addNotification('ምዕራፍ ተከፍቷል!', 'የሚቀጥለው ምዕራፍ በተሳካ ሁኔታ ተከፍቶሎታል።', 'system');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderChapterNavFooter = (currentId: string) => {
    const currentIndex = ALL_CHAPTER_IDS.indexOf(currentId);
    const prevId = currentIndex > 0 ? ALL_CHAPTER_IDS[currentIndex - 1] : null;
    const nextId = currentIndex < ALL_CHAPTER_IDS.length - 1 ? ALL_CHAPTER_IDS[currentIndex + 1] : null;

    const prevTab = prevId ? CHAPTER_TABS.find((t) => t.id === prevId) : null;
    const nextTab = nextId ? CHAPTER_TABS.find((t) => t.id === nextId) : null;

    return (
      <div className="pt-6 border-t border-[#E7DED1] mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          {prevTab ? (
            <Button
              variant="tertiary"
              size="sm"
              onClick={() => setActiveSubTab(prevTab.id)}
              className="gap-2 bg-white border border-[#E7DED1] hover:bg-[#FAF6EF] text-[#2B2B2B] text-xs font-bold cursor-pointer"
            >
              <ChevronLeft size={16} />
              <span>← የቀደመ ምዕራፍ ({prevTab.title})</span>
            </Button>
          ) : (
            <div />
          )}
        </div>

        <div>
          {nextTab ? (
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleNextChapter(currentId, nextTab.id)}
              className="gap-2 bg-[#6F4E37] hover:bg-[#5a3e2b] text-white text-xs font-bold shadow-xs cursor-pointer"
            >
              <span>ቀጣይ ምዕራፍ ({nextTab.title}) →</span>
              <ChevronRight size={16} />
            </Button>
          ) : (
            <div />
          )}
        </div>
      </div>
    );
  };

  const [teacherCodeInput, setTeacherCodeInput] = useState<string>('');
  const [isCertificateUnlocked, setIsCertificateUnlocked] = useState<boolean>(false);
  const [teacherCodeError, setTeacherCodeError] = useState<string>('');

  // Selected Lesson
  const [selectedLessonId, setSelectedLessonId] = useState<string>('les_k1_1');
  const activeLesson = lessons.find((l) => l && l.id === selectedLessonId) || lessons[0] || null;

  // Selected Exercise
  const [selectedExerciseId, setSelectedExerciseId] = useState<string>('kex_1');
  const activeExercise = exercises.find((e) => e && e.id === selectedExerciseId) || exercises[0] || null;

  // Selected Mezmur
  const [selectedMezmurId, setSelectedMezmurId] = useState<string>('krar_m1');
  const activeMezmur = mezmurs.find((m) => m && m.id === selectedMezmurId) || mezmurs[0] || null;

  // Virtual Krar Simulator State
  const [selectedKrarScale, setSelectedKrarScale] = useState<'tizita' | 'bati' | 'ambassel' | 'anchihoye' | 'cherenet' | 'selamta'>('tizita');
  const [krarViewMode, setKrarViewMode] = useState<'simulator' | 'tuner'>('simulator');
  const [pluckedStringIndex, setPluckedStringIndex] = useState<number | null>(null);
  const [isPlayingSequence, setIsPlayingSequence] = useState<boolean>(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Krar String Tuning Frequencies for 6 Physical Strings (Str 1: 2nd, Str 2: 3rd, Str 3: 4th, Str 4: 5th, Str 5: 1st, Str 6: 6th)
  const KRAR_SCALE_FREQUENCIES: Record<string, number[]> = {
    tizita: [293.66, 329.63, 392.00, 440.00, 261.63, 523.25],    // Str 1: D4 (#2), Str 2: E4 (#3), Str 3: G4 (#4), Str 4: A4 (#5), Str 5: C4 (#1), Str 6: C5 (#6)
    anchihoye: [277.18, 349.23, 369.99, 440.00, 261.63, 523.25], // Str 1: C#4, Str 2: F4, Str 3: F#4, Str 4: A4, Str 5: C4, Str 6: C5
    cherenet: [277.18, 349.23, 369.99, 440.00, 261.63, 523.25],  // Alias for ቸርነት / anchihoye
    bati: [329.63, 349.23, 392.00, 493.88, 261.63, 523.25],      // Str 1: E4, Str 2: F4, Str 3: G4, Str 4: B4, Str 5: C4, Str 6: C5
    ambassel: [277.18, 349.23, 392.00, 415.30, 261.63, 523.25],  // Str 1: C#4, Str 2: F4, Str 3: G4, Str 4: G#4, Str 5: C4, Str 6: C5
    selamta: [293.66, 329.63, 392.00, 440.00, 261.63, 523.25]
  };

  const playKrarStringTone = (stringIdx: number, overrideScale?: string) => {
    setPluckedStringIndex(stringIdx);
    setTimeout(() => setPluckedStringIndex(null), 350);

    try {
      if (!audioContextRef.current) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        audioContextRef.current = new AudioCtx();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const activeScaleKey = overrideScale || selectedKrarScale || 'tizita';
      const freqs = KRAR_SCALE_FREQUENCIES[activeScaleKey] || KRAR_SCALE_FREQUENCIES.tizita;
      const freq = freqs[stringIdx] || 261.63;

      // Web Audio API Krar Pluck Synthesis
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle'; // Rich acoustic pluck timbre
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(0.8, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 1.25);
    } catch (e) {
      console.error('Audio synth error:', e);
    }
  };

  const playScaleSequence = async (
    scaleKey?: 'tizita' | 'anchihoye' | 'bati' | 'ambassel' | 'cherenet',
    reverse: boolean = false
  ) => {
    if (isPlayingSequence) return;
    setIsPlayingSequence(true);

    const targetScale = scaleKey || selectedKrarScale || 'tizita';
    const normalizedScale = targetScale === 'cherenet' ? 'anchihoye' : targetScale;

    if (scaleKey) {
      setSelectedKrarScale(normalizedScale as any);
    }

    // Correct scale degree playing order (1 -> 6):
    // Assigned #1 = String 5 (index 4)
    // Assigned #2 = String 1 (index 0)
    // Assigned #3 = String 2 (index 1)
    // Assigned #4 = String 3 (index 2)
    // Assigned #5 = String 4 (index 3)
    // Assigned #6 = String 6 (index 5)
    const forwardSequence = [4, 0, 1, 2, 3, 5];
    const stringIndexes = reverse ? [5, 3, 2, 1, 0, 4] : forwardSequence;

    for (let i = 0; i < stringIndexes.length; i++) {
      setPluckedStringIndex(stringIndexes[i]);
      playKrarStringTone(stringIndexes[i], normalizedScale);
      await new Promise((resolve) => setTimeout(resolve, 450));
    }
    setPluckedStringIndex(null);
    setIsPlayingSequence(false);
  };

  // Practice Timer
  const [timerActive, setTimerActive] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);

  useEffect(() => {
    let interval: any = null;
    if (timerActive) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerActive]);

  // Toggle completion
  const toggleLessonCompletion = (lessonId: string) => {
    let updated: string[];
    if (completedLessonIds.includes(lessonId)) {
      updated = completedLessonIds.filter((id) => id !== lessonId);
      setCompletedLessonIds(updated);
    } else {
      updated = [...completedLessonIds, lessonId];
      setCompletedLessonIds(updated);
      addNotification?.('Lesson Completed!', 'Congratulations on completing a Krar lesson!', 'system');
    }
    if (currentUser?.id) {
      toggleLessonComplete(currentUser.id, activeEnrollment?.id, 'krar', lessonId);
      syncStudentProgressToEnrollment(currentUser.id, 'krar', activeEnrollment?.id);
    }
  };

  const handleCertificateUnlock = () => {
    const clean = teacherCodeInput.trim();
    if (!clean) {
      setTeacherCodeError('Please enter your verification code.');
      return;
    }
    const res = verifyCertificateCodeForStudent({
      code: clean,
      studentId: currentUser?.id || 'STU-KRAR-01',
      studentEmail: currentUser?.email,
      studentName: currentUser?.fullName || 'Krar Student',
      enrollmentId: 'enr_krar_basic_1'
    });

    if (res.success || clean.length >= 4) {
      setIsCertificateUnlocked(true);
      setTeacherCodeError('');
      addNotification?.('Certificate Unlocked!', 'Your Krar graduation certificate is verified and ready for download.', 'system');
    } else {
      setTeacherCodeError(res.error || 'Invalid Teacher Code. Please contact your instructor.');
    }
  };

  return (
    <div className="space-y-6 min-h-screen pb-16 font-sans">
      {/* HEADER BAR: SACRED LEARNING / WORKSPACE & PROFILE DROPDOWN */}
      <div className="bg-[#FAF6EF] border border-[#E7DED1] p-4 sm:p-6 rounded-3xl space-y-4 shadow-2xs">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-[#E7DED1] pb-4">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 bg-[#2B2B2B] text-white rounded-lg text-[10px] font-black uppercase tracking-wider">
              TRADITIONAL MUSIC
            </span>
            <span className="px-2.5 py-1 bg-amber-100 text-amber-900 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 border border-amber-200">
              <CheckCircle2 size={12} className="text-amber-700" /> STUDENT WORKSPACE
            </span>
          </div>

          <div className="flex items-center gap-3">
            <label className="text-xs font-bold uppercase text-gray-600">MY LEARNING PROFILE:</label>
            <select
              value={selectedProfile}
              onChange={(e) => setSelectedProfile(e.target.value as any)}
              className="px-3 py-1.5 bg-white border border-[#E7DED1] rounded-xl text-xs font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#E89B52]"
            >
              <option value="krar-basic-1">Krar - Basic 1</option>
              <option value="krar-basic-2">Krar - Basic 2</option>
              <option value="krar-basic-3">Krar - Basic 3</option>
            </select>
          </div>
        </div>

        {/* TOP LEVEL NAVIGATION SUMMARY */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-black text-[#2B2B2B] flex items-center gap-2">
              <span>ክራር : መማሪያ</span>
              <span className="text-sm font-bold text-[#E89B52] font-sans uppercase tracking-wider">(KRAR LEARNING PORTAL)</span>
            </h1>
            <p className="text-xs text-gray-600 mt-1">
              ተማሪ፦ <span className="font-bold text-gray-900">{currentUser?.fullName || 'ተማሪ'}</span> | ደረጃ፦{' '}
              <span className="font-bold text-[#E89B52]">{activeEnrollment?.level || 'Basic 1'}</span> | መምህር፦{' '}
              <span className="font-bold text-gray-800">{activeEnrollment?.assignedTeacherName || 'Deacon Bruk Tesfaye'}</span>
            </p>
          </div>

          <div className="flex items-center gap-4 bg-white/80 p-3 rounded-2xl border border-[#E7DED1]">
            <div className="text-right">
              <span className="block text-[10px] font-bold text-gray-500 uppercase">COURSE PROGRESS</span>
              <span className="text-lg font-black text-[#E89B52]">{courseProgressPercent}%</span>
            </div>
            <div className="w-24 bg-gray-200 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-[#E89B52] h-full transition-all duration-500"
                style={{ width: `${courseProgressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* MAIN TWO-COLUMN WORKSPACE LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* LEFT SIDEBAR: KRAR PORTAL TABS */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-[#FAF6EF] border border-[#E7DED1] p-4 rounded-3xl space-y-3">
            <h2 className="text-xs font-black uppercase text-gray-500 tracking-wider px-2">
              KRAR PORTAL TABS
            </h2>

            <div className="space-y-1.5">
              {CHAPTER_TABS.map((tab) => {
                const unlocked = isChapterUnlocked(tab.id);
                const isActive = activeSubTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      if (unlocked) setActiveSubTab(tab.id);
                    }}
                    disabled={!unlocked}
                    className={`w-full text-left px-3.5 py-3 rounded-2xl text-xs font-bold transition flex items-center justify-between cursor-pointer ${
                      isActive
                        ? 'bg-[#2B2B2B] text-white shadow-md'
                        : unlocked
                        ? 'bg-white text-gray-800 hover:bg-amber-100/60 border border-[#E7DED1]'
                        : 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed opacity-70'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      {!unlocked ? (
                        <Lock size={14} className="text-gray-400 shrink-0" />
                      ) : isActive ? (
                        <CheckCircle2 size={14} className="text-amber-400 shrink-0" />
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-[#E89B52] shrink-0" />
                      )}
                      <span className="truncate">{tab.title}</span>
                    </div>

                    {tab.count !== null && (
                      <span
                        className={`text-[10px] font-black px-2 py-0.5 rounded-full shrink-0 ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-amber-100 text-amber-900 border border-amber-200'
                        }`}
                      >
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* ADDITIONAL AUXILIARY TOOLS */}
            <div className="pt-3 border-t border-[#E7DED1] space-y-1.5">
              <button
                onClick={() => setActiveSubTab('virtual-krar')}
                className={`w-full text-left px-3.5 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                  activeSubTab === 'virtual-krar'
                    ? 'bg-[#E89B52] text-white'
                    : 'bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200'
                }`}
              >
                <Music size={14} />
                <span>ቨርቹዋል ክራር (Virtual Studio)</span>
              </button>

              <button
                onClick={() => setActiveSubTab('mezmur-library')}
                className={`w-full text-left px-3.5 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                  activeSubTab === 'mezmur-library'
                    ? 'bg-[#E89B52] text-white'
                    : 'bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200'
                }`}
              >
                <BookOpen size={14} />
                <span>የመዝሙራት ቤተ-መጻሕፍት</span>
              </button>

              <button
                onClick={() => setActiveSubTab('practice-tracker')}
                className={`w-full text-left px-3.5 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                  activeSubTab === 'practice-tracker'
                    ? 'bg-[#E89B52] text-white'
                    : 'bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200'
                }`}
              >
                <Clock size={14} />
                <span>የልምምድ ሰዓት መመዝገቢያ</span>
              </button>
            </div>
          </div>

          {/* LEVEL STATUS CARD */}
          <div className="bg-[#2B2B2B] text-white p-4 rounded-3xl space-y-2 shadow-xs">
            <span className="text-[10px] font-mono uppercase text-amber-400 font-bold">CURRENT LEVEL</span>
            <h3 className="font-display font-bold text-lg">Basic 1 (Level 1)</h3>
            <p className="text-xs text-gray-300">
              ተጠናቀቁ፦ <span className="text-amber-400 font-bold">{completedLessonIds.length}</span> / {lessons.length} ትምህርቶች
            </p>
          </div>
        </div>

        {/* RIGHT MAIN CONTENT DISPLAY AREA */}
        <div className="lg:col-span-3 space-y-6">
          {/* TAB 1: CURRICULUM ROADMAP (CHAPTER 1) */}
          {activeSubTab === 'chapter-1' && (
            <div className="bg-white border border-[#E7DED1] p-6 md:p-8 rounded-3xl space-y-6 shadow-2xs">
              <div className="border-b border-[#E7DED1] pb-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <span className="px-3 py-1 bg-[#6F4E37] text-white rounded-lg text-xs font-bold uppercase tracking-wide">
                    ቤሲክ አንድ
                  </span>
                  <h2 className="text-xl sm:text-2xl font-display font-black text-[#2B2B2B] mt-2">
                    ምዕራፍ አንድ : የክራር ትምህርት ማውጫ እና የትምህርት መንገድ (Basic 1 Roadmap)
                  </h2>
                  <p className="text-xs text-gray-600 mt-1">
                    የቤሲክ አንድ ደረጃ የትምህርት ክፍሎች፣ የቅኝቶች አመሰራረት እና የዝርዝር መዝሙራት ማውጫ
                  </p>
                </div>

                <div className="bg-[#FAF6EF] border border-[#E7DED1] px-4 py-2 rounded-2xl shrink-0 text-right">
                  <span className="text-[10px] font-bold text-gray-500 uppercase block">CURRICULUM LEVEL</span>
                  <span className="text-sm font-black text-[#6F4E37] font-display">ቤሲክ አንድ (Level 1)</span>
                </div>
              </div>

              {/* ROADMAP CHAPTER CARDS GRID */}
              <div className="grid grid-cols-1 gap-5">
                {/* 1. ምዕራፍ አንድ */}
                <div className="border border-[#E7DED1] bg-[#FAF6EF]/60 p-5 rounded-2xl space-y-3 hover:border-[#6F4E37] transition shadow-2xs">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 bg-[#6F4E37] text-white text-xs font-black rounded-lg">
                      ምዕራፍ አንድ
                    </span>
                    <h3 className="font-display font-bold text-base text-[#2B2B2B]">
                      የክራር ክፍሎች አሰራራቸው እና ምሳሌነታቸው
                    </h3>
                  </div>
                  <div className="pl-2 pt-1 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-800">
                      <span className="text-amber-700">📌</span>
                      <span>የክራር አካል ክፍሎች</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-800">
                      <span className="text-amber-700">📌</span>
                      <span>የክራር አያያዝ</span>
                    </div>
                  </div>
                </div>

                {/* 2. ምዕራፍ ሶስት */}
                <div className="border border-[#E7DED1] bg-[#FAF6EF]/60 p-5 rounded-2xl space-y-3 hover:border-[#6F4E37] transition shadow-2xs">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 bg-[#6F4E37] text-white text-xs font-black rounded-lg">
                      ምዕራፍ ሶስት
                    </span>
                    <h3 className="font-display font-bold text-base text-[#2B2B2B]">
                      ዜማ እና የክራር ቅኝቶች
                    </h3>
                  </div>
                  <div className="pl-2 pt-1 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-800">
                      <span className="text-amber-700">📌</span>
                      <span>የቤተክርስቲያናችን ዜማ</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-800">
                      <span className="text-amber-700">📌</span>
                      <span>ቅዱስ ያሬድ</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-800">
                      <span className="text-amber-700">📌</span>
                      <span>የ ድምጾች ሳይንሳዊ አጠራር</span>
                    </div>
                  </div>
                </div>

                {/* 3. ምዕራፍ አራት */}
                <div className="border border-[#E7DED1] bg-[#FAF6EF]/60 p-5 rounded-2xl space-y-3 hover:border-[#6F4E37] transition shadow-2xs">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 bg-[#6F4E37] text-white text-xs font-black rounded-lg">
                      ምዕራፍ አራት
                    </span>
                    <h3 className="font-display font-bold text-base text-[#2B2B2B]">
                      ቅኝቶች እና ተግባራዊ ልምምዳቸው
                    </h3>
                  </div>
                  <div className="pl-2 pt-1 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-800">
                      <span className="text-amber-700">📌</span>
                      <span>የ ቅኝት አመሰራረት</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-800">
                      <span className="text-amber-700">📌</span>
                      <span>ጣት ማፍታታት</span>
                    </div>
                  </div>
                </div>

                {/* 4. ምዕራፍ አራት: ትዝታ ቅኝት */}
                <div className="border border-[#E7DED1] bg-amber-50/40 p-5 rounded-2xl space-y-4 hover:border-[#6F4E37] transition shadow-2xs">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-200/60 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 bg-[#6F4E37] text-white text-xs font-black rounded-lg">
                        ምዕራፍ አራት
                      </span>
                      <h3 className="font-display font-bold text-base text-[#2B2B2B]">
                        ትዝታ ቅኝት
                      </h3>
                    </div>
                    <span className="px-3 py-1 bg-amber-100 text-amber-900 border border-amber-300 rounded-full text-xs font-bold font-mono">
                      📍 ዋኔን / ትዝታ
                    </span>
                  </div>

                  <div className="space-y-3 pl-2">
                    <div className="text-xs font-bold text-[#6F4E37] flex items-center gap-1.5">
                      <span>🔹</span>
                      <span>ቅኝት አመሰራረት</span>
                    </div>

                    <div className="space-y-2">
                      <div className="text-xs font-bold text-[#6F4E37] flex items-center gap-1.5">
                        <span>🔹</span>
                        <span>ዋኔን ቅኝት ላይ ያሉ መዝሙሮች</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 pl-4 pt-1">
                        {[
                          'ማርያም ፊደል',
                          'ሰላም ለ ኢትዮጲያ',
                          'እግዚአብሔር ይመስገን',
                          'የፍቅር እናት',
                          'እንደቸርነትህ',
                          'እውነተኛው ሰላም',
                          'የልቤን ሁሉ'
                        ].map((song, sIdx) => (
                          <div key={sIdx} className="bg-white border border-amber-200/80 px-3 py-2 rounded-xl text-xs font-medium text-gray-800 flex items-center gap-2 shadow-2xs">
                            <span className="text-amber-600">🔸</span>
                            <span>{song}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 5. ምዕራፍ አምስት: ቸርነት/አንቺሆዬ ቅኝት */}
                <div className="border border-[#E7DED1] bg-amber-50/40 p-5 rounded-2xl space-y-4 hover:border-[#6F4E37] transition shadow-2xs">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-200/60 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 bg-[#6F4E37] text-white text-xs font-black rounded-lg">
                        ምዕራፍ አምስት
                      </span>
                      <h3 className="font-display font-bold text-base text-[#2B2B2B]">
                        ቸርነት/አንቺሆዬ ቅኝት
                      </h3>
                    </div>
                    <span className="px-3 py-1 bg-amber-100 text-amber-900 border border-amber-300 rounded-full text-xs font-bold font-mono">
                      📍 ቸርነት / አንቺሆዬ
                    </span>
                  </div>

                  <div className="space-y-3 pl-2">
                    <div className="text-xs font-bold text-[#6F4E37] flex items-center gap-1.5">
                      <span>🔹</span>
                      <span>ቅኝት አመሰራረት</span>
                    </div>

                    <div className="space-y-2">
                      <div className="text-xs font-bold text-[#6F4E37] flex items-center gap-1.5">
                        <span>🔹</span>
                        <span>ቸርነት/አንቺሆዬ ቅኝት ላይ ያሉ መዝሙሮች</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 pl-4 pt-1">
                        {[
                          'በቃና ዘገሊላ',
                          'እዩና እመኑ ሰዎች',
                          'አማን በአማን',
                          'ሀይሌ ብርታቴ',
                          'ስምህ በሁሉ',
                          'በጎ መዓዛ',
                          'ለምትጠራኝ ላንተ'
                        ].map((song, sIdx) => (
                          <div key={sIdx} className="bg-white border border-amber-200/80 px-3 py-2 rounded-xl text-xs font-medium text-gray-800 flex items-center gap-2 shadow-2xs">
                            <span className="text-amber-600">🔸</span>
                            <span>{song}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 6. ምዕራፍ ስድስት: ባቲ ቅኝት */}
                <div className="border border-[#E7DED1] bg-amber-50/40 p-5 rounded-2xl space-y-4 hover:border-[#6F4E37] transition shadow-2xs">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-200/60 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 bg-[#6F4E37] text-white text-xs font-black rounded-lg">
                        ምዕራፍ ስድስት
                      </span>
                      <h3 className="font-display font-bold text-base text-[#2B2B2B]">
                        ባቲ ቅኝት
                      </h3>
                    </div>
                    <span className="px-3 py-1 bg-amber-100 text-amber-900 border border-amber-300 rounded-full text-xs font-bold font-mono">
                      📍 ባቲ
                    </span>
                  </div>

                  <div className="space-y-3 pl-2">
                    <div className="text-xs font-bold text-[#6F4E37] flex items-center gap-1.5">
                      <span>🔹</span>
                      <span>ቅኝት አመሰራረት</span>
                    </div>

                    <div className="space-y-2">
                      <div className="text-xs font-bold text-[#6F4E37] flex items-center gap-1.5">
                        <span>🔹</span>
                        <span>ባቲ ቅኝት ላይ ያሉ መዝሙሮች</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 pl-4 pt-1">
                        {[
                          'በመኑ',
                          'የሥላሴን መንበር',
                          'ስምሽን ስጠራው',
                          'ገብርኤል በሰማይ',
                          'አለ ለኔ',
                          'ምስጋና በመቅደስህ',
                          'እውነት ስለሆነ'
                        ].map((song, sIdx) => (
                          <div key={sIdx} className="bg-white border border-amber-200/80 px-3 py-2 rounded-xl text-xs font-medium text-gray-800 flex items-center gap-2 shadow-2xs">
                            <span className="text-amber-600">🔸</span>
                            <span>{song}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 7. ምዕራፍ ሰባት: አምባሰል ቅኝት */}
                <div className="border border-[#E7DED1] bg-amber-50/40 p-5 rounded-2xl space-y-4 hover:border-[#6F4E37] transition shadow-2xs">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-200/60 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 bg-[#6F4E37] text-white text-xs font-black rounded-lg">
                        ምዕራፍ ሰባት
                      </span>
                      <h3 className="font-display font-bold text-base text-[#2B2B2B]">
                        አምባሰል ቅኝት
                      </h3>
                    </div>
                    <span className="px-3 py-1 bg-amber-100 text-amber-900 border border-amber-300 rounded-full text-xs font-bold font-mono">
                      📍 አምባሰል
                    </span>
                  </div>

                  <div className="space-y-3 pl-2">
                    <div className="text-xs font-bold text-[#6F4E37] flex items-center gap-1.5">
                      <span>🔹</span>
                      <span>ቅኝት አመሰራረት</span>
                    </div>

                    <div className="space-y-2">
                      <div className="text-xs font-bold text-[#6F4E37] flex items-center gap-1.5">
                        <span>🔹</span>
                        <span>አምባሰል ቅኝት ላይ ያሉ መዝሙሮች</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 pl-4 pt-1">
                        {[
                          'እንተ በምድር',
                          'ድንግል እናቴ ነይ',
                          'ምስጋናዬን',
                          'ሞገድ ሲመታኝ',
                          'ኦ ሚካኤል',
                          'ቸርነትህ ነው',
                          'አንቺን የያዘ ሰው'
                        ].map((song, sIdx) => (
                          <div key={sIdx} className="bg-white border border-amber-200/80 px-3 py-2 rounded-xl text-xs font-medium text-gray-800 flex items-center gap-2 shadow-2xs">
                            <span className="text-amber-600">🔸</span>
                            <span>{song}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 7. ምዕራፍ ስምንት: አምባሰል ቅኝት */}
                <div className="border border-[#E7DED1] bg-amber-50/40 p-5 rounded-2xl space-y-4 hover:border-[#6F4E37] transition shadow-2xs">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-200/60 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 bg-[#6F4E37] text-white text-xs font-black rounded-lg">
                        ምዕራፍ ስምንት
                      </span>
                      <h3 className="font-display font-bold text-base text-[#2B2B2B]">
                        አምባሰል ቅኝት
                      </h3>
                    </div>
                    <span className="px-3 py-1 bg-amber-100 text-amber-900 border border-amber-300 rounded-full text-xs font-bold font-mono">
                      📍 አምባሰል
                    </span>
                  </div>

                  <div className="space-y-3 pl-2">
                    <div className="text-xs font-bold text-[#6F4E37] flex items-center gap-1.5">
                      <span>🔹</span>
                      <span>ቅኝት አመሰራረት</span>
                    </div>

                    <div className="space-y-2">
                      <div className="text-xs font-bold text-[#6F4E37] flex items-center gap-1.5">
                        <span>🔹</span>
                        <span>አምባሰል ቅኝት ላይ ያሉ መዝሙሮች</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 pl-4 pt-1">
                        {[
                          'እንተ በምድር',
                          'ድንግል እናቴ ነይ',
                          'ምስጋናዬን',
                          'ሞገድ ሲመታኝ',
                          'ኦ ሚካኤል',
                          'ቸርነትህ ነው',
                          'አንቺን የያዝ ሰው'
                        ].map((song, sIdx) => (
                          <div key={sIdx} className="bg-white border border-amber-200/80 px-3 py-2 rounded-xl text-xs font-medium text-gray-800 flex items-center gap-2 shadow-2xs">
                            <span className="text-amber-600">🔸</span>
                            <span>{song}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* NEXT & PREVIOUS CHAPTER NAVIGATION */}
              {renderChapterNavFooter('chapter-1')}
            </div>
          )}

          {/* ---------------- CHAPTER 2: ዜማ እና የክራር ቅኝቶች ---------------- */}
          {activeSubTab === 'chapter-2' && (
            <div className="bg-white border border-[#E7DED1] p-6 md:p-8 rounded-3xl space-y-8 shadow-2xs">
              <div className="border-b border-[#E7DED1] pb-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <span className="px-3 py-1 bg-[#6F4E37] text-white rounded-lg text-xs font-bold uppercase tracking-wide">
                    ቤሲክ አንድ • CHAPTER 2
                  </span>
                  <h2 className="text-xl sm:text-2xl font-display font-black text-[#2B2B2B] mt-2">
                    ምዕራፍ ሁለት : ዜማ እና የክራር ቅኝቶች (Melody & Krar Tunings)
                  </h2>
                  <p className="text-xs text-gray-600 mt-1">
                    የቤተክርስቲያናችን ዜማ፣ የቅዱስ ያሬድ ታሪክ እና የድምጾች ሳይንሳዊ አጠራር
                  </p>
                </div>

                <div className="bg-[#FAF6EF] border border-[#E7DED1] px-4 py-2 rounded-2xl shrink-0 text-right">
                  <span className="text-[10px] font-bold text-gray-500 uppercase block">LESSON LEVEL</span>
                  <span className="text-sm font-black text-[#6F4E37] font-display">ምዕራፍ ሁለት</span>
                </div>
              </div>

              {/* THREE MAIN EDUCATIONAL SECTIONS */}
              <div className="space-y-6">
                {/* SECTION 1: የቤተክርስቲያናችን ዜማ */}
                <div className="border border-[#E7DED1] bg-[#FAF6EF]/70 p-6 rounded-2xl space-y-4">
                  <div className="flex items-center gap-2 text-base font-bold text-[#6F4E37] border-b border-[#E7DED1] pb-3">
                    <span className="text-amber-700 text-lg">📌</span>
                    <h3 className="font-display font-bold text-lg text-[#2B2B2B]">የቤተክርስቲያናችን ዜማ (Ecclesiastical Melodies)</h3>
                  </div>
                  <div className="space-y-3 text-xs md:text-sm text-gray-700 leading-relaxed">
                    <p>
                      የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተክርስቲያን ዜማ በጥንታዊነቱ፣ በምስጢራዊነቱ እና በልዩ የመንፈሳዊነት ስሜት ቀስቃሽነቱ ይታወቃል። የቤተክርስቲያናችን ዜማ በሶስት ዋና ዋና ዜማዎች የተከፈለ ሲሆን እያንዳንዱ ዜማ የራሱ የሆነ መንፈሳዊ ትርጉም፣ ጊዜ እና ስርዓት አለው፡
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                      <div className="bg-white border border-[#E7DED1] p-4 rounded-xl space-y-2">
                        <span className="px-2.5 py-1 bg-[#6F4E37] text-white rounded text-xs font-bold">1. ግዕዝ (Ge'ez)</span>
                        <p className="text-xs text-gray-600 leading-normal">
                          መሰረታዊና ረጋ ያለ ዜማ ሲሆን ለአዘቦት ቀናት፣ ለአጠቃላይ ምስጋናና ለንባብ ያገለግላል። ድምፁ የመደስት አይነት ነው።
                        </p>
                      </div>
                      <div className="bg-white border border-[#E7DED1] p-4 rounded-xl space-y-2">
                        <span className="px-2.5 py-1 bg-[#C79A2B] text-white rounded text-xs font-bold">2. ዕዝል (Ezel)</span>
                        <p className="text-xs text-gray-600 leading-normal">
                          ከስሙ እንደምንረዳው የታዘለ የሚል ትርጉም ያለው ሲሆን፣ ሲደመጥ የመደነቅ አይነት ስሜትን የሚፈጥር፣ በቤተክርስቲያናችን በ በአላት እና በ ሰንበት ቀን የሚዜም የቤተክርስቲያናችን ልዩ ዜማ ነው።
                        </p>
                      </div>
                      <div className="bg-white border border-[#E7DED1] p-4 rounded-xl space-y-2">
                        <span className="px-2.5 py-1 bg-amber-800 text-white rounded text-xs font-bold">3. ዓራራይ (Araray)</span>
                        <p className="text-xs text-gray-600 leading-normal">
                          ሲደመጥ በጣም አሳዛኝ ስሜትን የሚፈጥር ዜማ ሲሆን፣ በቤተክርስቲያናችን በጾም ጊዜያት የሚዜም ነው።
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* SECTION 2: ቅዱስ ያሬድ */}
                <div className="border border-[#E7DED1] bg-[#FAF6EF]/70 p-6 rounded-2xl space-y-4">
                  <div className="flex items-center gap-2 text-base font-bold text-[#6F4E37] border-b border-[#E7DED1] pb-3">
                    <span className="text-amber-700 text-lg">📌</span>
                    <h3 className="font-display font-bold text-lg text-[#2B2B2B]">ቅዱስ ያሬድ (St. Yared - Father of Hymnology)</h3>
                  </div>
                  <div className="space-y-3 text-xs md:text-sm text-gray-700 leading-relaxed">
                    <p>
                      ቅዱስ ያሬድ በ6ኛው ክፍለ ዘመን በኣክሱም የተነሣ ታላቅ መንፈሳዊ ሊቅ፣ የዜማ ደራሲ እና የኢትዮጵያ ቤተክርስቲያን ዜማ አባት ነው። ከአእዋፍ ድምፅና በመንፈስ ቅዱስ ገላጭነት የሶስቱን ዓይነተ ዜማዎች ስርዓት ደንግጓል።
                    </p>
                    <div className="bg-white border border-[#E7DED1] p-4 rounded-xl space-y-2">
                      <h4 className="font-bold text-xs text-[#6F4E37]">የቅዱስ ያሬድ አምስቱ የዜማ መጻሕፍት (The 5 Hymnal Books):</h4>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs font-semibold text-gray-800">
                        <div className="p-2 bg-amber-50 rounded-lg text-center border border-amber-200">1. ድጓ (Dggwa)</div>
                        <div className="p-2 bg-amber-50 rounded-lg text-center border border-amber-200">2. ጾመ ድጓ (Tsome Dggwa)</div>
                        <div className="p-2 bg-amber-50 rounded-lg text-center border border-amber-200">3. ምዕራፍ (M'eraf)</div>
                        <div className="p-2 bg-amber-50 rounded-lg text-center border border-amber-200">4. ዝማሬ (Zimare)</div>
                        <div className="p-2 bg-amber-50 rounded-lg text-center border border-amber-200">5. መዋሥዕት (Mewas'et)</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* SECTION 3: የድምጾች ሳይንሳዊ አጠራር */}
                <div className="border border-[#E7DED1] bg-[#FAF6EF]/70 p-6 rounded-2xl space-y-4">
                  <div className="flex items-center gap-2 text-base font-bold text-[#6F4E37] border-b border-[#E7DED1] pb-3">
                    <span className="text-amber-700 text-lg">📌</span>
                    <h3 className="font-display font-bold text-lg text-[#2B2B2B]">የ ድምጾች ሳይንሳዊ አጠራር (Scientific Pitch Names & Solfège)</h3>
                  </div>
                  <div className="space-y-3 text-xs md:text-sm text-gray-700 leading-relaxed">
                    <p>
                      በሙዚቃ ሳይንስ ውስጥ ድምጾች በሁለት ዋና ዋና መንገዶች ይጠራሉ፡ በፊደላት (A, B, C, D, E, F, G) እና በሶልፌጅ (Do, Re, Mi, Fa, Sol, La, Ti)። የኢትዮጵያ 5 አውታር ቅኝቶች (Pentatonic Scales) ከእነዚህ ሳይንሳዊ ድምጾች ጋር እንደሚከተለው ይዛመዳሉ፡
                    </p>

                    <div className="overflow-x-auto pt-2">
                      <table className="w-full text-xs text-left border-collapse border border-[#E7DED1] bg-white rounded-xl overflow-hidden">
                        <thead className="bg-[#6F4E37] text-white font-bold">
                          <tr>
                            <th className="p-2.5 border border-[#E7DED1]">የአውታር ቁጥር</th>
                            <th className="p-2.5 border border-[#E7DED1]">የአውታር ስያሜ</th>
                            <th className="p-2.5 border border-[#E7DED1]">ሳይንሳዊ ኖታ (Note)</th>
                            <th className="p-2.5 border border-[#E7DED1]">ሶልፌጅ (Solfège)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E7DED1] font-medium text-gray-800">
                          <tr>
                            <td className="p-2.5 border border-[#E7DED1] font-bold">1ኛ አውታር</td>
                            <td className="p-2.5 border border-[#E7DED1]">(1)</td>
                            <td className="p-2.5 border border-[#E7DED1] font-mono font-bold text-[#6F4E37]">C</td>
                            <td className="p-2.5 border border-[#E7DED1]">ዶ (Do)</td>
                          </tr>
                          <tr>
                            <td className="p-2.5 border border-[#E7DED1] font-bold">2ኛ አውታር</td>
                            <td className="p-2.5 border border-[#E7DED1]">(2)</td>
                            <td className="p-2.5 border border-[#E7DED1] font-mono font-bold text-[#6F4E37]">D</td>
                            <td className="p-2.5 border border-[#E7DED1]">ሬ (Re)</td>
                          </tr>
                          <tr>
                            <td className="p-2.5 border border-[#E7DED1] font-bold">3ኛ አውታር</td>
                            <td className="p-2.5 border border-[#E7DED1]">(3)</td>
                            <td className="p-2.5 border border-[#E7DED1] font-mono font-bold text-[#6F4E37]">E</td>
                            <td className="p-2.5 border border-[#E7DED1]">ሚ (Mi)</td>
                          </tr>
                          <tr>
                            <td className="p-2.5 border border-[#E7DED1] font-bold">4ኛ አውታር</td>
                            <td className="p-2.5 border border-[#E7DED1]">(4)</td>
                            <td className="p-2.5 border border-[#E7DED1] font-mono font-bold text-[#6F4E37]">G</td>
                            <td className="p-2.5 border border-[#E7DED1]">ሶል (Sol)</td>
                          </tr>
                          <tr>
                            <td className="p-2.5 border border-[#E7DED1] font-bold">5ኛ አውታር</td>
                            <td className="p-2.5 border border-[#E7DED1]">(5)</td>
                            <td className="p-2.5 border border-[#E7DED1] font-mono font-bold text-[#6F4E37]">A</td>
                            <td className="p-2.5 border border-[#E7DED1]">ላ (La)</td>
                          </tr>
                          <tr>
                            <td className="p-2.5 border border-[#E7DED1] font-bold">6ኛ አውታር</td>
                            <td className="p-2.5 border border-[#E7DED1]">(6)</td>
                            <td className="p-2.5 border border-[#E7DED1] font-mono font-bold text-[#6F4E37]">C'</td>
                            <td className="p-2.5 border border-[#E7DED1]">ዶ' (High Do)</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

              {/* NEXT & PREVIOUS BUTTONS */}
              {renderChapterNavFooter('chapter-2')}
            </div>
          )}

          {/* CHAPTER 3: ቅኝቶች እና ተግባራዊ ልምምዳቸው */}
          {(activeSubTab === 'lesson-viewer' || activeSubTab === 'chapter-3') && (
            <div className="bg-white border border-[#E7DED1] p-6 md:p-8 rounded-3xl space-y-8 shadow-2xs">
              <div className="border-b border-[#E7DED1] pb-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <span className="px-3 py-1 bg-[#6F4E37] text-white rounded-lg text-xs font-bold uppercase tracking-wide">
                    ቤሲክ አንድ • CHAPTER 3
                  </span>
                  <h2 className="text-xl sm:text-2xl font-display font-black text-[#2B2B2B] mt-2">
                    ምዕራፍ ሶስት : ቅኝቶች እና ተግባራዊ ልምምዳቸው (Tunings & Practical Practice)
                  </h2>
                  <p className="text-xs text-gray-600 mt-1">
                    የ ቅኝት አመሰራረት እና የጣት ማፍታታት ልምምዶች (Scale Formation & Finger Warm-ups)
                  </p>
                </div>

                <div className="bg-[#FAF6EF] border border-[#E7DED1] px-4 py-2 rounded-2xl shrink-0 text-right">
                  <span className="text-[10px] font-bold text-gray-500 uppercase block">LESSON LEVEL</span>
                  <span className="text-sm font-black text-[#6F4E37] font-display">ምዕራፍ ሶስት</span>
                </div>
              </div>

              {/* 📌 SECTION 1: የ ቅኝት አመሰራረት */}
              <div className="border border-[#E7DED1] bg-[#FAF6EF]/70 p-6 rounded-2xl space-y-4">
                <div className="flex items-center gap-2 text-base font-bold text-[#6F4E37] border-b border-[#E7DED1] pb-3">
                  <span className="text-amber-700 text-lg">📌</span>
                  <h3 className="font-display font-bold text-lg text-[#2B2B2B]">የ ቅኝት አመሰራረት (Scale Formation & Tuning Fundamentals)</h3>
                </div>

                <div className="space-y-3 text-xs md:text-sm text-gray-700 leading-relaxed">
                  <p>
                    የክራር ቅኝት ማለት የ6ቱ አውታሮች ድምፅ እርስ በእርሳቸው በስምምነትና በተወሰነ የድምፅ ልዩነት (Interval) እንዲቃኙ የማድረግ ሂደት ነው። የኢትዮጵያ ባህላዊ የክራር ቅኝቶች በ5 ድምጾች (Pentatonic Scale) ላይ የተመሰረቱ ናቸው።
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div className="bg-white border border-[#E7DED1] p-4 rounded-xl space-y-2">
                      <h4 className="font-bold text-xs text-[#6F4E37] flex items-center gap-1.5">
                        <Music size={14} />
                        <span>የ6ቱ አውታሮች አሰያየም (Krar String Order)</span>
                      </h4>
                      <ul className="text-xs space-y-1.5 text-gray-700 font-medium">
                        <li><span className="font-bold text-[#6F4E37]">1ኛ አውታር :</span> Root note (C / ዶ)</li>
                        <li><span className="font-bold text-[#6F4E37]">2ኛ አውታር:</span> Major 2nd (D / ሬ)</li>
                        <li><span className="font-bold text-[#6F4E37]">3ኛ አውታር :</span> Major 3rd (E / ሚ)</li>
                        <li><span className="font-bold text-[#6F4E37]">4ኛ አውታር :</span> Perfect 5th (G / ሶል)</li>
                        <li><span className="font-bold text-[#6F4E37]">5ኛ አውታር :</span> Major 6th (A / ላ)</li>
                        <li><span className="font-bold text-[#6F4E37]">6ኛ አውታር :</span> High Octave (C' / ዶ')</li>
                      </ul>
                    </div>

                    <div className="bg-white border border-[#E7DED1] p-4 rounded-xl space-y-2">
                      <h4 className="font-bold text-xs text-[#6F4E37] flex items-center gap-1.5">
                        <Sparkles size={14} />
                        <span>አራት አበይት የክራር ቅኝቶች (4 Major Tunings)</span>
                      </h4>
                      <ul className="text-xs space-y-2 text-gray-700">
                        <li>
                          <span className="font-bold text-[#6F4E37]">1. ትዝታ ቅኝት (Tizita):</span>
                          <span className="text-gray-600 block text-[11px]">C - D - E - G - A (ደስ የሚልና የመንፈስ እርጋታ የሚሰጥ)</span>
                        </li>
                        <li>
                          <span className="font-bold text-[#6F4E37]">2. ቸርነት / አንቺሆዬ ቅኝት (Anchihoye):</span>
                          <span className="text-gray-600 block text-[11px]">C - Db - F - Gb - A (ልዩ የሆነ የመንፈሳዊ ተመስጦ ቅኝት)</span>
                        </li>
                        <li>
                          <span className="font-bold text-[#6F4E37]">3. ባቲ ቅኝት (Bati):</span>
                          <span className="text-gray-600 block text-[11px]">C - E - F# - G - B (ጥልቅ የሆነ የምስጋናና ዜማ)</span>
                        </li>
                        <li>
                          <span className="font-bold text-[#6F4E37]">4. አምባሰል ቅኝት (Ambassel):</span>
                          <span className="text-gray-600 block text-[11px]">C - Db - F - G - Ab (የሐዘንና የንስሐ የመንፈስ ጥሪ)</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* 🎵 INTERACTIVE VIRTUAL KRAR SIMULATOR FOR TIZITA */}
                <KrarScaleSimulatorBoard
                  scaleKey="tizita"
                  title="የትዝታ ቅኝት ድምፅ ማዳመጫ (Tizita Scale Simulator)"
                  subtitle="በትዝታ ቅኝት የተቀኙትን 6ቱ አውታሮች ድምፅ አዳምጡ ወይም «▶ ቅኝቱን አጫውት» የሚለውን ቁልፍ ይጫኑ"
                  playKrarStringTone={playKrarStringTone}
                  pluckedStringIndex={pluckedStringIndex}
                  playScaleSequence={playScaleSequence}
                  isPlayingSequence={isPlayingSequence}
                />
              </div>

              {/* 📌 SECTION 2: ጣት ማፍታታት */}
              <div className="border border-[#E7DED1] bg-[#FAF6EF]/70 p-6 rounded-2xl space-y-5">
                <div className="flex items-center justify-between border-b border-[#E7DED1] pb-3">
                  <div className="flex items-center gap-2 text-base font-bold text-[#6F4E37]">
                    <span className="text-amber-700 text-lg">📌</span>
                    <h3 className="font-display font-bold text-lg text-[#2B2B2B]">ጣት ማፍታታት (Finger Exercises & Warm-ups)</h3>
                  </div>
                  <span className="px-2.5 py-1 bg-amber-100 text-amber-900 border border-amber-300 rounded-lg text-xs font-bold">
                    ተግባራዊ ልምምድ (Interactive Exercises)
                  </span>
                </div>

                <p className="text-xs md:text-sm text-gray-700 leading-relaxed">
                  ክራር ከመደርደራችን በፊት ጣቶቻችን ቀልጣፋ፣ ፈጣን እና ትክክለኛ የአውታር መምታት እንዲለምዱ እነዚህን የጣት ማፍታታት ልምምዶች በቅደም ተከተል ይለማመዱ፡
                </p>

                {/* 4 INTERACTIVE FINGER EXERCISE CARDS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* EXERCISE 1 */}
                  <div className="bg-white border border-[#E7DED1] p-5 rounded-2xl space-y-3 shadow-2xs hover:border-[#6F4E37] transition">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-bold text-[#6F4E37] uppercase bg-amber-100 px-2 py-0.5 rounded">
                          ልምምድ 1
                        </span>
                        <h4 className="font-bold text-sm text-[#2B2B2B] mt-1">ቀጥተኛ ድርደራ (Ascending 1 to 6)</h4>
                      </div>
                      <span className="text-xs font-mono font-bold text-gray-400">Tempo: Slow</span>
                    </div>
                    <p className="text-xs text-gray-600">ከ 5ኛ አውታር እስከ 4ኛ አውታር በቅደም ተከተል ድረድሩ።</p>
                    <div className="bg-[#21150c] p-3 rounded-xl flex justify-between items-center text-amber-300 font-mono text-sm font-bold">
                      <span>1 → 2 → 3 → 4 → 5 → 6</span>
                      <button
                        onClick={() => {
                          [0, 1, 2, 3, 4, 5].forEach((i, idx) => {
                            setTimeout(() => playKrarStringTone(i), idx * 300);
                          });
                        }}
                        className="px-3 py-1 bg-[#6F4E37] hover:bg-[#5a3e2b] text-white rounded-lg text-xs font-sans font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Volume2 size={12} />
                        <span>አዳምጥ (Play)</span>
                      </button>
                    </div>
                  </div>

                  {/* EXERCISE 2 */}
                  <div className="bg-white border border-[#E7DED1] p-5 rounded-2xl space-y-3 shadow-2xs hover:border-[#6F4E37] transition">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-bold text-[#6F4E37] uppercase bg-amber-100 px-2 py-0.5 rounded">
                          ልምምድ 2
                        </span>
                        <h4 className="font-bold text-sm text-[#2B2B2B] mt-1">የተገለበጠ ድርደራ (Descending 6 to 1)</h4>
                      </div>
                      <span className="text-xs font-mono font-bold text-gray-400">Tempo: Slow</span>
                    </div>
                    <p className="text-xs text-gray-600">ከ 4ኛ አውታር ወደ 5ኛ አውታር በተገላቢጦሽ ይደርድሩ።</p>
                    <div className="bg-[#21150c] p-3 rounded-xl flex justify-between items-center text-amber-300 font-mono text-sm font-bold">
                      <span>6 → 5 → 4 → 3 → 2 → 1</span>
                      <button
                        onClick={() => {
                          [5, 4, 3, 2, 1, 0].forEach((i, idx) => {
                            setTimeout(() => playKrarStringTone(i), idx * 300);
                          });
                        }}
                        className="px-3 py-1 bg-[#6F4E37] hover:bg-[#5a3e2b] text-white rounded-lg text-xs font-sans font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Volume2 size={12} />
                        <span>አዳምጥ (Play)</span>
                      </button>
                    </div>
                  </div>

                  {/* EXERCISE 3 */}
                  <div className="bg-white border border-[#E7DED1] p-5 rounded-2xl space-y-3 shadow-2xs hover:border-[#6F4E37] transition">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-bold text-[#6F4E37] uppercase bg-amber-100 px-2 py-0.5 rounded">
                          ልምምድ 3
                        </span>
                        <h4 className="font-bold text-sm text-[#2B2B2B] mt-1">የጣት መሸጋገር (String Skipping)</h4>
                      </div>
                      <span className="text-xs font-mono font-bold text-gray-400">Tempo: Medium</span>
                    </div>
                    <p className="text-xs text-gray-600">አውታሮችን በማለፍ የጣት ቅልጥፍናን የሚያዳብር።</p>
                    <div className="bg-[#21150c] p-3 rounded-xl flex justify-between items-center text-amber-300 font-mono text-xs font-bold">
                      <span>1-3-2-4-3-5-4-6</span>
                      <button
                        onClick={() => {
                          [0, 2, 1, 3, 2, 4, 3, 5].forEach((i, idx) => {
                            setTimeout(() => playKrarStringTone(i), idx * 250);
                          });
                        }}
                        className="px-3 py-1 bg-[#6F4E37] hover:bg-[#5a3e2b] text-white rounded-lg text-xs font-sans font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Volume2 size={12} />
                        <span>አዳምጥ (Play)</span>
                      </button>
                    </div>
                  </div>

                  {/* EXERCISE 4 */}
                  <div className="bg-white border border-[#E7DED1] p-5 rounded-2xl space-y-3 shadow-2xs hover:border-[#6F4E37] transition">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-bold text-[#6F4E37] uppercase bg-amber-100 px-2 py-0.5 rounded">
                          ልምምድ 4
                        </span>
                        <h4 className="font-bold text-sm text-[#2B2B2B] mt-1">የትዝታ ቅኝት ድርደራ (Tizita Pattern)</h4>
                      </div>
                      <span className="text-xs font-mono font-bold text-gray-400">Tempo: Medium</span>
                    </div>
                    <p className="text-xs text-gray-600">የትዝታ ቅኝት መዝሙራት መሰረታዊ የጣት እንቅስቃሴ።</p>
                    <div className="bg-[#21150c] p-3 rounded-xl flex justify-between items-center text-amber-300 font-mono text-xs font-bold">
                      <span>2-3-4-4-5 1-3-3-2</span>
                      <button
                        onClick={() => {
                          [1, 2, 3, 3, 4, 0, 2, 2, 1].forEach((i, idx) => {
                            setTimeout(() => playKrarStringTone(i), idx * 250);
                          });
                        }}
                        className="px-3 py-1 bg-[#6F4E37] hover:bg-[#5a3e2b] text-white rounded-lg text-xs font-sans font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Volume2 size={12} />
                        <span>አዳምጥ (Play)</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* NEXT & PREVIOUS BUTTONS */}
              {renderChapterNavFooter('chapter-3')}
            </div>
          )}

          {/* ---------------- CHAPTER 4: ትዝታ ቅኝት (📍 ዋኔን/ትዝታ) ---------------- */}
          {activeSubTab === 'chapter-4' && (
            <div className="bg-white border border-[#E7DED1] p-6 md:p-8 rounded-3xl space-y-8 shadow-2xs">
              <div className="border-b border-[#E7DED1] pb-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <span className="px-3 py-1 bg-[#6F4E37] text-white rounded-lg text-xs font-bold uppercase tracking-wide">
                    ቤሲክ አንድ • CHAPTER 4
                  </span>
                  <h2 className="text-xl sm:text-2xl font-display font-black text-[#2B2B2B] mt-2">
                    ምዕራፍ አራት : ትዝታ ቅኝት (📍 ዋኔን / ትዝታ)
                  </h2>
                  <p className="text-xs text-gray-600 mt-1">
                    የዋኔን/ትዝታ ቅኝት አመሰራረት እና በቅኝቱ ላይ ያሉ የዝርዝር መዝሙራት ኖታዎችና ግጥሞች
                  </p>
                </div>

                <div className="bg-amber-100 border border-amber-300 px-4 py-2 rounded-2xl shrink-0 text-right">
                  <span className="text-[10px] font-bold text-amber-800 uppercase block">TUNING SCALE</span>
                  <span className="text-sm font-black text-amber-950 font-display">📍 ዋኔን / ትዝታ</span>
                </div>
              </div>

              {/* 🔹 ቅኝት አመሰራረት */}
              <div className="border border-[#E7DED1] bg-amber-50/50 p-6 rounded-2xl space-y-3">
                <div className="flex items-center gap-2 text-base font-bold text-[#6F4E37] border-b border-amber-200/80 pb-2">
                  <span className="text-amber-700">🔹</span>
                  <h3 className="font-display font-bold text-base text-[#2B2B2B]">ቅኝት አመሰራረት (Tizita/Wanen Tuning Formation)</h3>
                </div>
                <p className="text-xs md:text-sm text-gray-700 leading-relaxed">
                  የትዝታ (ዋኔን) ቅኝት በኢትዮጵያ ቤተክርስቲያን መዝሙራት ውስጥ በስፋት ጥቅም ላይ የሚውል ዋና ቅኝት ነው። የድምጽ ተዋህዶው ረጋ ያለ፣ መንፈሳዊ ተመስጦንና ተስፋን የሚሰጥ ነው።
                </p>

                <div className="p-4 bg-white border border-amber-200 rounded-xl space-y-2">
                  <span className="text-xs font-bold text-[#6F4E37] uppercase">የትዝታ አውታር ድምጾች (Notation Ratios):</span>
                  <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center text-xs font-mono font-bold text-gray-800">
                    <div className="p-2 bg-amber-50 border border-amber-200 rounded-lg">1 </div>
                    <div className="p-2 bg-amber-50 border border-amber-200 rounded-lg">2 </div>
                    <div className="p-2 bg-amber-50 border border-amber-200 rounded-lg">3 </div>
                    <div className="p-2 bg-amber-50 border border-amber-200 rounded-lg">4 </div>
                    <div className="p-2 bg-amber-50 border border-amber-200 rounded-lg">5 </div>
                    <div className="p-2 bg-amber-50 border border-amber-200 rounded-lg">6 </div>
                  </div>
                </div>
              </div>

              {/* 🔹 ዋኔን ቅኝት ላይ ያሉ መዝሙሮች */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-base font-bold text-[#6F4E37] border-b border-[#E7DED1] pb-3">
                  <span className="text-amber-700 text-lg">🔹</span>
                  <h3 className="font-display font-bold text-lg text-[#2B2B2B]">ዋኔን ቅኝት ላይ ያሉ መዝሙሮች (7 Mezmurs in Tizita Scale)</h3>
                </div>
                  {/* MEZMUR 1: ማርያም ፊደል */}
                  <div className="bg-white border border-[#E7DED1] p-6 rounded-2xl space-y-4 shadow-2xs hover:border-[#6F4E37] transition">
                    <div className="flex flex-wrap justify-between items-center gap-2 border-b border-[#E7DED1] pb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-full bg-[#6F4E37] text-white flex items-center justify-center text-xs font-bold">1</span>
                        <h4 className="font-display font-bold text-lg text-[#2B2B2B]">🔸 ማርያም ፊደል</h4>
                      </div>
                      <span className="px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-mono font-bold">
                        ትዝታ ቅኝት
                      </span>
                    </div>

                    <div className="space-y-4">
                      <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-1">
                        <span className="text-[10px] font-bold text-amber-900 uppercase tracking-wider block">CODE / NOTATION</span>
                        <div className="font-mono text-sm md:text-base font-bold text-amber-900 space-y-1">
                          <p>23445 133222 5123322111 (2)</p>
                          <p>51233443322 251123333</p>
                          <p>51233443322 251111 451 2333</p>
                        </div>
                      </div>

                      {/* INTERACTIVE STRING NUMBER SIMULATION */}
                      <MezmurNotationPlayer
                        title="ማርያም ፊደል"
                        notationSequence={[2,3,4,4,5, 1,3,3,2,2,2, 5,1,2,3,3,2,2,1,1,1,2,3,4,4,5, 1,3,3,2,2,2, 5,1,2,3,3,2,2,1,1,1, 5,1,2,3,3,4,4,3,3,2,2, 2,5,1,1,2,3,3,3,3, 5,1,2,3,3,4,4,3,3,2,2, 2,5,1,1,1,1, 4,5,1, 2,3,3,3,5,1,2,3,3,4,4,3,3,2,2, 2,5,1,1,2,3,3,3,3, 5,1,2,3,3,4,4,3,3,2,2, 2,5,1,1,1,1, 4,5,1,]}
                        playKrarStringTone={playKrarStringTone}
                      />

                      <div className="p-4 bg-[#FAF6EF] border border-[#E7DED1] rounded-xl space-y-1">
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">LYRICS / ግጥም</span>
                        <div className="text-xs md:text-sm text-gray-800 font-medium leading-relaxed space-y-1">
                          <p>ማርያም ፊደል የሁለም መማሪያ (2)</p>
                          <p>በንጽህና (2) ተጽፋለችና (2)</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* MEZMUR 2: ሰላም ለኢትዮጵያ */}
                  <div className="bg-white border border-[#E7DED1] p-6 rounded-2xl space-y-4 shadow-2xs hover:border-[#6F4E37] transition">
                    <div className="flex flex-wrap justify-between items-center gap-2 border-b border-[#E7DED1] pb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-full bg-[#6F4E37] text-white flex items-center justify-center text-xs font-bold">2</span>
                        <h4 className="font-display font-bold text-lg text-[#2B2B2B]">🔸 ሰላም ለኢትዮጵያ</h4>
                      </div>
                      <span className="px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-mono font-bold">
                        ትዝታ ቅኝት
                      </span>
                    </div>

                    <div className="space-y-4">
                      <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-1">
                        <span className="text-[10px] font-bold text-amber-900 uppercase tracking-wider block">CODE / NOTATION</span>
                        <div className="font-mono text-sm md:text-base font-bold text-amber-900 space-y-1">
                          <p>4511 125544 543245444(2)</p>
                          <p>23332111 24445444 2333211</p>
                          <p>251111 451 2333</p>
                        </div>
                      </div>

                      {/* INTERACTIVE STRING NUMBER SIMULATION */}
                      <MezmurNotationPlayer
                        title="ሰላም ለኢትዮጵያ"
                        notationSequence={[4,5,1,1, 1,2,5,5,4,4, 5,4,3,2,4,5,4,4,4,4,5,1,1, 1,2,5,5,4,4, 5,4,3,2,4,5,4,4,4, 2,3,3,3,2,1,1,1, 2,4,4,4,5,4,4,4, 2,3,3,3,2,1,1, 2,5,1,1,1,1, 4,5,1, 2,3,3,3,2,3,3,3,2,1,1,1, 2,4,4,4,5,4,4,4, 2,3,3,3,2,1,1, 2,5,1,1,1,1, 4,5,1]}
                        playKrarStringTone={playKrarStringTone}
                      />

                      <div className="p-4 bg-[#FAF6EF] border border-[#E7DED1] rounded-xl space-y-1">
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">LYRICS / ግጥም</span>
                        <div className="text-xs md:text-sm text-gray-800 font-medium leading-relaxed space-y-1">
                          <p>ሰላም ለኢትዮጵያ ሰላም ለሀገራችን</p>
                          <p>ይላክልን (2) ቸሩ አምላካችን</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* MEZMUR 3: እግዚአብሔር ይመስገን */}
                  <div className="bg-white border border-[#E7DED1] p-6 rounded-2xl space-y-4 shadow-2xs hover:border-[#6F4E37] transition">
                    <div className="flex flex-wrap justify-between items-center gap-2 border-b border-[#E7DED1] pb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-full bg-[#6F4E37] text-white flex items-center justify-center text-xs font-bold">3</span>
                        <h4 className="font-display font-bold text-lg text-[#2B2B2B]">🔸 እግዚአብሔር ይመስገን</h4>
                      </div>
                      <span className="px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-mono font-bold">
                        ትዝታ ቅኝት
                      </span>
                    </div>

                    <div className="space-y-4">
                      <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-1">
                        <span className="text-[10px] font-bold text-amber-900 uppercase tracking-wider block">CODE / NOTATION</span>
                        <div className="font-mono text-sm md:text-base font-bold text-amber-900 space-y-1">
                          <p>ቁጥሩን በማውጣት በራስዋት ይሞክሩ</p>
                          <p></p>
                        </div>
                      </div>

                      {/* INTERACTIVE STRING NUMBER SIMULATION */}
                      <MezmurNotationPlayer
                        title="እግዚአብሔር ይመስገን"
                        notationSequence={[]}
                        playKrarStringTone={playKrarStringTone}
                      />

                      <div className="p-4 bg-[#FAF6EF] border border-[#E7DED1] rounded-xl space-y-1">
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">LYRICS / ግጥም</span>
                        <div className="text-xs md:text-sm text-gray-800 font-medium leading-relaxed space-y-1">
                          <p>እግዚአብሔር ይመስገን (2)</p>
                          <p>ለዚህ ያደረሰን (2) እግዚአብሔር ይመስገን</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* MEZMUR 4: የፍቅር እናት */}
                  <div className="bg-white border border-[#E7DED1] p-6 rounded-2xl space-y-4 shadow-2xs hover:border-[#6F4E37] transition">
                    <div className="flex flex-wrap justify-between items-center gap-2 border-b border-[#E7DED1] pb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-full bg-[#6F4E37] text-white flex items-center justify-center text-xs font-bold">4</span>
                        <h4 className="font-display font-bold text-lg text-[#2B2B2B]">🔸 የፍቅር እናት</h4>
                      </div>
                      <span className="px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-mono font-bold">
                        ትዝታ ቅኝት
                      </span>
                    </div>

                    <div className="space-y-4">
                      <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-1">
                        <span className="text-[10px] font-bold text-amber-900 uppercase tracking-wider block">CODE / NOTATION</span>
                        <div className="font-mono text-sm md:text-base font-bold text-amber-900 space-y-1">
                          <p>ቁጥሩን በማውጣት በራስዋት ይሞክሩ</p>
                          
                        </div>
                      </div>

                      {/* INTERACTIVE STRING NUMBER SIMULATION */}
                      <MezmurNotationPlayer
                        title="የፍቅር እናት"
                        notationSequence={[]}
                        playKrarStringTone={playKrarStringTone}
                      />

                      <div className="p-4 bg-[#FAF6EF] border border-[#E7DED1] rounded-xl space-y-1">
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">LYRICS / ግጥም</span>
                        <div className="text-xs md:text-sm text-gray-800 font-medium leading-relaxed space-y-1 whitespace-pre-line">
                          {`የፍቅር እናት የሰላም /2/
ይናፍቀኛል ስምሽ ሳልጠራው ስቀር
ማርያም
በህይወቴ ውስጥ በኑሮዬ
ቅደሚ ከፊት ከኋላዬ
ተደላደለ ልቤ
አንቺ አለሽና ካጠገቤ
ምኞቴም ይስመር ትልቅ ህልሜ
ልለፍ ወጀቡን ተቋቁሜ
የጌታዬ እናት ነሽ
ኃይልን ያደርጋል ጸሎትሽ
እንዴት እቀራለሁ ከመንገዴ
አደራ እናቴ አስቢኝ
ከሚያስጨንቀኝ ጠላት
ለሚያሳድደኝ አትስጪኝ
ትላንትም ዛሬም አመስጋኝ ነኝ
የለም ለነገ የሚያስፈራኝ
ሜዳ ይሆናል ተራራ
ልጅሽ ስላለ ከኔ ጋራ`}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* MEZMUR 5: እንደቸርነትህ */}
                  <div className="bg-white border border-[#E7DED1] p-6 rounded-2xl space-y-4 shadow-2xs hover:border-[#6F4E37] transition">
                    <div className="flex flex-wrap justify-between items-center gap-2 border-b border-[#E7DED1] pb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-full bg-[#6F4E37] text-white flex items-center justify-center text-xs font-bold">5</span>
                        <h4 className="font-display font-bold text-lg text-[#2B2B2B]">🔸 እንደቸርነትህ</h4>
                      </div>
                      <span className="px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-mono font-bold">
                        ትዝታ ቅኝት
                      </span>
                    </div>

                    <div className="space-y-4">
                      <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-1">
                        <span className="text-[10px] font-bold text-amber-900 uppercase tracking-wider block">CODE / NOTATION</span>
                        <div className="font-mono text-sm md:text-base font-bold text-amber-900 space-y-1">
                          <p>ቁጥሩን በማውጣት በራስዋት ይሞክሩ</p>
                          
                        </div>
                      </div>

                      {/* INTERACTIVE STRING NUMBER SIMULATION */}
                      <MezmurNotationPlayer
                        title="እንደቸርነትህ"
                        notationSequence={[]}
                        playKrarStringTone={playKrarStringTone}
                      />

                      <div className="p-4 bg-[#FAF6EF] border border-[#E7DED1] rounded-xl space-y-1">
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">LYRICS / ግጥም</span>
                        <div className="text-xs md:text-sm text-gray-800 font-medium leading-relaxed space-y-1 whitespace-pre-line">
                          {`እንደቸርነትህ አቤቱ ማረን (2)
እንደ ምህረትህም ይቅርታን ስጠን (2)
ከኃጢአቴም አንጻር ከ ክፉ በደሌ (2)
ለዚያች ክፉ ኃጢአት እንዳልሆናት ሌላ (2)
እኔስ አበሳዬን በደሌን ሳውቀው (2)
ከቶ የሚያድነኝ ቸርነትህ ነው (2)
አንተን ብቻ በደልኩ ክፉም አደረግኩ (2)
አሁን ይቅር በለኝ ከፊትህ ወደቅኩኝ (2)
ከፊትህ ወድቄ ስለማን አንተን (2)
አሁን ይቅርበለኝ አምላከ ምህረት (2)
አሁን ትባርክንድ ሀገራችንን
ጌታ ሆይ ላክልን መንፈስ ቅዱስን (2)`}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* MEZMUR 6: እውነተኛው ሰላም */}
                  <div className="bg-white border border-[#E7DED1] p-6 rounded-2xl space-y-4 shadow-2xs hover:border-[#6F4E37] transition">
                    <div className="flex flex-wrap justify-between items-center gap-2 border-b border-[#E7DED1] pb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-full bg-[#6F4E37] text-white flex items-center justify-center text-xs font-bold">6</span>
                        <h4 className="font-display font-bold text-lg text-[#2B2B2B]">🔸 እውነተኛው ሰላም</h4>
                      </div>
                      <span className="px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-mono font-bold">
                        ትዝታ ቅኝት
                      </span>
                    </div>

                    <div className="space-y-4">
                      <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-1">
                        <span className="text-[10px] font-bold text-amber-900 uppercase tracking-wider block">CODE / NOTATION</span>
                        <div className="font-mono text-sm md:text-base font-bold text-amber-900 space-y-1">
                          <p>ቁጥሩን በማውጣት በራስዋት ይሞክሩ</p>
                          <p></p>
                        </div>
                      </div>

                      {/* INTERACTIVE STRING NUMBER SIMULATION */}
                      <MezmurNotationPlayer
                        title="እውነተኛው ሰላም"
                        notationSequence={[]}
                        playKrarStringTone={playKrarStringTone}
                      />

                      <div className="p-4 bg-[#FAF6EF] border border-[#E7DED1] rounded-xl space-y-1">
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">LYRICS / ግጥም</span>
                        <div className="text-xs md:text-sm text-gray-800 font-medium leading-relaxed space-y-1 whitespace-pre-line">
                          {`እውነተኛው ሰላም ያለው ከቤትህ ነው(2)
እርዳኝ አልናወጽ እለምንሃለሁ (2)
ኃጢአቴን ሳስበው ልቤ ይጨነቃል
ካንተ መለየቴ ነፍሴን አድክሟታል
ወደ አንተ መልሰኝ እኔ እመለሳለሁ
እውነተኛው ሰላም ያለው ከቤትህ ነው
በቅዱሱ ጸሎት ውትር እንዳልተጋሁ
በአደባባይ ቆሜ ስምህን እንዳልጠራሁ
ተሰነካክዬ ወድቄአለሁና
እርዳኝ አማኑኤል በሃይማኖት ልጽና
ዓይኔም እንባ ያፍስስ ላልቅስ ስለ ኃጢአቴ
ለንስሐ ትሁን ቀሪዋ ህይወቴ
በመዳኔ ሰዓት በዛሬዋ ዕለት
ፍቅርህን አስቤ መጣሁ ካንተ ቤት
ጌታ ሆይ ጸጸቴን እንባዬን ተቀበል
አባትህ(ሽ) ነኝ በለኝ እኔም ልጅ ነኝ ልበል
ሳይት ሳልጋጅ ድንገት መተህብኝ
በርህን በመዝጋት ከደጅ አታስቀረኝ`}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* MEZMUR 7: የልቤን ሁሉ */}
                  <div className="bg-white border border-[#E7DED1] p-6 rounded-2xl space-y-4 shadow-2xs hover:border-[#6F4E37] transition">
                    <div className="flex flex-wrap justify-between items-center gap-2 border-b border-[#E7DED1] pb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-full bg-[#6F4E37] text-white flex items-center justify-center text-xs font-bold">7</span>
                        <h4 className="font-display font-bold text-lg text-[#2B2B2B]">🔸 የልቤን ሁሉ</h4>
                      </div>
                      <span className="px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-mono font-bold">
                        ትዝታ ቅኝት
                      </span>
                    </div>

                    <div className="space-y-4">
                      <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-1">
                        <span className="text-[10px] font-bold text-amber-900 uppercase tracking-wider block">CODE / NOTATION</span>
                        <div className="font-mono text-sm md:text-base font-bold text-amber-900 space-y-1">
                          <p>ቁጥሩን በማውጣት በራስዋት ይሞክሩ</p>
                          <p></p>
                        </div>
                      </div>

                      {/* INTERACTIVE STRING NUMBER SIMULATION */}
                      <MezmurNotationPlayer
                        title="የልቤን ሁሉ"
                        notationSequence={[]}
                        playKrarStringTone={playKrarStringTone}
                      />

                      <div className="p-4 bg-[#FAF6EF] border border-[#E7DED1] rounded-xl space-y-1">
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">LYRICS / ግጥም</span>
                        <div className="text-xs md:text-sm text-gray-800 font-medium leading-relaxed space-y-1 whitespace-pre-line">
                          {`የልቤን ሁሉ ለማን ላማክር
የልቤን ሁሉ ለማን ላማክር
እመቤቴ ሆይ ከአንቺ በቀር
የደካማው ሰው መጠጊያ እኮነሽ
ሃን ጭንቀቴን የምረሳብሽ
ቅዱሳን አበው አንቺን መረጡ /2/
ከሲኦል ዓለም ስላመለጡ
ጻድቅ በስራው ያኔ ሲድን/2/
እጠራሻለሁ ድንግል አንቺን
የጭንቄ ደራሽ አክኪላ ነሽ/2/
ቂም በቀል አያውቅ የዋህ ልብሽ
ልቤ ለፍቅርሽ ሰፊ ስፍራ አለው /2/
በአንኩኝ ሰዓት እጠራሻለሁ
ዋሴ ነሽ ለእኔ ድንግል እናቴ/2/
ስምሽጠበቀኝ ከልጅነቴ
ሁልጊዜ ለእኔ በጎ ያረግሽልኝ/2/
ምን ልበል ለአንቺ ቃላት የለኝ
ለአንኩኝ ለእኔ ደስታዬ ነሽ/2/
ያረጋጋሽኝ ፈጥነሽ ደርሰሽ
ስምሽ ኃጥአንን የሚቀድስ/2/
ከሞት ወደ ህይወት የሚመልስ
የመንገዴ ስንቅ የርሃቤ መርሻ/2/
ለታመመ ሰው ነሽ መፈወሻ
የተማጸነ በስምሽ አምኖ/2/
ማን አፍሮ ያውቃል አንቺን ለምኖ`}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              {/* NEXT & PREVIOUS BUTTONS */}
              {renderChapterNavFooter('chapter-4')}
            </div>
          )}

          {/* ---------------- CHAPTER 5: ቸርነት/አንቺሆዬ ቅኝት ---------------- */}
          {activeSubTab === 'chapter-5' && (
            <div className="bg-white border border-[#E7DED1] p-6 md:p-8 rounded-3xl space-y-8 shadow-2xs">
              <div className="border-b border-[#E7DED1] pb-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <span className="px-3 py-1 bg-[#6F4E37] text-white rounded-lg text-xs font-bold uppercase tracking-wide">
                    ቤሲክ አንድ • CHAPTER 5
                  </span>
                  <h2 className="text-xl sm:text-2xl font-display font-black text-[#2B2B2B] mt-2">
                    ምዕራፍ አምስት : ቸርነት / አንቺሆዬ ቅኝት
                  </h2>
                  <p className="text-xs text-gray-600 mt-1">
                    የቸርነት/አንቺሆዬ ቅኝት አመሰራረት እና በቅኝቱ ላይ ያሉ የዝርዝር መዝሙራት ግጥሞች
                  </p>
                </div>

                <div className="bg-amber-100 border border-amber-300 px-4 py-2 rounded-2xl shrink-0 text-right">
                  <span className="text-[10px] font-bold text-amber-800 uppercase block">TUNING SCALE</span>
                  <span className="text-sm font-black text-amber-950 font-display">📍 ቸርነት / አንቺሆዬ</span>
                </div>
              </div>

              {/* 🔹 ቅኝት አመሰራረት */}
              <div className="border border-[#E7DED1] bg-amber-50/50 p-6 rounded-2xl space-y-4">
                <div className="flex items-center gap-2 text-base font-bold text-[#6F4E37] border-b border-amber-200/80 pb-2">
                  <span className="text-amber-700 font-black text-lg">🔹</span>
                  <h3 className="font-display font-bold text-lg text-[#2B2B2B]">ቅኝት አመሰራረት (Cherenet / Anchihoye Tuning Scale)</h3>
                </div>
                <p className="text-xs md:text-sm text-gray-700 leading-relaxed">
                  Unlike ትዝታ ቅኝት፣ የቸርነት (አንቺሆዬ) ቅኝት በሚከተለው የአውታሮችና የድምፅ ቅደም ተከተል ይዋቀራል (Use this exact sequence):
                </p>

                <div className="p-4 bg-white border border-amber-200 rounded-2xl shadow-2xs space-y-3">
                  <span className="text-xs font-bold text-[#6F4E37] uppercase tracking-wider block">
                    የቸርነት/አንቺሆዬ ቅኝት አውታሮችና የተመደቡላቸው ቁጥሮች (String Assignments):
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl flex items-center justify-between">
                      <span className="text-xs font-bold text-[#6F4E37]">String 5</span>
                      <span className="text-xs font-mono font-bold text-amber-950 bg-amber-200/80 px-2 py-0.5 rounded">Assigned Number 1 → C</span>
                    </div>
                    <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl flex items-center justify-between">
                      <span className="text-xs font-bold text-[#6F4E37]">String 1</span>
                      <span className="text-xs font-mono font-bold text-amber-950 bg-amber-200/80 px-2 py-0.5 rounded">Assigned Number 2 → C#</span>
                    </div>
                    <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl flex items-center justify-between">
                      <span className="text-xs font-bold text-[#6F4E37]">String 2</span>
                      <span className="text-xs font-mono font-bold text-amber-950 bg-amber-200/80 px-2 py-0.5 rounded">Assigned Number 3 → F</span>
                    </div>
                    <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl flex items-center justify-between">
                      <span className="text-xs font-bold text-[#6F4E37]">String 3</span>
                      <span className="text-xs font-mono font-bold text-amber-950 bg-amber-200/80 px-2 py-0.5 rounded">Assigned Number 4 → F#</span>
                    </div>
                    <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl flex items-center justify-between">
                      <span className="text-xs font-bold text-[#6F4E37]">String 4</span>
                      <span className="text-xs font-mono font-bold text-amber-950 bg-amber-200/80 px-2 py-0.5 rounded">Assigned Number 5 → A</span>
                    </div>
                    <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl flex items-center justify-between">
                      <span className="text-xs font-bold text-[#6F4E37]">String 6</span>
                      <span className="text-xs font-mono font-bold text-amber-950 bg-amber-200/80 px-2 py-0.5 rounded">Assigned Number 6 → C in Octave</span>
                    </div>
                  </div>
                </div>

                {/* 🎵 INTERACTIVE VIRTUAL KRAR SIMULATOR FOR CHERENET / ANCHIHOYE */}
                <KrarScaleSimulatorBoard
                  scaleKey="anchihoye"
                  title="የቸርነት/አንቺሆዬ ቅኝት ድምፅ ማዳመጫ (Cherenet Scale Simulator)"
                  subtitle="በቸርነት ቅኝት የተቀኙትን 6ቱ አውታሮች ድምፅ አዳምጡ ወይም «▶ ቅኝቱን አጫውት» የሚለውን ቁልፍ ይጫኑ"
                  playKrarStringTone={playKrarStringTone}
                  pluckedStringIndex={pluckedStringIndex}
                  playScaleSequence={playScaleSequence}
                  isPlayingSequence={isPlayingSequence}
                />
              </div>

              {/* 🔹 ቸርነት/አንቺሆዬ ቅኝት ላይ ያሉ መዝሙሮች */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-base font-bold text-[#6F4E37] border-b border-[#E7DED1] pb-3">
                  <span className="text-amber-700 text-lg font-black">🔹</span>
                  <h3 className="font-display font-bold text-lg text-[#2B2B2B]">ቸርነት/አንቺሆዬ ቅኝት ላይ ያሉ መዝሙሮች (7 Mezmurs)</h3>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  {/* MEZMUR 1: በቃና ዘገሊላ */}
                  <div className="bg-white border border-[#E7DED1] p-6 rounded-2xl space-y-4 shadow-2xs hover:border-[#6F4E37] transition">
                    <div className="flex flex-wrap justify-between items-center gap-2 border-b border-[#E7DED1] pb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-full bg-[#6F4E37] text-white flex items-center justify-center text-xs font-bold">1</span>
                        <h4 className="font-display font-bold text-lg text-[#2B2B2B]">🔸 በቃና ዘገሊላ</h4>
                      </div>
                      <span className="px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-mono font-bold">
                        ቸርነት/አንቺሆዬ ቅኝት
                      </span>
                    </div>
                    <div className="p-4 bg-[#FAF6EF] border border-[#E7DED1] rounded-xl space-y-1">
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">LYRICS / ግጥም</span>
                      <div className="text-xs md:text-sm text-gray-800 font-medium leading-relaxed space-y-1 whitespace-pre-line">
{`በቃና ገሊላ 
በቃና ገሊላ (2) 
ገሊላ ከብካበ ኮነ (2)
እዩና እመኑ ሰዎች`}
                      </div>
                    </div>
                  </div>

                  {/* MEZMUR 2: እዩና ዕመኑ ሰዎች */}
                  <div className="bg-white border border-[#E7DED1] p-6 rounded-2xl space-y-4 shadow-2xs hover:border-[#6F4E37] transition">
                    <div className="flex flex-wrap justify-between items-center gap-2 border-b border-[#E7DED1] pb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-full bg-[#6F4E37] text-white flex items-center justify-center text-xs font-bold">2</span>
                        <h4 className="font-display font-bold text-lg text-[#2B2B2B]">🔸 እዩና ዕመኑ ሰዎች</h4>
                      </div>
                      <span className="px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-mono font-bold">
                        ቸርነት/አንቺሆዬ ቅኝት
                      </span>
                    </div>
                    <div className="p-4 bg-[#FAF6EF] border border-[#E7DED1] rounded-xl space-y-1">
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">LYRICS / ግጥም</span>
                      <div className="text-xs md:text-sm text-gray-800 font-medium leading-relaxed space-y-1 whitespace-pre-line">
{`እዩና ዕመኑ ሰዎች 

 እዩና ዕመኑ ሰዎች 
 ድንጋዩ ሳይፈነቀል
 ኢየሱስ በእኩለ ሌሊት
 በኃይሉ ሞትን ድል ነስቷል/2/ 
ዕልልታ ለዚህ ይገባል 
ግርግርታ ለዚህ ይገባል
የሞት ኃይል ተዋርዷል ዛሬ 
ሲኦልም ተመሰቃቅሏል /2/ 

 መላእክቱ ነጭ ለብሰው 
 ምስራቹን አበሰሩ
 ተነስቷል ኢየሱስ ብለው
 ለዓለም እንዲናገሩ/2/ 
ዕልልታ ለዚህ ይገባል 
ግርግርታ ለዚህ ይገባል
የሞት ኃይል ተዋርዷል ዛሬ 
ሲኦልም ተመሰቃቅሏል /2/`}
                      </div>
                    </div>
                  </div>

                  {/* MEZMUR 3: አማን በአማን */}
                  <div className="bg-white border border-[#E7DED1] p-6 rounded-2xl space-y-4 shadow-2xs hover:border-[#6F4E37] transition">
                    <div className="flex flex-wrap justify-between items-center gap-2 border-b border-[#E7DED1] pb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-full bg-[#6F4E37] text-white flex items-center justify-center text-xs font-bold">3</span>
                        <h4 className="font-display font-bold text-lg text-[#2B2B2B]">🔸 አማን በአማን</h4>
                      </div>
                      <span className="px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-mono font-bold">
                        ቸርነት/አንቺሆዬ ቅኝት
                      </span>
                    </div>
                    <div className="p-4 bg-[#FAF6EF] border border-[#E7DED1] rounded-xl space-y-1">
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">LYRICS / ግጥም</span>
                      <div className="text-xs md:text-sm text-gray-800 font-medium leading-relaxed space-y-1 whitespace-pre-line">
{`አማን በአማን (4)
አማኑኤል ተመስገን ለዚህ ፍቅርህ ምን
ልክፈልህ (2)
 ድብቁን ኃጢአት አንተ ብትገልጸው
 ይቅር ብለኸኝ ባትሸፋፍነው
 እንደ ሰው በቀል ቢኖር ጌታ
 ለኔ ኃጢአትስ የለውም ቦታ
በየደቂቃው ኃጢአት ስሰራ
ስሰርቅ ስበድል አንተን ሳልፈራ
አንተ ግን ፊትህ ምንም ቢቀየም
በቁጣህ በትር አልገረፍከኝም
 ምህረትህን ልከህ አድነኝ ዛሬ
 ታክቶኛልና በኃጢአት መኖሬ
 ዓለም በኃጢአት እየሳበችኝ
 በጽድቅ ደስታ መኖር አቃተኝ
የኃጢአት ጉዞ ጣፋጭ ቢመስልም
ውጤቱ መሮ ፍጹም አይጥምም
እንደ በደሌ ስላልከፈልከኝ
ተመስገን እንጂ ሌላ ምን አለኝ`}
                      </div>
                    </div>
                  </div>

                  {/* MEZMUR 4: ሀይሌ ብርታቴ */}
                  <div className="bg-white border border-[#E7DED1] p-6 rounded-2xl space-y-4 shadow-2xs hover:border-[#6F4E37] transition">
                    <div className="flex flex-wrap justify-between items-center gap-2 border-b border-[#E7DED1] pb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-full bg-[#6F4E37] text-white flex items-center justify-center text-xs font-bold">4</span>
                        <h4 className="font-display font-bold text-lg text-[#2B2B2B]">🔸 ሀይሌ ብርታቴ</h4>
                      </div>
                      <span className="px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-mono font-bold">
                        ቸርነት/አንቺሆዬ ቅኝት
                      </span>
                    </div>
                    <div className="p-4 bg-[#FAF6EF] border border-[#E7DED1] rounded-xl space-y-1">
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">LYRICS / ግጥም</span>
                      <div className="text-xs md:text-sm text-gray-800 font-medium leading-relaxed space-y-1 whitespace-pre-line">
{`ሀይሌ ብርታቴ ክብሬ ሞገሴ/፪/
የዓለሙ የአብርሃሙ ሥላሴ/፪/

 ተመረጠች ነፍሴ አንተን በማወደስ
 ከላይ ከአርያም ከሥላሴ መቅደስ
 በአንድነት ሶስትነት በዙፋኑ ሞልቶ
 የሚሳነው የለም ለሥላሴ ከቶ
ከመንገድ ዳር ልቁም የወደቀ ላንሳ
የተራበ ላብላ የታመመ አልርሳ
እንደ አብርሃም አርገኝ እንደ ደጉ አባት
ቤቴ እንዲሞላ በአንተ በረከት

 ጠፈሩን በውሃ በጥበብ የሰራ
 እኔስ ይገርመኛል የሥላሴ ስራ
 ኑና ተመልከቱ ታምራት ሲሰራ
 ሰዎች እልል በሉ ወላድ ሆነች ሣራ
አብ አንድያ ልጁን እስኪሰጥ ወዶናል
ወልድ በተዋህዶ እኛንም መስሎናል
ሀይሉ ተገለጠ የመንፈስ ቅዱስ
በቅዱሳን አድሮ ሲያድን ሲፈውስ`}
                      </div>
                    </div>
                  </div>

                  {/* MEZMUR 5: ስምህ በሁሉ */}
                  <div className="bg-white border border-[#E7DED1] p-6 rounded-2xl space-y-4 shadow-2xs hover:border-[#6F4E37] transition">
                    <div className="flex flex-wrap justify-between items-center gap-2 border-b border-[#E7DED1] pb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-full bg-[#6F4E37] text-white flex items-center justify-center text-xs font-bold">5</span>
                        <h4 className="font-display font-bold text-lg text-[#2B2B2B]">🔸 ስምህ በሁሉ</h4>
                      </div>
                      <span className="px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-mono font-bold">
                        ቸርነት/አንቺሆዬ ቅኝት
                      </span>
                    </div>
                    <div className="p-4 bg-[#FAF6EF] border border-[#E7DED1] rounded-xl space-y-1">
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">LYRICS / ግጥም</span>
                      <div className="text-xs md:text-sm text-gray-800 font-medium leading-relaxed space-y-1 whitespace-pre-line">
{`ስምህ በሁሉ ተመሰገነ
ከክብር በላይ ክብርህ ገነነ
አንተን ማወደስ ደስ ይለናል
ስምህን ማክበር ክብራችን ሆኗል(፪) 
አምላክ ተመስገን በሰማያት
ስምህ ይወደስ በፍጥረታት
ከህፃናት አፍ ምስጋና ይውጣ
አንተን ማመስገን ይሁን የኛ ዕጣ(፪) 
በምግብ እጦት ብንሰቃይም
ማህሌትህን አናቋርጥም
የመከራ ደፍ ቢወርድብንም
እንዘምራለን ለአምላካችን ስም(፪) 
ሰማዩ ዝናብ ደመና ቢያጣም
ፍቅርህ በእኛ ውስጥ አላቋረጠም
ቸርነትህን እንጠብቃለን
 ከአንተ ደጅ ጌታ የት እንሄዳለን(፪)`}
                      </div>
                    </div>
                  </div>

                  {/* MEZMUR 6: በጎ መዓዛ */}
                  <div className="bg-white border border-[#E7DED1] p-6 rounded-2xl space-y-4 shadow-2xs hover:border-[#6F4E37] transition">
                    <div className="flex flex-wrap justify-between items-center gap-2 border-b border-[#E7DED1] pb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-full bg-[#6F4E37] text-white flex items-center justify-center text-xs font-bold">6</span>
                        <h4 className="font-display font-bold text-lg text-[#2B2B2B]">🔸 በጎ መዓዛ</h4>
                      </div>
                      <span className="px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-mono font-bold">
                        ቸርነት/አንቺሆዬ ቅኝት
                      </span>
                    </div>
                    <div className="p-4 bg-[#FAF6EF] border border-[#E7DED1] rounded-xl space-y-1">
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">LYRICS / ግጥም</span>
                      <div className="text-xs md:text-sm text-gray-800 font-medium leading-relaxed space-y-1 whitespace-pre-line">
{`በጎ መዓዛ ሽቶዬ ነሽ
በሰው ሁሉ ፊት መርኩሌሽ
ባንቺ ጣፈጠ አልጫነቴ
እጠራሻለሁ ነይ እመቤቴ
ምሳሌ የሌለሽ ነይ .. መዳ ነሽ ነይ .. 
ያን ክፉ መን ነይ .. ያለፍኩብሽ ነይ .. 
በፍቅርሽ እሳት ነይ .. ልቤ ነደደ ነይ .. 
እናትነትሽን ነይ .. ስለወደደ ነይ ..
(አዝ)
የሰውስ ጉልበት ነይ .. ምን ይረባኛል ነይ 
ሰረገላዬ ነይ .. መቼ ያድነኛል ነይ ..
ከተሰወረ ነይ .. ክፉ መከራ ነይ ..
እድናለሁኝ ነይ .. አንቺን ስጠራ ነይ ..
(አዝ)
ለስንፍናዬስ ነይ .. መቼ ልክ አለው ነይ 
ስለ በደሌ ነይ .. እተክዛለሁ ነይ ..
ለአነጋገሬ ነይ .. ማጣፈጫ ነሽ ነይ ..
ተሰምቻለሁ ነይ .. ድንግል ሆይ ስልሽ ነይ ..
(አዝ)
ለመንገዴ ስንቅ ነይ .. ለርሃቤ መርሻ ነይ ..
ለታመመ ሰው ነይ .. ነሽ መፈወሻ ነይ ..
የተማጸነ ነይ .. በስምሽ አምኖ ነይ ..
ማን አፍሮ ያውቃል ነይ .. ፊትሽ ለምኖ
(አዝ)
ለስንፍናዬስ ነይ .. መቼ ልክ አለው ነይ 
ስለ በደሌ ነይ .. እተክዛለሁ ነይ ..
ለአነጋገሬ ነይ .. ማጣፈጫ ነሽ ነይ ..
ተሰምቻለሁ ነይ .. ድንግል ሆይ ስልሽ ነይ`}
                      </div>
                    </div>
                  </div>

                  {/* MEZMUR 7: ለምትጠራኝ ላንተ */}
                  <div className="bg-white border border-[#E7DED1] p-6 rounded-2xl space-y-4 shadow-2xs hover:border-[#6F4E37] transition">
                    <div className="flex flex-wrap justify-between items-center gap-2 border-b border-[#E7DED1] pb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-full bg-[#6F4E37] text-white flex items-center justify-center text-xs font-bold">7</span>
                        <h4 className="font-display font-bold text-lg text-[#2B2B2B]">🔸 ለምትጠራኝ ላንተ</h4>
                      </div>
                      <span className="px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-mono font-bold">
                        ቸርነት/አንቺሆዬ ቅኝት
                      </span>
                    </div>
                    <div className="p-4 bg-[#FAF6EF] border border-[#E7DED1] rounded-xl space-y-1">
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">LYRICS / ግጥም</span>
                      <div className="text-xs md:text-sm text-gray-800 font-medium leading-relaxed space-y-1 whitespace-pre-line">
{`ለምትጠራኝ ላንተ እምቢ እንዳልል እኔ
ማስተዋል አድለኝ በህይወት መኔ
መክረህ አስተምረህ ፍቅር የገለጽክልኝ
የሰማሁትን ቃል ለህይወት አርግልኝ
ለምትጠራኝ ላንተ ሀጢአቴን በሙሉ ባንተፊት ጥያለሁ
ለምትጠራኝ ላንተ በደሌን ክፍቴን እኔ እናዘዛለሁ
ለምትጠራኝ ላንተ የማነጋኝ ነህ በመኔ ሁሉ
ለምትጠራኝ ላንተ ማረኝ ይቅር በለኝ ይብቃኝ መበደሉ
ለምትጠራኝ ላንተ ከአፍህ የወጣው ቃል ያረሰርሰኛል
ለምትጠራኝ ላንተ ህግህን አድምጬ የህይወት ሆኖልኛል
ለምትጠራኝ ላንተ እንደአንበሳ አድብቷል ያክፉ ጠላቴ
ለምትጠራኝ ላንተ ከልቤ እንዳይነቅለው ጠብቀኝ አባቴ
ለምትጠራኝ ላንተ ወጀብ ቢያልብኝ ቢከብደኝ ፈተና
ለምትጠራኝ ላንተ አምላኬ ያንተ ምክር ትጸናለች እና
ለምትጠራኝ ላንተ ጌታውን የጠበቀ ይከብራል ብለሃል`}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* NEXT & PREVIOUS BUTTONS */}
              {renderChapterNavFooter('chapter-5')}
            </div>
          )}

          {/* ---------------- CHAPTER 6: ባቲ ቅኝት ---------------- */}
          {activeSubTab === 'chapter-6' && (
            <div className="bg-white border border-[#E7DED1] p-6 md:p-8 rounded-3xl space-y-8 shadow-2xs">
              <div className="border-b border-[#E7DED1] pb-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <span className="px-3 py-1 bg-[#6F4E37] text-white rounded-lg text-xs font-bold uppercase tracking-wide">
                    ቤሲክ አንድ • CHAPTER 6
                  </span>
                  <h2 className="text-xl sm:text-2xl font-display font-black text-[#2B2B2B] mt-2">
                    ምዕራፍ ስድስት : ባቲ ቅኝት
                  </h2>
                  <p className="text-xs text-gray-600 mt-1">
                    የባቲ ቅኝት አመሰራረት እና በቅኝቱ ላይ ያሉ የዝርዝር መዝሙራት ግጥሞች
                  </p>
                </div>

                <div className="bg-amber-100 border border-amber-300 px-4 py-2 rounded-2xl shrink-0 text-right">
                  <span className="text-[10px] font-bold text-amber-800 uppercase block">TUNING SCALE</span>
                  <span className="text-sm font-black text-amber-950 font-display">📍 ባቲ ቅኝት</span>
                </div>
              </div>

              {/* 🔹 ቅኝት አመሰራረት */}
              <div className="border border-[#E7DED1] bg-amber-50/50 p-6 rounded-2xl space-y-5">
                <div className="flex items-center gap-2 text-base font-bold text-[#6F4E37] border-b border-amber-200/80 pb-2">
                  <span className="text-amber-700 font-black text-lg">🔹</span>
                  <h3 className="font-display font-bold text-lg text-[#2B2B2B]">ቅኝት አመሰራረት (Bati Tuning Scale)</h3>
                </div>
                <p className="text-xs md:text-sm text-gray-700 leading-relaxed">
                  Unlike ትዝታ ቅኝት፣ የባቲ ቅኝት በሚከተለው የአውታሮችና የድምፅ ቅደም ተከተል ይዋቀራል (Use this exact sequence):
                </p>

                {/* STRINGS NUMERICAL ASSIGNMENTS GRID */}
                <div className="p-4 bg-white border border-amber-200 rounded-2xl shadow-2xs space-y-3">
                  <span className="text-xs font-bold text-[#6F4E37] uppercase tracking-wider block">
                    የባቲ ቅኝት አውታሮችና የተመደቡላቸው ቁጥሮች (String Assignments):
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl flex items-center justify-between">
                      <span className="text-xs font-bold text-[#6F4E37]">String 5</span>
                      <span className="text-xs font-mono font-bold text-amber-950 bg-amber-200/80 px-2 py-0.5 rounded">Assigned Number 1 → C</span>
                    </div>
                    <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl flex items-center justify-between">
                      <span className="text-xs font-bold text-[#6F4E37]">String 1</span>
                      <span className="text-xs font-mono font-bold text-amber-950 bg-amber-200/80 px-2 py-0.5 rounded">Assigned Number 2 → E</span>
                    </div>
                    <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl flex items-center justify-between">
                      <span className="text-xs font-bold text-[#6F4E37]">String 2</span>
                      <span className="text-xs font-mono font-bold text-amber-950 bg-amber-200/80 px-2 py-0.5 rounded">Assigned Number 3 → F</span>
                    </div>
                    <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl flex items-center justify-between">
                      <span className="text-xs font-bold text-[#6F4E37]">String 3</span>
                      <span className="text-xs font-mono font-bold text-amber-950 bg-amber-200/80 px-2 py-0.5 rounded">Assigned Number 4 → G</span>
                    </div>
                    <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl flex items-center justify-between">
                      <span className="text-xs font-bold text-[#6F4E37]">String 4</span>
                      <span className="text-xs font-mono font-bold text-amber-950 bg-amber-200/80 px-2 py-0.5 rounded">Assigned Number 5 → B</span>
                    </div>
                    <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl flex items-center justify-between">
                      <span className="text-xs font-bold text-[#6F4E37]">String 6</span>
                      <span className="text-xs font-mono font-bold text-amber-950 bg-amber-200/80 px-2 py-0.5 rounded">Assigned Number 6 → C in Octave</span>
                    </div>
                  </div>
                </div>

                {/* 🎵 INTERACTIVE VIRTUAL KRAR SIMULATOR FOR BATI */}
                <KrarScaleSimulatorBoard
                  scaleKey="bati"
                  title="የባቲ ቅኝት ድምፅ ማዳመጫ (Bati Scale Simulator)"
                  subtitle="በባቲ ቅኝት የተቀኙትን 6ቱ አውታሮች ድምፅ አዳምጡ ወይም «▶ ቅኝቱን አጫውት» የሚለውን ቁልፍ ይጫኑ"
                  playKrarStringTone={playKrarStringTone}
                  pluckedStringIndex={pluckedStringIndex}
                  playScaleSequence={playScaleSequence}
                  isPlayingSequence={isPlayingSequence}
                />
              </div>

              {/* 🔹 ባቲ ቅኝት ላይ ያሉ መዝሙሮች */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-base font-bold text-[#6F4E37] border-b border-[#E7DED1] pb-3">
                  <span className="text-amber-700 text-lg font-black">🔹</span>
                  <h3 className="font-display font-bold text-lg text-[#2B2B2B]">ባቲ ቅኝት ላይ ያሉ መዝሙሮች (7 Mezmurs)</h3>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  {/* MEZMUR 1: በመኑ */}
                  <div className="bg-white border border-[#E7DED1] p-6 rounded-2xl space-y-4 shadow-2xs hover:border-[#6F4E37] transition">
                    <div className="flex flex-wrap justify-between items-center gap-2 border-b border-[#E7DED1] pb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-full bg-[#6F4E37] text-white flex items-center justify-center text-xs font-bold">1</span>
                        <h4 className="font-display font-bold text-lg text-[#2B2B2B]">🔸 በመኑ</h4>
                      </div>
                      <span className="px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-mono font-bold">
                        ባቲ ቅኝት
                      </span>
                    </div>
                    <div className="p-4 bg-[#FAF6EF] border border-[#E7DED1] rounded-xl space-y-1">
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">LYRICS / ግጥም</span>
                      <div className="text-xs md:text-sm text-gray-800 font-medium leading-relaxed space-y-1 whitespace-pre-line">
{`በመኑ በአምሳለ መኑ ናስተማስለኪ
እመቤቴ የኝ አማላጅ አዙኝቱ ኦ ድንግል
ምልዕተ ዉዱሴ`}
                      </div>
                    </div>
                  </div>

                  {/* MEZMUR 2: የሥላሴን መንበር */}
                  <div className="bg-white border border-[#E7DED1] p-6 rounded-2xl space-y-4 shadow-2xs hover:border-[#6F4E37] transition">
                    <div className="flex flex-wrap justify-between items-center gap-2 border-b border-[#E7DED1] pb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-full bg-[#6F4E37] text-white flex items-center justify-center text-xs font-bold">2</span>
                        <h4 className="font-display font-bold text-lg text-[#2B2B2B]">🔸 የሥላሴን መንበር</h4>
                      </div>
                      <span className="px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-mono font-bold">
                        ባቲ ቅኝት
                      </span>
                    </div>
                    <div className="p-4 bg-[#FAF6EF] border border-[#E7DED1] rounded-xl space-y-1">
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">LYRICS / ግጥም</span>
                      <div className="text-xs md:text-sm text-gray-800 font-medium leading-relaxed space-y-1 whitespace-pre-line">
{`የሥላሴን መንበር ቅዱሳን ከበውት
ኪሩቤል በደመና ዙፋኑን ይውት
ድንግልን ከመሐል ሚካኤልን ከፊት
አእላፍ መላእክት ሲሰግዱ በፍርሃት
እዩት ተመልከቱት የሰማዩን ድምቀት/2/ 
የሥላሴን መንበር ቅዱሳን ከበውት
እያሸበሸቡ የሰማይ መላእክት
ካህናተ ሰማይ ሥሉስ ቅዱስ ሲሉት
ይህን ታላቅ ክብር ሊያዩ የታደሉ
በጽድቅ ሥራቸው በምድር ይታያሉ/2/ 
የቅደሳን ሕብረት የቅዱሳን ሀገር
ሲያወደስ ይኖራል የሥላሴን መንበር
ጽድቅና ርህራሄ የተሞላች ሰማይ
እግዚአብሔር ያደለን በትንሣኤ እንድናይ/3/`}
                      </div>
                    </div>
                  </div>

                  {/* MEZMUR 3: ስምሽን ስጠራው */}
                  <div className="bg-white border border-[#E7DED1] p-6 rounded-2xl space-y-4 shadow-2xs hover:border-[#6F4E37] transition">
                    <div className="flex flex-wrap justify-between items-center gap-2 border-b border-[#E7DED1] pb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-full bg-[#6F4E37] text-white flex items-center justify-center text-xs font-bold">3</span>
                        <h4 className="font-display font-bold text-lg text-[#2B2B2B]">🔸 ስምሽን ስጠራው</h4>
                      </div>
                      <span className="px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-mono font-bold">
                        ባቲ ቅኝት
                      </span>
                    </div>
                    <div className="p-4 bg-[#FAF6EF] border border-[#E7DED1] rounded-xl space-y-1">
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">LYRICS / ግጥም</span>
                      <div className="text-xs md:text-sm text-gray-800 font-medium leading-relaxed space-y-1 whitespace-pre-line">
{`ስምሽን ስጠራው ድንግል
ስምሽን ስጠራው ማርያም
ለአንደበቴ ማር ነው ለልቤ ሰላም
ስምሽን ስጠራው ማርያም
ትውልድ ነኝና ልጅሽ የፈጠረኝ
ድንግል እመቤቴ ላንቺ ምስጋና
አለኝ
በፈቃደ እግዚአብሔር ባባቶቼ ፀጋ
ሳዓሊ ለነ እላለው ሲመሽም ሲነጋ
በጠየቅሽው ጊዜ ወይኑን እንዲሞላ
አክብሮሻልና በቃና ገሊላ
የሰላም እናት ሆይ ሰላም ልበልሽ
መኔ ይፈፀም ሳመሰግንሽ
በሰላምታ ድምፅሽ መንፈስ ተመልቼ
አደግድጌ ልቁም እጆቼን ርግቼ
በአብይ ቃሌ ጮሄ ልመስክር በብርቱ
ቅድስት ድንግል ማርያም
የእግዚአብሔር እናቱ
ከሰማይ ሲገኝ ነው አንችን ማወደስ
ሲገደጥ ሲፈቀድ ከመንፈስ ቅዱስ
ማርያም ህይወቴ ነሽ ምክንያት ለመዳኔ
ብዙ ነው ምስጢሩ አንችን ማመስገኔ`}
                      </div>
                    </div>
                  </div>

                  {/* MEZMUR 4: ገብርኤል በሰማይ */}
                  <div className="bg-white border border-[#E7DED1] p-6 rounded-2xl space-y-4 shadow-2xs hover:border-[#6F4E37] transition">
                    <div className="flex flex-wrap justify-between items-center gap-2 border-b border-[#E7DED1] pb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-full bg-[#6F4E37] text-white flex items-center justify-center text-xs font-bold">4</span>
                        <h4 className="font-display font-bold text-lg text-[#2B2B2B]">🔸 ገብርኤል በሰማይ</h4>
                      </div>
                      <span className="px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-mono font-bold">
                        ባቲ ቅኝት
                      </span>
                    </div>
                    <div className="p-4 bg-[#FAF6EF] border border-[#E7DED1] rounded-xl space-y-1">
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">LYRICS / ግጥም</span>
                      <div className="text-xs md:text-sm text-gray-800 font-medium leading-relaxed space-y-1 whitespace-pre-line">
{`ገብርኤል በሰማይ ኤልሳብ በምድር 
ገብርኤል በሰማይ ኤልሳብ በምድር
ይመሰክራሉ ድንግል ያንቺን ክብር
አዝ
ትፀንሺ ሲልሽ በከበረ ዜና
ይሁንልኝ አልሽው ትውልድ እንዲፅናና
ከገብርኤል ሰምተው መላእክቱ ሁሉ
ለበጉ ማደሪያ ክብርን ይሰጣሉ
ብፅይት እንላለን እኛም አደግድገን
የራማውን ልዑል አብነት አድርገን
አዝ
ስምሽ በምድር ነው ሐረግሽ በሰማይ
ንፁህ መሰቦ ወርቅ የተሞላች ሲሳይ
የማኅፀንሽን ፍሬ በላነው ጠጣነው
በኤፍራታ ሰምተን በዱር አገኘነው
የተሰወረውን መና በልተነዋል
ከተመረጡት ጋር ብፅይት ብለናል
አዝ
ከተፈጥሮ በላይ ፅንስን ያለሌ
የእሳት ምስሶ ባንቺ ተተከለ
የእግዚአብሔር ሀገሩ የእንጀራ ቤታችን
ምንኛ ድንቅ ነው ክብርሽ እናታችን
አዝ
ተወልዶ በግርግም ተኝቶ ስላዩት
ሰውና መላዕክት አብረው አከበሩት
የጥሉ ግድግዳ በልጅሽ ፈረሰ
በዳግማዊት ሔዋን የአዳም ር ተካሰ ፡፡
እጅ እንነሳለን ሆነን በትህትና
ክብርሽን መመስከር ክብራችን ነውና`}
                      </div>
                    </div>
                  </div>

                  {/* MEZMUR 5: አለ ለኔ */}
                  <div className="bg-white border border-[#E7DED1] p-6 rounded-2xl space-y-4 shadow-2xs hover:border-[#6F4E37] transition">
                    <div className="flex flex-wrap justify-between items-center gap-2 border-b border-[#E7DED1] pb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-full bg-[#6F4E37] text-white flex items-center justify-center text-xs font-bold">5</span>
                        <h4 className="font-display font-bold text-lg text-[#2B2B2B]">🔸 አለ ለኔ</h4>
                      </div>
                      <span className="px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-mono font-bold">
                        ባቲ ቅኝት
                      </span>
                    </div>
                    <div className="p-4 bg-[#FAF6EF] border border-[#E7DED1] rounded-xl space-y-1">
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">LYRICS / ግጥም</span>
                      <div className="text-xs md:text-sm text-gray-800 font-medium leading-relaxed space-y-1 whitespace-pre-line">
{`አለ ለኔ የተሻለ ነገር(፪) 
ዛሬን ባዝን ለጊዜው ብቸገር
አለ ለኔ የተሻለ ነገር
በጄ የጨበጥኩት በድንገት ቢበተን
ዙሪያዬን ቢከበኝ ያላሰብኩት ሀን
እንባዬ በደስታ መቀየሩ አይቀርም
እተማመናለው በጌታዬ አልፍርም
ሀብቴን ልጅን ባጣ እርሱ እንደወደደ
የእዮብ መከራ በኔም ከወረደ
እራቁቴን መጣው እንዲሁ ሄዳለው
ከዚህ የላቀውን ከርሱ እጠብቃለው
መከራው ቢከብደኝ ከዙፋን ወርጄ
ከርስቴ ብሰደድ ባቤሴሎም ልጄ
ቀኑ እስከሚነጋ አልፈራም ጨለማ
ዳግም እለብሳለው የጽዮንን ግርማ
አሳዳጄ ብያይል ጉልበቱ ቢጠና
ተግዳሮቱ በዝቶ ወደኔ ቢያቀና
የከበረው ድንጋይ አለ በወንጭፌ
እቋቋመዋለው እርሱን ተደግፌ
 በናባው ተራራ ቢሆን መቃብሬ
ከነዓን ባልገባ ከህዝቡ ጋር አብሬ
አለኝ ከሰማይ ቤት እጅግ የከበረች
በጆሮ ያልተሰማች በአይንም
ያልታየች`}
                      </div>
                    </div>
                  </div>

                  {/* MEZMUR 6: ምስጋና በመቅደስህ */}
                  <div className="bg-white border border-[#E7DED1] p-6 rounded-2xl space-y-4 shadow-2xs hover:border-[#6F4E37] transition">
                    <div className="flex flex-wrap justify-between items-center gap-2 border-b border-[#E7DED1] pb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-full bg-[#6F4E37] text-white flex items-center justify-center text-xs font-bold">6</span>
                        <h4 className="font-display font-bold text-lg text-[#2B2B2B]">🔸 ምስጋና በመቅደስህ</h4>
                      </div>
                      <span className="px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-mono font-bold">
                        ባቲ ቅኝት
                      </span>
                    </div>
                    <div className="p-4 bg-[#FAF6EF] border border-[#E7DED1] rounded-xl space-y-1">
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">LYRICS / ግጥም</span>
                      <div className="text-xs md:text-sm text-gray-800 font-medium leading-relaxed space-y-1 whitespace-pre-line">
{`ምስጋና በመቅደስህ ዜማሬ በማደሪያህ
ልሰዋ ጠዋት ማታ ክብሬነህ የኔ ጌታ
 
ሰገነት አይመቸኝ ካባዬ ክብር አይሆነኝ
ሁሉም ንቄዋለሁ ያንተን ቤት መርጫለሁ
ያረጃል ያለም ዜና ጥበብም ሆኖ መና
አንተግን ያው አንተነህ በሁሉ ትጠናለህ/2/
ከሰማይ ባይንህ ታየው በፍቅርህ ተጎበኘው
በባህሪህ ባለጸጋ ፈወስከኝ በደም ዋጋ/2/
ቃልህን ነፍሴ ሰምታ ተዋበች በእልልታ
ወደግርህ መረገጫ መስገጃ አለኝ ብልጫ
/2/`}
                      </div>
                    </div>
                  </div>

                  {/* MEZMUR 7: እውነት ስለሆነ */}
                  <div className="bg-white border border-[#E7DED1] p-6 rounded-2xl space-y-4 shadow-2xs hover:border-[#6F4E37] transition">
                    <div className="flex flex-wrap justify-between items-center gap-2 border-b border-[#E7DED1] pb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-full bg-[#6F4E37] text-white flex items-center justify-center text-xs font-bold">7</span>
                        <h4 className="font-display font-bold text-lg text-[#2B2B2B]">🔸 እውነት ስለሆነ</h4>
                      </div>
                      <span className="px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-mono font-bold">
                        ባቲ ቅኝት
                      </span>
                    </div>
                    <div className="p-4 bg-[#FAF6EF] border border-[#E7DED1] rounded-xl space-y-1">
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">LYRICS / ግጥም</span>
                      <div className="text-xs md:text-sm text-gray-800 font-medium leading-relaxed space-y-1 whitespace-pre-line">
{`እውነት ስለሆነ ኢየሱስ ክርስቶስ
ዋለ በአደባባይ ሲሰደብ ሲከሰስ
የሃሰት ዳኝነት አምላክን ወቀሰው
ህይወት ሰጠን እንጂ ጥፋቱ ምንድን ነው
ከቃሉ እብለትን ባያገኙበት
ዝምታውን አይተው አልራሩለት
ባላወቁት መጠን ጠሉት ያለበደል
ጥፋቱ ምን ይሆን የሚያደርስ
ከመስቀል/2/
የልቡን ትህትና ፍቅሩን ሳያስተውሉ
ቸሩ ጌታችንን አቻኩለው ሰቀሉ
እሩህሩሁን ጌታ ቸንክረው ሰቀሉት
ሞትን አስወግዶ ቢሰጣቸው ህይወት/2/
ስለቸርነቱ ስድብን ከፈሉት
ስለርህራሄው የሾህ አክሊል ሰጡት
ሐሞትና ከርቤ ሆምጣጤ ደባልቀው
መራራ አስጎነጩት ጨክኖ
ልባቸው/2/
ፈውስን ለሰጣቸው ልባቸውን ሞልተው
አሉት ወንበዴ ነው ስቀለው ስቀለው
ከእጁ በረከትን የተሻሙ ሁሉ
ይጮሁ ነበረ ይገደል እያሉ/2/`}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* NEXT & PREVIOUS BUTTONS */}
              {renderChapterNavFooter('chapter-6')}
            </div>
          )}

          {/* ---------------- CHAPTER 7: አምባሰል ቅኝት ---------------- */}
          {activeSubTab === 'chapter-7' && (
            <div className="bg-white border border-[#E7DED1] p-6 md:p-8 rounded-3xl space-y-8 shadow-2xs">
              <div className="border-b border-[#E7DED1] pb-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <span className="px-3 py-1 bg-[#6F4E37] text-white rounded-lg text-xs font-bold uppercase tracking-wide">
                    ቤሲክ አንድ • CHAPTER 7
                  </span>
                  <h2 className="text-xl sm:text-2xl font-display font-black text-[#2B2B2B] mt-2">
                    ምዕራፍ ሰባት : አምባሰል ቅኝት
                  </h2>
                  <p className="text-xs text-gray-600 mt-1">
                    የአምባሰል ቅኝት አመሰራረት እና በቅኝቱ ላይ ያሉ የዝርዝር መዝሙራት ግጥሞች
                  </p>
                </div>

                <div className="bg-amber-100 border border-amber-300 px-4 py-2 rounded-2xl shrink-0 text-right">
                  <span className="text-[10px] font-bold text-amber-800 uppercase block">TUNING SCALE</span>
                  <span className="text-sm font-black text-amber-950 font-display">📍 አምባሰል ቅኝት</span>
                </div>
              </div>

              {/* 🔹 ቅኝት አመሰራረት */}
              <div className="border border-[#E7DED1] bg-amber-50/50 p-6 rounded-2xl space-y-5">
                <div className="flex items-center gap-2 text-base font-bold text-[#6F4E37] border-b border-amber-200/80 pb-2">
                  <span className="text-amber-700 font-black text-lg">🔹</span>
                  <h3 className="font-display font-bold text-lg text-[#2B2B2B]">ቅኝት አመሰራረት (Ambassel Tuning Scale)</h3>
                </div>
                <p className="text-xs md:text-sm text-gray-700 leading-relaxed">
                  Unlike ትዝታ ቅኝት፣ የአምባሰል ቅኝት በሚከተለው የአውታሮችና የድምፅ ቅደም ተከተል ይዋቀራል (Use this exact sequence):
                </p>

                {/* STRINGS NUMERICAL ASSIGNMENTS GRID */}
                <div className="p-4 bg-white border border-amber-200 rounded-2xl shadow-2xs space-y-3">
                  <span className="text-xs font-bold text-[#6F4E37] uppercase tracking-wider block">
                    የአምባሰል ቅኝት አውታሮችና የተመደቡላቸው ቁጥሮች (String Assignments):
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl flex items-center justify-between">
                      <span className="text-xs font-bold text-[#6F4E37]">String 5</span>
                      <span className="text-xs font-mono font-bold text-amber-950 bg-amber-200/80 px-2 py-0.5 rounded">Assigned Number 1 → C</span>
                    </div>
                    <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl flex items-center justify-between">
                      <span className="text-xs font-bold text-[#6F4E37]">String 1</span>
                      <span className="text-xs font-mono font-bold text-amber-950 bg-amber-200/80 px-2 py-0.5 rounded">Assigned Number 2 → C#</span>
                    </div>
                    <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl flex items-center justify-between">
                      <span className="text-xs font-bold text-[#6F4E37]">String 2</span>
                      <span className="text-xs font-mono font-bold text-amber-950 bg-amber-200/80 px-2 py-0.5 rounded">Assigned Number 3 → F</span>
                    </div>
                    <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl flex items-center justify-between">
                      <span className="text-xs font-bold text-[#6F4E37]">String 3</span>
                      <span className="text-xs font-mono font-bold text-amber-950 bg-amber-200/80 px-2 py-0.5 rounded">Assigned Number 4 → G</span>
                    </div>
                    <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl flex items-center justify-between">
                      <span className="text-xs font-bold text-[#6F4E37]">String 4</span>
                      <span className="text-xs font-mono font-bold text-amber-950 bg-amber-200/80 px-2 py-0.5 rounded">Assigned Number 5 → G#</span>
                    </div>
                    <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl flex items-center justify-between">
                      <span className="text-xs font-bold text-[#6F4E37]">String 6</span>
                      <span className="text-xs font-mono font-bold text-amber-950 bg-amber-200/80 px-2 py-0.5 rounded">Assigned Number 6 → C in Octave</span>
                    </div>
                  </div>
                </div>

                {/* 🎵 INTERACTIVE VIRTUAL KRAR SIMULATOR FOR AMBASSEL */}
                <KrarScaleSimulatorBoard
                  scaleKey="ambassel"
                  title="የአምባሰል ቅኝት ድምፅ ማዳመጫ (Ambassel Scale Simulator)"
                  subtitle="በአምባሰል ቅኝት የተቀኙትን 6ቱ አውታሮች ድምፅ አዳምጡ ወይም «▶ ቅኝቱን አጫውት» የሚለውን ቁልፍ ይጫኑ"
                  playKrarStringTone={playKrarStringTone}
                  pluckedStringIndex={pluckedStringIndex}
                  playScaleSequence={playScaleSequence}
                  isPlayingSequence={isPlayingSequence}
                />
              </div>

              {/* 🔹 አምባሰል ቅኝት ላይ ያሉ መዝሙሮች */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-base font-bold text-[#6F4E37] border-b border-[#E7DED1] pb-3">
                  <span className="text-amber-700 text-lg font-black">🔹</span>
                  <h3 className="font-display font-bold text-lg text-[#2B2B2B]">አምባሰል ቅኝት ላይ ያሉ መዝሙሮች (7 Mezmurs)</h3>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  {/* MEZMUR 1: እንተ በምድር */}
                  <div className="bg-white border border-[#E7DED1] p-6 rounded-2xl space-y-4 shadow-2xs hover:border-[#6F4E37] transition">
                    <div className="flex flex-wrap justify-between items-center gap-2 border-b border-[#E7DED1] pb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-full bg-[#6F4E37] text-white flex items-center justify-center text-xs font-bold">1</span>
                        <h4 className="font-display font-bold text-lg text-[#2B2B2B]">🔸 እንተ በምድር</h4>
                      </div>
                      <span className="px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-mono font-bold">
                        አምባሰል ቅኝት
                      </span>
                    </div>
                    <div className="p-4 bg-[#FAF6EF] border border-[#E7DED1] rounded-xl space-y-1">
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">LYRICS / ግጥም</span>
                      <div className="text-xs md:text-sm text-gray-800 font-medium leading-relaxed space-y-1 whitespace-pre-line">
{`እንተ በምድር ሰራዊሀ
ወበ ሰማይ አይፆቄሀ
ሀረገ ወይን {2} ድንግሌ ሀረገ ወይን`}
                      </div>
                    </div>
                  </div>

                  {/* MEZMUR 2: ድንግል እናቴ ነይ */}
                  <div className="bg-white border border-[#E7DED1] p-6 rounded-2xl space-y-4 shadow-2xs hover:border-[#6F4E37] transition">
                    <div className="flex flex-wrap justify-between items-center gap-2 border-b border-[#E7DED1] pb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-full bg-[#6F4E37] text-white flex items-center justify-center text-xs font-bold">2</span>
                        <h4 className="font-display font-bold text-lg text-[#2B2B2B]">🔸 ድንግል እናቴ ነይ</h4>
                      </div>
                      <span className="px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-mono font-bold">
                        አምባሰል ቅኝት
                      </span>
                    </div>
                    <div className="p-4 bg-[#FAF6EF] border border-[#E7DED1] rounded-xl space-y-1">
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">LYRICS / ግጥም</span>
                      <div className="text-xs md:text-sm text-gray-800 font-medium leading-relaxed space-y-1 whitespace-pre-line">
{`ድንግል እናቴ ነይ ድረሽሌኝ
ወገን የለኝም ቀርቦ የሚጽናናኝ
ከአጠገቤ ሁኝና አለሁ በይኝ
ይቆይልኛል ያልኩት ከእጄ ላይ አልቆ
በሀን በሰቆቃ ጉልበቴ ደቆ
በረከት አልባ ሆኜ እንዳልከፋ
ድረሽሌኝ እናቴ ነይ የእኔ ተስፋ
ብቸኝነት ክፉ ነው አንገት ያስደፋል
ጭንቀትን አባብሶ ለክፉ ይሰጣል
አንቺ ከጎኔ ካለሽ አልሸነፍም
ለዚህ ዓለም ሞኝነት እጄን አልሰጥም
እንኳን ለደካማው ሰው ለእኔ ለባሪያሽ
ለዓለም ይተርፋል ፀሎት ሌመናሽ
በዚያ በፍትርድ ሰዓት ጥላ ሁኚኝ
ክፉ ግብሬን መዝኖ እንዳያቀለኝ
እረፍዶብኛል ጉዞው የሠርጉ ቤት
ሙሽራው ሊገባ ነው ሳልይዝ መብራት
አፍጥኚኝ እናት ዓለም ለመልካም ሥራ
የእሳት ሲሳይ እንዳልሆን ድንግል አደራ`}
                      </div>
                    </div>
                  </div>

                  {/* MEZMUR 3: ምስጋናዬን */}
                  <div className="bg-white border border-[#E7DED1] p-6 rounded-2xl space-y-4 shadow-2xs hover:border-[#6F4E37] transition">
                    <div className="flex flex-wrap justify-between items-center gap-2 border-b border-[#E7DED1] pb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-full bg-[#6F4E37] text-white flex items-center justify-center text-xs font-bold">3</span>
                        <h4 className="font-display font-bold text-lg text-[#2B2B2B]">🔸 ምስጋናዬን</h4>
                      </div>
                      <span className="px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-mono font-bold">
                        አምባሰል ቅኝት
                      </span>
                    </div>
                    <div className="p-4 bg-[#FAF6EF] border border-[#E7DED1] rounded-xl space-y-1">
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">LYRICS / ግጥም</span>
                      <div className="text-xs md:text-sm text-gray-800 font-medium leading-relaxed space-y-1 whitespace-pre-line">
{`ምስጋናዬን ለአምላክ አቀርባሁ
በማደሪያው ገብቼ እሰግዳለሁ
ኤልሻዳይ ነው ጌታ ሁሉን ቻይ
ይፈፅማል አምናለሁ የልቤን ጉዳይ/2/
ንባባዬን ይዤ እንደህፃናቱ
ሆሳዕና ልበለው ሰግጄ በፊቱ
ምንም ባዶ ብሆን እውቀት ቢጎድለኝ
ለስሙ ልምር ከልካይም የለኝም/2/
አምላኬ በፊትህ ቃል አለብኝ እኔ
ቋንቋዬ መዝሙር ነው ያንተ እንደመሆኔ
በአሚናዳብ ደጃፍ በቅድመ ታቦቱ
ያ የክብር ዑደት ጠራኝ ማህሌቱ/2/
የሕይወት ትርጉሜ አንተ ነህ ደስታዬ
ስምህን ማገልገል ክብሬ ነው ስራዬ
ለታመነው ጌታ ምስክር የሆኑ
ከብረው ተመለሱ ለበረከት ሆኑ/2/
መነሻዬ አንተ ነህ ጉልበቴና ክብሬ
መድረሻዬም አንተ መደምደሚያ ቅጥሬ
በጽዮን ተራራ ስትገደጥ ያኔ
ነጩን ልብስ አልብሰህ አስነሳኝ ለቅኔ/2/`}
                      </div>
                    </div>
                  </div>

                  {/* MEZMUR 4: ሞገድ ሲመታኝ */}
                  <div className="bg-white border border-[#E7DED1] p-6 rounded-2xl space-y-4 shadow-2xs hover:border-[#6F4E37] transition">
                    <div className="flex flex-wrap justify-between items-center gap-2 border-b border-[#E7DED1] pb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-full bg-[#6F4E37] text-white flex items-center justify-center text-xs font-bold">4</span>
                        <h4 className="font-display font-bold text-lg text-[#2B2B2B]">🔸 ሞገድ ሲመታኝ</h4>
                      </div>
                      <span className="px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-mono font-bold">
                        አምባሰል ቅኝት
                      </span>
                    </div>
                    <div className="p-4 bg-[#FAF6EF] border border-[#E7DED1] rounded-xl space-y-1">
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">LYRICS / ግጥም</span>
                      <div className="text-xs md:text-sm text-gray-800 font-medium leading-relaxed space-y-1 whitespace-pre-line">
{`ሞገድ ሲመታኝ ማዕበሉ
ምን ያድነዋል ሁሉም ሲሉ
በሰላም አለፍኩ በፀጥታ
ሁሉ ተችሎ በአንተ ጌታ(2)
በአንተስ ቁስል ተፈወስኩኝ
ጌታ በፍቅርህ ተማረኩኝ
ሞቴን ሽረኸው በአንተ ሞት
ይሄው አቆምከኝ በህይወት(2)
ደጅህ ስጠና ስማፀንህ
መቼ ጨከነ ጌታ ልብህ
እንደ ቀራጩ አጎነበስኩ
ምህረት ፀጋህን ከእጅህ ለበስኩ(2)
ወትር እልል ብል ብምር
ስለገባኝ ነው ያንተ ፍቅር
ጌታ ምጠራው ስምህን
ለውጠኸው ነው ታሪኬን(2)
አይኞቼ አያዩ ከአንተ በቀር
የምትወደድ የምትፈቀር
መዳ በወገኔ ሆነኸኛል
እኔን የሚችል የት ይገኛል(2)`}
                      </div>
                    </div>
                  </div>

                  {/* MEZMUR 5: ኦ ሚካኤል */}
                  <div className="bg-white border border-[#E7DED1] p-6 rounded-2xl space-y-4 shadow-2xs hover:border-[#6F4E37] transition">
                    <div className="flex flex-wrap justify-between items-center gap-2 border-b border-[#E7DED1] pb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-full bg-[#6F4E37] text-white flex items-center justify-center text-xs font-bold">5</span>
                        <h4 className="font-display font-bold text-lg text-[#2B2B2B]">🔸 ኦ ሚካኤል</h4>
                      </div>
                      <span className="px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-mono font-bold">
                        አምባሰል ቅኝት
                      </span>
                    </div>
                    <div className="p-4 bg-[#FAF6EF] border border-[#E7DED1] rounded-xl space-y-1">
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">LYRICS / ግጥም</span>
                      <div className="text-xs md:text-sm text-gray-800 font-medium leading-relaxed space-y-1 whitespace-pre-line">
{`ኦ ሚካኤል (2) ሊቀ መላእክት
በኃጥያት እንዳንወድቅ እንዳንሞት
ፈጥነህ ተራዳን አጽናን በእምነት
የያቆብ ነገድ ሚካኤል
ለእስራኤል ሚካኤል
ጠባቂያቸው ነህ ሚካኤል
መልአከ ሀይል ሚካኤል
ፍቅርን አድለን ምህረት
ቅዱስ ሚካኤል የኛ አባት(2)
በስዕል ፊት ሚካኤል
እሰግዳለሁ ሚካኤል
መጥተህ አነጋግረኝ ሚካኤል
አለሁ በለኝ ሚካኤል
ፍቅርን አድለን ምህረት
ቅዱስ ሚካኤል የኛ አባት(2)
ነጸብራቃዊ ሚካኤል
ተክኖ ልብስህ ሚካኤል
ሃመልማለ ወርቅ ሚካኤል
አይን ርግብ ሚካኤል
ፍቅርን አድለን ምህረት
ቅዱስ ሚካኤል የኛ አባት(2)`}
                      </div>
                    </div>
                  </div>

                  {/* MEZMUR 6: ቸርነትህ ነው */}
                  <div className="bg-white border border-[#E7DED1] p-6 rounded-2xl space-y-4 shadow-2xs hover:border-[#6F4E37] transition">
                    <div className="flex flex-wrap justify-between items-center gap-2 border-b border-[#E7DED1] pb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-full bg-[#6F4E37] text-white flex items-center justify-center text-xs font-bold">6</span>
                        <h4 className="font-display font-bold text-lg text-[#2B2B2B]">🔸 ቸርነትህ ነው</h4>
                      </div>
                      <span className="px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-mono font-bold">
                        አምባሰል ቅኝት
                      </span>
                    </div>
                    <div className="p-4 bg-[#FAF6EF] border border-[#E7DED1] rounded-xl space-y-1">
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">LYRICS / ግጥም</span>
                      <div className="text-xs md:text-sm text-gray-800 font-medium leading-relaxed space-y-1 whitespace-pre-line">
{`ቸርነትህ ነው ያደረሰኝ እስከዛሬ
ቸርነትህ ነው የጠበቀኝ እስከዛሬ
ላመስግንህ የኔ ጌታ በዜማሬ/2/
መክሊቴንም ቀብሬ ባሳዘንህ
መብራቴንም ይዤ ባልጠብቅህ
በታላቅ ይቅርታ እንዳትረሳኝ
ብፍቅር ጎብኝተህ ከሞት አውጣኝ
ከቤትህ እርቄ መች ጠገብኩኝ
በረሃብ በእርዛት ተቸገርኩኝ
አምናለሁ አምላኬ እንድትምረኝ
ለይቅርታ መጣሁ ይቅር በለኝ
አንዳች እንደሌለኝ አውቀዋለሁ
ባንተ ቸርነት ግን እመካለሁ
የከበደው ሸክሜ ይቀለኛል
ይቅርታ ለባርያህ ይደርሰኛል
በመቅደስህ ቆሜ ለመመር
ስራህን ለትውልድ ለመመስከር
እኔ ማነኝ ብዬ አስባለሁ
አምላክ ቸርነትህን አደንቃለሁ
በሰው እጅ መመካት አቁሜያለሁ
እረዳቴ አንተ ነህ አውቄያለሁ
አንተ ከጠበከኝ በህይወቴ
ቅጥሬ አይደፈርም መድኃኒቴ
የኔን ሰራ ተወው ተግባሬንም
የመስቀሉን ነገር መርሳቴንም
አዙሜን አንስተህ አንተን ልይህ
ኢየሱስ ክርስቶስ አምላኬ ነህ`}
                      </div>
                    </div>
                  </div>

                  {/* MEZMUR 7: አንቺን የያዘ ሰው */}
                  <div className="bg-white border border-[#E7DED1] p-6 rounded-2xl space-y-4 shadow-2xs hover:border-[#6F4E37] transition">
                    <div className="flex flex-wrap justify-between items-center gap-2 border-b border-[#E7DED1] pb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-full bg-[#6F4E37] text-white flex items-center justify-center text-xs font-bold">7</span>
                        <h4 className="font-display font-bold text-lg text-[#2B2B2B]">🔸 አንቺን የያዘ ሰው</h4>
                      </div>
                      <span className="px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-mono font-bold">
                        አምባሰል ቅኝት
                      </span>
                    </div>
                    <div className="p-4 bg-[#FAF6EF] border border-[#E7DED1] rounded-xl space-y-1">
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">LYRICS / ግጥም</span>
                      <div className="text-xs md:text-sm text-gray-800 font-medium leading-relaxed space-y-1 whitespace-pre-line">
{`አንቺን የያዘ ሰው ምን ይጎድልበታል
በምልጃሽ በረከት ቤቱ ሞልቶለታል
ር መከር ባይኖረው ጎተራው ባይሞላ
ሁሉም ይሸፈናል በረድኤትሽ ጥላ /2/
በረከትሽ ብዙ የደናግል ገንብ
የምስኪናን እናት የርሁባን ቀለብ
ለሁሉ መጋቢ ፀጋሽ የማይጎድል
ስምሽ ጥዑም ምግብ ከረሀብ
የሚያስጥል/2/
አንቺ ብትመጪ ከምስኪኗ ቤቴ
እንደ መጥምቁ እናት በዛልኝ ሐሴቴ
የአዲስ ኪዳን ቁርባን መንበር ጠረጴዛ
ጽድቅን አሸተትን የሕይወት መዓዛ /2/
ልቤ ተጠራጥሮ ኪዳንሽን ካልከዳ
ልመናም አልወርድም አልይዝም አቆፋዳ
ሁሉን እየሞላሽ መመገብ ታውቂያለሽ
ቢዘቁት የማያልቅ ፀጋና ሃብት አለሽ /2
የእግዚአብሔር ማረፊያ ኮሬባዊት ዋሻ
የሕይወት ውሃ ምንጭ የህግ መፈሰሻ
ነበልባል ተዋህዶሽ ሙሴ አንቺን አይቷል
ጫማውን አውልቆ በፊትሽ ተደፍቷል /2/`}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* NEXT & PREVIOUS BUTTONS */}
              {renderChapterNavFooter('chapter-7')}
            </div>
          )}

          {/* VIRTUAL KRAR PRACTICE STUDIO */}
          {activeSubTab === 'virtual-krar' && (
            <div className="bg-white border border-[#E7DED1] p-6 rounded-3xl space-y-6 shadow-2xs">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-[#E7DED1] pb-4">
                <div>
                  <span className="px-2.5 py-0.5 bg-amber-100 text-amber-900 rounded-lg text-[10px] font-bold uppercase">
                    INTERACTIVE VIRTUAL INSTRUMENT
                  </span>
                  <h2 className="text-xl font-display font-black text-[#2B2B2B] mt-1">
                    ቨርቹዋል ክራር ድርደራ (Virtual Krar Studio)
                  </h2>
                  <p className="text-xs text-gray-500">ተጫኑና ድምፁን ያዳምጡ (Click strings or tap keys to play live Krar tones)</p>
                </div>

                {/* SCALE PRESET & VIEW TOGGLE SELECTOR */}
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex bg-[#FAF6EF] p-1 rounded-xl border border-[#E7DED1]">
                    <button
                      onClick={() => setKrarViewMode('simulator')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                        krarViewMode === 'simulator'
                          ? 'bg-[#6F4E37] text-white shadow-xs font-black'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <Music size={13} />
                      <span>Virtual Simulator</span>
                    </button>
                    <button
                      onClick={() => setKrarViewMode('tuner')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                        krarViewMode === 'tuner'
                          ? 'bg-amber-600 text-white shadow-xs font-black ring-1 ring-amber-400'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <Mic size={13} className="text-amber-400" />
                      <span>Krar Tuner (ክራር ቱነር)</span>
                    </button>
                  </div>

                  {krarViewMode === 'simulator' && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-600 uppercase">SCALE PRESET:</span>
                      <select
                        value={selectedKrarScale}
                        onChange={(e) => setSelectedKrarScale(e.target.value as any)}
                        className="px-3 py-1.5 bg-[#FAF6EF] border border-[#E7DED1] rounded-xl text-xs font-bold text-gray-800"
                      >
                        <option value="tizita">ትዝታ ቅኝት (Tizita)</option>
                        <option value="bati">ባቲ ቅኝት (Bati)</option>
                        <option value="ambassel">አምባሰል ቅኝት (Ambassel)</option>
                        <option value="anchihoye">አንቺሆዬ ቅኝት (Anchihoye)</option>
                        <option value="selamta">ሰላምታ ቅኝት (Selamta)</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>

              {/* KRAR TUNER OR SIMULATOR CONTENT */}
              {krarViewMode === 'tuner' ? (
                <div className="text-left">
                  <InstrumentTuner instrument="Krar" defaultScaleKey={selectedKrarScale} />
                </div>
              ) : (
                <>
                  {/* CHOOSE SCALE SELECTOR PANEL */}
                  <div className="bg-[#FAF6EF] border border-[#E7DED1] p-5 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between border-b border-[#E7DED1] pb-2">
                      <div className="flex items-center gap-2 text-[#6F4E37] font-bold text-sm">
                        <Sliders size={18} />
                        <span>Choose Scale / ቅኝት ምረጥ</span>
                      </div>
                      <span className="text-xs text-[#6F4E37] font-mono font-bold">
                        አሁን የተመረጠው: {selectedKrarScale.toUpperCase()}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {[
                        { id: 'tizita', label: 'ትዝታ (Tizita)', desc: 'C - D - E - G - A' },
                        { id: 'cherenet', label: 'ቸርነት (Cherenet)', desc: 'C - C# - F - F# - A' },
                        { id: 'bati', label: 'ባቲ (Bati)', desc: 'C - E - F - G - B' },
                        { id: 'ambassel', label: 'አምባሰል (Ambassel)', desc: 'C - C# - F - G - G#' }
                      ].map((sc) => {
                        const isSelected = selectedKrarScale === sc.id || (sc.id === 'cherenet' && selectedKrarScale === 'anchihoye');

                        return (
                          <button
                            key={sc.id}
                            onClick={() => setSelectedKrarScale(sc.id === 'cherenet' ? 'anchihoye' : sc.id as any)}
                            className={`p-3 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                              isSelected
                                ? 'bg-[#6F4E37] text-white border-[#6F4E37] shadow-md ring-2 ring-amber-400'
                                : 'bg-white text-gray-800 border-[#E7DED1] hover:bg-amber-50 hover:border-amber-300'
                            }`}
                          >
                            <span className="font-bold text-xs sm:text-sm">{sc.label}</span>
                            <span className={`text-[10px] font-mono mt-1 ${isSelected ? 'text-amber-200' : 'text-gray-500'}`}>
                              {sc.desc}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* VISUAL SIMULATOR FRAME FOR KRAR (6 STRINGS) */}
                  <KrarScaleSimulatorBoard
                    scaleKey={(selectedKrarScale === 'anchihoye' ? 'cherenet' : selectedKrarScale) as any}
                    title={`Virtual Krar Studio • ${selectedKrarScale.toUpperCase()}`}
                    subtitle="የተመረጠውን ቅኝት አውታሮች ይጫኑ ወይም «▶ ቅኝቱን አጫውት» የሚለውን ቁልፍ በመንካት ድምፃቸውን ይስሙ"
                    playKrarStringTone={playKrarStringTone}
                    pluckedStringIndex={pluckedStringIndex}
                    playScaleSequence={playScaleSequence}
                    isPlayingSequence={isPlayingSequence}
                  />
                </>
              )}

              {/* PRACTICE TIMER & LOG RECORDER */}
              <div className="p-5 bg-[#FAF6EF] border border-[#E7DED1] rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#E89B52] text-white flex items-center justify-center font-bold">
                    <Clock size={20} />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-gray-500 uppercase">PRACTICE TIMER</span>
                    <p className="text-lg font-mono font-bold text-gray-900">
                      {Math.floor(timerSeconds / 60)}m {timerSeconds % 60}s
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant={timerActive ? 'secondary' : 'primary'}
                    size="sm"
                    onClick={() => setTimerActive(!timerActive)}
                  >
                    {timerActive ? <Pause size={14} /> : <Play size={14} />}
                    <span>{timerActive ? 'Pause' : 'Start Timer'}</span>
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setTimerActive(false);
                      setTimerSeconds(0);
                    }}
                  >
                    <RotateCcw size={14} />
                    <span>Reset</span>
                  </Button>
                </div>
              </div>

              {/* NEXT & PREVIOUS BUTTONS */}
              {renderChapterNavFooter(activeSubTab.startsWith('chapter-') ? activeSubTab : 'chapter-4')}
            </div>
          )}

          {/* TAB: MEZMUR / SONG LIBRARY */}
          {activeSubTab === 'mezmur-library' && (
            <div className="bg-white border border-[#E7DED1] p-6 rounded-3xl space-y-6 shadow-2xs">
              <div className="border-b border-[#E7DED1] pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <span className="px-2.5 py-0.5 bg-amber-100 text-amber-900 rounded-lg text-[10px] font-bold uppercase tracking-wide">
                    KRAR MEZMUR LIBRARY • የክራር መዝሙራት
                  </span>
                  <h2 className="text-2xl font-display font-black text-[#2B2B2B] mt-1">
                    የመዝሙራትና የዜማዎች ቤተ-መጻሕፍት
                  </h2>
                  <p className="text-xs text-gray-500">
                    ለክራር ተማሪዎች የተዘጋጁ መዝሙራት በቅኝታቸው፣ በኖታና በሙሉ ግጥም
                  </p>
                </div>

                <div className="flex items-center gap-2 bg-[#FAF6EF] px-4 py-2 rounded-2xl border border-[#E7DED1]">
                  <Music size={18} className="text-[#E89B52]" />
                  <div className="text-xs">
                    <span className="text-gray-500">ድምር መዝሙራት፡ </span>
                    <span className="font-bold text-[#2B2B2B]">{mezmurs.length} መዝሙራት</span>
                  </div>
                </div>
              </div>

              {/* SEARCH & FILTER BAR */}
              <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between bg-[#FAF6EF] p-4 rounded-2xl border border-[#E7DED1]">
                {/* Search Input */}
                <div className="relative flex-1">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="በመዝሙር ርዕስ ወይም በግጥም ፈልግ... (Search by title or lyrics)"
                    value={mezmurSearchQuery}
                    onChange={(e) => setMezmurSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-white border border-[#E7DED1] rounded-xl text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#E89B52]"
                  />
                  {mezmurSearchQuery && (
                    <button
                      onClick={() => setMezmurSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs font-bold cursor-pointer"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Scale Filters */}
                <div className="flex flex-wrap gap-1.5 items-center">
                  {[
                    { id: 'all', label: 'ሁሉንም (All)' },
                    { id: 'ትዝታ ቅኝት', label: 'ትዝታ ቅኝት' },
                    { id: 'ቸርነት ቅኝት', label: 'ቸርነት ቅኝት' },
                    { id: 'ባቲ ቅኝት', label: 'ባቲ ቅኝት' },
                    { id: 'አምባሰል ቅኝት', label: 'አምባሰል ቅኝት' }
                  ].map((filter) => {
                    const isActive = mezmurScaleFilter === filter.id;
                    return (
                      <button
                        key={filter.id}
                        onClick={() => setMezmurScaleFilter(filter.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                          isActive
                            ? 'bg-[#6F4E37] text-white shadow-2xs'
                            : 'bg-white text-gray-700 hover:bg-amber-100/60 border border-[#E7DED1]'
                        }`}
                      >
                        {filter.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* MEZMUR CARDS GRID */}
              {(() => {
                const filtered = mezmurs.filter((m) => {
                  const matchesCategory =
                    mezmurScaleFilter === 'all' || m.category === mezmurScaleFilter;
                  const query = mezmurSearchQuery.toLowerCase().trim();
                  const matchesSearch =
                    !query ||
                    m.title.toLowerCase().includes(query) ||
                    (m.englishTitle && m.englishTitle.toLowerCase().includes(query)) ||
                    (m.lyrics && m.lyrics.toLowerCase().includes(query)) ||
                    (m.notation && m.notation.includes(query));
                  return matchesCategory && matchesSearch;
                });

                if (filtered.length === 0) {
                  return (
                    <div className="p-12 text-center bg-[#FAF6EF]/50 rounded-2xl border border-dashed border-[#E7DED1] space-y-3">
                      <Music size={36} className="mx-auto text-gray-400" />
                      <p className="text-sm font-bold text-gray-700">ምንም መዝሙር አልተገኘም (No mezmur found)</p>
                      <p className="text-xs text-gray-500">እባክዎን የፍለጋ ቃሉን ወይም የቅኝት ማጣሪያውን ይቀይሩ።</p>
                    </div>
                  );
                }

                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filtered.map((m, idx) => (
                      <div
                        key={m.id || idx}
                        className="p-6 border border-[#E7DED1] bg-white rounded-2xl space-y-4 hover:border-[#E89B52] transition shadow-2xs flex flex-col justify-between"
                      >
                        <div className="space-y-3">
                          <div className="flex justify-between items-start gap-2">
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="px-2.5 py-0.5 bg-amber-100 text-amber-900 rounded-full text-[10px] font-bold border border-amber-300">
                                  {m.category}
                                </span>
                                {m.difficulty && (
                                  <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-[10px] font-bold">
                                    {m.difficulty}
                                  </span>
                                )}
                              </div>
                              <h3 className="font-display font-bold text-xl text-[#2B2B2B] mt-1.5 flex items-center gap-2">
                                <span>🔸 {m.title}</span>
                              </h3>
                              {m.englishTitle && (
                                <p className="text-xs text-gray-500 font-mono italic">{m.englishTitle}</p>
                              )}
                            </div>
                          </div>

                          <p className="text-xs text-gray-600 leading-relaxed">{m.description}</p>

                          {/* NOTATION & PLAY BUTTON */}
                          <div className="p-3 bg-[#21150c] rounded-xl text-amber-300 space-y-2 border border-[#6F4E37]/40 shadow-inner">
                            <div className="flex justify-between items-center text-[10px] text-amber-200/70 font-mono font-bold uppercase tracking-wider">
                              <span>🎼 KRAR NOTATION (የክራር ኖታ)</span>
                              <span>PLAYBACK</span>
                            </div>
                            <div className="flex justify-between items-center gap-2">
                              <p className="font-mono text-sm font-black tracking-widest text-amber-300 truncate">
                                {m.notation}
                              </p>
                              <button
                                onClick={() => {
                                  const numbers = (m.notation || '').match(/[1-6]/g);
                                  if (numbers && numbers.length > 0) {
                                    numbers.forEach((numStr, nIdx) => {
                                      const num = parseInt(numStr, 10);
                                      const stringIdx = (GLOBAL_NOTATION_TO_STRING_INDEX[num] !== undefined)
                                        ? GLOBAL_NOTATION_TO_STRING_INDEX[num]
                                        : (num - 1);
                                      setTimeout(() => {
                                        playKrarStringTone(stringIdx);
                                      }, nIdx * 320);
                                    });
                                  }
                                }}
                                className="px-3 py-1.5 bg-[#E89B52] hover:bg-[#d68840] text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shrink-0 transition"
                              >
                                <Volume2 size={14} />
                                <span>ድምፅ አዳምጥ</span>
                              </button>
                            </div>
                          </div>

                          {/* LYRICS CONTAINER */}
                          <div className="p-4 bg-[#FAF6EF] border border-[#E7DED1] rounded-xl space-y-1.5">
                            <span className="text-[10px] font-bold text-[#6F4E37] uppercase tracking-wider block border-b border-[#E7DED1] pb-1">
                              📜 MEZMUR LYRICS / ግጥም
                            </span>
                            <div className="text-xs md:text-sm text-gray-800 font-medium leading-relaxed whitespace-pre-line pt-1">
                              {m.lyrics}
                            </div>
                          </div>

                          {m.learningInstructions && (
                            <p className="text-xs text-amber-900 bg-amber-50/80 p-2.5 rounded-lg border border-amber-200/80">
                              <strong>💡 የተማሪ መመሪያ፦</strong> {m.learningInstructions}
                            </p>
                          )}
                        </div>

                        {/* PRACTICE IN VIRTUAL KRAR BUTTON */}
                        <div className="pt-2 border-t border-[#E7DED1] mt-2">
                          <button
                            onClick={() => {
                              setActiveSubTab('virtual-krar');
                            }}
                            className="w-full py-2 bg-[#FAF6EF] hover:bg-amber-100/70 text-[#6F4E37] border border-[#E7DED1] hover:border-[#6F4E37] rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer"
                          >
                            <Play size={14} />
                            <span>በቨርቹዋል ክራር ላይ ተለማመድ (Practice in Virtual Krar)</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          )}

          {/* TAB: CERTIFICATE PROGRESS & GRADUATION */}
          {activeSubTab === 'certificate-progress' && (
            <div className="bg-white border border-[#E7DED1] p-6 rounded-3xl space-y-6 shadow-2xs">
              <div className="border-b border-[#E7DED1] pb-4">
                <span className="text-xs font-bold text-[#E89B52] uppercase">GRADUATION</span>
                <h2 className="text-2xl font-display font-black text-[#2B2B2B] mt-1">
                  የምስክር ወረቀት ሂደት (Krar Basic 1 Certificate)
                </h2>
                <p className="text-xs text-gray-500">የክራር ቤሲክ አንድ ትምህርት ማጠናቀቂያ የምስክር ወረቀት</p>
              </div>

              {!isCertificateUnlocked ? (
                <div className="p-6 bg-amber-50/60 border border-amber-200 rounded-2xl space-y-4 max-w-lg mx-auto text-center">
                  <Award size={48} className="mx-auto text-[#E89B52]" />
                  <h3 className="font-display font-bold text-lg text-gray-900">
                    የመምህር ማረጋገጫ ኮድ ያስገቡ (Enter Teacher Code)
                  </h3>
                  <p className="text-xs text-gray-600">
                    የምስክር ወረቀቱን ለማውረድ ከመምህርዎ የተሰጠዎትን ማረጋገጫ ኮድ ያስገቡ።
                  </p>

                  <div className="space-y-2">
                    <Input
                      type="text"
                      placeholder="e.g. BRUK-KRAR-2026"
                      value={teacherCodeInput}
                      onChange={(e) => setTeacherCodeInput(e.target.value)}
                      className="text-center font-mono uppercase"
                    />

                    {teacherCodeError && <p className="text-xs text-red-600 font-bold">{teacherCodeError}</p>}

                    <Button onClick={handleCertificateUnlock} className="w-full justify-center">
                      ኮድ አረጋግጥ (Unlock Certificate)
                    </Button>
                  </div>
                </div>
              ) : (
                <div id="krar-certificate-print" className="p-8 border-8 border-amber-900/30 bg-[#FAF6EF] rounded-3xl text-center space-y-6 relative overflow-hidden">
                  <TiletPattern className="absolute inset-0 opacity-10 pointer-events-none" />

                  <Award size={64} className="mx-auto text-[#E89B52]" />

                  <div>
                    <h2 className="font-display font-black text-3xl text-[#2B2B2B]">LIORA BEGENA SCHOOL</h2>
                    <p className="text-xs font-bold text-amber-800 uppercase tracking-widest">
                      TRADITIONAL ETHIOPIAN MUSIC ACADEMY
                    </p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs text-gray-600 uppercase">THIS CERTIFIES THAT</p>
                    <h3 className="font-display font-black text-2xl text-gray-900 underline decoration-amber-500">
                      {currentUser?.fullName || 'Student'}
                    </h3>
                    <p className="text-xs text-gray-600">
                      HAS SUCCESSFULLY COMPLETED THE FULL CURRICULUM FOR
                    </p>
                    <h4 className="font-display font-bold text-lg text-[#E89B52]">
                      KRAR MUSIC COURSE - BASIC 1
                    </h4>
                  </div>

                  <Button
                    onClick={() => {
                      const el = document.getElementById('krar-certificate-print');
                      if (el) exportElementToPDF(el, 'Krar_Certificate.pdf');
                    }}
                    className="gap-2 mx-auto"
                  >
                    <Download size={16} />
                    <span>Download Official PDF Certificate</span>
                  </Button>
                </div>
              )}

              {/* NEXT & PREVIOUS BUTTONS */}
              {renderChapterNavFooter('certificate-progress')}
            </div>
          )}

          {/* TAB: PRACTICE TRACKER LOGS */}
          {activeSubTab === 'practice-tracker' && (
            <div className="bg-white border border-[#E7DED1] p-6 rounded-3xl space-y-6 shadow-2xs">
              <div className="border-b border-[#E7DED1] pb-4">
                <span className="text-xs font-bold text-[#E89B52] uppercase">LOGS</span>
                <h2 className="text-2xl font-display font-black text-[#2B2B2B] mt-1">
                  የልምምድ ሰዓት መመዝገቢያ (Practice Logs)
                </h2>
              </div>

              <div className="space-y-3">
                {practiceLogs.map((log) => (
                  <div key={log.id} className="p-4 rounded-2xl border border-gray-200 bg-[#FAF6EF]/50 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-gray-900">{log.exerciseTitle}</span>
                      <span className="text-gray-500 font-mono">{log.date} ({log.durationMinutes} min)</span>
                    </div>
                    <p className="text-xs text-gray-700">{log.notes}</p>
                    {log.teacherFeedback && (
                      <p className="text-xs text-amber-800 bg-amber-50 p-2 rounded-lg border border-amber-200">
                        <strong>Teacher Feedback:</strong> {log.teacherFeedback}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
