import { CreateSupplyUseCase } from "@application/usecases/createSupply.usecase"
import { MaintenanceRepository } from "../repositories/maintenance.repository"

export const CreateSupplyFactory = () => {
  const maintenanceRepository = MaintenanceRepository.getInstance()
  const createSupplyUseCase = new CreateSupplyUseCase(maintenanceRepository)
  return createSupplyUseCase
}
