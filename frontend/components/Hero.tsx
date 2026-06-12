'use client'

import { motion } from 'framer-motion'

export default function Hero() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
      className="relative rounded-[2.5rem] border border-border bg-gradient-to-br from-surface via-surface to-black/40 px-6 py-12 shadow-glow sm:px-12 sm:py-16 overflow-hidden"
    >
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-accent/5 via-transparent to-purple-500/5 opacity-40 pointer-events-none rounded-[2.5rem]" />
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="relative z-10">
        <motion.span
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="badge-glow"
        >
          ⚡ Powered by LLaMA 3.3 70B
        </motion.span>
        
        <div className="mt-10 max-w-4xl">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.3 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight tracking-tight text-white"
          >
            Know Your Gaps.
            <br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent animate-glow-pulse">
              Own Your Growth.
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.4 }}
            className="mt-8 max-w-2xl text-lg sm:text-xl leading-relaxed text-muted font-light"
          >
            Paste your resume and job description. SkillForge AI analyzes your skill gaps and builds a personalized 30-day learning plan—all free.
          </motion.p>
        </div>
      </div>
    </motion.section>
  )
}
