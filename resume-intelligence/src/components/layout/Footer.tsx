import React from 'react';
import { Brain } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border-subtle mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg gradient-bg-primary flex items-center justify-center">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-semibold text-text-secondary" style={{ fontFamily: 'var(--font-heading)' }}>
              ResumeAI Intelligence Platform
            </span>
          </div>
          <p className="text-xs text-text-muted">
            © {new Date().getFullYear()} ResumeAI. AI-powered resume optimization.
          </p>
        </div>
      </div>
    </footer>
  );
}
