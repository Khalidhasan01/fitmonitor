interface Props {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  id?: string
}

export default function Toggle({ checked, onChange, id }: Props) {
  return (
    <label
      htmlFor={id}
      className="relative inline-flex items-center cursor-pointer"
    >
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only peer"
      />
      <div className="w-11 h-6 bg-gray-200 dark:bg-gray-600 rounded-full peer-checked:bg-green-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all" />
    </label>
  )
}
