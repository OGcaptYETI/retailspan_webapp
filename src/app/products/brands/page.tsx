// /app/products/brands/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Table } from "@/app/components/molecules/Table";
import { Button } from "@/app/components/atoms/buttons";
import productApi from "@/lib/supabase/productApi";
import { BrandModal } from "./BrandModal";
import { BrandFamilyModal } from "./BrandFamilyModal";
import { toast } from "react-hot-toast";

export default function BrandsPage() {
  // State Management
  const [brands, setBrands] = useState<any[]>([]);
  const [brandFamilies, setBrandFamilies] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal States
  const [isBrandModalOpen, setIsBrandModalOpen] = useState(false);
  const [isFamilyModalOpen, setIsFamilyModalOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<any | null>(null);
  const [selectedFamily, setSelectedFamily] = useState<any | null>(null);

  // Data Fetching
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [brandsData, familiesData] = await Promise.all([
        productApi.getBrands(),
        productApi.getBrandFamiliesWithBrandNames()
      ]);
      
      setBrands(brandsData || []);
      setBrandFamilies(familiesData || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load data");
    } finally {
      setIsLoading(false);
    }
  };

  // Brand Handlers
  const handleAddBrand = () => {
    setSelectedBrand(null);
    setIsBrandModalOpen(true);
  };

  const handleEditBrand = (brand: any) => {
    setSelectedBrand(brand);
    setIsBrandModalOpen(true);
  };

  const handleSaveBrand = async (brandData: any) => {
    try {
      if (brandData.id) {
        await productApi.updateBrand(brandData.id, brandData);
        toast.success("Brand updated successfully");
      } else {
        await productApi.createBrand(brandData);
        toast.success("Brand created successfully");
      }
      await fetchData();
    } catch (error) {
      console.error("Error saving brand:", error);
      toast.error("Failed to save brand");
    }
  };

  // Brand Family Handlers
  const handleAddFamily = () => {
    setSelectedFamily(null);
    setIsFamilyModalOpen(true);
  };

  const handleEditFamily = (family: any) => {
    setSelectedFamily(family);
    setIsFamilyModalOpen(true);
  };

  const handleSaveFamily = async (familyData: any) => {
    try {
      if (familyData.id) {
        await productApi.updateBrandFamily(familyData.id, familyData);
        toast.success("Brand family updated successfully");
      } else {
        await productApi.createBrandFamily(familyData);
        toast.success("Brand family created successfully");
      }
      await fetchData();
    } catch (error) {
      console.error("Error saving brand family:", error);
      toast.error("Failed to save brand family");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Brands</h1>
        <div className="space-x-4">
          <Button onClick={handleAddBrand}>Add Brand</Button>
          <Button variant="secondary" onClick={handleAddFamily}>
            Add Brand Family
          </Button>
        </div>
      </div>

      {/* Brands Table */}
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Brand List</h2>
        <Table
          data={brands}
          columns={[
            { key: "name", label: "Brand Name" },
            { key: "manufacturer", label: "Manufacturer" },
            { key: "website", label: "Website" },
          ]}
          searchPlaceholder="Search brands..."
          onEditClick={handleEditBrand}
          isLoading={isLoading}
        />
      </div>

      {/* Brand Families Table */}
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Brand Families</h2>
        <Table
          data={brandFamilies}
          columns={[
            { key: "name", label: "Family Name" },
            { key: "brand_name", label: "Parent Brand" },
            { key: "description", label: "Description" },
          ]}
          searchPlaceholder="Search brand families..."
          onEditClick={handleEditFamily}
          isLoading={isLoading}
        />
      </div>

      {/* Modals */}
      <BrandModal
        isOpen={isBrandModalOpen}
        onClose={() => setIsBrandModalOpen(false)}
        brand={selectedBrand}
        onSave={handleSaveBrand}
      />

      <BrandFamilyModal
        isOpen={isFamilyModalOpen}
        onClose={() => setIsFamilyModalOpen(false)}
        brandFamily={selectedFamily}
        onSave={handleSaveFamily}
        brands={brands}
      />
    </div>
  );
}


