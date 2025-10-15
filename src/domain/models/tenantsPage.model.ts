export interface TenantsPageModel {
  id: string
  fullName: string
  phone: string
  email: string
  identificationNumber: string
  profileImageUrl: string | null
  birthDate: string
  active: boolean
  emergencyContactName: string | null
  emergencyContactPhone: string | null
}
