import { GetTenantsPageUsecase } from "@application/usecases/getTenantsPage.usecase"
import { TenantsPageRepository } from "../repositories/tenantsPage.repository"

export const GetTenantsPageFactory = () => {
  const tenantsPageRepository = TenantsPageRepository.getInstance()
  const getTenantsPageUsecase = new GetTenantsPageUsecase(tenantsPageRepository)
  return getTenantsPageUsecase
}
