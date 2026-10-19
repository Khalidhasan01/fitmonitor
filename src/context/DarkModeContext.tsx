import { createContext, useContext, useEffect, useCallback } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import type { DarkModeContextValue, AccentColor, ThemeMode, Density } from '../types'

const DarkModeContext = createContext<DarkModeContextValue | null>(null)

function getSystemPreference(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function applyTheme(theme: ThemeMode) {
  const isDark = theme === 'dark' || (theme === 'smart' && getSystemPreference() === 'dark')
  document.documentElement.classList.toggle('dark', isDark)
}

function applyAccent(color: AccentColor) {
  const root = document.documentElement
  const colorMap: Record<string, string> = {
    green: '#16a34a',
    blue: '#2563eb',
    purple: '#9333ea',
    orange: '#ea580c',
    teal: '#0d9488',
  }
  root.style.setProperty('--color-accent', colorMap[color] || colorMap.green)
  root.style.setProperty('--color-accent-hover', adjustColor(colorMap[color] || colorMap.green, -20))
}

function adjustColor(hex: string, amount: number) {
  const num = parseInt(hex.replace('#', ''), 16)
  const r = Math.min(255, Math.max(0, (num >> 16) + amount))
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amount))
  const b = Math.min(255, Math.max(0, (num & 0x0000FF) + amount))
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
}

function applyDensity(density: Density) {
  document.documentElement.classList.toggle('density-compact', density === 'compact')
}

export function DarkModeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useLocalStorage<ThemeMode>('fitmonitor_theme', 'smart')
  const [accentColor, setAccentColorState] = useLocalStorage<AccentColor>('fitmonitor_accent', 'green')
  const [density, setDensityState] = useLocalStorage<Density>('fitmonitor_density', 'comfortable')

  useEffect(() => {
    applyTheme(theme)
    if (theme === 'smart') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)')
      const handler = () => applyTheme('smart' as ThemeMode)
      mq.addEventListener('change', handler)
      return () => mq.removeEventListener('change', handler)
    }
  }, [theme])

  useEffect(() => { applyAccent(accentColor) }, [accentColor])
  useEffect(() => { applyDensity(density) }, [density])

  const setTheme = useCallback((t: ThemeMode) => setThemeState(t), [setThemeState])
  const setAccentColor = useCallback((c: AccentColor) => setAccentColorState(c), [setAccentColorState])
  const setDensity = useCallback((d: Density) => setDensityState(d), [setDensityState])

  return (
    <DarkModeContext.Provider value={{ theme, setTheme, accentColor, setAccentColor, density, setDensity }}>
      {children}
    </DarkModeContext.Provider>
  )
}

export function useDarkMode() {
  const context = useContext(DarkModeContext)
  if (!context) throw new Error('useDarkMode must be used within DarkModeProvider')
  return context
}
