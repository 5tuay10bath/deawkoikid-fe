import type { DashboardModel } from "@domain/models/dashboard.model"
import type { ApiResponse } from "@domain/models/apiResponse.model"
import type { DefaultDto } from "@infrastructure/inbound/dtos/default.dto"
import type { CheckInDto } from "@infrastructure/inbound/dtos/checkIn.dto"
import type { Either } from "@shared/either"

export type { CheckInDto }

export interface IDashboardRepository {
  getDashboard: (dto: DefaultDto) => Promise<IDashboardRepository.getDashboard>
  checkIn: (dto: CheckInDto) => Promise<IDashboardRepository.checkIn>
}

export namespace IDashboardRepository {
  export type getDashboard = Promise<Either<any, DashboardModel[]>>
  export type checkIn = Promise<Either<any, ApiResponse>>
}
