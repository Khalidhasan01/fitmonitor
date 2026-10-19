interface Props {
  active: boolean
  onClick: () => void
  children: React.ReactNode
  className?: string
}

export default function TabButton({ active, onClick, children, className = '' }: Props) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
        active
          ? 'bg-green-600 text-white'
          : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
      } ${className}`}
    >
      {children}
    </button>
  )
}
