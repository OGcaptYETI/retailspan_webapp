import React, { useState } from 'react';
import { Upload, AlertCircle, FileSpreadsheet, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/molecules/cards';
import { Alert, AlertDescription } from '@/app/components/ui/alert';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

interface TemplateField {
  key: string;
  name: string;
  required: boolean;
  type: 'string' | 'number' | 'date' | 'boolean';
  validation?: ((value: string | number | boolean | Date) => boolean) | undefined;
}

interface TemplateConfig {
  fields: TemplateField[];
}


// Define template structures for different data types
const TEMPLATE_CONFIGS: Record<string, TemplateConfig> = {
  manufacturer_pricing: {
    fields: [
      { key: 'manufacturer_id', name: 'Manufacturer ID', required: true, type: 'string', validation: undefined },
      { key: 'product_id', name: 'Product ID', required: true, type: 'number', validation: undefined },
      { key: 'base_wholesale_cost', name: 'Base Wholesale Cost', required: true, type: 'number', validation: undefined },
      { key: 'msrp', name: 'MSRP', required: true, type: 'number', validation: undefined },
      { key: 'effective_date', name: 'Effective Date', required: true, type: 'date', validation: undefined },
      { key: 'end_date', name: 'End Date', required: false, type: 'date', validation: undefined }
    ]
  },
  state_pricing: {
    fields: [
      { key: 'state_code', name: 'State Code', required: true, type: 'string', validation: undefined },
      { key: 'product_id', name: 'Product ID', required: true, type: 'number', validation: undefined },
      { key: 'minimum_price', name: 'Minimum Price', required: false, type: 'number', validation: undefined },
      { key: 'maximum_price', name: 'Maximum Price', required: false, type: 'number', validation: undefined },
      { key: 'state_fee', name: 'State Fee', required: true, type: 'number', validation: undefined },
      { key: 'tax_rate', name: 'Tax Rate', required: true, type: 'number', validation: undefined }
    ]
  },
  promotions: {
    fields: [
      { key: 'name', name: 'Promotion Name', required: true, type: 'string', validation: undefined },
      { key: 'manufacturer_id', name: 'Manufacturer ID', required: true, type: 'string', validation: undefined },
      { key: 'type', name: 'Type', required: true, type: 'string', validation: undefined },
      { key: 'value', name: 'Value', required: true, type: 'number', validation: undefined },
      { key: 'calculation_type', name: 'Calculation Type', required: true, type: 'string', validation: undefined },
      { key: 'start_date', name: 'Start Date', required: true, type: 'date', validation: undefined },
      { key: 'end_date', name: 'End Date', required: true, type: 'date', validation: undefined },
      { key: 'min_quantity', name: 'Minimum Quantity', required: false, type: 'number', validation: undefined },
      { key: 'max_quantity', name: 'Maximum Quantity', required: false, type: 'number', validation: undefined },
      { key: 'requires_contract', name: 'Requires Contract', required: true, type: 'boolean', validation: undefined },
      { key: 'stackable', name: 'Stackable', required: true, type: 'boolean', validation: undefined }
    ]
  }
};

interface DataUploaderProps {
  templateType: keyof typeof TEMPLATE_CONFIGS;
  onUploadComplete: (data: { [key: string]: string | number | boolean | null }[]) => void;
}

export const DataUploader: React.FC<DataUploaderProps> = ({ templateType, onUploadComplete }) => {
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'validating' | 'success' | 'error'>('idle');
  
  const validateData = (data: { [key: string]: string | number | boolean | null }[]): string[] => {
    const errors: string[] = [];
    const fields = TEMPLATE_CONFIGS[templateType].fields;
    
    data.forEach((row, index) => {
      fields.forEach(field => {
        const value = row[field.key];
        
        // Check required fields
        if (field.required && (value === undefined || value === null || value === '')) {
          errors.push(`Row ${index + 1}: Missing required field "${field.name}"`);
          return;
        }

        // Type validation
        if (value !== undefined && value !== null && value !== '') {
          switch (field.type) {
            case 'number':
              if (isNaN(Number(value))) {
                errors.push(`Row ${index + 1}: "${field.name}" must be a number`);
              }
              break;
            case 'date':
              if (isNaN(Date.parse(String(value)))) {
                errors.push(`Row ${index + 1}: "${field.name}" must be a valid date`);
              }
              break;
            case 'boolean':
              if (typeof value !== 'boolean' && !['true', 'false', '0', '1'].includes(String(value).toLowerCase())) {
                errors.push(`Row ${index + 1}: "${field.name}" must be true/false`);
              }
              break;
          }
        }

        // Custom validation if defined
        if (field.validation && value !== undefined && value !== null && value !== '') {
          if (!field.validation(value)) {
            errors.push(`Row ${index + 1}: "${field.name}" failed validation`);
          }
        }
      });
    });

    return errors;
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadStatus('validating');
    setValidationErrors([]);

    try {
      let parsedData: { [key: string]: string | number | boolean | null }[] = [];
      
      if (file.name.endsWith('.csv')) {
        // Handle CSV
        const text = await file.text();
        parsedData = await new Promise((resolve, reject) => {
          Papa.parse<{ [key: string]: string | number | boolean | null }>(text, {
            header: true,
            dynamicTyping: true,
            skipEmptyLines: true,
            complete: (results) => resolve(results.data),
            error: (error: Error) => reject(error)
          });
        });
      } else if (file.name.match(/\.xlsx?$/)) {
        // Handle Excel
        const buffer = await file.arrayBuffer();
        const workbook = XLSX.read(buffer);
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        parsedData = XLSX.utils.sheet_to_json(firstSheet);
      } else {
        throw new Error('Unsupported file type');
      }

      const errors = validateData(parsedData);
      
      if (errors.length > 0) {
        setValidationErrors(errors);
        setUploadStatus('error');
      } else {
        onUploadComplete(parsedData);
        setUploadStatus('success');
      }
    } catch (error) {
      setValidationErrors(['Error processing file: ' + (error instanceof Error ? error.message : 'Unknown error')]);
      setUploadStatus('error');
    }
  };

  const downloadTemplate = () => {
    const fields = TEMPLATE_CONFIGS[templateType].fields;
    const headers = fields.map(f => f.name);
    const ws = XLSX.utils.aoa_to_sheet([headers]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Template');
    XLSX.writeFile(wb, `${templateType}_template.xlsx`);
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Upload {templateType.replace('_', ' ')} Data
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <button
              onClick={downloadTemplate}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
            >
              <FileSpreadsheet className="h-4 w-4" />
              Download Template
            </button>
            <input
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileUpload}
              title="Upload file"
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
          </div>

          {uploadStatus === 'validating' && (
            <div className="text-center py-4">
              Validating data...
            </div>
          )}

          {uploadStatus === 'success' && (
            <Alert className="bg-green-50 border-green-200">
              <Check className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Data validated and processed successfully
              </AlertDescription>
            </Alert>
          )}

          {validationErrors.length > 0 && (
            <Alert className="bg-red-50 border-red-200">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                <div className="font-medium mb-2">Found {validationErrors.length} errors:</div>
                <ul className="list-disc pl-4 space-y-1">
                  {validationErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DataUploader;