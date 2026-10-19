interface Props {
  label?: string
  value: string
  onChange: (value: string) => void
  name?: string
}

export default function TimePicker({ label, value, onChange, name }: Props) {
  return (
    <div>
      {label && <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>}
      <input
        type="time"
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
      />
    </div>
  )
}
