import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, User, Calendar, DollarSign, Phone, Mail } from "lucide-react"
import { format } from "date-fns"
import { Button } from "../components/common/Button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/common/card"
import { Badge } from "../components/common/Badge"
import { useDashboardStore } from "@infrastructure/libs/store/dashboard.store"
import { useRoomDetailStore } from "@infrastructure/libs/store/roomDetail.store"
import { AddBillingDialog, CheckOutDialog } from "../components/roomDetailCom/Dialog"
import RoomReceiptDialog from "../components/roomDetailCom/ReceiptDialog"
import RoomContractDialog from "../components/roomDetailCom/ContractDialog"

export default function RoomDetails() {
  const { roomId } = useParams()
  const navigate = useNavigate()
  const [isReceiptOpen, setIsReceiptOpen] = useState(false)
  const [isContractOpen, setIsContractOpen] = useState(false)

  const { dashboard, getDashboard } = useDashboardStore()
  const { setRoom } = useRoomDetailStore()

  const BACK_TO_DASHBOARD = "flex items-center gap-2"
  const DASHBOARD_PATH = "/dashboard"

  useEffect(() => {
    if (dashboard.length === 0) {
      getDashboard()
    }
  }, [dashboard, getDashboard])

  // Find the unit from dashboard array by roomId
  const unit = dashboard.find((item) => item.id === roomId)

  // Set room to store when unit is found
  useEffect(() => {
    if (unit) {
      setRoom(unit)
    }
  }, [unit, setRoom])

  const statusConfig = {
    AVAILABLE: { color: "bg-green-500 text-white", label: "Available" },
    OCCUPIED: { color: "bg-red-500 text-white", label: "Occupied" },
    RESERVED: { color: "bg-orange-500 text-white", label: "Reserved" },
    PENDING: { color: "bg-blue-500 text-white", label: "Pending" },
  } as const

  const getStatusConfig = (status: string) => {
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.AVAILABLE
  }

  if (!unit) {
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

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate(DASHBOARD_PATH)} className={BACK_TO_DASHBOARD}>
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Room {unit.unitNumber} Details</h1>
          <p className="text-muted-foreground">Floor {unit.floor}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tenant Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Tenant Information
                <Badge className={getStatusConfig(unit.unitStatus).color}>
                  {getStatusConfig(unit.unitStatus).label}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{unit.contract?.user.fullName || "N/A"}</p>
                    <p className="text-sm text-muted-foreground">Tenant Name</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{unit.contract?.user.email || "N/A"}</p>
                    <p className="text-sm text-muted-foreground">Email Address</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{unit.contract?.user.phone || "N/A"}</p>
                    <p className="text-sm text-muted-foreground">Phone Number</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{unit.contract?.user.emergencyContactName || "N/A"}</p>
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
                    <p className="font-medium">
                      {unit.contract?.startDate ? format(new Date(unit.contract.startDate), "PPP") : "N/A"}
                    </p>
                    <p className="text-sm text-muted-foreground">Check-in Date</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">
                      {unit.contract?.endDate ? format(new Date(unit.contract.endDate), "PPP") : "N/A"}
                    </p>
                    <p className="text-sm text-muted-foreground">Check-out Date</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <DollarSign className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">
                      {unit.contract
                        ? `$${unit.contract.rentAmount}/${unit.contract.rentType === "MONTHLY" ? "month" : "year"}`
                        : "N/A"}
                    </p>
                    <p className="text-sm text-muted-foreground">Rent Amount</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <DollarSign className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">N/A</p>
                    <p className="text-sm text-muted-foreground">Security Deposit</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions Panel - Only show if unit has a contract */}
        {unit.contract && (
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
        )}
      </div>

      {/* Dialogs */}
      <RoomReceiptDialog isOpen={isReceiptOpen} onClose={() => setIsReceiptOpen(false)} unit={unit} />
      <RoomContractDialog isOpen={isContractOpen} onClose={() => setIsContractOpen(false)} unit={unit} />
    </div>
  )
}
