import type { CheckInDto } from "@application/ports/dashboard.repository.port"
import type { ApiResponse } from "@domain/models/apiResponse.model"
import type { Either } from "@shared/either"

export interface ICheckInUseCase {
  handler: (dto: CheckInDto) => Promise<ICheckInUseCase.Result>
}

export namespace ICheckInUseCase {
  export type Result = Either<any, ApiResponse>
}
