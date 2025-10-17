export interface UpdateTenantDto {
  id: string
  firstName: string
  lastName: string
  phone: string
  birthDate: Date
  active: boolean
  emergencyContactName: string
  emergencyContactPhone: string
}
