import { GetBuildingsUsecase } from "@application/usecases/getBuildings.usecase"
import { BuildingRepository } from "../repositories/building.repository"

export const GetBuildingsFactory = () => {
  const buildingRepository = BuildingRepository.getInstance()
  const getBuildingsUsecase = new GetBuildingsUsecase(buildingRepository)
  return getBuildingsUsecase
}
