'use client';

import React, { useState, ChangeEvent } from 'react';
import { Button } from '@/app/components/atoms/buttons';
import { Input } from '@/app/components/atoms/inputs';

interface BrandFormProps {
  brand?: {
    id?: string;
    name?: string;
    manufacturer?: string;
    website?: string;
  };
  onSave: (brand: { id?: string; name: string; manufacturer: string; website?: string }) => void;
  onCancel: () => void;
}

export const BrandForm: React.FC<BrandFormProps> = ({ brand, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: brand?.name || '',
    manufacturer: brand?.manufacturer || '',
    website: brand?.website || '',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    if (formData.name && formData.manufacturer) {
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
      <div className="space-y-2">
        <Input
          label="Brand Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <Input
          label="Manufacturer"
          name="manufacturer"
          value={formData.manufacturer}
          onChange={handleChange}
          required
        />
        <Input
          label="Website"
          name="website"
          value={formData.website}
          onChange={handleChange}
        />
      </div>
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
