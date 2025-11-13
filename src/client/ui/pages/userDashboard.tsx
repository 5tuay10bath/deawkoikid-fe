import { useAuthStore } from "../stores/auth.store"
import { useNavigate } from "react-router-dom"
import { Button } from "../components/common/Button"

export default function UserDashboard() {
  const { fullName, userEmail, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-2xl rounded-lg bg-white p-8 shadow-lg">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">User Dashboard</h1>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>

        <div className="space-y-4">
          <div className="rounded-lg bg-blue-50 p-6">
            <h2 className="mb-2 text-xl font-semibold text-blue-900">Welcome!</h2>
            <p className="text-blue-700">
              <strong>Name:</strong> {fullName}
            </p>
            <p className="text-blue-700">
              <strong>Email:</strong> {userEmail}
            </p>
            <p className="mt-4 text-sm text-blue-600">This is the user dashboard. More features coming soon...</p>
          </div>

          <div className="rounded-lg border border-gray-200 p-6">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">Quick Actions</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Button variant="outline" className="w-full">
                View My Contracts
              </Button>
              <Button variant="outline" className="w-full">
                Payment History
              </Button>
              <Button variant="outline" className="w-full">
                Maintenance Requests
              </Button>
              <Button variant="outline" className="w-full">
                My Profile
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
