'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Download,
  FileText,
  FileCode,
  RotateCcw,
  Sparkles,
  BarChart3,
  Check,
  Printer,
  ChevronDown,
  Loader2,
  Eye,
  Edit3,
  LayoutGrid,
} from 'lucide-react';
import { ResumeBuilderData, TemplateStyle, ThemeColor } from '@/types/builder';
import {
  initialResumeState,
  sampleSoftwareEngineer,
  sampleProductManager,
} from '@/components/builder/sampleData';
import { ResumeForm } from '@/components/builder/ResumeForm';
import { ResumePreview } from '@/components/builder/ResumePreview';
import { TemplateGalleryModal } from '@/components/builder/TemplateGalleryModal';
import { Button } from '@/components/ui/Button';
import { AuthGuard } from '@/components/auth/AuthGuard';
import {
  generateBuilderPDF,
  generateBuilderDOCX,
  formatBuilderResumeToText,
} from '@/lib/document-generator';
import { saveAs } from 'file-saver';

export default function CreateResumePage() {
  const router = useRouter();
  const [resumeData, setResumeData] = useState<ResumeBuilderData>(sampleSoftwareEngineer);
  const [downloading, setDownloading] = useState<'pdf' | 'docx' | null>(null);
  const [mobileView, setMobileView] = useState<'edit' | 'preview'>('edit');
  const [samplesOpen, setSamplesOpen] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);

  const handleTemplateChange = (template: TemplateStyle) => {
    setResumeData(prev => ({ ...prev, templateStyle: template }));
  };

  const handleThemeColorChange = (color: ThemeColor) => {
    setResumeData(prev => ({ ...prev, themeColor: color }));
  };

  const handleLoadSample = (sample: ResumeBuilderData) => {
    setResumeData(sample);
    setSamplesOpen(false);
  };

  const handleClear = () => {
    if (confirm('Are you sure you want to clear all fields?')) {
      setResumeData(initialResumeState);
    }
  };

  const handleDownloadPDF = async () => {
    setDownloading('pdf');
    try {
      const blob = await generateBuilderPDF(resumeData);
      const name = resumeData.personalInfo.fullName
        ? `${resumeData.personalInfo.fullName.replace(/\s+/g, '_')}_Resume.pdf`
        : 'Resume.pdf';
      saveAs(blob, name);
    } catch (err) {
      console.error('PDF export failed:', err);
    } finally {
      setDownloading(null);
    }
  };

  const handleDownloadDOCX = async () => {
    setDownloading('docx');
    try {
      const blob = await generateBuilderDOCX(resumeData);
      const name = resumeData.personalInfo.fullName
        ? `${resumeData.personalInfo.fullName.replace(/\s+/g, '_')}_Resume.docx`
        : 'Resume.docx';
      saveAs(blob, name);
    } catch (err) {
      console.error('DOCX export failed:', err);
    } finally {
      setDownloading(null);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleAnalyzeWithAI = async () => {
    setDownloading('pdf');
    try {
      const blob = await generateBuilderPDF(resumeData);
      const fileName = `${resumeData.personalInfo.fullName?.replace(/\s+/g, '_') || 'Resume'}.pdf`;
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64data = reader.result as string;
        sessionStorage.setItem('prefill_resume_base64', base64data);
        sessionStorage.setItem('prefill_resume_name', fileName);
        router.push('/analyze');
      };
      reader.readAsDataURL(blob);
    } catch (err) {
      console.error('Failed to prepare for analysis', err);
      router.push('/analyze');
    } finally {
      setDownloading(null);
    }
  };

  return (
    <AuthGuard toolName="the Resume Builder (Type 1)">
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border-subtle pb-5">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 rounded-xl hover:bg-surface-100 transition-colors text-text-muted hover:text-text-primary"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1
                  className="text-2xl sm:text-3xl font-extrabold text-text-primary"
                  style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif" }}
                >
                  Create <span className="gradient-text">Resume</span>
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary-500/15 text-primary-300 border border-primary-500/25">
                  AI Powered
                </span>
              </div>
              <p className="text-xs sm:text-sm text-text-secondary mt-0.5">
                Build an ATS-optimized, high-impact resume with live preview and instant exports.
              </p>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Browse Templates Gallery Modal Button */}
            <button
              type="button"
              onClick={() => setGalleryOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl gradient-bg-primary text-white text-xs font-semibold hover:shadow-md hover:shadow-primary-500/25 hover:scale-[1.02] transition-all"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Choose Template</span>
            </button>

            {/* Sample Templates Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setSamplesOpen(!samplesOpen)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-surface-100 hover:bg-surface-200 border border-border-default text-text-primary text-xs font-medium transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 text-primary-400" />
                <span>Load Sample</span>
                <ChevronDown className="w-3.5 h-3.5 text-text-muted" />
              </button>

              {samplesOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl bg-[#12122b] border border-border-default shadow-2xl p-1.5 z-50">
                  <button
                    onClick={() => handleLoadSample(sampleSoftwareEngineer)}
                    className="w-full text-left px-3 py-2 text-xs rounded-lg hover:bg-surface-200 text-text-primary transition-colors flex items-center justify-between"
                  >
                    <span>Full Stack Engineer</span>
                    <span className="text-[10px] text-primary-400">Tech</span>
                  </button>
                  <button
                    onClick={() => handleLoadSample(sampleProductManager)}
                    className="w-full text-left px-3 py-2 text-xs rounded-lg hover:bg-surface-200 text-text-primary transition-colors flex items-center justify-between"
                  >
                    <span>Lead Product Manager</span>
                    <span className="text-[10px] text-accent-400">Exec</span>
                  </button>
                  <div className="border-t border-border-subtle my-1" />
                  <button
                    onClick={handleClear}
                    className="w-full text-left px-3 py-2 text-xs rounded-lg hover:bg-danger-500/10 text-danger-400 transition-colors flex items-center gap-2"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Clear All (Blank)</span>
                  </button>
                </div>
              )}
            </div>

            {/* Print / Save */}
            <button
              onClick={handlePrint}
              className="p-2 rounded-xl bg-surface-100 hover:bg-surface-200 border border-border-default text-text-secondary hover:text-text-primary transition-colors"
              title="Print / Save PDF via Browser"
            >
              <Printer className="w-4 h-4" />
            </button>

            {/* DOCX Export */}
            <Button
              size="sm"
              variant="secondary"
              onClick={handleDownloadDOCX}
              disabled={downloading !== null}
              icon={
                downloading === 'docx' ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <FileCode className="w-3.5 h-3.5 text-primary-400" />
                )
              }
            >
              DOCX
            </Button>

            {/* PDF Export */}
            <Button
              size="sm"
              variant="primary"
              onClick={handleDownloadPDF}
              disabled={downloading !== null}
              icon={
                downloading === 'pdf' ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Download className="w-3.5 h-3.5" />
                )
              }
            >
              Download PDF
            </Button>

            {/* Send to Resume Analysis */}
            <Button
              size="sm"
              variant="secondary"
              onClick={handleAnalyzeWithAI}
              icon={<BarChart3 className="w-3.5 h-3.5 text-accent-400" />}
            >
              Analyze in AI
            </Button>
          </div>
        </div>

        {/* Mobile View Toggle */}
        <div className="lg:hidden flex items-center justify-center p-1 bg-surface-100 rounded-xl border border-border-subtle max-w-xs mx-auto">
          <button
            onClick={() => setMobileView('edit')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              mobileView === 'edit'
                ? 'bg-primary-500 text-white shadow-sm'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            Edit Form
          </button>
          <button
            onClick={() => setMobileView('preview')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              mobileView === 'preview'
                ? 'bg-primary-500 text-white shadow-sm'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            Live Preview
          </button>
        </div>

        {/* Two-Column Editor & Preview Layout */}
        <div className="grid lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Form Editor */}
          <div
            className={`lg:col-span-6 space-y-4 ${
              mobileView === 'edit' ? 'block' : 'hidden lg:block'
            }`}
          >
            <ResumeForm data={resumeData} onChange={setResumeData} />
          </div>

          {/* Right Column: Live Document Preview */}
          <div
            className={`lg:col-span-6 sticky top-20 ${
              mobileView === 'preview' ? 'block' : 'hidden lg:block'
            }`}
          >
            <ResumePreview
              data={resumeData}
              onTemplateChange={handleTemplateChange}
              onThemeColorChange={handleThemeColorChange}
              onOpenGallery={() => setGalleryOpen(true)}
            />
          </div>
        </div>

        {/* Template Gallery Modal */}
        <TemplateGalleryModal
          isOpen={galleryOpen}
          onClose={() => setGalleryOpen(false)}
          currentTemplate={resumeData.templateStyle}
          currentThemeColor={resumeData.themeColor}
          onSelectTemplate={(templateId, color) => {
            setResumeData(prev => ({
              ...prev,
              templateStyle: templateId,
              themeColor: color || prev.themeColor,
            }));
          }}
        />
      </div>
    </div>
    </AuthGuard>
  );
}
