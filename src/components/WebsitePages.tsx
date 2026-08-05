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
import { COURSES_DATA, TEACHERS_DATA, EVENTS_DATA, PRODUCTS_DATA, ARTICLES_DATA, TESTIMONIALS_DATA, BRANCHES_DATA, GALLERY_DATA, TRANSLATIONS, ABEL_BEGENA_PHOTO } from '../data/websiteData';
import { Button, Input } from './InteractiveComponents';
import { TiletPattern } from './TiletPattern';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';

interface PageProps {
  lang: Language;
  onNavigate: (page: PageId, params?: any) => void;
  params?: any;
}

// ==========================================
// 1. ABOUT ABEL PAGE
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
              Academy Founder & Dean
            </span>
            <h1 className="font-display font-black text-4xl sm:text-5xl text-[#2B2B2B] tracking-tight">
              Zemari Deacon <br />
              <span className="text-[#E89B52]">Abel Tesfaye</span>
            </h1>
            {lang === 'am' ? (
              <p className="text-base text-[#666666] leading-relaxed max-w-xl">
                የኢትዮጵያን እጅግ የተከበረ እና ጥንታዊ የዜማ እቃ የሆነውን 'በገና'ን በማስተማር፣ በመደርደር እና በስርዓት ለትውልዱ በማስተላለፍ ከ 10 ዓመታት በላይ ያሳለፉ፣ በዘርፉ ጥሩ እውቀት ያላቸው ባለሙያ።
              </p>
            ) : (
              <p className="text-base text-[#666666] leading-relaxed max-w-xl">
                An internationally recognized authority on the Begena, dedicating over two decades to the research, performance, and systematic instruction of Ethiopia's most sacred classical stringed instrument.
              </p>
            )}
          </div>
          <div className="md:col-span-5 flex justify-center">
            <div className="relative">
              <div className="w-64 h-64 sm:w-80 sm:h-80 rounded-2xl overflow-hidden border-2 border-[#C79A2B] shadow-lg">
                <img
                  src={ABEL_BEGENA_PHOTO}
                  alt="አበኤል ተስፋዬ"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-[#2B2B2B] text-[#FFFDF8] p-4 rounded-xl border border-[#C79A2B]/30 text-xs shadow-md">
                <p className="font-bold text-[#E89B52]">10+ Years Active</p>
                <p className="text-[10px] opacity-75">Liturgical Master</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Narrative Biography */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
        <div className="md:col-span-8 space-y-6">
          <h2 className="text-2xl font-display font-black text-[#2B2B2B]">The Journey of Preservation</h2>
          <p className="text-sm text-[#666666] leading-relaxed">
            Born and raised in the rich spiritual soil of Addis Ababa, Abel began studying the Begena at the tender age of eight under venerable church elders. Fascinated by the deep, buzzing frequencies and the meditative tranquility of the instrument, he dedicated his life to uncovering its historical roots, tracing scores back to medieval Ge'ez manuscripts.
          </p>
          <p className="text-sm text-[#666666] leading-relaxed">
            Recognizing that the traditional mouth-to-ear transmission of Begena notation was endangered by rapid urbanization, Abel designed the world's first fully structured, step-by-step written curriculum for the instrument. His methodology combines classical vocal alignment with robust rhythmic drills, unlocking the mysteries of the 10 strings for students of all background layers.
          </p>

          <div className="bg-[#FAF6EF]/70 p-6 rounded-2xl border border-[#E7DED1] space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#E89B52]">Abel's Personal Message</h4>
            <p className="text-sm italic font-serif text-[#6F4E37] leading-relaxed">
              "The Begena is not an instrument of entertainment; it is an instrument of deep contemplation. When we pluck these sheep-gut strings, we are not merely playing music—we are tuning our spirits to the acoustic frequencies that sustained our ancestors through centuries of trials and triumphs."
            </p>
          </div>
        </div>

        <div className="md:col-span-4 space-y-6">
          <div className="bg-white border border-[#E7DED1] rounded-2xl p-6 shadow-sm space-y-5">
            <h3 className="text-sm font-bold uppercase tracking-widest text-[#2B2B2B] border-b border-[#FAF6EF] pb-2">
              Dean's Profile Summary
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="text-xl">🎓</span>
                <div>
                  <h4 className="text-xs font-bold text-[#2B2B2B]">Ecclesiastical Credentials</h4>
                  <p className="text-xs text-[#666666] mt-0.5">Lique Mezemer (Master of Liturgical Hymns)</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-xl">🌍</span>
                <div>
                  <h4 className="text-xs font-bold text-[#2B2B2B]">Cultural Impact</h4>
                  <p className="text-xs text-[#666666] mt-0.5">Toured 15+ countries conducting symposia on East African harp systems.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-xl">🎻</span>
                <div>
                  <h4 className="text-xs font-bold text-[#2B2B2B]">Instrument Curation</h4>
                  <p className="text-xs text-[#666666] mt-0.5">Designed the School's Signature 10-String olive-wood Begena.</p>
                </div>
              </div>
            </div>
            <Button
              variant="primary"
              className="w-full text-xs font-bold mt-2"
              onClick={() => onNavigate('courses', { instrument: 'begena' })}
            >
              STUDY UNDER ABEL
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
            The Ancient Harp of David
          </span>
          <h1 className="font-display font-black text-4xl sm:text-5xl text-white tracking-tight">
            Understanding the Begena
          </h1>
          <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
            The Begena is one of the oldest continuously played string instruments on earth, carrying a rich legacy of spiritual prayer, biblical narrative, and profound meditation.
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
            {tab === 'history' && 'History & Significance'}
            {tab === 'structure' && 'Instrument Structure'}
            {tab === 'playing' && 'How It Is Played'}
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
              <h3 className="text-xl font-display font-bold text-[#2B2B2B]">Spiritual Roots and Centuries-Old Heritage</h3>
              <p className="text-sm text-[#666666] leading-relaxed">
                Historically linked to King David of biblical antiquity, the Begena has held a unique, non-entertainment status in Ethiopian culture. It was originally played in royal palaces and monasteries as a medium of prayer, spiritual contemplation, and repentance during fasts, such as the Holy Great Lent (Abiy Tsom).
              </p>
              <p className="text-sm text-[#666666] leading-relaxed">
                Unlike secular folk lutes, the Begena's acoustic signature is calibrated to accompany quiet, deeply theological poetry. The lyrics are historically written in Ge'ez or high Amharic, invoking stories of mortality, divine mercy, and spiritual philosophy.
              </p>
            </div>
            <div className="md:col-span-5 bg-[#FAF6EF] p-6 rounded-2xl border border-[#E7DED1] space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-widest text-[#C79A2B]">Key Historical Milestones</h4>
              <ul className="space-y-3 text-xs text-[#666666]">
                <li className="flex gap-2">
                  <span className="text-[#E89B52]">✦</span>
                  <span><strong>1000 BC Era:</strong> Biblical linkages to King David's temple musicians.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#E89B52]">✦</span>
                  <span><strong>Imperial Integration:</strong> Used for solemn court meditations in Gondar and Lalibela.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#E89B52]">✦</span>
                  <span><strong>Modern Century:</strong> Protected from extinction through the creation of structured school cohorts.</span>
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
              <h3 className="text-xl font-display font-bold text-[#2B2B2B]">Acoustics of the 10 Strings</h3>
              <p className="text-sm text-[#666666] leading-relaxed">
                The body of a Begena consists of a hollowed rectangular soundbox carved from aged olive, cedar, or walnut wood, covered with stretched ox or cattle hide. Two thick wooden arms rise upwards, connected by a crossbar.
              </p>
              <p className="text-sm text-[#666666] leading-relaxed">
                Ten strings made of traditional hand-twisted sheep-gut stretch down to the bridge. Five of these strings are actively plucked by the musician's fingers, while the other five serve as sympathetic resonators or rhythmic finger rest nodes.
              </p>
            </div>
            <div className="md:col-span-6 grid grid-cols-2 gap-4">
              <div className="border border-[#E7DED1] p-4 rounded-xl bg-white space-y-1">
                <span className="text-lg">🪵</span>
                <h4 className="text-xs font-bold">Olive Soundbox</h4>
                <p className="text-[11px] text-[#666666]">Highly resonant wooden frame wrapped in tanned cattle hide.</p>
              </div>
              <div className="border border-[#E7DED1] p-4 rounded-xl bg-white space-y-1">
                <span className="text-lg">🎻</span>
                <h4 className="text-xs font-bold">Sheep-Gut Strings</h4>
                <p className="text-[11px] text-[#666666]">High-tensile natural fibers providing deep low-frequency buzz.</p>
              </div>
              <div className="border border-[#E7DED1] p-4 rounded-xl bg-white space-y-1">
                <span className="text-lg">🐝</span>
                <h4 className="text-xs font-bold">The Birz (Beeswax)</h4>
                <p className="text-[11px] text-[#666666]">Leather or wax pads that create the trademark vibrating buzz.</p>
              </div>
              <div className="border border-[#E7DED1] p-4 rounded-xl bg-white space-y-1">
                <span className="text-lg">🎛️</span>
                <h4 className="text-xs font-bold">Wooden Pegs</h4>
                <p className="text-[11px] text-[#666666]">Traditional friction pegs adjusted manually for pentatonic Qenets.</p>
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
                <h4 className="text-xs font-bold uppercase">The Posture</h4>
                <p className="text-xs text-[#666666] leading-relaxed">The player sits solemnly on a low stool. The heavy wooden soundbox rests securely on the thighs, angled slightly to the left.</p>
              </div>
              <div className="bg-[#FAF6EF] p-5 rounded-xl border border-[#E7DED1] text-center space-y-2">
                <span className="w-8 h-8 rounded-full bg-[#E89B52] text-white flex items-center justify-center font-bold mx-auto text-xs">2</span>
                <h4 className="text-xs font-bold uppercase">The Pluck</h4>
                <p className="text-xs text-[#666666] leading-relaxed">The left-hand fingers pluck the active strings (1, 4, 6, 8, 10) downwards. The index, middle, and thumb must synchronize with breathing.</p>
              </div>
              <div className="bg-[#FAF6EF] p-5 rounded-xl border border-[#E7DED1] text-center space-y-2">
                <span className="w-8 h-8 rounded-full bg-[#E89B52] text-white flex items-center justify-center font-bold mx-auto text-xs">3</span>
                <h4 className="text-xs font-bold uppercase">The Vocal Sync</h4>
                <p className="text-xs text-[#666666] leading-relaxed">Traditional begena playing is incomplete without vocals. The singer delivers solemn, rhythmic lines in between acoustic string echoes.</p>
              </div>
            </div>
            <div className="pt-4 text-center">
              <Button
                variant="primary"
                onClick={() => onNavigate('course-detail', { courseId: 'begena' })}
                rightIcon={<ArrowRight size={14} />}
              >
                EXPLORE COMPLETE BEGENA SYLLABUS
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
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [selectedMode, setSelectedMode] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>(params?.instrument ? params.instrument : '');

  // Filter courses
  const filteredCourses = useMemo(() => {
    return COURSES_DATA.filter((course) => {
      const matchesSearch = course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            course.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDifficulty = selectedDifficulty === 'All' || course.difficulty === selectedDifficulty;
      const matchesMode = selectedMode === 'All' || course.learningMode.includes(selectedMode as any);
      return matchesSearch && matchesDifficulty && matchesMode;
    });
  }, [searchQuery, selectedDifficulty, selectedMode]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-8 py-6 text-left"
    >
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <h1 className="font-display font-black text-3xl sm:text-4xl text-[#2B2B2B] tracking-tight">Our Musical Curriculums</h1>
        <p className="text-xs sm:text-sm text-[#666666]">Explore our structured multi-level instrument programs, certified by church liturgical and folk cultural experts.</p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-[#E7DED1] rounded-2xl p-4 sm:p-6 shadow-xs grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
        <div className="md:col-span-5 space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-wider text-[#666666]">Search Program</label>
          <Input
            placeholder="Search Begena, Krar, Washint..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search size={16} className="text-gray-400" />}
          />
        </div>

        <div className="md:col-span-3 space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-wider text-[#666666]">Difficulty Level</label>
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="w-full h-10 px-3 bg-white border border-[#E7DED1] rounded-md text-sm outline-none focus:border-[#C79A2B]"
          >
            <option value="All">All Difficulties</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>

        <div className="md:col-span-3 space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-wider text-[#666666]">Learning Mode</label>
          <select
            value={selectedMode}
            onChange={(e) => setSelectedMode(e.target.value)}
            className="w-full h-10 px-3 bg-white border border-[#E7DED1] rounded-md text-sm outline-none focus:border-[#C79A2B]"
          >
            <option value="All">All Modes</option>
            <option value="In-Person">In-Person Only</option>
            <option value="Online">Online Learning</option>
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
            Reset
          </Button>
        </div>
      </div>

      {/* Courses List Grid */}
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
          {filteredCourses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="bg-white border border-[#E7DED1] rounded-3xl overflow-hidden shadow-xs hover:shadow-2xl hover:border-[#C79A2B] transition-all flex flex-col group h-full"
            >
              <div className="w-full overflow-hidden relative bg-[#FAF6EF] flex items-center justify-center p-4">
                <img
                  src={course.image}
                  alt={course.name}
                  className="max-w-full max-h-48 object-contain object-center group-hover:scale-105 transition-all duration-300"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-xs text-[#C79A2B] px-2 py-1 rounded-full text-[10px] font-bold border border-[#E7DED1]">
                  ★ {course.rating}
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  <h3 className="text-sm font-black uppercase tracking-tight text-[#2B2B2B]">{course.name}</h3>
                  <p className="text-[11px] text-[#666666] leading-relaxed line-clamp-3">{course.shortDescription}</p>
                </div>

                <div className="space-y-3 pt-3 border-t border-[#E7DED1]/60">
                  <div className="flex justify-between items-center text-[10px] text-[#666666]">
                    <span className="flex items-center gap-1"><Clock size={12} /> {course.duration}</span>
                    <span className="font-semibold bg-[#FAF6EF] px-2 py-0.5 rounded-full border border-[#E7DED1] text-[10px]">{course.difficulty}</span>
                  </div>
                  <div className="flex gap-1 flex-wrap">
                    {course.learningMode.map((mode, idx) => (
                      <span key={idx} className="text-[9px] font-bold bg-[#FAF6EF] text-[#6F4E37] px-2 py-0.5 rounded-full border border-[#E7DED1]">
                        {mode}
                      </span>
                    ))}
                  </div>
                  <Button
                    variant="secondary"
                    className="w-full text-[11px] font-bold py-2"
                    onClick={() => onNavigate('course-detail', { courseId: course.id })}
                  >
                    VIEW SYLLABUS
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-[#FAF6EF]/40 rounded-2xl border border-[#E7DED1] border-dashed space-y-3">
          <span className="text-3xl">🔍</span>
          <h3 className="text-sm font-bold text-[#2B2B2B]">No courses match your filter parameters.</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">Try resetting the filters or modifying your search query to find related traditional instruments.</p>
        </div>
      )}
    </motion.div>
  );
}

// ==========================================
// 4. COURSE DETAIL PAGE
// ==========================================
export function CourseDetailPage({ lang, onNavigate, params }: PageProps) {
  const { currentUser } = useAuth();
  const courseId = params?.courseId || 'begena';
  const course = useMemo(() => {
    return COURSES_DATA.find((c) => c.id === courseId) || COURSES_DATA[0];
  }, [courseId]);

  const [activeTab, setActiveTab] = useState<'overview' | 'curriculum' | 'pricing'>('overview');
  const [selectedPricing, setSelectedPricing] = useState<number>(0);
  const [enrollSuccess, setEnrollSuccess] = useState<boolean>(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', branch: 'piazza' });

  const handleEnroll = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      alert('Please fill out all registration fields.');
      return;
    }
    setEnrollSuccess(true);
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
        <span className="hover:text-[#2B2B2B] cursor-pointer" onClick={() => onNavigate('home')}>Home</span>
        <ChevronRight size={12} />
        <span className="hover:text-[#2B2B2B] cursor-pointer" onClick={() => onNavigate('courses')}>Courses</span>
        <ChevronRight size={12} />
        <span className="font-bold text-[#E89B52]">{course.name}</span>
      </div>

      {/* Hero Header */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#FAF6EF] border border-[#E7DED1] p-6 sm:p-10 rounded-3xl relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02] bg-dot-pattern pointer-events-none" />
        <div className="lg:col-span-7 space-y-4 relative z-10">
          <span className="text-[9px] font-bold uppercase tracking-widest bg-white border border-[#E7DED1] px-2.5 py-1 rounded-full text-[#C79A2B]">
            Structured Syllabus
          </span>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-[#2B2B2B] tracking-tight">{course.name}</h1>
          <p className="text-sm text-[#666666] leading-relaxed">{course.description}</p>
          <div className="flex gap-4 text-xs font-semibold text-[#6F4E37] pt-2 flex-wrap">
            <span className="flex items-center gap-1">★ {course.rating} Rating</span>
            <span>•</span>
            <span>{course.duration} Program</span>
            <span>•</span>
            <span>Difficulty: {course.difficulty}</span>
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
                {tab === 'overview' && 'Outcomes & Rules'}
                {tab === 'curriculum' && 'Weekly Curriculum'}
                {tab === 'pricing' && 'Pricing Options'}
              </button>
            ))}
          </div>

          <div className="min-h-[250px]">
            {activeTab === 'overview' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="space-y-3">
                  <h3 className="text-base font-bold text-[#2B2B2B]">What You Will Master</h3>
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
                  <h3 className="text-base font-bold text-[#2B2B2B]">Requirements for Admission</h3>
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
                      <span className="text-[11px] font-bold text-[#C79A2B] uppercase tracking-widest">{module.week}</span>
                      <h4 className="text-xs font-bold text-[#2B2B2B]">{module.title}</h4>
                    </div>
                    <div className="p-5 space-y-2">
                      <p className="text-[10px] font-bold uppercase text-gray-400">Core topics covered:</p>
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
                  {course.pricing.map((opt, i) => (
                    <div
                      key={i}
                      onClick={() => setSelectedPricing(i)}
                      className={`border p-5 rounded-xl cursor-pointer text-center space-y-2 transition-all ${
                        selectedPricing === i
                          ? 'border-[#E89B52] bg-[#FAF6EF]/50 ring-1 ring-[#E89B52]'
                          : 'border-[#E7DED1] bg-white hover:border-[#C79A2B]'
                      }`}
                    >
                      <p className="text-xs font-bold uppercase text-gray-500">{opt.duration}</p>
                      <p className="text-2xl font-black text-[#2B2B2B]">{opt.price} ETB</p>
                      <p className="text-[10px] text-[#666666]">{opt.period === 'per month' ? 'per month' : 'total course fee'}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-[#FAF6EF]/40 p-4 rounded-xl border border-[#E7DED1] text-xs text-[#666666] flex justify-between">
                  <span>Standard Registration Admission Fee (one-time):</span>
                  <span className="font-bold text-[#2B2B2B]">{course.registrationFee} ETB</span>
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
              <span className="text-[9px] font-bold uppercase tracking-widest text-[#C79A2B] bg-white border px-2.5 py-1 rounded-full">
                Syllabus Admission Open
              </span>
              <h3 className="text-base font-display font-black text-[#2B2B2B] pt-1">
                Start Your Musical Journey
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Enroll in this structured <b>{course.name}</b> course and study directly under Zemari Deacon Abel Tesfaye.
              </p>
            </div>

            <div className="space-y-3 pt-3 border-t border-[#E7DED1] text-xs">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Standard Reg Fee (One-Time):</span>
                <span className="font-bold text-[#2B2B2B]">{course.registrationFee} ETB</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Class Duration Options:</span>
                <span className="font-bold text-[#2B2B2B]">{course.duration}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Learning Formats:</span>
                <span className="font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded border border-green-200 text-[10px]">In-Person & Online</span>
              </div>
            </div>

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
                    onNavigate('student-registration', { courseId: course.id });
                  }
                }}
              >
                Enroll In Course Now
              </Button>
              <p className="text-[10px] text-gray-400 text-center mt-3 leading-relaxed">
                Our enrollment wizard supports <b>CBE Transfer</b>, <b>Telebirr Wallet</b>, and <b>Cash Payments</b> at physical office branches.
              </p>
            </div>
          </div>
        </div>
      </div>
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
      const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            t.specialization.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesInstrument = instrumentFilter === 'All' || t.instrument.includes(instrumentFilter);
      return matchesSearch && matchesInstrument;
    });
  }, [searchQuery, instrumentFilter]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-8 py-6 text-left"
    >
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <h1 className="font-display font-black text-3xl sm:text-4xl text-[#2B2B2B] tracking-tight">Our Master Instructors</h1>
        <p className="text-xs sm:text-sm text-[#666666]">Learn from internationally certified curators, liturgical deacons, and research authors preserving centuries-old methods.</p>
      </div>

      <div className="bg-white border border-[#E7DED1] rounded-2xl p-4 sm:p-6 shadow-xs grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
        <div className="sm:col-span-6 space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-wider text-[#666666]">Search Instructor</label>
          <Input
            placeholder="Search Teacher name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search size={16} className="text-gray-400" />}
          />
        </div>

        <div className="sm:col-span-4 space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-wider text-[#666666]">Instrument Specialty</label>
          <select
            value={instrumentFilter}
            onChange={(e) => setInstrumentFilter(e.target.value)}
            className="w-full h-10 px-3 bg-white border border-[#E7DED1] rounded-md text-sm outline-none focus:border-[#C79A2B]"
          >
            <option value="All">All Specialties</option>
            <option value="Begena">Begena</option>
            <option value="Krar">Krar</option>
            <option value="Masenqo">Masenqo</option>
            <option value="Washint">Washint</option>
            <option value="Kebero">Kebero</option>
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
            Clear
          </Button>
        </div>
      </div>

      {/* Teachers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTeachers.map((teacher) => (
          <div
            key={teacher.id}
            className="bg-white border border-[#E7DED1] rounded-2xl overflow-hidden shadow-xs hover:shadow-md hover:border-[#C79A2B] transition-all flex flex-col group"
          >
            <div className="h-48 overflow-hidden relative">
              <img
                src={teacher.photo}
                alt={teacher.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                referrerPolicy="no-referrer"
              />
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
                  VIEW PROFILE
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ==========================================
// 6. TEACHER PROFILE PAGE
// ==========================================
export function TeacherProfilePage({ lang, onNavigate, params }: PageProps) {
  const teacherId = params?.teacherId || 'abel';
  const teacher = useMemo(() => {
    return TEACHERS_DATA.find((t) => t.id === teacherId) || TEACHERS_DATA[0];
  }, [teacherId]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-10 py-6 text-left"
    >
      {/* Breadcrumbs */}
      <div className="flex items-center gap-1.5 text-xs text-[#666666]">
        <span className="hover:text-[#2B2B2B] cursor-pointer" onClick={() => onNavigate('home')}>Home</span>
        <ChevronRight size={12} />
        <span className="hover:text-[#2B2B2B] cursor-pointer" onClick={() => onNavigate('teachers')}>Teachers</span>
        <ChevronRight size={12} />
        <span className="font-bold text-[#E89B52]">{teacher.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left column info */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-[#E7DED1] rounded-2xl overflow-hidden p-6 text-center space-y-4 shadow-sm">
            <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-[#C79A2B] mx-auto shadow-md">
              <img
                src={teacher.photo}
                alt={teacher.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-[#2B2B2B]">{teacher.name}</h2>
              <p className="text-xs font-semibold text-[#E89B52] uppercase tracking-wider">{teacher.instrument}</p>
              <p className="text-[10px] text-gray-400">{teacher.experience}</p>
            </div>
            <div className="pt-3 border-t border-[#E7DED1] flex flex-col gap-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-400">Main Focus:</span>
                <span className="font-bold text-[#2B2B2B]">{teacher.specialization.split(',')[0]}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right column detailed story */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white border border-[#E7DED1] rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-[#2B2B2B] uppercase tracking-wider">Biography</h3>
              <p className="text-sm text-[#666666] leading-relaxed">{teacher.bio}</p>
            </div>

            <div className="space-y-3 pt-4 border-t border-[#E7DED1]/60">
              <h4 className="text-sm font-bold text-[#2B2B2B] uppercase tracking-wider">Programs Managed</h4>
              <div className="flex flex-wrap gap-2">
                {teacher.coursesTaught.map((course, idx) => (
                  <span key={idx} className="text-xs font-bold bg-[#FAF6EF] text-[#C79A2B] px-3 py-1.5 rounded-lg border border-[#E7DED1]">
                    {course}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-[#E7DED1]/60">
              <h4 className="text-sm font-bold text-[#2B2B2B] uppercase tracking-wider">Available Slots & Classes</h4>
              <div className="space-y-2.5">
                {teacher.availableClasses.map((cl, i) => (
                  <div key={i} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 bg-[#FAF6EF]/55 border border-[#E7DED1] rounded-xl text-xs gap-3">
                    <span className="font-semibold text-[#6F4E37]">{cl}</span>
                    <Button variant="primary" size="sm" className="text-[10px] font-bold tracking-widest uppercase cursor-pointer" onClick={() => onNavigate('courses', { instrument: teacher.instrument })}>
                      REQUEST SLOT
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Testimonials */}
            {teacher.reviews.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-[#E7DED1]/60">
                <h4 className="text-sm font-bold text-[#2B2B2B] uppercase tracking-wider">Student Endorsements</h4>
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
        <h1 className="font-display font-black text-3xl sm:text-4xl text-[#2B2B2B] tracking-tight">Our Media Gallery</h1>
        <p className="text-xs sm:text-sm text-[#666666]">Browse the newly uploaded gallery set of 23 school images, curated directly from the media dashboard.</p>
        <div className="inline-flex items-center gap-2 bg-[#FAF6EF] border border-[#E7DED1] px-3 py-1 rounded-full text-[11px] font-medium text-[#C79A2B]">
          <span>📸 Showing <b>23</b> curated images from the media dashboard</span>
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
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
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
                  {item.category}
                </div>
                {item.imgNum && (
                  <div className="bg-[#2B2B2B]/80 text-white backdrop-blur-xs px-2 py-0.5 rounded-full text-[9px] font-mono font-bold tracking-tight shadow-2xs">
                    IMG{item.imgNum}
                  </div>
                )}
              </div>
            </div>
            <div className="p-4 space-y-1">
              <h3 className="text-sm font-bold text-[#2B2B2B] group-hover:text-[#E89B52] transition-colors">{item.title}</h3>
              <p className="text-xs text-[#666666] line-clamp-1">{item.description}</p>
            </div>
          </div>
        ))}
      </div>

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
                    {lightboxImage.category.toUpperCase()}
                  </span>
                  {lightboxImage.imgNum && (
                    <span className="text-[10px] font-mono font-bold bg-[#2B2B2B] text-white px-2.5 py-0.5 rounded-full">
                      FILE SLOT: IMG{lightboxImage.imgNum}
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-bold text-[#2B2B2B]">{lightboxImage.title}</h3>
                <p className="text-xs text-[#666666] leading-relaxed">{lightboxImage.description}</p>
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
        <h1 className="font-display font-black text-3xl sm:text-4xl text-[#2B2B2B] tracking-tight">Traditional Events & Recitals</h1>
        <p className="text-xs sm:text-sm text-[#666666]">Attend our sacred liturgical gatherings, interactive acoustic symposia, and local neighborhood outdoor drumming circles.</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#E7DED1] gap-6 max-w-xs mx-auto justify-center">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`pb-3 text-sm font-bold uppercase tracking-wider border-b-2 cursor-pointer transition-all ${
            activeTab === 'upcoming' ? 'border-[#E89B52] text-[#E89B52]' : 'border-transparent text-[#666666] hover:text-[#2B2B2B]'
          }`}
        >
          Upcoming (Live)
        </button>
        <button
          onClick={() => setActiveTab('past')}
          className={`pb-3 text-sm font-bold uppercase tracking-wider border-b-2 cursor-pointer transition-all ${
            activeTab === 'past' ? 'border-[#E89B52] text-[#E89B52]' : 'border-transparent text-[#666666] hover:text-[#2B2B2B]'
          }`}
        >
          Past Recitals
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
                  {evt.category}
                </div>
              </div>
              <div className="p-5 space-y-2">
                <div className="flex gap-2 text-[10px] text-gray-400 font-semibold uppercase">
                  <span>{evt.date}</span>
                  <span>•</span>
                  <span>{evt.time}</span>
                </div>
                <h3 className="text-base font-bold text-[#2B2B2B] leading-snug">{evt.title}</h3>
                <p className="text-xs text-[#666666] leading-relaxed line-clamp-3">{evt.shortDescription}</p>
              </div>
            </div>

            <div className="p-5 pt-0 border-t border-[#E7DED1]/40 flex flex-col gap-2">
              <div className="text-[10px] text-gray-500 font-medium py-2 flex items-center gap-1.5">
                <MapPin size={11} className="text-[#E89B52]" />
                <span className="line-clamp-1">{evt.location}</span>
              </div>
              <Button
                variant="secondary"
                size="sm"
                className="w-full text-xs font-bold uppercase cursor-pointer"
                onClick={() => onNavigate('event-detail', { eventId: evt.id })}
              >
                VIEW DETAIL
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
        <span className="hover:text-[#2B2B2B] cursor-pointer" onClick={() => onNavigate('home')}>Home</span>
        <ChevronRight size={12} />
        <span className="hover:text-[#2B2B2B] cursor-pointer" onClick={() => onNavigate('events')}>Events</span>
        <ChevronRight size={12} />
        <span className="font-bold text-[#E89B52]">{event.title}</span>
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
                {event.category}
              </span>
              <span className="text-xs text-[#666666] font-semibold">{event.date}</span>
            </div>
            <h1 className="font-display font-black text-2xl sm:text-3xl text-[#2B2B2B] leading-tight">{event.title}</h1>
            <p className="text-sm text-[#666666] leading-relaxed">{event.fullDescription}</p>
          </div>

          {/* Speaker or performers panel */}
          <div className="bg-[#FAF6EF]/70 p-6 rounded-xl border border-[#E7DED1] space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#E89B52]">HOSTED BY / KEY PERFORMER</h4>
            <p className="text-sm font-bold text-[#2B2B2B]">{event.speakerOrPerformer}</p>
          </div>
        </div>

        {/* Sidebar RSVP Card */}
        <div className="lg:col-span-4">
          <div className="bg-white border border-[#E7DED1] rounded-2xl p-6 shadow-sm space-y-5 sticky top-24">
            <div className="space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-widest text-[#2B2B2B] border-b border-[#FAF6EF] pb-2">
                Event Logistics
              </h3>
              <div className="space-y-3.5 text-xs text-[#666666]">
                <div className="flex gap-2 items-start">
                  <Clock size={14} className="text-[#E89B52] shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-[#2B2B2B]">Time & Schedule</h5>
                    <p>{event.time}</p>
                  </div>
                </div>
                <div className="flex gap-2 items-start">
                  <MapPin size={14} className="text-[#E89B52] shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-[#2B2B2B]">Location</h5>
                    <p>{event.location}</p>
                  </div>
                </div>
              </div>
            </div>

            {event.isUpcoming ? (
              <div className="pt-4 border-t border-[#E7DED1] space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#2B2B2B]">RSVP Reservation</h4>
                {rsvpFormSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-4 bg-green-50 border border-green-200 rounded-xl text-center space-y-2 text-xs"
                  >
                    <span className="text-2xl">🎉</span>
                    <h5 className="font-bold text-green-800">Seat Reserved!</h5>
                    <p className="text-green-700">Thank you, <strong>{attendeeName}</strong>. Your seat is saved. We look forward to hosting you!</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleRsvp} className="space-y-3">
                    <Input
                      type="text"
                      placeholder="Your name"
                      required
                      value={attendeeName}
                      onChange={(e) => setAttendeeName(e.target.value)}
                    />
                    <Button type="submit" variant="primary" className="w-full text-xs font-bold uppercase">
                      RESERVE SPOT NOW
                    </Button>
                  </form>
                )}
              </div>
            ) : (
              <div className="p-4 bg-gray-50 border border-gray-100 rounded-xl text-center space-y-1 text-xs text-gray-500">
                <span>⛔ This is a past event. Registration is closed.</span>
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
        <h1 className="font-display font-black text-3xl sm:text-4xl text-[#2B2B2B] tracking-tight">Contact Our Offices</h1>
        <p className="text-xs sm:text-sm text-[#666666]">Have questions about enrollment fees, traditional wood curation, or physical branch coordinates? Reach out to our teams.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Contact Form */}
        <div className="lg:col-span-7 bg-white border border-[#E7DED1] p-6 sm:p-8 rounded-2xl shadow-sm space-y-6">
          <h2 className="text-lg font-display font-bold text-[#2B2B2B] uppercase tracking-wider">Leave a Message</h2>

          {submitSuccess ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-6 bg-green-50 rounded-xl border border-green-200 text-center space-y-3"
            >
              <span className="text-3xl text-green-500">✓</span>
              <h4 className="text-sm font-bold text-green-800">Message Dispatched Successfully!</h4>
              <p className="text-xs text-green-700 leading-relaxed">
                Thank you, <strong>{formData.name}</strong>. Your request regarding <strong>"{formData.subject || 'Syllabus Enquiry'}"</strong> has been sent to our <strong>{formData.branch.toUpperCase()}</strong> administration desks.
              </p>
              <p className="text-[10px] text-gray-500">We will get back to you via {formData.email} or phone within 12 working hours.</p>
              <Button variant="secondary" size="sm" className="text-[10px] uppercase font-bold" onClick={() => setSubmitSuccess(false)}>
                Send another message
              </Button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#666666] uppercase">Your Name</label>
                  <Input
                    type="text"
                    required
                    placeholder="Almaz Tesfaye"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#666666] uppercase">Email Address</label>
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
                  <label className="text-[10px] font-bold text-[#666666] uppercase">Phone Number (Optional)</label>
                  <Input
                    type="tel"
                    placeholder="+251 911 223344"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#666666] uppercase">Subject</label>
                  <Input
                    type="text"
                    required
                    placeholder="e.g. Begena Rental Enquiry"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#666666] uppercase">Select Branch Desk</label>
                <select
                  value={formData.branch}
                  onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                  className="w-full h-10 px-3 bg-white border border-[#E7DED1] rounded-md text-sm outline-none focus:border-[#C79A2B]"
                >
                  <option value="piazza">Piazza Headquarter (HQ)</option>
                  <option value="megenagna">Megenagna Modern Hub</option>
                  <option value="lebu">Lebu Community Annex</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#666666] uppercase">Your Message</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe your inquiry in detail..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full p-3 bg-white border border-[#E7DED1] rounded-md text-sm outline-none focus:border-[#C79A2B]"
                />
              </div>

              <Button type="submit" variant="primary" className="w-full text-xs font-bold uppercase py-3">
                DISPATCH ENQUIRY
              </Button>
            </form>
          )}
        </div>

        {/* Branch coordinates sidebar */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#FAF6EF]/80 border border-[#E7DED1] p-6 rounded-2xl space-y-5">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#E89B52]">Physical Hub Coordinates</h3>
            <div className="space-y-4">
              {BRANCHES_DATA.map((br) => (
                <div key={br.id} className="border border-[#E7DED1] p-4 rounded-xl bg-white space-y-2 text-xs">
                  <h4 className="font-bold text-[#2B2B2B]">{br.name}</h4>
                  <div className="space-y-1 text-[#666666]">
                    <p className="flex items-center gap-1.5"><MapPin size={12} className="text-[#C79A2B]" /> {br.location}</p>
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
            Cultural Preservation Fund
          </span>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight">Support Traditional Music Preservation</h1>
          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
            By donating, you directly sponsor gifted students who cannot afford tuition, fund the acquisition of raw highland bamboo for Washint, and support master craftsmen carving Begena and Krar frames from sustainably harvested olive wood.
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
              <h3 className="text-lg font-bold text-green-800">Egziabher Yistiln! (Thank You!)</h3>
              <p className="text-xs text-green-700 leading-relaxed">
                Thank you, <strong>{donorName || 'Generous Supporter'}</strong>, for your beautiful contribution of <strong>{finalAmount} ETB</strong>. Your funding has been processed as a pending bank mock token.
              </p>
              <p className="text-[11px] text-gray-500 leading-relaxed">
                A tax-deductible receipt has been reserved. You are helping keep the sacred vibrations of Ethiopia alive for generations to come.
              </p>
              <Button variant="secondary" size="sm" onClick={() => { setPaymentSubmitted(false); setCustomAmount(''); setDonorName(''); }}>
                Return to Fundraiser
              </Button>
            </motion.div>
          ) : (
            <form onSubmit={handleDonate} className="space-y-6">
              {/* Presets Grid */}
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-[#666666] uppercase tracking-wider">Select Contribution Amount (ETB)</label>
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
                      {preset} ETB
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom amount field */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#666666] uppercase">Or enter custom amount (ETB)</label>
                <Input
                  type="number"
                  placeholder="e.g. 10000"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  leftIcon={<DollarSign size={16} className="text-gray-400" />}
                />
              </div>

              <div className="space-y-3 pt-4 border-t border-[#E7DED1]/60">
                <h4 className="text-xs font-bold uppercase text-[#2B2B2B] tracking-wider">Donor Details</h4>
                <div className="space-y-3">
                  <Input
                    placeholder="Your Full Name (or write Anonymous)"
                    required
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    leftIcon={<User size={16} className="text-gray-400" />}
                  />
                </div>
              </div>

              {/* Mock Payment Integration selection */}
              <div className="space-y-2.5">
                <label className="text-[10px] font-bold text-[#666666] uppercase">Preferred Bank Transfer Method</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#666666]">
                  <div className="p-3 border border-[#E89B52]/40 bg-[#FAF6EF]/50 rounded-xl flex items-center gap-2">
                    <span className="text-lg">🏦</span>
                    <span>Commercial Bank of Ethiopia (CBE)</span>
                  </div>
                  <div className="p-3 border border-gray-200 rounded-xl flex items-center gap-2">
                    <span className="text-lg">📱</span>
                    <span>Telebirr Mobile Wallet ready</span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Button type="submit" variant="primary" className="w-full text-xs font-bold uppercase py-3.5">
                  CONFIRM GIFT OF {finalAmount} ETB
                </Button>
              </div>
            </form>
          )}
        </div>

        {/* Impact Sidebar */}
        <div className="lg:col-span-4 bg-[#FAF6EF]/80 border border-[#E7DED1] p-6 rounded-2xl space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#E89B52]">Donor Transparency Index</h3>
          <p className="text-xs text-[#666666] leading-relaxed">
            100% of public donations are audited directly. You can specify which cause you want to fund during registration:
          </p>
          <ul className="space-y-3 text-xs text-[#666666]">
            <li className="flex gap-2">
              <span className="text-[#C79A2B]">✔</span>
              <span><strong>Scholarships:</strong> Helping talented, underprivileged kids learn free of cost.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[#C79A2B]">✔</span>
              <span><strong>Craft Preservation:</strong> Sponsoring wood purchases for traditional carvers.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[#C79A2B]">✔</span>
              <span><strong>Digital Access:</strong> Funding server hosts for remote villages to view tutorial streams.</span>
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
  const [query, setQuery] = useState('');

  const searchResults = useMemo(() => {
    if (!query) return [];
    const q = query.toLowerCase();

    const courses = COURSES_DATA.filter((c) => c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q))
      .map((c) => ({ type: 'course' as const, id: c.id, title: c.name, desc: c.shortDescription }));

    const teachers = TEACHERS_DATA.filter((t) => t.name.toLowerCase().includes(q) || t.specialization.toLowerCase().includes(q))
      .map((t) => ({ type: 'teacher' as const, id: t.id, title: t.name, desc: t.instrument }));

    const events = EVENTS_DATA.filter((e) => e.title.toLowerCase().includes(q) || e.shortDescription.toLowerCase().includes(q))
      .map((e) => ({ type: 'event' as const, id: e.id, title: e.title, desc: e.date }));

    return [...courses, ...teachers, ...events];
  }, [query]);

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
            placeholder="Search courses, teachers, events, products..."
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
              <p className="text-[10px] font-bold uppercase text-gray-400">Popular Quick Queries</p>
              <div className="flex flex-wrap gap-2 text-xs">
                {['Begena', 'Krar Tuning', 'Piazza Hours', 'Lique Mezemer Abel', 'Events'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="bg-[#FAF6EF] hover:bg-[#E7DED1]/50 border border-[#E7DED1] px-3 py-1.5 rounded-lg text-[#666666] hover:text-[#2B2B2B] cursor-pointer"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          ) : searchResults.length > 0 ? (
            <div className="space-y-2">
              <p className="text-[10px] font-bold uppercase text-gray-400">Results ({searchResults.length})</p>
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
                        {res.type}
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
              No results match "{query}". Try checking your spelling.
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
            {isLogin ? 'LOG IN TO ECOSYSTEM' : 'CREATE STUDENT PORTAL'}
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
              <h4 className="text-sm font-bold text-green-800">Authentication Token Active</h4>
              <p className="text-xs text-green-700">
                You have successfully {isLogin ? 'logged in' : 'registered'} (Ecosystem Sandbox Mode). In Phase 2, this will load your persistent student records.
              </p>
              <Button variant="primary" size="sm" className="w-full text-xs font-bold mt-2" onClick={onClose}>
                ENTER DASHBOARD
              </Button>
            </motion.div>
          ) : (
            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#666666] uppercase">Full Name</label>
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
                <label className="text-[10px] font-bold text-[#666666] uppercase">Email Address</label>
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
                <label className="text-[10px] font-bold text-[#666666] uppercase">Security Password</label>
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
                  <span className="text-[10px] text-gray-500">I agree to the Begena School respect directives.</span>
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                className="w-full text-xs font-bold uppercase py-2.5"
                isLoading={mockLoading}
              >
                {isLogin ? 'ENTER ACCREDITED PORTAL' : 'BEGIN YOUR PORTAL PROFILE'}
              </Button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-[11px] text-[#C79A2B] hover:underline font-bold cursor-pointer"
                >
                  {isLogin ? "Don't have a profile? Register now" : 'Already registered? Log in'}
                </button>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}

