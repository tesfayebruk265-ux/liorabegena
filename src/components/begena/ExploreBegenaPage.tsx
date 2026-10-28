import React, { useState, useMemo } from 'react';
import {
  RotateCcw,
  Volume2,
  VolumeX,
  Play,
  CheckCircle2,
  HelpCircle,
  X,
  ArrowLeft,
  Eye,
  Layers,
  Sparkles,
  Maximize2
} from 'lucide-react';
import { Begena3DCanvas } from './Begena3DCanvas';
import { BEGENA_PARTS, CAMERA_PRESETS, BegenaPartInfo } from '../../data/begenaExplorerData';
import { begenaAudio } from './BegenaAudioEngine';
import { PageId } from '../../types';
import { TiletPattern } from '../TiletPattern';

interface ExploreBegenaPageProps {
  lang: 'en' | 'am';
  onNavigate: (page: PageId, params?: any) => void;
}

export const ExploreBegenaPage: React.FC<ExploreBegenaPageProps> = ({
  lang,
  onNavigate
}) => {
  const [selectedPartId, setSelectedPartId] = useState<string | null>(null);
  const [activePresetId, setActivePresetId] = useState<string>('full');
  const [isAutoRotate, setIsAutoRotate] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [activeFilterCategory, setActiveFilterCategory] = useState<string>('all');

  const selectedPart = useMemo(() => {
    if (!selectedPartId) return null;
    return BEGENA_PARTS.find((p) => p.id === selectedPartId) || null;
  }, [selectedPartId]);

  const handleSelectPart = (partId: string) => {
    setSelectedPartId(partId);
  };

  const handleResetCamera = () => {
    setSelectedPartId(null);
    setActivePresetId('full');
  };

  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    begenaAudio.setMuted(nextMuted);
  };

  const handlePlayString = (part: BegenaPartInfo) => {
    if (part.audioPitchHz) {
      begenaAudio.playString(part.audioPitchHz, true);
    } else {
      begenaAudio.playString(110.0, true);
    }
  };

  const filteredParts = useMemo(() => {
    if (activeFilterCategory === 'all') return BEGENA_PARTS;
    return BEGENA_PARTS.filter((p) => p.category === activeFilterCategory);
  }, [activeFilterCategory]);

  return (
    <div className="min-h-screen bg-[#FAF6EF] dark:bg-[#121214] text-[#2B2B2B] dark:text-[#F8F9FA] pb-16">
      {/* Top Banner / Breadcrumb Bar */}
      <div className="bg-white dark:bg-[#1C1C22] border-b border-[#E7DED1] dark:border-[#2E2E36] px-4 sm:px-8 py-3.5 shadow-xs sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('student')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FAF6EF] dark:bg-[#2A2A32] hover:bg-[#E7DED1] dark:hover:bg-[#34343F] text-xs font-bold text-gray-700 dark:text-gray-200 transition-colors cursor-pointer border border-[#E7DED1] dark:border-[#383844]"
              title="Return to Student Dashboard"
            >
              <ArrowLeft size={14} />
              <span>{lang === 'am' ? 'ወደ ዳሽቦርድ ተመለስ' : 'Back to Dashboard'}</span>
            </button>
            <div className="h-4 w-px bg-gray-300 dark:bg-gray-700 hidden sm:block" />
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#E89B52]">
                {lang === 'am' ? 'የተማሪ ፖርታል • 3D አሳሽ' : 'Student Portal • 3D Explorer'}
              </span>
              <h1 className="text-sm sm:text-base font-display font-black text-[#2B2B2B] dark:text-white flex items-center gap-2">
                <span>{lang === 'am' ? 'በገናን ያስሱ' : 'Explore the Begena'}</span>
                <span className="text-xs font-normal text-gray-500 font-sans">
                  {lang === 'am' ? '| Explore the Begena' : '| በገናን ያስሱ'}
                </span>
              </h1>
            </div>
          </div>

          {/* Quick Toolbar */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleMute}
              className={`p-2 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                isMuted
                  ? 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800 text-red-600'
                  : 'bg-white dark:bg-[#2A2A32] border-[#E7DED1] dark:border-[#383844] text-gray-700 dark:text-gray-200 hover:border-[#E89B52]'
              }`}
              title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
            >
              {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
            </button>

            <button
              onClick={() => setIsAutoRotate(!isAutoRotate)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border flex items-center gap-1.5 cursor-pointer ${
                isAutoRotate
                  ? 'bg-amber-100 dark:bg-amber-950/60 border-amber-300 text-amber-900 dark:text-amber-200'
                  : 'bg-white dark:bg-[#2A2A32] border-[#E7DED1] dark:border-[#383844] text-gray-700 dark:text-gray-200 hover:border-[#E89B52]'
              }`}
            >
              <RotateCcw size={13} className={isAutoRotate ? 'animate-spin' : ''} />
              <span className="hidden sm:inline">
                {isAutoRotate ? (lang === 'am' ? 'ማሽከርከር አቁም' : 'Stop Rotate') : (lang === 'am' ? 'አሽከርክር' : 'Auto Rotate')}
              </span>
            </button>

            <button
              onClick={handleResetCamera}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#E89B52] hover:bg-amber-600 text-white transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw size={13} />
              <span>{lang === 'am' ? 'እይታን ዳግም ጀምር' : 'Reset View'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-6 space-y-6">
        
        {/* Intro Hero Header Banner */}
        <div className="bg-white dark:bg-[#1C1C22] border border-[#E7DED1] dark:border-[#2E2E36] rounded-2xl p-5 sm:p-6 relative overflow-hidden shadow-xs">
          <div className="absolute top-0 right-0 w-32 h-32 opacity-5 pointer-events-none">
            <TiletPattern />
          </div>
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-900 dark:text-amber-200 bg-amber-100 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/60 px-2 py-0.5 rounded">
                  {lang === 'am' ? 'ይነኩ • ያሽከርክሩ • ያደምጡ' : 'Interactive 3D Study'}
                </span>
                <span className="text-[10px] font-mono text-gray-500">
                  {lang === 'am' ? 'ትክክለኛ የኢትዮጵያ በገና' : 'Authentic Ethiopian Begena Model'}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black font-display text-[#2B2B2B] dark:text-white">
                {lang === 'am' ? 'የበገናው ክፍሎችና ድምፃዊ ቅርጽ' : 'Explore the Anatomy of the Begena'}
              </h2>
              <p className="text-xs text-gray-600 dark:text-gray-400 max-w-2xl leading-relaxed">
                {lang === 'am'
                  ? 'ይህ በ3D የተዘጋጀ የበገና መሣሪያ ትክክለኛውን የኢትዮጵያ በገና ቅርጽ፣ አሥሩን አውታሮች፣ ጠመዝማዛ ምሰሶዎቹንና የፈረሱን እንዚራ በቅርበት ለማጥናት የሚያስችል ነው። ማንኛውንም ክፍል በመንካት ስሙን፣ ተግባሩንና ድምፁን ይመልከቱ።'
                  : 'An accurate 3D representation of the sacred Ethiopian Begena lyre. Click any component or string to inspect its verified name in English & Amharic, understand its acoustic function, and experience its sound.'}
              </p>
            </div>

            {/* Quick Camera Preset Pills */}
            <div className="flex flex-wrap items-center gap-1.5 self-start md:self-auto">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mr-1">
                {lang === 'am' ? 'የእይታ አንግል፡' : 'Views:'}
              </span>
              {CAMERA_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => {
                    setSelectedPartId(null);
                    setActivePresetId(preset.id);
                  }}
                  className={`px-2.5 py-1 text-xs rounded-md font-semibold transition-all cursor-pointer ${
                    activePresetId === preset.id && !selectedPartId
                      ? 'bg-amber-900 text-white shadow-xs'
                      : 'bg-white dark:bg-[#2A2A32] border border-[#E7DED1] dark:border-[#383844] text-gray-700 dark:text-gray-300 hover:border-amber-400'
                  }`}
                >
                  {lang === 'am' ? preset.labelAm : preset.labelEn}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 3D VIEWER + INSPECTOR WORKSPACE GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT: 3D VIEWPORT (Large Focus Area) */}
          <div className="lg:col-span-8 flex flex-col space-y-3">
            {/* Top Interactive Guidance Ribbon */}
            <div className="bg-gradient-to-r from-amber-500/15 via-[#E89B52]/10 to-transparent dark:from-amber-950/60 dark:via-[#25252D] border border-amber-300/60 dark:border-amber-800/60 rounded-xl px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#E89B52] animate-pulse" />
                <span className="text-xs sm:text-sm font-bold text-amber-900 dark:text-amber-200">
                  {lang === 'am' ? 'ስሙንና አገልግሎቱን ለማወቅ በበገናው ክፍሎች ላይ ይጫኑ።' : 'Click any part to learn its name and function.'}
                </span>
              </div>
              <button
                onClick={() => {
                  setSelectedPartId(null);
                  setActivePresetId('full');
                }}
                className="px-3 py-1 bg-white/80 dark:bg-black/40 hover:bg-white dark:hover:bg-black/60 border border-amber-300 dark:border-amber-800/80 rounded-lg text-xs font-bold text-amber-900 dark:text-amber-200 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                title={lang === 'am' ? 'ሙሉ በገናውን አሳይ' : 'Show Entire Begena'}
              >
                <RotateCcw size={13} />
                <span>{lang === 'am' ? 'ሙሉ በገናውን አሳይ' : 'Show Entire Begena'}</span>
              </button>
            </div>

            <div className="relative w-full h-[560px] sm:h-[660px] lg:h-[730px] rounded-2xl overflow-hidden shadow-lg border border-[#E7DED1] dark:border-[#2E2E36] bg-[#141210]">
              <Begena3DCanvas
                selectedPartId={selectedPartId}
                onSelectPart={handleSelectPart}
                activePresetId={activePresetId}
                isAutoRotate={isAutoRotate}
              />

              {/* Bottom In-Viewport Quick String Plucker Bar */}
              <div className="absolute bottom-3 left-3 right-3 z-10 bg-black/75 backdrop-blur-md border border-white/10 rounded-xl p-2.5 flex items-center justify-between gap-2 overflow-x-auto">
                <div className="flex items-center gap-1.5 shrink-0 pl-1">
                  <Sparkles size={14} className="text-amber-400" />
                  <span className="text-[11px] font-bold text-white uppercase tracking-wider">
                    {lang === 'am' ? 'ትዝታ ቅኝት (አውታሮች)፡' : 'Tizta Strings:'}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
                    const stringId = `string_${num}`;
                    const isSelected = selectedPartId === stringId;
                    const part = BEGENA_PARTS.find((p) => p.id === stringId);

                    return (
                      <button
                        key={num}
                        onClick={() => {
                          setSelectedPartId(stringId);
                          if (part) handlePlayString(part);
                        }}
                        className={`min-w-[34px] sm:min-w-[40px] px-1.5 py-1 rounded-lg text-xs font-mono font-bold flex flex-col items-center justify-center transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#E89B52] text-white scale-105 shadow-md ring-2 ring-amber-300'
                            : 'bg-white/10 hover:bg-white/20 text-white/90 border border-white/10'
                        }`}
                        title={part ? `${part.nameEn} • ${part.audioPitchHz} Hz` : `String ${num}`}
                      >
                        <span className="text-[11px] leading-tight font-black">{num}</span>
                        {part?.noteName && (
                          <span className={`text-[9px] font-mono leading-none ${isSelected ? 'text-amber-100 font-bold' : 'text-amber-300/80 font-normal'}`}>
                            {part.noteName}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Instruction strip beneath viewport */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-gray-500 dark:text-gray-400 px-2">
              <div className="flex items-center gap-2">
                <Eye size={14} className="text-[#E89B52]" />
                <span>
                  {lang === 'am'
                    ? 'የበገናውን አካላት (ምሰሶ፣ ፈረስ፣ እንዚራ፣ ሣጥን፣ ዋግ፣ መቃኛ) በቀጥታ በሞዴሉ ላይ ጠቅ በማድረግ መርምሩ'
                    : 'Click directly on any 3D component (pillars, bridge, inzira, soundbox, tailpiece, pegs) to focus & inspect'}
                </span>
              </div>
              <div className="flex items-center gap-1 text-[11px] font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Verified Master Luthier Data</span>
              </div>
            </div>
          </div>

          {/* RIGHT: CONTEXTUAL INFORMATION PANEL & EXPLORER */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* If a part is currently selected: Full detail card */}
            {selectedPart ? (
              <div className="bg-white dark:bg-[#1C1C22] border-2 border-[#E89B52] rounded-2xl p-6 space-y-5 shadow-lg relative animate-in fade-in zoom-in-95 duration-200">
                {/* Close Button */}
                <button
                  onClick={() => {
                    setSelectedPartId(null);
                    setActivePresetId('full');
                  }}
                  className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 hover:text-gray-800 transition cursor-pointer"
                  title="Close Inspector"
                >
                  <X size={16} />
                </button>

                {/* Header: English Name and Amharic Name */}
                <div className="space-y-1.5 pr-6 border-b border-[#E7DED1] dark:border-[#2E2E36] pb-3">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 px-2 py-0.5 rounded-full w-fit">
                    <CheckCircle2 size={11} />
                    <span>
                      {selectedPart.isVerified
                        ? selectedPart.verificationBadge
                        : (lang === 'am' ? 'የሊቃውንት ማረጋገጫ በመጠባበቅ ላይ' : 'Name awaiting teacher verification')}
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-display font-black text-[#2B2B2B] dark:text-white uppercase tracking-tight">
                    {selectedPart.nameEn}
                  </h3>
                  <div className="text-base sm:text-lg font-bold text-[#E89B52] flex items-center gap-2">
                    <span>{selectedPart.nameAm}</span>
                    {selectedPart.phoneticAm && (
                      <span className="text-xs font-normal text-gray-500 font-mono">
                        ({selectedPart.phoneticAm})
                      </span>
                    )}
                  </div>
                </div>

                {/* Structured Educational Information (Function, Location, Learning Tip) */}
                <div className="space-y-3 text-xs">
                  {/* Function */}
                  <div className="p-3.5 bg-[#FAF6EF] dark:bg-[#25252D] rounded-xl border border-[#E7DED1] dark:border-[#383844] space-y-1">
                    <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400 text-[11px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#E89B52]" />
                      <span>{lang === 'am' ? 'ተግባር (Function)፡' : 'Function:'}</span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 font-medium leading-relaxed pl-2.5">
                      {lang === 'am' ? selectedPart.functionAm : selectedPart.functionEn}
                    </p>
                  </div>

                  {/* Location */}
                  <div className="p-3.5 bg-[#FAF6EF] dark:bg-[#25252D] rounded-xl border border-[#E7DED1] dark:border-[#383844] space-y-1">
                    <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400 text-[11px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#E89B52]" />
                      <span>{lang === 'am' ? 'ቦታ (Location)፡' : 'Location:'}</span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 font-medium leading-relaxed pl-2.5">
                      {lang === 'am' ? selectedPart.locationAm : selectedPart.locationEn}
                    </p>
                  </div>

                  {/* Learning Tip */}
                  <div className="p-3.5 bg-amber-50/70 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-800/60 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-amber-900 dark:text-amber-300 text-[11px]">
                      <Sparkles size={12} className="text-amber-500" />
                      <span>{lang === 'am' ? 'የተማሪዎች ማስታወሻ (Learning Tip)፡' : 'Learning tip:'}</span>
                    </div>
                    <p className="text-amber-900 dark:text-amber-200 leading-relaxed pl-2.5 font-medium">
                      {lang === 'am' ? selectedPart.learningTipAm : selectedPart.learningTipEn}
                    </p>
                  </div>
                </div>

                {/* Spiritual Symbolism (if available from master teacher) */}
                {(selectedPart.spiritualMeaningEn || selectedPart.spiritualMeaningAm) && (
                  <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-xl space-y-1 text-xs">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-amber-900 dark:text-amber-300 flex items-center gap-1">
                      <Sparkles size={11} />
                      {lang === 'am' ? 'መንፈሳዊ ምሳሌነት፡' : 'Spiritual Significance:'}
                    </span>
                    <p className="text-amber-800 dark:text-amber-200 italic leading-relaxed">
                      {lang === 'am' ? selectedPart.spiritualMeaningAm : selectedPart.spiritualMeaningEn}
                    </p>
                  </div>
                )}

                {/* Tizta Scale String Detail & Audio Panel */}
                {selectedPart.audioPitchHz && (
                  <div className="pt-2 border-t border-[#E7DED1] dark:border-[#2E2E36] space-y-3">
                    <div className="p-4 bg-gradient-to-br from-amber-500/10 via-amber-600/5 to-transparent dark:from-amber-500/20 dark:via-[#25252D] dark:to-[#1C1C22] border border-[#E89B52]/40 rounded-xl space-y-3 shadow-inner">
                      {/* String Number & Scale Mode Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-1 rounded-md bg-[#E89B52] text-white font-mono text-xs font-bold uppercase tracking-wider shadow-xs">
                            {selectedPart.stringNumber
                              ? (lang === 'am' ? `${selectedPart.stringNumber}ኛ አውታር` : `String ${selectedPart.stringNumber}`)
                              : selectedPart.nameEn}
                          </span>
                          <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-400 font-mono">
                            {selectedPart.scaleMode || 'Tizta'} Scale
                          </span>
                        </div>
                        <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/70 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-300">
                          {selectedPart.audioPitchHz.toFixed(2)} Hz
                        </span>
                      </div>

                      {/* Musical Note & Frequency Row with Play Note button */}
                      <div className="flex items-center justify-between pt-1 gap-3">
                        <div>
                          <div className="text-[10px] uppercase font-bold tracking-wider text-gray-500 dark:text-gray-400">
                            {lang === 'am' ? 'የዜማ ድምፅ (Musical Note)፡' : 'Musical Note:'}
                          </div>
                          <div className="text-2xl sm:text-3xl font-mono font-black text-[#E89B52] flex items-baseline gap-2">
                            <span>{selectedPart.noteName}</span>
                            <span className="text-xs font-mono font-semibold text-gray-500 dark:text-gray-400">
                              {selectedPart.audioPitchHz.toFixed(2)} Hz
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => handlePlayString(selectedPart)}
                          className="px-4 py-2.5 bg-[#E89B52] hover:bg-amber-600 active:scale-95 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-md hover:shadow-amber-500/30 cursor-pointer shrink-0"
                          title={lang === 'am' ? `${selectedPart.nameAm} ድምፅ አድምጥ` : `Play ${selectedPart.nameEn} (${selectedPart.audioPitchHz} Hz)`}
                        >
                          <Play size={14} className="fill-white" />
                          <span>{lang === 'am' ? 'ድምፅ አድምጥ' : 'Play Note'}</span>
                        </button>
                      </div>

                      {/* Student note info tip */}
                      <div className="text-[11px] text-gray-500 dark:text-gray-400 italic flex items-center justify-between border-t border-[#E7DED1]/60 dark:border-[#383844]/60 pt-2">
                        <span>
                          {lang === 'am'
                            ? 'በትዝታ ቅኝት የተመደበ ትክክለኛ የድምፅ እርከን'
                            : 'Authoritative Tizta scale equal-tempered pitch assignment'}
                        </span>
                        <Volume2 size={13} className="text-amber-500 shrink-0 ml-2" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Show Entire Begena Reset Button inside card */}
                <button
                  onClick={() => {
                    setSelectedPartId(null);
                    setActivePresetId('full');
                  }}
                  className="w-full py-2.5 px-4 bg-gray-100 hover:bg-gray-200 dark:bg-[#25252D] dark:hover:bg-[#2E2E36] text-gray-700 dark:text-gray-300 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer border border-[#E7DED1] dark:border-[#383844] mt-2 shadow-xs"
                >
                  <RotateCcw size={14} className="text-[#E89B52]" />
                  <span>{lang === 'am' ? 'ሙሉ በገናውን አሳይ (Show Entire Begena)' : 'Show Entire Begena'}</span>
                </button>
              </div>
            ) : (
              // Default state: Part directory / selector
              <div className="bg-white dark:bg-[#1C1C22] border border-[#E7DED1] dark:border-[#2E2E36] rounded-2xl p-5 space-y-4 shadow-xs">
                <div>
                  <h3 className="text-sm font-display font-black uppercase text-[#2B2B2B] dark:text-white tracking-wider flex items-center gap-2">
                    <Layers size={16} className="text-[#E89B52]" />
                    <span>{lang === 'am' ? 'የበገናው ክፍሎች ማውጫ' : 'Instrument Component Index'}</span>
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {lang === 'am'
                      ? 'ከታች ካሉት ክፍሎች አንዱን በመምረጥ በ3D እይታው ላይ በቅርበት ይመልከቱ።'
                      : 'Select any part below to automatically glide the camera and inspect detailed characteristics.'}
                  </p>
                </div>

                {/* Category Filter Pills */}
                <div className="flex border-b border-[#E7DED1] dark:border-[#2E2E36] gap-1 pb-2 overflow-x-auto text-xs">
                  {[
                    { id: 'all', label: lang === 'am' ? 'ሁሉም' : 'All' },
                    { id: 'structure', label: lang === 'am' ? 'መዋቅር' : 'Frame' },
                    { id: 'acoustic', label: lang === 'am' ? 'ድምፅ' : 'Acoustic' },
                    { id: 'strings', label: lang === 'am' ? 'ክሮች' : 'Strings' },
                    { id: 'tuning', label: lang === 'am' ? 'መቃኛ' : 'Tuning' }
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveFilterCategory(cat.id)}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap ${
                        activeFilterCategory === cat.id
                          ? 'bg-[#E89B52] text-white'
                          : 'bg-gray-100 dark:bg-[#2A2A32] text-gray-700 dark:text-gray-300 hover:bg-gray-200'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                {/* Part Items List */}
                <div className="space-y-1.5 max-h-[460px] overflow-y-auto pr-1">
                  {filteredParts.map((part) => (
                    <button
                      key={part.id}
                      onClick={() => handleSelectPart(part.id)}
                      className="w-full text-left p-3 rounded-xl border border-[#E7DED1] dark:border-[#2E2E36] hover:border-[#E89B52] bg-[#FAF6EF]/50 dark:bg-[#25252D]/50 hover:bg-[#FAF6EF] dark:hover:bg-[#25252D] transition-all flex items-center justify-between group cursor-pointer"
                    >
                      <div className="space-y-0.5">
                        <div className="text-xs font-bold text-[#2B2B2B] dark:text-white group-hover:text-[#E89B52]">
                          {part.nameEn}
                        </div>
                        <div className="text-[11px] text-gray-500 font-medium">
                          {part.nameAm}
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {part.audioPitchHz && (
                          <span className="text-[10px] font-mono font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-1.5 py-0.5 rounded">
                            {part.noteName}
                          </span>
                        )}
                        <Maximize2 size={13} className="text-gray-400 group-hover:text-[#E89B52]" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Cultural & Master Luthier Note Box */}
            <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-2xl p-4 text-xs space-y-2 text-amber-900 dark:text-amber-200">
              <div className="flex items-center gap-2 font-bold text-amber-800 dark:text-amber-300">
                <HelpCircle size={15} />
                <span>{lang === 'am' ? 'የሊቃውንት ትውፊት ማስታወሻ' : 'Traditional Luthier Heritage'}</span>
              </div>
              <p className="leading-relaxed text-amber-800 dark:text-amber-200/90 text-[11px]">
                {lang === 'am'
                  ? 'የበገና የድምፅ ማጉያ ሣጥን፣ ሁለቱ ጠመዝማዛ ምሰሶዎችና መስቀያው ከደረቅ የወይራ፣ የዋንዛ ወይም የዝግባ እንጨት የሚዘጋጁ ሲሆን፤ የአውታሮቹ የብርዝ ንዝረት የሚመነጨው በፈረሱ ላይ በሚሰኩት ጥቃቅን የቆዳ እንዚራዎች አማካኝነት ነው።'
                  : 'The Begena is traditionally hand-crafted from indigenous Ethiopian hardwoods (such as Wanza, Weira, or Zigba). The unmistakable contemplative buzzing overtone is produced by microscopic air gaps between the vibrating gut string and the leather Inzira buffers seated upon the Feres bridge.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
