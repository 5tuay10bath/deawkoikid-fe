import { UploadMeterCsvUsecase } from "@application/usecases/uploadMeterCsv.usecase"
import { DashboardRepository } from "../repositories/dashboard.repository"

export const UploadMeterCsvFactory = () => {
  const dashboardRepository = DashboardRepository.getInstance()
  const uploadMeterCsvUsecase = new UploadMeterCsvUsecase(dashboardRepository)
  return uploadMeterCsvUsecase
}
