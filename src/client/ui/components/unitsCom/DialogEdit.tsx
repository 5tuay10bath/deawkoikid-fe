import { Edit } from "lucide-react"
import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import type { Unit, UnitStatus, UnitType } from "@client/types/IUnitData"

import { useUnitStore } from "@core/application/libs/store/useUnitStore"

import { Button } from "../Button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../Dialog"
import { Input } from "../Input"
import { Label } from "../Label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../Select"

const DialogEditUnits = ({ editingUnit }: { editingUnit: Unit }) => {
  const { updateUnit, loadUnits } = useUnitStore()
  const [isEditUnitOpen, setisEditUnitOpen] = useState(false) //button
  const [formData, setFormData] = useState<Partial<Unit>>({})

  useEffect(() => {
    if (editingUnit) {
      setFormData({ ...editingUnit })
      setisEditUnitOpen(false)
    }
  }, [editingUnit])
  const navigate = useNavigate()

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingUnit) return
    try {
      await updateUnit(editingUnit.id, formData)
      setisEditUnitOpen(false)
      await loadUnits()
      navigate("/units")
    } catch (error) {
      console.error("Failed to update unit:", error)
    }
  }
  return (
    <Dialog open={isEditUnitOpen} onOpenChange={setisEditUnitOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>Edit Unit</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <form onSubmit={handleSaveEdit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Unit Number</Label>
                <Input
                  value={formData.unitNumber || ""}
                  onChange={(e) => setFormData((prev) => ({ ...prev, unitNumber: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Floor</Label>
                <Select
                  value={formData.floor?.toString() ?? ""}
                  onValueChange={(value: string) => setFormData((prev) => ({ ...prev, floor: value }))} //potentially conflict int w string
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
                value={formData.unitType ?? ""}
                onValueChange={(value: UnitType) => setFormData((prev) => ({ ...prev, unitType: value }))}
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
                value={formData.unitSize ?? ""}
                onChange={(e) => setFormData((prev) => ({ ...prev, unitSize: Number(e.target.value) }))}
                placeholder="400 sq ft"
              />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={formData.status ?? ""}
                onValueChange={(value: UnitStatus) => setFormData((prev) => ({ ...prev, status: value }))}
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
            {/* <div className="space-y-2">
              <Label>Latest Aircon Service</Label>
            <Input
              type="date"
              value={formData.latestAirconService ?? ""}
                onChange={(e) => setFormData((prev) => ({ ...prev, latestAirconService: e.target.value }))}
              />
            </div> */}
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setisEditUnitOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Save Edit Unit</Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default DialogEditUnits
