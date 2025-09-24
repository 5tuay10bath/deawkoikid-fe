import type { IUnitPageRepository } from "@application/ports/unitPage.repository.port";
import type { IGetUnitPageUsecase } from "@domain/ports/getUnitPage.usecase.port";
import type { GetUnitDto } from "@infrastructure/inbound/dtos/unitPage.dto";
import { left, right } from "@shared/either";

export class GetUnitPageUsecase implements IGetUnitPageUsecase {
    private readonly unitPageRepository: IUnitPageRepository;

    constructor(unitPageRepository: IUnitPageRepository) {
        this.unitPageRepository = unitPageRepository;
    }

    async handler(dto: GetUnitDto): IGetUnitPageUsecase.output {
        const result = await this.unitPageRepository.getUnitPage(dto);

        if (result.isRight()){
            return right(result.value);
        }
        return left(result.value);
    }
}