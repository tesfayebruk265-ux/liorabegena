import { ColorToken, TypographyToken, SpacingToken, RadiusToken, ShadowToken, BreakpointToken, RoleToken, GridToken, ContainerToken } from '../types/designSystem';

export const colorTokens: ColorToken[] = [
  // Primary Action Tokens
  {
    name: 'Primary (Light Warm Orange)',
    token: 'var(--color-primary)',
    value: '#E89B52',
    usage: 'Core brand action color. Used strategically for primary CTA buttons, active state highlights, progress indicators, and focal points. Reserved as a deliberate accent, never as large background floods.',
    category: 'primary'
  },
  {
    name: 'Primary Hover (Rich Warm Orange)',
    token: 'var(--color-primary-hover)',
    value: '#D88A42',
    usage: 'Hover state for primary buttons and interactive primary controls, offering a smooth tactile feedback transition.',
    category: 'primary'
  },
  {
    name: 'Primary Active (Deep Warm Orange)',
    token: 'var(--color-primary-active)',
    value: '#C47832',
    usage: 'Active/pressed state for primary buttons and interactive controls.',
    category: 'primary'
  },
  {
    name: 'Secondary (Antique Gold)',
    token: 'var(--color-secondary)',
    value: '#C79A2B',
    usage: 'Secondary accent reflecting spiritual and royal Ethiopian musical heritage. Used for secondary buttons, category badges, star ratings, borders, and certificate accents.',
    category: 'secondary'
  },

  // Surface & Background Tokens
  {
    name: 'Background (Warm Ivory)',
    token: 'var(--color-bg-primary)',
    value: '#FFFDF8',
    usage: 'Default page canvas background. A soft off-white that prevents screen glare and provides a warm, natural parchment paper aesthetic.',
    category: 'background'
  },
  {
    name: 'Surface (White)',
    token: 'var(--color-bg-surface)',
    value: '#FFFFFF',
    usage: 'Base container surface for cards, modals, popovers, dropdown menus, and input fields.',
    category: 'background'
  },
  {
    name: 'Surface Elevated (Soft Cream)',
    token: 'var(--color-bg-secondary)',
    value: '#FAF6EF',
    usage: 'Elevated surfaces, nested card wells, secondary section containers, sidebar panels, and subtle container fills.',
    category: 'background'
  },

  // Typography & Text Tokens
  {
    name: 'Text Primary (Deep Charcoal)',
    token: 'var(--color-text-primary)',
    value: '#2B2B2B',
    usage: 'High-contrast, highly legible main text color for headings, body copy, and primary interactive labels.',
    category: 'text'
  },
  {
    name: 'Text Secondary (Warm Gray)',
    token: 'var(--color-text-secondary)',
    value: '#666666',
    usage: 'Subheadings, secondary details, metadata, captions, and placeholder text.',
    category: 'text'
  },
  {
    name: 'Text Muted (Warm Light Gray)',
    token: 'var(--color-text-muted)',
    value: '#9E9E9E',
    usage: 'Disabled text, helper notes, timestamp details, and subtle secondary icons.',
    category: 'text'
  },

  // Border & Divider Tokens
  {
    name: 'Border (Warm Light Gray)',
    token: 'var(--color-border)',
    value: '#E7DED1',
    usage: 'Default border color for cards, input outlines, table dividers, and structural separations.',
    category: 'secondary'
  },

  // Semantic Feedback Tokens
  {
    name: 'Success (Emerald Green)',
    token: 'var(--color-success)',
    value: '#10B981',
    usage: 'Successful payments, verified attendance, passed lessons, correct quiz answers, and active status indicators.',
    category: 'semantic'
  },
  {
    name: 'Warning (Amber)',
    token: 'var(--color-warning)',
    value: '#F59E0B',
    usage: 'Pending verification, upcoming tuition deadlines, and partial practice goals.',
    category: 'semantic'
  },
  {
    name: 'Error (Coral Red)',
    token: 'var(--color-error)',
    value: '#EF4444',
    usage: 'Failed payment uploads, missed lesson quizzes, administrative blocks, and system alert banners.',
    category: 'semantic'
  },
  {
    name: 'Info (Info Blue)',
    token: 'var(--color-info)',
    value: '#3B82F6',
    usage: 'General notifications, announcements, administrative guidance remarks, and info banners.',
    category: 'semantic'
  },

  // Cultural Foundation Token
  {
    name: 'Cultural Accent (Walnut Brown)',
    token: 'var(--color-brand-brown)',
    value: '#6F4E37',
    usage: 'Traditional wood polish color, directly referencing Begena and Krar wooden soundboxes. Used for decorative borders, certificate frames, and cultural accents.',
    category: 'cultural'
  }
];

export const typographyTokens: TypographyToken[] = [
  {
    name: 'Display Large',
    tag: 'h1',
    fontSize: '56px',
    lineHeight: '1.1',
    letterSpacing: '-0.03em',
    fontWeight: '800 (Extra Bold)',
    usage: 'Main landing hero text. Expresses bold brand positioning, utilizing Space Grotesk/Coolvetica for premium impact.'
  },
  {
    name: 'Display Medium',
    tag: 'h2',
    fontSize: '40px',
    lineHeight: '1.2',
    letterSpacing: '-0.02em',
    fontWeight: '700 (Bold)',
    usage: 'Major landing section titles and hero sub-lines.'
  },
  {
    name: 'Display Small',
    tag: 'h3',
    fontSize: '32px',
    lineHeight: '1.25',
    letterSpacing: '-0.01em',
    fontWeight: '700 (Bold)',
    usage: 'Secondary layout highlights and core block banners.'
  },
  {
    name: 'Heading 1 (H1)',
    tag: 'h1',
    fontSize: '28px',
    lineHeight: '1.3',
    letterSpacing: '-0.01em',
    fontWeight: '600 (Semi-Bold)',
    usage: 'Primary layout headings, card titles, and modal headers.'
  },
  {
    name: 'Heading 2 (H2)',
    tag: 'h2',
    fontSize: '24px',
    lineHeight: '1.35',
    letterSpacing: '0',
    fontWeight: '600 (Semi-Bold)',
    usage: 'Sub-headers, component groupings, and standard section title lines.'
  },
  {
    name: 'Heading 3 (H3)',
    tag: 'h3',
    fontSize: '20px',
    lineHeight: '1.4',
    letterSpacing: '0',
    fontWeight: '600 (Semi-Bold)',
    usage: 'Small card titles, item lists, and system modal categories.'
  },
  {
    name: 'Body Large',
    tag: 'p',
    fontSize: '18px',
    lineHeight: '1.6',
    letterSpacing: '0',
    fontWeight: '400 (Regular)',
    usage: 'Introductory paragraphs, key message quotes, and featured text blocks.'
  },
  {
    name: 'Body Regular',
    tag: 'p',
    fontSize: '16px',
    lineHeight: '1.6',
    letterSpacing: '0',
    fontWeight: '400 (Regular)',
    usage: 'Default body copy, descriptions, details, forms, and general interface text. Set to Inter with high contrast.'
  },
  {
    name: 'Body Small',
    tag: 'p',
    fontSize: '14px',
    lineHeight: '1.5',
    letterSpacing: '0',
    fontWeight: '400 (Regular) / 500 (Medium)',
    usage: 'Secondary lists, table items, support guides, and description keys.'
  },
  {
    name: 'Caption',
    tag: 'span',
    fontSize: '12px',
    lineHeight: '1.4',
    letterSpacing: '0.01em',
    fontWeight: '400 (Regular) / 500 (Medium)',
    usage: 'Timestamps, mini pills, breadcrumbs, and helper inputs.'
  },
  {
    name: 'Overline',
    tag: 'span',
    fontSize: '11px',
    lineHeight: '1.2',
    letterSpacing: '0.12em',
    fontWeight: '700 (Bold)',
    usage: 'Mini-headers above major headings, category labels, uppercase uppercase formatting.'
  },
  {
    name: 'Button Text',
    tag: 'span',
    fontSize: '14px',
    lineHeight: '1',
    letterSpacing: '0.01em',
    fontWeight: '600 (Semi-Bold)',
    usage: 'Clickable button labels, text controls, and actions.'
  },
  {
    name: 'Navigation Text',
    tag: 'span',
    fontSize: '15px',
    lineHeight: '1.2',
    letterSpacing: '-0.01em',
    fontWeight: '500 (Medium)',
    usage: 'Header navbar navigation menu items and tab lists.'
  }
];

export const spacingTokens: SpacingToken[] = [
  { name: 'space-1', value: '0.25rem', pixels: 4, tailwindClass: 'p-1 / gap-1 / m-1', usage: 'Micro spacing. Icon tight gaps, badge content padding, and fine list indicators.' },
  { name: 'space-2', value: '0.5rem', pixels: 8, tailwindClass: 'p-2 / gap-2 / m-2', usage: 'Small controls spacing. Button horizontal/vertical borders, tag separations, inline labels.' },
  { name: 'space-3', value: '0.75rem', pixels: 12, tailwindClass: 'p-3 / gap-3 / m-3', usage: 'Compact elements. Input field internal padding, dropdown list item spacings.' },
  { name: 'space-4', value: '1rem', pixels: 16, tailwindClass: 'p-4 / gap-4 / m-4', usage: 'Default element spacing. Layout grids, card padding, content-body gaps, mobile page margins.' },
  { name: 'space-5', value: '1.25rem', pixels: 20, tailwindClass: 'p-5 / gap-5 / m-5', usage: 'Enhanced standard spacing. Vertical card stacks, details-card layouts, tablet grid gutters.' },
  { name: 'space-6', value: '1.5rem', pixels: 24, tailwindClass: 'p-6 / gap-6 / m-6', usage: 'Medium structural sections. Form fields blocks, side columns, inner panels, tablet margins.' },
  { name: 'space-8', value: '2rem', pixels: 32, tailwindClass: 'p-8 / gap-8 / m-8', usage: 'Large cards. Outer container padding, modal boundaries, desktop grid gutters & margins.' },
  { name: 'space-10', value: '2.5rem', pixels: 40, tailwindClass: 'p-10 / gap-10 / m-10', usage: 'Section separations. Standard page titles, list categories, footer grids.' },
  { name: 'space-12', value: '3rem', pixels: 48, tailwindClass: 'p-12 / gap-12 / m-12', usage: 'Hero banners, prominent spacing dividers, full layout sections, wide page margins.' },
  { name: 'space-16', value: '4rem', pixels: 64, tailwindClass: 'p-16 / gap-16 / m-16', usage: 'Generous negative spacing. Landing page hero sections, outer header-hero offsets.' },
  { name: 'space-20', value: '5rem', pixels: 80, tailwindClass: 'p-20 / gap-20 / m-20', usage: 'Cinematic negative margins. Hero banner vertical padding, landing page division blocks.' },
  { name: 'space-24', value: '6rem', pixels: 96, tailwindClass: 'p-24 / gap-24 / m-24', usage: 'Large section breaks. Major platform portal transitions and feature block spaces.' },
  { name: 'space-32', value: '8rem', pixels: 128, tailwindClass: 'p-32 / gap-32 / m-32', usage: 'Maximum scale limit. Ultra-wide display hero frames and landmark page breaks.' }
];

export const gridTokens: GridToken[] = [
  {
    device: 'Mobile',
    breakpoint: '< 768px (sm)',
    columns: 4,
    gutter: '16px (1rem)',
    gutterPx: 16,
    pageMargin: '16px (1rem)',
    marginPx: 16,
    maxContainerWidth: '100% (Fluid)',
    usage: 'Single-column stack layout for smart phones and small touch screens. Uses 4 responsive columns with 16px fluid outer margins and 16px gaps.'
  },
  {
    device: 'Tablet',
    breakpoint: '768px - 1023px (md)',
    columns: 8,
    gutter: '20px (1.25rem)',
    gutterPx: 20,
    pageMargin: '24px (1.5rem)',
    marginPx: 24,
    maxContainerWidth: '768px',
    usage: '8-column grid layout for iPads and portrait tablets. Supports 2-column card layouts, side-by-side forms, and collapsible navigation.'
  },
  {
    device: 'Desktop',
    breakpoint: '1024px - 1279px (lg)',
    columns: 12,
    gutter: '24px (1.5rem)',
    gutterPx: 24,
    pageMargin: '32px (2rem)',
    marginPx: 32,
    maxContainerWidth: '1024px',
    usage: 'Standard 12-column grid layout for laptops and regular desktop monitors. Supports asymmetric split views (e.g., 3-col sidebar + 9-col workspace).'
  },
  {
    device: 'Wide Desktop',
    breakpoint: '>= 1280px (xl / 2xl)',
    columns: 12,
    gutter: '32px (2rem)',
    gutterPx: 32,
    pageMargin: '48px (3rem)',
    marginPx: 48,
    maxContainerWidth: '1400px (max-w-7xl)',
    usage: 'Maximum density 12-column grid layout for wide monitors. Centered max-width container (`max-w-7xl mx-auto`) preventing infinite horizontal stretching.'
  }
];

export const containerTokens: ContainerToken[] = [
  { name: 'Container SM', maxWidth: '640px (max-w-sm)', pixels: 640, padding: '16px (space-4)', usage: 'Compact modals, login cards, receipt verification drawers, confirmation popups.' },
  { name: 'Container MD', maxWidth: '768px (max-w-md)', pixels: 768, padding: '24px (space-6)', usage: 'Enrollment wizards, single-column course detail views, profile edit forms.' },
  { name: 'Container LG', maxWidth: '1024px (max-w-lg)', pixels: 1024, padding: '32px (space-8)', usage: 'LMS student portals, dashboards, analytics views, administrative data tables.' },
  { name: 'Container XL', maxWidth: '1280px (max-w-xl)', pixels: 1280, padding: '32px (space-8)', usage: 'Main portal workspaces, 3-column store fronts, interactive practice studio.' },
  { name: 'Container 2XL', maxWidth: '1400px (max-w-7xl)', pixels: 1400, padding: '48px (space-12)', usage: 'Primary public website hero container, main navigation bar, global footer.' }
];

export const radiusTokens: RadiusToken[] = [
  { name: 'radius-xs', value: '2px', usage: 'Fine alignments, checkboxes, tooltips, small indicator pins.' },
  { name: 'radius-sm', value: '4px', usage: 'Small action triggers, input tags, inline details buttons.' },
  { name: 'radius-md', value: '8px', usage: 'Standard UI components, interactive inputs, buttons, list boxes.' },
  { name: 'radius-lg', value: '12px', usage: 'Course cards, panels, search bars, media players, item blocks.' },
  { name: 'radius-xl', value: '16px', usage: 'Dashboard sections, modal frames, custom floating containers.' },
  { name: 'radius-2xl', value: '24px', usage: 'Certificate layouts, testimonial widgets, specialty hero banners.' },
  { name: 'radius-full', value: '9999px', usage: 'Avatars, circle state icons, visual pills, pill badges.' }
];

export const shadowTokens: ShadowToken[] = [
  { name: 'shadow-sm', value: '0 1px 2px 0 rgba(111, 78, 55, 0.05)', usage: 'Subtle border alignment. Inputs, interactive hover borders, default flat cards.' },
  { name: 'shadow-md', value: '0 4px 12px -2px rgba(111, 78, 55, 0.08), 0 2px 4px -1px rgba(111, 78, 55, 0.04)', usage: 'Default component depth. Dropdown popovers, header headers, floating indicators.' },
  { name: 'shadow-lg', value: '0 12px 24px -4px rgba(111, 78, 55, 0.12), 0 4px 8px -2px rgba(111, 78, 55, 0.06)', usage: 'High focus surfaces. Floating modals, confirmation alerts, image showcase overlays.' }
];

export const breakpointTokens: BreakpointToken[] = [
  { name: 'sm', value: '640px', usage: 'Mobile responsive range. Single column layouts, collapsible mobile menu triggers.' },
  { name: 'md', value: '768px', usage: 'Tablet responsive range. 2-column small cards, multi-row detail tables, slide-out sidebar overlays.' },
  { name: 'lg', value: '1024px', usage: 'Laptop size. Full left-side navigation menus, 3-column layouts, expanded control systems.' },
  { name: 'xl', value: '1280px', usage: 'Default desktop width. Maximum grid density (4-column cards), expanded layouts, full detail views.' },
  { name: '2xl', value: '1536px', usage: 'Large desktop panels. Framed page centers (`max-w-7xl mx-auto`), beautiful negative margins.' }
];

export const roleTokens: RoleToken[] = [
  { name: 'Visitor', description: 'Prospective students, parents, and community members looking to explore course offerings, branches, tuition rates, and register online.', primaryDashboard: 'Public Website / Quick Registration Screen' },
  { name: 'Student', description: 'Active learners viewing assigned classes, schedules, practicing with audio loops, submitting video homework, checking feedback, and uploading receipts.', primaryDashboard: 'Student LMS Portal' },
  { name: 'Parent', description: 'Guardians monitoring attendance of under-age students, tracking progress, viewing grades/feedback, and paying tuition.', primaryDashboard: 'Parent Portal' },
  { name: 'Teacher', description: 'Instructors taking digital attendance, creating video/audio lessons, reviewing submissions, giving grades, tracking student practice timers.', primaryDashboard: 'Teacher Portal' },
  { name: 'Registration Staff', description: 'Admissions team verifying initial applications, managing branches, enrolling students, verifying initial credentials.', primaryDashboard: 'Registration Desk System' },
  { name: 'Branch Manager', description: 'Local administrators overseeing Hawassa main Branch (Center Point Tower). Tracking branch attendance, staff check-ins, local student counts.', primaryDashboard: 'Branch Console' },
  { name: 'Accountant', description: 'Financial officer verifying receipt screenshots, recording cash payments, issuing electronic invoices, generating balance sheets.', primaryDashboard: 'Accounting Core' },
  { name: 'Admin', description: 'Academic coordinators managing course curricula, assigning instructors, scheduling full cohorts, tracking master certificates.', primaryDashboard: 'Administration Suite' },
  { name: 'Super Admin', description: 'Operations leaders configuring global settings, managing branches, system configurations, and master databases.', primaryDashboard: 'Global Control Center' },
  { name: 'Founder (Executive)', description: 'Strategic leadership tracking global metrics, total branch registrations, total revenues, school growth curves, and teacher-student ratios.', primaryDashboard: 'Executive Boardroom Dashboard' }
];

