'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Check,
  X,
  RotateCcw,
  Edit3,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { EnhancedSection, ChangeItem } from '@/types/resume';

interface ResumeEditorProps {
  sections: EnhancedSection[];
  onSectionsChange: (sections: EnhancedSection[]) => void;
  onRegenerateSection: (sectionId: string) => void;
  regeneratingSection: string | null;
}

export function ResumeEditor({
  sections,
  onSectionsChange,
  onRegenerateSection,
  regeneratingSection,
}: ResumeEditorProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(sections.map(s => s.id))
  );
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  const toggleSection = (id: string) => {
    const next = new Set(expandedSections);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpandedSections(next);
  };

  const toggleSectionAcceptance = (sectionId: string) => {
    onSectionsChange(
      sections.map(s => s.id === sectionId ? { ...s, accepted: !s.accepted } : s)
    );
  };

  const toggleChangeAcceptance = (sectionId: string, changeId: string) => {
    onSectionsChange(
      sections.map(s => {
        if (s.id !== sectionId) return s;
        return {
          ...s,
          changes: s.changes.map(c =>
            c.id === changeId ? { ...c, accepted: !c.accepted } : c
          ),
        };
      })
    );
  };

  const startEditing = (section: EnhancedSection) => {
    setEditingSectionId(section.id);
    setEditContent(section.enhancedContent);
  };

  const saveEdit = (sectionId: string) => {
    onSectionsChange(
      sections.map(s => s.id === sectionId ? { ...s, enhancedContent: editContent } : s)
    );
    setEditingSectionId(null);
  };

  const changeTypeColors: Record<string, string> = {
    addition: 'chip-green',
    modification: 'chip-amber',
    reorder: 'chip-blue',
    formatting: 'chip-purple',
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-bold text-text-primary" style={{ fontFamily: 'var(--font-heading)' }}>
          Enhanced Resume Editor
        </h3>
        <div className="flex items-center gap-2 text-xs text-text-muted">
          <span className="chip chip-green text-[10px] py-0">
            {sections.filter(s => s.accepted).length}/{sections.length} sections accepted
          </span>
        </div>
      </div>

      {sections.map((section) => {
        const isExpanded = expandedSections.has(section.id);
        const isEditing = editingSectionId === section.id;
        const isRegenerating = regeneratingSection === section.id;

        return (
          <motion.div
            key={section.id}
            layout
            className={`glass-card-static overflow-hidden transition-all ${
              section.accepted ? 'border-l-2 border-l-success-400' : 'border-l-2 border-l-border-subtle'
            }`}
          >
            {/* Section Header */}
            <div className="flex items-center justify-between p-4">
              <button
                onClick={() => toggleSection(section.id)}
                className="flex items-center gap-3 flex-1"
              >
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4 text-text-muted" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-text-muted" />
                )}
                <span className="text-sm font-semibold text-text-primary">{section.name}</span>
                <span className="chip chip-blue text-[10px] py-0">{section.changes.length} changes</span>
              </button>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRegenerateSection(section.id)}
                  loading={isRegenerating}
                  icon={<RotateCcw className="w-3.5 h-3.5" />}
                >
                  <span className="hidden sm:inline">Regenerate</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => startEditing(section)}
                  icon={<Edit3 className="w-3.5 h-3.5" />}
                >
                  <span className="hidden sm:inline">Edit</span>
                </Button>
                <button
                  onClick={() => toggleSectionAcceptance(section.id)}
                  className={`p-1.5 rounded-lg transition-colors ${
                    section.accepted
                      ? 'bg-success-500/15 text-success-400'
                      : 'bg-surface-200 text-text-muted'
                  }`}
                >
                  {section.accepted ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Expanded Content */}
            {isExpanded && (
              <div className="px-4 pb-4 border-t border-border-subtle pt-4 space-y-4">
                {/* Side by side comparison */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-semibold text-text-muted mb-2 uppercase tracking-wider">Original</p>
                    <div className="bg-surface-50 rounded-lg p-3 text-xs text-text-secondary leading-relaxed whitespace-pre-wrap max-h-60 overflow-y-auto">
                      {section.originalContent}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-success-400 mb-2 uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      Enhanced
                    </p>
                    {isEditing ? (
                      <div>
                        <textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          rows={8}
                          className="w-full p-3 text-xs resize-none"
                        />
                        <div className="flex gap-2 mt-2">
                          <Button size="sm" onClick={() => saveEdit(section.id)}>Save</Button>
                          <Button size="sm" variant="ghost" onClick={() => setEditingSectionId(null)}>Cancel</Button>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-success-500/5 border border-success-500/10 rounded-lg p-3 text-xs text-text-primary leading-relaxed whitespace-pre-wrap max-h-60 overflow-y-auto">
                        {section.enhancedContent}
                      </div>
                    )}
                  </div>
                </div>

                {/* Individual Changes */}
                {section.changes.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-text-muted mb-2 uppercase tracking-wider">Changes</p>
                    <div className="space-y-2">
                      {section.changes.map((change) => (
                        <div
                          key={change.id}
                          className={`flex items-start gap-3 rounded-lg border p-3 transition-all ${
                            change.accepted
                              ? 'border-success-500/15 bg-success-500/5'
                              : 'border-border-subtle bg-surface-50'
                          }`}
                        >
                          <button
                            onClick={() => toggleChangeAcceptance(section.id, change.id)}
                            className={`mt-0.5 p-1 rounded transition-colors flex-shrink-0 ${
                              change.accepted
                                ? 'bg-success-500/20 text-success-400'
                                : 'bg-surface-200 text-text-muted hover:text-text-primary'
                            }`}
                          >
                            {change.accepted ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                          </button>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant={changeTypeColors[change.type] === 'chip-green' ? 'green' : changeTypeColors[change.type] === 'chip-amber' ? 'amber' : changeTypeColors[change.type] === 'chip-blue' ? 'blue' : 'purple'}>
                                {change.type}
                              </Badge>
                            </div>
                            <p className="text-xs text-text-secondary">{change.reason}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
