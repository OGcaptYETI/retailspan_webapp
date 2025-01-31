// File: src/app/components/atoms/inputs/Input.tsx
import * as React from "react"
import { Search } from "lucide-react"
import { cn } from "@/lib/utils/cn"
import { Label } from "@/app/components/atoms/typography"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
  helperText?: string
  label?: string
  hideLabel?: boolean
  labelProps?: React.LabelHTMLAttributes<HTMLLabelElement>
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, helperText, label, hideLabel, labelProps, id, ...props }, ref) => {
    const inputId = id || React.useId()
    
    return (
      <div className="space-y-2">
        {label && (
          <Label
            htmlFor={inputId}
            className={cn(hideLabel && "sr-only")}
            {...labelProps}
          >
            {label}
          </Label>
        )}
        <div className="relative">
          <input
            id={inputId}
            type={type}
            className={cn(
              "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
              error && "border-destructive focus-visible:ring-destructive",
              className
            )}
            ref={ref}
            {...props}
          />
          {helperText && (
            <p className={cn(
              "text-sm mt-1",
              error ? "text-destructive" : "text-muted-foreground"
            )}>
              {helperText}
            </p>
          )}
        </div>
      </div>
    )
  }
)
Input.displayName = "Input"

export interface SearchInputProps extends InputProps {}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, label, hideLabel, labelProps, ...props }, ref) => {
    return (
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          className={cn("pl-10", className)}
          type="search"
          label={label}
          hideLabel={hideLabel}
          labelProps={labelProps}
          ref={ref}
          {...props}
        />
      </div>
    )
  }
)
SearchInput.displayName = "SearchInput"

export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
  helperText?: string;
  label?: string;
  hideLabel?: boolean;
  labelProps?: React.LabelHTMLAttributes<HTMLLabelElement>;
}

const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, error, helperText, label, hideLabel, labelProps, id, ...props }, ref) => {
    const textareaId = id || React.useId()
    
    return (
      <div className="space-y-2">
        {label && (
          <Label
            htmlFor={textareaId}
            className={cn(hideLabel && "sr-only")}
            {...labelProps}
          >
            {label}
          </Label>
        )}
        <div className="relative">
          <textarea
            id={textareaId}
            className={cn(
              "flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
              error && "border-destructive focus-visible:ring-destructive",
              className
            )}
            ref={ref}
            {...props}
          />
          {helperText && (
            <p className={cn(
              "text-sm mt-1",
              error ? "text-destructive" : "text-muted-foreground"
            )}>
              {helperText}
            </p>
          )}
        </div>
      </div>
    )
  }
)
TextArea.displayName = "TextArea"

export { Input, SearchInput, TextArea }
