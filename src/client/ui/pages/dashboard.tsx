import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Building, Users, DollarSign, BarChart3 } from "lucide-react"
import { Badge } from "../components/common/Badge"
import { RoomCard } from "../components/common/RoomCard"
import { DashboardStatCard } from "../components/central/StatsCard"
import { CheckInDialog } from "../components/common/CheckInDialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/common/Tabs"
import { Card, CardContent, CardHeader, CardTitle } from "../components/common/card"
import { UsageChart } from "../components/chart/UsageChart"
import type { DashboardModel } from "@domain/models/dashboard.model"
import { useDashboardStore } from "@infrastructure/libs/store/dashboard.store"
import { usePaymentStore } from "@infrastructure/libs/store/payments.store"

const transformContractToRoom = (unit: DashboardModel) => ({
  id: unit.id,
  number: unit.unitNumber,
  floor: unit.floor,
  type: unit.unitType,
  size: unit.unitSize,
  status: unit.unitStatus.toLowerCase() as "available" | "occupied" | "reserved" | "pending",
  tenant: unit.contract
    ? {
        name: unit.contract.user.fullName,
        email: unit.contract.user.email,
        phone: unit.contract.user.phone,
        checkIn: new Date(unit.contract.startDate),
        checkOut: new Date(unit.contract.endDate),
        rentAmount: unit.contract.rentAmount,
        billingCycle: (unit.contract.rentType === "MONTHLY" ? "monthly" : "yearly") as "monthly" | "yearly",
        emergencyContact: unit.contract.user.emergencyContactName || "N/A",
      }
    : undefined,
})

export default function Dashboard() {
  const { dashboard, getDashboard } = useDashboardStore()
  const { payments, getPayments } = usePaymentStore()
  const navigate = useNavigate()
  const [isCheckInOpen, setIsCheckInOpen] = useState(false)
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null)

  useEffect(() => {
    getDashboard()
    getPayments()
  }, [getDashboard, getPayments])

  const rooms = dashboard.map(transformContractToRoom)
  const selectedUnit = dashboard.find((unit) => unit.id === selectedRoomId)

  const totalRooms = rooms.length
  const occupiedRooms = rooms.filter((room) => room.status === "occupied").length
  const availableRooms = rooms.filter((room) => room.status === "available").length
  const reservedRooms = rooms.filter((room) => room.status === "reserved").length
  const pendingRooms = rooms.filter((room) => room.status === "pending").length

  const totalRevenue = rooms
    .filter((room) => room.tenant)
    .reduce((sum, room) => sum + (room.tenant?.rentAmount || 0), 0)

  const handleCheckIn = (roomId: string) => {
    setSelectedRoomId(roomId)
    setIsCheckInOpen(true)
  }

  const handleViewDetails = (roomId: string) => {
    navigate(`/room/${roomId}`)
  }

  const availableFloors = [...new Set(dashboard.map((unit) => unit.floor))].sort((a, b) => a - b)

  const processUsageDataByFloor = () => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    const floorUsageData: Record<
      number,
      {
        waterUsageData: Array<{ month: string; value: number }>
        electricUsageData: Array<{ month: string; value: number }>
      }
    > = {}

    availableFloors.forEach((floor) => {
      const floorUnits = dashboard.filter((unit) => unit.floor === floor)
      const floorUnitIds = floorUnits.map((unit) => unit.id)

      const waterUsageData = months.map((month) => {
        if (payments.length > 0) {
          const monthPayments = payments.filter((payment) => {
            const paymentMonth = new Date(payment.billingMonth).toLocaleDateString("en", { month: "short" })
            const unitInFloor = floorUnitIds.some((unitId) => payment.contract?.unit?.id === unitId)
            return paymentMonth === month && unitInFloor
          })

          const totalWaterUsage = monthPayments.reduce((sum, payment) => sum + (payment.waterUsage || 0), 0)
          return { month, value: totalWaterUsage > 0 ? totalWaterUsage : Math.floor(Math.random() * 40) + 60 }
        }
        return { month, value: Math.floor(Math.random() * 40) + 60 }
      })

      const electricUsageData = months.map((month) => {
        if (payments.length > 0) {
          const monthPayments = payments.filter((payment) => {
            const paymentMonth = new Date(payment.billingMonth).toLocaleDateString("en", { month: "short" })
            const unitInFloor = floorUnitIds.some((unitId) => payment.contract?.unit?.id === unitId)
            return paymentMonth === month && unitInFloor
          })

          const totalElectricUsage = monthPayments.reduce((sum, payment) => sum + (payment.electricUsage || 0), 0)
          return { month, value: totalElectricUsage > 0 ? totalElectricUsage : Math.floor(Math.random() * 50) + 80 }
        }
        return { month, value: Math.floor(Math.random() * 50) + 80 }
      })

      floorUsageData[floor] = { waterUsageData, electricUsageData }
    })

    return floorUsageData
  }

  const floorUsageData = processUsageDataByFloor()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Property Dashboard</h1>
        <p className="text-muted-foreground">Overview of all 24 units across 2 floors</p>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-cy="dashboard-stats">
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
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="h-6 w-6 text-blue-600" />
            <div>
              <h2 className="text-xl font-bold">Usage Analytics</h2>
              <p className="text-muted-foreground">Water and electricity usage insights by floor</p>
            </div>
          </div>

          {/* Water Usage Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Water Usage</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {availableFloors.map((floor) => (
                <Card key={`water-floor-${floor}`}>
                  <CardHeader>
                    <CardTitle className="text-center text-lg">Water usage floor {floor}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <UsageChart data={floorUsageData[floor]?.waterUsageData || []} title="" color="#3b82f6" unit=" L" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Electric Usage Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Electric Usage</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {availableFloors.map((floor) => (
                <Card key={`electric-floor-${floor}`}>
                  <CardHeader>
                    <CardTitle className="text-center text-lg">Electric usage floor {floor}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <UsageChart
                      data={floorUsageData[floor]?.electricUsageData || []}
                      title=""
                      color="#fbbf24"
                      unit=" kWh"
                    />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Check-in Dialog */}
      <CheckInDialog isOpen={isCheckInOpen} onClose={() => setIsCheckInOpen(false)} unit={selectedUnit} />
    </div>
  )
}
