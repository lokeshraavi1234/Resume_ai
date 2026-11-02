'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, ChevronDown, Plus, Trash2 } from 'lucide-react';

interface JobDescriptionInputProps {
  jobDescription: string;
  onJobDescriptionChange: (value: string) => void;
  previousJDs: string[];
  onPreviousJDsChange: (jds: string[]) => void;
}

export function JobDescriptionInput({
  jobDescription,
  onJobDescriptionChange,
  previousJDs,
  onPreviousJDsChange,
}: JobDescriptionInputProps) {
  const [showPreviousJDs, setShowPreviousJDs] = useState(false);

  const addPreviousJD = () => {
    onPreviousJDsChange([...previousJDs, '']);
  };

  const updatePreviousJD = (index: number, value: string) => {
    const updated = [...previousJDs];
    updated[index] = value;
    onPreviousJDsChange(updated);
  };

  const removePreviousJD = (index: number) => {
    onPreviousJDsChange(previousJDs.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      {/* Target Job Description */}
      <div>
        <label className="flex items-center gap-2 text-sm font-semibold text-text-primary mb-3">
          <FileText className="w-4 h-4 text-primary-400" />
          Target Job Description
          <span className="text-danger-400">*</span>
        </label>
        <textarea
          value={jobDescription}
          onChange={(e) => onJobDescriptionChange(e.target.value)}
          placeholder="Paste the target job description here..."
          rows={8}
          className="w-full p-4 text-sm resize-none"
        />
        <div className="flex justify-between mt-2">
          <p className="text-xs text-text-muted">
            Paste the complete job posting for best results
          </p>
          <p className="text-xs text-text-muted">
            {jobDescription.length} characters
          </p>
        </div>
      </div>

      {/* Previous Job Descriptions */}
      <div>
        <button
          onClick={() => setShowPreviousJDs(!showPreviousJDs)}
          className="flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
        >
          <motion.div animate={{ rotate: showPreviousJDs ? 180 : 0 }}>
            <ChevronDown className="w-4 h-4" />
          </motion.div>
          Previous Job Descriptions (Optional)
        </button>

        <AnimatePresence>
          {showPreviousJDs && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-4 space-y-4">
                <p className="text-xs text-text-muted">
                  Add previous job descriptions to help AI understand your career context and progression.
                </p>
                {previousJDs.map((jd, index) => (
                  <div key={index} className="relative">
                    <label className="text-xs font-medium text-text-muted mb-1.5 block">
                      Previous Job #{index + 1}
                    </label>
                    <div className="relative">
                      <textarea
                        value={jd}
                        onChange={(e) => updatePreviousJD(index, e.target.value)}
                        placeholder="Paste a previous job description..."
                        rows={4}
                        className="w-full p-3 pr-10 text-sm resize-none"
                      />
                      <button
                        onClick={() => removePreviousJD(index)}
                        className="absolute top-3 right-3 p-1 rounded hover:bg-danger-500/15 text-text-muted hover:text-danger-400 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  onClick={addPreviousJD}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-dashed border-border-default hover:border-primary-500/30 hover:bg-surface-50 transition-all text-sm text-text-secondary"
                >
                  <Plus className="w-4 h-4" />
                  Add Previous Job Description
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
