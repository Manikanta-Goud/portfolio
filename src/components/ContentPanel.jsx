import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function ContentPanel({ crystal, onClose }) {
    if (!crystal) return null

    // Content data for each crystal
    const contentData = {
        // MAIN GALAXY
        profile: {
            title: 'IDENTITY',
            icon: '👤',
            color: '#667eea',
            content: (
                <div className="portfolio-content" style={{ '--accent-color': '#667eea' }}>
                    <div className="id-header">
                        <span className="id-status">SYSTEM ACTIVE</span>
                        <span className="id-code">#GOUD-2027</span>
                    </div>

                    <h2 className="gradient-text">Bodige Manikanta Goud</h2>
                    <p className="bio-lead">Always curious about new features and tools. Crafting seamless digital experiences with a focus on innovation.</p>

                    <div className="identity-card" style={{ color: '#667eea' }}>
                        <p>A dedicated Full Stack Developer and student pursuing B.Tech at Anurag University (Class of 2027), passionate about building tools that solve real-world problems.</p>
                    </div>

                    <div className="profile-stats">
                        <div className="stat">
                            <span className="stat-value">B.Tech</span>
                            <span className="stat-label">Education</span>
                        </div>
                        <div className="stat">
                            <span className="stat-value">2+</span>
                            <span className="stat-label">Live Ops</span>
                        </div>
                        <div className="stat">
                            <span className="stat-value">2027</span>
                            <span className="stat-label">Grad Year</span>
                        </div>
                    </div>
                </div>
            )
        },
        contact: {
            title: 'TRANSMISSION',
            icon: '📡',
            color: '#10b981',
            content: (
                <div className="portfolio-content" style={{ '--accent-color': '#10b981' }}>
                    <h2>Connect to Terminal</h2>
                    <p>Open for opportunities at global tech leaders and innovative startups.</p>
                    <div className="contact-terminal" style={{ color: '#10b981' }}>
                        <div className="terminal-line">
                            <span className="prompt">{'>'}</span>
                            <a href="mailto:goudbmanikanta@gmail.com">goudbmanikanta@gmail.com</a>
                        </div>
                        <div className="terminal-line">
                            <span className="prompt">{'>'}</span>
                            <a href="https://github.com/Manikanta-Goud" target="_blank">github.com/Manikanta-Goud</a>
                        </div>
                        <div className="terminal-line">
                            <span className="prompt">{'>'}</span>
                            <a href="https://www.linkedin.com/in/manikanta-goud-72169b314/" target="_blank">linkedin.com/in/manikanta-goud</a>
                        </div>
                    </div>
                    <div className="status-grid">
                        <div className="status-item available" style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.8rem',
                            color: '#10b981',
                            fontWeight: 'bold',
                            letterSpacing: '0.1rem'
                        }}>
                            <div className="status-dot" style={{
                                width: '10px',
                                height: '10px',
                                background: '#10b981',
                                borderRadius: '50%',
                                boxShadow: '0 0 10px #10b981'
                            }}></div>
                            <span>OPEN FOR CHALLENGES @ GOOGLE, AMAZON, ACCENTURE</span>
                        </div>
                    </div>
                </div>
            )
        },
        resume: {
            title: 'ARCHIVES',
            icon: '📂',
            color: '#f59e0b',
            content: (
                <div className="portfolio-content" style={{ '--accent-color': '#f59e0b' }}>
                    <h2>Academic Dossier</h2>
                    <div className="archive-section" style={{ color: '#f59e0b' }}>
                        <div className="timeline-item">
                            <span className="year" style={{ color: '#f59e0b', fontWeight: 'bold' }}>2023 - 2027</span>
                            <h3 style={{ color: '#fff' }}>B.Tech Student @ Anurag University</h3>
                            <p>Specializing in Full Stack Development and solving complex institutional problems through technology.</p>
                        </div>
                    </div>
                    <div className="future-goals" style={{ marginTop: '2rem', borderTop: '1px dashed rgba(245, 158, 11, 0.3)', paddingTop: '1rem' }}>
                        <h4 style={{ fontSize: '0.8rem', color: '#f59e0b' }}>ASPIRING TO JOIN:</h4>
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', opacity: 0.8 }}>
                            <span>GOOGLE</span>
                            <span>AMAZON</span>
                            <span>ACCENTURE</span>
                        </div>
                    </div>
                </div>
            )
        },
        languages: {
            title: 'CORE LOGIC',
            icon: '⌨️',
            color: '#3b82f6',
            content: (
                <div className="portfolio-content" style={{ '--accent-color': '#3b82f6' }}>
                    <h2>Primary Kernels</h2>
                    <div className="skill-bars">
                        {[
                            { name: 'Java', val: '90%' },
                            { name: 'JavaScript', val: '85%' },
                            { name: 'HTML/CSS', val: '95%' },
                            { name: 'Python / C', val: '80%' }
                        ].map(s => (
                            <div key={s.name} className="skill-entry" style={{ marginBottom: '1rem' }}>
                                <div className="skill-label" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', color: '#fff', fontSize: '0.9rem' }}>
                                    <span>{s.name}</span>
                                    <span>{s.val}</span>
                                </div>
                                <div className="skill-bar-container" style={{ height: '5px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
                                    <div className="skill-fill" style={{ width: s.val, height: '100%', background: '#3b82f6', boxShadow: '0 0 10px #3b82f6' }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )
        },
        frameworks: {
            title: 'ECOSYSTEMS',
            icon: '🕸️',
            color: '#8b5cf6',
            content: (
                <div className="portfolio-content" style={{ '--accent-color': '#8b5cf6' }}>
                    <h2>Tech Stack Hyperstructure</h2>
                    <div className="stack-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                        {['⚛️ React', '🟢 Node.js', '🔥 Firebase', '🛠️ Git'].map(i => (
                            <div key={i} className="stack-card" style={{ color: '#8b5cf6', textAlign: 'center', background: 'rgba(139, 92, 246, 0.05)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(139, 92, 246, 0.1)' }}>
                                {i}
                            </div>
                        ))}
                    </div>
                </div>
            )
        },
        projects: {
            title: 'DEV REPOSITORIES',
            icon: '🚀',
            color: '#ef4444',
            content: (
                <div className="portfolio-content" style={{ '--accent-color': '#ef4444' }}>
                    <h2 className="gradient-text">Project Manifest</h2>
                    <div className="manifest-grid" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div className="manifest-item" style={{ color: '#ef4444', borderLeft: '2px solid #ef4444', paddingLeft: '1rem' }}>
                            <h3 style={{ color: '#fff', marginBottom: '0.4rem' }}>AU-CONNECT</h3>
                            <p style={{ fontSize: '0.9rem', marginBottom: '0.8rem' }}>Exclusive social platform for Anurag University students. Features real-time student circles and campus-wide interactions.</p>
                            <div className="m-tags" style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                                {['REACT', 'FIREBASE', 'LIVE'].map(t => <span key={t} style={{ fontSize: '0.6rem', padding: '0.2rem 0.6rem', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '20px' }}>{t}</span>)}
                            </div>
                            <a href="https://au-connect.tech" target="_blank" className="m-link" style={{ color: '#ef4444', textDecoration: 'none', fontWeight: 'bold' }}>ACCESS LOG →</a>
                        </div>

                        <div className="manifest-item" style={{ color: '#ef4444', borderLeft: '2px solid #ef4444', paddingLeft: '1rem' }}>
                            <h3 style={{ color: '#fff', marginBottom: '0.4rem' }}>HOSTEL-MANAG</h3>
                            <p style={{ fontSize: '0.9rem', marginBottom: '0.8rem' }}>Enterprise tracking solution for hostel owners. Helps manage business operations, tracking, and logistics online.</p>
                            <div className="m-tags" style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                                {['NODEJS', 'MANAGEMENT', 'HELPFUL'].map(t => <span key={t} style={{ fontSize: '0.6rem', padding: '0.2rem 0.6rem', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '20px' }}>{t}</span>)}
                            </div>
                            <a href="https://hostel-manag.netlify.app" target="_blank" className="m-link" style={{ color: '#ef4444', textDecoration: 'none', fontWeight: 'bold' }}>ACCESS LOG →</a>
                        </div>
                    </div>
                </div>
            )
        }
    }

    const data = contentData[crystal] || {
        title: crystal.toUpperCase(),
        icon: '✨',
        color: '#ffffff',
        content: <p>Content coming soon...</p>
    }

    return (
        <AnimatePresence>
            <motion.div
                className="content-panel-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
            >
                <motion.div
                    className="content-panel"
                    initial={{ x: '100%', skewX: '2deg' }}
                    animate={{ x: 0, skewX: '0deg' }}
                    exit={{ x: '100%', skewX: '2deg' }}
                    transition={{ type: 'spring', damping: 30, stiffness: 200 }}
                    onClick={(e) => e.stopPropagation()}
                    style={{ borderLeftColor: data.color, color: data.color }}
                >
                    <div className="content-panel-header">
                        <div className="content-panel-title">
                            <span className="content-icon">{data.icon}</span>
                            <h1>{data.title}</h1>
                        </div>
                        <button className="close-btn" onClick={onClose}>✕</button>
                    </div>

                    <div className="content-panel-body">
                        {data.content}
                    </div>

                    {/* Footer decoration */}
                    <div className="content-panel-footer" style={{
                        padding: '1.5rem 2.5rem',
                        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                        fontSize: '0.7rem',
                        color: 'rgba(255, 255, 255, 0.2)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontFamily: 'monospace'
                    }}>
                        <span>OVM_OS v.2.0.42</span>
                        <span>SECURE_ENCRYPTION_ENABLED</span>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}
