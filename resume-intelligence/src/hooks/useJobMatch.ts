'use client';

import { useState, useCallback } from 'react';
import {
  JobMatchStep,
  UploadedFile,
  JobMatchResult,
  EnhancedResume,
  EnhancedSection,
} from '@/types/resume';

export function useJobMatch() {
  const [step, setStep] = useState<JobMatchStep>('input');
  const [file, setFile] = useState<UploadedFile | null>(null);
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [previousJDs, setPreviousJDs] = useState<string[]>([]);
  const [matchResult, setMatchResult] = useState<JobMatchResult | null>(null);
  const [enhancedResume, setEnhancedResume] = useState<EnhancedResume | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [processingMessage, setProcessingMessage] = useState('');
  const [regeneratingSection, setRegeneratingSection] = useState<string | null>(null);

  const matchMessages = [
    'Parsing your resume...',
    'Reading job description...',
    'Comparing skills and requirements...',
    'Calculating match score...',
    'Identifying gaps...',
    'Generating recommendations...',
  ];

  const enhanceMessages = [
    'Analyzing improvement areas...',
    'Optimizing professional summary...',
    'Enhancing experience descriptions...',
    'Prioritizing relevant skills...',
    'Improving project descriptions...',
    'Finalizing enhanced resume...',
  ];

  const startMatching = useCallback(async () => {
    if (!file || !jobDescription.trim()) return;

    setLoading(true);
    setError(null);
    setStep('matching');

    let msgIndex = 0;
    const msgInterval = setInterval(() => {
      setProcessingMessage(matchMessages[msgIndex % matchMessages.length]);
      msgIndex++;
    }, 800);

    try {
      // Parse resume first
      const formData = new FormData();
      formData.append('resume', file.file);

      const parseRes = await fetch('/api/parse-resume', {
        method: 'POST',
        body: formData,
      });

      if (!parseRes.ok) throw new Error('Failed to parse resume');
      const parseData = await parseRes.json();
      setResumeText(parseData.text);

      // Match job
      const matchRes = await fetch('/api/match-job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText: parseData.text,
          jobDescription,
          previousJDs: previousJDs.filter(jd => jd.trim()),
        }),
      });

      if (!matchRes.ok) throw new Error('Failed to match job');
      const matchData = await matchRes.json();
      setMatchResult(matchData);
      setStep('results');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setStep('input');
    } finally {
      clearInterval(msgInterval);
      setLoading(false);
    }
  }, [file, jobDescription, previousJDs]);

  const startEnhancement = useCallback(async () => {
    if (!resumeText || !jobDescription || !matchResult) return;

    setLoading(true);
    setStep('enhancement');

    let msgIndex = 0;
    const msgInterval = setInterval(() => {
      setProcessingMessage(enhanceMessages[msgIndex % enhanceMessages.length]);
      msgIndex++;
    }, 800);

    try {
      const res = await fetch('/api/enhance-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText,
          jobDescription,
          matchResult,
        }),
      });

      if (!res.ok) throw new Error('Failed to enhance resume');
      const data = await res.json();
      setEnhancedResume(data);
      setStep('editor');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setStep('results');
    } finally {
      clearInterval(msgInterval);
      setLoading(false);
    }
  }, [resumeText, jobDescription, matchResult]);

  const regenerateSection = useCallback(async (sectionId: string) => {
    if (!enhancedResume) return;

    const section = enhancedResume.sections.find(s => s.id === sectionId);
    if (!section) return;

    setRegeneratingSection(sectionId);

    try {
      const res = await fetch('/api/regenerate-section', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sectionId,
          originalContent: section.originalContent,
          jobDescription,
          context: resumeText,
        }),
      });

      if (!res.ok) throw new Error('Failed to regenerate section');
      const data = await res.json();

      setEnhancedResume({
        ...enhancedResume,
        sections: enhancedResume.sections.map(s =>
          s.id === sectionId ? data : s
        ),
      });
    } catch (err) {
      console.error('Regeneration error:', err);
    } finally {
      setRegeneratingSection(null);
    }
  }, [enhancedResume, jobDescription, resumeText]);

  const updateSections = useCallback((sections: EnhancedSection[]) => {
    if (enhancedResume) {
      setEnhancedResume({ ...enhancedResume, sections });
    }
  }, [enhancedResume]);

  const reset = useCallback(() => {
    setStep('input');
    setFile(null);
    setResumeText('');
    setJobDescription('');
    setPreviousJDs([]);
    setMatchResult(null);
    setEnhancedResume(null);
    setError(null);
    setProcessingMessage('');
  }, []);

  return {
    step,
    file,
    setFile,
    resumeText,
    jobDescription,
    setJobDescription,
    previousJDs,
    setPreviousJDs,
    matchResult,
    enhancedResume,
    loading,
    error,
    processingMessage,
    regeneratingSection,
    startMatching,
    startEnhancement,
    regenerateSection,
    updateSections,
    reset,
  };
}
