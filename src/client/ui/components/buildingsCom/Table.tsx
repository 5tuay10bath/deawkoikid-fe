import { useBuildingStore } from "@infrastructure/libs/store/buildings.store"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../common/Table"

const TableBuildings = () => {
  const { buildings, searchTerm } = useBuildingStore()

  const filteredBuildings = buildings.filter(
    (building) =>
      building.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      building.codeName.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Code Name</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Floor Count</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredBuildings.map((building) => (
          <TableRow key={building.id}>
            <TableCell className="font-medium">{building.name}</TableCell>
            <TableCell>{building.codeName}</TableCell>
            <TableCell>{building.description}</TableCell>
            <TableCell>{building.floorCount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default TableBuildings
