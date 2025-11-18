export interface UpdateUnitDto {
  id: string
  unitNumber: string
  unitType: "A" | "B" | "C"
  unitSize: number
  floor: string // UUID
}
