'use client'

import * as React from "react"
import { Heading, Text } from "@/app/components/atoms/typography"
import { Breadcrumbs, type BreadcrumbItem } from "@/app/components/molecules/navigation"
import { ProductGrid } from "@/app/components/organisms"
import type { Fixture } from "@/types/models/fixtures"
import type { BaseProduct } from "@/types/models/products"
import { cn } from "@/lib/utils/cn"
import { toast } from "sonner"
import type { PlanogramState } from "@/types/components/planogram"
import { PlanogramEditor } from "@/app/components/templates/pages/ClientPlanogramEditor"

export interface PlanogramPageProps {
  fixture: Fixture
  products?: BaseProduct[]
  initialState?: PlanogramState
  className?: string
  onSave?: (state: PlanogramState) => Promise<void>
}

export function PlanogramPage({
  fixture,
  products = [],
  initialState,
  className,
  onSave,
}: PlanogramPageProps) {
  const breadcrumbs: BreadcrumbItem[] = [
    { label: "Fixtures", href: "/fixtures" },
    { label: fixture.name, href: `/fixtures/${fixture.id}` },
    { label: "Planogram", href: `/fixtures/${fixture.id}/planogram` },
  ]

  const [currentState, setCurrentState] = React.useState<PlanogramState | undefined>(initialState)

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
      setCurrentState(initialState)
    }
  }, [initialState, onSave])

  const gridItems = React.useMemo(() => {
    return products.map((product) => ({
      ...product,
    }))
  }, [products])

  return (
    <div className={cn("flex flex-col gap-8", className)}>
      <Breadcrumbs items={breadcrumbs} className="mb-4" />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="bg-background rounded-lg border p-4">
          <Heading level={2} className="mb-2 text-xl">
            Products
          </Heading>
          <ProductGrid
            products={gridItems}
            className="grid-cols-2"
          />
        </div>

        <div className="md:col-span-2 flex flex-col gap-4">
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

      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 p-4 bg-background border rounded-lg shadow-lg">
          <Text size="sm" className="font-mono">
            Products: {products.length} | Placed: {currentState?.products.length ?? 0}
          </Text>
        </div>
      )}
    </div>
  )
}