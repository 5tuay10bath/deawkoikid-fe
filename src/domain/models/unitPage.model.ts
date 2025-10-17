export interface UnitPageModel {
  id: string
  address: string
  unitNumber: string
  unitType: "A" | "B" | "C"
  unitSize: number
  status: "available" | "reserved" | "occupied" | "pending"
  floor: number
  latestAirconService: Date
}
