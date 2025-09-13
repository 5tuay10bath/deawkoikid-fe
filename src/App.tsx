import { PanelsTopLeft } from "lucide-react"
import { useState } from "react"
import { Routes, Route } from "react-router-dom"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@client/ui/components/mock/card"
import { Separator } from "@client/ui/components/Separator"
import Sidebar from "@client/ui/components/Sidebar"
import Dashboard from "@client/ui/pages/dashboard"
import Payments from "@client/ui/pages/payments"
import Tenants from "@client/ui/pages/tenants"
import Units from "@client/ui/pages/units"

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
          <Route
            path="/"
            element={
              <Card className="w-1/3">
                <CardHeader>
                  <CardTitle>Title</CardTitle>
                  <CardDescription>Description</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Content</p>
                </CardContent>
                <CardFooter>
                  <button className="rounded bg-blue-500 px-3 py-1 text-white">Some button</button>
                </CardFooter>
              </Card>
            }
          />
        </Routes>
      </main>
    </div>
  )
}
