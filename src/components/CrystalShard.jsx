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
            onClick={(e) => {
                e.stopPropagation()
                if (onClick) onClick(id)
            }}
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
                        <mesh scale={hovered ? 0.6 : 1.3}>
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

            {/* FLOATING LABEL - Always visible above crystal */}
            <group position={[0, 6, 0]} ref={labelRef}>
                <mesh position={[0, -3, 0]}>
                    <cylinderGeometry args={[0.08, 0.08, 6, 16]} />
                    <meshBasicMaterial color={color} transparent opacity={hovered ? 1 : 0.8} />
                </mesh>

                <mesh position={[0, 0, 0]}>
                    <sphereGeometry args={[0.15, 16, 16]} />
                    <meshBasicMaterial color={color} />
                </mesh>

                <mesh position={[0, 0.6, 0]}>
                    <planeGeometry args={[title.length * 0.25 + 0.8, 0.7]} />
                    <meshBasicMaterial color="#000000" transparent opacity={0.85} />
                </mesh>

                {hovered && (
                    <mesh position={[0, 0.6, 0.005]}>
                        <planeGeometry args={[title.length * 0.25 + 0.9, 0.8]} />
                        <meshBasicMaterial color={color} transparent opacity={0.5} />
                    </mesh>
                )}

                <Text
                    position={[0, 0.6, 0.01]}
                    fontSize={0.35}
                    color={hovered ? color : '#ffffff'}
                    anchorX="center"
                    anchorY="middle"
                    outlineWidth={0.02}
                    outlineColor="#000000"
                    fontWeight="bold"
                >
                    {title}
                </Text>
            </group>
        </group>
    )
}
