import { useState } from "react"
import { Pencil } from "lucide-react"
import { useBuildingStore } from "@infrastructure/libs/store/buildings.store"
import { Button } from "../common/Button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../common/Table"
import type { BuildingModel } from "@domain/models/building.model"
import { EditBuildingDialog } from "./EditDialog"

const TableBuildings = () => {
  const { buildings, searchTerm } = useBuildingStore()
  const [selectedBuilding, setSelectedBuilding] = useState<BuildingModel | null>(null)
  const [isEditOpen, setIsEditOpen] = useState(false)

  const filteredBuildings = buildings.filter(
    (building) =>
      building.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      building.codeName.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleEdit = (building: BuildingModel) => {
    setSelectedBuilding(building)
    setIsEditOpen(true)
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Code Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Floor Count</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredBuildings.map((building) => (
            <TableRow key={building.id}>
              <TableCell className="font-medium">{building.name}</TableCell>
              <TableCell>{building.codeName}</TableCell>
              <TableCell>{building.description}</TableCell>
              <TableCell>{building.floorCount}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm" onClick={() => handleEdit(building)}>
                  <Pencil className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedBuilding && (
        <EditBuildingDialog
          building={selectedBuilding}
          isOpen={isEditOpen}
          onClose={() => {
            setIsEditOpen(false)
            setSelectedBuilding(null)
          }}
        />
      )}
    </>
  )
}

export default TableBuildings
