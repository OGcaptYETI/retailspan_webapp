// File: src/app/components/molecules/navigation/NavLink.tsx
import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils/cn"

const navLinkVariants = cva(
  "inline-flex items-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        default: "text-muted-foreground hover:text-primary",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        active: "text-primary",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-11 px-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface NavLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof navLinkVariants> {
  href: string
  exactMatch?: boolean
}

export const NavLink = React.forwardRef<HTMLAnchorElement, NavLinkProps>(
  ({ className, href, variant, size, exactMatch = false, ...props }, ref) => {
    const pathname = usePathname()
    const isActive = exactMatch 
      ? pathname === href
      : pathname.startsWith(href)

    return (
      <Link
        ref={ref}
        href={href}
        className={cn(
          navLinkVariants({
            variant: isActive ? "active" : variant,
            size,
          }),
          className
        )}
        {...props}
      />
    )
  }
)
NavLink.displayName = "NavLink"