import { CreateMaintenanceUseCase } from "@application/usecases/createMaintenance.usecase"
import { MaintenanceRepository } from "../repositories/maintenance.repository"

export const CreateMaintenanceFactory = () => {
  const maintenanceRepository = MaintenanceRepository.getInstance()
  const createMaintenanceUseCase = new CreateMaintenanceUseCase(maintenanceRepository)
  return createMaintenanceUseCase
}
