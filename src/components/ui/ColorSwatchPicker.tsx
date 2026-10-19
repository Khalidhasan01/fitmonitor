import { Palette } from 'lucide-react'

const defaultColors = [
  { value: 'green', label: 'Green', class: 'bg-green-500' },
  { value: 'blue', label: 'Blue', class: 'bg-blue-500' },
  { value: 'purple', label: 'Purple', class: 'bg-purple-500' },
  { value: 'orange', label: 'Orange', class: 'bg-orange-500' },
  { value: 'teal', label: 'Teal', class: 'bg-teal-500' },
]

interface ColorOption {
  value: string
  label: string
  class: string
}

interface Props {
  colors?: ColorOption[]
  value: string
  onChange: (v: string) => void
}

export default function ColorSwatchPicker({ colors = defaultColors, value, onChange }: Props) {
  return (
    <div className="flex gap-3">
      {colors.map(({ value: colorValue, label, class: bgClass }) => (
        <button
          key={colorValue}
          onClick={() => onChange(colorValue)}
          className={`w-10 h-10 rounded-full ${bgClass} transition-all flex items-center justify-center`}
          style={value === colorValue ? { boxShadow: `0 0 0 2px white, 0 0 0 4px currentColor` } : {}}
          title={label}
        >
          {value === colorValue && <Palette className="w-4 h-4 text-white" />}
        </button>
      ))}
    </div>
  )
}
