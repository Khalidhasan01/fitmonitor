import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'

export default function ForgotPassword() {
  const { forgotPassword } = useAuth()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    if (!email) {
      setError('Please enter your email')
      return
    }
    setLoading(true)
    try {
      await forgotPassword(email)
      setSent(true)
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
          {sent ? (
            <div className="text-center">
              <div className="inline-flex p-3 rounded-full bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 mb-4">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Check your email</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                We've sent a password reset link to <strong>{email}</strong>
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-4">
                Didn't receive the email?{' '}
                <button onClick={() => setSent(false)} className="text-green-600 dark:text-green-400 hover:text-green-700 font-medium">
                  Try again
                </button>
              </p>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Forgot Password</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                Enter your email and we'll send you a reset link.
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
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
                    'Send Reset Link'
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
