import { Plus } from "lucide-react"
import React, { useState } from "react"
import { useNavigate } from "react-router-dom"

import type { Unit, UnitStatus, UnitType } from "@client/types/IUnitData"

import { useUnitStore } from "@core/application/libs/store/useUnitStore"

import { Button } from "../Button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../Dialog"
import { Input } from "../Input"
import { Label } from "../Label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../Select"

const DialogUnits = () => {
  const { addUnit, loadUnits } = useUnitStore()
  const [isAddUnitOpen, setIsAddUnitOpen] = useState(false) //button
  const [newUnit, setNewUnit] = useState({
    unitNumber: "",
    unitType: "A" as Unit["unitType"],
    unitSize: "",
    status: "available" as Unit["status"],
    floor: "",
    latestAirconService: "",
  })
  const navigate = useNavigate()
  const handleAddUnit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newUnit.unitNumber || !newUnit.unitType || !newUnit.unitSize || !newUnit.floor) {
      return
    }
    await addUnit({
      ...newUnit,
      unitSize: Number(newUnit.unitSize),
    })
    setNewUnit({
      unitNumber: "",
      unitType: "A",
      unitSize: "",
      status: "available",
      floor: "",
      latestAirconService: "",
    })
    setIsAddUnitOpen(false)
    await loadUnits()
    navigate("/units")
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
              onValueChange={(value: UnitType) => setNewUnit((prev) => ({ ...prev, unitType: value as UnitType }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="A">Studio</SelectItem>
                <SelectItem value="B">1 Bedroom</SelectItem>
                <SelectItem value="C">2 Bedroom</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Size</Label>
            <Input
              value={newUnit.unitSize}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNewUnit((prev) => ({ ...prev, unitSize: e.target.value }))
              }
              placeholder="400 sq ft"
            />
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={newUnit.status}
              onValueChange={(value: UnitStatus) => setNewUnit((prev) => ({ ...prev, status: value as UnitStatus }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="occupied">Occupied</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Latest Aircon Service</Label>
            <Input
              type="date"
              //type="datetime-local" if want time
              value={newUnit.latestAirconService}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNewUnit((prev) => ({ ...prev, latestAirconService: e.target.value }))
              }
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
