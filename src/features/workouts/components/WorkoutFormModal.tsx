import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import Modal from '../../../components/ui/Modal'
import ExercisePicker from './ExercisePicker'
import SetRow from './SetRow'
import { createWorkout, updateWorkout } from '../../../services/api'
import type { ExerciseDefinition, Workout, CreateSetRequest } from '../../../types'

interface FormExercise {
  definition: ExerciseDefinition
  sets: CreateSetRequest[]
}

interface Props {
  open: boolean
  onClose: () => void
  onSaved: () => void
  initialWorkout?: Workout | null
}

function buildInitialExercises(workout?: Workout | null): FormExercise[] {
  if (!workout) return []
  return workout.exercises.map((ex) => ({
    definition: { id: ex.exerciseDefinitionId ?? '', name: ex.name, muscleGroup: ex.muscleGroup },
    sets: ex.sets.map((s) => ({ reps: s.reps, weight: s.weight, duration: s.duration })),
  }))
}

export default function WorkoutFormModal({ open, onClose, onSaved, initialWorkout }: Props) {
  const isEdit = !!initialWorkout
  const [date, setDate] = useState(initialWorkout?.date ?? new Date().toISOString().slice(0, 10))
  const [exercises, setExercises] = useState<FormExercise[]>(() => buildInitialExercises(initialWorkout))
  const [saving, setSaving] = useState(false)

  function addExercise(def: ExerciseDefinition) {
    setExercises((prev) => [...prev, { definition: def, sets: [{ reps: 10, weight: null, duration: null }] }])
  }

  function removeExercise(index: number) {
    setExercises((prev) => prev.filter((_, i) => i !== index))
  }

  function updateSet(exIndex: number, setIndex: number, field: 'reps' | 'weight' | 'duration', value: number | null) {
    setExercises((prev) => {
      const next = [...prev]
      next[exIndex] = {
        ...next[exIndex],
        sets: next[exIndex].sets.map((s, i) => (i === setIndex ? { ...s, [field]: value } : s)),
      }
      return next
    })
  }

  function removeSet(exIndex: number, setIndex: number) {
    setExercises((prev) => {
      const next = [...prev]
      next[exIndex] = {
        ...next[exIndex],
        sets: next[exIndex].sets.filter((_, i) => i !== setIndex),
      }
      return next
    })
  }

  function addSet(exIndex: number) {
    setExercises((prev) => {
      const next = [...prev]
      next[exIndex] = {
        ...next[exIndex],
        sets: [...next[exIndex].sets, { reps: 10, weight: null, duration: null }],
      }
      return next
    })
  }

  async function handleSave() {
    const payload = {
      date,
      exercises: exercises.map((ex) => ({
        exerciseDefinitionId: ex.definition.id,
        sets: ex.sets,
      })),
    }

    setSaving(true)
    try {
      if (isEdit && initialWorkout) {
        await updateWorkout(initialWorkout.id, payload)
      } else {
        await createWorkout(payload)
      }
      onSaved()
      onClose()
    } catch {
      // error state could be shown
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? 'Edit Workout' : 'Log Workout'} size="lg">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Exercises</label>
          <ExercisePicker onSelect={addExercise} />
        </div>

        {exercises.map((ex, exIndex) => (
          <div key={exIndex} className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                  {ex.definition.name}
                </span>
                <span className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded-full text-gray-600 dark:text-gray-300">
                  {ex.definition.muscleGroup}
                </span>
              </div>
              <button
                onClick={() => removeExercise(exIndex)}
                className="p-1 text-gray-400 hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-[24px_1fr_1fr_24px] gap-2 text-xs text-gray-500 font-medium pb-1 border-b border-gray-200 dark:border-gray-600">
              <span>#</span>
              <span>Reps / Duration</span>
              <span>Weight</span>
            </div>

            {ex.sets.map((set, setIndex) => (
              <SetRow
                key={setIndex}
                index={setIndex}
                reps={set.reps}
                weight={set.weight}
                duration={set.duration}
                onUpdate={(_, field, value) => updateSet(exIndex, setIndex, field, value)}
                onRemove={() => removeSet(exIndex, setIndex)}
                isCardio={ex.definition.muscleGroup === 'Cardio'}
              />
            ))}

            <button
              onClick={() => addSet(exIndex)}
              className="mt-2 text-xs text-green-600 hover:text-green-700 font-medium flex items-center gap-1"
            >
              <Plus className="w-3 h-3" /> Add Set
            </button>
          </div>
        ))}

        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || exercises.length === 0}
            className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? 'Saving...' : isEdit ? 'Update Workout' : 'Save Workout'}
          </button>
        </div>
      </div>
    </Modal>
  )
}
