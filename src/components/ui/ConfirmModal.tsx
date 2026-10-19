import { AlertTriangle, X } from 'lucide-react'

interface Props {
  open: boolean
  title: string
  message: string
  confirmLabel?: string
  confirmVariant?: string
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmModal({ open, title, message, confirmLabel, confirmVariant = 'red', onConfirm, onCancel }: Props) {
  if (!open) return null

  const confirmColors: Record<string, string> = {
    red: 'bg-red-600 hover:bg-red-700',
    orange: 'bg-orange-600 hover:bg-orange-700',
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onCancel} />
      <div className="relative bg-white dark:bg-gray-900 rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
        <button onClick={onCancel} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
          <X className="w-5 h-5" />
        </button>
        <div className="flex items-start gap-4">
          <div className="p-2 rounded-full bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex-shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{message}</p>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors ${confirmColors[confirmVariant] || confirmColors.red}`}
          >
            {confirmLabel || 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  )
}
