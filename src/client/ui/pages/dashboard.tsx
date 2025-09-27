import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Building, Users, DollarSign, Wrench } from "lucide-react"
import { mockDB } from "@infrastructure/mockData/mockData"
import { Badge } from "../components/common/Badge"
import { RoomCard } from "../components/common/RoomCard"
import { DashboardStatCard } from "../components/central/StatsCard"

export default function Dashboard() {
  const [rooms] = useState(() => mockDB.getRooms())
  const navigate = useNavigate()

  const occupiedRooms = rooms.filter((room) => room.status === "occupied").length
  const availableRooms = rooms.filter((room) => room.status === "available").length
  const maintenanceRooms = rooms.filter((room) => room.status === "maintenance").length

  const totalRevenue = rooms
    .filter((room) => room.tenant)
    .reduce((sum, room) => sum + (room.tenant?.rentAmount || 0), 0)

  const handleCheckIn = (roomId: string) => {
    navigate(`/check-in/${roomId}`)
  }

  const handleViewDetails = (roomId: string) => {
    navigate(`/room/${roomId}`)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Property Dashboard</h1>
        <p className="text-muted-foreground">Overview of all 24 units across 2 floors</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" data-cy="dashboard-stats">
        <DashboardStatCard title="Total Units" value="24" description="Across 2 floors" icon={Building} data-cy="total-units-stat" />

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
          title="Maintenance"
          value={maintenanceRooms}
          description="Units under maintenance"
          icon={Wrench}
          valueColor="text-orange-500"
          data-cy="maintenance-stat"
        />
      </div>

      {/* Room Grid by Floor */}
      {[1, 2].map((floor) => (
        <div key={floor} className="space-y-4" data-cy={`floor-${floor}`}>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold">Floor {floor}</h2>
            <Badge variant="outline">
              {rooms.filter((r) => r.floor === floor && r.status === "available").length} available
            </Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {rooms
              .filter((room) => room.floor === floor)
              .map((room) => (
                <RoomCard key={room.id} room={room} onCheckIn={handleCheckIn} onViewDetails={handleViewDetails} />
              ))}
          </div>
        </div>
      ))}
    </div>
  )
}
