export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      // ✅ Products Table
      products: {
        Row: {
          id: string;
          name: string;
          description?: string | null;
          sku: string;
          upc?: string | null;
          category_id?: string | null;
          brand_id?: string | null;
          base_unit_price?: number | null;
          wholesale_price?: number | null;
          msrp?: number | null;
          weight?: number | null;
          width?: number | null;
          height?: number | null;
          depth?: number | null;
          pack_size?: string | null;
          is_active: boolean;
          image_url?: string | null;
          unit_measure_id?: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["products"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["products"]["Row"]>;
      };

      // ✅ Brands Table
      brands: {
        Row: {
          id: string;
          name: string;
          manufacturer_id?: string | null;
          logo_url?: string | null;
          website?: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["brands"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["brands"]["Row"]>;
      };

      // ✅ Product Categories Table
      product_categories: {
        Row: {
          id: string;
          name: string;
          description?: string | null;
          parent_id?: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["product_categories"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["product_categories"]["Row"]>;
      };

      // ✅ Manufacturers Table
      manufacturers: {
        Row: {
          id: string;
          name: string;
          website?: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["manufacturers"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["manufacturers"]["Row"]>;
      };

      // ✅ Units Table (for unit measure)
      units: {
        Row: {
          id: string;
          name: string;
          description?: string | null;
          category?: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["units"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["units"]["Row"]>;
      };

      // ✅ Brand Families Table
      brand_families: {
        Row: {
          id: string;
          name: string;
          brand_id: string;
          description?: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["brand_families"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["brand_families"]["Row"]>;
      };

      // ✅ Sell Sheets Table
      sell_sheets: {
        Row: {
          id: string;
          brand_family_id: string;
          file_name: string;
          file_url: string;
          file_type: string;
          category: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["sell_sheets"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["sell_sheets"]["Row"]>;
      };

      // ✅ State Pricing Table
      state_pricing: {
        Row: {
          id: string;
          product_id: string;
          minimum_price?: number | null;
          maximum_price?: number | null;
          state_fee?: number | null;
          tax_rate?: number | null;
          state_code: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["state_pricing"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["state_pricing"]["Row"]>;
      };

      // ✅ Customer Contracts Table
      customer_contracts: {
        Row: {
          id: string;
          organization_id: string;
          manufacturer_id: string;
          discount_percentage?: number | null;
          start_date: string;
          end_date?: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["customer_contracts"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["customer_contracts"]["Row"]>;
      };

      // ✅ Promotions Table
      promotions: {
        Row: {
          id: string;
          manufacturer_id: string;
          name: string;
          value: number;
          start_date: string;
          end_date: string;
          min_quantity?: number | null;
          max_quantity?: number | null;
          requires_contract?: boolean | null;
          stackable?: boolean | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["promotions"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["promotions"]["Row"]>;
      };

      // ✅ Promotion Products Table
      promotion_products: {
        Row: {
          id: string;
          promotion_id: string;
          product_id: string;
          additional_discount?: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["promotion_products"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["promotion_products"]["Row"]>;
      };

      // ✅ Product Images Table
      product_images: {
        Row: {
          id: string;
          product_id: string;
          is_primary: boolean;
          storage_path: string;
          mime_type: string;
          width?: number | null;
          height?: number | null;
          file_size?: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["product_images"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["product_images"]["Row"]>;
        };
        states: {
          Row: {
            id: string;
            state_code: string;
            state_name: string;
            created_at: string;
            updated_at: string;
          };
          Insert: Omit<Database["public"]["Tables"]["states"]["Row"], "id" | "created_at" | "updated_at">;
          Update: Partial<Database["public"]["Tables"]["states"]["Row"]>;
        };
  
        // ✅ New Table: Competitive Pricing
        competitive_pricing: {
          Row: {
            id: string;
            competitor_name: string;
            category_id: string;
            base_price: number;
            promotion_type?: string | null;
            buydown_amount?: number | null;
            effective_price: number;
            margin_percentage: number;
            status: string;
            created_at: string;
            updated_at: string;
          };
          Insert: Omit<Database["public"]["Tables"]["competitive_pricing"]["Row"], "id" | "created_at" | "updated_at">;
          Update: Partial<Database["public"]["Tables"]["competitive_pricing"]["Row"]>;
        };
            };
          };
          };
        
        export interface Contract {
          id: string;
          name: string;
          manufacturer_id: string;
          category_id: string;
          levels: ContractLevel[];
          enhancement: number;
          status: 'active' | 'pending' | 'expired';
          updated_at: string;
          expires_at: string;
        }
        
        export interface ContractLevel {
          id: string;
          name: string;
          discount: number;
        }


        export interface Product {
          id: string;
          name: string;
          sku: string;
          upc?: string;
          description?: string;
          category_id: string;
          brand_id: string;
          unit_measure_id?: string;
          base_unit_price: number;
          wholesale_price: number;
          msrp: number;
          weight?: number;
          width?: number;
          height?: number;
          depth?: number;
          pack_size?: string;
          is_active: boolean;
          image_url?: string;
          created_at: string;
          updated_at: string;
        }
        
        export interface ContractFormData {
          name: string;
          manufacturer_id: string;
          category_id: string;
          levels: { [key: string]: number };
          enhancement: string;
          status: string;
          expires_at: string;
        }
        
        export interface ContractResponse extends ContractFormData {
          id: string;
          created_at: string;
          updated_at: string;
        }

        export interface ContractFormData {

          name: string;
        
          manufacturer_id: string;
        
          category_id: string;
        
        // Remove this duplicate interface
          is_active: boolean;
          image_url: string;
          unit_measure_id: string;
          created_at: string;
          updated_at: string;
          dimensions: {
            width: number;
            height: number;
          };
        } 
        export interface ProductFormData {
          name: string;
          sku: string;
          category_id: string;
          brand_id: string;
          base_unit_price: string;
          wholesale_price: string;
          msrp: string;
          dimensions: {
            width: string;
            height: string;
          };
        }

        export interface Product {
          id: string;
          name: string;
          sku: string;
          upc?: string;
          description?: string;
          category_id: string;
          brand_id: string;
          unit_measure_id?: string;
          base_unit_price: number;
          wholesale_price: number;
          msrp: number;
          weight?: number;
          width?: number;
          height?: number;
          depth?: number;
          pack_size?: string;
          is_active: boolean;
          image_url?: string;
          created_at: string;
          updated_at: string;
        }

        export interface Contract {
          id: string;
          name: string;
          manufacturer_id: string;
          category_id: string;
          levels: ContractLevel[];
          enhancement: number;  
          status: 'active' | 'pending' | 'expired';
          updated_at: string;
          expires_at: string;
        }

        export interface ContractLevel {
          id: string;
          name: string;
          discount: number;
        }
        export interface ContractFormData {
          name: string;
          manufacturer_id: string;
          category_id: string;
          levels: { [key: string]: number };
          enhancement: string;
          status: string;
         expires_at: string;
        }

        export interface ContractResponse extends ContractFormData {
          id: string;
          created_at: string;
          updated_at: string;
        }

        export interface ProductFormProps {

          onSubmit: (productData: Product) => Promise<void>;
        
          onCancel: () => void;
        
          product?: Product;
        }

        export interface BrandFamily {
          id: string;
          name: string;
          brand_id: string;
        }
        export interface BrandFamily {
          id: string;
          name: string;
          brand_id: string;
          created_at?: string;
          updated_at?: string;
        }

        export interface BrandFamilyFormData {
          name: string;
          brand_id: string;
          description?: string;
        }

        export interface BrandFamilyResponse extends BrandFamilyFormData {    
          id: string;
          created_at: string;
          updated_at: string;
        }
        export interface BrandFamilyFormData {
          name: string;
          brand_id: string;
          description?: string;
        }
