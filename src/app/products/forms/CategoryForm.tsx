// app/products/forms/CategoryForm.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/app/components/atoms/buttons';
import { Input } from '@/app/components/atoms/inputs';
import { supabase } from '@/lib/supabase/client';
import { 
  Plus,
  Edit2,
  Trash2,
  ChevronDown,
  ChevronUp,
  FolderPlus 
} from 'lucide-react';

// Define the shape of our Category data structure
interface Category {
  id: string;
  name: string;
  description: string | null;
  parent_id: string | null;
  created_at: string;
  updated_at: string;
}

// Define the props our form component will accept
interface CategoryFormProps {
  // The category being edited (if any)
  category?: Category | null;
  // Flag to indicate if we're creating a subcategory
  isSubcategory?: boolean;
  // The parent category when creating a subcategory
  parentCategory?: Category | null;
  // Callback functions for form submission and cancellation
  onSubmit: (category: Partial<Category>) => void;
  onCancel: () => void;
  loading?: boolean;
}

export const CategoryForm: React.FC<CategoryFormProps> = ({
  category,
  isSubcategory = false,
  parentCategory = null,
  onSubmit,
  onCancel,
}) => {
  // Form state management
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [parentId, setParentId] = useState<string | null>(null);
  const [availableCategories, setAvailableCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Initialize or reset form state when props change
  useEffect(() => {
    if (category) {
      // Editing existing category
      setName(category.name || '');
      setDescription(category.description || '');
      setParentId(category.parent_id);
    } else if (isSubcategory && parentCategory) {
      // Creating new subcategory
      setName('');
      setDescription('');
      setParentId(parentCategory.id);
    } else {
      // Creating new top-level category
      setName('');
      setDescription('');
      setParentId(null);
    }
  }, [category, isSubcategory, parentCategory]);

  // Fetch available parent categories for top-level category creation
  useEffect(() => {
    async function fetchCategories() {
      // Only fetch categories if we're not creating a subcategory
      if (isSubcategory) return;

      const { data, error } = await supabase
        .from('product_categories')
        .select('*')
        .is('parent_id', null) // Only fetch top-level categories
        .order('name');

      if (error) {
        console.error('Error fetching categories:', error);
        setError('Failed to load categories');
      } else {
        setAvailableCategories(data || []);
      }
    }

    fetchCategories();
  }, [isSubcategory]);

  // Validate form input before submission
  const validateForm = (): boolean => {
    if (!name.trim()) {
      setError('Category name is required');
      return false;
    }
    return true;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
  
    if (!validateForm()) return;

    // Prepare category data for submission
    const categoryData: Partial<Category> = {
      name: name.trim(),
      description: description.trim() || null,
      // If we're creating a subcategory, use the parentCategory's id
      parent_id: isSubcategory && parentCategory ? parentCategory.id : parentId
    };

    try {
      onSubmit(categoryData);
    } catch (err) {
      setError('Failed to save category');
      console.error('Error saving category:', err);
    }
  };

  // Determine the form title based on the current action
  const getFormTitle = () => {
    if (category) return 'Edit Category';
    if (isSubcategory) return `Add Subcategory ${parentCategory ? `to ${parentCategory.name}` : ''}`;
    return 'Add Category';
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">
          {getFormTitle()}
        </h2>
        <p className="text-muted-foreground">
          {isSubcategory 
            ? 'Create a new subcategory to better organize your products'
            : 'Enter the details for your category'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Input
            label="Category Name"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter category name"
            required
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Input
            label="Description"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter category description (optional)"
            className="w-full"
          />
        </div>

        {/* Only show parent category selection for top-level categories */}
        {!isSubcategory && (
          <div className="space-y-2">
            <label 
              htmlFor="parent-category" 
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Parent Category (Optional)
            </label>
            <select
              id="parent-category"
              value={parentId || ''}
              onChange={(e) => setParentId(e.target.value || null)}
              className="w-full px-3 py-2 border rounded-md border-input bg-background text-sm"
            >
              <option value="">No Parent (Top-Level Category)</option>
              {availableCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Error message display */}
        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}

        {/* Form action buttons */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            onClick={onCancel}
            variant="outline"
          >
            Cancel
          </Button>
          <Button type="submit">
            {category ? 'Update' : 'Create'} {isSubcategory ? 'Subcategory' : 'Category'}
          </Button>
        </div>
      </form>
    </div>
  );
};

