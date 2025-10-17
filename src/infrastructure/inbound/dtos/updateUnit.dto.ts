export interface UpdateUnitDto {
  id: string
  unitNumber: string
  unitType: "A" | "B" | "C"
  unitSize: number
  floor: number
  address: string
  status: "AVAILABLE" | "OCCUPIED" | "RESERVED" | "PENDING"
}
