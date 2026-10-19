interface Props {
  Icon: React.ComponentType<{ className?: string }>
  title: string
  subtitle?: string
}

export default function EmptyState({ Icon, title, subtitle }: Props) {
  return (
    <div className="text-center py-16 text-gray-500 dark:text-gray-400">
      {Icon && <Icon className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />}
      <p className="text-lg font-medium">{title}</p>
      {subtitle && <p className="text-sm mt-1">{subtitle}</p>}
    </div>
  )
}
