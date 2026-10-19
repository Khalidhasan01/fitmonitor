interface Props {
  Icon: React.ComponentType<{ className?: string }>
  label: string
  value: string | number
  unit?: string
  subtext?: string
  color?: string
}

export default function StatCard({ Icon, label, value, unit, subtext, color = 'blue' }: Props) {
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    green: 'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400',
    orange: 'bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
    purple: 'bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
    red: 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400',
    teal: 'bg-teal-50 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400',
    pink: 'bg-pink-50 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400',
    indigo: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400',
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-5 flex items-start gap-4 hover:shadow-md dark:hover:shadow-gray-900/50 transition-shadow">
      <div className={`p-3 rounded-lg ${colorMap[color] || colorMap.blue}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
          {value}
          {unit && <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-1">{unit}</span>}
        </p>
        {subtext && <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{subtext}</p>}
      </div>
    </div>
  )
}
