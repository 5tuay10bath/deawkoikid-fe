import { useRoomDetailStore } from "@infrastructure/libs/store/roomDetail.store"
import { Button } from "../common/Button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../common/Dialog"
import { useToast } from "../hooks/useToast"
import { useNavigate, useParams } from "react-router-dom"
import { Plus } from "lucide-react"
import { Label } from "../common/Label"
import { Input } from "../common/Input"
import { Textarea } from "../common/TextArea"

export const CheckOutDialog = () => {
  const { room, isCheckOutOpen, setIsCheckOutOpen } = useRoomDetailStore()
  const { toast } = useToast()
  const navigate = useNavigate()
  const { roomId } = useParams()

  const handleCheckOut = () => {
    toast({
      title: "Check-out Initiated",
      description: `Check-out process started for Room ${roomId}`,
    })
    setIsCheckOutOpen(false)
    navigate("/")
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
            Are you sure you want to check out {room?.tenant?.name} from Room {room?.number}?
          </p>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setIsCheckOutOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleCheckOut}>
              Confirm Check-out
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export const AddBillingDialog = () => {
  const { isAddonOpen, addonForm, setIsAddonOpen, updateAddonForm, resetAddonForm } = useRoomDetailStore()
  const { toast } = useToast()

  const handleAddAddon = () => {
    if (!addonForm.type || !addonForm.amount) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Add-on Charge Added",
      description: `${addonForm.type} charge of $${addonForm.amount} added to tenant's bill`,
    })

    setIsAddonOpen(false)
    resetAddonForm()
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
              value={addonForm.type}
              onChange={(e) => updateAddonForm({ type: e.target.value })}
              placeholder="e.g., Electricity, Water, Maintenance"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="addonAmount">Amount ($)</Label>
            <Input
              id="addonAmount"
              type="number"
              value={addonForm.amount}
              onChange={(e) => updateAddonForm({ amount: e.target.value })}
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
            <Button variant="outline" onClick={() => setIsAddonOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddAddon}>Add Charge</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
