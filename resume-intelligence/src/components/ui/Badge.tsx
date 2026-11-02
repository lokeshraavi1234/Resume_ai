'use client';

import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'green' | 'red' | 'amber' | 'blue' | 'purple' | 'default';
  className?: string;
}

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  const variants = {
    green: 'chip-green',
    red: 'chip-red',
    amber: 'chip-amber',
    blue: 'chip-blue',
    purple: 'chip-purple',
    default: 'bg-surface-200 text-text-secondary border border-border-subtle',
  };

  return (
    <span className={`chip ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
