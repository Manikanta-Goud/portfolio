import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function VoidDimension({ position = [0, 0, 0], scale = 1 }) {
    const ringRef = useRef()
    const shardsRef = useRef()
    const cloudRef = useRef()

    const shards = useMemo(() => {
        return [...Array(60)].map((_, i) => ({
            pos: [
                (Math.random() - 0.5) * 60 * scale,
                (Math.random() - 0.5) * 60 * scale,
                (Math.random() - 0.5) * 60 * scale
            ],
            rot: [Math.random() * Math.PI, Math.random() * Math.PI, 0],
            scale: Math.random() * 0.4 + 0.1
        }))
    }, [scale])

    useFrame((state) => {
        const t = state.clock.getElapsedTime()
        if (ringRef.current) {
            ringRef.current.rotation.y = t * 0.5
            ringRef.current.rotation.x = t * 0.3
        }
        if (shardsRef.current) {
            shardsRef.current.rotation.y = -t * 0.15
            shardsRef.current.rotation.z = t * 0.05
        }
        if (cloudRef.current) {
            cloudRef.current.rotation.y = t * 0.04
        }
    })

    return (
        <group position={position}>
            {/* The Void Heart - Black Sphere with Intense Internal Glow */}
            <mesh>
                <sphereGeometry args={[4 * scale, 32, 32]} />
                <meshBasicMaterial color="#000000" />
            </mesh>
            <mesh>
                <sphereGeometry args={[4.2 * scale, 32, 32]} />
                <meshBasicMaterial color="#ff0000" transparent opacity={0.3} blending={THREE.AdditiveBlending} />
            </mesh>

            {/* Cinematic Event Horizon Disks */}
            <group ref={ringRef}>
                <mesh rotation={[Math.PI / 2, 0, 0]}>
                    <torusGeometry args={[6 * scale, 0.15 * scale, 16, 120]} />
                    <meshStandardMaterial color="#ff0000" transparent opacity={0.9} blending={THREE.AdditiveBlending} emissive="#ff0000" emissiveIntensity={5} />
                </mesh>
                <mesh rotation={[0, Math.PI / 2, 0]}>
                    <torusGeometry args={[7.5 * scale, 0.08 * scale, 16, 120]} />
                    <meshStandardMaterial color="#ff3300" transparent opacity={0.6} blending={THREE.AdditiveBlending} emissive="#ff3300" emissiveIntensity={3} />
                </mesh>
                <mesh rotation={[Math.PI / 4, Math.PI / 4, 0]}>
                    <torusGeometry args={[9 * scale, 0.05 * scale, 16, 120]} />
                    <meshStandardMaterial color="#550000" transparent opacity={0.4} blending={THREE.AdditiveBlending} emissive="#ff0000" emissiveIntensity={1} />
                </mesh>
            </group>

            {/* Binary / Tech Grid Floor (Conceptual) */}
            <gridHelper args={[100 * scale, 20]} position={[0, -20 * scale, 0]} rotation={[0, 0, 0]}>
                <meshBasicMaterial color="#330000" transparent opacity={0.2} />
            </gridHelper>

            {/* Broken Reality Shards - Obsidian Geometric Fragments */}
            <group ref={shardsRef}>
                {shards.map((s, i) => (
                    <mesh key={i} position={s.pos} rotation={s.rot} scale={s.scale}>
                        <octahedronGeometry args={[1, 0]} />
                        <meshStandardMaterial
                            color="#110000"
                            emissive="#ff0000"
                            emissiveIntensity={0.8}
                            roughness={0}
                            metalness={1}
                        />
                    </mesh>
                ))}
            </group>

            {/* Gravity Distortion Shells (Cinematic Pulses) */}
            {[...Array(4)].map((_, i) => (
                <GravityShell key={i} delay={i * 2.5} scale={scale} />
            ))}

            {/* Massive Volumetric Void Clouds */}
            <group ref={cloudRef}>
                {[...Array(20)].map((_, i) => (
                    <mesh
                        key={i}
                        position={[
                            Math.sin(i * 1.8) * 25 * scale,
                            Math.cos(i * 1.1) * 15 * scale,
                            Math.cos(i * 1.8) * 25 * scale
                        ]}
                    >
                        <sphereGeometry args={[15 * scale, 16, 16]} />
                        <meshBasicMaterial
                            color="#330000"
                            transparent
                            opacity={0.12}
                            blending={THREE.AdditiveBlending}
                            side={THREE.BackSide}
                        />
                    </mesh>
                ))}
            </group>

            {/* Tech Streams / Data Lines */}
            {[...Array(15)].map((_, i) => (
                <mesh
                    key={`tech-line-${i}`}
                    position={[
                        (Math.random() - 0.5) * 80 * scale,
                        (Math.random() - 0.5) * 80 * scale,
                        (Math.random() - 0.5) * 80 * scale
                    ]}
                    rotation={[0, 0, Math.random() * Math.PI]}
                >
                    <boxGeometry args={[0.05, 40 * scale, 0.05]} />
                    <meshBasicMaterial color="#ff0000" transparent opacity={0.3} blending={THREE.AdditiveBlending} />
                </mesh>
            ))}

            <pointLight intensity={40} color="#ff0000" distance={200 * scale} decay={2} />
        </group>
    )
}

function GravityShell({ delay, scale }) {
    const shellRef = useRef()
    useFrame((state) => {
        const t = (state.clock.getElapsedTime() + delay) % 10
        if (shellRef.current) {
            shellRef.current.scale.setScalar(1 + t * 5 * scale)
            shellRef.current.material.opacity = Math.max(0, 0.15 - t / 60)
        }
    })

    return (
        <mesh ref={shellRef}>
            <sphereGeometry args={[1, 32, 32]} />
            <meshBasicMaterial color="#ff0000" transparent opacity={0} side={THREE.BackSide} />
        </mesh>
    )
}
