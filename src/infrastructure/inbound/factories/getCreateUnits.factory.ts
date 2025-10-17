import { GetCreateUnitsUsecase } from "@application/usecases/getCreateUnits.usecase"
import { ContractsRepository } from "../repositories/contracts.repository"

export const GetCreateUnitsFactory = () => {
  const contractsRepository = ContractsRepository.getInstance()
  const getCreateUnitsUsecase = new GetCreateUnitsUsecase(contractsRepository)
  return getCreateUnitsUsecase
}
