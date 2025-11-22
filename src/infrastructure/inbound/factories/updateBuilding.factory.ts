import { UpdateBuildingUsecase } from "@application/usecases/updateBuilding.usecase"
import { BuildingRepository } from "../repositories/building.repository"

export const UpdateBuildingFactory = () => {
  const buildingRepository = BuildingRepository.getInstance()
  const updateBuildingUsecase = new UpdateBuildingUsecase(buildingRepository)
  return updateBuildingUsecase
}
