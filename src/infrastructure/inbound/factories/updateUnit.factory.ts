import { UpdateUnitUseCase } from "@application/usecases/updateUnit.usecase"
import { UnitPageRepository } from "../repositories/unitPage.repository"

export const UpdateUnitFactory = () => {
  const unitPageRepository = UnitPageRepository.getInstance()
  const updateUnitUseCase = new UpdateUnitUseCase(unitPageRepository)
  return updateUnitUseCase
}
