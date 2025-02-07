import React, { useState, useEffect } from "react";
import Image from "next/image";
import { toast } from "react-hot-toast";
import productApi from "@/lib/supabase/productApi";
import { Text, Heading } from "@/app/components/atoms/typography";
import { Button } from "@/app/components/atoms/buttons";
import { Input } from "@/app/components/atoms/inputs";
import { Select } from "@/app/components/atoms/inputs/select";

interface Category {
  id: string;
  name: string;
}

interface Brand {
  id: string;
  name: string;
}

interface Product {
  id?: string;
  name: string;
  sku: string;
  upc?: string;
  description?: string;
  category_id?: string;
  brand_id?: string;
  unit_measure_id?: string;
  base_unit_price?: number;
  wholesale_price?: number;
  msrp?: number;
  weight?: number;
  width?: number;
  height?: number;
  depth?: number;
  pack_size?: string;
  is_active: boolean;
  image_url?: string;
}

export interface ProductFormProps {
  onSubmit?: (productData: Product) => Promise<void>;
  onCancel?: () => void;
  product?: Product;
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess?: () => void;
}

export function ProductForm({ product, isOpen, onClose, onSubmitSuccess }: ProductFormProps) {
  const [formData, setFormData] = useState<Product>({
    name: "",
    sku: "",
    upc: "",
    description: "",
    category_id: "",
    brand_id: "",
    unit_measure_id: "",
    base_unit_price: 0,
    wholesale_price: 0,
    msrp: 0,
    weight: 0,
    width: 0,
    height: 0,
    depth: 0,
    pack_size: "1",
    is_active: true,
    image_url: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [units, setUnits] = useState<any[]>([]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('Modal isOpen state:', isOpen); // Debug log
    
    if (product) {
      setFormData({
        ...product,
        base_unit_price: product.base_unit_price || 0,
        wholesale_price: product.wholesale_price || 0,
        msrp: product.msrp || 0,
        weight: product.weight || 0,
        width: product.width || 0,
        height: product.height || 0,
        depth: product.depth || 0,
        pack_size: product.pack_size || "1",
      });
      setPreviewImage(product.image_url || null);
    } else {
      setFormData({
        name: "",
        sku: "",
        upc: "",
        description: "",
        category_id: "",
        brand_id: "",
        unit_measure_id: "",
        base_unit_price: 0,
        wholesale_price: 0,
        msrp: 0,
        weight: 0,
        width: 0,
        height: 0,
        depth: 0,
        pack_size: "1",
        image_url: "",
        is_active: true,
      });
      setPreviewImage(null);
    }
  }, [product, isOpen]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoryRes, brandRes, unitRes] = await Promise.all([
          productApi.getProductCategories(),
          productApi.getBrands(),
          productApi.getUnitMeasures(),
        ]);

        setCategories(categoryRes || []);
        setBrands(brandRes || []);
        setUnits(unitRes || []);
      } catch (err) {
        setError("Failed to load form data");
        toast.error("Failed to load form data.");
        console.error("Error fetching form data:", err);
      }
    };

    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];

    try {
      const imageUrl = await productApi.uploadProductImage(file);
      setPreviewImage(imageUrl);
      setFormData((prevData) => ({ ...prevData, image_url: imageUrl }));
      toast.success("Image uploaded successfully!");
    } catch (err) {
      toast.error("Image upload failed.");
      console.error("Error uploading image:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const cleanedData = {
        ...formData,
        category_id: formData.category_id || null,
        brand_id: formData.brand_id || null,
        unit_measure_id: formData.unit_measure_id || null,
      };

      if (product?.id) {
        await productApi.updateProduct(product.id, cleanedData);
        toast.success("Product updated successfully!");
      } else {
        await productApi.createProduct(cleanedData);
        toast.success("Product created successfully!");
      }

      onSubmitSuccess?.();
      onClose();
    } catch (err) {
      toast.error("Failed to save product.");
      console.error("Error submitting form:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (error) {
    return (
      <div className="p-6">
        <Text className="text-center text-red-500">{error}</Text>
      </div>
    );
  }

  return (
      <form onSubmit={handleSubmit} className="space-y-6 p-6">
        <Heading level={3} className="text-center mb-6">
          {product ? "Edit Product" : "Create New Product"}
        </Heading>

        <div className="flex items-center space-x-6">
          <div className="w-32 h-32 border border-gray-300 rounded-lg overflow-hidden">
            {previewImage ? (
              <Image src={previewImage} alt="Product" width={128} height={128} className="object-cover w-full h-full" />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                No Image
              </div>
            )}
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Upload Product Image</label>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageUpload}
              title="Upload product image"
              placeholder="Choose a file"
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Input 
            label="Product Name" 
            name="name" 
            value={formData.name} 
            onChange={handleInputChange} 
            required 
          />
          <Input 
            label="SKU" 
            name="sku" 
            value={formData.sku} 
            onChange={handleInputChange} 
            required 
          />
          <Select 
            label="Category" 
            name="category_id" 
            value={formData.category_id} 
            options={categories.map(cat => ({ 
              value: cat.id, 
              label: cat.name 
            }))} 
            onChange={handleInputChange} 
          />
          <Select 
            label="Brand" 
            name="brand_id" 
            value={formData.brand_id} 
            options={brands.map(brand => ({ 
              value: brand.id, 
              label: brand.name 
            }))} 
            onChange={handleInputChange} 
          />
          <Select 
            label="Unit of Measure" 
            name="unit_measure_id" 
            value={formData.unit_measure_id} 
            options={units.map(unit => ({ 
              value: unit.id, 
              label: unit.name 
            }))} 
            onChange={handleInputChange} 
          />
        </div>

        <div className="flex justify-center space-x-4 mt-8">
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="min-w-[120px]"
          >
            {isSubmitting ? "Saving..." : (product ? "Update" : "Create Product")}
          </Button>
          <Button 
            type="button" 
            variant="secondary" 
            onClick={onClose}
            className="min-w-[120px]"
          >
            Cancel
          </Button>
        </div>
      </form>
  );
}




