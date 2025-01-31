// File: src/app/components/atoms/inputs/SearchInput.tsx
import * as React from "react"
import { Input, type InputProps } from "./Input"
import { cn } from "@/lib/utils/cn"

export interface SearchInputProps extends Omit<InputProps, 'type'> {
  onSearch?: (value: string) => void
  searchDelay?: number
}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, onSearch, searchDelay = 300, ...props }, ref) => {
    const [debouncedValue, setDebouncedValue] = React.useState("")
    const timeoutRef = React.useRef<NodeJS.Timeout | null>(null)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      props.onChange?.(e)
      const value = e.target.value

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      timeoutRef.current = setTimeout(() => {
        setDebouncedValue(value)
        onSearch?.(value)
      }, searchDelay)
    }

    React.useEffect(() => {
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
      }
    }, [])

    return (
      <Input
        type="search"
        className={cn(
          "pl-10",
          className
        )}
        ref={ref}
        onChange={handleChange}
        {...props}
      />
    )
  }
)
SearchInput.displayName = "SearchInput"

export { SearchInput }