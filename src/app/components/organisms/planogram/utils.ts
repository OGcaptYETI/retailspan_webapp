// File: src/app/components/organisms/planogram/utils.ts
import type { Product } from "@/types/supabase"

export interface Position {
  x: number
  y: number
}

export interface Dimensions {
  width: number
  height: number
  depth: number
}

export interface FixtureBounds {
  width: number
  height: number
}

// Convert real dimensions to canvas pixels
export function toCanvasScale(value: number, pixelsPerInch: number = 10): number {
  return value * pixelsPerInch
}

// Convert canvas pixels to real dimensions
export function fromCanvasScale(value: number, pixelsPerInch: number = 10): number {
  return value / pixelsPerInch
}

// Check if a product can fit at a given position
export function canProductFit(
  product: Product,
  position: Position,
  fixtureBounds: FixtureBounds,
  existingPlacements: Array<{ product: Product; position: Position }>,
  pixelsPerInch: number = 10
): boolean {
  // Convert product dimensions to canvas scale
  const productWidth = toCanvasScale(product.dimensions.width)
  const productHeight = toCanvasScale(product.dimensions.height)

  // Check fixture boundaries
  if (
    position.x < 0 ||
    position.y < 0 ||
    position.x + productWidth > fixtureBounds.width ||
    position.y + productHeight > fixtureBounds.height
  ) {
    return false
  }

  // Check collisions with existing products
  return !existingPlacements.some(placement => {
    const placementWidth = toCanvasScale(placement.product.dimensions.width)
    const placementHeight = toCanvasScale(placement.product.dimensions.height)

    return !(
      position.x + productWidth <= placement.position.x ||
      position.x >= placement.position.x + placementWidth ||
      position.y + productHeight <= placement.position.y ||
      position.y >= placement.position.y + placementHeight
    )
  })
}

// Find the nearest valid position for a product
export function findNearestValidPosition(
  product: Product,
  position: Position,
  fixtureBounds: FixtureBounds,
  existingPlacements: Array<{ product: Product; position: Position }>,
  gridSize: number = 10
): Position {
  // Implementation of grid-based placement algorithm
  const maxIterations = 100
  let iteration = 0
  let currentPosition = { ...position }
  
  while (iteration < maxIterations) {
    if (canProductFit(product, currentPosition, fixtureBounds, existingPlacements)) {
      return currentPosition
    }

    // Try moving in different directions on the grid
    currentPosition = {
      x: Math.round((position.x + (iteration * gridSize)) / gridSize) * gridSize,
      y: Math.round((position.y + (iteration * gridSize)) / gridSize) * gridSize,
    }

    iteration++
  }

  return position // Return original position if no valid position found
}