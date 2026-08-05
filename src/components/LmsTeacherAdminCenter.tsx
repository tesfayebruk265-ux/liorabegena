import React, { useState, useEffect } from 'react';
import {
  Sliders,
  CheckCircle,
  AlertTriangle,
  Award,
  BookOpen,
  Plus,
  Trash,
  Edit,
  UserCheck,
  Video,
  Mic,
  FileText,
  Sparkles,
  QrCode,
  ShieldCheck,
  Send,
  MessageSquare,
  BarChart2,
  Lock,
  Unlock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Language, PracticeSessionRecord, DigitalCertificateRecord } from '../types';
import { TiletPattern } from './TiletPattern';
import { Button, Input } from './InteractiveComponents';

interface LmsTeacherAdminCenterProps {
  lang: Language;
  onNavigate: (page: string, params?: any) => void;
  initialSubTab?: 'review' | 'curriculum' | 'at-risk' | 'certificates';
}

const SAMPLE_PENDING_REVIEWS: PracticeSessionRecord[] = [];

const SAMPLE_AT_RISK_STUDENTS: any[] = [];

export function LmsTeacherAdminCenter({
  lang,
  onNavigate,
  initialSubTab = 'review'
}: LmsTeacherAdminCenterProps) {
  const [activeTab, setActiveTab] = useState<'review' | 'curriculum' | 'at-risk' | 'certificates'>(initialSubTab);

  // REVIEW & RUBRIC GRADING STATE
  const [reviewsList, setReviewsList] = useState<PracticeSessionRecord[]>(SAMPLE_PENDING_REVIEWS);
  const [selectedReview, setSelectedReview] = useState<PracticeSessionRecord | null>(SAMPLE_PENDING_REVIEWS[0]);
  const [commentText, setCommentText] = useState('');
  const [rubricTechnique, setRubricTechnique] = useState(90);
  const [rubricRhythm, setRubricRhythm] = useState(85);
  const [rubricAccuracy, setRubricAccuracy] = useState(88);
  const [rubricTone, setRubricTone] = useState(92);
  const [gradingSubmitted, setGradingSubmitted] = useState(false);

  // CURRICULUM FLEXIBILITY BUILDER STATE
  const [selectedInstrument, setSelectedInstrument] = useState('Krar');
  const [moduleTitle, setModuleTitle] = useState('');
  const [moduleDescription, setModuleDescription] = useState('');
  
  // Lesson Creation State
  const [newLessonTitle, setNewLessonTitle] = useState('');
  const [newLessonVideoUrl, setNewLessonVideoUrl] = useState('');
  const [newLessonExplanation, setNewLessonExplanation] = useState('');
  const [newLessonNotation, setNewLessonNotation] = useState('');
  const [selectedModuleIdForLesson, setSelectedModuleIdForLesson] = useState<string | null>(null);

  const [curriculumModules, setCurriculumModules] = useState<any[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('krar_modules_v1');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        } catch (e) {}
      }
    }
    return [
      { id: 'm1', title: 'ምዕራፍ አንድ፡ የክራር ክፍሎች አሰራራቸው እና ምሳሌነታቸው', description: 'የክራር አካል ክፍሎች እና የክራር አያያዝ', lessons: 2, isPublished: true },
      { id: 'm3', title: 'ምዕራፍ ሶስት፡ ዜማ እና የክራር ቅኝቶች', description: 'የቤተክርስቲያናችን ዜማ፣ ቅዱስ ያሬድ እና የድምጾች ሳይንሳዊ አጠራር', lessons: 3, isPublished: true },
      { id: 'm4', title: 'ምዕራፍ አራት፡ ቅኝቶች እና ተግባራዊ ልምምዳቸው', description: 'የ ቅኝት አመሰራረት እና የጣት ማፍታታት ልምምዶች', lessons: 2, isPublished: true },
      { id: 'm5', title: 'ምዕራፍ አምስት፡ ትዝታ ቅኝት (ዋኔን)', description: 'የዋኔን/ትዝታ ቅኝት አመሰራረት እና የትዝታ ቅኝት መዝሙሮች', lessons: 8, isPublished: true },
      { id: 'm6', title: 'ምዕራፍ ስድስት፡ ቸርነት ቅኝት (አንቺሆዬ)', description: 'የቸርነት/አንቺሆዬ ቅኝት አመሰራረት እና የቸርነት ቅኝት መዝሙሮች', lessons: 8, isPublished: true },
      { id: 'm7', title: 'ምዕራፍ ሰባት፡ ባቲ ቅኝት', description: 'የባቲ ቅኝት አመሰራረት እና የባቲ ቅኝት መዝሙሮች', lessons: 8, isPublished: true },
      { id: 'm8', title: 'ምዕራፍ ስምንት፡ አምባሰል ቅኝት', description: 'የአምባሰል ቅኝት አመሰራረት እና የአምባሰል ቅኝት መዝሙሮች', lessons: 8, isPublished: true }
    ];
  });

  const [krarPublishedLessons, setKrarPublishedLessons] = useState<any[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('krar_lessons_v1');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        } catch (e) {}
      }
    }
    return [
      { id: 'l1_1', moduleId: 'm1', title: 'የክራር አካል ክፍሎች (Anatomy of Krar)', durationText: '15 mins', videoUrl: 'https://www.youtube.com/embed/2GpKxNl_KW0', explanation: 'በዚህ ትምህርት የክራር አካል ክፍሎችን እና መንፈሳዊ ምሳሌነታቸውን እንማራለን።', notationSequence: '1 - 2 - 3 - 4 - 5 - 6', isPublished: true },
      { id: 'l1_2', moduleId: 'm1', title: 'የክራር አያያዝ (Proper Krar Holding Posture)', durationText: '12 mins', videoUrl: 'https://www.youtube.com/embed/2GpKxNl_KW0', explanation: 'የክራር ትክክለኛ አያያዝ፣ የሰውነት እና የእጅ አቀማመጥ።', isPublished: true },
      { id: 'l3_1', moduleId: 'm3', title: 'የቤተክርስቲያናችን ዜማ', durationText: '18 mins', videoUrl: 'https://www.youtube.com/embed/2GpKxNl_KW0', explanation: 'የቤተክርስቲያናችን መንፈሳዊ የዜማ ስልቶች።', isPublished: true },
      { id: 'l3_2', moduleId: 'm3', title: 'ቅዱስ ያሬድ', durationText: '20 mins', videoUrl: 'https://www.youtube.com/embed/2GpKxNl_KW0', explanation: 'የቅዱስ ያሬድ ታሪክ እና የዜማ ምልክቶች።', isPublished: true },
      { id: 'l3_3', moduleId: 'm3', title: 'የ ድምጾች ሳይንሳዊ አጠራር', durationText: '15 mins', videoUrl: 'https://www.youtube.com/embed/2GpKxNl_KW0', explanation: 'የድምጾች ሳይንሳዊ አጠራር እና ፍሪኩዌንሲ።', isPublished: true },
      { id: 'l4_1', moduleId: 'm4', title: 'የ ቅኝት አመሰራረት', durationText: '16 mins', videoUrl: 'https://www.youtube.com/embed/2GpKxNl_KW0', explanation: 'የኢትዮጵያ ባህላዊ አምስቱ ቅኝቶች አመሰራረት።', isPublished: true },
      { id: 'l4_2', moduleId: 'm4', title: 'ጣት ማፍታታት', durationText: '25 mins', videoUrl: 'https://www.youtube.com/embed/2GpKxNl_KW0', explanation: 'የጣት ማፍታቻ ልምምዶች እና የጣት ቅልጥፍና ማሳደጊያ።', notationSequence: '1-3-2-4-3-5-4-6', isPublished: true },
      { id: 'l5_1', moduleId: 'm5', title: 'ዋኔን/ትዝታ - ቅኝት አመሰራረት', durationText: '15 mins', videoUrl: 'https://www.youtube.com/embed/2GpKxNl_KW0', explanation: 'የትዝታ (ዋኔን) ቅኝት አቃኘት።', notationSequence: '1 - 2 - 3 - 5 - 6 - 1', isPublished: true },
      { id: 'l5_2', moduleId: 'm5', title: 'መዝሙር፡ ማርያም ፊደል', durationText: '15 mins', videoUrl: 'https://www.youtube.com/embed/2GpKxNl_KW0', explanation: 'በትዝታ ቅኝት የሚቀነቀነው "ማርያም ፊደል" መዝሙር።', isPublished: true },
      { id: 'l5_3', moduleId: 'm5', title: 'መዝሙር፡ ሰላም ለ ኢትዮጲያ', durationText: '14 mins', videoUrl: 'https://www.youtube.com/embed/2GpKxNl_KW0', explanation: 'በትዝታ ቅኝት "ሰላም ለኢትዮጵያ" መዝሙር።', isPublished: true },
      { id: 'l5_4', moduleId: 'm5', title: 'መዝሙር፡ እግዚአብሔር ይመስገን', durationText: '16 mins', videoUrl: 'https://www.youtube.com/embed/2GpKxNl_KW0', explanation: 'በትዝታ ቅኝት "እግዚአብሔር ይመስገን" መዝሙር።', isPublished: true },
      { id: 'l5_5', moduleId: 'm5', title: 'መዝሙር፡ የፍቅር እናት', durationText: '15 mins', videoUrl: 'https://www.youtube.com/embed/2GpKxNl_KW0', explanation: 'በትዝታ ቅኝት "የፍቅር እናት" መዝሙር።', isPublished: true },
      { id: 'l5_6', moduleId: 'm5', title: 'መዝሙር፡ እንደቸርነትህ', durationText: '15 mins', videoUrl: 'https://www.youtube.com/embed/2GpKxNl_KW0', explanation: 'በትዝታ ቅኝት "እንደቸርነትህ" መዝሙር።', isPublished: true },
      { id: 'l5_7', moduleId: 'm5', title: 'መዝሙር፡ እውነተኛው ሰላም', durationText: '15 mins', videoUrl: 'https://www.youtube.com/embed/2GpKxNl_KW0', explanation: 'በትዝታ ቅኝት "እውነተኛው ሰላም" መዝሙር።', isPublished: true },
      { id: 'l5_8', moduleId: 'm5', title: 'መዝሙር፡ የልቤን ሁሉ', durationText: '15 mins', videoUrl: 'https://www.youtube.com/embed/2GpKxNl_KW0', explanation: 'በትዝታ ቅኝት "የልቤን ሁሉ" መዝሙር።', isPublished: true },
      { id: 'l6_1', moduleId: 'm6', title: 'ቸርነት/አንቺሆዬ - ቅኝት አመሰራረት', durationText: '15 mins', videoUrl: 'https://www.youtube.com/embed/2GpKxNl_KW0', explanation: 'የቸርነት (አንቺሆዬ) ቅኝት አቃኘት።', isPublished: true },
      { id: 'l6_2', moduleId: 'm6', title: 'መዝሙር፡ በቃና ዘገሊላ', durationText: '15 mins', videoUrl: 'https://www.youtube.com/embed/2GpKxNl_KW0', explanation: 'በቸርነት ቅኝት "በቃና ዘገሊላ" መዝሙር።', isPublished: true },
      { id: 'l6_3', moduleId: 'm6', title: 'መዝሙር፡ እዩና እመኑ ሰዎች', durationText: '15 mins', videoUrl: 'https://www.youtube.com/embed/2GpKxNl_KW0', explanation: 'በቸርነት ቅኝት "እዩና እመኑ ሰዎች" መዝሙር።', isPublished: true },
      { id: 'l6_4', moduleId: 'm6', title: 'መዝሙር፡ አማን በ አማን', durationText: '15 mins', videoUrl: 'https://www.youtube.com/embed/2GpKxNl_KW0', explanation: 'በቸርነት ቅኝት "አማን በ አማን" መዝሙር።', isPublished: true },
      { id: 'l6_5', moduleId: 'm6', title: 'መዝሙር፡ ሃይሌ ብርታቴ', durationText: '15 mins', videoUrl: 'https://www.youtube.com/embed/2GpKxNl_KW0', explanation: 'በቸርነት ቅኝት "ሃይሌ ብርታቴ" መዝሙር።', isPublished: true },
      { id: 'l6_6', moduleId: 'm6', title: 'መዝሙር፡ ስምህ በሁሉ', durationText: '15 mins', videoUrl: 'https://www.youtube.com/embed/2GpKxNl_KW0', explanation: 'በቸርነት ቅኝት "ስምህ በሁሉ" መዝሙር።', isPublished: true },
      { id: 'l6_7', moduleId: 'm6', title: 'መዝሙር፡ በጎ መአዛ', durationText: '15 mins', videoUrl: 'https://www.youtube.com/embed/2GpKxNl_KW0', explanation: 'በቸርነት ቅኝት "በጎ መአዛ" መዝሙር።', isPublished: true },
      { id: 'l6_8', moduleId: 'm6', title: 'መዝሙር፡ ለምጠራኝ ላንተ', durationText: '15 mins', videoUrl: 'https://www.youtube.com/embed/2GpKxNl_KW0', explanation: 'በቸርነት ቅኝት "ለምጠራኝ ላንተ" መዝሙር።', isPublished: true },
      { id: 'l7_1', moduleId: 'm7', title: 'ባቲ - ቅኝት አመሰራረት', durationText: '15 mins', videoUrl: 'https://www.youtube.com/embed/2GpKxNl_KW0', explanation: 'የባቲ ቅኝት አቃኘት።', isPublished: true },
      { id: 'l7_2', moduleId: 'm7', title: 'መዝሙር፡ በመኑ', durationText: '15 mins', videoUrl: 'https://www.youtube.com/embed/2GpKxNl_KW0', explanation: 'በባቲ ቅኝት "በመኑ" መዝሙር።', isPublished: true },
      { id: 'l7_3', moduleId: 'm7', title: 'መዝሙር፡ የሥላሴን መንበር', durationText: '15 mins', videoUrl: 'https://www.youtube.com/embed/2GpKxNl_KW0', explanation: 'በባቲ ቅኝት "የሥላሴን መንበር" መዝሙር።', isPublished: true },
      { id: 'l7_4', moduleId: 'm7', title: 'መዝሙር፡ ስምሽን ስጠራው', durationText: '15 mins', videoUrl: 'https://www.youtube.com/embed/2GpKxNl_KW0', explanation: 'በባቲ ቅኝት "ስምሽን ስጠራው" መዝሙር።', isPublished: true },
      { id: 'l7_5', moduleId: 'm7', title: 'መዝሙር፡ ገብርኤል በሰማይ', durationText: '15 mins', videoUrl: 'https://www.youtube.com/embed/2GpKxNl_KW0', explanation: 'በባቲ ቅኝት "ገብርኤል በሰማይ" መዝሙር።', isPublished: true },
      { id: 'l7_6', moduleId: 'm7', title: 'መዝሙር፡ አለ ለኔ', durationText: '15 mins', videoUrl: 'https://www.youtube.com/embed/2GpKxNl_KW0', explanation: 'በባቲ ቅኝት "አለ ለኔ" መዝሙር።', isPublished: true },
      { id: 'l7_7', moduleId: 'm7', title: 'መዝሙር፡ ምስጋና በመቅደስህ', durationText: '15 mins', videoUrl: 'https://www.youtube.com/embed/2GpKxNl_KW0', explanation: 'በባቲ ቅኝት "ምስጋና በመቅደስህ" መዝሙር።', isPublished: true },
      { id: 'l7_8', moduleId: 'm7', title: 'መዝሙር፡ እውነት ስለሆነ', durationText: '15 mins', videoUrl: 'https://www.youtube.com/embed/2GpKxNl_KW0', explanation: 'በባቲ ቅኝት "እውነት ስለሆነ" መዝሙር።', isPublished: true },
      { id: 'l8_1', moduleId: 'm8', title: 'አምባሰል - ቅኝት አመሰራረት', durationText: '15 mins', videoUrl: 'https://www.youtube.com/embed/2GpKxNl_KW0', explanation: 'የአምባሰል ቅኝት አቃኘት።', isPublished: true },
      { id: 'l8_2', moduleId: 'm8', title: 'መዝሙር፡ እንተ በምድር', durationText: '15 mins', videoUrl: 'https://www.youtube.com/embed/2GpKxNl_KW0', explanation: 'በአምባሰል ቅኝት "እንተ በምድር" መዝሙር።', isPublished: true },
      { id: 'l8_3', moduleId: 'm8', title: 'መዝሙር፡ ድንግል እናቴ ነይ', durationText: '15 mins', videoUrl: 'https://www.youtube.com/embed/2GpKxNl_KW0', explanation: 'በአምባሰል ቅኝት "ድንግል እናቴ ነይ" መዝሙር።', isPublished: true },
      { id: 'l8_4', moduleId: 'm8', title: 'መዝሙር፡ ምስጋናዬን', durationText: '15 mins', videoUrl: 'https://www.youtube.com/embed/2GpKxNl_KW0', explanation: 'በአምባሰል ቅኝት "ምስጋናዬን" መዝሙር።', isPublished: true },
      { id: 'l8_5', moduleId: 'm8', title: 'ሞገድ ሲመታኝ', durationText: '15 mins', videoUrl: 'https://www.youtube.com/embed/2GpKxNl_KW0', explanation: 'በአምባሰል ቅኝት "ሞገድ ሲመታኝ" መዝሙር።', isPublished: true },
      { id: 'l8_6', moduleId: 'm8', title: 'መዝሙር፡ ኦ ሚካኤል', durationText: '15 mins', videoUrl: 'https://www.youtube.com/embed/2GpKxNl_KW0', explanation: 'በአምባሰል ቅኝት "ኦ ሚካኤል" መዝሙር።', isPublished: true },
      { id: 'l8_7', moduleId: 'm8', title: 'መዝሙር፡ ቸርነትህ ነው', durationText: '15 mins', videoUrl: 'https://www.youtube.com/embed/2GpKxNl_KW0', explanation: 'በአምባሰል ቅኝት "ቸርነትህ ነው" መዝሙር።', isPublished: true },
      { id: 'l8_8', moduleId: 'm8', title: 'መዝሙር፡ አንቺን የያዝ ሰው', durationText: '15 mins', videoUrl: 'https://www.youtube.com/embed/2GpKxNl_KW0', explanation: 'በአምባሰil ቅኝት "አንቺን የያዝ ሰው" መዝሙር።', isPublished: true }
    ];
  });

  // Save to localStorage whenever updated
  useEffect(() => {
    if (selectedInstrument === 'Krar' && typeof window !== 'undefined') {
      localStorage.setItem('krar_modules_v1', JSON.stringify(curriculumModules));
    }
  }, [curriculumModules, selectedInstrument]);

  useEffect(() => {
    if (selectedInstrument === 'Krar' && typeof window !== 'undefined') {
      localStorage.setItem('krar_lessons_v1', JSON.stringify(krarPublishedLessons));
    }
  }, [krarPublishedLessons, selectedInstrument]);

  const handleAddModule = () => {
    if (!moduleTitle) return;
    const newMod = {
      id: `mod-${Date.now()}`,
      title: moduleTitle,
      description: moduleDescription || 'Krar curriculum module',
      lessons: 0,
      isPublished: true,
      order: curriculumModules.length + 1
    };
    setCurriculumModules([...curriculumModules, newMod]);
    setModuleTitle('');
    setModuleDescription('');
  };

  const handleAddLessonToModule = (modId: string) => {
    if (!newLessonTitle) return;
    const newLes = {
      id: `les-krar-${Date.now()}`,
      moduleId: modId,
      title: newLessonTitle,
      durationText: '15 mins',
      videoUrl: newLessonVideoUrl || 'https://www.youtube.com/embed/2GpKxNl_KW0',
      explanation: newLessonExplanation || 'Krar instructional lesson.',
      notationSequence: newLessonNotation || '1 2 3 4 5 3 2 1',
      isPublished: true,
      order: krarPublishedLessons.length + 1
    };

    const updatedLessons = [...krarPublishedLessons, newLes];
    setKrarPublishedLessons(updatedLessons);

    // Update lesson count on module
    setCurriculumModules((prev) =>
      prev.map((m) => (m.id === modId ? { ...m, lessons: (m.lessons || 0) + 1 } : m))
    );

    setNewLessonTitle('');
    setNewLessonVideoUrl('');
    setNewLessonExplanation('');
    setNewLessonNotation('');
    setSelectedModuleIdForLesson(null);
    alert('Krar lesson published successfully! Students can now view it in their Krar portal.');
  };

  // DIGITAL CERTIFICATE GENERATOR STATE
  const [certStudentName, setCertStudentName] = useState('Yonas Tadesse');
  const [certCourseName, setCertCourseName] = useState('Begena Master Level 1');
  const [certCode, setCertCode] = useState('CERT-BEGENA-2026-8849');
  const [certGenerated, setCertGenerated] = useState(false);

  const handleGradeReview = () => {
    if (!selectedReview) return;
    const avgScore = Math.round((rubricTechnique + rubricRhythm + rubricAccuracy + rubricTone) / 4);
    
    setReviewsList((prev) =>
      prev.map((r) =>
        r.id === selectedReview.id
          ? {
              ...r,
              feedbackStatus: 'Reviewed',
              teacherFeedback: {
                score: avgScore,
                comment: commentText || 'Great progress demonstrated in this recording!',
                rubricScores: {
                  technique: rubricTechnique,
                  rhythm: rubricRhythm,
                  accuracy: rubricAccuracy,
                  tone: rubricTone
                },
                date: new Date().toISOString().substring(0, 10)
              }
            }
          : r
      )
    );
    setGradingSubmitted(true);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* HEADER BANNER */}
      <div className="bg-[#2B2B2B] text-white p-6 sm:p-8 rounded-3xl relative overflow-hidden shadow-xl border border-amber-950/40">
        <TiletPattern className="opacity-15 text-[#E89B52] scale-125" />
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E89B52]/20 border border-[#E89B52]/40 text-[#E89B52] text-xs font-bold uppercase tracking-widest">
            <Sliders size={14} />
            <span>Instructor & Academic Administration Studio</span>
          </div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-white tracking-wide">
            TEACHER LMS MANAGEMENT & CURRICULUM CONTROL
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 max-w-2xl leading-relaxed">
            Evaluate student practice recordings with rubrics, customize course curricula across all traditional instruments, support at-risk learners, and issue official certificates.
          </p>
        </div>
      </div>

      {/* NAVIGATION TABS */}
      <div className="flex border-b border-[#E7DED1] gap-2 overflow-x-auto pb-px">
        {[
          { id: 'review', label: '🎙️ Practice Recording Reviews' },
          { id: 'curriculum', label: '📚 Curriculum Builder' },
          { id: 'at-risk', label: '⚠️ Student Support & At-Risk' },
          { id: 'certificates', label: '📜 Digital Certificate Issuance' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === tab.id
                ? 'border-[#E89B52] text-[#2B2B2B] bg-[#FAF6EF]'
                : 'border-transparent text-gray-400 hover:text-[#2B2B2B]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB CONTENT */}
      <AnimatePresence mode="wait">
        {/* TAB 1: PRACTICE RECORDING REVIEWS */}
        {activeTab === 'review' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-3">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
                Pending Submissions ({reviewsList.filter((r) => r.feedbackStatus === 'Submitted').length})
              </span>

              <div className="space-y-3">
                {reviewsList.map((rec) => (
                  <div
                    key={rec.id}
                    onClick={() => { setSelectedReview(rec); setGradingSubmitted(false); }}
                    className={`p-4 rounded-2xl border transition cursor-pointer ${
                      selectedReview?.id === rec.id
                        ? 'bg-[#FAF6EF] border-[#E89B52] shadow-sm'
                        : 'bg-white border-[#E7DED1]'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-xs text-[#2B2B2B]">{rec.studentName}</span>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                          rec.feedbackStatus === 'Reviewed' ? 'bg-green-100 text-green-900' : 'bg-amber-100 text-amber-900'
                        }`}>
                          {rec.feedbackStatus}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500">{rec.instrument} • {rec.lessonTitle}</p>
                      <p className="text-[10px] text-gray-400">{rec.createdAt}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* REVIEW & RUBRIC GRADING CONSOLE */}
            <div className="lg:col-span-2 space-y-6">
              {selectedReview ? (
                <div className="bg-white border border-[#E7DED1] p-6 sm:p-8 rounded-3xl space-y-6 shadow-xs">
                  <div className="border-b border-[#E7DED1] pb-4 space-y-1">
                    <span className="text-xs font-bold text-[#E89B52] uppercase block">
                      Student: {selectedReview.studentName}
                    </span>
                    <h2 className="font-display font-black text-2xl text-[#2B2B2B]">{selectedReview.lessonTitle}</h2>
                    <p className="text-xs text-gray-500">Goal: {selectedReview.practiceGoal}</p>
                  </div>

                  {/* MEDIA PLAYER */}
                  <div className="bg-[#2B2B2B] p-4 rounded-2xl text-white space-y-2">
                    <span className="text-[10px] font-bold text-amber-400 uppercase block">Submitted Recording</span>
                    {selectedReview.recordingType === 'video' ? (
                      selectedReview.recordingUrl ? <video controls src={selectedReview.recordingUrl} className="w-full rounded-xl bg-black max-h-52" /> : null
                    ) : (
                      selectedReview.recordingUrl ? <audio controls src={selectedReview.recordingUrl} className="w-full" /> : null
                    )}
                  </div>

                  {/* RUBRIC SLIDERS */}
                  <div className="space-y-4 pt-2">
                    <h3 className="font-bold text-xs uppercase text-[#2B2B2B] tracking-wider">Evaluation Rubric Scores</h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div className="space-y-1">
                        <div className="flex justify-between font-bold">
                          <span>Technique & Posture</span>
                          <span className="text-[#E89B52]">{rubricTechnique}%</span>
                        </div>
                        <input
                          type="range" min="50" max="100"
                          value={rubricTechnique}
                          onChange={(e) => setRubricTechnique(Number(e.target.value))}
                          className="w-full accent-[#E89B52]"
                        />
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between font-bold">
                          <span>Rhythm & Timing</span>
                          <span className="text-[#E89B52]">{rubricRhythm}%</span>
                        </div>
                        <input
                          type="range" min="50" max="100"
                          value={rubricRhythm}
                          onChange={(e) => setRubricRhythm(Number(e.target.value))}
                          className="w-full accent-[#E89B52]"
                        />
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between font-bold">
                          <span>Pitch & Accuracy</span>
                          <span className="text-[#E89B52]">{rubricAccuracy}%</span>
                        </div>
                        <input
                          type="range" min="50" max="100"
                          value={rubricAccuracy}
                          onChange={(e) => setRubricAccuracy(Number(e.target.value))}
                          className="w-full accent-[#E89B52]"
                        />
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between font-bold">
                          <span>Tone & Resonance</span>
                          <span className="text-[#E89B52]">{rubricTone}%</span>
                        </div>
                        <input
                          type="range" min="50" max="100"
                          value={rubricTone}
                          onChange={(e) => setRubricTone(Number(e.target.value))}
                          className="w-full accent-[#E89B52]"
                        />
                      </div>
                    </div>

                    <div className="space-y-1 pt-2">
                      <label className="text-[10px] font-bold text-gray-500 uppercase">Teacher Comment / Guidance</label>
                      <textarea
                        rows={3}
                        className="w-full p-3 bg-[#FAF6EF] border border-[#E7DED1] rounded-xl text-xs outline-none"
                        placeholder="Write constructive guidance, finger adjustment notes, or praise..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                      />
                    </div>

                    {!gradingSubmitted ? (
                      <Button variant="primary" size="md" className="w-full" onClick={handleGradeReview}>
                        Submit Evaluation & Send Feedback Notification
                      </Button>
                    ) : (
                      <div className="p-3 bg-green-100 text-green-900 rounded-xl text-xs font-bold text-center">
                        ✓ Feedback Successfully Sent to {selectedReview.studentName}!
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-12 text-center text-gray-400 bg-white border border-[#E7DED1] rounded-3xl">
                  Select a student practice submission to evaluate.
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* TAB 2: CURRICULUM BUILDER */}
        {activeTab === 'curriculum' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
            <div className="bg-white border border-[#E7DED1] p-6 sm:p-8 rounded-3xl space-y-6 shadow-xs">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <span className="text-xs font-bold text-[#E89B52] uppercase tracking-widest block">Flexible Course Architecture</span>
                  <h2 className="font-display font-black text-2xl text-[#2B2B2B] uppercase">Custom Curriculum & Modules</h2>
                </div>

                <div className="flex gap-2">
                  {(['Begena', 'Krar', 'Masenqo', 'Washint', 'Vocal', 'Kebero'] as const).map((inst) => (
                    <button
                      key={inst}
                      onClick={() => setSelectedInstrument(inst)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border cursor-pointer ${
                        selectedInstrument === inst
                          ? 'bg-[#E89B52] text-white border-[#E89B52]'
                          : 'bg-[#FAF6EF] text-gray-700 border-[#E7DED1]'
                      }`}
                    >
                      {inst}
                    </button>
                  ))}
                </div>
              </div>

              {/* MODULE LIST */}
              <div className="space-y-4">
                {curriculumModules.map((mod, idx) => {
                  const modLessons = krarPublishedLessons.filter((l) => l.moduleId === mod.id);
                  const isAddingLesson = selectedModuleIdForLesson === mod.id;

                  return (
                    <div key={mod.id} className="p-5 bg-[#FAF6EF] border border-[#E7DED1] rounded-2xl space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <span className="font-bold text-sm text-[#2B2B2B]">{mod.title}</span>
                          <p className="text-xs text-gray-500">{modLessons.length} Lessons Published for {selectedInstrument}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => setSelectedModuleIdForLesson(isAddingLesson ? null : mod.id)}
                            className="text-xs font-bold bg-[#E89B52] text-white hover:bg-amber-600 border-none cursor-pointer"
                          >
                            {isAddingLesson ? 'Cancel' : '+ Add Lesson'}
                          </Button>
                        </div>
                      </div>

                      {/* PUBLISHED LESSONS LIST */}
                      {modLessons.length > 0 && (
                        <div className="pl-4 space-y-1.5 border-l-2 border-[#E89B52]">
                          {modLessons.map((l, lIdx) => (
                            <div key={l.id} className="p-2.5 bg-white border border-gray-200 rounded-xl text-xs flex justify-between items-center">
                              <div>
                                <span className="font-bold text-gray-900">{lIdx + 1}. {l.title}</span>
                                <span className="text-[10px] text-gray-400 block">{l.durationText} • Video URL attached</span>
                              </div>
                              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">Published</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* ADD LESSON FORM */}
                      {isAddingLesson && (
                        <div className="p-4 bg-white border border-amber-300 rounded-xl space-y-3 text-xs">
                          <h4 className="font-bold text-[#E89B52]">Publish New {selectedInstrument} Lesson</h4>
                          <div className="space-y-2">
                            <div>
                              <label className="font-bold text-gray-700 block mb-1">Lesson Title</label>
                              <Input
                                value={newLessonTitle}
                                onChange={(e) => setNewLessonTitle(e.target.value)}
                                placeholder="e.g. Lesson 1 — Krar Pentatonic Scale & Finger Placement"
                              />
                            </div>
                            <div>
                              <label className="font-bold text-gray-700 block mb-1">Video Embed / YouTube URL</label>
                              <Input
                                value={newLessonVideoUrl}
                                onChange={(e) => setNewLessonVideoUrl(e.target.value)}
                                placeholder="https://www.youtube.com/embed/2GpKxNl_KW0"
                              />
                            </div>
                            <div>
                              <label className="font-bold text-gray-700 block mb-1">Written Explanation / Instructions</label>
                              <textarea
                                value={newLessonExplanation}
                                onChange={(e) => setNewLessonExplanation(e.target.value)}
                                rows={2}
                                className="w-full p-2 border border-gray-300 rounded-xl text-xs"
                                placeholder="Detailed instructional explanation for the student..."
                              />
                            </div>
                            <div>
                              <label className="font-bold text-gray-700 block mb-1">Notation Sequence (optional)</label>
                              <Input
                                value={newLessonNotation}
                                onChange={(e) => setNewLessonNotation(e.target.value)}
                                placeholder="e.g. 1 2 3 4 5  3 2 1"
                              />
                            </div>
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => handleAddLessonToModule(mod.id)}
                              className="bg-[#E89B52] text-white font-bold text-xs py-2 px-4 cursor-pointer"
                            >
                              Publish Lesson to Krar Student Portal
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* CREATE NEW MODULE FORM */}
              <div className="p-6 bg-amber-50/50 border border-amber-200 rounded-2xl space-y-4">
                <h3 className="font-bold text-xs uppercase text-amber-900">Add New Module to {selectedInstrument} Curriculum</h3>
                <div className="space-y-3 text-xs">
                  <div className="space-y-1">
                    <label className="font-bold text-gray-600">Module Title</label>
                    <Input
                      value={moduleTitle}
                      onChange={(e) => setModuleTitle(e.target.value)}
                      placeholder="e.g. Module 5 — Advanced Church Melodies"
                    />
                  </div>
                  <Button variant="primary" size="sm" onClick={handleAddModule}>
                    + Add Module
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 3: AT-RISK STUDENTS */}
        {activeTab === 'at-risk' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
            <div className="bg-white border border-[#E7DED1] p-6 sm:p-8 rounded-3xl space-y-6 shadow-xs">
              <div>
                <span className="text-xs font-bold text-red-600 uppercase tracking-widest block">Proactive Student Support</span>
                <h2 className="font-display font-black text-2xl text-[#2B2B2B] uppercase">At-Risk Learners Indicator</h2>
              </div>

              <div className="space-y-4">
                {SAMPLE_AT_RISK_STUDENTS.map((std) => (
                  <div key={std.id} className="p-5 bg-red-50/60 border border-red-200 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="space-y-1">
                      <span className="font-bold text-sm text-red-950">{std.name}</span>
                      <p className="text-xs text-red-800 font-semibold">{std.course} • {std.branch}</p>
                      <p className="text-xs text-red-600"><b>Issue:</b> {std.issue}</p>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="secondary" size="sm" className="text-xs" onClick={() => alert(`Sent encouragement message to ${std.name}`)}>
                        ✉️ Send Encouragement
                      </Button>
                      <Button variant="secondary" size="sm" className="text-xs" onClick={() => alert(`Makeup class scheduled for ${std.name}`)}>
                        📅 Schedule Makeup
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 4: DIGITAL CERTIFICATES */}
        {activeTab === 'certificates' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
            <div className="bg-white border border-[#E7DED1] p-6 sm:p-8 rounded-3xl space-y-6 shadow-xs">
              <div>
                <span className="text-xs font-bold text-[#E89B52] uppercase tracking-widest block">Official Graduation Credentials</span>
                <h2 className="font-display font-black text-2xl text-[#2B2B2B] uppercase">Issue Digital Certificate</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-gray-600">Student Name</label>
                  <Input value={certStudentName} onChange={(e) => setCertStudentName(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-gray-600">Course / Level Title</label>
                  <Input value={certCourseName} onChange={(e) => setCertCourseName(e.target.value)} />
                </div>
              </div>

              <Button variant="primary" size="md" className="w-full" onClick={() => setCertGenerated(true)}>
                Generate Digital Certificate with QR Code
              </Button>

              {/* CERTIFICATE PREVIEW CARD */}
              {certGenerated && (
                <div className="p-8 bg-[#2B2B2B] text-white rounded-3xl border-2 border-[#E89B52] shadow-2xl space-y-6 relative overflow-hidden text-center">
                  <TiletPattern className="opacity-20 text-[#E89B52] scale-150" />
                  <div className="relative z-10 space-y-4">
                    <span className="text-xs font-mono tracking-widest text-[#E89B52] uppercase block">
                      ABEL BEGENA SCHOOL • ETHIOPIA
                    </span>
                    <h3 className="font-display font-black text-2xl sm:text-3xl tracking-wide text-amber-200">
                      CERTIFICATE OF COMPLETION
                    </h3>
                    <p className="text-xs text-gray-300">This is to certify that</p>
                    <div className="font-display font-black text-2xl text-white underline decoration-[#E89B52]">
                      {certStudentName.toUpperCase()}
                    </div>
                    <p className="text-xs text-gray-300 max-w-md mx-auto">
                      has successfully satisfied all academic requirements, practical performance assessments, and practice hours for
                    </p>
                    <div className="font-bold text-sm text-amber-400">{certCourseName}</div>

                    <div className="pt-6 border-t border-white/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
                      <div>
                        <span>Authorized Signatory: <b>Teacher Abel Begena</b></span>
                      </div>
                      <div className="flex items-center gap-2 bg-white/10 p-2 rounded-xl border border-white/10">
                        <QrCode size={28} className="text-amber-400" />
                        <div className="text-[10px] text-left">
                          <span className="block font-mono font-bold text-white">{certCode}</span>
                          <span>Verified on Abel Begena Registry</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

