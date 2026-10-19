interface OptionType {
  value: string
  label: string
  icon?: React.ComponentType<{ className?: string }>
}

interface Props {
  options: OptionType[]
  selected: string[]
  onChange: (selected: string[]) => void
}

export default function MetricCheckboxGroup({ options, selected, onChange }: Props) {
  const toggle = (value: string) => {
    const next = selected.includes(value)
      ? selected.filter((v: string) => v !== value)
      : [...selected, value]
    onChange(next)
  }

  return (
    <div className="flex flex-wrap gap-2">
      {options.map(({ value, label, icon: Icon }) => (
        <label
          key={value}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer border transition-colors ${
            selected.includes(value)
              ? 'bg-purple-50 dark:bg-purple-900/30 border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-400'
              : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
          }`}
        >
          <input
            type="checkbox"
            checked={selected.includes(value)}
            onChange={() => toggle(value)}
            className="sr-only"
          />
          {Icon && <Icon className="w-3.5 h-3.5" />}
          {label}
        </label>
      ))}
    </div>
  )
}
