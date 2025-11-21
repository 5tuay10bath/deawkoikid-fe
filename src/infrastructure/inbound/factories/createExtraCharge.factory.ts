import { CreateExtraChargeUsecase } from "@application/usecases/createExtraCharge.usecase"
import { DashboardRepository } from "../repositories/dashboard.repository"

export const CreateExtraChargeFactory = () => {
  const dashboardRepository = DashboardRepository.getInstance()
  const createExtraChargeUsecase = new CreateExtraChargeUsecase(dashboardRepository)
  return createExtraChargeUsecase
}
