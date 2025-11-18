export interface CreateUnitDto {
  unitNumber: string
  unitType: "A" | "B" | "C"
  unitSize: number
  floor: string // UUID
}
