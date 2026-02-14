import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function Singularity() {
  const meshRef = useRef()

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z += 0.01
    }
  })

  return (
    <mesh ref={meshRef} position={[0, 0, -10]}>
      <sphereGeometry args={[2, 32, 32]} />
      <meshBasicMaterial color="white" />
    </mesh>
  )
}
