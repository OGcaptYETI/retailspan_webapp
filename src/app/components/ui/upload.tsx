import React, { useCallback } from 'react';
import { useDropzone, FileRejection, Accept as DropzoneAccept } from 'react-dropzone';
import { Upload, X } from 'lucide-react';


export type LocalAccept = {
  [key: string]: string[];
} & {
  'image/*'?: string[];
  'audio/*'?: string[];
  'video/*'?: string[];
  'text/*'?: string[];
  'application/*'?: string[];
};

const ACCEPTED_IMAGE_TYPES: { [key: string]: string[] } = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/webp': ['.webp'],
  'image/gif': ['.gif']
};

const DEFAULT_ACCEPT: LocalAccept = {
  'image/*': [],
  ...ACCEPTED_IMAGE_TYPES
};

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  maxSize?: number;
  accept?: LocalAccept;
  onError?: (error: string) => void;
}

export function ImageUpload({ 
  value, 
  onChange, 
  maxSize = 5242880, // 5MB default
  accept = DEFAULT_ACCEPT,
  onError 
}: ImageUploadProps) {

  const onDrop = useCallback((
    acceptedFiles: File[], 
    rejectedFiles: FileRejection[]
  ) => {
    if (rejectedFiles.length > 0) {
      const error = rejectedFiles[0].errors[0];
      onError?.(error.message);
      return;
    }

    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange(reader.result as string);
      };
      reader.onerror = () => {
        onError?.('Failed to read file');
      };
      reader.readAsDataURL(file);
    }
  }, [onChange, onError]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    multiple: false
  });

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
      >
        <input {...getInputProps()} />
        <Upload className="w-12 h-12 text-gray-400 mb-4" />
        <p className="text-sm text-gray-600">
          {isDragActive ? 'Drop image here' : 'Drag & drop an image, or click to select'}
        </p>
      </div>

      {value && (
        <div className="relative inline-block">
          <img src={value} alt="Preview" className="max-h-48 rounded-lg" />
          <button
            onClick={() => onChange('')}
            className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full text-white"
            title="Remove image"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}