// app/pricing/components/pages/ProductSelector.tsx
"use client";

import React, { useState } from "react";
import { Card } from "@/app/components/molecules/cards/Card";
import { Button } from "@/app/components/atoms/buttons/Button";
import { Table } from "@/app/components/molecules/Table";
import { WholesaleCostInput } from "../WholesaleCostInput";
import { Select } from "@/app/components/atoms/inputs/select";
import { Plus, Filter, Download } from "lucide-react";

export default function ProductSelector() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  
  const [products] = useState([
    {
      name: "Winston Red Box",
      brand: "Winston",
      category: "Premium",
      packSize: "20",
      basePrice: 55.09,
      currentPrice: 53.09,
      adjustment: -2.00,
      lastUpdated: "2024-02-01"
    },
    // Add more sample data
  ]);

  // Sample options for filters
  const categories = [
    { value: "premium", label: "Premium" },
    { value: "discount", label: "Discount" },
    // Add more categories
  ];

  const brands = [
    { value: "winston", label: "Winston" },
    { value: "kool", label: "Kool" },
    // Add more brands
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Product Selection</h2>
          <p className="text-sm text-muted-foreground">
            Configure pricing for individual products
          </p>
        </div>
        <div className="flex space-x-4">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-4">
          <h3 className="text-sm font-semibold mb-3">Category Selection</h3>
          <Select
            value={selectedCategory}
            onChange={(event) => setSelectedCategory(event.target.value)}
            options={categories}
          />
        </Card>

        <Card className="p-4">
          <h3 className="text-sm font-semibold mb-3">Brand Selection</h3>
          <Select
            value={selectedBrand}
            onChange={(event) => setSelectedBrand(event.target.value)}
            options={brands}
          />
        </Card>

        <Card className="p-4">
          <h3 className="text-sm font-semibold mb-3">Cost Adjustment</h3>
          <WholesaleCostInput
            value={0}
            onChange={(value) => console.log('New cost:', value)}
            defaultCost={50.00}
          />
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Product Pricing</h3>
          <Button variant="default" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>
        <Table
          data={products}
          columns={[
            { key: "name", label: "Product Name" },
            { key: "brand", label: "Brand" },
            { key: "category", label: "Category" },
            { key: "packSize", label: "Pack Size" },
            { 
              key: "basePrice", 
              label: "Base Price",
              render: (value: unknown) => `$${(value as number).toFixed(2)}`
            },
            { 
              key: "currentPrice", 
              label: "Current Price",
              render: (value: unknown) => `$${(value as number).toFixed(2)}`
            },
            { 
              key: "adjustment", 
              label: "Adjustment",
              render: (value: unknown) => `$${(value as number).toFixed(2)}`
            },
            { key: "lastUpdated", label: "Last Updated" }
          ]}
          searchPlaceholder="Search products..."
        />
      </Card>
    </div>
  );
}