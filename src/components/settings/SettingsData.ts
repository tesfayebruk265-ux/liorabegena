export interface SchoolProfile {
  name: string;
  logo: string;
  favicon: string;
  officialDescription: string;
  phone: string;
  email: string;
  website: string;
  telegram: string;
  facebook: string;
  youtube: string;
  instagram?: string;
  tiktok?: string;
  address: string;
  googleMapsLocation: string;
  workingHours: string;
  foundedDate: string;
  founderInfo: string;
  mission: string;
  vision: string;
  values: string[];
}

export interface BranchItem {
  id: string;
  name: string;
  code: string;
  address: string;
  phone: string;
  manager: string;
  openingHours: string;
  availableCourses: string[];
  availableTeachers: number;
  classrooms: number;
  capacity: number;
  status: 'Active' | 'Temporarily Closed' | 'Under Maintenance' | 'Inactive' | 'Archived';
}

export interface CoursePricingConfig {
  id: string;
  courseName: string;
  instrument: string;
  level: string;
  monthlyFee: number;
  threeMonthOption: number;
  fourMonthOption: number;
  sixMonthOption: number;
  nineMonthOption?: number;
  registrationFee: number;
  onlinePricing: number;
  inPersonPricing: number;
  discountsAllowed: boolean;
}

export interface UserAccountItem {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: 'Visitor' | 'Student' | 'Parent' | 'Teacher' | 'Registration Staff' | 'Branch Manager' | 'Accountant' | 'Admin' | 'Super Admin' | 'Founder';
  branchScope: 'All Branches' | 'Hawassa Main Branch' | 'Online Campus';
  status: 'Active' | 'Pending' | 'Suspended' | 'Deactivated' | 'Archived';
  mfaEnabled: boolean;
  lastLogin: string;
  ipAddress: string;
}

export interface RolePermissionConfig {
  roleName: string;
  description: string;
  isCustom: boolean;
  permissions: {
    resource: string;
    view: boolean;
    create: boolean;
    edit: boolean;
    delete: boolean;
    approve: boolean;
    export: boolean;
    manage: boolean;
  }[];
}

export interface IntegrationStatus {
  id: string;
  name: string;
  category: 'Communication' | 'Payment' | 'Video' | 'Storage' | 'AI';
  status: 'Connected' | 'Disconnected' | 'Error';
  lastSync: string;
  apiKeyMasked: string;
  webhookConfigured: boolean;
}

export interface BackupRecord {
  id: string;
  filename: string;
  type: 'Full Backup' | 'Database Backup' | 'File Backup' | 'Config Backup';
  sizeMB: number;
  createdAt: string;
  status: 'Verified Healthy' | 'Pending Verification' | 'Failed';
  location: string;
  encrypted: boolean;
}

export interface SystemAuditLog {
  id: string;
  user: string;
  role: string;
  action: string;
  resource: string;
  resourceId: string;
  timestamp: string;
  ipAddress: string;
  device: string;
  previousValue?: string;
  newValue?: string;
  isImmutable: boolean;
}

export interface SystemHealthItem {
  component: string;
  status: 'Healthy' | 'Warning' | 'Critical' | 'Unknown';
  latencyMs: number;
  uptimePercent: number;
  lastChecked: string;
  details: string;
}

export interface BackgroundJobItem {
  id: string;
  jobName: string;
  queue: 'Notifications' | 'Backup' | 'DataSync' | 'ReportGeneration';
  status: 'Pending' | 'Running' | 'Completed' | 'Failed' | 'Retrying';
  attempt: number;
  createdAt: string;
}

export const INITIAL_SCHOOL_PROFILE: SchoolProfile = {
  name: 'Liora Begena Traditional Sacred Music School',
  logo: '/src/assets/images/logo.jpg',
  favicon: '/src/assets/images/logo.jpg',
  officialDescription: 'Ethiopian traditional sacred music institute dedicated to Begena, Kebero, Washint, and Krar excellence since 2012.',
  phone: '+251 911 234 567 / +251 911 888 999',
  email: 'info@abelbegena.com',
  website: 'https://abelbegena.com',
  telegram: 'https://t.me/liyora_begena',
  facebook: '',
  youtube: '',
  instagram: 'https://www.instagram.com/liyora_begena?xtok=MWxxbTJ5eWJ1MTBpeA==',
  tiktok: 'https://www.tiktok.com/@liora_begena?is_from_webapp=1&sender_device=pc',
  address: 'Center Point Tower, first floor, Hawassa, Ethiopia',
  googleMapsLocation: '9.0012° N, 38.7833° E',
  workingHours: 'Mon - Sat: 8:00 AM - 7:00 PM | Sun: 1:00 PM - 6:00 PM',
  foundedDate: 'September 11, 2012',
  founderInfo: 'Bruk Tesfaye - Founder of Liora Begena, Musician, Teacher & Technology Enthusiast',
  mission: 'To preserve, teach, and modernize traditional Ethiopian sacred acoustic instruments with spiritual reverence and academic rigor.',
  vision: 'To be the global center of excellence for Ethiopian liturgical and traditional musical heritage.',
  values: ['Spiritual Reverence', 'Cultural Authenticity', 'Academic Excellence', 'Community Trust', 'Global Accessibility']
};

export const INITIAL_BRANCHES: BranchItem[] = [
  {
    id: 'BR-HAWASSA',
    name: 'Hawassa Main Branch',
    code: 'HW-01',
    address: 'Center Point Tower, first floor, Hawassa, Ethiopia',
    phone: '+251 912 67 4600',
    manager: 'Bruk Tesfaye',
    openingHours: 'Mon-Sat 8:30 AM - 6:30 PM',
    availableCourses: ['Begena Level 1', 'Begena Level 2', 'Begena Level 3'],
    availableTeachers: 24,
    classrooms: 8,
    capacity: 720,
    status: 'Active'
  }
];

export const INITIAL_PRICING_CONFIG: CoursePricingConfig[] = [
  {
    id: 'PRC-01',
    courseName: 'Begena Level 1 - Acoustic & Tuning',
    instrument: 'Begena',
    level: 'Beginner',
    monthlyFee: 1500,
    threeMonthOption: 4000,
    fourMonthOption: 5200,
    sixMonthOption: 7500,
    registrationFee: 300,
    onlinePricing: 1200,
    inPersonPricing: 1500,
    discountsAllowed: true
  },
  {
    id: 'PRC-02',
    courseName: 'Begena Level 2 - Advanced Zema & Octaves',
    instrument: 'Begena',
    level: 'Intermediate',
    monthlyFee: 1800,
    threeMonthOption: 4800,
    fourMonthOption: 6200,
    sixMonthOption: 9000,
    registrationFee: 300,
    onlinePricing: 1500,
    inPersonPricing: 1800,
    discountsAllowed: true
  },
  {
    id: 'PRC-03',
    courseName: 'Kebero Liturgical Rhythms',
    instrument: 'Kebero',
    level: 'All Levels',
    monthlyFee: 1400,
    threeMonthOption: 3800,
    fourMonthOption: 4900,
    sixMonthOption: 7000,
    registrationFee: 250,
    onlinePricing: 1100,
    inPersonPricing: 1400,
    discountsAllowed: true
  }
];

export const INITIAL_USERS: UserAccountItem[] = [
  {
    id: 'USR-101',
    fullName: 'Bruk Girma',
    email: 'abel@abelbegena.com',
    phone: '+251 911 223 344',
    role: 'Founder',
    branchScope: 'All Branches',
    status: 'Active',
    mfaEnabled: true,
    lastLogin: '2026-07-22 08:30 AM',
    ipAddress: '197.156.104.12'
  },
  {
    id: 'USR-102',
    fullName: 'Kibreab Hailu',
    email: 'kibreab@abelbegena.com',
    phone: '+251 911 556 677',
    role: 'Super Admin',
    branchScope: 'All Branches',
    status: 'Active',
    mfaEnabled: true,
    lastLogin: '2026-07-22 09:15 AM',
    ipAddress: '197.156.104.18'
  },
  {
    id: 'USR-103',
    fullName: 'Meron Tadesse',
    email: 'meron.accountant@abelbegena.com',
    phone: '+251 911 889 900',
    role: 'Accountant',
    branchScope: 'All Branches',
    status: 'Active',
    mfaEnabled: true,
    lastLogin: '2026-07-21 04:20 PM',
    ipAddress: '197.156.105.02'
  },
  {
    id: 'USR-104',
    fullName: 'Yohannes Girma',
    email: 'yohannes@student.com',
    phone: '+251 922 112 233',
    role: 'Student',
    branchScope: 'Hawassa Main Branch',
    status: 'Active',
    mfaEnabled: false,
    lastLogin: '2026-07-22 07:45 AM',
    ipAddress: '102.215.88.40'
  }
];

export const INITIAL_INTEGRATIONS: IntegrationStatus[] = [
  {
    id: 'INT-01',
    name: 'Ethio Telecom SMS Gateway',
    category: 'Communication',
    status: 'Connected',
    lastSync: '10 mins ago',
    apiKeyMasked: 'eth_sms_live_••••••••8912',
    webhookConfigured: true
  },
  {
    id: 'INT-02',
    name: 'Liora Begena Telegram Bot',
    category: 'Communication',
    status: 'Connected',
    lastSync: '2 mins ago',
    apiKeyMasked: '719283019:AAH••••••••xK2',
    webhookConfigured: true
  },
  {
    id: 'INT-03',
    name: 'Telebirr Commercial Merchant API',
    category: 'Payment',
    status: 'Connected',
    lastSync: 'Just now',
    apiKeyMasked: 'tele_merch_live_••••••••0019',
    webhookConfigured: true
  },
  {
    id: 'INT-04',
    name: 'Google Meet Scheduling API',
    category: 'Video',
    status: 'Connected',
    lastSync: '1 hour ago',
    apiKeyMasked: 'AIzaSyD••••••••92031',
    webhookConfigured: false
  },
  {
    id: 'INT-05',
    name: 'Gemini 2.5 Flash Server-Side AI',
    category: 'AI',
    status: 'Connected',
    lastSync: 'Active',
    apiKeyMasked: 'AIzaSyB••••••••44812',
    webhookConfigured: true
  }
];

export const INITIAL_BACKUPS: BackupRecord[] = [
  {
    id: 'BK-20260721-FULL',
    filename: 'abel_begena_full_backup_2026_07_21.enc.sql',
    type: 'Full Backup',
    sizeMB: 245.8,
    createdAt: '2026-07-21 02:00 AM',
    status: 'Verified Healthy',
    location: 'Cloud Storage (Primary Encrypted Vault)',
    encrypted: true
  },
  {
    id: 'BK-20260720-DB',
    filename: 'abel_begena_db_only_2026_07_20.enc.sql',
    type: 'Database Backup',
    sizeMB: 42.1,
    createdAt: '2026-07-20 02:00 AM',
    status: 'Verified Healthy',
    location: 'Cloud Storage (Vault Offsite)',
    encrypted: true
  }
];

export const INITIAL_AUDIT_LOGS: SystemAuditLog[] = [
  {
    id: 'AUD-9912',
    user: 'Kibreab Hailu',
    role: 'Super Admin',
    action: 'SETTINGS_UPDATE',
    resource: 'CoursePricingConfig',
    resourceId: 'PRC-01',
    timestamp: '2026-07-22 09:12:04',
    ipAddress: '197.156.104.18',
    device: 'Chrome / macOS',
    previousValue: 'monthlyFee: 1400 ETB',
    newValue: 'monthlyFee: 1500 ETB',
    isImmutable: true
  },
  {
    id: 'AUD-9911',
    user: 'Meron Tadesse',
    role: 'Accountant',
    action: 'PAYMENT_APPROVE',
    resource: 'StudentPayment',
    resourceId: 'PAY-8821',
    timestamp: '2026-07-21 16:18:22',
    ipAddress: '197.156.105.02',
    device: 'Firefox / Windows',
    previousValue: 'Status: Pending Review',
    newValue: 'Status: Approved (Receipt #REC-4091)',
    isImmutable: true
  },
  {
    id: 'AUD-9910',
    user: 'System Bot',
    role: 'Automation Engine',
    action: 'TELEGRAM_ALERT_DISPATCH',
    resource: 'AttendanceWarning',
    resourceId: 'ATT-3011',
    timestamp: '2026-07-21 14:00:00',
    ipAddress: '127.0.0.1',
    device: 'Internal Service Worker',
    previousValue: 'Unsent',
    newValue: 'Sent to Parent Telegram ID #772819',
    isImmutable: true
  }
];

export const INITIAL_HEALTH_ITEMS: SystemHealthItem[] = [
  {
    component: 'Primary Application Container (Cloud Run)',
    status: 'Healthy',
    latencyMs: 14,
    uptimePercent: 99.98,
    lastChecked: 'Just now',
    details: 'Port 3000 Active behind Nginx reverse proxy.'
  },
  {
    component: 'PostgreSQL Cloud SQL / Firestore Database',
    status: 'Healthy',
    latencyMs: 8,
    uptimePercent: 100.0,
    lastChecked: 'Just now',
    details: 'Connection pool stable (12 active, 48 idle).'
  },
  {
    component: 'Telebirr Payment Gateway Webhook',
    status: 'Healthy',
    latencyMs: 120,
    uptimePercent: 99.85,
    lastChecked: '2 mins ago',
    details: '200 OK responses on all verification ping checks.'
  },
  {
    component: 'Ethio Telecom SMS Gateway',
    status: 'Healthy',
    latencyMs: 210,
    uptimePercent: 99.5,
    lastChecked: '5 mins ago',
    details: 'SMS delivery queue clear.'
  }
];

export const INITIAL_BACKGROUND_JOBS: BackgroundJobItem[] = [
  {
    id: 'JOB-8821',
    jobName: 'Nightly Database Automated Encrypted Backup',
    queue: 'Backup',
    status: 'Completed',
    attempt: 1,
    createdAt: '2026-07-22 02:00 AM'
  },
  {
    id: 'JOB-8822',
    jobName: 'Weekly Inactive Student Attendance Reminders',
    queue: 'Notifications',
    status: 'Completed',
    attempt: 1,
    createdAt: '2026-07-21 08:00 AM'
  },
  {
    id: 'JOB-8823',
    jobName: 'Certificate Authenticity Hash Generation',
    queue: 'DataSync',
    status: 'Pending',
    attempt: 0,
    createdAt: '2026-07-22 09:30 AM'
  }
];

