import { Edit } from "lucide-react"
import { useState } from "react"

import { useUnitStore } from "@infrastructure/libs/store/units.store"
import type { UnitPageModel } from "@domain/models/unitPage.model"

import { Badge } from "../common/Badge"
import { Button } from "../common/Button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../common/Table"
import EditUnitDialog from "./EditUnitDialog"

const TableUnits = () => {
  const { units, searchTerm } = useUnitStore()
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [selectedUnit, setSelectedUnit] = useState<UnitPageModel | null>(null)

  const handleEditClick = (unit: UnitPageModel) => {
    setSelectedUnit(unit)
    setIsEditOpen(true)
  }

  const filteredUnits = units.filter(
    (unit) =>
      unit.unitNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      unit.unitType.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const statusConfig = {
    AVAILABLE: { color: "bg-green-500 text-white", label: "Available" },
    OCCUPIED: { color: "bg-red-500 text-white", label: "Occupied" },
    RESERVED: { color: "bg-orange-500 text-white", label: "Reserved" },
    PENDING: { color: "bg-blue-500 text-white", label: "Pending" },
  }

  const getStatusConfig = (status: string) => {
    return (
      statusConfig[status as keyof typeof statusConfig] || {
        color: "bg-gray-500 text-white",
        label: status,
      }
    )
  }

  return (
    <>
      <Table data-cy="units-table">
        <TableHeader>
          <TableRow>
            <TableHead>Unit Number</TableHead>
            <TableHead>Floor</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredUnits.map((unit) => (
            <TableRow key={unit.id} data-cy={`unit-row-${unit.unitNumber}`}>
              <TableCell className="font-medium" data-cy="unit-number">
                {unit.unitNumber}
              </TableCell>
              <TableCell data-cy="unit-floor">{unit.floor}</TableCell>
              <TableCell data-cy="unit-type">{unit.unitType}</TableCell>
              <TableCell data-cy="unit-size">{unit.unitSize} sq ft</TableCell>
              <TableCell>
                <Badge className={getStatusConfig(unit.unitStatus).color} data-cy={`unit-status-${unit.unitStatus}`}>
                  {getStatusConfig(unit.unitStatus).label}
                </Badge>
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="sm" data-cy="edit-unit-button" onClick={() => handleEditClick(unit)}>
                  <Edit className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Edit Unit Dialog */}
      <EditUnitDialog isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} unit={selectedUnit} />
    </>
  )
}

export default TableUnits
