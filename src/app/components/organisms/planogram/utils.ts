"use client"

import type { Product } from "@/types/models/products"

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
  if (value < 0) throw new Error("Value cannot be negative")
  return Math.round(value * pixelsPerInch)
}

// Convert canvas pixels to real dimensions
export function fromCanvasScale(value: number, pixelsPerInch: number = 10): number {
  if (value < 0) throw new Error("Value cannot be negative")
  return Math.round(value / pixelsPerInch * 100) / 100 // Round to 2 decimal places
}

// Check if a product can fit at a given position
export function canProductFit(
  product: Product,
  position: Position,
  fixtureBounds: FixtureBounds,
  existingPlacements: Array<{ product: Product; position: Position }>,
  pixelsPerInch: number = 10
): boolean {
  if (!product.dimensions) return false

  try {
    // Convert product dimensions to canvas scale
    const productWidth = toCanvasScale(product.dimensions.width, pixelsPerInch)
    const productHeight = toCanvasScale(product.dimensions.height, pixelsPerInch)

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
      if (!placement.product.dimensions) return false

      const placementWidth = toCanvasScale(placement.product.dimensions.width, pixelsPerInch)
      const placementHeight = toCanvasScale(placement.product.dimensions.height, pixelsPerInch)

      return !(
        position.x + productWidth <= placement.position.x ||
        position.x >= placement.position.x + placementWidth ||
        position.y + productHeight <= placement.position.y ||
        position.y >= placement.position.y + placementHeight
      )
    })
  } catch (error) {
    console.error("Error checking product fit:", error)
    return false
  }
}

// Find the nearest valid position for a product
export function findNearestValidPosition(
  product: Product,
  position: Position,
  fixtureBounds: FixtureBounds,
  existingPlacements: Array<{ product: Product; position: Position }>,
  gridSize: number = 10
): Position {
  if (!product.dimensions) return position

  try {
    // Snap to grid first
    const snappedPosition = {
      x: Math.round(position.x / gridSize) * gridSize,
      y: Math.round(position.y / gridSize) * gridSize,
    }

    // If snapped position works, use it
    if (canProductFit(product, snappedPosition, fixtureBounds, existingPlacements)) {
      return snappedPosition
    }

    // Search pattern: spiral out from the target position
    const maxIterations = 100
    const directions = [
      { x: 0, y: -1 },  // up
      { x: 1, y: 0 },   // right
      { x: 0, y: 1 },   // down
      { x: -1, y: 0 },  // left
    ]

    let currentPosition = { ...snappedPosition }
    let steps = 1
    let directionIndex = 0
    let stepCount = 0

    for (let i = 0; i < maxIterations; i++) {
      // Try current position
      if (canProductFit(product, currentPosition, fixtureBounds, existingPlacements)) {
        return currentPosition
      }

      // Move in current direction
      currentPosition = {
        x: currentPosition.x + (directions[directionIndex].x * gridSize),
        y: currentPosition.y + (directions[directionIndex].y * gridSize),
      }

      stepCount++
      if (stepCount === steps) {
        stepCount = 0
        directionIndex = (directionIndex + 1) % 4
        if (directionIndex === 0 || directionIndex === 2) {
          steps++ // Increase steps after completing a horizontal line
        }
      }
    }

    // If no position found, return original snapped position
    return snappedPosition
  } catch (error) {
    console.error("Error finding valid position:", error)
    return position
  }
}

// Calculate overlap area between two rectangles
export function calculateOverlap(
  rect1: { x: number; y: number; width: number; height: number },
  rect2: { x: number; y: number; width: number; height: number }
): number {
  const xOverlap = Math.max(0,
    Math.min(rect1.x + rect1.width, rect2.x + rect2.width) -
    Math.max(rect1.x, rect2.x)
  )

  const yOverlap = Math.max(0,
    Math.min(rect1.y + rect1.height, rect2.y + rect2.height) -
    Math.max(rect1.y, rect2.y)
  )

  return xOverlap * yOverlap
}

// Get the grid cell for a given position
export function getGridCell(position: Position, gridSize: number): Position {
  return {
    x: Math.floor(position.x / gridSize),
    y: Math.floor(position.y / gridSize),
  }
}

// Convert grid cell to position
export function gridCellToPosition(cell: Position, gridSize: number): Position {
  return {
    x: cell.x * gridSize,
    y: cell.y * gridSize,
  }
}