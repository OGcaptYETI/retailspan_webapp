// File: src/app/components/organisms/planogram/PlanogramCanvas.tsx
import * as React from "react"
import { Stage, Layer, Rect, Text as KonvaText, Group } from "react-konva"
import type { Product } from "@/types/supabase"
import { 
  toCanvasScale, 
  fromCanvasScale, 
  findNearestValidPosition,
  type Position,
  type FixtureBounds
} from "./utils"

export interface ProductPlacement {
  product: Product
  position: Position
}

export interface PlanogramCanvasProps {
  width: number // Fixture width in inches
  height: number // Fixture height in inches
  placements?: ProductPlacement[]
  onProductDrop?: (product: Product, x: number, y: number) => void
  gridSize?: number
  pixelsPerInch?: number
  className?: string
  zoom?: number
  showGrid?: boolean
  selectedProductId?: string | null
  onProductSelect?: (productId: string) => void
}

export function PlanogramCanvas({
  width,
  height,
  placements = [],
  gridSize = 10,
  pixelsPerInch = 10,
  className,
  zoom = 1,
  showGrid = true,
  selectedProductId = null,
  onProductSelect,
  onProductDrop,
}: PlanogramCanvasProps) {

  // Convert fixture dimensions to canvas pixels
  const canvasWidth = toCanvasScale(width, pixelsPerInch)
  const canvasHeight = toCanvasScale(height, pixelsPerInch)

  const fixtureBounds: FixtureBounds = {
    width: canvasWidth,
    height: canvasHeight
  }

  // Handle product dragging
  const handleDragStart = () => {
    // Drag start logic here if needed
  }
  
  const handleDragEnd = (product: Product, newX: number, newY: number) => {
    const position = findNearestValidPosition(
      product,
      { x: newX, y: newY },
      fixtureBounds,
      placements.filter(p => p.product.id !== product.id),
      gridSize
    )

    // Convert canvas coordinates back to real dimensions
    const realX = fromCanvasScale(position.x, pixelsPerInch)
    const realY = fromCanvasScale(position.y, pixelsPerInch)
    
    onProductDrop?.(product, realX, realY)
  }

  // Rest of the component remains the same...

  return (
    <Stage 
      width={canvasWidth} 
      height={canvasHeight}
      scaleX={zoom}
      scaleY={zoom}
      className={className}
    >
      <Layer>
        {/* Background */}
        <Rect
          x={0}
          y={0}
          width={canvasWidth}
          height={canvasHeight}
          fill="#f8f9fa"
          stroke="#e9ecef"
        />

        {/* Grid */}
        {showGrid && Array.from({ length: Math.floor(canvasWidth / gridSize) }).map((_, i) => (
          <Rect
            key={`vertical-${i}`}
            x={i * gridSize}
            y={0}
            width={1}
            height={canvasHeight}
            fill="#e9ecef"
          />
        ))}
        {showGrid && Array.from({ length: Math.floor(canvasHeight / gridSize) }).map((_, i) => (
          <Rect
            key={`horizontal-${i}`}
            x={0}
            y={i * gridSize}
            width={canvasWidth}
            height={1}
            fill="#e9ecef"
          />
        ))}

        {/* Product Placements */}
        {placements.map(({ product, position }) => {
          const width = toCanvasScale(product.dimensions.width, pixelsPerInch)
          const height = toCanvasScale(product.dimensions.height, pixelsPerInch)

          return (
            <Group
              key={product.id}
              x={toCanvasScale(position.x, pixelsPerInch)}
              y={toCanvasScale(position.y, pixelsPerInch)}
              width={width}
              height={height}
              draggable
              onDragStart={handleDragStart}
              onDragEnd={(e) => handleDragEnd(product, e.target.x(), e.target.y())}
              onClick={() => onProductSelect?.(product.id)}
            >
              <Rect
                width={width}
                height={height}
                fill="#fff"
                stroke={selectedProductId === product.id ? "#3b82f6" : "#cbd5e1"}
                strokeWidth={selectedProductId === product.id ? 2 : 1}
                shadowColor={selectedProductId === product.id ? "rgba(59, 130, 246, 0.5)" : undefined}
                shadowBlur={selectedProductId === product.id ? 4 : 0}
                shadowOffset={selectedProductId === product.id ? { x: 0, y: 2 } : undefined}
                cornerRadius={4}
              />
              <KonvaText
                text={product.name}
                fontSize={12}
                fill="#64748b"
                width={width}
                height={20}
                align="center"
                verticalAlign="middle"
                padding={4}
              />
            </Group>
          )
        })}
      </Layer>
    </Stage>
  )
}