import type { TenantsPageEntity } from "@client/entities/tenantsPage.entity"
import type { TenantsPageModel } from "@domain/models/tenantsPage.model"
import { StrictBuilder } from "builder-pattern"

export class TenantsPageMapper {
  static toDomain(tenantsPageEntity: TenantsPageEntity): TenantsPageModel {
    return StrictBuilder<TenantsPageModel>()
      .id(tenantsPageEntity.id)
      .fullName(tenantsPageEntity.fullName)
      .phone(tenantsPageEntity.phone)
      .email(tenantsPageEntity.email)
      .identificationNumber(tenantsPageEntity.identificationNumber)
      .profileImageUrl(tenantsPageEntity.profileImageUrl)
      .birthDate(tenantsPageEntity.birthDate)
      .active(tenantsPageEntity.active)
      .role(tenantsPageEntity.role)
      .emergencyContactName(tenantsPageEntity.emergencyContactName)
      .emergencyContactPhone(tenantsPageEntity.emergencyContactPhone)
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
