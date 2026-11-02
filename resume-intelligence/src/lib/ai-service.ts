import {
  AnalysisResult,
  JobMatchResult,
  EnhancedResume,
  EnhancedSection,
  CategoryScore,
  ExtractedSkill,
  Education,
  WorkExperience,
  Project,
  Certification,
  StrengthWeakness,
  AISuggestion,
  SkillMatch,
  RequirementComparison,
  ImprovementSuggestion,
  ChangeItem,
} from '@/types/resume';

// ============================================================
// AI Service Interface — swap implementations via AI_PROVIDER env
// ============================================================

export interface AIService {
  analyzeResume(resumeText: string): Promise<AnalysisResult>;
  matchJob(resumeText: string, jobDescription: string, previousJDs?: string[]): Promise<JobMatchResult>;
  enhanceResume(resumeText: string, jobDescription: string, matchResult: JobMatchResult): Promise<EnhancedResume>;
  regenerateSection(sectionId: string, originalContent: string, jobDescription: string, context: string): Promise<EnhancedSection>;
}

// ============================================================
// Factory: Select AI provider based on env
// ============================================================

export function getAIService(): AIService {
  const provider = process.env.AI_PROVIDER || 'mock';

  switch (provider) {
    case 'mock':
      return new MockAIService();
    // Future providers:
    // case 'openai':
    //   return new OpenAIService(process.env.OPENAI_API_KEY!);
    // case 'gemini':
    //   return new GeminiAIService(process.env.GEMINI_API_KEY!);
    default:
      return new MockAIService();
  }
}

// ============================================================
// Mock AI Service — realistic responses for development
// ============================================================

class MockAIService implements AIService {

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async analyzeResume(resumeText: string): Promise<AnalysisResult> {
    await this.delay(2000);

    const hasSkills = resumeText.toLowerCase().includes('skill') || resumeText.length > 200;
    const hasExperience = resumeText.toLowerCase().includes('experience') || resumeText.toLowerCase().includes('work');
    const hasEducation = resumeText.toLowerCase().includes('education') || resumeText.toLowerCase().includes('university');
    const hasProjects = resumeText.toLowerCase().includes('project');

    const skillScore = hasSkills ? 78 : 45;
    const expScore = hasExperience ? 82 : 40;
    const eduScore = hasEducation ? 85 : 50;
    const projScore = hasProjects ? 72 : 35;
    const formatScore = resumeText.length > 500 ? 80 : 55;
    const atsScore = 74;

    const overallScore = Math.round((skillScore + expScore + eduScore + projScore + formatScore + atsScore) / 6);

    const categoryScores: CategoryScore[] = [
      { category: 'skills', score: skillScore, maxScore: 100, label: 'Skills', insight: hasSkills ? 'Good skill diversity detected' : 'Limited skills identified', icon: 'Code2' },
      { category: 'experience', score: expScore, maxScore: 100, label: 'Experience', insight: hasExperience ? 'Strong work history' : 'Work experience section needs improvement', icon: 'Briefcase' },
      { category: 'education', score: eduScore, maxScore: 100, label: 'Education', insight: hasEducation ? 'Education well documented' : 'Consider adding more educational details', icon: 'GraduationCap' },
      { category: 'projects', score: projScore, maxScore: 100, label: 'Projects', insight: hasProjects ? 'Projects showcase practical skills' : 'Add project examples to strengthen resume', icon: 'FolderKanban' },
      { category: 'formatting', score: formatScore, maxScore: 100, label: 'Formatting', insight: formatScore > 70 ? 'Clean formatting structure' : 'Improve formatting for readability', icon: 'LayoutTemplate' },
      { category: 'ats', score: atsScore, maxScore: 100, label: 'ATS Score', insight: 'Moderate ATS compatibility — some improvements needed', icon: 'ScanSearch' },
    ];

    const skills: ExtractedSkill[] = [
      { name: 'JavaScript', category: 'technical', proficiency: 'advanced' },
      { name: 'TypeScript', category: 'technical', proficiency: 'advanced' },
      { name: 'React', category: 'framework', proficiency: 'advanced' },
      { name: 'Node.js', category: 'framework', proficiency: 'intermediate' },
      { name: 'Python', category: 'technical', proficiency: 'intermediate' },
      { name: 'SQL', category: 'technical', proficiency: 'intermediate' },
      { name: 'Git', category: 'tool', proficiency: 'advanced' },
      { name: 'Docker', category: 'tool', proficiency: 'intermediate' },
      { name: 'AWS', category: 'tool', proficiency: 'beginner' },
      { name: 'Communication', category: 'soft', proficiency: 'advanced' },
      { name: 'Team Leadership', category: 'soft', proficiency: 'intermediate' },
      { name: 'Problem Solving', category: 'soft', proficiency: 'advanced' },
    ];

    const education: Education[] = [
      { degree: 'Bachelor of Science in Computer Science', institution: 'University of Technology', year: '2018 - 2022', gpa: '3.7/4.0', field: 'Computer Science' },
    ];

    const experience: WorkExperience[] = [
      {
        title: 'Senior Frontend Developer',
        company: 'Tech Solutions Inc.',
        duration: 'Jan 2023 - Present',
        description: [
          'Led development of customer-facing dashboard using React and TypeScript',
          'Improved application performance by 40% through code optimization',
          'Mentored team of 3 junior developers',
          'Implemented CI/CD pipelines reducing deployment time by 60%',
        ],
        skills: ['React', 'TypeScript', 'CI/CD'],
      },
      {
        title: 'Frontend Developer',
        company: 'Digital Agency Co.',
        duration: 'Jun 2021 - Dec 2022',
        description: [
          'Built responsive web applications for 10+ clients',
          'Collaborated with design team to implement pixel-perfect interfaces',
          'Developed reusable component library used across projects',
        ],
        skills: ['JavaScript', 'React', 'CSS'],
      },
    ];

    const projects: Project[] = [
      {
        name: 'E-Commerce Platform',
        description: 'Full-stack e-commerce application with real-time inventory management',
        technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
      },
      {
        name: 'Task Management App',
        description: 'Collaborative task management tool with real-time updates',
        technologies: ['Next.js', 'TypeScript', 'PostgreSQL', 'WebSocket'],
      },
    ];

    const certifications: Certification[] = [
      { name: 'AWS Certified Cloud Practitioner', issuer: 'Amazon Web Services', year: '2023' },
      { name: 'Meta Frontend Developer Certificate', issuer: 'Meta / Coursera', year: '2022' },
    ];

    const strengths: StrengthWeakness[] = [
      { title: 'Strong Technical Skills', description: 'Excellent proficiency in modern JavaScript/TypeScript ecosystem with frameworks like React and Node.js', impact: 'high' },
      { title: 'Quantifiable Achievements', description: 'Experience section includes measurable impact metrics (40% performance improvement, 60% deployment time reduction)', impact: 'high' },
      { title: 'Relevant Certifications', description: 'Industry-recognized certifications demonstrate continuous learning commitment', impact: 'medium' },
      { title: 'Project Portfolio', description: 'Diverse project experience showcasing full-stack development capabilities', impact: 'medium' },
    ];

    const weaknesses: StrengthWeakness[] = [
      { title: 'Limited Soft Skills Description', description: 'Soft skills are listed but not demonstrated through examples in experience section', impact: 'medium' },
      { title: 'Missing Professional Summary', description: 'Resume lacks a compelling professional summary/objective statement at the top', impact: 'high' },
      { title: 'Inconsistent Formatting', description: 'Some sections use different formatting styles which may confuse ATS parsers', impact: 'medium' },
      { title: 'No Keywords Optimization', description: 'Resume could benefit from more industry-standard keywords for better ATS matching', impact: 'high' },
    ];

    const suggestions: AISuggestion[] = [
      { title: 'Add a Professional Summary', description: 'Include a 3-4 sentence professional summary highlighting your key skills, experience level, and career focus. This helps recruiters and ATS systems quickly understand your profile.', priority: 'high', category: 'Content' },
      { title: 'Optimize for ATS Keywords', description: 'Include industry-standard keywords like "Agile", "REST API", "responsive design", "unit testing" naturally throughout your resume to improve ATS scoring.', priority: 'high', category: 'ATS' },
      { title: 'Demonstrate Soft Skills', description: 'Rather than listing soft skills, weave them into your experience descriptions. For example, mention specific leadership or collaboration instances.', priority: 'medium', category: 'Content' },
      { title: 'Standardize Date Formats', description: 'Use a consistent date format across all sections (e.g., "Jan 2023 - Present" for all entries).', priority: 'medium', category: 'Formatting' },
      { title: 'Add Technical Proficiency Levels', description: 'Group skills by proficiency level (Expert, Proficient, Familiar) to give employers a clearer picture of your capabilities.', priority: 'low', category: 'Skills' },
      { title: 'Expand Project Descriptions', description: 'Add your role, challenges overcome, and specific outcomes for each project to demonstrate problem-solving abilities.', priority: 'medium', category: 'Projects' },
    ];

    const atsReadability = {
      score: atsScore,
      issues: [
        'Some sections use non-standard headers',
        'Tables or columns may not parse correctly',
        'Missing key sections that ATS typically looks for',
      ],
      suggestions: [
        'Use standard section headers: "Work Experience", "Education", "Skills"',
        'Avoid tables, text boxes, and multi-column layouts',
        'Include a "Professional Summary" section at the top',
        'Use standard bullet points (•) instead of custom symbols',
      ],
    };

    return {
      overallScore,
      categoryScores,
      skills,
      education,
      experience,
      projects,
      certifications,
      strengths,
      weaknesses,
      suggestions,
      atsReadability,
    };
  }

  async matchJob(resumeText: string, jobDescription: string, previousJDs?: string[]): Promise<JobMatchResult> {
    await this.delay(2500);

    const matchScore = 68;

    const matchingSkills: SkillMatch[] = [
      { skill: 'React', status: 'match', relevance: 'critical' },
      { skill: 'TypeScript', status: 'match', relevance: 'critical' },
      { skill: 'JavaScript', status: 'match', relevance: 'critical' },
      { skill: 'Node.js', status: 'match', relevance: 'important' },
      { skill: 'Git', status: 'match', relevance: 'important' },
      { skill: 'CI/CD', status: 'match', relevance: 'nice-to-have' },
    ];

    const missingSkills: SkillMatch[] = [
      { skill: 'GraphQL', status: 'missing', relevance: 'critical', suggestion: 'If you have any GraphQL experience, add it to your skills' },
      { skill: 'Kubernetes', status: 'missing', relevance: 'important', suggestion: 'Consider highlighting any container orchestration experience' },
      { skill: 'System Design', status: 'missing', relevance: 'important', suggestion: 'Add system design examples from your project experience' },
      { skill: 'Performance Testing', status: 'missing', relevance: 'nice-to-have', suggestion: 'Mention any performance optimization work from your experience' },
    ];

    const partialSkills: SkillMatch[] = [
      { skill: 'Cloud Services (Azure/GCP)', status: 'partial', relevance: 'important', suggestion: 'You have AWS experience — highlight cloud experience more broadly' },
      { skill: 'Testing Frameworks', status: 'partial', relevance: 'important', suggestion: 'Expand on testing experience — mention specific frameworks used' },
      { skill: 'Agile/Scrum', status: 'partial', relevance: 'nice-to-have', suggestion: 'Your team leadership likely involved agile — make this explicit' },
    ];

    const requirementsComparison: RequirementComparison[] = [
      { requirement: '5+ years of frontend development experience', resumeEvidence: '3+ years of frontend experience documented', status: 'partially-met', gap: 'Consider highlighting earlier frontend work or internships' },
      { requirement: 'Expert in React and TypeScript', resumeEvidence: 'Advanced proficiency in React and TypeScript with 2+ years of experience', status: 'met' },
      { requirement: 'Experience with GraphQL APIs', resumeEvidence: 'No GraphQL experience mentioned', status: 'not-met', gap: 'If you have REST API experience, it could be highlighted as transferable' },
      { requirement: 'Experience leading engineering teams', resumeEvidence: 'Mentored team of 3 junior developers', status: 'partially-met', gap: 'Expand on leadership responsibilities and team management' },
      { requirement: 'Strong problem-solving skills', resumeEvidence: 'Problem solving listed as a skill; 40% performance improvement demonstrates this', status: 'met' },
      { requirement: 'Experience with CI/CD and DevOps', resumeEvidence: 'Implemented CI/CD pipelines reducing deployment time by 60%', status: 'met' },
    ];

    const improvementSuggestions: ImprovementSuggestion[] = [
      { area: 'Professional Summary', currentState: 'No professional summary present', suggestedImprovement: 'Add a targeted summary highlighting React/TypeScript expertise and leadership experience, aligned with the senior role requirements', priority: 'high', impact: 'Major improvement in first impression and ATS matching' },
      { area: 'Experience Section', currentState: 'Good metrics but missing key technology mentions', suggestedImprovement: 'Reword bullet points to naturally include required technologies and emphasize leadership scope', priority: 'high', impact: 'Better keyword matching and demonstrated seniority' },
      { area: 'Skills Organization', currentState: 'Skills listed without categorization', suggestedImprovement: 'Reorganize skills with most relevant ones first, grouped by category (Frontend, Backend, DevOps, Soft Skills)', priority: 'medium', impact: 'Improved scannability for both humans and ATS' },
      { area: 'Project Descriptions', currentState: 'Brief project descriptions without clear impact', suggestedImprovement: 'Expand project descriptions to highlight technologies matching the job requirements and quantify outcomes', priority: 'medium', impact: 'Demonstrates practical application of required skills' },
    ];

    return {
      matchScore,
      matchingSkills,
      missingSkills,
      partialSkills,
      requirementsComparison,
      improvementSuggestions,
    };
  }

  async enhanceResume(resumeText: string, jobDescription: string, matchResult: JobMatchResult): Promise<EnhancedResume> {
    await this.delay(3000);

    const sections: EnhancedSection[] = [
      {
        id: 'summary',
        name: 'Professional Summary',
        originalContent: '(No professional summary present in original resume)',
        enhancedContent: 'Results-driven Senior Frontend Developer with 3+ years of experience building high-performance web applications using React, TypeScript, and modern JavaScript frameworks. Proven track record of improving application performance by 40% and streamlining deployment processes by 60% through CI/CD implementation. Experienced in mentoring development teams and delivering scalable, user-centric solutions in fast-paced environments.',
        changes: [
          { id: 'c1', type: 'addition', original: '', enhanced: 'Added professional summary targeting senior developer role', reason: 'A professional summary immediately communicates your value proposition to recruiters and ATS systems', accepted: true },
        ],
        accepted: true,
      },
      {
        id: 'skills',
        name: 'Technical Skills',
        originalContent: 'JavaScript, TypeScript, React, Node.js, Python, SQL, Git, Docker, AWS, Communication, Team Leadership, Problem Solving',
        enhancedContent: 'Frontend: React, TypeScript, JavaScript (ES6+), HTML5, CSS3, Responsive Design\nBackend: Node.js, Python, SQL, REST APIs\nDevOps & Tools: Git, Docker, AWS, CI/CD Pipelines\nMethodologies: Agile Development, Code Review, Test-Driven Development\nLeadership: Team Mentoring, Cross-functional Collaboration, Technical Planning',
        changes: [
          { id: 'c2', type: 'modification', original: 'Flat skill list', enhanced: 'Categorized and prioritized skills', reason: 'Organized skills by category with most relevant skills first, making it easier for ATS to match and recruiters to scan', accepted: true },
          { id: 'c3', type: 'addition', original: '', enhanced: 'Added implicit skills: Responsive Design, REST APIs, Agile', reason: 'These skills are demonstrated in your experience but were not explicitly listed', accepted: true },
        ],
        accepted: true,
      },
      {
        id: 'experience',
        name: 'Work Experience',
        originalContent: 'Senior Frontend Developer | Tech Solutions Inc. | Jan 2023 - Present\n• Led development of customer-facing dashboard using React and TypeScript\n• Improved application performance by 40% through code optimization\n• Mentored team of 3 junior developers\n• Implemented CI/CD pipelines reducing deployment time by 60%\n\nFrontend Developer | Digital Agency Co. | Jun 2021 - Dec 2022\n• Built responsive web applications for 10+ clients\n• Collaborated with design team to implement pixel-perfect interfaces\n• Developed reusable component library used across projects',
        enhancedContent: 'Senior Frontend Developer | Tech Solutions Inc. | Jan 2023 - Present\n• Spearheaded development of enterprise customer-facing dashboard using React and TypeScript, serving 10,000+ daily active users\n• Optimized application performance by 40% through strategic code refactoring, lazy loading, and bundle optimization\n• Led and mentored a team of 3 junior developers through code reviews, pair programming, and technical guidance\n• Architected and implemented CI/CD pipelines using modern DevOps practices, reducing deployment time by 60%\n• Collaborated with cross-functional teams including design, backend, and QA to deliver features on agile sprint cycles\n\nFrontend Developer | Digital Agency Co. | Jun 2021 - Dec 2022\n• Engineered responsive, accessible web applications for 10+ enterprise clients using React and modern JavaScript\n• Partnered with UX/UI design team to translate Figma designs into pixel-perfect, performant interfaces\n• Architected and maintained a reusable component library adopted across 8+ projects, improving development efficiency by 30%\n• Implemented responsive design patterns ensuring seamless user experience across desktop, tablet, and mobile devices',
        changes: [
          { id: 'c4', type: 'modification', original: 'Led development of customer-facing dashboard', enhanced: 'Spearheaded development of enterprise customer-facing dashboard', reason: 'Stronger action verb and added scale context', accepted: true },
          { id: 'c5', type: 'modification', original: 'Mentored team of 3 junior developers', enhanced: 'Led and mentored a team of 3 junior developers through code reviews, pair programming, and technical guidance', reason: 'Expanded to show specific mentoring activities, demonstrating leadership depth', accepted: true },
          { id: 'c6', type: 'addition', original: '', enhanced: 'Added collaboration bullet point about cross-functional teams', reason: 'Demonstrates teamwork and agile experience relevant to the target role', accepted: true },
          { id: 'c7', type: 'modification', original: 'Developed reusable component library used across projects', enhanced: 'Architected and maintained a reusable component library adopted across 8+ projects, improving development efficiency by 30%', reason: 'Added quantifiable impact and stronger action verb', accepted: true },
        ],
        accepted: true,
      },
      {
        id: 'projects',
        name: 'Projects',
        originalContent: 'E-Commerce Platform\nFull-stack e-commerce application with real-time inventory management\nTech: React, Node.js, MongoDB, Stripe\n\nTask Management App\nCollaborative task management tool with real-time updates\nTech: Next.js, TypeScript, PostgreSQL, WebSocket',
        enhancedContent: 'E-Commerce Platform | React, Node.js, MongoDB, Stripe\n• Designed and developed a full-stack e-commerce platform featuring real-time inventory management and secure payment processing\n• Implemented responsive UI with React, achieving 95+ Lighthouse performance score\n• Built RESTful API backend handling 1,000+ concurrent transactions\n\nTask Management App | Next.js, TypeScript, PostgreSQL, WebSocket\n• Built a collaborative task management application with real-time synchronization using WebSocket connections\n• Developed with Next.js and TypeScript ensuring type safety and optimal server-side rendering performance\n• Designed PostgreSQL database schema supporting complex team hierarchies and permission systems',
        changes: [
          { id: 'c8', type: 'modification', original: 'Brief project descriptions', enhanced: 'Expanded with bullet points, metrics, and technical depth', reason: 'Detailed project descriptions demonstrate practical application of required skills', accepted: true },
        ],
        accepted: true,
      },
      {
        id: 'education',
        name: 'Education',
        originalContent: 'Bachelor of Science in Computer Science\nUniversity of Technology | 2018 - 2022 | GPA: 3.7/4.0',
        enhancedContent: 'Bachelor of Science in Computer Science | University of Technology | 2018 - 2022\nGPA: 3.7/4.0 | Relevant Coursework: Data Structures, Algorithms, Software Engineering, Database Systems, Web Development',
        changes: [
          { id: 'c9', type: 'addition', original: '', enhanced: 'Added relevant coursework', reason: 'Relevant coursework reinforces technical foundation for the target role', accepted: true },
        ],
        accepted: true,
      },
    ];

    return {
      sections,
      summary: 'Resume enhanced with 9 improvements across 5 sections. Key changes include adding a professional summary, organizing skills by category, strengthening experience bullet points with metrics and action verbs, expanding project descriptions, and adding relevant coursework.',
    };
  }

  async regenerateSection(sectionId: string, originalContent: string, jobDescription: string, context: string): Promise<EnhancedSection> {
    await this.delay(1500);

    return {
      id: sectionId,
      name: sectionId.charAt(0).toUpperCase() + sectionId.slice(1),
      originalContent,
      enhancedContent: originalContent + '\n\n[Regenerated with alternative phrasing and optimization]',
      changes: [
        {
          id: `regen-${Date.now()}`,
          type: 'modification',
          original: originalContent,
          enhanced: 'Content regenerated with alternative approach',
          reason: 'Regenerated at user request with different optimization strategy',
          accepted: true,
        },
      ],
      accepted: true,
    };
  }
}
