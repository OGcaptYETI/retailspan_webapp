"use client"

import React, { useState, useCallback } from "react"
import { Input } from "@/app/components/atoms/inputs"
import { Button } from "@/app/components/atoms/buttons"
import { Text, Heading } from "@/app/components/atoms/typography"
import { createClientSupabaseClient } from "@/lib/supabase/client"
import { toast } from "sonner"

interface Product {
  id: string
  sku: string
  brand: string
  name: string
  cost: number
  wholesale_cost?: number
  margin_override?: number
}

interface WholesaleCostInputProps {
  selectedProducts: Product[]
  onUpdate: (products: Product[]) => Promise<void>
}

const calculateMargin = (product: Product): number => {
  if (product.wholesale_cost) {
    return ((product.cost - product.wholesale_cost) / product.cost) * 100
  }
  return 0
}

export function WholesaleCostInput({ selectedProducts, onUpdate }: WholesaleCostInputProps) {
    const [products, setProducts] = useState<Product[]>(selectedProducts)
    const [batchMode, setBatchMode] = useState<'cost' | 'margin' | null>(null)
    const [batchValue, setBatchValue] = useState<number>(0)
    const [isLoading, setIsLoading] = useState(false)
  
    const supabase = createClientSupabaseClient()
  
    const handleSave = async () => {
      setIsLoading(true)
      try {
        // Update products in Supabase
        const { error } = await supabase
          .from('products')
          .upsert(
            products.map(p => ({
              id: p.id,
              wholesale_cost: p.wholesale_cost,
              margin_override: p.margin_override
            }))
          )
  
        if (error) throw error
        
        await onUpdate(products)
        toast.success("Wholesale costs updated successfully")
      } catch (error) {
        console.error("Error saving wholesale costs:", error)
        toast.error("Failed to update wholesale costs")
      } finally {
        setIsLoading(false)
      }
    }

  const handleCostChange = useCallback((productId: string, value: number) => {
    setProducts(prev => 
      prev.map(p => 
        p.id === productId 
          ? { ...p, wholesale_cost: value, margin_override: undefined }
          : p
      )
    )
  }, [])

  const handleMarginChange = useCallback((productId: string, value: number) => {
    setProducts(prev =>
      prev.map(p =>
        p.id === productId
          ? { ...p, margin_override: value, wholesale_cost: undefined }
          : p
      )
    )
  }, [])

  const applyBatchUpdate = useCallback(() => {
    if (!batchMode || batchValue === 0) return

    setProducts(prev =>
      prev.map(p => ({
        ...p,
        ...(batchMode === 'cost' 
          ? { wholesale_cost: batchValue, margin_override: undefined }
          : { margin_override: batchValue, wholesale_cost: undefined })
      }))
    )
    setBatchMode(null)
    setBatchValue(0)
  }, [batchMode, batchValue])

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Heading level={2}>Wholesale Cost Input</Heading>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setBatchMode('cost')}
            disabled={isLoading}
          >
            Batch Update Cost
          </Button>
          <Button
            variant="outline"
            onClick={() => setBatchMode('margin')}
            disabled={isLoading}
          >
            Batch Update Margin
          </Button>
        </div>
      </div>

      {batchMode && (
        <div className="flex gap-2 items-center bg-muted p-2 rounded">
          <Text>Enter {batchMode === 'cost' ? 'wholesale cost' : 'margin %'}: </Text>
          <Input
            type="number"
            value={batchValue}
            onChange={(e) => setBatchValue(Number(e.target.value))}
            className="w-32"
          />
          <Button onClick={applyBatchUpdate}>Apply</Button>
          <Button variant="ghost" onClick={() => setBatchMode(null)}>Cancel</Button>
        </div>
      )}

      <div className="border rounded-md">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="p-2 text-left">SKU</th>
              <th className="p-2 text-left">Brand</th>
              <th className="p-2 text-left">Product</th>
              <th className="p-2 text-right">Cost</th>
              <th className="p-2 text-right">Wholesale Cost</th>
              <th className="p-2 text-right">Margin %</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-t">
                <td className="p-2">{product.sku}</td>
                <td className="p-2">{product.brand}</td>
                <td className="p-2">{product.name}</td>
                <td className="p-2 text-right">${product.cost.toFixed(2)}</td>
                <td className="p-2">
                  <Input
                    type="number"
                    value={product.wholesale_cost || ''}
                    onChange={(e) => handleCostChange(product.id, Number(e.target.value))}
                    className="w-32 text-right"
                    placeholder="Enter cost"
                  />
                </td>
                <td className="p-2">
                  <Input
                    type="number"
                    value={product.margin_override || calculateMargin(product)}
                    onChange={(e) => handleMarginChange(product.id, Number(e.target.value))}
                    className="w-24 text-right"
                    placeholder="Enter %"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end gap-2">
        <Button
          variant="default"
          onClick={handleSave}
          disabled={isLoading}
        >
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  )
}