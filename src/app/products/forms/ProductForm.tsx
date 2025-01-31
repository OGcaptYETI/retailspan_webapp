import React, { useState, useEffect } from "react";
import productApi from "@/lib/supabase/productApi";
import { Text, Heading } from "@/app/components/atoms/typography";
import { Button } from "@/app/components/atoms/buttons";
import { Input } from "@/app/components/atoms/inputs";
import { Select } from "@/app/components/atoms/inputs/select";
import { supabase } from "@/lib/supabase/client";

export interface ProductFormProps {
  product?: any;
  onSubmitSuccess?: () => void;
  onCancel?: () => void;
}

export function ProductForm({ product, onSubmitSuccess, onCancel }: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: product?.name || "",
    sku: product?.sku || "",
    upc: product?.upc || "",
    description: product?.description || "",
    category_id: product?.category_id || null,  // ✅ Set to `null` instead of ""
  brand_id: product?.brand_id || null,  // ✅ Set to `null` instead of ""
  unit_measure_id: product?.unit_measure_id || null,  // ✅ Ensure it's `null`
    base_unit_price: product?.base_unit_price || "",
    wholesale_price: product?.wholesale_price || "",
    msrp: product?.msrp || "",
    weight: product?.weight || "",
    width: product?.width || "",
    height: product?.height || "",
    depth: product?.depth || "",
    is_active: product?.is_active ?? true,
    image_url: product?.image_url || "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [units, setUnits] = useState<any[]>([]);
  const [previewImage, setPreviewImage] = useState<string | null>(formData.image_url);

  // Fetch Categories, Brands, and Units
  useEffect(() => {
    const fetchData = async () => {
      const { data: categoryData } = await supabase.from("categories").select("*");
      const { data: brandData } = await supabase.from("brands").select("*");
      const { data: unitData } = await supabase.from("units").select("*");

      setCategories(categoryData || []);
      setBrands(brandData || []);
      setUnits(unitData || []);
    };

    fetchData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
  
    if (!file) {
      console.error("No file selected.");
      return;
    }
  
    // Generate a unique filename to avoid conflicts
    const uniqueFileName = `images/${Date.now()}-${file.name}`;
  
    try {
      // Upload file to Supabase Storage
      const { data, error } = await supabase.storage.from("product_images").upload(uniqueFileName, file, {
        cacheControl: "3600",
        upsert: true, // Allows overwriting existing files
      });
  
      if (error) {
        console.error("Image upload failed:", error);
        return;
      }
  
      // Get public URL of uploaded image

      const { data: user, error: authError } = await supabase.auth.getUser();
if (authError || !user) {
  console.error("User authentication failed:", authError);
  return;
}

// Now attempt the file upload

      const { data: urlData } = supabase.storage.from("product_images").getPublicUrl(uniqueFileName);
  
      if (!urlData.publicUrl) {
        console.error("Failed to retrieve image URL.");
        return;
      }
  
      // Update the form state with the uploaded image URL
      setPreviewImage(urlData.publicUrl);
      setFormData({ ...formData, image_url: urlData.publicUrl });
  
    } catch (err) {
      console.error("Unexpected error during image upload:", err);
    }
  };
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
  

    try {
      // ✅ Replace empty strings `""` with `null`
      const cleanedData = {
        ...formData,
        category_id: formData.category_id === "" ? null : formData.category_id,
        brand_id: formData.brand_id === "" ? null : formData.brand_id,
        unit_measure_id: formData.unit_measure_id === "" ? null : formData.unit_measure_id,
      };
  
      if (product) {
        await productApi.updateProduct(product.id, cleanedData);
      } else {
        await productApi.createProduct(cleanedData);
      }
  
      onSubmitSuccess?.();
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-4">
      <Heading level={3}>{product ? "Edit Product" : "Create New Product"}</Heading>

      {/* IMAGE UPLOAD */}
      <div className="flex items-center space-x-4">
        <div className="w-24 h-24 border border-gray-300 rounded-lg overflow-hidden">
          {previewImage ? (
            <img src={previewImage} alt="Product" className="object-cover w-full h-full" />
          ) : (
            <div className="text-center text-gray-500 p-4">No Image</div>
          )}
        </div>
        <div>
          <label className="block text-gray-700">Upload Product Image</label>
          <input type="file" accept="image/*" onChange={handleImageUpload} className="mt-1" title="Upload Product Image" />
        </div>
      </div>

      {/* PRODUCT DETAILS */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Input label="Product Name" name="name" value={formData.name} onChange={handleInputChange} required />
        <Input label="SKU" name="sku" value={formData.sku} onChange={handleInputChange} required />
        <Input label="UPC" name="upc" value={formData.upc} onChange={handleInputChange} />

        <Select
  label="Category"
  name="category_id"
  value={formData.category_id || ""} // ✅ Ensures non-null value
  options={categories.map((cat) => ({ value: cat.id, label: cat.name }))} 
  onChange={handleInputChange}
/>

<Select
  label="Brand"
  name="brand_id"
  value={formData.brand_id || ""} // ✅ Prevents null value
  options={brands.map((brand) => ({ value: brand.id, label: brand.name }))}
  onChange={handleInputChange}
/>

<Select
  label="Unit Measure"
  name="unit_measure_id"
  value={formData.unit_measure_id || ""} // ✅ Prevents null value
  options={units.map((unit) => ({ value: unit.id, label: unit.name }))}
  onChange={handleInputChange}
/>


        <Input label="Base Unit Price ($)" name="base_unit_price" value={formData.base_unit_price} onChange={handleInputChange} type="number" />
        <Input label="Wholesale Price ($)" name="wholesale_price" value={formData.wholesale_price} onChange={handleInputChange} type="number" />
        <Input label="MSRP ($)" name="msrp" value={formData.msrp} onChange={handleInputChange} type="number" />

        <Input label="Width (in)" name="width" value={formData.width} onChange={handleInputChange} type="number" />
        <Input label="Height (in)" name="height" value={formData.height} onChange={handleInputChange} type="number" />
        <Input label="Depth (in)" name="depth" value={formData.depth} onChange={handleInputChange} type="number" />
      </div>

      <label className="flex items-center">
        <input type="checkbox" name="is_active" checked={formData.is_active} onChange={handleInputChange} className="mr-2" />
        <Text>Active</Text>
      </label>

      <div className="flex space-x-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : product ? "Update" : "Create Product"}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}


