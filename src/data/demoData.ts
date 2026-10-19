const exercises = [
  { name: 'Bench Press', muscleGroup: 'Chest' },
  { name: 'Incline Dumbbell Press', muscleGroup: 'Chest' },
  { name: 'Cable Flyes', muscleGroup: 'Chest' },
  { name: 'Pull Ups', muscleGroup: 'Back' },
  { name: 'Barbell Row', muscleGroup: 'Back' },
  { name: 'Lat Pulldown', muscleGroup: 'Back' },
  { name: 'Seated Cable Row', muscleGroup: 'Back' },
  { name: 'Overhead Press', muscleGroup: 'Shoulders' },
  { name: 'Lateral Raise', muscleGroup: 'Shoulders' },
  { name: 'Front Raise', muscleGroup: 'Shoulders' },
  { name: 'Face Pull', muscleGroup: 'Shoulders' },
  { name: 'Squat', muscleGroup: 'Legs' },
  { name: 'Romanian Deadlift', muscleGroup: 'Legs' },
  { name: 'Leg Press', muscleGroup: 'Legs' },
  { name: 'Leg Curl', muscleGroup: 'Legs' },
  { name: 'Leg Extension', muscleGroup: 'Legs' },
  { name: 'Calf Raise', muscleGroup: 'Legs' },
  { name: 'Barbell Curl', muscleGroup: 'Arms' },
  { name: 'Tricep Pushdown', muscleGroup: 'Arms' },
  { name: 'Hammer Curl', muscleGroup: 'Arms' },
  { name: 'Overhead Tricep Extension', muscleGroup: 'Arms' },
  { name: 'Plank', muscleGroup: 'Core' },
  { name: 'Cable Crunch', muscleGroup: 'Core' },
  { name: 'Hanging Leg Raise', muscleGroup: 'Core' },
  { name: 'Running', muscleGroup: 'Cardio' },
  { name: 'Cycling', muscleGroup: 'Cardio' },
  { name: 'Jump Rope', muscleGroup: 'Cardio' },
]

const meals: { name: string; type: 'breakfast' | 'lunch' | 'dinner' | 'snack'; calories: number; protein: number; carbs: number; fat: number }[] = [
  { name: 'Oatmeal with Berries', type: 'breakfast', calories: 350, protein: 12, carbs: 58, fat: 7 },
  { name: 'Scrambled Eggs on Toast', type: 'breakfast', calories: 420, protein: 28, carbs: 32, fat: 18 },
  { name: 'Greek Yogurt Parfait', type: 'breakfast', calories: 290, protein: 20, carbs: 40, fat: 5 },
  { name: 'Protein Smoothie', type: 'breakfast', calories: 380, protein: 35, carbs: 45, fat: 8 },
  { name: 'Avocado Toast', type: 'breakfast', calories: 320, protein: 10, carbs: 35, fat: 16 },
  { name: 'Grilled Chicken Salad', type: 'lunch', calories: 450, protein: 42, carbs: 20, fat: 22 },
  { name: 'Turkey Sandwich', type: 'lunch', calories: 520, protein: 35, carbs: 48, fat: 16 },
  { name: 'Quinoa Bowl', type: 'lunch', calories: 480, protein: 18, carbs: 62, fat: 16 },
  { name: 'Tuna Wrap', type: 'lunch', calories: 440, protein: 38, carbs: 40, fat: 14 },
  { name: 'Caesar Salad with Chicken', type: 'lunch', calories: 500, protein: 40, carbs: 18, fat: 28 },
  { name: 'Salmon with Rice', type: 'dinner', calories: 580, protein: 45, carbs: 55, fat: 18 },
  { name: 'Chicken Stir Fry', type: 'dinner', calories: 510, protein: 40, carbs: 40, fat: 16 },
  { name: 'Lean Steak with Sweet Potato', type: 'dinner', calories: 620, protein: 50, carbs: 52, fat: 20 },
  { name: 'Pasta with Turkey Meatballs', type: 'dinner', calories: 550, protein: 38, carbs: 65, fat: 14 },
  { name: 'Vegetable Curry with Rice', type: 'dinner', calories: 460, protein: 14, carbs: 70, fat: 14 },
  { name: 'Mixed Nuts', type: 'snack', calories: 170, protein: 5, carbs: 6, fat: 15 },
  { name: 'Apple with Peanut Butter', type: 'snack', calories: 200, protein: 7, carbs: 25, fat: 9 },
  { name: 'Protein Bar', type: 'snack', calories: 220, protein: 20, carbs: 25, fat: 7 },
  { name: 'Hummus with Veggies', type: 'snack', calories: 160, protein: 6, carbs: 14, fat: 10 },
  { name: 'Cottage Cheese with Fruit', type: 'snack', calories: 180, protein: 18, carbs: 16, fat: 5 },
]

const suggestions = [
  { title: 'Stay Hydrated', description: 'Drink at least 8 cups of water today. Try adding lemon for flavor.', icon: 'Droplets' },
  { title: 'Mix Up Your Cardio', description: 'Try interval training: 30s sprint, 60s jog, repeat 8 times.', icon: 'Zap' },
  { title: 'Protein Timing', description: 'Have protein within 30min post-workout for optimal recovery.', icon: 'Clock' },
  { title: 'Sleep Matters', description: 'Aim for 7-8 hours of sleep. Your muscles repair while you rest.', icon: 'Moon' },
  { title: 'Track Your Meals', description: 'Logging meals helps you stay accountable to your nutrition goals.', icon: 'ClipboardList' },
  { title: 'Warm Up Properly', description: 'Dynamic stretches before lifting reduce injury risk.', icon: 'Activity' },
]

const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack']

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function pickRandomN<T>(arr: T[], n: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, n)
}

function generateWorkout(dateStr: string) {
  const numExercises = randomInt(3, 6)
  const selectedExercises = pickRandomN(exercises, numExercises)
  return {
    id: `w-${dateStr}-${Date.now()}`,
    date: dateStr,
    exercises: selectedExercises.map((ex: { name: string; muscleGroup: string }) => ({
      ...ex,
      sets: Array.from({ length: randomInt(3, 5) }, (_, i) => ({
        set: i + 1,
        reps: ex.muscleGroup === 'Cardio' ? null : randomInt(8, 15),
        weight: ex.muscleGroup === 'Cardio' ? null : randomInt(10, 100),
        duration: ex.muscleGroup === 'Cardio' ? randomInt(10, 45) : null,
      })),
    })),
  }
}

function generateMeals() {
  return mealTypes.map((type: string) => {
    const options = meals.filter((m: { type: string }) => m.type === type)
    const meal = pickRandom(options)
    return { ...meal, id: `m-${Date.now()}-${Math.random()}` }
  })
}

function generateDailyLog(dateStr: string, index: number) {
  const hasWorkout = index % 3 !== 1
  const steps = randomInt(5000, 15000)
  return {
    date: dateStr,
    steps,
    caloriesBurned: randomInt(1800, 2800),
    caloriesConsumed: randomInt(1800, 2500),
    heartRateAvg: randomInt(62, 78),
    sleepHours: Math.round((Math.random() * 3 + 5.5) * 10) / 10,
    waterCups: randomInt(4, 10),
    weight: Math.round((75 + Math.sin(index / 7) * 2 + (Math.random() - 0.5) * 1.5) * 10) / 10,
    meals: generateMeals(),
    workouts: hasWorkout ? [generateWorkout(dateStr)] : [],
  }
}

function generateDemoData() {
  const logs = []
  const today = new Date()
  for (let i = 20; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split('T')[0]
    logs.push(generateDailyLog(dateStr, 20 - i))
  }
  return logs
}

export const demoLogs = generateDemoData()

export const userProfile = {
  name: 'Alex Johnson',
  age: 28,
  height: 178,
  weight: 76.5,
  goalWeight: 72,
  dailyStepGoal: 10000,
  dailyCalorieGoal: 2200,
  waterGoal: 8,
  sleepGoal: 8,
  avatarUrl: null,
  unitSystem: 'metric',
  activityLevel: 'moderate',
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  bio: '',
  goals: {
    macros: { protein: 150, carbs: 250, fat: 65 },
    targetDate: null,
    targetWeight: 72,
    bodyFatPercent: null,
    restingHR: null,
    workoutsPerWeek: 5,
    history: [
      { date: '2026-06-01', type: 'weight', target: 75, achieved: 74.2, hit: true },
      { date: '2026-05-01', type: 'weight', target: 78, achieved: 76, hit: true },
      { date: '2026-04-01', type: 'workouts', target: 20, achieved: 18, hit: false },
    ],
  },
  notificationPrefs: {
    emailNotifications: { enabled: true, channels: ['push', 'email'] },
    workoutReminders: { enabled: true, channels: ['push'], time: '09:00' },
    mealReminders: { enabled: false, channels: ['push'], time: '12:00' },
    weeklyReports: { enabled: true, channels: ['email'] },
    streakAtRisk: { enabled: false, channels: ['push'] },
    quietHours: { start: '22:00', end: '07:00', enabled: false },
  },
  privacySettings: {
    showOnLeaderboard: true,
    sharedMetrics: ['steps', 'workouts'],
    allowFriendRequests: true,
    blockedUsers: [],
    activeSessions: [
      { id: 's1', device: 'Chrome / macOS', lastActive: '2026-07-24T10:30:00', current: true },
      { id: 's2', device: 'Safari / iPhone', lastActive: '2026-07-23T18:00:00', current: false },
    ],
  },
  connectedDevices: [
    { id: 'd1', name: 'Apple Watch', type: 'watch', connected: true, lastSynced: '2026-07-24T10:15:00', syncFrequency: 'realtime' },
    { id: 'd2', name: 'Fitbit Charge 6', type: 'tracker', connected: false, lastSynced: null, syncFrequency: 'hourly' },
    { id: 'd3', name: 'Garmin Forerunner', type: 'watch', connected: false, lastSynced: null, syncFrequency: 'daily' },
    { id: 'd4', name: 'Apple Health', type: 'health_platform', connected: false, lastSynced: null, syncFrequency: 'realtime' },
    { id: 'd5', name: 'Google Fit', type: 'health_platform', connected: false, lastSynced: null, syncFrequency: 'realtime' },
    { id: 'd6', name: 'Strava', type: 'health_platform', connected: false, lastSynced: null, syncFrequency: 'realtime' },
  ],
  appearance: {
    theme: 'smart',
    accentColor: 'green',
    density: 'comfortable',
    widgetOrder: ['steps', 'calories', 'heart', 'sleep', 'water', 'weight', 'meals', 'workouts'],
  },
}

export const demoUsers = [
  {
    id: 'u1',
    name: 'Alex Johnson',
    email: 'demo@fitmonitor.com',
    password: 'password123',
  },
]

export const demoSuggestions = suggestions
