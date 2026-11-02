'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  Target,
  ArrowRight,
} from 'lucide-react';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { Badge } from '@/components/ui/Badge';
import { JobMatchResult } from '@/types/resume';

interface MatchResultsProps {
  result: JobMatchResult;
}

export function MatchResults({ result }: MatchResultsProps) {
  const scoreColor = result.matchScore >= 70 ? '#22c55e' : result.matchScore >= 50 ? '#f59e0b' : '#ef4444';
  const scoreTrail = result.matchScore >= 70 ? 'rgba(34,197,94,0.1)' : result.matchScore >= 50 ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)';

  return (
    <div className="space-y-8">
      {/* Match Score */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card-static p-8 flex flex-col items-center"
      >
        <div className="w-40 h-40 relative mb-4">
          <CircularProgressbar
            value={result.matchScore}
            maxValue={100}
            styles={buildStyles({
              strokeLinecap: 'round',
              pathTransitionDuration: 1.5,
              pathColor: scoreColor,
              trailColor: scoreTrail,
              textSize: '0',
            })}
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <AnimatedCounter
              value={result.matchScore}
              className="text-4xl font-bold text-text-primary"
              suffix="%"
            />
          </div>
        </div>
        <h3 className="text-lg font-bold text-text-primary" style={{ fontFamily: 'var(--font-heading)' }}>
          Job Match Score
        </h3>
        <p className="text-sm text-text-secondary mt-1">
          {result.matchScore >= 70
            ? 'Strong match! Your resume aligns well.'
            : result.matchScore >= 50
            ? 'Moderate match. Enhancement recommended.'
            : 'Low match. Significant improvements needed.'}
        </p>
      </motion.div>

      {/* Skills Analysis */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* Matching Skills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card-static p-5"
        >
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 className="w-5 h-5 text-success-400" />
            <h4 className="text-sm font-semibold text-text-primary">Matching Skills</h4>
            <span className="chip chip-green text-[10px] py-0 ml-auto">{result.matchingSkills.length}</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {result.matchingSkills.map((skill, i) => (
              <Badge key={i} variant="green">{skill.skill}</Badge>
            ))}
          </div>
        </motion.div>

        {/* Missing Skills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card-static p-5"
        >
          <div className="flex items-center gap-2 mb-3">
            <XCircle className="w-5 h-5 text-danger-400" />
            <h4 className="text-sm font-semibold text-text-primary">Missing Skills</h4>
            <span className="chip chip-red text-[10px] py-0 ml-auto">{result.missingSkills.length}</span>
          </div>
          <div className="space-y-2">
            {result.missingSkills.map((skill, i) => (
              <div key={i}>
                <Badge variant="red">{skill.skill}</Badge>
                {skill.suggestion && (
                  <p className="text-[10px] text-text-muted mt-1 ml-1">{skill.suggestion}</p>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Partial Skills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card-static p-5"
        >
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="w-5 h-5 text-warning-400" />
            <h4 className="text-sm font-semibold text-text-primary">Related Skills</h4>
            <span className="chip chip-amber text-[10px] py-0 ml-auto">{result.partialSkills.length}</span>
          </div>
          <div className="space-y-2">
            {result.partialSkills.map((skill, i) => (
              <div key={i}>
                <Badge variant="amber">{skill.skill}</Badge>
                {skill.suggestion && (
                  <p className="text-[10px] text-text-muted mt-1 ml-1">{skill.suggestion}</p>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Requirements Comparison */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card-static p-5"
      >
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-5 h-5 text-primary-400" />
          <h4 className="text-sm font-semibold text-text-primary">Requirements vs Resume</h4>
        </div>
        <div className="space-y-3">
          {result.requirementsComparison.map((req, i) => {
            const statusColors = {
              met: { bg: 'bg-success-500/10', border: 'border-success-500/20', icon: <CheckCircle2 className="w-4 h-4 text-success-400" />, label: 'Met' },
              'partially-met': { bg: 'bg-warning-500/10', border: 'border-warning-500/20', icon: <AlertCircle className="w-4 h-4 text-warning-400" />, label: 'Partial' },
              'not-met': { bg: 'bg-danger-500/10', border: 'border-danger-500/20', icon: <XCircle className="w-4 h-4 text-danger-400" />, label: 'Gap' },
            };
            const status = statusColors[req.status];

            return (
              <div key={i} className={`rounded-lg border p-3 ${status.bg} ${status.border}`}>
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex-shrink-0">{status.icon}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-text-primary">{req.requirement}</p>
                    <div className="flex items-center gap-2 mt-1.5 text-[11px] text-text-secondary">
                      <ArrowRight className="w-3 h-3 flex-shrink-0 text-text-muted" />
                      <span>{req.resumeEvidence}</span>
                    </div>
                    {req.gap && (
                      <p className="text-[10px] text-warning-400 mt-1">💡 {req.gap}</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Improvement Suggestions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-card-static p-5"
      >
        <h4 className="text-sm font-semibold text-text-primary mb-4">Specific Improvement Suggestions</h4>
        <div className="space-y-3">
          {result.improvementSuggestions.map((sug, i) => (
            <div key={i} className="rounded-lg border border-primary-500/20 bg-primary-500/5 p-3">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-semibold text-text-primary">{sug.area}</span>
                <Badge variant={sug.priority === 'high' ? 'red' : sug.priority === 'medium' ? 'amber' : 'blue'}>
                  {sug.priority}
                </Badge>
              </div>
              <p className="text-xs text-text-muted mb-1">Current: {sug.currentState}</p>
              <p className="text-xs text-text-secondary">Suggested: {sug.suggestedImprovement}</p>
              <p className="text-[10px] text-primary-400 mt-1.5">Impact: {sug.impact}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
