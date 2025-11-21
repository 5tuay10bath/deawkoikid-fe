import { Plus } from "lucide-react"
import React, { useState } from "react"

import { useBuildingStore } from "@infrastructure/libs/store/buildings.store"
import type { CreateBuildingDto } from "@infrastructure/inbound/dtos/createBuilding.dto"
import { Button } from "../common/Button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../common/Dialog"
import { Input } from "../common/Input"
import { Label } from "../common/Label"
import { Textarea } from "../common/TextArea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../common/Select"
import { useToast } from "../hooks/useToast"

interface NewBuildingForm {
  name: string
  codename: string
  totalFloors: string
  description: string
}

interface UnitForm {
  unitNumber: string
  unitType: string
  unitSize: string
}

const DialogBuildings = () => {
  const { toast } = useToast()
  const { createBuilding } = useBuildingStore()
  const [isAddBuildingOpen, setIsAddBuildingOpen] = useState(false)
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [newBuilding, setNewBuilding] = useState<NewBuildingForm>({
    name: "",
    codename: "",
    totalFloors: "",
    description: "",
  })
  const [floorUnits, setFloorUnits] = useState<UnitForm[][]>([])
  const [currentFloor, setCurrentFloor] = useState(0)

  const resetForm = () => {
    setStep(1)
    setNewBuilding({
      name: "",
      codename: "",
      totalFloors: "",
      description: "",
    })
    setFloorUnits([])
    setCurrentFloor(0)
  }

  const handleOpenChange = (open: boolean) => {
    setIsAddBuildingOpen(open)
    if (!open) {
      resetForm()
    }
  }

  const handleNext = () => {
    if (!newBuilding.name || !newBuilding.codename || !newBuilding.totalFloors) {
      toast({
        title: "Missing information",
        description: "Name, codename, and total floors are required.",
        variant: "destructive",
      })
      return
    }

    const totalFloorsCount = Number(newBuilding.totalFloors)
    if (!Number.isInteger(totalFloorsCount) || totalFloorsCount <= 0) {
      toast({
        title: "Invalid total floors",
        description: "Total floors must be a positive whole number.",
        variant: "destructive",
      })
      return
    }

    // Initialize floor units array
    setFloorUnits(Array.from({ length: totalFloorsCount }, () => []))
    setCurrentFloor(0)
    setStep(2)
  }

  const handleBack = () => {
    if (step === 3) {
      setStep(2)
    } else {
      setStep(1)
    }
  }

  const handleNextFloor = () => {
    const units = floorUnits[currentFloor]
    if (!units || units.length === 0) {
      toast({
        title: "Missing units",
        description: "Please add at least one unit for this floor.",
        variant: "destructive",
      })
      return
    }

    // Validate all units
    for (const unit of units) {
      if (!unit.unitNumber || !unit.unitType || !unit.unitSize) {
        toast({
          title: "Incomplete unit",
          description: "All unit fields are required.",
          variant: "destructive",
        })
        return
      }
    }

    if (currentFloor < floorUnits.length - 1) {
      setCurrentFloor(currentFloor + 1)
    } else {
      setStep(3)
    }
  }

  const handleAddUnit = () => {
    const newUnits = [...floorUnits]
    newUnits[currentFloor] = [...newUnits[currentFloor], { unitNumber: "", unitType: "", unitSize: "" }]
    setFloorUnits(newUnits)
  }

  const handleRemoveUnit = (unitIndex: number) => {
    const newUnits = [...floorUnits]
    newUnits[currentFloor] = newUnits[currentFloor].filter((_, idx) => idx !== unitIndex)
    setFloorUnits(newUnits)
  }

  const handleUnitChange = (unitIndex: number, field: keyof UnitForm, value: string) => {
    const newUnits = [...floorUnits]
    newUnits[currentFloor][unitIndex][field] = value
    setFloorUnits(newUnits)
  }

  const handleFinish = async () => {
    try {
      // Build the DTO according to the format
      const dto: CreateBuildingDto = {
        name: newBuilding.name,
        codeName: newBuilding.codename,
        description: newBuilding.description,
        floors: floorUnits.map((units, index) => ({
          floorNumber: String(index + 1),
          unitCount: units.length,
          units: units.map((unit) => ({
            unitNumber: unit.unitNumber,
            unitType: unit.unitType,
            unitSize: parseFloat(unit.unitSize),
          })),
        })),
      }

      const result = await createBuilding(dto)

      if (result.success) {
        toast({
          title: "Success",
          description: result.message || "Building created successfully",
        })
        handleOpenChange(false)
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to create building",
          variant: "destructive",
        })
      }
    } catch {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={isAddBuildingOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Building
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white max-h-screen">
        <div className="flex max-h-full flex-col">
          <DialogHeader className="shrink-0 px-4">
            <DialogTitle>
              {step === 1
                ? "Create New Building"
                : step === 2
                  ? `Configure Floor ${currentFloor + 1} of ${floorUnits.length}`
                  : "Review & Confirm"}
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 min-h-0 overflow-y-auto px-4 mb-11">
            {step === 1 ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Name *</Label>
                  <Input
                    value={newBuilding.name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setNewBuilding((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="Name of the building"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Codename *</Label>
                  <Input
                    value={newBuilding.codename}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setNewBuilding((prev) => ({ ...prev, codename: e.target.value }))
                    }
                    placeholder="Internal codename"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Total Floors *</Label>
                  <Input
                    value={newBuilding.totalFloors}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setNewBuilding((prev) => ({ ...prev, totalFloors: e.target.value }))
                    }
                    placeholder="10"
                    type="number"
                    min="1"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description (Optional)</Label>
                  <Textarea
                    value={newBuilding.description}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      setNewBuilding((prev) => ({ ...prev, description: e.target.value }))
                    }
                    placeholder="Describe the building..."
                  />
                </div>
                <div className="flex items-center justify-between gap-3">
                  <Button variant="outline" onClick={() => handleOpenChange(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleNext}>Next</Button>
                </div>
              </div>
            ) : step === 2 ? (
              <div className="flex min-h-0 flex-col space-y-4">
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    Add units for Floor {currentFloor + 1}. You can add multiple units per floor.
                  </p>
                  {floorUnits[currentFloor]?.map((unit, idx) => (
                    <div key={idx} className="border rounded p-4 space-y-3 relative">
                      <div className="absolute top-2 right-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveUnit(idx)}
                          className="text-red-500"
                        >
                          Remove
                        </Button>
                      </div>
                      <div className="space-y-2">
                        <Label>Unit Number *</Label>
                        <Input
                          value={unit.unitNumber}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleUnitChange(idx, "unitNumber", e.target.value)
                          }
                          placeholder="DTB101"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Unit Type *</Label>
                        <Select
                          value={unit.unitType}
                          onValueChange={(value) => handleUnitChange(idx, "unitType", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select unit type" />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            <SelectItem value="A">Type A</SelectItem>
                            <SelectItem value="B">Type B</SelectItem>
                            <SelectItem value="C">Type C</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Unit Size (sq ft) *</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={unit.unitSize}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleUnitChange(idx, "unitSize", e.target.value)
                          }
                          placeholder="30.12"
                        />
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" onClick={handleAddUnit} className="w-full">
                    + Add Unit
                  </Button>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <Button variant="outline" onClick={handleBack}>
                    Back
                  </Button>
                  <Button onClick={handleNextFloor}>
                    {currentFloor < floorUnits.length - 1 ? "Next Floor" : "Review"}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex min-h-0 flex-col space-y-4">
                <div className="space-y-4 overflow-y-auto">
                  <div className="border rounded p-4 space-y-2">
                    <h3 className="font-semibold">Building Information</h3>
                    <p>
                      <strong>Name:</strong> {newBuilding.name}
                    </p>
                    <p>
                      <strong>Code Name:</strong> {newBuilding.codename}
                    </p>
                    <p>
                      <strong>Description:</strong> {newBuilding.description}
                    </p>
                    <p>
                      <strong>Total Floors:</strong> {floorUnits.length}
                    </p>
                  </div>
                  {floorUnits.map((units, floorIdx) => (
                    <div key={floorIdx} className="border rounded p-4 space-y-2">
                      <h3 className="font-semibold">
                        Floor {floorIdx + 1} ({units.length} units)
                      </h3>
                      <div className="space-y-1 text-sm">
                        {units.map((unit, unitIdx) => (
                          <p key={unitIdx}>
                            {unit.unitNumber} - Type {unit.unitType} - {unit.unitSize} sq ft
                          </p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between gap-3">
                  <Button variant="outline" onClick={handleBack}>
                    Back
                  </Button>
                  <Button onClick={handleFinish}>Create Building</Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default DialogBuildings
