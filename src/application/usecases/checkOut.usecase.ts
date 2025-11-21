import type { ICheckOutUseCase } from "@domain/ports/checkOut.usecase.port"
import type { IDashboardRepository, CheckOutDto } from "@application/ports/dashboard.repository.port"

export class CheckOutUseCase implements ICheckOutUseCase {
  private readonly dashboardRepository: IDashboardRepository

  constructor(dashboardRepository: IDashboardRepository) {
    this.dashboardRepository = dashboardRepository
  }

  async handler(dto: CheckOutDto): Promise<ICheckOutUseCase.Result> {
    return await this.dashboardRepository.checkOut(dto)
  }
}
