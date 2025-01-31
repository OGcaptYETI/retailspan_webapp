'use client';

import React, { useState } from "react";
import { Button } from "@/app/components/atoms/buttons";
import { Input } from "@/app/components/atoms/inputs";

export const UnitForm = ({ unit, onSubmit, onCancel }: { unit?: any; onSubmit: (data: any) => void; onCancel: () => void }) => {
    const [name, setName] = useState(unit?.name || "");
    const [description, setDescription] = useState(unit?.description || "");
    const [category, setCategory] = useState(unit?.category || "");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ id: unit?.id, name, description, category });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-6">
            <Input label="Unit Name" name="name" value={name} onChange={(e) => setName(e.target.value)} required />
            <Input label="Description" name="description" value={description} onChange={(e) => setDescription(e.target.value)} />
            <Input label="Category" name="category" value={category} onChange={(e) => setCategory(e.target.value)} />
            <div className="flex justify-end space-x-4">
                <Button variant="ghost" onClick={onCancel}>Cancel</Button>
                <Button type="submit">Save</Button>
            </div>
        </form>
    );
};
