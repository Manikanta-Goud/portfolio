import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function QuantumRealm({ position = [0, 0, 0], scale = 1 }) {
    const groupRef = useRef()
    const matrixRef = useRef()
    const coreRef = useRef()

    // Create a "Synaptic Data Web" instead of lines
    const { nodes, connections } = useMemo(() => {
        const nodes = []
        const count = 50
        const r = 15 * scale

        for (let i = 0; i < count; i++) {
            nodes.push({
                pos: new THREE.Vector3(
                    (Math.random() - 0.5) * r * 2.5,
                    (Math.random() - 0.5) * r * 2.5,
                    (Math.random() - 0.5) * r * 2.5
                ),
                speed: Math.random() * 0.5 + 0.2
            })
        }

        const connections = []
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                if (nodes[i].pos.distanceTo(nodes[j].pos) < 10 * scale) {
                    connections.push([i, j])
                }
            }
        }

        return { nodes, connections }
    }, [scale])

    useFrame((state) => {
        const t = state.clock.getElapsedTime()

        if (groupRef.current) {
            groupRef.current.rotation.y = t * 0.1
        }

        if (coreRef.current) {
            coreRef.current.rotation.x = t * 0.5
            coreRef.current.rotation.z = t * 0.3
            const s = 1.5 + Math.sin(t * 3) * 0.2
            coreRef.current.scale.set(s, s, s)
        }

        if (matrixRef.current) {
            matrixRef.current.rotation.y = -t * 0.05
        }
    })

    return (
        <group position={position}>
            {/* 1. THE GEODESIC CORE - A complex, glowing geometric lattice */}
            <mesh ref={coreRef}>
                <icosahedronGeometry args={[4 * scale, 1]} />
                <meshBasicMaterial
                    color="#00ffff"
                    wireframe
                    transparent
                    opacity={0.8}
                    blending={THREE.AdditiveBlending}
                />
            </mesh>

            {/* 2. INNER GLOW - Ensuring the center is "Sexy" and visible */}
            <mesh>
                <sphereGeometry args={[2 * scale, 32, 32]} />
                <meshBasicMaterial
                    color="#00ffff"
                    transparent
                    opacity={0.4}
                    blending={THREE.AdditiveBlending}
                />
            </mesh>

            {/* 3. SYNAPTIC WEB - Data nodes and connection beams */}
            <group ref={groupRef}>
                {nodes.map((node, i) => (
                    <mesh key={i} position={node.pos}>
                        <sphereGeometry args={[0.2 * scale, 8, 8]} />
                        <meshBasicMaterial color="#ffffff" />
                        <pointLight distance={10 * scale} intensity={0.5} color="#00ffff" />
                    </mesh>
                ))}

                {connections.map(([a, b], i) => (
                    <line key={i}>
                        <bufferGeometry>
                            <bufferAttribute
                                attach="attributes-position"
                                count={2}
                                array={new Float32Array([
                                    nodes[a].pos.x, nodes[a].pos.y, nodes[a].pos.z,
                                    nodes[b].pos.x, nodes[b].pos.y, nodes[b].pos.z
                                ])}
                                itemSize={3}
                            />
                        </bufferGeometry>
                        <lineBasicMaterial color="#00ffff" transparent opacity={0.15} blending={THREE.AdditiveBlending} />
                    </line>
                ))}
            </group>

            {/* 4. QUANTUM MATRIX - Hexagonal grid surrounding the realm */}
            <group ref={matrixRef}>
                <mesh>
                    <sphereGeometry args={[25 * scale, 16, 16]} />
                    <meshBasicMaterial
                        color="#00ffff"
                        wireframe
                        transparent
                        opacity={0.05}
                    />
                </mesh>
            </group>

            {/* 5. PROBABILITY RINGS - Clean, sharp rings */}
            {[...Array(4)].map((_, i) => (
                <QuantumRing key={i} delay={i * 2} scale={scale} />
            ))}

            <pointLight intensity={30} color="#00ffff" distance={150 * scale} decay={2} />
        </group>
    )
}

function QuantumRing({ delay, scale }) {
    const ringRef = useRef()
    useFrame((state) => {
        const t = (state.clock.getElapsedTime() + delay) % 8
        if (ringRef.current) {
            ringRef.current.scale.setScalar(t * 4 * scale)
            ringRef.current.material.opacity = Math.max(0, 0.5 - t / 8)
        }
    })

    return (
        <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.98, 1, 64]} />
            <meshBasicMaterial color="#00ffff" transparent opacity={0} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} />
        </mesh>
    )
}
