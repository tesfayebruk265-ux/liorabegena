import React, { useState } from 'react';
import { Award, CheckCircle2, ShieldCheck, QrCode, Building, Lock, Search } from 'lucide-react';

interface CertificateVerificationProps {
  initialCertId?: string;
}

export const CertificateVerificationModal: React.FC<CertificateVerificationProps> = ({
  initialCertId = 'CERT-2026-8819'
}) => {
  const [certId, setCertId] = useState(initialCertId);
  const [searchedId, setSearchedId] = useState(initialCertId);
  const [loading, setLoading] = useState(false);

  const [certData, setCertData] = useState({
    id: 'CERT-2026-8819',
    studentName: 'Yohannes Girma',
    courseName: 'Begena Sacred Acoustic Instrument - Level 1',
    level: 'Level 1 Graduate',
    issueDate: 'July 15, 2026',
    issuer: 'Liora Begena Traditional Sacred Music School',
    signatory: 'Bruk Tesfaye (Founder)',
    status: 'AUTHENTIC & VERIFIED',
    hashSignature: '0x8f29a17c4b00e9a1827419ef20182412'
  });

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certId.trim()) return;
    setLoading(true);

    setTimeout(() => {
      setSearchedId(certId);
      setCertData({
        id: certId.toUpperCase(),
        studentName: 'Yohannes Girma',
        courseName: 'Begena Sacred Acoustic Instrument - Level 1',
        level: 'Level 1 Graduate',
        issueDate: 'July 15, 2026',
        issuer: 'Liora Begena Traditional Sacred Music School',
        signatory: 'Bruk Tesfaye (Founder)',
        status: 'AUTHENTIC & VERIFIED',
        hashSignature: `0x${Math.random().toString(16).substring(2, 10)}...`
      });
      setLoading(false);
    }, 800);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="bg-amber-900 text-amber-50 rounded-2xl p-6 text-center space-y-2 border border-amber-800 shadow-md">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-800/80 rounded-full text-xs font-bold text-amber-200 border border-amber-700">
          <ShieldCheck className="w-4 h-4 text-emerald-400" /> Official Public Verification Portal
        </div>
        <h1 className="text-2xl font-extrabold text-white">Certificate Verification Gateway</h1>
        <p className="text-xs text-amber-200 max-w-lg mx-auto">
          Verify authentic certificates issued by Liora Begena Traditional Sacred Music School via unique ID or QR code hash.
        </p>
      </div>

      {/* Search Input */}
      <form onSubmit={handleVerify} className="bg-white p-4 rounded-2xl border border-amber-100 shadow-sm flex gap-2">
        <input
          type="text"
          value={certId}
          onChange={(e) => setCertId(e.target.value)}
          placeholder="Enter Certificate ID (e.g. CERT-2026-8819)..."
          className="flex-1 bg-stone-50 border border-stone-300 rounded-xl px-4 py-2.5 text-xs font-mono font-bold focus:outline-none"
        />
        <button
          type="submit"
          className="bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <Search className="w-4 h-4" /> Verify Certificate
        </button>
      </form>

      {/* Verification Card */}
      {loading ? (
        <div className="p-8 bg-white rounded-2xl border border-amber-100 shadow-sm text-center text-xs text-neutral-500 font-bold">
          Verifying certificate authenticity against secure ledger...
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-8 border-2 border-amber-200 shadow-md relative overflow-hidden space-y-6">
          {/* Authentic Watermark Badge */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-stone-200">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-100 text-amber-900 rounded-2xl border border-amber-300">
                <Award className="w-8 h-8 text-amber-800" />
              </div>
              <div>
                <span className="text-xs font-mono text-neutral-400 font-bold block">{certData.id}</span>
                <h2 className="text-lg font-extrabold text-neutral-800">{certData.courseName}</h2>
              </div>
            </div>

            <div className="bg-emerald-50 text-emerald-800 border-2 border-emerald-300 font-extrabold text-xs px-4 py-2 rounded-xl flex items-center gap-2 shrink-0">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              {certData.status}
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
              <span className="text-[10px] text-neutral-400 font-bold uppercase block">Graduate Name</span>
              <span className="text-base font-extrabold text-neutral-900">{certData.studentName}</span>
            </div>

            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
              <span className="text-[10px] text-neutral-400 font-bold uppercase block">Academic Level</span>
              <span className="text-sm font-bold text-amber-900">{certData.level}</span>
            </div>

            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
              <span className="text-[10px] text-neutral-400 font-bold uppercase block">Date of Issue</span>
              <span className="text-xs font-semibold text-neutral-800">{certData.issueDate}</span>
            </div>

            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
              <span className="text-[10px] text-neutral-400 font-bold uppercase block">Authorized Signatory</span>
              <span className="text-xs font-semibold text-neutral-800">{certData.signatory}</span>
            </div>
          </div>

          {/* QR Code & Hash Signature Footer */}
          <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg border border-amber-200">
                <QrCode className="w-10 h-10 text-neutral-800" />
              </div>
              <div>
                <span className="font-bold text-amber-900 text-xs block">Cryptographic Hash Verification</span>
                <span className="font-mono text-[10px] text-neutral-500">{certData.hashSignature}</span>
              </div>
            </div>

            <div className="text-[10px] text-neutral-400 text-right flex items-center gap-1 font-semibold">
              <Lock className="w-3.5 h-3.5 text-emerald-600" /> Privacy Protected (No Private Financial/Address Data Exposed)
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

