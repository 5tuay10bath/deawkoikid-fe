import type { DashboardModel } from "@domain/models/dashboard.model"
import type { DefaultDto } from "@infrastructure/inbound/dtos/default.dto"
import type { Either } from "@shared/either"

export interface IGetDashboardUsecase {
  handler: (dto: DefaultDto) => IGetDashboardUsecase.output
}

export namespace IGetDashboardUsecase {
  export type output = Promise<Either<any, DashboardModel[]>>
}
