import type { IUpdateTenantUseCase } from "@domain/ports/updateTenant.usecase.port"
import type { ITenantsPageRepository, UpdateTenantDto } from "@application/ports/tenantsPage.repository.port"

export class UpdateTenantUseCase implements IUpdateTenantUseCase {
  private readonly tenantsPageRepository: ITenantsPageRepository

  constructor(tenantsPageRepository: ITenantsPageRepository) {
    this.tenantsPageRepository = tenantsPageRepository
  }

  async handler(dto: UpdateTenantDto): Promise<IUpdateTenantUseCase.Result> {
    return await this.tenantsPageRepository.updateTenant(dto)
  }
}
