import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Sparkles,
  QrCode,
  Search,
  Filter,
  Plus,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronRight,
  ArrowLeft,
  Share2,
  Ticket,
  DollarSign,
  Video,
  Image as ImageIcon,
  Award,
  Music,
  UserCheck,
  Building,
  ShieldAlert,
  FileText,
  Download,
  Printer,
  ExternalLink,
  MessageSquare,
  HelpCircle,
  BarChart3,
  Check
} from 'lucide-react';
import begenaPlayingImg from '../../assets/images/begena_playing.jpg';
import { motion, AnimatePresence } from 'motion/react';
import {
  ComprehensiveEvent,
  EventRegistrationTicket,
  EventTypeCategory,
  EventStatusType,
  EventVisibilityType,
  PageId,
  Language
} from '../../types';
import {
  SAMPLE_COMPREHENSIVE_EVENTS,
  SAMPLE_EVENT_TICKETS
} from './EventsData';
import { useAuth } from '../../context/AuthContext';

interface EventsCenterProps {
  lang: Language;
  onNavigate: (page: PageId, params?: any) => void;
  initialEventId?: string;
}

export function EventsCenter({ lang, onNavigate, initialEventId }: EventsCenterProps) {
  const { currentUser, hasPermission } = useAuth();

  const [eventsList, setEventsList] = useState<ComprehensiveEvent[]>(SAMPLE_COMPREHENSIVE_EVENTS);
  const [ticketsList, setTicketsList] = useState<EventRegistrationTicket[]>(SAMPLE_EVENT_TICKETS);
  
  const [activeTab, setActiveTab] = useState<'all' | 'upcoming' | 'concerts' | 'past' | 'my-tickets' | 'checkin' | 'manage'>('all');
  const [selectedEvent, setSelectedEvent] = useState<ComprehensiveEvent | null>(
    initialEventId ? eventsList.find(e => e.id === initialEventId) || eventsList[0] : null
  );

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedBranch, setSelectedBranch] = useState<string>('All');

  // Event Registration Modal
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [registerName, setRegisterName] = useState(currentUser?.fullName || '');
  const [registerPhone, setRegisterPhone] = useState(currentUser?.phone || '');
  const [registerEmail, setRegisterEmail] = useState(currentUser?.email || '');
  const [registerRole, setRegisterRole] = useState<'Student' | 'Parent' | 'Guest' | 'Performer'>('Student');
  const [generatedTicket, setGeneratedTicket] = useState<EventRegistrationTicket | null>(null);

  // Check-in Scanner State
  const [checkInInput, setCheckInInput] = useState('');
  const [checkInResult, setCheckInResult] = useState<{ success: boolean; message: string; ticket?: EventRegistrationTicket } | null>(null);

  // Create Event Form Modal
  const [isCreateEventModalOpen, setIsCreateEventModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<EventTypeCategory>('Concert');
  const [newBranch, setNewBranch] = useState('Piazza Headquarters');
  const [newLocation, setNewLocation] = useState('');
  const [newStartDate, setNewStartDate] = useState('');
  const [newStartTime, setNewStartTime] = useState('10:00 AM');
  const [newOrganizer, setNewOrganizer] = useState('Liora Begena Event Team');
  const [newMaxCapacity, setNewMaxCapacity] = useState(200);
  const [newDescription, setNewDescription] = useState('');

  // Filtering events
  const filteredEvents = eventsList.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || event.eventType === selectedCategory;
    const matchesBranch = selectedBranch === 'All' || event.branchName.includes(selectedBranch);

    if (activeTab === 'upcoming') return matchesSearch && matchesCategory && matchesBranch && event.status === 'Upcoming';
    if (activeTab === 'concerts') return matchesSearch && matchesCategory && matchesBranch && event.eventType === 'Concert';
    if (activeTab === 'past') return matchesSearch && matchesCategory && matchesBranch && (event.status === 'Completed' || event.status === 'Archived');
    return matchesSearch && matchesCategory && matchesBranch;
  });

  const myTickets = ticketsList.filter(
    (t) => t.participantEmail === currentUser?.email || t.participantPhone === currentUser?.phone || t.participantName === currentUser?.fullName
  );

  const handleRegisterEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent) return;

    const newTicketNumber = `ABS-TKT-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const ticket: EventRegistrationTicket = {
      id: `tkt-${Date.now()}`,
      eventId: selectedEvent.id,
      eventTitle: selectedEvent.title,
      ticketNumber: newTicketNumber,
      participantName: registerName,
      participantPhone: registerPhone,
      participantEmail: registerEmail,
      participantRole: registerRole,
      studentId: currentUser?.id,
      branchName: selectedEvent.branchName,
      courseName: currentUser?.enrolledCourse || 'General Admission',
      qrCodeData: `${newTicketNumber}|${registerName}|${selectedEvent.id}`,
      isCheckedIn: false,
      registeredAt: new Date().toISOString().split('T')[0],
      status: 'Registered'
    };

    setTicketsList([ticket, ...ticketsList]);
    setGeneratedTicket(ticket);
    
    // Update registered count
    setEventsList(eventsList.map(ev => ev.id === selectedEvent.id ? { ...ev, registeredCount: ev.registeredCount + 1 } : ev));
  };

  const handleProcessCheckIn = (codeOrNumber: string) => {
    if (!codeOrNumber.trim()) return;

    const matched = ticketsList.find(
      (t) => t.ticketNumber.toLowerCase() === codeOrNumber.trim().toLowerCase() ||
             t.qrCodeData.toLowerCase().includes(codeOrNumber.trim().toLowerCase()) ||
             t.participantPhone.includes(codeOrNumber.trim())
    );

    if (!matched) {
      setCheckInResult({
        success: false,
        message: `No valid registration ticket found matching "${codeOrNumber}". Please verify student ID or ticket number.`
      });
      return;
    }

    if (matched.isCheckedIn) {
      setCheckInResult({
        success: false,
        message: `Ticket ${matched.ticketNumber} for ${matched.participantName} was ALREADY checked in at ${matched.checkedInAt}. Duplicate check-in blocked!`,
        ticket: matched
      });
      return;
    }

    const updated = {
      ...matched,
      isCheckedIn: true,
      checkedInAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      checkedInBy: currentUser?.fullName || 'Registration Staff',
      status: 'Checked In' as const
    };

    setTicketsList(ticketsList.map(t => t.id === matched.id ? updated : t));
    setCheckInResult({
      success: true,
      message: `SUCCESS! Ticket ${updated.ticketNumber} checked in for ${updated.participantName} (${updated.participantRole}).`,
      ticket: updated
    });
    setCheckInInput('');
  };

  const handleCreateEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newLocation) return;

    const created: ComprehensiveEvent = {
      id: `evt-${Date.now()}`,
      title: newTitle,
      description: newDescription || 'Special Liora Begena School cultural event.',
      fullDescription: newDescription,
      coverImage: begenaPlayingImg,
      eventType: newType,
      branchId: 'b-piazza',
      branchName: newBranch,
      location: newLocation,
      startDate: newStartDate || new Date().toISOString().split('T')[0],
      endDate: newStartDate || new Date().toISOString().split('T')[0],
      startTime: newStartTime,
      endTime: '05:00 PM',
      organizer: newOrganizer,
      maxCapacity: Number(newMaxCapacity),
      registeredCount: 0,
      waitlistCount: 0,
      registrationRequired: true,
      visibility: 'Public',
      status: 'Upcoming',
      agenda: [
        { id: 'ag-new-1', time: newStartTime, activity: 'Opening Ceremony & Welcome', speakerOrPerformer: newOrganizer, location: newLocation, durationMinutes: 30 }
      ],
      performers: [],
      galleryImages: [begenaPlayingImg]
    };

    setEventsList([created, ...eventsList]);
    setIsCreateEventModalOpen(false);
    setSelectedEvent(created);
  };

  return (
    <div className="space-y-8 pb-16 text-left">
      {/* HEADER SECTION */}
      <div className="bg-gradient-to-r from-[#FFFDF8] via-[#FAF6EF] to-white border border-[#E7DED1] rounded-2xl p-6 sm:p-8 shadow-2xs relative overflow-hidden">
        <div className="max-w-4xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E7DED1] text-xs font-bold text-[#E89B52] shadow-3xs">
            <Sparkles size={14} className="text-[#C79A2B]" />
            <span>Liora Begena Events, Concerts & Performance Hub</span>
          </div>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-[#2B2B2B] tracking-tight">
            Sacred Recitals, Competitions & Graduation Center
          </h1>
          <p className="text-sm text-[#666666] leading-relaxed max-w-2xl">
            Explore upcoming concerts, masterclasses, youth competitions, and graduation recitals. Register for digital tickets, check-in via QR codes, and review sacred performance programs.
          </p>
        </div>
      </div>

      {/* TOP NAVIGATION TABS & SEARCH BAR */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white border border-[#E7DED1] p-3 rounded-xl shadow-3xs">
        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto w-full lg:w-auto">
          <button
            onClick={() => { setActiveTab('all'); setSelectedEvent(null); }}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${activeTab === 'all' ? 'bg-[#E89B52] text-white shadow-2xs' : 'text-[#666666] hover:bg-[#FAF6EF]'}`}
          >
            All Events ({eventsList.length})
          </button>
          <button
            onClick={() => { setActiveTab('upcoming'); setSelectedEvent(null); }}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${activeTab === 'upcoming' ? 'bg-[#E89B52] text-white shadow-2xs' : 'text-[#666666] hover:bg-[#FAF6EF]'}`}
          >
            Upcoming
          </button>
          <button
            onClick={() => { setActiveTab('concerts'); setSelectedEvent(null); }}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${activeTab === 'concerts' ? 'bg-[#E89B52] text-white shadow-2xs' : 'text-[#666666] hover:bg-[#FAF6EF]'}`}
          >
            Sacred Concerts
          </button>
          <button
            onClick={() => { setActiveTab('my-tickets'); setSelectedEvent(null); }}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${activeTab === 'my-tickets' ? 'bg-[#E89B52] text-white shadow-2xs' : 'text-[#666666] hover:bg-[#FAF6EF]'}`}
          >
            <Ticket size={14} />
            <span>My Tickets ({myTickets.length})</span>
          </button>

          {(hasPermission('admin') || currentUser?.role === 'branch_manager' || currentUser?.role === 'registration_staff') && (
            <button
              onClick={() => { setActiveTab('checkin'); setSelectedEvent(null); }}
              className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${activeTab === 'checkin' ? 'bg-[#6F4E37] text-white shadow-2xs' : 'text-[#6F4E37] hover:bg-[#FAF6EF] bg-[#FAF6EF]/60'}`}
            >
              <QrCode size={14} />
              <span>Staff QR Check-In</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9E9E9E]" />
            <input
              type="text"
              placeholder="Search event title, venue..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-[#E7DED1] rounded-lg bg-[#FAF6EF]/30 focus:outline-none focus:border-[#E89B52]"
            />
          </div>

          {(hasPermission('admin') || currentUser?.role === 'branch_manager') && (
            <button
              onClick={() => setIsCreateEventModalOpen(true)}
              className="px-3 py-1.5 bg-[#E89B52] text-white rounded-lg text-xs font-bold hover:bg-[#d68a41] transition-colors cursor-pointer flex items-center gap-1 shrink-0"
            >
              <Plus size={14} />
              <span>Create Event</span>
            </button>
          )}
        </div>
      </div>

      {/* DETAILED SINGLE EVENT VIEW MODE */}
      {selectedEvent ? (
        <div className="space-y-6">
          <button
            onClick={() => setSelectedEvent(null)}
            className="inline-flex items-center gap-2 text-xs font-bold text-[#E89B52] hover:underline cursor-pointer"
          >
            <ArrowLeft size={14} />
            <span>Back to All Events</span>
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Main Event Content */}
            <div className="lg:col-span-8 space-y-6">
              <div className="relative rounded-2xl overflow-hidden border border-[#E7DED1] shadow-xs h-72 sm:h-96">
                <img
                  src={selectedEvent.coverImage}
                  alt={selectedEvent.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#E89B52] text-white">
                      {selectedEvent.eventType}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/20 backdrop-blur-xs text-white">
                      {selectedEvent.branchName}
                    </span>
                  </div>
                  <h2 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">
                    {selectedEvent.title}
                  </h2>
                </div>
              </div>

              {/* Event Metadata Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-white border border-[#E7DED1] rounded-xl text-xs">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase text-[#666666]">Date & Time</p>
                  <p className="font-semibold text-[#2B2B2B] flex items-center gap-1">
                    <Calendar size={13} className="text-[#E89B52]" />
                    <span>{selectedEvent.startDate}</span>
                  </p>
                  <p className="text-[#666666] pl-4">{selectedEvent.startTime}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase text-[#666666]">Location</p>
                  <p className="font-semibold text-[#2B2B2B] flex items-center gap-1 truncate">
                    <MapPin size={13} className="text-[#E89B52]" />
                    <span className="truncate">{selectedEvent.location}</span>
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase text-[#666666]">Capacity & Registered</p>
                  <p className="font-semibold text-[#2B2B2B] flex items-center gap-1">
                    <Users size={13} className="text-[#E89B52]" />
                    <span>{selectedEvent.registeredCount} / {selectedEvent.maxCapacity} Seats</span>
                  </p>
                  <p className="text-[10px] text-[#C79A2B] pl-4">{selectedEvent.maxCapacity - selectedEvent.registeredCount} available</p>
                </div>

                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase text-[#666666]">Organizer</p>
                  <p className="font-semibold text-[#2B2B2B] truncate">{selectedEvent.organizer}</p>
                </div>
              </div>

              {/* Full Description */}
              <div className="bg-white border border-[#E7DED1] p-6 rounded-xl space-y-3">
                <h3 className="font-display font-bold text-lg text-[#2B2B2B]">About this Event</h3>
                <p className="text-sm text-[#666666] leading-relaxed whitespace-pre-line">
                  {selectedEvent.fullDescription || selectedEvent.description}
                </p>
              </div>

              {/* Event Agenda & Schedule */}
              {selectedEvent.agenda && selectedEvent.agenda.length > 0 && (
                <div className="bg-white border border-[#E7DED1] p-6 rounded-xl space-y-4">
                  <h3 className="font-display font-bold text-lg text-[#2B2B2B] flex items-center gap-2">
                    <Clock size={18} className="text-[#E89B52]" />
                    <span>Official Program Agenda</span>
                  </h3>
                  <div className="divide-y divide-[#E7DED1] border border-[#E7DED1] rounded-lg overflow-hidden">
                    {selectedEvent.agenda.map((ag) => (
                      <div key={ag.id} className="p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-[#FAF6EF]/30 transition-colors">
                        <div className="flex items-center gap-3">
                          <span className="px-2.5 py-1 font-mono text-xs font-bold text-[#E89B52] bg-[#FAF6EF] border border-[#E7DED1] rounded">
                            {ag.time}
                          </span>
                          <div>
                            <p className="text-xs font-bold text-[#2B2B2B]">{ag.activity}</p>
                            <p className="text-[11px] text-[#666666]">{ag.speakerOrPerformer}</p>
                          </div>
                        </div>
                        <span className="text-[10px] text-[#9E9E9E] font-mono shrink-0">
                          {ag.location} ({ag.durationMinutes} mins)
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Performers Program Showcase */}
              {selectedEvent.performers && selectedEvent.performers.length > 0 && (
                <div className="bg-white border border-[#E7DED1] p-6 rounded-xl space-y-4">
                  <h3 className="font-display font-bold text-lg text-[#2B2B2B] flex items-center gap-2">
                    <Music size={18} className="text-[#C79A2B]" />
                    <span>Sacred Recital Performers & Program Order</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedEvent.performers.map((pf) => (
                      <div key={pf.id} className="p-3 border border-[#E7DED1] rounded-lg bg-[#FAF6EF]/20 space-y-1">
                        <div className="flex items-center justify-between text-xs font-bold text-[#2B2B2B]">
                          <span className="flex items-center gap-1.5">
                            <span className="w-5 h-5 rounded-full bg-[#E89B52] text-white flex items-center justify-center text-[10px] font-mono">
                              #{pf.order}
                            </span>
                            <span>{pf.performerName}</span>
                          </span>
                          <span className="text-[10px] font-mono text-[#E89B52]">{pf.instrument}</span>
                        </div>
                        <p className="text-xs text-[#6F4E37] font-semibold pl-6 font-display">
                          “{pf.songOrMezmurTitle}”
                        </p>
                        {pf.notes && <p className="text-[10px] text-[#666666] pl-6 italic">{pf.notes}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Action & Registration Sidebar */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white border-2 border-[#E89B52] p-6 rounded-2xl shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-[#E7DED1] pb-3">
                  <div>
                    <p className="text-[10px] font-bold text-[#666666] uppercase">Registration Status</p>
                    <p className="font-display font-bold text-lg text-[#2B2B2B]">
                      {selectedEvent.registrationRequired ? 'Free Registration' : 'Open Admission'}
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#10B981]/10 text-[#10B981]">
                    {selectedEvent.status}
                  </span>
                </div>

                <div className="space-y-2 text-xs text-[#666666]">
                  <p className="flex justify-between">
                    <span>Registered Guests:</span>
                    <strong className="text-[#2B2B2B]">{selectedEvent.registeredCount} / {selectedEvent.maxCapacity}</strong>
                  </p>
                  <div className="w-full bg-[#FAF6EF] rounded-full h-2 overflow-hidden border border-[#E7DED1]">
                    <div
                      className="bg-[#E89B52] h-full transition-all"
                      style={{ width: `${Math.min((selectedEvent.registeredCount / selectedEvent.maxCapacity) * 100, 100)}%` }}
                    />
                  </div>
                </div>

                <button
                  onClick={() => setIsRegisterModalOpen(true)}
                  disabled={selectedEvent.registeredCount >= selectedEvent.maxCapacity}
                  className="w-full py-3 bg-[#E89B52] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-2xs hover:bg-[#d68a41] transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Ticket size={16} />
                  <span>{selectedEvent.registeredCount >= selectedEvent.maxCapacity ? 'Event Full (Waitlist)' : 'Register for Ticket'}</span>
                </button>

                <p className="text-[11px] text-[#9E9E9E] text-center">
                  Instant digital QR pass will be issued upon confirmation.
                </p>
              </div>

              {/* Event Sponsors Card */}
              {selectedEvent.sponsors && selectedEvent.sponsors.length > 0 && (
                <div className="bg-[#FAF6EF] border border-[#E7DED1] p-4 rounded-xl space-y-2 text-xs">
                  <p className="font-bold text-[#2B2B2B] uppercase tracking-wider text-[10px]">Event Benefactors & Sponsors</p>
                  <div className="space-y-1.5">
                    {selectedEvent.sponsors.map((sp, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-white p-2 rounded border border-[#E7DED1]">
                        <span className="font-semibold text-[#2B2B2B]">{sp.name}</span>
                        <span className="text-[10px] font-mono text-[#C79A2B]">{sp.tier}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : activeTab === 'checkin' ? (
        /* STAFF QR CHECK-IN MODE */
        <div className="max-w-2xl mx-auto bg-white border border-[#E7DED1] p-6 sm:p-8 rounded-2xl shadow-sm space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-[#6F4E37]/10 text-[#6F4E37] mx-auto flex items-center justify-center">
              <QrCode size={24} />
            </div>
            <h2 className="font-display font-bold text-xl text-[#2B2B2B]">Staff Event QR Ticket Check-In</h2>
            <p className="text-xs text-[#666666]">
              Scan guest ticket QR code or manually enter ticket number / phone number to verify entrance.
            </p>
          </div>

          <div className="p-4 border-2 border-dashed border-[#C79A2B] rounded-xl bg-[#FAF6EF]/30 text-center space-y-3">
            <div className="w-16 h-16 bg-white border border-[#E7DED1] rounded-lg mx-auto flex items-center justify-center text-[#E89B52]">
              <QrCode size={36} />
            </div>
            <p className="text-xs font-semibold text-[#2B2B2B]">Simulated Camera QR Scanner Active</p>
            <p className="text-[10px] text-[#666666]">Point camera at ticket QR pass or type ticket code below</p>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-bold text-[#2B2B2B]">Manual Ticket Verification Search</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter Ticket # (e.g. ABS-TKT-2026-9021) or Phone"
                value={checkInInput}
                onChange={(e) => setCheckInInput(e.target.value)}
                className="flex-1 px-3 py-2 text-xs border border-[#E7DED1] rounded-lg focus:outline-none focus:border-[#E89B52]"
              />
              <button
                onClick={() => handleProcessCheckIn(checkInInput)}
                className="px-4 py-2 bg-[#6F4E37] text-white text-xs font-bold rounded-lg hover:bg-[#5a3f2c] transition-colors cursor-pointer"
              >
                Verify & Check In
              </button>
            </div>
          </div>

          {/* Result Banner */}
          {checkInResult && (
            <div
              className={`p-4 rounded-xl border space-y-2 text-xs ${
                checkInResult.success
                  ? 'bg-[#10B981]/10 border-[#10B981] text-[#10B981]'
                  : 'bg-[#EF4444]/10 border-[#EF4444] text-[#EF4444]'
              }`}
            >
              <div className="flex items-center gap-2 font-bold">
                {checkInResult.success ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                <span>{checkInResult.message}</span>
              </div>
              {checkInResult.ticket && (
                <div className="p-2 bg-white rounded border border-[#E7DED1] text-[#2B2B2B] space-y-1 mt-2">
                  <p><strong>Guest:</strong> {checkInResult.ticket.participantName}</p>
                  <p><strong>Event:</strong> {checkInResult.ticket.eventTitle}</p>
                  <p><strong>Status:</strong> {checkInResult.ticket.status} at {checkInResult.ticket.checkedInAt}</p>
                </div>
              )}
            </div>
          )}

          {/* Recent Check-Ins Audit Table */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-[#2B2B2B] uppercase">Live Checked-In Attendees Log</h4>
            <div className="border border-[#E7DED1] rounded-lg overflow-x-auto text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#FAF6EF] border-b border-[#E7DED1] text-[10px] font-bold text-[#2B2B2B]">
                    <th className="p-2">Ticket #</th>
                    <th className="p-2">Guest Name</th>
                    <th className="p-2">Checked In At</th>
                    <th className="p-2">Checked In By</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E7DED1] text-[#666666]">
                  {ticketsList.filter(t => t.isCheckedIn).map((t) => (
                    <tr key={t.id}>
                      <td className="p-2 font-mono font-bold text-[#E89B52]">{t.ticketNumber}</td>
                      <td className="p-2 font-semibold text-[#2B2B2B]">{t.participantName}</td>
                      <td className="p-2 font-mono">{t.checkedInAt}</td>
                      <td className="p-2">{t.checkedInBy}</td>
                    </tr>
                  ))}
                  {ticketsList.filter(t => t.isCheckedIn).length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-4 text-center text-[#9E9E9E] italic">No checked-in guests recorded yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : activeTab === 'my-tickets' ? (
        /* MY REGISTERED TICKETS VIEW */
        <div className="space-y-6">
          <h2 className="font-display font-bold text-xl text-[#2B2B2B]">My Event Tickets & QR Passes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myTickets.map((ticket) => (
              <div key={ticket.id} className="bg-white border-2 border-[#E7DED1] rounded-2xl p-5 shadow-2xs space-y-4 relative overflow-hidden">
                <div className="flex items-center justify-between border-b border-[#E7DED1] pb-3">
                  <span className="font-mono text-xs font-bold text-[#E89B52]">{ticket.ticketNumber}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${ticket.isCheckedIn ? 'bg-[#10B981]/10 text-[#10B981]' : 'bg-[#3B82F6]/10 text-[#3B82F6]'}`}>
                    {ticket.isCheckedIn ? 'Checked In' : 'Valid Ticket'}
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="font-display font-bold text-base text-[#2B2B2B]">{ticket.eventTitle}</h3>
                  <p className="text-xs text-[#666666]">Branch: {ticket.branchName}</p>
                  <p className="text-xs text-[#666666]">Participant: {ticket.participantName} ({ticket.participantRole})</p>
                </div>

                {/* Simulated QR Pass */}
                <div className="p-3 border border-dashed border-[#C79A2B] rounded-xl bg-[#FAF6EF]/40 text-center space-y-2">
                  <div className="w-24 h-24 bg-white border border-[#E7DED1] rounded-lg mx-auto flex flex-col items-center justify-center p-1 shadow-3xs">
                    <QrCode size={64} className="text-[#2B2B2B]" />
                  </div>
                  <p className="text-[10px] font-mono text-[#666666]">Present QR at door for entrance</p>
                </div>

                <div className="flex gap-2 text-xs">
                  <button className="flex-1 py-1.5 bg-[#FAF6EF] border border-[#E7DED1] rounded-lg text-[#2B2B2B] font-semibold flex items-center justify-center gap-1">
                    <Printer size={13} />
                    <span>Print</span>
                  </button>
                  <button className="flex-1 py-1.5 bg-[#FAF6EF] border border-[#E7DED1] rounded-lg text-[#2B2B2B] font-semibold flex items-center justify-center gap-1">
                    <Share2 size={13} />
                    <span>Share</span>
                  </button>
                </div>
              </div>
            ))}

            {myTickets.length === 0 && (
              <div className="col-span-full p-12 text-center bg-white border border-[#E7DED1] rounded-2xl space-y-3">
                <Ticket size={36} className="text-[#9E9E9E] mx-auto" />
                <p className="text-sm font-semibold text-[#2B2B2B]">No Event Tickets Registered Yet</p>
                <p className="text-xs text-[#666666]">Browse upcoming concerts and competitions to claim your digital entrance passes.</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* MAIN EVENTS CARDS LISTING */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              onClick={() => setSelectedEvent(event)}
              className="bg-white border border-[#E7DED1] rounded-2xl overflow-hidden shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={event.coverImage}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3 flex gap-1.5">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#E89B52] text-white shadow-3xs">
                      {event.eventType}
                    </span>
                  </div>
                  <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-md text-[10px] font-mono font-bold text-[#2B2B2B]">
                    {event.registeredCount}/{event.maxCapacity} Seats
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <div className="flex items-center gap-2 text-[11px] font-semibold text-[#E89B52]">
                    <Calendar size={13} />
                    <span>{event.startDate} • {event.startTime}</span>
                  </div>

                  <h3 className="font-display font-bold text-base text-[#2B2B2B] leading-snug group-hover:text-[#E89B52] transition-colors">
                    {event.title}
                  </h3>

                  <p className="text-xs text-[#666666] line-clamp-2 leading-relaxed">
                    {event.description}
                  </p>

                  <div className="flex items-center gap-1.5 text-xs text-[#666666] pt-1">
                    <MapPin size={13} className="text-[#C79A2B] shrink-0" />
                    <span className="truncate">{event.location}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-[#E7DED1] bg-[#FAF6EF]/20 flex items-center justify-between text-xs">
                <span className="text-[11px] font-bold text-[#6F4E37]">{event.branchName}</span>
                <span className="font-bold text-[#E89B52] flex items-center gap-1">
                  <span>View Event Program</span>
                  <ChevronRight size={14} />
                </span>
              </div>
            </div>
          ))}

          {filteredEvents.length === 0 && (
            <div className="col-span-full p-12 text-center bg-white border border-[#E7DED1] rounded-2xl space-y-3">
              <Calendar size={36} className="text-[#9E9E9E] mx-auto" />
              <p className="text-sm font-semibold text-[#2B2B2B]">No events match your current filter</p>
              <p className="text-xs text-[#666666]">Try adjusting your search query or selecting "All Events".</p>
            </div>
          )}
        </div>
      )}

      {/* EVENT REGISTRATION MODAL */}
      <AnimatePresence>
        {isRegisterModalOpen && selectedEvent && (
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
              className="bg-white border border-[#E7DED1] rounded-2xl p-6 max-w-md w-full shadow-lg space-y-5"
            >
              <div className="flex items-center justify-between border-b border-[#E7DED1] pb-3">
                <h3 className="font-display font-bold text-lg text-[#2B2B2B]">
                  Register for {selectedEvent.title}
                </h3>
                <button
                  onClick={() => { setIsRegisterModalOpen(false); setGeneratedTicket(null); }}
                  className="p-1 text-[#666666] hover:text-black cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {generatedTicket ? (
                /* Ticket Confirmation View */
                <div className="space-y-4 text-center">
                  <div className="w-12 h-12 rounded-full bg-[#10B981]/10 text-[#10B981] mx-auto flex items-center justify-center">
                    <CheckCircle2 size={28} />
                  </div>
                  <h4 className="font-display font-bold text-lg text-[#2B2B2B]">Registration Confirmed!</h4>
                  <p className="text-xs text-[#666666]">
                    Your digital entrance pass has been generated. Show this QR pass at the entrance.
                  </p>

                  <div className="p-4 border-2 border-dashed border-[#E89B52] rounded-xl bg-[#FAF6EF]/50 space-y-2">
                    <p className="font-mono text-xs font-bold text-[#E89B52]">{generatedTicket.ticketNumber}</p>
                    <div className="w-28 h-28 bg-white border border-[#E7DED1] rounded-lg mx-auto flex items-center justify-center">
                      <QrCode size={80} className="text-[#2B2B2B]" />
                    </div>
                    <p className="text-xs font-semibold text-[#2B2B2B]">{generatedTicket.participantName}</p>
                    <p className="text-[10px] text-[#666666]">{selectedEvent.title} • {selectedEvent.startDate}</p>
                  </div>

                  <button
                    onClick={() => { setIsRegisterModalOpen(false); setGeneratedTicket(null); setActiveTab('my-tickets'); }}
                    className="w-full py-2 bg-[#E89B52] text-white text-xs font-bold rounded-lg cursor-pointer"
                  >
                    View in My Tickets
                  </button>
                </div>
              ) : (
                /* Registration Input Form */
                <form onSubmit={handleRegisterEvent} className="space-y-4 text-xs">
                  <div className="space-y-1">
                    <label className="font-bold text-[#2B2B2B]">Full Name</label>
                    <input
                      type="text"
                      required
                      value={registerName}
                      onChange={(e) => setRegisterName(e.target.value)}
                      className="w-full px-3 py-2 border border-[#E7DED1] rounded-lg focus:outline-none focus:border-[#E89B52]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold text-[#2B2B2B]">Phone Number</label>
                      <input
                        type="text"
                        required
                        value={registerPhone}
                        onChange={(e) => setRegisterPhone(e.target.value)}
                        className="w-full px-3 py-2 border border-[#E7DED1] rounded-lg focus:outline-none focus:border-[#E89B52]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-[#2B2B2B]">Role Type</label>
                      <select
                        value={registerRole}
                        onChange={(e) => setRegisterRole(e.target.value as any)}
                        className="w-full px-3 py-2 border border-[#E7DED1] rounded-lg focus:outline-none focus:border-[#E89B52]"
                      >
                        <option value="Student">Student</option>
                        <option value="Parent">Parent</option>
                        <option value="Guest">Guest</option>
                        <option value="Performer">Performer</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-[#2B2B2B]">Email Address</label>
                    <input
                      type="email"
                      required
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      className="w-full px-3 py-2 border border-[#E7DED1] rounded-lg focus:outline-none focus:border-[#E89B52]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-[#E89B52] text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-2xs hover:bg-[#d68a41] transition-colors cursor-pointer"
                  >
                    Confirm & Issue Digital QR Pass
                  </button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CREATE EVENT MODAL FOR STAFF */}
      <AnimatePresence>
        {isCreateEventModalOpen && (
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
              className="bg-white border border-[#E7DED1] rounded-2xl p-6 max-w-lg w-full shadow-lg space-y-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-[#E7DED1] pb-3">
                <h3 className="font-display font-bold text-lg text-[#2B2B2B]">
                  Create New Liora Begena Event
                </h3>
                <button
                  onClick={() => setIsCreateEventModalOpen(false)}
                  className="p-1 text-[#666666] hover:text-black cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateEventSubmit} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-[#2B2B2B]">Event Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sacred Krar Youth Ensemble Recital"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-[#E7DED1] rounded-lg focus:outline-none focus:border-[#E89B52]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-[#2B2B2B]">Event Type</label>
                    <select
                      value={newType}
                      onChange={(e) => setNewType(e.target.value as any)}
                      className="w-full px-3 py-2 border border-[#E7DED1] rounded-lg focus:outline-none focus:border-[#E89B52]"
                    >
                      <option value="Concert">Concert</option>
                      <option value="Student Performance">Student Performance</option>
                      <option value="Masterclass">Masterclass</option>
                      <option value="Competition">Competition</option>
                      <option value="Graduation">Graduation</option>
                      <option value="Church Event">Church Event</option>
                      <option value="Music Workshop">Music Workshop</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-[#2B2B2B]">Branch</label>
                    <select
                      value={newBranch}
                      onChange={(e) => setNewBranch(e.target.value)}
                      className="w-full px-3 py-2 border border-[#E7DED1] rounded-lg focus:outline-none focus:border-[#E89B52]"
                    >
                      <option value="Piazza Headquarters">Piazza Headquarters</option>
                      <option value="Megenagna Hub">Megenagna Hub</option>
                      <option value="Lebu Annex">Lebu Annex</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#2B2B2B]">Venue Location</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Piazza Main Auditorium"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="w-full px-3 py-2 border border-[#E7DED1] rounded-lg focus:outline-none focus:border-[#E89B52]"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-[#2B2B2B]">Date</label>
                    <input
                      type="date"
                      required
                      value={newStartDate}
                      onChange={(e) => setNewStartDate(e.target.value)}
                      className="w-full px-3 py-2 border border-[#E7DED1] rounded-lg focus:outline-none focus:border-[#E89B52]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-[#2B2B2B]">Start Time</label>
                    <input
                      type="text"
                      value={newStartTime}
                      onChange={(e) => setNewStartTime(e.target.value)}
                      className="w-full px-3 py-2 border border-[#E7DED1] rounded-lg focus:outline-none focus:border-[#E89B52]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-[#2B2B2B]">Capacity</label>
                    <input
                      type="number"
                      value={newMaxCapacity}
                      onChange={(e) => setNewMaxCapacity(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-[#E7DED1] rounded-lg focus:outline-none focus:border-[#E89B52]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#2B2B2B]">Description</label>
                  <textarea
                    rows={3}
                    placeholder="Event overview, program highlights..."
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-[#E7DED1] rounded-lg focus:outline-none focus:border-[#E89B52]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#E89B52] text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-2xs hover:bg-[#d68a41] transition-colors cursor-pointer"
                >
                  Publish New Event
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

