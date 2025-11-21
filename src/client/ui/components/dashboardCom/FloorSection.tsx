import { Badge } from "../common/Badge"
import { RoomCard } from "../common/RoomCard"

interface Room {
  id: string
  number: string
  floor: number
  type: string
  size: number
  status: "available" | "occupied" | "reserved" | "pending"
  tenant?: {
    name: string
    email: string
    phone: string
    checkIn: Date
    checkOut: Date
    rentAmount: number
    billingCycle: "monthly" | "yearly"
    emergencyContact: string
  }
}

interface FloorSectionProps {
  floor: number
  rooms: Room[]
  onCheckIn: (roomId: string) => void
  onViewDetails: (roomId: string) => void
}

export function FloorSection({ floor, rooms, onCheckIn, onViewDetails }: FloorSectionProps) {
  const floorRooms = rooms.filter((room) => room.floor === floor)
  const availableCount = floorRooms.filter((room) => room.status === "available").length

  return (
    <div className="space-y-4" data-cy={`floor-${floor}`}>
      <div className="flex items-center gap-3">
        <h2 className="text-xl font-semibold">Floor {floor}</h2>
        <Badge variant="outline">{availableCount} available</Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {floorRooms.map((room) => (
          <RoomCard key={room.id} room={room} onCheckIn={onCheckIn} onViewDetails={onViewDetails} />
        ))}
      </div>
    </div>
  )
}
