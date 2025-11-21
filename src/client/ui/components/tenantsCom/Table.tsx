import { format } from "date-fns"
import { Eye, Edit, Trash2 } from "lucide-react"
import { useState } from "react"

import { useTenantStore } from "@infrastructure/libs/store/tenants.store"
import type { TenantsPageModel } from "@domain/models/tenantsPage.model"

import { Avatar, AvatarFallback } from "../common/Avatar"
import { Badge } from "../common/Badge"
import { Button } from "../common/Button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../common/Table"
import EditTenantDialog from "./EditTenantDialog"

const TableTenants = () => {
  const { tenants, searchTerm, statusFilter } = useTenantStore()
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [selectedTenant, setSelectedTenant] = useState<TenantsPageModel | null>(null)

  const handleEditClick = (tenant: TenantsPageModel) => {
    setSelectedTenant(tenant)
    setIsEditOpen(true)
  }

  const filteredTenants = tenants.filter((tenant) => {
    const matchesSearch =
      tenant.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.phone.includes(searchTerm)

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && tenant.active) ||
      (statusFilter === "inactive" && !tenant.active)

    return matchesSearch && matchesStatus
  })

  const statusConfig = {
    active: { color: "bg-green-500 text-white", label: "Active" },
    inactive: { color: "bg-slate-500 text-white", label: "Inactive" },
  }
  const showdialog = (tenant: Tenant) => {
    Swal.fire({
      title: "Are you sure?",
      text: `You want to delete "${tenant.name}"?`,
      icon: "error",
      showCancelButton: true,
      confirmButtonColor: "#28a745",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      // eslint-disable-next-line promise/always-return
      if (result.isConfirmed) {
        Swal.fire({
          title: "Deleting...",
          text: "Please wait.",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading()
          },
        })
        try {
          await axios.delete(`${import.meta.env.VITE_PUBLIC_API_ENDPOINT}units/${tenant.id}`)
          Swal.fire({
            title: "Deleted!",
            text: tenant.name + " has been deleted.",
            icon: "success",
          })
        } catch (error) {
          console.error(error)
          Swal.fire({
            title: "Error!",
            text: "Failed to delete: " + tenant.name,
            icon: "error",
          })
        }
      }
    })
  }
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }
  return (
    <>
      <Table data-cy="tenants-table">
        <TableHeader>
          <TableRow>
            <TableHead>Tenant</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Birth Date</TableHead>
            <TableHead>ID Number</TableHead>
            <TableHead>Emergency Contact</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredTenants.map((tenant) => (
            <TableRow key={tenant.id} data-cy={`tenant-row-${tenant.id}`}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>{getInitials(tenant.fullName)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium" data-cy="tenant-name">
                      {tenant.fullName}
                    </p>
                    <p className="text-muted-foreground text-sm" data-cy="tenant-email">
                      {tenant.email}
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell data-cy="tenant-phone">{tenant.phone}</TableCell>
              <TableCell>
                <div className="text-sm">{format(new Date(tenant.birthDate), "MMM dd, yyyy")}</div>
              </TableCell>
              <TableCell className="font-mono text-sm">{tenant.identificationNumber}</TableCell>
              <TableCell>
                <div className="text-sm">
                  <p>{tenant.emergencyContactName || "N/A"}</p>
                  {tenant.emergencyContactPhone && (
                    <p className="text-muted-foreground">{tenant.emergencyContactPhone}</p>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  className={tenant.active ? statusConfig.active.color : statusConfig.inactive.color}
                  data-cy={`tenant-status-${tenant.active ? "active" : "inactive"}`}
                >
                  {tenant.active ? statusConfig.active.label : statusConfig.inactive.label}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" data-cy="view-tenant-button">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    data-cy="edit-tenant-button"
                    onClick={() => handleEditClick(tenant)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" data-cy="delete-tenant-button">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Edit Tenant Dialog */}
      <EditTenantDialog isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} tenant={selectedTenant} />
    </>
  )
}

export default TableTenants
