import { useState, useEffect } from 'react'
import { useLogs } from '../../../context/LogsContext'
import { useProfile } from '../../../context/ProfileContext'
import LoadingSpinner from '../../../components/ui/LoadingSpinner'
import PageHeader from '../../../components/ui/PageHeader'
import Card from '../../../components/ui/Card'
import { Calendar, ChevronLeft, ChevronRight, Footprints, Flame, Moon, Dumbbell } from 'lucide-react'

const dayColors = {
  0: 'bg-gray-100 dark:bg-gray-800',
  25: 'bg-green-200 dark:bg-green-900',
  50: 'bg-green-300 dark:bg-green-700',
  75: 'bg-green-400 dark:bg-green-600',
  100: 'bg-green-500 dark:bg-green-500',
}

function getColor(value: number, max: number) {
  const pct = Math.min(value / max, 1)
  if (pct === 0) return dayColors[0]
  if (pct <= 0.25) return dayColors[25]
  if (pct <= 0.5) return dayColors[50]
  if (pct <= 0.75) return dayColors[75]
  return dayColors[100]
}

export default function History() {
  const { logs, loading: logsLoading, fetchLogs } = useLogs()
  const { profile, loading: profileLoading, fetchProfile } = useProfile()

  useEffect(() => {
    fetchLogs()
    fetchProfile()
  }, [fetchLogs, fetchProfile])

  const loading = logsLoading || profileLoading
  const today = new Date()
  const [currentMonth, setCurrentMonth] = useState(today.getMonth())
  const [currentYear, setCurrentYear] = useState(today.getFullYear())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  if (loading) return <LoadingSpinner />

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay()
  const monthName = new Date(currentYear, currentMonth).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  const days = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    const log = logs.find((l) => l.date === dateStr)
    return { day, dateStr, log }
  })

  const selectedLog = selectedDate
    ? logs.find((l) => l.date === selectedDate)
    : null

  return (
    <div className="space-y-6 md:space-y-8">
      <PageHeader title="History" subtitle="Browse your activity by date" />

      <Card>
        <div className="flex items-center justify-between mb-6">
          <button onClick={prevMonth} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
            <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-green-600 dark:text-green-400" />
            <span className="text-base md:text-lg font-semibold text-gray-900 dark:text-gray-100">{monthName}</span>
          </div>
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            disabled={currentMonth === today.getMonth() && currentYear === today.getFullYear()}
          >
            <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 md:gap-2 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
            <div key={d} className="text-center text-xs font-medium text-gray-500 dark:text-gray-400 py-1">
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1 md:gap-2">
          {Array.from({ length: firstDayOfWeek }, (_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {days.map(({ day, dateStr, log }) => (
            <button
              key={dateStr}
              onClick={() => setSelectedDate(dateStr)}
              className={`aspect-square rounded-lg text-xs md:text-sm font-medium transition-all flex items-center justify-center ${
                selectedDate === dateStr
                  ? 'ring-2 ring-green-500 ring-offset-2 dark:ring-offset-gray-900'
                  : ''
              } ${
                log
                  ? `${getColor(log.steps, profile?.dailyStepGoal || 10000)} text-gray-900 dark:text-white hover:scale-105`
                  : 'bg-gray-50 dark:bg-gray-800/50 text-gray-400 dark:text-gray-600'
              }`}
            >
              {day}
            </button>
          ))}
        </div>
      </Card>

      {selectedLog && profile && (
        <Card>
          <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            {new Date(selectedLog.date).toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
            <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-center">
              <Footprints className="w-5 h-5 text-blue-600 dark:text-blue-400 mx-auto mb-1" />
              <p className="text-lg md:text-xl font-bold text-blue-600 dark:text-blue-400">{selectedLog.steps.toLocaleString()}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Steps</p>
            </div>
            <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-900/30 text-center">
              <Flame className="w-5 h-5 text-orange-600 dark:text-orange-400 mx-auto mb-1" />
              <p className="text-lg md:text-xl font-bold text-orange-600 dark:text-orange-400">{selectedLog.caloriesBurned}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Calories</p>
            </div>
            <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-900/30 text-center">
              <Moon className="w-5 h-5 text-purple-600 dark:text-purple-400 mx-auto mb-1" />
              <p className="text-lg md:text-xl font-bold text-purple-600 dark:text-purple-400">{selectedLog.sleepHours}h</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Sleep</p>
            </div>
            <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/30 text-center">
              <Dumbbell className="w-5 h-5 text-green-600 dark:text-green-400 mx-auto mb-1" />
              <p className="text-lg md:text-xl font-bold text-green-600 dark:text-green-400">{selectedLog.workouts.length}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Workouts</p>
            </div>
          </div>
          {selectedLog.workouts.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Workout highlights:</p>
              {selectedLog.workouts[0].exercises.map((ex, i) => (
                <span
                  key={i}
                  className="inline-block bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs px-2 py-1 rounded-full mr-1 mb-1"
                >
                  {ex.name}
                </span>
              ))}
            </div>
          )}
        </Card>
      )}
    </div>
  )
}
