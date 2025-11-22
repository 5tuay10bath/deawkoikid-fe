import { CreateBuildingUsecase } from "@application/usecases/createBuilding.usecase"
import { BuildingRepository } from "../repositories/building.repository"

export const CreateBuildingFactory = () => {
  const buildingRepository = BuildingRepository.getInstance()
  const createBuildingUsecase = new CreateBuildingUsecase(buildingRepository)
  return createBuildingUsecase
}
