import { UpdateFloorUsecase } from "@application/usecases/updateFloor.usecase"
import { BuildingRepository } from "../repositories/building.repository"

export const UpdateFloorFactory = () => {
  const buildingRepository = BuildingRepository.getInstance()
  const updateFloorUsecase = new UpdateFloorUsecase(buildingRepository)
  return updateFloorUsecase
}
