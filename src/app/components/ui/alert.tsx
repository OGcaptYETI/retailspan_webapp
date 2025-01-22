import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { AlertCircle, CheckCircle, XCircle } from "lucide-react"
import { cn } from "@/lib/utils/cn"

const alertVariants = cva(
  "relative w-full px-4 py-3 rounded-lg border [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive: "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
        success: "border-green-500/50 text-green-600 dark:border-green-500 [&>svg]:text-green-600",
        warning: "border-yellow-500/50 text-yellow-600 dark:border-yellow-500 [&>svg]:text-yellow-600",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const icons = {
  default: AlertCircle,
  destructive: XCircle,
  success: CheckCircle,
  warning: AlertCircle,
}

interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  icon?: boolean
  onClose?: () => void
}

export function Alert({ 
  className, 
  variant = "default", 
  icon = true,
  onClose,
  children, 
  ...props 
}: AlertProps) {
  const Icon = icons[variant || "default"]

  return (
    <div
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    >
      {icon && <Icon className="h-4 w-4" />}
      <div className={cn("flex-1", { "pl-7": icon })}>
        {children}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          title="Close"
          className="absolute right-2 top-2 p-1 rounded-full opacity-70 hover:opacity-100"
        >
          <XCircle className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}

export function AlertTitle({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <h5
      className={cn("mb-1 font-medium leading-none tracking-tight", className)}
      {...props}
    />
  )
}

export function AlertDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <div
      className={cn("text-sm [&_p]:leading-relaxed", className)}
      {...props}
    />
  )
}