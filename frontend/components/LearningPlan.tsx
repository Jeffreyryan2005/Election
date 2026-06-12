'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import type { WeekPlan } from '@/types'

interface LearningPlanProps {
  learningPlan: WeekPlan[]
}

const typeIcons: Record<string, string> = {
  video: '🎬',
  course: '📚',
  docs: '📖',
  practice: '💻',
}

const typeColors: Record<string, string> = {
  video: 'from-blue-500/20 to-cyan-500/10 border-blue-500/30',
  course: 'from-purple-500/20 to-pink-500/10 border-purple-500/30',
  docs: 'from-amber-500/20 to-orange-500/10 border-amber-500/30',
  practice: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30',
}

export default function LearningPlan({ learningPlan }: LearningPlanProps) {
  const [openWeek, setOpenWeek] = useState<number>(1)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white">30-Day Learning Plan</h2>
        <p className="mt-2 text-base text-muted font-light">Structured weekly goals and daily resources to close your top skill gaps.</p>
      </div>
      
      <div className="space-y-4">
        {learningPlan.map((week, weekIndex) => {
          const isOpen = openWeek === week.week
          return (
            <motion.div
              key={week.week}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: weekIndex * 0.08 }}
              className="rounded-2xl border border-border bg-gradient-to-br from-surface to-surface/50 shadow-card overflow-hidden transition-all duration-300 hover:shadow-glow-sm"
            >
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={`week-${week.week}`}
                onClick={() => setOpenWeek(isOpen ? 0 : week.week)}
                className="w-full p-6 sm:p-7 text-left hover:bg-white/2 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs uppercase font-semibold text-accent tracking-wider">Week {week.week}</p>
                    <h3 className="mt-2 text-lg sm:text-xl font-semibold text-white">{week.title}</h3>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {week.skills.map((skill) => (
                        <motion.span
                          key={skill}
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ type: 'spring', stiffness: 200 }}
                          className="rounded-full bg-accent/15 border border-accent/30 px-3 py-1 text-xs text-accent font-medium"
                        >
                          {skill}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                    className="mt-1 flex-shrink-0 text-accent/60 text-xl"
                  >
                    ▼
                  </motion.div>
                </div>
              </button>

              <motion.div
                id={`week-${week.week}`}
                initial={false}
                animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="overflow-hidden border-t border-border/50"
              >
                {isOpen ? (
                  <div className="space-y-4 p-6 sm:p-7">
                    {week.tasks.map((task, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: idx * 0.08 }}
                        className={`rounded-xl border ${typeColors[task.type] || 'from-slate-500/10 to-slate-500/5 border-slate-500/20'} bg-gradient-to-br p-5 sm:p-6 backdrop-blur-sm hover:scale-102 transition-all duration-300`}
                      >
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <p className="text-xs uppercase font-semibold text-muted/70 tracking-wider">{task.day_range}</p>
                            <p className="mt-3 text-sm sm:text-base text-white font-medium leading-relaxed">{task.task}</p>
                          </div>
                          <span className="flex-shrink-0 rounded-lg bg-white/5 border border-white/10 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm whitespace-nowrap">
                            {typeIcons[task.type] ?? '📌'} {task.type}
                          </span>
                        </div>
                        <a
                          href={task.resource_url}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-accent hover:text-accent/80 transition-colors group"
                          aria-label={`Open resource ${task.resource}`}
                        >
                          🔗 {task.resource}
                          <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </a>
                      </motion.div>
                    ))}
                  </div>
                ) : null}
              </motion.div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
