import { useRoomDetailStore } from "@infrastructure/libs/store/roomDetail.store"
import { useDashboardStore } from "@infrastructure/libs/store/dashboard.store"
import { Button } from "../common/Button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../common/Dialog"
import { useToast } from "../hooks/useToast"
import { useNavigate, useParams } from "react-router-dom"
import { Plus } from "lucide-react"
import { Label } from "../common/Label"
import { Input } from "../common/Input"
import { Textarea } from "../common/TextArea"
import { useState } from "react"

export const CheckOutDialog = () => {
  const { room, isCheckOutOpen, setIsCheckOutOpen } = useRoomDetailStore()
  const { checkOut } = useDashboardStore()
  const { toast } = useToast()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const handleCheckOut = async () => {
    if (!room?.contract?.id) {
      toast({
        title: "Error",
        description: "Contract information not found",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    const result = await checkOut({ id: room.contract.id })
    setIsLoading(false)

    if (result.success) {
      toast({
        title: "Success",
        description: result.message || `Check-out completed for Room ${room.unitNumber}`,
      })
      setIsCheckOutOpen(false)
      navigate("/dashboard")
    } else {
      toast({
        title: "Error",
        description: result.message || "Failed to check out",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={isCheckOutOpen} onOpenChange={setIsCheckOutOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" className="w-full">
          Check Out
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>Confirm Check-out</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>
            Are you sure you want to check out {room?.contract?.user.fullName} from Room {room?.unitNumber}?
          </p>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setIsCheckOutOpen(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleCheckOut} disabled={isLoading}>
              {isLoading ? "Processing..." : "Confirm Check-out"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export const AddBillingDialog = () => {
  const { roomId } = useParams()
  const { isAddonOpen, addonForm, setIsAddonOpen, updateAddonForm, resetAddonForm } = useRoomDetailStore()
  const { createExtraCharge } = useDashboardStore()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const handleAddAddon = async () => {
    if (!addonForm.topic || !addonForm.price) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    if (!roomId) {
      toast({
        title: "Error",
        description: "Room ID not found",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    const result = await createExtraCharge({
      id: roomId,
      topic: addonForm.topic,
      description: addonForm.description,
      price: Number(addonForm.price),
    })
    setIsLoading(false)

    if (result.success) {
      toast({
        title: "Success",
        description: result.message || "Extra charge added successfully",
      })
      setIsAddonOpen(false)
      resetAddonForm()
    } else {
      toast({
        title: "Error",
        description: result.message || "Failed to add extra charge",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={isAddonOpen} onOpenChange={setIsAddonOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Add Billing
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>Add Additional Charges</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="addonType">Charge Type</Label>
            <Input
              id="addonType"
              value={addonForm.topic}
              onChange={(e) => updateAddonForm({ topic: e.target.value })}
              placeholder="e.g., Electricity, Water, Maintenance"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="addonAmount">Price ($)</Label>
            <Input
              id="addonAmount"
              type="number"
              value={addonForm.price}
              onChange={(e) => updateAddonForm({ price: e.target.value })}
              placeholder="50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="addonDescription">Description</Label>
            <Textarea
              id="addonDescription"
              value={addonForm.description}
              onChange={(e) => updateAddonForm({ description: e.target.value })}
              placeholder="Additional details..."
            />
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setIsAddonOpen(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button onClick={handleAddAddon} disabled={isLoading}>
              {isLoading ? "Adding..." : "Add Charge"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
