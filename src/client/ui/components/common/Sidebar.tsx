import { LayoutDashboard, Building2, Users, CreditCard, FileText, Wrench, Menu, X } from "lucide-react"
import React, { useState } from "react"
import { Link, useLocation } from "react-router-dom"

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
          "fixed left-0 top-0 z-40 h-full border-r border-gray-200 bg-gray-50 p-4 transition-transform md:hidden",
          "w-1/2",
          isOpen ? "translate-x-0" : "-translate-x-full",
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

  const sidebarContent = (
    <>
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
    </>
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
          "sticky top-0 h-screen border-r border-gray-200 bg-gray-50 p-4 transition-all",
          "hidden md:block", // Hide on mobile, show on medium screens and up
          collapsed ? "w-16 md:w-20" : "w-64 md:w-72 lg:w-80", // Responsive widths
        )}
      >
        {sidebarContent}
      </aside>
    </>
  )
}

export default Sidebar
