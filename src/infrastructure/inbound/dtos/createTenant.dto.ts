export interface CreateTenantDto {
  firstName: string
  lastName: string
  phone: string
  email: string
  password: string
  active: boolean
  birthDate: Date
  identificationNumber: string
  emergencyContactName: string
  emergencyContactPhone: string
}
