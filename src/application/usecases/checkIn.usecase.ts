import type { ICheckInUseCase } from "@domain/ports/checkIn.usecase.port"
import type { IDashboardRepository, CheckInDto } from "@application/ports/dashboard.repository.port"

export class CheckInUseCase implements ICheckInUseCase {
  private readonly dashboardRepository: IDashboardRepository

  constructor(dashboardRepository: IDashboardRepository) {
    this.dashboardRepository = dashboardRepository
  }

  async handler(dto: CheckInDto): Promise<ICheckInUseCase.Result> {
    return await this.dashboardRepository.checkIn(dto)
  }
}
