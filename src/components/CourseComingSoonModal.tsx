import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Bell, CheckCircle2, ArrowRight, ShieldCheck, Clock, Music } from 'lucide-react';
import { Course, Language } from '../types';
import { Button, Input } from './InteractiveComponents';
import { getLocalizedCourse } from '../data/translations';

interface CourseComingSoonModalProps {
  course: Course | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectActiveCourse?: (courseId: 'begena' | 'krar') => void;
  lang?: Language;
}

export const CourseComingSoonModal: React.FC<CourseComingSoonModalProps> = ({
  course,
  isOpen,
  onClose,
  onSelectActiveCourse,
  lang = 'en'
}) => {
  const [contactInfo, setContactInfo] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen || !course) return null;

  const locCourse = getLocalizedCourse(course, lang);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactInfo.trim()) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 600);
  };

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
                {lang === 'am' ? 'በቅርቡ ይጠብቁን' : 'COMING SOON'}
              </span>
              <span className="text-[10px] text-gray-500 font-semibold flex items-center gap-1">
                <Clock size={11} /> {lang === 'am' ? 'በቅርቡ ይጀመራል' : 'Launching Soon'}
              </span>
            </div>

            {/* Course Card Preview Banner */}
            <div className="flex flex-col sm:flex-row items-center gap-4 bg-[#FAF6EF] border border-[#E7DED1] p-4 rounded-2xl relative overflow-hidden">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-white border border-[#C79A2B]/40 shrink-0 shadow-xs flex items-center justify-center p-1.5">
                <img
                  src={course.image}
                  alt={locCourse.name}
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="space-y-1.5 min-w-0 text-center sm:text-left">
                <h3 className="font-display font-black text-xl text-[#2B2B2B] leading-tight">
                  {locCourse.name}
                </h3>
                <p className="text-xs text-[#666666] line-clamp-2 leading-relaxed">
                  {locCourse.shortDescription}
                </p>
                <div className="flex items-center justify-center sm:justify-start gap-2 text-[10px] text-[#6F4E37] font-semibold pt-1">
                  <span className="bg-white px-2 py-0.5 rounded border border-[#E7DED1]">
                    {locCourse.difficulty}
                  </span>
                  <span>•</span>
                  <span>{locCourse.duration} {lang === 'am' ? 'የስልጠና ቆይታ' : 'Expected'}</span>
                </div>
              </div>
            </div>

            {/* Description note */}
            <div className="space-y-2 text-xs sm:text-sm text-gray-600 leading-relaxed bg-amber-50/60 border border-amber-200/70 p-4 rounded-xl">
              <div className="flex items-center gap-2 font-bold text-amber-900 text-xs uppercase tracking-wide">
                <ShieldCheck size={16} className="text-amber-700 shrink-0" />
                {lang === 'am' ? 'የስርዓተ ትምህርት ዝግጅትና ማረጋገጫ በሂደት ላይ ነው' : 'Preservation & Syllabus Accreditation in Progress'}
              </div>
              <p className="text-xs text-[#4A4A4A] leading-relaxed">
                {lang === 'am'
                  ? `የ${locCourse.name} ባለ ብዙ ደረጃ ሥርዓተ ትምህርት፣ የዜማ ምልክቶች እና የማስተማሪያ ቪዲዮዎች በአሁኑ ወቅት በመምህራኖቻችን እየተዘጋጁና እየተረጋገጡ ይገኛሉ።`
                  : `The structured multi-level curriculum, notation typesetting, and instructional videos for ${course.name} are currently being finalized and certified by our master instructors.`}
              </p>
            </div>

            {/* Priority Waitlist Form */}
            <div className="bg-white border border-[#E7DED1] p-4 sm:p-5 rounded-2xl space-y-3 shadow-2xs">
              <div className="flex items-center gap-2">
                <Bell size={16} className="text-[#E89B52]" />
                <h4 className="text-xs sm:text-sm font-bold text-[#2B2B2B]">
                  {lang === 'am' ? 'ትምህርቱ ሲጀመር ቀድመው እንዲያውቁ ይመዝገቡ' : 'Join Priority Waitlist for Early Access'}
                </h4>
              </div>
              <p className="text-[11px] text-gray-500">
                {lang === 'am'
                  ? 'ምዝገባው ሲጀመር የመጀመሪያ ማሳወቂያ እና ልዩ ቅናሽ ለማግኘት ስልክዎን ወይም ኢሜይልዎን ያስገቡ።'
                  : 'Be the first to receive notifications, special launch discounts, and enrollment schedules when registrations open.'}
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
                      ? 'እናመሰግናለን! በመጠባበቂያ ዝርዝር ውስጥ ተመዝግበዋል። ትምህርቱ ሲከፈት ወዲያውኑ እናሳውቆታለን።'
                      : 'Thank you! You are now on the priority waitlist. We will notify you first.'}
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

            {/* Alternative: Active Courses */}
            {onSelectActiveCourse && (
              <div className="pt-2 border-t border-[#E7DED1] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <span className="text-gray-500 font-medium text-[11px]">
                  {lang === 'am' ? 'በአሁኑ ሰዓት የሚሰጡ ትምህርቶችን ይጀምሩ:' : 'Start learning right now:'}
                </span>
                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => {
                      onClose();
                      onSelectActiveCourse('begena');
                    }}
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FAF6EF] hover:bg-[#F2E8D9] border border-[#C79A2B]/40 text-[#2B2B2B] font-bold text-xs transition-colors cursor-pointer"
                  >
                    <Music size={13} className="text-[#C79A2B]" />
                    {lang === 'am' ? 'በገና ስልጠና' : 'በገና (Begena)'}
                    <ArrowRight size={12} className="text-gray-400" />
                  </button>

                  <button
                    onClick={() => {
                      onClose();
                      onSelectActiveCourse('krar');
                    }}
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FAF6EF] hover:bg-[#F2E8D9] border border-[#C79A2B]/40 text-[#2B2B2B] font-bold text-xs transition-colors cursor-pointer"
                  >
                    <Music size={13} className="text-[#E89B52]" />
                    {lang === 'am' ? 'ክራር ስልጠና' : 'ክራር (Krar)'}
                    <ArrowRight size={12} className="text-gray-400" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
