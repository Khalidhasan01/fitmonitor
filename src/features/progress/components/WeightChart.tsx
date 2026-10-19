import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useDarkMode } from '../../../context/DarkModeContext'

interface WeightChartProps {
  data: Array<{ date: string; weight: number }>
}

export default function WeightChart({ data }: WeightChartProps) {
  const { theme } = useDarkMode()
  const isDark = theme === 'dark' || (theme === 'smart' && window.matchMedia('(prefers-color-scheme: dark)').matches)
  const gridColor = isDark ? '#374151' : '#f0f0f0'
  const textColor = isDark ? '#9ca3af' : '#666'

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-4 md:p-6">
      <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Weight Trend</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12, fill: textColor }}
            tickFormatter={(d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          />
          <YAxis domain={['dataMin - 1', 'dataMax + 1']} tick={{ fontSize: 12, fill: textColor }} />
          <Tooltip
            labelFormatter={(d) => new Date(d as string).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
            formatter={(value) => [`${value ?? ''} kg`, 'Weight']}
            contentStyle={isDark ? { background: '#1f2937', border: '1px solid #374151', borderRadius: '8px', color: '#f3f4f6' } : {}}
          />
          <Line
            type="monotone"
            dataKey="weight"
            stroke="#10b981"
            strokeWidth={2}
            dot={{ fill: '#10b981', r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
