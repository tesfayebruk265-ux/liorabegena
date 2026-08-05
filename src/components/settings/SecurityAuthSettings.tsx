import React, { useState } from 'react';
import { ShieldCheck, Lock, Smartphone, Key, Monitor, AlertTriangle, CheckCircle2, ShieldAlert, LogOut } from 'lucide-react';

export const SecurityAuthSettings: React.FC = () => {
  const [mfaEnforced, setMfaEnforced] = useState(true);
  const [passwordMinLength, setPasswordMinLength] = useState(10);
  const [passwordRequireSpecialChar, setPasswordRequireSpecialChar] = useState(true);
  const [bruteForceLockout, setBruteForceLockout] = useState(5);
  const [sessionTimeoutMins, setSessionTimeoutMins] = useState(60);
  const [saved, setSaved] = useState(false);

  const [activeSessions, setActiveSessions] = useState([
    {
      id: 'SES-01',
      device: 'MacBook Pro 16" (Chrome 126)',
      location: 'Addis Ababa, Ethiopia (197.156.104.18)',
      isCurrent: true,
      loginTime: 'Today at 08:30 AM'
    },
    {
      id: 'SES-02',
      device: 'Samsung Galaxy S24 Ultra (Android App)',
      location: 'Addis Ababa, Ethiopia (102.215.88.40)',
      isCurrent: false,
      loginTime: 'Yesterday at 06:12 PM'
    }
  ]);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleTerminateOtherSessions = () => {
    setActiveSessions((prev) => prev.filter((s) => s.isCurrent));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-amber-100 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-neutral-800 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-amber-700" /> Authentication, Session & Multi-Factor Security
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            Configure MFA rules, brute-force lockout thresholds, active browser sessions, and password policies.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-colors flex items-center gap-2 shadow-sm shrink-0 cursor-pointer"
        >
          {saved ? <CheckCircle2 className="w-4 h-4 text-emerald-300" /> : <Lock className="w-4 h-4" />}
          {saved ? 'Security Saved!' : 'Save Security Rules'}
        </button>
      </div>

      {saved && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs rounded-2xl flex items-center gap-2 font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          Security settings and authentication policies updated.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* MFA & Password Policy */}
        <div className="bg-white p-6 rounded-2xl border border-amber-100 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-neutral-800 border-b pb-2 flex items-center gap-2">
            <Key className="w-4 h-4 text-amber-700" /> Password & Multi-Factor Authentication
          </h3>

          <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 flex items-center justify-between">
            <div>
              <span className="font-bold text-amber-900 text-xs block">Enforce MFA for Executive Roles</span>
              <span className="text-[11px] text-amber-700">Required for Admin, Super Admin, Founder, Accountant</span>
            </div>
            <input
              type="checkbox"
              checked={mfaEnforced}
              onChange={(e) => setMfaEnforced(e.target.checked)}
              className="w-4 h-4 text-amber-800 rounded focus:ring-amber-500 cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="font-bold text-neutral-700 block mb-1">Minimum Password Length</label>
              <input
                type="number"
                value={passwordMinLength}
                onChange={(e) => setPasswordMinLength(Number(e.target.value))}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 font-bold focus:outline-none"
              />
            </div>
            <div>
              <label className="font-bold text-neutral-700 block mb-1">Max Failed Attempts (Lockout)</label>
              <input
                type="number"
                value={bruteForceLockout}
                onChange={(e) => setBruteForceLockout(Number(e.target.value))}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 font-bold focus:outline-none"
              />
            </div>
          </div>

          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between text-xs">
            <span className="font-bold text-neutral-700">Require Special Character & Number</span>
            <input
              type="checkbox"
              checked={passwordRequireSpecialChar}
              onChange={(e) => setPasswordRequireSpecialChar(e.target.checked)}
              className="w-4 h-4 text-amber-800 rounded focus:ring-amber-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Active Session Management */}
        <div className="bg-white p-6 rounded-2xl border border-amber-100 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b pb-2">
            <h3 className="text-sm font-bold text-neutral-800 flex items-center gap-2">
              <Monitor className="w-4 h-4 text-amber-700" /> Active Sessions & Device Management
            </h3>
            <button
              onClick={handleTerminateOtherSessions}
              className="text-[11px] font-bold text-red-700 bg-red-50 hover:bg-red-100 px-2.5 py-1 rounded-lg border border-red-200 flex items-center gap-1 cursor-pointer"
            >
              <LogOut className="w-3 h-3" /> Terminate Other Sessions
            </button>
          </div>

          <div className="space-y-3">
            {activeSessions.map((s) => (
              <div key={s.id} className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 text-xs flex justify-between items-center">
                <div>
                  <div className="font-bold text-neutral-800 flex items-center gap-1.5">
                    {s.device}
                    {s.isCurrent && (
                      <span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-1.5 py-0.5 rounded">
                        This Device
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-neutral-500 mt-0.5">{s.location}</div>
                  <div className="text-[10px] text-neutral-400 mt-0.5">Logged in: {s.loginTime}</div>
                </div>

                {!s.isCurrent && (
                  <button
                    onClick={() => setActiveSessions((prev) => prev.filter((x) => x.id !== s.id))}
                    className="text-[10px] font-bold text-red-700 bg-white border border-stone-200 px-2 py-1 rounded hover:bg-stone-100"
                  >
                    Log Out
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

