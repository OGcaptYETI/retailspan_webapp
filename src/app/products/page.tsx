"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Pencil, Trash2 } from "lucide-react";
import DashboardLayout from "@/app/components/templates/layouts/DashboardLayout";
import productApi from "@/lib/supabase/productApi";
import { ProductModal } from "@/app/products/ProductModal";
import { ProductBulkUpload } from "./ProductBulkUpload";
import { ProductGrid } from "@/app/products/components/ProductGrid";
import { ProductFilter } from "@/app/products/components/ProductFilter";
import { Button } from "@/app/components/atoms/buttons/Button";
import { Tabs, TabList, TabPanels, TabPanel, Tab } from "@/app/components/ui/tabs";
import { Table } from "@/app/components/molecules/Table";
import { Switch } from "@/app/components/ui/switch";
import { toast } from "react-hot-toast";

// Import product-related pages
import BrandsPage from "./brands/page";
import CategoriesPage from "./categories/page";
import ManufacturersPage from "./manufacturers/page";
import UnitsPage from "./units/page";
import SellSheetPage from "./SellSheets/page";

interface Product {
  id: string;
  name: string;
  sku: string;
  upc: string;
  brand_name: string;
  category_name: string;
  base_unit_price: number;
  msrp: number;
  wholesale_price: number;
  description?: string;
  image_url?: string;
  category_id: string;
  brand_id: string;
  manufacturer_id?: string;
  is_active: boolean;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [isGridView, setIsGridView] = useState(false);
  const [filters, setFilters] = useState({
    manufacturer: "",
    category: "",
    brand: "",
    brandFamily: "",
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const data = await productApi.getProducts();
      setProducts(Array.isArray(data) ? data : []);
      setFilteredProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    let filtered = products;

    if (newFilters.manufacturer) {
      filtered = filtered.filter((p) => p.manufacturer_id === newFilters.manufacturer);
    }
    if (newFilters.category) {
      filtered = filtered.filter((p) => p.category_id === newFilters.category);
    }
    if (newFilters.brand) {
      filtered = filtered.filter((p) => p.brand_id === newFilters.brand);
    }
    setFilteredProducts(filtered);
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabList className="border-b border-border">
            <Tab value={0}>Products</Tab>
            <Tab value={1}>Brands</Tab>
            <Tab value={2}>Categories</Tab>
            <Tab value={3}>Manufacturers</Tab>
            <Tab value={4}>Units</Tab>
            <Tab value={5}>Sell Sheets</Tab>
          </TabList>

          <TabPanels>
            {/* Products Tab */}
            <TabPanel value={0}>
              {/* Product Filters */}
              <ProductFilter filters={filters} onFilterChange={handleFilterChange} />

              {/* View Toggle */}
              <div className="flex justify-between items-center">
                <Button variant="default" onClick={() => setIsProductModalOpen(true)}>
                  Add Product
                </Button>
                <ProductBulkUpload onSuccess={fetchProducts} />
                <div className="flex items-center gap-2">
                  <span className="text-sm">Table View</span>
                  <Switch checked={isGridView} onCheckedChange={setIsGridView} />
                  <span className="text-sm">Grid View</span>
                </div>
              </div>

              {/* Grid or Table View */}
              {isGridView ? (
                <ProductGrid products={filteredProducts} onProductSelect={setSelectedProduct} />
              ) : (
                <div className="bg-card rounded-lg shadow-sm overflow-hidden mt-4">
                  <Table
                    data={filteredProducts}
                    columns={[
                      {
                        key: "image",
                        label: "Image",
                        render: (_value, row: Product) => (
                          <div className="w-12 h-12 flex items-center justify-center">
                            {row?.image_url ? ( // ✅ Ensuring `row` is defined before accessing `image_url`
                              <Image
                                src={row.image_url}
                                alt={row.name || "Product Image"}
                                width={48}
                                height={48}
                                style={{ width: "auto", height: "auto", maxWidth: "100%", maxHeight: "100%" }} // ✅ Ensuring aspect ratio
                                className="rounded-md object-contain"
                              />
                            ) : (
                              <div className="w-12 h-12 flex items-center justify-center text-gray-500 border rounded-md">
                                No Image
                              </div>
                            )}
                          </div>
                        ),
                      },
                    
                      { key: "name", label: "Product Name" },
                      { key: "brand_name", label: "Brand" },
                      { key: "category_name", label: "Category" },
                      { key: "sku", label: "SKU" },
                      {
                        key: "actions",
                        label: "Actions",
                        render: (value: unknown, row: Record<string, unknown>) => (
                          <div className="flex gap-2">
                            <button onClick={() => setSelectedProduct(row)} className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300">
                              <Pencil size={18} />
                            </button>
                            <button onClick={() => console.log("Delete product")} className="p-2 rounded-lg bg-red-500 text-white hover:bg-red-600">
                              <Trash2 size={18} />
                            </button>
                          </div>
                        ),
                      },
                    ]}
                    onRowClick={(row) => setSelectedProduct(row as Product)}
                    isLoading={isLoading}
                    rowClassName={(row) => (selectedProduct?.id === (row as Product).id ? "bg-gray-100" : "")}
                  />
                </div>
              )}
            </TabPanel>

            {/* Other Tabs */}
            <TabPanel value={1}>
              <BrandsPage />
            </TabPanel>
            <TabPanel value={2}>
              <CategoriesPage />
            </TabPanel>
            <TabPanel value={3}>
              <ManufacturersPage />
            </TabPanel>
            <TabPanel value={4}>
              <UnitsPage />
            </TabPanel>
            <TabPanel value={5}>
              <SellSheetPage />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>

      <ProductModal isOpen={isProductModalOpen} onClose={() => setIsProductModalOpen(false)} product={selectedProduct} />
    </DashboardLayout>
  );
}



