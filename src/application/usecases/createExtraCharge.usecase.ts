import type { IDashboardRepository } from "@application/ports/dashboard.repository.port"
import type { ICreateExtraChargeUsecase } from "@domain/ports/createExtraCharge.usecase.port"
import type { CreateExtraChargeDto } from "@infrastructure/inbound/dtos/createExtraCharge.dto"
import { left, right } from "@shared/either"

export class CreateExtraChargeUsecase implements ICreateExtraChargeUsecase {
  private readonly dashboardRepository: IDashboardRepository

  constructor(dashboardRepository: IDashboardRepository) {
    this.dashboardRepository = dashboardRepository
  }

  async handler(dto: CreateExtraChargeDto): ICreateExtraChargeUsecase.output {
    const result = await this.dashboardRepository.createExtraCharge(dto)

    if (result.isRight()) {
      return right(result.value)
    }
    return left(result.value)
  }
}
