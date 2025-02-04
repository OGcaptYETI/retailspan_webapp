"use client";

import React, { useState } from "react";
import productApi from "@/lib/supabase/productApi";
import ExcelJS from "exceljs";
import toast from "react-hot-toast";

interface Product {
  name: string;
  sku: string;
  base_unit_price: number;
  upc?: string;
  description?: string;
  brand_name?: string;
  category_name?: string;
}
import { Button } from "@/app/components/atoms/buttons";
import { Text, Label } from "@/app/components/atoms/typography";

export function ProductBulkUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  /** ✅ Handle File Selection */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    setErrors([]);
  };

  /** ✅ Handle Upload */
  const handleUpload = async () => {
    if (!file) {
      setErrors(["No file selected"]);
      return;
    }

    setIsUploading(true);
    try {
      const data = await parseExcel(file);
      const validationErrors = validateData(data);

      if (validationErrors.length > 0) {
        setErrors(validationErrors);
        setIsUploading(false);
        return;
      }

      await uploadProducts(data);
      alert("✅ Products uploaded successfully!");
    } catch (error) {
      console.error("Upload failed:", error);
      setErrors(["❌ An error occurred during upload"]);
    } finally {
      setIsUploading(false);
    }
  };

  /** ✅ Handle Export */
const handleDownload = async () => {
  setIsExporting(true);
  try {
    const apiProducts = await productApi.getProducts();
    
    if (!apiProducts?.length || !Array.isArray(apiProducts)) {
      toast.error('No products found to export');
      return;
    }

    const products: Product[] = (apiProducts as any[])
      .filter(p => p.name && p.sku && p.base_unit_price)
      .map(p => ({
        name: p.name,
        sku: p.sku,
        base_unit_price: p.base_unit_price,
        upc: p.upc || '',
        description: p.description || '',
        brand_name: p.brand_name || '',
        category_name: p.category_name || ''
      }));

    if (!products.length) {
      toast.error('No valid products found to export');
      return;
    }

    await downloadAsExcel(products);
    toast.success(`Successfully exported ${products.length} products`);
  } catch (error) {
    console.error('Export error:', error);
    toast.error(error instanceof Error ? error.message : 'Failed to export products');
  } finally {
    setIsExporting(false);
  }
};
  /** ✅ Parse Excel File using ExcelJS */
  const parseExcel = async (file: File): Promise<Product[]> => {
    return new Promise(async (resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const buffer = e.target?.result as ArrayBuffer;
          const workbook = new ExcelJS.Workbook();
          await workbook.xlsx.load(buffer);

          const worksheet = workbook.worksheets[0];
          const jsonData: Product[] = [];

          worksheet.eachRow((row, rowNumber) => {
            if (rowNumber === 1) return; // Skip header row
            const [name, sku, price] = row.values as string[];
            jsonData.push({ name, sku, base_unit_price: parseFloat(price) });
          });

          resolve(jsonData);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = (error) => reject(error);
      reader.readAsArrayBuffer(file);
    });
  };

  /** ✅ Validate Data */
  const validateData = (data: Product[]): string[] => {
    const errors: string[] = [];
    data.forEach((row, index) => {
      if (!row.name) errors.push(`Row ${index + 1}: Missing 'name'`);
      if (!row.sku) errors.push(`Row ${index + 1}: Missing 'sku'`);
      if (!row.base_unit_price) errors.push(`Row ${index + 1}: Missing 'base_unit_price'`);
    });
    return errors;
  };

  /** ✅ Upload Products in Bulk */
  const uploadProducts = async (data: Product[]) => {
    try {
      await Promise.all(data.map((product) => productApi.createProduct(product)));
    } catch (error) {
      console.error("Error uploading products:", error);
      throw error;
    }
  };

  /** ✅ Export Products as Excel File */
  const downloadAsExcel = async (products: Product[]) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Products");

    // ✅ Add headers
    worksheet.addRow(["Name", "SKU", "Base Unit Price"]);

    // ✅ Add data
    products.forEach((product) => {
      worksheet.addRow([product.name, product.sku, product.base_unit_price]);
    });

    // ✅ Save file
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "products.xlsx";
    link.click();
  };

  return (
    <div className="space-y-6">
      <Text className="text-lg font-semibold">📥 Bulk Upload and Export</Text>

      <div className="space-y-4">
        {/* 🔹 File Input */}
        <div className="space-y-2">
          <Label htmlFor="file-upload">Upload Product Excel File</Label>
          <input
            id="file-upload"
            type="file"
            accept=".xlsx"
            onChange={handleFileChange}
            className="block w-full border rounded p-2"
            title="Upload Excel file containing product data"
            placeholder="Select an Excel file"
          />
          <Text className="text-sm text-muted-foreground">Accepted format: .xlsx</Text>
        </div>

        {/* 🔹 Error Display */}
        {errors.length > 0 && (
          <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            <ul>
              {errors.map((error, index) => (
                <li key={index}>❌ {error}</li>
              ))}
            </ul>
          </div>
        )}

        {/* 🔹 Action Buttons */}
        <div className="flex space-x-4">
          <Button onClick={handleUpload} disabled={isUploading}>
            {isUploading ? "Uploading..." : "📤 Upload"}
          </Button>
          <Button onClick={handleDownload} variant="secondary" disabled={isExporting}>
            {isExporting ? "Exporting..." : "📥 Export Products"}
          </Button>
        </div>
      </div>
    </div>
  );
}

