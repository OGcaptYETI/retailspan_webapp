import { Json } from '../supabase'

export type UserRole = 'admin' | 'manager' | 'user';

export interface UserProfile {
  id: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  organization_id: string;
  role: UserRole;
  permissions: string[];
  settings: Json;
}

export type UserProfileUpdate = Partial<UserProfile>;

export interface User {
  id: string;
  created_at: string;
  name?: string;
  email?: string;
  organization_id?: string;
  role?: UserRole;
}