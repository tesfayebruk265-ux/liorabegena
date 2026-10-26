import React, { useState } from 'react';
import {
  Compass,
  FileText,
  Users,
  CreditCard,
  CheckCircle,
  Accessibility,
  Heart,
  Palette,
  Layout,
  Music,
  ShoppingBag,
  MapPin,
  Move,
  LayoutGrid,
  Maximize2
} from 'lucide-react';
import { roleTokens, gridTokens, containerTokens } from '../data/tokensData';

export function GuidelinesSection() {
  const [activeTab, setActiveTab] = useState<'brand' | 'spacing-grid' | 'culture' | 'accessibility' | 'roles' | 'future'>('brand');

  return (
    <div className="bg-white border border-[#E7DED1] rounded-2xl p-6 shadow-sm text-left">
      <div className="flex flex-wrap gap-2 mb-6 border-b border-[#E7DED1] pb-4">
        <button
          onClick={() => setActiveTab('brand')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition-colors cursor-pointer ${activeTab === 'brand' ? 'bg-[#6F4E37] text-white' : 'bg-transparent text-[#666666] hover:bg-[#FAF6EF]'}`}
        >
          <Palette size={16} />
          <span>Brand Alignment</span>
        </button>

        <button
          onClick={() => setActiveTab('spacing-grid')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition-colors cursor-pointer ${activeTab === 'spacing-grid' ? 'bg-[#6F4E37] text-white' : 'bg-transparent text-[#666666] hover:bg-[#FAF6EF]'}`}
        >
          <LayoutGrid size={16} />
          <span>Spacing & Responsive Grid</span>
        </button>

        <button
          onClick={() => setActiveTab('culture')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition-colors cursor-pointer ${activeTab === 'culture' ? 'bg-[#6F4E37] text-white' : 'bg-transparent text-[#666666] hover:bg-[#FAF6EF]'}`}
        >
          <Music size={16} />
          <span>Cultural System</span>
        </button>

        <button
          onClick={() => setActiveTab('accessibility')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition-colors cursor-pointer ${activeTab === 'accessibility' ? 'bg-[#6F4E37] text-white' : 'bg-transparent text-[#666666] hover:bg-[#FAF6EF]'}`}
        >
          <Accessibility size={16} />
          <span>Accessibility</span>
        </button>

        <button
          onClick={() => setActiveTab('roles')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition-colors cursor-pointer ${activeTab === 'roles' ? 'bg-[#6F4E37] text-white' : 'bg-transparent text-[#666666] hover:bg-[#FAF6EF]'}`}
        >
          <Users size={16} />
          <span>Role Structures</span>
        </button>

        <button
          onClick={() => setActiveTab('future')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition-colors cursor-pointer ${activeTab === 'future' ? 'bg-[#6F4E37] text-white' : 'bg-transparent text-[#666666] hover:bg-[#FAF6EF]'}`}
        >
          <Layout size={16} />
          <span>Future Workflows</span>
        </button>
      </div>

      {/* Brand Alignment Tab */}
      {activeTab === 'brand' && (
        <div className="space-y-6">
          <div>
            <h4 className="font-display font-bold text-xl text-[#2B2B2B] flex items-center gap-2">
              <Compass size={20} className="text-[#E89B52]" />
              <span>Project Vision & Visual Personality</span>
            </h4>
            <p className="text-sm text-[#666666] mt-1.5 leading-relaxed">
              Liora Begena School in Addis Ababa preserves and teaches the ancient spiritual and cultural music of Ethiopia. The platform must represent a premium digital sanctuary of learning rather than a mechanical SaaS interface.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-green-50/50 border border-green-100">
              <h5 className="text-xs font-bold uppercase tracking-wider text-green-800 mb-2">DO THESE (Brand Guidelines)</h5>
              <ul className="text-xs text-green-900 space-y-2 list-disc pl-4">
                <li><strong>Use generous whitespace:</strong> Give every instrument module breathing room to feel calm and meditative.</li>
                <li><strong>Color restraint:</strong> Use Primary Orange (#E89B52) only on interactive triggers, links, and active badges.</li>
                <li><strong>Warm background dominance:</strong> Keep margins and screens primarily in Warm Ivory (#FFFDF8) and Soft Cream (#FAF6EF).</li>
                <li><strong>Professional copy:</strong> Always use real musical terminology (e.g., Tizita, Kebero, Buzz soundboards) and respectful student contexts.</li>
              </ul>
            </div>

            <div className="p-4 rounded-lg bg-red-50/50 border border-red-100">
              <h5 className="text-xs font-bold uppercase tracking-wider text-red-800 mb-2">NEVER DO THESE (Anti-AI-Slop & Design Errors)</h5>
              <ul className="text-xs text-red-900 space-y-2 list-disc pl-4">
                <li><strong>No simulated logging or container status lines:</strong> Avoid adding fake terminal lines like "CONTAINER_PORT: 3000" or status badges in corners.</li>
                <li><strong>No generic purple or blue gradients:</strong> These scream "low-budget SaaS boilerplate."</li>
                <li><strong>No compressed components:</strong> Ensure tables and grids stack elegantly on smaller breakpoints.</li>
                <li><strong>No mock Latin words:</strong> Never use Lorem Ipsum; use actual traditional Ethiopian curriculum content.</li>
              </ul>
            </div>
          </div>

          <div className="p-4 border border-[#E7DED1] rounded-lg bg-[#FAF6EF]/30">
            <h5 className="text-sm font-semibold text-[#2B2B2B] mb-2">School Main Branch (Centralized Operations)</h5>
            <div className="grid grid-cols-1 max-w-sm mx-auto text-center">
              <div className="bg-white border border-[#E7DED1] p-3 rounded-md shadow-2xs">
                <MapPin size={16} className="text-[#C79A2B] mx-auto mb-1" />
                <p className="text-xs font-bold text-[#2B2B2B]">Hawassa main Branch</p>
                <p className="text-[10px] text-[#666666] mt-0.5">Center Point Tower, 1st Floor, Hawassa, Ethiopia</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Spacing & Responsive Grid Guidelines Tab */}
      {activeTab === 'spacing-grid' && (
        <div className="space-y-6">
          <div>
            <h4 className="font-display font-bold text-xl text-[#2B2B2B] flex items-center gap-2">
              <LayoutGrid size={20} className="text-[#E89B52]" />
              <span>Spacing Scale & Responsive Grid System Guidelines</span>
            </h4>
            <p className="text-sm text-[#666666] mt-1.5 leading-relaxed">
              Our layout architecture strictly enforces a <strong>base 4px spacing scale</strong> and a <strong>fluid multi-column grid</strong> (12-column Desktop, 8-column Tablet, 4-column Mobile) to ensure balanced whitespace, fluid responsiveness, and clear visual hierarchy across all viewports.
            </p>
          </div>

          {/* Core Principles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border border-[#E7DED1] rounded-xl bg-[#FAF6EF]/30 space-y-2">
              <h5 className="text-xs font-bold uppercase tracking-wider text-[#2B2B2B] flex items-center gap-1.5">
                <Move size={14} className="text-[#E89B52]" />
                <span>4px Incremental Spacing Principles</span>
              </h5>
              <ul className="text-xs text-[#666666] space-y-2 list-disc pl-4 leading-relaxed">
                <li><strong>Base 4px Scale:</strong> All margins, padding, and gaps must strictly use values derived from 4px increments: <code>4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 48px, 64px, 80px, 96px, 128px</code>.</li>
                <li><strong>Rhythmic Padding:</strong> Button horizontal padding is mathematically 2x its vertical padding (e.g., <code>py-2 px-4</code> or <code>py-3 px-6</code>).</li>
                <li><strong>Nested Radius Formula:</strong> When nesting rounded containers, calculate inner corner radius as <code>Inner Radius = Outer Radius - Padding</code>.</li>
                <li><strong>No Odd Increments:</strong> Avoid arbitrary or fractional pixel spacing (e.g., avoid 7px or 13px) to protect visual layout rhythm.</li>
              </ul>
            </div>

            <div className="p-4 border border-[#E7DED1] rounded-xl bg-[#FAF6EF]/30 space-y-2">
              <h5 className="text-xs font-bold uppercase tracking-wider text-[#2B2B2B] flex items-center gap-1.5">
                <LayoutGrid size={14} className="text-[#C79A2B]" />
                <span>Responsive Grid & Container Rules</span>
              </h5>
              <ul className="text-xs text-[#666666] space-y-2 list-disc pl-4 leading-relaxed">
                <li><strong>12-Column Desktop Grid (&gt;= 1024px):</strong> Provides maximum density for multi-card syllabi, split sidebars, and admin consoles. Gutters: 24px/32px.</li>
                <li><strong>8-Column Tablet Grid (768px - 1023px):</strong> Enables 2-column card layouts and side-by-side forms. Gutters: 20px, Outer Margins: 24px.</li>
                <li><strong>4-Column Mobile Grid (&lt; 768px):</strong> Ensures clean single-column card stacks with touch targets at least 44px. Gutters & Outer Margins: 16px.</li>
                <li><strong>Centered Max Width:</strong> Wrap main page contents in <code>max-w-7xl mx-auto</code> (1400px limit) to prevent awkward ultra-wide stretching.</li>
              </ul>
            </div>
          </div>

          {/* Grid Spec Overview Table */}
          <div className="border border-[#E7DED1] rounded-lg overflow-hidden bg-white">
            <div className="p-3 bg-[#FAF6EF] border-b border-[#E7DED1]">
              <h5 className="text-xs font-bold uppercase tracking-wider text-[#2B2B2B]">Platform Breakpoint & Grid Specifications</h5>
            </div>
            <div className="divide-y divide-[#E7DED1] text-xs">
              {gridTokens.map((g) => (
                <div key={g.device} className="p-3 flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#2B2B2B]">{g.device}</span>
                    <span className="text-[10px] font-mono text-[#E89B52] bg-[#FAF6EF] px-2 py-0.5 rounded border border-[#E7DED1]">{g.breakpoint}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 font-mono text-[11px] text-[#666666]">
                    <span>Cols: <strong className="text-[#2B2B2B]">{g.columns}</strong></span>
                    <span>•</span>
                    <span>Gutter: <strong className="text-[#2B2B2B]">{g.gutter}</strong></span>
                    <span>•</span>
                    <span>Margin: <strong className="text-[#2B2B2B]">{g.pageMargin}</strong></span>
                    <span>•</span>
                    <span>Max Container: <strong className="text-[#C79A2B]">{g.maxContainerWidth}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Cultural System Tab */}
      {activeTab === 'culture' && (
        <div className="space-y-6">
          <div>
            <h4 className="font-display font-bold text-xl text-[#2B2B2B] flex items-center gap-2">
              <Music size={20} className="text-[#C79A2B]" />
              <span>Cultural Design Language</span>
            </h4>
            <p className="text-sm text-[#666666] mt-1.5 leading-relaxed">
              Our cultural design language is inspired directly by the structural layout and aesthetics of traditional Ethiopian instruments and clothing. It should elevate but never overload the user experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-[#E7DED1] rounded-lg p-4 bg-white">
              <div className="text-xl mb-2">🎻</div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-[#2B2B2B] mb-1">Begena Craftsmanship</h5>
              <p className="text-[11px] text-[#666666] leading-relaxed">
                The 10-string Begena soundbox is crafted from deep mahogany or walnut woods, wrapped in parchment. We reflect this spiritually deep instrument through <strong>Walnut Brown (#6F4E37)</strong> accent bands and decorative separator rules.
              </p>
            </div>

            <div className="border border-[#E7DED1] rounded-lg p-4 bg-white">
              <div className="text-xl mb-2">🧵</div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-[#2B2B2B] mb-1">Habesha Tilet Motifs</h5>
              <p className="text-[11px] text-[#666666] leading-relaxed">
                Traditional clothing features colorful, hand-woven geometric patterns. We implement our SVG <strong>TiletPattern</strong> on certificates, structural dividers, and footer highlights to express cultural pride.
              </p>
            </div>

            <div className="border border-[#E7DED1] rounded-lg p-4 bg-white">
              <div className="text-xl mb-2">📜</div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-[#2B2B2B] mb-1">Amharic Typography</h5>
              <p className="text-[11px] text-[#666666] leading-relaxed">
                The Ethiopic Ge'ez alphabet holds incredible historical weight. All localized interfaces must support <strong>Noto Sans Ethiopic</strong> to ensure legible, beautiful, and authentic text rendering.
              </p>
            </div>
          </div>

          <div className="p-4 border border-dashed border-[#C79A2B] rounded-lg bg-[#FAF6EF]/35 flex items-center gap-4">
            <div className="shrink-0 text-2xl">⚡</div>
            <p className="text-xs text-[#2B2B2B] leading-relaxed">
              <strong>Rule of Moderation:</strong> A cultural accent should comprise no more than <strong>5%</strong> of any screen space. Use them on subtle header borders, email templates, empty states, and PDF certificates.
            </p>
          </div>
        </div>
      )}

      {/* Accessibility Tab */}
      {activeTab === 'accessibility' && (
        <div className="space-y-6">
          <div>
            <h4 className="font-display font-bold text-xl text-[#2B2B2B] flex items-center gap-2">
              <Accessibility size={20} className="text-[#E89B52]" />
              <span>Accessibility & Usability Foundations</span>
            </h4>
            <p className="text-sm text-[#666666] mt-1.5 leading-relaxed">
              We design with high empathy to ensure that students of all backgrounds and technical capacities can master traditional instruments easily.
            </p>
          </div>

          <div className="space-y-4 text-xs text-[#666666]">
            <div className="flex items-start gap-3 p-3 border border-[#E7DED1] rounded-lg bg-[#FAF6EF]/20">
              <CheckCircle size={16} className="text-green-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#2B2B2B] block mb-0.5">1. Contrast Compliance (WCAG AA)</strong>
                Every font pairing meets or exceeds WCAG AA 4.5:1 standards. Contrast our Deep Charcoal (#2B2B2B) exclusively on Warm Ivory (#FFFDF8) and white. Never overlay gold text on white without solid dark borders.
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 border border-[#E7DED1] rounded-lg bg-[#FAF6EF]/20">
              <CheckCircle size={16} className="text-green-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#2B2B2B] block mb-0.5">2. Safe Touch Targets</strong>
                Interactive buttons, selection items, and links in the responsive layout are designed with a minimum touch surface of <strong>44 × 44 pixels</strong> to optimize mobile finger tapping.
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 border border-[#E7DED1] rounded-lg bg-[#FAF6EF]/20">
              <CheckCircle size={16} className="text-green-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#2B2B2B] block mb-0.5">3. Non-Visual State cues</strong>
                Never communicate status solely with color. If a transaction fails or attendance is missed, append literal icons (e.g., alert icons) alongside the red alert block.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Role Structures Tab */}
      {activeTab === 'roles' && (
        <div className="space-y-6">
          <div>
            <h4 className="font-display font-bold text-xl text-[#2B2B2B] flex items-center gap-2">
              <Users size={20} className="text-[#6F4E37]" />
              <span>Future User Role Architecture</span>
            </h4>
            <p className="text-sm text-[#666666] mt-1.5 leading-relaxed">
              Our component system is designed to support 10 different target user roles in the long-term school ecosystem. Each role inherits the centralized branding system while maintaining custom workflow layouts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {roleTokens.map((role) => (
              <div key={role.name} className="p-4 border border-[#E7DED1] rounded-lg bg-white shadow-3xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#2B2B2B]">{role.name}</span>
                    <span className="text-[9px] font-bold text-[#C79A2B] bg-[#FAF6EF] px-1.5 py-0.5 rounded uppercase font-mono">
                      System Role
                    </span>
                  </div>
                  <p className="text-[11px] text-[#666666] mt-1.5 leading-relaxed">
                    {role.description}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-[#FAF6EF] text-[10px] text-[#666666]">
                  Primary Viewport: <strong className="text-[#6F4E37]">{role.primaryDashboard}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Future Workflows Tab */}
      {activeTab === 'future' && (
        <div className="space-y-6">
          <div>
            <h4 className="font-display font-bold text-xl text-[#2B2B2B] flex items-center gap-2">
              <Layout size={20} className="text-[#E89B52]" />
              <span>Future Core Modules Blueprints</span>
            </h4>
            <p className="text-sm text-[#666666] mt-1.5 leading-relaxed">
              The design tokens and component libraries contain layout properties to easily assemble these critical platforms in subsequent phases.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-[#E7DED1] rounded-lg p-4 bg-[#FAF6EF]/30 text-left">
              <div className="w-8 h-8 rounded-full bg-[#E89B52]/10 text-[#E89B52] flex items-center justify-center mb-3">
                <Layout size={18} />
              </div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-[#2B2B2B] mb-1">Student LMS Module</h5>
              <p className="text-[11px] text-[#666666] leading-relaxed">
                Combines video lessons, pentatonic speed controls, real-time practice duration checkers, homework submission portals, and certificate trackers.
              </p>
            </div>

            <div className="border border-[#E7DED1] rounded-lg p-4 bg-[#FAF6EF]/30 text-left">
              <div className="w-8 h-8 rounded-full bg-[#C79A2B]/10 text-[#C79A2B] flex items-center justify-center mb-3">
                <CreditCard size={18} />
              </div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-[#2B2B2B] mb-1">Receipts & Financials</h5>
              <p className="text-[11px] text-[#666666] leading-relaxed">
                Connects student uploader components with CBE & Telebirr APIs. Accountant panel verifies ledger transactions directly on centralized receipts.
              </p>
            </div>

            <div className="border border-[#E7DED1] rounded-lg p-4 bg-[#FAF6EF]/30 text-left">
              <div className="w-8 h-8 rounded-full bg-[#6F4E37]/10 text-[#6F4E37] flex items-center justify-center mb-3">
                <ShoppingBag size={18} />
              </div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-[#2B2B2B] mb-1">Instrument Store</h5>
              <p className="text-[11px] text-[#666666] leading-relaxed">
                E-commerce listing of authentic Begena, Krar strings, and Washint reeds with checkout tracking systems and branch pickup coordinates.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

