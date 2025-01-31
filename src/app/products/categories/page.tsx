// app/products/categories/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/app/components/atoms/buttons';
import { Modal } from '@/app/components/ui/modal';
import { CategoryForm } from '@/app/products/forms/CategoryForm';
import { Card } from '@/app/components/molecules/cards';
import { 
  Plus,
  Edit2,
  Trash2,
  ChevronDown,
  ChevronUp,
  FolderPlus 
} from 'lucide-react';
import { IconButton } from '@/app/components/atoms/buttons';
import { useToast } from '@/app/components/ui/use-toast';
import productApi from '@/lib/supabase/productApi';

// Define our TypeScript interfaces for better type safety
interface Category {
  id: string;
  name: string;
  description: string | null;
  parent_id: string | null;
  created_at: string;
  updated_at: string;
  subcategories?: Category[];
}

export default function CategoriesPage() {
  // Initialize the toast hook from our UI components
  const { toast } = useToast();
  
  // State management
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isAddingSubcategory, setIsAddingSubcategory] = useState(false);
  const [parentCategory, setParentCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Helper function to organize flat category list into hierarchy
  const organizeCategories = (flatCategories: Category[]): Category[] => {
    const categoryMap = new Map<string, Category>();
    const rootCategories: Category[] = [];

    // First pass: Create category objects with empty subcategories arrays
    flatCategories.forEach(category => {
      categoryMap.set(category.id, { ...category, subcategories: [] });
    });

    // Second pass: Build the hierarchy
    flatCategories.forEach(category => {
      const categoryWithSubs = categoryMap.get(category.id);
      if (categoryWithSubs) {
        if (category.parent_id) {
          const parent = categoryMap.get(category.parent_id);
          if (parent && parent.subcategories) {
            parent.subcategories.push(categoryWithSubs);
          }
        } else {
          rootCategories.push(categoryWithSubs);
        }
      }
    });

    return rootCategories;
  };

  // Fetch categories on mount and after updates
  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const data = await productApi.getProductCategories();
      const organizedCategories = organizeCategories(data || []);
      setCategories(organizedCategories);
    } catch (error) {
      toast({
        title: "Error fetching categories",
        description: error instanceof Error ? error.message : "Failed to load categories",
        className: "bg-destructive text-destructive-foreground",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Handle adding a new category or subcategory
  const handleAddCategory = (parent?: Category) => {
    setEditingCategory(null);
    setParentCategory(parent || null);
    setIsAddingSubcategory(!!parent);
    setIsModalOpen(true);
  };

  // Handle editing an existing category
  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setIsAddingSubcategory(false);
    setParentCategory(null);
    setIsModalOpen(true);
  };

  // Handle deleting a category with dependency checks
  const handleDeleteCategory = async (categoryId: string) => {
    try {
      const deps = await productApi.getCategoryDependencies(categoryId);
      
      if (deps.hasProducts || deps.hasSubcategories) {
        toast({
          title: "Cannot delete category",
          description: "This category has products or subcategories that must be reassigned first.",
          className: "bg-destructive text-destructive-foreground",
          duration: 5000,
        });
        return;
      }

      await productApi.deleteProductCategory(categoryId);
      await fetchCategories();
      
      toast({
        title: "Success",
        description: "Category has been deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete category",
        variant: "destructive",
      });
    }
  };

  // Handle saving a category (create or update)
  const handleSaveCategory = async (categoryData: Partial<Category>) => {
    try {
      setIsLoading(true);
      
      if (editingCategory?.id) {
        await productApi.updateProductCategory(editingCategory.id, categoryData);
        toast({
          title: "Success",
          description: "Category updated successfully",
        });
      } else {
        await productApi.createProductCategory({
          name: categoryData.name!,
          description: categoryData.description,
          parent_id: isAddingSubcategory ? parentCategory?.id : null,
        });
        toast({
          title: "Success",
          description: "Category created successfully",
        });
      }

      await fetchCategories();
      setIsModalOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save category",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Render a category card with its subcategories
  const renderCategoryCard = (category: Category) => (
    <Card key={category.id} className="mb-4 bg-gray-900 text-white">
      <div className="p-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold">{category.name}</h3>
            <p className="text-gray-400">{category.description}</p>
          </div>
          
          <div className="flex items-center gap-2">
            <IconButton
              icon={<FolderPlus className="h-4 w-4" />}
              label="Add Subcategory"
              variant="ghost"
              onClick={() => handleAddCategory(category)}
              disabled={isLoading}
            />
            
            <IconButton
              icon={<Edit2 className="h-4 w-4" />}
              label="Edit Category"
              variant="ghost"
              onClick={() => handleEditCategory(category)}
              disabled={isLoading}
            />
            
            <IconButton
              icon={<Trash2 className="h-4 w-4" />}
              label="Delete Category"
              variant="ghost"
              onClick={() => handleDeleteCategory(category.id)}
              disabled={isLoading}
            />
          </div>
        </div>
        
        {category.subcategories && category.subcategories.length > 0 && (
          <div className="mt-4 ml-6 border-l-2 border-gray-700 pl-4">
            {category.subcategories.map(renderCategoryCard)}
          </div>
        )}
      </div>
    </Card>
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-black">Product Categories</h1>
        <Button
          onClick={() => handleAddCategory()}
          variant="default"
          disabled={isLoading}
        >
          Add Top-Level Category
        </Button>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center text-gray-500">Loading categories...</div>
        ) : categories.length === 0 ? (
          <div className="text-center text-gray-500">No categories found</div>
        ) : (
          categories.map(renderCategoryCard)
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <CategoryForm
          category={editingCategory}
          isSubcategory={isAddingSubcategory}
          parentCategory={parentCategory}
          onSubmit={handleSaveCategory}
          onCancel={() => setIsModalOpen(false)}
          loading={isLoading}
        />
      </Modal>
    </div>
  );
}

