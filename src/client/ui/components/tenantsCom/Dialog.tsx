import { CalendarIcon, Plus } from "lucide-react"
import { useState } from "react"
import { format } from "date-fns"

import type { CreateTenantDto } from "@infrastructure/inbound/dtos/createTenant.dto"
import { useTenantStore } from "@infrastructure/libs/store/tenants.store"

import { Button } from "../common/Button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../common/Dialog"
import { Input } from "../common/Input"
import { Label } from "../common/Label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../common/Select"
import { Popover, PopoverContent, PopoverTrigger } from "../common/Popover"
import { Calendar } from "../common/Calendar"
import { useToast } from "../hooks/useToast"

const DialogTenants = () => {
  const { createTenant } = useTenantStore()
  const { toast } = useToast()
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [birthDate, setBirthDate] = useState<Date | undefined>(undefined)
  const [newTenant, setNewTenant] = useState<CreateTenantDto>({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    password: "",
    role: "TENANT",
    identificationNumber: "",
    birthDate: undefined,
    emergencyContactName: "",
    emergencyContactPhone: "",
  })

  const handleAddTenant = async () => {
    if (
      !newTenant.firstName ||
      !newTenant.lastName ||
      !newTenant.email ||
      !newTenant.phone ||
      !newTenant.password ||
      !newTenant.identificationNumber
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
      // Format birthDate to ISO string if exists
      const payload: CreateTenantDto = {
        ...newTenant,
        birthDate: birthDate ? format(birthDate, "yyyy-MM-dd") : undefined,
      }

      const result = await createTenant(payload)
      if (result.success) {
        // Reset form
        setNewTenant({
          firstName: "",
          lastName: "",
          phone: "",
          email: "",
          password: "",
          role: "TENANT",
          identificationNumber: "",
          birthDate: undefined,
          emergencyContactName: "",
          emergencyContactPhone: "",
        })
        setBirthDate(undefined)
        setIsOpen(false)
        toast({
          title: "Success",
          description: result.message || "Tenant created successfully!",
        })
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to create tenant",
          variant: "destructive",
        })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Tenant
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>Add New Tenant</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>First Name *</Label>
              <Input
                value={newTenant.firstName}
                onChange={(e) => setNewTenant((prev) => ({ ...prev, firstName: e.target.value }))}
                placeholder="John"
              />
            </div>
            <div className="space-y-2">
              <Label>Last Name *</Label>
              <Input
                value={newTenant.lastName}
                onChange={(e) => setNewTenant((prev) => ({ ...prev, lastName: e.target.value }))}
                placeholder="Doe"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Email *</Label>
              <Input
                type="email"
                value={newTenant.email}
                onChange={(e) => setNewTenant((prev) => ({ ...prev, email: e.target.value }))}
                placeholder="john.doe@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label>Phone *</Label>
              <Input
                type="tel"
                value={newTenant.phone}
                onChange={(e) => setNewTenant((prev) => ({ ...prev, phone: e.target.value }))}
                placeholder="0812345678"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Password *</Label>
            <Input
              type="password"
              value={newTenant.password}
              onChange={(e) => setNewTenant((prev) => ({ ...prev, password: e.target.value }))}
              placeholder="••••••••"
            />
          </div>

          <div className="space-y-2">
            <Label>Role</Label>
            <Select
              value={newTenant.role}
              onValueChange={(value: "USER" | "ADMIN" | "TENANT" | "STAFF") =>
                setNewTenant((prev) => ({ ...prev, role: value }))
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Birth Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {birthDate ? format(birthDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="bg-white w-auto p-0">
                  <Calendar mode="single" selected={birthDate} onSelect={setBirthDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label>Identification Number *</Label>
              <Input
                value={newTenant.identificationNumber}
                onChange={(e) => setNewTenant((prev) => ({ ...prev, identificationNumber: e.target.value }))}
                placeholder="1234567890123"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Emergency Contact Name</Label>
            <Input
              value={newTenant.emergencyContactName}
              onChange={(e) => setNewTenant((prev) => ({ ...prev, emergencyContactName: e.target.value }))}
              placeholder="Jane Doe"
            />
          </div>

          <div className="space-y-2">
            <Label>Emergency Contact Phone</Label>
            <Input
              type="tel"
              value={newTenant.emergencyContactPhone}
              onChange={(e) => setNewTenant((prev) => ({ ...prev, emergencyContactPhone: e.target.value }))}
              placeholder="0898765432"
            />
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button onClick={handleAddTenant} disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Tenant"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default DialogTenants
