import { X } from 'lucide-react'

interface Props {
  open: boolean
  title: string
  onClose: () => void
  children: React.ReactNode
  size?: 'md' | 'lg'
}

export default function Modal({ open, title, onClose, children, size = 'md' }: Props) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className={`relative bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full mx-4 p-6 max-h-[90vh] overflow-y-auto ${
        size === 'lg' ? 'max-w-2xl' : 'max-w-md'
      }`}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <X className="w-5 h-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
