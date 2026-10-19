import { createContext, useContext, useReducer, useCallback } from 'react'
import { getSuggestions } from '../services/api'
import type { SuggestionsContextValue, SuggestionsAction, Suggestion } from '../types'

const SuggestionsContext = createContext<SuggestionsContextValue | null>(null)

const initialState: { suggestions: Suggestion[]; loading: boolean; error: string | null } = { suggestions: [], loading: false, error: null }

function reducer(state: typeof initialState, action: SuggestionsAction) {
  switch (action.type) {
    case 'SET_SUGGESTIONS':
      return { ...state, suggestions: action.payload }
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload }
    default:
      return state
  }
}

export function SuggestionsProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  const fetchSuggestions = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true })
    dispatch({ type: 'SET_ERROR', payload: null })
    try {
      const data = await getSuggestions()
      dispatch({ type: 'SET_SUGGESTIONS', payload: data })
    } catch (err: unknown) {
      dispatch({ type: 'SET_ERROR', payload: err instanceof Error ? err.message : 'Failed to fetch suggestions' })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [])

  return <SuggestionsContext.Provider value={{ ...state, dispatch, fetchSuggestions }}>{children}</SuggestionsContext.Provider>
}

export function useSuggestions() {
  const context = useContext(SuggestionsContext)
  if (!context) throw new Error('useSuggestions must be used within SuggestionsProvider')
  return context
}
