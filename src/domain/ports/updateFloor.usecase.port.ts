import type { ApiResponse } from "@domain/models/apiResponse.model"
import type { UpdateFloorDto } from "@infrastructure/inbound/dtos/updateFloor.dto"
import type { Either } from "@shared/either"

export interface IUpdateFloorUsecase {
  handler: (dto: UpdateFloorDto) => IUpdateFloorUsecase.output
}

export namespace IUpdateFloorUsecase {
  export type output = Promise<Either<any, ApiResponse>>
}
