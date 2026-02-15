import React, { Suspense, useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { Stars, PerspectiveCamera, OrbitControls, Text } from '@react-three/drei'
import CrystalShard from './CrystalShard'
import BlackHole from './BlackHole'
import SpiralGalaxy from './SpiralGalaxy'
import GalaxyEcosystem from './GalaxyEcosystem'
import CameraController from './CameraController'
import SpaceshipSwarm from './SpaceshipSwarm'
import NebulaGalaxy from './NebulaGalaxy'
import QuantumRealm from './QuantumRealm'
import VoidDimension from './VoidDimension'

export default function Experience({ activeGalaxy: propActiveGalaxy, onCrystalClick, onGalaxyChange }) {
    const [activeGalaxy, setActiveGalaxy] = useState(propActiveGalaxy || 'main')
    const [transitioning, setTransitioning] = useState(false)

    // Update when prop changes (from navigation menu)
    useEffect(() => {
        if (propActiveGalaxy && propActiveGalaxy !== activeGalaxy && !transitioning) {
            setTransitioning(true)
            setActiveGalaxy(propActiveGalaxy)
            setTimeout(() => setTransitioning(false), 5000)
        }
    }, [propActiveGalaxy, activeGalaxy, transitioning])

    const handleGalaxyClick = (galaxyName) => {
        if (!transitioning && galaxyName !== activeGalaxy) {
            setTransitioning(true)
            setActiveGalaxy(galaxyName)
            if (onGalaxyChange) onGalaxyChange(galaxyName)
            setTimeout(() => setTransitioning(false), 5000)
        }
    }

    return (
        <Canvas dpr={[1, 2]} gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}>
            <color attach="background" args={['#000000']} />
            <fog attach="fog" args={['#000000', 0.1, 5000]} />

            <PerspectiveCamera makeDefault position={[30, 35, 40]} fov={60} near={0.1} far={5000} />

            <Suspense fallback={null}>
                <Stars radius={300} depth={150} count={3000} factor={3} saturation={0} fade speed={0.05} />

                {/* MAIN GALAXY - Always visible at center */}
                {activeGalaxy === 'main' && (
                    <group key="main-galaxy-group">
                        <BlackHole />
                        <SpiralGalaxy />

                        <CrystalShard key="shard-profile" radius={12} speed={0.15} phase={0} offsetZ={0} title="PROFILE" color="#ffffff" id="profile" onClick={onCrystalClick} />
                        <CrystalShard key="shard-contact" radius={12} speed={0.15} phase={Math.PI * 0.66} offsetZ={0} title="CONTACT" color="#10b981" id="contact" onClick={onCrystalClick} />
                        <CrystalShard key="shard-resume" radius={12} speed={0.15} phase={Math.PI * 1.33} offsetZ={0} title="RESUME" color="#f59e0b" id="resume" onClick={onCrystalClick} />

                        <CrystalShard key="shard-languages" radius={22} speed={-0.1} phase={0} offsetZ={0} title="LANGUAGES" color="#3b82f6" id="languages" onClick={onCrystalClick} />
                        <CrystalShard key="shard-frameworks" radius={22} speed={-0.1} phase={Math.PI * 0.5} offsetZ={0} title="FRAMEWORKS" color="#8b5cf6" id="frameworks" onClick={onCrystalClick} />
                        <CrystalShard key="shard-skills" radius={22} speed={-0.1} phase={Math.PI} offsetZ={0} title="SKILLS" color="#ec4899" id="skills" onClick={onCrystalClick} />
                        <CrystalShard key="shard-certs" radius={22} speed={-0.1} phase={Math.PI * 1.5} offsetZ={0} title="CERTS" color="#14b8a6" id="certifications" onClick={onCrystalClick} />

                        <CrystalShard key="shard-projects" radius={35} speed={0.07} phase={0} offsetZ={0} title="PROJECTS" color="#ef4444" id="projects" onClick={onCrystalClick} />
                        <CrystalShard key="shard-experience" radius={35} speed={0.07} phase={Math.PI * 0.66} offsetZ={0} title="EXPERIENCE" color="#06b6d4" id="experience" onClick={onCrystalClick} />
                        <CrystalShard key="shard-achievements" radius={35} speed={0.07} phase={Math.PI * 1.33} offsetZ={0} title="ACHIEVEMENTS" color="#a855f7" id="achievements" onClick={onCrystalClick} />
                    </group>
                )}

                {/* NEBULA GALAXY - BLOG & ARTICLES */}
                {activeGalaxy === 'nebula' && (
                    <group key="nebula-galaxy-group" position={[-100, 0, -80]}>
                        <NebulaGalaxy position={[0, 0, 0]} scale={2} />

                        <CrystalShard key="shard-blog" radius={15} speed={0.12} phase={0} offsetZ={0} title="BLOG" color="#fbbf24" id="blog" onClick={onCrystalClick} />
                        <CrystalShard key="shard-articles" radius={15} speed={0.12} phase={Math.PI} offsetZ={0} title="ARTICLES" color="#ffffff" id="articles" onClick={onCrystalClick} />
                        <CrystalShard key="shard-tutorials" radius={25} speed={-0.08} phase={0} offsetZ={0} title="TUTORIALS" color="#fbbf24" id="tutorials" onClick={onCrystalClick} />
                        <CrystalShard key="shard-videos" radius={25} speed={-0.08} phase={Math.PI * 0.66} offsetZ={0} title="VIDEOS" color="#ffffff" id="videos" onClick={onCrystalClick} />
                        <CrystalShard key="shard-podcasts" radius={25} speed={-0.08} phase={Math.PI * 1.33} offsetZ={0} title="PODCASTS" color="#fbbf24" id="podcasts" onClick={onCrystalClick} />
                    </group>
                )}

                {/* QUANTUM GALAXY - AI & INNOVATION */}
                {activeGalaxy === 'quantum' && (
                    <group key="quantum-galaxy-group" position={[100, -20, 100]}>
                        <QuantumRealm position={[0, 0, 0]} scale={2.5} />

                        <CrystalShard key="shard-ai" radius={18} speed={0.1} phase={0} offsetZ={0} title="AI PROJECTS" color="#ec4899" id="ai" onClick={onCrystalClick} />
                        <CrystalShard key="shard-research" radius={18} speed={0.1} phase={Math.PI * 0.8} offsetZ={0} title="RESEARCH" color="#ffffff" id="research" onClick={onCrystalClick} />
                        <CrystalShard key="shard-experiments" radius={30} speed={-0.06} phase={0} offsetZ={0} title="EXPERIMENTS" color="#ec4899" id="experiments" onClick={onCrystalClick} />
                        <CrystalShard key="shard-innovations" radius={30} speed={-0.06} phase={Math.PI * 0.5} offsetZ={0} title="INNOVATIONS" color="#ffffff" id="innovations" onClick={onCrystalClick} />
                        <CrystalShard key="shard-prototypes" radius={30} speed={-0.06} phase={Math.PI} offsetZ={0} title="PROTOTYPES" color="#ec4899" id="prototypes" onClick={onCrystalClick} />
                        <CrystalShard key="shard-demos" radius={30} speed={-0.06} phase={Math.PI * 1.5} offsetZ={0} title="DEMOS" color="#ffffff" id="demos" onClick={onCrystalClick} />
                    </group>
                )}

                {/* VOID GALAXY - OPEN SOURCE & DEV TOOLS */}
                {activeGalaxy === 'void' && (
                    <group key="void-galaxy-group" position={[-80, 40, -120]}>
                        <VoidDimension position={[0, 0, 0]} scale={2.2} />

                        <CrystalShard key="shard-opensource" radius={16} speed={0.11} phase={0} offsetZ={0} title="OPEN SOURCE" color="#06b6d4" id="opensource" onClick={onCrystalClick} />
                        <CrystalShard key="shard-contributions" radius={16} speed={0.11} phase={Math.PI} offsetZ={0} title="CONTRIBUTIONS" color="#ffffff" id="contributions" onClick={onCrystalClick} />
                        <CrystalShard key="shard-libraries" radius={28} speed={-0.07} phase={0} offsetZ={0} title="LIBRARIES" color="#06b6d4" id="libraries" onClick={onCrystalClick} />
                        <CrystalShard key="shard-tools" radius={28} speed={-0.07} phase={Math.PI * 0.66} offsetZ={0} title="TOOLS" color="#ffffff" id="tools" onClick={onCrystalClick} />
                        <CrystalShard key="shard-packages" radius={28} speed={-0.07} phase={Math.PI * 1.33} offsetZ={0} title="PACKAGES" color="#06b6d4" id="packages" onClick={onCrystalClick} />
                    </group>
                )}

                {/* NEIGHBOR GALAXY PREVIEWS - Always show other 3 galaxies */}
                {/* From MAIN - show all 3 neighbors */}
                {activeGalaxy === 'main' && (
                    <>
                        <group key="nav-nebula" position={[-100, 0, -80]} onClick={() => handleGalaxyClick('nebula')}>
                            <NebulaGalaxy position={[0, 0, 0]} scale={0.8} />
                            <Text position={[0, 20, 0]} fontSize={5} color="#cc00ff" anchorX="center" outlineWidth={0.2} outlineColor="#000000">
                                INTELLECTUAL HUB
                            </Text>
                        </group>

                        <group key="nav-quantum" position={[100, -20, 100]} onClick={() => handleGalaxyClick('quantum')}>
                            <QuantumRealm position={[0, 0, 0]} scale={0.9} />
                            <Text position={[0, 25, 0]} fontSize={5} color="#00ffff" anchorX="center" outlineWidth={0.2} outlineColor="#000000">
                                INNOVATION LAB
                            </Text>
                        </group>

                        <group key="nav-void" position={[-80, 40, -120]} onClick={() => handleGalaxyClick('void')}>
                            <VoidDimension position={[0, 0, 0]} scale={0.85} />
                            <Text position={[0, 25, 0]} fontSize={5} color="#ff0000" anchorX="center" outlineWidth={0.2} outlineColor="#000000">
                                DEV REPOSITORY
                            </Text>
                        </group>
                    </>
                )}

                {/* From NEBULA - show main, quantum, void */}
                {activeGalaxy === 'nebula' && (
                    <>
                        <group key="nav-main-from-nebula" position={[100, 0, 80]} onClick={() => handleGalaxyClick('main')}>
                            <SpiralGalaxy />
                            {/* Glowing marker sphere */}
                            <mesh position={[0, 0, 0]}>
                                <sphereGeometry args={[8, 32, 32]} />
                                <meshBasicMaterial color="#ff8844" transparent opacity={0.3} />
                            </mesh>
                            <pointLight position={[0, 0, 0]} intensity={25} color="#ff8844" distance={150} />
                            <Text position={[0, 20, 0]} fontSize={6} color="#ff8844" anchorX="center" outlineWidth={0.3} outlineColor="#000000">
                                IDENTITY CORE
                            </Text>
                        </group>

                        <group key="nav-quantum-from-nebula" position={[200, -20, 180]} onClick={() => handleGalaxyClick('quantum')}>
                            <QuantumRealm position={[0, 0, 0]} scale={2.0} />
                            <pointLight position={[0, 0, 0]} intensity={25} color="#00ffff" distance={150} />
                            <Text position={[0, 25, 0]} fontSize={6} color="#00ffff" anchorX="center" outlineWidth={0.3} outlineColor="#000000">
                                INNOVATION LAB
                            </Text>
                        </group>

                        <group key="nav-void-from-nebula" position={[20, 40, -40]} onClick={() => handleGalaxyClick('void')}>
                            <VoidDimension position={[0, 0, 0]} scale={1.8} />
                            <mesh position={[0, 0, 0]}>
                                <sphereGeometry args={[9, 32, 32]} />
                                <meshBasicMaterial color="#dd3300" transparent opacity={0.3} />
                            </mesh>
                            <pointLight position={[0, 0, 0]} intensity={25} color="#ff0000" distance={150} />
                            <Text position={[0, 22, 0]} fontSize={6} color="#ff0000" anchorX="center" outlineWidth={0.3} outlineColor="#000000">
                                DEV REPOSITORY
                            </Text>
                        </group>
                    </>
                )}

                {/* From QUANTUM - show main, nebula, void */}
                {activeGalaxy === 'quantum' && (
                    <>
                        <group key="nav-main-from-quantum" position={[-100, 20, -100]} onClick={() => handleGalaxyClick('main')}>
                            <SpiralGalaxy />
                            <mesh position={[0, 0, 0]}>
                                <sphereGeometry args={[8, 32, 32]} />
                                <meshBasicMaterial color="#ff8844" transparent opacity={0.3} />
                            </mesh>
                            <pointLight position={[0, 0, 0]} intensity={25} color="#ff8844" distance={150} />
                            <Text position={[0, 20, 0]} fontSize={6} color="#ff8844" anchorX="center" outlineWidth={0.3} outlineColor="#000000">
                                IDENTITY CORE
                            </Text>
                        </group>

                        <group key="nav-nebula-from-quantum" position={[-200, 20, -180]} onClick={() => handleGalaxyClick('nebula')}>
                            <NebulaGalaxy position={[0, 0, 0]} scale={1.5} />
                            <mesh position={[0, 0, 0]}>
                                <sphereGeometry args={[8, 32, 32]} />
                                <meshBasicMaterial color="#cc00ff" transparent opacity={0.3} />
                            </mesh>
                            <pointLight position={[0, 0, 0]} intensity={25} color="#cc00ff" distance={150} />
                            <Text position={[0, 20, 0]} fontSize={6} color="#cc00ff" anchorX="center" outlineWidth={0.3} outlineColor="#000000">
                                INTELLECTUAL HUB
                            </Text>
                        </group>

                        <group key="nav-void-from-quantum" position={[-180, 60, -220]} onClick={() => handleGalaxyClick('void')}>
                            <VoidDimension position={[0, 0, 0]} scale={1.8} />
                            <pointLight position={[0, 0, 0]} intensity={25} color="#ff0000" distance={150} />
                            <Text position={[0, 22, 0]} fontSize={6} color="#ff0000" anchorX="center" outlineWidth={0.3} outlineColor="#000000">
                                DEV REPOSITORY
                            </Text>
                        </group>
                    </>
                )}

                {/* From VOID - show main, nebula, quantum */}
                {activeGalaxy === 'void' && (
                    <>
                        <group key="nav-main-from-void" position={[80, -40, 120]} onClick={() => handleGalaxyClick('main')}>
                            <SpiralGalaxy />
                            <mesh position={[0, 0, 0]}>
                                <sphereGeometry args={[8, 32, 32]} />
                                <meshBasicMaterial color="#ff8844" transparent opacity={0.3} />
                            </mesh>
                            <pointLight position={[0, 0, 0]} intensity={25} color="#ff8844" distance={150} />
                            <Text position={[0, 20, 0]} fontSize={6} color="#ff8844" anchorX="center" outlineWidth={0.3} outlineColor="#000000">
                                IDENTITY CORE
                            </Text>
                        </group>

                        <group key="nav-nebula-from-void" position={[-20, -40, 40]} onClick={() => handleGalaxyClick('nebula')}>
                            <NebulaGalaxy position={[0, 0, 0]} scale={1.5} />
                            <pointLight position={[0, 0, 0]} intensity={25} color="#cc00ff" distance={150} />
                            <Text position={[0, 20, 0]} fontSize={6} color="#cc00ff" anchorX="center" outlineWidth={0.3} outlineColor="#000000">
                                INTELLECTUAL HUB
                            </Text>
                        </group>

                        <group key="nav-quantum-from-void" position={[180, -60, 220]} onClick={() => handleGalaxyClick('quantum')}>
                            <QuantumRealm position={[0, 0, 0]} scale={2.0} />
                            <pointLight position={[0, 0, 0]} intensity={25} color="#00ffff" distance={150} />
                            <Text position={[0, 25, 0]} fontSize={6} color="#00ffff" anchorX="center" outlineWidth={0.3} outlineColor="#000000">
                                INNOVATION LAB
                            </Text>
                        </group>
                    </>
                )}

                {/* Camera transition controller */}
                <CameraController activeGalaxy={activeGalaxy} />

                {/* Floating Spaceship Swarm */}
                <SpaceshipSwarm />

                {/* Lighting */}
                <ambientLight intensity={0.2} color="#ffffff" />
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
