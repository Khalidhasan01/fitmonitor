import { useState, useCallback } from 'react'

export function useForm<T extends Record<string, unknown>>(initialValue: T) {
  const [form, setForm] = useState<T>(() => JSON.parse(JSON.stringify(initialValue)))

  const updateForm = useCallback((path: string, value: unknown) => {
    setForm((prev: T) => {
      const copy: Record<string, unknown> = JSON.parse(JSON.stringify(prev))
      const keys = path.split('.')
      let obj = copy
      for (let i = 0; i < keys.length - 1; i++) {
        if (obj[keys[i]] === undefined) obj[keys[i]] = {}
        obj = obj[keys[i]] as Record<string, unknown>
      }
      obj[keys[keys.length - 1]] = value
      return copy as unknown as T
    })
  }, [])

  const resetForm = useCallback(() => {
    setForm(JSON.parse(JSON.stringify(initialValue)))
  }, [initialValue])

  return { form, setForm, updateForm, resetForm }
}
