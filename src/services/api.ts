const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

function getToken(): string | null {
  try {
    const raw = localStorage.getItem('fitmonitor_auth')
    if (!raw) return null
    return JSON.parse(raw).token || null
  } catch {
    return null
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers })

  if (!res.ok) {
    const body = await res.json().catch(() => ({ message: res.statusText }))
    throw new Error(body.message || `Request failed with status ${res.status}`)
  }

  return res.json()
}

async function requestFormData<T>(path: string, formData: FormData): Promise<T> {
  const token = getToken()
  const headers: Record<string, string> = {}
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers,
    body: formData,
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({ message: res.statusText }))
    throw new Error(body.message || `Request failed with status ${res.status}`)
  }

  return res.json()
}

// ── Auth ──────────────────────────────────────────────────────────

export async function login(email: string, password: string) {
  return request<{ user: import('../types').User; token: string }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

export async function signup(name: string, email: string, password: string) {
  return request<{ user: import('../types').User; token: string }>('/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  })
}

export async function logout() {
  return { message: 'Logged out' }
}

export async function forgotPassword(email: string) {
  return request<{ message: string }>('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  })
}

export async function resetPassword(token: string, password: string) {
  return request<{ message: string }>('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({ token, password }),
  })
}

export async function deleteAccount(_userId: string) {
  return request<{ message: string }>('/auth/account', {
    method: 'DELETE',
  })
}

// ── Logs ──────────────────────────────────────────────────────────

export async function getDailyLogs() {
  return request<Array<import('../types').DailyLog>>('/logs')
}

export async function getDailyLog(date: string) {
  return request<import('../types').DailyLog | null>(`/logs/${date}`)
}

export async function getLatestLog() {
  return request<import('../types').DailyLog | null>('/logs/latest')
}

// ── Workouts ──────────────────────────────────────────────────────

export async function getWorkouts() {
  return request<Array<import('../types').Workout>>('/workouts')
}

export async function getWorkoutsByDateRange(startDate: string, endDate: string) {
  return request<Array<import('../types').Workout>>(`/workouts?start=${startDate}&end=${endDate}`)
}

// ── Meals ─────────────────────────────────────────────────────────

export async function getMealsByDate(date: string) {
  return request<Array<import('../types').Meal>>(`/meals/${date}`)
}

// ── Suggestions ───────────────────────────────────────────────────

export async function getSuggestions() {
  return request<Array<import('../types').Suggestion>>('/suggestions')
}

// ── Profile (full) ────────────────────────────────────────────────

export async function getUserProfile() {
  return request<import('../types').UserProfile>('/profile')
}

export async function updateUserProfile(updates: Record<string, unknown>) {
  return request<import('../types').UserProfile>('/profile', {
    method: 'PUT',
    body: JSON.stringify(updates),
  })
}

// ── Profile: Personal Info ────────────────────────────────────────

export async function updatePersonal(data: {
  name?: string
  age?: number
  height?: number
  weight?: number
  goalWeight?: number
  unitSystem?: string
  activityLevel?: string
  timezone?: string
  bio?: string
}) {
  return request<import('../types').UserProfile>('/profile/personal', {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
}

export async function uploadAvatar(file: File) {
  const formData = new FormData()
  formData.append('file', file)
  return requestFormData<{ avatarUrl: string }>('/profile/avatar', formData)
}

export async function deleteAvatar() {
  return request<import('../types').UserProfile>('/profile/avatar', {
    method: 'DELETE',
  })
}

// ── Profile: Goals ────────────────────────────────────────────────

export async function updateGoals(data: Record<string, unknown>) {
  return request<import('../types').UserProfile>('/profile/goals', {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
}

export async function getGoalHistory(page = 0, size = 10) {
  return request<{ entries: import('../types').GoalHistoryEntry[]; page: number; size: number; total: number }>(
    `/profile/goals/history?page=${page}&size=${size}`
  )
}

// ── Profile: Notifications ────────────────────────────────────────

export async function updateNotifications(data: Record<string, unknown>) {
  return request<import('../types').UserProfile>('/profile/notifications', {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
}

// ── Profile: Privacy ──────────────────────────────────────────────

export async function updatePrivacy(data: Record<string, unknown>) {
  return request<import('../types').UserProfile>('/profile/privacy', {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
}

export async function getSessions() {
  return request<import('../types').ActiveSession[]>('/profile/privacy/sessions')
}

export async function deleteSession(sessionId: string) {
  return request<import('../types').UserProfile>(`/profile/privacy/sessions/${sessionId}`, {
    method: 'DELETE',
  })
}

export async function getBlockedUsers() {
  return request<import('../types').BlockedUser[]>('/profile/privacy/blocked-users')
}

export async function deleteBlockedUser(userId: string) {
  return request<import('../types').UserProfile>(`/profile/privacy/blocked-users/${userId}`, {
    method: 'DELETE',
  })
}

// ── Profile: Devices ──────────────────────────────────────────────

export async function updateDevices(data: Record<string, unknown>[]) {
  return request<import('../types').UserProfile>('/profile/devices', {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
}

export async function getDevices() {
  return request<import('../types').ConnectedDevice[]>('/profile/devices')
}

export async function connectDevice(deviceId: string) {
  return request<import('../types').UserProfile>(`/profile/devices/${deviceId}/connect`, {
    method: 'PATCH',
  })
}

export async function disconnectDevice(deviceId: string) {
  return request<import('../types').UserProfile>(`/profile/devices/${deviceId}/disconnect`, {
    method: 'PATCH',
  })
}

export async function syncDevice(deviceId: string) {
  return request<import('../types').UserProfile>(`/profile/devices/${deviceId}/sync`, {
    method: 'POST',
  })
}

export async function updateDeviceSyncFrequency(deviceId: string, syncFrequency: string) {
  return request<import('../types').UserProfile>(`/profile/devices/${deviceId}/sync-frequency`, {
    method: 'PATCH',
    body: JSON.stringify({ syncFrequency }),
  })
}

// ── Profile: Appearance ───────────────────────────────────────────

export async function updateAppearance(data: Record<string, unknown>) {
  return request<import('../types').UserProfile>('/profile/appearance', {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
}

// ── Profile: Stats ────────────────────────────────────────────────

export async function getProfileStats() {
  return request<{ bmi: number; weightToGoal: number; activityStreak: number; totalLoggedDays: number; workoutDays: number }>('/profile/stats')
}

// ── Exercise Library ──────────────────────────────────────────────

export async function getExercises(muscleGroup?: string) {
  const path = muscleGroup ? `/exercises?muscleGroup=${muscleGroup}` : '/exercises'
  return request<Array<import('../types').ExerciseDefinition>>(path)
}

export async function searchExercises(q: string) {
  return request<Array<import('../types').ExerciseDefinition>>(`/exercises?q=${encodeURIComponent(q)}`)
}

export async function createExercise(data: { name: string; muscleGroup: string }) {
  return request<import('../types').ExerciseDefinition>('/exercises', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

// ── Workout CRUD ──────────────────────────────────────────────────

export async function getWorkoutById(id: string) {
  return request<import('../types').Workout>(`/workouts/${id}`)
}

export async function createWorkout(data: import('../types').CreateWorkoutRequest) {
  return request<import('../types').Workout>('/workouts', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function updateWorkout(id: string, data: import('../types').CreateWorkoutRequest) {
  return request<import('../types').Workout>(`/workouts/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export async function deleteWorkout(id: string) {
  return request<void>(`/workouts/${id}`, { method: 'DELETE' })
}

// ── Workout Templates ─────────────────────────────────────────────

export async function getTemplates() {
  return request<Array<import('../types').WorkoutTemplate>>('/workout-templates')
}

export async function createTemplate(data: import('../types').CreateWorkoutTemplateRequest) {
  return request<import('../types').WorkoutTemplate>('/workout-templates', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function deleteTemplate(id: string) {
  return request<void>(`/workout-templates/${id}`, { method: 'DELETE' })
}

// ── Profile: Danger Zone ──────────────────────────────────────────

export async function deleteProfileAccount() {
  return request<{ message: string }>('/profile', {
    method: 'DELETE',
  })
}
