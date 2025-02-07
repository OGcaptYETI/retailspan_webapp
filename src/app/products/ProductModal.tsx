"use client";

import React from "react";
import { Modal } from "@/app/components/ui/modal";
import { ProductForm } from "@/app/products/forms/ProductForm";
import type { Product } from "@/types/supabase";
import { toast } from "react-hot-toast";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
  onSave: (productData: Product) => Promise<void>;
}

export function ProductModal({ isOpen, onClose, product, onSave }: ProductModalProps) {
  const handleSubmit = async (productData: Product) => {
    try {
      await onSave(productData);
      toast.success(product ? "Product updated successfully" : "Product created successfully");
      onClose();
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error("Failed to save product");
      throw error;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ProductForm product={product || undefined} isOpen={isOpen} onClose={onClose} onSubmit={handleSubmit} />
    </Modal>
  );
}


