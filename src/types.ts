export interface PricingOption {
  duration: string;
  price: number; // in ETB
  period?: string; // e.g., "per month" or "total"
}

export interface Course {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  level: string;
  instrument?: string;
  duration: string;
  learningMode: ('In-Person' | 'Online' | 'Hybrid')[];
  image: string;
  rating: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  levels: string[];
  curriculum: {
    week: string;
    title: string;
    topics: string[];
  }[];
  learningOutcomes: string[];
  requirements: string[];
  schedule: string[];
  pricing: PricingOption[];
  registrationFee: number; // in ETB
  isComingSoon?: boolean;
}

export interface PersistentTeacher {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  photo: string;
  specializations: string[]; // e.g. ['Begena', 'Vocal'], ['Krar'], ['Masenqo'], ['Washint'], ['Kebero']
  branches: string[]; // e.g. ['Piazza Branch', 'Bole Branch', 'Megenagna Branch']
  supportsOnline: boolean;
  supportsInPerson: boolean;
  capacity: number; // Max student capacity
  status: 'Active' | 'On Leave' | 'Inactive';
  bio?: string;
  telegramUsername?: string; // e.g. 'abel_begena' or '@abel_begena'
  activeStudentsCount?: number;
}

export type AttendanceStatus = 'Present' | 'Absent' | 'Permission' | 'Late' | 'Not Marked';

export type PermissionReason = 
  | 'Medical Appointment'
  | 'Family Emergency'
  | 'Work Conflict'
  | 'Church Service'
  | 'Travel / Out of Town'
  | 'Other';

export interface AttendanceRecord {
  id: string;
  enrollmentId?: string;
  studentId: string;
  studentName: string;
  studentEmail?: string;
  studentPhone?: string;
  courseId: string;
  courseName: string;
  instrument?: string;
  level?: string;
  branch: string;
  learningMode?: 'In-Person' | 'Online' | 'Hybrid';
  classTime?: string;
  teacherId?: string;
  teacherName?: string;
  date: string; // YYYY-MM-DD
  dayOfWeek: string; // e.g. 'Monday'
  status: AttendanceStatus;
  permissionReason?: PermissionReason;
  permissionNote?: string;
  markedByUserId?: string;
  markedByName?: string;
  markedByRole?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AttendanceAuditLog {
  id: string;
  attendanceId: string;
  studentId: string;
  studentName: string;
  date: string;
  previousStatus: AttendanceStatus;
  newStatus: AttendanceStatus;
  changedByUserId: string;
  changedByName: string;
  changedByRole: string;
  timestamp: string;
  reason?: string;
}

export interface StudentEnrollment {
  id: string; // e.g. ENR-2026-001
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentPhone?: string;
  courseId: string; // e.g. 'begena', 'krar', 'masenqo', 'washint', 'vocal', 'kebero'
  courseName: string; // e.g. 'Begena Basic 1', 'Krar Intermediate'
  instrument: string; // 'Begena' | 'Krar' | 'Masenqo' | 'Washint' | 'Vocal' | 'Kebero'
  level: string; // 'Basic 1', 'Intermediate', 'Advanced'
  learningMode: 'In-Person' | 'Online' | 'Hybrid';
  branch: string; // 'Piazza Branch', 'Bole Branch', 'Megenagna Branch', 'Online'
  assignedTeacherId?: string;
  assignedTeacherName?: string;
  assignedTeacherEmail?: string;
  assignmentStatus: 'Assigned' | 'Pending Teacher Assignment' | 'Not Required (In-Person)' | 'In-Person Campus Classes';
  teacherAssignmentStatus?: string;
  assignedAt?: string;
  assignedBy?: string; // 'System (Auto)' or Staff Name
  enrollmentDate: string;
  startDate?: string;
  endDate?: string;
  durationMonths?: number; // 3, 6, 9
  scheduleDays?: string[]; // e.g. ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
  classTime?: string; // e.g. 'Morning (9:00 AM - 12:00 PM)'
  status: 'Active' | 'Completed' | 'Suspended' | 'Cancelled' | 'Pending Verification' | 'Needs Correction';
  paymentStatus?: string;
  progressPercent: number;
  currentChapter?: string;
  currentLesson?: string;
  practiceTimeMinutes?: number;
  attendanceCount?: number;
  totalScheduledSessions?: number;
  attendancePercent?: number;
  lastActive?: string;
  attendanceHistory?: Array<{ date: string; status: string; note?: string }>;
  reassignedHistory?: Array<{
    date: string;
    fromTeacherName?: string;
    toTeacherName: string;
    reassignedBy: string;
  }>;
}

export interface Teacher {
  id: string;
  name: string;
  instrument: string;
  bio: string;
  experience: string;
  photo: string;
  specialization: string;
  coursesTaught: string[];
  reviews: {
    studentName: string;
    rating: number;
    comment: string;
  }[];
  availableClasses: string[];
}

export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  image: string;
  shortDescription: string;
  fullDescription: string;
  speakerOrPerformer: string;
  galleryImages: string[];
  isUpcoming: boolean;
  category: 'Concert' | 'Workshop' | 'Performance' | 'Cultural' | 'Liturgical';
}

export interface Product {
  id: string;
  name: string;
  price: number; // in ETB
  availability: 'In Stock' | 'Low Stock' | 'Pre-Order' | 'Out of Stock' | 'Coming Soon';
  image: string;
  category: 'Instruments' | 'Strings' | 'Accessories' | 'Books';
  description: string;
}

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: 'Begena History' | 'Ethiopian Music' | 'Learning Tips' | 'Instrument Care' | 'Practice Tips' | 'Traditional Music' | 'Spiritual Music';
  author: string;
  date: string;
  image: string;
}

export interface Testimonial {
  id: string;
  name: string;
  course: string;
  branchOrOnline: string;
  text: string;
  rating: number;
  avatar: string;
}

export interface Branch {
  id: string;
  name: string;
  location: string;
  description: string;
  phone: string;
  email: string;
  hours: string;
  image: string;
}

export interface GalleryItem {
  id: string;
  url: string;
  category: string;
  title: string;
  description: string;
  imgNum?: number;
  date?: string;
  location?: string;
  status?: 'Draft' | 'Published' | 'Unpublished';
}

export interface PersistentMediaAsset {
  id: string;
  url: string;
  title: string;
  caption: string;
  category: string;
  placement: 'Gallery' | 'Hero' | 'Course' | 'Teacher Profile' | 'Event';
  altText: string;
  status: 'Draft' | 'Published' | 'Unpublished';
  isPublished: boolean;
  uploadedBy: string;
  uploadedAt: string;
  photoDate?: string;
  location?: string;
  fileSizeKB?: number;
}

export type UserRole =
  | 'visitor'
  | 'student'
  | 'parent'
  | 'teacher'
  | 'registration_staff'
  | 'branch_manager'
  | 'accountant'
  | 'admin'
  | 'super_admin'
  | 'founder';

export type AccountStatus =
  | 'Active'
  | 'Pending Verification'
  | 'Pending Approval'
  | 'Incomplete'
  | 'Suspended'
  | 'Rejected'
  | 'Deactivated'
  | 'Archived';

export type StudentRegistrationStatus =
  | 'Account Created'
  | 'Profile Incomplete'
  | 'Application Submitted'
  | 'Payment Pending'
  | 'Payment Under Review'
  | 'Payment Rejected'
  | 'Application Under Review'
  | 'Correction Required'
  | 'Approved'
  | 'Enrollment Active'
  | 'Enrollment Expired'
  | 'Rejected';

export interface Notification {
  id: string;
  title: string;
  description: string;
  isRead: boolean;
  timestamp: string;
  category: 'registration' | 'payment' | 'lesson' | 'assignment' | 'feedback' | 'class_reminder' | 'event' | 'certificate' | 'system' | 'announcement' | 'achievement';
  userId?: string;
  userEmail?: string;
  targetRole?: UserRole | UserRole[];
}

export interface User {
  id: string;
  email: string;
  phone: string;
  username?: string;
  role: UserRole;
  status: AccountStatus;
  fullName: string;
  avatar?: string;
  address?: string;
  gender?: 'Male' | 'Female' | 'Other';
  age?: number;
  branch?: string;
  paymentRejectionReason?: string;
  emergencyContact?: {
    name: string;
    relation: string;
    phone: string;
  };
  language: 'en' | 'am';
  theme?: 'light' | 'dark';
  notificationPreferences: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  studentStatus?: StudentRegistrationStatus;
  enrolledInstrument?: 'Begena' | 'Kirar' | 'Krar' | 'Masenqo' | 'Washint' | 'Kebero' | 'Vocal' | string;
  enrolledCourse?: string;
  isRegistrationCompleted?: boolean;
  isPaymentCompleted?: boolean;
  parentStatus?: 'Draft' | 'Submitted' | 'Under Review' | 'Approved' | 'Rejected';
  parentProfile?: {
    fullName: string;
    photo?: string;
    phone: string;
    email: string;
    address: string;
    relationship: string;
    emergencyName: string;
    emergencyPhone: string;
    emergencyEmail: string;
    children: { fullName: string; id: string; currentLevel: string }[];
  };
  teacherStatus?: 'Draft' | 'Submitted' | 'Under Review' | 'Interview Required' | 'Approved' | 'Rejected' | 'Hired';
  teacherApplication?: {
    applicationId: string;
    fullName: string;
    photo?: string;
    phone: string;
    email: string;
    address: string;
    dob: string;
    gender: string;
    instruments: string[];
    experienceYears: string;
    teachingExperience: string;
    previousSchool: string;
    education: string;
    certificates: string;
    specialSkills: string;
    bio: string;
    preferredBranch: string;
    onlineAvailability: boolean;
    availableDays: string[];
    availableHours: string;
    documentsUploaded?: string[];
  };
  linkedChildren?: { id: string; fullName: string; currentLevel: string }[];
  verified: boolean;
  isVerified?: boolean;
  verificationCode?: string | null;
  verificationExpiry?: number | null;
  lastCodeSentAt?: number | null;
}

export type PageId =
  | 'home'
  | 'about-abel'
  | 'about-begena'
  | 'courses'
  | 'course-detail'
  | 'teachers'
  | 'teacher-profile'
  | 'gallery'
  | 'events'
  | 'event-detail'
  | 'contact'
  | 'donate'
  | 'design-system'
  | 'login'
  | 'register'
  | 'stepped-register'
  | 'forgot-password'
  | 'verify-account'
  | 'student-dashboard'
  | 'parent-dashboard'
  | 'teacher-dashboard'
  | 'registration-dashboard'
  | 'branch-manager-dashboard'
  | 'accountant-dashboard'
  | 'admin-dashboard'
  | 'super-admin-dashboard'
  | 'founder-dashboard'
  | 'unauthorized'
  | 'profile'
  | 'notifications'
  | 'student-registration'
  | 'explore-begena'
  | 'student'
  | 'parent'
  | 'teacher'
  | 'registration_staff'
  | 'branch_manager'
  | 'accountant'
  | 'admin'
  | 'super_admin'
  | 'founder'
  | 'registration-gate'
  | 'help-center'
  | 'mezmur-library'
  | 'audit-logs'
  // Phase 10 Communication & Community routes
  | 'messages'
  | 'community'
  | 'community-create'
  | 'community-discussions'
  | 'community-discussion-detail'
  | 'community-prayer-requests'
  | 'community-teachers'
  | 'community-teacher-detail'
  | 'community-saved'
  | 'community-guidelines'
  | 'announcements'
  | 'settings-notifications'
  | 'admin-community'
  | 'admin-community-moderation'
  | 'admin-communications'
  // Phase 11 LMS & Practice Studio routes
  | 'learn'
  | 'learn-courses'
  | 'learn-course-detail'
  | 'learn-lesson'
  | 'practice'
  | 'practice-history'
  | 'learn-mezmur'
  | 'learn-quizzes'
  | 'learn-live-classes'
  | 'learn-bookmarks'
  | 'learn-admin'
  | 'learn-parent'
  // Phase 12 Operations & Branch Management routes
  | 'operations'
  | 'operations-branches'
  | 'operations-branch-detail'
  | 'operations-schedule'
  | 'operations-rooms'
  | 'operations-makeup'
  | 'operations-transfers'
  | 'operations-attendance'
  | 'operations-inventory'
  | 'store'
  | 'operations-maintenance'
  | 'operations-staff'
  | 'operations-tasks'
  // Phase 13 Store & E-Commerce routes
  | 'store-categories'
  | 'store-product-detail'
  | 'store-cart'
  | 'store-wishlist'
  | 'store-checkout'
  | 'store-orders'
  | 'store-order-detail'
  | 'store-branch-orders'
  | 'store-returns'
  | 'admin-store'
  | 'admin-suppliers'
  // Phase 14 Advanced Analytics, Reporting & Intelligence routes
  | 'analytics'
  | 'student-progress'
  | 'teacher-analytics'
  | 'branch-analytics'
  | 'accountant-analytics'
  | 'admin-analytics'
  | 'founder-intelligence'
  | 'analytics-insights'
  | 'reports-builder'
  | 'reports-history'
  // Phase 15 Events, Competitions, Certificates, Achievements & Graduation routes
  | 'event-checkin'
  | 'concerts'
  | 'competitions'
  | 'competition-detail'
  | 'achievements'
  | 'achievements-showcase'
  | 'student-achievements'
  | 'certificates'
  | 'certificate-detail'
  | 'certificate-verify'
  | 'graduation'
  | 'graduation-gallery'
  | 'alumni'
  | 'alumni-mentorship'
  // Phase 16 Marketing, CRM, Lead Management & Student Acquisition
  | 'crm'
  | 'crm-leads'
  | 'crm-lead-detail'
  | 'crm-inquiries'
  | 'crm-prospects'
  | 'crm-followups'
  | 'crm-tasks'
  | 'crm-appointments'
  | 'crm-trials'
  | 'marketing'
  | 'marketing-campaigns'
  | 'marketing-campaign-detail'
  | 'marketing-landing'
  | 'marketing-referrals'
  | 'marketing-promos'
  | 'marketing-content'
  | 'marketing-course-landing'
  | 'crm-reports'
  | 'crm-campaigns'
  | 'crm-funnel'
  // Phase 17 Advanced AI Assistant, Smart Automation & Personalized Learning Engine
  | 'ai'
  | 'student-ai'
  | 'student-practice-plan'
  | 'student-learning-path'
  | 'student-goals'
  | 'teacher-ai'
  | 'parent-ai'
  | 'branch-manager-ai'
  | 'accountant-ai'
  | 'admin-ai'
  | 'founder-ai'
  | 'automation'
  // Phase 18 System Settings, Security, Backup & Disaster Recovery, Audit Logs & System Health
  | 'settings'
  | 'settings-users'
  | 'settings-roles'
  | 'settings-integrations'
  | 'settings-backups'
  | 'admin-system-health'
  | 'admin-audit-logs'
  | 'verify-certificate'
  | 'global-search'
  // Phase 19 Master Integration, QA, Help Center & Production Launch
  | 'help'
  | 'qa-launch-center'
  | 'founder-presentation';

export type Language = 'en' | 'am';

// Phase 10 Communication & Community Interfaces
export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  senderAvatar: string;
  text: string;
  timestamp: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'pdf' | 'audio' | 'video';
  isVoiceNote?: boolean;
  replyToId?: string;
  reactions?: { [emoji: string]: number };
  read: boolean;
  delivered: boolean;
  edited?: boolean;
  deleted?: boolean;
}

export interface ConversationParticipant {
  id: string;
  name: string;
  role: UserRole;
  avatar: string;
  isOnline?: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  type: 'direct' | 'group' | 'broadcast';
  participants: ConversationParticipant[];
  lastMessage?: ChatMessage;
  unreadCount: number;
  isPinned?: boolean;
  isMuted?: boolean;
  enrollmentId?: string;
  studentId?: string;
  studentName?: string;
  teacherId?: string;
  teacherName?: string;
  groupMeta?: {
    description: string;
    image?: string;
    branch?: string;
    course?: string;
    level?: string;
    createdBy: string;
    admins: string[];
  };
}

export interface PostComment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  authorAvatar: string;
  text: string;
  timestamp: string;
  parentCommentId?: string;
  isTeacherAnswer?: boolean;
  likes: string[];
}

export interface CommunityPost {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  authorAvatar: string;
  category: 'General' | 'Practice' | 'Question' | 'Achievement' | 'Prayer' | 'Event' | 'Announcement';
  title?: string;
  content: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'audio' | 'video' | 'pdf';
  practiceMeta?: {
    courseName: string;
    level: string;
    instrument: string;
    teacherFeedback?: {
      teacherName: string;
      teacherAvatar: string;
      rating: number;
      text: string;
      date: string;
      audioFeedbackUrl?: string;
    };
  };
  visibility: 'Private' | 'Teacher Only' | 'Course' | 'Branch' | 'School' | 'Public';
  timestamp: string;
  likes: string[];
  comments: PostComment[];
  savesCount: number;
  reactions: { [type: string]: number };
  isPinned?: boolean;
  isSaved?: boolean;
}

export interface PrayerRequest {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  isAnonymous: boolean;
  title: string;
  description: string;
  category: 'Healing' | 'Guidance' | 'Gratitude' | 'Exam/Learning' | 'Family' | 'General';
  visibility: 'Public' | 'Course' | 'Branch' | 'Private';
  date: string;
  prayCount: number;
  prayedUserIds: string[];
  commentsCount: number;
}

export interface DiscussionThread {
  id: string;
  category:
    | 'Begena'
    | 'Krar'
    | 'Masenqo'
    | 'Washint'
    | 'Vocal'
    | 'Kebero'
    | 'Music Theory'
    | 'Practice'
    | 'Church Music'
    | 'Ethiopian Traditional Music'
    | 'General'
    | 'Questions';
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  authorAvatar: string;
  views: number;
  repliesCount: number;
  likes: string[];
  isPinned?: boolean;
  teacherAnswer?: {
    teacherName: string;
    teacherAvatar: string;
    answer: string;
    timestamp: string;
  };
  createdAt: string;
  lastActivity: string;
}

export interface AnnouncementItem {
  id: string;
  title: string;
  content: string;
  priority: 'Normal' | 'Important' | 'Urgent' | 'Emergency';
  targetAudience: string;
  targetBranch?: string;
  targetCourse?: string;
  authorName: string;
  authorRole: string;
  date: string;
  image?: string;
  attachmentUrl?: string;
  isRead?: boolean;
}

export interface ModerationReport {
  id: string;
  targetType: 'post' | 'comment' | 'message' | 'prayer_request' | 'user';
  targetId: string;
  reportedUserId: string;
  reportedUserName: string;
  reporterId: string;
  reporterName: string;
  reason: 'Spam' | 'Harassment' | 'Inappropriate' | 'Hate' | 'Scam' | 'Unsafe Content' | 'Other';
  details?: string;
  status: 'Reported' | 'Under Review' | 'Approved' | 'Removed' | 'Dismissed';
  createdAt: string;
  contentPreview: string;
}

export interface CommunicationCampaign {
  id: string;
  title: string;
  channel: 'SMS' | 'Telegram' | 'Push' | 'Email' | 'In-App';
  targetAudience: string;
  status: 'Draft' | 'Scheduled' | 'Sending' | 'Completed' | 'Failed';
  recipientCount: number;
  sentAt?: string;
  scheduledAt?: string;
  messageText: string;
  deliveryRate?: number;
}

// Phase 11 LMS & Practice Studio Interfaces
export interface PracticeSessionRecord {
  id: string;
  studentId: string;
  studentName: string;
  courseId: string;
  courseName: string;
  instrument: 'Begena' | 'Krar' | 'Masenqo' | 'Washint' | 'Vocal' | 'Kebero';
  lessonId?: string;
  lessonTitle?: string;
  durationMinutes: number;
  practiceGoal: string;
  notes?: string;
  recordingUrl?: string;
  recordingType?: 'audio' | 'video';
  visibility: 'Private' | 'Teacher Only' | 'Course' | 'Branch' | 'School Community' | 'Public';
  feedbackStatus: 'Submitted' | 'Under Review' | 'Reviewed' | 'Needs Improvement' | 'Excellent';
  teacherFeedback?: {
    score?: number;
    comment?: string;
    rubricScores?: {
      technique?: number;
      rhythm?: number;
      accuracy?: number;
      tone?: number;
      posture?: number;
      consistency?: number;
    };
    audioFeedbackUrl?: string;
    date: string;
  };
  createdAt: string;
}

export interface MezmurItem {
  id: string;
  title: string;
  amharicTitle: string;
  category: 'Spiritual Praise' | 'Great Lent' | 'Feast of St. Mary' | 'Begena Classic' | 'Liturgical' | 'Youth Mezmur';
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  courseId: string;
  audioUrl: string;
  videoUrl?: string;
  practiceAudioUrl?: string;
  slowAudioUrl?: string;
  lyricsAmharic: string;
  lyricsPhonetic?: string;
  englishTranslation?: string;
  teacherNotes?: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  status: 'Not Started' | 'Learning' | 'Practicing' | 'Submitted' | 'Teacher Reviewed' | 'Completed';
}

export interface LmsQuizQuestion {
  id: string;
  questionText: string;
  type: 'multiple_choice' | 'true_false' | 'matching' | 'audio_listening' | 'theory';
  options?: string[];
  correctAnswer: string | number;
  explanation?: string;
  audioUrl?: string;
}

export interface LmsQuiz {
  id: string;
  title: string;
  courseId: string;
  lessonId?: string;
  questions: LmsQuizQuestion[];
  passingScore: number;
  timeLimitMinutes?: number;
  maxAttempts?: number;
}

export interface LiveClassSession {
  id: string;
  title: string;
  courseId: string;
  courseName: string;
  instrument: string;
  teacherName: string;
  branchName: string;
  date: string;
  time: string;
  durationMinutes: number;
  googleMeetUrl: string;
  isLive: boolean;
  isCompleted: boolean;
  recordingUrl?: string;
  materialsUrl?: string;
  classRules: string[];
}

export interface LmsAssignment {
  id: string;
  title: string;
  courseId: string;
  lessonId?: string;
  description: string;
  type: 'Written' | 'Practice' | 'Recording' | 'Video' | 'Theory';
  dueDate: string;
  maxPoints: number;
  resubmissionAllowed: boolean;
  status: 'Pending' | 'Submitted' | 'Needs Revision' | 'Graded';
  studentSubmission?: {
    text?: string;
    fileUrl?: string;
    recordingUrl?: string;
    submittedAt: string;
    grade?: number;
    feedback?: string;
  };
}

export interface LmsBookmark {
  id: string;
  studentId: string;
  title: string;
  type: 'lesson' | 'mezmur' | 'video' | 'pdf' | 'audio';
  targetId: string;
  targetCourse: string;
  timestamp?: string;
  createdAt: string;
}

export interface LmsPersonalNote {
  id: string;
  studentId: string;
  targetId: string;
  targetTitle: string;
  videoTimestamp?: number;
  text: string;
  createdAt: string;
}

export interface DigitalCertificateRecord {
  id: string;
  certificateId: string;
  studentId: string;
  studentName: string;
  courseName: string;
  instrument: string;
  level: string;
  completionDate: string;
  authorizedSignature: string;
  qrVerificationUrl: string;
}

// Phase 12 Operations & Branch Management Interfaces
export interface SchoolBranch {
  id: string;
  name: string; // e.g. "Piazza Branch", "Megenagna Branch", "Lebu Branch"
  code: string; // e.g. "PZ-01", "MG-02", "LB-03"
  city: string;
  subCity: string;
  woreda?: string;
  address: string;
  description: string;
  latitude: number;
  longitude: number;
  managerName: string;
  contactPhone: string;
  emergencyPhone: string;
  operatingHours: string;
  status: 'Active' | 'Temporarily Closed' | 'Under Maintenance' | 'Inactive';
  totalStudents: number;
  totalTeachers: number;
  activeCoursesCount: number;
  classesTodayCount: number;
  availableRoomsCount: number;
}

export interface BranchStaffMember {
  id: string;
  branchId: string;
  branchName: string;
  name: string;
  photo?: string;
  role: 'Branch Manager' | 'Registration Staff' | 'Teacher' | 'Accountant' | 'Support Staff' | 'Inventory Staff';
  email: string;
  phone: string;
  status: 'Active' | 'On Leave' | 'Inactive';
  workingSchedule: string;
  assignedInstruments?: string[];
}

export interface StaffAvailabilityRecord {
  id: string;
  staffId: string;
  staffName: string;
  role: string;
  availableDays: string[];
  availableHours: string;
  unavailableDays?: string[];
  preferredBranchId?: string;
  maxClassesPerDay?: number;
  instruments?: string[];
  supportsOnline?: boolean;
  supportsPhysical?: boolean;
}

export interface ClassScheduleItem {
  id: string;
  branchId: string;
  branchName: string;
  courseId: string;
  courseName: string;
  instrument: string;
  level: string;
  teacherId: string;
  teacherName: string;
  roomId: string;
  roomName: string;
  date: string; // YYYY-MM-DD
  startTime: string; // e.g. "09:00 AM"
  endTime: string; // e.g. "10:30 AM"
  learningMode: 'Physical' | 'Online' | 'Hybrid';
  classType: 'Regular Class' | 'Makeup Class' | 'Private Class' | 'Group Class' | 'Workshop' | 'Exam' | 'Assessment' | 'Concert Practice' | 'Special Event' | 'Online Class';
  maxCapacity: number;
  enrolledStudentsCount: number;
  waitingListCount: number;
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled' | 'Rescheduled';
  googleMeetUrl?: string;
}

export interface ClassRoom {
  id: string;
  branchId: string;
  branchName: string;
  name: string; // e.g. "Room 101 - Begena Sanctuary"
  roomNumber: string;
  capacity: number;
  type: 'Begena Classroom' | 'Krar Classroom' | 'Vocal Room' | 'Recording Room' | 'Practice Room' | 'Meeting Room' | 'Performance Hall' | 'Online Studio' | 'General Classroom';
  equipment: string[];
  status: 'Available' | 'Occupied' | 'Under Repair' | 'Reserved';
}

export interface MakeupClassRecord {
  id: string;
  studentId: string;
  studentName: string;
  parentName?: string;
  courseName: string;
  teacherId: string;
  teacherName: string;
  originalClassDate: string;
  reason: 'Student Absence' | 'Teacher Absence' | 'School Closure' | 'Technical Issue' | 'Emergency' | 'Class Cancellation';
  newDate: string;
  newTime: string;
  branchId: string;
  branchName: string;
  roomId?: string;
  roomName?: string;
  googleMeetUrl?: string;
  status: 'Requested' | 'Under Review' | 'Scheduled' | 'Completed' | 'Cancelled';
}

export interface StudentBranchTransferRequest {
  id: string;
  studentId: string;
  studentName: string;
  currentBranchId: string;
  currentBranchName: string;
  destinationBranchId: string;
  destinationBranchName: string;
  reason: 'Moved Location' | 'Schedule Change' | 'Family Request' | 'Work/School Schedule' | 'Branch Availability' | 'Other';
  notes?: string;
  requestedBy: string;
  requestedDate: string;
  status: 'Pending Review' | 'Schedule Verified' | 'Approved' | 'Rejected' | 'Completed';
  approvedBy?: string;
}

export interface OperationalTask {
  id: string;
  title: string;
  assignedToName: string;
  assignedToRole: string;
  branchId: string;
  branchName: string;
  priority: 'Low' | 'Normal' | 'High' | 'Urgent';
  dueDate: string;
  status: 'To Do' | 'In Progress' | 'Completed' | 'Cancelled';
  category: 'Classroom Prep' | 'Instrument Maintenance' | 'Parent Communication' | 'Registration Verification' | 'Inventory Restock' | 'General';
  notes?: string;
}

export interface SchoolEvent {
  id: string;
  title: string;
  branchId: string;
  branchName: string;
  type: 'Concert' | 'Workshop' | 'Competition' | 'Open Day' | 'Church Event' | 'Graduation' | 'Special Training';
  date: string;
  time: string;
  location: string;
  organizerName: string;
  expectedParticipants: number;
  status: 'Upcoming' | 'Ongoing' | 'Completed' | 'Postponed';
}

export interface InventoryItem {
  id: string;
  name: string; // e.g. "Traditional Begena (10-String)"
  category: 'Instruments' | 'Strings' | 'Accessories' | 'Furniture' | 'Electronics' | 'Learning Materials' | 'Office Supplies';
  instrumentType?: 'Begena' | 'Krar' | 'Masenqo' | 'Washint' | 'Kebero';
  serialNumber?: string;
  branchId: string;
  branchName: string;
  condition: 'Excellent' | 'Good' | 'Needs Maintenance' | 'Damaged' | 'Under Repair' | 'Lost' | 'Retired';
  quantity: number;
  minThreshold: number;
  unitPriceETB: number;
  assignedTo?: string;
  availability: 'In Stock' | 'Borrowed' | 'Under Repair' | 'Out of Stock';
}

export interface InstrumentBorrowRecord {
  id: string;
  itemId: string;
  itemName: string;
  borrowerId: string;
  borrowerName: string;
  borrowerRole: 'Student' | 'Teacher' | 'Classroom';
  branchId: string;
  branchName: string;
  checkoutDate: string;
  expectedReturnDate: string;
  returnedDate?: string;
  conditionBefore: string;
  conditionAfter?: string;
  status: 'Borrowed' | 'Returned' | 'Overdue';
}

export interface StoreProduct {
  id: string;
  name: string; // e.g. "Gut String Set for Begena", "Traditional 10-String Begena"
  category: 'Strings' | 'Instruments' | 'Accessories' | 'Books';
  instrumentType?: string;
  description: string;
  priceETB: number;
  stockQuantity: number;
  branchId: string;
  branchName: string;
  imageUrl: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

export interface InventoryStockTransfer {
  id: string;
  itemName: string;
  sourceBranchId: string;
  sourceBranchName: string;
  destinationBranchId: string;
  destinationBranchName: string;
  quantity: number;
  requestedBy: string;
  requestDate: string;
  status: 'Requested' | 'Approved' | 'Shipped' | 'Received' | 'Completed';
}

export interface MaintenanceRequest {
  id: string;
  title: string; // e.g. "Begena String Bridge Repair"
  category: 'Instrument Repair' | 'Room Repair' | 'Equipment Repair' | 'IT Issue' | 'Electrical' | 'Other';
  branchId: string;
  branchName: string;
  roomId?: string;
  priority: 'Low' | 'Normal' | 'High' | 'Urgent';
  reportedBy: string;
  date: string;
  description: string;
  status: 'Reported' | 'Assigned' | 'In Progress' | 'Completed' | 'Verified' | 'Closed';
}

export interface BranchExpenseRequest {
  id: string;
  title: string;
  category: 'Repair' | 'Stationery' | 'Equipment' | 'Transportation' | 'Maintenance' | 'Events' | 'Other';
  amountETB: number;
  branchId: string;
  branchName: string;
  requestedBy: string;
  requestDate: string;
  status: 'Pending Branch Review' | 'Pending Accountant Review' | 'Pending Admin Approval' | 'Approved' | 'Rejected' | 'Paid';
}

export interface StaffLeaveRequest {
  id: string;
  staffId: string;
  staffName: string;
  role: string;
  branchId: string;
  branchName: string;
  leaveType: 'Leave' | 'Sick Leave' | 'Vacation' | 'Personal Leave';
  startDate: string;
  endDate: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

export interface OperationalAuditLog {
  id: string;
  timestamp: string;
  action: string;
  actorName: string;
  actorRole: string;
  branchName: string;
  details: string;
}

// Phase 13 Online Store & Inventory Models
export type ProductCondition = 'New' | 'Used' | 'Refurbished' | 'Custom Made' | 'Pre-Owned';

export interface StoreProductVariant {
  id: string;
  sku: string;
  variantName: string; // e.g. "Ox Gut String 0.8mm", "Full-Size Wanza Wood"
  priceETB: number;
  stockQuantity: number;
  image?: string;
}

export interface BranchStockLevel {
  branchId: string;
  branchName: string; // e.g. "Piazza", "Megenagna", "Lebu", "Online Warehouse"
  quantity: number;
}

export interface ProductReview {
  id: string;
  productId: string;
  userName: string;
  userRole?: string;
  rating: number; // 1-5
  comment: string;
  date: string;
  isVerifiedPurchase: boolean;
  status: 'Approved' | 'Pending' | 'Flagged';
}

export interface ProductQuestion {
  id: string;
  productId: string;
  askedBy: string;
  question: string;
  date: string;
  answer?: string;
  answeredBy?: string;
  answeredDate?: string;
}

export interface StoreProductExtended {
  id: string;
  name: string;
  category: 'Begena' | 'Krar' | 'Strings' | 'Masenqo' | 'Washint' | 'Kebero' | 'Accessories' | 'Learning Materials' | 'Other';
  instrumentType?: string;
  brand?: string;
  description: string;
  priceETB: number;
  costETB?: number;
  sku: string;
  barcode?: string;
  condition: ProductCondition;
  stockQuantity: number;
  branchStock: BranchStockLevel[];
  images: string[];
  variants?: StoreProductVariant[];
  specifications: Record<string, string>;
  status: 'Active' | 'Draft' | 'Low Stock' | 'Out of Stock' | 'Archived' | 'Pre-Order';
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  recommendedForCourses?: string[];
  rating: number;
  reviewCount: number;
}

export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  category: string;
  variantId?: string;
  variantName?: string;
  priceETB: number;
  quantity: number;
  selectedBranchId: string;
  selectedBranchName: string;
  condition: ProductCondition;
  sku: string;
  isSavedForLater?: boolean;
}

export interface WishlistItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  priceETB: number;
  category: string;
  inStock: boolean;
  addedDate: string;
}

export interface StoreOrder {
  id: string;
  orderNumber: string; // e.g. ABS-2026-000123
  userId?: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerRole?: string;
  fulfillmentType: 'Branch Pickup' | 'Delivery';
  pickupBranchId?: string;
  pickupBranchName?: string;
  pickupAddress?: string;
  expectedPickupDate?: string;
  deliveryAddress?: {
    city: string;
    subCity: string;
    woreda: string;
    kebele?: string;
    phone: string;
    deliveryNotes?: string;
  };
  deliveryFeeETB: number;
  items: CartItem[];
  subtotalETB: number;
  discountETB: number;
  taxETB: number;
  totalETB: number;
  couponCode?: string;
  paymentMethod: 'CBE Bank Transfer' | 'Telebirr' | 'Cash on Pickup' | 'Awash Birr';
  paymentStatus: 'Pending Payment' | 'Payment Verification' | 'Payment Confirmed' | 'Payment Rejected' | 'Refunded';
  orderStatus: 'Pending Payment' | 'Payment Verification' | 'Payment Confirmed' | 'Processing' | 'Ready for Pickup' | 'Out for Delivery' | 'Completed' | 'Cancelled' | 'Refund Requested' | 'Refunded';
  receiptUrl?: string;
  transactionReference?: string;
  paymentRejectionReason?: string;
  qrCodeData?: string;
  orderDate: string;
  updatedAt: string;
  timeline: {
    status: string;
    date: string;
    note?: string;
    updatedBy?: string;
  }[];
  linkedStudentId?: string;
}

export interface StoreReturnRequest {
  id: string;
  orderId: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  productId: string;
  productName: string;
  reason: string;
  description: string;
  photoUrls?: string[];
  requestDate: string;
  status: 'Requested' | 'Under Review' | 'Approved' | 'Rejected' | 'Product Returned' | 'Inspected' | 'Refunded';
  inspectionNotes?: string;
  refundType?: 'Full Refund' | 'Partial Refund' | 'Store Credit';
  refundAmountETB?: number;
}

export interface StoreCoupon {
  id: string;
  code: string;
  discountType: 'Percentage' | 'Fixed ETB';
  discountValue: number;
  startDate: string;
  endDate: string;
  usageLimit: number;
  timesUsed: number;
  minOrderETB?: number;
  applicableCategory?: string;
  status: 'Active' | 'Expired' | 'Disabled';
}

export interface StoreBundle {
  id: string;
  title: string;
  description: string;
  includedProducts: { productId: string; productName: string; quantity: number }[];
  individualTotalETB: number;
  bundlePriceETB: number;
  savingsETB: number;
  imageUrl: string;
  status: 'Active' | 'Inactive';
}

export interface SupplierRecord {
  id: string;
  supplierName: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  suppliedCategories: string[];
  status: 'Active' | 'Inactive';
}

// Phase 14 Advanced Analytics & Intelligence Interfaces
export type SkillProgressStatus = 'Not Started' | 'Learning' | 'Practicing' | 'Developing' | 'Mastered';

export interface StudentSkillProgressItem {
  id: string;
  skillName: string;
  courseName: string;
  category: 'History' | 'Tuning' | 'Hand Position' | 'Basic Notes' | 'Mezmur' | 'Advanced Techniques' | 'Rhythm';
  status: SkillProgressStatus;
  confirmedByTeacher: boolean;
  teacherName?: string;
  lastPracticedDate?: string;
}

export interface AtRiskStudentSignal {
  id: string;
  studentId: string;
  studentName: string;
  branchName: string;
  courseName: string;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  signals: string[]; // e.g. "2 consecutive missed classes", "No practice logged in 14 days"
  confidenceScore: number; // e.g. 88%
  recommendedAction: string;
  reviewedByStaff: boolean;
  notes?: string;
  flaggedDate: string;
}

export interface AIInsightItem {
  id: string;
  category: string;
  text: string;
  badge: 'Verified Data' | 'Calculated Metric' | 'Forecast' | 'AI-Generated Interpretation';
  confidenceLevel: string; // e.g. "96% Confidence"
  supportingData: string;
  dateGenerated: string;
  source: string;
  recommendedAction?: string;
}

export interface StrategicRecommendation {
  id: string;
  title: string;
  recommendationText: string;
  reason: string;
  supportingData: string;
  confidenceScore: number;
  requiresHumanApproval: true;
  status: 'Pending Review' | 'Approved' | 'Dismissed';
  suggestedBy: string;
}

export interface OperationalAlertItem {
  id: string;
  type: 'Informational' | 'Warning' | 'Important' | 'Critical';
  title: string;
  description: string;
  affectedBranch?: string;
  timestamp: string;
  actionRequired?: string;
}

export interface ReportConfig {
  id: string;
  title: string;
  dataSource: 'Students' | 'Attendance' | 'Financial' | 'Course' | 'Teacher' | 'Branch' | 'Inventory' | 'Store' | 'Operational' | 'Learning';
  metrics: string[];
  dimensions: string[];
  filters: Record<string, any>;
  dateRange: 'Today' | 'Yesterday' | 'This Week' | 'Last Week' | 'This Month' | 'Last Month' | 'This Quarter' | 'This Year' | 'Custom Range';
  branchFilter: string;
  visualization: 'Table' | 'Bar Chart' | 'Line Chart' | 'Pie Chart' | 'Area Chart' | 'KPI Cards';
  exportFormat?: 'PDF' | 'Excel' | 'CSV' | 'Print';
  scheduledFrequency?: 'None' | 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Yearly';
  recipients?: string[];
  createdBy: string;
  createdAt: string;
}

export interface GeneratedReportRecord {
  id: string;
  reportTitle: string;
  generatedBy: string;
  generatedRole: string;
  generatedDate: string;
  reportType: string;
  status: 'Completed' | 'Processing' | 'Failed';
  downloadUrl?: string;
  dataPeriod: string;
  filtersApplied: string;
  recordsCount: number;
}

// Phase 15 Events, Competitions, Certificates, Achievements & Graduation Interfaces
export type EventTypeCategory =
  | 'Concert'
  | 'Student Performance'
  | 'Begena Performance'
  | 'Krar Performance'
  | 'Music Workshop'
  | 'Masterclass'
  | 'Competition'
  | 'Graduation'
  | 'Certificate Ceremony'
  | 'Church Event'
  | 'Cultural Event'
  | 'Open Day'
  | 'Exhibition'
  | 'Community Event'
  | 'Special Event';

export type EventStatusType =
  | 'Draft'
  | 'Published'
  | 'Registration Open'
  | 'Registration Closed'
  | 'Upcoming'
  | 'Ongoing'
  | 'Completed'
  | 'Cancelled'
  | 'Postponed'
  | 'Archived';

export type EventVisibilityType =
  | 'Public'
  | 'Students Only'
  | 'Parents Only'
  | 'Teachers Only'
  | 'Staff Only'
  | 'Specific Branch'
  | 'Specific Course'
  | 'Specific Level'
  | 'Specific Class'
  | 'Invite Only';

export interface EventAgendaItem {
  id: string;
  time: string;
  activity: string;
  speakerOrPerformer: string;
  location: string;
  durationMinutes: number;
}

export interface EventPerformerSlot {
  id: string;
  order: number;
  performerName: string;
  studentId?: string;
  teacherId?: string;
  groupName?: string;
  instrument: string;
  songOrMezmurTitle: string;
  durationMinutes: number;
  notes?: string;
}

export interface EventRegistrationTicket {
  id: string;
  eventId: string;
  eventTitle: string;
  ticketNumber: string; // e.g. ABS-TKT-2026-9021
  participantName: string;
  participantPhone: string;
  participantEmail: string;
  participantRole: 'Student' | 'Parent' | 'Teacher' | 'Staff' | 'Founder' | 'Guest' | 'Performer' | 'Speaker' | 'Volunteer' | 'Judge';
  studentId?: string;
  branchName: string;
  courseName?: string;
  qrCodeData: string;
  isCheckedIn: boolean;
  checkedInAt?: string;
  checkedInBy?: string;
  registeredAt: string;
  status: 'Registered' | 'Checked In' | 'Waitlisted' | 'Cancelled' | 'Absent';
}

export interface EventWaitlistItem {
  id: string;
  eventId: string;
  position: number;
  name: string;
  phone: string;
  email: string;
  registeredDate: string;
  status: 'Waiting' | 'Notified' | 'Accepted' | 'Expired';
}

export interface ComprehensiveEvent {
  id: string;
  title: string;
  description: string;
  fullDescription: string;
  coverImage: string;
  eventType: EventTypeCategory;
  branchId: string;
  branchName: string;
  location: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  organizer: string;
  maxCapacity: number;
  registeredCount: number;
  waitlistCount: number;
  registrationRequired: boolean;
  visibility: EventVisibilityType;
  status: EventStatusType;
  agenda: EventAgendaItem[];
  performers: EventPerformerSlot[];
  galleryImages: string[];
  videos?: string[];
  budgetETB?: number;
  actualExpensesETB?: number;
  sponsorshipAmountETB?: number;
  sponsors?: { name: string; tier: string; logoUrl?: string }[];
  feedbackList?: { userName: string; rating: number; comment: string; date: string }[];
}

export interface CompetitionCriterion {
  id: string;
  name: string; // e.g. "Technique", "Timing", "Tone", "Musicality", "Stage Presence"
  maxScore: number;
  weightPercent: number;
  description: string;
}

export interface CompetitionJudge {
  id: string;
  name: string;
  titleOrRole: string;
  expertise: string;
  avatar: string;
}

export interface CompetitionSubmission {
  id: string;
  competitionId: string;
  studentId: string;
  studentName: string;
  studentAvatar?: string;
  branchName: string;
  instrument: string;
  level: string;
  teacherName: string;
  performanceTitle: string;
  videoUrl?: string;
  audioUrl?: string;
  description: string;
  submittedAt: string;
  status: 'Submitted' | 'Under Review' | 'Scored' | 'Disqualified';
  scores?: {
    judgeId: string;
    judgeName: string;
    scoresByCriterion: Record<string, number>; // criterionId -> score
    totalScore: number;
    comments?: string;
  }[];
  finalScore?: number;
  rankPosition?: number;
  awardCategory?: 'Winner' | '1st Place' | '2nd Place' | '3rd Place' | 'Best Technique' | 'Best New Talent' | 'Special Recognition' | 'Participant';
}

export interface CompetitionItem {
  id: string;
  title: string;
  description: string;
  instrumentCategory: 'Begena' | 'Krar' | 'Masenqo' | 'Washint' | 'Vocal' | 'Kebero' | 'All Instruments';
  levelCategory: 'Beginner' | 'Intermediate' | 'Advanced' | 'Open';
  ageGroup: 'Junior (Under 15)' | 'Youth (15-24)' | 'Adult (25+)' | 'All Ages';
  branchId: string;
  branchName: string;
  startDate: string;
  endDate: string;
  registrationDeadline: string;
  rules: string[];
  prizes: string[];
  judges: CompetitionJudge[];
  criteria: CompetitionCriterion[];
  status: 'Draft' | 'Registration Open' | 'Registration Closed' | 'Submissions Review' | 'Live Judging' | 'Results Published' | 'Archived';
  coverImage: string;
}

export interface AchievementBadge {
  id: string;
  name: string; // e.g. "Begena Master Apprentice", "30-Day Practice Streak"
  code: string;
  description: string;
  requirement: string;
  category: 'Learning' | 'Practice' | 'Attendance' | 'Performance' | 'Competition' | 'Community' | 'Leadership' | 'Special Recognition';
  icon: string; // lucide icon identifier or image
  rarity: 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary';
  points: number;
}

export interface EarnedStudentBadge {
  id: string;
  studentId: string;
  studentName: string;
  badgeId: string;
  badgeName: string;
  category: string;
  rarity: string;
  icon: string;
  earnedDate: string;
  awardedBy: 'System Auto-Award' | 'Teacher Verification' | 'Admin Manual Award';
  awardReason?: string;
}

export interface StudentRankProfile {
  studentId: string;
  studentName: string;
  avatar?: string;
  branchName: string;
  currentRank: 'Beginner' | 'Developing' | 'Intermediate' | 'Advanced' | 'Mastery Candidate';
  totalPoints: number;
  badgesEarnedCount: number;
  practiceHoursLogged: number;
  performancesCompleted: number;
  competitionsWon: number;
  attendanceRatePercent: number;
}

export interface CertificateRecord {
  id: string;
  certificateNumber: string; // ABS-CERT-2026-000123
  studentId: string;
  studentName: string;
  studentPhone?: string;
  courseId: string;
  courseName: string;
  instrument: string;
  level: string;
  branchName: string;
  completionDate: string;
  issuedDate: string;
  issuedBy: string;
  authorizedSignature: string; // Deacon Bruk Tesfaye
  qrVerificationUrl: string;
  status: 'Pending Review' | 'Approved' | 'Issued' | 'Active' | 'Revoked' | 'Reissued';
  physicalStatus: 'Not Prepared' | 'Printed' | 'Prepared' | 'Ready for Pickup' | 'Collected' | 'Delivered';
  revocationReason?: string;
  revokedAt?: string;
  revokedBy?: string;
  reissuedAt?: string;
  previousCertificateNumber?: string;
}

export interface GraduationCeremony {
  id: string;
  title: string; // e.g. "Annual Liora Begena Class of 2026 Graduation & Sacred Recital"
  academicYear: string;
  date: string;
  time: string;
  location: string;
  branchName: string;
  coverImage: string;
  organizer: string;
  expectedGraduatesCount: number;
  guestCapacity: number;
  programAgenda: { time: string; item: string; presenter: string }[];
  awardsList: { awardTitle: string; recipientName: string; category: string }[];
  status: 'Upcoming' | 'Ongoing' | 'Completed' | 'Archived';
}

export interface GraduateStudentItem {
  id: string;
  studentId: string;
  studentName: string;
  avatar?: string;
  courseName: string;
  instrument: string;
  level: string;
  branchName: string;
  graduationYear: string;
  certificateNumber: string;
  eligibilityStatus: 'Eligible' | 'Pending Requirements' | 'Not Eligible';
  invitationQrCode: string;
  checkedIn: boolean;
  honors?: string;
}

export interface AlumniProfile {
  id: string;
  studentId: string;
  fullName: string;
  avatar?: string;
  graduationYear: string;
  courseName: string;
  instrument: string;
  branchName: string;
  biography?: string;
  currentOccupation?: string;
  musicalJourney?: string;
  featuredPerformanceUrl?: string;
  socialLinks?: { telegram?: string; youtube?: string; facebook?: string };
  isPublicConsent: boolean;
  isAvailableForMentorship: boolean;
}

export interface MentorshipPair {
  id: string;
  mentorId: string;
  mentorName: string;
  mentorRole: 'Alumni' | 'Teacher';
  studentId: string;
  studentName: string;
  instrument: string;
  startDate: string;
  status: 'Active' | 'Completed' | 'Paused';
  focusArea: string;
}

// Phase 16 Marketing, CRM, Lead Management & Student Acquisition Interfaces
export type LeadStatus =
  | 'New'
  | 'Contacted'
  | 'Interested'
  | 'Qualified'
  | 'Trial Requested'
  | 'Registration Started'
  | 'Registration Completed'
  | 'Payment Pending'
  | 'Enrolled'
  | 'Not Interested'
  | 'Lost'
  | 'Converted';

export type LeadSource =
  | 'Website'
  | 'Instagram'
  | 'TikTok'
  | 'Telegram'
  | 'Facebook'
  | 'Phone'
  | 'Walk-In'
  | 'Referral'
  | 'Event'
  | 'Campaign'
  | 'Teacher Referral'
  | 'Student Referral'
  | 'Google Search'
  | 'YouTube'
  | 'Other';

export type InquiryType =
  | 'Course Inquiry'
  | 'Payment Inquiry'
  | 'Schedule Inquiry'
  | 'Branch Inquiry'
  | 'Online Learning Inquiry'
  | 'Instrument Inquiry'
  | 'General Question'
  | 'Other';

export interface InquiryItem {
  id: string;
  name: string;
  phone: string;
  email: string;
  type: InquiryType;
  courseId?: string;
  courseName?: string;
  preferredBranch?: string;
  preferredContactMethod: 'Phone' | 'SMS' | 'Telegram' | 'Email';
  message: string;
  createdAt: string;
  status: 'New' | 'Assigned' | 'Resolved' | 'Converted to Lead';
  assignedTo?: string;
  assignedToName?: string;
}

export interface LeadActivity {
  id: string;
  leadId: string;
  timestamp: string;
  title: string;
  type:
    | 'Created'
    | 'Call'
    | 'Message'
    | 'Email'
    | 'Note'
    | 'StatusChange'
    | 'CourseViewed'
    | 'InquirySubmitted'
    | 'TrialScheduled'
    | 'RegistrationStarted'
    | 'PaymentSubmitted'
    | 'Converted';
  description: string;
  performedBy: string;
}

export interface LeadItem {
  id: string;
  fullName: string;
  photo?: string;
  gender?: string;
  age?: number;
  phone: string;
  email: string;
  telegramUsername?: string;
  address?: string;
  preferredBranch: string;
  interestedCourse: string;
  interestedInstrument: string;
  interestedLevel: string;
  preferredLearningMode: 'In-Person' | 'Online' | 'Hybrid';
  preferredSchedule: string;
  source: LeadSource;
  notes: string;
  assignedStaffId: string;
  assignedStaffName: string;
  status: LeadStatus;
  createdAt: string;
  lastContact: string;
  nextFollowUp?: string;
  score: number;
  scoreBreakdown: { reason: string; points: number }[];
  prospectStage?:
    | 'New Lead'
    | 'Contacted'
    | 'Interested'
    | 'Qualified'
    | 'Trial / Consultation'
    | 'Registration Started'
    | 'Payment Pending'
    | 'Enrolled';
  convertedStudentId?: string;
}

export interface FollowUpItem {
  id: string;
  leadId: string;
  leadName: string;
  leadPhone: string;
  date: string;
  time: string;
  method: 'Phone' | 'SMS' | 'Telegram' | 'Email' | 'In Person';
  notes: string;
  assignedTo: string;
  assignedToName: string;
  status: 'Pending' | 'Completed' | 'Missed' | 'Rescheduled' | 'Cancelled';
  reminderTiming: '1 Day Before' | '1 Hour Before' | 'Custom';
}

export interface CrmTaskItem {
  id: string;
  title: string;
  leadId?: string;
  leadName?: string;
  assignedTo: string;
  assignedToName: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  dueDate: string;
  status: 'To Do' | 'In Progress' | 'Completed' | 'Overdue';
  type:
    | 'Call Lead'
    | 'Send Information'
    | 'Follow Up'
    | 'Schedule Visit'
    | 'Confirm Registration'
    | 'Confirm Payment'
    | 'Invite to Trial'
    | 'Send Course Details';
}

export interface TrialSessionItem {
  id: string;
  leadId: string;
  leadName: string;
  phone: string;
  instrument: string;
  preferredBranch: string;
  preferredDate: string;
  preferredTime: string;
  status: 'Requested' | 'Approved' | 'Completed' | 'Rescheduled' | 'Cancelled' | 'Registered';
  outcome?: 'Interested' | 'Not Interested' | 'Needs Follow-Up' | 'Registered';
  notes?: string;
}

export interface CampaignItem {
  id: string;
  name: string;
  description: string;
  objective: string;
  type:
    | 'Course Campaign'
    | 'Event Campaign'
    | 'Concert Campaign'
    | 'Enrollment Campaign'
    | 'Holiday Campaign'
    | 'Branch Campaign'
    | 'Special Offer'
    | 'Workshop Campaign';
  startDate: string;
  endDate: string;
  targetAudience: 'Visitors' | 'Leads' | 'Prospects' | 'Students' | 'Parents' | 'Alumni' | 'Specific Branch';
  branchName: string;
  courseName: string;
  channels: ('Website' | 'Telegram' | 'SMS' | 'Email' | 'TikTok' | 'Instagram' | 'Facebook' | 'YouTube' | 'Physical Promotion')[];
  status: 'Draft' | 'Active' | 'Paused' | 'Completed';
  trackingCode: string;
  landingPageUrl: string;
  qrCodeUrl: string;
  metrics: {
    views: number;
    clicks: number;
    inquiries: number;
    leads: number;
    registrations: number;
    payments: number;
    enrollments: number;
    conversions: number;
  };
}

export interface ReferralItem {
  id: string;
  referrerStudentId: string;
  referrerName: string;
  referredPersonName: string;
  referredPersonPhone: string;
  referredPersonEmail: string;
  referralCode: string;
  createdAt: string;
  status: 'Invited' | 'Registered' | 'Enrolled' | 'Reward Issued';
  rewardType?: 'Badge' | 'Achievement' | 'Recognition' | 'Gift';
}

export interface PromoCodeItem {
  id: string;
  code: string;
  description: string;
  startDate: string;
  endDate: string;
  usageLimit: number;
  timesUsed: number;
  courseName: string;
  branchName: string;
  discountType: 'Percentage' | 'Fixed Amount ETB';
  discountAmount: number;
  status: 'Active' | 'Expired' | 'Disabled';
}

export interface MarketingContentItem {
  id: string;
  title: string;
  category:
    | 'Banner'
    | 'Course Promotion'
    | 'Announcement'
    | 'Testimonial'
    | 'Success Story'
    | 'Teacher Feature'
    | 'Student Achievement';
  imageUrl: string;
  publishedAt: string;
  isFeatured: boolean;
  targetBranch: string;
  summary: string;
}

// PHASE 17 AI ASSISTANT & SMART AUTOMATION INTERFACES
export interface AiChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  isAiGenerated?: boolean;
  humanVerified?: boolean;
  sourceCitations?: { title: string; module?: string; url?: string }[];
  confidence?: 'High' | 'Medium' | 'Low';
  suggestedActions?: { label: string; action: string }[];
}

export interface AiQuizQuestion {
  id: string;
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  type: 'Multiple Choice' | 'True/False' | 'Short Answer' | 'Matching';
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Adaptive';
}

export interface AiPracticePlan {
  id: string;
  studentId: string;
  date: string;
  totalMinutes: number;
  level: string;
  focusAreas: string[];
  warmUpMinutes: number;
  techniqueMinutes: number;
  lessonMinutes: number;
  mezmurMinutes: number;
  exercises: { name: string; durationMinutes: number; notes: string }[];
  status: 'Suggested' | 'Accepted' | 'Modified' | 'Completed';
  teacherRecommendation?: string;
}

export interface AutomationRule {
  id: string;
  name: string;
  trigger: string;
  condition: string;
  action: string;
  targetChannel: 'Notification' | 'SMS' | 'Telegram' | 'Task' | 'Email';
  status: 'Active' | 'Paused';
  requiresHumanApproval: boolean;
  triggerCount: number;
  lastTriggered?: string;
}

export interface AiAuditLogItem {
  id: string;
  timestamp: string;
  userName: string;
  userRole: string;
  querySummary: string;
  dataAccessed: string;
  actionSuggested?: string;
  status: 'Approved' | 'Executed' | 'Read Only' | 'Flagged';
}

export interface AiKnowledgeDoc {
  id: string;
  title: string;
  category: 'Policy' | 'Curriculum' | 'Teacher Material' | 'Begena History' | 'FAQ' | 'Instrument Care';
  lastUpdated: string;
  author: string;
  isApproved: boolean;
  contentSnippet: string;
}

export interface StudentGoal {
  id: string;
  title: string;
  targetDate: string;
  progressPercent: number;
  category: 'Practice' | 'Curriculum' | 'Performance' | 'Mezmur';
  streakDays: number;
  status: 'In Progress' | 'Completed';
}






