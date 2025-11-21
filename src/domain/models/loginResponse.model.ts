import type { UserRole } from "../types/status.types"

export interface LoginResponseData {
  token: string
  email: string
  fullName: string
  role: UserRole
  message: string
}

export interface LoginResponse {
  status: string
  message: string
  data: LoginResponseData
  timestamp: string
}
