// Single source of truth for the portfolio content. Every claim below is taken
// from the app's own project page so the showcase never promises more than
// the product pages do.

const asset = path => `${process.env.PUBLIC_URL}${path}`;

export const person = {
  name: 'Halalisani Mbanjwa',
  firstName: 'Halalisani',
  lastName: 'Mbanjwa',
  role: 'Full-stack developer',
  studio: 'CurrentTech',
  country: 'South Africa',
  email: 'currenttech.co.za@gmail.com',
  github: 'https://github.com/mhalesto',
  timeZone: 'Africa/Johannesburg',
};

export const apps = [
  {
    slug: 'clipaura',
    name: 'ClipAura',
    route: '/projects/clipaura-ios',
    category: 'Creative video studio',
    tagline: 'Make videos people stop for.',
    summary:
      'Smart templates, AI effects, beat-synced editing, captions, Brand Kits and polished export in one focused creative flow.',
    features: [
      'Templates, automatic edits and AI reel briefs to reach a first cut fast',
      'A real timeline with beat detection, voiceover and generated captions',
      'On-device subject cutout, guided AI effects and Brand Kits',
    ],
    meta: ['iPhone · iOS 17+', 'On-device editing', 'Hosted AI with consent', 'Apple StoreKit'],
    links: [
      { label: 'Privacy', to: '/projects/clipaura-ios/privacy' },
      { label: 'Data', to: '/projects/clipaura-ios/data-collection' },
      { label: 'Support', to: '/projects/clipaura-ios/support' },
      { label: 'Terms', to: '/projects/clipaura-ios/terms' },
    ],
    colors: { a: '#8b3dff', b: '#22d8ea', bg: '#0b0618' },
    icon: asset('/experience/icon-clipaura.webp'),
    hint: 'Drag to spin the reel',
    cursor: 'Spin',
  },
  {
    slug: 'smartcleaner',
    name: 'Smart Cleaner',
    route: '/projects/smartcleaner-ios',
    category: 'On-device storage cleaner',
    tagline: 'Free up space. Keep what matters.',
    summary:
      'Smart Cleaner shows exactly what is filling your iPhone, then gets the space back by compressing media instead of deleting it.',
    features: [
      'Measures every figure it reports and separates iCloud-only items',
      'Re-encodes video to HEVC and turns Live Photos into stills',
      'Turns daily capacity readings into months of storage runway',
    ],
    meta: ['iPhone · iOS 17+', 'Fully on device', 'No server, no account', 'Apple StoreKit'],
    links: [
      { label: 'Privacy', to: '/projects/smartcleaner-ios/privacy' },
      { label: 'Data', to: '/projects/smartcleaner-ios/data-collection' },
      { label: 'Support', to: '/projects/smartcleaner-ios/support' },
    ],
    colors: { a: '#1e8bff', b: '#a259ff', bg: '#040a14' },
    icon: asset('/experience/icon-smartcleaner.webp'),
    hint: 'Click to compress',
    cursor: 'Compress',
  },
  {
    slug: 'resumestudio',
    name: 'ResumeStudio',
    route: '/projects/resumestudio-ios',
    category: 'Career workspace',
    tagline: 'Your whole job search, in one studio.',
    summary:
      'Build an evidence-based résumé, tailor it for real opportunities, organise every application and prepare for interviews, without giving up control of your career data.',
    features: [
      'ATS readiness, Recruiter Scan and 131 résumé templates',
      'Job adverts, applications, interviews and offers in one Today queue',
      'On-device assistance first, connected AI only when you choose it',
    ],
    meta: ['iPhone & iPad', 'Offline-first', 'PDF & DOCX export', 'Apple StoreKit'],
    links: [
      { label: 'Privacy', to: '/projects/resumestudio-ios/privacy' },
      { label: 'Data', to: '/projects/resumestudio-ios/data-collection' },
      { label: 'Support', to: '/projects/resumestudio-ios/support' },
    ],
    colors: { a: '#f05a13', b: '#ffb27a', bg: '#0e0805' },
    icon: asset('/experience/icon-resumestudio.webp'),
    hint: 'Move to scan · click to shuffle',
    cursor: 'Shuffle',
  },
  {
    slug: 'sugarshifts',
    name: 'SugarShifts',
    route: '/projects/sugarshifts-ios',
    category: 'Match-3 puzzle game',
    tagline: 'Swap fruit. Chain combos. Clear 200 levels.',
    summary:
      'Swap fruit tiles, build special combo clears, manage lives and coins, and chase star targets across a colourful 200-level campaign.',
    features: [
      'Shaped boards, blockers, specials and combo swaps',
      'Boosters, daily challenges, lives and reward moments',
      'Progress sync through iCloud and optional Sign in with Apple',
    ],
    meta: ['iPhone', '200 levels', 'StoreKit coin packs', 'iCloud sync'],
    links: [
      { label: 'Privacy', to: '/projects/sugarshifts-ios/privacy' },
      { label: 'Data', to: '/projects/sugarshifts-ios/data-collection' },
    ],
    colors: { a: '#ff4f8b', b: '#ffd23f', bg: '#12060d' },
    icon: asset('/experience/icon-sugarshifts.webp'),
    hint: 'Tap the fruit to pop it',
    cursor: 'Pop',
  },
  {
    slug: 'soundframe',
    name: 'SoundFrame',
    route: '/projects/soundframe-ios',
    category: 'Beat-synced video editor',
    tagline: 'Cut on the beat, every time.',
    summary:
      'Fast beat-synced edits with captions, timeline layers, overlays, audio control, filters, speed tools and export-ready clips for short-form video.',
    features: [
      'Beat-aware cuts, trim tools and timeline snapping',
      'Timed captions edited directly on the timeline',
      'Stacked video, audio, graphics, text and speed layers',
    ],
    meta: ['iPhone', 'Beat-reactive visuals', 'Captions', 'Short-form export'],
    links: [
      { label: 'Privacy', to: '/projects/soundframe-ios/privacy' },
      { label: 'Data', to: '/projects/soundframe-ios/data-collection' },
    ],
    colors: { a: '#18c7e6', b: '#3a7cf2', bg: '#040b14' },
    icon: asset('/experience/icon-soundframe.webp'),
    hint: 'Click to drop the beat',
    cursor: 'Drop',
  },
  {
    slug: 'lifetrack',
    name: 'LifeTrack',
    route: '/projects/lifetrack-ios',
    category: 'Life planner',
    tagline: 'Tasks, focus and money in one calm place.',
    summary:
      'Plan tasks, protect focus time, track money, capture documents, schedule reminders and export local backups from one privacy-conscious iOS app.',
    features: [
      'Tasks, calendar-aware day planning and focus sessions',
      'Income, bills, budgets and money insights',
      'Receipt scanning, widgets, reminders and local backups',
    ],
    meta: ['iPhone', 'Widgets & App Intents', 'Local JSON backups', 'Privacy-conscious'],
    links: [
      { label: 'Privacy', to: '/projects/lifetrack-ios/privacy' },
      { label: 'Data', to: '/projects/lifetrack-ios/data-collection' },
    ],
    colors: { a: '#4f7ef7', b: '#2fb67c', bg: '#050912' },
    icon: asset('/experience/icon-lifetrack.webp'),
    hint: 'Click to close the rings',
    cursor: 'Complete',
  },
  {
    slug: 'youmine',
    name: 'YouMine',
    route: '/projects/youmine-ios',
    category: 'Voice-first AI companion',
    tagline: 'An AI companion you can simply talk to.',
    summary:
      'Talk naturally with a personalised AI companion that supports voice chat, personality modes, memory, local history, attachments and tools.',
    features: [
      'Tap-to-speak chat with silence auto-send and spoken replies',
      'Coach, Storyteller, Calm Advisor and Smart Assistant modes',
      'On-device memory, local history, tools and attachments',
    ],
    meta: ['iPhone', 'Voice-first', 'Local chat history', 'Pro voice'],
    links: [
      { label: 'Privacy', to: '/projects/youmine-ios/privacy' },
      { label: 'Data', to: '/projects/youmine-ios/data-collection' },
    ],
    colors: { a: '#9b5cff', b: '#3c8bff', bg: '#08051a' },
    icon: asset('/experience/icon-youmine.webp'),
    hint: 'Hover to be heard · click to talk',
    cursor: 'Talk',
  },
];

export const webProjects = [
  {
    slug: 'icase',
    name: 'iCase',
    kind: 'Phone-case store',
    description: 'An ecommerce storefront built on Shopify.',
    stack: ['Shopify', 'Ecommerce'],
    url: 'https://ifonescases.com',
    domain: 'ifonescases.com',
    image: asset('/experience/web-icase.webp'),
    color: '#ff5fa2',
  },
  {
    slug: 'signific',
    name: 'Signific',
    kind: 'Logistics management',
    description: 'A management system built with React, Node, Redux and MongoDB.',
    stack: ['React', 'Node', 'Redux', 'MongoDB'],
    url: 'https://iamsignific.com',
    domain: 'iamsignific.com',
    image: asset('/experience/web-signific.webp'),
    color: '#5b5fe6',
  },
  {
    slug: 'totihigh',
    name: 'Toti High',
    kind: 'School website',
    description: 'The website for Amanzimtoti High School.',
    stack: ['Website', 'Education'],
    url: 'https://totihigh.co.za',
    domain: 'totihigh.co.za',
    image: asset('/experience/web-totihigh.webp'),
    color: '#1e9a4b',
  },
  {
    slug: 'laurie',
    name: 'Laurie OT',
    kind: 'Occupational therapy practice',
    description: 'A practice website for an occupational therapist.',
    stack: ['Website', 'Healthcare'],
    url: 'https://laurieoccupationaltherapist.co.za',
    domain: 'laurieoccupationaltherapist.co.za',
    image: asset('/experience/web-laurie.webp'),
    color: '#2ec4b6',
  },
];

// Earlier work that still has a live page on the site.
export const otherProjects = [
  {
    slug: 'soundframe-studio',
    name: 'Soundframe Studio',
    kind: 'Audio extraction & slideshow clips',
    description:
      'Turn any video into a clean audio track, then pair it with a still image or slideshow. iOS first, Android in progress.',
    route: '/projects/soundframe-studio',
    image: asset('/soundframe.svg'),
    color: '#f2994a',
    platforms: 'iOS · Android',
  },
];

export const stack = [
  { group: 'iOS', items: ['StoreKit', 'iCloud', 'Firebase', 'Apple Vision', 'Widgets', 'App Intents'] },
  { group: 'Front end', items: ['React', 'Angular', 'Redux', 'JavaScript', 'HTML & CSS', 'Tailwind'] },
  { group: 'Back end', items: ['Node.js', 'Express', 'PHP', 'MySQL', 'MongoDB'] },
  { group: 'Cloud & commerce', items: ['AWS', 'Shopify', 'Firebase'] },
];
