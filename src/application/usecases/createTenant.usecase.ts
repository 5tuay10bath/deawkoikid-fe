import type { ICreateTenantUseCase } from "@domain/ports/createTenant.usecase.port"
import type { ITenantsPageRepository, CreateTenantDto } from "@application/ports/tenantsPage.repository.port"

export class CreateTenantUseCase implements ICreateTenantUseCase {
  private readonly tenantsPageRepository: ITenantsPageRepository

  constructor(tenantsPageRepository: ITenantsPageRepository) {
    this.tenantsPageRepository = tenantsPageRepository
  }

  async handler(dto: CreateTenantDto): Promise<ICreateTenantUseCase.Result> {
    return await this.tenantsPageRepository.createTenant(dto)
  }
}
