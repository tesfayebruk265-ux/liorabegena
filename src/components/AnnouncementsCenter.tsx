import React, { useState } from 'react';
import {
  Bell,
  AlertTriangle,
  Info,
  Calendar,
  Building,
  UserCheck,
  Search,
  Filter,
  Paperclip,
  Check,
  CheckCircle,
  Radio,
  FileText,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AnnouncementItem, PageId, Language } from '../types';
import { useAuth } from '../context/AuthContext';
import { INITIAL_ANNOUNCEMENTS } from '../data/communicationData';

interface AnnouncementsCenterProps {
  onNavigate: (page: PageId, params?: any) => void;
  lang: Language;
}

export function AnnouncementsCenter({ onNavigate, lang }: AnnouncementsCenterProps) {
  const { currentUser } = useAuth();
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>(INITIAL_ANNOUNCEMENTS);
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<AnnouncementItem | null>(null);

  const filteredAnnouncements = announcements.filter((ann) => {
    if (priorityFilter !== 'All' && ann.priority !== priorityFilter) return false;
    if (searchQuery) {
      return (
        (ann.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (ann.content || '').toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return true;
  });

  const urgentAnnouncements = announcements.filter((a) => a.priority === 'Urgent' || a.priority === 'Emergency');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-semibold tracking-wide uppercase">
            Official School Notices
          </span>
          <span className="text-xs text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
            Targeted Broadcasts
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-amber-950 mt-1">
          School & Branch Announcements
        </h1>
        <p className="text-sm text-stone-600 mt-0.5">
          Important operational, academic, and event announcements from Abel Begena School leadership.
        </p>
      </div>

      {/* Emergency / Urgent Banner if active */}
      {urgentAnnouncements.length > 0 && (
        <div className="p-4 bg-red-600 text-white rounded-2xl shadow-md border border-red-700 flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 shrink-0 mt-0.5" />
          <div className="flex-1 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold uppercase tracking-wider text-[10px] bg-red-800 px-2 py-0.5 rounded">
                Urgent Notice
              </span>
              <span className="font-bold">{urgentAnnouncements[0].title}</span>
            </div>
            <p className="mt-1 text-red-100 leading-relaxed">{urgentAnnouncements[0].content}</p>
          </div>
        </div>
      )}

      {/* Search & Priority Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
        <div className="flex items-center gap-2 overflow-x-auto text-xs w-full sm:w-auto">
          {['All', 'Normal', 'Important', 'Urgent', 'Emergency'].map((priority) => (
            <button
              key={priority}
              onClick={() => setPriorityFilter(priority)}
              className={`px-3.5 py-1.5 rounded-full font-semibold transition ${
                priorityFilter === priority
                  ? 'bg-amber-800 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {priority}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search announcements..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20"
          />
        </div>
      </div>

      {/* Announcements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredAnnouncements.map((ann) => (
          <div
            key={ann.id}
            onClick={() => setSelectedAnnouncement(ann)}
            className="bg-white rounded-2xl border border-stone-200 p-5 shadow-2xs space-y-3 cursor-pointer hover:border-amber-700 transition"
          >
            <div className="flex items-center justify-between">
              <span
                className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full uppercase ${
                  ann.priority === 'Emergency' || ann.priority === 'Urgent'
                    ? 'bg-red-100 text-red-800'
                    : ann.priority === 'Important'
                    ? 'bg-amber-100 text-amber-900'
                    : 'bg-stone-100 text-stone-700'
                }`}
              >
                {ann.priority} Priority
              </span>
              <span className="text-[10px] text-stone-400">{ann.date}</span>
            </div>

            <h3 className="text-sm font-bold text-stone-900">{ann.title}</h3>
            <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed">{ann.content}</p>

            {ann.image && (
              <img
                src={ann.image}
                alt={ann.title}
                className="rounded-xl max-h-40 w-full object-cover border border-stone-200"
              />
            )}

            <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
              <span>Audience: <strong>{ann.targetAudience}</strong></span>
              <span className="text-amber-800 font-semibold flex items-center gap-1">
                Read Full Notice →
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* DETAIL MODAL */}
      {selectedAnnouncement && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-stone-200 text-xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <span className="px-2.5 py-0.5 bg-amber-100 text-amber-900 font-bold rounded-full text-[10px]">
                {selectedAnnouncement.priority} Priority Announcement
              </span>
              <button onClick={() => setSelectedAnnouncement(null)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <h2 className="text-base font-bold text-stone-900">{selectedAnnouncement.title}</h2>
            <p className="text-stone-700 leading-relaxed whitespace-pre-wrap">{selectedAnnouncement.content}</p>

            {selectedAnnouncement.image && (
              <img
                src={selectedAnnouncement.image}
                alt="Notice visual"
                className="rounded-xl max-h-60 w-full object-cover border border-stone-200"
              />
            )}

            <div className="p-3 bg-stone-50 rounded-xl space-y-1 text-stone-600 border border-stone-200">
              <div>Author: <strong>{selectedAnnouncement.authorName}</strong> ({selectedAnnouncement.authorRole})</div>
              <div>Target Audience: <strong>{selectedAnnouncement.targetAudience}</strong></div>
              <div>Published Date: <strong>{selectedAnnouncement.date}</strong></div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedAnnouncement(null)}
                className="px-4 py-2 bg-amber-800 hover:bg-amber-900 text-white font-semibold rounded-lg"
              >
                Close Notice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

