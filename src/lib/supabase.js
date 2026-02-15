import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Check if Supabase is configured
export const isSupabaseConfigured = () => {
    return supabaseUrl && 
           supabaseAnonKey && 
           supabaseUrl !== 'your_supabase_url_here' && 
           supabaseAnonKey !== 'your_supabase_anon_key_here'
}