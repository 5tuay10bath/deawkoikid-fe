import type { IDashboardRepository } from "@application/ports/dashboard.repository.port"
import type { IGetDashboardUsecase } from "@domain/ports/getDashboard.usecase.port"
import type { DefaultDto } from "@infrastructure/inbound/dtos/default.dto"
import { left, right } from "@shared/either"

export class GetDashboardUsecase implements IGetDashboardUsecase {
  private readonly dashboardRepository: IDashboardRepository

  constructor(dashboardRepository: IDashboardRepository) {
    this.dashboardRepository = dashboardRepository
  }

  async handler(dto: DefaultDto): IGetDashboardUsecase.output {
    const result = await this.dashboardRepository.getDashboard(dto)

    if (result.isRight()) {
      return right(result.value)
    }
    return left(result.value)
  }
}
