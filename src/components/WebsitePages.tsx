import React, { useState, useMemo, useEffect } from 'react';
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
  DollarSign,
  MapPin,
  Users,
  ShieldCheck,
  CheckCircle,
  Coins
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Course, Teacher, Event, Product, Article, Testimonial, Branch, GalleryItem, PageId, Language } from '../types';
import { COURSES_DATA, TEACHERS_DATA, EVENTS_DATA, PRODUCTS_DATA, ARTICLES_DATA, TESTIMONIALS_DATA, BRANCHES_DATA, GALLERY_DATA, TRANSLATIONS, ABEL_BEGENA_PHOTO, isCourseComingSoon, getLocalizedCourse, getLocalizedTeacher, tr } from '../data/websiteData';
import { Button, Input } from './InteractiveComponents';
import { TiletPattern } from './TiletPattern';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { CourseComingSoonModal } from './CourseComingSoonModal';

interface PageProps {
  lang: Language;
  onNavigate: (page: PageId, params?: any) => void;
  params?: any;
}

// ==========================================
// 1. ABOUT BRUK PAGE
// ==========================================
export function AboutAbelPage({ lang, onNavigate }: PageProps) {
  const t = TRANSLATIONS[lang];
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="space-y-12 py-6 text-left"
    >
      {/* Hero Section */}
      <div className="relative rounded-3xl overflow-hidden border border-[#E7DED1] bg-[#FAF6EF]">
        <div className="absolute inset-0 opacity-[0.03] bg-dot-pattern pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 py-12 md:py-20 grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
          <div className="md:col-span-7 space-y-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#C79A2B] bg-white border border-[#E7DED1] px-2.5 py-1 rounded-full">
              {t.aboutAbelPage.deanTag}
            </span>
            <h1 className="font-display font-black text-4xl sm:text-5xl text-[#2B2B2B] tracking-tight">
              {t.aboutAbelPage.nameTitle}
            </h1>
            <p className="text-base text-[#666666] leading-relaxed max-w-xl">
              {t.aboutAbelPage.heroSubtitle}
            </p>
          </div>
          <div className="md:col-span-5 flex justify-center">
            <div className="relative">
              <div className="w-64 h-64 sm:w-80 sm:h-80 rounded-2xl overflow-hidden border-2 border-[#C79A2B] shadow-lg">
                <img
                  src={ABEL_BEGENA_PHOTO}
                  alt={t.aboutAbelPage.nameTitle}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-[#2B2B2B] text-[#FFFDF8] p-4 rounded-xl border border-[#C79A2B]/30 text-xs shadow-md">
                <p className="font-bold text-[#E89B52]">{t.aboutAbelPage.activeTag}</p>
                <p className="text-[10px] opacity-75">{t.aboutAbelPage.liturgicalMaster}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Narrative Biography */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
        <div className="md:col-span-8 space-y-6">
          <h2 className="text-2xl font-display font-black text-[#2B2B2B]">{t.aboutAbelPage.journeyTitle}</h2>
          <p className="text-sm text-[#666666] leading-relaxed">
            {t.aboutAbelPage.bioP1}
          </p>
          <p className="text-sm text-[#666666] leading-relaxed">
            {t.aboutAbelPage.bioP2}
          </p>

          <div className="bg-[#FAF6EF]/70 p-6 rounded-2xl border border-[#E7DED1] space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#E89B52]">{t.aboutAbelPage.messageHeader}</h4>
            <p className="text-sm italic font-serif text-[#6F4E37] leading-relaxed">
              {t.aboutAbelPage.messageQuote}
            </p>
          </div>
        </div>

        <div className="md:col-span-4 space-y-6">
          <div className="bg-white border border-[#E7DED1] rounded-2xl p-6 shadow-sm space-y-5">
            <h3 className="text-sm font-bold uppercase tracking-widest text-[#2B2B2B] border-b border-[#FAF6EF] pb-2">
              {t.aboutAbelPage.summaryTitle}
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="text-xl">🎓</span>
                <div>
                  <h4 className="text-xs font-bold text-[#2B2B2B]">{t.aboutAbelPage.cred1Title}</h4>
                  <p className="text-xs text-[#666666] mt-0.5">{t.aboutAbelPage.cred1Desc}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-xl">🌍</span>
                <div>
                  <h4 className="text-xs font-bold text-[#2B2B2B]">{t.aboutAbelPage.cred2Title}</h4>
                  <p className="text-xs text-[#666666] mt-0.5">{t.aboutAbelPage.cred2Desc}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-xl">🎻</span>
                <div>
                  <h4 className="text-xs font-bold text-[#2B2B2B]">{t.aboutAbelPage.cred3Title}</h4>
                  <p className="text-xs text-[#666666] mt-0.5">{t.aboutAbelPage.cred3Desc}</p>
                </div>
              </div>
            </div>
            <Button
              variant="primary"
              className="w-full text-xs font-bold mt-2"
              onClick={() => onNavigate('courses', { instrument: 'begena' })}
            >
              {t.aboutAbelPage.studyButton}
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ==========================================
// 2. ABOUT BEGENA PAGE
// ==========================================
export function AboutBegenaPage({ lang, onNavigate }: PageProps) {
  const t = TRANSLATIONS[lang];
  const [activeTab, setActiveTab] = useState<'history' | 'structure' | 'playing'>('history');

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="space-y-12 py-6 text-left"
    >
      {/* Cover Header */}
      <div className="relative rounded-3xl overflow-hidden border border-[#E7DED1] bg-[#2B2B2B] text-[#FFFDF8] p-8 sm:p-12">
        <div className="absolute inset-0 opacity-10 bg-dot-pattern pointer-events-none" />
        <div className="absolute top-0 right-0 w-64 h-64 opacity-5 bg-[#C79A2B] rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-3xl space-y-4 relative z-10">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#E89B52] border border-[#E89B52]/30 px-2.5 py-1 rounded-full">
            {t.aboutBegenaPage.coverBadge}
          </span>
          <h1 className="font-display font-black text-4xl sm:text-5xl text-white tracking-tight">
            {t.aboutBegenaPage.coverTitle}
          </h1>
          <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
            {t.aboutBegenaPage.coverSubtitle}
          </p>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex border-b border-[#E7DED1] gap-4 overflow-x-auto pb-px">
        {(['history', 'structure', 'playing'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-xs sm:text-sm font-bold uppercase tracking-widest border-b-2 cursor-pointer transition-all whitespace-nowrap shrink-0 ${
              activeTab === tab ? 'border-[#E89B52] text-[#E89B52]' : 'border-transparent text-[#666666] hover:text-[#2B2B2B]'
            }`}
          >
            {tab === 'history' && t.aboutBegenaPage.tabHistory}
            {tab === 'structure' && t.aboutBegenaPage.tabStructure}
            {tab === 'playing' && t.aboutBegenaPage.tabPlaying}
          </button>
        ))}
      </div>

      {/* Tab Content Panels */}
      <div className="min-h-[300px]">
        {activeTab === 'history' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center"
          >
            <div className="md:col-span-7 space-y-5">
              <h3 className="text-xl font-display font-bold text-[#2B2B2B]">{t.aboutBegenaPage.histTitle}</h3>
              <p className="text-sm text-[#666666] leading-relaxed">
                {t.aboutBegenaPage.histP1}
              </p>
              <p className="text-sm text-[#666666] leading-relaxed">
                {t.aboutBegenaPage.histP2}
              </p>
            </div>
            <div className="md:col-span-5 bg-[#FAF6EF] p-6 rounded-2xl border border-[#E7DED1] space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-widest text-[#C79A2B]">{t.aboutBegenaPage.milestonesTitle}</h4>
              <ul className="space-y-3 text-xs text-[#666666]">
                <li className="flex gap-2">
                  <span className="text-[#E89B52]">✦</span>
                  <span><strong>{t.aboutBegenaPage.m1Title}</strong> {t.aboutBegenaPage.m1Desc}</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#E89B52]">✦</span>
                  <span><strong>{t.aboutBegenaPage.m2Title}</strong> {t.aboutBegenaPage.m2Desc}</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#E89B52]">✦</span>
                  <span><strong>{t.aboutBegenaPage.m3Title}</strong> {t.aboutBegenaPage.m3Desc}</span>
                </li>
              </ul>
            </div>
          </motion.div>
        )}

        {activeTab === 'structure' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start"
          >
            <div className="md:col-span-6 space-y-4">
              <h3 className="text-xl font-display font-bold text-[#2B2B2B]">{t.aboutBegenaPage.structTitle}</h3>
              <p className="text-sm text-[#666666] leading-relaxed">
                {t.aboutBegenaPage.structP1}
              </p>
              <p className="text-sm text-[#666666] leading-relaxed">
                {t.aboutBegenaPage.structP2}
              </p>
            </div>
            <div className="md:col-span-6 grid grid-cols-2 gap-4">
              <div className="border border-[#E7DED1] p-4 rounded-xl bg-white space-y-1">
                <span className="text-lg">🪵</span>
                <h4 className="text-xs font-bold">{t.aboutBegenaPage.box1Title}</h4>
                <p className="text-[11px] text-[#666666]">{t.aboutBegenaPage.box1Desc}</p>
              </div>
              <div className="border border-[#E7DED1] p-4 rounded-xl bg-white space-y-1">
                <span className="text-lg">🎻</span>
                <h4 className="text-xs font-bold">{t.aboutBegenaPage.box2Title}</h4>
                <p className="text-[11px] text-[#666666]">{t.aboutBegenaPage.box2Desc}</p>
              </div>
              <div className="border border-[#E7DED1] p-4 rounded-xl bg-white space-y-1">
                <span className="text-lg">🐝</span>
                <h4 className="text-xs font-bold">{t.aboutBegenaPage.box3Title}</h4>
                <p className="text-[11px] text-[#666666]">{t.aboutBegenaPage.box3Desc}</p>
              </div>
              <div className="border border-[#E7DED1] p-4 rounded-xl bg-white space-y-1">
                <span className="text-lg">🎛️</span>
                <h4 className="text-xs font-bold">{t.aboutBegenaPage.box4Title}</h4>
                <p className="text-[11px] text-[#666666]">{t.aboutBegenaPage.box4Desc}</p>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'playing' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#FAF6EF] p-5 rounded-xl border border-[#E7DED1] text-center space-y-2">
                <span className="w-8 h-8 rounded-full bg-[#E89B52] text-white flex items-center justify-center font-bold mx-auto text-xs">1</span>
                <h4 className="text-xs font-bold uppercase">{t.aboutBegenaPage.playStep1Title}</h4>
                <p className="text-xs text-[#666666] leading-relaxed">{t.aboutBegenaPage.playStep1Desc}</p>
              </div>
              <div className="bg-[#FAF6EF] p-5 rounded-xl border border-[#E7DED1] text-center space-y-2">
                <span className="w-8 h-8 rounded-full bg-[#E89B52] text-white flex items-center justify-center font-bold mx-auto text-xs">2</span>
                <h4 className="text-xs font-bold uppercase">{t.aboutBegenaPage.playStep2Title}</h4>
                <p className="text-xs text-[#666666] leading-relaxed">{t.aboutBegenaPage.playStep2Desc}</p>
              </div>
              <div className="bg-[#FAF6EF] p-5 rounded-xl border border-[#E7DED1] text-center space-y-2">
                <span className="w-8 h-8 rounded-full bg-[#E89B52] text-white flex items-center justify-center font-bold mx-auto text-xs">3</span>
                <h4 className="text-xs font-bold uppercase">{t.aboutBegenaPage.playStep3Title}</h4>
                <p className="text-xs text-[#666666] leading-relaxed">{t.aboutBegenaPage.playStep3Desc}</p>
              </div>
            </div>
            <div className="pt-4 text-center">
              <Button
                variant="primary"
                onClick={() => onNavigate('course-detail', { courseId: 'begena' })}
                rightIcon={<ArrowRight size={14} />}
              >
                {t.aboutBegenaPage.exploreCTA}
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

// ==========================================
// 3. COURSES PAGE
// ==========================================
export function CoursesPage({ lang, onNavigate, params }: PageProps) {
  const t = TRANSLATIONS[lang];
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [selectedMode, setSelectedMode] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>(params?.instrument ? params.instrument : '');
  const [comingSoonCourse, setComingSoonCourse] = useState<Course | null>(null);

  // Filter courses
  const filteredCourses = useMemo(() => {
    return COURSES_DATA.filter((course) => {
      const locCourse = getLocalizedCourse(course, lang);
      const matchesSearch = locCourse.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            locCourse.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            course.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDifficulty = selectedDifficulty === 'All' || course.difficulty === selectedDifficulty;
      const matchesMode = selectedMode === 'All' || course.learningMode.includes(selectedMode as any);
      return matchesSearch && matchesDifficulty && matchesMode;
    });
  }, [searchQuery, selectedDifficulty, selectedMode, lang]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-8 py-6 text-left"
    >
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <h1 className="font-display font-black text-3xl sm:text-4xl text-[#2B2B2B] tracking-tight">{t.coursesPage.title}</h1>
        <p className="text-xs sm:text-sm text-[#666666]">{t.coursesPage.subtitle}</p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-[#E7DED1] rounded-2xl p-4 sm:p-6 shadow-xs grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
        <div className="md:col-span-5 space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-wider text-[#666666]">{t.coursesPage.searchLabel}</label>
          <Input
            placeholder={t.coursesPage.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search size={16} className="text-gray-400" />}
          />
        </div>

        <div className="md:col-span-3 space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-wider text-[#666666]">{t.coursesPage.difficultyLabel}</label>
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="w-full h-10 px-3 bg-white border border-[#E7DED1] rounded-md text-sm outline-none focus:border-[#C79A2B]"
          >
            <option value="All">{t.coursesPage.allDifficulties}</option>
            <option value="Beginner">{t.common.beginner}</option>
            <option value="Intermediate">{t.common.intermediate}</option>
            <option value="Advanced">{t.common.advanced}</option>
          </select>
        </div>

        <div className="md:col-span-3 space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-wider text-[#666666]">{t.coursesPage.modeLabel}</label>
          <select
            value={selectedMode}
            onChange={(e) => setSelectedMode(e.target.value)}
            className="w-full h-10 px-3 bg-white border border-[#E7DED1] rounded-md text-sm outline-none focus:border-[#C79A2B]"
          >
            <option value="All">{t.coursesPage.allModes}</option>
            <option value="In-Person">{t.coursesPage.inPerson}</option>
            <option value="Online">{t.coursesPage.online}</option>
          </select>
        </div>

        <div className="md:col-span-1 flex items-center justify-end">
          <Button
            variant="ghost"
            onClick={() => {
              setSearchQuery('');
              setSelectedDifficulty('All');
              setSelectedMode('All');
            }}
            className="w-full text-xs font-bold h-10 uppercase text-gray-500"
          >
            {t.coursesPage.reset}
          </Button>
        </div>
      </div>

      {/* Courses List Grid */}
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
          {filteredCourses.map((course, index) => {
            const locCourse = getLocalizedCourse(course, lang);
            const isComingSoon = isCourseComingSoon(course.id);
            return (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -8, scale: 1.02 }}
                onClick={() => {
                  if (isComingSoon) {
                    setComingSoonCourse(locCourse);
                  } else {
                    onNavigate('course-detail', { courseId: course.id });
                  }
                }}
                className={`bg-white border rounded-3xl overflow-hidden shadow-xs hover:shadow-2xl transition-all flex flex-col group h-full cursor-pointer ${
                  isComingSoon
                    ? 'border-amber-200/90 hover:border-amber-400'
                    : 'border-[#E7DED1] hover:border-[#C79A2B]'
                }`}
              >
                <div className="w-full overflow-hidden relative bg-[#FAF6EF] flex items-center justify-center p-4">
                  <img
                    src={course.image}
                    alt={locCourse.name}
                    className="max-w-full max-h-48 object-contain object-center group-hover:scale-105 transition-all duration-300"
                    referrerPolicy="no-referrer"
                  />
                  {isComingSoon ? (
                    <div className="absolute top-3 right-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white backdrop-blur-xs px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border border-amber-500/40 shadow-sm flex items-center gap-1">
                      <Sparkles size={11} />
                      {lang === 'am' ? 'በቅርቡ' : 'Coming Soon'}
                    </div>
                  ) : (
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-xs text-[#C79A2B] px-2 py-1 rounded-full text-[10px] font-bold border border-[#E7DED1]">
                      ★ {course.rating}
                    </div>
                  )}
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h3 className="text-sm font-black uppercase tracking-tight text-[#2B2B2B] group-hover:text-[#E89B52] transition-colors">
                        {locCourse.name}
                      </h3>
                      {isComingSoon && (
                        <span className="text-[8px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100 border border-amber-300 px-1.5 py-0.5 rounded">
                          {t.common.soon}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#666666] leading-relaxed line-clamp-3">{locCourse.shortDescription}</p>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-[#E7DED1]/60">
                    <div className="flex justify-between items-center text-[10px] text-[#666666]">
                      <span className="flex items-center gap-1"><Clock size={12} /> {locCourse.duration}</span>
                      <span className="font-semibold bg-[#FAF6EF] px-2 py-0.5 rounded-full border border-[#E7DED1] text-[10px]">{locCourse.difficulty}</span>
                    </div>
                    <div className="flex gap-1 flex-wrap">
                      {course.learningMode.map((mode, idx) => (
                        <span key={idx} className="text-[9px] font-bold bg-[#FAF6EF] text-[#6F4E37] px-2 py-0.5 rounded-full border border-[#E7DED1]">
                          {mode === 'In-Person' ? (lang === 'am' ? 'በአካል' : 'In-Person') : (lang === 'am' ? 'ኦንላይን' : 'Online')}
                        </span>
                      ))}
                    </div>
                    <Button
                      variant={isComingSoon ? "ghost" : "secondary"}
                      className={`w-full text-[11px] font-bold py-2 transition-all cursor-pointer ${
                        isComingSoon
                          ? 'bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100 hover:border-amber-400 font-extrabold shadow-2xs'
                          : ''
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isComingSoon) {
                          setComingSoonCourse(locCourse);
                        } else {
                          onNavigate('course-detail', { courseId: course.id });
                        }
                      }}
                    >
                      {isComingSoon ? (lang === 'am' ? 'በቅርቡ ይጠብቁን' : 'COMING SOON') : (lang === 'am' ? 'ዝርዝሩን ይመልከቱ' : 'VIEW SYLLABUS')}
                    </Button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-[#FAF6EF]/40 rounded-2xl border border-[#E7DED1] border-dashed space-y-3">
          <span className="text-3xl">🔍</span>
          <h3 className="text-sm font-bold text-[#2B2B2B]">{t.coursesPage.noMatch}</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">{t.coursesPage.noMatchSub}</p>
        </div>
      )}

      {/* Coming Soon Interactive Waitlist Modal */}
      <CourseComingSoonModal
        course={comingSoonCourse}
        isOpen={Boolean(comingSoonCourse)}
        onClose={() => setComingSoonCourse(null)}
        onSelectActiveCourse={(id) => onNavigate('course-detail', { courseId: id })}
        lang={lang}
      />
    </motion.div>
  );
}

// ==========================================
// 4. COURSE DETAIL PAGE
// ==========================================
export function CourseDetailPage({ lang, onNavigate, params }: PageProps) {
  const { currentUser } = useAuth();
  const courseId = params?.courseId || 'begena';
  const rawCourse = useMemo(() => {
    return COURSES_DATA.find((c) => c.id === courseId) || COURSES_DATA[0];
  }, [courseId]);

  const course = useMemo(() => {
    return getLocalizedCourse(rawCourse, lang);
  }, [rawCourse, lang]);

  const isComingSoon = isCourseComingSoon(rawCourse.id);
  const [comingSoonModalOpen, setComingSoonModalOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'curriculum' | 'pricing'>('overview');
  const [selectedPricing, setSelectedPricing] = useState<number>(0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-10 py-6 text-left"
    >
      {/* Breadcrumbs */}
      <div className="flex items-center gap-1.5 text-xs text-[#666666]">
        <span className="hover:text-[#2B2B2B] cursor-pointer" onClick={() => onNavigate('home')}>{lang === 'am' ? 'ዋና ገጽ' : 'Home'}</span>
        <ChevronRight size={12} />
        <span className="hover:text-[#2B2B2B] cursor-pointer" onClick={() => onNavigate('courses')}>{lang === 'am' ? 'ትምህርቶች' : 'Courses'}</span>
        <ChevronRight size={12} />
        <span className="font-bold text-[#E89B52]">{course.name}</span>
      </div>

      {/* Hero Header */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#FAF6EF] border border-[#E7DED1] p-6 sm:p-10 rounded-3xl relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02] bg-dot-pattern pointer-events-none" />
        <div className="lg:col-span-7 space-y-4 relative z-10">
          {isComingSoon ? (
            <span className="text-[10px] font-black uppercase tracking-widest bg-gradient-to-r from-amber-600 to-amber-700 text-white px-3 py-1 rounded-full shadow-xs flex items-center gap-1.5 w-fit border border-amber-500/40">
              <Sparkles size={12} />
              {lang === 'am' ? 'የስርዓተ ትምህርት ዝግጅት በሂደት ላይ • በቅርቡ ይጠብቁን' : 'Curriculum In Development • Coming Soon'}
            </span>
          ) : (
            <span className="text-[9px] font-bold uppercase tracking-widest bg-white border border-[#E7DED1] px-2.5 py-1 rounded-full text-[#C79A2B]">
              {lang === 'am' ? 'የተደራጀ ሥርዓተ-ትምህርት' : 'Structured Syllabus'}
            </span>
          )}
          <h1 className="font-display font-black text-3xl sm:text-4xl text-[#2B2B2B] tracking-tight">{course.name}</h1>
          <p className="text-sm text-[#666666] leading-relaxed">{course.description}</p>
          <div className="flex gap-4 text-xs font-semibold text-[#6F4E37] pt-2 flex-wrap">
            <span className="flex items-center gap-1">★ {course.rating} {lang === 'am' ? 'ደረጃ' : 'Rating'}</span>
            <span>•</span>
            <span>{course.duration} {lang === 'am' ? 'መርሃ ግብር' : 'Program'}</span>
            <span>•</span>
            <span>{lang === 'am' ? 'የከበደነት ደረጃ:' : 'Difficulty:'} {course.difficulty}</span>
          </div>
        </div>
        <div className="lg:col-span-5 relative">
          <div className="h-64 sm:h-80 rounded-2xl overflow-hidden border border-[#C79A2B]/40 shadow-md bg-[#FAF6EF] flex items-center justify-center">
            <img
              src={course.image}
              alt={course.name}
              className="w-full h-full object-contain object-center"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </div>

      {/* Syllabus Layout Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-8">
          {/* Section Tabs */}
          <div className="flex border-b border-[#E7DED1] gap-4 overflow-x-auto pb-px">
            {(['overview', 'curriculum', 'pricing'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 text-xs sm:text-sm font-bold uppercase tracking-widest border-b-2 cursor-pointer transition-all whitespace-nowrap shrink-0 ${
                  activeTab === tab ? 'border-[#E89B52] text-[#E89B52]' : 'border-transparent text-[#666666] hover:text-[#2B2B2B]'
                }`}
              >
                {tab === 'overview' && (lang === 'am' ? 'የስልጠናው ውጤቶችና መስፈርቶች' : 'Outcomes & Rules')}
                {tab === 'curriculum' && (lang === 'am' ? 'ሳምንታዊ የትምህርት ዝርዝር' : 'Weekly Curriculum')}
                {tab === 'pricing' && (lang === 'am' ? 'የክፍያ አማራጮች' : 'Pricing Options')}
              </button>
            ))}
          </div>

          <div className="min-h-[250px]">
            {activeTab === 'overview' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="space-y-3">
                  <h3 className="text-base font-bold text-[#2B2B2B]">{lang === 'am' ? 'የሚማሩት ዋና ዋና ክህሎቶች' : 'What You Will Master'}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {course.learningOutcomes.map((outcome, i) => (
                      <div key={i} className="flex gap-2.5 items-start text-xs text-[#666666] bg-white border border-[#E7DED1] p-3 rounded-lg">
                        <CheckCircle size={14} className="text-green-500 shrink-0 mt-0.5" />
                        <span>{outcome}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-[#E7DED1]/50">
                  <h3 className="text-base font-bold text-[#2B2B2B]">{lang === 'am' ? 'የመግቢያ መስፈርቶች' : 'Requirements for Admission'}</h3>
                  <ul className="space-y-2.5 text-xs text-[#666666]">
                    {course.requirements.map((req, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="text-[#C79A2B]">•</span>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}

            {activeTab === 'curriculum' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                {course.curriculum.map((module, i) => (
                  <div key={i} className="border border-[#E7DED1] rounded-xl overflow-hidden bg-white">
                    <div className="bg-[#FAF6EF] px-5 py-3 border-b border-[#E7DED1] flex justify-between items-center">
                      <span className="text-[11px] font-bold text-[#C79A2B] uppercase tracking-widest">
                        {lang === 'am' ? module.week.replace('Week', 'ሳምንት') : module.week}
                      </span>
                      <h4 className="text-xs font-bold text-[#2B2B2B]">{module.title}</h4>
                    </div>
                    <div className="p-5 space-y-2">
                      <p className="text-[10px] font-bold uppercase text-gray-400">{lang === 'am' ? 'የሚሸፈኑ ዋና ዋና ርዕሶች:' : 'Core topics covered:'}</p>
                      <ul className="space-y-1.5">
                        {module.topics.map((topic, j) => (
                          <li key={j} className="text-xs text-[#666666] flex gap-2">
                            <span className="text-[#E89B52]">-</span>
                            <span>{topic}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === 'pricing' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {rawCourse.pricing.map((opt, i) => (
                    <div
                      key={i}
                      onClick={() => setSelectedPricing(i)}
                      className={`border p-5 rounded-xl cursor-pointer text-center space-y-2 transition-all ${
                        selectedPricing === i
                          ? 'border-[#E89B52] bg-[#FAF6EF]/50 ring-1 ring-[#E89B52]'
                          : 'border-[#E7DED1] bg-white hover:border-[#C79A2B]'
                      }`}
                    >
                      <p className="text-xs font-bold uppercase text-gray-500">
                        {lang === 'am' ? (opt.duration === '3 Months' ? '3 ወር' : opt.duration === '6 Months' ? '6 ወር' : '1 ዓመት') : opt.duration}
                      </p>
                      <p className="text-2xl font-black text-[#2B2B2B]">{opt.price} {lang === 'am' ? 'ብር' : 'ETB'}</p>
                      <p className="text-[10px] text-[#666666]">
                        {opt.period === 'per month' ? (lang === 'am' ? 'በየወሩ' : 'per month') : (lang === 'am' ? 'አጠቃላይ የኮርስ ክፍያ' : 'total course fee')}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="bg-[#FAF6EF]/40 p-4 rounded-xl border border-[#E7DED1] text-xs text-[#666666] flex justify-between">
                  <span>{lang === 'am' ? 'መደበኛ የአንድ ጊዜ የምዝገባ ክፍያ:' : 'Standard Registration Admission Fee (one-time):'}</span>
                  <span className="font-bold text-[#2B2B2B]">{rawCourse.registrationFee} {lang === 'am' ? 'ብር' : 'ETB'}</span>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Sidebar enrollment Form */}
        <div className="lg:col-span-4">
          <div className="bg-[#FAF6EF] border border-[#E7DED1] rounded-2xl p-6 shadow-sm space-y-5 text-left sticky top-24 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 opacity-10 bg-[#C79A2B] rounded-full blur-xl pointer-events-none" />
            
            <div className="space-y-1">
              {isComingSoon ? (
                <span className="text-[9px] font-bold uppercase tracking-widest text-amber-800 bg-amber-100 border border-amber-300 px-2.5 py-1 rounded-full inline-block">
                  {lang === 'am' ? 'በቅርቡ ይጠብቁን' : 'Curriculum Coming Soon'}
                </span>
              ) : (
                <span className="text-[9px] font-bold uppercase tracking-widest text-[#C79A2B] bg-white border px-2.5 py-1 rounded-full">
                  {lang === 'am' ? 'ምዝገባ ክፍት ነው' : 'Syllabus Admission Open'}
                </span>
              )}
              <h3 className="text-base font-display font-black text-[#2B2B2B] pt-1">
                {isComingSoon
                  ? (lang === 'am' ? 'ቀድመው እንዲያውቁ ይመዝገቡ' : 'Be First To Know')
                  : (lang === 'am' ? 'የሙዚቃ ጉዞዎን ይጀምሩ' : 'Start Your Musical Journey')}
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                {isComingSoon ? (
                  lang === 'am' ? (
                    <>የ <b>{course.name}</b> ሥርዓተ ትምህርት በሊቃውንትና በመምህራን እየተዘጋጀ ይገኛል።</>
                  ) : (
                    <>The <b>{course.name}</b> syllabus is currently being finalized with senior church deacons and traditional master performers.</>
                  )
                ) : (
                  lang === 'am' ? (
                    <>በዚህ የ <b>{course.name}</b> ትምህርት ይመዝገቡና በቀጥታ በዲያቆን ብሩክ ተስፋዬ ስር ይማሩ።</>
                  ) : (
                    <>Enroll in this structured <b>{course.name}</b> course and study directly under Deacon Bruk Tesfaye.</>
                  )
                )}
              </p>
            </div>

            <div className="space-y-3 pt-3 border-t border-[#E7DED1] text-xs">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">{lang === 'am' ? 'የአንድ ጊዜ ምዝገባ ክፍያ:' : 'Standard Reg Fee (One-Time):'}</span>
                <span className="font-bold text-[#2B2B2B]">{rawCourse.registrationFee} {lang === 'am' ? 'ብር' : 'ETB'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">{lang === 'am' ? 'የቆይታ አማራጮች:' : 'Class Duration Options:'}</span>
                <span className="font-bold text-[#2B2B2B]">{course.duration}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">{lang === 'am' ? 'የመማሪያ ዘዴዎች:' : 'Learning Formats:'}</span>
                <span className="font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded border border-green-200 text-[10px]">
                  {lang === 'am' ? 'በአካል እና በኦንላይን' : 'In-Person & Online'}
                </span>
              </div>
            </div>

            {isComingSoon ? (
              <div className="pt-2 space-y-3">
                <div className="bg-amber-50/90 border border-amber-200 rounded-xl p-3 text-xs text-amber-950 space-y-1">
                  <div className="font-bold flex items-center gap-1.5 text-amber-800 text-[11px]">
                    <Sparkles size={13} /> {lang === 'am' ? 'ምዝገባ በቅርቡ ይከፈታል' : 'Admissions Opening Soon'}
                  </div>
                  <p className="text-[10px] text-amber-900 leading-relaxed">
                    {lang === 'am'
                      ? 'ምዝገባው ሲከፈት በቅድሚያ እንዲደርሶትና የቅናሽ ተጠቃሚ እንዲሆኑ በመጠባበቂያ ዝርዝር ውስጥ ይመዝገቡ።'
                      : 'Join the priority waitlist to secure your spot with an early-bird discount when registrations launch.'}
                  </p>
                </div>
                <Button
                  variant="primary"
                  className="w-full text-xs font-bold uppercase py-3 shadow-md bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white border-0 cursor-pointer"
                  onClick={() => setComingSoonModalOpen(true)}
                >
                  {lang === 'am' ? 'በመጠባበቂያ ዝርዝር ውስጥ ይመዝገቡ' : 'Join Early Access Waitlist'}
                </Button>
                <div className="pt-2 space-y-2 border-t border-[#E7DED1]">
                  <p className="text-[9px] font-bold uppercase text-gray-400 text-center tracking-wider">
                    {lang === 'am' ? 'በአሁኑ ሰዓት የሚሰጡ ትምህርቶች' : 'Available Active Courses'}
                  </p>
                  <Button
                    variant="secondary"
                    className="w-full text-[11px] font-bold uppercase py-2 text-[#6F4E37] border-[#C79A2B]"
                    onClick={() => onNavigate('course-detail', { courseId: 'begena' })}
                  >
                    {lang === 'am' ? 'የበገና ትምህርት ይመዝገቡ' : 'Enroll In Begena Course'}
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full text-[11px] font-bold uppercase py-1.5 text-[#6F4E37]"
                    onClick={() => onNavigate('course-detail', { courseId: 'krar' })}
                  >
                    {lang === 'am' ? 'የክራር ትምህርት ይመዝገቡ' : 'Enroll In Krar Course'}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="pt-2">
                <Button
                  variant="primary"
                  className="w-full text-xs font-bold uppercase py-3 shadow-md animate-pulse"
                  onClick={() => {
                    if (currentUser?.role === 'teacher') {
                      onNavigate('teacher');
                    } else if (currentUser && currentUser.role !== 'student') {
                      onNavigate(currentUser.role as PageId);
                    } else {
                      onNavigate('student-registration', { courseId: rawCourse.id });
                    }
                  }}
                >
                  {lang === 'am' ? 'አሁን ይመዝገቡ' : 'Enroll In Course Now'}
                </Button>
                <p className="text-[10px] text-gray-400 text-center mt-3 leading-relaxed">
                  {lang === 'am'
                    ? 'የምዝገባ ሥርዓታችን የንግድ ባንክ (CBE)፣ ቴሌብር እና በቅርንጫፍ የሚደረግ የጥሬ ገንዘብ ክፍያዎችን ይቀበላል።'
                    : 'Our enrollment wizard supports CBE Transfer, Telebirr Wallet, and Cash Payments at physical office branches.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Coming Soon Waitlist Modal */}
      <CourseComingSoonModal
        course={rawCourse}
        isOpen={comingSoonModalOpen}
        onClose={() => setComingSoonModalOpen(false)}
        onSelectActiveCourse={(id) => onNavigate('course-detail', { courseId: id })}
        lang={lang}
      />
    </motion.div>
  );
}

// ==========================================
// 5. TEACHERS PAGE
// ==========================================
export function TeachersPage({ lang, onNavigate }: PageProps) {
  const [instrumentFilter, setInstrumentFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredTeachers = useMemo(() => {
    return TEACHERS_DATA.filter((t) => {
      const locTeacher = getLocalizedTeacher(t, lang);
      const matchesSearch = locTeacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            locTeacher.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            t.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesInstrument = instrumentFilter === 'All' || t.instrument.includes(instrumentFilter);
      return matchesSearch && matchesInstrument;
    });
  }, [searchQuery, instrumentFilter, lang]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-8 py-6 text-left"
    >
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <h1 className="font-display font-black text-3xl sm:text-4xl text-[#2B2B2B] tracking-tight">
          {lang === 'am' ? 'የተከበሩ መምህራኖቻችን' : 'Our Master Instructors'}
        </h1>
        <p className="text-xs sm:text-sm text-[#666666]">
          {lang === 'am'
            ? 'የዘመናት ጥበብን ጠብቀው በሚያስተላልፉ ሊቃውንት፣ ዲያቆናትና ተመራማሪዎች ስር ይማሩ።'
            : 'Learn from internationally certified curators, liturgical deacons, and research authors preserving centuries-old methods.'}
        </p>
      </div>

      <div className="bg-white border border-[#E7DED1] rounded-2xl p-4 sm:p-6 shadow-xs grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
        <div className="sm:col-span-6 space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-wider text-[#666666]">
            {lang === 'am' ? 'መምህራንን ይፈልጉ' : 'Search Instructor'}
          </label>
          <Input
            placeholder={lang === 'am' ? 'የአስተማሪውን ስም ይፈልጉ...' : 'Search Teacher name...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search size={16} className="text-gray-400" />}
          />
        </div>

        <div className="sm:col-span-4 space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-wider text-[#666666]">
            {lang === 'am' ? 'የዜማ መሣሪያ ልዩ ሙያ' : 'Instrument Specialty'}
          </label>
          <select
            value={instrumentFilter}
            onChange={(e) => setInstrumentFilter(e.target.value)}
            className="w-full h-10 px-3 bg-white border border-[#E7DED1] rounded-md text-sm outline-none focus:border-[#C79A2B]"
          >
            <option value="All">{lang === 'am' ? 'ሁሉም የዜማ መሳሪያዎች' : 'All Specialties'}</option>
            <option value="Begena">{lang === 'am' ? 'በገና' : 'Begena'}</option>
            <option value="Krar">{lang === 'am' ? 'ክራር' : 'Krar'}</option>
            <option value="Masenqo">{lang === 'am' ? 'ማሲንቆ' : 'Masenqo'}</option>
            <option value="Washint">{lang === 'am' ? 'ዋሽንት' : 'Washint'}</option>
            <option value="Kebero">{lang === 'am' ? 'ከበሮ' : 'Kebero'}</option>
          </select>
        </div>

        <div className="sm:col-span-2">
          <Button
            variant="ghost"
            onClick={() => {
              setSearchQuery('');
              setInstrumentFilter('All');
            }}
            className="w-full text-xs font-bold h-10 uppercase text-gray-500"
          >
            {lang === 'am' ? 'አጥራ' : 'Clear'}
          </Button>
        </div>
      </div>

      {/* Teachers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTeachers.map((rawTeacher) => {
          const teacher = getLocalizedTeacher(rawTeacher, lang);
          return (
            <div
              key={teacher.id}
              className="bg-white border border-[#E7DED1] rounded-2xl overflow-hidden shadow-xs hover:shadow-md hover:border-[#C79A2B] transition-all flex flex-col group"
            >
              <div className="h-48 overflow-hidden relative bg-[#2B2B2B]">
                {teacher.photo ? (
                  <img
                    src={teacher.photo}
                    alt={teacher.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#3B2818] via-[#2D1E12] to-[#1C120A] flex flex-col items-center justify-center text-[#E89B52] group-hover:scale-105 transition-transform duration-300">
                    <div className="w-16 h-16 rounded-full bg-[#E89B52]/15 border border-[#E89B52]/30 flex items-center justify-center mb-1.5 shadow-inner">
                      <span className="font-display font-black text-2xl text-[#E89B52]">
                        {teacher.name?.charAt(0) || 'T'}
                      </span>
                    </div>
                    <span className="text-[10px] uppercase tracking-widest text-[#E89B52]/90 font-bold">
                      {lang === 'am' ? 'የተከበረ መምህር' : 'Master Instructor'}
                    </span>
                  </div>
                )}
                <div className="absolute top-3 right-3 bg-white/95 text-[#C79A2B] px-2.5 py-1 rounded-full text-[10px] font-bold border border-[#E7DED1] uppercase">
                  {teacher.instrument}
                </div>
              </div>
              <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-[#2B2B2B]">{teacher.name}</h3>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#E89B52]">{teacher.specialization}</p>
                  <p className="text-xs text-[#666666] leading-relaxed line-clamp-3">{teacher.bio}</p>
                </div>

                <div className="pt-3 border-t border-[#E7DED1]/60 flex items-center justify-between">
                  <span className="text-[10px] font-medium text-gray-400">{teacher.experience}</span>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="text-xs font-bold uppercase"
                    onClick={() => onNavigate('teacher-profile', { teacherId: teacher.id })}
                  >
                    {lang === 'am' ? 'መገለጫ ይመልከቱ' : 'VIEW PROFILE'}
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

// ==========================================
// 6. TEACHER PROFILE PAGE
// ==========================================
export function TeacherProfilePage({ lang, onNavigate, params }: PageProps) {
  const teacherId = params?.teacherId || 'abel';
  const rawTeacher = useMemo(() => {
    return TEACHERS_DATA.find((t) => t.id === teacherId) || TEACHERS_DATA[0];
  }, [teacherId]);

  const teacher = useMemo(() => {
    return getLocalizedTeacher(rawTeacher, lang);
  }, [rawTeacher, lang]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-10 py-6 text-left"
    >
      {/* Breadcrumbs */}
      <div className="flex items-center gap-1.5 text-xs text-[#666666]">
        <span className="hover:text-[#2B2B2B] cursor-pointer" onClick={() => onNavigate('home')}>{lang === 'am' ? 'ዋና ገጽ' : 'Home'}</span>
        <ChevronRight size={12} />
        <span className="hover:text-[#2B2B2B] cursor-pointer" onClick={() => onNavigate('teachers')}>{lang === 'am' ? 'አስተማሪዎች' : 'Teachers'}</span>
        <ChevronRight size={12} />
        <span className="font-bold text-[#E89B52]">{teacher.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left column info */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-[#E7DED1] rounded-2xl overflow-hidden p-6 text-center space-y-4 shadow-sm">
            <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-[#C79A2B] mx-auto shadow-md">
              {teacher.photo ? (
                <img
                  src={teacher.photo}
                  alt={teacher.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#3B2818] to-[#1C120A] flex items-center justify-center text-[#E89B52] font-display font-black text-4xl shadow-inner">
                  {teacher.name?.charAt(0) || 'T'}
                </div>
              )}
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-[#2B2B2B]">{teacher.name}</h2>
              <p className="text-xs font-semibold text-[#E89B52] uppercase tracking-wider">{teacher.instrument}</p>
              <p className="text-[10px] text-gray-400">{teacher.experience}</p>
            </div>
            <div className="pt-3 border-t border-[#E7DED1] flex flex-col gap-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-400">{lang === 'am' ? 'ዋና ትኩረት:' : 'Main Focus:'}</span>
                <span className="font-bold text-[#2B2B2B]">{teacher.specialization.split(',')[0]}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right column detailed story */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white border border-[#E7DED1] rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-[#2B2B2B] uppercase tracking-wider">{lang === 'am' ? 'የህይወት ታሪክ' : 'Biography'}</h3>
              <p className="text-sm text-[#666666] leading-relaxed">{teacher.bio}</p>
            </div>

            <div className="space-y-3 pt-4 border-t border-[#E7DED1]/60">
              <h4 className="text-sm font-bold text-[#2B2B2B] uppercase tracking-wider">{lang === 'am' ? 'የሚያስተምሯቸው ኮርሶች' : 'Programs Managed'}</h4>
              <div className="flex flex-wrap gap-2">
                {teacher.coursesTaught.map((courseName, idx) => (
                  <span key={idx} className="text-xs font-bold bg-[#FAF6EF] text-[#C79A2B] px-3 py-1.5 rounded-lg border border-[#E7DED1]">
                    {courseName}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-[#E7DED1]/60">
              <h4 className="text-sm font-bold text-[#2B2B2B] uppercase tracking-wider">{lang === 'am' ? 'የክፍል ሰዓቶች' : 'Available Slots & Classes'}</h4>
              <div className="space-y-2.5">
                {teacher.availableClasses.map((cl, i) => (
                  <div key={i} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 bg-[#FAF6EF]/55 border border-[#E7DED1] rounded-xl text-xs gap-3">
                    <span className="font-semibold text-[#6F4E37]">{cl}</span>
                    <Button variant="primary" size="sm" className="text-[10px] font-bold tracking-widest uppercase cursor-pointer" onClick={() => onNavigate('courses', { instrument: teacher.instrument })}>
                      {lang === 'am' ? 'ቦታ ያስይዙ' : 'REQUEST SLOT'}
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Testimonials */}
            {teacher.reviews.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-[#E7DED1]/60">
                <h4 className="text-sm font-bold text-[#2B2B2B] uppercase tracking-wider">{lang === 'am' ? 'የተማሪዎች ምስክርነት' : 'Student Endorsements'}</h4>
                <div className="space-y-3">
                  {teacher.reviews.map((rev, idx) => (
                    <div key={idx} className="border border-[#E7DED1] p-4 rounded-xl bg-[#FAF6EF]/20 space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-[#2B2B2B]">{rev.studentName}</span>
                        <span className="text-[#C79A2B]">★ {rev.rating}/5</span>
                      </div>
                      <p className="text-xs text-[#666666] italic leading-relaxed">"{rev.comment}"</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ==========================================
// 7. GALLERY PAGE
// ==========================================
export function GalleryPage({ lang }: PageProps) {
  const t = TRANSLATIONS[lang];
  const { mediaAssets, mediaCategories } = useData();
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [lightboxImage, setLightboxImage] = useState<any | null>(null);

  const categories = useMemo(() => {
    const baseCats = mediaCategories && mediaCategories.length > 0 ? mediaCategories : ['Begena', 'Krar', 'Masenqo', 'Washint', 'Students', 'Events', 'Graduation', 'Teachers'];
    // Collect any unique category present in mediaAssets
    const activeMediaCats = Array.from(new Set(mediaAssets.map(m => m.category).filter(Boolean)));
    const merged = Array.from(new Set([...baseCats, ...activeMediaCats]));
    return ['All', ...merged];
  }, [mediaCategories, mediaAssets]);

  // Combine static GALLERY_DATA with dynamic persistent mediaAssets uploaded by Founder
  const allGalleryItems = useMemo<GalleryItem[]>(() => {
    const publishedPersistent: GalleryItem[] = mediaAssets
      .filter((m) => {
        const isPub = m.status ? m.status === 'Published' : m.isPublished;
        return isPub;
      })
      .map((m) => ({
        id: m.id,
        url: m.url,
        category: m.category,
        title: m.title,
        description: m.caption || m.altText || '',
        date: m.photoDate || m.uploadedAt?.split('T')[0],
        location: m.location
      }));

    return publishedPersistent;
  }, [mediaAssets]);

  const filteredItems = useMemo(() => {
    if (selectedFilter === 'All') return allGalleryItems;
    return allGalleryItems.filter((item) => item.category === selectedFilter);
  }, [selectedFilter, allGalleryItems]);

  const handleNextImage = () => {
    if (!lightboxImage) return;
    const currentIndex = filteredItems.findIndex(i => i.id === lightboxImage.id);
    const nextIndex = (currentIndex + 1) % filteredItems.length;
    setLightboxImage(filteredItems[nextIndex]);
  };

  const handlePrevImage = () => {
    if (!lightboxImage) return;
    const currentIndex = filteredItems.findIndex(i => i.id === lightboxImage.id);
    const prevIndex = (currentIndex - 1 + filteredItems.length) % filteredItems.length;
    setLightboxImage(filteredItems[prevIndex]);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxImage) return;
      if (e.key === 'ArrowRight') handleNextImage();
      if (e.key === 'ArrowLeft') handlePrevImage();
      if (e.key === 'Escape') setLightboxImage(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxImage, filteredItems]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-8 py-6 text-left"
    >
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <h1 className="font-display font-black text-3xl sm:text-4xl text-[#2B2B2B] tracking-tight">{t.galleryPage.title}</h1>
        <p className="text-xs sm:text-sm text-[#666666]">{t.galleryPage.subtitle}</p>
        <div className="inline-flex items-center gap-2 bg-[#FAF6EF] border border-[#E7DED1] px-3 py-1 rounded-full text-[11px] font-medium text-[#C79A2B]">
          <span>{t.galleryPage.curatedBadge}</span>
        </div>
      </div>

      {/* Categories Toggle */}
      <div className="flex flex-wrap gap-2 justify-center bg-[#FAF6EF] p-1.5 rounded-xl border border-[#E7DED1]/70 max-w-4xl mx-auto">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedFilter(cat)}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
              selectedFilter === cat ? 'bg-white text-[#E89B52] shadow-sm font-extrabold scale-102' : 'text-[#666666] hover:text-[#2B2B2B]'
            }`}
          >
            {tr(cat, lang)}
          </button>
        ))}
      </div>

      {/* Grid or Empty State */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-20 px-6 bg-white border border-[#E7DED1] rounded-2xl max-w-xl mx-auto space-y-3 shadow-xs">
          <div className="w-14 h-14 rounded-full bg-[#FAF6EF] text-[#E89B52] border border-[#E7DED1] flex items-center justify-center mx-auto">
            <Sparkles size={24} />
          </div>
          <h3 className="font-display font-bold text-lg text-[#2B2B2B]">
            {lang === 'am' ? 'በማዕከለ-ስዕላቱ ውስጥ ምንም ምስሎች የሉም' : 'No Pictures in Media Gallery'}
          </h3>
          <p className="text-xs text-[#666666] max-w-sm mx-auto leading-relaxed">
            {lang === 'am'
              ? 'ሁሉም የቀድሞ ምስሎች ተነስተዋል። አዳዲስ ምስሎችና ፎቶዎች በቅርቡ ይጫናሉ።'
              : 'All previous pictures have been removed. New recital and campus moments will be published soon.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setLightboxImage(item)}
              className="group border border-[#E7DED1] rounded-2xl overflow-hidden bg-white shadow-xs cursor-pointer card-interactive flex flex-col justify-between"
            >
              <div className="h-56 overflow-hidden relative img-zoom-wrapper">
                <img
                  src={item.url}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 ease-out"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <div className="bg-white/95 backdrop-blur-xs px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border border-[#E7DED1] text-[#E89B52] shadow-2xs">
                    {tr(item.category, lang)}
                  </div>
                  {item.imgNum && (
                    <div className="bg-[#2B2B2B]/80 text-white backdrop-blur-xs px-2 py-0.5 rounded-full text-[9px] font-mono font-bold tracking-tight shadow-2xs">
                      IMG{item.imgNum}
                    </div>
                  )}
                </div>
              </div>
              <div className="p-4 space-y-1">
                <h3 className="text-sm font-bold text-[#2B2B2B] group-hover:text-[#E89B52] transition-colors">{tr(item.title, lang)}</h3>
                <p className="text-xs text-[#666666] line-clamp-1">{tr(item.description, lang)}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxImage && (
          <div className="fixed inset-0 bg-[#2B2B2B]/90 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn">
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="bg-white max-w-3xl w-full rounded-2xl overflow-hidden border border-[#E7DED1] shadow-2xl relative"
            >
              {/* Close Button */}
              <button
                onClick={() => setLightboxImage(null)}
                className="absolute top-4 right-4 bg-white/90 text-[#2B2B2B] hover:bg-[#FAF6EF] p-2 rounded-full border border-[#E7DED1] cursor-pointer z-20 shadow-md transition-transform active:scale-90"
                title="Close (Esc)"
              >
                <X size={18} />
              </button>

              {/* Prev Button */}
              <button
                onClick={handlePrevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 text-[#2B2B2B] hover:bg-[#FAF6EF] p-2.5 rounded-full border border-[#E7DED1] cursor-pointer z-20 shadow-md transition-transform hover:scale-110 active:scale-90"
                title="Previous Image (←)"
              >
                <ChevronLeft size={20} />
              </button>

              {/* Next Button */}
              <button
                onClick={handleNextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 text-[#2B2B2B] hover:bg-[#FAF6EF] p-2.5 rounded-full border border-[#E7DED1] cursor-pointer z-20 shadow-md transition-transform hover:scale-110 active:scale-90"
                title="Next Image (→)"
              >
                <ChevronRight size={20} />
              </button>

              <div className="max-h-[65vh] overflow-hidden bg-black/5 flex items-center justify-center">
                <img
                  src={lightboxImage.url}
                  alt={lightboxImage.title}
                  className="w-full h-full object-contain max-h-[65vh]"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="p-6 space-y-2 text-left bg-white">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold text-[#E89B52] bg-[#FAF6EF] border border-[#E7DED1] px-2.5 py-0.5 rounded-full">
                    {tr(lightboxImage.category, lang).toUpperCase()}
                  </span>
                  {lightboxImage.imgNum && (
                    <span className="text-[10px] font-mono font-bold bg-[#2B2B2B] text-white px-2.5 py-0.5 rounded-full">
                      FILE SLOT: IMG{lightboxImage.imgNum}
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-bold text-[#2B2B2B]">{tr(lightboxImage.title, lang)}</h3>
                <p className="text-xs text-[#666666] leading-relaxed">{tr(lightboxImage.description, lang)}</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ==========================================
// 8. EVENTS PAGE
// ==========================================
export function EventsPage({ lang, onNavigate }: PageProps) {
  const t = TRANSLATIONS[lang];
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  const filteredEvents = useMemo(() => {
    return EVENTS_DATA.filter((e) => (activeTab === 'upcoming' ? e.isUpcoming : !e.isUpcoming));
  }, [activeTab]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-8 py-6 text-left"
    >
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <h1 className="font-display font-black text-3xl sm:text-4xl text-[#2B2B2B] tracking-tight">{t.eventsPage.title}</h1>
        <p className="text-xs sm:text-sm text-[#666666]">{t.eventsPage.subtitle}</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#E7DED1] gap-6 max-w-xs mx-auto justify-center">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`pb-3 text-sm font-bold uppercase tracking-wider border-b-2 cursor-pointer transition-all ${
            activeTab === 'upcoming' ? 'border-[#E89B52] text-[#E89B52]' : 'border-transparent text-[#666666] hover:text-[#2B2B2B]'
          }`}
        >
          {t.eventsPage.upcomingTab}
        </button>
        <button
          onClick={() => setActiveTab('past')}
          className={`pb-3 text-sm font-bold uppercase tracking-wider border-b-2 cursor-pointer transition-all ${
            activeTab === 'past' ? 'border-[#E89B52] text-[#E89B52]' : 'border-transparent text-[#666666] hover:text-[#2B2B2B]'
          }`}
        >
          {t.eventsPage.pastTab}
        </button>
      </div>

      {/* Event Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((evt) => (
          <div
            key={evt.id}
            className="bg-white border border-[#E7DED1] rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group h-full justify-between"
          >
            <div>
              <div className="h-44 overflow-hidden relative">
                <img
                  src={evt.image}
                  alt={evt.title}
                  className="w-full h-full object-cover group-hover:scale-103 transition-all duration-300"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 bg-white/95 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider border border-[#E7DED1] text-[#C79A2B]">
                  {tr(evt.category, lang)}
                </div>
              </div>
              <div className="p-5 space-y-2">
                <div className="flex gap-2 text-[10px] text-gray-400 font-semibold uppercase">
                  <span>{tr(evt.date, lang)}</span>
                  <span>•</span>
                  <span>{tr(evt.time, lang)}</span>
                </div>
                <h3 className="text-base font-bold text-[#2B2B2B] leading-snug">{tr(evt.title, lang)}</h3>
                <p className="text-xs text-[#666666] leading-relaxed line-clamp-3">{tr(evt.shortDescription, lang)}</p>
              </div>
            </div>

            <div className="p-5 pt-0 border-t border-[#E7DED1]/40 flex flex-col gap-2">
              <div className="text-[10px] text-gray-500 font-medium py-2 flex items-center gap-1.5">
                <MapPin size={11} className="text-[#E89B52]" />
                <span className="line-clamp-1">{tr(evt.location, lang)}</span>
              </div>
              <Button
                variant="secondary"
                size="sm"
                className="w-full text-xs font-bold uppercase cursor-pointer"
                onClick={() => onNavigate('event-detail', { eventId: evt.id })}
              >
                {t.eventsPage.viewDetail}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ==========================================
// 9. EVENT DETAIL PAGE
// ==========================================
export function EventDetailPage({ lang, onNavigate, params }: PageProps) {
  const t = TRANSLATIONS[lang];
  const eventId = params?.eventId || 'spiritual-begena-night';
  const event = useMemo(() => {
    return EVENTS_DATA.find((e) => e.id === eventId) || EVENTS_DATA[0];
  }, [eventId]);

  const [rsvpFormSubmitted, setRsvpFormSubmitted] = useState<boolean>(false);
  const [attendeeName, setAttendeeName] = useState<string>('');

  const handleRsvp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!attendeeName) return;
    setRsvpFormSubmitted(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-10 py-6 text-left"
    >
      {/* Breadcrumbs */}
      <div className="flex items-center gap-1.5 text-xs text-[#666666]">
        <span className="hover:text-[#2B2B2B] cursor-pointer" onClick={() => onNavigate('home')}>{t.nav.home}</span>
        <ChevronRight size={12} />
        <span className="hover:text-[#2B2B2B] cursor-pointer" onClick={() => onNavigate('events')}>{t.nav.events}</span>
        <ChevronRight size={12} />
        <span className="font-bold text-[#E89B52]">{tr(event.title, lang)}</span>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        <div className="lg:col-span-8 space-y-6">
          <div className="rounded-2xl overflow-hidden border border-[#C79A2B]/20 shadow-md h-80 sm:h-96">
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="space-y-4">
            <div className="flex gap-2 items-center">
              <span className="bg-[#FAF6EF] text-[#E89B52] border border-[#E7DED1] px-2.5 py-1 rounded-full text-[10px] font-bold uppercase">
                {tr(event.category, lang)}
              </span>
              <span className="text-xs text-[#666666] font-semibold">{tr(event.date, lang)}</span>
            </div>
            <h1 className="font-display font-black text-2xl sm:text-3xl text-[#2B2B2B] leading-tight">{tr(event.title, lang)}</h1>
            <p className="text-sm text-[#666666] leading-relaxed">{tr(event.fullDescription, lang)}</p>
          </div>

          {/* Speaker or performers panel */}
          <div className="bg-[#FAF6EF]/70 p-6 rounded-xl border border-[#E7DED1] space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#E89B52]">{t.eventsPage.hostedBy}</h4>
            <p className="text-sm font-bold text-[#2B2B2B]">{tr(event.speakerOrPerformer, lang)}</p>
          </div>
        </div>

        {/* Sidebar RSVP Card */}
        <div className="lg:col-span-4">
          <div className="bg-white border border-[#E7DED1] rounded-2xl p-6 shadow-sm space-y-5 sticky top-24">
            <div className="space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-widest text-[#2B2B2B] border-b border-[#FAF6EF] pb-2">
                {t.eventsPage.logistics}
              </h3>
              <div className="space-y-3.5 text-xs text-[#666666]">
                <div className="flex gap-2 items-start">
                  <Clock size={14} className="text-[#E89B52] shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-[#2B2B2B]">{t.eventsPage.timeSchedule}</h5>
                    <p>{tr(event.time, lang)}</p>
                  </div>
                </div>
                <div className="flex gap-2 items-start">
                  <MapPin size={14} className="text-[#E89B52] shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-[#2B2B2B]">{t.eventsPage.location}</h5>
                    <p>{tr(event.location, lang)}</p>
                  </div>
                </div>
              </div>
            </div>

            {event.isUpcoming ? (
              <div className="pt-4 border-t border-[#E7DED1] space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#2B2B2B]">{t.eventsPage.rsvpTitle}</h4>
                {rsvpFormSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-4 bg-green-50 border border-green-200 rounded-xl text-center space-y-2 text-xs"
                  >
                    <span className="text-2xl">🎉</span>
                    <h5 className="font-bold text-green-800">{t.eventsPage.seatReserved}</h5>
                    <p className="text-green-700">
                      {lang === 'am' ? `እናመሰግናለን ${attendeeName}። መቀመጫዎ ተይዟል። በዝግጅቱ ላይ በደስታ እንጠብቅዎታለን!` : `Thank you, ${attendeeName}. Your seat is saved. We look forward to hosting you!`}
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleRsvp} className="space-y-3">
                    <Input
                      type="text"
                      placeholder={t.contactPage.yourName}
                      required
                      value={attendeeName}
                      onChange={(e) => setAttendeeName(e.target.value)}
                    />
                    <Button type="submit" variant="primary" className="w-full text-xs font-bold uppercase">
                      {t.eventsPage.reserveBtn}
                    </Button>
                  </form>
                )}
              </div>
            ) : (
              <div className="p-4 bg-gray-50 border border-gray-100 rounded-xl text-center space-y-1 text-xs text-gray-500">
                <span>{t.eventsPage.pastClosed}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ==========================================
// 10. CONTACT PAGE
// ==========================================
export function ContactPage({ lang }: PageProps) {
  const t = TRANSLATIONS[lang];
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '', branch: 'piazza' });
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setSubmitSuccess(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-10 py-6 text-left"
    >
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <h1 className="font-display font-black text-3xl sm:text-4xl text-[#2B2B2B] tracking-tight">{t.contactPage.title}</h1>
        <p className="text-xs sm:text-sm text-[#666666]">{t.contactPage.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Contact Form */}
        <div className="lg:col-span-7 bg-white border border-[#E7DED1] p-6 sm:p-8 rounded-2xl shadow-sm space-y-6">
          <h2 className="text-lg font-display font-bold text-[#2B2B2B] uppercase tracking-wider">{t.contactPage.leaveMessage}</h2>

          {submitSuccess ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-6 bg-green-50 rounded-xl border border-green-200 text-center space-y-3"
            >
              <span className="text-3xl text-green-500">✓</span>
              <h4 className="text-sm font-bold text-green-800">{t.contactPage.sentTitle}</h4>
              <p className="text-xs text-green-700 leading-relaxed">
                {lang === 'am' ? (
                  <>እናመሰግናለን <strong>{formData.name}</strong>። ስለ <strong>"{formData.subject || 'የሥርዓተ-ትምህርት ጥያቄ'}"</strong> የላኩት መልዕክት ለ<strong>{tr(formData.branch, lang)}</strong> ቢሯችን ደርሷል።</>
                ) : (
                  <>Thank you, <strong>{formData.name}</strong>. Your request regarding <strong>"{formData.subject || 'Syllabus Enquiry'}"</strong> has been sent to our <strong>{formData.branch.toUpperCase()}</strong> administration desks.</>
                )}
              </p>
              <p className="text-[10px] text-gray-500">{t.contactPage.sentFollowup}</p>
              <Button variant="secondary" size="sm" className="text-[10px] uppercase font-bold" onClick={() => setSubmitSuccess(false)}>
                {t.contactPage.sendAnother}
              </Button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#666666] uppercase">{t.contactPage.yourName}</label>
                  <Input
                    type="text"
                    required
                    placeholder="Almaz Tesfaye"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#666666] uppercase">{t.contactPage.emailAddress}</label>
                  <Input
                    type="email"
                    required
                    placeholder="almaz@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#666666] uppercase">{t.contactPage.phoneNumber}</label>
                  <Input
                    type="tel"
                    placeholder="+251 911 223344"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#666666] uppercase">{t.contactPage.subject}</label>
                  <Input
                    type="text"
                    required
                    placeholder={lang === 'am' ? 'ለምሳሌ፡ የበገና ኪራይ ጥያቄ' : 'e.g. Begena Rental Enquiry'}
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#666666] uppercase">{t.contactPage.selectBranch}</label>
                <select
                  value={formData.branch}
                  onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                  className="w-full h-10 px-3 bg-white border border-[#E7DED1] rounded-md text-sm outline-none focus:border-[#C79A2B]"
                >
                  <option value="hawassa">{t.contactPage.hawassa || (lang === 'am' ? 'የሐዋሳ ካምፓስ (ሴንተር ፖይንት ታወር 1ኛ ፎቅ)' : 'Hawassa Campus (Center Point Tower, 1st Floor)')}</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#666666] uppercase">{t.contactPage.yourMessage}</label>
                <textarea
                  required
                  rows={4}
                  placeholder={t.contactPage.messagePlaceholder}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full p-3 bg-white border border-[#E7DED1] rounded-md text-sm outline-none focus:border-[#C79A2B]"
                />
              </div>

              <Button type="submit" variant="primary" className="w-full text-xs font-bold uppercase py-3">
                {t.contactPage.dispatchBtn}
              </Button>
            </form>
          )}
        </div>

        {/* Branch coordinates sidebar */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#FAF6EF]/80 border border-[#E7DED1] p-6 rounded-2xl space-y-5">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#E89B52]">{t.contactPage.hubCoordinates}</h3>
            <div className="space-y-4">
              {BRANCHES_DATA.map((br) => (
                <div key={br.id} className="border border-[#E7DED1] p-4 rounded-xl bg-white space-y-2 text-xs">
                  <h4 className="font-bold text-[#2B2B2B]">{tr(br.name, lang)}</h4>
                  <div className="space-y-1 text-[#666666]">
                    <p className="flex items-center gap-1.5"><MapPin size={12} className="text-[#C79A2B]" /> {tr(br.location, lang)}</p>
                    <p className="flex items-center gap-1.5"><Phone size={12} className="text-[#C79A2B]" /> {br.phone}</p>
                    <p className="flex items-center gap-1.5"><Mail size={12} className="text-[#C79A2B]" /> {br.email}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ==========================================
// 11. DONATE PAGE
// ==========================================
export function DonatePage({ lang }: PageProps) {
  const t = TRANSLATIONS[lang];
  const [selectedAmount, setSelectedAmount] = useState<number>(500);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [donorName, setDonorName] = useState<string>('');
  const [paymentSubmitted, setPaymentSubmitted] = useState<boolean>(false);

  const presets = [200, 500, 1000, 2500, 5000];

  const handleDonate = (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentSubmitted(true);
  };

  const finalAmount = customAmount ? parseFloat(customAmount) : selectedAmount;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-10 py-6 text-left"
    >
      <div className="bg-[#2B2B2B] text-white p-8 sm:p-12 rounded-3xl relative overflow-hidden border border-[#C79A2B]/40">
        <div className="absolute inset-0 opacity-[0.05] bg-dot-pattern pointer-events-none" />
        <div className="max-w-2xl space-y-4 relative z-10">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#E89B52] border border-[#E89B52]/30 px-2.5 py-1 rounded-full">
            {t.donatePage.badge}
          </span>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight">{t.donatePage.title}</h1>
          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
            {t.donatePage.subtitle}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Donation Form */}
        <div className="lg:col-span-8 bg-white border border-[#E7DED1] p-6 sm:p-8 rounded-2xl shadow-xs space-y-6">
          {paymentSubmitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-8 text-center space-y-4 bg-green-50 rounded-xl border border-green-200"
            >
              <span className="text-4xl">🕊️</span>
              <h3 className="text-lg font-bold text-green-800">{t.donatePage.thankTitle}</h3>
              <p className="text-xs text-green-700 leading-relaxed">
                {lang === 'am' ? (
                  <>እናመሰግናለን <strong>{donorName || 'ክቡር ደጋፊ'}</strong>። ላበረከቱት <strong>{finalAmount} ብር</strong> የድጋፍ ስጦታ በባንክ ዝውውር መዝገብ ተይዟል።</>
                ) : (
                  <>Thank you, <strong>{donorName || 'Generous Supporter'}</strong>, for your beautiful contribution of <strong>{finalAmount} ETB</strong>. Your funding has been processed as a pending bank mock token.</>
                )}
              </p>
              <p className="text-[11px] text-gray-500 leading-relaxed">
                {t.donatePage.thankDesc}
              </p>
              <Button variant="secondary" size="sm" onClick={() => { setPaymentSubmitted(false); setCustomAmount(''); setDonorName(''); }}>
                {t.donatePage.returnBtn}
              </Button>
            </motion.div>
          ) : (
            <form onSubmit={handleDonate} className="space-y-6">
              {/* Presets Grid */}
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-[#666666] uppercase tracking-wider">{t.donatePage.selectAmount}</label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                  {presets.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => { setSelectedAmount(preset); setCustomAmount(''); }}
                      className={`py-3 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                        selectedAmount === preset && !customAmount
                          ? 'border-[#E89B52] bg-[#FAF6EF] text-[#E89B52] font-black'
                          : 'border-[#E7DED1] bg-white text-[#2B2B2B] hover:border-[#C79A2B]'
                      }`}
                    >
                      {preset} {lang === 'am' ? 'ብር' : 'ETB'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom amount field */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#666666] uppercase">{t.donatePage.customAmount}</label>
                <Input
                  type="number"
                  placeholder="e.g. 10000"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  leftIcon={<DollarSign size={16} className="text-gray-400" />}
                />
              </div>

              <div className="space-y-3 pt-4 border-t border-[#E7DED1]/60">
                <h4 className="text-xs font-bold uppercase text-[#2B2B2B] tracking-wider">{t.donatePage.donorDetails}</h4>
                <div className="space-y-3">
                  <Input
                    placeholder={t.donatePage.fullName}
                    required
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    leftIcon={<User size={16} className="text-gray-400" />}
                  />
                </div>
              </div>

              {/* Mock Payment Integration selection */}
              <div className="space-y-2.5">
                <label className="text-[10px] font-bold text-[#666666] uppercase">{t.donatePage.paymentMethod}</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#666666]">
                  <div className="p-3 border border-[#E89B52]/40 bg-[#FAF6EF]/50 rounded-xl flex items-center gap-2">
                    <span className="text-lg">🏦</span>
                    <span>{t.donatePage.cbe}</span>
                  </div>
                  <div className="p-3 border border-gray-200 rounded-xl flex items-center gap-2">
                    <span className="text-lg">📱</span>
                    <span>{t.donatePage.telebirr}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Button type="submit" variant="primary" className="w-full text-xs font-bold uppercase py-3.5">
                  {t.donatePage.confirmGift} {finalAmount} {lang === 'am' ? 'ብር' : 'ETB'}
                </Button>
              </div>
            </form>
          )}
        </div>

        {/* Impact Sidebar */}
        <div className="lg:col-span-4 bg-[#FAF6EF]/80 border border-[#E7DED1] p-6 rounded-2xl space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#E89B52]">{t.donatePage.transparencyTitle}</h3>
          <p className="text-xs text-[#666666] leading-relaxed">
            {t.donatePage.transparencyDesc}
          </p>
          <ul className="space-y-3 text-xs text-[#666666]">
            <li className="flex gap-2">
              <span className="text-[#C79A2B]">✔</span>
              <span>{t.donatePage.causeScholarships}</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[#C79A2B]">✔</span>
              <span>{t.donatePage.causeCraft}</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[#C79A2B]">✔</span>
              <span>{t.donatePage.causeDigital}</span>
            </li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
}

// ==========================================
// 12. GLOBAL SEARCH COMPONENT
// ==========================================
interface SearchProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onNavigate: (page: PageId, params?: any) => void;
}

export function GlobalSearch({ isOpen, onClose, lang, onNavigate }: SearchProps) {
  const t = TRANSLATIONS[lang];
  const [query, setQuery] = useState('');

  const searchResults = useMemo(() => {
    if (!query) return [];
    const q = query.toLowerCase();

    const courses = COURSES_DATA.filter((c) => c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q))
      .map((c) => {
        const localized = getLocalizedCourse(c, lang);
        return { type: 'course' as const, id: c.id, title: localized.name, desc: localized.shortDescription };
      });

    const teachers = TEACHERS_DATA.filter((t) => t.name.toLowerCase().includes(q) || t.specialization.toLowerCase().includes(q))
      .map((tch) => {
        const localized = getLocalizedTeacher(tch, lang);
        return { type: 'teacher' as const, id: tch.id, title: tch.name, desc: localized.specialization };
      });

    const events = EVENTS_DATA.filter((e) => e.title.toLowerCase().includes(q) || e.shortDescription.toLowerCase().includes(q))
      .map((e) => ({ type: 'event' as const, id: e.id, title: tr(e.title, lang), desc: tr(e.date, lang) }));

    return [...courses, ...teachers, ...events];
  }, [query, lang]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#2B2B2B]/70 backdrop-blur-xs z-50 flex justify-center p-4 sm:p-10">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -20, opacity: 0 }}
        className="bg-white max-w-xl w-full rounded-2xl border border-[#E7DED1] shadow-2xl h-fit overflow-hidden text-left"
      >
        {/* Search header */}
        <div className="p-4 border-b border-[#E7DED1] flex items-center gap-3 bg-[#FAF6EF]/50">
          <Search size={18} className="text-[#C79A2B]" />
          <input
            type="text"
            placeholder={t.globalSearch.placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full h-10 outline-none text-sm text-[#2B2B2B] bg-transparent font-sans"
            autoFocus
          />
          <button onClick={onClose} className="text-gray-400 hover:text-[#2B2B2B] cursor-pointer">
            <X size={18} />
          </button>
        </div>

        {/* Suggestion & Results */}
        <div className="max-h-80 overflow-y-auto p-4 space-y-4">
          {!query ? (
            <div className="space-y-3">
              <p className="text-[10px] font-bold uppercase text-gray-400">{t.globalSearch.popularQueries}</p>
              <div className="flex flex-wrap gap-2 text-xs">
                {['Begena', 'Krar Tuning', 'Piazza Hours', 'Lique Mezemer Bruk', 'Events'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="bg-[#FAF6EF] hover:bg-[#E7DED1]/50 border border-[#E7DED1] px-3 py-1.5 rounded-lg text-[#666666] hover:text-[#2B2B2B] cursor-pointer"
                  >
                    {tr(tag, lang)}
                  </button>
                ))}
              </div>
            </div>
          ) : searchResults.length > 0 ? (
            <div className="space-y-2">
              <p className="text-[10px] font-bold uppercase text-gray-400">{t.globalSearch.results} ({searchResults.length})</p>
              <div className="space-y-2">
                {searchResults.map((res, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      onClose();
                      if (res.type === 'course') onNavigate('course-detail', { courseId: res.id });
                      if (res.type === 'teacher') onNavigate('teacher-profile', { teacherId: res.id });
                      if (res.type === 'event') onNavigate('event-detail', { eventId: res.id });
                    }}
                    className="p-3 border border-[#E7DED1] hover:border-[#C79A2B] bg-white rounded-xl cursor-pointer hover:bg-[#FAF6EF]/30 flex justify-between items-center group transition-colors"
                  >
                    <div className="text-xs">
                      <span className="text-[9px] font-bold text-[#E89B52] bg-[#FAF6EF] border border-[#E7DED1] px-1.5 py-0.5 rounded uppercase mr-2 inline-block">
                        {tr(res.type, lang)}
                      </span>
                      <h4 className="font-bold text-[#2B2B2B] inline-block">{res.title}</h4>
                      <p className="text-[10px] text-gray-400 mt-0.5">{res.desc}</p>
                    </div>
                    <ChevronRight size={14} className="text-gray-300 group-hover:text-[#C79A2B] transition-transform duration-200 group-hover:translate-x-1" />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-6 text-xs text-gray-400">
              {t.globalSearch.noResults} "{query}". {t.globalSearch.tryChecking}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

// ==========================================
// 13. AUTH MODAL COMPONENT
// ==========================================
interface AuthProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export function AuthModal({ isOpen, onClose, lang }: AuthProps) {
  const t = TRANSLATIONS[lang];
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [mockLoading, setMockLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMockLoading(true);
    setTimeout(() => {
      setMockLoading(false);
      setSuccess(true);
    }, 1200);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#2B2B2B]/75 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white border border-[#E7DED1] max-w-sm w-full rounded-2xl shadow-2xl overflow-hidden text-left"
      >
        <div className="p-6 border-b border-[#E7DED1] flex justify-between items-center bg-[#FAF6EF]/50">
          <h3 className="font-display font-black text-lg text-[#2B2B2B]">
            {isLogin ? t.authModal.loginTitle : t.authModal.registerTitle}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-[#2B2B2B] cursor-pointer">
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {success ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-5 text-center space-y-3 bg-green-50 border border-green-200 rounded-xl"
            >
              <span className="text-3xl text-green-500 block">✓</span>
              <h4 className="text-sm font-bold text-green-800">{t.authModal.authSuccessTitle}</h4>
              <p className="text-xs text-green-700">
                {t.authModal.authSuccessDesc}
              </p>
              <Button variant="primary" size="sm" className="w-full text-xs font-bold mt-2" onClick={onClose}>
                {t.authModal.enterDashboard}
              </Button>
            </motion.div>
          ) : (
            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#666666] uppercase">{t.authModal.fullName}</label>
                  <Input
                    required
                    placeholder="Abebe Kebede"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    leftIcon={<User size={16} className="text-gray-400" />}
                  />
                </div>
              )}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#666666] uppercase">{t.authModal.email}</label>
                <Input
                  required
                  type="email"
                  placeholder="student@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  leftIcon={<Mail size={16} className="text-gray-400" />}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#666666] uppercase">{t.authModal.password}</label>
                <Input
                  required
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  leftIcon={<Lock size={16} className="text-gray-400" />}
                />
              </div>

              {!isLogin && (
                <div className="flex items-center gap-2">
                  <input type="checkbox" required className="w-4 h-4 text-[#E89B52] border-[#E7DED1] rounded focus:ring-[#C79A2B]" />
                  <span className="text-[10px] text-gray-500">{t.authModal.agreeTerms}</span>
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                className="w-full text-xs font-bold uppercase py-2.5"
                isLoading={mockLoading}
              >
                {isLogin ? t.authModal.loginBtn : t.authModal.registerBtn}
              </Button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-[11px] text-[#C79A2B] hover:underline font-bold cursor-pointer"
                >
                  {isLogin ? t.authModal.switchRegister : t.authModal.switchLogin}
                </button>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}

