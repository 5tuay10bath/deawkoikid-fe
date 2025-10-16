import { Plus } from "lucide-react"
import React, { useState } from "react"

import type { CreateUnitDto } from "@infrastructure/inbound/dtos/createUnit.dto"
import { useUnitStore } from "src/infrastructure/libs/store/units.store"

import { Button } from "../common/Button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../common/Dialog"
import { Input } from "../common/Input"
import { Label } from "../common/Label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../common/Select"
import { useToast } from "../hooks/useToast"

const DialogUnits = () => {
  const { createUnit } = useUnitStore()
  const { toast } = useToast()
  const [isAddUnitOpen, setIsAddUnitOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newUnit, setNewUnit] = useState<CreateUnitDto>({
    unitNumber: "",
    address: "",
    unitType: "A",
    unitSize: 400,
    status: "AVAILABLE",
    floor: 1,
  })

  const handleAddUnit = async () => {
    if (!newUnit.unitNumber || !newUnit.address) {
      toast({
        title: "Error",
        description: "Please fill in unit number and address",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      const result = await createUnit(newUnit)
      if (result.success) {
        // Reset form
        setNewUnit({
          unitNumber: "",
          address: "",
          unitType: "A",
          unitSize: 400,
          status: "AVAILABLE",
          floor: 1,
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
              <Label>Unit Number</Label>
              <Input
                value={newUnit.unitNumber}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setNewUnit((prev) => ({ ...prev, unitNumber: e.target.value }))
                }
                placeholder="101"
              />
            </div>
            <div className="space-y-2">
              <Label>Floor</Label>
              <Select
                value={newUnit.floor.toString()}
                onValueChange={(value: string) => setNewUnit((prev) => ({ ...prev, floor: parseInt(value) }))}
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
              value={newUnit.address}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNewUnit((prev) => ({ ...prev, address: e.target.value }))
              }
              placeholder="Building A, 123 Street"
            />
          </div>
          <div className="space-y-2">
            <Label>Unit Type</Label>
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
            <Label>Size (sq ft)</Label>
            <Input
              value={newUnit.unitSize.toString()}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNewUnit((prev) => ({ ...prev, unitSize: parseInt(e.target.value) || 400 }))
              }
              placeholder="400"
              type="number"
            />
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={newUnit.status}
              onValueChange={(value: "AVAILABLE" | "RESERVED" | "OCCUPIED") =>
                setNewUnit((prev) => ({ ...prev, status: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="AVAILABLE">Available</SelectItem>
                <SelectItem value="RESERVED">Reserved</SelectItem>
                <SelectItem value="OCCUPIED">Occupied</SelectItem>
              </SelectContent>
            </Select>
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
