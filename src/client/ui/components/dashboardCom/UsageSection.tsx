import { Card, CardContent, CardHeader, CardTitle } from "../common/card"
import { UsageChart } from "../chart/UsageChart"

interface FloorUsageData {
  waterUsageData: Array<{ month: string; value: number }>
  electricUsageData: Array<{ month: string; value: number }>
}

interface RoomUsageData {
  floor: number
  unitNumber: string
  waterUsageData: Array<{ month: string; value: number }>
  electricUsageData: Array<{ month: string; value: number }>
}

interface UsageData {
  type: "floor" | "room"
  data: Record<number | string, FloorUsageData | RoomUsageData>
}

interface UsageSectionProps {
  title: string
  usageData: UsageData
  availableFloors: number[]
  usageType: "water" | "electric"
  color: string
  unit: string
}

export function UsageSection({ title, usageData, availableFloors, usageType, color, unit }: UsageSectionProps) {
  const dataKey = usageType === "water" ? "waterUsageData" : "electricUsageData"

  // Type guard for room data
  const isRoomData = (data: FloorUsageData | RoomUsageData): data is RoomUsageData => {
    return "floor" in data && "unitNumber" in data
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {usageData.type === "floor"
          ? availableFloors.map((floor) => {
              const floorData = usageData.data[floor] as FloorUsageData
              return (
                <Card key={`${usageType}-floor-${floor}`}>
                  <CardHeader>
                    <CardTitle className="text-center text-lg">Floor {floor}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <UsageChart data={floorData?.[dataKey] || []} title="" color={color} unit={unit} />
                  </CardContent>
                </Card>
              )
            })
          : Object.entries(usageData.data)
              .filter(([, data]) => isRoomData(data))
              .sort(([, a], [, b]) => {
                const roomA = a as RoomUsageData
                const roomB = b as RoomUsageData
                return roomA.floor - roomB.floor || roomA.unitNumber.localeCompare(roomB.unitNumber)
              })
              .map(([roomId, roomData]) => {
                const room = roomData as RoomUsageData
                return (
                  <Card key={`${usageType}-room-${roomId}`}>
                    <CardHeader>
                      <CardTitle className="text-center text-lg">Room {room.unitNumber}</CardTitle>
                      <p className="text-center text-sm text-muted-foreground">Floor {room.floor}</p>
                    </CardHeader>
                    <CardContent className="p-6">
                      <UsageChart data={room[dataKey]} title="" color={color} unit={unit} />
                    </CardContent>
                  </Card>
                )
              })}
      </div>
    </div>
  )
}
