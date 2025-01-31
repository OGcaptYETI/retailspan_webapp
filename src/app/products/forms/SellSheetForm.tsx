'use client';

import React, { useState, useEffect } from "react";
import { Input } from "@/app/components/atoms/inputs";
import { Button } from "@/app/components/atoms/buttons";
import { supabase } from "@/lib/supabase/client";

interface SellSheetFormProps {
  onClose: () => void;
  onSuccess: () => void;
  onFileSelect?: (file: File) => void;
  onFileUpload?: () => void;
}

export const SellSheetForm: React.FC<SellSheetFormProps> = ({
  onClose,
  onSuccess,
  onFileSelect,
  onFileUpload,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [brandFamilies, setBrandFamilies] = useState<any[]>([]);
  const [brandFamilyId, setBrandFamilyId] = useState<string>("");
  const [category, setCategory] = useState<string>("");

  useEffect(() => {
    fetchBrandFamilies();
  }, []);

  const fetchBrandFamilies = async () => {
    const { data, error } = await supabase.from("brand_families").select("*");
    if (error) console.error("Error fetching brand families:", error);
    else setBrandFamilies(data || []);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    setFile(selectedFile);
    if (selectedFile && onFileSelect) {
      onFileSelect(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file || !brandFamilyId || !category) {
      alert("Please fill in all fields.");
      return;
    }

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("sell_sheets")
      .upload(`files/${file.name}`, file);

    if (uploadError) {
      console.error("File upload failed:", uploadError);
      return;
    }

    if (onFileUpload) onFileUpload();

    onSuccess();
    onClose();
  };

  return (
    <form className="space-y-4">
      <Input type="file" onChange={handleFileChange} />

      <label htmlFor="brand_family" className="block text-sm font-medium text-gray-700">
        Brand Family
      </label>
      <select
        id="brand_family"
        name="brand_family"
        value={brandFamilyId || ""} // ✅ Fixes null value issue
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
          setBrandFamilyId(e.target.value)
        }
        className="border p-2 rounded w-full"
      >
        <option value="">Select Brand Family</option>
        {brandFamilies.map((family) => (
          <option key={family.id} value={family.id}>
            {family.name}
          </option>
        ))}
      </select>

      <label htmlFor="category" className="block text-sm font-medium text-gray-700">
        Category
      </label>
      <select
        id="category"
        name="category"
        value={category || ""} // ✅ Fixes null value issue
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
          setCategory(e.target.value)
        }
        className="border p-2 rounded w-full"
      >
        <option value="">Select Category</option>
        <option value="Retail">Retail</option>
        <option value="Wholesale">Wholesale</option>
        <option value="Internal">Internal</option>
        <option value="External">External</option>
        <option value="Price Sheet">Price Sheet</option>
        <option value="Other">Other</option>
      </select>

      <Button onClick={handleUpload} className="bg-green-500 text-white hover:bg-green-600">
        Upload
      </Button>
    </form>
  );
};

