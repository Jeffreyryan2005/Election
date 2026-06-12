'use client'

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts'

interface SkillRadarChartProps {
  resumeSkills: string[]
  requiredSkills: string[]
}

const categories = [
  { key: 'frontend', label: 'Frontend' },
  { key: 'backend', label: 'Backend' },
  { key: 'devops', label: 'DevOps' },
  { key: 'tools', label: 'Tools' },
  { key: 'soft', label: 'Soft Skills' },
  { key: 'domain', label: 'Domain' },
]

const categoryMap: Record<string, string> = {
  react: 'frontend',
  next: 'frontend',
  javascript: 'frontend',
  typescript: 'frontend',
  html: 'frontend',
  css: 'frontend',
  python: 'backend',
  flask: 'backend',
  node: 'backend',
  express: 'backend',
  api: 'backend',
  rest: 'backend',
  sql: 'backend',
  postgres: 'backend',
  docker: 'devops',
  kubernetes: 'devops',
  'ci/cd': 'devops',
  github: 'devops',
  aws: 'devops',
  azure: 'devops',
  githubactions: 'devops',
  jira: 'tools',
  slack: 'tools',
  figma: 'tools',
  git: 'tools',
  collaboration: 'soft',
  communication: 'soft',
  leadership: 'soft',
  problem: 'soft',
  teamwork: 'soft',
  agile: 'soft',
  product: 'domain',
  financial: 'domain',
  saas: 'domain',
  healthcare: 'domain',
}

function scoreCategory(skills: string[], categoryKey: string) {
  const normalized = skills.map((skill) => skill.toLowerCase())
  const matches = normalized.filter((skill) => {
    for (const key in categoryMap) {
      if (categoryMap[key] === categoryKey && skill.includes(key)) {
        return true
      }
    }
    return false
  })
  return Math.min(5, matches.length) * 20
}

export default function SkillRadarChart({ resumeSkills, requiredSkills }: SkillRadarChartProps) {
  const data = categories.map((category) => ({
    category: category.label,
    'Your Skills': scoreCategory(resumeSkills, category.key),
    Required: scoreCategory(requiredSkills, category.key),
    fullMark: 100,
  }))

  return (
    <div className="h-[420px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} cx="50%" cy="50%" outerRadius="70%">
          <PolarGrid stroke="#1E1E2E" />
          <PolarAngleAxis dataKey="category" tick={{ fill: '#94A3B8', fontSize: 12 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tickCount={5} tick={{ fill: '#94A3B8', fontSize: 10 }} />
          <Radar name="Your Skills" dataKey="Your Skills" stroke="#6366F1" fill="#6366F1" fillOpacity={0.4} />
          <Radar name="Required" dataKey="Required" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.4} />
          <Tooltip contentStyle={{ backgroundColor: '#111118', borderColor: '#2B2B3B', color: '#F8FAFC' }} />
          <Legend wrapperStyle={{ color: '#94A3B8', top: 0, left: '50%', transform: 'translateX(-50%)' }} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
