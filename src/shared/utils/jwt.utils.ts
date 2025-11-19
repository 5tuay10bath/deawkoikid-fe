import { jwtDecode } from "jwt-decode"

interface JWTPayload {
  sub: string
  role: "ADMIN" | "USER"
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

  getRoleFromToken: (token: string): "ADMIN" | "USER" | null => {
    try {
      const decoded = jwtDecode<JWTPayload>(token)
      return decoded.role
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
