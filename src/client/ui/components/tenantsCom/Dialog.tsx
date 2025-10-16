import { CalendarIcon, Plus } from "lucide-react"
import React, { useState } from "react"

import { Button } from "../common/Button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../common/Dialog"
import { Input } from "../common/Input"
import { Label } from "../common/Label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../common/Select"
import { useTenantStore } from "@infrastructure/libs/store/tenants.store"

import { Popover, PopoverContent, PopoverTrigger } from "@radix-ui/react-popover"
import type { TenantsPageModel } from "@domain/models/tenantsPage.model"
import { useToast } from "../hooks/useToast"
import { format } from "date-fns"
import { Calendar } from "../common/Calendar"

const DialogTenant = () => {
  const { newTenantsTest, setNewTenant, resetTenantsTest } = useTenantStore()
  const { toast } = useToast()
  const [isAddTenantOpen, setIsAddTenantOpen] = useState(false)
  const handleAddTenant = () => {
    if (!newTenantsTest.fullName || !newTenantsTest.phone) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }
    toast({
      title: "Tenant Added",
      description: `Tenant "${newTenantsTest.fullName}" has been added`,
    })
    resetTenantsTest()
    setIsAddTenantOpen(false)
  }

  return (
    <Dialog open={isAddTenantOpen} onOpenChange={setIsAddTenantOpen}>
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
          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              value={newTenantsTest.fullName}
              onChange={(e) => setNewTenant({ fullName: e.target.value })}
              placeholder="Your First Name"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Contact</Label>
              <Input
                value={newTenantsTest.phone}
                onChange={(e) => setNewTenant({ phone: e.target.value })}
                placeholder="Your Phone Number"
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                value={newTenantsTest.phone}
                onChange={(e) => setNewTenant({ email: e.target.value })}
                placeholder="Your Email"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Identification Number</Label>
            <Input
              value={newTenantsTest.identificationNumber}
              onChange={(e) => setNewTenant({ identificationNumber: e.target.value })}
              placeholder="Your Identification Number"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Birth Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {newTenantsTest.birthDate ? format(newTenantsTest.birthDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>

                <PopoverContent className="bg-white w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={newTenantsTest.birthDate}
                    onSelect={(date) => {
                      if (date) setNewTenant({ birthDate: date })
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={newTenantsTest.role}
                onValueChange={(value) => setNewTenant({ role: value as TenantsPageModel["role"] })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="tenant">Tenant</SelectItem>
                  <SelectItem value="staff">Staff</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {/* Profile Image URL ? */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Emergency Contact Name</Label>
              <Input
                value={newTenantsTest.emergencyContactName}
                onChange={(e) => setNewTenant({ emergencyContactName: e.target.value })}
                placeholder="Your Emergency Contact Name"
              />
            </div>
            <div className="space-y-2">
              <Label>Emergency Contact Phone</Label>
              <Input
                value={newTenantsTest.emergencyContactPhone}
                onChange={(e) => setNewTenant({ emergencyContactPhone: e.target.value })}
                placeholder="Your Emergency Contact Phone"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setIsAddTenantOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddTenant}>Add Tenant</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default DialogTenant
