import type { UnitStatus } from "../types/status.types"
import type { UnitType } from "../types/enums.types"

export interface UnitPageModel {
  id: string
  address: string
  unitNumber: string
  unitType: UnitType
  unitSize: number
  unitStatus: UnitStatus
  floor: number
  latestAirconService: Date
}
