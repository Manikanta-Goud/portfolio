import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Intro = ({ onStart, imagePath }) => {
    const [stage, setStage] = useState('heading'); // heading, reveal, ready
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const containerRef = useRef(null);

    // Stage control
    useEffect(() => {
        const hTimer = setTimeout(() => setStage('reveal'), 2500);
        const rTimer = setTimeout(() => setStage('ready'), 6000);
        return () => {
            clearTimeout(hTimer);
            clearTimeout(rTimer);
        };
    }, []);

    const handleMouseMove = (e) => {
        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            setMousePos({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            });
        }
    };

    const batmanUrl = '/batman.jpg'; // Your provided Batman image

    return (
        <motion.div
            ref={containerRef}
            className="intro-overlay-full"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: 'blur(20px)' }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
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
                            THE ARCHITECT
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
                        {/* Background Layer (Batman) */}
                        <div
                            className="reveal-layer background-layer batman-img"
                            style={{ backgroundImage: `url(${batmanUrl})` }}
                        >
                            <div className="layer-overlay dark"></div>
                        </div>

                        {/* Foreground Layer (User Photo) */}
                        <motion.div
                            className="reveal-layer foreground-layer user-img"
                            style={{
                                backgroundImage: `url(${imagePath})`,
                                WebkitMaskImage: `radial-gradient(circle 300px at ${mousePos.x}px ${mousePos.y}px, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 80%, rgba(0,0,0,1) 100%)`,
                                maskImage: `radial-gradient(circle 300px at ${mousePos.x}px ${mousePos.y}px, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 80%, rgba(0,0,0,1) 100%)`
                            }}
                        >
                            <div className="layer-overlay light"></div>
                        </motion.div>

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
