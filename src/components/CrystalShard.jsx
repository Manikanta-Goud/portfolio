import React, { useRef, useMemo, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, Float, useTexture, Trail } from '@react-three/drei'
import * as THREE from 'three'

export default function CrystalShard({ radius, speed, phase, offsetZ, title, image, color = '#ffffff', id, onClick }) {
    const groupRef = useRef()
    const shardRef = useRef()
    const glowRef = useRef()
    const labelRef = useRef()
    const ringRef = useRef()
    const [hovered, setHovered] = useState(false)
    const texture = image ? useTexture(image) : null

    const rotationSpeed = useMemo(() => ({
        x: (Math.random() - 0.5) * 0.003,
        y: (Math.random() - 0.5) * 0.006,
    }), [])

    // Generate 4 mini shards for the "unfolding" effect
    const miniShards = useMemo(() => {
        return [...Array(4)].map(() => ({
            rotation: new THREE.Euler(Math.random(), Math.random(), Math.random()),
            position: new THREE.Vector3(
                (Math.random() - 0.5) * 0.2,
                (Math.random() - 0.5) * 0.2,
                (Math.random() - 0.5) * 0.2
            )
        }))
    }, [])

    useFrame((state) => {
        const t = state.clock.getElapsedTime()

        if (groupRef.current) {
            const angle = t * speed + phase
            groupRef.current.position.x = Math.cos(angle) * radius
            groupRef.current.position.z = Math.sin(angle) * radius
            groupRef.current.position.y = offsetZ
        }

        if (shardRef.current) {
            shardRef.current.rotation.x += rotationSpeed.x
            shardRef.current.rotation.y += rotationSpeed.y
        }

        if (ringRef.current) {
            ringRef.current.rotation.z = t * 0.5
            const targetScale = hovered ? 1.5 + Math.sin(t * 5) * 0.1 : 0
            ringRef.current.scale.setScalar(THREE.MathUtils.lerp(ringRef.current.scale.x, targetScale, 0.1))
        }

        if (glowRef.current) {
            glowRef.current.scale.setScalar(1 + Math.sin(t * 2 + phase) * 0.1)
        }

        if (labelRef.current) {
            const pulse = hovered ? 1.2 : 1 + Math.sin(t * 3) * 0.05
            labelRef.current.scale.setScalar(THREE.MathUtils.lerp(labelRef.current.scale.x, pulse, 0.1))
        }

        // Animate mini shards positions
        miniShards.forEach((ms, i) => {
            const mesh = groupRef.current.getObjectByName(`miniShard-${i}`)
            if (mesh) {
                const targetX = hovered ? (i % 2 === 0 ? 0.8 : -0.8) : 0
                const targetY = hovered ? (i < 2 ? 0.8 : -0.8) : 0
                const targetZ = hovered ? 0.5 : 0

                mesh.position.x = THREE.MathUtils.lerp(mesh.position.x, targetX, 0.1)
                mesh.position.y = THREE.MathUtils.lerp(mesh.position.y, targetY, 0.1)
                mesh.position.z = THREE.MathUtils.lerp(mesh.position.z, targetZ, 0.1)
            }
        })
    })

    return (
        <group
            ref={groupRef}
            onPointerOver={(e) => {
                e.stopPropagation()
                setHovered(true)
                document.body.style.cursor = 'pointer'
            }}
            onPointerOut={() => {
                setHovered(false)
                document.body.style.cursor = 'default'
            }}
        >
            <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.3}>

                {/* Holographic Scanning Ring */}
                <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
                    <ringGeometry args={[1.2, 1.3, 64]} />
                    <meshBasicMaterial
                        color={color}
                        transparent
                        opacity={0.8}
                        side={THREE.DoubleSide}
                        blending={THREE.AdditiveBlending}
                    />
                </mesh>

                <Trail
                    width={hovered ? 3 : 1.5}
                    length={8}
                    color={color}
                    attenuation={(t) => t * t}
                >
                    <group ref={shardRef}>
                        {/* Main Central Core */}
                        <mesh scale={hovered ? 0.6 : 1.3} onClick={(e) => {
                            e.stopPropagation()
                            if (onClick) onClick(id)
                        }}>
                            <icosahedronGeometry args={[0.8, 0]} />
                            <meshPhysicalMaterial
                                color={color}
                                metalness={0.98}
                                roughness={0.02}
                                transparent
                                opacity={0.98}
                                emissive={color}
                                emissiveIntensity={hovered ? 5 : 2}
                            />
                        </mesh>

                        {/* Unfolding Shards */}
                        {miniShards.map((ms, i) => (
                            <mesh
                                key={i}
                                name={`miniShard-${i}`}
                                scale={0.4}
                                rotation={ms.rotation}
                            >
                                <icosahedronGeometry args={[1, 0]} />
                                <meshStandardMaterial
                                    color={color}
                                    emissive={color}
                                    emissiveIntensity={hovered ? 3 : 1}
                                    transparent
                                    opacity={0.9}
                                />
                            </mesh>
                        ))}

                        {/* Title text on crystal */}
                        <Text
                            position={[0, 0, 0]}
                            fontSize={0.12}
                            color={color}
                            anchorX="center"
                            anchorY="middle"
                            outlineWidth={0.01}
                            outlineColor="#000000"
                            visible={!hovered}
                        >
                            {title}
                        </Text>
                    </group>
                </Trail>

                <pointLight position={[0, 0, 0]} intensity={hovered ? 4 : 1} color={color} distance={15} />

            </Float>

            {/* POLE AND LABEL - Always visible above crystal */}
            <group position={[0, 10, 0]} ref={labelRef}>
                {/* Hitbox for the pole - much wider than the visual pole */}
                <mesh position={[0, -5, 0]} visible={false} onClick={(e) => {
                    e.stopPropagation()
                    if (onClick) onClick(id)
                }}>
                    <cylinderGeometry args={[0.5, 0.5, 10, 8]} />
                    <meshBasicMaterial transparent opacity={0} />
                </mesh>

                {/* Visual Pole */}
                <mesh position={[0, -5, 0]}>
                    <cylinderGeometry args={[0.06, 0.12, 10, 16]} />
                    <meshStandardMaterial
                        color={color}
                        emissive={color}
                        emissiveIntensity={hovered ? 2 : 0.5}
                        transparent
                        opacity={hovered ? 1 : 0.6}
                    />
                </mesh>

                {/* Connection Sphere at the end of the pole */}
                <mesh position={[0, 0, 0]} onClick={(e) => {
                    e.stopPropagation()
                    if (onClick) onClick(id)
                }}>
                    <sphereGeometry args={[0.25, 16, 16]} />
                    <meshStandardMaterial
                        color={color}
                        emissive={color}
                        emissiveIntensity={hovered ? 5 : 1}
                    />
                </mesh>

                {/* Label Box / Background */}
                <mesh position={[0, 1, 0]} onClick={(e) => {
                    e.stopPropagation()
                    if (onClick) onClick(id)
                }}>
                    <planeGeometry args={[title.length * 0.25 + 1, 0.9]} />
                    <meshBasicMaterial color="#000000" transparent opacity={0.9} />
                </mesh>

                {/* Glowing border for Label */}
                {hovered && (
                    <mesh position={[0, 1, -0.01]}>
                        <planeGeometry args={[title.length * 0.25 + 1.1, 1.0]} />
                        <meshBasicMaterial color={color} transparent opacity={0.6} />
                    </mesh>
                )}

                <Text
                    position={[0, 1, 0.05]}
                    fontSize={0.4}
                    color={hovered ? color : '#ffffff'}
                    anchorX="center"
                    anchorY="middle"
                    outlineWidth={0.03}
                    outlineColor="#000000"
                    fontWeight="bold"
                    onClick={(e) => {
                        e.stopPropagation()
                        if (onClick) onClick(id)
                    }}
                >
                    {title}
                </Text>

                {/* Decorative scanning line on label when hovered */}
                {hovered && (
                    <mesh position={[0, 1, 0.06]}>
                        <planeGeometry args={[title.length * 0.25 + 0.8, 0.03]} />
                        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={10} />
                    </mesh>
                )}
            </group>
        </group>
    )
}
