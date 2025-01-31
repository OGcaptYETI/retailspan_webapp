// File: src/app/components/molecules/forms/SearchField.tsx
import * as React from "react"
import { SearchInput, type SearchInputProps } from "@/app/components/atoms/inputs"
import { Label } from "@/app/components/atoms/typography"
import { cn } from "@/lib/utils/cn"
import { X } from "lucide-react"

export interface SearchFieldProps extends Omit<SearchInputProps, 'type'> {
  label?: string
  hideLabel?: boolean
  labelProps?: React.LabelHTMLAttributes<HTMLLabelElement>
  onClear?: () => void
  value?: string
}

const SearchField = React.forwardRef<HTMLInputElement, SearchFieldProps>(
  ({ 
    label = "Search", 
    hideLabel,
    className,
    id,
    labelProps,
    onClear,
    value,
    onChange,
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
        
        <div className="relative">
          <SearchInput
            id={inputId}
            ref={ref}
            value={value}
            onChange={onChange}
            placeholder={props.placeholder || `Search ${label.toLowerCase()}...`}
            className={cn(
              "w-full md:w-[300px] pr-8",
              className
            )}
            {...props}
          />
          {value && onClear && (
            <button
              type="button"
              onClick={onClear}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={16} />
              <span className="sr-only">Clear search</span>
            </button>
          )}
        </div>
      </div>
    )
  }
)
SearchField.displayName = "SearchField"

export { SearchField }