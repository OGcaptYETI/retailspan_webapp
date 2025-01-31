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
        brand_id, brands!products_brand_id_fkey(name) as brand_name,
        category_id, product_categories(name) as category_name,
        unit_measure_id, units(name) as unit_name
      `);
  
    if (error) throw error;
    return data;
  },

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
      category_id: product?.category_id || "default_category_id",
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

    const { data: publicUrlData } = supabase.storage
      .from("product_images")
      .getPublicUrl(filePath);

    const user = await supabase.auth.getUser();
    console.log(user);

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
    if (error) throw error;
    return data;
  },

  async deleteBrandFamily(familyId: string) {
    const { error } = await supabase
      .from("brand_families")
      .delete()
      .eq("id", familyId);

    if (error) {
      console.error("❌ Error deleting brand family:", error);
      throw error;
    }

    console.log(`✅ Successfully deleted brand family with ID: ${familyId}`);
}
,

  // ✅ Create a new brand
  async createBrand(brand: { name: string; manufacturer: string; website?: string }) {
    const { data: existingBrand, error: checkError } = await supabase
      .from("brands")
      .select("id")
      .eq("name", brand.name)
      .single();
  
    if (checkError && checkError.code !== "PGRST116") {
      console.error("Error checking existing brand:", checkError);
      return [checkError, null];
    }
  
    if (existingBrand) {
      console.error("Brand with this name already exists");
      return [{ message: "Brand with this name already exists", code: "23505" }, null];
    }
  
    const { data, error } = await supabase
      .from("brands")
      .insert([brand])
      .select()
      .single();
  
    return [error, data];
  },

  // ✅ Update an existing brand
  async updateBrand(brandId: string, updates: { name?: string; manufacturer_id?: string; website?: string }) {
    const { data, error } = await supabase
      .from("brands")
      .update(updates)
      .eq("id", brandId)
      .select();

    if (error) throw error;
    return data;
  },

  // ✅ Fetch all brand families with their brand names
  async getBrandFamiliesWithBrandNames() {
    const { data, error } = await supabase
      .from("brand_families")
      .select(`
        id, 
        name, 
        description, 
        brand_id, 
        brands!brand_families_brand_id_fkey (name)
      `);

    if (error) {
      console.error("Error fetching brand families:", error);
      return [];
    }

    console.log("✅ Brand Families Data:", data);
    return data;
  },

  // ✅ Create a new brand family
  async createBrandFamily(family: { name: string; brand_id: string; description?: string }) {
    const { data, error } = await supabase.from("brand_families").insert([family]).select();
    if (error) throw error;
    return data;
  },

  // ✅ Update an existing brand family
  async updateBrandFamily(familyId: string, updates: { name?: string; brand_id?: string; description?: string }) {
    const { data, error } = await supabase.from("brand_families").update(updates).eq("id", familyId).select();
    if (error) throw error;
    return data;
  },

  // ✅ Enhanced Product Categories Management
  async getProductCategories() {
    const { data, error } = await supabase
      .from("product_categories")
      .select("*, parent:parent_id(name)")
      .order('name');
      
    if (error) {
      console.error("Error fetching product categories:", error);
      throw error;
    }
    return data;
  },

  // ✅ Create a new product category
  async createProductCategory(category: {
    name: string;
    description?: string | null;
    parent_id?: string | null;
  }) {
    const { data, error } = await supabase
      .from("product_categories")
      .insert([{
        name: category.name,
        description: category.description || null,
        parent_id: category.parent_id || null
      }])
      .select();

    if (error) {
      console.error("Error creating product category:", error);
      throw error;
    }
    return data;
  },

  // ✅ Update an existing product category
  async updateProductCategory(
    categoryId: string,
    updates: {
      name?: string;
      description?: string | null;
      parent_id?: string | null;
    }
  ) {
    const { data, error } = await supabase
      .from("product_categories")
      .update({
        name: updates.name,
        description: updates.description,
        parent_id: updates.parent_id
      })
      .eq('id', categoryId)
      .select();

    if (error) {
      console.error("Error updating product category:", error);
      throw error;
    }
    return data;
  },

  // ✅ Delete a product category with safety checks
  async deleteProductCategory(categoryId: string) {
    // Check for subcategories
    const { data: subcategories, error: subError } = await supabase
      .from("product_categories")
      .select("id")
      .eq("parent_id", categoryId);

    if (subError) {
      console.error("Error checking for subcategories:", subError);
      throw subError;
    }

    if (subcategories && subcategories.length > 0) {
      throw new Error("Cannot delete category with existing subcategories. Please delete or reassign subcategories first.");
    }

    // Check for products using this category
    const { data: products, error: prodError } = await supabase
      .from("products")
      .select("id")
      .eq("category_id", categoryId);

    if (prodError) {
      console.error("Error checking for products:", prodError);
      throw prodError;
    }

    if (products && products.length > 0) {
      throw new Error("Cannot delete category that is in use by products. Please reassign products first.");
    }

    // If all checks pass, delete the category
    const { data, error } = await supabase
      .from("product_categories")
      .delete()
      .eq("id", categoryId)
      .select();

    if (error) {
      console.error("Error deleting product category:", error);
      throw error;
    }

    return data;
  },

  // ✅ Get subcategories for a specific category
  async getSubcategories(parentId: string) {
    const { data, error } = await supabase
      .from("product_categories")
      .select("*")
      .eq("parent_id", parentId)
      .order('name');

    if (error) {
      console.error("Error fetching subcategories:", error);
      throw error;
    }
    return data;
  },

  // ✅ Check category dependencies
  async getCategoryDependencies(categoryId: string) {
    const [productsResponse, subcategoriesResponse] = await Promise.all([
      supabase
        .from("products")
        .select("id, name")
        .eq("category_id", categoryId),
      supabase
        .from("product_categories")
        .select("id, name")
        .eq("parent_id", categoryId)
    ]);

    return {
      products: productsResponse.data || [],
      subcategories: subcategoriesResponse.data || [],
      hasProducts: (productsResponse.data || []).length > 0,
      hasSubcategories: (subcategoriesResponse.data || []).length > 0,
      errors: {
        products: productsResponse.error,
        subcategories: subcategoriesResponse.error
      }
    };
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

    const { data: publicUrlData } = supabase.storage
      .from("sell_sheets")
      .getPublicUrl(filePath);

    return publicUrlData.publicUrl;
  }
};

export default productApi;

export const getBrands = async (): Promise<any[]> => {
  const { data, error } = await supabase
    .from("brands")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    console.error("❌ Error fetching brands from Supabase:", error);
    return [];
  }

  console.log("✅ Brands from Supabase:", data);
  return data;
};
  
  
