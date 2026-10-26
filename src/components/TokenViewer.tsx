import React, { useState } from 'react';
import {
  colorTokens,
  typographyTokens,
  spacingTokens,
  radiusTokens,
  shadowTokens,
  breakpointTokens,
  gridTokens,
  containerTokens
} from '../data/tokensData';
import { Copy, Check, Grid, Palette, Type, ShieldAlert, Minimize2, Move, LayoutGrid, Smartphone, Tablet, Monitor, Maximize2, Layers, Sparkles } from 'lucide-react';

export function TokenViewer() {
  const [activeTab, setActiveTab] = useState<'colors' | 'typography' | 'spacing' | 'grid' | 'layout'>('colors');
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  // Interactive Responsive Grid Simulator state
  const [selectedGridDevice, setSelectedGridDevice] = useState<'Mobile' | 'Tablet' | 'Desktop' | 'Wide Desktop'>('Desktop');
  const [activeColumnSpan, setActiveColumnSpan] = useState<number>(6);
  const [showGridOverlay, setShowGridOverlay] = useState<boolean>(true);

  // Spacing Scale Filter/Tester
  const [selectedSpacingPx, setSelectedSpacingPx] = useState<number>(16);

  const handleCopy = (token: string) => {
    navigator.clipboard.writeText(token);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const currentGridToken = gridTokens.find(g => g.device === selectedGridDevice) || gridTokens[2];

  return (
    <div className="bg-white border border-[#E7DED1] rounded-2xl p-6 shadow-sm text-left">
      {/* Top Selector Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-[#E7DED1] pb-4">
        <button
          onClick={() => setActiveTab('colors')}
          className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-md transition-colors cursor-pointer ${activeTab === 'colors' ? 'bg-[#E89B52] text-white shadow-2xs' : 'bg-transparent text-[#666666] hover:bg-[#FAF6EF] hover:text-[#2B2B2B]'}`}
        >
          <Palette size={16} />
          <span>Color Palette</span>
        </button>

        <button
          onClick={() => setActiveTab('typography')}
          className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-md transition-colors cursor-pointer ${activeTab === 'typography' ? 'bg-[#E89B52] text-white shadow-2xs' : 'bg-transparent text-[#666666] hover:bg-[#FAF6EF] hover:text-[#2B2B2B]'}`}
        >
          <Type size={16} />
          <span>Typography Scales</span>
        </button>

        <button
          onClick={() => setActiveTab('spacing')}
          className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-md transition-colors cursor-pointer ${activeTab === 'spacing' ? 'bg-[#E89B52] text-white shadow-2xs' : 'bg-transparent text-[#666666] hover:bg-[#FAF6EF] hover:text-[#2B2B2B]'}`}
        >
          <Move size={16} />
          <span>4px Spacing Scale</span>
        </button>

        <button
          onClick={() => setActiveTab('grid')}
          className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-md transition-colors cursor-pointer ${activeTab === 'grid' ? 'bg-[#E89B52] text-white shadow-2xs' : 'bg-transparent text-[#666666] hover:bg-[#FAF6EF] hover:text-[#2B2B2B]'}`}
        >
          <LayoutGrid size={16} />
          <span>Responsive Grid System</span>
        </button>

        <button
          onClick={() => setActiveTab('layout')}
          className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-md transition-colors cursor-pointer ${activeTab === 'layout' ? 'bg-[#E89B52] text-white shadow-2xs' : 'bg-transparent text-[#666666] hover:bg-[#FAF6EF] hover:text-[#2B2B2B]'}`}
        >
          <Grid size={16} />
          <span>Borders, Containers & Elevation</span>
        </button>
      </div>

      {/* 1. COLOR PALETTE TAB */}
      {activeTab === 'colors' && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E7DED1]">
            <div>
              <h4 className="font-display font-bold text-lg text-[#2B2B2B]">Semantic Color Architecture</h4>
              <p className="text-xs text-[#666666] mt-0.5">
                Complete token map for Liora Begena Traditional Music School. Anchored by natural warm neutrals (#FFFDF8, #FAF6EF, #FFFFFF) and deep charcoal text (#2B2B2B).
              </p>
            </div>
          </div>

          {/* Strategic Accent Guidance Callout */}
          <div className="p-4 rounded-xl border border-[#E89B52]/40 bg-[#FAF6EF] text-left flex flex-col sm:flex-row items-start sm:items-center gap-4 shadow-3xs">
            <div className="w-10 h-10 rounded-lg bg-[#E89B52] text-white shrink-0 flex items-center justify-center font-bold shadow-2xs">
              <Sparkles size={20} />
            </div>
            <div className="flex-1 space-y-1">
              <h5 className="text-xs font-bold uppercase tracking-wider text-[#2B2B2B]">Strategic Accent Principle</h5>
              <p className="text-xs text-[#666666] leading-relaxed">
                <strong className="text-[#E89B52]">Light Warm Orange (#E89B52)</strong> is reserved strictly as a high-intent accent for primary CTA buttons, active state indicators, progress bars, and critical focal points. To maintain visual clarity and elegance, it is <em>never</em> used as a background flood or large panel surface.
              </p>
            </div>
            <div className="flex items-center gap-1.5 shrink-0 bg-white border border-[#E7DED1] px-3 py-1.5 rounded-lg text-[10px] font-mono">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E89B52]" />
              <span className="font-bold text-[#2B2B2B]">#E89B52 Accent Ratio: &lt;10%</span>
            </div>
          </div>

          {/* Color Tokens Grid by Categories */}
          {['primary', 'background', 'text', 'secondary', 'semantic', 'cultural'].map((cat) => {
            const catTokens = colorTokens.filter(c => c.category === cat);
            if (catTokens.length === 0) return null;

            const categoryLabels: Record<string, { title: string; subtitle: string }> = {
              primary: { title: 'Primary Action Tokens', subtitle: 'Action colors for buttons, hover states, active states, and focal points.' },
              background: { title: 'Background & Surface Tokens', subtitle: 'Warm canvas, card surfaces, and elevated container wells.' },
              text: { title: 'Typography & Text Tokens', subtitle: 'High contrast charcoal and warm grays for legibility.' },
              secondary: { title: 'Secondary & Border Tokens', subtitle: 'Antique Gold and Warm Light Gray structural borders.' },
              semantic: { title: 'Semantic Status Tokens', subtitle: 'Feedback states for payment verification, errors, and system alerts.' },
              cultural: { title: 'Cultural Foundation Tokens', subtitle: 'Walnut Brown referencing Begena and Krar wooden soundboxes.' }
            };

            const info = categoryLabels[cat] || { title: `${cat.toUpperCase()} Tokens`, subtitle: '' };

            return (
              <div key={cat} className="space-y-3">
                <div>
                  <h5 className="font-display font-bold text-sm text-[#2B2B2B]">{info.title}</h5>
                  <p className="text-[11px] text-[#666666]">{info.subtitle}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {catTokens.map((c) => (
                    <div key={c.name} className="flex flex-col border border-[#E7DED1] rounded-lg overflow-hidden bg-white hover:border-[#C79A2B]/50 transition-all shadow-3xs">
                      {/* Visual Color Block with Swatch Info */}
                      <div
                        className="h-16 w-full border-b border-[#E7DED1] relative p-2 flex items-end justify-end"
                        style={{ backgroundColor: c.value }}
                      >
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded shadow-3xs ${['#FFFFFF', '#FFFDF8', '#FAF6EF', '#E7DED1'].includes(c.value) ? 'bg-[#2B2B2B] text-white' : 'bg-white/90 text-[#2B2B2B]'}`}>
                          {c.value}
                        </span>
                      </div>

                      <div className="p-3.5 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-xs font-bold text-[#2B2B2B]">{c.name}</span>
                            <span className="text-[9px] font-mono font-semibold bg-[#FAF6EF] border border-[#E7DED1] text-[#C79A2B] px-1.5 py-0.5 rounded uppercase">
                              {c.category}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#666666] mt-1.5 leading-relaxed">
                            {c.usage}
                          </p>
                        </div>

                        <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#FAF6EF] text-[10px] font-mono">
                          <span className="text-[#2B2B2B] font-semibold truncate max-w-[150px]">{c.token}</span>
                          <button
                            onClick={() => handleCopy(c.token)}
                            className="text-[#666666] hover:text-[#E89B52] flex items-center gap-1 cursor-pointer shrink-0 ml-1"
                          >
                            {copiedToken === c.token ? (
                              <>
                                <Check size={10} className="text-green-500" />
                                <span className="text-green-500 font-bold">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy size={10} />
                                <span>Copy Token</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 2. TYPOGRAPHY TAB */}
      {activeTab === 'typography' && (
        <div>
          <div className="mb-5">
            <h4 className="font-display font-bold text-lg text-[#2B2B2B]">Adaptive Font Hierarchy</h4>
            <p className="text-xs text-[#666666] mt-0.5">
              Brand headings leverage <strong>Space Grotesk</strong> (as our Coolvetica fallback). Technical and numerical screens utilize <strong>Inter</strong> with high contrast ratios.
            </p>
          </div>

          <div className="space-y-6">
            {typographyTokens.map((t) => (
              <div key={t.name} className="p-4 border border-[#E7DED1] rounded-lg bg-[#FAF6EF]/10 hover:bg-[#FAF6EF]/30 transition-colors">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-2 border-b border-[#FAF6EF]">
                  <span className="text-xs font-bold text-[#2B2B2B]">{t.name} ({t.tag})</span>
                  <div className="flex flex-wrap gap-2 text-[10px] font-mono text-[#666666]">
                    <span>Size: <strong className="text-[#2B2B2B]">{t.fontSize}</strong></span>
                    <span>•</span>
                    <span>Line Height: <strong className="text-[#2B2B2B]">{t.lineHeight}</strong></span>
                    <span>•</span>
                    <span>Spacing: <strong className="text-[#2B2B2B]">{t.letterSpacing}</strong></span>
                    <span>•</span>
                    <span>Weight: <strong className="text-[#E89B52]">{t.fontWeight}</strong></span>
                  </div>
                </div>

                {/* Example live demonstration */}
                <div className="py-2 overflow-hidden">
                  <p
                    className="truncate text-left"
                    style={{
                      fontSize: t.fontSize.includes('px') ? `${parseInt(t.fontSize) * 0.75}px` : t.fontSize,
                      lineHeight: t.lineHeight,
                      letterSpacing: t.letterSpacing,
                      fontFamily: t.name.includes('Display') ? 'var(--font-display)' : 'var(--font-sans)',
                      fontWeight: t.fontWeight.includes('800') ? 800 : t.fontWeight.includes('700') ? 700 : t.fontWeight.includes('600') ? 600 : t.fontWeight.includes('500') ? 500 : 400,
                      color: 'var(--color-text-primary)'
                    }}
                  >
                    {t.name.includes('Display') ? 'አበል በገና ትምህርት ቤት' : 'Ancient Ethiopian musical heritage, preserved & taught online.'}
                  </p>
                </div>

                <p className="text-[11px] text-[#666666] mt-1 italic">
                  Usage: {t.usage}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. 4PX SPACING SCALE TAB */}
      {activeTab === 'spacing' && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-[#E7DED1]">
            <div>
              <h4 className="font-display font-bold text-lg text-[#2B2B2B]">4px Incremental Spacing Scale</h4>
              <p className="text-xs text-[#666666] mt-0.5">
                Strict 4px/8px coordinate systems based on 4px multiples (4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 48px, 64px, 80px, 96px, 128px) for consistent padding, margins, and gaps.
              </p>
            </div>
            
            {/* Interactive Scale Tester */}
            <div className="flex items-center gap-2 bg-[#FAF6EF] p-2 rounded-lg border border-[#E7DED1] text-xs">
              <span className="text-[10px] font-bold uppercase text-[#666666]">Preview Box Padding:</span>
              <select
                value={selectedSpacingPx}
                onChange={(e) => setSelectedSpacingPx(Number(e.target.value))}
                className="bg-white border border-[#E7DED1] px-2 py-1 rounded text-xs font-mono font-bold text-[#2B2B2B] outline-none"
              >
                {spacingTokens.map((s) => (
                  <option key={s.name} value={s.pixels}>
                    {s.name} ({s.pixels}px)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Interactive Spacing Box Preview */}
          <div className="p-4 border border-dashed border-[#C79A2B] rounded-xl bg-[#FAF6EF]/30 flex flex-col items-center justify-center min-h-[140px] text-center">
            <div
              className="bg-white border-2 border-[#E89B52] rounded-lg shadow-2xs transition-all duration-300 inline-block"
              style={{ padding: `${selectedSpacingPx}px` }}
            >
              <div className="bg-[#FAF6EF] border border-[#E7DED1] px-4 py-2 rounded text-xs font-mono font-semibold text-[#2B2B2B]">
                Element Inner Content (Padding: {selectedSpacingPx}px)
              </div>
            </div>
            <p className="text-[11px] font-mono text-[#666666] mt-2">
              Scale multiplier: {selectedSpacingPx / 4}x (Base 4px increment)
            </p>
          </div>

          {/* Scale Tokens Table */}
          <div className="space-y-3">
            {spacingTokens.map((s) => (
              <div
                key={s.name}
                onClick={() => setSelectedSpacingPx(s.pixels)}
                className={`flex flex-col md:flex-row items-start md:items-center gap-4 p-3 border rounded-lg transition-colors cursor-pointer ${selectedSpacingPx === s.pixels ? 'border-[#E89B52] bg-[#FAF6EF]/40 shadow-3xs' : 'border-[#E7DED1] hover:border-[#C79A2B]/40 bg-white'}`}
              >
                <div className="w-36 font-mono text-xs shrink-0 flex items-center justify-between md:block">
                  <span className="font-bold text-[#2B2B2B]">{s.name}</span>
                  <p className="text-[#E89B52] font-semibold">{s.value} ({s.pixels}px)</p>
                </div>

                {/* Visual Bar representation */}
                <div className="w-full md:w-64 bg-[#FAF6EF] rounded h-6 relative overflow-hidden flex items-center px-1 border border-[#E7DED1]/60">
                  <div
                    className="bg-[#E89B52] h-4 rounded-xs transition-all"
                    style={{ width: `${Math.min(s.pixels * 2.5, 240)}px` }}
                  />
                </div>

                <div className="text-[11px] font-mono text-[#C79A2B] bg-[#FAF6EF] px-2 py-0.5 rounded border border-[#E7DED1] shrink-0">
                  {s.tailwindClass}
                </div>

                <div className="flex-1 text-xs text-[#666666]">
                  {s.usage}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. RESPONSIVE GRID SYSTEM TAB */}
      {activeTab === 'grid' && (
        <div className="space-y-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 pb-4 border-b border-[#E7DED1]">
            <div>
              <h4 className="font-display font-bold text-lg text-[#2B2B2B]">Responsive Column Grid Architecture</h4>
              <p className="text-xs text-[#666666] mt-0.5">
                Structured layout grids with <strong>12 columns for Desktop</strong>, <strong>8 columns for Tablet</strong>, and <strong>4 columns for Mobile</strong>, featuring fluid page margins and gutters aligned to the 4px scale.
              </p>
            </div>

            {/* Device Viewport Selector */}
            <div className="flex flex-wrap items-center gap-1.5 bg-[#FAF6EF] p-1.5 rounded-lg border border-[#E7DED1]">
              <button
                onClick={() => {
                  setSelectedGridDevice('Mobile');
                  if (activeColumnSpan > 4) setActiveColumnSpan(4);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold cursor-pointer transition-colors ${selectedGridDevice === 'Mobile' ? 'bg-[#E89B52] text-white shadow-2xs' : 'text-[#666666] hover:bg-white'}`}
              >
                <Smartphone size={14} />
                <span>Mobile (4 Cols)</span>
              </button>

              <button
                onClick={() => {
                  setSelectedGridDevice('Tablet');
                  if (activeColumnSpan > 8) setActiveColumnSpan(8);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold cursor-pointer transition-colors ${selectedGridDevice === 'Tablet' ? 'bg-[#E89B52] text-white shadow-2xs' : 'text-[#666666] hover:bg-white'}`}
              >
                <Tablet size={14} />
                <span>Tablet (8 Cols)</span>
              </button>

              <button
                onClick={() => setSelectedGridDevice('Desktop')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold cursor-pointer transition-colors ${selectedGridDevice === 'Desktop' ? 'bg-[#E89B52] text-white shadow-2xs' : 'text-[#666666] hover:bg-white'}`}
              >
                <Monitor size={14} />
                <span>Desktop (12 Cols)</span>
              </button>

              <button
                onClick={() => setSelectedGridDevice('Wide Desktop')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold cursor-pointer transition-colors ${selectedGridDevice === 'Wide Desktop' ? 'bg-[#E89B52] text-white shadow-2xs' : 'text-[#666666] hover:bg-white'}`}
              >
                <Maximize2 size={14} />
                <span>Wide (12 Cols)</span>
              </button>
            </div>
          </div>

          {/* Grid Spec Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3 border border-[#E7DED1] rounded-lg bg-[#FAF6EF]/30 text-center">
              <p className="text-[10px] font-bold text-[#666666] uppercase tracking-wider">Active Device</p>
              <p className="font-display font-black text-lg text-[#2B2B2B] mt-0.5">{currentGridToken.device}</p>
              <p className="text-[10px] font-mono text-[#E89B52]">{currentGridToken.breakpoint}</p>
            </div>

            <div className="p-3 border border-[#E7DED1] rounded-lg bg-[#FAF6EF]/30 text-center">
              <p className="text-[10px] font-bold text-[#666666] uppercase tracking-wider">Grid Columns</p>
              <p className="font-display font-black text-lg text-[#C79A2B] mt-0.5">{currentGridToken.columns} Columns</p>
              <p className="text-[10px] font-mono text-[#666666]">100% Fluid Width</p>
            </div>

            <div className="p-3 border border-[#E7DED1] rounded-lg bg-[#FAF6EF]/30 text-center">
              <p className="text-[10px] font-bold text-[#666666] uppercase tracking-wider">Gutter / Gap</p>
              <p className="font-display font-black text-lg text-[#2B2B2B] mt-0.5">{currentGridToken.gutter}</p>
              <p className="text-[10px] font-mono text-[#666666]">4px scale aligned</p>
            </div>

            <div className="p-3 border border-[#E7DED1] rounded-lg bg-[#FAF6EF]/30 text-center">
              <p className="text-[10px] font-bold text-[#666666] uppercase tracking-wider">Page Outer Margin</p>
              <p className="font-display font-black text-lg text-[#6F4E37] mt-0.5">{currentGridToken.pageMargin}</p>
              <p className="text-[10px] font-mono text-[#666666]">Max: {currentGridToken.maxContainerWidth}</p>
            </div>
          </div>

          {/* Interactive Live Visual Grid Inspector Simulator */}
          <div className="border border-[#E7DED1] rounded-xl bg-[#FAF6EF]/20 p-4 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#2B2B2B]">Simulated Component Span:</span>
                <div className="flex items-center gap-1">
                  {Array.from({ length: currentGridToken.columns }).map((_, idx) => (
                    <button
                      key={idx + 1}
                      onClick={() => setActiveColumnSpan(idx + 1)}
                      className={`w-6 h-6 rounded text-[10px] font-mono font-bold cursor-pointer transition-all ${activeColumnSpan === idx + 1 ? 'bg-[#E89B52] text-white scale-105' : 'bg-white border border-[#E7DED1] text-[#666666] hover:bg-[#FAF6EF]'}`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                  <span className="text-[10px] text-[#666666] ml-1">of {currentGridToken.columns} cols</span>
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-semibold text-[#666666]">
                <input
                  type="checkbox"
                  checked={showGridOverlay}
                  onChange={(e) => setShowGridOverlay(e.target.checked)}
                  className="rounded border-[#E7DED1] text-[#E89B52]"
                />
                <span>Toggle Column Overlay</span>
              </label>
            </div>

            {/* Visual Canvas Viewport Container */}
            <div
              className="bg-white border-2 border-[#E7DED1] rounded-lg transition-all duration-300 relative overflow-hidden shadow-xs"
              style={{ padding: `${currentGridToken.marginPx}px` }}
            >
              <div className="mb-2 flex items-center justify-between text-[10px] font-mono text-[#9E9E9E]">
                <span>← Outer Page Margin ({currentGridToken.pageMargin})</span>
                <span>Container: {currentGridToken.maxContainerWidth}</span>
                <span>Outer Page Margin ({currentGridToken.pageMargin}) →</span>
              </div>

              {/* Grid Column Columns Container */}
              <div
                className="grid transition-all duration-300 relative"
                style={{
                  gridTemplateColumns: `repeat(${currentGridToken.columns}, minmax(0, 1fr))`,
                  gap: `${currentGridToken.gutterPx}px`
                }}
              >
                {/* Visual Column Guides */}
                {showGridOverlay && Array.from({ length: currentGridToken.columns }).map((_, idx) => (
                  <div
                    key={idx}
                    className="h-28 bg-[#C79A2B]/10 border border-dashed border-[#C79A2B]/30 rounded flex flex-col items-center justify-center text-[10px] font-mono font-bold text-[#C79A2B]"
                  >
                    <span>C{idx + 1}</span>
                  </div>
                ))}

                {/* Simulated Component Card spanning columns */}
                <div
                  className="absolute inset-y-0 left-0 bg-[#E89B52]/90 text-white rounded-lg p-3 shadow-md flex flex-col justify-between transition-all duration-300 z-10"
                  style={{
                    gridColumn: `span ${Math.min(activeColumnSpan, currentGridToken.columns)} / span ${Math.min(activeColumnSpan, currentGridToken.columns)}`,
                    width: `calc(${(Math.min(activeColumnSpan, currentGridToken.columns) / currentGridToken.columns) * 100}% - ${currentGridToken.gutterPx * (1 - Math.min(activeColumnSpan, currentGridToken.columns) / currentGridToken.columns)}px)`
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold font-display">Spanning {Math.min(activeColumnSpan, currentGridToken.columns)} Column(s)</span>
                    <span className="text-[9px] font-mono font-bold bg-black/20 px-1.5 py-0.5 rounded">
                      {Math.round((Math.min(activeColumnSpan, currentGridToken.columns) / currentGridToken.columns) * 100)}% Width
                    </span>
                  </div>
                  <p className="text-[10px] opacity-90 truncate">
                    Liora Begena Course Module Card / Dashboard Panel
                  </p>
                </div>
              </div>
            </div>

            <p className="text-xs text-[#666666] leading-relaxed italic">
              {currentGridToken.usage}
            </p>
          </div>

          {/* Grid Tokens Specifications Matrix */}
          <div>
            <h5 className="font-display font-bold text-md text-[#2B2B2B] mb-3">Grid Breakdown Matrix</h5>
            <div className="border border-[#E7DED1] rounded-lg overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#FAF6EF] border-b border-[#E7DED1] text-[10px] font-bold text-[#2B2B2B] uppercase tracking-wider">
                    <th className="p-3">Device Target</th>
                    <th className="p-3">Breakpoint Range</th>
                    <th className="p-3">Column Count</th>
                    <th className="p-3">Gutter (Gap)</th>
                    <th className="p-3">Outer Page Margin</th>
                    <th className="p-3">Max Container Width</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E7DED1] text-[#666666]">
                  {gridTokens.map((g) => (
                    <tr
                      key={g.device}
                      onClick={() => setSelectedGridDevice(g.device)}
                      className={`cursor-pointer transition-colors ${selectedGridDevice === g.device ? 'bg-[#FAF6EF]/60 font-semibold text-[#2B2B2B]' : 'hover:bg-[#FAF6EF]/30'}`}
                    >
                      <td className="p-3 font-bold text-[#2B2B2B] flex items-center gap-2">
                        {g.device === 'Mobile' && <Smartphone size={14} className="text-[#E89B52]" />}
                        {g.device === 'Tablet' && <Tablet size={14} className="text-[#C79A2B]" />}
                        {g.device === 'Desktop' && <Monitor size={14} className="text-[#2B2B2B]" />}
                        {g.device === 'Wide Desktop' && <Maximize2 size={14} className="text-[#6F4E37]" />}
                        <span>{g.device}</span>
                      </td>
                      <td className="p-3 font-mono">{g.breakpoint}</td>
                      <td className="p-3 font-mono font-bold text-[#E89B52]">{g.columns} Columns</td>
                      <td className="p-3 font-mono">{g.gutter}</td>
                      <td className="p-3 font-mono">{g.pageMargin}</td>
                      <td className="p-3 font-mono font-bold">{g.maxContainerWidth}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 5. BORDERS, CONTAINERS & ELEVATION TAB */}
      {activeTab === 'layout' && (
        <div className="space-y-6">
          {/* Responsive Containers section */}
          <div>
            <h5 className="font-display font-bold text-md text-[#2B2B2B] mb-3">Responsive Container Maximum Widths</h5>
            <div className="space-y-3">
              {containerTokens.map((ct) => (
                <div key={ct.name} className="flex flex-col md:flex-row items-start md:items-center justify-between p-3 border border-[#E7DED1] rounded-lg bg-[#FAF6EF]/15 hover:border-[#C79A2B]/40 transition-colors gap-2">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold bg-[#FAF6EF] px-2 py-1 rounded border border-[#E7DED1] text-[#E89B52]">
                      {ct.name}
                    </span>
                    <span className="font-mono text-xs font-semibold text-[#2B2B2B]">{ct.maxWidth}</span>
                  </div>
                  <div className="text-xs text-[#666666] flex items-center gap-2">
                    <span className="font-mono text-[10px] text-[#C79A2B]">Padding: {ct.padding}</span>
                    <span>•</span>
                    <span>{ct.usage}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Border Radius section */}
          <div>
            <h5 className="font-display font-bold text-md text-[#2B2B2B] mb-3">Border Radius Systems</h5>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {radiusTokens.map((r) => (
                <div key={r.name} className="border border-[#E7DED1] p-3 rounded-lg text-center bg-[#FAF6EF]/15">
                  <div
                    className="w-12 h-12 bg-[#E89B52] mx-auto mb-2 border border-[#E7DED1]"
                    style={{ borderRadius: r.value }}
                  />
                  <p className="font-mono text-xs font-bold text-[#2B2B2B]">{r.name}</p>
                  <p className="text-[10px] text-[#666666] mt-0.5">{r.value}</p>
                  <p className="text-[9px] text-[#666666] italic mt-1 leading-normal">{r.usage}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Shadows section */}
          <div>
            <h5 className="font-display font-bold text-md text-[#2B2B2B] mb-3">Subtle Elevation & Shadows</h5>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {shadowTokens.map((sh) => (
                <div
                  key={sh.name}
                  className="bg-white border border-[#E7DED1] p-4 rounded-lg text-left transition-shadow"
                  style={{ boxShadow: sh.value }}
                >
                  <p className="font-mono text-xs font-bold text-[#2B2B2B]">{sh.name}</p>
                  <p className="text-[10px] text-[#9E9E9E] mt-1 font-mono break-all">{sh.value}</p>
                  <p className="text-[11px] text-[#666666] mt-2 leading-relaxed">{sh.usage}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Responsive Breakpoints section */}
          <div>
            <h5 className="font-display font-bold text-md text-[#2B2B2B] mb-3">Responsive Layout Breakpoints</h5>
            <div className="space-y-3">
              {breakpointTokens.map((b) => (
                <div key={b.name} className="flex items-center justify-between p-3 border border-[#E7DED1] rounded-lg bg-[#FAF6EF]/10">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold bg-[#FAF6EF] px-2 py-1 rounded border border-[#E7DED1] text-[#E89B52]">
                      {b.name}
                    </span>
                    <span className="font-mono text-xs font-semibold text-[#2B2B2B]">{b.value}</span>
                  </div>
                  <span className="text-xs text-[#666666]">{b.usage}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


