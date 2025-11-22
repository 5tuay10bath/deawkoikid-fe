import type { IBuildingRepository } from "@application/ports/building.repository.port"
import type { IUpdateFloorUsecase } from "@domain/ports/updateFloor.usecase.port"
import type { UpdateFloorDto } from "@infrastructure/inbound/dtos/updateFloor.dto"
import { left, right } from "@shared/either"

export class UpdateFloorUsecase implements IUpdateFloorUsecase {
  private readonly buildingRepository: IBuildingRepository

  constructor(buildingRepository: IBuildingRepository) {
    this.buildingRepository = buildingRepository
  }

  async handler(dto: UpdateFloorDto): IUpdateFloorUsecase.output {
    const result = await this.buildingRepository.updateFloor(dto)

    if (result.isRight()) {
      return right(result.value)
    }
    return left(result.value)
  }
}
