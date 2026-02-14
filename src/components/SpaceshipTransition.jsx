import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function SpaceshipTransition({ isActive, destinationGalaxy, onComplete }) {
    const [phase, setPhase] = useState('idle')
    const audioRef = useRef(null)
    const canvasRef = useRef(null)
    const [audioLoaded, setAudioLoaded] = useState(false)
    const requestRef = useRef()

    // Starfield constants
    const STAR_COUNT = 800
    const stars = useRef([])

    useEffect(() => {
        // Preload audio
        audioRef.current = new Audio('/warp-sound.mpeg')
        audioRef.current.addEventListener('canplaythrough', () => setAudioLoaded(true))

        // Initialize stars
        for (let i = 0; i < STAR_COUNT; i++) {
            stars.current.push({
                x: (Math.random() - 0.5) * 2000,
                y: (Math.random() - 0.5) * 2000,
                z: Math.random() * 2000,
                pz: 0
            })
        }

        return () => {
            if (audioRef.current) {
                audioRef.current.pause()
                audioRef.current = null
            }
            cancelAnimationFrame(requestRef.current)
        }
    }, [])

    useEffect(() => {
        if (!isActive) {
            setPhase('idle')
            if (audioRef.current) {
                audioRef.current.pause()
                audioRef.current.currentTime = 0
            }
            return
        }

        // Play audio
        if (audioRef.current && audioLoaded) {
            audioRef.current.currentTime = 0
            audioRef.current.volume = 0.8
            audioRef.current.play().catch(err => console.log('Audio play failed:', err))
        }

        setPhase('starting')

        const timeouts = [
            setTimeout(() => setPhase('accelerating'), 400),
            setTimeout(() => setPhase('warp'), 1200),
            setTimeout(() => setPhase('slowing'), 4200),
            setTimeout(() => {
                setPhase('complete')
                if (onComplete) onComplete()
            }, 5000)
        ]

        return () => timeouts.forEach(clearTimeout)
    }, [isActive, audioLoaded])

    // Animation Loop for Realistic Starfield
    const animate = (time) => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        const w = canvas.width = window.innerWidth
        const h = canvas.height = window.innerHeight

        ctx.fillStyle = '#000'
        ctx.fillRect(0, 0, w, h)

        // Speed logic based on phase
        let speed = 2
        if (phase === 'accelerating') speed = 25
        if (phase === 'warp') speed = 80
        if (phase === 'slowing') speed = 10
        if (phase === 'starting') speed = 5

        ctx.strokeStyle = '#fff'
        ctx.lineWidth = 2
        ctx.lineCap = 'round'

        stars.current.forEach(star => {
            // Perspective projection
            const x = star.x / (star.z / 1000) + w / 2
            const y = star.y / (star.z / 1000) + h / 2

            if (star.pz !== 0) {
                const px = star.x / (star.pz / 1000) + w / 2
                const py = star.y / (star.pz / 1000) + h / 2

                // Color based on speed (blue shift)
                const opacity = Math.min(1, (2000 - star.z) / 500)
                const colorVal = phase === 'warp' ? '#0af' : '#fff'
                ctx.strokeStyle = colorVal
                ctx.globalAlpha = opacity

                // Draw the streak
                ctx.beginPath()
                ctx.moveTo(x, y)
                ctx.lineTo(px, py)
                ctx.stroke()
            }

            star.pz = star.z
            star.z -= speed

            // Reset star if it passes camera
            if (star.z <= 1) {
                star.z = 2000
                star.pz = 0
            }
        })

        requestRef.current = requestAnimationFrame(animate)
    }

    useEffect(() => {
        if (isActive) {
            requestRef.current = requestAnimationFrame(animate)
        }
        return () => cancelAnimationFrame(requestRef.current)
    }, [isActive, phase])

    if (!isActive) return null

    return (
        <AnimatePresence>
            <motion.div
                className="hyperspace-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <canvas ref={canvasRef} className="hyperspace-canvas" />

                {/* HUD Overlay */}
                <div className="warp-ui">
                    <motion.div
                        className="warp-flash"
                        animate={{ opacity: phase === 'starting' ? [0, 1, 0] : 0 }}
                        transition={{ duration: 0.5 }}
                    />

                    <div className="hud-brackets">
                        <div className="bracket tl" />
                        <div className="bracket tr" />
                        <div className="bracket bl" />
                        <div className="bracket br" />
                    </div>

                    <div className="warp-info">
                        <div className="info-row">
                            <span className="label">SEC:</span>
                            <span className="value">TRANS_GALAXY_v4.0</span>
                        </div>
                        <div className="info-row">
                            <span className="label">TARGET:</span>
                            <span className="value highlighting">{destinationGalaxy?.toUpperCase()}</span>
                        </div>
                    </div>

                    <div className="velocity-meter">
                        <div className="meter-label">VELOCITY</div>
                        <div className="meter-value">
                            {phase === 'warp' ? 'MAX_REACHED' : `${(Math.random() * 10).toFixed(2)}c`}
                        </div>
                        <div className="meter-bar">
                            <motion.div
                                className="meter-fill"
                                animate={{ width: phase === 'warp' ? '100%' : '20%' }}
                            />
                        </div>
                    </div>
                </div>

                {/* Cinematic Chromatic Aberration during warp */}
                {phase === 'warp' && (
                    <div className="warp-vignette" />
                )}
            </motion.div>
        </AnimatePresence>
    )
}
