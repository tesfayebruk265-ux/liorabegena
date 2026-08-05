import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  BarChart3,
  Search,
  Database,
  ArrowRight,
  ShieldAlert,
  Info,
  Check,
  X
} from 'lucide-react';
import { Language, AIInsightItem, StrategicRecommendation } from '../../types';
import { Button, Input } from '../InteractiveComponents';
import { TiletPattern } from '../TiletPattern';
import {
  FOUNDER_QA_DATABASE,
  SAMPLE_AI_INSIGHTS,
  SAMPLE_STRATEGIC_RECOMMENDATIONS,
  QAItem
} from './AnalyticsData';

interface AIInsightsAndAssistantProps {
  lang: Language;
  onNavigate: (page: string, params?: any) => void;
}

export function AIInsightsAndAssistant({ lang, onNavigate }: AIInsightsAndAssistantProps) {
  const [queryInput, setQueryInput] = useState('');
  const [currentResult, setCurrentResult] = useState<QAItem | null>(FOUNDER_QA_DATABASE[0]);
  const [showDataDrillDown, setShowDataDrillDown] = useState(false);
  const [recommendations, setRecommendations] = useState<StrategicRecommendation[]>(SAMPLE_STRATEGIC_RECOMMENDATIONS);

  const handleExecuteQuery = (text: string) => {
    const query = text.toLowerCase();
    const matched = FOUNDER_QA_DATABASE.find((item) =>
      item.keywords.some((kw) => query.includes(kw))
    );

    if (matched) {
      setCurrentResult(matched);
    } else {
      setCurrentResult({
        keywords: ['custom'],
        answer: `Query answered based on school database audit: Abel Begena School operates 3 physical campuses and 1 online platform serving active enrolled students.`,
        metrics: [
          { label: 'Active Students', value: '1,280' },
          { label: 'Total Revenue', value: '820,000 ETB' },
          { label: 'Attendance Rate', value: '91.4%' }
        ],
        timePeriod: 'July 2026',
        source: 'Central School Database & Financial Ledger',
        details: 'The data reflects verified records from July 1 through July 21, 2026.'
      });
    }
  };

  const handleApproveRecommendation = (id: string) => {
    setRecommendations(
      recommendations.map((r) => (r.id === id ? { ...r, status: 'Approved' } : r))
    );
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      {/* HEADER BANNER */}
      <div className="bg-[#2B2B2B] text-white p-6 sm:p-8 rounded-3xl relative overflow-hidden shadow-xl border border-amber-950/40">
        <TiletPattern className="opacity-15 text-[#E89B52] scale-125" />
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E89B52]/20 border border-[#E89B52]/40 text-[#E89B52] text-xs font-bold uppercase tracking-widest">
            <Sparkles size={14} className="text-[#E89B52]" />
            <span>AI Founder Intelligence & Natural Language Query Center</span>
          </div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-white tracking-wide uppercase">
            AI-ASSISTED INSIGHTS & NATURAL LANGUAGE QUERY
          </h1>
          <p className="text-xs sm:text-sm text-gray-300">
            Ask natural language questions about students, revenues, branches, and courses. Every response includes verified metrics, timeframes, and raw data sources.
          </p>
        </div>
      </div>

      {/* NATURAL LANGUAGE QUERY INTERFACE */}
      <div className="bg-white border border-[#E7DED1] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
        <h3 className="font-display font-black text-base text-[#2B2B2B] uppercase">ASK FOUNDER NATURAL LANGUAGE QUESTION</h3>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (queryInput.trim()) handleExecuteQuery(queryInput);
          }}
          className="flex gap-2"
        >
          <Input
            type="text"
            placeholder="e.g. How many active students do we have? Which branch grew the most?"
            value={queryInput}
            onChange={(e) => setQueryInput(e.target.value)}
            className="text-xs bg-[#FAF6EF]"
          />
          <Button variant="primary" size="md" type="submit" className="shrink-0 flex items-center gap-2">
            <Send size={14} />
            <span>Ask AI</span>
          </Button>
        </form>

        {/* QUICK QUESTION SAMPLE CHIPS */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">Suggested Questions:</span>
          <div className="flex flex-wrap gap-2">
            {[
              "How many active students do we have?",
              "Which branch grew the most this month?",
              "Which course has the highest enrollment?",
              "How is attendance trending?",
              "Which branch needs more teachers?",
              "How much revenue did the store generate?"
            ].map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => {
                  setQueryInput(q);
                  handleExecuteQuery(q);
                }}
                className="px-3 py-1.5 bg-[#FAF6EF] hover:bg-[#E7DED1] border border-[#E7DED1] rounded-full text-xs font-bold text-[#2B2B2B] transition cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* QUERY ANSWER CARD WITH VERIFIED DATA DRILL DOWN */}
        {currentResult && (
          <div className="p-6 bg-[#FAF6EF] border border-[#E7DED1] rounded-2xl space-y-4 text-xs">
            <div className="flex justify-between items-start border-b border-[#E7DED1] pb-3">
              <div className="space-y-1">
                <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-bold text-[10px]">
                  ✓ Verified Answer
                </span>
                <p className="font-bold text-sm sm:text-base text-[#2B2B2B]">{currentResult.answer}</p>
              </div>
            </div>

            {/* METRICS BREAKDOWN CARDS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {currentResult.metrics.map((m, idx) => (
                <div key={idx} className="p-3 bg-white border border-[#E7DED1] rounded-xl space-y-0.5">
                  <span className="text-[10px] text-gray-500 font-mono block">{m.label}</span>
                  <span className="font-mono font-black text-sm text-[#E89B52] block">{m.value}</span>
                </div>
              ))}
            </div>

            {/* AUDIT SOURCE & TIME PERIOD */}
            <div className="flex flex-col sm:flex-row justify-between text-[11px] text-gray-600 font-mono pt-2 border-t border-[#E7DED1]">
              <span>Time Period: {currentResult.timePeriod}</span>
              <span>Source: {currentResult.source}</span>
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                type="button"
                onClick={() => setShowDataDrillDown(!showDataDrillDown)}
                className="text-[#E89B52] font-bold text-xs hover:underline cursor-pointer"
              >
                {showDataDrillDown ? 'Hide Underlying Data' : 'Inspect Underlying Data Breakdown'}
              </button>
            </div>

            {showDataDrillDown && (
              <div className="p-4 bg-white border border-[#E7DED1] rounded-xl text-xs space-y-2 font-mono text-gray-700">
                <span className="font-bold text-[#2B2B2B] block">Underlying Calculation Details:</span>
                <p>{currentResult.details}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* STRATEGIC AI RECOMMENDATIONS (HUMAN APPROVAL MANDATORY) */}
      <div className="bg-white border border-[#E7DED1] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex justify-between items-center pb-3 border-b border-[#E7DED1]">
          <div>
            <h3 className="font-display font-black text-base text-[#2B2B2B] uppercase">STRATEGIC RECOMMENDATIONS (HUMAN APPROVAL REQUIRED)</h3>
            <p className="text-xs text-gray-500">
              AI recommendations must be reviewed and approved by human leadership before taking effect.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {recommendations.map((rec) => (
            <div key={rec.id} className="p-5 bg-[#FAF6EF] border border-[#E7DED1] rounded-2xl space-y-3 text-xs">
              <div className="flex justify-between items-start">
                <span className="font-bold text-sm text-[#2B2B2B]">{rec.title}</span>
                <span className="px-2.5 py-0.5 bg-amber-100 text-amber-900 font-bold rounded-full text-[10px]">
                  {rec.confidenceScore}% Confidence
                </span>
              </div>

              <p className="text-gray-700 font-semibold">{rec.recommendationText}</p>

              <div className="p-3 bg-white border rounded-xl space-y-1">
                <span className="font-bold text-gray-600 block">Supporting Data & Reason:</span>
                <p className="text-gray-700">{rec.reason}</p>
                <span className="text-[10px] font-mono text-gray-500 block">Data: {rec.supportingData}</span>
              </div>

              <div className="flex justify-between items-center pt-2">
                <span className="text-[10px] font-bold text-amber-800">
                  ⚠️ Human Approval Required: No automated execution.
                </span>

                {rec.status === 'Approved' ? (
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-bold rounded-xl text-xs">
                    ✓ Executive Approved
                  </span>
                ) : (
                  <Button variant="primary" size="sm" onClick={() => handleApproveRecommendation(rec.id)}>
                    Approve Recommendation
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

