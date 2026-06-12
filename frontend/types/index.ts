export interface GapSkill {
  skill: string
  priority: 'high' | 'medium' | 'low'
  reason: string
}

export interface Task {
  day_range: string
  task: string
  resource: string
  resource_url: string
  type: 'video' | 'course' | 'docs' | 'practice'
}

export interface WeekPlan {
  week: number
  title: string
  skills: string[]
  tasks: Task[]
}

export interface AnalysisResult {
  resume_skills: string[]
  required_skills: string[]
  matched_skills: string[]
  gap_skills: GapSkill[]
  match_score: number
  learning_plan: WeekPlan[]
  summary: string
}
