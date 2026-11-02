'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Loader2, RotateCcw, FileSearch } from 'lucide-react';
import Link from 'next/link';
import { useResumeAnalysis } from '@/hooks/useResumeAnalysis';
import { ProgressSteps } from '@/components/ui/ProgressSteps';
import { Button } from '@/components/ui/Button';
import { FileUpload } from '@/components/upload/FileUpload';
import { ScoreCard } from '@/components/analysis/ScoreCard';
import { CategoryScores } from '@/components/analysis/CategoryScores';
import { StrengthsWeaknesses } from '@/components/analysis/StrengthsWeaknesses';
import { AISuggestions } from '@/components/analysis/AISuggestions';
import { ResumeDetails } from '@/components/analysis/ResumeDetails';
import { AuthGuard } from '@/components/auth/AuthGuard';

const stepLabels = ['Upload Resume', 'AI Processing', 'Analysis Results'];
const stepMap = { upload: 0, processing: 1, results: 2 };

export default function AnalyzePage() {
  const {
    step,
    file,
    setFile,
    analysis,
    loading,
    error,
    processingMessage,
    startAnalysis,
    reset,
  } = useResumeAnalysis();

  return (
    <AuthGuard toolName="the Resume Analysis (Type 2)">
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
              📊 Resume Analysis
            </h1>
            <p className="text-sm text-text-secondary mt-1">
              Get your resume scored and analyzed by AI
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

        {/* Step: Upload */}
        <AnimatePresence mode="wait">
          {step === 'upload' && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-2xl mx-auto"
            >
              <div className="glass-card-static p-8">
                <FileUpload
                  file={file}
                  onFileSelect={setFile}
                  onFileRemove={() => setFile(null)}
                />

                <div className="mt-8 flex justify-end">
                  <Button
                    size="lg"
                    disabled={!file}
                    onClick={startAnalysis}
                    icon={<FileSearch className="w-5 h-5" />}
                  >
                    Analyze Resume
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step: Processing */}
          {step === 'processing' && (
            <motion.div
              key="processing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-lg mx-auto text-center py-16"
            >
              <div className="glass-card-static p-12 flex flex-col items-center">
                <div className="relative mb-8">
                  <div className="w-20 h-20 rounded-full gradient-bg-primary opacity-20 animate-ping absolute inset-0" />
                  <div className="w-20 h-20 rounded-full gradient-bg-primary flex items-center justify-center relative">
                    <Loader2 className="w-10 h-10 text-white animate-spin" />
                  </div>
                </div>
                <h2
                  className="text-xl font-bold text-text-primary mb-3"
                  style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif" }}
                >
                  Analyzing Your Resume
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
                    className="h-full gradient-bg-primary rounded-full"
                    initial={{ width: '0%' }}
                    animate={{ width: '90%' }}
                    transition={{ duration: 4, ease: 'easeOut' }}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Step: Results */}
          {step === 'results' && analysis && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Top Row: Score + Categories */}
              <div className="glass-card-static p-8">
                <div className="flex flex-col lg:flex-row items-center gap-10">
                  <ScoreCard score={analysis.overallScore} />
                  <div className="flex-1 w-full">
                    <h3
                      className="text-lg font-bold text-text-primary mb-4"
                      style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif" }}
                    >
                      Category Breakdown
                    </h3>
                    <CategoryScores scores={analysis.categoryScores} />
                  </div>
                </div>
              </div>

              {/* Strengths & Weaknesses */}
              <div className="glass-card-static p-8">
                <StrengthsWeaknesses
                  strengths={analysis.strengths}
                  weaknesses={analysis.weaknesses}
                />
              </div>

              {/* AI Suggestions */}
              <div className="glass-card-static p-8">
                <AISuggestions suggestions={analysis.suggestions} />
              </div>

              {/* Resume Details */}
              <div>
                <h3
                  className="text-lg font-bold text-text-primary mb-4"
                  style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif" }}
                >
                  Extracted Resume Data
                </h3>
                <ResumeDetails
                  skills={analysis.skills}
                  education={analysis.education}
                  experience={analysis.experience}
                  projects={analysis.projects}
                  certifications={analysis.certifications}
                />
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-4 justify-center pt-4">
                <Button variant="secondary" onClick={reset} icon={<RotateCcw className="w-4 h-4" />}>
                  Analyze Another Resume
                </Button>
                <Link href="/job-match">
                  <Button>
                    Match to a Job Description →
                  </Button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
    </AuthGuard>
  );
}
