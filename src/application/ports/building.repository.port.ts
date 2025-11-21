import type { BuildingModel } from "@domain/models/building.model"
import type { CreateBuildingDto } from "@infrastructure/inbound/dtos/createBuilding.dto"
import type { UpdateBuildingDto } from "@infrastructure/inbound/dtos/updateBuilding.dto"
import type { UpdateFloorDto } from "@infrastructure/inbound/dtos/updateFloor.dto"
import type { DefaultDto } from "@infrastructure/inbound/dtos/default.dto"
import type { ApiResponse } from "@domain/models/apiResponse.model"
import type { Either } from "@shared/either"

export interface IBuildingRepository {
  getBuildings: (dto: DefaultDto) => Promise<IBuildingRepository.getBuildings>
  createBuilding: (dto: CreateBuildingDto) => Promise<IBuildingRepository.createBuilding>
  updateBuilding: (dto: UpdateBuildingDto) => Promise<IBuildingRepository.updateBuilding>
  updateFloor: (dto: UpdateFloorDto) => Promise<IBuildingRepository.updateFloor>
}

export namespace IBuildingRepository {
  export type getBuildings = Either<any, BuildingModel[]>
  export type createBuilding = Either<any, ApiResponse>
  export type updateBuilding = Either<any, ApiResponse>
  export type updateFloor = Either<any, ApiResponse>
}
