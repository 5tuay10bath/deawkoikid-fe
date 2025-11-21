export interface CreateTenantDto {
  firstName: string
  lastName: string
  phone: string
  email: string
  password: string
  role?: "USER" | "ADMIN" | "TENANT" | "STAFF"
  identificationNumber: string
  birthDate?: string // ISO date string
  emergencyContactName?: string
  emergencyContactPhone?: string
}
