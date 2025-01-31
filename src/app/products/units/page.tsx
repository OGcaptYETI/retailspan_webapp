'use client';

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

  // Fetch units from Supabase
  useEffect(() => {
    async function fetchUnits() {
      const data = await unitApi.getUnits();
      setUnits(data || []);
    }
    fetchUnits();
  }, []);

  // Handle adding a new unit
  const handleAddUnit = () => {
    setEditingUnit(null); // Clear any existing unit data
    setIsModalOpen(true); // Open modal for adding a new unit
  };

  // Handle editing an existing unit
  const handleEditClick = (unit: any) => {
    setEditingUnit(unit); // Set the selected unit for editing
    setIsModalOpen(true); // Open modal for editing
  };

  // Handle saving a unit (create or update)
  const handleSaveUnit = async (unit: any) => {
    try {
      if (unit.id) {
        // Update existing unit
        await unitApi.updateUnit(unit.id, unit);
      } else {
        // Create a new unit
        await unitApi.createUnit(unit);
      }

      // Refresh the table
      const updatedUnits = await unitApi.getUnits();
      setUnits(updatedUnits);
    } catch (error) {
      console.error("Error saving unit:", error);
    } finally {
      setIsModalOpen(false); // Close modal
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gray-100">
      <h1 className="text-2xl font-bold text-gray-800">Units of Measure</h1>

      {/* Add Unit Button */}
      <div className="mb-4">
        <Button
          onClick={handleAddUnit}
          className="bg-blue-500 text-white hover:bg-blue-600"
        >
          Add Unit
        </Button>
      </div>

      {/* Table */}
      <Table
        data={units}
        columns={[
          { key: "name", label: "Name" },
          { key: "description", label: "Description" },
          { key: "category", label: "Category" },
        ]}
        onEditClick={handleEditClick} // Pass the edit handler
        searchPlaceholder="Search Units..."
      />

      {/* Modal for Unit Form */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <UnitForm
          unit={editingUnit} // Pass the selected unit (null if adding a new one)
          onSubmit={handleSaveUnit} // Save handler
          onCancel={() => setIsModalOpen(false)} // Close modal on cancel
        />
      </Modal>
    </div>
  );
}
