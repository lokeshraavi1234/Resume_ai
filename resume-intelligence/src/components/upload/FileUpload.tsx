'use client';

import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, X, CheckCircle2 } from 'lucide-react';
import { UploadedFile } from '@/types/resume';

interface FileUploadProps {
  file: UploadedFile | null;
  onFileSelect: (file: UploadedFile) => void;
  onFileRemove: () => void;
  label?: string;
  description?: string;
}

export function FileUpload({
  file,
  onFileSelect,
  onFileRemove,
  label = 'Upload Your Resume',
  description = 'Drag & drop your resume here, or click to browse',
}: FileUploadProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const f = acceptedFiles[0];
      if (f) {
        onFileSelect({
          file: f,
          name: f.name,
          size: f.size,
          type: f.type,
        });
      }
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
  });

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-semibold text-text-primary mb-3">
        {label}
      </label>

      <AnimatePresence mode="wait">
        {!file ? (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              {...getRootProps()}
              className={`relative border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-300 ${
                isDragActive
                  ? 'dropzone-active border-primary-500'
                  : 'border-border-default hover:border-primary-500/40 hover:bg-surface-50'
              }`}
            >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center gap-4">
              <motion.div
                animate={isDragActive ? { scale: 1.1, y: -5 } : { scale: 1, y: 0 }}
                className="w-16 h-16 rounded-2xl bg-primary-500/10 flex items-center justify-center"
              >
                <Upload className={`w-7 h-7 ${isDragActive ? 'text-primary-400' : 'text-primary-500/60'}`} />
              </motion.div>
              <div>
                <p className="text-sm font-medium text-text-primary mb-1">
                  {isDragActive ? 'Drop your file here...' : description}
                </p>
                <p className="text-xs text-text-muted">
                  Supports PDF and DOCX • Max 10MB
                </p>
              </div>
            </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="glass-card-static flex items-center gap-4 p-5"
          >
            <div className="w-12 h-12 rounded-xl bg-primary-500/15 flex items-center justify-center flex-shrink-0">
              <FileText className="w-6 h-6 text-primary-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-text-primary truncate">{file.name}</p>
                <CheckCircle2 className="w-4 h-4 text-success-400 flex-shrink-0" />
              </div>
              <p className="text-xs text-text-muted mt-0.5">
                {formatSize(file.size)} • {file.name.endsWith('.pdf') ? 'PDF' : 'DOCX'}
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onFileRemove();
              }}
              className="p-2 rounded-lg hover:bg-surface-200 transition-colors text-text-muted hover:text-danger-400"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
