'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Mail,
  Lock,
  User,
  Briefcase,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { AuthMode } from '@/types/auth';
import { validateEmail, validatePassword } from '@/lib/auth-validation';

export function AuthModal() {
  const {
    isAuthModalOpen,
    authModalMode,
    openAuthModal,
    closeAuthModal,
    login,
    signup,
  } = useAuth();

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Switch tabs & clear inputs so neither option saves or pre-fills email/password before submit
  const handleSwitchTab = (newMode: AuthMode) => {
    setError(null);
    setEmail('');
    setPassword('');
    setName('');
    setRole('');
    openAuthModal(newMode);
  };

  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { score: 0, text: 'Required' };
    let score = 0;
    if (pwd.length >= 8) score += 1;
    if (/[a-zA-Z]/.test(pwd) && /[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd) || pwd.length >= 10) score += 1;

    if (score === 1) return { score: 1, text: 'Weak — Need letters and numbers' };
    if (score === 2) return { score: 2, text: 'Good — Valid password' };
    if (score >= 3) return { score: 3, text: 'Strong & Secure' };
    return { score: 0, text: 'Too short (min 8 chars)' };
  };

  const strength = getPasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const emailCheck = validateEmail(email);
    if (!emailCheck.isValid) {
      setError(emailCheck.error || 'Please provide a valid email.');
      return;
    }

    if (authModalMode === 'signup') {
      const pwdCheck = validatePassword(password);
      if (!pwdCheck.isValid) {
        setError(pwdCheck.error || 'Please provide a valid password.');
        return;
      }
    }

    setIsSubmitting(true);

    try {
      if (authModalMode === 'login') {
        const res = await login(email, password);
        if (!res.success) {
          setError(res.error || 'Failed to sign in. Please check your credentials.');
        }
      } else {
        const res = await signup({ name, email, password, role });
        if (!res.success) {
          setError(res.error || 'Failed to create account. Please check your details.');
        }
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthModalOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeAuthModal}
          className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-md bg-[rgba(15,15,35,0.96)] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-primary-500/10 z-10 my-auto text-left"
        >
          {/* Close button */}
          <button
            onClick={closeAuthModal}
            className="absolute top-5 right-5 p-2 rounded-xl text-text-secondary hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/15 border border-primary-500/30 text-primary-300 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              {authModalMode === 'login' ? 'ResumeAI Account' : 'Free Career Intelligence'}
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {authModalMode === 'login' ? 'Welcome Back' : 'Create Your Account'}
            </h2>
            <p className="text-xs sm:text-sm text-text-secondary mt-1">
              {authModalMode === 'login'
                ? 'Sign in to access your saved resumes, AI scores, and analyses.'
                : 'Join thousands optimizing their careers with AI-powered resume intelligence.'}
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex p-1 bg-white/5 rounded-xl border border-white/10 mb-6">
            <button
              type="button"
              onClick={() => handleSwitchTab('login')}
              className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                authModalMode === 'login'
                  ? 'gradient-bg-primary text-white shadow-md'
                  : 'text-text-secondary hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => handleSwitchTab('signup')}
              className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                authModalMode === 'signup'
                  ? 'gradient-bg-primary text-white shadow-md'
                  : 'text-text-secondary hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Error Banner */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 mb-4 rounded-xl bg-danger-500/15 border border-danger-500/30 flex items-start gap-2.5 text-danger-300 text-xs"
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </motion.div>
          )}

          {/* Form with autoComplete="off" */}
          <form onSubmit={handleSubmit} autoComplete="off" className="space-y-4">
            {authModalMode === 'signup' && (
              <>
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1.5">
                    Full Name <span className="text-primary-400">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-text-secondary absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      autoComplete="off"
                      placeholder="e.g. Lokesh Sharma"
                      value={name}
                      onChange={e => {
                        setName(e.target.value);
                        if (error) setError(null);
                      }}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-text-secondary/50 text-sm focus:outline-none focus:border-primary-500 transition-colors"
                    />
                  </div>
                </div>

                {/* Target Role */}
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1.5">
                    Target Role / Title <span className="text-text-secondary/60">(Optional)</span>
                  </label>
                  <div className="relative">
                    <Briefcase className="w-4 h-4 text-text-secondary absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      autoComplete="off"
                      placeholder="e.g. Full Stack Developer, Data Scientist"
                      value={role}
                      onChange={e => setRole(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-text-secondary/50 text-sm focus:outline-none focus:border-primary-500 transition-colors"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Email Address */}
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1.5">
                Email Address <span className="text-primary-400">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-text-secondary absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  autoComplete="off"
                  placeholder="name@example.com"
                  value={email}
                  onChange={e => {
                    setEmail(e.target.value);
                    if (error) setError(null);
                  }}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-text-secondary/50 text-sm focus:outline-none focus:border-primary-500 transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-text-secondary">
                  Password <span className="text-primary-400">*</span>
                </label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-text-secondary absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="new-password"
                  placeholder={
                    authModalMode === 'signup'
                      ? 'Min 8 characters with letters & numbers'
                      : 'Enter your password'
                  }
                  value={password}
                  onChange={e => {
                    setPassword(e.target.value);
                    if (error) setError(null);
                  }}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-text-secondary/50 text-sm focus:outline-none focus:border-primary-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-secondary hover:text-white transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password Strength indicator for sign up */}
              {authModalMode === 'signup' && (
                <div className="mt-2 space-y-1">
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
                    <span>{password ? strength.text : 'Min 8 characters with letters & numbers'}</span>
                    {strength.score >= 2 && (
                      <span className="text-success-400 font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Valid
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl gradient-bg-primary text-white font-semibold text-sm shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 hover:opacity-95 transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>{authModalMode === 'login' ? 'Sign In to Account' : 'Create Real Account'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Security Notice */}
          <div className="mt-5 pt-4 border-t border-white/10 text-center text-xs text-text-secondary flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4 text-success-400" />
            <span>Encrypted credentials • Strictly real accounts</span>
          </div>

          {/* Footer note */}
          <div className="mt-5 text-center">
            {authModalMode === 'login' ? (
              <p className="text-xs text-text-secondary">
                New to ResumeAI?{' '}
                <button
                  type="button"
                  onClick={() => handleSwitchTab('signup')}
                  className="text-primary-400 hover:text-primary-300 font-semibold transition-colors underline underline-offset-2 cursor-pointer"
                >
                  Create account
                </button>
              </p>
            ) : (
              <p className="text-xs text-text-secondary">
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => handleSwitchTab('login')}
                  className="text-primary-400 hover:text-primary-300 font-semibold transition-colors underline underline-offset-2 cursor-pointer"
                >
                  Sign in here
                </button>
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
