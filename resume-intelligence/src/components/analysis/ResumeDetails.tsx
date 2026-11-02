'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  Code2,
  Briefcase,
  GraduationCap,
  FolderKanban,
  Award,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import {
  ExtractedSkill,
  Education,
  WorkExperience,
  Project,
  Certification,
} from '@/types/resume';

interface ResumeDetailsProps {
  skills: ExtractedSkill[];
  education: Education[];
  experience: WorkExperience[];
  projects: Project[];
  certifications: Certification[];
}

interface AccordionItemProps {
  title: string;
  icon: React.ReactNode;
  count: number;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function AccordionItem({ title, icon, count, children, defaultOpen = false }: AccordionItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="glass-card-static overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 hover:bg-surface-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          {icon}
          <span className="text-sm font-semibold text-text-primary">{title}</span>
          <span className="chip chip-blue text-[10px] py-0">{count}</span>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4 text-text-muted" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 border-t border-border-subtle pt-4">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const categoryBadgeMap: Record<string, 'blue' | 'green' | 'purple' | 'amber'> = {
  technical: 'blue',
  framework: 'purple',
  tool: 'green',
  soft: 'amber',
  language: 'blue',
};

export function ResumeDetails({
  skills,
  education,
  experience,
  projects,
  certifications,
}: ResumeDetailsProps) {
  return (
    <div className="space-y-3">
      {/* Skills */}
      <AccordionItem
        title="Skills"
        icon={<Code2 className="w-5 h-5 text-primary-400" />}
        count={skills.length}
        defaultOpen
      >
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, i) => (
            <Badge key={i} variant={categoryBadgeMap[skill.category] || 'default'}>
              {skill.name}
              {skill.proficiency && (
                <span className="opacity-60 ml-1 text-[10px]">• {skill.proficiency}</span>
              )}
            </Badge>
          ))}
        </div>
      </AccordionItem>

      {/* Experience */}
      <AccordionItem
        title="Work Experience"
        icon={<Briefcase className="w-5 h-5 text-accent-400" />}
        count={experience.length}
        defaultOpen
      >
        <div className="space-y-4">
          {experience.map((exp, i) => (
            <div key={i} className="relative pl-4 border-l-2 border-primary-500/30">
              <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-primary-500" />
              <p className="text-sm font-semibold text-text-primary">{exp.title}</p>
              <p className="text-xs text-primary-400 font-medium">{exp.company}</p>
              <p className="text-xs text-text-muted mb-2">{exp.duration}</p>
              <ul className="space-y-1">
                {exp.description.map((desc, j) => (
                  <li key={j} className="text-xs text-text-secondary flex gap-2">
                    <span className="text-text-muted mt-0.5">•</span>
                    <span>{desc}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </AccordionItem>

      {/* Education */}
      <AccordionItem
        title="Education"
        icon={<GraduationCap className="w-5 h-5 text-success-400" />}
        count={education.length}
      >
        <div className="space-y-3">
          {education.map((edu, i) => (
            <div key={i}>
              <p className="text-sm font-semibold text-text-primary">{edu.degree}</p>
              <p className="text-xs text-primary-400 font-medium">{edu.institution}</p>
              <div className="flex gap-3 mt-1">
                <p className="text-xs text-text-muted">{edu.year}</p>
                {edu.gpa && <p className="text-xs text-text-muted">GPA: {edu.gpa}</p>}
              </div>
            </div>
          ))}
        </div>
      </AccordionItem>

      {/* Projects */}
      <AccordionItem
        title="Projects"
        icon={<FolderKanban className="w-5 h-5 text-warning-400" />}
        count={projects.length}
      >
        <div className="space-y-4">
          {projects.map((proj, i) => (
            <div key={i}>
              <p className="text-sm font-semibold text-text-primary">{proj.name}</p>
              <p className="text-xs text-text-secondary mt-1">{proj.description}</p>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {proj.technologies.map((tech, j) => (
                  <Badge key={j} variant="purple">{tech}</Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </AccordionItem>

      {/* Certifications */}
      <AccordionItem
        title="Certifications"
        icon={<Award className="w-5 h-5 text-danger-400" />}
        count={certifications.length}
      >
        <div className="space-y-3">
          {certifications.map((cert, i) => (
            <div key={i} className="flex items-start gap-3">
              <Award className="w-4 h-4 text-warning-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-text-primary">{cert.name}</p>
                <p className="text-xs text-text-muted">
                  {cert.issuer} {cert.year && `• ${cert.year}`}
                </p>
              </div>
            </div>
          ))}
        </div>
      </AccordionItem>
    </div>
  );
}
