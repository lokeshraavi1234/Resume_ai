'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Loader2, RotateCcw, Sparkles, Target } from 'lucide-react';
import Link from 'next/link';
import { useJobMatch } from '@/hooks/useJobMatch';
import { ProgressSteps } from '@/components/ui/ProgressSteps';
import { Button } from '@/components/ui/Button';
import { FileUpload } from '@/components/upload/FileUpload';
import { JobDescriptionInput } from '@/components/job-match/JobDescriptionInput';
import { MatchResults } from '@/components/job-match/MatchResults';
import { ResumeEditor } from '@/components/job-match/ResumeEditor';
import { DownloadOptions } from '@/components/job-match/DownloadOptions';
import { AuthGuard } from '@/components/auth/AuthGuard';

const stepLabels = ['Upload & Job Details', 'AI Matching', 'Match Results', 'Enhancement', 'Edit & Download'];
const stepMap = { input: 0, matching: 1, results: 2, enhancement: 3, editor: 4 };

export default function JobMatchPage() {
  const {
    step,
    file,
    setFile,
    jobDescription,
    setJobDescription,
    previousJDs,
    setPreviousJDs,
    matchResult,
    enhancedResume,
    loading,
    error,
    processingMessage,
    regeneratingSection,
    startMatching,
    startEnhancement,
    regenerateSection,
    updateSections,
    reset,
  } = useJobMatch();

  return (
    <AuthGuard toolName="the Job Matcher (Type 3)">
      <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/"
            className="p-2 rounded-lg hover:bg-surface-100 transition-colors text-text-muted hover:text-text-primary"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1
              className="text-2xl sm:text-3xl font-bold text-text-primary"
              style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif" }}
            >
              🎯 Job Match & Enhancement
            </h1>
            <p className="text-sm text-text-secondary mt-1">
              Optimize your resume for a specific role
            </p>
          </div>
        </div>

        {/* Progress Steps */}
        <ProgressSteps
          steps={stepLabels}
          currentStep={stepMap[step]}
          className="mb-12"
        />

        {/* Error Alert */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 rounded-xl bg-danger-500/10 border border-danger-500/20 text-danger-400 text-sm"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {/* =============================== */}
          {/* Step: Input */}
          {/* =============================== */}
          {step === 'input' && (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-3xl mx-auto space-y-6"
            >
              {/* Resume Upload */}
              <div className="glass-card-static p-8">
                <FileUpload
                  file={file}
                  onFileSelect={setFile}
                  onFileRemove={() => setFile(null)}
                  label="Upload Your Current Resume"
                  description="Drag & drop your current resume, or click to browse"
                />
              </div>

              {/* Job Description */}
              <div className="glass-card-static p-8">
                <JobDescriptionInput
                  jobDescription={jobDescription}
                  onJobDescriptionChange={setJobDescription}
                  previousJDs={previousJDs}
                  onPreviousJDsChange={setPreviousJDs}
                />
              </div>

              {/* Submit */}
              <div className="flex justify-end">
                <Button
                  size="lg"
                  disabled={!file || !jobDescription.trim()}
                  onClick={startMatching}
                  icon={<Target className="w-5 h-5" />}
                >
                  Analyze Job Match
                </Button>
              </div>
            </motion.div>
          )}

          {/* =============================== */}
          {/* Step: Matching (Loading) */}
          {/* =============================== */}
          {step === 'matching' && (
            <motion.div
              key="matching"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-lg mx-auto text-center py-16"
            >
              <div className="glass-card-static p-12 flex flex-col items-center">
                <div className="relative mb-8">
                  <div className="w-20 h-20 rounded-full gradient-bg-accent opacity-20 animate-ping absolute inset-0" />
                  <div className="w-20 h-20 rounded-full gradient-bg-accent flex items-center justify-center relative">
                    <Loader2 className="w-10 h-10 text-white animate-spin" />
                  </div>
                </div>
                <h2
                  className="text-xl font-bold text-text-primary mb-3"
                  style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif" }}
                >
                  Matching Your Resume
                </h2>
                <motion.p
                  key={processingMessage}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-text-secondary"
                >
                  {processingMessage}
                </motion.p>
                <div className="mt-6 w-full bg-surface-200 rounded-full h-1.5 overflow-hidden">
                  <motion.div
                    className="h-full gradient-bg-accent rounded-full"
                    initial={{ width: '0%' }}
                    animate={{ width: '90%' }}
                    transition={{ duration: 5, ease: 'easeOut' }}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* =============================== */}
          {/* Step: Results */}
          {/* =============================== */}
          {step === 'results' && matchResult && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <MatchResults result={matchResult} />

              {/* Enhance CTA */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
                className="flex flex-col items-center py-6"
              >
                <button
                  onClick={startEnhancement}
                  className="group relative inline-flex items-center gap-3 px-10 py-5 rounded-2xl gradient-bg-primary text-white font-bold text-lg hover:shadow-2xl hover:shadow-primary-500/30 hover:scale-[1.03] transition-all duration-300"
                  style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif" }}
                >
                  <Sparkles className="w-6 h-6 group-hover:animate-pulse" />
                  Enhance My Resume for This Job
                  <div className="absolute inset-0 rounded-2xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
                <p className="text-xs text-text-muted mt-3">
                  AI will improve your resume while keeping all information factual
                </p>
              </motion.div>

              {/* Secondary Actions */}
              <div className="flex justify-center gap-4">
                <Button variant="secondary" onClick={reset} icon={<RotateCcw className="w-4 h-4" />}>
                  Start Over
                </Button>
              </div>
            </motion.div>
          )}

          {/* =============================== */}
          {/* Step: Enhancement (Loading) */}
          {/* =============================== */}
          {step === 'enhancement' && (
            <motion.div
              key="enhancement"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-lg mx-auto text-center py-16"
            >
              <div className="glass-card-static p-12 flex flex-col items-center">
                <div className="relative mb-8">
                  <div className="w-20 h-20 rounded-full bg-warning-500/20 animate-ping absolute inset-0 rounded-full" />
                  <div className="w-20 h-20 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 flex items-center justify-center relative">
                    <Sparkles className="w-10 h-10 text-white animate-pulse" />
                  </div>
                </div>
                <h2
                  className="text-xl font-bold text-text-primary mb-3"
                  style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif" }}
                >
                  Enhancing Your Resume
                </h2>
                <motion.p
                  key={processingMessage}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-text-secondary"
                >
                  {processingMessage}
                </motion.p>
                <div className="mt-6 w-full bg-surface-200 rounded-full h-1.5 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"
                    initial={{ width: '0%' }}
                    animate={{ width: '90%' }}
                    transition={{ duration: 6, ease: 'easeOut' }}
                  />
                </div>
                <p className="text-[10px] text-text-muted mt-4">
                  ⚠️ AI only improves existing information — never invents new content
                </p>
              </div>
            </motion.div>
          )}

          {/* =============================== */}
          {/* Step: Editor */}
          {/* =============================== */}
          {step === 'editor' && enhancedResume && (
            <motion.div
              key="editor"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Enhancement Summary */}
              <div className="glass-card-static p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Sparkles className="w-5 h-5 text-accent-400" />
                  <h3
                    className="text-lg font-bold text-text-primary"
                    style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif" }}
                  >
                    Enhancement Complete!
                  </h3>
                </div>
                <p className="text-sm text-text-secondary">{enhancedResume.summary}</p>
              </div>

              {/* Resume Editor */}
              <ResumeEditor
                sections={enhancedResume.sections}
                onSectionsChange={updateSections}
                onRegenerateSection={regenerateSection}
                regeneratingSection={regeneratingSection}
              />

              {/* Download */}
              <DownloadOptions
                sections={enhancedResume.sections}
                fileName={file?.name || 'Resume'}
              />

              {/* Actions */}
              <div className="flex justify-center gap-4 pt-4">
                <Button variant="secondary" onClick={reset} icon={<RotateCcw className="w-4 h-4" />}>
                  Start Over
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
    </AuthGuard>
  );
}
