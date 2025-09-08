import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/table/Table"
import { Search, Edit, Building } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/mock/card"
import { Button } from "../components/Button"
import { Input } from "../components/Input"
import { Badge } from "../components/Badge"
import { useUnitStore } from "@core/application/libs/store/units.store"
import DialogUnits from "../components/unitsCom/Dialog"

export default function Units() {
  const { units } = useUnitStore()
  const [searchTerm, setSearchTerm] = useState("")

  const filteredUnits = units.filter(unit =>
    unit.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    unit.type.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const statusConfig = {
    available: { color: "bg-green-500 text-white", label: "Available" },
    occupied: { color: "bg-red-500 text-white", label: "Occupied" },
    maintenance: { color: "bg-orange-500 text-white", label: "Maintenance" },
    "checkout-pending": { color: "bg-muted text-white", label: "Checkout Pending" }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Unit Management</h1>
          <p className="text-muted-foreground">Manage all property units</p>
        </div>
        <DialogUnits />
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              All Units
            </CardTitle>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search units..."
                  value={searchTerm}
                  onChange={(e : React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                  className="pl-9 w-64"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
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
                    <Badge className={statusConfig[unit.status].color}>
                      {statusConfig[unit.status].label}
                    </Badge>
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
        </CardContent>
      </Card>
    </div>
  )
}