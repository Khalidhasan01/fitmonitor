import { useMemo } from 'react'
import type { DailyLog } from '../types'

export function useActivityStreak(logs: DailyLog[]): number {
  return useMemo(() => {
    let streak = 0
    for (let i = logs.length - 1; i >= 0; i--) {
      if (logs[i].workouts.length > 0) streak++
      else break
    }
    return streak
  }, [logs])
}
