import type { ICreateMaintenanceUseCase } from "@domain/ports/createMaintenance.usecase.port"
import type { IMaintenanceRepository, CreateMaintenanceDto } from "@application/ports/maintenance.repository.port"

export class CreateMaintenanceUseCase implements ICreateMaintenanceUseCase {
  private readonly maintenanceRepository: IMaintenanceRepository

  constructor(maintenanceRepository: IMaintenanceRepository) {
    this.maintenanceRepository = maintenanceRepository
  }

  async handler(dto: CreateMaintenanceDto): Promise<ICreateMaintenanceUseCase.Result> {
    return await this.maintenanceRepository.createMaintenance(dto)
  }
}
