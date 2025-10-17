export interface UnitPageModel {
  id: string
  address: string
  unitNumber: string
  unitType: "A" | "B" | "C"
  unitSize: number
  status: "available" | "reserved" | "occupied"
  floor: number
  latestAirconService: Date
}
