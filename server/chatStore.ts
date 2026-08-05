import fs from 'fs';
import path from 'path';
import { Response } from 'express';

const CHAT_DB_PATH = path.join(process.cwd(), 'fix_data', 'chatDatabase.json');
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads', 'chat');

export type ChatUserRole =
  | 'student'
  | 'teacher'
  | 'parent'
  | 'registration_staff'
  | 'accountant'
  | 'branch_manager'
  | 'admin'
  | 'super_admin'
  | 'founder';

export interface ChatConversationRecord {
  id: string;
  enrollmentId: string;
  studentId: string;
  studentName: string;
  teacherId: string;
  teacherName: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessageRecord {
  id: string;
  conversationId: string;
  enrollmentId: string;
  senderId: string;
  senderName: string;
  senderRole: ChatUserRole;
  receiverId: string;
  receiverRole: ChatUserRole;
  text: string;
  timestamp: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'pdf' | 'audio' | 'file';
  attachmentName?: string;
  status: 'sent' | 'delivered' | 'read';
  isRead: boolean;
}

export interface ChatDb {
  conversations: ChatConversationRecord[];
  messages: ChatMessageRecord[];
}

interface ChatClient {
  userId: string;
  role: ChatUserRole;
  res: Response;
}

const connectedClients: ChatClient[] = [];
let writeInProgress = false;
let pendingWrite: ChatDb | null = null;

function ensureDatabaseFile() {
  if (!fs.existsSync(CHAT_DB_PATH)) {
    const initial: ChatDb = { conversations: [], messages: [] };
    fs.mkdirSync(path.dirname(CHAT_DB_PATH), { recursive: true });
    fs.writeFileSync(CHAT_DB_PATH, JSON.stringify(initial, null, 2), 'utf8');
  }
}

function readDatabase(): ChatDb {
  ensureDatabaseFile();
  const raw = fs.readFileSync(CHAT_DB_PATH, 'utf8');
  try {
    const parsed = JSON.parse(raw);
    return {
      conversations: Array.isArray(parsed.conversations) ? parsed.conversations : [],
      messages: Array.isArray(parsed.messages) ? parsed.messages : []
    };
  } catch {
    return { conversations: [], messages: [] };
  }
}

function writeDatabase(db: ChatDb) {
  if (writeInProgress) {
    pendingWrite = db;
    return;
  }

  writeInProgress = true;
  fs.writeFile(CHAT_DB_PATH, JSON.stringify(db, null, 2), 'utf8', (err) => {
    writeInProgress = false;
    if (err) {
      console.error('Failed to write chat database:', err);
    }
    if (pendingWrite) {
      const nextDb = pendingWrite;
      pendingWrite = null;
      writeDatabase(nextDb);
    }
  });
}

function getConversationById(conversationId: string): ChatConversationRecord | undefined {
  const db = readDatabase();
  return db.conversations.find((conv) => conv.id === conversationId);
}

function ensureConversation(data: {
  id: string;
  enrollmentId: string;
  studentId: string;
  studentName: string;
  teacherId: string;
  teacherName: string;
}): ChatConversationRecord {
  const db = readDatabase();
  const existing = db.conversations.find((conv) => conv.id === data.id);
  if (existing) {
    return existing;
  }

  const newConv: ChatConversationRecord = {
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  db.conversations.push(newConv);
  writeDatabase(db);
  return newConv;
}

export function getConversationsForUser(userId: string, role: ChatUserRole): Array<ChatConversationRecord & { unreadCount: number }> {
  const db = readDatabase();
  const matchAll = role === 'admin' || role === 'super_admin';
  const results = db.conversations
    .filter((conv) => matchAll || conv.studentId === userId || conv.teacherId === userId)
    .map((conv) => {
      const unreadCount = db.messages.filter(
        (msg) => msg.conversationId === conv.id && msg.receiverId === userId && !msg.isRead
      ).length;
      return { ...conv, unreadCount };
    });
  return results.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}

export function getMessagesForConversation(conversationId: string, limit = 35, before?: string): { messages: ChatMessageRecord[]; hasMore: boolean } {
  const db = readDatabase();
  const all = db.messages.filter((msg) => msg.conversationId === conversationId);
  const ordered = all.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  let filtered = ordered;
  if (before) {
    filtered = ordered.filter((msg) => new Date(msg.timestamp).getTime() < new Date(before).getTime());
  }
  const page = filtered.slice(0, limit);
  return {
    messages: page.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()),
    hasMore: filtered.length > limit
  };
}

export function appendChatMessage(data: {
  conversationId: string;
  enrollmentId: string;
  studentId: string;
  studentName: string;
  teacherId: string;
  teacherName: string;
  senderId: string;
  senderName: string;
  senderRole: ChatUserRole;
  receiverId: string;
  receiverRole: ChatUserRole;
  text: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'pdf' | 'audio' | 'file';
  attachmentName?: string;
}): ChatMessageRecord {
  const db = readDatabase();
  const conversation = ensureConversation({
    id: data.conversationId,
    enrollmentId: data.enrollmentId,
    studentId: data.studentId,
    studentName: data.studentName,
    teacherId: data.teacherId,
    teacherName: data.teacherName
  });

  const message: ChatMessageRecord = {
    id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    conversationId: conversation.id,
    enrollmentId: conversation.enrollmentId,
    senderId: data.senderId,
    senderName: data.senderName,
    senderRole: data.senderRole,
    receiverId: data.receiverId,
    receiverRole: data.receiverRole,
    text: data.text || '',
    mediaUrl: data.mediaUrl,
    mediaType: data.mediaType,
    attachmentName: data.attachmentName,
    timestamp: new Date().toISOString(),
    status: 'sent',
    isRead: false
  };

  db.messages.push(message);
  const convIndex = db.conversations.findIndex((conv) => conv.id === conversation.id);
  if (convIndex !== -1) {
    db.conversations[convIndex] = {
      ...db.conversations[convIndex],
      updatedAt: new Date().toISOString()
    };
  }
  writeDatabase(db);
  broadcastChatUpdate(conversation.id, message);
  return message;
}

export function markConversationRead(conversationId: string, readerId: string): void {
  const db = readDatabase();
  let modified = false;
  db.messages = db.messages.map((msg) => {
    if (msg.conversationId === conversationId && msg.receiverId === readerId && !msg.isRead) {
      modified = true;
      return { ...msg, isRead: true, status: 'read' };
    }
    return msg;
  });
  if (modified) {
    writeDatabase(db);
    broadcastReadReceipt(conversationId, readerId);
  }
}

export function saveChatAttachment(fileName: string, contentBase64: string): { url: string; attachmentName: string } {
  const cleanName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
  const uniqueName = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}_${cleanName}`;
  const outputPath = path.join(UPLOADS_DIR, uniqueName);
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  const buffer = Buffer.from(contentBase64, 'base64');
  fs.writeFileSync(outputPath, buffer);
  return { url: `/uploads/chat/${uniqueName}`, attachmentName: fileName };
}

function sendEvent(res: Response, event: string, data: unknown) {
  try {
    res.write(`event: ${event}\n`);
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  } catch (error) {
    console.error('Failed to send SSE event:', error);
  }
}

export function addClient(userId: string, role: ChatUserRole, res: Response) {
  connectedClients.push({ userId, role, res });
  sendEvent(res, 'connected', { userId, role, timestamp: new Date().toISOString() });
  broadcastPresence(userId, role, true);
}

export function removeClient(res: Response) {
  const index = connectedClients.findIndex((client) => client.res === res);
  if (index !== -1) {
    const client = connectedClients[index];
    connectedClients.splice(index, 1);
    broadcastPresence(client.userId, client.role, false);
  }
}

function broadcastPresence(userId: string, role: ChatUserRole, isOnline: boolean) {
  connectedClients.forEach((client) => {
    if (client.userId !== userId) {
      sendEvent(client.res, 'presence', { userId, role, isOnline, timestamp: new Date().toISOString() });
    }
  });
}

function broadcastChatUpdate(conversationId: string, message: ChatMessageRecord) {
  const recipients = new Set<string>([message.receiverId, message.senderId]);
  connectedClients.forEach((client) => {
    if (recipients.has(client.userId)) {
      sendEvent(client.res, 'chat_message', { conversationId, message, timestamp: new Date().toISOString() });
    }
  });
}

function broadcastReadReceipt(conversationId: string, readerId: string) {
  connectedClients.forEach((client) => {
    if (client.userId !== readerId) {
      sendEvent(client.res, 'read_receipt', { conversationId, readerId, timestamp: new Date().toISOString() });
    }
  });
}

export function getOnlineUsers(): string[] {
  return Array.from(new Set(connectedClients.map((client) => client.userId)));
}

export function broadcastTyping(conversationId: string, senderId: string, senderName: string, isTyping: boolean) {
  connectedClients.forEach((client) => {
    if (client.userId !== senderId) {
      sendEvent(client.res, 'typing', { conversationId, senderId, senderName, isTyping, timestamp: new Date().toISOString() });
    }
  });
}
