import type { DashboardModel } from "@domain/models/dashboard.model"
import type { ApiResponse } from "@domain/models/apiResponse.model"
import type { DefaultDto } from "@infrastructure/inbound/dtos/default.dto"
import type { CheckInDto } from "@infrastructure/inbound/dtos/checkIn.dto"
import type { CheckOutDto } from "@infrastructure/inbound/dtos/checkOut.dto"
import type { UploadMeterCsvDto } from "@infrastructure/inbound/dtos/uploadMeterCsv.dto"
import type { Either } from "@shared/either"

export type { CheckInDto, CheckOutDto, UploadMeterCsvDto }

export interface IDashboardRepository {
  getDashboard: (dto: DefaultDto) => Promise<IDashboardRepository.getDashboard>
  checkIn: (dto: CheckInDto) => Promise<IDashboardRepository.checkIn>
  checkOut: (dto: CheckOutDto) => Promise<IDashboardRepository.checkOut>
  uploadMeterCsv: (dto: UploadMeterCsvDto) => Promise<IDashboardRepository.uploadMeterCsv>
}

export namespace IDashboardRepository {
  export type getDashboard = Promise<Either<any, DashboardModel[]>>
  export type checkIn = Promise<Either<any, ApiResponse>>
  export type checkOut = Promise<Either<any, ApiResponse>>
  export type uploadMeterCsv = Promise<Either<any, ApiResponse>>
}
