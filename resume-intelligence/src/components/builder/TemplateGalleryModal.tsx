'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Sparkles, Layers, FileText, CheckCircle2 } from 'lucide-react';
import { TemplateStyle, ThemeColor, TemplateCategory, TemplateDefinition } from '@/types/builder';
import { resumeTemplates, templateCategories } from './templateDefinitions';

interface TemplateGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTemplate: TemplateStyle;
  currentThemeColor: ThemeColor;
  onSelectTemplate: (templateId: TemplateStyle, themeColor?: ThemeColor) => void;
}

const colorMap: Record<ThemeColor, string> = {
  emerald: '#047857',
  indigo: '#4f46e5',
  purple: '#9333ea',
  rose: '#e11d48',
  slate: '#334155',
};

export function TemplateGalleryModal({
  isOpen,
  onClose,
  currentTemplate,
  currentThemeColor,
  onSelectTemplate,
}: TemplateGalleryModalProps) {
  const [activeCategory, setActiveCategory] = useState<TemplateCategory>('all');
  const [selectedColor, setSelectedColor] = useState<ThemeColor>(currentThemeColor);

  if (!isOpen) return null;

  const filteredTemplates = resumeTemplates.filter(t =>
    activeCategory === 'all' ? true : t.category.includes(activeCategory)
  );

  const handleApply = (templateId: TemplateStyle, color: ThemeColor) => {
    onSelectTemplate(templateId, color);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-5xl rounded-2xl bg-[#0e0e24] border border-border-default shadow-2xl p-6 sm:p-8 max-h-[92vh] flex flex-col z-10"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-5 border-b border-border-subtle">
            <div>
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-primary-400" />
                <h2
                  className="text-xl sm:text-2xl font-bold text-text-primary"
                  style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif" }}
                >
                  Resume Templates
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-text-secondary mt-1">
                Choose an ATS-compliant template design tailored for your industry.
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-surface-100 hover:bg-surface-200 text-text-muted hover:text-text-primary transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Filter Pills (Matching user screenshot) */}
          <div className="flex items-center gap-2 overflow-x-auto py-4 scrollbar-none">
            {templateCategories.map(cat => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-primary-500 text-white shadow-md shadow-primary-500/25'
                      : 'bg-surface-100 hover:bg-surface-200 text-text-secondary hover:text-text-primary border border-border-subtle'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Templates Grid */}
          <div className="flex-1 overflow-y-auto pr-1 py-2 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map(template => {
              const isSelected = currentTemplate === template.id;
              const activeCardColor = selectedColor;

              return (
                <div
                  key={template.id}
                  className={`group relative rounded-2xl bg-surface-50 border transition-all duration-300 flex flex-col justify-between overflow-hidden ${
                    isSelected
                      ? 'border-primary-500 shadow-xl shadow-primary-500/15 ring-2 ring-primary-500/30'
                      : 'border-border-default hover:border-primary-500/50 hover:shadow-lg'
                  }`}
                >
                  {/* Miniature Visual Layout Mockup */}
                  <div className="p-4 bg-slate-950/40 border-b border-border-subtle flex justify-center">
                    <div className="w-full max-w-[240px] h-[210px] bg-white rounded-md shadow-md p-3.5 flex flex-col justify-between relative overflow-hidden transition-transform group-hover:scale-[1.02]">
                      {/* Badge if present */}
                      {template.badge && (
                        <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded text-[9px] font-bold bg-primary-500 text-white shadow-sm z-10">
                          {template.badge}
                        </div>
                      )}

                      {/* Mock Render 1: Two Column */}
                      {template.id === 'two-column' && (
                        <div className="flex h-full gap-2">
                          <div
                            className="w-[38%] rounded-sm p-1.5 flex flex-col gap-1.5 text-white"
                            style={{ backgroundColor: colorMap[activeCardColor] }}
                          >
                            <div className="w-5 h-5 rounded-full bg-white/20 mx-auto" />
                            <div className="h-1.5 bg-white/80 rounded w-full" />
                            <div className="h-1 bg-white/50 rounded w-4/5" />
                            <div className="border-t border-white/20 my-1" />
                            <div className="space-y-1">
                              <div className="h-1 bg-white/60 rounded w-full" />
                              <div className="h-1 bg-white/60 rounded w-3/4" />
                              <div className="h-1 bg-white/60 rounded w-5/6" />
                            </div>
                          </div>
                          <div className="w-[62%] space-y-2 py-1">
                            <div className="h-2 rounded w-3/4" style={{ backgroundColor: colorMap[activeCardColor] }} />
                            <div className="h-1 bg-slate-200 rounded w-full" />
                            <div className="h-1 bg-slate-200 rounded w-5/6" />
                            <div className="h-1.5 bg-slate-300 rounded w-1/2 mt-2" />
                            <div className="space-y-1">
                              <div className="h-1 bg-slate-200 rounded w-full" />
                              <div className="h-1 bg-slate-200 rounded w-4/5" />
                              <div className="h-1 bg-slate-200 rounded w-11/12" />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Mock Render 2: ATS Classic Timeline */}
                      {template.id === 'ats-classic' && (
                        <div className="space-y-2 py-1">
                          <div className="text-center space-y-1 border-b pb-1.5 border-slate-900">
                            <div className="h-2 bg-slate-900 rounded w-1/2 mx-auto" />
                            <div className="h-1 bg-slate-400 rounded w-1/3 mx-auto" />
                          </div>
                          <div className="h-1.5 bg-slate-800 rounded w-1/4" />
                          <div className="flex gap-2">
                            <div className="w-1/4 h-1 bg-slate-400 rounded" />
                            <div className="w-3/4 space-y-1">
                              <div className="h-1.5 bg-slate-700 rounded w-3/4" />
                              <div className="h-1 bg-slate-300 rounded w-full" />
                              <div className="h-1 bg-slate-300 rounded w-5/6" />
                            </div>
                          </div>
                          <div className="h-1.5 bg-slate-800 rounded w-1/4 mt-1" />
                          <div className="flex gap-2">
                            <div className="w-1/4 h-1 bg-slate-400 rounded" />
                            <div className="w-3/4 space-y-1">
                              <div className="h-1.5 bg-slate-700 rounded w-2/3" />
                              <div className="h-1 bg-slate-300 rounded w-full" />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Mock Render 3: Boxed Executive */}
                      {template.id === 'executive' && (
                        <div className="space-y-2 py-1">
                          <div className="text-center space-y-1">
                            <div className="h-2.5 bg-slate-900 rounded w-3/5 mx-auto" />
                            <div className="h-1 bg-slate-500 rounded w-2/5 mx-auto" />
                            <div className="border-y border-slate-900 h-2 my-1" />
                          </div>
                          <div className="bg-slate-200 py-0.5 text-center">
                            <div className="h-1 bg-slate-700 rounded w-1/4 mx-auto" />
                          </div>
                          <div className="space-y-1">
                            <div className="h-1 bg-slate-300 rounded w-full" />
                            <div className="h-1 bg-slate-300 rounded w-5/6" />
                          </div>
                          <div className="bg-slate-200 py-0.5 text-center">
                            <div className="h-1 bg-slate-700 rounded w-1/3 mx-auto" />
                          </div>
                          <div className="space-y-1">
                            <div className="h-1.5 bg-slate-800 rounded w-1/2" />
                            <div className="h-1 bg-slate-300 rounded w-full" />
                          </div>
                        </div>
                      )}

                      {/* Mock Render 4: Modern Tech */}
                      {template.id === 'modern' && (
                        <div className="space-y-2 py-1">
                          <div className="border-b-2 pb-1.5" style={{ borderColor: colorMap[activeCardColor] }}>
                            <div className="h-2.5 bg-slate-900 rounded w-2/3" />
                            <div className="h-1 rounded w-1/3 mt-1" style={{ backgroundColor: colorMap[activeCardColor] }} />
                          </div>
                          <div className="h-1.5 rounded w-1/4" style={{ backgroundColor: colorMap[activeCardColor] }} />
                          <div className="space-y-1">
                            <div className="h-1 bg-slate-300 rounded w-full" />
                            <div className="h-1 bg-slate-300 rounded w-4/5" />
                          </div>
                          <div className="h-1.5 rounded w-1/4 mt-1" style={{ backgroundColor: colorMap[activeCardColor] }} />
                          <div className="flex gap-1">
                            <div className="h-2 rounded-full w-8 bg-slate-100 border border-slate-200" />
                            <div className="h-2 rounded-full w-9 bg-slate-100 border border-slate-200" />
                            <div className="h-2 rounded-full w-7 bg-slate-100 border border-slate-200" />
                          </div>
                        </div>
                      )}

                      {/* Mock Render 5: Minimalist Mono */}
                      {template.id === 'minimal' && (
                        <div className="space-y-2 py-1 pl-2 border-l-2" style={{ borderColor: colorMap[activeCardColor] }}>
                          <div className="h-2 bg-slate-900 rounded w-3/4" />
                          <div className="h-1 bg-slate-500 rounded w-1/2" />
                          <div className="h-1 bg-slate-300 rounded w-1/4 mt-2" />
                          <div className="space-y-1 pl-1 border-l border-slate-200">
                            <div className="h-1 bg-slate-400 rounded w-full" />
                            <div className="h-1 bg-slate-400 rounded w-5/6" />
                          </div>
                          <div className="h-1 bg-slate-300 rounded w-1/4 mt-1" />
                          <div className="space-y-1 pl-1 border-l border-slate-200">
                            <div className="h-1 bg-slate-400 rounded w-full" />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center justify-between">
                        <h3 className="text-base font-bold text-text-primary">{template.name}</h3>
                        {isSelected && (
                          <span className="flex items-center gap-1 text-xs font-semibold text-success-400">
                            <CheckCircle2 className="w-4 h-4" /> Active
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-text-secondary mt-1 leading-relaxed line-clamp-2">
                        {template.description}
                      </p>
                    </div>

                    {/* Bottom strip: Theme dots and Export format badges (Matching screenshot) */}
                    <div className="pt-3 border-t border-border-subtle flex items-center justify-between">
                      {/* Theme color dots */}
                      <div className="flex items-center gap-1.5">
                        {template.colorOptions.map(color => (
                          <button
                            key={color}
                            onClick={() => setSelectedColor(color)}
                            style={{ backgroundColor: colorMap[color] }}
                            className={`w-4 h-4 rounded-full transition-transform hover:scale-125 ${
                              selectedColor === color ? 'ring-2 ring-white scale-110' : 'opacity-70'
                            }`}
                            title={color}
                          />
                        ))}
                      </div>

                      {/* PDF & DOCX Format Badges */}
                      <div className="flex items-center gap-1 text-[10px] font-bold text-text-muted">
                        <span className="px-1.5 py-0.5 rounded bg-surface-200 border border-border-subtle">PDF</span>
                        <span className="px-1.5 py-0.5 rounded bg-surface-200 border border-border-subtle">DOCX</span>
                      </div>
                    </div>

                    {/* Select Action */}
                    <button
                      onClick={() => handleApply(template.id, selectedColor)}
                      className={`w-full py-2 rounded-xl text-xs font-semibold transition-all ${
                        isSelected
                          ? 'bg-primary-500/20 text-primary-300 border border-primary-500/30'
                          : 'gradient-bg-primary text-white hover:shadow-md hover:shadow-primary-500/25 hover:scale-[1.01]'
                      }`}
                    >
                      {isSelected ? 'Currently Applied' : 'Use This Template'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
