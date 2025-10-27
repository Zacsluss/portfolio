import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { shaderMaterial } from '@react-three/drei'
import { extend } from '@react-three/fiber'
import * as THREE from 'three'

// Enhanced shader with realistic star colors, twinkling, and chromatic aberration
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
    attribute float colorTemp; // Star color temperature
    attribute float twinklePhase; // Random phase for twinkling
    varying float vBrightness;
    varying float vDistance;
    varying float vColorTemp;
    varying float vTwinkle;

    void main() {
      vBrightness = brightness;
      vColorTemp = colorTemp;

      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      vDistance = -mvPosition.z;

      // Twinkling effect - stars shimmer over time
      vTwinkle = 0.7 + 0.3 * sin(time * (2.0 + twinklePhase) + twinklePhase * 100.0);

      // Size based on distance for depth of field
      float depthScale = 300.0 / vDistance;
      depthScale = clamp(depthScale, 0.1, 5.0);

      gl_PointSize = size * depthScale * vTwinkle;
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  // Fragment shader - creates bokeh, glow, and realistic colors
  `
    uniform float time;
    varying float vBrightness;
    varying float vDistance;
    varying float vColorTemp;
    varying float vTwinkle;

    // Convert color temperature to RGB (black body radiation)
    vec3 temperatureToColor(float temp) {
      // temp: 0.0 = cool blue, 0.5 = white, 1.0 = red giant
      if (temp < 0.33) {
        // Blue-white stars (hot)
        return mix(vec3(0.7, 0.8, 1.0), vec3(0.95, 0.95, 1.0), temp / 0.33);
      } else if (temp < 0.66) {
        // White-yellow stars (medium)
        return mix(vec3(0.95, 0.95, 1.0), vec3(1.0, 0.95, 0.8), (temp - 0.33) / 0.33);
      } else {
        // Yellow-red stars (cool)
        return mix(vec3(1.0, 0.95, 0.8), vec3(1.0, 0.7, 0.5), (temp - 0.66) / 0.34);
      }
    }

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

      // Soft glow falloff with enhanced bloom
      float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
      alpha = pow(alpha, 1.2) * bokeh;

      // Apply twinkling to brightness
      alpha *= vBrightness * vTwinkle;

      // Realistic star color based on temperature
      vec3 color = temperatureToColor(vColorTemp);

      // Chromatic aberration for bright close stars (lens effect)
      if (vDistance < 80.0 && vBrightness > 0.7) {
        float aberration = 0.02;
        vec2 redOffset = center * (1.0 + aberration);
        vec2 blueOffset = center * (1.0 - aberration);

        float redDist = length(redOffset);
        float blueDist = length(blueOffset);

        vec3 aberratedColor;
        aberratedColor.r = color.r * (1.0 - smoothstep(0.0, 0.5, redDist));
        aberratedColor.g = color.g * (1.0 - smoothstep(0.0, 0.5, dist));
        aberratedColor.b = color.b * (1.0 - smoothstep(0.0, 0.5, blueDist));

        color = mix(color, aberratedColor, 0.3);
      }

      // Distance-based color shift (atmospheric perspective)
      if (vDistance > 150.0) {
        color = mix(color, vec3(0.8, 0.85, 1.0), 0.2);
      }

      gl_FragColor = vec4(color, alpha);
    }
  `
)

extend({ StarfieldMaterial })

// Nebula background shader for atmospheric depth
const NebulaMaterial = shaderMaterial(
  {
    time: 0,
    color1: new THREE.Color(0.05, 0.0, 0.15), // Deep purple
    color2: new THREE.Color(0.0, 0.1, 0.2),   // Dark blue
    color3: new THREE.Color(0.15, 0.0, 0.1),  // Dark magenta
  },
  // Vertex shader
  `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment shader - creates moving nebula clouds
  `
    uniform float time;
    uniform vec3 color1;
    uniform vec3 color2;
    uniform vec3 color3;
    varying vec2 vUv;

    // Simple noise function
    float noise(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
    }

    float smoothNoise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);

      float a = noise(i);
      float b = noise(i + vec2(1.0, 0.0));
      float c = noise(i + vec2(0.0, 1.0));
      float d = noise(i + vec2(1.0, 1.0));

      return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
    }

    float fractalNoise(vec2 p) {
      float value = 0.0;
      float amplitude = 0.5;
      for (int i = 0; i < 4; i++) {
        value += smoothNoise(p) * amplitude;
        p *= 2.0;
        amplitude *= 0.5;
      }
      return value;
    }

    void main() {
      vec2 uv = vUv * 2.0 - 1.0;

      // Multiple layers of noise moving at different speeds
      float noise1 = fractalNoise(vUv * 3.0 + time * 0.02);
      float noise2 = fractalNoise(vUv * 5.0 - time * 0.03);
      float noise3 = fractalNoise(vUv * 7.0 + time * 0.01);

      // Combine noise layers
      float combinedNoise = (noise1 + noise2 + noise3) / 3.0;

      // Create color variation
      vec3 nebulaColor = mix(color1, color2, noise1);
      nebulaColor = mix(nebulaColor, color3, noise2);

      // Radial falloff from center for depth
      float distFromCenter = length(uv);
      float radialMask = 1.0 - smoothstep(0.0, 1.5, distFromCenter);

      float alpha = combinedNoise * 0.15 * radialMask;

      gl_FragColor = vec4(nebulaColor, alpha);
    }
  `
)

extend({ NebulaMaterial })

export function ModernStarfield({ count = 10000, speed = 2.0 }) {
  const starsRef = useRef()
  const streaksRef = useRef()
  const material = useRef()
  const nebulaMaterial = useRef()
  const { camera } = useThree()

  // Stars with varying sizes, brightness, colors, and twinkle - SPHERICAL distribution for full coverage
  const [starPositions, starSizes, starBrightness, starColorTemp, starTwinklePhase] = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const sizes = new Float32Array(count)
    const brightness = new Float32Array(count)
    const colorTemp = new Float32Array(count)
    const twinklePhase = new Float32Array(count)

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

      // Realistic star color distribution (most stars are white/yellow)
      const colorRoll = Math.random()
      if (colorRoll < 0.15) {
        // 15% blue-white (hot stars)
        colorTemp[i] = Math.random() * 0.3
      } else if (colorRoll < 0.80) {
        // 65% white-yellow (main sequence like our sun)
        colorTemp[i] = 0.3 + Math.random() * 0.36
      } else {
        // 20% yellow-red (cool stars, red giants)
        colorTemp[i] = 0.66 + Math.random() * 0.34
      }

      // Random phase for twinkling (makes each star twinkle at different times)
      twinklePhase[i] = Math.random() * Math.PI * 2
    }

    return [positions, sizes, brightness, colorTemp, twinklePhase]
  }, [count, camera.position.x, camera.position.y, camera.position.z])

  // Motion streak lines for close stars
  const [streakPositions] = useMemo(() => {
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

    // Update nebula time
    if (nebulaMaterial.current) {
      nebulaMaterial.current.time = state.clock.elapsedTime
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
          <bufferAttribute
            attach="attributes-colorTemp"
            count={count}
            array={starColorTemp}
            itemSize={1}
          />
          <bufferAttribute
            attach="attributes-twinklePhase"
            count={count}
            array={starTwinklePhase}
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

      {/* Nebula background clouds for atmospheric depth */}
      <mesh position={[0, 0, -250]} scale={[300, 300, 1]}>
        <planeGeometry args={[1, 1, 1, 1]} />
        <nebulaMaterial
          ref={nebulaMaterial}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  )
}
