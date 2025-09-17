import { Edit } from "lucide-react"

import { useUnitStore } from "src/infrastructure/libs/store/units.store"

import { Badge } from "../Badge"
import { Button } from "../Button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../table/Table"

const TableUnits = () => {
  const { units, searchTerm } = useUnitStore()

  const filteredUnits = units.filter(
    (unit) =>
      unit.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      unit.type.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const statusConfig = {
    available: { color: "bg-green-500 text-white", label: "Available" },
    occupied: { color: "bg-red-500 text-white", label: "Occupied" },
    maintenance: { color: "bg-orange-500 text-white", label: "Maintenance" },
    "checkout-pending": {
      color: "bg-muted text-white",
      label: "Checkout Pending",
    },
  }

  return (
    <Table>
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
          <TableRow key={unit.id}>
            <TableCell className="font-medium">{unit.number}</TableCell>
            <TableCell>{unit.floor}</TableCell>
            <TableCell>{unit.type}</TableCell>
            <TableCell>{unit.size}</TableCell>
            <TableCell>
              <Badge className={statusConfig[unit.status].color}>{statusConfig[unit.status].label}</Badge>
            </TableCell>
            <TableCell>
              <Button variant="ghost" size="sm">
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
