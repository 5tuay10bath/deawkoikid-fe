import { useEffect } from "react"

import type { Unit, UnitStatus } from "@client/types/IUnitData"

import { useUnitStore } from "@core/application/libs/store/useUnitStore"

import { Badge } from "../Badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../table/Table"
import DialogEdit from "./DialogEdit"

const TableCompo = () => {
  const { units, loadUnits, searchTerm } = useUnitStore()

  useEffect(() => {
    loadUnits()
  }, [loadUnits])

  const filteredUnits = units.filter(
    (unit) =>
      // Add more for search
      String(unit.unitNumber).toLowerCase().includes(searchTerm.toLowerCase()) ||
      unit.status.toLowerCase().includes(searchTerm.toLowerCase()),
  )
  const statusConfig: Record<UnitStatus, { color: string; label: string }> = {
    available: { color: "bg-green-500 text-white", label: "Available" },
    occupied: { color: "bg-red-500 text-white", label: "Occupied" },
    maintenance: { color: "bg-orange-500 text-white", label: "Maintenance" },
    // checkout-pending: { color: "bg-muted text-white",label: "Checkout Pending"},
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Unit Number</TableHead>
          <TableHead>Unit Type</TableHead>
          <TableHead>Unit Size</TableHead>
          <TableHead>Floor</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Aircon</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredUnits.map((unit: Unit) => (
          <TableRow key={unit.id}>
            <TableCell className="font-medium">{unit.unitNumber}</TableCell>
            <TableCell className="font-medium">{unit.unitType}</TableCell>
            <TableCell className="font-medium">{unit.unitSize + " sqrt."}</TableCell>
            <TableCell className="font-medium">{unit.floor}</TableCell>

            <TableCell>
              {/* import as //badge not lucide */}

              <Badge className={statusConfig[unit.status]?.color}>
                {statusConfig[unit.status]?.label ?? unit.status}
              </Badge>
            </TableCell>

            <TableCell>{unit.latestAirconService}</TableCell>
            <TableCell>
              <DialogEdit editingUnit={unit} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default TableCompo
