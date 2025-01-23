// app/components/organisms/pricing/PricingCalculator.tsx
"use client"

import React, { useState, useCallback, useEffect } from 'react'
import { Card } from '@/app/components/molecules/cards'
import { Button } from '@/app/components/atoms/buttons'
import { Calculator } from 'lucide-react'
import { toast } from 'sonner'
import { pricingService } from '@/lib/supabase/pricing-service'

interface PriceBreakdown {
  basePrice: number
  withStateFees: number
  withTax: number
  withDiscount: number
  withPromotions: number
  final: number
}

interface PricingCalculatorProps {
  productId: string
  organizationId: string
  manufacturerId: string
  stateCode: string
  selectedState: string;
}

export function PricingCalculator({
  productId,
  organizationId,
  manufacturerId,
  stateCode,
}: PricingCalculatorProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [calculatedPrice, setCalculatedPrice] = useState<PriceBreakdown | null>(null)

  const calculatePrice = useCallback(async () => {
    if (!productId || !organizationId || !stateCode) {
      toast.error('Missing required parameters')
      return
    }

    setIsLoading(true)

    try {
      // Convert productId to BigInt for database operations
      const productIdBigInt = BigInt(productId)

      // Fetch base pricing
      const basePricing = await pricingService.getBasePrice(productIdBigInt.toString())
      if (!basePricing) throw new Error(`Base pricing not found for product ID: ${productIdBigInt}`)

      const currentPrice = basePricing.base_wholesale_cost

      // Add state fees
      const statePricing = await pricingService.getStatePricing(productIdBigInt.toString(), stateCode)
      const withFees = currentPrice + (statePricing?.state_fee || 0)

      // Add tax
      const withTax = withFees * (1 + (statePricing?.tax_rate || 0))

      // Apply contract discounts
      const contractDiscounts = await pricingService.getContractDiscounts(
        organizationId,
        manufacturerId
      )
      const withDiscount = contractDiscounts.reduce((price, discount) => {
        if (discount.type === 'percentage') {
          return price * (1 - discount.value / 100)
        }
        return price - discount.value
      }, withTax)

      // Apply promotions
      const promotions = await pricingService.getActivePromotions(
        manufacturerId,
        productIdBigInt.toString()
      )
      const promotionDiscount = promotions.reduce((total, promo) => {
        if (promo.calculation_type === 'percentage') {
          return total + (currentPrice * (promo.value / 100))
        }
        return total + promo.value
      }, 0)

      const finalPrice = withDiscount - promotionDiscount

      // Save calculation
      await pricingService.saveCalculation({
        productId: productIdBigInt,
        organizationId,
        stateCode,
        stateFees: statePricing?.state_fee || 0,
        taxAmount: withTax - withFees,
        contractDiscount: withDiscount - withTax,
        promotionDiscount,
        finalPrice,
        manufacturerId: ''
      })

      setCalculatedPrice({
        basePrice: Number(basePricing.base_wholesale_cost.toFixed(2)),
        withStateFees: Number(withFees.toFixed(2)),
        withTax: Number(withTax.toFixed(2)),
        withDiscount: Number(withDiscount.toFixed(2)),
        withPromotions: Number((withDiscount - promotionDiscount).toFixed(2)),
        final: Number(finalPrice.toFixed(2))
      })

      toast.success('Price calculation updated')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to calculate price')
      console.error('Price calculation error:', error)
    } finally {
      setIsLoading(false)
    }
  }, [productId, organizationId, manufacturerId, stateCode])

  useEffect(() => {
    calculatePrice()
  }, [calculatePrice])

  return (
    <Card className="w-full max-w-2xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Calculator className="h-6 w-6" />
          <h2 className="text-xl font-semibold">Price Calculation</h2>
        </div>
        <Button 
          onClick={calculatePrice}
          disabled={isLoading}
          variant="outline"
        >
          {isLoading ? 'Calculating...' : 'Recalculate'}
        </Button>
      </div>

      {calculatedPrice && (
        <div className="space-y-4">
          <PriceRow label="Base Price" value={calculatedPrice.basePrice} />
          <PriceRow label="With State Fees" value={calculatedPrice.withStateFees} />
          <PriceRow label="With Tax" value={calculatedPrice.withTax} />
          <PriceRow label="With Contract Discount" value={calculatedPrice.withDiscount} />
          <PriceRow label="With Promotions" value={calculatedPrice.withPromotions} />
          <PriceRow 
            label="Final Price" 
            value={calculatedPrice.final} 
            className="font-bold text-lg"
          />
        </div>
      )}
    </Card>
  )
}

interface PriceRowProps {
  label: string
  value: number
  className?: string
}

function PriceRow({ label, value, className }: PriceRowProps) {
  return (
    <div className={`flex justify-between items-center ${className}`}>
      <span>{label}</span>
      <span>${value.toFixed(2)}</span>
    </div>
  )
}

export default PricingCalculator
