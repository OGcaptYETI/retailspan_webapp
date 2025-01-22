// app/components/molecules/cards/ProductCard.tsx
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
import type { ProductGridItem } from "@/types/models/products"

// Enhanced interface with proper drag event handling
export interface ProductCardProps {
 product: ProductGridItem
 onSelect?: (product: ProductGridItem) => void
 className?: string
 isDraggable?: boolean
 // Allow parent to override default drag behavior if needed
 handleDragStart?: (e: React.DragEvent<HTMLDivElement>) => void 
}

export function ProductCard({ 
 product, 
 onSelect, 
 className,
 isDraggable = true,
 handleDragStart: externalDragHandler
}: ProductCardProps) {
 // Internal drag handler that sets product data
 const handleDragStart = React.useCallback((e: React.DragEvent<HTMLDivElement>) => {
   if (!isDraggable) return
   
   // Allow external handler to override default behavior
   if (externalDragHandler) {
     externalDragHandler(e)
     return
   }

   // Default behavior: set product data as JSON
   try {
     e.dataTransfer.setData('application/json', JSON.stringify(product))
     // Add a visual effect during drag
     e.dataTransfer.effectAllowed = 'copy'
   } catch (err) {
     console.error('Failed to set drag data:', err)
   }
 }, [product, isDraggable, externalDragHandler])

 return (
   <Card 
     className={cn(
       "overflow-hidden", 
       isDraggable && "cursor-move hover:border-primary transition-colors",
       className
     )}
     draggable={isDraggable}
     onDragStart={handleDragStart}
   >
     {product.image_url && (
       <div className="relative h-48 w-full">
         <Image
           src={product.image_url}
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
           Dimensions: {product.width ?? 0}&quot; × {product.height ?? 0}&quot; × {product.depth ?? 0}&quot;
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