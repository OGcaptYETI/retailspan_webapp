// app/components/organisms/planogram/PlanogramCanvas.tsx

'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import type Konva from 'konva';
import type { KonvaEventObject } from 'konva/lib/Node';
import { Position, PlanogramState, Dimensions } from './types';
import type { BaseProduct } from '@/types/models/products';

// Dynamically import Konva components with error fallbacks for better error handling
const Stage = dynamic(() => 
  import('react-konva').then((mod) => mod.Stage)
  .catch(() => ({ default: () => null })), 
  { ssr: false, loading: () => <div>Loading Stage...</div> }
);

const Layer = dynamic(() => 
  import('react-konva').then((mod) => mod.Layer)
  .catch(() => ({ default: () => null })), 
  { ssr: false }
);

const Rect = dynamic(() => 
  import('react-konva').then((mod) => mod.Rect)
  .catch(() => ({ default: () => null })), 
  { ssr: false }
);

const Group = dynamic(() => 
  import('react-konva').then((mod) => mod.Group)
  .catch(() => ({ default: () => null })), 
  { ssr: false }
);

const Text = dynamic(() => 
  import('react-konva').then((mod) => mod.Text)
  .catch(() => ({ default: () => null })), 
  { ssr: false }
);

const Transformer = dynamic(() => 
  import('react-konva').then((mod) => mod.Transformer)
  .catch(() => ({ default: () => null })), 
  { ssr: false }
);

interface PlanogramCanvasProps {
  width: number;
  height: number;
  products: BaseProduct[];
  state: PlanogramState;
  scale: number;
  showGrid?: boolean;
  gridSize?: number;
  onProductMove: (id: string, x: number, y: number) => void;
  onProductDrop: (product: BaseProduct, position: Position) => void;
  onProductRotate: (id: string) => void;
  onProductFacings: (id: string, facings: number) => void;
  onProductDelete: (id: string) => void;
}

// Loading component for better UX
const LoadingCanvas = () => (
  <div className="w-full h-full flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
  </div>
);

// Error component for better error handling
const ErrorCanvas = ({ message }: { message: string }) => (
  <div className="w-full h-full flex items-center justify-center text-red-500">
    {message}
  </div>
);

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
  const transformerRef = useRef<Konva.Transformer | null>(null);
  const stageRef = useRef<Konva.Stage | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize component and handle loading state
  useEffect(() => {
    try {
      // Verify Konva is available in the window object
      if (typeof window !== 'undefined' && !window.Konva) {
        throw new Error('Konva library not loaded');
      }
      setIsLoaded(true);
    } catch (error) {
      setHasError(true);
      setErrorMessage(error instanceof Error ? error.message : 'Failed to initialize canvas');
    }
  }, []);

  // Enhanced drag end handler with error boundary
  const handleDragEnd = useCallback(
    (e: KonvaEventObject<DragEvent>, productId: string) => {
      try {
        const node = e.target;
        const x = Math.round(node.x() / gridSize) * gridSize;
        const y = Math.round(node.y() / gridSize) * gridSize;
        onProductMove(productId, x, y);
      } catch (error) {
        console.error('Drag error:', error);
        setHasError(true);
        setErrorMessage('Error moving product');
      }
    },
    [gridSize, onProductMove]
  );

  // Enhanced drop handler with better error handling
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const stage = stageRef.current;
      if (!stage) return;
      const pos = stage.getPointerPosition();
      if (!pos) return;

      try {
        const productData = JSON.parse(e.dataTransfer.getData('application/json'));
        const stageBox = stage.container().getBoundingClientRect();
        const x = Math.round((pos.x - stageBox.left) / scale / gridSize) * gridSize;
        const y = Math.round((pos.y - stageBox.top) / scale / gridSize) * gridSize;
        onProductDrop(productData, { x, y });
      } catch (err) {
        console.error('Drop error:', err);
        setHasError(true);
        setErrorMessage('Error dropping product');
      }
    },
    [scale, gridSize, onProductDrop]
  );

  // Enhanced select handler with transformer error handling
  const handleSelect = useCallback((id: string | null) => {
    try {
      setSelectedId(id);
      if (transformerRef.current) {
        const stage = transformerRef.current.getStage();
        if (!stage) return;
        const selectedNode = id ? stage.findOne(`#${id}`) : null;
        transformerRef.current.nodes(selectedNode ? [selectedNode] : []);
      }
    } catch (error) {
      console.error('Selection error:', error);
      setHasError(true);
      setErrorMessage('Error selecting product');
    }
  }, []);

  // Enhanced keyboard handler with error boundary
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!selectedId) return;

      try {
        switch (e.key.toLowerCase()) {
          case 'delete':
          case 'backspace':
            onProductDelete(selectedId);
            setSelectedId(null);
            break;
          case 'r':
            onProductRotate(selectedId);
            break;
          case '+':
          case '=': {
            const currentProduct = state.products.find((p) => p.id === selectedId);
            if (currentProduct) {
              onProductFacings(selectedId, currentProduct.facings + 1);
            }
            break;
          }
          case '-':
          case '_': {
            const product = state.products.find((p) => p.id === selectedId);
            if (product && product.facings > 1) {
              onProductFacings(selectedId, product.facings - 1);
            }
            break;
          }
        }
      } catch (error) {
        console.error('Keyboard handler error:', error);
        setHasError(true);
        setErrorMessage('Error handling keyboard input');
      }
    },
    [selectedId, state.products, onProductDelete, onProductRotate, onProductFacings]
  );

  // Set up keyboard listeners
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Memoized grid rendering with error boundary
  const renderGrid = useMemo(() => {
    if (!showGrid) return null;
    try {
      const gridLines = [];
      for (let i = 0; i < width; i += gridSize) {
        gridLines.push(
          <Rect 
            key={`v${i}`} 
            x={i} 
            y={0} 
            width={1} 
            height={height} 
            fill="#ddd" 
            listening={false} 
          />
        );
      }
      for (let i = 0; i < height; i += gridSize) {
        gridLines.push(
          <Rect 
            key={`h${i}`} 
            x={0} 
            y={i} 
            width={width} 
            height={1} 
            fill="#ddd" 
            listening={false} 
          />
        );
      }
      return gridLines;
    } catch (error) {
      console.error('Grid rendering error:', error);
      setHasError(true);
      setErrorMessage('Error rendering grid');
      return null;
    }
  }, [width, height, gridSize, showGrid]);

  // Memoized product rendering with error boundary
  const renderProducts = useMemo(() => {
    try {
      return state.products.map((product) => {
        const baseProduct = products.find((p) => p.id === product.productId);
        if (!baseProduct) return null;

        const isSelected = selectedId === product.id;
        const totalWidth = baseProduct.width * product.facings;

        return (
          <Group
            key={product.id}
            id={product.id}
            x={product.position.x}
            y={product.position.y}
            rotation={product.rotation}
            draggable
            onClick={() => handleSelect(product.id)}
            onDragEnd={(e) => handleDragEnd(e, product.id)}
          >
            <Rect
              width={totalWidth}
              height={baseProduct.height}
              fill={isSelected ? '#f0f9ff' : '#fff'}
              stroke="#333"
              strokeWidth={1}
            />
            <Text
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
            <Text
              text={`$${baseProduct.price.toFixed(2)}`}
              width={totalWidth}
              y={baseProduct.height - 20}
              align="center"
              fontSize={10}
              fill="#666"
              listening={false}
            />
            <Text
              text={`×${product.facings}`}
              width={totalWidth}
              y={4}
              align="right"
              fontSize={10}
              padding={4}
              fill="#666"
              listening={false}
            />
          </Group>
        );
      });
    } catch (error) {
      console.error('Product rendering error:', error);
      setHasError(true);
      setErrorMessage('Error rendering products');
      return null;
    }
  }, [state.products, products, selectedId, handleSelect, handleDragEnd]);

  // Handle loading and error states
  if (hasError) {
    return <ErrorCanvas message={errorMessage} />;
  }

  if (!isLoaded) {
    return <LoadingCanvas />;
  }

  // Main render with error boundary
  return (
    <div className="relative w-full h-full">
      <Stage
        ref={stageRef}
        width={width * scale}
        height={height * scale}
        scale={{ x: scale, y: scale }}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={(e) => {
          if (e.target === e.target.getStage()) handleSelect(null);
        }}
      >
        <Layer>
          <Rect width={width} height={height} fill="#fff" stroke="#ccc" strokeWidth={1} />
          {showGrid && renderGrid}
          {renderProducts}
          <Transformer
            ref={transformerRef}
            boundBoxFunc={(oldBox, newBox) => newBox}
            enabledAnchors={[]}
            rotateEnabled={false}
          />
        </Layer>
      </Stage>
    </div>
  );
}

