import type { IPaymentsRepository } from "@application/ports/payments.repository.port"
import type { DefaultDto } from "../dtos/default.dto"
import { axiosInstance } from "@infrastructure/libs/axios/axiosInstance"
import type { PaymentsEntity } from "@client/entities/payments.entity"
import type { PaymentsModel } from "@domain/models/payments.model"
import { PaymentsMapper } from "../port/payments.mapper"
import { left, right } from "@shared/either"

export class PaymentsRepository implements IPaymentsRepository {
  private static instance: PaymentsRepository
  public static getInstance(): PaymentsRepository {
    if (!PaymentsRepository.instance) {
      PaymentsRepository.instance = new PaymentsRepository()
    }
    return PaymentsRepository.instance
  }

  async getPayments(dto: DefaultDto): Promise<IPaymentsRepository.getPayments> {
    const {} = dto

    try {
      const url = `/payments`

      const { data } = await axiosInstance.get<PaymentsEntity[]>(url)

      const result: PaymentsModel[] = PaymentsMapper.toDomainArray(data)

      return right(result)
    } catch (error) {
      console.error(error)
      return left(error)
    }
  }
}
