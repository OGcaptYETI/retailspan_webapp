'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/app/components/atoms/buttons';
import { Input } from '@/app/components/atoms/inputs';

export interface CategoryFormProps {
  category?: any; // The category object being edited (optional)
  onSubmit: (category: { id?: string; name: string; description?: string; parent_id?: string | null }) => void;
  onCancel: () => void;
}

export const CategoryForm: React.FC<CategoryFormProps> = ({ category, onSubmit, onCancel }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [parentId, setParentId] = useState('');

  // Populate form fields when editingCategory is set
  useEffect(() => {
    if (category) {
      setName(category.name || '');
      setDescription(category.description || '');
      setParentId(category.parent_id || '');
    } else {
      setName('');
      setDescription('');
      setParentId('');
    }
  }, [category]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ id: category?.id, name, description, parent_id: parentId || null });
  };

  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold mb-4">{category ? 'Edit Category' : 'Create Category'}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Category Name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Input
          label="Description"
          name="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Input
          label="Parent Category ID (optional)"
          name="parent_id"
          value={parentId}
          onChange={(e) => setParentId(e.target.value)}
        />
        <div className="flex justify-end space-x-4">
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Save</Button>
        </div>
      </form>
    </div>
  );
};

