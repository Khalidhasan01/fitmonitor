import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { LogsProvider } from './context/LogsContext'
import { ProfileProvider } from './context/ProfileContext'
import { SuggestionsProvider } from './context/SuggestionsContext'
import { DarkModeProvider } from './context/DarkModeContext'
import ProtectedRoute from './features/auth/components/ProtectedRoute'
import Layout from './features/layout/components/Layout'
import Landing from './features/auth/pages/Landing'
import Dashboard from './features/dashboard/pages/Dashboard'
import WorkoutLog from './features/workouts/pages/WorkoutLog'
import MealsDiet from './features/meals/pages/MealsDiet'
import Progress from './features/progress/pages/Progress'
import History from './features/history/pages/History'
import Profile from './features/profile/pages/Profile'
import ForgotPassword from './features/auth/pages/ForgotPassword'
import ResetPassword from './features/auth/pages/ResetPassword'

function AppRoutes() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/workouts"
          element={
            <ProtectedRoute>
              <WorkoutLog />
            </ProtectedRoute>
          }
        />
        <Route
          path="/meals"
          element={
            <ProtectedRoute>
              <MealsDiet />
            </ProtectedRoute>
          }
        />
        <Route
          path="/progress"
          element={
            <ProtectedRoute>
              <Progress />
            </ProtectedRoute>
          }
        />
        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <History />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <DarkModeProvider>
        <AuthProvider>
          <LogsProvider>
            <ProfileProvider>
              <SuggestionsProvider>
                <AppRoutes />
              </SuggestionsProvider>
            </ProfileProvider>
          </LogsProvider>
        </AuthProvider>
      </DarkModeProvider>
    </BrowserRouter>
  )
}
