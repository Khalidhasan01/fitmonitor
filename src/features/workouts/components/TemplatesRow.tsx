import { useState, useEffect } from 'react'
import Card from '../../../components/ui/Card'
import { getTemplates, deleteTemplate } from '../../../services/api'
import { LayoutTemplate, Play, Trash2, Plus } from 'lucide-react'
import type { WorkoutTemplate } from '../../../types'

interface Props {
  onUseTemplate: (template: WorkoutTemplate) => void
  onSaveNew: () => void
}

export default function TemplatesRow({ onUseTemplate, onSaveNew }: Props) {
  const [templates, setTemplates] = useState<WorkoutTemplate[]>([])
  const [loading, setLoading] = useState(true)

  async function loadTemplates() {
    try {
      const data = await getTemplates()
      setTemplates(data)
    } catch {
      setTemplates([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTemplates()
  }, [])

  async function handleDelete(id: string) {
    try {
      await deleteTemplate(id)
      setTemplates((prev) => prev.filter((t) => t.id !== id))
    } catch {
      // error
    }
  }

  if (loading) return null
  if (templates.length === 0) return null

  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <LayoutTemplate className="w-5 h-5 text-green-600 dark:text-green-400" />
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Templates</h3>
        </div>
        <button
          onClick={onSaveNew}
          className="flex items-center gap-1 text-xs text-green-600 hover:text-green-700 font-medium"
        >
          <Plus className="w-3 h-3" />
          Save Current as Template
        </button>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-1">
        {templates.map((t) => (
          <div
            key={t.id}
            className="flex-shrink-0 w-44 p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{t.name}</p>
              <button
                onClick={() => handleDelete(t.id)}
                className="p-0.5 text-gray-400 hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
              {t.exercises.length} exercises
            </p>
            <button
              onClick={() => onUseTemplate(t)}
              className="w-full flex items-center justify-center gap-1 text-xs bg-green-600 text-white px-2 py-1.5 rounded-lg hover:bg-green-700 transition-colors"
            >
              <Play className="w-3 h-3" />
              Use Template
            </button>
          </div>
        ))}
      </div>
    </Card>
  )
}
