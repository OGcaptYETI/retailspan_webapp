import { supabase } from "@/lib/supabase/client";

const productApi = {
  // ✅ Fetch all products with related brand, category, and unit measure names
  async getProducts() {
    const { data, error } = await supabase
      .from("products")
      .select(`
        id, name, sku, upc, description,
        base_unit_price, wholesale_price, msrp,
        weight, width, height, depth, pack_size, is_active,
        image_url, created_at, updated_at,
        brand_id, brands!products_brand_id_fkey(name) as brand_name, // ✅ Explicitly define foreign key
        category_id, product_categories(name) as category_name,
        unit_measure_id, units(name) as unit_name
      `);
  
    if (error) throw error;
    return data;
  }
  ,

  // ✅ Fetch product by ID
  async getProductById(productId: string | number) {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", productId)
      .single();

    if (error) {
      console.error("Error fetching product by ID:", error);
      throw error;
    }
    return data;
  },

  // ✅ Create a new product
  async createProduct(product: { [key: string]: any }) {
    const cleanedProduct = {
      ...product,
      category_id: product?.category_id || "default_category_id", // Ensure a default value
      brand_id: product?.brand_id || null,
      unit_measure_id: product?.unit_measure_id || null,
      base_unit_price: product?.base_unit_price || null,
      wholesale_price: product?.wholesale_price || null,
      msrp: product?.msrp || null,
      weight: product?.weight || null,
      width: product?.width || null,
      height: product?.height || null,
      depth: product?.depth || null,
      pack_size: product?.pack_size || "1",
      image_url: product?.image_url || null,
      is_active: product?.is_active ?? true,
    };

    const { data, error } = await supabase
      .from("products")
      .insert(cleanedProduct)
      .select();

    if (error) {
      console.error("Error creating product:", error);
      throw error;
    }
    return data;
  },

  // ✅ Update an existing product
  async updateProduct(productId: string | number, updates: { [key: string]: any }) {
    const cleanedUpdates = {
      ...updates,
      category_id: updates?.category_id || null,
      brand_id: updates?.brand_id || null,
      unit_measure_id: updates?.unit_measure_id || null,
      base_unit_price: updates?.base_unit_price || null,
      wholesale_price: updates?.wholesale_price || null,
      msrp: updates?.msrp || null,
      weight: updates?.weight || null,
      width: updates?.width || null,
      height: updates?.height || null,
      depth: updates?.depth || null,
      pack_size: updates?.pack_size || "1",
      image_url: updates?.image_url || null,
      is_active: updates?.is_active ?? true,
    };

    const { data, error } = await supabase
      .from("products")
      .update(cleanedUpdates)
      .eq("id", productId)
      .select();

    if (error) {
      console.error("Error updating product:", error);
      throw error;
    }
    return data;
  },

  // ✅ Delete a product
  async deleteProduct(productId: string | number) {
    const { data, error } = await supabase
      .from("products")
      .delete()
      .eq("id", productId)
      .select();

    if (error) {
      console.error("Error deleting product:", error);
      throw error;
    }
    return data;
  },

  // ✅ Upload product image to Supabase Storage
  async uploadProductImage(file: File) {
    const filePath = `product_images/${Date.now()}-${file.name}`;

    const { data, error } = await supabase.storage
      .from("product_images")
      .upload(filePath, file);

    if (error) {
      console.error("Error uploading product image:", error);
      throw error;
    }

    // Retrieve public URL
    const { data: publicUrlData } = supabase.storage
      .from("product_images")
      .getPublicUrl(filePath);

    return publicUrlData.publicUrl;
  },

  // ✅ Fetch manufacturers
  async getManufacturers() {
    const { data, error } = await supabase.from("manufacturers").select("*");
    if (error) throw error;
    return data;
  },

  // ✅ Create a new manufacturer
  async createManufacturer(manufacturer: { name: string; website?: string }) {
    const { data, error } = await supabase
      .from("manufacturers")
      .insert([manufacturer])
      .select();
    if (error) throw error;
    return data;
  },

  // ✅ Update an existing manufacturer
  async updateManufacturer(manufacturerId: string | number, updates: any) {
    const { data, error } = await supabase
      .from("manufacturers")
      .update(updates)
      .eq("id", manufacturerId)
      .select();
    if (error) throw error;
    return data;
  },

  // ✅ Delete a manufacturer
  async deleteManufacturer(manufacturerId: string | number) {
    const { data, error } = await supabase
      .from("manufacturers")
      .delete()
      .eq("id", manufacturerId)
      .select();
    if (error) throw error;
    return data;
  },

  // ✅ Fetch all brands
  async getBrands() {
    const { data, error } = await supabase.from("brands").select("*");
    if (error) {
      console.error("Error fetching brands:", error);
      throw error;
    }
    return data;
  },

  // ✅ Fetch brand families with brand names
  async getBrandFamiliesWithBrandNames() {
    const { data, error } = await supabase
      .from("brand_families")
      .select("*, brands(name)");

    if (error) {
      console.error("Error fetching brand families:", error);
      throw error;
    }
    return data;
  },

  // ✅ Fetch product categories
  async getProductCategories() {
    const { data, error } = await supabase.from("product_categories").select("*");
    if (error) {
      console.error("Error fetching product categories:", error);
      throw error;
    }
    return data;
  },

  // ✅ Fetch unit measures
  async getUnitMeasures() {
    const { data, error } = await supabase.from("units").select("*");
    if (error) {
      console.error("Error fetching unit measures:", error);
      throw error;
    }
    return data;
  },

  // ✅ Fetch all sell sheets
  async getSellSheets() {
    const { data, error } = await supabase.from("sell_sheets").select("*");
    if (error) throw error;
    return data;
  },

  // ✅ Upload a sell sheet file
  async uploadSellSheet(file: File) {
    const filePath = `sell_sheets/${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage
      .from("sell_sheets")
      .upload(filePath, file);
    if (error) throw error;

    // Retrieve public URL
    const { data: publicUrlData } = supabase.storage
      .from("sell_sheets")
      .getPublicUrl(filePath);

    return publicUrlData.publicUrl;
  }
};

export default productApi;
  
  
