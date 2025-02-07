import { Database } from "./supabase";

type Tables = Database["public"]["Tables"]

// Base table types
export type PriceRow = Tables["prices"]["Row"]
export type PriceInsert = Tables["prices"]["Insert"]
export type PriceUpdate = Tables["prices"]["Update"]
export type PriceHistoryRow = Tables["price_history"]["Row"]

// Extended Price interface with relations
export interface Price extends PriceRow {
  product_name?: string;
  category_name?: string;
  state_name?: string;
}

// Pricing Strategy types
export type PricingStrategyRow = Tables["pricing_strategies"]["Row"]
export type PricingRuleRow = Tables["pricing_rules"]["Row"]

export enum PricingMethod {
  COST_PLUS = "cost_plus",
  MARGIN_BASED = "margin_based",
  MARKET_BASED = "market_based",
  COMPETITION_BASED = "competition_based"
}

export interface PricingCalculation {
  base_cost: number;
  markup_percentage?: number;
  margin_percentage?: number;
  target_margin?: number;
  minimum_margin?: number;
  overhead_cost?: number;
  shipping_cost?: number;
  tax_rate?: number;
}

// Discount types
export interface PriceDiscount {
  type: "percentage" | "fixed" | "bulk";
  value: number;
  min_quantity?: number;
  start_date?: Date;
  end_date?: Date;
}

// State pricing types
export interface StatePricing extends Tables["state_pricing"]["Row"] {
  state_name?: string;
  tax_rate?: number;
  pricing_rules?: PricingRuleRow[];
}

// Contract pricing types
export interface ContractPricing extends Tables["contract_pricing"]["Row"] {
  contract_name?: string;
  customer_name?: string;
  special_terms?: string;
}

// Price analysis types
export interface PriceAnalysis {
  current_price: number;
  suggested_price?: number;
  min_price?: number;
  max_price?: number;
  margin?: number;
  markup?: number;
  price_elasticity?: number;
}

// Form types
export interface PriceUpdateForm {
  product_id: string;
  new_price: number;
  effective_date?: Date;
  reason?: string;
  approved_by?: string;
}

// Validation types
export type PriceValidationErrors = {
  [K in keyof PriceUpdateForm]?: string;
}