import type { TenantsPageModel } from "./tenantsPage.model"
import type { UnitPageModel } from "./unitPage.model"
import type { ContractStatus } from "../types/status.types"
import type { RentType, WaterBillingType } from "../types/enums.types"

export interface ContractsModel {
  id: string
  user: TenantsPageModel
  unit: UnitPageModel
  rentType: RentType
  rentAmount: number
  waterBillingType: WaterBillingType
  internet: boolean
  startDate: Date
  endDate: Date
  status: ContractStatus
}

export interface CreateUnitModel {
  id: string
  address: string
}

export interface CreateUserModel {
  id: string
  email: string
}
