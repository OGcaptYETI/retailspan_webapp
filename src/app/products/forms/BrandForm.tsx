'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/app/components/atoms/buttons';
import { Input } from '@/app/components/atoms/inputs';
import { supabase } from '@/lib/supabase/client';

interface BrandFormProps {
  brand?: {
    id?: string;
    name?: string;
    manufacturer_id?: string;
    website?: string;
  };
  onSave: (brand: { id?: string; name: string; manufacturer_id: string; website?: string }) => void;
  onCancel: () => void;
}

export const BrandForm: React.FC<BrandFormProps> = ({ brand, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: brand?.name || '',
    manufacturer_id: brand?.manufacturer_id || '',
    website: brand?.website || '',
  });
  const [manufacturers, setManufacturers] = useState<any[]>([]);

  useEffect(() => {
    async function fetchManufacturers() {
      const { data, error } = await supabase.from('manufacturers').select('id, name');
      if (error) console.error('Error fetching manufacturers:', error);
      else setManufacturers(data || []);
    }
    fetchManufacturers();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (formData.name && formData.manufacturer_id) {
      onSave(formData);
    } else {
      alert('Please fill out all required fields.');
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-cyan-400">
        {brand ? 'Edit Brand' : 'Add New Brand'}
      </h2>

      <Input label="Brand Name" name="name" value={formData.name} onChange={handleChange} required />

      <label htmlFor="manufacturer-select" className="block text-sm font-medium text-gray-700">
  Manufacturer
</label>
<select
  id="manufacturer-select"
  name="manufacturer_id"
  value={formData.manufacturer_id}
  onChange={handleChange}
  className="border rounded p-2 w-full"
  required
>
  <option value="">Select Manufacturer</option>
  {manufacturers.map((m) => (
    <option key={m.id} value={m.id}>
      {m.name}
    </option>
  ))}
</select>

      <Input label="Website" name="website" value={formData.website} onChange={handleChange} />

      <div className="flex justify-end space-x-4">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="default" onClick={handleSubmit}>
          Save
        </Button>
      </div>
    </div>
  );
};
