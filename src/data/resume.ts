// All résumé content lives here as typed data so the components stay presentational.
// Edit this file to update the site — you shouldn't need to touch the components.

export interface ContactLink {
  label: string;
  value: string;
  href: string;
}

export interface Role {
  title: string;
  company: string;
  location: string;
  period: string;
  current?: boolean;
  bullets: string[];
}

export interface Project {
  name: string;
  tagline: string;
  bullets: string[];
  links?: { label: string; href: string }[];
}

export interface Achievement {
  metric: string; // the punchy headline shown in mono
  title: string;
  detail: string;
}

export interface SkillGroup {
  category: string;
  skills: string[];
}

export interface Certification {
  name: string;
  issuer: string;
}

export const profile = {
  name: 'Shawn McCrum',
  title: 'System Specialist II · Technical Lead · Full-Stack Developer',
  location: 'Parker, Colorado',
  summary:
    "I build things that work at scale. Starting with hands-on Python and full-stack development, I've progressed to leading teams and architecting systems that improve efficiency and solve real problems. I thrive on complex challenges — whether debugging corrupted media files, automating enterprise workflows, or building systems from scratch. I pair technical depth with practical problem-solving and a drive to keep learning.",
};

export const contacts: ContactLink[] = [
  { label: 'Email', value: 'xmccrum@gmail.com', href: 'mailto:xmccrum@gmail.com' },
  { label: 'Phone', value: '201-956-5546', href: 'tel:+12019565546' },
  { label: 'GitHub', value: 'github.com/captincrum', href: 'https://github.com/captincrum' },
  {
    label: 'LinkedIn',
    value: 'in/shawn-mccrum-co',
    href: 'https://www.linkedin.com/in/shawn-mccrum-co/',
  },
];

export const experience: Role[] = [
  {
    title: 'System Specialist II',
    company: 'Liberty Vote (formerly Dominion Voting Systems)',
    location: 'Denver, Colorado',
    period: 'Jan 2021 — Present',
    current: true,
    bullets: [
      'Led field teams on election nights (18+ hour shifts), managing equipment issues, result validation, and county coordination until all results were certified and reported to the state.',
      'Owned Pre-LAT (Logic & Accuracy) testing: designed test cases and certified systems before elections.',
      'Led the cross-team checklist design and review cycle; the checklists are now adopted company-wide for maintenance, upgrades, and implementations.',
      'Architected VM infrastructure (40+ configurations) with a tracking system. Reduced storage by 4TB through a creative HDD cloning approach (Acronis to exact OS size plus dynamic expansion).',
      'Directed multi-state software upgrades and equipment implementations: coordinated multi-week projects spanning Windows imaging, network setup, and logic/accuracy validation. Led on-site teams and liaised with county stakeholders.',
      'Performed infrastructure work: server configuration (BIOS, RAID), Windows hardening, hash verification, and network troubleshooting.',
    ],
  },
  {
    title: 'QA Analyst I',
    company: 'Liberty Vote (formerly Dominion Voting Systems)',
    location: 'Denver, Colorado',
    period: 'Jan 2020 — Jan 2021',
    bullets: [
      'Led a Python project to automate the ballot scanning/printing workflow: designed a TIFF-to-PDF conversion pipeline and integrated code from a 3-person team into a single executable. Reduced paper/ink waste and processing time; still in use today, later optimized with dedicated VM infrastructure.',
      'Programmed 8+ simultaneous Colorado election projects end-to-end: coordinated client requirements, built election configurations, performed QA testing, and conducted Pre-LAT validation on-site — expanding the role beyond typical QA responsibilities.',
      'Architected an automated folder-scaffolding system (PowerShell): a dynamic zip-based template system that let election structures be customized per state without code changes, saving hours per cycle across hundreds of programming tasks.',
      'Built workflows and Jira ticketing solutions addressing company-wide efficiency needs.',
      'Prototyped multi-language audio-generation automation (Excel + Windows Voices + Balaboika lookup tables). Incomplete due to a role transition, but it would have eliminated manual per-language audio creation across 16+ languages per election.',
    ],
  },
];

export const projects: Project[] = [
  {
    name: 'FlickFix',
    tagline: 'Automated Media Library Manager',
    links: [
      { label: 'Source', href: 'https://github.com/captincrum/flick-fix' },
    ],
    bullets: [
      'Built a comprehensive test suite (175 unit + 188 Playwright UI tests) with CI/CD validation on every push, keeping each component stable as the system evolves. PowerShell core with a browser-based GUI.',
      'Built a self-correcting repair engine that validates each fix and tunes its own encoding settings based on measured quality loss — larger corrections when far from target, smaller as it converges.',
      'Re-engineered the live log viewer: a full-file render froze the UI once the log (rewritten 4×/sec) passed 1MB, so I built a virtualized view rendering 500 rows with stable scroll, a jump-to-live control, and instant full-file search/filter.',
      'GPU-accelerated x265 compression with auto-detection of NVIDIA NVENC, AMD AMF, and Intel QSV. Probes the library with sample encodes to predict space savings before committing, then surfaces an interactive review tree with confidence scoring so the user can filter and cap which runs actually execute.',
    ],
  },
  {
    name: 'Find the Cat',
    tagline: 'AI-powered deduction game (shipped, runs on this site)',
    links: [
      { label: 'Play it', href: '/games/find-the-cat' },
    ],
    bullets: [
      'Built end-to-end on Anthropic\'s Claude API with a Netlify Functions backend — players ask questions and a Claude-powered gatekeeper drops hints without giving away the answer.',
      'Designed an encrypted-token architecture (AES-256-GCM) so the solution never reaches the browser — the answer rides through the client as ciphertext, making devtools cheats impossible while keeping the backend stateless.',
      'Built a per-game token budget that meters real LLM spend, surfaces live cost to the player, and gates further questions when the budget runs out — cost-conscious engineering, not just an API call.',
      'Nightmare mode goes further: Claude generates a 15-30 line code snippet with one realistic production bug embedded, then plays interviewer while the player diagnoses it — a small showcase of prompt engineering and LLM orchestration.',
    ],
  },
  {
    name: 'Local AI & RAG Initiative',
    tagline: 'Proposed internal-knowledge system',
    bullets: [
      'Spearheading a proposal to deploy a local LLM trained on internal documentation and Jira tickets via retrieval-augmented generation (RAG), giving support staff instant, grounded answers from company knowledge.',
      'Designed a roadmap to evolve it beyond retrieval into an agentic layer that forms a hypothesis and then runs API calls to test it — expanding support capacity while reducing operating costs.',
      'Foundation work underway through hands-on LLM, prompt-engineering, and fine-tuning experimentation in a local environment.',
    ],
  },
  {
    name: 'Full-Stack Web Development',
    tagline: 'Client sites, end to end',
    links: [
      { label: 'This site (source)', href: 'https://github.com/captincrum/shawn-resume' },
      { label: 'Wedding site', href: 'https://rachelandshawn.netlify.app' },
    ],
    bullets: [
      '15+ client sites delivered end to end: design, build, deploy, content, and SEO — picking the stack that fits each client rather than forcing one in.',
      'Comfortable across the stack: React/TypeScript for interactive apps, WordPress for content-heavy sites, Python (Flask) for custom backends, and plain HTML/CSS when that\'s the right tool.',
      'This résumé site is itself a portfolio piece: React + TypeScript + Vite with a custom design system (theme tokens, dark mode, animated hexagon watermark), React Router, and a Netlify Functions backend powering the Find the Cat game.',
      'Drove client acquisition through SEO — keyword strategy, schema markup, and performance tuning measurable in search rankings, not just vibes.',
    ],
  },
  {
    name: 'Data Automation Systems',
    tagline: 'Real-world workflows reduced to a click',
    bullets: [
      'Appointment conflict detection: dynamic scheduling system that enforces real-time conflict detection across recurring and one-off appointments using formula-driven availability masks, auto-surfaces conflicts, and eliminates double-booking — converting a manual spreadsheet into a self-validating operational tool.',
      'Personal finance automation: multi-source expense tracker that auto-ingests bank transactions, applies intelligent categorization via regex pattern matching and lookup tables, and surfaces real-time dashboards with month-over-month spending analysis — eliminating 90%+ of manual data entry.',
      'Healthcare claims manager: self-maintaining HSA reconciliation engine that cross-references claim dates, provider names, and payment methods against documentation status, auto-flags reimbursement mismatches, and generates year-end tax-ready summaries — reducing compliance review time from hours to minutes.',
    ],
  },
];

export const achievements: Achievement[] = [
  {
    metric: '4TB',
    title: 'Storage Saved',
    detail:
      'Engineered a creative VM cloning solution others deemed impossible, reclaiming 4TB across infrastructure.',
  },
  {
    metric: '50×',
    title: 'Faster Processing',
    detail:
      'Built a ballot conversion pipeline still in production — processes 100,000+ ballots in under two hours.',
  },
  {
    metric: '15',
    title: 'Team Members Led',
    detail:
      'Directed cross-functional teams through high-stakes statewide election deployments.',
  },
  {
    metric: '1MB → 381B',
    title: 'State Re-Architected',
    detail:
      'FlickFix: rebuilt library-selection storage — saving only user-set exceptions, collapsing them to the highest level, and persisting filters — shrinking a 25,000+ item state from over 1MB to 381 bytes.',
  },
  {
    metric: '28 States',
    title: 'Checklist Standard',
    detail:
      'The Pre-LAT checklist framework I led is now adopted across 28 states and 250+ counties for maintenance, upgrades, and implementations.',
  },
];

export const skills: SkillGroup[] = [
  {
    category: 'Languages & Web',
    skills: ['Python', 'JavaScript', 'PowerShell', 'C++', 'HTML/CSS', 'React', 'WordPress', 'SEO'],
  },
  {
    category: 'Systems & DevOps',
    skills: [
      'VMware/vSphere',
      'Windows Server',
      'RAID/BIOS',
      'Networking',
      'Git',
      'CI/CD',
      'Playwright',
      'FFmpeg',
      'Jira',
    ],
  },
  {
    category: 'Data, AI & Cloud',
    skills: [
      'Advanced Excel',
      'LLMs',
      'Prompt Engineering',
      'Fine-Tuning',
      'AWS',
      'Cybersecurity',
    ],
  },
  {
    category: 'Core',
    skills: [
      'Full-Stack Development',
      'Team Leadership',
      'Mentoring',
      'Stakeholder Management',
      'Cross-Functional Coordination',
      'Problem-Solving',
      'Agile',
      'Software Architecture',
      'Test Automation',
    ],
  },
];

export const certifications: Certification[] = [
  { name: 'AWS Cloud Technical Essentials', issuer: 'Amazon Web Services' },
  { name: 'Introduction to Cybersecurity', issuer: 'IBM' },
];
