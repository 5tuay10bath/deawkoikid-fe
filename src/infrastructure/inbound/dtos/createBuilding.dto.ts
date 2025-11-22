interface Unit {
  unitNumber: string
  unitType: string
  unitSize: number
}

interface Floor {
  floorNumber: string
  unitCount: number
  units: Unit[]
}

export interface CreateBuildingDto {
  name: string
  codeName: string
  description: string
  floors: Floor[]
}
