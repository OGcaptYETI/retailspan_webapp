import React from "react";
import { Text, Label } from "@/app/components/atoms/typography";
import { Button } from "@/app/components/atoms/buttons";

export interface ProductCardProps {
  product: {
    id: string;
    name: string;
    sku: string;
    brand?: string;
    category?: string;
    msrp?: number;
    wholesale_price?: number;
    image_url?: string;
  };
  onSelect?: (product: ProductCardProps["product"]) => void;
}

export function ProductCard({ product, onSelect }: ProductCardProps) {
  return (
    <div className="p-4 border rounded-lg shadow-sm hover:shadow-md">
      <img
        src={product.image_url || "/placeholder-image.png"}
        alt={product.name}
        className="w-full h-48 object-cover rounded-md"
      />
      <div className="mt-4 space-y-2">
        <Label>{product.brand}</Label>
        <Text className="text-lg font-semibold">{product.name}</Text>
        <Text>SKU: {product.sku}</Text>
        <Text>Category: {product.category}</Text>
        <Text>MSRP: ${product.msrp?.toFixed(2)}</Text>
        <Text>Wholesale Price: ${product.wholesale_price?.toFixed(2)}</Text>
      </div>
      <div className="mt-4">
        <Button variant="default" onClick={() => onSelect?.(product)}>
          View Details
        </Button>
      </div>
    </div>
  );
}
