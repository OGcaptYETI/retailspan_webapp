// File: src/app/components/atoms/typography/Heading.tsx
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils/cn"

const headingVariants = cva("font-heading font-bold leading-tight tracking-tight", {
  variants: {
    size: {
      h1: "scroll-m-20 text-4xl",
      h2: "scroll-m-20 text-3xl",
      h3: "scroll-m-20 text-2xl",
      h4: "scroll-m-20 text-xl",
      h5: "scroll-m-20 text-lg",
      h6: "scroll-m-20 text-base",
    },
  },
  defaultVariants: {
    size: "h1",
  },
})

export interface HeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof headingVariants> {
  level?: 1 | 2 | 3 | 4 | 5 | 6
}

const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, size, level = 1, ...props }, ref) => {
    const Component = `h${level}` as keyof JSX.IntrinsicElements
    return (
      <Component
        ref={ref}
        className={cn(headingVariants({ size: size || `h${level}`, className }))}
        {...props}
      />
    )
  }
)
Heading.displayName = "Heading"

export { Heading, headingVariants }