import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Play,
  Square,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Sliders,
  Music,
  Info,
  ShieldAlert,
  Lock,
  Save,
  Sparkles,
  ChevronRight,
  ChevronDown,
  Check,
  Plus,
  Trash2,
  Bookmark,
  Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { isStudentEnrolledInInstrument } from '../utils/studentEnrollment';

export type InstrumentType = 'Begena' | 'Krar';

export interface StringTarget {
  stringNumber: number;
  label: string;
  noteName: string;
  targetFreq: number;
  isPlayed: boolean;
  semitoneOffset: number | null;
}

export interface ScaleTuningPreset {
  scaleKey: string;
  scaleNameAmharic: string;
  scaleNameEnglish: string;
  description: string;
  semitoneOffsets: (number | null)[];
}

export interface SavedTuningConfig {
  id: string;
  name: string;
  instrument: InstrumentType;
  tonic: string;
  octave: number;
  scaleKey: string;
  refA4: number;
  customFrequencies: Record<number, number>;
  createdAt: string;
}

// -------------------------------------------------------------
// CHROMATIC MUSIC THEORY DATA
// -------------------------------------------------------------
export const CHROMATIC_NOTES = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'];

export function calculateFrequency(
  rootNoteName: string,
  rootOctave: number,
  semitoneOffset: number,
  refA4: number = 440.0
): { freq: number; noteName: string; octave: number } {
  const rootIndex = CHROMATIC_NOTES.indexOf(rootNoteName);
  if (rootIndex === -1) return { freq: 440, noteName: 'A4', octave: 4 };

  const rootMidi = 12 * (rootOctave + 1) + rootIndex;
  const stringMidi = rootMidi + semitoneOffset;
  const freq = refA4 * Math.pow(2, (stringMidi - 69) / 12);

  const noteIdx = (stringMidi % 12 + 12) % 12;
  const octave = Math.floor(stringMidi / 12) - 1;
  const noteName = `${CHROMATIC_NOTES[noteIdx]}${octave}`;

  return { freq: parseFloat(freq.toFixed(2)), noteName, octave };
}

export function frequencyToNote(
  freq: number,
  refA4: number = 440.0
): { noteName: string; octave: number; standardFreq: number; midi: number } {
  const midi = Math.round(69 + 12 * Math.log2(freq / refA4));
  const noteIdx = (midi % 12 + 12) % 12;
  const noteName = CHROMATIC_NOTES[noteIdx];
  const octave = Math.floor(midi / 12) - 1;
  const standardFreq = refA4 * Math.pow(2, (midi - 69) / 12);
  return { noteName: `${noteName}${octave}`, octave, standardFreq, midi };
}

export function calculateCents(detectedFreq: number, targetFreq: number): number {
  if (detectedFreq <= 0 || targetFreq <= 0) return 0;
  return 1200 * Math.log2(detectedFreq / targetFreq);
}

// -------------------------------------------------------------
// BEGENA TUNING SYSTEMS (10 STRINGS)
// -------------------------------------------------------------
export const BEGENA_SCALE_PRESETS: ScaleTuningPreset[] = [
  {
    scaleKey: 'tizita_maj',
    scaleNameAmharic: 'ትዝታ ቅኝት (Tizita Major)',
    scaleNameEnglish: 'Tizita Major Pentatonic',
    description: 'Traditional 10-string Begena layout in Tizita Major (Strings 1,4,6,8,10 played; 2,3,5,7,9 muted).',
    semitoneOffsets: [4, null, null, 0, null, 2, null, 7, null, 5]
  },
  {
    scaleKey: 'tizita_min',
    scaleNameAmharic: 'ትዝታ minor ቅኝት (Tizita Minor)',
    scaleNameEnglish: 'Tizita Minor Pentatonic',
    description: 'Deep reflective Tizita Minor scale with minor 3rd tuning.',
    semitoneOffsets: [3, null, null, 0, null, 2, null, 7, null, 5]
  },
  {
    scaleKey: 'bati_maj',
    scaleNameAmharic: 'ባቲ ቅኝት (Bati Major)',
    scaleNameEnglish: 'Bati Major Pentatonic',
    description: 'Bati Major scale with major 3rd and major 7th intervals.',
    semitoneOffsets: [4, null, null, 0, null, 5, null, 11, null, 7]
  },
  {
    scaleKey: 'bati_min',
    scaleNameAmharic: 'ባቲ minor ቅኝት (Bati Minor)',
    scaleNameEnglish: 'Bati Minor Pentatonic',
    description: 'Expressive Bati Minor with minor 3rd and minor 7th intervals.',
    semitoneOffsets: [3, null, null, 0, null, 5, null, 10, null, 7]
  },
  {
    scaleKey: 'ambassel',
    scaleNameAmharic: 'አምባሰል ቅኝት (Ambassel)',
    scaleNameEnglish: 'Ambassel Scale',
    description: 'Ambassel scale with half-step second and fourth degree intervals.',
    semitoneOffsets: [5, null, null, 0, null, 1, null, 8, null, 7]
  },
  {
    scaleKey: 'anchihoye',
    scaleNameAmharic: 'አንቺሆዬ / ቸርነት (Anchihoye)',
    scaleNameEnglish: 'Anchihoye / Cherenet Scale',
    description: 'Anchihoye scale with minor 2nd and diminished 5th harmonic accents.',
    semitoneOffsets: [5, null, null, 0, null, 1, null, 9, null, 6]
  },
  {
    scaleKey: 'selamta',
    scaleNameAmharic: 'ሰላምታ ቅኝት (Selamta)',
    scaleNameEnglish: 'Selamta Hymnal Scale',
    description: 'Sacred Selamta hymnology tuning configuration.',
    semitoneOffsets: [5, null, null, 0, null, 2, null, 9, null, 7]
  }
];

// -------------------------------------------------------------
// KRAR TUNING SYSTEMS (6 STRINGS)
// -------------------------------------------------------------
export const KRAR_SCALE_PRESETS: ScaleTuningPreset[] = [
  {
    scaleKey: 'tizita_maj',
    scaleNameAmharic: 'ትዝታ ቅኝት (Tizita Major)',
    scaleNameEnglish: 'Tizita Major Pentatonic',
    description: 'Bright 6-string Krar layout in Tizita Major pentatonic + root octave.',
    semitoneOffsets: [2, 4, 7, 9, 0, 12]
  },
  {
    scaleKey: 'tizita_min',
    scaleNameAmharic: 'ትዝታ minor ቅኝት (Tizita Minor)',
    scaleNameEnglish: 'Tizita Minor Pentatonic',
    description: 'Melancholic Tizita Minor 6-string tuning.',
    semitoneOffsets: [2, 3, 7, 8, 0, 12]
  },
  {
    scaleKey: 'bati_maj',
    scaleNameAmharic: 'ባቲ ቅኝት (Bati Major)',
    scaleNameEnglish: 'Bati Major Pentatonic',
    description: 'Bright Bati Major 6-string tuning.',
    semitoneOffsets: [4, 5, 7, 11, 0, 12]
  },
  {
    scaleKey: 'bati_min',
    scaleNameAmharic: 'ባቲ minor ቅኝት (Bati Minor)',
    scaleNameEnglish: 'Bati Minor Pentatonic',
    description: 'Bati Minor 6-string tuning.',
    semitoneOffsets: [3, 5, 7, 10, 0, 12]
  },
  {
    scaleKey: 'ambassel',
    scaleNameAmharic: 'አምባሰል ቅኝት (Ambassel)',
    scaleNameEnglish: 'Ambassel Scale',
    description: 'Ambassel 6-string tuning mode.',
    semitoneOffsets: [1, 5, 7, 8, 0, 12]
  },
  {
    scaleKey: 'anchihoye',
    scaleNameAmharic: 'አንቺሆዬ / ቸርነት (Anchihoye)',
    scaleNameEnglish: 'Anchihoye / Cherenet Scale',
    description: 'Anchihoye 6-string tuning mode.',
    semitoneOffsets: [1, 5, 6, 10, 0, 12]
  },
  {
    scaleKey: 'krar_std',
    scaleNameAmharic: 'ክራር Standard (Modern 6-String)',
    scaleNameEnglish: 'Modern 6-String Krar Standard',
    description: 'Standard root pentatonic scale layout for modern acoustic/electric Krar.',
    semitoneOffsets: [0, 2, 4, 7, 9, 12]
  }
];

// Backward compatibility export
export const BEGENA_TUNING_PRESETS = BEGENA_SCALE_PRESETS.map((p) => ({
  scaleKey: p.scaleKey,
  scaleNameAmharic: p.scaleNameAmharic,
  scaleNameEnglish: p.scaleNameEnglish,
  strings: p.semitoneOffsets.map((offset, idx) => {
    const isPlayed = offset !== null;
    const calc = offset !== null ? calculateFrequency('A', 2, offset, 440) : { freq: 0, noteName: 'Muted' };
    return {
      stringNumber: idx + 1,
      label: `String ${idx + 1}`,
      noteName: calc.noteName,
      targetFreq: calc.freq,
      isPlayed
    };
  })
}));

export const KRAR_TUNING_PRESETS = KRAR_SCALE_PRESETS.map((p) => ({
  scaleKey: p.scaleKey,
  scaleNameAmharic: p.scaleNameAmharic,
  scaleNameEnglish: p.scaleNameEnglish,
  strings: p.semitoneOffsets.map((offset, idx) => {
    const isPlayed = offset !== null;
    const calc = offset !== null ? calculateFrequency('C', 4, offset, 440) : { freq: 0, noteName: 'Muted' };
    return {
      stringNumber: idx + 1,
      label: `String ${idx + 1}`,
      noteName: calc.noteName,
      targetFreq: calc.freq,
      isPlayed
    };
  })
}));

// -------------------------------------------------------------
// PITCH DETECTION ALGORITHM (AUTOCORRELATION & HARMONIC FILTER)
// -------------------------------------------------------------
function autoCorrelate(
  buffer: Float32Array,
  sampleRate: number,
  isBegena: boolean
): { pitch: number; clarity: number; rms: number } | null {
  const SIZE = buffer.length;

  // 1. RMS Energy Check
  let sumSquare = 0;
  for (let i = 0; i < SIZE; i++) {
    sumSquare += buffer[i] * buffer[i];
  }
  const rms = Math.sqrt(sumSquare / SIZE);

  // Noise gate threshold
  if (rms < 0.008) return null;

  // 2. Frequency Range
  const minFreq = isBegena ? 40 : 90;
  const maxFreq = isBegena ? 380 : 780;

  const minPeriod = Math.floor(sampleRate / maxFreq);
  const maxPeriod = Math.floor(sampleRate / minFreq);

  // 3. Low Pass Smoothing Filter
  let signal = buffer;
  if (isBegena) {
    const smoothed = new Float32Array(SIZE);
    smoothed[0] = buffer[0];
    const alpha = 0.35;
    for (let i = 1; i < SIZE; i++) {
      smoothed[i] = smoothed[i - 1] + alpha * (buffer[i] - smoothed[i - 1]);
    }
    signal = smoothed;
  }

  // 4. Autocorrelation Computation
  const r = new Float32Array(maxPeriod + 1);
  for (let lag = minPeriod; lag <= maxPeriod; lag++) {
    let sum = 0;
    for (let i = 0; i < SIZE - lag; i++) {
      sum += signal[i] * signal[i + lag];
    }
    r[lag] = sum;
  }

  // 5. Peak Detection
  let bestLag = -1;
  let maxCorr = 0;

  for (let lag = minPeriod; lag <= maxPeriod; lag++) {
    if (r[lag] > maxCorr) {
      maxCorr = r[lag];
      bestLag = lag;
    }
  }

  if (bestLag === -1 || maxCorr < 0.01) return null;

  // Parabolic Peak Interpolation
  let refinedLag = bestLag;
  if (bestLag > minPeriod && bestLag < maxPeriod) {
    const alpha = r[bestLag - 1];
    const beta = r[bestLag];
    const gamma = r[bestLag + 1];
    const delta = (alpha - gamma) / (2 * (alpha - 2 * beta + gamma));
    if (!isNaN(delta) && Math.abs(delta) < 1) {
      refinedLag = bestLag + delta;
    }
  }

  const pitch = sampleRate / refinedLag;
  if (pitch < minFreq || pitch > maxFreq) return null;

  return { pitch, clarity: maxCorr, rms };
}

// -------------------------------------------------------------
// WEB AUDIO SYNTHESIZER FOR TARGET TONES
// -------------------------------------------------------------
export function playInstrumentTargetTone(
  freq: number,
  instrument: InstrumentType,
  durationSeconds: number = 2.0
): () => void {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioCtx();

    if (instrument === 'Begena') {
      // Begena Tone: Warm sub-bass fundamental + buzzing bridge overtone (Arik simulation)
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(freq, ctx.currentTime);

      osc2.type = 'sawtooth';
      osc2.frequency.setValueAtTime(freq * 2, ctx.currentTime);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(600, ctx.currentTime);

      gain.gain.setValueAtTime(0.6, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + durationSeconds);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(ctx.currentTime);
      osc2.start(ctx.currentTime);
      osc1.stop(ctx.currentTime + durationSeconds);
      osc2.stop(ctx.currentTime + durationSeconds);

      return () => {
        try {
          osc1.stop();
          osc2.stop();
          ctx.close();
        } catch {}
      };
    } else {
      // Krar Tone: Plucked acoustic lyre string sound
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1400, ctx.currentTime);

      gain.gain.setValueAtTime(0.7, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + durationSeconds);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + durationSeconds);

      return () => {
        try {
          osc.stop();
          ctx.close();
        } catch {}
      };
    }
  } catch (e) {
    console.error('Target tone synth error:', e);
    return () => {};
  }
}

// -------------------------------------------------------------
// COMPONENT PROPS
// -------------------------------------------------------------
interface InstrumentTunerProps {
  instrument: InstrumentType;
  defaultScaleKey?: string;
  onClose?: () => void;
  compact?: boolean;
}

export const InstrumentTuner: React.FC<InstrumentTunerProps> = ({
  instrument,
  defaultScaleKey = 'tizita_maj',
  onClose,
  compact = false
}) => {
  const isBegena = instrument === 'Begena';
  const { currentUser } = useAuth();
  const { enrollments } = useData();

  // -------------------------------------------------------------
  // ENROLLMENT & ACCESS RESTRICTION CHECK
  // -------------------------------------------------------------
  const isStudent = currentUser?.role === 'student';
  const isEnrolledInActiveInst = useMemo(() => {
    if (!isStudent) return true; // Teachers, admins, staff get full access
    return isStudentEnrolledInInstrument(currentUser, instrument, enrollments);
  }, [isStudent, currentUser, instrument, enrollments]);

  // -------------------------------------------------------------
  // TUNER STATE
  // -------------------------------------------------------------
  const [selectedTonic, setSelectedTonic] = useState<string>(isBegena ? 'A' : 'C');
  const [selectedOctave, setSelectedOctave] = useState<number>(isBegena ? 2 : 4);
  const [refA4, setRefA4] = useState<number>(440.0);
  const [activeScaleKey, setActiveScaleKey] = useState<string>(defaultScaleKey);
  const [selectedStringNum, setSelectedStringNum] = useState<number>(1);
  const [autoAdvance, setAutoAdvance] = useState<boolean>(true);
  const [toleranceCents, setToleranceCents] = useState<number>(5);

  // Live Audio & Mic state
  const [isListening, setIsListening] = useState<boolean>(false);
  const [micError, setMicError] = useState<string | null>(null);
  const [detectedFreq, setDetectedFreq] = useState<number | null>(null);
  const [smoothedFreq, setSmoothedFreq] = useState<number | null>(null);
  const [signalRms, setSignalRms] = useState<number>(0);

  // Progress & Tuning status tracking
  const [tunedStrings, setTunedStrings] = useState<Record<number, boolean>>({});
  const [isTuningComplete, setIsTuningComplete] = useState<boolean>(false);
  const [isPlayingTone, setIsPlayingTone] = useState<boolean>(false);

  // Settings & Custom Tunings Modals
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);
  const [showPresetManagerModal, setShowPresetManagerModal] = useState<boolean>(false);
  const [savedTunings, setSavedTunings] = useState<SavedTuningConfig[]>([]);

  // Custom Frequencies Overrides
  const [customFrequencies, setCustomFrequencies] = useState<Record<number, number>>({});
  const [newPresetName, setNewPresetName] = useState<string>('');

  // Custom School Presets (Teacher/Admin)
  const [schoolPresets, setSchoolPresets] = useState<ScaleTuningPreset[]>([]);

  // Audio Context & Analyser Refs
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const toneStopRef = useRef<(() => void) | null>(null);
  const inTuneTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Load Saved Tunings & School Presets from localStorage
  useEffect(() => {
    if (!currentUser) return;
    try {
      const storageKey = `ab_saved_tunings_${instrument}_${currentUser.id || currentUser.email}`;
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setSavedTunings(JSON.parse(saved));
      }
    } catch {}

    try {
      const schoolKey = `ab_school_tunings_${instrument}`;
      const savedSchool = localStorage.getItem(schoolKey);
      if (savedSchool) {
        setSchoolPresets(JSON.parse(savedSchool));
      }
    } catch {}
  }, [instrument, currentUser]);

  // Combined Presets List
  const allPresets = useMemo(() => {
    const base = isBegena ? BEGENA_SCALE_PRESETS : KRAR_SCALE_PRESETS;
    return [...base, ...schoolPresets];
  }, [isBegena, schoolPresets]);

  const currentPreset = useMemo(() => {
    return allPresets.find((p) => p.scaleKey === activeScaleKey) || allPresets[0];
  }, [allPresets, activeScaleKey]);

  // Mappings for Krar physical string index -> assigned degree number
  const KRAR_ASSIGNED_NUMS = [2, 3, 4, 5, 1, 6];
  const KRAR_ORDINALS = ['2nd (2ኛ)', '3rd (3ኛ)', '4th (4ኛ)', '5th (5ኛ)', '1st (1ኛ)', '6th (6ኛ)'];

  // Dynamically compute String Target Notes & Frequencies
  const generatedStrings = useMemo<StringTarget[]>(() => {
    const totalStrings = isBegena ? 10 : 6;
    const result: StringTarget[] = [];

    for (let i = 1; i <= totalStrings; i++) {
      const idx = i - 1;
      const semitoneOffset = currentPreset.semitoneOffsets[idx] ?? null;

      if (semitoneOffset === null) {
        result.push({
          stringNumber: i,
          label: `String ${i} (${i}ኛ)`,
          noteName: 'Muted',
          targetFreq: 0,
          isPlayed: false,
          semitoneOffset: null
        });
      } else {
        const calculated = calculateFrequency(selectedTonic, selectedOctave, semitoneOffset, refA4);
        const customFreq = customFrequencies[i] || calculated.freq;

        const labelStr = isBegena
          ? `String ${i} (${i}ኛ)`
          : `String ${i} (#${KRAR_ASSIGNED_NUMS[idx]} • ${KRAR_ORDINALS[idx]})`;

        result.push({
          stringNumber: i,
          label: labelStr,
          noteName: calculated.noteName,
          targetFreq: customFreq,
          isPlayed: true,
          semitoneOffset
        });
      }
    }

    return result;
  }, [isBegena, currentPreset, selectedTonic, selectedOctave, refA4, customFrequencies]);

  const playedStrings = useMemo(() => {
    const base = generatedStrings.filter((s) => s.isPlayed);
    if (!isBegena) {
      // Krar tuning sequence order by scale degree (1 -> 6): String 5 (#1) -> String 1 (#2) -> String 2 (#3) -> String 3 (#4) -> String 4 (#5) -> String 6 (#6)
      const krarTuningOrder = [5, 1, 2, 3, 4, 6];
      return [...base].sort((a, b) => krarTuningOrder.indexOf(a.stringNumber) - krarTuningOrder.indexOf(b.stringNumber));
    }
    return base;
  }, [generatedStrings, isBegena]);

  // Current Active String Target
  const activeTargetString = useMemo(() => {
    if (playedStrings.length === 0) return null;
    return playedStrings.find((s) => s.stringNumber === selectedStringNum) || playedStrings[0];
  }, [playedStrings, selectedStringNum]);

  // Cents Calculation & Tuning Status
  const tuningInfo = useMemo(() => {
    if (!smoothedFreq || !activeTargetString || activeTargetString.targetFreq <= 0) {
      return {
        cents: 0,
        status: 'Waiting for instrument sound...',
        color: 'gray',
        detectedNoteStr: '---',
        targetNoteStr: activeTargetString?.noteName || '---',
        targetFreqVal: activeTargetString?.targetFreq || 0,
        guidanceText: 'Pluck the selected string clearly near your microphone.',
        direction: 'none'
      };
    }

    const cents = calculateCents(smoothedFreq, activeTargetString.targetFreq);
    const noteInfo = frequencyToNote(smoothedFreq, refA4);

    let status = 'IN TUNE';
    let color = 'emerald';
    let guidanceText = 'Perfect! Your string is in tune. Adjust gradually if needed.';
    let direction: 'flat' | 'sharp' | 'in-tune' = 'in-tune';

    if (cents < -toleranceCents) {
      status = 'TOO LOW (FLAT / አነስተኛ)';
      color = 'amber';
      guidanceText = 'Your string is too low. Tighten the string peg gradually and gently.';
      direction = 'flat';
    } else if (cents > toleranceCents) {
      status = 'TOO HIGH (SHARP / ከፍተኛ)';
      color = 'rose';
      guidanceText = 'Your string is too high. Loosen the string peg gradually and gently.';
      direction = 'sharp';
    } else {
      status = 'IN TUNE (ትክክለኛ ቅኝት!)';
      color = 'emerald';
      guidanceText = 'Perfect! Your string is in tune. Maintain this tension.';
      direction = 'in-tune';
    }

    return {
      cents,
      status,
      color,
      detectedNoteStr: noteInfo.noteName,
      targetNoteStr: activeTargetString.noteName,
      targetFreqVal: activeTargetString.targetFreq,
      guidanceText,
      direction
    };
  }, [smoothedFreq, activeTargetString, refA4, toleranceCents]);

  // Auto-Advance String Logic when In-Tune for 1.2s
  useEffect(() => {
    if (!isListening || !autoAdvance || tuningInfo.direction !== 'in-tune' || !activeTargetString) {
      if (inTuneTimerRef.current) {
        clearTimeout(inTuneTimerRef.current);
        inTuneTimerRef.current = null;
      }
      return;
    }

    if (!inTuneTimerRef.current) {
      inTuneTimerRef.current = setTimeout(() => {
        // Mark current string as tuned
        setTunedStrings((prev) => {
          const updated = { ...prev, [activeTargetString.stringNumber]: true };

          // Check if all played strings are now tuned
          const allTuned = playedStrings.every((st) => updated[st.stringNumber]);
          if (allTuned) {
            setIsTuningComplete(true);
          }
          return updated;
        });

        // Advance to next played string
        const currentIdx = playedStrings.findIndex((s) => s.stringNumber === activeTargetString.stringNumber);
        if (currentIdx !== -1 && currentIdx < playedStrings.length - 1) {
          setSelectedStringNum(playedStrings[currentIdx + 1].stringNumber);
        }

        inTuneTimerRef.current = null;
      }, 1200);
    }

    return () => {
      if (inTuneTimerRef.current) {
        clearTimeout(inTuneTimerRef.current);
        inTuneTimerRef.current = null;
      }
    };
  }, [isListening, autoAdvance, tuningInfo.direction, activeTargetString, playedStrings]);

  // Start Mic Listening
  const startTuner = async () => {
    setMicError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setMicError('Your browser does not support microphone access. Please use Chrome, Safari, or Edge.');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          autoGainControl: false,
          noiseSuppression: false
        }
      });

      streamRef.current = stream;

      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioContextClass();
      audioCtxRef.current = audioCtx;

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 4096;
      analyserRef.current = analyser;

      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      setIsListening(true);
      const buffer = new Float32Array(analyser.fftSize);
      let prevPitch: number | null = null;

      const updateLoop = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getFloatTimeDomainData(buffer);

        const result = autoCorrelate(buffer, audioCtx.sampleRate, isBegena);

        if (result) {
          setSignalRms(result.rms);
          setDetectedFreq(result.pitch);

          // Exponential pitch smoothing for needle stability
          const alpha = 0.35;
          const currentSmoothed =
            prevPitch === null ? result.pitch : prevPitch + alpha * (result.pitch - prevPitch);

          prevPitch = currentSmoothed;
          setSmoothedFreq(currentSmoothed);
        } else {
          setSignalRms(0);
          setDetectedFreq(null);
          setSmoothedFreq(null);
          prevPitch = null;
        }

        animFrameRef.current = requestAnimationFrame(updateLoop);
      };

      updateLoop();
    } catch (err: any) {
      console.error('Microphone Access Error:', err);
      setIsListening(false);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setMicError('Microphone permission was denied. Please allow microphone access in your browser settings.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setMicError('No microphone hardware detected on your device.');
      } else {
        setMicError(`Could not start microphone: ${err.message || 'Unknown error'}`);
      }
    }
  };

  // Stop Mic Listening
  const stopTuner = () => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
      audioCtxRef.current.close();
      audioCtxRef.current = null;
    }
    analyserRef.current = null;
    setIsListening(false);
    setDetectedFreq(null);
    setSmoothedFreq(null);
    setSignalRms(0);
  };

  useEffect(() => {
    return () => {
      stopTuner();
      if (toneStopRef.current) toneStopRef.current();
    };
  }, []);

  // Play Target Tone
  const handlePlayTargetTone = () => {
    if (!activeTargetString || activeTargetString.targetFreq <= 0) return;
    if (toneStopRef.current) {
      toneStopRef.current();
      toneStopRef.current = null;
    }

    setIsPlayingTone(true);
    const stopFn = playInstrumentTargetTone(activeTargetString.targetFreq, instrument, 2.5);
    toneStopRef.current = stopFn;

    setTimeout(() => {
      setIsPlayingTone(false);
    }, 2500);
  };

  // Save Current Tuning Configuration
  const handleSaveTuning = () => {
    if (!currentUser) return;
    const name = newPresetName.trim() || `${instrument} ${selectedTonic} ${currentPreset.scaleNameEnglish}`;
    const newConfig: SavedTuningConfig = {
      id: `tune_${Date.now()}`,
      name,
      instrument,
      tonic: selectedTonic,
      octave: selectedOctave,
      scaleKey: activeScaleKey,
      refA4,
      customFrequencies,
      createdAt: new Date().toLocaleDateString()
    };

    const updated = [newConfig, ...savedTunings];
    setSavedTunings(updated);
    try {
      const storageKey = `ab_saved_tunings_${instrument}_${currentUser.id || currentUser.email}`;
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch {}
    setNewPresetName('');
  };

  const handleDeleteSavedTuning = (id: string) => {
    if (!currentUser) return;
    const updated = savedTunings.filter((t) => t.id !== id);
    setSavedTunings(updated);
    try {
      const storageKey = `ab_saved_tunings_${instrument}_${currentUser.id || currentUser.email}`;
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch {}
  };

  const handleLoadSavedTuning = (config: SavedTuningConfig) => {
    setSelectedTonic(config.tonic);
    setSelectedOctave(config.octave);
    setActiveScaleKey(config.scaleKey);
    setRefA4(config.refA4);
    if (config.customFrequencies) {
      setCustomFrequencies(config.customFrequencies);
    }
  };

  // Needle Angle (-45 deg to +45 deg)
  const needleAngle = useMemo(() => {
    if (!smoothedFreq || tuningInfo.status === 'Waiting for sound...') return 0;
    const clampedCents = Math.max(-50, Math.min(50, tuningInfo.cents));
    return (clampedCents / 50) * 45;
  }, [smoothedFreq, tuningInfo]);

  // Calculate Tuned Count Progress
  const tunedCount = useMemo(() => {
    return playedStrings.filter((s) => tunedStrings[s.stringNumber]).length;
  }, [playedStrings, tunedStrings]);

  // -------------------------------------------------------------
  // ENROLLMENT LOCK SCREEN VIEW (FOR NON-ENROLLED STUDENTS)
  // -------------------------------------------------------------
  if (!isEnrolledInActiveInst) {
    return (
      <div className="bg-white dark:bg-[#1E1915] border border-amber-200 dark:border-amber-900/60 p-8 sm:p-12 rounded-3xl text-center space-y-6 max-w-xl mx-auto my-8 shadow-xl">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto shadow-xs">
          <Lock size={32} />
        </div>
        <div className="space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#E89B52] bg-amber-50 dark:bg-amber-950/40 px-3 py-1 rounded-full border border-amber-200 dark:border-amber-800">
            {instrument} Course Required
          </span>
          <h2 className="font-display font-black text-2xl text-[#2B2B2B] dark:text-amber-100">
            {instrument.toUpperCase()} INSTRUMENT TUNER LOCKED
          </h2>
          <p className="text-xs text-gray-600 dark:text-amber-200/80 leading-relaxed">
            You are currently enrolled in another instrument course. The professional <strong>{instrument} Chromatic Tuner</strong> with string pitch frequency generators is reserved for enrolled {instrument} students.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row justify-center gap-3">
          {onClose && (
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-gray-100 dark:bg-amber-950/40 text-gray-800 dark:text-amber-200 font-bold text-xs border border-gray-200 dark:border-amber-800 cursor-pointer"
            >
              Back to Studio
            </button>
          )}
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // MAIN PROFESSIONAL TUNER VIEW
  // -------------------------------------------------------------
  return (
    <div
      className={`bg-[#1B1612] text-amber-50 rounded-3xl border border-amber-900/50 shadow-2xl overflow-hidden relative ${
        compact ? 'p-4 sm:p-6' : 'p-6 sm:p-8'
      }`}
    >
      {/* Background Decorative Blur */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-yellow-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* 1. HEADER BAR */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-amber-900/40 pb-5 mb-6 relative z-10">
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold shadow-lg border ${
              isBegena
                ? 'bg-gradient-to-br from-amber-700 to-amber-900 border-amber-500/50 text-amber-200'
                : 'bg-gradient-to-br from-orange-600 to-amber-800 border-orange-400/50 text-orange-200'
            }`}
          >
            <Music size={24} />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span
                className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${
                  isBegena
                    ? 'bg-amber-900/60 text-amber-300 border-amber-700/50'
                    : 'bg-orange-900/60 text-orange-300 border-orange-700/50'
                }`}
              >
                {isBegena ? '10-String Begena Tuner • የበገና ቱነር' : '6-String Krar Tuner • የክራር ቱነር'}
              </span>
              {isListening && (
                <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Live Listening
                </span>
              )}
            </div>
            <h3 className="text-xl sm:text-2xl font-display font-black text-amber-100 tracking-wide mt-1">
              {isBegena
                ? 'የበገና ትክክለኛ የድምፅ ማስተካከያ (Professional Begena Tuner)'
                : 'የክራር ትክክለኛ የድምፅ ማስተካከያ (Professional Krar Tuner)'}
            </h3>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={() => setShowSettingsModal(true)}
            className="px-3.5 py-2 rounded-xl bg-amber-900/40 hover:bg-amber-900/70 border border-amber-700/50 text-amber-200 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
            title="Tuner Settings & Reference Pitch"
          >
            <Sliders size={14} />
            <span className="hidden sm:inline">Settings</span>
          </button>

          {savedTunings.length > 0 && (
            <button
              onClick={() => setShowPresetManagerModal(true)}
              className="px-3.5 py-2 rounded-xl bg-amber-800/40 hover:bg-amber-800/70 border border-amber-600/50 text-amber-200 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
            >
              <Bookmark size={14} />
              <span className="hidden sm:inline">Saved ({savedTunings.length})</span>
            </button>
          )}

          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-amber-900/30 hover:bg-amber-900/60 border border-amber-800/40 text-amber-300 transition cursor-pointer"
            >
              <ArrowLeft size={18} />
            </button>
          )}
        </div>
      </div>

      {/* ERROR ALERT */}
      {micError && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-950/80 border border-rose-700/80 text-rose-200 text-xs flex items-start gap-3 shadow-lg">
          <ShieldAlert size={20} className="text-rose-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-rose-300 block">Microphone Access Error</span>
            <p className="leading-relaxed">{micError}</p>
          </div>
        </div>
      )}

      {/* 2. TONIC KEY & SCALE CONFIGURATION SELECTORS */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-6 relative z-10 bg-[#221B16] border border-amber-900/50 p-4 rounded-2xl">
        {/* TONIC KEY SELECTOR */}
        <div className="md:col-span-6 space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold text-amber-400 uppercase tracking-wider font-mono">
              1. Select Tonic / Key (መሰረታዊ ድምፅ)
            </label>
            <span className="text-[10px] font-mono font-bold text-amber-300/70">
              Selected: <strong className="text-amber-200">{selectedTonic}{selectedOctave}</strong>
            </span>
          </div>
          <div className="flex flex-wrap gap-1">
            {CHROMATIC_NOTES.map((note) => (
              <button
                key={note}
                onClick={() => setSelectedTonic(note)}
                className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-bold transition cursor-pointer ${
                  selectedTonic === note
                    ? 'bg-amber-500 text-amber-950 border-amber-300 font-black shadow-md ring-2 ring-amber-400'
                    : 'bg-amber-950/40 text-amber-200 border-amber-900/40 hover:bg-amber-900/50'
                }`}
              >
                {note}
              </button>
            ))}
          </div>
        </div>

        {/* OCTAVE SELECTOR */}
        <div className="md:col-span-2 space-y-2">
          <label className="text-xs font-bold text-amber-400 uppercase tracking-wider font-mono block">
            Octave
          </label>
          <div className="flex gap-1">
            {[2, 3, 4, 5].map((oct) => (
              <button
                key={oct}
                onClick={() => setSelectedOctave(oct)}
                className={`flex-1 py-1.5 rounded-lg border text-xs font-mono font-bold transition cursor-pointer ${
                  selectedOctave === oct
                    ? 'bg-amber-500 text-amber-950 border-amber-300 font-black shadow-md'
                    : 'bg-amber-950/40 text-amber-200 border-amber-900/40 hover:bg-amber-900/50'
                }`}
              >
                {oct}
              </button>
            ))}
          </div>
        </div>

        {/* SCALE / TUNING SYSTEM SELECTOR */}
        <div className="md:col-span-4 space-y-2">
          <label className="text-xs font-bold text-amber-400 uppercase tracking-wider font-mono block">
            2. Scale / Tuning System (ቅኝት መረጣ)
          </label>
          <select
            value={activeScaleKey}
            onChange={(e) => setActiveScaleKey(e.target.value)}
            className="w-full bg-amber-950/60 border border-amber-700/60 rounded-xl px-3 py-2 text-xs font-bold text-amber-100 outline-none cursor-pointer"
          >
            {allPresets.map((p) => (
              <option key={p.scaleKey} value={p.scaleKey}>
                {p.scaleNameAmharic}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 3. TUNING SEQUENCE PROGRESS & STRING SELECTOR TABS */}
      <div className="mb-6 relative z-10 bg-[#221B16] border border-amber-900/50 p-4 rounded-2xl space-y-3">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider font-mono">
              3. String Tuning Sequence Progress ({tunedCount}/{playedStrings.length} Tuned)
            </span>
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-1.5 text-xs text-amber-300/80 cursor-pointer">
              <input
                type="checkbox"
                checked={autoAdvance}
                onChange={(e) => setAutoAdvance(e.target.checked)}
                className="accent-amber-500 rounded cursor-pointer"
              />
              <span className="font-semibold text-[11px]">Auto-Advance Next String</span>
            </label>
          </div>
        </div>

        {/* String Selector Pills */}
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
          {generatedStrings.map((st) => {
            if (!st.isPlayed) {
              return (
                <div
                  key={st.stringNumber}
                  className="p-2 rounded-xl bg-amber-950/20 border border-amber-950 text-center opacity-40 cursor-not-allowed"
                >
                  <span className="text-[9px] font-mono text-amber-400/50 block">Str {st.stringNumber}</span>
                  <span className="text-[10px] font-bold text-amber-600">Muted</span>
                </div>
              );
            }

            const isSelected = selectedStringNum === st.stringNumber;
            const isTuned = tunedStrings[st.stringNumber];

            return (
              <button
                key={st.stringNumber}
                onClick={() => setSelectedStringNum(st.stringNumber)}
                className={`p-2.5 rounded-xl border text-center transition cursor-pointer relative flex flex-col items-center justify-center ${
                  isSelected
                    ? 'bg-amber-500 text-amber-950 border-amber-300 font-black shadow-md ring-2 ring-amber-300'
                    : isTuned
                    ? 'bg-emerald-950/60 text-emerald-300 border-emerald-600/60'
                    : 'bg-amber-950/40 text-amber-200 border-amber-900/40 hover:bg-amber-900/40'
                }`}
              >
                {isTuned && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] shadow-sm">
                    ✓
                  </span>
                )}
                <span className="text-[9px] font-mono font-bold">
                  Str {st.stringNumber} {!isBegena && <span className="text-amber-300 font-black">#{KRAR_ASSIGNED_NUMS[st.stringNumber - 1]}</span>}
                </span>
                <span className="text-xs font-black">{st.noteName}</span>
                <span className="text-[9px] font-mono opacity-80">{st.targetFreq.toFixed(1)}Hz</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. MAIN TUNER GAUGE & REAL-TIME READOUT DISPLAY */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
        {/* GAUGE DISPLAY */}
        <div className="lg:col-span-8 flex flex-col justify-between bg-[#14100D] border border-amber-900/60 p-6 rounded-2xl relative overflow-hidden space-y-6">
          {/* TOP STATUS ROW */}
          <div className="flex items-center justify-between border-b border-amber-900/40 pb-4">
            <div className="flex items-center gap-2">
              <span
                className={`w-3 h-3 rounded-full ${
                  !isListening
                    ? 'bg-gray-600'
                    : tuningInfo.color === 'emerald'
                    ? 'bg-emerald-400 animate-ping'
                    : tuningInfo.color === 'amber'
                    ? 'bg-amber-400'
                    : 'bg-rose-500'
                }`}
              />
              <span className="text-xs font-mono uppercase text-amber-300/80 font-bold">
                String {selectedStringNum} Tuning Meter
              </span>
            </div>

            <span
              className={`px-3 py-1 rounded-full text-xs font-black border tracking-wide uppercase ${
                !isListening
                  ? 'bg-gray-900 text-gray-400 border-gray-700'
                  : tuningInfo.color === 'emerald'
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-500/60 shadow-lg'
                  : tuningInfo.color === 'amber'
                  ? 'bg-amber-950 text-amber-300 border-amber-500/60'
                  : 'bg-rose-950 text-rose-300 border-rose-500/60'
              }`}
            >
              {isListening ? tuningInfo.status : 'OFFLINE • START MIC'}
            </span>
          </div>

          {/* GAUGE NEEDLE VISUALIZER */}
          <div className="relative py-4 flex flex-col items-center justify-center">
            {/* Semi-circle Gauge Background Arc */}
            <div className="w-64 h-32 sm:w-80 sm:h-40 relative overflow-hidden flex items-end justify-center">
              <div className="w-64 h-64 sm:w-80 sm:h-80 rounded-full border-[14px] border-amber-950/60 border-t-amber-800/40 border-r-rose-800/40 border-l-amber-700/40 relative">
                {/* Center Green In-Tune Target Tick Zone */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-14 h-5 bg-emerald-500/40 rounded-b-lg border-x border-b border-emerald-400" />
              </div>

              {/* Pitch Deviation Needle */}
              <div
                className="absolute bottom-0 left-1/2 w-1.5 h-28 sm:h-36 bg-gradient-to-t from-amber-400 via-amber-200 to-white origin-bottom rounded-full shadow-2xl transition-transform duration-100 ease-out"
                style={{
                  transform: `translateX(-50%) rotate(${needleAngle}deg)`
                }}
              >
                <div className="w-4 h-4 rounded-full bg-amber-300 border-2 border-amber-950 absolute bottom-0 left-1/2 -translate-x-1/2 shadow-md" />
              </div>
            </div>

            {/* Cents Scale Markers */}
            <div className="w-full max-w-sm flex justify-between text-[10px] font-mono font-bold text-amber-400/70 pt-3 px-2">
              <span className="text-amber-400/60">-50 FLAT</span>
              <span className="text-amber-300/80">-25</span>
              <span className="text-emerald-400 font-extrabold text-xs">0 IN TUNE (±{toleranceCents}c)</span>
              <span className="text-amber-300/80">+25</span>
              <span className="text-rose-400/60">+50 SHARP</span>
            </div>
          </div>

          {/* DYNAMIC REAL-TIME GUIDANCE BOX */}
          <div
            className={`p-4 rounded-2xl border text-center transition-all ${
              tuningInfo.color === 'emerald'
                ? 'bg-emerald-950/50 border-emerald-500/60 text-emerald-200'
                : tuningInfo.color === 'amber'
                ? 'bg-amber-950/50 border-amber-500/60 text-amber-200'
                : tuningInfo.color === 'rose'
                ? 'bg-rose-950/50 border-rose-500/60 text-rose-200'
                : 'bg-amber-950/30 border-amber-900/40 text-amber-300/80'
            }`}
          >
            <div className="flex items-center justify-center gap-2 font-black text-sm uppercase tracking-wide">
              {tuningInfo.direction === 'flat' && <span className="text-amber-400 font-bold">← ← ←</span>}
              <span>{tuningInfo.guidanceText}</span>
              {tuningInfo.direction === 'sharp' && <span className="text-rose-400 font-bold">→ → →</span>}
            </div>
            {isListening && smoothedFreq && (
              <p className="text-[11px] font-mono mt-1 opacity-80">
                Deviation: <strong>{tuningInfo.cents > 0 ? `+${tuningInfo.cents.toFixed(1)}` : tuningInfo.cents.toFixed(1)} cents</strong>
              </p>
            )}
          </div>

          {/* REAL-TIME READOUT GRID */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#1C1713] border border-amber-900/40 p-4 rounded-2xl text-center">
            <div>
              <span className="text-[10px] font-mono font-bold text-amber-400 uppercase block">Detected Note</span>
              <span className="text-xl sm:text-2xl font-black text-white font-mono">
                {smoothedFreq ? tuningInfo.detectedNoteStr : '---'}
              </span>
            </div>

            <div>
              <span className="text-[10px] font-mono font-bold text-amber-400 uppercase block">Frequency (Hz)</span>
              <span className="text-xl sm:text-2xl font-black text-amber-300 font-mono">
                {smoothedFreq ? `${smoothedFreq.toFixed(2)}` : '---'}
              </span>
            </div>

            <div>
              <span className="text-[10px] font-mono font-bold text-amber-400 uppercase block">Target Note</span>
              <span className="text-xl sm:text-2xl font-black text-amber-400 font-mono">
                {activeTargetString ? activeTargetString.noteName : '---'}
              </span>
            </div>

            <div>
              <span className="text-[10px] font-mono font-bold text-amber-400 uppercase block">Target Freq</span>
              <span className="text-xl sm:text-2xl font-black text-amber-200 font-mono">
                {activeTargetString ? `${activeTargetString.targetFreq.toFixed(2)}` : '---'}
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE CONTROLS & TARGET TONE PLAYER */}
        <div className="lg:col-span-4 space-y-4 flex flex-col justify-between">
          {/* TARGET TONE AUDIO GENERATOR */}
          <div className="bg-[#1C1713] border border-amber-900/50 p-5 rounded-2xl space-y-4">
            <div className="space-y-1">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block font-mono">
                Target Reference Audio
              </span>
              <p className="text-[11px] text-amber-300/70 leading-relaxed">
                Listen to the reference target pitch for {instrument} String {selectedStringNum} ({activeTargetString?.noteName}):
              </p>
            </div>

            <button
              onClick={handlePlayTargetTone}
              disabled={!activeTargetString}
              className={`w-full py-3.5 px-4 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer ${
                isPlayingTone
                  ? 'bg-amber-400 text-amber-950 border-amber-300 animate-pulse'
                  : 'bg-amber-950/60 hover:bg-amber-900/60 text-amber-200 border-amber-700/50'
              }`}
            >
              <Volume2 size={16} />
              <span>{isPlayingTone ? 'Playing Target Tone...' : '▶ Play Target Tone'}</span>
            </button>
          </div>

          {/* START / STOP MIC BUTTON */}
          <div className="bg-[#1C1713] border border-amber-900/50 p-5 rounded-2xl space-y-3">
            {!isListening ? (
              <button
                onClick={startTuner}
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-amber-950 font-black py-4 px-6 rounded-2xl text-sm flex items-center justify-center gap-3 transition-all shadow-xl hover:shadow-amber-500/20 cursor-pointer"
              >
                <Mic size={20} className="animate-pulse" />
                <span>START MIC TUNER (ማይክሮፎን አስጀምር)</span>
              </button>
            ) : (
              <button
                onClick={stopTuner}
                className="w-full bg-rose-700 hover:bg-rose-600 text-white font-black py-4 px-6 rounded-2xl text-sm flex items-center justify-center gap-3 transition-all shadow-xl cursor-pointer"
              >
                <MicOff size={20} />
                <span>STOP MIC TUNER (ማይክሮፎን አቁም)</span>
              </button>
            )}

            {/* AUDIO LEVEL BAR */}
            <div className="space-y-1 pt-1">
              <div className="flex justify-between text-[10px] font-mono font-bold text-amber-400">
                <span>SIGNAL LEVEL</span>
                <span>{isListening ? (signalRms > 0 ? `${Math.round(signalRms * 100)}%` : 'NO SOUND') : 'OFF'}</span>
              </div>
              <div className="w-full h-2 bg-amber-950 rounded-full overflow-hidden border border-amber-900/40">
                <div
                  className="h-full bg-gradient-to-r from-amber-600 via-amber-400 to-emerald-400 transition-all duration-75"
                  style={{ width: `${Math.min(100, signalRms * 400)}%` }}
                />
              </div>
            </div>
          </div>

          {/* SAVE CONFIGURATION BOX */}
          <div className="bg-[#1C1713] border border-amber-900/50 p-5 rounded-2xl space-y-3">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block font-mono">
              Save My Custom Tuning
            </span>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Preset Name (e.g. My Tizita A2)"
                value={newPresetName}
                onChange={(e) => setNewPresetName(e.target.value)}
                className="flex-1 bg-amber-950/60 border border-amber-800 rounded-xl px-3 py-2 text-xs text-amber-100 placeholder-amber-600 outline-none"
              />
              <button
                onClick={handleSaveTuning}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-amber-950 font-bold text-xs flex items-center gap-1 cursor-pointer"
              >
                <Save size={14} />
                Save
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 5. TUNING COMPLETE SUMMARY CARD MODAL */}
      <AnimatePresence>
        {isTuningComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 15 }}
              className="bg-[#1F1A15] border-2 border-emerald-500/60 p-8 rounded-3xl max-w-lg w-full text-center space-y-6 shadow-2xl relative"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-400 text-emerald-400 flex items-center justify-center mx-auto shadow-lg">
                <CheckCircle2 size={36} />
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-800">
                  TUNING COMPLETE • ቅኝቱ ተጠናቋል
                </span>
                <h3 className="font-display font-black text-2xl text-white">
                  {instrument.toUpperCase()} IS READY TO PLAY!
                </h3>
                <p className="text-xs text-amber-200/80 leading-relaxed">
                  All {playedStrings.length} played strings have been accurately tuned to <strong>{selectedTonic}{selectedOctave} ({currentPreset.scaleNameAmharic})</strong>.
                </p>
              </div>

              {/* Summary Strings Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-[#14100D] p-4 rounded-2xl text-left border border-amber-900/40 text-xs font-mono">
                {playedStrings.map((st) => (
                  <div key={st.stringNumber} className="flex items-center gap-1.5 text-emerald-300">
                    <Check size={14} className="text-emerald-400" />
                    <span>Str {st.stringNumber}: {st.noteName} ({st.targetFreq.toFixed(1)}Hz)</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-center gap-3 pt-2">
                <button
                  onClick={() => {
                    setIsTuningComplete(false);
                    setTunedStrings({});
                  }}
                  className="px-5 py-2.5 rounded-xl bg-amber-950/60 hover:bg-amber-900/60 border border-amber-800 text-amber-200 font-bold text-xs cursor-pointer"
                >
                  Tune Again
                </button>
                <button
                  onClick={() => setIsTuningComplete(false)}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg cursor-pointer"
                >
                  Start Playing Instrument
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 6. TUNER SETTINGS & TOLERANCE MODAL */}
      <AnimatePresence>
        {showSettingsModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              className="bg-[#1E1915] border border-amber-700/60 p-6 rounded-3xl max-w-md w-full text-amber-50 space-y-5 shadow-2xl"
            >
              <div className="flex justify-between items-center border-b border-amber-900/50 pb-3">
                <h4 className="font-display font-black text-lg text-amber-100 flex items-center gap-2">
                  <Sliders size={18} className="text-amber-400" />
                  Tuner Configuration Settings
                </h4>
                <button
                  onClick={() => setShowSettingsModal(false)}
                  className="text-amber-400 hover:text-white font-bold text-sm cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Reference Pitch A4 */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-amber-300 block">
                  Reference Pitch (A4 Benchmark): <strong>{refA4} Hz</strong>
                </label>
                <div className="flex gap-2">
                  {[432, 440, 442, 444].map((p) => (
                    <button
                      key={p}
                      onClick={() => setRefA4(p)}
                      className={`flex-1 py-1.5 rounded-lg border text-xs font-mono font-bold transition cursor-pointer ${
                        refA4 === p
                          ? 'bg-amber-500 text-amber-950 border-amber-300'
                          : 'bg-amber-950/40 text-amber-200 border-amber-900/40'
                      }`}
                    >
                      {p} Hz
                    </button>
                  ))}
                </div>
              </div>

              {/* In-Tune Tolerance Range */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-amber-300 block">
                  In-Tune Tolerance Window: <strong>±{toleranceCents} Cents</strong>
                </label>
                <div className="flex gap-2">
                  {[3, 5, 8, 10].map((t) => (
                    <button
                      key={t}
                      onClick={() => setToleranceCents(t)}
                      className={`flex-1 py-1.5 rounded-lg border text-xs font-mono font-bold transition cursor-pointer ${
                        toleranceCents === t
                          ? 'bg-amber-500 text-amber-950 border-amber-300'
                          : 'bg-amber-950/40 text-amber-200 border-amber-900/40'
                      }`}
                    >
                      ±{t} cents
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setShowSettingsModal(false)}
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-amber-950 font-bold text-xs cursor-pointer"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 7. SAVED TUNINGS MODAL */}
      <AnimatePresence>
        {showPresetManagerModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              className="bg-[#1E1915] border border-amber-700/60 p-6 rounded-3xl max-w-lg w-full text-amber-50 space-y-5 shadow-2xl"
            >
              <div className="flex justify-between items-center border-b border-amber-900/50 pb-3">
                <h4 className="font-display font-black text-lg text-amber-100 flex items-center gap-2">
                  <Bookmark size={18} className="text-amber-400" />
                  My Saved {instrument} Tunings
                </h4>
                <button
                  onClick={() => setShowPresetManagerModal(false)}
                  className="text-amber-400 hover:text-white font-bold text-sm cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {savedTunings.map((conf) => (
                  <div
                    key={conf.id}
                    className="flex items-center justify-between bg-amber-950/40 p-3.5 rounded-xl border border-amber-900/50 text-xs"
                  >
                    <div>
                      <span className="font-bold text-amber-200 block">{conf.name}</span>
                      <span className="text-[10px] text-amber-400/70 font-mono">
                        Tonic: {conf.tonic}{conf.octave} • Scale: {conf.scaleKey} • {conf.createdAt}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          handleLoadSavedTuning(conf);
                          setShowPresetManagerModal(false);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-amber-950 font-bold text-xs cursor-pointer"
                      >
                        Apply
                      </button>
                      <button
                        onClick={() => handleDeleteSavedTuning(conf.id)}
                        className="p-1.5 rounded-lg bg-rose-950 text-rose-300 hover:bg-rose-900 border border-rose-800 cursor-pointer"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setShowPresetManagerModal(false)}
                  className="px-5 py-2 rounded-xl bg-amber-950/60 text-amber-300 border border-amber-800 text-xs font-bold cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

