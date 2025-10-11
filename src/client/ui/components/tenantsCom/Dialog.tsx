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
  const { tenantsTest, setTenantsTest, newTenantsTest, setNewTenant, resetTenantsTest } = useTenantStore()
  const { toast } = useToast()
  const [isAddTenantOpen, setIsAddTenantOpen] = useState(false)
  const handleAddTenant = () => {
    if (!newTenantsTest.fullName || !newTenantsTest.phone || !newTenantsTest.rentAmount) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }
    const tenant: TenantsPageModel = {
      ...newTenantsTest,
      id: newTenantsTest.id,
      rentAmount: Number(newTenantsTest.rentAmount),
    }
    setTenantsTest([...(tenantsTest ?? []), tenant])
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

          <div className="space-y-2">
            <Label>Contact</Label>
            <Input
              value={newTenantsTest.phone}
              onChange={(e) => setNewTenant({ phone: e.target.value })}
              placeholder="Your Phone Number"
            />
          </div>
          {/* <div className="space-y-2">
            <Label>Lease Period</Label>
            <Input
              value={newTenant.size}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNewTenant((prev) => ({ ...prev, size: e.target.value }))
              }
              placeholder="400 sq ft"
            />
          </div> */}

          <div className="space-y-2">
            <Label>Start Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {newTenantsTest.startDate ? format(newTenantsTest.startDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>

              <PopoverContent className="bg-white w-auto p-0">
                <Calendar
                  mode="single"
                  selected={newTenantsTest.startDate}
                  onSelect={(date) => {
                    if (date) setNewTenant({ startDate: date })
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="space-y-2">
            <Label>End Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {newTenantsTest.startDate ? format(newTenantsTest.endDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>

              <PopoverContent className="bg-white w-auto p-0">
                <Calendar
                  mode="single"
                  selected={newTenantsTest.endDate}
                  onSelect={(date) => {
                    if (date) setNewTenant({ endDate: date })
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Rent Amount</Label>
              <Input
                type="number"
                onChange={(e) => {
                  const n = e.currentTarget.valueAsNumber
                  setNewTenant({ rentAmount: Number.isNaN(n) ? 0 : n })
                }}
                placeholder="Rent Amount"
              />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={newTenantsTest.status}
                onValueChange={(value) => setNewTenant({ status: value as TenantsPageModel["status"] })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                  <SelectItem value="checkout-pending">Checkout-pending</SelectItem>
                </SelectContent>
              </Select>
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
