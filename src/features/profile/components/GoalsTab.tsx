import { Target, Footprints, Flame, Droplets, Moon, Beef, Wheat, Droplet, Heart, Calendar, TrendingUp, Dumbbell, History, CheckCircle, XCircle, Save } from 'lucide-react'
import Card from '../../../components/ui/Card'
import SectionHeader from '../../../components/ui/SectionHeader'
import type { UserProfile } from '../../../types'

interface GoalsTabProps {
  form: UserProfile
  updateForm: (path: string, value: unknown) => void
  handleSaveForm: () => void
  saving?: boolean
}

export default function GoalsTab({ form, updateForm, handleSaveForm, saving }: GoalsTabProps) {
  const goals = [
    { label: 'Daily Steps', value: form.dailyStepGoal, key: 'dailyStepGoal', format: (v: number) => v?.toLocaleString(), icon: Footprints },
    { label: 'Daily Calories', value: form.dailyCalorieGoal, key: 'dailyCalorieGoal', format: (v: number) => v, icon: Flame },
    { label: 'Water Goal', value: `${form.waterGoal} cups`, key: 'waterGoal', format: null, icon: Droplets },
    { label: 'Sleep Goal', value: `${form.sleepGoal} hours`, key: 'sleepGoal', format: null, icon: Moon },
  ]

  const macroGoals = [
    { label: 'Protein', value: form.goals?.macros?.protein, unit: 'g', key: 'protein', icon: Beef },
    { label: 'Carbs', value: form.goals?.macros?.carbs, unit: 'g', key: 'carbs', icon: Wheat },
    { label: 'Fat', value: form.goals?.macros?.fat, unit: 'g', key: 'fat', icon: Droplet },
  ]

  const computeWeeklyRate = () => {
    if (!form.goals?.targetDate || !form.weight || !form.goals?.targetWeight) return null
    const target = new Date(form.goals.targetDate)
    const today = new Date()
    const diffMs = target.getTime() - today.getTime()
    const weeks = diffMs / (1000 * 60 * 60 * 24 * 7)
    if (weeks <= 0) return null
    const rateVal = ((form.weight - form.goals.targetWeight) / weeks)
    const rate = Math.abs(rateVal).toFixed(1)
    return { weeks: Math.round(weeks), rate, direction: rateVal >= 0 ? 'lose' : 'gain' }
  }

  const weeklyRate = computeWeeklyRate()

  return (
    <div className="space-y-6">
      <Card>
        <SectionHeader Icon={Target} title="Daily Goals" color="orange" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {goals.map(({ label, value, key, format, icon: Icon }) => (
            <div key={key} className="text-center p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
              <Icon className="w-5 h-5 mx-auto mb-1 text-gray-400 dark:text-gray-500" />
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {format ? format(value) : value}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{label}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <SectionHeader Icon={Beef} title="Macro Targets" color="amber" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {macroGoals.map(({ label, value, unit, key, icon: Icon }) => (
            <div key={key} className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
              <Icon className="w-5 h-5 text-gray-400 dark:text-gray-500 mb-2" />
              <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
              <div className="flex items-baseline gap-1 mt-1">
                <input
                  type="number"
                  value={value || ''}
                  onChange={(e) => updateForm(`goals.macros.${key}`, Number(e.target.value))}
                  className="w-20 text-lg font-bold text-gray-900 dark:text-gray-100 bg-transparent border-b border-gray-300 dark:border-gray-600 focus:border-green-500 outline-none"
                />
                <span className="text-sm text-gray-500 dark:text-gray-400">{unit}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <SectionHeader Icon={Calendar} title="Target Date" color="cyan" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Target Date</label>
            <input
              type="date"
              value={form.goals?.targetDate || ''}
              onChange={(e) => updateForm('goals.targetDate', e.target.value || null)}
              className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Target Weight ({form.unitSystem === 'imperial' ? 'lb' : 'kg'})</label>
            <input
              type="number"
              value={form.goals?.targetWeight || ''}
              onChange={(e) => updateForm('goals.targetWeight', Number(e.target.value))}
              className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
            />
          </div>
        </div>
        {weeklyRate && (
          <div className="mt-4 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
              <span className="text-gray-700 dark:text-gray-300">
                {weeklyRate.direction === 'lose' ? 'Lose' : 'Gain'} <strong>{weeklyRate.rate} kg/week</strong> over {weeklyRate.weeks} weeks
              </span>
            </div>
          </div>
        )}
      </Card>

      <Card>
        <SectionHeader Icon={Dumbbell} title="Additional Goals" color="indigo" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              <Heart className="w-4 h-4 inline mr-1" />
              Body Fat %
            </label>
            <input
              type="number" step="0.1"
              value={form.goals?.bodyFatPercent ?? ''}
              onChange={(e) => updateForm('goals.bodyFatPercent', e.target.value ? Number(e.target.value) : null)}
              placeholder="Not set"
              className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              <Heart className="w-4 h-4 inline mr-1" />
              Resting HR (bpm)
            </label>
            <input
              type="number"
              value={form.goals?.restingHR ?? ''}
              onChange={(e) => updateForm('goals.restingHR', e.target.value ? Number(e.target.value) : null)}
              placeholder="Not set"
              className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              <Dumbbell className="w-4 h-4 inline mr-1" />
              Workouts / Week
            </label>
            <input
              type="number"
              value={form.goals?.workoutsPerWeek || ''}
              onChange={(e) => updateForm('goals.workoutsPerWeek', Number(e.target.value))}
              className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
            />
          </div>
        </div>
      </Card>

      <div className="flex justify-end">
        <button
          onClick={handleSaveForm}
          disabled={saving}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          Save Goals
        </button>
      </div>

      {form.goals?.history?.length > 0 && (
        <Card>
          <SectionHeader Icon={History} title="Goal History" color="rose" />
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {[...form.goals.history].reverse().map((entry, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                <div className="flex items-center gap-3">
                  {entry.hit ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 capitalize">{entry.type} goal</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{entry.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-900 dark:text-gray-100">
                    {entry.achieved} {entry.type === 'workouts' ? 'days' : 'kg'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Target: {entry.target}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
