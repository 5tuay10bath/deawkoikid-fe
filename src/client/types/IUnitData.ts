export type UnitStatus = "available" | "occupied" | "maintenance"
export type UnitType = "A" | "B" | "C"
export type Unit = {
  id: number
  unitNumber: string
  unitType: UnitType
  unitSize: number
  status: UnitStatus
  floor: string
  latestAirconService: string | null
}
