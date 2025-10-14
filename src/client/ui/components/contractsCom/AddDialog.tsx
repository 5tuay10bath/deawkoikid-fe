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
import { useContractStore } from "@infrastructure/libs/store/contracts.store"
import type { ContractsModel } from "@domain/models/contracts.model"

const NewContractDialog = () => {
  const { isNewContractOpen, setIsNewContractOpen, newContract, updateNewContract, resetNewContract, addContract } =
    useContractStore()
  const { toast } = useToast()
  const handleCreateContract = () => {
    if (!newContract.unitNumber || !newContract.fullName || !newContract.startDate || !newContract.endDate) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    addContract(newContract)
    toast({
      title: "Contract Created",
      description: `Contract "${newContract.fullName}" has been created`,
    })
    setIsNewContractOpen(false)
    resetNewContract()
  }
  return (
    <Dialog open={isNewContractOpen} onOpenChange={setIsNewContractOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Contract
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>Create New Contract</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            {/* map unit id */}
            <Label>Unit Number</Label>
            <Input
              value={newContract.unitNumber}
              onChange={(e) => updateNewContract({ unitNumber: e.target.value })}
              placeholder="Unit Number"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input
                value={newContract.fullName}
                onChange={(e) => updateNewContract({ fullName: e.target.value })}
                placeholder="Your Name"
              />
            </div>
            <div className="space-y-2">
              <Label>Water Billing Type</Label>
              <Select
                value={newContract.waterBillingType}
                onValueChange={(value) =>
                  updateNewContract({ waterBillingType: value as ContractsModel["waterBillingType"] })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Billing Type" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="per_unit">Per unit</SelectItem>
                  <SelectItem value="flat_rate">Flat rate</SelectItem>
                  <SelectItem value="tiered">Tiered</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Rent Amount</Label>
              <Input
                type="number"
                onChange={(e) => {
                  const n = e.currentTarget.valueAsNumber
                  updateNewContract({ rentAmount: Number.isNaN(n) ? 0 : n })
                }}
                placeholder="Rent Amount"
              />
            </div>

            <div className="space-y-2">
              <Label>Rent Type</Label>
              <Select
                value={newContract.rentType}
                onValueChange={(value) => updateNewContract({ rentType: value as ContractsModel["rentType"] })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Billing Type" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
                    onSelect={(date) => updateNewContract({ startDate: date })}
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
                    onSelect={(date) => updateNewContract({ endDate: date })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setIsNewContractOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreateContract}>Create Contract</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
export default NewContractDialog
