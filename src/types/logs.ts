export interface ExerciseSet {
  set: number
  reps: number | null
  weight: number | null
  duration: number | null
}

export interface Exercise {
  id: string
  exerciseDefinitionId: string | null
  name: string
  muscleGroup: string
  sets: ExerciseSet[]
}

export interface Workout {
  id: string
  date: string
  exercises: Exercise[]
}

export interface ExerciseDefinition {
  id: string
  name: string
  muscleGroup: string
}

export interface CreateSetRequest {
  reps: number | null
  weight: number | null
  duration: number | null
}

export interface CreateExerciseRequest {
  exerciseDefinitionId: string
  sets: CreateSetRequest[]
}

export interface CreateWorkoutRequest {
  date: string
  exercises: CreateExerciseRequest[]
}

export interface WorkoutTemplate {
  id: string
  name: string
  exercises: TemplateExercise[]
  createdAt: string
  updatedAt: string
}

export interface TemplateExercise {
  exerciseDefinitionId: string
  name: string
  muscleGroup: string
  sets: TemplateSet[]
}

export interface TemplateSet {
  reps: number | null
  weight: number | null
  duration: number | null
}

export interface CreateWorkoutTemplateRequest {
  name: string
  exercises: CreateExerciseRequest[]
}

export interface Meal {
  id: string
  name: string
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  calories: number
  protein: number
  carbs: number
  fat: number
}

export interface DailyLog {
  date: string
  steps: number
  caloriesBurned: number
  caloriesConsumed: number
  heartRateAvg: number
  sleepHours: number
  waterCups: number
  weight: number
  meals: Meal[]
  workouts: Workout[]
}
