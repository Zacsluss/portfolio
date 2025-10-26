import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function Starfield({ count = 5000, speed = 1.5 }) {
  const points = useRef()

  const [positions, sizes, colors] = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const sizes = new Float32Array(count)
    const colors = new Float32Array(count * 3)

    for(let i = 0; i < count; i++) {
      const i3 = i * 3

      // Random positions in 3D space (cylindrical distribution)
      const radius = Math.random() * 100
      const angle = Math.random() * Math.PI * 2

      positions[i3] = Math.cos(angle) * radius     // X
      positions[i3 + 1] = (Math.random() - 0.5) * 100  // Y
      positions[i3 + 2] = Math.random() * -200     // Z (all behind camera)

      // Star sizes - mostly small, some larger
      sizes[i] = Math.random() < 0.95 ? Math.random() * 2 : Math.random() * 4 + 2

      // Star colors - realistic white/blue-white with slight variation
      const starTemp = Math.random()
      if (starTemp < 0.8) {
        // White stars (most common)
        colors[i3] = 1.0
        colors[i3 + 1] = 1.0
        colors[i3 + 2] = 1.0
      } else if (starTemp < 0.95) {
        // Blue-white stars
        colors[i3] = 0.9
        colors[i3 + 1] = 0.95
        colors[i3 + 2] = 1.0
      } else {
        // Slightly yellow stars
        colors[i3] = 1.0
        colors[i3 + 1] = 0.95
        colors[i3 + 2] = 0.85
      }
    }

    return [positions, sizes, colors]
  }, [count])

  useFrame(() => {
    if (!points.current) return

    const posArray = points.current.geometry.attributes.position.array

    for(let i = 0; i < count; i++) {
      const i3 = i * 3

      // Move stars toward camera (Z axis)
      posArray[i3 + 2] += speed

      // Reset stars that pass the camera
      if (posArray[i3 + 2] > 5) {
        posArray[i3 + 2] = -200

        // Randomize position when resetting
        const radius = Math.random() * 100
        const angle = Math.random() * Math.PI * 2
        posArray[i3] = Math.cos(angle) * radius
        posArray[i3 + 1] = (Math.random() - 0.5) * 100
      }
    }

    points.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={count}
          array={sizes}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={2}
        sizeAttenuation={true}
        transparent={true}
        opacity={0.8}
        vertexColors={true}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}
