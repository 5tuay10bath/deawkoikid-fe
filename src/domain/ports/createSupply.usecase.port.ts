import type { CreateSupplyDto } from "@application/ports/maintenance.repository.port"
import type { ApiResponse } from "@domain/models/apiResponse.model"
import type { Either } from "@shared/either"

export interface ICreateSupplyUseCase {
  handler: (dto: CreateSupplyDto) => Promise<ICreateSupplyUseCase.Result>
}

export namespace ICreateSupplyUseCase {
  export type Result = Either<any, ApiResponse>
}
