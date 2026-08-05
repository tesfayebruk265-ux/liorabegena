import React, { useState } from 'react';
import {
  Shield,
  Flag,
  Users,
  MessageSquare,
  Sparkles,
  BarChart2,
  Send,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Radio,
  FileText,
  Clock,
  ChevronRight,
  Search,
  Filter,
  Check,
  X,
  Trash2,
  Lock,
  UserX,
  RefreshCw,
  Info
} from 'lucide-react';
import { motion } from 'motion/react';
import {
  ModerationReport,
  CommunicationCampaign,
  PageId,
  Language
} from '../types';
import { useAuth } from '../context/AuthContext';
import {
  INITIAL_MODERATION_REPORTS,
  INITIAL_CAMPAIGNS
} from '../data/communicationData';

interface AdminCommunityManagementProps {
  onNavigate: (page: PageId, params?: any) => void;
  lang: Language;
  initialSubTab?: 'analytics' | 'moderation' | 'campaigns';
}

export function AdminCommunityManagement({
  onNavigate,
  lang,
  initialSubTab = 'analytics'
}: AdminCommunityManagementProps) {
  const { addNotification, currentUser } = useAuth();
  const [subTab, setSubTab] = useState<'analytics' | 'moderation' | 'campaigns'>(initialSubTab);

  // States
  const [reports, setReports] = useState<ModerationReport[]>(INITIAL_MODERATION_REPORTS);
  const [campaigns, setCampaigns] = useState<CommunicationCampaign[]>(INITIAL_CAMPAIGNS);

  // Campaign Creator Form
  const [newCampTitle, setNewCampTitle] = useState('');
  const [newCampChannel, setNewCampChannel] = useState<'SMS' | 'Telegram' | 'Push' | 'Email'>('SMS');
  const [newCampAudience, setNewCampAudience] = useState('All Piazza Branch Students');
  const [newCampText, setNewCampText] = useState('');

  // Emergency Announcement Modal
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
  const [emergencyText, setEmergencyText] = useState('');

  const handleResolveReport = (reportId: string, action: 'Approved' | 'Removed' | 'Dismissed') => {
    setReports((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, status: action } : r))
    );
    addNotification(`Report ${reportId} marked as ${action}`, 'system');
  };

  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCampTitle || !newCampText) return;

    const newCamp: CommunicationCampaign = {
      id: `camp-${Date.now()}`,
      title: newCampTitle,
      channel: newCampChannel,
      targetAudience: newCampAudience,
      status: 'Completed',
      recipientCount: 240,
      sentAt: 'Just now',
      messageText: newCampText,
      deliveryRate: 99.2
    };

    setCampaigns([newCamp, ...campaigns]);
    setNewCampTitle('');
    setNewCampText('');
    addNotification(`Campaign "${newCampTitle}" dispatched via ${newCampChannel}!`, 'system');
  };

  const handleTriggerEmergency = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emergencyText) return;

    setIsEmergencyOpen(false);
    setEmergencyText('');
    addNotification('🚨 EMERGENCY ANNOUNCEMENT DISPATCHED TO ALL USERS VIA SMS & PUSH!', 'system');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-red-100 text-red-900 rounded-full text-xs font-semibold tracking-wide uppercase">
              Admin & Moderation Control Center
            </span>
            <span className="text-xs text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded border border-amber-200">
              Community Health & Bulk Messaging
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-amber-950 mt-1">
            Community Analytics & Moderation Queue
          </h1>
          <p className="text-sm text-stone-600 mt-0.5">
            Audit reported messages, manage community safety rules, and dispatch SMS/Telegram campaigns.
          </p>
        </div>

        {/* Emergency Trigger Button */}
        <button
          onClick={() => setIsEmergencyOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-xs shadow-md transition"
        >
          <AlertTriangle className="w-4 h-4" />
          Emergency Announcement
        </button>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-2 text-xs">
        <button
          onClick={() => setSubTab('analytics')}
          className={`px-4 py-2 rounded-xl font-semibold transition ${
            subTab === 'analytics' ? 'bg-amber-800 text-white' : 'bg-white text-stone-600 border border-stone-200'
          }`}
        >
          Community Analytics
        </button>

        <button
          onClick={() => setSubTab('moderation')}
          className={`px-4 py-2 rounded-xl font-semibold transition ${
            subTab === 'moderation' ? 'bg-amber-800 text-white' : 'bg-white text-stone-600 border border-stone-200'
          }`}
        >
          Moderation Queue ({reports.filter((r) => r.status === 'Reported').length})
        </button>

        <button
          onClick={() => setSubTab('campaigns')}
          className={`px-4 py-2 rounded-xl font-semibold transition ${
            subTab === 'campaigns' ? 'bg-amber-800 text-white' : 'bg-white text-stone-600 border border-stone-200'
          }`}
        >
          Bulk Campaigns & SMS/Telegram
        </button>
      </div>

      {/* ========================================================= */}
      {/* 1. COMMUNITY ANALYTICS SUBTAB */}
      {/* ========================================================= */}
      {subTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-1">
              <span className="text-stone-500 font-semibold">Active Community Members</span>
              <p className="text-2xl font-bold text-amber-950">1,280</p>
              <span className="text-[10px] text-emerald-600 font-bold">↑ +12% this month</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-1">
              <span className="text-stone-500 font-semibold">Practice Recordings Uploaded</span>
              <p className="text-2xl font-bold text-amber-950">432</p>
              <span className="text-[10px] text-emerald-600 font-bold">98% Teacher Reviewed</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-1">
              <span className="text-stone-500 font-semibold">Prayer Requests Answered</span>
              <p className="text-2xl font-bold text-amber-950">890</p>
              <span className="text-[10px] text-amber-800 font-bold">3,420 Prayers Offered</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-1">
              <span className="text-stone-500 font-semibold">Moderation Resolution Rate</span>
              <p className="text-2xl font-bold text-emerald-700">99.4%</p>
              <span className="text-[10px] text-stone-400">Avg response: 18 mins</span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. MODERATION QUEUE SUBTAB */}
      {/* ========================================================= */}
      {subTab === 'moderation' && (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs overflow-hidden text-xs">
          <div className="p-4 border-b border-stone-200 bg-stone-50/50 font-bold text-stone-800">
            Reported Content Queue
          </div>

          <div className="divide-y divide-stone-100">
            {reports.map((rep) => (
              <div key={rep.id} className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 bg-red-100 text-red-800 font-bold rounded text-[10px]">
                    Reason: {rep.reason}
                  </span>
                  <span className="text-stone-400 text-[10px]">{rep.createdAt}</span>
                </div>

                <p className="text-stone-800 font-medium">
                  Reported User: <strong>{rep.reportedUserName}</strong> • Reporter: <strong>{rep.reporterName}</strong>
                </p>

                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-stone-700 italic">
                  "{rep.contentPreview}"
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-stone-500">Status: <strong className="capitalize">{rep.status}</strong></span>

                  {rep.status === 'Reported' && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleResolveReport(rep.id, 'Dismissed')}
                        className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-lg"
                      >
                        Dismiss
                      </button>
                      <button
                        onClick={() => handleResolveReport(rep.id, 'Removed')}
                        className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shadow-2xs"
                      >
                        Remove Content
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. BULK CAMPAIGNS SUBTAB */}
      {/* ========================================================= */}
      {subTab === 'campaigns' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs">
          {/* Campaign Form (5 cols) */}
          <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-4">
            <h3 className="font-bold text-stone-900 text-sm">Create Bulk Campaign Broadcast</h3>

            <form onSubmit={handleCreateCampaign} className="space-y-3">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Campaign Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Megenagna Branch Concert Registration Alert"
                  value={newCampTitle}
                  onChange={(e) => setNewCampTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Channel *</label>
                <select
                  value={newCampChannel}
                  onChange={(e) => setNewCampChannel(e.target.value as any)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                >
                  <option value="SMS">SMS Direct Message</option>
                  <option value="Telegram">Telegram Official Channel</option>
                  <option value="Push">Web Push Notification</option>
                  <option value="Email">Email Digest</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Target Audience</label>
                <input
                  type="text"
                  value={newCampAudience}
                  onChange={(e) => setNewCampAudience(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Message Body *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Type broadcast text..."
                  value={newCampText}
                  onChange={(e) => setNewCampText(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-amber-800 hover:bg-amber-900 text-white font-bold rounded-lg shadow-xs"
              >
                Dispatch Bulk Campaign
              </button>
            </form>
          </div>

          {/* Campaign History Log (7 cols) */}
          <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-4">
            <h3 className="font-bold text-stone-900 text-sm">Campaign Delivery History</h3>

            <div className="divide-y divide-stone-100">
              {campaigns.map((camp) => (
                <div key={camp.id} className="py-3 space-y-1">
                  <div className="flex items-center justify-between font-bold text-stone-900">
                    <span>{camp.title}</span>
                    <span className="px-2 py-0.5 bg-sky-100 text-sky-800 rounded font-mono text-[10px]">
                      {camp.channel}
                    </span>
                  </div>
                  <p className="text-stone-600 italic">"{camp.messageText}"</p>
                  <div className="flex items-center justify-between text-stone-400 text-[10px] pt-1">
                    <span>Target: {camp.targetAudience} ({camp.recipientCount} Recipients)</span>
                    <span>Status: {camp.status} ({camp.deliveryRate}% Success)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* EMERGENCY ANNOUNCEMENT MODAL */}
      {isEmergencyOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-red-300 text-xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <h3 className="font-bold text-red-700 text-sm flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                Dispatch Emergency Alert
              </h3>
              <button onClick={() => setIsEmergencyOpen(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-stone-600">
              This will send an immediate high-priority alert across SMS, Web Push, and Telegram to all registered users.
            </p>

            <form onSubmit={handleTriggerEmergency} className="space-y-3">
              <div>
                <label className="block font-semibold text-stone-800 mb-1">Emergency Text *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="e.g. Due to severe weather, all physical branch operations are closed today. Online classes continue."
                  value={emergencyText}
                  onChange={(e) => setEmergencyText(e.target.value)}
                  className="w-full px-3 py-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500/20"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEmergencyOpen(false)}
                  className="px-4 py-2 border border-stone-300 rounded-lg font-semibold text-stone-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shadow-sm"
                >
                  Dispatch Emergency Alert
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

