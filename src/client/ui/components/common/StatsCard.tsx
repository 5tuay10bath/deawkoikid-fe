import type { LucideIcon } from "lucide-react"

import { Card, CardContent } from "../mock/card"

type StatsCardProps = {
  label: string
  value: number
  icon?: LucideIcon
  prefix?: string
  color?: {
    valueColor?: string
    iconColor?: string
  }
}

export function StatsCard({ label, value, icon: Icon, prefix, color = {} }: StatsCardProps) {
  const { valueColor = "text-gray-900", iconColor = "text-blue-500" } = color
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-muted-foreground text-sm">{label}</p>
            <p className={`text-2xl font-bold ${valueColor}`}>
              {prefix}
              {value}
            </p>
          </div>
          {Icon && <Icon className={`h-8 w-8 ${iconColor}`} />}
        </div>
      </CardContent>
    </Card>
  )
}
