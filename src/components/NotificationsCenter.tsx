import React, { useState } from 'react';
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  Settings,
  Smartphone,
  Send as TelegramIcon,
  Mail,
  Shield,
  MessageSquare,
  CreditCard,
  Calendar,
  Award,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Radio,
  Sliders
} from 'lucide-react';
import { motion } from 'motion/react';
import { Notification, PageId, Language } from '../types';
import { useAuth } from '../context/AuthContext';

interface NotificationsCenterProps {
  onNavigate: (page: PageId, params?: any) => void;
  lang: Language;
  initialTab?: 'inbox' | 'preferences';
}

export function NotificationsCenter({ onNavigate, lang, initialTab = 'inbox' }: NotificationsCenterProps) {
  const { notifications, markAsRead, clearNotifications, addNotification, currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'inbox' | 'preferences'>(initialTab);

  if (!currentUser) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 bg-amber-100 text-amber-900 rounded-full flex items-center justify-center mx-auto mb-4">
          <Bell className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-stone-900">Sign In Required</h2>
        <p className="text-stone-600 mt-2 text-sm max-w-md mx-auto">
          Please sign in to your student, teacher, or administrative account to view your personalized notification center and channel preferences.
        </p>
        <button
          onClick={() => onNavigate('login')}
          className="mt-6 px-6 py-2.5 bg-amber-800 text-white font-bold rounded-xl text-sm hover:bg-amber-900 transition cursor-pointer"
        >
          Sign In to Your Account
        </button>
      </div>
    );
  }

  // Preference Matrix State
  const [prefs, setPrefs] = useState({
    messages: { push: true, sms: false, telegram: true, email: true },
    payments: { push: true, sms: true, telegram: true, email: true },
    attendance: { push: true, sms: true, telegram: false, email: false },
    assignments: { push: true, sms: false, telegram: true, email: true },
    announcements: { push: true, sms: true, telegram: true, email: true },
    teacherFeedback: { push: true, sms: false, telegram: true, email: true }
  });

  // Telegram Link Simulator State
  const [telegramStatus, setTelegramStatus] = useState<'Linked' | 'Not Linked'>('Linked');
  const [telegramCode, setTelegramCode] = useState('AB-9942');

  const handleTogglePref = (category: keyof typeof prefs, channel: 'push' | 'sms' | 'telegram' | 'email') => {
    setPrefs((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [channel]: !prev[category][channel]
      }
    }));
    addNotification('Notification channel preferences saved.', 'system');
  };

  const handleTestSMS = () => {
    addNotification('Test SMS sent to +251 91 123 4567: "Liora Begena: Your notification channels are active."', 'system');
  };

  const handleTestTelegram = () => {
    addNotification('Test Telegram alert sent to @liyora_begena successfully.', 'system');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-semibold tracking-wide uppercase">
              Notifications & Multi-Channel Center
            </span>
            <span className="text-xs text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              Web Push • SMS • Telegram • Email
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-amber-950 mt-1">
            Notification Hub & Channel Preferences
          </h1>
          <p className="text-sm text-stone-600 mt-0.5">
            Manage your real-time alerts, telegram updates, and SMS emergency notifications.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl border border-stone-200 text-xs">
          <button
            onClick={() => setActiveTab('inbox')}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              activeTab === 'inbox' ? 'bg-amber-800 text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Notification Inbox ({notifications.filter((n) => !n.isRead).length} unread)
          </button>
          <button
            onClick={() => setActiveTab('preferences')}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              activeTab === 'preferences' ? 'bg-amber-800 text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Channel Preferences
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 1. NOTIFICATION INBOX TAB */}
      {/* ========================================================= */}
      {activeTab === 'inbox' && (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-stone-50/50 text-xs">
            <span className="font-bold text-stone-800">
              Recent Alerts ({notifications.length} Total)
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={clearNotifications}
                className="flex items-center gap-1 text-stone-500 hover:text-red-600 transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear All
              </button>
            </div>
          </div>

          <div className="divide-y divide-stone-100">
            {notifications.length === 0 ? (
              <div className="p-12 text-center text-stone-400">
                <Bell className="w-10 h-10 mx-auto text-stone-300 mb-2" />
                <p className="text-xs font-semibold text-stone-700">You're all caught up!</p>
                <p className="text-[11px] text-stone-400 mt-1">No pending notifications at this moment.</p>
              </div>
            ) : (
              notifications.map((notif, idx) => (
                <div
                  key={notif.id ? `${notif.id}_${idx}` : `notif_${idx}`}
                  onClick={() => markAsRead(notif.id)}
                  className={`p-4 flex items-start gap-3.5 cursor-pointer transition ${
                    !notif.isRead ? 'bg-amber-50/70 border-l-4 border-amber-800' : 'hover:bg-stone-50'
                  }`}
                >
                  <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center shrink-0 mt-0.5">
                    <Bell className="w-4 h-4" />
                  </div>

                  <div className="flex-1 text-xs">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-stone-900">{notif.title}</h4>
                      <span className="text-[10px] text-stone-400">{notif.timestamp}</span>
                    </div>

                    <p className="text-stone-600 mt-0.5 leading-relaxed">{notif.description}</p>

                    <div className="mt-1.5 flex items-center gap-2">
                      <span className="px-2 py-0.2 bg-stone-100 text-stone-700 font-bold rounded uppercase text-[9px]">
                        {notif.category}
                      </span>
                      {!notif.isRead && (
                        <span className="text-[10px] text-amber-800 font-semibold">● Unread</span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. CHANNEL PREFERENCES TAB */}
      {/* ========================================================= */}
      {activeTab === 'preferences' && (
        <div className="space-y-6">
          {/* External Integrations Cards (Telegram & SMS) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Telegram Integration Card */}
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-sky-500 text-white flex items-center justify-center shadow-xs">
                    <TelegramIcon className="w-5 h-5 ml-0.5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-stone-900">Telegram Bot Notifications</h3>
                    <p className="text-[11px] text-stone-500">@liyora_begena</p>
                  </div>
                </div>

                <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded-full text-[10px]">
                  {telegramStatus}
                </span>
              </div>

              <p className="text-stone-600 leading-relaxed">
                Receive instant class schedule changes, teacher announcements, and payment verification alerts directly on Telegram.
              </p>

              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
                <div className="text-stone-500 text-[10px]">Verification Code:</div>
                <div className="font-mono font-bold text-amber-900 text-sm tracking-wider">{telegramCode}</div>
                <p className="text-[10px] text-stone-400">Send this code to `@liyora_begena` on Telegram to link.</p>
              </div>

              <button
                onClick={handleTestTelegram}
                className="w-full py-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg shadow-xs transition"
              >
                Send Test Telegram Notification
              </button>
            </div>

            {/* SMS Emergency Integration Card */}
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-amber-800 text-white flex items-center justify-center shadow-xs">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-stone-900">SMS Emergency & Payment Alerts</h3>
                    <p className="text-[11px] text-stone-500">+251 91 123 4567 (Verified)</p>
                  </div>
                </div>

                <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded-full text-[10px]">
                  Active
                </span>
              </div>

              <p className="text-stone-600 leading-relaxed">
                SMS is used exclusively for urgent branch schedule changes, payment receipts, and emergency school notices.
              </p>

              <button
                onClick={handleTestSMS}
                className="w-full py-2 bg-amber-800 hover:bg-amber-900 text-white font-semibold rounded-lg shadow-xs transition"
              >
                Dispatch Test SMS Message
              </button>
            </div>
          </div>

          {/* Matrix of Preferences */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-4 text-xs">
            <h3 className="font-bold text-sm text-stone-900">Notification Channel Matrix</h3>
            <p className="text-stone-500">Control which channels deliver alerts for each category.</p>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-stone-200 text-stone-500 text-[11px]">
                    <th className="py-2.5 font-bold">Category</th>
                    <th className="py-2.5 font-bold text-center">In-App / Push</th>
                    <th className="py-2.5 font-bold text-center">Telegram</th>
                    <th className="py-2.5 font-bold text-center">SMS</th>
                    <th className="py-2.5 font-bold text-center">Email</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {(
                    [
                      { key: 'messages', label: 'Direct & Group Messages' },
                      { key: 'payments', label: 'Payment Receipts & Status' },
                      { key: 'attendance', label: 'Student Absence Alerts' },
                      { key: 'assignments', label: 'Grades & Assignment Reviews' },
                      { key: 'announcements', label: 'School Announcements' },
                      { key: 'teacherFeedback', label: 'Teacher Practice Feedback' }
                    ] as const
                  ).map((item) => (
                    <tr key={item.key} className="hover:bg-stone-50">
                      <td className="py-3 font-semibold text-stone-800">{item.label}</td>
                      {(['push', 'telegram', 'sms', 'email'] as const).map((ch) => (
                        <td key={ch} className="py-3 text-center">
                          <input
                            type="checkbox"
                            checked={prefs[item.key][ch]}
                            onChange={() => handleTogglePref(item.key, ch)}
                            className="w-4 h-4 text-amber-800 rounded border-stone-300 focus:ring-amber-500 cursor-pointer"
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

