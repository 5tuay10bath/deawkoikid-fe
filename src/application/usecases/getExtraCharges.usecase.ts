import type { IDashboardRepository } from "@application/ports/dashboard.repository.port"
import type { IGetExtraChargesUsecase } from "@domain/ports/getExtraCharges.usecase.port"
import type { GetExtraChargesDto } from "@infrastructure/inbound/dtos/getExtraCharges.dto"
import { left, right } from "@shared/either"

export class GetExtraChargesUsecase implements IGetExtraChargesUsecase {
  private readonly dashboardRepository: IDashboardRepository

  constructor(dashboardRepository: IDashboardRepository) {
    this.dashboardRepository = dashboardRepository
  }

  async handler(dto: GetExtraChargesDto): IGetExtraChargesUsecase.output {
    const result = await this.dashboardRepository.getExtraCharges(dto)

    if (result.isRight()) {
      return right(result.value)
    }
    return left(result.value)
  }
}
