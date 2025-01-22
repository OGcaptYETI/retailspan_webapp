// ./supabase.ts
export type Json = {
  [key: string]: string | number | boolean | Json | Json[];
};

export interface Database {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          name: string
          subscription_status: string
          trial_ends_at: string
          settings: Json
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          name: string
          subscription_status?: string
          trial_ends_at?: string
          settings?: Json
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          name?: string
          subscription_status?: string
          trial_ends_at?: string
          settings?: Json
        }
      }
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
          price: number
          cost: number
          width: number
          height: number
          depth: number
          weight: number
          image_url: string | null
          stock: number
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
          price: number
          cost: number
          width: number
          height: number
          depth: number
          weight: number
          image_url?: string | null
          stock: number
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
          price?: number
          cost?: number
          width?: number
          height?: number
          depth?: number
          weight?: number
          image_url?: string | null
          stock?: number
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
          status: string
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
          status?: string
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
          status?: string
          organization_id?: string
          created_by?: string
          updated_by?: string
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