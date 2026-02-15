import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// Check if Supabase is configured
export const isSupabaseConfigured = () => {
    return supabaseUrl && 
           supabaseAnonKey && 
           supabaseUrl !== '' &&
           supabaseAnonKey !== '' &&
           supabaseUrl !== 'your_supabase_url_here' && 
           supabaseAnonKey !== 'your_supabase_anon_key_here'
}

// Create Supabase client only if configured, otherwise null
export const supabase = isSupabaseConfigured() 
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null

// Log configuration status (only in development)
if (import.meta.env.DEV) {
    if (isSupabaseConfigured()) {
        console.log('✅ Supabase configured successfully')
    } else {
        console.log('ℹ️ Supabase not configured - database features disabled')
    }
}