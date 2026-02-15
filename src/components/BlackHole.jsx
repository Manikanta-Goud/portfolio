import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function BlackHole() {
    const groupRef = useRef()
    const accretionDiskRef = useRef()
    const photonRingRef = useRef()
    const lensingRef = useRef()

    // 1. Accretion Disk Shader
    const accretionMaterial = useMemo(() => {
        return new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                diffuse: { value: new THREE.Color(0xffffff) },
                opacity: { value: 1.0 }
            },
            vertexShader: `
        varying vec2 vUv;
        varying vec3 vPosition;
        void main() {
          vUv = uv;
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
            fragmentShader: `
        uniform float time;
        varying vec2 vUv;
        varying vec3 vPosition;
        
        void main() {
          float dist = length(vUv - 0.5);
          float angle = atan(vUv.y - 0.5, vUv.x - 0.5);
          float spiral = angle + dist * 12.0 - time * 0.8;
          
          vec3 innerColor = vec3(1.0, 0.98, 0.9); 
          vec3 midColor = vec3(1.0, 0.5, 0.1); 
          vec3 outerColor = vec3(0.5, 0.1, 0.05); 
          
          vec3 color;
          if (dist < 0.25) {
            color = mix(innerColor, midColor, dist / 0.25);
          } else {
            color = mix(midColor, outerColor, (dist - 0.25) / 0.25);
          }
          
          float turbulence = sin(spiral * 8.0 + dist * 20.0) * 0.4 + 0.6;
          color *= 0.8 + turbulence * 0.3;
          
          float alpha = smoothstep(0.5, 0.4, dist) * smoothstep(0.15, 0.2, dist);
          
          gl_FragColor = vec4(color, alpha);
        }
      `,
            transparent: true,
            side: THREE.DoubleSide,
            blending: THREE.AdditiveBlending,
            fog: false,
            lights: false
        })
    }, [])

    // 2. Gravitational Lensing Shader (Simulated warping)
    const lensingMaterial = useMemo(() => {
        return new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                color: { value: new THREE.Color('#ff8833') },
                diffuse: { value: new THREE.Color(0xffffff) },
                opacity: { value: 1.0 }
            },
            vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        void main() {
          vUv = uv;
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
            fragmentShader: `
        uniform float time;
        uniform vec3 color;
        varying vec2 vUv;
        varying vec3 vNormal;
        void main() {
          float fresnel = pow(1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.0);
          float dist = length(vUv - 0.5);
          
          // Warp effect intensity
          float warp = sin(dist * 20.0 - time) * 0.5 + 0.5;
          float alpha = fresnel * 0.15 * warp;
          
          gl_FragColor = vec4(color, alpha);
        }
      `,
            transparent: true,
            side: THREE.BackSide,
            blending: THREE.AdditiveBlending,
            fog: false,
            lights: false
        })
    }, [])

    useFrame((state) => {
        const t = state.clock.getElapsedTime()
        accretionMaterial.uniforms.time.value = t
        lensingMaterial.uniforms.time.value = t

        if (accretionDiskRef.current) accretionDiskRef.current.rotation.z = t * 0.2
        if (photonRingRef.current) photonRingRef.current.scale.setScalar(1 + Math.sin(t * 2) * 0.03)
        if (lensingRef.current) lensingRef.current.rotation.y = t * 0.1
    })

    return (
        <group ref={groupRef} position={[0, 0, 0]}>
            {/* 1. Singularity Core */}
            <mesh>
                <sphereGeometry args={[2.0, 64, 64]} />
                <meshBasicMaterial color="#000000" />
            </mesh>

            {/* 2. Photon Ring (Einstein Ring) */}
            <mesh ref={photonRingRef}>
                <sphereGeometry args={[2.15, 64, 64]} />
                <meshBasicMaterial
                    color="#ffffff"
                    transparent
                    opacity={0.8}
                    side={THREE.BackSide}
                    blending={THREE.AdditiveBlending}
                />
            </mesh>

            {/* 3. Accretion Disk Layers */}
            <group ref={accretionDiskRef}>
                <mesh rotation={[Math.PI / 2.1, 0, 0]}>
                    <ringGeometry args={[2.3, 14, 128]} />
                    <primitive object={accretionMaterial} />
                </mesh>

                {/* Glowing Dust Layer */}
                <mesh rotation={[Math.PI / 2.1, 0.1, 0]}>
                    <ringGeometry args={[2.3, 8, 128]} />
                    <meshBasicMaterial
                        color="#ffaa44"
                        transparent
                        opacity={0.2}
                        side={THREE.DoubleSide}
                        blending={THREE.AdditiveBlending}
                    />
                </mesh>
            </group>

            {/* 4. Gravitational Lensing Bubble */}
            <mesh ref={lensingRef}>
                <sphereGeometry args={[7, 64, 64]} />
                <primitive object={lensingMaterial} />
            </mesh>

            {/* 5. Volumetric Glow Halos */}
            {[5, 9, 13].map((size, i) => (
                <mesh key={size}>
                    <sphereGeometry args={[size, 64, 64]} />
                    <meshBasicMaterial
                        color="#ff8833"
                        transparent
                        opacity={0.1 / (i + 1)}
                        side={THREE.BackSide}
                        blending={THREE.AdditiveBlending}
                    />
                </mesh>
            ))}

            <pointLight position={[0, 0, 0]} intensity={8} color="#ffaa44" distance={60} decay={1.5} />
        </group>
    )
}
