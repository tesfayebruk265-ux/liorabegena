import React, { useState } from 'react';
import { Sparkles, Heart, CheckCircle2, Calendar, Award, MessageSquare, ShieldCheck, Flame } from 'lucide-react';
import { AiChatMessage } from '../../types';
import { askAiAssistant } from './GeminiService';

export const ParentAiAssistant: React.FC = () => {
  const [selectedChild, setSelectedChild] = useState('Yohannes Girma (Begena Level 1)');
  const [messages, setMessages] = useState<AiChatMessage[]>([
    {
      id: 'PAR-01',
      role: 'assistant',
      content:
        'Selam! I am your Parent AI Assistant. I provide accurate, authorized progress summaries, attendance reports, and encouragement tips for your linked student Yohannes Girma.',
      timestamp: '09:30 AM',
      isAiGenerated: true,
      confidence: 'High'
    }
  ]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const parentQuickQuestions = [
    'How is Yohannes progressing this week?',
    'What is he learning in Module 4?',
    'Did he attend yesterday’s class at Bole Branch?',
    'How can I encourage his Begena practice at home?'
  ];

  const handleSend = async (textToSend?: string) => {
    const prompt = textToSend || query;
    if (!prompt.trim()) return;

    const userMsg: AiChatMessage = {
      id: `USR-${Date.now()}`,
      role: 'user',
      content: prompt,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setQuery('');
    setLoading(true);

    const res = await askAiAssistant(prompt, 'Parent', messages);
    setMessages((prev) => [...prev, res]);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-amber-900 text-amber-50 rounded-2xl p-6 shadow-md border border-amber-800/40 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-700/80 text-amber-100 border border-amber-600/50 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-300" /> AI Parent Assistant
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-950/60 text-amber-200 border border-amber-800 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Authorized Linked Access
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Parent Progress AI Companion</h1>
          <p className="text-sm text-amber-200 mt-1">
            Stay closely connected with your child's traditional music journey, attendance, and weekly achievements.
          </p>
        </div>

        <div className="bg-amber-950/60 p-2 rounded-xl border border-amber-800/60 text-xs font-bold text-amber-200">
          Linked Child: {selectedChild}
        </div>
      </div>

      {/* Weekly Highlights Card */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-amber-100 shadow-sm text-center">
          <div className="text-xs text-neutral-500 font-bold">Attendance</div>
          <div className="text-2xl font-extrabold text-amber-900 mt-1">92%</div>
          <div className="text-[10px] text-emerald-700 mt-0.5 font-semibold">Class Present</div>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-amber-100 shadow-sm text-center">
          <div className="text-xs text-neutral-500 font-bold">Practice Streak</div>
          <div className="text-2xl font-extrabold text-amber-900 mt-1 flex items-center justify-center gap-1">
            <Flame className="w-5 h-5 text-amber-600 fill-amber-500" /> 5 Days
          </div>
          <div className="text-[10px] text-amber-700 mt-0.5 font-semibold">30 mins / day</div>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-amber-100 shadow-sm text-center">
          <div className="text-xs text-neutral-500 font-bold">Current Module</div>
          <div className="text-lg font-extrabold text-neutral-800 mt-1">Module 4</div>
          <div className="text-[10px] text-neutral-500 mt-0.5">Begena Octave Muting</div>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-amber-100 shadow-sm text-center">
          <div className="text-xs text-neutral-500 font-bold">Teacher Feedback</div>
          <div className="text-xs font-bold text-emerald-800 bg-emerald-50 p-2 rounded-lg mt-1 border border-emerald-200">
            "Great thumb precision!"
          </div>
        </div>
      </div>

      {/* Chat Section */}
      <div className="bg-white rounded-2xl p-5 border border-amber-100 shadow-sm flex flex-col h-[500px]">
        <div className="flex-1 overflow-y-auto space-y-3 pr-2">
          {messages.map((m) => (
            <div key={m.id} className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`p-4 rounded-2xl text-xs max-w-[85%] leading-relaxed ${m.role === 'user' ? 'bg-amber-800 text-white' : 'bg-stone-50 border border-stone-200 text-neutral-800'}`}>
                {m.content}
              </div>
            </div>
          ))}
          {loading && <div className="text-xs text-neutral-500">Generating parent response...</div>}
        </div>

        {/* Quick Prompts */}
        <div className="pt-2 border-t border-neutral-100 my-2 flex gap-2 overflow-x-auto">
          {parentQuickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="text-xs bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 px-3 py-1.5 rounded-full shrink-0"
            >
              {q}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about your child's progress..."
            className="flex-1 bg-stone-50 border border-stone-300 rounded-xl px-4 py-2 text-xs focus:outline-none"
          />
          <button onClick={() => handleSend()} className="bg-amber-800 text-white px-5 py-2 rounded-xl text-xs font-bold">
            Ask
          </button>
        </div>
      </div>
    </div>
  );
};

