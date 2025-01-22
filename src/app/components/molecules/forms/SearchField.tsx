// File: src/app/components/molecules/forms/SearchField.tsx
import * as React from "react"
import { SearchInput, type SearchInputProps } from "@/app/components/atoms/inputs"
import { Label } from "@/app/components/atoms/typography"
import { cn } from "@/lib/utils/cn"

export interface SearchFieldProps extends SearchInputProps {
  label?: string
  hideLabel?: boolean
  labelProps?: React.LabelHTMLAttributes<HTMLLabelElement>
}

const SearchField = React.forwardRef<HTMLInputElement, SearchFieldProps>(
  ({ 
    label = "Search", 
    hideLabel,
    className,
    id,
    labelProps,
    ...props 
  }, ref) => {
    const inputId = id || React.useId()
    
    return (
      <div className="space-y-2">
        <Label
          htmlFor={inputId}
          className={cn(hideLabel && "sr-only")}
          {...labelProps}
        >
          {label}
        </Label>
        
        <SearchInput
          id={inputId}
          ref={ref}
          type="search"
          placeholder={props.placeholder || `Search ${label.toLowerCase()}...`}
          className={cn(
            "w-full md:w-[300px]",
            className
          )}
          {...props}
        />
      </div>
    )
  }
)
SearchField.displayName = "SearchField"

export { SearchField }