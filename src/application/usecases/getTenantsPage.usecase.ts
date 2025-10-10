import type { ITenantsPageRepository } from "@application/ports/tenantsPage.repository.port"
import type { IGetTenantsPageUseCase } from "@domain/ports/getTenantsPage.usecase.port"
import type { DefaultDto } from "@infrastructure/inbound/dtos/default.dto"
import { left, right } from "@shared/either"

export class GetTenantsPageUsecase implements IGetTenantsPageUseCase {
  private readonly tenantsPageRepository: ITenantsPageRepository

  constructor(tenantsPageRepository: ITenantsPageRepository) {
    this.tenantsPageRepository = tenantsPageRepository
  }

  async handler(dto: DefaultDto): IGetTenantsPageUseCase.output {
    const result = await this.tenantsPageRepository.getTenantsPage(dto)

    if (result.isRight()) {
      return right(result.value)
    }
    return left(result.value)
  }
}
