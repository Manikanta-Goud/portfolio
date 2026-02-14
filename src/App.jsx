import React, { useState, useEffect, useRef } from 'react'
import Experience from './components/Experience'
import ContentPanel from './components/ContentPanel'
import Tutorial from './components/Tutorial'
import SpaceshipTransition from './components/SpaceshipTransition'
import Intro from './components/Intro'
import { motion, AnimatePresence } from 'framer-motion'

function App() {
    const [loading, setLoading] = useState(true)
    const [showCanvas, setShowCanvas] = useState(false)
    const [showGalaxyMenu, setShowGalaxyMenu] = useState(false)
    const [activeGalaxy, setActiveGalaxy] = useState('main')
    const [activeCrystal, setActiveCrystal] = useState(null)
    const [transitioning, setTransitioning] = useState(false)
    const [visitedGalaxies, setVisitedGalaxies] = useState(['main'])
    const [visitedCrystals, setVisitedCrystals] = useState([])
    const [soundEnabled, setSoundEnabled] = useState(true)
    const [showTutorial, setShowTutorial] = useState(true)
    const [showIntro, setShowIntro] = useState(true)

    // Sound refs
    const clickSound = useRef(null)
    const hoverSound = useRef(null)
    const warpSound = useRef(null)
    const ambientSound = useRef(null)

    useEffect(() => {
        // Initialize sounds
        clickSound.current = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIGGS57OihUBELTKXh8bllHgU2jdXvz3wqBSh+zPLaizsKFGO56+mjUxELTKXh8bllHgU2jdXvz3wqBSh+zPLaizsKFGO56+mjUxELTKXh8bllHgU2jdXvz3wqBQ==')
        hoverSound.current = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIGGS57OihUBELTKXh8bllHgU2jdXvz3wqBSh+zPLaizsKFGO56+mjUxELTKXh8bllHgU2jdXvz3wqBSh+zPLaizsKFGO56+mjUxELTKXh8bllHgU2jdXvz3wqBQ==')

        const loaderTimer = setTimeout(() => setLoading(false), 3000)
        const canvasTimer = setTimeout(() => setShowCanvas(true), 1000)

        return () => {
            clearTimeout(loaderTimer)
            clearTimeout(canvasTimer)
        }
    }, [])

    const playSound = (sound) => {
        if (soundEnabled && sound.current) {
            sound.current.currentTime = 0
            sound.current.volume = 0.3
            sound.current.play().catch(() => { })
        }
    }

    const handleGalaxyNavClick = (galaxy) => {
        if (galaxy !== activeGalaxy) {
            playSound(warpSound) // Transition sound
            setTransitioning(true)
            setActiveGalaxy(galaxy)
            setShowGalaxyMenu(false)

            if (!visitedGalaxies.includes(galaxy)) {
                setVisitedGalaxies([...visitedGalaxies, galaxy])
            }

            setTimeout(() => setTransitioning(false), 5000)
        }
    }

    const handleCrystalClick = (crystalId) => {
        playSound(warpSound) // Unified Transition sound instead of 'tuk tuk' (clickSound)
        setActiveCrystal(crystalId)

        if (!visitedCrystals.includes(crystalId)) {
            setVisitedCrystals([...visitedCrystals, crystalId])
        }
    }

    const galaxies = [
        { id: 'main', icon: '🌟', name: 'Main Galaxy' },
        { id: 'nebula', icon: '🟣', name: 'Nebula Sector' },
        { id: 'quantum', icon: '🔵', name: 'Quantum Realm' },
        { id: 'void', icon: '🔴', name: 'Void Dimension' }
    ]

    return (
        <div className="portfolio-root">
            {/* Intro Sequence */}
            <AnimatePresence>
                {showIntro && (
                    <Intro
                        imagePath="/portrait.jpg"
                        onStart={() => setShowIntro(false)}
                    />
                )}
            </AnimatePresence>

            {/* Tutorial */}
            {showTutorial && !showIntro && <Tutorial onComplete={() => setShowTutorial(false)} />}

            {/* Loading Screen */}
            <AnimatePresence>
                {loading && (
                    <motion.div
                        className="loader"
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1 }}
                    >
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.5, duration: 1 }}
                        >
                            <h1 className="loader-title">THE OMNIVERSAL SINGULARITY</h1>
                            <p className="loader-subtitle">INITIALIZING SPACETIME</p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Spaceship Transition - Cinematic! */}
            {!showIntro && (
                <SpaceshipTransition
                    isActive={transitioning}
                    destinationGalaxy={activeGalaxy}
                    onComplete={() => { }}
                />
            )}

            {/* 3D Canvas */}
            {showCanvas && (
                <motion.div
                    className="canvas-container"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: showIntro ? 0 : 1 }}
                    transition={{ duration: 2 }}
                >
                    <Experience
                        activeGalaxy={activeGalaxy}
                        onCrystalClick={handleCrystalClick}
                    />
                </motion.div>
            )}

            {/* Content Panel */}
            {activeCrystal && (
                <ContentPanel
                    crystal={activeCrystal}
                    onClose={() => setActiveCrystal(null)}
                />
            )}

            {/* Title */}
            {!showIntro && (
                <motion.div
                    className="title-container"
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 1 }}
                >
                    <h1 className="main-title">IDENTITY</h1>
                    <p className="sub-title">FULL STACK ARCHITECT | DIMENSION WEAVER</p>
                </motion.div>
            )}

            {/* Profile Card */}
            {!showIntro && (
                <motion.div
                    className="profile-card"
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.8, duration: 1 }}
                >
                    <img src="/portrait.jpg" alt="Architect" className="profile-img" />
                    <div className="profile-info">
                        <span className="profile-name">ARCHITECT</span>
                        <div className="profile-subtitle">DIMENSION WEAVER</div>
                        <div className="pulse-indicator"></div>
                    </div>
                </motion.div>
            )}

            {/* Bottom Navigation */}
            {!showIntro && (
                <motion.div
                    className="nav-container"
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1, duration: 1 }}
                >
                    <a href="#origin" className="nav-link">ORIGIN</a>
                    <a href="#manifests" className="nav-link">MANIFESTS</a>
                    <a href="#transmission" className="nav-link">TRANSMISSION</a>
                </motion.div>
            )}

            {/* Progress Tracker */}
            {!showIntro && (
                <motion.div
                    className="progress-tracker"
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 1.2, duration: 1 }}
                >
                    {galaxies.map((galaxy) => (
                        <div
                            key={galaxy.id}
                            className={`progress-item ${activeGalaxy === galaxy.id ? 'active' : ''} ${visitedGalaxies.includes(galaxy.id) ? 'visited' : ''}`}
                            onClick={() => handleGalaxyNavClick(galaxy.id)}
                        >
                            <span>{galaxy.icon}</span>
                            <div className="progress-tooltip">{galaxy.name}</div>
                        </div>
                    ))}
                </motion.div>
            )}

            {/* Galaxy Navigation Menu */}
            {!showIntro && (
                <motion.div
                    className="galaxy-nav"
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 1.4, duration: 1 }}
                >
                    <button
                        className="galaxy-nav-toggle"
                        onClick={() => {
                            playSound(clickSound)
                            setShowGalaxyMenu(!showGalaxyMenu)
                        }}
                    >
                        <span className="galaxy-icon">🌌</span>
                        <span className="galaxy-nav-text">NAVIGATE</span>
                    </button>

                    {showGalaxyMenu && (
                        <motion.div
                            className="galaxy-menu"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.3 }}
                        >
                            {galaxies.map((galaxy) => (
                                <div
                                    key={galaxy.id}
                                    className={`galaxy-menu-item ${activeGalaxy === galaxy.id ? 'active' : ''}`}
                                    onClick={() => handleGalaxyNavClick(galaxy.id)}
                                >
                                    <span className="galaxy-menu-icon">{galaxy.icon}</span>
                                    <span className="galaxy-menu-name">{galaxy.name}</span>
                                </div>
                            ))}
                        </motion.div>
                    )}
                </motion.div>
            )}

            {/* Sound Toggle */}
            {!showIntro && (
                <motion.button
                    className={`sound-toggle ${!soundEnabled ? 'muted' : ''}`}
                    onClick={() => {
                        playSound(clickSound)
                        setSoundEnabled(!soundEnabled)
                    }}
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 1.6, duration: 1 }}
                    title={soundEnabled ? 'Mute Sounds' : 'Enable Sounds'}
                >
                    {soundEnabled ? '🔊' : '🔇'}
                </motion.button>
            )}
        </div>
    )
}

export default App
