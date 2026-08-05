import React, { useState } from 'react';
import {
  Button,
  Input,
  Toggle,
  Checkbox,
  Radio,
  CourseCard,
  StatsCard,
  GoalTracker,
  ReceiptUploader,
  InteractivePracticePlayer,
  Alert,
  DecorativeCertificateDemo
} from './InteractiveComponents';
import {
  Sparkles,
  Award,
  Mail,
  User,
  Activity,
  Heart,
  ChevronRight,
  BookOpen,
  Eye,
  Settings,
  Bell,
  Code,
  Terminal,
  Check,
  Copy,
  ChevronDown,
  Phone,
  Lock
} from 'lucide-react';

type ComponentCategory = 'buttons' | 'inputs' | 'selection' | 'cards' | 'feedback' | 'practice';

export function ComponentPlayground() {
  const [activeCategory, setActiveCategory] = useState<ComponentCategory>('buttons');
  
  // State overrides for Playground customizer
  const [btnState, setBtnState] = useState<'default' | 'hover' | 'active' | 'focus' | 'disabled'>('default');
  const [btnSize, setBtnSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [btnIcon, setBtnIcon] = useState<boolean>(true);
  const [btnLoading, setBtnLoading] = useState<boolean>(false);

  // Input overrides
  const [inputState, setInputState] = useState<'default' | 'focus' | 'filled' | 'error' | 'success' | 'disabled'>('default');
  const [inputError, setInputError] = useState<string>('');
  const [inputSuccess, setInputSuccess] = useState<string>('');

  // Selection state
  const [toggleVal, setToggleVal] = useState(true);
  const [checkVal, setCheckVal] = useState(false);
  const [radioVal, setRadioVal] = useState<'piazza' | 'megenagna' | 'lebu'>('piazza');

  // Copy state
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const triggerCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const getCodeSnippet = () => {
    switch (activeCategory) {
      case 'buttons':
        return `import { Button } from './components/InteractiveComponents';
import { Sparkles } from 'lucide-react';

// Primary Action Button
<Button
  variant="primary"
  size="${btnSize}"
  forceState="${btnState}"
  ${btnLoading ? 'isLoading={true}' : ''}
  ${btnIcon ? 'leftIcon={<Sparkles size={16} />}' : ''}
>
  Begin Learning
</Button>

// Secondary/Outline Style
<Button variant="secondary" size="${btnSize}" forceState="${btnState}">
  Browse Syllabus
</Button>

// Ghost/Text-Only Style
<Button variant="ghost">Cancel</Button>
`;
      case 'inputs':
        return `import { Input } from './components/InteractiveComponents';
import { User } from 'lucide-react';

<Input
  label="Full Name"
  placeholder="e.g. Tewodros Kassahun"
  leftIcon={<User size={16} />}
  forceState="${inputState}"
  ${inputState === 'error' ? 'errorMessage="Full name must match student credentials"' : ''}
  ${inputState === 'success' ? 'successMessage="Name validated in registrar database"' : ''}
/>
`;
      case 'selection':
        return `import { Toggle, Checkbox, Radio } from './components/InteractiveComponents';

// Switch Toggle
<Toggle
  label="Receive course reminders over Telegram"
  checked={${toggleVal}}
  onChange={(val) => setToggleVal(val)}
/>

// Checkbox
<Checkbox
  label="I agree to the traditional code of ethics"
  checked={${checkVal}}
  onChange={(val) => setCheckVal(val)}
/>

// Radio (Single choice)
<Radio
  label="Piazza Branch"
  checked={radioVal === 'piazza'}
  onChange={() => setRadioVal('piazza')}
/>
`;
      case 'cards':
        return `import { CourseCard, StatsCard } from './components/InteractiveComponents';
import { BookOpen } from 'lucide-react';

// Core Syllabus Card
<CourseCard
  title="Begena Foundations: Sacred 10-String Buzz"
  instrument="Begena"
  duration="12 Weeks"
  lessons={24}
  level="Beginner"
  price="3,200 ETB"
  rating={4.9}
  imageUrl="https://images.unsplash.com/photo-1511192336575-5a79af67a629"
/>

// Metric Summary Card
<StatsCard
  title="Active Students"
  value="842"
  change="12%"
  icon={BookOpen}
/>
`;
      case 'feedback':
        return `import { Alert, DecorativeCertificateDemo } from './components/InteractiveComponents';

// Success/Error Feedback alert
<Alert type="success" title="Payment Receipt Authenticated">
  Accountant verified 3,200 ETB transaction ref #ABS-948123 via Telebirr ledger. Enrollment activated.
</Alert>

// Golden Premium Certificate template
<DecorativeCertificateDemo />
`;
      case 'practice':
      default:
        return `import { InteractivePracticePlayer } from './components/InteractiveComponents';

// Interactive Practice accompaniment system
<InteractivePracticePlayer />
`;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
      {/* Category selector column */}
      <div className="lg:col-span-3 flex flex-col gap-1.5">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#9E9E9E] px-3 mb-2 select-none">
          Component Modules
        </span>
        
        {[
          { id: 'buttons', label: 'Action Buttons', count: 7 },
          { id: 'inputs', label: 'Input Fields', count: 7 },
          { id: 'selection', label: 'Selection Controls', count: 7 },
          { id: 'cards', label: 'Layout Cards', count: 9 },
          { id: 'feedback', label: 'Feedback Alerts', count: 8 },
          { id: 'practice', label: 'Music Playback & LMS', count: 4 }
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setActiveCategory(item.id as ComponentCategory);
              // Reset interactive helpers
              setInputError('');
              setInputSuccess('');
            }}
            className={`px-4 py-3 text-sm font-semibold rounded-lg flex items-center justify-between border transition-all cursor-pointer ${activeCategory === item.id ? 'bg-[#FAF6EF] border-[#C79A2B] text-[#C79A2B] font-bold shadow-3xs' : 'bg-transparent border-transparent text-[#666666] hover:bg-[#FAF6EF]/50 hover:text-[#2B2B2B]'}`}
          >
            <span>{item.label}</span>
            <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${activeCategory === item.id ? 'bg-[#E89B52] text-white' : 'bg-[#FAF6EF] text-[#666666]'}`}>
              {item.count} items
            </span>
          </button>
        ))}
      </div>

      {/* Main interactive showcase & parameters panel */}
      <div className="lg:col-span-9 space-y-6">
        <div className="bg-white border border-[#E7DED1] rounded-2xl p-6 shadow-sm">
          {/* Active Title */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-4 border-b border-[#E7DED1]">
            <div>
              <h4 className="font-display font-bold text-lg text-[#2B2B2B] capitalize">
                {activeCategory === 'practice' ? 'Music Learning Companion' : `${activeCategory} Playground`}
              </h4>
              <p className="text-xs text-[#666666] mt-0.5">
                Inspect how each state compiles under native spacing and accessibility configurations.
              </p>
            </div>
            
            {/* Sizing guides */}
            <span className="text-[10px] font-mono font-bold bg-[#FAF6EF] border border-[#E7DED1] text-[#C79A2B] px-2.5 py-1 rounded">
              {activeCategory === 'practice' ? 'Interactive Web Audio' : 'Responsive Grid Native'}
            </span>
          </div>

          {/* Interactive Playground Control Center */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
            {/* Left Box: Visual Previewer */}
            <div className="md:col-span-8 border border-dashed border-[#E7DED1] rounded-xl p-6 flex flex-col justify-center items-center bg-[#FAF6EF]/20 min-h-[220px]">
              
              {/* BUTTONS CATEGORY PREVIEW */}
              {activeCategory === 'buttons' && (
                <div className="flex flex-col gap-4 w-full max-w-xs items-center">
                  <Button
                    variant="primary"
                    size={btnSize}
                    forceState={btnState}
                    isLoading={btnLoading}
                    leftIcon={btnIcon ? <Sparkles size={16} /> : undefined}
                  >
                    Primary Orange Button
                  </Button>
                  
                  <Button
                    variant="secondary"
                    size={btnSize}
                    forceState={btnState}
                    isLoading={btnLoading}
                    leftIcon={btnIcon ? <Award size={16} /> : undefined}
                  >
                    Secondary Gold Border
                  </Button>

                  <Button
                    variant="tertiary"
                    size={btnSize}
                    forceState={btnState}
                    isLoading={btnLoading}
                  >
                    Tertiary Walnut Style
                  </Button>

                  <Button
                    variant="ghost"
                    size={btnSize}
                    forceState={btnState}
                  >
                    Ghost/Text Button
                  </Button>
                </div>
              )}

              {/* INPUT FIELDS PREVIEW */}
              {activeCategory === 'inputs' && (
                <div className="space-y-4 w-full max-w-md">
                  <Input
                    label="Registrar Student Name"
                    placeholder="e.g. Tewodros Kassahun"
                    leftIcon={<User size={16} />}
                    forceState={inputState}
                    errorMessage={inputError}
                    successMessage={inputSuccess}
                  />

                  <Input
                    label="LMS Security Code"
                    type="password"
                    placeholder="••••••••"
                    leftIcon={<Lock size={16} />}
                    forceState={inputState}
                  />

                  <Input
                    label="Contact Phone"
                    type="tel"
                    placeholder="+251 911 000 000"
                    leftIcon={<Phone size={16} />}
                    forceState={inputState}
                  />
                </div>
              )}

              {/* SELECTION CONTROLS PREVIEW */}
              {activeCategory === 'selection' && (
                <div className="space-y-6 w-full max-w-xs text-left">
                  <Toggle
                    label="Enable SMS Cohort Alerts"
                    checked={toggleVal}
                    onChange={(val) => setToggleVal(val)}
                  />

                  <Checkbox
                    label="Ethics Integrity Agreement"
                    checked={checkVal}
                    onChange={(val) => setCheckVal(val)}
                  />

                  <div className="space-y-2 pt-2 border-t border-[#E7DED1]">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#2B2B2B]">
                      Select Desired Branch Location:
                    </span>
                    <div className="space-y-2 mt-1.5">
                      <Radio
                        label="Piazza Core Branch"
                        checked={radioVal === 'piazza'}
                        onChange={() => setRadioVal('piazza')}
                      />
                      <Radio
                        label="Megenagna Branch"
                        checked={radioVal === 'megenagna'}
                        onChange={() => setRadioVal('megenagna')}
                      />
                      <Radio
                        label="Lebu Branch"
                        checked={radioVal === 'lebu'}
                        onChange={() => setRadioVal('lebu')}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* CARDS PREVIEW */}
              {activeCategory === 'cards' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                  <CourseCard
                    title="Begena Advanced: Meditative Chants"
                    instrument="Begena"
                    duration="12 Weeks"
                    lessons={24}
                    level="Advanced"
                    price="3,200 ETB"
                    rating={4.95}
                    imageUrl="https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=400&auto=format&fit=crop"
                  />
                  <div className="space-y-4 flex flex-col justify-between">
                    <StatsCard
                      title="Branch Registrations"
                      value="1,492"
                      change="18.5%"
                      icon={Activity}
                    />
                    <StatsCard
                      title="LMS Lecture Streams"
                      value="28,491"
                      change="24.2%"
                      icon={Award}
                    />
                  </div>
                </div>
              )}

              {/* FEEDBACK ALERTS PREVIEW */}
              {activeCategory === 'feedback' && (
                <div className="space-y-4 w-full">
                  <Alert type="success" title="Academic Certificate Issued">
                    Student Tewodros Kassahun successfully unlocked QR secure code. Verify credentials on central portal.
                  </Alert>

                  <Alert type="error" title="Payment Receipt screenshot Defect">
                    Accountant flagged receipt transaction hash as duplicated. Upload correct Telebirr confirmation statement.
                  </Alert>

                  {/* Certificate showcase */}
                  <div className="pt-2">
                    <DecorativeCertificateDemo />
                  </div>
                </div>
              )}

              {/* MUSIC PLAYBACK & PRACTICE PRACTICE */}
              {activeCategory === 'practice' && (
                <div className="w-full space-y-4">
                  <InteractivePracticePlayer />
                  <ReceiptUploader />
                </div>
              )}

            </div>

            {/* Right Box: Modifiers Control Panel */}
            <div className="md:col-span-4 bg-[#FAF6EF]/30 p-4 rounded-xl border border-[#E7DED1] flex flex-col justify-between">
              <div>
                <h5 className="text-xs font-bold uppercase tracking-wider text-[#2B2B2B] mb-3 pb-1 border-b border-[#E7DED1]">
                  Playground Modifiers
                </h5>

                {/* MODIFIER FOR BUTTONS */}
                {activeCategory === 'buttons' && (
                  <div className="space-y-4">
                    {/* Sizing */}
                    <div>
                      <span className="text-[10px] font-semibold text-[#666666] block mb-1.5 uppercase">Button Size</span>
                      <div className="flex gap-1.5 bg-white p-1 rounded border border-[#E7DED1]">
                        {['sm', 'md', 'lg'].map((sz) => (
                          <button
                            key={sz}
                            onClick={() => setBtnSize(sz as any)}
                            className={`flex-1 py-1 text-xs font-bold rounded-sm transition-colors cursor-pointer capitalize ${btnSize === sz ? 'bg-[#E89B52] text-white shadow-2xs' : 'text-[#666666] hover:bg-[#FAF6EF]'}`}
                          >
                            {sz}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* States Force */}
                    <div>
                      <span className="text-[10px] font-semibold text-[#666666] block mb-1.5 uppercase">Force Design State</span>
                      <select
                        value={btnState}
                        onChange={(e) => setBtnState(e.target.value as any)}
                        className="w-full text-xs font-semibold bg-white border border-[#E7DED1] p-1.5 rounded outline-none focus:border-[#C79A2B]"
                      >
                        <option value="default">Default</option>
                        <option value="hover">Hover</option>
                        <option value="active">Active</option>
                        <option value="focus">Focus Outline</option>
                        <option value="disabled">Disabled</option>
                      </select>
                    </div>

                    {/* Quick checkboxes */}
                    <div className="space-y-2 pt-2 border-t border-[#E7DED1]">
                      <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-[#2B2B2B]">
                        <input
                          type="checkbox"
                          checked={btnIcon}
                          onChange={(e) => setBtnIcon(e.target.checked)}
                          className="rounded border-[#E7DED1] text-[#E89B52]"
                        />
                        <span>Show Left Icon</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-[#2B2B2B]">
                        <input
                          type="checkbox"
                          checked={btnLoading}
                          onChange={(e) => setBtnLoading(e.target.checked)}
                          className="rounded border-[#E7DED1] text-[#E89B52]"
                        />
                        <span>Simulate Loading State</span>
                      </label>
                    </div>
                  </div>
                )}

                {/* MODIFIER FOR INPUTS */}
                {activeCategory === 'inputs' && (
                  <div className="space-y-4">
                    <div>
                      <span className="text-[10px] font-semibold text-[#666666] block mb-1.5 uppercase">Input Design State</span>
                      <select
                        value={inputState}
                        onChange={(e) => {
                          const val = e.target.value as any;
                          setInputState(val);
                          if (val === 'error') {
                            setInputError('Invalid registration lookup ID');
                            setInputSuccess('');
                          } else if (val === 'success') {
                            setInputSuccess('Registration matched with active cohort');
                            setInputError('');
                          } else {
                            setInputError('');
                            setInputSuccess('');
                          }
                        }}
                        className="w-full text-xs font-semibold bg-white border border-[#E7DED1] p-1.5 rounded outline-none focus:border-[#C79A2B]"
                      >
                        <option value="default">Default State</option>
                        <option value="focus">Focus State</option>
                        <option value="filled">Filled State</option>
                        <option value="error">Error State</option>
                        <option value="success">Success State</option>
                        <option value="disabled">Disabled State</option>
                      </select>
                    </div>

                    <div className="text-[10px] leading-relaxed text-[#666666] pt-3 border-t border-[#E7DED1]">
                      <strong>WCAG Compliant Helper:</strong> Input validation alerts include text error strings and geometric alert icons to satisfy accessibility indicators.
                    </div>
                  </div>
                )}

                {/* MODIFIER FOR SELECTION */}
                {activeCategory === 'selection' && (
                  <div className="space-y-2 text-xs text-[#666666] leading-relaxed">
                    <p>
                      <strong>Active States:</strong> Toggle choices render with standard high-contrast orange indicators.
                    </p>
                    <p className="pt-2 border-t border-[#E7DED1]">
                      Current Radio Branch: <strong className="text-[#2B2B2B] capitalize">{radioVal}</strong>
                    </p>
                    <p>
                      Telegram Alert Check: <strong className="text-[#2B2B2B]">{toggleVal ? 'YES' : 'NO'}</strong>
                    </p>
                  </div>
                )}

                {/* MODIFIER FOR CARDS */}
                {activeCategory === 'cards' && (
                  <div className="text-xs text-[#666666] space-y-2 leading-relaxed">
                    <p>
                      <strong>Standard Grid Aspect ratios:</strong> Video cards preserve a 16:9 responsive display aspect ratio to block layout cracking on ultra-wide viewports.
                    </p>
                    <p className="pt-2 border-t border-[#E7DED1]">
                      <strong>Hover transition:</strong> Visual outlines smoothly ease to Gold Accent (#C79A2B) at 200ms scale curves.
                    </p>
                  </div>
                )}

                {/* MODIFIER FOR FEEDBACK */}
                {activeCategory === 'feedback' && (
                  <div className="text-xs text-[#666666] space-y-2 leading-relaxed">
                    <p>
                      <strong>Semantic Color Codes:</strong> Alerts utilize background opacity fills with dense text to prevent optical glare.
                    </p>
                  </div>
                )}

                {/* MODIFIER FOR PRACTICE PLAYBACK */}
                {activeCategory === 'practice' && (
                  <div className="text-xs text-[#666666] space-y-2 leading-relaxed">
                    <p>
                      <strong>Audio accompaniments:</strong> Loops demonstrate continuous background drones for Washint and Begena practice.
                    </p>
                  </div>
                )}

              </div>

              {/* Status footer for each modifier */}
              <div className="pt-3 border-t border-[#E7DED1] text-[9px] font-mono text-[#9E9E9E]">
                Component status: production ready
              </div>
            </div>
          </div>
        </div>

        {/* Mock Terminal showing React code snippet */}
        <div className="bg-[#2B2B2B] rounded-xl overflow-hidden shadow-md text-left font-mono">
          <div className="bg-[#1F1F1F] px-4 py-2 flex items-center justify-between border-b border-[#3D3D3D]">
            <div className="flex items-center gap-1.5">
              <Terminal size={14} className="text-[#E89B52]" />
              <span className="text-xs font-bold text-gray-300">Playground Component Code Inspector</span>
            </div>
            
            <button
              onClick={() => triggerCopyCode(getCodeSnippet())}
              className="text-gray-400 hover:text-white flex items-center gap-1 text-[10px] font-semibold cursor-pointer"
            >
              {copiedCode === getCodeSnippet() ? (
                <>
                  <Check size={10} className="text-green-500" />
                  <span className="text-green-500">Copied!</span>
                </>
              ) : (
                <>
                  <Copy size={10} />
                  <span>Copy Snippet</span>
                </>
              )}
            </button>
          </div>
          
          <pre className="p-4 text-xs text-gray-200 overflow-x-auto leading-relaxed max-h-[300px]">
            <code>{getCodeSnippet()}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}

