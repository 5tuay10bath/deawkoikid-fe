import { GetDashboardUsecase } from "@application/usecases/getDashboard.usecase"
import { DashboardRepository } from "../repositories/dashboard.repository"

export const GetDashboardFactory = () => {
  const dashboardRepository = DashboardRepository.getInstance()
  const getDashboardUsecase = new GetDashboardUsecase(dashboardRepository)
  return getDashboardUsecase
}
