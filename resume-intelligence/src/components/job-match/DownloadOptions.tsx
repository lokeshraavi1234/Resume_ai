'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, FileText, File, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { EnhancedSection } from '@/types/resume';
import { generatePDFBlob, generateDOCXBlob } from '@/lib/document-generator';
import { saveAs } from 'file-saver';

interface DownloadOptionsProps {
  sections: EnhancedSection[];
  fileName: string;
}

export function DownloadOptions({ sections, fileName }: DownloadOptionsProps) {
  const [downloading, setDownloading] = useState<string | null>(null);

  const baseName = fileName.replace(/\.[^.]+$/, '') || 'Resume';

  const handleDownloadPDF = async () => {
    setDownloading('pdf');
    try {
      const blob = await generatePDFBlob(sections, baseName);
      saveAs(blob, `${baseName}_Enhanced.pdf`);
    } catch (error) {
      console.error('PDF download error:', error);
    }
    setDownloading(null);
  };

  const handleDownloadDOCX = async () => {
    setDownloading('docx');
    try {
      const blob = await generateDOCXBlob(sections);
      saveAs(blob, `${baseName}_Enhanced.docx`);
    } catch (error) {
      console.error('DOCX download error:', error);
    }
    setDownloading(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card-static p-6"
    >
      <div className="flex items-center gap-2 mb-4">
        <Download className="w-5 h-5 text-primary-400" />
        <h3 className="text-lg font-bold text-text-primary" style={{ fontFamily: 'var(--font-heading)' }}>
          Download Enhanced Resume
        </h3>
      </div>
      <p className="text-sm text-text-secondary mb-6">
        Download your enhanced resume with all accepted changes applied.
      </p>

      <div className="grid sm:grid-cols-2 gap-4">
        <button
          onClick={handleDownloadPDF}
          disabled={downloading !== null}
          className="glass-card flex items-center gap-4 p-5 text-left group"
        >
          <div className="w-12 h-12 rounded-xl bg-danger-500/15 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
            {downloading === 'pdf' ? (
              <Loader2 className="w-6 h-6 text-danger-400 animate-spin" />
            ) : (
              <FileText className="w-6 h-6 text-danger-400" />
            )}
          </div>
          <div>
            <p className="text-sm font-semibold text-text-primary">Download as PDF</p>
            <p className="text-xs text-text-muted">Professional formatted PDF document</p>
          </div>
        </button>

        <button
          onClick={handleDownloadDOCX}
          disabled={downloading !== null}
          className="glass-card flex items-center gap-4 p-5 text-left group"
        >
          <div className="w-12 h-12 rounded-xl bg-primary-500/15 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
            {downloading === 'docx' ? (
              <Loader2 className="w-6 h-6 text-primary-400 animate-spin" />
            ) : (
              <File className="w-6 h-6 text-primary-400" />
            )}
          </div>
          <div>
            <p className="text-sm font-semibold text-text-primary">Download as DOCX</p>
            <p className="text-xs text-text-muted">Editable Word document format</p>
          </div>
        </button>
      </div>
    </motion.div>
  );
}
