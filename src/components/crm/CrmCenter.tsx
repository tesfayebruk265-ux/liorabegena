import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  TrendingUp,
  Target,
  Megaphone,
  CheckCircle2,
  Clock,
  Phone,
  Send,
  Calendar,
  Search,
  Filter,
  Plus,
  HelpCircle,
  Award,
  DollarSign,
  Download,
  Upload,
  BarChart3,
  BookOpen,
  Share2,
  QrCode,
  Tag,
  AlertTriangle,
  UserCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  LeadItem,
  InquiryItem,
  LeadActivity,
  FollowUpItem,
  CrmTaskItem,
  TrialSessionItem,
  CampaignItem,
  ReferralItem,
  PromoCodeItem,
  Language,
  PageId
} from '../../types';
import {
  SAMPLE_LEADS,
  SAMPLE_INQUIRIES,
  SAMPLE_LEAD_ACTIVITIES,
  SAMPLE_FOLLOW_UPS,
  SAMPLE_CRM_TASKS,
  SAMPLE_TRIAL_SESSIONS,
  SAMPLE_CAMPAIGNS,
  SAMPLE_REFERRALS,
  SAMPLE_PROMO_CODES
} from './CrmData';
import { LeadDetailPage } from './LeadDetailPage';
import { KanbanPipelineView } from './KanbanPipelineView';
import { CampaignsCenter } from './CampaignsCenter';
import { CourseMarketingLanding } from './CourseMarketingLanding';
import { useAuth } from '../../context/AuthContext';

interface CrmCenterProps {
  lang: Language;
  onNavigate: (page: PageId, params?: any) => void;
  initialTab?: string;
}

export function CrmCenter({ lang, onNavigate, initialTab = 'dashboard' }: CrmCenterProps) {
  const { currentUser } = useAuth();

  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'leads' | 'kanban' | 'inquiries' | 'followups' | 'tasks' | 'trials' | 'campaigns' | 'referrals' | 'courses' | 'reports'
  >(initialTab as any || 'dashboard');

  // CRM Central State
  const [leads, setLeads] = useState<LeadItem[]>(SAMPLE_LEADS);
  const [inquiries, setInquiries] = useState<InquiryItem[]>(SAMPLE_INQUIRIES);
  const [activities, setActivities] = useState<LeadActivity[]>(SAMPLE_LEAD_ACTIVITIES);
  const [followUps, setFollowUps] = useState<FollowUpItem[]>(SAMPLE_FOLLOW_UPS);
  const [tasks, setTasks] = useState<CrmTaskItem[]>(SAMPLE_CRM_TASKS);
  const [trials, setTrials] = useState<TrialSessionItem[]>(SAMPLE_TRIAL_SESSIONS);

  // Selected Lead State
  const [selectedLead, setSelectedLead] = useState<LeadItem | null>(null);

  // Filters & Search State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [branchFilter, setBranchFilter] = useState('All');

  // Modal State for New Inquiry
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  const [inquiryCourseName, setInquiryCourseName] = useState('');
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [inquiryEmail, setInquiryEmail] = useState('');
  const [inquiryMessage, setInquiryMessage] = useState('');

  // Duplicate warning state for new lead / inquiry
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);

  // Modal State for New Trial Session
  const [isTrialModalOpen, setIsTrialModalOpen] = useState(false);
  const [trialCourseName, setTrialCourseName] = useState('');
  const [trialName, setTrialName] = useState('');
  const [trialPhone, setTrialPhone] = useState('');
  const [trialDate, setTrialDate] = useState('');
  const [trialBranch, setTrialBranch] = useState('Piazza Headquarters');

  // Handlers
  const handleUpdateLead = (updated: LeadItem) => {
    setLeads(leads.map((l) => (l.id === updated.id ? updated : l)));
    if (selectedLead?.id === updated.id) {
      setSelectedLead(updated);
    }
  };

  const handleAddActivity = (newAct: LeadActivity) => {
    setActivities([newAct, ...activities]);
  };

  const handleScheduleFollowUp = (newFlp: FollowUpItem) => {
    setFollowUps([newFlp, ...followUps]);
  };

  const handleMoveKanbanStage = (leadId: string, newStage: NonNullable<LeadItem['prospectStage']>) => {
    setLeads(
      leads.map((l) => {
        if (l.id === leadId) {
          return { ...l, prospectStage: newStage, lastContact: new Date().toISOString().split('T')[0] };
        }
        return l;
      })
    );
  };

  const handleConvertInquiryToLead = (inq: InquiryItem) => {
    // Check duplicate phone or email
    const duplicate = leads.find((l) => l.phone === inq.phone || l.email === inq.email);
    if (duplicate) {
      setDuplicateWarning(`Warning: Potential Duplicate Lead Found (${duplicate.fullName} - ${duplicate.phone})`);
    }

    const newLead: LeadItem = {
      id: `LD-${Date.now()}`,
      fullName: inq.name,
      phone: inq.phone,
      email: inq.email,
      preferredBranch: inq.preferredBranch || 'Piazza Headquarters',
      interestedCourse: inq.courseName || 'Traditional Begena Sacred Harp',
      interestedInstrument: 'Begena',
      interestedLevel: 'Beginner',
      preferredLearningMode: 'In-Person',
      preferredSchedule: 'Weekend',
      source: 'Website',
      notes: `Converted from Inquiry: ${inq.message}`,
      assignedStaffId: currentUser?.id || 'STF-001',
      assignedStaffName: currentUser?.fullName || 'Saba Tesfaye',
      status: 'New',
      createdAt: new Date().toISOString().split('T')[0],
      lastContact: new Date().toISOString().split('T')[0],
      score: 50,
      scoreBreakdown: [{ reason: 'Converted Website Inquiry', points: 50 }],
      prospectStage: 'New Lead'
    };

    setLeads([newLead, ...leads]);
    setInquiries(inquiries.map((i) => (i.id === inq.id ? { ...i, status: 'Converted to Lead' } : i)));
    alert(`Inquiry from ${inq.name} successfully converted to Lead ${newLead.id}!`);
  };

  const handleCreateInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryName.trim() || !inquiryPhone.trim()) return;

    const newInq: InquiryItem = {
      id: `INQ-${Date.now()}`,
      name: inquiryName,
      phone: inquiryPhone,
      email: inquiryEmail,
      type: 'Course Inquiry',
      courseName: inquiryCourseName || 'Traditional Begena Sacred Harp',
      preferredBranch: 'Piazza Headquarters',
      preferredContactMethod: 'Telegram',
      message: inquiryMessage,
      createdAt: new Date().toLocaleString(),
      status: 'New'
    };

    setInquiries([newInq, ...inquiries]);
    setIsInquiryModalOpen(false);
    setInquiryName('');
    setInquiryPhone('');
    setInquiryMessage('');
    alert('Thank you! Your inquiry has been submitted and routed to our Registration Team.');
  };

  const handleBookTrialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trialName || !trialPhone) return;

    const newTrl: TrialSessionItem = {
      id: `TRL-${Date.now()}`,
      leadId: `LD-${Date.now()}`,
      leadName: trialName,
      phone: trialPhone,
      instrument: trialCourseName || 'Begena',
      preferredBranch: trialBranch,
      preferredDate: trialDate || '2026-07-28',
      preferredTime: '10:00 AM',
      status: 'Requested',
      notes: 'Submitted via public trial booking widget'
    };

    setTrials([newTrl, ...trials]);
    setIsTrialModalOpen(false);
    setTrialName('');
    setTrialPhone('');
    alert('Introductory Trial Session Requested! Our registration team will call you to confirm your schedule.');
  };

  // Filtered Leads
  const filteredLeads = leads.filter((l) => {
    const matchesSearch =
      l.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.phone.includes(searchTerm) ||
      l.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'All' || l.status === statusFilter;
    const matchesBranch = branchFilter === 'All' || l.preferredBranch === branchFilter;

    return matchesSearch && matchesStatus && matchesBranch;
  });

  return (
    <div className="space-y-8 pb-16 text-left">
      {/* TOP BANNER */}
      <div className="bg-gradient-to-r from-[#FFFDF8] via-[#FAF6EF] to-white border border-[#E7DED1] rounded-2xl p-6 sm:p-8 shadow-2xs">
        <div className="max-w-4xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E7DED1] text-xs font-bold text-[#E89B52] shadow-3xs">
            <TrendingUp size={14} className="text-[#E89B52]" />
            <span>Abel Begena Student Acquisition & CRM Engine</span>
          </div>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-[#2B2B2B] tracking-tight">
            Customer Relationship Management & Growth Portal
          </h1>
          <p className="text-sm text-[#666666] leading-relaxed max-w-2xl">
            Track student inquiries, manage lead pipelines, automate follow-ups, launch targeted campaigns, issue promo codes, and analyze conversion funnels.
          </p>
        </div>
      </div>

      {/* NAVIGATION TABS */}
      <div className="flex flex-wrap items-center gap-2 bg-white border border-[#E7DED1] p-2 rounded-xl shadow-3xs">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${activeTab === 'dashboard' ? 'bg-[#E89B52] text-white shadow-2xs' : 'text-[#666666] hover:bg-[#FAF6EF]'}`}
        >
          <BarChart3 size={14} />
          <span>CRM Dashboard</span>
        </button>

        <button
          onClick={() => { setActiveTab('leads'); setSelectedLead(null); }}
          className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${activeTab === 'leads' ? 'bg-[#E89B52] text-white shadow-2xs' : 'text-[#666666] hover:bg-[#FAF6EF]'}`}
        >
          <Users size={14} />
          <span>Leads Directory ({leads.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('kanban')}
          className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${activeTab === 'kanban' ? 'bg-[#E89B52] text-white shadow-2xs' : 'text-[#666666] hover:bg-[#FAF6EF]'}`}
        >
          <Target size={14} />
          <span>Pipeline Kanban</span>
        </button>

        <button
          onClick={() => setActiveTab('inquiries')}
          className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${activeTab === 'inquiries' ? 'bg-[#E89B52] text-white shadow-2xs' : 'text-[#666666] hover:bg-[#FAF6EF]'}`}
        >
          <HelpCircle size={14} />
          <span>Inquiries ({inquiries.filter((i) => i.status === 'New').length} New)</span>
        </button>

        <button
          onClick={() => setActiveTab('followups')}
          className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${activeTab === 'followups' ? 'bg-[#E89B52] text-white shadow-2xs' : 'text-[#666666] hover:bg-[#FAF6EF]'}`}
        >
          <Clock size={14} />
          <span>Follow-Ups & Reminders</span>
        </button>

        <button
          onClick={() => setActiveTab('campaigns')}
          className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${activeTab === 'campaigns' ? 'bg-[#E89B52] text-white shadow-2xs' : 'text-[#666666] hover:bg-[#FAF6EF]'}`}
        >
          <Megaphone size={14} />
          <span>Campaigns & QR</span>
        </button>

        <button
          onClick={() => setActiveTab('courses')}
          className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${activeTab === 'courses' ? 'bg-[#E89B52] text-white shadow-2xs' : 'text-[#666666] hover:bg-[#FAF6EF]'}`}
        >
          <BookOpen size={14} />
          <span>Course Landing & Compare</span>
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${activeTab === 'reports' ? 'bg-[#E89B52] text-white shadow-2xs' : 'text-[#666666] hover:bg-[#FAF6EF]'}`}
        >
          <TrendingUp size={14} />
          <span>Funnel Analytics</span>
        </button>
      </div>

      {/* DASHBOARD TAB */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white border border-[#E7DED1] p-5 rounded-2xl shadow-2xs space-y-1">
              <span className="text-[10px] font-bold text-[#666666] uppercase">Total Active Leads</span>
              <p className="font-display font-black text-2xl text-[#2B2B2B]">{leads.length}</p>
              <span className="text-[11px] text-[#10B981] font-bold">+18% this month</span>
            </div>

            <div className="bg-white border border-[#E7DED1] p-5 rounded-2xl shadow-2xs space-y-1">
              <span className="text-[10px] font-bold text-[#666666] uppercase">Inquiries Pending</span>
              <p className="font-display font-black text-2xl text-[#E89B52]">
                {inquiries.filter((i) => i.status === 'New').length}
              </p>
              <span className="text-[11px] text-[#666666]">Avg Response Time: 18 mins</span>
            </div>

            <div className="bg-white border border-[#E7DED1] p-5 rounded-2xl shadow-2xs space-y-1">
              <span className="text-[10px] font-bold text-[#666666] uppercase">Conversion Rate</span>
              <p className="font-display font-black text-2xl text-[#10B981]">78.5%</p>
              <span className="text-[11px] text-[#10B981] font-bold">Industry Benchmark Exceeded</span>
            </div>

            <div className="bg-white border border-[#E7DED1] p-5 rounded-2xl shadow-2xs space-y-1">
              <span className="text-[10px] font-bold text-[#666666] uppercase">Today's Follow-Ups</span>
              <p className="font-display font-black text-2xl text-[#6F4E37]">{followUps.length}</p>
              <span className="text-[11px] text-[#666666]">Assigned Staff Reminders Active</span>
            </div>
          </div>

          {/* ACQUISITION SOURCE BREAKDOWN */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-[#E7DED1] p-6 rounded-2xl shadow-2xs space-y-4">
              <h3 className="font-display font-bold text-base text-[#2B2B2B]">Student Acquisition Sources</h3>
              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between font-bold text-[#2B2B2B] mb-1">
                    <span>TikTok Campaigns</span>
                    <span className="text-[#E89B52]">38% (142 Leads)</span>
                  </div>
                  <div className="w-full bg-[#FAF6EF] h-2 rounded-full overflow-hidden">
                    <div className="bg-[#E89B52] h-full" style={{ width: '38%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-bold text-[#2B2B2B] mb-1">
                    <span>Direct Website & Google Search</span>
                    <span className="text-[#E89B52]">28% (105 Leads)</span>
                  </div>
                  <div className="w-full bg-[#FAF6EF] h-2 rounded-full overflow-hidden">
                    <div className="bg-[#E89B52] h-full" style={{ width: '28%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-bold text-[#2B2B2B] mb-1">
                    <span>Telegram Community Channel</span>
                    <span className="text-[#E89B52]">20% (75 Leads)</span>
                  </div>
                  <div className="w-full bg-[#FAF6EF] h-2 rounded-full overflow-hidden">
                    <div className="bg-[#E89B52] h-full" style={{ width: '20%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-bold text-[#2B2B2B] mb-1">
                    <span>Student & Teacher Referrals</span>
                    <span className="text-[#E89B52]">14% (52 Leads)</span>
                  </div>
                  <div className="w-full bg-[#FAF6EF] h-2 rounded-full overflow-hidden">
                    <div className="bg-[#E89B52] h-full" style={{ width: '14%' }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-[#E7DED1] p-6 rounded-2xl shadow-2xs space-y-4">
              <h3 className="font-display font-bold text-base text-[#2B2B2B]">Pending Follow-Up Actions</h3>
              <div className="divide-y divide-[#E7DED1] border border-[#E7DED1] rounded-xl overflow-hidden text-xs">
                {followUps.map((flp) => (
                  <div key={flp.id} className="p-3 flex items-center justify-between hover:bg-[#FAF6EF]/50">
                    <div>
                      <p className="font-bold text-[#2B2B2B]">{flp.leadName}</p>
                      <p className="text-[11px] text-[#666666]">{flp.notes}</p>
                    </div>
                    <span className="font-mono text-[10px] font-bold text-[#E89B52] bg-[#FAF6EF] px-2 py-1 rounded border border-[#E7DED1]">
                      {flp.date} ({flp.method})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LEADS DIRECTORY TAB */}
      {activeTab === 'leads' && (
        <div>
          {selectedLead ? (
            <LeadDetailPage
              lead={selectedLead}
              activities={activities.filter((a) => a.leadId === selectedLead.id)}
              onClose={() => setSelectedLead(null)}
              onUpdateLead={handleUpdateLead}
              onAddActivity={handleAddActivity}
              onScheduleFollowUp={handleScheduleFollowUp}
              lang={lang}
            />
          ) : (
            <div className="space-y-6">
              {/* SEARCH & FILTER BAR */}
              <div className="bg-white border border-[#E7DED1] p-4 rounded-xl shadow-3xs flex flex-wrap items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-2 flex-1 max-w-md">
                  <Search size={14} className="text-[#666666]" />
                  <input
                    type="text"
                    placeholder="Search leads by name, phone, email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-2 py-1 focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-1.5 border border-[#E7DED1] rounded-lg bg-white font-semibold text-[#2B2B2B]"
                  >
                    <option value="All">All Statuses</option>
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Interested">Interested</option>
                    <option value="Qualified">Qualified</option>
                    <option value="Trial Requested">Trial Requested</option>
                    <option value="Registration Started">Registration Started</option>
                    <option value="Payment Pending">Payment Pending</option>
                    <option value="Enrolled">Enrolled</option>
                  </select>

                  <select
                    value={branchFilter}
                    onChange={(e) => setBranchFilter(e.target.value)}
                    className="px-3 py-1.5 border border-[#E7DED1] rounded-lg bg-white font-semibold text-[#2B2B2B]"
                  >
                    <option value="All">All Branches</option>
                    <option value="Piazza Headquarters">Piazza HQ</option>
                    <option value="Bole Medhanealem Branch">Bole Branch</option>
                    <option value="CMC Altad Branch">CMC Branch</option>
                    <option value="Global Online Campus">Global Online</option>
                  </select>
                </div>
              </div>

              {/* LEADS LIST TABLE */}
              <div className="overflow-x-auto bg-white border border-[#E7DED1] rounded-2xl shadow-xs">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-[#FAF6EF] border-b border-[#E7DED1] text-[#666666] font-bold uppercase text-[10px]">
                      <th className="p-3.5">Lead Name</th>
                      <th className="p-3.5">Contact</th>
                      <th className="p-3.5">Interested Course</th>
                      <th className="p-3.5">Branch</th>
                      <th className="p-3.5">Source</th>
                      <th className="p-3.5">Score</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E7DED1]">
                    {filteredLeads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-[#FAF6EF]/30 transition-colors">
                        <td className="p-3.5 font-bold text-[#2B2B2B]">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={lead.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                              alt={lead.fullName}
                              className="w-8 h-8 rounded-full object-cover border border-[#E7DED1]"
                              referrerPolicy="no-referrer"
                            />
                            <div>
                              <p>{lead.fullName}</p>
                              <span className="font-mono text-[9px] text-[#666666]">{lead.id}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-3.5 text-[#666666]">
                          <p>{lead.phone}</p>
                          <p className="text-[10px]">{lead.email}</p>
                        </td>
                        <td className="p-3.5 font-semibold text-[#2B2B2B]">{lead.interestedCourse}</td>
                        <td className="p-3.5">{lead.preferredBranch}</td>
                        <td className="p-3.5 font-bold text-[#E89B52]">{lead.source}</td>
                        <td className="p-3.5 font-mono font-bold text-[#10B981]">{lead.score} pts</td>
                        <td className="p-3.5">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#E89B52]/10 text-[#E89B52]">
                            {lead.status}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <button
                            onClick={() => setSelectedLead(lead)}
                            className="px-2.5 py-1 bg-[#6F4E37] text-white text-[10px] font-bold rounded-md hover:bg-[#5a3f2c] cursor-pointer"
                          >
                            View & Process
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* KANBAN PIPELINE TAB */}
      {activeTab === 'kanban' && (
        <KanbanPipelineView
          leads={leads}
          onSelectLead={(l) => { setSelectedLead(l); setActiveTab('leads'); }}
          onMoveStage={handleMoveKanbanStage}
          lang={lang}
        />
      )}

      {/* INQUIRIES TAB */}
      {activeTab === 'inquiries' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-display font-bold text-lg text-[#2B2B2B]">Website & Public Inquiries Routing</h3>
            <button
              onClick={() => setIsInquiryModalOpen(true)}
              className="py-2 px-3 bg-[#E89B52] text-white font-bold text-xs rounded-lg hover:bg-[#d68a41] cursor-pointer flex items-center gap-1.5"
            >
              <Plus size={14} />
              <span>Simulate Visitor Inquiry</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {inquiries.map((inq) => (
              <div key={inq.id} className="bg-white border border-[#E7DED1] p-5 rounded-2xl shadow-2xs space-y-3 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-[10px] font-bold text-[#666666]">{inq.id} • {inq.createdAt}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${inq.status === 'New' ? 'bg-[#E89B52]/10 text-[#E89B52]' : 'bg-[#10B981]/10 text-[#10B981]'}`}>
                    {inq.status}
                  </span>
                </div>

                <div>
                  <h4 className="font-display font-bold text-base text-[#2B2B2B]">{inq.name}</h4>
                  <p className="text-[#666666]">{inq.phone} • {inq.email}</p>
                </div>

                <div className="p-3 bg-[#FAF6EF] border border-[#E7DED1] rounded-xl">
                  <p className="font-semibold text-[#2B2B2B]">{inq.type}: {inq.courseName}</p>
                  <p className="text-[#666666] italic mt-1">"{inq.message}"</p>
                </div>

                {inq.status === 'New' && (
                  <button
                    onClick={() => handleConvertInquiryToLead(inq)}
                    className="w-full py-2 bg-[#E89B52] text-white font-bold text-xs uppercase tracking-wider rounded-lg hover:bg-[#d68a41] cursor-pointer"
                  >
                    Convert Inquiry to Qualified CRM Lead
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FOLLOW-UPS & REMINDERS TAB */}
      {activeTab === 'followups' && (
        <div className="space-y-6">
          <h3 className="font-display font-bold text-lg text-[#2B2B2B]">Scheduled Staff Follow-Ups</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {followUps.map((flp) => (
              <div key={flp.id} className="bg-white border border-[#E7DED1] p-5 rounded-2xl shadow-2xs space-y-3 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-[#E89B52]">{flp.leadName} ({flp.leadPhone})</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#10B981]/10 text-[#10B981]">{flp.status}</span>
                </div>
                <p className="text-[#2B2B2B] font-semibold">Scheduled Date: {flp.date} at {flp.time} ({flp.method})</p>
                <div className="p-2.5 bg-[#FAF6EF] rounded-lg border border-[#E7DED1]">
                  <p className="text-[#666666]">{flp.notes}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CAMPAIGNS TAB */}
      {activeTab === 'campaigns' && <CampaignsCenter lang={lang} />}

      {/* COURSE MARKETING & COMPARE TAB */}
      {activeTab === 'courses' && (
        <CourseMarketingLanding
          lang={lang}
          onNavigate={onNavigate}
          onOpenInquiryModal={(courseName) => { setInquiryCourseName(courseName); setIsInquiryModalOpen(true); }}
          onBookTrial={(courseName) => { setTrialCourseName(courseName); setIsTrialModalOpen(true); }}
        />
      )}

      {/* FUNNEL ANALYTICS TAB */}
      {activeTab === 'reports' && (
        <div className="bg-white border border-[#E7DED1] p-6 sm:p-8 rounded-2xl shadow-xs space-y-6 text-xs">
          <h3 className="font-display font-black text-xl text-[#2B2B2B]">Complete Student Acquisition Funnel Analysis</h3>
          <div className="space-y-4">
            <div className="p-4 bg-[#FAF6EF] border border-[#E7DED1] rounded-xl flex justify-between items-center font-bold">
              <span>1. Total Website Visitors</span>
              <span className="text-[#2B2B2B]">14,200</span>
            </div>
            <div className="p-4 bg-[#FAF6EF] border border-[#E7DED1] rounded-xl flex justify-between items-center font-bold">
              <span>2. Course Page Views</span>
              <span className="text-[#2B2B2B]">3,850 (27.1%)</span>
            </div>
            <div className="p-4 bg-[#FAF6EF] border border-[#E7DED1] rounded-xl flex justify-between items-center font-bold">
              <span>3. Inquiries Submitted</span>
              <span className="text-[#2B2B2B]">420 (10.9%)</span>
            </div>
            <div className="p-4 bg-[#FAF6EF] border border-[#E7DED1] rounded-xl flex justify-between items-center font-bold">
              <span>4. CRM Leads Qualified</span>
              <span className="text-[#E89B52]">280 (66.7%)</span>
            </div>
            <div className="p-4 bg-[#FAF6EF] border border-[#E7DED1] rounded-xl flex justify-between items-center font-bold">
              <span>5. Registrations Completed</span>
              <span className="text-[#E89B52]">145 (51.7%)</span>
            </div>
            <div className="p-4 bg-gradient-to-r from-[#10B981]/10 to-white border border-[#10B981]/30 rounded-xl flex justify-between items-center font-bold text-[#10B981]">
              <span>6. Final Course Enrollments & Payments</span>
              <span className="text-base">118 Students Enrolled (81.3% Conversion)</span>
            </div>
          </div>
        </div>
      )}

      {/* SIMULATED INQUIRY MODAL */}
      <AnimatePresence>
        {isInquiryModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white border border-[#E7DED1] rounded-2xl p-6 max-w-md w-full shadow-lg space-y-4 text-left"
            >
              <div className="flex items-center justify-between border-b border-[#E7DED1] pb-3">
                <h3 className="font-display font-bold text-lg text-[#2B2B2B]">Public Course Inquiry</h3>
                <button onClick={() => setIsInquiryModalOpen(false)} className="p-1 text-[#666666] hover:text-black cursor-pointer">✕</button>
              </div>

              <form onSubmit={handleCreateInquiry} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-[#2B2B2B]">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Samuel Alemayehu"
                    value={inquiryName}
                    onChange={(e) => setInquiryName(e.target.value)}
                    className="w-full px-3 py-2 border border-[#E7DED1] rounded-lg focus:outline-none focus:border-[#E89B52]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#2B2B2B]">Phone Number</label>
                  <input
                    type="text"
                    required
                    placeholder="+2519..."
                    value={inquiryPhone}
                    onChange={(e) => setInquiryPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-[#E7DED1] rounded-lg focus:outline-none focus:border-[#E89B52]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#2B2B2B]">Question or Request</label>
                  <textarea
                    rows={3}
                    placeholder="Ask about schedule, instruments, or pricing..."
                    value={inquiryMessage}
                    onChange={(e) => setInquiryMessage(e.target.value)}
                    className="w-full px-3 py-2 border border-[#E7DED1] rounded-lg focus:outline-none focus:border-[#E89B52]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#E89B52] text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-2xs hover:bg-[#d68a41] cursor-pointer"
                >
                  Submit Inquiry
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SIMULATED TRIAL SESSION MODAL */}
      <AnimatePresence>
        {isTrialModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white border border-[#E7DED1] rounded-2xl p-6 max-w-md w-full shadow-lg space-y-4 text-left"
            >
              <div className="flex items-center justify-between border-b border-[#E7DED1] pb-3">
                <h3 className="font-display font-bold text-lg text-[#2B2B2B]">Book Free Introductory Session</h3>
                <button onClick={() => setIsTrialModalOpen(false)} className="p-1 text-[#666666] hover:text-black cursor-pointer">✕</button>
              </div>

              <form onSubmit={handleBookTrialSubmit} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-[#2B2B2B]">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Woizero Bethlehem Gebre"
                    value={trialName}
                    onChange={(e) => setTrialName(e.target.value)}
                    className="w-full px-3 py-2 border border-[#E7DED1] rounded-lg focus:outline-none focus:border-[#E89B52]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#2B2B2B]">Phone Number</label>
                  <input
                    type="text"
                    required
                    placeholder="+2519..."
                    value={trialPhone}
                    onChange={(e) => setTrialPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-[#E7DED1] rounded-lg focus:outline-none focus:border-[#E89B52]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#2B2B2B]">Preferred Branch</label>
                  <select
                    value={trialBranch}
                    onChange={(e) => setTrialBranch(e.target.value)}
                    className="w-full px-3 py-2 border border-[#E7DED1] rounded-lg focus:outline-none focus:border-[#E89B52]"
                  >
                    <option value="Piazza Headquarters">Piazza Headquarters</option>
                    <option value="Bole Medhanealem Branch">Bole Medhanealem Branch</option>
                    <option value="CMC Altad Branch">CMC Altad Branch</option>
                    <option value="Global Online Campus">Global Online Campus</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#6F4E37] text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-2xs hover:bg-[#5a3f2c] cursor-pointer"
                >
                  Confirm Free Trial Request
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

