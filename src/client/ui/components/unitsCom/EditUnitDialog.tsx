import React, { useState, useEffect } from "react"

import type { UpdateUnitDto } from "@infrastructure/inbound/dtos/updateUnit.dto"
import type { UnitPageModel } from "@domain/models/unitPage.model"
import { useUnitStore } from "src/infrastructure/libs/store/units.store"
import { axiosInstance } from "@infrastructure/libs/axios/axiosInstance"

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

interface Floor {
  id: string
  floorNumber: number
}

const EditUnitDialog = ({ isOpen, onClose, unit }: EditUnitDialogProps) => {
  const { updateUnit } = useUnitStore()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [floors, setFloors] = useState<Floor[]>([])
  const [editUnit, setEditUnit] = useState<Omit<UpdateUnitDto, "id">>({
    unitNumber: "",
    unitType: "A",
    unitSize: 400,
    floor: "",
  })

  const fetchFloors = async () => {
    try {
      const { data } = await axiosInstance.get("/floors")
      setFloors(data.data || [])
    } catch {
      toast({
        title: "Error",
        description: "Failed to load floors",
        variant: "destructive",
      })
    }
  }

  // Fetch floors when dialog opens
  useEffect(() => {
    if (isOpen) {
      fetchFloors()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  // Update form when unit prop changes
  useEffect(() => {
    if (unit) {
      // Find floor ID from floor number (temporary solution until backend provides floor ID)
      const floorId = floors.find((f) => f.floorNumber === unit.floor)?.id || ""

      setEditUnit({
        unitNumber: unit.unitNumber,
        unitType: unit.unitType as "A" | "B" | "C",
        unitSize: unit.unitSize,
        floor: floorId,
      })
    }
  }, [unit, floors])

  const handleUpdateUnit = async () => {
    if (!unit?.id) {
      toast({
        title: "Error",
        description: "Unit ID is missing",
        variant: "destructive",
      })
      return
    }

    if (!editUnit.unitNumber || !editUnit.floor) {
      toast({
        title: "Error",
        description: "Please fill in unit number and floor",
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
              <Label>Floor *</Label>
              <Select
                value={editUnit.floor}
                onValueChange={(value: string) => setEditUnit((prev) => ({ ...prev, floor: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select floor" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {floors.map((floor) => (
                    <SelectItem key={floor.id} value={floor.id}>
                      Floor {floor.floorNumber}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Unit Type *</Label>
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
            <Label>Size (sq ft) *</Label>
            <Input
              value={editUnit.unitSize.toString()}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEditUnit((prev) => ({ ...prev, unitSize: parseFloat(e.target.value) || 400 }))
              }
              placeholder="400"
              type="number"
              step="0.01"
            />
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
