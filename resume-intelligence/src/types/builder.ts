// ============================================================
// Resume Builder Data Types
// ============================================================

export interface PersonalInfo {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  website?: string;
  linkedin?: string;
  github?: string;
}

export interface ExperienceItem {
  id: string;
  title: string;
  company: string;
  location?: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string[];
}

export interface EducationItem {
  id: string;
  degree: string;
  field?: string;
  institution: string;
  year: string;
  gpa?: string;
}

export interface SkillCategory {
  technical: string[];
  soft: string[];
  tools: string[];
}

export interface ProjectItem {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  link?: string;
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  year?: string;
}

export type TemplateStyle = 'modern' | 'two-column' | 'executive' | 'ats-classic' | 'minimal';
export type ThemeColor = 'indigo' | 'purple' | 'emerald' | 'rose' | 'slate';
export type TemplateCategory = 'all' | 'ats' | 'two-column' | 'professional' | 'simple' | 'word';

export interface TemplateDefinition {
  id: TemplateStyle;
  name: string;
  category: TemplateCategory[];
  description: string;
  badge?: string;
  colorOptions: ThemeColor[];
  highlights: string[];
}

export interface ResumeBuilderData {
  personalInfo: PersonalInfo;
  summary: string;
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: SkillCategory;
  projects: ProjectItem[];
  certifications: CertificationItem[];
  templateStyle: TemplateStyle;
  themeColor: ThemeColor;
}
