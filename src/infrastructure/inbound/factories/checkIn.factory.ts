import { CheckInUseCase } from "@application/usecases/checkIn.usecase"
import { DashboardRepository } from "../repositories/dashboard.repository"

export const CheckInFactory = () => {
  const dashboardRepository = DashboardRepository.getInstance()
  const checkInUseCase = new CheckInUseCase(dashboardRepository)
  return checkInUseCase
}
