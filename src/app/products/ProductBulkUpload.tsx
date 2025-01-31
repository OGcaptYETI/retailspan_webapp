import React, { useState } from "react";
import productApi from "@/lib/supabase/productApi";
import * as XLSX from "xlsx";
import { Button } from "@/app/components/atoms/buttons";
import { Text, Label } from "@/app/components/atoms/typography";

export function ProductBulkUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    setErrors([]);
  };

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
      alert("Products uploaded successfully!");
    } catch (error) {
      console.error("Upload failed:", error);
      setErrors(["An error occurred during upload"]);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = async () => {
    try {
      const products = await productApi.getProducts();
      downloadAsExcel(products);
    } catch (error) {
      console.error("Download failed:", error);
      alert("An error occurred while exporting products.");
    }
  };

  const parseExcel = async (file: File): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(sheet);
          resolve(jsonData);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = (error) => reject(error);
      reader.readAsArrayBuffer(file);
    });
  };

  const validateData = (data: any[]): string[] => {
    const errors: string[] = [];
    data.forEach((row, index) => {
      if (!row.name) errors.push(`Row ${index + 1}: Missing 'name'`);
      if (!row.sku) errors.push(`Row ${index + 1}: Missing 'sku'`);
      if (!row.base_unit_price) errors.push(`Row ${index + 1}: Missing 'base_unit_price'`);
    });
    return errors;
  };

  const uploadProducts = async (data: any[]) => {
    for (const product of data) {
      await productApi.createProduct(product);
    }
  };

  const downloadAsExcel = (products: any[]) => {
    const worksheet = XLSX.utils.json_to_sheet(products);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Products");
    XLSX.writeFile(workbook, "products.xlsx");
  };

  return (
    <div className="space-y-6">
      <Text className="text-lg font-semibold">Bulk Upload and Export</Text>
  
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="file-upload">Upload Product Excel File</Label>
          <input
            id="file-upload"
            type="file"
            accept=".xlsx, .csv"
            onChange={handleFileChange}
            className="block w-full border rounded p-2"
            aria-describedby="file-upload-description"
            title="Upload Product Excel File"
          />
          <Text id="file-upload-description" className="text-sm text-muted-foreground">
            Accepted formats: .xlsx, .csv
          </Text>
        </div>

        <div className="flex space-x-4">
          <Button onClick={handleUpload} disabled={isUploading}>
            {isUploading ? "Uploading..." : "Upload"}
          </Button>
          <Button onClick={handleDownload} variant="secondary">
            Export Products
          </Button>
        </div>
      </div>
    </div>
  );
}
