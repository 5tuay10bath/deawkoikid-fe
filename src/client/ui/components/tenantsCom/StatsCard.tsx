import type { LucideIcon } from "lucide-react"
import { Card, CardContent } from "../mock/card"

interface StatsCardProps {
  label: string
  value: number
  icon?: LucideIcon
  valueColor?: string
}

export function StatsCard({ label, value, icon: Icon, valueColor = "text-gray-900" }: StatsCardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className={`text-2xl font-bold ${valueColor}`}>
              {value}
            </p>
          </div>
          {Icon && <Icon className="h-8 w-8 text-blue-500" />}
        </div>
      </CardContent>
    </Card>
  )
}
