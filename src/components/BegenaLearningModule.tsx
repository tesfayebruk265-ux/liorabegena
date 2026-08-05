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
  Plus,
  Trash,
  Edit,
  Lock,
  Unlock,
  FileText,
  Check,
  Video,
  User,
  Share2,
  Sliders,
  Eye,
  Upload,
  MessageSquare,
  Settings,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  BookCheck,
  Sparkles,
  VolumeX,
  X,
  UserCheck,
  RefreshCw,
  RotateCw,
  Camera,
  Download,
  CheckCircle2,
  FileVideo,
  Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth, isStudentAccessGranted } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { isStudentEnrolledInInstrument } from '../utils/studentEnrollment';
import { StudentEnrollment } from '../types';
import { Button, Input } from './InteractiveComponents';
import { TiletPattern } from './TiletPattern';
import { RegistrationAndPaymentGate } from './RegistrationAndPaymentGate';
import { exportElementToPDF } from '../utils/pdfExport';
import { BegenaScaleSimulatorBoard } from './BegenaScaleSimulatorBoard';
import { syncStudentProgressToEnrollment, calculateStudentProgress } from '../utils/courseLearningSync';
import { verifyCertificateCodeForStudent } from '../utils/certificateVerification';

// ==========================================
// TYPES & INTERFACES FOR BEGENA MODULE
// ==========================================
export interface BegenaModule {
  id: string;
  levelId: string; // 'basic-1' | 'basic-2' | 'basic-3'
  title: string;
  description: string;
  order: number;
  isPublished: boolean;
  isLocked: boolean;
}

export interface BegenaLesson {
  id: string;
  moduleId: string;
  title: string;
  durationText: string;
  videoUrl: string;
  audioUrl: string;
  pdfUrl: string;
  explanation: string;
  notationSequence: string;
  isCompleted: boolean;
}

export interface BegenaExercise {
  id: string;
  title: string;
  description: string;
  instructions: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedTime: string;
  notation: string;
  practiceTarget: string; // e.g. "10 minutes"
  hasTeacherVerification: boolean;
  teacherNotes?: string;
  status: 'Not Started' | 'In Progress' | 'Completed' | 'Needs Improvement';
  isApprovedByTeacher?: boolean;
}

export interface BegenaMezmur {
  id: string;
  title: string;
  amharicTitle: string;
  englishTitle?: string;
  description: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  level: string;
  teacher: string;
  audioUrl: string;
  videoUrl: string;
  notation: string;
  lyrics: string;
  learningInstructions: string;
  status: 'Not Started' | 'Learning' | 'Practicing' | 'Submitted for Review' | 'Teacher Reviewing' | 'Needs Improvement' | 'Approved' | 'Completed' | 'Locked';
  studentRecordingUrl?: string;
  teacherFeedback?: string;
  teacherScore?: number;
}

export interface BegenaAssignment {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'Assigned' | 'Submitted' | 'Approved' | 'Needs Revision';
  submissionNotes?: string;
  submittedVideoUrl?: string;
  teacherFeedback?: string;
  grade?: string;
}

export interface PracticeLog {
  date: string;
  duration: number; // minutes
  exerciseTitle: string;
  notes: string;
  reflectionDifficulty: string;
  reflectionImprovement: string;
}

// Default Seed Data based on uploaded materials & school needs
const DEFAULT_MODULES: BegenaModule[] = [
  { id: 'mod_1', levelId: 'basic-1', title: 'ምዕራፍ አንድ ፡ የበገና ምንነት እና ታሪካዊ ዳራ', description: 'የበገና ታሪክ፣ የበገና ምንነት፣ የበገና አገልግሎት ጥቅሞች፣ የበገና አይነቶች፣ ከበገና ደርዳሪያን ምን ይጠበቃል', order: 1, isPublished: true, isLocked: false },
  { id: 'mod_2', levelId: 'basic-1', title: 'ምዕራፍ ሁለት፡ የበገና ክፍሎች አሰራራቸው እና ምሳሌነታቸው', description: 'የበገና አካል ክፍሎች፣ የበገና አያያዝ', order: 2, isPublished: true, isLocked: false },
  { id: 'mod_3', levelId: 'basic-1', title: 'ምዕራፍ ሶስት፡ ዜማ እና የበገና ቅኝቶች', description: 'የቤተክርስቲያናችን ዜማ፣ ቅዱስ ያሬድ፣ የ ድምጾች ሳይንሳዊ አጠራር', order: 3, isPublished: true, isLocked: false },
  { id: 'mod_4', levelId: 'basic-1', title: 'ምዕራፍ አራት፡ ቅኝቶች እና ተግባራዊ ልምምዳቸው', description: 'የ ቅኝት አመሰራረት፣ ጣት ማፍታታት፣ ቅኝቶች (ትዝታ፣ ቸርነት/አንቺሆዬ፣ ሰላምታ)', order: 4, isPublished: true, isLocked: false },
];

// Helper to extract YouTube embed URL for iframe embedding
const getYouTubeEmbedUrl = (url: string): string | null => {
  if (!url) return null;
  if (url.includes('youtube.com/embed/')) return url;
  
  const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regExp);

  if (match && match[1]) {
    const videoId = match[1];
    let listParam = '';
    const listMatch = url.match(/list=([^&]+)/);
    if (listMatch) {
      listParam = `?list=${listMatch[1]}`;
    }
    return `https://www.youtube.com/embed/${videoId}${listParam}`;
  }
  return null;
};

const DEFAULT_LESSONS: BegenaLesson[] = [
  {
    id: 'les_1_1',
    moduleId: 'mod_1',
    title: 'ምዕራፍ አንድ ፡ የበገና ምንነት እና ታሪካዊ ዳራ',
    durationText: '12 mins',
    videoUrl: 'https://www.youtube.com/embed/2GpKxNl_KW0',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', // Safe sample audio
    pdfUrl: '#',
    explanation: 'በዚህ ትምህርት ስለ የበገና ታሪክ፣ የበገና ምንነት፣ የበገና አገልግሎት ጥቅሞች፣ የበገና አይነቶች እና ከበገና ደርዳሪያን ምን እንደሚጠበቅ በስፋት ይማራሉ::',
    notationSequence: '2 3 1 5 4 2',
    isCompleted: true
  },
  {
    id: 'les_1_2',
    moduleId: 'mod_2',
    title: 'ምዕራፍ ሁለት፡ የበገና ክፍሎች አሰራራቸው እና ምሳሌነታቸው',
    durationText: '10 mins',
    videoUrl: 'https://www.youtube.com/embed/2GpKxNl_KW0',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    pdfUrl: '#',
    explanation: 'ስለ የበገና አካል ክፍሎች እና ስለ የበገና ትክክለኛ አያያዝ ዘዴዎች የሚማሩበት ምዕራፍ::',
    notationSequence: '2 4 5 1 3 2',
    isCompleted: false
  },
  {
    id: 'les_1_3',
    moduleId: 'mod_3',
    title: 'ምዕራፍ ሶስት፡ ዜማ እና የበገና ቅኝቶች',
    durationText: '15 mins',
    videoUrl: 'https://www.youtube.com/embed/2GpKxNl_KW0',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    pdfUrl: '#',
    explanation: 'የቤተክርስቲያናችን ዜማ፣ ስለ ቅዱስ ያሬድ ታሪክ እና የድምጾች ሳይንሳዊ አጠራር ማብራሪያ::',
    notationSequence: '2 3 1 5 4 2',
    isCompleted: false
  },
  {
    id: 'les_1_4',
    moduleId: 'mod_4',
    title: 'ምዕራፍ አራት፡ ቅኝቶች እና ተግባራዊ ልምምዳቸው',
    durationText: '20 mins',
    videoUrl: 'https://www.youtube.com/embed/2GpKxNl_KW0',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    pdfUrl: '#',
    explanation: 'የ ቅኝት አመሰራረት፣ ጣት ማፍታታት፣ እና የትዝታ፣ ቸርነት/አንቺሆዬ እና ሰላምታ ቅኝቶች ተግባራዊ ልምምድ::',
    notationSequence: '2 4 5 1 3 2',
    isCompleted: false
  }
];

const DEFAULT_EXERCISES: BegenaExercise[] = [
  {
    id: 'ex_1',
    title: 'Finger Plucking Exercise 01',
    description: 'Establish consistent thumb and pointer plucking on the top strings.',
    instructions: 'Sit comfortably with the Begena resting on your left thigh. Use your thumb to pluck the 1st string, and your alternating pointer to pluck the 2nd string in equal tempos.',
    difficulty: 'Beginner',
    estimatedTime: '10 mins',
    notation: '1 2 3 4 5',
    practiceTarget: 'Pluck each string 20 times cleanly without buzzing',
    hasTeacherVerification: false,
    status: 'In Progress'
  },
  {
    id: 'ex_2',
    title: 'Double Plucking Rhythm drill',
    description: 'Developing double strikes to build speed and traditional tempo.',
    instructions: 'Pluck each pentatonic scale degree twice in succession. Ensure the buzzing sound is maintained evenly between strikes.',
    difficulty: 'Beginner',
    estimatedTime: '15 mins',
    notation: '11 22 33 44 55',
    practiceTarget: 'Double pluck sequence continuously for 2 minutes',
    hasTeacherVerification: true,
    teacherNotes: 'Pay close attention to finger release speed so the string is not muted.',
    status: 'Not Started'
  },
  {
    id: 'ex_3',
    title: 'Ascending Pentatonic Leap',
    description: 'Skipping intervals to build spatial awareness of string spacing.',
    instructions: 'Practice plucking strings 1, then 3, then 2, then 4, then 3, then 5. Take it slowly at 60 BPM.',
    difficulty: 'Intermediate',
    estimatedTime: '15 mins',
    notation: '131 213 242 454 545',
    practiceTarget: 'Smooth skipping pattern without looking at strings',
    hasTeacherVerification: true,
    status: 'Not Started'
  }
];

const DEFAULT_MEZMURS: BegenaMezmur[] = [
  {
    id: 'mez_1',
    title: 'እግዚአብሔር ይመስገን',
    amharicTitle: 'እግዚአብሔር ይመስገን',
    englishTitle: 'God Be Praised',
    description: 'በትዝታ ቅኝት የተደረደረ የመጀመሪያው የሐምሌ መዝሙር',
    category: 'ትዝታ ቅኝት',
    difficulty: 'Beginner',
    level: 'Basic 1',
    teacher: 'አቶ ታፈሰ / Abel Begena',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    videoUrl: 'https://www.youtube.com/embed/2GpKxNl_KW0',
    notation: '2 3 1  3 1 5  1 5 4  5 4 2  2 4 5  4 5 1  5 1 3  1 3 2',
    lyrics: `እግዚአብሔር ይመስገን
ለዚህ ያደረሰን`,
    learningInstructions: 'የበገና ድርደራ ቁጥር፡ 2 3 1   3 1 5  1 5 4   5 4 2 / 2 4 5  4 5 1   5 1 3   1 3 2',
    status: 'Practicing'
  },
  {
    id: 'mez_2',
    title: 'ገብረ መንፈስቅዱስ (አቶ ታፈሰ)',
    amharicTitle: 'ገብረ መንፈስቅዱስ አቦዬ ጻድቁ',
    englishTitle: 'Gebra Menfes Kidus',
    description: 'በአቶ ታፈሰ የተደረደረ የፃድቁ አቡነ ገብረ መንፈስ ቅዱስ መዝሙር',
    category: 'ትዝታ ቅኝት',
    difficulty: 'Intermediate',
    level: 'Basic 1',
    teacher: 'አቶ ታፈሰ',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
    videoUrl: 'https://www.youtube.com/embed/2GpKxNl_KW0',
    notation: '2 3 1 1 1 1 1 1 1 3 1 5 1 1 3 1 1 5 1 1 3 2 4 2',
    lyrics: `ገብረ መንፈስቅዱስ አቦዬ ጻድቁ 
ኧረ እንዴት ነህ አባቴ ኧረ እንዴት ነህ መድኃኒቴ
ገደል እንደ አክርማ የሚሰነጥቁ  ( ኧረ ... )
ገብረ መንፈስቅዱስ ተክለሃይማኖት ( ኧረ ...) 
ታላቅ ክብር ያገኙ በክርስቶስ ፊት ( ኧረ ...)
ለጌታቸው ታዛዥ ለዓለም አማላጅ ( ኧረ ...)
በፈጣሪያቸው ዘንድ በሥላሴ ደጅ ( ኧረ ...)
ጻድቃን ሰማዕታት ደናግል በሙሉ ( ኧረ ...)
ሌት ከቀን ሳያርፉ ሰው ያማልዳሉ ( ኧረ ..)
ድንጋይ ተንተርሰው ዳዋ እየጣሱ ( ኧረ...)
በጸሎት ተጠምደው ጤዛ እየላሱ ( ኧረ ...)
ገብረ መንፈስ ቅዱስ አቡነ ተክልዬ ( ኧረ...)
በእናንተ ጋሻነት ልኑር ተከልዬ ( ኧረ...)
የዘልዳው ኮከብ ቅዱስ ጊዮርጊስ ( ኧረ...)
ተጨንቀው ሲጠሩህ ፈጥነህ የምትደርስ ( ኧረ...)
አቡነ አረጋዊ ታላቁ አባት ( ኧረ ...)
ጸጋ ክብር ያገኙ በሥላሴ ፊት ( ኧረ ...)
ሙሽራው ሰማዕት ገብረ ክርስቶስ ( ኧረ...)
መንኖ የሄደ ጽድቅ ለመልበስ ( ኧረ...)
ደራጐንን በጦር ወግቶ የገደለ ( ኧረ...)
ፈረሰኛው ጊዮርጊስ የልዳው ኮከብ ነው(ኧረ...)
ገብረ መንፈስቅዱስ ታላቁ መናኝ ( ኧረ...)
ከዚህ ዓለም መቅሰፍት ፈጥነው ያድኑኝ ( ኧረ...) 
ፃድቃን ሰማዕታት አባቶች ሁላችሁ ( ኧረ...)
ኢትዮጵያን ጠብቋት አደራ ተግታችሁ( ኧረ...)`,
    learningInstructions: 'የበገና ድርደራ ቁጥር፡ 23 1111 1113 15 / 113 115 113 242',
    status: 'Practicing'
  },
  {
    id: 'mez_3',
    title: 'አየሁኝ በህልሜ (አቶ ታፈሰ)',
    amharicTitle: 'አየሁኝ በህልሜ',
    englishTitle: 'I Saw In My Dream',
    description: 'በአቶ ታፈሰ የተደረደረ ጥልቅ የሞትና ሕይወት አሳሳቢ መዝሙር',
    category: 'ትዝታ ቅኝት',
    difficulty: 'Intermediate',
    level: 'Basic 1',
    teacher: 'አቶ ታፈሰ',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
    videoUrl: 'https://www.youtube.com/embed/2GpKxNl_KW0',
    notation: '2 3 2 2 3 5 2 3 2 2 3 1 5 4 4 4 4 5 1 1 1 1 3 3 4 2 2 2 2 2',
    lyrics: `አየሁኝ በህልሜ /2/ 
ሞት የተባለውን እዳ ተሸክሜ 
      ሰማሁኝ በዝና /2/ 
      ቀጠሮ አክባሪ ነው ሞት አይረሳም እና ሞት አይቀርም እና
ሞት ይቅር ይላሉ ሞት ቢቀር አልወድም
አፈሩም ድንጋዩም ከሰው ፊት አይከብድም 
       አጠረ ቁመቴ ወዳጆቼን ባይ 
       እያደሩ ማነስ ለካ እንዲህ ነው ወይ
እኔ አልገዛም ሱሪ ይቅርብኝ ለራሴ
አፈር ስለሆነ የዘላለም ልብሴ  
       ቤት አልሠራም ይቅር ጣራና ግድግዳ
       መቃብር ነውና የኔ ሳሎን ጓዳ
እባክህ አምላኬ ስማ ጸሎቴን 
በእንባ ዓለም እጄ የምበላውን 
       እራሴን አንገቴ አልችለው ብለህ 
       ሁል ጊዜ ከሰው ፊት ትጥለኛለህ
አየሁኝ በህልሜ አየሁኝ በህልሜ
ሞት የተባለውን እዳ ተሸክሜ 
      ሰማሁኝ በዝና ሰማሁኝ በዝና
      ቀጠሮ አክባሪ ነው ሞት አይቀርም እና ሞት አይረሳም እና 
አይጣል አይጣል እያልን ስንለምነው
ሳናስበው ድንገት ጣለብን ምነው 
       ግድግዳው ቢረዝም ምንባጡ ቢያምር
       የምድር ቤት ነውና መፍረሱም አይቀር
እንግዳው ሞት መጣ ኧረ ወየው ወየው
ለእግሩ ውሃ አሙቄ በርዤ ሳልቆየው
       የሞትን ማዕረጉን ሁላችሁ እወቁ
       ከእርሱ ቤት ይገኛል ብሩም ሆነ ወርቁ
ይኸው የዘራልን በየቀኑ ሰው
አንድም አልበቀለ የታል ቡቃያው
       ከአቤል ጀምሮ ነበር የታመነ
       አሁን ግን ስናየው ሞት ቀጣፊ ሆነ 
አይቼ መጣሁኝ ዛሬስ በእሁድ
ሰው እንደአዝመራ በግፍ ሲታጨድ 
       በከንቱ ያሙታል እንዲሁ በሐሰት
       ሰው በልቶ ጨረሰ እያሉ መሬት 
ከምድር እስከ ሰማይ ሰው ቢያስብ ሁልጊዜ
ከሰው አልተለየም ሞትና ትካዜ 
      ደስታና ሐዘን ጐን ለጐን ሲሄዱ
      ይጐራበቱናል ከሁለቱ አንዱ 
ሁሉ በሽተኛ ሁሉ ራሴን ባይ
በቤታችን ደህና መጥፋቱ ነው ወይ 
       እሱን ሞት ሲጠራው በሩቁ ሰምቼ
       እኔም ወይ አላልኩም ለራሴ ፈርቼ 
ሰው ሁሉ በርስቱ ይጨርሳል ሀብቱን
የኋላ የኋላ ላያጣው መሬቱን 
       ቀኑን ባሸንፈው ሌት መቶ ታገለኝ
       በቶሎ ሞት ናና እባክህ ገላግለኝ 
እድሜዬ ዘልዛላ ነው አያልቅ በቶሎ
ከቶ መሞት ላይቀር እንደው ውልውሎ 
        ከፋኝ ሞቴን ስጠኝ ለማይቀረው እዳ
        ደግሞ እንደ ሥጋዬ ነፍሴ እንዳትጐዳ 
ወለም ዘለም እያልኩ አለቀ እድሜዬ
ሞት መምጣቱ ላይቀር ወየው መከራዬ`,
    learningInstructions: 'የበገና ድርደራ ቁጥር፡ 23 22 3-5 23 22 3-1 / 544445 1111 33 4222 22',
    status: 'Practicing'
  },
  {
    id: 'mez_4',
    title: 'አቤቱ ደግ ሰው አልቋልና (ዘማሪ ይልማ ኃይሉ)',
    amharicTitle: 'አቤቱ ደግ ሰው አልቋልና',
    englishTitle: 'Oh Lord, Good People Are Gone',
    description: 'በዘማሪ ይልማ ኃይሉ የተዘመረ የተማፅኖ የትዝታ ቅኝት መዝሙር',
    category: 'ትዝታ ቅኝት',
    difficulty: 'Intermediate',
    level: 'Basic 1',
    teacher: 'ዘማሪ ይልማ ኃይሉ',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
    videoUrl: 'https://www.youtube.com/embed/2GpKxNl_KW0',
    notation: '5 2 1 1 1 5 1 1 1 3 4 2 2 2 4 2 5 2 1 1 1 5 1 1 1 3 4 2 2 3 2 3 3 5 2 4 4 5 3 1 1 1 3 4 2 2 2 4 2',
    lyrics: `አቤቱ ደግ ሰው አልቋልና 
ከምድርም ፍቅር ጠፍቷልና
እንደ ቸርነትህ አድነን 
በደላችንንም አትቁጠር
በበገና... 
        የረድኤት አምላክ ፍቅር ስጠን 
        እንደ አህዛቡ አታድርገን 
        ክርስቲያን ነንና እንዋደድ 
        እባክህ አንውጣ ካንተ መንገድ 
        በበገና...
አቤቱ ንፁህ ልብ ፍጠርልን 
ሰውን የሚያስወድድ ካለ እንከን 
አንደበታችንም እንዲናገር 
ስለ ሰላም ቋንቋ ስለ ፍቅር
አዝ……. 
        በእግዚአብሔር ፈቃድ የሚመራ 
        ትሩፋት ደግነት የሚሠራ 
        አንደበቱ ሁሉ የታረመ 
        ለቃለ ወንጌሉ የደከመ
        በበገና...
ምግባርና እውነት የተሰጠው 
እባክህን ስጠን ሁነኛ ሰው 
አንተን የሚመስል በሕይወቱ 
ፍቅርና ትህትና የግል ሀብቱ
አዝ……. 
        የማስመሰል ፍቅር እየበዛ 
        ሰው ረክሷልና እንደዋዛ 
        ፍፁም መዋደድን ስጠንና 
        አዲስ ሰው እንሁን እንደገና 
        በበገና...
ደገኛ ሰው ማግኘት አስቸግሯል 
እስከ መጨረሻ ማን ይፀናል 
ምግባሩ ትክክል እውነተኛ 
ልቡ የሚፀየፍ ከዳተኛ
አዝ…….`,
    learningInstructions: 'የበገና ድርደራ ቁጥር፡ 52-1 115 1113 4222 42 / 52-1 115 1113 4223 23 / 35- 2- 4453 1113 4222 42 (2x)',
    status: 'Practicing'
  },
  {
    id: 'mez_5',
    title: 'ርግብና ዋኔን (አቶ ታፈሰ)',
    amharicTitle: 'ርግብና ዋኔን',
    englishTitle: 'The Dove and the Turtle Dove',
    description: 'ቅኝት- ዋኔን (ትዝታ) - በአቶ ታፈሰ የተደረደረ የእመቤታችን ምስጋና መዝሙር',
    category: 'ትዝታ ቅኝት',
    difficulty: 'Intermediate',
    level: 'Basic 1',
    teacher: 'አቶ ታፈሰ',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3',
    videoUrl: 'https://www.youtube.com/embed/2GpKxNl_KW0',
    notation: '4 4 4 4 5 5 3 1 1 5 4 2 4 4 4 5 2 5 3 1 1 5 4 2 3 3 1 1 3 3 4 2 3 1 4 2 3 3 1 1 3 3 4 2 2 4 2',
    lyrics: `ርግብና ዋኔን  ዋኔን አብረው ዘመቱና ዋኔን
ርግብ ደህና ገባች  ዋኔን  ዋኔን ገደሉና  ዋኔን
      እስቲ በስመአብ ብዬ ዋኔን ልቀኝ ለእመቤቴ ዋኔን
      ማርያም በመሆኗ ዋኔን ክብሬና ህይወቴ ዋኔን
ሰላም እልሻለሁ ዋኔን ጽላተ ጽዮን ዋኔን
ደጅ እጠናሻለሁ ዋኔን አምኜ አንቺን ዋኔን
      አዛኝቷ እመቤት ዋኔን ኪዳነ ምህረት ዋኔን
      አለሁልህ/ሽ/ ብለሽ ዋኔን  አውጪኝ ከመአት ዋኔን
እስቲ ሁላችሁም ዋኔን ኪዳነ ምህረት በሉ ዋኔን
መድኃኒት ናትና ዋኔን ለሰው ልጆች ሁሉ ዋኔን
      ሁሌ እጠራሻለሁ ዋኔን በቃል ኪዳንሽ ዋኔን
      የምህረት አማላጅ ዋኔን  ድንግል አንቺ ነሽ ዋኔን
የዓለም ፈርጥ አንቺ ነሽ ዋኔን ማርያም እመቤቴ ዋኔን
እመካብሻለሁ ዋኔን እስከ ጊዜ ሞቴ ዋኔን
     ያንን የእሳት ባህር ዋኔን አሻግሪኝ ድንግል ዋኔን
     እንዳወድቅ አደራ ዋኔን ከሲኦል ገደል ዋኔን
የነቢያት ትንቢት ዋኔን የሰማዕታት አክሊል ዋኔን
ያላንቺ ማን አለኝ ዋኔን እመቤቴ ድንግል ዋኔን
      በአማላጅነትሽ ዋኔን እንኮራለን እኛ ዋኔን
      የጽድቅ መሰላል ነሽ ዋኔን የተሰጠሽ ለኛ ዋኔን
ያዕቆብ በህልሙ ዋኔን ያያት መሰላል ዋኔን
የዓለም አስታራቂ ዋኔን አንቺ ነሽ ድንግል ዋኔን
     ታማልደናለች ዋኔን እጆቿን ዘርግታ ዋኔን
     ከቶ እረፍት የላትም ዋኔን ከጧት እስከ ማታ ዋኔን
ኪዳነ ምህረት ነሽ ዋኔን አንቺ የኛ ተስፋ ዋኔን
መርቆ የሰጠን ዋኔን ኦሜጋና አልፋ ዋኔን
      የዓለም ሁሉ መቅረዝ ዋኔን መንበረ ሥላሴ ዋኔን
      መድኃኒቴ እሷ ነች ዋኔን ለሥጋም ለነፍሴ ዋኔን
      ሁሌ ላመስግናት ዋኔን ተፈታ ምላሴ ዋኔን
የምህረት ቃል ኪዳን ዋኔን የሰው ልጅ መዳኛ ዋኔን
እንድታማልደን ዋኔን የተሰጠች ለኛ ዋኔን
       ምላሴ ተናገር ዋኔን የማርያምን ዝና ዋኔን
       ለኛ መሰጠቷን ዋኔን ሳትፈጠር ገና ዋኔን
ታስባ ስትኖር ዋኔን በእግዚአብሔር ሕሊና ዋኔን
ተወልዳ አደገች ዋኔን ጊዜው ደረሰና ዋኔን
      ዘመን የማይሽረው ዋኔን ስላላት ቃል ኪዳን ዋኔን
      ታማልደናለች ዋኔን መድኃኒት በመሆን ዋኔን
ምን ቃላት ይገኛል ዋኔን እርሷን ማመስገኛ ዋኔን
እነ ሕርያቆስ ዋኔን ያልቻሉት እነኛ ዋኔን
       ከዓይኗ እያዘነበች ዋኔን የእንባዋን ዘለላ ዋኔን
       ወደ ግብፅ በረረች ዋኔን አንድ ልጇን አዝላ ዋኔን
ፅጌ ፀዐዳ ነች ዋኔን እመቤቴ ድንግል ዋኔን
ድረሺልን ሲሏት ዋኔን ከተፍ ነው የምትል ዋኔን
       የፃድቃን እመቤት ዋኔን የኃጥኣን ተስፋ ዋኔን
       ወዳንቺ እጮሀለሁ ዋኔን ሳዝንና ስከፋ ዋኔን 
የበላኤ ሰብን ዋኔን ያዳንሽው ድንግል ዋኔን
ለእኔም አትንፈጊኝ ዋኔን ይህንን እድል ዋኔን
       ስንቅ የለኝ ለነፍሴ ዋኔን እንዴት ልሆን ነው ዋኔን
       ድንግል እመቤቴ ዋኔን መግቢኝ አንቺው ዋኔን
ጥላሽን ጣይብኝ ዋኔን ኪዳነ ምህረት ዋኔን
ስጨነቅ ስጠበብ ዋኔን ስጋለጥ ያን ዕለት ዋኔን
       ድንግል መድኃኒት ነሽ ዋኔን ለሰው ልጆች ተስፋ ዋኔን
       ከጐኔ ቁሚልኝ ዋኔን ሳዝንና ስከፋ ዋኔን
የዓለም መድኃኒት ነሽ ዋኔን ማርያም እመቤቴ ዋኔን
በረድኤት ግቢልኝ ዋኔን ነይልኝ ከቤቴ ዋኔን
      አደራሽን ማርያም ዋኔን ኪዳነ ምህረት ዋኔን
      ፀጋሽን አልብሽኝ ዋኔን ኋላ ስራቆት ዋኔን
ዕርቃኔን መሆኔን ዋኔን አውቀዋለሁና ዋኔን
አልብሽኝ ፀጋሽን ዋኔን በኢያቄም በሃና ዋኔን
      እስቲ ሁላችሁም ዋኔን ኪዳነ ምህረት በሉ ዋኔን
      መድኃኒት ናትና ዋኔን ለሰው ልጆች ሁሉ ዋኔን
አፍሮ አይመለስም ዋኔን የቆመ ከደጇ ዋኔን
እመቤቴ ማርያም ዋኔን የጭንቅ አማላጇ ዋኔን
       የአዳም መድኃኒቱ ዋኔን አንቺ ነሽ ድንግል ዋኔን
       በኢያቄም በሃና ዋኔን አውጪኝ ከሲኦል ዋኔን
አንቺ የኤዶም ገነት ዋኔን የሰው ልጆች ተስፋ ዋኔን
መድኃኒት ነሽና ዋኔን አዝኖ ለተከፋ ዋኔን`,
    learningInstructions: 'የበገና ድርደራ ቁጥር፡ 444455 -3 115 42 / 44452- 53 115 42 / 331133 42- 3-1 42 / 331133 42- 2 42',
    status: 'Practicing'
  },
  {
    id: 'mez_6',
    title: 'ስቀለው ስቀለው (ዘማሪት ሶስና)',
    amharicTitle: 'ስቀለው ስቀለው',
    englishTitle: 'Crucify Him, Crucify Him',
    description: 'በዘማሪት ሶስና የተዘመረ የስቅለት ሕማማት ትዝታ ቅኝት መዝሙር',
    category: 'ትዝታ ቅኝት',
    difficulty: 'Intermediate',
    level: 'Basic 1',
    teacher: 'ዘማሪት ሶስና',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3',
    videoUrl: 'https://www.youtube.com/embed/2GpKxNl_KW0',
    notation: '5 4 2 2 4 2 3 3 1 5 1 3 3 5 4 5 1 3 1 4 2 2 2 5 4 2 5 4 5 1 1 3 1 4 2 2 2 2 2 5 4 2',
    lyrics: `ስቀለው ስቀለው እያሉ
አይሁድ ባንተ ላይ ተማማሉ 
እውነተኛው ዳኛ አንተ ሆነህ ሳለ 
የጲላጦስን ፍርድ ፍቅርህ ተቀበለ
ጌታ ይቅር በለን /2/
ምንም ብንበድልህ የእጆችህ ሥራ ነን/2/
        ተጠማሁ ተጠማሁ እያለ
        በቀራንዮ ላይ መስቀል ላይ ሆነህ
        የአፍላጋት ጌታ አንተ ሆነህ ሳለህ
        ሆምጣጤ አጠጡህ ሳለህ ተቸግረህ 
        ጌታ ይቅር በለን /2/
        ምንም ብንበድልህ የእጆችህ ሥራ ነን/2/
ማን መታህ ንገረን እያሉ 
ፊቱን እየጸፉት ሲሳደቡ ዋሉ 
ምንም አልመለሰ ምነውም አላለ 
ህማሙን በትዕግስት አውቆ ተቀበለ
ጌታ ይቅር በለን /2/
ምንም ብንበድልህ የእጆችህ ሥራ ነን/2/
        ምራቅ እየተፉ ፊትህ ላይ  
        ሲመቱህ ሲሰድቡህ ስትሰቃይ
        ምንም ሳትመልስ በፍቅር አየሃቸው
        በመስቀል ሰቀሉህ ወደህ ሞትክላቸው 
        ጌታ ይቅር በለን /2/
        ምንም ብንበድልህ የእጆችህ ሥራ ነን/2/
ይቅር ባይ ነህና መሀሪ 
ትህትና ፍቅርን አስተማሪ 
ጠልተው ለሰቀሉት ለተፉት በፊቱ 
ምህረትን ጠየቀ ከአብ ከአባቱ
ጌታ ይቅር በለን /2/
ምንም ብንበድልህ የእጆችህ ሥራ ነን/2/
         መከራህን ሳስብ ስቃይህን
         መስቀል ላይ እንደዋልክ እርቃንህን
         ነፍሴ ተጨነቀች እጅጉን አዘነች
         ፍዳና በደሏን እያሰላሰለች
         ጌታ ይቅር በለን /2/
         ምንም ብንበድልህ የእጆችህ ሥራ ነን/2/`,
    learningInstructions: 'የበገና ድርደራ ቁጥር፡ 542 -2- 423- 3- 1513- 3- 5 45 131 4222- 542 / (5 451 131- 4222 -22- 542)',
    status: 'Practicing'
  },
  {
    id: 'mez_7',
    title: 'አሥር አውታር ባለው በበገና (ዘማሪት ሶስና)',
    amharicTitle: 'አሥር አውታር ባለው በበገና',
    englishTitle: 'On the Ten-Stringed Begena',
    description: 'በተማሪዎች የሚሰራ - በዘማሪት ሶስና የቀረበ የበገና ምስጋና መዝሙር',
    category: 'ትዝታ ቅኝት',
    difficulty: 'Intermediate',
    level: 'Basic 1',
    teacher: 'ዘማሪት ሶስና',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3',
    videoUrl: 'https://www.youtube.com/embed/2GpKxNl_KW0',
    notation: '2 2 4 2 3 2 2 4 2 3 1 5 4 2 2 4 5 1 3 2',
    lyrics: `አስር አውታር ባለው በበገና 
ስለ ቅዱስ ስምህ ልቀኝና 
ስምህን ላወድስ በዝማሬ
እኔም ከአባቶቼ ተምሬ 
       ዳዊት ስለ ክብርህ እጅግ ቀንቶ
       በሰው ፊት መክበርን ሁሉን ትቶ
       ሲዘምር የዋለው ስምህን ጠርቶ
       መች ሆነና እርሱ ሹመት ሽቶ
       አዝ...

በእስር ቤት ሳሉ እነ ጳውሎስ
የእጃቸው ሠንሰለት እስኪበጠስ
የወህኒውን ደጆች ያስከፈቱት
ባንተ ምስጋና ነው የበረቱት
አዝ...
       ባንደበቴ ልጩህ ላመስግንህ
       በቀንና በሌት ልቀኝልህ
       ልዋረድ ከፊትህ ሰው ይናቀኝ
       ምስጋናዬን አንተ ተቀበለኝ
       አዝ...	
በምስጋና ልምሰል አባቶቼን 
ለዘወትር ስምህን በማመስገን
ኃጢአቴን አታስብ መበደሌን
ምስጋናዬን ስማ ዝማሬዬን
አዝ...
       ፍቅርህ የጎደለኝ ስሆንብህ
       ለምስጋና አቆመኝ ቸርነትህ
       አወድስሀለሁ በበገና 
       ምስጋናህ ይብዛልኝ እንደገና`,
    learningInstructions: 'የበገና ድርደራ ቁጥር፡ 22 423… (በተማሪዎች የሚሰራ)',
    status: 'Practicing'
  },
  {
    id: 'mez_8',
    title: 'የብርሃን እናት',
    amharicTitle: 'የብርሃን እናት',
    englishTitle: 'Mother of Light',
    description: 'የድንግል ማርያም የምስጋናና የምልጃ መዝሙር በትዝታ ቅኝት',
    category: 'ትዝታ ቅኝት',
    difficulty: 'Intermediate',
    level: 'Basic 1',
    teacher: 'አቶ ታፈሰ / Abel Begena',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3',
    videoUrl: 'https://www.youtube.com/embed/2GpKxNl_KW0',
    notation: '2 4 2 3 1 1 5 5 1 3 1 5 2 2 4 2 3 1 1 5 5 1 3 1 5 2',
    lyrics: `የብርሃን እናት ነሽና የብርሃን እናት/፪/ 
ለምኝልን ድንግል ለምኝልን/፪/ 
ጸጋንና ክብርን የተሞላሽ። 
`,
    learningInstructions: 'የበገና ድርደራ ቁጥር፡ 2 4 2 3 1 1 5 5 1 3 1 5 2',
    status: 'Practicing'
  }
];

const DEFAULT_ASSIGNMENTS = [
  { id: 'ass_1', title: 'Chapter 1 Plucking Practice', dueDate: '2026-08-01', status: 'Pending', points: 100 },
  { id: 'ass_2', title: 'Cherenet Scale Melody', dueDate: '2026-08-15', status: 'In Progress', points: 100 }
];

const CHAPTER_2_MODULES = [
  {
    id: 'history',
    title: '📌 የበገና ታሪክ',
    shortDesc: 'የበገና አመጣጥ ታሪክ ከመጽሐፍ ቅዱስ ዘመን ጀምሮ እስከ ኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተክርስቲያን::',
    icon: '📜',
    content: {
      headline: 'የበገና ታሪካዊ አመጣጥ (Historical Origin)',
      sections: [
        {
          subTitle: 'የመጀመሪያው አመጣጥ',
          text: 'በገና በዓለማችን ላይ ከታዩ ጥንታዊ የሙዚቃ መሣሪያዎች አንዱ ነው። ታሪኩ ከብሉይ ኪዳን ዘመን ጋር የተያያዘ ሲሆን፣ በተለይም በንጉሥ ዳዊት ዘመን ለእግዚአብሔር ምስጋና ማቅረቢያ፣ ጸሎትና መንፈሳዊ መረጋጋት ማግኛ ሆኖ ያገለግል እንደነበረ በመጽሐፍ ቅዱስ ተመዝግቧል።'
        },
        {
          subTitle: 'ወደ ኢትዮጵያ የመግባቱ ታሪክ',
          text: 'ወደ ኢትዮጵያ የገባው በንግሥተ ሳባ ዘመን (ከክርስቶስ ልደት በፊት በ10ኛው ክፍለ ዘመን) ከንጉሥ ሰሎሞን ዘንድ ወደ ኢትዮጵያ ከመጡት እስራኤላውያን ጋር እንደሆነ ታሪካዊና ቤተክርስቲያናዊ መረጃዎች ያመላክታሉ።'
        },
        {
          subTitle: 'በኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተክርስቲያን',
          text: 'በኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተክርስቲያን ታሪክ ውስጥ በገና ለመንፈሳዊ አገልግሎት፣ በተለይም በዓበይት ጾም፣ በሰሙነ ሕማማት እና በጸሎት ጊዜያት አምላክን ለማመስገንና የሰው ልጅን ልብ ወደ ንስሐ ለመመለስ የሚያገለግል ታላቅ ቅዱስ መሣሪያ ሆኖ እስከ ዛሬ ጸንቶ ይገኛል።'
        }
      ]
    }
  },
  {
    id: 'concept',
    title: '📌 የበገና ምንነት',
    shortDesc: 'የበገና መንፈሳዊ ባህሪ፣ ልዩ የድምፅ አወቃቀሩ እና ከዓለማዊ መሣሪያዎች የሚለይበት ፍጹም ቅድስና::',
    icon: '✨',
    content: {
      headline: 'የበገና ምንነት እና ልዩ ባህሪያት (Concept & Nature)',
      sections: [
        {
          subTitle: 'የመሣሪያው ምንነት',
          text: 'በገና አሥር አሦር (Strings) ያለው፣ ትልቅ የእንጨት ሳጥንና የቁንጮ ክፍሎች ያሉት፣ በጣቶች ድርደራ ብቻ የሚጫወቱት የተቀደሰ የኪነ-ጥበብ መሣሪያ ነው።'
        },
        {
          subTitle: 'ከሌሎች መሣሪያዎች የሚለይባቸው ነጥቦች',
          text: 'ከሌሎች ዓለማዊ የሙዚቃ መሣሪያዎች (ለምሳሌ ከክራር ወይም ከጊታር) በሚከተሉት ነጥቦች ይለያል፡\n• ፍጹም መንፈሳዊነቱ፦ ለዓለማዊ ዳንስ ወይም ጨዋታ አይሆንም፤ ለእግዚአብሔር ምስጋናና ለጸሎት ብቻ ያገለግላል።\n• ድምፁና ዜማው፦ ልዩ የሆነ የግርማሞገስ፣ የዝማሬና የሕሊና መረጋጋት ድምፅ (Sound of Kinch/Buzzed Resonance) አለው።\n• የመጫወቻ ስልቱ፦ በጣቶች የቁጥር ድርደራ (Number Notation) የሚደረደር ሲሆን ድምፁ የሰውን ሕሊና ወደ አምላኩ ያቀርባል።'
        }
      ]
    }
  },
  {
    id: 'benefits',
    title: '📌 የበገና አገልግሎት ጥቅሞች',
    shortDesc: 'የበገና አገልግሎት መንፈሳዊ፣ ስነ-ልቦናዊ፣ ባህላዊና ማኅበራዊ ጥቅሞች::',
    icon: '🕊️',
    content: {
      headline: 'የበገና አገልግሎት ጥቅሞች (Benefits of Begena Service)',
      sections: [
        {
          subTitle: 'መንፈሳዊ ጥቅም',
          text: 'አእምሮን ከዓለማዊ ጭንቀት ማረጋጋት፣ ሕሊናን ወደ ንስሐና ወደ ጸሎት መምራት፣ ክፉ አሳቦችን ማስወገድ (እንደምሳሌ ንጉሥ ዳዊት በገና ሲደርድር የሳኦልን እኩይ መንፈስ ያርቅ እንደነበረ)።'
        },
        {
          subTitle: 'ስነ-ልቦናዊ ጥቅም',
          text: 'ትዕግሥትን፣ ጽናትን፣ የጸሎት ትኩረትን እና የውስጥ ሰላምን ያጎናጽፋል።'
        },
        {
          subTitle: 'ባህላዊና ማኅበራዊ ጥቅም',
          text: 'የኢትዮጵያን ጥንታዊ ሃይማኖታዊና ባህላዊ ቅርሶችን መጠበቅና ለተካታይ ትውልድ ማስተላለፍ፤ በጾምና በጸሎት ወቅት ሕዝቡን በጋራ መንፈሳዊ ትምህርትና መዝሙር ማነጽ።'
        }
      ]
    }
  },
  {
    id: 'types',
    title: '📌 የበገና አይነቶች',
    shortDesc: 'የበገና ዓይነቶች በአሠራር፣ በመጠን እና በጅማት ዓይነቶቻቸው::',
    icon: '🎵',
    content: {
      headline: 'የበገና ዓይነቶች (Types & Structural Variations)',
      sections: [
        {
          subTitle: 'የአሥር አሦር Standard Begena',
          text: 'በብዛት የሚታወቀውና አገልግሎት ላይ የሚውለው ሲሆን 5ቱ አሦሮች የሚሰሙ (የሚደረደሩ)፣ 5ቱ ደግሞ ድምፅ የማይሰጡ ረዳት አሦሮች ናቸው።'
        },
        {
          subTitle: 'በመጠን ልዩነት',
          text: '1. ትልቅ (የአዳራሽ/የቤተክርስቲያን) በገና፦ ትልቅ የድምፅ ሳጥን (Soundbox) ያለውና ከፍተኛ የድምፅ አስተጋባኦት የሚፈጥር።\n2. ትንሽ (የግል/የጸሎት) በገና፦ በግል ቤት ወይም በጸሎት ቦታ በቀላሉ ተይዞ የሚደረደር፣ አነስ ያለ የእንጨት ቅርፅ ያለው።'
        },
        {
          subTitle: 'በጅማት ዓይነት',
          text: 'ጥንታዊው በጅማት (ከላም ጅማት) የሚሠራ ሲሆን፣ በዘመናዊ መልኩ ደግሞ በናይሎን አሦሮች የሚሠራ ይገኛል።'
        }
      ]
    }
  },
  {
    id: 'expectations',
    title: '📌 ከበገና ደርዳሪያን ምን ይጠበቃል',
    shortDesc: 'ከበገና ደርዳሪ የሚጠበቁ መንፈሳዊ፣ ሥነ-ምግባራዊና ተግባራዊ መመሪያዎች::',
    icon: '🙏',
    content: {
      headline: 'ከበገና ደርዳሪያን ምን ይጠበቃል (Expectations from a Begena Player)',
      sections: [
        {
          subTitle: 'መንፈሳዊ ቅድስናና ንጽሕና',
          text: 'በገና ከመንካቱና ከመስደደሩ በፊት አእምሮውን በጸሎትና በንጽሕና ማዘጋጀት።'
        },
        {
          subTitle: 'ትሕትናና ስግደት',
          text: 'በገና ሲያዝ በትሕትና፣ ቀጥ ብሎ በመቀመጥ እና አምላክን በማክበር መደርደር።'
        },
        {
          subTitle: 'ትዕግሥትና ልምምድ',
          text: 'ድምፁን ሳይቸኩሉ፣ የጣቶችን አቀማመጥና የቅኝቱን ስሜት ጠብቆ በስርዓት መደርደር።'
        },
        {
          subTitle: 'ክብካቤና ማስተማር',
          text: 'በገናውን በንጹሕ ቦታ ማስቀመጥ፣ እንዳይጎዳ መንከባከብ፤ የተማሩትን ቅዱስ ዜማ ለቤተክርስቲያንና ለወገን በትሕትና ማገልገል።'
        }
      ]
    }
  }
];

const CHAPTER_4_MODULES = [
  {
    id: 'formation',
    title: 'የ ቅኝት አመሰራረት (Finger Practice Chords)',
    shortDesc: 'የቀኝና የግራ እጅ ድርደራ ቅደም ተከተል በቦርድ ቁጥሮችና ድምጾች።',
    icon: '🎼'
  },
  {
    id: 'dexterity',
    title: 'ጣት ማፍታታት (Finger Exercises)',
    shortDesc: 'የጣቶች ቅልጥፍና፣ ፍጥነትና የድምፅ ጥራት ማሻሻያ ተግባራዊ ልምምዶች።',
    icon: '🖐️'
  },
  {
    id: 'mezmurs',
    title: '📌 ትዝታ ቅኝት ላይ ያሉ መዝሙሮች',
    shortDesc: 'በትዝታ ቅኝት የተደረደሩና የተቃኙ የተቀደሱ መዝሙራት ስብስብ።',
    icon: '📜'
  }
];

const BEGENA_AMHARIC_INFO = {
  title: 'ስለ በገና ታሪክና ባህል (Begena History & Culture)',
  definition: 'በገና የ10 አሦር አውታር ያለው ጥንታዊ የኢትዮጵያ መንፈሳዊ የሙዚቃ መሣሪያ ነው። (The Begena is an ancient Ethiopian 10-stringed spiritual instrument).',
  history: 'በገና ከንጉሥ ዳዊት ዘመን ጀምሮ ለምስጋናና ለጸሎት ሲያገለግል የኖረ ቅዱስ መሣሪያ ነው። (Historically used since the era of King David for praise and prayer).',
  structure: '10 አውታሮች፣ ብርዝ (ድርድር የመጫኛ ቦታ)፣ ድምፅ ማጉያ ሳጥን (Resonance Box) እና ማስተካከያ ውጥረት መያዣዎችን ይዟል። (Consists of 10 strings, Birz buzz bridge, soundbox, and tuning pegs).',
  playingTechnique: 'በግራ እጅ ጣቶች አውታሮችን መያዝና በቀኝ እጅ ጣቶች በመደርደር ይጫወታል። (Played by holding/damping with left hand and plucking with right hand).',
  culturalSignificance: 'በኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተ ክርስቲያን በተለይም በዐቢይ ጾም ወቅት ለጸሎትና ለስብከት ያገለግላል። (Holds sacred spiritual significance in Ethiopian Orthodox tradition, especially during Lent).'
};

const BEGENA_HISTORY_MODULES = CHAPTER_2_MODULES;

// ==========================================================
// CHAPTER 3 DETAILED MODULE DATA
// ==========================================================
const CHAPTER_3_MODULES = [
  {
    id: 'parts',
    title: '📌 የበገና አካል ክፍሎች',
    shortDesc: 'የበገና ክፍሎች አሠራራቸውና ምሳሌነታቸው - ፪.፩. የበገና አካል ክፍሎች።',
    icon: '🎼',
    content: {
      headline: 'የበገና ክፍሎች አሠራራቸውና ምሳሌነታቸው',
      sections: [
        {
          subTitle: '፪.፩. የበገና አካል ክፍሎች (ዝርዝር)',
          text: '• መቃኛ\n• መስቀል (ጌጥ)\n• ቀንበር\n• አውታር\n• ምሰሶ\n• የድምፅ ሣጥን\n• እንዚራ\n• ብርሁማ\n• መወጠሪያ'
        },
        {
          subTitle: '1. ቀንበር',
          text: 'ከላይ የሚገኘው አግዳሚ ሲሆን፤ አውታሩ የሚወጠርበት እና መቃኛው የሚያርፍበት የላይኛው ክፍል ነው። የሚሠራውም ከደረቅ እንጨት ተጠርቦ እና ለዝቦ እንዲሁም በልዩ ጥበብ ተውቦ ነው። ቀንበር የእኀዜ ኩሉ እግዚአብሔር ምሳሌ ነው። ይህም በላይ በሰማይ ሆኖ የሚያስተዳድር ጌታ፤ የሁሉ የበላይ መሆኑን ያጠይቃል። የእግዚአብሔርን ልዕልና ያመለክታል።'
        },
        {
          subTitle: '2. ምሰሶ',
          text: 'በግራና በቀኝ የሚገኝ ቋሚ እንጨት ሲሆን፤ የሚሠራውም ልክ እንደቀንበር ከደረቅ እንጨት ተጠርቦና ለዝቦ እንዲሁም በልዩ ጥበብ ተወቦና አጊጦ ነው። ምሳሌነቱም በቀኝ ያለው የፍቅረ እግዚአብሔር በግራ ያለው የፍቅረ ቢፅ፤ አንድም በቀኝ ያለው የቅዱስ ሚካኤል በግራ ያለው የቅዱስ ገብርኤል ምሳሌ ነው። በብሉይ ኪዳንና በሐዲስም ይመስላል፤ ይህም በሁለቱም ኪዳናት ያለው እርሱ እኀዜ ኩሉ አምላክ መሆኑን ያመለክታል።'
        },
        {
          subTitle: '3. አውታር',
          text: 'ብዛታቸው 10 ሲሆን ከበግ ወይም ከበሬ አንጀት ታጥቦና ተልጦ፤ በመገመድ እንዲደርቅ ከተደረገ በኋላ፤ በግኖና ከሮ፤ ከላይ እስከታች ተወጥሮ በቍጥር ተቀምጦ ይሠራል። ምሳሌነቱም የዐሥርቱ ትእዛዛት እለት ነው። አስተሳሰራቸውም እንደየውፍረታቸው ለተገቢው ድምፅ በመለየት ነው። ለምሳሌ ከሁሉም አውታሮች በአንጻራዊነት ወፍራሙ ድምፅ የሚኖረው ሁለት ቁጥር በመሆኑ፤ ወፈር ያለው አውታር በዚህ ይታሰራል። ቀጭን ድምፅ ደግሞ አምስት ላይ፤ ይልቁንም ደግሞ አራት ላይ ስለሚሆን፤ ቀጭኖቹ አውታሮች እንዲሁ በዚህ ይለያሉ። ይህም በአንጻራዊነት ብዙ መወጠር ሳይጠበቅብን አስፈላጊውን ድምፅ እንድናገኝ ይረዳናል።\n\nከአሥሩ አውታሮች በድርደራ የምንገርፍበት ወቅት ካልሆነ፤ ጣቶቻችን በዋናነት አምስቱን አውታሮች ነው የምንደራደረው። እነዚህም 1ኛ፣ 4ኛ፣ 6ኛ፣ 8ኛ እና 10ኛ አውታሮች ሲሆኑ በጣቶቻችን አቀማመጥ ከግራ ወደ ቀኝ 1፣ 2፣ 3፣ 4 እና 5 ብለን እንሰይማቸዋለን። እነዚህ አምስቱ ሲደረደሩ ሌሎቹ የተቀሩት አምስቱም አውታሮች ይነካሉ(ማረፊያ ይሆናሉ)።'
        },
        {
          subTitle: '4. የድምፅ ሣጥን (ገበቴ)',
          text: 'ከእንጨት እና የደረቀ ቆዳ ተፍቆና ተዳምጦ፤ የሚሠራ ሲሆን፤ አገልግሎቱም ድምፅ ለማስተላለፍ ነው። የበገናው ድምፅ የሚወጣውም ከዚህ ሣጥን ነው። ምሳሌነቱም የእመቤታችን የድንግል ማርያም፤ ይልቁንም የድንግልናዋ ምሳሌ ነው። የበገና ሣጥን ድፍን ሆኖ እንዲሁ የሚጣፈጥ፤ ያማረ ድምፅ እንደሚያወጣ ሁሉ፤ እመቤታችንም በድንግልና፤ ሕይወት የሆነውን አምላካችን ኢየሱስ ክርስቶስን ወልዳልናች ነው።'
        },
        {
          subTitle: '5. ብርኩማ',
          text: 'ትንሽ ዱካ (ወንበር) መሰል ከእንጨት የሚሠራ ሲሆን፤ ይህም 10ሩን እንዘራዎች ለማስቀመጥ ያገለግላል። በድምፅ ሣጥኑና በአውታሩ መካከል በመግባት፤ እንዘራና አውታር በእርሱ ላይ የተቀናበረው የንዝረቱን ድምፅ እንዲፈጥሩ ያገለግላል። ይህም ድምፅ ደግሞ ወደ ድምፅ ሣጥኑ ገብቶ ጎልቶ እንዲሰማ ያደርጋል። ምሳሌነቱም ሙሴ ዐሥርቱ ትእዛዛትን የተቀበለበትን የሲና ተራራን ይወክላል።'
        },
        {
          subTitle: '6. እንዚራ',
          text: 'ከቆዳ የሚሠራ ሲሆን በገና በሚደረደርበት ጊዜ አውታሮቹ ድዝና ጥዝ.. የሚል የንዝረት ድምፅ እንዲያወጡ የሚያደርግ ነው። ቦታውም በብርሁማ ላይ ሲሆን፤ አውታሮች በብርሁማ ላይ አርፈው በሚያልፉበት በሚሸፍኑት ርቀት አማካይ ላይ በአውታሩና በእንዘራው መካከል በመግባት፤ ከፍና ዝቅ አድርጎ በማስተካከል አስፈላጊውን የንዝረት ድምፅ እንዲሰጡ ይደረጋል። ብዛታቸውም አሥር ሲሆን ለእያንዳንዱ አውታር የየራሱ አንድ እንዘራ ይኖረዋል። የእንዚራዎች ምሳሌነታቸው በተጋድሎ ላይ ያሉ ክርስቲያኖች ነው።'
        },
        {
          subTitle: '7. መወጠሪያ',
          text: 'ከእንጨትና ከቆዳ የሚሠራ ሲሆን ከታችኛው የበገና ክፍል የሚገኝ ሆኖ አውታሮቹን ከቀንበሩ ጋር ለመወጠር ይጠቅማል። አሥሩ አውታሮች እነዚህን ሁለቱን፤ ቀንበሩንና መወጠሪያውን እንደሚያገናኙ ሁሉ፤ መወጠሪያ በሰዎች መኖሪያ /በምድር/ የተመሰለ ነው። ይህም ማለት ሰዎች በትእዛዛተ እግዚአብሔር መመላለስ ከምድር መኖሪያቸው ወደ መንግሥተ ሰማያት ለመግባታቸው ማስረከቢ ይሆናል ማለት ነው። መዝ 119÷105 "ሕግህ ለእግሬ መብራት ለመንገዴ ብርሃን ነው" እንዲል።'
        },
        {
          subTitle: '8. መቃኛ',
          text: 'ከቀጫጭን ጠንካራ እንጨቶች ወይም ከወፍራሙም ቢሆን ተጠርፎ ቀጥኖ እና በጥንቃቄ ቁመት አጥሮ የሚሠራ ሲሆን፤ አውታሩን በቀንበሩ ላይ አሥሮ ይይዛል፤ አስተሳሰሩም የራሱ ብልሃት ያለው ነው። ለመቃኘት አውታሮቹን ለማጥበቅና ለማላላት እንዲረዳ ተደርጎ ይታሰራል። የመቃኛ ብዛቱም ዐሥር ነው፤ ለእያንዳንዱም አውታር የየራሱ አንድ መቃኛ ይኖረዋል። የመቃኛ ምድርዊ ሕይወታቸውን በቅድስና፤ በሰማዕትነት፤ አሸንፈው ሰማያዊውን ድል በተቀዳጁ የቤተ ክርስቲያን ሰማያዊ አካል በጻድቃን ይመስላል።\n\nበተጨማሪም መቃኛ በመንፈስ ቅዱስ ይመስላል። አሥሩ ትእዛዛት መንፈሳውያን የሚያደርጉ፤ የመንፈስንም ፍሬ የሚያሰጡ በመሆናቸው ነው። ገላ 5÷22'
        },
        {
          subTitle: '9. ድህንጻ',
          text: 'ከቅንድ የሚሠራ መግረፊያ ሆኖ በግራ ምሰሶ ላይ የሚታሰር ሲሆን አገልግሎቱም ዐሥሩንም አውታሮች በመግረፍ ልዩ ድምፅ እንዲወጣ የሚያደርግ መሣሪያ ነው። ድህንጻ የክርስቶስ ምሳሌ ነው። በክርስቶስ መመሰሉም፤ ጌታችን መድኃኒታችን ኢየሱስ ክርስቶስ አስቀድሞ በኦሪት ለሰዎች የሰጣቸውን ዐሥሩን ትእዛዛት ደግሞ በሐዲስ ቃኝቷቸዋልና፤ የበለጠ አጥብቋቸዋልና ነው።'
        }
      ]
    }
  },
  {
    id: 'handling',
    title: '📌 የበገና አያያዝ',
    shortDesc: 'የበገና አደራደር (አጠቃቀም) ዘዴ እና የበገና ትክክለኛ አያያዝ ስርዓት።',
    icon: '🖐️',
    content: {
      headline: 'የበገና አደራደር (አጠቃቀም) ዘዴ እና የበገና አያያዝ',
      sections: [
        {
          subTitle: '፪.፪. የበገና አደራደር (አጠቃቀም) ዘዴ',
          text: '1. በድርደራ:- ማለት እያንዳንዱን ጣት በአውታሮቹ ላይ በማሳረፍ አምስቱን አውታሮች ቃኝተው የመደርደር ጥበብ ነው።\n2. በመግረፍ:- በድህንድ አማካይነት የበገናውን አሥሩንም አውታሮች በመቃኘት፤ በሚመች መልኩ የሚዘመርበት ጥንታዊ የበገና ዝማሬ ጥበብ ነው።'
        },
        {
          subTitle: '፪.፫. የበገና አያያዝ',
          text: 'በገና የሚደረደረው በግራ እጅ ጣቶች ነው። በተለያዩ ምክንያቶች የግራ እጅ የሌለው፤ ወይም የግራ እጅ ጣቶች የጎደሉበት ሰው ግን በቀኝ እጁ ጣቶች ይደርድራል። ትውፊቱ ግን የሚያዘው በግራ እጅ ጣቶች እንዲደረደር ነው። በሳይንሱ ግራ እጃችንን የሚያዘው፤ የስሜት ጣቢ የሆነው ቀኝ የአእምሯችን ክፍል ነው። (ኢሞሽናል ማይንድ) ይለዋል። እንደ ሳይንሱ ይህ የአእምሮ ክፍል እንደ ሙዚቃ፤ ፍቅር ወዘተ ያሉትን ጉዳዮች የሚያስተዳድር ነው። በመሆኑም በግራ እጃችን የምንጫወታቸው የዜማ መሣሪያዎች በርካታ ሆኑ ይለናል። በእርግጥ ሌሎች በርካታ የዜማ መሣሪያዎች የሚጫወቱት በግራ እጅ ነው።\n\nበቤተ ክርስቲያናችን በኩል ግን አባቶቻችን ለምን እንዲህ እንዳደረጉ ተጨማሪ ጥናት የሚያስፈልገው ነው። ትውፊቱን መጠበቅና ማስተላለፍ ግን ተገቢ ነው።\nበድርደራ ወቅት፤ የቀኝ እጅ ደግሞ በደረትቻችን በኩል የሚወለውን የግራ ምሰሶ ደግፎ በመያዝ፤ የግራ እጃችን ከተፅዕኖ ነፃ ሆኖ እንዲደርድር ይረዳዋል።\nበበገና የግራ እጅ ጣቶች በዐሥሩ አውታሮች ላይ አቀማመጣቸው በሥዕሉ ላይ እንደተመለከተው ይሆናል፦'
        },
        {
          subTitle: 'መግለጫ',
          text: 'በምስሉ ላይ እንደምንመለከተው በገናን በጣታችን የምንደርድርበት ወቅት ከአሥሩ አውታሮች ጣቶች ያረፉባቸው አምስቱ የሚደረደሩት ሲሆኑ የቀሩት አምስቱ ደግሞ ማረፊያ ናቸው። እነዚህ ማረፊያ ያልናቸው አምስቱ አውታሮች ወይም ጅማቶች ምንም አገልግሎት እንደሌላቸው ሊመስል ይችላል፤ ነገር ግን ብዙውን ጊዜ አጠገባቸው ካሉት የሚደረደሩ አውታሮች ጋር በተመሳሳይ ድምፅ ይቃኛሉ።\n\nበሚደረደሩበትም ጊዜ ሲመቱ ጣታችን ተነስተው የሚያረፉበት ቦታ ያውና ተመሳሳይ ድምፅ የተቀኙበት አውታር ላይ ስለሚሆን፤ የተለየ ድምፅ እንዳይኖር ያደርጋል። ጣቶቻችን እንደ ልብ መታዘዝ በሚጀምሩበት ጊዜም በተመሳሳይ ጊዜ በአንድ ጣት ሁለቱን አውታር በመምታት አንዱን ድምፅ በሁለት ምት በማበዛት የተቀላቀለ ድምፅ create ማድረግ ይቻላል። ከአምስቱ ዋና ዋና ድምፆች በስተቀር ሌሎቹ የማይደረደሩ አውታሮች በተመሳሳይ ድምፅ ሳይቃኙ በጣም ሳይወጠሩ በማላላት ድምፅ እንዳይሰጡ በማድረግም መጠቀም ይቻላል። ከዚህ በተጨማሪ ድህንድ በተባለ መደርደሪያ በመጠቀም ሲዘመርም ዐሥሩም አውታሮች ጥቅም ላይ ይውላሉ።'
        },
        {
          subTitle: 'የግራ እጅ ጣቶች የቁጥር ስያሜ',
          text: 'የጣት ቁጥር —————— የአውታር ቁጥር\n• አውራ ጣት —————— 1ኛ\n• አመልካች ጣት —————— 4ኛ\n• መካከለኛ ጣት —————— 6ኛ\n• ቀለበት ጣት —————— 8ኛ\n• ትንሿ ጣት —————— 10ኛ\n\nበድርደራ ወቅት ግን ቅደም ተከተላቸው ከአንድ እስከ አምስት ባለው ሳይሆን፤ በድምፆቻቸው ቅደም ተከተል ይሆናል። ሆኖም የአውታሮቹ ቁጥር ስያሜ ይቀየራል ማለት ግን አይደለም። ይህም ማለት የተለመደው የድምፆች ዑደት ከወፍራሙ ወደ ቀጭኑ በመሆኑ፤ በዚህ መሠረት በተለይ የቅኝቶችን ድምፅ ለመደርደር ወፍራሙ ከሆኑት ከሁለት ቁጥር መጀመር የተለመደ ነው።\n\n¹¹ በአሁኑ ሰዓት በድህንድ በገና መደርደር የሚችሉት ምን ያህል እንደሆኑ አይታወቅም፤ ነገር ግን ብዙ ሰዎች እንደሌሉ እዉን ነው። እንዲሁም ብዙ ጊዜ አገልግሎት ላይ ሲውል አይታይም። በመሆኑም ይህ የድርደራ ጥበብ እንዳይጠፋ ትኩረት ሊሰጠው ያስፈልጋል።'
        },
        {
          subTitle: 'የጣቶች አቀማመጥና የአውታር ቦታዎች',
          text: 'ከላይ የተገለጸው የአውታሮች ሥያሜ፤ በዐሥሩ አውታሮች መካከል የሚኖረው ቦታ እንደሚከተለው ይሆናል፦\n1. አውራ ጣት:- የበገናውን አንድ ቁጥር ወይም የመጀመሪያውን አውታር ይደርድራል።\n2. አመልካች ጣት:- የበገናውን አራተኛውን አውታር (ሁለት ቁጥር) ይደርድራል።\n3. መካከለኛ ጣት:- የበገናውን ስድስተኛውን አውታር ይደርድራል።\n4. ቀለበት ጣት:- የበገናውን ስምንተኛውን አውታር ይደርድራል።\n5. ትንሿ ጣት:- የበገናውን አሥረኛውን አውታር ይደርድራል።'
        }
      ]
    }
  }
];

// ==========================================================
// CHAPTER 5: CHERENET / ANCHI HOYE MEZMURS DATASET
// ==========================================================
interface CherenetMezmur {
  id: string;
  title: string;
  artist: string;
  notation: string;
  lyrics: string;
  noteBreakdown?: { section: string; notation: string }[];
}

const CHERENET_MEZMURS: CherenetMezmur[] = [
  {
    id: 'cher_1',
    title: 'ስለ ቸርነትህ',
    artist: 'ዘማሪ ይልማ ኃይሉ',
    notation: '231542- 3 45-13- 42 2 231542- 3 23 15 15 5',
    noteBreakdown: [
      { section: 'አዝማች (2x)', notation: '231542- 3  45-13- 42  2 ' },
      { section: 'በበገና (Instrumental)', notation: '4 5131542' },
      { section: 'ዘማች (Verse Chant)', notation: '231542- 3  23 15 15  5 - 231542- 3  23 15 15  5 231542- 3  23 15 15  5  231542- 3  23 15 15  5' }
    ],
    lyrics: `      ስለ ቸርነትህ ጌታ ተመስገን 
      ስለ ፍፁም ፍቅርህ አምላክ ተመስገን
ማነው የገመተ ከዛሬ መድረስን 
ልብሱ ሳይነካ በእሳቱ ወላፈን 
ባህሩን አሻግሮ ማዕበል አቁሞ 
እርሱ ያውቅልናል ለመጪው ቀን ደግሞ
አዝ...
        ሃሌ ሃሌ ሉያ መስዋዕት እናቅርብ
        ጌታ ይፈልጋል የተሰበረ ልብ
        ክርስቶስ ከሌለው ፍቅር ላይኖረው
        ሰላም ሰላም ይላል ፍጥረታዊው ሰው
        ሰላም ሰላም ይላል የዘመኑ ሰው 
        አዝ...
የኢየሱስ ነገር ለሚጠፉት ሁሉ
የመስቀሉ ነገር ለሚጠፉት ሁሉ
ሞኝነት መስሏቸው ክህደት ተሞሉ 
የስንፍና አመል እያናወዛቸው 
መጾም መጸለዩ ይጎዳናል ብለው 
አምላክን ቢክዱ ፍቅርን ነፈጋቸው`
  },
  {
    id: 'cher_2',
    title: 'መጾሙን ይጾማል',
    artist: 'ባህላዊ የቤገና መዝሙር',
    notation: '15-1515 151515 151551 42- 15-1515 151515 52- 45-11 42- 23-1551 1123-42 2 23 2325-4 13 544442 45131542',
    noteBreakdown: [
      { section: 'መጾሙን ይጾማል', notation: '15-1515  151515  151551  42-' },
      { section: 'ይደርሳል ሰዓቱ', notation: '15-1515  151515  52- 45-11  42-' },
      { section: 'የተሰቀለውን', notation: '23-1551  1123-42  2  23 2325-4 13  544442' },
      { section: 'በበገና', notation: '45131542' }
    ],
    lyrics: `መጾሙን ይጾማል ሁሉም የአዳም ልጅ ሁሉም የአዳም ልጅ 
የጊዜውን መድረስ የሚያውቅ የለም እንጂ 
የሚያውቅ የለም እንጂ የሚያውቅ የለም እንጂ 
        ይደርሳል ሰዓቱ ሳስብ ሌላ ሌላ ሳስብ ሌላ ሌላ 
        የተሰቀለውን ሥጋውን ሳልበላ 
        ሥጋውን ሳልበላ ሥጋውን ሳልበላ
ድጓ ጾመ ድጓ ተሰቅሎ ከቤቴ ተሰቅሎ ከቤቴ 
አወይ አለማወቅ ሳልማር መቅረቴ 
ሳልማር መቅረቴ ሳልማር መቅረቴ 
        ደግሜ ደግሜ ቀረኝ አሌፋቱ ቀረኝ አሌፋቱ
        አድኅነኒ ሣልል አትጥራኝ በከንቱ
        አትጥራኝ በከንቱ አትጥራኝ በከንቱ
እኔስ እሄዳለሁ አጣቢ ፍለጋ አጣቢ ፍለጋ
በጣም አድፎብኛል የለበስኩት ሥጋ
የለበስኩት ሥጋ የለበስኩት ሥጋ
        ዳዊት እንዴት ይሙት ሳልተዋወቀው ሳልተዋወቀው 
        የሚመጣውን ሁሉ በገና የሚያውቀው
        በገና የሚያውቀው በገና የሚያውቀው 
ዐርብ ረቡን ገደፈኩ በሥጋ በአዋዜ በሥጋ በአዋዜ
እንዲህ ለሚደርሰው ለማይቆየው ጊዜ 
ለማይቆየው ጊዜ ለማይቆየው ጊዜ
        ከሥጋው ሳልበላ ተጠይፌ ደሙን ተጠይፌ ደሙን
        ማን ይችለው ይሆን የላይ ቤት ረሃቡን
        የላይ ቤት ረሃቡን የላይ ቤት ረሃቡን
ከንብረቴ ሁሉ አልጋዬ ነው ሀብቴ አልጋዬ ነው ሀብቴ
አድርሶኝ ይመጣል ከዘላለም ቤቴ 
ከዘላለም ቤቴ ከዘላለም ቤቴ
        ብልህ ነው ስትሉኝ እዩት ሞኝነቴን እዩት ሞኝነቴን
        በራሴ ላይ ሆኖ አላውቀውም ሞቴን
        አላውቀውም ሞቴን አላውቀውም ሞቴን
መማሩንስ ዳዊት ተምሬ ነበረ ተምሬ ነበረ
ከአምላኪየ ሳልደርስ ልቤ ሰንፎ ቀረ 
ልቤ ሰንፎ ቀረ ልቤ ሰንፎ ቀረ 
       እንኳን ነአኩተከ በስመ አብም ቸገረኝ በስመ አብም ቸገረኝ
       ዳዊት እንዴት ተማርክ እባክህ ንገረኝ
       እባክህ ንገረኝ እባክህ ንገረኝ`
  },
  {
    id: 'cher_3',
    title: 'መች ይረሳል',
    artist: 'አቤል ተስፋዬ',
    notation: '52 -52-45131551-1 52 -52-4513 -2332- 42-2 5422- 4 -23151551 -1 5422- 4 -23151551 -1 1513-1- 23151551 -1 1513-1- 23154222 -2',
    lyrics: `መች ይረሳል የዋለልን ውለታ
ቸርነቱ እፁብ ፍቅሩ የጌታ
የታተመው በልባችን ጽላት 
ሞትን ገድሎ የሠጠንን ህይወት 
       በጥፋቱ ቢወጣ አዳም ከገነት
       ቃል ገባለት ዳግም ሊሠጠው ህይወት 
       ህያው ጌታ አምላክ ፈጣሪ ሳለ
       ስለ ቃሉ በእፀ መስቀል ላይ ዋለ
       አዝ...
በአይሁድ እጅ በጽኑ ተንገላታ
የፍቅር አባት ክርስቶስ የእኛ ጌታ
ሥጋው ደክሞ ቅዱስ ደሙ ፈሰሰ 
እዳችንን በሞቱ ደመሠሠ
አዝ...
        ስንጠላው እርሱ አብዝቶ ወደደን
        ስለ ፍቅሩ ሞትን ገድሎ አዳነን
        ባርነትን ኃጢአትን ከኛ ጥሎ
        ነፃ አወጣን በመስቀል ላይ ተሰቅሎ 
        አዝ...
ሰላማችን የድንግል ማርያም ፍሬ
ይገባዋል ምስጋናና ዝማሬ
ስለ ፍቅሩ ስላረገልን ሁሉ
ተቀኙለት ፍጥረታት ዝም አትበሉ`
  },
  {
    id: 'cher_4',
    title: 'አዝላው ወረደች',
    artist: 'ዘማሪ ይልማ ኃይሉ',
    notation: '3 15154 2332 42 315154 4444 54 315154 2332 42 315154 4444 54 4 4 515 13315 5 52 4 423 1 242 33 4445 5551 31 315154 3332 42 31 4445 5551 31 315154 3332 42',
    lyrics: `አዝላው ወረደች ወደ ግብጽ /2/ 
ስደተኛዋ የአምላክ እናት 
ይህ ዓለም ለእርሷ መች ተገባት 
አዝ…….
       ዓለም በምን ውሃ ታስተናግዳት 
       የፍቅር ምንጯ ተሟጦባት 
       እነ ኮቲባን እየላከች 
       የአምላከን እናት ተሳደበች 
       እነ ሄሮድስን እየላከች 
       ህፃኑን ልትገድል አሳደደች 
       አዝ……. 
የክብርን ጌታ ተሸክማ 
ውርደት ለበሰች እንደሸማ
የሀብቱን ጌታ በጀርባ አዝላ 
ሰው ተዘከራት ተቸግራ 
አዝ……. 
       በቃሉ ትዕዛዝ ምድርን ሰርቶ 
       ተንከራተተ ማደሪያ አጥቶ 
       ጌታ ሲወለድ የምስራች 
       በረት ሰጠችው ዓለም ታካች 
       አዝ……. 
ግና መላእክት በሰማያት
ሃሌሉያ አሉ በፍርሃት 
ወልድን በአብ ቀኝ ከላይ አይተው 
ደግሞም በምድር ከድንግል ክንድ
ከላይም ሳይጎል ተመልክተው /2/
አዝ…….
       ዓለም በምን ውሃ ታስተናግዳት 
       የፍቅር ምንጯ ተሟጦባት 
       እነ ኮቲባን እየላከች 
       የአምላከን እናት ተሳደበች 
       እነ ሄሮድስን እየላከች 
       ህፃኑን ልትገድል አሳደደች 
       አዝ…….       
በቃሉ ትዕዛዝ ምድርን ሰርቶ 
ተንከራተተ ማደሪያ አጥቶ 
ጌታ ሲወለድ የምስራች 
በረት ሰጠችው ዓለም ታካች 
አዝ…….`
  },
  {
    id: 'cher_5',
    title: 'ሠላምህ ይብዛላት',
    artist: 'አቤል ተስፋዬ በገና (በተማሪዎች የሚሰራ)',
    notation: '2315513 4324551',
    noteBreakdown: [
      { section: 'አዝማች', notation: '2315513…' },
      { section: 'ዘማች', notation: '4324551…' }
    ],
    lyrics: `ሠላምህ ይብዛላት ምድሪቱ
የሰው ልጅ እንዳይቀር በከንቱ /2/
        የሌለንን ሰላም እንሰብካለን
        በጎ ነገር ጠፍቶን እንጮሀለን
        ጸሎት ልመናችን ከንቱ እንዳይቀር
        ሰላምን ላክልን እግዚአብሔር
        አዝ...
የካም ልጆች በዝተው በምድር ላይ
ገመናን ገለጡ በአደባባይ
ፍፁምነት ጠፍቶ ከልባቸው
በክፋት ተመላ ጉባኤያቸው
አዝ...
        በሰላም ቤት ቆመን ሰላም ጠፍቷል
        ታንኳችን በነፋስ ተጨናንቋል
        አድነን ጌታ በሆይ እንዳንጠፋ
        ገስፀው ማዕበሉን ሁነን ተስፋ
        አዝ...
አለም ስለሰላም ቢዘምርም
ምድራችን ከሠላም አርፋ አታውቅም
ሰላማችን አንተን ስንይዝ ነው
እውነተኛ ሰላም የምናገኘው`
  },
  {
    id: 'cher_6',
    title: 'በይስሐቅ ፈንታ',
    artist: 'ዘማሪ ይልማ ኃይሉ',
    notation: '3 142 22 42',
    noteBreakdown: [
      { section: 'አዝማች / ዘማች', notation: '3 142 22 42….' }
    ],
    lyrics: `      በይስሐቅ ፈንታ ኢየሱስ ታረደ 
      ደሙን ከፈለና አዳምን ታደገ 
ተጨነቀ ጌታ ተሰቃየ ጌታ 
የኔ መድኃኔዓለም የአዳም ልጅ አለኝታ
እንደሚታረድ በግ ተነዳ ወደ ሞት
ንፁሁ ኢየሱስ በደል የሌለበት  
አዝ...
       በማመን ሊሸከም የአዳምን መከራ 
       ስቃይ ተቀበለ ደሙ እየተዘራ 
       ለሚገርፉት ሁሉ ምህረትን ሲቸር 
       እርሱ ግን ሲገረፍ ብዙ ተቸገረ 
       አዝ...
የሰማነውንስ ማን ሰው እኮ አምኗል
የእግዚአብሔርስ ክንድ ለነማን ተገልጿል
ባየነውስ ጊዜ ህማም ተሸክሞ 
ስለበደላችን ተገርፎና ታሞ 
አዝ...
       እጁ የታሰረው ይስሐቅ ተፈታ 
       ኢየሱስ ቀረበ በሰው ልጆች ፈንታ 
       ንፁህ በግ ቀረበ በደል የሌለበት በደለኛ ሆኖ 
       ሊሰቀል ሊገደል መስቀሉን ተጭኖ 
       አዝ...
ተቆጠረ እንጂ እንደተቸገረ
በደዌ በህማም ማቆ እንደኖረ
አምላክ ለኛ ብሎ ተናቀ በሰዎች 
እየተፀየፉት ተፉበት ብዙዎች
አዝ... 
      በእውነት ደዌያችንን እርሱ ተቀበለ`
  }
];

export interface SelamtaMezmur {
  id: string;
  title: string;
  artist: string;
  notation: string[];
  lyrics: string;
}

const SELAMTA_MEZMURS: SelamtaMezmur[] = [
  {
    id: 'selamta_1',
    title: 'አባታችን',
    artist: 'መጋቤ ስብሐት አለሙ አጋ',
    notation: ['4245  313  15423  312  45', '4245  313  15442  4242'],
    lyrics: `አባታችን በሰማያት ላይ ያለህ 
ተለይቶ ይመስገን ክቡር ስምህ 
       መንግሥትህን የምንፈልጋት ከጥንቱ 
       በልጅነት ትምጣ ትሰጠን አቤቱ 
ፈቃድህም ይህ እንዲደረግ ይሁን
በሰማይ ሞተን ተነስተን ከደይን 
       እንድንኖር ምስጋናህ ምግብ ሆኖን 
       ዛሬም በምድር በሥጋ ሕይወት ሳለን 
ምግባችንን በየዕለቱ አውቀህ ስጠን 
ይቅር በለን የበደልንህም ቢኖር 
       ወንድማችን የበደለንን ነገር
       እንደአቅማችን እኛም እንድንል ይቅር 
በገሃነም በክፉ ሁሉ መዓት 
አትጣለን አድነን እንጂ ከሞት 
       ይህቺን መንግስት የማያገኛት ህልፈት 
       ጌትነትም ከሀሊነትም ክብርም 
ናቸውና የአንተ ገንዘቦች ሁሉም 
ለዓለም ወለዓለም ዓለም አሜን፡፡
       የተላከው ቅዱስ ገብርኤል ከጌታ  
       ሰላም ለኪ ብሎ በሰጠሽ ሰላምታ 
እኔ ባሪያሽ ልብሴን ስታጠቅ ስፈታ 
ሰላም ልልሽ ይገባኛል ጠዋት ማታ 
       ማርያም ሆይ እመቤቴ ሆይ ድንግል 
       በሥጋሽም በህሊናሽም ድንግል
የአሸናፊ የእግዚአብሔር እናት ድንግል 
እንዳለሽ ቅዱስ ገብርኤል ሰላም 
       ሰላም ለኪ እንደርሱ ሁሉ እኔም 
       የሌለብሽ የነፍስ የሥጋ መርገም 
ብሩክ ነው የማሕፀንሽ ፍሬም 
እንደቀድሞው ብሩክ አምላክ ነው ዛሬም 
       እግዚአብሔር ወልድ በመጣ ጊዜ ለካሳ
       እንበለ ዘር እንደ ንብና እንደ ዓሣ
ከነፍስሽ ነፍስ ከስጋፍ ሥጋ ቢነሳ
ደስ ያለሽ ሆይ ጸጋን አግኝተሽ ከጌታ 
      ደስ ይበልሽ በማቀርብልሽ ሰላምታ 
      ለምኚልን ሳትሰለቺ ጠዋት ማታ 
ውድ ልጅሽ እንዲያደርግልን ይቅርታ 
ይቅር ብሎ ኃጢአታችንን ሁሉን 
      እንዲያድነን በአንቺ ተማፅነን አለን 
      ለዓለም ወለዓለም ዓለም አሜን፡፡`
  },
  {
    id: 'selamta_2',
    title: 'ሰላም ለማርያም',
    artist: 'ዘማሪት ሶስና',
    notation: [
      '23  15  15  1515 11  31132',
      '23  15  31  113  242  45',
      '      423-1  113-1  113  242'
    ],
    lyrics: `ሰላም ለማርያም የአምላክ እናት
የአቤል የዋህት የአዳም ህይወት
እመቤቴ በምልጃሽ መድኃኒቴ ነሽ
       የአብ ቃል መቅረጫ ጽላቱ የሙሴ
       የመንፈስ ቅዱስ ቤት እመቃል ሞገሴ
የርኅራኄ መዝገብ እህተ መላእክት
የጻድቃን ተስፋቸው ጽላተ መለኮት  
        ትናንት ተጨንቀን በጨለማው ዓለም
        ዛሬ ብርሃን አየን በድንግል ማርያም
የኢያቄም እንቁ የሃና ንብረቷ
ሥጋ ነፍሴን እርጂያት ይቅርላት ቅጣቷ
        በወንጌል ሰማነው ድንግል የአንቺን ዜና
        አማላጅነትሽ ሲገለጽ በቃና
ከዳዊትም ሰማን ድንግል ስለአንቺ ክብር
ወትቀውም ንግሥት እያለ ሲዘምር
        በላዔሰብ ከሞት ከሲኦል የዳነው
        በምልጃሽ ነው እንጂ መች በጥርኝ ውሃ ነው
ሊውጡኝ ቢነሱ አጋንንት በመሉ
ስምሽን ስጠራ ትቢያ ይሆናሉ
        ጽዮን እመብርሃን ጽላተ ሥላሴ
        የበረከት ካዝና ደመወዜና ዋሴ
ሲጨንቀኝ ሲጠበኝ ሲከፋኝ ኑሮዬ
ድንግል አንቺ እኮ ነሽ አጽናኝ አለኝታዬ
        ስምሽን ስጠራ ሲታወክ ህይወቴ 
        አለሁልህ/ሽ በይኝ ድንግል እመቤቴ
ድንግል ሆይ አትርሺኝ የዘላለም ልብሴ
ምልጃሽ ያውጣኝ ከሞት ከከፋ ድምሳሴ
        የቅዱሳን ካባ የቅዱሳን ኩታ
        ጸጋ ሰማዕታት የድሆች አለኝታ
ሹመተ መሳፍንት ቅብዐ ነገሥታት
የሰሎሞን ዕውቀት የዳዊት መዝሙራት 
        ዓለም የዳነብሽ ከሞት ከሲኦል
        ለእኔስ እናቴ ነሽ ማርያም ድንግል
አድኚኝ እናቴ ከሥጋ ፈተና
እኔማ ያለአንቺ አልችልም ልጸና 
        ሸክም የከበደኝ እንግልት ሆኛለሁ
        ከእኔ እንዳትለይ አደራ እልሻለሁ
አደራ እልሻለሁ ከጎኔ አትራቂ
ወዳጅ ዘመድ የለኝ ያለአንቺ ጠባቂ 
       ተሳክቶልኝ ባየው ሀሳቤ ምኞቴ 
       ድንግል ያላንቺማ መች ይፀናል ቤቴ
ልጅሽ እንዳይነሳኝ መንግሥተ ሰማያት
ከኃጢአት ጠብቆ እንዲያኖረኝ ገነት
አንቺ ንገሪልኝ ለዓለም መድኃኒት
ተስፋዬ ነሽና አትርሺኝ የኔ እናት`
  },
  {
    id: 'selamta_3',
    title: 'ድንግል ስልሽ',
    artist: 'ዘማሪት ሶስና',
    notation: [
      '22-4 2315  454   22-4 231311  1',
      '1545 13 1113 15  454',
      '22-423132  542  542',
      '   22-4 2315  454   22- 4 231311   1542',
      '   22-4 2315  454   22-4 231311 1',
      '   1545 13 1113 15  454  5422-22   542  542'
    ],
    lyrics: `      ድንግል ስልሽ ማርያም ስልሽ 
      እንደ በላኤ ሰብ ይጋርደኝ ጥላሽ ድንግል ስልሽ
በጭንቅ ውስጥ ሆᖜ ከብዶኝ መከራ
የአምላክ እናት ስምሽን ስጠራ 
ታማልጂኝ ዘንድ ልቦናሽ ይራራ 
አዝ...
          ጭንቄ በረታ ሀዘን ከበበኝ
          ኃጢአቴ በዛ ተስፋ ቢስ ሆንኩኝ
          ድንግል እመቤቴ ምልጃሽ አይለየኝ 
          አዝ...
ልጅሽ በሰጠሽ ቃል ኪዳንሽ 
ተግተሽ ዘወትር እያማለድሽ
የሰውን ልጅ ሁሉ ታስምሪዋለሽ
አዝ... 
         ስምሽ እንደ ማር እየጣፈጠኝ
         ደግነትሽም እየመሰጠኝ
         ሁሌ እዘምራለሁ ልቤን ደስ እያለኝ
         አዝ... 
እምነቴ ሳስቶ ጽድቅም ባልሠራ 
እመቤቴ ሆይ ነፍሴን አደራ
አስታርቀሽ አኑሪያት ከቅዱሳን ጋራ
አዝ... 
        ድንግል በሃና በእናትሽ
        በኢያቄምም በአባትሽ
        ተማጽᖜሻለሁ ልቁም በፊትሽ
        አዝ...
አንቺን ስጠራ ልቤ ይረካል
ሀዘኔ ርቆ ሰላም ይተካል
ለሀዘንተኞች ተስፋ ከቶ እንዳንቺ የታል`
  },
  {
    id: 'selamta_4',
    title: 'እስመ አንተ',
    artist: 'መጋቤ ስብሐት አለሙ አጋ',
    notation: ['42 4 5 13 – 15 4 2 42 15'],
    lyrics: `በስመ አብ ወወልድ ወመንፈስ ቅዱስ። 
አሐዱ አምላክ ብዬ ሰላምታ ላድርስ። 
እስመ አንተ አምላከ ሰማይ ወምድር። 
እስመ አንተ ምሉዐ ፀጋ ወክብር።
ትባላለህ በነግህ በሰዓት በቀትር። 
ኢየሱስ ደግ ባለፀጋ ንጉሥ። 
ኢየሱስ በአፈ ኩሉ ውዱስ። 
ኢየሱስ ቀዳሴ ሥጋ ወነፍስ። 
ወደላይ ልቤን ሰደድኩት እንዲያይ።
ቢያየው ዕፁብ ድንቅ ነው ግሩም።
መንጦላእቱ የተጋረደው በፊቱ። 
የሚጥለው የሚዘረጋው አሽከር። 
አልታዘዝ ጭራሽ አይልም ፍጡር። 
ከአንተ ዘንድ አይኮራም አሉኝ ዘመድ። 
ከአንተ ደጅ አይኮራም አሉኝ ወዳጅ። 
ከአንተ ሲደርስ አይኮራም አሉኝ ንጉሥ። 
ከአንተ ሲደርስ አይኮራም አሉኝ ጳጳስ። 
አንተ እንጂ ነህ የማትዋረድ አታንስ። 
ብርቱ ዳኛ ያለ አንተ የለም ኃይለኛ።
አንተ ስትወድ ሁሉ ይሆናል ዘመድ። 
ብሉ ጠጡ ልበሱ ይላል በግድ።
አንተ ስትጠላ የሚሆን የለን ከለላ። 
በቀኝ ያለው ዞሮ ይቆማል በግራ።
ስትወድማ ስትመልስማ ፊትህን። 
በመፃጉዕ አይተነው የለ ጉድህን።
ፈጣሪዬ በከንቱ አለቀች እድሜዬ።
ሳልገዛ እያሸነፈኝ ሥጋዬ። 
ዳሩ ግና አዛኝ ርኅሩኅ ነህና። 
አደራህን የነፍሴን ነገር አትጥና።
መበስበስ ደግሞ አለ ገና መፍረስ።
መነሳት ደግሞ አለ ገና ፍርድ መስማት። 
ባሕቲቱ እስመ ለዓለም ምሕረቱ።
መላእክቱ አይሸፍቱበት ከቤቱ።
ሌላ ጌታ ያለ አንተ የለም በከንቱ። 
ደህና ዋሉ ደህና ሰንብቱ አርፍዱ።
የሚያውቅበት አንድም ሰው የለም በፍርዱ።
ስብሐት ለአብ ወወልድ ወመንፈስ ቅዱስ። 
ለዓለም እስከ ዘለዓለም ድረስ።
በተማሪዎች የሚሰራ`
  },
  {
    id: 'selamta_5',
    title: 'ሔደ መንኖ',
    artist: 'በተማሪዎች የሚሰራ',
    notation: ['22…'],
    lyrics: `ሔደ መንኖ (2)
አምላኩን አምኖ ሔደ መንኖ አምላኩን አምኖ
እንደእንጦስና እንደ መቃርስ
ሔደ ዳግመኛ ላይመለሥ
ድንጋይ ሊንተራስ ጤዛ ሊልሥ (2)
ገባ ገዳም (2)
ኮበለለና ከዓለም ጣዕም ገባ ገዳም
ሠው በህል ብቻ እንደማይኖር
በሀይማኖትና በቃል ጭምር
ይህን ሊያሥተምር ሊመሠክር (2)
ሔደ እርቆ (2)
የዚህን ዓለም ከንቱነት አውቆ ሔደ እርቆ
ዓለም ሣትንቀው እርሱ ንቋት
እርሷ ሣጥለው እርሱ ጥሏት
ፈራሽ መሆኗን በእውነት አይቷት (2)`
  },
  {
    id: 'selamta_6',
    title: 'ዓለም ማረፊያ ናት',
    artist: 'መጋቤ ስብሐት አለሙ አጋ',
    notation: ['233 42….'],
    lyrics: `ዓለም ማረፊያ ናት መኖሪያ ገነት/2/
ተነሱ እንከተል እኛም ከሄዱት 
    አፈር ከሸተተን ከያዘን በሽታ
    ብንቆርብ አንድንም ይህን ጊዜ እንበርታ
መቁረብ በህይወት ነው ንስሐ መግባት/2/
ይህ ሁሉ አይገኝም ከገቡ መሬት 
    ቆዳ እየለበሱ ከገዳም ሲኖሩ
    ከእነርሱ አይለይም የአምላካችን ፍቅሩ
ወርቅ የለበሰና ያጌጠ ፍጡር 
ክብሩ ሁሉ ቀረ ደረቀ እንደሳር 
     ይህን ተመልክቶ ይጠንቀቅ ፍጡር/2/ 
     በለስ ለመለመ መኸርም ደረሰ 
የሰውም ዘመኑ ሄደ ገሰገሰ
ሁል ጊዜ ይሰማል ቃለ ዮሐንስ
     አለሙን ለማዳን ስጋ በመልበስ
     ምሳሌ ደረሰ አምላከ ምህረት 
ገለባና ፍሬ የሚለይበት 
ገለባው ይወድቃል ፈጠኖ ወደ እሳት/2/
     ፍሬው ግን ይገባል ከቅዱሳን ቤት /2/
     ለአብረሃም ለይስሐቅ የሰጠኸውን 
ዛሬም ለህዝቦችህ ስጠን ህይወትን/2/
መጣጣር ከንቱ ነው ሁልጊዜ ለስጋ
     ጾምን ካላወቅን አትገኝም ፀጋ/2/
     ካለመጾም ሊያገኝ መንፈስ ቅዱስን
ፀጋ ብሎ ጠራው አንድ ሰው ልጁን 
የኦሪት ቃል ዘሎ ወንጌል ካዘዘው 
     ዋ ጊዜ ደረሰ አንዱን ሳልሰራው/2/ 
     ዋ ጊዜ ደረሰ ሳስብ ሌላ ሌላ
እጅግ ያታልላል የዚህ ዓለም ተድላ
ጥቂት ላይሰነብት ላይቆየን ለኋላ`
  },
  {
    id: 'selamta_7',
    title: 'ምን ያጣላችኋል',
    artist: 'መጋቤ ስብሐት አለሙ አጋ',
    notation: ['544445…'],
    lyrics: `ምን ያጣላችኋል ዋኔን
በመሬት ጉዳይ ዋኔን 
አሁን ዘር ሲጠፋ ዋኔን 
ይቀር የለም ወይ ዋኔን/፪/
ምድርን ጠላ መጥመቅ ዋኔን
ማን አስተማረው ዋኔን
እየጠራ አጠጣው ዋኔን 
ያንን ሁሉ ሰው ዋኔን/፪/ 
በል እደር ጆሮዬ ዋኔን
ነገ እቆርጥሃለው ዋኔን 
ባንተም ክፉ ነገር ዋኔን 
ሰምቼብሀለው ዋኔን/፪/
ወይ አላሳጨድነው ዋኔን
ወይ ከብት አልበላው ዋኔን
ከቶ መቼ ይሆን ዋኔን 
ያ ሳር ማለቂያው ዋኔን/፪/ 
ብላጨው አመመኝ ዋኔን
ብሠራው ከፋኝ ዋኔን
አንድ ራሴ እኮ ነው ዋኔን 
የሚያስጨንቀኝ ዋኔን/፪/
የሁዳዴውስ ጾም ዋኔን
ምንም አላለው ዋኔን
ሰው ሁሉ ያለቀው ዋኔን 
በማማቱ ነው ዋኔን/፪/
በባላገር ነበር ዋኔን
ኑሮስ የሚሻል ዋኔን
ከተማ ሰው ገብቶ ዋኔን 
ምን ሰው ይሆናል ዋኔን/፪/`
  },
  {
    id: 'selamta_8',
    title: 'በስመ ልዑል',
    artist: 'ዘማሪት ሶስና',
    notation: ['142 45….'],
    lyrics: `በስመ ልዑል በስመ አብ። 
በመንፈስ ቅዱስ ቅኔ ላቅርብ። 
ፈጣሪ በሰው ትዳኛለሀ። 
ድሀ ፊት ቆመህ ሲከስህ ድሀ። 
አባቴ ሞኙ አዳም ተላላ። 
በጠላት ምክር በለስ ትበላ። 
አባቴ ምነው አዳም አጅሬ። 
ሕግን አስጥሶ ከሰሰህ አውሬ። 
እንደምትነግሥ ነግሮህ ቀጣፊ። 
ሽሮ አለበሰህ ቅጠል ረጋፊ። 
ጠላት ሲመክር ተደግፎ ዛፍ። 
ለካ አለ ቅጣት ጸጋ መገፈፍ። 
የብርሃን ጸጋ የብርሃን ካባ። 
በለስ ስትበሉ ወዴት ገባ። 
ትዕዛዝ መጣስ ሕግን መድፈር። 
ሞትን ያመጣል ያገባል ከአፈር። 
ሔዋን እናቴ አታላይ ሰምታ። 
እርቃኗን ቆመች ጨለማ ገብታ። 
ማልቀስ ደግ ነው ያሰጣል ዋጋ። 
ንስሐ መግባት ያስገኛል ፀጋ። 
ፈጣሪያችን ሆይ ሕግን ሰርተህ። 
እኛ ብንሽረው ምን አመጣህ። 
ላትጨክን ትራራለሀ። 
ማን ያከብርሃል ሆነሃል ድሀ።
በእመ ልዑል በድንግል ማርያም። 
በሕያው ስምህ በመድኃኔዓለም። 
ሥጋ ነፍሳችን እንዳትደክም። 
መድኃኒታችን በአንተ እንታከም። 
ከላይ ዙፋንህ ጽርሐ አርያም። 
እዚህ የመጣህ እንዲድን ዓለም። 
ወዲህ ነውና ቢጠራህ አዳም። 
ባርከን ቀድሰን በድንግል ማርያም። 
በቀራንዮ ኤሎሄ ያልከው። 
ሰይጣንን መተህ ኃይል ያሳጣኸው። 
ለኛ ነውና ወደህ የሞትከው። 
ዲያብሎስ ይሻር ሰውን አይፍጀው። 
ስለነበረው አሁን ስላለው። 
የምታውቅ አንተ ስለሚመጣው። 
አትርሳን አንተ በፍርድ ሰዓት።`
  }
];

const CHERENET_CONVERTED_MEZMURS: BegenaMezmur[] = CHERENET_MEZMURS.map((c) => ({
  id: c?.id || '',
  title: c?.title || '',
  amharicTitle: c?.title || '',
  englishTitle: c?.title || '',
  description: `በቸርነት/አንቺ ሆዬ ቅኝት የተደረደረ የ${c?.title || ''} መዝሙር`,
  category: 'ቸርነት ቅኝት',
  difficulty: 'Intermediate',
  level: 'Basic 2',
  teacher: c?.artist || 'ዘማሪ / Abel Begena',
  audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
  videoUrl: 'https://www.youtube.com/embed/2GpKxNl_KW0',
  notation: c?.notation || '',
  lyrics: c?.lyrics || '',
  learningInstructions: `የበገና ድርደራ ቁጥር (ቸርነት ቅኝት)፡ ${c?.notation || ''}`,
  status: 'Practicing'
}));

const SELAMTA_CONVERTED_MEZMURS: BegenaMezmur[] = SELAMTA_MEZMURS.map((s) => ({
  id: s?.id || '',
  title: s?.title || '',
  amharicTitle: s?.title || '',
  englishTitle: s?.title || '',
  description: `በሰላምታ ቅኝት የተደረደረ የ${s?.title || ''} መዝሙር`,
  category: 'ሰላምታ ቅኝት',
  difficulty: 'Intermediate',
  level: 'Basic 3',
  teacher: s?.artist || 'መጋቤ ስብሐት አለሙ አጋ / Abel Begena',
  audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
  videoUrl: 'https://www.youtube.com/embed/2GpKxNl_KW0',
  notation: Array.isArray(s?.notation) ? s.notation.join(' ') : (s?.notation || ''),
  lyrics: s?.lyrics || '',
  learningInstructions: `የበገና ድርደራ ቁጥር (ሰላምታ ቅኝት)፡ ${Array.isArray(s?.notation) ? s.notation.join(' ') : (s?.notation || '')}`,
  status: 'Practicing'
}));

export const MASTER_MEZMURS_LIBRARY: BegenaMezmur[] = [
  ...DEFAULT_MEZMURS,
  ...CHERENET_CONVERTED_MEZMURS,
  ...SELAMTA_CONVERTED_MEZMURS
];

const CHAPTER_6_MODULES = [
  {
    id: 'formation',
    title: '📌 የ ቅኝት አመሰራረት',
    shortDesc: 'የሰላምታ ቅኝት የቦርድ ቁጥሮችና ድምፆች፣ የቀኝና የግራ እጅ ድርደራ ቅደም ተከተል።',
    icon: '🎼'
  },
  {
    id: 'mezmurs',
    title: '📌 ሰላምታ ቅኝት ላይ ያሉ መዝሙሮች',
    shortDesc: 'በሰላምታ ቅኝት የተዘጋጁ 8 የተቀደሱ መዝሙራት በጽሑፍና በድምፅ ድርደራ።',
    icon: '📜'
  }
];

// ==========================================================
// MAIN COMPONENT
// ==========================================================
interface BegenaLearningModuleProps {
  onNavigate: (page: string, params?: any) => void;
  lang: 'en' | 'am';
  enrollment?: StudentEnrollment;
}

export function BegenaLearningModule({ onNavigate, lang, enrollment }: BegenaLearningModuleProps) {
  const { currentUser, addNotification } = useAuth();
  const { enrollments, teachers } = useData();

  // Dynamic user-selected active course (Begena module container)
  const [activeCourse, setActiveCourse] = useState<'begena' | 'krar' | 'masenqo'>('begena');

  // Enforce begena view inside BegenaLearningModule
  useEffect(() => {
    setActiveCourse('begena');
  }, []);

  if (!isStudentAccessGranted(currentUser)) {
    return <RegistrationAndPaymentGate lang={lang} onNavigate={onNavigate} title="COURSE TUTORIALS & PRACTICE LOCKED" />;
  }

  // Instrument Enrollment Check for Students (Begena enrollment required)
  if (currentUser?.role === 'student' && !isStudentEnrolledInInstrument(currentUser, 'Begena', enrollments)) {
    return (
      <div className="bg-white border border-amber-200 p-8 sm:p-12 rounded-3xl text-center space-y-6 max-w-xl mx-auto my-8 shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto shadow-xs">
          <Lock size={32} />
        </div>
        <div className="space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#E89B52] bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            Begena Course Enrollment Required
          </span>
          <h2 className="font-display font-black text-2xl text-[#2B2B2B]">
            BEGENA PRACTICE & LEARNING PORTAL LOCKED
          </h2>
          <p className="text-xs text-gray-600 leading-relaxed">
            You are currently enrolled in another course (e.g., Kirar). Access to Begena practice tools, lessons, and 10-string scale simulators is granted exclusively to students enrolled in the Begena course.
          </p>
        </div>
        <div className="pt-2 flex flex-col sm:flex-row justify-center gap-3">
          <Button
            variant="primary"
            onClick={() => onNavigate('courses')}
            className="bg-[#E89B52] text-white text-xs font-bold py-2.5 px-5 rounded-xl shadow-xs"
          >
            Enroll in Begena Course
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

  // Simulator Toggle (Student mode vs. Teacher/Admin simulation mode)
  const [isSimulatorTeacherMode, setIsSimulatorTeacherMode] = useState(false);

  // Core Application State (loaded from localStorage for absolute persistent continuity)
  const [modules, setModules] = useState<BegenaModule[]>(() => {
    const saved = localStorage.getItem('begena_modules_v8') || localStorage.getItem('begena_modules_v7');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].title.includes('ምዕራፍ')) {
          return parsed;
        }
      } catch (e) {
        console.error(e);
      }
    }
    return DEFAULT_MODULES;
  });

  const [lessons, setLessons] = useState<BegenaLesson[]>(() => {
    const saved = localStorage.getItem('begena_lessons_v7') || localStorage.getItem('begena_lessons_v6') || localStorage.getItem('begena_lessons_v3');
    if (saved) {
      try {
        const parsed: BegenaLesson[] = JSON.parse(saved);
        return parsed.map((l) => {
          if (!l.videoUrl || l.videoUrl.includes('w3schools') || l.videoUrl.includes('mov_bbb') || l.videoUrl.includes('a2OOZGY_qo4')) {
            return { ...l, videoUrl: 'https://www.youtube.com/embed/2GpKxNl_KW0' };
          }
          return l;
        });
      } catch (e) {
        console.error(e);
      }
    }
    return DEFAULT_LESSONS;
  });

  const [exercises, setExercises] = useState<BegenaExercise[]>(() => {
    const saved = localStorage.getItem('begena_exercises_v3');
    return saved ? JSON.parse(saved) : DEFAULT_EXERCISES;
  });

  const [mezmurs, setMezmurs] = useState<BegenaMezmur[]>(() => {
    const saved = localStorage.getItem('begena_mezmurs_v10');
    if (saved) {
      try {
        const parsed: BegenaMezmur[] = JSON.parse(saved);
        if (parsed.length >= 20) {
          return parsed.map((m) => {
            if (!m.videoUrl || m.videoUrl.includes('w3schools') || m.videoUrl.includes('mov_bbb') || m.videoUrl.includes('a2OOZGY_qo4')) {
              return { ...m, videoUrl: 'https://www.youtube.com/embed/2GpKxNl_KW0' };
            }
            return m;
          });
        }
      } catch (e) {
        console.error(e);
      }
    }
    return MASTER_MEZMURS_LIBRARY;
  });

  const [assignments, setAssignments] = useState<BegenaAssignment[]>(() => {
    const saved = localStorage.getItem('begena_assignments_v3');
    return saved ? JSON.parse(saved) : DEFAULT_ASSIGNMENTS;
  });

  const [practiceLogs, setPracticeLogs] = useState<PracticeLog[]>(() => {
    const saved = localStorage.getItem('begena_practice_logs_v3');
    const defaults = [
      { date: '2026-07-20', duration: 45, exerciseTitle: 'Finger Plucking Exercise 01', notes: 'Grasping correct thumb positioning', reflectionDifficulty: ' alternations between string 2 and 3', reflectionImprovement: 'Keeping steady tempo' },
      { date: '2026-07-18', duration: 30, exerciseTitle: 'Standard Tezita Tuning', notes: 'Using drone reference matching', reflectionDifficulty: 'Tuning pegs are tight', reflectionImprovement: 'Acoustic ear accuracy' }
    ];
    return saved ? JSON.parse(saved) : defaults;
  });

  // Track state changes to localStorage
  useEffect(() => {
    localStorage.setItem('begena_modules_v8', JSON.stringify(modules));
  }, [modules]);

  useEffect(() => {
    localStorage.setItem('begena_lessons_v7', JSON.stringify(lessons));
  }, [lessons]);

  useEffect(() => {
    localStorage.setItem('begena_exercises_v3', JSON.stringify(exercises));
  }, [exercises]);

  useEffect(() => {
    localStorage.setItem('begena_mezmurs_v10', JSON.stringify(mezmurs));
  }, [mezmurs]);

  useEffect(() => {
    localStorage.setItem('begena_assignments_v3', JSON.stringify(assignments));
  }, [assignments]);

  useEffect(() => {
    localStorage.setItem('begena_practice_logs_v3', JSON.stringify(practiceLogs));
  }, [practiceLogs]);

  // Dynamic calculations
  const totalLessons = lessons.length;
  const completedLessons = lessons.filter((l) => l.isCompleted).length;

  const totalExercises = exercises.length;
  const completedExercises = exercises.filter((e) => e.status === 'Completed').length;

  const totalMezmurs = mezmurs.length;
  const completedMezmurs = mezmurs.filter((m) => m.status === 'Completed' || m.status === 'Approved').length;

  const totalAssignments = assignments.length;
  const approvedAssignments = assignments.filter((a) => a.status === 'Approved').length;

  // Active View Tab inside Begena Learning Module
  const [activeSubTab, setActiveSubTab] = useState<'roadmap' | 'virtual-begena' | 'lesson-page' | 'exercises' | 'mezmur-library' | 'cherenet-scale' | 'assignments' | 'chapter-8' | 'practice-tracker' | 'certificate-progress'>('roadmap');

  // Chapter completion tracking & Certificate Code verification with persistent unlock storage
  const [completedChapterIds, setCompletedChapterIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('begena_completed_chapters');
      return saved ? JSON.parse(saved) : ['roadmap'];
    } catch {
      return ['roadmap'];
    }
  });

  const courseProgressPercent = useMemo(() => {
    const studentId = currentUser?.id || 'guest';
    const calc = calculateStudentProgress(studentId, 'begena', enrollment?.level);
    const totalChapters = 8;
    const localCompletedChapCount = completedChapterIds.filter((id) => id.startsWith('chapter-') || id === 'roadmap').length;
    const chapPct = Math.round((localCompletedChapCount / totalChapters) * 100);
    const localLessonCount = lessons.filter((l) => l.isCompleted).length;
    const localLessonPct = totalLessons > 0 ? Math.round((localLessonCount / totalLessons) * 100) : 0;
    return Math.min(100, Math.max(calc.progressPercent, chapPct, localLessonPct));
  }, [currentUser?.id, enrollment?.level, completedChapterIds, lessons, totalLessons]);

  useEffect(() => {
    if (currentUser?.id) {
      syncStudentProgressToEnrollment(currentUser.id, 'begena', enrollment?.id, courseProgressPercent);
    }
  }, [currentUser?.id, enrollment?.id, courseProgressPercent]);

  const [unlockedChapterIds, setUnlockedChapterIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('begena_unlocked_chapters');
      return saved ? JSON.parse(saved) : ['roadmap'];
    } catch {
      return ['roadmap'];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('begena_completed_chapters', JSON.stringify(completedChapterIds));
    } catch (e) {
      console.error('Failed to save completed chapters:', e);
    }
  }, [completedChapterIds]);

  useEffect(() => {
    try {
      localStorage.setItem('begena_unlocked_chapters', JSON.stringify(unlockedChapterIds));
    } catch (e) {
      console.error('Failed to save unlocked chapters:', e);
    }
  }, [unlockedChapterIds]);
  const [teacherCodeInput, setTeacherCodeInput] = useState<string>('');
  const [isCertificateUnlocked, setIsCertificateUnlocked] = useState<boolean>(false);
  const [teacherCodeError, setTeacherCodeError] = useState<string>('');

  // Active Selected Module in Chapter 2 (or null for all modules list)
  const [activeCh2Module, setActiveCh2Module] = useState<string | null>(null);

  // Active Selected Module in Chapter 3
  const [activeCh3Module, setActiveCh3Module] = useState<string>('parts');

  // Active Selected Module in Chapter 4
  const [activeCh4Module, setActiveCh4Module] = useState<'formation' | 'dexterity' | 'mezmurs'>('formation');
  const [tunerDisplayMode, setTunerDisplayMode] = useState<'both' | 'tuner' | 'no'>('both');
  const [selectedScaleFilter, setSelectedScaleFilter] = useState<'all' | 'tizita' | 'cherenet' | 'selamta'>('all');
  const [librarySearchQuery, setLibrarySearchQuery] = useState<string>('');

  // Active Selected Module in Chapter 5 (Cherenet / Anchi Hoye)
  const [activeCh5Module, setActiveCh5Module] = useState<'formation' | 'mezmurs'>('formation');
  const [selectedCherenetMezmurId, setSelectedCherenetMezmurId] = useState<string>('cher_1');
  const [completedCherenetMezmurs, setCompletedCherenetMezmurs] = useState<string[]>(['cher_1']);
  const activeCherenetMezmur = CHERENET_MEZMURS.find((m) => m && m.id === selectedCherenetMezmurId) || CHERENET_MEZMURS[0];

  // Active Selected Module in Chapter 6 (Selamta Scale)
  const [activeCh6Module, setActiveCh6Module] = useState<'formation' | 'mezmurs'>('formation');
  const [selectedSelamtaMezmurId, setSelectedSelamtaMezmurId] = useState<string>('selamta_1');
  const [searchSelamtaQuery, setSearchSelamtaQuery] = useState<string>('');
  const activeSelamtaMezmur = SELAMTA_MEZMURS.find((m) => m && m.id === selectedSelamtaMezmurId) || SELAMTA_MEZMURS[0];

  // Currently Selected Lesson for the Lesson Viewer
  const [selectedLessonId, setSelectedLessonId] = useState<string>('les_1_1');
  const activeLesson = lessons.find((l) => l && l.id === selectedLessonId) || lessons[0];

  // Currently Selected Exercise for the Practice Tool
  const [selectedExerciseId, setSelectedExerciseId] = useState<string>('ex_1');
  const activeExercise = exercises.find((e) => e && e.id === selectedExerciseId) || exercises[0];

  // Currently Selected Mezmur
  const [selectedMezmurId, setSelectedMezmurId] = useState<string>('mez_1');
  const activeMezmur = mezmurs.find((m) => m && m.id === selectedMezmurId) || mezmurs[0];

  // Active Assignment for Submission
  const [submittingAssignmentId, setSubmittingAssignmentId] = useState<string | null>(null);

  // PRACTICE TIMER STATE ENGINE
  const [timerActive, setTimerActive] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerPaused, setTimerPaused] = useState(false);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Practice session feedback values
  const [reflectionPracticeWhat, setReflectionPracticeWhat] = useState('');
  const [reflectionDifficulty, setReflectionDifficulty] = useState('');
  const [reflectionImprovement, setReflectionImprovement] = useState('');

  // Video Submission Camera Simulator state
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [isRecordingSim, setIsRecordingSim] = useState(false);
  const [recordedVideoSimUrl, setRecordedVideoSimUrl] = useState<string | null>(null);
  const videoPreviewRef = useRef<HTMLVideoElement | null>(null);

  // Interactive Sound Synth state for Number Notation player
  const [isPlayingSequence, setIsPlayingSequence] = useState(false);
  const [activeSequenceIndex, setActiveSequenceIndex] = useState<number | null>(null);
  const [activeReverseSequenceIndex, setActiveReverseSequenceIndex] = useState<number | null>(null);
  const [chordDisplayMode, setChordDisplayMode] = useState<'both' | 'tone' | 'number'>('both');
  const [tunerMapping, setTunerMapping] = useState<Record<string, string>>({
    '1': 'E',
    '2': 'C',
    '3': 'D',
    '4': 'A',
    '5': 'G',
  });
  const [tempo, setTempo] = useState(70);

  const getToneForNumber = (num: string): string => {
    const clean = num.replace(/[^1-5]/g, '');
    return tunerMapping[clean] || clean;
  };

  const getNoteTone = (
    num: string,
    scaleMode: 'cherenet' | 'tizita' | 'selamta' | 'bati' | 'ambassel' | 'anchihoye' = 'cherenet'
  ): string => {
    const clean = num.replace(/[^1-5]/g, '');
    if (!clean) return num;
    const mode = scaleMode === 'anchihoye' ? 'cherenet' : scaleMode;
    if (mode === 'cherenet') {
      // 2->C, 3->C#, 1->F, 5->F#, 4->A
      const cherenetMap: Record<string, string> = { '1': 'F', '2': 'C', '3': 'C#', '4': 'A', '5': 'F#' };
      return cherenetMap[clean] || clean;
    }
    if (mode === 'selamta') {
      // 2->C, 3->D, 1->F, 5->G, 4->A
      const selamtaMap: Record<string, string> = { '1': 'F', '2': 'C', '3': 'D', '4': 'A', '5': 'G' };
      return selamtaMap[clean] || clean;
    }
    if (mode === 'bati') {
      // 2->C, 3->E, 1->F, 5->G, 4->B
      const batiMap: Record<string, string> = { '1': 'F', '2': 'C', '3': 'E', '4': 'B', '5': 'G' };
      return batiMap[clean] || clean;
    }
    if (mode === 'ambassel') {
      // 2->C, 3->C#, 1->F, 5->G, 4->G#
      const ambasselMap: Record<string, string> = { '1': 'F', '2': 'C', '3': 'C#', '4': 'G#', '5': 'G' };
      return ambasselMap[clean] || clean;
    }
    // Tizita: 2->C, 3->D, 1->E, 5->G, 4->A
    const tizitaMap: Record<string, string> = { '1': 'E', '2': 'C', '3': 'D', '4': 'A', '5': 'G' };
    return tizitaMap[clean] || clean;
  };

  const parseNotationToNotes = (str: string): string[] => {
    if (!str) return [];
    const matches = str.match(/[1-5]|-/g);
    if (matches && matches.length > 0) {
      return matches;
    }
    return str.trim().split(/\s+/).filter(Boolean);
  };

  // Video Lesson States
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const videoPlayerRef = useRef<HTMLVideoElement | null>(null);

  // Administrative / Editing form states (used in simulator teacher mode)
  const [newModuleTitle, setNewModuleTitle] = useState('');
  const [newModuleDesc, setNewModuleDesc] = useState('');
  const [editingModuleId, setEditingModuleId] = useState<string | null>(null);

  const [newLessonTitle, setNewLessonTitle] = useState('');
  const [newLessonExplain, setNewLessonExplain] = useState('');
  const [newLessonNotation, setNewLessonNotation] = useState('');
  const [selectedModuleForLesson, setSelectedModuleForLesson] = useState('mod_1');

  const [newMezTitle, setNewMezTitle] = useState('');
  const [newMezAmharic, setNewMezAmharic] = useState('');
  const [newMezNotation, setNewMezNotation] = useState('');
  const [newMezLyrics, setNewMezLyrics] = useState('');

  const [teacherSelectedSubId, setTeacherSelectedSubId] = useState<string | null>(null);
  const [teacherScoreInput, setTeacherScoreInput] = useState('90');
  const [teacherFeedbackInput, setTeacherFeedbackInput] = useState('');

  // Audio Player states
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const toggleAudioLoop = () => {
    if (audioRef.current) {
      if (isAudioPlaying) {
        audioRef.current.pause();
        setIsAudioPlaying(false);
      } else {
        audioRef.current.play();
        setIsAudioPlaying(true);
      }
    }
  };

  // Begena Info Modal state
  const [showBegenaInfo, setShowBegenaInfo] = useState(false);

  // Start Practice Timer
  const startTimer = () => {
    setTimerActive(true);
    setTimerPaused(false);
  };

  const pauseTimer = () => {
    setTimerPaused(true);
  };

  const resumeTimer = () => {
    setTimerPaused(false);
  };

  const finishTimer = () => {
    setTimerActive(false);
    const durationMins = Math.max(1, Math.round(timerSeconds / 60));
    
    // Add practice log
    const newLog: PracticeLog = {
      date: new Date().toISOString().split('T')[0],
      duration: durationMins,
      exerciseTitle: activeExercise?.title || 'General Practice',
      notes: reflectionPracticeWhat || 'Manual session reflection.',
      reflectionDifficulty: reflectionDifficulty || 'None',
      reflectionImprovement: reflectionImprovement || 'Standard'
    };

    setPracticeLogs([newLog, ...practiceLogs]);
    setTimerSeconds(0);
    setReflectionPracticeWhat('');
    setReflectionDifficulty('');
    setReflectionImprovement('');

    addNotification(
      'Practice Session Finished!',
      `You practiced for ${durationMins} minutes. Streak preserved!`,
      'lesson'
    );
  };

  // Timer interval hook
  useEffect(() => {
    if (timerActive && !timerPaused) {
      timerIntervalRef.current = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    }
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [timerActive, timerPaused]);

  // Authentic Ethiopian Begena Acoustic String Tone Synthesizer
  // Recreates the deep, warm, resonant bass gut strings with Birz/Kinch bridge buzz and wooden box resonance
  const playBegenaNote = (
    note: string,
    customDuration?: number,
    scaleMode: 'tizita' | 'cherenet' | 'selamta' | 'bati' | 'ambassel' | 'anchihoye' = 'tizita'
  ) => {
    try {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtxClass) return;
      const audioCtx = new AudioCtxClass();
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      // Traditional Ethiopian Begena Pentatonic Scale Frequencies for each ቅኝት:
      // Tizita:   2: C3 (130.81), 3: D3 (146.83), 1: E3 (164.81), 5: G3 (196.00), 4: A3 (220.00)
      // Cherenet: 2: C3 (130.81), 3: C#3 (138.59), 1: F3 (174.61), 5: F#3 (185.00), 4: A3 (220.00)
      // Selamta:  2: C3 (130.81), 3: D3 (146.83), 1: F3 (174.61), 5: G3 (196.00), 4: A3 (220.00)
      // Bati:     2: C3 (130.81), 3: E3 (164.81), 1: F3 (174.61), 5: G3 (196.00), 4: B3 (246.94)
      // Ambassel: 2: C3 (130.81), 3: C#3 (138.59), 1: F3 (174.61), 5: G3 (196.00), 4: G#3 (207.65)
      const tizitaMap: { [key: string]: number } = {
        '1': 164.81, // E3
        '2': 130.81, // C3
        '3': 146.83, // D3
        '4': 220.00, // A3
        '5': 196.00, // G3
        '6': 261.63, // C4
        'E': 164.81,
        'C': 130.81,
        'D': 146.83,
        'A': 220.00,
        'G': 196.00
      };

      const cherenetMap: { [key: string]: number } = {
        '1': 174.61, // F3
        '2': 130.81, // C3
        '3': 138.59, // C#3
        '4': 220.00, // A3
        '5': 185.00, // F#3
        'F': 174.61,
        'C': 130.81,
        'C#': 138.59,
        'A': 220.00,
        'F#': 185.00
      };

      const selamtaMap: { [key: string]: number } = {
        '1': 174.61, // F3
        '2': 130.81, // C3
        '3': 146.83, // D3
        '4': 220.00, // A3
        '5': 196.00, // G3
        'F': 174.61,
        'C': 130.81,
        'D': 146.83,
        'A': 220.00,
        'G': 196.00
      };

      const batiMap: { [key: string]: number } = {
        '1': 174.61, // F3
        '2': 130.81, // C3
        '3': 164.81, // E3
        '4': 246.94, // B3
        '5': 196.00, // G3
        'F': 174.61,
        'C': 130.81,
        'E': 164.81,
        'B': 246.94,
        'G': 196.00
      };

      const ambasselMap: { [key: string]: number } = {
        '1': 174.61, // F3
        '2': 130.81, // C3
        '3': 138.59, // C#3
        '4': 207.65, // G#3
        '5': 196.00, // G3
        'F': 174.61,
        'C': 130.81,
        'C#': 138.59,
        'G#': 207.65,
        'G': 196.00
      };

      const mode = scaleMode === 'anchihoye' ? 'cherenet' : scaleMode;
      const noteMap =
        mode === 'cherenet'
          ? cherenetMap
          : mode === 'selamta'
          ? selamtaMap
          : mode === 'bati'
          ? batiMap
          : mode === 'ambassel'
          ? ambasselMap
          : tizitaMap;

      let freq: number | undefined;
      const trimmedNote = note.trim();

      if (noteMap[trimmedNote]) {
        freq = noteMap[trimmedNote];
      } else {
        const digits = trimmedNote.replace(/[^1-5]/g, '');
        if (digits.length > 0) {
          freq = noteMap[digits[0]];
        }
      }

      if (!freq) return;
      const now = audioCtx.currentTime;
      const duration = customDuration || 2.2;

      // Authentic Ethiopian Begena String & Buzz Synthesizer (Matching Mezmur simulation sound)
      const osc = audioCtx.createOscillator();
      const buzzOsc = audioCtx.createOscillator();
      const filter = audioCtx.createBiquadFilter();
      const gain = audioCtx.createGain();
      const buzzGain = audioCtx.createGain();

      // Clear main plucked gut string tone (sawtooth for natural harmonics)
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now);

      // Enzirt rattling leather buzzing sound over fundamental pitch
      buzzOsc.type = 'square';
      buzzOsc.frequency.setValueAtTime(freq * 3.015, now);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(Math.max(freq * 3.4, 600), now);

      gain.gain.setValueAtTime(0.75, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      buzzGain.gain.setValueAtTime(0.2, now);
      buzzGain.gain.exponentialRampToValueAtTime(0.001, now + Math.min(duration, 1.4));

      osc.connect(filter);
      buzzOsc.connect(buzzGain);
      buzzGain.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now);
      buzzOsc.start(now);
      osc.stop(now + duration);
      buzzOsc.stop(now + Math.min(duration, 1.4));

      setTimeout(() => {
        audioCtx.close().catch(() => {});
      }, duration * 1000 + 100);
    } catch (e) {
      console.warn('AudioContext not supported or blocked in iframe', e);
    }
  };

  // Sound Sequence Player (Plucks authentic Ethiopian Begena gut strings for Number Notation & Chords)
  const playNotationSequence = (
    sequenceStr: string,
    isReverseTrack: boolean = false,
    onComplete?: () => void,
    scaleMode: 'tizita' | 'cherenet' | 'selamta' | 'bati' | 'ambassel' | 'anchihoye' = 'tizita'
  ) => {
    if (isPlayingSequence) return;

    const rawNotes = parseNotationToNotes(sequenceStr);
    if (rawNotes.length === 0) return;

    setIsPlayingSequence(true);
    let index = 0;

    const playNext = () => {
      if (index >= rawNotes.length) {
        setIsPlayingSequence(false);
        setActiveSequenceIndex(null);
        setActiveReverseSequenceIndex(null);
        if (onComplete) onComplete();
        return;
      }

      if (isReverseTrack) {
        setActiveReverseSequenceIndex(index);
        setActiveSequenceIndex(null);
      } else {
        setActiveSequenceIndex(index);
        setActiveReverseSequenceIndex(null);
      }

      const noteToPlay = rawNotes[index];
      if (noteToPlay !== '-') {
        // Pluck authentic Ethiopian Begena string note with Birz buzz resonance
        playBegenaNote(noteToPlay, undefined, scaleMode);
      }

      index++;
      const delay = noteToPlay === '-' ? 180 : (60 / tempo) * 1000;
      setTimeout(playNext, delay);
    };

    playNext();
  };

  const playCombinedSequence = (
    forwardStr: string,
    reverseStr: string = '2 4 5 1 3 2',
    scaleMode: 'tizita' | 'cherenet' | 'selamta' | 'bati' | 'ambassel' | 'anchihoye' = 'tizita'
  ) => {
    if (isPlayingSequence) return;
    playNotationSequence(forwardStr, false, () => {
      setTimeout(() => {
        playNotationSequence(reverseStr, true, undefined, scaleMode);
      }, 400);
    }, scaleMode);
  };

  // Video Player Speed controller
  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoPlayerRef.current) {
      videoPlayerRef.current.playbackRate = speed;
    }
  };

  // Simulated Camera / Webcam recorder for Performance Submissions
  const toggleCamera = async () => {
    if (cameraActive) {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
      }
      setCameraStream(null);
      setCameraActive(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setCameraStream(stream);
        setCameraActive(true);
        if (videoPreviewRef.current) {
          videoPreviewRef.current.srcObject = stream;
        }
      } catch (err) {
        // Fallback for iframe restrictions - active simulation mode
        setCameraActive(true);
        addNotification(
          'Webcam Simulated',
          'Camera permissions restricted in preview iframe. Loading premium performance simulator.',
          'system'
        );
      }
    }
  };

  const startSimRecording = () => {
    setIsRecordingSim(true);
    addNotification('Recording Started', 'Capturing physical string plucks...', 'system');
    setTimeout(() => {
      // Simulate finish recording after 3 seconds
      setIsRecordingSim(false);
      setRecordedVideoSimUrl('https://www.w3schools.com/html/mov_bbb.mp4');
      addNotification('Recording Completed', 'Video preview generated. Ready to submit to Abel Begena.', 'system');
    }, 3000);
  };

  // Submit Performance Video to Teacher
  const submitAssignment = (asgId: string, notes: string) => {
    setAssignments(
      assignments.map((a) =>
        a.id === asgId
          ? {
              ...a,
              status: 'Submitted',
              submissionNotes: notes,
              submittedVideoUrl: recordedVideoSimUrl || 'https://www.w3schools.com/html/mov_bbb.mp4'
            }
          : a
      )
    );
    setSubmittingAssignmentId(null);
    setRecordedVideoSimUrl(null);
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
    }
    setCameraActive(false);

    addNotification(
      'Performance Submitted!',
      'Your video recording has been safely delivered to Lique Mezemer Abel for review.',
      'lesson'
    );
  };

  // Submit Mezmur practice record
  const submitMezmurPractice = (mezId: string) => {
    setMezmurs(
      mezmurs.map((m) =>
        m.id === mezId
          ? {
              ...m,
              status: 'Submitted for Review',
              studentRecordingUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
            }
          : m
      )
    );
    addNotification(
      'Mezmur Submitted',
      'Plucked audio recording sent to instructor review.',
      'lesson'
    );
  };

  // TEACHER SIMULATOR ACTIONS
  const handleTeacherGrade = (asgId: string, isApprove: boolean) => {
    setAssignments(
      assignments.map((a) =>
        a.id === asgId
          ? {
              ...a,
              status: isApprove ? 'Approved' : 'Needs Revision',
              teacherFeedback: teacherFeedbackInput || 'Excellent finger positioning. Pluck is clean.',
              grade: isApprove ? 'A' : 'C+'
            }
          : a
      )
    );
    setTeacherSelectedSubId(null);
    setTeacherFeedbackInput('');
    addNotification('Assignment Graded', `Sent evaluation response to student.`, 'system');
  };

  const handleTeacherMezmurGrade = (mezId: string, isApprove: boolean) => {
    setMezmurs(
      mezmurs.map((m) =>
        m.id === mezId
          ? {
              ...m,
              status: isApprove ? 'Approved' : 'Needs Improvement',
              teacherFeedback: teacherFeedbackInput || 'Beautiful resonance, work on steady tempo.',
              teacherScore: Number(teacherScoreInput) || 95
            }
          : m
      )
    );
    setTeacherSelectedSubId(null);
    setTeacherFeedbackInput('');
    addNotification('Mezmur Practice Graded', `Praise submission processed.`, 'system');
  };

  // Curriculum Admin Editing Functions
  const handleAddModule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newModuleTitle) return;
    const newMod: BegenaModule = {
      id: editingModuleId || 'mod_' + Math.random(),
      levelId: 'basic-1',
      title: newModuleTitle,
      description: newModuleDesc,
      order: modules.length + 1,
      isPublished: true,
      isLocked: false
    };

    if (editingModuleId) {
      setModules(modules.map((m) => (m.id === editingModuleId ? { ...m, title: newModuleTitle, description: newModuleDesc } : m)));
      setEditingModuleId(null);
    } else {
      setModules([...modules, newMod]);
    }
    setNewModuleTitle('');
    setNewModuleDesc('');
  };

  const handleAddLesson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLessonTitle) return;
    const newLes: BegenaLesson = {
      id: 'les_' + Math.random(),
      moduleId: selectedModuleForLesson,
      title: newLessonTitle,
      durationText: '10 mins',
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      pdfUrl: '#',
      explanation: newLessonExplain || 'Comprehensive written guidelines added by curriculum administrator.',
      notationSequence: newLessonNotation || '1 2 3 4 5',
      isCompleted: false
    };

    setLessons([...lessons, newLes]);
    setNewLessonTitle('');
    setNewLessonExplain('');
    setNewLessonNotation('');
    addNotification('Lesson Added', `Successfully published new lesson under ${modules.find(m => m.id === selectedModuleForLesson)?.title}`, 'system');
  };

  // Toggle Lock status on module
  const toggleLockModule = (modId: string) => {
    setModules(modules.map((m) => (m.id === modId ? { ...m, isLocked: !m.isLocked } : m)));
  };

  // Star Rating calculator for Practice Session
  const getPracticeStars = (minutes: number) => {
    if (minutes >= 45) return '⭐⭐⭐⭐⭐';
    if (minutes >= 30) return '⭐⭐⭐⭐';
    if (minutes >= 15) return '⭐⭐⭐';
    return '⭐⭐';
  };

  const totalMinutesThisWeek = practiceLogs.reduce((sum, item) => sum + item.duration, 0);

  // Certificate eligibility criteria checker
  const hasCompletedLessons = completedLessons >= 1;
  const hasCompletedExercises = completedExercises >= 1;
  const hasApprovedMezmur = mezmurs.some((m) => m.status === 'Approved' || m.status === 'Completed' || m.status === 'Submitted for Review');
  const hasApprovedAssignment = assignments.some((a) => a.status === 'Approved' || a.status === 'Submitted');
  const hasMetAttendance = true; // Simulated attendance from weekly checkins

  // Chapter definition array for tabs (9 Chapters + 10th Certificate Chapter)
  const CHAPTER_TABS = [
    { id: 'roadmap', label: 'Chapter 1', fullTitle: 'ምዕራፍ አንድ ፡ የበገና ስርአተ ትምህርት መንገድ', count: totalLessons },
    { id: 'lesson-page', label: 'Chapter 2', fullTitle: 'ምዕራፍ ሁለት ፡ የበገና ምንነት እና ታሪካዊ ዳራ', count: 5 },
    { id: 'exercises', label: 'Chapter 3', fullTitle: 'ምዕራፍ ሶስት ፡ የበገና ክፍሎች አሰራራቸው እና ምሳሌነታቸው', count: 2 },
    { id: 'mezmur-library', label: 'Chapter 4', fullTitle: 'ምዕራፍ አራት ፡ ትዝታ ቅኝት', count: mezmurs.length },
    { id: 'cherenet-scale', label: 'Chapter 5', fullTitle: 'ምዕራፍ አምስት ፡ ቸርነት / አንቺ ሆዬ ቅኝት', count: CHERENET_MEZMURS.length },
    { id: 'assignments', label: 'Chapter 6', fullTitle: 'ምዕራፍ ስድስት ፡ ሰላምታ ቅኝት', count: SELAMTA_MEZMURS.length },
    { id: 'chapter-8', label: 'Chapter 7', fullTitle: 'ምዕራፍ ሰባት ፡ የበገና መጨረሻ ፈተና', count: assignments.length },
    { id: 'certificate-progress', label: 'Certificate', fullTitle: 'ምዕራፍ ስምንት ፡ የምስክር ወረቀት መግቢያ', icon: Award }
  ];

  // Chapter completion & sequential unlock checks (unlocked chapters stay unlocked forever for the student)
  const isChapterUnlocked = (tabId: string): boolean => {
    if (tabId === 'virtual-begena') return true; // Virtual Studio is always unlocked
    if (unlockedChapterIds.includes(tabId) || completedChapterIds.includes(tabId)) return true;
    const index = CHAPTER_TABS.findIndex((ch) => ch.id === tabId);
    if (index <= 0) return true; // Chapter 1 (roadmap) is always unlocked
    const prevTab = CHAPTER_TABS[index - 1];
    const prevTabId = prevTab ? prevTab.id : '';
    return completedChapterIds.includes(prevTabId) || unlockedChapterIds.includes(prevTabId);
  };

  const getChapterCompletionStatus = (tabId: string): boolean => {
    return completedChapterIds.includes(tabId);
  };

  const markChapterCompletedAndAdvance = (currentTabId: string) => {
    let updatedCompleted = completedChapterIds;
    if (!completedChapterIds.includes(currentTabId)) {
      updatedCompleted = [...completedChapterIds, currentTabId];
      setCompletedChapterIds(updatedCompleted);
    }
    if (!unlockedChapterIds.includes(currentTabId)) {
      setUnlockedChapterIds((prev) => [...prev, currentTabId]);
    }

    const calculatedPct = Math.min(100, Math.round((updatedCompleted.length / CHAPTER_TABS.length) * 100));
    if (currentUser?.id) {
      syncStudentProgressToEnrollment(currentUser.id, 'begena', enrollment?.id, calculatedPct);
    }

    const currentIndex = CHAPTER_TABS.findIndex((ch) => ch.id === currentTabId);
    if (currentIndex < CHAPTER_TABS.length - 1) {
      const nextTab = CHAPTER_TABS[currentIndex + 1];
      if (!unlockedChapterIds.includes(nextTab.id)) {
        setUnlockedChapterIds((prev) => [...prev, nextTab.id]);
      }
      setActiveSubTab(nextTab.id as any);
      addNotification(
        'ተጠናቅቋል (Completed)',
        `ምዕራፍ ተጠናቋል። በራስ-ሰር ወደ ${nextTab.label} (${nextTab.fullTitle}) ተሸጋግረዋል። (${calculatedPct}% Completed)`,
        'system'
      );
    }
  };

  const isReadyForCertificate = isChapterUnlocked('certificate-progress');

  // Helper to render Prev / Next navigation footer for chapters
  const renderChapterNavFooter = (currentTabId: string) => {
    const currentIndex = CHAPTER_TABS.findIndex((ch) => ch.id === currentTabId);
    const prevTab = currentIndex > 0 ? CHAPTER_TABS[currentIndex - 1] : null;
    const nextTab = currentIndex < CHAPTER_TABS.length - 1 ? CHAPTER_TABS[currentIndex + 1] : null;
    const isCurrentCompleted = completedChapterIds.includes(currentTabId);

    return (
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-[#E7DED1] mt-8 bg-[#FAF6EF]/60 p-4 rounded-2xl border">
        {prevTab ? (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setActiveSubTab(prevTab.id as any)}
            className="gap-1.5 text-xs font-bold text-[#6F4E37] border-[#E7DED1] hover:bg-white cursor-pointer"
          >
            ← Previous ({prevTab.label})
          </Button>
        ) : (
          <div />
        )}

        {nextTab ? (
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="primary"
              size="sm"
              onClick={() => markChapterCompletedAndAdvance(currentTabId)}
              className="gap-2 text-xs font-bold bg-[#6F4E37] text-white hover:bg-[#5a3e2b] shadow-sm cursor-pointer py-2 px-5 rounded-xl"
            >
              <CheckCircle2 size={16} className="text-emerald-400" />
              <span>
                {isCurrentCompleted
                  ? `Completed ✓ (Go to ${nextTab.label}) →`
                  : `Completed — Open Next (${nextTab.label}) →`}
              </span>
            </Button>
          </div>
        ) : (
          <div />
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      
      {/* ----------------- PORTAL CONTROLLER HEADER ----------------- */}
      <div className="bg-[#FAF6EF] border-2 border-[#E7DED1] p-5 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 opacity-10 pointer-events-none">
          <TiletPattern />
        </div>
        
        <div className="space-y-2.5">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-[10px] bg-[#6F4E37] text-white px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
              Sacred Learning
            </span>
            {isSimulatorTeacherMode ? (
              <span className="text-[10px] bg-red-100 text-red-800 border border-red-200 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider flex items-center gap-1">
                <UserCheck size={12} /> Instructor Simulator Active
              </span>
            ) : (
              <span className="text-[10px] bg-green-100 text-green-800 border border-green-200 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider flex items-center gap-1">
                <CheckCircle2 size={12} /> Student Workspace
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 font-bold uppercase">My Learning Profile:</span>
            <select
              value={activeCourse}
              onChange={(e) => {
                const choice = e.target.value as any;
                setActiveCourse(choice);
                if (choice !== 'begena') {
                  addNotification('Course Switcher', `Switched workspace view to ${choice.toUpperCase()}`, 'system');
                }
              }}
              className="px-3 py-1 bg-white border border-[#E7DED1] rounded-md text-xs font-bold text-[#6F4E37] outline-none cursor-pointer"
            >
              <option value="begena">Begena - Basic 1</option>
              <option value="krar">Krar - Beginner (Placeholder)</option>
              <option value="masenqo">Masenqo - Intermediate (Placeholder)</option>
            </select>
          </div>
        </div>
      </div>

      {/* ----------------- CONDITIONAL WORKSPACE RENDERING ----------------- */}
      {activeCourse !== 'begena' ? (
        <div className="bg-white border border-[#E7DED1] p-12 rounded-2xl text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto text-[#E89B52]">
            <Music size={32} />
          </div>
          <h3 className="font-display font-black text-lg text-[#2B2B2B] uppercase">
            {activeCourse.toUpperCase()} LEARNING JOURNEY
          </h3>
          <p className="text-xs text-gray-500 max-w-md mx-auto leading-relaxed">
            The school administrators are progressively migrating structured, video-enabled digital curriculums for all folk instruments.
          </p>
          <div className="p-4 bg-[#FAF6EF] rounded-xl max-w-sm mx-auto border border-[#E7DED1] text-left text-xs text-gray-500 space-y-1">
            <span className="block font-bold text-[#6F4E37]">Ecosystem Schedule:</span>
            <p>• {activeCourse.toUpperCase()} Level 1 materials undergo review by Lique Mezemer Abel.</p>
            <p>• Live class portals are active under the Begena curriculum.</p>
          </div>
          <Button variant="primary" size="sm" onClick={() => setActiveCourse('begena')}>
            Return to Active Begena Classroom
          </Button>
        </div>
      ) : (
        <>
        {/* ==========================================================
           BEGENA CORE DIGITAL CLASSROOM EXPERIENCE
           ========================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* LEFT RAIL NAVIGATION */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white border border-[#E7DED1] p-4 rounded-2xl shadow-xs space-y-3 text-left">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Begena Academic Chapters
              </h3>
              
              <nav className="flex flex-col gap-1.5">
                {CHAPTER_TABS.map((item) => {
                  const unlocked = isChapterUnlocked(item.id);
                  const completed = getChapterCompletionStatus(item.id);

                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        if (unlocked) {
                          setActiveSubTab(item.id as any);
                          if (!unlockedChapterIds.includes(item.id)) {
                            setUnlockedChapterIds((prev) => [...prev, item.id]);
                          }
                        } else {
                          addNotification(
                            'Chapter Locked',
                            `Please complete previous chapter requirements to unlock ${item.label}.`,
                            'system'
                          );
                        }
                      }}
                      className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-bold uppercase transition-all flex justify-between items-center cursor-pointer ${
                        activeSubTab === item.id
                          ? 'bg-[#6F4E37] text-white shadow-xs'
                          : unlocked
                          ? 'bg-[#FAF6EF]/50 hover:bg-[#FAF6EF] text-[#6F4E37] border border-[#E7DED1]/60'
                          : 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed opacity-75'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {!unlocked ? (
                          <Lock size={12} className="text-gray-400 shrink-0" />
                        ) : completed ? (
                          <CheckCircle2 size={12} className="text-emerald-500 shrink-0" />
                        ) : null}
                        <span>{item.label}</span>
                      </div>
                      
                      <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                        activeSubTab === item.id ? 'bg-white/20 text-white' : unlocked ? 'bg-[#E7DED1] text-gray-600' : 'bg-gray-200 text-gray-400'
                      }`}>
                        {item.count !== undefined && item.count}{(item as any).max !== undefined && `/${(item as any).max}`}{(item as any).suffix || ''}
                        {item.id === 'certificate-progress' && (!unlocked ? 'Locked' : 'Ready')}
                      </span>
                    </button>
                  );
                })}
              </nav>

              {/* QUICK STATUS CARD */}
              <div className="border-t border-[#FAF6EF] pt-4 mt-3 space-y-2.5 text-xs text-gray-500">
                <div className="flex justify-between font-medium">
                  <span>Current Level:</span>
                  <span className="font-bold text-[#6F4E37]">Basic 1 (Level 1)</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Current Progress:</span>
                  <span className="font-bold text-green-600">{courseProgressPercent}%</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Primary Teacher:</span>
                  <span className="font-bold text-[#6F4E37]">
                    {(() => {
                      const userEnr = enrollments.find(e => e.studentEmail?.toLowerCase() === currentUser?.email?.toLowerCase());
                      if (userEnr && String(userEnr.learningMode || '').toLowerCase().includes('in-person')) {
                        return 'On-Site Campus Faculty (In-Person)';
                      }
                      return userEnr?.assignedTeacherName || 'Zemari Deacon Abel Tesfaye (Online)';
                    })()}
                  </span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Attendance Rate:</span>
                  <span className="font-bold text-green-600">96%</span>
                </div>
              </div>
            </div>

            {/* NESTED PRACTICE STATUS AD */}
            <div className="bg-[#FAF6EF] border border-[#E7DED1] p-4 rounded-2xl text-left space-y-3 relative overflow-hidden">
              <span className="text-[9px] font-bold tracking-widest text-[#E89B52] uppercase block">
                Today's practice
              </span>
              <div className="flex justify-between items-end">
                <div>
                  <h4 className="font-display font-black text-xl text-[#2B2B2B]">
                    {practiceLogs[0]?.date === new Date().toISOString().split('T')[0] ? practiceLogs[0].duration : 0} Mins
                  </h4>
                  <p className="text-[10px] text-gray-400">Target: 45 Mins</p>
                </div>
                <span className="text-sm">{getPracticeStars(practiceLogs[0]?.duration || 0)}</span>
              </div>
              <Button
                variant="primary"
                size="sm"
                className="w-full text-[10px] font-bold uppercase py-1 h-8 shadow-xs"
                onClick={() => setActiveSubTab('practice-tracker')}
              >
                Practice Now →
              </Button>
            </div>

            {/* STANDALONE VIRTUAL BEGENA STUDIO INDEPENDENT BUTTON */}
            <div className="bg-[#120a05] border-2 border-[#3d2414] p-3 rounded-2xl shadow-md space-y-2 text-left">
              <span className="text-[10px] font-mono font-bold text-amber-400/90 uppercase tracking-widest block">
                የበገና ልምምድ (Independent Tool)
              </span>
              <button
                onClick={() => setActiveSubTab('virtual-begena')}
                className={`w-full text-left px-3.5 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all flex justify-between items-center cursor-pointer border shadow-sm ${
                  activeSubTab === 'virtual-begena'
                    ? 'bg-[#3e2717] text-amber-300 border-amber-500 ring-2 ring-amber-400/60 shadow-lg'
                    : 'bg-gradient-to-r from-[#2b180d] to-[#3e2717] text-amber-100 hover:from-[#3e2717] hover:to-[#4e321e] border-amber-800/80 hover:border-amber-600'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Sliders size={16} className="text-amber-400 shrink-0" />
                  <span> Virtual Begena Studio</span>
                </div>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 font-mono font-bold px-2 py-0.5 rounded-full border border-amber-500/30">
                  10 Strings
                </span>
              </button>
            </div>
          </div>

          {/* MAIN CLASSROOM WORKSPACE CONTENT */}
          <div className="lg:col-span-3 space-y-6">

            {/* ---------------- VIRTUAL BEGENA STUDIO SUBTAB ---------------- */}
            {activeSubTab === 'virtual-begena' && (
              <div className="space-y-6">
                <BegenaScaleSimulatorBoard
                  scaleKey="tizita"
                  title="ቨርቹዋል የበገና 10 አውታሮች ድርደራ (Virtual Begena Studio)"
                  subtitle="ለእያንዳንዱ መዝሙርና ቅኝት ከተሰጡት አውታሮች እና ድምፆች ጋር በቀጥታም ሆነ በተገላቢጦሽ (Reverse) በመጫወት ይለማመዱ"
                  allowScaleChange={true}
                />
              </div>
            )}

            {/* ---------------- SUBTAB 1: ROADMAP WORKSPACE ---------------- */}
            {activeSubTab === 'roadmap' && (
              <div className="bg-white border border-[#E7DED1] p-6 rounded-2xl shadow-xs space-y-6 text-left">
                <div className="flex justify-between items-start flex-col sm:flex-row gap-4 border-b border-[#FAF6EF] pb-4">
                  <div>
                    <div className="inline-block bg-[#6F4E37] text-white font-black text-sm px-3.5 py-1 rounded-md mb-2 tracking-wide shadow-xs">
                      ቤሲክ አንድ
                    </div>
                    <h3 className="font-display font-black text-lg text-[#2B2B2B]">
                      ምዕራፍ አንድ ፡ የበገና ስርአተ ትምህርት መንገድ (Curriculum Roadmap)
                    </h3>
                    <p className="text-xs text-gray-500">
                      የቤሲክ አንድ ደረጃ ትምህርት እና የዝርዝር ምዕራፎች ማውጫ
                    </p>
                  </div>
                  {isSimulatorTeacherMode && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        setNewModuleTitle('');
                        setEditingModuleId(null);
                        setActiveSubTab('roadmap');
                      }}
                      className="gap-1 text-xs"
                    >
                      <Plus size={14} /> Add Curriculum Module
                    </Button>
                  )}
                </div>

                {/* TEACHER CURRICULUM EDITOR FORM */}
                {isSimulatorTeacherMode && (
                  <form onSubmit={handleAddModule} className="bg-red-50/50 border border-red-100 p-4 rounded-xl space-y-3 text-xs">
                    <span className="font-bold text-red-800 block">
                      {editingModuleId ? 'Edit Module Details' : 'Publish New Curriculum Module'}
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Input
                        required
                        placeholder="Module Title (e.g. Traditional Vibrato)"
                        value={newModuleTitle}
                        onChange={(e) => setNewModuleTitle(e.target.value)}
                      />
                      <Input
                        placeholder="Short description of technical outcomes"
                        value={newModuleDesc}
                        onChange={(e) => setNewModuleDesc(e.target.value)}
                      />
                    </div>
                    <div className="flex gap-2 justify-end">
                      <Button type="button" variant="ghost" size="sm" onClick={() => { setNewModuleTitle(''); setEditingModuleId(null); }}>
                        Cancel
                      </Button>
                      <Button type="submit" variant="destructive" size="sm">
                        {editingModuleId ? 'Save Changes' : 'Publish Module'}
                      </Button>
                    </div>
                  </form>
                )}

                {/* EXACT ROADMAP BREAKDOWN CARDS */}
                <div className="space-y-6">
                  {/* ምዕራፍ አንድ */}
                  <div className="bg-[#FAF6EF]/50 border border-[#E7DED1] rounded-2xl p-5 shadow-xs space-y-3.5 hover:border-[#6F4E37]/40 transition-all">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[#E7DED1] pb-3 gap-2">
                      <h4 className="font-bold text-base text-[#6F4E37] font-display">
                        ምዕራፍ አንድ ፡ የበገና ምንነት እና ታሪካዊ ዳራ
                      </h4>
                      <Button
                        variant="tertiary"
                        size="sm"
                        className="text-[11px] font-bold uppercase py-1 h-8 text-[#6F4E37] bg-white border border-[#E7DED1]"
                        onClick={() => {
                          setSelectedLessonId('les_1_1');
                          setActiveSubTab('lesson-page');
                        }}
                      >
                        ወደ ትምህርቱ ሂድ (Study) →
                      </Button>
                    </div>
                    <div className="space-y-2 text-xs text-gray-800 font-medium pl-2">
                      <div className="flex items-center gap-2.5"><span>📌</span> <span>የበገና ታሪክ</span></div>
                      <div className="flex items-center gap-2.5"><span>📌</span> <span>የበገና ምንነት</span></div>
                      <div className="flex items-center gap-2.5"><span>📌</span> <span>የበገና አገልግሎት ጥቅሞች</span></div>
                      <div className="flex items-center gap-2.5"><span>📌</span> <span>የበገና አይነቶች</span></div>
                      <div className="flex items-center gap-2.5"><span>📌</span> <span>ከበገና ደርዳሪያን ምን ይጠበቃል</span></div>
                    </div>
                  </div>

                  {/* ምዕራፍ ሁለት */}
                  <div className="bg-[#FAF6EF]/50 border border-[#E7DED1] rounded-2xl p-5 shadow-xs space-y-3.5 hover:border-[#6F4E37]/40 transition-all">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[#E7DED1] pb-3 gap-2">
                      <h4 className="font-bold text-base text-[#6F4E37] font-display">
                        ምዕራፍ ሁለት፡ የበገና ክፍሎች አሰራራቸው እና ምሳሌነታቸው
                      </h4>
                      <Button
                        variant="tertiary"
                        size="sm"
                        className="text-[11px] font-bold uppercase py-1 h-8 text-[#6F4E37] bg-white border border-[#E7DED1]"
                        onClick={() => {
                          setSelectedLessonId('les_1_2');
                          setActiveSubTab('lesson-page');
                        }}
                      >
                        ወደ ትምህርቱ ሂድ (Study) →
                      </Button>
                    </div>
                    <div className="space-y-2 text-xs text-gray-800 font-medium pl-2">
                      <div className="flex items-center gap-2.5"><span>📌</span> <span>የበገና አካል ክፍሎች</span></div>
                      <div className="flex items-center gap-2.5"><span>📌</span> <span>የበገና አያያዝ</span></div>
                    </div>
                  </div>

                  {/* ምዕራፍ ሶስት */}
                  <div className="bg-[#FAF6EF]/50 border border-[#E7DED1] rounded-2xl p-5 shadow-xs space-y-3.5 hover:border-[#6F4E37]/40 transition-all">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[#E7DED1] pb-3 gap-2">
                      <h4 className="font-bold text-base text-[#6F4E37] font-display">
                        ምዕራፍ ሶስት፡ ዜማ እና የበገና ቅኝቶች
                      </h4>
                      <Button
                        variant="tertiary"
                        size="sm"
                        className="text-[11px] font-bold uppercase py-1 h-8 text-[#6F4E37] bg-white border border-[#E7DED1]"
                        onClick={() => {
                          setSelectedLessonId('les_1_3');
                          setActiveSubTab('lesson-page');
                        }}
                      >
                        ወደ ትምህርቱ ሂድ (Study) →
                      </Button>
                    </div>
                    <div className="space-y-2 text-xs text-gray-800 font-medium pl-2">
                      <div className="flex items-center gap-2.5"><span>📌</span> <span>የቤተክርስቲያናችን ዜማ</span></div>
                      <div className="flex items-center gap-2.5"><span>📌</span> <span>ቅዱስ ያሬድ</span></div>
                      <div className="flex items-center gap-2.5"><span>📌</span> <span>የ ድምጾች ሳይንሳዊ አጠራር</span></div>
                    </div>
                  </div>

                  {/* ምዕራፍ አራት */}
                  <div className="bg-[#FAF6EF]/50 border border-[#E7DED1] rounded-2xl p-5 shadow-xs space-y-4 hover:border-[#6F4E37]/40 transition-all">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[#E7DED1] pb-3 gap-2">
                      <h4 className="font-bold text-base text-[#6F4E37] font-display">
                        ምዕራፍ አራት፡ ቅኝቶች እና ተግባራዊ ልምምዳቸው
                      </h4>
                      <Button
                        variant="tertiary"
                        size="sm"
                        className="text-[11px] font-bold uppercase py-1 h-8 text-[#6F4E37] bg-white border border-[#E7DED1]"
                        onClick={() => {
                          setSelectedLessonId('les_1_4');
                          setActiveSubTab('lesson-page');
                        }}
                      >
                        ወደ ትምህርቱ ሂድ (Study) →
                      </Button>
                    </div>

                    <div className="space-y-3 text-xs text-gray-800 font-medium pl-2">
                      <div className="flex items-center gap-2.5 font-bold text-amber-900"><span>📌</span> <span>የ ቅኝት አመሰራረት</span></div>
                      <div className="flex items-center gap-2.5 font-bold text-amber-900"><span>📌</span> <span>ጣት ማፍታታት</span></div>
                      <div className="flex items-center gap-2.5 font-bold text-amber-900"><span>📌</span> <span>ቅኝቶች</span></div>

                      {/* Nested Scales Hierarchy */}
                      <div className="pl-4 sm:pl-6 space-y-5 border-l-2 border-amber-300/70 ml-2 pt-1">
                        {/* ትዝታ */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 font-bold text-[#6F4E37] text-xs sm:text-sm">
                            <span>📍</span> <span>ትዝታ</span>
                          </div>
                          <div className="pl-4 sm:pl-6 space-y-2 text-gray-700">
                            <div className="flex items-center gap-2"><span>🔹</span> <span>ቅኝት አመሰራረት</span></div>
                            <div className="flex items-center gap-2 font-semibold text-gray-800"><span>🔹</span> <span>ትዝታ ቅኝት ላይ ያሉ መዝሙሮች</span></div>
                            <div className="pl-4 sm:pl-6 space-y-1.5 text-gray-600 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 pt-1">
                              <div className="flex items-center gap-1.5 bg-white p-2 rounded-lg border border-amber-100/80 shadow-2xs"><span>🔸</span> <span>ርግብ እና ዋኔን</span></div>
                              <div className="flex items-center gap-1.5 bg-white p-2 rounded-lg border border-amber-100/80 shadow-2xs"><span>🔸</span> <span>ገብረ መንፈስ ቅዱስ</span></div>
                              <div className="flex items-center gap-1.5 bg-white p-2 rounded-lg border border-amber-100/80 shadow-2xs"><span>🔸</span> <span>አቤቱ ደግ ሰው</span></div>
                              <div className="flex items-center gap-1.5 bg-white p-2 rounded-lg border border-amber-100/80 shadow-2xs"><span>🔸</span> <span>ኢትዮጲያ ሆይ ተነሽ</span></div>
                              <div className="flex items-center gap-1.5 bg-white p-2 rounded-lg border border-amber-100/80 shadow-2xs"><span>🔸</span> <span>ስቀለው ስቀለው</span></div>
                              <div className="flex items-center gap-1.5 bg-white p-2 rounded-lg border border-amber-100/80 shadow-2xs"><span>🔸</span> <span>አየሁኝ በ ህልሜ</span></div>
                            </div>
                          </div>
                        </div>

                        {/* ቸርነት/አንቺሆዬ */}
                        <div className="space-y-2 pt-2">
                          <div className="flex items-center gap-2 font-bold text-[#6F4E37] text-xs sm:text-sm">
                            <span>📍</span> <span>ቸርነት/አንቺሆዬ</span>
                          </div>
                          <div className="pl-4 sm:pl-6 space-y-2 text-gray-700">
                            <div className="flex items-center gap-2"><span>🔹</span> <span>ቅኝት አመሰራረት</span></div>
                            <div className="flex items-center gap-2 font-semibold text-gray-800"><span>🔹</span> <span>ቸርነት ቅኝት ላይ ያሉ መዝሙሮች</span></div>
                            <div className="pl-4 sm:pl-6 space-y-1.5 text-gray-600 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 pt-1">
                              <div className="flex items-center gap-1.5 bg-white p-2 rounded-lg border border-amber-100/80 shadow-2xs"><span>🔸</span> <span>ስለቸርነትህ</span></div>
                              <div className="flex items-center gap-1.5 bg-white p-2 rounded-lg border border-amber-100/80 shadow-2xs"><span>🔸</span> <span>መጾሙን ይጾማል</span></div>
                              <div className="flex items-center gap-1.5 bg-white p-2 rounded-lg border border-amber-100/80 shadow-2xs"><span>🔸</span> <span>መች ይረሳል</span></div>
                            </div>
                          </div>
                        </div>

                        {/* ሰላምታ */}
                        <div className="space-y-2 pt-2">
                          <div className="flex items-center gap-2 font-bold text-[#6F4E37] text-xs sm:text-sm">
                            <span>📍</span> <span>ሰላምታ</span>
                          </div>
                          <div className="pl-4 sm:pl-6 space-y-2 text-gray-700">
                            <div className="flex items-center gap-2"><span>🔹</span> <span>ቅኝት አመሰራረት</span></div>
                            <div className="flex items-center gap-2 font-semibold text-gray-800"><span>🔹</span> <span>ሰላምታ ቅኝት ላይ ያሉ መዝሙሮች</span></div>
                            <div className="pl-4 sm:pl-6 space-y-1.5 text-gray-600 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 pt-1">
                              <div className="flex items-center gap-1.5 bg-white p-2 rounded-lg border border-amber-100/80 shadow-2xs"><span>🔸</span> <span>ሆዴ ልመድ</span></div>
                              <div className="flex items-center gap-1.5 bg-white p-2 rounded-lg border border-amber-100/80 shadow-2xs"><span>🔸</span> <span>በጌቴ ሰማኒ</span></div>
                              <div className="flex items-center gap-1.5 bg-white p-2 rounded-lg border border-amber-100/80 shadow-2xs"><span>🔸</span> <span>በመስቀል ተሰቅሎ</span></div>
                              <div className="flex items-center gap-1.5 bg-white p-2 rounded-lg border border-amber-100/80 shadow-2xs"><span>🔸</span> <span>አባታችን</span></div>
                              <div className="flex items-center gap-1.5 bg-white p-2 rounded-lg border border-amber-100/80 shadow-2xs"><span>🔸</span> <span>ሰላም ለማርያም</span></div>
                              <div className="flex items-center gap-1.5 bg-white p-2 rounded-lg border border-amber-100/80 shadow-2xs"><span>🔸</span> <span>ድንግል ስልሽ</span></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Chapter 1 Navigation Footer */}
                {renderChapterNavFooter('roadmap')}
              </div>
            )}

            {/* ---------------- SUBTAB 2: CHAPTER 2 (የበገና ምንነት እና ታሪካዊ ዳራ) ---------------- */}
            {activeSubTab === 'lesson-page' && (
              <div className="bg-white border border-[#E7DED1] p-6 rounded-2xl shadow-xs space-y-6 text-left">
                {activeCh2Module === null ? (
                  <>
                    {/* CHAPTER 2 HEADER */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-[#FAF6EF] pb-4">
                      <div>
                        <span className="text-[10px] font-mono text-[#E89B52] uppercase font-bold tracking-wider">
                          ቤሲክ አንድ ፡ ምዕራፍ ሁለት
                        </span>
                        <h3 className="font-display font-black text-lg text-[#2B2B2B] mt-0.5">
                          ምዕራፍ ሁለት፡ የበገና ምንነት እና ታሪካዊ ዳራ
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
                          ከዚህ በታች ያሉትን የበገና መሠረታዊ ትምህርቶች አርእስት ይጫኑ፤ የእያንዳንዱን ትምህርት ዝርዝር ይዘት ያንብቡ::
                        </p>
                      </div>
                    </div>

                    {/* 5 MODULE BUTTON CARDS */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {CHAPTER_2_MODULES.map((mod) => (
                        <div
                          key={mod.id}
                          className="bg-[#FAF6EF]/60 border border-[#E7DED1] rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-[#6F4E37]/50 hover:shadow-sm transition-all group"
                        >
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="text-2xl">{mod.icon}</span>
                              <h4 className="font-bold text-base text-[#6F4E37] font-display group-hover:text-[#5a3e2b]">
                                {mod.title}
                              </h4>
                            </div>
                            <p className="text-xs text-gray-600 leading-relaxed pl-1">
                              {mod.shortDesc}
                            </p>
                          </div>

                          <div className="pt-2">
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => setActiveCh2Module(mod.id)}
                              className="w-full justify-between text-xs font-bold py-2 bg-[#6F4E37] hover:bg-[#5a3e2b] text-white rounded-xl cursor-pointer"
                            >
                              <span>ትምህርቱን አብራራ / View Module Content</span>
                              <ChevronRight size={14} />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    {/* MODULE DETAILED CONTENT VIEW */}
                    {(() => {
                      const selectedMod = CHAPTER_2_MODULES.find((m) => m.id === activeCh2Module) || CHAPTER_2_MODULES[0];
                      return (
                        <div className="space-y-6">
                          {/* TOP BAR / BACK BUTTON */}
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-[#FAF6EF] pb-4">
                            <button
                              onClick={() => setActiveCh2Module(null)}
                              className="flex items-center gap-2 text-xs font-bold text-[#6F4E37] bg-[#FAF6EF] hover:bg-[#f3ebd8] px-3.5 py-2 rounded-xl border border-[#E7DED1] transition-all cursor-pointer"
                            >
                              <ArrowLeft size={14} />
                              <span>← ወደ ምዕራፍ ሁለት ማውጫ ተመለስ (Back to Chapter 2 List)</span>
                            </button>

                            <span className="text-xs font-mono font-bold text-[#E89B52] bg-[#FAF6EF] px-3 py-1 rounded-lg border border-[#E7DED1]">
                              ምዕራፍ 2 ፡ {selectedMod.title}
                            </span>
                          </div>

                          {/* MODULE READING BODY */}
                          <div className="space-y-6 bg-[#FAF6EF]/30 border border-[#E7DED1] p-6 rounded-2xl">
                            <div className="flex items-center gap-3 pb-3 border-b border-[#E7DED1]">
                              <span className="text-3xl">{selectedMod.icon}</span>
                              <div>
                                <h3 className="font-display font-black text-xl text-[#2B2B2B]">
                                  {selectedMod.content.headline}
                                </h3>
                                <p className="text-xs text-gray-500 mt-0.5">
                                  መሠረታዊ የበገና ትምህርት ንባብ እና ጥናታዊ ማብራሪያ
                                </p>
                              </div>
                            </div>

                            {/* SECTIONS */}
                            <div className="space-y-5">
                              {selectedMod.content.sections.map((sec, idx) => (
                                <div key={idx} className="bg-white border border-[#E7DED1] p-5 rounded-xl space-y-2.5 shadow-2xs">
                                  <h4 className="font-bold text-sm text-[#6F4E37] flex items-center gap-2">
                                    <span className="w-2.5 h-2.5 rounded-full bg-[#E89B52]" />
                                    {sec.subTitle}
                                  </h4>
                                  <div className="text-xs text-gray-700 leading-relaxed font-sans whitespace-pre-line pl-4">
                                    {sec.text}
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* MODULE FOOTER ACTIONS */}
                            <div className="flex flex-wrap gap-3 justify-between items-center pt-4 border-t border-[#E7DED1]">
                              <button
                                onClick={() => setActiveCh2Module(null)}
                                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer"
                              >
                                <ArrowLeft size={14} />
                                <span>ወደ ማውጫ ተመለስ</span>
                              </button>

                              <div className="flex gap-2">
                                {(() => {
                                  const currentIdx = CHAPTER_2_MODULES.findIndex((m) => m.id === selectedMod?.id);
                                  const nextMod = currentIdx < CHAPTER_2_MODULES.length - 1 ? CHAPTER_2_MODULES[currentIdx + 1] : null;
                                  return nextMod ? (
                                    <button
                                      onClick={() => setActiveCh2Module(nextMod.id)}
                                      className="px-4 py-2 bg-[#6F4E37] hover:bg-[#5a3e2b] text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer"
                                    >
                                      <span>ቀጣይ ክፍል ({nextMod.title})</span>
                                      <ChevronRight size={14} />
                                    </button>
                                  ) : (
                                    <button
                                      onClick={() => setActiveSubTab('exercises')}
                                      className="px-4 py-2 bg-[#E89B52] hover:bg-[#d4863e] text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer"
                                    >
                                      <span>ወደ ምዕራፍ ሶስት ሂድ (Go to Chapter 3)</span>
                                      <ChevronRight size={14} />
                                    </button>
                                  );
                                })()}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </>
                )}
                {/* Chapter 2 Navigation Footer */}
                {renderChapterNavFooter('lesson-page')}
              </div>
            )}

            {/* ---------------- SUBTAB 3: BEGENA PARTS & HANDLING (CHAPTER 3) ---------------- */}
            {activeSubTab === 'exercises' && (
              <div className="bg-white border border-[#E7DED1] p-6 rounded-2xl shadow-xs space-y-6 text-left">
                <div className="flex justify-between items-center border-b border-[#FAF6EF] pb-4">
                  <div>
                    <h3 className="font-display font-black text-base text-[#2B2B2B] uppercase">
                      ምዕራፍ ሶስት ፡ የበገና ክፍሎች አሰራራቸው እና ምሳሌነታቸው
                    </h3>
                    <p className="text-xs text-gray-500">
                      የበገና አካል ክፍሎች፣ የአሰራር ጥበብ፣ ሃይማኖታዊ ምሳሌነታቸው እና የበገና ትክክለኛ አያያዝ ስርዓት
                    </p>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setShowBegenaInfo(true)}
                    className="text-xs bg-amber-50 border border-amber-200 text-[#6F4E37] font-bold"
                  >
                    📖 Read About Begena
                  </Button>
                </div>

                {/* CHAPTER 3 WORKSPACE GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* MODULES & DETAILED EXPLANATION COLUMN (2 Cols) */}
                  <div className="lg:col-span-2 space-y-5">
                    {/* Module Selection Tabs */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {CHAPTER_3_MODULES.map((mod) => {
                        const isActive = activeCh3Module === mod.id;
                        return (
                          <button
                            key={mod.id}
                            onClick={() => setActiveCh3Module(mod.id)}
                            className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                              isActive
                                ? 'bg-[#6F4E37] text-white border-[#6F4E37] shadow-md'
                                : 'bg-[#FAF6EF]/60 hover:bg-[#FAF6EF] text-[#2B2B2B] border-[#E7DED1]'
                            }`}
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="text-lg">{mod.icon}</span>
                                <span className="font-bold text-sm">{mod.title}</span>
                              </div>
                              <p className={`text-[11px] line-clamp-1 ${isActive ? 'text-amber-100' : 'text-gray-500'}`}>
                                {mod.shortDesc}
                              </p>
                            </div>
                            <ChevronRight size={16} className={isActive ? 'text-white' : 'text-gray-400'} />
                          </button>
                        );
                      })}
                    </div>

                    {/* Active Module Full Detailed Explained Content */}
                    {(() => {
                      const selectedMod = CHAPTER_3_MODULES.find((m) => m.id === activeCh3Module) || CHAPTER_3_MODULES[0];
                      return (
                        <div className="bg-[#FAF6EF]/40 border border-[#E7DED1] p-5 rounded-2xl space-y-4">
                          <div className="flex justify-between items-center border-b border-[#E7DED1] pb-3">
                            <div className="flex items-center gap-2">
                              <span className="text-2xl">{selectedMod.icon}</span>
                              <h4 className="font-display font-black text-base text-[#2B2B2B]">
                                {selectedMod.content.headline}
                              </h4>
                            </div>
                            <span className="text-[10px] bg-[#6F4E37] text-white px-2.5 py-1 rounded-full font-bold uppercase">
                              Chapter 3 Lesson
                            </span>
                          </div>

                          <div className="space-y-4">
                            {selectedMod.content.sections.map((sec, idx) => (
                              <div key={idx} className="bg-white p-4 rounded-xl border border-[#E7DED1]/80 shadow-2xs space-y-2">
                                <h5 className="font-bold text-sm text-[#6F4E37] flex items-center gap-1.5">
                                  <BookOpen size={14} className="text-[#E89B52]" />
                                  {sec.subTitle}
                                </h5>
                                <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-line">
                                  {sec.text}
                                </p>
                              </div>
                            ))}
                          </div>

                          <div className="pt-2 flex justify-end">
                            <button
                              onClick={() => {
                                if (selectedMod?.id === 'parts') {
                                  setActiveCh3Module('handling');
                                } else {
                                  setActiveSubTab('mezmur-library');
                                }
                              }}
                              className="px-4 py-2 bg-[#6F4E37] hover:bg-[#5a3e2b] text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer"
                            >
                              <span>{selectedMod?.id === 'parts' ? 'ቀጣይ፡ የበገና አያያዝ (Next Module) →' : 'ወደ ምዕራፍ አራት ሂድ (Go to Chapter 4) →'}</span>
                            </button>
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  {/* VIDEO PLAYER COLUMN (1 Col) - LEAVING VIDEO AS IS */}
                  <div className="lg:col-span-1 space-y-4">
                    <div className="bg-[#FAF6EF]/60 border border-[#E7DED1] p-3 rounded-xl space-y-2">
                      <span className="text-[10px] font-bold text-[#6F4E37] uppercase tracking-wider block">
                        📹 Demonstration Video
                      </span>
                      <div className="aspect-video bg-black rounded-lg overflow-hidden relative group border border-gray-800 shadow-sm">
                        {getYouTubeEmbedUrl(activeLesson.videoUrl) ? (
                          <iframe
                            src={getYouTubeEmbedUrl(activeLesson.videoUrl)!}
                            title={activeLesson.title}
                            className="w-full h-full border-0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                          />
                        ) : (
                          <video
                            ref={videoPlayerRef}
                            src={activeLesson.videoUrl}
                            className="w-full h-full object-cover"
                            controls
                          />
                        )}
                      </div>

                      {/* Speed Controls */}
                      <div className="flex justify-between items-center text-[10px] pt-1">
                        <span className="text-gray-500 font-medium">Speed:</span>
                        <div className="flex gap-1">
                          {[1.0, 1.25, 1.5].map((speed) => (
                            <button
                              key={speed}
                              onClick={() => {
                                setPlaybackSpeed(speed);
                                if (videoPlayerRef.current) videoPlayerRef.current.playbackRate = speed;
                              }}
                              className={`px-2 py-0.5 text-[9px] rounded font-bold cursor-pointer ${
                                playbackSpeed === speed ? 'bg-[#6F4E37] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                            >
                              {speed}x
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Chapter 3 Navigation Footer */}
                {renderChapterNavFooter('exercises')}
              </div>
            )}

            {/* ---------------- SUBTAB 4: CHAPTER 4 - ትዝታ ቅኝት ---------------- */}
            {activeSubTab === 'mezmur-library' && (
              <div className="bg-white border border-[#E7DED1] p-6 rounded-2xl shadow-xs space-y-6 text-left">
                {/* Chapter Header */}
                <div className="flex justify-between items-start flex-col sm:flex-row gap-4 border-b border-[#E7DED1] pb-4">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-[#C79A2B] uppercase tracking-wider block mb-1">
                      Chapter 4 Curriculum (ምዕራፍ አራት)
                    </span>
                    <h3 className="font-display font-black text-xl text-[#2B2B2B]">
                      ምዕራፍ አራት ፡ ትዝታ ቅኝት
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      የ ቅኝት አመሰራረት፣ ጣት ማፍታታት እና በትዝታ ቅኝት ላይ ያሉ መዝሙሮች
                    </p>
                  </div>
                </div>

                {/* Chapter 4 Module Selector Bar */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {CHAPTER_4_MODULES.map((mod) => (
                    <button
                      key={mod.id}
                      onClick={() => setActiveCh4Module(mod.id as any)}
                      className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                        activeCh4Module === mod.id
                          ? 'bg-[#FAF6EF] border-[#6F4E37] ring-1 ring-[#6F4E37]/30 shadow-xs'
                          : 'bg-white border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span className="text-2xl">{mod.icon}</span>
                      <div className="space-y-1">
                        <h4 className="font-bold text-xs text-[#2B2B2B]">{mod.title}</h4>
                        <p className="text-[11px] text-gray-500 leading-tight">{mod.shortDesc}</p>
                      </div>
                    </button>
                  ))}
                </div>

                {/* MODULE 1: የ ቅኝት አመሰራረት (Finger practice chords) */}
                {activeCh4Module === 'formation' && (
                  <div className="space-y-6 bg-[#FAF6EF]/30 border border-[#E7DED1] p-5 rounded-xl">
                    <BegenaScaleSimulatorBoard
                      scaleKey="tizita"
                      title="ትዝታ ቅኝት የበገና ድርደራ (Tizita Virtual Begena Studio)"
                      subtitle="በገና 10 አውታሮች ይዟል። ተጫዋች አውታሮች 1፣ 4፣ 6፣ 8 እና 10 (1=#1፣ 4=#2፣ 6=#3፣ 8=#4፣ 10=#5) ሲሆኑ standard የድርደራ ቅደም ተከተል 2 → 3 → 1 → 5 → 4 → 2 እና Reverse 2 → 4 → 5 → 1 → 3 → 2 ነው።"
                      allowScaleChange={false}
                    />

                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-[#E7DED1] pb-3">
                      <div>
                        <h4 className="font-bold text-sm text-[#2B2B2B]">📌 የ ቅኝት አመሰራረት - FINGER PRACTICE CHORDS</h4>
                        <p className="text-xs text-gray-500">የቀኝና የግራ እጅ ድርደራ ቅደም ተከተል በቦርድ ቁጥሮችና ድምጾች</p>
                      </div>
                      <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-[#E7DED1] text-xs">
                        <span className="font-bold text-gray-500">Display mode:</span>
                        <div className="flex gap-1">
                          <button
                            onClick={() => setTunerDisplayMode('both')}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${tunerDisplayMode === 'both' ? 'bg-[#6F4E37] text-white' : 'bg-gray-100 text-gray-600'}`}
                          >
                            Both
                          </button>
                          <button
                            onClick={() => setTunerDisplayMode('tuner')}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${tunerDisplayMode === 'tuner' ? 'bg-[#6F4E37] text-white' : 'bg-gray-100 text-gray-600'}`}
                          >
                            Tuner
                          </button>
                          <button
                            onClick={() => setTunerDisplayMode('no')}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${tunerDisplayMode === 'no' ? 'bg-[#6F4E37] text-white' : 'bg-gray-100 text-gray-600'}`}
                          >
                            No.
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Interactive Sequence Player Box */}
                    <div className="bg-white p-5 rounded-xl border border-[#E7DED1] space-y-6">
                      {/* FORWARD SEQUENCE */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-[#6F4E37]">FORWARD SEQUENCE: 2 3 1 5 4 2</span>
                          <span className="text-[10px] text-gray-400 font-mono">Click card to pluck string</span>
                        </div>
                        <div className="grid grid-cols-6 gap-2">
                          {[
                            { num: '2', tone: 'C' },
                            { num: '3', tone: 'D' },
                            { num: '1', tone: 'E' },
                            { num: '5', tone: 'G' },
                            { num: '4', tone: 'A' },
                            { num: '2', tone: 'C' }
                          ].map((item, idx) => (
                            <button
                              type="button"
                              key={idx}
                              onClick={() => playBegenaNote(item.num)}
                              className={`p-3 rounded-xl border text-center transition-all cursor-pointer hover:scale-105 ${
                                activeSequenceIndex === idx
                                  ? 'bg-[#6F4E37] text-white border-[#6F4E37] scale-105 shadow-md'
                                  : 'bg-[#FAF6EF] text-[#2B2B2B] border-[#E7DED1] hover:border-[#6F4E37]'
                              }`}
                              title={`Click to pluck Begena string ${item.num}`}
                            >
                              <span className="block font-black text-base font-mono">{item.num}</span>
                              <span className="block text-[10px] opacity-80 uppercase font-bold">{item.tone}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* REVERSE SEQUENCE */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-[#C79A2B]">REVERSE SEQUENCE: 2 4 5 1 3 2</span>
                          <span className="text-[10px] text-gray-400 font-mono">Click card to pluck string</span>
                        </div>
                        <div className="grid grid-cols-6 gap-2">
                          {[
                            { num: '2', tone: 'C' },
                            { num: '4', tone: 'A' },
                            { num: '5', tone: 'G' },
                            { num: '1', tone: 'E' },
                            { num: '3', tone: 'D' },
                            { num: '2', tone: 'C' }
                          ].map((item, idx) => (
                            <button
                              type="button"
                              key={idx}
                              onClick={() => playBegenaNote(item.num)}
                              className={`p-3 rounded-xl border text-center transition-all cursor-pointer hover:scale-105 ${
                                activeReverseSequenceIndex === idx
                                  ? 'bg-[#C79A2B] text-white border-[#C79A2B] scale-105 shadow-md'
                                  : 'bg-amber-50/50 text-[#2B2B2B] border-amber-100 hover:border-[#C79A2B]'
                              }`}
                              title={`Click to pluck Begena string ${item.num}`}
                            >
                              <span className="block font-black text-base font-mono">{item.num}</span>
                              <span className="block text-[10px] opacity-80 uppercase font-bold">{item.tone}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* TEMPO CONTROL & PLAY BUTTONS */}
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                          <span className="text-xs font-bold text-gray-600 font-mono">Tempo: {tempo} BPM</span>
                          <input
                            type="range"
                            min="40"
                            max="120"
                            value={tempo}
                            onChange={(e) => setTempo(Number(e.target.value))}
                            className="w-32 accent-[#6F4E37]"
                          />
                        </div>

                        <div className="flex gap-2 w-full sm:w-auto justify-end">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => playNotationSequence('2 3 1 5 4 2', false)}
                            disabled={isPlayingSequence}
                            className="text-xs font-bold gap-1 text-[#6F4E37]"
                          >
                            <Play size={14} /> Forward
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => playNotationSequence('2 4 5 1 3 2', true)}
                            disabled={isPlayingSequence}
                            className="text-xs font-bold gap-1 text-[#C79A2B]"
                          >
                            <Play size={14} /> Reverse
                          </Button>
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={() => playCombinedSequence('2 3 1 5 4 2')}
                            disabled={isPlayingSequence}
                            className="text-xs font-bold gap-1 bg-[#6F4E37]"
                          >
                            <RotateCw size={14} /> Both
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Explanatory Principles Box */}
                    <div className="bg-white p-5 rounded-xl border border-[#E7DED1] space-y-3 text-xs leading-relaxed text-gray-700">
                      <h5 className="font-bold text-sm text-[#2B2B2B]">የ ቅኝት አመሰራረት መመሪያዎችና ትምህርት</h5>
                      <ul className="list-disc pl-5 space-y-2">
                        <li><b>ትዝታ ቅኝት፦</b> በበገና ልምምድ ውስጥ የመጀመሪያውና ዋነኛው የፔንታቶኒክ (የአምስት ድምፆች) ቅኝት ነው።</li>
                        <li><b>ድርደራ፦</b> ድርደራው የሚጀምረው ከአውታር 2 (C) ሲሆን፣ በጣት ቅደም ተከተል 2 ➔ 3 ➔ 1 ➔ 5 ➔ 4 ➔ 2 ይደረደራል።</li>
                        <li><b>ቴክኒክ፦</b> አንደኛውን አውታር ብለን የሚቀጥለው ላይ ከማረፋችን በፊት የመጀመሪያው አውታር ንዝረቱን እስኪጨርስ መጠበቅ አለብን።</li>
                      </ul>
                    </div>
                  </div>
                )}

                {/* MODULE 2: ጣት ማፍታታት (Dexterity Exercises) */}
                {activeCh4Module === 'dexterity' && (
                  <div className="space-y-6 bg-[#FAF6EF]/30 border border-[#E7DED1] p-5 rounded-xl">
                    <div className="border-b border-[#E7DED1] pb-3">
                      <h4 className="font-bold text-sm text-[#2B2B2B]">📌 ጣት ማፍታታት - Practical Finger Dexterity Chords</h4>
                      <p className="text-xs text-gray-500">የጣቶቻችን አቀማመጥ፣ ፍጥነትና የድምፅ ጥራት ማሻሻያ ተግባራዊ  ልምምዶች።</p>
                    </div>

                    {/* FIRST PRACTICE DRILL */}
                    <div className="bg-white p-5 rounded-xl border border-[#E7DED1] space-y-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-[10px] font-mono font-bold text-[#C79A2B] uppercase block">PRACTICE DRILL 1</span>
                          <h5 className="font-bold text-sm text-[#2B2B2B]">የመጀመሪያው ጣት ማፍታታት ልምምድ (First Practice)</h5>
                        </div>
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => playNotationSequence('2 2 2 3 3 3 1 1 1 5 5 5 4 4 4 2 2 2')}
                          disabled={isPlayingSequence}
                          className="gap-1 text-xs bg-[#6F4E37]"
                        >
                          <Play size={14} /> Play First Practice
                        </Button>
                      </div>

                      <div className="p-4 bg-[#FAF6EF] rounded-xl border border-[#E7DED1]">
                        <div className="text-xs font-mono font-bold text-gray-500 mb-2">SEQUENCE:</div>
                        <div className="flex flex-wrap gap-2">
                          {'2 2 2 3 3 3 1 1 1 5 5 5 4 4 4 2 2 2'.split(' ').map((note, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => playBegenaNote(note)}
                              className={`min-w-[2.2rem] px-2 py-1.5 rounded-lg flex flex-col items-center justify-center font-mono font-bold text-xs cursor-pointer transition-all ${
                                activeSequenceIndex === idx
                                  ? 'bg-[#6F4E37] text-white scale-110 shadow-sm border border-[#6F4E37]'
                                  : 'bg-white text-gray-800 border border-gray-200 hover:border-[#6F4E37]'
                              }`}
                            >
                              <span className="block font-black text-xs font-mono">{note}</span>
                              <span className={`block text-[10px] font-bold uppercase ${
                                activeSequenceIndex === idx ? 'text-amber-200' : 'text-[#E89B52]'
                              }`}>
                                {getNoteTone(note, 'tizita')}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* SECOND PRACTICE DRILL */}
                    <div className="bg-white p-5 rounded-xl border border-[#E7DED1] space-y-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-[10px] font-mono font-bold text-[#C79A2B] uppercase block">PRACTICE DRILL 2</span>
                          <h5 className="font-bold text-sm text-[#2B2B2B]">ሁለተኛው ጣት ማፍታታት ልምምድ (Second Practice)</h5>
                        </div>
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => playNotationSequence('2 3 1 3 1 5 1 5 4 5 4 2 2 4 5 4 5 1 5 1 3 1 3 2')}
                          disabled={isPlayingSequence}
                          className="gap-1 text-xs bg-[#6F4E37]"
                        >
                          <Play size={14} /> Play Second Practice
                        </Button>
                      </div>

                      <div className="space-y-3">
                        {/* Line 1 */}
                        <div className="p-4 bg-[#FAF6EF] rounded-xl border border-[#E7DED1] space-y-1">
                          <span className="text-[10px] font-mono font-bold text-[#6F4E37] uppercase block">LINE 1:</span>
                          <div className="flex flex-wrap gap-2 pt-1">
                            {'2 3 1 3 1 5 1 5 4 5 4 2'.split(' ').map((note, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => playBegenaNote(note)}
                                className={`min-w-[2.2rem] px-2 py-1.5 rounded-lg flex flex-col items-center justify-center font-mono font-bold text-xs cursor-pointer transition-all ${
                                  activeSequenceIndex === idx
                                    ? 'bg-[#6F4E37] text-white scale-110 shadow-sm border border-[#6F4E37]'
                                    : 'bg-white text-gray-800 border border-gray-200 hover:border-[#6F4E37]'
                                }`}
                              >
                                <span className="block font-black text-xs font-mono">{note}</span>
                                <span className={`block text-[10px] font-bold uppercase ${
                                  activeSequenceIndex === idx ? 'text-amber-200' : 'text-[#E89B52]'
                                }`}>
                                  {getNoteTone(note, 'tizita')}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Line 2 */}
                        <div className="p-4 bg-amber-50/40 rounded-xl border border-amber-100 space-y-1">
                          <span className="text-[10px] font-mono font-bold text-[#C79A2B] uppercase block">LINE 2:</span>
                          <div className="flex flex-wrap gap-2 pt-1">
                            {'2 4 5 4 5 1 5 1 3 1 3 2'.split(' ').map((note, idx) => (
                              <button
                                key={idx + 12}
                                type="button"
                                onClick={() => playBegenaNote(note)}
                                className={`min-w-[2.2rem] px-2 py-1.5 rounded-lg flex flex-col items-center justify-center font-mono font-bold text-xs cursor-pointer transition-all ${
                                  activeSequenceIndex === idx + 12
                                    ? 'bg-[#C79A2B] text-white scale-110 shadow-sm border border-[#C79A2B]'
                                    : 'bg-white text-gray-800 border border-gray-200 hover:border-[#C79A2B]'
                                }`}
                              >
                                <span className="block font-black text-xs font-mono">{note}</span>
                                <span className={`block text-[10px] font-bold uppercase ${
                                  activeSequenceIndex === idx + 12 ? 'text-amber-200' : 'text-[#E89B52]'
                                }`}>
                                  {getNoteTone(note, 'tizita')}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* MODULE 3: ትዝታ ቅኝት ላይ ያሉ መዝሙሮች (Tizita Scale Mezmurs Only) */}
                {activeCh4Module === 'mezmurs' && (() => {
                  const filteredLibraryMezmurs = mezmurs.filter((m) => {
                    if (!m) return false;
                    const cat = m.category || '';
                    const isTizita = cat.includes('ትዝታ') || (!cat.includes('ቸርነት') && !cat.includes('አንቺ') && !cat.includes('ሰላምታ'));

                    const q = (librarySearchQuery || '').toLowerCase().trim();
                    const matchesSearch =
                      !q ||
                      (m.title || '').toLowerCase().includes(q) ||
                      (m.amharicTitle || '').toLowerCase().includes(q) ||
                      cat.toLowerCase().includes(q) ||
                      (m.lyrics || '').toLowerCase().includes(q) ||
                      (m.teacher || '').toLowerCase().includes(q);

                    return isTizita && matchesSearch;
                  });

                  const tizitaMezmursList = mezmurs.filter((m) => m && ((m.category || '').includes('ትዝታ') || (!(m.category || '').includes('ቸርነት') && !(m.category || '').includes('አንቺ') && !(m.category || '').includes('ሰላምታ'))));
                  const currentMezmur = mezmurs.find((m) => m && m.id === selectedMezmurId && ((m.category || '').includes('ትዝታ') || (!(m.category || '').includes('ቸርነት') && !(m.category || '').includes('አንቺ') && !(m.category || '').includes('ሰላምታ')))) || filteredLibraryMezmurs[0] || tizitaMezmursList[0] || mezmurs[0];

                  const currentScaleMode: 'tizita' | 'cherenet' | 'selamta' = 'tizita';

                  return (
                    <div className="space-y-6">
                      {/* HEADER BANNER & SEARCH BAR FOR TIZITA MEZMURS */}
                      <div className="bg-[#FAF6EF]/70 p-4 rounded-xl border border-[#E7DED1] space-y-3">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                          <div>
                            <h4 className="font-bold text-sm text-[#2B2B2B] flex items-center gap-2">
                              <span>📜</span>
                              <span>ትዝታ ቅኝት ላይ ያሉ መዝሙሮች ({tizitaMezmursList.length})</span>
                            </h4>
                            <p className="text-xs text-gray-500 mt-0.5">
                              በትዝታ ቅኝት የተደረደሩና የተቃኙ የተቀደሱ መዝሙራት ስብስብ። (Chapter 4 Tizita Scale Mezmurs)
                            </p>
                          </div>

                          <div className="relative w-full md:w-64">
                            <Input
                              type="text"
                              placeholder="መዝሙር ፈልግ... (Search)..."
                              value={librarySearchQuery}
                              onChange={(e) => setLibrarySearchQuery(e.target.value)}
                              className="text-xs pl-8 bg-white border-[#E7DED1] focus:border-[#6F4E37] w-full"
                            />
                            <Search size={14} className="absolute left-2.5 top-2.5 text-gray-400" />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* MEZMURS LIST (LEFT RAIL) */}
                        <div className="lg:col-span-1 space-y-3 max-h-[700px] overflow-y-auto pr-1">
                          <div className="flex justify-between items-center text-xs pb-1 font-bold text-gray-500">
                            <span>በትዝታ ቅኝት የተገኘ መዝሙር ({filteredLibraryMezmurs.length})</span>
                            <span className="text-[10px] text-amber-800 bg-amber-100 px-2 py-0.5 rounded font-mono font-bold">
                              ትዝታ ቅኝት (TIZITA)
                            </span>
                          </div>

                          {filteredLibraryMezmurs.length === 0 ? (
                            <div className="p-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200 text-xs text-gray-500">
                              ምንም መዝሙር አልተገኘም። (No mezmurs found for this search/filter).
                            </div>
                          ) : (
                            filteredLibraryMezmurs.map((m) => {
                              const isSelected = currentMezmur?.id === m.id;
                              const cat = m?.category || '';
                              const badgeStyle = cat.includes('ቸርነት') || cat.includes('አንቺ')
                                ? 'bg-purple-100 text-purple-800 border-purple-200'
                                : cat.includes('ሰላምታ')
                                ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                                : 'bg-amber-100 text-amber-800 border-amber-200';

                              return (
                                <button
                                  key={m.id}
                                  onClick={() => setSelectedMezmurId(m.id)}
                                  className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer ${
                                    isSelected
                                      ? 'bg-[#FAF6EF] border-[#6F4E37] ring-1 ring-[#6F4E37]/30 shadow-xs'
                                      : 'bg-white border-gray-200 hover:border-gray-300'
                                  }`}
                                >
                                  <div className="flex justify-between items-center text-[9px] font-mono font-bold mb-1.5">
                                    <span className={`px-2 py-0.5 rounded border text-[9px] font-bold ${badgeStyle}`}>
                                      {m.category}
                                    </span>
                                    <span className="text-gray-400">{m.difficulty}</span>
                                  </div>
                                  
                                  <div className="space-y-0.5">
                                    <h4 className="font-bold text-xs text-[#2B2B2B]">{m.title}</h4>
                                    <span className="block text-xs font-serif text-[#6F4E37]">{m.amharicTitle}</span>
                                  </div>

                                  <div className="mt-2.5 flex justify-between items-center text-[10px]">
                                    <span className="text-gray-400 font-mono truncate max-w-[140px]">{m.teacher}</span>
                                    <span className={`px-2 py-0.5 rounded font-bold uppercase text-[9px] ${
                                      m.status === 'Completed' || m.status === 'Approved'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-amber-100 text-amber-800'
                                    }`}>
                                      {m.status}
                                    </span>
                                  </div>
                                </button>
                              );
                            })
                          )}
                        </div>

                        {/* ACTIVE MEZMUR WORKSPACE PANEL (RIGHT SIDE) */}
                        <div className="lg:col-span-2 space-y-5 bg-[#FAF6EF]/20 border border-[#E7DED1] p-5 rounded-xl text-xs">
                          
                          <div className="flex justify-between items-start border-b border-[#E7DED1]/60 pb-3">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded border uppercase bg-amber-100 text-amber-800 border-amber-200">
                                  {currentMezmur.category}
                                </span>
                              </div>
                              <h4 className="font-bold text-base text-[#2B2B2B]">{currentMezmur.title}</h4>
                              <span className="text-xs text-[#6F4E37] font-serif block mt-0.5">{currentMezmur.amharicTitle}</span>
                            </div>
                            <span className="text-[10px] bg-green-50 text-green-700 border border-green-200 px-2.5 py-1 rounded font-bold">
                              ዘማሪ/ደራሲ፡ {currentMezmur.teacher}
                            </span>
                          </div>

                          {/* DEMO AUDIO TRACK PLAYER */}
                          <div className="p-4 bg-white rounded-xl border border-[#E7DED1] space-y-3">
                            <div className="flex justify-between items-center font-bold text-[10px] text-gray-400">
                              <span>INSTRUMENT DEMONSTRATION TRACK</span>
                              <span className="text-green-600 font-mono uppercase">
                                Scale: {currentScaleMode} Active
                              </span>
                            </div>

                            <div className="flex items-center gap-3">
                              <button
                                type="button"
                                onClick={() => {
                                  if (isPlayingSequence) {
                                    setIsPlayingSequence(false);
                                  } else {
                                    playNotationSequence(currentMezmur.notation, false, undefined, currentScaleMode);
                                  }
                                }}
                                className="w-9 h-9 rounded-full bg-[#6F4E37] text-white flex items-center justify-center cursor-pointer shadow-xs hover:bg-[#5a3f2c]"
                              >
                                {isPlayingSequence ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
                              </button>
                              <div>
                                <span className="block font-bold text-gray-800">{currentMezmur.title} Begena String Pluck Demo</span>
                                <span className="text-[10px] text-gray-400">Authentic Ethiopian Begena tone ({currentScaleMode.toUpperCase()} scale)</span>
                              </div>
                            </div>
                          </div>

                          {/* NOTATION AND LYRICS */}
                          <div className="space-y-4">
                            {/* NOTATION SEQUENCE */}
                            <div className="p-4 bg-white border border-[#E7DED1] rounded-xl space-y-3">
                              <div className="flex justify-between items-center border-b pb-2">
                                <span className="text-[10px] font-bold text-gray-500 uppercase font-mono">
                                  የበገና ድርደራ ቁጥር (Begena Playing Number Notation)
                                </span>
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  onClick={() => playNotationSequence(currentMezmur.notation, false, undefined, currentScaleMode)}
                                  disabled={isPlayingSequence}
                                  className="text-[10px] uppercase font-bold py-1 h-7 text-[#6F4E37] gap-1 cursor-pointer"
                                >
                                  <Play size={12} /> Pluck Sequence
                                </Button>
                              </div>
                              
                              <div className="p-3 bg-[#FAF6EF] rounded-lg border border-[#E7DED1] font-mono text-xs leading-relaxed text-[#2B2B2B] font-bold tracking-wide flex flex-wrap gap-1.5">
                                {parseNotationToNotes(currentMezmur.notation).map((item, idx) => (
                                  item === '-' ? (
                                    <span
                                      key={idx}
                                      className={`px-2 py-1.5 rounded-lg border text-xs font-mono font-bold flex flex-col items-center justify-center min-w-[1.8rem] transition-all ${
                                        activeSequenceIndex === idx
                                          ? 'bg-amber-500 text-white border-amber-600 scale-110 shadow-sm'
                                          : 'bg-amber-50/80 text-amber-800 border-amber-200/80'
                                      }`}
                                      title="Rest / Pause"
                                    >
                                      <span className="block font-black text-xs font-mono">-</span>
                                      <span className="block text-[9px] font-bold uppercase text-amber-700">Rest</span>
                                    </span>
                                  ) : (
                                    <button
                                      key={idx}
                                      type="button"
                                      onClick={() => playBegenaNote(item, undefined, currentScaleMode)}
                                      className={`px-2.5 py-1.5 rounded-lg border text-xs font-mono font-bold flex flex-col items-center justify-center min-w-[2.2rem] transition-all cursor-pointer ${
                                        activeSequenceIndex === idx
                                          ? 'bg-[#6F4E37] text-white border-[#6F4E37] scale-110 shadow-sm'
                                          : 'bg-white text-[#2B2B2B] border-[#E7DED1] hover:bg-amber-50 hover:border-[#6F4E37] hover:scale-105 shadow-2xs'
                                      }`}
                                      title={`Click to pluck Begena string ${item} (${getNoteTone(item, currentScaleMode)})`}
                                    >
                                      <span className="block font-black text-xs font-mono">{item}</span>
                                      <span className={`block text-[10px] font-bold uppercase ${
                                        activeSequenceIndex === idx ? 'text-amber-200' : 'text-[#E89B52]'
                                      }`}>
                                        {getNoteTone(item, currentScaleMode)}
                                      </span>
                                    </button>
                                  )
                                ))}
                              </div>
                            </div>

                            {/* AUTHORIZED HYMN LYRICS */}
                            <div className="p-4 bg-white border border-[#E7DED1] rounded-xl space-y-2">
                              <span className="text-[10px] font-bold text-gray-500 block uppercase border-b pb-2 font-mono">
                                የመዝሙሩ ግጥም (Authorized Hymn Lyrics)
                              </span>
                              <p className="text-xs font-serif leading-loose whitespace-pre-line text-gray-800 pt-2">
                                {currentMezmur.lyrics}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Chapter 4 Navigation Footer */}
                {renderChapterNavFooter('mezmur-library')}
              </div>
            )}

            {/* ---------------- SUBTAB 5: CHAPTER 5 CHERENET / ANCHI HOYE SCALE ---------------- */}
            {activeSubTab === 'cherenet-scale' && (
              <div className="bg-white border border-[#E7DED1] p-6 rounded-2xl shadow-xs space-y-6 text-left">
                {/* Header Banner */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#FAF6EF] p-5 rounded-xl border border-[#E7DED1]">
                  <div>
                    <span className="text-[10px] font-bold text-[#E89B52] uppercase tracking-wider block mb-1 font-mono">
                      CHAPTER 5 ፡ ምዕራፍ አምስት
                    </span>
                    <h3 className="font-display font-black text-xl text-[#2B2B2B]">
                      ቸርነት/አንቺ ሆዬ ቅኝት (Cherenet / Anchi Hoye Scale)
                    </h3>
                    <p className="text-xs text-gray-600 mt-1">
                      የ ቸርነት ቅኝት አመሰራረት፣ የጣቶች ልምምድ ቾርድ እና በዚሁ ቅኝት ላይ ያሉ የተቀደሱ መዝሙሮች::
                    </p>
                  </div>

                  {/* Module switcher tabs inside Chapter 5 */}
                  <div className="flex bg-white p-1 rounded-xl border border-[#E7DED1] gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => setActiveCh5Module('formation')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        activeCh5Module === 'formation'
                          ? 'bg-[#6F4E37] text-white shadow-xs'
                          : 'text-gray-600 hover:text-[#6F4E37]'
                      }`}
                    >
                      📌 የ ቅኝት አመሰራረት
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveCh5Module('mezmurs')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        activeCh5Module === 'mezmurs'
                          ? 'bg-[#6F4E37] text-white shadow-xs'
                          : 'text-gray-600 hover:text-[#6F4E37]'
                      }`}
                    >
                      📌 ቸርነት ቅኝት ላይ ያሉ መዝሙሮች ({CHERENET_MEZMURS.length})
                    </button>
                  </div>
                </div>

                {/* MODULE 1: የ ቅኝት አመሰራረት */}
                {activeCh5Module === 'formation' && (
                  <div className="space-y-6">
                    {/* Tuner Symbol & Frequency Value Mapping Card */}
                    <div className="bg-[#FAF6EF] border border-[#E7DED1] p-5 rounded-xl space-y-4">
                      <div className="flex justify-between items-center border-b border-[#E7DED1] pb-3">
                        <div>
                          <h4 className="font-bold text-sm text-[#2B2B2B]">የ ቅኝት አመሰራረት እና የቱነር እሴቶች</h4>
                          <p className="text-xs text-gray-600">
                            በ ቸርነት/አንቺ ሆዬ ቅኝት የቱነር ምልክቶችና የእያንዳንዱ አውታር የኖታ እሴት እንደሚከተለው ይለወጣል::
                          </p>
                        </div>
                        <span className="text-xs font-mono font-bold bg-[#6F4E37] text-white px-2.5 py-1 rounded-md">
                          CHERENET TUNING
                        </span>
                      </div>

                      {/* Tuner Values Mapping Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                        {[
                          { num: '2', tone: 'C', noteName: 'C3 (2nd String)', desc: '2 ➔ C' },
                          { num: '3', tone: 'C#', noteName: 'C#3 (3rd String)', desc: '3 ➔ C#' },
                          { num: '1', tone: 'F', noteName: 'F3 (1st String)', desc: '1 ➔ F' },
                          { num: '5', tone: 'F#', noteName: 'F#3 (5th String)', desc: '5 ➔ F#' },
                          { num: '4', tone: 'A', noteName: 'A3 (4th String)', desc: '4 ➔ A' },
                          { num: '2', tone: 'C', noteName: 'C3 (Octave/Root)', desc: '2 ➔ C' }
                        ].map((item, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => playBegenaNote(item.num, undefined, 'cherenet')}
                            className="bg-white p-3.5 rounded-xl border border-[#E7DED1] hover:border-[#6F4E37] text-center space-y-1 transition-all cursor-pointer hover:scale-105 shadow-2xs"
                            title={`Click to pluck ${item.desc} in Cherenet scale`}
                          >
                            <span className="text-xs font-bold text-[#E89B52] block font-mono">{item.desc}</span>
                            <span className="block text-xl font-black text-[#6F4E37] font-mono">{item.num}</span>
                            <span className="block text-xs font-bold text-gray-800 font-mono">{item.tone}</span>
                            <span className="text-[10px] text-gray-400 block">{item.noteName}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Finger Practice Chords Section (Forward & Reverse Flows) */}
                    <div className="bg-white border border-[#E7DED1] p-5 rounded-xl space-y-5">
                      <div>
                        <h4 className="font-bold text-sm text-[#2B2B2B]">Finger Practice Chords (የጣቶች ልምምድ ቾርድ)</h4>
                        <p className="text-xs text-gray-600">
                          በ ቸርነት ቅኝት ላይ የ ጣቶች የቾርድ ድርደራ በሁለት ፍሰቶች ይከናወናል:: እያንዳንዱን ካርድ በመጫን የአኮስቲክ በገና ድምፅ ያዳምጡ::
                        </p>
                      </div>

                      {/* FORWARD FLOW (2 3 1 5 4 2) */}
                      <div className="p-4 bg-[#FAF6EF] rounded-xl border border-[#E7DED1] space-y-3">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-[#6F4E37]">FORWARD FLOW (2 3 1 5 4 2)</span>
                          <span className="text-[10px] text-gray-500 font-mono">Top Row: 2, 3, 1, 5 | Bottom Row: 4, 2</span>
                        </div>

                        {/* Top Row: 2 (C), 3 (C#), 1 (F), 5 (F#) */}
                        <div className="grid grid-cols-4 gap-2">
                          {[
                            { num: '2', tone: 'C' },
                            { num: '3', tone: 'C#' },
                            { num: '1', tone: 'F' },
                            { num: '5', tone: 'F#' }
                          ].map((item, idx) => (
                            <button
                              type="button"
                              key={idx}
                              onClick={() => playBegenaNote(item.num, undefined, 'cherenet')}
                              className={`p-3 rounded-xl border text-center transition-all cursor-pointer hover:scale-105 ${
                                activeSequenceIndex === idx
                                  ? 'bg-[#6F4E37] text-white border-[#6F4E37] scale-105 shadow-md'
                                  : 'bg-white text-[#2B2B2B] border-[#E7DED1] hover:border-[#6F4E37]'
                              }`}
                            >
                              <span className="block font-black text-base font-mono">{item.num}</span>
                              <span className="block text-[11px] font-bold text-[#E89B52] uppercase">{item.tone}</span>
                            </button>
                          ))}
                        </div>

                        {/* Bottom Row: 4 (A), 2 (C) */}
                        <div className="grid grid-cols-2 gap-2 max-w-md mx-auto">
                          {[
                            { num: '4', tone: 'A' },
                            { num: '2', tone: 'C' }
                          ].map((item, idx) => (
                            <button
                              type="button"
                              key={idx}
                              onClick={() => playBegenaNote(item.num, undefined, 'cherenet')}
                              className={`p-3 rounded-xl border text-center transition-all cursor-pointer hover:scale-105 ${
                                activeSequenceIndex === idx + 4
                                  ? 'bg-[#6F4E37] text-white border-[#6F4E37] scale-105 shadow-md'
                                  : 'bg-white text-[#2B2B2B] border-[#E7DED1] hover:border-[#6F4E37]'
                              }`}
                            >
                              <span className="block font-black text-base font-mono">{item.num}</span>
                              <span className="block text-[11px] font-bold text-[#E89B52] uppercase">{item.tone}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* BACKWARD / REVERSE FLOW (2 4 5 1 3 2) */}
                      <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-200/60 space-y-3">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-[#C79A2B]">BACKWARD / REVERSE FLOW (2 4 5 1 3 2)</span>
                          <span className="text-[10px] text-gray-500 font-mono">Top Row: 2, 4, 5, 1 | Bottom Row: 3, 2</span>
                        </div>

                        {/* Top Row: 2 (C), 4 (A), 5 (F#), 1 (F) */}
                        <div className="grid grid-cols-4 gap-2">
                          {[
                            { num: '2', tone: 'C' },
                            { num: '4', tone: 'A' },
                            { num: '5', tone: 'F#' },
                            { num: '1', tone: 'F' }
                          ].map((item, idx) => (
                            <button
                              type="button"
                              key={idx}
                              onClick={() => playBegenaNote(item.num, undefined, 'cherenet')}
                              className={`p-3 rounded-xl border text-center transition-all cursor-pointer hover:scale-105 ${
                                activeReverseSequenceIndex === idx
                                  ? 'bg-[#C79A2B] text-white border-[#C79A2B] scale-105 shadow-md'
                                  : 'bg-white text-[#2B2B2B] border-amber-200 hover:border-[#C79A2B]'
                              }`}
                            >
                              <span className="block font-black text-base font-mono">{item.num}</span>
                              <span className="block text-[11px] font-bold text-[#C79A2B] uppercase">{item.tone}</span>
                            </button>
                          ))}
                        </div>

                        {/* Bottom Row: 3 (C#), 2 (C) */}
                        <div className="grid grid-cols-2 gap-2 max-w-md mx-auto">
                          {[
                            { num: '3', tone: 'C#' },
                            { num: '2', tone: 'C' }
                          ].map((item, idx) => (
                            <button
                              type="button"
                              key={idx}
                              onClick={() => playBegenaNote(item.num, undefined, 'cherenet')}
                              className={`p-3 rounded-xl border text-center transition-all cursor-pointer hover:scale-105 ${
                                activeReverseSequenceIndex === idx + 4
                                  ? 'bg-[#C79A2B] text-white border-[#C79A2B] scale-105 shadow-md'
                                  : 'bg-white text-[#2B2B2B] border-amber-200 hover:border-[#C79A2B]'
                              }`}
                            >
                              <span className="block font-black text-base font-mono">{item.num}</span>
                              <span className="block text-[11px] font-bold text-[#C79A2B] uppercase">{item.tone}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* TEMPO CONTROL & AUDIO PLAYER CONTROLS */}
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                          <span className="text-xs font-bold text-gray-600 font-mono">Tempo: {tempo} BPM</span>
                          <input
                            type="range"
                            min="40"
                            max="120"
                            value={tempo}
                            onChange={(e) => setTempo(Number(e.target.value))}
                            className="w-32 accent-[#6F4E37]"
                          />
                        </div>

                        <div className="flex gap-2 w-full sm:w-auto justify-end">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => playNotationSequence('2 3 1 5 4 2', false, undefined, 'cherenet')}
                            disabled={isPlayingSequence}
                            className="text-xs font-bold gap-1 text-[#6F4E37]"
                          >
                            <Play size={14} /> Play Forward
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => playNotationSequence('2 4 5 1 3 2', true, undefined, 'cherenet')}
                            disabled={isPlayingSequence}
                            className="text-xs font-bold gap-1 text-[#C79A2B]"
                          >
                            <Play size={14} /> Play Reverse
                          </Button>
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={() => playCombinedSequence('2 3 1 5 4 2', '2 4 5 1 3 2', 'cherenet')}
                            disabled={isPlayingSequence}
                            className="text-xs font-bold gap-1 bg-[#6F4E37]"
                          >
                            <RotateCw size={14} /> Play Both
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* MODULE 2: ቸርነት ቅኝት ላይ ያሉ መዝሙሮች */}
                {activeCh5Module === 'mezmurs' && (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* MEZMURS LIST RAIL */}
                    <div className="lg:col-span-1 space-y-3">
                      <div className="flex justify-between items-center text-xs text-gray-500 font-mono px-1">
                        <span>SELECT MEZMUR</span>
                        <span>{CHERENET_MEZMURS.length} MEZMURS</span>
                      </div>

                      {CHERENET_MEZMURS.map((m) => {
                        const isMastered = completedCherenetMezmurs.includes(m.id);
                        return (
                          <button
                            key={m.id}
                            type="button"
                            onClick={() => setSelectedCherenetMezmurId(m.id)}
                            className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer ${
                              selectedCherenetMezmurId === m.id
                                ? 'bg-[#FAF6EF] border-[#6F4E37] shadow-xs'
                                : 'bg-white border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className="flex justify-between items-start">
                              <h4 className="font-bold text-sm text-[#2B2B2B]">{m.title}</h4>
                              {isMastered && (
                                <CheckCircle2 size={16} className="text-green-600 shrink-0 mt-0.5" />
                              )}
                            </div>
                            <span className="text-xs text-gray-500 block mt-1">{m.artist}</span>
                            <div className="mt-2 flex items-center gap-1.5">
                              <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
                                ቸርነት ቅኝት
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {/* ACTIVE MEZMUR DETAIL DISPLAY */}
                    <div className="lg:col-span-2 space-y-5 bg-[#FAF6EF]/30 border border-[#E7DED1] p-6 rounded-xl">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-[#E7DED1] pb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-mono font-bold bg-[#6F4E37] text-white px-2 py-0.5 rounded">
                              CHERENET SCALE MEZMUR
                            </span>
                            {activeCherenetMezmur && completedCherenetMezmurs.includes(activeCherenetMezmur.id) && (
                              <span className="text-[10px] font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded flex items-center gap-1">
                                <CheckCircle2 size={10} /> Mastered
                              </span>
                            )}
                          </div>
                          <h3 className="font-display font-black text-xl text-[#2B2B2B]">
                            {activeCherenetMezmur?.title || ''}
                          </h3>
                          <p className="text-xs text-gray-500">{activeCherenetMezmur?.artist || ''}</p>
                        </div>

                        <Button
                          variant={activeCherenetMezmur && completedCherenetMezmurs.includes(activeCherenetMezmur.id) ? 'secondary' : 'primary'}
                          size="sm"
                          onClick={() => {
                            if (!activeCherenetMezmur) return;
                            if (completedCherenetMezmurs.includes(activeCherenetMezmur.id)) {
                              setCompletedCherenetMezmurs(completedCherenetMezmurs.filter(id => id !== activeCherenetMezmur.id));
                            } else {
                              setCompletedCherenetMezmurs([...completedCherenetMezmurs, activeCherenetMezmur.id]);
                              addNotification('Mezmur Completed', `Marked "${activeCherenetMezmur.title}" as mastered!`, 'achievement');
                            }
                          }}
                          className="text-xs font-bold gap-1 shrink-0"
                        >
                          <CheckCircle2 size={14} />
                          {activeCherenetMezmur && completedCherenetMezmurs.includes(activeCherenetMezmur.id) ? 'Mastered' : 'Mark as Mastered'}
                        </Button>
                      </div>

                      {/* AUDIO PLUCK DEMONSTRATION */}
                      <div className="p-4 bg-white border border-[#E7DED1] rounded-xl space-y-3">
                        <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                          <span className="text-[10px] font-bold text-gray-500 uppercase font-mono">
                            የበገና ድርደራ ቁጥር (Cherenet Sound Audio Pluck)
                          </span>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => playNotationSequence(activeCherenetMezmur.notation, false, undefined, 'cherenet')}
                            disabled={isPlayingSequence}
                            className="text-[10px] uppercase font-bold py-1 h-7 text-[#6F4E37] gap-1 cursor-pointer"
                          >
                            <Play size={12} /> Pluck Sequence
                          </Button>
                        </div>

                        {/* Interactive Number Notation Buttons */}
                        <div className="p-3 bg-[#FAF6EF] rounded-lg border border-[#E7DED1] font-mono text-xs leading-relaxed text-[#2B2B2B] font-bold tracking-wide flex flex-wrap gap-1.5">
                          {parseNotationToNotes(activeCherenetMezmur.notation).map((item, idx) => (
                            item === '-' ? (
                              <span
                                key={idx}
                                className={`px-2 py-1.5 rounded-lg border text-xs font-mono font-bold flex flex-col items-center justify-center min-w-[1.8rem] transition-all ${
                                  activeSequenceIndex === idx
                                    ? 'bg-amber-500 text-white border-amber-600 scale-110 shadow-sm'
                                    : 'bg-amber-50/80 text-amber-800 border-amber-200/80'
                                }`}
                                title="Rest / Pause"
                              >
                                <span className="block font-black text-xs font-mono">-</span>
                                <span className="block text-[9px] font-bold uppercase text-amber-700">Rest</span>
                              </span>
                            ) : (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => playBegenaNote(item, undefined, 'cherenet')}
                                className={`px-2.5 py-1.5 rounded-lg border text-xs font-mono font-bold flex flex-col items-center justify-center min-w-[2.2rem] transition-all cursor-pointer ${
                                  activeSequenceIndex === idx
                                    ? 'bg-[#6F4E37] text-white border-[#6F4E37] scale-110 shadow-sm'
                                    : 'bg-white text-[#2B2B2B] border-[#E7DED1] hover:bg-amber-50 hover:border-[#6F4E37] hover:scale-105 shadow-2xs'
                                }`}
                                title={`Click to pluck Cherenet string ${item} (${getNoteTone(item, 'cherenet')})`}
                              >
                                <span className="block font-black text-xs font-mono">{item}</span>
                                <span className={`block text-[10px] font-bold uppercase ${
                                  activeSequenceIndex === idx ? 'text-amber-200' : 'text-[#E89B52]'
                                }`}>
                                  {getNoteTone(item, 'cherenet')}
                                </span>
                              </button>
                            )
                          ))}
                        </div>
                      </div>

                      {/* DETAILED NOTATION BREAKDOWN IF PRESENT */}
                      {activeCherenetMezmur.noteBreakdown && activeCherenetMezmur.noteBreakdown.length > 0 && (
                        <div className="p-4 bg-white border border-[#E7DED1] rounded-xl space-y-3">
                          <span className="text-[10px] font-bold text-gray-500 uppercase block font-mono border-b border-gray-100 pb-2">
                            የድርደራ ክፍሎች breakdown (Click any number to play independently)
                          </span>
                          <div className="space-y-3">
                            {activeCherenetMezmur.noteBreakdown.map((sec, sIdx) => (
                              <div key={sIdx} className="p-3 bg-[#FAF6EF]/70 rounded-xl border border-[#E7DED1] space-y-2">
                                <div className="flex justify-between items-center">
                                  <span className="font-bold text-xs text-[#2B2B2B] flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-[#6F4E37]"></span>
                                    {sec.section}
                                  </span>
                                  <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => playNotationSequence(sec.notation, false, undefined, 'cherenet')}
                                    disabled={isPlayingSequence}
                                    className="text-[10px] py-0.5 px-2.5 h-6 text-[#6F4E37] gap-1 cursor-pointer font-bold uppercase"
                                  >
                                    <Play size={10} /> Play Section
                                  </Button>
                                </div>

                                {/* Interactive Number Buttons for this Verse / Section */}
                                <div className="flex flex-wrap gap-1.5 font-mono pt-1">
                                  {parseNotationToNotes(sec.notation).map((num, nIdx) => (
                                    num === '-' ? (
                                      <span
                                        key={nIdx}
                                        className="px-2 py-1.5 rounded-lg border text-xs font-mono font-bold flex flex-col items-center justify-center min-w-[1.8rem] bg-amber-50/80 text-amber-800 border-amber-200/80"
                                        title="Rest / Pause"
                                      >
                                        <span className="block font-black text-xs font-mono">-</span>
                                        <span className="block text-[9px] font-bold uppercase text-amber-700">Rest</span>
                                      </span>
                                    ) : (
                                      <button
                                        key={nIdx}
                                        type="button"
                                        onClick={() => playBegenaNote(num, undefined, 'cherenet')}
                                        className="px-2.5 py-1.5 rounded-lg border text-xs font-mono font-bold flex flex-col items-center justify-center min-w-[2.2rem] transition-all cursor-pointer bg-white text-[#2B2B2B] border-[#E7DED1] hover:bg-[#6F4E37] hover:text-white hover:scale-110 shadow-2xs group"
                                        title={`Click to play Cherenet string ${num} (${getNoteTone(num, 'cherenet')})`}
                                      >
                                        <span className="block font-black text-xs font-mono group-hover:text-white">{num}</span>
                                        <span className="block text-[10px] font-bold text-[#E89B52] group-hover:text-amber-200 uppercase">{getNoteTone(num, 'cherenet')}</span>
                                      </button>
                                    )
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* FULL LYRICS */}
                      <div className="p-4 bg-white border border-[#E7DED1] rounded-xl space-y-2">
                        <span className="text-[10px] font-bold text-gray-500 block uppercase border-b border-gray-100 pb-2 font-mono">
                          የመዝሙሩ ግጥም (Full Amharic Lyrics)
                        </span>
                        <p className="text-xs font-serif leading-loose whitespace-pre-line text-gray-800 pt-2">
                          {activeCherenetMezmur.lyrics}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Chapter 5 Navigation Footer */}
                {renderChapterNavFooter('cherenet-scale')}
              </div>
            )}

            {/* ---------------- SUBTAB 6: CHAPTER 6 (ቅኝቶች እና ተግባራዊ ልምምዳቸው) ---------------- */}
            {activeSubTab === 'assignments' && (
              <div className="bg-white border border-[#E7DED1] p-6 rounded-2xl shadow-xs space-y-6 text-left">
                {/* CHAPTER HEADER */}
                <div className="border-b border-[#FAF6EF] pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-[#C79A2B] uppercase tracking-wider block">CHAPTER 6</span>
                    <h3 className="font-display font-black text-lg text-[#2B2B2B]">
                      ምዕራፍ አራት፡ ቅኝቶች እና ተግባራዊ ልምምዳቸው
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      የ ቅኝት አመሰራረት፣ የጣቶች ልምምድ ድርደራ እና በሰላምታ ቅኝት የተዘጋጁ 8 የተቀደሱ መዝሙራት።
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-[#FAF6EF] border border-[#E7DED1] rounded-full text-xs font-bold text-[#6F4E37] flex items-center gap-1.5">
                      <Music size={14} /> ሰላምታ ቅኝት
                    </span>
                  </div>
                </div>

                {/* MODULE SELECTOR GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {CHAPTER_6_MODULES.map((mod) => {
                    const isActive = activeCh6Module === mod.id;
                    return (
                      <button
                        key={mod.id}
                        type="button"
                        onClick={() => setActiveCh6Module(mod.id as any)}
                        className={`p-4 rounded-xl border text-left transition-all flex items-start gap-3 cursor-pointer ${
                          isActive
                            ? 'bg-[#6F4E37] text-white border-[#6F4E37] shadow-sm'
                            : 'bg-[#FAF6EF]/50 text-[#2B2B2B] border-[#E7DED1] hover:border-[#6F4E37]/50 hover:bg-[#FAF6EF]'
                        }`}
                      >
                        <span className="text-2xl mt-0.5">{mod.icon}</span>
                        <div>
                          <h4 className={`font-bold text-sm ${isActive ? 'text-white' : 'text-[#2B2B2B]'}`}>
                            {mod.title}
                          </h4>
                          <p className={`text-xs mt-1 leading-relaxed ${isActive ? 'text-amber-100/90' : 'text-gray-500'}`}>
                            {mod.shortDesc}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* MODULE 1: የ ቅኝት አመሰራረት */}
                {activeCh6Module === 'formation' && (
                  <div className="space-y-6 bg-[#FAF6EF]/30 border border-[#E7DED1] p-5 rounded-xl">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-[#E7DED1] pb-3">
                      <div>
                        <h4 className="font-bold text-sm text-[#2B2B2B]">📌 የ ቅኝት አመሰራረት (Finger Practice Chords)</h4>
                        <p className="text-xs text-gray-500">የጣቶች ድርደራ በሰላምታ ቅኝት፦ 2 (C) ➔ 3 (D) ➔ 1 (F) ➔ 5 (G) ➔ 4 (A) ➔ 2 (C)</p>
                      </div>

                      {/* Display Mode Selector */}
                      <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-[#E7DED1] text-xs font-bold">
                        <span className="text-[10px] text-gray-400 px-2 font-mono uppercase">Display:</span>
                        <button
                          type="button"
                          onClick={() => setTunerDisplayMode('both')}
                          className={`px-2 py-1 rounded text-xs transition-colors ${
                            tunerDisplayMode === 'both' ? 'bg-[#6F4E37] text-white' : 'text-gray-600 hover:text-black'
                          }`}
                        >
                          Both
                        </button>
                        <button
                          type="button"
                          onClick={() => setTunerDisplayMode('tuner')}
                          className={`px-2 py-1 rounded text-xs transition-colors ${
                            tunerDisplayMode === 'tuner' ? 'bg-[#6F4E37] text-white' : 'text-gray-600 hover:text-black'
                          }`}
                        >
                          Tuner
                        </button>
                        <button
                          type="button"
                          onClick={() => setTunerDisplayMode('no')}
                          className={`px-2 py-1 rounded text-xs transition-colors ${
                            tunerDisplayMode === 'no' ? 'bg-[#6F4E37] text-white' : 'text-gray-600 hover:text-black'
                          }`}
                        >
                          No.
                        </button>
                      </div>
                    </div>

                    {/* TUNER VALUES MAPPING SUMMARY CARD */}
                    <div className="bg-white p-4 rounded-xl border border-[#E7DED1] space-y-2">
                      <div className="text-xs font-bold text-[#6F4E37] uppercase tracking-wider font-mono">
                        SELAMTA TUNER SYMBOLS & VALUES
                      </div>
                      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 pt-1 text-center font-mono">
                        <div className="p-2 bg-[#FAF6EF] rounded-lg border border-[#E7DED1]">
                          <span className="block text-xs font-bold text-gray-400">STRING 2</span>
                          <span className="block text-sm font-black text-[#2B2B2B]">2 ➔ C</span>
                        </div>
                        <div className="p-2 bg-[#FAF6EF] rounded-lg border border-[#E7DED1]">
                          <span className="block text-xs font-bold text-gray-400">STRING 3</span>
                          <span className="block text-sm font-black text-[#2B2B2B]">3 ➔ D</span>
                        </div>
                        <div className="p-2 bg-[#FAF6EF] rounded-lg border border-[#E7DED1]">
                          <span className="block text-xs font-bold text-gray-400">STRING 1</span>
                          <span className="block text-sm font-black text-[#2B2B2B]">1 ➔ F</span>
                        </div>
                        <div className="p-2 bg-[#FAF6EF] rounded-lg border border-[#E7DED1]">
                          <span className="block text-xs font-bold text-gray-400">STRING 5</span>
                          <span className="block text-sm font-black text-[#2B2B2B]">5 ➔ G</span>
                        </div>
                        <div className="p-2 bg-[#FAF6EF] rounded-lg border border-[#E7DED1]">
                          <span className="block text-xs font-bold text-gray-400">STRING 4</span>
                          <span className="block text-sm font-black text-[#2B2B2B]">4 ➔ A</span>
                        </div>
                        <div className="p-2 bg-[#FAF6EF] rounded-lg border border-[#E7DED1]">
                          <span className="block text-xs font-bold text-gray-400">STRING 2</span>
                          <span className="block text-sm font-black text-[#2B2B2B]">2 ➔ C</span>
                        </div>
                      </div>
                    </div>

                    {/* FORWARD FLOW & REVERSE FLOW CARDS */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      
                      {/* FORWARD FLOW */}
                      <div className="bg-white p-5 rounded-xl border border-[#E7DED1] space-y-4 shadow-xs">
                        <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                          <h5 className="font-bold text-sm text-[#2B2B2B] flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500" /> Forward Flow (2 3 1 5 4 2)
                          </h5>
                          <span className="text-[10px] font-mono text-gray-400 font-bold uppercase">To Strum</span>
                        </div>

                        {/* TOP ROW */}
                        <div>
                          <span className="text-[10px] font-mono font-bold text-gray-400 uppercase block mb-1.5">
                            TOP ROW (2, 3, 1, 5)
                          </span>
                          <div className="grid grid-cols-4 gap-2">
                            {[
                              { num: '2', tuner: 'C' },
                              { num: '3', tuner: 'D' },
                              { num: '1', tuner: 'F' },
                              { num: '5', tuner: 'G' }
                            ].map((item, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => playBegenaNote(item.num, undefined, 'selamta')}
                                className={`p-3 rounded-lg border flex flex-col items-center justify-center font-mono cursor-pointer transition-all ${
                                  activeSequenceIndex === idx
                                    ? 'bg-[#6F4E37] text-white border-[#6F4E37] scale-105 shadow-sm'
                                    : 'bg-[#FAF6EF] text-[#2B2B2B] border-[#E7DED1] hover:border-[#6F4E37]'
                                }`}
                              >
                                {tunerDisplayMode !== 'tuner' && (
                                  <span className="font-black text-base">{item.num}</span>
                                )}
                                {tunerDisplayMode !== 'no' && (
                                  <span className={`text-xs font-bold ${activeSequenceIndex === idx ? 'text-amber-200' : 'text-[#C79A2B]'}`}>
                                    ({item.tuner})
                                  </span>
                                )}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* BOTTOM ROW */}
                        <div>
                          <span className="text-[10px] font-mono font-bold text-gray-400 uppercase block mb-1.5">
                            BOTTOM ROW (4, 2)
                          </span>
                          <div className="grid grid-cols-2 gap-2">
                            {[
                              { num: '4', tuner: 'A' },
                              { num: '2', tuner: 'C' }
                            ].map((item, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => playBegenaNote(item.num, undefined, 'selamta')}
                                className={`p-3 rounded-lg border flex flex-col items-center justify-center font-mono cursor-pointer transition-all ${
                                  activeSequenceIndex === idx + 4
                                    ? 'bg-[#6F4E37] text-white border-[#6F4E37] scale-105 shadow-sm'
                                    : 'bg-[#FAF6EF] text-[#2B2B2B] border-[#E7DED1] hover:border-[#6F4E37]'
                                }`}
                              >
                                {tunerDisplayMode !== 'tuner' && (
                                  <span className="font-black text-base">{item.num}</span>
                                )}
                                {tunerDisplayMode !== 'no' && (
                                  <span className={`text-xs font-bold ${activeSequenceIndex === idx + 4 ? 'text-amber-200' : 'text-[#C79A2B]'}`}>
                                    ({item.tuner})
                                  </span>
                                )}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* BACKWARD / REVERSE FLOW */}
                      <div className="bg-white p-5 rounded-xl border border-[#E7DED1] space-y-4 shadow-xs">
                        <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                          <h5 className="font-bold text-sm text-[#2B2B2B] flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-amber-500" /> Reverse Flow (2 4 5 1 3 2)
                          </h5>
                          <span className="text-[10px] font-mono text-gray-400 font-bold uppercase">To Strum</span>
                        </div>

                        {/* TOP ROW */}
                        <div>
                          <span className="text-[10px] font-mono font-bold text-gray-400 uppercase block mb-1.5">
                            TOP ROW (2, 4, 5, 1)
                          </span>
                          <div className="grid grid-cols-4 gap-2">
                            {[
                              { num: '2', tuner: 'C' },
                              { num: '4', tuner: 'A' },
                              { num: '5', tuner: 'G' },
                              { num: '1', tuner: 'F' }
                            ].map((item, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => playBegenaNote(item.num, undefined, 'selamta')}
                                className={`p-3 rounded-lg border flex flex-col items-center justify-center font-mono cursor-pointer transition-all ${
                                  activeReverseSequenceIndex === idx
                                    ? 'bg-[#C79A2B] text-white border-[#C79A2B] scale-105 shadow-sm'
                                    : 'bg-[#FAF6EF] text-[#2B2B2B] border-[#E7DED1] hover:border-[#C79A2B]'
                                }`}
                              >
                                {tunerDisplayMode !== 'tuner' && (
                                  <span className="font-black text-base">{item.num}</span>
                                )}
                                {tunerDisplayMode !== 'no' && (
                                  <span className={`text-xs font-bold ${activeReverseSequenceIndex === idx ? 'text-amber-100' : 'text-[#6F4E37]'}`}>
                                    ({item.tuner})
                                  </span>
                                )}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* BOTTOM ROW */}
                        <div>
                          <span className="text-[10px] font-mono font-bold text-gray-400 uppercase block mb-1.5">
                            BOTTOM ROW (3, 2)
                          </span>
                          <div className="grid grid-cols-2 gap-2">
                            {[
                              { num: '3', tuner: 'D' },
                              { num: '2', tuner: 'C' }
                            ].map((item, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => playBegenaNote(item.num, undefined, 'selamta')}
                                className={`p-3 rounded-lg border flex flex-col items-center justify-center font-mono cursor-pointer transition-all ${
                                  activeReverseSequenceIndex === idx + 4
                                    ? 'bg-[#C79A2B] text-white border-[#C79A2B] scale-105 shadow-sm'
                                    : 'bg-[#FAF6EF] text-[#2B2B2B] border-[#E7DED1] hover:border-[#C79A2B]'
                                }`}
                              >
                                {tunerDisplayMode !== 'tuner' && (
                                  <span className="font-black text-base">{item.num}</span>
                                )}
                                {tunerDisplayMode !== 'no' && (
                                  <span className={`text-xs font-bold ${activeReverseSequenceIndex === idx + 4 ? 'text-amber-100' : 'text-[#6F4E37]'}`}>
                                    ({item.tuner})
                                  </span>
                                )}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                    </div>

                    {/* TEMPO CONTROL & PLAY BUTTONS */}
                    <div className="bg-white p-4 rounded-xl border border-[#E7DED1] flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="flex items-center gap-3 w-full sm:w-auto">
                        <span className="text-xs font-bold text-gray-600 font-mono">Tempo: {tempo} BPM</span>
                        <input
                          type="range"
                          min="40"
                          max="120"
                          value={tempo}
                          onChange={(e) => setTempo(Number(e.target.value))}
                          className="w-32 accent-[#6F4E37]"
                        />
                      </div>

                      <div className="flex gap-2 w-full sm:w-auto justify-end">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => playNotationSequence('2 3 1 5 4 2', false, undefined, 'selamta')}
                          disabled={isPlayingSequence}
                          className="text-xs font-bold gap-1 text-[#6F4E37]"
                        >
                          <Play size={14} /> Forward
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => playNotationSequence('2 4 5 1 3 2', true, undefined, 'selamta')}
                          disabled={isPlayingSequence}
                          className="text-xs font-bold gap-1 text-[#C79A2B]"
                        >
                          <Play size={14} /> Reverse
                        </Button>
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => playCombinedSequence('2 3 1 5 4 2', '2 4 5 1 3 2', 'selamta')}
                          disabled={isPlayingSequence}
                          className="text-xs font-bold gap-1 bg-[#6F4E37]"
                        >
                          <RotateCw size={14} /> Both
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* MODULE 2: ሰላምታ ቅኝት ላይ ያሉ መዝሙሮች */}
                {activeCh6Module === 'mezmurs' && (
                  <div className="space-y-6">
                    {/* SEARCH & TITLE BAR */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#FAF6EF]/50 p-4 rounded-xl border border-[#E7DED1]">
                      <div>
                        <h4 className="font-bold text-sm text-[#2B2B2B]">
                          📌 ሰላምታ ቅኝት ላይ ያሉ መዝሙሮች ({SELAMTA_MEZMURS.length})
                        </h4>
                        <p className="text-xs text-gray-500">
                          በሰላምታ ቅኝት የተቀናበሩ የተቀደሱ የበገና መዝሙራት ሙሉ ጽሑፍና የድርደራ ቁጥሮች።
                        </p>
                      </div>

                      <div className="relative w-full sm:w-64">
                        <Search size={14} className="absolute left-3 top-3 text-gray-400" />
                        <input
                          type="text"
                          placeholder="መዝሙር ፈልግ..."
                          value={searchSelamtaQuery}
                          onChange={(e) => setSearchSelamtaQuery(e.target.value)}
                          className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-[#E7DED1] rounded-lg focus:outline-none focus:border-[#6F4E37]"
                        />
                      </div>
                    </div>

                    {/* TWO-COLUMN MEZMUR VIEW */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      
                      {/* MEZMUR LIST RAIL */}
                      <div className="lg:col-span-1 space-y-2 max-h-[600px] overflow-y-auto pr-1">
                        {SELAMTA_MEZMURS.filter((m) =>
                          m && ((m.title && m.title.includes(searchSelamtaQuery)) || (m.artist && m.artist.includes(searchSelamtaQuery)))
                        ).map((m, idx) => {
                          const isSelected = activeSelamtaMezmur?.id === m.id;
                          return (
                            <button
                              key={m.id}
                              type="button"
                              onClick={() => setSelectedSelamtaMezmurId(m.id)}
                              className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-[#6F4E37] text-white border-[#6F4E37] shadow-sm'
                                  : 'bg-white text-[#2B2B2B] border-gray-200 hover:border-[#6F4E37]/50 hover:bg-[#FAF6EF]/50'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className={`text-[10px] font-mono font-bold ${isSelected ? 'text-amber-200' : 'text-gray-400'}`}>
                                  #{idx + 1}
                                </span>
                                <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${
                                  isSelected ? 'bg-white/20 text-white' : 'bg-[#FAF6EF] text-[#6F4E37]'
                                }`}>
                                  ሰላምታ
                                </span>
                              </div>
                              <h5 className={`font-bold text-sm mt-1 ${isSelected ? 'text-white' : 'text-[#2B2B2B]'}`}>
                                {m.title}
                              </h5>
                              <p className={`text-xs mt-0.5 ${isSelected ? 'text-amber-100/80' : 'text-gray-500'}`}>
                                {m.artist}
                              </p>
                            </button>
                          );
                        })}
                      </div>

                      {/* ACTIVE MEZMUR DISPLAY PANEL */}
                      <div className="lg:col-span-2 space-y-5 bg-white border border-[#E7DED1] p-6 rounded-2xl shadow-xs">
                        
                        {/* HEADER */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-gray-100 pb-4">
                          <div>
                            <span className="text-[10px] font-mono font-bold text-[#C79A2B] uppercase">SELECTED MEZMUR</span>
                            <h4 className="font-display font-black text-lg text-[#2B2B2B]">
                              {activeSelamtaMezmur?.title || ''}
                            </h4>
                            <p className="text-xs text-gray-500">{activeSelamtaMezmur?.artist || ''}</p>
                          </div>

                          {activeSelamtaMezmur?.notation && activeSelamtaMezmur.notation.length > 0 && activeSelamtaMezmur.notation[0] !== '22…' && (
                            <Button
                              size="sm"
                              variant="primary"
                              onClick={() => playNotationSequence(activeSelamtaMezmur.notation.join(' '), false, undefined, 'selamta')}
                              disabled={isPlayingSequence}
                              className="gap-1.5 text-xs bg-[#6F4E37]"
                            >
                              <Play size={14} /> Play Plucking Sound
                            </Button>
                          )}
                        </div>

                        {/* NOTATION CHORDS BOX */}
                        {activeSelamtaMezmur?.notation && activeSelamtaMezmur.notation.length > 0 && (
                          <div className="p-4 bg-[#FAF6EF] border border-[#E7DED1] rounded-xl space-y-2">
                            <span className="text-[10px] font-mono font-bold text-[#6F4E37] uppercase block">
                              🎵 PLUCKING NOTATION CHORDS (በቦርድ ቁጥሮች)
                            </span>
                            <div className="space-y-1.5 font-mono font-bold text-xs text-[#2B2B2B] leading-relaxed">
                              {activeSelamtaMezmur.notation.map((line, idx) => (
                                <div key={idx} className="p-2 bg-white rounded border border-[#E7DED1]/60 tracking-wider">
                                  {line}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* LYRICS DISPLAY */}
                        <div className="space-y-3 pt-2">
                          <span className="text-[10px] font-mono font-bold text-gray-400 uppercase block">
                            📜 ቃላተ መዝሙር (FULL LYRICS)
                          </span>
                          <div className="p-5 bg-[#FAF6EF]/30 border border-[#E7DED1] rounded-xl text-sm leading-relaxed text-[#2B2B2B] whitespace-pre-wrap font-serif">
                            {activeSelamtaMezmur?.lyrics || ''}
                          </div>
                        </div>

                        {/* PREV / NEXT MEZMUR NAV */}
                        <div className="flex justify-between items-center pt-4 border-t border-gray-100 text-xs">
                          {(() => {
                            const curIdx = SELAMTA_MEZMURS.findIndex((m) => m && m.id === activeSelamtaMezmur?.id);
                            const prevM = curIdx > 0 ? SELAMTA_MEZMURS[curIdx - 1] : null;
                            const nextM = curIdx < SELAMTA_MEZMURS.length - 1 ? SELAMTA_MEZMURS[curIdx + 1] : null;
                            return (
                              <>
                                {prevM ? (
                                  <button
                                    type="button"
                                    onClick={() => setSelectedSelamtaMezmurId(prevM.id)}
                                    className="text-[#6F4E37] font-bold hover:underline cursor-pointer"
                                  >
                                    ← {prevM.title}
                                  </button>
                                ) : <div />}

                                {nextM ? (
                                  <button
                                    type="button"
                                    onClick={() => setSelectedSelamtaMezmurId(nextM.id)}
                                    className="text-[#6F4E37] font-bold hover:underline cursor-pointer"
                                  >
                                    {nextM.title} →
                                  </button>
                                ) : <div />}
                              </>
                            );
                          })()}
                        </div>

                      </div>

                    </div>
                  </div>
                )}

                {/* Chapter Navigation Footer */}
                {renderChapterNavFooter('assignments')}
              </div>
            )}

            {/* ---------------- CHAPTER 7: BEGENA EXAM (FORMERLY CHAPTER 8) ---------------- */}
            {activeSubTab === 'chapter-8' && (
              <div className="bg-white border border-[#E7DED1] p-8 md:p-12 rounded-2xl shadow-xs space-y-8 text-center max-w-3xl mx-auto my-4 relative overflow-hidden">
                {/* Background decorative ornament */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-[#FAF6EF] rounded-full blur-3xl -z-0 pointer-events-none opacity-60" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#E89B52]/10 rounded-full blur-3xl -z-0 pointer-events-none opacity-60" />

                {/* HEADER BADGE */}
                <div className="relative z-10 space-y-3">
                  <span className="px-3.5 py-1 bg-[#FAF6EF] border border-[#E7DED1] rounded-full text-xs font-mono font-bold text-[#6F4E37] tracking-wider uppercase inline-flex items-center gap-2">
                    <Award size={14} className="text-[#C79A2B]" /> CHAPTER 7 • BEGENA FINAL EXAMINATION
                  </span>
                  <h3 className="font-display font-black text-2xl md:text-3xl text-[#2B2B2B]">
                    ምዕራፍ ሰባት ፡ የበገና መጨረሻ ፈተና እና ምዘና
                  </h3>
                  <p className="text-xs text-gray-500 font-mono">Official Final Examination Gateway</p>
                </div>

                {/* ELEGANT EXAM ANNOUNCEMENT CARD */}
                <div className="relative z-10 bg-radial from-[#FAF6EF] to-[#F5EFE6] border-2 border-[#E7DED1] p-8 md:p-10 rounded-2xl shadow-sm text-left space-y-6">
                  <div className="w-14 h-14 bg-[#6F4E37] text-[#C79A2B] rounded-2xl flex items-center justify-center mx-auto shadow-md border border-[#C79A2B]/40">
                    <FileText size={28} />
                  </div>

                  <div className="text-center space-y-4">
                    <p className="text-base md:text-lg text-[#2B2B2B] leading-relaxed font-serif font-medium italic">
                      "እንኳን ደስ አለዎ! መሰረታዊ የበገና ትምህርቶትን በሚገባ ስላጠናቀቁ የሚቀርዎት ፈተና መውሰድ ነው። የተማሩትን ቅኝቶች መሰረታዊ ልዩነት እንዲሁም የተማሯቸውን መዝሙሮች በማስታወስ እና ልምምድ በማድረግ ለፈተናው ይዘጋጁ። ፈተናው በመማሪያ ክፍሎት ውስጥ የሚሰጥ ይሆናል።  አቤል በገና"
                    </p>
                  </div>

                  {/* SIGNATURE & INSTRUCTOR CREDIT */}
                  <div className="pt-6 border-t border-[#E7DED1] flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#6F4E37] text-white flex items-center justify-center font-bold text-sm font-display">
                        AB
                      </div>
                      <div className="text-left">
                        <span className="block font-bold text-sm text-[#2B2B2B]">Abel Begena</span>
                        <span className="block text-[11px] text-[#C79A2B] font-mono font-bold">Master Instructor & Guide</span>
                      </div>
                    </div>

                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => markChapterCompletedAndAdvance('chapter-8')}
                      className="bg-[#6F4E37] text-white px-5 py-2.5 rounded-xl font-bold text-xs gap-2 shadow-sm hover:bg-[#5a3e2b]"
                    >
                      <Award size={16} /> Complete Chapter 7 & Proceed →
                    </Button>
                  </div>
                </div>

                {/* Chapter Navigation Footer */}
                <div className="relative z-10 text-left">
                  {renderChapterNavFooter('chapter-8')}
                </div>
              </div>
            )}

            {/* ---------------- PRACTICE TRACKER SECTION -------- */}
            {activeSubTab === 'practice-tracker' && (
              <div className="bg-white border border-[#E7DED1] p-6 md:p-10 rounded-2xl shadow-xs space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E7DED1] pb-6">
                  <div>
                    <span className="px-3 py-1 bg-[#FAF6EF] border border-[#E7DED1] rounded-full text-xs font-mono font-bold text-[#6F4E37] tracking-wider uppercase inline-flex items-center gap-1.5 mb-2">
                      <Award size={13} className="text-[#C79A2B]" /> PRACTICE TRACKER
                    </span>
                    <h3 className="font-display font-black text-2xl text-[#2B2B2B]">
                      የበገና ልምምድ ከታወቀ ምዝገብ
                    </h3>
                    <p className="text-xs text-gray-500 font-mono mt-1">
                      Daily practice tracking, performance logs, and masterclass solo renditions
                    </p>
                  </div>
                </div>

                {/* Practice Tracker Widgets */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-[#FAF6EF] border border-[#E7DED1] p-6 rounded-2xl text-center space-y-2">
                    <span className="text-3xl font-black text-[#6F4E37] font-display">{totalMinutesThisWeek} mins</span>
                    <span className="block text-xs font-bold text-gray-500 uppercase">Total Practice This Week</span>
                  </div>
                  <div className="bg-[#FAF6EF] border border-[#E7DED1] p-6 rounded-2xl text-center space-y-2">
                    <span className="text-3xl font-black text-[#C79A2B] font-display">{getPracticeStars(totalMinutesThisWeek)}</span>
                    <span className="block text-xs font-bold text-gray-500 uppercase">Practice Rating Star</span>
                  </div>
                  <div className="bg-[#FAF6EF] border border-[#E7DED1] p-6 rounded-2xl text-center space-y-2">
                    <span className="text-3xl font-black text-emerald-600 font-display">{practiceLogs.length} Sessions</span>
                    <span className="block text-xs font-bold text-gray-500 uppercase">Logged Practice Entries</span>
                  </div>
                </div>
              </div>
            )}

            {/* -------- CERTIFICATE GATEWAY -------- */}
            {activeSubTab === 'certificate-progress' && (
              <div className="bg-white border border-[#E7DED1] p-6 md:p-8 rounded-2xl shadow-xs space-y-6 text-center max-w-2xl mx-auto">
                <div className="space-y-2">
                  <Award size={48} className="mx-auto text-[#C79A2B] animate-bounce" />
                  <h3 className="font-display font-black text-lg text-[#2B2B2B] uppercase">
                    Begena Proficiency Certificate Gateway
                  </h3>
                  <p className="text-xs text-gray-500 max-w-md mx-auto leading-relaxed">
                    Verify your exam completion & instructor verification code to receive your official certificate.
                  </p>
                </div>

                {/* MANDATORY NOTICE BANNER AS REQUESTED */}
                <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border-2 border-[#C79A2B] p-5 rounded-2xl text-left shadow-xs space-y-2">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#6F4E37] text-amber-300 flex items-center justify-center shrink-0 font-bold mt-0.5">
                      <Award size={20} />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-[#6F4E37] uppercase tracking-wider block">
                        Important Certificate Requirement / የምስክር ወረቀት መመሪያ
                      </span>
                      <p className="text-xs font-bold text-gray-800 leading-relaxed">
                        To take you certificate, Please make sure you passed the exam you take by the teacher, Make sure to finish your all payments.
                      </p>
                    </div>
                  </div>
                </div>

                {/* 10-DIGIT TEACHER CODE INPUT OR UNLOCKED CERTIFICATE */}
                {!isCertificateUnlocked ? (
                  <div className="bg-[#FAF6EF]/70 border-2 border-[#E7DED1] p-6 rounded-2xl text-left space-y-4 max-w-md mx-auto">
                    <div className="space-y-1">
                      <h4 className="font-display font-black text-sm text-[#2B2B2B] uppercase flex items-center gap-2">
                        <Lock size={16} className="text-[#C79A2B]" /> Enter 10-Digit Teacher Verification Code
                      </h4>
                      <p className="text-xs text-gray-500">
                        Please enter the 10-digit code you received from your teacher after passing the exam and completing payments:
                      </p>
                    </div>

                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        const codeToTest = teacherCodeInput.trim();
                        if (!codeToTest) {
                          setTeacherCodeError('Please enter your verification code.');
                          return;
                        }

                        const res = verifyCertificateCodeForStudent({
                          code: codeToTest,
                          studentId: currentUser?.id || 'STU-2026-001',
                          studentEmail: currentUser?.email,
                          studentName: currentUser?.fullName
                        });

                        if (res.success && res.certificate) {
                          setIsCertificateUnlocked(true);
                          setTeacherCodeError('');
                          addNotification(
                            'Certificate Unlocked',
                            `Verification code ${res.certificate.verificationCode} confirmed. Official certificate unlocked for ${res.certificate.studentName}!`,
                            'system'
                          );
                        } else {
                          setTeacherCodeError(res.error || 'Invalid verification code.');
                        }
                      }}
                      className="space-y-3"
                    >
                      <div>
                        <Input
                          type="text"
                          value={teacherCodeInput}
                          onChange={(e) => {
                            setTeacherCodeInput(e.target.value);
                            if (teacherCodeError) setTeacherCodeError('');
                          }}
                          placeholder="e.g. AB-CERT-BEGE-2026-X8K9M2"
                          className="font-mono text-center tracking-widest text-lg font-bold py-3 bg-white border-2 border-[#E7DED1] focus:border-[#6F4E37] uppercase"
                        />
                        <p className="text-[10px] text-gray-400 mt-1 text-center">
                          Enter the unique code issued by your assigned instructor
                        </p>
                      </div>

                      {teacherCodeError && (
                        <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
                          <AlertCircle size={14} className="shrink-0" />
                          <span>{teacherCodeError}</span>
                        </div>
                      )}

                      <Button
                        type="submit"
                        variant="primary"
                        size="md"
                        className="w-full bg-[#6F4E37] text-white py-2.5 font-bold text-xs uppercase gap-2 hover:bg-[#5a3e2b] cursor-pointer shadow-sm"
                      >
                        <Award size={16} /> Get My Certificate →
                      </Button>
                    </form>
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-[#C79A2B] rounded-2xl text-center space-y-4 shadow-md max-w-md mx-auto relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-[#C79A2B]/10 rounded-full blur-xl pointer-events-none" />
                    
                    <Sparkles className="text-[#C79A2B] mx-auto animate-spin" size={32} />
                    <div>
                      <h4 className="font-display font-black text-base uppercase text-[#2B2B2B] tracking-wide">
                        Congratulations, Graduate!
                      </h4>
                      <p className="text-xs text-gray-500 leading-relaxed max-w-xs mx-auto">
                        Your teacher verification code <span className="font-mono font-bold text-[#6F4E37]">{teacherCodeInput}</span> has been verified!
                      </p>
                    </div>

                    {/* PRINT GRADUATE CERTIFICATE PREVIEW CONTAINER */}
                    <div id="learning-cert-card" className="border-2 border-[#C79A2B]/40 bg-white p-6 rounded-xl text-left shadow-md relative font-serif text-[#2B2B2B] space-y-4">
                      
                      {/* Traditional Gold Seal */}
                      <div className="absolute top-4 right-4 w-12 h-12 bg-amber-500/15 border-2 border-[#C79A2B] rounded-full flex items-center justify-center">
                        <span className="text-[8px] font-mono font-bold text-[#C79A2B]">SEAL</span>
                      </div>

                      <div className="text-center space-y-1">
                        <h5 className="text-xs uppercase tracking-widest text-[#C79A2B] font-bold font-sans">
                          Certificate of Traditional Proficiency
                        </h5>
                        <p className="text-[10px] text-gray-400">Awarded by Abel Begena Traditional Music School</p>
                      </div>

                      <div className="space-y-1.5 text-center pt-2">
                        <span className="text-[10px] text-gray-400 block">This is to certify that</span>
                        <span className="font-bold text-sm uppercase underline tracking-wider text-[#2B2B2B]">
                          {currentUser?.fullName || 'ST_SANDBOX'}
                        </span>
                        <span className="text-[10px] text-gray-400 block">has successfully completed the complete curriculum for</span>
                        <span className="font-bold text-xs text-[#6F4E37] block">
                          BEGENA SACRED HARP - LEVEL 1
                        </span>
                      </div>

                      <div className="flex justify-between items-end text-[9px] pt-4 border-t border-gray-100 font-sans uppercase">
                        <div>
                          <span className="text-gray-400 block">Teacher Verification Code:</span>
                          <span className="font-mono font-bold text-gray-800">{teacherCodeInput || '1234567890'}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-gray-400 block">Authorized Signature:</span>
                          <span className="font-bold font-serif text-[#6F4E37]">Zemari Deacon Abel Tesfaye</span>
                        </div>
                      </div>
                    </div>

                    <Button
                      variant="primary"
                      size="sm"
                      onClick={async () => {
                        const elem = document.getElementById('learning-cert-card');
                        if (elem) {
                          addNotification('Certificate Downloaded', 'Downloading official PDF certificate...', 'system');
                          const name = currentUser?.fullName ? currentUser.fullName.replace(/\s+/g, '_') : 'Student';
                          await exportElementToPDF(elem, `Begena_Certificate_${name}.pdf`);
                        }
                      }}
                      className="w-full text-xs font-bold uppercase shadow-sm bg-[#6F4E37] hover:bg-[#5a3e2b]"
                    >
                      Download Certificate (PDF)
                    </Button>
                  </motion.div>
                )}

                {/* Certificate Chapter Navigation Footer */}
                {renderChapterNavFooter('certificate-progress')}
              </div>
            )}

            {/* ---------------- TEACHER SIMULATOR ACTIONS SIDEBAR (Interactive reviews) ---------------- */}
            {isSimulatorTeacherMode && (
              <div className="bg-red-50/40 border border-red-200 p-6 rounded-2xl shadow-xs text-left space-y-4">
                <div>
                  <h4 className="font-display font-black text-sm uppercase text-red-900 flex items-center gap-2">
                    <UserCheck size={18} /> Instructor Assessment Terminal (Sandbox)
                  </h4>
                  <p className="text-xs text-red-800">
                    Grade students' submitted assignments and pluck Mezmurs instantly.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* PENDING ASSIGNMENT EVALUATIONS */}
                  <div className="p-3 bg-white border border-red-100 rounded-xl space-y-3">
                    <span className="text-[10px] font-bold text-red-800 uppercase block">Pending Recitals</span>
                    
                    <div className="space-y-2">
                      {assignments.filter((a) => a.status === 'Submitted').length === 0 ? (
                        <p className="text-gray-400 text-[11px]">No pending assignment videos submitted. Use Student View to submit one.</p>
                      ) : (
                        assignments.filter((a) => a.status === 'Submitted').map((asg) => (
                          <div key={asg.id} className="p-3 bg-red-50/30 rounded-lg space-y-2 text-xs">
                            <h5 className="font-bold text-red-900">{asg.title}</h5>
                            <p className="text-[11px] text-gray-500">Student note: "{asg.submissionNotes}"</p>
                            
                            <div className="pt-2 flex gap-1.5">
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={() => handleTeacherGrade(asg.id, true)}
                                className="text-[9px] py-1 h-7 bg-green-600 hover:bg-green-700"
                              >
                                Approve (A)
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleTeacherGrade(asg.id, false)}
                                className="text-[9px] py-1 h-7 bg-red-600 hover:bg-red-700"
                              >
                                Request revision
                              </Button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* PENDING MEZMUR PLUCKING CHECKS */}
                  <div className="p-3 bg-white border border-red-100 rounded-xl space-y-3">
                    <span className="text-[10px] font-bold text-red-800 uppercase block">Pending Mezmur Chants</span>

                    <div className="space-y-2">
                      {mezmurs.filter((m) => m.status === 'Submitted for Review').length === 0 ? (
                        <p className="text-gray-400 text-[11px]">No pending audio uploads in library. Use Student View to submit.</p>
                      ) : (
                        mezmurs.filter((m) => m.status === 'Submitted for Review').map((mez) => (
                          <div key={mez.id} className="p-3 bg-red-50/30 rounded-lg space-y-2 text-xs">
                            <h5 className="font-bold text-red-900">{mez.title}</h5>
                            <div className="space-y-1">
                              <label className="text-[9px] text-gray-400 uppercase">Devotional Score (0-100):</label>
                              <Input
                                type="number"
                                value={teacherScoreInput}
                                onChange={(e) => setTeacherScoreInput(e.target.value)}
                                className="h-8 text-xs"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[9px] text-gray-400 uppercase">Evaluation notes:</label>
                              <Input
                                placeholder="e.g. Excellent buzzing rhythm"
                                value={teacherFeedbackInput}
                                onChange={(e) => setTeacherFeedbackInput(e.target.value)}
                                className="h-8 text-xs"
                              />
                            </div>

                            <div className="pt-2 flex gap-1.5">
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={() => handleTeacherMezmurGrade(mez.id, true)}
                                className="text-[9px] py-1 h-7 bg-green-600 hover:bg-green-700"
                              >
                                Verify & Approve
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleTeacherMezmurGrade(mez.id, false)}
                                className="text-[9px] py-1 h-7 bg-red-600 hover:bg-red-700"
                              >
                                Needs Work
                              </Button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* BEGENA INFORMATION MODAL */}
        <AnimatePresence>
          {showBegenaInfo && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowBegenaInfo(false)}
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
              />

              {/* Modal */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[90vh] bg-white rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col"
              >
                {/* Header */}
                <div className="bg-gradient-to-r from-[#8B6F47] to-[#A0826D] text-white px-8 py-6 flex items-center justify-between border-b border-[#E7DED1]">
                  <div className="flex items-center gap-3">
                    <BookOpen size={24} className="text-yellow-200" />
                    <div>
                      <h2 className="text-2xl font-bold">{BEGENA_AMHARIC_INFO.title}</h2>
                      <p className="text-xs text-yellow-100 mt-1">The Ancient Ethiopian Harp - Sacred Instrument of Kings</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowBegenaInfo(false)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    aria-label="Close modal"
                  >
                    <X size={24} className="text-white" />
                  </button>
                </div>

                {/* Content */}
                <div className="overflow-y-auto flex-1 px-8 py-6 space-y-6 text-sm text-gray-700">
                  {/* Definition */}
                  <div className="border-l-4 border-[#E89B52] pl-4 space-y-2">
                    <h3 className="font-bold text-lg text-[#8B6F47] flex items-center gap-2">
                      <span className="text-[#E89B52]">📖</span> Definition
                    </h3>
                    <p className="text-gray-600 leading-relaxed" dir="rtl">
                      {BEGENA_AMHARIC_INFO.definition}
                    </p>
                    <p className="text-xs text-gray-500 italic">
                      The Begena (በገና) is a traditional Ethiopian harp, distinguished from other stringed instruments by its unique trapezium shape and distinctive buzzing sound. Unlike the Krar or Masinko, it is primarily associated with spiritual and meditative music.
                    </p>
                  </div>

                  {/* History */}
                  <div className="border-l-4 border-[#E89B52] pl-4 space-y-2">
                    <h3 className="font-bold text-lg text-[#8B6F47] flex items-center gap-2">
                      <span className="text-[#E89B52]">🏛️</span> History & Origins
                    </h3>
                    <p className="text-gray-600 leading-relaxed" dir="rtl">
                      {BEGENA_AMHARIC_INFO.history}
                    </p>
                    <p className="text-xs text-gray-500 italic">
                      Historical records suggest the Begena dates back to the 10th century, with connections to King David, King Solomon, and even the Queen of Sheba. It was featured prominently in the courts of ancient Ethiopian emperors and has been associated with spiritual music traditions for over a millennium.
                    </p>
                  </div>

                  {/* Physical Structure */}
                  <div className="border-l-4 border-[#E89B52] pl-4 space-y-2">
                    <h3 className="font-bold text-lg text-[#8B6F47] flex items-center gap-2">
                      <span className="text-[#E89B52]">🎵</span> Physical Construction
                    </h3>
                    <p className="text-gray-600 leading-relaxed" dir="rtl">
                      {BEGENA_AMHARIC_INFO.structure}
                    </p>
                    <p className="text-xs text-gray-500 italic">
                      The Begena features a trapezium-shaped wooden frame (typically constructed from acacia or sycamore wood) with animal skin stretched across it. It has 10 nylon strings tuned in a pentatonic scale. The distinctive buzzing sound comes from small metal rings attached to the string tuners, creating the instrument's signature resonant quality.
                    </p>
                  </div>

                  {/* Playing Technique */}
                  <div className="border-l-4 border-[#E89B52] pl-4 space-y-2">
                    <h3 className="font-bold text-lg text-[#8B6F47] flex items-center gap-2">
                      <span className="text-[#E89B52]">🎶</span> Playing Technique & Scales
                    </h3>
                    <p className="text-gray-600 leading-relaxed" dir="rtl">
                      {BEGENA_AMHARIC_INFO.playingTechnique}
                    </p>
                    <p className="text-xs text-gray-500 italic">
                      The Begena is played by plucking the strings with both hands in a pattern that creates melodic passages and rhythmic accompaniment. Traditional pentatonic scales form the basis of Begena music, with fingering patterns passed down through generations of master musicians. The technique emphasizes smooth, flowing transitions between notes and careful control of the buzzing effect.
                    </p>
                  </div>

                  {/* Cultural Significance */}
                  <div className="border-l-4 border-[#E89B52] pl-4 space-y-2">
                    <h3 className="font-bold text-lg text-[#8B6F47] flex items-center gap-2">
                      <span className="text-[#E89B52]">✨</span> Cultural & Spiritual Significance
                    </h3>
                    <p className="text-gray-600 leading-relaxed" dir="rtl">
                      {BEGENA_AMHARIC_INFO.culturalSignificance}
                    </p>
                    <p className="text-xs text-gray-500 italic">
                      In Ethiopian Orthodox Christian tradition, the Begena holds sacred significance, often played during religious ceremonies and periods of fasting (particularly during Lent). It is considered a meditation instrument, used to enhance spiritual contemplation and prayer. Master Begena musicians (Zemari) are highly respected in Ethiopian society, recognized as keepers of an ancient musical and spiritual tradition that connects modern times with Ethiopia's royal and religious heritage.
                    </p>
                  </div>
                </div>

                {/* Footer */}
                <div className="bg-[#FAF6EF]/50 border-t border-[#E7DED1] px-8 py-4 flex justify-end gap-3">
                  <button
                    onClick={() => setShowBegenaInfo(false)}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-semibold transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      setShowBegenaInfo(false);
                      addNotification('Begena Knowledge', 'You have learned about the sacred Begena. Continue your practice!', 'lesson');
                    }}
                    className="px-4 py-2 bg-[#E89B52] hover:bg-[#d4863e] text-white rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
                  >
                    <Check size={16} /> Got It!
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
        </>
      )}
    </div>
  );
}

