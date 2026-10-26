import React, { useState } from 'react';
import {
  Trophy,
  Award,
  Video,
  CheckCircle2,
  AlertCircle,
  Plus,
  Star,
  Users,
  ShieldCheck,
  Calendar,
  Sparkles,
  Search,
  ExternalLink,
  ChevronRight,
  BarChart3,
  Check,
  UserCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CompetitionItem,
  CompetitionSubmission,
  CompetitionJudge,
  Language,
  PageId
} from '../../types';
import {
  SAMPLE_COMPETITIONS,
  SAMPLE_COMPETITION_SUBMISSIONS
} from './EventsData';
import { useAuth } from '../../context/AuthContext';

interface CompetitionsCenterProps {
  lang: Language;
  onNavigate: (page: PageId, params?: any) => void;
}

export function CompetitionsCenter({ lang, onNavigate }: CompetitionsCenterProps) {
  const { currentUser } = useAuth();

  const [competitions, setCompetitions] = useState<CompetitionItem[]>(SAMPLE_COMPETITIONS);
  const [submissions, setSubmissions] = useState<CompetitionSubmission[]>(SAMPLE_COMPETITION_SUBMISSIONS);

  const [selectedComp, setSelectedComp] = useState<CompetitionItem | null>(competitions[0] || null);
  const [activeTab, setActiveTab] = useState<'overview' | 'submissions' | 'judging' | 'leaderboard'>('overview');

  // Student Registration/Submission Modal State
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [subTitle, setSubTitle] = useState('');
  const [subVideoUrl, setSubVideoUrl] = useState('');
  const [subDesc, setSubDesc] = useState('');
  const [subInstrument, setSubInstrument] = useState('Begena');

  // Judge Scoring Modal State
  const [selectedSubForScoring, setSelectedSubForScoring] = useState<CompetitionSubmission | null>(null);
  const [judgeScoresInput, setJudgeScoresInput] = useState<Record<string, number>>({});
  const [judgeComment, setJudgeComment] = useState('');

  const compSubmissions = submissions.filter(s => s.competitionId === selectedComp?.id);

  const handleStudentSubmitEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComp || !subTitle) return;

    const newSub: CompetitionSubmission = {
      id: `sub-${Date.now()}`,
      competitionId: selectedComp.id,
      studentId: currentUser?.id || 'STU-NEW',
      studentName: currentUser?.fullName || 'Student Participant',
      branchName: 'Piazza Headquarters',
      instrument: subInstrument,
      level: 'Intermediate',
      teacherName: 'Faculty Mentor',
      performanceTitle: subTitle,
      videoUrl: subVideoUrl || 'https://youtube.com/sample',
      description: subDesc,
      submittedAt: new Date().toISOString().split('T')[0],
      status: 'Submitted'
    };

    setSubmissions([newSub, ...submissions]);
    setIsSubmitModalOpen(false);
    setSubTitle('');
    setSubVideoUrl('');
    setSubDesc('');
  };

  const handleSaveJudgeScore = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubForScoring || !selectedComp) return;

    const totalCalculated = Object.values(judgeScoresInput).reduce((a: number, b: number) => a + Number(b), 0);

    const newScoreObj = {
      judgeId: currentUser?.id || 'jdg-staff',
      judgeName: currentUser?.fullName || 'Judge Member',
      scoresByCriterion: judgeScoresInput,
      totalScore: totalCalculated,
      comments: judgeComment
    };

    const updatedScores = [...(selectedSubForScoring.scores || []), newScoreObj];
    const avgFinal = Math.round(updatedScores.reduce((acc, s) => acc + s.totalScore, 0) / updatedScores.length);

    const updatedSub: CompetitionSubmission = {
      ...selectedSubForScoring,
      status: 'Scored',
      scores: updatedScores,
      finalScore: avgFinal,
      rankPosition: avgFinal >= 95 ? 1 : avgFinal >= 90 ? 2 : 3,
      awardCategory: avgFinal >= 95 ? 'Winner' : avgFinal >= 90 ? '1st Place' : 'Participant'
    };

    setSubmissions(submissions.map(s => s.id === updatedSub.id ? updatedSub : s));
    setSelectedSubForScoring(null);
  };

  return (
    <div className="space-y-8 pb-16 text-left">
      {/* HEADER SECTION */}
      <div className="bg-gradient-to-r from-[#FFFDF8] via-[#FAF6EF] to-white border border-[#E7DED1] rounded-2xl p-6 sm:p-8 shadow-2xs relative overflow-hidden">
        <div className="max-w-4xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E7DED1] text-xs font-bold text-[#E89B52] shadow-3xs">
            <Trophy size={14} className="text-[#C79A2B]" />
            <span>Official Liora Begena Youth Music Competitions</span>
          </div>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-[#2B2B2B] tracking-tight">
            National Begena, Krar & Sacred Harp Championships
          </h1>
          <p className="text-sm text-[#666666] leading-relaxed max-w-2xl">
            Register performance entries, submit unedited recital recordings, receive structured judge feedback across 4 criteria, and compete for scholarships and handcrafted instrument trophies.
          </p>
        </div>
      </div>

      {/* COMPETITION SELECTOR & TABS BAR */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white border border-[#E7DED1] p-3 rounded-xl shadow-3xs">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#2B2B2B]">Active Championship:</span>
          <select
            value={selectedComp?.id}
            onChange={(e) => setSelectedComp(competitions.find(c => c.id === e.target.value) || competitions[0])}
            className="bg-[#FAF6EF] border border-[#E7DED1] px-3 py-1.5 rounded-lg text-xs font-bold text-[#2B2B2B] focus:outline-none focus:border-[#E89B52]"
          >
            {competitions.map((c) => (
              <option key={c.id} value={c.id}>{c.title}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${activeTab === 'overview' ? 'bg-[#E89B52] text-white shadow-2xs' : 'text-[#666666] hover:bg-[#FAF6EF]'}`}
          >
            Rules & Criteria
          </button>
          <button
            onClick={() => setActiveTab('submissions')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${activeTab === 'submissions' ? 'bg-[#E89B52] text-white shadow-2xs' : 'text-[#666666] hover:bg-[#FAF6EF]'}`}
          >
            Entries ({compSubmissions.length})
          </button>
          <button
            onClick={() => setActiveTab('judging')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${activeTab === 'judging' ? 'bg-[#6F4E37] text-white shadow-2xs' : 'text-[#6F4E37] hover:bg-[#FAF6EF] bg-[#FAF6EF]/60'}`}
          >
            Judge Portal
          </button>
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${activeTab === 'leaderboard' ? 'bg-[#E89B52] text-white shadow-2xs' : 'text-[#666666] hover:bg-[#FAF6EF]'}`}
          >
            <Trophy size={13} />
            <span>Leaderboard</span>
          </button>
        </div>
      </div>

      {/* OVERVIEW TAB */}
      {selectedComp && activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white border border-[#E7DED1] p-6 rounded-2xl space-y-4 shadow-xs">
              <div className="flex items-center justify-between border-b border-[#E7DED1] pb-3">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#E89B52] text-white">
                    {selectedComp.instrumentCategory} • {selectedComp.levelCategory}
                  </span>
                  <h2 className="font-display font-bold text-2xl text-[#2B2B2B] mt-1">
                    {selectedComp.title}
                  </h2>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#10B981]/10 text-[#10B981]">
                  {selectedComp.status}
                </span>
              </div>

              <p className="text-sm text-[#666666] leading-relaxed">
                {selectedComp.description}
              </p>

              {/* Competition Rules */}
              <div className="space-y-2 pt-2">
                <h3 className="font-display font-bold text-sm text-[#2B2B2B] uppercase tracking-wider">
                  Competition Rules & Performance Guidelines
                </h3>
                <ul className="space-y-1.5 text-xs text-[#666666] list-disc pl-5">
                  {selectedComp.rules.map((rule, idx) => (
                    <li key={idx}>{rule}</li>
                  ))}
                </ul>
              </div>

              {/* Judging Criteria Matrix */}
              <div className="space-y-3 pt-4 border-t border-[#E7DED1]">
                <h3 className="font-display font-bold text-sm text-[#2B2B2B] uppercase tracking-wider">
                  Official Evaluation Criteria Breakdown (100 Points Total)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedComp.criteria.map((cr) => (
                    <div key={cr.id} className="p-3 border border-[#E7DED1] rounded-xl bg-[#FAF6EF]/30 space-y-1">
                      <div className="flex justify-between items-center text-xs font-bold text-[#2B2B2B]">
                        <span>{cr.name}</span>
                        <span className="text-[#E89B52] font-mono">{cr.maxScore} pts</span>
                      </div>
                      <p className="text-[11px] text-[#666666]">{cr.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Action & Prizes Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white border-2 border-[#E89B52] p-6 rounded-2xl shadow-xs space-y-4">
              <h3 className="font-display font-bold text-lg text-[#2B2B2B] flex items-center gap-2">
                <Award size={20} className="text-[#C79A2B]" />
                <span>Championship Awards</span>
              </h3>
              <ul className="space-y-2 text-xs text-[#2B2B2B]">
                {selectedComp.prizes.map((p, idx) => (
                  <li key={idx} className="p-2.5 bg-[#FAF6EF] border border-[#E7DED1] rounded-lg font-semibold flex items-center gap-2">
                    <Trophy size={14} className="text-[#C79A2B] shrink-0" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => setIsSubmitModalOpen(true)}
                className="w-full py-3 bg-[#E89B52] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-2xs hover:bg-[#d68a41] transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <Plus size={16} />
                <span>Submit Student Entry</span>
              </button>
            </div>

            {/* Judges Panel */}
            <div className="bg-white border border-[#E7DED1] p-5 rounded-2xl space-y-3">
              <h4 className="font-display font-bold text-xs uppercase tracking-wider text-[#2B2B2B]">Distinguished Judges Panel</h4>
              <div className="space-y-2.5">
                {selectedComp.judges.map((j) => (
                  <div key={j.id} className="flex items-center gap-3 p-2 border border-[#E7DED1] rounded-lg bg-[#FAF6EF]/20">
                    <img src={j.avatar} alt={j.name} className="w-9 h-9 rounded-full object-cover" referrerPolicy="no-referrer" />
                    <div>
                      <p className="text-xs font-bold text-[#2B2B2B]">{j.name}</p>
                      <p className="text-[10px] text-[#E89B52]">{j.titleOrRole}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBMISSIONS LIST TAB */}
      {activeTab === 'submissions' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="font-display font-bold text-xl text-[#2B2B2B]">Competition Recital Submissions</h2>
            <button
              onClick={() => setIsSubmitModalOpen(true)}
              className="px-3 py-1.5 bg-[#E89B52] text-white text-xs font-bold rounded-lg hover:bg-[#d68a41] cursor-pointer flex items-center gap-1"
            >
              <Plus size={14} />
              <span>Submit Entry</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {compSubmissions.map((sub) => (
              <div key={sub.id} className="bg-white border border-[#E7DED1] rounded-2xl p-5 shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-[#E7DED1] pb-3">
                  <div className="flex items-center gap-2.5">
                    <img src={sub.studentAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'} alt={sub.studentName} className="w-8 h-8 rounded-full object-cover" referrerPolicy="no-referrer" />
                    <div>
                      <p className="text-xs font-bold text-[#2B2B2B]">{sub.studentName}</p>
                      <p className="text-[10px] text-[#666666]">{sub.branchName} • {sub.instrument}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${sub.status === 'Scored' ? 'bg-[#10B981]/10 text-[#10B981]' : 'bg-[#E89B52]/10 text-[#E89B52]'}`}>
                    {sub.status}
                  </span>
                </div>

                <div className="space-y-1">
                  <p className="font-display font-bold text-base text-[#2B2B2B]">“{sub.performanceTitle}”</p>
                  <p className="text-xs text-[#666666]">{sub.description}</p>
                </div>

                {sub.finalScore !== undefined && (
                  <div className="p-3 bg-[#FAF6EF] border border-[#E7DED1] rounded-xl flex items-center justify-between text-xs">
                    <span className="font-bold text-[#2B2B2B]">Judge Weighted Score:</span>
                    <span className="font-mono font-black text-base text-[#E89B52]">{sub.finalScore} / 100 Pts</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-xs pt-2">
                  <a
                    href={sub.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#E89B52] font-semibold flex items-center gap-1 hover:underline"
                  >
                    <Video size={14} />
                    <span>Watch Performance Video</span>
                  </a>
                  <span className="text-[10px] text-[#9E9E9E]">{sub.submittedAt}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* JUDGE PORTAL TAB */}
      {activeTab === 'judging' && (
        <div className="space-y-6">
          <div className="bg-[#FAF6EF] border border-[#E7DED1] p-4 rounded-xl space-y-1">
            <h3 className="font-display font-bold text-sm text-[#2B2B2B] flex items-center gap-1.5">
              <ShieldCheck size={16} className="text-[#6F4E37]" />
              <span>Confidential Judge Scoring System</span>
            </h3>
            <p className="text-xs text-[#666666]">
              Evaluate individual performance entries across the 4 standard criteria. Individual judge feedback remains confidential and is aggregated for the public leaderboard.
            </p>
          </div>

          <div className="border border-[#E7DED1] rounded-2xl overflow-x-auto bg-white text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FAF6EF] border-b border-[#E7DED1] text-[10px] font-bold text-[#2B2B2B] uppercase">
                  <th className="p-3">Participant</th>
                  <th className="p-3">Performance Title</th>
                  <th className="p-3">Instrument</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Score</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7DED1] text-[#666666]">
                {compSubmissions.map((sub) => (
                  <tr key={sub.id}>
                    <td className="p-3 font-bold text-[#2B2B2B]">{sub.studentName}</td>
                    <td className="p-3 font-semibold text-[#6F4E37]">“{sub.performanceTitle}”</td>
                    <td className="p-3 font-mono">{sub.instrument}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${sub.status === 'Scored' ? 'bg-[#10B981]/10 text-[#10B981]' : 'bg-[#E89B52]/10 text-[#E89B52]'}`}>
                        {sub.status}
                      </span>
                    </td>
                    <td className="p-3 font-mono font-bold text-[#2B2B2B]">{sub.finalScore ? `${sub.finalScore} pts` : '—'}</td>
                    <td className="p-3">
                      <button
                        onClick={() => {
                          setSelectedSubForScoring(sub);
                          setJudgeScoresInput({ 'cr-1': 23, 'cr-2': 23, 'cr-3': 23, 'cr-4': 23 });
                        }}
                        className="px-3 py-1 bg-[#6F4E37] text-white font-bold rounded text-[11px] hover:bg-[#5a3f2c] cursor-pointer"
                      >
                        {sub.status === 'Scored' ? 'Edit Score' : 'Score Entry'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* PUBLIC LEADERBOARD TAB */}
      {activeTab === 'leaderboard' && (
        <div className="space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <Trophy size={36} className="text-[#C79A2B] mx-auto" />
            <h2 className="font-display font-bold text-2xl text-[#2B2B2B]">Official Championship Leaderboard</h2>
            <p className="text-xs text-[#666666]">
              Final verified results approved by Master Liora Begena and the Competition Board.
            </p>
          </div>

          <div className="max-w-2xl mx-auto space-y-4">
            {compSubmissions
              .filter(s => s.finalScore !== undefined)
              .sort((a, b) => (b.finalScore || 0) - (a.finalScore || 0))
              .map((sub, idx) => (
                <div
                  key={sub.id}
                  className={`p-5 rounded-2xl border flex items-center justify-between gap-4 transition-all ${
                    idx === 0
                      ? 'bg-gradient-to-r from-[#FFFDF8] to-[#FAF6EF] border-[#C79A2B] shadow-md'
                      : 'bg-white border-[#E7DED1] shadow-2xs'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-full font-display font-black flex items-center justify-center text-sm ${
                        idx === 0 ? 'bg-[#C79A2B] text-white shadow-3xs' : idx === 1 ? 'bg-[#9E9E9E] text-white' : 'bg-[#CD7F32] text-white'
                      }`}
                    >
                      #{idx + 1}
                    </div>

                    <div>
                      <h3 className="font-display font-bold text-base text-[#2B2B2B]">{sub.studentName}</h3>
                      <p className="text-xs text-[#666666]">“{sub.performanceTitle}” • {sub.instrument}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 bg-[#E89B52]/10 text-[#E89B52] rounded text-[10px] font-bold">
                        {sub.awardCategory}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-mono font-black text-xl text-[#2B2B2B]">{sub.finalScore} <span className="text-xs font-normal text-[#666666]">/ 100</span></p>
                    <p className="text-[10px] text-[#10B981] font-semibold">Verified Official</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* STUDENT SUBMISSION MODAL */}
      <AnimatePresence>
        {isSubmitModalOpen && selectedComp && (
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
                <h3 className="font-display font-bold text-lg text-[#2B2B2B]">
                  Submit Competition Entry
                </h3>
                <button onClick={() => setIsSubmitModalOpen(false)} className="p-1 text-[#666666] hover:text-black cursor-pointer">✕</button>
              </div>

              <form onSubmit={handleStudentSubmitEntry} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-[#2B2B2B]">Performance / Hymn Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Semayat Yenegrun Variations"
                    value={subTitle}
                    onChange={(e) => setSubTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-[#E7DED1] rounded-lg focus:outline-none focus:border-[#E89B52]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#2B2B2B]">Instrument</label>
                  <select
                    value={subInstrument}
                    onChange={(e) => setSubInstrument(e.target.value)}
                    className="w-full px-3 py-2 border border-[#E7DED1] rounded-lg focus:outline-none focus:border-[#E89B52]"
                  >
                    <option value="Begena">Begena</option>
                    <option value="Krar">Krar</option>
                    <option value="Masenqo">Masenqo</option>
                    <option value="Washint">Washint</option>
                    <option value="Vocal">Vocal</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#2B2B2B]">Video Performance URL (YouTube/Telegram/Google Drive)</label>
                  <input
                    type="url"
                    required
                    placeholder="https://..."
                    value={subVideoUrl}
                    onChange={(e) => setSubVideoUrl(e.target.value)}
                    className="w-full px-3 py-2 border border-[#E7DED1] rounded-lg focus:outline-none focus:border-[#E89B52]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#2B2B2B]">Performance Description & Tuning Notes</label>
                  <textarea
                    rows={2}
                    placeholder="Instrument details, scale tuning used..."
                    value={subDesc}
                    onChange={(e) => setSubDesc(e.target.value)}
                    className="w-full px-3 py-2 border border-[#E7DED1] rounded-lg focus:outline-none focus:border-[#E89B52]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#E89B52] text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-2xs hover:bg-[#d68a41] transition-colors cursor-pointer"
                >
                  Submit Official Entry
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* JUDGE SCORING MODAL */}
      <AnimatePresence>
        {selectedSubForScoring && selectedComp && (
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
              className="bg-white border border-[#E7DED1] rounded-2xl p-6 max-w-lg w-full shadow-lg space-y-4"
            >
              <div className="flex items-center justify-between border-b border-[#E7DED1] pb-3">
                <h3 className="font-display font-bold text-lg text-[#2B2B2B]">
                  Judge Entry: {selectedSubForScoring.studentName}
                </h3>
                <button onClick={() => setSelectedSubForScoring(null)} className="p-1 text-[#666666] hover:text-black cursor-pointer">✕</button>
              </div>

              <form onSubmit={handleSaveJudgeScore} className="space-y-4 text-xs">
                <div className="space-y-3">
                  {selectedComp.criteria.map((cr) => (
                    <div key={cr.id} className="flex items-center justify-between gap-4 p-2.5 bg-[#FAF6EF] border border-[#E7DED1] rounded-lg">
                      <div>
                        <p className="font-bold text-[#2B2B2B]">{cr.name}</p>
                        <p className="text-[10px] text-[#666666]">{cr.description}</p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <input
                          type="number"
                          min={0}
                          max={cr.maxScore}
                          required
                          value={judgeScoresInput[cr.id] || 0}
                          onChange={(e) => setJudgeScoresInput({ ...judgeScoresInput, [cr.id]: Number(e.target.value) })}
                          className="w-16 px-2 py-1 text-center font-mono font-bold border border-[#E7DED1] rounded bg-white text-xs"
                        />
                        <span className="text-[10px] text-[#9E9E9E]">/ {cr.maxScore}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#2B2B2B]">Confidential Judge Notes & Suggestions</label>
                  <textarea
                    rows={2}
                    value={judgeComment}
                    onChange={(e) => setJudgeComment(e.target.value)}
                    placeholder="Specific remarks regarding finger pluck, tuning..."
                    className="w-full px-3 py-2 border border-[#E7DED1] rounded-lg focus:outline-none focus:border-[#E89B52]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#6F4E37] text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-2xs hover:bg-[#5a3f2c] transition-colors cursor-pointer"
                >
                  Save & Submit Official Judge Scores
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

