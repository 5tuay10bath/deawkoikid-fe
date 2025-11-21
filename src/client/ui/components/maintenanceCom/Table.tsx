import { useMaintenanceStore } from "@infrastructure/libs/store/maintenance.store"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../common/Table"
import { Badge } from "../common/Badge"
import { Button } from "../common/Button"
import { Upload } from "lucide-react"
import { useState } from "react"
import UploadFileDialog from "../common/UploadFileDialog"

const MaintainTable = () => {
  const { tasks, searchTerm } = useMaintenanceStore()
  const [uploadTaskId, setUploadTaskId] = useState<string | null>(null)

  const statusConfig = {
    REPORTED: { color: "bg-yellow-500 text-white", label: "Reported" },
    SCHEDULED: { color: "bg-blue-400 text-white", label: "Scheduled" },
    IN_PROGRESS: { color: "bg-blue-500 text-white", label: "In Progress" },
    COMPLETED: { color: "bg-green-500 text-white", label: "Completed" },
    CANCELLED: { color: "bg-gray-500 text-white", label: "Cancelled" },
  }

  const priorityConfig = {
    LOW: { color: "bg-slate-500 text-white", label: "Low" },
    MEDIUM: { color: "bg-yellow-500 text-white", label: "Medium" },
    HIGH: { color: "bg-orange-500 text-white", label: "High" },
    URGENT: { color: "bg-red-500 text-white", label: "Urgent" },
  }

  const getStatusConfig = (status: string) => {
    const upperStatus = status.toUpperCase()
    return statusConfig[upperStatus as keyof typeof statusConfig] || { color: "bg-gray-500 text-white", label: status }
  }

  const getPriorityConfig = (priority: string) => {
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
      task.priority.toLowerCase().includes(searchLower) ||
      task.status.toLowerCase().includes(searchLower)
    )
  })
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Task</TableHead>
            <TableHead>Unit</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Assigned To</TableHead>
            <TableHead>Reported By</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredTasks.map((task) => (
            <TableRow key={task.id}>
              <TableCell>
                <div>
                  <p className="font-medium">{task.title}</p>
                  <p className="text-sm text-muted-foreground">{task.description}</p>
                </div>
              </TableCell>
              <TableCell>{task.unit.unitNumber}</TableCell>
              <TableCell>
                <Badge className={getPriorityConfig(task.priority).color}>
                  {getPriorityConfig(task.priority).label}
                </Badge>
              </TableCell>
              <TableCell>{task.assignedTo ? task.assignedTo.fullName : "Unassigned"}</TableCell>
              <TableCell>{task.reportedBy.fullName}</TableCell>
              <TableCell>
                <Badge className={getStatusConfig(task.status).color}>{getStatusConfig(task.status).label}</Badge>
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="sm" onClick={() => setUploadTaskId(task.id)}>
                  <Upload className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

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
