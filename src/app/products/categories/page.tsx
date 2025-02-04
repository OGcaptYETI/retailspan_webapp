"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/app/components/atoms/buttons";
import { Modal } from "@/app/components/ui/modal";
import { CategoryForm } from "@/app/products/forms/CategoryForm";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/app/components/molecules/cards";
import {
  Plus,
  Edit2,
  Trash2,
  FolderPlus,
} from "lucide-react";
import { IconButton } from "@/app/components/atoms/buttons";
import { useToast } from "@/app/components/ui/use-toast";
import productApi from "@/lib/supabase/productApi";

// TypeScript interface for Category
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
  const { toast } = useToast();

  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isAddingSubcategory, setIsAddingSubcategory] = useState(false);
  const [parentCategory, setParentCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Organize flat list of categories into a hierarchy
  const organizeCategories = (flatCategories: Category[]): Category[] => {
    const categoryMap = new Map<string, Category>();
    const rootCategories: Category[] = [];

    // Create map
    flatCategories.forEach((cat) => {
      categoryMap.set(cat.id, { ...cat, subcategories: [] });
    });

    // Build hierarchy
    flatCategories.forEach((cat) => {
      const catWithSubs = categoryMap.get(cat.id);
      if (catWithSubs) {
        if (cat.parent_id) {
          const parent = categoryMap.get(cat.parent_id);
          if (parent && parent.subcategories) {
            parent.subcategories.push(catWithSubs);
          }
        } else {
          rootCategories.push(catWithSubs);
        }
      }
    });

    return rootCategories;
  };

  // Fetch categories from supabase
  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const data = await productApi.getProductCategories();
      const organized = organizeCategories(data || []);
      setCategories(organized);
    } catch (error) {
      toast({
        title: "Error fetching categories",
        description:
          error instanceof Error ? error.message : "Failed to load categories",
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

  // Add new category or subcategory
  const handleAddCategory = (parent?: Category) => {
    setEditingCategory(null);
    setParentCategory(parent || null);
    setIsAddingSubcategory(!!parent);
    setIsModalOpen(true);
  };

  // Edit an existing category
  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setIsAddingSubcategory(false);
    setParentCategory(null);
    setIsModalOpen(true);
  };

  // Delete a category after checking dependencies
  const handleDeleteCategory = async (categoryId: string) => {
    try {
      const deps = await productApi.getCategoryDependencies(categoryId);

      if (deps.hasProducts || deps.hasSubcategories) {
        toast({
          title: "Cannot delete category",
          description:
            "This category has products or subcategories that must be reassigned first.",
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
        description:
          error instanceof Error ? error.message : "Failed to delete category",
        variant: "destructive",
      });
    }
  };

  // Create or update a category
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
        description:
          error instanceof Error ? error.message : "Failed to save category",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Recursively render category cards
  const renderCategoryCard = (category: Category) => (
    <Card key={category.id} className="mb-4">
      <div className="p-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold text-foreground">{category.name}</h3>
            {category.description && (
              <p className="text-sm text-muted-foreground">
                {category.description}
              </p>
            )}
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
          <div className="mt-4 ml-6 border-l border-border pl-4">
            {category.subcategories.map(renderCategoryCard)}
          </div>
        )}
      </div>
    </Card>
  );

  return (
    <div className="p-6 space-y-6 bg-background text-foreground">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Product Categories</h1>
        <Button onClick={() => handleAddCategory()} variant="default" disabled={isLoading}>
          Add Top-Level Category
        </Button>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center text-muted-foreground">Loading categories...</div>
        ) : categories.length === 0 ? (
          <div className="text-center text-muted-foreground">No categories found</div>
        ) : (
          categories.map(renderCategoryCard)
        )}
      </div>

      {/* Modal for add/edit category */}
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
