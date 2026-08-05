import {
  LeadItem,
  InquiryItem,
  LeadActivity,
  FollowUpItem,
  CrmTaskItem,
  TrialSessionItem,
  CampaignItem,
  ReferralItem,
  PromoCodeItem,
  MarketingContentItem
} from '../../types';

export const SAMPLE_INQUIRIES: InquiryItem[] = [
  {
    id: 'INQ-2026-101',
    name: 'Kaleb Tadesse',
    phone: '+251911223344',
    email: 'kaleb.t@gmail.com',
    type: 'Course Inquiry',
    courseId: 'c-begena-mastery',
    courseName: 'Traditional Begena Sacred Harp',
    preferredBranch: 'Piazza Headquarters',
    preferredContactMethod: 'Telegram',
    message: 'I would like to learn Begena 10-string plucking and St. Yared hymn notation on weekends.',
    createdAt: '2026-07-20 10:30',
    status: 'New'
  },
  {
    id: 'INQ-2026-102',
    name: 'Hannah Worku',
    phone: '+251922334455',
    email: 'hannah.w@yahoo.com',
    type: 'Schedule Inquiry',
    courseId: 'c-krar-expressive',
    courseName: 'Krar Folk & Sacred Strings',
    preferredBranch: 'Bole Medhanealem Branch',
    preferredContactMethod: 'Phone',
    message: 'Are there evening online classes available for working adults?',
    createdAt: '2026-07-19 14:15',
    status: 'Assigned',
    assignedTo: 'STF-001',
    assignedToName: 'Saba Tesfaye'
  },
  {
    id: 'INQ-2026-103',
    name: 'Dr. Yared Assefa',
    phone: '+251933445566',
    email: 'yared.a@addisschool.et',
    type: 'Online Learning Inquiry',
    courseId: 'c-masenqo-bowing',
    courseName: 'Masenqo Master Class',
    preferredBranch: 'Global Online Campus',
    preferredContactMethod: 'Email',
    message: 'Inquiring about international time zone schedules for students in Frankfurt, Germany.',
    createdAt: '2026-07-18 09:00',
    status: 'Converted to Lead'
  }
];

export const SAMPLE_LEADS: LeadItem[] = [
  {
    id: 'LD-2026-001',
    fullName: 'Yonas Getachew',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    gender: 'Male',
    age: 26,
    phone: '+251911887766',
    email: 'yonas.get@gmail.com',
    telegramUsername: '@yonas_begena',
    address: 'Bole Subcity, Woreda 03, Addis Ababa',
    preferredBranch: 'Bole Medhanealem Branch',
    interestedCourse: 'Traditional Begena Sacred Harp',
    interestedInstrument: 'Begena',
    interestedLevel: 'Beginner',
    preferredLearningMode: 'In-Person',
    preferredSchedule: 'Weekend (Sat/Sun 10:00 AM)',
    source: 'TikTok',
    notes: 'Very enthusiastic about 10-string tuning. Attended live Begena recital event last month.',
    assignedStaffId: 'STF-001',
    assignedStaffName: 'Saba Tesfaye',
    status: 'Qualified',
    createdAt: '2026-07-15',
    lastContact: '2026-07-20',
    nextFollowUp: '2026-07-22',
    score: 85,
    scoreBreakdown: [
      { reason: 'TikTok Campaign Click', points: 15 },
      { reason: 'Submitted Course Inquiry', points: 20 },
      { reason: 'Requested Introductory Trial Session', points: 25 },
      { reason: 'Verified Phone & Telegram', points: 25 }
    ],
    prospectStage: 'Trial / Consultation'
  },
  {
    id: 'LD-2026-002',
    fullName: 'Ruth Teklu',
    photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    gender: 'Female',
    age: 22,
    phone: '+251922110099',
    email: 'ruth.teklu@outlook.com',
    telegramUsername: '@ruth_t',
    address: 'Piazza, Addis Ababa',
    preferredBranch: 'Piazza Headquarters',
    interestedCourse: 'Krar Folk & Sacred Strings',
    interestedInstrument: 'Krar',
    interestedLevel: 'Intermediate',
    preferredLearningMode: 'In-Person',
    preferredSchedule: '3 Days per Week (Mon/Wed/Fri 4:00 PM)',
    source: 'Instagram',
    notes: 'Wants to improve rapid plucking speed and ornamentations for church choir accompaniment.',
    assignedStaffId: 'STF-002',
    assignedStaffName: 'Dawit Solomon',
    status: 'Trial Requested',
    createdAt: '2026-07-16',
    lastContact: '2026-07-21',
    nextFollowUp: '2026-07-23',
    score: 70,
    scoreBreakdown: [
      { reason: 'Instagram Reel Click', points: 15 },
      { reason: 'Course Page View x4', points: 15 },
      { reason: 'Trial Requested', points: 25 },
      { reason: 'Phone Verified', points: 15 }
    ],
    prospectStage: 'Interested'
  },
  {
    id: 'LD-2026-003',
    fullName: 'Mekdes Zewdu',
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    gender: 'Female',
    age: 31,
    phone: '+251944556677',
    email: 'mekdes.z@gmail.com',
    telegramUsername: '@mekdes_z',
    address: 'CMC Altad, Addis Ababa',
    preferredBranch: 'CMC Altad Branch',
    interestedCourse: 'Traditional Begena Sacred Harp',
    interestedInstrument: 'Begena',
    interestedLevel: 'Beginner',
    preferredLearningMode: 'Hybrid',
    preferredSchedule: '2 Days per Week (Tue/Thu 5:30 PM)',
    source: 'Website',
    notes: 'Parent looking to enroll her 12-year-old son alongside herself in a dual family package.',
    assignedStaffId: 'STF-001',
    assignedStaffName: 'Saba Tesfaye',
    status: 'Registration Started',
    createdAt: '2026-07-10',
    lastContact: '2026-07-19',
    nextFollowUp: '2026-07-22',
    score: 95,
    scoreBreakdown: [
      { reason: 'Direct Website Search', points: 20 },
      { reason: 'Dual Student Registration', points: 30 },
      { reason: 'Submitted Proof of Identification', points: 25 },
      { reason: 'Selected Class Schedule', points: 20 }
    ],
    prospectStage: 'Registration Started'
  },
  {
    id: 'LD-2026-004',
    fullName: 'Elias Haile',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    gender: 'Male',
    age: 28,
    phone: '+251955667788',
    email: 'elias.h@gmail.com',
    telegramUsername: '@elias_h',
    address: 'Sarbet, Addis Ababa',
    preferredBranch: 'Global Online Campus',
    interestedCourse: 'Masenqo Master Class',
    interestedInstrument: 'Masenqo',
    interestedLevel: 'Beginner',
    preferredLearningMode: 'Online',
    preferredSchedule: 'Flexible Evening',
    source: 'Referral',
    notes: 'Referred by active student Samuel Alemayehu. Interested in acoustic horsehair bowing.',
    assignedStaffId: 'STF-003',
    assignedStaffName: 'Tigist Kebede',
    status: 'Payment Pending',
    createdAt: '2026-07-08',
    lastContact: '2026-07-21',
    nextFollowUp: '2026-07-22',
    score: 90,
    scoreBreakdown: [
      { reason: 'Verified Student Referral', points: 30 },
      { reason: 'Completed Trial Session', points: 30 },
      { reason: 'Registration Forms Submitted', points: 30 }
    ],
    prospectStage: 'Payment Pending'
  }
];

export const SAMPLE_LEAD_ACTIVITIES: LeadActivity[] = [
  {
    id: 'ACT-001',
    leadId: 'LD-2026-001',
    timestamp: '2026-07-15 09:12',
    title: 'Lead Created from TikTok Ad',
    type: 'Created',
    description: 'Submitted TikTok form requesting info for Begena 10-string beginner course.',
    performedBy: 'System Automation'
  },
  {
    id: 'ACT-002',
    leadId: 'LD-2026-001',
    timestamp: '2026-07-16 11:30',
    title: 'Outgoing Phone Call',
    type: 'Call',
    description: 'Saba Tesfaye called lead. Lead confirmed strong interest and requested weekend schedule.',
    performedBy: 'Saba Tesfaye'
  },
  {
    id: 'ACT-003',
    leadId: 'LD-2026-001',
    timestamp: '2026-07-18 14:00',
    title: 'Trial Session Scheduled',
    type: 'TrialScheduled',
    description: 'Scheduled for Saturday July 25 at 10:00 AM at Bole Medhanealem Branch.',
    performedBy: 'Saba Tesfaye'
  },
  {
    id: 'ACT-004',
    leadId: 'LD-2026-001',
    timestamp: '2026-07-20 16:45',
    title: 'Telegram Brochure Sent',
    type: 'Message',
    description: 'Sent PDF curriculum and video preview link to @yonas_begena.',
    performedBy: 'Saba Tesfaye'
  }
];

export const SAMPLE_FOLLOW_UPS: FollowUpItem[] = [
  {
    id: 'FLP-001',
    leadId: 'LD-2026-001',
    leadName: 'Yonas Getachew',
    leadPhone: '+251911887766',
    date: '2026-07-22',
    time: '10:00 AM',
    method: 'Phone',
    notes: 'Confirm arrival for Saturday trial session and instrument reservation.',
    assignedTo: 'STF-001',
    assignedToName: 'Saba Tesfaye',
    status: 'Pending',
    reminderTiming: '1 Day Before'
  },
  {
    id: 'FLP-002',
    leadId: 'LD-2026-002',
    leadName: 'Ruth Teklu',
    leadPhone: '+251922110099',
    date: '2026-07-23',
    time: '02:30 PM',
    method: 'Telegram',
    notes: 'Send Krar class schedule options and introduce teacher profile for Dawit Solomon.',
    assignedTo: 'STF-002',
    assignedToName: 'Dawit Solomon',
    status: 'Pending',
    reminderTiming: '1 Hour Before'
  },
  {
    id: 'FLP-003',
    leadId: 'LD-2026-004',
    leadName: 'Elias Haile',
    leadPhone: '+251955667788',
    date: '2026-07-22',
    time: '11:15 AM',
    method: 'Phone',
    notes: 'Follow up on pending telebirr payment slip submission for Masenqo course.',
    assignedTo: 'STF-003',
    assignedToName: 'Tigist Kebede',
    status: 'Pending',
    reminderTiming: '1 Hour Before'
  }
];

export const SAMPLE_CRM_TASKS: CrmTaskItem[] = [
  {
    id: 'TSK-101',
    title: 'Confirm Telebirr receipt for Elias Haile',
    leadId: 'LD-2026-004',
    leadName: 'Elias Haile',
    assignedTo: 'STF-003',
    assignedToName: 'Tigist Kebede',
    priority: 'High',
    dueDate: '2026-07-22',
    status: 'In Progress',
    type: 'Confirm Payment'
  },
  {
    id: 'TSK-102',
    title: 'Send Begena curriculum overview to Yonas',
    leadId: 'LD-2026-001',
    leadName: 'Yonas Getachew',
    assignedTo: 'STF-001',
    assignedToName: 'Saba Tesfaye',
    priority: 'Medium',
    dueDate: '2026-07-22',
    status: 'To Do',
    type: 'Send Course Details'
  },
  {
    id: 'TSK-103',
    title: 'Prepare instrument tuning for Saturday trial session',
    assignedTo: 'STF-002',
    assignedToName: 'Dawit Solomon',
    priority: 'High',
    dueDate: '2026-07-24',
    status: 'To Do',
    type: 'Invite to Trial'
  }
];

export const SAMPLE_TRIAL_SESSIONS: TrialSessionItem[] = [
  {
    id: 'TRL-001',
    leadId: 'LD-2026-001',
    leadName: 'Yonas Getachew',
    phone: '+251911887766',
    instrument: 'Begena',
    preferredBranch: 'Bole Medhanealem Branch',
    preferredDate: '2026-07-25',
    preferredTime: '10:00 AM',
    status: 'Approved',
    outcome: 'Interested',
    notes: '1-on-1 30 minute introduction with Master Teacher Teacher Melaku.'
  },
  {
    id: 'TRL-002',
    leadId: 'LD-2026-002',
    leadName: 'Ruth Teklu',
    phone: '+251922110099',
    instrument: 'Krar',
    preferredBranch: 'Piazza Headquarters',
    preferredDate: '2026-07-26',
    preferredTime: '02:00 PM',
    status: 'Requested',
    notes: 'Wants to test 6-string acoustic Krar sound quality.'
  }
];

export const SAMPLE_CAMPAIGNS: CampaignItem[] = [
  {
    id: 'CMP-2026-01',
    name: 'Summer Begena Heritage Masterclass 2026',
    description: 'Spiritual and traditional Begena 10-string immersive summer course for youth and adults.',
    objective: 'Drive 150 new student enrollments across Addis Ababa branches and global online campus.',
    type: 'Enrollment Campaign',
    startDate: '2026-06-15',
    endDate: '2026-08-31',
    targetAudience: 'Visitors',
    branchName: 'All Branches & Online',
    courseName: 'Traditional Begena Sacred Harp',
    channels: ['Website', 'Telegram', 'TikTok', 'Instagram', 'Physical Promotion'],
    status: 'Active',
    trackingCode: 'SUMMER-BEGENA-2026',
    landingPageUrl: '/campaigns/begena-summer-2026',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=SUMMER-BEGENA-2026',
    metrics: {
      views: 14200,
      clicks: 3850,
      inquiries: 420,
      leads: 280,
      registrations: 145,
      payments: 120,
      enrollments: 118,
      conversions: 81.3
    }
  },
  {
    id: 'CMP-2026-02',
    name: 'Global Diaspora Online Krar & Washint Wave',
    description: 'Targeting Ethiopian diaspora in North America and Europe for live interactive weekend sessions.',
    objective: 'Expand online student community by 80 active participants.',
    type: 'Course Campaign',
    startDate: '2026-07-01',
    endDate: '2026-09-15',
    targetAudience: 'Prospects',
    branchName: 'Global Online Campus',
    courseName: 'Krar Folk & Sacred Strings',
    channels: ['Website', 'Telegram', 'Facebook', 'YouTube'],
    status: 'Active',
    trackingCode: 'DIASPORA-KRAR-2026',
    landingPageUrl: '/campaigns/diaspora-krar-2026',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=DIASPORA-KRAR-2026',
    metrics: {
      views: 8900,
      clicks: 2100,
      inquiries: 190,
      leads: 130,
      registrations: 65,
      payments: 58,
      enrollments: 58,
      conversions: 89.2
    }
  }
];

export const SAMPLE_REFERRALS: ReferralItem[] = [
  {
    id: 'REF-001',
    referrerStudentId: 'STU-2026-001',
    referrerName: 'Bereket Tadesse',
    referredPersonName: 'Elias Haile',
    referredPersonPhone: '+251955667788',
    referredPersonEmail: 'elias.h@gmail.com',
    referralCode: 'BEREKET-BEGENA-2026',
    createdAt: '2026-07-08',
    status: 'Enrolled',
    rewardType: 'Badge'
  },
  {
    id: 'REF-002',
    referrerStudentId: 'STU-2026-002',
    referrerName: 'Aster Gebremedhin',
    referredPersonName: 'Selamawit Yilma',
    referredPersonPhone: '+251911998877',
    referredPersonEmail: 'selam.y@gmail.com',
    referralCode: 'ASTER-HERITAGE-2026',
    createdAt: '2026-07-18',
    status: 'Registered',
    rewardType: 'Recognition'
  }
];

export const SAMPLE_PROMO_CODES: PromoCodeItem[] = [
  {
    id: 'PRM-001',
    code: 'BEGENA10',
    description: '10% discount on registration fee for early summer Begena enrollments',
    startDate: '2026-06-01',
    endDate: '2026-08-15',
    usageLimit: 100,
    timesUsed: 42,
    courseName: 'Traditional Begena Sacred Harp',
    branchName: 'All Branches',
    discountType: 'Percentage',
    discountAmount: 10,
    status: 'Active'
  },
  {
    id: 'PRM-002',
    code: 'FAMILY500',
    description: '500 ETB flat discount when registering two or more family members together',
    startDate: '2026-07-01',
    endDate: '2026-12-31',
    usageLimit: 50,
    timesUsed: 18,
    courseName: 'All Traditional Courses',
    branchName: 'All Branches',
    discountType: 'Fixed Amount ETB',
    discountAmount: 500,
    status: 'Active'
  }
];

export const SAMPLE_MARKETING_CONTENT: MarketingContentItem[] = [
  {
    id: 'MKT-001',
    title: 'Master Teacher Melaku Demonstrates 10-String St. Yared Tuning',
    category: 'Teacher Feature',
    imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80',
    publishedAt: '2026-07-10',
    isFeatured: true,
    targetBranch: 'All Branches',
    summary: 'Discover the ancient mathematical resonance of the 10 wooden pegs and buzz bridges in authentic Begena music.'
  },
  {
    id: 'MKT-002',
    title: 'From First Pluck to Church Choir Soloist: Yonas Journey',
    category: 'Success Story',
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80',
    publishedAt: '2026-07-14',
    isFeatured: true,
    targetBranch: 'Piazza Headquarters',
    summary: 'Read how a 6-month intensive Begena course empowered Yonas to play sacred hymns during Meskel festival.'
  }
];

