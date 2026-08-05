import React, { useState, useRef, useEffect } from 'react';
import { Play, RotateCcw, Volume2, Sliders, Music, Sparkles, Mic } from 'lucide-react';
import { TiletPattern } from './TiletPattern';
import { InstrumentTuner } from './InstrumentTuner';

// Begena 10 Strings Tuning Frequencies (Hz) for each Ethiopian ቅኝት
// String 1 (#1) = Tone 1, String 4 (#2) = Tone 2, String 6 (#3) = Tone 3, String 8 (#4) = Tone 4, String 10 (#5) = Tone 5
export const BEGENA_SCALE_FREQUENCIES: Record<string, number[]> = {
  tizita:    [82.41, 0, 0, 65.41, 0, 73.42, 0, 110.00, 0, 98.00],   // 1->E, 2->C, 3->D, 4->A, 5->G
  cherenet:  [87.31, 0, 0, 65.41, 0, 69.30, 0, 110.00, 0, 92.50],   // 1->F, 2->C, 3->C#, 4->A, 5->F#
  anchihoye: [87.31, 0, 0, 65.41, 0, 69.30, 0, 110.00, 0, 92.50],   // Alias for ቸርነት
  selamta:   [87.31, 0, 0, 65.41, 0, 73.42, 0, 110.00, 0, 98.00],   // 1->F, 2->C, 3->D, 4->A, 5->G
  bati:      [87.31, 0, 0, 65.41, 0, 82.41, 0, 123.47, 0, 98.00],   // 1->F, 2->C, 3->E, 4->B, 5->G
  ambassel:  [87.31, 0, 0, 65.41, 0, 69.30, 0, 103.83, 0, 98.00]   // 1->F, 2->C, 3->C#, 4->G#, 5->G
};

export interface BegenaStringConfig {
  stringNo: number;       // 1 to 10
  assignedNum: number | null; // 1 to 5 for played strings, null for unplayed
  name: string;           // Amharic note name / role
  noteName: string;       // Scientific note name e.g. E2, C2, D2, A2, G2
  pitch: string;          // Hz display string
  idx: number;            // 0 to 9 index
  isPlayed: boolean;      // true for 1, 4, 6, 8, 10
}

export const getBegenaScaleStringsConfig = (scale: string): BegenaStringConfig[] => {
  const normKey = scale ? scale.toLowerCase() : 'tizita';

  let noteNames: string[];
  switch (normKey) {
    case 'cherenet':
    case 'anchihoye':
      // 2->C, 3->C#, 1->F, 5->F#, 4->A
      noteNames = ['F2', '—', '—', 'C2', '—', 'C♯2', '—', 'A2', '—', 'F♯2'];
      break;
    case 'selamta':
      // 2->C, 3->D, 1->F, 5->G, 4->A
      noteNames = ['F2', '—', '—', 'C2', '—', 'D2', '—', 'A2', '—', 'G2'];
      break;
    case 'bati':
      // 2->C, 3->E, 1->F, 5->G, 4->B
      noteNames = ['F2', '—', '—', 'C2', '—', 'E2', '—', 'B2', '—', 'G2'];
      break;
    case 'ambassel':
      // 2->C, 3->C#, 1->F, 5->G, 4->G#
      noteNames = ['F2', '—', '—', 'C2', '—', 'C♯2', '—', 'G♯2', '—', 'G2'];
      break;
    case 'tizita':
    default:
      // 2->C, 3->D, 1->E, 5->G, 4->A
      noteNames = ['E2', '—', '—', 'C2', '—', 'D2', '—', 'A2', '—', 'G2'];
      break;
  }

  const freqs = BEGENA_SCALE_FREQUENCIES[normKey] || BEGENA_SCALE_FREQUENCIES.tizita;

  const names = [
    '(1)',
    'ማረፊያ (Unplayed)',
    'ማረፊያ (Unplayed)',
    '(2)',
    'ማረፊያ(Unplayed)',
    '(3)',
    'ማረፊያ(Unplayed)',
    '(4)',
    'ማረፊያ(Unplayed)',
    '(5)'
  ];

  return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num, idx) => {
    const isPlayed = [1, 4, 6, 8, 10].includes(num);
    let assignedNum: number | null = null;
    if (num === 1) assignedNum = 1;
    if (num === 4) assignedNum = 2;
    if (num === 6) assignedNum = 3;
    if (num === 8) assignedNum = 4;
    if (num === 10) assignedNum = 5;

    return {
      stringNo: num,
      assignedNum,
      name: names[idx],
      noteName: noteNames[idx],
      pitch: isPlayed && freqs[idx] ? `${freqs[idx]} Hz` : 'Muted',
      idx,
      isPlayed
    };
  });
};

interface BegenaScaleSimulatorBoardProps {
  scaleKey?: 'tizita' | 'anchihoye' | 'bati' | 'ambassel' | 'cherenet' | 'selamta';
  title?: string;
  subtitle?: string;
  allowScaleChange?: boolean;
}

export const BegenaScaleSimulatorBoard: React.FC<BegenaScaleSimulatorBoardProps> = ({
  scaleKey: initialScaleKey = 'tizita',
  title = 'ቨርቹዋል የበገና አውታሮች ድርደራ (Virtual Begena 10-String Simulator)',
  subtitle = 'ለእያንዳንዱ ቅኝት ተዛማጅ የድምፅ እሴቶች እና የኃላ የድርደራ ስልት የተዘጋጀ',
  allowScaleChange = true
}) => {
  const [selectedScale, setSelectedScale] = useState<string>(initialScaleKey);
  const [activeViewMode, setActiveViewMode] = useState<'simulator' | 'tuner'>('simulator');
  const [pluckedStringIndex, setPluckedStringIndex] = useState<number | null>(null);
  const [isPlayingSequence, setIsPlayingSequence] = useState<boolean>(false);
  const [activePlayMode, setActivePlayMode] = useState<'forward_derdera' | 'reverse_derdera' | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    setSelectedScale(initialScaleKey);
  }, [initialScaleKey]);

  const stringsConfig = getBegenaScaleStringsConfig(selectedScale);

  const playBegenaStringTone = (stringIdx: number, overrideScale?: string) => {
    setPluckedStringIndex(stringIdx);
    setTimeout(() => setPluckedStringIndex(null), 450);

    try {
      if (!audioContextRef.current) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        audioContextRef.current = new AudioCtx();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const activeScaleKey = overrideScale || selectedScale || 'tizita';
      const normKey = activeScaleKey === 'cherenet' ? 'anchihoye' : activeScaleKey;
      const freqs = BEGENA_SCALE_FREQUENCIES[normKey] || BEGENA_SCALE_FREQUENCIES.tizita;
      const freq = freqs[stringIdx];

      // Begena played strings: 1, 4, 6, 8, 10 -> indices 0, 3, 5, 7, 9
      const isPlayedString = [0, 3, 5, 7, 9].includes(stringIdx);

      if (!isPlayedString || !freq || freq <= 0) {
        // Soft click sound for unplayed strings (2, 3, 5, 7, 9)
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(80, ctx.currentTime);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.11);
        return;
      }

      // Authentic Ethiopian Begena sound (Matching Mezmur simulation sound)
      const now = ctx.currentTime;
      const duration = 2.2;

      const osc = ctx.createOscillator();
      const buzzOsc = ctx.createOscillator();
      const gain = ctx.createGain();
      const buzzGain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now);

      buzzOsc.type = 'square';
      buzzOsc.frequency.setValueAtTime(freq * 3.015, now);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(Math.max(freq * 3.4, 600), now);

      gain.gain.setValueAtTime(0.75, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      buzzGain.gain.setValueAtTime(0.2, now);
      buzzGain.gain.exponentialRampToValueAtTime(0.001, now + Math.min(duration, 1.4));

      osc.connect(filter);
      buzzOsc.connect(buzzGain);
      buzzGain.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      buzzOsc.start(now);
      osc.stop(now + duration);
      buzzOsc.stop(now + Math.min(duration, 1.4));
    } catch (e) {
      console.error('Begena audio synth error:', e);
    }
  };

  const handleBegenaForwardDerdera = async () => {
    if (isPlayingSequence) return;
    setIsPlayingSequence(true);
    setActivePlayMode('forward_derdera');

    // Canonical Begena sequence order: 2 -> 3 -> 1 -> 5 -> 4 -> 2
    // Indices: String 4 (3), String 6 (5), String 1 (0), String 10 (9), String 8 (7), String 4 (3)
    const forwardSequence = [3, 5, 0, 9, 7, 3];

    for (let i = 0; i < forwardSequence.length; i++) {
      playBegenaStringTone(forwardSequence[i], selectedScale);
      await new Promise((resolve) => setTimeout(resolve, 520));
    }

    setIsPlayingSequence(false);
    setActivePlayMode(null);
  };

  const handleBegenaReverseDerdera = async () => {
    if (isPlayingSequence) return;
    setIsPlayingSequence(true);
    setActivePlayMode('reverse_derdera');

    // Reverse Begena sequence order: 2 -> 4 -> 5 -> 1 -> 3 -> 2
    // Indices: String 4 (3), String 8 (7), String 10 (9), String 1 (0), String 6 (5), String 4 (3)
    const reverseSequence = [3, 7, 9, 0, 5, 3];

    for (let i = 0; i < reverseSequence.length; i++) {
      playBegenaStringTone(reverseSequence[i], selectedScale);
      await new Promise((resolve) => setTimeout(resolve, 520));
    }

    setIsPlayingSequence(false);
    setActivePlayMode(null);
  };

  const formattedScaleTitle =
    selectedScale === 'tizita'
      ? 'ትዝታ ቅኝት (Tizita)'
      : selectedScale === 'anchihoye' || selectedScale === 'cherenet'
      ? 'ቸርነት / አንቺ ሆዬ ቅኝት (Cherenet / Anchihoye)'
      : selectedScale === 'bati'
      ? 'ባቲ ቅኝት (Bati)'
      : selectedScale === 'ambassel'
      ? 'አምባሰል ቅኝት (Ambassel)'
      : 'ሰላምታ ቅኝት (Selamta)';

  return (
    <div className="bg-[#1a0f08] p-3 sm:p-4 rounded-2xl border-2 sm:border-3 border-[#3d2414] space-y-2.5 text-center shadow-xl relative overflow-hidden">
      <TiletPattern className="absolute inset-0 opacity-10 pointer-events-none" />

      {/* HEADER BAR */}
      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-2 border-b border-amber-900/60 pb-2.5">
        <div className="text-left space-y-0.5">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider border border-amber-500/30 flex items-center gap-1">
              <Sparkles size={10} /> VIRTUAL BEGENA STUDIO (10 STRINGS)
            </span>
            <span className="px-2 py-0.5 bg-amber-900/90 text-amber-200 border border-amber-700/80 rounded-full text-[9px] font-bold">
              {formattedScaleTitle}
            </span>
          </div>
          <h4 className="font-display font-black text-sm sm:text-base text-amber-300 uppercase">
            {title}
          </h4>
          {subtitle && <p className="text-[10px] sm:text-[11px] text-amber-200/70">{subtitle}</p>}
        </div>

        {/* CONTROLS & SCALE SELECTOR & VIEW MODE TOGGLE */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto justify-between md:justify-end">
          {/* VIEW MODE SWITCHER */}
          <div className="flex bg-[#2b180d] p-0.5 rounded-lg border border-amber-900/80">
            <button
              onClick={() => setActiveViewMode('simulator')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition flex items-center gap-1 cursor-pointer ${
                activeViewMode === 'simulator'
                  ? 'bg-amber-600 text-amber-950 shadow-xs font-black'
                  : 'text-amber-200/70 hover:text-amber-100'
              }`}
            >
              <Music size={12} />
              <span>Virtual Simulator</span>
            </button>
            <button
              onClick={() => setActiveViewMode('tuner')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition flex items-center gap-1 cursor-pointer ${
                activeViewMode === 'tuner'
                  ? 'bg-amber-500 text-amber-950 shadow-xs font-black ring-1 ring-amber-300'
                  : 'text-amber-200/70 hover:text-amber-100'
              }`}
            >
              <Mic size={12} className="text-amber-400" />
              <span>Begena Tuner (በገና ቱነር)</span>
            </button>
          </div>

          {allowScaleChange && activeViewMode === 'simulator' && (
            <div className="flex items-center gap-1 bg-[#2b180d] p-1 rounded-lg border border-amber-900/80">
              <span className="text-[9px] font-bold text-amber-400 pl-1 uppercase">ቅኝት:</span>
              <select
                value={selectedScale}
                onChange={(e) => setSelectedScale(e.target.value)}
                className="bg-[#120a05] text-amber-200 text-[11px] font-bold px-1.5 py-0.5 rounded border border-amber-800 outline-none cursor-pointer"
              >
                <option value="tizita">ትዝታ (Tizita)</option>
                <option value="cherenet">ቸርነት / አንቺ ሆዬ (Cherenet)</option>
                <option value="selamta">ሰላምታ (Selamta)</option>
                <option value="bati">ባቲ (Bati)</option>
                <option value="ambassel">አምባሰል (Ambassel)</option>
              </select>
            </div>
          )}

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleBegenaForwardDerdera}
              disabled={isPlayingSequence}
              className={`px-2.5 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-amber-950 font-black text-[11px] rounded-lg shadow-sm flex items-center gap-1 transition cursor-pointer border border-amber-300/60 ${
                isPlayingSequence && activePlayMode === 'forward_derdera'
                  ? 'opacity-90 animate-pulse ring-2 ring-amber-300'
                  : isPlayingSequence
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:scale-102 active:scale-98'
              }`}
              title="Play canonical Begena sequence: 2 -> 3 -> 1 -> 5 -> 4 -> 2"
            >
              <Play size={12} className="fill-amber-950" />
              <span>
                {isPlayingSequence && activePlayMode === 'forward_derdera'
                  ? 'ወደፊት በመደርደር ላይ...'
                  : '▶ ወደፊት ድርደራ (2 → 3 → 1 → 5 → 4 → 2)'}
              </span>
            </button>

            <button
              onClick={handleBegenaReverseDerdera}
              disabled={isPlayingSequence}
              className={`px-2.5 py-1.5 bg-gradient-to-r from-amber-800 to-amber-900 hover:from-amber-700 hover:to-amber-800 text-amber-100 font-black text-[11px] rounded-lg shadow-sm flex items-center gap-1 transition cursor-pointer border border-amber-600/60 ${
                isPlayingSequence && activePlayMode === 'reverse_derdera'
                  ? 'opacity-90 animate-pulse ring-2 ring-amber-300'
                  : isPlayingSequence
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:scale-102 active:scale-98'
              }`}
              title="Play Begena pattern in reverse: 2 -> 4 -> 5 -> 1 -> 3 -> 2"
            >
              <RotateCcw size={12} className="text-amber-200" />
              <span>
                {isPlayingSequence && activePlayMode === 'reverse_derdera'
                  ? 'ወደ ኋላ በመጫወት ላይ...'
                  : '◀ ወደ ኋላ ድርደራ (2 → 4 → 5 → 1 → 3 → 2)'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* TUNER OR SIMULATOR VIEW */}
      {activeViewMode === 'tuner' ? (
        <div className="relative z-10 text-left">
          <InstrumentTuner instrument="Begena" defaultScaleKey={selectedScale} />
        </div>
      ) : (
        <>
          {/* BEGENA 10 STRINGS FRAME CANVAS */}
      <div className="relative z-10 bg-[#120a05] border border-[#3d2414] rounded-xl p-2 sm:p-3 overflow-hidden shadow-inner">
        <div className="flex justify-between items-center text-[9px] text-amber-400/80 font-mono mb-1.5 px-1 border-b border-[#2b180d] pb-1">
          <span>🪵 የበገና 10 አውታሮች እና የእንዝርት ድምፅ (Begena Gut Strings & Leather Buzz)</span>
          <span className="text-amber-300 font-bold hidden sm:inline">1, 4, 6, 8, 10 = የሚደረደሩ አውታሮች (#1,#2,#3,#4,#5)</span>
        </div>

        <div className="flex justify-between sm:justify-center items-end gap-1 sm:gap-2.5 h-36 sm:h-44 px-1 pt-1 overflow-x-auto">
          {stringsConfig.map((item) => {
            const isPlucked = pluckedStringIndex === item.idx;

            return (
              <button
                key={item.stringNo}
                onClick={() => playBegenaStringTone(item.idx, selectedScale)}
                className={`group flex flex-col items-center cursor-pointer h-full justify-between focus:outline-none min-w-[26px] sm:min-w-[36px] transition-all ${
                  !item.isPlayed ? 'opacity-40 hover:opacity-75' : 'opacity-100'
                }`}
                title={`String ${item.stringNo}: ${item.isPlayed ? `Assigned #${item.assignedNum} (${item.name}) - Pitch ${item.noteName}` : 'ማረፊያ (Not Played)'}`}
              >
                <div className="flex flex-col items-center gap-0.5">
                  <span
                    className={`text-[8px] sm:text-[10px] font-bold px-1 sm:px-2 py-0.2 rounded-full transition-all duration-150 ${
                      isPlucked
                        ? 'bg-amber-300 text-amber-950 font-black scale-105 shadow-[0_0_10px_#f59e0b]'
                        : item.isPlayed
                        ? 'bg-amber-900/90 text-amber-300 border border-amber-600/80 group-hover:bg-amber-500 group-hover:text-amber-950'
                        : 'bg-stone-900 text-stone-500 border border-stone-800'
                    }`}
                  >
                    {item.isPlayed ? `#${item.assignedNum}` : 'x'}
                  </span>
                  <span className="text-[7px] sm:text-[8px] font-mono font-bold text-amber-300/90 bg-black/80 px-1 py-0.2 rounded border border-amber-950">
                    {item.noteName}
                  </span>
                </div>

                <div
                  className={`w-1 rounded-full transition-all duration-75 ${
                    isPlucked
                      ? 'scale-x-150 bg-amber-300 shadow-[0_0_12px_#f59e0b]'
                      : item.isPlayed
                      ? 'bg-amber-400/80 group-hover:bg-amber-300 group-hover:w-1.5'
                      : 'bg-amber-900/30 w-0.5'
                  }`}
                  style={{ height: '48%' }}
                />

                <div className="text-center">
                  <span className={`text-[8px] sm:text-[9px] font-mono font-bold block ${
                    isPlucked ? 'text-amber-300 font-black' : item.isPlayed ? 'text-amber-200/90 group-hover:text-white' : 'text-stone-600'
                  }`}>
                    Str {item.stringNo}
                  </span>
                  <span className="text-[6.5px] sm:text-[7.5px] text-amber-400/60 block leading-tight">
                    {item.isPlayed ? item.name : 'ማረፊያ'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="relative z-10 flex flex-col sm:flex-row justify-between items-center text-[10px] sm:text-[11px] text-amber-300/80 gap-1 bg-[#120a05]/80 p-2 rounded-lg border border-amber-900/40">
        <p className="italic text-left">
          💡 <strong>የድርደራ ቅደም ተከተል (Begena Order):</strong> Standard ድርደራ <strong>2 → 3 → 1 → 5 → 4 → 2</strong> (ወደፊት) | Reverse ድርደራ <strong>2 → 4 → 5 → 1 → 3 → 2</strong> (ወደኋላ)
        </p>
        <span className="font-mono text-amber-400 font-bold shrink-0 text-[10px]">
          ቅኝት፡ {formattedScaleTitle}
        </span>
      </div>

      {/* QUICK SCALE VALUES REFERENCE TABLE */}
      <div className="relative z-10 bg-[#120a05]/60 p-2 rounded-lg border border-amber-950 text-left text-[10px] text-amber-200/90 space-y-1">
        <div className="text-[9px] font-bold uppercase tracking-wider text-amber-400 font-mono">
          📌 የየቅኝቱ የድምፅ እሴቶች (Begena Pentatonic Scale Tone Values):
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-1 text-[10px] font-mono">
          <div className={`p-1 rounded border ${selectedScale === 'tizita' ? 'bg-amber-900/40 border-amber-500 text-amber-200 font-bold' : 'bg-black/40 border-amber-950 text-amber-300/70'}`}>
            <span className="block font-bold text-amber-400 text-[10px]">ትዝታ ቅኝት</span>
            2→C | 3→D | 1→E | 5→G | 4→A
          </div>
          <div className={`p-1 rounded border ${selectedScale === 'cherenet' || selectedScale === 'anchihoye' ? 'bg-amber-900/40 border-amber-500 text-amber-200 font-bold' : 'bg-black/40 border-amber-950 text-amber-300/70'}`}>
            <span className="block font-bold text-amber-400 text-[10px]">ቸርነት ቅኝት</span>
            2→C | 3→C# | 1→F | 5→F# | 4→A
          </div>
          <div className={`p-1 rounded border ${selectedScale === 'selamta' ? 'bg-amber-900/40 border-amber-500 text-amber-200 font-bold' : 'bg-black/40 border-amber-950 text-amber-300/70'}`}>
            <span className="block font-bold text-amber-400 text-[10px]">ሰላምታ ቅኝት</span>
            2→C | 3→D | 1→F | 5→G | 4→A
          </div>
          <div className={`p-1 rounded border ${selectedScale === 'bati' ? 'bg-amber-900/40 border-amber-500 text-amber-200 font-bold' : 'bg-black/40 border-amber-950 text-amber-300/70'}`}>
            <span className="block font-bold text-amber-400 text-[10px]">ባቲ ቅኝት</span>
            2→C | 3→E | 1→F | 5→G | 4→B
          </div>
          <div className={`p-1 rounded border ${selectedScale === 'ambassel' ? 'bg-amber-900/40 border-amber-500 text-amber-200 font-bold' : 'bg-black/40 border-amber-950 text-amber-300/70'}`}>
            <span className="block font-bold text-amber-400 text-[10px]">አምባሰል ቅኝት</span>
            2→C | 3→C# | 1→F | 5→G | 4→G#
          </div>
        </div>
      </div>
        </>
      )}
    </div>
  );
};
