import React, { useState } from 'react';
import {
  FileText,
  Download,
  Printer,
  Calendar,
  Filter,
  BarChart2,
  PieChart,
  Table as TableIcon,
  CheckCircle2,
  Send,
  Clock,
  History,
  Settings,
  Plus
} from 'lucide-react';
import { Language, ReportConfig, GeneratedReportRecord } from '../../types';
import { Button, Input } from '../InteractiveComponents';
import { TiletPattern } from '../TiletPattern';
import { SAMPLE_REPORT_CONFIGS, SAMPLE_REPORT_HISTORY } from './AnalyticsData';

interface ReportBuilderViewProps {
  lang: Language;
  onNavigate: (page: string, params?: any) => void;
  initialMode?: 'builder' | 'history';
}

export function ReportBuilderView({ lang, onNavigate, initialMode = 'builder' }: ReportBuilderViewProps) {
  const [activeTab, setActiveTab] = useState<'builder' | 'history'>(initialMode);
  const [selectedDataSource, setSelectedDataSource] = useState<ReportConfig['dataSource']>('Financial');
  const [selectedVisualization, setSelectedVisualization] = useState<ReportConfig['visualization']>('Table');
  const [selectedBranch, setSelectedBranch] = useState<string>('All Campuses');
  const [selectedDateRange, setSelectedDateRange] = useState<ReportConfig['dateRange']>('This Month');
  const [reportTitle, setReportTitle] = useState('Liora Begena Custom Academy Performance Report');
  const [isExporting, setIsExporting] = useState(false);
  const [reportHistory, setReportHistory] = useState<GeneratedReportRecord[]>(SAMPLE_REPORT_HISTORY);

  const handleGenerateReport = (format: 'PDF' | 'Excel' | 'CSV' | 'Print') => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      const newRecord: GeneratedReportRecord = {
        id: `rh-${Date.now()}`,
        reportTitle: reportTitle || 'Custom Academy Report',
        generatedBy: 'Founder Liora Begena',
        generatedRole: 'Founder',
        generatedDate: new Date().toISOString().replace('T', ' ').substring(0, 16),
        reportType: selectedDataSource,
        status: 'Completed',
        dataPeriod: selectedDateRange,
        filtersApplied: `${selectedBranch} • Format: ${format}`,
        recordsCount: 420
      };
      setReportHistory([newRecord, ...reportHistory]);
      if (format === 'Print') {
        window.print();
      } else {
        alert(`Successfully exported report "${newRecord.reportTitle}" as ${format}!`);
      }
    }, 800);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      {/* HEADER BANNER */}
      <div className="bg-[#2B2B2B] text-white p-6 sm:p-8 rounded-3xl relative overflow-hidden shadow-xl border border-amber-950/40 print:hidden">
        <TiletPattern className="opacity-15 text-[#E89B52] scale-125" />
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E89B52]/20 border border-[#E89B52]/40 text-[#E89B52] text-xs font-bold uppercase tracking-widest">
            <FileText size={14} className="text-[#E89B52]" />
            <span>Custom Report Builder & Scheduled Audits</span>
          </div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-white tracking-wide uppercase">
            REPORT BUILDER & HISTORICAL REPORT ARCHIVE
          </h1>
          <p className="text-xs sm:text-sm text-gray-300">
            Design multi-dimensional custom reports across financial ledgers, student attendance, store inventory, and teacher metrics with instant PDF, Excel, and CSV export.
          </p>
        </div>
      </div>

      {/* TOP NAVIGATION SWITCHER */}
      <div className="flex items-center gap-2 border-b border-[#E7DED1] pb-2 print:hidden">
        <button
          onClick={() => setActiveTab('builder')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'builder' ? 'bg-[#2B2B2B] text-white' : 'bg-[#FAF6EF] text-gray-700 hover:bg-[#E7DED1]'
          }`}
        >
          <Settings size={14} />
          <span>Interactive Report Builder</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'history' ? 'bg-[#2B2B2B] text-white' : 'bg-[#FAF6EF] text-gray-700 hover:bg-[#E7DED1]'
          }`}
        >
          <History size={14} />
          <span>Report Archive & Audit History</span>
        </button>
      </div>

      {/* MODE 1: REPORT BUILDER */}
      {activeTab === 'builder' && (
        <div className="space-y-6">
          <div className="bg-white border border-[#E7DED1] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
            <h3 className="font-display font-black text-base text-[#2B2B2B] uppercase">1. REPORT CONFIGURATION & DATA SOURCE</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 uppercase">Report Title:</label>
                <Input
                  type="text"
                  value={reportTitle}
                  onChange={(e) => setReportTitle(e.target.value)}
                  className="text-xs bg-[#FAF6EF]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 uppercase">Primary Data Source:</label>
                <select
                  value={selectedDataSource}
                  onChange={(e) => setSelectedDataSource(e.target.value as any)}
                  className="w-full p-2.5 bg-[#FAF6EF] border border-[#E7DED1] rounded-xl text-xs font-bold text-[#2B2B2B]"
                >
                  <option value="Financial">Financial Ledgers & Revenue</option>
                  <option value="Students">Student Enrollments & Demographics</option>
                  <option value="Attendance">Class Attendance & Absence Log</option>
                  <option value="Course">Course Completion & Grades</option>
                  <option value="Teacher">Teacher Hours & Student Progress</option>
                  <option value="Branch">Branch Capacity & Growth</option>
                  <option value="Store">Phase 13 Store Sales & Inventory</option>
                </select>
              </div>
            </div>

            {/* FILTERS & DATE RANGES */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 uppercase">Branch Filter:</label>
                <select
                  value={selectedBranch}
                  onChange={(e) => setSelectedBranch(e.target.value)}
                  className="w-full p-2 bg-[#FAF6EF] border border-[#E7DED1] rounded-xl text-xs font-bold text-[#2B2B2B]"
                >
                  <option value="All Campuses">All Campuses (Piazza, Megenagna, Lebu)</option>
                  <option value="Piazza Campus">Piazza Campus Only</option>
                  <option value="Megenagna Campus">Megenagna Campus Only</option>
                  <option value="Lebu Campus">Lebu Campus Only</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 uppercase">Date Range:</label>
                <select
                  value={selectedDateRange}
                  onChange={(e) => setSelectedDateRange(e.target.value as any)}
                  className="w-full p-2 bg-[#FAF6EF] border border-[#E7DED1] rounded-xl text-xs font-bold text-[#2B2B2B]"
                >
                  <option value="This Month">This Month (July 2026)</option>
                  <option value="Last Month">Last Month (June 2026)</option>
                  <option value="This Quarter">This Quarter (Q3 2026)</option>
                  <option value="This Year">This Year (2026)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 uppercase">Visualization Format:</label>
                <select
                  value={selectedVisualization}
                  onChange={(e) => setSelectedVisualization(e.target.value as any)}
                  className="w-full p-2 bg-[#FAF6EF] border border-[#E7DED1] rounded-xl text-xs font-bold text-[#2B2B2B]"
                >
                  <option value="Table">Data Table & Summary Cards</option>
                  <option value="Bar Chart">Bar Chart Comparison</option>
                  <option value="Pie Chart">Distribution Donut Chart</option>
                  <option value="KPI Cards">Executive KPI Cards Only</option>
                </select>
              </div>
            </div>

            {/* PREVIEW CONTAINER */}
            <div className="p-6 bg-[#FAF6EF] border border-[#E7DED1] rounded-2xl space-y-4 text-xs">
              <div className="flex justify-between items-center border-b border-[#E7DED1] pb-2">
                <span className="font-bold text-sm text-[#2B2B2B] uppercase">{reportTitle}</span>
                <span className="text-gray-500 font-mono text-[11px]">{selectedDateRange} • {selectedBranch}</span>
              </div>

              {/* MOCK PREVIEW DATA TABLE */}
              <div className="overflow-x-auto bg-white rounded-xl border border-[#E7DED1] p-3">
                <table className="w-full text-left">
                  <thead className="bg-[#FAF6EF] text-[#2B2B2B] font-bold border-b text-[11px]">
                    <tr>
                      <th className="p-2">Campus</th>
                      <th className="p-2">Metric Category</th>
                      <th className="p-2">Primary Count</th>
                      <th className="p-2">Revenue Total</th>
                      <th className="p-2">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E7DED1] text-[11px] font-mono">
                    <tr>
                      <td className="p-2 font-bold text-[#2B2B2B]">Piazza Campus</td>
                      <td className="p-2">{selectedDataSource} Ledger</td>
                      <td className="p-2">540 Records</td>
                      <td className="p-2 text-emerald-700 font-bold">410,000 ETB</td>
                      <td className="p-2 text-emerald-800 font-bold">Verified</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-bold text-[#2B2B2B]">Megenagna Campus</td>
                      <td className="p-2">{selectedDataSource} Ledger</td>
                      <td className="p-2">380 Records</td>
                      <td className="p-2 text-emerald-700 font-bold">260,000 ETB</td>
                      <td className="p-2 text-emerald-800 font-bold">Verified</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-bold text-[#2B2B2B]">Lebu Campus</td>
                      <td className="p-2">{selectedDataSource} Ledger</td>
                      <td className="p-2">180 Records</td>
                      <td className="p-2 text-emerald-700 font-bold">150,000 ETB</td>
                      <td className="p-2 text-emerald-800 font-bold">Verified</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* EXPORT ACTION BUTTONS */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <span className="text-xs text-gray-500 font-mono">
                Audit Trail: Generated by Founder Liora Begena
              </span>

              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={isExporting}
                  onClick={() => handleGenerateReport('CSV')}
                >
                  <Download size={14} className="mr-1" />
                  <span>CSV</span>
                </Button>

                <Button
                  variant="secondary"
                  size="sm"
                  disabled={isExporting}
                  onClick={() => handleGenerateReport('Excel')}
                >
                  <Download size={14} className="mr-1" />
                  <span>Excel</span>
                </Button>

                <Button
                  variant="secondary"
                  size="sm"
                  disabled={isExporting}
                  onClick={() => handleGenerateReport('Print')}
                >
                  <Printer size={14} className="mr-1" />
                  <span>Print</span>
                </Button>

                <Button
                  variant="primary"
                  size="sm"
                  disabled={isExporting}
                  onClick={() => handleGenerateReport('PDF')}
                >
                  <Download size={14} className="mr-1" />
                  <span>Export PDF Report</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODE 2: REPORT HISTORY */}
      {activeTab === 'history' && (
        <div className="bg-white border border-[#E7DED1] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
          <h3 className="font-display font-black text-base text-[#2B2B2B] uppercase">REPORT ARCHIVE & AUDIT LOG</h3>

          <div className="space-y-3">
            {reportHistory.map((rh) => (
              <div key={rh.id} className="p-4 bg-[#FAF6EF] border border-[#E7DED1] rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs">
                <div className="space-y-1">
                  <span className="font-bold text-sm text-[#2B2B2B] block">{rh.reportTitle}</span>
                  <div className="flex items-center gap-2 text-gray-500 font-mono text-[10px]">
                    <span>Generated by: {rh.generatedBy} ({rh.generatedRole})</span>
                    <span>• {rh.generatedDate}</span>
                  </div>
                  <span className="text-[11px] text-gray-600 block">Period: {rh.dataPeriod} | Filters: {rh.filtersApplied}</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-bold rounded-full text-[10px]">
                    {rh.status} ({rh.recordsCount} Rows)
                  </span>
                  <button className="p-2 bg-white border border-[#E7DED1] rounded-xl text-gray-700 hover:bg-stone-100 cursor-pointer">
                    <Download size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

