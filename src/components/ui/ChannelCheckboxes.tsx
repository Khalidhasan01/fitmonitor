const channels = [
  { value: 'push', label: 'Push' },
  { value: 'email', label: 'Email' },
  { value: 'sms', label: 'SMS' },
]

interface Props {
  selected: string[]
  onChange: (selected: string[]) => void
}

export default function ChannelCheckboxes({ selected, onChange }: Props) {
  return (
    <div className="flex gap-2">
      {channels.map((ch) => (
        <label
          key={ch.value}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium cursor-pointer border transition-colors ${
            (selected || []).includes(ch.value)
              ? 'bg-green-50 dark:bg-green-900/30 border-green-300 dark:border-green-700 text-green-700 dark:text-green-400'
              : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          <input
            type="checkbox"
            checked={(selected || []).includes(ch.value)}
            onChange={(e) => {
              if (e.target.checked) {
                onChange([...(selected || []), ch.value])
              } else {
                onChange((selected || []).filter((v: string) => v !== ch.value))
              }
            }}
            className="sr-only"
          />
          {ch.label}
        </label>
      ))}
    </div>
  )
}
