import { LogOut, Sparkles, Upload } from "lucide-react"
import { useNavigate } from "react-router-dom"

import { useAuthStore } from "../stores/auth.store"
import { Button } from "../components/common/Button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/common/card"
import { Avatar, AvatarFallback } from "../components/common/Avatar"
import { useState } from "react"
import UploadPaymentDialog from "../components/userDashboardCom/UploadPaymentDialog"

export default function UserDashboard() {
  const { fullName, userEmail, logout } = useAuthStore()
  const navigate = useNavigate()
  const [isUploadOpen, setIsUploadOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  const initials =
    fullName
      ?.split(" ")
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "U"

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="mx-auto max-w-4xl space-y-8 px-4 py-10">
        <Card className="overflow-hidden border-none bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-600 text-white shadow-xl">
          <CardContent className="p-10">
            <div className="space-y-6 text-center">
              <div className="mx-auto inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-blue-100">
                <Sparkles className="h-4 w-4" />
                <span>Welcome</span>
              </div>
              <div className="space-y-3">
                <p className="text-sm text-blue-100">Welcome to your apartment portal</p>
                <h1 className="text-3xl font-semibold leading-tight">We&apos;re glad you&apos;re here</h1>
                <p className="text-blue-100">
                  You're signed in as {fullName ?? "Resident"} ({userEmail ?? "—"})
                </p>
              </div>
              <div className="flex justify-center">
                <Avatar className="h-16 w-16 border border-white/20">
                  <AvatarFallback className="bg-blue-100 text-blue-700">{initials}</AvatarFallback>
                </Avatar>
              </div>
              <div className="flex justify-center">
                <Button
                  variant="outline"
                  className="border-white/60 text-white hover:bg-white/10"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
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
                <p className="mt-4 text-sm text-blue-600"></p>
              </div>

              <div className="rounded-lg border border-gray-200 p-6">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">Quick Actions</h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <Button variant="outline" className="w-full" onClick={() => setIsUploadOpen(true)}>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Payment Proof
                    </Button>
                  </div>
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
          </CardContent>
        </Card>

        <Card className="bg-white/90 shadow-md backdrop-blur">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Thanks for joining us</CardTitle>
            <CardDescription>We&apos;ll add more for you soon</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-gray-700">
            Look around, settle in, and reach out if you need anything. This space will update as new features roll out.
          </CardContent>
        </Card>
      </div>

      <UploadPaymentDialog isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} />
    </div>
  )
}
