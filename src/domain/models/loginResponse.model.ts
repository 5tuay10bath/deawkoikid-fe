export interface LoginResponseData {
  token: string
  email: string
  fullName: string
  role: "USER" | "ADMIN"
  message: string
}

export interface LoginResponse {
  status: string
  message: string
  data: LoginResponseData
  timestamp: string
}
