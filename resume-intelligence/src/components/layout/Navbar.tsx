'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Menu, X, LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { UserDropdown } from '@/components/auth/UserDropdown';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/create', label: 'Create Resume' },
  { href: '/analyze', label: 'Resume Analysis' },
  { href: '/job-match', label: 'Job Match' },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { isAuthenticated, user, openAuthModal, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[rgba(10,10,26,0.85)] backdrop-blur-xl border-b border-border-subtle'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl gradient-bg-primary flex items-center justify-center group-hover:shadow-lg group-hover:shadow-primary-500/30 transition-shadow">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-text-primary hidden sm:block" style={{ fontFamily: 'var(--font-heading)' }}>
              Resume<span className="gradient-text">AI</span>
            </span>
          </Link>

          {/* Desktop Navigation Links (Only shown when authenticated) */}
          {isAuthenticated && (
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary rounded-lg hover:bg-surface-100 transition-all"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}

          {/* Desktop Auth Controls */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <UserDropdown />
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => openAuthModal('login')}
                  className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-white rounded-xl hover:bg-white/5 transition-all flex items-center gap-1.5"
                >
                  <LogIn className="w-4 h-4 text-primary-400" />
                  <span>Sign In</span>
                </button>
                <button
                  type="button"
                  onClick={() => openAuthModal('signup')}
                  className="px-4 py-2 text-sm font-semibold text-white rounded-xl gradient-bg-primary hover:shadow-lg hover:shadow-primary-500/25 transition-all flex items-center gap-1.5"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Create Account</span>
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            {isAuthenticated && <UserDropdown />}
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="p-2 rounded-lg hover:bg-surface-100 transition-colors text-text-secondary"
              aria-label="Toggle navigation menu"
            >
              {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[rgba(10,10,26,0.95)] backdrop-blur-xl border-b border-border-subtle overflow-hidden"
          >
            <div className="px-4 py-3 space-y-1">
              {isAuthenticated &&
                navLinks.map(link => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileOpen(false)}
                    className="block px-4 py-2.5 text-sm font-medium text-text-secondary hover:text-text-primary rounded-lg hover:bg-surface-100 transition-all"
                  >
                    {link.label}
                  </Link>
                ))}

              <div className="pt-3 mt-2 border-t border-white/10 space-y-2">
                {!isAuthenticated ? (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setIsMobileOpen(false);
                        openAuthModal('login');
                      }}
                      className="w-full px-4 py-2.5 text-sm font-medium text-center text-text-primary rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                    >
                      <LogIn className="w-4 h-4 text-primary-400" />
                      <span>Sign In</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsMobileOpen(false);
                        openAuthModal('signup');
                      }}
                      className="w-full px-4 py-2.5 text-sm font-semibold text-center text-white rounded-xl gradient-bg-primary hover:opacity-95 transition-all flex items-center justify-center gap-2"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>Create Free Account</span>
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setIsMobileOpen(false);
                      logout();
                    }}
                    className="w-full px-4 py-2.5 text-sm font-medium text-danger-400 rounded-xl bg-danger-500/10 border border-danger-500/20 text-center"
                  >
                    Sign Out ({user?.name})
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
