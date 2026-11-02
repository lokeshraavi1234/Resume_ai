'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertTriangle, ArrowUp, ArrowRight, ArrowDown } from 'lucide-react';
import { StrengthWeakness } from '@/types/resume';

interface StrengthsWeaknessesProps {
  strengths: StrengthWeakness[];
  weaknesses: StrengthWeakness[];
}

function ImpactBadge({ impact }: { impact: string }) {
  const styles = {
    high: 'bg-danger-500/15 text-danger-400 border-danger-500/20',
    medium: 'bg-warning-500/15 text-warning-400 border-warning-500/20',
    low: 'bg-primary-500/15 text-primary-400 border-primary-500/20',
  };
  const icons = {
    high: <ArrowUp className="w-3 h-3" />,
    medium: <ArrowRight className="w-3 h-3" />,
    low: <ArrowDown className="w-3 h-3" />,
  };

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${styles[impact as keyof typeof styles] || styles.low}`}>
      {icons[impact as keyof typeof icons]}
      {impact}
    </span>
  );
}

export function StrengthsWeaknesses({ strengths, weaknesses }: StrengthsWeaknessesProps) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Strengths */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle2 className="w-5 h-5 text-success-400" />
          <h3 className="text-lg font-semibold text-text-primary" style={{ fontFamily: 'var(--font-heading)' }}>
            Strengths
          </h3>
        </div>
        <div className="space-y-3">
          {strengths.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card-static p-4 border-l-2 border-success-400"
            >
              <div className="flex items-start justify-between gap-2 mb-1">
                <p className="text-sm font-semibold text-text-primary">{item.title}</p>
                <ImpactBadge impact={item.impact} />
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Weaknesses */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-5 h-5 text-warning-400" />
          <h3 className="text-lg font-semibold text-text-primary" style={{ fontFamily: 'var(--font-heading)' }}>
            Areas for Improvement
          </h3>
        </div>
        <div className="space-y-3">
          {weaknesses.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card-static p-4 border-l-2 border-warning-400"
            >
              <div className="flex items-start justify-between gap-2 mb-1">
                <p className="text-sm font-semibold text-text-primary">{item.title}</p>
                <ImpactBadge impact={item.impact} />
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
