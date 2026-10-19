import { useState } from 'react'
import { Shield, Share2, Users, UserMinus, Smartphone, Save, Footprints, Weight, Dumbbell, Apple, Heart, X, AlertCircle, Loader2 } from 'lucide-react'
import Card from '../../../components/ui/Card'
import SectionHeader from '../../../components/ui/SectionHeader'
import Toggle from '../../../components/ui/Toggle'
import MetricCheckboxGroup from '../../../components/ui/MetricCheckboxGroup'

interface PrivacyTabProps {
  form: { privacySettings: { showOnLeaderboard: boolean; sharedMetrics: string[]; allowFriendRequests: boolean; blockedUsers: { id: string; name: string }[]; activeSessions: { id: string; device: string; current: boolean; lastActive: string }[] } }
  updateForm: (path: string, value: unknown) => void
  handleSaveForm: () => void
  saving?: boolean
  onRemoveSession: (sessionId: string) => Promise<void>
  onRemoveBlockedUser: (userId: string) => Promise<void>
}

export default function PrivacyTab({ form, updateForm, handleSaveForm, saving, onRemoveSession, onRemoveBlockedUser }: PrivacyTabProps) {
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  const metricOptions = [
    { value: 'steps', label: 'Steps', icon: Footprints },
    { value: 'weight', label: 'Weight', icon: Weight },
    { value: 'workouts', label: 'Workouts', icon: Dumbbell },
    { value: 'meals', label: 'Meals', icon: Apple },
    { value: 'heartRate', label: 'Heart Rate', icon: Heart },
  ]
  const sharedMetrics = form.privacySettings?.sharedMetrics || []

  const handleRemoveBlockedUser = async (userId: string) => {
    setActionLoading(`block-${userId}`)
    setActionError(null)
    try {
      await onRemoveBlockedUser(userId)
    } catch (err: unknown) {
      setActionError(err instanceof Error ? err.message : 'Failed to remove blocked user')
    } finally {
      setActionLoading(null)
    }
  }

  const handleRemoveSession = async (sessionId: string) => {
    setActionLoading(`session-${sessionId}`)
    setActionError(null)
    try {
      await onRemoveSession(sessionId)
    } catch (err: unknown) {
      setActionError(err instanceof Error ? err.message : 'Failed to sign out session')
    } finally {
      setActionLoading(null)
    }
  }

  return (
    <Card>
      <SectionHeader Icon={Shield} title="Privacy Settings" color="purple" />

      {actionError && (
        <div className="mb-4 flex items-center gap-2 px-3 py-2 rounded-lg text-sm bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400">
          <AlertCircle className="w-4 h-4" />
          {actionError}
        </div>
      )}

      <div className="space-y-4">
        <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-400" />
              <div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Show on Leaderboard</span>
                <p className="text-xs text-gray-500 dark:text-gray-400">Appear on public rankings</p>
              </div>
            </div>
            <Toggle
              id="showOnLeaderboard"
              checked={form.privacySettings?.showOnLeaderboard || false}
              onChange={(v) => updateForm('privacySettings.showOnLeaderboard', v)}
            />
          </div>
        </div>

        <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Share2 className="w-4 h-4 text-gray-400" />
              <div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Share Progress</span>
                <p className="text-xs text-gray-500 dark:text-gray-400">Choose which metrics to share</p>
              </div>
            </div>
          </div>
          <div className="pl-6">
            <MetricCheckboxGroup
              options={metricOptions}
              selected={sharedMetrics}
              onChange={(v) => updateForm('privacySettings.sharedMetrics', v)}
            />
          </div>
        </div>

        <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UserMinus className="w-4 h-4 text-gray-400" />
              <div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Allow Friend Requests</span>
                <p className="text-xs text-gray-500 dark:text-gray-400">Receive connection requests from others</p>
              </div>
            </div>
            <Toggle
              id="allowFriendRequests"
              checked={form.privacySettings?.allowFriendRequests || false}
              onChange={(v) => updateForm('privacySettings.allowFriendRequests', v)}
            />
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 mb-3">
          <Smartphone className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Active Sessions</span>
        </div>
        <div className="space-y-2">
          {(form.privacySettings?.activeSessions || []).map((session: { id: string; device: string; current: boolean; lastActive: string }) => {
            const isRemoving = actionLoading === `session-${session.id}`
            return (
              <div key={session.id} className="flex items-center justify-between p-3 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{session.device}</p>
                    {session.current && (
                      <span className="text-xs px-1.5 py-0.5 rounded bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-medium">Current</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Last active: {new Date(session.lastActive).toLocaleString()}
                  </p>
                </div>
                {!session.current && (
                  <button
                    onClick={() => handleRemoveSession(session.id)}
                    disabled={isRemoving}
                    className="text-xs text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                  >
                    {isRemoving ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : null}
                    Sign Out
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </div>

      <div className="mt-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 mb-3">
          <UserMinus className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Blocked Users</span>
        </div>
        {(form.privacySettings?.blockedUsers || []).length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400 pl-6">No blocked users</p>
        ) : (
          <div className="space-y-2">
            {form.privacySettings.blockedUsers.map((user: { id: string; name: string }) => {
              const isRemoving = actionLoading === `block-${user.id}`
              return (
                <div key={user.id} className="flex items-center justify-between p-3 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-500">
                      {user.name?.charAt(0) || '?'}
                    </div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{user.name}</p>
                  </div>
                  <button
                    onClick={() => handleRemoveBlockedUser(user.id)}
                    disabled={isRemoving}
                    className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 disabled:opacity-50"
                  >
                    {isRemoving ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <X className="w-4 h-4" />
                    )}
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <button
        onClick={handleSaveForm}
        disabled={saving}
        className="mt-6 flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {saving ? (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
        ) : (
          <Save className="w-4 h-4" />
        )}
        Save Settings
      </button>
    </Card>
  )
}
