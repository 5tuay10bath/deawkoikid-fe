export interface CreateMaintenanceDto {
  unitId: string
  title: string
  description: string
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
  assignedToId?: string
  reportedById: string
  scheduledAt: Date
}
