import { supabase } from "@/lib/supabase/client";

const pricingApi = {
  // ✅ Fetch all contracts
  async getContracts() {
    const { data, error } = await supabase
      .from("contracts")
      .select(`
        id, name, manufacturer_id, category_id, levels, enhancement, status, updated_at, expires_at
      `);
    if (error) throw error;
    return data;
  },

  // ✅ Add a New Contract
  async addContract(contract: { id: string; name: string; manufacturer_id: string; category_id: string; levels: string; enhancement: string; status: string; updated_at: string; expires_at: string }) {
    const { data, error } = await supabase.from("contracts").insert([contract]).select();
    if (error) throw error;
    return data;
  },

  // ✅ Delete a Contract
  async deleteContract(contractId: string) {
    const { data, error } = await supabase.from("contracts").delete().eq("id", contractId);
    if (error) throw error;
    return data;
  },

  // ✅ Fetch Competitive Pricing Data
  async getCompetitivePricing() {
    const { data, error } = await supabase.from("competitive_pricing").select("*");
    if (error) throw error;
    return data;
  },

  // ✅ Add a New Competitive Pricing Entry
  async addCompetitivePricing(entry: { id: string; product_id: string; price: number; competitor: string; date: string }) {
    const { data, error } = await supabase.from("competitive_pricing").insert([entry]).select();
    if (error) throw error;
    return data;
  },

  // ✅ Fetch state-specific pricing
  async getStatePricing(stateCode: string) {
    const { data, error } = await supabase.from("state_pricing").select("*").eq("state_code", stateCode);
    if (error) throw error;
    return data;
  },

  // ✅ Fetch contracts by manufacturer
  async getContractsByManufacturer(manufacturerId: string) {
    const { data, error } = await supabase
      .from("contracts")
      .select("*")
      .eq("manufacturer_id", manufacturerId);
    if (error) throw error;
    return data;
  },

  // ✅ Fetch program discount rates by state
  async getProgramDiscountsByState(states: string[]) {
    const { data, error } = await supabase
      .from("state_pricing")
      .select("state_code, min_price, max_price, state_tax_rate")
      .in("state_code", states);
    if (error) throw error;
    return data;
  },

  // ✅ Fetch all states
  async getStates() {
    const { data, error } = await supabase.from("states").select("*");
    if (error) throw error;
    return data;
  },

  // ✅ Fetch all manufacturers
  async getManufacturers() {
    const { data, error } = await supabase.from("manufacturers").select("id, name");
    if (error) throw error;
    return data;
  },

  // ✅ Fetch all product categories
  async getProductCategories() {
    const { data, error } = await supabase.from("product_categories").select("id, name");
    if (error) throw error;
    return data;
  },
};

export default pricingApi;

