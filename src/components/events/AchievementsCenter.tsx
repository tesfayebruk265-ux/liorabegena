import React, { useState } from 'react';
import {
  Award,
  Trophy,
  Sparkles,
  CheckCircle2,
  Lock,
  Plus,
  Star,
  Music,
  Users,
  Search,
  ChevronRight,
  ShieldAlert,
  Flame,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  AchievementBadge,
  EarnedStudentBadge,
  StudentRankProfile,
  Language,
  PageId
} from '../../types';
import {
  SAMPLE_ACHIEVEMENT_BADGES,
  SAMPLE_EARNED_BADGES,
  SAMPLE_STUDENT_RANKS
} from './EventsData';
import { useAuth } from '../../context/AuthContext';

interface AchievementsCenterProps {
  lang: Language;
  onNavigate: (page: PageId, params?: any) => void;
}

export function AchievementsCenter({ lang, onNavigate }: AchievementsCenterProps) {
  const { currentUser, hasPermission } = useAuth();

  const [badgesCatalog, setBadgesCatalog] = useState<AchievementBadge[]>(SAMPLE_ACHIEVEMENT_BADGES);
  const [earnedBadges, setEarnedBadges] = useState<EarnedStudentBadge[]>(SAMPLE_EARNED_BADGES);
  const [studentRanks, setStudentRanks] = useState<StudentRankProfile[]>(SAMPLE_STUDENT_RANKS);

  const [activeTab, setActiveTab] = useState<'catalog' | 'my-achievements' | 'showcase' | 'award-badge'>('my-achievements');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Manual Award Modal State
  const [isAwardModalOpen, setIsAwardModalOpen] = useState(false);
  const [awardStudentName, setAwardStudentName] = useState('');
  const [awardBadgeId, setAwardBadgeId] = useState(badgesCatalog[0]?.id || '');
  const [awardReason, setAwardReason] = useState('');

  const currentStudentRank = studentRanks.find(r => r.studentId === (currentUser?.id || 'STU-2026-001')) || studentRanks[0];
  const myEarned = earnedBadges.filter(b => b.studentId === (currentUser?.id || 'STU-2026-001'));

  const handleAwardBadgeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const badge = badgesCatalog.find(b => b.id === awardBadgeId);
    if (!badge || !awardStudentName) return;

    const created: EarnedStudentBadge = {
      id: `eb-${Date.now()}`,
      studentId: 'STU-CUSTOM',
      studentName: awardStudentName,
      badgeId: badge.id,
      badgeName: badge.name,
      category: badge.category,
      rarity: badge.rarity,
      icon: badge.icon,
      earnedDate: new Date().toISOString().split('T')[0],
      awardedBy: 'Admin Manual Award',
      awardReason: awardReason
    };

    setEarnedBadges([created, ...earnedBadges]);
    setIsAwardModalOpen(false);
    alert(`Badge "${badge.name}" successfully awarded to ${awardStudentName}!`);
  };

  const getRarityBadgeStyle = (rarity: string) => {
    switch (rarity) {
      case 'Legendary': return 'bg-[#C79A2B] text-white border-[#C79A2B]';
      case 'Epic': return 'bg-[#8B5CF6] text-white border-[#8B5CF6]';
      case 'Rare': return 'bg-[#3B82F6] text-white border-[#3B82F6]';
      case 'Uncommon': return 'bg-[#10B981] text-white border-[#10B981]';
      default: return 'bg-[#9E9E9E] text-white border-[#9E9E9E]';
    }
  };

  return (
    <div className="space-y-8 pb-16 text-left">
      {/* HEADER SECTION */}
      <div className="bg-gradient-to-r from-[#FFFDF8] via-[#FAF6EF] to-white border border-[#E7DED1] rounded-2xl p-6 sm:p-8 shadow-2xs relative overflow-hidden">
        <div className="max-w-4xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E7DED1] text-xs font-bold text-[#E89B52] shadow-3xs">
            <Sparkles size={14} className="text-[#C79A2B]" />
            <span>Abel Begena Sacred Music Achievement Engine</span>
          </div>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-[#2B2B2B] tracking-tight">
            Student Ranks, Badges & Honor Roll Showcase
          </h1>
          <p className="text-sm text-[#666666] leading-relaxed max-w-2xl">
            Track student practice devotion, competition medals, and course milestones. Earn cultural rank points and unlock legendary Abel Begena achievement badges.
          </p>
        </div>
      </div>

      {/* NAVIGATION BAR */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-[#E7DED1] p-3 rounded-xl shadow-3xs">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('my-achievements')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${activeTab === 'my-achievements' ? 'bg-[#E89B52] text-white shadow-2xs' : 'text-[#666666] hover:bg-[#FAF6EF]'}`}
          >
            <Award size={14} />
            <span>My Rank & Earned Badges ({myEarned.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('catalog')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${activeTab === 'catalog' ? 'bg-[#E89B52] text-white shadow-2xs' : 'text-[#666666] hover:bg-[#FAF6EF]'}`}
          >
            <Sparkles size={14} />
            <span>Badge Catalog ({badgesCatalog.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('showcase')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${activeTab === 'showcase' ? 'bg-[#E89B52] text-white shadow-2xs' : 'text-[#666666] hover:bg-[#FAF6EF]'}`}
          >
            <Trophy size={14} />
            <span>Public Honor Roll</span>
          </button>
        </div>

        {(hasPermission('admin') || currentUser?.role === 'teacher') && (
          <button
            onClick={() => setIsAwardModalOpen(true)}
            className="px-3 py-1.5 bg-[#6F4E37] text-white text-xs font-bold rounded-lg hover:bg-[#5a3f2c] cursor-pointer flex items-center gap-1"
          >
            <Plus size={14} />
            <span>Award Student Badge</span>
          </button>
        )}
      </div>

      {/* MY RANK & BADGES TAB */}
      {activeTab === 'my-achievements' && currentStudentRank && (
        <div className="space-y-6">
          {/* Rank Summary Card */}
          <div className="bg-gradient-to-r from-[#FFFDF8] via-[#FAF6EF] to-white border-2 border-[#E89B52] p-6 rounded-2xl shadow-xs grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-8 flex items-center gap-4">
              <img
                src={currentStudentRank.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                alt={currentStudentRank.studentName}
                className="w-16 h-16 rounded-full object-cover border-2 border-[#E89B52]"
                referrerPolicy="no-referrer"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#C79A2B] text-white">
                    {currentStudentRank.currentRank} Rank
                  </span>
                  <span className="text-xs text-[#666666]">{currentStudentRank.branchName}</span>
                </div>
                <h2 className="font-display font-bold text-2xl text-[#2B2B2B]">
                  {currentStudentRank.studentName}
                </h2>
                <p className="text-xs text-[#666666]">
                  Logged {currentStudentRank.practiceHoursLogged} practice hours • {currentStudentRank.attendanceRatePercent}% attendance
                </p>
              </div>
            </div>

            <div className="md:col-span-4 bg-white p-4 rounded-xl border border-[#E7DED1] text-center space-y-1">
              <p className="text-[10px] font-bold text-[#666666] uppercase">Total Achievement Points</p>
              <p className="font-mono font-black text-3xl text-[#E89B52]">{currentStudentRank.totalPoints} PTS</p>
              <p className="text-[10px] text-[#10B981] font-semibold">Rank Advancement: 80% to Mastery Candidate</p>
            </div>
          </div>

          {/* Earned Badges Grid */}
          <div className="space-y-4">
            <h3 className="font-display font-bold text-lg text-[#2B2B2B]">Earned Achievement Badges</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {myEarned.map((eb) => (
                <div key={eb.id} className="bg-white border border-[#E7DED1] p-4 rounded-2xl shadow-2xs space-y-2 flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FAF6EF] border border-[#E7DED1] flex items-center justify-center text-[#E89B52] shrink-0">
                    <Award size={20} />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="font-display font-bold text-sm text-[#2B2B2B]">{eb.badgeName}</h4>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${getRarityBadgeStyle(eb.rarity)}`}>
                        {eb.rarity}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#666666]">{eb.category} Badge</p>
                    <p className="text-[10px] text-[#9E9E9E] font-mono">Earned on {eb.earnedDate}</p>
                    {eb.awardReason && (
                      <p className="text-[10px] text-[#6F4E37] italic font-semibold">“{eb.awardReason}”</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* BADGE CATALOG TAB */}
      {activeTab === 'catalog' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {badgesCatalog.map((badge) => (
              <div key={badge.id} className="bg-white border border-[#E7DED1] rounded-2xl p-5 shadow-2xs space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getRarityBadgeStyle(badge.rarity)}`}>
                      {badge.rarity}
                    </span>
                    <span className="font-mono text-xs font-bold text-[#E89B52]">{badge.points} PTS</span>
                  </div>

                  <h3 className="font-display font-bold text-base text-[#2B2B2B]">{badge.name}</h3>
                  <p className="text-xs text-[#666666] leading-relaxed">{badge.description}</p>
                </div>

                <div className="p-3 bg-[#FAF6EF] border border-[#E7DED1] rounded-xl text-[11px] text-[#2B2B2B] space-y-1">
                  <span className="font-bold uppercase text-[9px] text-[#666666]">Unlock Requirement:</span>
                  <p>{badge.requirement}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PUBLIC SHOWCASE HONOR ROLL TAB */}
      {activeTab === 'showcase' && (
        <div className="space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <Trophy size={36} className="text-[#C79A2B] mx-auto" />
            <h2 className="font-display font-bold text-2xl text-[#2B2B2B]">Abel Begena Top Performers Honor Roll</h2>
            <p className="text-xs text-[#666666]">
              Recognizing exemplary dedication, practice consistency, and musical mastery.
            </p>
          </div>

          <div className="max-w-2xl mx-auto space-y-4">
            {studentRanks.map((sr, idx) => (
              <div key={sr.studentId} className="bg-white border border-[#E7DED1] p-5 rounded-2xl shadow-2xs flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#E89B52] text-white font-mono font-bold flex items-center justify-center text-xs">
                    #{idx + 1}
                  </div>
                  <img src={sr.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'} alt={sr.studentName} className="w-12 h-12 rounded-full object-cover" referrerPolicy="no-referrer" />
                  <div>
                    <h3 className="font-display font-bold text-base text-[#2B2B2B]">{sr.studentName}</h3>
                    <p className="text-xs text-[#666666]">{sr.currentRank} • {sr.branchName}</p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-mono font-black text-xl text-[#E89B52]">{sr.totalPoints} PTS</p>
                  <p className="text-[10px] text-[#666666]">{sr.badgesEarnedCount} Badges Earned</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MANUAL AWARD MODAL */}
      <AnimatePresence>
        {isAwardModalOpen && (
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
                <h3 className="font-display font-bold text-lg text-[#2B2B2B]">Award Badge to Student</h3>
                <button onClick={() => setIsAwardModalOpen(false)} className="p-1 text-[#666666] hover:text-black cursor-pointer">✕</button>
              </div>

              <form onSubmit={handleAwardBadgeSubmit} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-[#2B2B2B]">Student Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Bereket Tadesse"
                    value={awardStudentName}
                    onChange={(e) => setAwardStudentName(e.target.value)}
                    className="w-full px-3 py-2 border border-[#E7DED1] rounded-lg focus:outline-none focus:border-[#E89B52]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#2B2B2B]">Select Badge</label>
                  <select
                    value={awardBadgeId}
                    onChange={(e) => setAwardBadgeId(e.target.value)}
                    className="w-full px-3 py-2 border border-[#E7DED1] rounded-lg focus:outline-none focus:border-[#E89B52]"
                  >
                    {badgesCatalog.map(b => (
                      <option key={b.id} value={b.id}>{b.name} ({b.rarity} - {b.points} pts)</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#2B2B2B]">Award Note / Reason</label>
                  <textarea
                    rows={2}
                    value={awardReason}
                    onChange={(e) => setAwardReason(e.target.value)}
                    placeholder="e.g. Winner of 2026 Begena Youth Championship"
                    className="w-full px-3 py-2 border border-[#E7DED1] rounded-lg focus:outline-none focus:border-[#E89B52]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#6F4E37] text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-2xs hover:bg-[#5a3f2c] cursor-pointer"
                >
                  Confer Achievement Badge
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

