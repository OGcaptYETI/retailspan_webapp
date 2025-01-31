'use client';

import React, { useEffect, useState } from 'react';
import { Table } from '@/app/components/molecules/Table'; // Import the universal table
import { Button } from '@/app/components/atoms/buttons';
import { Modal } from '@/app/components/ui/modal';
import { CategoryForm } from '@/app/products/forms/CategoryForm';
import { supabase } from '@/lib/supabase/client';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any | null>(null);

  // Fetch categories from Supabase
  useEffect(() => {
    async function fetchCategories() {
      const { data, error } = await supabase.from('product_categories').select('*');
      if (error) {
        console.error('Error fetching categories:', error);
      } else {
        setCategories(data || []);
      }
    }
    fetchCategories();
  }, []);

  // Handle adding a new category
  const handleAddCategory = () => {
    setEditingCategory(null); // Clear any editing state
    setIsModalOpen(true); // Open the modal
  };

  // Handle editing an existing category
  const handleEditClick = (category: any) => {
    setEditingCategory(category); // Set the selected category for editing
    setIsModalOpen(true); // Open the modal
  };

  // Handle saving a category (create or update)
  const handleSaveCategory = async (category: any) => {
    try {
      if (category.id) {
        // Update existing category
        const { error } = await supabase
          .from('product_categories')
          .update({
            name: category.name,
            description: category.description,
            parent_id: category.parent_id || null,
          })
          .eq('id', category.id);
        if (error) throw error;
      } else {
        // Create new category
        const { error } = await supabase
          .from('product_categories')
          .insert({
            name: category.name,
            description: category.description,
            parent_id: category.parent_id || null,
          });
        if (error) throw error;
      }

      // Refresh categories after save
      const { data } = await supabase.from('product_categories').select('*');
      setCategories(data || []);
    } catch (error) {
      console.error('Error saving category:', error);
    } finally {
      setIsModalOpen(false); // Close modal after saving
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50">
      <h1 className="text-2xl font-bold text-gray-800">Manage Categories</h1>

      {/* Add Category Button */}
      <div className="mb-4">
        <Button
          onClick={handleAddCategory}
          className="bg-blue-500 text-white hover:bg-blue-600"
        >
          Add Category
        </Button>
      </div>

      {/* Table */}
      <Table
        data={categories}
        columns={[
          { key: 'name', label: 'Name' },
          { key: 'description', label: 'Description' },
          { key: 'parent_id', label: 'Parent ID' },
        ]}
        onEditClick={handleEditClick} // Pass the edit handler
        searchPlaceholder="Search Categories..."
      />

      {/* Modal with the form */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <CategoryForm
          category={editingCategory} // Pass the selected category (or null for new)
          onSubmit={handleSaveCategory} // Save handler
          onCancel={() => setIsModalOpen(false)} // Close modal on cancel
        />
      </Modal>
    </div>
  );
}


