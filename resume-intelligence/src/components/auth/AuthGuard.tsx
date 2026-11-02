'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Lock, LogIn, UserPlus, ArrowLeft, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export function AuthGuard({
  children,
  toolName = 'this tool',
}: {
  children: React.ReactNode;
  toolName?: string;
}) {
  const { isAuthenticated, isLoading, openAuthModal } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-primary-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="max-w-md w-full glass-card p-8 rounded-3xl border border-white/15 text-center shadow-2xl relative overflow-hidden"
        >
          <div className="w-14 h-14 rounded-2xl bg-primary-500/15 border border-primary-500/30 flex items-center justify-center mx-auto mb-5 text-primary-400">
            <Lock className="w-6 h-6" />
          </div>

          <h2 className="text-2xl font-bold text-white mb-2">Authentication Required</h2>
          <p className="text-xs sm:text-sm text-text-secondary mb-6 leading-relaxed">
            Please sign in or create an account to access {toolName}.
          </p>

          <div className="space-y-3">
            <button
              type="button"
              onClick={() => openAuthModal('signup')}
              className="w-full py-3 rounded-xl gradient-bg-primary text-white font-semibold text-xs shadow-lg shadow-primary-500/25 hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Create Free Account</span>
            </button>

            <button
              type="button"
              onClick={() => openAuthModal('login')}
              className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogIn className="w-4 h-4 text-primary-400" />
              <span>Sign In</span>
            </button>
          </div>

          {/* Security Notice */}
          <div className="mt-5 pt-4 border-t border-white/10 text-center text-xs text-text-secondary flex items-center justify-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-success-400" />
            <span>Strictly verified personal accounts</span>
          </div>

          <div className="mt-5">
            <Link
              href="/"
              className="text-xs text-text-secondary hover:text-white transition-colors inline-flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3 h-3" />
              <span>Back to Home</span>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return <>{children}</>;
}
