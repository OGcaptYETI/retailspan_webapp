// File: src/app/components/templates/layouts/DashboardLayout.tsx
import * as React from "react"
import { NavLink } from "@/app/components/molecules/navigation"
import { Text } from "@/app/components/atoms/typography"
import { cn } from "@/lib/utils/cn"
import { 
  LayoutGrid, 
  BoxSelect, 
  DollarSign, 
  Settings, 
  LogOut,
  Menu,
  X
} from "lucide-react"

interface DashboardLayoutProps {
  children: React.ReactNode
  className?: string
}

const navigationItems = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: <LayoutGrid className="w-4 h-4" />,
    exactMatch: true
  },
  {
    href: "/dashboard/planograms",
    label: "Planograms",
    icon: <BoxSelect className="w-4 h-4" />
  },
  {
    href: "/dashboard/pricing",
    label: "Pricing",
    icon: <DollarSign className="w-4 h-4" />
  },
  {
    href: "/dashboard/settings",
    label: "Settings",
    icon: <Settings className="w-4 h-4" />
  }
]

export function DashboardLayout({ children, className }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="mr-4 p-2 hover:bg-accent rounded-md lg:hidden"
          >
            {isSidebarOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
          
          <Text className="font-bold">RetailSpan</Text>
        </div>
      </header>

      <div className="container flex gap-8">
        {/* Sidebar */}
        <aside className={cn(
          "fixed left-0 top-16 z-30 h-[calc(100vh-4rem)] w-64 border-r bg-background lg:static",
          !isSidebarOpen && "hidden lg:block"
        )}>
          <div className="space-y-4 py-4">
            <nav className="flex flex-col space-y-1 px-2">
              {navigationItems.map((item) => (
                <NavLink
                  key={item.href}
                  href={item.href}
                  exactMatch={item.exactMatch}
                  className="flex items-center gap-2 px-3 py-2"
                >
                  {item.icon}
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="absolute bottom-4 w-full px-2">
            <NavLink 
              href="/auth/logout"
              className="flex items-center gap-2 px-3 py-2 text-destructive hover:bg-destructive/10"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </NavLink>
          </div>
        </aside>

        {/* Main Content */}
        <main className={cn(
          "flex-1 py-6",
          className
        )}>
          {children}
        </main>
      </div>
    </div>
  )
}