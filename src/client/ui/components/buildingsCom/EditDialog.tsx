import { useState, useEffect, useMemo } from "react"
import { useBuildingStore } from "@infrastructure/libs/store/buildings.store"
import { useToast } from "../hooks/useToast"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../common/Dialog"
import { Button } from "../common/Button"
import { Input } from "../common/Input"
import { Label } from "../common/Label"
import { Textarea } from "../common/TextArea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../common/Tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../common/Select"
import type { BuildingModel } from "@domain/models/building.model"

interface EditBuildingDialogProps {
  building: BuildingModel
  isOpen: boolean
  onClose: () => void
}

export const EditBuildingDialog = ({ building, isOpen, onClose }: EditBuildingDialogProps) => {
  const { updateBuilding, updateFloor } = useBuildingStore()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  // Building form state
  const [buildingForm, setBuildingForm] = useState({
    name: building.name,
    codeName: building.codeName,
    description: building.description,
  })

  // Floor form state
  const [selectedFloorId, setSelectedFloorId] = useState("")
  const [floorUnitCount, setFloorUnitCount] = useState<number>(0)

  // Get floors from building data (memoized to prevent re-renders)
  const floors = useMemo(() => building.floors || [], [building.floors])

  useEffect(() => {
    if (isOpen) {
      setBuildingForm({
        name: building.name,
        codeName: building.codeName,
        description: building.description,
      })
    }
  }, [building, isOpen])

  // Auto-fill unit count when floor is selected
  useEffect(() => {
    const selectedFloor = floors.find((floor) => floor.id === selectedFloorId)
    if (selectedFloor) {
      setFloorUnitCount(selectedFloor.unitCount)
    }
  }, [selectedFloorId, floors])

  const handleUpdateBuilding = async () => {
    if (!buildingForm.name || !buildingForm.codeName) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    const result = await updateBuilding({
      id: building.id,
      ...buildingForm,
    })
    setIsLoading(false)

    if (result.success) {
      toast({
        title: "Success",
        description: result.message || "Building updated successfully",
      })
      onClose()
    } else {
      toast({
        title: "Error",
        description: result.message || "Failed to update building",
        variant: "destructive",
      })
    }
  }

  const handleUpdateFloor = async () => {
    if (!selectedFloorId || floorUnitCount <= 0) {
      toast({
        title: "Error",
        description: "Please select a floor and provide valid unit count",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    const result = await updateFloor({
      id: selectedFloorId,
      unitCount: floorUnitCount,
    })
    setIsLoading(false)

    if (result.success) {
      toast({
        title: "Success",
        description: result.message || "Floor updated successfully",
      })
      setSelectedFloorId("")
      setFloorUnitCount(0)
      onClose()
    } else {
      toast({
        title: "Error",
        description: result.message || "Failed to update floor",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Building</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="building" className="w-full mt-5">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="building">Building Info</TabsTrigger>
            <TabsTrigger value="floors">Floor Management</TabsTrigger>
          </TabsList>

          <TabsContent value="building" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Building Name *</Label>
              <Input
                id="name"
                value={buildingForm.name}
                onChange={(e) => setBuildingForm({ ...buildingForm, name: e.target.value })}
                placeholder="e.g., DeawKoiKid Tower"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="codeName">Code Name *</Label>
              <Input
                id="codeName"
                value={buildingForm.codeName}
                onChange={(e) => setBuildingForm({ ...buildingForm, codeName: e.target.value })}
                placeholder="e.g., DKK"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={buildingForm.description}
                onChange={(e) => setBuildingForm({ ...buildingForm, description: e.target.value })}
                placeholder="Brief description of the building"
                rows={4}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={onClose} disabled={isLoading}>
                Cancel
              </Button>
              <Button onClick={handleUpdateBuilding} disabled={isLoading}>
                {isLoading ? "Updating..." : "Update Building"}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="floors" className="space-y-4">
            <p className="text-sm text-muted-foreground">Select a floor to update its unit count.</p>

            <div className="space-y-2">
              <Label htmlFor="floor-select">Floor *</Label>
              <Select value={selectedFloorId} onValueChange={(value) => setSelectedFloorId(value)}>
                <SelectTrigger id="floor-select">
                  <SelectValue placeholder="Select a floor" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {floors.length === 0 ? (
                    <SelectItem value="no-floors" disabled>
                      No floors available
                    </SelectItem>
                  ) : (
                    floors.map((floor) => (
                      <SelectItem key={floor.id} value={floor.id}>
                        Floor {floor.floorNumber} (Current: {floor.unitCount} units)
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="unitCount">Unit Count *</Label>
              <Input
                id="unitCount"
                type="number"
                min="1"
                value={floorUnitCount || ""}
                onChange={(e) => setFloorUnitCount(parseInt(e.target.value) || 0)}
                placeholder="e.g., 12"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={onClose} disabled={isLoading}>
                Cancel
              </Button>
              <Button onClick={handleUpdateFloor} disabled={isLoading || !selectedFloorId}>
                {isLoading ? "Updating..." : "Update Floor"}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
