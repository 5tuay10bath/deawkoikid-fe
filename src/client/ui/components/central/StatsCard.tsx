import type { LucideIcon } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "../common/card"

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

  // Format number:
  // - If prefix is "$" (money): show 2 decimal places
  // - Otherwise (count): show as integer with comma separator
  const formattedValue =
    typeof value === "number"
      ? prefix === "$"
        ? value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        : value.toLocaleString("en-US", { maximumFractionDigits: 0 })
      : value

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-muted-foreground text-sm">{label}</p>
            <p className={`text-2xl font-bold ${valueColor}`}>
              {prefix}
              {formattedValue}
            </p>
          </div>
          {Icon && <Icon className={`h-8 w-8 ${iconColor}`} />}
        </div>
      </CardContent>
    </Card>
  )
}

interface DashboardStatCardProps {
  title: string
  value: string | number
  description: string
  icon: LucideIcon
  valueColor?: string
  iconColor?: string
  "data-cy"?: string
}

export function DashboardStatCard({
  title,
  value,
  description,
  icon: Icon,
  valueColor = "text-foreground",
  iconColor = "text-gray-500",
  "data-cy": dataCy,
}: DashboardStatCardProps) {
  return (
    <Card data-cy={dataCy}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${iconColor}`} />
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${valueColor}`}>{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}
