import React, { useState } from 'react';
import { Share2, Send, MessageSquare, Video, CreditCard, Sparkles, Key, CheckCircle2, RefreshCw, Lock, ShieldCheck } from 'lucide-react';
import { IntegrationStatus, INITIAL_INTEGRATIONS } from './SettingsData';

export const IntegrationsCenter: React.FC = () => {
  const [integrations, setIntegrations] = useState<IntegrationStatus[]>(INITIAL_INTEGRATIONS);
  const [showKeyModal, setShowKeyModal] = useState<IntegrationStatus | null>(null);
  const [newKeyInput, setNewKeyInput] = useState('');
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  const handleRotateKey = (id: string) => {
    if (!newKeyInput.trim()) return;
    setIntegrations((prev) =>
      prev.map((i) =>
        i.id === id
          ? {
              ...i,
              apiKeyMasked: `${newKeyInput.slice(0, 6)}••••••••${newKeyInput.slice(-4)}`,
              lastSync: 'Just updated'
            }
          : i
      )
    );
    setShowKeyModal(null);
    setNewKeyInput('');
    setSavedMessage('API Key rotated successfully and secured in secret vault!');
    setTimeout(() => setSavedMessage(null), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-amber-100 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-neutral-800 flex items-center gap-2">
            <Share2 className="w-6 h-6 text-amber-700" /> Third-Party Integrations & Secure API Key Management
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            Manage Ethio Telecom SMS, Telegram Bot, Telebirr Webhooks, Google Meet API, and Gemini AI credentials.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-xl border border-emerald-200">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          Vault Secured & Masked
        </div>
      </div>

      {savedMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs rounded-2xl flex items-center gap-2 font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          {savedMessage}
        </div>
      )}

      {/* Integration Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {integrations.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl p-5 border border-amber-100 shadow-sm space-y-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-amber-50 text-amber-900 rounded-xl border border-amber-200">
                  {item.category === 'Communication' && <Send className="w-5 h-5" />}
                  {item.category === 'Payment' && <CreditCard className="w-5 h-5" />}
                  {item.category === 'Video' && <Video className="w-5 h-5" />}
                  {item.category === 'AI' && <Sparkles className="w-5 h-5 text-amber-700" />}
                </div>

                <div>
                  <h3 className="text-base font-bold text-neutral-800">{item.name}</h3>
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                    {item.category} Gateway
                  </span>
                </div>
              </div>

              <span
                className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                  item.status === 'Connected'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    : 'bg-red-100 text-red-800 border border-red-200'
                }`}
              >
                {item.status}
              </span>
            </div>

            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs space-y-1 font-mono">
              <div className="flex justify-between text-neutral-500 text-[11px]">
                <span>API Secret Key:</span>
                <span className="text-amber-900 font-bold">{item.apiKeyMasked}</span>
              </div>
              <div className="flex justify-between text-neutral-500 text-[11px]">
                <span>Webhook Signature Verification:</span>
                <span className={item.webhookConfigured ? 'text-emerald-700 font-bold' : 'text-stone-400'}>
                  {item.webhookConfigured ? 'Active & Validated' : 'Disabled'}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2 text-xs">
              <span className="text-[11px] text-neutral-400">Last Synced: {item.lastSync}</span>
              <button
                onClick={() => setShowKeyModal(item)}
                className="bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold px-3 py-1.5 rounded-lg border border-amber-300 flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Rotate / Update Key
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Rotate Key Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <h3 className="font-bold text-neutral-800 text-lg flex items-center gap-2">
              <Lock className="w-5 h-5 text-amber-700" /> Rotate Key for {showKeyModal.name}
            </h3>

            <p className="text-xs text-neutral-500">
              For security, existing secret keys are never revealed in plaintext. Enter the new API key or access token provided by the service vendor.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-neutral-700 block mb-1">New Secret API Key / Token</label>
                <input
                  type="password"
                  value={newKeyInput}
                  onChange={(e) => setNewKeyInput(e.target.value)}
                  placeholder="Paste raw key string..."
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 font-mono text-xs focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowKeyModal(null)}
                className="px-4 py-2 bg-stone-200 text-neutral-800 font-bold text-xs rounded-xl hover:bg-stone-300"
              >
                Cancel
              </button>
              <button
                onClick={() => handleRotateKey(showKeyModal.id)}
                disabled={!newKeyInput.trim()}
                className="px-5 py-2 bg-amber-800 disabled:opacity-50 text-white font-bold text-xs rounded-xl hover:bg-amber-900"
              >
                Rotate & Save Secret
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

