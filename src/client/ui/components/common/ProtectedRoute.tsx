import { Navigate } from "react-router-dom"
import { useAuthStore } from "../../stores/auth.store"
import { useEffect, useState } from "react"
import { cookieUtils } from "@shared/utils/cookie.utils"
import { jwtUtils } from "@shared/utils/jwt.utils"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: "ADMIN" | "USER" | "TENANT"
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
      // Admin-only route hit by non-admin
      if (requiredRole === "ADMIN" && roleFromToken && roleFromToken !== "ADMIN") {
        if (roleFromToken === "USER") return <Navigate to="/user/dashboard" replace />
        if (roleFromToken === "TENANT") return <Navigate to="/tenant/dashboard" replace />
      }
      // User-only route hit by other roles
      if (requiredRole === "USER") {
        if (roleFromToken === "ADMIN") return <Navigate to="/dashboard" replace />
        if (roleFromToken === "TENANT") return <Navigate to="/tenant/dashboard" replace />
      }
      // Tenant-only route hit by other roles
      if (requiredRole === "TENANT") {
        if (roleFromToken === "ADMIN") return <Navigate to="/dashboard" replace />
        if (roleFromToken === "USER") return <Navigate to="/user/dashboard" replace />
      }
      return <Navigate to="/login" replace />
    }
  } else {
    // No token but marked as authenticated? Force logout
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
