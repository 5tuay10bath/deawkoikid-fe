import type { TenantsPageEntity } from "@client/entities/tenantsPage.entity"
import type { TenantsPageModel } from "@domain/models/tenantsPage.model"
import { StrictBuilder } from "builder-pattern"

export class TenantsPageMapper {
  static toDomain(tenantsPageEntity: TenantsPageEntity): TenantsPageModel {
    return StrictBuilder<TenantsPageModel>()
      .id(tenantsPageEntity.id)
      .name(tenantsPageEntity.name)
      .email(tenantsPageEntity.email)
      .phone(tenantsPageEntity.phone)
      .emergencyContact(tenantsPageEntity.emergencyContact)
      .emergencyPhone(tenantsPageEntity.emergencyPhone)
      .unitNumber(tenantsPageEntity.unitNumber)
      .checkIn(tenantsPageEntity.checkIn)
      .checkOut(tenantsPageEntity.checkOut)
      .rentAmount(tenantsPageEntity.rentAmount)
      .billingCycle(tenantsPageEntity.billingCycle)
      .securityDeposit(tenantsPageEntity.securityDeposit)
      .status(tenantsPageEntity.status)
      .build()
  }

  static toDomainArray(tenantsPageEntities: TenantsPageEntity[]): TenantsPageModel[] {
    if (!Array.isArray(tenantsPageEntities)) {
      console.error("Expected array but received:", typeof tenantsPageEntities)
      return []
    }

    return tenantsPageEntities.map((entity) => this.toDomain(entity))
  }
}
