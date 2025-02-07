import { Database } from "./supabase";

type Tables = Database["public"]["Tables"]

// Base table types
export type ProductRow = Tables["products"]["Row"]
export type ProductInsert = Tables["products"]["Insert"]
export type ProductUpdate = Tables["products"]["Update"]

// Extended Product interface with relations
export interface Product extends ProductRow {
  category_name?: string;
  brand_name?: string;
  manufacturer_name?: string;
  unit_measure_name?: string;
}

// Form and validation types
export interface ProductFormData extends Omit<ProductInsert, "created_at" | "updated_at"> {
  id?: string;
}

export type ProductValidationErrors = {
  [K in keyof ProductFormData]?: string;
}

// Product status enum
export enum ProductStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  DISCONTINUED = "discontinued",
  OUT_OF_STOCK = "out_of_stock"
}

// Related types
export interface ProductWithRelations extends Product {
  category?: Tables["product_categories"]["Row"];
  brand?: Tables["brands"]["Row"];
  manufacturer?: Tables["manufacturers"]["Row"];
}

export interface ProductFilters {
  search?: string;
  category_id?: string[];
  brand_id?: string[];
  status?: ProductStatus;
  min_price?: number;
  max_price?: number;
}