import {
  AutomationRule,
  AiAuditLogItem,
  AiKnowledgeDoc,
  AiQuizQuestion,
  AiPracticePlan,
  StudentGoal,
  AiChatMessage
} from '../../types';

export const SAMPLE_KNOWLEDGE_DOCS: AiKnowledgeDoc[] = [
  {
    id: 'DOC-001',
    title: 'Traditional 10-String Begena Tuning & Symbolism',
    category: 'Begena History',
    lastUpdated: '2026-06-15',
    author: 'Founder Bruk Tesfaye',
    isApproved: true,
    contentSnippet:
      'The Begena, known as King David’s Harp, features 10 gut strings. Strings 1, 5, 6, and 10 represent liturgical spiritual pillars, while strings 2, 3, 4, 7, 8, 9 match the 6 main spiritual notes. Buzzing is created by leather pieces (Sera) resting against the bridge (Birama).'
  },
  {
    id: 'DOC-002',
    title: 'Liora Begena Student Attendance & Leave Policy',
    category: 'Policy',
    lastUpdated: '2026-05-20',
    author: 'Registrar Office',
    isApproved: true,
    contentSnippet:
      'Students missing 2 consecutive unexcused classes will trigger an automated SMS/Telegram alert to parents/students and teacher follow-up. Makeup classes must be scheduled within 14 days.'
  },
  {
    id: 'DOC-003',
    title: 'Beginner Plucking Technique & Left-Hand Muting',
    category: 'Curriculum',
    lastUpdated: '2026-07-01',
    author: 'Senior Instructor Yared Assefa',
    isApproved: true,
    contentSnippet:
      'Plucking is performed using the thumb and index finger of the right hand. The left hand rests softly on strings to mute unwanted vibration during rapid octave transitions.'
  },
  {
    id: 'DOC-004',
    title: 'Sacred Mezmur Notation System (St. Yared Hymnal)',
    category: 'Teacher Material',
    lastUpdated: '2026-04-10',
    author: 'Liora Begena Academic Board',
    isApproved: true,
    contentSnippet:
      'Our curriculum uses traditional Ge’ez musical notation symbols (Ge’ez musical signs: Yizet, Deret, Rikrik, Anbir) paired with modern string numbering for diaspora ease.'
  },
  {
    id: 'DOC-005',
    title: 'Instrument Maintenance & Humidity Preservation',
    category: 'Instrument Care',
    lastUpdated: '2026-06-02',
    author: 'Master Luthier Birhanu',
    isApproved: true,
    contentSnippet:
      'Begena soundboards (Wag) are stretched animal hide. Store instruments in padded gig bags away from direct heat to prevent soundboard contraction.'
  }
];

export const SAMPLE_AUTOMATION_RULES: AutomationRule[] = [
  {
    id: 'AUTO-001',
    name: 'Absenteeism Alert (2 Missed Classes)',
    trigger: 'Student Attendance Recorded',
    condition: 'Unexcused Absence >= 2 Consecutive',
    action: 'Send Telegram & SMS Alert to Parent and Student; Create Teacher Task',
    targetChannel: 'Telegram',
    status: 'Active',
    requiresHumanApproval: false,
    triggerCount: 34,
    lastTriggered: '2026-07-21 14:30'
  },
  {
    id: 'AUTO-002',
    name: 'Course Tuition Renewal Reminder',
    trigger: 'Course Enrollment Approaching Expiry',
    condition: 'Remaining Days <= 7',
    action: 'Send SMS Payment Link to Student/Parent; Log CRM Task',
    targetChannel: 'SMS',
    status: 'Active',
    requiresHumanApproval: false,
    triggerCount: 89,
    lastTriggered: '2026-07-20 09:15'
  },
  {
    id: 'AUTO-003',
    name: 'Certificate Graduation Verification',
    trigger: 'Student Completed Module 12 & Passed Exam',
    condition: 'Final Score >= 85% AND Attendance >= 90%',
    action: 'Generate Digital Certificate Draft; Require Founder/Admin Approval',
    targetChannel: 'Notification',
    status: 'Active',
    requiresHumanApproval: true,
    triggerCount: 12,
    lastTriggered: '2026-07-19 16:45'
  },
  {
    id: 'AUTO-004',
    name: 'Overdue Assignment Reminder',
    trigger: 'Assignment Submission Deadline Passed',
    condition: 'Submission Status == Missing AND Hours Past >= 24',
    action: 'Send In-App Notification & Push Alert',
    targetChannel: 'Notification',
    status: 'Active',
    requiresHumanApproval: false,
    triggerCount: 45,
    lastTriggered: '2026-07-21 18:00'
  },
  {
    id: 'AUTO-005',
    name: 'Low Instrument String Stock Alert',
    trigger: 'Inventory Stock Level Check',
    condition: 'Item Quantity <= Reorder Threshold (10 units)',
    action: 'Create Operational Task for Branch Manager & Accountant Alert',
    targetChannel: 'Task',
    status: 'Active',
    requiresHumanApproval: false,
    triggerCount: 6,
    lastTriggered: '2026-07-18 11:00'
  }
];

export const SAMPLE_AUDIT_LOGS: AiAuditLogItem[] = [
  {
    id: 'AUD-901',
    timestamp: '2026-07-21 21:14:02',
    userName: 'Founder Bruk Tesfaye',
    userRole: 'Founder',
    querySummary: 'Requested monthly revenue trend & branch growth comparison',
    dataAccessed: 'Financial Ledger 2026, Branch Enrollments Q2',
    actionSuggested: 'Recommend opening weekend evening batch at Bole Medhanealem',
    status: 'Executed'
  },
  {
    id: 'AUD-902',
    timestamp: '2026-07-21 19:40:15',
    userName: 'Saba Tesfaye',
    userRole: 'Teacher',
    querySummary: 'Generated AI draft lesson plan for Begena Octave Muting',
    dataAccessed: 'Begena Level 1 Curriculum, Student Performance Records',
    actionSuggested: 'Published draft lesson plan after teacher edits',
    status: 'Approved'
  },
  {
    id: 'AUD-903',
    timestamp: '2026-07-21 17:22:00',
    userName: 'Dawit Hailu (Student)',
    userRole: 'Student',
    querySummary: 'Asked for 30-min personalized practice plan & tuning quiz',
    dataAccessed: 'Own Course Progress (Begena Level 1), Quiz History',
    status: 'Read Only'
  },
  {
    id: 'AUD-904',
    timestamp: '2026-07-21 15:10:44',
    userName: 'Bethlehem Tadesse',
    userRole: 'Parent',
    querySummary: 'Checked child progress & weekly attendance for Yohannes',
    dataAccessed: 'Linked Student ID #STU-2026-088 Progress Records',
    status: 'Read Only'
  }
];

export const SAMPLE_STUDENT_PRACTICE_PLAN: AiPracticePlan = {
  id: 'PR-PLAN-101',
  studentId: 'STU-2026-001',
  date: '2026-07-22',
  totalMinutes: 30,
  level: 'Begena Level 1 - Beginner',
  focusAreas: ['Right-Thumb Plucking Control', 'Sera Leather Buzzing Tuning', 'Mezmur "Kibre Yebal" Intro'],
  warmUpMinutes: 5,
  techniqueMinutes: 10,
  lessonMinutes: 10,
  mezmurMinutes: 5,
  exercises: [
    { name: 'Open String Warm-Up (Strings 1 to 10)', durationMinutes: 5, notes: 'Focus on gentle thumb release without snagging gut strings.' },
    { name: 'Sera Leather Adjustment & Buzzing Clarity', durationMinutes: 10, notes: 'Adjust leather sliders on bridge until warm buzzing resonant tone is achieved.' },
    { name: 'Lesson 4 Plucking Pattern Repeated Exercises', durationMinutes: 10, notes: 'Maintain 60 BPM steady pulse using built-in metronome.' },
    { name: 'Mezmur "Kibre Yebal" Stanza 1 Review', durationMinutes: 5, notes: 'Sing along softly while sustaining the root bass tone.' }
  ],
  status: 'Suggested',
  teacherRecommendation: 'Instructor Yared recommends focusing extra 5 minutes on index finger muting before moving to Stanza 2.'
};

export const SAMPLE_STUDENT_GOALS: StudentGoal[] = [
  {
    id: 'G-01',
    title: 'Daily 30-Minute Begena Practice Streak (7 Days)',
    targetDate: '2026-07-28',
    progressPercent: 71,
    category: 'Practice',
    streakDays: 5,
    status: 'In Progress'
  },
  {
    id: 'G-02',
    title: 'Master All 10 Begena String Tuning Frequencies',
    targetDate: '2026-08-05',
    progressPercent: 90,
    category: 'Curriculum',
    streakDays: 12,
    status: 'In Progress'
  },
  {
    id: 'G-03',
    title: 'Perform "Kibre Yebal" at Branch Recital',
    targetDate: '2026-08-15',
    progressPercent: 40,
    category: 'Performance',
    streakDays: 0,
    status: 'In Progress'
  }
];

export const SAMPLE_QUIZ_QUESTIONS: AiQuizQuestion[] = [
  {
    id: 'QZ-01',
    question: 'Which component on the Begena creates its signature buzzing resonant sound?',
    options: ['The Wag (Hide)', 'The Sera (Leather pieces on Birama)', 'The Dildiy (Pegs)', 'The Crossbar (Awer)'],
    correctAnswer: 'The Sera (Leather pieces on Birama)',
    explanation: 'The Sera are small leather slips placed between strings and the bridge (Birama). When adjusted, they vibrate against the string to create the rich buzzing timbre.',
    type: 'Multiple Choice',
    difficulty: 'Medium'
  },
  {
    id: 'QZ-02',
    question: 'The Begena traditionally has 10 strings.',
    options: ['True', 'False'],
    correctAnswer: 'True',
    explanation: 'Yes, the traditional Ethiopian Begena instrument is built with 10 gut strings.',
    type: 'True/False',
    difficulty: 'Easy'
  },
  {
    id: 'QZ-03',
    question: 'In St. Yared liturgical musical theory, what does the Ge’ez sign "Yizet" represent?',
    options: ['A sustained ascending tone', 'A abrupt muting accent', 'A low octave bass dip', 'A double-plucked tremolo'],
    correctAnswer: 'A sustained ascending tone',
    explanation: 'In Ge’ez musical notation, Yizet instructs the musician to hold and gently elevate the pitch accent.',
    type: 'Multiple Choice',
    difficulty: 'Hard'
  }
];

export const ROLE_SYSTEM_PROMPTS: Record<string, string> = {
  Student:
    'You are the Liora Begena AI Student Tutor. You help students learn the 10-string Begena, Krar, Masenqo, and sacred Ethiopian music theory. Answer clearly, encourage daily practice, offer explanations in English or Amharic, and cite official Liora Begena School course materials when explaining techniques.',
  Parent:
    'You are the Liora Begena Parent AI Advisor. You help parents track their children’s course attendance, practice streaks, assignment submissions, and teacher feedback with complete accuracy and warmth.',
  Teacher:
    'You are the Liora Begena AI Academic Assistant. You help instructors generate draft lesson plans, create quizzes, identify students needing extra attention, and draft personalized feedback for teacher approval.',
  BranchManager:
    'You are the Liora Begena AI Operations Assistant. You analyze classroom capacity, teacher schedules, inventory levels, and branch student attendance to provide operational recommendations.',
  Accountant:
    'You are the Liora Begena AI Financial Analytics Assistant. You analyze revenue trends, pending tuition payments, and branch income statistics. You CANNOT execute or modify transactions directly.',
  Admin:
    'You are the Liora Begena AI System Administration Assistant. You manage pending student registrations, staff assignments, automated rules, and system health alerts.',
  Founder:
    'You are the Liora Begena Founder AI Strategic Command Assistant. You provide high-level strategic intelligence to Founder Bruk Tesfaye regarding student growth across all branches, online campus adoption, revenue trajectories, operational risks, and expansion opportunities.'
};

