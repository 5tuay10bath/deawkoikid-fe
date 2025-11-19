import { Building, Users, DollarSign } from "lucide-react"
import { DashboardStatCard } from "../central/StatsCard"

interface DashboardStatsProps {
  totalRooms: number
  occupiedRooms: number
  availableRooms: number
  reservedRooms: number
  pendingRooms: number
  totalRevenue: number
}

export function DashboardStats({
  totalRooms,
  occupiedRooms,
  availableRooms,
  reservedRooms,
  pendingRooms,
  totalRevenue,
}: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
      <DashboardStatCard
        title="Total Units"
        value={totalRooms.toString()}
        description="Across 2 floors"
        icon={Building}
        data-cy="total-units-stat"
      />

      <DashboardStatCard
        title="Occupied"
        value={occupiedRooms}
        description={`${availableRooms} available`}
        icon={Users}
        valueColor="text-red-500"
        data-cy="occupied-units-stat"
      />

      <DashboardStatCard
        title="Monthly Revenue"
        value={`$${totalRevenue.toLocaleString()}`}
        description="From occupied units"
        icon={DollarSign}
        valueColor="text-green-500"
        data-cy="revenue-stat"
      />

      <DashboardStatCard
        title="Reserved"
        value={reservedRooms}
        description="Units under reservation"
        valueColor="text-orange-500"
        data-cy="maintenance-stat"
      />

      <DashboardStatCard
        title="Pending"
        value={pendingRooms}
        description="Pending"
        valueColor="text-blue-500"
        data-cy="maintenance-stat"
      />
    </div>
  )
}
