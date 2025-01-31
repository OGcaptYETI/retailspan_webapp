// File: src/app/components/atoms/typography/Text.tsx
import * as React from "react"
import { JSX } from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils/cn"

const textVariants = cva("text-foreground", {
  variants: {
    variant: {
      default: "text-base",
      heading: "text-2xl font-semibold tracking-tight",
      subheading: "text-xl font-semibold tracking-tight",
      large: "text-lg font-semibold",
      small: "text-sm font-medium leading-none",
      muted: "text-sm text-muted-foreground",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

export interface TextProps
  extends React.HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof textVariants> {
  as?: keyof JSX.IntrinsicElements
}

const Text = React.forwardRef<HTMLParagraphElement, TextProps>(
  ({ className, variant, as: Component = "p", ...props }, ref) => {
    const Comp = Component as any
    return (
      <Comp
        ref={ref}
        className={cn(textVariants({ variant, className }))}
        {...props}
      />
    )
  }
)
Text.displayName = "Text"

export { Text, textVariants }