import { CreateUnitUseCase } from "@application/usecases/createUnit.usecase"
import { UnitPageRepository } from "../repositories/unitPage.repository"

export const CreateUnitFactory = () => {
  const unitPageRepository = UnitPageRepository.getInstance()
  const createUnitUseCase = new CreateUnitUseCase(unitPageRepository)
  return createUnitUseCase
}
