import { createContext, useContext, useReducer, useCallback } from 'react'
import { getUserProfile } from '../services/api'
import type { ProfileContextValue, ProfileAction, UserProfile } from '../types'

const ProfileContext = createContext<ProfileContextValue | null>(null)

const initialState: { profile: UserProfile | null; loading: boolean; error: string | null } = { profile: null, loading: false, error: null }

function reducer(state: typeof initialState, action: ProfileAction) {
  switch (action.type) {
    case 'SET_PROFILE':
      return { ...state, profile: action.payload }
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload }
    default:
      return state
  }
}

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  const fetchProfile = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true })
    dispatch({ type: 'SET_ERROR', payload: null })
    try {
      const data = await getUserProfile()
      dispatch({ type: 'SET_PROFILE', payload: data as unknown as UserProfile })
    } catch (err: unknown) {
      dispatch({ type: 'SET_ERROR', payload: err instanceof Error ? err.message : 'Failed to fetch profile' })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [])

  return <ProfileContext.Provider value={{ ...state, dispatch, fetchProfile }}>{children}</ProfileContext.Provider>
}

export function useProfile() {
  const context = useContext(ProfileContext)
  if (!context) throw new Error('useProfile must be used within ProfileProvider')
  return context
}
