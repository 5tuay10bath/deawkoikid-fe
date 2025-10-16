import type { TenantsPageModel } from "./tenantsPage.model"
import type { UnitPageModel } from "./unitPage.model"

export interface MaintenanceModel {
  id: string
  unit: UnitPageModel
  title: string
  description: string
  price: number
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT"
  maintenanceType:
    | "ELECTRIC"
    | "WATER"
    | "PHONE"
    | "AIR_CONDITIONAL"
    | "FURNITURE"
    | "FIRE_ALARM_SYSTEM"
    | "WATER_LEAKAGE"
    | "FLOOR_WALL"
    | "BATHROOM"
    | "PAINT"
    | "CEMENT_WOOD"
    | "OTHER"
  assignedTo: TenantsPageModel | null
  reportedBy: TenantsPageModel
  status: "REPORTED" | "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED"
  scheduledAt: Date | null
  startedAt: Date | null
  completedAt: Date | null
  cancelledAt: Date | null
}
