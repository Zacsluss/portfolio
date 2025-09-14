import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function GalaxyBackground({ count = 50000 }) {
  const points = useRef()
  const starsRef = useRef()
  const dustRef = useRef()

  const parameters = {
    count: count,
    size: 0.01,
    radius: 50,
    branches: 5,
    spin: 0.3,
    randomness: 0.5,
    randomnessPower: 3,
    // Nebula colors inspired by Hubble images
    coreColor: '#ff69b4',     // Hot pink core (brighter)
    midColor: '#8a2be2',      // Blue violet mid-region (brighter)
    outerColor: '#4169e1',    // Royal blue outer (brighter)
    dustColor: '#ff1493'      // Deep pink dust clouds
  }
  
  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(parameters.count * 3)
    const colors = new Float32Array(parameters.count * 3)

    for(let i = 0; i < parameters.count; i++) {
      const i3 = i * 3

      // Spiral galaxy shape
      const radius = Math.random() * parameters.radius
      const branchAngle = (i % parameters.branches) / parameters.branches * Math.PI * 2
      const spinAngle = radius * parameters.spin

      // Add randomness
      const randomX = (Math.random() - 0.5) * radius * 0.3
      const randomY = (Math.random() - 0.5) * radius * 0.3
      const randomZ = (Math.random() - 0.5) * radius * 0.3

      // Set positions
      positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX
      positions[i3 + 1] = randomY
      positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ

      // Color gradient from center to edge
      const mixRatio = radius / parameters.radius

      // DRAMATIC gradient: Bright colors for testing
      if (mixRatio < 0.3) {
        // Inner 30% - BRIGHT HOT PINK
        colors[i3] = 1.0      // Full red
        colors[i3 + 1] = 0.0  // No green
        colors[i3 + 2] = 1.0  // Full blue = MAGENTA
      } else if (mixRatio < 0.6) {
        // Middle 30% - BRIGHT YELLOW
        colors[i3] = 1.0      // Full red
        colors[i3 + 1] = 1.0  // Full green
        colors[i3 + 2] = 0.0  // No blue = YELLOW
      } else {
        // Outer 40% - BRIGHT CYAN
        colors[i3] = 0.0      // No red
        colors[i3 + 1] = 1.0  // Full green
        colors[i3 + 2] = 1.0  // Full blue = CYAN
      }
    }

    return [positions, colors]
  }, [count, parameters.radius])
  
  useFrame((state) => {
    if (points.current) {
      // Subtle rotation for depth
      points.current.rotation.y = state.clock.elapsedTime * 0.005
      // Slight wobble for organic feel
      points.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.001) * 0.02
    }
  })
  
  return (
    <points ref={points}>
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
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        sizeAttenuation={true}
        depthWrite={false}
        vertexColors={true}
        blending={THREE.AdditiveBlending}
        transparent={true}
        opacity={1}
      />
    </points>
  )
}