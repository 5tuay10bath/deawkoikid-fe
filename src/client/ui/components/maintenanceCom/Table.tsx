import { useMaintenanceStore } from "@infrastructure/libs/store/maintenance.store"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../common/Table"
import { format } from "date-fns"
import { Badge } from "../common/Badge"
const MaintainTable = () => {
  const { tasks, searchTerm } = useMaintenanceStore()

  const statusConfig = {
    pending: { color: "bg-yellow-500 text-white", label: "Pending" },
    "in-progress": { color: "bg-blue-500 text-white", label: "In Progress" },
    completed: { color: "bg-green-500 text-white", label: "Completed" },
  }

  const priorityConfig = {
    low: { color: "bg-gray-500 text-white", label: "Low" },
    medium: { color: "bg-yellow-500 text-white", label: "Medium" },
    high: { color: "bg-red-500 text-white", label: "High" },
    urgent: { color: "bg-red-500 text-white", label: "Urgent" },
  }

  const filteredTasks = tasks.filter((task) => {
    if (!searchTerm) return true
    const searchLower = searchTerm.toLowerCase()
    return (
      task.title.toLowerCase().includes(searchLower) ||
      task.description.toLowerCase().includes(searchLower) ||
      task.unitNumber.toLowerCase().includes(searchLower) ||
      task.assignedTo.toLowerCase().includes(searchLower) ||
      task.priority.toLowerCase().includes(searchLower) ||
      task.status.toLowerCase().includes(searchLower)
    )
  })
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Task</TableHead>
          <TableHead>Unit</TableHead>
          <TableHead>Priority</TableHead>
          <TableHead>Assigned To</TableHead>
          <TableHead>Due Date</TableHead>
          <TableHead>Status</TableHead>
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
            <TableCell>{task.unitNumber}</TableCell>
            <TableCell>
              <Badge className={priorityConfig[task.priority].color}>{priorityConfig[task.priority].label}</Badge>
            </TableCell>
            <TableCell>{task.assignedTo}</TableCell>
            <TableCell>{format(task.dueDate, "MMM dd, yyyy")}</TableCell>
            <TableCell>
              <Badge className={statusConfig[task.status].color}>{statusConfig[task.status].label}</Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
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
          <TableHead>Unit Cost</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {supplies.map((supply) => (
          <TableRow key={supply.id}>
            <TableCell className="font-medium">{supply.name}</TableCell>
            <TableCell>{supply.category}</TableCell>
            <TableCell>
              {supply.quantity} {supply.unit}
            </TableCell>
            <TableCell>
              {supply.minStock} {supply.unit}
            </TableCell>
            <TableCell>${supply.cost}</TableCell>
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
