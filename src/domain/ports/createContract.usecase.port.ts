import type { CreateContractDto } from "@application/ports/contracts.repository.port"
import type { ApiResponse } from "@domain/models/apiResponse.model"
import type { Either } from "@shared/either"

export interface ICreateContractUseCase {
  handler: (dto: CreateContractDto) => Promise<ICreateContractUseCase.Result>
}

export namespace ICreateContractUseCase {
  export type Result = Either<any, ApiResponse>
}
