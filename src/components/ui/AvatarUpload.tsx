import { Camera, Loader2 } from 'lucide-react'
import { useState } from 'react'

interface Props {
  avatarUrl: string | null
  name: string
  onUpload: (file: File) => Promise<void>
  onDelete?: () => Promise<void>
}

export default function AvatarUpload({ avatarUrl, name, onUpload, onDelete }: Props) {
  const [uploading, setUploading] = useState(false)

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      await onUpload(file)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="flex items-center gap-4">
      <div className="relative">
        <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden flex items-center justify-center">
          {uploading ? (
            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
          ) : avatarUrl ? (
            <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <span className="text-2xl font-bold text-gray-400 dark:text-gray-500">
              {name?.charAt(0) || '?'}
            </span>
          )}
        </div>
        <label className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-green-600 text-white cursor-pointer hover:bg-green-700 transition-colors">
          <Camera className="w-3.5 h-3.5" />
          <input type="file" accept="image/*" onChange={handleChange} className="hidden" disabled={uploading} />
        </label>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{name}</p>
        {avatarUrl && onDelete ? (
          <button onClick={onDelete} className="text-xs text-red-600 dark:text-red-400 hover:underline">
            Remove photo
          </button>
        ) : (
          <p className="text-xs text-gray-500 dark:text-gray-400">Change photo</p>
        )}
      </div>
    </div>
  )
}
