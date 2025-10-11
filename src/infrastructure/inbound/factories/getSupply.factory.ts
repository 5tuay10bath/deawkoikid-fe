import { GetSupplyUsecase } from "@application/usecases/getSupply.usecase"
import { MaintenanceRepository } from "../repositories/maintenance.repository"

export const GetSupplyFactory = () => {
  const maintenanceRepository = MaintenanceRepository.getInstance()
  const getSupplyUsecase = new GetSupplyUsecase(maintenanceRepository)
  return getSupplyUsecase
}
