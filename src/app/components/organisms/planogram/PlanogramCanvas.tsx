// app/components/organisms/planogram/PlanogramCanvas.tsx
'use client'

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type Konva from 'konva'
import type { KonvaEventObject } from 'konva/lib/Node'
import type { Position, PlanogramState } from '@/types/components/planogram'
import type { BaseProduct } from '@/types/models/products'
import dynamic from 'next/dynamic'

// Dynamic imports with unique names
const KonvaStage = dynamic(() => import('react-konva').then(mod => mod.Stage), { ssr: false })
const KonvaLayer = dynamic(() => import('react-konva').then(mod => mod.Layer), { ssr: false })
const KonvaRect = dynamic(() => import('react-konva').then(mod => mod.Rect), { ssr: false })
const KonvaGroup = dynamic(() => import('react-konva').then(mod => mod.Group), { ssr: false })
const KonvaText = dynamic(() => import('react-konva').then(mod => mod.Text), { ssr: false })
const KonvaTransformer = dynamic(() => import('react-konva').then(mod => mod.Transformer), { ssr: false })

interface PlanogramCanvasProps {
  width: number
  height: number
  products: BaseProduct[]
  state: PlanogramState
  scale: number
  showGrid?: boolean
  gridSize?: number
  onProductMove: (id: string, x: number, y: number) => void
  onProductDrop: (product: BaseProduct, position: Position) => void
  onProductRotate: (id: string) => void
  onProductFacings: (id: string, facings: number) => void
  onProductDelete: (id: string) => void
}

export function PlanogramCanvas({
  width,
  height,
  products,
  state,
  scale = 1,
  showGrid = true,
  gridSize = 20,
  onProductMove,
  onProductDrop,
  onProductRotate,
  onProductFacings,
  onProductDelete,
}: PlanogramCanvasProps) {
  const transformerRef = useRef<Konva.Transformer | null>(null)
  const stageRef = useRef<Konva.Stage | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const handleDragEnd = useCallback(
    (e: KonvaEventObject<DragEvent>, productId: string) => {
      const node = e.target
      const x = Math.round(node.x() / gridSize) * gridSize
      const y = Math.round(node.y() / gridSize) * gridSize
      onProductMove(productId, x, y)
    },
    [gridSize, onProductMove]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      const stage = stageRef.current
      if (!stage) return
      const pos = stage.getPointerPosition()
      if (!pos) return

      try {
        const productData = JSON.parse(e.dataTransfer.getData('application/json'))
        const stageBox = stage.container().getBoundingClientRect()
        const x = Math.round((pos.x - stageBox.left) / scale / gridSize) * gridSize
        const y = Math.round((pos.y - stageBox.top) / scale / gridSize) * gridSize
        onProductDrop(productData, { x, y })
      } catch (err) {
        console.error('Drop error:', err)
      }
    },
    [scale, gridSize, onProductDrop]
  )

  const handleSelect = useCallback((id: string | null) => {
    setSelectedId(id)
    if (transformerRef.current) {
      const stage = transformerRef.current.getStage()
      if (!stage) return
      const selectedNode = id ? stage.findOne(`#${id}`) : null
      transformerRef.current.nodes(selectedNode ? [selectedNode] : [])
    }
  }, [])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!selectedId) return

      switch (e.key.toLowerCase()) {
        case 'delete':
        case 'backspace':
          onProductDelete(selectedId)
          setSelectedId(null)
          break
        case 'r':
          onProductRotate(selectedId)
          break
        case '+':
        case '=': {
          const currentProduct = state.products.find((p) => p.id === selectedId)
          if (currentProduct) {
            onProductFacings(selectedId, (currentProduct.facings || 1) + 1)
          }
          break
        }
        case '-':
        case '_': {
          const product = state.products.find((p) => p.id === selectedId)
          if (product && (product.facings || 1) > 1) {
            onProductFacings(selectedId, (product.facings || 1) - 1)
          }
          break
        }
      }
    },
    [selectedId, state.products, onProductDelete, onProductRotate, onProductFacings]
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  const renderGrid = useMemo(() => {
    if (!showGrid) return null
    const gridLines = []
    for (let i = 0; i < width; i += gridSize) {
      gridLines.push(
        <KonvaRect key={`v${i}`} x={i} y={0} width={1} height={height} fill="#ddd" listening={false} />
      )
    }
    for (let i = 0; i < height; i += gridSize) {
      gridLines.push(
        <KonvaRect key={`h${i}`} x={0} y={i} width={width} height={1} fill="#ddd" listening={false} />
      )
    }
    return gridLines
  }, [width, height, gridSize, showGrid])

  const renderProducts = useMemo(() => {
    return state.products.map((product) => {
      const baseProduct = products.find((p) => p.id === product.productId)
      if (!baseProduct) return null

      const isSelected = selectedId === product.id
      const totalWidth = baseProduct.width * (product.facings || 1)

      return (
        <KonvaGroup
          key={product.id}
          id={product.id}
          x={product.position.x}
          y={product.position.y}
          rotation={product.rotation}
          draggable
          onClick={() => handleSelect(product.id)}
          onDragEnd={(e) => handleDragEnd(e, product.id)}
        >
          <KonvaRect
            width={totalWidth}
            height={baseProduct.height}
            fill={isSelected ? '#f0f9ff' : '#fff'}
            stroke="#333"
            strokeWidth={1}
          />
          <KonvaText
            text={baseProduct.name}
            width={totalWidth}
            height={baseProduct.height}
            align="center"
            verticalAlign="middle"
            fontSize={12}
            padding={4}
            wrap="word"
            listening={false}
          />
          <KonvaText
            text={`$${baseProduct.price.toFixed(2)}`}
            width={totalWidth}
            y={baseProduct.height - 20}
            align="center"
            fontSize={10}
            fill="#666"
            listening={false}
          />
          <KonvaText
            text={`×${product.facings || 1}`}
            width={totalWidth}
            y={4}
            align="right"
            fontSize={10}
            padding={4}
            fill="#666"
            listening={false}
          />
        </KonvaGroup>
      )
    })
  }, [state.products, products, selectedId, handleSelect, handleDragEnd])

  return (
    <div className="relative w-full h-full">
      <KonvaStage
        ref={stageRef}
        width={width * scale}
        height={height * scale}
        scale={{ x: scale, y: scale }}
        onDrop={handleDrop}
        onDragOver={(e: React.DragEvent<HTMLDivElement>) => e.preventDefault()}
        onClick={(e) => {
          if (e.target === e.target.getStage()) handleSelect(null)
        }}
      >
        <KonvaLayer>
          <KonvaRect width={width} height={height} fill="#fff" stroke="#ccc" strokeWidth={1} />
          {showGrid && renderGrid}
          {renderProducts}
          <KonvaTransformer
            ref={transformerRef}
            boundBoxFunc={(oldBox, newBox) => newBox}
            enabledAnchors={[]}
            rotateEnabled={false}
          />
        </KonvaLayer>
      </KonvaStage>
    </div>
  )
}