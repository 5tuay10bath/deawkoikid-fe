import { GetUnitPageUsecase } from "@application/usecases/getUnitPage.usecase"
import { UnitPageRepository } from "../repositories/unitPage.repository"

export const GetUnitPageFactory = () => {
    const unitPageRepository = UnitPageRepository.getInstance()
    const getUnitPageUsecase = new GetUnitPageUsecase(unitPageRepository)
    return getUnitPageUsecase
}