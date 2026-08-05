import React, { useState } from 'react';
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  Building2,
  FileText,
  PieChart,
  Download,
  AlertCircle,
  Filter,
  CheckCircle2
} from 'lucide-react';
import { Language } from '../../types';
import { Button } from '../InteractiveComponents';
import { TiletPattern } from '../TiletPattern';

interface AccountantAnalyticsViewProps {
  lang: Language;
  onNavigate: (page: string, params?: any) => void;
}

export function AccountantAnalyticsView({ lang, onNavigate }: AccountantAnalyticsViewProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<'Monthly' | 'Quarterly' | 'Yearly'>('Monthly');
  const [selectedBranchFilter, setSelectedBranchFilter] = useState<'All' | 'Piazza' | 'Megenagna' | 'Lebu'>('All');

  // Outstanding Payment Items
  const outstandingList: any[] = [];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      {/* HEADER BANNER */}
      <div className="bg-[#2B2B2B] text-white p-6 sm:p-8 rounded-3xl relative overflow-hidden shadow-xl border border-amber-950/40">
        <TiletPattern className="opacity-15 text-[#E89B52] scale-125" />
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E89B52]/20 border border-[#E89B52]/40 text-[#E89B52] text-xs font-bold uppercase tracking-widest">
            <DollarSign size={14} className="text-[#E89B52]" />
            <span>School Financial Ledger & Payment Analytics</span>
          </div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-white tracking-wide uppercase">
            ACCOUNTING & FINANCIAL REVENUE ANALYTICS
          </h1>
          <p className="text-xs sm:text-sm text-gray-300">
            Reconcile CBE Bank Transfers, Telebirr digital payments, course tuition revenues, store instrument sales, and outstanding aging balances.
          </p>
        </div>
      </div>

      {/* METRIC CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-[#E7DED1] p-4 rounded-2xl space-y-1 shadow-xs">
          <span className="text-[10px] text-gray-500 font-mono uppercase block">Total Monthly Revenue</span>
          <span className="font-display font-black text-2xl text-[#2B2B2B]">820,000 ETB</span>
          <span className="text-[10px] text-emerald-700 font-bold block">+18.5% Growth vs June</span>
        </div>

        <div className="bg-white border border-[#E7DED1] p-4 rounded-2xl space-y-1 shadow-xs">
          <span className="text-[10px] text-gray-500 font-mono uppercase block">Course Tuition Revenue</span>
          <span className="font-display font-black text-2xl text-emerald-700">480,000 ETB</span>
          <span className="text-[10px] text-gray-500 block">58.5% of Total</span>
        </div>

        <div className="bg-white border border-[#E7DED1] p-4 rounded-2xl space-y-1 shadow-xs">
          <span className="text-[10px] text-gray-500 font-mono uppercase block">Store Instrument Sales</span>
          <span className="font-display font-black text-2xl text-[#E89B52]">245,000 ETB</span>
          <span className="text-[10px] text-gray-500 block">29.9% of Total</span>
        </div>

        <div className="bg-white border border-[#E7DED1] p-4 rounded-2xl space-y-1 shadow-xs">
          <span className="text-[10px] text-gray-500 font-mono uppercase block">Outstanding Aging Total</span>
          <span className="font-display font-black text-2xl text-red-600">84,000 ETB</span>
          <span className="text-[10px] text-red-700 font-bold block">42 Pending Students</span>
        </div>
      </div>

      {/* PAYMENT METHOD DISTRIBUTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-[#E7DED1] rounded-3xl p-6 space-y-4 shadow-xs">
          <h3 className="font-display font-black text-base text-[#2B2B2B] uppercase">PAYMENT CHANNEL BREAKDOWN</h3>

          <div className="space-y-3 font-mono text-xs">
            <div className="p-3 bg-[#FAF6EF] border border-[#E7DED1] rounded-2xl flex justify-between items-center">
              <div>
                <span className="font-bold text-[#2B2B2B] block">CBE Bank Direct Transfer</span>
                <span className="text-[10px] text-gray-500">Commercial Bank of Ethiopia</span>
              </div>
              <div className="text-right">
                <span className="font-black text-[#2B2B2B] block">426,400 ETB (52%)</span>
                <span className="text-[10px] text-emerald-700 font-bold">285 Transactions</span>
              </div>
            </div>

            <div className="p-3 bg-[#FAF6EF] border border-[#E7DED1] rounded-2xl flex justify-between items-center">
              <div>
                <span className="font-bold text-[#2B2B2B] block">Telebirr Mobile Money</span>
                <span className="text-[10px] text-gray-500">Ethio Telecom Telebirr API</span>
              </div>
              <div className="text-right">
                <span className="font-black text-[#2B2B2B] block">311,600 ETB (38%)</span>
                <span className="text-[10px] text-emerald-700 font-bold">410 Transactions</span>
              </div>
            </div>

            <div className="p-3 bg-[#FAF6EF] border border-[#E7DED1] rounded-2xl flex justify-between items-center">
              <div>
                <span className="font-bold text-[#2B2B2B] block">Campus Cash Counter</span>
                <span className="text-[10px] text-gray-500">Piazza & Megenagna Walk-ins</span>
              </div>
              <div className="text-right">
                <span className="font-black text-[#2B2B2B] block">82,000 ETB (10%)</span>
                <span className="text-[10px] text-gray-600 font-bold">65 Receipts</span>
              </div>
            </div>
          </div>
        </div>

        {/* OUTSTANDING OVERDUE PAYMENTS */}
        <div className="bg-white border border-[#E7DED1] rounded-3xl p-6 space-y-4 shadow-xs">
          <div className="flex justify-between items-center pb-2 border-b border-[#E7DED1]">
            <h3 className="font-display font-black text-base text-[#2B2B2B] uppercase">OVERDUE AGING FOLLOW-UP</h3>
            <span className="px-2 py-0.5 bg-red-100 text-red-800 rounded-full font-bold text-[10px]">
              Requires Follow-Up
            </span>
          </div>

          <div className="space-y-3">
            {outstandingList.map((o) => (
              <div key={o.id} className="p-3 bg-[#FAF6EF] border border-[#E7DED1] rounded-2xl text-xs space-y-1">
                <div className="flex justify-between font-bold text-[#2B2B2B]">
                  <span>{o.studentName} ({o.branch})</span>
                  <span className="text-red-600 font-mono">{o.amountETB.toLocaleString()} ETB</span>
                </div>
                <div className="flex justify-between text-[11px] text-gray-600 font-mono">
                  <span>Course: {o.course}</span>
                  <span className="text-red-700 font-bold">{o.daysOverdue} Days Overdue</span>
                </div>
                <div className="pt-1 flex justify-end">
                  <button className="text-[10px] font-bold text-[#E89B52] hover:underline cursor-pointer">
                    Send Telebirr SMS Reminder
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

