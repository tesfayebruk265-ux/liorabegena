import React, { useState } from 'react';
import {
  Megaphone,
  Plus,
  QrCode,
  Link as LinkIcon,
  Eye,
  MousePointer,
  Users,
  DollarSign,
  TrendingUp,
  Share2,
  Calendar,
  CheckCircle2,
  ExternalLink,
  Target,
  Sparkles,
  Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CampaignItem, Language } from '../../types';
import { SAMPLE_CAMPAIGNS } from './CrmData';

interface CampaignsCenterProps {
  lang: Language;
}

export function CampaignsCenter({ lang }: CampaignsCenterProps) {
  const [campaigns, setCampaigns] = useState<CampaignItem[]>(SAMPLE_CAMPAIGNS);
  const [selectedCampaign, setSelectedCampaign] = useState<CampaignItem | null>(SAMPLE_CAMPAIGNS[0]);

  // New Campaign Form Modal
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<CampaignItem['type']>('Enrollment Campaign');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [branchName, setBranchName] = useState('All Branches & Online');
  const [courseName, setCourseName] = useState('Traditional Begena Sacred Harp');

  // Preview Landing Page Modal
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const trackingCode = name.toUpperCase().replace(/\s+/g, '-');
    const newCamp: CampaignItem = {
      id: `CMP-${Date.now()}`,
      name,
      description,
      objective: 'Drive new traditional music student enrollments across branches.',
      type,
      startDate: startDate || new Date().toISOString().split('T')[0],
      endDate: endDate || '2026-12-31',
      targetAudience: 'Visitors',
      branchName,
      courseName,
      channels: ['Website', 'Telegram', 'TikTok', 'Instagram'],
      status: 'Active',
      trackingCode,
      landingPageUrl: `/campaigns/${trackingCode.toLowerCase()}`,
      qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${trackingCode}`,
      metrics: {
        views: 120,
        clicks: 45,
        inquiries: 12,
        leads: 8,
        registrations: 3,
        payments: 2,
        enrollments: 2,
        conversions: 66.7
      }
    };

    setCampaigns([newCamp, ...campaigns]);
    setSelectedCampaign(newCamp);
    setIsNewModalOpen(false);
    setName('');
    setDescription('');
    alert(`Campaign "${name}" Created with Tracking Code: ${trackingCode}!`);
  };

  return (
    <div className="space-y-6 text-left">
      {/* HEADER BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#FFFDF8] via-[#FAF6EF] to-white border border-[#E7DED1] p-6 rounded-2xl shadow-2xs">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white border border-[#E7DED1] text-xs font-bold text-[#E89B52]">
            <Megaphone size={13} />
            <span>Growth & Student Acquisition Engine</span>
          </div>
          <h2 className="font-display font-black text-2xl text-[#2B2B2B]">
            Marketing Campaigns, Landing Pages & Tracking
          </h2>
          <p className="text-xs text-[#666666]">
            Manage multi-channel campaigns (Telegram, TikTok, Instagram, QR Codes), generate unique tracking links, and measure real conversion ROI.
          </p>
        </div>

        <button
          onClick={() => setIsNewModalOpen(true)}
          className="py-2.5 px-4 bg-[#E89B52] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-2xs hover:bg-[#d68a41] cursor-pointer flex items-center justify-center gap-2"
        >
          <Plus size={16} />
          <span>Launch New Campaign</span>
        </button>
      </div>

      {/* MAIN CAMPAIGNS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT CAMPAIGN SELECTOR LIST */}
        <div className="lg:col-span-5 space-y-4">
          <h3 className="font-display font-bold text-sm text-[#2B2B2B]">Active Campaigns ({campaigns.length})</h3>
          <div className="space-y-3">
            {campaigns.map((cmp) => (
              <div
                key={cmp.id}
                onClick={() => setSelectedCampaign(cmp)}
                className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2 text-xs ${
                  selectedCampaign?.id === cmp.id
                    ? 'bg-white border-[#E89B52] ring-2 ring-[#E89B52]/20 shadow-xs'
                    : 'bg-white border-[#E7DED1] hover:border-[#E89B52]'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-mono text-[10px] font-bold text-[#E89B52]">{cmp.trackingCode}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#10B981]/10 text-[#10B981]">
                    {cmp.status}
                  </span>
                </div>
                <h4 className="font-display font-bold text-sm text-[#2B2B2B]">{cmp.name}</h4>
                <p className="text-[#666666] line-clamp-2">{cmp.description}</p>
                <div className="flex items-center gap-3 text-[10px] text-[#666666] pt-1 border-t border-[#E7DED1]">
                  <span>Target: {cmp.branchName}</span>
                  <span>•</span>
                  <span>{cmp.metrics.leads} Leads Captured</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT CAMPAIGN METRICS & TRACKING DETAIL */}
        <div className="lg:col-span-7 space-y-6">
          {selectedCampaign ? (
            <div className="bg-white border border-[#E7DED1] p-6 rounded-2xl shadow-xs space-y-6">
              <div className="flex justify-between items-start border-b border-[#E7DED1] pb-4">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E89B52]/10 text-[#E89B52]">
                    {selectedCampaign.type}
                  </span>
                  <h3 className="font-display font-bold text-xl text-[#2B2B2B] mt-1">{selectedCampaign.name}</h3>
                  <p className="text-xs text-[#666666] mt-0.5">{selectedCampaign.description}</p>
                </div>
                <button
                  onClick={() => setIsPreviewModalOpen(true)}
                  className="px-3 py-1.5 border border-[#E7DED1] rounded-lg text-xs font-bold text-[#E89B52] hover:bg-[#FAF6EF] flex items-center gap-1 cursor-pointer"
                >
                  <ExternalLink size={13} />
                  <span>Preview Landing Page</span>
                </button>
              </div>

              {/* FUNNEL METRICS GRID */}
              <div>
                <h4 className="font-display font-bold text-xs text-[#666666] uppercase mb-3">Conversion Funnel Analytics</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 bg-[#FAF6EF] border border-[#E7DED1] rounded-xl text-center">
                    <p className="text-[10px] font-bold text-[#666666] uppercase">Views</p>
                    <p className="font-display font-bold text-lg text-[#2B2B2B]">{selectedCampaign.metrics.views.toLocaleString()}</p>
                  </div>
                  <div className="p-3 bg-[#FAF6EF] border border-[#E7DED1] rounded-xl text-center">
                    <p className="text-[10px] font-bold text-[#666666] uppercase">Inquiries</p>
                    <p className="font-display font-bold text-lg text-[#2B2B2B]">{selectedCampaign.metrics.inquiries}</p>
                  </div>
                  <div className="p-3 bg-[#FAF6EF] border border-[#E7DED1] rounded-xl text-center">
                    <p className="text-[10px] font-bold text-[#666666] uppercase">Leads</p>
                    <p className="font-display font-bold text-lg text-[#E89B52]">{selectedCampaign.metrics.leads}</p>
                  </div>
                  <div className="p-3 bg-[#FAF6EF] border border-[#E7DED1] rounded-xl text-center">
                    <p className="text-[10px] font-bold text-[#666666] uppercase">Enrollments</p>
                    <p className="font-display font-bold text-lg text-[#10B981]">{selectedCampaign.metrics.enrollments}</p>
                  </div>
                </div>
              </div>

              {/* TRACKING CODES & QR MARKETING */}
              <div className="p-4 border border-[#E7DED1] bg-[#FAF6EF]/50 rounded-xl space-y-3 text-xs">
                <h4 className="font-display font-bold text-xs text-[#2B2B2B] flex items-center gap-1.5">
                  <QrCode size={14} className="text-[#E89B52]" />
                  <span>Unique Tracking Link & QR Code</span>
                </h4>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <img src={selectedCampaign.qrCodeUrl} alt="Campaign QR Code" className="w-24 h-24 bg-white p-2 border border-[#E7DED1] rounded-lg" />
                  <div className="space-y-1 text-left flex-1">
                    <p className="font-bold text-[#2B2B2B]">Campaign Tracking Code: <span className="font-mono text-[#E89B52]">{selectedCampaign.trackingCode}</span></p>
                    <p className="text-[11px] text-[#666666]">Landing Page URL: <code className="bg-white px-1.5 py-0.5 rounded border border-[#E7DED1]">{selectedCampaign.landingPageUrl}</code></p>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(`https://abelbegena.et${selectedCampaign.landingPageUrl}?utm_source=${selectedCampaign.trackingCode}`);
                        alert('Tracking Link Copied to Clipboard!');
                      }}
                      className="px-3 py-1 bg-[#6F4E37] text-white font-bold rounded-md hover:bg-[#5a3f2c] cursor-pointer inline-flex items-center gap-1 text-[11px] mt-1"
                    >
                      <Share2 size={12} /> Copy Campaign Tracking URL
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-[#E7DED1] p-12 rounded-2xl text-center text-xs text-[#666666]">
              Select a campaign from the left to view metrics.
            </div>
          )}
        </div>
      </div>

      {/* NEW CAMPAIGN MODAL */}
      <AnimatePresence>
        {isNewModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white border border-[#E7DED1] rounded-2xl p-6 max-w-lg w-full shadow-lg space-y-4 text-left"
            >
              <div className="flex items-center justify-between border-b border-[#E7DED1] pb-3">
                <h3 className="font-display font-bold text-lg text-[#2B2B2B]">Launch Student Acquisition Campaign</h3>
                <button onClick={() => setIsNewModalOpen(false)} className="p-1 text-[#666666] hover:text-black cursor-pointer">✕</button>
              </div>

              <form onSubmit={handleCreateCampaign} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-[#2B2B2B]">Campaign Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Easter Begena Sacred Hymns Drive 2026"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border border-[#E7DED1] rounded-lg focus:outline-none focus:border-[#E89B52]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#2B2B2B]">Campaign Description</label>
                  <textarea
                    rows={2}
                    placeholder="Objective & details..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-[#E7DED1] rounded-lg focus:outline-none focus:border-[#E89B52]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-[#2B2B2B]">Campaign Type</label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value as CampaignItem['type'])}
                      className="w-full px-3 py-2 border border-[#E7DED1] rounded-lg focus:outline-none focus:border-[#E89B52]"
                    >
                      <option value="Enrollment Campaign">Enrollment Campaign</option>
                      <option value="Course Campaign">Course Campaign</option>
                      <option value="Concert Campaign">Concert Campaign</option>
                      <option value="Special Offer">Special Offer</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-[#2B2B2B]">Target Branch</label>
                    <input
                      type="text"
                      value={branchName}
                      onChange={(e) => setBranchName(e.target.value)}
                      className="w-full px-3 py-2 border border-[#E7DED1] rounded-lg focus:outline-none focus:border-[#E89B52]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#E89B52] text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-2xs hover:bg-[#d68a41] cursor-pointer"
                >
                  Create Campaign & Generate Links
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CAMPAIGN LANDING PAGE PREVIEW MODAL */}
      <AnimatePresence>
        {isPreviewModalOpen && selectedCampaign && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white border border-[#E7DED1] rounded-2xl max-w-2xl w-full shadow-xl overflow-hidden text-left my-8"
            >
              <div className="bg-[#2B2B2B] text-white p-4 flex items-center justify-between">
                <span className="font-mono text-xs text-[#E89B52]">Simulated Campaign Landing Page</span>
                <button onClick={() => setIsPreviewModalOpen(false)} className="text-white hover:text-[#E89B52] cursor-pointer">✕</button>
              </div>

              <div className="p-6 space-y-6">
                <div className="bg-gradient-to-r from-[#FAF6EF] to-white border border-[#E7DED1] p-6 rounded-2xl space-y-3">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E89B52] text-white">
                    {selectedCampaign.trackingCode}
                  </span>
                  <h3 className="font-display font-black text-2xl text-[#2B2B2B]">{selectedCampaign.name}</h3>
                  <p className="text-xs text-[#666666] leading-relaxed">{selectedCampaign.description}</p>
                </div>

                <div className="p-4 bg-[#FAF6EF] border border-[#E7DED1] rounded-xl space-y-2 text-xs">
                  <h4 className="font-display font-bold text-sm text-[#2B2B2B]">Featured Course: {selectedCampaign.courseName}</h4>
                  <p className="text-[#666666]">Master traditional Ethiopian 10-string Begena plucking with authentic St. Yared spiritual hymn notation.</p>
                  <button
                    onClick={() => { setIsPreviewModalOpen(false); alert('Redirected to Student Registration with Campaign Code Attached!'); }}
                    className="w-full py-2.5 bg-[#E89B52] text-white font-bold text-xs uppercase tracking-wider rounded-lg cursor-pointer"
                  >
                    Register Now with Campaign Discount
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

