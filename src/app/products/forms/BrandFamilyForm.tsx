// /app/products/brands/BrandFamilyForm.tsx
"use client";

import React, { useState } from "react";
import { Button } from "@/app/components/atoms/buttons";
import { Select } from "@/app/components/atoms/inputs/SelectOptions";
import { toast } from "react-hot-toast";

interface BrandFamilyData {
  manufacturerId: string;
  brandId: string;
}

interface BrandFamilyFormProps {
  manufacturers?: Array<{ id: string; name: string }>;
  brands?: Array<{ id: string; name: string; manufacturer: string }>;
  onSave: (data: BrandFamilyData) => Promise<void>;
  onCancel: () => void;
}

export function BrandFamilyForm({ 
  manufacturers = [], 
  brands = [], 
  onSave,
  onCancel 
}: BrandFamilyFormProps) {
  const [selectedManufacturer, setSelectedManufacturer] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const manufacturerOptions = manufacturers.map(m => ({
    value: m.id,
    label: m.name
  }));

  const brandOptions = brands
    .filter(b => !selectedManufacturer || b.manufacturer === selectedManufacturer)
    .map(b => ({
      value: b.id,
      label: b.name
    }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedManufacturer || !selectedBrand) {
      toast.error("Please select both manufacturer and brand");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave({
        manufacturerId: selectedManufacturer,
        brandId: selectedBrand
      });
      toast.success("Brand family created successfully");
      onCancel();
    } catch (error) {
      toast.error("Failed to create brand family");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Create Brand Family</h2>
        <p className="text-sm text-muted-foreground">
          Link a manufacturer with its associated brand
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Manufacturer</label>
            <Select
              options={manufacturerOptions}
              value={selectedManufacturer}
              onChange={(e) => setSelectedManufacturer(e.target.value)}
              placeholder="Select Manufacturer"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Brand</label>
            <Select
              options={brandOptions}
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              placeholder="Select Brand"
              disabled={!selectedManufacturer}
              required
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || !selectedManufacturer || !selectedBrand}
          >
            {isSubmitting ? "Creating..." : "Create Brand Family"}
          </Button>
        </div>
      </form>
    </div>
  );
}
