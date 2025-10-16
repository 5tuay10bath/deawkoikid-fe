import type { CreateMaintenanceDto } from "@application/ports/maintenance.repository.port"
import type { ApiResponse } from "@domain/models/apiResponse.model"
import type { Either } from "@shared/either"

export interface ICreateMaintenanceUseCase {
  handler: (dto: CreateMaintenanceDto) => Promise<ICreateMaintenanceUseCase.Result>
}

export namespace ICreateMaintenanceUseCase {
  export type Result = Either<any, ApiResponse>
}
