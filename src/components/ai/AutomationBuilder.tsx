import React, { useState } from 'react';
import {
  Sparkles,
  Zap,
  Plus,
  Play,
  Pause,
  CheckCircle2,
  Clock,
  Send,
  Bell,
  MessageSquare,
  Mail,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { AutomationRule } from '../../types';
import { SAMPLE_AUTOMATION_RULES } from './AiData';

export const AutomationBuilder: React.FC = () => {
  const [rules, setRules] = useState<AutomationRule[]>(SAMPLE_AUTOMATION_RULES);
  const [showNewRuleModal, setShowNewRuleModal] = useState(false);

  // New Rule Form
  const [ruleName, setRuleName] = useState('');
  const [ruleTrigger, setRuleTrigger] = useState('Student Attendance Recorded');
  const [ruleCondition, setRuleCondition] = useState('Unexcused Absence >= 2');
  const [ruleAction, setRuleAction] = useState('Send Telegram Alert');
  const [ruleChannel, setRuleChannel] = useState<'Notification' | 'SMS' | 'Telegram' | 'Task' | 'Email'>('Telegram');
  const [ruleApproval, setRuleApproval] = useState(false);

  const toggleRuleStatus = (id: string) => {
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: r.status === 'Active' ? 'Paused' : 'Active' } : r))
    );
  };

  const handleCreateRule = () => {
    if (!ruleName.trim()) return;
    const newRule: AutomationRule = {
      id: `AUTO-${Date.now()}`,
      name: ruleName,
      trigger: ruleTrigger,
      condition: ruleCondition,
      action: ruleAction,
      targetChannel: ruleChannel,
      status: 'Active',
      requiresHumanApproval: ruleApproval,
      triggerCount: 0,
      lastTriggered: 'Just created'
    };

    setRules((prev) => [newRule, ...prev]);
    setShowNewRuleModal(false);
    setRuleName('');
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-amber-900 text-amber-50 rounded-2xl p-6 shadow-md border border-amber-800/40 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-700/80 text-amber-100 border border-amber-600/50 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-300" /> Automation Engine
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-950/60 text-amber-200 border border-amber-800">
              Smart Trigger Rules
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Smart Notification Automation & Rule Builder</h1>
          <p className="text-sm text-amber-200 mt-1">
            Build automated rules for student absenteeism alerts, tuition reminders, certificate approvals, and operational tasks.
          </p>
        </div>

        <button
          onClick={() => setShowNewRuleModal(true)}
          className="bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-colors flex items-center gap-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" /> Create Custom Rule
        </button>
      </div>

      {/* Rules List */}
      <div className="bg-white rounded-2xl p-6 border border-amber-100 shadow-sm space-y-4">
        <div className="flex justify-between items-center pb-3 border-b border-neutral-100">
          <h3 className="text-base font-bold text-neutral-800 flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-700" /> Active Automation Workflows ({rules.length})
          </h3>
          <span className="text-xs text-neutral-500 font-medium">System status: Operational</span>
        </div>

        <div className="space-y-3">
          {rules.map((rule) => (
            <div
              key={rule.id}
              className={`p-4 rounded-xl border transition-all ${
                rule.status === 'Active'
                  ? 'bg-stone-50 border-stone-200'
                  : 'bg-stone-100/60 border-stone-200 opacity-60'
              }`}
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div className="flex items-center gap-2">
                  <span className="p-2 bg-amber-100 text-amber-900 rounded-lg shrink-0">
                    {rule.targetChannel === 'Telegram' && <MessageSquare className="w-4 h-4" />}
                    {rule.targetChannel === 'SMS' && <Send className="w-4 h-4" />}
                    {rule.targetChannel === 'Notification' && <Bell className="w-4 h-4" />}
                    {rule.targetChannel === 'Email' && <Mail className="w-4 h-4" />}
                    {rule.targetChannel === 'Task' && <Clock className="w-4 h-4" />}
                  </span>
                  <div>
                    <h4 className="font-bold text-neutral-800 text-sm">{rule.name}</h4>
                    <p className="text-xs text-neutral-500 font-mono">{rule.id}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {rule.requiresHumanApproval && (
                    <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-amber-700" /> Human Approval Required
                    </span>
                  )}

                  <button
                    onClick={() => toggleRuleStatus(rule.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                      rule.status === 'Active'
                        ? 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                        : 'bg-stone-300 text-neutral-700 hover:bg-stone-400'
                    }`}
                  >
                    {rule.status === 'Active' ? 'Pause Rule' : 'Activate Rule'}
                  </button>
                </div>
              </div>

              {/* Workflow Formula */}
              <div className="mt-3 pt-3 border-t border-stone-200/80 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                <div className="bg-white p-2.5 rounded-lg border border-stone-200">
                  <span className="font-bold text-neutral-400 text-[10px] uppercase block">Trigger</span>
                  <span className="font-medium text-neutral-800">{rule.trigger}</span>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-stone-200">
                  <span className="font-bold text-neutral-400 text-[10px] uppercase block">Condition</span>
                  <span className="font-medium text-neutral-800">{rule.condition}</span>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-stone-200">
                  <span className="font-bold text-neutral-400 text-[10px] uppercase block">Action</span>
                  <span className="font-medium text-neutral-800">{rule.action}</span>
                </div>
              </div>

              <div className="mt-2 text-[11px] text-neutral-500 flex justify-between">
                <span>Triggered {rule.triggerCount} times</span>
                <span>Last executed: {rule.lastTriggered}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* New Rule Modal */}
      {showNewRuleModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl">
            <h3 className="font-bold text-neutral-800 text-lg flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-700" /> Create Custom Automation Rule
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-neutral-700 block mb-1">Rule Name:</label>
                <input
                  type="text"
                  value={ruleName}
                  onChange={(e) => setRuleName(e.target.value)}
                  placeholder="e.g. Consecutive Absence Follow-Up"
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-neutral-700 block mb-1">Event Trigger:</label>
                <select
                  value={ruleTrigger}
                  onChange={(e) => setRuleTrigger(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs focus:outline-none"
                >
                  <option value="Student Attendance Recorded">Student Attendance Recorded</option>
                  <option value="Course Expiry Approaching">Course Expiry Approaching</option>
                  <option value="Assignment Submission Overdue">Assignment Submission Overdue</option>
                  <option value="Module Assessment Passed">Module Assessment Passed</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-neutral-700 block mb-1">Target Channel:</label>
                <select
                  value={ruleChannel}
                  onChange={(e) => setRuleChannel(e.target.value as any)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs focus:outline-none"
                >
                  <option value="Telegram">Telegram</option>
                  <option value="SMS">SMS</option>
                  <option value="Notification">In-App Notification</option>
                  <option value="Email">Email</option>
                  <option value="Task">System Task</option>
                </select>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="approvalCheck"
                  checked={ruleApproval}
                  onChange={(e) => setRuleApproval(e.target.checked)}
                  className="rounded text-amber-800 focus:ring-amber-500"
                />
                <label htmlFor="approvalCheck" className="text-xs text-amber-900 font-bold">
                  Require explicit human approval before executing action
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowNewRuleModal(false)}
                className="px-4 py-2 bg-stone-200 text-neutral-800 font-bold text-xs rounded-xl hover:bg-stone-300"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateRule}
                disabled={!ruleName.trim()}
                className="px-5 py-2 bg-amber-800 disabled:opacity-50 text-white font-bold text-xs rounded-xl hover:bg-amber-900"
              >
                Save Automation Rule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

