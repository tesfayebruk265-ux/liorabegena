import React, { useState } from 'react';
import { Search, GraduationCap, Users, BookOpen, DollarSign, Calendar, ShoppingBag, ShieldCheck, Ticket } from 'lucide-react';

interface GlobalSystemSearchProps {
  onNavigate?: (page: string) => void;
  userRole?: string;
}

export const GlobalSystemSearch: React.FC<GlobalSystemSearchProps> = ({
  onNavigate,
  userRole = 'Founder'
}) => {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  // Unified Search Index Data
  const sampleSearchRecords = [
    { id: 'STU-101', name: 'Yohannes Girma', category: 'Student', details: 'Begena Level 1 (Megenagna Branch)', route: 'student-ai' },
    { id: 'TEA-201', name: 'Teacher Abel Girma', category: 'Teacher', details: 'Master Instructor (Begena & Zema)', route: 'teacher-ai' },
    { id: 'PAR-301', name: 'Girma Tadesse', category: 'Parent', details: 'Linked Student: Yohannes Girma', route: 'parent-ai' },
    { id: 'CRS-401', name: 'Begena Level 1 Acoustic', category: 'Course', details: 'Module 4: Octave Tuning & Muting', route: 'learning-center' },
    { id: 'PAY-501', name: 'Receipt #REC-4091 (1,500 ETB)', category: 'Payment', details: 'Telebirr Verified - Approved', route: 'accountant-ai' },
    { id: 'EVT-601', name: 'Annual Begena Sacred Concert 2026', category: 'Event', details: 'Bole Medhanealem Auditorium', route: 'events' },
    { id: 'CRM-701', name: 'Lead: Aster Bedelu', category: 'CRM', details: 'Inquired about Lebu Branch Begena Class', route: 'crm' },
    { id: 'STR-801', name: 'Handcrafted Begena 10-String', category: 'Store', details: 'Custom Olive Wood Frame in Stock', route: 'store' }
  ];

  const categories = ['All', 'Student', 'Teacher', 'Parent', 'Course', 'Payment', 'Event', 'CRM', 'Store'];

  const filteredResults = sampleSearchRecords.filter((rec) => {
    const matchesQuery =
      rec.name.toLowerCase().includes(query.toLowerCase()) ||
      rec.details.toLowerCase().includes(query.toLowerCase()) ||
      rec.id.toLowerCase().includes(query.toLowerCase());
    const matchesCat = activeCategory === 'All' || rec.category === activeCategory;
    return matchesQuery && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-amber-100 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-neutral-800 flex items-center gap-2">
            <Search className="w-6 h-6 text-amber-700" /> Secure System-Wide Search
          </h2>
          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200 flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600" /> Role Permission Filtered ({userRole})
          </span>
        </div>

        {/* Big Search Input */}
        <div className="relative">
          <Search className="w-5 h-5 text-neutral-400 absolute left-4 top-3.5" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search across students, courses, payments, teachers, leads, events, store..."
            className="w-full bg-stone-50 border border-stone-300 rounded-2xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-amber-800 text-white'
                  : 'bg-stone-100 text-neutral-600 hover:bg-stone-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results List */}
      <div className="bg-white rounded-2xl p-6 border border-amber-100 shadow-sm space-y-3">
        <div className="text-xs text-neutral-500 font-bold border-b pb-2">
          Found {filteredResults.length} matching records
        </div>

        <div className="space-y-2">
          {filteredResults.map((res) => (
            <div
              key={res.id}
              onClick={() => onNavigate && onNavigate(res.route)}
              className="p-4 bg-stone-50 hover:bg-amber-50/60 rounded-xl border border-stone-200 transition-all flex justify-between items-center cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <span className="p-2.5 bg-amber-100 text-amber-900 rounded-xl font-bold text-xs shrink-0">
                  {res.category === 'Student' && <GraduationCap className="w-4 h-4" />}
                  {res.category === 'Teacher' && <BookOpen className="w-4 h-4" />}
                  {res.category === 'Parent' && <Users className="w-4 h-4" />}
                  {res.category === 'Course' && <BookOpen className="w-4 h-4" />}
                  {res.category === 'Payment' && <DollarSign className="w-4 h-4" />}
                  {res.category === 'Event' && <Calendar className="w-4 h-4" />}
                  {res.category === 'CRM' && <Users className="w-4 h-4" />}
                  {res.category === 'Store' && <ShoppingBag className="w-4 h-4" />}
                </span>

                <div>
                  <div className="font-bold text-neutral-800 text-sm group-hover:text-amber-900">{res.name}</div>
                  <div className="text-xs text-neutral-500 mt-0.5">{res.details}</div>
                </div>
              </div>

              <span className="font-mono text-[10px] font-bold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-lg">
                {res.id}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

