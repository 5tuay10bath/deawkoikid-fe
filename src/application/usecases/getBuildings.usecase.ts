import type { IBuildingRepository } from "@application/ports/building.repository.port"
import type { IGetBuildingsUsecase } from "@domain/ports/getBuildings.usecase.port"
import type { DefaultDto } from "@infrastructure/inbound/dtos/default.dto"
import { left, right } from "@shared/either"

export class GetBuildingsUsecase implements IGetBuildingsUsecase {
  private readonly buildingRepository: IBuildingRepository

  constructor(buildingRepository: IBuildingRepository) {
    this.buildingRepository = buildingRepository
  }

  async handler(dto: DefaultDto): IGetBuildingsUsecase.output {
    const result = await this.buildingRepository.getBuildings(dto)

    if (result.isRight()) {
      return right(result.value)
    }
    return left(result.value)
  }
}
