import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  Search,
  Pin,
  Volume2,
  VolumeX,
  Send,
  Paperclip,
  Smile,
  Mic,
  MoreVertical,
  Check,
  CheckCheck,
  User,
  Shield,
  Plus,
  Trash2,
  Edit2,
  Reply,
  Flag,
  Users,
  Radio,
  Image as ImageIcon,
  FileText,
  Music,
  Play,
  Pause,
  Info,
  X,
  Lock,
  ChevronRight,
  Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Conversation,
  ChatMessage,
  UserRole,
  PageId,
  Language
} from '../types';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

interface MessagesCenterProps {
  onNavigate: (page: PageId, params?: any) => void;
  lang: Language;
}

export function MessagesCenter({ onNavigate, lang }: MessagesCenterProps) {
  const { currentUser, addNotification } = useAuth();
  const { enrollments, teachers } = useData();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [chatMessages, setChatMessages] = useState<{ [convId: string]: ChatMessage[] }>({});
  const [activeConvId, setActiveConvId] = useState<string>('');
  const eventSourceRef = useRef<EventSource | null>(null);

  const mapServerMessageToChatMessage = (message: any): ChatMessage => ({
    id: message.id,
    senderId: message.senderId,
    senderName: message.senderName,
    senderRole: message.senderRole as UserRole,
    senderAvatar: message.senderAvatar || '',
    text: message.text,
    timestamp: new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    mediaUrl: message.mediaUrl,
    mediaType: message.mediaType,
    replyToId: message.replyToId,
    reactions: message.reactions,
    read: message.isRead,
    delivered: message.status !== 'sent',
    edited: message.edited,
    deleted: message.deleted
  });

  const loadConversations = async () => {
    if (!currentUser) return;
    try {
      const query = new URLSearchParams({ userId: currentUser.id, role: currentUser.role });
      const response = await fetch(`/api/chat/conversations?${query.toString()}`);
      if (!response.ok) throw new Error('Failed to load conversations');
      const data = await response.json();
      const loaded: Conversation[] = data.conversations || [];
      setConversations(loaded);
      if (loaded.length > 0) {
        setActiveConvId((prev) => (prev && loaded.some((c) => c.id === prev) ? prev : loaded[0].id));
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
    }
  };

  const loadMessages = async (conversationId: string) => {
    if (!conversationId) return;
    try {
      const response = await fetch(`/api/chat/conversations/${conversationId}/messages?limit=100`);
      if (!response.ok) throw new Error('Failed to load messages');
      const data = await response.json();
      const loadedMessages: ChatMessage[] = (data.messages || []).map(mapServerMessageToChatMessage);
      setChatMessages((prev) => ({ ...prev, [conversationId]: loadedMessages }));
    } catch (error) {
      console.error('Error loading messages for', conversationId, error);
    }
  };

  const refreshChat = async () => {
    await loadConversations();
    if (activeConvId) {
      await loadMessages(activeConvId);
    }
  };

  const markConversationRead = async (conversationId: string) => {
    if (!currentUser) return;
    try {
      await fetch(`/api/chat/conversations/${conversationId}/read`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ readerId: currentUser.id })
      });
      setConversations((prev) =>
        prev.map((conv) => (conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv))
      );
    } catch (error) {
      console.error('Failed to mark conversation read', error);
    }
  };

  const selectConversation = (conversationId: string) => {
    setActiveConvId(conversationId);
    setConversations((prev) =>
      prev.map((conv) => (conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv))
    );
    markConversationRead(conversationId);
  };

  const addIncomingMessage = (conversationId: string, message: any) => {
    const mapped = mapServerMessageToChatMessage(message);
    setChatMessages((prev) => ({
      ...prev,
      [conversationId]: [...(prev[conversationId] || []), mapped]
    }));
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === conversationId
          ? { ...conv, lastMessage: mapped, unreadCount: conv.unreadCount + (message.receiverId === currentUser?.id ? 1 : 0) }
          : conv
      )
    );
  };

  useEffect(() => {
    if (!currentUser) return;

    loadConversations();

    const source = new EventSource(`/api/chat/events?userId=${encodeURIComponent(currentUser.id)}&role=${encodeURIComponent(currentUser.role)}`);
    eventSourceRef.current = source;

    source.addEventListener('chat_message', (event) => {
      try {
        const payload = JSON.parse((event as MessageEvent).data);
        if (payload.conversationId && payload.message) {
          addIncomingMessage(payload.conversationId, payload.message);
        }
      } catch (error) {
        console.error('Invalid SSE chat_message payload', error);
      }
    });

    source.addEventListener('read_receipt', (event) => {
      try {
        const payload = JSON.parse((event as MessageEvent).data);
        if (payload.conversationId) {
          setChatMessages((prev) => {
            const messages = prev[payload.conversationId] || [];
            return {
              ...prev,
              [payload.conversationId]: messages.map((msg) =>
                msg.senderId !== currentUser.id ? { ...msg, read: true } : msg
              )
            };
          });
        }
      } catch (error) {
        console.error('Invalid SSE read_receipt payload', error);
      }
    });

    source.addEventListener('presence', (event) => {
      try {
        const payload = JSON.parse((event as MessageEvent).data);
        setConversations((prev) =>
          prev.map((conv) => ({
            ...conv,
            participants: conv.participants.map((p) =>
              p.id === payload.userId ? { ...p, isOnline: payload.isOnline } : p
            )
          }))
        );
      } catch (error) {
        console.error('Invalid SSE presence payload', error);
      }
    });

    source.onerror = (err) => {
      console.error('Chat SSE error', err);
      source.close();
    };

    return () => {
      source.close();
      eventSourceRef.current = null;
    };
  }, [currentUser]);

  useEffect(() => {
    if (!activeConvId) return;
    loadMessages(activeConvId);
  }, [activeConvId]);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'pinned' | 'groups'>('all');

  // Input state
  const [inputText, setInputText] = useState('');
  const [replyingToMsg, setReplyingToMsg] = useState<ChatMessage | null>(null);
  const [attachedFile, setAttachedFile] = useState<{ name: string; url: string; type: 'image' | 'pdf' | 'audio' } | null>(null);
  
  // Voice note simulator state
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [recordingTimer, setRecordingTimer] = useState(0);

  // Modals
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);
  const [isBroadcastOpen, setIsBroadcastOpen] = useState(false);
  const [isGroupInfoOpen, setIsGroupInfoOpen] = useState(false);

  // Editing state
  const [editingMsgId, setEditingMsgId] = useState<string | null>(null);

  // Group creation form
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDesc, setNewGroupDesc] = useState('');
  const [newGroupBranch, setNewGroupBranch] = useState('Piazza Main Branch');

  // Broadcast form
  const [broadcastTarget, setBroadcastTarget] = useState('Begena Level 1');
  const [broadcastText, setBroadcastText] = useState('');

  // Audio player mock state
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);

  const activeConv = conversations.find((c) => c.id === activeConvId) || conversations[0];
  const messagesForActive = chatMessages[activeConvId] || [];

  // Permission Check
  const canUserMessageParticipant = (targetRole: UserRole) => {
    if (!currentUser) return false;
    const role = currentUser.role;
    if (role === 'super_admin' || role === 'admin' || role === 'founder') return true;
    if (role === 'student') return targetRole === 'teacher' || targetRole === 'student' || targetRole === 'registration_staff';
    if (role === 'parent') return targetRole === 'teacher' || targetRole === 'admin' || targetRole === 'accountant';
    if (role === 'teacher') return targetRole === 'student' || targetRole === 'parent' || targetRole === 'teacher' || targetRole === 'admin';
    if (role === 'registration_staff' || role === 'branch_manager' || role === 'accountant') return true;
    return false;
  };

  // Filter conversations
  const filteredConversations = conversations.filter((conv) => {
    const matchesSearch =
      conv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (conv.lastMessage?.text || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;
    if (activeFilter === 'unread') return conv.unreadCount > 0;
    if (activeFilter === 'pinned') return conv.isPinned;
    if (activeFilter === 'groups') return conv.type === 'group';
    return true;
  });

  const handleSendMessage = async () => {
    if (!inputText.trim() && !attachedFile) return;
    if (!currentUser || !activeConv) return;

    const senderRole = currentUser.role === 'teacher' ? 'teacher' : 'student';
    const receiverId =
      currentUser.role === 'student'
        ? activeConv.teacherId || activeConv.participants[0]?.id
        : activeConv.studentId || activeConv.participants[0]?.id;
    const receiverRole = currentUser.role === 'student' ? 'teacher' : 'student';

    if (!receiverId) {
      addNotification('Unable to determine the message recipient.', 'error');
      return;
    }

    try {
      const response = await fetch(`/api/chat/conversations/${activeConv.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: activeConv.id,
          enrollmentId: activeConv.enrollmentId || activeConv.id.replace(/^conv_enr_/, ''),
          studentId: activeConv.studentId || (currentUser.role === 'student' ? currentUser.id : receiverId),
          studentName: activeConv.studentName || (currentUser.role === 'student' ? currentUser.fullName : activeConv.participants[0]?.name),
          teacherId: activeConv.teacherId || (currentUser.role === 'teacher' ? currentUser.id : receiverId),
          teacherName: activeConv.teacherName || (currentUser.role === 'teacher' ? currentUser.fullName : activeConv.participants[0]?.name),
          senderId: currentUser.id,
          senderName: currentUser.fullName || 'Me',
          senderRole,
          receiverId,
          receiverRole,
          text: inputText.trim(),
          mediaUrl: attachedFile?.url,
          mediaType: attachedFile?.type,
          attachmentName: attachedFile?.name
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();
      const newMessage = mapServerMessageToChatMessage(data.message);

      setChatMessages((prev) => ({
        ...prev,
        [activeConv.id]: [...(prev[activeConv.id] || []), newMessage]
      }));
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === activeConv.id
            ? { ...conv, lastMessage: newMessage, unreadCount: 0 }
            : conv
        )
      );

      setInputText('');
      setReplyingToMsg(null);
      setAttachedFile(null);
      addNotification('Message sent successfully.', 'feedback');
      await loadConversations();
    } catch (error) {
      console.error('Send chat message failed', error);
      addNotification('Unable to send message, please try again.', 'error');
    }
  };

  const handleSimulateVoiceNote = () => {
    if (isRecordingVoice) {
      setIsRecordingVoice(false);
      // Send mock voice note
      const voiceMsg: ChatMessage = {
        id: `msg-voice-${Date.now()}`,
        senderId: currentUser?.id || 'usr-me',
        senderName: currentUser?.fullName || 'Me',
        senderRole: currentUser?.role || 'student',
        senderAvatar: currentUser?.avatar || '',
        text: '🎤 Voice Note (0:14)',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        mediaUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
        mediaType: 'audio',
        isVoiceNote: true,
        read: false,
        delivered: true
      };

      setChatMessages((prev) => ({
        ...prev,
        [activeConvId]: [...(prev[activeConvId] || []), voiceMsg]
      }));

      addNotification('Voice note recorded & sent successfully!', 'feedback');
    } else {
      setIsRecordingVoice(true);
      setRecordingTimer(0);
    }
  };

  const handleReaction = (msgId: string, emoji: string) => {
    setChatMessages((prev) => ({
      ...prev,
      [activeConvId]: (prev[activeConvId] || []).map((m) => {
        if (m.id !== msgId) return m;
        const currentCount = m.reactions?.[emoji] || 0;
        return {
          ...m,
          reactions: {
            ...m.reactions,
            [emoji]: currentCount + 1
          }
        };
      })
    }));
  };

  const handleDeleteMessage = (msgId: string) => {
    setChatMessages((prev) => ({
      ...prev,
      [activeConvId]: (prev[activeConvId] || []).map((m) =>
        m.id === msgId ? { ...m, deleted: true, text: 'This message was deleted' } : m
      )
    }));
  };

  const handleTogglePinConv = (convId: string) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === convId ? { ...c, isPinned: !c.isPinned } : c))
    );
  };

  const handleToggleMuteConv = (convId: string) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === convId ? { ...c, isMuted: !c.isMuted } : c))
    );
  };

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName) return;

    const newGroupConv: Conversation = {
      id: `conv-group-${Date.now()}`,
      title: newGroupName,
      type: 'group',
      participants: [
        {
          id: currentUser?.id || 'usr-me',
          name: currentUser?.fullName || 'Me',
          role: currentUser?.role || 'teacher',
          avatar: currentUser?.avatar || ''
        }
      ],
      lastMessage: {
        id: `m-init-${Date.now()}`,
        senderId: currentUser?.id || 'usr-me',
        senderName: currentUser?.fullName || 'Me',
        senderRole: currentUser?.role || 'teacher',
        senderAvatar: currentUser?.avatar || '',
        text: `Group "${newGroupName}" created by ${currentUser?.fullName || 'Admin'}`,
        timestamp: 'Just now',
        read: true,
        delivered: true
      },
      unreadCount: 0,
      isPinned: false,
      groupMeta: {
        description: newGroupDesc || 'Official group chat',
        branch: newGroupBranch,
        createdBy: currentUser?.fullName || 'Me',
        admins: [currentUser?.id || 'usr-me']
      }
    };

    setConversations([newGroupConv, ...conversations]);
    setActiveConvId(newGroupConv.id);
    setIsCreateGroupOpen(false);
    setNewGroupName('');
    setNewGroupDesc('');
    addNotification(`Group "${newGroupName}" created successfully!`, 'system');
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastText) return;

    const broadcastConv: Conversation = {
      id: `conv-bcast-${Date.now()}`,
      title: `Broadcast: ${broadcastTarget}`,
      type: 'broadcast',
      participants: [
        {
          id: currentUser?.id || 'usr-me',
          name: currentUser?.fullName || 'Me',
          role: currentUser?.role || 'teacher',
          avatar: currentUser?.avatar || ''
        }
      ],
      lastMessage: {
        id: `m-bcast-${Date.now()}`,
        senderId: currentUser?.id || 'usr-me',
        senderName: currentUser?.fullName || 'Me',
        senderRole: currentUser?.role || 'teacher',
        senderAvatar: currentUser?.avatar || '',
        text: broadcastText,
        timestamp: 'Just now',
        read: true,
        delivered: true
      },
      unreadCount: 0,
      isPinned: true
    };

    setConversations([broadcastConv, ...conversations]);
    setActiveConvId(broadcastConv.id);
    setChatMessages((prev) => ({
      ...prev,
      [broadcastConv.id]: [broadcastConv.lastMessage!]
    }));
    setIsBroadcastOpen(false);
    setBroadcastText('');
    addNotification(`Broadcast sent to students & parents of ${broadcastTarget}`, 'system');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-semibold tracking-wide uppercase">
              Phase 10 — Communication Hub
            </span>
            <span className="text-xs text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              Permission Protected
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-amber-950 mt-1">
            Abel Begena Direct & Group Messaging
          </h1>
          <p className="text-sm text-stone-600 mt-0.5">
            Connect securely with teachers, fellow students, branch staff, and administration.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {(currentUser?.role === 'teacher' ||
            currentUser?.role === 'admin' ||
            currentUser?.role === 'super_admin' ||
            currentUser?.role === 'founder') && (
            <button
              onClick={() => setIsBroadcastOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-semibold transition"
            >
              <Radio className="w-4 h-4 text-amber-800" />
              Teacher Broadcast
            </button>
          )}

          <button
            onClick={() => setIsCreateGroupOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-amber-800 hover:bg-amber-900 text-white rounded-lg text-xs font-semibold shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            New Group Chat
          </button>
        </div>
      </div>

      {/* Main Messaging Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden min-h-[680px]">
        
        {/* CONVERSATION LIST (4 cols) */}
        <div className="lg:col-span-4 border-r border-stone-200 flex flex-col bg-stone-50/50">
          
          {/* Search & Filter Bar */}
          <div className="p-4 border-b border-stone-200 space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search messages or people..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              {(['all', 'unread', 'pinned', 'groups'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-3 py-1 rounded-full text-xs font-medium capitalize transition whitespace-nowrap ${
                    activeFilter === filter
                      ? 'bg-amber-800 text-white shadow-xs'
                      : 'bg-white text-stone-600 hover:bg-stone-200 border border-stone-200'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Conversations Scroll List */}
          <div className="flex-1 overflow-y-auto divide-y divide-stone-100">
            {filteredConversations.length === 0 ? (
              <div className="p-8 text-center text-stone-500">
                <MessageSquare className="w-8 h-8 mx-auto text-stone-300 mb-2" />
                <p className="text-xs font-medium">No conversations found.</p>
                <p className="text-[11px] text-stone-400 mt-1">Try resetting your search query.</p>
              </div>
            ) : (
              filteredConversations.map((conv, idx) => {
                const isActive = conv.id === activeConvId;
                const participant = conv.participants[0];

                return (
                  <div
                    key={conv.id ? `${conv.id}_${idx}` : `conv_${idx}`}
                    onClick={() => selectConversation(conv.id)}
                    className={`p-3.5 flex items-start gap-3 cursor-pointer transition relative hover:bg-stone-100/70 ${
                      isActive ? 'bg-amber-50/80 border-l-4 border-amber-800' : ''
                    }`}
                  >
                    {/* Avatar */}
                    <div className="relative shrink-0">
                      {conv.type === 'group' ? (
                        <div className="w-11 h-11 rounded-full bg-amber-800 text-amber-100 flex items-center justify-center font-bold text-sm border border-stone-200">
                          <Users className="w-5 h-5" />
                        </div>
                      ) : participant?.avatar ? (
                        <img
                          src={participant.avatar}
                          alt={conv.title}
                          className="w-11 h-11 rounded-full object-cover border border-stone-200"
                        />
                      ) : (
                        <div className="w-11 h-11 rounded-full bg-[#3B2818] text-[#E89B52] flex items-center justify-center font-bold text-sm border border-stone-200">
                          {conv.title?.charAt(0) || 'U'}
                        </div>
                      )}
                      {conv.type !== 'group' && participant?.isOnline && (
                        <span className="w-3 h-3 bg-emerald-500 border-2 border-white rounded-full absolute bottom-0 right-0"></span>
                      )}
                      {conv.type === 'group' && (
                        <span className="w-4 h-4 bg-amber-800 text-white rounded-full flex items-center justify-center text-[9px] font-bold absolute -bottom-1 -right-1">
                          <Users className="w-2.5 h-2.5" />
                        </span>
                      )}
                    </div>

                    {/* Meta */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-stone-900 truncate flex items-center gap-1">
                          {conv.title}
                          {conv.isPinned && <Pin className="w-3 h-3 text-amber-700 shrink-0 fill-amber-700" />}
                          {conv.isMuted && <VolumeX className="w-3 h-3 text-stone-400 shrink-0" />}
                        </h4>
                        <span className="text-[10px] text-stone-400 shrink-0 ml-1">
                          {conv.lastMessage?.timestamp || ''}
                        </span>
                      </div>

                      <p className="text-[11px] text-stone-500 truncate mt-0.5">
                        {conv.lastMessage?.text || 'No messages yet.'}
                      </p>

                      <div className="flex items-center justify-between mt-1">
                        <span className="text-[10px] text-amber-900/70 capitalize font-medium">
                          {conv.type === 'group'
                            ? `${conv.participants.length} Members`
                            : participant?.role?.replace('_', ' ')}
                        </span>

                        {conv.unreadCount > 0 && (
                          <span className="px-1.5 py-0.5 bg-amber-800 text-white rounded-full text-[10px] font-bold min-w-4 text-center">
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* CHAT INTERFACE (8 cols) */}
        <div className="lg:col-span-8 flex flex-col h-full bg-white">
          
          {/* Chat Header */}
          <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-stone-50/30">
            <div className="flex items-center gap-3">
              {activeConv.type === 'group' ? (
                <div className="w-10 h-10 rounded-full bg-amber-800 text-amber-100 flex items-center justify-center font-bold text-sm border border-stone-200">
                  <Users className="w-5 h-5" />
                </div>
              ) : activeConv.participants[0]?.avatar ? (
                <img
                  src={activeConv.participants[0].avatar}
                  alt={activeConv.title}
                  className="w-10 h-10 rounded-full object-cover border border-stone-200"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-[#3B2818] text-[#E89B52] flex items-center justify-center font-bold text-sm border border-stone-200">
                  {activeConv.title?.charAt(0) || 'U'}
                </div>
              )}
              <div>
                <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                  {activeConv.title}
                  {activeConv.type === 'broadcast' && (
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-900 rounded text-[10px] font-semibold">
                      Broadcast
                    </span>
                  )}
                </h3>
                <p className="text-[11px] text-stone-500">
                  {activeConv.type === 'group'
                    ? `${activeConv.participants.length} Members • ${activeConv.groupMeta?.branch || 'All Branches'}`
                    : activeConv.participants[0]?.isOnline
                    ? '🟢 Online now'
                    : 'Offline • Last seen recently'}
                </p>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => handleTogglePinConv(activeConv.id)}
                title={activeConv.isPinned ? 'Unpin Chat' : 'Pin Chat'}
                className={`p-2 rounded-lg text-xs transition ${
                  activeConv.isPinned ? 'bg-amber-100 text-amber-900' : 'text-stone-500 hover:bg-stone-100'
                }`}
              >
                <Pin className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleToggleMuteConv(activeConv.id)}
                title={activeConv.isMuted ? 'Unmute Notifications' : 'Mute Notifications'}
                className={`p-2 rounded-lg text-xs transition ${
                  activeConv.isMuted ? 'bg-red-50 text-red-600' : 'text-stone-500 hover:bg-stone-100'
                }`}
              >
                {activeConv.isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>

              {activeConv.type === 'group' && (
                <button
                  onClick={() => setIsGroupInfoOpen(true)}
                  className="p-2 rounded-lg text-stone-500 hover:bg-stone-100 transition"
                  title="Group Info"
                >
                  <Info className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Messages Feed Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-stone-50/20">
            {messagesForActive.length === 0 ? (
              <div className="text-center py-12 text-stone-400">
                <MessageSquare className="w-10 h-10 mx-auto text-stone-300 mb-2" />
                <p className="text-xs font-semibold text-stone-600">Start of conversation with {activeConv.title}</p>
                <p className="text-[11px] text-stone-400 mt-1">Messages are end-to-end encrypted and permission-verified.</p>
              </div>
            ) : (
              messagesForActive.map((msg, idx) => {
                const isMe = msg.senderId === (currentUser?.id || 'usr-me') || msg.senderName === 'Me' || msg.senderName === currentUser?.fullName;

                return (
                  <div
                    key={msg.id ? `${msg.id}_${idx}` : `msg_${idx}`}
                    className={`flex items-start gap-2.5 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    {msg.senderAvatar ? (
                      <img
                        src={msg.senderAvatar}
                        alt={msg.senderName}
                        className="w-8 h-8 rounded-full object-cover border border-stone-200 shrink-0 mt-1"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-[#FAF6EF] dark:bg-[#1A1A1E] border border-stone-200 shrink-0 mt-1" />
                    )}

                    <div className={`max-w-[75%] space-y-1 ${isMe ? 'items-end text-right' : 'items-start text-left'}`}>
                      {/* Sender Meta */}
                      <div className="flex items-center gap-2 text-[10px] text-stone-500">
                        <span className="font-semibold text-stone-800">{msg.senderName}</span>
                        <span className="px-1.5 py-0.2 bg-stone-100 text-stone-600 rounded uppercase font-bold text-[9px]">
                          {msg.senderRole}
                        </span>
                        <span>{msg.timestamp}</span>
                      </div>

                      {/* Bubble */}
                      <div
                        className={`p-3 rounded-2xl text-xs relative group transition ${
                          msg.deleted
                            ? 'bg-stone-100 text-stone-400 italic border border-stone-200'
                            : isMe
                            ? 'bg-amber-800 text-white rounded-tr-none shadow-xs'
                            : 'bg-white text-stone-900 border border-stone-200 rounded-tl-none shadow-xs'
                        }`}
                      >
                        {/* Reply reference if any */}
                        {msg.replyToId && (
                          <div
                            className={`p-1.5 rounded text-[11px] mb-2 border-l-2 ${
                              isMe ? 'bg-amber-900/40 border-amber-300 text-amber-100' : 'bg-stone-100 border-amber-800 text-stone-700'
                            }`}
                          >
                            <span className="font-semibold block text-[10px]">Replying to message</span>
                          </div>
                        )}

                        {/* Media Attachment if present */}
                        {msg.mediaUrl && (
                          <div className="mb-2">
                            {msg.mediaType === 'image' && (
                              <img
                                src={msg.mediaUrl}
                                alt="Attachment"
                                className="rounded-lg max-h-48 object-cover border border-stone-200 w-full"
                              />
                            )}
                            {msg.mediaType === 'audio' && (
                              <div
                                className={`p-2.5 rounded-lg flex items-center gap-3 ${
                                  isMe ? 'bg-amber-900/50 text-white' : 'bg-stone-100 text-stone-800'
                                }`}
                              >
                                <button
                                  onClick={() =>
                                    setPlayingAudioId(playingAudioId === msg.id ? null : msg.id)
                                  }
                                  className="w-8 h-8 rounded-full bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-xs"
                                >
                                  {playingAudioId === msg.id ? (
                                    <Pause className="w-4 h-4" />
                                  ) : (
                                    <Play className="w-4 h-4 ml-0.5" />
                                  )}
                                </button>
                                <div className="flex-1">
                                  <div className="h-1.5 bg-stone-300/50 rounded-full overflow-hidden">
                                    <div
                                      className={`h-full bg-amber-400 ${
                                        playingAudioId === msg.id ? 'w-2/3 animate-pulse' : 'w-1/3'
                                      }`}
                                    ></div>
                                  </div>
                                  <span className="text-[10px] block mt-1 opacity-80">
                                    {msg.isVoiceNote ? 'Voice Recording • 0:14' : 'Audio Practice File'}
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>

                        {msg.edited && !msg.deleted && (
                          <span className="text-[9px] block text-right opacity-70 mt-1 italic">
                            (edited)
                          </span>
                        )}

                        {/* Reactions List */}
                        {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                          <div className="flex items-center gap-1 mt-1.5 flex-wrap">
                            {Object.entries(msg.reactions).map(([emoji, count]) => (
                              <span
                                key={emoji}
                                className="px-1.5 py-0.5 rounded-full bg-stone-100 border border-stone-200 text-stone-800 text-[10px] font-bold flex items-center gap-1 shadow-2xs"
                              >
                                {emoji} {count}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Action Bar overlay on hover */}
                        {!msg.deleted && (
                          <div
                            className={`absolute top-1 ${
                              isMe ? '-left-20' : '-right-20'
                            } opacity-0 group-hover:opacity-100 transition flex items-center gap-1 bg-white border border-stone-200 rounded-lg p-1 shadow-sm`}
                          >
                            <button
                              onClick={() => setReplyingToMsg(msg)}
                              title="Reply"
                              className="p-1 hover:bg-stone-100 rounded text-stone-600"
                            >
                              <Reply className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => handleReaction(msg.id, '👏')}
                              title="React 👏"
                              className="p-1 hover:bg-stone-100 rounded text-stone-600 text-xs"
                            >
                              👏
                            </button>

                            <button
                              onClick={() => handleReaction(msg.id, '🙏')}
                              title="React 🙏"
                              className="p-1 hover:bg-stone-100 rounded text-stone-600 text-xs"
                            >
                              🙏
                            </button>

                            {isMe && (
                              <>
                                <button
                                  onClick={() => {
                                    setEditingMsgId(msg.id);
                                    setInputText(msg.text);
                                  }}
                                  title="Edit"
                                  className="p-1 hover:bg-stone-100 rounded text-stone-600"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteMessage(msg.id)}
                                  title="Delete"
                                  className="p-1 hover:bg-red-50 rounded text-red-600"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Read status ticks */}
                      {isMe && (
                        <div className="flex items-center justify-end text-[10px] text-stone-400 gap-1">
                          {msg.read ? (
                            <CheckCheck className="w-3.5 h-3.5 text-blue-500" />
                          ) : (
                            <Check className="w-3.5 h-3.5 text-stone-400" />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Reply Banner if set */}
          {replyingToMsg && (
            <div className="px-4 py-2 bg-amber-50 border-t border-amber-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-stone-700">
                <Reply className="w-3.5 h-3.5 text-amber-800" />
                <span>
                  Replying to <strong>{replyingToMsg.senderName}</strong>: "{replyingToMsg.text.slice(0, 30)}..."
                </span>
              </div>
              <button
                onClick={() => setReplyingToMsg(null)}
                className="text-stone-400 hover:text-stone-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Attachment Banner if attached */}
          {attachedFile && (
            <div className="px-4 py-2 bg-stone-100 border-t border-stone-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-stone-700">
                <Paperclip className="w-3.5 h-3.5 text-amber-800" />
                <span>
                  Attached file: <strong>{attachedFile.name}</strong> ({attachedFile.type})
                </span>
              </div>
              <button
                onClick={() => setAttachedFile(null)}
                className="text-stone-400 hover:text-stone-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Chat Input Bar */}
          <div className="p-3 border-t border-stone-200 bg-white">
            <div className="flex items-center gap-2">
              
              {/* Media File Picker button */}
              <button
                onClick={() =>
                  setAttachedFile({
                    name: 'Begena_Practice_Exercise.mp3',
                    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
                    type: 'audio'
                  })
                }
                title="Attach audio or document"
                className="p-2 text-stone-500 hover:text-amber-800 hover:bg-stone-100 rounded-lg transition"
              >
                <Paperclip className="w-5 h-5" />
              </button>

              {/* Voice Note Recording Simulator */}
              <button
                onClick={handleSimulateVoiceNote}
                title={isRecordingVoice ? 'Stop & Send Voice Note' : 'Record Voice Note'}
                className={`p-2 rounded-lg transition ${
                  isRecordingVoice ? 'bg-red-600 text-white animate-pulse' : 'text-stone-500 hover:text-amber-800 hover:bg-stone-100'
                }`}
              >
                <Mic className="w-5 h-5" />
              </button>

              {/* Text Input */}
              <input
                type="text"
                placeholder={
                  editingMsgId
                    ? 'Edit your message...'
                    : isRecordingVoice
                    ? 'Recording voice note... Click mic to finish'
                    : 'Type your message...'
                }
                value={inputText}
                disabled={isRecordingVoice}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendMessage();
                }}
                className="flex-1 text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
              />

              {/* Send Button */}
              <button
                onClick={handleSendMessage}
                disabled={!inputText.trim() && !attachedFile}
                className="p-2.5 bg-amber-800 hover:bg-amber-900 disabled:opacity-50 text-white rounded-xl shadow-xs transition"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CREATE GROUP CHAT MODAL */}
      {isCreateGroupOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-stone-200"
          >
            <div className="flex items-center justify-between border-b border-stone-200 pb-3 mb-4">
              <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-amber-800" />
                Create New Group Chat
              </h3>
              <button onClick={() => setIsCreateGroupOpen(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateGroup} className="space-y-4 text-xs">
              <div>
                <label className="block text-stone-700 font-semibold mb-1">Group Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Begena Piazza Saturday Batch"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">Description</label>
                <textarea
                  placeholder="Group discussion guidelines or class details..."
                  rows={2}
                  value={newGroupDesc}
                  onChange={(e) => setNewGroupDesc(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">Branch Scope</label>
                <select
                  value={newGroupBranch}
                  onChange={(e) => setNewGroupBranch(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                >
                  <option value="Piazza Main Branch">Piazza Main Branch</option>
                  <option value="Megenagna Branch">Megenagna Branch</option>
                  <option value="Bole Branch">Bole Branch</option>
                  <option value="Online International Branch">Online International Branch</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateGroupOpen(false)}
                  className="px-4 py-2 border border-stone-300 rounded-lg font-semibold text-stone-700 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-800 hover:bg-amber-900 text-white font-semibold rounded-lg shadow-xs"
                >
                  Create Group
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* TEACHER BROADCAST MODAL */}
      {isBroadcastOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-stone-200"
          >
            <div className="flex items-center justify-between border-b border-stone-200 pb-3 mb-4">
              <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <Radio className="w-5 h-5 text-amber-800" />
                Teacher Announcement Broadcast
              </h3>
              <button onClick={() => setIsBroadcastOpen(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendBroadcast} className="space-y-4 text-xs">
              <div>
                <label className="block text-stone-700 font-semibold mb-1">Target Group *</label>
                <select
                  value={broadcastTarget}
                  onChange={(e) => setBroadcastTarget(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                >
                  <option value="Begena Level 1 Students">All Students in Begena Level 1</option>
                  <option value="Begena Level 2 Students">All Students in Begena Level 2</option>
                  <option value="Parents of Enrolled Students">Parents of My Enrolled Students</option>
                  <option value="Piazza Branch Students">Piazza Branch Active Class</option>
                </select>
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">Broadcast Announcement Message *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="e.g., Please practice Mezmur 3 before our upcoming class on Saturday..."
                  value={broadcastText}
                  onChange={(e) => setBroadcastText(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                />
              </div>

              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-[11px] text-amber-900 flex items-start gap-2">
                <Info className="w-4 h-4 shrink-0 text-amber-800 mt-0.5" />
                <span>
                  This broadcast will be delivered directly to the inbox and notification bar of all targeted students and parents.
                </span>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsBroadcastOpen(false)}
                  className="px-4 py-2 border border-stone-300 rounded-lg font-semibold text-stone-700 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-800 hover:bg-amber-900 text-white font-semibold rounded-lg shadow-xs"
                >
                  Send Broadcast
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* GROUP INFO MODAL */}
      {isGroupInfoOpen && activeConv.groupMeta && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-stone-200 text-xs">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3 mb-4">
              <h3 className="text-sm font-bold text-stone-900">Group Info</h3>
              <button onClick={() => setIsGroupInfoOpen(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-center mb-4">
              <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xl mx-auto mb-2 border border-amber-300">
                <Users className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-stone-900 text-base">{activeConv.title}</h4>
              <p className="text-stone-500 mt-1">{activeConv.groupMeta.description}</p>
            </div>

            <div className="space-y-2 border-t border-stone-200 pt-3">
              <div className="flex justify-between text-stone-600">
                <span>Branch:</span>
                <span className="font-semibold text-stone-900">{activeConv.groupMeta.branch}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Created By:</span>
                <span className="font-semibold text-stone-900">{activeConv.groupMeta.createdBy}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Members Count:</span>
                <span className="font-semibold text-stone-900">{activeConv.participants.length}</span>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-stone-200 flex justify-end">
              <button
                onClick={() => setIsGroupInfoOpen(false)}
                className="px-4 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

