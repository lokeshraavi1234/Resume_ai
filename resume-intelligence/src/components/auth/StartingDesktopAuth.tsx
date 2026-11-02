'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Brain,
  Mail,
  Lock,
  User,
  Briefcase,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  ShieldCheck,
  CheckCircle2,
  LockKeyhole,
  FileCheck2,
  BarChart3,
  Target,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { AuthMode } from '@/types/auth';
import { validateEmail, validatePassword } from '@/lib/auth-validation';

const suggestedRoles = [
  'Full Stack Developer',
  'Frontend Engineer',
  'Backend Developer',
  'Data Scientist',
  'Product Manager',
  'DevOps Engineer',
];

export function StartingDesktopAuth() {
  const { login, signup } = useAuth();
  const [activeTab, setActiveTab] = useState<AuthMode>('login');

  // Independent Sign In form state (not saved or shared with Create Account)
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Independent Create Account form state (not saved or shared with Sign In)
  const [signupName, setSignupName] = useState('');
  const [signupRole, setSignupRole] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Clear inputs when switching options to avoid saving or carrying over credentials before submit
  const handleSwitchOption = (newTab: AuthMode) => {
    setError(null);
    setLoginEmail('');
    setLoginPassword('');
    setSignupName('');
    setSignupRole('');
    setSignupEmail('');
    setSignupPassword('');
    setActiveTab(newTab);
  };

  // Live password strength calculation for Create Account
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { score: 0, text: 'Required' };
    let score = 0;
    if (pwd.length >= 8) score += 1;
    if (/[a-zA-Z]/.test(pwd) && /[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd) || pwd.length >= 10) score += 1;

    if (score === 1) return { score: 1, text: 'Weak — Need letters and numbers' };
    if (score === 2) return { score: 2, text: 'Good — Valid password' };
    if (score >= 3) return { score: 3, text: 'Strong & Secure' };
    return { score: 0, text: 'Too short' };
  };

  const strength = getPasswordStrength(signupPassword);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (activeTab === 'login') {
      const emailCheck = validateEmail(loginEmail);
      if (!emailCheck.isValid) {
        setError(emailCheck.error || 'Please enter a valid email address.');
        return;
      }

      if (!loginPassword) {
        setError('Password is required.');
        return;
      }

      setIsSubmitting(true);
      try {
        const res = await login(loginEmail, loginPassword);
        if (!res.success) {
          setError(res.error || 'Failed to sign in. Please verify your credentials.');
        }
      } catch {
        setError('An error occurred during sign in. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // Create Account
      const emailCheck = validateEmail(signupEmail);
      if (!emailCheck.isValid) {
        setError(emailCheck.error || 'Please enter a valid email address.');
        return;
      }

      const pwdCheck = validatePassword(signupPassword);
      if (!pwdCheck.isValid) {
        setError(pwdCheck.error || 'Please choose a stronger password.');
        return;
      }

      setIsSubmitting(true);
      try {
        const res = await signup({
          name: signupName,
          email: signupEmail,
          password: signupPassword,
          role: signupRole,
        });
        if (!res.success) {
          setError(res.error || 'Failed to create account. Please check your details.');
        }
      } catch {
        setError('An error occurred during account creation. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Top Welcome Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl mx-auto text-center mb-8"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 mb-6">
          <Brain className="w-4 h-4 text-primary-400" />
          <span className="text-sm font-medium text-primary-300">
            ResumeAI Intelligence Platform
          </span>
        </div>

        <h1
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-4 leading-[1.15]"
          style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif" }}
        >
          Sign In or <span className="gradient-text">Create Account</span>
        </h1>

        <p className="text-base sm:text-lg text-text-secondary max-w-xl mx-auto">
          Please sign in or register with your real email and secure password to unlock all 3 resume tool types.
        </p>
      </motion.div>

      {/* Main Interactive Auth Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="w-full max-w-lg"
      >
        <div className="glass-card p-6 sm:p-9 relative overflow-hidden border border-white/15 shadow-2xl shadow-primary-500/10 rounded-3xl">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-0 w-44 h-44 bg-primary-500/15 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-44 h-44 bg-accent-500/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl pointer-events-none" />

          {/* Mode Switcher Tabs */}
          <div className="flex p-1.5 bg-white/5 rounded-2xl border border-white/10 mb-7">
            <button
              type="button"
              onClick={() => handleSwitchOption('login')}
              className={`flex-1 py-2.5 text-xs sm:text-sm font-semibold rounded-xl transition-all cursor-pointer ${
                activeTab === 'login'
                  ? 'gradient-bg-primary text-white shadow-lg shadow-primary-500/25'
                  : 'text-text-secondary hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => handleSwitchOption('signup')}
              className={`flex-1 py-2.5 text-xs sm:text-sm font-semibold rounded-xl transition-all cursor-pointer ${
                activeTab === 'signup'
                  ? 'gradient-bg-primary text-white shadow-lg shadow-primary-500/25'
                  : 'text-text-secondary hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Error Banner */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3.5 mb-5 rounded-xl bg-danger-500/15 border border-danger-500/30 flex items-start gap-2.5 text-danger-300 text-xs leading-relaxed"
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </motion.div>
          )}

          {/* Form with autoComplete="off" to avoid saving or pre-filling before submit */}
          <form onSubmit={handleSubmit} autoComplete="off" className="space-y-4">
            {/* SIGN IN VIEW */}
            {activeTab === 'login' && (
              <>
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1.5">
                    Account Email Address <span className="text-primary-400">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-text-secondary absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      autoComplete="off"
                      placeholder="Enter your registered email"
                      value={loginEmail}
                      onChange={e => {
                        setLoginEmail(e.target.value);
                        if (error) setError(null);
                      }}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-text-secondary/50 text-sm focus:outline-none focus:border-primary-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1.5">
                    Password <span className="text-primary-400">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-text-secondary absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showLoginPassword ? 'text' : 'password'}
                      required
                      autoComplete="new-password"
                      placeholder="Enter your password"
                      value={loginPassword}
                      onChange={e => {
                        setLoginPassword(e.target.value);
                        if (error) setError(null);
                      }}
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-text-secondary/50 text-sm focus:outline-none focus:border-primary-500 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-secondary hover:text-white transition-colors cursor-pointer"
                    >
                      {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* CREATE ACCOUNT VIEW */}
            {activeTab === 'signup' && (
              <>
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1.5">
                    Your Full Name <span className="text-primary-400">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-text-secondary absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      autoComplete="off"
                      placeholder="e.g. Lokesh Sharma"
                      value={signupName}
                      onChange={e => {
                        setSignupName(e.target.value);
                        if (error) setError(null);
                      }}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-text-secondary/50 text-sm focus:outline-none focus:border-primary-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1.5">
                    Target Career Role <span className="text-text-secondary/60">(Optional)</span>
                  </label>
                  <div className="relative mb-2">
                    <Briefcase className="w-4 h-4 text-text-secondary absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      autoComplete="off"
                      placeholder="e.g. Full Stack Developer, Product Manager"
                      value={signupRole}
                      onChange={e => setSignupRole(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-text-secondary/50 text-sm focus:outline-none focus:border-primary-500 transition-colors"
                    />
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {suggestedRoles.slice(0, 4).map(r => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setSignupRole(r)}
                        className="text-[11px] px-2 py-0.5 rounded-md bg-white/5 hover:bg-white/10 border border-white/10 text-text-secondary hover:text-white transition-colors"
                      >
                        + {r}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1.5">
                    Real Email Address <span className="text-primary-400">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-text-secondary absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      autoComplete="off"
                      placeholder="name@gmail.com or name@company.com"
                      value={signupEmail}
                      onChange={e => {
                        setSignupEmail(e.target.value);
                        if (error) setError(null);
                      }}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-text-secondary/50 text-sm focus:outline-none focus:border-primary-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1.5">
                    Create Password <span className="text-primary-400">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-text-secondary absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showSignupPassword ? 'text' : 'password'}
                      required
                      autoComplete="new-password"
                      placeholder="Min 8 characters with letters & numbers"
                      value={signupPassword}
                      onChange={e => {
                        setSignupPassword(e.target.value);
                        if (error) setError(null);
                      }}
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-text-secondary/50 text-sm focus:outline-none focus:border-primary-500 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignupPassword(!showSignupPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-secondary hover:text-white transition-colors cursor-pointer"
                    >
                      {showSignupPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Password Quality Indicator */}
                  <div className="mt-2 space-y-1.5">
                    <div className="flex gap-1.5 h-1">
                      <div
                        className={`flex-1 rounded-full transition-colors ${
                          strength.score >= 1 ? 'bg-danger-400' : 'bg-white/10'
                        }`}
                      />
                      <div
                        className={`flex-1 rounded-full transition-colors ${
                          strength.score >= 2 ? 'bg-warning-400' : 'bg-white/10'
                        }`}
                      />
                      <div
                        className={`flex-1 rounded-full transition-colors ${
                          strength.score >= 3 ? 'bg-success-400' : 'bg-white/10'
                        }`}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-text-secondary">
                      <span>{signupPassword ? strength.text : 'Must be at least 8 chars with letters & numbers'}</span>
                      {strength.score >= 2 && (
                        <span className="text-success-400 font-medium flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Secure
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl gradient-bg-primary text-white font-semibold text-sm shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 hover:opacity-95 transition-all flex items-center justify-center gap-2 mt-3 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>{activeTab === 'login' ? 'Sign In & Unlock Types' : 'Create Real Account & Unlock'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Security Notice */}
          <div className="mt-6 pt-5 border-t border-white/10 text-center text-xs text-text-secondary flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4 text-success-400" />
            <span>Encrypted authentication • Strictly genuine accounts</span>
          </div>
        </div>
      </motion.div>

      {/* Locked Preview of the 3 Types */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="mt-12 max-w-4xl mx-auto w-full text-center"
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-text-secondary text-xs mb-6">
          <LockKeyhole className="w-3.5 h-3.5 text-primary-400" />
          <span>Unlock the 3 Resume Types after Signing In:</span>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-left opacity-75">
            <div className="flex items-center gap-2 text-primary-400 font-semibold text-xs mb-1">
              <FileCheck2 className="w-4 h-4" />
              <span>Type 1: Resume Builder</span>
            </div>
            <p className="text-xs text-text-secondary">Build ATS-ready resumes from scratch with AI bullet generation & multiple styles.</p>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-left opacity-75">
            <div className="flex items-center gap-2 text-accent-400 font-semibold text-xs mb-1">
              <BarChart3 className="w-4 h-4" />
              <span>Type 2: Resume Analysis</span>
            </div>
            <p className="text-xs text-text-secondary">Upload PDF/DOCX to get instant AI scoring across 6 key metrics and ATS checks.</p>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-left opacity-75">
            <div className="flex items-center gap-2 text-warning-400 font-semibold text-xs mb-1">
              <Target className="w-4 h-4" />
              <span>Type 3: Job Matching</span>
            </div>
            <p className="text-xs text-text-secondary">Match your resume against specific job requirements with keyword analysis.</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
