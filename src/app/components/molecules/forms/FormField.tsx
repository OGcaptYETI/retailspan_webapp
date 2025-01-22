// File: src/app/components/molecules/forms/FormField.tsx
import * as React from "react"
import { Label } from "@/app/components/atoms/typography"
import { Input, type InputProps } from "@/app/components/atoms/inputs"
import { cn } from "@/lib/utils/cn"

export interface FormFieldProps extends InputProps {
  label: string
  error?: boolean
  errorMessage?: string
  helperText?: string
  required?: boolean
  labelProps?: React.LabelHTMLAttributes<HTMLLabelElement>
}

const FormField = React.forwardRef<HTMLInputElement, FormFieldProps>(
  ({ 
    label, 
    error, 
    errorMessage, 
    helperText,
    required,
    className,
    id,
    labelProps,
    ...props 
  }, ref) => {
    const inputId = id || React.useId()
    const errorId = `${inputId}-error`
    const helperId = `${inputId}-helper`

    return (
      <div className="space-y-2">
        <Label
          htmlFor={inputId}
          variant={error ? "error" : "default"}
          {...labelProps}
        >
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
        
        <Input
          id={inputId}
          ref={ref}
          aria-invalid={error}
          aria-errormessage={error ? errorId : undefined}
          aria-describedby={helperText ? helperId : undefined}
          className={className}
          error={error}
          required={required}
          {...props}
        />

        {errorMessage && error && (
          <p 
            id={errorId}
            className="text-sm font-medium text-destructive"
          >
            {errorMessage}
          </p>
        )}

        {helperText && !error && (
          <p
            id={helperId}
            className="text-sm text-muted-foreground"
          >
            {helperText}
          </p>
        )}
      </div>
    )
  }
)
FormField.displayName = "FormField"

export { FormField }