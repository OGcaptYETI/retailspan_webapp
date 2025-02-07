import React from "react";
import { cn } from "@/lib/utils/cn";
import { Check } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  options: SelectOption[];
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  placeholder?: string;
}

export const Select: React.FC<SelectProps> = ({
  options = [],
  value,
  onChange,
  className,
  disabled,
  required,
  placeholder
}) => {
  return (
    <select
      value={value}
      onChange={onChange}
      className={cn(
        "w-full rounded-md border border-input bg-background px-3 py-2",
        "text-sm ring-offset-background",
        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        disabled && "cursor-not-allowed opacity-50",
        className
      )}
      disabled={disabled}
      required={required}
    >
      {placeholder && (
        <option value="">{placeholder}</option>
      )}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};