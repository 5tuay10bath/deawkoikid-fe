import { CalendarIcon, Plus } from "lucide-react"
import { useState, useEffect } from "react"
import { format } from "date-fns"

import type { CreateContractDto } from "@infrastructure/inbound/dtos/createContract.dto"
import { useContractStore } from "@infrastructure/libs/store/contracts.store"

import { Button } from "../common/Button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../common/Dialog"
import { Input } from "../common/Input"
import { Label } from "../common/Label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../common/Select"
import { Popover, PopoverContent, PopoverTrigger } from "../common/Popover"
import { Calendar } from "../common/Calendar"
import { Checkbox } from "../common/Checkbox"
import { useToast } from "../hooks/useToast"

const DialogContracts = () => {
  const { createContract, createUnits, createUsers, getCreateUnits, getCreateUsers } = useContractStore()
  const { toast } = useToast()
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newContract, setNewContract] = useState<CreateContractDto>({
    unitId: "",
    userId: "",
    rentType: "MONTHLY",
    rentAmount: 0,
    waterBillingType: "PER_UNIT",
    internet: false,
    startDate: new Date(),
    endDate: new Date(),
  })

  useEffect(() => {
    if (isOpen) {
      getCreateUnits()
      getCreateUsers()
    }
  }, [isOpen, getCreateUnits, getCreateUsers])

  const handleAddContract = async () => {
    if (!newContract.unitId || !newContract.userId) {
      toast({
        title: "Error",
        description: "Please fill in Unit ID and User ID",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      const result = await createContract(newContract)
      if (result.success) {
        setNewContract({
          unitId: "",
          userId: "",
          rentType: "MONTHLY",
          rentAmount: 0,
          waterBillingType: "PER_UNIT",
          internet: false,
          startDate: new Date(),
          endDate: new Date(),
        })
        setIsOpen(false)
        toast({
          title: "Success",
          description: result.message || "Contract created successfully!",
        })
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to create contract",
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
          Add Contract
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Contract</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Unit *</Label>
              <Select
                value={newContract.unitId}
                onValueChange={(value: string) => setNewContract((prev) => ({ ...prev, unitId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {createUnits.map((unit) => (
                    <SelectItem key={unit.id} value={unit.id}>
                      {unit.address}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>User *</Label>
              <Select
                value={newContract.userId}
                onValueChange={(value: string) => setNewContract((prev) => ({ ...prev, userId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select user" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {createUsers.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Rent Type</Label>
              <Select
                value={newContract.rentType}
                onValueChange={(value: "MONTHLY" | "YEARLY") =>
                  setNewContract((prev) => ({ ...prev, rentType: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select rent type" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="MONTHLY">Monthly</SelectItem>
                  <SelectItem value="YEARLY">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Rent Amount</Label>
              <Input
                type="number"
                value={newContract.rentAmount}
                onChange={(e) => setNewContract((prev) => ({ ...prev, rentAmount: parseFloat(e.target.value) || 0 }))}
                placeholder="10000"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Water Billing Type</Label>
            <Select
              value={newContract.waterBillingType}
              onValueChange={(value: "PER_UNIT" | "FLAT_RATE" | "TIERED") =>
                setNewContract((prev) => ({ ...prev, waterBillingType: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select billing type" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="PER_UNIT">Per Unit</SelectItem>
                <SelectItem value="FLAT_RATE">Flat Rate</SelectItem>
                <SelectItem value="TIERED">Tiered</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="internet"
              checked={newContract.internet}
              onCheckedChange={(checked: boolean) => setNewContract((prev) => ({ ...prev, internet: checked }))}
            />
            <Label htmlFor="internet" className="cursor-pointer">
              Internet included
            </Label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {newContract.startDate ? format(newContract.startDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="bg-white w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={newContract.startDate}
                    onSelect={(date) => setNewContract((prev) => ({ ...prev, startDate: date || new Date() }))}
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
                    {newContract.endDate ? format(newContract.endDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="bg-white w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={newContract.endDate}
                    onSelect={(date) => setNewContract((prev) => ({ ...prev, endDate: date || new Date() }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button onClick={handleAddContract} disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Contract"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default DialogContracts
