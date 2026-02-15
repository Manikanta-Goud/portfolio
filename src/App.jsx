import React, { useState, useEffect, useRef, useCallback } from 'react'
import Experience from './components/Experience'
import ContentPanel from './components/ContentPanel'
import Tutorial from './components/Tutorial'
import SpaceshipTransition from './components/SpaceshipTransition'
import Intro from './components/Intro'
import { motion, AnimatePresence } from 'framer-motion'
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from '@clerk/clerk-react'

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
    const [showTutorial, setShowTutorial] = useState(false)
    const [showIntro, setShowIntro] = useState(false)
    const [showAuth, setShowAuth] = useState(true)
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    // Clerk user hook
    const { isSignedIn, user } = useUser()

    // Auto-proceed when user signs in
    useEffect(() => {
        if (isSignedIn && user && showAuth) {
            // Start intro after successful auth
            setShowAuth(false)
            setIsAuthenticated(true)
            setShowIntro(true)
        }
    }, [isSignedIn, user, showAuth])

    // Sound refs
    const clickSound = useRef(null)
    const hoverSound = useRef(null)
    const warpSound = useRef(null)
    const ambientSound = useRef(null)

    useEffect(() => {
        // Initialize sounds
        clickSound.current = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIGGS57OihUBELTKXh8bllHgU2jdXvz3wqBSh+zPLaizsKFGO56+mjUxELTKXh8bllHgU2jdXvz3wqBSh+zPLaizsKFGO56+mjUxELTKXh8bllHgU2jdXvz3wqBQ==')
        hoverSound.current = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIGGS57OihUBELTKXh8bllHgU2jdXvz3wqBSh+zPLaizsKFGO56+mjUxELTKXh8bllHgU2jdXvz3wqBSh+zPLaizsKFGO56+mjUxELTKXh8bllHgU2jdXvz3wqBQ==')
        warpSound.current = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIGGS57OihUBELTKXh8bllHgU2jdXvz3wqBSh+zPLaizsKFGO56+mjUxELTKXh8bllHgU2jdXvz3wqBSh+zPLaizsKFGO56+mjUxELTKXh8bllHgU2jdXvz3wqBQ==')
        ambientSound.current = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIGGS57OihUBELTKXh8bllHgU2jdXvz3wqBSh+zPLaizsKFGO56+mjUxELTKXh8bllHgU2jdXvz3wqBSh+zPLaizsKFGO56+mjUxELTKXh8bllHgU2jdXvz3wqBQ==')

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

    const handleGalaxyNavClick = useCallback((galaxy) => {
        if (galaxy !== activeGalaxy && !transitioning) {
            playSound(warpSound)
            setTransitioning(true)
            setActiveGalaxy(galaxy)
            setShowGalaxyMenu(false)

            if (!visitedGalaxies.includes(galaxy)) {
                setVisitedGalaxies([...visitedGalaxies, galaxy])
            }

            setTimeout(() => setTransitioning(false), 5000)
        }
    }, [activeGalaxy, transitioning, visitedGalaxies, user, warpSound])

    const handleCrystalClick = useCallback((crystalId) => {
        if (crystalId && crystalId !== activeCrystal) {
            // Check if sound exists before playing to avoid potential null pointer in some browsers
            if (warpSound && warpSound.current) {
                playSound(warpSound)
            }
            setActiveCrystal(crystalId)

            if (!visitedCrystals.includes(crystalId)) {
                setVisitedCrystals([...visitedCrystals, crystalId])
            }
        }
    }, [activeCrystal, visitedCrystals, user, activeGalaxy, warpSound])

    const galaxies = [
        { id: 'main', icon: '🌟', name: 'IDENTITY CORE' },
        { id: 'nebula', icon: '🟣', name: 'INTELLECTUAL HUB' },
        { id: 'quantum', icon: '🔵', name: 'INNOVATION LAB' },
        { id: 'void', icon: '🔴', name: 'DEV REPOSITORY' }
    ]

    // Check if Clerk is configured
    const isClerkConfigured = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY && 
                              import.meta.env.VITE_CLERK_PUBLISHABLE_KEY !== 'your_publishable_key_here'

    // Handle intro completion - go to tutorial
    const handleIntroComplete = () => {
        setShowIntro(false)
        setShowTutorial(true)
        setShowCanvas(true)
    }

    // Handle tutorial completion
    const handleTutorialComplete = () => {
        setShowTutorial(false)
    }

    return (
        <div className="portfolio-root">
            {/* Clerk Authentication Screen - First and Simple */}
            <AnimatePresence>
                {showAuth && isClerkConfigured && (
                    <div className="simple-auth-overlay">
                        <div className="simple-auth-content">
                            <h1 className="simple-auth-title">Welcome</h1>
                            <p className="simple-auth-subtitle">Please sign in to continue</p>
                            <div className="simple-auth-buttons">
                                <SignedOut>
                                    <SignInButton 
                                        mode="modal"
                                        redirectUrl={window.location.href}
                                        signUpUrl={undefined}
                                        forceRedirectUrl={window.location.href}
                                    >
                                        <button className="simple-auth-btn">Sign In</button>
                                    </SignInButton>
                                </SignedOut>
                                <SignedIn>
                                    <div className="auth-loading">
                                        <div>Authenticated ✓</div>
                                        <div>Loading experience...</div>
                                    </div>
                                </SignedIn>
                            </div>
                        </div>
                    </div>
                )}
            </AnimatePresence>

            {/* User Profile (only show after auth and not during intro/tutorial) */}
            {!showAuth && !showIntro && !showTutorial && isAuthenticated && isClerkConfigured && (
                <div className="auth-container">
                    <SignedIn>
                        <UserButton afterSignOutUrl="/" />
                    </SignedIn>
                </div>
            )}

            {/* Intro Sequence - After Auth */}
            <AnimatePresence>
                {showIntro && isAuthenticated && (
                    <Intro
                        imagePath="/portrait.jpg"
                        onStart={handleIntroComplete}
                    />
                )}
            </AnimatePresence>

            {/* Tutorial - After Intro */}
            {showTutorial && !showIntro && <Tutorial onComplete={handleTutorialComplete} />}

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
                            <h1 className="loader-title">MANIKANTA GOUD'S OMNIVERSE</h1>
                            <p className="loader-subtitle">SYNCHRONIZING PORTFOLIO CORES</p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Spaceship Transition - Cinematic! */}
            {!showIntro && (
                <SpaceshipTransition
                    isActive={transitioning}
                    destinationGalaxy={galaxies.find(g => g.id === activeGalaxy)?.name || activeGalaxy}
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
                        onGalaxyChange={handleGalaxyNavClick}
                    />
                </motion.div>
            )}

            {/* Content Panel */}
            <AnimatePresence>
                {activeCrystal && (
                    <ContentPanel
                        key="content-panel"
                        crystal={activeCrystal}
                        onClose={() => setActiveCrystal(null)}
                    />
                )}
            </AnimatePresence>

            {/* Title */}
            {!showIntro && (
                <motion.div
                    className="title-container"
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 1 }}
                >
                    <h1 className="main-title">BODIGE MANIKANTA GOUD</h1>
                    <p className="sub-title">FULL STACK DEVELOPER | INNOVATION SEEKER</p>
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
                    <img src="/portrait.jpg" alt="Manikanta Goud" className="profile-img" />
                    <div className="profile-info">
                        <span className="profile-name">MANIKANTA GOUD</span>
                        <div className="profile-subtitle">FULL STACK DEVELOPER</div>
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
