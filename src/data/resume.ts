// All résumé content lives here as typed data so the components stay presentational.
// Edit this file to update the site — you shouldn't need to touch the components.
// Two resume variants ("ops" and "engineering") share the same person/contacts/certs
// but have their own title, summary, experience framing, achievements, projects, and skills order.

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
}

export interface Achievement {
  metric: string;
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

export interface ResumeProfile {
  title: string;
  summary: string;
}

export interface ResumeContent {
  profile: ResumeProfile;
  experience: Role[];
  achievements: Achievement[];
  projects: Project[];
  skills: SkillGroup[];
}

export type ResumeMode = 'ops' | 'engineering';

// ---------- shared across both resumes ----------

export const person = {
  name: 'Shawn McCrum',
  location: 'Parker, Colorado',
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

export const certifications: Certification[] = [
  { name: 'AWS Cloud Technical Essentials', issuer: 'Amazon Web Services' },
  { name: 'Introduction to Cybersecurity', issuer: 'IBM' },
];

// ---------- ops / infrastructure resume ----------

const opsExperience: Role[] = [
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
      'Programmed 8+ simultaneous Colorado election projects end-to-end: coordinated client requirements, built election configurations, performed QA testing, and conducted Pre-LAT validation on-site.',
      'Architected an automated folder-scaffolding system (PowerShell): a dynamic zip-based template system that let election structures be customized per state without code changes, saving hours per cycle across hundreds of programming tasks.',
      'Led a project to automate the ballot scanning/printing workflow, integrating work from a 3-person team into a single tool still in production use today.',
      'Built workflows and Jira ticketing solutions addressing company-wide efficiency needs.',
    ],
  },
];

const opsAchievements: Achievement[] = [
  {
    metric: '28 States',
    title: 'Checklist Standard',
    detail:
      'The Pre-LAT checklist framework I led is now adopted across 28 states and 250+ counties for maintenance, upgrades, and implementations.',
  },
  {
    metric: '15',
    title: 'Team Members Led',
    detail:
      'Directed cross-functional teams through high-stakes statewide election deployments.',
  },
  {
    metric: '4TB',
    title: 'Storage Saved',
    detail:
      'Engineered a creative VM cloning solution others deemed impossible, reclaiming 4TB across infrastructure.',
  },
];

const opsProjects: Project[] = [
  {
    name: 'FlickFix',
    tagline: 'Automated Media Library Manager · actively developed',
    bullets: [
      'Personal project applying the same operational rigor to software as to production infrastructure — a self-correcting repair engine with a 363-test CI/CD suite validated on every push.',
      'Solved a real quality-vs-speed problem: sampling a video to reliably predict both the space it would save and whether the resulting quality would still hold up, without a full re-encode.',
    ],
  },
  {
    name: 'Local AI & RAG Initiative',
    tagline: 'Proposed internal-knowledge system',
    bullets: [
      'Spearheading a proposal to deploy a local LLM trained on internal documentation and Jira tickets via retrieval-augmented generation (RAG), giving support staff instant, grounded answers from company knowledge.',
      'Designed a roadmap to evolve it into an agentic layer that forms a hypothesis and runs checks to test it — expanding support capacity while reducing operating costs.',
    ],
  },
];

const opsSkills: SkillGroup[] = [
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
  {
    category: 'Languages & Web',
    skills: ['PowerShell', 'React', 'Python', 'CMD/Batch', 'HTML/CSS', 'JavaScript', 'C++'],
  },
];

// ---------- engineering / full-stack resume ----------

const engineeringExperience: Role[] = [
  {
    title: 'System Specialist II',
    company: 'Liberty Vote (formerly Dominion Voting Systems)',
    location: 'Denver, Colorado',
    period: 'Jan 2021 — Present',
    current: true,
    bullets: [
      'Architected VM infrastructure (40+ configurations) with a custom tracking system. Reduced storage by 4TB through a creative HDD cloning approach (Acronis to exact OS size plus dynamic expansion).',
      'Performed infrastructure work: server configuration (BIOS, RAID), Windows hardening, hash verification, and network troubleshooting.',
      'Built and maintained cross-team checklists and tooling now adopted company-wide for maintenance, upgrades, and implementations.',
    ],
  },
  {
    title: 'QA Analyst I',
    company: 'Liberty Vote (formerly Dominion Voting Systems)',
    location: 'Denver, Colorado',
    period: 'Jan 2020 — Jan 2021',
    bullets: [
      'Led a Python project to automate the ballot scanning/printing workflow: designed a TIFF-to-PDF conversion pipeline and integrated code from a 3-person team into a single executable. Still in production, processing 100,000+ ballots in under two hours.',
      'Architected an automated folder-scaffolding system (PowerShell): a dynamic zip-based template system that let election structures be customized per state without code changes.',
      'Prototyped multi-language audio-generation automation (Excel + Windows Voices + lookup tables) — would have eliminated manual per-language audio creation across 16+ languages per election.',
      'Built workflows and Jira ticketing solutions addressing company-wide efficiency needs.',
    ],
  },
];

const engineeringAchievements: Achievement[] = [
  {
    metric: '50×',
    title: 'Faster Processing',
    detail:
      'Built a ballot conversion pipeline still in production — processes 100,000+ ballots in under two hours.',
  },
  {
    metric: '1MB → 381B',
    title: 'State Re-Architected',
    detail:
      'FlickFix: rebuilt library-selection storage — saving only user-set exceptions, collapsing them to the highest level, and persisting filters — shrinking a 25,000+ item state from over 1MB to 381 bytes.',
  },
  {
    metric: '363 Tests',
    title: 'Automated Test Suite',
    detail:
      'Built a comprehensive suite (175 unit + 188 Playwright UI tests) with CI/CD validation on every push.',
  },
];

const engineeringProjects: Project[] = [
  {
    name: 'FlickFix',
    tagline: 'Automated Media Library Manager · actively developed',
    bullets: [
      'Solved the core UX problem of trusting an automated fix: built a fast sampling method to predict both the space a video would save and whether its quality would still hold up, without a full re-encode.',
      'Built a self-correcting repair engine that validates each fix and tunes its own encoding settings based on measured quality loss — larger corrections when far from target, smaller as it converges.',
      'Built a comprehensive test suite (175 unit + 188 Playwright UI tests) with CI/CD validation on every push, keeping each component stable as the system evolves. PowerShell core with a browser-based GUI.',
      'Re-engineered the live log viewer: a full-file render froze the UI once the log (rewritten 4×/sec) passed 1MB, so I built a virtualized view rendering 500 rows with stable scroll, a jump-to-live control, and instant full-file search/filter.',
    ],
  },
  {
    name: 'Local AI & RAG Initiative',
    tagline: 'Proposed internal-knowledge system',
    bullets: [
      'Proposed a local LLM trained on internal documentation and Jira tickets via retrieval-augmented generation (RAG), giving support staff instant, grounded answers from company knowledge.',
      'Designed a roadmap to evolve it beyond retrieval into an agentic layer that forms a hypothesis and then runs API calls to test it.',
      'Foundation work underway through hands-on LLM, prompt-engineering, and fine-tuning experimentation in a local environment.',
    ],
  },
  {
    name: 'Full-Stack Web Development',
    tagline: 'Client sites, end to end',
    bullets: [
      'Designed and deployed 15+ client websites (React, Python, HTML/CSS), including this résumé site, an in-progress site for a counseling practice, and a wedding website built for my own wedding.',
      'Built custom backends and drove client acquisition through SEO.',
    ],
  },
  {
    name: 'Financial Tracking System',
    tagline: 'Spreadsheet automation',
    bullets: [
      'Therapy-practice tracker with dynamic Excel formulas, pivot tables, and automated reporting insights.',
      'Personal finance system that auto-populates categories from a bank statement, eliminating manual data entry (90%+ time savings).',
    ],
  },
];

const engineeringSkills: SkillGroup[] = [
  {
    category: 'Languages & Web',
    skills: ['PowerShell', 'React', 'Python', 'CMD/Batch', 'HTML/CSS', 'JavaScript', 'WordPress', 'SEO', 'C++'],
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
    category: 'Systems & DevOps',
    skills: ['Git', 'CI/CD', 'Playwright', 'FFmpeg', 'Jira', 'VMware/vSphere', 'Windows Server'],
  },
  {
    category: 'Core',
    skills: [
      'Full-Stack Development',
      'Problem-Solving',
      'Agile',
      'Software Architecture',
      'Test Automation',
      'Mentoring',
    ],
  },
];

// ---------- combined export ----------

export const resumes: Record<ResumeMode, ResumeContent> = {
  ops: {
    profile: {
      title: 'Systems Engineer · Technical Lead',
      summary:
        "I build and run infrastructure that has to work under real pressure — statewide election deployments, hardened server environments, and cross-team standards adopted across 28 states. I lead field teams through high-stakes, time-boxed rollouts and turn one-off fixes into repeatable, company-wide process.",
    },
    experience: opsExperience,
    achievements: opsAchievements,
    projects: opsProjects,
    skills: opsSkills,
  },
  engineering: {
    profile: {
      title: 'Full-Stack Developer',
      summary:
        "Most of my hands-on engineering happens independently, alongside a full-time systems role — I like solving these problems enough to keep building outside of work. FlickFix, a media-library manager I designed and still actively develop, replaced manual work with a self-correcting repair engine and a 363-test CI suite. PowerShell, React, and Python are where that work lives day to day.",
    },
    experience: engineeringExperience,
    achievements: engineeringAchievements,
    projects: engineeringProjects,
    skills: engineeringSkills,
  },
};