import type { UpdateUnitDto } from "@application/ports/unitPage.repository.port"
import type { ApiResponse } from "@domain/models/apiResponse.model"
import type { Either } from "@shared/either"

export interface IUpdateUnitUseCase {
  handler: (dto: UpdateUnitDto) => Promise<IUpdateUnitUseCase.Result>
}

export namespace IUpdateUnitUseCase {
  export type Result = Either<any, ApiResponse>
}
