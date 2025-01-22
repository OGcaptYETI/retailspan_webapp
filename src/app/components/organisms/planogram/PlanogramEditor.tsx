// app/components/organisms/planogram/PlanogramEditor.tsx
// app/components/organisms/planogram/PlanogramEditor.tsx
"use client"

import * as React from "react"
import { toast } from "sonner"
import { v4 as uuidv4 } from 'uuid'
import { PlanogramCanvas } from "./PlanogramCanvas"
import { PlanogramToolbar } from "./PlanogramToolbar"
import type { Position, PlanogramState, PlanogramProduct } from "@/types/components/planogram"
import { cn } from "@/lib/utils/cn"
import type { BaseProduct } from "@/types/models/products"
import dynamic from 'next/dynamic'

// Define the props interface for the component
interface PlanogramEditorProps {
  initialState?: PlanogramState
  products?: BaseProduct[]
  onSave?: (state: PlanogramState) => Promise<void>
  className?: string
}

// Default state for new planograms
const DEFAULT_STATE: PlanogramState = {
  products: [],
  shelves: [],
  dimensions: {
    width: 1200,
    height: 800,
    depth: 400,
  },
}

// Create the base editor component
function PlanogramEditorComponent({
  initialState,
  products = [],
  onSave,
  className,
}: PlanogramEditorProps) {
  // Initialize state with provided state or defaults
  const [state, setState] = React.useState<PlanogramState>(initialState ?? DEFAULT_STATE)

  // Manage zoom level for the canvas
  const [scale, setScale] = React.useState(1)
  
  // Maintain history for undo/redo
  const [history, setHistory] = React.useState<PlanogramState[]>([state])
  const [historyIndex, setHistoryIndex] = React.useState(0)

  // Update history when state changes
  const updateHistory = React.useCallback((newState: PlanogramState) => {
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1)
      return [...newHistory, newState]
    })
    setHistoryIndex(prev => prev + 1)
  }, [historyIndex])

  // Wrap setState to include history updates
  const safeSetState = React.useCallback((updater: (prev: PlanogramState) => PlanogramState) => {
    setState(prev => {
      const newState = updater(prev)
      updateHistory(newState)
      return newState
    })
  }, [updateHistory])

  const handleResetZoom = React.useCallback(() => {
    setScale(1)
  }, [])

  const handleProductDrop = React.useCallback(
    (product: BaseProduct, position: Position) => {
      if (!product?.id) {
        toast.error("Invalid product")
        return
      }

      const newProduct: PlanogramProduct = {
        id: uuidv4(),
        productId: product.id,
        x: Math.round(position.x / 20) * 20,
        y: Math.round(position.y / 20) * 20,
        position: {
          x: Math.round(position.x / 20) * 20,
          y: Math.round(position.y / 20) * 20,
          z: 0
        },
        width: product.width,
        height: product.height,
        depth: product.depth,
        rotation: 0,
        facings: 1,
        weight: product.weight ?? 0,
        metadata: {
          name: product.name,
          brand: product.brand,
          category: product.category,
          price: product.price
        }
      }

      safeSetState((prev) => ({
        ...prev,
        products: [...prev.products, newProduct]
      }))
    },
    [safeSetState]
  )

  const handleProductMove = React.useCallback(
    (id: string, x: number, y: number) => {
      safeSetState((prev) => ({
        ...prev,
        products: prev.products.map((prod) =>
          prod.id === id
            ? {
                ...prod,
                x,
                y,
                position: { x, y, z: prod.position.z }
              }
            : prod
        ),
      }))
    },
    [safeSetState]
  )

  const handleProductRotate = React.useCallback(
    (id: string) => {
      safeSetState((prev) => ({
        ...prev,
        products: prev.products.map((prod) =>
          prod.id === id
            ? {
                ...prod,
                rotation: (prod.rotation + 90) % 360
              }
            : prod
        ),
      }))
    },
    [safeSetState]
  )

  const handleProductFacings = React.useCallback(
    (id: string, facings: number) => {
      safeSetState((prev) => ({
        ...prev,
        products: prev.products.map((prod) =>
          prod.id === id
            ? {
                ...prod,
                facings: Math.max(1, facings)
              }
            : prod
        ),
      }))
    },
    [safeSetState]
  )

  const handleProductDelete = React.useCallback(
    (id: string) => {
      safeSetState((prev) => ({
        ...prev,
        products: prev.products.filter((prod) => prod.id !== id),
      }))
    },
    [safeSetState]
  )

  const handleSave = React.useCallback(async () => {
    try {
      if (onSave) {
        await onSave(state)
        toast.success("Planogram saved successfully")
      }
    } catch (error) {
      console.error("Save error:", error)
      toast.error("Failed to save planogram")
    }
  }, [state, onSave])

  const handleZoom = React.useCallback((newScale: number) => {
    setScale(Math.min(Math.max(0.1, newScale), 2))
  }, [])

  const handleUndo = React.useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(prev => prev - 1)
      setState(history[historyIndex - 1])
    }
  }, [history, historyIndex])

  const handleRedo = React.useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(prev => prev + 1)
      setState(history[historyIndex + 1])
    }
  }, [history, historyIndex])

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <PlanogramToolbar
        onSave={handleSave}
        scale={scale}
        onZoomIn={() => handleZoom(scale + 0.1)}
        onZoomOut={() => handleZoom(scale - 0.1)}
        onResetZoom={handleResetZoom}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        onUndo={handleUndo}
        onRedo={handleRedo}
      />
      
      <div className="flex-1 min-h-0 relative">
        <PlanogramCanvas
          width={state.dimensions.width}
          height={state.dimensions.height}
          products={products}
          state={state}
          scale={scale}
          onProductDrop={handleProductDrop}
          onProductMove={handleProductMove}
          onProductRotate={handleProductRotate}
          onProductFacings={handleProductFacings}
          onProductDelete={handleProductDelete}
        />
      </div>
    </div>
  )
}

// Create a dynamic version of the component with SSR disabled
const PlanogramEditor = dynamic(() => Promise.resolve(PlanogramEditorComponent), {
  ssr: false
})

// Export the dynamic version
export { PlanogramEditor }
export type { PlanogramEditorProps }