// File: src/app/components/molecules/forms/SearchField.tsx
import * as React from "react"
import { SearchInput, type SearchInputProps } from "@/app/components/atoms/inputs"
import { Label } from "@/app/components/atoms/typography"
import { cn } from "@/lib/utils/cn"

export interface SearchFieldProps extends SearchInputProps {
  label?: string
  hideLabel?: boolean
  labelProps?: React.LabelHTMLAttributes<HTMLLabelElement>
  className?: string
  id?: string
  onSearch?: (value: string) => void
}

const SearchField = React.forwardRef<HTMLInputElement, SearchFieldProps>(
  ({ 
    label = "Search", 
    hideLabel,
    className,
    id,
    labelProps,
    onSearch = () => {},
    ...props 
  }, ref) => {
    const generatedId = React.useId()
    const inputId = id || generatedId
    
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
          onSearch={onSearch}
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