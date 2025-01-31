import { supabase } from "./client";

export const manufacturerApi = {
  async getManufacturers() {
    const { data, error } = await supabase.from("manufacturers").select("*");
    if (error) throw error;
    return data;
  },
  async upsertManufacturer(manufacturer: any) {
    const { error } = await supabase.from("manufacturers").upsert(manufacturer);
    if (error) throw error;
  },
};
