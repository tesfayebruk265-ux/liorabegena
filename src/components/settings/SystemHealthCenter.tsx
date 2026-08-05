import React, { useState } from 'react';
import { Activity, Server, Database, Zap, AlertTriangle, CheckCircle2, Clock, ShieldAlert, ToggleLeft, ToggleRight, RefreshCw } from 'lucide-react';
import { SystemHealthItem, BackgroundJobItem, INITIAL_HEALTH_ITEMS, INITIAL_BACKGROUND_JOBS } from './SettingsData';

export const SystemHealthCenter: React.FC = () => {
  const [healthItems, setHealthItems] = useState<SystemHealthItem[]>(INITIAL_HEALTH_ITEMS);
  const [jobs, setJobs] = useState<BackgroundJobItem[]>(INITIAL_BACKGROUND_JOBS);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  // Feature Flags State
  const [featureFlags, setFeatureFlags] = useState([
    { id: 'FF-01', name: 'Server-Side Gemini AI Assistant', enabled: true, category: 'AI Engine' },
    { id: 'FF-02', name: 'Telebirr Online Express Checkout', enabled: true, category: 'Payment' },
    { id: 'FF-03', name: 'Interactive Music Studio Pitch Detector', enabled: true, category: 'LMS Studio' },
    { id: 'FF-04', name: 'Public Community Forum Posting', enabled: true, category: 'Community' }
  ]);

  const toggleFeatureFlag = (id: string) => {
    setFeatureFlags((prev) => prev.map((f) => (f.id === id ? { ...f, enabled: !f.enabled } : f)));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-amber-100 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-neutral-800 flex items-center gap-2">
            <Activity className="w-6 h-6 text-amber-700" /> System Health, Background Worker Jobs & Maintenance Mode
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            Real-time status monitoring, background queue inspection, and feature flag management.
          </p>
        </div>

        {/* Maintenance Mode Toggle */}
        <div className="flex items-center gap-3 bg-amber-50 p-3 rounded-2xl border border-amber-200">
          <div>
            <span className="font-bold text-neutral-800 text-xs block">Maintenance Mode</span>
            <span className="text-[10px] text-neutral-500">Emergency admin override page</span>
          </div>

          <button
            onClick={() => setMaintenanceMode((prev) => !prev)}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-colors cursor-pointer ${
              maintenanceMode ? 'bg-red-800 text-white' : 'bg-stone-200 text-neutral-700 hover:bg-stone-300'
            }`}
          >
            {maintenanceMode ? 'MAINTENANCE ACTIVE' : 'System Live'}
          </button>
        </div>
      </div>

      {maintenanceMode && (
        <div className="p-4 bg-red-100 border border-red-300 text-red-900 text-xs rounded-2xl flex items-center gap-3 font-bold">
          <AlertTriangle className="w-5 h-5 text-red-700 shrink-0" />
          SYSTEM MAINTENANCE MODE ACTIVE: Public visitors see friendly maintenance page. Super Admins retain full emergency backend access.
        </div>
      )}

      {/* Health Indicators Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-amber-100 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-neutral-800 border-b pb-2 flex items-center gap-2">
            <Server className="w-4 h-4 text-amber-700" /> Service Status & Latency Monitors
          </h3>

          <div className="space-y-3">
            {healthItems.map((item, idx) => (
              <div key={idx} className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 text-xs space-y-1">
                <div className="flex justify-between items-center font-bold text-neutral-800">
                  <span>{item.component}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-100 text-emerald-800 font-bold">
                    {item.status}
                  </span>
                </div>
                <div className="text-[11px] text-neutral-500 font-mono flex justify-between pt-1">
                  <span>Latency: {item.latencyMs}ms</span>
                  <span>Uptime: {item.uptimePercent}%</span>
                  <span>Checked: {item.lastChecked}</span>
                </div>
                <div className="text-[10px] text-neutral-400 mt-0.5">{item.details}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Feature Flags */}
        <div className="bg-white rounded-2xl p-6 border border-amber-100 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-neutral-800 border-b pb-2 flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-700" /> Granular Feature Flags
          </h3>

          <div className="space-y-3">
            {featureFlags.map((flag) => (
              <div key={flag.id} className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 text-xs flex justify-between items-center">
                <div>
                  <div className="font-bold text-neutral-800">{flag.name}</div>
                  <div className="text-[10px] text-neutral-400 font-mono mt-0.5">{flag.category}</div>
                </div>

                <button
                  onClick={() => toggleFeatureFlag(flag.id)}
                  className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-colors ${
                    flag.enabled
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-stone-300 text-stone-700'
                  }`}
                >
                  {flag.enabled ? 'Enabled' : 'Disabled'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Background Jobs Queue */}
      <div className="bg-white rounded-2xl p-6 border border-amber-100 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-neutral-800 border-b pb-2 flex items-center gap-2">
          <Clock className="w-4 h-4 text-amber-700" /> Background Jobs & Async Queue Workers
        </h3>

        <div className="space-y-3">
          {jobs.map((job) => (
            <div key={job.id} className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 text-xs flex justify-between items-center">
              <div>
                <div className="font-bold text-neutral-800 text-sm">{job.jobName}</div>
                <div className="text-[11px] text-neutral-500 font-mono mt-0.5">
                  Queue: {job.queue} | Attempt: {job.attempt} | Created: {job.createdAt}
                </div>
              </div>

              <span
                className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                  job.status === 'Completed'
                    ? 'bg-emerald-100 text-emerald-800'
                    : job.status === 'Running'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {job.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

