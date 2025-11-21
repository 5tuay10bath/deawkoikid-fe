import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "../components/common/Button"
import { Input } from "../components/common/Input"
import { Label } from "../components/common/Label"
import { useToast } from "../components/hooks/useToast"
import { useAuthStore } from "../stores/auth.store"

export default function SignUp() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { register, isLoading, error, successMessage, clearMessages } = useAuthStore()

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phone: "",
    identificationNumber: "",
  })

  useEffect(() => {
    if (successMessage) {
      toast({
        title: "Success",
        description: successMessage,
        variant: "default",
      })
      setTimeout(() => {
        clearMessages()
        navigate("/login")
      }, 1500)
    }

    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      })
      clearMessages()
    }
  }, [successMessage, error, navigate, toast, clearMessages])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await register(formData)
  }

  const handleCancel = () => {
    navigate("/login")
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 py-8">
      <div className="w-full max-w-2xl rounded-lg bg-white p-8 shadow-lg">
        <h2 className="mb-6 text-2xl font-semibold text-gray-900">User Information</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="email">
                Email Address <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="User@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">
                Password <span className="text-red-500">*</span>
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">
                First name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="firstName"
                name="firstName"
                type="text"
                placeholder="User's Firstname"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">
                Last name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="lastName"
                name="lastName"
                type="text"
                placeholder="User's Lastname"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="identificationNumber">
                Identification Number <span className="text-red-500">*</span>
              </Label>
              <Input
                id="identificationNumber"
                name="identificationNumber"
                type="text"
                placeholder="Identification Number 13 digits"
                value={formData.identificationNumber}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">
                Phone number <span className="text-red-500">*</span>
              </Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="012-345-6789"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={handleCancel} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
