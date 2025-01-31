// File: src/app/components/atoms/typography/Label.tsx
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils/cn"

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
  {
    variants: {
      variant: {
        default: "",
        error: "text-destructive",
        required: "after:content-['*'] after:ml-0.5 after:text-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement>,
    VariantProps<typeof labelVariants> {
  required?: boolean;
  error?: boolean;
}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, variant, required, error, children, ...props }, ref) => {
    const variantType = error ? "error" : required ? "required" : variant;
    
    return (
      <label
        ref={ref}
        className={cn(labelVariants({ variant: variantType }), className)}
        {...props}
        {...(required && { 'aria-required': true })}
      >
        {children}
      </label>
    )
  }
)
Label.displayName = "Label"

export { Label, labelVariants }