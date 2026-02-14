import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function SpiralGalaxy() {
    const particlesRef = useRef()

    const { positions, colors, sizes } = useMemo(() => {
        const count = 15000 // HUGE amount of particles
        const positions = new Float32Array(count * 3)
        const colors = new Float32Array(count * 3)
        const sizes = new Float32Array(count)

        // Color palette for asteroids and dust
        const colorPalette = [
            new THREE.Color('#ff6b35'), // Orange
            new THREE.Color('#f7931e'), // Bright orange
            new THREE.Color('#ffd700'), // Gold
            new THREE.Color('#ffaa00'), // Yellow-orange
            new THREE.Color('#8b4513'), // Brown
            new THREE.Color('#a0522d'), // Sienna
            new THREE.Color('#cd853f'), // Peru
            new THREE.Color('#daa520'), // Goldenrod
            new THREE.Color('#ff8c00'), // Dark orange
            new THREE.Color('#ffa500'), // Orange
            new THREE.Color('#b8860b'), // Dark goldenrod
            new THREE.Color('#d2691e'), // Chocolate
            new THREE.Color('#ffffff'), // White (hot center)
            new THREE.Color('#fffacd'), // Lemon chiffon
            new THREE.Color('#ffe4b5'), // Moccasin
        ]

        for (let i = 0; i < count; i++) {
            const i3 = i * 3

            // Spiral arm calculation - tighter spiral
            const radius = Math.random() * 50 // 0 to 50 units from center
            const spinAngle = radius * 0.5 // More spiral twist
            const branchAngle = ((i % 5) / 5) * Math.PI * 2 // 5 spiral arms

            // Random scatter within arms - MORE variation for asteroid look
            const randomX = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 2
            const randomY = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.8
            const randomZ = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 2

            positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX
            positions[i3 + 1] = randomY
            positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ

            // Assign random colors from palette
            const distanceRatio = radius / 50
            let selectedColor

            if (distanceRatio < 0.15) {
                // Very center - bright white/yellow (hot core)
                selectedColor = colorPalette[Math.floor(Math.random() * 3) + 12] // White, lemon, moccasin
            } else if (distanceRatio < 0.35) {
                // Inner region - gold/yellow/bright orange
                selectedColor = colorPalette[Math.floor(Math.random() * 4) + 1] // Bright oranges and golds
            } else if (distanceRatio < 0.6) {
                // Middle region - orange/brown mix
                selectedColor = colorPalette[Math.floor(Math.random() * 6) + 4] // Browns and oranges
            } else {
                // Outer region - darker browns and oranges
                selectedColor = colorPalette[Math.floor(Math.random() * 5) + 6] // Dark oranges and browns
            }

            colors[i3] = selectedColor.r
            colors[i3 + 1] = selectedColor.g
            colors[i3 + 2] = selectedColor.b

            // Varied sizes for asteroid look - some big, some tiny
            sizes[i] = Math.random() * 3 + 0.3
        }

        return { positions, colors, sizes }
    }, [])

    useFrame((state) => {
        if (particlesRef.current) {
            // Slow rotation like a real galaxy
            particlesRef.current.rotation.y = state.clock.getElapsedTime() * 0.03
        }
    })

    return (
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
                size={0.4}
                sizeAttenuation={true}
                depthWrite={false}
                vertexColors={true}
                blending={THREE.AdditiveBlending}
                transparent={true}
                opacity={0.9}
                map={createAsteroidTexture()}
            />
        </points>
    )
}

// Create a texture that looks like irregular asteroids instead of squares
function createAsteroidTexture() {
    const canvas = document.createElement('canvas')
    canvas.width = 32
    canvas.height = 32
    const ctx = canvas.getContext('2d')

    // Create irregular shape
    const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16)
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)')
    gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.8)')
    gradient.addColorStop(0.6, 'rgba(255, 255, 255, 0.3)')
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')

    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 32, 32)

    const texture = new THREE.CanvasTexture(canvas)
    return texture
}
