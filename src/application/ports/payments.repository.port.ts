import type { PaymentsModel } from "@domain/models/payments.model"
import type { DefaultDto } from "@infrastructure/inbound/dtos/default.dto"
import type { Either } from "@shared/either"

export interface IPaymentsRepository {
  getPayments: (dto: DefaultDto) => Promise<IPaymentsRepository.getPayments>
}

export namespace IPaymentsRepository {
  export type getPayments = Promise<Either<any, PaymentsModel[]>>
}
