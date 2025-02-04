"use client";

import React, { useState, useEffect } from "react";
import { Table } from "@/app/components/molecules/Table";
import { unitApi } from "@/lib/supabase/UnitApi";
import { Button } from "@/app/components/atoms/buttons";
import { Modal } from "@/app/components/ui/modal";
import { UnitForm } from "@/app/products/forms/UnitsForm";

export default function UnitsPage() {
  const [editingUnit, setEditingUnit] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [units, setUnits] = useState<any[]>([]);

  // Fetch units on mount
  useEffect(() => {
    async function fetchUnits() {
      const data = await unitApi.getUnits();
      setUnits(data || []);
    }
    fetchUnits();
  }, []);

  // Add a new unit
  const handleAddUnit = () => {
    setEditingUnit(null);
    setIsModalOpen(true);
  };

  // Edit existing unit
  const handleEditClick = (unit: any) => {
    setEditingUnit(unit);
    setIsModalOpen(true);
  };

  // Save (create/update) unit
  const handleSaveUnit = async (unit: any) => {
    try {
      if (unit.id) {
        await unitApi.updateUnit(unit.id, unit);
      } else {
        await unitApi.createUnit(unit);
      }

      const updatedUnits = await unitApi.getUnits();
      setUnits(updatedUnits);
    } catch (error) {
      console.error("Error saving unit:", error);
    } finally {
      setIsModalOpen(false);
    }
  };

  return (
    <div className="p-6 space-y-6 bg-background text-foreground">
      <h1 className="text-2xl font-bold">Units of Measure</h1>

      <div className="mb-4">
        <Button variant="default" onClick={handleAddUnit}>
          Add Unit
        </Button>
      </div>

      <Table
        data={units}
        columns={[
          { key: "name", label: "Name" },
          { key: "description", label: "Description" },
          { key: "category", label: "Category" },
        ]}
        onEditClick={handleEditClick}
        searchPlaceholder="Search Units..."
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <UnitForm
          unit={editingUnit}
          onSubmit={handleSaveUnit}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
