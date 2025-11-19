import type { TenantsPageModel } from "./tenantsPage.model"
import type { UnitPageModel } from "./unitPage.model"
import type { MaintenanceStatus } from "../types/status.types"
import type { MaintenanceType, MaintenancePriority } from "../types/enums.types"

export interface MaintenanceModel {
  id: string
  unit: UnitPageModel
  title: string
  description: string
  price: number
  priority: MaintenancePriority
  maintenanceType: MaintenanceType
  assignedTo: TenantsPageModel | null
  reportedBy: TenantsPageModel
  status: MaintenanceStatus
  scheduledAt: Date | null
  startedAt: Date | null
  completedAt: Date | null
  cancelledAt: Date | null
}
