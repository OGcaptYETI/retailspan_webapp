'use client';

import React, { useState, useEffect } from 'react';
import { Table } from '@/app/components/molecules/Table'; // Universal table component
import { Button } from '@/app/components/atoms/buttons';
import { Modal } from '@/app/components/ui/modal';
import productApi from '@/lib/supabase/productApi';
import { BrandForm } from '@/app/products/forms/BrandForm';
import { BrandFamilyForm } from '@/app/products/forms/BrandFamilyForm';

export default function BrandsPage() {
  const [brands, setBrands] = useState<any[]>([]);
  const [brandFamilies, setBrandFamilies] = useState<any[]>([]);
  const [isBrandModalOpen, setIsBrandModalOpen] = useState(false);
  const [isFamilyModalOpen, setIsFamilyModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<any | null>(null);
  const [editingFamily, setEditingFamily] = useState<any | null>(null);

  // Fetch brands and brand families
  useEffect(() => {
    fetchBrands();
    fetchBrandFamilies();
  }, []);

  const fetchBrands = async () => {
    try {
      const data = await productApi.getBrands();
      console.log("🔍 Fetching brands:", data); // ✅ Debugging Log
      setBrands(data || []);
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  };
  
  const fetchBrandFamilies = async () => {
    try {
      const families = await productApi.getBrandFamiliesWithBrandNames();
      setBrandFamilies(families || []);
    } catch (error) {
      console.error('Error fetching brand families:', error);
    }
  };
  

  const handleAddBrand = () => {
    setEditingBrand(null);
    setIsBrandModalOpen(true);
  };

  const handleAddBrandFamily = () => {
    setEditingFamily(null);
    setIsFamilyModalOpen(true);
  };

  const handleEditBrand = (brand: any) => {
    setEditingBrand(brand);
    setIsBrandModalOpen(true);
  };

  const handleEditBrandFamily = (family: any) => {
    setEditingFamily(family);
    setIsFamilyModalOpen(true);
  };

  const handleSaveBrand = async (brand: any) => {
    try {
      if (brand.id) {
        const [error] = await productApi.updateBrand(brand.id, brand);
        if (error) throw error;
      } else {
        const [error] = await productApi.createBrand(brand);
        if (error) {
          alert(error.message || "Failed to create brand");
          return;
        }
      }
  
      console.log("✅ Brand saved, refreshing list...");
      await fetchBrands(); // Refresh brands from database
    } catch (error) {
      console.error("❌ Error saving brand:", error);
      alert(error instanceof Error ? error.message : "Unknown error");
    } finally {
      setIsBrandModalOpen(false);
    }
  };
  
  
  

  const handleSaveBrandFamily = async (family: any) => {
    try {
      if (family.id) {
        await productApi.updateBrandFamily(family.id, family);
      } else {
        await productApi.createBrandFamily(family); // ✅ No id sent
      }
      await fetchBrandFamilies();
    } catch (error) {
      console.error('Error saving brand family:', error);
    } finally {
      setIsFamilyModalOpen(false);
    }
  };
  

  return (
    <div className="p-6 space-y-6 bg-gray-100">
      <h1 className="text-2xl font-bold text-gray-800">Manage Brands and Brand Families</h1>

      {/* Add Buttons */}
      <div className="flex space-x-4 mb-4">
        <Button onClick={handleAddBrand} className="bg-blue-500 text-white hover:bg-blue-600">
          Add Brand
        </Button>
        <Button onClick={handleAddBrandFamily} className="bg-green-500 text-white hover:bg-green-600">
          Add Brand Family
        </Button>
      </div>

      {/* Brands Table */}
      <Table
        data={brands}
        columns={[
          { key: 'name', label: 'Brand Name' },
          { key: 'manufacturer', label: 'Manufacturer' },
          { key: 'website', label: 'Website' },
        ]}
        searchPlaceholder="Search Brands..."
        onEditClick={handleEditBrand} // Edit Brand
      />

      {/* Brand Families Table */}
      <Table
  data={brandFamilies.map((family) => ({
    ...family,
    brand_name: family.brands?.name || 'N/A', // Use the joined name field or default to 'N/A'
  }))}
  columns={[
    { key: 'name', label: 'Brand Family Name' },
    { key: 'brand_name', label: 'Parent Brand' }, // Show the Parent Brand
    { key: 'description', label: 'Description' },
  ]}
  searchPlaceholder="Search Brand Families..."
  onEditClick={handleEditBrandFamily} // Edit Brand Family
/>


      {/* Brand Modal */}
      <Modal isOpen={isBrandModalOpen} onClose={() => setIsBrandModalOpen(false)}>
        <BrandForm
          brand={editingBrand}
          onSave={handleSaveBrand}
          onCancel={() => setIsBrandModalOpen(false)}
        />
      </Modal>

      {/* Brand Family Modal */}
      <Modal isOpen={isFamilyModalOpen} onClose={() => setIsFamilyModalOpen(false)}>
        <BrandFamilyForm
          brandFamily={editingFamily}
          onSave={handleSaveBrandFamily}
          onCancel={() => setIsFamilyModalOpen(false)}
        />
      </Modal>
    </div>
  );
}


