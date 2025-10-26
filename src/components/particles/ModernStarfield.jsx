import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { shaderMaterial } from '@react-three/drei'
import { extend } from '@react-three/fiber'
import * as THREE from 'three'

// Modern shader with motion blur, bokeh, and depth effects
const StarfieldMaterial = shaderMaterial(
  {
    time: 0,
    speed: 2.0,
  },
  // Vertex shader
  `
    uniform float time;
    uniform float speed;
    attribute float size;
    attribute float brightness;
    varying float vBrightness;
    varying float vDistance;

    void main() {
      vBrightness = brightness;

      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      vDistance = -mvPosition.z;

      // Size based on distance for depth of field
      float depthScale = 300.0 / vDistance;
      depthScale = clamp(depthScale, 0.1, 5.0);

      gl_PointSize = size * depthScale;
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  // Fragment shader - creates bokeh and glow
  `
    varying float vBrightness;
    varying float vDistance;

    void main() {
      vec2 center = gl_PointCoord - vec2(0.5);
      float dist = length(center);

      if (dist > 0.5) discard;

      // Bokeh hexagon shape for distant stars
      float bokeh = 1.0;
      if (vDistance > 100.0) {
        float angle = atan(center.y, center.x);
        float hexDist = cos(floor(0.5 + angle / 1.047) * 1.047 - angle) * dist;
        bokeh = smoothstep(0.5, 0.4, hexDist);
      }

      // Soft glow falloff
      float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
      alpha = pow(alpha, 1.5) * bokeh;

      // Brightness varies by star
      alpha *= vBrightness;

      // Subtle blue tint for distant stars
      vec3 color = vec3(1.0);
      if (vDistance > 150.0) {
        color = vec3(0.9, 0.95, 1.0); // Blue-white
      }

      gl_FragColor = vec4(color, alpha);
    }
  `
)

extend({ StarfieldMaterial })

export function ModernStarfield({ count = 10000, speed = 2.0 }) {
  const starsRef = useRef()
  const streaksRef = useRef()
  const material = useRef()
  const { camera } = useThree()
  const travelDirection = useRef(new THREE.Vector3(0, 0, 1))

  // Stars with varying sizes and brightness - SPHERICAL distribution for full coverage
  const [starPositions, starSizes, starBrightness] = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const sizes = new Float32Array(count)
    const brightness = new Float32Array(count)

    for(let i = 0; i < count; i++) {
      const i3 = i * 3

      // Windows Starfield style: Empty center void + edge density bias
      // Use power distribution to push more stars to edges
      const radiusRoll = Math.pow(Math.random(), 0.5)  // Bias toward outer edges
      const radius = 100 + radiusRoll * 200  // 100 to 300 units - NO stars in center 100 units

      const theta = Math.random() * Math.PI * 2  // Horizontal angle (0 to 360°)
      const phi = Math.acos(2 * Math.random() - 1)  // Vertical angle (proper sphere distribution)

      // Convert spherical to cartesian coordinates (relative to camera)
      positions[i3] = camera.position.x + radius * Math.sin(phi) * Math.cos(theta)
      positions[i3 + 1] = camera.position.y + radius * Math.sin(phi) * Math.sin(theta)
      positions[i3 + 2] = camera.position.z + radius * Math.cos(phi)

      // Varied star sizes (mostly very small)
      const sizeRoll = Math.random()
      if (sizeRoll < 0.7) {
        sizes[i] = 1.0 + Math.random() * 1.0  // Tiny stars
      } else if (sizeRoll < 0.95) {
        sizes[i] = 2.0 + Math.random() * 2.0  // Medium stars
      } else {
        sizes[i] = 4.0 + Math.random() * 3.0  // Bright stars
      }

      // Brightness variation - brighter at edges
      brightness[i] = 0.3 + Math.random() * 0.7
    }

    return [positions, sizes, brightness]
  }, [count])

  // Motion streak lines for close stars
  const [streakPositions, streakOpacity] = useMemo(() => {
    const streakCount = 200
    const positions = new Float32Array(streakCount * 6) // 2 points per line
    const opacity = new Float32Array(streakCount)

    for(let i = 0; i < streakCount; i++) {
      const i6 = i * 6

      const radius = Math.random() * 80
      const angle = Math.random() * Math.PI * 2
      const x = Math.cos(angle) * radius
      const y = (Math.random() - 0.5) * 80
      const z = Math.random() * -100

      // Start point
      positions[i6] = x
      positions[i6 + 1] = y
      positions[i6 + 2] = z

      // End point (longer streak = closer to camera)
      const streakLength = 5 + Math.random() * 10
      positions[i6 + 3] = x
      positions[i6 + 4] = y
      positions[i6 + 5] = z - streakLength

      opacity[i] = 0.2 + Math.random() * 0.5
    }

    return [positions, opacity]
  }, [])

  useFrame((state) => {
    if (!starsRef.current) return

    // Get camera view direction (where camera is looking)
    const viewDirection = new THREE.Vector3()
    camera.getWorldDirection(viewDirection)

    // Stars move OPPOSITE to view direction (creating forward motion illusion)
    const moveDirection = viewDirection.clone().multiplyScalar(-speed)

    const posArray = starsRef.current.geometry.attributes.position.array

    // Move stars relative to camera in world space
    for(let i = 0; i < count; i++) {
      const i3 = i * 3

      // Move star in opposite direction of view
      posArray[i3] += moveDirection.x
      posArray[i3 + 1] += moveDirection.y
      posArray[i3 + 2] += moveDirection.z

      // Calculate star position relative to camera
      const relX = posArray[i3] - camera.position.x
      const relY = posArray[i3 + 1] - camera.position.y
      const relZ = posArray[i3 + 2] - camera.position.z

      // Distance from camera
      const distSq = relX*relX + relY*relY + relZ*relZ

      // Check if star is behind camera (dot product with view direction)
      const dotProduct = relX * viewDirection.x + relY * viewDirection.y + relZ * viewDirection.z

      // Recycle if too far OR behind camera (NO close distance check - let them pass by)
      if (distSq > 100000 || dotProduct < -50) {
        // Spawn in RING/DONUT shape - NOT in center cone!
        // This prevents stars from appearing in dead center of view

        const spawnDistanceAhead = 200 + Math.random() * 100  // 200-300 units ahead

        // Create wide cone for coverage
        const spreadTheta = Math.random() * Math.PI * 2  // Full 360°

        // KEY FIX: Use MINIMUM angle to create donut hole in center
        // Reduce forbidden cone by 90% again: from 2° to 0.2°
        const minAngle = 0.0035  // 0.2 degrees in radians - tiny center void
        const maxAngle = Math.PI * 0.75  // 135 degrees

        // Use UNIFORM SPATIAL distribution (not uniform angle distribution)
        // This prevents clustering at small angles
        const minCos = Math.cos(maxAngle)  // cos of max angle
        const maxCos = Math.cos(minAngle)  // cos of min angle
        const cosTheta = minCos + Math.random() * (maxCos - minCos)
        const spreadPhi = Math.acos(cosTheta)

        // Create perpendicular vectors to view direction
        const up = new THREE.Vector3(0, 1, 0)
        const right = new THREE.Vector3().crossVectors(viewDirection, up).normalize()
        const actualUp = new THREE.Vector3().crossVectors(right, viewDirection).normalize()

        // Calculate lateral spread from center axis
        const lateralDistance = spawnDistanceAhead * Math.tan(spreadPhi)
        const offsetX = lateralDistance * Math.cos(spreadTheta)
        const offsetY = lateralDistance * Math.sin(spreadTheta)

        // Spawn star in RING around view axis (never in center cone)
        posArray[i3] = camera.position.x + viewDirection.x * spawnDistanceAhead +
                       right.x * offsetX + actualUp.x * offsetY

        posArray[i3 + 1] = camera.position.y + viewDirection.y * spawnDistanceAhead +
                           right.y * offsetX + actualUp.y * offsetY

        posArray[i3 + 2] = camera.position.z + viewDirection.z * spawnDistanceAhead +
                           right.z * offsetX + actualUp.z * offsetY
      }
    }

    starsRef.current.geometry.attributes.position.needsUpdate = true

    // Move streak lines
    if (streaksRef.current) {
      const streakArray = streaksRef.current.geometry.attributes.position.array
      const streakCount = 200
      const streakSpeed = speed * 1.5

      for(let i = 0; i < streakCount; i++) {
        const i6 = i * 6

        // Move both points of the line
        streakArray[i6] += moveDirection.x * (streakSpeed / speed)
        streakArray[i6 + 1] += moveDirection.y * (streakSpeed / speed)
        streakArray[i6 + 2] += moveDirection.z * (streakSpeed / speed)

        streakArray[i6 + 3] += moveDirection.x * (streakSpeed / speed)
        streakArray[i6 + 4] += moveDirection.y * (streakSpeed / speed)
        streakArray[i6 + 5] += moveDirection.z * (streakSpeed / speed)

        // Check position relative to camera
        const relX = streakArray[i6] - camera.position.x
        const relY = streakArray[i6 + 1] - camera.position.y
        const relZ = streakArray[i6 + 2] - camera.position.z
        const distSq = relX*relX + relY*relY + relZ*relZ

        const dotProduct = relX * viewDirection.x + relY * viewDirection.y + relZ * viewDirection.z

        // Recycle if too far or behind camera
        if (distSq > 50000 || dotProduct < -30) {
          const spawnDistance = 120 + Math.random() * 30
          const spreadAngle = Math.random() * Math.PI * 2
          const spreadRadius = Math.random() * 60

          // Use same perpendicular vectors
          const up = new THREE.Vector3(0, 1, 0)
          const right = new THREE.Vector3().crossVectors(viewDirection, up).normalize()
          const actualUp = new THREE.Vector3().crossVectors(right, viewDirection).normalize()

          // Start point
          const x = camera.position.x + viewDirection.x * spawnDistance +
                    right.x * Math.cos(spreadAngle) * spreadRadius +
                    actualUp.x * Math.sin(spreadAngle) * spreadRadius

          const y = camera.position.y + viewDirection.y * spawnDistance +
                    right.y * Math.cos(spreadAngle) * spreadRadius +
                    actualUp.y * Math.sin(spreadAngle) * spreadRadius

          const z = camera.position.z + viewDirection.z * spawnDistance +
                    right.z * Math.cos(spreadAngle) * spreadRadius +
                    actualUp.z * Math.sin(spreadAngle) * spreadRadius

          streakArray[i6] = x
          streakArray[i6 + 1] = y
          streakArray[i6 + 2] = z

          // End point (streak aligned with view direction)
          const streakLength = 5 + Math.random() * 10
          streakArray[i6 + 3] = x + viewDirection.x * streakLength
          streakArray[i6 + 4] = y + viewDirection.y * streakLength
          streakArray[i6 + 5] = z + viewDirection.z * streakLength
        }
      }

      streaksRef.current.geometry.attributes.position.needsUpdate = true
    }

    // Update shader time
    if (material.current) {
      material.current.time = state.clock.elapsedTime
    }
  })

  return (
    <group>
      {/* Main stars with bokeh effect */}
      <points ref={starsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={count}
            array={starPositions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-size"
            count={count}
            array={starSizes}
            itemSize={1}
          />
          <bufferAttribute
            attach="attributes-brightness"
            count={count}
            array={starBrightness}
            itemSize={1}
          />
        </bufferGeometry>
        <starfieldMaterial
          ref={material}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          speed={speed}
        />
      </points>

      {/* Motion blur streaks for nearby stars */}
      <lineSegments ref={streaksRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={200 * 2}
            array={streakPositions}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>
    </group>
  )
}
