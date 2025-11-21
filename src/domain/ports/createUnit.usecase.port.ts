import type { CreateUnitDto } from "@application/ports/unitPage.repository.port"
import type { ApiResponse } from "@domain/models/apiResponse.model"
import type { Either } from "@shared/either"

export interface ICreateUnitUseCase {
  handler: (dto: CreateUnitDto) => Promise<ICreateUnitUseCase.Result>
}

export namespace ICreateUnitUseCase {
  export type Result = Either<any, ApiResponse>
}
