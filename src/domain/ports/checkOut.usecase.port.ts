import type { CheckOutDto } from "@application/ports/dashboard.repository.port"
import type { ApiResponse } from "@domain/models/apiResponse.model"
import type { Either } from "@shared/either"

export interface ICheckOutUseCase {
  handler: (dto: CheckOutDto) => Promise<ICheckOutUseCase.Result>
}

export namespace ICheckOutUseCase {
  export type Result = Either<any, ApiResponse>
}
