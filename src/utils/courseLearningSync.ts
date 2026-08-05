// Utility for unifying Teacher and Student Course Content, Progress Tracking, Video Watching, Assignments, Submissions, Feedback, and Notifications.

export interface CourseChapter {
  id: string;
  courseId: string; // e.g. 'begena', 'krar', 'masenqo', 'washint', 'vocal', 'kebero'
  instrument: string; // 'Begena', 'Krar', etc.
  level: string; // 'Basic 1', 'Basic 2', etc.
  teacherId?: string;
  teacherName?: string;
  title: string;
  description: string;
  order: number;
  status: 'Draft' | 'Published' | 'Unpublished';
  createdAt?: string;
}

export interface CourseLesson {
  id: string;
  chapterId: string;
  courseId: string;
  instrument: string;
  level: string;
  teacherId?: string;
  teacherName?: string;
  title: string;
  description: string;
  durationText: string;
  videoUrl: string;
  notationSequence?: string;
  order: number;
  status: 'Draft' | 'Published' | 'Unpublished';
  isRequired: boolean;
  requiredWatchPercent?: number; // e.g. 80
  assignmentTitle?: string;
  assignmentInstructions?: string;
  assignmentDueDate?: string;
  assignmentMaxScore?: number;
  createdAt?: string;
}

export interface VideoWatchRecord {
  studentId: string;
  enrollmentId?: string;
  courseId: string;
  lessonId: string;
  videoId: string;
  watchProgressPercent: number; // 0 to 100
  requiredWatchPercent: number; // default 80
  completed: boolean;
  completedAt?: string;
  lastWatchedAt: string;
}

export interface LessonCompletionRecord {
  studentId: string;
  enrollmentId?: string;
  courseId: string;
  lessonId: string;
  completedAt: string;
}

export interface CourseAssignment {
  id: string;
  lessonId?: string;
  chapterId?: string;
  courseId: string;
  instrument: string;
  level: string;
  teacherId: string;
  teacherName?: string;
  title: string;
  instructions: string;
  dueDate: string;
  maxScore: number;
  status: 'Draft' | 'Published' | 'Unpublished';
  createdAt: string;
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  assignmentTitle: string;
  lessonId?: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  teacherId: string;
  enrollmentId: string;
  courseId: string;
  instrument: string;
  level: string;
  submittedAt: string;
  submissionUrl: string;
  notes?: string;
  status: 'Pending Review' | 'Under Review' | 'Graded';
  score?: string; // e.g. "95/100"
  letterGrade?: string; // e.g. "A"
  feedback?: string;
  gradedAt?: string;
  gradedBy?: string;
}

export interface TeacherStudentFeedback {
  id: string;
  studentId: string;
  enrollmentId: string;
  teacherId: string;
  teacherName: string;
  courseId: string;
  message: string;
  type: 'General Advice' | 'Practice Correction' | 'Assignment Review' | 'Encouragement';
  createdAt: string;
}

export interface StudentProgressEvaluation {
  id: string;
  studentId: string;
  studentName?: string;
  enrollmentId: string;
  teacherId: string;
  teacherName: string;
  courseId: string;
  instrument: string;
  level?: string;
  tuningScore: number;       // 1 to 5
  rhythmScore: number;       // 1 to 5
  techniqueScore: number;    // 1 to 5
  pieceMasteryScore: number; // 1 to 5
  overallProgressPercent: number; // 0 to 100
  grade?: string;            // e.g. "A+", "A", "B"
  teacherNotes: string;
  evaluatedAt: string;
}

export interface SystemNotification {
  id: string;
  recipientId: string; // studentId or teacherId
  recipientRole: 'student' | 'teacher' | 'admin';
  title: string;
  message: string;
  type: 'lesson_published' | 'assignment_published' | 'assignment_submitted' | 'assignment_graded' | 'feedback_received' | 'chapter_completed';
  isRead: boolean;
  createdAt: string;
  linkTab?: string;
}

// STORAGE KEYS
const CHAPTERS_KEY = 'ab_course_chapters_v1';
const LESSONS_KEY = 'ab_course_lessons_v1';
const ASSIGNMENTS_KEY = 'ab_course_assignments_v1';
const SUBMISSIONS_KEY = 'ab_assignment_submissions_v1';
const VIDEO_PROGRESS_KEY = 'ab_video_progress_v1';
const LESSON_COMPLETIONS_KEY = 'ab_student_lesson_completions_v1';
const FEEDBACK_KEY = 'ab_teacher_student_feedback_v1';
const EVALUATIONS_KEY = 'ab_student_evaluations_v1';
const NOTIFICATIONS_KEY = 'ab_notifications_v1';

// INITIAL SEED CHAPTERS & LESSONS
const DEFAULT_SEED_CHAPTERS: CourseChapter[] = [
  // BEGENA
  {
    id: 'ch_begena_1',
    courseId: 'begena',
    instrument: 'Begena',
    level: 'Basic 1',
    title: 'Chapter 1: Foundations of Begena & Tuning',
    description: 'Historical origins, seating posture, thumb placement, and pentatonic tuning systems.',
    order: 1,
    status: 'Published',
    createdAt: new Date().toISOString()
  },
  {
    id: 'ch_begena_2',
    courseId: 'begena',
    instrument: 'Begena',
    level: 'Basic 1',
    title: 'Chapter 2: Traditional Plucking Patterns',
    description: 'Alternate plucking mechanics for Seyfe Selassie and Yidresemal Melaku hymns.',
    order: 2,
    status: 'Published',
    createdAt: new Date().toISOString()
  },
  {
    id: 'ch_begena_3',
    courseId: 'begena',
    instrument: 'Begena',
    level: 'Basic 1',
    title: 'Chapter 3: Basic Chants & Seyfe Selassie Repertoire',
    description: 'Traditional chants and spiritual repertoire performance.',
    order: 3,
    status: 'Published',
    createdAt: new Date().toISOString()
  },
  {
    id: 'ch_begena_4',
    courseId: 'begena',
    instrument: 'Begena',
    level: 'Basic 1',
    title: 'Chapter 4: Advanced Pentatonic Repertoire & Recitals',
    description: 'Advanced thumb technique and solo recitation.',
    order: 4,
    status: 'Published',
    createdAt: new Date().toISOString()
  },

  // KRAR - Exact 7 Modules from Student Krar Learning Portal
  {
    id: 'ch_krar_1',
    courseId: 'krar',
    instrument: 'Krar',
    level: 'Basic 1',
    title: 'ምዕራፍ አንድ : የክራር ትምህርት ማውጫ እና የትምህርት መንገድ (Basic 1 Roadmap)',
    description: 'የቤሲክ አንድ ደረጃ የትምህርት ክፍሎች፣ የቅኝቶች አመሰረታት እና የዝርዝር መዝሙራት ማውጫ።',
    order: 1,
    status: 'Published',
    createdAt: new Date().toISOString()
  },
  {
    id: 'ch_krar_2',
    courseId: 'krar',
    instrument: 'Krar',
    level: 'Basic 1',
    title: 'ምዕራፍ ሁለት : የክራር ክፍሎችና አያያዝ (Anatomy & Plectrum Holding)',
    description: 'የክራር አወቃቀር (ብርክ፣ ገበታ፣ አውታሮች) እና የመቃነያ/ጥፍር አያያዝ ቴክኒኮች።',
    order: 2,
    status: 'Published',
    createdAt: new Date().toISOString()
  },
  {
    id: 'ch_krar_3',
    courseId: 'krar',
    instrument: 'Krar',
    level: 'Basic 1',
    title: 'ምዕራፍ ሦስት : የክራር ቅኝቶችና ድርደራ (Tuning Systems & Scales)',
    description: '5ቱ የኢትዮጵያ ቅኝቶች (ትዝታ፣ ባቲ፣ አምባሰል፣ አንቺሆዬ፣ ሰላምታ) አኮርድና ቅኝት።',
    order: 3,
    status: 'Published',
    createdAt: new Date().toISOString()
  },
  {
    id: 'ch_krar_4',
    courseId: 'krar',
    instrument: 'Krar',
    level: 'Basic 1',
    title: 'ምዕራፍ አራት : የትዝታ ቅኝት መዝሙራት (Tizita Scale Songs)',
    description: 'በትዝታ ቅኝት የተደረደሩ የመክፈቻ መዝሙራትና የጣት ቅልጥፍና ልምምዶች።',
    order: 4,
    status: 'Published',
    createdAt: new Date().toISOString()
  },
  {
    id: 'ch_krar_5',
    courseId: 'krar',
    instrument: 'Krar',
    level: 'Basic 1',
    title: 'ምዕራፍ አምስት : የቸርነት/አንቺሆዬ ቅኝት መዝሙራት (Cherenet / Anchihoye Scale Songs)',
    description: 'በቸርነት ቅኝት የተቀናበሩ የክራር ድርደራዎችና የተመረጡ መንፈሳዊ መዝሙራት።',
    order: 5,
    status: 'Published',
    createdAt: new Date().toISOString()
  },
  {
    id: 'ch_krar_6',
    courseId: 'krar',
    instrument: 'Krar',
    level: 'Basic 1',
    title: 'ምዕራፍ ስድስት : የባቲ ቅኝት መዝሙራት (Bati Scale Songs)',
    description: 'በባቲ ቅኝት የተቀናበሩ የክራር ድርደራዎችና የተመረጡ መንፈሳዊ መዝሙራት።',
    order: 6,
    status: 'Published',
    createdAt: new Date().toISOString()
  },
  {
    id: 'ch_krar_7',
    courseId: 'krar',
    instrument: 'Krar',
    level: 'Basic 1',
    title: 'ምዕራፍ ሰባት : የአምባሰል ቅኝት መዝሙራት (Ambassel Scale Songs)',
    description: 'የአምባሰልና የሰላምታ ቅኝት ድርደራ ምስጢራትና የመዝሙር ልምምድ።',
    order: 7,
    status: 'Published',
    createdAt: new Date().toISOString()
  },

  // MASENQO
  {
    id: 'ch_masenqo_1',
    courseId: 'masenqo',
    instrument: 'Masenqo',
    level: 'Basic 1',
    title: 'Chapter 1: Masenqo Bowing & Single-String Fingering',
    description: 'Horsehair bow bowing technique, peg tuning, and vocal pitch matching.',
    order: 1,
    status: 'Published',
    createdAt: new Date().toISOString()
  },

  // WASHINT
  {
    id: 'ch_washint_1',
    courseId: 'washint',
    instrument: 'Washint',
    level: 'Basic 1',
    title: 'Chapter 1: Washint Embouchure & Finger Holes',
    description: 'Air column control, 4-hole finger positions, and breath control.',
    order: 1,
    status: 'Published',
    createdAt: new Date().toISOString()
  },

  // KEBERO
  {
    id: 'ch_kebero_1',
    courseId: 'kebero',
    instrument: 'Kebero',
    level: 'Basic 1',
    title: 'Chapter 1: Kebero Rhythm Mechanics & Church Beat Patterns',
    description: 'Hand striking angles, bass/treble head resonance, and liturgical beats.',
    order: 1,
    status: 'Published',
    createdAt: new Date().toISOString()
  },

  // VOCAL
  {
    id: 'ch_vocal_1',
    courseId: 'vocal',
    instrument: 'Vocal',
    level: 'Basic 1',
    title: 'Chapter 1: Zema Vocal Pitching & Traditional Modes',
    description: 'Diaphragmatic breath support, vocal ornaments (Kekema), and pitch control.',
    order: 1,
    status: 'Published',
    createdAt: new Date().toISOString()
  }
];

const DEFAULT_SEED_LESSONS: CourseLesson[] = [
  // BEGENA
  {
    id: 'les_begena_1',
    chapterId: 'ch_begena_1',
    courseId: 'begena',
    instrument: 'Begena',
    level: 'Basic 1',
    title: 'Lesson 1: Introduction to the Sacred Ten Strings',
    description: 'Understand string numbering, frame tension, and the leather buzz bridge (Sene).',
    durationText: '20 min',
    videoUrl: 'https://www.youtube.com/embed/2GpKxNl_KW0',
    notationSequence: '1 2 3 4 5',
    order: 1,
    status: 'Published',
    isRequired: true,
    requiredWatchPercent: 80,
    createdAt: new Date().toISOString()
  },
  {
    id: 'les_begena_2',
    chapterId: 'ch_begena_1',
    courseId: 'begena',
    instrument: 'Begena',
    level: 'Basic 1',
    title: 'Lesson 2: Right-hand Thumb & Index Rest Mechanics',
    description: 'Seating posture, arm angle, and thumb rest positioning on the support pillar.',
    durationText: '25 min',
    videoUrl: 'https://www.youtube.com/embed/2GpKxNl_KW0',
    notationSequence: '1 3 2 4 3',
    order: 2,
    status: 'Published',
    isRequired: true,
    requiredWatchPercent: 80,
    createdAt: new Date().toISOString()
  },
  {
    id: 'les_begena_3',
    chapterId: 'ch_begena_2',
    courseId: 'begena',
    instrument: 'Begena',
    level: 'Basic 1',
    title: 'Lesson 3: Tezita Plucking Pattern & Recital Drill',
    description: 'Master the ascending pentatonic sequence for basic devotional chants.',
    durationText: '30 min',
    videoUrl: 'https://www.youtube.com/embed/2GpKxNl_KW0',
    notationSequence: '1 3 3 2 1',
    order: 3,
    status: 'Published',
    isRequired: true,
    requiredWatchPercent: 80,
    assignmentTitle: 'Tezita Scale Recital Submission',
    assignmentInstructions: 'Record a 2-minute video demonstrating your hand position while plucking Tezita.',
    assignmentDueDate: '2026-08-20',
    assignmentMaxScore: 100,
    createdAt: new Date().toISOString()
  },

  // KRAR
  {
    id: 'les_krar_1_1',
    chapterId: 'ch_krar_1',
    courseId: 'krar',
    instrument: 'Krar',
    level: 'Basic 1',
    title: 'ትምህርት 1.1 : የክራር አመጣጥና ታሪካዊ አመሰራረት',
    description: 'ክራር በጥንታዊቷ ኢትዮጵያ ውስጥ ከዘመነ ብሉይ ጀምሮ በማኅበራዊና መንፈሳዊ ሥነ-ስርዓቶች ላይ በሰፊው ይፈለግ የነበረ ድንቅ የኪነ-ጥበብና የሙዚቃ መሣሪያ ነው።',
    durationText: '12 min',
    videoUrl: 'https://www.youtube.com/embed/2GpKxNl_KW0',
    notationSequence: '1 2 3 4 5 6 - 6 5 4 3 2 1',
    order: 1,
    status: 'Published',
    isRequired: true,
    requiredWatchPercent: 80,
    createdAt: new Date().toISOString()
  },
  {
    id: 'les_krar_1_2',
    chapterId: 'ch_krar_1',
    courseId: 'krar',
    instrument: 'Krar',
    level: 'Basic 1',
    title: 'ትምህርት 1.2 : ባህላዊና ኤሌክትሪክ ክራር ልዩነቶች',
    description: 'ባህላዊ ክራር ከእንጨት፣ ከቆዳና ከጅማት/ከቀጭን ሽቦ የሚሠራ ሲሆን ኤሌክትሪክ ክራር ደግሞ የድምፅ ማጉያ (Pickups & Amp) በመጠቀም ዘመናዊ ድምፅን ያመነጫል።',
    durationText: '15 min',
    videoUrl: 'https://www.youtube.com/embed/2GpKxNl_KW0',
    notationSequence: '1 3 5 2 4 6 - 6 4 2 5 3 1',
    order: 2,
    status: 'Published',
    isRequired: true,
    requiredWatchPercent: 80,
    createdAt: new Date().toISOString()
  },
  {
    id: 'les_krar_2_1',
    chapterId: 'ch_krar_2',
    courseId: 'krar',
    instrument: 'Krar',
    level: 'Basic 1',
    title: 'ትምህርት 2.1 : የክራር አካላትና የቁሳቁስ ዝርዝር',
    description: 'የክራር ዋና ዋና አካላት፦ 1. ብርክ (Pillars & Crossbar) 2. ገበታ/ቆዳ (Soundbox) 3. አውታሮች/ክሮች (Strings) 4. ድምፅ ቀዳዳ (Soundhole) 5. መቆንጠጫ/መቃነያ (Plectrum)',
    durationText: '18 min',
    videoUrl: 'https://www.youtube.com/embed/2GpKxNl_KW0',
    notationSequence: '1 2 3 - 4 5 6 - 1 5 3',
    order: 3,
    status: 'Published',
    isRequired: true,
    requiredWatchPercent: 80,
    createdAt: new Date().toISOString()
  },
  {
    id: 'les_krar_2_2',
    chapterId: 'ch_krar_2',
    courseId: 'krar',
    instrument: 'Krar',
    level: 'Basic 1',
    title: 'ትምህርት 2.2 : የክራር ትክክለኛ አያያዝና የመቃነያ/ጥፍር አጠቃቀም',
    description: 'ክራርን በእቅፍ ወይም በጭን ላይ በመደገፍ የግራ እጅ ጣቶች አውታሮችን በማቃለል/በመያዝ (muting)፣ በቀኝ እጅ ደግሞ በመቃነያ (Plectrum) ወይም በጣቶች አጥንት በመምታት ይደረደራል።',
    durationText: '20 min',
    videoUrl: 'https://www.youtube.com/embed/2GpKxNl_KW0',
    notationSequence: '1 - 2 - 3 - 4 - 5 - 6',
    order: 4,
    status: 'Published',
    isRequired: true,
    requiredWatchPercent: 80,
    createdAt: new Date().toISOString()
  },
  {
    id: 'les_krar_3_1',
    chapterId: 'ch_krar_3',
    courseId: 'krar',
    instrument: 'Krar',
    level: 'Basic 1',
    title: 'ትምህርት 3.1 : የትዝታ ቅኝት አኮርድና የክሮች አስተካከል።',
    description: 'በትዝታ ቅኝት ጊዜ ክራር 6ቱ አውታሮቹ በሚከተለው ድምፅ ይመደባሉ፦ 1ኛ=E, 2ኛ=G, 3ኛ=A, 4ኛ=B, 5ኛ=D, 6ኛ=E።',
    durationText: '22 min',
    videoUrl: 'https://www.youtube.com/embed/2GpKxNl_KW0',
    notationSequence: '1 2 3 4 5 6 - 5 4 3 2 1',
    order: 5,
    status: 'Published',
    isRequired: true,
    requiredWatchPercent: 80,
    createdAt: new Date().toISOString()
  },
  {
    id: 'les_krar_4_1',
    chapterId: 'ch_krar_4',
    courseId: 'krar',
    instrument: 'Krar',
    level: 'Basic 1',
    title: 'ትምህርት 4.1 : የትዝታ ቅኝት የመክፈቻ መዝሙር - አቤቱ ደግ ሰው አልቋል',
    description: 'በትዝታ ቅኝት የተደረደረ የመክፈቻ መዝሙር። በጣቶች መረጣና በመቃነያ ምት የሚደረደር ድንቅ ዜማ።',
    durationText: '25 min',
    videoUrl: 'https://www.youtube.com/embed/2GpKxNl_KW0',
    notationSequence: '1 3 5 4 3 2 1 - 2 4 5 6 5 4 3',
    order: 6,
    status: 'Published',
    isRequired: true,
    requiredWatchPercent: 80,
    assignmentTitle: 'Krar Tezita Recital Video',
    assignmentInstructions: 'Record a video demonstrating the opening Tezita hymn on Krar.',
    assignmentDueDate: '2026-08-25',
    assignmentMaxScore: 100,
    createdAt: new Date().toISOString()
  }
];

// Helper: Normalize instrument string comparison
export function normalizeInst(inst?: string): string {
  if (!inst) return 'begena';
  const l = inst.toLowerCase();
  if (l.includes('begena') || l.includes('በገና')) return 'begena';
  if (l.includes('krar') || l.includes('kirar') || l.includes('ክራር') || l.includes('ቅራር')) return 'krar';
  if (l.includes('masenqo') || l.includes('masinko') || l.includes('masinqo') || l.includes('ማሰንቆ')) return 'masenqo';
  if (l.includes('washint') || l.includes('ዋሽንት')) return 'washint';
  if (l.includes('kebero') || l.includes('ከበሮ')) return 'kebero';
  if (l.includes('vocal') || l.includes('zema') || l.includes('ድምፅ') || l.includes('ድምጽ') || l.includes('ዜማ')) return 'vocal';
  return l;
}

// ----------------------------------------------------
// 1. CHAPTERS MANAGEMENT
// ----------------------------------------------------
export function getAllCourseChapters(): CourseChapter[] {
  try {
    const saved = localStorage.getItem(CHAPTERS_KEY) || localStorage.getItem('begena_chapters_v1');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error(e);
  }
  // Initialize seed if empty
  try {
    localStorage.setItem(CHAPTERS_KEY, JSON.stringify(DEFAULT_SEED_CHAPTERS));
  } catch (e) {}
  return DEFAULT_SEED_CHAPTERS;
}

export function saveAllCourseChapters(chapters: CourseChapter[]): void {
  try {
    localStorage.setItem(CHAPTERS_KEY, JSON.stringify(chapters));
    localStorage.setItem('begena_chapters_v1', JSON.stringify(chapters));
  } catch (e) {
    console.error(e);
  }
}

export function getChaptersForCourse(instrument: string, level?: string): CourseChapter[] {
  const all = getAllCourseChapters();
  const targetInst = normalizeInst(instrument);
  const instMatched = all.filter((ch) => {
    const chInst = normalizeInst(ch.instrument || ch.courseId);
    return chInst === targetInst;
  });

  if (instMatched.length === 0) return [];

  if (level) {
    const lev = level.toLowerCase();
    const levelMatched = instMatched.filter((ch) => {
      if (!ch.level) return true;
      const chLev = ch.level.toLowerCase();
      if (chLev.includes(lev) || lev.includes(chLev)) return true;
      if ((lev.includes('level 1') || lev.includes('basic 1') || lev.includes('acoustic')) && (chLev.includes('level 1') || chLev.includes('basic 1'))) return true;
      if ((lev.includes('level 2') || lev.includes('basic 2')) && (chLev.includes('level 2') || chLev.includes('basic 2'))) return true;
      if ((lev.includes('level 3') || lev.includes('basic 3')) && (chLev.includes('level 3') || chLev.includes('basic 3'))) return true;
      return false;
    });

    if (levelMatched.length > 0) {
      return levelMatched.sort((a, b) => a.order - b.order);
    }
  }

  return instMatched.sort((a, b) => a.order - b.order);
}

export function getPublishedChaptersForCourse(instrument: string, level?: string): CourseChapter[] {
  return getChaptersForCourse(instrument, level).filter((ch) => ch.status === 'Published');
}

// ----------------------------------------------------
// 2. LESSONS MANAGEMENT
// ----------------------------------------------------
export function getAllCourseLessons(): CourseLesson[] {
  try {
    const saved = localStorage.getItem(LESSONS_KEY) || localStorage.getItem('begena_lessons_v7') || localStorage.getItem('begena_lessons_v3');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error(e);
  }
  try {
    localStorage.setItem(LESSONS_KEY, JSON.stringify(DEFAULT_SEED_LESSONS));
    localStorage.setItem('begena_lessons_v7', JSON.stringify(DEFAULT_SEED_LESSONS));
  } catch (e) {}
  return DEFAULT_SEED_LESSONS;
}

export function saveAllCourseLessons(lessons: CourseLesson[]): void {
  try {
    localStorage.setItem(LESSONS_KEY, JSON.stringify(lessons));
    localStorage.setItem('begena_lessons_v7', JSON.stringify(lessons));
    localStorage.setItem('begena_lessons_v3', JSON.stringify(lessons));
  } catch (e) {
    console.error(e);
  }
}

export function getLessonsForCourse(instrument: string, level?: string): CourseLesson[] {
  const all = getAllCourseLessons();
  const targetInst = normalizeInst(instrument);
  const instMatched = all.filter((l) => {
    const lesInst = normalizeInst(l.instrument || l.courseId);
    return lesInst === targetInst;
  });

  if (instMatched.length === 0) return [];

  if (level) {
    const lev = level.toLowerCase();
    const levelMatched = instMatched.filter((l) => {
      if (!l.level) return true;
      const lLev = l.level.toLowerCase();
      if (lLev.includes(lev) || lev.includes(lLev)) return true;
      if ((lev.includes('level 1') || lev.includes('basic 1') || lev.includes('acoustic')) && (lLev.includes('level 1') || lLev.includes('basic 1'))) return true;
      if ((lev.includes('level 2') || lev.includes('basic 2')) && (lLev.includes('level 2') || lLev.includes('basic 2'))) return true;
      if ((lev.includes('level 3') || lev.includes('basic 3')) && (lLev.includes('level 3') || lLev.includes('basic 3'))) return true;
      return false;
    });

    if (levelMatched.length > 0) {
      return levelMatched.sort((a, b) => a.order - b.order);
    }
  }

  return instMatched.sort((a, b) => a.order - b.order);
}

export function getPublishedLessonsForCourse(instrument: string, level?: string): CourseLesson[] {
  return getLessonsForCourse(instrument, level).filter((l) => l.status === 'Published');
}

// ----------------------------------------------------
// 3. VIDEO PROGRESS TRACKING
// ----------------------------------------------------
export function getAllVideoProgressRecords(): VideoWatchRecord[] {
  try {
    const saved = localStorage.getItem(VIDEO_PROGRESS_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {}
  return [];
}

export function getVideoProgress(studentId: string, lessonId: string): VideoWatchRecord | null {
  const records = getAllVideoProgressRecords();
  return records.find((r) => r.studentId === studentId && r.lessonId === lessonId) || null;
}

export function updateVideoWatchProgress(
  studentId: string,
  enrollmentId: string | undefined,
  courseId: string,
  lessonId: string,
  videoId: string,
  watchPercent: number,
  requiredPercent: number = 80
): { record: VideoWatchRecord; justCompleted: boolean } {
  const records = getAllVideoProgressRecords();
  const existingIndex = records.findIndex((r) => r.studentId === studentId && r.lessonId === lessonId);
  const now = new Date().toISOString();

  let justCompleted = false;
  let record: VideoWatchRecord;

  if (existingIndex >= 0) {
    const old = records[existingIndex];
    const newProgress = Math.max(old.watchProgressPercent, watchPercent);
    const isNowCompleted = old.completed || newProgress >= requiredPercent;
    if (!old.completed && isNowCompleted) {
      justCompleted = true;
    }
    record = {
      ...old,
      watchProgressPercent: newProgress,
      completed: isNowCompleted,
      completedAt: isNowCompleted ? (old.completedAt || now) : undefined,
      lastWatchedAt: now
    };
    records[existingIndex] = record;
  } else {
    const isCompleted = watchPercent >= requiredPercent;
    if (isCompleted) justCompleted = true;
    record = {
      studentId,
      enrollmentId,
      courseId,
      lessonId,
      videoId,
      watchProgressPercent: watchPercent,
      requiredWatchPercent: requiredPercent,
      completed: isCompleted,
      completedAt: isCompleted ? now : undefined,
      lastWatchedAt: now
    };
    records.push(record);
  }

  try {
    localStorage.setItem(VIDEO_PROGRESS_KEY, JSON.stringify(records));
  } catch (e) {}

  // If video just completed, mark lesson completed!
  if (justCompleted) {
    markLessonComplete(studentId, enrollmentId, courseId, lessonId);
    createNotification({
      recipientId: studentId,
      recipientRole: 'student',
      title: '🎉 Video Lesson Completed',
      message: `You completed the required video for Lesson (${lessonId}). Lesson progression updated!`,
      type: 'lesson_published'
    });
  }

  return { record, justCompleted };
}

// ----------------------------------------------------
// 4. STUDENT LESSON COMPLETION & UNLOCKING SYSTEM
// ----------------------------------------------------
export function getStudentCompletedLessonIds(studentId: string, courseId?: string): string[] {
  let completions: LessonCompletionRecord[] = [];
  try {
    const saved = localStorage.getItem(LESSON_COMPLETIONS_KEY);
    if (saved) completions = JSON.parse(saved);
  } catch (e) {}

  // Also read fallback per-student key if exists
  let legacyCompleted: string[] = [];
  try {
    const legacySaved = localStorage.getItem(`ab_completed_lessons_${studentId}`);
    if (legacySaved) legacyCompleted = JSON.parse(legacySaved);
  } catch (e) {}

  // Read student Krar learning portal completed lessons key
  let krarCompleted: string[] = [];
  try {
    const krarSaved = localStorage.getItem(`krar_completed_${studentId}`);
    if (krarSaved) krarCompleted = JSON.parse(krarSaved);
  } catch (e) {}

  const list = completions
    .filter((c) => c.studentId === studentId && (!courseId || normalizeInst(c.courseId) === normalizeInst(courseId)))
    .map((c) => c.lessonId);

  const rawCombined = Array.from(new Set([...list, ...legacyCompleted, ...krarCompleted]));
  const expanded = new Set<string>(rawCombined);

  // Unify aliases between les_k1_1 and les_krar_1_1 etc.
  rawCombined.forEach((id) => {
    if (id.startsWith('les_k1_')) expanded.add(id.replace('les_k1_', 'les_krar_1_'));
    if (id.startsWith('les_krar_1_')) expanded.add(id.replace('les_krar_1_', 'les_k1_'));
    if (id.startsWith('les_k2_')) expanded.add(id.replace('les_k2_', 'les_krar_2_'));
    if (id.startsWith('les_krar_2_')) expanded.add(id.replace('les_krar_2_', 'les_k2_'));
    if (id.startsWith('les_k3_')) expanded.add(id.replace('les_k3_', 'les_krar_3_'));
    if (id.startsWith('les_krar_3_')) expanded.add(id.replace('les_krar_3_', 'les_k3_'));
    if (id.startsWith('les_k4_')) expanded.add(id.replace('les_k4_', 'les_krar_4_'));
    if (id.startsWith('les_krar_4_')) expanded.add(id.replace('les_krar_4_', 'les_k4_'));
  });

  return Array.from(expanded);
}

export function getStudentCompletedLessonRecords(studentId: string, courseId?: string): LessonCompletionRecord[] {
  let completions: LessonCompletionRecord[] = [];
  try {
    const saved = localStorage.getItem(LESSON_COMPLETIONS_KEY);
    if (saved) completions = JSON.parse(saved);
  } catch (e) {}
  return completions.filter((c) => c.studentId === studentId && (!courseId || normalizeInst(c.courseId) === normalizeInst(courseId)));
}

export function markLessonComplete(studentId: string, enrollmentId: string | undefined, courseId: string, lessonId: string): void {
  let completions: LessonCompletionRecord[] = [];
  try {
    const saved = localStorage.getItem(LESSON_COMPLETIONS_KEY);
    if (saved) completions = JSON.parse(saved);
  } catch (e) {}

  const exists = completions.some((c) => c.studentId === studentId && c.lessonId === lessonId);
  if (!exists) {
    completions.push({
      studentId,
      enrollmentId,
      courseId,
      lessonId,
      completedAt: new Date().toISOString()
    });
    try {
      localStorage.setItem(LESSON_COMPLETIONS_KEY, JSON.stringify(completions));
    } catch (e) {}
  }

  // Also update legacy per-student key for backwards compatibility
  try {
    const legacyKey = `ab_completed_lessons_${studentId}`;
    const legacySaved = localStorage.getItem(legacyKey);
    const list: string[] = legacySaved ? JSON.parse(legacySaved) : [];
    if (!list.includes(lessonId)) {
      list.push(lessonId);
      localStorage.setItem(legacyKey, JSON.stringify(list));
    }
  } catch (e) {}

  syncStudentProgressToEnrollment(studentId, courseId, enrollmentId);
}

export function toggleLessonComplete(studentId: string, enrollmentId: string | undefined, courseId: string, lessonId: string): boolean {
  let completions: LessonCompletionRecord[] = [];
  try {
    const saved = localStorage.getItem(LESSON_COMPLETIONS_KEY);
    if (saved) completions = JSON.parse(saved);
  } catch (e) {}

  const existsIndex = completions.findIndex((c) => c.studentId === studentId && c.lessonId === lessonId);
  let isNowCompleted = false;

  if (existsIndex !== -1) {
    completions.splice(existsIndex, 1);
    isNowCompleted = false;
  } else {
    completions.push({
      studentId,
      enrollmentId,
      courseId,
      lessonId,
      completedAt: new Date().toISOString()
    });
    isNowCompleted = true;
  }

  try {
    localStorage.setItem(LESSON_COMPLETIONS_KEY, JSON.stringify(completions));
  } catch (e) {}

  // Update legacy key
  try {
    const legacyKey = `ab_completed_lessons_${studentId}`;
    const legacySaved = localStorage.getItem(legacyKey);
    let list: string[] = legacySaved ? JSON.parse(legacySaved) : [];
    if (isNowCompleted) {
      if (!list.includes(lessonId)) list.push(lessonId);
    } else {
      list = list.filter(id => id !== lessonId);
    }
    localStorage.setItem(legacyKey, JSON.stringify(list));
  } catch (e) {}

  syncStudentProgressToEnrollment(studentId, courseId, enrollmentId);
  return isNowCompleted;
}

export function syncStudentProgressToEnrollment(
  studentId: string,
  courseId: string,
  enrollmentId?: string,
  explicitProgressPercent?: number
): number {
  const calc = calculateStudentProgress(studentId, courseId);
  const progressPercent = explicitProgressPercent !== undefined ? explicitProgressPercent : calc.progressPercent;

  // 1. Update ab_enrollments_v4
  try {
    const savedEnrs = localStorage.getItem('ab_enrollments_v4');
    if (savedEnrs) {
      const parsedEnrs = JSON.parse(savedEnrs);
      if (Array.isArray(parsedEnrs)) {
        let changed = false;
        const updated = parsedEnrs.map((e: any) => {
          if (
            (enrollmentId && e.id === enrollmentId) ||
            e.studentId === studentId ||
            (e.studentEmail && e.studentEmail.toLowerCase() === studentId.toLowerCase()) ||
            normalizeInst(e.instrument || e.courseName) === normalizeInst(courseId)
          ) {
            changed = true;
            return {
              ...e,
              progressPercent,
              currentChapterTitle: calc.currentChapter?.title || e.currentChapterTitle || '',
              currentLessonTitle: calc.currentLesson?.title || e.currentLessonTitle || '',
              lastActivityAt: calc.lastActivityAt,
              completedChaptersCount: calc.completedChaptersCount,
              totalChaptersCount: calc.totalChaptersCount,
              completedLessonsCount: calc.completedRequiredLessonsCount,
              totalLessonsCount: calc.totalPublishedRequiredLessonsCount,
              isCertificateEligible: calc.isCertificateEligible
            };
          }
          return e;
        });
        if (changed) {
          localStorage.setItem('ab_enrollments_v4', JSON.stringify(updated));
        }
      }
    }
  } catch (e) {}

  // 2. Update ab_students_v3
  try {
    const savedStus = localStorage.getItem('ab_students_v3');
    if (savedStus) {
      const parsedStus = JSON.parse(savedStus);
      if (Array.isArray(parsedStus)) {
        let changed = false;
        const updated = parsedStus.map((s: any) => {
          if (s.id === studentId || (s.email && s.email.toLowerCase() === studentId.toLowerCase())) {
            changed = true;
            return {
              ...s,
              progressPercent,
              lastActivityAt: calc.lastActivityAt
            };
          }
          return s;
        });
        if (changed) {
          localStorage.setItem('ab_students_v3', JSON.stringify(updated));
        }
      }
    }
  } catch (e) {}

  // 3. Update ab_accounts & ab_session_user
  try {
    const session = JSON.parse(localStorage.getItem('ab_session_user') || 'null');
    if (session && (session.id === studentId || (session.email && session.email.toLowerCase() === studentId.toLowerCase()))) {
      session.progressPercent = progressPercent;
      localStorage.setItem('ab_session_user', JSON.stringify(session));
    }
  } catch (e) {}

  // Dispatch live sync events
  try {
    window.dispatchEvent(new Event('ab_students_updated'));
    window.dispatchEvent(new Event('ab_progress_updated'));
    window.dispatchEvent(new Event('storage'));
  } catch (e) {}

  return progressPercent;
}

export function isLessonUnlocked(studentId: string, instrument: string, level: string | undefined, lessonId: string): boolean {
  const publishedLessons = getPublishedLessonsForCourse(instrument, level);
  const targetIndex = publishedLessons.findIndex((l) => l.id === lessonId);

  // If lesson is not published or not found, it is locked!
  if (targetIndex === -1) return false;

  // First published lesson in the course is always unlocked!
  if (targetIndex === 0) return true;

  // Check if ALL preceding required lessons are completed
  const completedIds = getStudentCompletedLessonIds(studentId, instrument);
  for (let i = 0; i < targetIndex; i++) {
    const prevLesson = publishedLessons[i];
    if (prevLesson.isRequired && !completedIds.includes(prevLesson.id)) {
      return false; // Lock because previous required lesson is incomplete
    }
  }

  return true;
}

// ----------------------------------------------------
// 5. ASSIGNMENTS & SUBMISSIONS FLOW
// ----------------------------------------------------
export function getAllAssignmentSubmissions(): AssignmentSubmission[] {
  try {
    const saved = localStorage.getItem(SUBMISSIONS_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {}
  return [];
}

export function saveAssignmentSubmission(submission: Omit<AssignmentSubmission, 'id' | 'submittedAt' | 'status'>): AssignmentSubmission {
  const all = getAllAssignmentSubmissions();
  const newSub: AssignmentSubmission = {
    ...submission,
    id: `sub_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    submittedAt: new Date().toISOString().split('T')[0],
    status: 'Pending Review'
  };
  const updated = [newSub, ...all];
  try {
    localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(updated));
  } catch (e) {}

  // Notify Teacher
  createNotification({
    recipientId: submission.teacherId,
    recipientRole: 'teacher',
    title: '📥 New Assignment Submission',
    message: `${submission.studentName} submitted work for "${submission.assignmentTitle}".`,
    type: 'assignment_submitted'
  });

  return newSub;
}

export function gradeAssignmentSubmission(
  submissionId: string,
  score: string,
  letterGrade: string,
  feedback: string,
  gradedBy: string
): boolean {
  const all = getAllAssignmentSubmissions();
  const idx = all.findIndex((s) => s.id === submissionId);
  if (idx === -1) return false;

  const target = all[idx];
  const updated: AssignmentSubmission = {
    ...target,
    score,
    letterGrade,
    feedback,
    gradedBy,
    status: 'Graded',
    gradedAt: new Date().toISOString().split('T')[0]
  };
  all[idx] = updated;

  try {
    localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(all));
  } catch (e) {}

  // Notify Student
  createNotification({
    recipientId: target.studentId,
    recipientRole: 'student',
    title: '📝 Assignment Graded',
    message: `Your instructor graded "${target.assignmentTitle}" with grade ${letterGrade} (${score}). Feedback: "${feedback}"`,
    type: 'assignment_graded'
  });

  return true;
}

// ----------------------------------------------------
// 6. TEACHER DIRECT FEEDBACK
// ----------------------------------------------------
export function getAllTeacherFeedback(): TeacherStudentFeedback[] {
  try {
    const saved = localStorage.getItem(FEEDBACK_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {}
  return [];
}

export function addTeacherFeedback(
  studentId: string,
  enrollmentId: string,
  teacherId: string,
  teacherName: string,
  courseId: string,
  message: string,
  type: TeacherStudentFeedback['type'] = 'General Advice'
): TeacherStudentFeedback {
  const all = getAllTeacherFeedback();
  const newFb: TeacherStudentFeedback = {
    id: `fb_${Date.now()}`,
    studentId,
    enrollmentId,
    teacherId,
    teacherName,
    courseId,
    message,
    type,
    createdAt: new Date().toISOString()
  };
  const updated = [newFb, ...all];
  try {
    localStorage.setItem(FEEDBACK_KEY, JSON.stringify(updated));
  } catch (e) {}

  // Notify Student
  createNotification({
    recipientId: studentId,
    recipientRole: 'student',
    title: '💬 Instructor Feedback Received',
    message: `Teacher ${teacherName} sent you new feedback: "${message.substring(0, 80)}..."`,
    type: 'feedback_received'
  });

  return newFb;
}

export function getFeedbackForStudent(studentId: string, courseId?: string): TeacherStudentFeedback[] {
  const all = getAllTeacherFeedback();
  return all.filter((f) => f.studentId === studentId && (!courseId || normalizeInst(f.courseId) === normalizeInst(courseId)));
}

// ----------------------------------------------------
// 6B. STUDENT PROGRESS EVALUATIONS (TEACHER TO STUDENT)
// ----------------------------------------------------
export function getAllProgressEvaluations(): StudentProgressEvaluation[] {
  try {
    const saved = localStorage.getItem(EVALUATIONS_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {}
  
  // Seed evaluation if empty
  return [
    {
      id: 'eval_seed_1',
      studentId: 'u_student_kirar',
      studentName: 'Kirar Student',
      enrollmentId: 'ENR-001',
      teacherId: 't1',
      teacherName: 'Alex T',
      courseId: 'krar',
      instrument: 'Kirar',
      level: 'Basic Level 1',
      tuningScore: 4,
      rhythmScore: 4,
      techniqueScore: 5,
      pieceMasteryScore: 4,
      overallProgressPercent: 45,
      grade: 'A',
      teacherNotes: 'Demonstrates excellent string control, rhythm stability, and pitch accuracy. Recommended to practice 6-string scale transitions daily.',
      evaluatedAt: new Date(Date.now() - 86400000 * 2).toISOString()
    }
  ];
}

export function addStudentProgressEvaluation(
  data: Omit<StudentProgressEvaluation, 'id' | 'evaluatedAt'>
): StudentProgressEvaluation {
  const all = getAllProgressEvaluations();
  const newEval: StudentProgressEvaluation = {
    ...data,
    id: `eval_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    evaluatedAt: new Date().toISOString()
  };

  const updated = [newEval, ...all];
  try {
    localStorage.setItem(EVALUATIONS_KEY, JSON.stringify(updated));
  } catch (e) {}

  // Sync overall progress percentage directly to student enrollment & student record
  if (typeof data.overallProgressPercent === 'number') {
    syncStudentProgressToEnrollment(data.studentId, data.instrument || data.courseId, data.enrollmentId, data.overallProgressPercent);
  }

  // Notify student of new progress evaluation
  createNotification({
    recipientId: data.studentId,
    recipientRole: 'student',
    title: '📊 Progress Evaluation Updated',
    message: `Your instructor ${data.teacherName} recorded a new progress evaluation for ${data.instrument}: Grade ${data.grade || 'A'} (${data.overallProgressPercent}% Mastery).`,
    type: 'feedback_received'
  });

  try {
    window.dispatchEvent(new Event('ab_evaluations_updated'));
    window.dispatchEvent(new Event('ab_progress_updated'));
    window.dispatchEvent(new Event('storage'));
  } catch (e) {}

  return newEval;
}

export function getEvaluationsForStudent(studentId: string, courseId?: string): StudentProgressEvaluation[] {
  const all = getAllProgressEvaluations();
  return all.filter(
    (e) =>
      (e.studentId === studentId || (e.studentName && e.studentName.toLowerCase().trim() === studentId.toLowerCase().trim())) &&
      (!courseId || normalizeInst(e.instrument || e.courseId) === normalizeInst(courseId))
  );
}

// ----------------------------------------------------
// 7. NOTIFICATIONS SYSTEM
// ----------------------------------------------------
export function getAllNotifications(): SystemNotification[] {
  try {
    const saved = localStorage.getItem(NOTIFICATIONS_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {}
  return [];
}

export function createNotification(data: Omit<SystemNotification, 'id' | 'isRead' | 'createdAt'>): SystemNotification {
  const all = getAllNotifications();
  const newNotif: SystemNotification = {
    ...data,
    id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    isRead: false,
    createdAt: new Date().toISOString()
  };
  const updated = [newNotif, ...all];
  try {
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated));
  } catch (e) {}
  return newNotif;
}

export function markNotificationRead(id: string): void {
  const all = getAllNotifications();
  const idx = all.findIndex((n) => n.id === id);
  if (idx !== -1) {
    all[idx].isRead = true;
    try {
      localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(all));
    } catch (e) {}
  }
}

// ----------------------------------------------------
// 8. REAL STUDENT PROGRESS, CHAPTER UNLOCKING & CERTIFICATE CALCULATOR
// ----------------------------------------------------
export interface DetailedChapterStatus {
  id: string;
  title: string;
  order: number;
  status: 'COMPLETED' | 'UNLOCKED' | 'LOCKED';
  completedLessonsCount: number;
  totalLessonsCount: number;
  isCompleted: boolean;
  isUnlocked: boolean;
}

export interface StudentCalculatedProgress {
  progressPercent: number;
  completedRequiredLessonsCount: number;
  totalPublishedRequiredLessonsCount: number;
  completedVideosCount: number;
  totalPublishedVideosCount: number;
  submittedAssignmentsCount: number;
  gradedAssignmentsCount: number;
  completedChaptersCount: number;
  totalChaptersCount: number;
  lockedChaptersCount: number;
  unlockedChaptersCount: number;
  chaptersStatus: DetailedChapterStatus[];
  currentChapter: { id: string; title: string; order: number } | null;
  currentLesson: { id: string; title: string; order: number } | null;
  lastActivityAt: string;
  isCertificateEligible: boolean;
  certificateStatusText: string;
}

function matchesChapterIdentifier(lessonChapterId: string, targetChapterId: string): boolean {
  if (!lessonChapterId || !targetChapterId) return false;
  if (lessonChapterId.toLowerCase() === targetChapterId.toLowerCase()) return true;

  // Handle 'chapter-1' vs 'ch_krar_1' vs 'ch_begena_1'
  const targetNum = targetChapterId.match(/\d+/);
  const lessonNum = lessonChapterId.match(/\d+/);
  if (targetNum && lessonNum && targetNum[0] === lessonNum[0]) {
    return true;
  }
  return false;
}

export function isChapterCompleted(studentId: string, chapterId: string, instrument: string, level?: string): boolean {
  const publishedLessons = getPublishedLessonsForCourse(instrument, level);
  const chapterLessons = publishedLessons.filter(l => l.chapterId === chapterId || matchesChapterIdentifier(l.chapterId, chapterId));
  const completedIds = getStudentCompletedLessonIds(studentId, instrument);

  if (chapterLessons.length > 0) {
    const requiredLessons = chapterLessons.filter(l => l.isRequired !== false);
    const targetLessons = requiredLessons.length > 0 ? requiredLessons : chapterLessons;
    return targetLessons.every(l => completedIds.includes(l.id));
  }

  // Fallback for custom or seed portal chapters
  try {
    const savedChaps = localStorage.getItem(`krar_completed_chapters_${studentId}`) || localStorage.getItem('begena_completed_chapters');
    if (savedChaps) {
      const list: string[] = JSON.parse(savedChaps);
      if (list.includes(chapterId)) return true;
    }
  } catch (e) {}

  return false;
}

export function isChapterUnlocked(studentId: string, chapterId: string, instrument: string, level?: string): boolean {
  const publishedChapters = getPublishedChaptersForCourse(instrument, level);
  const targetIndex = publishedChapters.findIndex(ch => ch.id === chapterId || matchesChapterIdentifier(ch.id, chapterId));

  // First chapter (or unlisted chapter) is unlocked by default
  if (targetIndex <= 0) return true;

  // Chapter N (index > 0) is UNLOCKED if Chapter N-1 is COMPLETED
  const prevChapter = publishedChapters[targetIndex - 1];
  return isChapterCompleted(studentId, prevChapter.id, instrument, level);
}

export function getChapterStatus(studentId: string, chapterId: string, instrument: string, level?: string): 'COMPLETED' | 'UNLOCKED' | 'LOCKED' {
  if (isChapterCompleted(studentId, chapterId, instrument, level)) return 'COMPLETED';
  if (isChapterUnlocked(studentId, chapterId, instrument, level)) return 'UNLOCKED';
  return 'LOCKED';
}

export function calculateStudentProgress(studentId: string, instrument: string, level?: string): StudentCalculatedProgress {
  const publishedLessons = getPublishedLessonsForCourse(instrument, level);
  const publishedChapters = getPublishedChaptersForCourse(instrument, level);
  const requiredLessons = publishedLessons.filter((l) => l.isRequired !== false);
  const completedLessonIds = getStudentCompletedLessonIds(studentId, instrument);

  // Incorporate completed chapters from student portals
  let localCompletedChapters: string[] = [];
  try {
    const krarSaved = localStorage.getItem(`krar_completed_chapters_${studentId}`);
    if (krarSaved) localCompletedChapters.push(...JSON.parse(krarSaved));
    const begenaSaved = localStorage.getItem('begena_completed_chapters');
    if (begenaSaved) localCompletedChapters.push(...JSON.parse(begenaSaved));
  } catch (e) {}

  const finalCompletedSet = new Set<string>(completedLessonIds);
  publishedLessons.forEach((l) => {
    if (l.chapterId && localCompletedChapters.some((cId) => cId === l.chapterId || matchesChapterIdentifier(l.chapterId, cId))) {
      finalCompletedSet.add(l.id);
    }
  });

  const finalCompletedLessonIds = Array.from(finalCompletedSet);
  const completedRequiredCount = requiredLessons.filter((l) => finalCompletedLessonIds.includes(l.id)).length;
  const totalRequiredCount = requiredLessons.length;

  const lessonPct = totalRequiredCount > 0
    ? Math.min(100, Math.round((completedRequiredCount / totalRequiredCount) * 100))
    : (publishedLessons.length > 0 && publishedLessons.every(l => finalCompletedLessonIds.includes(l.id)) ? 100 : 0);

  const totalChapCount = Math.max(publishedChapters.length, 7);
  const validCompletedChaps = Array.from(new Set(localCompletedChapters.filter((c) => c.startsWith('chapter-') || c.startsWith('ch_'))));
  const chapterPct = totalChapCount > 0 ? Math.min(100, Math.round((validCompletedChaps.length / totalChapCount) * 100)) : 0;

  const progressPercent = Math.min(100, Math.max(lessonPct, chapterPct));

  // Video counts
  const videoRecords = getAllVideoProgressRecords().filter((r) => r.studentId === studentId && normalizeInst(r.courseId) === normalizeInst(instrument));
  const completedVideosCount = videoRecords.filter((r) => r.completed).length;
  const totalPublishedVideosCount = publishedLessons.filter((l) => Boolean(l.videoUrl)).length;

  // Submissions
  const submissions = getAllAssignmentSubmissions().filter((s) => s.studentId === studentId && normalizeInst(s.instrument) === normalizeInst(instrument));
  const submittedAssignmentsCount = submissions.length;
  const gradedAssignmentsCount = submissions.filter((s) => s.status === 'Graded').length;

  // Detailed Chapter Breakdown
  const chaptersStatus: DetailedChapterStatus[] = publishedChapters.map((ch) => {
    const chLessons = publishedLessons.filter(l => l.chapterId === ch.id || matchesChapterIdentifier(l.chapterId, ch.id));
    const chCompletedCount = chLessons.filter(l => completedLessonIds.includes(l.id)).length;
    const isDone = isChapterCompleted(studentId, ch.id, instrument, level);
    const isUnlocked = isChapterUnlocked(studentId, ch.id, instrument, level);
    const status: 'COMPLETED' | 'UNLOCKED' | 'LOCKED' = isDone ? 'COMPLETED' : isUnlocked ? 'UNLOCKED' : 'LOCKED';

    return {
      id: ch.id,
      title: ch.title,
      order: ch.order,
      status,
      completedLessonsCount: chCompletedCount,
      totalLessonsCount: chLessons.length,
      isCompleted: isDone,
      isUnlocked
    };
  });

  const completedChaptersCount = chaptersStatus.filter(c => c.status === 'COMPLETED').length;
  const unlockedChaptersCount = chaptersStatus.filter(c => c.status === 'UNLOCKED' || c.status === 'COMPLETED').length;
  const lockedChaptersCount = chaptersStatus.filter(c => c.status === 'LOCKED').length;

  // Determine Current Chapter and Current Lesson
  const currentChapterObj = chaptersStatus.find(c => c.status === 'UNLOCKED') || chaptersStatus[chaptersStatus.length - 1] || null;
  const currentChapter = currentChapterObj ? { id: currentChapterObj.id, title: currentChapterObj.title, order: currentChapterObj.order } : null;

  let currentLesson: { id: string; title: string; order: number } | null = null;
  if (currentChapterObj) {
    const chLessons = publishedLessons.filter(l => l.chapterId === currentChapterObj.id || matchesChapterIdentifier(l.chapterId, currentChapterObj.id));
    const firstIncomplete = chLessons.find(l => !completedLessonIds.includes(l.id));
    const target = firstIncomplete || chLessons[chLessons.length - 1];
    if (target) {
      currentLesson = { id: target.id, title: target.title, order: target.order };
    }
  }

  // Last activity timestamp
  let lastActivityAt = 'No learning activity yet';
  const recentCompletions = getStudentCompletedLessonRecords(studentId, instrument);
  if (recentCompletions.length > 0) {
    const latest = recentCompletions[recentCompletions.length - 1];
    if (latest.completedAt) {
      try {
        lastActivityAt = new Date(latest.completedAt).toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      } catch (e) {
        lastActivityAt = latest.completedAt;
      }
    }
  } else if (videoRecords.length > 0) {
    const latestVid = videoRecords[videoRecords.length - 1];
    if (latestVid.lastWatchedAt) {
      try {
        lastActivityAt = new Date(latestVid.lastWatchedAt).toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      } catch (e) {
        lastActivityAt = latestVid.lastWatchedAt;
      }
    }
  }

  const isCertificateEligible = progressPercent >= 100 && totalRequiredCount > 0;
  const certificateStatusText = isCertificateEligible
    ? 'Eligible for Official Academy Certificate (100% Completed)'
    : `In Progress (${progressPercent}% Completed — ${completedRequiredCount}/${totalRequiredCount} Required Lessons)`;

  return {
    progressPercent,
    completedRequiredLessonsCount: completedRequiredCount,
    totalPublishedRequiredLessonsCount: totalRequiredCount,
    completedVideosCount,
    totalPublishedVideosCount,
    submittedAssignmentsCount,
    gradedAssignmentsCount,
    completedChaptersCount,
    totalChaptersCount: publishedChapters.length,
    lockedChaptersCount,
    unlockedChaptersCount,
    chaptersStatus,
    currentChapter,
    currentLesson,
    lastActivityAt,
    isCertificateEligible,
    certificateStatusText
  };
}
