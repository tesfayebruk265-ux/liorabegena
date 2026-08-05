import React, { useState, useEffect } from 'react';
import {
  Music,
  Search,
  Filter,
  Play,
  Pause,
  Repeat,
  BookOpen,
  CheckCircle2,
  Check,
  Clock,
  ChevronRight,
  Sparkles,
  FileText,
  Volume2,
  Star,
  Download,
  Share2,
  Copy,
  Info,
  Sliders
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Language } from '../types';
import { useAuth, isStudentAccessGranted } from '../context/AuthContext';
import { TiletPattern } from './TiletPattern';
import { Button, Input } from './InteractiveComponents';
import { RegistrationAndPaymentGate } from './RegistrationAndPaymentGate';
import { MASTER_MEZMURS_LIBRARY, BegenaMezmur } from './BegenaLearningModule';
import { MezmurNotationPlayer } from './KrarLearningPortal';

interface MezmurLibraryCenterProps {
  lang: Language;
  onNavigate: (page: string, params?: any) => void;
}

export function MezmurLibraryCenter({ lang, onNavigate }: MezmurLibraryCenterProps) {
  const { currentUser } = useAuth();

  // Load all class mezmurs from MASTER_MEZMURS_LIBRARY + localStorage persistence
  const [mezmurs, setMezmurs] = useState<BegenaMezmur[]>(() => {
    const saved = localStorage.getItem('begena_mezmurs_v10');
    if (saved) {
      try {
        const parsed: BegenaMezmur[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {
        console.error('Error loading mezmurs from localStorage', e);
      }
    }
    return MASTER_MEZMURS_LIBRARY;
  });

  // Save changes to localStorage so status persists across session & chapters
  useEffect(() => {
    localStorage.setItem('begena_mezmurs_v10', JSON.stringify(mezmurs));
  }, [mezmurs]);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedScaleFilter, setSelectedScaleFilter] = useState<'all' | 'tizita' | 'cherenet' | 'selamta'>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [selectedMezmurId, setSelectedMezmurId] = useState<string>(mezmurs[0]?.id || 'mez_1');
  const [copiedNotation, setCopiedNotation] = useState(false);

  if (!isStudentAccessGranted(currentUser)) {
    return <RegistrationAndPaymentGate lang={lang} onNavigate={onNavigate} title="MEZMUR LIBRARY LOCKED" />;
  }

  // Audio Playback State
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [isLooping, setIsLooping] = useState<boolean>(false);

  // Helper to determine Scale/Qignet from category or ID
  const getScaleType = (m: BegenaMezmur): 'tizita' | 'cherenet' | 'selamta' => {
    if (m.category.includes('ቸርነት') || m.category.includes('አንቺ') || m.id.startsWith('cherenet')) {
      return 'cherenet';
    }
    if (m.category.includes('ሰላምታ') || m.id.startsWith('selamta')) {
      return 'selamta';
    }
    return 'tizita';
  };

  const getScaleBadgeInfo = (scaleType: 'tizita' | 'cherenet' | 'selamta') => {
    switch (scaleType) {
      case 'cherenet':
        return {
          label: 'ቸርነት / አንቺ ሆዬ ቅኝት',
          shortLabel: 'ቸርነት ቅኝት',
          bgColor: 'bg-purple-100 text-purple-900 border-purple-200',
          badgeBg: 'bg-purple-700 text-white',
          accentColor: 'text-purple-700'
        };
      case 'selamta':
        return {
          label: 'ሰላምታ ቅኝት',
          shortLabel: 'ሰላምታ ቅኝት',
          bgColor: 'bg-emerald-100 text-emerald-900 border-emerald-200',
          badgeBg: 'bg-emerald-700 text-white',
          accentColor: 'text-emerald-700'
        };
      case 'tizita':
      default:
        return {
          label: 'ትዝታ ቅኝት',
          shortLabel: 'ትዝታ ቅኝት',
          bgColor: 'bg-amber-100 text-amber-900 border-amber-200',
          badgeBg: 'bg-amber-700 text-white',
          accentColor: 'text-amber-700'
        };
    }
  };

  // Counts for each Qignet
  const countTizita = mezmurs.filter((m) => getScaleType(m) === 'tizita').length;
  const countCherenet = mezmurs.filter((m) => getScaleType(m) === 'cherenet').length;
  const countSelamta = mezmurs.filter((m) => getScaleType(m) === 'selamta').length;

  // Filtered Mezmurs
  const filteredMezmurs = mezmurs.filter((item) => {
    const scale = getScaleType(item);
    const matchesScale =
      selectedScaleFilter === 'all' ||
      (selectedScaleFilter === 'tizita' && scale === 'tizita') ||
      (selectedScaleFilter === 'cherenet' && scale === 'cherenet') ||
      (selectedScaleFilter === 'selamta' && scale === 'selamta');

    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      q === '' ||
      item.title.toLowerCase().includes(q) ||
      item.amharicTitle.includes(q) ||
      (item.englishTitle && item.englishTitle.toLowerCase().includes(q)) ||
      item.lyrics.toLowerCase().includes(q) ||
      item.teacher.toLowerCase().includes(q) ||
      item.notation.includes(q);

    const matchesDiff = selectedDifficulty === 'All' || item.difficulty === selectedDifficulty;

    return matchesScale && matchesSearch && matchesDiff;
  });

  const selectedMezmur = mezmurs.find((m) => m.id === selectedMezmurId) || filteredMezmurs[0] || mezmurs[0];
  const selectedScaleType = selectedMezmur ? getScaleType(selectedMezmur) : 'tizita';
  const selectedBadgeInfo = getScaleBadgeInfo(selectedScaleType);

  const handleUpdateStatus = (id: string, newStatus: BegenaMezmur['status']) => {
    setMezmurs((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: newStatus } : m))
    );
  };

  const handleCopyNotation = (notationText: string) => {
    navigator.clipboard.writeText(notationText);
    setCopiedNotation(true);
    setTimeout(() => setCopiedNotation(false), 2000);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* HEADER BANNER */}
      <div className="bg-[#2B2B2B] text-white p-6 sm:p-8 rounded-3xl relative overflow-hidden shadow-xl border border-amber-950/40">
        <TiletPattern className="opacity-15 text-[#E89B52] scale-125" />
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E89B52]/20 border border-[#E89B52]/40 text-[#E89B52] text-xs font-bold uppercase tracking-widest">
            <Music size={14} />
            <span>Digital Traditional Sacred Music Repository ({mezmurs.length} Class Mezmurs)</span>
          </div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-white tracking-wide">
            የበገና መዝሙራት ቤተ-መጽሐፍት (ALL CLASS MEZMURS)
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 max-w-3xl leading-relaxed">
            በትምህርቱ የተካተቱ የሦስቱም ቅኝቶች (ትዝታ፣ ቸርነት/አንቺ ሆዬ፣ እና ሰላምታ) የተቀደሱ የበገና መዝሙራት ስብስብ ከነ ድርደራ ቁጥራቸው፣ ዜማቸውና ግጥማቸው ጋር።
          </p>
        </div>
      </div>

      {/* SEARCH & QIGNET SCALE FILTER BAR */}
      <div className="bg-white border border-[#E7DED1] p-6 rounded-3xl space-y-4 shadow-xs">
        {/* QIGNET SCALE SELECTOR TABS */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block font-mono">
            የቅኝት መምረጫ (Select Begena Scale / Qignet):
          </label>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setSelectedScaleFilter('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedScaleFilter === 'all'
                  ? 'bg-[#6F4E37] text-white shadow-xs'
                  : 'bg-[#FAF6EF] text-gray-700 border border-[#E7DED1] hover:border-[#6F4E37]'
              }`}
            >
              <span>📜</span>
              <span>ሁሉንም ቅኝቶች ({mezmurs.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedScaleFilter('tizita')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedScaleFilter === 'tizita'
                  ? 'bg-amber-700 text-white shadow-xs'
                  : 'bg-amber-50 text-amber-900 border border-amber-200 hover:border-amber-500'
              }`}
            >
              <span>🎵</span>
              <span>ትዝታ ቅኝት ({countTizita})</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedScaleFilter('cherenet')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedScaleFilter === 'cherenet'
                  ? 'bg-purple-700 text-white shadow-xs'
                  : 'bg-purple-50 text-purple-900 border border-purple-200 hover:border-purple-500'
              }`}
            >
              <span>🎼</span>
              <span>ቸርነት / አንቺ ሆዬ ቅኝት ({countCherenet})</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedScaleFilter('selamta')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedScaleFilter === 'selamta'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-emerald-50 text-emerald-900 border border-emerald-200 hover:border-emerald-500'
              }`}
            >
              <span>🎶</span>
              <span>ሰላምታ ቅኝት ({countSelamta})</span>
            </button>
          </div>
        </div>

        {/* SEARCH & LEVEL DROPDOWN */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-gray-100">
          <div className="sm:col-span-2 space-y-1">
            <label className="text-[10px] font-bold text-gray-500 uppercase">መዝሙር መፈለጊያ (Search by Title, Lyrics, or Notation)</label>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
              <Input
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by Amharic title, English, teacher, or notation numbers..."
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-500 uppercase">የደረጃ አስቸጋሪነት (Level Difficulty)</label>
            <select
              className="w-full p-2.5 bg-[#FAF6EF] border border-[#E7DED1] rounded-xl text-xs font-bold text-gray-800"
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
            >
              <option value="All">ሁሉንም ደረጃዎች (All Levels)</option>
              <option value="Beginner">Beginner (መጀመሪያ)</option>
              <option value="Intermediate">Intermediate (መካከለኛ)</option>
              <option value="Advanced">Advanced (ከፍተኛ)</option>
            </select>
          </div>
        </div>
      </div>

      {/* MAIN TWO-COLUMN VIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LIST OF MEZMURS (LEFT RAIL) */}
        <div className="lg:col-span-1 space-y-3">
          <div className="flex justify-between items-center text-xs font-bold text-gray-600 px-1">
            <span className="uppercase tracking-wider">
              የተገኙ መዝሙሮች ({filteredMezmurs.length})
            </span>
            <span className="text-[10px] text-[#E89B52] font-mono">
              {selectedScaleFilter === 'all' ? 'ALL SCALES' : selectedScaleFilter.toUpperCase()}
            </span>
          </div>

          <div className="space-y-3 max-h-[700px] overflow-y-auto pr-1">
            {filteredMezmurs.length === 0 ? (
              <div className="p-8 bg-white border border-[#E7DED1] rounded-2xl text-center text-gray-500 space-y-2">
                <Info size={28} className="mx-auto text-amber-600" />
                <p className="text-xs font-bold">ምንም መዝሙር አልተገኘም።</p>
                <p className="text-[11px] text-gray-400">የፈለጉትን ቃል ወይም የቅኝት መምረጫውን ይቀይሩ።</p>
              </div>
            ) : (
              filteredMezmurs.map((item) => {
                const itemScale = getScaleType(item);
                const badge = getScaleBadgeInfo(itemScale);
                const isSelected = selectedMezmur?.id === item.id;

                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedMezmurId(item.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#FAF6EF] border-[#E89B52] shadow-sm ring-1 ring-[#E89B52]/30'
                        : 'bg-white border-[#E7DED1] hover:border-amber-300'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex justify-between items-start gap-2">
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border uppercase ${badge.bgColor}`}>
                          {badge.shortLabel}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                          item.status === 'Completed' || item.status === 'Approved'
                            ? 'bg-green-100 text-green-900'
                            : item.status === 'Practicing' || item.status === 'Learning'
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {item.status}
                        </span>
                      </div>

                      <div>
                        <h4 className="font-bold text-xs text-[#2B2B2B] leading-tight">{item.amharicTitle || item.title}</h4>
                        {item.englishTitle && (
                          <p className="text-[11px] text-gray-500 font-semibold">{item.englishTitle}</p>
                        )}
                      </div>

                      {item.notation && (
                        <div className="text-[10px] font-mono text-gray-500 bg-white/80 p-1.5 rounded border border-gray-100 truncate">
                          <span className="text-amber-800 font-bold">ድርደራ፡</span> {item.notation}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* SELECTED MEZMUR PLAYER & LYRICS PANEL (RIGHT SIDE) */}
        <div className="lg:col-span-2 space-y-6">
          {selectedMezmur ? (
            <div className="bg-white border border-[#E7DED1] p-6 sm:p-8 rounded-3xl space-y-6 shadow-xs">
              {/* MEZMUR HEADER & BADGES */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#E7DED1] pb-6">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`text-xs font-mono font-bold px-3 py-1 rounded-full border uppercase ${selectedBadgeInfo.bgColor}`}>
                      ● {selectedBadgeInfo.label}
                    </span>
                    <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                      {selectedMezmur.difficulty}
                    </span>
                    <span className="text-xs text-gray-500">
                      አስተማሪ፡ <strong className="text-gray-800">{selectedMezmur.teacher}</strong>
                    </span>
                  </div>
                  <h2 className="font-display font-black text-2xl text-[#2B2B2B] pt-1">
                    {selectedMezmur.amharicTitle || selectedMezmur.title}
                  </h2>
                  {selectedMezmur.englishTitle && (
                    <p className="text-xs text-gray-600 font-semibold">{selectedMezmur.englishTitle}</p>
                  )}
                </div>

                {/* PROGRESS STATUS UPDATER */}
                <div className="flex items-center gap-2 bg-[#FAF6EF] p-2 rounded-2xl border border-[#E7DED1]">
                  <span className="text-[10px] font-bold text-gray-600 uppercase font-mono pl-1">የልምምድ ደረጃ፡</span>
                  <select
                    className="p-1.5 bg-white border border-[#E7DED1] rounded-xl text-xs font-bold text-[#2B2B2B]"
                    value={selectedMezmur.status}
                    onChange={(e) => handleUpdateStatus(selectedMezmur.id, e.target.value as any)}
                  >
                    <option value="Not Started">Not Started (አልተጀመረም)</option>
                    <option value="Learning">Learning (እየተማርኩ ነው)</option>
                    <option value="Practicing">Practicing (እየተለማመድኩ ነው)</option>
                    <option value="Submitted for Review">Submitted for Review (ለአስተማሪ ተልኳል)</option>
                    <option value="Completed">Completed (ተጠናቋል)</option>
                  </select>
                </div>
              </div>

              {/* SPECIALIZED AUDIO PLAYER CONSOLE */}
              <div className="bg-[#2B2B2B] text-white p-6 rounded-2xl space-y-4 shadow-lg border border-amber-900/40 relative overflow-hidden">
                <TiletPattern className="opacity-10 text-amber-500 scale-150" />
                <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block">
                      Audio Reference & Practice Tracks
                    </span>
                    <span className="text-[10px] text-gray-400">የመዝሙር ማዳመጫና የዜማ ልምምድ ድምፅ</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setPlaybackSpeed(playbackSpeed === 1.0 ? 0.75 : 1.0)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        playbackSpeed !== 1.0 ? 'bg-[#E89B52] text-white border-[#E89B52]' : 'bg-white/10 text-gray-300 border-white/20 hover:bg-white/20'
                      }`}
                    >
                      {playbackSpeed === 1.0 ? 'Normal Speed' : '75% Slow Practice Speed'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsLooping(!isLooping)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        isLooping ? 'bg-[#E89B52] text-white border-[#E89B52]' : 'bg-white/10 text-gray-300 border-white/20 hover:bg-white/20'
                      }`}
                    >
                      <Repeat size={13} className="inline mr-1" />
                      Loop
                    </button>
                  </div>
                </div>

                {selectedMezmur.audioUrl ? (
                  <audio controls src={selectedMezmur.audioUrl} className="w-full relative z-10" />
                ) : null}
              </div>

              {/* BEGENA/KRAR NOTATION NUMBERS & INTERACTIVE VIRTUAL STRING SIMULATION */}
              {selectedMezmur.notation && (() => {
                const parsedSequence = selectedMezmur.notation
                  .split(/[\s,–-]+/)
                  .map((s) => parseInt(s.trim(), 10))
                  .filter((n) => !isNaN(n) && n >= 1 && n <= 6);

                const playKrarStringTone = (stringIdx: number) => {
                  try {
                    const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
                    if (!AudioCtxClass) return;
                    const audioCtx = new AudioCtxClass();
                    if (audioCtx.state === 'suspended') {
                      audioCtx.resume();
                    }
                    const FREQS = [293.66, 329.63, 392.00, 440.00, 261.63, 523.25];
                    const freq = FREQS[stringIdx] || 261.63;
                    const now = audioCtx.currentTime;

                    const osc = audioCtx.createOscillator();
                    const gain = audioCtx.createGain();
                    osc.type = 'sawtooth';
                    osc.frequency.setValueAtTime(freq, now);

                    gain.gain.setValueAtTime(0.001, now);
                    gain.gain.linearRampToValueAtTime(0.45, now + 0.012);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.1);

                    osc.connect(gain);
                    gain.connect(audioCtx.destination);
                    osc.start(now);
                    osc.stop(now + 1.1);
                  } catch (e) {
                    console.error('Audio playback error', e);
                  }
                };

                return (
                  <div className="space-y-4">
                    <div className="bg-[#FAF6EF] p-5 rounded-2xl border border-[#E7DED1] space-y-2">
                      <div className="flex justify-between items-center">
                        <h3 className="font-display font-black text-xs uppercase text-[#6F4E37] tracking-wider flex items-center gap-2">
                          <Music size={16} className="text-[#E89B52]" />
                          <span>የመዝሙሩ ድርደራ ቁጥሮች (Notation Numbers)</span>
                        </h3>
                        <button
                          type="button"
                          onClick={() => handleCopyNotation(selectedMezmur.notation)}
                          className="text-xs text-amber-800 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <Copy size={12} />
                          <span>{copiedNotation ? 'Copied!' : 'Copy Numbers'}</span>
                        </button>
                      </div>
                      <div className="p-3 bg-white border border-[#E7DED1] rounded-xl font-mono text-sm sm:text-base font-bold text-gray-900 tracking-widest break-words">
                        {selectedMezmur.notation}
                      </div>
                      <p className="text-[11px] text-gray-500 italic">
                        * Tizita Scale Assignment: String 5: 1 (C) • String 1: 2 (D) • String 2: 3 (E) • String 3: 4 (G) • String 4: 5 (A) • String 6: 6 (C⁺)
                      </p>
                    </div>

                    {parsedSequence.length > 0 && (
                      <MezmurNotationPlayer
                        title={selectedMezmur.amharicTitle || selectedMezmur.title}
                        notationSequence={parsedSequence}
                        playKrarStringTone={playKrarStringTone}
                        hideInstrumentLabel
                      />
                    )}
                  </div>
                );
              })()}

              {/* LYRICS DISPLAY */}
              <div className="space-y-4">
                <h3 className="font-display font-black text-xs uppercase text-[#2B2B2B] tracking-wider flex items-center gap-2">
                  <FileText size={16} className="text-[#E89B52]" />
                  <span>የመዝሙሩ ግጥም (Traditional Amharic Lyrics)</span>
                </h3>

                <div className="p-6 bg-[#FAF6EF]/60 border border-[#E7DED1] rounded-2xl space-y-2">
                  <p className="text-sm text-[#2B2B2B] leading-relaxed font-semibold whitespace-pre-line font-serif">
                    {selectedMezmur.lyrics}
                  </p>
                </div>

                {selectedMezmur.learningInstructions && (
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl space-y-1">
                    <span className="text-[10px] font-bold text-amber-900 uppercase font-mono">መመሪያና ማብራሪያ (Learning Instructions):</span>
                    <p className="text-xs text-amber-900 leading-relaxed">
                      {selectedMezmur.learningInstructions}
                    </p>
                  </div>
                )}
              </div>

              {/* PRACTICE & NAVIGATION ACTION BUTTONS */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => onNavigate('practice', { mezmurId: selectedMezmur.id })}
                  className="px-5 py-2.5 bg-[#6F4E37] hover:bg-[#5a3f2c] text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-xs cursor-pointer"
                >
                  <Music size={14} />
                  <span>በልምምድ ስቱዲዮ ውስጥ ደርድሩ (Practice in Practice Studio)</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(selectedMezmur.id, 'Completed')}
                    className="px-4 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-300 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle2 size={14} className="text-emerald-700" />
                    <span>እንደተጠናቀቀ መዝግብ (Mark Completed)</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 bg-white border border-[#E7DED1] rounded-3xl text-center text-gray-400">
              <Music size={36} className="mx-auto text-amber-600 mb-2" />
              <p className="text-xs font-bold">Select a Mezmur from the repository list to begin practice.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


