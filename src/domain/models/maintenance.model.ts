export interface MaintenanceModel {
  id: string
  unitNumber: string
  type: "repair" | "inspection" | "cleaning" | "other"
  description: string
  status: "pending" | "in-progress" | "completed" | "cancelled"
  priority: "low" | "medium" | "high" | "urgent"
  requestDate: Date
  scheduledDate: Date | null
  completedDate: Date | null
  assignedTo: string | null
  cost: number
}
