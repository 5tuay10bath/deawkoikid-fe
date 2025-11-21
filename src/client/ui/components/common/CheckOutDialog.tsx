import { Button } from "./Button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./Dialog"
import { useToast } from "../hooks/useToast"
import { useDashboardStore } from "@infrastructure/libs/store/dashboard.store"
import type { DashboardModel } from "@domain/models/dashboard.model"
import { useState } from "react"

interface CheckOutDialogProps {
  isOpen: boolean
  onClose: () => void
  unit: DashboardModel | undefined
}

export const CheckOutDialog = ({ isOpen, onClose, unit }: CheckOutDialogProps) => {
  const { toast } = useToast()
  const { checkOut } = useDashboardStore()
  const [isLoading, setIsLoading] = useState(false)

  const handleCheckOut = async () => {
    if (!unit?.contract?.id) {
      toast({
        title: "Error",
        description: "Contract information not found",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    const result = await checkOut({ id: unit.contract.id })
    setIsLoading(false)

    if (result.success) {
      toast({
        title: "Success",
        description: result.message || `Check-out completed for Room ${unit.unitNumber}`,
      })
      onClose()
    } else {
      toast({
        title: "Error",
        description: result.message || "Failed to check out",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>Confirm Check-out</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>Are you sure you want to check out from Room {unit?.unitNumber}?</p>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button onClick={handleCheckOut} disabled={isLoading}>
              {isLoading ? "Processing..." : "Confirm Check-out"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
