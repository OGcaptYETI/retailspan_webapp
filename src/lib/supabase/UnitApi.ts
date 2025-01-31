import { supabase } from "@/lib/supabase/client";

export const unitApi = {
    async getUnits() {
        const { data, error } = await supabase.from("units").select("*");
        if (error) throw error;
        return data;
    },

    async createUnit(unit: { name: string; description?: string; category?: string }) {
        const { data, error } = await supabase.from("units").insert(unit).select();
        if (error) throw error;
        return data;
    },

    async updateUnit(id: string, updates: Partial<{ name: string; description?: string; category?: string }>) {
        const { data, error } = await supabase.from("units").update(updates).eq("id", id).select();
        if (error) throw error;
        return data;
    },

    async deleteUnit(id: string) {
        const { data, error } = await supabase.from("units").delete().eq("id", id).select();
        if (error) throw error;
        return data;
    }
};
