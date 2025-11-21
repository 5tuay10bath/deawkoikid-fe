import type { BuildingModel } from "@domain/models/building.model"
import type { CreateBuildingDto } from "@infrastructure/inbound/dtos/createBuilding.dto"
import type { DefaultDto } from "@infrastructure/inbound/dtos/default.dto"
import type { ApiResponse } from "@domain/models/apiResponse.model"
import type { Either } from "@shared/either"

export interface IBuildingRepository {
  getBuildings: (dto: DefaultDto) => Promise<IBuildingRepository.getBuildings>
  createBuilding: (dto: CreateBuildingDto) => Promise<IBuildingRepository.createBuilding>
}

export namespace IBuildingRepository {
  export type getBuildings = Either<any, BuildingModel[]>
  export type createBuilding = Either<any, ApiResponse>
}
