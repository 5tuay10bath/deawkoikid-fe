import React, { useState, useEffect } from "react"

import type { UpdateUnitDto } from "@infrastructure/inbound/dtos/updateUnit.dto"
import type { UnitPageModel } from "@domain/models/unitPage.model"
import { useUnitStore } from "src/infrastructure/libs/store/units.store"

import { Button } from "../common/Button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../common/Dialog"
import { Input } from "../common/Input"
import { Label } from "../common/Label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../common/Select"
import { useToast } from "../hooks/useToast"

interface EditUnitDialogProps {
  isOpen: boolean
  onClose: () => void
  unit: UnitPageModel | null
}

const EditUnitDialog = ({ isOpen, onClose, unit }: EditUnitDialogProps) => {
  const { updateUnit } = useUnitStore()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editUnit, setEditUnit] = useState<Omit<UpdateUnitDto, "id">>({
    unitNumber: "",
    address: "",
    unitType: "A",
    unitSize: 400,
    status: "AVAILABLE",
    floor: 1,
  })

  // Update form when unit prop changes
  useEffect(() => {
    if (unit) {
      setEditUnit({
        unitNumber: unit.unitNumber,
        address: unit.address,
        unitType: unit.unitType as "A" | "B" | "C",
        unitSize: unit.unitSize,
        status: unit.status.toUpperCase() as "AVAILABLE" | "OCCUPIED" | "RESERVED" | "PENDING",
        floor: unit.floor,
      })
    }
  }, [unit])

  const handleUpdateUnit = async () => {
    if (!unit?.id) {
      toast({
        title: "Error",
        description: "Unit ID is missing",
        variant: "destructive",
      })
      return
    }

    if (!editUnit.unitNumber || !editUnit.address) {
      toast({
        title: "Error",
        description: "Please fill in unit number and address",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      const dto: UpdateUnitDto = {
        id: unit.id,
        ...editUnit,
      }

      const result = await updateUnit(dto)
      if (result.success) {
        onClose()
        toast({
          title: "Success",
          description: result.message || "Unit updated successfully!",
        })
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to update unit",
          variant: "destructive",
        })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>Edit Unit</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Unit Number</Label>
              <Input
                value={editUnit.unitNumber}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEditUnit((prev) => ({ ...prev, unitNumber: e.target.value }))
                }
                placeholder="101"
              />
            </div>
            <div className="space-y-2">
              <Label>Floor</Label>
              <Select
                value={editUnit.floor.toString()}
                onValueChange={(value: string) => setEditUnit((prev) => ({ ...prev, floor: parseInt(value) }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select floor" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((floor) => (
                    <SelectItem key={floor} value={floor.toString()}>
                      Floor {floor}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Address</Label>
            <Input
              value={editUnit.address}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEditUnit((prev) => ({ ...prev, address: e.target.value }))
              }
              placeholder="Building A, 123 Street"
            />
          </div>
          <div className="space-y-2">
            <Label>Unit Type</Label>
            <Select
              value={editUnit.unitType}
              onValueChange={(value: "A" | "B" | "C") => setEditUnit((prev) => ({ ...prev, unitType: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="A">Type A</SelectItem>
                <SelectItem value="B">Type B</SelectItem>
                <SelectItem value="C">Type C</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Size (sq ft)</Label>
            <Input
              value={editUnit.unitSize.toString()}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEditUnit((prev) => ({ ...prev, unitSize: parseInt(e.target.value) || 400 }))
              }
              placeholder="400"
              type="number"
            />
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={editUnit.status}
              onValueChange={(value: "AVAILABLE" | "RESERVED" | "OCCUPIED" | "PENDING") =>
                setEditUnit((prev) => ({ ...prev, status: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="AVAILABLE">Available</SelectItem>
                <SelectItem value="RESERVED">Reserved</SelectItem>
                <SelectItem value="OCCUPIED">Occupied</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button onClick={handleUpdateUnit} disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Unit"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default EditUnitDialog
