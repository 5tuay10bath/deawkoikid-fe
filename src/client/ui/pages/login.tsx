import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "../components/common/Button"
import { Input } from "../components/common/Input"
import { Label } from "../components/common/Label"
import { useToast } from "../components/hooks/useToast"
import { useAuthStore } from "../stores/auth.store"
import { cookieUtils } from "@shared/utils/cookie.utils"
import { jwtUtils } from "@shared/utils/jwt.utils"

export default function Login() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { login, isLoading, error, successMessage, clearMessages } = useAuthStore()

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  // Handle success/error messages
  useEffect(() => {
    const token = cookieUtils.getAuthToken()
    if (token != null) {
      const role: string | null = token ? jwtUtils.getRoleFromToken(token) : null
      if (role === "USER") {
        navigate("/user/dashboard", { replace: true })
        return
      }
      if (role === "TENANT") {
        navigate("/tenant/dashboard", { replace: true })
        return
      }
      if (role === "ADMIN") {
        navigate("/dashboard", { replace: true })
        return
      }
    }
    if (successMessage) {
      toast({
        title: "Success",
        description: successMessage,
        variant: "default",
      })
      clearMessages()
    }

    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      })
      clearMessages()
    }
  }, [successMessage, error, toast, clearMessages, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = await login(formData)

    if (result.success) {
      // Navigate immediately before showing toast
      if (result.role === "ADMIN") {
        navigate("/dashboard")
      } else if (result.role === "TENANT") {
        navigate("/tenant/dashboard")
      } else {
        navigate("/user/dashboard")
      }
    }
  }

  const handleSignUp = () => {
    navigate("/signup")
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <h1 className="mb-8 text-center text-3xl font-bold text-blue-600">Property Manager</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="w-full"
              data-cy="email-input"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              className="w-full"
              data-cy="password-input"
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700"
            data-cy="login-button"
          >
            {isLoading ? "Logging in..." : "Log In"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          If you don't have account sign up{" "}
          <button onClick={handleSignUp} className="font-medium text-blue-600 hover:underline">
            here
          </button>
        </p>
      </div>
    </div>
  )
}
