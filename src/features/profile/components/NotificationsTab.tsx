import { Bell, Moon, Save, Zap } from 'lucide-react'
import Card from '../../../components/ui/Card'
import SectionHeader from '../../../components/ui/SectionHeader'
import Toggle from '../../../components/ui/Toggle'
import ChannelCheckboxes from '../../../components/ui/ChannelCheckboxes'
import TimePicker from '../../../components/ui/TimePicker'

const notificationTypes: { key: string; label: string; desc: string; showTime?: boolean; icon?: React.ComponentType<{ className?: string }> }[] = [
  { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive email updates and summaries' },
  { key: 'workoutReminders', label: 'Workout Reminders', desc: 'Reminders to log your workouts', showTime: true },
  { key: 'mealReminders', label: 'Meal Reminders', desc: 'Reminders to log your meals', showTime: true },
  { key: 'weeklyReports', label: 'Weekly Reports', desc: 'Weekly progress summary via email' },
  { key: 'streakAtRisk', label: 'Streak-at-Risk Alert', desc: 'Notify when you are about to lose your streak', icon: Zap },
]

interface NotificationsTabProps {
  form: { notificationPrefs: { emailNotifications: { enabled: boolean; channels: string[] }; workoutReminders: { enabled: boolean; channels: string[]; time: string }; mealReminders: { enabled: boolean; channels: string[]; time: string }; weeklyReports: { enabled: boolean; channels: string[] }; streakAtRisk: { enabled: boolean; channels: string[] }; quietHours: { start: string; end: string; enabled: boolean } } }
  updateForm: (path: string, value: unknown) => void
  handleSaveForm: () => void
  saving?: boolean
}

export default function NotificationsTab({ form, updateForm, handleSaveForm, saving }: NotificationsTabProps) {
  return (
    <Card>
      <SectionHeader Icon={Bell} title="Notification Preferences" color="blue" />

      <div className="space-y-4">
        {notificationTypes.map(({ key, label, desc, showTime, icon: Icon }) => {
          const prefs: { enabled?: boolean; channels?: string[]; time?: string } = (form.notificationPrefs as Record<string, { enabled?: boolean; channels?: string[]; time?: string }>)?.[key] || {}
          return (
            <div key={key} className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {Icon && <Icon className="w-4 h-4 text-gray-400" />}
                  <div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{desc}</p>
                  </div>
                </div>
                <Toggle
                  id={`notif_${key}`}
                  checked={prefs.enabled || false}
                  onChange={(v) => updateForm(`notificationPrefs.${key}.enabled`, v)}
                />
              </div>
              {prefs.enabled && (
                <div className="flex flex-wrap items-center gap-4 pl-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Channels:</span>
                    <ChannelCheckboxes
                      selected={prefs.channels || []}
                      onChange={(v) => updateForm(`notificationPrefs.${key}.channels`, v)}
                    />
                  </div>
                  {showTime && (
                    <TimePicker
                      label="Time"
                      value={prefs.time || '09:00'}
                      onChange={(v) => updateForm(`notificationPrefs.${key}.time`, v)}
                    />
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="mt-6 p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Moon className="w-4 h-4 text-gray-400" />
            <div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Quiet Hours</span>
              <p className="text-xs text-gray-500 dark:text-gray-400">Suppress notifications during these hours</p>
            </div>
          </div>
          <Toggle
            id="quietHours"
            checked={form.notificationPrefs?.quietHours?.enabled || false}
            onChange={(v) => updateForm('notificationPrefs.quietHours.enabled', v)}
          />
        </div>
        {form.notificationPrefs?.quietHours?.enabled && (
          <div className="flex items-center gap-4 pl-2">
            <TimePicker
              label="Start"
              value={form.notificationPrefs.quietHours.start || '22:00'}
              onChange={(v) => updateForm('notificationPrefs.quietHours.start', v)}
            />
            <span className="text-gray-400 mt-6">—</span>
            <TimePicker
              label="End"
              value={form.notificationPrefs.quietHours.end || '07:00'}
              onChange={(v) => updateForm('notificationPrefs.quietHours.end', v)}
            />
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
        Save Preferences
      </button>
    </Card>
  )
}
