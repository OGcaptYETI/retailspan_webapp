"use client";

import React, { useState } from "react";
import { Button } from "@/app/components/atoms/buttons";

export const ManufacturerForm = ({ manufacturer, onSave }: any) => {
  const [formData, setFormData] = useState({
    name: manufacturer?.name || "",
    website: manufacturer?.website || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSave(formData);
  };

  return (
    <form className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium">
          Manufacturer Name
        </label>
        <input
          type="text"
          name="name"
          id="name"
          placeholder="e.g., ACME Corp"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <label htmlFor="website" className="block text-sm font-medium">
          Website
        </label>
        <input
          type="text"
          name="website"
          id="website"
          placeholder="https://example.com"
          value={formData.website}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </div>
      <Button onClick={handleSubmit}>Save Manufacturer</Button>
    </form>
  );
};
