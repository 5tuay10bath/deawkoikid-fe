import React, { useState, useEffect } from "react"
import { format } from "date-fns"

import type { UpdateTenantDto } from "@infrastructure/inbound/dtos/updateTenant.dto"
import type { TenantsPageModel } from "@domain/models/tenantsPage.model"
import { useTenantStore } from "@infrastructure/libs/store/tenants.store"

import { Button } from "../common/Button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../common/Dialog"
import { Input } from "../common/Input"
import { Label } from "../common/Label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../common/Select"
import { Calendar } from "../common/Calendar"
import { Popover, PopoverContent, PopoverTrigger } from "../common/Popover"
import { CalendarIcon } from "lucide-react"
import { useToast } from "../hooks/useToast"

interface EditTenantDialogProps {
  isOpen: boolean
  onClose: () => void
  tenant: TenantsPageModel | null
}

const EditTenantDialog = ({ isOpen, onClose, tenant }: EditTenantDialogProps) => {
  const { updateTenant } = useTenantStore()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [birthDate, setBirthDate] = useState<Date | undefined>(undefined)
  const [editTenant, setEditTenant] = useState<Omit<UpdateTenantDto, "id">>({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    role: "TENANT",
    identificationNumber: "",
    birthDate: undefined,
    emergencyContactName: "",
    emergencyContactPhone: "",
  })

  // Update form when tenant prop changes
  useEffect(() => {
    if (tenant) {
      const [firstName = "", lastName = ""] = tenant.fullName.split(" ")
      setEditTenant({
        firstName,
        lastName,
        phone: tenant.phone,
        email: tenant.email,
        role: (tenant.role as "USER" | "ADMIN" | "TENANT" | "STAFF") || "TENANT",
        identificationNumber: tenant.identificationNumber,
        birthDate: tenant.birthDate ? format(new Date(tenant.birthDate), "yyyy-MM-dd") : undefined,
        emergencyContactName: tenant.emergencyContactName || "",
        emergencyContactPhone: tenant.emergencyContactPhone || "",
      })
      setBirthDate(tenant.birthDate ? new Date(tenant.birthDate) : undefined)
    }
  }, [tenant])

  const handleUpdateTenant = async () => {
    if (!tenant?.id) {
      toast({
        title: "Error",
        description: "Tenant ID is missing",
        variant: "destructive",
      })
      return
    }

    if (
      !editTenant.firstName ||
      !editTenant.lastName ||
      !editTenant.phone ||
      !editTenant.email ||
      !editTenant.identificationNumber
    ) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      const dto: UpdateTenantDto = {
        id: tenant.id,
        ...editTenant,
        birthDate: birthDate ? format(birthDate, "yyyy-MM-dd") : undefined,
      }

      const result = await updateTenant(dto)
      if (result.success) {
        onClose()
        toast({
          title: "Success",
          description: result.message || "Tenant updated successfully!",
        })
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to update tenant",
          variant: "destructive",
        })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Tenant</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>First Name *</Label>
              <Input
                value={editTenant.firstName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEditTenant((prev) => ({ ...prev, firstName: e.target.value }))
                }
                placeholder="John"
              />
            </div>
            <div className="space-y-2">
              <Label>Last Name *</Label>
              <Input
                value={editTenant.lastName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEditTenant((prev) => ({ ...prev, lastName: e.target.value }))
                }
                placeholder="Doe"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Email *</Label>
              <Input
                type="email"
                value={editTenant.email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEditTenant((prev) => ({ ...prev, email: e.target.value }))
                }
                placeholder="john.doe@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label>Phone *</Label>
              <Input
                value={editTenant.phone}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEditTenant((prev) => ({ ...prev, phone: e.target.value }))
                }
                placeholder="0801234567"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Role</Label>
              <Select
                value={editTenant.role}
                onValueChange={(value: "USER" | "ADMIN" | "TENANT" | "STAFF") =>
                  setEditTenant((prev) => ({ ...prev, role: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="TENANT">Tenant</SelectItem>
                  <SelectItem value="USER">User</SelectItem>
                  <SelectItem value="STAFF">Staff</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Identification Number *</Label>
              <Input
                value={editTenant.identificationNumber}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEditTenant((prev) => ({ ...prev, identificationNumber: e.target.value }))
                }
                placeholder="1234567890123"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Birth Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {birthDate ? format(birthDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-white" align="start">
                <Calendar mode="single" selected={birthDate} onSelect={setBirthDate} initialFocus />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Emergency Contact Name</Label>
              <Input
                value={editTenant.emergencyContactName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEditTenant((prev) => ({ ...prev, emergencyContactName: e.target.value }))
                }
                placeholder="Jane Doe"
              />
            </div>
            <div className="space-y-2">
              <Label>Emergency Contact Phone</Label>
              <Input
                value={editTenant.emergencyContactPhone}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEditTenant((prev) => ({ ...prev, emergencyContactPhone: e.target.value }))
                }
                placeholder="0809876543"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button onClick={handleUpdateTenant} disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Tenant"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default EditTenantDialog
