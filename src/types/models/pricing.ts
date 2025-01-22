// types/models/pricing.ts

// First, let's define some common types for timestamps and IDs that we'll reuse
interface BaseModel {
  created_at: string;  // Supabase timestamps come as ISO strings
  updated_at: string;
}

// Manufacturers table
export interface Manufacturer extends BaseModel {
  id: string;  // UUID stored as string
  name: string;
  code: string;
  contact_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  active: boolean;
}

// Manufacturer Pricing table
export interface ManufacturerPricing extends BaseModel {
  id: string;
  manufacturer_id: string;  // Foreign key to manufacturers
  product_id: bigint;      // Changed to match your schema
  base_wholesale_cost: number;
  msrp: number;
  effective_date: string;  // Dates come as ISO strings
  end_date?: string | null;
}

// State Pricing table
export interface StatePricing extends BaseModel {
  id: string;
  state_code: string;
  product_id: bigint;
  minimum_price: number | null;
  maximum_price: number | null;
  state_fee: number;
  tax_rate: number;
}

// Customer Contracts table
export interface CustomerContract extends BaseModel {
  id: string;
  organization_id: string;
  manufacturer_id: string;
  tier_level: string;
  discount_percentage: number;
  start_date: string;
  end_date: string | null;
  terms: string | null;
}

// Promotions table
export interface Promotion extends BaseModel {
  id: string;
  name: string;
  manufacturer_id: string;
  type: string;
  value: number;
  calculation_type: string;
  start_date: string;
  end_date: string;
  min_quantity: number | null;
  max_quantity: number | null;
  requires_contract: boolean;
  stackable: boolean;
}

// Promotion Products table
export interface PromotionProduct extends BaseModel {
  id: string;
  promotion_id: string;
  product_id: bigint;
  additional_discount: number | null;
}

// Promotion States table - Note this is a junction table
export interface PromotionState {
  promotion_id: string;
  state_code: string;
}

// Calculated Prices table
export interface CalculatedPrice extends BaseModel {
  id: string;
  product_id: bigint;
  organization_id: string;
  state_code: string;
  base_cost: number;
  promotion_discount: number | null;
  contract_discount: number | null;
  state_fees: number;
  tax_amount: number;
  final_price: number;
  calculated_at: string;
}

// Additional type for price calculation results
export interface PriceCalculationResult {
  basePrice: number;
  withStateFees: number;
  withTax: number;
  withDiscount: number;
  withPromotions: number;
  final: number;
}

// Type for price calculation inputs
export interface PriceCalculationInput {
  productId: bigint;
  organizationId: string;
  manufacturerId: string;
  stateCode: string;
  quantity?: number;
}
export interface ContractDiscount {
  id: string;
  organization_id: string;
  manufacturer_id: string;
  type: 'percentage' | 'fixed';
  value: number;
  start_date: string;
  end_date: string;
  active: boolean;
}

export interface PriceCalculationInput {
  productId: bigint;
  organizationId: string;
  stateCode: string;
  stateFees: number;
  taxAmount: number;
  contractDiscount: number;
  promotionDiscount: number;
  finalPrice: number;
}
export interface BasePricing {
  id: string
  product_id: bigint
  base_wholesale_cost: number
  msrp: number
  effective_date: string
  markup_percentage?: number
  margin_percentage?: number
  cost_basis?: 'wholesale' | 'landed' | 'average'
  pricing_tier?: string
  currency?: string
  last_updated?: string
  updated_by?: string
}
export interface ManufacturerPricing {
  id: string
  product_id: bigint
  manufacturer_id: string
  base_wholesale_cost: number
  msrp: number
  effective_date: string
  end_date?: string | null
  markup_percentage?: number
  margin_percentage?: number
  cost_basis?: 'wholesale' | 'landed' | 'average'
  pricing_tier?: string
  currency?: string
  last_updated?: string
  updated_by?: string
}