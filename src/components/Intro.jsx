import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Intro = ({ onStart, imagePath }) => {
    const [stage, setStage] = useState('heading'); // heading, reveal, ready
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [imagesLoaded, setImagesLoaded] = useState(false);
    const containerRef = useRef(null);
    const throttleRef = useRef(null);

    const batmanUrl = '/batman.jpg';
    
    // Preload images for smooth performance
    useEffect(() => {
        const preloadImages = async () => {
            const promises = [batmanUrl, imagePath].map(src => {
                return new Promise((resolve, reject) => {
                    const img = new Image();
                    img.onload = resolve;
                    img.onerror = reject;
                    img.src = src;
                });
            });
            
            try {
                await Promise.all(promises);
                setImagesLoaded(true);
            } catch (error) {
                console.warn('Some images failed to load:', error);
                setImagesLoaded(true); // Continue anyway
            }
        };

        preloadImages();
    }, [imagePath]);

    // Stage control - start only after images are loaded
    useEffect(() => {
        if (!imagesLoaded) return;
        
        const hTimer = setTimeout(() => setStage('reveal'), 2500);
        const rTimer = setTimeout(() => setStage('ready'), 6000);
        return () => {
            clearTimeout(hTimer);
            clearTimeout(rTimer);
        };
    }, [imagesLoaded]);

    // Throttled mouse move for better performance
    const handleMouseMove = useCallback((e) => {
        if (throttleRef.current) return;
        
        throttleRef.current = requestAnimationFrame(() => {
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                setMousePos({
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top
                });
            }
            throttleRef.current = null;
        });
    }, []);

    // Don't render until images are loaded to prevent stuttering
    if (!imagesLoaded) {
        return (
            <div className="intro-loading">
                <div className="loading-spinner"></div>
                <div>Loading Experience...</div>
            </div>
        );
    }

    return (
        <motion.div
            ref={containerRef}
            className="intro-overlay-full"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            onMouseMove={handleMouseMove}
        >
            {/* Stage 1: The Heading */}
            <AnimatePresence>
                {stage === 'heading' && (
                    <motion.div
                        className="intro-heading-container"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, y: -50 }}
                        transition={{ duration: 1 }}
                    >
                        <motion.h1
                            className="intro-heading-giant"
                            initial={{ letterSpacing: '0.5rem', opacity: 0 }}
                            animate={{ letterSpacing: '2rem', opacity: 1 }}
                            transition={{ duration: 2, ease: "easeOut" }}
                        >
                            BODIGE MANIKANTA GOUD
                        </motion.h1>
                        <motion.p
                            className="intro-subtitle-welcome"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1, duration: 1.5 }}
                        >
                            WELCOME TO MY WORLD
                        </motion.p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Stage 2 & 3: The Photo Reveal */}
            <AnimatePresence>
                {(stage === 'reveal' || stage === 'ready') && (
                    <motion.div
                        className="intro-reveal-container"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1.5 }}
                    >
                        {/* Background Layer (Batman) - Optimized */}
                        <div
                            className="reveal-layer background-layer batman-img"
                            style={{ 
                                backgroundImage: `url(${batmanUrl})`,
                                willChange: 'transform'
                            }}
                        >
                            <div className="layer-overlay dark"></div>
                        </div>

                        {/* Foreground Layer (User Photo) - Optimized */}
                        <div
                            className="reveal-layer foreground-layer user-img"
                            style={{
                                backgroundImage: `url(${imagePath})`,
                                WebkitMaskImage: `radial-gradient(circle 250px at ${mousePos.x}px ${mousePos.y}px, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 70%, rgba(0, 0, 0, 1) 100%)`,
                                maskImage: `radial-gradient(circle 250px at ${mousePos.x}px ${mousePos.y}px, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 70%, rgba(0, 0, 0, 1) 100%)`,
                                willChange: 'mask-image, -webkit-mask-image'
                            }}
                        >
                            <div className="layer-overlay light"></div>
                        </div>

                        {/* Hint Text */}
                        {stage === 'reveal' && (
                            <motion.div
                                className="reveal-hint"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: [0, 1, 0] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                            >
                                HOVER TO REVEAL THE ALTER EGO
                            </motion.div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Stage 3: The Button */}
            <AnimatePresence>
                {stage === 'ready' && (
                    <motion.div
                        className="intro-ready-container"
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5, duration: 1 }}
                    >
                        <button
                            className="intro-button-premium"
                            onClick={onStart}
                        >
                            <span>ENTER THE OMNIVERSE</span>
                            <div className="btn-glow"></div>
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Cosmic Particles */}
            <div className="intro-stars"></div>
        </motion.div>
    );
};

export default Intro;
