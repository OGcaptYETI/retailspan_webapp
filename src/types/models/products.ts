// types/models/products.ts
export interface BaseProduct {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  description: string | null;
  sku: string;
  upc: string | null;
  brand: string;
  category: string;
  subcategory: string | null;
  price: number;
  cost: number;
  width: number;
  height: number;
  depth: number;
  weight: number | null;
  image_url: string | null;
  stock: number;
  organization_id: string;
  current_price?: number;
  base_price?: number;
  is_active?: boolean;
  case_pack?: number;
  case_width?: number | null;
  case_height?: number | null;
  case_depth?: number | null;
  case_weight?: number | null;
}

// Product interface for canvas with positioning
export interface CanvasProduct extends BaseProduct {
  x: number;
  y: number;
  rotation: number;
  facings: number;
}

// Product interface for planogram
export interface PlanogramProduct extends BaseProduct {
  position: {
    x: number;
    y: number;
    z: number;
  };
  rotation: number;
  facings: number;
  metadata?: {
    name: string;
    brand: string;
    category: string;
    price: number;
  };
}

// Export type for the grid display
export type ProductGridItem = BaseProduct & {
  active: boolean;
};

export type Product = BaseProduct;

export type ProductUpdate = Partial<Product>;