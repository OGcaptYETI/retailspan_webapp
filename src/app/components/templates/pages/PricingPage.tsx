// File: src/app/components/templates/pages/PricingPage.tsx
import * as React from "react"
import { 
  PageTemplate, 
  type PageTemplateProps 
} from "./PageTemplate"
import { SearchField } from "@/app/components/molecules/forms"
import { Button } from "@/app/components/atoms/buttons"
import { Text } from "@/app/components/atoms/typography"
import { Card, CardContent } from "@/app/components/molecules/cards"
import type { Product } from "@/types/supabase"
import { cn } from "@/lib/utils/cn"

export interface PricingPageProps extends Omit<PageTemplateProps, 'children'> {
  products: Product[]
  onUpdatePrices?: (updatedProducts: Product[]) => Promise<void>
  className?: string
}

export function PricingPage({
  products,
  onUpdatePrices,
  className,
  ...pageProps
}: PricingPageProps) {
  const [searchTerm, setSearchTerm] = React.useState("")
  const [selectedProducts, setSelectedProducts] = React.useState<Product[]>([])
  const [isUpdating, setIsUpdating] = React.useState(false)

  // Filter products based on search
  const filteredProducts = React.useMemo(() => {
    if (!searchTerm) return products
    const lowerSearch = searchTerm.toLowerCase()
    return products.filter(product => 
      product.name.toLowerCase().includes(lowerSearch) ||
      product.brand.toLowerCase().includes(lowerSearch) ||
      product.category.toLowerCase().includes(lowerSearch)
    )
  }, [products, searchTerm])

  // Bulk price update handler
  const handleBulkUpdate = async () => {
    if (!selectedProducts.length || !onUpdatePrices) return
    
    setIsUpdating(true)
    try {
      await onUpdatePrices(selectedProducts)
    } catch (error) {
      console.error('Failed to update prices:', error)
    } finally {
      setIsUpdating(false)
      setSelectedProducts([])
    }
  }

  return (
    <PageTemplate
      {...pageProps}
      actions={
        <Button
          variant="default"
          onClick={handleBulkUpdate}
          disabled={!selectedProducts.length || isUpdating}
        >
          {isUpdating 
            ? "Updating..." 
            : `Update ${selectedProducts.length} Products`}
        </Button>
      }
    >
      <div className={cn("space-y-6", className)}>
        {/* Search and Filters */}
        <div className="flex items-center justify-between">
          <SearchField
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onClear={() => setSearchTerm("")}
            placeholder="Search products..."
          />
          <Text className="text-muted-foreground">
            {filteredProducts.length} products
          </Text>
        </div>

        {/* Product Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map(product => (
            <Card key={product.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <Text className="font-medium">{product.name}</Text>
                    <Text className="text-sm text-muted-foreground">
                      {product.brand} • {product.category}
                    </Text>
                  </div>
                  <Text className="text-lg font-bold">
                    ${product.price.toFixed(2)}
                  </Text>
                </div>

                <div className="mt-4 space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const isSelected = selectedProducts.some(p => p.id === product.id)
                      if (isSelected) {
                        setSelectedProducts(prev => prev.filter(p => p.id !== product.id))
                      } else {
                        setSelectedProducts(prev => [...prev, product])
                      }
                    }}
                  >
                    {selectedProducts.some(p => p.id === product.id)
                      ? "Selected"
                      : "Select"}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                  >
                    View History
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </PageTemplate>
  )
}