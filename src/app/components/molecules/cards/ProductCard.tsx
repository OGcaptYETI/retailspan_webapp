// File: src/app/components/molecules/cards/ProductCard.tsx
import * as React from "react"
import Image from "next/image"
import { 
  Card, 
  CardContent, 
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription 
} from "./Card"
import { Button } from "@/app/components/atoms/buttons"
import { Text } from "@/app/components/atoms/typography"
import { cn } from "@/lib/utils/cn"

export interface ProductCardProps {
  product: {
    id: string
    name: string
    description?: string | null
    brand: string
    category: string
    price: number
    imageUrl?: string | null
    dimensions: {
      width: number
      height: number
      depth: number
    }
  }
  onSelect?: (product: ProductCardProps['product']) => void
  className?: string
}

export function ProductCard({ product, onSelect, className }: ProductCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      {product.imageUrl && (
        <div className="relative h-48 w-full">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>
      )}
      
      <CardHeader>
        <CardTitle>{product.name}</CardTitle>
        <CardDescription>{product.brand}</CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-2">
          {product.description && (
            <Text className="text-sm text-muted-foreground">
              {product.description}
            </Text>
          )}
          <div className="flex justify-between">
            <Text variant="small" className="text-muted-foreground">
              {product.category}
            </Text>
            <Text variant="large" className="font-bold">
              ${product.price.toFixed(2)}
            </Text>
          </div>
          <div className="text-xs text-muted-foreground">
            Dimensions: {product.dimensions.width}" × {product.dimensions.height}" × {product.dimensions.depth}"
          </div>
        </div>
      </CardContent>
      
      <CardFooter>
        <Button 
          variant="default" 
          className="w-full"
          onClick={() => onSelect?.(product)}
        >
          Add to Planogram
        </Button>
      </CardFooter>
    </Card>
  )
}