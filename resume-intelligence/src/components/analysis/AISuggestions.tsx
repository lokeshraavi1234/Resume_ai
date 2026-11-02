'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, AlertCircle, Info } from 'lucide-react';
import { AISuggestion } from '@/types/resume';

interface AISuggestionsProps {
  suggestions: AISuggestion[];
}

export function AISuggestions({ suggestions }: AISuggestionsProps) {
  const priorityIcons = {
    high: <AlertCircle className="w-4 h-4 text-danger-400" />,
    medium: <Lightbulb className="w-4 h-4 text-warning-400" />,
    low: <Info className="w-4 h-4 text-primary-400" />,
  };

  const priorityStyles = {
    high: 'border-danger-500/30 bg-danger-500/5',
    medium: 'border-warning-500/30 bg-warning-500/5',
    low: 'border-primary-500/30 bg-primary-500/5',
  };

  const priorityLabels = {
    high: 'chip-red',
    medium: 'chip-amber',
    low: 'chip-blue',
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="w-5 h-5 text-accent-400" />
        <h3 className="text-lg font-semibold text-text-primary" style={{ fontFamily: 'var(--font-heading)' }}>
          AI Suggestions
        </h3>
      </div>
      <div className="space-y-3">
        {suggestions.map((suggestion, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            className={`rounded-xl border p-4 ${priorityStyles[suggestion.priority]}`}
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex-shrink-0">
                {priorityIcons[suggestion.priority]}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <p className="text-sm font-semibold text-text-primary">{suggestion.title}</p>
                  <span className={`chip text-[10px] py-0 ${priorityLabels[suggestion.priority]}`}>
                    {suggestion.priority} priority
                  </span>
                  <span className="chip chip-purple text-[10px] py-0">
                    {suggestion.category}
                  </span>
                </div>
                <p className="text-xs text-text-secondary leading-relaxed">{suggestion.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
