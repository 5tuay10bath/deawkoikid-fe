import type { ApiResponse } from "@domain/models/apiResponse.model"
import type { CreateBuildingDto } from "@infrastructure/inbound/dtos/createBuilding.dto"
import type { Either } from "@shared/either"

export interface ICreateBuildingUsecase {
  handler: (dto: CreateBuildingDto) => ICreateBuildingUsecase.output
}

export namespace ICreateBuildingUsecase {
  export type output = Promise<Either<any, ApiResponse>>
}
