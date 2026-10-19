import { createContext, useContext, useReducer, useCallback } from 'react'
import { getDailyLogs } from '../services/api'
import type { LogsContextValue, LogsAction, DailyLog } from '../types'

const LogsContext = createContext<LogsContextValue | null>(null)

const initialState: { logs: DailyLog[]; loading: boolean; error: string | null } = { logs: [], loading: false, error: null }

function reducer(state: typeof initialState, action: LogsAction) {
  switch (action.type) {
    case 'SET_LOGS':
      return { ...state, logs: action.payload }
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload }
    default:
      return state
  }
}

export function LogsProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  const fetchLogs = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true })
    dispatch({ type: 'SET_ERROR', payload: null })
    try {
      const data = await getDailyLogs()
      dispatch({ type: 'SET_LOGS', payload: data })
    } catch (err: unknown) {
      dispatch({ type: 'SET_ERROR', payload: err instanceof Error ? err.message : 'Failed to fetch logs' })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [])

  return <LogsContext.Provider value={{ ...state, dispatch, fetchLogs }}>{children}</LogsContext.Provider>
}

export function useLogs() {
  const context = useContext(LogsContext)
  if (!context) throw new Error('useLogs must be used within LogsProvider')
  return context
}
