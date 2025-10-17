import { CreateContractUseCase } from "@application/usecases/createContract.usecase"
import { ContractsRepository } from "../repositories/contracts.repository"

export const CreateContractFactory = () => {
  const contractsRepository = ContractsRepository.getInstance()
  const createContractUseCase = new CreateContractUseCase(contractsRepository)
  return createContractUseCase
}
