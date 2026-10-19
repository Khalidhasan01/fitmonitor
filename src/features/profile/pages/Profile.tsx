import { useState, useCallback, useEffect } from 'react'
import { useActivityStreak } from '../../../hooks/useActivityStreak'
import { useProfile } from '../../../context/ProfileContext'
import { useLogs } from '../../../context/LogsContext'
import { useAuth } from '../../../context/AuthContext'
import { useDarkMode } from '../../../context/DarkModeContext'
import LoadingSpinner from '../../../components/ui/LoadingSpinner'
import PageHeader from '../../../components/ui/PageHeader'
import Card from '../../../components/ui/Card'
import { User, Target, Bell, Shield, Smartphone, Palette, Trash2, LogOut, Flame, CheckCircle, AlertCircle } from 'lucide-react'
import ConfirmModal from '../../../components/ui/ConfirmModal'
import PersonalTab from '../components/PersonalTab'
import GoalsTab from '../components/GoalsTab'
import NotificationsTab from '../components/NotificationsTab'
import PrivacyTab from '../components/PrivacyTab'
import DevicesTab from '../components/DevicesTab'
import AppearanceTab from '../components/AppearanceTab'
import type { UserProfile } from '../../../types'
import {
  updatePersonal,
  updateGoals,
  updateNotifications,
  updatePrivacy,
  updateDevices,
  updateAppearance,
  uploadAvatar,
  deleteAvatar,
  connectDevice,
  disconnectDevice,
  syncDevice,
  updateDeviceSyncFrequency,
  deleteSession,
  deleteBlockedUser,
  deleteProfileAccount,
} from '../../../services/api'

export default function Profile() {
  const { profile, loading: profileLoading, dispatch, fetchProfile } = useProfile()
  const { logs, loading: logsLoading, fetchLogs } = useLogs()

  useEffect(() => {
    fetchLogs()
    fetchProfile()
  }, [fetchLogs, fetchProfile])

  const loading = profileLoading || logsLoading
  const { logout } = useAuth()
  const { theme, setTheme, setAccentColor, setDensity } = useDarkMode()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState<UserProfile | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const tabs = [
    { id: 'personal', label: 'Personal', icon: User },
    { id: 'goals', label: 'Goals', icon: Target },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'devices', label: 'Devices', icon: Smartphone },
    { id: 'appearance', label: 'Appearance', icon: Palette },
  ]
  const [activeTab, setActiveTab] = useState(tabs[0].id)

  const updateForm = useCallback((path: string, value: unknown) => {
    setForm((prev) => {
      const newForm = JSON.parse(JSON.stringify(prev))
      const keys = path.split('.')
      let obj = newForm
      for (let i = 0; i < keys.length - 1; i++) {
        if (obj[keys[i]] === undefined) obj[keys[i]] = {}
        obj = obj[keys[i]]
      }
      obj[keys[keys.length - 1]] = value
      return newForm
    })
  }, [])

  const applyUpdatedProfile = useCallback((updated: UserProfile) => {
    dispatch({ type: 'SET_PROFILE', payload: JSON.parse(JSON.stringify(updated)) })
    setForm(JSON.parse(JSON.stringify(updated)))

    if (updated.appearance?.theme && updated.appearance.theme !== theme) {
      setTheme(updated.appearance.theme)
    }
    if (updated.appearance?.accentColor) {
      setAccentColor(updated.appearance.accentColor)
    }
    if (updated.appearance?.density) {
      setDensity(updated.appearance.density)
    }
  }, [dispatch, theme, setTheme, setAccentColor, setDensity])

  const handleSaveForm = useCallback(async () => {
    if (!form) return
    setSaving(true)
    setSaveMessage(null)
    try {
      let updated: UserProfile
      switch (activeTab) {
        case 'personal':
          updated = await updatePersonal({
            name: form.name,
            age: form.age,
            height: form.height,
            weight: form.weight,
            goalWeight: form.goalWeight,
            unitSystem: form.unitSystem,
            activityLevel: form.activityLevel,
            timezone: form.timezone,
            bio: form.bio,
          })
          break
        case 'goals':
          updated = await updateGoals(form.goals as unknown as Record<string, unknown>)
          break
        case 'notifications':
          updated = await updateNotifications(form.notificationPrefs as unknown as Record<string, unknown>)
          break
        case 'privacy':
          updated = await updatePrivacy(form.privacySettings as unknown as Record<string, unknown>)
          break
        case 'devices':
          updated = await updateDevices(form.connectedDevices as unknown as Record<string, unknown>[])
          break
        case 'appearance':
          updated = await updateAppearance(form.appearance as unknown as Record<string, unknown>)
          break
        default:
          return
      }
      applyUpdatedProfile(updated)
      setSaveMessage({ type: 'success', text: 'Changes saved successfully' })
    } catch (err: unknown) {
      setSaveMessage({ type: 'error', text: err instanceof Error ? err.message : 'Failed to save changes' })
    } finally {
      setSaving(false)
    }
  }, [form, activeTab, applyUpdatedProfile])

  // ── Per-tab action handlers ─────────────────────────────────────

  const handleUploadAvatar = useCallback(async (file: File): Promise<void> => {
    const { avatarUrl } = await uploadAvatar(file)
    setForm((prev) => {
      if (!prev) return prev
      return { ...JSON.parse(JSON.stringify(prev)), avatarUrl }
    })
    dispatch({ type: 'SET_PROFILE', payload: JSON.parse(JSON.stringify({ ...form, avatarUrl })) })
  }, [dispatch, form])

  const handleDeleteAvatar = useCallback(async (): Promise<void> => {
    const updated = await deleteAvatar()
    applyUpdatedProfile(updated)
  }, [applyUpdatedProfile])

  const handleRemoveSession = useCallback(async (sessionId: string): Promise<void> => {
    const updated = await deleteSession(sessionId)
    applyUpdatedProfile(updated)
  }, [applyUpdatedProfile])

  const handleRemoveBlockedUser = useCallback(async (userId: string): Promise<void> => {
    const updated = await deleteBlockedUser(userId)
    applyUpdatedProfile(updated)
  }, [applyUpdatedProfile])

  const handleConnectDevice = useCallback(async (deviceId: string): Promise<void> => {
    const updated = await connectDevice(deviceId)
    applyUpdatedProfile(updated)
  }, [applyUpdatedProfile])

  const handleDisconnectDevice = useCallback(async (deviceId: string): Promise<void> => {
    const updated = await disconnectDevice(deviceId)
    applyUpdatedProfile(updated)
  }, [applyUpdatedProfile])

  const handleSyncDevice = useCallback(async (deviceId: string): Promise<void> => {
    const updated = await syncDevice(deviceId)
    applyUpdatedProfile(updated)
  }, [applyUpdatedProfile])

  const handleUpdateDeviceSyncFrequency = useCallback(async (deviceId: string, syncFrequency: string): Promise<void> => {
    const updated = await updateDeviceSyncFrequency(deviceId, syncFrequency)
    applyUpdatedProfile(updated)
  }, [applyUpdatedProfile])

  const handleDeleteAccount = useCallback(async () => {
    try {
      await deleteProfileAccount()
      localStorage.removeItem('fitmonitor_auth')
      window.location.href = '/'
    } catch (err: unknown) {
      setSaveMessage({ type: 'error', text: err instanceof Error ? err.message : 'Failed to delete account' })
    }
  }, [])

  const activityStreak = useActivityStreak(logs)

  if (loading) return <LoadingSpinner />

  if (!profile) return null

  if (!form) {
    setForm(JSON.parse(JSON.stringify(profile)))
    return null
  }

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <PageHeader title="Profile & Settings" subtitle="Manage your account and preferences" />
        <div className="flex items-center gap-3">
          {saveMessage && (
            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
              saveMessage.type === 'success'
                ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                : 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400'
            }`}>
              {saveMessage.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              {saveMessage.text}
            </div>
          )}
          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="lg:col-span-1">
          <Card padding={false} className="p-3 md:p-4 space-y-1">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${
                  activeTab === id
                    ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </Card>

          <Card className="mt-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">BMI</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {(form.weight / ((form.height / 100) ** 2)).toFixed(1)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Weight to Goal</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {(form.weight - form.goalWeight).toFixed(1)} kg
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Activity Streak</span>
                <span className="inline-flex items-center gap-1 font-medium text-orange-600 dark:text-orange-400">
                  <Flame className="w-4 h-4" />
                  {activityStreak} days
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Total Logged Days</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">{logs.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Workout Days</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {logs.filter((l) => l.workouts.length > 0).length}
                </span>
              </div>
            </div>
          </Card>

          <div className="bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 rounded-xl border border-green-200 dark:border-green-800 p-4 md:p-5 mt-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">Stay Motivated</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 italic">
              "The only bad workout is the one that didn't happen."
            </p>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-4 md:space-y-6">
          {activeTab === 'personal' && (
            <PersonalTab
              form={form}
              updateForm={updateForm}
              editing={editing}
              setEditing={setEditing}
              handleSaveForm={handleSaveForm}
              saving={saving}
              onUploadAvatar={handleUploadAvatar}
              onDeleteAvatar={handleDeleteAvatar}
            />
          )}

          {activeTab === 'goals' && (
            <GoalsTab form={form} updateForm={updateForm} handleSaveForm={handleSaveForm} saving={saving} />
          )}

          {activeTab === 'notifications' && (
            <NotificationsTab form={form} updateForm={updateForm} handleSaveForm={handleSaveForm} saving={saving} />
          )}

          {activeTab === 'privacy' && (
            <PrivacyTab
              form={form}
              updateForm={updateForm}
              handleSaveForm={handleSaveForm}
              saving={saving}
              onRemoveSession={handleRemoveSession}
              onRemoveBlockedUser={handleRemoveBlockedUser}
            />
          )}

          {activeTab === 'devices' && (
            <DevicesTab
              form={form}
              handleSaveForm={handleSaveForm}
              saving={saving}
              onConnectDevice={handleConnectDevice}
              onDisconnectDevice={handleDisconnectDevice}
              onSyncDevice={handleSyncDevice}
              onUpdateDeviceSyncFrequency={handleUpdateDeviceSyncFrequency}
            />
          )}

          {activeTab === 'appearance' && (
            <AppearanceTab form={form} updateForm={updateForm} handleSaveForm={handleSaveForm} saving={saving} />
          )}

          <Card className="border-red-200 dark:border-red-900/50">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Danger Zone</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Permanently delete your account and all data</p>
              </div>
            </div>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Delete Account
            </button>
          </Card>
        </div>
      </div>

      <ConfirmModal
        open={showDeleteModal}
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={() => { handleDeleteAccount(); setShowDeleteModal(false) }}
        title="Delete Account"
        message="This action cannot be undone. All your data including logs, workouts, and profile information will be permanently erased."
        confirmLabel="Delete Forever"
        confirmVariant="red"
      />
    </div>
  )
}
