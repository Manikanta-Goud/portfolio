import React, { useState, useEffect } from 'react'
import { PortfolioDatabase } from '../lib/database.js'
import { isSupabaseConfigured } from '../lib/supabase.js'

export default function PortfolioStats() {
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!isSupabaseConfigured()) {
            setLoading(false)
            return
        }

        const fetchStats = async () => {
            try {
                const portfolioStats = await PortfolioDatabase.getPortfolioStats()
                setStats(portfolioStats)
            } catch (error) {
                console.error('Error fetching stats:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchStats()
    }, [])

    if (!isSupabaseConfigured()) {
        return (
            <div className="stats-container">
                <p className="stats-disabled">Database not configured</p>
            </div>
        )
    }

    if (loading) {
        return (
            <div className="stats-container">
                <div className="stats-loading">Loading stats...</div>
            </div>
        )
    }

    return (
        <div className="stats-container">
            <h3 className="stats-title">Portfolio Analytics</h3>
            {stats && (
                <div className="stats-grid">
                    <div className="stat-item">
                        <div className="stat-value">{stats.totalVisits}</div>
                        <div className="stat-label">Galaxy Visits</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-value">{stats.totalCrystalClicks}</div>
                        <div className="stat-label">Crystal Interactions</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-value">Live</div>
                        <div className="stat-label">Status</div>
                    </div>
                </div>
            )}
        </div>
    )
}