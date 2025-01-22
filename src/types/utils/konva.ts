import type { KonvaEventObject } from 'konva/lib/Node'
import type { Vector2d } from 'konva/lib/types'

// Base Types
export interface KonvaPoint {
  x: number
  y: number
}

export interface KonvaSize {
  width: number
  height: number
}

export interface KonvaRect extends KonvaPoint, KonvaSize {}

// Stage Types
export interface StageConfig {
  width: number
  height: number
  scale?: Vector2d
  position?: KonvaPoint
  draggable?: boolean
}

// Shape Types
export interface ShapeConfig extends KonvaRect {
  id?: string
  name?: string
  fill?: string
  stroke?: string
  strokeWidth?: number
  opacity?: number
  draggable?: boolean
  rotation?: number
}

// Planogram Specific Types
export interface PlanogramShelf extends ShapeConfig {
  type: 'shelf'
  maxWeight?: number
  depth?: number
}

export interface PlanogramProduct extends ShapeConfig {
  type: 'product'
  productId: string
  facings: number
  depth?: number
}

// Event Types
export type KonvaDragEvent = KonvaEventObject<DragEvent>
export type KonvaMouseEvent = KonvaEventObject<MouseEvent>
export type KonvaTouchEvent = KonvaEventObject<TouchEvent>

// Transform Types
export interface KonvaTransform {
  x: number
  y: number
  scaleX: number
  scaleY: number
  rotation: number
  skewX: number
  skewY: number
}

// Grid Types
export interface GridConfig {
  size: number
  snap: boolean
  color: string
  opacity: number
  visible: boolean
}

// Canvas Operation Types
export interface CanvasOperation {
  type: 'add' | 'remove' | 'move' | 'resize' | 'rotate'
  targetId: string
  properties: Partial<ShapeConfig>
  previousProperties?: Partial<ShapeConfig>
}

// Selection Types
export interface SelectionBounds {
  x1: number
  y1: number
  x2: number
  y2: number
}

// Zoom and Pan Types
export interface ViewportState {
  scale: number
  position: KonvaPoint
  bounds: KonvaRect
}

// Event Handler Types
export type ShapeEventHandler = (e: KonvaEventObject<Event>, shape: ShapeConfig) => void
export type SelectionEventHandler = (shapes: ShapeConfig[]) => void
export type ViewportEventHandler = (state: ViewportState) => void