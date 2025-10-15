import { Calendar, User, DollarSign } from "lucide-react"
import { format } from "date-fns"
import { Badge } from "./Badge"
import { Card, CardContent, CardHeader, CardTitle } from "./card"
import { Button } from "./Button"

interface RoomData {
  id: string
  number: string
  floor: number
  status: "available" | "occupied" | "reserved" | "maintenance" | "checkout-pending"
  tenant?: {
    name: string
    checkIn: Date
    checkOut: Date
    rentAmount: number
    billingCycle: "monthly" | "yearly"
  }
}

interface RoomCardProps {
  room: RoomData
  onCheckIn?: (roomId: string) => void
  onViewDetails?: (roomId: string) => void
}

const statusConfig = {
  available: {
    color: "bg-green-500 text-white",
    label: "Available",
  },
  occupied: {
    color: "bg-red-500 text-white",
    label: "Occupied",
  },
  reserved: {
    color: "bg-orange-500 text-white",
    label: "Reserved",
  },
  maintenance: {
    color: "bg-yellow-500 text-white",
    label: "Maintenance",
  },
  "checkout-pending": {
    color: "bg-info text-info-foreground",
    label: "Check-out Pending",
  },
}

export function RoomCard({ room, onCheckIn, onViewDetails }: RoomCardProps) {
  const config = statusConfig[room.status]

  return (
    <Card
      className={`transition-shadow hover:shadow-md cursor-pointer room-card room-card-${room.status}`}
      data-cy={`room-card room-card-${room.status}`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Room {room.number}</CardTitle>
          <Badge className={config.color}>{config.label}</Badge>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">Floor {room.floor}</p>

          {room.tenant && (
            <div className="space-y-2 text-sm" data-cy="current-tenant-info">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span data-cy="tenant-name-display">{room.tenant.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>
                  {format(room.tenant.checkIn, "MMM dd")} - {format(room.tenant.checkOut, "MMM dd, yyyy")}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                <span>
                  ${room.tenant.rentAmount}/{room.tenant.billingCycle === "monthly" ? "mo" : "yr"}
                </span>
              </div>
            </div>
          )}

          <div className="pt-2">
            {room.status === "available" && (
              <Button size="sm" className="w-full" onClick={() => onCheckIn?.(room.id)} data-cy="check-in-button">
                Check In
              </Button>
            )}

            {room.status !== "available" && (
              <Button
                size="sm"
                variant="outline"
                className="w-full"
                onClick={() => onViewDetails?.(room.id)}
                data-cy="view-details-button"
              >
                View Details
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
