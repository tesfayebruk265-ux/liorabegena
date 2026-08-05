import React, { useState, useEffect } from 'react';
import { Send, UserCheck, MessageCircle, AlertCircle, Sparkles, BookOpen, Video, ShieldCheck, CheckCheck, Activity, Star, Award } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { getStudentActiveEnrollments } from '../utils/studentEnrollment';
import {
  getMessagesForEnrollment,
  sendEnrollmentMessage,
  markMessagesAsReadForEnrollment,
  EnrollmentMessage
} from '../utils/enrollmentMessaging';
import { getEvaluationsForStudent, StudentProgressEvaluation } from '../utils/courseLearningSync';

interface MyTeacherSectionProps {
  className?: string;
  compact?: boolean;
}

function TeacherStudentEvaluationCard({ studentId, instrument }: { studentId: string; instrument: string }) {
  const [evaluations, setEvaluations] = useState<StudentProgressEvaluation[]>([]);

  const reloadEvals = () => {
    setEvaluations(getEvaluationsForStudent(studentId, instrument));
  };

  useEffect(() => {
    reloadEvals();
    window.addEventListener('ab_evaluations_updated', reloadEvals);
    return () => window.removeEventListener('ab_evaluations_updated', reloadEvals);
  }, [studentId, instrument]);

  if (evaluations.length === 0) return null;

  const latest = evaluations[0];

  return (
    <div className="mt-3 p-3.5 bg-amber-50/70 border border-amber-200/80 rounded-xl space-y-2 text-xs">
      <div className="flex items-center justify-between border-b border-amber-200/60 pb-1.5">
        <div className="flex items-center gap-1.5 font-bold text-amber-900">
          <Activity size={14} className="text-[#E89B52]" />
          <span>Teacher Progress Evaluation</span>
        </div>
        <span className="font-mono font-black text-xs text-amber-900 bg-amber-200 px-2 py-0.5 rounded">
          Grade: {latest.grade || 'A'} ({latest.overallProgressPercent}%)
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5 text-[10px] text-amber-900/90 bg-white/60 p-2 rounded-lg font-medium">
        <div>Tuning: <strong className="text-amber-900">{latest.tuningScore}/5 ★</strong></div>
        <div>Rhythm: <strong className="text-amber-900">{latest.rhythmScore}/5 ★</strong></div>
        <div>Technique: <strong className="text-amber-900">{latest.techniqueScore}/5 ★</strong></div>
        <div>Mastery: <strong className="text-amber-900">{latest.pieceMasteryScore}/5 ★</strong></div>
      </div>

      <p className="text-stone-800 italic text-[11px] leading-relaxed">
        "{latest.teacherNotes}"
      </p>
    </div>
  );
}

function TeacherMessageBox({
  enrollmentId,
  studentId,
  studentName,
  teacherId,
  teacherName,
  teacherPhoto
}: {
  enrollmentId: string;
  studentId: string;
  studentName: string;
  teacherId: string;
  teacherName: string;
  teacherPhoto?: string;
}) {
  const [messages, setMessages] = useState<EnrollmentMessage[]>([]);
  const [chatInput, setChatInput] = useState('');

  const refreshMessages = () => {
    const list = getMessagesForEnrollment(enrollmentId);
    setMessages(list);
  };

  useEffect(() => {
    refreshMessages();
    markMessagesAsReadForEnrollment(enrollmentId, 'student');

    const handleMessageEvent = () => {
      refreshMessages();
      markMessagesAsReadForEnrollment(enrollmentId, 'student');
    };

    window.addEventListener('ab_enrollment_message_sent', handleMessageEvent);
    return () => window.removeEventListener('ab_enrollment_message_sent', handleMessageEvent);
  }, [enrollmentId]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim()) return;

    sendEnrollmentMessage({
      enrollmentId,
      studentId,
      studentName,
      teacherId,
      teacherName,
      senderId: studentId,
      senderName: studentName,
      senderRole: 'student',
      text: chatInput.trim()
    });

    setChatInput('');
    refreshMessages();
  };

  const unreadCount = messages.filter((m: EnrollmentMessage) => m.senderRole === 'teacher' && !m.isRead).length;

  return (
    <div className="mt-3 pt-3 border-t border-stone-200 bg-stone-50/60 -mx-5 -mb-5 p-4 rounded-b-2xl space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageCircle size={15} className="text-amber-800" />
          <span className="text-xs font-bold text-stone-900">Direct Teacher Message Box</span>
        </div>
        {unreadCount > 0 && (
          <span className="px-2 py-0.5 bg-amber-800 text-white text-[10px] font-bold rounded-full animate-pulse">
            {unreadCount} New Message{unreadCount > 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Messages Scroll Box */}
      <div className="max-h-48 overflow-y-auto space-y-2 bg-white p-3 rounded-xl border border-stone-200 text-xs">
        {messages.length === 0 ? (
          <div className="text-center py-4 text-stone-400">
            <MessageCircle size={24} className="mx-auto mb-1 text-stone-300" />
            <p className="font-medium text-[11px]">No direct messages yet.</p>
            <p className="text-[10px] text-stone-400">Write a message below to communicate directly with {teacherName}.</p>
          </div>
        ) : (
          messages.map((msg: EnrollmentMessage, idx: number) => {
            const isTeacher = msg.senderRole === 'teacher';
            return (
              <div
                key={msg.id ? `${msg.id}_${idx}` : `msg_${idx}`}
                className={`flex items-start gap-2 ${isTeacher ? 'flex-row' : 'flex-row-reverse'}`}
              >
                {isTeacher && (
                  teacherPhoto ? (
                    <img
                      src={teacherPhoto}
                      alt={teacherName}
                      className="w-6 h-6 rounded-full object-cover border border-amber-300 shrink-0 mt-0.5"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-[#FAF6EF] dark:bg-[#1A1A1E] border border-amber-300 shrink-0 mt-0.5" />
                  )
                )}
                <div
                  className={`max-w-[82%] p-2.5 rounded-xl text-xs space-y-0.5 ${
                    isTeacher
                      ? 'bg-amber-50 text-stone-900 border border-amber-200 rounded-tl-none'
                      : 'bg-amber-800 text-white rounded-tr-none'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 text-[10px] opacity-80">
                    <span className="font-bold">{isTeacher ? teacherName : 'You'}</span>
                    <span>{msg.timestamp}</span>
                  </div>
                  <p className="leading-relaxed whitespace-pre-wrap text-[11px]">{msg.text}</p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Message Input Box */}
      <form onSubmit={handleSend} className="flex items-center gap-2">
        <input
          type="text"
          placeholder={`Message ${teacherName}...`}
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          className="flex-1 bg-white border border-stone-300 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
        />
        <button
          type="submit"
          disabled={!chatInput.trim()}
          className="px-3.5 py-1.5 bg-amber-800 hover:bg-amber-900 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
        >
          <Send size={12} />
          <span>Send</span>
        </button>
      </form>
    </div>
  );
}

export function MyTeacherSection({ className = '', compact = false }: MyTeacherSectionProps) {
  const { currentUser, getAuthoritativeUser } = useAuth();
  const { enrollments, teachers } = useData();

  const userEmail = (currentUser?.email || '').toLowerCase().trim();
  const userId = currentUser?.id || '';
  const userName = (currentUser?.fullName || '').toLowerCase().trim();

  // Find all active enrollments for this logged-in student using centralized resolver
  // IMPORTANT: No fake/fallback enrollments are created. A student with no enrollment
  // will see an empty state guiding them to start registration.
  const studentEnrollments = getStudentActiveEnrollments(currentUser, enrollments);

  // If student has no active enrollments, show empty state guiding them to register
  if (studentEnrollments.length === 0) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="flex items-center justify-between border-b border-[#E7DED1] pb-3">
          <div>
            <span className="text-[10px] tracking-widest text-[#E89B52] font-black uppercase block">ACADEMIC MENTORSHIP</span>
            <h3 className="font-display font-black text-sm uppercase text-[#2B2B2B] flex items-center gap-2">
              <UserCheck size={18} className="text-[#E89B52]" />
              MY TEACHER DIRECTORY
            </h3>
          </div>
          <span className="text-[10px] font-mono font-bold bg-gray-50 text-gray-500 px-2.5 py-1 rounded-full border border-gray-200">
            0 Active Enrollments
          </span>
        </div>

        <div className="bg-white border border-[#E7DED1] rounded-2xl p-8 text-center space-y-4 shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 text-[#E89B52] flex items-center justify-center mx-auto">
            <AlertCircle size={28} />
          </div>
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 bg-gray-50 px-3 py-1 rounded-full border border-gray-200">
              No Active Enrollment
            </span>
            <h4 className="font-display font-black text-base text-[#2B2B2B] uppercase">No Teacher Assigned Yet</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              You do not have an active course enrollment. A teacher will be assigned to you automatically once you complete your registration, select an instrument, and your tuition payment is verified by our accounting team.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between border-b border-[#E7DED1] pb-3">
        <div>
          <span className="text-[10px] tracking-widest text-[#E89B52] font-black uppercase block">ACADEMIC MENTORSHIP</span>
          <h3 className="font-display font-black text-sm uppercase text-[#2B2B2B] flex items-center gap-2">
            <UserCheck size={18} className="text-[#E89B52]" />
            MY TEACHER DIRECTORY
          </h3>
        </div>
        <span className="text-[10px] font-mono font-bold bg-amber-50 text-amber-800 px-2.5 py-1 rounded-full border border-amber-200">
          {studentEnrollments.length} Active {studentEnrollments.length === 1 ? 'Enrollment' : 'Enrollments'}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {studentEnrollments.map((enr, idx) => {
          const isOnline = String(enr.learningMode || '').toLowerCase().includes('online');

          // Find assigned teacher strictly by assigned ID, Email, or Name
          const teacher = teachers.find(t =>
            (enr.assignedTeacherId && t.id === enr.assignedTeacherId) ||
            (t.email && enr.assignedTeacherEmail && t.email.toLowerCase() === enr.assignedTeacherEmail.toLowerCase()) ||
            (t.fullName && enr.assignedTeacherName && t.fullName.toLowerCase() === enr.assignedTeacherName.toLowerCase())
          );

          const isAssigned = Boolean(teacher && (enr.assignedTeacherId || enr.assignedTeacherName) && (!enr.assignmentStatus || enr.assignmentStatus.toLowerCase() === 'assigned' || (enr as any).teacherAssignmentStatus === 'ACCEPTED' || (enr as any).teacherAssignmentStatus === 'ASSIGNED'));

          const cleanTelegram = teacher?.telegramUsername
            ? teacher.telegramUsername.replace(/^@/, '').trim()
            : '';
          const hasTelegram = Boolean(cleanTelegram);
          const telegramUrl = hasTelegram ? `https://t.me/${cleanTelegram}` : '#';

          return (
            <div
              key={enr.id ? `${enr.id}_${idx}` : `enr_${idx}`}
              className="bg-white border border-[#E7DED1] rounded-2xl p-5 shadow-xs hover:shadow-md transition-all space-y-4 relative overflow-hidden"
            >
              {/* Top Banner */}
              <div className="flex items-center justify-between bg-[#FAF6EF] -mx-5 -mt-5 p-3.5 px-5 border-b border-[#E7DED1]">
                <div className="flex items-center gap-2">
                  <BookOpen size={14} className="text-[#E89B52]" />
                  <span className="font-bold text-xs text-gray-800">{enr.courseName}</span>
                </div>
                <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${
                  isOnline
                    ? 'bg-sky-100 text-sky-800 border-sky-200'
                    : 'bg-emerald-100 text-emerald-800 border-emerald-200'
                }`}>
                  {isOnline ? 'Online Class' : 'In-Person Class'}
                </span>
              </div>

              {/* MY TEACHER Header */}
              <div className="text-[10px] font-black text-gray-400 uppercase tracking-wider font-mono flex items-center justify-between">
                <span>MY ASSIGNED TEACHER</span>
                <span className="text-amber-800 font-bold">{enr.instrument || 'Begena'}</span>
              </div>

              {isAssigned && teacher ? (
                <>
                  {/* Teacher Info Body */}
                  <div className="flex gap-4 items-start">
                    {(() => {
                      const authTeacher = getAuthoritativeUser ? getAuthoritativeUser(teacher?.email || teacher?.id) : undefined;
                      const teacherPhoto = authTeacher?.avatar || teacher?.photo || '';
                      return teacherPhoto ? (
                        <img
                          src={teacherPhoto}
                          alt={teacher?.fullName || 'Assigned Teacher'}
                          className="w-16 h-16 rounded-2xl object-cover border-2 border-[#E89B52] shrink-0 shadow-xs"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-2xl bg-[#FAF6EF] dark:bg-[#1A1A1E] border-2 border-[#E7DED1] shrink-0" />
                      );
                    })()}

                    <div className="space-y-1 text-xs flex-1 min-w-0">
                      <span className="font-bold text-gray-400 text-[10px] uppercase block">Faculty Instructor:</span>
                      <h4 className="font-display font-black text-sm text-[#2B2B2B] truncate">
                        {teacher.fullName}
                      </h4>

                      <div className="grid grid-cols-2 gap-x-2 gap-y-1 pt-1 text-[11px]">
                        <div>
                          <span className="text-gray-400 font-bold block text-[9px] uppercase">Specialization:</span>
                          <span className="font-semibold text-gray-800 truncate block">
                            {teacher.specializations.slice(0, 2).join(', ')}
                          </span>
                        </div>

                        <div>
                          <span className="text-gray-400 font-bold block text-[9px] uppercase">Campus / Mode:</span>
                          <span className="font-semibold text-gray-800 truncate block">
                            {isOnline ? 'Virtual Portal' : (enr.branch || teacher.branches[0] || 'Main Campus')}
                          </span>
                        </div>

                        {isOnline && (
                          <div className="col-span-2">
                            <span className="text-gray-400 font-bold block text-[9px] uppercase">Telegram Contact:</span>
                            <span className="font-mono font-bold text-sky-800 block truncate">
                              {hasTelegram ? `@${cleanTelegram}` : 'Available upon verification'}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Teacher Evaluation Card */}
                  <TeacherStudentEvaluationCard
                    studentId={userId || enr.studentId}
                    instrument={enr.instrument || enr.courseName}
                  />

                  {/* Direct Teacher Message Box */}
                  <TeacherMessageBox
                    enrollmentId={enr.id}
                    studentId={userId || enr.studentId}
                    studentName={currentUser?.fullName || enr.studentName || 'Student'}
                    teacherId={teacher.id}
                    teacherName={teacher.fullName}
                    teacherPhoto={teacher.photo}
                  />
                </>
              ) : (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-amber-900 font-bold">
                    <AlertCircle size={16} className="text-amber-600 shrink-0" />
                    <span>Teacher Assignment Pending</span>
                  </div>
                  <p className="text-amber-800 text-[11px] leading-relaxed">
                    Your specialized {enr.instrument || enr.courseName} teacher will be assigned shortly by academic staff after enrollment verification.
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
