import { Building2 } from "lucide-react"
import { Button } from "../components/common/Button"

export default function Home() {
  const handleLogin = () => {
    window.location.href = "/fivetuay10bath-frontend/login"
  }

  return (
    <div className="relative flex h-screen w-full items-center justify-start overflow-hidden">
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url("/home-bg.png")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
      </div>

      <div className="relative z-10 ml-12 max-w-xl space-y-6 text-white md:ml-24">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-white/10 p-2 backdrop-blur-sm">
              <Building2 className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">Property Manager</h1>
          </div>

          <p className="text-lg text-gray-200 md:text-xl">
            Modern living spaces designed for your comfort and convenience
          </p>
        </div>

        <Button
          onClick={handleLogin}
          size="lg"
          className="bg-blue-600 px-8 py-6 text-lg font-semibold hover:bg-blue-700"
        >
          Login
        </Button>
      </div>
    </div>
  )
}
