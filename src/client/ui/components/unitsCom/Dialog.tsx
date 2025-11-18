import { Plus } from "lucide-react"
import React, { useState, useEffect } from "react"

import type { CreateUnitDto } from "@infrastructure/inbound/dtos/createUnit.dto"
import { useUnitStore } from "src/infrastructure/libs/store/units.store"
import { axiosInstance } from "@infrastructure/libs/axios/axiosInstance"

import { Button } from "../common/Button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../common/Dialog"
import { Input } from "../common/Input"
import { Label } from "../common/Label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../common/Select"
import { useToast } from "../hooks/useToast"

interface Floor {
  id: string
  floorNumber: number
}

const DialogUnits = () => {
  const { createUnit } = useUnitStore()
  const { toast } = useToast()
  const [isAddUnitOpen, setIsAddUnitOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [floors, setFloors] = useState<Floor[]>([])
  const [newUnit, setNewUnit] = useState<CreateUnitDto>({
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
    if (isAddUnitOpen) {
      fetchFloors()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAddUnitOpen])

  const handleAddUnit = async () => {
    if (!newUnit.unitNumber || !newUnit.floor) {
      toast({
        title: "Error",
        description: "Please fill in unit number and floor",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      const result = await createUnit(newUnit)
      if (result.success) {
        setNewUnit({
          unitNumber: "",
          unitType: "A",
          unitSize: 400,
          floor: "",
        })
        setIsAddUnitOpen(false)
        toast({
          title: "Success",
          description: result.message || "Unit created successfully!",
        })
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to create unit",
          variant: "destructive",
        })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isAddUnitOpen} onOpenChange={setIsAddUnitOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Unit
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>Add New Unit</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Unit Number *</Label>
              <Input
                value={newUnit.unitNumber}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setNewUnit((prev) => ({ ...prev, unitNumber: e.target.value }))
                }
                placeholder="A101"
              />
            </div>
            <div className="space-y-2">
              <Label>Floor *</Label>
              <Select
                value={newUnit.floor}
                onValueChange={(value: string) => setNewUnit((prev) => ({ ...prev, floor: value }))}
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
              value={newUnit.unitType}
              onValueChange={(value: "A" | "B" | "C") => setNewUnit((prev) => ({ ...prev, unitType: value }))}
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
              value={newUnit.unitSize.toString()}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNewUnit((prev) => ({ ...prev, unitSize: parseFloat(e.target.value) || 400 }))
              }
              placeholder="400"
              type="number"
              step="0.01"
            />
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setIsAddUnitOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button onClick={handleAddUnit} disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Unit"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default DialogUnits
