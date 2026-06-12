'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

interface InputSectionProps {
  resume: string
  jobDescription: string
  resumeFileName?: string | null
  githubUsername?: string
  onFileSelect?: (file: File | null) => void
  onResumeChange: (value: string) => void
  onJobDescriptionChange: (value: string) => void
  onGithubUsernameChange?: (value: string) => void
  onAnalyze: () => void
  onTrySample: () => void
  loading: boolean
  resumeLength: number
  jobDescriptionLength: number
}

// Minimum content lengths for validation
const MIN_RESUME_LENGTH = 20
const MIN_JOB_DESC_LENGTH = 50

export default function InputSection({
  resume,
  jobDescription,
  resumeFileName = null,
  githubUsername = '',
  onFileSelect,
  onResumeChange,
  onJobDescriptionChange,
  onGithubUsernameChange,
  onAnalyze,
  onTrySample,
  loading,
  resumeLength,
  jobDescriptionLength,
}: InputSectionProps) {
  const [inputMode, setInputMode] = useState<'resume' | 'github'>('resume')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    if (!file) {
      onFileSelect?.(null)
      return
    }
    onFileSelect?.(file)
  }

  const clearFile = () => {
    const fileInput = document.getElementById('resume-file') as HTMLInputElement | null
    if (fileInput) {
      fileInput.value = ''
      onFileSelect?.(null)
    }
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
      className="space-y-8"
    >
      {/* Input Mode Toggle */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.25 }}
        className="flex items-center justify-center gap-2"
      >
        <span className="text-xs font-medium text-muted">Input Method:</span>
        <div className="relative flex items-center rounded-full bg-white/5 border border-white/10 p-1">
          {/* Sliding background */}
          <motion.div
            className="absolute inset-y-1 left-1 right-1/2 rounded-full bg-accent/20 border border-accent/30"
            animate={{
              left: inputMode === 'resume' ? 4 : 'calc(50% + 4px)',
              right: inputMode === 'resume' ? 'calc(50% + 4px)' : 4,
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
          
          {/* Resume button */}
          <button
            onClick={() => setInputMode('resume')}
            className={`relative z-10 px-4 py-1.5 text-xs font-medium rounded-full transition-colors ${
              inputMode === 'resume' ? 'text-white' : 'text-muted hover:text-white'
            }`}
          >
            📄 Paste Resume
          </button>
          
          {/* GitHub button */}
          <button
            onClick={() => setInputMode('github')}
            className={`relative z-10 px-4 py-1.5 text-xs font-medium rounded-full transition-colors ${
              inputMode === 'github' ? 'text-white' : 'text-muted hover:text-white'
            }`}
          >
            🐙 GitHub Profile
          </button>
        </div>
      </motion.div>

      <div className="flex flex-col gap-6 lg:flex-row">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex-1 rounded-2xl border border-border bg-gradient-to-br from-surface to-surface/50 p-6 sm:p-8 shadow-card hover:shadow-glow-sm transition-all duration-300"
        >
          {inputMode === 'resume' ? (
            <>
              <label className="mb-4 block text-sm sm:text-base font-semibold text-white leading-tight" htmlFor="resume-input">
                📄 Your Resume
              </label>
              <textarea
                id="resume-input"
                aria-label="Your resume input"
                value={resume}
                onChange={(event) => onResumeChange(event.target.value)}
                placeholder="Paste your resume here... include skills, experience, and achievements"
                className="min-h-[320px] w-full rounded-2xl bg-white/5 border border-white/10 p-6 text-sm leading-relaxed text-white placeholder-muted/40 backdrop-blur-sm outline-none transition-all focus:bg-white/10 focus:border-accent/50 focus:ring-2 focus:ring-accent/20 resize-none"
              />
              <div className="mt-5 flex flex-col gap-3">
                <label className="inline-flex cursor-pointer items-center justify-center rounded-xl bg-accent/10 border border-accent/20 px-4 py-2.5 text-sm font-semibold text-accent hover:bg-accent/20 transition-all duration-300 hover:scale-105 active:scale-95" htmlFor="resume-file">
                  📤 Upload PDF Resume
                  <input id="resume-file" name="resume_file" onChange={handleFileChange} accept="application/pdf" type="file" className="sr-only" />
                </label>
                {resumeFileName && (
                  <div className="flex items-center gap-2 rounded-lg bg-accent/5 px-3 py-2 border border-accent/20">
                    <span className="text-xs sm:text-sm text-white font-medium truncate">✓ {resumeFileName}</span>
                    <button
                      type="button"
                      onClick={clearFile}
                      className="ml-auto text-xs text-muted hover:text-white transition-colors"
                      aria-label="Clear file"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>
              <p className="mt-4 text-right text-xs text-muted font-medium">{resumeLength.toLocaleString()} characters</p>
            </>
          ) : (
            <>
              <label className="mb-4 block text-sm sm:text-base font-semibold text-white leading-tight" htmlFor="github-input">
                🐙 GitHub Profile
              </label>
              <input
                id="github-input"
                aria-label="GitHub username or URL"
                value={githubUsername}
                onChange={(event) => onGithubUsernameChange?.(event.target.value)}
                placeholder="https://github.com/username or just username"
                className="w-full rounded-2xl bg-white/5 border border-white/10 px-6 py-4 text-sm text-white placeholder-muted/40 backdrop-blur-sm outline-none transition-all focus:bg-white/10 focus:border-accent/50 focus:ring-2 focus:ring-accent/20"
              />
              <p className="mt-4 rounded-lg bg-indigo-500/10 border border-indigo-500/20 px-4 py-3 text-xs text-indigo-200 leading-relaxed">
                ℹ️ We'll analyze your public repositories to detect your actual tech stack and skills automatically.
              </p>
            </>
          )}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="flex-1 rounded-2xl border border-border bg-gradient-to-br from-surface to-surface/50 p-6 sm:p-8 shadow-card hover:shadow-glow-sm transition-all duration-300"
        >
          <label className="mb-4 block text-sm sm:text-base font-semibold text-white leading-tight" htmlFor="job-description-input">
            💼 Job Description
          </label>
          <textarea
            id="job-description-input"
            aria-label="Job description input"
            value={jobDescription}
            onChange={(event) => onJobDescriptionChange(event.target.value)}
            placeholder="Paste the job description here... include requirements and responsibilities"
            className="min-h-[320px] w-full rounded-2xl bg-white/5 border border-white/10 p-6 text-sm leading-relaxed text-white placeholder-muted/40 backdrop-blur-sm outline-none transition-all focus:bg-white/10 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 resize-none"
          />
          <p className="mt-4 text-right text-xs text-muted font-medium">{jobDescriptionLength.toLocaleString()} characters</p>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
      >
        <button
          type="button"
          onClick={onTrySample}
          className="btn-secondary"
          aria-label="Try sample inputs"
        >
          ✨ Try Sample
        </button>
        <button
          type="button"
          onClick={onAnalyze}
          disabled={loading}
          className="btn-primary min-h-12"
          aria-label="Analyze my skills"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing...
            </>
          ) : (
            '🚀 Analyze My Skills'
          )}
        </button>
      </motion.div>
    </motion.div>
  )
}
