import type { IBuildingRepository } from "@application/ports/building.repository.port"
import type { IUpdateBuildingUsecase } from "@domain/ports/updateBuilding.usecase.port"
import type { UpdateBuildingDto } from "@infrastructure/inbound/dtos/updateBuilding.dto"
import { left, right } from "@shared/either"

export class UpdateBuildingUsecase implements IUpdateBuildingUsecase {
  private readonly buildingRepository: IBuildingRepository

  constructor(buildingRepository: IBuildingRepository) {
    this.buildingRepository = buildingRepository
  }

  async handler(dto: UpdateBuildingDto): IUpdateBuildingUsecase.output {
    const result = await this.buildingRepository.updateBuilding(dto)

    if (result.isRight()) {
      return right(result.value)
    }
    return left(result.value)
  }
}
