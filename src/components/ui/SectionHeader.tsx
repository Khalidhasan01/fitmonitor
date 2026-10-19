const colorMap: Record<string, string> = {
  green: 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400',
  orange: 'bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
  blue: 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
  purple: 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
  teal: 'bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400',
  red: 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400',
  amber: 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
  indigo: 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400',
  cyan: 'bg-cyan-50 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400',
  rose: 'bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400',
}

interface Props {
  Icon: React.ComponentType<{ className?: string }>
  title: string
  color?: string
}

export default function SectionHeader({ Icon, title, color = 'green' }: Props) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className={`p-2 rounded-lg ${colorMap[color] || colorMap.green}`}>
        <Icon className="w-5 h-5" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
    </div>
  )
}
