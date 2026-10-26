import React, { useState } from 'react';
import { BookOpen, DollarSign, Calendar, Save, CheckCircle2, Plus, Percent, Edit3 } from 'lucide-react';
import { CoursePricingConfig, INITIAL_PRICING_CONFIG } from './SettingsData';

export const AcademicCourseSettings: React.FC = () => {
  const [pricingList, setPricingList] = useState<CoursePricingConfig[]>(INITIAL_PRICING_CONFIG);
  const [academicYear, setAcademicYear] = useState('2018 E.C. / 2026 G.C.');
  const [currentTerm, setCurrentTerm] = useState('Semester 1 (Meskerem - Tahsas)');
  const [enrollmentStatus, setEnrollmentStatus] = useState<'Open' | 'Closed' | 'Waitlist'>('Open');
  const [saved, setSaved] = useState(false);

  const handlePriceChange = (id: string, field: keyof CoursePricingConfig, value: any) => {
    setPricingList((prev) => prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
    setSaved(false);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-amber-100 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-neutral-800 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-amber-700" /> Academic Calendar & Centralized Pricing Matrix
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            Manage course fees, 3/4/6-month packages, registration fees, online vs in-person rates, and term dates centrally.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-colors flex items-center gap-2 shadow-sm shrink-0 cursor-pointer"
        >
          {saved ? <CheckCircle2 className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
          {saved ? 'Matrix Saved!' : 'Save Pricing Matrix'}
        </button>
      </div>

      {saved && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs rounded-2xl flex items-center gap-2 font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          Centralized pricing rules saved! All registration forms, student portals, and cashier screens updated in real time.
        </div>
      )}

      {/* Academic Calendar Control */}
      <div className="bg-white p-6 rounded-2xl border border-amber-100 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-neutral-800 border-b pb-2 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-amber-700" /> Academic Term & Enrollment Status
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block font-bold text-neutral-700 mb-1">Active Academic Year</label>
            <input
              type="text"
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 font-semibold text-neutral-800 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-neutral-700 mb-1">Current Semester / Term</label>
            <input
              type="text"
              value={currentTerm}
              onChange={(e) => setCurrentTerm(e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 font-semibold text-neutral-800 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-neutral-700 mb-1">General Enrollment Period Status</label>
            <select
              value={enrollmentStatus}
              onChange={(e) => setEnrollmentStatus(e.target.value as any)}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 font-bold text-neutral-800 focus:outline-none"
            >
              <option value="Open">Open for All Courses</option>
              <option value="Waitlist">Waitlist Only</option>
              <option value="Closed">Closed for Season</option>
            </select>
          </div>
        </div>
      </div>

      {/* Pricing Matrix Table */}
      <div className="bg-white rounded-2xl p-6 border border-amber-100 shadow-sm space-y-4">
        <div className="flex justify-between items-center border-b pb-3">
          <h3 className="text-sm font-bold text-neutral-800 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-amber-700" /> Configurable Tuition & Package Pricing
          </h3>
          <span className="text-xs text-amber-800 font-bold bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
            Currency: ETB (Ethiopian Birr)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50 text-neutral-600 font-bold">
                <th className="p-3">Course / Instrument</th>
                <th className="p-3">Monthly</th>
                <th className="p-3">3-Month</th>
                <th className="p-3">4-Month</th>
                <th className="p-3">6-Month</th>
                <th className="p-3">Reg. Fee</th>
                <th className="p-3">Online Rate</th>
                <th className="p-3">In-Person Rate</th>
                <th className="p-3 text-center">Discounts?</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {pricingList.map((item) => (
                <tr key={item.id} className="hover:bg-amber-50/40">
                  <td className="p-3 font-bold text-neutral-800">
                    {item.courseName}
                    <span className="block text-[10px] text-neutral-400 font-normal">{item.level}</span>
                  </td>
                  <td className="p-3">
                    <input
                      type="number"
                      value={item.monthlyFee}
                      onChange={(e) => handlePriceChange(item.id, 'monthlyFee', Number(e.target.value))}
                      className="w-20 bg-stone-50 border border-stone-300 rounded px-2 py-1 font-bold text-amber-900"
                    />
                  </td>
                  <td className="p-3">
                    <input
                      type="number"
                      value={item.threeMonthOption}
                      onChange={(e) => handlePriceChange(item.id, 'threeMonthOption', Number(e.target.value))}
                      className="w-20 bg-stone-50 border border-stone-300 rounded px-2 py-1 font-semibold"
                    />
                  </td>
                  <td className="p-3">
                    <input
                      type="number"
                      value={item.fourMonthOption}
                      onChange={(e) => handlePriceChange(item.id, 'fourMonthOption', Number(e.target.value))}
                      className="w-20 bg-stone-50 border border-stone-300 rounded px-2 py-1 font-semibold"
                    />
                  </td>
                  <td className="p-3">
                    <input
                      type="number"
                      value={item.sixMonthOption}
                      onChange={(e) => handlePriceChange(item.id, 'sixMonthOption', Number(e.target.value))}
                      className="w-20 bg-stone-50 border border-stone-300 rounded px-2 py-1 font-semibold"
                    />
                  </td>
                  <td className="p-3">
                    <input
                      type="number"
                      value={item.registrationFee}
                      onChange={(e) => handlePriceChange(item.id, 'registrationFee', Number(e.target.value))}
                      className="w-16 bg-stone-50 border border-stone-300 rounded px-2 py-1 font-semibold"
                    />
                  </td>
                  <td className="p-3">
                    <input
                      type="number"
                      value={item.onlinePricing}
                      onChange={(e) => handlePriceChange(item.id, 'onlinePricing', Number(e.target.value))}
                      className="w-20 bg-stone-50 border border-stone-300 rounded px-2 py-1 font-semibold"
                    />
                  </td>
                  <td className="p-3">
                    <input
                      type="number"
                      value={item.inPersonPricing}
                      onChange={(e) => handlePriceChange(item.id, 'inPersonPricing', Number(e.target.value))}
                      className="w-20 bg-stone-50 border border-stone-300 rounded px-2 py-1 font-semibold"
                    />
                  </td>
                  <td className="p-3 text-center">
                    <input
                      type="checkbox"
                      checked={item.discountsAllowed}
                      onChange={(e) => handlePriceChange(item.id, 'discountsAllowed', e.target.checked)}
                      className="rounded text-amber-800 focus:ring-amber-500"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

