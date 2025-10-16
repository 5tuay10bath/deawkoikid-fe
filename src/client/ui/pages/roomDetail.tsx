import { useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, User, Calendar, DollarSign, Phone, Mail } from "lucide-react"
import { format } from "date-fns"
import { Button } from "../components/common/Button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/common/card"
import { Badge } from "../components/common/Badge"
import { mockDB } from "@infrastructure/mockData/mockData"
import { useRoomDetailStore } from "@infrastructure/libs/store/roomDetail.store"
import { AddBillingDialog, CheckOutDialog } from "../components/roomDetailCom/Dialog"
import RoomReceiptDialog from "../components/roomDetailCom/ReceiptDialog"
import RoomContractDialog from "../components/roomDetailCom/ContractDialog"

export default function RoomDetails() {
  const { roomId } = useParams()
  const navigate = useNavigate()

  const { room, setRoom, setIsReceiptOpen, setIsContractOpen } = useRoomDetailStore()

  const BACK_TO_DASHBOARD = "flex items-center gap-2"
  const DASHBOARD_PATH = "/dashboard"

  useEffect(() => {
    if (roomId) {
      const foundRoom = mockDB.getRooms().find((r) => r.id === roomId)
      setRoom(foundRoom || null)
    }
  }, [roomId, setRoom])

  const statusConfig = {
    available: { color: "bg-green-500 text-white", label: "Available" },
    occupied: { color: "bg-red-500 text-white", label: "Occupied" },
    maintenance: { color: "bg-yellow-500 text-white", label: "Maintenance" },
    "checkout-pending": { color: "bg-blue-500 text-white", label: "Check-out Pending" },
  } as const

  const getStatusConfig = (status: string) => {
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.available
  }

  if (!room) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(DASHBOARD_PATH)} className={BACK_TO_DASHBOARD}>
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Room not found</h1>
            <p className="text-muted-foreground">The requested room could not be found.</p>
          </div>
        </div>
      </div>
    )
  }

  if (!room.tenant) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(DASHBOARD_PATH)} className={BACK_TO_DASHBOARD}>
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Room {room.number} Details</h1>
            <p className="text-muted-foreground">This room is currently not occupied.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate(DASHBOARD_PATH)} className={BACK_TO_DASHBOARD}>
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Room {room.number} Details</h1>
          <p className="text-muted-foreground">Floor {room.floor}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tenant Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Tenant Information
                <Badge className={getStatusConfig(room.status).color}>{getStatusConfig(room.status).label}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{room.tenant.name}</p>
                    <p className="text-sm text-muted-foreground">Tenant Name</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{room.tenant.email}</p>
                    <p className="text-sm text-muted-foreground">Email Address</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{room.tenant.phone}</p>
                    <p className="text-sm text-muted-foreground">Phone Number</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{room.tenant.emergencyContact}</p>
                    <p className="text-sm text-muted-foreground">Emergency Contact</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Lease Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{format(room.tenant.checkIn, "PPP")}</p>
                    <p className="text-sm text-muted-foreground">Check-in Date</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{format(room.tenant.checkOut, "PPP")}</p>
                    <p className="text-sm text-muted-foreground">Check-out Date</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <DollarSign className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">
                      ${room.tenant.rentAmount}/{room.tenant.billingCycle === "monthly" ? "month" : "year"}
                    </p>
                    <p className="text-sm text-muted-foreground">Rent Amount</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <DollarSign className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">${room.tenant.securityDeposit}</p>
                    <p className="text-sm text-muted-foreground">Security Deposit</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions Panel */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <CheckOutDialog />

              <AddBillingDialog />

              <Button variant="outline" className="w-full" onClick={() => setIsReceiptOpen(true)}>
                Generate Receipt
              </Button>

              <Button variant="outline" className="w-full" onClick={() => setIsContractOpen(true)}>
                View Contract
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Dialogs */}
      <RoomReceiptDialog />
      <RoomContractDialog />
    </div>
  )
}
