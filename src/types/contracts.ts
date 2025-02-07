import { Database } from "./supabase";

type Tables = Database["public"]["Tables"]

// Base table types
export type ContractRow = Tables["contracts"]["Row"]
export type ContractInsert = Tables["contracts"]["Insert"]
export type ContractUpdate = Tables["contracts"]["Update"]
export type ContractTermRow = Tables["contract_terms"]["Row"]

// Contract Status
export enum ContractStatus {
  DRAFT = "draft",
  PENDING = "pending",
  ACTIVE = "active",
  EXPIRED = "expired",
  TERMINATED = "terminated"
}

// Extended Contract interface
export interface Contract extends ContractRow {
  customer_name?: string;
  sales_rep_name?: string;
  total_value?: number;
  remaining_value?: number;
}

// Contract Terms
export interface ContractTerm extends ContractTermRow {
  contract_name?: string;
  term_type?: string;
  is_negotiable?: boolean;
}

// Contract Pricing
export interface ContractPricing {
  product_id: string;
  product_name?: string;
  base_price: number;
  discount_type?: "percentage" | "fixed" | "volume";
  discount_value?: number;
  minimum_quantity?: number;
  maximum_quantity?: number;
}

// Contract Customer
export interface ContractCustomer {
  customer_id: string;
  business_name: string;
  contact_name?: string;
  contact_email?: string;
  billing_address?: string;
  shipping_address?: string;
}

// Contract Form Data
export interface ContractFormData extends Omit<ContractInsert, "created_at" | "updated_at"> {
  id?: string;
  terms?: ContractTerm[];
  pricing?: ContractPricing[];
  customers?: ContractCustomer[];
}

// Validation Types
export type ContractValidationErrors = {
  [K in keyof ContractFormData]?: string;
}

// Contract Filters
export interface ContractFilters {
  search?: string;
  status?: ContractStatus;
  customer_id?: string;
  start_date?: Date;
  end_date?: Date;
  min_value?: number;
  max_value?: number;
}

// Contract with Relations
export interface ContractWithRelations extends Contract {
  terms: ContractTerm[];
  pricing: ContractPricing[];
  customers: ContractCustomer[];
  documents?: Tables["contract_documents"]["Row"][];
}