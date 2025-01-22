// Base types
export * from './supabase'
export type { Json } from './supabase'

// Environment types
export type { Environment, ENV_KEY } from './environment'

// API types
export * from './api/requests'
export * from './api/responses'

// Component types
export * from './components/common'
export * from './components/planogram'
export * from './components/product'

// Model types
export * from './models/fixtures'
export * from './models/organization'
export * from './models/pricing'
export * from './models/user'

// Utility types
export * from './utils/helpers'
export type { GridConfig as KonvaGridConfig } from './utils/konva'

// External type re-exports
export type { ReactNode } from 'react'
import KonvaEventObject from 'konva'
export type { KonvaEventObject }

// Type helpers
export type NonNullable<T> = Exclude<T, null | undefined>
export type Optional<T> = T | undefined
export type Timestamp = string