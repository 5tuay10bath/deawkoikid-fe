import type { UpdateContractDto } from "@application/ports/contracts.repository.port"
import type { ApiResponse } from "@domain/models/apiResponse.model"
import type { Either } from "@shared/either"

export interface IUpdateContractUseCase {
  handler: (dto: UpdateContractDto) => Promise<IUpdateContractUseCase.Result>
}

export namespace IUpdateContractUseCase {
  export type Result = Either<any, ApiResponse>
}
