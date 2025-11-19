import { useAuthStore } from "../stores/auth.store"
import { useNavigate } from "react-router-dom"
import { Button } from "../components/common/Button"
import { Upload } from "lucide-react"
import { useRef, useState } from "react"
import { useToast } from "../components/hooks/useToast"

export default function UserDashboard() {
  const { fullName, userEmail, logout } = useAuthStore()
  const navigate = useNavigate()
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid file type",
          description: "Please select an image file (PNG, JPG, etc.)",
          variant: "destructive",
        })
        return
      }

      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB",
          variant: "destructive",
        })
        return
      }

      setSelectedFile(file)
      toast({
        title: "File selected",
        description: `${file.name} is ready to upload`,
      })

      // Logic Upload hub P
    }
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
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
            <p className="mt-4 text-sm text-blue-600"></p>
          </div>

          <div className="rounded-lg border border-gray-200 p-6">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">Quick Actions</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
                <Button variant="outline" className="w-full" onClick={handleUploadClick}>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Payment Proof
                </Button>
                {selectedFile && <p className="mt-2 text-xs text-gray-600 truncate">Selected: {selectedFile.name}</p>}
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
      </div>
    </div>
  )
}
