import { Database } from "./supabase";

type Tables = Database["public"]["Tables"]

// Base table types
export type StateRow = Tables["states"]["Row"]
export type StateInsert = Tables["states"]["Insert"]
export type StateUpdate = Tables["states"]["Update"]
export type StateRegulationRow = Tables["state_regulations"]["Row"]
export type StatePricingRow = Tables["state_pricing"]["Row"]

// State Status
export enum StateStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  PENDING = "pending",
  RESTRICTED = "restricted"
}

// Extended State interface
export interface State extends StateRow {
  total_customers?: number;
  total_sales?: number;
  active_contracts?: number;
}

// State Regulations
export interface StateRegulation extends StateRegulationRow {
  state_name?: string;
  regulation_type?: string;
  is_active?: boolean;
}

// State Pricing
export interface StatePricing extends StatePricingRow {
  state_name?: string;
  product_name?: string;
  price_tier?: string;
}

// State Tax
export interface StateTax {
  state_id: string;
  tax_rate: number;
  tax_type: "sales" | "excise" | "other";
  effective_date: Date;
  exemptions?: string[];
}

// State Compliance
export interface StateCompliance {
  state_id: string;
  requirement_type: string;
  description: string;
  due_date?: Date;
  status: "compliant" | "non_compliant" | "pending";
}

// Form Data
export interface StateFormData extends Omit<StateInsert, "created_at" | "updated_at"> {
  id?: string;
  regulations?: StateRegulation[];
  pricing?: StatePricing[];
  tax_info?: StateTax;
}

// Validation Types
export type StateValidationErrors = {
  [K in keyof StateFormData]?: string;
}

// State Filters
export interface StateFilters {
  search?: string;
  status?: StateStatus;
  region?: string;
  has_regulations?: boolean;
  min_sales?: number;
  max_sales?: number;
}

// State with Relations
export interface StateWithRelations extends State {
  regulations: StateRegulation[];
  pricing: StatePricing[];
  tax_info: StateTax;
  compliance: StateCompliance[];
}