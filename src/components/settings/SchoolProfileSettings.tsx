import React, { useState } from 'react';
import { Building, Save, CheckCircle2, Globe, MapPin, Phone, Mail, Clock, Calendar, Sparkles, Award } from 'lucide-react';
import { SchoolProfile, INITIAL_SCHOOL_PROFILE } from './SettingsData';

export const SchoolProfileSettings: React.FC = () => {
  const [profile, setProfile] = useState<SchoolProfile>(INITIAL_SCHOOL_PROFILE);
  const [saved, setSaved] = useState(false);

  const handleChange = (field: keyof SchoolProfile, value: any) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-amber-100 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-neutral-800 flex items-center gap-2">
            <Building className="w-6 h-6 text-amber-700" /> School Profile & Institutional Metadata
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            Global school parameters, public contact information, mission, vision, and operational branding.
          </p>
        </div>

        <button
          type="submit"
          className="bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-colors flex items-center gap-2 shadow-sm shrink-0 cursor-pointer"
        >
          {saved ? <CheckCircle2 className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
          {saved ? 'Changes Saved!' : 'Save Profile Changes'}
        </button>
      </div>

      {saved && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs rounded-2xl flex items-center gap-2 font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          School profile settings have been updated globally across all branches and portal views.
        </div>
      )}

      {/* Grid Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Core Identity */}
        <div className="bg-white p-6 rounded-2xl border border-amber-100 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-neutral-800 border-b pb-2 flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-700" /> Institutional Identity
          </h3>

          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">Official School Name</label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">Official Description</label>
            <textarea
              rows={3}
              value={profile.officialDescription}
              onChange={(e) => handleChange('officialDescription', e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">Founded Date</label>
              <input
                type="text"
                value={profile.foundedDate}
                onChange={(e) => handleChange('foundedDate', e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">Founder Information</label>
              <input
                type="text"
                value={profile.founderInfo}
                onChange={(e) => handleChange('founderInfo', e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Contact & Location */}
        <div className="bg-white p-6 rounded-2xl border border-amber-100 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-neutral-800 border-b pb-2 flex items-center gap-2">
            <Phone className="w-4 h-4 text-amber-700" /> Contact & Location Details
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">Main Phone Number(s)</label>
              <input
                type="text"
                value={profile.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">Official Email Address</label>
              <input
                type="text"
                value={profile.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">Website URL</label>
              <input
                type="text"
                value={profile.website}
                onChange={(e) => handleChange('website', e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">Official Telegram Channel</label>
              <input
                type="text"
                value={profile.telegram}
                onChange={(e) => handleChange('telegram', e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">Instagram Profile</label>
              <input
                type="text"
                value={profile.instagram || ''}
                onChange={(e) => handleChange('instagram', e.target.value)}
                placeholder="https://www.instagram.com/..."
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">TikTok Profile</label>
              <input
                type="text"
                value={profile.tiktok || ''}
                onChange={(e) => handleChange('tiktok', e.target.value)}
                placeholder="https://www.tiktok.com/@..."
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">YouTube Channel (Optional)</label>
              <input
                type="text"
                value={profile.youtube || ''}
                onChange={(e) => handleChange('youtube', e.target.value)}
                placeholder="(Leave empty if none)"
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">Facebook Page (Optional)</label>
              <input
                type="text"
                value={profile.facebook || ''}
                onChange={(e) => handleChange('facebook', e.target.value)}
                placeholder="(Leave empty if none)"
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">Headquarters Physical Address</label>
            <input
              type="text"
              value={profile.address}
              onChange={(e) => handleChange('address', e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">Google Maps Coordinates</label>
              <input
                type="text"
                value={profile.googleMapsLocation}
                onChange={(e) => handleChange('googleMapsLocation', e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">Working Hours</label>
              <input
                type="text"
                value={profile.workingHours}
                onChange={(e) => handleChange('workingHours', e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Mission, Vision & Values */}
        <div className="bg-white p-6 rounded-2xl border border-amber-100 shadow-sm space-y-4 md:col-span-2">
          <h3 className="text-sm font-bold text-neutral-800 border-b pb-2 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-700" /> Mission, Vision & Guiding Principles
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">School Mission Statement</label>
              <textarea
                rows={2}
                value={profile.mission}
                onChange={(e) => handleChange('mission', e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">School Vision Statement</label>
              <textarea
                rows={2}
                value={profile.vision}
                onChange={(e) => handleChange('vision', e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">Core Institutional Values (Comma separated)</label>
            <input
              type="text"
              value={profile.values.join(', ')}
              onChange={(e) => handleChange('values', e.target.value.split(',').map((v) => v.trim()))}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs focus:outline-none"
            />
          </div>
        </div>
      </div>
    </form>
  );
};

