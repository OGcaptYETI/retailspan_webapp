"use client";

import React, { useState } from "react";
import { NavLink } from "@/app/components/molecules/navigation/NavLink";
import { BoxSelect, DollarSign, Menu, Package, Home, User, Smile } from "lucide-react";
import { useAuth } from "@/lib/context/AuthContext";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import ProfileModal from "@/app/components/molecules/navigation/ProfileModal";

interface SidebarProps {
  isCollapsed?: boolean;
  onCollapseChange?: (collapsed: boolean) => void;
}

const navigationItems = [
  { href: "/dashboard", label: "Home", icon: <Home className="w-6 h-6" /> },
  { href: "/pricing", label: "Pricing", icon: <DollarSign className="w-6 h-6" /> },
  { href: "/products", label: "Products", icon: <Package className="w-6 h-6" /> },
  { href: "/promotions", label: "Promotions", icon: <Smile className="w-6 h-6" /> },
  { href: "/planograms", label: "Planograms", icon: <BoxSelect className="w-6 h-6" /> },
];

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed: initialIsCollapsed = true, onCollapseChange }) => {
  const [isCollapsed, setIsCollapsed] = useState(initialIsCollapsed);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const handleCollapse = (collapsed: boolean) => {
    setIsCollapsed(collapsed);
    onCollapseChange?.(collapsed);
  };

  return (
    <aside
      className={cn(
        "fixed top-0 left-0 h-screen flex flex-col transition-all duration-300 ease-in-out z-50",
        "bg-secondary/95 backdrop-blur-sm shadow-lg border-r border-border",
        isCollapsed ? "w-20" : "w-64"
      )}
      onMouseEnter={() => handleCollapse(false)}
      onMouseLeave={() => handleCollapse(true)}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-border bg-secondary">
        {isCollapsed ? (
          <div className="w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center font-bold">
            R
          </div>
        ) : (
          <span className="text-xl font-bold text-foreground">RetailSpan</span>
        )}
        <button
          title="Toggle Sidebar"
          onClick={() => handleCollapse(!isCollapsed)}
          className="p-2 rounded-md text-foreground hover:bg-accent/50 transition-colors"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="flex flex-col items-center space-y-2">
          {navigationItems.map((item, index) => (
            <li key={item.href} className="w-full px-2">
              {index === 1 && <hr className="my-2 border-border opacity-50" />}
              <NavLink
                href={item.href}
                className={cn(
                  "flex items-center w-full px-4 py-3 rounded-lg transition-all duration-300 ease-in-out",
                  "hover:bg-accent hover:text-accent-foreground",
                  isCollapsed ? "justify-center" : "justify-start space-x-3"
                )}
              >
                {item.icon}
                {!isCollapsed && <span>{item.label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* User Profile */}
      <div className="mt-auto px-4 py-4 border-t border-border bg-secondary">
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-4 px-4 py-2 rounded-lg w-full transition-colors hover:bg-accent/50"
        >
          <User className="w-6 h-6" />
          {!isCollapsed && user && <p className="text-sm font-medium truncate">{user.email}</p>}
        </button>
      </div>

      {/* Profile Modal */}
      {isModalOpen && (
        <ProfileModal
          isOpen={isModalOpen}
          user={user}
          onClose={() => setIsModalOpen(false)}
          onLogout={handleLogout}
          className="bottom-left"
        />
      )}
    </aside>
  );
};

export default Sidebar;

