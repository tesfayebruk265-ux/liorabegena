import React, { useState, useEffect } from 'react';
import {
  Mail,
  Phone,
  Lock,
  User,
  Users,
  Check,
  X,
  AlertCircle,
  Eye,
  EyeOff,
  ArrowRight,
  ChevronLeft,
  Clock,
  Music,
  ShieldCheck,
  CheckCircle,
  Send,
  HelpCircle,
  Sparkles,
  LockKeyhole,
  BookOpen,
  Briefcase,
  FileText,
  Building,
  Calculator,
  Award,
  Smartphone,
  ExternalLink,
  CheckCircle2,
  Bot
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth, normalizePhoneNumber } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Button, Input } from './InteractiveComponents';
import { TiletPattern } from './TiletPattern';
import { PageId, UserRole } from '../types';

interface AuthComponentProps {
  onNavigate: (page: PageId, params?: any) => void;
  lang: 'en' | 'am';
}

// Translate helpers for Auth Screens
const AUTH_TEXT = {
  en: {
    loginTitle: 'Log In',
    loginSubtitle: 'Enter the Liora Begena sacred learning portals and dashboards.',
    emailPhoneLabel: 'Email Address or Phone Number',
    passwordLabel: 'Security Password',
    rememberMe: 'Remember this device',
    forgotPassword: 'Forgot password?',
    loginBtn: 'Sign In to Portal',
    orContinue: 'Or explore our academy',
    noAccount: "Don't have an account?",
    createAccount: 'Create Account',
    registerTitle: 'Welcome to Liora Begena School',
    registerSubtitle: 'Select how you want to join our traditional music academy.',
    studentCardTitle: 'STUDENT PORTAL',
    studentCardDesc: 'Learn Begena, Krar, Masenqo, Washint, or traditional vocals. Track your lessons, assignments, schedules, and certificate milestones.',
    parentCardTitle: 'PARENT GUARDIAN',
    parentCardDesc: "Monitor your children's schedules, practice hours, teacher feedback, lesson plans, and manage school payments.",
    teacherCardTitle: 'TEACHER APPLICATION',
    teacherCardDesc: 'Apply to join our esteemed faculty, share traditional knowledge, and manage assigned student classes and schedules.',
    applyBtn: 'Continue with Application',
    beginBtn: 'Begin Enrollment',
    backToLogin: 'Back to Sign In'
  },
  am: {
    loginTitle: 'ወደ ዲጂታል መተግበሪያ ይግቡ',
    loginSubtitle: 'የሊዮራ በገና ትምህርት ቤት መግቢያዎችን እና ዳሽቦርዶችን እዚህ ይክፈቱ።',
    emailPhoneLabel: 'የኢሜል አድራሻ ወይም ስልክ ቁጥር',
    passwordLabel: 'የደህንነት የይለፍ ቃል',
    rememberMe: 'ይህንን መሳሪያ አስታውስ',
    forgotPassword: 'የይለፍ ቃል ረስተዋል?',
    loginBtn: 'ወደ ፖርታል ግባ',
    orContinue: 'ወይም ትምህርት ቤታችንን ይጎብኙ',
    noAccount: 'መለያ የለዎትም?',
    createAccount: 'አዲስ መለያ ፍጠር',
    registerTitle: 'እንኳን ወደ ሊዮራ በገና ትምህርት ቤት መጡ',
    registerSubtitle: 'የባህል ሙዚቃ አካዳሚያችንን እንዴት መቀላቀል እንደሚፈልጉ ይምረጡ።',
    studentCardTitle: 'የተማሪ ፖርታል',
    studentCardDesc: 'በገና፣ ክራር፣ ማሲንቆ፣ ዋሽንት ወይም ባህላዊ ድምፅ ይማሩ። ትምህርቶችዎን፣ የክፍል መርሃግብሮችን እና የብቃት ደረጃዎችን ይከታተሉ።',
    parentCardTitle: 'የወላጅ ፖርታል',
    parentCardDesc: 'የልጅዎን መርሃ ግብር፣ ልምምድ፣ የአስተማሪ ግብረመልስ እና የትምህርት ክፍያዎችን ይከታተሉ።',
    teacherCardTitle: 'የአስተማሪ ማመልከቻ',
    teacherCardDesc: 'የባህል እውቀትዎን ለማጋራት አካዳሚያችንን ይቀላቀሉ። የእርስዎን ተማሪዎች እና የትምህርት ክፍለ-ጊዜዎች ያስተዳድሩ።',
    applyBtn: 'በማመልከቻው ይቀጥሉ',
    beginBtn: 'ምዝገባ ይጀምሩ',
    backToLogin: 'ወደ መግቢያ ይመለሱ'
  }
};

// ==========================================
// 1. LOGIN PAGE COMPONENT
// ==========================================
const PORTAL_ROLES: { role: UserRole; label: string; icon: React.ReactNode; defaultEmail: string }[] = [
  { role: 'student', label: 'Student', icon: <BookOpen size={15} />, defaultEmail: '' },
  { role: 'parent', label: 'Parent', icon: <Users size={15} />, defaultEmail: '' },
  { role: 'teacher', label: 'Teacher', icon: <Briefcase size={15} />, defaultEmail: '' },
  { role: 'registration_staff', label: 'Staff', icon: <FileText size={15} />, defaultEmail: '' },
  { role: 'branch_manager', label: 'Manager', icon: <Building size={15} />, defaultEmail: '' },
  { role: 'accountant', label: 'Accountant', icon: <Calculator size={15} />, defaultEmail: '' },
  { role: 'super_admin', label: 'Admin', icon: <ShieldCheck size={15} />, defaultEmail: '' },
  { role: 'founder', label: 'Founder', icon: <Award size={15} />, defaultEmail: '' },
];

const ALL_DEMO_EMAILS = PORTAL_ROLES.map((r) => r.defaultEmail);

export function LoginPage({ onNavigate, lang }: AuthComponentProps) {
  const { login } = useAuth();
  const text = AUTH_TEXT[lang];

  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  
  // Validation and Status States
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loginState, setLoginState] = useState<'default' | 'success' | 'error' | 'pending' | 'suspended' | 'unverified'>('default');

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    if (isLoading) return;
    setErrorMsg(null);
    setUnverifiedEmail(null);
    setLoginState('default');

    // Basic Client Validation
    if (!emailOrPhone.trim()) {
      setErrorMsg('Please enter your email or phone number.');
      setLoginState('error');
      return;
    }
    if (!password) {
      setErrorMsg('Please enter your password.');
      setLoginState('error');
      return;
    }

    setIsLoading(true);
    try {
      const res = await login(emailOrPhone.trim(), password, rememberMe, selectedRole);
      if (res.success) {
        setLoginState('success');
        if (res.status === 'Pending Verification' && res.role !== 'teacher') {
          onNavigate('verify-account', { email: emailOrPhone.trim() });
        } else {
          const roleDashboardMap: Record<string, PageId> = {
            student: 'student',
            teacher: 'teacher',
            parent: 'parent',
            branch_manager: 'branch_manager',
            accountant: 'accountant',
            admin: 'admin',
            super_admin: 'super_admin',
            founder: 'founder',
            registration_staff: 'registration_staff'
          };
          const targetPage = (res.role && roleDashboardMap[res.role]) || 'student';
          onNavigate(targetPage);
        }
      } else {
        setErrorMsg(res.error || 'Invalid email or password.');
        if (res.unverifiedEmail || res.status === 'Pending Verification') {
          const target = res.unverifiedEmail || emailOrPhone.trim();
          setUnverifiedEmail(target);
          setLoginState('unverified');
        } else if (res.status === 'Suspended') {
          setLoginState('suspended');
        } else {
          setLoginState('error');
        }
        setIsLoading(false);
      }
    } catch (err) {
      setErrorMsg('A network error occurred. Please check your connection and try again.');
      setLoginState('error');
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row bg-[#FAF6EF] rounded-3xl overflow-hidden border border-[#E7DED1] shadow-2xl my-2">
      {/* LEFT FORM SIDE */}
      <div className="w-full md:w-1/2 lg:w-[54%] p-6 sm:p-10 lg:p-12 flex flex-col justify-between bg-white relative">
        <div className="absolute top-0 right-0 w-24 h-24 opacity-5 pointer-events-none">
          <TiletPattern />
        </div>

        <div>
          <button
            onClick={() => onNavigate('home')}
            className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#C79A2B] font-bold uppercase tracking-wider mb-6 transition-colors cursor-pointer"
          >
            <ChevronLeft size={16} />
            {lang === 'en' ? 'Back to Academy' : 'ወደ ዋናው ገጽ'}
          </button>

          <div className="w-full max-w-sm mx-auto md:mx-0">
            <div className="w-12 h-12 bg-[#FAF6EF] rounded-xl flex items-center justify-center border border-[#E7DED1] text-[#E89B52] mb-5">
              <LockKeyhole size={24} />
            </div>
            
            <h1 className="font-display font-black text-2xl sm:text-3xl text-[#2B2B2B] uppercase tracking-tight mb-2">
              {text.loginTitle}
            </h1>
            <p className="font-sans text-sm text-gray-500 leading-relaxed mb-6">
              {text.loginSubtitle}
            </p>

            <AnimatePresence mode="wait">
              {errorMsg && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className={`p-4 rounded-xl flex items-start gap-3 mb-6 border ${
                    loginState === 'suspended'
                      ? 'bg-red-50 border-red-200 text-red-800'
                      : loginState === 'unverified'
                      ? 'bg-amber-50 border-amber-200 text-amber-900'
                      : 'bg-amber-50 border-amber-200 text-amber-900'
                  }`}
                  id="auth-error"
                  role="alert"
                >
                  <AlertCircle size={18} className="shrink-0 mt-0.5 text-amber-600" />
                  <div className="space-y-1 text-xs">
                    <p>{errorMsg}</p>
                    {loginState === 'unverified' && unverifiedEmail && (
                      <button
                        type="button"
                        onClick={() => onNavigate('verify-account', { email: unverifiedEmail })}
                        className="mt-2.5 px-4 py-2 bg-[#E89B52] hover:bg-[#C79A2B] text-white font-bold text-xs rounded-lg transition-all cursor-pointer flex items-center gap-2 shadow-sm"
                      >
                        <span>Go to Verification Page</span>
                        <ArrowRight size={14} />
                      </button>
                    )}
                    {loginState === 'suspended' && (
                      <>
                        <span className="font-bold">Account Restricted</span>
                        <p className="font-medium underline cursor-pointer mt-1 hover:text-red-950">
                          File an appeal with Academic Affairs
                        </p>
                      </>
                    )}
                  </div>
                </motion.div>
              )}

              {loginState === 'success' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 mb-6"
                >
                  <CheckCircle size={20} className="text-green-500 shrink-0" />
                  <div className="text-xs text-green-800 font-bold">
                    Loading ...
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="mb-4">
                <label className="text-[11px] font-bold text-[#666666] uppercase tracking-wider block mb-2">
                  Select Portal Access Role:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {PORTAL_ROLES.map((r) => {
                    const isSelected = selectedRole === r.role;
                    return (
                      <button
                        key={r.role}
                        type="button"
                        onClick={() => {
                          setSelectedRole(r.role);
                          setErrorMsg(null);
                          if (!emailOrPhone || ALL_DEMO_EMAILS.includes(emailOrPhone)) {
                            setEmailOrPhone(r.defaultEmail);
                          }
                        }}
                        className={`rounded-xl border p-2 text-[10px] sm:text-xs font-bold uppercase transition-all cursor-pointer flex flex-col items-center justify-center ${
                          isSelected
                            ? 'border-[#E89B52] bg-[#F7E7C1]/90 text-[#2B2B2B] shadow-sm ring-2 ring-[#E89B52]/40'
                            : 'border-[#E7DED1] bg-white text-gray-600 hover:border-[#C79A2B] hover:text-[#2B2B2B]'
                        }`}
                      >
                        <div className="flex items-center justify-center gap-1.5 mb-1 text-[#C79A2B]">
                          {r.icon}
                          <span className="truncate">{r.label}</span>
                        </div>
                        <span className="text-[9px] opacity-75 font-semibold">Access</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#666666] uppercase block" htmlFor="email-phone-input">
                  {text.emailPhoneLabel}
                </label>
                <Input
                  id="email-phone-input"
                  required
                  placeholder={lang === 'en' ? 'Email or +251 9...' : 'ኢሜል ወይም ስልክ ቁጥር...'}
                  value={emailOrPhone}
                  onChange={(e) => {
                    setEmailOrPhone(e.target.value);
                    setErrorMsg(null);
                  }}
                  leftIcon={<Mail size={16} className="text-gray-400" />}
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-[#666666] uppercase block" htmlFor="password-input">
                    {text.passwordLabel}
                  </label>
                  <button
                    type="button"
                    onClick={() => onNavigate('forgot-password')}
                    className="text-xs font-semibold text-[#C79A2B] hover:underline cursor-pointer"
                  >
                    {text.forgotPassword}
                  </button>
                </div>
                <div className="relative">
                  <Input
                    id="password-input"
                    required
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setErrorMsg(null);
                    }}
                    leftIcon={<Lock size={16} className="text-gray-400" />}
                    rightIcon={
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="p-1 focus:outline-none hover:text-[#C79A2B] cursor-pointer"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    }
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                    className="w-4 h-4 text-[#E89B52] border-[#E7DED1] rounded focus:ring-[#C79A2B]"
                  />
                  <span className="text-xs text-gray-500 font-medium">{text.rememberMe}</span>
                </label>
              </div>

              <Button
                type="submit"
                variant="primary"
                className="w-full font-bold uppercase tracking-wider py-3 mt-2"
                isLoading={isLoading}
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : text.loginBtn}
              </Button>
            </form>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <p className="text-xs text-gray-500">
            {text.noAccount}{' '}
            <button
              onClick={() => onNavigate('register')}
              className="text-[#C79A2B] hover:underline font-bold cursor-pointer"
            >
              {text.createAccount}
            </button>
          </p>

          <p className="text-[10px] text-gray-400 flex items-center gap-1 shrink-0">
            <ShieldCheck size={12} className="text-green-500" />
            256-bit TLS Security
          </p>
        </div>
      </div>

      {/* RIGHT DISPLAY SIDE */}
      <div className="hidden md:flex w-full md:w-1/2 lg:w-[46%] bg-[#2B2B2B] relative items-center justify-center p-8 lg:p-12 overflow-hidden text-center text-white">
        {/* Subtle pattern background overlay */}
        <div className="absolute inset-0 opacity-10">
          <TiletPattern />
        </div>
        
        {/* Decorative circle light flare */}
        <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-[#E89B52]/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-[#C79A2B]/10 blur-3xl pointer-events-none" />

        <div className="relative max-w-sm space-y-6 z-10 flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#E89B52] shadow-inner">
            <Music size={32} />
          </div>
          
          <div className="space-y-3">
            <h3 className="font-display font-black text-xl tracking-wider text-[#E89B52] uppercase">
              Liora Begena Traditional School
            </h3>
            <p className="font-serif italic text-sm lg:text-base text-gray-300 leading-relaxed px-2">
              "እኒስ ከ አስር አውታር ነው ሰላሜን የማገኝ"
            </p>
            <p className="font-serif italic text-sm lg:text-base text-gray-300 leading-relaxed px-2">
              "በበገናዬ ድምጽ ዝምታ በሚሰኝ"
            </p>
            <p className="text-xs tracking-widest text-[#E89B52] uppercase font-bold">
              - Lique Mezemer Bruk Tesfaye
            </p>
          </div>

          <div className="pt-6 border-t border-white/10 w-full flex justify-center gap-6 lg:gap-8 text-[11px] text-gray-400 uppercase font-mono">
            <div>
              <span className="block text-[#E89B52] text-sm lg:text-base font-bold">10</span>
              Strings
            </div>
            <div>
              <span className="block text-[#E89B52] text-sm lg:text-base font-bold">4000+</span>
              Years History
            </div>
            <div>
              <span className="block text-[#E89B52] text-sm lg:text-base font-bold">100%</span>
              Authentic
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 2. REGISTRATION ENTRY SELECTOR PAGE
// ==========================================
export function RegisterPage({ onNavigate, lang }: AuthComponentProps) {
  const text = AUTH_TEXT[lang];

  const cards = [
    {
      id: 'student',
      title: text.studentCardTitle,
      desc: text.studentCardDesc,
      icon: <Music size={28} className="text-[#E89B52]" />,
      actionLabel: text.beginBtn,
      action: () => onNavigate('stepped-register', { role: 'student' })
    },
    {
      id: 'parent',
      title: text.parentCardTitle,
      desc: text.parentCardDesc,
      icon: <User size={28} className="text-[#E89B52]" />,
      actionLabel: text.applyBtn,
      action: () => onNavigate('stepped-register', { role: 'parent' })
    },
    {
      id: 'teacher',
      title: text.teacherCardTitle,
      desc: text.teacherCardDesc,
      icon: <Sparkles size={28} className="text-[#E89B52]" />,
      actionLabel: text.applyBtn,
      action: () => onNavigate('stepped-register', { role: 'teacher' })
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      <button
        onClick={() => onNavigate('login')}
        className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#C79A2B] font-bold uppercase tracking-wider transition-colors cursor-pointer"
      >
        <ChevronLeft size={16} />
        {text.backToLogin}
      </button>

      <div className="text-center space-y-3">
        <h1 className="font-display font-black text-3xl sm:text-4xl text-[#2B2B2B] uppercase tracking-tight">
          {text.registerTitle}
        </h1>
        <p className="font-sans text-sm text-gray-500 max-w-xl mx-auto leading-relaxed">
          {text.registerSubtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        {cards.map((card) => (
          <motion.div
            key={card.id}
            whileHover={{ y: -4, borderColor: '#C79A2B' }}
            className="bg-white border border-[#E7DED1] rounded-2xl p-6 flex flex-col justify-between shadow-xs hover:shadow-md transition-all relative overflow-hidden"
          >
            {/* Elegant corner tile decoration */}
            <div className="absolute -top-6 -right-6 w-12 h-12 opacity-5 pointer-events-none">
              <TiletPattern />
            </div>

            <div className="space-y-4">
              <div className="w-12 h-12 bg-[#FAF6EF] rounded-xl flex items-center justify-center border border-[#E7DED1]">
                {card.icon}
              </div>
              <h3 className="font-display font-black text-base text-[#2B2B2B] tracking-wider uppercase">
                {card.title}
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                {card.desc}
              </p>
            </div>

            <Button
              variant="secondary"
              className="w-full text-xs font-bold uppercase mt-6 hover:bg-[#E89B52] hover:text-white"
              onClick={card.action}
            >
              {card.actionLabel}
            </Button>
          </motion.div>
        ))}
      </div>

      {/* Dynamic Security/Privacy Notice */}
      <div className="p-4 bg-[#FAF6EF] rounded-xl border border-[#E7DED1] flex gap-3 max-w-xl mx-auto text-[11px] text-gray-500">
        <ShieldCheck size={18} className="text-[#E89B52] shrink-0 mt-0.5" />
        <p>
          Staff, Accountants, and Branch Manager profiles must be explicitly invited. If you are an administrator, please log in with your primary credential to manage personnel.
        </p>
      </div>
    </div>
  );
}

// ==========================================
// 3. STEPPED CREATION COMPONENT
// ==========================================
interface SteppedRegisterProps extends AuthComponentProps {
  role: 'student' | 'parent' | 'teacher';
}

export function SteppedRegister({ onNavigate, lang, role }: SteppedRegisterProps) {
  const { registerUser } = useAuth();
  const { addStudentRegistration } = useData();
  
  // States
  const [step, setStep] = useState(1);
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Form Validation & Progress
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Requirement metrics for Password Validation
  const passReqs = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password)
  };

  const getPasswordStrength = () => {
    const metCount = Object.values(passReqs).filter(Boolean).length;
    if (password.length === 0) return { label: '', color: 'bg-gray-200', width: 'w-0' };
    if (metCount <= 2) return { label: 'Weak', color: 'bg-red-500', width: 'w-1/4' };
    if (metCount === 3) return { label: 'Medium', color: 'bg-yellow-500', width: 'w-2/4' };
    if (metCount === 4) return { label: 'Strong', color: 'bg-[#E89B52]', width: 'w-3/4' };
    return { label: 'Very Strong', color: 'bg-green-500', width: 'w-full' };
  };

  const strength = getPasswordStrength();

  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Validation
    if (!fullName.trim()) return setErrorMsg('Full Name is required.');
    if (!username.trim()) return setErrorMsg('Username is required.');
    if (username.trim().length < 3) return setErrorMsg('Username must be at least 3 characters long.');
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) return setErrorMsg('A valid email address is required.');
    if (!phone.trim()) return setErrorMsg('Phone number is required.');
    
    // Check password strength requirement
    const metCount = Object.values(passReqs).filter(Boolean).length;
    if (metCount < 4) {
      return setErrorMsg('Please ensure password meets at least 4 security requirements.');
    }

    if (password !== confirmPassword) {
      return setErrorMsg('Passwords do not match. Please verify your typing.');
    }

    if (!termsAccepted) {
      return setErrorMsg('You must agree to the academic integrity directives to proceed.');
    }

    setIsLoading(true);
    try {
      const res = await registerUser(fullName, email, phone, username, password, role);
      if (res.success) {
        if (role === 'student') {
          // Note: Actual student course enrollment registration is created when student completes course selection wizard
        }

        if (role === 'teacher') {
          onNavigate('teacher');
          return;
        }

        // Automatically proceed to Step 2 (verification) for other roles
        setStep(2);
      } else {
        setErrorMsg(res.error || 'Registration failed.');
      }
    } catch (err) {
      setErrorMsg('An unexpected error occurred during database setup.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white border border-[#E7DED1] rounded-2xl shadow-xl p-8 relative overflow-hidden">
      {/* Elegantly styled top timeline */}
      <div className="absolute top-0 inset-x-0 h-1.5 bg-[#FAF6EF] flex">
        <div className={`h-full bg-[#E89B52] transition-all duration-300 ${step === 1 ? 'w-1/2' : 'w-full'}`} />
      </div>

      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => (step === 2 ? setStep(1) : onNavigate('register'))}
          className="text-gray-400 hover:text-[#2B2B2B] inline-flex items-center gap-1 text-xs font-bold"
        >
          <ChevronLeft size={16} />
          {step === 2 ? 'Previous Step' : 'Back'}
        </button>
        <span className="text-xs font-mono font-bold text-[#E89B52]">STEP {step} OF 2</span>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 ? (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="space-y-6"
          >
            <div>
              <h2 className="font-display font-black text-xl text-[#2B2B2B] uppercase tracking-wide">
                CREATE {role.toUpperCase()} ACCOUNT
              </h2>
              <p className="text-xs text-gray-400">
                Register secure credentials to enter the digital ecosystem.
              </p>
            </div>

            {errorMsg && (
              <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-xs text-red-800" id="step1-error">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <p>{errorMsg}</p>
              </div>
            )}

            <form onSubmit={handleStep1Submit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#666666] uppercase" htmlFor="register-fullname">Full Name</label>
                <Input
                  id="register-fullname"
                  required
                  placeholder="Kidus Yohannes"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  leftIcon={<User size={16} className="text-gray-400" />}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#666666] uppercase" htmlFor="register-username">Username</label>
                <Input
                  id="register-username"
                  required
                  placeholder="kidus_y"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  leftIcon={<User size={16} className="text-gray-400" />}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#666666] uppercase" htmlFor="register-email">Email Address</label>
                <Input
                  id="register-email"
                  required
                  type="email"
                  placeholder="name@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  leftIcon={<Mail size={16} className="text-gray-400" />}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#666666] uppercase" htmlFor="register-phone">Phone Number (with code)</label>
                <Input
                  id="register-phone"
                  required
                  placeholder="+251 911..."
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  leftIcon={<Phone size={16} className="text-gray-400" />}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#666666] uppercase" htmlFor="register-password">Create Password</label>
                <Input
                  id="register-password"
                  required
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  leftIcon={<Lock size={16} className="text-gray-400" />}
                  rightIcon={
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="hover:text-[#E89B52]">
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  }
                />
              </div>

              {/* Password strength checklist - requirement 9 */}
              {password.length > 0 && (
                <div className="p-3 bg-[#FAF6EF] rounded-xl border border-[#E7DED1] space-y-2.5">
                  <div className="flex justify-between items-center text-[10px] font-bold text-gray-500 uppercase">
                    <span>Password Strength</span>
                    <span className="text-[#C79A2B]">{strength.label}</span>
                  </div>
                  <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                    <div className={`h-full transition-all duration-300 ${strength.color} ${strength.width}`} />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[10px] text-gray-500 font-medium">
                    <div className="flex items-center gap-1.5">
                      {passReqs.length ? <Check size={12} className="text-green-500" /> : <div className="w-2 h-2 rounded-full bg-gray-300" />}
                      <span>8+ characters</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {passReqs.upper ? <Check size={12} className="text-green-500" /> : <div className="w-2 h-2 rounded-full bg-gray-300" />}
                      <span>Uppercase letter</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {passReqs.lower ? <Check size={12} className="text-green-500" /> : <div className="w-2 h-2 rounded-full bg-gray-300" />}
                      <span>Lowercase letter</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {passReqs.number ? <Check size={12} className="text-green-500" /> : <div className="w-2 h-2 rounded-full bg-gray-300" />}
                      <span>One number</span>
                    </div>
                    <div className="flex items-center gap-1.5 col-span-2">
                      {passReqs.special ? <Check size={12} className="text-green-500" /> : <div className="w-2 h-2 rounded-full bg-gray-300" />}
                      <span>Special character (!@#$)</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#666666] uppercase" htmlFor="register-confirmpassword">Confirm Password</label>
                <Input
                  id="register-confirmpassword"
                  required
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  leftIcon={<Lock size={16} className="text-gray-400" />}
                  rightIcon={
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="hover:text-[#E89B52] cursor-pointer p-1">
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  }
                />
              </div>

              <label className="flex items-start gap-2.5 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={() => setTermsAccepted(!termsAccepted)}
                  className="w-4 h-4 text-[#E89B52] border-[#E7DED1] rounded mt-0.5"
                />
                <span className="text-[11px] text-gray-500 leading-relaxed font-medium">
                  I agree to respect the sacred spiritual heritage of the Begena, observe school code, and protect cultural intellectual property.
                </span>
              </label>

              <Button
                type="submit"
                variant="primary"
                className="w-full font-bold uppercase tracking-wider py-3 mt-4"
                isLoading={isLoading}
              >
                Create Account
              </Button>
            </form>
          </motion.div>
        ) : (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="text-center"
          >
            {/* Step 2 triggers standard Verification interface */}
            <VerifyAccountPage onNavigate={onNavigate} lang={lang} params={{ email, phone }} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ==========================================
// 4. FORGOT PASSWORD COMPONENT
// ==========================================
export function ForgotPasswordPage({ onNavigate, lang }: AuthComponentProps) {
  const { forgotPassword, resetPassword } = useAuth();

  const [step, setStep] = useState(1);
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // UX Feedback States
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Requirement metrics for Password
  const passReqs = {
    length: newPassword.length >= 8,
    upper: /[A-Z]/.test(newPassword),
    lower: /[a-z]/.test(newPassword),
    number: /[0-9]/.test(newPassword),
    special: /[^A-Za-z0-9]/.test(newPassword)
  };

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!emailOrPhone.trim()) return setErrorMsg('Please fill in your email or phone.');

    setIsLoading(true);
    try {
      await forgotPassword(emailOrPhone);
      setSuccessMsg('Reset code has been dispatched. Please check your inbox or sms messages.');
      // Proceed to verification phase
      setTimeout(() => {
        setStep(2);
        setErrorMsg(null);
        setSuccessMsg(null);
      }, 1000);
    } catch (err) {
      setErrorMsg('Error requesting reset token.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!code) return setErrorMsg('Reset verification code is required.');
    
    const metCount = Object.values(passReqs).filter(Boolean).length;
    if (metCount < 4) {
      return setErrorMsg('Please construct a stronger password complying with all checkmarks.');
    }

    if (newPassword !== confirmPassword) {
      return setErrorMsg('Passwords do not match.');
    }

    setIsLoading(true);
    try {
      const res = await resetPassword(code, newPassword);
      if (res.success) {
        setStep(3); // Success page
      } else {
        setErrorMsg(res.error || 'Password reset failed. Please confirm the code is correct.');
      }
    } catch (err) {
      setErrorMsg('Server database connection timed out.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white border border-[#E7DED1] rounded-2xl shadow-xl p-8 relative overflow-hidden">
      {/* Visual Tilet border decor */}
      <div className="absolute top-0 inset-x-0 h-1.5 bg-[#E89B52]" />

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="req-reset"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-amber-50 text-[#E89B52] border border-[#E7DED1] rounded-full flex items-center justify-center mx-auto">
                <LockKeyhole size={20} />
              </div>
              <h2 className="font-display font-black text-xl text-[#2B2B2B] uppercase tracking-wide">
                Forgot Password?
              </h2>
              <p className="text-xs text-gray-400">
                Provide your registered email address or phone number and we will dispatch a 6-digit secure recovery token.
              </p>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex gap-2">
                <AlertCircle size={16} className="shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-xl text-xs text-green-800 flex gap-2">
                <CheckCircle size={16} className="shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleRequestReset} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#666666] uppercase" htmlFor="forgot-emailphone">Email or Phone</label>
                <Input
                  id="forgot-emailphone"
                  required
                  placeholder="student@begena.com or +251 9..."
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  leftIcon={<Mail size={16} className="text-gray-400" />}
                />
              </div>

              <Button type="submit" className="w-full font-bold uppercase py-3" isLoading={isLoading}>
                Send Reset Code
              </Button>
            </form>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => onNavigate('login')}
                className="text-xs text-gray-400 hover:text-[#C79A2B] font-bold underline cursor-pointer"
              >
                Back to Sign In
              </button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="apply-reset"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="text-center space-y-2">
              <h2 className="font-display font-black text-xl text-[#2B2B2B] uppercase tracking-wide">
                Secure Account Reset
              </h2>
              <p className="text-xs text-gray-400">
                A verification token was sent (Sandbox code: <b className="text-[#C79A2B]">123456</b>). Enter it below with your new password.
              </p>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex gap-2">
                <AlertCircle size={16} className="shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleApplyReset} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#666666] uppercase">Verification Reset Code</label>
                <Input
                  required
                  placeholder="123456"
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  leftIcon={<Clock size={16} className="text-gray-400" />}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#666666] uppercase">New Strong Password</label>
                <Input
                  required
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  leftIcon={<Lock size={16} className="text-gray-400" />}
                  rightIcon={
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="hover:text-[#E89B52]">
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  }
                />
              </div>

              {/* Password strength checklist */}
              {newPassword.length > 0 && (
                <div className="p-3 bg-[#FAF6EF] rounded-xl border border-[#E7DED1] space-y-2">
                  <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[10px] text-gray-500 font-medium">
                    <div className="flex items-center gap-1.5">
                      {passReqs.length ? <Check size={12} className="text-green-500" /> : <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />}
                      <span>8+ characters</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {passReqs.upper ? <Check size={12} className="text-green-500" /> : <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />}
                      <span>Uppercase</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {passReqs.lower ? <Check size={12} className="text-green-500" /> : <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />}
                      <span>Lowercase</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {passReqs.number ? <Check size={12} className="text-green-500" /> : <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />}
                      <span>Number</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#666666] uppercase">Confirm Password</label>
                <Input
                  required
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  leftIcon={<Lock size={16} className="text-gray-400" />}
                  rightIcon={
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="hover:text-[#E89B52] cursor-pointer p-1">
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  }
                />
              </div>

              <Button type="submit" className="w-full font-bold uppercase py-3" isLoading={isLoading}>
                Reset Password
              </Button>
            </form>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="reset-success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-5 py-4"
          >
            <div className="w-16 h-16 bg-green-50 text-green-500 border border-green-200 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle size={32} />
            </div>
            
            <div className="space-y-2">
              <h2 className="font-display font-black text-xl text-[#2B2B2B] uppercase">
                Reset Successful
              </h2>
              <p className="text-xs text-gray-500 leading-relaxed max-w-xs mx-auto">
                Your new security credential has been synchronized successfully. You may now return to the portal.
              </p>
            </div>

            <Button
              variant="primary"
              className="w-full font-bold uppercase py-3"
              onClick={() => onNavigate('login')}
            >
              Sign In to Portal
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ==========================================
// 5. ACCOUNT VERIFICATION EXPERIENCE COMPONENT
// ==========================================
export function VerifyAccountPage({ onNavigate, lang, params }: AuthComponentProps & { params?: any }) {
  const {
    verifyCode,
    resendVerificationCode,
    sendTelegramVerificationCode,
    getAuthoritativeUser,
    currentUser,
    verificationEmailNotice
  } = useAuth();

  // Verification method: 'email' | 'telegram'
  const [verifyMethod, setVerifyMethod] = useState<'email' | 'telegram'>('email');

  // Target Email state
  const [targetEmail, setTargetEmail] = useState<string>(() => {
    return (params?.email || currentUser?.email || localStorage.getItem('ab_pending_verify_email') || 'student@begena.com').trim();
  });
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [emailInput, setEmailInput] = useState(targetEmail);

  // Target Phone state
  const [targetPhone, setTargetPhone] = useState<string>(() => {
    return (
      params?.phone ||
      currentUser?.phone ||
      getAuthoritativeUser?.(targetEmail)?.phone ||
      localStorage.getItem('ab_pending_verify_phone') ||
      '+251 911 234 567'
    ).trim();
  });
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [phoneInput, setPhoneInput] = useState(targetPhone);

  // Telegram Bot simulation and live state
  const [telegramStatus, setTelegramStatus] = useState<'idle' | 'checking' | 'matched' | 'mismatched'>('idle');
  const [telegramMessages, setTelegramMessages] = useState<Array<{
    id: string;
    sender: 'bot' | 'user';
    text: string;
    code?: string;
    isError?: boolean;
    time: string;
  }>>([
    {
      id: 'init-1',
      sender: 'bot',
      text: '👋 Selam! Welcome to Liora Begena Verification Bot (@liorabegenabot).\n\nTo verify your account, you can open @liorabegenabot on Telegram or click "Share Telegram Contact" below. We verify that your Telegram phone number matches your registered phone number before issuing your 6-digit verification code.',
      time: 'Just now'
    }
  ]);
  const [showMismatchTester, setShowMismatchTester] = useState(false);
  const [testAltPhone, setTestAltPhone] = useState('+251 922 999 888');

  // 6-digit code state
  const [codeDigits, setCodeDigits] = useState(['', '', '', '', '', '']);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [resendNotice, setResendNotice] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Resend Countdown timer (60 seconds)
  const [timer, setTimer] = useState(60);
  const [isTimerActive, setIsTimerActive] = useState(true);

  // Register with backend & live-poll Telegram status when method is telegram
  useEffect(() => {
    if (verifyMethod !== 'telegram' || success) return;

    // Register pending verification with backend
    fetch('/api/telegram/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: targetPhone, email: targetEmail })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.matched && data.code) {
          setTelegramStatus('matched');
          setCodeDigits(data.code.split(''));
          setTelegramMessages((prev) => [
            ...prev,
            {
              id: `auto-${Date.now()}`,
              sender: 'bot',
              text: `✅ Verified from Telegram app!\n\nYour 6-digit verification code:`,
              code: data.code,
              time: 'Just now'
            }
          ]);
          setResendNotice('6-digit code received from @liorabegenabot! Click Verify Account below.');
        }
      })
      .catch((err) => console.warn('Telegram register call:', err));

    // Poll every 3 seconds for contact shared via native Telegram app
    const pollInterval = setInterval(() => {
      if (telegramStatus === 'matched' || codeDigits.join('').length === 6) return;

      fetch(`/api/telegram/status?phone=${encodeURIComponent(targetPhone)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data && data.matched && data.code) {
            setTelegramStatus('matched');
            setCodeDigits(data.code.split(''));
            setTelegramMessages((prev) => [
              ...prev,
              {
                id: `poll-${Date.now()}`,
                sender: 'bot',
                text: `✅ Live match received from your Telegram app!\n\nHere is your official 6-digit code:`,
                code: data.code,
                time: 'Just now'
              }
            ]);
            setResendNotice('6-digit code received from @liorabegenabot! Click Verify Account below.');
          }
        })
        .catch(() => {});
    }, 3000);

    return () => clearInterval(pollInterval);
  }, [verifyMethod, targetPhone, targetEmail, telegramStatus, success, codeDigits]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerActive && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsTimerActive(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timer, isTimerActive]);

  const handleDigitChange = (index: number, val: string) => {
    const cleanVal = val.replace(/\D/g, '');
    if (!cleanVal && val !== '') return;

    const newDigits = [...codeDigits];
    newDigits[index] = cleanVal.slice(-1);
    setCodeDigits(newDigits);
    setErrorMsg(null);

    // Auto-focus next input box
    if (cleanVal !== '' && index < 5) {
      const nextInput = document.getElementById(`digit-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && codeDigits[index] === '' && index > 0) {
      const prevInput = document.getElementById(`digit-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pastedData) return;

    const digits = pastedData.split('');
    const newDigits = ['', '', '', '', '', ''];
    digits.forEach((d, i) => {
      if (i < 6) newDigits[i] = d;
    });
    setCodeDigits(newDigits);
    setErrorMsg(null);

    // Focus last filled box or next empty box
    const focusIndex = Math.min(digits.length, 5);
    const targetInput = document.getElementById(`digit-${focusIndex}`);
    targetInput?.focus();
  };

  // Telegram Contact Sharing & Phone Number Matching Handler
  const handleShareTelegramContact = async (phoneToShare?: string) => {
    const phone = (phoneToShare || targetPhone).trim();
    setErrorMsg(null);
    setResendNotice(null);
    setIsLoading(true);
    setTelegramStatus('checking');

    // Add user bubble
    const userMsgId = `user-${Date.now()}`;
    setTelegramMessages((prev) => [
      ...prev,
      {
        id: userMsgId,
        sender: 'user',
        text: `📱 Shared Telegram Contact: ${phone}`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);

    try {
      const res = await sendTelegramVerificationCode(phone, targetEmail);
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      if (res.matched && res.success && res.code) {
        setTelegramStatus('matched');
        // Bot sends successful match and the 6-digit code
        setTelegramMessages((prev) => [
          ...prev,
          {
            id: `bot-${Date.now()}`,
            sender: 'bot',
            text: `✅ Phone Number Verified!\n\nYour Telegram account (${phone}) matches your registration phone number (${targetPhone}).\n\nHere is your official 6-digit verification code:`,
            code: res.code,
            time: timeStr
          }
        ]);

        // Auto-fill the 6 digits for user convenience
        const digits = res.code.split('');
        setCodeDigits(digits);
        setResendNotice(`6-digit code received from @LioraBegenaBot! Click Verify Account below.`);
      } else {
        setTelegramStatus('mismatched');
        // Bot sends phone number mismatch failure
        const mismatchError =
          res.error ||
          `Phone number mismatch! Shared Telegram number (${phone}) does not match your registered phone number (${targetPhone}). Verification code cannot be issued.`;

        setTelegramMessages((prev) => [
          ...prev,
          {
            id: `bot-${Date.now()}`,
            sender: 'bot',
            text: `❌ Verification Failed: Phone Number Mismatch!\n\nYour shared Telegram account phone (${phone}) does NOT match your registered phone (${targetPhone}).\n\nFor security reasons, verification codes are only sent if both numbers match exactly. Please share your registered Telegram account or update your phone number.`,
            isError: true,
            time: timeStr
          }
        ]);
        setErrorMsg(mismatchError);
      }
    } catch (err) {
      setErrorMsg('Error contacting Telegram verification bot. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setResendNotice(null);
    const fullCode = codeDigits.join('');

    if (fullCode.length < 6) {
      return setErrorMsg('Please enter all 6 verification digits.');
    }

    setIsLoading(true);
    try {
      const res = await verifyCode(fullCode, targetEmail);
      if (res.success) {
        setSuccess(true);
        setTimeout(() => {
          onNavigate('login');
        }, 1500);
      } else {
        setErrorMsg(res.error || 'The verification code provided is invalid or has expired.');
      }
    } catch (err) {
      setErrorMsg('Network error verifying credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (isTimerActive) return;
    setErrorMsg(null);
    setResendNotice(null);
    setIsLoading(true);

    try {
      if (verifyMethod === 'telegram') {
        // Resend via Telegram bot
        await handleShareTelegramContact(targetPhone);
        setTimer(60);
        setIsTimerActive(true);
      } else {
        // Resend via EmailJS
        const res = await resendVerificationCode(targetEmail);
        if (res.success) {
          setResendNotice(`A new 6-digit verification code has been dispatched via email to ${targetEmail}.`);
          setTimer(60);
          setIsTimerActive(true);
        } else {
          setErrorMsg(res.error || 'Failed to resend verification code.');
          if (res.remainingSeconds) {
            setTimer(res.remainingSeconds);
            setIsTimerActive(true);
          }
        }
      }
    } catch (err) {
      setErrorMsg('Error sending request for new verification code.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim() || !/\S+@\S+\.\S+/.test(emailInput)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    const clean = emailInput.trim().toLowerCase();
    setTargetEmail(clean);
    localStorage.setItem('ab_pending_verify_email', clean);
    setIsEditingEmail(false);
    setErrorMsg(null);
  };

  const handleSavePhone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneInput.trim() || phoneInput.replace(/\D/g, '').length < 9) {
      setErrorMsg('Please enter a valid phone number (e.g., +251 911 234 567).');
      return;
    }
    const clean = phoneInput.trim();
    setTargetPhone(clean);
    localStorage.setItem('ab_pending_verify_phone', clean);
    setIsEditingPhone(false);
    setErrorMsg(null);
    setTelegramMessages((prev) => [
      ...prev,
      {
        id: `phone-update-${Date.now()}`,
        sender: 'bot',
        text: `ℹ️ Registered phone number updated to ${clean}. Please tap "Share Contact" below to verify your Telegram account.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <div className="max-w-md mx-auto bg-white border border-[#E7DED1] rounded-2xl shadow-xl p-6 sm:p-8 relative overflow-hidden my-4">
      {/* Visual Tilet top accent bar */}
      <div className="absolute top-0 inset-x-0 h-1.5 bg-[#FAF6EF] flex">
        <div className="h-full bg-[#E89B52] w-full" />
      </div>

      <AnimatePresence mode="wait">
        {!success ? (
          <motion.div
            key="verify-form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="text-center space-y-2">
              <div className="w-14 h-14 bg-[#FAF6EF] border border-[#E7DED1] text-[#E89B52] rounded-full flex items-center justify-center mx-auto shadow-sm">
                <Clock size={24} className="animate-pulse" />
              </div>
              <h2 className="font-display font-black text-2xl text-[#2B2B2B] uppercase tracking-wide">
                Account Verification
              </h2>
              <p className="text-xs text-gray-500">
                Choose how you want to receive your 6-digit verification code
              </p>

              {/* VERIFICATION METHOD SELECTOR: EMAIL OR TELEGRAM */}
              <div className="grid grid-cols-2 gap-2 pt-2 pb-1">
                <button
                  type="button"
                  onClick={() => {
                    setVerifyMethod('email');
                    setErrorMsg(null);
                    setResendNotice(null);
                  }}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-bold transition-all ${
                    verifyMethod === 'email'
                      ? 'bg-[#FAF6EF] border-[#E89B52] text-[#2B2B2B] shadow-sm ring-2 ring-[#E89B52]/20'
                      : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
                  }`}
                >
                  <Mail size={15} className={verifyMethod === 'email' ? 'text-[#E89B52]' : 'text-gray-400'} />
                  <span>Email (EmailJS)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setVerifyMethod('telegram');
                    setErrorMsg(null);
                    setResendNotice(null);
                  }}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-bold transition-all ${
                    verifyMethod === 'telegram'
                      ? 'bg-[#229ED9]/10 border-[#229ED9] text-[#229ED9] shadow-sm ring-2 ring-[#229ED9]/20'
                      : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
                  }`}
                >
                  <Bot size={15} className={verifyMethod === 'telegram' ? 'text-[#229ED9]' : 'text-gray-400'} />
                  <span>Telegram Bot</span>
                </button>
              </div>

              {/* METHOD 1: EMAIL VERIFICATION */}
              {verifyMethod === 'email' && (
                <div className="space-y-2 pt-1">
                  {!isEditingEmail ? (
                    <div className="text-xs text-gray-500 flex flex-col items-center gap-1">
                      <p>A 6-digit verification code was sent to:</p>
                      <div className="flex items-center gap-2 font-bold text-[#2B2B2B] bg-[#FAF6EF] px-3 py-1 rounded-lg border border-[#E7DED1]">
                        <Mail size={14} className="text-[#E89B52]" />
                        <span>{targetEmail}</span>
                        <button
                          type="button"
                          onClick={() => {
                            setEmailInput(targetEmail);
                            setIsEditingEmail(true);
                          }}
                          className="text-[10px] text-[#C79A2B] hover:underline uppercase ml-1"
                        >
                          Change
                        </button>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleSaveEmail} className="p-3 bg-[#FAF6EF] rounded-xl border border-[#E7DED1] space-y-2">
                      <label className="text-[10px] font-bold text-gray-600 uppercase block">Update Target Verification Email:</label>
                      <div className="flex gap-2">
                        <Input
                          type="email"
                          required
                          value={emailInput}
                          onChange={(e) => setEmailInput(e.target.value)}
                          className="text-xs py-1.5"
                        />
                        <Button type="submit" variant="primary" className="text-xs py-1 px-3">
                          Save
                        </Button>
                      </div>
                    </form>
                  )}

                  {verificationEmailNotice && (
                    <div className="p-3 bg-blue-50 border border-blue-200 text-xs text-blue-800 rounded-xl flex items-center justify-center gap-2">
                      <Mail size={14} className="shrink-0" />
                      <span>{verificationEmailNotice}</span>
                    </div>
                  )}
                </div>
              )}

              {/* METHOD 2: TELEGRAM BOT VERIFICATION */}
              {verifyMethod === 'telegram' && (
                <div className="space-y-3 pt-1 text-left">
                  {/* Registered Phone Bar */}
                  {!isEditingPhone ? (
                    <div className="text-xs text-gray-500 flex flex-col items-center gap-1">
                      <p>Registered Phone Number:</p>
                      <div className="flex items-center gap-2 font-bold text-[#2B2B2B] bg-[#FAF6EF] px-3 py-1 rounded-lg border border-[#E7DED1]">
                        <Smartphone size={14} className="text-[#229ED9]" />
                        <span>{targetPhone}</span>
                        <button
                          type="button"
                          onClick={() => {
                            setPhoneInput(targetPhone);
                            setIsEditingPhone(true);
                          }}
                          className="text-[10px] text-[#229ED9] hover:underline uppercase ml-1"
                        >
                          Change
                        </button>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleSavePhone} className="p-3 bg-[#FAF6EF] rounded-xl border border-[#E7DED1] space-y-2">
                      <label className="text-[10px] font-bold text-gray-600 uppercase block">Update Registered Phone Number:</label>
                      <div className="flex gap-2">
                        <Input
                          type="text"
                          required
                          value={phoneInput}
                          onChange={(e) => setPhoneInput(e.target.value)}
                          placeholder="+251 911 234 567"
                          className="text-xs py-1.5"
                        />
                        <Button type="submit" variant="primary" className="text-xs py-1 px-3">
                          Save
                        </Button>
                      </div>
                    </form>
                  )}

                  {/* LIORA BEGENA TELEGRAM BOT CARD */}
                  <div className="rounded-xl border border-sky-200 bg-[#F4F8FA] overflow-hidden shadow-sm">
                    {/* Bot Top Header */}
                    <div className="bg-[#229ED9] text-white px-3 py-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-white text-[#229ED9] flex items-center justify-center font-bold text-xs shadow-inner">
                          <Bot size={16} />
                        </div>
                        <div>
                          <div className="flex items-center gap-1">
                            <span className="font-bold text-xs">Liora Begena Bot</span>
                            <CheckCircle2 size={12} className="text-sky-200" />
                          </div>
                          <span className="text-[10px] text-sky-100 block">@liorabegenabot • Official Bot</span>
                        </div>
                      </div>
                      <a
                        href="https://t.me/liorabegenabot"
                        target="_blank"
                        rel="noreferrer"
                        className="text-[10px] bg-white/20 hover:bg-white/30 text-white px-2 py-1 rounded flex items-center gap-1 transition-all"
                      >
                        <span>Open Bot</span>
                        <ExternalLink size={10} />
                      </a>
                    </div>

                    {/* Bot Messages Window */}
                    <div className="p-3 max-h-52 overflow-y-auto space-y-2.5 text-xs bg-[#EBF2F7]/50">
                      {telegramMessages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                        >
                          <div
                            className={`p-2.5 rounded-2xl max-w-[85%] whitespace-pre-line shadow-xs ${
                              msg.sender === 'user'
                                ? 'bg-[#229ED9] text-white rounded-br-xs'
                                : msg.isError
                                ? 'bg-red-50 text-red-900 border border-red-200 rounded-bl-xs'
                                : 'bg-white text-gray-800 border border-gray-200 rounded-bl-xs'
                            }`}
                          >
                            <p className="leading-relaxed">{msg.text}</p>
                            {msg.code && (
                              <div className="mt-2 p-2 bg-[#FAF6EF] border border-[#E89B52] rounded-lg text-center">
                                <span className="text-[10px] uppercase font-bold text-gray-500 block mb-0.5">Your Verification Code:</span>
                                <span className="text-xl font-mono font-black text-[#E89B52] tracking-widest">{msg.code}</span>
                                <span className="text-[10px] text-green-700 font-semibold block mt-1">✨ Auto-filled in boxes below</span>
                              </div>
                            )}
                          </div>
                          <span className="text-[9px] text-gray-400 mt-0.5 px-1">{msg.time}</span>
                        </div>
                      ))}
                    </div>

                    {/* Bot Action Bar */}
                    <div className="p-2.5 bg-white border-t border-sky-100 space-y-2">
                      <button
                        type="button"
                        onClick={() => handleShareTelegramContact(targetPhone)}
                        disabled={isLoading}
                        className="w-full bg-[#229ED9] hover:bg-[#1E8BC0] text-white py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-50"
                      >
                        <Smartphone size={14} />
                        <span>Share Telegram Contact ({targetPhone})</span>
                      </button>

                      {/* Mismatch Testing Tool for Testing/Verification */}
                      <div className="pt-1">
                        <button
                          type="button"
                          onClick={() => setShowMismatchTester(!showMismatchTester)}
                          className="text-[10px] text-gray-400 hover:text-gray-600 underline flex items-center gap-1 mx-auto"
                        >
                          <span>{showMismatchTester ? 'Hide Mismatch Test Simulation' : '🧪 Test Phone Number Mismatch Check'}</span>
                        </button>

                        {showMismatchTester && (
                          <div className="mt-2 p-2.5 bg-amber-50/70 border border-amber-200 rounded-lg text-[11px] text-amber-900 space-y-1.5">
                            <p className="font-semibold text-[10px] uppercase text-amber-800">
                              Security Verification Test:
                            </p>
                            <p className="text-[10px] text-amber-700">
                              Simulate sharing a different Telegram number to verify that the bot detects mismatch and blocks the code.
                            </p>
                            <div className="flex gap-1.5">
                              <input
                                type="text"
                                value={testAltPhone}
                                onChange={(e) => setTestAltPhone(e.target.value)}
                                className="bg-white border border-amber-300 rounded px-2 py-1 text-xs flex-1 text-gray-800"
                                placeholder="+251 922 999 888"
                              />
                              <button
                                type="button"
                                onClick={() => handleShareTelegramContact(testAltPhone)}
                                className="bg-amber-600 hover:bg-amber-700 text-white text-[10px] font-bold px-2.5 py-1 rounded"
                              >
                                Test Mismatch
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {resendNotice && (
                <div className="p-3 bg-green-50 border border-green-200 text-xs text-green-800 rounded-xl flex items-center justify-center gap-2">
                  <CheckCircle size={14} className="shrink-0 text-green-600" />
                  <span>{resendNotice}</span>
                </div>
              )}
            </div>

            {errorMsg && (
              <div className="p-3.5 bg-red-50 border border-red-200 text-xs text-red-800 rounded-xl flex items-start gap-2.5" id="verify-error">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleVerify} className="space-y-6">
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase block text-center mb-2">
                  Enter 6-Digit Code
                </label>
                <div className="flex justify-between gap-2 sm:gap-3">
                  {codeDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      id={`digit-${idx}`}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleDigitChange(idx, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(idx, e)}
                      onPaste={handlePaste}
                      className="w-10 h-12 sm:w-12 sm:h-14 text-center text-xl font-bold bg-white border-2 border-[#E7DED1] rounded-xl focus:border-[#E89B52] focus:ring-2 focus:ring-[#E89B52]/20 outline-none transition-all shadow-sm"
                      autoComplete="off"
                      aria-label={`Digit ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                className="w-full font-bold uppercase tracking-wider py-3.5"
                isLoading={isLoading}
                disabled={isLoading || codeDigits.join('').length < 6}
              >
                {isLoading ? 'Verifying Code...' : 'Verify Account'}
              </Button>
            </form>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 text-xs pt-4 border-t border-gray-100">
              <span className="text-gray-400">Didn't receive a verification code?</span>
              <button
                type="button"
                onClick={handleResend}
                disabled={isTimerActive || isLoading}
                className={`font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                  isTimerActive
                    ? 'text-gray-400 cursor-not-allowed opacity-80'
                    : 'text-[#E89B52] hover:text-[#C79A2B] hover:underline'
                }`}
              >
                {isTimerActive ? (
                  <>
                    <Clock size={13} className="animate-spin" />
                    <span>Resend Code in {timer}s</span>
                  </>
                ) : (
                  <>
                    <Send size={13} />
                    <span>Resend Code</span>
                  </>
                )}
              </button>
            </div>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => onNavigate('login')}
                className="text-xs text-gray-400 hover:text-[#2B2B2B] font-bold underline cursor-pointer"
              >
                Return to Login Page
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="verify-success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-5 py-6"
          >
            <div className="w-20 h-20 bg-green-50 text-green-500 border-2 border-green-200 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle size={44} />
            </div>

            <div className="space-y-2">
              <h2 className="font-display font-black text-2xl text-[#2B2B2B] uppercase tracking-tight">
                Account Verified!
              </h2>
              <p className="text-sm text-gray-600 max-w-xs mx-auto">
                Your account <span className="font-semibold text-[#2B2B2B]">{targetEmail}</span> has been verified successfully. Redirecting you to login...
              </p>
            </div>

            <div className="w-10 h-10 border-4 border-[#E89B52] border-t-transparent rounded-full animate-spin mx-auto mt-4" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

