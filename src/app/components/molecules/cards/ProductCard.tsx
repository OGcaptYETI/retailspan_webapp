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

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    imageUrl?: string;
    brand?: string;
    description?: string;
    category?: string;
    price?: number;
    dimensions?: {
      width?: number;
      height?: number;
      depth?: number;
    };
  };
  onSelect?: (product: ProductCardProps['product']) => void;
}

export function ProductCard({ product, onSelect }: ProductCardProps) {
  const formatPrice = (price?: number) => {
    return price ? `$${price.toFixed(2)}` : 'N/A';
  };

  const getDimensions = () => {
    if (!product.dimensions) return null;
    const { width = 0, height = 0, depth = 0 } = product.dimensions;
    return `${width}" × ${height}" × ${depth}"`;
  };

  return (
    <Card className="overflow-hidden">
      {product.imageUrl && (
        <div className="relative w-full pt-[100%]">
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
        {product.brand && <CardDescription>{product.brand}</CardDescription>}
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
              {product.category || 'Uncategorized'}
            </Text>
            <Text variant="large" className="font-bold">
              {formatPrice(product.price)}
            </Text>
          </div>
          {product.dimensions && (
            <div className="text-xs text-muted-foreground">
              Dimensions: {getDimensions()}
            </div>
          )}
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
  );
}