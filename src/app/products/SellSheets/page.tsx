"use client";

import React, { useState, useEffect } from "react";
import { Table } from "@/app/components/molecules/Table";
import { Button } from "@/app/components/atoms/buttons";
import { Modal } from "@/app/components/ui/modal";
import { SellSheetForm } from "@/app/products/forms/SellSheetForm";
import productApi from "@/lib/supabase/productApi";

export default function SellSheetsPage() {
  const [sellSheets, setSellSheets] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    fetchSellSheets();
  }, []);

  const fetchSellSheets = async () => {
    try {
      const data = await productApi.getSellSheets();
      setSellSheets(data || []);
    } catch (error) {
      console.error("Error fetching sell sheets:", error);
    }
  };

  const handleAddSellSheet = () => {
    setIsModalOpen(true);
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return;

    try {
      const fileUrl = await productApi.uploadSellSheet(selectedFile);
      console.log("Uploaded Sell Sheet URL:", fileUrl);
      fetchSellSheets();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error uploading sell sheet:", error);
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gray-100">
      <h1 className="text-2xl font-bold text-gray-800">Manage Sell Sheets</h1>

      <div className="mb-4">
        <Button onClick={handleAddSellSheet} className="bg-blue-500 text-white hover:bg-blue-600">
          Add Sell Sheet
        </Button>
      </div>

      <Table
        data={sellSheets}
        columns={[
          { key: "file_name", label: "File Name" },
          { key: "file_type", label: "File Type" },
          { key: "category", label: "Category" },
          { key: "brand_family_name", label: "Brand Family" },
        ]}
        searchPlaceholder="Search Sell Sheets..."
      />

<Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
  <SellSheetForm
    onClose={() => setIsModalOpen(false)}
    onSuccess={fetchSellSheets}
    onFileSelect={(file) => setSelectedFile(file)} // ✅ Now this prop exists
    onFileUpload={handleFileUpload} // ✅ Now this prop exists
  />
</Modal>

    </div>
  );
}


