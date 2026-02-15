import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Trail, Float } from '@react-three/drei'
import * as THREE from 'three'

const SHIP_COUNT = 8

// Premium Imperial Palette (Ash & Light White)
const PALETTE = {
    hull: '#f8f9fa',      // Pristine Light White
    hullSteel: '#ced4da', // Ash / Cool Gray Steel
    greeble: '#adb5bd',   // Medium Ash for mechanical detail
    thruster: '#00d2d3',  // Cyan/Atmospheric Blue
    window: '#ffd32a',    // Vibrant Lit Window
    signal: '#ff3f34'     // Red Signal Light
}

// Advanced Greeble System for Capital Class ships
function MegaGreebles({ count = 50, area = [1, 1, 1], color = PALETTE.greeble }) {
    const items = useMemo(() => {
        return [...Array(count)].map((_, i) => ({
            pos: [
                (Math.random() - 0.5) * area[0],
                (Math.random() - 0.5) * area[1],
                (Math.random() - 0.5) * area[2]
            ],
            scale: [
                Math.random() * 0.15 + 0.02,
                Math.random() * 0.15 + 0.02,
                Math.random() * 0.15 + 0.01
            ],
            type: Math.random() > 0.3 ? 'box' : 'cyl'
        }))
    }, [count, area])

    return (
        <group>
            {items.map((item, i) => (
                <mesh key={i} position={item.pos} scale={item.scale}>
                    {item.type === 'box' ? <boxGeometry /> : <cylinderGeometry args={[1, 1, 1, 6]} />}
                    <meshStandardMaterial color={color} roughness={0.6} metalness={0.8} />
                </mesh>
            ))}
        </group>
    )
}

function OmniCapitalShip() {
    return (
        <group>
            {/* 1. FORWARD SECTION: Broad Triangular Wedge */}
            <mesh position={[0, 0, 2.5]} rotation={[Math.PI / 2, 0, 0]}>
                <coneGeometry args={[1.5, 3, 4]} />
                <meshStandardMaterial color={PALETTE.hull} roughness={0.2} metalness={0.2} emissive={'#ffffff'} emissiveIntensity={0.05} />
            </mesh>
            <group position={[0, 0, 2.5]}>
                <MegaGreebles count={40} area={[1, 0.2, 2]} />
            </group>

            {/* 2. MID SECTION: Wide Rectangular Superstructure */}
            <mesh position={[0, 0, 0]}>
                <boxGeometry args={[2, 0.8, 3]} />
                <meshStandardMaterial color={PALETTE.hull} roughness={0.2} metalness={0.2} />
            </mesh>
            {/* Layered Surface Plating */}
            {[1, -1].map(side => (
                <group key={side} position={[side * 1, 0, 0]}>
                    <mesh>
                        <boxGeometry args={[0.2, 0.7, 2.8]} />
                        <meshStandardMaterial color={PALETTE.hullSteel} />
                    </mesh>
                    <MegaGreebles count={100} area={[0.1, 0.6, 2.8]} />
                </group>
            ))}

            {/* 3. REAR SECTION: Narrowing transition to Engine Ring */}
            <mesh position={[0, 0, -2]}>
                <boxGeometry args={[1.2, 0.5, 1.5]} />
                <meshStandardMaterial color={PALETTE.hull} />
            </mesh>

            {/* 4. ENGINE MODULE: Horizontal Circular Ring */}
            <group position={[0, 0, -3.2]}>
                <mesh position={[0, 0, 0.5]}>
                    <boxGeometry args={[0.4, 0.2, 1.2]} />
                    <meshStandardMaterial color={PALETTE.hullSteel} />
                </mesh>
                <mesh rotation={[Math.PI / 2, 0, 0]}>
                    <torusGeometry args={[0.9, 0.15, 12, 40]} />
                    <meshStandardMaterial color={PALETTE.hullSteel} metalness={1} roughness={0.2} emissive={PALETTE.thruster} emissiveIntensity={0.2} />
                </mesh>
                <mesh rotation={[Math.PI / 2, 0, 0]}>
                    <torusGeometry args={[0.85, 0.05, 8, 32]} />
                    <meshBasicMaterial color={PALETTE.thruster} transparent opacity={0.6} />
                </mesh>
            </group>

            {/* 5. COMMAND TOWER: Offset multi-tier bridge */}
            <group position={[0.4, 0.7, -1]} scale={0.8}>
                <mesh position={[0, 0, 0]}>
                    <boxGeometry args={[0.6, 0.3, 0.5]} />
                    <meshStandardMaterial color={PALETTE.hullSteel} />
                </mesh>
                <mesh position={[0, 0.2, 0.1]}>
                    <boxGeometry args={[0.4, 0.2, 0.3]} />
                    <meshStandardMaterial color={PALETTE.hull} />
                </mesh>
                {[...Array(12)].map((_, i) => (
                    <mesh key={i} position={[(i % 3 - 1) * 0.1, 0.25, 0.25]}>
                        <boxGeometry args={[0.05, 0.02, 0.01]} />
                        <meshBasicMaterial color={PALETTE.window} />
                    </mesh>
                ))}
            </group>

            {/* 6. UNDERSIDE: Triangular Cut-in Cavity */}
            <group position={[0, -0.45, 0]}>
                <mesh rotation={[Math.PI / 2, 0, 0]}>
                    <coneGeometry args={[1, 2, 3]} />
                    <meshStandardMaterial color={PALETTE.greeble} emissive={PALETTE.signal} emissiveIntensity={0.1} />
                </mesh>
                <MegaGreebles count={50} area={[1.5, 0.1, 2]} color="#111" />
            </group>
        </group>
    )
}

function SharpJet({ color }) {
    const thrusterRef = useRef()

    useFrame(({ clock }) => {
        const t = clock.getElapsedTime()
        if (thrusterRef.current) {
            const pulse = 1 + Math.sin(t * 15) * 0.15
            thrusterRef.current.scale.set(pulse, pulse, 1.2 + pulse)
        }
    })

    return (
        <group>
            <OmniCapitalShip />
            <group position={[0, 0, -3.2]}>
                <pointLight intensity={3} color={PALETTE.thruster} distance={15} />
                <mesh ref={thrusterRef} rotation={[Math.PI / 2, 0, 0]}>
                    <cylinderGeometry args={[0.8, 0.7, 0.5, 16]} />
                    <meshBasicMaterial color={PALETTE.thruster} transparent opacity={0.3} blending={THREE.AdditiveBlending} />
                </mesh>
            </group>
            <pointLight position={[-10, 10, 10]} intensity={2} color="#ffffff" distance={100} />
        </group>
    )
}

function Spaceship({ color, offset }) {
    const meshRef = useRef()

    const path = useMemo(() => ({
        radiusX: 80 + Math.random() * 40,
        radiusZ: 70 + Math.random() * 50,
        yAmp: 20 + Math.random() * 20,
        speed: 0.03 + Math.random() * 0.05
    }), [])

    useFrame(({ clock }) => {
        const t = clock.getElapsedTime() * path.speed + offset
        const x = Math.sin(t) * path.radiusX
        const z = Math.cos(t * 0.8) * path.radiusZ
        const y = Math.sin(t * 0.4) * path.yAmp

        if (meshRef.current) {
            const lastPos = meshRef.current.position.clone()
            meshRef.current.position.set(x, y, z)
            const dir = new THREE.Vector3().subVectors(meshRef.current.position, lastPos).normalize()
            if (dir.length() > 0.01) {
                const targetRot = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), dir)
                meshRef.current.quaternion.slerp(targetRot, 0.015)
            }
        }
    })

    return (
        <group ref={meshRef}>
            <Float speed={0.8} rotationIntensity={0.1} floatIntensity={0.2}>
                <SharpJet color={color} />
                <Trail width={1.5} length={20} color={PALETTE.thruster} attenuation={(t) => t * t}>
                    <mesh position={[0, 0, -3.2]} visible={false}><sphereGeometry args={[0.1]} /></mesh>
                </Trail>
            </Float>
        </group>
    )
}

export default function SpaceshipSwarm() {
    const ships = useMemo(() => {
        return [...Array(SHIP_COUNT)].map((_, i) => ({
            id: i,
            color: PALETTE.thruster,
            offset: Math.random() * 100
        }))
    }, [])

    return (
        <group>
            {ships.map((ship) => (
                <Spaceship key={ship.id} color={ship.color} offset={ship.offset} />
            ))}
        </group>
    )
}
