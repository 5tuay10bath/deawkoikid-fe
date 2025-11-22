import { jwtDecode } from "jwt-decode"

type JWTRole = "ADMIN" | "USER" | "TENANT" | "STAFF"
type JWTId = string
interface JWTPayload {
  sub: string
  role: JWTRole
  userId: JWTId
  iat: number
  exp: number
}

export const jwtUtils = {
  decodeToken: (token: string): JWTPayload | null => {
    try {
      const decoded = jwtDecode<JWTPayload>(token)
      return decoded
    } catch {
      return null
    }
  },

  isTokenExpired: (token: string): boolean => {
    try {
      const decoded = jwtDecode<JWTPayload>(token)
      const currentTime = Date.now() / 1000
      return decoded.exp < currentTime
    } catch {
      return true
    }
  },

  getRoleFromToken: (token: string): JWTRole | null => {
    try {
      const decoded = jwtDecode<JWTPayload>(token)
      return decoded.role
    } catch {
      return null
    }
  },
  getIdFromToken: (token: string): string | null => {
    try {
      const decoded = jwtDecode<JWTPayload>(token)
      return decoded.userId
    } catch {
      return null
    }
  },
  getEmailFromToken: (token: string): string | null => {
    try {
      const decoded = jwtDecode<JWTPayload>(token)
      return decoded.sub
    } catch {
      return null
    }
  },

  isValidToken: (token: string): boolean => {
    if (!token) return false
    if (jwtUtils.isTokenExpired(token)) return false
    const decoded = jwtUtils.decodeToken(token)
    return decoded !== null
  },
}
