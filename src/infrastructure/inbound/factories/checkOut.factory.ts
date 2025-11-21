import { CheckOutUseCase } from "@application/usecases/checkOut.usecase"
import { DashboardRepository } from "../repositories/dashboard.repository"

export const CheckOutFactory = () => {
  const dashboardRepository = DashboardRepository.getInstance()
  const checkOutUseCase = new CheckOutUseCase(dashboardRepository)
  return checkOutUseCase
}
