import React from 'react';
import {
  User,
  Phone,
  Send,
  ArrowRight,
  CheckCircle2,
  Clock,
  DollarSign,
  Award,
  ChevronRight,
  TrendingUp,
  Tag
} from 'lucide-react';
import { LeadItem, Language } from '../../types';

interface KanbanPipelineViewProps {
  leads: LeadItem[];
  onSelectLead: (lead: LeadItem) => void;
  onMoveStage: (leadId: string, newStage: NonNullable<LeadItem['prospectStage']>) => void;
  lang: Language;
}

const KANBAN_STAGES: NonNullable<LeadItem['prospectStage']>[] = [
  'New Lead',
  'Contacted',
  'Interested',
  'Qualified',
  'Trial / Consultation',
  'Registration Started',
  'Payment Pending',
  'Enrolled'
];

export function KanbanPipelineView({ leads, onSelectLead, onMoveStage, lang }: KanbanPipelineViewProps) {
  return (
    <div className="space-y-4 text-left">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-bold text-lg text-[#2B2B2B]">Interactive Student Acquisition Pipeline</h3>
        <p className="text-xs text-[#666666]">
          Total Leads in Pipeline: <strong className="text-[#E89B52]">{leads.length}</strong>
        </p>
      </div>

      <div className="flex items-start gap-3 overflow-x-auto pb-6 pt-2 scrollbar-thin">
        {KANBAN_STAGES.map((stage) => {
          const stageLeads = leads.filter((l) => (l.prospectStage || 'New Lead') === stage);

          return (
            <div
              key={stage}
              className="w-72 shrink-0 bg-[#FAF6EF]/70 border border-[#E7DED1] rounded-2xl p-3 space-y-3 min-h-[500px]"
            >
              {/* STAGE HEADER */}
              <div className="flex items-center justify-between pb-2 border-b border-[#E7DED1]">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#E89B52]" />
                  <h4 className="font-display font-bold text-xs text-[#2B2B2B]">{stage}</h4>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white border border-[#E7DED1] text-[#E89B52]">
                  {stageLeads.length}
                </span>
              </div>

              {/* LEADS LIST IN STAGE */}
              <div className="space-y-3">
                {stageLeads.map((lead) => (
                  <div
                    key={lead.id}
                    onClick={() => onSelectLead(lead)}
                    className="bg-white border border-[#E7DED1] rounded-xl p-3.5 shadow-2xs hover:border-[#E89B52] transition-all cursor-pointer space-y-2 group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[9px] font-bold text-[#666666]">{lead.id}</span>
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#E89B52]/10 text-[#E89B52]">
                        Score: {lead.score}
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <img
                        src={
                          lead.photo ||
                          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
                        }
                        alt={lead.fullName}
                        className="w-8 h-8 rounded-full object-cover border border-[#E7DED1]"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <h5 className="font-display font-bold text-xs text-[#2B2B2B] group-hover:text-[#E89B52] transition-colors">
                          {lead.fullName}
                        </h5>
                        <p className="text-[10px] text-[#666666]">{lead.interestedInstrument} • {lead.preferredBranch}</p>
                      </div>
                    </div>

                    <div className="p-2 bg-[#FAF6EF] rounded-lg text-[10px] space-y-1">
                      <p className="font-semibold text-[#2B2B2B] truncate">{lead.interestedCourse}</p>
                      <div className="flex justify-between items-center text-[#666666]">
                        <span>Src: {lead.source}</span>
                        <span>{lead.phone}</span>
                      </div>
                    </div>

                    {/* STAGE MOVER DROPDOWN */}
                    <div className="pt-1 flex items-center justify-between text-[10px] border-t border-[#E7DED1]">
                      <span className="text-[#666666]">Move Stage:</span>
                      <select
                        value={stage}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => onMoveStage(lead.id, e.target.value as NonNullable<LeadItem['prospectStage']>)}
                        className="px-1.5 py-0.5 border border-[#E7DED1] rounded bg-white text-[10px] font-bold focus:outline-none"
                      >
                        {KANBAN_STAGES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}

                {stageLeads.length === 0 && (
                  <div className="py-12 text-center text-[11px] text-[#9E9E9E] italic border-2 border-dashed border-[#E7DED1] rounded-xl bg-white/50">
                    No leads in {stage}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

