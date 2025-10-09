import type { PaymentsModel } from "@domain/models/payments.model"
import type { DefaultDto } from "@infrastructure/inbound/dtos/default.dto"
import type { Either } from "@shared/either"

export interface IGetPaymentsUsecase {
  handler: (dto: DefaultDto) => IGetPaymentsUsecase.output
}

export namespace IGetPaymentsUsecase {
  export type output = Promise<Either<any, PaymentsModel[]>>
}
