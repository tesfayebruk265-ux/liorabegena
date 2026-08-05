// Utility for persistent real Teacher <-> Student messaging linked to Enrollment ID

export interface EnrollmentMessage {
  id: string;
  enrollmentId: string;
  studentId: string;
  studentName?: string;
  teacherId: string;
  teacherName?: string;
  senderId: string;
  senderName: string;
  senderRole: 'teacher' | 'student';
  text: string;
  timestamp: string;
  isRead: boolean;
}

const MESSAGES_KEY = 'ab_enrollment_messages_v1';

export function getAllEnrollmentMessages(): EnrollmentMessage[] {
  try {
    const saved = localStorage.getItem(MESSAGES_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        const map = new Map<string, EnrollmentMessage>();
        parsed.forEach((m) => {
          if (m && m.id) {
            map.set(m.id, m);
          }
        });
        return Array.from(map.values());
      }
    }
  } catch (e) {
    console.error('Error loading enrollment messages:', e);
  }
  return [];
}

export function getMessagesForEnrollment(enrollmentId: string): EnrollmentMessage[] {
  const all = getAllEnrollmentMessages();
  return all.filter((m) => m.enrollmentId === enrollmentId);
}

export function getMessagesForStudent(studentId: string): EnrollmentMessage[] {
  const all = getAllEnrollmentMessages();
  return all.filter((m) => m.studentId === studentId);
}

export function getMessagesForTeacher(teacherId: string): EnrollmentMessage[] {
  const all = getAllEnrollmentMessages();
  return all.filter((m) => m.teacherId === teacherId);
}

export function sendEnrollmentMessage(data: Omit<EnrollmentMessage, 'id' | 'timestamp' | 'isRead'>): EnrollmentMessage {
  const all = getAllEnrollmentMessages();
  const existingIds = new Set(all.map((m) => m.id));
  let uniqueId = `msg_enr_${Date.now()}_${Math.random().toString(36).substring(2, 9)}_${Math.floor(Math.random() * 10000)}`;
  while (existingIds.has(uniqueId)) {
    uniqueId = `msg_enr_${Date.now()}_${Math.random().toString(36).substring(2, 9)}_${Math.floor(Math.random() * 100000)}`;
  }

  const newMsg: EnrollmentMessage = {
    ...data,
    id: uniqueId,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    isRead: false
  };

  const updated = [...all, newMsg];
  try {
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(updated));
    
    // Automatically push notification to recipient
    const recipientUserId = newMsg.senderRole === 'teacher' ? newMsg.studentId : newMsg.teacherId;
    const recipientRole = newMsg.senderRole === 'teacher' ? 'student' : 'teacher';
    const senderTitle = newMsg.senderRole === 'teacher' 
      ? `New Direct Message from ${newMsg.senderName || 'your Teacher'}`
      : `New Student Message from ${newMsg.senderName || 'a Student'}`;

    if (recipientUserId) {
      const existingNotifsRaw = localStorage.getItem('ab_notifications');
      const existingNotifs = existingNotifsRaw ? JSON.parse(existingNotifsRaw) : [];
      const newNotif = {
        id: `notif_msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}_${Math.floor(Math.random() * 10000)}`,
        title: senderTitle,
        description: newMsg.text,
        isRead: false,
        timestamp: new Date().toISOString(),
        category: 'lesson',
        userId: recipientUserId,
        targetRole: recipientRole
      };
      const updatedNotifs = [newNotif, ...existingNotifs];
      localStorage.setItem('ab_notifications', JSON.stringify(updatedNotifs));
    }

    // Trigger custom window event so open tabs or components can update live
    window.dispatchEvent(new CustomEvent('ab_enrollment_message_sent', { detail: newMsg }));
    window.dispatchEvent(new CustomEvent('ab_user_updated'));
  } catch (e) {
    console.error('Error saving enrollment message:', e);
  }

  return newMsg;
}

export function markMessagesAsReadForEnrollment(enrollmentId: string, readerRole: 'teacher' | 'student'): void {
  const all = getAllEnrollmentMessages();
  let modified = false;
  const updated = all.map((m) => {
    if (m.enrollmentId === enrollmentId && m.senderRole !== readerRole && !m.isRead) {
      modified = true;
      return { ...m, isRead: true };
    }
    return m;
  });

  if (modified) {
    try {
      localStorage.setItem(MESSAGES_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Error marking messages as read:', e);
    }
  }
}
