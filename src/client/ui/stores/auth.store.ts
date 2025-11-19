import { create } from "zustand"
import { AuthRepository } from "@infrastructure/inbound/repositories/auth.repository"
import { RegisterUseCase } from "@application/usecases/register.usecase"
import { LoginUseCase } from "@application/usecases/login.usecase"
import type { RegisterDto, LoginDto } from "@application/ports/auth.repository.port"
import { cookieUtils } from "@shared/utils/cookie.utils"
import { jwtUtils } from "@shared/utils/jwt.utils"

interface AuthState {
  isLoading: boolean
  error: string | null
  successMessage: string | null
  userRole: string | null
  userEmail: string | null
  fullName: string | null
  isAuthenticated: boolean
  register: (dto: RegisterDto) => Promise<boolean>
  login: (dto: LoginDto) => Promise<{ success: boolean; role?: string }>
  logout: () => void
  checkAuth: () => void
  clearMessages: () => void
}

const authRepository = AuthRepository.getInstance()
const registerUseCase = new RegisterUseCase(authRepository)
const loginUseCase = new LoginUseCase(authRepository)

// Initialize state by checking JWT token instead of cookie
const initializeAuth = () => {
  const token = cookieUtils.getAuthToken()
  if (token && jwtUtils.isValidToken(token)) {
    const role = jwtUtils.getRoleFromToken(token)
    const email = jwtUtils.getEmailFromToken(token)
    return {
      isAuthenticated: true,
      userRole: role,
      userEmail: email,
      fullName: cookieUtils.getFullName(),
    }
  }
  return {
    isAuthenticated: false,
    userRole: null,
    userEmail: null,
    fullName: null,
  }
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoading: false,
  error: null,
  successMessage: null,
  ...initializeAuth(),

  register: async (dto: RegisterDto) => {
    set({ isLoading: true, error: null, successMessage: null })
    try {
      const result = await registerUseCase.execute(dto)

      if (result.isRight()) {
        const response = result.value
        set({
          isLoading: false,
          successMessage: response.message || "Registered successfully",
        })
        return true
      } else {
        const error = result.value
        set({
          isLoading: false,
          error: error?.message || "Registration failed",
        })
        return false
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred"
      set({
        isLoading: false,
        error: errorMessage,
      })
      return false
    }
  },

  login: async (dto: LoginDto) => {
    set({ isLoading: true, error: null, successMessage: null })
    try {
      const result = await loginUseCase.execute(dto)

      if (result.isRight()) {
        const response = result.value

        // Save token to cookies
        cookieUtils.setAuthToken(response.data.token)
        cookieUtils.setFullName(response.data.fullName)

        // Get role and email from JWT token (not from response directly)
        const roleFromToken = jwtUtils.getRoleFromToken(response.data.token)
        const emailFromToken = jwtUtils.getEmailFromToken(response.data.token)

        set({
          isLoading: false,
          successMessage: response.message || "Login successful",
          userRole: roleFromToken,
          userEmail: emailFromToken,
          fullName: response.data.fullName,
          isAuthenticated: true,
        })

        return { success: true, role: roleFromToken || undefined }
      } else {
        const error = result.value
        set({
          isLoading: false,
          error: error?.message || "Login failed",
        })
        return { success: false }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred"
      set({
        isLoading: false,
        error: errorMessage,
      })
      return { success: false }
    }
  },

  logout: () => {
    cookieUtils.clearAuth()
    set({
      userRole: null,
      userEmail: null,
      fullName: null,
      isAuthenticated: false,
      error: null,
      successMessage: null,
    })
  },

  checkAuth: () => {
    const token = cookieUtils.getAuthToken()

    // Validate token and get role from JWT
    if (token && jwtUtils.isValidToken(token)) {
      const role = jwtUtils.getRoleFromToken(token)
      const email = jwtUtils.getEmailFromToken(token)
      const fullName = cookieUtils.getFullName()

      set({
        isAuthenticated: true,
        userRole: role,
        userEmail: email,
        fullName: fullName,
      })
    } else {
      // Token is invalid or expired, clear everything
      cookieUtils.clearAuth()
      set({
        isAuthenticated: false,
        userRole: null,
        userEmail: null,
        fullName: null,
      })
    }
  },

  clearMessages: () => {
    set({ error: null, successMessage: null })
  },
}))
