'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { validateEmail, validatePassword } from '@/lib/auth-validation';

const suggestedRoles = [
  'Full Stack Developer',
  'Frontend Engineer',
  'Backend Developer',
  'Data Scientist',
  'Product Manager',
  'DevOps Engineer',
];

export default function SignUpPage() {
  const router = useRouter();
  const { isAuthenticated, signup } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

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
      setError(emailCheck.error || 'Please provide a valid, real email.');
      return;
    }

    const pwdCheck = validatePassword(password);
    if (!pwdCheck.isValid) {
      setError(pwdCheck.error || 'Password is too weak.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await signup({ name, email, password, role });
      if (res.success) {
        router.push('/');
      } else {
        setError(res.error || 'Failed to create your account. Please review the details.');
      }
    } catch {
      setError('An error occurred during registration. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg"
      >
        <div className="glass-card p-7 sm:p-9 relative overflow-hidden border border-white/15 shadow-2xl shadow-primary-500/10">
          <div className="absolute top-0 right-0 w-48 h-48 bg-accent-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl pointer-events-none" />

          {/* Logo & Header */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-4 group">
              <div className="w-10 h-10 rounded-xl gradient-bg-primary flex items-center justify-center group-hover:scale-105 transition-transform shadow-lg shadow-primary-500/25">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-text-primary" style={{ fontFamily: 'var(--font-heading)' }}>
                Resume<span className="gradient-text">AI</span>
              </span>
            </Link>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-500/15 border border-primary-500/30 text-primary-300 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Free Lifetime Access
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Create Your Account
            </h1>
            <p className="text-sm text-text-secondary mt-1.5">
              Start generating ATS-ready resumes and intelligent job matches in minutes
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 mb-5 rounded-xl bg-danger-500/15 border border-danger-500/30 flex items-start gap-2.5 text-danger-300 text-xs"
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </motion.div>
          )}

          {/* Sign Up Form */}
          <form onSubmit={handleSubmit} autoComplete="off" className="space-y-4">
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
                  onChange={e => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-text-secondary/50 text-sm focus:outline-none focus:border-primary-500 transition-colors"
                />
              </div>
            </div>

            {/* Email */}
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
                  placeholder="lokesh@gmail.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-text-secondary/50 text-sm focus:outline-none focus:border-primary-500 transition-colors"
                />
              </div>
            </div>

            {/* Target Role */}
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1.5">
                Current or Target Role
              </label>
              <div className="relative mb-2">
                <Briefcase className="w-4 h-4 text-text-secondary absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  autoComplete="off"
                  placeholder="e.g. Full Stack Developer"
                  value={role}
                  onChange={e => setRole(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-text-secondary/50 text-sm focus:outline-none focus:border-primary-500 transition-colors"
                />
              </div>

              {/* Suggestions */}
              <div className="flex flex-wrap gap-1.5">
                {suggestedRoles.slice(0, 4).map(r => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className="text-[11px] px-2 py-0.5 rounded-md bg-white/5 hover:bg-white/10 border border-white/10 text-text-secondary hover:text-white transition-colors cursor-pointer"
                  >
                    + {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1.5">
                Password <span className="text-primary-400">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-text-secondary absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="new-password"
                  placeholder="Min 8 characters with letters & numbers"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
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

              {/* Strength indicator */}
              {password && (
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
                    <span>{strength.text}</span>
                    {strength.score >= 2 && (
                      <span className="text-success-400 font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Valid
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Perks list */}
            <div className="py-2.5 px-3 rounded-xl bg-white/5 border border-white/10 space-y-1.5 text-xs text-text-secondary">
              <div className="flex items-center gap-2 text-text-primary">
                <CheckCircle2 className="w-3.5 h-3.5 text-success-400 shrink-0" />
                <span>Unlimited AI Resume analyses & job matches</span>
              </div>
              <div className="flex items-center gap-2 text-text-primary">
                <CheckCircle2 className="w-3.5 h-3.5 text-success-400 shrink-0" />
                <span>Instant PDF and DOCX export with modern templates</span>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl gradient-bg-primary text-white font-semibold text-sm shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 hover:opacity-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
            >
              {isSubmitting ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Create Account & Get Started</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center text-xs text-text-secondary">
            Already have an account?{' '}
            <Link
              href="/login"
              className="text-primary-400 hover:text-primary-300 font-semibold transition-colors underline underline-offset-2"
            >
              Sign in here
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
