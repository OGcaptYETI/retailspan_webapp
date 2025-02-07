import React, { useEffect, useState } from "react";
import { Select } from "@/app/components/atoms/inputs/select";
import { Button } from "@/app/components/atoms/buttons";
import productApi from "@/lib/supabase/productApi";

export interface ProductFilterProps {
  filters: {
    manufacturer: string;
    category: string;
    brand: string;
    brandFamily: string;
  };
  onFilterChange: (filters: ProductFilterProps["filters"]) => void;
}

export function ProductFilter({ filters, onFilterChange }: ProductFilterProps) {
  const [manufacturers, setManufacturers] = useState<{ id: string; name: string }[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string; manufacturer_id: string }[]>([]);
  const [brands, setBrands] = useState<{ id: string; name: string; category_id: string }[]>([]);
  const [brandFamilies, setBrandFamilies] = useState<{ id: string; name: string; brand_id: string }[]>([]);

  useEffect(() => {
    async function fetchFilters() {
      try {
        const [manufacturersData, categoriesData, brandsData, brandFamiliesData] = await Promise.all([
          productApi.getManufacturers(),
          productApi.getSubcategories(''),
          productApi.getBrands(),
          productApi.getBrandFamilies(),
        ]);

        setManufacturers(manufacturersData || []);
        setCategories(categoriesData || []);
        setBrands(brandsData || []);
        setBrandFamilies(brandFamiliesData || []);
      } catch (error) {
        console.error("Error fetching filter options:", error);
      }
    }

    fetchFilters();
  }, []);

  const handleFilterChange = (name: keyof ProductFilterProps["filters"], value: string) => {
    const updatedFilters = { ...filters, [name]: value };

    // Reset dependent filters
    if (name === "manufacturer") {
      updatedFilters.category = "";
      updatedFilters.brand = "";
      updatedFilters.brandFamily = "";
    } else if (name === "category") {
      updatedFilters.brand = "";
      updatedFilters.brandFamily = "";
    } else if (name === "brand") {
      updatedFilters.brandFamily = "";
    }

    onFilterChange(updatedFilters);
  };

  return (
    <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-lg shadow">
      {/* Manufacturer Filter */}
      <Select
        label="Manufacturer"
        name="manufacturer"
        value={filters.manufacturer}
        options={[
          { value: "", label: "All Manufacturers" },
          ...manufacturers.map((m) => ({ value: m.id, label: m.name })),
        ]}
        onChange={(e) => handleFilterChange("manufacturer", e.target.value)}
      />

      {/* Category Filter (Dependent on Manufacturer) */}
      <Select
        label="Category"
        name="category"
        value={filters.category}
        options={[
          { value: "", label: "All Categories" },
          ...categories
            .filter((c) => !filters.manufacturer || c.manufacturer_id === filters.manufacturer)
            .map((c) => ({ value: c.id, label: c.name })),
        ]}
        onChange={(e) => handleFilterChange("category", e.target.value)}
        disabled={!filters.manufacturer && categories.length > 0}
      />

      {/* Brand Filter (Dependent on Category) */}
      <Select
        label="Brand"
        name="brand"
        value={filters.brand}
        options={[
          { value: "", label: "All Brands" },
          ...brands
            .filter((b) => !filters.category || b.category_id === filters.category)
            .map((b) => ({ value: b.id, label: b.name })),
        ]}
        onChange={(e) => handleFilterChange("brand", e.target.value)}
        disabled={!filters.category && brands.length > 0}
      />

      {/* Brand Family Filter (Dependent on Brand) */}
      <Select
        label="Brand Family"
        name="brandFamily"
        value={filters.brandFamily}
        options={[
          { value: "", label: "All Brand Families" },
          ...brandFamilies
            .filter((bf) => !filters.brand || bf.brand_id === filters.brand)
            .map((bf) => ({ value: bf.id, label: bf.name })),
        ]}
        onChange={(e) => handleFilterChange("brandFamily", e.target.value)}
        disabled={!filters.brand && brandFamilies.length > 0}
      />

      {/* Reset Filters Button */}
      <Button
        variant="outline"
        onClick={() => onFilterChange({ manufacturer: "", category: "", brand: "", brandFamily: "" })}
      >
        Reset Filters
      </Button>
    </div>
  );
}
