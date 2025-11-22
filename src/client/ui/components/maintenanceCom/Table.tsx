import { useMaintenanceStore } from "@infrastructure/libs/store/maintenance.store"
import { axiosInstance } from "@infrastructure/libs/axios/axiosInstance"
import { useToast } from "../hooks/useToast"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../common/Table"
import { Badge } from "../common/Badge"
import { Button } from "../common/Button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../common/Select"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../common/Dialog"
import { Input } from "../common/Input"
import { Label } from "../common/Label"
import { Pencil, Upload } from "lucide-react"
import { format } from "date-fns"
import { useState } from "react"
import UploadFileDialog from "../common/UploadFileDialog"

type AssignableStaffOption = {
  id: string
  fullName: string
}

const MaintainTable = () => {
  const { tasks, searchTerm, getMaintenanceTasks } = useMaintenanceStore()
  const { toast } = useToast()
  const [uploadTaskId, setUploadTaskId] = useState<string | null>(null)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editTaskId, setEditTaskId] = useState<string | null>(null)
  const [assigneeId, setAssigneeId] = useState("")
  const [priorityValue, setPriorityValue] = useState<"LOW" | "MEDIUM" | "HIGH" | "URGENT">("MEDIUM")
  const [statusValue, setStatusValue] = useState<"REPORTED" | "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED">(
    "REPORTED",
  )
  const [price, setPrice] = useState("")
  const [scheduledAt, setScheduledAt] = useState("")
  const [estimatedFinishTime, setEstimatedFinishTime] = useState("")
  const [assignableStaff, setAssignableStaff] = useState<AssignableStaffOption[]>([])
  const [isFetchingStaff, setIsFetchingStaff] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const statusConfig = {
    REPORTED: { color: "bg-yellow-500 text-white", label: "Reported" },
    SCHEDULED: { color: "bg-blue-400 text-white", label: "Scheduled" },
    IN_PROGRESS: { color: "bg-blue-500 text-white", label: "In Progress" },
    COMPLETED: { color: "bg-green-500 text-white", label: "Completed" },
    // eslint-disable-next-line sonarjs/no-duplicate-string
    CANCELLED: { color: "bg-gray-500 text-white", label: "Cancelled" },
  }

  const priorityConfig = {
    LOW: { color: "bg-slate-500 text-white", label: "Low" },
    MEDIUM: { color: "bg-yellow-500 text-white", label: "Medium" },
    HIGH: { color: "bg-orange-500 text-white", label: "High" },
    URGENT: { color: "bg-red-500 text-white", label: "Urgent" },
  }

  const formatDateTimeLocal = (date: Date | string | null | undefined) => {
    if (!date) return ""
    try {
      const parsed = typeof date === "string" ? new Date(date) : date
      return format(parsed, "yyyy-MM-dd'T'HH:mm")
    } catch {
      return ""
    }
  }

  const getErrorMessage = (error: unknown) => {
    if (typeof error === "object" && error !== null) {
      const maybeErr = error as any
      return maybeErr?.response?.data?.message || maybeErr?.message
    }
    return "Something went wrong. Please try again."
  }

  const fetchAssignableStaff = async () => {
    setIsFetchingStaff(true)
    try {
      const { data } = await axiosInstance.get("/maintenances/create/assignedTo")

      const rawStaff = (data?.data ?? data) as any[]
      const normalizedStaff = Array.isArray(rawStaff)
        ? rawStaff.map((staff) => ({
            id: staff.id,
            fullName: staff.fullName ?? staff.name ?? "Unknown",
          }))
        : []

      setAssignableStaff(normalizedStaff)
    } catch (error) {
      toast({
        title: "Error",
        description: getErrorMessage(error),
        variant: "destructive",
      })
    } finally {
      setIsFetchingStaff(false)
    }
  }

  const closeEditDialog = () => {
    setIsEditOpen(false)
    setEditTaskId(null)
    setAssigneeId("")
    setPrice("")
    setPriorityValue("MEDIUM")
    setStatusValue("REPORTED")
    setScheduledAt("")
    setEstimatedFinishTime("")
  }

  const openEditDialog = (task: (typeof tasks)[number]) => {
    setEditTaskId(task.id)
    setAssigneeId(task.assignedTo?.id ?? "")
    setPrice(task.price !== undefined && task.price !== null ? task.price.toString() : "")
    setPriorityValue((task.priority as "LOW" | "MEDIUM" | "HIGH" | "URGENT") ?? "MEDIUM")
    setStatusValue((task.status as "REPORTED" | "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED") ?? "REPORTED")
    setScheduledAt(formatDateTimeLocal(task.scheduledAt))
    setEstimatedFinishTime(formatDateTimeLocal((task as any).estimatedFinishTime))
    setIsEditOpen(true)

    if (!assignableStaff.length) {
      void fetchAssignableStaff()
    }
  }

  const handleUpdateTask = async () => {
    if (!editTaskId) {
      toast({
        title: "Missing task",
        description: "No task selected for update.",
        variant: "destructive",
      })
      return
    }

    const parsedPrice = price ? parseFloat(price) : undefined
    if (price && Number.isNaN(parsedPrice)) {
      toast({
        title: "Invalid price",
        description: "Please enter a valid number for price.",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)
    try {
      const payload = {
        price: parsedPrice,
        priority: priorityValue,
        assignedTo: assigneeId || undefined,
        scheduledAt: scheduledAt ? format(new Date(scheduledAt), "yyyy-MM-dd'T'HH:mm:ssXXX") : undefined,
        estimatedFinishTime: estimatedFinishTime
          ? format(new Date(estimatedFinishTime), "yyyy-MM-dd'T'HH:mm:ssXXX")
          : undefined,
      }

      await axiosInstance.put(`/maintenances/${editTaskId}`, payload)
      await axiosInstance.put(`/maintenances/update/status/${editTaskId}`, { status: statusValue })
      toast({
        title: "Updated",
        description: "Maintenance task updated successfully.",
      })
      await getMaintenanceTasks()
      closeEditDialog()
    } catch (error) {
      toast({
        title: "Error",
        description: getErrorMessage(error),
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const getStatusConfig = (status: string) => {
    const upperStatus = status.toUpperCase()
    return statusConfig[upperStatus as keyof typeof statusConfig] || { color: "bg-gray-500 text-white", label: status }
  }

  const getPriorityConfig = (priority?: string | null) => {
    if (!priority) {
      return { color: "bg-gray-500 text-white", label: "No Priority" }
    }

    const upperPriority = priority.toUpperCase()
    return (
      priorityConfig[upperPriority as keyof typeof priorityConfig] || {
        color: "bg-gray-500 text-white",
        label: priority,
      }
    )
  }

  const filteredTasks = tasks.filter((task) => {
    if (!searchTerm) return true
    const searchLower = searchTerm.toLowerCase()
    return (
      task.title.toLowerCase().includes(searchLower) ||
      task.description.toLowerCase().includes(searchLower) ||
      task.unit.unitNumber.toLowerCase().includes(searchLower) ||
      (task.assignedTo && task.assignedTo.fullName.toLowerCase().includes(searchLower)) ||
      (task.priority?.toLowerCase().includes(searchLower) ?? false) ||
      task.status.toLowerCase().includes(searchLower)
    )
  })
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Task</TableHead>
            <TableHead className="text-center">Unit</TableHead>
            <TableHead className="text-center">Priority</TableHead>
            <TableHead className="text-center">Assigned To</TableHead>
            <TableHead className="text-center">Reported By</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredTasks.map((task) => {
            const priority = getPriorityConfig(task.priority)

            return (
              <TableRow key={task.id}>
                <TableCell>
                  <div>
                    <p className="font-medium">{task.title}</p>
                    <p className="text-sm text-muted-foreground">{task.description}</p>
                  </div>
                </TableCell>
                <TableCell>{task.unit.unitNumber}</TableCell>
                <TableCell>
                  <Badge className={priority.color}>{priority.label}</Badge>
                </TableCell>
                <TableCell>{task.assignedTo ? task.assignedTo.fullName : "Unassigned"}</TableCell>
                <TableCell>{task.reportedBy.fullName}</TableCell>
                <TableCell>
                  <Badge className={getStatusConfig(task.status).color}>{getStatusConfig(task.status).label}</Badge>
                </TableCell>
                <TableCell className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={() => openEditDialog(task)} aria-label="Edit task">
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setUploadTaskId(task.id)}>
                    <Upload className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>

      <Dialog
        open={isEditOpen}
        onOpenChange={(open) => {
          if (!open) {
            closeEditDialog()
          }
        }}
      >
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Edit Maintenance Task</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Price</Label>
              <Input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                step="0.01"
                min="0"
                disabled={isSaving}
              />
            </div>

            <div className="space-y-2">
              <Label>Priority</Label>
              <Select
                value={priorityValue}
                disabled={isSaving}
                onValueChange={(value: "LOW" | "MEDIUM" | "HIGH" | "URGENT") => setPriorityValue(value)}
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

            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={statusValue}
                disabled={isSaving}
                onValueChange={(value: "REPORTED" | "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED") =>
                  setStatusValue(value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="REPORTED">Reported</SelectItem>
                  <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Assign To</Label>
              <Select
                value={assigneeId}
                disabled={isFetchingStaff || isSaving}
                onValueChange={(value) => setAssigneeId(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={isFetchingStaff ? "Loading staff..." : "Select staff"} />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {assignableStaff.length === 0 && !isFetchingStaff && (
                    <SelectItem value="__empty" disabled>
                      No staff available
                    </SelectItem>
                  )}
                  {assignableStaff.map((staff) => (
                    <SelectItem key={staff.id} value={staff.id}>
                      {staff.fullName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Scheduled At</Label>
                <Input
                  type="datetime-local"
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                  disabled={isSaving}
                />
              </div>
              <div className="space-y-2">
                <Label>Estimated Finish Time</Label>
                <Input
                  type="datetime-local"
                  value={estimatedFinishTime}
                  onChange={(e) => setEstimatedFinishTime(e.target.value)}
                  disabled={isSaving}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={closeEditDialog} disabled={isSaving}>
              Cancel
            </Button>
            <Button onClick={handleUpdateTask} disabled={isSaving || !editTaskId}>
              {isSaving ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Upload File Dialog */}
      {uploadTaskId && (
        <UploadFileDialog
          isOpen={!!uploadTaskId}
          onClose={() => setUploadTaskId(null)}
          type="maintenance"
          id={uploadTaskId}
        />
      )}
    </>
  )
}

export const SupplyTable = () => {
  const { supplies } = useMaintenanceStore()
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Item Name</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Current Stock</TableHead>
          <TableHead>Min Stock</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {supplies.map((supply) => (
          <TableRow key={supply.id}>
            <TableCell className="font-medium">{supply.name}</TableCell>
            <TableCell>{supply.category}</TableCell>
            <TableCell>{supply.quantity}</TableCell>
            <TableCell>{supply.minStock}</TableCell>
            <TableCell>
              {supply.quantity <= supply.minStock ? (
                <Badge className="bg-yellow-500 text-white">Low Stock</Badge>
              ) : (
                <Badge className="bg-green-500 text-white">In Stock</Badge>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default MaintainTable
