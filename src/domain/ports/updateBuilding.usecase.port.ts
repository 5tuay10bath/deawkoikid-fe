import type { ApiResponse } from "@domain/models/apiResponse.model"
import type { UpdateBuildingDto } from "@infrastructure/inbound/dtos/updateBuilding.dto"
import type { Either } from "@shared/either"

export interface IUpdateBuildingUsecase {
  handler: (dto: UpdateBuildingDto) => IUpdateBuildingUsecase.output
}

export namespace IUpdateBuildingUsecase {
  export type output = Promise<Either<any, ApiResponse>>
}
