export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          name: string
          description: string | null
          sku: string
          upc: string | null
          brand: string
          category: string
          subcategory: string | null
          width: number
          height: number
          depth: number
          weight: number | null
          case_pack: number
          case_width: number | null
          case_height: number | null
          case_depth: number | null
          case_weight: number | null
          base_price: number
          current_price: number
          image_url: string | null
          is_active: boolean
          organization_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          name: string
          description?: string | null
          sku: string
          upc?: string | null
          brand: string
          category: string
          subcategory?: string | null
          width: number
          height: number
          depth: number
          weight?: number | null
          case_pack: number
          case_width?: number | null
          case_height?: number | null
          case_depth?: number | null
          case_weight?: number | null
          base_price: number
          current_price: number
          image_url?: string | null
          is_active?: boolean
          organization_id: string
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          name?: string
          description?: string | null
          sku?: string
          upc?: string | null
          brand?: string
          category?: string
          subcategory?: string | null
          width?: number
          height?: number
          depth?: number
          weight?: number | null
          case_pack?: number
          case_width?: number | null
          case_height?: number | null
          case_depth?: number | null
          case_weight?: number | null
          base_price?: number
          current_price?: number
          image_url?: string | null
          is_active?: boolean
          organization_id?: string
        }
      }
      planograms: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          name: string
          description: string | null
          width: number
          height: number
          depth: number
          fixture_type: string
          layout_data: Json
          status: 'draft' | 'active' | 'archived'
          organization_id: string
          created_by: string
          updated_by: string
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          name: string
          description?: string | null
          width: number
          height: number
          depth: number
          fixture_type: string
          layout_data: Json
          status?: 'draft' | 'active' | 'archived'
          organization_id: string
          created_by: string
          updated_by: string
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          name?: string
          description?: string | null
          width?: number
          height?: number
          depth?: number
          fixture_type?: string
          layout_data?: Json
          status?: 'draft' | 'active' | 'archived'
          organization_id?: string
          created_by?: string
          updated_by?: string
        }
      }
      organizations: {
        Row: {
          id: string
          created_at: string
          name: string
          subscription_status: 'active' | 'inactive' | 'trial'
          trial_ends_at: string | null
          settings: Json
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          subscription_status?: 'active' | 'inactive' | 'trial'
          trial_ends_at?: string | null
          settings?: Json
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          subscription_status?: 'active' | 'inactive' | 'trial'
          trial_ends_at?: string | null
          settings?: Json
        }
      }
      pricing_rules: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          product_id: string
          rule_type: 'markdown' | 'markup' | 'fixed' | 'promotional'
          value: number
          start_date: string | null
          end_date: string | null
          priority: number
          conditions: Json | null
          organization_id: string
          created_by: string
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          product_id: string
          rule_type: 'markdown' | 'markup' | 'fixed' | 'promotional'
          value: number
          start_date?: string | null
          end_date?: string | null
          priority?: number
          conditions?: Json | null
          organization_id: string
          created_by: string
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          product_id?: string
          rule_type?: 'markdown' | 'markup' | 'fixed' | 'promotional'
          value?: number
          start_date?: string | null
          end_date?: string | null
          priority?: number
          conditions?: Json | null
          organization_id?: string
          created_by?: string
        }
      }
      user_profiles: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          user_id: string
          organization_id: string
          role: 'admin' | 'manager' | 'user'
          permissions: string[]
          settings: Json
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id: string
          organization_id: string
          role?: 'admin' | 'manager' | 'user'
          permissions?: string[]
          settings?: Json
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id?: string
          organization_id?: string
          role?: 'admin' | 'manager' | 'user'
          permissions?: string[]
          settings?: Json
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}