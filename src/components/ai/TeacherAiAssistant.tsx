import React, { useState } from 'react';
import {
  Sparkles,
  Users,
  AlertTriangle,
  FileText,
  CheckCircle2,
  Send,
  Plus,
  BookOpen,
  Edit3,
  Clock,
  BrainCircuit,
  MessageSquare,
  ThumbsUp,
  XCircle
} from 'lucide-react';
import { AiChatMessage } from '../../types';
import { askAiAssistant } from './GeminiService';

export const TeacherAiAssistant: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'risk' | 'lesson-plan' | 'feedback-drafter' | 'chat'>('risk');

  // Risk Insights Data
  const studentRiskList = [
    {
      id: 'STU-101',
      name: 'Yohannes Girma',
      course: 'Begena Level 1 (Bole Branch)',
      riskType: 'Low Practice & Missed Homework',
      attendancePercent: '70%',
      lastPractice: '5 days ago',
      recommendedAction: 'Send encouraging Telegram practice nudge & request parent check-in'
    },
    {
      id: 'STU-102',
      name: 'Lydia Mekonnen',
      course: 'Krar Intermediate (Online)',
      riskType: '2 Consecutive Absences',
      attendancePercent: '60%',
      lastPractice: '7 days ago',
      recommendedAction: 'Trigger automatic makeup class scheduling reminder'
    }
  ];

  // Lesson Plan Generator State
  const [lessonTopic, setLessonTopic] = useState('Begena Octave Transition & Left-Hand Muting');
  const [targetLevel, setTargetLevel] = useState('Level 1 - Intermediate');
  const [generatedLessonPlan, setGeneratedLessonPlan] = useState<any | null>(null);
  const [lessonPlanApproved, setLessonPlanApproved] = useState(false);

  // Feedback Drafter State
  const [selectedStudent, setSelectedStudent] = useState(studentRiskList[0]);
  const [draftedFeedback, setDraftedFeedback] = useState<string>(
    `Dear Yohannes,\n\nI noticed you did great on String 1-5 open plucking! To help you nail the octave transition for our upcoming recital, try spending 10 minutes today on left-hand index muting. You can do this!\n\nWarm regards,\nInstructor Yared`
  );
  const [feedbackSent, setFeedbackSent] = useState(false);

  // Chat State
  const [messages, setMessages] = useState<AiChatMessage[]>([
    {
      id: 'TCH-01',
      role: 'assistant',
      content:
        'Selam Instructor Yared! I am your AI Teaching Assistant. I can summarize class performance, identify students needing attention, draft lesson plans, or generate practice quizzes for your approval.',
      timestamp: '09:00 AM',
      isAiGenerated: true,
      confidence: 'High'
    }
  ]);
  const [chatQuery, setChatQuery] = useState('');
  const [loadingChat, setLoadingChat] = useState(false);

  const handleGenerateLessonPlan = () => {
    setLessonPlanApproved(false);
    setGeneratedLessonPlan({
      title: lessonTopic,
      level: targetLevel,
      objective: 'Students will execute 10-string octave transitions with under 0.2s mute delay.',
      durationMinutes: 45,
      sections: [
        { phase: 'Intro & Tuning Check (10 mins)', detail: 'Check Sera buzzing alignment on strings 3 and 7.' },
        { phase: 'Theory Demonstration (10 mins)', detail: 'Demonstrate Ge’ez Yizet notation accent on high octave.' },
        { phase: 'Guided Student Practice (15 mins)', detail: 'Paired plucking exercises with metronome at 60 BPM.' },
        { phase: 'Assessment & Homework (10 mins)', detail: 'Record 30-sec video submission of Stanza 1 transition.' }
      ]
    });
  };

  const handleSendChat = async () => {
    if (!chatQuery.trim()) return;
    const userMsg: AiChatMessage = {
      id: `USR-${Date.now()}`,
      role: 'user',
      content: chatQuery,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages((prev) => [...prev, userMsg]);
    setChatQuery('');
    setLoadingChat(true);

    const res = await askAiAssistant(chatQuery, 'Teacher', messages);
    setMessages((prev) => [...prev, res]);
    setLoadingChat(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-amber-900 text-amber-50 rounded-2xl p-6 shadow-md border border-amber-800/40 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-700/80 text-amber-100 border border-amber-600/50 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-300" /> AI Assistant
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-950/60 text-amber-200 border border-amber-800">
              Teacher Mode
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Teacher AI Assistant & Academic Copilot</h1>
          <p className="text-sm text-amber-200 mt-1">
            Identify students at risk, generate draft lesson plans, and draft feedback for your official approval.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-amber-950/60 p-1.5 rounded-xl border border-amber-800/60 text-xs font-medium">
          <button
            onClick={() => setActiveTab('risk')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'risk' ? 'bg-amber-600 text-white font-bold' : 'text-amber-200 hover:text-white'
            }`}
          >
            Student Risk Alerts
          </button>
          <button
            onClick={() => setActiveTab('lesson-plan')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'lesson-plan' ? 'bg-amber-600 text-white font-bold' : 'text-amber-200 hover:text-white'
            }`}
          >
            Lesson Plan Generator
          </button>
          <button
            onClick={() => setActiveTab('feedback-drafter')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'feedback-drafter' ? 'bg-amber-600 text-white font-bold' : 'text-amber-200 hover:text-white'
            }`}
          >
            Feedback Drafter
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'chat' ? 'bg-amber-600 text-white font-bold' : 'text-amber-200 hover:text-white'
            }`}
          >
            AI Academic Chat
          </button>
        </div>
      </div>

      {/* TAB 1: STUDENT RISK INSIGHTS */}
      {activeTab === 'risk' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-6 border border-amber-100 shadow-sm space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-neutral-100">
              <div>
                <h3 className="text-base font-bold text-neutral-800 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-700" /> Student Risk Alerts & Attention Needed
                </h3>
                <p className="text-xs text-neutral-500">
                  AI continuously monitors attendance logs, practice streaks, and submission deadlines.
                </p>
              </div>
              <span className="text-xs font-bold px-3 py-1 bg-amber-100 text-amber-900 rounded-full">
                2 Students Need Attention
              </span>
            </div>

            <div className="space-y-3">
              {studentRiskList.map((stu) => (
                <div key={stu.id} className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div>
                      <h4 className="font-bold text-neutral-800 text-sm">{stu.name}</h4>
                      <p className="text-xs text-neutral-500">{stu.course}</p>
                    </div>
                    <span className="px-2.5 py-1 bg-red-100 text-red-800 font-bold text-xs rounded-lg border border-red-200">
                      {stu.riskType}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-neutral-600 pt-1">
                    <div>
                      <span className="font-semibold text-neutral-400">Attendance:</span> {stu.attendancePercent}
                    </div>
                    <div>
                      <span className="font-semibold text-neutral-400">Last Practice:</span> {stu.lastPractice}
                    </div>
                  </div>

                  <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-900 flex justify-between items-center">
                    <div>
                      <span className="font-bold">AI Recommended Action:</span> {stu.recommendedAction}
                    </div>
                    <button
                      onClick={() => {
                        setSelectedStudent(stu);
                        setActiveTab('feedback-drafter');
                      }}
                      className="bg-amber-800 text-white font-bold px-3 py-1.5 rounded-lg hover:bg-amber-900 transition-colors shrink-0"
                    >
                      Draft Feedback
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: LESSON PLAN GENERATOR */}
      {activeTab === 'lesson-plan' && (
        <div className="bg-white rounded-2xl p-6 border border-amber-100 shadow-sm space-y-6">
          <div className="pb-3 border-b border-neutral-100">
            <h3 className="text-base font-bold text-neutral-800 flex items-center gap-2">
              <FileText className="w-5 h-5 text-amber-700" /> AI Lesson Plan Generator
            </h3>
            <p className="text-xs text-neutral-500">
              Generate structured, curriculum-aligned lesson plans with objective, theory, demonstration, and homework.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-neutral-700 block mb-1">Topic / Skill:</label>
              <input
                type="text"
                value={lessonTopic}
                onChange={(e) => setLessonTopic(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs focus:outline-none"
              />
            </div>
            <div>
              <label className="font-bold text-neutral-700 block mb-1">Target Level:</label>
              <select
                value={targetLevel}
                onChange={(e) => setTargetLevel(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs focus:outline-none"
              >
                <option value="Level 1 - Beginner">Begena Level 1 - Beginner</option>
                <option value="Level 1 - Intermediate">Begena Level 1 - Intermediate</option>
                <option value="Level 2 - Advanced">Begena Level 2 - Advanced</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleGenerateLessonPlan}
            className="bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4 text-amber-300" /> Generate AI Draft Lesson Plan
          </button>

          {generatedLessonPlan && (
            <div className="p-5 bg-stone-50 border border-stone-200 rounded-2xl space-y-4">
              <div className="flex justify-between items-center border-b border-stone-200 pb-3">
                <div>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 bg-amber-100 text-amber-900 rounded">
                    AI Suggested Draft
                  </span>
                  <h4 className="font-bold text-neutral-800 text-base mt-1">{generatedLessonPlan.title}</h4>
                  <p className="text-xs text-neutral-500">{generatedLessonPlan.level} ({generatedLessonPlan.durationMinutes} mins)</p>
                </div>

                <div className="flex gap-2">
                  {!lessonPlanApproved ? (
                    <button
                      onClick={() => setLessonPlanApproved(true)}
                      className="bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1 hover:bg-emerald-800 transition-colors"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Approve & Save Plan
                    </button>
                  ) : (
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-300 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Teacher Approved
                    </span>
                  )}
                </div>
              </div>

              <div className="text-xs space-y-2">
                <div className="p-3 bg-white rounded-xl border border-stone-200">
                  <span className="font-bold text-neutral-800">Learning Objective:</span> {generatedLessonPlan.objective}
                </div>

                <div className="space-y-2 pt-2">
                  {generatedLessonPlan.sections.map((sec: any, idx: number) => (
                    <div key={idx} className="p-3 bg-white rounded-xl border border-stone-200 flex justify-between items-center">
                      <div>
                        <div className="font-bold text-neutral-800">{sec.phase}</div>
                        <p className="text-neutral-500 mt-0.5">{sec.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: FEEDBACK DRAFTER */}
      {activeTab === 'feedback-drafter' && (
        <div className="bg-white rounded-2xl p-6 border border-amber-100 shadow-sm space-y-4">
          <div className="pb-3 border-b border-neutral-100">
            <h3 className="text-base font-bold text-neutral-800 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-amber-700" /> AI Feedback Drafter with Teacher Approval
            </h3>
            <p className="text-xs text-neutral-500">
              The AI drafts encouraging feedback based on practice logs. You must review and approve before sending.
            </p>
          </div>

          <div className="space-y-3">
            <div className="text-xs font-bold text-neutral-700">Student: {selectedStudent.name} ({selectedStudent.course})</div>
            <textarea
              rows={5}
              value={draftedFeedback}
              onChange={(e) => setDraftedFeedback(e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl p-3 text-xs focus:outline-none leading-relaxed"
            />

            <div className="flex justify-between items-center pt-2">
              <span className="text-[11px] text-stone-500 font-medium">
                * Note: Message will be sent via Telegram / SMS only after your explicit click.
              </span>

              {!feedbackSent ? (
                <button
                  onClick={() => setFeedbackSent(true)}
                  className="bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" /> Approve & Send Message
                </button>
              ) : (
                <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-300 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Message Sent to Student
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: CHAT */}
      {activeTab === 'chat' && (
        <div className="bg-white rounded-2xl p-5 border border-amber-100 shadow-sm flex flex-col h-[500px]">
          <div className="flex-1 overflow-y-auto space-y-3 pr-2">
            {messages.map((m) => (
              <div key={m.id} className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`p-3 rounded-2xl text-xs max-w-[80%] ${m.role === 'user' ? 'bg-amber-800 text-white' : 'bg-stone-50 border border-stone-200 text-neutral-800'}`}>
                  {m.content}
                </div>
              </div>
            ))}
            {loadingChat && <div className="text-xs text-neutral-500">Teacher AI is generating response...</div>}
          </div>

          <div className="flex gap-2 pt-3 border-t border-stone-200">
            <input
              type="text"
              value={chatQuery}
              onChange={(e) => setChatQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
              placeholder="Ask teacher assistant..."
              className="flex-1 bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs focus:outline-none"
            />
            <button onClick={handleSendChat} className="bg-amber-800 text-white px-4 py-2 rounded-xl text-xs font-bold">
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

