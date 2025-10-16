export interface CreateMaintenanceDto {
  unitId: string
  title: string
  description: string
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT"
  assignedToId?: string
  reportedById: string
  dueDate: Date
}
