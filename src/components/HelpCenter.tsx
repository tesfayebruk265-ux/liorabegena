import React, { useState } from 'react';
import { BookOpen, HelpCircle, Search, MessageSquare, Send, CheckCircle2, FileText, Smartphone, ShieldCheck, Ticket, ChevronRight, Sparkles } from 'lucide-react';

interface HelpCenterProps {
  onNavigate?: (page: string) => void;
}

export const HelpCenter: React.FC<HelpCenterProps> = ({ onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [ticketCreated, setTicketCreated] = useState(false);

  // New Support Ticket Form State
  const [newTicket, setNewTicket] = useState({
    category: 'Registration & Enrollment',
    subject: '',
    description: '',
    priority: 'Medium'
  });

  const faqs = [
    {
      id: 'FAQ-01',
      question: 'How do I register and enroll in a Begena or Kebero course?',
      answer: 'Click "Enroll Now" or "Student Registration" on the homepage. Complete the student information form, select your course level and learning mode (Hawassa main Branch or Online Campus), choose your class schedule, and submit payment via Telebirr, CBE, or Cash.',
      category: 'Registration & Enrollment'
    },
    {
      id: 'FAQ-02',
      question: 'What payment options are accepted by Liora Begena School?',
      answer: 'We accept Telebirr instant checkout, Commercial Bank of Ethiopia (CBE) direct transfers, and Cash payments at any of our branch cashier offices. Payment receipts are verified by our accounting team within 2 hours.',
      category: 'Payments & Tuition'
    },
    {
      id: 'FAQ-03',
      question: 'How does the Interactive Music Practice Studio work?',
      answer: 'Access the Practice Studio from your Student LMS Dashboard. Select your instrument tuning (such as Begena 10-String or Washint Pentatonic), use the real-time pitch tuner and metronome, record your practice sessions, and track your daily streak.',
      category: 'LMS & Practice Studio'
    },
    {
      id: 'FAQ-04',
      question: 'How can parents track their child’s progress and attendance?',
      answer: 'Parents can log into the Parent Portal to view real-time class attendance (Present, Late, Excused), teacher evaluation feedback, video assignment submissions, and upcoming exam schedules.',
      category: 'Parent Portal'
    },
    {
      id: 'FAQ-05',
      question: 'How do employers or churches verify a student’s graduate certificate?',
      answer: 'Every official certificate includes a unique QR code and ID (e.g. CERT-2026-8819). Anyone can visit /verify-certificate or scan the QR code to verify its authenticity on our public ledger.',
      category: 'Certificates & QR'
    }
  ];

  const categories = ['All', 'Registration & Enrollment', 'Payments & Tuition', 'LMS & Practice Studio', 'Parent Portal', 'Certificates & QR'];

  const filteredFaqs = faqs.filter((f) => {
    const matchesSearch = f.question.toLowerCase().includes(searchQuery.toLowerCase()) || f.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'All' || f.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicket.subject || !newTicket.description) return;
    setTicketCreated(true);
    setTimeout(() => {
      setTicketCreated(false);
      setNewTicket({ category: 'Registration & Enrollment', subject: '', description: '', priority: 'Medium' });
    }, 4000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Help Hero Header */}
      <div className="bg-amber-900 text-amber-50 rounded-2xl p-8 shadow-md border border-amber-800 text-center space-y-3 relative overflow-hidden">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-amber-800/80 rounded-full text-xs font-bold text-amber-200 border border-amber-700">
          <HelpCircle className="w-4 h-4 text-amber-300" /> Liora Begena Student & Staff Help Center
        </span>
        <h1 className="text-3xl font-extrabold text-white">How Can We Support Your Musical & Academic Journey?</h1>
        <p className="text-xs text-amber-200 max-w-2xl mx-auto">
          Explore guidebooks, search interactive FAQs, or submit a direct ticket to our school registration and support team.
        </p>

        {/* Big Search Input */}
        <div className="max-w-xl mx-auto pt-2 relative">
          <Search className="w-5 h-5 text-neutral-400 absolute left-4 top-5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search help topics, payments, practice studio, certificates..."
            className="w-full bg-white text-neutral-900 border border-amber-300 rounded-2xl pl-12 pr-4 py-3.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-lg"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2 justify-center">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedCategory === cat ? 'bg-amber-800 text-white shadow-sm' : 'bg-white text-neutral-700 border border-amber-100 hover:bg-stone-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* FAQs Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-neutral-800 flex items-center gap-2 border-b pb-2">
          <BookOpen className="w-5 h-5 text-amber-700" /> Frequently Asked Questions ({filteredFaqs.length})
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredFaqs.map((faq) => (
            <div key={faq.id} className="bg-white p-5 rounded-2xl border border-amber-100 shadow-sm space-y-2">
              <span className="text-[10px] font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 uppercase tracking-wider">
                {faq.category}
              </span>
              <h3 className="font-bold text-neutral-900 text-sm">{faq.question}</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Direct Ticket Support Form */}
      <div className="bg-white rounded-2xl p-6 border border-amber-100 shadow-sm space-y-4">
        <div className="flex justify-between items-center border-b pb-3">
          <h2 className="text-base font-bold text-neutral-800 flex items-center gap-2">
            <Ticket className="w-5 h-5 text-amber-700" /> Submit a Dedicated Support Ticket
          </h2>
          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
            Average Response Time: &lt; 2 Hours
          </span>
        </div>

        {ticketCreated && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs rounded-2xl flex items-center gap-2 font-bold">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            Ticket submitted successfully! Reference #TKT-{Math.floor(Math.random() * 90000 + 10000)}. Our support team will respond via Telegram / SMS.
          </div>
        )}

        <form onSubmit={handleSubmitTicket} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-neutral-700 block mb-1">Issue Category</label>
              <select
                value={newTicket.category}
                onChange={(e) => setNewTicket((prev) => ({ ...prev, category: e.target.value }))}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 font-bold focus:outline-none"
              >
                <option value="Registration & Enrollment">Registration & Enrollment</option>
                <option value="Payments & Tuition">Payments & Tuition</option>
                <option value="LMS & Practice Studio">LMS & Practice Studio</option>
                <option value="Teacher / Class Schedule">Teacher / Class Schedule</option>
                <option value="Technical / Account Issue">Technical / Account Issue</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-neutral-700 block mb-1">Priority Level</label>
              <select
                value={newTicket.priority}
                onChange={(e) => setNewTicket((prev) => ({ ...prev, priority: e.target.value }))}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 font-bold focus:outline-none"
              >
                <option value="Low">Low - General Inquiry</option>
                <option value="Medium">Medium - Standard Request</option>
                <option value="High">High - Urgent Payment/Enrollment Issue</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-bold text-neutral-700 block mb-1">Ticket Subject</label>
            <input
              type="text"
              value={newTicket.subject}
              onChange={(e) => setNewTicket((prev) => ({ ...prev, subject: e.target.value }))}
              placeholder="e.g. Telebirr Payment Verification Delay for Begena Level 1"
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 font-semibold focus:outline-none"
            />
          </div>

          <div>
            <label className="font-bold text-neutral-700 block mb-1">Detailed Description</label>
            <textarea
              rows={3}
              value={newTicket.description}
              onChange={(e) => setNewTicket((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Describe what happened, including transaction numbers or error messages..."
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 focus:outline-none"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!newTicket.subject || !newTicket.description}
              className="bg-amber-800 hover:bg-amber-900 disabled:opacity-50 text-white font-bold px-6 py-2.5 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Send className="w-4 h-4" /> Dispatch Ticket
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

