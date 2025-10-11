import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../common/Select"
import { Textarea } from "../common/TextArea"
import { Popover, PopoverContent, PopoverTrigger } from "../common/Popover"
import { Calendar } from "../common/Calendar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../common/Dialog"
import { useMaintenanceStore } from "@infrastructure/libs/store/maintenance.store"
import { Button } from "../common/Button"
import { CalendarIcon, Plus } from "lucide-react"
import { Label } from "../common/Label"
import { Input } from "../common/Input"
import { format } from "date-fns"
import { useToast } from "../hooks/useToast"
import { mockDB, type MaintenanceTask } from "@infrastructure/mockData/mockData"

const NewTaskDialog = () => {
  const { isNewTaskOpen, setIsNewTaskOpen, newTask, updateNewTask, resetNewTask, addTask } = useMaintenanceStore()
  const { toast } = useToast()
  const handleCreateTask = () => {
    if (!newTask.title || !newTask.unitNumber || !newTask.priority) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    const task = mockDB.addMaintenanceTask({
      title: newTask.title,
      description: newTask.description,
      unitNumber: newTask.unitNumber,
      priority: newTask.priority as MaintenanceTask["priority"],
      status: "pending",
      assignedTo: newTask.assignedTo || "Unassigned",
      dueDate: newTask.dueDate || new Date(),
      type: (newTask.type as MaintenanceTask["type"]) || "general",
    })

    addTask(task)
    toast({
      title: "Task Created",
      description: `Maintenance task "${newTask.title}" has been created`,
    })
    setIsNewTaskOpen(false)
    resetNewTask()
  }
  return (
    <Dialog open={isNewTaskOpen} onOpenChange={setIsNewTaskOpen}>
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
              onChange={(e) => updateNewTask({ title: e.target.value })}
              placeholder="Fix leaking faucet"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Unit Number</Label>
              <Input
                value={newTask.unitNumber}
                onChange={(e) => updateNewTask({ unitNumber: e.target.value })}
                placeholder="101"
              />
            </div>
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select value={newTask.priority} onValueChange={(value) => updateNewTask({ priority: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={newTask.description}
              onChange={(e) => updateNewTask({ description: e.target.value })}
              placeholder="Describe the maintenance issue..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Assigned To</Label>
              <Input
                value={newTask.assignedTo}
                onChange={(e) => updateNewTask({ assignedTo: e.target.value })}
                placeholder="Maintenance Person"
              />
            </div>
            <div className="space-y-2">
              <Label>Due Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {newTask.dueDate ? format(newTask.dueDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="bg-white w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={newTask.dueDate}
                    onSelect={(date) => updateNewTask({ dueDate: date })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setIsNewTaskOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateTask}>Create Task</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export const NewSupplyDialog = () => {
  const { isNewSupplyOpen, setIsNewSupplyOpen, newSupply, updateNewSupply, resetNewSupply, addSupply } =
    useMaintenanceStore()
  const { toast } = useToast()

  const handleAddSupply = () => {
    if (!newSupply.name || !newSupply.quantity) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    const supply = mockDB.addSupply({
      name: newSupply.name,
      category: newSupply.category || "General",
      quantity: parseInt(newSupply.quantity),
      unit: newSupply.unit || "pieces",
      minStock: parseInt(newSupply.minStock) || 0,
      cost: parseFloat(newSupply.cost) || 0,
    })

    addSupply(supply)
    toast({
      title: "Supply Added",
      description: `${newSupply.name} has been added to inventory`,
    })
    setIsNewSupplyOpen(false)
    resetNewSupply()
  }
  return (
    <Dialog open={isNewSupplyOpen} onOpenChange={setIsNewSupplyOpen}>
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
              onChange={(e) => updateNewSupply({ name: e.target.value })}
              placeholder="Light Bulbs - LED 60W"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <Input
                value={newSupply.category}
                onChange={(e) => updateNewSupply({ category: e.target.value })}
                placeholder="Electrical"
              />
            </div>
            <div className="space-y-2">
              <Label>Unit</Label>
              <Input
                value={newSupply.unit}
                onChange={(e) => updateNewSupply({ unit: e.target.value })}
                placeholder="pieces"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Quantity</Label>
              <Input
                type="number"
                value={newSupply.quantity}
                onChange={(e) => updateNewSupply({ quantity: e.target.value })}
                placeholder="25"
              />
            </div>
            <div className="space-y-2">
              <Label>Min Stock</Label>
              <Input
                type="number"
                value={newSupply.minStock}
                onChange={(e) => updateNewSupply({ minStock: e.target.value })}
                placeholder="10"
              />
            </div>
            <div className="space-y-2">
              <Label>Cost</Label>
              <Input
                type="number"
                step="0.01"
                value={newSupply.cost}
                onChange={(e) => updateNewSupply({ cost: e.target.value })}
                placeholder="8.99"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setIsNewSupplyOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddSupply}>Add Supply</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default NewTaskDialog
