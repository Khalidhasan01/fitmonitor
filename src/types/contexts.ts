import type { DailyLog } from './logs'
import type { UserProfile } from './profile'
import type { Suggestion } from './suggestions'
import type { User } from './auth'

export interface AuthContextValue {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  forgotPassword: (email: string) => Promise<{ message: string }>
  resetPassword: (token: string, password: string) => Promise<{ message: string }>
  deleteAccount: () => Promise<void>
}

export type LogsAction =
  | { type: 'SET_LOGS'; payload: DailyLog[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }

export interface LogsContextValue {
  logs: DailyLog[]
  loading: boolean
  error: string | null
  dispatch: React.Dispatch<LogsAction>
  fetchLogs: () => Promise<void>
}

export type ProfileAction =
  | { type: 'SET_PROFILE'; payload: UserProfile }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }

export interface ProfileContextValue {
  profile: UserProfile | null
  loading: boolean
  error: string | null
  dispatch: React.Dispatch<ProfileAction>
  fetchProfile: () => Promise<void>
}

export type SuggestionsAction =
  | { type: 'SET_SUGGESTIONS'; payload: Suggestion[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }

export interface SuggestionsContextValue {
  suggestions: Suggestion[]
  loading: boolean
  error: string | null
  dispatch: React.Dispatch<SuggestionsAction>
  fetchSuggestions: () => Promise<void>
}

export interface DarkModeContextValue {
  theme: 'light' | 'dark' | 'smart'
  setTheme: (t: 'light' | 'dark' | 'smart') => void
  accentColor: 'green' | 'blue' | 'purple' | 'orange' | 'teal'
  setAccentColor: (c: 'green' | 'blue' | 'purple' | 'orange' | 'teal') => void
  density: 'comfortable' | 'compact'
  setDensity: (d: 'comfortable' | 'compact') => void
}

export type UnitSystem = 'metric' | 'imperial'
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'
export type AccentColor = 'green' | 'blue' | 'purple' | 'orange' | 'teal'
export type ThemeMode = 'light' | 'dark' | 'smart'
export type Density = 'comfortable' | 'compact'
