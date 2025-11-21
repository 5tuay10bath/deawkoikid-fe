import type { FloorEntity } from "./floor.entity"

export interface BuildingEntity {
  id: string
  name: string
  codeName: string
  description: string
  floorCount: number
  floors?: FloorEntity[]
}
