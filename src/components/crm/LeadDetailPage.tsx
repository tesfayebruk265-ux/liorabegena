import React, { useState } from 'react';
import {
  User,
  Phone,
  Mail,
  Send,
  MapPin,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  MessageSquare,
  Award,
  BookOpen,
  DollarSign,
  TrendingUp,
  UserCheck,
  ChevronRight,
  Shield,
  Tag,
  Share2,
  FileText
} from 'lucide-react';
import { motion } from 'motion/react';
import { LeadItem, LeadActivity, FollowUpItem, CrmTaskItem, Language } from '../../types';

interface LeadDetailPageProps {
  lead: LeadItem;
  activities: LeadActivity[];
  onClose: () => void;
  onUpdateLead: (updated: LeadItem) => void;
  onAddActivity: (activity: LeadActivity) => void;
  onScheduleFollowUp: (followUp: FollowUpItem) => void;
  lang: Language;
}

export function LeadDetailPage({
  lead,
  activities,
  onClose,
  onUpdateLead,
  onAddActivity,
  onScheduleFollowUp,
  lang
}: LeadDetailPageProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'timeline' | 'notes' | 'followups' | 'conversion'>('profile');
  const [newNote, setNewNote] = useState('');
  const [newActivityTitle, setNewActivityTitle] = useState('');
  const [newActivityType, setNewActivityType] = useState<LeadActivity['type']>('Call');
  const [newActivityDesc, setNewActivityDesc] = useState('');

  // Follow-up scheduling form state
  const [followUpDate, setFollowUpDate] = useState('');
  const [followUpTime, setFollowUpTime] = useState('10:00 AM');
  const [followUpMethod, setFollowUpMethod] = useState<FollowUpItem['method']>('Phone');
  const [followUpNotes, setFollowUpNotes] = useState('');

  const handleStatusChange = (newStatus: LeadItem['status']) => {
    const updatedLead: LeadItem = {
      ...lead,
      status: newStatus,
      lastContact: new Date().toISOString().split('T')[0]
    };
    onUpdateLead(updatedLead);

    const activity: LeadActivity = {
      id: `act-${Date.now()}`,
      leadId: lead.id,
      timestamp: new Date().toLocaleString(),
      title: `Status Changed to ${newStatus}`,
      type: 'StatusChange',
      description: `Lead status was updated from ${lead.status} to ${newStatus}.`,
      performedBy: 'Current User'
    };
    onAddActivity(activity);
  };

  const handleStageChange = (newStage: NonNullable<LeadItem['prospectStage']>) => {
    const updatedLead: LeadItem = {
      ...lead,
      prospectStage: newStage,
      lastContact: new Date().toISOString().split('T')[0]
    };
    onUpdateLead(updatedLead);

    const activity: LeadActivity = {
      id: `act-${Date.now()}`,
      leadId: lead.id,
      timestamp: new Date().toLocaleString(),
      title: `Pipeline Stage Updated to ${newStage}`,
      type: 'StatusChange',
      description: `Lead pipeline stage was updated to ${newStage}.`,
      performedBy: 'Current User'
    };
    onAddActivity(activity);
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    const activity: LeadActivity = {
      id: `act-${Date.now()}`,
      leadId: lead.id,
      timestamp: new Date().toLocaleString(),
      title: 'Internal CRM Note Added',
      type: 'Note',
      description: newNote,
      performedBy: 'Current User'
    };
    onAddActivity(activity);

    const updatedLead: LeadItem = {
      ...lead,
      notes: `${lead.notes}\n[${new Date().toLocaleDateString()}] ${newNote}`
    };
    onUpdateLead(updatedLead);
    setNewNote('');
  };

  const handleAddActivitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActivityTitle.trim()) return;

    const activity: LeadActivity = {
      id: `act-${Date.now()}`,
      leadId: lead.id,
      timestamp: new Date().toLocaleString(),
      title: newActivityTitle,
      type: newActivityType,
      description: newActivityDesc,
      performedBy: 'Current User'
    };
    onAddActivity(activity);
    setNewActivityTitle('');
    setNewActivityDesc('');
  };

  const handleCreateFollowUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!followUpDate) return;

    const newFollowUp: FollowUpItem = {
      id: `flp-${Date.now()}`,
      leadId: lead.id,
      leadName: lead.fullName,
      leadPhone: lead.phone,
      date: followUpDate,
      time: followUpTime,
      method: followUpMethod,
      notes: followUpNotes,
      assignedTo: lead.assignedStaffId,
      assignedToName: lead.assignedStaffName,
      status: 'Pending',
      reminderTiming: '1 Day Before'
    };

    onScheduleFollowUp(newFollowUp);

    const activity: LeadActivity = {
      id: `act-${Date.now()}`,
      leadId: lead.id,
      timestamp: new Date().toLocaleString(),
      title: `Follow-Up Scheduled (${followUpMethod})`,
      type: 'Call',
      description: `Scheduled for ${followUpDate} at ${followUpTime}. Note: ${followUpNotes}`,
      performedBy: 'Current User'
    };
    onAddActivity(activity);

    setFollowUpDate('');
    setFollowUpNotes('');
    alert('Follow-Up Task Scheduled Successfully!');
  };

  return (
    <div className="bg-white border border-[#E7DED1] rounded-2xl p-6 shadow-xs space-y-6 text-left">
      {/* HEADER BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E7DED1] pb-5">
        <div className="flex items-center gap-4">
          <img
            src={lead.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
            alt={lead.fullName}
            className="w-16 h-16 rounded-full object-cover border-2 border-[#E89B52]"
            referrerPolicy="no-referrer"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display font-black text-2xl text-[#2B2B2B]">{lead.fullName}</h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E89B52]/10 text-[#E89B52] border border-[#E89B52]/20">
                Score: {lead.score}/100
              </span>
            </div>
            <p className="text-xs text-[#666666] flex items-center gap-3 mt-1">
              <span className="flex items-center gap-1"><Phone size={12} className="text-[#E89B52]" /> {lead.phone}</span>
              <span className="flex items-center gap-1"><Mail size={12} className="text-[#E89B52]" /> {lead.email}</span>
              {lead.telegramUsername && (
                <span className="flex items-center gap-1"><Send size={12} className="text-[#0088cc]" /> {lead.telegramUsername}</span>
              )}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1.5 border border-[#E7DED1] text-xs font-bold rounded-lg hover:bg-[#FAF6EF] cursor-pointer"
          >
            Back to Directory
          </button>
        </div>
      </div>

      {/* LEAD STATUS & STAGE CONTROL STRIP */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-[#FAF6EF] border border-[#E7DED1] rounded-xl text-xs">
        <div>
          <label className="font-bold text-[#666666] uppercase text-[10px] block mb-1">Lead Status</label>
          <select
            value={lead.status}
            onChange={(e) => handleStatusChange(e.target.value as LeadItem['status'])}
            className="w-full px-3 py-1.5 bg-white border border-[#E7DED1] rounded-lg font-bold text-[#2B2B2B] focus:outline-none focus:border-[#E89B52]"
          >
            <option value="New">New Lead</option>
            <option value="Contacted">Contacted</option>
            <option value="Interested">Interested</option>
            <option value="Qualified">Qualified</option>
            <option value="Trial Requested">Trial Requested</option>
            <option value="Registration Started">Registration Started</option>
            <option value="Registration Completed">Registration Completed</option>
            <option value="Payment Pending">Payment Pending</option>
            <option value="Enrolled">Enrolled (Converted)</option>
            <option value="Not Interested">Not Interested</option>
            <option value="Lost">Lost</option>
          </select>
        </div>

        <div>
          <label className="font-bold text-[#666666] uppercase text-[10px] block mb-1">Pipeline Stage</label>
          <select
            value={lead.prospectStage || 'New Lead'}
            onChange={(e) => handleStageChange(e.target.value as NonNullable<LeadItem['prospectStage']>)}
            className="w-full px-3 py-1.5 bg-white border border-[#E7DED1] rounded-lg font-bold text-[#2B2B2B] focus:outline-none focus:border-[#E89B52]"
          >
            <option value="New Lead">1. New Lead</option>
            <option value="Contacted">2. Contacted</option>
            <option value="Interested">3. Interested</option>
            <option value="Qualified">4. Qualified</option>
            <option value="Trial / Consultation">5. Trial / Consultation</option>
            <option value="Registration Started">6. Registration Started</option>
            <option value="Payment Pending">7. Payment Pending</option>
            <option value="Enrolled">8. Enrolled</option>
          </select>
        </div>
      </div>

      {/* NAVIGATION TABS */}
      <div className="flex border-b border-[#E7DED1] gap-4 text-xs font-bold">
        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-2 transition-colors cursor-pointer ${activeTab === 'profile' ? 'border-b-2 border-[#E89B52] text-[#E89B52]' : 'text-[#666666] hover:text-black'}`}
        >
          Overview & Info
        </button>
        <button
          onClick={() => setActiveTab('timeline')}
          className={`pb-2 transition-colors cursor-pointer ${activeTab === 'timeline' ? 'border-b-2 border-[#E89B52] text-[#E89B52]' : 'text-[#666666] hover:text-black'}`}
        >
          Activity History ({activities.length})
        </button>
        <button
          onClick={() => setActiveTab('followups')}
          className={`pb-2 transition-colors cursor-pointer ${activeTab === 'followups' ? 'border-b-2 border-[#E89B52] text-[#E89B52]' : 'text-[#666666] hover:text-black'}`}
        >
          Schedule Follow-Up
        </button>
        <button
          onClick={() => setActiveTab('notes')}
          className={`pb-2 transition-colors cursor-pointer ${activeTab === 'notes' ? 'border-b-2 border-[#E89B52] text-[#E89B52]' : 'text-[#666666] hover:text-black'}`}
        >
          Internal Notes
        </button>
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div className="space-y-4">
            <h3 className="font-display font-bold text-sm text-[#2B2B2B]">Lead Attributes & Preferences</h3>
            <div className="space-y-2 border border-[#E7DED1] p-4 rounded-xl bg-white">
              <p><strong className="text-[#666666]">Interested Course:</strong> {lead.interestedCourse} ({lead.interestedInstrument})</p>
              <p><strong className="text-[#666666]">Interested Level:</strong> {lead.interestedLevel}</p>
              <p><strong className="text-[#666666]">Preferred Learning Mode:</strong> {lead.preferredLearningMode}</p>
              <p><strong className="text-[#666666]">Preferred Schedule:</strong> {lead.preferredSchedule}</p>
              <p><strong className="text-[#666666]">Preferred Branch:</strong> {lead.preferredBranch}</p>
              <p><strong className="text-[#666666]">Acquisition Source:</strong> <span className="font-bold text-[#E89B52]">{lead.source}</span></p>
              <p><strong className="text-[#666666]">Assigned Staff:</strong> {lead.assignedStaffName}</p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-display font-bold text-sm text-[#2B2B2B]">Lead Quality Score Breakdown ({lead.score}/100)</h3>
            <div className="border border-[#E7DED1] p-4 rounded-xl bg-white space-y-2">
              {lead.scoreBreakdown.map((sb, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs pb-1 border-b border-[#E7DED1] last:border-none">
                  <span className="text-[#2B2B2B]">{sb.reason}</span>
                  <span className="font-mono font-bold text-[#10B981]">+{sb.points} pts</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ACTIVITY TIMELINE TAB */}
      {activeTab === 'timeline' && (
        <div className="space-y-6 text-xs">
          <form onSubmit={handleAddActivitySubmit} className="p-4 bg-[#FAF6EF] border border-[#E7DED1] rounded-xl space-y-3">
            <h4 className="font-bold text-[#2B2B2B]">Log New Communication Activity</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                type="text"
                required
                placeholder="Activity Title e.g. Phone call made"
                value={newActivityTitle}
                onChange={(e) => setNewActivityTitle(e.target.value)}
                className="px-3 py-2 border border-[#E7DED1] rounded-lg bg-white"
              />
              <select
                value={newActivityType}
                onChange={(e) => setNewActivityType(e.target.value as LeadActivity['type'])}
                className="px-3 py-2 border border-[#E7DED1] rounded-lg bg-white"
              >
                <option value="Call">Phone Call</option>
                <option value="Message">Telegram/SMS Message</option>
                <option value="Email">Email Sent</option>
                <option value="Note">Internal Note</option>
              </select>
            </div>
            <textarea
              placeholder="Detailed communication output..."
              value={newActivityDesc}
              onChange={(e) => setNewActivityDesc(e.target.value)}
              className="w-full px-3 py-2 border border-[#E7DED1] rounded-lg bg-white h-20"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-[#E89B52] text-white font-bold rounded-lg hover:bg-[#d68a41] cursor-pointer"
            >
              Log Activity
            </button>
          </form>

          <div className="space-y-3">
            <h4 className="font-bold text-[#2B2B2B]">Chronological Communication History</h4>
            <div className="relative border-l-2 border-[#E89B52] pl-4 space-y-4">
              {activities.map((act) => (
                <div key={act.id} className="bg-white border border-[#E7DED1] p-3 rounded-lg space-y-1">
                  <div className="flex justify-between items-center text-[10px] text-[#666666]">
                    <span className="font-mono font-bold text-[#E89B52]">{act.timestamp}</span>
                    <span>{act.performedBy}</span>
                  </div>
                  <h5 className="font-bold text-[#2B2B2B] text-xs">{act.title}</h5>
                  <p className="text-[#666666] leading-relaxed">{act.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SCHEDULE FOLLOW-UP TAB */}
      {activeTab === 'followups' && (
        <form onSubmit={handleCreateFollowUp} className="space-y-4 text-xs max-w-xl">
          <h3 className="font-display font-bold text-sm text-[#2B2B2B]">Schedule Staff Follow-Up Reminder</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-[#2B2B2B]">Follow-Up Date</label>
              <input
                type="date"
                required
                value={followUpDate}
                onChange={(e) => setFollowUpDate(e.target.value)}
                className="w-full px-3 py-2 border border-[#E7DED1] rounded-lg focus:outline-none focus:border-[#E89B52]"
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-[#2B2B2B]">Time</label>
              <input
                type="text"
                required
                value={followUpTime}
                onChange={(e) => setFollowUpTime(e.target.value)}
                className="w-full px-3 py-2 border border-[#E7DED1] rounded-lg focus:outline-none focus:border-[#E89B52]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-[#2B2B2B]">Contact Method</label>
            <select
              value={followUpMethod}
              onChange={(e) => setFollowUpMethod(e.target.value as FollowUpItem['method'])}
              className="w-full px-3 py-2 border border-[#E7DED1] rounded-lg focus:outline-none focus:border-[#E89B52]"
            >
              <option value="Phone">Phone Call</option>
              <option value="Telegram">Telegram Direct Message</option>
              <option value="SMS">SMS Text Message</option>
              <option value="Email">Email</option>
              <option value="In Person">Branch Visit In Person</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-[#2B2B2B]">Follow-Up Instructions & Notes</label>
            <textarea
              required
              rows={3}
              placeholder="e.g. Confirm telebirr payment receipt and class schedule"
              value={followUpNotes}
              onChange={(e) => setFollowUpNotes(e.target.value)}
              className="w-full px-3 py-2 border border-[#E7DED1] rounded-lg focus:outline-none focus:border-[#E89B52]"
            />
          </div>

          <button
            type="submit"
            className="py-2.5 px-6 bg-[#E89B52] text-white font-bold rounded-lg shadow-2xs hover:bg-[#d68a41] cursor-pointer"
          >
            Confirm Follow-Up Task
          </button>
        </form>
      )}

      {/* INTERNAL NOTES TAB */}
      {activeTab === 'notes' && (
        <div className="space-y-4 text-xs">
          <form onSubmit={handleAddNote} className="space-y-2">
            <label className="font-bold text-[#2B2B2B] block">Add Private Staff Note (Hidden from lead)</label>
            <textarea
              required
              rows={3}
              placeholder="Write internal staff observation..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              className="w-full px-3 py-2 border border-[#E7DED1] rounded-lg focus:outline-none focus:border-[#E89B52]"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-[#6F4E37] text-white font-bold rounded-lg hover:bg-[#5a3f2c] cursor-pointer"
            >
              Save Internal Note
            </button>
          </form>

          <div className="p-4 bg-[#FAF6EF] border border-[#E7DED1] rounded-xl whitespace-pre-wrap font-mono text-[11px] text-[#2B2B2B]">
            {lead.notes || 'No notes added yet.'}
          </div>
        </div>
      )}
    </div>
  );
}

