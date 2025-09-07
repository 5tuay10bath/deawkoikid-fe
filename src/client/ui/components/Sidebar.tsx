import React, { useState } from "react";
import { cn } from "@core/application/libs/cn/cn";
import {
    LayoutDashboard,
    Building2,
    Users,
    CreditCard,
    FileText,
    Wrench,
    Menu,
    X
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
type Props = {
    collapsed?: boolean;
};

type MobileSidebarProps = {
    isOpen: boolean;
    onToggle: () => void;
    children: React.ReactNode;
};

const MobileSidebar: React.FC<MobileSidebarProps> = ({ isOpen, onToggle, children }) => {
    return (
        <>
            {/* Mobile menu button */}
            <button
                onClick={onToggle}
                className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg border border-gray-200"
            >
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Mobile sidebar overlay */}
            {isOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
                    onClick={onToggle}
                />
            )}

            {/* Mobile sidebar */}
            <aside
                className={cn(
                    "md:hidden fixed left-0 top-0 h-screen bg-gray-50 border-r border-gray-200 p-4 transition-transform z-40",
                    "w-1/2",
                    isOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                {children}
            </aside>
        </>
    );
};

const NavItem = ({ to, label, icon, collapsed }: {
    to: string;
    label: string;
    icon: React.ReactNode;
    collapsed: boolean;
}) => {
    const location = useLocation();
    const active = location.pathname === to;

    return (
        <li>
            <Link
                to={to}
                className={cn(
                    "flex items-center gap-3 px-4 py-2 rounded-lg transition-colors",
                    active ? "bg-white ring-2 ring-indigo-300" : "hover:bg-gray-300",
                    collapsed && "justify-center px-2",
                    "text-sm md:text-base"
                )}
            >
                <span className="text-gray-500">{icon}</span>
                {!collapsed && <span className="text-base text-gray-700">{label}</span>}
            </Link>
        </li>
    );
}

const Sidebar: React.FC<Props> = ({ collapsed = false }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const sidebarContent = (
        <>

            {!collapsed && (
                <div className="px-2 pb-3 text-2xl font-extrabold tracking-tight text-blue-600">
                    Property Manager
                </div>
            )}

            {!collapsed && (
                <div className="px-2 py-1 text-gray-400 font-bold text-sm">
                    Navigation
                </div>
            )}

            <ul className="mt-2 space-y-1">
                <NavItem
                    to="/dashboard"
                    label="Dashboard"
                    collapsed={collapsed}
                    icon={<LayoutDashboard className="w-5 h-5" />}
                />
                <NavItem
                    to="/units"
                    label="Units"
                    collapsed={collapsed}
                    icon={<Building2 className="w-5 h-5" />}
                />
                <NavItem
                    to="/tenants"
                    label="Tenants"
                    collapsed={collapsed}
                    icon={<Users className="w-5 h-5" />}
                />
                <NavItem
                    to="/payments"
                    label="Payments"
                    collapsed={collapsed}
                    icon={<CreditCard className="w-5 h-5" />}
                />
                <NavItem
                    to="/contracts"
                    label="Contracts"
                    collapsed={collapsed}
                    icon={<FileText className="w-5 h-5" />}
                />
                <NavItem
                    to="/maintenance"
                    label="Maintenance"
                    collapsed={collapsed}
                    icon={<Wrench className="w-5 h-5" />}
                />
            </ul>
        </>
    );

    return (
        <>
            {/* Mobile Sidebar */}
            <MobileSidebar
                isOpen={mobileMenuOpen}
                onToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
                {sidebarContent}
            </MobileSidebar>

            {/* Desktop Sidebar */}
            <aside
                className={cn(
                    "sticky top-0 h-screen border-r border-gray-200 bg-gray-50 p-4 transition-all",
                    "hidden md:block", // Hide on mobile, show on medium screens and up
                    collapsed ? "w-16 md:w-20" : "w-64 md:w-72 lg:w-80" // Responsive widths
                )}
            >
                {sidebarContent}
            </aside>
        </>
    );
};

export default Sidebar;