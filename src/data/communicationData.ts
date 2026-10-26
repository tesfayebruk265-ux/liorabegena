import {
  Conversation,
  ChatMessage,
  CommunityPost,
  PrayerRequest,
  DiscussionThread,
  AnnouncementItem,
  ModerationReport,
  CommunicationCampaign
} from '../types';

export const INITIAL_CONVERSATIONS: Conversation[] = [];

export const INITIAL_CHAT_MESSAGES: { [convId: string]: ChatMessage[] } = {};

export const INITIAL_POSTS: CommunityPost[] = [
  {
    id: 'post-1',
    authorId: 'usr-student-1',
    authorName: 'Bruk Tesfaye',
    authorRole: 'student',
    authorAvatar: '',
    category: 'Practice',
    title: 'Daily Begena Practice — Psalm 23 (Mezmur)',
    content: 'Sharing my day 14 practice recording for Begena Level 1! Focused on smooth transitions between lower strings and resonance control. Guidance from Teacher Bruk is greatly appreciated.',
    mediaUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    mediaType: 'audio',
    practiceMeta: {
      courseName: 'Begena Level 1',
      level: 'Level 1',
      instrument: 'Begena',
      teacherFeedback: {
        teacherName: 'Teacher Bruk Nigussie',
        teacherAvatar: '',
        rating: 5,
        text: 'Beautiful reverence and steady rhythm! Your posture and pluck angle have improved significantly.',
        date: '2 hours ago'
      }
    },
    visibility: 'School',
    timestamp: '3 hours ago',
    likes: ['usr-teacher-1', 'usr-student-2', 'usr-parent-1'],
    comments: [
      {
        id: 'c1',
        postId: 'post-1',
        authorId: 'usr-student-2',
        authorName: 'Marta Abebe',
        authorRole: 'student',
        authorAvatar: '',
        text: 'Inspiring practice Bruk! Keep up the dedication.',
        timestamp: '2 hours ago',
        likes: ['usr-student-1']
      }
    ],
    savesCount: 12,
    reactions: { '👏': 14, '🙏': 22, '❤️': 9 },
    isPinned: false
  },
  {
    id: 'post-2',
    authorId: 'usr-teacher-1',
    authorName: 'Teacher Bruk Nigussie',
    authorRole: 'teacher',
    authorAvatar: '',
    category: 'General',
    title: 'The Spiritual Foundations of the Begena Instrument',
    content: 'The Begena is not merely an instrument of melody; it is an instrument of prayer, contemplation, and spiritual elevation in Ethiopian Orthodox tradition. When plucking each string, remember to align your heart with prayer.',
    mediaUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=800',
    mediaType: 'image',
    visibility: 'Public',
    timestamp: 'Yesterday',
    likes: ['usr-student-1', 'usr-student-2', 'usr-parent-1', 'usr-admin-1'],
    comments: [
      {
        id: 'c2',
        postId: 'post-2',
        authorId: 'usr-parent-1',
        authorName: 'Abebe Worku',
        authorRole: 'parent',
        authorAvatar: '',
        text: 'Thank you for reminding our children of the spiritual dignity of our heritage.',
        timestamp: 'Yesterday 6:00 PM',
        likes: ['usr-teacher-1']
      }
    ],
    savesCount: 38,
    reactions: { '🙏': 45, '❤️': 28 },
    isPinned: true
  }
];

export const INITIAL_PRAYER_REQUESTS: PrayerRequest[] = [
  {
    id: 'pr-1',
    authorId: 'usr-student-2',
    authorName: 'Marta Abebe',
    authorAvatar: '',
    isAnonymous: false,
    title: 'Prayer for Upcoming End of Term Assessment & Peaceful Study',
    description: 'Dear brothers and sisters in learning, please pray for wisdom, peace of heart, and steady hands as we prepare for our Begena Level 1 evaluation next week.',
    category: 'Exam/Learning',
    visibility: 'Public',
    date: '1 day ago',
    prayCount: 34,
    prayedUserIds: ['usr-student-1', 'usr-teacher-1'],
    commentsCount: 6
  },
  {
    id: 'pr-2',
    authorId: 'usr-anon-99',
    authorName: 'Anonymous Community Member',
    authorAvatar: '',
    isAnonymous: true,
    title: 'Prayer for Health and Healing for Family Member',
    description: 'Asking for spiritual prayers and support for a family member undergoing medical treatment. May the Almighty grant strength and complete recovery.',
    category: 'Healing',
    visibility: 'Public',
    date: '2 days ago',
    prayCount: 52,
    prayedUserIds: ['usr-student-1'],
    commentsCount: 11
  }
];

export const INITIAL_DISCUSSIONS: DiscussionThread[] = [
  {
    id: 'disc-1',
    category: 'Begena',
    title: 'How to properly maintain natural sheep-gut strings in dry climate?',
    content: 'Greetings everyone! During dry seasons in Addis Ababa, I notice string tension shifts. What natural oils or techniques does Liora Begena School recommend for gut string preservation?',
    authorId: 'usr-student-1',
    authorName: 'Bruk Tesfaye',
    authorRole: 'student',
    authorAvatar: '',
    views: 142,
    repliesCount: 4,
    likes: ['usr-student-2', 'usr-teacher-1'],
    isPinned: true,
    teacherAnswer: {
      teacherName: 'Teacher Bruk Nigussie',
      teacherAvatar: '',
      answer: 'Apply a microscopic drop of pure olive oil or traditional sesame oil once every 3 weeks along the string length, avoiding excessive oil near the leather bridge (Mebaria). Keep your Begena inside its padded fabric cover when not in use.',
      timestamp: '5 hours ago'
    },
    createdAt: '1 day ago',
    lastActivity: '3 hours ago'
  },
  {
    id: 'disc-2',
    category: 'Church Music',
    title: 'Understanding the Zema modes used in traditional Begena hymns',
    content: 'Can someone explain the connection between Ge’ez, Ezl, and Araray modes when tuning the Begena for specific liturgical feasts?',
    authorId: 'usr-student-2',
    authorName: 'Marta Abebe',
    authorRole: 'student',
    authorAvatar: '',
    views: 98,
    repliesCount: 2,
    likes: ['usr-student-1'],
    createdAt: '2 days ago',
    lastActivity: 'Yesterday'
  }
];

export const INITIAL_ANNOUNCEMENTS: AnnouncementItem[] = [
  {
    id: 'ann-1',
    title: 'URGENT: Hawassa main Branch Schedule Adjustment for Saturday',
    content: 'Due to scheduled city power maintenance on Saturday morning, all morning classes at Hawassa main Branch (Center Point Tower) will shift by 1 hour (starting 10:00 AM instead of 9:00 AM). Online classes remain unaffected.',
    priority: 'Urgent',
    targetAudience: 'Hawassa Branch Students & Parents',
    targetBranch: 'Hawassa main Branch',
    authorName: 'Hawassa Branch Director',
    authorRole: 'branch_manager',
    date: '2026-07-21',
    isRead: false
  },
  {
    id: 'ann-2',
    title: 'Annual Liora Begena School Cultural Exhibition & Mezmur Concert',
    content: 'We are overjoyed to announce our upcoming Annual Exhibition at National Theatre Addis Ababa. All students from Level 1 to Advanced are invited to submit practice recordings for ensemble selection.',
    priority: 'Important',
    targetAudience: 'All School Students, Parents & Staff',
    authorName: 'Founder Bruk Nigussie',
    authorRole: 'founder',
    date: '2026-07-19',
    image: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&q=80&w=800',
    isRead: true
  }
];

export const INITIAL_MODERATION_REPORTS: ModerationReport[] = [
  {
    id: 'rep-1',
    targetType: 'comment',
    targetId: 'c-99',
    reportedUserId: 'usr-bad-1',
    reportedUserName: 'Unverified User',
    reporterId: 'usr-student-1',
    reporterName: 'Bruk Tesfaye',
    reason: 'Spam',
    details: 'User posted external promotional links in practice comments.',
    status: 'Reported',
    createdAt: '2 hours ago',
    contentPreview: 'Check out cheap instruments on telegram link http://...'
  }
];

export const INITIAL_CAMPAIGNS: CommunicationCampaign[] = [
  {
    id: 'camp-1',
    title: 'Hawassa main Branch Saturday Schedule Shift Notice',
    channel: 'SMS',
    targetAudience: 'Hawassa Campus Registered Students',
    status: 'Completed',
    recipientCount: 148,
    sentAt: '2026-07-21 08:30 AM',
    messageText: 'Liora Begena Alert: Hawassa Saturday morning classes move to 10:00 AM due to area power maintenance. Thank you!',
    deliveryRate: 98.6
  },
  {
    id: 'camp-2',
    title: 'National Exhibition Registration Telegram Broadcast',
    channel: 'Telegram',
    targetAudience: 'Liora Begena Official Channel Members',
    status: 'Completed',
    recipientCount: 1250,
    sentAt: '2026-07-19 02:00 PM',
    messageText: '✨ Annual Cultural Exhibition & Concert Registration is now open! Tap link to register your student performance.',
    deliveryRate: 100.0
  }
];

