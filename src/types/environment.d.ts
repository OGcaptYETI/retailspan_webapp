export interface Environment {
  NEXT_PUBLIC_SUPABASE_URL: string
  NEXT_PUBLIC_SUPABASE_ANON_KEY: string
  NEXT_PUBLIC_APP_URL: string
  SUPABASE_SERVICE_ROLE_KEY: string
  NEXT_PUBLIC_STORAGE_BUCKET: string
  NODE_ENV: 'development' | 'production' | 'test'
  NEXT_PUBLIC_SITE_URL: string
  NEXT_PUBLIC_APP_NAME: string
  NEXT_PUBLIC_APP_DESCRIPTION: string
  NEXT_PUBLIC_CONTACT_EMAIL: string
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?: string
  STRIPE_SECRET_KEY?: string
  STRIPE_WEBHOOK_SECRET?: string
}

declare global {
  namespace NodeJS {
    type ProcessEnv = Environment;
  }
}

// Export environment type
export type ENV_KEY = keyof Environment