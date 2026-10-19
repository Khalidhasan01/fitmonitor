interface OptionType {
  value: string
  label: string
}

interface Props {
  label?: string
  value: string
  onChange: (value: string) => void
  options: OptionType[]
  name?: string
  disabled?: boolean
}

export default function Select({ label, value, onChange, options, name, disabled }: Props) {
  return (
    <div>
      {label && <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>}
      <select
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {options.map((opt: OptionType) => (
          <option key={opt.value} value={opt.value}>
            {opt.label || opt.value}
          </option>
        ))}
      </select>
    </div>
  )
}
