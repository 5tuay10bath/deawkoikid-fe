import type { UserRole } from "../types/status.types"

export interface TenantsPageModel {
  id: string
  fullName: string
  phone: string
  email: string
  identificationNumber: string
  profileImageUrl: string | null
  role: UserRole
  birthDate: string
  active: boolean
  emergencyContactName: string | null
  emergencyContactPhone: string | null
}
