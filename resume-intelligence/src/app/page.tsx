'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Brain,
  BarChart3,
  Target,
  Sparkles,
  Shield,
  Zap,
  ArrowRight,
  FileSearch,
  FileCheck2,
  Download,
  ChevronRight,
  Layout,
  Briefcase,
  Layers,
  Wand2,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { StartingDesktopAuth } from '@/components/auth/StartingDesktopAuth';

const features = [
  { icon: BarChart3, title: 'Resume Scoring', description: 'Get a comprehensive score out of 100 across 6 key categories', color: 'text-primary-400', bg: 'bg-primary-500/10' },
  { icon: Target, title: 'Job Matching', description: 'See how well your resume matches a specific job description', color: 'text-accent-400', bg: 'bg-accent-500/10' },
  { icon: Sparkles, title: 'AI Enhancement', description: 'Automatically improve your resume for your target role', color: 'text-warning-400', bg: 'bg-warning-500/10' },
  { icon: Shield, title: 'ATS Optimized', description: 'Ensure your resume passes Applicant Tracking Systems', color: 'text-success-400', bg: 'bg-success-500/10' },
  { icon: Zap, title: 'Instant Analysis', description: 'Get detailed insights in seconds, not hours', color: 'text-danger-400', bg: 'bg-danger-500/10' },
  { icon: FileCheck2, title: 'Smart Editing', description: 'Accept, reject, or edit each AI suggestion individually', color: 'text-primary-300', bg: 'bg-primary-300/10' },
];

const stats = [
  { value: '6', label: 'Analysis Categories' },
  { value: '100+', label: 'Skills Detected' },
  { value: 'ATS', label: 'Compatibility Check' },
  { value: 'PDF/DOCX', label: 'Export Formats' },
];

export default function HomePage() {
  const { isAuthenticated, user, isLoading } = useAuth();

  // If still checking localStorage, show subtle loading state
  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-2xl gradient-bg-primary flex items-center justify-center animate-pulse">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <span className="text-xs text-text-secondary">Loading ResumeAI...</span>
        </div>
      </div>
    );
  }

  // If NOT authenticated, show ONLY the starting desktop Login and Creating Portal!
  if (!isAuthenticated) {
    return <StartingDesktopAuth />;
  }

  // AFTER logging in or creating account: Reveal all 3 Types and the complete Dashboard!
  return (
    <div className="relative">
      {/* =============================================== */}
      {/* Authenticated Dashboard Hero */}
      {/* =============================================== */}
      <section className="relative px-4 sm:px-6 lg:px-8 pt-10 pb-16">
        <div className="max-w-6xl mx-auto">
          {/* Welcome User Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-10 text-center sm:text-left flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl glass-card border border-white/10"
          >
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-success-500/15 border border-success-500/30 text-success-300 text-xs font-semibold mb-3">
                <span className="w-2 h-2 rounded-full bg-success-400 animate-ping" />
                Account Active
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                Welcome, <span className="gradient-text">{user?.name}</span>!
              </h1>
              <p className="text-sm text-text-secondary mt-1">
                {user?.role ? `Target Role: ${user.role} • ` : ''}Select one of the 3 resume tool types below to begin.
              </p>
            </div>

            <div className="flex items-center gap-3 self-center sm:self-auto">
              <Link
                href="/create"
                className="px-5 py-2.5 rounded-xl gradient-bg-primary text-white text-xs font-semibold shadow-lg shadow-primary-500/20 hover:scale-[1.02] transition-all flex items-center gap-2"
              >
                <FileCheck2 className="w-4 h-4" />
                <span>Quick Builder</span>
              </Link>
            </div>
          </motion.div>

          {/* =============================================== */}
          {/* The 3 Core Resume Tool Types */}
          {/* =============================================== */}
          <div className="mb-14">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
                  <Layers className="w-5 h-5 text-primary-400" />
                  <span>Resume Tool Types</span>
                </h2>
                <p className="text-xs sm:text-sm text-text-secondary mt-0.5">
                  Choose the tool type that fits your current career goal:
                </p>
              </div>
              <span className="text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-primary-300 hidden sm:inline-block">
                3 Tool Types Available
              </span>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* TYPE 1: Create Resume */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="h-full"
              >
                <div className="glass-card p-7 h-full flex flex-col justify-between relative overflow-hidden border border-primary-500/30 hover:border-primary-500/60 transition-all group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500" />
                  
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-2xl gradient-bg-primary flex items-center justify-center shadow-lg shadow-primary-500/25 group-hover:scale-110 transition-transform">
                        <FileCheck2 className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-primary-500/20 border border-primary-500/30 text-primary-300">
                        TYPE 01
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                      <span>✨ Create Resume</span>
                    </h3>
                    <p className="text-xs text-text-secondary mb-4 leading-relaxed">
                      Build a professional ATS-ready resume from scratch. Generate AI bullet points, switch between Modern, Two-Column, Executive, and Minimal styles, and preview in real-time.
                    </p>

                    <div className="space-y-1.5 mb-6 text-[11px] text-text-secondary">
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary-400" />
                        <span>5+ Curated ATS Templates</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary-400" />
                        <span>AI Action Verb Generator</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary-400" />
                        <span>Instant PDF & DOCX Export</span>
                      </div>
                    </div>
                  </div>

                  <Link
                    href="/create"
                    className="w-full py-3 rounded-xl gradient-bg-primary text-white text-xs font-semibold flex items-center justify-center gap-2 group-hover:shadow-lg group-hover:shadow-primary-500/30 transition-all"
                  >
                    <span>Launch Type 1: Builder</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>

              {/* TYPE 2: Resume Analysis */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="h-full"
              >
                <div className="glass-card p-7 h-full flex flex-col justify-between relative overflow-hidden border border-accent-500/30 hover:border-accent-500/60 transition-all group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-accent-500/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500" />

                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-accent-500/20 border border-accent-500/30 flex items-center justify-center shadow-lg shadow-accent-500/25 group-hover:scale-110 transition-transform">
                        <FileSearch className="w-6 h-6 text-accent-400" />
                      </div>
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-accent-500/20 border border-accent-500/30 text-accent-300">
                        TYPE 02
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                      <span>📊 Resume Analysis</span>
                    </h3>
                    <p className="text-xs text-text-secondary mb-4 leading-relaxed">
                      Upload your existing PDF or DOCX resume to get a comprehensive diagnosis. Receive an overall score out of 100 evaluated across 6 categories with specific improvement tips.
                    </p>

                    <div className="space-y-1.5 mb-6 text-[11px] text-text-secondary">
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-accent-400" />
                        <span>ATS Parsing Verification</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-accent-400" />
                        <span>Weak Bullet Point Detection</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-accent-400" />
                        <span>Quantified Impact Scoring</span>
                      </div>
                    </div>
                  </div>

                  <Link
                    href="/analyze"
                    className="w-full py-3 rounded-xl bg-accent-500/20 hover:bg-accent-500/30 border border-accent-500/40 text-accent-300 text-xs font-semibold flex items-center justify-center gap-2 transition-all"
                  >
                    <span>Launch Type 2: Analysis</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>

              {/* TYPE 3: Job Match & Enhance */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="h-full"
              >
                <div className="glass-card p-7 h-full flex flex-col justify-between relative overflow-hidden border border-warning-500/30 hover:border-warning-500/60 transition-all group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-warning-500/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500" />

                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-warning-500/20 border border-warning-500/30 flex items-center justify-center shadow-lg shadow-warning-500/25 group-hover:scale-110 transition-transform">
                        <Target className="w-6 h-6 text-warning-400" />
                      </div>
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-warning-500/20 border border-warning-500/30 text-warning-300">
                        TYPE 03
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                      <span>🎯 Job Match & Enhance</span>
                    </h3>
                    <p className="text-xs text-text-secondary mb-4 leading-relaxed">
                      Paste a job description alongside your resume to analyze exact role fit. Uncover missing keywords, benchmark against requirements, and tailor each section for interviews.
                    </p>

                    <div className="space-y-1.5 mb-6 text-[11px] text-text-secondary">
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-warning-400" />
                        <span>Keyword & Skill Match %</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-warning-400" />
                        <span>Missing Skill Identification</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-warning-400" />
                        <span>Tailored Summary Suggestions</span>
                      </div>
                    </div>
                  </div>

                  <Link
                    href="/job-match"
                    className="w-full py-3 rounded-xl bg-warning-500/20 hover:bg-warning-500/30 border border-warning-500/40 text-warning-300 text-xs font-semibold flex items-center justify-center gap-2 transition-all"
                  >
                    <span>Launch Type 3: Job Match</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Stats Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 rounded-2xl glass-card border border-white/10 mb-16 text-center"
          >
            {stats.map(s => (
              <div key={s.label}>
                <div className="text-2xl sm:text-3xl font-bold gradient-text">{s.value}</div>
                <div className="text-xs text-text-secondary mt-1">{s.label}</div>
              </div>
            ))}
          </motion.div>

          {/* Features Grid */}
          <div className="mb-16">
            <h2 className="text-xl sm:text-2xl font-bold text-white text-center mb-8">
              Why ResumeAI Intelligence Works
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {features.map(feat => {
                const Icon = feat.icon;
                return (
                  <div
                    key={feat.title}
                    className="glass-card p-6 rounded-2xl border border-white/10 hover:border-white/20 transition-all"
                  >
                    <div className={`w-10 h-10 rounded-xl ${feat.bg} flex items-center justify-center mb-4`}>
                      <Icon className={`w-5 h-5 ${feat.color}`} />
                    </div>
                    <h3 className="text-sm font-bold text-white mb-1.5">{feat.title}</h3>
                    <p className="text-xs text-text-secondary leading-relaxed">{feat.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 4-Step Process */}
          <div className="glass-card p-8 sm:p-12 rounded-3xl border border-white/10 text-center">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">How It Works</h2>
            <p className="text-xs text-text-secondary mb-10 max-w-lg mx-auto">
              Follow this simple 4-step workflow to produce your highest-scoring resume:
            </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { step: '01', title: 'Pick a Type', desc: 'Choose between Builder, Analysis, or Job Matching', icon: Layout },
                { step: '02', title: 'Add Content', desc: 'Input your experience or upload existing resume', icon: FileSearch },
                { step: '03', title: 'AI Enhance', desc: 'Apply real-time AI bullet fixes and keyword optimizations', icon: Wand2 },
                { step: '04', title: 'Export', desc: 'Download clean ATS-friendly PDF or DOCX file', icon: Download },
              ].map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={item.step} className="relative text-center p-4">
                    <div className="w-12 h-12 rounded-2xl gradient-bg-primary mx-auto mb-3 flex items-center justify-center shadow-lg shadow-primary-500/20">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-[10px] font-bold text-primary-400 block mb-1">STEP {item.step}</span>
                    <h4 className="text-sm font-bold text-white mb-1">{item.title}</h4>
                    <p className="text-xs text-text-secondary leading-relaxed">{item.desc}</p>
                    {index < 3 && (
                      <ChevronRight className="hidden lg:block absolute top-8 -right-3 w-5 h-5 text-white/20" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
