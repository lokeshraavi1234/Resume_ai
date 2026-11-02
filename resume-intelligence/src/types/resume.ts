// ============================================================
// Resume Data Types
// ============================================================

export interface ResumeData {
  rawText: string;
  fileName: string;
  fileSize: number;
  fileType: 'pdf' | 'docx';
}

export interface ExtractedSkill {
  name: string;
  category: 'technical' | 'soft' | 'tool' | 'language' | 'framework';
  proficiency?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

export interface Education {
  degree: string;
  institution: string;
  year: string;
  gpa?: string;
  field?: string;
}

export interface WorkExperience {
  title: string;
  company: string;
  duration: string;
  description: string[];
  skills?: string[];
}

export interface Project {
  name: string;
  description: string;
  technologies: string[];
  link?: string;
}

export interface Certification {
  name: string;
  issuer: string;
  year?: string;
}

// ============================================================
// Analysis Types
// ============================================================

export interface CategoryScore {
  category: 'skills' | 'experience' | 'education' | 'projects' | 'formatting' | 'ats';
  score: number;
  maxScore: number;
  label: string;
  insight: string;
  icon: string;
}

export interface AnalysisResult {
  overallScore: number;
  categoryScores: CategoryScore[];
  skills: ExtractedSkill[];
  education: Education[];
  experience: WorkExperience[];
  projects: Project[];
  certifications: Certification[];
  strengths: StrengthWeakness[];
  weaknesses: StrengthWeakness[];
  suggestions: AISuggestion[];
  atsReadability: ATSReadability;
}

export interface StrengthWeakness {
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
}

export interface AISuggestion {
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
}

export interface ATSReadability {
  score: number;
  issues: string[];
  suggestions: string[];
}

// ============================================================
// Job Match Types
// ============================================================

export interface JobMatchResult {
  matchScore: number;
  matchingSkills: SkillMatch[];
  missingSkills: SkillMatch[];
  partialSkills: SkillMatch[];
  requirementsComparison: RequirementComparison[];
  improvementSuggestions: ImprovementSuggestion[];
}

export interface SkillMatch {
  skill: string;
  status: 'match' | 'missing' | 'partial';
  relevance: 'critical' | 'important' | 'nice-to-have';
  suggestion?: string;
}

export interface RequirementComparison {
  requirement: string;
  resumeEvidence: string;
  status: 'met' | 'partially-met' | 'not-met';
  gap?: string;
}

export interface ImprovementSuggestion {
  area: string;
  currentState: string;
  suggestedImprovement: string;
  priority: 'high' | 'medium' | 'low';
  impact: string;
}

// ============================================================
// Enhancement Types
// ============================================================

export interface EnhancedResume {
  sections: EnhancedSection[];
  summary: string;
}

export interface EnhancedSection {
  id: string;
  name: string;
  originalContent: string;
  enhancedContent: string;
  changes: ChangeItem[];
  accepted: boolean;
}

export interface ChangeItem {
  id: string;
  type: 'addition' | 'modification' | 'reorder' | 'formatting';
  original: string;
  enhanced: string;
  reason: string;
  accepted: boolean;
}

// ============================================================
// App State Types
// ============================================================

export type AnalysisStep = 'upload' | 'processing' | 'results';
export type JobMatchStep = 'input' | 'matching' | 'results' | 'enhancement' | 'editor';

export interface UploadedFile {
  file: File;
  name: string;
  size: number;
  type: string;
  preview?: string;
}
