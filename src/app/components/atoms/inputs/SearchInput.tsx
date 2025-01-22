import * as React from 'react'
import { Search } from 'lucide-react'
import { Input } from './Input'
import { cn } from '@/lib/utils/cn'

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onSearch: (value: string) => void
  searchDelay?: number
  className?: string
}

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, onSearch, searchDelay = 300, ...props }, ref) => {
    const [value, setValue] = React.useState('')
    const timeoutRef = React.useRef<NodeJS.Timeout>()

    React.useEffect(() => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      timeoutRef.current = setTimeout(() => {
        onSearch(value)
      }, searchDelay)

      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
      }
    }, [value, searchDelay, onSearch])

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setValue(event.target.value)
      if (props.onChange) {
        props.onChange(event)
      }
    }

    return (
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          className={cn(
            "pl-10 focus-visible:ring-1",
            className
          )}
          ref={ref}
          value={value}
          onChange={handleChange}
          {...props}
        />
      </div>
    )
  }
)

SearchInput.displayName = 'SearchInput'

export default SearchInput