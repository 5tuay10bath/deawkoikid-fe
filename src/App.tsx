import { PanelsTopLeft } from "lucide-react"
import { useState } from "react"
import { Routes, Route } from "react-router-dom"

import { Separator } from "@client/ui/components/common/Separator"
import Sidebar from "@client/ui/components/common/Sidebar"
import Dashboard from "@client/ui/pages/dashboard"
import Payments from "@client/ui/pages/payments"
import Tenants from "@client/ui/pages/tenants"
import Units from "@client/ui/pages/units"
import Contracts from "@client/ui/pages/contracts"
import NotFound from "@client/ui/pages/notFound"
import Maintenance from "@client/ui/pages/maintenance"
import CheckIn from "@client/ui/pages/checkIn"
import RoomDetails from "@client/ui/pages/roomDetail"

export default function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  return (
    <div className="flex min-h-screen">
      <Sidebar collapsed={sidebarCollapsed} />
      <main className="flex-1 p-4 pt-16 md:p-6 md:pt-6">
        <button className="hidden md:block" onClick={() => setSidebarCollapsed(!sidebarCollapsed)}>
          <PanelsTopLeft className="color-grey-400 w-[20px]" />
        </button>
        <Separator className="hidden md:block" />
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/units" element={<Units />} />
          <Route path="/tenants" element={<Tenants />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/contracts" element={<Contracts />} />
          <Route path="/maintenance" element={<Maintenance />} />
          <Route path="/check-in/:roomId" element={<CheckIn />} />
          <Route path="/room/:roomId" element={<RoomDetails />} />
          <Route path="/" element={<h1 className="text-[20px] font-bold">welcome</h1>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  )
}
