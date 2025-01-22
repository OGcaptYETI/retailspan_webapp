// File: src/app/components/molecules/navigation/Breadcrumbs.tsx
import * as React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils/cn"
import { ChevronRight } from "lucide-react"

export interface BreadcrumbItem {
  href: string
  label: string
}

export interface BreadcrumbsProps extends React.HTMLAttributes<HTMLElement> {
  items: BreadcrumbItem[]
  separator?: React.ReactNode
}

export function Breadcrumbs({ 
  items, 
  separator = <ChevronRight className="h-4 w-4" />,
  className,
  ...props 
}: BreadcrumbsProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("flex items-center text-sm text-muted-foreground", className)}
      {...props}
    >
      <ol className="flex items-center space-x-2">
        {items.map((item, index) => (
          <li key={item.href} className="flex items-center">
            {index > 0 && (
              <span className="mx-2 text-muted-foreground/50">
                {separator}
              </span>
            )}
            {index === items.length - 1 ? (
              <span className="text-foreground font-medium">
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="hover:text-foreground transition-colors"
              >
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}