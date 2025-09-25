import type { IUnitPageRepository } from "@application/ports/unitPage.repository.port";
import type { DefaultDto } from "../dtos/default.dto";
import { axiosInstance } from "@infrastructure/libs/axios/axiosInstance";
import type { UnitPageEntity } from "@client/entities/unitPage.entity";
import type { UnitPageModel } from "@domain/models/unitPage.model";
import { UnitPageMapper } from "../port/unitPage.mapper";
import { left, right } from "@shared/either";

export class UnitPageRepository implements IUnitPageRepository {
    private static instance: UnitPageRepository;
    public static getInstance(): UnitPageRepository {
        if (!UnitPageRepository.instance) {
            UnitPageRepository.instance = new UnitPageRepository();
        }
        return UnitPageRepository.instance;
    }

    async getUnitPage(dto: DefaultDto): Promise<IUnitPageRepository.getUnitPage> {
        const {} = dto;

        try {
            const url = `/units`

            const {data} = await axiosInstance.get<UnitPageEntity[]>(url);

            const result: UnitPageModel[] = UnitPageMapper.toDomainArray(data);

            return right(result);
        } catch (error) {
            console.error(error);
            return left(error);
        }
    }
}