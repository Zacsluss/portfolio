import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function NeuralConnections({ particlePositions, particleCount, visible = true }) {
  const linesRef = useRef()
  const materialRef = useRef()

  // Create line geometry
  const { positions, colors } = useMemo(() => {
    const maxConnections = 3000 // Limit for performance
    const positions = new Float32Array(maxConnections * 6) // 2 points per line, 3 coords each
    const colors = new Float32Array(maxConnections * 6) // RGB for each vertex

    return { positions, colors }
  }, [])

  useFrame((state) => {
    if (!linesRef.current || !particlePositions || !visible) return

    const time = state.clock.elapsedTime
    const connectionDistance = 2.5 // Max distance to draw connections
    let lineIndex = 0
    const maxLines = 1000 // Max lines per frame for performance

    // Sample particles and create connections
    for (let i = 0; i < particleCount && lineIndex < maxLines; i += 5) { // Sample every 5th particle
      const i3 = i * 3
      const x1 = particlePositions[i3]
      const y1 = particlePositions[i3 + 1]
      const z1 = particlePositions[i3 + 2]

      // Check nearby particles
      for (let j = i + 5; j < particleCount && lineIndex < maxLines; j += 5) {
        const j3 = j * 3
        const x2 = particlePositions[j3]
        const y2 = particlePositions[j3 + 1]
        const z2 = particlePositions[j3 + 2]

        // Calculate distance
        const dx = x2 - x1
        const dy = y2 - y1
        const dz = z2 - z1
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)

        if (dist < connectionDistance) {
          const lineStart = lineIndex * 6

          // Set line positions
          positions[lineStart] = x1
          positions[lineStart + 1] = y1
          positions[lineStart + 2] = z1
          positions[lineStart + 3] = x2
          positions[lineStart + 4] = y2
          positions[lineStart + 5] = z2

          // Pulsing color based on time and distance
          const pulse = Math.sin(time * 2 + dist * 5) * 0.5 + 0.5
          const strength = 1.0 - (dist / connectionDistance)
          const alpha = strength * pulse * 0.3

          // Cyan color with alpha
          colors[lineStart] = 0.0 * alpha
          colors[lineStart + 1] = 1.0 * alpha
          colors[lineStart + 2] = 0.8 * alpha
          colors[lineStart + 3] = 0.0 * alpha
          colors[lineStart + 4] = 1.0 * alpha
          colors[lineStart + 5] = 0.8 * alpha

          lineIndex++
        }
      }
    }

    // Update geometry
    linesRef.current.geometry.attributes.position.needsUpdate = true
    linesRef.current.geometry.attributes.color.needsUpdate = true
    linesRef.current.geometry.setDrawRange(0, lineIndex * 2) // Only draw active lines

    // Pulse the opacity
    if (materialRef.current) {
      materialRef.current.opacity = 0.4 + Math.sin(time * 0.5) * 0.2
    }
  })

  if (!visible) return null

  return (
    <lineSegments ref={linesRef}>
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
      <lineBasicMaterial
        ref={materialRef}
        vertexColors
        transparent
        opacity={0.4}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </lineSegments>
  )
}
