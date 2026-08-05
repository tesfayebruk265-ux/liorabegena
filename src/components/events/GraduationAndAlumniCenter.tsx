import React, { useState } from 'react';
import {
  GraduationCap,
  Users,
  Calendar,
  MapPin,
  QrCode,
  Video,
  Award,
  Sparkles,
  Search,
  ExternalLink,
  MessageSquare,
  UserCheck,
  Plus,
  CheckCircle2,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  GraduationCeremony,
  GraduateStudentItem,
  AlumniProfile,
  MentorshipPair,
  Language,
  PageId
} from '../../types';
import {
  SAMPLE_GRADUATIONS,
  SAMPLE_GRADUATES,
  SAMPLE_ALUMNI,
  SAMPLE_MENTORSHIPS
} from './EventsData';
import { useAuth } from '../../context/AuthContext';

interface GraduationAndAlumniCenterProps {
  lang: Language;
  onNavigate: (page: PageId, params?: any) => void;
  initialMode?: 'graduation' | 'alumni';
}

export function GraduationAndAlumniCenter({ lang, onNavigate, initialMode = 'graduation' }: GraduationAndAlumniCenterProps) {
  const { currentUser } = useAuth();

  const [ceremony] = useState<GraduationCeremony>(SAMPLE_GRADUATIONS[0]);
  const [graduates, setGraduates] = useState<GraduateStudentItem[]>(SAMPLE_GRADUATES);
  const [alumni, setAlumni] = useState<AlumniProfile[]>(SAMPLE_ALUMNI);
  const [mentorships, setMentorships] = useState<MentorshipPair[]>(SAMPLE_MENTORSHIPS);

  const [activeTab, setActiveTab] = useState<'ceremony' | 'graduates' | 'alumni' | 'mentorship'>(
    initialMode === 'alumni' ? 'alumni' : 'ceremony'
  );

  // Mentorship Application Modal State
  const [isMentorModalOpen, setIsMentorModalOpen] = useState(false);
  const [selectedAlumniMentor, setSelectedAlumniMentor] = useState<AlumniProfile | null>(null);
  const [mentorshipFocus, setMentorshipFocus] = useState('');

  // Guest QR Invitation Generator State
  const [isGuestQrModalOpen, setIsGuestQrModalOpen] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [generatedGuestPass, setGeneratedGuestPass] = useState<string | null>(null);

  const handleApplyMentorship = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAlumniMentor) return;

    const newPair: MentorshipPair = {
      id: `mnt-${Date.now()}`,
      mentorId: selectedAlumniMentor.id,
      mentorName: `${selectedAlumniMentor.fullName} (Alumni ${selectedAlumniMentor.graduationYear})`,
      mentorRole: 'Alumni',
      studentId: currentUser?.id || 'STU-2026-001',
      studentName: currentUser?.fullName || 'Bereket Tadesse',
      instrument: selectedAlumniMentor.instrument,
      startDate: new Date().toISOString().split('T')[0],
      status: 'Active',
      focusArea: mentorshipFocus || 'Sacred Hymn Lyrics & Advanced Plucking'
    };

    setMentorships([newPair, ...mentorships]);
    setIsMentorModalOpen(false);
    alert(`Mentorship Request Sent to ${selectedAlumniMentor.fullName}!`);
  };

  const handleGenerateGuestPass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName) return;
    const pass = `INV-GRAD-2026-GUEST-${Math.floor(1000 + Math.random() * 9000)}`;
    setGeneratedGuestPass(pass);
  };

  return (
    <div className="space-y-8 pb-16 text-left">
      {/* HEADER SECTION */}
      <div className="bg-gradient-to-r from-[#FFFDF8] via-[#FAF6EF] to-white border border-[#E7DED1] rounded-2xl p-6 sm:p-8 shadow-2xs relative overflow-hidden">
        <div className="max-w-4xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E7DED1] text-xs font-bold text-[#E89B52] shadow-3xs">
            <GraduationCap size={14} className="text-[#C79A2B]" />
            <span>Abel Begena Graduation & Global Alumni Network</span>
          </div>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-[#2B2B2B] tracking-tight">
            Class of 2026 Graduation Recital & Alumni Heritage Network
          </h1>
          <p className="text-sm text-[#666666] leading-relaxed max-w-2xl">
            Celebrate graduating traditional music scholars, generate guest QR invitation passes, connect with Abel Begena alumni worldwide, and access 1-on-1 mentorship pairings.
          </p>
        </div>
      </div>

      {/* NAVIGATION TABS */}
      <div className="flex flex-wrap items-center gap-2 bg-white border border-[#E7DED1] p-2 rounded-xl shadow-3xs">
        <button
          onClick={() => setActiveTab('ceremony')}
          className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${activeTab === 'ceremony' ? 'bg-[#E89B52] text-white shadow-2xs' : 'text-[#666666] hover:bg-[#FAF6EF]'}`}
        >
          <GraduationCap size={14} />
          <span>Graduation Ceremony Program</span>
        </button>

        <button
          onClick={() => setActiveTab('graduates')}
          className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${activeTab === 'graduates' ? 'bg-[#E89B52] text-white shadow-2xs' : 'text-[#666666] hover:bg-[#FAF6EF]'}`}
        >
          <Award size={14} />
          <span>Graduating Class Directory ({graduates.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('alumni')}
          className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${activeTab === 'alumni' ? 'bg-[#E89B52] text-white shadow-2xs' : 'text-[#666666] hover:bg-[#FAF6EF]'}`}
        >
          <Users size={14} />
          <span>Alumni Directory ({alumni.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('mentorship')}
          className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${activeTab === 'mentorship' ? 'bg-[#E89B52] text-white shadow-2xs' : 'text-[#666666] hover:bg-[#FAF6EF]'}`}
        >
          <UserCheck size={14} />
          <span>Alumni Mentorship Pairs ({mentorships.length})</span>
        </button>
      </div>

      {/* CEREMONY PROGRAM TAB */}
      {activeTab === 'ceremony' && ceremony && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-6">
            <div className="relative rounded-2xl overflow-hidden border border-[#E7DED1] shadow-xs h-72 sm:h-80">
              <img src={ceremony.coverImage} alt={ceremony.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#E89B52] text-white">
                  {ceremony.academicYear}
                </span>
                <h2 className="font-display font-black text-2xl sm:text-3xl text-white">
                  {ceremony.title}
                </h2>
              </div>
            </div>

            {/* Metadata Bar */}
            <div className="grid grid-cols-3 gap-4 p-4 bg-white border border-[#E7DED1] rounded-xl text-xs">
              <div className="space-y-0.5">
                <p className="text-[10px] font-bold text-[#666666] uppercase">Date & Time</p>
                <p className="font-bold text-[#2B2B2B] flex items-center gap-1">
                  <Calendar size={13} className="text-[#E89B52]" /> {ceremony.date} ({ceremony.time})
                </p>
              </div>
              <div className="space-y-0.5">
                <p className="text-[10px] font-bold text-[#666666] uppercase">Location</p>
                <p className="font-bold text-[#2B2B2B] flex items-center gap-1 truncate">
                  <MapPin size={13} className="text-[#E89B52]" /> <span className="truncate">{ceremony.location}</span>
                </p>
              </div>
              <div className="space-y-0.5">
                <p className="text-[10px] font-bold text-[#666666] uppercase">Graduates & Capacity</p>
                <p className="font-bold text-[#2B2B2B] flex items-center gap-1">
                  <GraduationCap size={13} className="text-[#E89B52]" /> {ceremony.expectedGraduatesCount} Graduates ({ceremony.guestCapacity} Guests)
                </p>
              </div>
            </div>

            {/* Program Agenda */}
            <div className="bg-white border border-[#E7DED1] p-6 rounded-2xl space-y-4">
              <h3 className="font-display font-bold text-lg text-[#2B2B2B]">Graduation Recital Order of Events</h3>
              <div className="divide-y divide-[#E7DED1] border border-[#E7DED1] rounded-xl overflow-hidden text-xs">
                {ceremony.programAgenda.map((pa, idx) => (
                  <div key={idx} className="p-3.5 flex items-center justify-between gap-3 hover:bg-[#FAF6EF]/30">
                    <span className="font-mono font-bold text-[#E89B52] bg-[#FAF6EF] px-2 py-1 rounded border border-[#E7DED1]">
                      {pa.time}
                    </span>
                    <div className="flex-1">
                      <p className="font-bold text-[#2B2B2B]">{pa.item}</p>
                      <p className="text-[11px] text-[#666666]">{pa.presenter}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Guest Pass Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white border-2 border-[#E89B52] p-6 rounded-2xl shadow-xs space-y-4">
              <h3 className="font-display font-bold text-lg text-[#2B2B2B]">Family Guest Invitation Pass</h3>
              <p className="text-xs text-[#666666]">
                Generate official QR invitations for family members attending the graduation recital.
              </p>
              <button
                onClick={() => setIsGuestQrModalOpen(true)}
                className="w-full py-3 bg-[#E89B52] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-2xs hover:bg-[#d68a41] cursor-pointer flex items-center justify-center gap-2"
              >
                <QrCode size={16} />
                <span>Generate Guest Pass QR</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* GRADUATING CLASS DIRECTORY TAB */}
      {activeTab === 'graduates' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {graduates.map((g) => (
              <div key={g.id} className="bg-white border border-[#E7DED1] p-5 rounded-2xl shadow-2xs flex items-center gap-4">
                <img src={g.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'} alt={g.studentName} className="w-16 h-16 rounded-full object-cover border-2 border-[#E89B52]" referrerPolicy="no-referrer" />
                <div className="space-y-1 flex-1">
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-[10px] font-bold text-[#E89B52]">{g.certificateNumber}</span>
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-[#10B981]/10 text-[#10B981]">
                      {g.eligibilityStatus}
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-base text-[#2B2B2B]">{g.studentName}</h3>
                  <p className="text-xs text-[#666666]">{g.courseName} • {g.branchName}</p>
                  {g.honors && <p className="text-[10px] text-[#C79A2B] font-bold">{g.honors}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ALUMNI DIRECTORY TAB */}
      {activeTab === 'alumni' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {alumni.map((alm) => (
              <div key={alm.id} className="bg-white border border-[#E7DED1] p-5 rounded-2xl shadow-2xs space-y-4">
                <div className="flex items-center gap-4">
                  <img src={alm.avatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80'} alt={alm.fullName} className="w-14 h-14 rounded-full object-cover" referrerPolicy="no-referrer" />
                  <div>
                    <h3 className="font-display font-bold text-base text-[#2B2B2B]">{alm.fullName}</h3>
                    <p className="text-xs text-[#E89B52] font-semibold">Class of {alm.graduationYear} • {alm.instrument}</p>
                    <p className="text-[11px] text-[#666666]">{alm.currentOccupation}</p>
                  </div>
                </div>

                <p className="text-xs text-[#666666] leading-relaxed">{alm.biography}</p>

                <div className="flex items-center justify-between pt-2 border-t border-[#E7DED1]">
                  {alm.isAvailableForMentorship ? (
                    <button
                      onClick={() => { setSelectedAlumniMentor(alm); setIsMentorModalOpen(true); }}
                      className="px-3 py-1.5 bg-[#6F4E37] text-white text-xs font-bold rounded-lg hover:bg-[#5a3f2c] cursor-pointer"
                    >
                      Request 1-on-1 Mentorship
                    </button>
                  ) : (
                    <span className="text-[10px] text-[#9E9E9E]">Mentorship Unavailable</span>
                  )}

                  {alm.featuredPerformanceUrl && (
                    <a href={alm.featuredPerformanceUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-[#E89B52] font-bold hover:underline flex items-center gap-1">
                      <Video size={13} /> Watch Performance
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ALUMNI MENTORSHIP TAB */}
      {activeTab === 'mentorship' && (
        <div className="space-y-6">
          <h2 className="font-display font-bold text-xl text-[#2B2B2B]">Active Alumni & Faculty Mentorship Pairs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mentorships.map((m) => (
              <div key={m.id} className="bg-white border border-[#E7DED1] p-5 rounded-2xl shadow-2xs space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-[#E89B52]">{m.mentorName}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#10B981]/10 text-[#10B981]">{m.status}</span>
                </div>
                <p className="font-display font-bold text-base text-[#2B2B2B]">Mentee Student: {m.studentName}</p>
                <div className="p-2.5 bg-[#FAF6EF] border border-[#E7DED1] rounded-lg text-xs">
                  <span className="font-bold text-[#666666] uppercase text-[9px]">Mentorship Focus:</span>
                  <p className="text-[#2B2B2B]">{m.focusArea}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MENTORSHIP REQUEST MODAL */}
      <AnimatePresence>
        {isMentorModalOpen && selectedAlumniMentor && (
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
              className="bg-white border border-[#E7DED1] rounded-2xl p-6 max-w-md w-full shadow-lg space-y-4"
            >
              <div className="flex items-center justify-between border-b border-[#E7DED1] pb-3">
                <h3 className="font-display font-bold text-lg text-[#2B2B2B]">Request Mentorship with {selectedAlumniMentor.fullName}</h3>
                <button onClick={() => setIsMentorModalOpen(false)} className="p-1 text-[#666666] hover:text-black cursor-pointer">✕</button>
              </div>

              <form onSubmit={handleApplyMentorship} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-[#2B2B2B]">Mentorship Focus Area</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Traditional Begena 10-string tuning & St. Yared hymns"
                    value={mentorshipFocus}
                    onChange={(e) => setMentorshipFocus(e.target.value)}
                    className="w-full px-3 py-2 border border-[#E7DED1] rounded-lg focus:outline-none focus:border-[#E89B52]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#6F4E37] text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-2xs hover:bg-[#5a3f2c] cursor-pointer"
                >
                  Send Official Mentorship Invitation
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* GUEST PASS QR MODAL */}
      <AnimatePresence>
        {isGuestQrModalOpen && (
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
              className="bg-white border border-[#E7DED1] rounded-2xl p-6 max-w-md w-full shadow-lg space-y-4"
            >
              <div className="flex items-center justify-between border-b border-[#E7DED1] pb-3">
                <h3 className="font-display font-bold text-lg text-[#2B2B2B]">Graduation Guest QR Invitation</h3>
                <button onClick={() => { setIsGuestQrModalOpen(false); setGeneratedGuestPass(null); }} className="p-1 text-[#666666] hover:text-black cursor-pointer">✕</button>
              </div>

              {generatedGuestPass ? (
                <div className="space-y-4 text-center">
                  <p className="font-bold text-sm text-[#2B2B2B]">Official Invitation Issued for {guestName}</p>
                  <div className="p-4 border-2 border-dashed border-[#E89B52] rounded-xl bg-[#FAF6EF]/50 space-y-2">
                    <p className="font-mono text-xs font-bold text-[#E89B52]">{generatedGuestPass}</p>
                    <div className="w-28 h-28 bg-white border border-[#E7DED1] rounded-lg mx-auto flex items-center justify-center">
                      <QrCode size={80} className="text-[#2B2B2B]" />
                    </div>
                  </div>
                  <button onClick={() => { setIsGuestQrModalOpen(false); setGeneratedGuestPass(null); }} className="w-full py-2 bg-[#E89B52] text-white text-xs font-bold rounded-lg cursor-pointer">Close</button>
                </div>
              ) : (
                <form onSubmit={handleGenerateGuestPass} className="space-y-4 text-xs">
                  <div className="space-y-1">
                    <label className="font-bold text-[#2B2B2B]">Guest Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Woizero Aster Gebremedhin"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      className="w-full px-3 py-2 border border-[#E7DED1] rounded-lg focus:outline-none focus:border-[#E89B52]"
                    />
                  </div>
                  <button type="submit" className="w-full py-2.5 bg-[#E89B52] text-white font-bold text-xs uppercase tracking-wider rounded-lg cursor-pointer">Generate Official Pass</button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

