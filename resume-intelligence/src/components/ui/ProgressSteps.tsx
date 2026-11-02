'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface ProgressStepsProps {
  steps: string[];
  currentStep: number;
  className?: string;
}

export function ProgressSteps({ steps, currentStep, className = '' }: ProgressStepsProps) {
  return (
    <div className={`flex items-center justify-center gap-0 w-full max-w-2xl mx-auto ${className}`}>
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isActive = index === currentStep;
        const isLast = index === steps.length - 1;

        return (
          <React.Fragment key={step}>
            <div className="flex flex-col items-center gap-2">
              <motion.div
                initial={false}
                animate={{
                  scale: isActive ? 1.1 : 1,
                  backgroundColor: isCompleted
                    ? 'rgba(99, 102, 241, 1)'
                    : isActive
                    ? 'rgba(99, 102, 241, 0.2)'
                    : 'rgba(255, 255, 255, 0.05)',
                }}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-colors ${
                  isCompleted
                    ? 'border-primary-500 text-white'
                    : isActive
                    ? 'border-primary-500 text-primary-400'
                    : 'border-border-subtle text-text-muted'
                }`}
              >
                {isCompleted ? <Check className="w-5 h-5" /> : index + 1}
              </motion.div>
              <span
                className={`text-xs font-medium whitespace-nowrap ${
                  isActive ? 'text-primary-400' : isCompleted ? 'text-text-secondary' : 'text-text-muted'
                }`}
              >
                {step}
              </span>
            </div>
            {!isLast && (
              <div className="flex-1 mx-2 mb-6">
                <div className="h-0.5 w-full bg-surface-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={false}
                    animate={{ width: isCompleted ? '100%' : '0%' }}
                    transition={{ duration: 0.5 }}
                    className="h-full gradient-bg-primary rounded-full"
                  />
                </div>
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
