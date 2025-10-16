import type { PaymentsModel } from "@domain/models/payments.model"
import type { ApiResponse } from "@domain/models/apiResponse.model"
import type { DefaultDto } from "@infrastructure/inbound/dtos/default.dto"
import type { CreatePaymentDto } from "@infrastructure/inbound/dtos/createPayment.dto"
import type { Either } from "@shared/either"

export type { CreatePaymentDto }

export interface IPaymentsRepository {
  getPayments: (dto: DefaultDto) => Promise<IPaymentsRepository.getPayments>
  createPayment: (dto: CreatePaymentDto) => Promise<IPaymentsRepository.createPayment>
}

export namespace IPaymentsRepository {
  export type getPayments = Promise<Either<any, PaymentsModel[]>>
  export type createPayment = Promise<Either<any, ApiResponse>>
}
