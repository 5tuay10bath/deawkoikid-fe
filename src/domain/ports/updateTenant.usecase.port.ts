import type { UpdateTenantDto } from "@application/ports/tenantsPage.repository.port"
import type { ApiResponse } from "@domain/models/apiResponse.model"
import type { Either } from "@shared/either"

export interface IUpdateTenantUseCase {
  handler: (dto: UpdateTenantDto) => Promise<IUpdateTenantUseCase.Result>
}

export namespace IUpdateTenantUseCase {
  export type Result = Either<any, ApiResponse>
}
