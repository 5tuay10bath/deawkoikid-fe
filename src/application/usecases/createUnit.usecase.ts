import type { ICreateUnitUseCase } from "@domain/ports/createUnit.usecase.port"
import type { IUnitPageRepository, CreateUnitDto } from "@application/ports/unitPage.repository.port"

export class CreateUnitUseCase implements ICreateUnitUseCase {
  private readonly unitPageRepository: IUnitPageRepository

  constructor(unitPageRepository: IUnitPageRepository) {
    this.unitPageRepository = unitPageRepository
  }

  async handler(dto: CreateUnitDto): Promise<ICreateUnitUseCase.Result> {
    return await this.unitPageRepository.createUnit(dto)
  }
}
