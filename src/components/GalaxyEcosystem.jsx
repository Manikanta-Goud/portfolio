import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function GalaxyEcosystem({
    position = [0, 0, 0],
    color = '#ff8844',
    name = 'GALAXY',
    onClick,
    scale = 1
}) {
    const groupRef = useRef()
    const blackHoleRef = useRef()
    const diskRef = useRef()
    const particlesRef = useRef()

    // Create particles for this ecosystem
    const { positions, colors, sizes } = useMemo(() => {
        const count = 5000
        const positions = new Float32Array(count * 3)
        const colors = new Float32Array(count * 3)
        const sizes = new Float32Array(count)

        const baseColor = new THREE.Color(color)

        for (let i = 0; i < count; i++) {
            const i3 = i * 3
            const radius = Math.random() * 20 * scale
            const theta = Math.random() * Math.PI * 2
            const phi = Math.random() * Math.PI

            positions[i3] = Math.sin(phi) * Math.cos(theta) * radius
            positions[i3 + 1] = (Math.random() - 0.5) * 2 * scale
            positions[i3 + 2] = Math.sin(phi) * Math.sin(theta) * radius

            colors[i3] = baseColor.r * (0.8 + Math.random() * 0.4)
            colors[i3 + 1] = baseColor.g * (0.8 + Math.random() * 0.4)
            colors[i3 + 2] = baseColor.b * (0.8 + Math.random() * 0.4)

            sizes[i] = Math.random() * 2 + 0.5
        }

        return { positions, colors, sizes }
    }, [color, scale])

    useFrame((state) => {
        const t = state.clock.getElapsedTime()

        if (diskRef.current) {
            diskRef.current.rotation.z = t * 0.2
        }

        if (particlesRef.current) {
            particlesRef.current.rotation.y = t * 0.05
        }

        if (blackHoleRef.current) {
            blackHoleRef.current.rotation.y = t * 0.3
        }
    })

    return (
        <group ref={groupRef} position={position} onClick={onClick}>
            {/* Mini Black Hole */}
            <mesh ref={blackHoleRef}>
                <sphereGeometry args={[1 * scale, 32, 32]} />
                <meshBasicMaterial color="#000000" />
            </mesh>

            {/* Photon ring */}
            <mesh>
                <sphereGeometry args={[1.1 * scale, 32, 32]} />
                <meshBasicMaterial
                    color={color}
                    transparent
                    opacity={0.9}
                    side={THREE.BackSide}
                />
            </mesh>

            {/* Accretion disk */}
            <group ref={diskRef}>
                <mesh rotation={[Math.PI / 2.5, 0, 0]}>
                    <ringGeometry args={[1.5 * scale, 6 * scale, 64]} />
                    <meshBasicMaterial
                        color={color}
                        transparent
                        opacity={0.7}
                        side={THREE.DoubleSide}
                        blending={THREE.AdditiveBlending}
                    />
                </mesh>
            </group>

            {/* Particles */}
            <points ref={particlesRef}>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        count={positions.length / 3}
                        array={positions}
                        itemSize={3}
                    />
                    <bufferAttribute
                        attach="attributes-color"
                        count={colors.length / 3}
                        array={colors}
                        itemSize={3}
                    />
                    <bufferAttribute
                        attach="attributes-size"
                        count={sizes.length}
                        array={sizes}
                        itemSize={1}
                    />
                </bufferGeometry>
                <pointsMaterial
                    size={0.3}
                    sizeAttenuation={true}
                    vertexColors={true}
                    blending={THREE.AdditiveBlending}
                    transparent={true}
                />
            </points>

            {/* Glow */}
            <mesh>
                <sphereGeometry args={[8 * scale, 32, 32]} />
                <meshBasicMaterial
                    color={color}
                    transparent
                    opacity={0.05}
                    side={THREE.BackSide}
                />
            </mesh>

            {/* Light */}
            <pointLight position={[0, 0, 0]} intensity={2} color={color} distance={30 * scale} />

            {/* Floating label */}
            <mesh position={[0, 10 * scale, 0]}>
                <sphereGeometry args={[0.5, 16, 16]} />
                <meshBasicMaterial color={color} />
            </mesh>
        </group>
    )
}
