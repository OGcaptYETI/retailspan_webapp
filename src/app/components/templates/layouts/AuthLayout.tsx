// File: src/app/components/templates/layouts/AuthLayout.tsx
import * as React from "react"
import { Text } from "@/app/components/atoms/typography"
import { cn } from "@/lib/utils/cn"

interface AuthLayoutProps {
  children: React.ReactNode
  className?: string
}

export function AuthLayout({ children, className }: AuthLayoutProps) {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Branding Side */}
      <div className="hidden md:flex flex-col justify-between bg-primary p-8 text-primary-foreground">
        <div>
          <Text className="text-lg font-bold">RetailSpan</Text>
        </div>
        
        <div className="space-y-4">
          <Text className="text-4xl font-bold">
            Welcome to RetailSpan
          </Text>
          <Text className="text-lg opacity-90">
            Create and manage your retail planograms with ease.
          </Text>
        </div>
        
        <Text className="text-sm opacity-70">
          © {new Date().getFullYear()} RetailSpan. All rights reserved.
        </Text>
      </div>

      {/* Content Side */}
      <div className={cn(
        "flex items-center justify-center p-8",
        className
      )}>
        <div className="w-full max-w-md space-y-8">
          {children}
        </div>
      </div>
    </div>
  )
}