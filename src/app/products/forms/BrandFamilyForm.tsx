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
  const [name, setName] = useState(brandFamily?.name || '');
  const [description, setDescription] = useState(brandFamily?.description || '');
  const [brandId, setBrandId] = useState(brandFamily?.brand_id || '');

  useEffect(() => {
    async function fetchBrands() {
      const { data, error } = await supabase.from('brands').select('*');
      if (error) console.error('Error fetching brands:', error);
      else setBrands(data || []);
    }
    fetchBrands();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !brandId) {
      alert('Name and Brand are required.');
      return;
    }
    onSave({ id: brandFamily?.id, name, description, brand_id: brandId });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Brand Family Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <Input
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <label htmlFor="brand-select" className="block text-sm font-medium text-gray-700">Brand</label>
      <select
        id="brand-select"
        value={brandId}
        onChange={(e) => setBrandId(e.target.value)}
        className="border rounded p-2 w-full"
        required
      >
        <option value="">Select Brand</option>
        {brands.map((brand) => (
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
