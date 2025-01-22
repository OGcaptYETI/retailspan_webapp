// File: src/app/components/organisms/planogram/PlanogramEditor.tsx
import * as React from "react"
import { toast } from "sonner"
import type { Product } from "@/types/supabase"
import { PlanogramCanvas, type ProductPlacement } from "./PlanogramCanvas"
import { PlanogramToolbar } from "./PlanogramToolbar"
import { cn } from "@/lib/utils/cn"

const ZOOM_FACTOR = 1.2
const MIN_ZOOM = 0.5
const MAX_ZOOM = 3

export interface PlanogramEditorProps {
  width: number // Fixture width in inches
  height: number // Fixture height in inches
  initialPlacements?: ProductPlacement[]
  onSave?: (placements: ProductPlacement[]) => Promise<void>
  className?: string
}

export function PlanogramEditor({
  width,
  height,
  initialPlacements = [],
  onSave,
  className,
}: PlanogramEditorProps) {
  const [placements, setPlacements] = React.useState<ProductPlacement[]>(initialPlacements)
  const [zoom, setZoom] = React.useState(1)
  const [showGrid, setShowGrid] = React.useState(true)
  const [isSelectMode, setIsSelectMode] = React.useState(false)
  const [selectedProductId, setSelectedProductId] = React.useState<string | null>(null)
  const [isSaving, setIsSaving] = React.useState(false)

  // Handle zooming
  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev * ZOOM_FACTOR, MAX_ZOOM))
  }

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev / ZOOM_FACTOR, MIN_ZOOM))
  }

  // Handle resetting view
  const handleReset = () => {
    setZoom(1)
    setShowGrid(true)
    setIsSelectMode(false)
    setSelectedProductId(null)
  }

  // Handle saving
  const handleSave = async () => {
    if (!onSave) return
    
    try {
      setIsSaving(true)
      await onSave(placements)
      toast.success("Planogram saved successfully")
    } catch (error) {
      console.error("Error saving planogram:", error)
      toast.error("Failed to save planogram")
    } finally {
      setIsSaving(false)
    }
  }

  // Handle product placement
  const handleProductDrop = (product: Product, x: number, y: number) => {
    setPlacements(prev => [...prev, { product, position: { x, y } }])
  }

  // Handle product selection
  const handleProductSelect = (productId: string) => {
    if (!isSelectMode) return
    setSelectedProductId(productId)
  }

  // Handle deleting selected product
  const handleDelete = () => {
    if (!selectedProductId) return
    setPlacements(prev => prev.filter(p => p.product.id !== selectedProductId))
    setSelectedProductId(null)
  }

  return (
    <div className={cn("space-y-4", className)}>
      <PlanogramToolbar
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onReset={handleReset}
        onSave={handleSave}
        onToggleGrid={() => setShowGrid(!showGrid)}
        showGrid={showGrid}
        onToggleSelect={() => setIsSelectMode(!isSelectMode)}
        isSelectMode={isSelectMode}
        onDelete={handleDelete}
        canDelete={!!selectedProductId}
      />

      <div className="relative border rounded-lg overflow-hidden">
        <PlanogramCanvas
          width={width}
          height={height}
          placements={placements}
          onProductDrop={handleProductDrop}
          onProductSelect={handleProductSelect}
          showGrid={showGrid}
          zoom={zoom}
          selectedProductId={selectedProductId}
          className="w-full"
        />

        {isSaving && (
          <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        )}
      </div>
    </div>
  )
}