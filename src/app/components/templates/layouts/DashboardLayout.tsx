'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils/cn';
import { NavLink } from '@/app/components/molecules/navigation';
import { Text } from '@/app/components/atoms/typography';
import { LogOut, Menu, X, LayoutGrid, BoxSelect, DollarSign, Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createClientSupabaseClient } from '@/lib/supabase/client';

interface DashboardLayoutProps {
  children: React.ReactNode;
  className?: string;
}

const navigationItems = [
  { href: '/dashboard', label: 'Dashboard', icon: <LayoutGrid className="w-4 h-4" />, exact: true },
  { href: '/planogram', label: 'Planograms', icon: <BoxSelect className="w-4 h-4" /> },
  { href: '/pricing', label: 'Pricing', icon: <DollarSign className="w-4 h-4" /> },
  { href: '/settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
];

export function DashboardLayout({ children, className }: DashboardLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();
  const supabase = createClientSupabaseClient();

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await supabase.auth.signOut();
      router.push('/auth/login');
    } catch (error) {
      console.error('Error logging out:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center px-4 lg:px-6">
          <button
            type="button"
            className="lg:hidden relative inline-flex items-center justify-center rounded-md p-2 hover:bg-accent hover:text-accent-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="sr-only">Open menu</span>
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
          <Text className="ml-4 font-semibold text-lg">RetailSpan</Text>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-3.5rem)]">
        <aside
          className={cn(
            'fixed inset-y-14 left-0 z-30 w-64 -translate-x-full border-r bg-background transition-transform lg:translate-x-0',
            mobileMenuOpen && 'translate-x-0'
          )}
        >
          <nav className="flex h-full flex-col">
            <div className="flex-1 space-y-1 p-4">
              {navigationItems.map((item) => (
                <NavLink
                  key={item.href}
                  href={item.href}
                  className="flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>
            <div className="border-t p-4">
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex w-full items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 disabled:opacity-50"
              >
                <LogOut className="h-4 w-4" />
                <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
              </button>
            </div>
          </nav>
        </aside>

        <main className={cn(
          'flex-1 px-4 py-6 lg:px-6',
          'lg:ml-64',
          className
        )}>
          {children}
        </main>
      </div>
    </div>
  );
}