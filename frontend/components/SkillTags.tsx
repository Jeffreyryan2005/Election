'use client'

import { motion } from 'framer-motion'
import { useMemo } from 'react'
import type { GapSkill } from '@/types'

interface SkillTagsProps {
  skills: string[]
  variant: 'matched' | 'gap' | 'neutral'
  gapSkills?: GapSkill[]
}

const variantStyles = {
  matched: 'bg-emerald-500/20 text-emerald-100 border border-emerald-500/40 shadow-lg shadow-emerald-500/10',
  gap: 'bg-rose-500/20 text-rose-100 border border-rose-500/40 shadow-lg shadow-rose-500/10',
  neutral: 'bg-slate-500/15 text-slate-100 border border-slate-500/30 shadow-lg shadow-slate-500/5',
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 8, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 100, damping: 12 },
  },
}

export default function SkillTags({ skills, variant, gapSkills = [] }: SkillTagsProps) {
  const gapMap = useMemo(
    () => new Map(gapSkills.map((gap) => [gap.skill.toLowerCase(), gap])),
    [gapSkills]
  )

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="flex flex-wrap gap-2.5"
    >
      {skills.map((skill, index) => {
        const gap = gapMap.get(skill.toLowerCase())
        return (
          <motion.div
            key={`${skill}-${index}`}
            variants={item}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-300 hover:scale-110 cursor-default ${variantStyles[variant]}`}
            aria-label={gap ? `${skill} gap priority ${gap.priority}` : skill}
            whileHover={{ y: -2 }}
          >
            <span className="truncate flex-shrink-0">{skill}</span>
            {gap ? (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.2 + index * 0.05 }}
                className="ml-0.5 inline-flex items-center rounded-full bg-black/30 backdrop-blur-sm px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-white flex-shrink-0 border border-white/10"
              >
                {gap.priority}
              </motion.span>
            ) : null}
            {gap ? (
              <span className="sr-only">Reason: {gap.reason}</span>
            ) : null}
          </motion.div>
        )
      })}
    </motion.div>
  )
}
