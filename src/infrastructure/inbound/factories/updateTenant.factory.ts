import { UpdateTenantUseCase } from "@application/usecases/updateTenant.usecase"
import { TenantsPageRepository } from "../repositories/tenantsPage.repository"

export const UpdateTenantFactory = () => {
  const tenantsPageRepository = TenantsPageRepository.getInstance()
  const updateTenantUseCase = new UpdateTenantUseCase(tenantsPageRepository)
  return updateTenantUseCase
}
