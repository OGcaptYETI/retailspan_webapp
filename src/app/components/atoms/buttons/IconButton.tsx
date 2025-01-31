// File: src/app/components/atoms/buttons/IconButton.tsx
import * as React from "react"
import { Button } from "./Button"
import { cn } from "@/lib/utils/cn"

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode
  label: string
  variant?: 'primary' | 'ghost' | 'outline'
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, label, className, variant = 'ghost', ...props }, ref) => {
    return (
      <Button
        variant={variant}
        size="icon"
        ref={ref}
        className={cn("rounded-full", className)}
        aria-label={label}
        {...props}
      >
        {icon}
      </Button>
    )
  }
)
IconButton.displayName = "IconButton"

export { IconButton }