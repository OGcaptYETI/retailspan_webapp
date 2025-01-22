import React, { useState } from 'react'
import { cn } from '@/lib/utils/cn'
import { NavLink } from '@/app/components/molecules/navigation'
import { Text } from '@/app/components/atoms/typography'
import { LogOut, Menu, X, LayoutGrid, BoxSelect, DollarSign, Settings } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createClientSupabaseClient } from '@/lib/supabase/client'

interface DashboardLayoutProps {
  children: React.ReactNode
  className?: string
}

interface NavigationItem {
  href: string
  label: string
  icon: React.ReactNode
  exact?: boolean
}

const navigationItems: NavigationItem[] = [
    {
      href: '/dashboard',
      label: 'Dashboard',
      icon: <LayoutGrid className="w-4 h-4" />,
      exact: true,
    },
    {
      href: '/dashboard/planograms',
      label: 'Planograms',
      icon: <BoxSelect className="w-4 h-4" />,
    },
    {
      href: '/dashboard/pricing',
      label: 'Pricing',
      icon: <DollarSign className="w-4 h-4" />,
    },
    {
      href: '/dashboard/settings',
      label: 'Settings',
      icon: <Settings className="w-4 h-4" />,
    },
];

export function DashboardLayout({ children, className }: DashboardLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const router = useRouter()
  const supabase = createClientSupabaseClient()

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)
      await supabase.auth.signOut()
      router.push('/login')
    } catch (error) {
      console.error('Error logging out:', error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center">
            <button
              type="button"
              className="mr-4 p-2 -ml-2 hover:bg-accent rounded-md lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open sidebar</span>
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
            <Text className="font-bold">RetailSpan</Text>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:top-16 lg:z-30 lg:flex lg:w-64 lg:flex-col">
          <nav className="flex flex-1 flex-col border-r border-gray-200 bg-background pt-4">
            <div className="flex flex-1 flex-col gap-y-4 px-4">
              {navigationItems.map((item) => (
                <NavLink
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium"
                >
                  {item.icon}
                  {item.label}
                </NavLink>
              ))}
            </div>
            <div className="p-4 border-t">
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10"
              >
                <LogOut className="h-4 w-4" />
                {isLoggingOut ? "Logging out..." : "Logout"}
              </button>
            </div>
          </nav>
        </div>

        {/* Mobile Sidebar */}
        <div
          className={cn(
            "fixed inset-0 top-16 z-40 lg:hidden",
            mobileMenuOpen ? "block" : "hidden"
          )}
        >
          {/* Background overlay */}
          <div 
            className="fixed inset-0 bg-gray-600/75"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Sidebar */}
          <div className="fixed inset-y-0 left-0 top-16 flex w-64 flex-col bg-background">
            <nav className="flex flex-1 flex-col border-r border-gray-200 pt-4">
              <div className="flex flex-1 flex-col gap-y-4 px-4">
                {navigationItems.map((item) => (
                  <NavLink
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.icon}
                    {item.label}
                  </NavLink>
                ))}
              </div>
              <div className="p-4 border-t">
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10"
                >
                  <LogOut className="h-4 w-4" />
                  {isLoggingOut ? "Logging out..." : "Logout"}
                </button>
              </div>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <main className={cn(
          "flex-1 lg:pl-64",
          className
        )}>
          <div className="container py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}