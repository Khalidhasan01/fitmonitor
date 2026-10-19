import { useState, useEffect, useRef } from 'react'
import { Search, Plus } from 'lucide-react'
import { searchExercises, createExercise } from '../../../services/api'
import type { ExerciseDefinition } from '../../../types'

interface Props {
  onSelect: (def: ExerciseDefinition) => void
}

export default function ExercisePicker({ onSelect }: Props) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<ExerciseDefinition[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [highlightIndex, setHighlightIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      setOpen(false)
      return
    }

    setLoading(true)
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      try {
        const data = await searchExercises(query)
        setResults(data)
        setOpen(true)
        setHighlightIndex(-1)
      } catch {
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 300)

    return () => clearTimeout(debounceRef.current)
  }, [query])

  function handleSelect(def: ExerciseDefinition) {
    onSelect(def)
    setQuery('')
    setResults([])
    setOpen(false)
    inputRef.current?.focus()
  }

  async function handleCreateCustom() {
    try {
      const def = await createExercise({ name: query, muscleGroup: 'Other' })
      handleSelect(def)
    } catch {
      // fallback
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!open) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlightIndex((i) => Math.min(i + 1, results.length))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlightIndex((i) => Math.max(i - 1, -1))
    } else if (e.key === 'Enter' && highlightIndex >= 0 && highlightIndex < results.length) {
      e.preventDefault()
      handleSelect(results[highlightIndex])
    } else if (e.key === 'Enter' && highlightIndex === results.length) {
      e.preventDefault()
      handleCreateCustom()
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search exercises..."
          className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 rounded-lg pl-10 pr-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
        />
        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>
      {open && (
        <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-48 overflow-y-auto">
          {results.map((def, i) => (
            <button
              key={def.id}
              onClick={() => handleSelect(def)}
              onMouseEnter={() => setHighlightIndex(i)}
              className={`w-full text-left px-3 py-2 text-sm flex items-center justify-between ${
                highlightIndex === i ? 'bg-green-50 dark:bg-green-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <span className="text-gray-900 dark:text-gray-100">{def.name}</span>
              <span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">
                {def.muscleGroup}
              </span>
            </button>
          ))}
          {query.trim() && (
            <button
              onClick={handleCreateCustom}
              onMouseEnter={() => setHighlightIndex(results.length)}
              className={`w-full text-left px-3 py-2 text-sm flex items-center gap-2 border-t border-gray-100 dark:border-gray-700 ${
                highlightIndex === results.length ? 'bg-green-50 dark:bg-green-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <Plus className="w-4 h-4 text-green-600" />
              <span>Create new "{query}"</span>
            </button>
          )}
        </div>
      )}
    </div>
  )
}
