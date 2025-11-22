import type { IPaymentsRepository } from "@application/ports/payments.repository.port"
import type { CreatePaymentDto } from "../dtos/createPayment.dto"
import type { DefaultDto } from "../dtos/default.dto"
import { axiosInstance } from "@infrastructure/libs/axios/axiosInstance"
import type { PaymentsModel } from "@domain/models/payments.model"
import type { ApiResponse } from "@domain/models/apiResponse.model"
import { PaymentsMapper } from "../port/payments.mapper"
import { left, right } from "@shared/either"
import { cookieUtils } from "@shared/utils/cookie.utils"
import { jwtUtils } from "@shared/utils/jwt.utils"

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
      const token = cookieUtils.getAuthToken()
      const role = token ? jwtUtils.getRoleFromToken(token) : null
      const userId = token ? jwtUtils.getIdFromToken(token) : null

      // Tenants/users fetch only their invoices via public endpoint
      const isTenant = role === "TENANT" || role === "USER"
      const url = isTenant ? `/public/invoices` : `/invoices`

      const { data } = await axiosInstance.get(url, {
        params: isTenant && userId ? { userId, userid: userId } : undefined,
      })

      const result: PaymentsModel[] = PaymentsMapper.toDomainArray(data.data)

      return right(result)
    } catch (error) {
      console.error(error)
      return left(error)
    }
  }

  async createPayment(dto: CreatePaymentDto): Promise<IPaymentsRepository.createPayment> {
    try {
      const url = `/invoices`

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
}
