// File: src/app/components/atoms/buttons/IconButton.tsx
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Button } from "./Button"
import { cn } from "@/lib/utils/cn"

// Define variant styles specifically for icon buttons
const iconButtonVariants = cva(
  // Base styles that apply to all icon buttons
  "inline-flex items-center justify-center transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        // Primary variant with modern, subtle gradient
        primary: "bg-gradient-to-r from-primary to-primary/90 text-primary-foreground hover:brightness-110",
        
        // Ghost variant with hover highlight effect
        ghost: "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100",
        
        // Outline variant with refined border
        outline: "border border-gray-200 dark:border-gray-700 hover:border-primary hover:text-primary dark:hover:border-primary",
        
        // New subtle variant for secondary actions
        subtle: "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700",
        
        // New glass variant for modern UI
        glass: "backdrop-blur-sm bg-white/10 dark:bg-black/10 hover:bg-white/20 dark:hover:bg-black/20 text-gray-900 dark:text-gray-100"
      },
      size: {
        // Refined size options with better proportions
        sm: "h-8 w-8 rounded-lg",
        md: "h-10 w-10 rounded-lg",
        lg: "h-12 w-12 rounded-lg",
        // Circular options for different design needs
        "sm-round": "h-8 w-8 rounded-full",
        "md-round": "h-10 w-10 rounded-full",
        "lg-round": "h-12 w-12 rounded-full"
      },
    },
    defaultVariants: {
      variant: "ghost",
      size: "md"
    }
  }
)

// Enhanced props interface with new options
export interface IconButtonProps 
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof iconButtonVariants> {
  icon: React.ReactNode
  label: string
  isLoading?: boolean
  tooltipPosition?: 'top' | 'right' | 'bottom' | 'left'
  showTooltip?: boolean
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ 
    icon, 
    label, 
    className, 
    variant = 'ghost', 
    size = 'md',
    isLoading,
    tooltipPosition = 'bottom',
    showTooltip = true,
    ...props 
  }, ref) => {
    // Loading spinner component
    const LoadingSpinner = () => (
      <svg
        className="animate-spin h-4 w-4"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle 
          className="opacity-25" 
          cx="12" 
          cy="12" 
          r="10" 
          stroke="currentColor" 
          strokeWidth="3"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    )

    // Tooltip positioning classes
    const tooltipClasses = {
      top: "before:bottom-full before:left-1/2 before:-translate-x-1/2 before:-translate-y-2",
      right: "before:left-full before:top-1/2 before:-translate-y-1/2 before:translate-x-2",
      bottom: "before:top-full before:left-1/2 before:-translate-x-1/2 before:translate-y-2",
      left: "before:right-full before:top-1/2 before:-translate-y-1/2 before:-translate-x-2"
    }

    return (
      <button
        ref={ref}
        className={cn(
          iconButtonVariants({ variant, size }),
          // Add tooltip styles if showTooltip is true
          showTooltip && [
            "relative",
            // Tooltip base styles
            "before:content-[attr(aria-label)]",
            "before:absolute",
            "before:hidden hover:before:block",
            "before:px-2 before:py-1",
            "before:bg-gray-900 before:text-white",
            "before:text-xs before:rounded",
            "before:whitespace-nowrap",
            "before:z-50",
            tooltipClasses[tooltipPosition]
          ],
          className
        )}
        aria-label={label}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading ? <LoadingSpinner /> : icon}
      </button>
    )
  }
)

IconButton.displayName = "IconButton"

export { IconButton }