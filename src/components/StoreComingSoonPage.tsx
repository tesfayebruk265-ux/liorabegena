import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  ShoppingBag,
  Sparkles,
  Clock,
  ShieldCheck,
  Bell,
  CheckCircle2,
  ArrowRight,
  Music,
  ChevronLeft,
  Tag,
  Hammer,
  Truck,
  Sparkle
} from 'lucide-react';
import { PageId, Language } from '../types';
import { Button, Input } from './InteractiveComponents';

interface StoreComingSoonPageProps {
  lang: Language;
  onNavigate: (page: PageId, params?: any) => void;
}

export function StoreComingSoonPage({ lang, onNavigate }: StoreComingSoonPageProps) {
  const [contactInfo, setContactInfo] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactInfo.trim()) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 600);
  };

  const categories = lang === 'am' ? [
    {
      title: 'በቅርቡ ይጠብቁን',
      desc: 'ከወይራና ዋንዛ እንጨት በሊቃውንት በእጅ የተቀረጸ፣ 10 አውታሮች ያሉት ጥንታዊ የበገና መሣሪያ።',
      tag: 'በቅርቡ',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-300'
    },
    {
      title: 'በቅርቡ ይጠብቁን',
      desc: 'የተመረጠ የበግ ቆዳ፣ ጠንካራ የእንጨት ማዕቀፍና ከፍተኛ ጥራት ያለው የድምፅ አውታር የተገጠመለት።',
      tag: 'በቅርቡ',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-300'
    },
    {
      title: 'በቅርቡ ይጠብቁን',
      desc: 'የተስተካከለ የድምፅ ቀዳዳዎች ያሉት የደጋ ቀርከሃ ዋሽንትና በፈረስ ጭራ የተወጠረ ነጠላ ባለአውታር ማሲንቆ።',
      tag: 'በቅርቡ',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300'
    },
    {
      title: 'በቅርቡ ይጠብቁን',
      desc: '100% ተፈጥሯዊ የፍየል አንጀት አውታሮች፣ ብርኩማ፣ የእንጨት ቁልፎችና የክብር መሸፈኛ ከረጢቶች።',
      tag: 'በቅርቡ',
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-300'
    }
  ] : [
    {
      title: 'Coming Soon',
      desc: 'Masterfully hand-carved from aged olive and cordia wood with canonical 10 organic gut strings.',
      tag: 'Coming Soon',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-300'
    },
    {
      title: 'Coming Soon',
      desc: 'Curated sheepskin soundheads, durable mahogany/rosewood frames, and precision tuning pegs.',
      tag: 'Coming Soon',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-300'
    },
    {
      title: 'Coming Soon',
      desc: 'Calibrated four-hole bamboo flutes and single-string horsehair bowed lutes by veteran artisans.',
      tag: 'Coming Soon',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300'
    },
    {
      title: 'Coming Soon',
      desc: 'Authentic organic gut string sets, birkuma bridges, tuning keys, and protective velvet cases.',
      tag: 'Coming Soon',
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-300'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`max-w-5xl mx-auto space-y-10 py-6 text-left ${lang === 'am' ? 'font-benaiah font-amharic' : ''}`}
    >
      {/* Back button */}
      <div>
        <button
          onClick={() => onNavigate('home')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-[#6F4E37] transition-colors cursor-pointer"
        >
          <ChevronLeft size={16} />
          <span>{lang === 'am' ? 'ወደ ዋና ገጽ ይመለሱ' : 'Back to Home'}</span>
        </button>
      </div>

      {/* Main Hero Card */}
      <div className="relative bg-gradient-to-br from-[#FFFDF8] via-[#FAF6EF] to-white border-2 border-[#E7DED1] rounded-3xl p-6 sm:p-12 shadow-sm overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 opacity-5 pointer-events-none bg-dot-pattern" />

        <div className="max-w-2xl space-y-5 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs">
            <Sparkles size={13} className="text-amber-600 animate-spin" style={{ animationDuration: '4s' }} />
            <span>{lang === 'am' ? 'ሱቁ በቅርቡ ይከፈታል' : 'STORE LAUNCHING SOON'}</span>
          </div>

          <h1 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-[#2B2B2B] tracking-tight leading-tight">
            {lang === 'am' ? 'የሊዮራ በገና ኦፊሴላዊ መሣሪያዎች ሱቅ' : 'Liora Begena Official Instrument Store'}
          </h1>

          <p className="text-sm sm:text-base text-[#666666] leading-relaxed">
            {lang === 'am'
              ? 'በሊቃውንት የተመረጡ ጥንታዊውን የመንፈሳዊ ዜማ ቅርስ የጠበቁ በእጅ የተሰሩ የበገና፣ የክራር፣ የዋሽንትና የማሲንቆ መሣሪያዎች እንዲሁም እውነተኛ የበገና አውታሮች በቅርቡ ለሽያጭ ይቀርባሉ።'
              : 'Our master craftspeople are preparing hand-carved Begenas, authentic bowl-lyre Krars, highland bamboo Washints, genuine gut strings, and liturgical hymnbooks for global shipping and on-site pickup.'}
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <Button
              variant="primary"
              size="lg"
              onClick={() => onNavigate('courses')}
              rightIcon={<ArrowRight size={16} />}
            >
              {lang === 'am' ? 'የሚሰጡ ትምህርቶችን ይመልከቱ' : 'Explore Active Courses'}
            </Button>
            <Button
              variant="secondary"
              size="lg"
              className="bg-white border-[#E7DED1]"
              onClick={() => onNavigate('contact')}
            >
              {lang === 'am' ? 'ያግኙን' : 'Contact Workshop'}
            </Button>
          </div>
        </div>
      </div>

      {/* Artisan Values Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-[#E7DED1] rounded-2xl p-5 space-y-2 shadow-3xs">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#6F4E37] flex items-center justify-center">
            <Hammer size={20} />
          </div>
          <h3 className="font-bold text-sm text-[#2B2B2B]">
            {lang === 'am' ? 'በእጅ የተሰሩ ትክክለኛ መሣሪያዎች' : '100% Handcrafted by Artisans'}
          </h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            {lang === 'am'
              ? 'እያንዳንዱ መሣሪያ በጥንቃቄ በተመረጡ የተፈጥሮ እንጨቶችና ቆዳዎች የሚሰራ ነው።'
              : 'Built to traditional specifications using seasoned wood and authentic sheepskin soundheads.'}
          </p>
        </div>

        <div className="bg-white border border-[#E7DED1] rounded-2xl p-5 space-y-2 shadow-3xs">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#6F4E37] flex items-center justify-center">
            <ShieldCheck size={20} />
          </div>
          <h3 className="font-bold text-sm text-[#2B2B2B]">
            {lang === 'am' ? 'የሊቃውንት ማረጋገጫ' : 'Master Tuned & Certified'}
          </h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            {lang === 'am'
              ? 'መሣሪያዎቹ ከመረከባቸው በፊት በዲያቆን ብሩክ ተስፋዬ ተፈትሸው ቅኝታቸው ይረጋገጣል።'
              : 'Every finished instrument is personally inspected and pitch-calibrated by Deacon Bruk Tesfaye.'}
          </p>
        </div>

        <div className="bg-white border border-[#E7DED1] rounded-2xl p-5 space-y-2 shadow-3xs">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#6F4E37] flex items-center justify-center">
            <Truck size={20} />
          </div>
          <h3 className="font-bold text-sm text-[#2B2B2B]">
            {lang === 'am' ? 'በአገር ውስጥና በውጭ አገር ማድረስ' : 'Domestic & Diaspora Delivery'}
          </h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            {lang === 'am'
              ? 'በአዲስ አበባ ቅርንጫፎቻችን መረከብ ወይም በዓለም አቀፍ ፈጣን መልዕክት መላክ ይቻላል።'
              : 'Secure worldwide shipping for diaspora students, plus on-site campus pickups in Addis Ababa.'}
          </p>
        </div>
      </div>

      {/* Upcoming Product Categories Grid */}
      <div className="space-y-4">
        <div className="space-y-1">
          <h2 className="font-display font-black text-2xl text-[#2B2B2B]">
            {lang === 'am' ? 'የሊዮራ መሣሪያዎች ሱቅ' : 'Liora Begena Sacred Store'}
          </h2>
          <p className="text-xs text-gray-500">
            {lang === 'am'
              ? 'የእደ-ጥበብ መሣሪያዎችና መለዋወጫዎች በቅርቡ ይቀርባሉ'
              : 'Handcrafted sacred instruments and accessories launching soon'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {categories.map((cat, idx) => (
            <div
              key={idx}
              className="bg-white border border-[#E7DED1] rounded-2xl p-5 space-y-3 shadow-3xs hover:border-[#6F4E37]/50 transition-all flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded border ${cat.badgeColor}`}>
                    {cat.tag}
                  </span>
                  <Tag size={13} className="text-gray-400" />
                </div>
                <h3 className="font-bold text-base text-[#2B2B2B]">{cat.title}</h3>
                <p className="text-xs text-[#666666] leading-relaxed">{cat.desc}</p>
              </div>

              <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-[#6F4E37] font-bold">
                <span>{lang === 'am' ? 'በቅርቡ ለሽያጭ ይቀርባል' : 'Available on Launch'}</span>
                <Clock size={12} className="text-amber-600" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* VIP Priority Notification Waitlist */}
      <div className="bg-[#FAF6EF] border-2 border-[#E7DED1] rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm text-center max-w-2xl mx-auto">
        <div className="w-12 h-12 rounded-full bg-white text-[#E89B52] border border-[#E7DED1] flex items-center justify-center mx-auto shadow-2xs">
          <Bell size={22} />
        </div>

        <div className="space-y-1.5">
          <h3 className="font-display font-black text-xl text-[#2B2B2B]">
            {lang === 'am' ? 'ሱቁ ሲከፈት ቀድመው እንዲያውቁ ይመዝገቡ' : 'Join the VIP Store Waitlist'}
          </h3>
          <p className="text-xs text-[#666666] max-w-md mx-auto leading-relaxed">
            {lang === 'am'
              ? 'የመሣሪያዎች ሽያጭ ሲጀመር የመጀመሪያ ማሳወቂያ እና ልዩ የ10% የመክፈቻ ቅናሽ ለማግኘት ስልክዎን ወይም ኢሜይልዎን ያስገቡ።'
              : 'Be the first to know when handcrafted Begenas and strings become available, plus receive an exclusive 10% launch discount voucher.'}
          </p>
        </div>

        {isSubmitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center gap-2.5 p-4 bg-green-50 border border-green-200 rounded-xl text-green-800 text-xs font-bold max-w-md mx-auto"
          >
            <CheckCircle2 size={18} className="text-green-600 shrink-0" />
            <span>
              {lang === 'am'
                ? 'እናመሰግናለን! በመጠባበቂያ ዝርዝር ውስጥ ተመዝግበዋል። ሱቁ ሲከፈት ወዲያውኑ እናሳውቆታለን።'
                : 'Thank you! You are now registered on the VIP store waitlist.'}
            </span>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2.5 max-w-md mx-auto pt-2">
            <Input
              placeholder={lang === 'am' ? 'ኢሜይል ወይም ስልክ ቁጥርዎን ያስገቡ...' : 'Enter your email or phone number...'}
              value={contactInfo}
              onChange={(e) => setContactInfo(e.target.value)}
              className="flex-1 text-xs bg-white"
              required
            />
            <Button
              type="submit"
              variant="primary"
              disabled={isLoading || !contactInfo.trim()}
              className="whitespace-nowrap text-xs font-bold uppercase py-2 px-5 shadow-sm"
            >
              {isLoading
                ? (lang === 'am' ? 'በመመዝገብ ላይ...' : 'Joining...')
                : (lang === 'am' ? 'አሳውቁኝ' : 'Notify Me')}
            </Button>
          </form>
        )}
      </div>

      {/* Alternative prompt */}
      <div className="bg-white border border-[#E7DED1] rounded-2xl p-6 text-center space-y-3">
        <p className="text-xs text-gray-500 font-medium">
          {lang === 'am'
            ? 'መሣሪያ ከማዘዝዎ በፊት የትምህርት ምዝገባ መጀመር ይፈልጋሉ?'
            : 'Looking to enroll in live courses before ordering your instrument?'}
        </p>
        <div className="flex justify-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onNavigate('courses')}
            className="gap-2 text-xs"
          >
            <Music size={14} className="text-[#C79A2B]" />
            <span>{lang === 'am' ? 'የበገናና ክራር ትምህርቶች' : 'Begena & Krar Courses'}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate('home')}
            className="text-xs"
          >
            {lang === 'am' ? 'ወደ ዋና ገጽ' : 'Return Home'}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
