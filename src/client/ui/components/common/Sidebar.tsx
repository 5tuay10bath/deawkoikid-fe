import { LayoutDashboard, Building2, Users, CreditCard, FileText, Wrench, Menu, X, LogOut } from "lucide-react"
import React, { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useAuthStore } from "../../stores/auth.store"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./Dialog"
import { Button } from "./Button"

import { cn } from "src/infrastructure/libs/cn/cn"

type Props = {
  collapsed?: boolean
}

type MobileSidebarProps = {
  isOpen: boolean
  onToggle: () => void
  children: React.ReactNode
}

const MobileSidebar: React.FC<MobileSidebarProps> = ({ isOpen, onToggle, children }) => {
  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={onToggle}
        className="fixed left-4 top-4 z-50 rounded-lg border border-gray-200 bg-white p-2 shadow-lg md:hidden"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Mobile sidebar overlay */}
      {isOpen && <div className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden" onClick={onToggle} />}

      {/* Mobile sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen border-r border-gray-200 bg-gray-50 transition-transform md:hidden",
          "w-1/2",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "flex flex-col overflow-hidden", // flex column layout
        )}
      >
        {children}
      </aside>
    </>
  )
}

const NavItem = ({
  to,
  label,
  icon,
  collapsed,
}: {
  to: string
  label: string
  icon: React.ReactNode
  collapsed: boolean
}) => {
  const location = useLocation()
  const active = location.pathname === to

  return (
    <li>
      <Link
        to={to}
        data-cy={`nav-${label.toLowerCase()}`}
        className={cn(
          "flex items-center gap-3 rounded-lg px-4 py-2 transition-colors",
          active ? "bg-white ring-2 ring-indigo-300" : "hover:bg-gray-300",
          collapsed && "justify-center px-2",
          "text-sm md:text-base",
        )}
      >
        <span className="text-gray-500">{icon}</span>
        {!collapsed && <span className="text-base text-gray-700">{label}</span>}
      </Link>
    </li>
  )
}

const Sidebar: React.FC<Props> = ({ collapsed = false }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)
  const { fullName, userEmail, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogoutClick = () => {
    setShowLogoutDialog(true)
  }

  const handleLogoutConfirm = () => {
    logout()
    setShowLogoutDialog(false)
    navigate("/login")
  }

  const handleLogoutCancel = () => {
    setShowLogoutDialog(false)
  }

  const getInitials = (name: string | null) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  const sidebarContent = (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Header and Navigation */}
      <div className="p-4">
        {!collapsed && (
          <div className="px-2 pb-3 text-2xl font-extrabold tracking-tight text-blue-600">Property Manager</div>
        )}

        {!collapsed && <div className="px-2 py-1 text-sm font-bold text-gray-400">Navigation</div>}

        <ul className="mt-2 space-y-1">
          <NavItem
            to="/dashboard"
            label="Dashboard"
            collapsed={collapsed}
            icon={<LayoutDashboard className="h-5 w-5" />}
          />
          <NavItem to="/units" label="Units" collapsed={collapsed} icon={<Building2 className="h-5 w-5" />} />
          <NavItem to="/tenants" label="Tenants" collapsed={collapsed} icon={<Users className="h-5 w-5" />} />
          <NavItem to="/payments" label="Payments" collapsed={collapsed} icon={<CreditCard className="h-5 w-5" />} />
          <NavItem to="/contracts" label="Contracts" collapsed={collapsed} icon={<FileText className="h-5 w-5" />} />
          <NavItem to="/maintenance" label="Maintenance" collapsed={collapsed} icon={<Wrench className="h-5 w-5" />} />
        </ul>
      </div>

      {/* Spacer - Push user profile to bottom */}
      <div className="flex-1"></div>

      {/* User Profile & Logout - ด้านล่างสุด */}
      <div className="flex-shrink-0 border-t border-gray-200 bg-white p-4">
        {!collapsed ? (
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gray-300 text-sm font-semibold text-gray-700">
              {getInitials(fullName)}
            </div>

            {/* User Info */}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-gray-900">{fullName || "User"}</p>
              <p className="truncate text-xs text-gray-500">{userEmail || "email@example.com"}</p>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogoutClick}
              className="flex-shrink-0 rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-200 hover:text-red-600"
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        ) : (
          /* Collapsed View - แสดงแค่ Avatar */
          <div className="flex flex-col items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-300 text-sm font-semibold text-gray-700">
              {getInitials(fullName)}
            </div>
            <button
              onClick={handleLogoutClick}
              className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-200 hover:text-red-600"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* Logout Confirmation Dialog */}
      <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Logout</DialogTitle>
            <DialogDescription>Are you sure you want to logout from your account?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleLogoutCancel}>
              Cancel
            </Button>
            <Button onClick={handleLogoutConfirm} className="bg-red-600 hover:bg-red-700">
              Logout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )

  return (
    <>
      {/* Mobile Sidebar */}
      <MobileSidebar isOpen={mobileMenuOpen} onToggle={() => setMobileMenuOpen(!mobileMenuOpen)}>
        {sidebarContent}
      </MobileSidebar>

      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "sticky top-0 h-screen border-r border-gray-200 bg-gray-50 transition-all",
          "hidden md:block", // Hide on mobile, show on medium screens and up
          collapsed ? "w-16 md:w-20" : "w-64 md:w-72 lg:w-80", // Responsive widths
          "flex flex-col overflow-hidden", // flex column layout
        )}
      >
        {sidebarContent}
      </aside>
    </>
  )
}

export default Sidebar
