import React, { useState, useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  Volume2,
  FileText,
  Calendar,
  Clock,
  ChevronRight,
  ChevronDown,
  Search,
  Mail,
  Phone,
  Lock,
  User,
  Check,
  X,
  AlertCircle,
  AlertTriangle,
  Info,
  Sparkles,
  Upload,
  Music,
  BookOpen,
  Heart,
  Share2,
  ShoppingBag,
  Filter,
  Settings,
  LogOut,
  Bell,
  Menu,
  ArrowRight,
  Award,
  Activity,
  FileCheck,
  Eye,
  EyeOff,
  ChevronLeft,
  DollarSign
} from 'lucide-react';
import { TiletPattern } from './TiletPattern';

// ==========================================
// 1. BUTTONS COMPONENT
// ==========================================
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'ghost' | 'destructive' | 'icon' | 'loading';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  forceState?: 'default' | 'hover' | 'active' | 'focus' | 'disabled';
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  forceState,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const isButtonDisabled = disabled || forceState === 'disabled' || variant === 'loading' || isLoading;

  // Base typography & layout
  const baseStyle = "inline-flex items-center justify-center font-sans font-semibold rounded-md transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 select-none text-center btn-interactive";

  // Size styles
  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs gap-1.5 h-8",
    md: "px-5 py-2.5 text-sm gap-2 h-10",
    lg: "px-7 py-3.5 text-base gap-2.5 h-12 rounded-lg"
  };

  // State override classes or normal dynamic pseudo-classes
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        if (forceState === 'hover') return "bg-[#D88A42] text-white shadow-sm";
        if (forceState === 'active') return "bg-[#C47832] text-white scale-[0.98]";
        if (forceState === 'focus') return "bg-[#E89B52] text-white ring-2 ring-[#C79A2B] ring-offset-2";
        return "bg-[#E89B52] hover:bg-[#D88A42] active:bg-[#C47832] text-white shadow-sm focus:ring-[#C79A2B]";
      
      case 'secondary':
        if (forceState === 'hover') return "bg-[#FAF6EF] border-[#C79A2B] text-[#C79A2B]";
        if (forceState === 'active') return "bg-[#FAF6EF] border-[#C47832] text-[#C47832] scale-[0.98]";
        if (forceState === 'focus') return "bg-white border-[#C79A2B] text-[#C79A2B] ring-2 ring-[#C79A2B]";
        return "bg-white hover:bg-[#FAF6EF] active:bg-[#FAF6EF]/80 text-[#C79A2B] border border-[#E7DED1] hover:border-[#C79A2B] focus:ring-[#C79A2B]";
      
      case 'tertiary':
        if (forceState === 'hover') return "bg-[#FAF6EF] text-[#6F4E37]";
        if (forceState === 'active') return "bg-[#E7DED1] text-[#6F4E37] scale-[0.98]";
        return "bg-transparent text-[#6F4E37] hover:bg-[#FAF6EF] active:bg-[#E7DED1] border border-[#E7DED1] focus:ring-[#6F4E37]";

      case 'destructive':
        if (forceState === 'hover') return "bg-red-600 text-white";
        if (forceState === 'active') return "bg-red-700 text-white scale-[0.98]";
        return "bg-red-500 hover:bg-red-600 active:bg-red-700 text-white focus:ring-red-500";

      case 'ghost':
        if (forceState === 'hover') return "bg-[#FAF6EF] text-[#2B2B2B]";
        return "bg-transparent text-[#666666] hover:bg-[#FAF6EF] hover:text-[#2B2B2B] focus:ring-[#E7DED1]";

      case 'icon':
        return "p-2 bg-white hover:bg-[#FAF6EF] border border-[#E7DED1] text-[#666666] hover:text-[#2B2B2B] rounded-md focus:ring-[#C79A2B]";

      case 'loading':
      default:
        return "bg-[#E89B52]/75 text-white cursor-wait";
    }
  };

  const disabledStyles = "opacity-50 cursor-not-allowed active:scale-100 pointer-events-none";

  return (
    <button
      className={`${baseStyle} ${sizeStyles[size]} ${getVariantStyles()} ${isButtonDisabled ? disabledStyles : ''} ${className}`}
      disabled={isButtonDisabled}
      {...props}
    >
      {(isLoading || variant === 'loading') && (
        <svg className="animate-spin -ml-1 mr-2 h-4 width-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {!isLoading && variant !== 'loading' && leftIcon && <span className="inline-flex">{leftIcon}</span>}
      <span>{children}</span>
      {!isLoading && variant !== 'loading' && rightIcon && <span className="inline-flex">{rightIcon}</span>}
    </button>
  );
}


// ==========================================
// 2. INPUT FIELDS COMPONENT
// ==========================================
interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  helperText?: string;
  errorMessage?: string;
  successMessage?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  forceState?: 'default' | 'focus' | 'filled' | 'error' | 'success' | 'disabled';
}

export function Input({
  label,
  helperText,
  errorMessage,
  successMessage,
  leftIcon,
  rightIcon,
  forceState,
  className = '',
  disabled,
  ...props
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const isInputDisabled = disabled || forceState === 'disabled';

  const getInputClasses = () => {
    let classes = "w-full bg-white font-sans text-sm text-[#2B2B2B] rounded-md border border-[#E7DED1] py-2.5 transition-all duration-200 outline-none placeholder-[#9E9E9E]";

    // Left padding adjustments
    if (leftIcon) classes += " pl-10";
    else classes += " pl-4";

    // Right padding adjustments
    if (rightIcon) classes += " pr-10";
    else classes += " pr-4";

    // State Styles
    if (isInputDisabled) {
      classes += " bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed";
    } else if (errorMessage || forceState === 'error') {
      classes += " border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500";
    } else if (successMessage || forceState === 'success') {
      classes += " border-green-500 focus:border-green-500 focus:ring-1 focus:ring-green-500";
    } else if (isFocused || forceState === 'focus') {
      classes += " border-[#C79A2B] ring-1 ring-[#C79A2B] shadow-sm";
    } else if (forceState === 'filled') {
      classes += " border-[#E7DED1] bg-[#FAF6EF]/30 font-medium";
    } else {
      classes += " hover:border-[#C79A2B]/60 focus:border-[#C79A2B] focus:ring-1 focus:ring-[#C79A2B]";
    }

    return classes;
  };

  return (
    <div className={`w-full text-left font-sans ${className}`}>
      {label && (
        <label className="block text-xs font-semibold uppercase tracking-wider text-[#2B2B2B] mb-1.5 select-none">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {leftIcon && (
          <div className="absolute left-3.5 text-[#9E9E9E] pointer-events-none">
            {leftIcon}
          </div>
        )}
        
        <input
          className={getInputClasses()}
          disabled={isInputDisabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />

        {rightIcon && (
          <div className="absolute right-3.5 text-[#9E9E9E] flex items-center justify-center z-10">
            {rightIcon}
          </div>
        )}
      </div>

      {errorMessage && (
        <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1 select-none">
          <AlertCircle size={12} /> {errorMessage}
        </p>
      )}
      {!errorMessage && successMessage && (
        <p className="mt-1.5 text-xs text-green-600 flex items-center gap-1 select-none">
          <Check size={12} /> {successMessage}
        </p>
      )}
      {!errorMessage && !successMessage && helperText && (
        <p className="mt-1.5 text-xs text-[#666666] select-none">
          {helperText}
        </p>
      )}
    </div>
  );
}


// ==========================================
// 3. SELECTION CONTROLS COMPONENT
// ==========================================
export function Toggle({ label, checked, onChange, disabled = false }: { label: string; checked: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
  return (
    <label className={`flex items-center gap-3 cursor-pointer select-none ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
      <div className="relative">
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
        />
        <div className={`w-10 h-6 rounded-full transition-colors ${checked ? 'bg-[#E89B52]' : 'bg-[#E7DED1]'}`} />
        <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform shadow ${checked ? 'translate-x-4' : 'translate-x-0'}`} />
      </div>
      <span className="text-sm font-medium text-[#2B2B2B]">{label}</span>
    </label>
  );
}

export function Checkbox({ label, checked, onChange, disabled = false }: { label: string; checked: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
  return (
    <label className={`flex items-center gap-2.5 cursor-pointer select-none ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
      />
      <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${checked ? 'bg-[#E89B52] border-[#E89B52] text-white' : 'border-[#E7DED1] bg-white hover:border-[#C79A2B]'}`}>
        {checked && <Check size={14} strokeWidth={3} />}
      </div>
      <span className="text-sm font-medium text-[#2B2B2B]">{label}</span>
    </label>
  );
}

export function Radio({ label, checked, onChange, disabled = false }: { label: string; checked: boolean; onChange: () => void; disabled?: boolean }) {
  return (
    <label className={`flex items-center gap-2.5 cursor-pointer select-none ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
      <input
        type="radio"
        className="sr-only"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
      />
      <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${checked ? 'border-[#E89B52] bg-white' : 'border-[#E7DED1] bg-white'}`}>
        {checked && <div className="w-2.5 h-2.5 rounded-full bg-[#E89B52]" />}
      </div>
      <span className="text-sm font-medium text-[#2B2B2B]">{label}</span>
    </label>
  );
}


// ==========================================
// 4. CARDS COMPONENT
// ==========================================
export function CourseCard({
  title,
  instrument,
  duration,
  lessons,
  level,
  price,
  rating,
  imageUrl,
  onActionClick
}: {
  title: string;
  instrument: string;
  duration: string;
  lessons: number;
  level: string;
  price: string;
  rating: number;
  imageUrl: string;
  onActionClick?: () => void;
}) {
  return (
    <div className="group bg-white border border-[#E7DED1] rounded-xl overflow-hidden shadow-sm hover:shadow-lg card-interactive flex flex-col text-left">
      {/* Visual Thumbnail */}
      <div className="relative aspect-video bg-[#FAF6EF] overflow-hidden img-zoom-wrapper">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-700 ease-out"
            onError={(e) => {
              // fallback if network fails
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=600&auto=format&fit=crop';
            }}
          />
        ) : (
          <div className="w-full h-full bg-[#FAF6EF] flex items-center justify-center text-[#E89B52] font-bold text-sm">
            {title}
          </div>
        )}
        <div className="absolute top-3 left-3 bg-[#2B2B2B]/90 backdrop-blur-xs text-white text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded shadow-sm">
          {instrument}
        </div>
        <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-xs text-[#2B2B2B] text-xs font-semibold px-2.5 py-1 rounded shadow-sm">
          {price}
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col">
        {/* Rating and Level */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#C79A2B] bg-[#FAF6EF] px-2 py-0.5 rounded">
            {level}
          </span>
          <div className="flex items-center gap-1 text-xs font-medium text-[#2B2B2B]">
            <span className="text-[#C79A2B]">★</span>
            <span>{rating.toFixed(1)}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="font-display font-bold text-lg text-[#2B2B2B] mb-2 line-clamp-1 group-hover:text-[#E89B52] transition-colors">
          {title}
        </h3>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 py-3 border-t border-b border-[#FAF6EF] my-3 text-xs text-[#666666]">
          <div className="flex items-center gap-1.5">
            <Clock size={14} className="text-[#9E9E9E]" />
            <span>{duration}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <BookOpen size={14} className="text-[#9E9E9E]" />
            <span>{lessons} Lessons</span>
          </div>
        </div>

        {/* Footer & CTA */}
        <div className="mt-auto pt-2 flex items-center justify-between">
          <div className="text-xs text-[#666666]">
            By Abel Begena Masters
          </div>
          <button
            onClick={onActionClick}
            className="text-sm font-semibold text-[#E89B52] hover:text-[#C79A2B] flex items-center gap-1 group/btn cursor-pointer transition-colors"
          >
            <span>Explore Syllabus</span>
            <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}


// ==========================================
// 5. DATA COMPONENT - STATS CARD
// ==========================================
export function StatsCard({
  title,
  value,
  change,
  isPositive = true,
  icon: Icon
}: {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  icon: any;
}) {
  return (
    <div className="bg-white border border-[#E7DED1] rounded-xl p-5 text-left flex items-start justify-between shadow-xs">
      <div>
        <span className="text-xs font-semibold uppercase tracking-wider text-[#666666]">
          {title}
        </span>
        <h4 className="text-2xl font-display font-bold text-[#2B2B2B] mt-1">
          {value}
        </h4>
        {change && (
          <div className="flex items-center gap-1 mt-2">
            <span className={`text-xs font-bold ${isPositive ? 'text-green-600' : 'text-red-500'}`}>
              {isPositive ? '↑' : '↓'} {change}
            </span>
            <span className="text-[10px] text-[#9E9E9E]">vs last cohort</span>
          </div>
        )}
      </div>
      <div className="p-2.5 bg-[#FAF6EF] text-[#6F4E37] rounded-lg">
        <Icon size={20} />
      </div>
    </div>
  );
}


// ==========================================
// 6. SPECIALIZED LEARNING WORKFLOW - AUDIO PRACTICE PLAYER
// ==========================================
export function InteractivePracticePlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1.0);
  const [loopType, setLoopType] = useState<'all' | 'one' | 'none'>('all');
  const [activeTab, setActiveTab] = useState<'begena-pentatonic' | 'tizita' | 'anchihoye'>('begena-pentatonic');
  const [practiceTime, setPracticeTime] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setPracticeTime((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remaining.toString().padStart(2, '0')}`;
  };

  const getTrackDescription = () => {
    switch (activeTab) {
      case 'tizita':
        return "Tizita Major Scale (Krar accompaniment loop, 10 notes pentatonic, standard Amharic traditional scale)";
      case 'anchihoye':
        return "Anchi Hoye Scale (Washint drone background, spiritual liturgy frequency, microtonal markers)";
      case 'begena-pentatonic':
      default:
        return "Begena Sacred 10-String Buzz Loop (Pentatonic, 112Hz deep buzz, meditative prayer speed)";
    }
  };

  return (
    <div className="bg-[#FAF6EF] border border-[#E7DED1] rounded-xl overflow-hidden p-6 text-left shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5 pb-4 border-b border-[#E7DED1]">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#C79A2B] bg-white px-2 py-0.5 rounded border border-[#E7DED1]">
            Interactive Practice Companion
          </span>
          <h4 className="font-display font-bold text-xl text-[#2B2B2B] mt-1">
            Traditional Drone Accompaniment
          </h4>
        </div>
        
        {/* Practice Timer Badge */}
        <div className="flex items-center gap-2 bg-white border border-[#E7DED1] px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#2B2B2B]">
          <Activity size={14} className="text-green-500 animate-pulse" />
          <span>Practice: <span className="font-mono text-sm">{formatTime(practiceTime)}</span></span>
        </div>
      </div>

      {/* Tabs for Traditional Scales */}
      <div className="flex gap-2 mb-4 bg-white/70 p-1 rounded-md border border-[#E7DED1]/60">
        <button
          onClick={() => { setActiveTab('begena-pentatonic'); setIsPlaying(false); }}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-sm transition-colors cursor-pointer ${activeTab === 'begena-pentatonic' ? 'bg-[#6F4E37] text-white' : 'text-[#666666] hover:bg-white hover:text-[#2B2B2B]'}`}
        >
          Begena Buzz (10-String)
        </button>
        <button
          onClick={() => { setActiveTab('tizita'); setIsPlaying(false); }}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-sm transition-colors cursor-pointer ${activeTab === 'tizita' ? 'bg-[#6F4E37] text-white' : 'text-[#666666] hover:bg-white hover:text-[#2B2B2B]'}`}
        >
          Tizita (Krar Scale)
        </button>
        <button
          onClick={() => { setActiveTab('anchihoye'); setIsPlaying(false); }}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-sm transition-colors cursor-pointer ${activeTab === 'anchihoye' ? 'bg-[#6F4E37] text-white' : 'text-[#666666] hover:bg-white hover:text-[#2B2B2B]'}`}
        >
          Anchi Hoye (Sacred)
        </button>
      </div>

      <div className="bg-white rounded-lg p-5 border border-[#E7DED1] mb-5">
        <div className="flex items-center gap-3.5 mb-3">
          <div className="p-3 bg-[#FAF6EF] text-[#E89B52] rounded-md animate-pulse">
            <Music size={20} />
          </div>
          <div>
            <span className="text-[10px] font-bold tracking-wider text-[#9E9E9E] uppercase">
              Current Loop Template
            </span>
            <p className="text-sm font-semibold text-[#2B2B2B] line-clamp-1">
              {getTrackDescription()}
            </p>
          </div>
        </div>

        {/* Visualized Waveform */}
        <div className="h-12 flex items-end gap-1.5 my-5 px-1 bg-[#FAF6EF]/50 rounded-md border border-[#E7DED1]/30 justify-center">
          {[12, 24, 38, 16, 22, 45, 18, 30, 48, 56, 32, 10, 24, 40, 52, 28, 18, 36, 44, 20, 15, 34, 40, 12, 18, 30, 46, 22, 10, 8].map((val, i) => (
            <span
              key={i}
              className={`w-1 rounded-t-sm transition-all duration-300 ${isPlaying ? 'bg-[#E89B52]' : 'bg-[#E7DED1]'}`}
              style={{
                height: `${isPlaying ? Math.max(4, val * (0.4 + Math.random() * 0.6)) : 8}px`,
                animationDelay: `${i * 30}ms`
              }}
            />
          ))}
        </div>

        {/* Controls Panel */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-10 h-10 rounded-full bg-[#E89B52] text-white hover:bg-[#d4863e] active:scale-95 flex items-center justify-center cursor-pointer transition-transform shadow-xs"
            >
              {isPlaying ? <Pause size={18} /> : <Play size={18} className="translate-x-0.5" />}
            </button>

            <button
              onClick={() => setIsRecording(!isRecording)}
              className={`px-3 py-1.5 text-xs font-semibold border rounded-md transition-colors flex items-center gap-1.5 cursor-pointer ${isRecording ? 'border-red-500 bg-red-50 text-red-500 animate-pulse' : 'border-[#E7DED1] text-[#666666] hover:bg-[#FAF6EF] hover:text-[#2B2B2B]'}`}
            >
              <span className={`w-2 h-2 rounded-full ${isRecording ? 'bg-red-500' : 'bg-[#9E9E9E]'}`} />
              {isRecording ? 'Recording Mic...' : 'Record Session'}
            </button>
          </div>

          {/* Speed tuning Controls */}
          <div className="flex items-center gap-2 bg-[#FAF6EF] px-3 py-1.5 rounded border border-[#E7DED1]/50">
            <span className="text-[10px] font-bold text-[#666666] uppercase">Speed:</span>
            {[0.8, 1.0, 1.2].map((s) => (
              <button
                key={s}
                onClick={() => setSpeed(s)}
                className={`px-2 py-0.5 text-xs font-semibold rounded-sm cursor-pointer transition-colors ${speed === s ? 'bg-white text-[#2B2B2B] shadow-xs' : 'text-[#9E9E9E] hover:text-[#2B2B2B]'}`}
              >
                {s.toFixed(1)}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Guidelines notes */}
      <div className="text-[11px] text-[#666666] leading-relaxed flex items-start gap-1.5 bg-white/50 p-3 rounded border border-[#E7DED1]/40">
        <Sparkles size={14} className="text-[#C79A2B] shrink-0 mt-0.5" />
        <span>
          <strong>LMS Engineering Rule:</strong> Dones are hosted on highly optimized local WAV files. Playback velocity tuning utilizes Web Audio API node stretching to prevent pitch alteration of traditional tuning scales.
        </span>
      </div>
    </div>
  );
}


// ==========================================
// 7. COMPONENT: PRACTICE GOAL PROGRESS BAR
// ==========================================
export function GoalTracker({ label, current, target, unit = "min" }: { label: string; current: number; target: number; unit?: string }) {
  const percent = Math.min(100, Math.round((current / target) * 100));
  return (
    <div className="w-full text-left font-sans">
      <div className="flex justify-between items-center mb-1.5 text-xs">
        <span className="font-semibold text-[#2B2B2B]">{label}</span>
        <span className="text-[#666666] font-medium">
          {current}/{target} {unit} ({percent}%)
        </span>
      </div>
      <div className="w-full h-2.5 bg-[#FAF6EF] rounded-full overflow-hidden border border-[#E7DED1]/50">
        <div
          className="h-full bg-[#E89B52] transition-all duration-500 rounded-full"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}


// ==========================================
// 8. PAYMENT DOCUMENT UPLOADER DEMO (RECEIPT screenshots)
// ==========================================
export function ReceiptUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [method, setMethod] = useState<'telebirr' | 'cbe' | 'cash'>('telebirr');

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const simulateUpload = () => {
    if (!file) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setUploaded(true);
    }, 1500);
  };

  return (
    <div className="bg-white border border-[#E7DED1] rounded-xl p-5 text-left shadow-sm">
      <div className="mb-4">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#C79A2B] bg-[#FAF6EF] px-2 py-0.5 rounded">
          Tuition & Registration Payment
        </span>
        <h4 className="font-display font-bold text-lg text-[#2B2B2B] mt-1">
          Upload Digital Receipt screenshot
        </h4>
        <p className="text-xs text-[#666666] mt-1">
          Select your local payment method and upload the transaction screenshot (Telebirr / CBE confirmation receipt).
        </p>
      </div>

      {/* Selector */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {['telebirr', 'cbe', 'cash'].map((m) => (
          <button
            key={m}
            onClick={() => { setMethod(m as any); setUploaded(false); setFile(null); }}
            className={`py-2 text-xs font-semibold rounded border cursor-pointer uppercase transition-colors text-center ${method === m ? 'border-[#E89B52] bg-[#FAF6EF] text-[#E89B52]' : 'border-[#E7DED1] bg-white text-[#666666] hover:bg-[#FAF6EF]'}`}
          >
            {m}
          </button>
        ))}
      </div>

      {!uploaded && (
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-all ${dragActive ? 'border-[#E89B52] bg-[#FAF6EF]' : 'border-[#E7DED1] hover:border-[#C79A2B]/70 bg-[#FAF6EF]/30'}`}
        >
          {loading ? (
            <div className="flex flex-col items-center py-4">
              <svg className="animate-spin h-8 width-8 text-[#E89B52] mb-2" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <p className="text-xs font-semibold text-[#2B2B2B]">Processing and extracting transaction hash...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <Upload size={24} className="text-[#9E9E9E] mb-2" />
              {file ? (
                <div>
                  <p className="text-xs font-semibold text-[#2B2B2B]">{file.name}</p>
                  <p className="text-[10px] text-[#666666] mt-0.5">{(file.size / 1024).toFixed(1)} KB</p>
                  <button
                    onClick={simulateUpload}
                    className="mt-3 px-4 py-1.5 bg-[#E89B52] text-white text-xs font-semibold rounded cursor-pointer hover:bg-[#d4863e]"
                  >
                    Confirm Submission
                  </button>
                </div>
              ) : (
                <div>
                  <p className="text-xs font-semibold text-[#2B2B2B]">Drag & drop transaction screenshot here</p>
                  <p className="text-[10px] text-[#666666] mt-1">Supports PNG, JPG, PDF up to 5MB</p>
                  <label className="mt-3 inline-block px-3.5 py-1.5 border border-[#E7DED1] hover:border-[#C79A2B] bg-white text-[#2B2B2B] text-xs font-semibold rounded cursor-pointer">
                    Browse Files
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setFile(e.target.files[0]);
                        }
                      }}
                    />
                  </label>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {uploaded && (
        <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-4 text-center">
          <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center mx-auto mb-2">
            <Check size={18} />
          </div>
          <p className="text-xs font-bold">Screenshot Uploaded Successfully!</p>
          <p className="text-[10px] text-green-700 mt-1">
            Verification Ref ID: <strong>ABS-{Math.floor(100000 + Math.random() * 900000)}</strong>. The Accountant console has received this receipt for ledger verification.
          </p>
        </div>
      )}
    </div>
  );
}


// ==========================================
// 9. REUSABLE FEEDBACK SYSTEM
// ==========================================
export function Alert({
  type = 'info',
  title,
  children,
  className = ''
}: {
  type?: 'success' | 'warning' | 'error' | 'info';
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const getStyles = () => {
    switch (type) {
      case 'success':
        return {
          wrapper: 'bg-green-50 border-green-200 text-green-800',
          icon: <Check size={18} className="text-green-600" />
        };
      case 'warning':
        return {
          wrapper: 'bg-amber-50 border-amber-200 text-amber-800',
          icon: <AlertTriangle size={18} className="text-amber-600" />
        };
      case 'error':
        return {
          wrapper: 'bg-red-50 border-red-200 text-red-800',
          icon: <AlertCircle size={18} className="text-red-600" />
        };
      case 'info':
      default:
        return {
          wrapper: 'bg-blue-50 border-blue-200 text-blue-800',
          icon: <Info size={18} className="text-blue-600" />
        };
    }
  };

  const style = getStyles();

  return (
    <div className={`flex gap-3 p-4 border rounded-lg text-sm text-left ${style.wrapper} ${className}`}>
      <div className="shrink-0 mt-0.5">{style.icon}</div>
      <div>
        {title && <h5 className="font-bold mb-1">{title}</h5>}
        <div className="text-xs opacity-90 leading-relaxed">{children}</div>
      </div>
    </div>
  );
}


// ==========================================
// 10. REUSABLE CERTIFICATE PREVIEW (EXECUTIVE SATISFACTION)
// ==========================================
export function DecorativeCertificateDemo() {
  return (
    <div className="relative border-4 border-[#6F4E37] bg-white p-6 max-w-lg mx-auto rounded-md shadow-lg font-sans overflow-hidden text-center">
      {/* Absolute tilet accents */}
      <TiletPattern variant="gold-warm" height={10} className="absolute top-0 left-0" />
      <TiletPattern variant="gold-warm" height={10} className="absolute bottom-0 left-0" />

      {/* Inner thin gold borders */}
      <div className="border border-[#C79A2B] p-6 h-full flex flex-col items-center">
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#C79A2B] font-display">
          ABEL BEGENA SCHOOL
        </span>
        <span className="text-[8px] font-bold uppercase tracking-widest text-[#2B2B2B] mt-0.5">
          Traditional Music Academy · Addis Ababa
        </span>

        {/* Traditional seal */}
        <div className="w-14 h-14 rounded-full border-2 border-dashed border-[#C79A2B] bg-[#FAF6EF] my-4 flex items-center justify-center text-[#C79A2B] font-bold text-xs select-none relative">
          <Award size={24} />
          {/* Circular watermark decoration */}
          <div className="absolute inset-0.5 rounded-full border border-[#C79A2B]/30 animate-spin" style={{ animationDuration: '40s' }} />
        </div>

        <h3 className="font-display font-bold text-lg text-[#2B2B2B] mb-1">
          Certificate of Completion
        </h3>
        <p className="text-[10px] text-[#666666] italic">
          This is proudly awarded to our student
        </p>

        <p className="font-display font-extrabold text-md text-[#6F4E37] my-2 uppercase border-b border-[#E7DED1] pb-1.5 px-4">
          Tewodros Kassahun
        </p>

        <p className="text-[9px] text-[#666666] max-w-sm leading-relaxed px-2">
          for successfully finishing the complete course of <strong>Washint Advanced Phrasings</strong>, demonstrating exceptional fluency in traditional Ethiopian scales and liturgy.
        </p>

        {/* QR Verification Row */}
        <div className="flex items-center justify-between w-full mt-6 pt-4 border-t border-[#FAF6EF] text-left">
          <div>
            <p className="text-[8px] uppercase font-bold text-[#2B2B2B]">Dean Abel Begena</p>
            <p className="text-[7px] text-[#666666]">Founder & Master Instructor</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#2B2B2B] p-0.5 rounded">
              {/* Mock QR */}
              <div className="grid grid-cols-4 gap-0.5 h-full w-full">
                {Array.from({ length: 16 }).map((_, i) => (
                  <div
                    key={i}
                    className={`rounded-3xs ${i % 3 === 0 || i % 7 === 0 ? 'bg-white' : 'bg-[#2B2B2B]'}`}
                  />
                ))}
              </div>
            </div>
            <div>
              <p className="text-[7px] font-bold text-[#C79A2B]">QR SECURE</p>
              <p className="text-[6px] text-[#9E9E9E]">Verified Portal hash</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

