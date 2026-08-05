import React, { useState } from 'react';
import { FileText, ShieldAlert, History, Search, Filter, Lock, CheckCircle2, RotateCcw, ShieldCheck, Download } from 'lucide-react';
import { SystemAuditLog, INITIAL_AUDIT_LOGS } from './SettingsData';

export const AuditLogsSecurityCenter: React.FC = () => {
  const [logs, setLogs] = useState<SystemAuditLog[]>(INITIAL_AUDIT_LOGS);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState('All');

  // Soft Delete Recovery Queue State
  const [softDeletedItems, setSoftDeletedItems] = useState([
    { id: 'DEL-8812', type: 'Student Enrollment Record', name: 'Yared Tadesse (Begena L1)', deletedBy: 'Registration Staff', deletedAt: '2026-07-20 03:14 PM' },
    { id: 'DEL-8813', type: 'Archived Course Document', name: 'Zema Notation Sheet #4', deletedBy: 'Teacher Abel', deletedAt: '2026-07-19 11:20 AM' }
  ]);

  const [restoredMessage, setRestoredMessage] = useState<string | null>(null);

  const filteredLogs = logs.filter((l) => {
    const matchesSearch =
      l.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.resource.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAction = actionFilter === 'All' || l.action.includes(actionFilter);
    return matchesSearch && matchesAction;
  });

  const handleRestoreRecord = (id: string, name: string) => {
    setSoftDeletedItems((prev) => prev.filter((item) => item.id !== id));
    setRestoredMessage(`Record "${name}" successfully restored from soft-delete archive!`);

    // Add immutable restoration audit log
    const restoreAudit: SystemAuditLog = {
      id: `AUD-${Date.now()}`,
      user: 'Super Admin',
      role: 'Super Admin',
      action: 'DATA_RESTORE',
      resource: 'SoftDeleteVault',
      resourceId: id,
      timestamp: new Date().toLocaleString(),
      ipAddress: '197.156.104.18',
      device: 'Chrome / macOS',
      previousValue: 'Status: Soft Deleted',
      newValue: 'Status: Restored & Re-indexed',
      isImmutable: true
    };
    setLogs((prev) => [restoreAudit, ...prev]);

    setTimeout(() => setRestoredMessage(null), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-amber-100 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-neutral-800 flex items-center gap-2">
            <FileText className="w-6 h-6 text-amber-700" /> Immutable Audit Logs & Soft-Delete Recovery Center
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            Complete tamper-proof audit trail for user provisioning, payment approvals, grade edits, settings changes, and data restoration.
          </p>
        </div>

        <button className="bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer">
          <Download className="w-4 h-4" /> Export CSV Audit Log
        </button>
      </div>

      {restoredMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs rounded-2xl flex items-center gap-2 font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          {restoredMessage}
        </div>
      )}

      {/* Soft Delete Recovery Queue */}
      {softDeletedItems.length > 0 && (
        <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200 shadow-sm space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-amber-900 flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-amber-800" /> Soft-Deleted Records Vault ({softDeletedItems.length})
            </h3>
            <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300">
              Recoverable by Super Admin
            </span>
          </div>

          <div className="space-y-2">
            {softDeletedItems.map((item) => (
              <div key={item.id} className="p-3 bg-white rounded-xl border border-amber-200 text-xs flex justify-between items-center">
                <div>
                  <span className="font-bold text-neutral-800">{item.name}</span>
                  <span className="text-[10px] text-neutral-400 block font-mono">
                    Type: {item.type} | Deleted by: {item.deletedBy} ({item.deletedAt})
                  </span>
                </div>

                <button
                  onClick={() => handleRestoreRecord(item.id, item.name)}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 shrink-0 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Restore
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-2xl border border-amber-100 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search audit logs by user, action, resource..."
            className="w-full bg-stone-50 border border-stone-300 rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-xs font-bold text-neutral-600 shrink-0">Filter Action:</span>
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="bg-stone-50 border border-stone-300 rounded-xl text-xs px-3 py-2 font-semibold focus:outline-none"
          >
            <option value="All">All Actions</option>
            <option value="SETTINGS_UPDATE">Settings Update</option>
            <option value="PAYMENT_APPROVE">Payment Approval</option>
            <option value="TELEGRAM_ALERT_DISPATCH">Telegram Alert</option>
            <option value="DATA_RESTORE">Data Restoration</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-2xl border border-amber-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50 text-neutral-600 font-bold">
                <th className="p-3.5">Log ID & Time</th>
                <th className="p-3.5">User & Role</th>
                <th className="p-3.5">Action Event</th>
                <th className="p-3.5">Target Resource</th>
                <th className="p-3.5">Data Change Delta (Before / After)</th>
                <th className="p-3.5 text-right">Integrity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-mono text-[11px]">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-amber-50/30">
                  <td className="p-3.5">
                    <div className="font-bold text-neutral-800">{log.id}</div>
                    <div className="text-[10px] text-neutral-400">{log.timestamp}</div>
                  </td>
                  <td className="p-3.5 font-sans">
                    <div className="font-bold text-neutral-800 text-xs">{log.user}</div>
                    <div className="text-[10px] text-amber-900 font-semibold">{log.role}</div>
                  </td>
                  <td className="p-3.5">
                    <span className="bg-stone-100 font-bold text-neutral-800 px-2 py-0.5 rounded text-[10px]">
                      {log.action}
                    </span>
                  </td>
                  <td className="p-3.5 text-neutral-700">
                    {log.resource} ({log.resourceId})
                  </td>
                  <td className="p-3.5">
                    <div className="text-red-700 text-[10px]">Prev: {log.previousValue || 'N/A'}</div>
                    <div className="text-emerald-700 font-bold text-[10px]">New: {log.newValue || 'N/A'}</div>
                  </td>
                  <td className="p-3.5 text-right">
                    <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[9px] flex items-center gap-1 justify-end">
                      <Lock className="w-3 h-3 text-emerald-600" /> Append-Only Immutable
                    </span>
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

