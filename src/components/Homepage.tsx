import React, { useState } from 'react';
import {
  Play,
  ArrowRight,
  Clock,
  MapPin,
  Check,
  ChevronRight,
  Sparkles,
  Users,
  BookOpen,
  Award,
  Shield,
  Video,
  ChevronDown,
  ShoppingBag,
  Send,
  MessageSquare,
  HelpCircle,
  FileText,
  Music
} from 'lucide-react';
import { motion } from 'motion/react';
import { Course, Teacher, Event, Product, Article, Testimonial, Branch, GalleryItem, PageId, Language } from '../types';
import { COURSES_DATA, TEACHERS_DATA, EVENTS_DATA, PRODUCTS_DATA, ARTICLES_DATA, TESTIMONIALS_DATA, BRANCHES_DATA, GALLERY_DATA, TRANSLATIONS, ABEL_BEGENA_PHOTO, isCourseComingSoon, getLocalizedCourse, getLocalizedTeacher } from '../data/websiteData';
import newBegenaPhoto from '../assets/images/New_begena.jpg';
import begenatogetherPhoto from '../assets/images/begenatogether.jpg';
import { Button } from './InteractiveComponents';
import { useAuth } from '../context/AuthContext';
import { CourseComingSoonModal } from './CourseComingSoonModal';
import { StoreComingSoonModal } from './StoreComingSoonModal';

interface HomepageProps {
  lang: Language;
  onNavigate: (page: PageId, params?: any) => void;
  onOpenAuth: () => void;
}

export function Homepage({ lang, onNavigate, onOpenAuth }: HomepageProps) {
  const { currentUser } = useAuth();
  const t = TRANSLATIONS[lang];
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);
  const [comingSoonCourse, setComingSoonCourse] = useState<Course | null>(null);
  const [isStoreComingSoonOpen, setIsStoreComingSoonOpen] = useState(false);

  const handleStartLearningClick = () => {
    if (!currentUser) {
      onNavigate('login');
    } else if (currentUser.role === 'teacher') {
      onNavigate('teacher');
    } else if (currentUser.role !== 'student') {
      onNavigate(currentUser.role as PageId);
    } else {
      onNavigate('student-registration');
    }
  };

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterSuccess(true);
    setTimeout(() => {
      setNewsletterEmail('');
    }, 2000);
  };

  const faqItems = lang === 'am' ? [
    {
      q: 'ምን ምን የዜማ መሣሪያዎችን መማር እችላለሁ?',
      a: 'በገና (የዳዊት በገና)፣ ክራር (ባህላዊና ኤሌክትሪክ)፣ ማሲንቆ፣ የቀርከሃ ዋሽንት፣ የቅዱስ ያሬድ ዜማ (ድምፅ) እና ባህላዊ ከበሮን መማር ይችላሉ።'
    },
    {
      q: 'የቀደመ የሙዚቃ ልምድ ያስፈልገኛል?',
      a: 'በፍጹም አያስፈልግም! ሁሉም ትምህርቶቻችን ቀደም ሲል ምንም ዓይነት የሙዚቃ ልምድ ለሌላቸው ሙሉ ጀማሪዎች ተብለው ከተዘጋጁ ከመሰረታዊ ደረጃ 1 ይጀምራሉ።'
    },
    {
      q: 'ሙሉ በሙሉ በኦንላይን መማር ይቻላል?',
      a: 'አዎ! ጥራት ባላቸው የተቀረጹ የቪዲዮ ትምህርቶች፣ በሚወርዱ የኖታ ማስታወሻዎች እና በየሳምንቱ ከአስተማሪዎች ጋር በሚደረግ የቀጥታ ግንኙነት በኦንላይን መማር ይችላሉ።'
    },
    {
      q: 'የአካል ቅርንጫፋችሁ የት ይገኛል?',
      a: 'ዋና ቅርንጫፋችን የሚገኘው በሐዋሳ፣ ሴንተር ፖይንት ታወር አንደኛ ፎቅ (Center Point Tower, First Floor, Hawassa) ላይ ነው። እንዲሁም ዓለም አቀፍ ተማሪዎቻችንን በኦንላይን ካምፓሳችን እናስተናግዳለን።'
    },
    {
      q: 'የትምህርቱ ቆይታ ምን ያህል ጊዜ ነው?',
      a: 'የትምህርቶቻችን የቆይታ ጊዜያት 3፣ 4 እና 6 ወራት ብቻ ናቸው። እንደ መረጡት ፍጥነትና መርሃ ግብር (ጥቅል 1፡ 3 ወራት፣ ጥቅል 2፡ 4 ወራት ወይም ጥቅል 3፡ 6 ወራት) ተመዝግበው መማር ይችላሉ።'
    },
    {
      q: 'ስመረቅ ህጋዊ የምስክር ወረቀት ይሰጠኛል?',
      a: 'አዎ! የንድፈ-ሀሳብና የተግባር ፈተናዎችን እንዲሁም የግል የብቃት አቀራረብ ካጠናቀቁ በኋላ በዲያቆን ብሩክ ተስፋዬ የተፈረመበትና ማህተም ያረፈበት ይፋዊ የምስክር ወረቀት ይሰጥዎታል።'
    }
  ] : [
    {
      q: 'What instruments can I learn?',
      a: 'You can study Begena (Harp of David), Krar (Acoustic and Electric Bowl Lyre), Masenqo (Single-String Lute), Washint (Bamboo Flute), Traditional Vocals (St. Yared Hymnology), and Kebero (Liturgical/Secular Percussion).'
    },
    {
      q: 'Do I need previous musical experience?',
      a: 'Absolutely not. All of our programs are structured starting from "Basic Level 1" designed specifically for absolute beginners who have never touched an instrument.'
    },
    {
      q: 'Can I learn entirely online?',
      a: 'Yes! We have designed a highly effective digital learning portal that provides HD recorded video tutorials, downloadable PDF worksheets, and weekly 1-on-1 live feedback sessions over Google Meet/Zoom with certified instructors.'
    },
    {
      q: 'Where is the physical branch located?',
      a: 'We have our main physical branch in Hawassa at Center Point Tower, first floor (Hawassa, Ethiopia). We also serve students across the globe through our dedicated Online Campus.'
    },
    {
      q: 'How long are the courses?',
      a: 'Our available learning durations are 3, 4, and 6 months only, structured to fit your preferred pacing (Package 1: 3 months, Package 2: 4 months, and Package 3: 6 months).'
    },
    {
      q: 'Do I receive a certified credential upon graduation?',
      a: 'Yes, upon successful completion of your practical exams and solo recitals, you will receive a beautiful, formal Certificate of Accomplishment stamped and signed by Deacon Bruk Tesfaye.'
    }
  ];

  const localizedTestimonials = lang === 'am' ? [
    {
      id: 't1',
      name: 'ሰሎሞን ግርማ',
      course: 'የበገና ትምህርት',
      branchOrOnline: 'የዋሽንግተን ዲሲ ዳያስፖራ (ኦንላይን)',
      text: 'በዳያስፖራ ውስጥ እየኖርኩ ጥንታዊውን የዳዊት በገና መማር እችላለሁ ብዬ አስቤ አላውቅም ነበር። የኦንላይን ትምህርቱና የአስተማሪዎቹ ክትትል እጅግ አስደናቂ ነው።',
      avatar: ''
    },
    {
      id: 't2',
      name: 'መርዓዊ ተፈራ',
      course: 'የክራር ትምህርት',
      branchOrOnline: 'የሐዋሳ ዋና ቅርንጫፍ',
      text: 'በሐዋሳ ዋና ቅርንጫፍ በሴንተር ፖይንት ታወር በአካል በመማሬ በሶስት ወር ውስጥ አራቱንም ቅኝቶች መደርደር ችያለሁ። ትምህርት ቤቱን ለሁሉም ወዳጆቼ እመክራለሁ።',
      avatar: ''
    },
    {
      id: 't3',
      name: 'ሄለን ታደሰ',
      course: 'የያሬዳዊ ዜማ ስልጠና',
      branchOrOnline: 'የሐዋሳ ዋና ቅርንጫፍ',
      text: 'በሐዋሳ ዋና ቅርንጫፍ የቅዱስ ያሬድን የዜማ ስልቶችና የድምፅ አወጣጥ ከሊቃውንቱ መማር መንፈሳዊ እርካታን ሰጥቶኛል።',
      avatar: ''
    }
  ] : TESTIMONIALS_DATA;

  return (
    <div className="space-y-20 pb-16">
      {/* 1. CINEMATIC HERO SECTION */}
      <section className="relative rounded-3xl overflow-hidden border border-[#E7DED1] bg-gradient-to-br from-[#FFFDF8] via-[#FAF6EF] to-white p-6 sm:p-10 lg:p-16">
        <div className="absolute inset-0 opacity-[0.03] bg-dot-pattern pointer-events-none" />
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center text-left relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="lg:col-span-7 space-y-6"
          >
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#C79A2B] bg-white border border-[#E7DED1] px-3.5 py-1.5 rounded-full shadow-3xs inline-flex items-center gap-1.5">
              <Sparkles size={11} className="text-[#E89B52]" /> {t.hero.eyebrow}
            </span>
            <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-[#2B2B2B] tracking-tight leading-none">
              {t.hero.headline}
            </h1>
            <p className="text-sm sm:text-base text-[#666666] leading-relaxed max-w-xl">
              {t.hero.supporting}
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Button
                variant="primary"
                size="lg"
                onClick={handleStartLearningClick}
                rightIcon={<ArrowRight size={16} />}
              >
                {t.hero.primaryCTA}
              </Button>
              <Button
                variant="secondary"
                size="lg"
                className="bg-white text-[#2B2B2B] border border-[#E7DED1] hover:bg-[#FAF6EF] hover:text-[#2B2B2B]"
                onClick={() => onNavigate('courses')}
              >
                {t.hero.secondaryCTA}
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="lg:col-span-5 relative"
          >
            <div className="relative rounded-2xl overflow-hidden border-2 border-[#C79A2B] shadow-lg h-96 sm:h-[440px] img-zoom-wrapper img-lift bg-[#121212]">
              {/* Authentically captured representation of Deacon Bruk Tesfaye playing Begena */}
              <img
                src={newBegenaPhoto}
                alt="Deacon Bruk Tesfaye - Liora Begena"
                className="w-full h-full object-cover object-[center_20%] transition-transform duration-700 ease-out opacity-100 block"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 dark:bg-[#1A1A1E]/95 backdrop-blur-xs p-4 rounded-xl border border-[#E7DED1] dark:border-[#2E2E36] shadow-md transition-all">
                <p className="text-xs font-bold text-[#2B2B2B] dark:text-[#F8F9FA]">
                  {lang === 'am' ? 'ዲያቆን ብሩክ ተስፋዬ — ሊዮራ በገና' : 'Deacon Bruk Tesfaye — Liora Begena'}
                </p>
                <p className="text-[10px] text-[#666666] dark:text-[#A1A1AA] mt-0.5">
                  {lang === 'am' ? 'የዳዊት በገና ድርደራና የዜማ ጥበብ' : 'Mastering the Sacred Harp of David'}
                </p>
              </div>
            </div>

            {/* Subtle overlay floating elements representing stats */}
            <div className="absolute -top-4 -right-4 bg-white border border-[#E7DED1] px-3.5 py-2 rounded-xl shadow-md text-xs animate-floatGently">
              <p className="font-black text-[#E89B52]">1000+ Active</p>
              <p className="text-[10px] text-[#666666]">Global Students</p>
            </div>
            <div className="absolute -bottom-4 -left-4 bg-[#2B2B2B] text-white border border-[#C79A2B]/40 px-3.5 py-2 rounded-xl shadow-md text-xs animate-floatGently" style={{ animationDelay: '1.5s' }}>
              <p className="font-bold text-[#E89B52]">Hawassa main Branch</p>
              <p className="text-[10px] text-gray-300">Center Point Tower</p>
            </div>
          </motion.div>
        </div>
      </section>


      {/* 2. TRUST STATISTICS */}
      <section className="bg-white border border-[#E7DED1] rounded-2xl p-6 sm:p-8 max-w-7xl mx-auto shadow-2xs animate-fadeInUp">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-[#E7DED1]">
          <div className="space-y-1.5 p-2 transform-gpu animate-fadeIn hover:-translate-y-1 hover:shadow-xl transition-all duration-300" style={{ animationDelay: '0s' }}>
            <h3 className="text-2xl sm:text-3xl font-black text-[#2B2B2B] font-display">1000+</h3>
            <p className="text-xs text-[#666666] font-semibold uppercase tracking-wider">{t.stats.students}</p>
          </div>
          <div className="space-y-1.5 p-2 pt-6 md:pt-2 transform-gpu animate-fadeIn hover:-translate-y-1 hover:shadow-xl transition-all duration-300" style={{ animationDelay: '0.1s' }}>
            <h3 className="text-2xl sm:text-3xl font-black text-[#2B2B2B] font-display">1</h3>
            <p className="text-xs text-[#666666] font-semibold uppercase tracking-wider">{t.stats.branches}</p>
          </div>
          <div className="space-y-1.5 p-2 pt-6 md:pt-2 transform-gpu animate-fadeIn hover:-translate-y-1 hover:shadow-xl transition-all duration-300" style={{ animationDelay: '0.2s' }}>
            <h3 className="text-2xl sm:text-3xl font-black text-[#2B2B2B] font-display">15+</h3>
            <p className="text-xs text-[#666666] font-semibold uppercase tracking-wider">{t.stats.teachers}</p>
          </div>
          <div className="space-y-1.5 p-2 pt-6 md:pt-2 transform-gpu animate-fadeIn hover:-translate-y-1 hover:shadow-xl transition-all duration-300" style={{ animationDelay: '0.3s' }}>
            <h3 className="text-2xl sm:text-3xl font-black text-[#2B2B2B] font-display">6+</h3>
            <p className="text-xs text-[#666666] font-semibold uppercase tracking-wider">{t.stats.programs}</p>
          </div>
        </div>
      </section>

      {/* 3. INTRODUCTION / STORYTELLING */}
      <section className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center text-left">
        <div className="lg:col-span-5 h-80 rounded-2xl overflow-hidden border border-[#E7DED1]">
          <img
            src={begenatogetherPhoto}
            alt="Preserving Music Heritage"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="lg:col-span-7 space-y-6">
          <h2 className="font-display font-black text-3xl sm:text-4xl text-[#2B2B2B] tracking-tight">
            {t.intro.title}
          </h2>
          <p className="text-sm sm:text-base text-[#666666] leading-relaxed">
            {t.intro.body1}
          </p>
          <p className="text-sm text-[#666666] leading-relaxed">
            {t.intro.body2}
          </p>
          <Button
            variant="secondary"
            onClick={() => onNavigate('about-begena')}
            rightIcon={<ChevronRight size={14} />}
          >
            {t.intro.cta}
          </Button>
        </div>
      </section>

      {/* 4. FOUNDER FOCUS SECTION */}
      <section className="bg-[#FAF6EF]/60 border border-[#E7DED1] rounded-3xl p-6 sm:p-10 max-w-7xl mx-auto text-left">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-4 flex justify-center">
            <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-full overflow-hidden border-2 border-[#C79A2B] shadow-md">
              <img
                src={ABEL_BEGENA_PHOTO}
                alt="Bruk - Founder"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
          <div className="md:col-span-8 space-y-4">
            <span className="text-[10px] font-bold text-[#C79A2B] uppercase tracking-wider">{t.founder.title}</span>
            <h3 className="text-2xl font-black text-[#2B2B2B] font-display">{t.founder.name}</h3>
            <p className="text-xs font-semibold uppercase text-gray-400">{t.founder.role}</p>
            <p className="text-sm italic font-serif text-[#6F4E37] leading-relaxed">
              {t.founder.bio}
            </p>
            <Button
              variant="secondary"
              size="sm"
              className="text-xs uppercase font-bold"
              onClick={() => onNavigate('about-abel')}
            >
              {t.founder.cta}
            </Button>
          </div>
        </div>
      </section>

      {/* 5. COURSE DISCOVERY */}
      <section className="space-y-8 max-w-[1400px] mx-auto px-2 sm:px-4">
        <div className="text-center space-y-2">
          <h2 className="font-display font-black text-3xl text-[#2B2B2B] tracking-tight">{t.instruments.title}</h2>
          <p className="text-xs sm:text-sm text-[#666666] max-w-lg mx-auto">{t.instruments.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
          {COURSES_DATA.map((course) => {
            const locCourse = getLocalizedCourse(course, lang);
            const isComingSoon = isCourseComingSoon(course.id);
            return (
              <div
                key={course.id}
                onClick={() => {
                  if (isComingSoon) {
                    setComingSoonCourse(locCourse);
                  } else {
                    onNavigate('course-detail', { courseId: course.id });
                  }
                }}
                className={`bg-white border rounded-2xl overflow-hidden shadow-2xs card-interactive flex flex-col justify-between group h-full text-left cursor-pointer transition-all ${
                  isComingSoon
                    ? 'border-amber-200/90 hover:border-amber-400 hover:shadow-md'
                    : 'border-[#E7DED1] hover:border-[#C79A2B]'
                }`}
              >
                <div>
                  <div className="aspect-[3/4] w-full overflow-hidden relative img-zoom-wrapper bg-[#FAF6EF]">
                    <img
                      src={course.image}
                      alt={locCourse.name}
                      className="w-full h-full object-cover transition-transform duration-500 ease-out"
                      referrerPolicy="no-referrer"
                    />
                    {isComingSoon ? (
                      <div className="absolute top-2.5 right-2.5 bg-gradient-to-r from-amber-600 to-amber-700 text-white backdrop-blur-xs px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider shadow-sm flex items-center gap-1 border border-amber-500/40">
                        {lang === 'am' ? 'በቅርቡ' : 'Coming Soon'}
                      </div>
                    ) : (
                      <div className="absolute top-2.5 right-2.5 bg-white/95 backdrop-blur-xs px-2 py-0.5 rounded-full text-[10px] font-bold text-[#C79A2B] border border-[#E7DED1] shadow-2xs">
                        ★ {course.rating}
                      </div>
                    )}
                  </div>
                  <div className="p-3.5 space-y-1.5">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h3 className="text-xs sm:text-sm font-bold text-[#2B2B2B] group-hover:text-[#E89B52] transition-colors leading-snug">
                        {locCourse.name}
                      </h3>
                      {isComingSoon && (
                        <span className="text-[8px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100/80 border border-amber-300 px-1.5 py-0.5 rounded">
                          {t.common.soon}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#666666] leading-relaxed line-clamp-2">{locCourse.shortDescription}</p>
                  </div>
                </div>

                <div className="p-3.5 pt-0 border-t border-[#FAF6EF] flex flex-col gap-2.5">
                  <div className="flex justify-between items-center text-[10px] text-[#666666] py-1">
                    <span className="font-semibold bg-[#FAF6EF] px-1.5 py-0.5 rounded border border-[#E7DED1] text-[9px]">{locCourse.difficulty}</span>
                    <span className="text-[9px] font-medium">{locCourse.duration}</span>
                  </div>
                  <Button
                    variant={isComingSoon ? "ghost" : "secondary"}
                    size="sm"
                    className={`w-full text-[10px] font-bold uppercase py-1.5 transition-all cursor-pointer ${
                      isComingSoon
                        ? 'bg-amber-50/90 text-amber-900 border border-amber-300 hover:bg-amber-100 hover:border-amber-400 font-extrabold shadow-2xs'
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
                    {isComingSoon ? (lang === 'am' ? 'በቅርቡ ይጠብቁን' : 'COMING SOON') : (lang === 'am' ? 'ትምህርቱን ይመልከቱ' : 'VIEW COURSE')}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-4 text-center">
          <Button
            variant="primary"
            onClick={() => onNavigate('courses')}
            rightIcon={<ArrowRight size={14} />}
          >
            {t.instruments.viewAll}
          </Button>
        </div>
      </section>

      {/* 6. FEATURED BEGENA JOURNEY MAP */}
      <section className="bg-[#FAF6EF]/55 dark:bg-[#111318]/85 border border-[#E7DED1] dark:border-[#2E2E36] rounded-3xl p-6 sm:p-10 max-w-7xl mx-auto text-left space-y-8">
        <div className="max-w-2xl space-y-2">
          <span className="text-[9px] font-bold uppercase tracking-wider text-[#C79A2B]">{t.journey.badge}</span>
          <h3 className="text-xl sm:text-2xl font-black text-[#2B2B2B] dark:text-[#F8F9FA] font-display">{t.journey.title}</h3>
          <p className="text-xs text-[#666666] dark:text-[#A1A1AA]">{t.journey.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {/* Timeline steps */}
          <div className="bg-white dark:bg-[#111318] dark:border-[#2E2E36] border border-[#E7DED1] p-5 rounded-2xl relative space-y-3">
            <span className="text-xs font-extrabold text-[#E89B52] bg-[#FAF6EF] dark:bg-[#1D1F27] dark:border-[#2E2E36] border border-[#E7DED1] px-2 py-0.5 rounded-full uppercase tracking-wider">
              {t.journey.phase1Tag}
            </span>
            <h4 className="font-bold text-[#2B2B2B] dark:text-[#F8F9FA] text-sm">{t.journey.phase1Title}</h4>
            <p className="text-xs text-[#666666] dark:text-[#A1A1AA] leading-relaxed">
              {t.journey.phase1Desc}
            </p>
          </div>

          <div className="bg-white dark:bg-[#111318] dark:border-[#2E2E36] border border-[#E7DED1] p-5 rounded-2xl relative space-y-3">
            <span className="text-xs font-extrabold text-[#E89B52] bg-[#FAF6EF] dark:bg-[#1D1F27] dark:border-[#2E2E36] border border-[#E7DED1] px-2 py-0.5 rounded-full uppercase tracking-wider">
              {t.journey.phase2Tag}
            </span>
            <h4 className="font-bold text-[#2B2B2B] dark:text-[#F8F9FA] text-sm">{t.journey.phase2Title}</h4>
            <p className="text-xs text-[#666666] dark:text-[#A1A1AA] leading-relaxed">
              {t.journey.phase2Desc}
            </p>
          </div>

          <div className="bg-white dark:bg-[#111318] dark:border-[#2E2E36] border border-[#E7DED1] p-5 rounded-2xl relative space-y-3">
            <span className="text-xs font-extrabold text-[#E89B52] bg-[#FAF6EF] dark:bg-[#1D1F27] dark:border-[#2E2E36] border border-[#E7DED1] px-2 py-0.5 rounded-full uppercase tracking-wider">
              {t.journey.phase3Tag}
            </span>
            <h4 className="font-bold text-[#2B2B2B] dark:text-[#F8F9FA] text-sm">{t.journey.phase3Title}</h4>
            <p className="text-xs text-[#666666] dark:text-[#A1A1AA] leading-relaxed">
              {t.journey.phase3Desc}
            </p>
          </div>
        </div>

        <div className="pt-2 text-center md:text-left">
          <Button
            variant="secondary"
            onClick={() => onNavigate('courses', { instrument: 'begena' })}
          >
            {t.journey.cta}
          </Button>
        </div>
      </section>

      {/* 7. HOW IT WORKS */}
      <section className="space-y-10 max-w-7xl mx-auto text-center">
        <div className="space-y-2">
          <h2 className="font-display font-black text-3xl text-[#2B2B2B] tracking-tight">{t.howItWorksSection.title}</h2>
          <p className="text-xs sm:text-sm text-[#666666] max-w-sm mx-auto">{t.howItWorksSection.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-6 text-left">
          <div className="space-y-2">
            <span className="text-2xl font-black text-[#E89B52] font-mono">01</span>
            <h4 className="text-xs font-bold uppercase">{t.howItWorksSection.step1Title}</h4>
            <p className="text-[11px] text-[#666666] leading-relaxed">{t.howItWorksSection.step1Desc}</p>
          </div>
          <div className="space-y-2">
            <span className="text-2xl font-black text-[#E89B52] font-mono">02</span>
            <h4 className="text-xs font-bold uppercase">{t.howItWorksSection.step2Title}</h4>
            <p className="text-[11px] text-[#666666] leading-relaxed">{t.howItWorksSection.step2Desc}</p>
          </div>
          <div className="space-y-2">
            <span className="text-2xl font-black text-[#E89B52] font-mono">03</span>
            <h4 className="text-xs font-bold uppercase">{t.howItWorksSection.step3Title}</h4>
            <p className="text-[11px] text-[#666666] leading-relaxed">{t.howItWorksSection.step3Desc}</p>
          </div>
          <div className="space-y-2">
            <span className="text-2xl font-black text-[#E89B52] font-mono">04</span>
            <h4 className="text-xs font-bold uppercase">{t.howItWorksSection.step4Title}</h4>
            <p className="text-[11px] text-[#666666] leading-relaxed">{t.howItWorksSection.step4Desc}</p>
          </div>
          <div className="space-y-2">
            <span className="text-2xl font-black text-[#E89B52] font-mono">05</span>
            <h4 className="text-xs font-bold uppercase">{t.howItWorksSection.step5Title}</h4>
            <p className="text-[11px] text-[#666666] leading-relaxed">{t.howItWorksSection.step5Desc}</p>
          </div>
        </div>
      </section>

      {/* 8. ONLINE LEARNING PROMOTER */}
      <section className="bg-[#2B2B2B] text-[#FFFDF8] rounded-3xl p-8 sm:p-12 max-w-7xl mx-auto text-left relative overflow-hidden border border-[#C79A2B]/20">
        <div className="absolute inset-0 opacity-[0.05] bg-dot-pattern pointer-events-none" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
          <div className="lg:col-span-7 space-y-5">
            <span className="text-[9px] font-bold text-[#E89B52] border border-[#E89B52]/30 px-2.5 py-1 rounded-full uppercase tracking-wider">
              {t.onlineSection.badge}
            </span>
            <h3 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">{t.onlineSection.title}</h3>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              {t.onlineSection.desc}
            </p>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="flex gap-2 items-center">
                <span className="text-green-400">✔</span> <span>{t.onlineSection.f1}</span>
              </div>
              <div className="flex gap-2 items-center">
                <span className="text-green-400">✔</span> <span>{t.onlineSection.f2}</span>
              </div>
              <div className="flex gap-2 items-center">
                <span className="text-green-400">✔</span> <span>{t.onlineSection.f3}</span>
              </div>
              <div className="flex gap-2 items-center">
                <span className="text-green-400">✔</span> <span>{t.onlineSection.f4}</span>
              </div>
            </div>
            <Button
              variant="primary"
              onClick={() => onNavigate('courses')}
            >
              {t.onlineSection.cta}
            </Button>
          </div>
          <div className="lg:col-span-5 h-64 sm:h-72 rounded-2xl overflow-hidden border border-white/10 shadow-lg relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#6F4E37]/50 via-transparent to-[#E89B52]/20" />
            <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-6 space-y-2">
              <Video size={40} className="text-[#E89B52] animate-pulse" />
              <p className="font-bold text-sm">{t.onlineSection.demoTitle}</p>
              <p className="text-[11px] text-gray-400">{t.onlineSection.demoDesc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 9. TEACHERS SHOWCASE PREVIEW */}
      <section className="space-y-8 max-w-7xl mx-auto">
        <div className="text-center space-y-2">
          <h2 className="font-display font-black text-3xl text-[#2B2B2B] tracking-tight">{t.teachersSection.title}</h2>
          <p className="text-xs sm:text-sm text-[#666666]">{t.teachersSection.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TEACHERS_DATA.slice(0, 4).map((teacher) => {
            const locTeacher = getLocalizedTeacher(teacher, lang);
            return (
              <div
                key={teacher.id}
                className="bg-white border border-[#E7DED1] rounded-2xl overflow-hidden shadow-xs card-interactive flex flex-col group text-left justify-between h-full"
              >
                <div>
                  <div className="h-44 overflow-hidden relative img-zoom-wrapper">
                    {locTeacher.photo ? (
                      <img
                        src={locTeacher.photo}
                        alt={locTeacher.name}
                        className="w-full h-full object-cover transition-transform duration-500 ease-out"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#3B2818] text-[#E89B52] font-black text-2xl flex items-center justify-center">
                        {locTeacher.name?.charAt(0) || 'T'}
                      </div>
                    )}
                    <div className="absolute top-3 right-3 bg-[#2B2B2B]/90 backdrop-blur-xs text-white px-2.5 py-0.5 rounded-full text-[9px] font-bold border border-[#C79A2B]/40 uppercase tracking-wider shadow-sm">
                      {locTeacher.instrument}
                    </div>
                  </div>
                  <div className="p-5 space-y-2">
                    <h3 className="text-sm font-bold text-[#2B2B2B] group-hover:text-[#E89B52] transition-colors">{locTeacher.name}</h3>
                    <p className="text-[10px] text-[#E89B52] font-bold uppercase">{locTeacher.specialization.split(',')[0]}</p>
                    <p className="text-xs text-[#666666] leading-relaxed line-clamp-3">{locTeacher.bio}</p>
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-[#FAF6EF]">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full text-xs font-bold uppercase mt-2"
                    onClick={() => onNavigate('teacher-profile', { teacherId: locTeacher.id })}
                  >
                    {t.teachersSection.viewProfile}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center">
          <Button
            variant="secondary"
            onClick={() => onNavigate('teachers')}
          >
            {t.teachersSection.viewAll}
          </Button>
        </div>
      </section>

      {/* 10. REALISTIC DIASPORA TESTIMONIALS */}
      <section className="bg-white border border-[#E7DED1] rounded-3xl p-6 sm:p-10 max-w-7xl mx-auto text-left space-y-8">
        <div className="text-center space-y-2">
          <h2 className="font-display font-black text-2xl sm:text-3xl text-[#2B2B2B]">{t.testimonialsSection.title}</h2>
          <p className="text-xs sm:text-sm text-[#666666]">{t.testimonialsSection.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {localizedTestimonials.map((test) => (
            <div key={test.id} className="border border-[#E7DED1] p-5 rounded-2xl bg-[#FAF6EF]/10 space-y-4 flex flex-col justify-between h-full">
              <p className="text-xs text-[#666666] italic leading-relaxed">
                “{test.text}”
              </p>
              <div className="flex gap-3 items-center pt-3 border-t border-[#E7DED1]/60">
                <div className="w-10 h-10 rounded-full overflow-hidden border border-[#C79A2B] shrink-0 flex items-center justify-center bg-[#3B2818] text-[#E89B52] font-bold text-xs">
                  {test.avatar ? (
                    <img src={test.avatar} alt={test.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    test.name?.charAt(0) || 'S'
                  )}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#2B2B2B]">{test.name}</h4>
                  <p className="text-[10px] text-gray-400">{test.course} · <strong className="text-[9px] text-[#6F4E37]">{test.branchOrOnline}</strong></p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 11. RECENT MEDIA GALLERY PREVIEW */}
      <section className="space-y-6 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center text-left gap-4">
          <div>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-[#2B2B2B] tracking-tight">{t.gallerySection.title}</h2>
            <p className="text-xs text-[#666666]">{t.gallerySection.subtitle}</p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onNavigate('gallery')}
            rightIcon={<ChevronRight size={12} />}
          >
            {t.gallerySection.viewAll}
          </Button>
        </div>

        {GALLERY_DATA.length === 0 ? (
          <div className="text-center py-12 px-4 bg-white border border-[#E7DED1] rounded-2xl space-y-2">
            <p className="font-display font-bold text-sm text-[#2B2B2B]">
              {lang === 'am' ? 'የማዕከለ-ስዕላት ፎቶዎች በቅርቡ ይጫናሉ' : 'Media Gallery Pictures Coming Soon'}
            </p>
            <p className="text-xs text-[#666666]">
              {lang === 'am' ? 'አዳዲስ የተቀረጹ ፎቶዎችና የክንዋኔ ምስሎች በማዕከለ-ስዕላቱ ይካተታሉ' : 'Fresh recital and classroom moments will be featured here soon'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {GALLERY_DATA.slice(0, 4).map((item) => (
              <div
                key={item.id}
                onClick={() => onNavigate('gallery')}
                className="h-44 sm:h-52 rounded-xl overflow-hidden border border-[#E7DED1] cursor-pointer relative group"
              >
                <img
                  src={item.url}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-200"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3 text-left" />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 12. STORE PREVIEW PANEL */}
      <section className="bg-[#FAF6EF]/60 border border-[#E7DED1] rounded-3xl p-6 sm:p-10 max-w-7xl mx-auto text-left space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <span className="text-[9px] font-bold uppercase text-[#C79A2B] tracking-widest">{t.storeSection.badge}</span>
            <h3 className="font-display font-black text-xl sm:text-2xl text-[#2B2B2B]">{t.storeSection.title}</h3>
            <p className="text-xs text-[#666666]">{t.storeSection.subtitle}</p>
          </div>
          <div className="bg-yellow-100 text-yellow-800 border border-yellow-200 text-[10px] font-bold px-3 py-1 rounded-full uppercase">
            {t.storeSection.status}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {PRODUCTS_DATA.slice(0, 3).map((p) => (
            <div
              key={p.id}
              onClick={() => setIsStoreComingSoonOpen(true)}
              className="bg-white border border-[#E7DED1] rounded-2xl p-4 space-y-3 shadow-3xs text-left cursor-pointer hover:border-[#6F4E37]/60 hover:shadow-sm transition-all group"
            >
              <div className="h-40 rounded-xl overflow-hidden border border-[#FAF6EF] flex flex-col items-center justify-center bg-gradient-to-br from-[#FAF6EF] via-white to-[#F5ECE0] relative p-4 text-center">
                <div className="w-14 h-14 rounded-2xl bg-amber-100/90 text-[#E89B52] flex items-center justify-center mb-2 shadow-inner group-hover:scale-110 transition-transform duration-300">
                  <Music size={26} className="text-[#E89B52]" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#6F4E37]">
                  {lang === 'am' ? 'በእደ-ጥበብ ዝግጅት ላይ' : 'Handcrafted Sacred Instrument'}
                </span>
                <span className="absolute top-2 right-2 text-[9px] font-extrabold uppercase bg-amber-100 text-amber-800 border border-amber-300 px-2 py-0.5 rounded-full shadow-2xs">
                  {lang === 'am' ? 'በቅርቡ' : 'Soon'}
                </span>
              </div>
              <div className="py-2.5 text-center flex items-center justify-center">
                <div className="inline-flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50/80 border border-amber-200">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  <span className="text-xs font-black uppercase tracking-wider text-[#6F4E37]">
                    {lang === 'am' ? 'በቅርቡ ይጠብቁን' : 'Coming Soon'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-2 text-center">
          <Button variant="ghost" className="text-xs font-bold uppercase text-gray-500 hover:text-[#6F4E37]" onClick={() => setIsStoreComingSoonOpen(true)}>
            {t.storeSection.viewAll}
          </Button>
        </div>
      </section>

      {/* 13. FREQUENTLY ASKED QUESTIONS */}
      <section className="max-w-4xl mx-auto text-left space-y-8">
        <div className="text-center space-y-2">
          <h2 className="font-display font-black text-2xl sm:text-3xl text-[#2B2B2B] tracking-tight">{t.faqSection.title}</h2>
          <p className="text-xs sm:text-sm text-[#666666]">{t.faqSection.subtitle}</p>
        </div>

        <div className="space-y-3.5">
          {faqItems.map((faq, i) => (
            <div key={i} className="border border-[#E7DED1] rounded-xl overflow-hidden bg-white">
              <button
                onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                className="w-full px-5 py-4 text-left flex justify-between items-center bg-[#FAF6EF]/30 hover:bg-[#FAF6EF]/60 cursor-pointer"
              >
                <span className="text-xs sm:text-sm font-bold text-[#2B2B2B]">{faq.q}</span>
                <ChevronDown size={14} className={`text-gray-400 transition-transform ${activeFaq === i ? 'rotate-180' : ''}`} />
              </button>
              {activeFaq === i && (
                <div className="px-5 py-4 border-t border-[#E7DED1]/50 bg-white">
                  <p className="text-xs text-[#666666] leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 14. FINAL CALL TO ACTION */}
      <section className="bg-[#2B2B2B] text-[#FFFDF8] rounded-3xl p-8 sm:p-12 max-w-7xl mx-auto text-center relative overflow-hidden border border-[#C79A2B]/40">
        <div className="absolute inset-0 opacity-[0.05] bg-dot-pattern pointer-events-none" />
        <div className="max-w-2xl mx-auto space-y-6 relative z-10">
          <span className="text-[10px] font-bold text-[#E89B52] uppercase tracking-widest bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full inline-block">
            {t.ctaSection.badge}
          </span>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight leading-tight">
            {t.ctaSection.title}
          </h2>
          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed max-w-md mx-auto">
            {t.ctaSection.subtitle}
          </p>
          <div className="flex flex-wrap gap-4 justify-center pt-2">
            <Button
              variant="primary"
              size="lg"
              onClick={handleStartLearningClick}
            >
              {t.ctaSection.primaryCTA}
            </Button>
            <Button
              variant="secondary"
              size="lg"
              className="bg-white text-[#2B2B2B] border border-[#E7DED1] hover:bg-[#FAF6EF] hover:text-[#2B2B2B]"
              onClick={() => onNavigate('courses')}
            >
              {t.ctaSection.secondaryCTA}
            </Button>
          </div>
        </div>
      </section>

      {/* Course Coming Soon Modal */}
      <CourseComingSoonModal
        course={comingSoonCourse}
        isOpen={Boolean(comingSoonCourse)}
        onClose={() => setComingSoonCourse(null)}
        onSelectActiveCourse={(id) => onNavigate('course-detail', { courseId: id })}
        lang={lang}
      />

      {/* Store Coming Soon Modal */}
      <StoreComingSoonModal
        isOpen={isStoreComingSoonOpen}
        onClose={() => setIsStoreComingSoonOpen(false)}
        onNavigateCourses={() => onNavigate('courses')}
        lang={lang}
      />
    </div>
  );
}

