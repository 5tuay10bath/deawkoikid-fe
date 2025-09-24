import type { UnitPageModel } from "@domain/models/unitPage.model";
import type { GetUnitDto } from "@infrastructure/inbound/dtos/unitPage.dto";
import type { Either } from "@shared/either";

export interface IUnitPageRepository {
    getUnitPage: (dto: GetUnitDto) => Promise<IUnitPageRepository.getUnitPage>
}

export namespace IUnitPageRepository {
    export type getUnitPage = Promise<Either<any, UnitPageModel[]>>
}