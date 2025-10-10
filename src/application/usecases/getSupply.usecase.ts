import type { IMaintenanceRepository } from "@application/ports/maintenance.repository.port"
import type { IGetSupplyUsecase } from "@domain/ports/getSupply.usecase.port"
import type { DefaultDto } from "@infrastructure/inbound/dtos/default.dto"
import { left, right } from "@shared/either"

export class GetSupplyUsecase implements IGetSupplyUsecase {
  private readonly maintenanceRepository: IMaintenanceRepository

  constructor(maintenanceRepository: IMaintenanceRepository) {
    this.maintenanceRepository = maintenanceRepository
  }

  async handler(dto: DefaultDto): IGetSupplyUsecase.output {
    const result = await this.maintenanceRepository.getSupply(dto)

    if (result.isRight()) {
      return right(result.value)
    }
    return left(result.value)
  }
}
