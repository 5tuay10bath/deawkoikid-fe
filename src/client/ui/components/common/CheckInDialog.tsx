import { Button } from "./Button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./Dialog"
import { useToast } from "../hooks/useToast"
import { useDashboardStore } from "@infrastructure/libs/store/dashboard.store"
import type { DashboardModel } from "@domain/models/dashboard.model"
import { useState } from "react"

interface CheckInDialogProps {
  isOpen: boolean
  onClose: () => void
  unit: DashboardModel | undefined
}

export const CheckInDialog = ({ isOpen, onClose, unit }: CheckInDialogProps) => {
  const { toast } = useToast()
  const { checkIn } = useDashboardStore()
  const [isLoading, setIsLoading] = useState(false)

  const handleCheckIn = async () => {
    if (!unit) {
      toast({
        title: "Error",
        description: "Unit information not found",
        variant: "destructive",
      })
      return
    }

    if (!unit.contract?.id) {
      toast({
        title: "Error",
        description: "Contract information not found. Please ensure a contract exists for this unit.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    const result = await checkIn({ id: unit.contract.id })
    setIsLoading(false)

    if (result.success) {
      toast({
        title: "Success",
        description: result.message || `Check-in completed for Room ${unit.unitNumber}`,
      })
      onClose()
    } else {
      toast({
        title: "Error",
        description: result.message || "Failed to check in",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>Confirm Check-in</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>Are you sure you want to check in to Room {unit?.unitNumber}?</p>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button onClick={handleCheckIn} disabled={isLoading}>
              {isLoading ? "Processing..." : "Confirm Check-in"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
