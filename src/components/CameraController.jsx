import React, { useState, useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Vector3 } from 'three'
import * as THREE from 'three'

export default function CameraController({ activeGalaxy, onTransitionComplete }) {
    const { camera, gl } = useThree()
    const [isTransitioning, setIsTransitioning] = useState(false)
    const transitionProgress = useRef(0)
    const startPos = useRef(new Vector3())
    const targetPos = useRef(new Vector3())
    const startLookAt = useRef(new Vector3(0, 0, 0))
    const targetLookAt = useRef(new Vector3())
    const warpTunnelRef = useRef()
    const warpSpeed = useRef(0)

    // Galaxy positions - where each galaxy IS located
    const galaxyLocations = {
        main: new Vector3(0, 0, 0),
        nebula: new Vector3(-100, 0, -80),
        quantum: new Vector3(100, -20, 100),
        void: new Vector3(-80, 40, -120)
    }

    // Camera positions - where to VIEW each galaxy FROM
    const cameraPositions = {
        main: new Vector3(30, 35, 40),
        nebula: new Vector3(-70, 20, -50),
        quantum: new Vector3(80, -10, 120),
        void: new Vector3(-60, 60, -100)
    }

    React.useEffect(() => {
        if (activeGalaxy && cameraPositions[activeGalaxy]) {
            startPos.current.copy(camera.position)
            targetPos.current.copy(cameraPositions[activeGalaxy])

            // Store where we're currently looking
            const currentLookAt = new Vector3()
            camera.getWorldDirection(currentLookAt)
            currentLookAt.multiplyScalar(50).add(camera.position)
            startLookAt.current.copy(currentLookAt)

            // Set where we want to look (at the galaxy)
            targetLookAt.current.copy(galaxyLocations[activeGalaxy])

            transitionProgress.current = 0
            warpSpeed.current = 0
            setIsTransitioning(true)
        }
    }, [activeGalaxy, camera])

    // CUSTOM SHADER for HYPERSPACE TUNNEL
    const warpShaderMaterial = useMemo(() => {
        return new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                warpSpeed: { value: 0 },
                color1: { value: new THREE.Color('#00ffff') },
                color2: { value: new THREE.Color('#ff00ff') },
                color3: { value: new THREE.Color('#ffffff') }
            },
            vertexShader: `
        varying vec2 vUv;
        varying vec3 vPosition;
        uniform float time;
        uniform float warpSpeed;
        
        void main() {
          vUv = uv;
          vPosition = position;
          
          // Stretch vertices based on warp speed
          vec3 pos = position;
          float dist = length(pos.xy);
          pos.z -= dist * warpSpeed * 50.0;
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
            fragmentShader: `
        uniform float time;
        uniform float warpSpeed;
        uniform vec3 color1;
        uniform vec3 color2;
        uniform vec3 color3;
        varying vec2 vUv;
        varying vec3 vPosition;
        
        void main() {
          vec2 center = vUv - 0.5;
          float dist = length(center);
          float angle = atan(center.y, center.x);
          
          // Spiral pattern
          float spiral = angle * 5.0 + dist * 20.0 - time * 10.0 * warpSpeed;
          float pattern = sin(spiral) * 0.5 + 0.5;
          
          // Radial lines
          float lines = sin(angle * 50.0 + time * 20.0 * warpSpeed);
          lines = smoothstep(0.8, 1.0, lines);
          
          // Color mixing based on distance
          vec3 color;
          if (dist < 0.3) {
            color = mix(color3, color1, dist / 0.3);
          } else if (dist < 0.6) {
            color = mix(color1, color2, (dist - 0.3) / 0.3);
          } else {
            color = color2;
          }
          
          // Add pattern and lines
          color *= pattern * 0.5 + 0.5;
          color += lines * 0.5;
          
          // Fade edges
          float alpha = (1.0 - smoothstep(0.3, 0.5, dist)) * warpSpeed;
          
          gl_FragColor = vec4(color, alpha);
        }
      `,
            transparent: true,
            side: THREE.DoubleSide,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        })
    }, [])

    // STREAKING STARS
    const { starPositions, starVelocities, starColors, starSizes } = useMemo(() => {
        const count = 5000
        const starPositions = new Float32Array(count * 3)
        const starVelocities = new Float32Array(count * 3)
        const starColors = new Float32Array(count * 3)
        const starSizes = new Float32Array(count)

        for (let i = 0; i < count; i++) {
            const i3 = i * 3
            const radius = Math.random() * 150 + 30
            const theta = Math.random() * Math.PI * 2
            const phi = (Math.random() - 0.5) * Math.PI

            starPositions[i3] = Math.cos(theta) * Math.cos(phi) * radius
            starPositions[i3 + 1] = Math.sin(phi) * radius
            starPositions[i3 + 2] = Math.sin(theta) * Math.cos(phi) * radius

            const speed = Math.random() * 3 + 1
            starVelocities[i3] = starPositions[i3] * speed * 0.02
            starVelocities[i3 + 1] = starPositions[i3 + 1] * speed * 0.02
            starVelocities[i3 + 2] = starPositions[i3 + 2] * speed * 0.02

            const hue = Math.random()
            const color = new THREE.Color().setHSL(hue, 1.0, 0.6)
            starColors[i3] = color.r
            starColors[i3 + 1] = color.g
            starColors[i3 + 2] = color.b

            starSizes[i] = Math.random() * 8 + 2
        }

        return { starPositions, starVelocities, starColors, starSizes }
    }, [])

    useFrame((state, delta) => {
        if (isTransitioning) {
            transitionProgress.current += delta * 0.2

            if (transitionProgress.current >= 1) {
                transitionProgress.current = 1
                setIsTransitioning(false)
                warpSpeed.current = 0
                if (onTransitionComplete) onTransitionComplete()
            }

            const t = transitionProgress.current

            let eased, speed
            if (t < 0.15) {
                eased = Math.pow(t / 0.15, 2) * 0.15
                speed = Math.pow(t / 0.15, 3)
            } else if (t > 0.85) {
                const decel = (t - 0.85) / 0.15
                eased = 0.85 + decel * 0.15
                speed = Math.pow(1 - decel, 3)
            } else {
                eased = 0.15 + (t - 0.15) * 0.7 / 0.7
                speed = 1
            }

            warpSpeed.current = speed

            // Move camera position
            camera.position.lerpVectors(startPos.current, targetPos.current, eased)

            // Smoothly transition where camera is looking
            const currentLookTarget = new Vector3().lerpVectors(startLookAt.current, targetLookAt.current, eased)
            camera.lookAt(currentLookTarget)

            // Update shader
            if (warpTunnelRef.current) {
                warpShaderMaterial.uniforms.time.value = state.clock.elapsedTime
                warpShaderMaterial.uniforms.warpSpeed.value = speed
            }

            // Animate stars
            if (warpTunnelRef.current && warpTunnelRef.current.children[0]) {
                const starsGeometry = warpTunnelRef.current.children[0].geometry
                const posArray = starsGeometry.attributes.position.array

                for (let i = 0; i < starPositions.length; i += 3) {
                    posArray[i] -= starVelocities[i] * speed * 30
                    posArray[i + 1] -= starVelocities[i + 1] * speed * 30
                    posArray[i + 2] -= starVelocities[i + 2] * speed * 30

                    const dist = Math.sqrt(posArray[i] ** 2 + posArray[i + 1] ** 2 + posArray[i + 2] ** 2)
                    if (dist < 20) {
                        const radius = Math.random() * 150 + 30
                        const theta = Math.random() * Math.PI * 2
                        const phi = (Math.random() - 0.5) * Math.PI

                        posArray[i] = Math.cos(theta) * Math.cos(phi) * radius
                        posArray[i + 1] = Math.sin(phi) * radius
                        posArray[i + 2] = Math.sin(theta) * Math.cos(phi) * radius
                    }
                }

                starsGeometry.attributes.position.needsUpdate = true
            }
        }
    })

    return (
        <>
            {isTransitioning && (
                <group ref={warpTunnelRef}>
                    <points>
                        <bufferGeometry>
                            <bufferAttribute
                                attach="attributes-position"
                                count={starPositions.length / 3}
                                array={starPositions}
                                itemSize={3}
                            />
                            <bufferAttribute
                                attach="attributes-color"
                                count={starColors.length / 3}
                                array={starColors}
                                itemSize={3}
                            />
                            <bufferAttribute
                                attach="attributes-size"
                                count={starSizes.length}
                                array={starSizes}
                                itemSize={1}
                            />
                        </bufferGeometry>
                        <pointsMaterial
                            size={6}
                            sizeAttenuation={true}
                            vertexColors={true}
                            transparent
                            opacity={1}
                            blending={THREE.AdditiveBlending}
                        />
                    </points>

                    <mesh position={[0, 0, -50]}>
                        <cylinderGeometry args={[100, 100, 200, 64, 1, true]} rotation={[Math.PI / 2, 0, 0]} />
                        <primitive object={warpShaderMaterial} attach="material" />
                    </mesh>
                </group>
            )}
        </>
    )
}
