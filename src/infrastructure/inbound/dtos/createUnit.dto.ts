export interface CreateUnitDto {
  unitNumber: string
  address: string
  unitType: "A" | "B" | "C"
  unitSize: number
  status: "AVAILABLE" | "RESERVED" | "OCCUPIED" | "PENDING"
  floor: number
}
