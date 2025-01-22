import { Database } from '../supabase'
import { PaginationState, SortState, FilterState } from '../components/common'

export interface ApiResponse<T> {
  data?: T
  error?: {
    message: string
    code?: string
  }
  status: number
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: PaginationState
}

export interface QueryParams {
  pagination?: PaginationState
  sort?: SortState
  filters?: FilterState
}

export interface ProductResponse extends Database['public']['Tables']['products']['Row'] {
  pricing_rules?: Database['public']['Tables']['pricing_rules']['Row'][]
}

export interface PlanogramResponse extends Database['public']['Tables']['planograms']['Row'] {
  products: ProductResponse[]
}