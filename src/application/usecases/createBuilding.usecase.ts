import type { IBuildingRepository } from "@application/ports/building.repository.port"
import type { ICreateBuildingUsecase } from "@domain/ports/createBuilding.usecase.port"
import type { CreateBuildingDto } from "@infrastructure/inbound/dtos/createBuilding.dto"
import { left, right } from "@shared/either"

export class CreateBuildingUsecase implements ICreateBuildingUsecase {
  private readonly buildingRepository: IBuildingRepository

  constructor(buildingRepository: IBuildingRepository) {
    this.buildingRepository = buildingRepository
  }

  async handler(dto: CreateBuildingDto): ICreateBuildingUsecase.output {
    const result = await this.buildingRepository.createBuilding(dto)

    if (result.isRight()) {
      return right(result.value)
    }
    return left(result.value)
  }
}
