'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

interface MatchScoreCircleProps {
  score: number
}

export default function MatchScoreCircle({ score }: MatchScoreCircleProps) {
  const progress = Math.min(Math.max(score, 0), 100)
  const [displayScore, setDisplayScore] = useState(0)

  useEffect(() => {
    setDisplayScore(0)
    const duration = 1500
    const startTime = Date.now()
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime
      const easeProgress = elapsed / duration
      if (easeProgress >= 1) {
        setDisplayScore(progress)
        clearInterval(interval)
      } else {
        const easeOut = 1 - Math.pow(1 - easeProgress, 3)
        setDisplayScore(Math.round(progress * easeOut))
      }
    }, 16)
    return () => clearInterval(interval)
  }, [progress])

  const strokeColor = progress >= 75 ? '#0FD084' : progress >= 50 ? '#00D4FF' : progress >= 25 ? '#FFB038' : '#FF4757'
  const circumference = 2 * Math.PI * 80
  const dashOffset = circumference - (progress / 100) * circumference

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="flex flex-col items-center justify-center text-center"
    >
      <div className="relative group">
        {/* Glow background */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-accent/20 to-purple-500/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <svg width="220" height="220" className="relative z-10" aria-hidden="true">
          {/* Background circle */}
          <circle 
            cx="110" 
            cy="110" 
            r="90" 
            stroke="#1A1F2E" 
            strokeWidth="16" 
            fill="transparent"
            opacity="0.5"
          />
          
          {/* Animated progress circle */}
          <motion.circle
            cx="110"
            cy="110"
            r="90"
            stroke={strokeColor}
            strokeWidth="16"
            fill="transparent"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            transform="rotate(-90 110 110)"
            style={{
              filter: `drop-shadow(0 0 20px ${strokeColor})`,
            }}
          />
          
          {/* Accent glow circle */}
          <circle 
            cx="110" 
            cy="110" 
            r="88" 
            stroke={strokeColor} 
            strokeWidth="2" 
            fill="transparent" 
            opacity="0.3"
          />
        </svg>

        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className="text-center">
            <div className="text-6xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              {displayScore}
              <span className="text-3xl ml-1">%</span>
            </div>
            <p className="mt-3 text-xs uppercase tracking-[0.15em] text-muted font-semibold">Profile Match</p>
            <p className="mt-2 text-[11px] text-muted/70 font-medium">
              {progress >= 75 ? '🚀 Excellent fit' : progress >= 50 ? '✓ Good potential' : progress >= 25 ? '⚡ Room to grow' : '📈 Strong opportunity'}
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
