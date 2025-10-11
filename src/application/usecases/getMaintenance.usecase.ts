import type { IMaintenanceRepository } from "@application/ports/maintenance.repository.port"
import type { IGetMaintenanceUsecase } from "@domain/ports/getMaintenance.usecase.port"
import type { DefaultDto } from "@infrastructure/inbound/dtos/default.dto"
import { left, right } from "@shared/either"

export class GetMaintenanceUsecase implements IGetMaintenanceUsecase {
  private readonly maintenanceRepository: IMaintenanceRepository

  constructor(maintenanceRepository: IMaintenanceRepository) {
    this.maintenanceRepository = maintenanceRepository
  }

  async handler(dto: DefaultDto): IGetMaintenanceUsecase.output {
    const result = await this.maintenanceRepository.getMaintenance(dto)

    if (result.isRight()) {
      return right(result.value)
    }
    return left(result.value)
  }
}
