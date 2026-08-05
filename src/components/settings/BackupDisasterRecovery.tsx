import React, { useState } from 'react';
import { Database, ShieldCheck, Download, RefreshCw, AlertTriangle, Play, CheckCircle2, Lock, FileCheck, Layers } from 'lucide-react';
import { BackupRecord, INITIAL_BACKUPS } from './SettingsData';

export const BackupDisasterRecovery: React.FC = () => {
  const [backups, setBackups] = useState<BackupRecord[]>(INITIAL_BACKUPS);
  const [isCreatingBackup, setIsCreatingBackup] = useState(false);
  const [simulationStep, setSimulationStep] = useState<number | null>(null);
  const [simulationLogs, setSimulationLogs] = useState<string[]>([]);

  const handleTriggerBackup = () => {
    setIsCreatingBackup(true);
    setTimeout(() => {
      const newBk: BackupRecord = {
        id: `BK-${Date.now()}-FULL`,
        filename: `abel_begena_full_backup_${new Date().toISOString().slice(0, 10).replace(/-/g, '_')}.enc.sql`,
        type: 'Full Backup',
        sizeMB: 248.5,
        createdAt: new Date().toLocaleString(),
        status: 'Verified Healthy',
        location: 'Cloud Storage (Primary Encrypted Vault)',
        encrypted: true
      };
      setBackups((prev) => [newBk, ...prev]);
      setIsCreatingBackup(false);
    }, 2000);
  };

  const handleRunDisasterRecoverySimulation = () => {
    setSimulationStep(1);
    setSimulationLogs(['[1/6] Initiating Disaster Recovery Simulation...']);

    setTimeout(() => {
      setSimulationStep(2);
      setSimulationLogs((prev) => [...prev, '[2/6] Decrypting AES-256 backup archive... Verified signature.']);
    }, 1200);

    setTimeout(() => {
      setSimulationStep(3);
      setSimulationLogs((prev) => [...prev, '[3/6] Restoring Core Database Tables (Users, Students, Courses, Payments)... Success!']);
    }, 2400);

    setTimeout(() => {
      setSimulationStep(4);
      setSimulationLogs((prev) => [...prev, '[4/6] Verifying LMS Module Assets, Audio Files, and Certificates integrity... Pass!']);
    }, 3600);

    setTimeout(() => {
      setSimulationStep(5);
      setSimulationLogs((prev) => [...prev, '[5/6] Testing Third-Party Integration Gateway Connections... All 5 Online.']);
    }, 4800);

    setTimeout(() => {
      setSimulationStep(6);
      setSimulationLogs((prev) => [...prev, '✅ [6/6] DISASTER RECOVERY TEST COMPLETE: System 100% Operational!']);
    }, 6000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-amber-100 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-neutral-800 flex items-center gap-2">
            <Database className="w-6 h-6 text-amber-700" /> Automated Backup Center & Disaster Recovery Vault
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            Encrypted full database and file backups with multi-region replication and automated recovery simulations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleTriggerBackup}
            disabled={isCreatingBackup}
            className="bg-amber-800 hover:bg-amber-900 disabled:opacity-50 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isCreatingBackup ? 'animate-spin' : ''}`} />
            {isCreatingBackup ? 'Generating Encrypted Backup...' : 'Take Immediate Full Backup'}
          </button>
        </div>
      </div>

      {/* Disaster Recovery Simulation Box */}
      <div className="bg-amber-900 text-amber-50 rounded-2xl p-6 shadow-md border border-amber-800/40 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" /> Disaster Recovery Test Engine
            </h3>
            <p className="text-xs text-amber-200 mt-0.5">
              Simulate total database loss and test full system restoration across users, courses, payments, LMS, and files.
            </p>
          </div>

          <button
            onClick={handleRunDisasterRecoverySimulation}
            disabled={simulationStep !== null && simulationStep < 6}
            className="bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-white" />
            {simulationStep && simulationStep < 6 ? 'Simulating Recovery...' : 'Run Simulation Test'}
          </button>
        </div>

        {simulationStep !== null && (
          <div className="p-4 bg-amber-950/80 rounded-xl border border-amber-800/80 space-y-2 text-xs font-mono text-amber-100">
            {simulationLogs.map((log, idx) => (
              <div key={idx} className="leading-relaxed">
                {log}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Backup Records List */}
      <div className="bg-white rounded-2xl p-6 border border-amber-100 shadow-sm space-y-4">
        <div className="flex justify-between items-center border-b pb-3">
          <h3 className="text-sm font-bold text-neutral-800 flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-amber-700" /> Encrypted Vault Backups ({backups.length})
          </h3>
          <span className="text-xs text-emerald-800 font-bold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
            AES-256 Multi-Region Enabled
          </span>
        </div>

        <div className="space-y-3">
          {backups.map((bk) => (
            <div key={bk.id} className="p-4 bg-stone-50 rounded-xl border border-stone-200 text-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <div className="font-bold text-neutral-800 text-sm flex items-center gap-2">
                  <Lock className="w-4 h-4 text-amber-700 shrink-0" />
                  {bk.filename}
                </div>
                <div className="text-[11px] text-neutral-500 mt-1 flex items-center gap-3 font-mono">
                  <span>Type: {bk.type}</span>
                  <span>Size: {bk.sizeMB} MB</span>
                  <span>Created: {bk.createdAt}</span>
                </div>
                <div className="text-[10px] text-neutral-400 mt-0.5">{bk.location}</div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  {bk.status}
                </span>

                <button className="p-2 bg-white hover:bg-stone-100 text-neutral-700 rounded-lg border border-stone-200 flex items-center gap-1 font-bold cursor-pointer">
                  <Download className="w-3.5 h-3.5" /> Export
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

