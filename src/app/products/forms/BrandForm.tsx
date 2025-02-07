// /app/products/forms/BrandForm.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/app/components/atoms/buttons';
import { Input } from '@/app/components/atoms/inputs';
import { Select } from '@/app/components/atoms/inputs/SelectOptions';
import { supabase } from '@/lib/supabase/client';
import { toast } from 'react-hot-toast';

interface BrandFormProps {
  brand?: {
    id?: string;
    name?: string;
    manufacturer_id?: string;
    website?: string;
  };
  onSave: (brand: {
    id?: string;
    name: string;
    manufacturer_id: string;
    website?: string;
  }) => void;
  onCancel: () => void;
}

export function BrandForm({ brand, onSave, onCancel }: BrandFormProps) {
  const [formData, setFormData] = useState({
    id: brand?.id || undefined,
    name: brand?.name || '',
    manufacturer_id: brand?.manufacturer_id || '',
    website: brand?.website || '',
  });
  
  const [manufacturers, setManufacturers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchManufacturers();
  }, []);

  const fetchManufacturers = async () => {
    try {
      const { data, error } = await supabase
        .from('manufacturers')
        .select('id, name')
        .order('name');
        
      if (error) throw error;
      setManufacturers(data || []);
    } catch (error) {
      console.error('Error fetching manufacturers:', error);
      toast.error('Failed to load manufacturers');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!formData.name || !formData.manufacturer_id) {
        throw new Error('Please fill out all required fields');
      }

      await onSave(formData);
    } catch (error) {
      console.error('Error saving brand:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to save brand');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Brand Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        required
      />

      <Select
        label="Manufacturer"
        name="manufacturer_id"
        value={formData.manufacturer_id}
        onChange={handleChange}
        required
        options={manufacturers.map(m => ({
          value: m.id,
          label: m.name
        }))}
        placeholder="Select Manufacturer"
      />

      <Input
        label="Website"
        name="website"
        value={formData.website}
        onChange={handleChange}
        type="url"
        placeholder="https://example.com"
      />

      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : (brand ? 'Update Brand' : 'Create Brand')}
        </Button>
      </div>
    </form>
  );
}
