import { UpdateContractUseCase } from "@application/usecases/updateContract.usecase"
import { ContractsRepository } from "../repositories/contracts.repository"

export const UpdateContractFactory = () => {
  const contractsRepository = ContractsRepository.getInstance()
  const updateContractUseCase = new UpdateContractUseCase(contractsRepository)
  return updateContractUseCase
}
