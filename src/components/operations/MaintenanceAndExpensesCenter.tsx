import React, { useState } from 'react';
import {
  Wrench,
  DollarSign,
  CheckCircle2,
  Clock,
  Plus,
  AlertTriangle,
  Building2,
  FileText,
  ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Language, MaintenanceRequest, BranchExpenseRequest } from '../../types';
import { TiletPattern } from '../TiletPattern';
import { Button, Input } from '../InteractiveComponents';

const SAMPLE_MAINTENANCE: MaintenanceRequest[] = [
  {
    id: 'm-1',
    title: 'Begena Peg Tuning Mechanics Lubrication & Bridge Repair',
    category: 'Instrument Repair',
    branchId: 'b-hawassa',
    branchName: 'Hawassa main Branch',
    roomId: 'r-101',
    priority: 'High',
    reportedBy: 'Liora Begena',
    date: '2026-07-20',
    description: 'String peg #4 slipping on sacred Begena #002 in Room 101.',
    status: 'In Progress'
  },
  {
    id: 'm-2',
    title: 'Replace Acoustic Isolation Wall Padding',
    category: 'Room Repair',
    branchId: 'b-hawassa',
    branchName: 'Hawassa main Branch',
    roomId: 'r-201',
    priority: 'Normal',
    reportedBy: 'Selamawit Kebede',
    date: '2026-07-18',
    description: 'Acoustic padding loose near recording booth.',
    status: 'Reported'
  }
];

const SAMPLE_EXPENSES: BranchExpenseRequest[] = [
  {
    id: 'exp-1',
    title: 'Purchase of Traditional Ox Gut Strings Roll',
    category: 'Stationery',
    amountETB: 3500,
    branchId: 'b-hawassa',
    branchName: 'Hawassa main Branch',
    requestedBy: 'Solomon Worku',
    requestDate: '2026-07-19',
    status: 'Pending Accountant Review'
  },
  {
    id: 'exp-2',
    title: 'Kebero Drum Tuning & Leather Strap Replacement',
    category: 'Repair',
    amountETB: 1800,
    branchId: 'b-hawassa',
    branchName: 'Hawassa main Branch',
    requestedBy: 'Yared Tadesse',
    requestDate: '2026-07-17',
    status: 'Approved'
  }
];

interface MaintenanceAndExpensesCenterProps {
  lang: Language;
  onNavigate: (page: string, params?: any) => void;
}

export function MaintenanceAndExpensesCenter({ lang, onNavigate }: MaintenanceAndExpensesCenterProps) {
  const [activeTab, setActiveTab] = useState<'maintenance' | 'expenses'>('maintenance');
  const [maintenanceList, setMaintenanceList] = useState<MaintenanceRequest[]>(SAMPLE_MAINTENANCE);
  const [expenseList, setExpenseList] = useState<BranchExpenseRequest[]>(SAMPLE_EXPENSES);

  // New Maintenance Ticket Modal
  const [showMaintModal, setShowMaintModal] = useState(false);
  const [maintTitle, setMaintTitle] = useState('');
  const [maintCategory, setMaintCategory] = useState<any>('Instrument Repair');
  const [maintPriority, setMaintPriority] = useState<any>('High');
  const [maintDesc, setMaintDesc] = useState('');

  // New Expense Modal
  const [showExpModal, setShowExpModal] = useState(false);
  const [expTitle, setExpTitle] = useState('');
  const [expAmount, setExpAmount] = useState(1500);

  const handleCreateMaint = () => {
    if (!maintTitle) return;
    const item: MaintenanceRequest = {
      id: `m-${Date.now()}`,
      title: maintTitle,
      category: maintCategory,
      branchId: 'b-hawassa',
      branchName: 'Hawassa main Branch',
      priority: maintPriority,
      reportedBy: 'Staff Member',
      date: new Date().toISOString().substring(0, 10),
      description: maintDesc || 'Facility repair ticket opened.',
      status: 'Reported'
    };
    setMaintenanceList([item, ...maintenanceList]);
    setShowMaintModal(false);
    setMaintTitle('');
  };

  const handleCreateExp = () => {
    if (!expTitle) return;
    const exp: BranchExpenseRequest = {
      id: `exp-${Date.now()}`,
      title: expTitle,
      category: 'Repair',
      amountETB: expAmount,
      branchId: 'b-hawassa',
      branchName: 'Hawassa main Branch',
      requestedBy: 'Branch Staff',
      requestDate: new Date().toISOString().substring(0, 10),
      status: 'Pending Branch Review'
    };
    setExpenseList([exp, ...expenseList]);
    setShowExpModal(false);
    setExpTitle('');
  };

  return (
    <div className="space-y-8 pb-16">
      {/* HEADER BANNER */}
      <div className="bg-[#2B2B2B] text-white p-6 sm:p-8 rounded-3xl relative overflow-hidden shadow-xl border border-amber-950/40">
        <TiletPattern className="opacity-15 text-[#E89B52] scale-125" />
        <div className="relative z-10 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E89B52]/20 border border-[#E89B52]/40 text-[#E89B52] text-xs font-bold uppercase tracking-widest">
              <Wrench size={14} />
              <span>Campus Facilities Maintenance & Expense Approval</span>
            </div>

            <div className="flex bg-white/10 p-1 rounded-xl border border-white/20">
              <button
                onClick={() => setActiveTab('maintenance')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  activeTab === 'maintenance' ? 'bg-[#E89B52] text-white' : 'text-gray-300 hover:text-white'
                }`}
              >
                🔧 Maintenance Tickets
              </button>
              <button
                onClick={() => setActiveTab('expenses')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  activeTab === 'expenses' ? 'bg-[#E89B52] text-white' : 'text-gray-300 hover:text-white'
                }`}
              >
                💳 Branch Expenses
              </button>
            </div>
          </div>

          <h1 className="font-display font-black text-2xl sm:text-3xl text-white tracking-wide uppercase">
            {activeTab === 'maintenance' ? 'INSTRUMENT & ROOM REPAIR WORKFLOW' : 'BRANCH EXPENSE APPROVAL PIPELINE'}
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 max-w-2xl leading-relaxed">
            {activeTab === 'maintenance'
              ? 'Log and track repair requests for sacred Begena instruments, acoustic rooms, sound equipment, and digital streaming rigs.'
              : 'Submit and approve branch operational expenditure requests with multi-level Branch Manager ➔ Accountant ➔ Admin verification.'}
          </p>
        </div>
      </div>

      {activeTab === 'maintenance' ? (
        /* MAINTENANCE TICKETS SECTION */
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="font-display font-black text-xl text-[#2B2B2B]">MAINTENANCE REPAIR TICKETS</h2>
            <Button variant="primary" size="sm" onClick={() => setShowMaintModal(true)}>
              + Report Maintenance Need
            </Button>
          </div>

          <div className="space-y-4">
            {maintenanceList.map((m) => (
              <div key={m.id} className="p-5 bg-white border border-[#E7DED1] rounded-3xl space-y-3 shadow-xs">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-[#E89B52] uppercase block">{m.branchName} • {m.category}</span>
                    <h3 className="font-display font-black text-base text-[#2B2B2B]">{m.title}</h3>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                    m.priority === 'High' ? 'bg-red-100 text-red-900' : 'bg-amber-100 text-amber-900'
                  }`}>
                    {m.priority} Priority
                  </span>
                </div>

                <p className="text-xs text-gray-600 bg-[#FAF6EF] p-3 rounded-2xl border border-[#E7DED1]">
                  "{m.description}"
                </p>

                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>Reported by <b>{m.reportedBy}</b> on {m.date}</span>
                  <span className="font-bold text-[#2B2B2B]">Status: {m.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* EXPENSES SECTION */
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="font-display font-black text-xl text-[#2B2B2B]">BRANCH EXPENSE REIMBURSEMENTS</h2>
            <Button variant="primary" size="sm" onClick={() => setShowExpModal(true)}>
              + Request Expense Approval
            </Button>
          </div>

          <div className="space-y-4">
            {expenseList.map((exp) => (
              <div key={exp.id} className="p-5 bg-white border border-[#E7DED1] rounded-3xl flex justify-between items-center text-xs shadow-xs">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono font-bold text-[#E89B52] uppercase block">{exp.branchName}</span>
                  <h3 className="font-display font-black text-base text-[#2B2B2B]">{exp.title}</h3>
                  <p className="text-gray-500">Requested by {exp.requestedBy} on {exp.requestDate}</p>
                </div>

                <div className="text-right space-y-1">
                  <div className="font-display font-black text-lg text-green-800">{exp.amountETB.toLocaleString()} ETB</div>
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-900 rounded text-[10px] font-bold uppercase">
                    {exp.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* NEW MAINTENANCE MODAL */}
      {showMaintModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#E7DED1] rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-4 shadow-2xl relative">
            <h3 className="font-display font-black text-lg text-[#2B2B2B]">OPEN MAINTENANCE TICKET</h3>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-gray-600">Issue Title</label>
                <Input value={maintTitle} onChange={(e) => setMaintTitle(e.target.value)} placeholder="e.g. Krar Peg Loose" />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-600">Description</label>
                <textarea
                  rows={2}
                  className="w-full p-3 bg-[#FAF6EF] border border-[#E7DED1] rounded-xl outline-none"
                  value={maintDesc}
                  onChange={(e) => setMaintDesc(e.target.value)}
                  placeholder="Provide repair context..."
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="secondary" size="sm" onClick={() => setShowMaintModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleCreateMaint}>
                Log Maintenance Ticket
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* NEW EXPENSE MODAL */}
      {showExpModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#E7DED1] rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-4 shadow-2xl relative">
            <h3 className="font-display font-black text-lg text-[#2B2B2B]">REQUEST BRANCH EXPENSE</h3>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-gray-600">Expense Purpose</label>
                <Input value={expTitle} onChange={(e) => setExpTitle(e.target.value)} placeholder="e.g. Strings Restock" />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-600">Amount (ETB)</label>
                <Input type="number" value={expAmount} onChange={(e) => setExpAmount(Number(e.target.value))} />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="secondary" size="sm" onClick={() => setShowExpModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleCreateExp}>
                Submit Request
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

