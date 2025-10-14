import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../common/Select"
import { Popover, PopoverContent, PopoverTrigger } from "../common/Popover"
import { Calendar } from "../common/Calendar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../common/Dialog"
import { Button } from "../common/Button"
import { CalendarIcon, Plus } from "lucide-react"
import { Label } from "../common/Label"
import { Input } from "../common/Input"
import { format } from "date-fns"
import { useToast } from "../hooks/useToast"
import { usePaymentStore } from "@infrastructure/libs/store/payments.store"
import type { PaymentsModel } from "@domain/models/payments.model"

const NewPaymentDialog = () => {
  const { isNewPaymentOpen, setIsNewPaymentOpen, newPayment, updateNewPayment, resetNewPayment } = usePaymentStore()
  const { toast } = useToast()
  const handleCreatePayment = () => {
    if (!newPayment.billingMonth) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    // addPayment(newPayment)
    // toast({
    //   title: "Payment Created",
    //   description: `Payment "${newPayment.id}" has been created`,
    // })
    setIsNewPaymentOpen(false)
    resetNewPayment()
  }
  return (
    <Dialog open={isNewPaymentOpen} onOpenChange={setIsNewPaymentOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Payment
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>Create New Payment</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
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
                  onSelect={(date) => updateNewPayment({ billingMonth: date })}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Electric Usage</Label>
              <Input
                type="number"
                onChange={(e) => {
                  const n = e.currentTarget.valueAsNumber
                  updateNewPayment({ electricUsage: Number.isNaN(n) ? 0 : n })
                }}
                placeholder="Electric Usage"
              />
            </div>
            <div className="space-y-2">
              <Label>Water Usage</Label>
              <Input
                type="number"
                onChange={(e) => {
                  const n = e.currentTarget.valueAsNumber
                  updateNewPayment({ waterUsage: Number.isNaN(n) ? 0 : n })
                }}
                placeholder="Water Usage"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={newPayment.status}
                onValueChange={(value) => updateNewPayment({ status: value as PaymentsModel["status"] })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Payment Status" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="unpaid">Unpaid</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
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
                    onSelect={(date) => updateNewPayment({ dueDate: date })}
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
                    onSelect={(date) => updateNewPayment({ paidDate: date })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setIsNewPaymentOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreatePayment}>Create Payment</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
export default NewPaymentDialog
