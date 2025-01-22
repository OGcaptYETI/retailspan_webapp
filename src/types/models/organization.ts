import { Json } from '../supabase'

export type SubscriptionStatus = 'active' | 'inactive' | 'trial';

export interface Organization {
  id: string;
  created_at: string;
  name: string;
  subscription_status: SubscriptionStatus;
  trial_ends_at: string | null;
  settings: Json;
}

export type OrganizationUpdate = Partial<Organization>;