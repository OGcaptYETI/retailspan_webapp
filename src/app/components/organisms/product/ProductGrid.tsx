// app/components/organisms/product/ProductGrid.tsx
import * as React from "react"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/app/components/ui/select"
import { ProductCard } from "@/app/components/molecules/cards/ProductCard"
import { Text } from "@/app/components/atoms/typography"
import { cn } from "@/lib/utils/cn"
import type { Product, ProductGridItem } from "@/types/models/products"
import type { FilterState, SortState } from "@/types/components/common"
import { forwardRef, type ChangeEvent } from 'react'

export interface ProductGridProps {
  products: Product[]
  onProductSelect?: (product: ProductGridItem) => void
  className?: string
  searchPlaceholder?: string
  emptyMessage?: string
  isLoading?: boolean
  filters?: FilterState
  sort?: SortState
  onFilterChange?: (filters: FilterState) => void
  onSortChange?: (sort: SortState) => void
  draggable?: boolean
  onDragStart?: (product: ProductGridItem, event: React.DragEvent<Element>) => void
}

export interface SearchFieldProps {
  value: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  type?: 'text' | 'search' | 'email' | 'tel'
  className?: string
}

export const SearchField = forwardRef<HTMLInputElement, SearchFieldProps>(
  ({ value, onChange, placeholder, type = 'text', className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      />
    )
  }
)

SearchField.displayName = 'SearchField'

type SortableFields = keyof Pick<Product, 'name' | 'price' | 'brand' | 'category'>

export function ProductGrid({
  products,
  onProductSelect,
  className,
  searchPlaceholder = "Search products...",
  emptyMessage = "No products found",
  isLoading = false,
  filters = {},
  sort = { field: 'name', direction: 'asc' },
  onFilterChange,
  onSortChange,
  draggable = false,
  onDragStart,
}: ProductGridProps) {
  const [searchTerm, setSearchTerm] = React.useState("")
  const [currentSort, setCurrentSort] = React.useState<SortState>(sort)
  const [currentFilters, setCurrentFilters] = React.useState<FilterState>(filters)

  const enrichedProducts = React.useMemo(() => 
    products.map(p => ({
      ...p,
      id: typeof p.id === 'number' ? (p.id as number).toString() : (p.id as string),
      price: p.price ?? p.current_price ?? p.cost ?? 0,
      cost: p.cost ?? 0,
      stock: p.stock ?? 0,
      category: p.category ?? 'Uncategorized',
      brand: p.brand ?? 'Unknown',
      image_url: p.image_url ?? null,
      organization_id: p.organization_id,
      width: p.width ?? 0,
      height: p.height ?? 0,
      depth: p.depth ?? 0,
      active: p.is_active ?? true
    } as ProductGridItem)),
    [products]
  )

  const categories = React.useMemo(() => 
    Array.from(new Set(enrichedProducts.map(p => p.category))).sort(),
    [enrichedProducts]
  )
  
  const brands = React.useMemo(() => 
    Array.from(new Set(enrichedProducts.map(p => p.brand))).sort(),
    [enrichedProducts]
  )
  
  const filteredAndSortedProducts = React.useMemo(() => {
    let result = [...enrichedProducts]

    if (currentFilters.category?.length) {
      result = result.filter(p => currentFilters.category?.includes(p.category))
    }
    if (currentFilters.brand?.length) {
      result = result.filter(p => currentFilters.brand?.includes(p.brand))
    }
    if (currentFilters.priceRange) {
      result = result.filter(p => 
        p.price >= (currentFilters.priceRange?.min ?? 0) && 
        p.price <= (currentFilters.priceRange?.max ?? Infinity)
      )
    }
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(p => 
        p.name.toLowerCase().includes(term) ||
        p.brand.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term)
      )
    }

    result.sort((a, b) => {
      const field = currentSort.field as SortableFields
      const aVal = String(a[field] ?? '')
      const bVal = String(b[field] ?? '')
      return currentSort.direction === 'asc' 
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal)
    })

    return result
  }, [enrichedProducts, currentFilters, currentSort, searchTerm])

  const handleSortChange = (field: string) => {
    const direction: 'asc' | 'desc' = currentSort.field === field && currentSort.direction === 'asc' ? 'desc' : 'asc'
    const newSort: SortState = { field, direction }
    setCurrentSort(newSort)
    onSortChange?.(newSort)
  }

  const handleFilterChange = (updates: Partial<FilterState>) => {
    const newFilters = { ...currentFilters, ...updates }
    setCurrentFilters(newFilters)
    onFilterChange?.(newFilters)
  }

  return (
    <div className={cn(className)}>
      <div className="mb-4 space-y-4">
        <div className="flex items-center gap-4">
          <SearchField
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={searchPlaceholder}
            type="search"
            className="flex-1"
          />
          <Select
            value={currentSort.field}
            onValueChange={field => handleSortChange(field)}
          >
            <SelectTrigger>Sort by</SelectTrigger>
            <SelectContent>
              {['name', 'price', 'brand', 'category'].map(field => (
                <SelectItem key={field} value={field}>
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-4 flex-wrap">
          <Select
            value={currentFilters.category?.join(',')}
            onValueChange={value => handleFilterChange({ category: value ? value.split(',') : [] })}
          >
            <SelectTrigger>Category</SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={currentFilters.brand?.join(',')}
            onValueChange={value => handleFilterChange({ brand: value ? value.split(',') : [] })}
          >
            <SelectTrigger>Brand</SelectTrigger>
            <SelectContent>
              {brands.map(brand => (
                <SelectItem key={brand} value={brand}>
                  {brand}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-pulse">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-[400px] bg-muted rounded-lg" />
          ))}
        </div>
      ) : filteredAndSortedProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredAndSortedProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={onProductSelect}
              isDraggable={draggable}
              handleDragStart={onDragStart ? (e: React.DragEvent<HTMLDivElement>) => onDragStart(product, e) : undefined}
            />
          ))}
        </div>
      ) : (
        <Text variant="muted" className="text-center">{emptyMessage}</Text>
      )}
    </div>
  )
}