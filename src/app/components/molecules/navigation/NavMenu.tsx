// File: src/app/components/molecules/navigation/NavMenu.tsx
import * as React from "react"
import { cn } from "@/lib/utils/cn"
import { NavLink, type NavLinkProps } from "./NavLink"

export interface NavItem {
  href: string
  label: string
  icon?: React.ReactNode
  exactMatch?: boolean
}

export interface NavMenuProps extends React.HTMLAttributes<HTMLElement> {
  items: NavItem[]
  linkProps?: Omit<NavLinkProps, 'href'>
  orientation?: "horizontal" | "vertical"
}

export function NavMenu({ 
  items, 
  linkProps, 
  orientation = "horizontal",
  className,
  ...props 
}: NavMenuProps) {
  return (
    <nav
      className={cn(
        "flex",
        orientation === "vertical" ? "flex-col space-y-1" : "space-x-4",
        className
      )}
      {...props}
    >
      {items.map((item) => (
        <NavLink
          key={item.href}
          href={item.href}
          exactMatch={item.exactMatch}
          {...linkProps}
        >
          {item.icon && (
            <span className="mr-2">{item.icon}</span>
          )}
          {item.label}
        </NavLink>
      ))}
    </nav>
  )
}