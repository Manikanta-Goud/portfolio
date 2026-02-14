import React, { Suspense, useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { Stars, PerspectiveCamera, OrbitControls, Text } from '@react-three/drei'
import CrystalShard from './CrystalShard'
import BlackHole from './BlackHole'
import SpiralGalaxy from './SpiralGalaxy'
import GalaxyEcosystem from './GalaxyEcosystem'
import CameraController from './CameraController'

export default function Experience({ activeGalaxy: propActiveGalaxy, onCrystalClick }) {
    const [activeGalaxy, setActiveGalaxy] = useState(propActiveGalaxy || 'main')
    const [transitioning, setTransitioning] = useState(false)

    // Update when prop changes (from navigation menu)
    useEffect(() => {
        if (propActiveGalaxy && propActiveGalaxy !== activeGalaxy && !transitioning) {
            setTransitioning(true)
            setActiveGalaxy(propActiveGalaxy)
            setTimeout(() => setTransitioning(false), 5000)
        }
    }, [propActiveGalaxy])

    const handleGalaxyClick = (galaxyName) => {
        if (!transitioning && galaxyName !== activeGalaxy) {
            setTransitioning(true)
            setActiveGalaxy(galaxyName)
            setTimeout(() => setTransitioning(false), 5000)
        }
    }

    return (
        <Canvas dpr={[1, 2]} gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}>
            <color attach="background" args={['#000000']} />
            <fog attach="fog" args={['#000000', 50, 200]} />

            <PerspectiveCamera makeDefault position={[30, 35, 40]} fov={60} />

            <Suspense fallback={null}>
                <Stars radius={300} depth={150} count={3000} factor={3} saturation={0} fade speed={0.05} />

                {/* MAIN GALAXY - Always visible at center */}
                {activeGalaxy === 'main' && (
                    <>
                        <BlackHole />
                        <SpiralGalaxy />

                        <CrystalShard radius={12} speed={0.15} phase={0} offsetZ={0} title="PROFILE" color="#ffffff" id="profile" onClick={onCrystalClick} />
                        <CrystalShard radius={12} speed={0.15} phase={Math.PI * 0.66} offsetZ={0} title="CONTACT" color="#10b981" id="contact" onClick={onCrystalClick} />
                        <CrystalShard radius={12} speed={0.15} phase={Math.PI * 1.33} offsetZ={0} title="RESUME" color="#f59e0b" id="resume" onClick={onCrystalClick} />

                        <CrystalShard radius={22} speed={-0.1} phase={0} offsetZ={0} title="LANGUAGES" color="#3b82f6" id="languages" onClick={onCrystalClick} />
                        <CrystalShard radius={22} speed={-0.1} phase={Math.PI * 0.5} offsetZ={0} title="FRAMEWORKS" color="#8b5cf6" id="frameworks" onClick={onCrystalClick} />
                        <CrystalShard radius={22} speed={-0.1} phase={Math.PI} offsetZ={0} title="SKILLS" color="#ec4899" id="skills" onClick={onCrystalClick} />
                        <CrystalShard radius={22} speed={-0.1} phase={Math.PI * 1.5} offsetZ={0} title="CERTS" color="#14b8a6" id="certifications" onClick={onCrystalClick} />

                        <CrystalShard radius={35} speed={0.07} phase={0} offsetZ={0} title="PROJECTS" color="#ef4444" id="projects" onClick={onCrystalClick} />
                        <CrystalShard radius={35} speed={0.07} phase={Math.PI * 0.66} offsetZ={0} title="EXPERIENCE" color="#06b6d4" id="experience" onClick={onCrystalClick} />
                        <CrystalShard radius={35} speed={0.07} phase={Math.PI * 1.33} offsetZ={0} title="ACHIEVEMENTS" color="#a855f7" id="achievements" onClick={onCrystalClick} />
                    </>
                )}

                {/* NEBULA GALAXY - Purple/Pink content */}
                {activeGalaxy === 'nebula' && (
                    <>
                        <group position={[-100, 0, -80]}>
                            <GalaxyEcosystem position={[0, 0, 0]} color="#cc00ff" name="NEBULA" scale={2} />

                            <CrystalShard radius={15} speed={0.12} phase={0} offsetZ={0} title="BLOG" color="#cc00ff" id="blog" />
                            <CrystalShard radius={15} speed={0.12} phase={Math.PI} offsetZ={0} title="ARTICLES" color="#aa00dd" id="articles" />
                            <CrystalShard radius={25} speed={-0.08} phase={0} offsetZ={0} title="TUTORIALS" color="#8800bb" id="tutorials" />
                            <CrystalShard radius={25} speed={-0.08} phase={Math.PI * 0.66} offsetZ={0} title="VIDEOS" color="#dd00ff" id="videos" />
                            <CrystalShard radius={25} speed={-0.08} phase={Math.PI * 1.33} offsetZ={0} title="PODCASTS" color="#bb00dd" id="podcasts" />
                        </group>
                    </>
                )}

                {/* QUANTUM GALAXY - Cyan/Blue content */}
                {activeGalaxy === 'quantum' && (
                    <>
                        <group position={[100, -20, 100]}>
                            <GalaxyEcosystem position={[0, 0, 0]} color="#00aacc" name="QUANTUM" scale={2.5} />

                            <CrystalShard radius={18} speed={0.1} phase={0} offsetZ={0} title="AI PROJECTS" color="#00aacc" id="ai" />
                            <CrystalShard radius={18} speed={0.1} phase={Math.PI * 0.8} offsetZ={0} title="RESEARCH" color="#0088aa" id="research" />
                            <CrystalShard radius={30} speed={-0.06} phase={0} offsetZ={0} title="EXPERIMENTS" color="#006688" id="experiments" />
                            <CrystalShard radius={30} speed={-0.06} phase={Math.PI * 0.5} offsetZ={0} title="INNOVATIONS" color="#0099bb" id="innovations" />
                            <CrystalShard radius={30} speed={-0.06} phase={Math.PI} offsetZ={0} title="PROTOTYPES" color="#00bbdd" id="prototypes" />
                            <CrystalShard radius={30} speed={-0.06} phase={Math.PI * 1.5} offsetZ={0} title="DEMOS" color="#00ccee" id="demos" />
                        </group>
                    </>
                )}

                {/* VOID GALAXY - Red/Orange content */}
                {activeGalaxy === 'void' && (
                    <>
                        <group position={[-80, 40, -120]}>
                            <GalaxyEcosystem position={[0, 0, 0]} color="#dd3300" name="VOID" scale={2.2} />

                            <CrystalShard radius={16} speed={0.11} phase={0} offsetZ={0} title="OPEN SOURCE" color="#dd3300" id="opensource" />
                            <CrystalShard radius={16} speed={0.11} phase={Math.PI} offsetZ={0} title="CONTRIBUTIONS" color="#bb2200" id="contributions" />
                            <CrystalShard radius={28} speed={-0.07} phase={0} offsetZ={0} title="LIBRARIES" color="#ff5522" id="libraries" />
                            <CrystalShard radius={28} speed={-0.07} phase={Math.PI * 0.66} offsetZ={0} title="TOOLS" color="#ee4411" id="tools" />
                            <CrystalShard radius={28} speed={-0.07} phase={Math.PI * 1.33} offsetZ={0} title="PACKAGES" color="#cc3300" id="packages" />
                        </group>
                    </>
                )}

                {/* NEIGHBOR GALAXY PREVIEWS - Always show other 3 galaxies */}
                {/* From MAIN - show all 3 neighbors */}
                {activeGalaxy === 'main' && (
                    <>
                        <group position={[-100, 0, -80]} onClick={() => handleGalaxyClick('nebula')}>
                            <GalaxyEcosystem position={[0, 0, 0]} color="#cc00ff" name="NEBULA" scale={0.5} />
                            <Text position={[0, 12, 0]} fontSize={2.5} color="#cc00ff" anchorX="center" outlineWidth={0.1} outlineColor="#000000">
                                NEBULA
                            </Text>
                        </group>

                        <group position={[100, -20, 100]} onClick={() => handleGalaxyClick('quantum')}>
                            <GalaxyEcosystem position={[0, 0, 0]} color="#00aacc" name="QUANTUM" scale={0.6} />
                            <Text position={[0, 15, 0]} fontSize={2.5} color="#00aacc" anchorX="center" outlineWidth={0.1} outlineColor="#000000">
                                QUANTUM
                            </Text>
                        </group>

                        <group position={[-80, 40, -120]} onClick={() => handleGalaxyClick('void')}>
                            <GalaxyEcosystem position={[0, 0, 0]} color="#dd3300" name="VOID" scale={0.55} />
                            <Text position={[0, 13, 0]} fontSize={2.5} color="#dd3300" anchorX="center" outlineWidth={0.1} outlineColor="#000000">
                                VOID
                            </Text>
                        </group>
                    </>
                )}

                {/* From NEBULA - show main, quantum, void */}
                {activeGalaxy === 'nebula' && (
                    <>
                        <group position={[100, 0, 80]} onClick={() => handleGalaxyClick('main')}>
                            <GalaxyEcosystem position={[0, 0, 0]} color="#ff8844" name="MAIN" scale={1.5} />
                            {/* Glowing marker sphere */}
                            <mesh position={[0, 0, 0]}>
                                <sphereGeometry args={[8, 32, 32]} />
                                <meshBasicMaterial color="#ff8844" transparent opacity={0.3} />
                            </mesh>
                            <pointLight position={[0, 0, 0]} intensity={10} color="#ff8844" distance={100} />
                            <Text position={[0, 20, 0]} fontSize={4} color="#ff8844" anchorX="center" outlineWidth={0.2} outlineColor="#000000">
                                MAIN GALAXY
                            </Text>
                        </group>

                        <group position={[200, -20, 180]} onClick={() => handleGalaxyClick('quantum')}>
                            <GalaxyEcosystem position={[0, 0, 0]} color="#00aacc" name="QUANTUM" scale={2.0} />
                            <mesh position={[0, 0, 0]}>
                                <sphereGeometry args={[10, 32, 32]} />
                                <meshBasicMaterial color="#00aacc" transparent opacity={0.3} />
                            </mesh>
                            <pointLight position={[0, 0, 0]} intensity={12} color="#00aacc" distance={120} />
                            <Text position={[0, 25, 0]} fontSize={4} color="#00aacc" anchorX="center" outlineWidth={0.2} outlineColor="#000000">
                                QUANTUM REALM
                            </Text>
                        </group>

                        <group position={[20, 40, -40]} onClick={() => handleGalaxyClick('void')}>
                            <GalaxyEcosystem position={[0, 0, 0]} color="#dd3300" name="VOID" scale={1.8} />
                            <mesh position={[0, 0, 0]}>
                                <sphereGeometry args={[9, 32, 32]} />
                                <meshBasicMaterial color="#dd3300" transparent opacity={0.3} />
                            </mesh>
                            <pointLight position={[0, 0, 0]} intensity={11} color="#dd3300" distance={110} />
                            <Text position={[0, 22, 0]} fontSize={4} color="#dd3300" anchorX="center" outlineWidth={0.2} outlineColor="#000000">
                                VOID DIMENSION
                            </Text>
                        </group>
                    </>
                )}

                {/* From QUANTUM - show main, nebula, void */}
                {activeGalaxy === 'quantum' && (
                    <>
                        <group position={[-100, 20, -100]} onClick={() => handleGalaxyClick('main')}>
                            <GalaxyEcosystem position={[0, 0, 0]} color="#ff8844" name="MAIN" scale={1.5} />
                            <mesh position={[0, 0, 0]}>
                                <sphereGeometry args={[8, 32, 32]} />
                                <meshBasicMaterial color="#ff8844" transparent opacity={0.3} />
                            </mesh>
                            <pointLight position={[0, 0, 0]} intensity={10} color="#ff8844" distance={100} />
                            <Text position={[0, 20, 0]} fontSize={4} color="#ff8844" anchorX="center" outlineWidth={0.2} outlineColor="#000000">
                                MAIN GALAXY
                            </Text>
                        </group>

                        <group position={[-200, 20, -180]} onClick={() => handleGalaxyClick('nebula')}>
                            <GalaxyEcosystem position={[0, 0, 0]} color="#cc00ff" name="NEBULA" scale={1.5} />
                            <mesh position={[0, 0, 0]}>
                                <sphereGeometry args={[8, 32, 32]} />
                                <meshBasicMaterial color="#cc00ff" transparent opacity={0.3} />
                            </mesh>
                            <pointLight position={[0, 0, 0]} intensity={10} color="#cc00ff" distance={100} />
                            <Text position={[0, 20, 0]} fontSize={4} color="#cc00ff" anchorX="center" outlineWidth={0.2} outlineColor="#000000">
                                NEBULA SECTOR
                            </Text>
                        </group>

                        <group position={[-180, 60, -220]} onClick={() => handleGalaxyClick('void')}>
                            <GalaxyEcosystem position={[0, 0, 0]} color="#dd3300" name="VOID" scale={1.8} />
                            <mesh position={[0, 0, 0]}>
                                <sphereGeometry args={[9, 32, 32]} />
                                <meshBasicMaterial color="#dd3300" transparent opacity={0.3} />
                            </mesh>
                            <pointLight position={[0, 0, 0]} intensity={11} color="#dd3300" distance={110} />
                            <Text position={[0, 22, 0]} fontSize={4} color="#dd3300" anchorX="center" outlineWidth={0.2} outlineColor="#000000">
                                VOID DIMENSION
                            </Text>
                        </group>
                    </>
                )}

                {/* From VOID - show main, nebula, quantum */}
                {activeGalaxy === 'void' && (
                    <>
                        <group position={[80, -40, 120]} onClick={() => handleGalaxyClick('main')}>
                            <GalaxyEcosystem position={[0, 0, 0]} color="#ff8844" name="MAIN" scale={1.5} />
                            <mesh position={[0, 0, 0]}>
                                <sphereGeometry args={[8, 32, 32]} />
                                <meshBasicMaterial color="#ff8844" transparent opacity={0.3} />
                            </mesh>
                            <pointLight position={[0, 0, 0]} intensity={10} color="#ff8844" distance={100} />
                            <Text position={[0, 20, 0]} fontSize={4} color="#ff8844" anchorX="center" outlineWidth={0.2} outlineColor="#000000">
                                MAIN GALAXY
                            </Text>
                        </group>

                        <group position={[-20, -40, 40]} onClick={() => handleGalaxyClick('nebula')}>
                            <GalaxyEcosystem position={[0, 0, 0]} color="#cc00ff" name="NEBULA" scale={1.5} />
                            <mesh position={[0, 0, 0]}>
                                <sphereGeometry args={[8, 32, 32]} />
                                <meshBasicMaterial color="#cc00ff" transparent opacity={0.3} />
                            </mesh>
                            <pointLight position={[0, 0, 0]} intensity={10} color="#cc00ff" distance={100} />
                            <Text position={[0, 20, 0]} fontSize={4} color="#cc00ff" anchorX="center" outlineWidth={0.2} outlineColor="#000000">
                                NEBULA SECTOR
                            </Text>
                        </group>

                        <group position={[180, -60, 220]} onClick={() => handleGalaxyClick('quantum')}>
                            <GalaxyEcosystem position={[0, 0, 0]} color="#00aacc" name="QUANTUM" scale={2.0} />
                            <mesh position={[0, 0, 0]}>
                                <sphereGeometry args={[10, 32, 32]} />
                                <meshBasicMaterial color="#00aacc" transparent opacity={0.3} />
                            </mesh>
                            <pointLight position={[0, 0, 0]} intensity={12} color="#00aacc" distance={120} />
                            <Text position={[0, 25, 0]} fontSize={4} color="#00aacc" anchorX="center" outlineWidth={0.2} outlineColor="#000000">
                                QUANTUM REALM
                            </Text>
                        </group>
                    </>
                )}

                {/* Camera transition controller */}
                <CameraController activeGalaxy={activeGalaxy} />

                {/* Lighting */}
                <ambientLight intensity={0.15} color="#0a1929" />
                <pointLight position={[0, 20, 0]} intensity={1.5} color="#fbbf24" distance={80} />
                <pointLight position={[20, 5, 20]} intensity={0.8} color="#ec4899" distance={60} />
                <pointLight position={[-20, 5, -20]} intensity={0.8} color="#3b82f6" distance={60} />
            </Suspense>

            <OrbitControls
                enablePan={false}
                enableZoom={true}
                minDistance={20}
                maxDistance={120}
                autoRotate={activeGalaxy === 'main'}
                autoRotateSpeed={0.3}
                target={
                    activeGalaxy === 'main' ? [0, 0, 0] :
                        activeGalaxy === 'nebula' ? [-100, 0, -80] :
                            activeGalaxy === 'quantum' ? [100, -20, 100] :
                                activeGalaxy === 'void' ? [-80, 40, -120] :
                                    [0, 0, 0]
                }
                enabled={!transitioning}
            />
        </Canvas>
    )
}
