'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';

interface ScoreCardProps {
  score: number;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

function getScoreColor(score: number) {
  if (score >= 80) return { path: '#22c55e', trail: 'rgba(34, 197, 94, 0.1)', text: 'text-success-400', label: 'Excellent' };
  if (score >= 60) return { path: '#6366f1', trail: 'rgba(99, 102, 241, 0.1)', text: 'text-primary-400', label: 'Good' };
  if (score >= 40) return { path: '#f59e0b', trail: 'rgba(245, 158, 11, 0.1)', text: 'text-warning-400', label: 'Average' };
  return { path: '#ef4444', trail: 'rgba(239, 68, 68, 0.1)', text: 'text-danger-400', label: 'Needs Work' };
}

export function ScoreCard({ score, label = 'Overall Score', size = 'lg' }: ScoreCardProps) {
  const colors = getScoreColor(score);
  const sizeMap = { sm: 80, md: 120, lg: 180 };
  const dimension = sizeMap[size];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="flex flex-col items-center gap-4"
    >
      <div style={{ width: dimension, height: dimension }} className="relative">
        <CircularProgressbar
          value={score}
          maxValue={100}
          styles={buildStyles({
            rotation: 0,
            strokeLinecap: 'round',
            pathTransitionDuration: 1.5,
            pathColor: colors.path,
            trailColor: colors.trail,
            textSize: '0px',
          })}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <AnimatedCounter
            value={score}
            duration={1500}
            className={`text-3xl font-bold ${size === 'sm' ? 'text-lg' : size === 'md' ? 'text-2xl' : 'text-4xl'} ${colors.text}`}
          />
          <span className="text-xs text-text-muted font-medium mt-0.5">/100</span>
        </div>
      </div>
      <div className="text-center">
        <p className="text-sm font-semibold text-text-primary">{label}</p>
        <p className={`text-xs font-medium mt-1 ${colors.text}`}>{colors.label}</p>
      </div>
    </motion.div>
  );
}
