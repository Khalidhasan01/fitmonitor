import { useMemo } from 'react'
import { useActivityStreak } from '../../../hooks/useActivityStreak'
import StatCard from '../../../components/ui/StatCard'
import { Dumbbell, Zap, TrendingUp, Clock } from 'lucide-react'
import type { DailyLog, UserProfile } from '../../../types'

function getWeekBounds() {
  const now = new Date()
  const dayOfWeek = now.getDay()
  const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1
  const monday = new Date(now)
  monday.setDate(now.getDate() - diff)
  monday.setHours(0, 0, 0, 0)
  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)
  return { monday, sunday }
}

function daysAgo(dateStr: string): string {
  const then = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - then.getTime()
  const diffDays = Math.floor(diffMs / 86400000)
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  return `${diffDays} days ago`
}

interface Props {
  logs: DailyLog[]
  profile: UserProfile | null
}

export default function SummaryBar({ logs, profile }: Props) {
  const streak = useActivityStreak(logs)
  const weeklyGoal = profile?.goals?.workoutsPerWeek ?? 5

  const { thisWeekWorkouts, weeklyVolume } = useMemo(() => {
    const { monday, sunday } = getWeekBounds()
    let count = 0
    let volume = 0
    for (const log of logs) {
      const logDate = new Date(log.date)
      if (logDate >= monday && logDate <= sunday) {
        for (const w of log.workouts) {
          count++
          for (const ex of w.exercises) {
            for (const set of ex.sets) {
              if (set.weight && set.reps) {
                volume += set.weight * set.reps
              }
            }
          }
        }
      }
    }
    return { thisWeekWorkouts: count, weeklyVolume: volume }
  }, [logs])

  const lastWorkoutDate = useMemo(() => {
    let latest: string | null = null
    for (const log of logs) {
      for (const w of log.workouts) {
        if (!latest || w.date > latest) latest = w.date
      }
    }
    return latest
  }, [logs])

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
      <StatCard
        Icon={Dumbbell}
        label="Workouts This Week"
        value={thisWeekWorkouts}
        unit={`/ ${weeklyGoal}`}
        subtext={thisWeekWorkouts >= weeklyGoal ? 'Goal reached!' : `${weeklyGoal - thisWeekWorkouts} more to goal`}
        color="green"
      />
      <StatCard
        Icon={Zap}
        label="Current Streak"
        value={streak}
        unit="days"
        subtext={streak === 0 ? 'Start a new streak!' : streak === 1 ? 'Yesterday' : `${streak} day streak`}
        color="orange"
      />
      <StatCard
        Icon={TrendingUp}
        label="Volume This Week"
        value={weeklyVolume.toLocaleString()}
        unit="kg"
        subtext="Total weight lifted"
        color="blue"
      />
      <StatCard
        Icon={Clock}
        label="Last Workout"
        value={lastWorkoutDate ? daysAgo(lastWorkoutDate) : 'Never'}
        unit=""
        subtext={lastWorkoutDate ? new Date(lastWorkoutDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''}
        color="purple"
      />
    </div>
  )
}
