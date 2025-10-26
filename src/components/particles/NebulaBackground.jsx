import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { shaderMaterial } from '@react-three/drei'
import { extend } from '@react-three/fiber'
import * as THREE from 'three'

// Custom shader for flowing nebula effect
const NebulaMaterial = shaderMaterial(
  {
    time: 0,
    pixelRatio: 1,
  },
  // Vertex shader - creates flowing movement
  `
    uniform float time;
    uniform float pixelRatio;
    attribute vec3 color;
    attribute float size;
    attribute vec3 velocity;
    varying vec3 vColor;
    varying float vAlpha;

    void main() {
      vColor = color;

      // Flow movement - particles drift through space
      vec3 pos = position;
      pos += velocity * time * 0.5;

      // Add gentle wave motion for organic feel
      pos.x += sin(time * 0.3 + position.y * 0.1) * 2.0;
      pos.y += cos(time * 0.2 + position.z * 0.1) * 2.0;
      pos.z += sin(time * 0.25 + position.x * 0.1) * 2.0;

      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      float depth = -mvPosition.z;

      // Depth-based sizing for 3D effect
      float depthFactor = 150.0 / depth;
      depthFactor = clamp(depthFactor, 0.5, 3.0);

      // Larger, softer particles for nebula clouds
      gl_PointSize = size * pixelRatio * depthFactor;
      gl_Position = projectionMatrix * mvPosition;

      // Fade particles based on depth
      vAlpha = clamp(depthFactor * 0.4, 0.1, 1.0);
    }
  `,
  // Fragment shader - creates soft, glowing clouds
  `
    varying vec3 vColor;
    varying float vAlpha;

    void main() {
      // Soft circular cloud shape
      vec2 center = gl_PointCoord - vec2(0.5);
      float dist = length(center);

      if (dist > 0.5) discard;

      // Very soft falloff for cloud-like appearance
      float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
      alpha = pow(alpha, 1.5); // Softer edges
      alpha *= vAlpha;

      gl_FragColor = vec4(vColor, alpha);
    }
  `
)

extend({ NebulaMaterial })

export function NebulaBackground({ count = 50000 }) {
  const points = useRef()
  const material = useRef()

  const [positions, colors, sizes, velocities] = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const sizes = new Float32Array(count)
    const velocities = new Float32Array(count * 3)

    // Nebula color palette - inspired by Orion, Eagle, Pillars of Creation
    const nebulaColors = [
      { r: 0.4, g: 0.1, b: 0.8, weight: 0.25 },  // Deep purple
      { r: 0.1, g: 0.3, b: 1.0, weight: 0.25 },  // Electric blue
      { r: 1.0, g: 0.2, b: 0.5, weight: 0.2 },   // Hot pink/magenta
      { r: 0.0, g: 0.8, b: 0.9, weight: 0.15 },  // Cyan
      { r: 1.0, g: 0.5, b: 0.1, weight: 0.15 },  // Orange glow
    ]

    for(let i = 0; i < count; i++) {
      const i3 = i * 3

      // Create billowing cloud formations
      const angle = Math.random() * Math.PI * 2
      const radius = Math.pow(Math.random(), 0.7) * 100 // More particles in center

      // 3D cloud positioning with depth
      positions[i3] = Math.cos(angle) * radius + (Math.random() - 0.5) * 50
      positions[i3 + 1] = (Math.random() - 0.5) * 60 // Vertical spread
      positions[i3 + 2] = Math.sin(angle) * radius + (Math.random() - 0.5) * 80 - 40

      // Random slow velocities for drifting effect
      velocities[i3] = (Math.random() - 0.5) * 0.2
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.2
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.2

      // Select color from palette with weighted randomness
      let colorRoll = Math.random()
      let selectedColor = nebulaColors[0]
      let cumWeight = 0

      for(let c of nebulaColors) {
        cumWeight += c.weight
        if(colorRoll <= cumWeight) {
          selectedColor = c
          break
        }
      }

      // Add variation to selected color
      colors[i3] = selectedColor.r + (Math.random() - 0.5) * 0.2
      colors[i3 + 1] = selectedColor.g + (Math.random() - 0.5) * 0.2
      colors[i3 + 2] = selectedColor.b + (Math.random() - 0.5) * 0.2

      // Varied sizes for cloud depth
      sizes[i] = 10 + Math.random() * 30 // Large, soft particles
    }

    return [positions, colors, sizes, velocities]
  }, [count])

  useFrame((state) => {
    if (points.current) {
      // Very slow rotation for drift effect
      points.current.rotation.y = state.clock.elapsedTime * 0.01
      points.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.005) * 0.05
    }

    // Update shader time for flowing animation
    if (material.current) {
      material.current.time = state.clock.elapsedTime
    }
  })

  return (
    <points
      ref={points}
      position={[0, 0, -40]}
      rotation={[0, 0, 0]}
    >
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
        <bufferAttribute
          attach="attributes-velocity"
          count={velocities.length / 3}
          array={velocities}
          itemSize={3}
        />
      </bufferGeometry>
      <nebulaMaterial
        ref={material}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        pixelRatio={window.devicePixelRatio}
      />
    </points>
  )
}
