import type { TenantsPageModel } from "./tenantsPage.model"
import type { UnitPageModel } from "./unitPage.model"

export interface ContractsModel {
  id: string
  user: TenantsPageModel
  unit: UnitPageModel
  rentType: "MONTHLY" | "YEARLY"
  rentAmount: number
  waterBillingType: "PER_UNIT" | "FLAT_RATE" | "TIERED"
  internet: boolean
  startDate: Date
  endDate: Date
  status: "DRAFT" | "SIGNED" | "ACTIVE" | "EXPIRED"
}
