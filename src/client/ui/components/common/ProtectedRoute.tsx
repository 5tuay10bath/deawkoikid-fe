import { Navigate } from "react-router-dom"
import { useAuthStore } from "../../stores/auth.store"
import { useEffect, useState } from "react"
import { cookieUtils } from "@shared/utils/cookie.utils"
import { jwtUtils } from "@shared/utils/jwt.utils"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: "ADMIN" | "USER"
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { isAuthenticated, userRole, checkAuth } = useAuthStore()
  const [isValidating, setIsValidating] = useState(true)

  useEffect(() => {
    // Re-validate on every mount
    const token = cookieUtils.getAuthToken()

    // Double check: validate token and role from JWT
    if (token && jwtUtils.isValidToken(token)) {
      const roleFromToken = jwtUtils.getRoleFromToken(token)

      // If role in store doesn't match token, force checkAuth
      if (roleFromToken !== userRole) {
        checkAuth()
      }
    } else {
      // Token is invalid or missing, force checkAuth
      checkAuth()
    }

    setIsValidating(false)
  }, [checkAuth, userRole])

  // Show loading while validating
  if (isValidating) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-gray-500">Validating...</div>
      </div>
    )
  }

  // Not authenticated - redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // Verify role from JWT token (final check)
  const token = cookieUtils.getAuthToken()
  if (token) {
    const roleFromToken = jwtUtils.getRoleFromToken(token)

    // Check role if required
    if (requiredRole && roleFromToken !== requiredRole) {
      // If user is not admin but trying to access admin route
      if (requiredRole === "ADMIN" && roleFromToken === "USER") {
        return <Navigate to="/user/dashboard" replace />
      }
      // If admin trying to access user route
      if (requiredRole === "USER" && roleFromToken === "ADMIN") {
        return <Navigate to="/dashboard" replace />
      }
      // Unknown role - redirect to login
      return <Navigate to="/login" replace />
    }
  } else {
    // No token but marked as authenticated? Force logout
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
