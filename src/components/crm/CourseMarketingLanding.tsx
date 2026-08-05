import React, { useState } from 'react';
import {
  BookOpen,
  Check,
  HelpCircle,
  Calendar,
  Clock,
  DollarSign,
  Award,
  ChevronRight,
  Sparkles,
  MessageSquare,
  UserCheck,
  Send
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Course, Language, PageId } from '../../types';
import { COURSES_DATA } from '../../data/websiteData';

interface CourseMarketingLandingProps {
  lang: Language;
  onNavigate: (page: PageId, params?: any) => void;
  onOpenInquiryModal: (courseName: string) => void;
  onBookTrial: (courseName: string) => void;
}

export function CourseMarketingLanding({
  lang,
  onNavigate,
  onOpenInquiryModal,
  onBookTrial
}: CourseMarketingLandingProps) {
  const [selectedCourse, setSelectedCourse] = useState<Course>(COURSES_DATA[0]);
  const [isCompareView, setIsCompareView] = useState(false);

  return (
    <div className="space-y-8 text-left">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#FFFDF8] via-[#FAF6EF] to-white border border-[#E7DED1] p-6 sm:p-8 rounded-2xl shadow-2xs">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#E7DED1] text-xs font-bold text-[#E89B52]">
            <BookOpen size={14} />
            <span>Traditional Ethiopian Music Curriculum</span>
          </div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-[#2B2B2B]">
            Abel Begena Course Offerings & Comparison
          </h1>
          <p className="text-xs text-[#666666] max-w-2xl leading-relaxed">
            Explore authentic 10-string Begena, Krar, Masenqo, Washint, and Vocal courses. Compare levels, schedules, pricing, and register online or at any branch.
          </p>
        </div>

        <button
          onClick={() => setIsCompareView(!isCompareView)}
          className="px-4 py-2.5 bg-white border-2 border-[#E89B52] text-[#E89B52] font-bold text-xs rounded-xl shadow-2xs hover:bg-[#FAF6EF] cursor-pointer"
        >
          {isCompareView ? 'View Single Course Detail' : 'Compare All Courses Side-by-Side'}
        </button>
      </div>

      {/* COURSE SELECTOR BUTTONS */}
      {!isCompareView && (
        <div className="flex flex-wrap items-center gap-2">
          {COURSES_DATA.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCourse(c)}
              className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                selectedCourse.id === c.id
                  ? 'bg-[#E89B52] text-white border-[#E89B52] shadow-2xs'
                  : 'bg-white text-[#666666] border-[#E7DED1] hover:bg-[#FAF6EF]'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      )}

      {/* SINGLE COURSE LANDING PAGE VIEW */}
      {!isCompareView && selectedCourse && (
        <div className="bg-white border border-[#E7DED1] rounded-2xl p-6 sm:p-8 shadow-xs space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-[#E89B52]/10 text-[#E89B52]">
                {selectedCourse.difficulty || selectedCourse.level} Level
              </span>
              <h2 className="font-display font-black text-3xl text-[#2B2B2B]">{selectedCourse.name}</h2>
              <p className="text-xs text-[#666666] leading-relaxed">{selectedCourse.description}</p>

              {/* Learning Outcomes */}
              <div className="space-y-2 pt-2">
                <h4 className="font-display font-bold text-sm text-[#2B2B2B]">Core Learning Outcomes</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {(selectedCourse.learningOutcomes || [
                    'Independent tuning and scale mastery',
                    'Traditional finger plucking techniques',
                    'Sacred hymn vocal accompaniment',
                    'Live performance and recital certification'
                  ]).map((out, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <Check size={14} className="text-[#10B981] shrink-0 mt-0.5" />
                      <span className="text-[#2B2B2B]">{out}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing Transparency */}
              <div className="p-4 bg-[#FAF6EF] border border-[#E7DED1] rounded-xl space-y-2 text-xs">
                <h4 className="font-display font-bold text-xs uppercase text-[#666666]">Transparent Fee Structure</h4>
                <div className="flex flex-wrap gap-4 font-bold text-[#2B2B2B]">
                  {(selectedCourse.pricing || [{ duration: '1 Month Tuition', price: 1500 }]).map((p, idx) => (
                    <div key={idx} className="bg-white px-3 py-1.5 rounded-lg border border-[#E7DED1]">
                      <span className="text-[#666666] font-normal">{p.duration}:</span>{' '}
                      <span className="text-[#E89B52]">{p.price.toLocaleString()} ETB</span>
                    </div>
                  ))}
                  <div className="bg-white px-3 py-1.5 rounded-lg border border-[#E7DED1]">
                    <span className="text-[#666666] font-normal">One-time Registration Fee:</span>{' '}
                    <span className="text-[#2B2B2B]">{selectedCourse.registrationFee || 300} ETB</span>
                  </div>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => onNavigate('stepped-register', { courseId: selectedCourse.id })}
                  className="px-6 py-3 bg-[#E89B52] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-2xs hover:bg-[#d68a41] cursor-pointer flex items-center gap-2"
                >
                  <span>Enroll in Course</span>
                  <ChevronRight size={14} />
                </button>

                <button
                  onClick={() => onOpenInquiryModal(selectedCourse.name)}
                  className="px-4 py-3 bg-white border border-[#E7DED1] text-[#2B2B2B] font-bold text-xs rounded-xl hover:bg-[#FAF6EF] cursor-pointer flex items-center gap-1.5"
                >
                  <MessageSquare size={14} className="text-[#E89B52]" />
                  <span>Ask a Question</span>
                </button>

                <button
                  onClick={() => onBookTrial(selectedCourse.name)}
                  className="px-4 py-3 bg-[#6F4E37] text-white font-bold text-xs rounded-xl hover:bg-[#5a3f2c] cursor-pointer flex items-center gap-1.5"
                >
                  <UserCheck size={14} />
                  <span>Book Free Trial Session</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-2xl overflow-hidden border border-[#E7DED1] shadow-xs">
                <img
                  src={selectedCourse.image}
                  alt={selectedCourse.name}
                  className="w-full h-72 object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* COMPARISON VIEW */}
      {isCompareView && (
        <div className="overflow-x-auto bg-white border border-[#E7DED1] rounded-2xl shadow-xs">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-[#FAF6EF] border-b border-[#E7DED1]">
                <th className="p-4 font-display font-bold text-[#2B2B2B]">Course Feature</th>
                {COURSES_DATA.map((c) => (
                  <th key={c.id} className="p-4 font-display font-bold text-[#2B2B2B] min-w-[200px]">
                    {c.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7DED1]">
              <tr>
                <td className="p-4 font-bold text-[#666666] bg-[#FAF6EF]/50">Difficulty / Level</td>
                {COURSES_DATA.map((c) => (
                  <td key={c.id} className="p-4">{c.difficulty || c.level}</td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-bold text-[#666666] bg-[#FAF6EF]/50">Learning Mode</td>
                {COURSES_DATA.map((c) => (
                  <td key={c.id} className="p-4">{c.learningMode.join(', ')}</td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-bold text-[#666666] bg-[#FAF6EF]/50">Monthly Tuition Fee</td>
                {COURSES_DATA.map((c) => (
                  <td key={c.id} className="p-4 font-bold text-[#E89B52]">
                    {(c.pricing?.[0]?.price || 1500).toLocaleString()} ETB / mo
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-bold text-[#666666] bg-[#FAF6EF]/50">Registration Fee</td>
                {COURSES_DATA.map((c) => (
                  <td key={c.id} className="p-4">{c.registrationFee || 300} ETB</td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-bold text-[#666666] bg-[#FAF6EF]/50">Action</td>
                {COURSES_DATA.map((c) => (
                  <td key={c.id} className="p-4">
                    <button
                      onClick={() => onNavigate('stepped-register', { courseId: c.id })}
                      className="px-3 py-1.5 bg-[#E89B52] text-white text-[10px] font-bold uppercase rounded-lg hover:bg-[#d68a41] cursor-pointer"
                    >
                      Enroll Now
                    </button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

