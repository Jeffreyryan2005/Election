'use client'

import { motion } from 'framer-motion'

interface ReasoningStepsProps {
  isVisible: boolean
}

const steps = [
  'Parsing your resume...',
  'Extracting job requirements...',
  'Running skill gap analysis...',
  'Calculating match score...',
  "Building your 30-day learning plan..."
]

export default function ReasoningSteps({ isVisible }: ReasoningStepsProps) {
  if (!isVisible) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="mb-6 rounded-xl border-l-4 border-indigo-500/50 bg-gradient-to-r from-slate-900/80 to-slate-900/40 p-6 backdrop-blur-sm"
    >
      <div className="space-y-4">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.6, duration: 0.4 }}
            className="flex items-center gap-3"
          >
            {/* Spinner or Checkmark */}
            <motion.div className="relative h-5 w-5 flex-shrink-0">
              {/* Spinner (always present but animated based on completion) */}
              <motion.svg
                className="absolute inset-0 text-indigo-500"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <circle cx="12" cy="12" r="10" strokeOpacity={0.25} />
                <path d="M12 2a10 10 0 0 1 10 10" strokeOpacity={0.75} strokeLinecap="round" />
              </motion.svg>

              {/* Checkmark (fades in after step completes) */}
              <motion.svg
                className="absolute inset-0 text-emerald-500"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  delay: index * 0.6 + 0.5,
                  duration: 0.3,
                  type: 'spring',
                  stiffness: 200
                }}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={3}
              >
                <polyline points="20 6 9 17 4 12" />
              </motion.svg>
            </motion.div>

            {/* Step Text */}
            <span className="text-sm font-medium text-white">{step}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
