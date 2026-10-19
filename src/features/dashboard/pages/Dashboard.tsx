import { useEffect } from 'react'
import { useLogs } from '../../../context/LogsContext'
import { useProfile } from '../../../context/ProfileContext'
import { useSuggestions } from '../../../context/SuggestionsContext'
import StatCard from '../../../components/ui/StatCard'
import ProgressRing from '../../../components/ui/ProgressRing'
import LoadingSpinner from '../../../components/ui/LoadingSpinner'
import PageHeader from '../../../components/ui/PageHeader'
import Card from '../../../components/ui/Card'
import { useUnitConversion } from '../../../hooks/useUnitConversion'
import {
  Footprints,
  Flame,
  Heart,
  Moon,
  Droplets,
  Weight,
  Apple,
  TrendingUp,
} from 'lucide-react'

export default function Dashboard() {
  const { logs, loading: logsLoading, fetchLogs } = useLogs()
  const { profile, loading: profileLoading, fetchProfile } = useProfile()
  const { suggestions, loading: suggestionsLoading, fetchSuggestions } = useSuggestions()

  const u = useUnitConversion(profile?.unitSystem)

  useEffect(() => {
    fetchLogs()
    fetchProfile()
    fetchSuggestions()
  }, [fetchLogs, fetchProfile, fetchSuggestions])

  const loading = logsLoading || profileLoading || suggestionsLoading

  if (loading) return <LoadingSpinner />

  const latest = logs[logs.length - 1]
  if (!latest || !profile) return null
  const weekLogs = logs.slice(-7)
  const avgSteps = Math.round(weekLogs.reduce((s, l) => s + l.steps, 0) / weekLogs.length)
  const totalWorkouts = logs.reduce((s, l) => s + l.workouts.length, 0)

  return (
    <div className="space-y-6 md:space-y-8">
      <PageHeader title="Dashboard" subtitle="Your fitness overview" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <StatCard
          Icon={Footprints}
          label="Steps Today"
          value={latest.steps.toLocaleString()}
          unit={`/ ${profile.dailyStepGoal.toLocaleString()}`}
          subtext={`Avg: ${avgSteps.toLocaleString()}`}
          color="blue"
        />
        <StatCard
          Icon={Flame}
          label="Calories Burned"
          value={latest.caloriesBurned}
          unit="kcal"
          subtext={`${Math.round((latest.caloriesBurned / profile.dailyCalorieGoal) * 100)}% of goal`}
          color="orange"
        />
        <StatCard
          Icon={Heart}
          label="Heart Rate"
          value={latest.heartRateAvg}
          unit="bpm"
          subtext="Resting average"
          color="red"
        />
        <StatCard
          Icon={Moon}
          label="Sleep"
          value={latest.sleepHours}
          unit="hours"
          subtext={`Goal: ${profile.sleepGoal}h`}
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <StatCard
          Icon={Droplets}
          label="Water"
          value={latest.waterCups}
          unit="cups"
          subtext={`Goal: ${profile.waterGoal} cups`}
          color="teal"
        />
        <StatCard
          Icon={Weight}
          label="Weight"
          value={u.formatWeightValue(latest.weight)}
          unit={u.weightUnit}
          subtext={`Goal: ${u.formatWeight(profile.goalWeight)}`}
          color="green"
        />
        <StatCard
          Icon={Apple}
          label="Calories Eaten"
          value={latest.caloriesConsumed}
          unit="kcal"
          subtext={`Net: ${latest.caloriesConsumed - latest.caloriesBurned} kcal`}
          color="pink"
        />
        <StatCard
          Icon={TrendingUp}
          label="Workouts"
          value={totalWorkouts}
          unit="total"
          subtext={`${logs.filter((l) => l.workouts.length > 0).length} active days`}
          color="indigo"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <Card>
          <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Daily Progress</h3>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 md:gap-4">
            <ProgressRing
              value={Math.round((latest.steps / profile.dailyStepGoal) * 100)}
              max={100}
              label="Steps"
              color="text-blue-500"
            />
            <ProgressRing
              value={Math.round((latest.caloriesBurned / profile.dailyCalorieGoal) * 100)}
              max={100}
              label="Calories"
              color="text-orange-500"
            />
            <ProgressRing
              value={Math.round((latest.sleepHours / profile.sleepGoal) * 100)}
              max={100}
              label="Sleep"
              color="text-purple-500"
            />
            <ProgressRing
              value={Math.round((latest.waterCups / profile.waterGoal) * 100)}
              max={100}
              label="Water"
              color="text-teal-500"
            />
            <ProgressRing
              value={Math.round(((profile.weight - latest.weight) / (profile.weight - profile.goalWeight)) * 100)}
              max={100}
              label="Weight Goal"
              color="text-green-500"
            />
          </div>
        </Card>

        <Card>
          <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Suggestions</h3>
          <div className="space-y-3">
            {suggestions.slice(0, 4).map((s, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{s.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{s.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {latest.workouts.length > 0 && (
        <Card>
          <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Latest Workout</h3>
          <div className="space-y-3">
            {latest.workouts[0].exercises.map((ex, i) => (
              <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0 gap-1">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{ex.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{ex.muscleGroup}</p>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {ex.sets.length} sets
                  {ex.sets[0]?.reps && ` · ${ex.sets[0].reps} reps`}
                  {ex.sets[0]?.weight && ` @ ${ex.sets[0].weight}kg`}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
