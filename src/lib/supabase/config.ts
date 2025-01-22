const getEnvVar = (key: string, defaultValue?: string): string => {
  const value = process.env[key] || defaultValue
  
  if (typeof window !== 'undefined') {
    // We're on the client side, check for the required variables
    if (key.startsWith('NEXT_PUBLIC_') && !value) {
      console.error(`Missing required public environment variable: ${key}`)
    }
    return value || ''
  }
  
  // Server-side, enforce required variables
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`)
  }
  
  return value
}

export const supabaseConfig = {
  supabaseUrl: getEnvVar('NEXT_PUBLIC_SUPABASE_URL', 'https://jrdwwbnjjqiadzdromfs.supabase.co'),
  supabaseKey: getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpyZHd3Ym5qanFpYWR6ZHJvbWZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzcyOTUxOTQsImV4cCI6MjA1Mjg3MTE5NH0.VrD6UH5qtnTDMqOjlArAfK4zBYSlA1qqu6WLQ4IBqO4'),
  serviceRoleKey: getEnvVar('SUPABASE_SERVICE_ROLE_KEY', ''),
}

export const appConfig = {
  appName: getEnvVar('NEXT_PUBLIC_APP_NAME', 'RetailSpan'),
  appUrl: getEnvVar('NEXT_PUBLIC_APP_URL', 'http://localhost:3000'),
  enableRealTime: getEnvVar('NEXT_PUBLIC_ENABLE_REAL_TIME', 'false') === 'true',
  enableAnalytics: getEnvVar('NEXT_PUBLIC_ENABLE_ANALYTICS', 'false') === 'true',
  apiBaseUrl: getEnvVar('NEXT_PUBLIC_API_BASE_URL', '/api'),
}

export type SupabaseConfig = typeof supabaseConfig
export type AppConfig = typeof appConfig