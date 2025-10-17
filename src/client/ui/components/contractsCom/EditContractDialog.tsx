import React, { useState, useEffect } from "react"
import { format } from "date-fns"

import type { UpdateContractDto } from "@infrastructure/inbound/dtos/updateContract.dto"
import type { ContractsModel } from "@domain/models/contracts.model"
import { useContractStore } from "@infrastructure/libs/store/contracts.store"

import { Button } from "../common/Button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../common/Dialog"
import { Input } from "../common/Input"
import { Label } from "../common/Label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../common/Select"
import { Calendar } from "../common/Calendar"
import { Popover, PopoverContent, PopoverTrigger } from "../common/Popover"
import { CalendarIcon } from "lucide-react"
import { Checkbox } from "../common/Checkbox"
import { useToast } from "../hooks/useToast"

interface EditContractDialogProps {
  isOpen: boolean
  onClose: () => void
  contract: ContractsModel | null
}

const EditContractDialog = ({ isOpen, onClose, contract }: EditContractDialogProps) => {
  const { updateContract } = useContractStore()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editContract, setEditContract] = useState<Omit<UpdateContractDto, "id">>({
    endDate: "",
    rentAmount: 0,
    rentType: "MONTHLY",
    waterBillingType: "PER_UNIT",
    internet: false,
  })

  // Update form when contract prop changes
  useEffect(() => {
    if (contract) {
      setEditContract({
        endDate: format(new Date(contract.endDate), "yyyy-MM-dd"),
        rentAmount: contract.rentAmount,
        rentType: contract.rentType as "MONTHLY" | "YEARLY",
        waterBillingType: contract.waterBillingType as "PER_UNIT" | "FLAT_RATE" | "TIERED",
        internet: contract.internet,
      })
    }
  }, [contract])

  const handleUpdateContract = async () => {
    if (!contract?.id) {
      toast({
        title: "Error",
        description: "Contract ID is missing",
        variant: "destructive",
      })
      return
    }

    if (!editContract.endDate || !editContract.rentAmount) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      const dto: UpdateContractDto = {
        id: contract.id,
        ...editContract,
      }

      const result = await updateContract(dto)
      if (result.success) {
        onClose()
        toast({
          title: "Success",
          description: result.message || "Contract updated successfully!",
        })
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to update contract",
          variant: "destructive",
        })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Contract</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Tenant and Unit Info (Read-only) */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Tenant</Label>
              <Input value={contract?.user.fullName || ""} disabled className="bg-gray-50" />
            </div>
            <div className="space-y-2">
              <Label>Unit</Label>
              <Input value={contract?.unit.unitNumber || ""} disabled className="bg-gray-50" />
            </div>
          </div>

          {/* End Date */}
          <div className="space-y-2">
            <Label>End Date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {editContract.endDate ? format(new Date(editContract.endDate), "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-white" align="start">
                <Calendar
                  mode="single"
                  selected={editContract.endDate ? new Date(editContract.endDate) : undefined}
                  onSelect={(date) =>
                    date && setEditContract((prev) => ({ ...prev, endDate: format(date, "yyyy-MM-dd") }))
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Rent Amount and Type */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Rent Amount *</Label>
              <Input
                type="number"
                value={editContract.rentAmount}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEditContract((prev) => ({ ...prev, rentAmount: parseFloat(e.target.value) || 0 }))
                }
                placeholder="16000"
              />
            </div>
            <div className="space-y-2">
              <Label>Rent Type</Label>
              <Select
                value={editContract.rentType}
                onValueChange={(value: "MONTHLY" | "YEARLY") =>
                  setEditContract((prev) => ({ ...prev, rentType: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select rent type" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="MONTHLY">Monthly</SelectItem>
                  <SelectItem value="YEARLY">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Water Billing Type */}
          <div className="space-y-2">
            <Label>Water Billing Type</Label>
            <Select
              value={editContract.waterBillingType}
              onValueChange={(value: "PER_UNIT" | "FLAT_RATE" | "TIERED") =>
                setEditContract((prev) => ({ ...prev, waterBillingType: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select water billing type" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="PER_UNIT">Per Unit</SelectItem>
                <SelectItem value="FLAT_RATE">Flat Rate</SelectItem>
                <SelectItem value="TIERED">Tiered</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Internet Checkbox */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="internet"
              checked={editContract.internet}
              onCheckedChange={(checked) => setEditContract((prev) => ({ ...prev, internet: checked as boolean }))}
            />
            <Label htmlFor="internet" className="text-sm font-normal cursor-pointer">
              Include Internet Service
            </Label>
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button onClick={handleUpdateContract} disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Contract"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default EditContractDialog
