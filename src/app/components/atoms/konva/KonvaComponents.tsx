// app/components/atoms/konva/KonvaComponents.tsx
'use client'

import dynamic from 'next/dynamic'
import type { ComponentType } from 'react'
import type Konva from 'konva'
import type { StageProps } from 'react-konva'

// Create a consistent loading component for all Konva elements
const LoadingComponent = () => (
  <div className="w-full h-full flex items-center justify-center p-4 bg-gray-100 rounded">
    <span className="text-gray-600">Loading canvas...</span>
  </div>
)

// Error boundary component to handle loading failures gracefully
const ErrorComponent = () => (
  <div className="w-full h-full flex items-center justify-center p-4 bg-red-50 rounded">
    <span className="text-red-600">Failed to load canvas component</span>
  </div>
)

// Dynamically import each Konva component to ensure they only load on the client side
export const KonvaStage: ComponentType<StageProps> = dynamic(
  () => import('react-konva').then(mod => mod.Stage),
  { 
    ssr: false, 
    loading: () => <LoadingComponent />,
  }
)

export const KonvaLayer: ComponentType<Konva.LayerConfig> = dynamic(
  () => import('react-konva').then(mod => mod.Layer),
  { 
    ssr: false, 
    loading: () => <LoadingComponent />,
    
  }
)

export const KonvaRect: ComponentType<Konva.RectConfig> = dynamic(
  () => import('react-konva').then(mod => mod.Rect),
  { 
    ssr: false, 
    loading: () => <LoadingComponent />,
    
  }
)

export const KonvaGroup: ComponentType<Konva.GroupConfig> = dynamic(
  () => import('react-konva').then(mod => mod.Group),
  { 
    ssr: false, 
    loading: () => <LoadingComponent />,
   
  }
)

export const KonvaText: ComponentType<Konva.TextConfig> = dynamic(
  () => import('react-konva').then(mod => mod.Text),
  { 
    ssr: false, 
    loading: () => <LoadingComponent />,
   
  }
)

export const KonvaTransformer: ComponentType<Konva.TransformerConfig> = dynamic(
  () => import('react-konva').then(mod => mod.Transformer),
  { 
    ssr: false, 
    loading: () => <LoadingComponent />,
   
  }
)