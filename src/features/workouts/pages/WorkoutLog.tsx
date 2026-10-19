import { useState, useEffect } from 'react'
import { useLogs } from '../../../context/LogsContext'
import { useProfile } from '../../../context/ProfileContext'
import LoadingSpinner from '../../../components/ui/LoadingSpinner'
import PageHeader from '../../../components/ui/PageHeader'
import Card from '../../../components/ui/Card'
import EmptyState from '../../../components/ui/EmptyState'
import ConfirmModal from '../../../components/ui/ConfirmModal'
import WorkoutFormModal from '../components/WorkoutFormModal'
import SummaryBar from '../components/SummaryBar'
import PersonalRecords from '../components/PersonalRecords'
import ExerciseLibrary from '../components/ExerciseLibrary'
import TemplatesRow from '../components/TemplatesRow'
import { deleteWorkout, createTemplate } from '../../../services/api'
import { Dumbbell, Plus, ChevronDown, ChevronUp, Pencil, Trash2, Library, List } from 'lucide-react'
import type { Workout, WorkoutTemplate } from '../../../types'

type Tab = 'log' | 'library'

export default function WorkoutLog() {
  const { logs, loading, fetchLogs } = useLogs()
  const { profile } = useProfile()
  const [tab, setTab] = useState<Tab>('log')

  useEffect(() => {
    fetchLogs()
  }, [fetchLogs])

  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [filterMuscle, setFilterMuscle] = useState<string>('All')
  const [formOpen, setFormOpen] = useState(false)
  const [editingWorkout, setEditingWorkout] = useState<Workout | null>(null)
  const [deletingWorkout, setDeletingWorkout] = useState<Workout | null>(null)
  const [templateSource, setTemplateSource] = useState<WorkoutTemplate | null>(null)

  if (loading) return <LoadingSpinner />

  const workoutDays = logs.filter((log) => log.workouts.length > 0)
  const allExercises = workoutDays.flatMap((log) =>
    log.workouts.flatMap((w) => w.exercises)
  )
  const muscleGroups = ['All', ...new Set(allExercises.map((e) => e.muscleGroup))]

  function handleSaved() {
    fetchLogs()
    setTemplateSource(null)
  }

  function handleUseTemplate(template: WorkoutTemplate) {
    setTemplateSource(template)
    setFormOpen(true)
  }

  async function handleSaveAsTemplate() {
    const templateName = prompt('Name this template:')
    if (!templateName?.trim()) return
    const today = filteredLogs[filteredLogs.length - 1]
    if (!today || today.workouts.length === 0) return
    const latest = today.workouts[today.workouts.length - 1]
    try {
      await createTemplate({
        name: templateName.trim(),
        exercises: latest.exercises.map((ex) => ({
          exerciseDefinitionId: ex.exerciseDefinitionId ?? '',
          sets: ex.sets.map((s) => ({ reps: s.reps, weight: s.weight, duration: s.duration })),
        })),
      })
    } catch {
      // error
    }
  }

  async function handleDelete() {
    if (!deletingWorkout) return
    try {
      await deleteWorkout(deletingWorkout.id)
      setDeletingWorkout(null)
      fetchLogs()
    } catch {
      // error state
    }
  }

  const filteredLogs = workoutDays
    .map((log) => ({
      ...log,
      workouts: log.workouts
        .map((w) => ({
          ...w,
          exercises:
            filterMuscle === 'All'
              ? w.exercises
              : w.exercises.filter((e) => e.muscleGroup === filterMuscle),
        }))
        .filter((w) => w.exercises.length > 0),
    }))
    .filter((log) => log.workouts.length > 0)

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <PageHeader title="Workout Log" subtitle="Track your exercises and progress" />
        {tab === 'log' && (
          <button
            onClick={() => setFormOpen(true)}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors self-start"
          >
            <Plus className="w-4 h-4" />
            Log Workout
          </button>
        )}
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setTab('log')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            tab === 'log'
              ? 'bg-green-600 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          <List className="w-4 h-4" />
          Log
        </button>
        <button
          onClick={() => setTab('library')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            tab === 'library'
              ? 'bg-green-600 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          <Library className="w-4 h-4" />
          Library
        </button>
      </div>

      {tab === 'log' ? (
        <>
          <SummaryBar logs={logs} profile={profile} />

          <PersonalRecords logs={logs} />

          <TemplatesRow onUseTemplate={handleUseTemplate} onSaveNew={handleSaveAsTemplate} />

          <div className="flex gap-2 flex-wrap">
            {muscleGroups.map((mg) => (
              <button
                key={mg}
                onClick={() => setFilterMuscle(mg)}
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

          <div className="space-y-3 md:space-y-4">
            {filteredLogs.length === 0 && workoutDays.length > 0 && (
              <EmptyState Icon={Dumbbell} title="No workouts match this filter" subtitle="Try a different muscle group" />
            )}

            {filteredLogs.length === 0 && workoutDays.length === 0 && (
              <EmptyState Icon={Dumbbell} title="No workouts logged yet" subtitle="Start tracking your first workout!" />
            )}

            {filteredLogs.slice().reverse().map((log) =>
              log.workouts.map((workout) => (
                <Card key={workout.id} padding={false} className="overflow-hidden">
                  <div
                    onClick={() =>
                      setExpandedId(expandedId === workout.id ? null : workout.id)
                    }
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ')
                        setExpandedId(expandedId === workout.id ? null : workout.id)
                    }}
                    role="button"
                    tabIndex={0}
                    className="w-full flex items-center justify-between px-4 md:px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-2 rounded-lg bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex-shrink-0">
                        <Dumbbell className="w-5 h-5" />
                      </div>
                      <div className="text-left min-w-0">
                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                          {new Date(workout.date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {workout.exercises.length} exercises ·{' '}
                          {workout.exercises.reduce((s, e) => s + e.sets.length, 0)} sets
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setEditingWorkout(workout)
                        }}
                        className="p-1.5 text-gray-400 hover:text-blue-500 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setDeletingWorkout(workout)
                        }}
                        className="p-1.5 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      {expandedId === workout.id ? (
                        <ChevronUp className="w-5 h-5 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                      )}
                    </div>
                  </div>
                  {expandedId === workout.id && (
                    <div className="px-4 md:px-6 pb-4 space-y-3">
                      {workout.exercises.map((ex, i) => (
                        <div
                          key={ex.id || i}
                          className="p-3 md:p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">{ex.name}</p>
                              <span className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded-full text-gray-600 dark:text-gray-300">
                                {ex.muscleGroup}
                              </span>
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-2 text-xs text-gray-500 dark:text-gray-400 font-medium pb-2 border-b border-gray-200 dark:border-gray-600">
                            <span>Set</span>
                            <span className="text-center">
                              {ex.sets[0]?.duration ? 'Duration' : 'Reps'}
                            </span>
                            <span className="text-right">
                              {ex.sets[0]?.duration ? 'Dist' : 'Weight'}
                            </span>
                          </div>
                          {ex.sets.map((set, j) => (
                            <div
                              key={j}
                              className="grid grid-cols-3 gap-2 py-2 text-sm border-b border-gray-100 dark:border-gray-700 last:border-0"
                            >
                              <span className="text-gray-600 dark:text-gray-400">{set.set}</span>
                              <span className="text-center text-gray-900 dark:text-gray-100 font-medium">
                                {set.duration ? `${set.duration}min` : set.reps}
                              </span>
                              <span className="text-right text-gray-900 dark:text-gray-100 font-medium">
                                {set.weight ? `${set.weight}kg` : '-'}
                              </span>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              ))
            )}
          </div>
        </>
      ) : (
        <ExerciseLibrary logs={logs} />
      )}

      <WorkoutFormModal
        open={formOpen}
        onClose={() => { setFormOpen(false); setTemplateSource(null) }}
        onSaved={handleSaved}
        initialWorkout={templateSource ? {
          id: '',
          date: new Date().toISOString().slice(0, 10),
          exercises: templateSource.exercises.map((ex) => ({
            id: '',
            exerciseDefinitionId: ex.exerciseDefinitionId,
            name: ex.name,
            muscleGroup: ex.muscleGroup,
            sets: ex.sets.map((s, i) => ({ set: i + 1, reps: s.reps, weight: s.weight, duration: s.duration })),
          })),
        } : null}
      />

      <WorkoutFormModal
        open={!!editingWorkout}
        onClose={() => setEditingWorkout(null)}
        onSaved={handleSaved}
        initialWorkout={editingWorkout}
      />

      <ConfirmModal
        open={!!deletingWorkout}
        title="Delete Workout"
        message="Are you sure you want to delete this workout? This action cannot be undone."
        confirmLabel="Delete"
        confirmVariant="red"
        onConfirm={handleDelete}
        onCancel={() => setDeletingWorkout(null)}
      />
    </div>
  )
}
