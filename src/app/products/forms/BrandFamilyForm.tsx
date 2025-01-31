'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/app/components/atoms/buttons';
import { Input } from '@/app/components/atoms/inputs';
import { supabase } from '@/lib/supabase/client';

export const BrandFamilyForm = ({
  brandFamily,
  onSave,
  onCancel,
}: {
  brandFamily?: any;
  onSave: (data: any) => void;
  onCancel: () => void;
}) => {
  const [brands, setBrands] = useState<any[]>([]);
  const [manufacturers, setManufacturers] = useState<any[]>([]);
  const [name, setName] = useState(brandFamily?.name || '');
  const [description, setDescription] = useState(brandFamily?.description || '');
  const [brandId, setBrandId] = useState(brandFamily?.brand_id || '');
  const [selectedManufacturer, setSelectedManufacturer] = useState('');

  // Fetch brands and manufacturers
  useEffect(() => {
    async function fetchData() {
      const { data: brandsData, error: brandError } = await supabase.from('brands').select('id, name, manufacturer');
      if (brandError) console.error('Error fetching brands:', brandError);
      else setBrands(brandsData || []);

      const { data: manufacturersData, error: manufacturerError } = await supabase.from('manufacturers').select('id, name');
      if (manufacturerError) console.error('Error fetching manufacturers:', manufacturerError);
      else setManufacturers(manufacturersData || []);
    }

    fetchData();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !brandId) {
      alert('Name and Brand are required.');
      return;
    }

    // Remove `id` from submission to prevent conflict
    const payload = { name, description, brand_id: brandId };

    onSave(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input label="Brand Family Name" value={name} onChange={(e) => setName(e.target.value)} required />
      <Input label="Description" value={description} onChange={(e) => setDescription(e.target.value)} />

      {/* Manufacturer Dropdown */}
      <label htmlFor="manufacturer-select" className="block text-sm font-medium text-gray-700">
        Select Manufacturer
      </label>
      <select
        id="manufacturer-select"
        value={selectedManufacturer}
        onChange={(e) => setSelectedManufacturer(e.target.value)}
        className="border rounded p-2 w-full"
      >
        <option value="">Filter by Manufacturer</option>
        {manufacturers.map((manufacturer) => (
          <option key={manufacturer.id} value={manufacturer.name}>
            {manufacturer.name}
          </option>
        ))}
      </select>

      {/* Brand Dropdown (Filtered by Manufacturer) */}
      <label htmlFor="brand-select" className="block text-sm font-medium text-gray-700">
        Select Brand
      </label>
      <select
        id="brand-select"
        value={brandId}
        onChange={(e) => setBrandId(e.target.value)}
        className="border rounded p-2 w-full"
        required
      >
        <option value="">Select Brand</option>
        {brands
          .filter((brand) => !selectedManufacturer || brand.manufacturer === selectedManufacturer)
          .map((brand) => (
            <option key={brand.id} value={brand.id}>
              {brand.name}
            </option>
          ))}
      </select>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="bg-blue-500 text-white hover:bg-blue-600">
          Save
        </Button>
      </div>
    </form>
  );
};
