'use client';

import React, { useState } from 'react';
import {
  User,
  FileText,
  Briefcase,
  GraduationCap,
  Sparkles,
  Code2,
  FolderKanban,
  Award,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Loader2,
  Lightbulb,
} from 'lucide-react';
import { ResumeBuilderData, ExperienceItem, EducationItem, ProjectItem, CertificationItem } from '@/types/builder';
import { Button } from '@/components/ui/Button';

interface ResumeFormProps {
  data: ResumeBuilderData;
  onChange: (data: ResumeBuilderData) => void;
}

export function ResumeForm({ data, onChange }: ResumeFormProps) {
  const [activeSection, setActiveSection] = useState<string>('personal');
  const [loadingAI, setLoadingAI] = useState<string | null>(null);

  // Update Personal Info
  const updatePersonalInfo = (field: keyof typeof data.personalInfo, value: string) => {
    onChange({
      ...data,
      personalInfo: {
        ...data.personalInfo,
        [field]: value,
      },
    });
  };

  // Update Summary
  const updateSummary = (value: string) => {
    onChange({ ...data, summary: value });
  };

  // AI Summary Generator
  const handleGenerateSummary = async () => {
    setLoadingAI('summary');
    try {
      const res = await fetch('/api/generate-resume-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'summary',
          role: data.personalInfo.jobTitle || 'Software Engineer',
          skills: data.skills.technical,
          level: 'Experienced',
        }),
      });
      const result = await res.json();
      if (result.summary) {
        updateSummary(result.summary);
      }
    } catch (err) {
      console.error('Failed to generate summary', err);
    } finally {
      setLoadingAI(null);
    }
  };

  // Experience Handlers
  const addExperience = () => {
    const newItem: ExperienceItem = {
      id: `exp-${Date.now()}`,
      title: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: [''],
    };
    onChange({
      ...data,
      experience: [...data.experience, newItem],
    });
  };

  const updateExperience = (index: number, field: keyof ExperienceItem, value: any) => {
    const updated = [...data.experience];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ ...data, experience: updated });
  };

  const removeExperience = (index: number) => {
    onChange({
      ...data,
      experience: data.experience.filter((_, i) => i !== index),
    });
  };

  const addExperienceBullet = (expIndex: number) => {
    const updated = [...data.experience];
    updated[expIndex].description.push('');
    onChange({ ...data, experience: updated });
  };

  const updateExperienceBullet = (expIndex: number, bulletIndex: number, value: string) => {
    const updated = [...data.experience];
    updated[expIndex].description[bulletIndex] = value;
    onChange({ ...data, experience: updated });
  };

  const removeExperienceBullet = (expIndex: number, bulletIndex: number) => {
    const updated = [...data.experience];
    updated[expIndex].description = updated[expIndex].description.filter((_, i) => i !== bulletIndex);
    onChange({ ...data, experience: updated });
  };

  const handleEnhanceBullet = async (expIndex: number, bulletIndex: number) => {
    const currentBullet = data.experience[expIndex].description[bulletIndex];
    setLoadingAI(`bullet-${expIndex}-${bulletIndex}`);
    try {
      const res = await fetch('/api/generate-resume-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'bullet',
          currentContent: currentBullet,
        }),
      });
      const result = await res.json();
      if (result.enhanced) {
        updateExperienceBullet(expIndex, bulletIndex, result.enhanced);
      }
    } catch (err) {
      console.error('Failed to enhance bullet', err);
    } finally {
      setLoadingAI(null);
    }
  };

  // Education Handlers
  const addEducation = () => {
    const newItem: EducationItem = {
      id: `edu-${Date.now()}`,
      degree: '',
      field: '',
      institution: '',
      year: '',
      gpa: '',
    };
    onChange({
      ...data,
      education: [...data.education, newItem],
    });
  };

  const updateEducation = (index: number, field: keyof EducationItem, value: string) => {
    const updated = [...data.education];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ ...data, education: updated });
  };

  const removeEducation = (index: number) => {
    onChange({
      ...data,
      education: data.education.filter((_, i) => i !== index),
    });
  };

  // Skills Handlers
  const [skillInput, setSkillInput] = useState<{ technical: string; soft: string; tools: string }>({
    technical: '',
    soft: '',
    tools: '',
  });

  const addSkill = (category: keyof typeof data.skills) => {
    const value = skillInput[category].trim();
    if (!value) return;

    if (!data.skills[category].includes(value)) {
      onChange({
        ...data,
        skills: {
          ...data.skills,
          [category]: [...data.skills[category], value],
        },
      });
    }
    setSkillInput({ ...skillInput, [category]: '' });
  };

  const removeSkill = (category: keyof typeof data.skills, skillToRemove: string) => {
    onChange({
      ...data,
      skills: {
        ...data.skills,
        [category]: data.skills[category].filter(s => s !== skillToRemove),
      },
    });
  };

  const handleSuggestSkills = async () => {
    setLoadingAI('skills');
    try {
      const res = await fetch('/api/generate-resume-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'skills',
          role: data.personalInfo.jobTitle || 'Software Engineer',
        }),
      });
      const result = await res.json();
      if (result.suggested) {
        onChange({
          ...data,
          skills: {
            technical: Array.from(new Set([...data.skills.technical, ...result.suggested.technical])),
            soft: Array.from(new Set([...data.skills.soft, ...result.suggested.soft])),
            tools: Array.from(new Set([...data.skills.tools, ...result.suggested.tools])),
          },
        });
      }
    } catch (err) {
      console.error('Failed to suggest skills', err);
    } finally {
      setLoadingAI(null);
    }
  };

  // Projects Handlers
  const addProject = () => {
    const newItem: ProjectItem = {
      id: `proj-${Date.now()}`,
      name: '',
      description: '',
      technologies: [],
      link: '',
    };
    onChange({
      ...data,
      projects: [...data.projects, newItem],
    });
  };

  const updateProject = (index: number, field: keyof ProjectItem, value: any) => {
    const updated = [...data.projects];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ ...data, projects: updated });
  };

  const removeProject = (index: number) => {
    onChange({
      ...data,
      projects: data.projects.filter((_, i) => i !== index),
    });
  };

  // Certifications Handlers
  const addCertification = () => {
    const newItem: CertificationItem = {
      id: `cert-${Date.now()}`,
      name: '',
      issuer: '',
      year: '',
    };
    onChange({
      ...data,
      certifications: [...data.certifications, newItem],
    });
  };

  const updateCertification = (index: number, field: keyof CertificationItem, value: string) => {
    const updated = [...data.certifications];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ ...data, certifications: updated });
  };

  const removeCertification = (index: number) => {
    onChange({
      ...data,
      certifications: data.certifications.filter((_, i) => i !== index),
    });
  };

  const sections = [
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'summary', label: 'Summary', icon: FileText },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'skills', label: 'Skills', icon: Code2 },
    { id: 'projects', label: 'Projects', icon: FolderKanban },
    { id: 'certifications', label: 'Certifications', icon: Award },
  ];

  return (
    <div className="space-y-4">
      {/* Navigation tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none border-b border-border-subtle">
        {sections.map(sec => {
          const Icon = sec.icon;
          const isActive = activeSection === sec.id;
          return (
            <button
              key={sec.id}
              onClick={() => setActiveSection(sec.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                isActive
                  ? 'gradient-bg-primary text-white shadow-md shadow-primary-500/20'
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              {sec.label}
            </button>
          );
        })}
      </div>

      {/* Section 1: Personal Info */}
      {activeSection === 'personal' && (
        <div className="glass-card-static p-6 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-base font-bold text-text-primary">Contact & Profile Information</h3>
            <span className="text-xs text-text-muted">Required for ATS contact parsing</span>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1.5">Full Name *</label>
              <input
                type="text"
                placeholder="e.g. Alex Morgan"
                value={data.personalInfo.fullName}
                onChange={e => updatePersonalInfo('fullName', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-100 border border-border-default text-text-primary placeholder:text-text-muted text-sm focus:border-primary-500 focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1.5">Job Title / Target Role *</label>
              <input
                type="text"
                placeholder="e.g. Senior Full Stack Engineer"
                value={data.personalInfo.jobTitle}
                onChange={e => updatePersonalInfo('jobTitle', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-100 border border-border-default text-text-primary placeholder:text-text-muted text-sm focus:border-primary-500 focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1.5">Email Address *</label>
              <input
                type="email"
                placeholder="e.g. alex@example.com"
                value={data.personalInfo.email}
                onChange={e => updatePersonalInfo('email', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-100 border border-border-default text-text-primary placeholder:text-text-muted text-sm focus:border-primary-500 focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1.5">Phone Number *</label>
              <input
                type="tel"
                placeholder="e.g. +1 (555) 345-6789"
                value={data.personalInfo.phone}
                onChange={e => updatePersonalInfo('phone', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-100 border border-border-default text-text-primary placeholder:text-text-muted text-sm focus:border-primary-500 focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1.5">Location (City, State / Country)</label>
              <input
                type="text"
                placeholder="e.g. San Francisco, CA"
                value={data.personalInfo.location}
                onChange={e => updatePersonalInfo('location', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-100 border border-border-default text-text-primary placeholder:text-text-muted text-sm focus:border-primary-500 focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1.5">LinkedIn Profile</label>
              <input
                type="text"
                placeholder="e.g. linkedin.com/in/alexmorgan"
                value={data.personalInfo.linkedin || ''}
                onChange={e => updatePersonalInfo('linkedin', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-100 border border-border-default text-text-primary placeholder:text-text-muted text-sm focus:border-primary-500 focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1.5">Portfolio / Website</label>
              <input
                type="text"
                placeholder="e.g. alexmorgan.dev"
                value={data.personalInfo.website || ''}
                onChange={e => updatePersonalInfo('website', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-100 border border-border-default text-text-primary placeholder:text-text-muted text-sm focus:border-primary-500 focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1.5">GitHub / Code Repository</label>
              <input
                type="text"
                placeholder="e.g. github.com/alexmorgan"
                value={data.personalInfo.github || ''}
                onChange={e => updatePersonalInfo('github', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-100 border border-border-default text-text-primary placeholder:text-text-muted text-sm focus:border-primary-500 focus:outline-none transition-colors"
              />
            </div>
          </div>
        </div>
      )}

      {/* Section 2: Summary */}
      {activeSection === 'summary' && (
        <div className="glass-card-static p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-text-primary">Professional Summary</h3>
              <p className="text-xs text-text-secondary mt-0.5">
                2-4 sentences highlighting your years of experience, core superpowers, and tangible impact.
              </p>
            </div>
            <Button
              size="sm"
              variant="secondary"
              onClick={handleGenerateSummary}
              disabled={loadingAI === 'summary'}
              icon={
                loadingAI === 'summary' ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-primary-400" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5 text-primary-400" />
                )
              }
            >
              {loadingAI === 'summary' ? 'Writing...' : 'AI Generate'}
            </Button>
          </div>

          <textarea
            rows={5}
            placeholder="Write a concise overview of your professional career, or click 'AI Generate' above to let ResumeAI draft one tailored to your target title..."
            value={data.summary}
            onChange={e => updateSummary(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-surface-100 border border-border-default text-text-primary placeholder:text-text-muted text-sm leading-relaxed focus:border-primary-500 focus:outline-none transition-colors resize-y"
          />

          <div className="flex items-center gap-2 p-3 rounded-xl bg-primary-500/10 border border-primary-500/20 text-xs text-primary-300">
            <Lightbulb className="w-4 h-4 flex-shrink-0 text-primary-400" />
            <span>
              Tip: Strong summaries use numbers (e.g., &quot;6+ years&quot;, &quot;improved latency by 35%&quot;) to substantiate claims.
            </span>
          </div>
        </div>
      )}

      {/* Section 3: Work Experience */}
      {activeSection === 'experience' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-text-primary">Work Experience</h3>
              <p className="text-xs text-text-secondary">Detail your relevant career roles in reverse-chronological order.</p>
            </div>
            <Button size="sm" onClick={addExperience} icon={<Plus className="w-4 h-4" />}>
              Add Position
            </Button>
          </div>

          {data.experience.length === 0 ? (
            <div className="glass-card-static p-8 text-center">
              <p className="text-sm text-text-muted mb-4">No work experience added yet.</p>
              <Button size="sm" onClick={addExperience} icon={<Plus className="w-4 h-4" />}>
                Add Your First Job
              </Button>
            </div>
          ) : (
            data.experience.map((exp, expIdx) => (
              <div key={exp.id || expIdx} className="glass-card-static p-5 space-y-4 relative border-l-4 border-l-primary-500">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-primary-400 uppercase tracking-wider">
                    Role #{expIdx + 1}
                  </span>
                  <button
                    onClick={() => removeExperience(expIdx)}
                    className="p-1.5 rounded-lg hover:bg-danger-500/15 text-text-muted hover:text-danger-400 transition-colors"
                    title="Delete Position"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-text-secondary mb-1">Job Title *</label>
                    <input
                      type="text"
                      placeholder="e.g. Lead Full Stack Engineer"
                      value={exp.title}
                      onChange={e => updateExperience(expIdx, 'title', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-surface-100 border border-border-default text-text-primary placeholder:text-text-muted text-sm focus:border-primary-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-text-secondary mb-1">Company / Organization *</label>
                    <input
                      type="text"
                      placeholder="e.g. Acme Corp"
                      value={exp.company}
                      onChange={e => updateExperience(expIdx, 'company', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-surface-100 border border-border-default text-text-primary placeholder:text-text-muted text-sm focus:border-primary-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-text-secondary mb-1">Location</label>
                    <input
                      type="text"
                      placeholder="e.g. New York, NY (Remote)"
                      value={exp.location || ''}
                      onChange={e => updateExperience(expIdx, 'location', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-surface-100 border border-border-default text-text-primary placeholder:text-text-muted text-sm focus:border-primary-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-text-secondary mb-1">Dates of Employment</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Start (e.g. 2021-03)"
                        value={exp.startDate}
                        onChange={e => updateExperience(expIdx, 'startDate', e.target.value)}
                        className="w-1/2 px-3 py-2 rounded-xl bg-surface-100 border border-border-default text-text-primary placeholder:text-text-muted text-xs focus:border-primary-500 focus:outline-none"
                      />
                      <input
                        type="text"
                        placeholder={exp.current ? 'Present' : 'End (e.g. 2023-11)'}
                        disabled={exp.current}
                        value={exp.current ? 'Present' : exp.endDate}
                        onChange={e => updateExperience(expIdx, 'endDate', e.target.value)}
                        className="w-1/2 px-3 py-2 rounded-xl bg-surface-100 border border-border-default text-text-primary placeholder:text-text-muted text-xs focus:border-primary-500 focus:outline-none disabled:opacity-50"
                      />
                    </div>
                    <label className="inline-flex items-center gap-2 mt-1.5 cursor-pointer text-xs text-text-secondary">
                      <input
                        type="checkbox"
                        checked={exp.current}
                        onChange={e => updateExperience(expIdx, 'current', e.target.checked)}
                        className="rounded bg-surface-100 border-border-default text-primary-500 focus:ring-0"
                      />
                      I currently work here
                    </label>
                  </div>
                </div>

                {/* Bullets */}
                <div className="space-y-2 pt-2 border-t border-border-subtle">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-text-secondary">Accomplishments & Responsibilities</label>
                    <button
                      type="button"
                      onClick={() => addExperienceBullet(expIdx)}
                      className="text-xs text-primary-400 hover:text-primary-300 flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Bullet
                    </button>
                  </div>

                  {exp.description.map((bullet, bulletIdx) => (
                    <div key={bulletIdx} className="flex items-start gap-2">
                      <span className="text-text-muted text-sm pt-2">•</span>
                      <textarea
                        rows={2}
                        placeholder="e.g. Spearheaded migration of legacy stack to Next.js, boosting conversion by 24%..."
                        value={bullet}
                        onChange={e => updateExperienceBullet(expIdx, bulletIdx, e.target.value)}
                        className="flex-1 px-3 py-2 rounded-xl bg-surface-100 border border-border-default text-text-primary placeholder:text-text-muted text-xs leading-relaxed focus:border-primary-500 focus:outline-none"
                      />
                      <div className="flex flex-col gap-1">
                        <button
                          type="button"
                          onClick={() => handleEnhanceBullet(expIdx, bulletIdx)}
                          disabled={loadingAI === `bullet-${expIdx}-${bulletIdx}`}
                          title="Enhance with AI (Action verbs & metrics)"
                          className="p-1.5 rounded-lg bg-primary-500/10 hover:bg-primary-500/20 text-primary-300 transition-colors"
                        >
                          {loadingAI === `bullet-${expIdx}-${bulletIdx}` ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Sparkles className="w-3.5 h-3.5" />
                          )}
                        </button>
                        {exp.description.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeExperienceBullet(expIdx, bulletIdx)}
                            className="p-1.5 rounded-lg hover:bg-danger-500/15 text-text-muted hover:text-danger-400 transition-colors"
                            title="Remove Bullet"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Section 4: Education */}
      {activeSection === 'education' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-text-primary">Education</h3>
              <p className="text-xs text-text-secondary">Degrees, diplomas, and academic credentials.</p>
            </div>
            <Button size="sm" onClick={addEducation} icon={<Plus className="w-4 h-4" />}>
              Add Education
            </Button>
          </div>

          {data.education.map((edu, idx) => (
            <div key={edu.id || idx} className="glass-card-static p-5 space-y-3.5 relative">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-accent-400 uppercase tracking-wider">
                  Degree #{idx + 1}
                </span>
                <button
                  onClick={() => removeEducation(idx)}
                  className="p-1.5 rounded-lg hover:bg-danger-500/15 text-text-muted hover:text-danger-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1">Degree / Qualification *</label>
                  <input
                    type="text"
                    placeholder="e.g. B.S. in Computer Science"
                    value={edu.degree}
                    onChange={e => updateEducation(idx, 'degree', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-surface-100 border border-border-default text-text-primary placeholder:text-text-muted text-sm focus:border-primary-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1">Field of Study / Major</label>
                  <input
                    type="text"
                    placeholder="e.g. Software Engineering"
                    value={edu.field || ''}
                    onChange={e => updateEducation(idx, 'field', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-surface-100 border border-border-default text-text-primary placeholder:text-text-muted text-sm focus:border-primary-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1">Institution / University *</label>
                  <input
                    type="text"
                    placeholder="e.g. Stanford University"
                    value={edu.institution}
                    onChange={e => updateEducation(idx, 'institution', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-surface-100 border border-border-default text-text-primary placeholder:text-text-muted text-sm focus:border-primary-500 focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-text-secondary mb-1">Graduation Year</label>
                    <input
                      type="text"
                      placeholder="e.g. 2018 - 2022"
                      value={edu.year}
                      onChange={e => updateEducation(idx, 'year', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-surface-100 border border-border-default text-text-primary placeholder:text-text-muted text-sm focus:border-primary-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-text-secondary mb-1">GPA (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. 3.8 / 4.0"
                      value={edu.gpa || ''}
                      onChange={e => updateEducation(idx, 'gpa', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-surface-100 border border-border-default text-text-primary placeholder:text-text-muted text-sm focus:border-primary-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Section 5: Skills */}
      {activeSection === 'skills' && (
        <div className="glass-card-static p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-text-primary">Skills & Proficiencies</h3>
              <p className="text-xs text-text-secondary">
                Group your competencies into categories for maximum ATS scanning recognition.
              </p>
            </div>
            <Button
              size="sm"
              variant="secondary"
              onClick={handleSuggestSkills}
              disabled={loadingAI === 'skills'}
              icon={
                loadingAI === 'skills' ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-primary-400" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5 text-primary-400" />
                )
              }
            >
              {loadingAI === 'skills' ? 'Analyzing...' : 'AI Suggest Skills'}
            </Button>
          </div>

          {/* Technical Skills */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-primary-300 uppercase tracking-wide">
              Technical & Core Skills ({data.skills.technical.length})
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Add technical skill (e.g. React, Python, PostgreSQL) and press Add or Enter"
                value={skillInput.technical}
                onChange={e => setSkillInput({ ...skillInput, technical: e.target.value })}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addSkill('technical');
                  }
                }}
                className="flex-1 px-3 py-2 rounded-xl bg-surface-100 border border-border-default text-text-primary placeholder:text-text-muted text-sm focus:border-primary-500 focus:outline-none"
              />
              <Button size="sm" onClick={() => addSkill('technical')}>
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {data.skills.technical.map(skill => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-primary-500/15 border border-primary-500/25 text-primary-300 text-xs font-medium"
                >
                  {skill}
                  <button
                    onClick={() => removeSkill('technical', skill)}
                    className="hover:text-danger-400 transition-colors"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Tools & Frameworks */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-accent-300 uppercase tracking-wide">
              Tools, Platforms & Frameworks ({data.skills.tools.length})
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Add tool or framework (e.g. Docker, AWS, Git, Figma) and press Add"
                value={skillInput.tools}
                onChange={e => setSkillInput({ ...skillInput, tools: e.target.value })}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addSkill('tools');
                  }
                }}
                className="flex-1 px-3 py-2 rounded-xl bg-surface-100 border border-border-default text-text-primary placeholder:text-text-muted text-sm focus:border-primary-500 focus:outline-none"
              />
              <Button size="sm" onClick={() => addSkill('tools')}>
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {data.skills.tools.map(skill => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-accent-500/15 border border-accent-500/25 text-accent-300 text-xs font-medium"
                >
                  {skill}
                  <button
                    onClick={() => removeSkill('tools', skill)}
                    className="hover:text-danger-400 transition-colors"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Soft Skills */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-success-400 uppercase tracking-wide">
              Soft Skills & Methodologies ({data.skills.soft.length})
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Add soft skill (e.g. Agile Leadership, Mentorship, Communication) and press Add"
                value={skillInput.soft}
                onChange={e => setSkillInput({ ...skillInput, soft: e.target.value })}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addSkill('soft');
                  }
                }}
                className="flex-1 px-3 py-2 rounded-xl bg-surface-100 border border-border-default text-text-primary placeholder:text-text-muted text-sm focus:border-primary-500 focus:outline-none"
              />
              <Button size="sm" onClick={() => addSkill('soft')}>
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {data.skills.soft.map(skill => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-success-500/15 border border-success-500/25 text-success-300 text-xs font-medium"
                >
                  {skill}
                  <button
                    onClick={() => removeSkill('soft', skill)}
                    className="hover:text-danger-400 transition-colors"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Section 6: Projects */}
      {activeSection === 'projects' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-text-primary">Featured Projects</h3>
              <p className="text-xs text-text-secondary">Open source, portfolio, and significant side projects.</p>
            </div>
            <Button size="sm" onClick={addProject} icon={<Plus className="w-4 h-4" />}>
              Add Project
            </Button>
          </div>

          {data.projects.length === 0 ? (
            <div className="glass-card-static p-8 text-center">
              <p className="text-sm text-text-muted mb-4">No projects added yet.</p>
              <Button size="sm" onClick={addProject} icon={<Plus className="w-4 h-4" />}>
                Add A Project
              </Button>
            </div>
          ) : (
            data.projects.map((proj, idx) => (
              <div key={proj.id || idx} className="glass-card-static p-5 space-y-3 relative">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-primary-400 uppercase tracking-wider">
                    Project #{idx + 1}
                  </span>
                  <button
                    onClick={() => removeProject(idx)}
                    className="p-1.5 rounded-lg hover:bg-danger-500/15 text-text-muted hover:text-danger-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-text-secondary mb-1">Project Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. CloudMetrics Engine"
                      value={proj.name}
                      onChange={e => updateProject(idx, 'name', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-surface-100 border border-border-default text-text-primary placeholder:text-text-muted text-sm focus:border-primary-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-text-secondary mb-1">Live URL / Repository Link</label>
                    <input
                      type="text"
                      placeholder="e.g. github.com/user/project"
                      value={proj.link || ''}
                      onChange={e => updateProject(idx, 'link', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-surface-100 border border-border-default text-text-primary placeholder:text-text-muted text-sm focus:border-primary-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1">Technologies Used (comma separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. TypeScript, React, Next.js, Redis, Docker"
                    value={proj.technologies?.join(', ') || ''}
                    onChange={e =>
                      updateProject(
                        idx,
                        'technologies',
                        e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                      )
                    }
                    className="w-full px-3 py-2 rounded-xl bg-surface-100 border border-border-default text-text-primary placeholder:text-text-muted text-sm focus:border-primary-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1">Project Summary / Impact</label>
                  <textarea
                    rows={2}
                    placeholder="Describe what you built, architecture decisions, and measurable outcomes..."
                    value={proj.description}
                    onChange={e => updateProject(idx, 'description', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-surface-100 border border-border-default text-text-primary placeholder:text-text-muted text-xs leading-relaxed focus:border-primary-500 focus:outline-none"
                  />
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Section 7: Certifications */}
      {activeSection === 'certifications' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-text-primary">Certifications & Licenses</h3>
              <p className="text-xs text-text-secondary">Industry recognized certifications and credentials.</p>
            </div>
            <Button size="sm" onClick={addCertification} icon={<Plus className="w-4 h-4" />}>
              Add Certification
            </Button>
          </div>

          {data.certifications.length === 0 ? (
            <div className="glass-card-static p-8 text-center">
              <p className="text-sm text-text-muted mb-4">No certifications added yet.</p>
              <Button size="sm" onClick={addCertification} icon={<Plus className="w-4 h-4" />}>
                Add Certification
              </Button>
            </div>
          ) : (
            data.certifications.map((cert, idx) => (
              <div key={cert.id || idx} className="glass-card-static p-4 grid sm:grid-cols-3 gap-3 relative items-end">
                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1">Certification Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. AWS Solutions Architect"
                    value={cert.name}
                    onChange={e => updateCertification(idx, 'name', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-surface-100 border border-border-default text-text-primary placeholder:text-text-muted text-sm focus:border-primary-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1">Issuing Body</label>
                  <input
                    type="text"
                    placeholder="e.g. Amazon Web Services"
                    value={cert.issuer}
                    onChange={e => updateCertification(idx, 'issuer', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-surface-100 border border-border-default text-text-primary placeholder:text-text-muted text-sm focus:border-primary-500 focus:outline-none"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <label className="block text-xs font-semibold text-text-secondary mb-1">Year</label>
                    <input
                      type="text"
                      placeholder="e.g. 2023"
                      value={cert.year || ''}
                      onChange={e => updateCertification(idx, 'year', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-surface-100 border border-border-default text-text-primary placeholder:text-text-muted text-sm focus:border-primary-500 focus:outline-none"
                    />
                  </div>
                  <button
                    onClick={() => removeCertification(idx)}
                    className="p-2.5 rounded-xl hover:bg-danger-500/15 text-text-muted hover:text-danger-400 transition-colors mb-0.5"
                    title="Remove Certification"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
