import { GetContractsUsecase } from "@application/usecases/getContracts.usecase"
import { ContractsRepository } from "../repositories/contracts.repository"

export const GetContractsFactory = () => {
  const contractsRepository = ContractsRepository.getInstance()
  const getContractsUsecase = new GetContractsUsecase(contractsRepository)
  return getContractsUsecase
}
