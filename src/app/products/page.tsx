"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import DashboardLayout from "@/app/components/templates/layouts/DashboardLayout";
import productApi from "@/lib/supabase/productApi";
import { ProductForm } from "@/app/products/forms/ProductForm";
import { ProductBulkUpload } from "@/app/products/ProductBulkUpload";
import { Button } from "@/app/components/atoms/buttons/Button";
import { Modal } from "@/app/components/ui/modal";
import { Tabs, TabList, Tab, TabPanels, TabPanel } from "@/app/components/ui/tabs";
import { Table } from "@/app/components/molecules/Table";
import BrandsPage from "@/app/products/brands/page";
import CategoriesPage from "@/app/products/categories/page";
import ManufacturersPage from "@/app/products/manufacturers/page";
import UnitsPage from "@/app/products/units/page";
import SellSheetPage from "@/app/products/SellSheets/page";

interface Product {
  id: string;
  name: string;
  sku: string;
  upc: string;
  brand_name: string;
  category_name: string;
  base_unit_price: number;
  msrp: number;
  description?: string;
  image_url?: string;
  width?: number;
  height?: number;
  depth?: number;
  current_price?: number;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  // ✅ Fetch Products on Load
  useEffect(() => {
    async function fetchProducts() {
      try {
        const data = await productApi.getProducts();
        if (Array.isArray(data) && data.length > 0) {
          setProducts(data);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProducts();
  }, []);

  // ✅ Handle Adding New Product
  const handleAddProduct = () => {
    setSelectedProduct(null);
    setIsFormOpen(true);
  };

  // ✅ Handle Editing Product
  const handleEditClick = (product: Product) => {
    setSelectedProduct(product);
    setIsFormOpen(true);
  };

  // ✅ Refresh Data After Form Submission
  const handleFormSuccess = async () => {
    setIsFormOpen(false);
    try {
      const data = await productApi.getProducts();
      setProducts(data.length > 0 ? data : []);
    } catch (error) {
      console.error("Error refreshing products:", error);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col min-h-screen bg-background">
        <div className="flex-1 p-6 space-y-6">
          <div className="max-w-[2000px] mx-auto w-full">
            <h1 className="text-2xl font-bold text-primary">Products</h1>
            <p className="text-sm text-muted-foreground mt-2">
              Manage your products, brands, categories, and manufacturers. Use the tabs to navigate.
            </p>

            {/* ✅ Product Details Section */}
            {selectedProduct && (
              <div className="mt-6 p-4 bg-card text-card-foreground rounded-lg shadow-lg flex items-start space-x-6">
                <div className="relative w-24 h-24">
                  <Image
                    src={selectedProduct.image_url || "/placeholder.png"}
                    alt={selectedProduct.name}
                    className="object-cover rounded"
                    fill
                    sizes="(max-width: 96px) 100vw"
                  />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-semibold">{selectedProduct.name}</h2>
                  <p className="text-sm text-muted-foreground">{selectedProduct.description || "No description available."}</p>
                  <p className="mt-2 text-sm">
                    <strong>Dimensions:</strong> {selectedProduct.width || 0} × {selectedProduct.height || 0} × {selectedProduct.depth || 0}
                  </p>
                  <p className="text-sm">
                    <strong>Price:</strong> ${selectedProduct.current_price || selectedProduct.base_unit_price}
                  </p>
                  <div className="mt-4 flex space-x-4">
                    <Button variant="default" onClick={() => handleEditClick(selectedProduct)}>
                      Edit Product
                    </Button>
                    <Button variant="destructive">Delete Product</Button>
                  </div>
                </div>
              </div>
            )}

            {/* ✅ Tabs Navigation */}
            <div className="mt-6">
              <Tabs activeIndex={activeTab} handleTabClick={setActiveTab}>
                <TabList>
                  <Tab>Products</Tab>
                  <Tab>Brands</Tab>
                  <Tab>Categories</Tab>
                  <Tab>Manufacturers</Tab>
                  <Tab>Units</Tab>
                  <Tab>Sell Sheets</Tab>
                </TabList>

                <TabPanels>
                  {/* Products Tab */}
                  <TabPanel>
                    <div className="flex flex-col space-y-6">
                      <div className="flex items-center justify-between">
                        <Button variant="default" onClick={handleAddProduct}>
                          Add Product
                        </Button>
                        <ProductBulkUpload />
                      </div>

                      {/* ✅ Products Table */}
                      <div className="bg-card rounded-lg shadow-sm overflow-hidden">
                        <Table
                          data={products}
                          columns={[
                            { key: "name", label: "Name" },
                            { key: "sku", label: "SKU" },
                            { key: "upc", label: "UPC" },
                            { key: "brand_name", label: "Brand" },
                            { key: "category_name", label: "Category" },
                            { key: "base_unit_price", label: "Base Price" },
                            { key: "msrp", label: "MSRP" },
                          ]}
                          onEditClick={(row) => handleEditClick(row as Product)}
                          searchPlaceholder="Search Products..."
                          isLoading={isLoading}
                        />
                      </div>
                    </div>
                  </TabPanel>

                  {/* Other Tabs */}
                  <TabPanel><BrandsPage /></TabPanel>
                  <TabPanel><CategoriesPage /></TabPanel>
                  <TabPanel><ManufacturersPage /></TabPanel>
                  <TabPanel><UnitsPage /></TabPanel>
                  <TabPanel><SellSheetPage /></TabPanel>
                </TabPanels>
              </Tabs>
            </div>
          </div>
        </div>

        {/* ✅ Product Form Modal */}
        <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)}>
          <ProductForm product={selectedProduct} onSubmitSuccess={handleFormSuccess} onCancel={() => setIsFormOpen(false)} />
        </Modal>
      </div>
    </DashboardLayout>
  );
}
