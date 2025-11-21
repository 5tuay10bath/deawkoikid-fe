export interface CreateMaintenanceDto {
  unitId: string
  title: string
  description?: string
  price?: number
  priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT"
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
  assignedToId: string
  reportedById: string
  scheduledAt?: string // ISO 8601 format
  estimatedFinishTime?: string // ISO 8601 format
}
