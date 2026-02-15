import { supabase, isSupabaseConfigured } from './supabase.js'

// Portfolio Analytics Service
export class PortfolioDatabase {
    
    // Save or update user profile from Clerk authentication
    static async saveUserProfile(clerkUser) {
        if (!isSupabaseConfigured() || !supabase || !clerkUser) return null
        
        try {
            const userData = {
                user_id: clerkUser.id,
                email: clerkUser.emailAddresses?.[0]?.emailAddress || null,
                first_name: clerkUser.firstName || null,
                last_name: clerkUser.lastName || null,
                username: clerkUser.username || null,
                image_url: clerkUser.imageUrl || null,
                last_sign_in_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }

            // Use upsert to insert or update existing user
            const { data: result, error } = await supabase
                .from('user_profiles')
                .upsert(userData, { 
                    onConflict: 'user_id',
                    ignoreDuplicates: false 
                })
                .select()
            
            if (error) throw error

            // Update total users count
            await this.incrementPortfolioStat('total_users')
            
            console.log('User profile saved:', result)
            return result
        } catch (error) {
            console.error('Error saving user profile:', error)
            return null
        }
    }

    // Get user profile by ID
    static async getUserProfile(userId) {
        if (!isSupabaseConfigured() || !supabase || !userId) return null
        
        try {
            const { data, error } = await supabase
                .from('user_profiles')
                .select('*')
                .eq('user_id', userId)
                .single()
            
            if (error) throw error
            return data
        } catch (error) {
            console.error('Error fetching user profile:', error)
            return null
        }
    }
    
    // Track user interactions (crystal clicks, galaxy visits, etc.)
    static async trackInteraction(userId, action, data = {}) {
        if (!isSupabaseConfigured() || !supabase) return null
        
        try {
            const { data: result, error } = await supabase
                .from('user_interactions')
                .insert({
                    user_id: userId,
                    action: action,
                    data: data,
                    timestamp: new Date().toISOString()
                })
            
            if (error) throw error
            return result
        } catch (error) {
            console.error('Error tracking interaction:', error)
            return null
        }
    }

    // Save contact form submissions
    static async submitContactForm(formData) {
        if (!isSupabaseConfigured() || !supabase) return null
        
        try {
            const { data: result, error } = await supabase
                .from('contact_submissions')
                .insert({
                    name: formData.name,
                    email: formData.email,
                    message: formData.message,
                    submitted_at: new Date().toISOString()
                })
            
            if (error) throw error
            return result
        } catch (error) {
            console.error('Error submitting contact form:', error)
            return null
        }
    }

    // Helper function to increment portfolio stats
    static async incrementPortfolioStat(metricName) {
        if (!isSupabaseConfigured() || !supabase) return null
        
        try {
            const { error } = await supabase.rpc('increment_metric', {
                metric: metricName
            })
            
            if (error) throw error
        } catch (error) {
            console.warn(`Could not increment ${metricName}:`, error)
        }
    }

    // Get portfolio statistics
    static async getPortfolioStats() {
        if (!isSupabaseConfigured()) return null
        
        try {
            const { data: visits } = await supabase
                .from('user_interactions')
                .select('*')
                .eq('action', 'galaxy_visit')

            const { data: crystalClicks } = await supabase
                .from('user_interactions')
                .select('*')
                .eq('action', 'crystal_click')

            return {
                totalVisits: visits?.length || 0,
                totalCrystalClicks: crystalClicks?.length || 0,
                lastUpdated: new Date().toISOString()
            }
        } catch (error) {
            console.error('Error getting portfolio stats:', error)
            return null
        }
    }

    // Save user preferences/settings
    static async saveUserPreferences(userId, preferences) {
        if (!isSupabaseConfigured()) return null
        
        try {
            const { data: result, error } = await supabase
                .from('user_preferences')
                .upsert({
                    user_id: userId,
                    preferences: preferences,
                    updated_at: new Date().toISOString()
                })
            
            if (error) throw error
            return result
        } catch (error) {
            console.error('Error saving user preferences:', error)
            return null
        }
    }

    // Get user preferences
    static async getUserPreferences(userId) {
        if (!isSupabaseConfigured()) return null
        
        try {
            const { data, error } = await supabase
                .from('user_preferences')
                .select('preferences')
                .eq('user_id', userId)
                .single()
            
            if (error) throw error
            return data?.preferences || null
        } catch (error) {
            console.error('Error getting user preferences:', error)
            return null
        }
    }
}