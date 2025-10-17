import type { CreateTenantDto } from "@application/ports/tenantsPage.repository.port"
import type { ApiResponse } from "@domain/models/apiResponse.model"
import type { Either } from "@shared/either"

export interface ICreateTenantUseCase {
  handler: (dto: CreateTenantDto) => Promise<ICreateTenantUseCase.Result>
}

export namespace ICreateTenantUseCase {
  export type Result = Either<any, ApiResponse>
}
