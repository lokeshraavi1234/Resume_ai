'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  gradient?: boolean;
  onClick?: () => void;
}

export function Card({
  children,
  className = '',
  hover = true,
  glow = false,
  gradient = false,
  onClick,
}: CardProps) {
  const cardClass = gradient ? 'gradient-border' : hover ? 'glass-card' : 'glass-card-static';
  const glowClass = glow ? 'pulse-glow' : '';
  const clickableClass = onClick ? 'cursor-pointer' : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={`${cardClass} ${glowClass} ${clickableClass} p-6 ${className}`}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}
