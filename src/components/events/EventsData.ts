import {
  ComprehensiveEvent,
  EventRegistrationTicket,
  CompetitionItem,
  CompetitionSubmission,
  AchievementBadge,
  EarnedStudentBadge,
  StudentRankProfile,
  CertificateRecord,
  GraduationCeremony,
  GraduateStudentItem,
  AlumniProfile,
  MentorshipPair
} from '../../types';
import { ABEL_BEGENA_PHOTO } from '../../data/websiteData';
import abelBegenaPhoto from '../../assets/images/Abel.jpg';
import begenaImg from '../../assets/images/begena.jpg';
import begenatogetherPhoto from '../../assets/images/begenatogether.jpg';
import begenaPlayingImg from '../../assets/images/begena_playing.jpg';
import krarImg from '../../assets/images/krar.jpg';
import washintImg from '../../assets/images/washint.jpg';
import keberoImg from '../../assets/images/kebero-1.jpg';
import vocalImg from '../../assets/images/vocal_course_1785840777217.jpg';

export const SAMPLE_COMPREHENSIVE_EVENTS: ComprehensiveEvent[] = [
  {
    id: 'evt-2026-01',
    title: 'Annual Sacred Begena Recital & Heritage Concert',
    description: 'A grand celebration featuring 150+ student string players and master performers in Addis Ababa.',
    fullDescription: 'Join the Liora Begena School for our premier annual concert. Experience classical Ethiopian spiritual hymns performed live on ten-string Begena, six-string Krar, and Masenqo, accompanied by St. Yared Liturgical Choir.',
    coverImage: begenaPlayingImg,
    eventType: 'Concert',
    branchId: 'b-piazza',
    branchName: 'Piazza Headquarters',
    location: 'St. George Church Cultural Center Auditorium, Piazza, Addis Ababa',
    startDate: '2026-08-15',
    endDate: '2026-08-15',
    startTime: '02:00 PM',
    endTime: '06:30 PM',
    organizer: 'Deacon Bruk Tesfaye & Event Committee',
    maxCapacity: 400,
    registeredCount: 342,
    waitlistCount: 12,
    registrationRequired: true,
    visibility: 'Public',
    status: 'Upcoming',
    agenda: [
      { id: 'ag-1', time: '02:00 PM', activity: 'Opening Liturgical Prayer & Blessing', speakerOrPerformer: 'Abba Yohannes & Choir', location: 'Main Stage', durationMinutes: 20 },
      { id: 'ag-2', time: '02:20 PM', activity: 'Welcome Address & School Heritage Vision', speakerOrPerformer: 'Deacon Bruk Tesfaye', location: 'Main Stage', durationMinutes: 25 },
      { id: 'ag-3', time: '02:45 PM', activity: 'Begena Level 1 Ensemble Performance (12-String Harmonies)', speakerOrPerformer: 'Begena Beginner Graduates', location: 'Main Stage', durationMinutes: 35 },
      { id: 'ag-4', time: '03:20 PM', activity: 'Krar & Masenqo Dialogue Solo Showcase', speakerOrPerformer: 'Top Competition Medalists', location: 'Main Stage', durationMinutes: 40 },
      { id: 'ag-5', time: '04:00 PM', activity: 'Interval & Ethiopian Coffee & Heritage Exhibition', speakerOrPerformer: 'All Guests', location: 'Courtyard Exhibition Hall', durationMinutes: 30 },
      { id: 'ag-6', time: '04:30 PM', activity: 'Masterclass Solo Recital & St. Yared Hymnology', speakerOrPerformer: 'Master Liora Begena & Teachers', location: 'Main Stage', durationMinutes: 60 },
      { id: 'ag-7', time: '05:30 PM', activity: 'Certificate & Award Presentation Ceremony', speakerOrPerformer: 'School Admin & Guests of Honor', location: 'Main Stage', durationMinutes: 60 }
    ],
    performers: [
      { id: 'pf-1', order: 1, performerName: 'Liora Begena Ensemble', instrument: 'Begena (10-String)', songOrMezmurTitle: 'Nefse Wosibhat', durationMinutes: 15, notes: 'Opening solo harmonic' },
      { id: 'pf-2', order: 2, performerName: 'Piazza Youth Krar Band', instrument: 'Krar & Kebero', songOrMezmurTitle: 'Begena Yaredawi Melody', durationMinutes: 20, notes: 'Group ensemble' },
      { id: 'pf-3', order: 3, performerName: 'Dawit Solomon (Student Winner)', instrument: 'Begena', songOrMezmurTitle: 'Semayat Yenegrun', durationMinutes: 12, notes: 'Solo recital winner' },
      { id: 'pf-4', order: 4, performerName: 'Teacher Yared & Masenqo Trio', instrument: 'Masenqo', songOrMezmurTitle: 'Kene Zema Variations', durationMinutes: 18, notes: 'Faculty performance' }
    ],
    galleryImages: [
      begenatogetherPhoto,
      vocalImg,
      begenaImg
    ],
    budgetETB: 120000,
    actualExpensesETB: 85000,
    sponsorshipAmountETB: 50000,
    sponsors: [
      { name: 'CBE Birr Heritage Fund', tier: 'Gold Sponsor' },
      { name: 'Addis Culture & Arts Bureau', tier: 'Patron Sponsor' }
    ],
    feedbackList: [
      { userName: 'Tigist Haile', rating: 5, comment: 'An uplifting spiritual evening. The Begena ensemble touched everyone deeply.', date: '2026-07-10' }
    ]
  },
  {
    id: 'evt-2026-02',
    title: 'National Begena & Krar Youth Competition 2026',
    description: 'Competitive showcase judging technique, tuning accuracy, posture, and traditional hymn expression.',
    fullDescription: 'Students from Hawassa main Branch and our global online cohort compete in front of distinguished judges and traditional music scholars.',
    coverImage: krarImg,
    eventType: 'Competition',
    branchId: 'b-hawassa',
    branchName: 'Hawassa main Branch',
    location: 'Center Point Tower Hall, Hawassa & Online Stream',
    startDate: '2026-09-01',
    endDate: '2026-09-02',
    startTime: '09:00 AM',
    endTime: '05:00 PM',
    organizer: 'Competition Advisory Board',
    maxCapacity: 250,
    registeredCount: 180,
    waitlistCount: 0,
    registrationRequired: true,
    visibility: 'Public',
    status: 'Upcoming',
    agenda: [
      { id: 'ag-201', time: '09:00 AM', activity: 'Participant Orientation & Tuning Check', speakerOrPerformer: 'Technical Jury', location: 'Tuning Room A', durationMinutes: 60 },
      { id: 'ag-202', time: '10:00 AM', activity: 'Junior Begena Preliminary Round', speakerOrPerformer: 'Junior Performers', location: 'Main Hall', durationMinutes: 120 },
      { id: 'ag-203', time: '02:00 PM', activity: 'Advanced Krar & Masenqo Live Solos', speakerOrPerformer: 'Advanced Finalists', location: 'Main Hall', durationMinutes: 180 }
    ],
    performers: [],
    galleryImages: [krarImg]
  },
  {
    id: 'evt-2026-03',
    title: 'Class of 2026 Formal Graduation & Sacred Recital',
    description: 'Official diploma and certificate presentation for students completing Begena, Krar, and Vocal courses.',
    fullDescription: 'Celebrating 280 graduating students with formal signatures from Liora Begena, QR-verified digital certificates, and family celebrations.',
    coverImage: abelBegenaPhoto,
    eventType: 'Graduation',
    branchId: 'b-lebu',
    branchName: 'Lebu Annex',
    location: 'Liora Begena Lebu Cultural Amphitheater',
    startDate: '2026-09-20',
    endDate: '2026-09-20',
    startTime: '10:00 AM',
    endTime: '03:00 PM',
    organizer: 'Academic Board & Branch Management',
    maxCapacity: 500,
    registeredCount: 410,
    waitlistCount: 5,
    registrationRequired: true,
    visibility: 'Public',
    status: 'Upcoming',
    agenda: [
      { id: 'ag-301', time: '10:00 AM', activity: 'Academic Processional & Guest Check-In', speakerOrPerformer: 'Graduates & Faculty', location: 'Main Entrance', durationMinutes: 30 },
      { id: 'ag-302', time: '10:30 AM', activity: 'Graduation Keynote & Sacred Hymn', speakerOrPerformer: 'Deacon Bruk Tesfaye', location: 'Amphitheater', durationMinutes: 45 },
      { id: 'ag-303', time: '11:15 AM', activity: 'Awarding of Digital & Physical Certificates', speakerOrPerformer: 'Deans & Branch Managers', location: 'Amphitheater', durationMinutes: 90 }
    ],
    performers: [],
    galleryImages: [begenatogetherPhoto]
  },
  {
    id: 'evt-2026-04',
    title: 'Masterclass: Restoring Ancient Begena Gut Strings & Woodwork',
    description: 'Hands-on workshop taught by master instrument builders on tuning, bridge carving, and wood preservation.',
    fullDescription: 'Learn how traditional Ethiopian artisans select Wanza and Zigba timber, twist sheep/ox gut strings, and maintain resonance across seasonal humidity.',
    coverImage: washintImg,
    eventType: 'Music Workshop',
    branchId: 'b-piazza',
    branchName: 'Piazza Headquarters',
    location: 'Piazza Craft Workshop Lab 2',
    startDate: '2026-07-15',
    endDate: '2026-07-15',
    startTime: '09:00 AM',
    endTime: '01:00 PM',
    organizer: 'Master Craftsman Solomon & Liora Begena',
    maxCapacity: 30,
    registeredCount: 30,
    waitlistCount: 8,
    registrationRequired: true,
    visibility: 'Public',
    status: 'Completed',
    agenda: [],
    performers: [],
    galleryImages: [washintImg]
  }
];

export const SAMPLE_EVENT_TICKETS: EventRegistrationTicket[] = [
  {
    id: 'tkt-001',
    eventId: 'evt-2026-01',
    eventTitle: 'Annual Sacred Begena Recital & Heritage Concert',
    ticketNumber: 'ABS-TKT-2026-9021',
    participantName: 'Bereket Tadesse',
    participantPhone: '+251 911 234 567',
    participantEmail: 'bereket@gmail.com',
    participantRole: 'Student',
    studentId: 'STU-2026-001',
    branchName: 'Piazza Headquarters',
    courseName: 'Begena Mastery Level 1',
    qrCodeData: 'ABS-TKT-2026-9021|STU-2026-001|evt-2026-01',
    isCheckedIn: true,
    checkedInAt: '2026-08-15 01:45 PM',
    checkedInBy: 'Staff Selamawit',
    registeredAt: '2026-07-01',
    status: 'Checked In'
  },
  {
    id: 'tkt-002',
    eventId: 'evt-2026-01',
    eventTitle: 'Annual Sacred Begena Recital & Heritage Concert',
    ticketNumber: 'ABS-TKT-2026-9022',
    participantName: 'Makeda Solomon',
    participantPhone: '+251 922 888 777',
    participantEmail: 'makeda@gmail.com',
    participantRole: 'Parent',
    studentId: 'STU-2026-004',
    branchName: 'Megenagna Hub',
    qrCodeData: 'ABS-TKT-2026-9022|STU-2026-004|evt-2026-01',
    isCheckedIn: false,
    registeredAt: '2026-07-05',
    status: 'Registered'
  },
  {
    id: 'tkt-003',
    eventId: 'evt-2026-02',
    eventTitle: 'National Begena & Krar Youth Competition 2026',
    ticketNumber: 'ABS-TKT-2026-9023',
    participantName: 'Dawit Solomon',
    participantPhone: '+251 911 999 111',
    participantEmail: 'dawit.solomon@gmail.com',
    participantRole: 'Performer',
    studentId: 'STU-2026-002',
    branchName: 'Piazza Headquarters',
    courseName: 'Advanced Begena & St. Yared Hymns',
    qrCodeData: 'ABS-TKT-2026-9023|STU-2026-002|evt-2026-02',
    isCheckedIn: false,
    registeredAt: '2026-07-12',
    status: 'Registered'
  }
];

export const SAMPLE_COMPETITIONS: CompetitionItem[] = [
  {
    id: 'comp-2026-01',
    title: 'Liora Begena Youth Harp Championship 2026',
    description: 'Showcase your Begena pluck precision, steady rhythm, sacred hymn accuracy, and posture.',
    instrumentCategory: 'Begena',
    levelCategory: 'Open',
    ageGroup: 'Youth (15-24)',
    branchId: 'b-piazza',
    branchName: 'Piazza Headquarters',
    startDate: '2026-09-01',
    endDate: '2026-09-02',
    registrationDeadline: '2026-08-20',
    rules: [
      'Must perform a traditional St. Yared hymn on 10-string Begena.',
      'Performance duration must be between 3 to 6 minutes.',
      'Video submissions must have clear lighting and unedited live audio.'
    ],
    prizes: [
      '1st Place: Gold Trophy, Handcrafted Begena, 10,000 ETB Scholarship',
      '2nd Place: Silver Medal, Full Gut String Set, 5,000 ETB Scholarship',
      '3rd Place: Bronze Medal, Begena Tuning Accessory Kit'
    ],
    judges: [
      { id: 'jdg-1', name: 'Deacon Bruk Tesfaye', titleOrRole: 'Founder & Principal Master', expertise: 'Begena & Liturgical Music', avatar: ABEL_BEGENA_PHOTO },
      { id: 'jdg-2', name: 'Teacher Yared Teklu', titleOrRole: 'Senior Instructor', expertise: 'Kene & String Harmonies', avatar: '' }
    ],
    criteria: [
      { id: 'cr-1', name: 'Tuning & Intonation', maxScore: 25, weightPercent: 25, description: 'Accuracy of 10-string Pentatonic tuning.' },
      { id: 'cr-2', name: 'Plucking Technique & Rhythm', maxScore: 25, weightPercent: 25, description: 'Consistency of thumb/finger dynamics.' },
      { id: 'cr-3', name: 'Hymn Accuracy & Pronunciation', maxScore: 25, weightPercent: 25, description: 'Fidelity to St. Yared classical text.' },
      { id: 'cr-4', name: 'Stage Presence & Posture', maxScore: 25, weightPercent: 25, description: 'Reverence, posture, and traditional poise.' }
    ],
    status: 'Registration Open',
    coverImage: krarImg
  }
];

export const SAMPLE_COMPETITION_SUBMISSIONS: CompetitionSubmission[] = [
  {
    id: 'sub-001',
    competitionId: 'comp-2026-01',
    studentId: 'STU-2026-001',
    studentName: 'Bereket Tadesse',
    studentAvatar: '',
    branchName: 'Piazza Headquarters',
    instrument: 'Begena',
    level: 'Intermediate',
    teacherName: 'Deacon Bruk Tesfaye',
    performanceTitle: 'Semayat Yenegrun (The Heavens Declare)',
    videoUrl: 'https://www.youtube.com/watch?v=sample-video-1',
    description: 'Solo Begena recital performed on Wanza wood instrument tuned in Anchihoye scale.',
    submittedAt: '2026-07-15',
    status: 'Scored',
    scores: [
      {
        judgeId: 'jdg-1',
        judgeName: 'Deacon Bruk Tesfaye',
        scoresByCriterion: { 'cr-1': 24, 'cr-2': 23, 'cr-3': 25, 'cr-4': 24 },
        totalScore: 96,
        comments: 'Outstanding hand posture and deep spiritual reverence. Excellent resonance.'
      },
      {
        judgeId: 'jdg-2',
        judgeName: 'Teacher Yared Teklu',
        scoresByCriterion: { 'cr-1': 23, 'cr-2': 24, 'cr-3': 24, 'cr-4': 23 },
        totalScore: 94,
        comments: 'Rhythm is very steady. Fine execution on higher strings.'
      }
    ],
    finalScore: 95.0,
    rankPosition: 1,
    awardCategory: 'Winner'
  },
  {
    id: 'sub-002',
    competitionId: 'comp-2026-01',
    studentId: 'STU-2026-002',
    studentName: 'Dawit Solomon',
    studentAvatar: '',
    branchName: 'Megenagna Hub',
    instrument: 'Begena',
    level: 'Advanced',
    teacherName: 'Teacher Bethlehem',
    performanceTitle: 'Nefse Wosibhat (Spiritual Meditation)',
    videoUrl: 'https://www.youtube.com/watch?v=sample-video-2',
    description: 'Advanced 10-string polyphonic variation.',
    submittedAt: '2026-07-16',
    status: 'Scored',
    scores: [
      {
        judgeId: 'jdg-1',
        judgeName: 'Deacon Bruk Tesfaye',
        scoresByCriterion: { 'cr-1': 23, 'cr-2': 23, 'cr-3': 23, 'cr-4': 23 },
        totalScore: 92,
        comments: 'Very strong performance.'
      }
    ],
    finalScore: 92.0,
    rankPosition: 2,
    awardCategory: '1st Place'
  }
];

export const SAMPLE_ACHIEVEMENT_BADGES: AchievementBadge[] = [
  {
    id: 'badge-001',
    name: 'First Begena Chord',
    code: 'ACH-BEGENA-01',
    description: 'Successfully learned and tuned your first 10-string Begena pentatonic scale.',
    requirement: 'Complete Begena Module 1 and submit initial tuning check.',
    category: 'Learning',
    icon: 'Music',
    rarity: 'Common',
    points: 100
  },
  {
    id: 'badge-002',
    name: '30-Day Practice Devotion',
    code: 'ACH-STREAK-30',
    description: 'Logged 30 consecutive days of practice sessions in the Interactive Practice Studio.',
    requirement: 'Log at least 20 minutes daily for 30 consecutive days.',
    category: 'Practice',
    icon: 'Award',
    rarity: 'Rare',
    points: 500
  },
  {
    id: 'badge-003',
    name: 'Sacred Stage Performer',
    code: 'ACH-STAGE-01',
    description: 'Performed live in front of an audience during a school concert or recital.',
    requirement: 'Participate in at least 1 official school concert performance.',
    category: 'Performance',
    icon: 'Sparkles',
    rarity: 'Epic',
    points: 800
  },
  {
    id: 'badge-004',
    name: 'Competition Medalist',
    code: 'ACH-COMP-WIN',
    description: 'Won 1st, 2nd, or 3rd place in an official Liora Begena School music competition.',
    requirement: 'Place in top 3 in any official school competition.',
    category: 'Competition',
    icon: 'Trophy',
    rarity: 'Legendary',
    points: 1200
  },
  {
    id: 'badge-005',
    name: 'Perfect Attendance Honor',
    code: 'ACH-ATTEND-100',
    description: 'Achieved 100% class attendance across a full 3-month course semester.',
    requirement: 'Zero unexcused absences during active enrollment term.',
    category: 'Attendance',
    icon: 'CheckCircle2',
    rarity: 'Uncommon',
    points: 300
  }
];

export const SAMPLE_EARNED_BADGES: EarnedStudentBadge[] = [
  {
    id: 'eb-001',
    studentId: 'STU-2026-001',
    studentName: 'Bereket Tadesse',
    badgeId: 'badge-001',
    badgeName: 'First Begena Chord',
    category: 'Learning',
    rarity: 'Common',
    icon: 'Music',
    earnedDate: '2026-05-10',
    awardedBy: 'System Auto-Award'
  },
  {
    id: 'eb-002',
    studentId: 'STU-2026-001',
    studentName: 'Bereket Tadesse',
    badgeId: 'badge-002',
    badgeName: '30-Day Practice Devotion',
    category: 'Practice',
    rarity: 'Rare',
    icon: 'Award',
    earnedDate: '2026-06-20',
    awardedBy: 'System Auto-Award'
  },
  {
    id: 'eb-003',
    studentId: 'STU-2026-001',
    studentName: 'Bereket Tadesse',
    badgeId: 'badge-004',
    badgeName: 'Competition Medalist',
    category: 'Competition',
    rarity: 'Legendary',
    icon: 'Trophy',
    earnedDate: '2026-07-16',
    awardedBy: 'Admin Manual Award',
    awardReason: '1st Place Winner of Liora Begena Youth Harp Championship 2026'
  }
];

export const SAMPLE_STUDENT_RANKS: StudentRankProfile[] = [
  {
    studentId: 'STU-2026-001',
    studentName: 'Bereket Tadesse',
    avatar: '',
    branchName: 'Piazza Headquarters',
    currentRank: 'Advanced',
    totalPoints: 2400,
    badgesEarnedCount: 5,
    practiceHoursLogged: 84,
    performancesCompleted: 3,
    competitionsWon: 1,
    attendanceRatePercent: 100
  },
  {
    studentId: 'STU-2026-002',
    studentName: 'Dawit Solomon',
    avatar: '',
    branchName: 'Megenagna Hub',
    currentRank: 'Mastery Candidate',
    totalPoints: 3100,
    badgesEarnedCount: 7,
    practiceHoursLogged: 120,
    performancesCompleted: 5,
    competitionsWon: 2,
    attendanceRatePercent: 98
  }
];

export const SAMPLE_CERTIFICATES: CertificateRecord[] = [
  {
    id: 'cert-001',
    certificateNumber: 'ABS-CERT-2026-000123',
    studentId: 'STU-2026-001',
    studentName: 'Bereket Tadesse',
    studentPhone: '+251 911 234 567',
    courseId: 'c-begena-01',
    courseName: 'Begena Traditional Instrument Mastery - Level 1',
    instrument: 'Begena',
    level: 'Level 1 (Basic)',
    branchName: 'Piazza Headquarters',
    completionDate: '2026-06-30',
    issuedDate: '2026-07-01',
    issuedBy: 'Liora Begena Academic Board',
    authorizedSignature: 'Deacon Bruk Tesfaye',
    qrVerificationUrl: '/verify/certificate/ABS-CERT-2026-000123',
    status: 'Active',
    physicalStatus: 'Ready for Pickup'
  },
  {
    id: 'cert-002',
    certificateNumber: 'ABS-CERT-2026-000124',
    studentId: 'STU-2026-002',
    studentName: 'Dawit Solomon',
    studentPhone: '+251 911 999 111',
    courseId: 'c-krar-01',
    courseName: 'Traditional Krar & Melody - Level 2',
    instrument: 'Krar',
    level: 'Level 2 (Intermediate)',
    branchName: 'Megenagna Hub',
    completionDate: '2026-05-15',
    issuedDate: '2026-05-20',
    issuedBy: 'Liora Begena Academic Board',
    authorizedSignature: 'Deacon Bruk Tesfaye',
    qrVerificationUrl: '/verify/certificate/ABS-CERT-2026-000124',
    status: 'Active',
    physicalStatus: 'Collected'
  }
];

export const SAMPLE_GRADUATIONS: GraduationCeremony[] = [
  {
    id: 'grad-2026',
    title: 'Annual Liora Begena Class of 2026 Graduation & Sacred Recital',
    academicYear: '2025/2026 Academic Year',
    date: '2026-09-20',
    time: '10:00 AM',
    location: 'Liora Begena Hawassa Cultural Hall (Center Point Tower)',
    branchName: 'Hawassa main Branch',
    coverImage: abelBegenaPhoto,
    organizer: 'Deacon Bruk Tesfaye & Board of Deans',
    expectedGraduatesCount: 280,
    guestCapacity: 600,
    programAgenda: [
      { time: '10:00 AM', item: 'Liturgical Processional & Opening Anthem', presenter: 'St. Yared Choir' },
      { time: '10:30 AM', item: 'Founder Speech & Heritage Preservation Charge', presenter: 'Deacon Bruk Tesfaye' },
      { time: '11:15 AM', item: 'Presentation of Certificates & Honors', presenter: 'Branch Managers & Faculty' },
      { time: '01:00 PM', item: 'Graduation Solo & Ensemble Concert', presenter: 'Graduating Class' }
    ],
    awardsList: [
      { awardTitle: 'Valedictorian of the Sacred Harp', recipientName: 'Dawit Solomon', category: 'Academic & Musical Excellence' },
      { awardTitle: 'Community Devotion Award', recipientName: 'Bereket Tadesse', category: 'Community Leadership' }
    ],
    status: 'Upcoming'
  }
];

export const SAMPLE_GRADUATES: GraduateStudentItem[] = [
  {
    id: 'grad-stu-001',
    studentId: 'STU-2026-001',
    studentName: 'Bereket Tadesse',
    avatar: '',
    courseName: 'Begena Traditional Instrument Mastery - Level 1',
    instrument: 'Begena',
    level: 'Level 1',
    branchName: 'Piazza Headquarters',
    graduationYear: '2026',
    certificateNumber: 'ABS-CERT-2026-000123',
    eligibilityStatus: 'Eligible',
    invitationQrCode: 'INV-GRAD-2026-STU-001',
    checkedIn: false,
    honors: 'Cum Laude - 100% Attendance'
  },
  {
    id: 'grad-stu-002',
    studentId: 'STU-2026-002',
    studentName: 'Dawit Solomon',
    avatar: '',
    courseName: 'Traditional Krar & Melody - Level 2',
    instrument: 'Krar',
    level: 'Level 2',
    branchName: 'Megenagna Hub',
    graduationYear: '2026',
    certificateNumber: 'ABS-CERT-2026-000124',
    eligibilityStatus: 'Eligible',
    invitationQrCode: 'INV-GRAD-2026-STU-002',
    checkedIn: true,
    honors: 'Valedictorian - 1st Place Competition Winner'
  }
];

export const SAMPLE_ALUMNI: AlumniProfile[] = [
  {
    id: 'alm-001',
    studentId: 'STU-2025-088',
    fullName: 'Yonas Kebede',
    avatar: '',
    graduationYear: '2025',
    courseName: 'Begena Master Diploma',
    instrument: 'Begena',
    branchName: 'Piazza Headquarters',
    biography: 'Graduated in 2025. Performs sacred hymns at St. George Cathedral and mentors junior Begena students.',
    currentOccupation: 'Acoustics Specialist & Church Musician',
    musicalJourney: 'Began with 0 experience in 2024. Completed 12 months under Liora Begena.',
    featuredPerformanceUrl: 'https://www.youtube.com/watch?v=sample-alumni-1',
    socialLinks: { telegram: '@yonas_begena', youtube: 'https://youtube.com/yonasbegena' },
    isPublicConsent: true,
    isAvailableForMentorship: true
  },
  {
    id: 'alm-002',
    studentId: 'STU-2024-012',
    fullName: 'Sara Tesfaye',
    avatar: '',
    graduationYear: '2024',
    courseName: 'Krar & Traditional Vocal Studies',
    instrument: 'Krar & Vocals',
    branchName: 'Megenagna Hub',
    biography: 'Specializes in classical St. Yared hymnology and acoustic Krar fingerstyle.',
    currentOccupation: 'Music Educator & Choir Director',
    musicalJourney: 'Class of 2024 honor graduate.',
    featuredPerformanceUrl: 'https://www.youtube.com/watch?v=sample-alumni-2',
    socialLinks: { telegram: '@sara_krar' },
    isPublicConsent: true,
    isAvailableForMentorship: true
  }
];

export const SAMPLE_MENTORSHIPS: MentorshipPair[] = [
  {
    id: 'mnt-001',
    mentorId: 'alm-001',
    mentorName: 'Yonas Kebede (Alumni 2025)',
    mentorRole: 'Alumni',
    studentId: 'STU-2026-001',
    studentName: 'Bereket Tadesse',
    instrument: 'Begena',
    startDate: '2026-05-01',
    status: 'Active',
    focusArea: 'Advanced Pentatonic Tuning & Fast Finger Plucking'
  }
];

