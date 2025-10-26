import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { shaderMaterial } from '@react-three/drei'
import { extend } from '@react-three/fiber'
import * as THREE from 'three'

// Custom shader for depth-based sizing and twinkling
const GalaxyMaterial = shaderMaterial(
  {
    time: 0,
    pixelRatio: 1,
  },
  // Vertex shader
  `
    uniform float time;
    uniform float pixelRatio;
    attribute vec3 color;
    attribute float twinkleSpeed;
    attribute float twinkleOffset;
    varying vec3 vColor;
    varying float vTwinkle;

    void main() {
      vColor = color;

      // Calculate distance from camera for depth-based sizing
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      float depth = -mvPosition.z;

      // Depth-based size: closer = larger, farther = smaller
      float depthFactor = 100.0 / depth;
      depthFactor = clamp(depthFactor, 0.3, 2.5);

      // Twinkling effect - subtle, random per particle
      float twinkle = sin(time * twinkleSpeed + twinkleOffset) * 0.5 + 0.5;
      twinkle = 0.7 + twinkle * 0.3; // Range: 0.7 to 1.0 for subtle effect
      vTwinkle = twinkle;

      // Much larger particles for realistic bright stars
      gl_PointSize = 16.0 * pixelRatio * depthFactor * twinkle;
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  // Fragment shader
  `
    varying vec3 vColor;
    varying float vTwinkle;

    void main() {
      // Circular particle shape
      vec2 center = gl_PointCoord - vec2(0.5);
      float dist = length(center);

      if (dist > 0.5) discard;

      // Bright, visible particles with realistic glow
      float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
      alpha *= 0.6 * vTwinkle; // Much brighter for realistic galaxy appearance

      gl_FragColor = vec4(vColor, alpha);
    }
  `
)

extend({ GalaxyMaterial })

export function GalaxyBackground({ count = 50000 }) {
  const points = useRef()
  const material = useRef()
  const starsRef = useRef()
  const dustRef = useRef()

  const parameters = {
    count: count,
    size: 0.01,
    radius: 80,
    branches: 2,              // Only 2 main arms like Milky Way/Andromeda
    spin: 1.2,                // Tight spiral (more realistic)
    randomness: 0.15,         // Less random, more structured
    randomnessPower: 2,
    innerGlow: 0.15,          // Bright core region
    armWidth: 0.3,            // Defined arm width
    // Hyper-realistic galaxy colors (based on actual galaxy photography)
    coreColor: '#fff9e6',     // Bright blue-white core (young hot stars)
    innerColor: '#ffd700',    // Golden inner region (older stars)
    armColor: '#87ceeb',      // Blue spiral arms (star formation regions)
    outerColor: '#ff6347',    // Reddish outer edges (older, cooler stars)
    dustColor: '#2c1810'      // Dark dust lanes
  }

  const [positions, colors, twinkleSpeeds, twinkleOffsets] = useMemo(() => {
    const positions = new Float32Array(parameters.count * 3)
    const colors = new Float32Array(parameters.count * 3)
    const twinkleSpeeds = new Float32Array(parameters.count)
    const twinkleOffsets = new Float32Array(parameters.count)

    for(let i = 0; i < parameters.count; i++) {
      const i3 = i * 3

      // HYPER-REALISTIC SPIRAL GALAXY STRUCTURE
      // Use exponential distribution for more particles near center (realistic)
      const radius = Math.pow(Math.random(), 1.5) * parameters.radius

      // Which spiral arm (2 main arms)
      const branchAngle = (i % parameters.branches) / parameters.branches * Math.PI * 2

      // Logarithmic spiral (like real galaxies!)
      // φ = a * ln(r) - creates natural spiral shape
      const spinAngle = radius * parameters.spin

      // Arm thickness - particles cluster along arms
      const armOffset = (Math.random() - 0.5) * parameters.armWidth * radius

      // Vertical distribution - thin disk with slight thickness
      const diskThickness = Math.pow(Math.random(), 3) * (radius * 0.08)
      const randomY = (Math.random() - 0.5) * diskThickness

      // Calculate position along spiral arm
      const angle = branchAngle + spinAngle
      const x = Math.cos(angle) * radius
      const z = Math.sin(angle) * radius

      // Add arm offset perpendicular to spiral
      const perpAngle = angle + Math.PI / 2
      const offsetX = Math.cos(perpAngle) * armOffset
      const offsetZ = Math.sin(perpAngle) * armOffset

      // Set positions
      positions[i3] = x + offsetX
      positions[i3 + 1] = randomY
      positions[i3 + 2] = z + offsetZ

      // REALISTIC COLOR GRADIENTS based on stellar populations
      const normalizedRadius = radius / parameters.radius

      if (normalizedRadius < 0.05) {
        // BRIGHT GALACTIC CORE - Blue-white (young massive stars)
        colors[i3] = 1.0      // R: bright white
        colors[i3 + 1] = 0.98  // G: slightly yellow
        colors[i3 + 2] = 0.90  // B: warm white
      } else if (normalizedRadius < 0.15) {
        // INNER BULGE - Golden/yellow (older Population II stars)
        colors[i3] = 1.0       // R: golden
        colors[i3 + 1] = 0.84  // G: yellow
        colors[i3 + 2] = 0.0   // B: no blue
      } else if (normalizedRadius < 0.5) {
        // SPIRAL ARMS - Blue (active star formation, young stars)
        colors[i3] = 0.53      // R: sky blue
        colors[i3 + 1] = 0.81  // G: bright
        colors[i3 + 2] = 0.92  // B: blue
      } else if (normalizedRadius < 0.8) {
        // OUTER DISK - Orange-red (older, cooler stars)
        colors[i3] = 1.0       // R: red-orange
        colors[i3 + 1] = 0.39  // G: orange
        colors[i3 + 2] = 0.28  // B: red
      } else {
        // FAR OUTER REGIONS - Deep red (old Population I stars)
        colors[i3] = 0.7       // R: dim red
        colors[i3 + 1] = 0.2   // G: very little
        colors[i3 + 2] = 0.2   // B: very little
      }

      // Twinkle attributes - slower for realism
      twinkleSpeeds[i] = 0.3 + Math.random() * 1.0
      twinkleOffsets[i] = Math.random() * Math.PI * 2
    }

    return [positions, colors, twinkleSpeeds, twinkleOffsets]
  }, [count, parameters.radius])
  
  useFrame((state) => {
    if (points.current) {
      // Subtle rotation for depth
      points.current.rotation.y = state.clock.elapsedTime * 0.005
      // Slight wobble for organic feel
      points.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.001) * 0.02
    }

    // Update shader time for twinkling
    if (material.current) {
      material.current.time = state.clock.elapsedTime
    }
  })

  return (
    <points
      ref={points}
      position={[0, -5, -30]}
      rotation={[Math.PI * 0.25, 0, 0]}  // Tilted 45 degrees for dramatic 3D view
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
          attach="attributes-twinkleSpeed"
          count={twinkleSpeeds.length}
          array={twinkleSpeeds}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-twinkleOffset"
          count={twinkleOffsets.length}
          array={twinkleOffsets}
          itemSize={1}
        />
      </bufferGeometry>
      <galaxyMaterial
        ref={material}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        pixelRatio={window.devicePixelRatio}
      />
    </points>
  )
}