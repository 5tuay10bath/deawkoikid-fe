import { GetExtraChargesUsecase } from "@application/usecases/getExtraCharges.usecase"
import { DashboardRepository } from "../repositories/dashboard.repository"

export const GetExtraChargesFactory = () => {
  const dashboardRepository = DashboardRepository.getInstance()
  const getExtraChargesUsecase = new GetExtraChargesUsecase(dashboardRepository)
  return getExtraChargesUsecase
}
