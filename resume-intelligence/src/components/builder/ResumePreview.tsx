'use client';

import React from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Globe,
  Code2,
  Link2,
  Sparkles,
  Layers,
  Palette,
  LayoutGrid,
} from 'lucide-react';
import { ResumeBuilderData, TemplateStyle, ThemeColor } from '@/types/builder';
import { resumeTemplates } from './templateDefinitions';

interface ResumePreviewProps {
  data: ResumeBuilderData;
  onTemplateChange: (template: TemplateStyle) => void;
  onThemeColorChange: (color: ThemeColor) => void;
  onOpenGallery?: () => void;
}

const themeColorMap: Record<
  ThemeColor,
  { primary: string; secondary: string; border: string; bgSoft: string; text: string; ring: string; darkBg: string }
> = {
  indigo: {
    primary: '#4f46e5',
    secondary: '#818cf8',
    border: 'border-indigo-500',
    bgSoft: 'bg-indigo-50',
    text: 'text-indigo-600',
    ring: 'ring-indigo-500',
    darkBg: '#1e1b4b',
  },
  purple: {
    primary: '#9333ea',
    secondary: '#c084fc',
    border: 'border-purple-500',
    bgSoft: 'bg-purple-50',
    text: 'text-purple-600',
    ring: 'ring-purple-500',
    darkBg: '#3b0764',
  },
  emerald: {
    primary: '#047857',
    secondary: '#34d399',
    border: 'border-emerald-500',
    bgSoft: 'bg-emerald-50',
    text: 'text-emerald-600',
    ring: 'ring-emerald-500',
    darkBg: '#064e3b',
  },
  rose: {
    primary: '#e11d48',
    secondary: '#fb7185',
    border: 'border-rose-500',
    bgSoft: 'bg-rose-50',
    text: 'text-rose-600',
    ring: 'ring-rose-500',
    darkBg: '#4c0519',
  },
  slate: {
    primary: '#334155',
    secondary: '#94a3b8',
    border: 'border-slate-700',
    bgSoft: 'bg-slate-100',
    text: 'text-slate-800',
    ring: 'ring-slate-700',
    darkBg: '#0f172a',
  },
};

export function ResumePreview({ data, onTemplateChange, onThemeColorChange, onOpenGallery }: ResumePreviewProps) {
  const { personalInfo, summary, experience, education, skills, projects, certifications, templateStyle, themeColor } = data;
  const activeTheme = themeColorMap[themeColor] || themeColorMap.indigo;

  // Calculate initials for two-column avatar
  const getInitials = (name: string) => {
    if (!name) return 'CV';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  // Calculate live ATS readiness score
  const calculateATS = () => {
    let score = 20;
    if (personalInfo.fullName?.trim()) score += 10;
    if (personalInfo.email?.trim() && personalInfo.phone?.trim()) score += 15;
    if (personalInfo.jobTitle?.trim()) score += 10;
    if (summary?.trim().length > 60) score += 15;
    if (experience?.length > 0 && experience[0]?.description?.some(b => b.trim().length > 20)) score += 15;
    if (education?.length > 0 && education[0]?.degree) score += 10;
    const totalSkills = (skills.technical?.length || 0) + (skills.tools?.length || 0) + (skills.soft?.length || 0);
    if (totalSkills >= 5) score += 5;
    return Math.min(score, 100);
  };

  const atsScore = calculateATS();

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Top Bar: Controls & Gallery Link */}
      <div className="glass-card-static p-4 flex flex-wrap items-center justify-between gap-4">
        {/* Template Selector & Gallery Button */}
        <div className="flex items-center gap-2">
          {onOpenGallery && (
            <button
              onClick={onOpenGallery}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl gradient-bg-primary text-white text-xs font-semibold hover:shadow-md hover:shadow-primary-500/20 transition-all mr-1"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Templates Gallery</span>
            </button>
          )}

          <div className="flex items-center gap-1 bg-surface-100 p-1 rounded-xl border border-border-subtle overflow-x-auto max-w-[320px] scrollbar-none">
            {resumeTemplates.map(t => (
              <button
                key={t.id}
                onClick={() => onTemplateChange(t.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  templateStyle === t.id
                    ? 'bg-primary-500 text-white shadow-sm'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
                title={t.description}
              >
                {t.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Theme Color Selector */}
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4 text-text-muted" />
          <span className="text-xs font-semibold text-text-secondary">Theme:</span>
          <div className="flex items-center gap-1.5">
            {(['emerald', 'indigo', 'purple', 'rose', 'slate'] as ThemeColor[]).map(color => (
              <button
                key={color}
                onClick={() => onThemeColorChange(color)}
                style={{ backgroundColor: themeColorMap[color].primary }}
                className={`w-5 h-5 rounded-full transition-transform hover:scale-110 ${
                  themeColor === color ? 'ring-2 ring-white ring-offset-2 ring-offset-[#0a0a1a] scale-110' : 'opacity-80'
                }`}
                title={color}
              />
            ))}
          </div>
        </div>

        {/* Live ATS Meter */}
        <div className="flex items-center gap-2 bg-surface-100 px-3 py-1.5 rounded-xl border border-border-subtle">
          <Sparkles className="w-3.5 h-3.5 text-warning-400" />
          <span className="text-xs text-text-secondary">ATS Strength:</span>
          <span
            className={`text-xs font-bold ${
              atsScore >= 80 ? 'text-success-400' : atsScore >= 50 ? 'text-warning-400' : 'text-danger-400'
            }`}
          >
            {atsScore}%
          </span>
        </div>
      </div>

      {/* Document Sheet Container */}
      <div className="flex-1 overflow-y-auto max-h-[820px] rounded-2xl p-4 sm:p-6 bg-slate-900/60 border border-border-subtle flex justify-center">
        {/* Printable White Document Canvas */}
        <div
          id="resume-printable-area"
          className="w-full max-w-[760px] bg-white text-slate-900 rounded-lg shadow-2xl transition-all font-sans min-h-[1000px] overflow-hidden"
          style={{
            fontFamily:
              templateStyle === 'executive'
                ? 'Georgia, Cambria, serif'
                : templateStyle === 'minimal'
                ? 'ui-monospace, Menlo, Inter, sans-serif'
                : 'Inter, system-ui, sans-serif',
          }}
        >
          {/* ============================================================ */}
          {/* TEMPLATE 1: TWO-COLUMN SIDEBAR (As shown in screenshot card 3) */}
          {/* ============================================================ */}
          {templateStyle === 'two-column' && (
            <div className="flex flex-col sm:flex-row min-h-[1000px]">
              {/* Left Colored Sidebar */}
              <div
                className="sm:w-[36%] p-6 sm:p-7 text-white flex flex-col justify-between"
                style={{ backgroundColor: activeTheme.darkBg }}
              >
                <div className="space-y-6">
                  {/* Initials Avatar */}
                  <div className="flex flex-col items-center text-center pb-2">
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center font-bold text-xl mb-3 shadow-lg border-2 border-white/20"
                      style={{ backgroundColor: activeTheme.primary }}
                    >
                      {getInitials(personalInfo.fullName)}
                    </div>
                    <h1 className="text-lg font-bold tracking-tight text-white">
                      {personalInfo.fullName || 'Candidate Name'}
                    </h1>
                    {personalInfo.jobTitle && (
                      <p className="text-xs uppercase tracking-wider mt-1 text-white/80 font-medium">
                        {personalInfo.jobTitle}
                      </p>
                    )}
                  </div>

                  {/* Sidebar: Details / Contact */}
                  <div className="space-y-2.5 pt-2 border-t border-white/15">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-white/90">Details</h3>
                    <div className="space-y-2 text-[11px] text-white/80">
                      {personalInfo.location && (
                        <p className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-white/60" />
                          <span>{personalInfo.location}</span>
                        </p>
                      )}
                      {personalInfo.phone && (
                        <p className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 flex-shrink-0 text-white/60" />
                          <span>{personalInfo.phone}</span>
                        </p>
                      )}
                      {personalInfo.email && (
                        <p className="flex items-center gap-1.5 break-all">
                          <Mail className="w-3.5 h-3.5 flex-shrink-0 text-white/60" />
                          <span>{personalInfo.email}</span>
                        </p>
                      )}
                      {personalInfo.linkedin && (
                        <p className="flex items-center gap-1.5 break-all">
                          <Link2 className="w-3.5 h-3.5 flex-shrink-0 text-white/60" />
                          <span>{personalInfo.linkedin}</span>
                        </p>
                      )}
                      {personalInfo.website && (
                        <p className="flex items-center gap-1.5 break-all">
                          <Globe className="w-3.5 h-3.5 flex-shrink-0 text-white/60" />
                          <span>{personalInfo.website}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Sidebar: Skills */}
                  {(skills.technical.length > 0 || skills.tools.length > 0 || skills.soft.length > 0) && (
                    <div className="space-y-2.5 pt-2 border-t border-white/15">
                      <h3 className="text-xs font-bold uppercase tracking-widest text-white/90">Skills</h3>
                      <div className="space-y-1.5 text-[11px]">
                        {skills.technical.map(s => (
                          <div
                            key={s}
                            className="px-2.5 py-1 rounded bg-white/10 text-white/95 text-[11px] font-medium"
                          >
                            {s}
                          </div>
                        ))}
                        {skills.tools.map(s => (
                          <div
                            key={s}
                            className="px-2.5 py-1 rounded bg-white/10 text-white/95 text-[11px] font-medium"
                          >
                            {s}
                          </div>
                        ))}
                        {skills.soft.map(s => (
                          <div
                            key={s}
                            className="px-2.5 py-1 rounded bg-white/5 text-white/80 text-[11px]"
                          >
                            {s}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Sidebar: Certifications */}
                  {certifications.filter(c => c.name).length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-white/15">
                      <h3 className="text-xs font-bold uppercase tracking-widest text-white/90">Certifications</h3>
                      <div className="space-y-1.5 text-[11px] text-white/85">
                        {certifications
                          .filter(c => c.name)
                          .map((c, idx) => (
                            <div key={idx}>
                              <p className="font-semibold text-white">{c.name}</p>
                              <p className="text-[10px] text-white/70">
                                {c.issuer} {c.year ? `(${c.year})` : ''}
                              </p>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Main Body Content */}
              <div className="sm:w-[64%] p-7 sm:p-8 space-y-6 text-slate-800">
                {/* Profile */}
                {summary && (
                  <div>
                    <h2
                      className="text-xs font-bold uppercase tracking-widest pb-1 border-b mb-2.5"
                      style={{ color: activeTheme.primary, borderColor: activeTheme.primary }}
                    >
                      Profile
                    </h2>
                    <p className="text-xs sm:text-[13px] leading-relaxed text-slate-700">{summary}</p>
                  </div>
                )}

                {/* Employment History */}
                {experience.filter(e => e.title || e.company).length > 0 && (
                  <div>
                    <h2
                      className="text-xs font-bold uppercase tracking-widest pb-1 border-b mb-3"
                      style={{ color: activeTheme.primary, borderColor: activeTheme.primary }}
                    >
                      Employment History
                    </h2>
                    <div className="space-y-4">
                      {experience
                        .filter(e => e.title || e.company)
                        .map((exp, idx) => (
                          <div key={idx} className="space-y-1 text-xs">
                            <div className="flex flex-wrap items-baseline justify-between font-bold text-slate-900">
                              <span>{exp.title}</span>
                              <span className="text-[11px] font-normal text-slate-500">
                                {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                              </span>
                            </div>
                            <p className="text-slate-600 font-medium">
                              {exp.company} {exp.location ? `• ${exp.location}` : ''}
                            </p>
                            <ul className="list-disc list-outside ml-4 space-y-1 pt-1 text-slate-700">
                              {exp.description
                                .filter(b => b.trim())
                                .map((b, bIdx) => (
                                  <li key={bIdx} className="leading-relaxed">
                                    {b}
                                  </li>
                                ))}
                            </ul>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* Education */}
                {education.filter(e => e.degree || e.institution).length > 0 && (
                  <div>
                    <h2
                      className="text-xs font-bold uppercase tracking-widest pb-1 border-b mb-3"
                      style={{ color: activeTheme.primary, borderColor: activeTheme.primary }}
                    >
                      Education
                    </h2>
                    <div className="space-y-3">
                      {education
                        .filter(e => e.degree || e.institution)
                        .map((edu, idx) => (
                          <div key={idx} className="text-xs">
                            <div className="flex justify-between items-baseline font-bold text-slate-900">
                              <span>{edu.degree} {edu.field ? `in ${edu.field}` : ''}</span>
                              <span className="text-[11px] font-normal text-slate-500">{edu.year}</span>
                            </div>
                            <p className="text-slate-600">
                              {edu.institution} {edu.gpa ? `• GPA: ${edu.gpa}` : ''}
                            </p>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* Projects */}
                {projects.filter(p => p.name).length > 0 && (
                  <div>
                    <h2
                      className="text-xs font-bold uppercase tracking-widest pb-1 border-b mb-3"
                      style={{ color: activeTheme.primary, borderColor: activeTheme.primary }}
                    >
                      Key Projects
                    </h2>
                    <div className="space-y-3">
                      {projects
                        .filter(p => p.name)
                        .map((proj, idx) => (
                          <div key={idx} className="text-xs space-y-1">
                            <div className="flex justify-between font-bold text-slate-900">
                              <span>{proj.name}</span>
                              {proj.link && <span className="text-[11px] text-slate-500 font-mono">{proj.link}</span>}
                            </div>
                            {proj.technologies && proj.technologies.length > 0 && (
                              <p className="text-[11px] font-medium" style={{ color: activeTheme.primary }}>
                                Stack: {proj.technologies.join(', ')}
                              </p>
                            )}
                            <p className="text-slate-700 leading-relaxed">{proj.description}</p>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* TEMPLATE 2: ATS CLASSIC TIMELINE (As shown in screenshot card 1) */}
          {/* ============================================================ */}
          {templateStyle === 'ats-classic' && (
            <div className="p-8 sm:p-10 space-y-6 text-slate-900">
              {/* Header */}
              <div className="text-center pb-4 border-b-2 border-slate-900">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                  {personalInfo.fullName || 'Candidate Name'}
                </h1>
                {personalInfo.jobTitle && (
                  <p className="text-sm font-semibold text-slate-700 uppercase tracking-wide mt-1">
                    {personalInfo.jobTitle}
                  </p>
                )}
                <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-1 mt-2 text-xs text-slate-600">
                  {personalInfo.location && <span>{personalInfo.location}</span>}
                  {personalInfo.phone && <span>• {personalInfo.phone}</span>}
                  {personalInfo.email && <span>• {personalInfo.email}</span>}
                  {personalInfo.linkedin && <span>• {personalInfo.linkedin}</span>}
                  {personalInfo.website && <span>• {personalInfo.website}</span>}
                </div>
              </div>

              {/* Profile / Summary */}
              {summary && (
                <div className="space-y-1.5">
                  <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-300 pb-1">
                    PROFILE
                  </h2>
                  <p className="text-xs sm:text-[13px] text-slate-800 leading-relaxed text-justify">{summary}</p>
                </div>
              )}

              {/* Experience: Two-Column Timeline */}
              {experience.filter(e => e.title || e.company).length > 0 && (
                <div className="space-y-3">
                  <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-300 pb-1">
                    EXPERIENCE
                  </h2>
                  <div className="space-y-4">
                    {experience
                      .filter(e => e.title || e.company)
                      .map((exp, idx) => (
                        <div key={idx} className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-xs">
                          {/* Left Date Column */}
                          <div className="sm:w-32 flex-shrink-0 text-slate-500 font-medium text-[11px]">
                            {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                          </div>
                          {/* Right Content Column */}
                          <div className="flex-1 space-y-1">
                            <div className="flex justify-between items-baseline font-bold text-slate-900 text-sm">
                              <span>{exp.title}</span>
                              <span className="font-normal text-slate-600 text-xs">{exp.location}</span>
                            </div>
                            <p className="font-semibold text-slate-700 italic">{exp.company}</p>
                            <ul className="list-disc list-outside ml-4 space-y-1 pt-1 text-slate-800">
                              {exp.description
                                .filter(b => b.trim())
                                .map((b, bIdx) => (
                                  <li key={bIdx} className="leading-relaxed">
                                    {b}
                                  </li>
                                ))}
                            </ul>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Education: Timeline */}
              {education.filter(e => e.degree || e.institution).length > 0 && (
                <div className="space-y-3">
                  <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-300 pb-1">
                    EDUCATION
                  </h2>
                  <div className="space-y-3">
                    {education
                      .filter(e => e.degree || e.institution)
                      .map((edu, idx) => (
                        <div key={idx} className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-xs">
                          <div className="sm:w-32 flex-shrink-0 text-slate-500 font-medium text-[11px]">
                            {edu.year}
                          </div>
                          <div className="flex-1">
                            <span className="font-bold text-slate-900">
                              {edu.degree} {edu.field ? `in ${edu.field}` : ''}
                            </span>
                            <p className="text-slate-600">
                              {edu.institution} {edu.gpa ? `• GPA: ${edu.gpa}` : ''}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Skills */}
              {(skills.technical.length > 0 || skills.tools.length > 0 || skills.soft.length > 0) && (
                <div className="space-y-2">
                  <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-300 pb-1">
                    SKILLS & COMPETENCIES
                  </h2>
                  <div className="text-xs space-y-1 text-slate-800">
                    {skills.technical.length > 0 && (
                      <p>
                        <strong className="font-semibold text-slate-900">Technical Skills:</strong>{' '}
                        {skills.technical.join(', ')}
                      </p>
                    )}
                    {skills.tools.length > 0 && (
                      <p>
                        <strong className="font-semibold text-slate-900">Tools & Platforms:</strong>{' '}
                        {skills.tools.join(', ')}
                      </p>
                    )}
                    {skills.soft.length > 0 && (
                      <p>
                        <strong className="font-semibold text-slate-900">Soft Skills:</strong>{' '}
                        {skills.soft.join(', ')}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ============================================================ */}
          {/* TEMPLATE 3: BOXED EXECUTIVE (As shown in screenshot card 2) */}
          {/* ============================================================ */}
          {templateStyle === 'executive' && (
            <div className="p-8 sm:p-10 space-y-6 text-slate-900">
              {/* Boxed Centered Header */}
              <div className="text-center space-y-1.5 pb-3">
                <h1 className="text-3xl font-bold tracking-tight uppercase">{personalInfo.fullName || 'Candidate Name'}</h1>
                {personalInfo.jobTitle && (
                  <p className="text-sm font-semibold tracking-widest uppercase text-slate-700">
                    {personalInfo.jobTitle}
                  </p>
                )}
                <p className="text-xs text-slate-500 italic">{personalInfo.location}</p>
                <div className="flex flex-wrap justify-between items-center text-xs text-slate-700 border-y border-slate-900 py-1.5 mt-3">
                  <span>{personalInfo.phone || 'Phone'}</span>
                  <span>{personalInfo.email || 'Email'}</span>
                  {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
                </div>
              </div>

              {/* Shaded Section Banner: Profile */}
              {summary && (
                <div className="space-y-2">
                  <div className="bg-slate-200/80 border border-slate-300 px-3 py-1 text-center font-bold text-xs uppercase tracking-widest text-slate-900">
                    PROFILE
                  </div>
                  <p className="text-xs sm:text-sm text-slate-800 leading-relaxed text-justify px-1">{summary}</p>
                </div>
              )}

              {/* Shaded Section Banner: Experience */}
              {experience.filter(e => e.title || e.company).length > 0 && (
                <div className="space-y-3">
                  <div className="bg-slate-200/80 border border-slate-300 px-3 py-1 text-center font-bold text-xs uppercase tracking-widest text-slate-900">
                    EXPERIENCE
                  </div>
                  <div className="space-y-4 px-1">
                    {experience
                      .filter(e => e.title || e.company)
                      .map((exp, idx) => (
                        <div key={idx} className="space-y-1 text-xs">
                          <div className="flex justify-between items-baseline font-bold text-sm">
                            <span>❖ {exp.title} — {exp.company}</span>
                            <span className="text-xs font-normal text-slate-600">
                              {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                            </span>
                          </div>
                          <p className="text-xs italic text-slate-600 pl-4">{exp.location}</p>
                          <ul className="list-outside ml-6 space-y-1 pt-1 text-slate-800">
                            {exp.description
                              .filter(b => b.trim())
                              .map((bullet, bIdx) => (
                                <li key={bIdx} className="leading-relaxed list-disc">
                                  {bullet}
                                </li>
                              ))}
                          </ul>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Shaded Section Banner: Education */}
              {education.filter(e => e.degree || e.institution).length > 0 && (
                <div className="space-y-2">
                  <div className="bg-slate-200/80 border border-slate-300 px-3 py-1 text-center font-bold text-xs uppercase tracking-widest text-slate-900">
                    EDUCATION
                  </div>
                  <div className="space-y-2 text-xs px-1">
                    {education
                      .filter(e => e.degree || e.institution)
                      .map((edu, idx) => (
                        <div key={idx} className="flex justify-between items-baseline">
                          <div>
                            <span className="font-bold">❖ {edu.degree}</span>
                            <span className="text-slate-700"> — {edu.institution}</span>
                            {edu.gpa && <span className="text-slate-600"> (GPA: {edu.gpa})</span>}
                          </div>
                          <span className="text-slate-600">{edu.year}</span>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Shaded Section Banner: Skills */}
              {(skills.technical.length > 0 || skills.tools.length > 0 || skills.soft.length > 0) && (
                <div className="space-y-2">
                  <div className="bg-slate-200/80 border border-slate-300 px-3 py-1 text-center font-bold text-xs uppercase tracking-widest text-slate-900">
                    AREAS OF EXPERTISE
                  </div>
                  <div className="text-xs space-y-1 text-slate-800 px-1">
                    {skills.technical.length > 0 && (
                      <p>
                        <strong>Core Competencies:</strong> {skills.technical.join(', ')}
                      </p>
                    )}
                    {skills.tools.length > 0 && (
                      <p>
                        <strong>Technologies:</strong> {skills.tools.join(', ')}
                      </p>
                    )}
                    {skills.soft.length > 0 && (
                      <p>
                        <strong>Leadership:</strong> {skills.soft.join(', ')}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ============================================================ */}
          {/* TEMPLATE 4: MODERN TECH */}
          {/* ============================================================ */}
          {templateStyle === 'modern' && (
            <div className="p-8 sm:p-10 space-y-6">
              {/* Header */}
              <div className="border-b-2 pb-4" style={{ borderColor: activeTheme.primary }}>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                  {personalInfo.fullName || 'Your Full Name'}
                </h1>
                {personalInfo.jobTitle && (
                  <p className="text-sm sm:text-base font-semibold mt-1" style={{ color: activeTheme.primary }}>
                    {personalInfo.jobTitle}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3 text-xs text-slate-600">
                  {personalInfo.email && (
                    <span className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-slate-400" /> {personalInfo.email}
                    </span>
                  )}
                  {personalInfo.phone && (
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-slate-400" /> {personalInfo.phone}
                    </span>
                  )}
                  {personalInfo.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" /> {personalInfo.location}
                    </span>
                  )}
                  {personalInfo.linkedin && (
                    <span className="flex items-center gap-1">
                      <Link2 className="w-3.5 h-3.5 text-slate-400" /> {personalInfo.linkedin}
                    </span>
                  )}
                  {personalInfo.website && (
                    <span className="flex items-center gap-1">
                      <Globe className="w-3.5 h-3.5 text-slate-400" /> {personalInfo.website}
                    </span>
                  )}
                  {personalInfo.github && (
                    <span className="flex items-center gap-1">
                      <Code2 className="w-3.5 h-3.5 text-slate-400" /> {personalInfo.github}
                    </span>
                  )}
                </div>
              </div>

              {/* Summary */}
              {summary && (
                <div>
                  <h2
                    className="text-xs font-bold uppercase tracking-wider mb-2"
                    style={{ color: activeTheme.primary }}
                  >
                    Professional Summary
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{summary}</p>
                </div>
              )}

              {/* Experience */}
              {experience.filter(e => e.title || e.company).length > 0 && (
                <div>
                  <h2
                    className="text-xs font-bold uppercase tracking-wider mb-3 pb-1 border-b border-slate-200"
                    style={{ color: activeTheme.primary }}
                  >
                    Work Experience
                  </h2>
                  <div className="space-y-4">
                    {experience
                      .filter(e => e.title || e.company)
                      .map((exp, idx) => (
                        <div key={idx} className="space-y-1.5">
                          <div className="flex flex-wrap items-baseline justify-between">
                            <span className="text-sm font-bold text-slate-900">{exp.title || 'Role'}</span>
                            <span className="text-xs text-slate-500">
                              {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                            </span>
                          </div>
                          <p className="text-xs font-medium text-slate-600">
                            {exp.company} {exp.location ? `• ${exp.location}` : ''}
                          </p>
                          <ul className="list-disc list-outside ml-4 space-y-1 pt-1">
                            {exp.description
                              .filter(b => b.trim())
                              .map((bullet, bIdx) => (
                                <li key={bIdx} className="text-xs text-slate-700 leading-relaxed">
                                  {bullet}
                                </li>
                              ))}
                          </ul>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Skills */}
              {(skills.technical.length > 0 || skills.tools.length > 0 || skills.soft.length > 0) && (
                <div>
                  <h2
                    className="text-xs font-bold uppercase tracking-wider mb-3 pb-1 border-b border-slate-200"
                    style={{ color: activeTheme.primary }}
                  >
                    Skills & Technologies
                  </h2>
                  <div className="space-y-2 text-xs">
                    {skills.technical.length > 0 && (
                      <div className="flex items-baseline gap-2">
                        <span className="font-semibold text-slate-800 w-24 flex-shrink-0">Technical:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {skills.technical.map(s => (
                            <span
                              key={s}
                              className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {skills.tools.length > 0 && (
                      <div className="flex items-baseline gap-2">
                        <span className="font-semibold text-slate-800 w-24 flex-shrink-0">Tools:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {skills.tools.map(s => (
                            <span
                              key={s}
                              className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Education */}
              {education.filter(e => e.degree || e.institution).length > 0 && (
                <div>
                  <h2
                    className="text-xs font-bold uppercase tracking-wider mb-3 pb-1 border-b border-slate-200"
                    style={{ color: activeTheme.primary }}
                  >
                    Education
                  </h2>
                  <div className="space-y-3">
                    {education
                      .filter(e => e.degree || e.institution)
                      .map((edu, idx) => (
                        <div key={idx} className="flex flex-wrap items-baseline justify-between text-xs">
                          <div>
                            <span className="font-bold text-slate-900">
                              {edu.degree} {edu.field ? `in ${edu.field}` : ''}
                            </span>
                            <p className="text-slate-600 mt-0.5">
                              {edu.institution} {edu.gpa ? `• GPA: ${edu.gpa}` : ''}
                            </p>
                          </div>
                          <span className="text-slate-500">{edu.year}</span>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ============================================================ */}
          {/* TEMPLATE 5: MINIMALIST MONO */}
          {/* ============================================================ */}
          {templateStyle === 'minimal' && (
            <div className="p-8 sm:p-10 space-y-5 text-slate-900">
              <div className="border-l-4 pl-4" style={{ borderColor: activeTheme.primary }}>
                <h1 className="text-2xl font-bold tracking-tight">{personalInfo.fullName || 'Candidate Name'}</h1>
                <p className="text-sm font-medium text-slate-600 mt-0.5">{personalInfo.jobTitle}</p>
                <div className="flex flex-wrap gap-3 mt-2 text-xs text-slate-500 font-mono">
                  {personalInfo.email && <span>{personalInfo.email}</span>}
                  {personalInfo.phone && <span>{personalInfo.phone}</span>}
                  {personalInfo.location && <span>{personalInfo.location}</span>}
                  {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
                  {personalInfo.github && <span>{personalInfo.github}</span>}
                </div>
              </div>

              {summary && (
                <div className="space-y-1">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">// SUMMARY</h2>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{summary}</p>
                </div>
              )}

              {experience.filter(e => e.title || e.company).length > 0 && (
                <div className="space-y-3">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">// EXPERIENCE</h2>
                  <div className="space-y-3">
                    {experience
                      .filter(e => e.title || e.company)
                      .map((exp, idx) => (
                        <div key={idx} className="space-y-1 text-xs">
                          <div className="flex justify-between font-semibold">
                            <span>
                              {exp.title} <span className="font-normal text-slate-500">@ {exp.company}</span>
                            </span>
                            <span className="font-mono text-[11px] text-slate-500">
                              {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                            </span>
                          </div>
                          <ul className="space-y-1 pt-1">
                            {exp.description
                              .filter(b => b.trim())
                              .map((b, bIdx) => (
                                <li key={bIdx} className="text-slate-700 leading-relaxed pl-3 border-l border-slate-300">
                                  {b}
                                </li>
                              ))}
                          </ul>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {education.filter(e => e.degree || e.institution).length > 0 && (
                <div className="space-y-2 text-xs">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">// EDUCATION</h2>
                  {education
                    .filter(e => e.degree || e.institution)
                    .map((edu, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span>
                          {edu.degree} — {edu.institution}
                        </span>
                        <span className="font-mono text-slate-500">{edu.year}</span>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
