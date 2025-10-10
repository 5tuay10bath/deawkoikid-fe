import type { MaintenanceModel } from "@domain/models/maintenance.model"
import type { DefaultDto } from "@infrastructure/inbound/dtos/default.dto"
import type { Either } from "@shared/either"

export interface IGetMaintenanceUsecase {
  handler: (dto: DefaultDto) => IGetMaintenanceUsecase.output
}

export namespace IGetMaintenanceUsecase {
  export type output = Promise<Either<any, MaintenanceModel[]>>
}
