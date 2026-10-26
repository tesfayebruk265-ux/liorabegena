import React, { useState } from 'react';
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  Clock,
  Award,
  BookOpen,
  Sparkles,
  ChevronRight,
  RotateCcw,
  Check,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Language, LmsQuiz, LmsQuizQuestion } from '../types';
import { useAuth, isStudentAccessGranted } from '../context/AuthContext';
import { TiletPattern } from './TiletPattern';
import { Button, Input } from './InteractiveComponents';
import { RegistrationAndPaymentGate } from './RegistrationAndPaymentGate';

interface QuizAndAssessmentCenterProps {
  lang: Language;
  onNavigate: (page: string, params?: any) => void;
}

const SAMPLE_BEGENA_QUIZ: LmsQuiz = {
  id: 'qz-101',
  title: 'Begena Fundamentals & History Assessment',
  courseId: 'c1',
  passingScore: 75,
  timeLimitMinutes: 10,
  maxAttempts: 3,
  questions: [
    {
      id: 'q1',
      questionText: 'How many strings does a traditional Ethiopian Begena have?',
      type: 'multiple_choice',
      options: ['5 Strings', '6 Strings', '10 Strings', '12 Strings'],
      correctAnswer: '10 Strings',
      explanation: 'The Begena traditionally has 10 strings made of gut, tuned in specific pentatonic ratios.'
    },
    {
      id: 'q2',
      questionText: 'What is the function of the leather pieces (Kerbe) placed near the bridge of the Begena?',
      type: 'multiple_choice',
      options: [
        'To hold the strings tight',
        'To create the iconic buzzing harmonic resonance (Bzz)',
        'To change the key automatically',
        'To protect the wood from scratches'
      ],
      correctAnswer: 'To create the iconic buzzing harmonic resonance (Bzz)',
      explanation: 'The leather buzzing pieces create the characteristic spiritual buzzing sound unique to the Begena.'
    },
    {
      id: 'q3',
      questionText: 'True or False: Begena is played primarily during sacred liturgical periods and prayer.',
      type: 'true_false',
      options: ['True', 'False'],
      correctAnswer: 'True',
      explanation: 'Begena is a spiritual instrument used for prayer, meditation, and liturgical reflection.'
    },
    {
      id: 'q4',
      questionText: 'Which biblical king is historically associated with the Begena in Ethiopian tradition?',
      type: 'multiple_choice',
      options: ['King Solomon', 'King David (Dawit)', 'King Ezana', 'King Lalibela'],
      correctAnswer: 'King David (Dawit)',
      explanation: 'Ethiopian tradition associates the Begena with King David\'s harp.'
    }
  ]
};

export function QuizAndAssessmentCenter({ lang, onNavigate }: QuizAndAssessmentCenterProps) {
  const { currentUser } = useAuth();
  const [activeQuiz, setActiveQuiz] = useState<LmsQuiz | null>(SAMPLE_BEGENA_QUIZ);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [scorePercentage, setScorePercentage] = useState<number>(0);
  const [attemptsUsed, setAttemptsUsed] = useState<number>(1);

  if (!isStudentAccessGranted(currentUser)) {
    return <RegistrationAndPaymentGate lang={lang} onNavigate={onNavigate} title="QUIZZES & THEORY LOCKED" />;
  }

  // Placement Request Modal State
  const [showPlacementModal, setShowPlacementModal] = useState<boolean>(false);
  const [placementInstrument, setPlacementInstrument] = useState<string>('Begena');
  const [yearsExperience, setYearsExperience] = useState<string>('2-3 Years');
  const [placementSubmitted, setPlacementSubmitted] = useState<boolean>(false);

  const handleSelectOption = (questionId: string, option: string) => {
    if (quizSubmitted) return;
    setUserAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const handleSubmitQuiz = () => {
    if (!activeQuiz) return;
    let correctCount = 0;
    activeQuiz.questions.forEach((q) => {
      if (userAnswers[q.id] === q.correctAnswer) {
        correctCount += 1;
      }
    });

    const score = Math.round((correctCount / activeQuiz.questions.length) * 100);
    setScorePercentage(score);
    setQuizSubmitted(true);
  };

  const handleRetakeQuiz = () => {
    setUserAnswers({});
    setQuizSubmitted(false);
    setScorePercentage(0);
    setAttemptsUsed((prev) => prev + 1);
  };

  const handleSubmitPlacementRequest = () => {
    setPlacementSubmitted(true);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* HEADER BANNER */}
      <div className="bg-[#2B2B2B] text-white p-6 sm:p-8 rounded-3xl relative overflow-hidden shadow-xl border border-amber-950/40">
        <TiletPattern className="opacity-15 text-[#E89B52] scale-125" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E89B52]/20 border border-[#E89B52]/40 text-[#E89B52] text-xs font-bold uppercase tracking-widest">
              <HelpCircle size={14} />
              <span>Interactive Music Theory & Quiz Module</span>
            </div>
            <h1 className="font-display font-black text-2xl sm:text-3xl text-white tracking-wide">
              KNOWLEDGE ASSESSMENTS & PLACEMENT
            </h1>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              Validate your music theory understanding, history knowledge, and instrument tuning fundamentals.
            </p>
          </div>

          <Button
            variant="primary"
            size="md"
            className="whitespace-nowrap shadow-md"
            onClick={() => setShowPlacementModal(true)}
          >
            📋 Request Level Placement Exam
          </Button>
        </div>
      </div>

      {/* QUIZ PLAYER AREA */}
      {activeQuiz && (
        <div className="bg-white border border-[#E7DED1] p-6 sm:p-8 rounded-3xl space-y-6 shadow-xs">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#E7DED1] pb-6">
            <div>
              <span className="text-xs font-bold text-[#E89B52] uppercase tracking-widest block">
                Quiz Attempt {attemptsUsed} / {activeQuiz.maxAttempts}
              </span>
              <h2 className="font-display font-black text-2xl text-[#2B2B2B] uppercase">{activeQuiz.title}</h2>
            </div>

            <div className="flex items-center gap-2 bg-[#FAF6EF] px-3 py-1.5 rounded-xl border border-[#E7DED1] text-xs font-bold text-gray-700">
              <Clock size={16} className="text-[#E89B52]" />
              <span>Time Limit: {activeQuiz.timeLimitMinutes} Mins</span>
            </div>
          </div>

          {/* QUESTIONS LIST */}
          <div className="space-y-6">
            {activeQuiz.questions.map((q, idx) => {
              const selectedOption = userAnswers[q.id];
              const isCorrect = selectedOption === q.correctAnswer;

              return (
                <div key={q.id} className="p-5 bg-[#FAF6EF]/80 border border-[#E7DED1] rounded-2xl space-y-3">
                  <h3 className="font-bold text-sm text-[#2B2B2B] flex items-start gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#E89B52] text-white text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{q.questionText}</span>
                  </h3>

                  {/* OPTIONS */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-8">
                    {q.options?.map((option) => {
                      const isOptionSelected = selectedOption === option;
                      let btnStyle = 'bg-white border-[#E7DED1] text-gray-700 hover:border-[#E89B52]';

                      if (quizSubmitted) {
                        if (option === q.correctAnswer) {
                          btnStyle = 'bg-green-100 border-green-500 text-green-900 font-bold';
                        } else if (isOptionSelected && option !== q.correctAnswer) {
                          btnStyle = 'bg-red-100 border-red-500 text-red-900 line-through';
                        }
                      } else if (isOptionSelected) {
                        btnStyle = 'bg-[#E89B52] border-[#E89B52] text-white font-bold';
                      }

                      return (
                        <button
                          key={option}
                          onClick={() => handleSelectOption(q.id, option)}
                          className={`p-3 rounded-xl border text-xs text-left transition cursor-pointer ${btnStyle}`}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>

                  {/* EXPLANATION AFTER SUBMIT */}
                  {quizSubmitted && q.explanation && (
                    <div className="pl-8 pt-2">
                      <p className="text-xs text-gray-600 bg-white p-3 rounded-xl border border-[#E7DED1] italic">
                        <b>Explanation:</b> {q.explanation}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* SUBMIT / RESULT ACTIONS */}
          {!quizSubmitted ? (
            <Button
              variant="primary"
              size="lg"
              className="w-full flex items-center justify-center gap-2"
              onClick={handleSubmitQuiz}
              disabled={Object.keys(userAnswers).length < activeQuiz.questions.length}
            >
              <CheckCircle2 size={18} />
              <span>Submit Assessment Answers</span>
            </Button>
          ) : (
            <div className="p-6 bg-amber-50 border border-amber-200 rounded-2xl text-center space-y-4">
              <div className="space-y-1">
                <span className="text-xs font-bold text-amber-900 uppercase tracking-widest block">Quiz Complete</span>
                <div className="font-display font-black text-3xl text-amber-900">
                  Your Score: {scorePercentage}%
                </div>
                <p className="text-xs text-amber-800">
                  {scorePercentage >= activeQuiz.passingScore
                    ? '🎉 Congratulations! You passed this module assessment!'
                    : 'Review the explanations above and try again to improve your score.'}
                </p>
              </div>

              <div className="flex justify-center gap-4">
                <Button variant="secondary" size="md" className="flex items-center gap-2" onClick={handleRetakeQuiz}>
                  <RotateCcw size={16} />
                  <span>Retake Quiz</span>
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* PLACEMENT REQUEST MODAL */}
      {showPlacementModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#E7DED1] rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl relative">
            <h3 className="font-display font-black text-lg text-[#2B2B2B]">Request Advanced Placement Assessment</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              If you have previous experience playing Ethiopian traditional instruments, request an evaluation with Teacher Bruk to be assigned directly to Level 2 or Level 3.
            </p>

            {!placementSubmitted ? (
              <div className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-gray-600">Target Instrument</label>
                  <select
                    className="w-full p-2.5 bg-[#FAF6EF] border border-[#E7DED1] rounded-xl font-bold"
                    value={placementInstrument}
                    onChange={(e) => setPlacementInstrument(e.target.value)}
                  >
                    <option value="Begena">Begena</option>
                    <option value="Krar">Krar</option>
                    <option value="Masenqo">Masenqo</option>
                    <option value="Vocal">Vocal</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-600">Self-Reported Experience</label>
                  <select
                    className="w-full p-2.5 bg-[#FAF6EF] border border-[#E7DED1] rounded-xl font-bold"
                    value={yearsExperience}
                    onChange={(e) => setYearsExperience(e.target.value)}
                  >
                    <option value="1-2 Years">1 - 2 Years</option>
                    <option value="2-3 Years">2 - 3 Years</option>
                    <option value="4+ Years">4+ Years</option>
                  </select>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="secondary" size="sm" onClick={() => setShowPlacementModal(false)}>
                    Cancel
                  </Button>
                  <Button variant="primary" size="sm" onClick={handleSubmitPlacementRequest}>
                    Submit Request
                  </Button>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-green-50 border border-green-200 rounded-xl space-y-2 text-xs text-center">
                <CheckCircle2 size={24} className="mx-auto text-green-600" />
                <span className="font-bold text-green-900 block">Placement Request Received</span>
                <p className="text-green-800">
                  Teacher Bruk will review your profile and contact you for a 15-minute live audio evaluation.
                </p>
                <Button variant="primary" size="sm" className="w-full mt-2" onClick={() => setShowPlacementModal(false)}>
                  Close
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

