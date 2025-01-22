import type { KonvaEventObject } from 'konva/lib/Node'

// Position and Dimensions
export interface Point {
  x: number
  y: number
}

export interface Size {
  width: number
  height: number
}

export interface Rect extends Point, Size {}

export interface Transform {
  x: number
  y: number
  scaleX: number
  scaleY: number
  rotation: number
  skewX: number
  skewY: number
}

// Grid Helpers
export interface GridConfig {
  size: number
  enabled: boolean
  snapToGrid: boolean
  color: string
  opacity: number
}

// Event Handlers
export type DragEventHandler = (e: KonvaEventObject<DragEvent>) => void
export type MouseEventHandler = (e: KonvaEventObject<MouseEvent>) => void
export type TouchEventHandler = (e: KonvaEventObject<TouchEvent>) => void

// Snap Functions
export interface SnapConfig {
  threshold: number
  enabled: boolean
}

// Layer Types
export interface LayerConfig {
  id: string
  name: string
  visible: boolean
  locked: boolean
  opacity: number
}

// Selection Types
export interface SelectionRect {
  x1: number
  y1: number
  x2: number
  y2: number
}

// Zoom and Pan
export interface ViewportConfig {
  scale: number
  x: number
  y: number
  minScale: number
  maxScale: number
}

// Utility Types
export type Direction = 'horizontal' | 'vertical'
export type Alignment = 'start' | 'center' | 'end'
export type DistributeBy = 'spacing' | 'position'

// Shape Properties
export interface ShapeProps extends Point, Size {
  rotation?: number
  fill?: string
  stroke?: string
  strokeWidth?: number
  draggable?: boolean
  opacity?: number
}