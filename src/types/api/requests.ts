import type { Json } from '../supabase'

// Base Request Types
export interface PaginationParams {
  page?: number
  limit?: number
  cursor?: string
}

export interface SortParams {
  field: string
  direction: 'asc' | 'desc'
}

// Auth Requests
export interface LoginRequest {
  email: string
  password: string
}

export interface SignupRequest extends LoginRequest {
  name: string
  companyName: string
}

// Organization Requests
export interface CreateOrganizationRequest {
  name: string
  settings?: {
    timezone?: string
    currency?: string
    businessType?: string
    locations?: number
    annualRevenue?: number
    productCategories?: string[]
  }
}

export interface UpdateOrganizationRequest {
  name?: string
  settings?: Json
}

// Product Requests
export interface CreateProductRequest {
  name: string
  description?: string
  sku: string
  upc?: string
  brand: string
  category: string
  subcategory?: string
  price: number
  cost: number
  width: number
  height: number
  depth: number
  weight: number
  imageUrl?: string
  stock: number
}

export interface UpdateProductRequest {
  name?: string
  description?: string
  sku?: string
  upc?: string
  brand?: string
  category?: string
  subcategory?: string
  price?: number
  cost?: number
  width?: number
  height?: number
  depth?: number
  weight?: number
  imageUrl?: string
  stock?: number
}

// Planogram Requests
export interface CreatePlanogramRequest {
  name: string
  description?: string
  width: number
  height: number
  depth: number
  fixtureType: string
  layoutData: Json
  status?: 'draft' | 'active' | 'archived'
}

export interface UpdatePlanogramRequest {
  name?: string
  description?: string
  width?: number
  height?: number
  depth?: number
  fixtureType?: string
  layoutData?: Json
  status?: 'draft' | 'active' | 'archived'
}

// Pricing Requests
export interface CreatePriceRuleRequest {
  name: string
  description?: string
  type: 'markdown' | 'markup' | 'fixed'
  value: number
  startDate: string
  endDate?: string
  productIds: string[]
}

export interface UpdatePriceRuleRequest {
  name?: string
  description?: string
  type?: 'markdown' | 'markup' | 'fixed'
  value?: number
  startDate?: string
  endDate?: string
  productIds?: string[]
  active?: boolean
}