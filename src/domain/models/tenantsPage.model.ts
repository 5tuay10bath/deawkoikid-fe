export interface TenantsPageModel {
  id: string
  fullName: string
  phone: string
  email: string
  role: "tenant" | "staff" | "admin"
  identificationNumber: string
  profileImageUrl: string
  birthDate: Date
  active: boolean
  emergencyContactName: string
  emergencyContactPhone: string
}
