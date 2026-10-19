import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useDarkMode } from '../../../context/DarkModeContext'

interface SleepChartProps {
  data: Array<{ date: string; sleepHours: number }>
}

export default function SleepChart({ data }: SleepChartProps) {
  const { theme } = useDarkMode()
  const isDark = theme === 'dark' || (theme === 'smart' && window.matchMedia('(prefers-color-scheme: dark)').matches)
  const gridColor = isDark ? '#374151' : '#f0f0f0'
  const textColor = isDark ? '#9ca3af' : '#666'

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-4 md:p-6">
      <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Sleep Hours</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12, fill: textColor }}
            tickFormatter={(d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          />
          <YAxis domain={[0, 10]} tick={{ fontSize: 12, fill: textColor }} />
          <Tooltip
            labelFormatter={(d) => new Date(d as string).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
            formatter={(value) => [`${value ?? ''} hours`, 'Sleep']}
            contentStyle={isDark ? { background: '#1f2937', border: '1px solid #374151', borderRadius: '8px', color: '#f3f4f6' } : {}}
          />
          <Bar dataKey="sleepHours" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
