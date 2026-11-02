import { TemplateDefinition, TemplateCategory } from '@/types/builder';

export const templateCategories: { id: TemplateCategory; label: string }[] = [
  { id: 'all', label: 'All templates' },
  { id: 'ats', label: 'ATS' },
  { id: 'two-column', label: 'Two-column' },
  { id: 'professional', label: 'Professional' },
  { id: 'simple', label: 'Simple' },
  { id: 'word', label: 'Word' },
];

export const resumeTemplates: TemplateDefinition[] = [
  {
    id: 'two-column',
    name: 'Two-Column Sidebar',
    category: ['all', 'two-column', 'professional'],
    description: 'Striking colored sidebar containing your avatar/initials, contact details, and skills, with a clean right column for experience.',
    badge: 'Most Popular',
    colorOptions: ['emerald', 'indigo', 'purple', 'rose', 'slate'],
    highlights: ['Colored accent sidebar', 'Candidate initial badge', 'High visual distinction', 'Great for tech & creative'],
  },
  {
    id: 'ats-classic',
    name: 'ATS Classic Timeline',
    category: ['all', 'ats', 'simple', 'word'],
    description: 'Structured layout with dates on the left timeline column and role achievements on the right. Guaranteed 100% ATS parser compatibility.',
    badge: 'Highest ATS Pass',
    colorOptions: ['slate', 'indigo', 'purple', 'emerald', 'rose'],
    highlights: ['Left date timeline column', 'Clean divider rules', 'Zero parsing ambiguity', 'Standard business layout'],
  },
  {
    id: 'executive',
    name: 'Boxed Executive',
    category: ['all', 'professional', 'word'],
    description: 'Centered header with elegant shaded section banner bars and serif typography, tailored for managerial and executive candidates.',
    badge: 'Leadership & Exec',
    colorOptions: ['slate', 'indigo', 'purple', 'emerald', 'rose'],
    highlights: ['Centered contact header', 'Shaded section banners', 'Classic serif typography', 'Corporate authority'],
  },
  {
    id: 'modern',
    name: 'Modern Tech',
    category: ['all', 'professional', 'simple'],
    description: 'Contemporary single-column design with vibrant accent bars, pill-shaped skill chips, and clean sans-serif typography.',
    badge: 'Modern Tech',
    colorOptions: ['indigo', 'purple', 'emerald', 'rose', 'slate'],
    highlights: ['Bold colored header rule', 'Pill skill tags', 'Balanced whitespace', 'Clean digital layout'],
  },
  {
    id: 'minimal',
    name: 'Minimalist Mono',
    category: ['all', 'ats', 'simple'],
    description: 'Ultra-clean, high-density layout with code-style section headers and border accents for maximum readability and ATS score.',
    badge: 'Clean Minimal',
    colorOptions: ['slate', 'indigo', 'emerald', 'purple', 'rose'],
    highlights: ['Monospace section markers', 'Maximum content density', 'Clean left borders', 'Fast scanability'],
  },
];
