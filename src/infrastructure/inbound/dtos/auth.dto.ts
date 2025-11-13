export interface RegisterDto {
  email: string
  password: string
  firstName: string
  lastName: string
  phone: string
  identificationNumber: string
}

export interface LoginDto {
  email: string
  password: string
}
