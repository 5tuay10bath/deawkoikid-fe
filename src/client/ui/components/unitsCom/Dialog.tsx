import { Plus } from "lucide-react"
import React, { useState } from "react"

import { useUnitStore } from "src/infrastructure/libs/store/units.store"

import { Button } from "../common/Button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../common/Dialog"
import { Input } from "../common/Input"
import { Label } from "../common/Label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../common/Select"

const DialogUnits = () => {
  const { units, setUnits } = useUnitStore()
  const [isAddUnitOpen, setIsAddUnitOpen] = useState(false)
  const [newUnit, setNewUnit] = useState({
    unitNumber: "",
    floor: "",
    unitType: "",
    unitSize: "",
  })
  const handleAddUnit = () => {
    if (!newUnit.unitNumber || !newUnit.floor || !newUnit.unitType) {
      return
    }

    const unit = {
      id: Date.now().toString(),
      address: "",
      unitNumber: newUnit.unitNumber,
      floor: parseInt(newUnit.floor),
      unitType: newUnit.unitType as "A" | "B" | "C",
      unitSize: parseInt(newUnit.unitSize) || 400,
      status: "available" as const,
      latestAirconService: new Date(),
    }

    setUnits([...units, unit])
    setNewUnit({ unitNumber: "", floor: "", unitType: "", unitSize: "" })
    setIsAddUnitOpen(false)
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
                value={newUnit.floor}
                onValueChange={(value: string) => setNewUnit((prev) => ({ ...prev, floor: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select floor" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="1">Floor 1</SelectItem>
                  <SelectItem value="2">Floor 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Unit Type</Label>
            <Select
              value={newUnit.unitType}
              onValueChange={(value: string) => setNewUnit((prev) => ({ ...prev, unitType: value }))}
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
              value={newUnit.unitSize}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNewUnit((prev) => ({ ...prev, unitSize: e.target.value }))
              }
              placeholder="400"
              type="number"
            />
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setIsAddUnitOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddUnit}>Add Unit</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default DialogUnits
