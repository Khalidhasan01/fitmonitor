interface Props {
  children: React.ReactNode
  padding?: boolean
  className?: string
}

export default function Card({ children, padding = true, className = '' }: Props) {
  return (
    <div className={`bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 ${padding ? 'p-4 md:p-6' : ''} ${className}`}>
      {children}
    </div>
  )
}
