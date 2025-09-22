import { Badge, Edit } from "lucide-react"
import { useEffect } from "react"

import type { Unit } from "@client/types/IUnitData"

import { useUnitStore } from "@core/application/libs/store/useUnitStore"

import { Button } from "../Button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../table/Table"

//Filterunit(Searchbar) and status color

const TableCompo = () => {
  const { units, loadUnits } = useUnitStore()

  useEffect(() => {
    loadUnits()
  }, [loadUnits])

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
          <TableHead>IsActive</TableHead>
          <TableHead>Aircon</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {units.map((unit: Unit) => (
          <TableRow key={unit.id}>
            <TableCell className="font-medium">{unit.unitNumber}</TableCell>
            {/* <TableCell>{unit.isActive ? "Active" : "Inactive"}</TableCell> */}
            <TableCell>
              <Badge className={statusConfig[unit.isActive ? "available" : "occupied"].color}>
                {statusConfig[unit.isActive ? "available" : "occupied"].label}
              </Badge>
            </TableCell>
            <TableCell>{unit.latestAirconService}</TableCell>
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

export default TableCompo
