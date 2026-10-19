import { User, Settings, Save, Ruler, Weight, Target, Activity, Globe2, FileText } from 'lucide-react'
import Card from '../../../components/ui/Card'
import SectionHeader from '../../../components/ui/SectionHeader'
import AvatarUpload from '../../../components/ui/AvatarUpload'
import FormInput from '../../../components/ui/FormInput'
import Select from '../../../components/ui/Select'
import { activityLevels, timezones } from '../../../utils/units'
import type { UserProfile } from '../../../types'

interface PersonalTabProps {
  form: UserProfile
  updateForm: (path: string, value: unknown) => void
  editing: boolean
  setEditing: (v: boolean) => void
  handleSaveForm: () => void
  saving?: boolean
  onUploadAvatar: (file: File) => Promise<void>
  onDeleteAvatar: () => Promise<void>
}

export default function PersonalTab({ form, updateForm, editing, setEditing, handleSaveForm, saving, onUploadAvatar, onDeleteAvatar }: PersonalTabProps) {
  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <SectionHeader Icon={User} title="Personal Info" />
        <button
          onClick={() => setEditing(!editing)}
          className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium"
        >
          <Settings className="w-4 h-4" />
          {editing ? 'Cancel' : 'Edit'}
        </button>
      </div>

      {editing ? (
        <div className="space-y-6">
          <AvatarUpload
            avatarUrl={form.avatarUrl}
            name={form.name}
            onUpload={onUploadAvatar}
            onDelete={onDeleteAvatar}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput label="Name" value={form.name} onChange={(e) => updateForm('name', e.target.value)} />
            <FormInput label="Age" type="number" value={form.age} onChange={(e) => updateForm('age', Number(e.target.value))} />
            <FormInput label={`Height (cm)`} type="number" value={form.height} onChange={(e) => updateForm('height', Number(e.target.value))} />
            <FormInput label={`Current Weight (kg)`} type="number" value={form.weight} onChange={(e) => updateForm('weight', Number(e.target.value))} />
            <FormInput label={`Goal Weight (kg)`} type="number" value={form.goalWeight} onChange={(e) => updateForm('goalWeight', Number(e.target.value))} />
            <Select
              label="Unit System"
              value={form.unitSystem}
              onChange={(v) => updateForm('unitSystem', v)}
              options={[
                { value: 'metric', label: 'Metric (kg, cm)' },
                { value: 'imperial', label: 'Imperial (lb, ft/in)' },
              ]}
            />
            <Select
              label="Activity Level"
              value={form.activityLevel}
              onChange={(v) => updateForm('activityLevel', v)}
              options={activityLevels.map(a => ({ value: a.value, label: a.label }))}
            />
            <Select
              label="Timezone"
              value={form.timezone}
              onChange={(v) => updateForm('timezone', v)}
              options={timezones.map(tz => ({ value: tz, label: tz }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bio</label>
            <textarea
              value={form.bio}
              onChange={(e) => updateForm('bio', e.target.value)}
              rows={3}
              maxLength={500}
              placeholder="Tell us about yourself..."
              className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none resize-none"
            />
            <p className="text-xs text-gray-400 mt-1 text-right">{form.bio?.length || 0}/500</p>
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => { handleSaveForm?.(); setEditing(false) }}
              disabled={saving}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Save Changes
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden flex items-center justify-center">
              {form.avatarUrl ? (
                <img src={form.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-xl font-bold text-gray-400 dark:text-gray-500">
                  {form.name?.charAt(0) || '?'}
                </span>
              )}
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{form.name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{form.age} years old</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
              <Ruler className="w-5 h-5 text-gray-400 dark:text-gray-500 mb-2" />
              <p className="text-xs text-gray-500 dark:text-gray-400">Height</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{form.height} cm</p>
            </div>
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
              <Weight className="w-5 h-5 text-gray-400 dark:text-gray-500 mb-2" />
              <p className="text-xs text-gray-500 dark:text-gray-400">Current Weight</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{form.weight} kg</p>
            </div>
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
              <Target className="w-5 h-5 text-gray-400 dark:text-gray-500 mb-2" />
              <p className="text-xs text-gray-500 dark:text-gray-400">Goal Weight</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{form.goalWeight} kg</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
              <Activity className="w-4 h-4 text-gray-400 dark:text-gray-500 mb-1" />
              <p className="text-xs text-gray-500 dark:text-gray-400">Activity Level</p>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 capitalize">
                {form.activityLevel?.replace('_', ' ') || 'Moderate'}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
              <Globe2 className="w-4 h-4 text-gray-400 dark:text-gray-500 mb-1" />
              <p className="text-xs text-gray-500 dark:text-gray-400">Timezone</p>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate" title={form.timezone}>
                {form.timezone?.split('/').pop()?.replace('_', ' ') || 'Auto'}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
              <FileText className="w-4 h-4 text-gray-400 dark:text-gray-500 mb-1" />
              <p className="text-xs text-gray-500 dark:text-gray-400">Unit System</p>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 capitalize">{form.unitSystem}</p>
            </div>
          </div>

          {form.bio && (
            <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Bio</p>
              <p className="text-sm text-gray-900 dark:text-gray-100">{form.bio}</p>
            </div>
          )}
        </div>
      )}
    </Card>
  )
}
