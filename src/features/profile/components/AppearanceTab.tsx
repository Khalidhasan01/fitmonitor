import { Palette, Sun, Moon, Monitor, Save } from 'lucide-react'
import Card from '../../../components/ui/Card'
import SectionHeader from '../../../components/ui/SectionHeader'
import ColorSwatchPicker from '../../../components/ui/ColorSwatchPicker'
import ReorderableList from '../../../components/ui/ReorderableList'

const themeOptions = [
  { id: 'light', label: 'Light', icon: Sun, description: 'Always light mode' },
  { id: 'dark', label: 'Dark', icon: Moon, description: 'Always dark mode' },
  { id: 'smart', label: 'System', icon: Monitor, description: 'Follow system preference' },
]

const widgetLabels = {
  steps: 'Steps', calories: 'Calories', heart: 'Heart Rate',
  sleep: 'Sleep', water: 'Water', weight: 'Weight',
  meals: 'Meals', workouts: 'Workouts',
}

interface AppearanceTabProps {
  form: { appearance: { theme: string; accentColor: string; density: string; widgetOrder: string[] } }
  updateForm: (path: string, value: unknown) => void
  handleSaveForm: () => void
  saving?: boolean
}

export default function AppearanceTab({ form, updateForm, handleSaveForm, saving }: AppearanceTabProps) {
  const appearance = form.appearance

  return (
    <Card>
      <SectionHeader Icon={Palette} title="Appearance" color="indigo" />

      <div className="mb-6">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Theme</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {themeOptions.map(({ id, label, icon: Icon, description }) => (
            <button
              key={id}
              onClick={() => updateForm('appearance.theme', id)}
              className={`flex flex-col items-center gap-3 p-5 rounded-xl border-2 transition-all ${
                appearance.theme === id
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                  : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <div className={`p-3 rounded-full ${
                appearance.theme === id
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
              }`}>
                <Icon className="w-6 h-6" />
              </div>
              <div className="text-center">
                <p className={`text-sm font-semibold ${appearance.theme === id ? 'text-green-700 dark:text-green-400' : 'text-gray-900 dark:text-gray-100'}`}>
                  {label}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Accent Color</p>
        <ColorSwatchPicker
          value={appearance.accentColor || 'green'}
          onChange={(v) => updateForm('appearance.accentColor', v)}
        />
      </div>

      <div className="mb-6">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Density</p>
        <div className="grid grid-cols-2 gap-3">
          {[
            { value: 'comfortable', label: 'Comfortable', desc: 'More spacing and padding' },
            { value: 'compact', label: 'Compact', desc: 'Tighter layout, more content visible' },
          ].map(({ value, label, desc }) => (
            <button
              key={value}
              onClick={() => updateForm('appearance.density', value)}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                appearance.density === value
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                  : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <p className={`text-sm font-semibold ${appearance.density === value ? 'text-green-700 dark:text-green-400' : 'text-gray-900 dark:text-gray-100'}`}>
                {label}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{desc}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Dashboard Widget Order</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Use arrows to reorder dashboard cards</p>
        <ReorderableList
          items={appearance.widgetOrder || []}
          labels={widgetLabels}
          onReorder={(v) => updateForm('appearance.widgetOrder', v)}
        />
      </div>

      <button
        onClick={handleSaveForm}
        disabled={saving}
        className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {saving ? (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
        ) : (
          <Save className="w-4 h-4" />
        )}
        Save Changes
      </button>
    </Card>
  )
}
