import { createClientSupabaseClient } from './client'
import type {
    ManufacturerPricing,
    StatePricing,
    CustomerContract,
    Promotion,
    PromotionProduct,
    CalculatedPrice,
    PriceCalculationInput,
    PriceCalculationResult,
    ContractDiscount,
    BasePricing
} from '@/types/models/pricing'

export class PricingService {
    private supabase = createClientSupabaseClient()

    async getBasePrice(productId: string): Promise<ManufacturerPricing> {
        const { data, error } = await this.supabase
            .from('manufacturer_pricing')
            .select('*')
            .eq('product_id', productId)
            .lt('effective_date', new Date().toISOString())
            .order('effective_date', { ascending: false })
            .limit(1)
            .single()

        if (error) throw new Error(`Error fetching base price: ${error.message}`)
        if (!data) throw new Error('Base pricing not found')
        return data
    }
    async getStatePricing(productId: string, stateCode: string): Promise<StatePricing | null> {
        const { data, error } = await this.supabase
            .from('state_pricing')
            .select('*')
            .eq('state_code', stateCode)
            .eq('product_id', productId)
            .single()

        if (error && error.code !== 'PGRST116') {
            throw new Error(`Error fetching state pricing: ${error.message}`)
        }
        return data
    }

    async getCustomerContract(organizationId: string): Promise<CustomerContract | null> {
        const { data, error } = await this.supabase
            .from('customer_contracts')
            .select('*')
            .eq('organization_id', organizationId)
            .single()

        if (error && error.code !== 'PGRST116') {
            throw new Error(`Error fetching customer contract: ${error.message}`)
        }
        return data
    }

    async getContractDiscounts(
        organizationId: string,
        manufacturerId: string
    ): Promise<ContractDiscount[]> {
        const { data, error } = await this.supabase
            .from('contract_discounts')
            .select('*')
            .eq('organization_id', organizationId)
            .eq('manufacturer_id', manufacturerId)
            .eq('active', true)
            .lte('start_date', new Date().toISOString())
            .gt('end_date', new Date().toISOString())

        if (error) throw new Error(`Error fetching contract discounts: ${error.message}`)
        return data || []
    }

    async getActivePromotions(
        manufacturerId: string,
        productId: string
    ): Promise<Promotion[]> {
        const now = new Date().toISOString()
        const { data, error } = await this.supabase
            .from('promotions')
            .select(`
                *,
                promotion_products!inner(*)
            `)
            .eq('manufacturer_id', manufacturerId)
            .eq('active', true)
            .lte('start_date', now)
            .gt('end_date', now)
            .eq('promotion_products.product_id', productId)

        if (error) throw new Error(`Error fetching promotions: ${error.message}`)
        return data || []
    }

    async getPromotionProducts(promotionId: string): Promise<PromotionProduct[]> {
        const { data, error } = await this.supabase
            .from('promotion_products')
            .select('*')
            .eq('promotion_id', promotionId)

        if (error) throw new Error(`Error fetching promotion products: ${error.message}`)
        return data || []
    }

    async calculatePrice(input: PriceCalculationInput): Promise<CalculatedPrice> {
        const { data, error } = await this.supabase
            .rpc('calculate_price', input)
            .single()

        if (error) throw new Error(`Error calculating price: ${error.message}`)
        if (!data) throw new Error('Price calculation failed')
        return data as CalculatedPrice
    }

    async saveCalculation(calculation: PriceCalculationInput): Promise<PriceCalculationResult> {
        const { data, error } = await this.supabase
            .from('price_calculations')
            .insert([{
                ...calculation,
                calculated_at: new Date().toISOString()
            }])
            .select()
            .single()

        if (error) throw new Error(`Error saving calculation: ${error.message}`)
        if (!data) throw new Error('Failed to save calculation')
        return data
    }

    async updateBasePrice(pricing: Partial<BasePricing>): Promise<BasePricing> {
        const { data, error } = await this.supabase
            .from('manufacturer_pricing')
            .update({
                ...pricing,
                last_updated: new Date().toISOString()
            })
            .eq('id', pricing.id)
            .select()
            .single()

        if (error) throw new Error(`Error updating base price: ${error.message}`)
        if (!data) throw new Error('Failed to update base price')
        return data
    }
}

export const pricingService = new PricingService()