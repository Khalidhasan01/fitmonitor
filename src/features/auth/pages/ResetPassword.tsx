import { useState } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'
import { Lock, Eye, EyeOff, CheckCircle, ArrowLeft } from 'lucide-react'

export default function ResetPassword() {
  const { resetPassword } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const token = searchParams.get('token') || 'mock-reset-token'

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    if (!password || !confirmPassword) {
      setError('Please fill in all fields')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    setLoading(true)
    try {
      await resetPassword(token, password)
      setDone(true)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 dark:from-gray-950 dark:to-green-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to sign in
        </Link>

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl dark:shadow-gray-900/50 border border-gray-100 dark:border-gray-700 p-6 md:p-8">
          {done ? (
            <div className="text-center">
              <div className="inline-flex p-3 rounded-full bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 mb-4">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Password Reset!</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Your password has been successfully reset.
              </p>
              <button
                onClick={() => navigate('/')}
                className="mt-6 w-full bg-green-600 text-white py-3 rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors"
              >
                Sign in with new password
              </button>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Reset Password</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                Enter your new password below.
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat your new password"
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none dark:bg-gray-800 dark:text-gray-100 ${
                        confirmPassword && password !== confirmPassword
                          ? 'border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20'
                          : 'border-gray-300 dark:border-gray-600'
                      }`}
                    />
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm px-4 py-3 rounded-lg">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                  ) : (
                    'Reset Password'
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
