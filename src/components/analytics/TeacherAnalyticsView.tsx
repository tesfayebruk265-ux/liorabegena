import React, { useState } from 'react';
import {
  Users,
  CheckCircle2,
  Clock,
  BookOpen,
  Award,
  AlertTriangle,
  Search,
  MessageSquare,
  BarChart2,
  TrendingUp,
  FileCheck,
  Calendar
} from 'lucide-react';
import { Language } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Button, Input } from '../InteractiveComponents';
import { TiletPattern } from '../TiletPattern';
import { SAMPLE_AT_RISK_SIGNALS } from './AnalyticsData';

interface TeacherAnalyticsViewProps {
  lang: Language;
  onNavigate: (page: string, params?: any) => void;
}

export function TeacherAnalyticsView({ lang, onNavigate }: TeacherAnalyticsViewProps) {
  const { currentUser } = useAuth();
  const { enrollments } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<string>('All');

  // Teacher Student Roster derived from real enrollments
  const teacherStudents: Array<{
    id: string;
    name: string;
    course: string;
    level: string;
    attendance: number;
    practiceHours: number;
    assignments: string;
    atRisk: boolean;
    riskReason?: string;
  }> = (enrollments || []).map((e, idx) => ({
    id: e.id || `enr-${idx}`,
    name: e.studentName || 'Student',
    course: e.courseName || e.instrument || 'Begena',
    level: e.level || 'Level 1',
    attendance: 100,
    practiceHours: 0,
    assignments: '0/0',
    atRisk: false
  }));

  const filteredStudents = teacherStudents.filter((s) => {
    if (selectedCourse !== 'All' && s.course !== selectedCourse) return false;
    if (searchQuery.trim()) {
      return s.name.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      {/* HEADER BANNER */}
      <div className="bg-[#2B2B2B] text-white p-6 sm:p-8 rounded-3xl relative overflow-hidden shadow-xl border border-amber-950/40">
        <TiletPattern className="opacity-15 text-[#E89B52] scale-125" />
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E89B52]/20 border border-[#E89B52]/40 text-[#E89B52] text-xs font-bold uppercase tracking-widest">
            <Users size={14} className="text-[#E89B52]" />
            <span>Teacher Pedagogy & Student Cohort Analytics</span>
          </div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-white tracking-wide uppercase">
            TEACHER INSTRUCTION & COHORT DASHBOARD
          </h1>
          <p className="text-xs sm:text-sm text-gray-300">
            Monitor student practice velocity, class attendance rates, assignment submission timelines, and early at-risk indicators.
          </p>
        </div>
      </div>

      {/* METRIC CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-[#E7DED1] p-4 rounded-2xl space-y-1 shadow-xs">
          <span className="text-[10px] text-gray-500 font-mono uppercase block">Active Assigned Students</span>
          <span className="font-display font-black text-2xl text-[#2B2B2B]">48 Students</span>
        </div>
        <div className="bg-white border border-[#E7DED1] p-4 rounded-2xl space-y-1 shadow-xs">
          <span className="text-[10px] text-gray-500 font-mono uppercase block">Average Attendance</span>
          <span className="font-display font-black text-2xl text-emerald-700">92.4%</span>
        </div>
        <div className="bg-white border border-[#E7DED1] p-4 rounded-2xl space-y-1 shadow-xs">
          <span className="text-[10px] text-gray-500 font-mono uppercase block">Teaching Hours (This Month)</span>
          <span className="font-display font-black text-2xl text-[#E89B52]">36 Hours</span>
        </div>
        <div className="bg-white border border-[#E7DED1] p-4 rounded-2xl space-y-1 shadow-xs">
          <span className="text-[10px] text-gray-500 font-mono uppercase block">At-Risk Follow-ups Needed</span>
          <span className="font-display font-black text-2xl text-red-600">2 Students</span>
        </div>
      </div>

      {/* STUDENT COHORT PROGRESS TABLE */}
      <div className="bg-white border border-[#E7DED1] rounded-3xl p-6 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-3 border-b border-[#E7DED1]">
          <h3 className="font-display font-black text-base text-[#2B2B2B] uppercase">STUDENT PROGRESS & PRACTICE ROSTER</h3>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Input
              type="text"
              placeholder="Search student name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-xs bg-[#FAF6EF]"
            />
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="p-2 bg-[#FAF6EF] border border-[#E7DED1] rounded-xl text-xs font-bold text-[#2B2B2B]"
            >
              <option value="All">All Courses</option>
              <option value="Begena Level 1">Begena Level 1</option>
              <option value="Krar Intermediate">Krar Intermediate</option>
              <option value="Masenqo Fundamentals">Masenqo Fundamentals</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border border-[#E7DED1] rounded-2xl overflow-hidden">
            <thead className="bg-[#FAF6EF] text-[#2B2B2B] font-bold uppercase border-b border-[#E7DED1]">
              <tr>
                <th className="p-3">Student Name</th>
                <th className="p-3">Enrolled Course</th>
                <th className="p-3">Attendance Rate</th>
                <th className="p-3">Weekly Practice</th>
                <th className="p-3">Assignments</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7DED1]">
              {filteredStudents.map((st) => (
                <tr key={st.id} className="hover:bg-amber-50/50">
                  <td className="p-3 font-bold text-[#2B2B2B]">{st.name}</td>
                  <td className="p-3">{st.course}</td>
                  <td className="p-3 font-mono font-bold">{st.attendance}%</td>
                  <td className="p-3 font-mono">{st.practiceHours} hrs/wk</td>
                  <td className="p-3 font-mono">{st.assignments}</td>
                  <td className="p-3">
                    {st.atRisk ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-800 flex items-center gap-1 w-fit">
                        <AlertTriangle size={12} />
                        <span>At Risk ({st.riskReason})</span>
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        Good Progress
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-right">
                    <button className="text-xs text-[#E89B52] font-bold hover:underline cursor-pointer">
                      Provide Feedback
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

