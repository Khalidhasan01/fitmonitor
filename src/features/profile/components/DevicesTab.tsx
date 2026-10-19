import { useState } from 'react'
import { Smartphone, Watch, Activity, Heart, Save, RefreshCw, X, Plus, Clock, AlertCircle } from 'lucide-react'
import Card from '../../../components/ui/Card'
import SectionHeader from '../../../components/ui/SectionHeader'
import Select from '../../../components/ui/Select'
import { syncFrequencyOptions } from '../../../utils/units'

const typeIcons = {
  watch: Watch,
  tracker: Activity,
  health_platform: Heart,
}

interface DevicesTabProps {
  form: { connectedDevices: { id: string; name: string; type: string; connected: boolean; lastSynced: string | null; syncFrequency: string }[] }
  handleSaveForm: () => void
  saving?: boolean
  onConnectDevice: (deviceId: string) => Promise<void>
  onDisconnectDevice: (deviceId: string) => Promise<void>
  onSyncDevice: (deviceId: string) => Promise<void>
  onUpdateDeviceSyncFrequency: (deviceId: string, syncFrequency: string) => Promise<void>
}

export default function DevicesTab({
  form, handleSaveForm, saving,
  onConnectDevice, onDisconnectDevice, onSyncDevice, onUpdateDeviceSyncFrequency,
}: DevicesTabProps) {
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  const handleToggleDevice = async (deviceId: string, currentlyConnected: boolean) => {
    setActionLoading(`toggle-${deviceId}`)
    setActionError(null)
    try {
      if (currentlyConnected) {
        await onDisconnectDevice(deviceId)
      } else {
        await onConnectDevice(deviceId)
      }
    } catch (err: unknown) {
      setActionError(err instanceof Error ? err.message : 'Failed to update device')
    } finally {
      setActionLoading(null)
    }
  }

  const handleSync = async (deviceId: string) => {
    setActionLoading(`sync-${deviceId}`)
    setActionError(null)
    try {
      await onSyncDevice(deviceId)
    } catch (err: unknown) {
      setActionError(err instanceof Error ? err.message : 'Failed to sync device')
    } finally {
      setActionLoading(null)
    }
  }

  const handleFrequencyChange = async (deviceId: string, frequency: string) => {
    setActionLoading(`freq-${deviceId}`)
    setActionError(null)
    try {
      await onUpdateDeviceSyncFrequency(deviceId, frequency)
    } catch (err: unknown) {
      setActionError(err instanceof Error ? err.message : 'Failed to update sync frequency')
    } finally {
      setActionLoading(null)
    }
  }

  const formatLastSynced = (iso: string | null) => {
    if (!iso) return 'Never'
    const d = new Date(iso)
    const now = new Date()
    const diffMs = now.getTime() - d.getTime()
    const diffMin = Math.floor(diffMs / 60000)
    if (diffMin < 1) return 'Just now'
    if (diffMin < 60) return `${diffMin}m ago`
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <Card>
      <SectionHeader Icon={Smartphone} title="Connected Devices" color="teal" />

      {actionError && (
        <div className="mb-4 flex items-center gap-2 px-3 py-2 rounded-lg text-sm bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400">
          <AlertCircle className="w-4 h-4" />
          {actionError}
        </div>
      )}

      <div className="space-y-3">
        {form.connectedDevices.map((device) => {
          const Icon = typeIcons[device.type as keyof typeof typeIcons] || Smartphone
          const isToggling = actionLoading === `toggle-${device.id}`
          const isSyncing = actionLoading === `sync-${device.id}`
          const isFreqLoading = actionLoading === `freq-${device.id}`
          return (
            <div
              key={device.id}
              className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`p-2 rounded-lg ${device.connected ? 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500'}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{device.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{device.type.replace('_', ' ')}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggleDevice(device.id, device.connected)}
                  disabled={isToggling}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed ${
                    device.connected
                      ? 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50'
                      : 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/50'
                  }`}
                >
                  {isToggling ? (
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current" />
                  ) : device.connected ? (
                    <><X className="w-3 h-3" /> Disconnect</>
                  ) : (
                    <><Plus className="w-3 h-3" /> Connect</>
                  )}
                </button>
              </div>

              {device.connected && (
                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Last synced: {formatLastSynced(device.lastSynced)}</span>
                  </div>
                  <button
                    onClick={() => handleSync(device.id)}
                    disabled={isSyncing}
                    className="flex items-center gap-1 text-xs text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 font-medium disabled:opacity-50"
                  >
                    {isSyncing ? (
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-teal-600" />
                    ) : (
                      <RefreshCw className="w-3 h-3" />
                    )}
                    Sync now
                  </button>
                  <Select
                    value={device.syncFrequency || 'realtime'}
                    onChange={(v) => handleFrequencyChange(device.id, v)}
                    options={syncFrequencyOptions}
                    disabled={isFreqLoading}
                  />
                </div>
              )}
            </div>
          )
        })}
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
        Save Changes
      </button>
    </Card>
  )
}
