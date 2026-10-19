export function kgToLb(kg: number): number {
  return kg * 2.20462
}

export function lbToKg(lb: number): number {
  return lb / 2.20462
}

export function cmToIn(cm: number): number {
  return cm / 2.54
}

export function inToCm(inches: number): number {
  return inches * 2.54
}

export function cmToFtIn(cm: number): { ft: number; inches: number } {
  const totalIn = cmToIn(cm)
  const ft = Math.floor(totalIn / 12)
  const inches = Math.round(totalIn % 12)
  return { ft, inches }
}

export function formatWeight(kg: number, system: 'metric' | 'imperial'): string {
  if (system === 'imperial') {
    return `${kgToLb(kg).toFixed(1)} lb`
  }
  return `${kg} kg`
}

export function formatHeight(cm: number, system: 'metric' | 'imperial'): string {
  if (system === 'imperial') {
    const { ft, inches } = cmToFtIn(cm)
    return `${ft}'${inches}"`
  }
  return `${cm} cm`
}

export function formatWeightValue(kg: number, system: 'metric' | 'imperial'): string | number {
  if (system === 'imperial') {
    return kgToLb(kg).toFixed(1)
  }
  return kg
}

export function formatWeightUnit(system: 'metric' | 'imperial'): string {
  return system === 'imperial' ? 'lb' : 'kg'
}

export function formatHeightUnit(system: 'metric' | 'imperial'): string {
  return system === 'imperial' ? 'ft/in' : 'cm'
}

export const timezones: string[] = (Intl as any).supportedValuesOf?.('timeZone') ?? [
  'America/New_York', 'America/Chicago', 'America/Denver',
  'America/Los_Angeles', 'Europe/London', 'Europe/Paris',
  'Europe/Berlin', 'Asia/Tokyo', 'Asia/Shanghai',
  'Asia/Kolkata', 'Australia/Sydney', 'Pacific/Auckland',
]

interface ActivityLevelOption {
  value: string
  label: string
  description: string
}

export const activityLevels: ActivityLevelOption[] = [
  { value: 'sedentary', label: 'Sedentary', description: 'Little or no exercise' },
  { value: 'light', label: 'Lightly Active', description: '1-3 days/week' },
  { value: 'moderate', label: 'Moderately Active', description: '3-5 days/week' },
  { value: 'active', label: 'Very Active', description: '6-7 days/week' },
  { value: 'very_active', label: 'Extremely Active', description: 'Twice daily / physical job' },
]

export function estimateMaintenanceCalories(weightKg: number, activityLevel: string): number {
  const multipliers: Record<string, number> = {
    sedentary: 24,
    light: 26.5,
    moderate: 29,
    active: 31.5,
    very_active: 34,
  }
  const mult = multipliers[activityLevel] || 29
  return Math.round(weightKg * mult)
}

interface SyncFrequencyOption {
  value: string
  label: string
}

export const syncFrequencyOptions: SyncFrequencyOption[] = [
  { value: 'realtime', label: 'Real-time' },
  { value: 'hourly', label: 'Hourly' },
  { value: 'daily', label: 'Daily' },
]
