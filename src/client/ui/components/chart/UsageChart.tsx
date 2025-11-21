import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts"

interface UsageData {
  month: string
  value: number
}

interface UsageChartProps {
  data: UsageData[]
  title: string
  color: string
  unit?: string
}

interface TooltipProps {
  active?: boolean
  payload?: Array<{ value: number }>
  label?: string
}

export function UsageChart({ data, title, color, unit = "" }: UsageChartProps) {
  const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-200 rounded shadow-lg">
          <p className="text-sm font-medium">{label}</p>
          <p className="text-sm" style={{ color }}>
            {`${payload[0].value}${unit}`}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="w-full h-64">
      <h3 className="text-lg font-semibold mb-4 text-center">{title}</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
          <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6b7280" }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6b7280" }} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="value" fill={color} radius={[2, 2, 0, 0]} stroke={color} strokeWidth={1} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
