import { useEffect } from 'react'
import { useLogs } from '../../../context/LogsContext'
import LoadingSpinner from '../../../components/ui/LoadingSpinner'
import PageHeader from '../../../components/ui/PageHeader'
import WeightChart from '../components/WeightChart'
import CalorieChart from '../components/CalorieChart'
import StepsChart from '../components/StepsChart'
import SleepChart from '../components/SleepChart'

export default function Progress() {
  const { logs, loading, fetchLogs } = useLogs()

  useEffect(() => {
    fetchLogs()
  }, [fetchLogs])

  if (loading) return <LoadingSpinner />

  const chartData = logs.map((l) => ({
    date: l.date,
    weight: l.weight,
    caloriesBurned: l.caloriesBurned,
    caloriesConsumed: l.caloriesConsumed,
    steps: l.steps,
    sleepHours: l.sleepHours,
  }))

  return (
    <div className="space-y-6 md:space-y-8">
      <PageHeader title="Progress & Charts" subtitle="Visualize your fitness journey" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <WeightChart data={chartData} />
        <CalorieChart data={chartData} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <StepsChart data={chartData} />
        <SleepChart data={chartData} />
      </div>
    </div>
  )
}
