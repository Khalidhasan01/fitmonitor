import { useMemo } from 'react'
import Card from '../../../components/ui/Card'
import { Trophy } from 'lucide-react'
import type { DailyLog } from '../../../types'

interface PersonalRecord {
  exerciseName: string
  muscleGroup: string
  weight: number
  reps: number
  date: string
  isNew: boolean
}

function isWithinDays(dateStr: string, days: number): boolean {
  const then = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - then.getTime()
  return diffMs >= 0 && diffMs < days * 86400000
}

interface Props {
  logs: DailyLog[]
}

export default function PersonalRecords({ logs }: Props) {
  const records = useMemo(() => {
    const best = new Map<string, { weight: number; reps: number; date: string; muscleGroup: string }>()

    for (const log of logs) {
      for (const workout of log.workouts) {
        for (const exercise of workout.exercises) {
          for (const set of exercise.sets) {
            if (!set.weight || !set.reps) continue
            const existing = best.get(exercise.name)
            if (
              !existing ||
              set.weight > existing.weight ||
              (set.weight === existing.weight && set.reps > existing.reps)
            ) {
              best.set(exercise.name, {
                weight: set.weight,
                reps: set.reps,
                date: workout.date,
                muscleGroup: exercise.muscleGroup,
              })
            }
          }
        }
      }
    }

    const recordList: PersonalRecord[] = []
    for (const [exerciseName, data] of best) {
      recordList.push({
        exerciseName,
        muscleGroup: data.muscleGroup,
        weight: data.weight,
        reps: data.reps,
        date: data.date,
        isNew: isWithinDays(data.date, 7),
      })
    }

    recordList.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    return recordList.slice(0, 5)
  }, [logs])

  if (records.length === 0) return null

  return (
    <Card>
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="w-5 h-5 text-amber-500" />
        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">Personal Records</h3>
      </div>
      <div className="space-y-3">
        {records.map((pr) => (
          <div
            key={pr.exerciseName}
            className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0"
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{pr.exerciseName}</p>
                {pr.isNew && (
                  <span className="text-[10px] font-semibold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-1.5 py-0.5 rounded-full">
                    NEW PR
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {pr.muscleGroup} · {new Date(pr.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </p>
            </div>
            <div className="text-right ml-4 flex-shrink-0">
              <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
                {pr.weight}kg
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{pr.reps} reps</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
