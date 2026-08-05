import React, { useState } from 'react';
import {
  Users,
  MessageSquare,
  Heart,
  Bookmark,
  Share2,
  Flag,
  Plus,
  Play,
  Pause,
  Award,
  Sparkles,
  Search,
  Filter,
  CheckCircle,
  Clock,
  Shield,
  ThumbsUp,
  UserCheck,
  UserPlus,
  Compass,
  FileText,
  Music,
  Send,
  Lock,
  ChevronRight,
  BookOpen,
  MessageCircle,
  HelpCircle,
  AlertCircle,
  Eye,
  Star,
  Tag,
  Flame,
  Globe,
  Radio,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CommunityPost,
  PrayerRequest,
  DiscussionThread,
  Teacher,
  PageId,
  Language,
  PostComment
} from '../types';
import { useAuth } from '../context/AuthContext';
import {
  INITIAL_POSTS,
  INITIAL_PRAYER_REQUESTS,
  INITIAL_DISCUSSIONS
} from '../data/communicationData';
import { TEACHERS_DATA } from '../data/websiteData';

interface CommunityCenterProps {
  onNavigate: (page: PageId, params?: any) => void;
  lang: Language;
  initialTab?: 'feed' | 'practice' | 'prayer' | 'discussions' | 'teachers' | 'saved' | 'guidelines';
}

export function CommunityCenter({ onNavigate, lang, initialTab = 'feed' }: CommunityCenterProps) {
  const { currentUser, addNotification } = useAuth();

  // Active Tab state
  const [activeTab, setActiveTab] = useState<
    'feed' | 'practice' | 'prayer' | 'discussions' | 'teachers' | 'saved' | 'guidelines'
  >(initialTab);

  // Community Data States
  const [posts, setPosts] = useState<CommunityPost[]>(INITIAL_POSTS);
  const [prayerRequests, setPrayerRequests] = useState<PrayerRequest[]>(INITIAL_PRAYER_REQUESTS);
  const [discussions, setDiscussions] = useState<DiscussionThread[]>(INITIAL_DISCUSSIONS);
  const [followedTeacherIds, setFollowedTeacherIds] = useState<string[]>(['t1']);

  // Filters & Search
  const [feedCategoryFilter, setFeedCategoryFilter] = useState<string>('All');
  const [discussionCategoryFilter, setDiscussionCategoryFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected Detail views
  const [selectedDiscussion, setSelectedDiscussion] = useState<DiscussionThread | null>(null);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

  // Modals
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [isCreatePrayerOpen, setIsCreatePrayerOpen] = useState(false);
  const [isCreateDiscussionOpen, setIsCreateDiscussionOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportingTarget, setReportingTarget] = useState<string | null>(null);

  // Forms State
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostCategory, setNewPostCategory] = useState<'General' | 'Practice' | 'Question' | 'Achievement'>('General');
  const [newPostVisibility, setNewPostVisibility] = useState<'Public' | 'Course' | 'Branch' | 'Private'>('Public');
  const [newPostAudioUrl, setNewPostAudioUrl] = useState('');

  const [newPrayerTitle, setNewPrayerTitle] = useState('');
  const [newPrayerDesc, setNewPrayerDesc] = useState('');
  const [newPrayerCategory, setNewPrayerCategory] = useState<'Healing' | 'Guidance' | 'Gratitude' | 'Exam/Learning' | 'Family' | 'General'>('Exam/Learning');
  const [isPrayerAnonymous, setIsPrayerAnonymous] = useState(false);

  const [newDiscTitle, setNewDiscTitle] = useState('');
  const [newDiscContent, setNewDiscContent] = useState('');
  const [newDiscCategory, setNewDiscCategory] = useState<DiscussionThread['category']>('Begena');

  // Comment input state
  const [commentInputs, setCommentInputs] = useState<{ [postId: string]: string }>({});

  // Audio player mock state
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);

  // ----------------------------------------------------
  // HANDLERS
  // ----------------------------------------------------

  const handleLikePost = (postId: string) => {
    if (!currentUser?.id) return;
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId) return post;
        const hasLiked = post.likes.includes(currentUser.id);
        const newLikes = hasLiked
          ? post.likes.filter((id) => id !== currentUser.id)
          : [...post.likes, currentUser.id];
        return { ...post, likes: newLikes };
      })
    );
  };

  const handleSavePost = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId) return post;
        const newSaved = !post.isSaved;
        if (newSaved) addNotification('Post saved to your bookmarks.', 'system');
        return { ...post, isSaved: newSaved };
      })
    );
  };

  const handleAddComment = (postId: string) => {
    const text = commentInputs[postId];
    if (!text || !text.trim() || !currentUser?.id) return;

    const newComment: PostComment = {
      id: `comm-${Date.now()}`,
      postId,
      authorId: currentUser.id,
      authorName: currentUser.fullName,
      authorRole: currentUser.role,
      authorAvatar: currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
      text,
      timestamp: 'Just now',
      likes: [],
      isTeacherAnswer: currentUser.role === 'teacher'
    };

    setPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId) return post;
        return {
          ...post,
          comments: [...post.comments, newComment]
        };
      })
    );

    setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
  };

  const handlePrayForRequest = (prayerId: string) => {
    if (!currentUser?.id) return;
    setPrayerRequests((prev) =>
      prev.map((pr) => {
        if (pr.id !== prayerId) return pr;
        const hasPrayed = pr.prayedUserIds.includes(currentUser.id);
        const newPrayed = hasPrayed
          ? pr.prayedUserIds.filter((id) => id !== currentUser.id)
          : [...pr.prayedUserIds, currentUser.id];
        return {
          ...pr,
          prayCount: hasPrayed ? pr.prayCount - 1 : pr.prayCount + 1,
          prayedUserIds: newPrayed
        };
      })
    );
  };

  const handleFollowTeacher = (teacherId: string) => {
    setFollowedTeacherIds((prev) =>
      prev.includes(teacherId) ? prev.filter((id) => id !== teacherId) : [...prev, teacherId]
    );
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    const newPost: CommunityPost = {
      id: `post-${Date.now()}`,
      authorId: currentUser?.id || 'usr-me',
      authorName: currentUser?.fullName || 'Me',
      authorRole: currentUser?.role || 'student',
      authorAvatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
      category: newPostCategory,
      content: newPostContent,
      mediaUrl: newPostAudioUrl || undefined,
      mediaType: newPostAudioUrl ? 'audio' : undefined,
      visibility: newPostVisibility,
      timestamp: 'Just now',
      likes: [],
      comments: [],
      savesCount: 0,
      reactions: { '👏': 1, '🙏': 1 }
    };

    setPosts([newPost, ...posts]);
    setIsCreatePostOpen(false);
    setNewPostContent('');
    setNewPostAudioUrl('');
    addNotification('Post created and shared with community!', 'system');
  };

  const handleCreatePrayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPrayerTitle || !newPrayerDesc) return;

    const newPR: PrayerRequest = {
      id: `pr-${Date.now()}`,
      authorId: isPrayerAnonymous ? 'usr-anon' : currentUser?.id || 'usr-me',
      authorName: isPrayerAnonymous ? 'Anonymous Member' : currentUser?.fullName || 'Me',
      authorAvatar: isPrayerAnonymous
        ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200'
        : currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
      isAnonymous: isPrayerAnonymous,
      title: newPrayerTitle,
      description: newPrayerDesc,
      category: newPrayerCategory,
      visibility: 'Public',
      date: 'Just now',
      prayCount: 1,
      prayedUserIds: [currentUser?.id || 'usr-me'],
      commentsCount: 0
    };

    setPrayerRequests([newPR, ...prayerRequests]);
    setIsCreatePrayerOpen(false);
    setNewPrayerTitle('');
    setNewPrayerDesc('');
    addNotification('Prayer request submitted. May God grant strength.', 'system');
  };

  const handleCreateDiscussion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDiscTitle || !newDiscContent) return;

    const newDisc: DiscussionThread = {
      id: `disc-${Date.now()}`,
      category: newDiscCategory,
      title: newDiscTitle,
      content: newDiscContent,
      authorId: currentUser?.id || 'usr-me',
      authorName: currentUser?.fullName || 'Me',
      authorRole: currentUser?.role || 'student',
      authorAvatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
      views: 1,
      repliesCount: 0,
      likes: [],
      createdAt: 'Just now',
      lastActivity: 'Just now'
    };

    setDiscussions([newDisc, ...discussions]);
    setIsCreateDiscussionOpen(false);
    setNewDiscTitle('');
    setNewDiscContent('');
    addNotification('Discussion thread started!', 'system');
  };

  // Filtered lists
  const filteredPosts = posts.filter((post) => {
    if (feedCategoryFilter !== 'All' && post.category !== feedCategoryFilter) return false;
    if (searchQuery) {
      return (
        post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.authorName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-semibold tracking-wide uppercase">
              Abel Begena Community
            </span>
            <span className="text-xs text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded border border-amber-200">
              Spiritual & Educational Social Network
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-amber-950 mt-1">
            Community, Practice Sharing & Prayer Requests
          </h1>
          <p className="text-sm text-stone-600 mt-0.5">
            Share practice recordings, engage in traditional music discussions, and receive verified teacher feedback.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCreatePrayerOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-lg text-xs font-semibold transition"
          >
            <Sparkles className="w-4 h-4 text-amber-800" />
            Submit Prayer Request
          </button>

          <button
            onClick={() => setIsCreatePostOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-amber-800 hover:bg-amber-900 text-white rounded-lg text-xs font-semibold shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            Create Community Post
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto border-b border-stone-200 pb-2 mb-6">
        {[
          { id: 'feed', label: 'Community Feed', icon: Compass },
          { id: 'practice', label: 'Practice Recordings & Reviews', icon: Music },
          { id: 'prayer', label: 'Prayer Requests', icon: Sparkles },
          { id: 'discussions', label: 'Discussion Forum', icon: MessageSquare },
          { id: 'teachers', label: 'Teachers Directory', icon: UserCheck },
          { id: 'saved', label: 'Saved Content', icon: Bookmark },
          { id: 'guidelines', label: 'Community Rules', icon: Shield }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                setSelectedDiscussion(null);
                setSelectedTeacher(null);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition whitespace-nowrap ${
                isActive
                  ? 'bg-amber-800 text-white shadow-xs'
                  : 'text-stone-600 hover:bg-stone-100 bg-white border border-stone-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ========================================================= */}
      {/* 1. COMMUNITY SOCIAL FEED TAB */}
      {/* ========================================================= */}
      {activeTab === 'feed' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Feed Column (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Category Filter & Search */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-stone-200 shadow-2xs">
              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto text-xs">
                {['All', 'General', 'Practice', 'Question', 'Achievement'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFeedCategoryFilter(cat)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
                      feedCategoryFilter === cat
                        ? 'bg-amber-800 text-white'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-48">
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search posts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-none"
                />
              </div>
            </div>

            {/* Posts Feed List */}
            {filteredPosts.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-2xl border border-stone-200 text-stone-500">
                <Compass className="w-10 h-10 mx-auto text-stone-300 mb-2" />
                <p className="text-xs font-semibold text-stone-800">No community posts match your criteria.</p>
                <p className="text-[11px] text-stone-400 mt-1">Be the first to share a practice or thought!</p>
              </div>
            ) : (
              filteredPosts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white rounded-2xl border border-stone-200 p-5 shadow-2xs space-y-4"
                >
                  {/* Author Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={post.authorAvatar}
                        alt={post.authorName}
                        className="w-10 h-10 rounded-full object-cover border border-stone-200"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-stone-900">{post.authorName}</h4>
                          <span className="px-2 py-0.2 bg-amber-100 text-amber-900 rounded text-[10px] font-bold uppercase">
                            {post.authorRole}
                          </span>
                        </div>
                        <p className="text-[10px] text-stone-400">
                          {post.timestamp} • Visibility: <span className="text-stone-600 font-semibold">{post.visibility}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleSavePost(post.id)}
                        className={`p-1.5 rounded-lg transition ${
                          post.isSaved ? 'bg-amber-100 text-amber-800' : 'text-stone-400 hover:bg-stone-100'
                        }`}
                      >
                        <Bookmark className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Title & Body */}
                  <div>
                    {post.title && <h3 className="text-sm font-bold text-stone-900 mb-1">{post.title}</h3>}
                    <p className="text-xs text-stone-700 leading-relaxed whitespace-pre-wrap">{post.content}</p>
                  </div>

                  {/* Media attachment if any */}
                  {post.mediaUrl && (
                    <div className="mt-2">
                      {post.mediaType === 'image' && (
                        <img
                          src={post.mediaUrl}
                          alt="Post attachment"
                          className="rounded-xl max-h-72 object-cover w-full border border-stone-200"
                        />
                      )}
                      {post.mediaType === 'audio' && (
                        <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-center gap-3">
                          <button
                            onClick={() => setPlayingAudioId(playingAudioId === post.id ? null : post.id)}
                            className="w-10 h-10 rounded-full bg-amber-800 text-white flex items-center justify-center shrink-0 shadow-xs"
                          >
                            {playingAudioId === post.id ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                          </button>
                          <div className="flex-1">
                            <h5 className="text-xs font-bold text-amber-950">Audio Recording</h5>
                            <div className="h-1.5 bg-amber-200 rounded-full overflow-hidden mt-1">
                              <div
                                className={`h-full bg-amber-800 ${
                                  playingAudioId === post.id ? 'w-2/3 animate-pulse' : 'w-1/4'
                                }`}
                              ></div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Teacher Feedback Banner if available */}
                  {post.practiceMeta?.teacherFeedback && (
                    <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-700 shrink-0" />
                          <span className="text-xs font-bold text-emerald-950">Verified Teacher Practice Feedback</span>
                        </div>
                        <span className="text-[10px] text-emerald-800 font-semibold">
                          ⭐ {post.practiceMeta.teacherFeedback.rating}/5 Rating
                        </span>
                      </div>

                      <p className="text-xs text-emerald-900 italic">
                        "{post.practiceMeta.teacherFeedback.text}"
                      </p>

                      <div className="flex items-center gap-2 pt-1 text-[10px] text-emerald-800 font-medium">
                        <img
                          src={post.practiceMeta.teacherFeedback.teacherAvatar}
                          alt="Teacher"
                          className="w-5 h-5 rounded-full object-cover"
                        />
                        <span>
                          Reviewed by <strong>{post.practiceMeta.teacherFeedback.teacherName}</strong>
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Post Actions Bar */}
                  <div className="flex items-center justify-between pt-3 border-t border-stone-100 text-xs text-stone-600">
                    <button
                      onClick={() => handleLikePost(post.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                        post.likes.includes(currentUser?.id || '')
                          ? 'bg-red-50 text-red-600 font-bold'
                          : 'hover:bg-stone-100'
                      }`}
                    >
                      <Heart className="w-4 h-4 fill-current" />
                      <span>{post.likes.length} Likes</span>
                    </button>

                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-4 h-4 text-stone-400" />
                      <span>{post.comments.length} Comments</span>
                    </span>

                    <span className="flex items-center gap-1">
                      <Bookmark className="w-4 h-4 text-stone-400" />
                      <span>{post.savesCount} Saved</span>
                    </span>
                  </div>

                  {/* Comment Thread */}
                  {post.comments.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-stone-100 bg-stone-50/50 p-3 rounded-xl">
                      {post.comments.map((comm) => (
                        <div key={comm.id} className="flex items-start gap-2 text-xs">
                          <img
                            src={comm.authorAvatar}
                            alt={comm.authorName}
                            className="w-6 h-6 rounded-full object-cover mt-0.5"
                          />
                          <div className="bg-white p-2.5 rounded-xl border border-stone-200 flex-1">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-stone-900 text-[11px]">{comm.authorName}</span>
                              <span className="text-[9px] text-stone-400">{comm.timestamp}</span>
                            </div>
                            <p className="text-stone-700 text-[11px] mt-0.5">{comm.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Comment Input */}
                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="text"
                      placeholder="Write an encouraging comment..."
                      value={commentInputs[post.id] || ''}
                      onChange={(e) =>
                        setCommentInputs({ ...commentInputs, [post.id]: e.target.value })
                      }
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleAddComment(post.id);
                      }}
                      className="flex-1 text-xs px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none"
                    />
                    <button
                      onClick={() => handleAddComment(post.id)}
                      className="px-3 py-2 bg-amber-800 hover:bg-amber-900 text-white rounded-lg text-xs font-semibold"
                    >
                      Comment
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Side Info Column (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Quick Prayer Widget */}
            <div className="bg-amber-900 text-amber-50 p-5 rounded-2xl space-y-3 shadow-md border border-amber-800">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 bg-amber-800 text-amber-200 text-[10px] font-bold uppercase rounded-full">
                  Spiritual Community
                </span>
                <Sparkles className="w-4 h-4 text-amber-300" />
              </div>
              <h3 className="font-bold text-sm text-white">Community Prayer Requests</h3>
              <p className="text-xs text-amber-200/90 leading-relaxed">
                "Where two or three gather in prayer, there am I with them." Share prayer intentions or support fellow members.
              </p>
              <button
                onClick={() => setActiveTab('prayer')}
                className="w-full py-2 bg-amber-50 hover:bg-amber-100 text-amber-950 font-bold rounded-xl text-xs transition"
              >
                View Active Prayer Requests ({prayerRequests.length})
              </button>
            </div>

            {/* Trending Discussions Widget */}
            <div className="bg-white p-5 rounded-2xl border border-stone-200 space-y-3">
              <h3 className="font-bold text-sm text-stone-900 flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-800" />
                Trending Music Discussions
              </h3>
              <div className="space-y-3 divide-y divide-stone-100">
                {discussions.slice(0, 3).map((disc) => (
                  <div
                    key={disc.id}
                    onClick={() => {
                      setActiveTab('discussions');
                      setSelectedDiscussion(disc);
                    }}
                    className="pt-2 cursor-pointer hover:bg-stone-50 p-1.5 rounded-lg transition"
                  >
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded">
                      {disc.category}
                    </span>
                    <h4 className="text-xs font-bold text-stone-800 mt-1 line-clamp-2">{disc.title}</h4>
                    <span className="text-[10px] text-stone-400 mt-0.5 block">
                      {disc.repliesCount} Replies • {disc.views} Views
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. PRACTICE RECORDINGS & TEACHER REVIEWS TAB */}
      {/* ========================================================= */}
      {activeTab === 'practice' && (
        <div className="space-y-6">
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-amber-950">Student Practice Sharing Hub</h3>
              <p className="text-xs text-amber-800 mt-0.5">
                Upload your audio/video practice files for structured feedback from authorized school teachers.
              </p>
            </div>
            <button
              onClick={() => setIsCreatePostOpen(true)}
              className="px-4 py-2 bg-amber-800 hover:bg-amber-900 text-white rounded-lg text-xs font-semibold shadow-xs"
            >
              Upload Practice File
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {posts
              .filter((p) => p.category === 'Practice')
              .map((post) => (
                <div key={post.id} className="bg-white p-5 rounded-2xl border border-stone-200 space-y-4 shadow-2xs">
                  <div className="flex items-center gap-3">
                    <img
                      src={post.authorAvatar}
                      alt={post.authorName}
                      className="w-10 h-10 rounded-full object-cover border border-stone-200"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-stone-900">{post.authorName}</h4>
                      <span className="text-[10px] text-stone-400">{post.timestamp}</span>
                    </div>
                  </div>

                  <h3 className="text-xs font-bold text-stone-900">{post.title || 'Practice Submission'}</h3>
                  <p className="text-xs text-stone-600">{post.content}</p>

                  {/* Audio Player Card */}
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center gap-3">
                    <button
                      onClick={() => setPlayingAudioId(playingAudioId === post.id ? null : post.id)}
                      className="w-10 h-10 rounded-full bg-amber-800 text-white flex items-center justify-center shrink-0"
                    >
                      {playingAudioId === post.id ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                    </button>
                    <div className="flex-1">
                      <span className="text-xs font-bold text-stone-800 block">Begena Practice Sample</span>
                      <div className="h-1.5 bg-stone-200 rounded-full overflow-hidden mt-1">
                        <div
                          className={`h-full bg-amber-800 ${
                            playingAudioId === post.id ? 'w-2/3 animate-pulse' : 'w-1/3'
                          }`}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Feedback Box */}
                  {post.practiceMeta?.teacherFeedback ? (
                    <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-950 space-y-1">
                      <div className="flex items-center justify-between font-bold">
                        <span>Teacher Feedback ({post.practiceMeta.teacherFeedback.teacherName})</span>
                        <span>⭐ {post.practiceMeta.teacherFeedback.rating}/5</span>
                      </div>
                      <p className="italic">"{post.practiceMeta.teacherFeedback.text}"</p>
                    </div>
                  ) : (
                    <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-center justify-between">
                      <span>Pending Teacher Review...</span>
                      <span className="text-[10px] font-semibold bg-amber-200 px-2 py-0.5 rounded">In Queue</span>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. PRAYER REQUESTS TAB */}
      {/* ========================================================= */}
      {activeTab === 'prayer' && (
        <div className="space-y-6">
          <div className="p-4 bg-amber-900 text-amber-50 rounded-2xl flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">Prayer Requests & Spiritual Intentions</h3>
              <p className="text-xs text-amber-200 mt-0.5">
                Join together in prayer. "Pray" for intentions or submit your own request.
              </p>
            </div>
            <button
              onClick={() => setIsCreatePrayerOpen(true)}
              className="px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-950 font-bold rounded-lg text-xs shadow-xs"
            >
              + Submit Prayer Request
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {prayerRequests.map((pr) => (
              <div key={pr.id} className="bg-white p-5 rounded-2xl border border-stone-200 space-y-4 shadow-2xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={pr.authorAvatar}
                      alt={pr.authorName}
                      className="w-10 h-10 rounded-full object-cover border border-stone-200"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-stone-900">
                        {pr.isAnonymous ? 'Anonymous Community Member' : pr.authorName}
                      </h4>
                      <span className="text-[10px] text-stone-400">{pr.date}</span>
                    </div>
                  </div>

                  <span className="px-2.5 py-0.5 bg-amber-100 text-amber-900 text-[10px] font-bold rounded-full">
                    {pr.category}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-stone-900">{pr.title}</h3>
                <p className="text-xs text-stone-600 leading-relaxed">{pr.description}</p>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                  <button
                    onClick={() => handlePrayForRequest(pr.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
                      pr.prayedUserIds.includes(currentUser?.id || '')
                        ? 'bg-amber-800 text-white shadow-xs'
                        : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200'
                    }`}
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{pr.prayedUserIds.includes(currentUser?.id || '') ? 'You Prayed' : 'Pray for This'}</span>
                  </button>

                  <span className="text-xs text-stone-500 font-medium">
                    🔥 <strong>{pr.prayCount}</strong> people prayed for this
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 4. DISCUSSION FORUM TAB */}
      {/* ========================================================= */}
      {activeTab === 'discussions' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-stone-200">
            <div>
              <h3 className="text-sm font-bold text-stone-900">Ethiopian Traditional Music Discussions</h3>
              <p className="text-xs text-stone-500">Ask questions, discuss tuning modes, and share knowledge.</p>
            </div>
            <button
              onClick={() => setIsCreateDiscussionOpen(true)}
              className="px-4 py-2 bg-amber-800 hover:bg-amber-900 text-white font-semibold rounded-lg text-xs"
            >
              Start New Thread
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-stone-200 divide-y divide-stone-100 overflow-hidden">
            {discussions.map((disc) => (
              <div key={disc.id} className="p-5 hover:bg-stone-50 transition space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 bg-amber-100 text-amber-900 rounded text-[10px] font-bold">
                    {disc.category}
                  </span>
                  <span className="text-[10px] text-stone-400">Created {disc.createdAt}</span>
                </div>

                <h3 className="text-sm font-bold text-stone-900">{disc.title}</h3>
                <p className="text-xs text-stone-600 line-clamp-2">{disc.content}</p>

                {/* Verified Teacher Answer highlight if available */}
                {disc.teacherAnswer && (
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-950 space-y-1">
                    <div className="flex items-center gap-2 font-bold text-emerald-900">
                      <CheckCircle className="w-4 h-4 text-emerald-700" />
                      <span>Verified Teacher Answer ({disc.teacherAnswer.teacherName})</span>
                    </div>
                    <p className="italic text-[11px]">"{disc.teacherAnswer.answer}"</p>
                  </div>
                )}

                <div className="flex items-center justify-between text-[11px] text-stone-500 pt-2">
                  <span>Author: <strong>{disc.authorName}</strong></span>
                  <span>{disc.repliesCount} Replies • {disc.views} Views</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 5. TEACHERS DIRECTORY TAB */}
      {/* ========================================================= */}
      {activeTab === 'teachers' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TEACHERS_DATA.map((teacher) => {
            const isFollowed = followedTeacherIds.includes(teacher.id);
            return (
              <div key={teacher.id} className="bg-white rounded-2xl border border-stone-200 p-5 space-y-4 shadow-2xs text-xs">
                <div className="flex items-center gap-3">
                  <img
                    src={teacher.photo}
                    alt={teacher.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-amber-800"
                  />
                  <div>
                    <h3 className="font-bold text-sm text-stone-900">{teacher.name}</h3>
                    <p className="text-amber-800 font-semibold">{teacher.instrument} Master</p>
                    <p className="text-[10px] text-stone-400 mt-0.5">{teacher.experience} Teaching Experience</p>
                  </div>
                </div>

                <p className="text-stone-600 line-clamp-3 leading-relaxed">{teacher.bio}</p>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                  <button
                    onClick={() => handleFollowTeacher(teacher.id)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                      isFollowed
                        ? 'bg-amber-100 text-amber-900'
                        : 'bg-amber-800 text-white hover:bg-amber-900'
                    }`}
                  >
                    {isFollowed ? <UserCheck className="w-3.5 h-3.5" /> : <UserPlus className="w-3.5 h-3.5" />}
                    <span>{isFollowed ? 'Following' : 'Follow Teacher'}</span>
                  </button>

                  <button
                    onClick={() => onNavigate('messages')}
                    className="px-3.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-semibold"
                  >
                    Direct Message
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================= */}
      {/* 6. SAVED CONTENT TAB */}
      {/* ========================================================= */}
      {activeTab === 'saved' && (
        <div className="space-y-6">
          <h3 className="text-base font-bold text-stone-900">Your Bookmarked Community Posts</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {posts
              .filter((p) => p.isSaved)
              .map((post) => (
                <div key={post.id} className="bg-white p-5 rounded-2xl border border-stone-200 space-y-3">
                  <h4 className="font-bold text-stone-900 text-xs">{post.authorName}</h4>
                  <p className="text-xs text-stone-600">{post.content}</p>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 7. COMMUNITY RULES & GUIDELINES TAB */}
      {/* ========================================================= */}
      {activeTab === 'guidelines' && (
        <div className="bg-white p-6 rounded-2xl border border-stone-200 max-w-3xl mx-auto space-y-4 text-xs">
          <h2 className="text-lg font-bold text-amber-950 flex items-center gap-2">
            <Shield className="w-5 h-5 text-amber-800" />
            Abel Begena Community Rules & Guidelines
          </h2>
          <p className="text-stone-600">
            Our platform is dedicated to sacred music, spiritual heritage, and respectful learning.
          </p>

          <ul className="space-y-3 list-disc pl-5 text-stone-700 leading-relaxed">
            <li>
              <strong>Respect Church & Spiritual Heritage:</strong> Maintain dignity and reverence when discussing sacred hymns and Ethiopian Orthodox traditions.
            </li>
            <li>
              <strong>Encouraging Feedback:</strong> When listening to practice recordings, offer constructive, kind words.
            </li>
            <li>
              <strong>No Spam or Commercial Exploitation:</strong> Advertising unapproved products or spamming links is strictly prohibited.
            </li>
            <li>
              <strong>Protect Student Safety:</strong> Unsolicited messaging to minor students without parent oversight is prohibited.
            </li>
          </ul>
        </div>
      )}

      {/* CREATE POST MODAL */}
      {isCreatePostOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-stone-200 text-xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <h3 className="font-bold text-stone-900 text-sm">Create Community Post</h3>
              <button onClick={() => setIsCreatePostOpen(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-3">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Post Category</label>
                <select
                  value={newPostCategory}
                  onChange={(e) => setNewPostCategory(e.target.value as any)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                >
                  <option value="General">General Thought / Music Article</option>
                  <option value="Practice">Practice Recording Share</option>
                  <option value="Question">Learning Question</option>
                  <option value="Achievement">Level Achievement</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Content *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Share your practice notes, question, or thought..."
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                />
              </div>

              {newPostCategory === 'Practice' && (
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Audio File URL (Optional Mock)</label>
                  <input
                    type="text"
                    placeholder="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
                    value={newPostAudioUrl}
                    onChange={(e) => setNewPostAudioUrl(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                  />
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreatePostOpen(false)}
                  className="px-4 py-2 border border-stone-300 rounded-lg font-semibold text-stone-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-800 hover:bg-amber-900 text-white rounded-lg font-semibold shadow-xs"
                >
                  Publish Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE PRAYER MODAL */}
      {isCreatePrayerOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-stone-200 text-xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <h3 className="font-bold text-amber-950 text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-800" />
                Submit Prayer Request
              </h3>
              <button onClick={() => setIsCreatePrayerOpen(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreatePrayer} className="space-y-3">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Prayer Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Prayer for Healing & Health"
                  value={newPrayerTitle}
                  onChange={(e) => setNewPrayerTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Prayer Category</label>
                <select
                  value={newPrayerCategory}
                  onChange={(e) => setNewPrayerCategory(e.target.value as any)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                >
                  <option value="Exam/Learning">Exam / Learning Intentions</option>
                  <option value="Healing">Health & Healing</option>
                  <option value="Guidance">Spiritual Guidance</option>
                  <option value="Family">Family Well-being</option>
                  <option value="Gratitude">Thanksgiving & Gratitude</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Description *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Explain your intention so community members can keep you in prayer..."
                  value={newPrayerDesc}
                  onChange={(e) => setNewPrayerDesc(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="anonCheck"
                  checked={isPrayerAnonymous}
                  onChange={(e) => setIsPrayerAnonymous(e.target.checked)}
                  className="w-4 h-4 text-amber-800 rounded"
                />
                <label htmlFor="anonCheck" className="text-stone-700 font-semibold cursor-pointer">
                  Post anonymously (hide my name & avatar)
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreatePrayerOpen(false)}
                  className="px-4 py-2 border border-stone-300 rounded-lg font-semibold text-stone-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-800 hover:bg-amber-900 text-white rounded-lg font-semibold shadow-xs"
                >
                  Submit Prayer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE DISCUSSION MODAL */}
      {isCreateDiscussionOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-stone-200 text-xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <h3 className="font-bold text-stone-900 text-sm">Start Discussion Thread</h3>
              <button onClick={() => setIsCreateDiscussionOpen(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateDiscussion} className="space-y-3">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Topic Category</label>
                <select
                  value={newDiscCategory}
                  onChange={(e) => setNewDiscCategory(e.target.value as any)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                >
                  <option value="Begena">Begena Instrument</option>
                  <option value="Krar">Krar Instrument</option>
                  <option value="Church Music">Church Music & Zema</option>
                  <option value="Music Theory">Traditional Music Theory</option>
                  <option value="Practice">Practice Techniques</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Thread Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Best posture techniques for long Begena practice sessions"
                  value={newDiscTitle}
                  onChange={(e) => setNewDiscTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Discussion Content *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Elaborate on your question or observation..."
                  value={newDiscContent}
                  onChange={(e) => setNewDiscContent(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateDiscussionOpen(false)}
                  className="px-4 py-2 border border-stone-300 rounded-lg font-semibold text-stone-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-800 hover:bg-amber-900 text-white rounded-lg font-semibold shadow-xs"
                >
                  Start Thread
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

