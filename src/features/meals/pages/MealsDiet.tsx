import { useState, useEffect } from 'react'
import { useLogs } from '../../../context/LogsContext'
import { useSuggestions } from '../../../context/SuggestionsContext'
import LoadingSpinner from '../../../components/ui/LoadingSpinner'
import PageHeader from '../../../components/ui/PageHeader'
import Card from '../../../components/ui/Card'
import TabButton from '../../../components/ui/TabButton'
import {
  Apple,
  Sunrise,
  Sun,
  Moon,
  Cookie,
  Lightbulb,
  Droplets,
} from 'lucide-react'

const mealIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  breakfast: Sunrise,
  lunch: Sun,
  dinner: Moon,
  snack: Cookie,
}

const mealColors: Record<string, string> = {
  breakfast: 'bg-orange-50 text-orange-600 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800',
  lunch: 'bg-yellow-50 text-yellow-600 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800',
  dinner: 'bg-indigo-50 text-indigo-600 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-400 dark:border-indigo-800',
  snack: 'bg-pink-50 text-pink-600 border-pink-200 dark:bg-pink-900/30 dark:text-pink-400 dark:border-pink-800',
}

export default function MealsDiet() {
  const { logs, loading: logsLoading, fetchLogs } = useLogs()
  const { suggestions, loading: suggestionsLoading, fetchSuggestions } = useSuggestions()

  useEffect(() => {
    fetchLogs()
    fetchSuggestions()
  }, [fetchLogs, fetchSuggestions])

  const loading = logsLoading || suggestionsLoading
  const [selectedTab, setSelectedTab] = useState('meals')

  if (loading) return <LoadingSpinner />

  const latest = logs[logs.length - 1]
  if (!latest) return null

  const totalProtein = latest.meals.reduce((s: number, m: { protein: number }) => s + m.protein, 0)
  const totalCarbs = latest.meals.reduce((s: number, m: { carbs: number }) => s + m.carbs, 0)
  const totalFat = latest.meals.reduce((s: number, m: { fat: number }) => s + m.fat, 0)

  return (
    <div className="space-y-6 md:space-y-8">
      <PageHeader title="Meals & Diet" subtitle="Track your nutrition and get suggestions" />

      <div className="flex gap-2">
        <TabButton active={selectedTab === 'meals'} onClick={() => setSelectedTab('meals')}>Today's Meals</TabButton>
        <TabButton active={selectedTab === 'suggestions'} onClick={() => setSelectedTab('suggestions')}>Suggestions</TabButton>
      </div>

      {selectedTab === 'meals' && (
        <>
          <Card>
            <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Daily Nutrition Summary</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
              <div className="text-center p-4 rounded-lg bg-blue-50 dark:bg-blue-900/30">
                <p className="text-xl md:text-2xl font-bold text-blue-600 dark:text-blue-400">{latest.caloriesConsumed}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Calories</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-red-50 dark:bg-red-900/30">
                <p className="text-xl md:text-2xl font-bold text-red-600 dark:text-red-400">{totalProtein}g</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Protein</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/30">
                <p className="text-xl md:text-2xl font-bold text-yellow-600 dark:text-yellow-400">{totalCarbs}g</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Carbs</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-orange-50 dark:bg-orange-900/30">
                <p className="text-xl md:text-2xl font-bold text-orange-600 dark:text-orange-400">{totalFat}g</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Fat</p>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {latest.meals.map((meal: { type: string; calories: number; name: string; protein: number; carbs: number; fat: number }, i: number) => {
              const Icon = mealIcons[meal.type] || Apple
              const colorClass = mealColors[meal.type] || 'bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700'
              return (
                <Card key={i} className={colorClass.split(' ')[2]}>
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${colorClass}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 capitalize truncate">
                          {meal.type}
                        </p>
                        <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">{meal.calories} kcal</span>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{meal.name}</p>
                      <div className="flex gap-3 mt-2 text-xs text-gray-500 dark:text-gray-400">
                        <span>P: {meal.protein}g</span>
                        <span>C: {meal.carbs}g</span>
                        <span>F: {meal.fat}g</span>
                      </div>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </>
      )}

      {selectedTab === 'suggestions' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          {suggestions.map((s, i) => (
            <Card key={i} className="hover:shadow-md dark:hover:shadow-gray-900/50 transition-shadow">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                  <Lightbulb className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{s.title}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{s.description}</p>
                </div>
              </div>
            </Card>
          ))}
          <Card className="bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 border-green-200 dark:border-green-800 md:col-span-2">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                <Droplets className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Quick Tip</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Try to eat protein with every meal to maintain muscle mass.
                  Current intake: {totalProtein}g today —{' '}
                  {totalProtein >= 100 ? 'great job!' : `aim for at least 100g.`}
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
