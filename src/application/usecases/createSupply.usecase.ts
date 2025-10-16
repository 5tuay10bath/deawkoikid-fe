import type { ICreateSupplyUseCase } from "@domain/ports/createSupply.usecase.port"
import type { IMaintenanceRepository, CreateSupplyDto } from "@application/ports/maintenance.repository.port"

export class CreateSupplyUseCase implements ICreateSupplyUseCase {
  private readonly maintenanceRepository: IMaintenanceRepository

  constructor(maintenanceRepository: IMaintenanceRepository) {
    this.maintenanceRepository = maintenanceRepository
  }

  async handler(dto: CreateSupplyDto): Promise<ICreateSupplyUseCase.Result> {
    return await this.maintenanceRepository.createSupply(dto)
  }
}
