import { X } from 'lucide-react'

interface Props {
  index: number
  reps: number | null
  weight: number | null
  duration: number | null
  onUpdate: (index: number, field: 'reps' | 'weight' | 'duration', value: number | null) => void
  onRemove: (index: number) => void
  isCardio?: boolean
}

export default function SetRow({ index, reps, weight, duration, onUpdate, onRemove, isCardio }: Props) {
  return (
    <div className="flex items-center gap-2 py-1.5">
      <span className="w-6 text-xs text-gray-500 font-medium text-center">{index + 1}</span>
      {isCardio ? (
        <>
          <input
            type="number"
            min={0}
            value={duration ?? ''}
            onChange={(e) => onUpdate(index, 'duration', e.target.value ? Number(e.target.value) : null)}
            placeholder="min"
            className="w-20 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-green-500 outline-none"
          />
          <span className="text-xs text-gray-500 w-16">min</span>
          <span className="text-xs text-gray-400 w-20">—</span>
        </>
      ) : (
        <>
          <input
            type="number"
            min={0}
            value={reps ?? ''}
            onChange={(e) => onUpdate(index, 'reps', e.target.value ? Number(e.target.value) : null)}
            placeholder="reps"
            className="w-20 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-green-500 outline-none"
          />
          <span className="text-xs text-gray-500 w-16">reps</span>
          <input
            type="number"
            min={0}
            step={0.5}
            value={weight ?? ''}
            onChange={(e) => onUpdate(index, 'weight', e.target.value ? Number(e.target.value) : null)}
            placeholder="kg"
            className="w-20 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-green-500 outline-none"
          />
          <span className="text-xs text-gray-500 w-10">kg</span>
        </>
      )}
      <button
        onClick={() => onRemove(index)}
        className="p-1 text-gray-400 hover:text-red-500 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}
