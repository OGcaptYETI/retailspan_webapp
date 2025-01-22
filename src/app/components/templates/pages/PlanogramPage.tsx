// app/components/templates/pages/PlanogramPage.tsx

import * as React from "react"
import { Heading, Text } from "@/app/components/atoms/typography"
import { Breadcrumbs, type BreadcrumbItem } from "@/app/components/molecules/navigation"
import { ProductGrid } from "@/app/components/organisms"
import type { Fixture } from "@/types/models/fixtures"
import type { BaseProduct, ProductGridItem } from "@/types/models/products"
import { cn } from "@/lib/utils/cn"
import { toast } from "sonner"
import type { PlanogramState } from "@/types/components/planogram"
import { PlanogramEditor } from "@/app/components/templates/pages/ClientPlanogramEditor"

// Define the props interface for the page component
export interface PlanogramPageProps {
  fixture: Fixture
  products?: BaseProduct[]
  initialState?: PlanogramState
  className?: string
  // Optional callback when planogram is saved
  onSave?: (state: PlanogramState) => Promise<void>
}

export function PlanogramPage({
  fixture,
  products = [],
  initialState,
  className,
  onSave,
}: PlanogramPageProps) {
  // Set up navigation breadcrumbs
  const breadcrumbs: BreadcrumbItem[] = [
    { label: "Fixtures", href: "/fixtures" },
    { label: fixture.name, href: `/fixtures/${fixture.id}` },
    { label: "Planogram", href: `/fixtures/${fixture.id}/planogram` },
  ]

  // Track current planogram state
  const [currentState, setCurrentState] = React.useState<PlanogramState | undefined>(initialState)

  // Handle saving the planogram
  const handleSave = React.useCallback(async (state: PlanogramState) => {
    try {
      setCurrentState(state)
      if (onSave) {
        await onSave(state)
      }
      toast.success("Planogram saved successfully")
    } catch (error) {
      console.error("Failed to save planogram:", error)
      toast.error("Failed to save planogram")
      // Optionally revert state on error
      setCurrentState(initialState)
    }
  }, [initialState, onSave])

  // Handle drag start for products
  const handleProductDragStart = React.useCallback((product: ProductGridItem, event: React.DragEvent) => {
    if (!event.dataTransfer) return
    
    // Set drag data as JSON string
    const data = JSON.stringify(product)
    event.dataTransfer.setData("application/json", data)
    
    // Set drag effect
    event.dataTransfer.effectAllowed = "copy"
  }, [])

  return (
    <div className={cn("flex flex-col gap-6 p-6", className)}>
      {/* Page Header Section */}
      <div className="flex flex-col gap-2">
        <Breadcrumbs items={breadcrumbs} />
        <div className="flex items-center justify-between">
          <Heading>Edit Planogram</Heading>
        </div>
        <Text className="text-muted-foreground">
          Design the product layout for {fixture.name}
        </Text>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[300px,1fr] gap-6">
        {/* Product Selection Sidebar */}
        <div className="flex flex-col gap-4">
          <Heading level={2} size="h6">Available Products</Heading>
          <div className="bg-background rounded-lg border p-4">
            <ProductGrid
              products={products}
              draggable
              onDragStart={handleProductDragStart}
              className="grid-cols-2"
            />
          </div>
        </div>

        {/* Planogram Editor Main Area */}
        <div className="flex flex-col gap-4">
          <div className="bg-background rounded-lg border p-4 flex-1 min-h-[600px]">
            <PlanogramEditor
              products={products}
              initialState={currentState}
              onSave={handleSave}
              className="w-full h-full"
            />
          </div>
        </div>
      </div>

      {/* Optional debug panel for development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 p-4 bg-background border rounded-lg shadow-lg">
          <Text size="sm" className="font-mono">
            Products: {products.length} | 
            Placed: {currentState?.products.length ?? 0}
          </Text>
        </div>
      )}
    </div>
  )
}