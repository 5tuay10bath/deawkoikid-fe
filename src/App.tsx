import { PanelsTopLeft } from "lucide-react"
import { useState } from "react"
import { Routes, Route } from "react-router-dom"

import { Separator } from "@client/ui/components/common/Separator"
import Sidebar from "@client/ui/components/common/Sidebar"
import { Toaster } from "@client/ui/components/common/Toaster"
import ProtectedRoute from "@client/ui/components/common/ProtectedRoute"
import Dashboard from "@client/ui/pages/dashboard"
import Payments from "@client/ui/pages/payments"
import Tenants from "@client/ui/pages/tenants"
import Units from "@client/ui/pages/units"
import Contracts from "@client/ui/pages/contracts"
import NotFound from "@client/ui/pages/notFound"
import Maintenance from "@client/ui/pages/maintenance"
import CheckIn from "@client/ui/pages/checkIn"
import RoomDetails from "@client/ui/pages/roomDetail"
import Home from "@client/ui/pages/home"
import Login from "@client/ui/pages/login"
import SignUp from "@client/ui/pages/signUp"
import UserDashboard from "@client/ui/pages/userDashboard"
import TenantDashboard from "@client/ui/pages/tenantDashboard"
import Buildings from "@client/ui/pages/building"
import TenantInvoices from "@client/ui/pages/tenantInvoices"

function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className="flex min-h-screen">
      <Sidebar collapsed={sidebarCollapsed} />
      <main className="flex-1 p-4 pt-16 md:p-6 md:pt-6">
        <button className="hidden md:block" onClick={() => setSidebarCollapsed(!sidebarCollapsed)}>
          <PanelsTopLeft className="color-grey-400 w-[20px]" />
        </button>
        <Separator className="hidden md:block" />
        {children}
      </main>
    </div>
  )
}

function ClientLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen">{children}</div>
}

export default function App() {
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <ClientLayout>
              <Home />
            </ClientLayout>
          }
        />
        <Route
          path="/home"
          element={
            <ClientLayout>
              <Home />
            </ClientLayout>
          }
        />
        <Route
          path="/login"
          element={
            <ClientLayout>
              <Login />
            </ClientLayout>
          }
        />
        <Route
          path="/signup"
          element={
            <ClientLayout>
              <SignUp />
            </ClientLayout>
          }
        />

        {/* User Routes - Protected */}
        <Route
          path="/user/dashboard"
          element={
            <ClientLayout>
              <ProtectedRoute requiredRole="USER">
                <UserDashboard />
              </ProtectedRoute>
            </ClientLayout>
          }
        />
        <Route
          path="/tenant/invoices"
          element={
            <ClientLayout>
              <ProtectedRoute requiredRole="TENANT">
                <TenantInvoices />
              </ProtectedRoute>
            </ClientLayout>
          }
        />
        <Route
          path="/tenant/dashboard"
          element={
            <ClientLayout>
              <ProtectedRoute requiredRole="TENANT">
                <TenantDashboard />
              </ProtectedRoute>
            </ClientLayout>
          }
        />
        <Route
          path="/tenant/payments"
          element={
            <ClientLayout>
              <ProtectedRoute requiredRole="TENANT">
                <Payments />
              </ProtectedRoute>
            </ClientLayout>
          }
        />

        {/* Admin Routes - With Sidebar - Protected */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <AdminLayout>
                <Dashboard />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/buildings"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <AdminLayout>
                <Buildings />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/units"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <AdminLayout>
                <Units />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/tenants"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <AdminLayout>
                <Tenants />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/contracts"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <AdminLayout>
                <Contracts />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/maintenance"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <AdminLayout>
                <Maintenance />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/payments"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <AdminLayout>
                <Payments />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/check-in/:roomId"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <AdminLayout>
                <CheckIn />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/room/:roomId"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <AdminLayout>
                <RoomDetails />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route
          path="*"
          element={
            <ClientLayout>
              <NotFound />
            </ClientLayout>
          }
        />
      </Routes>
      <Toaster />
    </>
  )
}
