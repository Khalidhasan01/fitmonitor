import { useState } from 'react'
import { useAuth } from '../../../context/AuthContext'
import LoginForm from '../components/LoginForm'
import SignupForm from '../components/SignupForm'
import { Activity, Dumbbell, Heart, TrendingUp } from 'lucide-react'

export default function Landing() {
  const { isAuthenticated } = useAuth()
  const [showLogin, setShowLogin] = useState(true)

  if (isAuthenticated) {
    window.location.href = '/dashboard'
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 dark:from-gray-950 dark:to-green-950 flex flex-col lg:flex-row">
      <div className="flex-1 flex flex-col justify-center px-6 md:px-8 lg:px-16 xl:px-24 py-8 lg:py-0">
        <div className="max-w-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-2xl bg-green-600">
              <Activity className="w-8 h-8 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">FitMonitor</span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-gray-100 leading-tight">
            Your Complete<br />
            <span className="text-green-600">Fitness Companion</span>
          </h1>
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 mt-4 max-w-md">
            Track workouts, monitor nutrition, visualize progress, and achieve your fitness goals — all in one place.
          </p>

          <div className="grid grid-cols-3 gap-3 md:gap-4 mt-10">
            <div className="flex flex-col items-center text-center p-3 md:p-4 rounded-xl bg-white/60 dark:bg-gray-800/60 backdrop-blur border border-gray-200 dark:border-gray-700">
              <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mb-2">
                <Dumbbell className="w-5 h-5" />
              </div>
              <p className="text-xs font-semibold text-gray-900 dark:text-gray-100">Workouts</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Log & track</p>
            </div>
            <div className="flex flex-col items-center text-center p-3 md:p-4 rounded-xl bg-white/60 dark:bg-gray-800/60 backdrop-blur border border-gray-200 dark:border-gray-700">
              <div className="p-2 rounded-lg bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 mb-2">
                <Heart className="w-5 h-5" />
              </div>
              <p className="text-xs font-semibold text-gray-900 dark:text-gray-100">Health</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Monitor metrics</p>
            </div>
            <div className="flex flex-col items-center text-center p-3 md:p-4 rounded-xl bg-white/60 dark:bg-gray-800/60 backdrop-blur border border-gray-200 dark:border-gray-700">
              <div className="p-2 rounded-lg bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 mb-2">
                <TrendingUp className="w-5 h-5" />
              </div>
              <p className="text-xs font-semibold text-gray-900 dark:text-gray-100">Progress</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">See results</p>
            </div>
          </div>

          <p className="text-xs text-gray-400 dark:text-gray-500 mt-8">
            Demo account: demo@fitmonitor.com / password123
          </p>
        </div>
      </div>

      <div className="w-full max-w-md lg:max-w-lg xl:max-w-xl flex items-center justify-center px-6 md:px-8 pb-8 lg:pb-0 lg:pr-8 xl:pr-16">
        <div className="w-full bg-white dark:bg-gray-900 rounded-2xl shadow-xl dark:shadow-gray-900/50 border border-gray-100 dark:border-gray-700 p-6 md:p-8">
          <div className="flex gap-1 mb-8 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setShowLogin(true)}
              className={`flex-1 py-2.5 text-sm font-medium rounded-md transition-all ${
                showLogin ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setShowLogin(false)}
              className={`flex-1 py-2.5 text-sm font-medium rounded-md transition-all ${
                !showLogin ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Sign Up
            </button>
          </div>

          {showLogin ? (
            <LoginForm onToggle={() => setShowLogin(false)} />
          ) : (
            <SignupForm onToggle={() => setShowLogin(true)} />
          )}
        </div>
      </div>
    </div>
  )
}
