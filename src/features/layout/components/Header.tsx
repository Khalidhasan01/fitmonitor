import { useAuth } from '../../../context/AuthContext'
import { useProfile } from '../../../context/ProfileContext'
import { useDarkMode } from '../../../context/DarkModeContext'
import { useUnitConversion } from '../../../hooks/useUnitConversion'
import { LogOut, Menu, Sun, Moon, Monitor } from 'lucide-react'

const themeIcons = { light: Sun, dark: Moon, smart: Monitor }

export default function Header({ onMenuToggle }: { onMenuToggle: () => void }) {
  const { user, logout } = useAuth()
  const { profile } = useProfile()
  const { theme, setTheme } = useDarkMode()
  const ThemeIcon = themeIcons[theme]
  const u = useUnitConversion(profile?.unitSystem)
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 md:px-6 lg:px-8 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-1 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-gray-100">
            {user ? `Welcome back, ${user.name.split(' ')[0]}` : 'Welcome'}
          </h1>
          <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">{today}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 md:gap-4">
        {profile && (
          <div className="hidden sm:flex items-center gap-2 md:gap-4 text-sm text-gray-600 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              {u.formatWeight(profile.weight)}
            </span>
            <span className="h-4 w-px bg-gray-300 dark:bg-gray-600" />
            <span className="flex items-center gap-1">
              Goal: {u.formatWeight(profile.goalWeight)}
            </span>
          </div>
        )}
        <button
          onClick={() => {
            const order = ['light', 'dark', 'smart'] as const
            const idx = order.indexOf(theme)
            setTheme(order[(idx + 1) % order.length])
          }}
          className="hidden sm:flex p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          title={`Theme: ${theme}`}
        >
          <ThemeIcon className="w-5 h-5" />
        </button>
        <button
          onClick={logout}
          className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Sign Out</span>
        </button>
      </div>
    </header>
  )
}
