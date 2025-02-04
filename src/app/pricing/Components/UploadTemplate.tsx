// components/UploadTemplate.tsx
import React from "react";
import { Button } from "@/app/components/atoms/buttons/Button";
import { Upload } from "lucide-react";

interface UploadTemplateProps {
  onUpload: (file: File) => void;
  accept?: string;
}

export const UploadTemplate: React.FC<UploadTemplateProps> = ({
  onUpload,
  accept = ".xlsx,.xls,.csv"
}) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onUpload(file);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Button variant="outline" onClick={() => document.getElementById('fileInput')?.click()}>
          <Upload className="w-4 h-4 mr-2" />
          Upload Template
        </Button>
        <input
          id="fileInput"
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
          aria-label="Upload template file"
          title="Upload template file"
        />
      </div>
      <p className="text-sm text-muted-foreground">
        Upload your pricing template in Excel or CSV format
      </p>
    </div>
  );
};

export default UploadTemplate;