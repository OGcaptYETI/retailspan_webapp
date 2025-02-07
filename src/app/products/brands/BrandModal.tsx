// /app/products/brands/BrandModal.tsx
"use client";

import { Modal } from "@/app/components/ui/modal";
import { BrandForm } from "../forms/BrandForm";

interface BrandModalProps {
  isOpen: boolean;
  onClose: () => void;
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
}

export function BrandModal({ isOpen, onClose, brand, onSave }: BrandModalProps) {
  // The Modal component handles the portal and backdrop
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <div className="p-6">
        <BrandForm 
          brand={brand} 
          onSave={(brandData) => {
            onSave(brandData);
            onClose();
          }}
          onCancel={onClose}
        />
      </div>
    </Modal>
  );
}