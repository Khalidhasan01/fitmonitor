import { GripVertical } from 'lucide-react'

const defaultLabels = {}

interface Props {
  items: string[]
  labels?: Record<string, string>
  onReorder: (items: string[]) => void
}

export default function ReorderableList({ items, labels = defaultLabels, onReorder }: Props) {
  const moveItem = (index: number, direction: number) => {
    const next = [...items]
    const targetIndex = index + direction
    if (targetIndex < 0 || targetIndex >= next.length) return
    ;[next[index], next[targetIndex]] = [next[targetIndex], next[index]]
    onReorder(next)
  }

  return (
    <div className="space-y-2 max-w-md">
      {items.map((item: string, index: number) => (
        <div
          key={item}
          className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center gap-2">
            <GripVertical className="w-4 h-4 text-gray-400 cursor-grab" />
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {labels[item] || item}
            </span>
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => moveItem(index, -1)}
              disabled={index === 0}
              className="p-1 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
            </button>
            <button
              onClick={() => moveItem(index, 1)}
              disabled={index === items.length - 1}
              className="p-1 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
