import { ResumeBuilderData } from '@/types/builder';

export const initialResumeState: ResumeBuilderData = {
  personalInfo: {
    fullName: '',
    jobTitle: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    linkedin: '',
    github: '',
  },
  summary: '',
  experience: [
    {
      id: 'exp-1',
      title: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: [''],
    },
  ],
  education: [
    {
      id: 'edu-1',
      degree: '',
      field: '',
      institution: '',
      year: '',
      gpa: '',
    },
  ],
  skills: {
    technical: [],
    soft: [],
    tools: [],
  },
  projects: [],
  certifications: [],
  templateStyle: 'modern',
  themeColor: 'indigo',
};

export const sampleSoftwareEngineer: ResumeBuilderData = {
  personalInfo: {
    fullName: 'Alex Morgan',
    jobTitle: 'Senior Full Stack Engineer',
    email: 'alex.morgan@email.com',
    phone: '+1 (555) 382-9104',
    location: 'San Francisco, CA',
    website: 'https://alexmorgan.dev',
    linkedin: 'linkedin.com/in/alexmorgan',
    github: 'github.com/alexmorgan',
  },
  summary:
    'Results-driven Full Stack Engineer with 6+ years of experience architecting distributed cloud applications, modern web platforms, and scalable microservices. Proven track record of improving system latency by 35% and mentoring high-velocity engineering teams.',
  experience: [
    {
      id: 'exp-1',
      title: 'Senior Software Engineer',
      company: 'TechFlow Solutions',
      location: 'San Francisco, CA',
      startDate: '2022-03',
      endDate: 'Present',
      current: true,
      description: [
        'Spearheaded the redesign of core customer portal using Next.js, React 19, and TypeScript, accelerating page load speeds by 42%.',
        'Engineered high-throughput event processing pipelines processing 10M+ daily events using Node.js, Kafka, and Redis caching.',
        'Mentored 6 junior/mid-level engineers, instituted automated CI/CD pipelines with GitHub Actions, cutting release cycles from bi-weekly to daily.',
      ],
    },
    {
      id: 'exp-2',
      title: 'Full Stack Developer',
      company: 'Nexus Digital',
      location: 'Austin, TX',
      startDate: '2019-06',
      endDate: '2022-02',
      current: false,
      description: [
        'Built enterprise RESTful & GraphQL APIs serving 500,000+ monthly active users with 99.98% uptime SLA.',
        'Migrated monolithic database architecture to PostgreSQL with read replicas, reducing query execution times by 50%.',
        'Implemented rigorous automated unit and integration tests with Jest and Cypress, elevating test coverage from 55% to 88%.',
      ],
    },
  ],
  education: [
    {
      id: 'edu-1',
      degree: 'B.S. in Computer Science',
      field: 'Software Engineering',
      institution: 'University of California, Berkeley',
      year: '2015 - 2019',
      gpa: '3.8/4.0',
    },
  ],
  skills: {
    technical: ['React', 'TypeScript', 'Next.js', 'Node.js', 'Python', 'GraphQL', 'PostgreSQL', 'MongoDB'],
    soft: ['Agile Leadership', 'Technical Mentorship', 'System Architecture', 'Cross-Functional Collaboration'],
    tools: ['Docker', 'Kubernetes', 'AWS (ECS, S3, RDS)', 'Git', 'Redis', 'Terraform', 'CI/CD Pipelines'],
  },
  projects: [
    {
      id: 'proj-1',
      name: 'CloudMetrics Engine',
      description:
        'Open-source real-time application monitoring dashboard with anomaly detection, alert routing, and custom visual telemetry.',
      technologies: ['TypeScript', 'Next.js', 'WebSockets', 'TailwindCSS', 'ClickHouse'],
      link: 'github.com/alexmorgan/cloudmetrics',
    },
    {
      id: 'proj-2',
      name: 'AI Document Summarizer',
      description:
        'Intelligent multi-format document parser extracting semantic highlights and generating concise executive summaries.',
      technologies: ['Python', 'FastAPI', 'LangChain', 'React', 'Docker'],
      link: 'github.com/alexmorgan/doc-summarizer',
    },
  ],
  certifications: [
    {
      id: 'cert-1',
      name: 'AWS Certified Solutions Architect – Associate',
      issuer: 'Amazon Web Services',
      year: '2023',
    },
    {
      id: 'cert-2',
      name: 'CKA: Certified Kubernetes Administrator',
      issuer: 'Cloud Native Computing Foundation',
      year: '2022',
    },
  ],
  templateStyle: 'modern',
  themeColor: 'indigo',
};

export const sampleProductManager: ResumeBuilderData = {
  personalInfo: {
    fullName: 'Elena Rostova',
    jobTitle: 'Lead Product Manager',
    email: 'elena.rostova@email.com',
    phone: '+1 (555) 749-1203',
    location: 'New York, NY',
    website: 'https://elenaproduct.com',
    linkedin: 'linkedin.com/in/elenarostova',
    github: '',
  },
  summary:
    'Strategic Lead Product Manager with 7+ years directing product discovery, roadmap execution, and data-backed experimentation for high-growth B2B SaaS products. Scaled annual recurring revenue from $4M to $18M through user-centric feature innovation and iterative delivery.',
  experience: [
    {
      id: 'exp-1',
      title: 'Lead Product Manager',
      company: 'OmniCloud SaaS',
      location: 'New York, NY',
      startDate: '2021-08',
      endDate: 'Present',
      current: true,
      description: [
        'Owned product vision and execution for flag-ship analytics suite, achieving a 28% increase in day-30 customer retention.',
        'Collaborated with engineering, design, and GTM teams to launch 4 tier-1 features, generating $3.2M in net new ARR within 6 months.',
        'Instituted quantitative product analytics framework (Mixpanel & Amplitude), uncovering funnel friction and boosting checkout conversion by 19%.',
      ],
    },
  ],
  education: [
    {
      id: 'edu-1',
      degree: 'B.A. in Economics & Data Science',
      field: 'Business Economics',
      institution: 'Columbia University',
      year: '2014 - 2018',
      gpa: '3.9/4.0',
    },
  ],
  skills: {
    technical: ['Product Strategy', 'Roadmapping', 'User Research', 'A/B Testing', 'SQL', 'Data Analytics'],
    soft: ['Stakeholder Management', 'Executive Communication', 'Team Facilitation', 'Problem Solving'],
    tools: ['Jira', 'Figma', 'Amplitude', 'Mixpanel', 'Notion', 'Tableau'],
  },
  projects: [
    {
      id: 'proj-1',
      name: 'Self-Serve Onboarding Redesign',
      description:
        'Redesigned zero-touch onboarding flow for self-serve users, reducing time-to-first-value from 14 days to under 48 hours.',
      technologies: ['Figma', 'Product Analytics', 'User Journey Mapping'],
      link: 'elenaproduct.com/case-study-onboarding',
    },
  ],
  certifications: [
    {
      id: 'cert-1',
      name: 'Product Management Professional (PMP)',
      issuer: 'Product School',
      year: '2021',
    },
  ],
  templateStyle: 'executive',
  themeColor: 'purple',
};
