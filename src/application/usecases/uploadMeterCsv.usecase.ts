import type { IDashboardRepository } from "@application/ports/dashboard.repository.port"
import type { IUploadMeterCsvUsecase } from "@domain/ports/uploadMeterCsv.usecase.port"
import type { UploadMeterCsvDto } from "@infrastructure/inbound/dtos/uploadMeterCsv.dto"
import { left, right } from "@shared/either"

export class UploadMeterCsvUsecase implements IUploadMeterCsvUsecase {
  private readonly dashboardRepository: IDashboardRepository

  constructor(dashboardRepository: IDashboardRepository) {
    this.dashboardRepository = dashboardRepository
  }

  async handler(dto: UploadMeterCsvDto): IUploadMeterCsvUsecase.output {
    const result = await this.dashboardRepository.uploadMeterCsv(dto)

    if (result.isRight()) {
      return right(result.value)
    }
    return left(result.value)
  }
}
