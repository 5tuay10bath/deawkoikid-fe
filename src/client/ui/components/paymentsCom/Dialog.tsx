import { CalendarIcon, Plus } from "lucide-react"
import { useState } from "react"
import { format } from "date-fns"

import type { CreatePaymentDto } from "@infrastructure/inbound/dtos/createPayment.dto"
import { usePaymentStore } from "@infrastructure/libs/store/payments.store"

import { Button } from "../common/Button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../common/Dialog"
import { Input } from "../common/Input"
import { Label } from "../common/Label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../common/Select"
import { Popover, PopoverContent, PopoverTrigger } from "../common/Popover"
import { Calendar } from "../common/Calendar"
import { useToast } from "../hooks/useToast"

const DialogPayments = () => {
  const { createPayment } = usePaymentStore()
  const { toast } = useToast()
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newPayment, setNewPayment] = useState<CreatePaymentDto>({
    contractId: "",
    apartmentConfigId: "",
    billingMonth: new Date(),
    electricUsage: 0,
    waterUsage: 0,
    dueDate: new Date(),
    paidDate: new Date(),
    status: "UNPAID",
  })

  const handleAddPayment = async () => {
    if (!newPayment.contractId || !newPayment.apartmentConfigId) {
      toast({
        title: "Error",
        description: "Please fill in Contract ID and Apartment Config ID",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      const result = await createPayment(newPayment)
      if (result.success) {
        // Reset form
        setNewPayment({
          contractId: "",
          apartmentConfigId: "",
          billingMonth: new Date(),
          electricUsage: 0,
          waterUsage: 0,
          dueDate: new Date(),
          paidDate: new Date(),
          status: "UNPAID",
        })
        setIsOpen(false)
        toast({
          title: "Success",
          description: result.message || "Payment created successfully!",
        })
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to create payment",
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
          Add Payment
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Payment</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Contract ID *</Label>
              <Input
                value={newPayment.contractId}
                onChange={(e) => setNewPayment((prev) => ({ ...prev, contractId: e.target.value }))}
                placeholder="contract-id-123"
              />
            </div>
            <div className="space-y-2">
              <Label>Apartment Config ID *</Label>
              <Input
                value={newPayment.apartmentConfigId}
                onChange={(e) => setNewPayment((prev) => ({ ...prev, apartmentConfigId: e.target.value }))}
                placeholder="config-id-123"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Billing Month</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {newPayment.billingMonth ? format(newPayment.billingMonth, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="bg-white w-auto p-0">
                <Calendar
                  mode="single"
                  selected={newPayment.billingMonth}
                  onSelect={(date) => setNewPayment((prev) => ({ ...prev, billingMonth: date || new Date() }))}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Electric Usage (kWh)</Label>
              <Input
                type="number"
                value={newPayment.electricUsage}
                onChange={(e) => setNewPayment((prev) => ({ ...prev, electricUsage: parseFloat(e.target.value) || 0 }))}
                placeholder="150"
              />
            </div>
            <div className="space-y-2">
              <Label>Water Usage (m³)</Label>
              <Input
                type="number"
                value={newPayment.waterUsage}
                onChange={(e) => setNewPayment((prev) => ({ ...prev, waterUsage: parseFloat(e.target.value) || 0 }))}
                placeholder="20"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Due Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {newPayment.dueDate ? format(newPayment.dueDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="bg-white w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={newPayment.dueDate}
                    onSelect={(date) => setNewPayment((prev) => ({ ...prev, dueDate: date || new Date() }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label>Paid Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {newPayment.paidDate ? format(newPayment.paidDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="bg-white w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={newPayment.paidDate}
                    onSelect={(date) => setNewPayment((prev) => ({ ...prev, paidDate: date || new Date() }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={newPayment.status}
              onValueChange={(value: "PAID" | "UNPAID" | "OVERDUE") =>
                setNewPayment((prev) => ({ ...prev, status: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="PAID">Paid</SelectItem>
                <SelectItem value="UNPAID">Unpaid</SelectItem>
                <SelectItem value="OVERDUE">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button onClick={handleAddPayment} disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Payment"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default DialogPayments
