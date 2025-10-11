import { Plus } from "lucide-react"
import React, { useState } from "react"

import type { Room } from "src/infrastructure/mockData/mockData"

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
    number: "",
    floor: "",
    type: "",
    size: "",
  })
  const handleAddUnit = () => {
    if (!newUnit.number || !newUnit.floor || !newUnit.type) {
      return
    }

    const unit: Room = {
      id: newUnit.number,
      number: newUnit.number,
      floor: parseInt(newUnit.floor),
      type: newUnit.type,
      size: newUnit.size || "400 sq ft",
      status: "available",
    }

    setUnits([...units, unit])
    setNewUnit({ number: "", floor: "", type: "", size: "" })
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
                value={newUnit.number}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setNewUnit((prev) => ({ ...prev, number: e.target.value }))
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
              value={newUnit.type}
              onValueChange={(value: string) => setNewUnit((prev) => ({ ...prev, type: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="Studio">Studio</SelectItem>
                <SelectItem value="1BR">1 Bedroom</SelectItem>
                <SelectItem value="2BR">2 Bedroom</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Size</Label>
            <Input
              value={newUnit.size}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNewUnit((prev) => ({ ...prev, size: e.target.value }))
              }
              placeholder="400 sq ft"
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
