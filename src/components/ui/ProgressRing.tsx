interface Props {
  value: number
  max: number
  size?: number
  strokeWidth?: number
  label?: string
  color?: string
}

export default function ProgressRing({ value, max, size = 80, strokeWidth = 6, label, color = 'text-green-500' }: Props) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const progress = Math.min(value / max, 1)
  const offset = circumference - progress * circumference

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
          fill="none"
          className="dark:opacity-30"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={color}
        />
      </svg>
      <span className="text-lg font-bold text-gray-900 dark:text-gray-100">{value}%</span>
      {label && <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>}
    </div>
  )
}
