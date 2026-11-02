'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User as UserIcon,
  LogOut,
  Sparkles,
  FileCheck2,
  ChevronDown,
  Briefcase,
  Layers,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export function UserDropdown() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  // Extract initials
  const initials = user.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 p-1.5 pr-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-left"
        aria-expanded={isOpen}
      >
        <div className="w-8 h-8 rounded-full gradient-bg-primary flex items-center justify-center text-white text-xs font-bold shadow-md shadow-primary-500/20">
          {initials || <UserIcon className="w-4 h-4 text-white" />}
        </div>
        <div className="hidden sm:block text-left">
          <div className="text-xs font-semibold text-text-primary leading-tight flex items-center gap-1.5">
            <span className="truncate max-w-[120px]">{user.name}</span>
          </div>
          <div className="text-[10px] text-text-secondary truncate max-w-[120px]">
            {user.role || 'Member'}
          </div>
        </div>
        <ChevronDown
          className={`w-3.5 h-3.5 text-text-secondary transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-64 rounded-2xl bg-[rgba(15,15,35,0.98)] border border-white/15 backdrop-blur-2xl shadow-2xl p-2 z-50 overflow-hidden"
          >
            {/* User Info Header */}
            <div className="p-3 mb-1 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full gradient-bg-primary flex items-center justify-center text-white font-bold text-sm">
                  {initials}
                </div>
                <div className="overflow-hidden">
                  <h3 className="text-sm font-semibold text-white truncate">{user.name}</h3>
                  <p className="text-xs text-text-secondary truncate">{user.email}</p>
                </div>
              </div>
              {user.role && (
                <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-primary-300 bg-primary-500/10 px-2 py-1 rounded-md border border-primary-500/20">
                  <Briefcase className="w-3 h-3 shrink-0" />
                  <span className="truncate">{user.role}</span>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="space-y-0.5">
              <Link
                href="/create"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-text-secondary hover:text-white rounded-lg hover:bg-white/5 transition-colors"
              >
                <FileCheck2 className="w-4 h-4 text-primary-400" />
                <span>Create New Resume</span>
              </Link>
              <Link
                href="/analyze"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-text-secondary hover:text-white rounded-lg hover:bg-white/5 transition-colors"
              >
                <Sparkles className="w-4 h-4 text-accent-400" />
                <span>Resume AI Analysis</span>
              </Link>
              <Link
                href="/job-match"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-text-secondary hover:text-white rounded-lg hover:bg-white/5 transition-colors"
              >
                <Layers className="w-4 h-4 text-warning-400" />
                <span>Job Fit Score</span>
              </Link>
            </div>

            {/* Divider */}
            <div className="my-1.5 border-t border-white/10" />

            {/* Logout */}
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                logout();
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-danger-400 hover:text-danger-300 rounded-lg hover:bg-danger-500/10 transition-colors text-left"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
