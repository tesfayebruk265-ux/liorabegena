import React, { useState } from 'react';
import {
  Sparkles,
  ShieldAlert,
  Building2,
  DollarSign,
  TrendingUp,
  Search,
  CheckCircle2,
  XCircle,
  FileText,
  Lock,
  Layers,
  BarChart3,
  AlertTriangle,
  Send,
  HelpCircle
} from 'lucide-react';
import { AiChatMessage, AiAuditLogItem, AiKnowledgeDoc } from '../../types';
import { SAMPLE_AUDIT_LOGS, SAMPLE_KNOWLEDGE_DOCS } from './AiData';
import { askAiAssistant } from './GeminiService';

interface ManagementAiAssistantProps {
  role: 'BranchManager' | 'Accountant' | 'Admin' | 'Founder';
}

export const ManagementAiAssistant: React.FC<ManagementAiAssistantProps> = ({ role }) => {
  const [activeTab, setActiveTab] = useState<'briefing' | 'chat' | 'search' | 'audit' | 'knowledge'>('briefing');

  // Briefing State
  const [actionStatus, setActionStatus] = useState<Record<string, 'Approved' | 'Rejected' | 'Pending'>>({
    'ACT-01': 'Pending',
    'ACT-02': 'Pending'
  });

  // Chat State
  const [messages, setMessages] = useState<AiChatMessage[]>([
    {
      id: 'MGT-01',
      role: 'assistant',
      content: `Selam! I am your ${role} AI Strategic & Operational Assistant. I provide real-time data analysis, strategic briefings, and operational recommendations across all Liora Begena branches.`,
      timestamp: '08:00 AM',
      isAiGenerated: true,
      confidence: 'High'
    }
  ]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  // Natural Language Search State
  const [searchQuery, setSearchQuery] = useState('Show me students in Bole branch with overdue homework');
  const [searchResults, setSearchResults] = useState<string | null>(null);

  const roleTitles = {
    BranchManager: 'Branch Manager AI Operations Assistant',
    Accountant: 'Accountant AI Financial Analytics Assistant',
    Admin: 'Admin AI Systems Command Assistant',
    Founder: 'Founder Strategic AI Command Center'
  };

  const handleSendChat = async (textToSend?: string) => {
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

    const res = await askAiAssistant(prompt, role, messages);
    setMessages((prev) => [...prev, res]);
    setLoading(false);
  };

  const handleSearchExecute = () => {
    if (searchQuery.toLowerCase().includes('delete') || searchQuery.toLowerCase().includes('drop')) {
      setSearchResults(
        '⚠️ SAFETY GUARDIAN BLOCKED COMMAND:\nDestructive commands (delete/drop) are strictly prohibited via natural language search. Please contact System Administrator.'
      );
      return;
    }

    setSearchResults(
      `Search Results for "${searchQuery}":\n\n` +
        `1. Yohannes Girma - Begena Level 1 (Bole Branch) - Missing Assignment #3\n` +
        `2. Meron Tadesse - Begena Level 1 (Bole Branch) - Missing Assignment #3\n\n` +
        `*Data returned safely in Read-Only Mode.*`
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-amber-900 text-amber-50 rounded-2xl p-6 shadow-md border border-amber-800/40 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-700/80 text-amber-100 border border-amber-600/50 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-300" /> Executive AI
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-950/60 text-amber-200 border border-amber-800">
              {role} View
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">{roleTitles[role]}</h1>
          <p className="text-sm text-amber-200 mt-1">
            Data-backed strategic intelligence, operational summaries, and human-in-the-loop decision center.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-amber-950/60 p-1.5 rounded-xl border border-amber-800/60 text-xs font-medium">
          <button
            onClick={() => setActiveTab('briefing')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'briefing' ? 'bg-amber-600 text-white font-bold' : 'text-amber-200 hover:text-white'
            }`}
          >
            {role === 'Founder' ? 'Founder Briefings' : 'Executive Briefing'}
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'chat' ? 'bg-amber-600 text-white font-bold' : 'text-amber-200 hover:text-white'
            }`}
          >
            AI Strategic Chat
          </button>
          <button
            onClick={() => setActiveTab('search')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'search' ? 'bg-amber-600 text-white font-bold' : 'text-amber-200 hover:text-white'
            }`}
          >
            NL School Search
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'audit' ? 'bg-amber-600 text-white font-bold' : 'text-amber-200 hover:text-white'
            }`}
          >
            Audit Logs
          </button>
        </div>
      </div>

      {/* Financial Protection Notice for Accountant */}
      {role === 'Accountant' && (
        <div className="p-4 bg-amber-50 rounded-2xl border border-amber-300 text-xs text-amber-900 flex items-center gap-3">
          <Lock className="w-5 h-5 text-amber-800 shrink-0" />
          <div>
            <span className="font-bold">Financial Security Rule:</span> AI operates in strictly read-only analytical mode. The AI cannot execute payments, process refunds, alter tuition pricing, or modify transaction ledgers.
          </div>
        </div>
      )}

      {/* TAB 1: BRIEFINGS & ACTION CENTER */}
      {activeTab === 'briefing' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-amber-100 shadow-sm">
              <div className="text-xs text-neutral-500 font-bold">Total Active Students</div>
              <div className="text-2xl font-extrabold text-amber-900 mt-1">1,280</div>
              <div className="text-[10px] text-emerald-700 font-semibold mt-1">↑ +14% vs Last Month</div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-amber-100 shadow-sm">
              <div className="text-xs text-neutral-500 font-bold">Monthly Revenue (ETB)</div>
              <div className="text-2xl font-extrabold text-amber-900 mt-1">1,450,000 ETB</div>
              <div className="text-[10px] text-emerald-700 font-semibold mt-1">↑ +18% MoM Growth</div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-amber-100 shadow-sm">
              <div className="text-xs text-neutral-500 font-bold">Top Performing Branch</div>
              <div className="text-xl font-extrabold text-neutral-800 mt-1">Bole Medhanealem</div>
              <div className="text-[10px] text-amber-800 font-semibold mt-1">94% Capacity Filled</div>
            </div>
          </div>

          {/* Action Center with Approval/Rejection Workflows */}
          <div className="bg-white rounded-2xl p-6 border border-amber-100 shadow-sm space-y-4">
            <div className="pb-3 border-b border-neutral-100 flex justify-between items-center">
              <div>
                <h3 className="text-base font-bold text-neutral-800 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-700" /> AI Action Center & Human Approval Queue
                </h3>
                <p className="text-xs text-neutral-500">
                  AI suggestions require explicit approval from the Founder/Manager before system execution.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs">
                <div>
                  <div className="font-bold text-neutral-800 text-sm">
                    Open Weekend Evening Begena Batch (Bole Branch)
                  </div>
                  <p className="text-neutral-500 mt-1">
                    Demand Analysis: 42 waiting list students for Saturday 4 PM slot. Projected revenue: +126,000 ETB/mo.
                  </p>
                  <span className="inline-block mt-2 font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded text-[10px]">
                    Confidence: HIGH (94%)
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {actionStatus['ACT-01'] === 'Pending' ? (
                    <>
                      <button
                        onClick={() => setActionStatus((prev) => ({ ...prev, 'ACT-01': 'Approved' }))}
                        className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-3 py-1.5 rounded-lg flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                      </button>
                      <button
                        onClick={() => setActionStatus((prev) => ({ ...prev, 'ACT-01': 'Rejected' }))}
                        className="bg-stone-300 hover:bg-stone-400 text-neutral-800 font-bold px-3 py-1.5 rounded-lg flex items-center gap-1"
                      >
                        <XCircle className="w-3.5 h-3.5" /> Decline
                      </button>
                    </>
                  ) : (
                    <span className={`font-bold px-3 py-1.5 rounded-lg ${actionStatus['ACT-01'] === 'Approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                      Status: {actionStatus['ACT-01']}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CHAT */}
      {activeTab === 'chat' && (
        <div className="bg-white rounded-2xl p-5 border border-amber-100 shadow-sm flex flex-col h-[500px]">
          <div className="flex-1 overflow-y-auto space-y-3 pr-2">
            {messages.map((m) => (
              <div key={m.id} className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`p-4 rounded-2xl text-xs max-w-[85%] leading-relaxed ${m.role === 'user' ? 'bg-amber-800 text-white' : 'bg-stone-50 border border-stone-200 text-neutral-800'}`}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && <div className="text-xs text-neutral-500">Generating strategic response...</div>}
          </div>

          <div className="flex gap-2 pt-3 border-t border-stone-200">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
              placeholder="Ask strategic or operational questions..."
              className="flex-1 bg-stone-50 border border-stone-300 rounded-xl px-4 py-2 text-xs focus:outline-none"
            />
            <button onClick={() => handleSendChat()} className="bg-amber-800 text-white px-5 py-2 rounded-xl text-xs font-bold">
              Ask
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: NATURAL LANGUAGE SCHOOL SEARCH */}
      {activeTab === 'search' && (
        <div className="bg-white rounded-2xl p-6 border border-amber-100 shadow-sm space-y-4">
          <div className="pb-3 border-b border-neutral-100">
            <h3 className="text-base font-bold text-neutral-800 flex items-center gap-2">
              <Search className="w-5 h-5 text-amber-700" /> Natural Language School Search
            </h3>
            <p className="text-xs text-neutral-500">
              Query school database using natural language (e.g. "Show students with low practice rate in Bole").
            </p>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-stone-50 border border-stone-300 rounded-xl px-4 py-2.5 text-xs focus:outline-none"
            />
            <button onClick={handleSearchExecute} className="bg-amber-800 text-white px-5 py-2.5 rounded-xl text-xs font-bold">
              Run Search
            </button>
          </div>

          {searchResults && (
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 text-xs text-neutral-800 whitespace-pre-line leading-relaxed font-mono">
              {searchResults}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: AUDIT LOGS */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-2xl p-6 border border-amber-100 shadow-sm space-y-4">
          <div className="pb-3 border-b border-neutral-100">
            <h3 className="text-base font-bold text-neutral-800 flex items-center gap-2">
              <FileText className="w-5 h-5 text-amber-700" /> AI Audit Logs & Role Permissions
            </h3>
            <p className="text-xs text-neutral-500">
              Full transparency log of all AI queries, data access events, and human approval decisions.
            </p>
          </div>

          <div className="space-y-3">
            {SAMPLE_AUDIT_LOGS.map((log) => (
              <div key={log.id} className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 text-xs space-y-1">
                <div className="flex justify-between font-bold text-neutral-800">
                  <span>{log.userName} ({log.userRole})</span>
                  <span className="text-stone-400 font-mono text-[10px]">{log.timestamp}</span>
                </div>
                <p className="text-neutral-600">Query: {log.querySummary}</p>
                <div className="flex justify-between text-[11px] pt-1 text-neutral-500">
                  <span>Data Accessed: {log.dataAccessed}</span>
                  <span className="font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">{log.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

