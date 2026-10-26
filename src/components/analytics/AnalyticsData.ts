import {
  StudentSkillProgressItem,
  AtRiskStudentSignal,
  AIInsightItem,
  StrategicRecommendation,
  OperationalAlertItem,
  ReportConfig,
  GeneratedReportRecord
} from '../../types';

// SAMPLE SKILL PROGRESS FOR BEGENA & INSTRUMENTS
export const SAMPLE_STUDENT_SKILLS: StudentSkillProgressItem[] = [
  {
    id: 'sk-1',
    skillName: 'Begena Sacred History & Spiritual Foundations',
    courseName: 'Begena Level 1',
    category: 'History',
    status: 'Mastered',
    confirmedByTeacher: true,
    teacherName: 'Teacher Yared Tesfaye',
    lastPracticedDate: '2026-07-18'
  },
  {
    id: 'sk-2',
    skillName: 'Standard Begena 10-String Tuning (Mesenko & Gut Adjustments)',
    courseName: 'Begena Level 1',
    category: 'Tuning',
    status: 'Mastered',
    confirmedByTeacher: true,
    teacherName: 'Teacher Yared Tesfaye',
    lastPracticedDate: '2026-07-19'
  },
  {
    id: 'sk-3',
    skillName: 'Ergonomically Sound Posture & Left Hand Finger Placement',
    courseName: 'Begena Level 1',
    category: 'Hand Position',
    status: 'Developing',
    confirmedByTeacher: true,
    teacherName: 'Teacher Yared Tesfaye',
    lastPracticedDate: '2026-07-20'
  },
  {
    id: 'sk-4',
    skillName: 'Basic Notes & Buzzing String Harmonics (BZZ Sound Control)',
    courseName: 'Begena Level 1',
    category: 'Basic Notes',
    status: 'Practicing',
    confirmedByTeacher: false,
    teacherName: 'Teacher Yared Tesfaye',
    lastPracticedDate: '2026-07-21'
  },
  {
    id: 'sk-5',
    skillName: 'Classic Mezmur: "Kibre Kidehan"',
    courseName: 'Begena Level 1',
    category: 'Mezmur',
    status: 'Learning',
    confirmedByTeacher: false,
    teacherName: 'Teacher Yared Tesfaye',
    lastPracticedDate: '2026-07-15'
  },
  {
    id: 'sk-6',
    skillName: 'Advanced Rapid Plucking Patterns & Dynamic Muting',
    courseName: 'Begena Level 2',
    category: 'Advanced Techniques',
    status: 'Not Started',
    confirmedByTeacher: false
  }
];

// SAMPLE AT-RISK STUDENT SIGNALS
export const SAMPLE_AT_RISK_SIGNALS: AtRiskStudentSignal[] = [];

// OPERATIONAL ALERTS FOR FOUNDER / ADMIN
export const SAMPLE_OPERATIONAL_ALERTS: OperationalAlertItem[] = [
  {
    id: 'alt-1',
    type: 'Critical',
    title: 'Hawassa Campus Begena Gut String Low Stock',
    description: 'Ox gut string 0.8mm stock at Hawassa Campus has dropped to 3 units (threshold: 10 units). High weekend demand expected.',
    affectedBranch: 'Hawassa Campus',
    timestamp: '2026-07-21 09:30',
    actionRequired: 'Approve Purchase Order #PO-9912 to supplier Addis Artisans.'
  },
  {
    id: 'alt-2',
    type: 'Warning',
    title: 'Megenagna Room 2 Weekend Classroom Capacity 95%',
    description: 'Saturday 10:00 AM Begena class has 19 students enrolled for a 20-seat room limit.',
    affectedBranch: 'Megenagna Campus',
    timestamp: '2026-07-20 14:15',
    actionRequired: 'Open an additional Saturday 2:00 PM section or allocate Room 4.'
  },
  {
    id: 'alt-3',
    type: 'Important',
    title: 'Outstanding Course Fee Follow-ups',
    description: '42 active students have payments overdue by 10+ days totaling 84,000 ETB at Hawassa campus & online.',
    affectedBranch: 'All Campuses',
    timestamp: '2026-07-21 08:00',
    actionRequired: 'Accountant team to trigger automated Telebirr SMS reminder notifications.'
  },
  {
    id: 'alt-4',
    type: 'Informational',
    title: 'July Student Enrollment Surpass (+14% Target)',
    description: 'Total active student enrollments reached 1,280 across Hawassa campus and online cohorts.',
    affectedBranch: 'All Campuses',
    timestamp: '2026-07-19 18:00'
  }
];

// AI INSIGHTS & INTERPRETATIONS
export const SAMPLE_AI_INSIGHTS: AIInsightItem[] = [
  {
    id: 'ins-1',
    category: 'Student Growth & Enrollment',
    text: 'Student enrollment increased by 14.2% between June and July 2026, driven primarily by online Begena courses and Hawassa weekend batches.',
    badge: 'Verified Data',
    confidenceLevel: '99% Data Match',
    supportingData: 'June 2026: 1,120 active students → July 2026: 1,280 active students (+160 students).',
    dateGenerated: '2026-07-21',
    source: 'School Enrollment Database & CBE Payment Logs',
    recommendedAction: 'Expand server bandwidth for online video streams during peak Sunday hours.'
  },
  {
    id: 'ins-2',
    category: 'Attendance & Practice Behavior',
    text: 'Students who log at least 45 minutes of weekly practice in the Digital Practice Studio show an 82% higher course completion rate and 30% fewer missed classes.',
    badge: 'Calculated Metric',
    confidenceLevel: '92% Statistical Correlation',
    supportingData: 'Sample size: 840 active practice app users over 6 months.',
    dateGenerated: '2026-07-20',
    source: 'Practice Studio Telemetry & LMS Class Attendance Database',
    recommendedAction: 'Incentivize daily practice streaks with Mezmur achievement badges.'
  },
  {
    id: 'ins-3',
    category: 'Capacity & Teacher Demand Forecast',
    text: 'Projected Q3 enrollment growth suggests Hawassa campus will reach 98% room capacity by September 2026 if 2 new teachers are not onboarded.',
    badge: 'Forecast',
    confidenceLevel: '85% Predictive Confidence',
    supportingData: 'Historical 3-year growth model + current waiting list of 65 applicants.',
    dateGenerated: '2026-07-21',
    source: 'Predictive Analytics Engine & HR Recruitment Pipeline',
    recommendedAction: 'Initiate recruitment for 1 Begena and 1 Krar instructor for Hawassa campus.'
  },
  {
    id: 'ins-4',
    category: 'Commercial Store & Inventory',
    text: 'Store sales of authentic hand-crafted Begena instruments generated 245,000 ETB in July, accounting for 32% of total school monthly revenue.',
    badge: 'Verified Data',
    confidenceLevel: '100% Financial Reconciliation',
    supportingData: 'Store orders log: 35 Begena instruments sold @ 7,000 ETB average.',
    dateGenerated: '2026-07-21',
    source: 'Phase 13 Store Order Database & Accountant General Ledger'
  }
];

// STRATEGIC RECOMMENDATIONS FOR FOUNDER
export const SAMPLE_STRATEGIC_RECOMMENDATIONS: StrategicRecommendation[] = [
  {
    id: 'rec-101',
    title: 'Open Additional Begena Level 1 Weekend Batch at Hawassa Campus',
    recommendationText: 'Schedule a Saturday 2:00 PM - 4:00 PM Begena Level 1 batch in Hawassa Room 3.',
    reason: 'Hawassa morning classes are operating at 100% capacity with 28 students on the waitlist.',
    supportingData: 'Hawassa Campus Begena demand: 120 enrolled, 28 waitlisted. Projected monthly revenue gain: +42,000 ETB.',
    confidenceScore: 94,
    requiresHumanApproval: true,
    status: 'Pending Review',
    suggestedBy: 'AI School Growth Engine'
  },
  {
    id: 'rec-102',
    title: 'Bulk Order Ox Gut Strings (0.8mm & 1.0mm) from Master Artisan Workroom',
    recommendationText: 'Place purchase order for 200 string sets at 15% volume discount.',
    reason: 'Hawassa branch inventory is projected to deplete within 12 days based on current student sales velocity.',
    supportingData: 'Current stock: 18 sets. Daily consumption rate: 1.5 sets/day at Hawassa campus.',
    confidenceScore: 91,
    requiresHumanApproval: true,
    status: 'Pending Review',
    suggestedBy: 'Inventory Optimization Model'
  }
];

// REPORT CONFIG TEMPLATES & HISTORY
export const SAMPLE_REPORT_CONFIGS: ReportConfig[] = [
  {
    id: 'rep-cfg-1',
    title: 'Monthly Financial & Revenue Statement',
    dataSource: 'Financial',
    metrics: ['Gross Revenue', 'Tuition Fees', 'Registration Fees', 'Store Revenue', 'Refunds', 'Net Operating Margin'],
    dimensions: ['Branch', 'Payment Method', 'Month'],
    filters: { year: 2026 },
    dateRange: 'This Month',
    branchFilter: 'All Campuses',
    visualization: 'Table',
    exportFormat: 'PDF',
    scheduledFrequency: 'Monthly',
    recipients: ['Founder Liora Begena', 'Lead Accountant'],
    createdBy: 'Chief Accountant',
    createdAt: '2026-07-01'
  },
  {
    id: 'rep-cfg-2',
    title: 'School-Wide Student Attendance & Risk Audit',
    dataSource: 'Attendance',
    metrics: ['Total Classes', 'Attendance Rate %', 'Absence Count', 'At-Risk Students'],
    dimensions: ['Course', 'Branch', 'Teacher'],
    filters: { riskLevel: 'High' },
    dateRange: 'This Month',
    branchFilter: 'All Campuses',
    visualization: 'Bar Chart',
    exportFormat: 'Excel',
    scheduledFrequency: 'Weekly',
    recipients: ['Founder Liora Begena', 'Branch Managers'],
    createdBy: 'System Administrator',
    createdAt: '2026-07-05'
  }
];

export const SAMPLE_REPORT_HISTORY: GeneratedReportRecord[] = [
  {
    id: 'rh-1001',
    reportTitle: 'Q2 2026 Comprehensive School Performance Audit',
    generatedBy: 'Founder Liora Begena',
    generatedRole: 'Founder',
    generatedDate: '2026-07-01 10:15',
    reportType: 'Executive Summary',
    status: 'Completed',
    downloadUrl: '#',
    dataPeriod: '2026-04-01 to 2026-06-30',
    filtersApplied: 'All Campuses • All Courses',
    recordsCount: 1280
  },
  {
    id: 'rh-1002',
    reportTitle: 'June 2026 Store & Instrument Sales Reconciliation',
    generatedBy: 'Accountant Mariam Bekele',
    generatedRole: 'Accountant',
    generatedDate: '2026-07-02 16:40',
    reportType: 'Store Sales',
    status: 'Completed',
    downloadUrl: '#',
    dataPeriod: '2026-06-01 to 2026-06-30',
    filtersApplied: 'Paid Orders • Telebirr & CBE',
    recordsCount: 142
  },
  {
    id: 'rh-1003',
    reportTitle: 'Megenagna Campus Student Attendance & Dropout Analysis',
    generatedBy: 'Manager Henok Girma',
    generatedRole: 'Branch Manager',
    generatedDate: '2026-07-15 11:20',
    reportType: 'Attendance Audit',
    status: 'Completed',
    downloadUrl: '#',
    dataPeriod: '2026-06-15 to 2026-07-15',
    filtersApplied: 'Megenagna Campus Only',
    recordsCount: 380
  }
];

// NATURAL LANGUAGE QA DICTIONARY FOR FOUNDER AI ASSISTANT
export interface QAItem {
  keywords: string[];
  answer: string;
  metrics: { label: string; value: string }[];
  timePeriod: string;
  source: string;
  details: string;
}

export const FOUNDER_QA_DATABASE: QAItem[] = [
  {
    keywords: ['active', 'students', 'how many', 'total students', 'count'],
    answer: 'Liora Begena School currently has 1,280 total active students across the Hawassa main Branch and the global online platform.',
    metrics: [
      { label: 'Hawassa Main Branch', value: '1,100 Students (86%)' },
      { label: 'Online Global LMS', value: '180 Students (14%)' }
    ],
    timePeriod: 'Current Active Term (July 2026)',
    source: 'Central Student Registry Database & Class Attendance System',
    details: 'Student count grew by +14.2% MoM compared to June 2026 (1,120 active students).'
  },
  {
    keywords: ['branch grew', 'fastest growth', 'highest growth', 'grew the most', 'campus growth'],
    answer: 'Hawassa Main Branch experienced strong student growth this month, expanding by +18.5% year-to-date.',
    metrics: [
      { label: 'Hawassa Main Branch', value: '+18.5% MoM' },
      { label: 'Online Global Cohort', value: '+14.2% MoM' }
    ],
    timePeriod: 'June 2026 vs July 2026',
    source: 'Branch Enrollment Comparison System',
    details: 'The surge is attributed to new weekend Begena introductory classes at Center Point Tower.'
  },
  {
    keywords: ['course', 'popular', 'highest enrollment', 'enrolled course', 'most students'],
    answer: 'Begena Level 1 is our highest enrolled course, accounting for 48% of total student enrollments across all branches.',
    metrics: [
      { label: 'Begena Level 1', value: '614 Enrolled' },
      { label: 'Krar Intermediate', value: '280 Enrolled' },
      { label: 'Masenqo Fundamentals', value: '192 Enrolled' },
      { label: 'Washint & Kebero', value: '194 Enrolled' }
    ],
    timePeriod: '2026 Academic Term',
    source: 'Course Registration & LMS Enrollment Ledger',
    details: 'Begena Level 1 completion rate is 88%, with 94% student satisfaction rating.'
  },
  {
    keywords: ['attendance', 'trending', 'attendance rate', 'absences'],
    answer: 'Overall student attendance is strong at 91.4% school-wide, up 2.1% from last month.',
    metrics: [
      { label: 'Hawassa Attendance', value: '93.2%' },
      { label: 'Online Live Classes', value: '88.5%' }
    ],
    timePeriod: 'July 2026 (Last 30 Days)',
    source: 'Teacher Attendance Roll Call Database',
    details: 'Attendance trends upward when students log practice hours in the practice studio.'
  },
  {
    keywords: ['revenue', 'store', 'sales', 'money', 'financial', 'how much'],
    answer: 'The online store generated 245,000 ETB in sales this month, while total school revenue reached 820,000 ETB.',
    metrics: [
      { label: 'Course Tuition Revenue', value: '480,000 ETB (58.5%)' },
      { label: 'Store & Products', value: '245,000 ETB (29.9%)' },
      { label: 'Registration Fees', value: '95,000 ETB (11.6%)' }
    ],
    timePeriod: 'July 1 - July 21, 2026',
    source: 'Accountant General Ledger & Phase 13 Store Sales Ledger',
    details: 'CBE Bank Transfer remains the top payment method (52%), followed by Telebirr (38%).'
  },
  {
    keywords: ['teachers', 'need teachers', 'teacher capacity', 'overload', 'workload'],
    answer: 'Hawassa Campus is adding 1 additional Begena teacher due to 95% room/class capacity on weekends.',
    metrics: [
      { label: 'Hawassa Campus Teacher Hours', value: '34 hrs/week (Optimal)' },
      { label: 'Online Teacher Hours', value: '28 hrs/week (Available Capacity)' }
    ],
    timePeriod: 'Current Staffing Model (July 2026)',
    source: 'Teacher Roster & Class Schedule Analytics',
    details: 'Online hybrid sessions have available capacity to absorb additional students.'
  }
];

