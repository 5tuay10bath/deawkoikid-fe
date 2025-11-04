import { useEffect, useState, useCallback, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { CheckInDialog } from "../components/common/CheckInDialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/common/Tabs"
import { DashboardStats, FloorSection, AnalyticsFilters, UsageSection } from "../components/dashboardCom"
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

  const [viewBy, setViewBy] = useState<"floor" | "room">("floor")
  const [timeFrame, setTimeFrame] = useState<"month" | "year">("month")

  const debounceTimeoutRef = useRef<number | null>(null)

  const handleViewByChange = useCallback((value: string) => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current)
    }
    debounceTimeoutRef.current = setTimeout(() => {
      if (value === "floor" || value === "room") {
        setViewBy(value)
      }
    }, 100)
  }, [])

  const handleTimeFrameChange = useCallback((value: string) => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current)
    }
    debounceTimeoutRef.current = setTimeout(() => {
      if (value === "month" || value === "year") {
        setTimeFrame(value)
      }
    }, 100)
  }, [])

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

  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current)
      }
    }
  }, [])

  // Process usage data based on selected view and timeframe
  const processUsageData = () => {
    const timePeriods =
      timeFrame === "month"
        ? ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        : ["2021", "2022", "2023", "2024", "2025"]

    if (viewBy === "floor") {
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

        const waterUsageData = timePeriods.map((period) => {
          if (payments.length > 0) {
            const periodPayments = payments.filter((payment) => {
              const paymentPeriod =
                timeFrame === "month"
                  ? new Date(payment.billingMonth).toLocaleDateString("en", { month: "short" })
                  : new Date(payment.billingMonth).getFullYear().toString()
              const unitInFloor = floorUnitIds.some((unitId) => payment.contract?.unit?.id === unitId)
              return paymentPeriod === period && unitInFloor
            })

            const totalWaterUsage = periodPayments.reduce((sum, payment) => sum + (payment.waterUsage || 0), 0)
            return { month: period, value: totalWaterUsage > 0 ? totalWaterUsage : Math.floor(Math.random() * 40) + 60 }
          }
          return { month: period, value: Math.floor(Math.random() * 40) + 60 }
        })

        const electricUsageData = timePeriods.map((period) => {
          if (payments.length > 0) {
            const periodPayments = payments.filter((payment) => {
              const paymentPeriod =
                timeFrame === "month"
                  ? new Date(payment.billingMonth).toLocaleDateString("en", { month: "short" })
                  : new Date(payment.billingMonth).getFullYear().toString()
              const unitInFloor = floorUnitIds.some((unitId) => payment.contract?.unit?.id === unitId)
              return paymentPeriod === period && unitInFloor
            })

            const totalElectricUsage = periodPayments.reduce((sum, payment) => sum + (payment.electricUsage || 0), 0)
            return {
              month: period,
              value: totalElectricUsage > 0 ? totalElectricUsage : Math.floor(Math.random() * 50) + 80,
            }
          }
          return { month: period, value: Math.floor(Math.random() * 50) + 80 }
        })

        floorUsageData[floor] = { waterUsageData, electricUsageData }
      })

      return { type: "floor" as const, data: floorUsageData }
    } else {
      // Group by room
      const roomUsageData: Record<
        string,
        {
          waterUsageData: Array<{ month: string; value: number }>
          electricUsageData: Array<{ month: string; value: number }>
          unitNumber: string
          floor: number
        }
      > = {}

      dashboard.forEach((unit) => {
        const waterUsageData = timePeriods.map((period) => {
          if (payments.length > 0) {
            const periodPayments = payments.filter((payment) => {
              const paymentPeriod =
                timeFrame === "month"
                  ? new Date(payment.billingMonth).toLocaleDateString("en", { month: "short" })
                  : new Date(payment.billingMonth).getFullYear().toString()
              return paymentPeriod === period && payment.contract?.unit?.id === unit.id
            })

            const totalWaterUsage = periodPayments.reduce((sum, payment) => sum + (payment.waterUsage || 0), 0)
            return { month: period, value: totalWaterUsage > 0 ? totalWaterUsage : Math.floor(Math.random() * 15) + 20 }
          }
          return { month: period, value: Math.floor(Math.random() * 15) + 20 }
        })

        const electricUsageData = timePeriods.map((period) => {
          if (payments.length > 0) {
            const periodPayments = payments.filter((payment) => {
              const paymentPeriod =
                timeFrame === "month"
                  ? new Date(payment.billingMonth).toLocaleDateString("en", { month: "short" })
                  : new Date(payment.billingMonth).getFullYear().toString()
              return paymentPeriod === period && payment.contract?.unit?.id === unit.id
            })

            const totalElectricUsage = periodPayments.reduce((sum, payment) => sum + (payment.electricUsage || 0), 0)
            return {
              month: period,
              value: totalElectricUsage > 0 ? totalElectricUsage : Math.floor(Math.random() * 25) + 30,
            }
          }
          return { month: period, value: Math.floor(Math.random() * 25) + 30 }
        })

        roomUsageData[unit.id] = {
          waterUsageData,
          electricUsageData,
          unitNumber: unit.unitNumber,
          floor: unit.floor,
        }
      })

      return { type: "room" as const, data: roomUsageData }
    }
  }

  const usageData = processUsageData()

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
          <DashboardStats
            totalRooms={totalRooms}
            occupiedRooms={occupiedRooms}
            availableRooms={availableRooms}
            reservedRooms={reservedRooms}
            pendingRooms={pendingRooms}
            totalRevenue={totalRevenue}
          />

          {/* Room Grid by Floor */}
          {[1, 2].map((floor) => (
            <FloorSection
              key={floor}
              floor={floor}
              rooms={rooms}
              onCheckIn={handleCheckIn}
              onViewDetails={handleViewDetails}
            />
          ))}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <AnalyticsFilters
            viewBy={viewBy}
            timeFrame={timeFrame}
            onViewByChange={handleViewByChange}
            onTimeFrameChange={handleTimeFrameChange}
          />

          {/* Water Usage Section */}
          <UsageSection
            title="Water Usage"
            usageData={usageData}
            availableFloors={availableFloors}
            usageType="water"
            color="#3b82f6"
            unit=" L"
          />

          {/* Electric Usage Section */}
          <UsageSection
            title="Electric Usage"
            usageData={usageData}
            availableFloors={availableFloors}
            usageType="electric"
            color="#fbbf24"
            unit=" kWh"
          />
        </TabsContent>
      </Tabs>

      {/* Check-in Dialog */}
      <CheckInDialog isOpen={isCheckInOpen} onClose={() => setIsCheckInOpen(false)} unit={selectedUnit} />
    </div>
  )
}
