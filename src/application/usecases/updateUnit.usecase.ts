import type { IUpdateUnitUseCase } from "@domain/ports/updateUnit.usecase.port"
import type { IUnitPageRepository, UpdateUnitDto } from "@application/ports/unitPage.repository.port"

export class UpdateUnitUseCase implements IUpdateUnitUseCase {
  private readonly unitPageRepository: IUnitPageRepository

  constructor(unitPageRepository: IUnitPageRepository) {
    this.unitPageRepository = unitPageRepository
  }

  async handler(dto: UpdateUnitDto): Promise<IUpdateUnitUseCase.Result> {
    return await this.unitPageRepository.updateUnit(dto)
  }
}
