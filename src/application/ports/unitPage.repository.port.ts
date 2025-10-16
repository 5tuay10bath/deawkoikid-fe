import type { UnitPageModel } from "@domain/models/unitPage.model"
import type { ApiResponse } from "@domain/models/apiResponse.model"
import type { DefaultDto } from "@infrastructure/inbound/dtos/default.dto"
import type { CreateUnitDto } from "@infrastructure/inbound/dtos/createUnit.dto"
import type { Either } from "@shared/either"

export type { CreateUnitDto }

export interface IUnitPageRepository {
  getUnitPage: (dto: DefaultDto) => Promise<IUnitPageRepository.getUnitPage>
  createUnit: (dto: CreateUnitDto) => Promise<IUnitPageRepository.createUnit>
}

export namespace IUnitPageRepository {
  export type getUnitPage = Promise<Either<any, UnitPageModel[]>>
  export type createUnit = Promise<Either<any, ApiResponse>>
}
