import { GetMaintenanceUsecase } from "@application/usecases/getMaintenance.usecase"
import { MaintenanceRepository } from "../repositories/maintenance.repository"

export const GetMaintenanceFactory = () => {
  const maintenanceRepository = MaintenanceRepository.getInstance()
  const getMaintenanceUsecase = new GetMaintenanceUsecase(maintenanceRepository)
  return getMaintenanceUsecase
}
