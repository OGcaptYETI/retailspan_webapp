import * as React from "react";

export interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export function Switch({ checked, onCheckedChange }: SwitchProps) {
  return (
    <button
      onClick={() => onCheckedChange(!checked)}
      className={`relative w-12 h-6 flex items-center rounded-full transition-colors duration-300 ${
        checked ? "bg-blue-600" : "bg-gray-400"
      }`}
    >
      <div
        className={`absolute w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

export default Switch;

