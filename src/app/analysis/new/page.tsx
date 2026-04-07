'use client';

import { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import LoadingSteps from '@/components/LoadingSteps';

const MAX_JD_CHARS = 10000;

export default function NewAnalysisPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState('');
  const [uploadMode, setUploadMode] = useState<'pdf' | 'text'>('pdf');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [pdfLoading, setPdfLoading] = useState(false);

  const handleFileUpload = useCallback(async (file: File) => {
    if (file.type !== 'application/pdf') {
      setError('Please upload a PDF file.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be under 5MB.');
      return;
    }

    setPdfLoading(true);
    setError('');
    setFileName(file.name);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to parse PDF');
      }

      setResumeText(data.text);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse PDF. Try pasting as text.');
      setFileName('');
    } finally {
      setPdfLoading(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFileUpload(file);
    },
    [handleFileUpload]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileUpload(file);
  };

  const handleSubmit = async () => {
    setError('');

    const trimmedResume = resumeText.trim();
    const trimmedJD = jobDescription.trim();

    if (!trimmedResume) {
      setError('Please upload your resume or paste it as text.');
      return;
    }

    if (trimmedResume.length < 50) {
      setError('Resume text is too short. Please provide your full resume.');
      return;
    }

    if (!trimmedJD) {
      setError('Please paste the job description.');
      return;
    }

    if (trimmedJD.length < 50) {
      setError('Job description is too short. Please provide the full JD.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/analysis/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText: trimmedResume, jobDescription: trimmedJD }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Analysis failed. Please try again.');
      }

      router.push(`/analysis/${data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      setIsLoading(false);
    }
  };

  const canSubmit = resumeText.trim().length >= 50 && jobDescription.trim().length >= 50;

  return (
    <>
      <LoadingSteps isLoading={isLoading} />

      <div className="min-h-screen bg-[#0a0a0a]">
        {/* Header */}
        <div className="border-b border-white/[0.04]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-6 h-6 rounded border border-[#c8973a]/40 flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-sm bg-[#c8973a]" />
              </div>
              <span className="font-display text-base font-semibold text-white">HirePrep</span>
            </Link>
            <Link href="/dashboard" className="text-sm text-white/40 hover:text-white/70 transition-colors">
              ← Back to Dashboard
            </Link>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="mb-8">
            <h1 className="font-display text-3xl font-semibold text-white mb-2">New Analysis</h1>
            <p className="text-white/40 text-sm">
              Upload your resume and paste the job description to get a complete match analysis.
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3"
            >
              <p className="text-sm text-red-400">{error}</p>
            </motion.div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Panel — Resume */}
            <div className="bg-[#111] border border-white/[0.06] rounded-xl overflow-hidden">
              <div className="px-5 pt-5 pb-4 border-b border-white/[0.04]">
                <h2 className="font-medium text-white text-sm mb-3">Your Resume</h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => setUploadMode('pdf')}
                    className={`text-xs px-3 py-1.5 rounded transition-colors ${
                      uploadMode === 'pdf'
                        ? 'bg-[#c8973a]/15 text-[#c8973a] border border-[#c8973a]/25'
                        : 'text-white/40 border border-white/[0.06] hover:text-white/60'
                    }`}
                  >
                    Upload PDF
                  </button>
                  <button
                    onClick={() => setUploadMode('text')}
                    className={`text-xs px-3 py-1.5 rounded transition-colors ${
                      uploadMode === 'text'
                        ? 'bg-[#c8973a]/15 text-[#c8973a] border border-[#c8973a]/25'
                        : 'text-white/40 border border-white/[0.06] hover:text-white/60'
                    }`}
                  >
                    Paste Text
                  </button>
                </div>
              </div>

              <div className="p-5">
                <AnimatePresence mode="wait">
                  {uploadMode === 'pdf' ? (
                    <motion.div
                      key="pdf"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      {/* Drop Zone */}
                      <div
                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                          isDragging
                            ? 'border-[#c8973a]/50 bg-[#c8973a]/[0.04]'
                            : fileName
                            ? 'border-emerald-500/30 bg-emerald-500/[0.04]'
                            : 'border-white/[0.1] hover:border-white/[0.2] bg-[#0a0a0a]/50'
                        }`}
                      >
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept=".pdf"
                          onChange={handleFileChange}
                          className="hidden"
                        />

                        {pdfLoading ? (
                          <div className="flex flex-col items-center gap-3">
                            <div className="w-8 h-8 border-2 border-[#c8973a]/30 border-t-[#c8973a] rounded-full animate-spin" />
                            <p className="text-sm text-white/50">Extracting text from PDF...</p>
                          </div>
                        ) : fileName ? (
                          <div className="flex flex-col items-center gap-2">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                              <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <p className="text-sm font-medium text-white">{fileName}</p>
                            <p className="text-xs text-white/40">
                              {resumeText.length.toLocaleString()} characters extracted
                            </p>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setFileName('');
                                setResumeText('');
                              }}
                              className="text-xs text-white/30 hover:text-white/60 mt-1"
                            >
                              Remove
                            </button>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center">
                              <svg className="w-6 h-6 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                              </svg>
                            </div>
                            <div>
                              <p className="text-sm text-white/60">
                                Drag & drop your PDF here, or{' '}
                                <span className="text-[#c8973a]">browse</span>
                              </p>
                              <p className="text-xs text-white/25 mt-1">PDF up to 5MB</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Text fallback hint */}
                      {!fileName && (
                        <p className="text-center text-xs text-white/25 mt-3">
                          Can&apos;t upload PDF?{' '}
                          <button
                            onClick={() => setUploadMode('text')}
                            className="text-[#c8973a]/70 hover:text-[#c8973a]"
                          >
                            Paste as text instead
                          </button>
                        </p>
                      )}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="text"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      <textarea
                        value={resumeText}
                        onChange={(e) => setResumeText(e.target.value)}
                        placeholder="Paste your full resume here..."
                        rows={16}
                        className="w-full bg-[#0a0a0a] border border-white/[0.08] rounded-lg px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#c8973a]/40 transition-colors resize-none font-mono leading-relaxed"
                      />
                      <p className="text-xs text-white/25 mt-2 text-right">
                        {resumeText.length.toLocaleString()} characters
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Right Panel — Job Description */}
            <div className="bg-[#111] border border-white/[0.06] rounded-xl overflow-hidden">
              <div className="px-5 pt-5 pb-4 border-b border-white/[0.04]">
                <h2 className="font-medium text-white text-sm">Job Description</h2>
                <p className="text-xs text-white/35 mt-1">
                  Paste the full job description including requirements and qualifications
                </p>
              </div>
              <div className="p-5">
                <textarea
                  value={jobDescription}
                  onChange={(e) => {
                    if (e.target.value.length <= MAX_JD_CHARS) {
                      setJobDescription(e.target.value);
                    }
                  }}
                  placeholder="Paste the job description here..."
                  rows={16}
                  className="w-full bg-[#0a0a0a] border border-white/[0.08] rounded-lg px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#c8973a]/40 transition-colors resize-none leading-relaxed"
                />
                <div className="flex justify-between items-center mt-2">
                  <p className="text-xs text-white/25">
                    Include the full posting for best results
                  </p>
                  <p className={`text-xs ${jobDescription.length > MAX_JD_CHARS * 0.9 ? 'text-amber-400' : 'text-white/25'}`}>
                    {jobDescription.length.toLocaleString()} / {MAX_JD_CHARS.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="mt-6 flex flex-col sm:flex-row items-center gap-4">
            <button
              onClick={handleSubmit}
              disabled={!canSubmit || isLoading}
              className="w-full sm:w-auto bg-[#c8973a] hover:bg-[#d4a84d] disabled:opacity-40 disabled:cursor-not-allowed text-black font-semibold px-10 py-3.5 rounded-lg transition-all duration-200 text-base hover:shadow-[0_0_20px_rgba(200,151,58,0.25)]"
            >
              Analyse Now →
            </button>
            <p className="text-xs text-white/30">
              This takes ~30–60 seconds. Please don&apos;t close the page.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
