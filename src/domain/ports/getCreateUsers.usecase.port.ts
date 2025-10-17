import type { CreateUserModel } from "@domain/models/contracts.model"
import type { DefaultDto } from "@infrastructure/inbound/dtos/default.dto"
import type { Either } from "@shared/either"

export interface IGetCreateUsersUsecase {
  handler: (dto: DefaultDto) => IGetCreateUsersUsecase.output
}

export namespace IGetCreateUsersUsecase {
  export type output = Promise<Either<any, CreateUserModel[]>>
}
