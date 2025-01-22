export interface Product {
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
    width: number;
    height: number;
    depth: number;
    weight: number | null;
    case_pack: number;
    case_width: number | null;
    case_height: number | null;
    case_depth: number | null;
    case_weight: number | null;
    base_price: number;
    current_price: number;
    image_url: string | null;
    is_active: boolean;
    organization_id: string;
  }
  
  export type ProductUpdate = Partial<Product>;