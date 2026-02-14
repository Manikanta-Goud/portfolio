import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Tutorial({ onComplete }) {
    const [step, setStep] = useState(0)
    const [show, setShow] = useState(true)

    const steps = [
        {
            title: "Welcome to the Omniverse! 🌌",
            description: "Navigate through 4 different galaxies, each containing unique portfolio content.",
            icon: "🚀"
        },
        {
            title: "Explore Crystals 💎",
            description: "Hover over crystals to see them glow. Click to view detailed content panels.",
            icon: "✨"
        },
        {
            title: "Galaxy Navigation 🗺️",
            description: "Use the NAVIGATE button (bottom-right) or click distant galaxies to travel between worlds.",
            icon: "🌟"
        },
        {
            title: "Ready to Explore! 🎯",
            description: "Click anywhere to begin your journey through the portfolio universe.",
            icon: "🎉"
        }
    ]

    const handleNext = () => {
        if (step < steps.length - 1) {
            setStep(step + 1)
        } else {
            setShow(false)
            if (onComplete) onComplete()
            localStorage.setItem('portfolio_tutorial_completed', 'true')
        }
    }

    const handleSkip = () => {
        setShow(false)
        if (onComplete) onComplete()
        localStorage.setItem('portfolio_tutorial_completed', 'true')
    }

    useEffect(() => {
        const completed = localStorage.getItem('portfolio_tutorial_completed')
        if (completed) {
            setShow(false)
            if (onComplete) onComplete()
        }
    }, [])

    if (!show) return null

    return (
        <AnimatePresence>
            <motion.div
                className="tutorial-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <motion.div
                    className="tutorial-card"
                    initial={{ scale: 0.8, y: 50 }}
                    animate={{ scale: 1, y: 0 }}
                    transition={{ type: 'spring', damping: 20 }}
                >
                    <div className="tutorial-icon">{steps[step].icon}</div>
                    <h2 className="tutorial-title">{steps[step].title}</h2>
                    <p className="tutorial-description">{steps[step].description}</p>

                    <div className="tutorial-progress">
                        {steps.map((_, i) => (
                            <div
                                key={i}
                                className={`progress-dot ${i === step ? 'active' : ''} ${i < step ? 'completed' : ''}`}
                            />
                        ))}
                    </div>

                    <div className="tutorial-buttons">
                        <button className="tutorial-btn skip" onClick={handleSkip}>
                            Skip Tutorial
                        </button>
                        <button className="tutorial-btn next" onClick={handleNext}>
                            {step < steps.length - 1 ? 'Next' : 'Start Exploring'} →
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}
