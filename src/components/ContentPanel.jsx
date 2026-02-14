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
                <div className="portfolio-content">
                    <h2 className="gradient-text">Full Stack Architect</h2>
                    <p className="bio-lead">Crafting high-performance digital experiences where design meets precision engineering.</p>

                    <div className="identity-card">
                        <div className="id-header">
                            <span className="id-status">SYSTEM ACTIVE</span>
                            <span className="id-code">#ARCH-001</span>
                        </div>
                        <p>Based in the digital ether, specializing in immersive 3D web applications, AI integration, and scalable cloud architectures.</p>
                    </div>

                    <div className="profile-stats">
                        <div className="stat">
                            <span className="stat-value">6+</span>
                            <span className="stat-label">Years of Code</span>
                        </div>
                        <div className="stat">
                            <span className="stat-value">42</span>
                            <span className="stat-label">Deployments</span>
                        </div>
                        <div className="stat">
                            <span className="stat-value">∞</span>
                            <span className="stat-label">Curiosity</span>
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
                <div className="portfolio-content">
                    <h2>Connect to Terminal</h2>
                    <p>Available for high-impact collaborations and architectural consulting.</p>
                    <div className="contact-terminal">
                        <div className="terminal-line">
                            <span className="prompt">{'>'}</span>
                            <a href="mailto:architect@omniverse.dev">architect@omniverse.dev</a>
                        </div>
                        <div className="terminal-line">
                            <span className="prompt">{'>'}</span>
                            <a href="https://github.com/architect-01" target="_blank">github.com/architect-01</a>
                        </div>
                        <div className="terminal-line">
                            <span className="prompt">{'>'}</span>
                            <a href="https://linkedin.com/in/architect" target="_blank">linkedin.com/in/architect</a>
                        </div>
                    </div>
                    <div className="status-grid">
                        <div className="status-item available">
                            <div className="status-dot"></div>
                            <span>OPEN FOR PROJECTS</span>
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
                <div className="portfolio-content">
                    <h2>Technical Dossier</h2>
                    <div className="archive-section">
                        <div className="timeline-item">
                            <span className="year">2022-2024</span>
                            <h3>Senior Systems Architect @ NeuraLink</h3>
                            <p>Designing real-time data visualization engines for neural interfaces.</p>
                        </div>
                        <div className="timeline-item">
                            <span className="year">2019-2022</span>
                            <h3>Lead Web Engineer @ CyberDyne</h3>
                            <p>Architected the core UI framework for planetary health monitoring.</p>
                        </div>
                    </div>
                    <button className="hologram-btn">
                        <span>DOWNLOAD ARCHIVE (PDF)</span>
                    </button>
                </div>
            )
        },
        // NEBULA / SKILLS
        languages: {
            title: 'CORE LOGIC',
            icon: '⌨️',
            color: '#3b82f6',
            content: (
                <div className="portfolio-content">
                    <h2>Primary Kernels</h2>
                    <div className="skill-bars">
                        <div className="skill-entry">
                            <div className="skill-label">TypeScript / Rust</div>
                            <div className="skill-bar-container"><div className="skill-fill" style={{ width: '95%' }}></div></div>
                        </div>
                        <div className="skill-entry">
                            <div className="skill-label">Python / AI Models</div>
                            <div className="skill-bar-container"><div className="skill-fill" style={{ width: '88%' }}></div></div>
                        </div>
                        <div className="skill-entry">
                            <div className="skill-label">GLSL / WebGL Shader</div>
                            <div className="skill-bar-container"><div className="skill-fill" style={{ width: '92%' }}></div></div>
                        </div>
                    </div>
                </div>
            )
        },
        frameworks: {
            title: 'ECOSYSTEMS',
            icon: '🕸️',
            color: '#8b5cf6',
            content: (
                <div className="portfolio-content">
                    <h2>Tech Stack Hyperstructure</h2>
                    <div className="stack-grid">
                        <div className="stack-card">⚛️ React / Next.js</div>
                        <div className="stack-card">🌌 Three.js / R3F</div>
                        <div className="stack-card">🔥 Firebase / Supabase</div>
                        <div className="stack-card">🧠 PyTorch / LangChain</div>
                    </div>
                </div>
            )
        },
        projects: {
            title: 'MANIFESTS',
            icon: '🎬',
            color: '#ef4444',
            content: (
                <div className="portfolio-content">
                    <h2>Project Logs</h2>
                    <div className="manifest-grid">
                        <div className="manifest-item">
                            <h3>Project: Helios-4</h3>
                            <p>3D Solar system explorer with real-time NASA telemetry.</p>
                            <div className="m-tags">THREEJS • WEBGL • API</div>
                            <a href="#" className="m-link">ACCESS LOG →</a>
                        </div>
                        <div className="manifest-item">
                            <h3>Project: Synth-UI</h3>
                            <p>Generative UI system based on user biometric data.</p>
                            <div className="m-tags">AI • REACT • DESIGN</div>
                            <a href="#" className="m-link">ACCESS LOG →</a>
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
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    onClick={(e) => e.stopPropagation()}
                    style={{ borderLeftColor: data.color }}
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
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}
