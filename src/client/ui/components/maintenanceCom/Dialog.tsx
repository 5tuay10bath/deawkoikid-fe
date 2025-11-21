import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../common/Select"
import { Textarea } from "../common/TextArea"
import { Popover, PopoverContent, PopoverTrigger } from "../common/Popover"
import { Calendar } from "../common/Calendar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../common/Dialog"
import { useMaintenanceStore } from "@infrastructure/libs/store/maintenance.store"
import type { CreateMaintenanceDto } from "@infrastructure/inbound/dtos/createMaintenance.dto"
import type { CreateSupplyDto } from "@infrastructure/inbound/dtos/createSupply.dto"
import { Button } from "../common/Button"
import { CalendarIcon, Plus } from "lucide-react"
import { Label } from "../common/Label"
import { Input } from "../common/Input"
import { format } from "date-fns"
import { useToast } from "../hooks/useToast"
import { useState } from "react"

const NewTaskDialog = () => {
  const { createMaintenance } = useMaintenanceStore()
  const { toast } = useToast()
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [scheduledAt, setScheduledAt] = useState<Date | undefined>()
  const [estimatedFinishTime, setEstimatedFinishTime] = useState<Date | undefined>()
  const [newTask, setNewTask] = useState<Omit<CreateMaintenanceDto, "scheduledAt" | "estimatedFinishTime">>({
    unitId: "",
    title: "",
    description: "",
    price: 0,
    priority: "MEDIUM",
    maintenanceType: "OTHER",
    assignedToId: "",
    reportedById: "",
  })

  const handleCreateTask = async () => {
    if (!newTask.title || !newTask.unitId || !newTask.assignedToId || !newTask.reportedById) {
      toast({
        title: "Error",
        description: "Please fill in all required fields (Title, Unit ID, Assigned To, Reported By)",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      const maintenanceData: CreateMaintenanceDto = {
        ...newTask,
        scheduledAt: scheduledAt ? format(scheduledAt, "yyyy-MM-dd'T'HH:mm:ssXXX") : undefined,
        estimatedFinishTime: estimatedFinishTime ? format(estimatedFinishTime, "yyyy-MM-dd'T'HH:mm:ssXXX") : undefined,
      }
      const result = await createMaintenance(maintenanceData)
      if (result.success) {
        setNewTask({
          unitId: "",
          title: "",
          description: "",
          price: 0,
          priority: "MEDIUM",
          maintenanceType: "OTHER",
          assignedToId: "",
          reportedById: "",
        })
        setScheduledAt(undefined)
        setEstimatedFinishTime(undefined)
        setIsOpen(false)
        toast({
          title: "Success",
          description: result.message || "Maintenance task created successfully!",
        })
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to create maintenance task",
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
          <Plus className="h-4 w-4 mr-2" />
          New Task
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>Create Maintenance Task</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Task Title</Label>
            <Input
              value={newTask.title}
              onChange={(e) => setNewTask((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="Fix leaking faucet"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Unit ID</Label>
              <Input
                value={newTask.unitId}
                onChange={(e) => setNewTask((prev) => ({ ...prev, unitId: e.target.value }))}
                placeholder="unit-id-123"
              />
            </div>
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select
                value={newTask.priority}
                onValueChange={(value: "LOW" | "MEDIUM" | "HIGH" | "URGENT") =>
                  setNewTask((prev) => ({ ...prev, priority: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                  <SelectItem value="URGENT">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Maintenance Type</Label>
            <Select
              value={newTask.maintenanceType}
              onValueChange={(value: CreateMaintenanceDto["maintenanceType"]) =>
                setNewTask((prev) => ({ ...prev, maintenanceType: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="ELECTRIC">Electric</SelectItem>
                <SelectItem value="WATER">Water</SelectItem>
                <SelectItem value="PHONE">Phone</SelectItem>
                <SelectItem value="AIR_CONDITIONAL">Air Conditional</SelectItem>
                <SelectItem value="FURNITURE">Furniture</SelectItem>
                <SelectItem value="FIRE_ALARM_SYSTEM">Fire Alarm System</SelectItem>
                <SelectItem value="WATER_LEAKAGE">Water Leakage</SelectItem>
                <SelectItem value="FLOOR_WALL">Floor/Wall</SelectItem>
                <SelectItem value="BATHROOM">Bathroom</SelectItem>
                <SelectItem value="PAINT">Paint</SelectItem>
                <SelectItem value="CEMENT_WOOD">Cement/Wood</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={newTask.description}
              onChange={(e) => setNewTask((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Describe the maintenance issue..."
            />
          </div>

          <div className="space-y-2">
            <Label>Price</Label>
            <Input
              type="number"
              value={newTask.price}
              onChange={(e) => setNewTask((prev) => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
              placeholder="0.00"
              step="0.01"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Assigned To ID</Label>
              <Input
                value={newTask.assignedToId}
                onChange={(e) => setNewTask((prev) => ({ ...prev, assignedToId: e.target.value }))}
                placeholder="staff-id-123"
              />
            </div>
            <div className="space-y-2">
              <Label>Reported By ID</Label>
              <Input
                value={newTask.reportedById}
                onChange={(e) => setNewTask((prev) => ({ ...prev, reportedById: e.target.value }))}
                placeholder="user-id-123"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Scheduled Date (Optional)</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {scheduledAt ? format(scheduledAt, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="bg-white w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={scheduledAt}
                    onSelect={(date) => setScheduledAt(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label>Estimated Finish Time (Optional)</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {estimatedFinishTime ? format(estimatedFinishTime, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="bg-white w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={estimatedFinishTime}
                    onSelect={(date) => setEstimatedFinishTime(date)}
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
            <Button onClick={handleCreateTask} disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Task"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export const NewSupplyDialog = () => {
  const { createSupply } = useMaintenanceStore()
  const { toast } = useToast()
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newSupply, setNewSupply] = useState<CreateSupplyDto>({
    name: "",
    category: "",
    quantity: 0,
    minStock: 0,
  })

  const handleAddSupply = async () => {
    if (!newSupply.name || !newSupply.category || newSupply.quantity <= 0) {
      toast({
        title: "Error",
        description: "Please fill in all required fields (Name, Category, Quantity)",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      const result = await createSupply(newSupply)
      if (result.success) {
        // Reset form
        setNewSupply({
          name: "",
          category: "",
          quantity: 0,
          minStock: 0,
        })
        setIsOpen(false)
        toast({
          title: "Success",
          description: result.message || "Supply item added successfully!",
        })
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to add supply item",
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
          <Plus className="h-4 w-4 mr-2" />
          Add Supply
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>Add Supply Item</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Item Name</Label>
            <Input
              value={newSupply.name}
              onChange={(e) => setNewSupply((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Light Bulbs - LED 60W"
            />
          </div>

          <div className="space-y-2">
            <Label>Category</Label>
            <Input
              value={newSupply.category}
              onChange={(e) => setNewSupply((prev) => ({ ...prev, category: e.target.value }))}
              placeholder="Electrical"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Quantity</Label>
              <Input
                type="number"
                value={newSupply.quantity}
                onChange={(e) => setNewSupply((prev) => ({ ...prev, quantity: parseInt(e.target.value) || 0 }))}
                placeholder="25"
              />
            </div>
            <div className="space-y-2">
              <Label>Min Stock</Label>
              <Input
                type="number"
                value={newSupply.minStock}
                onChange={(e) => setNewSupply((prev) => ({ ...prev, minStock: parseInt(e.target.value) || 0 }))}
                placeholder="10"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button onClick={handleAddSupply} disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Supply"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default NewTaskDialog
