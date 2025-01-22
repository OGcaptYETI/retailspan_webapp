// File: src/app/components/organisms/product/ProductGrid.tsx
import * as React from "react"
import { ProductCard, type ProductCardProps } from "@/app/components/molecules/cards"
import { SearchField } from "@/app/components/molecules/forms"
import { Text } from "@/app/components/atoms/typography"
import { cn } from "@/lib/utils/cn"

export interface ProductGridProps {
  products: ProductCardProps["product"][]
  onProductSelect?: (product: ProductCardProps["product"]) => void
  className?: string
  searchPlaceholder?: string
  emptyMessage?: string
  isLoading?: boolean
}

export function ProductGrid({
  products,
  onProductSelect,
  className,
  searchPlaceholder = "Search products...",
  emptyMessage = "No products found",
  isLoading = false,
}: ProductGridProps) {
  const [searchTerm, setSearchTerm] = React.useState("")
  
  // Filter products based on search term
  const filteredProducts = React.useMemo(() => {
    if (!searchTerm) return products
    
    const lowerSearchTerm = searchTerm.toLowerCase()
    return products.filter(product => 
      product.name.toLowerCase().includes(lowerSearchTerm) ||
      product.brand.toLowerCase().includes(lowerSearchTerm) ||
      product.category.toLowerCase().includes(lowerSearchTerm)
    )
  }, [products, searchTerm])

  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex items-center justify-between">
        <SearchField
          placeholder={searchPlaceholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onClear={() => setSearchTerm("")}
        />
        <Text className="text-muted-foreground">
          {filteredProducts.length} products
        </Text>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {/* Add skeleton loading cards here */}
          {Array.from({ length: 8 }).map((_, i) => (
            <div 
              key={i}
              className="h-[400px] rounded-lg bg-muted animate-pulse"
            />
          ))}
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={onProductSelect}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12">
          <Text className="text-muted-foreground">
            {emptyMessage}
          </Text>
        </div>
      )}
    </div>
  )
}