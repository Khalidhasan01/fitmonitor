import { NavLink } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'
import {
  LayoutDashboard,
  Dumbbell,
  Apple,
  BarChart3,
  Calendar,
  Settings,
  Activity,
} from 'lucide-react'

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/workouts', label: 'Workouts', icon: Dumbbell },
  { to: '/meals', label: 'Meals & Diet', icon: Apple },
  { to: '/progress', label: 'Progress', icon: BarChart3 },
  { to: '/history', label: 'History', icon: Calendar },
  { to: '/profile', label: 'Profile', icon: Settings },
]

export default function Sidebar({ onNavigate }: { onNavigate: () => void }) {
  const { user } = useAuth()

  return (
    <aside className="w-64 bg-gray-900 text-white flex flex-col h-screen">
      <div className="flex items-center gap-2 px-6 py-5 border-b border-gray-700">
        <Activity className="w-6 h-6 text-green-400" />
        <span className="text-lg font-bold tracking-tight">FitMonitor</span>
      </div>

      {user && (
        <div className="px-6 py-3 border-b border-gray-700 bg-gray-800/50">
          <p className="text-sm font-medium text-white truncate">{user.name}</p>
          <p className="text-xs text-gray-400 truncate">{user.email}</p>
        </div>
      )}

      <nav className="flex-1 py-4">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/dashboard'}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-green-600 text-white border-r-3 border-green-400'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`
            }
          >
            <Icon className="w-5 h-5" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-6 py-4 border-t border-gray-700 text-xs text-gray-500">
        FitMonitor v1.0
      </div>
    </aside>
  )
}
