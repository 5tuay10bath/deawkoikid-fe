import type { IContractsRepository } from "@application/ports/contracts.repository.port"
import type { DefaultDto } from "../dtos/default.dto"
import { axiosInstance } from "@infrastructure/libs/axios/axiosInstance"
import type { ContractsModel } from "@domain/models/contracts.model"
import { ContractsMapper } from "../port/contracts.mapper"
import { left, right } from "@shared/either"

export class ContractsRepository implements IContractsRepository {
  private static instance: ContractsRepository
  public static getInstance(): ContractsRepository {
    if (!ContractsRepository.instance) {
      ContractsRepository.instance = new ContractsRepository()
    }
    return ContractsRepository.instance
  }

  async getContracts(dto: DefaultDto): Promise<IContractsRepository.getContracts> {
    const {} = dto

    try {
      const url = `/contracts`

      const { data } = await axiosInstance.get(url)

      const result: ContractsModel[] = ContractsMapper.toDomainArray(data.data)

      return right(result)
    } catch (error) {
      console.error(error)
      return left(error)
    }
  }
}
