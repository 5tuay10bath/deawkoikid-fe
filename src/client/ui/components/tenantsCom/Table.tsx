import { format } from "date-fns"
import { Eye, Edit, Trash2 } from "lucide-react"

import type { Tenant } from "src/infrastructure/mockData/mockData"

import { useTenantStore } from "src/infrastructure/libs/store/tenants.store"

import { Avatar, AvatarFallback } from "../common/Avatar"
import { Badge } from "../common/Badge"
import { Button } from "../common/Button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../common/Table"

const TableTenants = () => {
  const { tenants, searchTerm } = useTenantStore()

  const filteredTenants = tenants.filter(
    (tenant) =>
      tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.unitNumber.includes(searchTerm),
  )

  const statusConfig: Record<Tenant["status"], { color: string; label: string }> = {
    active: { color: "bg-green-400 text-white", label: "Active" },
    "checkout-pending": {
      color: "bg-blue-400 text-white",
      label: "Check-out Pending",
    },
    overdue: { color: "bg-red-400 text-white", label: "Overdue" },
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Tenant</TableHead>
          <TableHead>Unit</TableHead>
          <TableHead>Contact</TableHead>
          <TableHead>Lease Period</TableHead>
          <TableHead>Rent</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredTenants.map((tenant) => (
          <TableRow key={tenant.id}>
            <TableCell>
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>{getInitials(tenant.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{tenant.name}</p>
                  <p className="text-muted-foreground text-sm">{tenant.email}</p>
                </div>
              </div>
            </TableCell>
            <TableCell className="font-medium">{tenant.unitNumber}</TableCell>
            <TableCell>{tenant.phone}</TableCell>
            <TableCell>
              <div className="text-sm">
                <p>{format(tenant.checkIn, "MMM dd, yyyy")}</p>
                <p className="text-muted-foreground">to {format(tenant.checkOut, "MMM dd, yyyy")}</p>
              </div>
            </TableCell>
            <TableCell>${tenant.rentAmount}/mo</TableCell>
            <TableCell>
              <Badge className={statusConfig[tenant.status].color}>{statusConfig[tenant.status].label}</Badge>
            </TableCell>
            <TableCell>
              <div className="flex gap-1">
                <Button variant="ghost" size="sm">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default TableTenants
