import { GetCreateUsersUsecase } from "@application/usecases/getCreateUsers.usecase"
import { ContractsRepository } from "../repositories/contracts.repository"

export const GetCreateUsersFactory = () => {
  const contractsRepository = ContractsRepository.getInstance()
  const getCreateUsersUsecase = new GetCreateUsersUsecase(contractsRepository)
  return getCreateUsersUsecase
}
