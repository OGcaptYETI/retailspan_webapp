/**
 * Planogram status options
 */
export type PlanogramStatus = 'draft' | 'active' | 'archived'

/**
 * Position in 2D/3D space
 */
export interface Position {
  x: number
  y: number
  z?: number
}

/**
 * Dimensions for fixtures and products
 */
export interface Dimensions {
  width: number
  height: number
  depth: number
}

/**
 * Base product layout information
 */
export interface ProductLayout {
  id: string
  x: number
  y: number
  rotation?: number
  facings?: number
}

/**
 * Shelf configuration
 */
export interface ShelfLayout {
  id: string
  y: number
  height: number
  depth?: number
  weight_capacity?: number
}

/**
 * Complete planogram layout data
 */
export interface PlanogramLayout {
  products: ProductLayout[]
  shelves?: ShelfLayout[]
}

/**
 * Extended product data for planogram
 */
export interface PlanogramProduct extends ProductLayout {
  position: Position
  productId: string
  width: number
  height: number
  depth?: number
  rotation: number
  facings: number
  weight?: number
  metadata?: {
    name: string
    brand: string
    category: string
    price?: number
  }
}

/**
 * Extended shelf data for planogram
 */
export interface PlanogramShelf extends ShelfLayout {
  product_ids?: string[]
  max_weight?: number
  metadata?: {
    type: string
    material: string
    color?: string
  }
}

/**
 * Main planogram entity
 */
export interface Planogram {
  id: string
  created_at: string
  updated_at: string
  name: string
  description: string | null
  width: number
  height: number
  depth: number
  fixture_type: string
  layout_data: PlanogramLayout
  status: PlanogramStatus
  organization_id: string
  created_by: string
  updated_by: string
  version?: number
  metadata?: {
    store_id?: string
    department?: string
    category?: string
    season?: string
  }
}

/**
 * Current state of planogram
 */
export interface PlanogramState {
  products: PlanogramProduct[]
  shelves: PlanogramShelf[]
  dimensions: Dimensions
  metadata?: {
    last_modified: string
    modified_by: string
    version: number
  }
}

/**
 * Partial update type for planogram
 */
export type PlanogramUpdate = Partial<Planogram>

/**
 * Fixture types available
 */
export type FixtureType = 'shelf' | 'pegboard' | 'slatwall' | 'custom'