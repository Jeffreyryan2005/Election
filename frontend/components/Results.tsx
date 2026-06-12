'use client'

import { motion } from 'framer-motion'
import MatchScoreCircle from './MatchScoreCircle'
import SkillTags from './SkillTags'
import SkillRadarChart from './SkillRadarChart'
import LearningPlan from './LearningPlan'
import type { AnalysisResult } from '@/types'

interface ResultsProps {
  result: AnalysisResult
  stats: { totalResumeSkills: number; totalRequiredSkills: number; gapsFound: number } | null
}

export default function Results({ result, stats }: ResultsProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="space-y-8"
    >
      {/* Summary card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="card-surface p-8 sm:p-10"
      >
        {('warning' in result) && result.warning ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 rounded-xl border border-rose-500/50 bg-gradient-to-r from-rose-500/20 to-rose-500/5 px-5 py-4 text-sm text-rose-100 backdrop-blur-sm"
          >
            ⚠️ {String(result.warning)}
          </motion.div>
        ) : null}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <p className="flex-1 text-base sm:text-lg leading-relaxed text-muted/90 font-light">{result.summary}</p>
          <div className="flex flex-wrap gap-3 flex-shrink-0">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                const blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' })
                const url = URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = 'skillforge-analysis.json'
                a.click()
                URL.revokeObjectURL(url)
              }}
              className="btn-secondary text-xs sm:text-sm"
              aria-label="Export analysis JSON"
            >
              📥 Export JSON
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                const w = window.open('', '_blank')
                if (!w) return
                const html = `
                  <html>
                    <head>
                      <title>SkillForge Learning Plan</title>
                      <style>body{background:#0A0A0F;color:#fff;font-family:Inter,Arial;padding:40px;} h1{color:#6366f1;} .week{margin-bottom:24px;padding:16px;border:1px solid #1a1f2e;border-radius:12px;background:#0f1419;} h2{font-size:18px;margin-bottom:12px;}</style>
                    </head>
                    <body>
                      <h1>🚀 SkillForge — 30-Day Learning Plan</h1>
                      <p style="margin-bottom:20px;">${result.summary}</p>
                      ${result.learning_plan
                        .map(
                          (w) => `
                            <div class="week">
                              <h2>Week ${w.week} — ${w.title}</h2>
                              <p style="margin:8px 0;"><strong>Skills:</strong> ${w.skills.join(', ')}</p>
                              <ul style="margin-top:12px;">${w.tasks.map((t) => `<li style="margin-bottom:8px;"><strong>${t.day_range}:</strong> ${t.task} <a href="${t.resource_url}" style="color:#6366f1;">→ ${t.resource}</a></li>`).join('')}</ul>
                            </div>`
                        )
                        .join('')}
                    </body>
                  </html>`
                w.document.write(html)
                w.document.close()
                w.focus()
                w.print()
              }}
              className="btn-secondary text-xs sm:text-sm"
              aria-label="Print learning plan"
            >
              🖨️ Print Plan
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Match score and stats */}
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="card-surface p-8 flex items-center justify-center"
        >
          <MatchScoreCircle score={result.match_score} />
        </motion.div>
        
        <div className="card-surface p-8 sm:p-10">
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { label: 'Resume Skills', value: stats?.totalResumeSkills ?? 0, icon: '📄', color: 'from-blue-500/20 to-cyan-500/10' },
              { label: 'Required Skills', value: stats?.totalRequiredSkills ?? 0, icon: '💼', color: 'from-purple-500/20 to-pink-500/10' },
              { label: 'Skill Gaps', value: stats?.gapsFound ?? 0, icon: '⚡', color: 'from-orange-500/20 to-red-500/10' },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + idx * 0.1 }}
                className={`rounded-xl bg-gradient-to-br ${stat.color} border border-white/10 p-6 backdrop-blur-sm hover:shadow-glow-sm transition-all duration-300`}
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs uppercase font-semibold text-muted/70 tracking-wider">{stat.label}</p>
                  <span className="text-2xl">{stat.icon}</span>
                </div>
                <p className="text-4xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">{stat.value}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Matched vs Gap skills */}
      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="card-surface p-8 sm:p-10"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">✅</span>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white">Matched Skills</h2>
              <p className="text-sm text-muted/70 mt-0.5">You've got these covered</p>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-2 sm:gap-3">
            <SkillTags skills={result.matched_skills} variant="matched" />
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="card-surface p-8 sm:p-10"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">🎯</span>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white">Skill Gaps</h2>
              <p className="text-sm text-muted/70 mt-0.5">Prioritized learning targets</p>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-2 sm:gap-3">
            <SkillTags skills={result.gap_skills.map((gap) => gap.skill)} gapSkills={result.gap_skills} variant="gap" />
          </div>
        </motion.div>
      </div>

      {/* Skill coverage radar */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.45 }}
        className="card-surface p-8 sm:p-10"
      >
        <div className="flex items-center gap-3 mb-6">
          <span className="text-2xl">📊</span>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white">Skill Coverage Analysis</h2>
            <p className="text-sm text-muted/70 mt-0.5">Domain-by-domain comparison</p>
          </div>
        </div>
        <div className="mt-8">
          <SkillRadarChart resumeSkills={result.resume_skills} requiredSkills={result.required_skills} />
        </div>
      </motion.div>

      {/* Learning plan */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="card-surface p-8 sm:p-10"
      >
        <LearningPlan learningPlan={result.learning_plan} />
      </motion.div>
    </motion.section>
  )
}
