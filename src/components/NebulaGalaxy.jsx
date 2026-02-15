import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function NebulaGalaxy({ position = [0, 0, 0], scale = 1 }) {
    const cloudRef = useRef()
    const particlesRef = useRef()
    const lightningRef = useRef()

    const { positions, colors, sizes } = useMemo(() => {
        const count = 12000 // Increased density
        const pos = new Float32Array(count * 3)
        const cols = new Float32Array(count * 3)
        const szs = new Float32Array(count)
        const palette = [
            new THREE.Color('#ff00ff'),
            new THREE.Color('#00ffff'),
            new THREE.Color('#ff0088'),
            new THREE.Color('#8800ff'),
            new THREE.Color('#4400ff')
        ]

        for (let i = 0; i < count; i++) {
            const i3 = i * 3
            const r = (Math.pow(Math.random(), 2)) * 40 * scale
            const t = Math.random() * Math.PI * 2
            const p = Math.random() * Math.PI

            pos[i3] = Math.sin(p) * Math.cos(t) * r
            pos[i3 + 1] = (Math.random() - 0.5) * 15 * scale + Math.sin(r * 0.15) * 8
            pos[i3 + 2] = Math.sin(p) * Math.sin(t) * r

            const mixedColor = palette[Math.floor(Math.random() * palette.length)].clone().lerp(new THREE.Color('#ffffff'), Math.random() * 0.3)
            cols[i3] = mixedColor.r
            cols[i3 + 1] = mixedColor.g
            cols[i3 + 2] = mixedColor.b

            szs[i] = Math.random() * 5 + 0.5
        }
        return { positions: pos, colors: cols, sizes: szs }
    }, [scale])

    useFrame((state) => {
        const t = state.clock.getElapsedTime()
        if (cloudRef.current) cloudRef.current.rotation.y = t * 0.06
        if (particlesRef.current) {
            particlesRef.current.rotation.y = -t * 0.04
            particlesRef.current.position.y = Math.sin(t * 0.4) * 3
        }

        // Random Lightning Flash (More intense)
        if (lightningRef.current) {
            const isFlashing = Math.random() > 0.98
            if (isFlashing) {
                lightningRef.current.intensity = 35 + Math.random() * 25
            } else {
                lightningRef.current.intensity *= 0.85 // Fade out
            }
        }
    })

    return (
        <group position={position}>
            {/* Core Intense Glow */}
            <mesh>
                <sphereGeometry args={[3 * scale, 32, 32]} />
                <meshBasicMaterial color="#ff00ff" transparent opacity={0.8} blending={THREE.AdditiveBlending} />
            </mesh>

            {/* Massive Volumetric Clouds */}
            <group ref={cloudRef}>
                {[...Array(30)].map((_, i) => (
                    <mesh
                        key={i}
                        position={[
                            Math.sin(i * 1.4) * 18 * scale,
                            Math.cos(i * 2.1) * 8 * scale,
                            Math.cos(i * 1.4) * 18 * scale
                        ]}
                    >
                        <sphereGeometry args={[Math.random() * 12 * scale + 6, 16, 16]} />
                        <meshBasicMaterial
                            color={i % 2 === 0 ? "#ff00ff" : "#00ffff"}
                            transparent
                            opacity={0.04}
                            blending={THREE.AdditiveBlending}
                            side={THREE.BackSide}
                        />
                    </mesh>
                ))}
            </group>

            {/* Cinematic Particle System */}
            <points ref={particlesRef}>
                <bufferGeometry>
                    <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
                    <bufferAttribute attach="attributes-color" count={colors.length / 3} array={colors} itemSize={3} />
                    <bufferAttribute attach="attributes-size" count={sizes.length} array={sizes} itemSize={1} />
                </bufferGeometry>
                <pointsMaterial
                    size={0.6}
                    vertexColors={true}
                    transparent
                    opacity={0.9}
                    blending={THREE.AdditiveBlending}
                    sizeAttenuation={true}
                />
            </points>

            {/* Lightning & Ambient Light Source */}
            <pointLight
                ref={lightningRef}
                intensity={0}
                color="#00ffff"
                distance={200 * scale}
                decay={2}
            />
            <pointLight intensity={15} color="#ff00ff" distance={100 * scale} />
            <pointLight position={[20 * scale, 10 * scale, 0]} intensity={10} color="#8800ff" distance={80 * scale} />
        </group>
    )
}
