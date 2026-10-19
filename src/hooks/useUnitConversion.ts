import { useMemo } from 'react'
import { formatWeight, formatHeight, formatWeightValue, formatWeightUnit, formatHeightUnit } from '../utils/units'
import type { UnitSystem } from '../types'

export function useUnitConversion(unitSystem?: UnitSystem) {
  return useMemo(() => ({
    formatWeight: (kg: number) => formatWeight(kg, unitSystem || 'metric'),
    formatHeight: (cm: number) => formatHeight(cm, unitSystem || 'metric'),
    formatWeightValue: (kg: number) => formatWeightValue(kg, unitSystem || 'metric'),
    weightUnit: formatWeightUnit(unitSystem || 'metric'),
    heightUnit: formatHeightUnit(unitSystem || 'metric'),
    isMetric: (unitSystem || 'metric') === 'metric',
  }), [unitSystem])
}
