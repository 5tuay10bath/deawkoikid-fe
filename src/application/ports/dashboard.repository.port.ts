import type { DashboardModel } from "@domain/models/dashboard.model"
import type { DefaultDto } from "@infrastructure/inbound/dtos/default.dto"
import type { Either } from "@shared/either"

export interface IDashboardRepository {
  getDashboard: (dto: DefaultDto) => Promise<IDashboardRepository.getDashboard>
}

export namespace IDashboardRepository {
  export type getDashboard = Promise<Either<any, DashboardModel>>
}
