import { Edit } from "lucide-react"

import { useUnitStore } from "src/infrastructure/libs/store/units.store"

import { Badge } from "../common/Badge"
import { Button } from "../common/Button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../common/Table"

const TableUnits = () => {
  const { units, searchTerm } = useUnitStore()

  const filteredUnits = units.filter(
    (unit) =>
      unit.unitNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      unit.unitType.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const statusConfig = {
    available: { color: "bg-green-500 text-white", label: "Available" },
    occupied: { color: "bg-red-500 text-white", label: "Occupied" },
    reserved: { color: "bg-orange-500 text-white", label: "Reserved" },
  }

  const getStatusConfig = (status: string) => {
    const normalizedStatus = status.toLowerCase()
    return (
      statusConfig[normalizedStatus as keyof typeof statusConfig] || {
        color: "bg-gray-500 text-white",
        label: status,
      }
    )
  }

  return (
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
              <Badge className={getStatusConfig(unit.status).color} data-cy={`unit-status-${unit.status}`}>
                {getStatusConfig(unit.status).label}
              </Badge>
            </TableCell>
            <TableCell>
              <Button variant="ghost" size="sm" data-cy="edit-unit-button">
                <Edit className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default TableUnits
