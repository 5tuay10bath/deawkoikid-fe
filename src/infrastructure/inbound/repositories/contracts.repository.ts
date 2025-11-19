import type { IContractsRepository } from "@application/ports/contracts.repository.port"
import type { CreateContractDto } from "../dtos/createContract.dto"
import type { UpdateContractDto } from "../dtos/updateContract.dto"
import type { DefaultDto } from "../dtos/default.dto"
import { axiosInstance } from "@infrastructure/libs/axios/axiosInstance"
import type { ContractsModel, CreateUnitModel, CreateUserModel } from "@domain/models/contracts.model"
import type { ApiResponse } from "@domain/models/apiResponse.model"
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

  async createContract(dto: CreateContractDto): Promise<IContractsRepository.createContract> {
    try {
      const url = `/contracts`

      const { data } = await axiosInstance.post(url, dto)

      const result: ApiResponse = {
        status: data.status,
        message: data.message,
        timestamp: data.timestamp,
      }

      return right(result)
    } catch (error) {
      console.error(error)
      return left(error)
    }
  }

  async updateContract(dto: UpdateContractDto): Promise<IContractsRepository.updateContract> {
    try {
      const url = `/contracts/${dto.id}`

      const { data } = await axiosInstance.put(url, dto)

      const result: ApiResponse = {
        status: data.status,
        message: data.message,
        timestamp: data.timestamp,
      }

      return right(result)
    } catch (error) {
      console.error(error)
      return left(error)
    }
  }

  async getCreateUnits(dto: DefaultDto): Promise<IContractsRepository.getCreateUnits> {
    const {} = dto

    try {
      const url = `/contracts/create/units`

      const { data } = await axiosInstance.get(url)

      const result: CreateUnitModel[] = data.data.map((item: any) => ({
        id: item.id,
        address: item.unitNumber || item.address || item.id,
      }))

      return right(result)
    } catch (error) {
      console.error("getCreateUnits error:", error)
      return left(error)
    }
  }

  async getCreateUsers(dto: DefaultDto): Promise<IContractsRepository.getCreateUsers> {
    const {} = dto

    try {
      const url = `/contracts/create/users`

      const { data } = await axiosInstance.get(url)

      const result: CreateUserModel[] = data.data.map((item: any) => ({
        id: item.id,
        email: item.email,
      }))

      return right(result)
    } catch (error) {
      console.error(error)
      return left(error)
    }
  }
}
