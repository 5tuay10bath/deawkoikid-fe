import { Plus } from "lucide-react"
import React, { useState } from "react"

import { Button } from "../common/Button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../common/Dialog"
import { Input } from "../common/Input"
import { Label } from "../common/Label"
import { Textarea } from "../common/TextArea"
import { useToast } from "../hooks/useToast"

interface NewBuildingForm {
  name: string
  codename: string
  totalFloors: string
  description: string
}

const DialogBuildings = () => {
  const { toast } = useToast()
  const [isAddBuildingOpen, setIsAddBuildingOpen] = useState(false)
  const [step, setStep] = useState<1 | 2>(1)
  const [newBuilding, setNewBuilding] = useState<NewBuildingForm>({
    name: "",
    codename: "",
    totalFloors: "",
    description: "",
  })
  const [floorRooms, setFloorRooms] = useState<string[]>([])

  const resetForm = () => {
    setStep(1)
    setNewBuilding({
      name: "",
      codename: "",
      totalFloors: "",
      description: "",
    })
    setFloorRooms([])
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

    setFloorRooms(Array.from({ length: totalFloorsCount }, () => ""))
    setStep(2)
  }

  const handleBack = () => {
    setStep(1)
  }

  const handleFinish = () => {
    if (floorRooms.some((room) => !room)) {
      toast({
        title: "Missing room info",
        description: "Please provide total rooms for each floor.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Building configuration complete",
      description: "Ready to submit building details.",
    })
  }

  const handleRoomChange = (index: number, value: string) => {
    setFloorRooms((prev) => {
      const updated = [...prev]
      updated[index] = value
      return updated
    })
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
            <DialogTitle>{step === 1 ? "Create New Building" : "Floor Total Room Config"}</DialogTitle>
          </DialogHeader>
          <div className="flex-1 min-h-0 overflow-y-auto px-4">
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
            ) : (
              <div className="flex min-h-0 flex-col space-y-4">
                <div className="flex gap-6 min-h-0 flex-1">
                  {(() => {
                    const midpoint = Math.ceil(floorRooms.length / 2)
                    const leftFloors = floorRooms.slice(0, midpoint)
                    const rightFloors = floorRooms.slice(midpoint)

                    const renderColumn = (floors: string[], offset: number) => (
                      <div className="flex-1 space-y-4 pr-1">
                        {floors.map((rooms, idx) => (
                          <div key={`floor-${offset + idx}`} className="grid grid-cols-[auto_1fr] items-center gap-3">
                            <Label className="text-sm font-medium">{`Floor ${offset + idx + 1}:`}</Label>
                            <Input
                              type="number"
                              min="0"
                              value={rooms}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                handleRoomChange(offset + idx, e.target.value)
                              }
                              placeholder="Total rooms"
                            />
                          </div>
                        ))}
                      </div>
                    )

                    return (
                      <div className="flex w-full flex-1 min-h-0 overflow-y-auto gap-6 pr-1">
                        {renderColumn(leftFloors, 0)}
                        <div className="w-px bg-slate-200 shrink-0" />
                        {renderColumn(rightFloors, midpoint)}
                      </div>
                    )
                  })()}
                </div>
                <div className="flex items-center justify-between gap-3">
                  <Button variant="outline" onClick={handleBack}>
                    Back
                  </Button>
                  <Button onClick={handleFinish}>Finish</Button>
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
