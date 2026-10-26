import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Bell, CheckCircle2, ArrowRight, ShieldCheck, Clock, ShoppingBag, Music, Tag } from 'lucide-react';
import { Language } from '../types';
import { Button, Input } from './InteractiveComponents';

interface StoreComingSoonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateCourses?: () => void;
  lang?: Language;
}

export const StoreComingSoonModal: React.FC<StoreComingSoonModalProps> = ({
  isOpen,
  onClose,
  onNavigateCourses,
  lang = 'en'
}) => {
  const [contactInfo, setContactInfo] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactInfo.trim()) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 600);
  };

  const previewItems = lang === 'am' ? [
    { title: 'በቅርቡ ይጠብቁን', desc: 'በእጅ የተቀረጸ ጥንታዊ የመንፈሳዊ ዜማ መሣሪያ', tag: 'በቅርቡ' },
    { title: 'በቅርቡ ይጠብቁን', desc: 'ጥራት ካለው የተመረጠ እንጨትና ቆዳ የተሰራ', tag: 'በቅርቡ' },
    { title: 'በቅርቡ ይጠብቁን', desc: 'እውነተኛ የተፈጥሮ አውታሮችና መለዋወጫዎች', tag: 'በቅርቡ' }
  ] : [
    { title: 'Coming Soon', desc: 'Masterfully hand-carved sacred acoustic instrument', tag: 'Soon' },
    { title: 'Coming Soon', desc: 'Traditional soundhead with authentic resonance', tag: 'Soon' },
    { title: 'Coming Soon', desc: 'Handcrafted artisan accessories and string sets', tag: 'Soon' }
  ];

  return (
    <AnimatePresence>
      <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto ${lang === 'am' ? 'font-benaiah font-amharic' : ''}`}>
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 16 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-xl bg-white border border-[#E7DED1] rounded-3xl shadow-2xl overflow-hidden z-10 text-left my-8"
        >
          {/* Header Accent Bar */}
          <div className="h-2 w-full bg-gradient-to-r from-[#C79A2B] via-[#E89B52] to-[#6F4E37]" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-colors cursor-pointer z-20"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>

          <div className="p-6 sm:p-8 space-y-6">
            {/* Top Pill */}
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-amber-100 text-amber-800 border border-amber-300">
                <Sparkles size={12} className="text-amber-600 animate-spin" style={{ animationDuration: '4s' }} />
                {lang === 'am' ? 'ሱቁ በቅርቡ ይከፈታል' : 'STORE COMING SOON'}
              </span>
              <span className="text-[10px] text-gray-500 font-semibold flex items-center gap-1">
                <Clock size={11} /> {lang === 'am' ? 'የእደ-ጥበብ ዝግጅት በሂደት ላይ' : 'Handcrafting in Progress'}
              </span>
            </div>

            {/* Store Preview Banner */}
            <div className="flex flex-col sm:flex-row items-center gap-4 bg-[#FAF6EF] border border-[#E7DED1] p-5 rounded-2xl relative overflow-hidden">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-[#6F4E37] to-[#2B2B2B] text-amber-300 flex items-center justify-center shrink-0 shadow-md">
                <ShoppingBag size={38} className="text-amber-300" />
              </div>

              <div className="space-y-1.5 min-w-0 text-center sm:text-left">
                <h3 className="font-display font-black text-xl text-[#2B2B2B] leading-tight">
                  {lang === 'am' ? 'የሊዮራ በገና ኦፊሴላዊ መሣሪያዎች ሱቅ' : 'Liora Begena Official Sacred Store'}
                </h3>
                <p className="text-xs text-[#666666] leading-relaxed">
                  {lang === 'am'
                    ? 'በሊቃውንት የተመረጡና ጥንታዊውን ውበት የጠበቁ በእጅ የተሰሩ የበገናና የክራር መሣሪያዎች እንዲሁም መለዋወጫዎች በቅርቡ ይቀርባሉ።'
                    : 'Master-certified, hand-carved traditional Begenas, Krars, authentic accessories, and gut strings will be available for purchase.'}
                </p>
              </div>
            </div>

            {/* Upcoming Products Preview Grid */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">
                {lang === 'am' ? 'በቅርቡ የሚቀርቡ ምርቶች' : 'Upcoming Handcrafted Items'}
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {previewItems.map((item, idx) => (
                  <div key={idx} className="bg-white border border-[#E7DED1] rounded-xl p-3 space-y-1 shadow-3xs">
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] font-extrabold uppercase bg-amber-50 text-amber-800 border border-amber-200 px-1.5 py-0.5 rounded">
                        {item.tag}
                      </span>
                      <Tag size={11} className="text-amber-600" />
                    </div>
                    <p className="text-xs font-bold text-[#2B2B2B] pt-0.5">{item.title}</p>
                    <p className="text-[10px] text-gray-500 line-clamp-2">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quality & Craftsmanship Guarantee */}
            <div className="space-y-2 text-xs sm:text-sm text-gray-600 leading-relaxed bg-amber-50/60 border border-amber-200/70 p-4 rounded-xl">
              <div className="flex items-center gap-2 font-bold text-amber-900 text-xs uppercase tracking-wide">
                <ShieldCheck size={16} className="text-amber-700 shrink-0" />
                {lang === 'am' ? 'የጥራት እና የዕደ-ጥበብ ዋስትና' : 'Sacred Heritage & Artisan Quality Assurance'}
              </div>
              <p className="text-xs text-[#4A4A4A] leading-relaxed">
                {lang === 'am'
                  ? 'እያንዳንዱ መሣሪያ በባለሙያዎች የተመረጠ ጥራት ያለው እንጨትና ቆዳ ተጠቅሞ በዲያቆን ብሩክ ተስፋዬ ክትትልና ማረጋገጫ የሚዘጋጅ ነው።'
                  : 'Every instrument is seasoned naturally, built to canonical Orthodox proportions, and personally inspected and tuned by Deacon Bruk Tesfaye before delivery.'}
              </p>
            </div>

            {/* Early Access Notification Form */}
            <div className="bg-white border border-[#E7DED1] p-4 sm:p-5 rounded-2xl space-y-3 shadow-2xs">
              <div className="flex items-center gap-2">
                <Bell size={16} className="text-[#E89B52]" />
                <h4 className="text-xs sm:text-sm font-bold text-[#2B2B2B]">
                  {lang === 'am' ? 'ሱቁ ሲከፈት የመጀመሪያ ማሳወቂያ እና ልዩ ቅናሽ ያግኙ' : 'Get VIP Early Access & Launch Discount'}
                </h4>
              </div>
              <p className="text-[11px] text-gray-500">
                {lang === 'am'
                  ? 'የመሣሪያዎች ሽያጭ ሲጀመር ቀድመው እንዲደርስዎት ስልክዎን ወይም ኢሜይልዎን ያስገቡ።'
                  : 'Enter your phone or email to receive launch alert, reservation slots, and priority delivery discounts.'}
              </p>

              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2.5 p-3.5 bg-green-50 border border-green-200 rounded-xl text-green-800 text-xs font-medium"
                >
                  <CheckCircle2 size={18} className="text-green-600 shrink-0" />
                  <span>
                    {lang === 'am'
                      ? 'እናመሰግናለን! በመጠባበቂያ ዝርዝር ውስጥ ተመዝግበዋል። ሱቁ እንደተከፈተ ወዲያውኑ እናሳውቆታለን።'
                      : 'Thank you! You are registered on the VIP store waitlist. We will notify you upon launch.'}
                  </span>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
                  <Input
                    placeholder={lang === 'am' ? 'ኢሜይል ወይም ስልክ ቁጥርዎን ያስገቡ...' : 'Enter your email or phone number...'}
                    value={contactInfo}
                    onChange={(e) => setContactInfo(e.target.value)}
                    className="flex-1 text-xs"
                    required
                  />
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={isLoading || !contactInfo.trim()}
                    className="whitespace-nowrap text-xs font-bold uppercase py-2 px-4 shadow-sm"
                  >
                    {isLoading
                      ? (lang === 'am' ? 'በመመዝገብ ላይ...' : 'Joining...')
                      : (lang === 'am' ? 'አሳውቁኝ' : 'Notify Me')}
                  </Button>
                </form>
              )}
            </div>

            {/* Navigation Action */}
            <div className="pt-2 border-t border-[#E7DED1] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <span className="text-gray-500 font-medium text-[11px]">
                {lang === 'am' ? 'በአሁኑ ሰዓት የሚሰጡ ትምህርቶችን መማር ይችላሉ:' : 'You can start learning right now:'}
              </span>
              <div className="flex gap-2 w-full sm:w-auto">
                {onNavigateCourses ? (
                  <button
                    onClick={() => {
                      onClose();
                      onNavigateCourses();
                    }}
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FAF6EF] hover:bg-[#F2E8D9] border border-[#C79A2B]/40 text-[#2B2B2B] font-bold text-xs transition-colors cursor-pointer"
                  >
                    <Music size={13} className="text-[#C79A2B]" />
                    {lang === 'am' ? 'ትምህርቶችን ይመልከቱ' : 'Explore Courses'}
                    <ArrowRight size={12} className="text-gray-400" />
                  </button>
                ) : (
                  <button
                    onClick={onClose}
                    className="px-4 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold cursor-pointer"
                  >
                    {lang === 'am' ? 'ይዝጉ' : 'Close'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
