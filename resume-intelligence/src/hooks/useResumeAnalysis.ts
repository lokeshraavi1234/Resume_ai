'use client';

import { useState, useCallback, useEffect } from 'react';
import { AnalysisResult, AnalysisStep, UploadedFile } from '@/types/resume';

export function useResumeAnalysis() {
  const [step, setStep] = useState<AnalysisStep>('upload');
  const [file, setFile] = useState<UploadedFile | null>(null);
  const [resumeText, setResumeText] = useState('');
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [processingMessage, setProcessingMessage] = useState('');

  // Auto-load resume created in builder if available
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const base64 = sessionStorage.getItem('prefill_resume_base64');
    const name = sessionStorage.getItem('prefill_resume_name') || 'Resume.pdf';
    if (base64) {
      sessionStorage.removeItem('prefill_resume_base64');
      sessionStorage.removeItem('prefill_resume_name');
      fetch(base64)
        .then(res => res.blob())
        .then(blob => {
          const fileObj = new File([blob], name, { type: 'application/pdf' });
          setFile({
            file: fileObj,
            name: fileObj.name,
            size: fileObj.size,
            type: fileObj.type,
          });
        })
        .catch(err => console.error('Failed to load prefilled resume:', err));
    }
  }, []);

  const processingMessages = [
    'Parsing your resume...',
    'Extracting skills and experience...',
    'Analyzing education and certifications...',
    'Evaluating resume structure...',
    'Checking ATS compatibility...',
    'Generating AI insights...',
    'Calculating your score...',
  ];

  const startAnalysis = useCallback(async () => {
    if (!file) return;

    setLoading(true);
    setError(null);
    setStep('processing');

    // Cycle through processing messages
    let msgIndex = 0;
    const msgInterval = setInterval(() => {
      setProcessingMessage(processingMessages[msgIndex % processingMessages.length]);
      msgIndex++;
    }, 800);

    try {
      // Step 1: Parse resume
      setProcessingMessage('Parsing your resume...');
      const formData = new FormData();
      formData.append('resume', file.file);

      const parseRes = await fetch('/api/parse-resume', {
        method: 'POST',
        body: formData,
      });

      if (!parseRes.ok) {
        const err = await parseRes.json();
        throw new Error(err.error || 'Failed to parse resume');
      }

      const parseData = await parseRes.json();
      setResumeText(parseData.text);

      // Step 2: Analyze resume
      setProcessingMessage('Analyzing with AI...');
      const analyzeRes = await fetch('/api/analyze-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText: parseData.text }),
      });

      if (!analyzeRes.ok) {
        const err = await analyzeRes.json();
        throw new Error(err.error || 'Failed to analyze resume');
      }

      const analysisData = await analyzeRes.json();
      setAnalysis(analysisData);
      setStep('results');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      setStep('upload');
    } finally {
      clearInterval(msgInterval);
      setLoading(false);
    }
  }, [file]);

  const reset = useCallback(() => {
    setStep('upload');
    setFile(null);
    setResumeText('');
    setAnalysis(null);
    setError(null);
    setProcessingMessage('');
  }, []);

  return {
    step,
    file,
    setFile,
    resumeText,
    analysis,
    loading,
    error,
    processingMessage,
    startAnalysis,
    reset,
  };
}
