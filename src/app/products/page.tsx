'use client';

import React, { useEffect, useState } from "react";
import DashboardLayout from "@/app/components/templates/DashboardLayout";
import { ProductForm } from "@/app/products/forms/ProductForm";
import { ProductBulkUpload } from "@/app/products/ProductBulkUpload";
import productApi from "@/lib/supabase/productApi";
import { Button } from "@/app/components/atoms/buttons";
import { Modal } from "@/app/components/ui/modal";
import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@/app/components/ui/tabs";
import { Table } from "@/app/components/molecules/Table"; // Universal table component
import BrandsPage from "@/app/products/brands/page";
import CategoriesPage from "@/app/products/categories/page";
import ManufacturersPage from "@/app/products/manufacturers/page";
import UnitsPage from "./units/page";
import SellSheetPage from "./SellSheets/page";


export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch products on load
  useEffect(() => {
    async function fetchProducts() {
      try {
        const data = await productApi.getProducts();
        setProducts(data || []);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProducts();
  }, []);

  // Handle opening the form
  const handleAddProduct = () => {
    setSelectedProduct(null); // Clear selection for new product
    setIsFormOpen(true); // Open the modal
  };

  // Handle editing an existing product
  const handleEditClick = (product: any) => {
    setSelectedProduct(product); // Set the product to edit
    setIsFormOpen(true); // Open the modal
  };

  // Handle form submission success
  const handleFormSuccess = async () => {
    setIsFormOpen(false);
    try {
      const data = await productApi.getProducts();
      setProducts(data || []);
    } catch (error) {
      console.error("Error refreshing products:", error);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6 bg-gray-100">
        <h1 className="text-2xl font-bold text-gray-800">Products</h1>
        <p className="text-gray-600">
          Manage your products, brands, categories, and manufacturers. Use the tabs to navigate
          between different sections.
        </p>

        {/* Selected Product Details */}
        {selectedProduct && (
          <div className="p-4 bg-white shadow-md rounded-lg flex items-center space-x-6">
            <div className="w-1/3">
              <img
                src={selectedProduct.image_url || "/placeholder.png"}
                alt={selectedProduct.name}
                className="rounded-md w-full h-auto"
              />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold">{selectedProduct.name}</h2>
              <p>{selectedProduct.description}</p>
              <p className="mt-2 text-gray-700">
                <strong>Dimensions:</strong> {selectedProduct.width} x {selectedProduct.height} x {selectedProduct.depth}
              </p>
              <p className="text-gray-700">
                <strong>Price:</strong> ${selectedProduct.current_price}
              </p>
              <div className="mt-4 space-x-4">
                <Button>Edit Product</Button>
                <Button variant="ghost">Delete Product</Button>
              </div>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <Tabs defaultIndex={0}>
          <TabList>
            <Tab index={0} isActive={true} onClick={() => {}}>Products</Tab>
            <Tab index={1} isActive={false} onClick={() => {}}>Brands</Tab>
            <Tab index={2} isActive={false} onClick={() => {}}>Categories</Tab>
            <Tab index={3} isActive={false} onClick={() => {}}>Manufacturers</Tab>
            <Tab index={4} isActive={false} onClick={() => {}}>Units</Tab>
            <Tab index={5} isActive={false} onClick={() => {}}>Sell Sheets</Tab>
          </TabList>
          <TabPanels>
            {/* Products Tab */}
            <TabPanel isActive={true}>
              <div className="space-y-6">
                {/* Add Product Button */}
                <div className="flex items-center space-x-4">
                  <Button onClick={handleAddProduct} className="bg-blue-500 text-white hover:bg-blue-600">
                    Add Product
                  </Button>
                  <ProductBulkUpload />
                </div>

                {/* Products Table */}
                <Table
                  data={products}
                  columns={[
                    { key: "name", label: "Name" },
                    { key: "sku", label: "SKU" },
                    { key: "upc", label: "UPC" },
                    { key: "category", label: "Category" },
                    { key: "brand", label: "Brand" },
                    { key: "base_price", label: "Base Price" },
                    { key: "current_price", label: "Current Price" },
                  ]}
                  onEditClick={handleEditClick} // Pass edit handler
                  searchPlaceholder="Search Products..."
                />
              </div>
            </TabPanel>

            {/* Brands Tab */}
            <TabPanel isActive={false}>
              <BrandsPage />
            </TabPanel>

            {/* Categories Tab */}
            <TabPanel isActive={false}>
              <CategoriesPage />
            </TabPanel>

            {/* Manufacturers Tab */}
            <TabPanel isActive={false}>
              <ManufacturersPage />
            </TabPanel>

            {/* Units Tab */}
            <TabPanel isActive={false}>
              <UnitsPage />
            </TabPanel>
            
            {/* Sell Sheets Tab */}
            <TabPanel isActive={false}>
              <SellSheetPage />
            </TabPanel>
          </TabPanels>
        </Tabs>

        {/* Product Form Modal */}
        <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)}>
          <ProductForm
            product={selectedProduct}
            onSubmitSuccess={handleFormSuccess}
            onCancel={() => setIsFormOpen(false)}
          />
        </Modal>
      </div>
    </DashboardLayout>
  );
}

