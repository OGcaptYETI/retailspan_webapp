"use client";

import React, { useState, useEffect } from "react";
import { Table } from "@/app/components/molecules/Table";
import { Button } from "@/app/components/atoms/buttons";
import { Modal } from "@/app/components/ui/modal";
import { ManufacturerForm } from "@/app/products/forms/ManufacturerForm";
import productApi from "@/lib/supabase/productApi";

export default function ManufacturersPage() {
  const [manufacturers, setManufacturers] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingManufacturer, setEditingManufacturer] = useState<any | null>(null);

  useEffect(() => {
    fetchManufacturers();
  }, []);

  const fetchManufacturers = async () => {
    try {
      const data = await productApi.getManufacturers();
      setManufacturers(data || []);
    } catch (error) {
      console.error("Error fetching manufacturers:", error);
    }
  };

  const handleAddManufacturer = () => {
    setEditingManufacturer(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (manufacturer: any) => {
    setEditingManufacturer(manufacturer);
    setIsModalOpen(true);
  };

  const handleDeleteManufacturer = async (manufacturerId: string) => {
    try {
      await productApi.deleteManufacturer(manufacturerId);
      fetchManufacturers();
    } catch (error) {
      console.error("Error deleting manufacturer:", error);
    }
  };

  const handleSaveManufacturer = async (manufacturer: any) => {
    try {
      if (editingManufacturer) {
        await productApi.updateManufacturer(editingManufacturer.id, manufacturer);
      } else {
        await productApi.createManufacturer(manufacturer);
      }
      fetchManufacturers();
    } catch (error) {
      console.error("Error saving manufacturer:", error);
    } finally {
      setIsModalOpen(false);
    }
  };

  return (
    <div className="p-6 space-y-6 bg-background text-foreground">
      <h1 className="text-2xl font-bold">Manage Manufacturers</h1>

      <div className="mb-4">
        <Button variant="default" onClick={handleAddManufacturer}>
          Add Manufacturer
        </Button>
      </div>

      <Table
        data={manufacturers}
        columns={[
          { key: "name", label: "Name" },
          { key: "website", label: "Website" },
        ]}
        onEditClick={handleEditClick}
        onDeleteClick={handleDeleteManufacturer}
        searchPlaceholder="Search Manufacturers..."
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ManufacturerForm
          manufacturer={editingManufacturer}
          onSave={handleSaveManufacturer}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
}

