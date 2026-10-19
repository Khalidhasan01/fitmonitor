import { createContext, useContext, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLocalStorage } from '../hooks/useLocalStorage'
import type { AuthContextValue, AuthSession } from '../types'
import * as api from '../services/api'

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useLocalStorage<AuthSession | null>('fitmonitor_auth', null)
  const navigate = useNavigate()

  const login = useCallback(async (email: string, password: string) => {
    const result = await api.login(email, password)
    setSession(result)
    navigate('/dashboard')
  }, [navigate])

  const signup = useCallback(async (name: string, email: string, password: string) => {
    const result = await api.signup(name, email, password)
    setSession(result)
    navigate('/dashboard')
  }, [navigate])

  const logout = useCallback(async () => {
    await api.logout()
    setSession(null)
    navigate('/')
  }, [navigate])

  const forgotPassword = useCallback(async (email: string) => {
    return await api.forgotPassword(email)
  }, [])

  const resetPassword = useCallback(async (token: string, password: string) => {
    return await api.resetPassword(token, password)
  }, [])

  const deleteAccount = useCallback(async () => {
    if (!session) return
    await api.deleteAccount(session.user.id)
    setSession(null)
    navigate('/')
  }, [session, navigate])

  return (
    <AuthContext.Provider
      value={{
        user: session?.user || null,
        token: session?.token || null,
        isAuthenticated: !!session,
        login,
        signup,
        logout,
        forgotPassword,
        resetPassword,
        deleteAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
