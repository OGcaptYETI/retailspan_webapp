// File: src/app/components/templates/pages/PlanogramPage.tsx
import * as React from "react"
import { 
  Heading, 
  Text 
} from "@/app/components/atoms/typography"
import { 
  Breadcrumbs, 
  type BreadcrumbItem 
} from "@/app/components/molecules/navigation"
import {
  ProductGrid,
  PlanogramEditor
} from "@/app/components/organisms"
import type { Product, Fixture } from "@/types/supabase"
import { cn } from "@/lib/utils/cn"

export interface PlanogramPageProps {
  fixture: Fixture
  products: Product[]
  breadcrumbs?: BreadcrumbItem[]
  onSavePlanogram?: (placements: any[]) => Promise<void>
  className?: string
}

export function PlanogramPage({
  fixture,
  products,
  breadcrumbs = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/dashboard/planograms", label: "Planograms" },
    { href: "#", label: "Edit Planogram" }
  ],
  onSavePlanogram,
  className
}: PlanogramPageProps) {
  const [selectedProducts, setSelectedProducts] = React.useState<Product[]>([])

  const handleProductSelect = (product: Product) => {
    setSelectedProducts(prev => [...prev, product])
  }

  return (
    <div className={cn("space-y-8", className)}>
      {/* Header */}
      <div className="space-y-2">
        <Breadcrumbs items={breadcrumbs} />
        <div className="flex justify-between items-start">
          <div>
            <Heading level={1}>Edit Planogram</Heading>
            <Text className="text-muted-foreground">
              Design your product layout by dragging items onto the fixture.
            </Text>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Product Selection */}
        <div className="lg:col-span-4 space-y-4">
          <div className="sticky top-24">
            <Heading level={2} size="h3">Products</Heading>
            <Text className="text-muted-foreground">
              Select products to add to your planogram.
            </Text>
            <ProductGrid
              products={products}
              onProductSelect={handleProductSelect}
              className="mt-4"
            />
          </div>
        </div>

        {/* Planogram Editor */}
        <div className="lg:col-span-8">
          <Heading level={2} size="h3">Layout Design</Heading>
          <Text className="text-muted-foreground">
            Fixture dimensions: {fixture.dimensions.width}" × {fixture.dimensions.height}"
          </Text>
          
          <PlanogramEditor
            width={fixture.dimensions.width}
            height={fixture.dimensions.height}
            onSave={onSavePlanogram}
            className="mt-4"
          />
        </div>
      </div>
    </div>
  )
}