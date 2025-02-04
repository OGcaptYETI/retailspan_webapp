// components/ProgramSelector.tsx
import React from "react";
import { Select } from "@/app/components/atoms/inputs/select";

interface ProgramSelectorProps {
  manufacturer: string;
  selectedProgram: string;
  onProgramChange: (program: string) => void;
}

export const ProgramSelector: React.FC<ProgramSelectorProps> = ({ 
  manufacturer, 
  selectedProgram, 
  onProgramChange 
}) => {
  const programs = [
    { value: "", label: `Select ${manufacturer} program...` },
    { value: "premium", label: "Premium Partner" },
    { value: "standard", label: "Standard Partner" },
    { value: "basic", label: "Basic Partner" },
  ];

  return (
    <div className="space-y-2">
      <Select
        value={selectedProgram}
        onChange={(e) => onProgramChange(e.target.value)}
        options={programs}
      />
    </div>
  );
};