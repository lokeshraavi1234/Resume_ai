'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import {
  Code2,
  Briefcase,
  GraduationCap,
  FolderKanban,
  LayoutTemplate,
  ScanSearch,
} from 'lucide-react';
import { CategoryScore } from '@/types/resume';

interface CategoryScoresProps {
  scores: CategoryScore[];
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Code2,
  Briefcase,
  GraduationCap,
  FolderKanban,
  LayoutTemplate,
  ScanSearch,
};

function getScoreColor(score: number) {
  if (score >= 80) return { path: '#22c55e', trail: 'rgba(34, 197, 94, 0.08)' };
  if (score >= 60) return { path: '#6366f1', trail: 'rgba(99, 102, 241, 0.08)' };
  if (score >= 40) return { path: '#f59e0b', trail: 'rgba(245, 158, 11, 0.08)' };
  return { path: '#ef4444', trail: 'rgba(239, 68, 68, 0.08)' };
}

export function CategoryScores({ scores }: CategoryScoresProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {scores.map((cat, index) => {
        const colors = getScoreColor(cat.score);
        const Icon = iconMap[cat.icon] || Code2;

        return (
          <motion.div
            key={cat.category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            className="glass-card p-4 flex flex-col items-center gap-3 text-center"
          >
            <div className="w-14 h-14 relative">
              <CircularProgressbar
                value={cat.score}
                maxValue={100}
                styles={buildStyles({
                  strokeLinecap: 'round',
                  pathTransitionDuration: 1.5,
                  pathColor: colors.path,
                  trailColor: colors.trail,
                  textSize: '0',
                })}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Icon className="w-5 h-5 text-text-secondary" />
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-text-primary">{cat.label}</p>
              <p className="text-lg font-bold text-text-primary mt-0.5">{cat.score}</p>
            </div>
            <p className="text-[10px] text-text-muted leading-tight">{cat.insight}</p>
          </motion.div>
        );
      })}
    </div>
  );
}
