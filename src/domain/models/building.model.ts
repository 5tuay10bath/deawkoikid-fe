import type { FloorModel } from "./floor.model"

export interface BuildingModel {
  id: string
  name: string
  codeName: string
  description: string
  floorCount: number
  floors?: FloorModel[]
}
