import { CreateTenantUseCase } from "@application/usecases/createTenant.usecase"
import { TenantsPageRepository } from "../repositories/tenantsPage.repository"

export const CreateTenantFactory = () => {
  const tenantsPageRepository = TenantsPageRepository.getInstance()
  const createTenantUseCase = new CreateTenantUseCase(tenantsPageRepository)
  return createTenantUseCase
}
