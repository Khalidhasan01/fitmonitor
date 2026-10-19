import { useState, useEffect, useMemo } from 'react'
import Card from '../../../components/ui/Card'
import EmptyState from '../../../components/ui/EmptyState'
import { Search, Plus, Dumbbell, X, ChevronDown, ChevronUp } from 'lucide-react'
import { getExercises, searchExercises, createExercise } from '../../../services/api'
import type { DailyLog, ExerciseDefinition } from '../../../types'

interface ExerciseHistory {
  date: string
  sets: { weight: number | null; reps: number | null; duration: number | null }[]
}

interface Props {
  logs: DailyLog[]
}

export default function ExerciseLibrary({ logs }: Props) {
  const [exercises, setExercises] = useState<ExerciseDefinition[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [filterMuscle, setFilterMuscle] = useState('All')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [showCreate, setShowCreate] = useState(false)
  const [newName, setNewName] = useState('')
  const [newMuscle, setNewMuscle] = useState('Other')
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    loadExercises()
  }, [])

  async function loadExercises() {
    setLoading(true)
    try {
      const data = await getExercises()
      setExercises(data)
    } catch {
      setExercises([])
    } finally {
      setLoading(false)
    }
  }

  async function handleSearch(q: string) {
    setQuery(q)
    if (!q.trim()) {
      const data = await getExercises()
      setExercises(data)
      return
    }
    try {
      const data = await searchExercises(q)
      setExercises(data)
    } catch {
      setExercises([])
    }
  }

  async function handleCreate() {
    if (!newName.trim()) return
    setCreating(true)
    try {
      await createExercise({ name: newName.trim(), muscleGroup: newMuscle })
      setNewName('')
      setNewMuscle('Other')
      setShowCreate(false)
      await loadExercises()
    } catch {
      // error
    } finally {
      setCreating(false)
    }
  }

  const muscleGroups = useMemo(() => {
    const groups = new Set(exercises.map((e) => e.muscleGroup))
    return ['All', ...Array.from(groups).sort()]
  }, [exercises])

  const filtered = useMemo(() => {
    let result = exercises
    if (filterMuscle !== 'All') {
      result = result.filter((e) => e.muscleGroup === filterMuscle)
    }
    return result
  }, [exercises, filterMuscle])

  const exerciseHistory = useMemo(() => {
    if (!selectedId) return []
    const history: ExerciseHistory[] = []
    for (const log of logs) {
      for (const workout of log.workouts) {
        const ex = workout.exercises.find((e) => e.exerciseDefinitionId === selectedId)
        if (ex && ex.sets.length > 0) {
          history.push({
            date: workout.date,
            sets: ex.sets.map((s) => ({ weight: s.weight, reps: s.reps, duration: s.duration })),
          })
        }
      }
    }
    history.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    return history
  }, [logs, selectedId])

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search exercises..."
            className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 rounded-lg pl-10 pr-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
          />
        </div>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Create Exercise
        </button>
      </div>

      {showCreate && (
        <Card className="!p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">New Custom Exercise</h4>
            <button onClick={() => setShowCreate(false)} className="p-1 text-gray-400 hover:text-gray-600">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Exercise name"
              className="flex-1 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
            />
            <select
              value={newMuscle}
              onChange={(e) => setNewMuscle(e.target.value)}
              className="border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
            >
              {muscleGroups.filter((g) => g !== 'All').map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
            <button
              onClick={handleCreate}
              disabled={creating || !newName.trim()}
              className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              {creating ? 'Creating...' : 'Save'}
            </button>
          </div>
        </Card>
      )}

      <div className="flex gap-2 flex-wrap">
        {muscleGroups.map((mg) => (
          <button
            key={mg}
            onClick={() => { setFilterMuscle(mg); setSelectedId(null) }}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              filterMuscle === mg
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {mg}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState Icon={Dumbbell} title="No exercises found" subtitle={query ? 'Try a different search term' : 'Create your first custom exercise'} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((ex) => (
            <Card key={ex.id} padding={false} className="overflow-hidden">
              <button
                onClick={() => setSelectedId(selectedId === ex.id ? null : ex.id)}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 rounded-lg bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex-shrink-0">
                    <Dumbbell className="w-4 h-4" />
                  </div>
                  <div className="text-left min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{ex.name}</p>
                    <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full text-gray-500 dark:text-gray-400">
                      {ex.muscleGroup}
                    </span>
                  </div>
                </div>
                {selectedId === ex.id ? (
                  <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                )}
              </button>
              {selectedId === ex.id && (
                <div className="px-4 pb-4 border-t border-gray-100 dark:border-gray-700">
                  {exerciseHistory.length === 0 ? (
                    <p className="text-sm text-gray-500 dark:text-gray-400 pt-3">No history yet</p>
                  ) : (
                    <div className="pt-3 space-y-2 max-h-60 overflow-y-auto">
                      {exerciseHistory.map((entry, i) => (
                        <div key={i} className="text-sm">
                          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                            {new Date(entry.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {entry.sets.map((set, j) => (
                              <span
                                key={j}
                                className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded"
                              >
                                {set.weight ? `${set.weight}kg` : ''}{set.weight && set.reps ? ' × ' : ''}{set.reps ? `${set.reps} reps` : ''}{set.duration ? `${set.duration}min` : ''}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
