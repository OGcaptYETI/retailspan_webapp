// /app/products/brands/BrandFamilyModal.tsx
"use client";

import React from "react";
import { Modal } from "@/app/components/ui/modal";
import { BrandFamilyForm } from "@/app/products/forms/BrandFamilyForm";

interface BrandFamilyModalProps {
  isOpen: boolean;
  onClose: () => void;
  manufacturers?: Array<{ id: string; name: string }>;
  brands?: Array<{ id: string; name: string; manufacturer: string }>;
  onSave: (data: { manufacturerId: string; brandId: string }) => Promise<void>;
}

export function BrandFamilyModal({
  isOpen,
  onClose,
  manufacturers = [],
  brands = [],
  onSave
}: BrandFamilyModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <BrandFamilyForm
        manufacturers={manufacturers}
        brands={brands}
        onSave={onSave}
        onCancel={onClose}
      />
    </Modal>
  );
}