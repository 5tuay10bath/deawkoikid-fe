import type { ContractsModel } from "./contracts.model"
import type { UnitStatus } from "../types/status.types"
import type { UnitType } from "../types/enums.types"

export interface DashboardModel {
  id: string
  address: string
  unitNumber: string
  unitType: UnitType
  unitSize: number
  unitStatus: UnitStatus
  floor: number
  latestAirconService: Date
  contract?: ContractsModel | null
}
