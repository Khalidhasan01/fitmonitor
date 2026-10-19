export interface Goals {
  macros: { protein: number; carbs: number; fat: number }
  targetDate: string | null
  targetWeight: number
  bodyFatPercent: number | null
  restingHR: number | null
  workoutsPerWeek: number
  history: GoalHistoryEntry[]
}

export interface GoalHistoryEntry {
  date: string
  type: 'weight' | 'workouts'
  target: number
  achieved: number
  hit: boolean
}

export interface NotificationSetting {
  enabled: boolean
  channels: ('push' | 'email' | 'sms')[]
}

export interface NotificationPrefs {
  emailNotifications: NotificationSetting
  workoutReminders: NotificationSetting & { time: string }
  mealReminders: NotificationSetting & { time: string }
  weeklyReports: NotificationSetting
  streakAtRisk: NotificationSetting
  quietHours: { start: string; end: string; enabled: boolean }
}

export interface BlockedUser {
  id: string
  name: string
  blockedAt: string
}

export interface ActiveSession {
  id: string
  device: string
  location: string
  lastActive: string
  current: boolean
}

export interface PrivacySettings {
  showOnLeaderboard: boolean
  sharedMetrics: ('steps' | 'weight' | 'workouts' | 'meals' | 'heartRate')[]
  allowFriendRequests: boolean
  blockedUsers: BlockedUser[]
  activeSessions: ActiveSession[]
}

export interface ConnectedDevice {
  id: string
  name: string
  type: 'watch' | 'tracker' | 'health_platform'
  connected: boolean
  lastSynced: string | null
  syncFrequency: 'realtime' | 'hourly' | 'daily'
}

export interface Appearance {
  theme: 'light' | 'dark' | 'smart'
  accentColor: 'green' | 'blue' | 'purple' | 'orange' | 'teal'
  density: 'comfortable' | 'compact'
  widgetOrder: string[]
}

export interface UserProfile {
  name: string
  age: number
  height: number
  weight: number
  goalWeight: number
  dailyStepGoal: number
  dailyCalorieGoal: number
  waterGoal: number
  sleepGoal: number
  avatarUrl: string | null
  unitSystem: 'metric' | 'imperial'
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'
  timezone: string
  bio: string
  goals: Goals
  notificationPrefs: NotificationPrefs
  privacySettings: PrivacySettings
  connectedDevices: ConnectedDevice[]
  appearance: Appearance
}
